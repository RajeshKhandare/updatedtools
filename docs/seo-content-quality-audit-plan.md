# Tool SEO Content Quality Audit — Remaining Scope

## Current verified baseline

- The SEO deduplication PR build succeeded for commit `825ff9ec2e5a2f216633b13b81dc4ef4e5d02b9a`.
- The associated GitHub Actions run reports successful build, international SEO foundation, festival SEO/hreflang/affiliate checks, Cloudflare preview wait, and the 1,344-route smoke test.
- The repository has 112 non-festival tools across 12 locales; 25 timetable tools use their dedicated SEO guide engine and 87 other tools have explicit English tool profiles.
- The current quality audit is primarily structural. It validates source slugs/keywords, descriptions, presence of guide sections, profile examples/mistakes/FAQ, localization lookup structure, and selected duplicate signals. It does not compute a semantic similarity score over all rendered guide paragraphs or provide native-speaker review of every translation.

## Remaining audit tasks

1. **Rendered-copy inventory**
   - Generate the actual `getToolSeoContent` and `getLocalizedToolSeoContent` output for every tool/locale pair.
   - Include timetable content from its dedicated engine.
   - Normalize Unicode, case, punctuation and whitespace before comparisons.

2. **Exact duplicate checks**
   - Detect duplicate paragraphs within a page across intro, why, steps, use cases, tips, limitations, FAQ answers and article sections (not only within one article section at render time).
   - Detect duplicates across different tool pages in the same locale, excluding explicitly approved shared legal/privacy/technical guidance.
   - Detect duplicate FAQ questions and answers, including case/punctuation variants.

3. **Near-duplicate / template-heavy checks**
   - Calculate token-shingle/Jaccard or comparable similarity between rendered paragraphs and pages within each locale.
   - Report common category-level paragraphs separately from tool-specific paragraphs; do not automatically delete valid safety/limitation guidance.
   - Flag pages where the tool-specific explanatory copy is only a small fraction of the full guide.
   - Set review thresholds only after measuring the current distribution; do not invent a universal threshold without a baseline.

4. **Tool-specific completeness checks**
   - Check every non-timetable tool for a concrete description of its operation, meaningful use cases, workflow-specific pitfalls, limitations, and FAQs.
   - Add explicit profile coverage for the dedicated timetable engine in a separate validation path rather than treating it as missing.
   - Validate that visible H1, visible hero description, metadata title/description, canonical URL, hreflang, and FAQ schema consistently describe the same tool and locale.

5. **Locale quality checks**
   - Check language-specific tool terminology and obvious untranslated English fallback phrases.
   - Keep locale-native wording and grammar checks distinct from structural coverage; automated heuristics cannot prove native-speaker quality.
   - Establish a manual review queue for high-traffic tools and any pages flagged by automated checks.

6. **Reporting and acceptance**
   - Emit a machine-readable JSON report with tool slug, locale, issue type, matched page/paragraph, similarity score, and review status.
   - Fail CI on exact duplicate tool-specific paragraphs and broken/missing content, but report shared approved copy as warnings.
   - Compare reports before and after edits and retain representative regression fixtures.

## Safety rules

- Do not bulk-rewrite 1,344 pages by replacing useful copy with the same longer keyword-stuffed template.
- Do not remove valid privacy, security, limitation, accessibility or legal guidance merely because it appears on multiple related tools.
- Do not merge this audit branch into `cloudflare-test` or production until checks are green and the relevant Cloudflare preview has been verified.
- A green structural/build smoke test is necessary, but it is not proof of human-reviewed translation quality or semantic uniqueness.
