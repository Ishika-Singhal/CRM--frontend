import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import crmApi from '../api/crmApi';
import { UserGroupIcon, ShoppingCartIcon, MegaphoneIcon } from '@heroicons/react/24/outline'; 
const DashboardPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalCampaigns: 0,
    recentCampaigns: [],
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated) {
        setLoadingStats(false);
        return;
      }
      setLoadingStats(true);
      setError(null);
      try {
        const [customersRes, ordersRes, campaignsRes] = await Promise.all([
          crmApi.getCustomers(),
          crmApi.getOrders(),
          crmApi.getCampaigns(),
        ]);

        setStats({
          totalCustomers: customersRes.data.customers?.length, 
          totalOrders: ordersRes.data.orders?.length,        
          totalCampaigns: campaignsRes.data.campaigns?.length, 
          recentCampaigns: campaignsRes.data.campaigns?.slice(0, 5), 
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard statistics. Please try again later.');
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold text-gray-700">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">CRM Dashboard</h1>

      {!isAuthenticated && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-8" role="alert">
          <p className="font-bold">Welcome!</p>
          <p>Please log in with Google to access full CRM features like campaign creation and data ingestion.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-8" role="alert">
          <p className="font-bold">Error!</p>
          <p>{error}</p>
        </div>
      )}

      {isAuthenticated && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 transition-all duration-300 hover:shadow-lg hover:scale-105">
              <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full">
                <UserGroupIcon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loadingStats ? '...' : stats.totalCustomers}
                </p>
              </div>
            </div>

        
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 transition-all duration-300 hover:shadow-lg hover:scale-105">
              <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                <ShoppingCartIcon className="h-8 w-8 text-green-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loadingStats ? '...' : stats.totalOrders}
                </p>
              </div>
            </div>

           
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 transition-all duration-300 hover:shadow-lg hover:scale-105">
              <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full">
                <MegaphoneIcon className="h-8 w-8 text-purple-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Campaigns</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loadingStats ? '...' : stats.totalCampaigns}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Campaigns</h2>
            {loadingStats ? (
              <p className="text-gray-600">Loading recent campaigns...</p>
            ) : stats.recentCampaigns.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {stats.recentCampaigns.map((campaign) => (
                  <li key={campaign._id} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold text-indigo-700">{campaign.name}</p>
                      <p className="text-sm text-gray-600">{campaign.description || 'No description'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Audience: <span className="font-medium">{campaign.audienceSize}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: <span className={`font-medium ${
                          campaign.status === 'sent' || campaign.status === 'completed' ? 'text-green-600' :
                          campaign.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No recent campaigns found. Create one to get started!</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
