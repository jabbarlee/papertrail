export interface GenerationRequest {
  companyName: string;
  jobDescription: string;
  question: string;
  tone: 'casual' | 'professional' | 'confident';
  length: 'short' | 'medium' | 'long';
}

export interface ColdMessageRequest {
  companyName: string;
  personName: string;
  personRole: string;
  goal: 'referral' | 'coffee-chat' | 'advice' | 'opportunity';
  tone: 'friendly' | 'professional' | 'enthusiastic';
  context?: string;
}
