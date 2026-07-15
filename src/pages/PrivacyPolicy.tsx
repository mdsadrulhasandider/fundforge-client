import React from 'react';
import { ShieldAlert } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 text-slate-400">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex p-3 rounded-full bg-blue-600/10 text-blue-500">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold font-display text-white">Privacy Policy</h1>
        <p className="text-xs">Last Updated: July 15, 2026</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-200 font-display">1. Information Collection</h2>
          <p>
            FundForge collects basic account information when you register, including your name, email address, password hashes, and optional profile photos. We also log credit transaction records, withdrawal queries, contribution logs, and campaign submissions to verify operations and prevent system abuse.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-200 font-display">2. Cookies Policy</h2>
          <p>
            We implement strict cookie policies for authentication. Our API sets an HTTP-only secure cookie containing your Access Token (`accessToken`) and Refresh Token (`refreshToken`). These cookies are marked `SameSite=None` or `SameSite=Lax` depending on deployment. They are not readable by client-side scripts, protecting your credentials from cross-site scripting (XSS) extraction.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-200 font-display">3. Third Party Integrations</h2>
          <p>
            When purchasing credit packages, Stripe verifies payment credentials. Credit cards and details are processed directly on Stripe secure elements; FundForge does not store credit card credentials on local database servers. Profile images or campaign images uploaded by users are stored securely on imgBB.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-200 font-display">4. Account Removal and Data Rights</h2>
          <p>
            Users can contact administrative support to request account suspension or total user deletion. Admin deletion removes all related entries from the database, while campaign deletion refunds active contributions back to backing supporter credit balances.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
