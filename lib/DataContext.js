"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  DEFAULT_STATS,
  DEFAULT_MEETINGS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_REQUESTS,
} from "./defaultData";

// This context is a front-end-only prototype "database": it seeds
// dummy content and persists any admin edits to the browser's
// localStorage so the demo feels real when clicking around. Once a
// real backend/CMS is wired up, every setX function here just needs
// to be pointed at real API calls instead.

const STORAGE_KEY = "clinic-site-data-v1";

const DataContext = createContext(null);

function loadInitial() {
  if (typeof window === "undefined") {
    return {
      stats: DEFAULT_STATS,
      meetings: DEFAULT_MEETINGS,
      testimonials: DEFAULT_TESTIMONIALS,
      requests: DEFAULT_REQUESTS,
    };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore corrupt storage, fall through to defaults
  }
  return {
    stats: DEFAULT_STATS,
    meetings: DEFAULT_MEETINGS,
    testimonials: DEFAULT_TESTIMONIALS,
    requests: DEFAULT_REQUESTS,
  };
}

export function DataProvider({ children }) {
  const [data, setData] = useState(() => ({
    stats: DEFAULT_STATS,
    meetings: DEFAULT_MEETINGS,
    testimonials: DEFAULT_TESTIMONIALS,
    requests: DEFAULT_REQUESTS,
  }));
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage after mount (avoids SSR/client mismatch)
  useEffect(() => {
    setData(loadInitial());
    setHydrated(true);
  }, []);

  const persist = useCallback((next) => {
    setData(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      // storage full or unavailable — demo still works in-memory
    }
  }, []);

  const updateStats = useCallback((newStats) => {
    persist({ ...data, stats: { ...data.stats, ...newStats } });
  }, [data, persist]);

  const addMeeting = useCallback((meeting) => {
    const withId = { ...meeting, id: `m${Date.now()}` };
    persist({ ...data, meetings: [withId, ...data.meetings] });
  }, [data, persist]);

  const updateMeeting = useCallback((id, updates) => {
    persist({
      ...data,
      meetings: data.meetings.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    });
  }, [data, persist]);

  const deleteMeeting = useCallback((id) => {
    persist({ ...data, meetings: data.meetings.filter((m) => m.id !== id) });
  }, [data, persist]);

  const addTestimonial = useCallback((t) => {
    const withId = { ...t, id: `t${Date.now()}` };
    persist({ ...data, testimonials: [withId, ...data.testimonials] });
  }, [data, persist]);

  const deleteTestimonial = useCallback((id) => {
    persist({ ...data, testimonials: data.testimonials.filter((t) => t.id !== id) });
  }, [data, persist]);

  const addRequest = useCallback((req) => {
    const withId = {
      ...req,
      id: `r${Date.now()}`,
      submitted: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "new",
    };
    persist({ ...data, requests: [withId, ...data.requests] });
    return withId;
  }, [data, persist]);

  const updateRequestStatus = useCallback((id, status, notes) => {
    persist({
      ...data,
      requests: data.requests.map((r) =>
        r.id === id ? { ...r, status, notes: notes !== undefined ? notes : r.notes } : r
      ),
    });
  }, [data, persist]);

  const value = {
    ...data,
    hydrated,
    updateStats,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    addTestimonial,
    deleteTestimonial,
    addRequest,
    updateRequestStatus,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useSiteData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useSiteData must be used within DataProvider");
  return ctx;
}
