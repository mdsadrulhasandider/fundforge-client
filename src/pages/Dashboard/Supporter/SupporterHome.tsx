import React, { useState, useEffect } from 'react';
import { useAuth, api } from '../../../contexts/AuthContext';
import { CreditCard, Heart, Hourglass, CheckCircle2, History, MessageSquareCode } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ContributionType {
  _id: string;
  campaignTitle: string;
  contributionAmount: number;
  supporterName: string;
  creatorName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const SupporterHome: React.FC = () => {
  const { user } = useAuth();
  const [approvedContributions, setApprovedContributions] = useState<ContributionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCount: 0,
    pendingCount: 0,
    approvedCount: 0,
    totalContributedAmount: 0
  });

  useEffect(() => {
    const fetchSupporterData = async () => {
      try {
        // Fetch all contributions to calculate correct stats (without limits)
        const response = await api.get('/contributions/my', { params: { limit: 100 } });
        const list: ContributionType[] = response.data.contributions || [];
        
        const totalCount = list.length;
        const pendingCount = list.filter((c) => c.status === 'pending').length;
        const approvedList = list.filter((c) => c.status === 'approved');
        const approvedCount = approvedList.length;
        const totalContributedAmount = approvedList.reduce((sum, c) => sum + c.contributionAmount, 0);

        setStats({ totalCount, pendingCount, approvedCount, totalContributedAmount });
        
        // Only show top 5 approved list on Home
        setApprovedContributions(approvedList.slice(0, 5));
      } catch (err) {
        console.error('Error fetching supporter dashboard home:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupporterData();
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-10">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-white">Supporter Dashboard</h1>
        <p className="text-xs text-slate-500">Welcome back, {user.name}. Track your contributions and purchase credit packages.</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Available credits */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Available Credits</span>
            <h3 className="text-2xl font-extrabold text-blue-500 font-display">{user.credits}</h3>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        {/* Total Contributed Credits */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Credits Pledged</span>
            <h3 className="text-2xl font-extrabold text-purple-500 font-display">{stats.totalContributedAmount}</h3>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
            <Heart className="w-5 h-5" />
          </div>
        </div>

        {/* Pending contributions count */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Pending Backs</span>
            <h3 className="text-2xl font-extrabold text-amber-500 font-display">{stats.pendingCount}</h3>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <Hourglass className="w-5 h-5" />
          </div>
        </div>

        {/* Approved contributions count */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Approved Backs</span>
            <h3 className="text-2xl font-extrabold text-emerald-500 font-display">{stats.approvedCount}</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Approved Contributions Table */}
      <div className="space-y-4">
        <h3 className="text-base font-bold font-display text-slate-200 flex items-center gap-2">
          <History className="w-4 h-4 text-slate-400" />
          Approved Contributions
        </h3>

        <div className="rounded-2xl border border-slate-900 bg-slate-950/20 overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading approved contributions...</div>
          ) : approvedContributions.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <MessageSquareCode className="w-8 h-8 text-slate-700 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">No approved contributions yet.</p>
              <Link to="/explore" className="inline-block text-[11px] font-semibold text-blue-500 hover:underline">
                Explore Campaigns
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-950/80 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="p-4">Campaign Title</th>
                    <th className="p-4">Credits Contributed</th>
                    <th className="p-4">Creator Name</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 text-slate-300">
                  {approvedContributions.map((cont) => (
                    <tr key={cont._id} className="hover:bg-slate-900/20 transition">
                      <td className="p-4 font-semibold text-slate-200">{cont.campaignTitle}</td>
                      <td className="p-4 font-bold text-blue-400">{cont.contributionAmount} cr</td>
                      <td className="p-4 text-slate-400">{cont.creatorName}</td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {cont.status}
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
    </div>
  );
};

export default SupporterHome;
