import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInAnonymously,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc,
  getDocFromServer,
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  getDocs,
  Unsubscribe 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { logger } from './logger';
import { StudyNote, UserProfile, ComplaintTicket } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function cleanFirestoreData<T extends Record<string, any>>(data: T): Partial<T> {
  const result: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  logger.error('Firebase', `Firestore Operation Failed [${operationType}] at ${path}:`, errInfo);
  throw new Error(JSON.stringify(errInfo));
}

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// CRITICAL: Database initialized with custom firestoreDatabaseId from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Authentication Helpers
export async function signInWithGoogle(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    logger.info('Auth', `User signed in with Google: ${result.user.email}`);
    return result.user;
  } catch (error: any) {
    logger.warn('Auth', 'Failed to sign in with Google (popup may be blocked in iframe):', error);
    throw error;
  }
}

export async function signUpWithEmail(
  email: string, 
  password: string, 
  displayName: string, 
  classPreference: string = 'Class 10'
): Promise<FirebaseUser> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (displayName) {
      await updateProfile(cred.user, { displayName: displayName.trim() });
    }
    await syncUserProfile(cred.user, classPreference, true);
    logger.info('Auth', `User signed up with email: ${email}`);
    return cred.user;
  } catch (error: any) {
    logger.warn('Auth', 'Sign-up with email failed:', error);
    throw error;
  }
}

export async function signInWithEmail(email: string, password: string): Promise<FirebaseUser> {
  const cleanEmail = email.trim();
  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
    logger.info('Auth', `User signed in with email: ${cleanEmail}`);
    return cred.user;
  } catch (error: any) {
    // If admin email with requested password does not exist yet, auto-create and sign in
    if (
      cleanEmail.toLowerCase() === 'gautamankur0101@gmail.com' &&
      password === 'Zeenews@123' &&
      (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential')
    ) {
      try {
        const createCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        await updateProfile(createCred.user, { displayName: 'Ankur Gautam (Admin)' });
        await syncUserProfile(createCred.user, 'Class 12', true);
        logger.info('Auth', `Admin account auto-created and signed in for ${cleanEmail}`);
        return createCred.user;
      } catch (createErr: any) {
        if (createErr.code === 'auth/email-already-in-use') {
          // In case of race condition
          const retryCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
          return retryCred.user;
        }
        logger.warn('Auth', 'Failed auto-creating admin account:', createErr);
      }
    }
    logger.warn('Auth', 'Sign-in with email failed:', error);
    throw error;
  }
}

export async function loginAdminDirectly(): Promise<FirebaseUser> {
  return signInWithEmail('gautamankur0101@gmail.com', 'Zeenews@123');
}

export async function signInAsGuestStudent(
  studentName: string = 'Student Scholar', 
  classPreference: string = 'Class 10'
): Promise<FirebaseUser> {
  try {
    const cred = await signInAnonymously(auth);
    if (studentName) {
      await updateProfile(cred.user, { displayName: studentName.trim() });
    }
    await syncUserProfile(cred.user, classPreference, true);
    logger.info('Auth', `Guest student signed in: ${cred.user.uid}`);
    return cred.user;
  } catch (error: any) {
    logger.warn('Auth', 'Guest student sign-in fallback:', error);
    throw error;
  }
}

export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
    logger.info('Auth', 'User logged out successfully');
  } catch (error) {
    logger.error('Auth', 'Failed to sign out', error);
    throw error;
  }
}

// User Profile Operations
export async function syncUserProfile(user: FirebaseUser, classPreference?: string, acceptedTerms?: boolean): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const now = new Date().toISOString();
  const normalizedEmail = (user.email || '').toLowerCase();
  const isAdminEmail = normalizedEmail === 'brainyyybuzz@gmail.com' || normalizedEmail === 'gautamankur0101@gmail.com';

  try {
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      const initialProfile: Record<string, any> = {
        id: user.uid,
        displayName: user.displayName || user.email?.split('@')[0] || 'Student',
        email: user.email || '',
        photoURL: user.photoURL || '',
        role: isAdminEmail ? 'admin' : 'student',
        classPreference: classPreference || 'Class 10',
        className: classPreference || 'Class 10',
        acceptedTerms: acceptedTerms ?? false,
        createdAt: now,
        updatedAt: now,
      };
      if (acceptedTerms) {
        initialProfile.onboardedAt = now;
      }
      const cleaned = cleanFirestoreData(initialProfile);
      await setDoc(userRef, cleaned);
      logger.info('User', `Created profile for ${user.email}`);
      return cleaned as UserProfile;
    } else {
      const existing = userDoc.data() as UserProfile;
      const updates: Record<string, any> = {
        displayName: user.displayName || existing.displayName,
        photoURL: user.photoURL || existing.photoURL,
        updatedAt: now,
      };
      if (classPreference) {
        updates.classPreference = classPreference;
        updates.className = classPreference;
      }
      if (acceptedTerms !== undefined) {
        updates.acceptedTerms = acceptedTerms;
        if (acceptedTerms && !existing.onboardedAt) {
          updates.onboardedAt = now;
        }
      }
      if (isAdminEmail && existing.role !== 'admin') {
        updates.role = 'admin';
      }
      const cleanedUpdates = cleanFirestoreData(updates);
      await updateDoc(userRef, cleanedUpdates);
      return { ...existing, ...cleanedUpdates };
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    throw error;
  }
}

