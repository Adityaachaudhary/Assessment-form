import type { MOBILITY } from './schema';

export type Mobility = (typeof MOBILITY)[number];

/**
 * What the form actually holds while the nurse is filling it in.
 *
 * This is deliberately looser than `Assessment` (the schema's parsed output):
 * a fresh Mantine `NumberInput` starts as `''`, not a number, and a fresh
 * `Select` starts as `''`, not a valid `Mobility`. `Assessment` can't
 * represent those empty states, so the form is typed against this shape and
 * `schemaResolver` is what turns a filled-in `AssessmentFormValues` into a
 * validated `Assessment` on submit.
 */
export interface AssessmentFormValues {
  mrn: string;
  patientName: string;
  dateOfBirth: string | null;
  assessmentDate: string | null;
  mobility: Mobility | '';
  barthelIndex: number | '';
  medicationCount: number | '';
  pharmacistReviewRequested: boolean;
  followUpDate: string | null;
  consentObtained: boolean;
}

export const emptyAssessmentFormValues: AssessmentFormValues = {
  mrn: '',
  patientName: '',
  dateOfBirth: null,
  assessmentDate: null,
  mobility: '',
  barthelIndex: '',
  medicationCount: '',
  pharmacistReviewRequested: false,
  followUpDate: null,
  consentObtained: false,
};
