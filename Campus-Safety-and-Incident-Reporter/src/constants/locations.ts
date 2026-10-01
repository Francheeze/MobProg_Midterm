//list sa campus location para sa search loc hahahha
export const CAMPUS_LOCATIONS = [
    'put tank in the mall',
] as const;

export type CampusLocation = (typeof CAMPUS_LOCATIONS)[number];