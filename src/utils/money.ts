export const parseMoneyString = (s?: string | number | null): number => {
  if (s === null || s === undefined) return NaN;
  if (typeof s === "number") return s;
  const raw = String(s).trim();
  if (!raw || raw === "-" || raw === "–") return NaN;
  const mult = raw.endsWith("K") ? 1e3 : raw.endsWith("M") ? 1e6 : raw.endsWith("B") ? 1e9 : 1;
  const num = raw
    .replace(/[,$]/g, "")
    .replace(/^\$/, "")
    .replace(/[KMB]$/, "");
  const val = Number(num);
  return Number.isFinite(val) ? val * mult : NaN;
};

// Net value reaches us in two shapes: a string/number (e.g. "$0.04" or 0.04)
// or the `{ value, formatted }` object produced by getUserData /
// useUserStrategyData. Accept both so callers don't have to unwrap it
// (otherwise an object collapses to NaN and e.g. the withdraw button is
// wrongly disabled for users who hold a balance).
type NetValueLike =
  | string
  | number
  | null
  | undefined
  | { value?: string | number | null; formatted?: string | null };

export const coerceNetValue = (s?: NetValueLike): number => {
  if (s !== null && typeof s === "object") {
    if (typeof s.value === "number" && Number.isFinite(s.value)) return s.value;
    const n = parseMoneyString(s.value ?? s.formatted ?? null);
    return Number.isFinite(n) ? n : NaN;
  }
  const n = parseMoneyString(s);
  return Number.isFinite(n) ? n : NaN;
};
