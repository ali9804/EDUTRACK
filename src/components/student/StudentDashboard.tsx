import React from 'react';
import { useAcademic } from '../../context/AcademicContext';
import {
  BookOpen,
  CalendarCheck,
  Award,
  CreditCard,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency } from '../../utils/academicCalculations';

interface StudentDashboardProps {
  onNavigate: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { currentUser, subjects, challans, feedbacks, getStudentAttendanceStats, getStudentAcademicSummary } =
    useAcademic();

  const attendanceStats = getStudentAttendanceStats(currentUser.id);
  const academicSummary = getStudentAcademicSummary(currentUser.id);

  // Filter student's subjects
  const studentSubjects = subjects.filter((s) => s.semester === currentUser.semester);

  // Pending fee challans
  const pendingChallans = challans.filter(
    (c) => c.studentId === currentUser.id && c.status === 'unpaid'
  );
  const totalPendingAmount = pendingChallans.reduce((sum, c) => sum + c.totalAmount, 0);

  // Recent feedbacks
  const studentFeedbacks = feedbacks.filter((f) => f.studentId === currentUser.id);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Semester {currentUser.semester || 5} • {currentUser.program}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit',sans-serif]">
            Welcome back, {currentUser.name}! 👋
          </h1>
          <p className="mt-2 text-indigo-100/90 text-sm leading-relaxed">
            Your academic overview for current semester is looking solid. Keep maintaining consistent attendance and prepare for upcoming midterm/final assessments.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              id="dash-view-attendance-btn"
              onClick={() => onNavigate('attendance')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-indigo-900 font-bold text-xs shadow-md hover:bg-indigo-50 transition-all"
            >
              <span>View Attendance Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="dash-view-results-btn"
              onClick={() => onNavigate('results')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 text-white font-bold text-xs border border-indigo-400/30 backdrop-blur-md transition-all"
            >
              <span>Check Grades & GPA</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-400/20 to-transparent pointer-events-none" />
      </div>

      {/* Critical Alert if Attendance is below 75% or fees due */}
      {attendanceStats.overallPercentage < 75 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-rose-900">Attendance Warning: Short Attendance Detected</h4>
            <p className="text-xs text-rose-700 mt-0.5">
              Your overall attendance is currently at {attendanceStats.overallPercentage}%, which is below the mandatory 75% threshold required to sit in the final examinations.
            </p>
          </div>
          <button
            onClick={() => onNavigate('attendance')}
            className="text-xs font-bold text-rose-700 hover:text-rose-900 underline whitespace-nowrap"
          >
            Review Subjects
          </button>
        </div>
      )}

      {pendingChallans.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">Pending Fee Challan Alert</h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Challan {pendingChallans[0].challanNo} for {formatCurrency(pendingChallans[0].totalAmount)} is due on {pendingChallans[0].dueDate}. Please clear dues to avoid late surcharges.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('fees')}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs whitespace-nowrap shadow-xs"
          >
            View Challan
          </button>
        </div>
      )}

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Subjects */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-indigo-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Subjects</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {studentSubjects.length}
            </span>
            <span className="text-xs font-medium text-slate-500">Enrolled Courses</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {academicSummary.totalCredits} Credit Hours this semester
          </p>
        </div>

        {/* Overall Attendance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-indigo-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Attendance</span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                attendanceStats.overallPercentage >= 80
                  ? 'bg-emerald-50 text-emerald-600'
                  : attendanceStats.overallPercentage >= 75
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-rose-50 text-rose-600'
              }`}
            >
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {attendanceStats.overallPercentage}%
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                attendanceStats.overallPercentage >= 80
                  ? 'bg-emerald-100 text-emerald-800'
                  : attendanceStats.overallPercentage >= 75
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {attendanceStats.status}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {attendanceStats.presentClasses} present out of {attendanceStats.totalClasses} total lectures
          </p>
        </div>

        {/* Current Semester GPA & CGPA */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-indigo-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Semester GPA</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {academicSummary.currentSemesterGPA.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-slate-500">/ 4.00</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-500">Overall CGPA:</span>
            <span className="font-bold text-indigo-700">{academicSummary.overallCGPA.toFixed(2)}</span>
          </div>
        </div>

        {/* Fee Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-indigo-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fee Balance</span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                totalPendingAmount === 0
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-rose-50 text-rose-600'
              }`}
            >
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {totalPendingAmount === 0 ? 'Rs. 0' : formatCurrency(totalPendingAmount)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-500">Status:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                totalPendingAmount === 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {totalPendingAmount === 0 ? 'All Clear' : 'Dues Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Results & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Results breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif]">
                Recent Academic Results
              </h3>
              <p className="text-xs text-slate-500">Current Semester 5 performance breakdown</p>
            </div>
            <button
              onClick={() => onNavigate('results')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View Full Marks <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {academicSummary.subjectMarks.map(({ subject, marksRecord }) => (
              <div key={subject.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-2.5 h-10 rounded-full shrink-0"
                    style={{ backgroundColor: subject.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{subject.name}</p>
                    <p className="text-xs text-slate-400">
                      {subject.code} • {subject.teacherName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs text-slate-500">Total Marks</span>
                    <p className="text-sm font-bold text-slate-800">{marksRecord.totalMarks}/100</p>
                  </div>
                  <div className="text-center min-w-[48px]">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                        marksRecord.grade === 'A' || marksRecord.grade === 'A-'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : marksRecord.grade === 'B+' || marksRecord.grade === 'B'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : marksRecord.grade === 'C' || marksRecord.grade === 'C+'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {marksRecord.grade}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">GPA: {marksRecord.gpa.toFixed(1)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Progress Summary & Teacher Remarks */}
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif]">
                Academic Summary
              </h3>
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">Credits Completed</span>
                  <span className="text-slate-900">
                    {academicSummary.passedCredits} / {academicSummary.totalCredits} Cr.
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{
                      width: `${
                        academicSummary.totalCredits > 0
                          ? (academicSummary.passedCredits / academicSummary.totalCredits) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">Attendance Benchmark</span>
                  <span className="text-slate-900">{attendanceStats.overallPercentage}% (Target 85%)</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      attendanceStats.overallPercentage >= 80
                        ? 'bg-emerald-500'
                        : attendanceStats.overallPercentage >= 75
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${attendanceStats.overallPercentage}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Degree Standing:</span>
                <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {academicSummary.overallCGPA >= 3.5 ? 'First Class Distinction' : 'Good Standing'}
                </span>
              </div>
            </div>
          </div>

          {/* Teacher Feedback preview */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif]">
                Faculty Remarks
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">
                {studentFeedbacks.length} notes
              </span>
            </div>

            {studentFeedbacks.length > 0 ? (
              <div className="space-y-3">
                {studentFeedbacks.slice(0, 2).map((f) => (
                  <div key={f.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{f.subjectName}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
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
                    <p className="mt-1 text-slate-600 line-clamp-2">{f.remarks}</p>
                    <p className="mt-1.5 text-[10px] text-slate-400 font-medium">
                      By {f.teacherName} • {f.date}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No remarks logged yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
