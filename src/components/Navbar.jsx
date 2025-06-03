import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // 
import crmApi from '../api/crmApi'; // 
import { Dialog, Transition } from '@headlessui/react'; 
import { Fragment, useState } from 'react';
import { ExclamationTriangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // Icons

const Navbar = () => {
  const { isAuthenticated, user, logout: clientLogout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {

      const response = await crmApi.logout();
      if (response.data.success) { 
        clientLogout(); 
        setShowLogoutModal(false);
        navigate('/login');
      } else {
        console.error('Logout failed:', response.data.message || 'Unknown error');
  
      }
    } catch (error) {
      console.error('Logout failed:', error);
    
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', current: false },
    { name: 'Campaigns', href: '/campaigns', current: false, authRequired: true },
    { name: 'Customers', href: '/customers', current: false, authRequired: true },
    { name: 'Orders', href: '/orders', current: false, authRequired: true },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
     
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 text-2xl font-bold text-indigo-600">
              Mini CRM
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                (!item.authRequired || isAuthenticated) && (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </div>

     
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="text-gray-500 text-sm">Loading...</div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                {user.profilePicture && (
                  <img
                    className="h-8 w-8 rounded-full object-cover border-2 border-indigo-500"
                    src={user.profilePicture}
                    alt={user.displayName || 'User'}
                  />
                )}
                <span className="text-gray-700 text-sm font-medium">
                  Hi, {user.displayName || user.email}!
                </span>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Login with Google
              </Link>
            )}
          </div>

        
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

     
      <Transition
        show={mobileMenuOpen}
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Dialog as="div" className="md:hidden" onClose={setMobileMenuOpen}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              (!item.authRequired || isAuthenticated) && (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
                >
                  {item.name}
                </Link>
              )
            ))}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {isLoading ? (
                <div className="px-3 text-gray-500 text-sm">Loading...</div>
              ) : isAuthenticated && user ? (
                <>
                  <div className="flex items-center px-5">
                    {user.profilePicture && (
                      <img
                        className="h-8 w-8 rounded-full object-cover border-2 border-indigo-500"
                        src={user.profilePicture}
                        alt={user.displayName || 'User'}
                      />
                    )}
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user.displayName}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 transition duration-150 ease-in-out"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-3 py-2 bg-indigo-600 text-white rounded-md text-base font-medium shadow-md hover:bg-indigo-700 transition duration-150 ease-in-out"
                  >
                    Login with Google
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Dialog>
      </Transition>



      <Transition.Root show={showLogoutModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setShowLogoutModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Confirm Logout
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to log out?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={() => setShowLogoutModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </nav>
  );
};

export default Navbar;