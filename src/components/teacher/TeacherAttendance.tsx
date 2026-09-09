import React, { useState, useEffect } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { AttendanceStatus } from '../../types';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Check,
  Users,
  RotateCcw,
} from 'lucide-react';

export const TeacherAttendance: React.FC = () => {
  const { currentUser, subjects, users, attendance, markAttendance } = useAcademic();

  const assignedSubjects = subjects.filter((s) => s.teacherId === currentUser.id);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    assignedSubjects[0]?.id || ''
  );
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const enrolledStudents = users.filter((u) => u.role === 'student' && u.semester === 5);

  // Maintain local state for current marking session
  const [studentStatuses, setStudentStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize statuses when subject or date changes
  useEffect(() => {
    if (!selectedSubjectId || !selectedDate) return;

    // Check if attendance already exists for this subject & date
    const existing = attendance.filter(
      (a) => a.subjectId === selectedSubjectId && a.date === selectedDate
    );

    const initialMap: Record<string, AttendanceStatus> = {};
    enrolledStudents.forEach((std) => {
      const match = existing.find((a) => a.studentId === std.id);
      initialMap[std.id] = match ? match.status : 'present'; // Default to present
    });

    setStudentStatuses(initialMap);
  }, [selectedSubjectId, selectedDate, attendance]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStudentStatuses((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = {};
    enrolledStudents.forEach((std) => {
      updated[std.id] = status;
    });
    setStudentStatuses(updated);
  };

  const handleSaveAttendance = () => {
    const records = Object.entries(studentStatuses).map(([studentId, status]) => ({
      studentId,
      status,
    }));

    markAttendance(selectedSubjectId, selectedDate, records);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Calculations for current marking preview
  const totalInSession = enrolledStudents.length;
  const presentCount = Object.values(studentStatuses).filter((s) => s === 'present').length;
  const absentCount = Object.values(studentStatuses).filter((s) => s === 'absent').length;
  const lateCount = Object.values(studentStatuses).filter((s) => s === 'late').length;
  const sessionPercentage =
    totalInSession > 0 ? Math.round(((presentCount + lateCount * 0.7) / totalInSession) * 100) : 0;

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              Class Attendance Register
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select class, subject and session date to record attendance. Percentages recalculate in real-time.
            </p>
          </div>

          {/* Subject & Date Pickers */}
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Assigned Subject
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {assignedSubjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code} - {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Lecture Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Live Session Metric bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-700">Present: {presentCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-xs font-bold text-slate-700">Absent: {absentCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-xs font-bold text-slate-700">Late: {lateCount}</span>
            </div>
            <div className="pl-2 border-l border-slate-200 text-xs font-black text-slate-900">
              Session Attendance: <span className="text-emerald-700 font-extrabold">{sessionPercentage}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleMarkAll('present')}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs transition-colors"
            >
              Mark All Present
            </button>
            <button
              onClick={() => handleMarkAll('absent')}
              className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-800 hover:bg-rose-100 font-bold text-xs transition-colors"
            >
              Mark All Absent
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:px-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: currentSubject?.color || '#10b981' }}
            />
            <span className="font-black text-sm text-slate-800">
              {currentSubject?.name} ({currentSubject?.code})
            </span>
            <span className="text-xs text-slate-400">• Class Roll Call</span>
          </div>

          <button
            onClick={handleSaveAttendance}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Register</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-white text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 sm:px-6">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4 text-center">Current Total %</th>
                <th className="py-3 px-4 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enrolledStudents.map((std) => {
                // Calculate historical attendance in this subject
                const historicalRecords = attendance.filter(
                  (a) => a.studentId === std.id && a.subjectId === selectedSubjectId
                );
                const histTotal = historicalRecords.length;
                const histPresent = historicalRecords.filter((a) => a.status === 'present').length;
                const histLate = historicalRecords.filter((a) => a.status === 'late').length;
                const histPct =
                  histTotal > 0 ? Math.round(((histPresent + histLate * 0.7) / histTotal) * 100) : 100;

                const currentStatus = studentStatuses[std.id] || 'present';

                return (
                  <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-slate-700">
                      {std.rollNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={std.avatar}
                          alt={std.name}
                          className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                        />
                        <span className="font-bold text-slate-900">{std.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                          histPct >= 80
                            ? 'bg-emerald-50 text-emerald-700'
                            : histPct >= 75
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {histPct}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl gap-1">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(std.id, 'present')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(std.id, 'absent')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(std.id, 'late')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'late'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Late</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer save banner */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {saveSuccess ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300">
              <Check className="w-4 h-4" /> Attendance saved and student percentages updated!
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Make sure to save after selecting attendance statuses.
            </span>
          )}

          <button
            onClick={handleSaveAttendance}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Confirm & Save Attendance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
