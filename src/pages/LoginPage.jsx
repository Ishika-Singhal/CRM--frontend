import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MessageModal from '../components/MessageModal';
const LoginPage = ({ message: propMessage }) => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'info' });

  useEffect(() => {
   
    if (propMessage) {
      setModalContent({ title: 'Login Error', message: propMessage, type: 'error' });
      setShowModal(true);
    } else if (location.search.includes('error')) {
      
      setModalContent({ title: 'Login Failed', message: 'Google authentication failed. Please try again.', type: 'error' });
      setShowModal(true);
    }
  }, [location, propMessage]);

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-xl border border-gray-200">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your Mini CRM platform
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleLogin}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.27c0-.78-.07-1.53-.2-2.27H12v4.51h6.59c-.31 1.59-1.16 2.8-2.6 3.63v3.71h3.71c2.17-2 3.44-4.83 3.44-8.08z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.47-1.02 7.29-2.79l-3.71-3.71c-.96.64-2.2 1.02-3.58 1.02-2.74 0-5.08-1.85-5.91-4.39H2.03v3.71C3.89 21.13 7.64 23 12 23z" fill="#34A853"/>
                <path d="M5.91 14.39c-.2-.64-.31-1.3-.31-2.01s.11-1.37.31-2.01V6.67H2.03C1.34 8.01 1 9.94 1 12s.34 3.99 1.03 5.33l3.88-3.71z" fill="#FBBC05"/>
                <path d="M12 5.61c1.64 0 3.1.57 4.26 1.66L19.29 3.7c-1.82-1.68-4.32-2.7-7.29-2.7-4.36 0-8.11 1.87-10.08 5.33l3.88 3.71c.83-2.54 3.17-4.39 5.91-4.39z" fill="#EA4335"/>
              </svg>
            </span>
            Sign in with Google
          </button>
        </div>
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

export default LoginPage;