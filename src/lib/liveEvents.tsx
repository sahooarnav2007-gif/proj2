'use client';

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

export type LiveEventTone = 'success' | 'info' | 'warning' | 'system';

export interface LiveEvent {
  id: number;
  title: string;
  message?: string;
  tone: LiveEventTone;
}

interface LiveEventsContextValue {
  events: LiveEvent[];
  publish: (event: Omit<LiveEvent, 'id'> & { tone?: LiveEventTone }) => void;
  clear: () => void;
}

const LiveEventsContext = createContext<LiveEventsContextValue>({
  events: [],
  publish: () => {},
  clear: () => {},
});

export const useLiveEvents = () => useContext(LiveEventsContext);

const MAX_VISIBLE = 4;
const AUTO_DISMISS_MS = 5200;

export const LiveEventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const idRef = useRef(0);

  const publish = useCallback((ev: Omit<LiveEvent, 'id'> & { tone?: LiveEventTone }) => {
    const id = ++idRef.current;
    const event: LiveEvent = { ...ev, tone: ev.tone ?? 'info', id };
    setEvents(prev => [...prev, event].slice(-MAX_VISIBLE));
    setTimeout(() => {
      setEvents(prev => prev.filter(e => e.id !== id));
    }, AUTO_DISMISS_MS);
  }, []);

  const clear = useCallback(() => setEvents([]), []);

  return (
    <LiveEventsContext.Provider value={{ events, publish, clear }}>
      {children}
    </LiveEventsContext.Provider>
  );
};