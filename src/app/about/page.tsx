export default function AboutPage() {
  return (
    <div className="px-6 py-10 md:px-12 lg:px-20 max-w-[800px] mx-auto">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight mb-3">
          How this was built, and why it changed shape twice
        </h1>
        <p className="text-secondary text-sm">
          This page is the part a live dashboard can&apos;t show: the decisions, the dead ends, and
          the moments the plan changed. If you&apos;re evaluating this for a Forward Deployed
          Engineer role, this is probably more useful than the dashboards themselves.
        </p>
      </header>

      <section className="flex flex-col gap-8 text-sm text-secondary">
        <div>
          <h2 className="font-semibold text-base mb-2" style={{ color: "var(--text-primary)" }}>
            The starting point
          </h2>
          <p>
            The goal was a portfolio that actually demonstrates payments/SRE domain depth —
            credit, debit, wire, and batch rails, the way they really behave — plus AI-assisted
            operations, since that&apos;s increasingly what Forward Deployed roles are built
            around: taking an LLM and embedding it into someone&apos;s actual operational
            workflow, not a chatbot demo. Two projects were built first as fully independent
            services: a payments transaction simulator with an SRE observability layer, and an AI
            copilot that watches it and diagnoses incidents.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base mb-2" style={{ color: "var(--text-primary)" }}>
            Pivot #1 — from five demos to one platform
          </h2>
          <p>
            The two projects were live as separate sites with separate URLs. It worked, but it
            undersold the actual relationship between them — the incident copilot wasn&apos;t a
            standalone tool, it was already polling the simulator&apos;s live API and reasoning
            over its telemetry. Presenting them as disconnected demos hid that. The fix: keep each
            backend in its own repo (real, independent commit history still matters), but build
            <em> one</em> frontend with drill-down navigation, so the site reads as one payments
            platform with modules, not a pile of side projects.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base mb-2" style={{ color: "var(--text-primary)" }}>
            Pivot #2 — an infrastructure rug-pull, mid-build
          </h2>
          <p>
            The backends were originally on Fly.io. Partway through, Fly&apos;s free trial expired
            and started requiring a credit card to keep machines running — with a hard constraint
            against adding payment methods anywhere in this project, that meant migrating two live
            production services to a different host (Render) under time pressure, without
            downtime tolerance being the point (it&apos;s a demo), but with correctness tolerance
            being non-negotiable — the migration had to actually work, both APIs, both frontends,
            re-verified end to end, not just &quot;probably fine.&quot;
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base mb-2" style={{ color: "var(--text-primary)" }}>
            Going deeper on domain accuracy
          </h2>
          <p>
            Early feedback on the platform was blunt: it looked generic, and the specific
            credit/debit/wire origination detail that was supposed to be the differentiator
            wasn&apos;t actually visible anywhere. That triggered a real expansion, not a coat of
            paint — a new Zelle rail, three new wire origination paths (commercial loan wires via
            LoanIQ, bulk batch-file wires, phone/IVR-initiated wires), and a switch from a
            hardcoded credit/debit mapping to a realistic probabilistic mix per channel, since a
            card swipe can genuinely be run as either. That change immediately surfaced a real bug:
            two batch channels looked &quot;stuck&quot; on the dashboard because the UI assumed
            every channel produces per-transaction latency, and batch channels structurally never
            do. Fixed by treating &quot;no latency data, ever&quot; as a different state from
            &quot;no data yet.&quot;
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base mb-2" style={{ color: "var(--text-primary)" }}>
            The hardening pass
          </h2>
          <p>
            Once the domain modeling was right, the next honest question was whether the
            engineering underneath it would hold up to scrutiny — and it had real gaps: zero
            automated tests, no CI, no way to know whether the AI copilot&apos;s diagnoses were
            actually any good beyond spot-checking a few by hand. That became its own pass: unit
            tests for the simulation/metrics logic (which caught a real bug — a 404 endpoint that
            was silently returning 200 with a malformed body), GitHub Actions CI across all three
            repos, and an evaluation harness that replays known incident scenarios through the real
            model and scores whether it engages with the true cause. Current score: 6/6.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base mb-2" style={{ color: "var(--text-primary)" }}>
            What&apos;s still explicitly unfinished
          </h2>
          <p>
            Reconciliation and Business Insights modules don&apos;t exist yet — they&apos;re
            placeholders on the overview page, not hidden. Everything here is in-memory with no
            persistence, by design, documented as a trade-off rather than discovered as a
            surprise. Both live backends run on a free tier that sleeps after 15 idle minutes.
            None of that is dressed up as more finished than it is.
          </p>
        </div>
      </section>
    </div>
  );
}
