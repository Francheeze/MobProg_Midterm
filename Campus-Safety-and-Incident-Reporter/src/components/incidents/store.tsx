import React, { useSyncExternalStore } from 'react';
export type Incident = {
  id: string; title: string; category: string; description: string;
  location: string; datetime: string; image: string | null;
};

export const C = { navy: '#0f2d55', yellow: '#f5c332', paper: '#e9e9e9', line: '#c9c9c9', ink: '#1c1c1c', mute: '#6b6b6b', bg: '#f4f5f7' };
export const CATEGORIES = ['Safety', 'Equipment', 'Security', 'Environmental', 'Other'];

const seed: Incident[] = [
  { id: '1', title: 'Broken railing on level 2', category: 'Safety', description: 'Handrail near the east stairwell is loose.', location: 'East stairwell', datetime: '2026-09-28 09:15', image: null },
  { id: '2', title: 'Coolant leak at Press 4', category: 'Equipment', description: 'Small puddle forming under the press.', location: 'Press 4', datetime: '2026-09-29 14:40', image: null },
];

type Store = { items: Incident[]; save: (i: Omit<Incident, 'id'> & { id?: string }) => void };

let items: Incident[] = seed;
const listeners = new Set<() => void>();

const save: Store['save'] = d => {
  items = d.id
    ? items.map(i => (i.id === d.id ? ({ ...i, ...d } as Incident) : i))
    : [{ ...d, id: String(Date.now()) } as Incident, ...items];
  listeners.forEach(l => l());
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => { listeners.delete(l); };
};

export const useIncidents = () => {
  const list = useSyncExternalStore(subscribe, () => items);
  return { items: list, save };
};

export function IncidentsProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}