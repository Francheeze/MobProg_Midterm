import React, { createContext, useContext, useState } from 'react';

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
const Ctx = createContext<Store>({ items: [], save: () => {} });
export const useIncidents = () => useContext(Ctx);

export function IncidentsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Incident[]>(seed);
  const save: Store['save'] = d =>
    setItems(prev => d.id
      ? prev.map(i => (i.id === d.id ? (d as Incident) : i))
      : [{ ...d, id: String(Date.now()) }, ...prev]);
  return <Ctx.Provider value={{ items, save }}>{children}</Ctx.Provider>;
}
