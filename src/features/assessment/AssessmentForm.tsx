import { useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Code,
  Container,
  Divider,
  Group,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { schemaResolver, useForm } from '@mantine/form';
import { samplePatient } from './fixtures';
import { mobilityOptions } from './mobility-options';
import { assessmentSchema, type Assessment } from './schema';
import { emptyAssessmentFormValues, type AssessmentFormValues } from './types';
import classes from './AssessmentForm.module.css';

// The real save call. Swapped out in tests via the onSave prop so tests
// don't have to wait on (or fake) this delay.
async function defaultSave(_assessment: Assessment): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800));
}

interface AssessmentFormProps {
  onSave?: (assessment: Assessment) => Promise<void> | void;
}

export function AssessmentForm({ onSave = defaultSave }: AssessmentFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [savedAssessment, setSavedAssessment] = useState<Assessment | null>(null);

  const form = useForm<AssessmentFormValues>({
    mode: 'controlled',
    initialValues: emptyAssessmentFormValues,
    validate: schemaResolver(assessmentSchema, { sync: true }),
    validateInputOnBlur: true,
  });

  const handleLoadSample = () => {
    form.setValues(samplePatient);
    form.clearErrors();
    setSavedAssessment(null);
  };

  const handleSubmit = async (values: AssessmentFormValues) => {
    // schemaResolver has already approved these values by the time onSubmit
    // fires, so this parse hands back the typed, trimmed `Assessment` the
    // schema produces - not a cast of Mantine's raw form state.
    const parsed = assessmentSchema.parse(values);

    setSubmitting(true);
    setSavedAssessment(null);
    await onSave(parsed);
    setSubmitting(false);
    setSavedAssessment(parsed);
  };

  return (
    <Container size="sm" py="xl">
      <Paper withBorder p="xl" className={classes.paper}>
        <div className={classes.header}>
          <div>
            <Title order={2} className={classes.title}>
              Geriatric Care Assessment
            </Title>
            <Text c="dimmed" size="sm">
              Home visit record
            </Text>
          </div>
          <Button type="button" variant="default" onClick={handleLoadSample}>
            Load sample patient
          </Button>
        </div>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="xl" mt="xl">
            <Stack gap="md">
              <Divider label="Patient identification" labelPosition="left" />
              <TextInput
                label="Medical record number"
                placeholder="MRN-004821"
                {...form.getInputProps('mrn')}
              />
              <TextInput label="Patient name" {...form.getInputProps('patientName')} />
              <DateInput
                label="Date of birth"
                valueFormat="DD MMM YYYY"
                {...form.getInputProps('dateOfBirth')}
              />
            </Stack>

            <Stack gap="md">
              <Divider label="Visit details" labelPosition="left" />
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <DateInput
                  label="Assessment date"
                  valueFormat="DD MMM YYYY"
                  maxDate={new Date()}
                  {...form.getInputProps('assessmentDate')}
                />
                <Select
                  label="Mobility"
                  data={mobilityOptions}
                  {...form.getInputProps('mobility')}
                />
              </SimpleGrid>
              <NumberInput
                label="Barthel Index"
                description="0 to 100, in steps of 5. Higher means more independent."
                step={5}
                {...form.getInputProps('barthelIndex')}
              />
            </Stack>

            <Stack gap="md">
              <Divider label="Medication & care" labelPosition="left" />
              <NumberInput label="Regular medications" {...form.getInputProps('medicationCount')} />
              <Checkbox
                label="Pharmacist review requested"
                {...form.getInputProps('pharmacistReviewRequested', { type: 'checkbox' })}
              />
            </Stack>

            <Stack gap="md">
              <Divider label="Follow-up & consent" labelPosition="left" />
              <DateInput
                label="Next review date"
                valueFormat="DD MMM YYYY"
                {...form.getInputProps('followUpDate')}
              />
              <Checkbox
                label="Patient or representative has given consent"
                {...form.getInputProps('consentObtained', { type: 'checkbox' })}
              />
            </Stack>

            <Group justify="flex-end">
              <Button type="submit" loading={submitting} disabled={submitting}>
                Save assessment
              </Button>
            </Group>

            {savedAssessment && (
              <Alert color="pine" variant="light" title="Assessment saved">
                <Text size="sm" mb="xs">
                  The visit record was saved with these values:
                </Text>
                <Code block>{JSON.stringify(savedAssessment, null, 2)}</Code>
              </Alert>
            )}
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
