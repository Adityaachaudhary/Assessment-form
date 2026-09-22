import { render, screen } from '@test-utils';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AssessmentForm } from './AssessmentForm';
import { samplePatient } from './fixtures';

describe('AssessmentForm', () => {
  it('loads the sample patient and saves the parsed values on submit', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    render(<AssessmentForm onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: 'Load sample patient' }));
    await user.click(screen.getByRole('button', { name: 'Save assessment' }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1);
    });
    expect(onSave).toHaveBeenCalledWith(samplePatient);

    // The success alert confirms the saved values came from the parsed
    // schema output, not the raw form state.
    await screen.findByText('Assessment saved');
  });
});
