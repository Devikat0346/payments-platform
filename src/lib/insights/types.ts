import { Rail } from "@/lib/channels";

export interface PeriodKPI {
  period_start: string;
  rail: Rail | "ALL";
  total_count: number;
  total_volume: number;
  revenue: number;
  cost: number;
  net_margin: number;
}

export interface InsightsSummary {
  latest: PeriodKPI | null;
  total_revenue: number;
  total_cost: number;
  total_volume: number;
  total_count: number;
  periods: number;
}

export interface ForecastPoint {
  period_start: string;
  value: number;
  is_forecast: boolean;
}

export interface ForecastResult {
  metric: "revenue" | "volume";
  points: ForecastPoint[];
  backtest_mape: number | null;
  insufficient_data: boolean;
  generated_at: string;
}

export type RailEconomics = Record<
  Rail,
  { revenue_rate: number; revenue_flat: number; cost_per_txn: number }
>;

export interface ScenarioResult {
  source_rail: Rail;
  target_rail: Rail;
  shift_pct: number;
  shifted_volume: number;
  revenue_before: number;
  revenue_after: number;
  cost_before: number;
  cost_after: number;
  net_margin_before: number;
  net_margin_after: number;
  net_margin_delta: number;
}
