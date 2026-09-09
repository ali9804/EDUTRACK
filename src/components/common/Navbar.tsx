import React, { useState } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { Role } from '../../types';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  ChevronDown,
  RotateCcw,
  UserCheck,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, users, switchUser, switchRole, resetToDefaultData } = useAcademic();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'student':
        return {
          label: 'Student Portal',
          icon: GraduationCap,
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      case 'teacher':
        return {
          label: 'Faculty Portal',
          icon: BookOpen,
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'admin':
        return {
          label: 'Admin Portal',
          icon: ShieldCheck,
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
        };
    }
  };

  const badge = getRoleBadge(currentUser.role);
  const RoleIcon = badge.icon;

  const handleRoleChange = (newRole: Role) => {
    switchRole(newRole);
    setShowRoleSwitcher(false);
    // Reset to dashboard when switching role
    setActiveTab('dashboard');
  };

  const handleUserChange = (userId: string) => {
    switchUser(userId);
    setShowUserDropdown(false);
    setActiveTab('dashboard');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Institute Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-200 ring-2 ring-indigo-100">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight font-['Outfit',sans-serif]">
                  EduPulse
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  <Sparkles className="w-3 h-3 text-indigo-500" /> Academic System
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Academic Progress & Records Management
              </p>
            </div>
          </div>

          {/* Quick Role & User Switcher Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Role Toggle Bar */}
            <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                id="role-btn-student"
                onClick={() => handleRoleChange('student')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentUser.role === 'student'
                    ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Student
              </button>
              <button
                id="role-btn-teacher"
                onClick={() => handleRoleChange('teacher')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentUser.role === 'teacher'
                    ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Teacher
              </button>
              <button
                id="role-btn-admin"
                onClick={() => handleRoleChange('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentUser.role === 'admin'
                    ? 'bg-white text-purple-700 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>

            {/* Mobile/Responsive Role Dropdown */}
            <div className="relative lg:hidden">
              <button
                id="mobile-role-switcher"
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border ${badge.bg}`}
              >
                <RoleIcon className="w-3.5 h-3.5" />
                <span>{currentUser.role.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Role
                  </div>
                  <button
                    onClick={() => handleRoleChange('student')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2"
                  >
                    <GraduationCap className="w-4 h-4 text-indigo-600" /> Student View
                  </button>
                  <button
                    onClick={() => handleRoleChange('teacher')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-600" /> Teacher View
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600" /> Admin View
                  </button>
                </div>
              )}
            </div>

            {/* Account Switcher with Profile info */}
            <div className="relative">
              <button
                id="account-profile-menu-button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-300"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      currentUser.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                </div>
                <div className="hidden sm:block leading-tight pr-1">
                  <p className="text-xs font-bold text-slate-800 line-clamp-1">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {currentUser.rollNumber || currentUser.department}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-xs text-slate-500">{currentUser.email}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${badge.bg}`}>
                        <RoleIcon className="w-3 h-3" />
                        {badge.label}
                      </span>
                      {currentUser.rollNumber && (
                        <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {currentUser.rollNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Switch Test Persona</span>
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>

                  <div className="max-h-60 overflow-y-auto px-1">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleUserChange(u.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                          u.id === currentUser.id
                            ? 'bg-slate-100 font-bold text-slate-900'
                            : 'hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-semibold text-slate-800">{u.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {u.role.toUpperCase()} • {u.rollNumber || u.department}
                          </p>
                        </div>
                        {u.id === currentUser.id && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 px-2">
                    <button
                      onClick={() => {
                        resetToDefaultData();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset Demo Data to Defaults
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
