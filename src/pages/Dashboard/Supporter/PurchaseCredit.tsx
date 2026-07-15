import React, { useState } from 'react';
import { useAuth, api } from '../../../contexts/AuthContext';
import { CreditCard, ShieldCheck, Zap, Award, Crown, Loader2, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

const PACKAGES = [
  { id: '100-credits', name: 'Bronze Package', credits: 100, price: 10, icon: Zap, color: 'text-amber-500 border-amber-500/10 hover:border-amber-500/30' },
  { id: '300-credits', name: 'Silver Package', credits: 300, price: 25, icon: Award, color: 'text-slate-400 border-slate-700 hover:border-slate-600' },
  { id: '800-credits', name: 'Gold Package', credits: 800, price: 60, icon: Crown, color: 'text-yellow-500 border-yellow-500/10 hover:border-yellow-500/30' },
  { id: '1500-credits', name: 'Platinum Package', credits: 1500, price: 110, icon: ShieldCheck, color: 'text-purple-500 border-purple-500/10 hover:border-purple-500/30' }
];

const PurchaseCredit: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [selectedPack, setSelectedPack] = useState<typeof PACKAGES[0] | null>(null);
  const [paymentMode, setPaymentMode] = useState<'stripe' | 'dummy'>('dummy');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [paying, setPaying] = useState(false);

  if (!user) return null;

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPack) return;

    setPaying(true);
    
    // Simulate payment transaction
    setTimeout(async () => {
      try {
        const payload = {
          packageName: selectedPack.name,
          credits: selectedPack.credits,
          amount: selectedPack.price,
          // Generate a fake transaction ID for demo
          transactionId: paymentMode === 'stripe' ? `str_${Math.random().toString(36).substr(2, 9)}` : `dum_${Math.random().toString(36).substr(2, 9)}`,
          paymentMethod: paymentMode === 'stripe' ? 'stripe_card' : 'dummy_demo'
        };

        const response = await api.post('/payments/confirm', payload);
        toast.success(response.data.message || 'Payment confirmed, credits added!');
        await refreshUser(); // Update navbar credit amount
        setSelectedPack(null); // Close checkout
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error processing transaction');
      } finally {
        setPaying(false);
      }
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-display text-white">Purchase Credits</h1>
        <p className="text-xs text-slate-500">Buy credits to support causes. Credits are immediately added to your ledger.</p>
      </div>

      {/* Package grids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PACKAGES.map((pkg) => {
          const Icon = pkg.icon;
          return (
            <div
              key={pkg.id}
              onClick={() => setSelectedPack(pkg)}
              className={`p-6 rounded-2xl border bg-slate-950/40 cursor-pointer flex flex-col justify-between h-56 transition hover:scale-[1.02] ${pkg.color}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Package</span>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-display">{pkg.credits} Credits</h3>
                  <p className="text-xs text-slate-500">{pkg.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-900/60">
                <span className="text-xs text-slate-400">Price</span>
                <span className="text-lg font-extrabold text-white">${pkg.price} USD</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payout checkout sheet (Modal) */}
      {selectedPack && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
            {/* Header */}
            <div>
              <h3 className="text-lg font-bold font-display text-white">Secure Checkout</h3>
              <p className="text-xs text-slate-400">
                Buying <span className="font-semibold text-white">{selectedPack.credits} credits</span> for{' '}
                <span className="font-semibold text-white">${selectedPack.price}</span>
              </p>
            </div>

            {/* Mode selection toggle */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-850">
              <button
                type="button"
                onClick={() => setPaymentMode('dummy')}
                className={`py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  paymentMode === 'dummy' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Dummy Payment (Demo)
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode('stripe')}
                className={`py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  paymentMode === 'stripe' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Stripe Payments
              </button>
            </div>

            {/* Payment fields form */}
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {paymentMode === 'stripe' ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-0.5">
                      Card Number
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                        <CreditCard className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2 px-10 text-xs text-white placeholder-slate-650 outline-none transition"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-0.5">
                        MM / YY
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="12/28"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-650 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-0.5">
                        CVC
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-650 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-blue-500/10 bg-blue-900/10 flex items-start gap-3">
                  <KeyRound className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">Demo Environment</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">
                      No card details required. Click buy and our system will confirm a dummy transaction immediately.
                    </p>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedPack(null)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paying}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {paying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    `Pay $${selectedPack.price}.00`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseCredit;
