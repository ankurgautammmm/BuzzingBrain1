import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  Printer, 
  Sparkles, 
  Calendar, 
  User, 
  Tag,
  ArrowRight,
  Share2,
  FileText
} from 'lucide-react';
import { StudyNote, NoteContentPayload, HandwritingStyleConfig } from '../types';

interface StudentNotesLibraryProps {
  notes: StudyNote[];
  currentUserId?: string;
  isAdmin?: boolean;
  onSelectNote: (note: StudyNote) => void;
  onDeleteNote?: (noteId: string) => void;
  onNewNoteClick?: () => void;
}

export const StudentNotesLibrary: React.FC<StudentNotesLibraryProps> = ({
  notes,
  currentUserId,
  isAdmin = false,
  onSelectNote,
  onDeleteNote,
  onNewNoteClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [viewFilter, setViewFilter] = useState<'all' | 'mine'>('all');

  const classes = ['All', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  const subjects = ['All', 'Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Social Science'];

  const filteredNotes = notes.filter((n) => {
    // Search query
    const queryMatch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.topic && n.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
      n.subject.toLowerCase().includes(searchQuery.toLowerCase());

    if (!queryMatch) return false;

    // Class filter
    if (selectedClass !== 'All' && n.classGrade !== selectedClass) return false;

    // Subject filter
    if (selectedSubject !== 'All' && !n.subject.toLowerCase().includes(selectedSubject.toLowerCase())) return false;

    // Mine vs All filter
    if (viewFilter === 'mine' && n.userId !== currentUserId) return false;

    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto py-4 space-y-6">
      {/* Library Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Student Study Repository</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Buzzing Brain &bull; Handwritten Notes Library
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Browse and read authentic study notes synthesized by students across Class 9, 10, 11, and 12.
          </p>
        </div>

        {onNewNoteClick && (
          <button
            onClick={onNewNoteClick}
            className="px-5 py-2.5 bg-white hover:bg-slate-200 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Synthesize New Note</span>
          </button>
        )}
      </div>

      {/* Search & Filter Controls */}
      <div className="astra-card border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by chapter, topic, formula, or subject..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Toggle All vs Mine */}
          <div className="flex bg-white/5 p-1 rounded-xl text-xs font-medium text-slate-400 self-start sm:self-auto border border-white/5">
            <button
              onClick={() => setViewFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${viewFilter === 'all' ? 'bg-white/20 text-white shadow-2xs font-bold' : 'hover:text-white'}`}
            >
              All Notes ({notes.length})
            </button>
            <button
              onClick={() => setViewFilter('mine')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${viewFilter === 'mine' ? 'bg-white/20 text-white shadow-2xs font-bold' : 'hover:text-white'}`}
            >
              My Notes ({notes.filter(n => n.userId === currentUserId).length})
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-xs">
          <span className="font-semibold text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Class:</span>
          </span>
          {classes.map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedClass === cls
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cls}
            </button>
          ))}

          <span className="text-white/20 mx-1">|</span>

          <span className="font-semibold text-slate-400">Subject:</span>
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-white text-slate-950 font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12 astra-card border border-white/10 rounded-3xl p-8 space-y-4">
          <FileText className="w-12 h-12 text-amber-400/60 mx-auto" />
          <h3 className="text-lg font-bold text-white">No saved study notes found in this view</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            {searchQuery 
              ? `No notes match "${searchQuery}". Try clearing your search query or subject filters.`
              : 'Save notes from the Handwritten Note Studio or browse chapters in the NCERT Books section to generate notes instantly!'}
          </p>
          {onNewNoteClick && (
            <button
              onClick={onNewNoteClick}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md inline-flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Synthesize Notes Now</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => {
            const isOwner = currentUserId === note.userId;
            let parsedStyle: HandwritingStyleConfig = {
              penType: 'gel-pen',
              inkColor: 'royal-blue',
              paperType: 'ruled-notebook',
              fontFamily: 'Kalam',
              fontSize: 20,
              slantAngle: 0.3,
              inkPressure: 'medium',
              highlightColor: 'yellow',
              showMarginLine: true,
              showHoles: true,
            };
            try {
              if (note.styleConfig) {
                parsedStyle = JSON.parse(note.styleConfig);
              }
            } catch (e) {
              // fallback
            }

            return (
              <div
                key={note.id}
                className="bg-white border-2 border-slate-200 hover:border-amber-400 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Notebook Top Spiral Simulation */}
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                    <span className="font-semibold text-slate-700">{note.classGrade}</span>
                    <span>&bull;</span>
                    <span className="text-slate-600">{note.subject}</span>
                  </div>
                  <span className="text-[11px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
                    {parsedStyle.fontFamily}
                  </span>
                </div>

                {/* Notebook Paper Preview Card Body */}
                <div 
                  onClick={() => onSelectNote(note)}
                  className="p-5 cursor-pointer flex-1 relative bg-[#fdfdfc] hover:bg-amber-50/20 transition-colors"
                  style={{
                    backgroundImage: 'linear-gradient(#f1f5f9 1px, transparent 1px)',
                    backgroundSize: '100% 28px',
                    backgroundPosition: '0 10px',
                  }}
                >
                  <h3 
                    className="text-xl font-bold text-slate-900 mb-1 group-hover:text-amber-900 transition-colors line-clamp-2"
                    style={{ fontFamily: `"${parsedStyle.fontFamily || 'Kalam'}", cursive` }}
                  >
                    {note.title}
                  </h3>

                  <div className="text-xs text-slate-600 font-sans mt-2 space-y-1">
                    <div>
                      <strong>Chapter:</strong> {note.chapter}
                    </div>
                    {note.topic && (
                      <div className="line-clamp-1">
                        <strong>Topic:</strong> {note.topic}
                      </div>
                    )}
                  </div>

                  {note.commandUsed && (
                    <div className="mt-3 text-[11px] font-mono text-slate-500 bg-slate-100/80 p-1.5 rounded truncate border border-slate-200">
                      {note.commandUsed}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[100px]">{note.userName || 'Student'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {(isOwner || isAdmin) && onDeleteNote && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this handwritten note?')) {
                            onDeleteNote(note.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors rounded hover:bg-rose-50"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => onSelectNote(note)}
                      className="flex items-center gap-1 text-amber-700 hover:text-amber-800 font-semibold px-2 py-1 rounded-md hover:bg-amber-50 transition-colors"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
