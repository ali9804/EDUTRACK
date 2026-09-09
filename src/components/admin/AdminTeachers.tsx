import React, { useState } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { User } from '../../types';
import { Users, Plus, Search, Edit2, Trash2, BookOpen, Save, CheckCircle2 } from 'lucide-react';

export const AdminTeachers: React.FC = () => {
  const { users, subjects, addTeacher, updateTeacher, deleteTeacher, updateSubject } = useAcademic();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingTeacher, setEditingTeacher] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Computer Science',
    contactNumber: '',
    status: 'active' as 'active' | 'suspended',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    assignedSubjectIds: [] as string[],
  });

  const teachers = users.filter((u) => u.role === 'teacher');

  const filteredTeachers = teachers.filter((t) => {
    return (
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const openAddModal = () => {
    setFormData({
      name: '',
      email: '',
      department: 'Computer Science',
      contactNumber: '+92 300 1122334',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      assignedSubjectIds: [],
    });
    setEditingTeacher(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (teacher: User) => {
    setEditingTeacher(teacher);
    // Find all subjects currently assigned to this teacher
    const teacherSubjects = subjects.filter((s) => s.teacherId === teacher.id).map((s) => s.id);

    setFormData({
      name: teacher.name,
      email: teacher.email,
      department: teacher.department,
      contactNumber: teacher.contactNumber || '',
      status: teacher.status,
      avatar: teacher.avatar,
      assignedSubjectIds: teacherSubjects,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeacher) {
      updateTeacher(editingTeacher.id, formData);

      // Re-link subjects
      subjects.forEach((sub) => {
        const shouldBeAssigned = formData.assignedSubjectIds.includes(sub.id);
        if (shouldBeAssigned && sub.teacherId !== editingTeacher.id) {
          updateSubject(sub.id, {
            teacherId: editingTeacher.id,
            teacherName: formData.name,
          });
        } else if (!shouldBeAssigned && sub.teacherId === editingTeacher.id) {
          updateSubject(sub.id, {
            teacherId: '',
            teacherName: 'Unassigned',
          });
        }
      });
    } else {
      addTeacher({
        ...formData,
        role: 'teacher',
      });
    }
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove instructor "${name}"? Courses assigned to this teacher will be unlinked.`)) {
      deleteTeacher(id);
      // Unlink subjects
      subjects.forEach((sub) => {
        if (sub.teacherId === id) {
          updateSubject(sub.id, {
            teacherId: '',
            teacherName: 'Unassigned',
          });
        }
      });
    }
  };

  const handleSubjectToggle = (subjectId: string) => {
    setFormData((prev) => {
      const exists = prev.assignedSubjectIds.includes(subjectId);
      return {
        ...prev,
        assignedSubjectIds: exists
          ? prev.assignedSubjectIds.filter((id) => id !== subjectId)
          : [...prev.assignedSubjectIds, subjectId],
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Faculty & Instructor Administration
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain faculty directory, assign instructional course loads, and oversee department allocations.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search faculty by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map((tea) => {
          const teaSubjects = subjects.filter((s) => s.teacherId === tea.id);

          return (
            <div
              key={tea.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={tea.avatar}
                      alt={tea.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-100 shadow-sm"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{tea.name}</h4>
                      <p className="text-xs text-slate-400">{tea.email}</p>
                      <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                        {tea.department}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      tea.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {tea.status.toUpperCase()}
                  </span>
                </div>

                {/* Assigned Courses list */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Assigned Courses ({teaSubjects.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {teaSubjects.length > 0 ? (
                      teaSubjects.map((sub) => (
                        <span
                          key={sub.id}
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {sub.code}: {sub.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No courses currently assigned</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">{tea.contactNumber || 'N/A'}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(tea)}
                    className="p-1.5 rounded-lg text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 transition-colors"
                    title="Edit Faculty Details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tea.id, tea.name)}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    title="Delete Faculty"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 font-['Outfit',sans-serif]">
              {editingTeacher ? 'Edit Faculty Record' : 'Register New Faculty Member'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Configure instructor profile details and assign instructional courses.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Faculty Member Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Kamran Ashraf"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="faculty@university.edu"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    placeholder="+92 301 1234567"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                </select>
              </div>

              {/* Assign Subjects */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Assign Teaching Courses
                </label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                  {subjects.map((sub) => {
                    const isChecked = formData.assignedSubjectIds.includes(sub.id);
                    return (
                      <label
                        key={sub.id}
                        className="flex items-center gap-2 text-xs text-slate-800 p-1.5 hover:bg-white rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSubjectToggle(sub.id)}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span className="font-bold">{sub.code}:</span>
                        <span className="truncate">{sub.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono ml-auto">
                          ({sub.creditHours} Cr)
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingTeacher ? 'Save Changes' : 'Register Faculty'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
