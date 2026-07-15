import React, { useState, useEffect } from 'react';
import { api } from '../../../contexts/AuthContext';
import { Edit3, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CampaignType {
  _id: string;
  title: string;
  campaignStory: string;
  category: string;
  fundingGoal: number;
  minimumContribution: number;
  deadline: string;
  rewardInfo: string;
  image: string;
  amountRaised: number;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
}

const MyCampaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [loading, setLoading] = useState(true);

  // Update modal state
  const [editingCamp, setEditingCamp] = useState<CampaignType | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editStory, setEditStory] = useState('');
  const [editRewards, setEditRewards] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const response = await api.get('/campaigns/my');
      setCampaigns(response.data.campaigns || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      'WARNING: Are you absolutely sure you want to delete this campaign?\n\nThis will permanently delete the project AND refund all approved or pending supporter contributions back to their accounts!'
    );
    if (!confirm) return;

    try {
      const response = await api.delete(`/campaigns/${id}`);
      toast.success(response.data.message || 'Campaign deleted and supporters refunded!');
      fetchCampaigns();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const openEditModal = (camp: CampaignType) => {
    setEditingCamp(camp);
    setEditTitle(camp.title);
    setEditStory(camp.campaignStory);
    setEditRewards(camp.rewardInfo);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCamp) return;

    setUpdating(true);
    try {
      const response = await api.put(`/campaigns/${editingCamp._id}`, {
        title: editTitle,
        campaignStory: editStory,
        rewardInfo: editRewards
      });
      toast.success(response.data.message || 'Campaign updated successfully!');
      fetchCampaigns();
      setEditingCamp(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'rejected':
      case 'suspended':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-white">My Campaigns</h1>
        <p className="text-xs text-slate-500">Manage your submitted crowdfunding projects and check active statuses.</p>
      </div>

      <div className="rounded-2xl border border-slate-900 bg-slate-950/20 overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="text-xs text-slate-500">Loading campaign list...</span>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            You have not launched any campaigns yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/80 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="p-4">Project Title</th>
                  <th className="p-4">Credits Raised</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-slate-300">
                {campaigns.map((camp) => (
                  <tr key={camp._id} className="hover:bg-slate-900/20 transition">
                    <td className="p-4 font-semibold text-slate-200">
                      <span className="block truncate max-w-[220px]">{camp.title}</span>
                      <span className="text-[10px] text-slate-500">Goal: {camp.fundingGoal} cr</span>
                    </td>
                    <td className="p-4 font-bold text-blue-400">
                      {camp.amountRaised} / {camp.fundingGoal} cr
                    </td>
                    <td className="p-4 text-slate-550">
                      {new Date(camp.deadline).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-slate-400">{camp.category}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(camp.status)}`}>
                        {camp.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(camp)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                          title="Edit Campaign"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(camp._id)}
                          className="p-1.5 rounded-lg bg-rose-950/20 border border-rose-900/35 text-rose-400 hover:bg-rose-900 hover:text-white cursor-pointer transition"
                          title="Delete Project & Refund Backers"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Edit Modal */}
      {editingCamp && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <h3 className="text-lg font-bold font-display text-white">Update Campaign Fields</h3>
            <p className="text-xs text-slate-400">
              Only title, story description, and rewards are editable to protect supporters.
            </p>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-0.5">
                  Campaign Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-0.5">
                  Campaign Story Description
                </label>
                <textarea
                  required
                  rows={5}
                  value={editStory}
                  onChange={(e) => setEditStory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2 px-3 text-xs text-white resize-none"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-0.5">
                  Backer Rewards Info
                </label>
                <input
                  type="text"
                  required
                  value={editRewards}
                  onChange={(e) => setEditRewards(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setEditingCamp(null)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition disabled:opacity-50 cursor-pointer flex items-center gap-1"
                >
                  {updating ? (
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  ) : (
                    'Save Updates'
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

export default MyCampaigns;
