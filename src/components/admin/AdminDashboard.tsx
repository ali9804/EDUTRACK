import React from 'react';
import { useAcademic } from '../../context/AcademicContext';
import {
  GraduationCap,
  Users,
  BookOpen,
  CalendarCheck,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency } from '../../utils/academicCalculations';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { users, subjects, attendance, marks, challans } = useAcademic();

  const students = users.filter((u) => u.role === 'student');
  const teachers = users.filter((u) => u.role === 'teacher');
  const activeStudents = students.filter((s) => s.status === 'active');

  // Attendance metrics
  const totalAttendanceRecords = attendance.length;
  const presentCount = attendance.filter((a) => a.status === 'present').length;
  const avgAttendance =
    totalAttendanceRecords > 0 ? Math.round((presentCount / totalAttendanceRecords) * 100) : 84;

  // Fee metrics
  const totalPaid = challans
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + c.totalAmount, 0);
  const totalPending = challans
    .filter((c) => c.status === 'unpaid')
    .reduce((sum, c) => sum + c.totalAmount, 0);
  const recoveryRate =
    totalPaid + totalPending > 0 ? Math.round((totalPaid / (totalPaid + totalPending)) * 100) : 0;

  // Pass / Fail count
  const evaluatedMarks = marks.filter((m) => m.grade !== 'Pending');
  const passedMarks = evaluatedMarks.filter((m) => m.grade !== 'F');
  const passRate =
    evaluatedMarks.length > 0
      ? Math.round((passedMarks.length / evaluatedMarks.length) * 100)
      : 96;

  return (
    <div className="space-y-6">
      {/* Admin Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl shadow-purple-950/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-purple-200 text-xs font-semibold mb-3 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            <span>Central Administration Control System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit',sans-serif]">
            Institute Academic Management Dashboard
          </h1>
          <p className="mt-2 text-purple-100/90 text-sm leading-relaxed">
            Centralized controller for student enrollments, faculty subject allocations, institute-wide attendance audit, semester exam results, and fee collection operations.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('students')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-purple-950 font-bold text-xs shadow-md hover:bg-purple-50 transition-all"
            >
              <span>Manage Students</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('fees')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-800/60 hover:bg-purple-800 text-white font-bold text-xs border border-purple-400/30 backdrop-blur-md transition-all"
            >
              <span>Generate Fee Challans</span>
              <CreditCard className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-800/60 hover:bg-purple-800 text-white font-bold text-xs border border-purple-400/30 backdrop-blur-md transition-all"
            >
              <span>View Institute Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {students.length}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              {activeStudents.length} Active
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">BS Computer Science Program</p>
        </div>

        {/* Total Faculty */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Faculty Members
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {teachers.length}
            </span>
            <span className="text-xs font-medium text-slate-500">Professors & Lecturers</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">{subjects.length} active subject courses</p>
        </div>

        {/* Fee Collection Recovery */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Fee Collection
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {recoveryRate}%
            </span>
            <span className="text-xs font-bold text-emerald-600">Collected</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {formatCurrency(totalPaid)} received ({formatCurrency(totalPending)} pending)
          </p>
        </div>

        {/* Pass / Fail Ratio */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pass / Fail Ratio
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {passRate}%
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              High Clearance
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Overall institute passing benchmark</p>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif]">
              Student Administration
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add new student registrations, edit student profile details, enroll into semesters, and suspend or activate accounts.
            </p>
          </div>
          <button
            onClick={() => onNavigate('students')}
            className="mt-4 w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors"
          >
            Open Student Directory
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif]">
              Faculty & Course Allocation
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Manage faculty members, assign subjects, configure weekly class schedules, and balance instructional loads.
            </p>
          </div>
          <button
            onClick={() => onNavigate('teachers')}
            className="mt-4 w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors"
          >
            Open Faculty Manager
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif]">
              Fee Billing & Challan Engine
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Issue individual or batch semester fee vouchers, customize fee heads (tuition, lab, library), and reconcile bank deposits.
            </p>
          </div>
          <button
            onClick={() => onNavigate('fees')}
            className="mt-4 w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors"
          >
            Manage Fee Challans
          </button>
        </div>
      </div>
    </div>
  );
};
