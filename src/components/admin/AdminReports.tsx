import React from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { formatCurrency, calculateOverallGPA } from '../../utils/academicCalculations';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  FileText,
  Printer,
  TrendingUp,
  AlertTriangle,
  Award,
  Users,
  GraduationCap,
  CreditCard,
  CalendarCheck,
  CheckCircle2,
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { users, subjects, attendance, marks, challans } = useAcademic();

  const students = users.filter((u) => u.role === 'student');
  const teachers = users.filter((u) => u.role === 'teacher');

  // Attendance metrics
  const totalAttendanceRecords = attendance.length;
  const presentCount = attendance.filter((a) => a.status === 'present').length;
  const lateCount = attendance.filter((a) => a.status === 'late').length;
  const avgAttendance =
    totalAttendanceRecords > 0
      ? Math.round(((presentCount + lateCount * 0.7) / totalAttendanceRecords) * 100)
      : 84;

  // Identify Short Attendance Students (< 75%)
  const shortAttendanceStudents = students
    .map((std) => {
      const studentAtt = attendance.filter((a) => a.studentId === std.id);
      const totalClasses = studentAtt.length;
      const present = studentAtt.filter((a) => a.status === 'present').length;
      const late = studentAtt.filter((a) => a.status === 'late').length;
      const pct =
        totalClasses > 0 ? Math.round(((present + late * 0.7) / totalClasses) * 100) : 100;
      return {
        student: std,
        totalClasses,
        pct,
      };
    })
    .filter((item) => item.pct < 75);

  // Grade Distribution
  const gradeCounts: Record<string, number> = {
    A: 0,
    'A-': 0,
    'B+': 0,
    B: 0,
    'B-': 0,
    'C+': 0,
    C: 0,
    F: 0,
  };

  marks.forEach((m) => {
    if (gradeCounts[m.grade] !== undefined) {
      gradeCounts[m.grade]++;
    }
  });

  const gradeChartData = Object.entries(gradeCounts).map(([grade, count]) => ({
    grade,
    count,
  }));

  // Pass vs Fail Ratio
  const totalEvaluated = marks.length;
  const failedCount = marks.filter((m) => m.grade === 'F').length;
  const passedCount = totalEvaluated - failedCount;
  const passFailData = [
    { name: 'Passed', value: passedCount, color: '#10b981' },
    { name: 'Failed', value: failedCount, color: '#ef4444' },
  ];

  // Fee Analytics
  const totalPaid = challans
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + c.totalAmount, 0);
  const totalUnpaid = challans
    .filter((c) => c.status === 'unpaid')
    .reduce((sum, c) => sum + c.totalAmount, 0);

  const feeData = [
    { name: 'Collected', value: totalPaid, color: '#8b5cf6' },
    { name: 'Outstanding', value: totalUnpaid, color: '#f43f5e' },
  ];

  // Top Student Rankings / Dean's Honor Roll
  const studentRankings = students
    .map((std) => {
      const studentMarks = marks.filter((m) => m.studentId === std.id);
      const studentSubjects = subjects.filter((s) =>
        studentMarks.some((m) => m.subjectId === s.id)
      );
      const gpa = calculateOverallGPA(studentMarks, studentSubjects);
      return {
        student: std,
        gpa,
      };
    })
    .sort((a, b) => b.gpa - a.gpa);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Comprehensive Institute Academic Audit
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official analytical performance reports, short attendance warnings, grade bell curve, and fee collection summaries.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export Report</span>
        </button>
      </div>

      {/* Official Executive Summary Banner for Print / Display */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded bg-purple-500/30 text-purple-300 border border-purple-400/20">
              Department of Computer Science • Fall 2026 Session
            </span>
            <h3 className="text-2xl sm:text-3xl font-black mt-2 font-['Outfit',sans-serif]">
              Executive Performance & Compliance Audit
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Generated on {new Date().toLocaleDateString('en-US', { dateStyle: 'full' })} • System Status: Operational
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-200 block">Students</span>
              <span className="text-xl font-black">{students.length}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-200 block">Faculty</span>
              <span className="text-xl font-black">{teachers.length}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-200 block">Attendance</span>
              <span className="text-xl font-black text-emerald-300">{avgAttendance}%</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-200 block">Pass Rate</span>
              <span className="text-xl font-black text-purple-200">
                {Math.round((passedCount / (totalEvaluated || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif]">
                Grade Bell Curve Distribution
              </h3>
              <p className="text-xs text-slate-500">Aggregate letter grades awarded across all courses</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="grade" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pass / Fail & Fee Donut Charts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Pass vs Fail */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 font-['Outfit',sans-serif] mb-1">
              Pass / Fail Clearance
            </h4>
            <p className="text-[11px] text-slate-500 mb-3">Overall examination success</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={passFailData}
                    cx="50%"
                    cy="50%"
                    innerRadius={36}
                    outerRadius={60}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {passFailData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Passed ({passedCount})
              </span>
              <span className="flex items-center gap-1.5 text-rose-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Failed ({failedCount})
              </span>
            </div>
          </div>

          {/* Fee Recovery */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 font-['Outfit',sans-serif] mb-1">
              Fee Recovery Ratio
            </h4>
            <p className="text-[11px] text-slate-500 mb-3">Tuition arrears reconciliation</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={feeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={36}
                    outerRadius={60}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {feeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => formatCurrency(Number(val))} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-purple-700">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Paid
              </span>
              <span className="flex items-center gap-1.5 text-rose-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Pending
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Short Attendance Risk Flags & Dean's Honor Roll */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Short Attendance Risk Flags */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <div>
                <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif]">
                  Short Attendance Watchlist (&lt;75%)
                </h3>
                <p className="text-xs text-slate-500">Students facing exam debarment risk</p>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              {shortAttendanceStudents.length} Flagged
            </span>
          </div>

          {shortAttendanceStudents.length > 0 ? (
            <div className="space-y-3">
              {shortAttendanceStudents.map(({ student, pct }) => (
                <div
                  key={student.id}
                  className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/40 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-9 h-9 rounded-xl object-cover ring-1 ring-rose-200"
                    />
                    <div>
                      <p className="font-bold text-xs text-slate-900">{student.name}</p>
                      <p className="text-[11px] font-mono text-slate-500">
                        {student.rollNumber} • Semester {student.semester}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                      {pct}% Attendance
                    </span>
                    <span className="text-[10px] text-rose-600 block mt-0.5">Formal Notice Issued</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
              All enrolled students currently meet the minimum 75% attendance threshold.
            </div>
          )}
        </div>

        {/* Dean's Honor Roll / Top Performers */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif]">
                  Dean's Honor Roll & Merit Rankings
                </h3>
                <p className="text-xs text-slate-500">Highest cumulative grade point averages</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Top Academic Standing
            </span>
          </div>

          <div className="space-y-3">
            {studentRankings.slice(0, 5).map(({ student, gpa }, rank) => (
              <div
                key={student.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      rank === 0
                        ? 'bg-amber-400 text-amber-950 shadow-xs'
                        : rank === 1
                        ? 'bg-slate-300 text-slate-900'
                        : rank === 2
                        ? 'bg-amber-600/70 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {rank + 1}
                  </span>
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <p className="font-bold text-xs text-slate-900">{student.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{student.rollNumber}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-indigo-700 font-mono">
                    {gpa.toFixed(2)} CGPA
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 block">
                    Distinction Honor
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
