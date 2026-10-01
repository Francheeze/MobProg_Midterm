export const INCIDENT_CATEGORIES = [
  'Theft',
  'Bullying',
  'Injury',
  'Fire',
  'Cheating',
  'Vandalism',
  'Others',
] as const;

export type IncidentCategory = (typeof INCIDENT_CATEGORIES)[number];

export const DESCRIPTION_MIN_LENGTH = 10;
export const DESCRIPTION_MAX_LENGTH = 500;