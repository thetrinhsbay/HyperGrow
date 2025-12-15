
export type Language = 'en' | 'vi';

export enum MenuItemId {
  DASHBOARD = 'dashboard',
  LEAD_FINDER = 'lead_finder', // Menu 2
  CRM = 'crm',                 // Menu 3
  MARKETING = 'marketing',     // Menu 4
  COACHING = 'coaching',       // Menu 5
  PROJECTS = 'projects',       // Menu 6
  AFFILIATES = 'affiliates',   // Menu 7
  CHATBOT = 'chatbot',         // Menu 8
  FINANCE = 'finance',         // Menu 9
  SETTINGS = 'settings',       // Menu 10
  MINDMAP = 'mindmap',
  CONTENT_AI = 'content_ai',
  ANALYTICS = 'analytics',
  MEMBERS = 'members',
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
  avatar: string;
  score: number; // The Core KPI Score
  wallet: number; // Commission/Salary
  pendingTraining: string[]; // Modules assigned by AI
  aiTasksCompleted?: number; // Total AI tasks completed
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  location: string;
  email?: string;
  phone?: string;
  source: 'organic' | 'affiliate' | 'ads';
  affiliateId?: string;
  assignedTo?: string; // User ID
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  score: number; // Lead Potential Score
  notes: string;
  createdAt: number;
}

export interface Interaction {
  id: string;
  leadId: string;
  userId: string;
  type: 'call' | 'email' | 'meeting';
  outcome: 'success' | 'failure' | 'neutral';
  notes: string;
  timestamp: number;
  aiSentiment: number; // 0-100
}

export interface SystemLog {
  id: string;
  timestamp: number;
  module: MenuItemId;
  action: string;
  details: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isThinking?: boolean;
}