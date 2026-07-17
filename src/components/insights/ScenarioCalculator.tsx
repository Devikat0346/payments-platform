"use client";

import { useState } from "react";
import { InfoTip } from "@/components/InfoTip";
import { Rail, RAIL_LABELS } from "@/lib/channels";
import { fmtMoney } from "@/lib/format";
import { runScenario } from "@/lib/insights/api";
import { ScenarioResult } from "@/lib/insights/types";

const RAIL_OPTIONS: Rail[] = ["CARD", "WIRE", "ACH_BATCH", "ZELLE"];

export function ScenarioCalculator() {
  const [sourceRail, setSourceRail] = useState<Rail>("CARD");
  const [targetRail, setTargetRail] = useState<Rail>("ACH_BATCH");
  const [shiftPct, setShiftPct] = useState(25);
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = () => {
    if (sourceRail === targetRail) {
      setError("Source and target rail must be different.");
      return;
    }
    setError(null);
    setLoading(true);
    runScenario(sourceRail, targetRail, shiftPct)
      .then(setResult)
      .catch(() => setError("Couldn't run that scenario."))
      .finally(() => setLoading(false));
  };

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-1.5">
        <h3 className="font-semibold">Scenario: shift volume between rails</h3>
        <InfoTip text="A deterministic what-if, not a model: recomputes the net-margin impact of moving a share of one rail's actual recent volume onto another rail's revenue model — using the last 24 hours of real transaction volume as the baseline." />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted">From</label>
          <select
            value={sourceRail}
            onChange={(e) => setSourceRail(e.target.value as Rail)}
            className="text-sm rounded-md px-2.5 py-1.5"
            style={{ background: "var(--surface-accent-wash)", border: "1px solid var(--border)" }}
          >
            {RAIL_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {RAIL_LABELS[r]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted">To</label>
          <select
            value={targetRail}
            onChange={(e) => setTargetRail(e.target.value as Rail)}
            className="text-sm rounded-md px-2.5 py-1.5"
            style={{ background: "var(--surface-accent-wash)", border: "1px solid var(--border)" }}
          >
            {RAIL_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {RAIL_LABELS[r]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted">Shift {shiftPct}% of volume</label>
          <input
            type="range"
            min={0}
            max={100}
            value={shiftPct}
            onChange={(e) => setShiftPct(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleRun}
        disabled={loading}
        className="text-sm font-medium rounded-md px-3 py-1.5 self-start"
        style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
      >
        {loading ? "Calculating…" : "Run scenario"}
      </button>

      {error && <p className="text-secondary text-sm">{error}</p>}

      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg" style={{ background: "var(--surface-accent-wash)" }}>
          <div>
            <div className="text-muted text-xs">Volume shifted</div>
            <div className="text-sm font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
              {fmtMoney(result.shifted_volume)}
            </div>
          </div>
          <div>
            <div className="text-muted text-xs">Margin before</div>
            <div className="text-sm font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
              {fmtMoney(result.net_margin_before)}
            </div>
          </div>
          <div>
            <div className="text-muted text-xs">Margin after</div>
            <div className="text-sm font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
              {fmtMoney(result.net_margin_after)}
            </div>
          </div>
          <div>
            <div className="text-muted text-xs">Net impact</div>
            <div
              className="text-sm font-medium"
              style={{
                fontVariantNumeric: "tabular-nums",
                color: result.net_margin_delta >= 0 ? "var(--status-good)" : "var(--status-critical)",
              }}
            >
              {result.net_margin_delta >= 0 ? "+" : ""}
              {fmtMoney(result.net_margin_delta)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
