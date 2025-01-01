import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { Communication } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

export const CommunicationModal: React.FC<Props> = ({ isOpen, onClose, companyId }) => {
  const { communicationMethods, addCommunication } = useStore();
  const [formData, setFormData] = useState<Partial<Communication>>({
    type: communicationMethods[0].name,
    date: new Date(),
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCommunication({
          id: Date.now().toString(),
          companyId,
          type: formData.type!,
          date: formData.date!,
          notes: formData.notes!,
          status: 'pending', // or any default status value
          hasFollowUp: false // or any default value
        });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium mb-4">
            Log Communication
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {communicationMethods.map(method => (
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
                type="datetime-local"
                value={format(formData.date!, "yyyy-MM-dd'T'HH:mm")}
                onChange={e => setFormData({ ...formData, date: new Date(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};