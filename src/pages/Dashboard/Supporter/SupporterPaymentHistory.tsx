import React, { useState, useEffect } from 'react';
import { api } from '../../../contexts/AuthContext';
import { CreditCard, Loader2 } from 'lucide-react';

interface PaymentType {
  _id: string;
  packageName: string;
  credits: number;
  amount: number;
  transactionId: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const SupporterPaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get('/payments/my');
        setPayments(response.data.payments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-white">Payment History</h1>
        <p className="text-xs text-slate-500">Review all credit packages purchased via Stripe or demo logs.</p>
      </div>

      <div className="rounded-2xl border border-slate-900 bg-slate-950/20 overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="text-xs text-slate-500">Loading purchase logs...</span>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <CreditCard className="w-8 h-8 text-slate-700 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">No payment history found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/80 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="p-4">Package Details</th>
                  <th className="p-4">Credits Added</th>
                  <th className="p-4">Amount Paid</th>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-slate-300">
                {payments.map((pay) => (
                  <tr key={pay._id} className="hover:bg-slate-900/20 transition">
                    <td className="p-4 font-semibold text-slate-200">{pay.packageName}</td>
                    <td className="p-4 font-bold text-emerald-400">+{pay.credits} cr</td>
                    <td className="p-4 text-white">${pay.amount} USD</td>
                    <td className="p-4 text-slate-400 font-mono">{pay.transactionId}</td>
                    <td className="p-4 text-slate-400 capitalize">{pay.paymentMethod.replace('_', ' ')}</td>
                    <td className="p-4 text-slate-500">
                      {new Date(pay.createdAt).toLocaleDateString()} at {new Date(pay.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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

export default SupporterPaymentHistory;
