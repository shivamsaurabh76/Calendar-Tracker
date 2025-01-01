// components/NotificationPanel.tsx
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Company } from '../types';

interface NotificationPanelProps {
  overdueCommunications: Company[];
  todayCommunications: Company[];
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  overdueCommunications,
  todayCommunications,
  onClose
}) => {
  return (
    <div className="fixed right-0 top-16 w-full sm:w-96 bg-white shadow-lg rounded-l-lg z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Overdue Communications */}
        {overdueCommunications.length > 0 && (
          <div className="mb-6">
            <h3 className="text-red-600 font-medium mb-2">Overdue</h3>
            <div className="space-y-3">
              {overdueCommunications.map((company) => (
                <div
                  key={company.id}
                  className="bg-red-50 p-3 rounded-md border border-red-100"
                >
                  <p className="font-medium text-gray-900">{company.name}</p>
                  <p className="text-sm text-gray-500">Communication overdue</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Today's Communications */}
        {todayCommunications.length > 0 && (
          <div>
            <h3 className="text-blue-600 font-medium mb-2">Due Today</h3>
            <div className="space-y-3">
              {todayCommunications.map((company) => (
                <div
                  key={company.id}
                  className="bg-blue-50 p-3 rounded-md border border-blue-100"
                >
                  <p className="font-medium text-gray-900">{company.name}</p>
                  <p className="text-sm text-gray-500">Due for communication today</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Notifications */}
        {overdueCommunications.length === 0 && todayCommunications.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No pending notifications
          </div>
        )}
      </div>
    </div>
  );
};