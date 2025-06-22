import { OnboardingData, ValidationErrors } from '../types/onboarding';

export const validateProfileStep = (data: Partial<OnboardingData>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  }

  if (!data.age) {
    errors.age = 'Age is required';
  }

  if (!data.gender) {
    errors.gender = 'Gender is required';
  }

  if (!data.githubUrl?.trim()) {
    errors.githubUrl = 'GitHub URL is required';
  } else {
    const githubRegex = /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9-_]+\/?$/;
    if (!githubRegex.test(data.githubUrl)) {
      errors.githubUrl = 'Please enter a valid GitHub URL';
    }
  }

  if (data.linkedinUrl?.trim()) {
    const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_]+\/?$/;
    if (!linkedinRegex.test(data.linkedinUrl)) {
      errors.linkedinUrl = 'Please enter a valid LinkedIn URL';
    }
  }

  return errors;
};

export const validateAcademicsStep = (data: Partial<OnboardingData>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.university?.trim()) {
    errors.university = 'University/College is required';
  }

  if (!data.degree?.trim()) {
    errors.degree = 'Degree is required';
  }

  if (!data.branch) {
    errors.branch = 'Branch is required';
  }

  if (!data.graduationYear) {
    errors.graduationYear = 'Graduation year is required';
  }

  return errors;
};

export const validateSkillsStep = (data: Partial<OnboardingData>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.selectedSkills || data.selectedSkills.length === 0) {
    errors.selectedSkills = 'Please select at least one skill';
  } else if (data.selectedSkills.length < 3) {
    errors.selectedSkills = 'Please select at least 3 skills to better tailor your experience';
  }

  return errors;
};

export const validateRoleStep = (data: Partial<OnboardingData>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.role) {
    errors.role = 'Please select a role';
  }

  return errors;
};

export const validateCompanyStep = (data: Partial<OnboardingData>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.companyPreference) {
    errors.companyPreference = 'Please select a company preference';
  }

  return errors;
};

export const validateMissionStep = (data: Partial<OnboardingData>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.primaryGoal) {
    errors.primaryGoal = 'Please select your primary goal';
  }

  if (!data.termsAgreed) {
    errors.termsAgreed = 'You must agree to the terms to continue';
  }

  return errors;
};