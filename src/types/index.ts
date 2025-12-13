export interface GenerationRequest {
  companyName: string;
  jobDescription: string;
  question: string;
  tone: 'casual' | 'professional' | 'confident';
  length: 'short' | 'medium' | 'long';
}
