import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Company, CommunicationType } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';
import toast from 'react-hot-toast';

export const AdminModule: React.FC = () => {
  const { 
    companies, 
    communicationMethods,
    updateCommunicationMethod, 
    addCompany, 
    updateCompany, 
    deleteCompany 
  } = useStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const initialCompanyState = {
    id: '',
    name: '',
    location: '',
    linkedinProfile: '',
    emails: [''],
    phoneNumbers: [''],
    comments: '',
    communicationPeriodicity: 14,
    createdAt: new Date(),
  };

  const [formData, setFormData] = useState<Company>(initialCompanyState);

  const handleInputChange = (field: keyof Company, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleArrayInputChange = (
    field: 'emails' | 'phoneNumbers',
    value: string,
    index: number
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field: 'emails' | 'phoneNumbers') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayField = (field: 'emails' | 'phoneNumbers', index: number) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData({ ...formData, [field]: newArray });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        updateCompany(formData);
        toast.success('Company updated successfully');
      } else {
        const newCompany = {
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date()
        };
        addCompany(newCompany);
        toast.success('Company added successfully');
      }
      resetForm();
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData(initialCompanyState);
    setIsAdding(false);
    setEditingCompany(null);
  };

  const handleMandatoryToggle = (index: number) => {
  const method = communicationMethods[index];
  updateCommunicationMethod(index, {
    ...method,
    mandatory: !method.mandatory
  });
};

  const handleDelete = (id: string) => {
    try {
      deleteCompany(id);
      setShowDeleteConfirm(null);
      toast.success('Company deleted successfully');
    } catch (error) {
      toast.error('An error occurred while deleting the company');
    }
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setFormData(company);
    setIsAdding(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Company Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage companies and their communication preferences
          </p>
        </div>
        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Company
          </button>
        )}
      </div>

      {/* Company Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            {/* Company Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Company Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location *
              </label>
              <input
                type="text"
                id="location"
                required
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            {/* LinkedIn Profile */}
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                LinkedIn Profile *
              </label>
              <input
                type="url"
                id="linkedin"
                required
                value={formData.linkedinProfile}
                onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="https://linkedin.com/company/..."
              />
            </div>

            {/* Communication Periodicity */}
            <div>
              <label htmlFor="periodicity" className="block text-sm font-medium text-gray-700">
                Communication Periodicity (days) *
              </label>
              <input
                type="number"
                id="periodicity"
                required
                min="1"
                value={formData.communicationPeriodicity}
                onChange={(e) => handleInputChange('communicationPeriodicity', parseInt(e.target.value))}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            {/* Email Addresses */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Addresses *
              </label>
              {formData.emails.map((email, index) => (
                <div key={index} className="mt-1 flex items-center space-x-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => handleArrayInputChange('emails', e.target.value, index)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="email@company.com"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField('emails', index)}
                    className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-500 hover:text-gray-600 hover:border-gray-400"
                    disabled={formData.emails.length === 1}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('emails')}
                className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add another email
              </button>
            </div>

            {/* Phone Numbers */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone Numbers *
              </label>
              {formData.phoneNumbers.map((phone, index) => (
                <div key={index} className="mt-1 flex items-center space-x-2">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => handleArrayInputChange('phoneNumbers', e.target.value, index)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="+1 (123) 456-7890"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField('phoneNumbers', index)}
                    className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-500 hover:text-gray-600 hover:border-gray-400"
                    disabled={formData.phoneNumbers.length === 1}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('phoneNumbers')}
                className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add another phone number
              </button>
            </div>

            {/* Comments */}
            <div className="sm:col-span-2">
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <textarea
                id="comments"
                rows={3}
                value={formData.comments}
                onChange={(e) => handleInputChange('comments', e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Form Actions */}
                    <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingCompany ? 'Update Company' : 'Add Company'}
            </button>
          </div>
        </form>
      )}

      {/* Communication Methods Table - Made responsive */}
{/* Communication Methods Table - Made responsive */}
{/* Communication Methods Table */}
<div className="mt-8">
  <h3 className="text-lg font-medium text-gray-900 mb-4">Communication Methods</h3>
  <div className="overflow-x-auto -mx-4 sm:mx-0">
    <div className="inline-block min-w-full align-middle">
      <div className="overflow-hidden ring-1 ring-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:pl-6">
                Method
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sequence
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mandatory
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {communicationMethods
              .slice()
              .sort((a, b) => a.sequence - b.sequence)
              .map((method, index) => (
                <tr key={`${method.name}-${index}`}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {method.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {method.sequence}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {method.description}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <Switch
                      checked={method.mandatory}
                      onChange={() => handleMandatoryToggle(index)}
                      className={`${
                        method.mandatory ? 'bg-indigo-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                      <span className="sr-only">Toggle mandatory</span>
                      <span
                        className={`${
                          method.mandatory ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

      {/* Companies Table - Made responsive */}
      {companies.length > 0 && !isAdding && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Companies</h3>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden ring-1 ring-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:pl-6">
                        Company Name
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Periodicity
                      </th>
                      <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {companies.map((company, index) => (
                      <tr key={company.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          <a 
                            href={company.linkedinProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-indigo-600 transition-colors duration-200"
                          >
                            {company.name}
                          </a>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {company.location}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          <div className="space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                              <span className="text-xs font-medium text-gray-500">Email:</span>
                              <span className="truncate">{company.emails[0]}</span>
                              {company.emails.length > 1 && (
                                <span className="text-xs text-gray-400">
                                  +{company.emails.length - 1} more
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                              <span className="text-xs font-medium text-gray-500">Phone:</span>
                              <span className="truncate">{company.phoneNumbers[0]}</span>
                              {company.phoneNumbers.length > 1 && (
                                <span className="text-xs text-gray-400">
                                  +{company.phoneNumbers.length - 1} more
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {company.communicationPeriodicity} days
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleEditCompany(company)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <PencilIcon className="h-5 w-5" />
                              <span className="sr-only">Edit</span>
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(company.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                              <span className="sr-only">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - Made responsive */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Delete Company
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this company? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(null)}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminModule;