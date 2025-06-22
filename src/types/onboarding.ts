export interface OnboardingData {
  // Step 1 - Profile
  fullName: string;
  age: string;
  gender: string;
  githubUrl: string;
  linkedinUrl: string;
  
  // Step 2 - Academics
  university: string;
  degree: string;
  branch: string;
  graduationYear: string;
  
  // Step 3 - Skill Assessment
  selectedSkills: string[];
  
  // Step 4 - Role Selection
  role: string;
  
  // Step 5 - Company Preference
  companyPreference: string;
  
  // Step 6 - Mission Statement
  primaryGoal: string;
  termsAgreed: boolean;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  component: React.ComponentType<any>;
}