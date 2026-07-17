export function fmtMs(v: number | null | undefined): string {
  if (v === null || v === undefined) return "—";
  return v >= 1000 ? `${(v / 1000).toFixed(2)}s` : `${v.toFixed(0)}ms`;
}

export function fmtPct(v: number | null | undefined, decimals = 1): string {
  if (v === null || v === undefined) return "—";
  return `${(v * 100).toFixed(decimals)}%`;
}

// 1 decimal place rounds 99.999% up to a meaningless "100.0%" — exactly the
// precision that matters for a "five nines" figure. Use wherever an
// availability value or target is shown.
export function fmtPctPrecise(v: number | null | undefined): string {
  return fmtPct(v, 3);
}

export function fmtMoney(v: number): string {
  return v.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function fmtCompactMoney(v: number): string {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return fmtMoney(v);
}

// A budget-burn percentage can exceed 100% (it's "how much of the allowed
// failure rate has been used"), which reads as nonsensical to anyone who
// hasn't internalized that framing — "503%" doesn't parse the way "5x over"
// does. Under 100%, "% used" is intuitive on its own (like a data plan).
export function fmtBudgetBurn(pct: number): string {
  if (pct >= 100) return `${(pct / 100).toFixed(1)}x over budget`;
  return `${pct.toFixed(0)}% of budget used`;
}

export function fmtVolumeShare(part: number, total: number): string | null {
  if (total <= 0) return null;
  return `${((part / total) * 100).toFixed(0)}% of all volume`;
}
