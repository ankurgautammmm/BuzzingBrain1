import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  BarChart3, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Users, 
  FileText, 
  Sparkles, 
  Cpu, 
  Filter,
  Search,
  MessageSquare,
  ChevronDown,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { StudyNote, ComplaintTicket, UserProfile } from '../types';

interface AdminDashboardProps {
  notes: StudyNote[];
  complaints: ComplaintTicket[];
  currentProfile: UserProfile | null;
  onUpdateComplaintStatus: (complaintId: string, status: 'pending' | 'in_review' | 'resolved', adminNotes?: string) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  notes,
  complaints,
  currentProfile,
  onUpdateComplaintStatus,
}) => {
  const [complaintFilter, setComplaintFilter] = useState<'all' | 'pending' | 'in_review' | 'resolved'>('all');
  const [selectedTicket, setSelectedTicket] = useState<ComplaintTicket | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Statistics
  const totalNotes = notes.length;
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === 'pending').length;
  const inReviewComplaints = complaints.filter(c => c.status === 'in_review').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;

  // Breakdown by class
  const classCounts = notes.reduce((acc, note) => {
    acc[note.classGrade] = (acc[note.classGrade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Breakdown by subject
  const subjectCounts = notes.reduce((acc, note) => {
    acc[note.subject] = (acc[note.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
    if (complaintFilter !== 'all' && c.status !== complaintFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        c.ticketId.toLowerCase().includes(term) ||
        c.title.toLowerCase().includes(term) ||
        c.userEmail.toLowerCase().includes(term) ||
        c.category.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // CSV Export Utility
  const downloadCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const escapeCell = (cell: string | number) => {
      const cellStr = String(cell ?? '').replace(/"/g, '""');
      return `"${cellStr}"`;
    };

    const csvContent = [
      headers.map(escapeCell).join(','),
      ...rows.map(row => row.map(escapeCell).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportNotesCsv = () => {
    const headers = ['Note ID', 'Title', 'Class Grade', 'Subject', 'Chapter', 'Topic', 'User Email', 'User Name', 'Command Used', 'Created At'];
    const rows = notes.map(n => [
      n.id,
      n.title,
      n.classGrade,
      n.subject,
      n.chapter,
      n.topic || '',
      n.userEmail || '',
      n.userName || '',
      n.commandUsed || '',
      n.createdAt
    ]);
    downloadCsv('buzzing_brain_notes_report', headers, rows);
  };

  const exportComplaintsCsv = () => {
    const headers = ['Ticket ID', 'Status', 'Category', 'Subject Title', 'Description', 'User Email', 'User Name', 'Admin Notes', 'Created At', 'Updated At'];
    const rows = complaints.map(c => [
      c.ticketId,
      c.status,
      c.category,
      c.title,
      c.description,
      c.userEmail,
      c.userName,
      c.adminNotes || '',
      c.createdAt,
      c.updatedAt
    ]);
    downloadCsv('buzzing_brain_complaints_report', headers, rows);
  };

  const exportAnalyticsSummaryCsv = () => {
    const headers = ['Metric Category', 'Key', 'Value'];
    const rows: (string | number)[][] = [
      ['General', 'Total Notes Generated', totalNotes],
      ['General', 'Total Complaints Logged', totalComplaints],
      ['Complaints', 'Pending Complaints', pendingComplaints],
      ['Complaints', 'In Review Complaints', inReviewComplaints],
      ['Complaints', 'Resolved Complaints', resolvedComplaints],
      ...Object.entries(classCounts).map(([cls, count]) => ['Class Distribution', cls, count]),
      ...Object.entries(subjectCounts).map(([subj, count]) => ['Subject Distribution', subj, count]),
    ];
    downloadCsv('buzzing_brain_analytics_summary', headers, rows);
  };

  const handleResolveTicket = async (ticket: ComplaintTicket, newStatus: 'pending' | 'in_review' | 'resolved') => {
    setIsUpdating(true);
    try {
      await onUpdateComplaintStatus(ticket.id, newStatus, adminNoteInput || ticket.adminNotes);
      if (selectedTicket && selectedTicket.id === ticket.id) {
        setSelectedTicket({ ...selectedTicket, status: newStatus, adminNotes: adminNoteInput || ticket.adminNotes });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Administrative Operations Roster
            </span>
            <span className="text-xs text-slate-400">Authenticated: {currentProfile?.email || 'Administrator'}</span>
          </div>
          <h2 className="text-2xl font-bold mt-2">Administrative Telemetry &amp; Grievance Tracking</h2>
          <p className="text-slate-400 text-sm mt-1">
            Real-time monitoring of NCERT note synthesis volume, student complaints resolution, and syllabus metrics.
          </p>
        </div>

        {/* CSV Export Button Group */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportNotesCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            title="Download Notes Database CSV"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Notes CSV</span>
          </button>
          <button
            onClick={exportComplaintsCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            title="Download Grievances Report CSV"
          >
            <Download className="w-3.5 h-3.5 text-rose-400" />
            <span>Complaints CSV</span>
          </button>
          <button
            onClick={exportAnalyticsSummaryCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Download Complete Analytical Summary CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-950" />
            <span>Export Full Report (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Total Synthesized Notes</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">{totalNotes}</div>
          <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <span>Active in Student Library</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Total Complaints Logged</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">{totalComplaints}</div>
          <div className="text-xs text-slate-500 mt-1">
            {pendingComplaints} Pending &bull; {inReviewComplaints} In Review
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Resolution Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 100}%
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">
            {resolvedComplaints} tickets resolved
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>AI Model Engine</span>
            <Cpu className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-lg font-bold text-slate-900 truncate">Gemini 3.1 Pro</div>
          <div className="text-xs text-purple-600 font-medium mt-1">
            High Thinking &bull; Grounded
          </div>
        </div>
      </div>

      {/* Curriculum Distribution Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Class Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-600" />
            <span>Notes Synthesized by NCERT Standard</span>
          </h3>
          <div className="space-y-2">
            {Object.keys(classCounts).length === 0 ? (
              <p className="text-xs text-slate-400 italic">No notes generated yet.</p>
            ) : (
              Object.entries(classCounts).map(([cls, count]) => (
                <div key={cls} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{cls}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-amber-500 h-full rounded-full" 
                        style={{ width: `${Math.min(100, (count / (totalNotes || 1)) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-slate-500 font-mono w-6 text-right">{count}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>Notes Synthesized by Subject</span>
          </h3>
          <div className="space-y-2">
            {Object.keys(subjectCounts).length === 0 ? (
              <p className="text-xs text-slate-400 italic">No notes generated yet.</p>
            ) : (
              Object.entries(subjectCounts).map(([subj, count]) => (
                <div key={subj} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{subj}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full" 
                        style={{ width: `${Math.min(100, (count / (totalNotes || 1)) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-slate-500 font-mono w-6 text-right">{count}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Complaints Management Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <span>Student Grievance &amp; Complaints Desk</span>
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Review syllabus discrepancies, rendering issues, and student support inquiries.
            </p>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setComplaintFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${complaintFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
            >
              All ({complaints.length})
            </button>
            <button
              onClick={() => setComplaintFilter('pending')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${complaintFilter === 'pending' ? 'bg-white text-rose-700 shadow-2xs font-semibold' : 'text-slate-600'}`}
            >
              Pending ({pendingComplaints})
            </button>
            <button
              onClick={() => setComplaintFilter('in_review')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${complaintFilter === 'in_review' ? 'bg-white text-amber-700 shadow-2xs font-semibold' : 'text-slate-600'}`}
            >
              In Review ({inReviewComplaints})
            </button>
            <button
              onClick={() => setComplaintFilter('resolved')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${complaintFilter === 'resolved' ? 'bg-white text-emerald-700 shadow-2xs font-semibold' : 'text-slate-600'}`}
            >
              Resolved ({resolvedComplaints})
            </button>
          </div>
        </div>

        {/* Complaints Table */}
        {filteredComplaints.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No complaints in this category. System health is optimal!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold">Ticket ID</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Subject / Title</th>
                  <th className="py-3 px-4 font-semibold">Student / Complainant</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Logged On</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {ticket.ticketId}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {ticket.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 max-w-xs truncate">
                      {ticket.title}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{ticket.userName}</div>
                      <div className="text-[11px] text-slate-400">{ticket.userEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      {ticket.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-semibold">
                          Pending
                        </span>
                      )}
                      {ticket.status === 'in_review' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">
                          In Review
                        </span>
                      )}
                      {ticket.status === 'resolved' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                          Resolved
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setAdminNoteInput(ticket.adminNotes || '');
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium transition-colors cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Details & Resolution Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {selectedTicket.ticketId}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedTicket.title}</h3>
                <span className="text-xs text-slate-500">Category: {selectedTicket.category}</span>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Complainant Message:</label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
                {selectedTicket.description}
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                From: <strong>{selectedTicket.userName}</strong> ({selectedTicket.userEmail})
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Admin Resolution Notes / Response:
              </label>
              <textarea
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="Explain resolution, e.g. 'Updated NCERT syllabus reference database for Class 10 Chapter 5.'"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                rows={3}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Status: <strong className="capitalize">{selectedTicket.status.replace('_', ' ')}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={isUpdating}
                  onClick={() => handleResolveTicket(selectedTicket, 'in_review')}
                  className="px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Mark In Review
                </button>
                <button
                  disabled={isUpdating}
                  onClick={() => handleResolveTicket(selectedTicket, 'resolved')}
                  className="px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
