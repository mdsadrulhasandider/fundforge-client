import React, { useState, useEffect } from 'react';
import { api } from '../../../contexts/AuthContext';
import { CreditCard, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface WithdrawalType {
  _id: string;
  creatorName: string;
  creatorEmail: string;
  withdrawCredits: number;
  withdrawAmount: number;
  paymentSystem: string;
  accountNumber: string;
  status: 'pending' | 'approved';
  createdAt: string;
}

const WithdrawalRequests: React.FC = () => {
  const [requests, setRequests] = useState<WithdrawalType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = async () => {
    try {
      const response = await api.get('/withdrawals/pending'); // Admin endpoint
      setRequests(response.data.withdrawals || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleApproveWithdrawal = async (id: string) => {
    const confirm = window.confirm('Verify that you have processed this payment to the creator. Proceed to mark as Success?');
    if (!confirm) return;

    try {
      const response = await api.put(`/withdrawals/${id}/approve`);
      toast.success(response.data.message || 'Withdrawal approved successfully!');
      fetchWithdrawals();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error processing approval');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-500" />
            Withdrawal Requests
          </h1>
          <p className="text-xs text-slate-500">Review payout queries from creators. Deducts raised credits upon confirmation.</p>
        </div>
        <button
          onClick={fetchWithdrawals}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="rounded-2xl border border-slate-900 bg-slate-950/20 overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="text-xs text-slate-500">Loading withdrawals queue...</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No pending withdrawal requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/80 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="p-4">Creator Details</th>
                  <th className="p-4">Credits Redeemed</th>
                  <th className="p-4">Payout Value</th>
                  <th className="p-4">Payout System</th>
                  <th className="p-4">Account details</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-slate-300">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-900/20 transition">
                    <td className="p-4">
                      <span className="font-semibold text-slate-200 block">{req.creatorName}</span>
                      <span className="text-[10px] text-slate-550">{req.creatorEmail}</span>
                    </td>
                    <td className="p-4 font-bold text-slate-350">{req.withdrawCredits} cr</td>
                    <td className="p-4 font-extrabold text-emerald-400">${req.withdrawAmount}.00 USD</td>
                    <td className="p-4 text-slate-400 font-medium">{req.paymentSystem}</td>
                    <td className="p-4 text-slate-400 font-mono">{req.accountNumber}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleApproveWithdrawal(req._id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1 mx-auto"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Payment Success
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalRequests;
