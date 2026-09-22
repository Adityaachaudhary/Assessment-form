# Geriatric Care Assessment

A one-page form a visiting nurse fills in during a home checkup on an elderly
patient. Built with React 19, TypeScript, Mantine 9, and Zod 4, from
Mantine's official Vite template.

## Running it

```bash
yarn install     # first time only
yarn dev          # http://localhost:5173
```

To run the same checks CI/the reviewer will run:

```bash
yarn test         # typecheck + format check + lint + vitest + build
```

This repo vendors its own Yarn 4 binary at `.yarn/releases/yarn-4.18.0.cjs`
(the standard Yarn Berry "zero-install" setup), so a plain `yarn install`
works without corepack needing to fetch anything.

Node 20+ is required (the template's `.nvmrc` targets a newer Node; anything
reasonably current works).

## How it's organized

```
src/
  theme.ts                          - the app's Mantine theme (colors, fonts, radius)
  global.css                        - page background/text tokens
  App.tsx                           - MantineProvider + the form, no routing
  features/assessment/
    schema.ts                       - the Zod schema, copied from the brief as-is
    types.ts                        - AssessmentFormValues: the *input* shape
    fixtures.ts                     - the sample patient fixture
    mobility-options.ts             - MOBILITY -> Select options
    AssessmentForm.tsx              - the form itself
    AssessmentForm.module.css
    schema.test.ts                  - schema boundary test
    AssessmentForm.test.tsx         - rendered form test
```

## Notable decisions

**The input-shape gap.** `Assessment` (the schema's parsed output) can't
represent an empty form: a fresh `NumberInput` starts at `''`, not a number;
a fresh `Select` starts at `''`, not a valid `Mobility`. So the form is typed
against a separate `AssessmentFormValues` (in `types.ts`) that allows those
empty states, and `schemaResolver` is what bridges the two. On submit, once
`schemaResolver` has already approved the values, the handler calls
`assessmentSchema.parse(values)` again to get back the real, typed
`Assessment` - not a cast. This also means `mrn` and `patientName` come back
`.trim()`ed in the saved output even if they weren't in the form.

**`schemaResolver`, not `zodResolver`.** The brief's own wording ("Validation
goes through `schemaResolver`") is the current Mantine 9 API - `zodResolver`
was removed. Zod 4 implements the Standard Schema spec, so
`schemaResolver(assessmentSchema, { sync: true })` works directly with no
extra resolver package.

**Testable save handler.** `AssessmentForm` takes an optional `onSave`
prop. In the app it defaults to the ~800ms fake save described in the brief;
the rendered test passes its own mock so it can assert exactly what was
saved without waiting on (or faking) a timer.

**Sections instead of one long list.** The 10 fields are grouped the way a
paper chart would group them - identification, visit details, medication &
care, follow-up & consent - using `Divider` labels. Same fields, same order,
just organized so a nurse can scan it.

**Light mode only.** `MantineProvider` is forced to `forceColorScheme="light"`
rather than adding a dark-mode toggle. A single, deliberate palette felt
more appropriate for a clinical record than a toggle nobody asked for, and
it kept the theme to one set of colors instead of two.

**Hover.** Per the brief for this build: no gradients, no color-shift or
zoom on hover. The two buttons have their hover-darken neutralized via the
theme (`--button-hover` set equal to `--button-bg`). I left Mantine's
functional hover states alone - the highlighted option as you move through
the Mobility dropdown, and the number-stepper buttons' press feedback -
since those are how the controls communicate what you're about to do, not
decoration.

**Colors.** One accent (a deep pine green) drives every interactive
element - buttons, focus states, the checked checkboxes, the success
alert. Mantine's `red` palette is overridden with a muted brick tone so
`schemaResolver`'s error messages pick it up automatically; no per-field
color choices live in the component.

## Tests

Two, as asked for:

1. `schema.test.ts` - `safeParse` on the date-of-birth boundary: exactly 60
   on the assessment date passes, one day short fails with the age-pathway
   message.
2. `AssessmentForm.test.tsx` - renders the form, clicks "Load sample
   patient," submits, and asserts the `onSave` mock was called once with
   the parsed sample values (and that the success alert shows).

## Scope

Everything in section 4's table is implemented, plus the cross-field rules
in the schema (age pathway, follow-up-after-assessment, polypharmacy
review). Nothing from "out of scope" (auth, routing, a state library, toast
notifications, Storybook stories, custom responsive work beyond what
Mantine gives for free) was added. `react-router-dom` was removed from the
template's dependencies since there's no routing.

## On AI assistance

Built with AI assistance (Claude), per the brief's own note that this is
fine as long as I own every line. I've gone through the code and understand
each choice above - happy to walk through any of it, including why
`schemaResolver` replaced `zodResolver`, or how the input-shape/`Assessment`
split works.

## Time spent

_[Fill in honestly before sending - the brief is explicit that this doesn't
count against you, but it should be your own real number, not a guess.]_
