import React, { useState } from 'react';
import { AcademicProvider, useAcademic } from './context/AcademicContext';
import { Navbar } from './components/common/Navbar';
import { RoleNavigation } from './components/common/RoleNavigation';

// Student Components
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentAttendance } from './components/student/StudentAttendance';
import { StudentResults } from './components/student/StudentResults';
import { StudentProgress } from './components/student/StudentProgress';
import { StudentFees } from './components/student/StudentFees';
import { StudentProfile } from './components/student/StudentProfile';

// Teacher Components
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeacherStudents } from './components/teacher/TeacherStudents';
import { TeacherAttendance } from './components/teacher/TeacherAttendance';
import { TeacherMarks } from './components/teacher/TeacherMarks';
import { TeacherFeedbackView } from './components/teacher/TeacherFeedbackView';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminStudents } from './components/admin/AdminStudents';
import { AdminTeachers } from './components/admin/AdminTeachers';
import { AdminSubjects } from './components/admin/AdminSubjects';
import { AdminAttendance } from './components/admin/AdminAttendance';
import { AdminFees } from './components/admin/AdminFees';
import { AdminReports } from './components/admin/AdminReports';

const AppContent: React.FC = () => {
  const { currentUser } = useAcademic();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const renderContent = () => {
    // 1. Student Views
    if (currentUser.role === 'student') {
      switch (activeTab) {
        case 'dashboard':
          return <StudentDashboard onNavigate={setActiveTab} />;
        case 'attendance':
          return <StudentAttendance />;
        case 'results':
          return <StudentResults />;
        case 'progress':
          return <StudentProgress />;
        case 'fees':
          return <StudentFees />;
        case 'profile':
          return <StudentProfile />;
        default:
          return <StudentDashboard onNavigate={setActiveTab} />;
      }
    }

    // 2. Teacher Views
    if (currentUser.role === 'teacher') {
      switch (activeTab) {
        case 'dashboard':
          return <TeacherDashboard onNavigate={setActiveTab} />;
        case 'students':
          return <TeacherStudents />;
        case 'attendance':
          return <TeacherAttendance />;
        case 'marks':
          return <TeacherMarks />;
        case 'progress':
          return <TeacherFeedbackView />;
        default:
          return <TeacherDashboard onNavigate={setActiveTab} />;
      }
    }

    // 3. Admin Views
    if (currentUser.role === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard onNavigate={setActiveTab} />;
        case 'students':
          return <AdminStudents />;
        case 'teachers':
          return <AdminTeachers />;
        case 'subjects':
          return <AdminSubjects />;
        case 'attendance':
          return <AdminAttendance />;
        case 'fees':
          return <AdminFees />;
        case 'reports':
          return <AdminReports />;
        default:
          return <AdminDashboard onNavigate={setActiveTab} />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar with quick role/persona switcher */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Role Navigation Tab bar */}
      <RoleNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 print:hidden">
        <p>
          EduPulse Student Academic Progress Management System • Fall 2026 Academic Session
        </p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AcademicProvider>
      <AppContent />
    </AcademicProvider>
  );
}
