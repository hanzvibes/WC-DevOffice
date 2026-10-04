# WC Dev Office

A live 3D engineering world for Wedding Copilot. It is intentionally isolated from the Wedding Copilot production application: it visualizes engineering activity without modifying the main product.

## Production features

- React Three Fiber immersive office world
- Character V2 agents with walking, typing/testing, review, blocked and shipped poses
- Aisle-aware agent navigation instead of straight-line teleporting
- State-aware Engineering, QA, Review and Deploy workstations
- Click an agent to enter a cinematic follow camera; click away to return to overview
- Live activity HUD and per-agent detail panel
- Stale activity protection: agents return to idle instead of looking falsely busy
- Responsive desktop/mobile camera and HUD
- Supabase-backed event history
- Token-protected Codex bridge ingestion
- Vercel-compatible Next.js deployment
- No fake work: visible engineering states come from real runtime events

## Run locally

```bash
npm install
npm run dev
```

## Run Codex with the live bridge

Configure these only on the machine where Codex runs. Never commit the private bridge token.

```bash
DEV_OFFICE_URL=https://wc-dev-office.vercel.app
DEV_OFFICE_BRIDGE_TOKEN=YOUR-PRIVATE-TOKEN
```

Then run:

```bash
npm run codex:live -- "Implement the task"
```

The bridge launches `codex exec --json`, maps structured runtime events to office states, and sends sanitized runtime metadata to the hosted office. It does not intentionally upload source file contents, `.env` contents, or credentials.

## State mapping

| Runtime activity | Office state | Visual behaviour |
| --- | --- | --- |
| turn / planning | READING | planning / lounge presence |
| file changes / commands | CODING | navigate to Engineering and type |
| test or build commands | TESTING | navigate to QA and work at the test station |
| collaboration / review | REVIEWING | navigate to Review and gesture |
| runtime error | BLOCKED | blocked pose and red presence ring |
| completed turn | DONE | move to Deploy and celebrate |

## Architecture

`Codex CLI -> local bridge -> /api/events -> constrained Supabase RPC -> 3D Vercel client`

The event feed is public because the public office renders that same activity. Event insertion is not public: writes go through a bridge-token-validated RPC. The token is stored only as a SHA-256 hash in the database.

## Security

- No Supabase service-role or secret API key is shipped to the browser or repository.
- Public database access is read-only and RLS-limited to the office event feed.
- The bridge configuration table has RLS enabled with no public read policy.
- Event writes require the private bridge token and pass through a constrained `SECURITY DEFINER` RPC.
- The bridge token has no repository fallback and must come from local environment configuration.
- Runtime messages and task names are length-limited.
- A previously exposed development bridge token was rotated and is no longer accepted.

## Third-party attribution

The visual architecture is inspired by the MIT-licensed Claw3D project. See `THIRD_PARTY_NOTICES.md` for attribution. WC Dev Office keeps its own Wedding Copilot identity and event model.
