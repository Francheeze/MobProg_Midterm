import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useSyncExternalStore } from 'react';
import { INCIDENT_CATEGORIES } from '../../constants/incidents';

export type Incident = {
  id: string; title: string; category: string; description: string;
  location: string; datetime: string; image: string[];
  author?: string; // username of the account that created the report
};

export const C = { navy: '#0f2d55', yellow: '#f5c332', paper: '#e9e9e9', line: '#c9c9c9', ink: '#1c1c1c', mute: '#6b6b6b', bg: '#f4f5f7' };
export const CATEGORIES = INCIDENT_CATEGORIES;

type Store = { items: Incident[]; save: (i: Omit<Incident, 'id'> & { id?: string }) => void };

const REPORTS_KEY = 'reports';

let items: Incident[] = [];
let currentUser: string | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(l => l());

// Load saved reports from the phone when the app starts
AsyncStorage.getItem(REPORTS_KEY)
  .then(json => {
    if (json) {
      items = JSON.parse(json);
      notify();
    }
  })
  .catch(() => {});

const save: Store['save'] = d => {
  items = d.id
    ? items.map(i => (i.id === d.id ? ({ ...i, ...d } as Incident) : i))
    : [{ ...d, id: String(Date.now()), author: currentUser ?? 'unknown' } as Incident, ...items];
  AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(items)); // persist
  notify();
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => { listeners.delete(l); };
};

export const useIncidents = () => {
  const list = useSyncExternalStore(subscribe, () => items);
  return { items: list, save };
};

// Who is logged in right now
export const setCurrentUser = (u: string | null) => {
  currentUser = u;
  notify();
};
export const useCurrentUser = () =>
  useSyncExternalStore(subscribe, () => currentUser);

export function IncidentsProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}