"use client";

import { useEffect, useState } from "react";
import { fetchMetricsSummary } from "@/lib/observability/api";
import { fetchCases } from "@/lib/incidents/api";

const POLL_INTERVAL_MS = 8000;

interface OverviewStatus {
  observabilityUp: boolean | null;
  channelsHealthy: number | null;
  channelsTotal: number | null;
  incidentsUp: boolean | null;
  activeCases: number | null;
}

export function useOverviewStatus() {
  const [status, setStatus] = useState<OverviewStatus>({
    observabilityUp: null,
    channelsHealthy: null,
    channelsTotal: null,
    incidentsUp: null,
    activeCases: null,
  });

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const summary = await fetchMetricsSummary();
        const channels = Object.values(summary.channels) as { health: string }[];
        if (!cancelled) {
          setStatus((prev) => ({
            ...prev,
            observabilityUp: true,
            channelsHealthy: channels.filter((c) => c.health === "healthy").length,
            channelsTotal: channels.length,
          }));
        }
      } catch {
        if (!cancelled) setStatus((prev) => ({ ...prev, observabilityUp: false }));
      }

      try {
        const cases = await fetchCases(50);
        if (!cancelled) {
          setStatus((prev) => ({
            ...prev,
            incidentsUp: true,
            activeCases: cases.filter((c: { active: boolean }) => c.active).length,
          }));
        }
      } catch {
        if (!cancelled) setStatus((prev) => ({ ...prev, incidentsUp: false }));
      }
    };

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return status;
}
