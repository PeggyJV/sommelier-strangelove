export function formatAlphaStethNetApy(
  value: number | string | null | undefined
): string {
  if (value == null) return "≈0.0%"
  const n =
    typeof value === "string"
      ? parseFloat(value.replace(/%/g, ""))
      : Number(value)
  if (Number.isNaN(n)) return "≈0.0%"
  const rounded = Math.round(n * 10) / 10
  return `≈${rounded.toFixed(1)}%`
}


