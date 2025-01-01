import React, { useState } from 'react';
import { format } from 'date-fns';
import { useStore } from '../store/useStore';
import { PhoneIcon, EnvelopeIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Dialog } from '@headlessui/react';
import { Company, Communication, CommunicationType } from '../types';

const CommunicationDashboard = () => {
  const { 
    companies, 
    communications,
    communicationMethods,
    addCommunication, 
    getCommunicationsForCompany, 
    getNextScheduledCommunication 
  } = useStore();

  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communicationForm, setCommunicationForm] = useState({
    type: '' as CommunicationType,
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  });

  const isOverdue = (date: Date) => date < new Date();
  const isDueToday = (date: Date) => {
    const today = new Date();
    return format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Phone Call': return <PhoneIcon className="h-4 w-4" />;
      case 'Email': return <EnvelopeIcon className="h-4 w-4" />;
      case 'LinkedIn Message':
      case 'LinkedIn Post': return <ChatBubbleLeftIcon className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleCompanySelect = (companyId: string) => {
    const newSelected = new Set(selectedCompanies);
    if (newSelected.has(companyId)) {
      newSelected.delete(companyId);
    } else {
      newSelected.add(companyId);
    }
    setSelectedCompanies(newSelected);
  };

  const handleSubmitCommunication = () => {
    if (!communicationForm.type || !communicationForm.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    selectedCompanies.forEach(companyId => {
      const newCommunication: Communication = {
        id: Date.now().toString(),
        companyId,
        type: communicationForm.type as CommunicationType,
        date: new Date(communicationForm.date),
        notes: communicationForm.notes,
        status: 'pending', // or any default status value
        hasFollowUp: false // or any default value
      };
      addCommunication(newCommunication);
    });

    toast.success('Communication logged successfully');
    setIsModalOpen(false);
    setSelectedCompanies(new Set());
    setCommunicationForm({
      type: '' as CommunicationType,
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Communication Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage company communications
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={selectedCompanies.size === 0}
          className={`px-4 py-2 rounded-md text-white ${
            selectedCompanies.size > 0 
              ? 'bg-indigo-600 hover:bg-indigo-700' 
              : 'bg-gray-400 cursor-not-allowed'
          } transition-colors duration-200`}
        >
          Log Communication
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={selectedCompanies.size === companies.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCompanies(new Set(companies.map(c => c.id)));
                    } else {
                      setSelectedCompanies(new Set());
                    }
                  }}
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last 5 Communications
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Next Scheduled
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map((company) => {
              const lastComms = getCommunicationsForCompany(company.id).slice(0, 5);
              const nextScheduled = getNextScheduledCommunication(company.id);
              const isNextOverdue = nextScheduled && isOverdue(nextScheduled);
              const isNextDueToday = nextScheduled && isDueToday(nextScheduled);

              return (
                <tr 
                  key={company.id}
                  className={`
                    ${isNextOverdue ? 'bg-red-50 hover:bg-red-100' : 
                      isNextDueToday ? 'bg-yellow-50 hover:bg-yellow-100' : 
                      'hover:bg-gray-50'
                    } transition-colors duration-200
                  `}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={selectedCompanies.has(company.id)}
                      onChange={() => handleCompanySelect(company.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{company.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {lastComms.map((comm) => (
                        <div
                          key={comm.id}
                          className="group relative inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                          title={comm.notes}
                        >
                          {getIconForType(comm.type)}
                          <span>{format(comm.date, 'MMM d')}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {nextScheduled && (
                      <span className={`
                        inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
                        ${isNextOverdue ? 'bg-red-100 text-red-800' : 
                          isNextDueToday ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}
                      `}>
                        {format(nextScheduled, 'MMM d, yyyy')}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

<Dialog
  open={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  className="fixed inset-0 z-50 overflow-y-auto"
>
  <div className="flex min-h-screen items-center justify-center">
    {/* Use a div with onClick handler instead of Dialog.Overlay */}
    <div 
      className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" 
      aria-hidden="true"
      onClick={() => setIsModalOpen(false)}
    />
    
    {/* Content container */}
    <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Log Communication
      </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={communicationForm.type}
                  onChange={(e) => setCommunicationForm({
                    ...communicationForm,
                    type: e.target.value as CommunicationType
                  })}
                >
                  <option value="">Select type</option>
                  {communicationMethods.map((method) => (
                    <option key={method.name} value={method.name}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={communicationForm.date}
                  onChange={(e) => setCommunicationForm({
                    ...communicationForm,
                    date: e.target.value
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={3}
                  value={communicationForm.notes}
                  onChange={(e) => setCommunicationForm({
                    ...communicationForm,
                    notes: e.target.value
                  })}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                  onClick={handleSubmitCommunication}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CommunicationDashboard;