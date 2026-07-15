import React, { useState, useEffect } from 'react';
import { api } from '../../../contexts/AuthContext';
import { AlertOctagon, Trash2, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReportType {
  _id: string;
  campaignId: string;
  campaignTitle: string;
  reporterName: string;
  reporterEmail: string;
  reason: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}

const AdminReports: React.FC = () => {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports');
      setReports(response.data?.reports || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolveReport = async (id: string) => {
    try {
      const response = await api.put(`/reports/${id}/resolve`);
      toast.success(response.data.message || 'Report marked as resolved');
      fetchReports();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error resolving report');
    }
  };

  const handleSuspendCampaign = async (campaignId: string, reportId: string) => {
    try {
      const response = await api.put(`/campaigns/${campaignId}/status`, { status: 'suspended' });
      toast.success(response.data.message || 'Campaign suspended successfully');
      await api.put(`/reports/${reportId}/resolve`); // Resolve automatically
      fetchReports();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error suspending campaign');
    }
  };

  const handleDeleteCampaign = async (campaignId: string, reportId: string) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this reported campaign?\n\nCRITICAL: This permanently removes the project and refunds all approved supporter credits.'
    );
    if (!confirm) return;

    try {
      const response = await api.delete(`/campaigns/${campaignId}`);
      toast.success(response.data.message || 'Campaign deleted and supporters refunded!');
      await api.put(`/reports/${reportId}/resolve`);
      fetchReports();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error deleting campaign');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-rose-500" />
            Reported Campaigns
          </h1>
          <p className="text-xs text-slate-500">Monitor flags submitted by supporters. Take action by suspending or deleting campaigns.</p>
        </div>
        <button
          onClick={fetchReports}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="rounded-2xl border border-slate-900 bg-slate-950/20 overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="text-xs text-slate-500">Loading flagged campaigns...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No active campaign flags reported.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/80 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="p-4">Campaign Title</th>
                  <th className="p-4">Reporter Details</th>
                  <th className="p-4">Reason for Flag</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-slate-300">
                {reports.map((rep) => (
                  <tr key={rep._id} className="hover:bg-slate-900/20 transition">
                    <td className="p-4 font-semibold text-slate-200 truncate max-w-[150px]">
                      {rep.campaignTitle}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-300 block">{rep.reporterName}</span>
                      <span className="text-[10px] text-slate-550">{rep.reporterEmail}</span>
                    </td>
                    <td className="p-4 text-slate-400 leading-relaxed max-w-[250px] whitespace-pre-wrap">
                      {rep.reason}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        rep.status === 'resolved'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {rep.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {rep.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleSuspendCampaign(rep.campaignId, rep._id)}
                              className="px-2 py-1 bg-amber-600/10 text-amber-400 border border-amber-500/20 hover:bg-amber-600 hover:text-white rounded text-[10px] cursor-pointer"
                            >
                              Suspend
                            </button>
                            <button
                              onClick={() => handleDeleteCampaign(rep.campaignId, rep._id)}
                              className="p-1 rounded bg-rose-950/20 border border-rose-900/35 text-rose-400 hover:bg-rose-900 hover:text-white cursor-pointer transition"
                              title="Delete Project & Refund Backers"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleResolveReport(rep._id)}
                              className="px-2 py-1 bg-slate-900 border border-slate-800 text-[10px] text-slate-400 hover:text-white rounded cursor-pointer"
                            >
                              Resolve
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-semibold">Resolved</span>
                        )}
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

export default AdminReports;
