import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { BellIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import CommunicationDashboard from './components/Dashboard';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useNotifications } from './hooks/useNotifications';
import { AdminModule } from './components/AdminModule';
import { CalendarView } from './components/CalendarView';
import ReportingModule from './components/ReportingModule';
import { NotificationPanel } from './components/NotificationPanel';

function App() {
  const { overdueCommunications, todayCommunications } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = React.useState(false);

  const handleRouteChange = () => {
    setMobileMenuOpen(false);
    setNotificationPanelOpen(false);
  };

  const menuItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/admin', label: 'Admin' },
    { path: '/calendar', label: 'Calendar' },
    { path: '/reports', label: 'Reports' },
  ];

  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-100">
          {/* Header/Navigation */}
          <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="mx-auto w-full max-w-[2000px] px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between items-center">
                {/* Logo and Desktop Navigation */}
                <div className="flex items-center flex-1">
                  <Link 
                    to="/" 
                    className="text-xl font-bold text-indigo-600 flex-shrink-0 hover:text-indigo-500 transition-colors duration-200"
                    onClick={handleRouteChange}
                  >
                    Calendar Tracker
                  </Link>
                  {/* Desktop Navigation */}
{/* Desktop Navigation */}
<div className="hidden md:flex w-full justify-evenly">
  {menuItems.map((item) => (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) =>
        `${isActive
          ? 'border-indigo-500 text-gray-900'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        } inline-flex items-center border-b-2 px-4 pt-1 text-sm font-medium transition-colors duration-200`
      }
      onClick={handleRouteChange}
    >
      {item.label}
    </NavLink>
  ))}
</div>

                </div>

                {/* Right side controls */}
                <div className="flex items-center space-x-4">
                  {/* Notification Badge */}
                  <div className="relative">
                    <button 
                      className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                      onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" />
                      {(overdueCommunications.length > 0 || todayCommunications.length > 0) && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white animate-pulse">
                          {overdueCommunications.length + todayCommunications.length}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Mobile menu button */}
                  <button
                    type="button"
                    className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    <span className="sr-only">
                      {mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
                    </span>
                    {mobileMenuOpen ? (
                      <XMarkIcon className="block h-6 w-6" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div 
              className={`${
                mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto`}
            >
              <div className="pt-16 pb-3 space-y-1">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `block border-l-4 ${
                        isActive
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                      } py-2 pl-3 pr-4 text-base font-medium transition-colors duration-200`
                    }
                    onClick={handleRouteChange}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </nav>

          {/* Notification Panel */}
          {notificationPanelOpen && (
            <NotificationPanel
              overdueCommunications={overdueCommunications}
              todayCommunications={todayCommunications}
              onClose={() => setNotificationPanelOpen(false)}
            />
          )}

          {/* Overlay for mobile menu and notifications */}
          {(mobileMenuOpen || notificationPanelOpen) && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out md:hidden"
              onClick={handleRouteChange}
              aria-hidden="true"
            />
          )}

          {/* Toast Container */}
          <div className="fixed top-4 right-4 z-50">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                className: 'text-sm md:text-base'
              }}
            />
          </div>

          {/* Main Content */}
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto w-full max-w-[2000px] px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <Routes>
                    <Route path="/" element={<CommunicationDashboard />} />
                    <Route path="/admin" element={<AdminModule />} />
                    <Route path="/calendar" element={<CalendarView />} />
                    <Route path="/reports" element={<ReportingModule />} />
                  </Routes>
                </div>
              </div>
            </div>
          </main>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;