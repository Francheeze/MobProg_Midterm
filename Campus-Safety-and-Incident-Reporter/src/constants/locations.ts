//list sa campus location para sa search loc hahahha
export const CAMPUS_LOCATIONS = [
    'CEA building',
    'SHS building',
    'CITC building',
    'LRC building',
    'Caffeteria building',
    'Medicine building',
] as const;

export type CampusLocation = (typeof CAMPUS_LOCATIONS)[number];