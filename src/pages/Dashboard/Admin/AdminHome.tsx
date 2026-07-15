import React, { useState, useEffect } from 'react';
import { api } from '../../../contexts/AuthContext';
import { Users, CreditCard, Layers, Landmark, Loader2 } from 'lucide-react';

interface CategoryStat {
  _id: string;
  count: number;
  raised: number;
}

interface StatsType {
  totalUsers: number;
  totalCreators: number;
  totalSupporters: number;
  totalCredits: number;
  totalCampaigns: number;
  totalRevenue: number;
  categories: CategoryStat[];
}

const AdminHome: React.FC = () => {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="text-xs text-slate-500">Compiling system stats...</span>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-white">System Overview</h1>
        <p className="text-xs text-slate-500">Administrative command panel for platform operations and ledger balances.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Members</span>
            <h3 className="text-2xl font-extrabold text-blue-500 font-display">{stats.totalUsers}</h3>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Total Campaigns */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Campaigns</span>
            <h3 className="text-2xl font-extrabold text-purple-500 font-display">{stats.totalCampaigns}</h3>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</span>
            <h3 className="text-2xl font-extrabold text-emerald-500 font-display">${stats.totalRevenue}.00</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Landmark className="w-5 h-5" />
          </div>
        </div>

        {/* Sum credits */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">System Credits</span>
            <h3 className="text-2xl font-extrabold text-sky-500 font-display">
              {stats.totalCredits > 999999 ? 'Huge' : stats.totalCredits}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-500">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Role Breakdown grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Roles */}
        <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/30 space-y-4">
          <h3 className="text-sm font-bold font-display text-slate-200 uppercase tracking-wider">Membership Mix</h3>
          <div className="space-y-3.5 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-400">Supporters (Pledgers)</span>
                <span className="text-white">{stats.totalSupporters}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(stats.totalSupporters / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-400">Creators (Initiators)</span>
                <span className="text-white">{stats.totalCreators}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${(stats.totalCreators / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Aggregate list */}
        <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/30 space-y-4">
          <h3 className="text-sm font-bold font-display text-slate-200 uppercase tracking-wider">Top Vetted Categories</h3>
          <div className="space-y-3">
            {stats.categories.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No campaign aggregates to show.</p>
            ) : (
              stats.categories.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-900/60 pb-2">
                  <span className="font-semibold text-slate-300">{cat._id}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500">{cat.count} projects</span>
                    <span className="font-bold text-blue-400">{cat.raised} cr raised</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
