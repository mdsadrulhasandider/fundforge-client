import React, { useState, useEffect } from 'react';
import { api } from '../../../contexts/AuthContext';
import { CreditCard, Loader2 } from 'lucide-react';

interface WithdrawalType {
  _id: string;
  withdrawCredits: number;
  withdrawAmount: number;
  paymentSystem: string;
  accountNumber: string;
  status: 'pending' | 'approved';
  createdAt: string;
}

const CreatorPaymentHistory: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await api.get('/withdrawals/my');
        setWithdrawals(response.data.withdrawals || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWithdrawals();
  }, []);

  const getStatusBadge = (status: string) => {
    if (status === 'approved') {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
    return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-white">Withdrawal Payouts History</h1>
        <p className="text-xs text-slate-500">View status updates of payouts requested via Stripe, bKash, or local methods.</p>
      </div>

      <div className="rounded-2xl border border-slate-900 bg-slate-950/20 overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="text-xs text-slate-500">Loading payout records...</span>
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <CreditCard className="w-8 h-8 text-slate-700 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">No withdrawal payout records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/80 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="p-4">Credits Redeemed</th>
                  <th className="p-4">Value ($ USD)</th>
                  <th className="p-4">Payment System</th>
                  <th className="p-4">Account Number</th>
                  <th className="p-4">Date Requested</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-slate-300">
                {withdrawals.map((w) => (
                  <tr key={w._id} className="hover:bg-slate-900/20 transition">
                    <td className="p-4 font-bold text-slate-200">{w.withdrawCredits} cr</td>
                    <td className="p-4 font-bold text-blue-400">${w.withdrawAmount}.00 USD</td>
                    <td className="p-4 text-slate-400 font-medium">{w.paymentSystem}</td>
                    <td className="p-4 text-slate-400 font-mono">{w.accountNumber}</td>
                    <td className="p-4 text-slate-500">
                      {new Date(w.createdAt).toLocaleDateString()} at {new Date(w.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(w.status)}`}>
                        {w.status}
                      </span>
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

export default CreatorPaymentHistory;
