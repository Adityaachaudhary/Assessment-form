import { describe, expect, it } from 'vitest';
import { samplePatient } from './fixtures';
import { assessmentSchema } from './schema';

// The sample patient's assessmentDate is '2026-08-07', so a date of birth of
// exactly '1966-08-07' turns the patient 60 on the day of the visit.
describe('assessmentSchema - the 60th birthday boundary', () => {
  it('accepts a patient who turns 60 on the assessment date', () => {
    const result = assessmentSchema.safeParse({
      ...samplePatient,
      dateOfBirth: '1966-08-07',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a patient who is one day short of 60 on the assessment date', () => {
    const result = assessmentSchema.safeParse({
      ...samplePatient,
      dateOfBirth: '1966-08-08',
    });

    expect(result.success).toBe(false);

    const dateOfBirthIssue = !result.success
      ? result.error.issues.find((issue) => issue.path.join('.') === 'dateOfBirth')
      : undefined;
    expect(dateOfBirthIssue?.message).toBe('This pathway is for patients aged 60 and over');
  });
});
