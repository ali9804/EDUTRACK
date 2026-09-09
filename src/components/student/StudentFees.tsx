import React, { useState } from 'react';
import { useAcademic } from '../../context/AcademicContext';
import { FeeChallan } from '../../types';
import { formatCurrency } from '../../utils/academicCalculations';
import { ChallanModal } from './ChallanModal';
import {
  CreditCard,
  Printer,
  CheckCircle2,
  AlertCircle,
  Clock,
  History,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const StudentFees: React.FC = () => {
  const { currentUser, challans, updateChallanStatus } = useAcademic();
  const [selectedChallan, setSelectedChallan] = useState<FeeChallan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'Online Banking' | 'Credit Card'>('Online Banking');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Filter student challans
  const studentChallans = challans.filter((c) => c.studentId === currentUser.id);

  // Current semester challan (active)
  const currentChallan = studentChallans.find((c) => c.semester === (currentUser.semester || 5));

  // Past challans
  const pastChallans = studentChallans.filter(
    (c) => c.id !== currentChallan?.id
  );

  const handlePayNow = () => {
    if (!currentChallan) return;
    setIsProcessing(true);
    setTimeout(() => {
      updateChallanStatus(currentChallan.id, 'paid', paymentMethod);
      setIsProcessing(false);
      setShowPaymentModal(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
            Fee & Dues Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Download fee vouchers, verify transaction receipts, and settle dues online.
          </p>
        </div>

        {currentChallan && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedChallan(currentChallan)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Fee Challan</span>
            </button>
            {currentChallan.status === 'unpaid' && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pay Online Now</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Active Current Semester Challan Banner */}
      {currentChallan ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/20">
                  Current Session: Semester {currentChallan.semester}
                </span>
                <span className="text-xs font-mono text-slate-300">
                  Challan No: {currentChallan.challanNo}
                </span>
              </div>
              <h3 className="text-2xl font-black font-['Outfit',sans-serif]">
                Semester {currentChallan.semester} Academic Tuition Fee
              </h3>
              <p className="text-slate-300 text-xs mt-1">
                Issued on {currentChallan.issueDate} • Due Date: {currentChallan.dueDate}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
              <div className="text-right">
                <span className="text-xs text-indigo-200 block">Payable Amount</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-['Outfit',sans-serif]">
                  {formatCurrency(currentChallan.totalAmount)}
                </span>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black uppercase ${
                    currentChallan.status === 'paid'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-rose-500 text-white shadow-sm animate-pulse'
                  }`}
                >
                  {currentChallan.status === 'paid' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> PAID
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5" /> UNPAID
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown items */}
          <div className="p-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Fee Structure Breakdown
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Tuition Fee</span>
                <span className="text-lg font-bold text-slate-800">
                  {formatCurrency(currentChallan.tuitionFee)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Core course instruction</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Examination Fee</span>
                <span className="text-lg font-bold text-slate-800">
                  {formatCurrency(currentChallan.examFee)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Midterm & Final assessments</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Library & Digital Access</span>
                <span className="text-lg font-bold text-slate-800">
                  {formatCurrency(currentChallan.libraryFee)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Journals & IEEE portal</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Computing Lab & Consumables</span>
                <span className="text-lg font-bold text-slate-800">
                  {formatCurrency(currentChallan.labFee)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">High-performance workstations</span>
              </div>
            </div>

            {currentChallan.status === 'paid' && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h5 className="text-xs font-bold text-emerald-900">Payment Succeeded & Reconciled</h5>
                    <p className="text-[11px] text-emerald-700">
                      Paid via {currentChallan.paymentMethod || 'Online Banking'} on {currentChallan.paidDate}.
                      Transaction ID: <span className="font-mono font-bold">{currentChallan.transactionId}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedChallan(currentChallan)}
                  className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
                >
                  Download Receipt
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
          <p className="text-sm text-slate-500">No active fee challan found for the current semester.</p>
        </div>
      )}

      {/* Payment History Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-4 h-4 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
            Payment & Challan History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Challan No</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pastChallans.map((ch) => (
                <tr key={ch.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{ch.challanNo}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">Semester {ch.semester}</td>
                  <td className="py-3.5 px-4 text-slate-500">{ch.issueDate}</td>
                  <td className="py-3.5 px-4 text-slate-500">{ch.dueDate}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{formatCurrency(ch.totalAmount)}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        ch.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {ch.status === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedChallan(ch)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <Printer className="w-3 h-3 text-slate-500" />
                      <span>View Voucher</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Online Payment Modal */}
      {showPaymentModal && currentChallan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 font-['Outfit',sans-serif]">
              Online Fee Payment Portal
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Settle semester tuition dues instantly via secure banking gateway.
            </p>

            <div className="mt-4 p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex justify-between items-center">
              <div>
                <span className="text-[11px] text-indigo-700 font-bold uppercase tracking-wider block">
                  Amount Due
                </span>
                <span className="text-2xl font-black text-indigo-950 font-['Outfit',sans-serif]">
                  {formatCurrency(currentChallan.totalAmount)}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-700">
                #{currentChallan.challanNo}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Select Payment Channel</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Online Banking')}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                    paymentMethod === 'Online Banking'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Building className="w-4 h-4 mb-1.5" />
                  1Link / Online Banking
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Credit Card')}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                    paymentMethod === 'Credit Card'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mb-1.5" />
                  Visa / Mastercard
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Account / Card Number</label>
                <input
                  type="text"
                  defaultValue="4214 •••• •••• 8912"
                  className="w-full mt-1 px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>256-bit SSL encrypted institutional payment gateway</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePayNow}
                className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? 'Processing Transaction...' : `Confirm & Pay ${formatCurrency(currentChallan.totalAmount)}`}
              </button>
            </div>
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
