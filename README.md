# Geriatric Care Assessment Form

## What this is

A take-home assignment: build a single-page form that a visiting nurse fills in
during a home checkup on an elderly patient. The form collects 10 fields,
validates them (including three cross-field rules), and on a successful submit
shows the parsed, saved record back to the nurse.

Stack specified by the brief: React 19, TypeScript, Mantine 9, Zod 4, Vite.

---

## Running it

Node 20+ required. The repo vendors Yarn 4 at `.yarn/releases/yarn-4.18.0.cjs`
so no corepack setup is needed.

```bash
yarn install   # first time only
yarn dev       # http://localhost:5173
```

To run the full check suite (the same thing CI runs):

```bash
yarn test      # typecheck + format check + lint + vitest + build
```

Individual steps if you want them separately:

```bash
yarn typecheck
yarn vitest
yarn lint
yarn format:test
yarn build
```

---

## What the form does

Ten fields grouped into four sections:

| Field | Type | Rules |
|---|---|---|
| Medical record number | Text | Must match `MRN-XXXXXX` |
| Patient name | Text | 2–60 characters |
| Date of birth | Date | Patient must be ≥ 60 on the assessment date |
| Assessment date | Date | Cannot be in the future |
| Mobility | Select | One of: independent, cane, walker, wheelchair, bedbound |
| Barthel Index | Number | 0–100, whole numbers, steps of 5 |
| Regular medications | Number | 0–30, whole numbers |
| Pharmacist review requested | Checkbox | Required when medication count ≥ 5 (polypharmacy rule) |
| Next review date | Date | Must be after the assessment date |
| Consent obtained | Checkbox | Must be checked to save |

Validation runs on blur and again on submit via Mantine's `schemaResolver`
wired to the Zod schema. The "Load sample patient" button fills all fields with
a valid fixture so you can see a successful submit without typing everything in.

---

## How it's organised

```
src/
  App.tsx                               MantineProvider + the form, no routing
  theme.ts                              Mantine theme: colors, fonts, radius
  global.css                            Page background / text tokens
  features/assessment/
    schema.ts                           Zod schema (all 10 fields + 3 cross-field refines)
    types.ts                            AssessmentFormValues: the looser input shape
    fixtures.ts                         Sample patient fixture
    mobility-options.ts                 MOBILITY -> Mantine Select data
    AssessmentForm.tsx                  The form component
    AssessmentForm.module.css           Scoped styles
    schema.test.ts                      Schema boundary test (age rule)
    AssessmentForm.test.tsx             Rendered form test (load + submit)
test-utils/
  render.tsx                            Custom render wrapper (MantineProvider)
```

---

## Key decisions

**Input shape vs. parsed output.** `Assessment` (what the schema returns) can't
represent an empty form: a fresh `NumberInput` is `''`, not a number; a fresh
`Select` is `''`, not a valid `Mobility`. So the form is typed against
`AssessmentFormValues` (which allows those empty states) and `schemaResolver`
bridges the two. On submit, once `schemaResolver` has already approved the
values, the handler calls `assessmentSchema.parse(values)` again to get back
the real typed `Assessment` — not a cast.

**`schemaResolver`, not `zodResolver`.** `zodResolver` was removed in Mantine 9.
Zod 4 implements the Standard Schema spec, so
`schemaResolver(assessmentSchema, { sync: true })` works directly with no extra
adapter package.

**Testable save handler.** `AssessmentForm` accepts an optional `onSave` prop.
In the app it defaults to an ~800 ms fake save; the test passes its own `vi.fn()`
so it can assert exactly what was saved without waiting on a timer.

**Light mode only.** `forceColorScheme="light"` on `MantineProvider`. A single
deliberate palette felt more appropriate for a clinical record than a toggle
nobody asked for.

**No hover decoration.** The brief asked for no gradients, no color-shift or
zoom on hover. The two buttons have `--button-hover` set equal to `--button-bg`
in the theme. Mantine's functional hover states (dropdown highlight, stepper
press feedback) are left alone — those communicate intent, not decoration.

**One accent color.** A deep pine green drives every interactive element:
buttons, focus rings, checked checkboxes, the success alert. Mantine's `red`
palette is overridden with a muted brick tone so validation error messages pick
it up automatically.

---

## Tests

Two tests, as specified:

1. **`schema.test.ts`** — `safeParse` on the age boundary: a patient who turns
   exactly 60 on the assessment date passes; one day short fails with the
   correct error message on `dateOfBirth`.

2. **`AssessmentForm.test.tsx`** — renders the form, clicks "Load sample
   patient", clicks "Save assessment", asserts `onSave` was called once with
   the parsed sample values, and that the success alert appears.

---

## What's unfinished and why

**Storybook stories.** The template ships with Storybook and the `storybook`
scripts are still in `package.json`. No stories were written — the brief listed
Storybook as explicitly out of scope, so the dependency is there from the
template but unused.

**`package-lock.json` excluded.** The project uses Yarn 4 (vendored). npm also
generated a `package-lock.json` at some point; it's excluded via `.gitignore`
since it conflicts with the Yarn lockfile and shouldn't be committed.

**No dark mode.** Deliberately omitted — see "Light mode only" above.

**No routing, no auth, no state library, no toast notifications.** All listed
as out of scope in the brief. None were added.

---

## On AI assistance

Built with AI assistance (Amazon Q / Claude), per the brief's note that this is
fine as long as I own every line. I've read through all of it and understand
each decision above — happy to walk through any of it, including why
`schemaResolver` replaced `zodResolver` or how the input-shape / `Assessment`
split works.

---

## Time spent

Approximately 3–4 hours total:
- ~30 min reading the brief and setting up the Vite + Mantine template
- ~1.5 hrs on the schema, form fields, and cross-field validation wiring
- ~45 min on the theme (colors, hover neutralisation, CSS tokens)
- ~30 min on the two tests and the test-utils render wrapper
- ~30 min on cleanup, README, and pushing to GitHub
