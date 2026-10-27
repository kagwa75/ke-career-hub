const SAVED_JOBS_KEY = "ghke:saved-jobs:v1";
const RECENT_JOBS_KEY = "ghke:recent-jobs:v1";
const CHANGE_EVENT = "ghke:job-preferences-change";

function readIds(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeIds(key: string, ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify([...new Set(ids)]));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Storage can be disabled or full; the interface will continue to work for this session.
  }
}

export function getSavedJobIds() {
  return readIds(SAVED_JOBS_KEY);
}

export function setSavedJobIds(ids: string[]) {
  writeIds(SAVED_JOBS_KEY, ids);
}

export function toggleSavedJob(id: string) {
  const ids = getSavedJobIds();
  const isSaved = ids.includes(id);
  setSavedJobIds(isSaved ? ids.filter((item) => item !== id) : [id, ...ids]);
  return !isSaved;
}

export function getRecentlyViewedJobIds() {
  return readIds(RECENT_JOBS_KEY);
}

export function addRecentlyViewedJob(id: string) {
  writeIds(RECENT_JOBS_KEY, [id, ...getRecentlyViewedJobIds().filter((item) => item !== id)].slice(0, 12));
}

export function subscribeToJobPreferences(listener: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
