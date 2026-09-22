import { MOBILITY } from './schema';

// Turns a raw value like 'wheelchair' or 'home_visit' into a readable label
// like 'Wheelchair' or 'Home Visit'. Adding a new entry to MOBILITY is
// enough for it to show up correctly here with no other edit.
function toLabel(value: string): string {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const mobilityOptions = MOBILITY.map((value) => ({
  value,
  label: toLabel(value),
}));
