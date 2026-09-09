import React from 'react';
import { FeeChallan } from '../../types';
import { formatCurrency } from '../../utils/academicCalculations';
import { Printer, X, Download, CheckCircle2, Building2 } from 'lucide-react';

interface ChallanModalProps {
  challan: FeeChallan;
  onClose: () => void;
}

export const ChallanModal: React.FC<ChallanModalProps> = ({ challan, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const renderVoucherCopy = (copyTitle: string) => (
    <div className="border border-slate-300 p-4 bg-white flex flex-col justify-between text-[11px] leading-tight">
      <div>
        {/* Header */}
        <div className="border-b-2 border-slate-800 pb-2 text-center">
          <div className="flex items-center justify-center gap-1 font-black text-xs uppercase tracking-wider text-slate-900">
            <Building2 className="w-3.5 h-3.5" />
            <span>National University of Technology</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">HBL / Bank Alfalah Collection Voucher</p>
          <div className="mt-1 inline-block bg-slate-900 text-white font-extrabold px-2 py-0.5 rounded text-[10px] uppercase">
            {copyTitle}
          </div>
        </div>

        {/* Account Details */}
        <div className="mt-2 bg-slate-50 p-2 rounded border border-slate-200">
          <div className="flex justify-between">
            <span className="text-slate-500">A/C Title:</span>
            <span className="font-bold text-slate-800">NUTECH Academic Fees</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">A/C No:</span>
            <span className="font-mono font-bold text-slate-900">0129-4920192801</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Challan No:</span>
            <span className="font-mono font-bold text-indigo-700">{challan.challanNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Due Date:</span>
            <span className="font-bold text-rose-700">{challan.dueDate}</span>
          </div>
        </div>

        {/* Student Details */}
        <div className="mt-2 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Student Name:</span>
            <span className="font-bold text-slate-800">{challan.studentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Roll Number:</span>
            <span className="font-mono font-bold text-slate-800">{challan.rollNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Department:</span>
            <span className="font-semibold text-slate-700">{challan.department}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Semester:</span>
            <span className="font-bold text-slate-800">Semester {challan.semester}</span>
          </div>
        </div>

        {/* Breakdown Table */}
        <table className="w-full mt-3 border-collapse text-[10px]">
          <thead>
            <tr className="border-y border-slate-300 bg-slate-100 font-bold text-slate-700">
              <th className="py-1 px-1 text-left">Fee Head</th>
              <th className="py-1 px-1 text-right">Amount (PKR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr>
              <td className="py-1 px-1">Tuition Fee</td>
              <td className="py-1 px-1 text-right font-mono">{formatCurrency(challan.tuitionFee)}</td>
            </tr>
            <tr>
              <td className="py-1 px-1">Examination Fee</td>
              <td className="py-1 px-1 text-right font-mono">{formatCurrency(challan.examFee)}</td>
            </tr>
            <tr>
              <td className="py-1 px-1">Library & Digital Resources</td>
              <td className="py-1 px-1 text-right font-mono">{formatCurrency(challan.libraryFee)}</td>
            </tr>
            <tr>
              <td className="py-1 px-1">Computing Lab Fee</td>
              <td className="py-1 px-1 text-right font-mono">{formatCurrency(challan.labFee)}</td>
            </tr>
            <tr className="bg-slate-50 font-black border-t-2 border-slate-800 text-[11px]">
              <td className="py-1.5 px-1">Total Payable</td>
              <td className="py-1.5 px-1 text-right text-indigo-900 font-mono">
                {formatCurrency(challan.totalAmount)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Status Stamp if paid */}
        {challan.status === 'paid' && (
          <div className="mt-3 p-1.5 border border-emerald-500 bg-emerald-50 text-emerald-800 rounded text-center font-black uppercase text-[10px]">
            ✓ PAID & VERIFIED ON {challan.paidDate || 'ONLINE'}
            <br />
            <span className="font-mono text-[9px] font-normal">Txn: {challan.transactionId || 'SYS-OK'}</span>
          </div>
        )}
      </div>

      {/* Footer Signatures */}
      <div className="mt-6 pt-3 border-t border-dashed border-slate-300 flex justify-between text-[9px] text-slate-400">
        <div>Depositor's Signature</div>
        <div>Bank Officer / Cashier</div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div>
            <h3 className="font-black text-slate-900 text-base font-['Outfit',sans-serif]">
              Official Fee Voucher / Challan
            </h3>
            <p className="text-xs text-slate-500">Challan #{challan.challanNo} • Due: {challan.dueDate}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Body (Standard 3-copies: Bank Copy, Institute Copy, Student Copy) */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:m-0 print:p-0 print:border-none">
            {renderVoucherCopy('Bank Copy')}
            {renderVoucherCopy('Institute / Accounts Copy')}
            {renderVoucherCopy('Student Copy')}
          </div>
        </div>
      </div>
    </div>
  );
};
