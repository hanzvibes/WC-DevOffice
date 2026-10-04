# Real Development Lifecycle

WC Dev Office now accepts authenticated lifecycle events at `POST /api/lifecycle` and turns them into the same realtime office event stream used by Codex.

## State mapping

| Source event | Office state | Area |
| --- | --- | --- |
| Push / coding | `CODING` | Engineering |
| CI/check running | `TESTING` | QA Lab |
| CI/check passed / PR open | `REVIEWING` | Review Room |
| PR merged / deployment building | `DEPLOYING` | Deploy Bay |
| Deployment success | `DONE` | Deploy Bay |
| CI/deploy failure | `BLOCKED` | Attention/Lounge |

## Authentication

All lifecycle writes require the existing private bridge token in the `x-bridge-token` header. Do not put the token in browser code or commit it to Git.

## GitHub Actions

This repository includes `.github/workflows/dev-office-lifecycle.yml`, which forwards this repo's CI and Vercel commit-status events when the repository secret `DEV_OFFICE_BRIDGE_TOKEN` exists.

For another repository, including Wedding Copilot, use the same pattern: keep `DEV_OFFICE_BRIDGE_TOKEN` as a GitHub Actions secret and POST the GitHub event payload to `https://wc-dev-office.vercel.app/api/lifecycle`.

Example job step:

```yaml
- name: Forward lifecycle event
  env:
    DEV_OFFICE_BRIDGE_TOKEN: ${{ secrets.DEV_OFFICE_BRIDGE_TOKEN }}
    EVENT_JSON: ${{ toJson(github.event) }}
  run: |
    curl --fail-with-body -X POST https://wc-dev-office.vercel.app/api/lifecycle \
      -H "content-type: application/json" \
      -H "x-bridge-token: $DEV_OFFICE_BRIDGE_TOKEN" \
      --data "$(jq -n --argjson payload "$EVENT_JSON" '{provider:"github",event:"workflow_run",payload:$payload}')"
```

## Vercel

Vercel deployment commit statuses can be forwarded as GitHub `status` events. The normalizer recognizes a `Vercel` status context and maps pending/building to `DEPLOYING`, success to `DONE`, and failure/error to `BLOCKED`.

Direct Vercel webhook payloads can also be sent with `{ "provider": "vercel", "event": "deployment.created|deployment.succeeded|deployment.error", "payload": ... }` using the same bridge header.

## Wedding Copilot repo

WC Dev Office does not modify `adiuvox/WeddingCopilot-ID`. To activate that private repo as a source, add the bridge token as an Actions secret there and add a tiny forwarding workflow. The product application itself does not need any Dev Office code.
