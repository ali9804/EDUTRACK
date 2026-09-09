import React, { useState, useEffect } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { calculateGradeAndGPA } from '../../utils/academicCalculations';
import { Award, Save, Check, Info, Calculator } from 'lucide-react';

export const TeacherMarks: React.FC = () => {
  const { currentUser, subjects, users, marks, updateStudentMarks } = useAcademic();

  const assignedSubjects = subjects.filter((s) => s.teacherId === currentUser.id);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    assignedSubjects[0]?.id || ''
  );

  const enrolledStudents = users.filter((u) => u.role === 'student' && u.semester === 5);

  // Maintain local state for current editing inputs
  interface MarksInputState {
    assignment: number;
    quiz: number;
    midterm: number;
    finalExam: number;
  }

  const [marksInputs, setMarksInputs] = useState<Record<string, MarksInputState>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize marks inputs when subject changes
  useEffect(() => {
    if (!selectedSubjectId) return;

    const initialMap: Record<string, MarksInputState> = {};
    enrolledStudents.forEach((std) => {
      const existing = marks.find(
        (m) => m.studentId === std.id && m.subjectId === selectedSubjectId
      );
      if (existing) {
        initialMap[std.id] = {
          assignment: existing.assignment,
          quiz: existing.quiz,
          midterm: existing.midterm,
          finalExam: existing.finalExam,
        };
      } else {
        initialMap[std.id] = {
          assignment: 12,
          quiz: 11,
          midterm: 22,
          finalExam: 30,
        };
      }
    });

    setMarksInputs(initialMap);
  }, [selectedSubjectId, marks]);

  const handleInputChange = (
    studentId: string,
    field: keyof MarksInputState,
    value: string,
    maxVal: number
  ) => {
    const num = Math.min(maxVal, Math.max(0, Number(value) || 0));
    setMarksInputs((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: num,
      },
    }));
  };

  const handleSaveMarks = () => {
    enrolledStudents.forEach((std) => {
      const studentMarks = marksInputs[std.id];
      if (studentMarks) {
        updateStudentMarks(std.id, selectedSubjectId, studentMarks);
      }
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Marks & Grade Assessment
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enter marks for assignments, quizzes, midterm and final examinations. System auto-computes GPA & grades.
          </p>
        </div>

        {/* Subject dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500">Subject:</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {assignedSubjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.code} - {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Weightage Banner */}
      <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-indigo-900 font-bold">
          <Calculator className="w-4 h-4 text-indigo-600" />
          <span>Formula & Weightage:</span>
        </div>
        <div className="flex items-center gap-4 text-slate-600 font-medium">
          <span>Assignments: <strong>15 Max</strong></span>
          <span>Quizzes: <strong>15 Max</strong></span>
          <span>Midterm: <strong>30 Max</strong></span>
          <span>Final Exam: <strong>40 Max</strong></span>
          <span className="font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
            Total: 100 Marks
          </span>
        </div>
      </div>

      {/* Marks Entry Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:px-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: currentSubject?.color || '#10b981' }}
            />
            <span className="font-black text-sm text-slate-800">
              {currentSubject?.name} ({currentSubject?.code})
            </span>
            <span className="text-xs text-slate-400">• Continuous Evaluation</span>
          </div>

          <button
            onClick={handleSaveMarks}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save All Grades</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-white text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 sm:px-6">Roll No</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3 text-center">Assignment (15)</th>
                <th className="py-3 px-3 text-center">Quiz (15)</th>
                <th className="py-3 px-3 text-center">Midterm (30)</th>
                <th className="py-3 px-3 text-center">Final (40)</th>
                <th className="py-3 px-3 text-center font-bold text-slate-900">Total (100)</th>
                <th className="py-3 px-3 text-center">Grade</th>
                <th className="py-3 px-4 text-right">GPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enrolledStudents.map((std) => {
                const currentInput = marksInputs[std.id] || {
                  assignment: 0,
                  quiz: 0,
                  midterm: 0,
                  finalExam: 0,
                };
                const total =
                  currentInput.assignment +
                  currentInput.quiz +
                  currentInput.midterm +
                  currentInput.finalExam;
                const { grade, gpa } = calculateGradeAndGPA(total);

                return (
                  <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-slate-700">
                      {std.rollNumber}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={std.avatar}
                          alt={std.name}
                          className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                        />
                        <span>{std.name}</span>
                      </div>
                    </td>

                    {/* Assignment (15) */}
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={15}
                        value={currentInput.assignment}
                        onChange={(e) =>
                          handleInputChange(std.id, 'assignment', e.target.value, 15)
                        }
                        className="w-16 px-2 py-1.5 text-center text-xs font-bold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                      />
                    </td>

                    {/* Quiz (15) */}
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={15}
                        value={currentInput.quiz}
                        onChange={(e) => handleInputChange(std.id, 'quiz', e.target.value, 15)}
                        className="w-16 px-2 py-1.5 text-center text-xs font-bold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                      />
                    </td>

                    {/* Midterm (30) */}
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={currentInput.midterm}
                        onChange={(e) =>
                          handleInputChange(std.id, 'midterm', e.target.value, 30)
                        }
                        className="w-16 px-2 py-1.5 text-center text-xs font-bold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                      />
                    </td>

                    {/* Final (40) */}
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={40}
                        value={currentInput.finalExam}
                        onChange={(e) =>
                          handleInputChange(std.id, 'finalExam', e.target.value, 40)
                        }
                        className="w-16 px-2 py-1.5 text-center text-xs font-bold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                      />
                    </td>

                    {/* Auto Computed Total */}
                    <td className="py-3.5 px-3 text-center font-black text-slate-900 text-sm">
                      {total}
                    </td>

                    {/* Auto Grade */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-black border ${
                          grade === 'A' || grade === 'A-'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : grade === 'B+' || grade === 'B'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : grade === 'C+' || grade === 'C'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        {grade}
                      </span>
                    </td>

                    {/* Auto GPA */}
                    <td className="py-3.5 px-4 text-right font-black text-indigo-700 text-sm">
                      {gpa.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer save banner */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {saveSuccess ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300">
              <Check className="w-4 h-4" /> Marks updated successfully across all student records!
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Grades and GPAs are automatically calculated upon typing.
            </span>
          )}

          <button
            onClick={handleSaveMarks}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Publish & Save All Marks</span>
          </button>
        </div>
      </div>
    </div>
  );
};
