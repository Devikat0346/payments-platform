import { LineChart } from "lucide-react";

export default function InsightsPage() {
  return (
    <div className="px-6 py-10 md:px-12 lg:px-20 max-w-[1000px] mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Payments Business Insights &amp; ROI Modeling
        </h1>
        <span className="badge badge-soon">Coming soon</span>
      </div>
      <p className="text-secondary text-sm max-w-xl mb-8">
        Payments economics (interchange, fees, transaction cost drivers), KPI tracking (volume,
        activation, spend, retention), and ROI/scenario/sensitivity modeling for new payments
        initiatives — a business-case dashboard built on top of the platform&apos;s transaction data.
      </p>
      <div className="card p-10 flex flex-col items-center gap-3 text-center">
        <span className="icon-tile !w-11 !h-11 !rounded-xl">
          <LineChart size={20} strokeWidth={2} />
        </span>
        <p className="text-muted text-sm">Under construction — coming soon.</p>
      </div>
    </div>
  );
}
