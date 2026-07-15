import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, api } from '../contexts/AuthContext';
import { Bell, CreditCard, LogOut, Menu, X, Code, LayoutDashboard, User } from 'lucide-react';
import NotificationPopup from './NotificationPopup';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll for unread notification count
  useEffect(() => {
    if (!user) return;
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get('/notifications');
        const count = response.data.notifications?.filter((n: any) => !n.isRead).length || 0;
        setUnreadCount(count);
      } catch (err) {
        console.error('Error checking notification count:', err);
      }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // 30s poll
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  // Helper to determine dashboard path
  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'Admin') return '/dashboard/admin-home';
    if (user.role === 'Creator') return '/dashboard/creator-home';
    return '/dashboard/supporter-home';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                <span className="font-display font-extrabold text-lg">F</span>
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Fund<span className="text-blue-500">Forge</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/explore" className="text-sm font-medium text-slate-300 hover:text-white transition">
              Explore Campaigns
            </Link>
            <Link to="/about" className="text-sm font-medium text-slate-300 hover:text-white transition">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium text-slate-300 hover:text-white transition">
              Contact
            </Link>
            <Link to="/faq" className="text-sm font-medium text-slate-300 hover:text-white transition">
              FAQ
            </Link>

            {/* Developer Repo Button */}
            <a
              href="https://github.com/mdsadrulhasandider/fundforge-client"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <Code className="w-3.5 h-3.5" />
              Join as Developer
            </a>
          </nav>

          {/* User Section (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* Available Credits */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs font-medium text-slate-300">
                  <CreditCard className="w-3.5 h-3.5 text-blue-500" />
                  <span>
                    Credits: <span className="font-semibold text-white">{user.role === 'Admin' ? '∞' : user.credits}</span>
                  </span>
                </div>

                {/* Notifications Ring */}
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition relative cursor-pointer"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-slate-950">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <NotificationPopup
                    isOpen={notifOpen}
                    onClose={() => setNotifOpen(false)}
                    onUnreadCountChange={setUnreadCount}
                  />
                </div>

                {/* Dashboard Shortcut */}
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition shadow-sm hover:shadow-blue-500/20"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                {/* Profile Pic & Logout */}
                <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="h-8 w-8 rounded-full border border-slate-700 object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-300 hover:text-white transition px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition shadow-sm hover:shadow-blue-500/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            {user && (
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition relative cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-slate-950">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <NotificationPopup
                  isOpen={notifOpen}
                  onClose={() => setNotifOpen(false)}
                  onUnreadCountChange={setUnreadCount}
                />
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 py-4 space-y-4">
          <nav className="flex flex-col gap-3">
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-white transition py-1"
            >
              Explore Campaigns
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-white transition py-1"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-white transition py-1"
            >
              Contact
            </Link>
            <Link
              to="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-white transition py-1"
            >
              FAQ
            </Link>
            <a
              href="https://github.com/mdsadrulhasandider/fundforge-client"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300"
            >
              <Code className="w-3.5 h-3.5" />
              Join as Developer
            </a>
          </nav>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
            {user ? (
              <>
                <div className="flex items-center justify-between px-2 text-sm text-slate-400">
                  <span>Available Credits:</span>
                  <span className="font-semibold text-white">{user.role === 'Admin' ? '∞' : user.credits}</span>
                </div>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-950/20 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-lg text-sm font-semibold border border-slate-800 text-slate-300 hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
