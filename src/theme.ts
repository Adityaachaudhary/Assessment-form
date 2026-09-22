import { Button, createTheme, type MantineColorsTuple } from '@mantine/core';

// Deep pine green: the one accent color, used for interactive elements
// (buttons, focus, checked checkboxes) and nowhere else.
const pine: MantineColorsTuple = [
  '#eaf3ef',
  '#cfe3da',
  '#aacfc0',
  '#84baa4',
  '#5fa689',
  '#3f8e70',
  '#2b7860',
  '#215f4c',
  '#1a4b3c',
  '#12352a',
];

// A muted brick red, standing in for Mantine's default "red" so every
// built-in error state (inputs, the zodResolver messages) picks this up
// automatically, with no per-field color choices in the component.
const brick: MantineColorsTuple = [
  '#f7eae6',
  '#ebc9bf',
  '#dca694',
  '#cc8269',
  '#bc603f',
  '#a5462a',
  '#8c3b2e',
  '#712f25',
  '#59241c',
  '#3e1913',
];

export const theme = createTheme({
  primaryColor: 'pine',
  primaryShade: 6,
  colors: {
    pine,
    red: brick,
  },
  defaultRadius: 'sm',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  headings: {
    fontFamily: '"Iowan Old Style", "Palatino Linotype", "Sitka Text", Georgia, serif',
    fontWeight: '600',
  },
  components: {
    // Flat, solid buttons: no darken-on-hover, no lift, no scale.
    Button: Button.extend({
      vars: () => ({
        root: {
          '--button-hover': 'var(--button-bg)',
          '--button-hover-color': 'var(--button-color)',
        },
      }),
    }),
  },
});
