# Add machine-readable pricing and A2A service discovery

## Summary

This Phase 1 change publishes HydroSense pricing and service discovery as one read-only, versioned contract for people, crawlers, REST clients, structured-data consumers, and A2A v1.0 clients.

- Adds an immutable 11-record runtime catalog (`2026-08-12.1`, effective `2026-08-12`, USD).
- Adds a Catalyst pricing page and a plain-language agent-ready guide.
- Adds stable catalog, REST, OpenAPI 3.1, Agent Card, and synchronous A2A `SendMessage` surfaces.
- Adds deterministic ZIP serviceability and standard-scope estimate logic.
- Keeps booking authority at `assessment_only`; every result requires a final written proposal.
- Keeps installation and compatible one-time add-ons in `oneTimeCatalogTotal`; optional annual care is returned separately in `recurringSelections` at $99/P1Y. `publishedCatalogTotal` remains a one-time-only compatibility alias.
- References the existing global `https://hydrosensetx.com/#business` provider from pricing JSON-LD instead of defining a duplicate entity.

## Catalog

| Service ID | Public price |
| --- | ---: |
| `HS-INSTALL-075-001` | $999 |
| `HS-INSTALL-100-001` | $1,450 |
| `HS-INSTALL-125-001` | $1,875 |
| `HS-INSTALL-150-001` | $3,456, FloLogic large-line system + standard installation |
| `HS-INSTALL-200-001` | $4,175, FloLogic commercial-grade large-line system + standard installation |
| `HS-SENSOR-ADD-001` | $75 each when compatibility is confirmed |
| `HS-BATTERY-ADD-001` | $475/system when requested and compatible |
| `HS-CARE-ANNUAL-001` | $99/year, optional |
| `HS-SITE-ASSESS-001` | $0 |
| `HS-IRRIGATION-ADD-001` | Quote required |
| `HS-CORRECTIVE-001` | Quote required |

Every line-size installation price includes one compatible device. Domestic household water is standard scope. Irrigation requires technical review and a written quote. Fire-sprinkler and fire-suppression piping are always excluded.

## Public surface

- `GET /pricing`
- `GET /agent-ready`
- `GET /service-catalog.json`
- `GET /openapi.json`
- `GET /.well-known/agent-card.json`
- `GET /api/public/v1/services`
- `GET /api/public/v1/services/{serviceId}`
- `POST /api/public/v1/serviceability`
- `POST /api/public/v1/estimate`
- `POST /api/a2a` — JSON-RPC 2.0 `SendMessage` only

## Authority and data boundary

The public interfaces do not schedule, reschedule, cancel, accept or decline quotes, create payments, collect customer PII, contact providers, or grant any fire-suppression scope. No database migration or production configuration change is included.

## Validation

- Credibility verifier: pass.
- Service-catalog verifier: pass (11 active records, 9 fixed prices, 2 quote-required records).
- Unit tests: 102/102 pass across 3 suites, including the existing closed-loop site-visit suite.
- TypeScript: pass.
- ESLint: pass.
- Production build: pass with 65 generated pages/routes; no release-caused error.
- Playwright E2E: 22/22 pass across desktop and mobile projects.
- Browser/API sweep: pass at 375, 768, 1024, 1440, and 1792 pixels with no horizontal overflow or Next error overlay.
- OpenAPI: valid OpenAPI 3.1 via Redocly CLI.
- A2A: Agent Card and live `SendMessageResponse` accepted by official `a2a-sdk` 1.1.2 protobuf models.
- Pricing JSON-LD: parses as `Service` + `OfferCatalog` with exactly nine fixed-price offers matching the catalog; quote-required services have no fabricated price.

Final full-suite counts and the Vercel preview are added to the draft PR after the branch deployment completes.

## Screenshots

### Pricing

- [Mobile, 375px](./pr-assets/a2a-pricing/pricing-375.png)
- [Desktop, 1440px](./pr-assets/a2a-pricing/pricing-1440.png)

### Agent-ready

- [Mobile, 375px](./pr-assets/a2a-pricing/agent-ready-375.png)
- [Desktop, 1440px](./pr-assets/a2a-pricing/agent-ready-1440.png)

## Rollback

Revert the feature commit or the eventual PR merge commit. No database, payment, booking, provider-message, or production migration rollback is required. The public discovery routes and their two navigation links are fully code-contained.
