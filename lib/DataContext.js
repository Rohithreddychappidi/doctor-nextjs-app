"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  DEFAULT_STATS,
  DEFAULT_MEETINGS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_REQUESTS,
  DEFAULT_CONTENT,
} from "./defaultData";

// Front-end-only prototype "database": seeds dummy content and persists
// admin edits to localStorage. Swap these functions for real API calls
// once a backend exists — the shape (page -> field, page -> array of
// items) is designed to map directly onto REST/GraphQL resources later.

const STORAGE_KEY = "clinic-site-data-v4";

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

// Deep-merge saved content over defaults so newly added fields/pages
// (from app updates) always exist even if a browser has an older copy.
function mergeContent(saved) {
  const merged = { ...DEFAULT_CONTENT };
  for (const pageKey of Object.keys(DEFAULT_CONTENT)) {
    merged[pageKey] = { ...DEFAULT_CONTENT[pageKey], ...(saved?.[pageKey] || {}) };
  }
  return merged;
}

function loadInitial() {
  if (typeof window === "undefined") return defaults();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaults(), ...parsed, content: mergeContent(parsed.content) };
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

  // ---- Flat-field content editing (hero eyebrow/heading/body, etc.) ----
  const updateContent = useCallback((pageKey, updates) => {
    persist({
      ...data,
      content: { ...data.content, [pageKey]: { ...data.content[pageKey], ...updates } },
    });
  }, [data, persist]);

  // ---- Generic array-of-objects content editing ----
  // Used for banner slides, service cards, accordion sections/items,
  // curriculum schedule/assessment rows, question bank topics, etc.
  // Every array lives at content[pageKey][arrayKey].
  const updateContentArrayItem = useCallback((pageKey, arrayKey, index, updates) => {
    const page = data.content[pageKey] || {};
    const arr = [...(page[arrayKey] || [])];
    arr[index] = typeof updates === "object" && !Array.isArray(updates) ? { ...arr[index], ...updates } : updates;
    persist({ ...data, content: { ...data.content, [pageKey]: { ...page, [arrayKey]: arr } } });
  }, [data, persist]);

  const addContentArrayItem = useCallback((pageKey, arrayKey, item) => {
    const page = data.content[pageKey] || {};
    const arr = [...(page[arrayKey] || []), item];
    persist({ ...data, content: { ...data.content, [pageKey]: { ...page, [arrayKey]: arr } } });
  }, [data, persist]);

  const deleteContentArrayItem = useCallback((pageKey, arrayKey, index) => {
    const page = data.content[pageKey] || {};
    const arr = (page[arrayKey] || []).filter((_, i) => i !== index);
    persist({ ...data, content: { ...data.content, [pageKey]: { ...page, [arrayKey]: arr } } });
  }, [data, persist]);

  // ---- Nested array editing (About page: sections -> items) ----
  const updateNestedArrayItem = useCallback((pageKey, arrayKey, groupIndex, itemArrayKey, itemIndex, updates) => {
    const page = data.content[pageKey] || {};
    const groups = [...(page[arrayKey] || [])];
    const items = [...(groups[groupIndex][itemArrayKey] || [])];
    items[itemIndex] = { ...items[itemIndex], ...updates };
    groups[groupIndex] = { ...groups[groupIndex], [itemArrayKey]: items };
    persist({ ...data, content: { ...data.content, [pageKey]: { ...page, [arrayKey]: groups } } });
  }, [data, persist]);

  // Update a group's own fields (e.g. label, driveLink) — not its items list.
  const updateNestedGroupMeta = useCallback((pageKey, arrayKey, groupIndex, updates) => {
    const page = data.content[pageKey] || {};
    const groups = [...(page[arrayKey] || [])];
    groups[groupIndex] = { ...groups[groupIndex], ...updates };
    persist({ ...data, content: { ...data.content, [pageKey]: { ...page, [arrayKey]: groups } } });
  }, [data, persist]);

  const addNestedArrayItem = useCallback((pageKey, arrayKey, groupIndex, itemArrayKey, item) => {
    const page = data.content[pageKey] || {};
    const groups = [...(page[arrayKey] || [])];
    const items = [...(groups[groupIndex][itemArrayKey] || []), item];
    groups[groupIndex] = { ...groups[groupIndex], [itemArrayKey]: items };
    persist({ ...data, content: { ...data.content, [pageKey]: { ...page, [arrayKey]: groups } } });
  }, [data, persist]);

  const deleteNestedArrayItem = useCallback((pageKey, arrayKey, groupIndex, itemArrayKey, itemIndex) => {
    const page = data.content[pageKey] || {};
    const groups = [...(page[arrayKey] || [])];
    const items = (groups[groupIndex][itemArrayKey] || []).filter((_, i) => i !== itemIndex);
    groups[groupIndex] = { ...groups[groupIndex], [itemArrayKey]: items };
    persist({ ...data, content: { ...data.content, [pageKey]: { ...page, [arrayKey]: groups } } });
  }, [data, persist]);

  // ---- Meetings / Testimonials / Requests (existing dedicated screens) ----
  const addMeeting = useCallback((meeting) => {
    persist({ ...data, meetings: [{ ...meeting, id: `m${Date.now()}` }, ...data.meetings] });
  }, [data, persist]);

  const updateMeeting = useCallback((id, updates) => {
    persist({ ...data, meetings: data.meetings.map((m) => (m.id === id ? { ...m, ...updates } : m)) });
  }, [data, persist]);

  const deleteMeeting = useCallback((id) => {
    persist({ ...data, meetings: data.meetings.filter((m) => m.id !== id) });
  }, [data, persist]);

  const addTestimonial = useCallback((t) => {
    persist({ ...data, testimonials: [{ ...t, id: `t${Date.now()}` }, ...data.testimonials] });
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
      requests: data.requests.map((r) => (r.id === id ? { ...r, status, notes: notes !== undefined ? notes : r.notes } : r)),
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
    addContentArrayItem,
    deleteContentArrayItem,
    updateNestedArrayItem,
    updateNestedGroupMeta,
    addNestedArrayItem,
    deleteNestedArrayItem,
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
