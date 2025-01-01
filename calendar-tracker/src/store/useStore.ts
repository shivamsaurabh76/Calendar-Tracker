import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Company, Communication, CommunicationType, CommunicationMethod } from '../types';

interface State {
  companies: Company[];
  communications: Communication[];
  communicationMethods: CommunicationMethod[];
  addCompany: (company: Company) => void;
  updateCompany: (company: Company) => void;
  deleteCompany: (id: string) => void;
  addCommunication: (communication: Communication) => void;
  getCommunicationsForCompany: (companyId: string) => Communication[];
  getNextScheduledCommunication: (companyId: string) => Date | null;
  updateCommunicationMethod: (index: number, method: CommunicationMethod) => void;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      companies: [],
      communications: [],
      communicationMethods: [
        { 
          name: 'LinkedIn Post' as CommunicationType, 
          description: 'Post on company LinkedIn page', 
          sequence: 1, 
          mandatory: true 
        },
        { 
          name: 'LinkedIn Message' as CommunicationType, 
          description: 'Direct message on LinkedIn', 
          sequence: 2, 
          mandatory: true 
        },
        { 
          name: 'Email' as CommunicationType, 
          description: 'Email communication', 
          sequence: 3, 
          mandatory: true 
        },
        { 
          name: 'Phone Call' as CommunicationType, 
          description: 'Phone call communication', 
          sequence: 4, 
          mandatory: false 
        },
        { 
          name: 'Other' as CommunicationType, 
          description: 'Other forms of communication', 
          sequence: 5, 
          mandatory: false 
        }
      ],
      addCompany: (company) => set((state) => ({
        companies: [...state.companies, {
          ...company,
          createdAt: new Date(company.createdAt)
        }]
      })),
      updateCompany: (company) => set((state) => ({
        companies: state.companies.map((c) => 
          c.id === company.id ? {
            ...company,
            createdAt: new Date(company.createdAt)
          } : c
        )
      })),
deleteCompany: (id) => set((state) => ({
  companies: state.companies.filter((c) => c.id !== id),
  // Also remove all communications for the deleted company
  communications: state.communications.filter((c) => c.companyId !== id)
})),
      addCommunication: (communication) => set((state) => ({
        communications: [...state.communications, {
          ...communication,
          date: new Date(communication.date)
        }]
      })),
      updateCommunicationMethod: (index, method) => set((state) => ({
        communicationMethods: state.communicationMethods.map((m, i) => 
          i === index ? method : m
        )
      })),
      getCommunicationsForCompany: (companyId) => {
        const state = get();
        return state.communications
          .filter((c) => c.companyId === companyId)
          .map(c => ({
            ...c,
            date: new Date(c.date)
          }))
          .sort((a, b) => b.date.getTime() - a.date.getTime());
      },
      getNextScheduledCommunication: (companyId) => {
        const state = get();
        const company = state.companies.find((c) => c.id === companyId);
        if (!company) return null;

        const communications = state.communications
          .filter((c) => c.companyId === companyId)
          .map(c => ({
            ...c,
            date: new Date(c.date)
          }))
          .sort((a, b) => b.date.getTime() - a.date.getTime());

        const lastComm = communications[0];
        
        if (!lastComm) {
          return new Date();
        }

        const nextDate = new Date(lastComm.date.getTime() + 
          (company.communicationPeriodicity * 24 * 60 * 60 * 1000));

        return nextDate;
      }
    }),
    {
      name: 'calendar-tracker-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            const parsed = JSON.parse(str);
            // Convert date strings back to Date objects
            if (parsed.state) {
              if (parsed.state.companies) {
                parsed.state.companies = parsed.state.companies.map((company: any) => ({
                  ...company,
                  createdAt: new Date(company.createdAt)
                }));
              }
              if (parsed.state.communications) {
                parsed.state.communications = parsed.state.communications.map((comm: any) => ({
                  ...comm,
                  date: new Date(comm.date)
                }));
              }
            }
            return parsed;
          } catch (error) {
            console.error('Error parsing stored data:', error);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            // Convert Date objects to ISO strings before storing
            const stateToStore = {
              ...value,
              state: {
                ...value.state,
                companies: value.state.companies.map(company => ({
                  ...company,
                  createdAt: company.createdAt.toISOString()
                })),
                communications: value.state.communications.map(comm => ({
                  ...comm,
                  date: comm.date.toISOString()
                }))
              }
            };
            localStorage.setItem(name, JSON.stringify(stateToStore));
          } catch (error) {
            console.error('Error storing data:', error);
          }
        },
        removeItem: (name) => localStorage.removeItem(name)
      },
      version: 1, // Add version for potential future migrations
      partialize: (state) => ({
        companies: state.companies,
        communications: state.communications,
        communicationMethods: state.communicationMethods,
        addCompany: state.addCompany,
        updateCompany: state.updateCompany,
        deleteCompany: state.deleteCompany,
        addCommunication: state.addCommunication,
        getCommunicationsForCompany: state.getCommunicationsForCompany,
        getNextScheduledCommunication: state.getNextScheduledCommunication,
        updateCommunicationMethod: state.updateCommunicationMethod,
      }),
    }
  )
);