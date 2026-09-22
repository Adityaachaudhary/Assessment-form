import type { AssessmentFormValues } from './types';

// Fully invented patient used to demo a valid submission. No real record
// numbers, names, or phone numbers appear anywhere in this repo.
export const samplePatient: AssessmentFormValues = {
  mrn: 'MRN-004821',
  patientName: 'Sushila Deshpande',
  dateOfBirth: '1949-03-12',
  assessmentDate: '2026-08-07',
  mobility: 'cane',
  barthelIndex: 80,
  medicationCount: 3,
  pharmacistReviewRequested: false,
  followUpDate: '2026-09-04',
  consentObtained: true,
};
