# Decision Log

## ADR-001: Trakt PKCE public-client OAuth
Status: active.
Decision: Use Authorization Code + PKCE S256; no Trakt client secret.
Why: Trakt rejects the legacy OOB flow with `code_challenge is required for this client`.
Trade-off: Each Trakt application must register the exact deployed `/oauth/callback` URI.

## ADR-002: Stateless default; no project-owned token database
Status: active.
Decision: Default add-on config embeds Trakt tokens in its URL and excludes Upstash credentials/config IDs.
Why: User requested no project-owned persistent user data.
Security consequence: URL is a bearer credential; Base64URL is not encryption and hosting may log request paths.
Operational consequence: seamless refresh cannot be guaranteed when Trakt rotates refresh tokens because a stateless URL cannot update itself.
Alternatives: user-owned persistent storage with explicit opt-in; project-owned database with isolation/retention/deletion controls; or stateless mode with reauthorization/reinstall when credentials expire.

## ADR-003: Repository page and running app are separate
Status: active.
Decision: GitHub About homepage points to `https://github.com/Alot1z/trakt-sync-rating-addon-fixed`. The running Express/OAuth/Stremio backend must be hosted separately on a Node.js-capable platform such as Vercel.
Why: GitHub Pages serves static content only and cannot run these backend routes.
Action: Deploy fork to Vercel and document production app URL separately from repository URL.
