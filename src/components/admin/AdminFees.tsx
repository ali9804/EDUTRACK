import React, { useState } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { FeeChallan } from '../../types';
import { formatCurrency } from '../../utils/academicCalculations';
import { ChallanModal } from '../student/ChallanModal';
import {
  CreditCard,
  Plus,
  Search,
  Printer,
  CheckCircle2,
  Clock,
  Filter,
  DollarSign,
  TrendingUp,
  Layers,
  Save,
} from 'lucide-react';

export const AdminFees: React.FC = () => {
  const { challans, users, generateChallan, updateChallanStatus } = useAcademic();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedChallan, setSelectedChallan] = useState<FeeChallan | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generationType, setGenerationType] = useState<'single' | 'bulk'>('single');

  // Form State
  const enrolledStudents = users.filter((u) => u.role === 'student');
  const [targetStudentId, setTargetStudentId] = useState(enrolledStudents[0]?.id || '');
  const [targetSemester, setTargetSemester] = useState<number>(5);
  const [tuitionFee, setTuitionFee] = useState<number>(65000);
  const [examFee, setExamFee] = useState<number>(8000);
  const [libraryFee, setLibraryFee] = useState<number>(4000);
  const [labFee, setLabFee] = useState<number>(8000);
  const [dueDate, setDueDate] = useState<string>('2026-09-30');
  const [successNotice, setSuccessNotice] = useState<string>('');

  const filteredChallans = challans.filter((c) => {
    const matchesSearch =
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.challanNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    if (generationType === 'single') {
      const student = enrolledStudents.find((s) => s.id === targetStudentId);
      if (!student) return;

      generateChallan({
        studentId: student.id,
        studentName: student.name,
        rollNumber: student.rollNumber || 'CS-2022-000',
        program: student.program || 'BS Computer Science',
        semester: targetSemester,
        tuitionFee,
        examFee,
        libraryFee,
        labFee,
        dueDate,
      });

      setSuccessNotice(`Challan issued successfully for ${student.name}`);
    } else {
      // Bulk generation for all students in target semester
      const semesterStudents = enrolledStudents.filter(
        (s) => s.semester === targetSemester && s.status === 'active'
      );

      semesterStudents.forEach((std) => {
        generateChallan({
          studentId: std.id,
          studentName: std.name,
          rollNumber: std.rollNumber || 'CS-2022-000',
          program: std.program || 'BS Computer Science',
          semester: targetSemester,
          tuitionFee,
          examFee,
          libraryFee,
          labFee,
          dueDate,
        });
      });

      setSuccessNotice(
        `Batch challans generated for ${semesterStudents.length} students of Semester ${targetSemester}`
      );
    }

    setIsGenerateModalOpen(false);
    setTimeout(() => setSuccessNotice(''), 3500);
  };

  // High level financial metrics
  const totalPaid = challans
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + c.totalAmount, 0);

  const totalUnpaid = challans
    .filter((c) => c.status === 'unpaid')
    .reduce((sum, c) => sum + c.totalAmount, 0);

  const totalInvoiced = totalPaid + totalUnpaid;
  const recoveryPct = totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Student Fee Billing & Accounts
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate customized 3-part bank challans, adjust fee heads, track online reconciliations, and record payments.
          </p>
        </div>

        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Issue New Fee Challan</span>
        </button>
      </div>

      {successNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total Invoiced Dues
          </span>
          <span className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif] mt-1 block">
            {formatCurrency(totalInvoiced)}
          </span>
          <p className="text-xs text-slate-500 mt-1">{challans.length} vouchers issued</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
            Total Reconciled & Paid
          </span>
          <span className="text-2xl font-black text-emerald-700 font-['Outfit',sans-serif] mt-1 block">
            {formatCurrency(totalPaid)}
          </span>
          <p className="text-xs text-emerald-600 mt-1">Direct bank deposits & online transfers</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">
            Outstanding Arrears
          </span>
          <span className="text-2xl font-black text-rose-700 font-['Outfit',sans-serif] mt-1 block">
            {formatCurrency(totalUnpaid)}
          </span>
          <p className="text-xs text-rose-500 mt-1">Pending student clearance</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">
            Recovery Performance
          </span>
          <span className="text-2xl font-black text-purple-700 font-['Outfit',sans-serif] mt-1 block">
            {recoveryPct}%
          </span>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${recoveryPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search challans by student name, roll number, or challan ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid Only</option>
            <option value="unpaid">Unpaid / Defaulters</option>
          </select>
        </div>
      </div>

      {/* Challan Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 sm:px-6">Challan No</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredChallans.map((ch) => (
                <tr key={ch.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-slate-800">
                    {ch.challanNo}
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{ch.studentName}</p>
                    <p className="text-[11px] font-mono text-slate-400">{ch.rollNumber}</p>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    Semester {ch.semester}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">{ch.dueDate}</td>

                  <td className="py-3.5 px-4 font-black text-slate-900">
                    {formatCurrency(ch.totalAmount)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        ch.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {ch.status === 'paid' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Paid
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" /> Unpaid
                        </>
                      )}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {ch.status === 'unpaid' ? (
                        <button
                          onClick={() => updateChallanStatus(ch.id, 'paid', 'Bank Branch Cash')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-colors"
                        >
                          Mark Paid
                        </button>
                      ) : (
                        <button
                          onClick={() => updateChallanStatus(ch.id, 'unpaid')}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-colors"
                        >
                          Mark Unpaid
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedChallan(ch)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>View Voucher</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Challan Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 font-['Outfit',sans-serif]">
              Issue Academic Fee Challan
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select single student billing or initiate batch generation for an entire semester cohort.
            </p>

            <form onSubmit={handleGenerate} className="mt-4 space-y-4">
              {/* Mode Switcher */}
              <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setGenerationType('single')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    generationType === 'single'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Single Student Challan
                </button>
                <button
                  type="button"
                  onClick={() => setGenerationType('bulk')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    generationType === 'bulk'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Cohort Batch Generation
                </button>
              </div>

              {generationType === 'single' ? (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Select Target Student
                  </label>
                  <select
                    value={targetStudentId}
                    onChange={(e) => setTargetStudentId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  >
                    {enrolledStudents.map((std) => (
                      <option key={std.id} value={std.id}>
                        {std.name} ({std.rollNumber}) - Sem {std.semester}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Select Cohort Semester
                  </label>
                  <select
                    value={targetSemester}
                    onChange={(e) => setTargetSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s} Students
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Fee Heads */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Tuition Fee (PKR)
                  </label>
                  <input
                    type="number"
                    value={tuitionFee}
                    onChange={(e) => setTuitionFee(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Exam Fee (PKR)
                  </label>
                  <input
                    type="number"
                    value={examFee}
                    onChange={(e) => setExamFee(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Library Fee (PKR)
                  </label>
                  <input
                    type="number"
                    value={libraryFee}
                    onChange={(e) => setLibraryFee(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Laboratory Fee (PKR)
                  </label>
                  <input
                    type="number"
                    value={labFee}
                    onChange={(e) => setLabFee(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Payment Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-purple-900">Total Payable per Voucher:</span>
                <span className="font-black text-purple-950 text-sm">
                  {formatCurrency(tuitionFee + examFee + libraryFee + labFee)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {generationType === 'single'
                      ? 'Issue Challan'
                      : 'Generate Cohort Batch'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Challan Modal */}
      {selectedChallan && (
        <ChallanModal challan={selectedChallan} onClose={() => setSelectedChallan(null)} />
      )}
    </div>
  );
};
