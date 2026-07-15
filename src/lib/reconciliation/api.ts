export const API_URL =
  process.env.NEXT_PUBLIC_RECONCILIATION_API_URL ?? "http://localhost:8001";

export const WS_URL =
  process.env.NEXT_PUBLIC_RECONCILIATION_WS_URL ??
  API_URL.replace(/^http/, "ws") + "/ws/live";

export async function fetchSummary() {
  const res = await fetch(`${API_URL}/api/reconciliation/summary`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch reconciliation summary: ${res.status}`);
  return res.json();
}

export async function fetchRuns(limit = 20) {
  const res = await fetch(`${API_URL}/api/reconciliation/runs?limit=${limit}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch reconciliation runs: ${res.status}`);
  return res.json();
}

export async function fetchBreaks(limit = 50) {
  const res = await fetch(`${API_URL}/api/reconciliation/breaks?limit=${limit}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch reconciliation breaks: ${res.status}`);
  return res.json();
}
