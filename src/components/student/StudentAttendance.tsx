import React, { useState } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Info,
  ChevronDown,
  Filter,
} from 'lucide-react';

export const StudentAttendance: React.FC = () => {
  const { currentUser, attendance, getStudentAttendanceStats } = useAcademic();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');

  const stats = getStudentAttendanceStats(currentUser.id);

  // Filter individual attendance logs
  const studentLogs = attendance
    .filter((a) => a.studentId === currentUser.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredLogs =
    selectedSubjectId === 'all'
      ? studentLogs
      : studentLogs.filter((a) => a.subjectId === selectedSubjectId);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Attendance Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your semester attendance records, minimum 75% requirement is mandatory for exam eligibility.
          </p>
        </div>

        {/* Global Attendance Badge */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 sm:px-4 rounded-xl border border-slate-200 shrink-0">
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Aggregate Attendance
            </span>
            <span className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {stats.overallPercentage}%
            </span>
          </div>
          <span
            className={`text-xs font-extrabold px-3 py-1.5 rounded-lg border ${
              stats.overallPercentage >= 80
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : stats.overallPercentage >= 75
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-rose-100 text-rose-800 border-rose-300'
            }`}
          >
            {stats.status === 'Good' && '🟢 Good Standing'}
            {stats.status === 'Warning' && '🟡 Warning (75-79%)'}
            {stats.status === 'Short Attendance' && '🔴 Short Attendance'}
          </span>
        </div>
      </div>

      {/* Threshold Information Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            🟢
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-900">Good Status (80% & Above)</h4>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Excellent track record. Full eligibility for midterm and final semester examinations.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            🟡
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-900">Warning Status (75% - 79%)</h4>
            <p className="text-[11px] text-amber-700 mt-0.5">
              Borderline risk. A few missed lectures will drop you into critical short attendance zone.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            🔴
          </div>
          <div>
            <h4 className="text-xs font-bold text-rose-900">Short Attendance (&lt; 75%)</h4>
            <p className="text-[11px] text-rose-700 mt-0.5">
              Academic debarment risk. Immediate remediation or medical slip submission required.
            </p>
          </div>
        </div>
      </div>

      {/* Subject-wise Attendance Cards */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
              Subject-wise Attendance Breakdown
            </h3>
            <p className="text-xs text-slate-500">Detailed lecture count and presence percentage</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.subjectStats.map((subStat) => {
            const isGood = subStat.status === 'Good';
            const isWarning = subStat.status === 'Warning';
            return (
              <div
                key={subStat.subject.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all bg-slate-50/50 hover:bg-white"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: subStat.subject.color }}
                    >
                      {subStat.subject.code}
                    </span>
                    <h4 className="font-bold text-sm text-slate-800 mt-1 line-clamp-1">
                      {subStat.subject.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">{subStat.subject.teacherName}</p>
                  </div>
                  <span
                    className={`text-xs font-extrabold px-2 py-1 rounded-lg border shrink-0 ${
                      isGood
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : isWarning
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}
                  >
                    {isGood && '🟢 Good'}
                    {isWarning && '🟡 Warning'}
                    {!isGood && !isWarning && '🔴 Short'}
                  </span>
                </div>

                {/* Percentage & Progress Bar */}
                <div className="my-3">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-medium text-slate-600">Attendance Rate</span>
                    <span className="text-lg font-black text-slate-900 font-['Outfit',sans-serif]">
                      {subStat.percentage}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isGood ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${subStat.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Class Counts */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200/70 text-xs">
                  <div className="bg-white p-1.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Total</span>
                    <span className="font-bold text-slate-800">{subStat.total}</span>
                  </div>
                  <div className="bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
                    <span className="text-[10px] text-emerald-600 block font-medium">Present</span>
                    <span className="font-bold text-emerald-700">{subStat.present}</span>
                  </div>
                  <div className="bg-rose-50 p-1.5 rounded-lg border border-rose-100">
                    <span className="text-[10px] text-rose-600 block font-medium">Absent</span>
                    <span className="font-bold text-rose-700">{subStat.absent}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Attendance Session Log */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
              Daily Attendance History Log
            </h3>
            <p className="text-xs text-slate-500">Chronological class attendance entries</p>
          </div>

          {/* Filter dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              id="filter-attendance-subject"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Subjects</option>
              {stats.subjectStats.map((s) => (
                <option key={s.subject.id} value={s.subject.id}>
                  {s.subject.code} - {s.subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => {
                  const sub = stats.subjectStats.find((s) => s.subject.id === log.subjectId)?.subject;
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">{log.date}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: sub?.color || '#3b82f6' }}
                          />
                          <span className="font-bold text-slate-800">{sub?.name || 'Subject'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{sub?.teacherName || 'Faculty'}</td>
                      <td className="py-3 px-4">
                        {log.status === 'present' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Present
                          </span>
                        )}
                        {log.status === 'absent' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800">
                            <XCircle className="w-3 h-3" /> Absent
                          </span>
                        )}
                        {log.status === 'late' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3" /> Late (Tardy)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400">
                        {log.status === 'late' ? 'Arrived 15m after start' : 'Recorded by Faculty'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            No attendance records logged for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};
