import React from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { Award, CheckCircle2, FileText, Info, HelpCircle } from 'lucide-react';

export const StudentResults: React.FC = () => {
  const { currentUser, getStudentAcademicSummary } = useAcademic();
  const summary = getStudentAcademicSummary(currentUser.id);

  const totalPossibleMarks = summary.subjectMarks.length * 100;
  const totalObtainedMarks = summary.subjectMarks.reduce(
    (sum, s) => sum + s.marksRecord.totalMarks,
    0
  );
  const overallPercentage =
    totalPossibleMarks > 0 ? Math.round((totalObtainedMarks / totalPossibleMarks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header & Result Summary Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Academic Performance Report
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-['Outfit',sans-serif] mt-1">
              Semester {currentUser.semester || 5} Results & Marks
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Official academic transcript card for currently enrolled credit courses. Grade point averages are calculated according to the standard 4.0 scale.
            </p>
          </div>

          {/* GPA Score Badge */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="text-right">
              <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider block">
                Semester GPA
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-white font-['Outfit',sans-serif]">
                  {summary.currentSemesterGPA.toFixed(2)}
                </span>
                <span className="text-xs text-indigo-200">/ 4.00</span>
              </div>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div>
              <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider block">
                Cumulative CGPA
              </span>
              <span className="text-xl font-extrabold text-amber-300 font-['Outfit',sans-serif]">
                {summary.overallCGPA.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Result Metrics bar */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-xs text-slate-400 block">Total Marks</span>
            <span className="text-lg font-bold text-white">
              {totalObtainedMarks} / {totalPossibleMarks} ({overallPercentage}%)
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Credits Earned</span>
            <span className="text-lg font-bold text-emerald-400">
              {summary.passedCredits} / {summary.totalCredits} Cr. Hrs
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Academic Standing</span>
            <span className="text-lg font-bold text-indigo-300">
              {summary.currentSemesterGPA >= 3.5 ? 'Dean’s Honor List' : 'Good Standing'}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Evaluation Status</span>
            <span className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Verified
            </span>
          </div>
        </div>
      </div>

      {/* Subject Marks Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
              Subject-wise Marks Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Continuous assessment distribution: Assignments (15%), Quizzes (15%), Midterm (30%), Final Exam (40%)
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Info className="w-3.5 h-3.5 text-indigo-500" />
            <span>Total Weightage: 100 Marks</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Course</th>
                <th className="py-3.5 px-3 text-center">Credit</th>
                <th className="py-3.5 px-3 text-center">Assignments (15)</th>
                <th className="py-3.5 px-3 text-center">Quizzes (15)</th>
                <th className="py-3.5 px-3 text-center">Midterm (30)</th>
                <th className="py-3.5 px-3 text-center">Final (40)</th>
                <th className="py-3.5 px-3 text-center font-black text-slate-800">Total (100)</th>
                <th className="py-3.5 px-3 text-center">Grade</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">GPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summary.subjectMarks.map(({ subject, marksRecord }) => {
                return (
                  <tr key={subject.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-2.5 h-10 rounded-full shrink-0"
                          style={{ backgroundColor: subject.color }}
                        />
                        <div>
                          <p className="font-bold text-slate-900">{subject.name}</p>
                          <p className="text-xs text-slate-400 font-mono">
                            {subject.code} • {subject.teacherName}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-3 text-center font-semibold text-slate-600">
                      {subject.creditHours}
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span className="font-semibold text-slate-700">{marksRecord.assignment}</span>
                      <span className="text-[10px] text-slate-400">/15</span>
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span className="font-semibold text-slate-700">{marksRecord.quiz}</span>
                      <span className="text-[10px] text-slate-400">/15</span>
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span className="font-semibold text-slate-700">{marksRecord.midterm}</span>
                      <span className="text-[10px] text-slate-400">/30</span>
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span className="font-semibold text-slate-700">{marksRecord.finalExam}</span>
                      <span className="text-[10px] text-slate-400">/40</span>
                    </td>

                    <td className="py-4 px-3 text-center font-black text-slate-900 text-sm">
                      {marksRecord.totalMarks}
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black border ${
                          marksRecord.grade === 'A' || marksRecord.grade === 'A-'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : marksRecord.grade === 'B+' || marksRecord.grade === 'B'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : marksRecord.grade === 'C+' || marksRecord.grade === 'C'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        {marksRecord.grade}
                      </span>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right font-black text-indigo-700 text-sm">
                      {marksRecord.gpa.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading Scale Scheme Card */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Official University Grading Rubric
          </h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-xs">
          <div className="bg-white p-2 rounded-xl border border-slate-200">
            <span className="font-black text-emerald-700 block text-sm">85 - 100</span>
            <span className="text-slate-500 text-[11px]">Grade A (4.0)</span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200">
            <span className="font-black text-emerald-600 block text-sm">80 - 84</span>
            <span className="text-slate-500 text-[11px]">Grade A- (3.7)</span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200">
            <span className="font-black text-blue-700 block text-sm">75 - 79</span>
            <span className="text-slate-500 text-[11px]">Grade B+ (3.3)</span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200">
            <span className="font-black text-blue-600 block text-sm">70 - 74</span>
            <span className="text-slate-500 text-[11px]">Grade B (3.0)</span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200">
            <span className="font-black text-amber-700 block text-sm">65 - 69</span>
            <span className="text-slate-500 text-[11px]">Grade C+ (2.7)</span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200">
            <span className="font-black text-amber-600 block text-sm">60 - 64</span>
            <span className="text-slate-500 text-[11px]">Grade C (2.3)</span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200">
            <span className="font-black text-rose-700 block text-sm">&lt; 50</span>
            <span className="text-slate-500 text-[11px]">Grade F (0.0)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
