import React from 'react';
import { useAcademic } from '../../context/AcademicContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Award,
  TrendingUp,
  Receipt,
  UserCheck,
  Users,
  BookOpen,
  GraduationCap,
  FileSpreadsheet,
  BarChart3,
} from 'lucide-react';

interface RoleNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const RoleNavigation: React.FC<RoleNavigationProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser } = useAcademic();

  const getTabsForRole = () => {
    switch (currentUser.role) {
      case 'student':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
          { id: 'results', label: 'Results & Marks', icon: Award },
          { id: 'progress', label: 'Academic Progress', icon: TrendingUp },
          { id: 'fees', label: 'Fee Management', icon: Receipt },
          { id: 'profile', label: 'Profile', icon: UserCheck },
        ];
      case 'teacher':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'students', label: 'Student Management', icon: Users },
          { id: 'attendance', label: 'Attendance Management', icon: CalendarCheck },
          { id: 'marks', label: 'Marks & Results', icon: Award },
          { id: 'progress', label: 'Student Progress & Remarks', icon: TrendingUp },
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
          { id: 'students', label: 'Student Management', icon: GraduationCap },
          { id: 'teachers', label: 'Teacher Management', icon: Users },
          { id: 'subjects', label: 'Subject Management', icon: BookOpen },
          { id: 'attendance', label: 'Attendance Records', icon: CalendarCheck },
          { id: 'fees', label: 'Fee Management', icon: Receipt },
          { id: 'reports', label: 'Institute Reports', icon: BarChart3 },
        ];
    }
  };

  const tabs = getTabsForRole();

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? currentUser.role === 'student'
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                      : currentUser.role === 'teacher'
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                      : 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
