import React, { useState } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { MessageSquare, Plus, Check, AlertTriangle, Sparkles, Filter } from 'lucide-react';
import { TeacherFeedback } from '../../types';

export const TeacherFeedbackView: React.FC = () => {
  const { currentUser, subjects, users, feedbacks, addFeedback } = useAcademic();

  const assignedSubjects = subjects.filter((s) => s.teacherId === currentUser.id);
  const enrolledStudents = users.filter((u) => u.role === 'student' && u.semester === 5);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    assignedSubjects[0]?.id || ''
  );
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    enrolledStudents[0]?.id || ''
  );
  const [remarks, setRemarks] = useState<string>('');
  const [status, setStatus] = useState<TeacherFeedback['performanceStatus']>('Good');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const teacherFeedbacks = feedbacks.filter((f) => f.teacherId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim() || !selectedStudentId || !selectedSubjectId) return;

    addFeedback(selectedStudentId, currentUser.id, selectedSubjectId, remarks, status);
    setRemarks('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Student Progress & Mentorship Remarks
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish academic recommendations, progress reviews, and early warning flags for students.
          </p>
        </div>
      </div>

      {/* Two Columns: Add New Feedback & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Feedback Form */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif]">
              Record Remarks
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Select Course
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                {assignedSubjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code} - {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Select Student
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                {enrolledStudents.map((std) => (
                  <option key={std.id} value={std.id}>
                    {std.name} ({std.rollNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Performance Evaluation Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="Excellent">🟢 Excellent (Exceptional work)</option>
                <option value="Good">🟢 Good (Consistent)</option>
                <option value="Average">🟡 Average (Needs consistency)</option>
                <option value="Needs Improvement">🟠 Needs Improvement</option>
                <option value="Critical">🔴 Critical (At risk of failure)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Faculty Remarks & Advice
              </label>
              <textarea
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Write specific feedback on assignments, labs, or exam preparedness..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Publish Remarks to Student</span>
            </button>

            {savedSuccess && (
              <p className="text-center text-xs font-bold text-emerald-700 bg-emerald-50 py-1.5 rounded-lg border border-emerald-200">
                Remarks successfully published!
              </p>
            )}
          </form>
        </div>

        {/* Existing Feedbacks list */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif]">
                Logged Guidance & Recommendations
              </h3>
              <p className="text-xs text-slate-500">Historical remarks issued to your students</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {teacherFeedbacks.length} Records
            </span>
          </div>

          <div className="space-y-3">
            {teacherFeedbacks.map((f) => {
              const student = users.find((u) => u.id === f.studentId);
              return (
                <div
                  key={f.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={student?.avatar}
                        alt={student?.name}
                        className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <span className="font-bold text-xs text-slate-900">{student?.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono ml-2">
                          ({student?.rollNumber})
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        f.performanceStatus === 'Excellent'
                          ? 'bg-emerald-100 text-emerald-800'
                          : f.performanceStatus === 'Average'
                          ? 'bg-amber-100 text-amber-800'
                          : f.performanceStatus === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {f.performanceStatus}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                    "{f.remarks}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1">
                    <span>Course: {f.subjectName}</span>
                    <span>Issued on {f.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
