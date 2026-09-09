import React, { useState } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { AttendanceRecord, AttendanceStatus } from '../../types';
import {
  CalendarCheck,
  Search,
  Filter,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export const AdminAttendance: React.FC = () => {
  const { attendance, subjects, users, updateAttendanceRecord, deleteAttendanceRecord } =
    useAcademic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

  const filteredRecords = attendance.filter((rec) => {
    const matchesSubject = selectedSubjectId === 'all' || rec.subjectId === selectedSubjectId;
    const matchesStatus = selectedStatus === 'all' || rec.status === selectedStatus;
    const matchesSearch =
      rec.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.date.includes(searchQuery);

    return matchesSubject && matchesStatus && matchesSearch;
  });

  const handleStatusChange = (recordId: string, newStatus: AttendanceStatus) => {
    updateAttendanceRecord(recordId, newStatus);
    setEditingRecord(null);
  };

  const handleDelete = (recordId: string) => {
    if (confirm('Delete this attendance entry?')) {
      deleteAttendanceRecord(recordId);
    }
  };

  // High-level metrics
  const total = attendance.length;
  const present = attendance.filter((a) => a.status === 'present').length;
  const absent = attendance.filter((a) => a.status === 'absent').length;
  const late = attendance.filter((a) => a.status === 'late').length;
  const rate = total > 0 ? Math.round(((present + late * 0.7) / total) * 100) : 85;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Institute Attendance Audit & Correction
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review university-wide lecture attendance logs, rectify instructor marking errors, and monitor attendance adherence.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 px-4 py-2.5 rounded-xl text-purple-900 text-xs font-bold shrink-0">
          <CalendarCheck className="w-4 h-4 text-purple-600" />
          <span>Overall Campus Compliance: {rate}%</span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
            Total Session Logs
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{total}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider block">
            Present Attendees
          </span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{present}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-rose-600 font-bold uppercase tracking-wider block">
            Absences Logged
          </span>
          <span className="text-2xl font-black text-rose-700 mt-1 block">{absent}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-amber-600 font-bold uppercase tracking-wider block">
            Tardy / Late
          </span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">{late}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by student name, course, or date (YYYY-MM-DD)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
          >
            <option value="all">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.code} - {sub.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 sm:px-6">Date</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((rec) => {
                const isEditing = editingRecord?.id === rec.id;

                return (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-mono font-medium text-slate-700">
                      {rec.date}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">{rec.studentName}</td>

                    <td className="py-3.5 px-4 text-slate-700">{rec.subjectName}</td>

                    <td className="py-3.5 px-4 text-center">
                      {isEditing ? (
                        <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                          <button
                            onClick={() => handleStatusChange(rec.id, 'present')}
                            className="px-2 py-1 rounded text-[11px] font-bold bg-emerald-600 text-white"
                          >
                            Present
                          </button>
                          <button
                            onClick={() => handleStatusChange(rec.id, 'absent')}
                            className="px-2 py-1 rounded text-[11px] font-bold bg-rose-600 text-white"
                          >
                            Absent
                          </button>
                          <button
                            onClick={() => handleStatusChange(rec.id, 'late')}
                            className="px-2 py-1 rounded text-[11px] font-bold bg-amber-600 text-white"
                          >
                            Late
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            rec.status === 'present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rec.status === 'absent'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rec.status === 'present' && <CheckCircle2 className="w-3 h-3" />}
                          {rec.status === 'absent' && <XCircle className="w-3 h-3" />}
                          {rec.status === 'late' && <Clock className="w-3 h-3" />}
                          <span className="capitalize">{rec.status}</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingRecord(isEditing ? null : rec)}
                          className="p-1.5 rounded-lg text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 transition-colors"
                          title="Override Status"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(rec.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Delete Attendance Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
