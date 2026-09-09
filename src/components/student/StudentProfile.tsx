import React, { useState } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { UserCheck, Mail, Phone, MapPin, Building, GraduationCap, Shield, Save, Check } from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { currentUser, updateCurrentUserProfile } = useAcademic();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [contactNumber, setContactNumber] = useState(currentUser.contactNumber || '');
  const [address, setAddress] = useState(currentUser.address || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      name,
      email,
      contactNumber,
      address,
      avatar,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Student Profile Information
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Personal, academic, and emergency contact details recorded in institute database.
          </p>
        </div>
        <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-full">
          Verified Student Account
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card & Avatar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
            Identity & Avatar
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={avatar}
                alt={name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-md"
              />
              <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full text-xs">
                <Check className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                  Or select preset student avatar:
                </span>
                <div className="flex items-center gap-2">
                  {AVATAR_PRESETS.map((url, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setAvatar(url)}
                      className={`w-9 h-9 rounded-xl overflow-hidden ring-2 transition-all ${
                        avatar === url ? 'ring-indigo-600 scale-105' : 'ring-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Details (Locked/Official) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Academic Enrollment Records
            </h3>
            <span className="text-[11px] text-slate-400">Locked by Registrar Office</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs text-slate-400 block font-medium">Roll Number</span>
              <span className="text-sm font-mono font-bold text-slate-800">{currentUser.rollNumber}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs text-slate-400 block font-medium">Program</span>
              <span className="text-sm font-bold text-slate-800">{currentUser.program}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs text-slate-400 block font-medium">Department</span>
              <span className="text-sm font-bold text-slate-800">{currentUser.department}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs text-slate-400 block font-medium">Current Semester</span>
              <span className="text-sm font-bold text-indigo-700">Semester {currentUser.semester}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs text-slate-400 block font-medium">Enrollment Status</span>
              <span className="text-sm font-bold text-emerald-600 capitalize">{currentUser.status}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs text-slate-400 block font-medium">Academic Year</span>
              <span className="text-sm font-bold text-slate-800">2022 - 2026</span>
            </div>
          </div>
        </div>

        {/* Contact Information (Editable) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
            Personal & Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Institutional Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Emergency Mobile Contact</label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Permanent Residential Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
            {savedSuccess ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <Check className="w-4 h-4" /> Profile updated successfully!
              </span>
            ) : (
              <span className="text-xs text-slate-400">Verify your information before saving</span>
            )}

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
