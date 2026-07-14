# Contributing

This is a personal portfolio project, not under active development for outside contributions — but issues and suggestions are genuinely welcome if something looks wrong or could be better.

## Local setup

See the README's "Running locally" section — you'll need both backend services (from their own repos) running or pointed at their live URLs.

## Before submitting a PR

- `npm run lint`, `npx tsc --noEmit`, `npm test`, and `npm run build` — CI runs all four on every push.
- Adding a new module (like Reconciliation or Business Insights)? Follow the existing pattern: a namespaced `lib/<module>/` for types/api/hooks, `components/<module>/` for its components, and its own `NEXT_PUBLIC_<MODULE>_API_URL` / `_WS_URL` env vars.

## Reporting a bug

Open an issue with what you expected vs. what happened. If it's about the live demo, note whether a module looked "stuck" (likely the backend's free-tier host waking from sleep) before assuming it's a real bug.
