import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth, api } from '../contexts/AuthContext';
import { CampaignType } from '../components/Card';
import { Users, Eye, Calendar, AlertOctagon, Heart, ChevronRight, Award, ShieldAlert, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<CampaignType | null>(null);
  const [loading, setLoading] = useState(true);
  const [contributionAmount, setContributionAmount] = useState<number>(0);
  const [submittingCont, setSubmittingCont] = useState(false);

  // Report Modal states
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  // Load Campaign details
  const loadCampaignDetails = async () => {
    try {
      const response = await api.get(`/campaigns/${id}`);
      setCampaign(response.data.campaign);
      if (response.data.campaign) {
        setContributionAmount(response.data.campaign.minimumContribution);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load campaign details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaignDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-24">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="max-w-md mx-auto text-center py-24 space-y-4">
        <AlertOctagon className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold font-display text-white">Campaign not found</h2>
        <p className="text-sm text-slate-500">The campaign you are looking for may have been deleted or suspended.</p>
        <Link to="/explore" className="inline-block px-4 py-2 bg-blue-600 rounded-xl text-xs font-semibold text-white">
          Back to Explore
        </Link>
      </div>
    );
  }

  const percentage = Math.min(Math.round((campaign.amountRaised / campaign.fundingGoal) * 100), 100);
  const isExpired = new Date(campaign.deadline) < new Date();

  // Handle Contribution submission
  const handleContributionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to contribute');
      navigate('/login');
      return;
    }

    if (user.role !== 'Supporter') {
      toast.error('Only supporters can contribute platform credits.');
      return;
    }

    if (contributionAmount < campaign.minimumContribution) {
      toast.error(`Minimum contribution is ${campaign.minimumContribution} credits`);
      return;
    }

    if (user.credits < contributionAmount) {
      toast.error('Insufficient credits balance. Please purchase credits.');
      return;
    }

    setSubmittingCont(true);
    try {
      const response = await api.post('/contributions', {
        campaignId: campaign._id,
        contributionAmount
      });
      toast.success(response.data.message || 'Contribution submitted successfully!');
      await refreshUser(); // Update credit count in navbar
      loadCampaignDetails(); // Reload campaign raised amount (it increases on creator approval, but views, etc. might update)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error processing contribution');
    } finally {
      setSubmittingCont(false);
    }
  };

  // Handle Report submission
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to report');
      return;
    }

    if (reportReason.length < 10) {
      toast.error('Reason must be at least 10 characters long');
      return;
    }

    setSubmittingReport(true);
    try {
      await api.post('/reports', {
        campaignId: campaign._id,
        reason: reportReason
      });
      toast.success('Campaign reported to administrators. Thank you.');
      setReportOpen(false);
      setReportReason('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error submitting report');
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Link to="/" className="hover:text-white transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/explore" className="hover:text-white transition">Explore</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-300 truncate max-w-xs">{campaign.title}</span>
      </div>

      {/* Main Campaign Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Story details (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Visuals & Details */}
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {campaign.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold font-display text-white leading-tight">
              {campaign.title}
            </h1>
            
            {/* Meta stats */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
              <span className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                {campaign.supportersCount} Backers
              </span>
              <span className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-purple-500" />
                {campaign.views} Views
              </span>
              <span className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                Ends on {new Date(campaign.deadline).toLocaleDateString()}
              </span>
            </div>

            {/* Main Cover Image */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-lg mt-6">
              <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Campaign Story */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-display text-slate-100 border-b border-slate-900 pb-3">
              Campaign Story
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
              {campaign.campaignStory}
            </p>
          </div>

          {/* Reward & Pledges info */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-4">
            <h3 className="font-semibold text-slate-200 font-display flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              Creator Rewards Info
            </h3>
            <p className="text-xs text-slate-500">
              For supporting this project, the creator offers the following rewards:
            </p>
            <p className="text-sm text-slate-400 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-900/60">
              {campaign.rewardInfo}
            </p>
          </div>
        </div>

        {/* Contribution Sidebar (Right 1 col) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Backing Card */}
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-950/20 space-y-6 relative overflow-hidden">
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Progress</span>
              <h2 className="text-3xl font-extrabold text-white font-display">
                {campaign.amountRaised}{' '}
                <span className="text-xs font-semibold text-slate-400">credits raised</span>
              </h2>
              <p className="text-xs text-slate-500">
                Goal: <span className="font-semibold text-slate-300">{campaign.fundingGoal} credits</span>
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{percentage}% funded</span>
                <span>{isExpired ? 'Ended' : 'Active'}</span>
              </div>
            </div>

            {/* Backing Form */}
            {isExpired ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 text-center text-xs text-rose-400 font-medium">
                This campaign has expired and is closed for contributions.
              </div>
            ) : campaign.status !== 'approved' ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 text-center text-xs text-amber-400 font-medium">
                This campaign is no longer accepting public contributions.
              </div>
            ) : (
              <form onSubmit={handleContributionSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-0.5">
                    Contribution Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={campaign.minimumContribution}
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2.5 px-4 text-sm text-white font-bold placeholder-slate-500 outline-none transition"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-slate-500 pointer-events-none">
                      credits
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 pl-0.5">
                    Min Contribution: <span className="font-semibold text-slate-300">{campaign.minimumContribution} credits</span>
                  </p>
                </div>

                {user && user.role !== 'Supporter' ? (
                  <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl text-[10px] leading-relaxed">
                    Account is logged in as {user.role}. Only Supporters can contribute platform credits.
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={submittingCont}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-md hover:shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submittingCont ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Heart className="w-4 h-4" />
                        Contribute Credits
                      </>
                    )}
                  </button>
                )}
              </form>
            )}

            {/* Creator details */}
            <div className="pt-4 border-t border-slate-900 text-xs text-slate-500 flex items-center justify-between">
              <span>Creator: <span className="font-semibold text-slate-300">{campaign.creatorName}</span></span>
              <span className="truncate max-w-[120px]">{campaign.creatorEmail || ''}</span>
            </div>
          </div>

          {/* Safe Crowdfunding and Report Box */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-4">
            <h3 className="font-semibold text-slate-200 font-display flex items-center gap-1.5 text-sm">
              <ShieldAlert className="w-4 h-4 text-emerald-500" />
              Safety Guarantee
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              If this campaign is deleted or canceled by the creator, the double-ledger system immediately refunds all approved supporter credits.
            </p>
            {user && (
              <button
                onClick={() => setReportOpen(true)}
                className="w-full mt-2 py-2 border border-slate-900 hover:border-rose-900 hover:bg-rose-950/20 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-rose-400 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                Report Suspicious Campaign
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {reportOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-500" />
              Report Campaign
            </h3>
            <p className="text-xs text-slate-400">
              Provide a detailed description of why you believe this campaign violates platform policies or is fraudulent.
            </p>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <textarea
                required
                rows={4}
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="I believe this campaign is suspicious because..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2 px-3 text-sm text-white placeholder-slate-500 outline-none transition resize-none"
              ></textarea>
              <div className="flex justify-end gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setReportOpen(false);
                    setReportReason('');
                  }}
                  className="px-4 py-2 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReport}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg transition disabled:opacity-50 cursor-pointer flex items-center gap-1"
                >
                  {submittingReport ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    'Submit Report'
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

export default CampaignDetails;
