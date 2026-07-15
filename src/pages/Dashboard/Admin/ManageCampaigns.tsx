import React, { useState, useEffect } from 'react';
import { api } from '../../../contexts/AuthContext';
import { FileSpreadsheet, Trash2, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface CampaignType {
  _id: string;
  title: string;
  category: string;
  fundingGoal: number;
  amountRaised: number;
  creatorName: string;
  creatorEmail: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  deadline: string;
}

const ManageCampaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      const response = await api.get('/campaigns/all'); // Admin endpoint
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

  const handleDeleteCampaign = async (id: string) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this campaign?\n\nCRITICAL SAFETY: This will permanently delete the project and refund all approved/pending credits back to supporters!'
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

  const handleStatusUpdate = async (id: string, nextStatus: 'approved' | 'suspended') => {
    try {
      const response = await api.put(`/campaigns/${id}/status`, { status: nextStatus });
      toast.success(response.data.message || `Campaign status updated to ${nextStatus}`);
      fetchCampaigns();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update campaign status');
    }
  };

  const getStatusBadge = (status: string) => {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-blue-500" />
            Manage Campaigns
          </h1>
          <p className="text-xs text-slate-500">Monitor all causes, suspend suspicious activities, or delete campaigns.</p>
        </div>
        <button
          onClick={fetchCampaigns}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="rounded-2xl border border-slate-900 bg-slate-950/20 overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="text-xs text-slate-500">Loading campaigns directory...</span>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No campaigns registered.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/80 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="p-4">Project Title</th>
                  <th className="p-4">Creator Details</th>
                  <th className="p-4">Credits Raised</th>
                  <th className="p-4">Deadline</th>
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
                    <td className="p-4">
                      <span className="font-semibold text-slate-300 block">{camp.creatorName}</span>
                      <span className="text-[10px] text-slate-500">{camp.creatorEmail}</span>
                    </td>
                    <td className="p-4 font-bold text-blue-450">
                      {camp.amountRaised} / {camp.fundingGoal} cr
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(camp.deadline).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(camp.status)}`}>
                        {camp.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {camp.status === 'approved' && (
                          <button
                            onClick={() => handleStatusUpdate(camp._id, 'suspended')}
                            className="px-2.5 py-1 bg-amber-600/10 text-amber-400 border border-amber-500/20 hover:bg-amber-600 hover:text-white rounded cursor-pointer transition text-[10px]"
                          >
                            Suspend
                          </button>
                        )}
                        {camp.status === 'suspended' && (
                          <button
                            onClick={() => handleStatusUpdate(camp._id, 'approved')}
                            className="px-2.5 py-1 bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white rounded cursor-pointer transition text-[10px]"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteCampaign(camp._id)}
                          className="p-1.5 rounded-lg bg-rose-950/20 border border-rose-900/35 text-rose-400 hover:bg-rose-900 hover:text-white cursor-pointer transition"
                          title="Delete Campaign & Refund Supporters"
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
    </div>
  );
};

export default ManageCampaigns;
