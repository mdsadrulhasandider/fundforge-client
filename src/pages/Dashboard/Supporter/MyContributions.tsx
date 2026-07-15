import React, { useState, useEffect } from 'react';
import { api } from '../../../contexts/AuthContext';
import { ChevronLeft, ChevronRight, MessageSquareCode, Loader2 } from 'lucide-react';

interface ContributionType {
  _id: string;
  campaignTitle: string;
  contributionAmount: number;
  supporterName: string;
  creatorName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const MyContributions: React.FC = () => {
  const [contributions, setContributions] = useState<ContributionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const loadContributions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/contributions/my', {
        params: { page: currentPage, limit: 10 }
      });
      setContributions(response.data.contributions || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalResults(response.data.totalContributions || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContributions();
  }, [currentPage]);

  // Color mapper for status
  const getStatusBadge = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'rejected':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-white">My Contributions</h1>
        <p className="text-xs text-slate-500">View and track all {totalResults} contributions made to campaign causes.</p>
      </div>

      <div className="rounded-2xl border border-slate-900 bg-slate-950/20 overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="text-xs text-slate-500">Loading contribution logs...</span>
          </div>
        ) : contributions.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <MessageSquareCode className="w-8 h-8 text-slate-700 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">You haven't contributed to any campaigns yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/80 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="p-4">Campaign Title</th>
                  <th className="p-4">Contribution Amount</th>
                  <th className="p-4">Creator Details</th>
                  <th className="p-4">Pledging Date</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-slate-300">
                {contributions.map((cont) => (
                  <tr key={cont._id} className="hover:bg-slate-900/20 transition">
                    <td className="p-4 font-semibold text-slate-200">{cont.campaignTitle}</td>
                    <td className="p-4 font-bold text-blue-400">{cont.contributionAmount} cr</td>
                    <td className="p-4 text-slate-400">{cont.creatorName}</td>
                    <td className="p-4 text-slate-500">
                      {new Date(cont.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(cont.status)}`}>
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

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 transition cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs text-slate-400 font-medium">
            Page <span className="font-semibold text-slate-200">{currentPage}</span> of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MyContributions;
