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
  
  // Step 3 - Role Selection
  role: string;
  
  // Step 4 - Company Preference
  companyPreference: string;
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