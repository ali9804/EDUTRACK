import React from 'react';
import { useAcademic } from '../../context/AcademicContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, Target, Award, CheckCircle2, MessageSquare, ArrowUpRight } from 'lucide-react';

export const StudentProgress: React.FC = () => {
  const {
    currentUser,
    semesterHistory,
    feedbacks,
    getStudentAcademicSummary,
    getStudentAttendanceStats,
  } = useAcademic();

  const academicSummary = getStudentAcademicSummary(currentUser.id);
  const attendanceStats = getStudentAttendanceStats(currentUser.id);

  // Prepare GPA Progression Data
  const gpaProgressionData = semesterHistory.map((s) => ({
    semester: `Sem ${s.semester}`,
    gpa: s.semester === 5 ? academicSummary.currentSemesterGPA : s.gpa,
    target: 3.8,
  }));

  // Prepare Subject-wise Performance Data
  const subjectPerformanceData = academicSummary.subjectMarks.map((sm) => ({
    name: sm.subject.code,
    subjectName: sm.subject.name,
    Assignment: sm.marksRecord.assignment,
    Quiz: sm.marksRecord.quiz,
    Midterm: sm.marksRecord.midterm,
    Final: sm.marksRecord.finalExam,
    Total: sm.marksRecord.totalMarks,
  }));

  // Prepare Attendance vs Performance comparison
  const attendanceVsMarksData = academicSummary.subjectMarks.map((sm) => {
    const att = attendanceStats.subjectStats.find((a) => a.subject.id === sm.subject.id);
    return {
      name: sm.subject.code,
      Attendance: att ? att.percentage : 0,
      Marks: sm.marksRecord.totalMarks,
    };
  });

  const studentFeedbacks = feedbacks.filter((f) => f.studentId === currentUser.id);

  return (
    <div className="space-y-6">
      {/* Top Banner with CGPA and Progress Metrics */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Cumulative Progress Tracker</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              Academic Progress & Analytics
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Visualizing GPA trajectory, subject mastery, and attendance impact across your degree roadmap.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center min-w-[130px]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Degree CGPA
              </span>
              <span className="text-3xl font-black text-indigo-700 font-['Outfit',sans-serif]">
                {academicSummary.overallCGPA.toFixed(2)}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                Top 10% of Cohort
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center min-w-[130px]">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Target GPA
              </span>
              <span className="text-3xl font-black text-slate-800 font-['Outfit',sans-serif]">
                3.85
              </span>
              <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                Delta: +0.11 needed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart 1: Semester-wise GPA Progression & Target */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif]">
                Semester-wise GPA Trajectory
              </h3>
              <p className="text-xs text-slate-500">Historical GPA progression over semesters</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-indigo-600">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> GPA
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Benchmark (3.8)
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gpaProgressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="semester" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[2.5, 4.0]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="gpa"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#gpaGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Attendance % vs Marks Comparison */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif]">
                Attendance vs. Final Marks
              </h3>
              <p className="text-xs text-slate-500">Correlation between attendance rate and marks scored</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceVsMarksData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Attendance" fill="#06b6d4" radius={[6, 6, 0, 0]} barSize={20} />
                <Bar dataKey="Marks" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3: Subject-wise Component Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif]">
              Subject Evaluation Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Score breakdown across continuous assessment components (Assignments, Quizzes, Midterm, Final)
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectPerformanceData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="Assignment" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Quiz" stackId="a" fill="#10b981" />
              <Bar dataKey="Midterm" stackId="a" fill="#f59e0b" />
              <Bar dataKey="Final" stackId="a" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Previous Semester Comparison Table & Faculty Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Semester Comparison Table */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif] mb-1">
            Previous Semester Performance Comparison
          </h3>
          <p className="text-xs text-slate-500 mb-4">Historical record from admission to current session</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Semester</th>
                  <th className="py-2.5 px-3">Credits</th>
                  <th className="py-2.5 px-3">GPA</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {semesterHistory.map((sem) => (
                  <tr
                    key={sem.semester}
                    className={sem.semester === 5 ? 'bg-indigo-50/50 font-bold' : ''}
                  >
                    <td className="py-2.5 px-3 text-slate-800">
                      Semester {sem.semester} {sem.semester === 5 && ' (Current)'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{sem.creditHours} Cr.</td>
                    <td className="py-2.5 px-3 text-indigo-700 font-bold">
                      {sem.semester === 5 ? academicSummary.currentSemesterGPA.toFixed(2) : sem.gpa.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          sem.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {sem.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Faculty Remarks & Feedback list */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif]">
                Faculty Remarks & Feedback
              </h3>
              <p className="text-xs text-slate-500">Official guidance and recommendations from instructors</p>
            </div>
            <MessageSquare className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {studentFeedbacks.map((f) => (
              <div
                key={f.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-slate-800">{f.subjectName}</span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                      f.performanceStatus === 'Excellent'
                        ? 'bg-emerald-100 text-emerald-800'
                        : f.performanceStatus === 'Average'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {f.performanceStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{f.remarks}</p>
                <div className="mt-2 text-[10px] text-slate-400 font-medium flex items-center justify-between">
                  <span>Instructor: {f.teacherName}</span>
                  <span>{f.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
