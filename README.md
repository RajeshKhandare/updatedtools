# Toolployee

A Next.js web application containing 87 browser-oriented utilities across PDF, Image, Compiler, Developer, Text, Converter, Calculator, Finance, and YouTube categories.

> **Branding note:** Toolployee is the selected working brand. The final production domain remains configurable and will be connected only after the domain is purchased.

## Stack
- Next.js
- React
- TypeScript
- Tailwind CSS
- pdf-lib / PDF.js / qpdf WASM where applicable
- sql.js for browser-side SQLite tooling
- Vercel deployment

## Local development
```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```

## Verification
Run the registry and safety checks:
```bash
node scripts/verify-tools.mjs
```

The registry is expected to contain exactly 87 unique tool slugs with the configured category distribution.

## Environment variables
Copy `.env.example` and configure values as needed:

- `NEXT_PUBLIC_SITE_NAME` — public site name; currently Toolployee.
- `NEXT_PUBLIC_SITE_URL` — canonical production URL; leave unset until the final domain is connected.
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID` — optional Google AdSense client ID. Leave unset until a real publisher ID is available.

Compiler tools also depend on the configured execution runtime/API.

## Architecture notes
Many utilities process inputs in the browser, while compiler tools use a runtime adapter and some tools use WASM or browser APIs. Privacy/security wording should therefore remain tool-specific rather than claiming that every operation is entirely client-side.

## Deployment
The project is configured for Vercel. GitHub/Vercel checks should be treated as the deployment source of truth after each production change.

The final production domain will be configured through `NEXT_PUBLIC_SITE_URL` after domain purchase and DNS setup; no production-domain value is hardcoded in the repository before then.
