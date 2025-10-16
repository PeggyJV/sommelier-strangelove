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

export const coerceNetValue = (s?: string | number | null): number => {
  const n = parseMoneyString(s);
  return Number.isFinite(n) ? n : NaN;
};
