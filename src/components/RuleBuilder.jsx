import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircleIcon, MinusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import crmApi from '../api/crmApi'; 
const RuleBuilder = ({ rules, onRulesChange, onAudienceSizeChange }) => {
  
  const [internalRules, setInternalRules] = useState(rules);
  const [audienceSize, setAudienceSize] = useState(0);
  const [sampleEmails, setSampleEmails] = useState([]);
  const [loadingAudience, setLoadingAudience] = useState(false);
  const [audienceError, setAudienceError] = useState(null);

  const fields = [
    { value: 'totalSpend', label: 'Total Spend', type: 'number' },
    { value: 'totalVisits', label: 'Total Visits', type: 'number' },
    { value: 'lastActivity', label: 'Last Activity', type: 'date' },
    { value: 'email', label: 'Email', type: 'string' },
    { value: 'name', label: 'Name', type: 'string' },
    { value: 'address', label: 'Address', type: 'string' },
    { value: 'phone', label: 'Phone', type: 'string' },
  ];


  const getConditionsForField = (fieldType) => {
    switch (fieldType) {
      case 'number':
        return [
          { value: 'EQ', label: 'Equals' },
          { value: 'NE', label: 'Not Equals' },
          { value: 'GT', label: 'Greater Than' },
          { value: 'LT', label: 'Less Than' },
          { value: 'GTE', label: 'Greater Than or Equal To' },
          { value: 'LTE', label: 'Less Than or Equal To' },
        ];
      case 'string':
        return [
          { value: 'EQ', label: 'Equals' },
          { value: 'NE', label: 'Not Equals' },
          { value: 'CONTAINS', label: 'Contains' },
          { value: 'NOCONTAINS', label: 'Does Not Contain' },
        ];
      case 'date':
        return [
          { value: 'INACTIVE_DAYS', label: 'Inactive for (days)' }, 
          { value: 'ACTIVE_DAYS', label: 'Active within (days)' }, 
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    if (JSON.stringify(internalRules) !== JSON.stringify(rules)) {
      setInternalRules(rules);
    }
  }, [rules, internalRules]); 

  const updateRule = useCallback((currentRules, path, key, value) => {
    const newRules = { ...currentRules };
    let target = newRules;
    for (let i = 0; i < path.length; i++) {
      target = target.rules[path[i]];
    }
    target[key] = value;
    return newRules;
  }, []); 
  const addRule = useCallback((currentRules, path, isGroup = false) => {
    const newRules = { ...currentRules };
    let target = newRules;
    for (let i = 0; i < path.length; i++) {
      target = target.rules[path[i]];
    }
    if (!target.rules) target.rules = [];

    if (isGroup) {
      target.rules.push({ operator: 'AND', rules: [] });
    } else {
      target.rules.push({ field: '', condition: '', value: '' });
    }
    return newRules;
  }, []);
  const removeRule = useCallback((currentRules, path) => {
    const newRules = { ...currentRules };
    let targetParent = newRules;
    for (let i = 0; i < path.length - 1; i++) {
      targetParent = targetParent.rules[path[i]];
    }
    const indexToRemove = path[path.length - 1];
    targetParent.rules.splice(indexToRemove, 1);
    return newRules;
  }, []);
  const handleRuleChange = useCallback((newRules) => {
    setInternalRules(newRules);
    onRulesChange(newRules); 
  }, [onRulesChange]);

  const fetchAudiencePreview = useCallback(async () => {
    if (!internalRules || !internalRules.operator || !internalRules.rules.length) {
      setAudienceSize(0);
      setSampleEmails([]);
      setAudienceError(null);
      return;
    }

    setLoadingAudience(true);
    setAudienceError(null);
    try {
      const response = await crmApi.getAudiencePreview(internalRules);
      if (response.data.success) { 
        setAudienceSize(response.data.audienceSize); 
        setSampleEmails(response.data.sampleCustomerEmails); 
        onAudienceSizeChange(response.data.audienceSize);
      } else {
        setAudienceError(response.data.message || 'Failed to get audience preview.');
      }
    } catch (error) {
      console.error('Error fetching audience preview:', error);
      setAudienceError(error.response?.data?.message || 'Error fetching audience preview.');
    } finally {
      setLoadingAudience(false);
    }
  }, [internalRules, onAudienceSizeChange]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchAudiencePreview();
    }, 500); 

    return () => {
      clearTimeout(handler);
    };
  }, [internalRules, fetchAudiencePreview]); 

  
  const renderRuleGroup = (group, path) => {
    return (
      <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-sm">
     
        <div className="flex items-center mb-4">
          <label htmlFor={`operator-${path.join('-')}`} className="mr-2 text-sm font-medium text-gray-700">
            Combine with:
          </label>
          <select
            id={`operator-${path.join('-')}`}
            value={group.operator}
            onChange={(e) => handleRuleChange(updateRule(internalRules, path, 'operator', e.target.value))}
            className="block w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
          {path.length > 0 && ( 
            <button
              type="button"
              onClick={() => handleRuleChange(removeRule(internalRules, path))}
              className="ml-auto p-2 rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              title="Remove Group"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {group.rules.map((rule, index) => {
          const currentPath = [...path, index];
          if (rule.operator) {
            
            return (
              <div key={index} className="ml-4 border-l-2 border-indigo-200 pl-4 py-2">
                {renderRuleGroup(rule, currentPath)}
              </div>
            );
          } else {
            
            const selectedField = fields.find(f => f.value === rule.field);
            const conditions = selectedField ? getConditionsForField(selectedField.type) : [];
            const isDateCondition = selectedField && selectedField.type === 'date';

            return (
              <div key={index} className="flex flex-wrap items-center gap-3 mb-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                
                <select
                  value={rule.field}
                  onChange={(e) => handleRuleChange(updateRule(internalRules, currentPath, 'field', e.target.value))}
                  className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Field</option>
                  {fields.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>

                <select
                  value={rule.condition}
                  onChange={(e) => handleRuleChange(updateRule(internalRules, currentPath, 'condition', e.target.value))}
                  className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  disabled={!rule.field}
                >
                  <option value="">Select Condition</option>
                  {conditions.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>

               
                <input
                  type={isDateCondition ? 'number' : (selectedField?.type === 'number' ? 'number' : 'text')}
                  value={rule.value}
                  onChange={(e) => handleRuleChange(updateRule(internalRules, currentPath, 'value', isDateCondition || selectedField?.type === 'number' ? Number(e.target.value) : e.target.value))}
                  placeholder={isDateCondition ? 'Days' : 'Value'}
                  className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  disabled={!rule.condition}
                />

                <button
                  type="button"
                  onClick={() => handleRuleChange(removeRule(internalRules, currentPath))}
                  className="p-2 rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  title="Remove Rule"
                >
                  <MinusCircleIcon className="h-5 w-5" />
                </button>
              </div>
            );
          }
        })}

       
        <div className="flex space-x-2 mt-4">
          <button
            type="button"
            onClick={() => handleRuleChange(addRule(internalRules, path, false))}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Rule
          </button>
          <button
            type="button"
            onClick={() => handleRuleChange(addRule(internalRules, path, true))}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Rule Group
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="rule-builder">
  
      {renderRuleGroup(internalRules, [])}

    
      <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg shadow-inner">
        <h4 className="text-lg font-semibold text-indigo-800 mb-2">Audience Preview</h4>
        {loadingAudience ? (
          <p className="text-indigo-700">Calculating audience size...</p>
        ) : audienceError ? (
          <p className="text-red-600">Error: {audienceError}</p>
        ) : (
          <>
            <p className="text-indigo-700">
              Estimated Audience Size: <span className="font-bold text-xl">{audienceSize}</span> customers
            </p>
            {sampleEmails.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-indigo-600 font-medium">Sample Emails:</p>
                <ul className="list-disc list-inside text-sm text-indigo-600">
                  {sampleEmails.map((email, index) => (
                    <li key={index}>{email}</li>
                  ))}
                </ul>
              </div>
            )}
            {audienceSize === 0 && !audienceError && (
              <p className="text-indigo-700 text-sm">No customers match the current rules.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RuleBuilder;
