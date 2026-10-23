# Tool SEO Content Quality Audit — Status and Remaining Scope

## Verified baseline

- PR #24's deduplication fix was previously verified by a successful Cloudflare PR build and 1,344 localized-route smoke test for commit `825ff9ec2e5a2f216633b13b81dc4ef4e5d02b9a`.
- The catalog has 112 non-festival tools across 12 locales: 87 non-timetable tools with explicit English SEO profiles and 25 timetable tools using their dedicated guide engine.
- Merge PDF remains the detailed benchmark, with tool purpose, step-by-step workflow, use cases, best practices/common mistakes, limitations/quality checks, FAQs, and extra technical interpretation where relevant.

## Implemented in this branch

- Added `scripts/audit-rendered-seo-strategy.mjs` and wired it into the normal build as `verify:rendered-seo-strategy`.
- The new source-level regression audit checks the 87 eligible profiles for tool-specific examples, common mistakes and FAQs; checks catalog/profile coverage; flags exact repeated examples/mistakes and high-similarity pairs; and validates the required section strategy plus the dedicated timetable engine.
- Expanded English non-finance guides to the six-section Merge PDF strategy: tool purpose, step-by-step workflow, practical use cases, best practices/common mistakes, limitations/final checks, and FAQs.
- Expanded localized guides that do not already contain a full six-section authored article, so the standard localized guide shell includes purpose, workflow, use cases, practices, limitations, and FAQs. Existing long-form Merge PDF and other complete authored guides are preserved.
- Kept the PR open and draft pending CI results; no merge into `cloudflare-test` has been performed.

## Remaining work before acceptance

1. Run the current head through CI and fix any audit/build/type errors it reveals.
2. Inspect exact/near-duplicate warnings and make targeted copy fixes where examples or mistakes are genuinely repeated across tools. Preserve legitimate shared safety/privacy/limitations advice.
3. Extend the audit to import and inspect the actual runtime output of `getToolSeoContent` and `getLocalizedToolSeoContent` for all 1,344 tool/locale pairs, including timetable content. The current added audit is source-based; it does **not** claim to be a complete runtime-rendered paragraph report.
4. Check cross-section duplicates across intro, why, steps, use cases, tips, limitations, FAQs and article paragraphs, and produce a machine-readable report with slug, locale, issue type and similarity score.
5. Verify visible H1/hero copy, metadata, canonical/hreflang and FAQ schema alignment, then verify the matching Cloudflare preview and all 1,344 localized routes after the code changes.

## Safety rules

- Cloudflare is the production platform; do not use Vercel in this workflow.
- Do not merge this branch into `cloudflare-test` until the new audit, existing checks, build, route smoke tests, and Cloudflare preview verification are green.
- Do not replace tool-specific content with one long generic template or remove legitimate shared privacy, security, limitation, accessibility or legal guidance merely because it recurs.
- Green automation is necessary but does not replace native-speaker review of translations or human review of semantic uniqueness.
