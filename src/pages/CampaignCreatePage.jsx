import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RuleBuilder from '../components/RuleBuilder';
import MessageModal from '../components/MessageModal';
import crmApi from '../api/crmApi';
import { SparklesIcon } from '@heroicons/react/24/outline'; // AI icon

/**
 * CampaignCreatePage component allows users to create new campaigns.
 * It includes a dynamic rule builder for segmentation and an AI-powered feature.
 */
const CampaignCreatePage = () => {
  const navigate = useNavigate();
  const [campaignName, setCampaignName] = useState('');
  const [description, setDescription] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('');
  const [segmentRules, setSegmentRules] = useState({ operator: 'AND', rules: [] });
  const [audienceSize, setAudienceSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'info' });

  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [generatingRules, setGeneratingRules] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Removed the useEffect that was causing potential infinite loops.
  // The initial state for segmentRules is now handled solely by useState.
  // If rules need to be loaded for editing, that logic should be in a separate useEffect
  // that depends on a campaign ID prop, not on segmentRules itself.

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!campaignName || !messageTemplate || !segmentRules.rules.length) {
      setModalContent({ title: 'Validation Error', message: 'Please fill in all required fields and define at least one segmentation rule.', type: 'error' });
      setShowModal(true);
      setLoading(false);
      return;
    }

    try {
      const campaignData = {
        name: campaignName,
        description,
        messageTemplate,
        segmentRules,
        // Status can be 'draft' initially, or 'scheduled'/'sent' if you add scheduling
        status: 'sent', // For demo, directly mark as 'sent' to trigger simulation
      };

      const response = await crmApi.createCampaign(campaignData);

      if (response.data.success) { // FIX: Access .data.success
        setModalContent({ title: 'Success', message: 'Campaign created successfully! Delivery simulation initiated.', type: 'success' });
        setShowModal(true);
        // Redirect to campaign history after a short delay for user to see success message
        setTimeout(() => {
          navigate('/campaigns');
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to create campaign.'); // FIX: Access .data.message
        setModalContent({ title: 'Error', message: response.data.message || 'Failed to create campaign.', type: 'error' }); // FIX: Access .data.message
        setShowModal(true);
      }
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError(err.response?.data?.message || 'An unexpected error occurred.');
      setModalContent({ title: 'Error', message: err.response?.data?.message || 'An unexpected error occurred.', type: 'error' });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRulesFromAI = async () => {
    if (!naturalLanguageQuery.trim()) {
      setModalContent({ title: 'Input Required', message: 'Please enter a natural language query to generate rules.', type: 'info' });
      setShowModal(true);
      return;
    }

    setGeneratingRules(true);
    setAiError(null);
    try {
      const response = await crmApi.generateSegmentRulesFromAI(naturalLanguageQuery);
      if (response.data.success && response.data.segmentRules) { // FIX: Access .data.success and .data.segmentRules
        setSegmentRules(response.data.segmentRules); // FIX: Access .data.segmentRules
        setAudienceSize(response.data.audienceSize); // FIX: Access .data.audienceSize
        setModalContent({ title: 'AI Success', message: 'Segment rules generated successfully!', type: 'success' });
        setShowModal(true);
      } else {
        setAiError(response.data.message || 'Failed to generate rules from AI.'); // FIX: Access .data.message
        setModalContent({ title: 'AI Error', message: response.data.message || 'Failed to generate rules from AI.', type: 'error' }); // FIX: Access .data.message
        setShowModal(true);
      }
    } catch (err) {
      console.error('Error generating rules from AI:', err);
      setAiError(err.response?.data?.message || 'Error communicating with AI service.');
      setModalContent({ title: 'AI Error', message: err.response?.data?.message || 'Error communicating with AI service.', type: 'error' });
      setShowModal(true);
    } finally {
      setGeneratingRules(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Create New Campaign</h1>

      <form onSubmit={handleCreateCampaign} className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
          {/* Campaign Name */}
          <div>
            <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700">
              Campaign Name <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="campaignName"
                id="campaignName"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="e.g., Summer Sale Promotion"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Brief description of the campaign"
              ></textarea>
            </div>
          </div>

          {/* Message Template */}
          <div className="sm:col-span-2">
            <label htmlFor="messageTemplate" className="block text-sm font-medium text-gray-700">
              Message Template <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <textarea
                id="messageTemplate"
                name="messageTemplate"
                rows="5"
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="e.g., Hi {{customer_name}}, check out our new arrivals! Use code SAVE10. (Use {{customer_email}} for email)"
                required
              ></textarea>
              
            </div>
          </div>
        </div>

        {/* AI-Powered Feature: Natural Language to Segment Rules */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <SparklesIcon className="h-6 w-6 mr-2 text-purple-600" /> AI-Powered Segmentation
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Describe your target audience in natural language, and AI will generate the rules for you!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={naturalLanguageQuery}
              onChange={(e) => setNaturalLanguageQuery(e.target.value)}
              placeholder="e.g., people who haven't shopped in 6 months and spent over ₹5K"
              className="flex-grow shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              disabled={generatingRules}
            />
            <button
              type="button"
              onClick={handleGenerateRulesFromAI}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out w-full sm:w-auto"
              disabled={generatingRules}
            >
              {generatingRules ? 'Generating...' : 'Generate Rules'}
            </button>
          </div>
          {aiError && <p className="mt-2 text-sm text-red-600">{aiError}</p>}
        </div>


        {/* Dynamic Rule Builder */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Segmentation Rules</h2>
          <RuleBuilder
            rules={segmentRules}
            onRulesChange={setSegmentRules}
            onAudienceSizeChange={setAudienceSize}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/campaigns')}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            disabled={loading || generatingRules}
          >
            {loading ? 'Creating Campaign...' : 'Create Campaign'}
          </button>
        </div>
      </form>

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

export default CampaignCreatePage;
