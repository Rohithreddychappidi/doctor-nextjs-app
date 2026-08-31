"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  DEFAULT_STATS,
  DEFAULT_MEETINGS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_REQUESTS,
  DEFAULT_CONTENT,
} from "./defaultData";

// This context is a front-end-only prototype "database": it seeds
// dummy content and persists any admin edits to the browser's
// localStorage so the demo feels real when clicking around. Once a
// real backend/CMS is wired up, every setX function here just needs
// to be pointed at real API calls instead.
//
// `content` is the free-text editing layer (see DEFAULT_CONTENT in
// defaultData.js) — hero copy, card text, section headings across
// every page. `stats`, `meetings`, `testimonials`, `requests` are the
// structured/repeatable data that already had dedicated admin screens.

const STORAGE_KEY = "clinic-site-data-v2";

const DataContext = createContext(null);

function defaults() {
  return {
    stats: DEFAULT_STATS,
    meetings: DEFAULT_MEETINGS,
    testimonials: DEFAULT_TESTIMONIALS,
    requests: DEFAULT_REQUESTS,
    content: DEFAULT_CONTENT,
  };
}

function loadInitial() {
  if (typeof window === "undefined") return defaults();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults so newly-added content fields (from app
      // updates) always exist even if a browser has an older saved copy.
      return {
        ...defaults(),
        ...parsed,
        content: { ...DEFAULT_CONTENT, ...(parsed.content || {}) },
      };
    }
  } catch (e) {
    // ignore corrupt storage, fall through to defaults
  }
  return defaults();
}

export function DataProvider({ children }) {
  const [data, setData] = useState(defaults);
  const [hydrated, setHydrated] = useState(false);

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

  // Deep-merge a partial content update into one page's section, e.g.
  // updateContent("home", { offersHeading: "..." })
  const updateContent = useCallback((pageKey, updates) => {
    persist({
      ...data,
      content: {
        ...data.content,
        [pageKey]: { ...data.content[pageKey], ...updates },
      },
    });
  }, [data, persist]);

  // Replace an array field within a page's content (e.g. home.cards,
  // home.bannerSlides) at a given index.
  const updateContentArrayItem = useCallback((pageKey, arrayKey, index, updates) => {
    const page = data.content[pageKey] || {};
    const arr = [...(page[arrayKey] || [])];
    arr[index] = { ...arr[index], ...updates };
    persist({
      ...data,
      content: { ...data.content, [pageKey]: { ...page, [arrayKey]: arr } },
    });
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

  const resetAllContent = useCallback(() => {
    persist(defaults());
  }, [persist]);

  const value = {
    ...data,
    hydrated,
    updateStats,
    updateContent,
    updateContentArrayItem,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    addTestimonial,
    deleteTestimonial,
    addRequest,
    updateRequestStatus,
    resetAllContent,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useSiteData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useSiteData must be used within DataProvider");
  return ctx;
}
