import React, { useState, useEffect } from 'react';
import { api } from '../../../contexts/AuthContext';
import { FolderLock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CampaignType {
  _id: string;
  title: string;
  category: string;
  fundingGoal: number;
  minimumContribution: number;
  deadline: string;
  creatorName: string;
  creatorEmail: string;
  image: string;
  rewardInfo: string;
}

const CampaignApprovals: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCamp, setSelectedCamp] = useState<CampaignType | null>(null);

  const fetchPendingCampaigns = async () => {
    try {
      const response = await api.get('/campaigns/pending');
      setCampaigns(response.data.campaigns || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCampaigns();
  }, []);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const response = await api.put(`/campaigns/${id}/status`, { status });
      toast.success(response.data.message || `Campaign status updated to ${status}`);
      fetchPendingCampaigns();
      setSelectedCamp(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error updating status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
          <FolderLock className="w-6 h-6 text-blue-500" />
          Campaign Approvals
        </h1>
        <p className="text-xs text-slate-500">Review newly submitted causes. Approving grants them public search visibility.</p>
      </div>

      <div className="rounded-2xl border border-slate-900 bg-slate-950/20 overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="text-xs text-slate-500">Loading pending submissions...</span>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No pending campaign approvals at the moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/80 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="p-4">Project Preview</th>
                  <th className="p-4">Creator</th>
                  <th className="p-4">Goal Amount</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-slate-300">
                {campaigns.map((camp) => (
                  <tr key={camp._id} className="hover:bg-slate-900/20 transition">
                    <td className="p-4 flex items-center gap-3">
                      <img src={camp.image} alt={camp.title} className="w-12 h-9 object-cover rounded border border-slate-800" />
                      <div>
                        <span className="font-semibold text-slate-200 block truncate max-w-[200px]">{camp.title}</span>
                        <span className="text-[10px] text-slate-500">{camp.category}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-300 block">{camp.creatorName}</span>
                      <span className="text-[10px] text-slate-500">{camp.creatorEmail}</span>
                    </td>
                    <td className="p-4 font-bold text-blue-400">{camp.fundingGoal} cr</td>
                    <td className="p-4 text-slate-500">
                      {new Date(camp.deadline).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedCamp(camp)}
                          className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-300 rounded hover:bg-slate-800 cursor-pointer"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(camp._id, 'approved')}
                          className="p-1 rounded text-emerald-400 hover:bg-emerald-950/20 transition cursor-pointer"
                          title="Approve"
                        >
                          <CheckCircle2 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(camp._id, 'rejected')}
                          className="p-1 rounded text-rose-400 hover:bg-rose-950/20 transition cursor-pointer"
                          title="Reject"
                        >
                          <XCircle className="w-4.5 h-4.5" />
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

      {/* Review Modal */}
      {selectedCamp && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <h3 className="text-lg font-bold font-display text-white">Review Campaign Submission</h3>
            <img src={selectedCamp.image} alt={selectedCamp.title} className="w-full aspect-video object-cover rounded-xl border border-slate-850" />
            
            <div className="space-y-2">
              <h4 className="font-semibold text-white text-sm">{selectedCamp.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed max-h-28 overflow-y-auto pr-1">
                {/* Normally we show story here, but for preview we can just show rewards / metadata */}
                Rewards Offered: <span className="font-medium text-slate-300">{selectedCamp.rewardInfo}</span>
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2 text-xs">
              <button
                onClick={() => setSelectedCamp(null)}
                className="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition"
              >
                Close
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedCamp._id, 'rejected')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition cursor-pointer"
              >
                Reject Submission
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedCamp._id, 'approved')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition cursor-pointer"
              >
                Approve & Launch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignApprovals;
