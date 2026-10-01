import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  IncidentCategory,
} from '../constants/incidents';

export type IncidentDetailsErrors = {
  category?: string;
  description?: string;
};

export function validateIncidentDetails(
  category: IncidentCategory | null,
  description: string
): IncidentDetailsErrors {
  const errors: IncidentDetailsErrors = {};

  if (!category) {
    errors.category = 'Please select a category.';
  }

  const trimmed = description.trim();
  if (trimmed.length < DESCRIPTION_MIN_LENGTH) {
    errors.description = `Description must be at least ${DESCRIPTION_MIN_LENGTH} characters.`;
  } else if (trimmed.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters.`;
  }

  return errors;
}