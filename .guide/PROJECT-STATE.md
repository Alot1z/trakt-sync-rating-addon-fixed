# Project State: Trakt Sync Rating Add-on Fixed

Status: implementation in local clone; not yet committed, pushed, or deployed.
Observed workspace: repository root (`.`)
Remote: `https://github.com/Alot1z/trakt-sync-rating-addon-fixed`
Branch observed: `main`

## User intent

- Maintain a public, universal configuration site anyone can open.
- Each visitor connects their own Trakt account and configures their own Stremio add-on.
- Avoid project-owned user database and do not publish personal data or credentials.
- Correct repository URLs and fix Trakt's PKCE-required OAuth failure.

## Implemented locally

- OAuth authorization now uses PKCE S256 challenge and same-origin `/oauth/callback`.
- Browser validates callback origin, popup source, and OAuth state.
- Token exchange sends `code_verifier` and does not send a Trakt client secret.
- Hidden legacy client-secret field no longer participates in OAuth; saved legacy secret is purged when settings load.
- Generated add-on config defaults to stateless URL mode and does not embed Upstash URL, Upstash token, or Upstash config ID.
- UI warns that generated add-on URL contains Trakt tokens and is a bearer credential.
- README documents hosting, callback setup, and privacy/refresh limitations.
- Added tests in `test/oauth-pkce.test.js`.

## Hard privacy boundary

No remote app can guarantee 100% privacy for an add-on URL that embeds tokens. Base64URL is encoding, not encryption. Anyone with that URL may use the credential, and hosting infrastructure may log URL paths. A stateless add-on also cannot rewrite its own URL after a rotated refresh token. Seamless refresh requires persistence somewhere, which conflicts with a strict no-storage requirement.

Do not describe this design as “100% private” or “only the creator can access the link.” Current honest claim: default mode avoids this project's own persistent token database, but handles tokens transiently and includes tokens in the generated add-on URL.

## Not done / blockers

- Full browser-based OAuth with a real Trakt account remains unverified.
- Confirm serverless deployment behavior; in-memory caches are not durable on Vercel.
- Register exact production `/oauth/callback` URI in each Trakt app before using the hosted site.
- GitHub repository About/homepage metadata is not yet changed; current GitHub connector exposes no repository-settings mutation operation.
- No commit/push or deployment yet. GitHub CLI auth remains invalid; use normal GitHub device login, never extract token files or bypass security checks.

## Verification completed

- `npm test`: 6 passed, 0 failed.
- `node --check server.js`: passed.
- Inline JavaScript syntax checks: passed.
- `git diff --check`: passed.
- Local HTTP smoke: `/` returned 200; missing PKCE challenge returned 400; valid PKCE initiate returned 302 with `code_challenge_method=S256`; mismatched redirect URI returned 400; callback returned 200 with `Cache-Control: no-store`; missing code verifier returned 400.
- Broad scan found no legacy OOB URI, original deployment URL, upstream repo URL, placeholder owner URL, hardcoded personal deployment host, or secret/path/email-pattern hits. Tests intentionally assert that legacy `clientSecretInput` references are absent from the UI.

Still required: final secret scan, diff review, GitHub auth, push, hosted deployment, and real Trakt end-to-end test.
