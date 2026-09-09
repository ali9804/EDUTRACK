import React, { useState } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { Subject } from '../../types';
import { BookOpen, Plus, Search, Edit2, Trash2, Clock, MapPin, Save } from 'lucide-react';

export const AdminSubjects: React.FC = () => {
  const { subjects, users, addSubject, updateSubject, deleteSubject } = useAcademic();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const teachers = users.filter((u) => u.role === 'teacher');

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: 'Computer Science',
    semester: 5,
    creditHours: 3,
    teacherId: '',
    teacherName: '',
    schedule: 'Mon, Wed 09:00 AM - 10:30 AM',
    room: 'Hall B / Lab 3',
    color: '#6366f1',
  });

  const filteredSubjects = subjects.filter((s) => {
    return (
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const openAddModal = () => {
    setFormData({
      name: '',
      code: 'CS-',
      department: 'Computer Science',
      semester: 5,
      creditHours: 3,
      teacherId: teachers[0]?.id || '',
      teacherName: teachers[0]?.name || '',
      schedule: 'Tue, Thu 11:00 AM - 12:30 PM',
      room: 'Room 204',
      color: '#10b981',
    });
    setEditingSubject(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (sub: Subject) => {
    setEditingSubject(sub);
    setFormData({
      name: sub.name,
      code: sub.code,
      department: sub.department,
      semester: sub.semester,
      creditHours: sub.creditHours,
      teacherId: sub.teacherId,
      teacherName: sub.teacherName,
      schedule: sub.schedule || '',
      room: sub.room || '',
      color: sub.color || '#6366f1',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedTeacher = teachers.find((t) => t.id === formData.teacherId);
    const resolvedTeacherName = assignedTeacher ? assignedTeacher.name : 'Unassigned';

    const payload = {
      ...formData,
      teacherName: resolvedTeacherName,
    };

    if (editingSubject) {
      updateSubject(editingSubject.id, payload);
    } else {
      addSubject(payload);
    }
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete course "${name}"? This removes its timetable and curriculum records.`)) {
      deleteSubject(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Curriculum & Subject Catalog
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure courses, assign instructional faculty, schedule classrooms, and define credit hours.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search courses by title, course code, or professor name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSubjects.map((sub) => (
          <div
            key={sub.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-all"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className="text-[10px] font-extrabold px-2.5 py-0.5 rounded text-white"
                    style={{ backgroundColor: sub.color }}
                  >
                    {sub.code} • {sub.creditHours} Credit Hours
                  </span>
                  <h4 className="font-bold text-base text-slate-900 mt-2.5 line-clamp-1">
                    {sub.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Semester {sub.semester} • {sub.department}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Instructor:</span>
                  <span className="font-bold text-slate-800">{sub.teacherName}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> Schedule:
                  </span>
                  <span className="font-medium text-slate-700">{sub.schedule}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5" /> Classroom:
                  </span>
                  <span className="font-semibold text-slate-800">{sub.room}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5">
              <button
                onClick={() => openEditModal(sub)}
                className="p-1.5 rounded-lg text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 transition-colors"
                title="Edit Course"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(sub.id, sub.name)}
                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                title="Delete Course"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Subject Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 font-['Outfit',sans-serif]">
              {editingSubject ? 'Edit Curriculum Course' : 'Create New Course Offering'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Configure course identifiers, faculty assignment, and lecture schedule.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Subject / Course Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Distributed Cloud Computing"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. CS-301"
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Credit Hours
                  </label>
                  <select
                    value={formData.creditHours}
                    onChange={(e) =>
                      setFormData({ ...formData, creditHours: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={1}>1 Credit Hour (Lab only)</option>
                    <option value={2}>2 Credit Hours</option>
                    <option value={3}>3 Credit Hours (Standard)</option>
                    <option value={4}>4 Credit Hours (Theory + Lab)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Target Semester
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) =>
                      setFormData({ ...formData, semester: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Assigned Faculty
                  </label>
                  <select
                    value={formData.teacherId}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Class Schedule
                  </label>
                  <input
                    type="text"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    placeholder="Mon, Wed 09:00 - 10:30 AM"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Classroom / Hall
                  </label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="Room 102 / Lab 4"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Course Badge Color
                </label>
                <div className="flex items-center gap-3">
                  {['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#14b8a6'].map(
                    (c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setFormData({ ...formData, color: c })}
                        className={`w-7 h-7 rounded-full transition-transform ${
                          formData.color === c ? 'scale-125 ring-2 ring-purple-600' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    )
                  )}
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
                  <span>{editingSubject ? 'Save Changes' : 'Create Course'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
