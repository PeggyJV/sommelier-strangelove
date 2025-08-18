const LEGACY_VISIBILITY_KEY = "legacyVisibility"

export function restoreLegacyVisibility(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  try {
    return localStorage.getItem(LEGACY_VISIBILITY_KEY) === "1"
  } catch {
    return false
  }
}

export function saveLegacyVisibility(v: boolean): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.setItem(LEGACY_VISIBILITY_KEY, v ? "1" : "0")
  } catch {
    // Silently fail if localStorage is not available
  }
}

// Legacy functions for backward compatibility
export const getLegacyVisibility = (): boolean => {
  return restoreLegacyVisibility()
}

export const setLegacyVisibility = (visible: boolean): void => {
  saveLegacyVisibility(visible)
}
