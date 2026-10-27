# Decision Log

## ADR-001: Use Trakt PKCE public-client OAuth
Status: active
Decision: Use Authorization Code + PKCE S256; no Trakt client secret.
Why: Trakt rejects the old OOB flow with `code_challenge is required for this client`.
Evidence: `server.js` OAuth routes and `public/index.html` browser flow.
Trade-off: Trakt app's registered callback must exactly match deployed `/oauth/callback`.

## ADR-002: Stateless default; no project-owned token database
Status: active, needs product review
Decision: Default add-on config embeds Trakt tokens in URL and avoids Upstash credentials in generated URL.
Why: User requested no project-owned user data storage.
Security consequence: URL is a bearer credential; Base64URL is not encryption and hosting may log request paths.
Operational consequence: seamless token refresh cannot be guaranteed when Trakt rotates refresh tokens, because a stateless URL cannot update itself.
Alternatives: (a) user-owned persistent storage with explicit opt-in and careful credential handling; (b) project-owned token database with account isolation, retention/deletion controls, and stronger privacy disclosures; (c) stateless mode with reauthorization/reinstall when tokens expire.
Open decision: choose between strict no-storage and seamless refresh before public release.

## ADR-003: Separate repository page from running app
Status: active
Decision: GitHub repository/docs URL and app hosting URL are distinct.
Why: GitHub Pages serves static files and cannot run the Express OAuth exchange and Stremio API routes by itself.
Action: Keep app on a compatible Node.js host. Set repository About homepage to the repo URL only if user specifically wants GitHub repo link there; do not pretend GitHub Pages is the backend.
