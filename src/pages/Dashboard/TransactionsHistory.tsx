import React, { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';
import { History, RefreshCw, Landmark, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';

interface TransactionType {
  _id: string;
  type: 'purchase' | 'contribution' | 'refund' | 'withdrawal' | 'bonus';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

const TransactionsHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/payments/transactions');
      setTransactions(response.data.transactions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
      case 'refund':
      case 'bonus':
        return <ArrowUpRight className="w-4 h-4 text-emerald-500 bg-emerald-500/10 p-0.5 rounded" />;
      default:
        return <ArrowDownLeft className="w-4 h-4 text-rose-500 bg-rose-500/10 p-0.5 rounded" />;
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'purchase':
      case 'refund':
      case 'bonus':
        return 'text-emerald-400 font-bold';
      default:
        return 'text-rose-400 font-bold';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
            <History className="w-6 h-6 text-blue-500" />
            Credit Ledger Audit Log
          </h1>
          <p className="text-xs text-slate-500">Chronological history of all credit additions, contributions, refunds, and withdrawals.</p>
        </div>
        <button
          onClick={fetchTransactions}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="rounded-2xl border border-slate-900 bg-slate-950/20 overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="text-xs text-slate-550">Retrieving audit log...</span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Landmark className="w-8 h-8 text-slate-700 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">No ledger audit records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/80 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="p-4">Action</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Credits Adjustment</th>
                  <th className="p-4">Ledger Before</th>
                  <th className="p-4">Ledger After</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-slate-300">
                {transactions.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-900/20 transition">
                    <td className="p-4 flex items-center gap-2">
                      {getTransactionIcon(t.type)}
                      <span className="font-semibold text-slate-200">{t.description}</span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-900 text-slate-400 border border-slate-800">
                        {t.type}
                      </span>
                    </td>
                    <td className={`p-4 ${getAmountColor(t.type)}`}>
                      {['purchase', 'refund', 'bonus'].includes(t.type) ? '+' : '-'}{t.amount} cr
                    </td>
                    <td className="p-4 text-slate-400 font-medium">{t.balanceBefore} cr</td>
                    <td className="p-4 text-slate-100 font-bold">{t.balanceAfter} cr</td>
                    <td className="p-4 text-slate-500">
                      {new Date(t.createdAt).toLocaleDateString()} at {new Date(t.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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

export default TransactionsHistory;
