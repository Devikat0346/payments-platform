import { GitCompareArrows } from "lucide-react";

export default function ReconciliationPage() {
  return (
    <div className="px-6 py-10 md:px-12 lg:px-20 max-w-[1000px] mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Payments Reconciliation &amp; Anomaly Detection
        </h1>
        <span className="badge badge-soon">Coming soon</span>
      </div>
      <p className="text-secondary text-sm max-w-xl mb-8">
        Batch-reconciles origination records against settlement/posting records, flags breaks
        (duplicates, amount mismatches, orphaned wires), and scores transactions for anomalies —
        built on the same synthetic transaction data as the Observability module.
      </p>
      <div className="card p-10 flex flex-col items-center gap-3 text-center">
        <span className="icon-tile !w-11 !h-11 !rounded-xl">
          <GitCompareArrows size={20} strokeWidth={2} />
        </span>
        <p className="text-muted text-sm">Under construction — coming soon.</p>
      </div>
    </div>
  );
}
