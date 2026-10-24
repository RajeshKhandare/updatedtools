# Tool SEO Content Quality Audit — Status and Acceptance Criteria

## Baseline

- PR #24's duplicate-intro rendering fix was previously verified by a successful Cloudflare PR build and 1,344 localized-route smoke test for commit `825ff9ec2e5a2f216633b13b81dc4ef4e5d02b9a`.
- The catalog has 112 non-festival tools across 12 locales: 87 non-timetable tools with explicit English SEO profiles and 25 timetable tools on a dedicated guide engine.
- Merge PDF is the detailed benchmark: tool purpose, step-by-step workflow, practical use cases, best practices/common mistakes, limitations/final checks, FAQs, and technical interpretation where relevant.

## Implemented in this branch

- Added a source-level regression audit for explicit profiles, tool-specific examples/mistakes/FAQs, duplicate phrases, section strategy, and timetable-engine coverage.
- Wired the source audit into the build.
- Expanded English non-finance guides to six sections following the Merge PDF strategy; finance tools receive the technical formula/assumptions section where relevant.
- Ensured incomplete localized guides are rebuilt with six sections and missing headings are not accepted as a complete authored guide.
- Avoided repeating FAQ questions and answers in both the long-form article list and the accessible FAQ disclosure cards.
- Ensured timetable guides have at least two practical tips, including a fallback when a template has too few.
- Added a runtime audit that calls `getLocalizedToolSeoContent` for all 112 non-festival tools across all 12 locales (1,344 outputs), checks required content fields and section completeness, and reports exact/near-duplicate paragraph signals. The report is written to the CI runner's temporary directory.
- Fixed exact repeated example/mistake entries identified by the source audit.
- PR #25 remains a draft while CI issues are being fixed. Nothing has been merged into `cloudflare-test`.

## Current validation gate

1. Source-level SEO strategy audit passes.
2. Runtime audit passes for all 1,344 actual builder outputs, with no missing content fields or empty section headings.
3. Review exact/near-duplicate warnings; retain legitimate shared privacy, security, limitation, accessibility and legal guidance, but fix repeated tool-specific copy.
4. TypeScript/Next build passes.
5. Festival SEO/hreflang checks pass.
6. Matching Cloudflare preview deploys successfully and all 1,344 localized routes pass smoke tests.
7. Only after all of the above should the PR be considered for merge.

## Remaining limitations

- Automated similarity checks flag candidates; they cannot determine by themselves whether shared copy is appropriate.
- Native-speaker review of every translation is not replaced by automated checks.
- Visible H1, hero description, metadata, canonical/hreflang and FAQ schema still need to be checked against the actual Cloudflare preview as part of the final gate.

## Safety

- Cloudflare is the production platform; do not use Vercel in this workflow.
- Do not merge this branch into `cloudflare-test` until every required check and the Cloudflare preview verification are green.
- Do not replace tool-specific content with a long generic keyword template or delete useful shared safety/privacy guidance solely because it recurs.
