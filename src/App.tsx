import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// Public Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import CampaignDetails from './pages/CampaignDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard Layout
import DashboardLayout from './pages/Dashboard/DashboardLayout';

// Supporter Dashboard
import SupporterHome from './pages/Dashboard/Supporter/SupporterHome';
import MyContributions from './pages/Dashboard/Supporter/MyContributions';
import PurchaseCredit from './pages/Dashboard/Supporter/PurchaseCredit';
import SupporterPaymentHistory from './pages/Dashboard/Supporter/SupporterPaymentHistory';

// Creator Dashboard
import CreatorHome from './pages/Dashboard/Creator/CreatorHome';
import AddCampaign from './pages/Dashboard/Creator/AddCampaign';
import MyCampaigns from './pages/Dashboard/Creator/MyCampaigns';
import Withdrawals from './pages/Dashboard/Creator/Withdrawals';
import CreatorPaymentHistory from './pages/Dashboard/Creator/CreatorPaymentHistory';

// Admin Dashboard
import AdminHome from './pages/Dashboard/Admin/AdminHome';
import ManageUsers from './pages/Dashboard/Admin/ManageUsers';
import CampaignApprovals from './pages/Dashboard/Admin/CampaignApprovals';
import ManageCampaigns from './pages/Dashboard/Admin/ManageCampaigns';
import WithdrawalRequests from './pages/Dashboard/Admin/WithdrawalRequests';
import AdminReports from './pages/Dashboard/Admin/AdminReports';

// Shared Dashboard Pages
import ProfileSettings from './pages/Dashboard/ProfileSettings';
import TransactionsHistory from './pages/Dashboard/TransactionsHistory';

// Public Layout Wrapper to keep Navbar and Footer constant
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

// 404 Page Component
const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <h1 className="text-9xl font-extrabold text-blue-600 tracking-widest font-display">404</h1>
      <div className="bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">
        Page Not Found
      </div>
      <p className="text-sm text-slate-500 max-w-sm">
        The resource you are looking for has been moved, removed or does not exist.
      </p>
      <RouterLink to="/" className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition">
        Return Home
      </RouterLink>
    </div>
  );
};

import { Link as RouterLink } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with Navbar/Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/campaigns/:id" element={<CampaignDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>

          {/* Secure Role-based Dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Supporter Routes */}
            <Route
              path="supporter-home"
              element={
                <ProtectedRoute allowedRoles={['Supporter']}>
                  <SupporterHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="supporter-contributions"
              element={
                <ProtectedRoute allowedRoles={['Supporter']}>
                  <MyContributions />
                </ProtectedRoute>
              }
            />
            <Route
              path="supporter-purchase"
              element={
                <ProtectedRoute allowedRoles={['Supporter']}>
                  <PurchaseCredit />
                </ProtectedRoute>
              }
            />
            <Route
              path="supporter-history"
              element={
                <ProtectedRoute allowedRoles={['Supporter']}>
                  <SupporterPaymentHistory />
                </ProtectedRoute>
              }
            />

            {/* Creator Routes */}
            <Route
              path="creator-home"
              element={
                <ProtectedRoute allowedRoles={['Creator']}>
                  <CreatorHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="creator-add"
              element={
                <ProtectedRoute allowedRoles={['Creator']}>
                  <AddCampaign />
                </ProtectedRoute>
              }
            />
            <Route
              path="creator-campaigns"
              element={
                <ProtectedRoute allowedRoles={['Creator']}>
                  <MyCampaigns />
                </ProtectedRoute>
              }
            />
            <Route
              path="creator-reviews"
              element={
                <ProtectedRoute allowedRoles={['Creator']}>
                  <CreatorHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="creator-withdrawals"
              element={
                <ProtectedRoute allowedRoles={['Creator']}>
                  <Withdrawals />
                </ProtectedRoute>
              }
            />
            <Route
              path="creator-history"
              element={
                <ProtectedRoute allowedRoles={['Creator']}>
                  <CreatorPaymentHistory />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="admin-home"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin-users"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin-approvals"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <CampaignApprovals />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin-campaigns"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <ManageCampaigns />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin-withdrawals"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <WithdrawalRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin-reports"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminReports />
                </ProtectedRoute>
              }
            />

            {/* Shared profile settings */}
            <Route path="profile" element={<ProfileSettings />} />
            <Route
              path="transactions"
              element={
                <ProtectedRoute allowedRoles={['Supporter', 'Creator']}>
                  <TransactionsHistory />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass text-slate-100 border border-slate-900 rounded-xl text-xs font-semibold',
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AuthProvider>
  );
};

export default App;
