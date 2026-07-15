import React from 'react';
import { Target, Users, Landmark, Flame } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">
      {/* Intro */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold font-display text-white">About FundForge</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
          We bridge the gap between brilliant concepts and passionate backers, offering a secure platform for micro-funding, tracking rewards, and building communities.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-4">
          <div className="p-3 rounded-xl bg-blue-600/10 text-blue-500 w-fit">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-slate-100 font-display">Targeted Milestones</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            We focus on structured funding goals. Campaigns specify exact rewards and timelines so supporters know where their credits are directed.
          </p>
        </div>
        <div className="p-8 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-4">
          <div className="p-3 rounded-xl bg-purple-600/10 text-purple-500 w-fit">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-slate-100 font-display">Active Community</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Supporters explore active categories, comment on progress, receive real-time notifications, and review reward delivery schedules.
          </p>
        </div>
        <div className="p-8 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-4">
          <div className="p-3 rounded-xl bg-emerald-600/10 text-emerald-500 w-fit">
            <Landmark className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-slate-100 font-display">Double-Ledger Safety</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Credit checks and withdrawal reviews prevent double-spending. If a campaign is canceled, credits are returned to supporters automatically.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="rounded-3xl border border-slate-900 bg-slate-950/20 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-500">
            <Flame className="w-4 h-4" />
            Our Vision
          </div>
          <h2 className="text-3xl font-bold font-display text-white">Fueling the next generation of creative builds.</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            FundForge was founded on the idea that crowdfunding should be highly secure, gamified, and community-driven. By replacing traditional complex payment streams with local platform credits, supporters can contribute micro-amounts easily, and creators can build momentum before initiating major dollar withdrawals.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Whether you want to build a smart clean-energy generator, publish an indie graphics novel, or support local medical centers, FundForge provides the tools, access controls, and transparency to get it funded.
          </p>
        </div>
        <div className="aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800"
            alt="Team Collaboration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
