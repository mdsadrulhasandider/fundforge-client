import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../contexts/AuthContext';
import Card, { CampaignType } from '../components/Card';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Loader2, RefreshCw } from 'lucide-react';

const CATEGORIES = ['All', 'Technology', 'Art', 'Community', 'Health', 'Education'];

const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  // State managers
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('newest');
  const [goalMin, setGoalMin] = useState('');
  const [goalMax, setGoalMax] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Sync category state with searchParams (e.g. from footer link click)
  useEffect(() => {
    const queryCat = searchParams.get('category');
    if (queryCat) {
      setCategory(queryCat);
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Load Campaigns
  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 6,
        search: searchTerm,
        category,
        sort,
      };

      if (goalMin) params.goalMin = goalMin;
      if (goalMax) params.goalMax = goalMax;

      const response = await api.get('/campaigns', { params });
      setCampaigns(response.data.campaigns || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalResults(response.data.totalCampaigns || 0);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, [currentPage, category, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadCampaigns();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setSort('newest');
    setGoalMin('');
    setGoalMax('');
    setCurrentPage(1);
    setSearchParams({});
    // Delay load slightly so states set
    setTimeout(loadCampaigns, 50);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Intro */}
      <div className="space-y-2 mb-10 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
          Explore Campaigns
        </h1>
        <p className="text-sm text-slate-400">
          Discover incredible projects, creative artifacts, and community causes.
        </p>
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">
              Search Campaign
            </label>
            <div className="relative flex">
              <input
                type="text"
                placeholder="Title or story..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-3 pr-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-600"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 p-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white transition cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Filters Card */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-200 font-display flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-500" />
                Refine Search
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer transition"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-0.5">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium cursor-pointer ${
                      category === cat
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-0.5">
                Funding Goal (Credits)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={goalMin}
                  onChange={(e) => setGoalMin(e.target.value)}
                  className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-600"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={goalMax}
                  onChange={(e) => setGoalMax(e.target.value)}
                  className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-600"
                />
              </div>
              {(goalMin || goalMax) && (
                <button
                  onClick={() => {
                    setCurrentPage(1);
                    loadCampaigns();
                  }}
                  className="w-full mt-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-850 hover:text-white transition cursor-pointer"
                >
                  Apply Goal Filter
                </button>
              )}
            </div>

            {/* Sort Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-0.5 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-600"
              >
                <option value="newest">Newest Campaigns</option>
                <option value="most-funded">Most Funded</option>
                <option value="ending-soon">Ending Soon</option>
                <option value="goal-high">Goal: High to Low</option>
                <option value="goal-low">Goal: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Campaign Grid Section */}
        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="text-sm text-slate-500 animate-pulse">Loading active campaigns...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-slate-900 rounded-3xl bg-slate-950/20 p-12">
              <h3 className="text-lg font-bold font-display text-slate-300">No campaigns found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2">
                No active, approved campaigns matched your current filters. Try resetting the refine settings.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm shadow-blue-500/10"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Stats header */}
              <div className="flex justify-between items-center px-1">
                <span className="text-xs text-slate-500 font-medium">
                  Showing {campaigns.length} of {totalResults} active projects
                </span>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((cam) => (
                  <Card key={cam._id} campaign={cam} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-6">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
