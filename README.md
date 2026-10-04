# WC Dev Office

A 3D live engineering office for Wedding Copilot. The world is intentionally separate from the Wedding Copilot production application.

## What is live

- React Three Fiber 3D office
- Orbit / zoom camera
- Coding, QA, review, blocked, idle and done/deploy zones
- Worker positions are driven by persisted runtime events
- No fake "working" animation when there is no runtime event
- Supabase-backed event history
- Token-protected bridge ingestion
- Vercel-compatible Next.js app

## Run the office

```bash
npm install
npm run dev
```

## Run Codex with the live bridge

Configure these only on the machine where Codex runs:

```bash
DEV_OFFICE_URL=https://YOUR-VERCEL-DEPLOYMENT
DEV_OFFICE_BRIDGE_TOKEN=YOUR-PRIVATE-TOKEN
```

Then run:

```bash
npm run codex:live -- "Implement the task"
```

The bridge launches `codex exec --json`, maps structured runtime events to office states, and sends metadata to the hosted office. It does not upload source file contents or environment variables.

## State mapping

| Runtime activity | Office state |
| --- | --- |
| turn / planning | READING |
| file changes / commands | CODING |
| test or build commands | TESTING |
| collaboration / review | REVIEWING |
| runtime error | BLOCKED |
| completed turn | DONE |

## Architecture

`Codex CLI -> local bridge -> /api/events -> secure Supabase RPC -> 3D Vercel client`

The public app can read office activity. Writes require the private bridge token, stored as a SHA-256 hash in the database.

## Security

- Supabase service-role keys are not shipped to the browser or repository.
- Direct table access for anon/authenticated roles is revoked.
- Bridge writes go through a constrained RPC.
- Messages are length-limited and no raw source code is intentionally sent.
