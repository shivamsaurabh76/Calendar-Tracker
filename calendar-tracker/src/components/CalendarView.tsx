import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isAfter, isBefore } from 'date-fns';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Communication, CommunicationType } from '../types';

type CommunicationStatus = 'Upcoming' | 'Overdue' | 'Completed';

export const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Communication | null>(null);

  const { companies, communications, communicationMethods } = useStore();

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const getCommunicationStatus = (comm: Communication): CommunicationStatus => {
    const now = new Date();
    if (isBefore(comm.date, now)) {
      return 'Completed';
    }
    const company = companies.find(c => c.id === comm.companyId);
    if (!company) return 'Completed';
    
    const nextScheduledDate = new Date(comm.date.getTime() + 
      (company.communicationPeriodicity * 24 * 60 * 60 * 1000));
    
    if (isBefore(nextScheduledDate, now)) {
      return 'Overdue';
    }
    return 'Upcoming';
  };

  const getFilteredCommunications = (date: Date): Communication[] => {
    return communications.filter(comm => {
      const sameDay = isSameDay(comm.date, date);
      const typeMatch = selectedType === 'all' || comm.type === selectedType;
      const companyMatch = selectedCompany === 'all' || 
        comm.companyId === companies.find(c => c.name === selectedCompany)?.id;
      const status = getCommunicationStatus(comm);
      const statusMatch = selectedStatus === 'all' || status === selectedStatus;
      
      return sameDay && typeMatch && companyMatch && statusMatch;
    });
  };

  const getCommunicationColor = (comm: Communication): string => {
    const status = getCommunicationStatus(comm);
    const typeColorMap: Record<CommunicationType, string> = {
      'Phone Call': 'bg-blue-100 hover:bg-blue-200 text-blue-800',
      'Email': 'bg-green-100 hover:bg-green-200 text-green-800',
      'LinkedIn Message': 'bg-purple-100 hover:bg-purple-200 text-purple-800',
      'LinkedIn Post': 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800',
      'Other': 'bg-gray-100 hover:bg-gray-200 text-gray-800'
    };

    const statusColorMap: Record<CommunicationStatus, string> = {
      'Overdue': 'bg-red-100 hover:bg-red-200 text-red-800',
      'Upcoming': 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800',
      'Completed': typeColorMap[comm.type]
    };

    return statusColorMap[status];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              {communicationMethods.map(method => (
                <option key={method.name} value={method.name}>
                  {method.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Overdue">Overdue</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Companies</option>
              {companies.map(company => (
                <option key={company.id} value={company.name}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="bg-gray-50 p-4 text-center text-sm font-semibold text-gray-700"
          >
            {day}
          </div>
        ))}

        {days.map((day, dayIdx) => {
          const communications = getFilteredCommunications(day);
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={day.toString()}
              className={`min-h-[120px] bg-white ${
                !isCurrentMonth ? 'bg-gray-50' : ''
              } p-2 border-t relative`}
            >
              <div className="text-sm font-medium text-gray-700">
                {format(day, 'd')}
              </div>
              
              <div className="mt-2 space-y-1 max-h-[80px] overflow-y-auto">
                {communications.map((comm) => {
                  const company = companies.find(c => c.id === comm.companyId);
                  if (!company) return null;
                  
                  return (
                    <button
                      key={comm.id}
                      onClick={() => setSelectedEvent(comm)}
                      className={`w-full rounded-md px-2 py-1 text-xs text-left transition-colors ${getCommunicationColor(comm)}`}
                    >
                      <div className="font-medium truncate">
                        {company.name}
                      </div>
                      <div className="truncate opacity-75">
                        {comm.type}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Communication Details</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Company:</div>
                <div>{companies.find(c => c.id === selectedEvent.companyId)?.name}</div>
                <div className="font-medium">Type:</div>
                <div>{selectedEvent.type}</div>
                <div className="font-medium">Status:</div>
                <div>{getCommunicationStatus(selectedEvent)}</div>
                <div className="font-medium">Date:</div>
                <div>{format(selectedEvent.date, 'MMM d, yyyy')}</div>
                {selectedEvent.notes && (
                  <>
                    <div className="font-medium">Notes:</div>
                    <div>{selectedEvent.notes}</div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};