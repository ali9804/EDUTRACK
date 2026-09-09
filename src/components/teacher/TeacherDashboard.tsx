import React from 'react';
import { useAcademic } from '../../context/AcademicContext';
import {
  BookOpen,
  Users,
  CalendarCheck,
  Award,
  Clock,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface TeacherDashboardProps {
  onNavigate: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
  const { currentUser, subjects, users, attendance, marks } = useAcademic();

  // Teacher's assigned subjects
  const assignedSubjects = subjects.filter((s) => s.teacherId === currentUser.id);

  // All enrolled students in teacher's subjects (Semester 5 students)
  const assignedStudents = users.filter(
    (u) => u.role === 'student' && u.status === 'active' && u.semester === 5
  );

  // Attendance stats for teacher's subjects
  const teacherSubjectIds = assignedSubjects.map((s) => s.id);
  const teacherAttendance = attendance.filter((a) => teacherSubjectIds.includes(a.subjectId));
  const totalMarked = teacherAttendance.length;
  const presentCount = teacherAttendance.filter((a) => a.status === 'present').length;
  const avgAttendance = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 85;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Faculty Portal • {currentUser.department}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit',sans-serif]">
            Welcome, {currentUser.name}
          </h1>
          <p className="mt-2 text-emerald-100/90 text-sm leading-relaxed">
            Manage your assigned courses, mark daily session attendance, upload marks assessments, and guide students' academic growth.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('attendance')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-emerald-950 font-bold text-xs shadow-md hover:bg-emerald-50 transition-all"
            >
              <span>Take Attendance Now</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('marks')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 text-white font-bold text-xs border border-emerald-400/30 backdrop-blur-md transition-all"
            >
              <span>Manage Marks & Grading</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Assigned Subjects */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Subjects</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {assignedSubjects.length}
            </span>
            <span className="text-xs font-medium text-slate-500">Active Courses</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 truncate">
            {assignedSubjects.map((s) => s.code).join(', ')}
          </p>
        </div>

        {/* Total Students */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enrolled</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {assignedStudents.length}
            </span>
            <span className="text-xs font-medium text-slate-500">Students</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Under your instruction</p>
        </div>

        {/* Attendance Summary */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Attendance</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {avgAttendance}%
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Healthy
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">{totalMarked} lecture attendances recorded</p>
        </div>

        {/* Today's Classes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Lectures</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {assignedSubjects.length > 0 ? '2' : '0'}
            </span>
            <span className="text-xs font-medium text-slate-500">Scheduled Sessions</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Next: 09:00 AM (Lab 3)</p>
        </div>
      </div>

      {/* Assigned Subjects Overview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-['Outfit',sans-serif]">
              My Teaching Assignments
            </h3>
            <p className="text-xs text-slate-500">Courses currently under your instruction</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignedSubjects.map((sub) => (
            <div
              key={sub.id}
              className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all bg-slate-50/40 hover:bg-white"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                    style={{ backgroundColor: sub.color }}
                  >
                    {sub.code} • {sub.creditHours} Credit Hours
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-2">{sub.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Semester {sub.semester} • {sub.department}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {sub.schedule || 'Regular Weekday'}
                </span>
                <span className="font-semibold text-slate-700">{sub.room || 'Department Hall'}</span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => onNavigate('attendance')}
                  className="flex-1 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
                >
                  Mark Attendance
                </button>
                <button
                  onClick={() => onNavigate('marks')}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Update Marks
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
