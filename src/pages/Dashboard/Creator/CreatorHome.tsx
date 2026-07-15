import React, { useState, useEffect } from 'react';
import { useAuth, api } from '../../../contexts/AuthContext';
import { LayoutDashboard, CheckSquare, Users, Calendar, Award } from 'lucide-react';
import toast from 'react-hot-toast';

interface CampaignType {
  _id: string;
  title: string;
  fundingGoal: number;
  amountRaised: number;
  supportersCount: number;
  deadline: string;
  status: string;
}

interface ContributionType {
  _id: string;
  campaignId: string;
  campaignTitle: string;
  contributionAmount: number;
  supporterName: string;
  supporterEmail: string;
  status: string;
  createdAt: string;
}

const CreatorHome: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [contributions, setContributions] = useState<ContributionType[]>([]);
  const [selectedContribution, setSelectedContribution] = useState<ContributionType | null>(null);

  // Stats derived
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => new Date(c.deadline) > new Date() && c.status === 'approved').length;
  const totalSupporters = campaigns.reduce((sum, c) => sum + c.supportersCount, 0);

  const loadCreatorData = async () => {
    try {
      const campRes = await api.get('/campaigns/my');
      setCampaigns(campRes.data.campaigns || []);

      const contRes = await api.get('/contributions/reviews');
      setContributions(contRes.data.contributions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCreatorData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const response = await api.put(`/contributions/${id}/approve`);
      toast.success(response.data.message || 'Contribution approved!');
      loadCreatorData();
      await refreshUser();
      setSelectedContribution(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Approval failed');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await api.put(`/contributions/${id}/reject`);
      toast.success(response.data.message || 'Contribution rejected and credits refunded!');
      loadCreatorData();
      await refreshUser();
      setSelectedContribution(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Rejection failed');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-10">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-white">Creator Dashboard</h1>
        <p className="text-xs text-slate-500">Welcome back, {user.name}. Manage campaigns and review supporter credits.</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Campaigns */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Campaigns</span>
            <h3 className="text-2xl font-extrabold text-blue-500 font-display">{totalCampaigns}</h3>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
            <LayoutDashboard className="w-5 h-5" />
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Active Goals</span>
            <h3 className="text-2xl font-extrabold text-purple-500 font-display">{activeCampaigns}</h3>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Total Credits Raised */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Raised Credits</span>
            <h3 className="text-2xl font-extrabold text-emerald-500 font-display">{user.raisedCredits}</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Total Supporters */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Supporters</span>
            <h3 className="text-2xl font-extrabold text-sky-500 font-display">{totalSupporters}</h3>
          </div>
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-500">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Contributions Review Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold font-display text-slate-200 flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-slate-400" />
          Contributions To Review
        </h3>

        <div className="rounded-2xl border border-slate-900 bg-slate-950/20 overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading contribution reviews...</div>
          ) : contributions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No pending contributions to review.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-950/80 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="p-4">Supporter</th>
                    <th className="p-4">Campaign Title</th>
                    <th className="p-4">Amount Pledged</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 text-slate-300">
                  {contributions.map((cont) => (
                    <tr key={cont._id} className="hover:bg-slate-900/20 transition">
                      <td className="p-4">
                        <span className="font-semibold text-slate-200 block">{cont.supporterName}</span>
                        <span className="text-[10px] text-slate-500">{cont.supporterEmail}</span>
                      </td>
                      <td className="p-4 font-semibold text-slate-250 truncate max-w-[200px]">
                        {cont.campaignTitle}
                      </td>
                      <td className="p-4 font-bold text-blue-400">{cont.contributionAmount} cr</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedContribution(cont)}
                            className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-300 rounded hover:bg-slate-800 cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleApprove(cont._id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-[10px] font-semibold text-white rounded cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(cont._id)}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-[10px] font-semibold text-white rounded cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Contribution Details Modal */}
      {selectedContribution && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <h3 className="text-lg font-bold font-display text-white">Review Contribution Details</h3>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span>Supporter Name:</span>
                <span className="font-semibold text-white">{selectedContribution.supporterName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span>Supporter Email:</span>
                <span className="font-semibold text-white">{selectedContribution.supporterEmail}</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span>Target Project:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">
                  {selectedContribution.campaignTitle}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span>Contribution Pledged:</span>
                <span className="font-bold text-blue-400">{selectedContribution.contributionAmount} credits</span>
              </div>
              <div className="flex justify-between pb-1">
                <span>Date Placed:</span>
                <span>{new Date(selectedContribution.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-2 text-xs">
              <button
                onClick={() => setSelectedContribution(null)}
                className="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition"
              >
                Close
              </button>
              <button
                onClick={() => handleReject(selectedContribution._id)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition cursor-pointer"
              >
                Reject & Refund
              </button>
              <button
                onClick={() => handleApprove(selectedContribution._id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition cursor-pointer"
              >
                Approve Contribution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorHome;
