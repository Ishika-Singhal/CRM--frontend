import React, { useEffect, useState } from 'react';
import crmApi from '../api/crmApi';
import MessageModal from '../components/MessageModal';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; 

const CustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'info' });


  const [showCustomerFormModal, setShowCustomerFormModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null); 
  const [formData, setFormData] = useState({
    customerId: '',
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await crmApi.getCustomers();
      if (response.data.success) { 
        setCustomers(response.data.customers); 
      } else {
        setError(response.data.message || 'Failed to fetch customers.'); 
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err.response?.data?.message || 'Error fetching customers.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCustomerClick = () => {
    setCurrentCustomer(null); 
    setFormData({
      customerId: '',
      name: '',
      email: '',
      phone: '',
      address: ''
    });
    setShowCustomerFormModal(true);
  };

  const handleEditCustomerClick = (customer) => {
    setCurrentCustomer(customer); 
    setFormData({
      customerId: customer.customerId,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    });
    setShowCustomerFormModal(true);
  };

  const handleSubmitCustomerForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowCustomerFormModal(false); 

    try {
      let response;
      if (currentCustomer) {
        
        response = await crmApi.updateCustomer(currentCustomer.customerId, formData);
      } else {
   
        response = await crmApi.createCustomer(formData);
      }

      if (response.data.success) { 
        setModalContent({ title: 'Success', message: `Customer ${currentCustomer ? 'updated' : 'created'} successfully!`, type: 'success' });
        setShowModal(true);
        fetchCustomers(); 
      } else {
        setModalContent({ title: 'Error', message: response.data.message || `Failed to ${currentCustomer ? 'update' : 'create'} customer.`, type: 'error' }); // FIX: Access .data.message
        setShowModal(true);
      }
    } catch (err) {
      console.error(`Error ${currentCustomer ? 'updating' : 'creating'} customer:`, err);
      setModalContent({ title: 'Error', message: err.response?.data?.message || `Error ${currentCustomer ? 'updating' : 'creating'} customer.`, type: 'error' });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomerClick = (customerId) => {
    setModalContent({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this customer? This will also delete associated orders.',
      type: 'confirm',
      onConfirm: (confirmed) => confirmDeleteCustomer(confirmed, customerId)
    });
    setShowModal(true);
  };

  const confirmDeleteCustomer = async (confirmed, customerId) => {
    setShowModal(false);
    if (confirmed) {
      setLoading(true);
      try {
        const response = await crmApi.deleteCustomer(customerId);
        if (response.data.success) { 
          setModalContent({ title: 'Success', message: 'Customer deleted successfully!', type: 'success' });
          setShowModal(true);
          fetchCustomers(); 
        } else {
          setModalContent({ title: 'Error', message: response.data.message || 'Failed to delete customer.', type: 'error' });
          setShowModal(true);
        }
      } catch (err) {
        console.error('Error deleting customer:', err);
        setModalContent({ title: 'Error', message: err.response?.data?.message || 'Error deleting customer.', type: 'error' });
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    }
  };


  if (loading && !customers.length) { 
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold text-gray-700">
        Loading customers...
      </div>
    );
  }

  if (error && !customers.length) { 
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
        <h1 className="text-3xl font-extrabold text-gray-900">Customers</h1>
        <button
          onClick={handleAddCustomerClick}
          className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add New Customer
        </button>
      </div>

      {customers.length === 0 && !loading ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 text-lg">No customer data ingested yet. Add a new customer!</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spend
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Visits
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.customerId} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.customerId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {customer.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    ₹{customer.totalSpend.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {customer.totalVisits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditCustomerClick(customer)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3 inline-flex items-center"
                      title="Edit Customer"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCustomerClick(customer.customerId)}
                      className="text-red-600 hover:text-red-900 inline-flex items-center"
                      title="Delete Customer"
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
        show={showCustomerFormModal}
        onClose={() => setShowCustomerFormModal(false)}
        title={currentCustomer ? 'Edit Customer' : 'Add New Customer'}
        message={
          <form onSubmit={handleSubmitCustomerForm} className="space-y-4">
            <div>
              <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
                Customer ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customerId"
                id="customerId"
                value={formData.customerId}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                disabled={!!currentCustomer} 
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                name="address"
                id="address"
                value={formData.address}
                onChange={handleFormChange}
                rows="2"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCustomerFormModal(false)}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? 'Saving...' : (currentCustomer ? 'Update Customer' : 'Add Customer')}
              </button>
            </div>
          </form>
        }
        type="custom"
        onConfirm={null} 
      />

      
      <MessageModal
        show={showModal && modalContent.type !== 'custom'}
        onClose={() => setShowModal(false)}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
        onConfirm={modalContent.onConfirm}
      />
    </div>
  );
};

export default CustomerListPage;