# TheToolGenie — Development Status

## Current source of truth
This checkpoint summarizes the current 88-tool registry and production configuration. The public site name/domain remain configurable through environment variables.

## Tool coverage
- PDF: 14
- Image: 14
- Compiler: 8
- Developer: 12
- Text: 10
- Converters: 10
- Finance: 7
- Calculators: 9
- YouTube: 4
- **Total: 88 unique tools / 88 unique slugs**

## Implemented paths
- PDF and image operations use browser-side processing where supported.
- Python, JavaScript, Java, C++, C#, and PHP use the `/api/execute-code` runtime adapter; the external execution service must be reachable/configured in production.
- HTML uses a sandboxed iframe preview.
- SQL uses SQLite/WASM in the browser.
- Developer, Text, Converter, Calculator, Finance, and YouTube tools have tool-specific operations.
- Finance tools use dedicated formulas and INR output where applicable.

## Verification
- Registry verification covers all 88 tools and unique slugs.
- Dynamic JavaScript execution scan checks for `eval()` / `new Function()` patterns.
- Tool metadata and category-count validation are part of the repository verification script.
- Vercel reports a successful deployment for the latest SEO/metadata cleanup commit.

## Production configuration
- Set `NEXT_PUBLIC_SITE_NAME` and `NEXT_PUBLIC_SITE_URL` when the final brand/domain is decided.
- Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID` only after receiving the real Google AdSense publisher/client ID.
- Confirm the execution API endpoint/service is reachable for compiler tools.
- Confirm SQL WASM assets are available in the deployed public path.
- Test representative PDF/Image/QR processing in the target browsers.
- Run the 88-tool browser smoke suite against the production deployment.
