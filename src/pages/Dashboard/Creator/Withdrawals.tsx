import React, { useState } from 'react';
import { useAuth, api } from '../../../contexts/AuthContext';
import { CreditCard, Landmark, Wallet, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Withdrawals: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [withdrawCredits, setWithdrawCredits] = useState<number>(200);
  const [paymentSystem, setPaymentSystem] = useState<'Stripe' | 'Bkash' | 'Rocket' | 'Nagad'>('Stripe');
  const [accountNumber, setAccountNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  // Rate: 20 credits = $1
  const withdrawAmount = withdrawCredits / 20;

  // Validation
  const hasMinCredits = user.raisedCredits >= 200;
  const isSufficient = user.raisedCredits >= withdrawCredits && withdrawCredits >= 200;

  const handleWithdrawalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSufficient) {
      toast.error('Invalid credit amount requested');
      return;
    }

    if (!accountNumber) {
      toast.error('Account details are required');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/withdrawals', {
        withdrawCredits,
        paymentSystem,
        accountNumber
      });
      toast.success(response.data.message || 'Withdrawal request submitted!');
      setWithdrawCredits(200);
      setAccountNumber('');
      await refreshUser();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Withdrawal submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-white">Withdrawal Requests</h1>
        <p className="text-xs text-slate-500">Withdraw your campaign earnings directly. Converts at 20 credits = $1 USD.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Raised Credits</span>
            <h3 className="text-2xl font-extrabold text-emerald-500 font-display">{user.raisedCredits} cr</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Equivalent Payout Value</span>
            <h3 className="text-2xl font-extrabold text-blue-500 font-display">${user.raisedCredits / 20}.00 USD</h3>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
            <Landmark className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Withdrawal Form */}
      <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/30">
        <h3 className="text-base font-bold font-display text-slate-200 mb-6">Request Funds Payout</h3>

        {!hasMinCredits ? (
          <div className="p-5 border border-amber-500/10 bg-amber-500/5 text-amber-500 rounded-2xl text-xs leading-relaxed text-center">
            You must raise at least <span className="font-bold">200 credits</span> ($10 USD) before initiating a withdrawal. <br />
            Currently you have raised: <span className="font-bold">{user.raisedCredits} credits</span>.
          </div>
        ) : (
          <form onSubmit={handleWithdrawalRequest} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Credits Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-0.5">
                  Credits to Withdraw
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={200}
                    max={user.raisedCredits}
                    value={withdrawCredits}
                    onChange={(e) => setWithdrawCredits(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 px-4 text-sm text-white font-bold"
                  />
                  <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-500 pointer-events-none">
                    credits
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 pl-0.5">
                  Available: {user.raisedCredits} cr (Min: 200)
                </p>
              </div>

              {/* Amount output */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-0.5">
                  Receiving Amount ($ USD)
                </label>
                <input
                  type="text"
                  disabled
                  value={`$${withdrawAmount}.00 USD`}
                  className="w-full bg-slate-950/40 border border-slate-900 rounded-xl py-2.5 px-4 text-sm text-slate-400 font-bold opacity-75 outline-none"
                />
                <p className="text-[10px] text-slate-500 pl-0.5">
                  Automatic calculation (20 cr = $1)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Payment systems */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-0.5">
                  Payout Method
                </label>
                <select
                  value={paymentSystem}
                  onChange={(e) => setPaymentSystem(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 px-3 text-sm text-white outline-none"
                >
                  <option value="Stripe">Stripe Direct Deposit</option>
                  <option value="Bkash">bKash Personal</option>
                  <option value="Rocket">Rocket Payout</option>
                  <option value="Nagad">Nagad Wallet</option>
                </select>
              </div>

              {/* Account Number */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-0.5">
                  Routing / Account Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: +8801700000000 or IBAN"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-650 outline-none transition"
                />
              </div>
            </div>

            {/* Check balance */}
            {!isSufficient ? (
              <div className="p-3 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-400 text-xs font-semibold text-center">
                Insufficient credit requested. Must be between 200 and {user.raisedCredits} credits.
              </div>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-fit px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Request Withdrawal Payout
                  </>
                )}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Withdrawals;
