export interface User {
  id: string;
  username: string;
  sessionToken?: string;
}

export interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: string;
  userId: string;
}

export interface LoginRequest {
  username: string;
}

export interface LoginResponse {
  success: boolean;
  sessionToken: string;
  user: User;
  message?: string;
}

export interface SendMessageRequest {
  content: string;
  sessionToken?: string;
  username?: string;
}

export interface SendMessageResponse {
  success: boolean;
  message?: Message;
  error?: string;
}

export interface MessagesResponse {
  success: boolean;
  messages: Message[];
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
export interface ThreatFormData {
  threatDetails: string;
  threatDate: string;
  threatType: string;
  incidentLocation: string;
  moreInformation: string;
  delayReason: string;
  locationUrl: string;
  evidence: File | null;
  firstStep: string;
}

export interface ThreatType {
  id: string;
  name: string;
  description: string;
  example: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  icon: string;
}

export interface FormStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface UserProgress {
  level: number;
  xp: number;
  badges: string[];
  reportsSubmitted: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface SubmissionResult {
  success: boolean;
  reportId?: string;
  message: string;
  nextSteps?: string[];
}