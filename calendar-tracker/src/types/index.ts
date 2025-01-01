export interface Company {
  id: string;
  name: string;
  location: string;
  linkedinProfile: string;
  emails: string[];
  phoneNumbers: string[];
  comments: string;
  communicationPeriodicity: number; 
  createdAt: Date;// in days
}

export interface Communication {
  id: string;
  companyId: string;
  type: CommunicationType;
  date: Date;
  notes: string;
  status: string;
  hasFollowUp: boolean;
}

 export interface CommunicationMethod {
  name: CommunicationType;
  description: string;
  sequence: number;
  mandatory: boolean;
}

export type CommunicationType = 'LinkedIn Post' | 'LinkedIn Message' | 'Email' | 'Phone Call' | 'Other';