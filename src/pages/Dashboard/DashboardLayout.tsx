import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Compass,
  FileCode,
  CreditCard,
  History,
  Settings,
  Menu,
  X,
  PlusCircle,
  FileSpreadsheet,
  Users,
  CheckSquare,
  AlertOctagon,
  Home,
  LogOut,
  FolderLock
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user && (location.pathname === '/dashboard' || location.pathname === '/dashboard/')) {
      if (user.role === 'Supporter') {
        navigate('/dashboard/supporter-home', { replace: true });
      } else if (user.role === 'Creator') {
        navigate('/dashboard/creator-home', { replace: true });
      } else if (user.role === 'Admin') {
        navigate('/dashboard/admin-home', { replace: true });
      }
    }
  }, [location.pathname, user, navigate]);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Define sidebar items based on role
  const getSidebarLinks = () => {
    const common = [{ label: 'Back to Home', path: '/', icon: Home }];

    if (user.role === 'Supporter') {
      return [
        { label: 'Overview', path: '/dashboard/supporter-home', icon: LayoutDashboard },
        { label: 'Explore Campaigns', path: '/explore', icon: Compass },
        { label: 'My Contributions', path: '/dashboard/supporter-contributions', icon: FileCode },
        { label: 'Purchase Credits', path: '/dashboard/supporter-purchase', icon: CreditCard },
        { label: 'Payment History', path: '/dashboard/supporter-history', icon: History },
        { label: 'Credit Ledger', path: '/dashboard/transactions', icon: History },
        { label: 'Profile Settings', path: '/dashboard/profile', icon: Settings },
        ...common
      ];
    }

    if (user.role === 'Creator') {
      return [
        { label: 'Overview', path: '/dashboard/creator-home', icon: LayoutDashboard },
        { label: 'Add New Campaign', path: '/dashboard/creator-add', icon: PlusCircle },
        { label: 'My Campaigns', path: '/dashboard/creator-campaigns', icon: FileSpreadsheet },
        { label: 'Contribution Reviews', path: '/dashboard/creator-reviews', icon: CheckSquare },
        { label: 'Withdrawals', path: '/dashboard/creator-withdrawals', icon: CreditCard },
        { label: 'Payment History', path: '/dashboard/creator-history', icon: History },
        { label: 'Credit Ledger', path: '/dashboard/transactions', icon: History },
        { label: 'Profile Settings', path: '/dashboard/profile', icon: Settings },
        ...common
      ];
    }

    // Admin
    return [
      { label: 'Overview', path: '/dashboard/admin-home', icon: LayoutDashboard },
      { label: 'Manage Users', path: '/dashboard/admin-users', icon: Users },
      { label: 'Campaign Approvals', path: '/dashboard/admin-approvals', icon: FolderLock },
      { label: 'Manage Campaigns', path: '/dashboard/admin-campaigns', icon: FileSpreadsheet },
      { label: 'Withdrawal Requests', path: '/dashboard/admin-withdrawals', icon: CreditCard },
      { label: 'Reports', path: '/dashboard/admin-reports', icon: AlertOctagon },
      { label: 'Profile Settings', path: '/dashboard/profile', icon: Settings },
      ...common
    ];
  };

  const links = getSidebarLinks();

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white lg:hidden cursor-pointer"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-900 bg-slate-950 flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white">
                <span className="font-display font-extrabold text-sm">F</span>
              </div>
              <span className="font-display font-bold text-lg text-white">
                Fund<span className="text-blue-500">Forge</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded text-slate-500 hover:text-white lg:hidden cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile Summary */}
          <div className="flex items-center gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
            {user.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                className="h-10 w-10 rounded-full border border-slate-700 object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                <Users className="w-5 h-5" />
              </div>
            )}
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-slate-200 truncate">{user.name}</h4>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{user.role}</p>
            </div>
          </div>

          {/* User Credits box */}
          {user.role !== 'Admin' && (
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl p-3 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Credits</span>
              <span className="text-sm font-bold text-white">
                {user.role === 'Creator' ? `${user.raisedCredits} raised` : `${user.credits} avail`}
              </span>
            </div>
          )}
        </div>

        {/* Sidebar Middle Nav Links */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {links.map((link, idx) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={idx}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/20 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content viewport */}
      <main className="flex-grow flex flex-col min-w-0">
        <div className="p-6 sm:p-10 flex-grow">
          {/* Header block spacing for Mobile Drawer button */}
          <div className="h-10 lg:hidden" />
          <Outlet />
        </div>

        {/* Small dashboard footer */}
        <footer className="py-4 border-t border-slate-900 text-center text-[10px] text-slate-600 bg-slate-950/40">
          &copy; {new Date().getFullYear()} FundForge Admin. Vetted security dashboard.
        </footer>
      </main>
    </div>
  );
};

export default DashboardLayout;
