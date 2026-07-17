import { Rail } from "@/lib/channels";

export const API_URL =
  process.env.NEXT_PUBLIC_INSIGHTS_API_URL ?? "http://localhost:8002";

export async function fetchSummary() {
  const res = await fetch(`${API_URL}/api/insights/summary`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch insights summary: ${res.status}`);
  return res.json();
}

export async function fetchEconomics() {
  const res = await fetch(`${API_URL}/api/insights/economics`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch economics assumptions: ${res.status}`);
  return res.json();
}

export async function fetchForecast(metric: "revenue" | "volume", periods = 12) {
  const res = await fetch(
    `${API_URL}/api/insights/forecast?metric=${metric}&periods=${periods}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Failed to fetch forecast: ${res.status}`);
  return res.json();
}

export async function fetchKpiHistory(hours = 72, rail?: string) {
  const params = new URLSearchParams({ hours: String(hours) });
  if (rail) params.set("rail", rail);
  const res = await fetch(`${API_URL}/api/insights/kpi-history?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch KPI history: ${res.status}`);
  return res.json();
}

export async function runScenario(sourceRail: Rail, targetRail: Rail, shiftPct: number, hoursBack = 24) {
  const res = await fetch(`${API_URL}/api/insights/scenario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source_rail: sourceRail,
      target_rail: targetRail,
      shift_pct: shiftPct,
      hours_back: hoursBack,
    }),
  });
  if (!res.ok) throw new Error(`Failed to run scenario: ${res.status}`);
  return res.json();
}
