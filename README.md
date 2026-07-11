# Payments Platform

A single, unified frontend that ties together a multi-service payments platform, with drill-down navigation into each capability instead of presenting them as disconnected demos.

**Live:** https://payments-platform-theta.vercel.app

## Why this exists

The backends behind this are genuinely separate services with their own repos, their own deploy lifecycle, and their own reason to exist independently:

- [payments-observability-platform](https://github.com/Devikat0346/payments-observability-platform) — the transaction simulator and SLI/SLO/error-budget engine that everything else reads from
- [payments-incident-copilot](https://github.com/Devikat0346/payments-incident-copilot) — polls the observability platform and uses an LLM to diagnose degraded channels

But presenting them as five unrelated demo links undersells the point: they're not independent projects, they're modules of one payments platform — transactions flow in, get observed, get triaged by AI when something breaks, and (soon) roll up into reconciliation and business reporting. This app is the single entry point that makes that relationship visible: one nav, one live URL, drill down into whichever capability you want to see.

## Architecture

```
                         ┌─────────────────────────────┐
                         │      payments-platform       │   ← this repo (frontend only)
                         │   (Next.js, one deployment)  │
                         └───────────────┬───────────────┘
                    ┌────────────────────┼────────────────────┐
                    ▼                    ▼                    ▼
        ┌───────────────────┐  ┌───────────────────┐   (Reconciliation,
        │ observability-api  │  │ incident-copilot-  │    Insights — planned,
        │ (own repo/deploy)  │  │ api (own repo/     │    will add their own
        │                    │  │ deploy)             │    backend services here)
        └───────────────────┘  └───────────────────┘
```

Each backend remains an independently deployable service with its own README, tech stack, and design decisions documented in its own repo. This repo only contains the presentation layer that unifies them.

## Routes

- `/` — overview, cross-module status, links into each module
- `/observability` — live dashboard for the transaction simulator
- `/incidents` — live dashboard for the AI incident copilot
- `/reconciliation` — placeholder until Project 3's backend exists
- `/insights` — placeholder until Project 5's backend exists

## Tech stack

Next.js 16 (App Router), TypeScript, Tailwind CSS, Recharts. No backend of its own — every route fetches from its module's live API via REST + WebSocket.

## Running locally

```bash
npm install
# .env.local:
# NEXT_PUBLIC_OBSERVABILITY_API_URL=<observability backend URL>
# NEXT_PUBLIC_OBSERVABILITY_WS_URL=<observability backend wss URL>
# NEXT_PUBLIC_INCIDENTS_API_URL=<incident copilot backend URL>
# NEXT_PUBLIC_INCIDENTS_WS_URL=<incident copilot backend wss URL>
npm run dev
```
