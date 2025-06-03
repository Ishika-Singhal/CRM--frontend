import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import crmApi from '../api/crmApi';
import MessageModal from '../components/MessageModal';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // Icon

/**
 * CampaignDetailPage component displays detailed information about a specific campaign,
 * including its segmentation rules and communication logs.
 */
const CampaignDetailPage = () => {
  const { id } = useParams(); // Get campaign ID from URL
  const [campaign, setCampaign] = useState(null);
  const [communicationLogs, setCommunicationLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'info' });

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch campaign details
        const campaignResponse = await crmApi.getCampaignById(id);
        if (campaignResponse.data.success) { // FIX: Access .data.success
          setCampaign(campaignResponse.data.campaign); // FIX: Access .data.campaign
        } else {
          setError(campaignResponse.data.message || 'Failed to fetch campaign details.'); // FIX: Access .data.message
          setModalContent({ title: 'Error', message: campaignResponse.data.message || 'Failed to fetch campaign details.', type: 'error' }); // FIX: Access .data.message
          setShowModal(true);
        }

        // Fetch communication logs for the campaign
        const logsResponse = await crmApi.getCommunicationLogsForCampaign(id);
        if (logsResponse.data.success) { // FIX: Access .data.success
          setCommunicationLogs(logsResponse.data.logs); // FIX: Access .data.logs
        } else {
          console.error('Failed to fetch communication logs:', logsResponse.data.message); // FIX: Access .data.message
          // Don't block the page if logs fail, just show an error for logs section
        }
      } catch (err) {
        console.error('Error fetching campaign details or logs:', err);
        setError(err.response?.data?.message || 'An unexpected error occurred while fetching campaign details.');
        setModalContent({ title: 'Error', message: err.response?.data?.message || 'An unexpected error occurred.', type: 'error' });
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold text-gray-700">
        Loading campaign details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
        <p className="font-bold">Error!</p>
        <p>{error}</p>
        <Link to="/campaigns" className="text-sm text-red-700 hover:text-red-900 mt-2 block">
          Go back to Campaigns
        </Link>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
        <p className="font-bold">Campaign Not Found</p>
        <p>The campaign you are looking for does not exist or you do not have access.</p>
        <Link to="/campaigns" className="text-sm text-yellow-700 hover:text-yellow-900 mt-2 block">
          Go back to Campaigns
        </Link>
      </div>
    );
  }

  // Helper to render segment rules recursively
  const renderRules = (rules) => {
    if (!rules || !rules.rules || rules.rules.length === 0) {
      return <span className="text-gray-500 italic">No rules defined.</span>;
    }

    return (
      <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
        <p className="font-semibold text-gray-800 mb-2">
          Combine with: <span className="text-indigo-600">{rules.operator}</span>
        </p>
        <ul className="list-disc list-inside space-y-2">
          {rules.rules.map((rule, index) => (
            <li key={index} className="text-sm text-gray-700">
              {rule.operator ? (
                // Nested group
                <div className="ml-4 border-l-2 border-indigo-200 pl-3">
                  {renderRules(rule)}
                </div>
              ) : (
                // Individual rule
                <>
                  <span className="font-medium">{rule.field}</span>{' '}
                  <span className="font-medium text-indigo-500">{rule.condition}</span>{' '}
                  <span className="font-bold">{typeof rule.value === 'object' ? JSON.stringify(rule.value) : rule.value}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/campaigns" className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4">
          <ArrowLeftIcon className="h-5 w-5 mr-1" /> Back to Campaigns
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900">{campaign.name}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Description:</p>
            <p className="mt-1 text-gray-900">{campaign.description || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Audience Size:</p>
            <p className="mt-1 text-gray-900">{campaign.audienceSize}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status:</p>
            <p className={`mt-1 text-gray-900 font-semibold ${
              campaign.status === 'sent' || campaign.status === 'completed' ? 'text-green-600' :
              campaign.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Created At:</p>
            <p className="mt-1 text-gray-900">{new Date(campaign.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Sent At:</p>
            <p className="mt-1 text-gray-900">{campaign.sentAt ? new Date(campaign.sentAt).toLocaleString() : 'Not sent yet'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-500">Message Template:</p>
            <p className="mt-1 text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200 whitespace-pre-wrap">
              {campaign.messageTemplate}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-500 mb-2">Segmentation Rules:</p>
            {renderRules(campaign.segmentRules)}
          </div>
        </div>
      </div>

      {/* Campaign Delivery Stats */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-blue-50 rounded-md">
            <p className="text-sm font-medium text-blue-700">Total Sent</p>
            <p className="text-2xl font-bold text-blue-900">{campaign.deliveryStats.sent}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-md">
            <p className="text-sm font-medium text-red-700">Total Failed</p>
            <p className="text-2xl font-bold text-red-900">{campaign.deliveryStats.failed}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-md">
            <p className="text-sm font-medium text-yellow-700">Total Pending</p>
            <p className="text-2xl font-bold text-yellow-900">{campaign.deliveryStats.pending}</p>
          </div>
        </div>
      </div>

      {/* Communication Logs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Communication Logs</h2>
        {communicationLogs.length === 0 ? (
          <p className="text-gray-600">No communication logs found for this campaign yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message Content
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attempted At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Failure Reason
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {communicationLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.customerId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                      {log.messageContent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        log.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                        log.deliveryStatus === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {log.deliveryStatus.charAt(0).toUpperCase() + log.deliveryStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(log.deliveryAttemptedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                      {log.failureReason || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MessageModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
      />
    </div>
  );
};

export default CampaignDetailPage;