export async function updateStudentProfile(
  userId: string,
  details: {
    displayName?: string;
    classPreference?: string;
    className?: string;
    age?: number | string;
    sex?: string;
    mobileNumber?: string;
    email?: string;
    targetExam?: string;
    acceptedTerms?: boolean;
  }
): Promise<UserProfile> {
  const userRef = doc(db, 'users', userId);
  const now = new Date().toISOString();
  try {
    const updates: Record<string, any> = {
      ...details,
      updatedAt: now,
      onboardedAt: now,
      acceptedTerms: true,
    };
    if (details.classPreference && !details.className) {
      updates.className = details.classPreference;
    }
    const cleaned = cleanFirestoreData(updates);
    await updateDoc(userRef, cleaned);
    const snap = await getDoc(userRef);
    logger.info('User', `Updated student onboarding profile for ${userId}`);
    return snap.data() as UserProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
    throw error;
  }
}

export function subscribeToUserProfile(userId: string, callback: (profile: UserProfile | null) => void): Unsubscribe {
  const userRef = doc(db, 'users', userId);
  return onSnapshot(
    userRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as UserProfile);
      } else {
        callback(null);
      }
    },
    (error) => {
      logger.warn('Firebase', `Profile subscription notice for ${userId}: ${error.message}`);
      callback(null);
    }
  );
}

// Note Operations
export async function saveStudyNote(note: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const noteId = `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const noteDoc = doc(db, 'notes', noteId);
  const noteData: StudyNote = {
    ...note,
    id: noteId,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const cleanedNote = cleanFirestoreData(noteData);
    await setDoc(noteDoc, cleanedNote);
    logger.info('Notes', `Saved study note ${noteId}: ${note.title}`);
    return noteId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `notes/${noteId}`);
    throw error;
  }
}

export async function deleteStudyNote(noteId: string): Promise<void> {
  const noteDoc = doc(db, 'notes', noteId);
  try {
    await deleteDoc(noteDoc);
    logger.info('Notes', `Deleted note ${noteId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `notes/${noteId}`);
    throw error;
  }
}

export function subscribeToStudyNotes(callback: (notes: StudyNote[]) => void, classGradeFilter?: string): Unsubscribe {
  const notesCol = collection(db, 'notes');
  let q = query(notesCol, limit(50));
  if (classGradeFilter && classGradeFilter !== 'All') {
    q = query(notesCol, where('classGrade', '==', classGradeFilter), limit(50));
  }

  return onSnapshot(
    q,
    (snapshot) => {
      const notes: StudyNote[] = [];
      snapshot.forEach((doc) => {
        notes.push(doc.data() as StudyNote);
      });
      // Sort newest first in memory
      notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(notes);
    },
    (error) => {
      logger.warn('Firebase', `Study notes subscription notice: ${error.message}`);
      callback([]);
    }
  );
}

// Complaint Operations
export async function submitComplaint(
  ticket: Omit<ComplaintTicket, 'id' | 'ticketId' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const ticketRefId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
  const complaintId = `comp_${Date.now()}`;
  const now = new Date().toISOString();
  const complaintDoc = doc(db, 'complaints', complaintId);

  const fullComplaint: ComplaintTicket = {
    ...ticket,
    id: complaintId,
    ticketId: ticketRefId,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  try {
    const cleanedComplaint = cleanFirestoreData(fullComplaint);
    await setDoc(complaintDoc, cleanedComplaint);
    logger.info('Complaint', `Logged complaint ${ticketRefId} by ${ticket.userEmail}`);
    return ticketRefId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `complaints/${complaintId}`);
    throw error;
  }
}

export async function updateComplaintStatus(
  complaintId: string, 
  status: 'pending' | 'in_review' | 'resolved', 
  adminNotes?: string
): Promise<void> {
  const complaintDoc = doc(db, 'complaints', complaintId);
  const now = new Date().toISOString();
  try {
    await updateDoc(complaintDoc, {
      status,
      adminNotes: adminNotes || '',
      updatedAt: now,
    });
    logger.info('Complaint', `Updated complaint ${complaintId} status to ${status}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `complaints/${complaintId}`);
    throw error;
  }
}

export function subscribeToComplaints(callback: (complaints: ComplaintTicket[]) => void): Unsubscribe {
  // If no user is logged in, do not query complaints collection (rules require signed in)
  if (!auth.currentUser) {
    callback([]);
    return () => {};
  }

  const complaintsCol = collection(db, 'complaints');
  const q = query(complaintsCol, limit(100));

  return onSnapshot(
    q,
    (snapshot) => {
      const complaints: ComplaintTicket[] = [];
      snapshot.forEach((doc) => {
        complaints.push(doc.data() as ComplaintTicket);
      });
      complaints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(complaints);
    },
    (error) => {
      logger.warn('Firebase', `Complaints subscription notice: ${error.message}`);
      callback([]);
    }
  );
}
