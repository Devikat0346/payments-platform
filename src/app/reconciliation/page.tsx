export default function ReconciliationPage() {
  return (
    <div className="px-6 py-10 md:px-12 lg:px-20 max-w-[1000px] mx-auto">
      <h1 className="text-2xl font-semibold tracking-tight mb-3">
        Payments Reconciliation &amp; Anomaly Detection
      </h1>
      <p className="text-secondary text-sm max-w-xl mb-8">
        Batch-reconciles origination records against settlement/posting records, flags breaks
        (duplicates, amount mismatches, orphaned wires), and scores transactions for anomalies —
        built on the same synthetic transaction data as the Observability module.
      </p>
      <div className="card p-8 text-center text-muted text-sm">
        Under construction — coming soon.
      </div>
    </div>
  );
}
