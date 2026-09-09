import React, { useState } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { Search, Filter, MessageSquare, Award, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { User } from '../../types';

export const TeacherStudents: React.FC = () => {
  const { currentUser, subjects, users, attendance, marks, feedbacks, addFeedback } = useAcademic();

  const assignedSubjects = subjects.filter((s) => s.teacherId === currentUser.id);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    assignedSubjects[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFeedbackModal, setActiveFeedbackModal] = useState<{
    student: User;
    subjectId: string;
  } | null>(null);

  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState<
    'Excellent' | 'Good' | 'Average' | 'Needs Improvement' | 'Critical'
  >('Good');

  // Enrolled students in Semester 5
  const enrolledStudents = users.filter((u) => u.role === 'student' && u.semester === 5);

  const filteredStudents = enrolledStudents.filter((std) => {
    const matchesSearch =
      std.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (std.rollNumber && std.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFeedbackModal || !feedbackText.trim()) return;

    addFeedback(
      activeFeedbackModal.student.id,
      currentUser.id,
      activeFeedbackModal.subjectId,
      feedbackText,
      feedbackStatus
    );

    setActiveFeedbackModal(null);
    setFeedbackText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Assigned Student Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor student attendance percentages, evaluation scores, and record progress remarks.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name or roll no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-56"
            />
          </div>

          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {assignedSubjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.code} - {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 sm:px-6">Student</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4 text-center">Attendance %</th>
                <th className="py-3 px-4 text-center">Marks (100)</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-center">Performance Status</th>
                <th className="py-3 px-4 text-right">Feedback / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((std) => {
                // Calculate student's attendance in selected subject
                const subjectAtt = attendance.filter(
                  (a) => a.studentId === std.id && a.subjectId === selectedSubjectId
                );
                const totalClasses = subjectAtt.length;
                const present = subjectAtt.filter((a) => a.status === 'present').length;
                const late = subjectAtt.filter((a) => a.status === 'late').length;
                const attPct =
                  totalClasses > 0 ? Math.round(((present + late * 0.7) / totalClasses) * 100) : 100;

                // Marks in selected subject
                const studentMarks = marks.find(
                  (m) => m.studentId === std.id && m.subjectId === selectedSubjectId
                );

                // Latest feedback
                const latestFeedback = feedbacks.find(
                  (f) => f.studentId === std.id && f.subjectId === selectedSubjectId
                );

                return (
                  <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={std.avatar}
                          alt={std.name}
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{std.name}</p>
                          <p className="text-[11px] text-slate-400">{std.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {std.rollNumber}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black ${
                          attPct >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : attPct >= 75
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {attPct}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                      {studentMarks ? `${studentMarks.totalMarks}/100` : 'Not Evaluated'}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {studentMarks ? (
                        <span className="font-extrabold text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                          {studentMarks.grade}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          latestFeedback?.performanceStatus === 'Excellent'
                            ? 'bg-emerald-100 text-emerald-800'
                            : latestFeedback?.performanceStatus === 'Average'
                            ? 'bg-amber-100 text-amber-800'
                            : latestFeedback?.performanceStatus === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {latestFeedback?.performanceStatus || 'Regular'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() =>
                          setActiveFeedbackModal({
                            student: std,
                            subjectId: selectedSubjectId,
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Add Remarks</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Remarks / Feedback Modal */}
      {activeFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 font-['Outfit',sans-serif]">
              Record Academic Feedback & Remarks
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Feedback for <span className="font-bold text-slate-800">{activeFeedbackModal.student.name}</span> ({activeFeedbackModal.student.rollNumber})
            </p>

            <form onSubmit={handleSaveFeedback} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Performance Status Classification
                </label>
                <select
                  value={feedbackStatus}
                  onChange={(e) => setFeedbackStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Excellent">🟢 Excellent (Outstanding mastery & participation)</option>
                  <option value="Good">🟢 Good (Consistent performance)</option>
                  <option value="Average">🟡 Average (Satisfactory, needs more attention)</option>
                  <option value="Needs Improvement">🟠 Needs Improvement (Struggling with topics)</option>
                  <option value="Critical">🔴 Critical (Frequent absenteeism / low marks)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Instructor Remarks & Direct Guidance
                </label>
                <textarea
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Enter constructive remarks for the student to review on their academic portal..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveFeedbackModal(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all"
                >
                  Save Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
