import React, { useEffect, useState } from 'react';
import crmApi from '../api/crmApi';
import MessageModal from '../components/MessageModal';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'info' });

  
  const [showOrderFormModal, setShowOrderFormModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [formData, setFormData] = useState({
    orderId: '',
    customerId: '',
    orderDate: new Date().toISOString().split('T')[0],
    totalAmount: '',
    items: [{ productId: '', productName: '', quantity: '', price: '' }],
    status: 'completed'
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await crmApi.getOrders();
      if (response.data.success) { 
        setOrders(response.data.orders); 
      } else {
        setError(response.data.message || 'Failed to fetch orders.'); 
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Error fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, e) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [e.target.name]: e.target.value
    };
    setFormData({ ...formData, items: newItems });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', productName: '', quantity: '', price: '' }]
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleAddOrderClick = () => {
    setCurrentOrder(null); 
    setFormData({
      orderId: '',
      customerId: '',
      orderDate: new Date().toISOString().split('T')[0],
      totalAmount: '',
      items: [{ productId: '', productName: '', quantity: '', price: '' }],
      status: 'completed'
    });
    setShowOrderFormModal(true);
  };

  const handleEditOrderClick = (order) => {
    setCurrentOrder(order); 
    setFormData({
      orderId: order.orderId,
      customerId: order.customerId,
      orderDate: new Date(order.orderDate).toISOString().split('T')[0], 
      totalAmount: order.totalAmount,
      items: order.items.length > 0 ? order.items : [{ productId: '', productName: '', quantity: '', price: '' }], 
      status: order.status
    });
    setShowOrderFormModal(true);
  };

  const handleSubmitOrderForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowOrderFormModal(false); 

    try {
      
      const itemsToSubmit = formData.items.map(item => ({
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price)
      }));

      const dataToSubmit = {
        ...formData,
        totalAmount: Number(formData.totalAmount),
        items: itemsToSubmit
      };

      let response;
      if (currentOrder) {
        response = await crmApi.updateOrder(currentOrder.orderId, dataToSubmit);
      } else {
        response = await crmApi.createOrder(dataToSubmit);
      }

      if (response.data.success) {
        setModalContent({ title: 'Success', message: `Order ${currentOrder ? 'updated' : 'created'} successfully!`, type: 'success' });
        setShowModal(true);
        fetchOrders(); 
      } else {
        setModalContent({ title: 'Error', message: response.data.message || `Failed to ${currentOrder ? 'update' : 'create'} order.`, type: 'error' }); // FIX: Access .data.message
        setShowModal(true);
      }
    } catch (err) {
      console.error(`Error ${currentOrder ? 'updating' : 'creating'} order:`, err);
      setModalContent({ title: 'Error', message: err.response?.data?.message || `Error ${currentOrder ? 'updating' : 'creating'} order.`, type: 'error' });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrderClick = (orderId) => {
    setModalContent({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this order?',
      type: 'confirm',
      onConfirm: (confirmed) => confirmDeleteOrder(confirmed, orderId)
    });
    setShowModal(true);
  };

  const confirmDeleteOrder = async (confirmed, orderId) => {
    setShowModal(false);
    if (confirmed) {
      setLoading(true);
      try {
        const response = await crmApi.deleteOrder(orderId);
        if (response.data.success) { 
          setModalContent({ title: 'Success', message: 'Order deleted successfully!', type: 'success' });
          setShowModal(true);
          fetchOrders(); 
        } else {
          setModalContent({ title: 'Error', message: response.data.message || 'Failed to delete order.', type: 'error' });
          setShowModal(true);
        }
      } catch (err) {
        console.error('Error deleting order:', err);
        setModalContent({ title: 'Error', message: err.response?.data?.message || 'Error deleting order.', type: 'error' });
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    }
  };


  if (loading && !orders.length) {
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold text-gray-700">
        Loading orders...
      </div>
    );
  }

  if (error && !orders.length) {
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
        <h1 className="text-3xl font-extrabold text-gray-900">Orders</h1>
        <button
          onClick={handleAddOrderClick}
          className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add New Order
        </button>
      </div>

      {orders.length === 0 && !loading ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 text-lg">No order data ingested yet. Add a new order!</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.customerId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    ₹{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditOrderClick(order)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3 inline-flex items-center"
                      title="Edit Order"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteOrderClick(order.orderId)}
                      className="text-red-600 hover:text-red-900 inline-flex items-center"
                      title="Delete Order"
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
        show={showOrderFormModal}
        onClose={() => setShowOrderFormModal(false)}
        title={currentOrder ? 'Edit Order' : 'Add New Order'}
        message={
          <form onSubmit={handleSubmitOrderForm} className="space-y-4">
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">
                Order ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="orderId"
                id="orderId"
                value={formData.orderId}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                disabled={!!currentOrder} // Disable editing orderId for existing orders
              />
            </div>
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
              />
            </div>
            <div>
              <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700">
                Order Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="orderDate"
                id="orderDate"
                value={formData.orderDate}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">
                Total Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="totalAmount"
                id="totalAmount"
                value={formData.totalAmount}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 p-3 bg-gray-50 rounded-md border border-gray-200 items-end">
                  <div>
                    <label htmlFor={`productId-${index}`} className="block text-xs font-medium text-gray-700">Product ID</label>
                    <input
                      type="text"
                      name="productId"
                      id={`productId-${index}`}
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, e)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor={`productName-${index}`} className="block text-xs font-medium text-gray-700">Product Name</label>
                    <input
                      type="text"
                      name="productName"
                      id={`productName-${index}`}
                      value={item.productName}
                      onChange={(e) => handleItemChange(index, e)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor={`quantity-${index}`} className="block text-xs font-medium text-gray-700">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      id={`quantity-${index}`}
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, e)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label htmlFor={`price-${index}`} className="block text-xs font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      name="price"
                      id={`price-${index}`}
                      value={item.price}
                      onChange={(e) => handleItemChange(index, e)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="flex justify-end">
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-2 rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        title="Remove Item"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" /> Add Item
              </button>
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowOrderFormModal(false)}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? 'Saving...' : (currentOrder ? 'Update Order' : 'Add Order')}
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

export default OrderListPage;