import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CampaignListPage from './pages/CampaignListPage';
import CampaignCreatePage from './pages/CampaignCreatePage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import CustomerListPage from './pages/CustomerListPage';
import OrderListPage from './pages/OrderListPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './contexts/AuthContext'; // Re-import for clarity, though already in index.js

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<DashboardPage />} /> {/* Dashboard is accessible to all */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login-failed" element={<LoginPage message="Login failed. Please try again." />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Authenticated Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/campaigns" element={<CampaignListPage />} />
              <Route path="/campaigns/new" element={<CampaignCreatePage />} />
              <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
              <Route path="/customers" element={<CustomerListPage />} />
              <Route path="/orders" element={<OrderListPage />} />
            </Route>

            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        {/* Optional Footer */}
        <footer className="bg-gray-800 text-white text-center p-4 mt-8">
          <p>&copy; {new Date().getFullYear()} Mini CRM. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;