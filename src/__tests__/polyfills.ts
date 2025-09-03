// Ensure localStorage/sessionStorage exist before libraries import
const createMemoryStorage = () => {
  const map = new Map<string, string>()
  return {
    getItem: (k: string) => (map.has(k) ? String(map.get(k)) : null),
    setItem: (k: string, v: string) => {
      map.set(k, String(v))
    },
    removeItem: (k: string) => {
      map.delete(k)
    },
    clear: () => {
      map.clear()
    },
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    get length() {
      return map.size
    },
  } as any
}

if (typeof (globalThis as any).localStorage === "undefined") {
  Object.defineProperty(globalThis, "localStorage", {
    value: createMemoryStorage(),
    writable: false,
  })
}
if (typeof (globalThis as any).sessionStorage === "undefined") {
  Object.defineProperty(globalThis, "sessionStorage", {
    value: createMemoryStorage(),
    writable: false,
  })
}
