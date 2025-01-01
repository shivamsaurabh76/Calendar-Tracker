import { useMemo } from 'react';
import { useStore } from '../store/useStore';

export const useNotifications = () => {
  const companies = useStore((state) => state.companies);
  const getNextScheduledCommunication = useStore((state) => state.getNextScheduledCommunication);

  const overdueCommunications = useMemo(() => {
    const now = new Date();
    return companies.filter(company => {
      try {
        const nextScheduled = getNextScheduledCommunication(company.id);
        return nextScheduled instanceof Date && nextScheduled < now;
      } catch {
        return false;
      }
    });
  }, [companies, getNextScheduledCommunication]);

  const todayCommunications = useMemo(() => {
    const today = new Date().toDateString();
    return companies.filter(company => {
      try {
        const nextScheduled = getNextScheduledCommunication(company.id);
        return nextScheduled instanceof Date && 
               nextScheduled.toDateString() === today;
      } catch {
        return false;
      }
    });
  }, [companies, getNextScheduledCommunication]);

  return {
    overdueCommunications,
    todayCommunications
  };
};