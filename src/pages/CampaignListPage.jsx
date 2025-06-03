import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import crmApi from '../api/crmApi';
import MessageModal from '../components/MessageModal'; // Import the custom modal
import { PlusIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline'; // Icons

/**
 * CampaignListPage component displays a list of all campaigns.
 * Allows viewing campaign details and deleting campaigns.
 */
const CampaignListPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'info' });
  const [campaignToDelete, setCampaignToDelete] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await crmApi.getCampaigns();
      if (response.data.success) { // FIX: Access .data.success
        setCampaigns(response.data.campaigns); // FIX: Access .data.campaigns
      } else {
        setError(response.data.message || 'Failed to fetch campaigns.'); // FIX: Access .data.message
      }
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError(err.response?.data?.message || 'Error fetching campaigns.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (campaignId) => {
    setCampaignToDelete(campaignId);
    setModalContent({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this campaign? This action cannot be undone.',
      type: 'confirm'
    });
    setShowModal(true);
  };

  const confirmDeleteCampaign = async (confirmed) => {
    setShowModal(false);
    if (confirmed && campaignToDelete) {
      try {
        const response = await crmApi.deleteCampaign(campaignToDelete);
        if (response.data.success) { // FIX: Access .data.success
          setModalContent({ title: 'Success', message: 'Campaign deleted successfully!', type: 'success' });
          setShowModal(true);
          fetchCampaigns(); // Refresh the list
        } else {
          setModalContent({ title: 'Error', message: response.data.message || 'Failed to delete campaign.', type: 'error' }); // FIX: Access .data.message
          setShowModal(true);
        }
      } catch (err) {
        console.error('Error deleting campaign:', err);
        setModalContent({ title: 'Error', message: err.response?.data?.message || 'Error deleting campaign.', type: 'error' });
        setShowModal(true);
      } finally {
        setCampaignToDelete(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold text-gray-700">
        Loading campaigns...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
        <p className="font-bold">Error!</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Campaigns</h1>
        <Link
          to="/campaigns/new"
          className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Create New Campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 text-lg">No campaigns found. Start by creating a new one!</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Audience Size
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Stats (Sent/Failed)
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 max-w-xs truncate">{campaign.description || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{campaign.audienceSize}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      campaign.status === 'sent' || campaign.status === 'completed' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {campaign.deliveryStats.sent}/{campaign.deliveryStats.failed}
                    {campaign.deliveryStats.pending > 0 && ` (${campaign.deliveryStats.pending} pending)`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/campaigns/${campaign._id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3 inline-flex items-center"
                      title="View Details"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(campaign._id)}
                      className="text-red-600 hover:text-red-900 inline-flex items-center"
                      title="Delete Campaign"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <MessageModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
        onConfirm={modalContent.type === 'confirm' ? confirmDeleteCampaign : null}
      />
    </div>
  );
};

export default CampaignListPage;
