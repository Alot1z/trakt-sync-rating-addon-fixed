# Agent Handoff

## Target

Repository: https://github.com/Alot1z/trakt-sync-rating-addon-fixed
Branch: `main`
Work only in repository root.

Do not modify upstream repository. Do not read or expose token files. Do not alter Trakt application settings without explicit authorization.

## Current state

- Commit `8b1f480` is pushed.
- Follow-up origin-validation and log-sanitization changes pass local tests but are not committed yet.
- GitHub About homepage is set to the fork repository URL.
- CI workflow file exists locally at `.github/workflows/ci.yml`; Git push rejected it because current GitHub OAuth token lacks `workflow` scope. Obtain scope through normal GitHub device authorization, or keep workflow unpushed.
- No Vercel deployment created yet.

## Required next steps

1. Commit and push current verified changes to `origin/main`.
2. Add/push `.github/workflows/ci.yml` after GitHub `workflow` scope is approved.
3. Create Vercel project linked to `Alot1z/trakt-sync-rating-addon-fixed`.
4. Set production `SERVER_URL` to stable canonical Vercel production domain.
5. Confirm production domain is publicly accessible; preview protection must not block visitors.
6. Register exact `https://YOUR-PRODUCTION-DOMAIN/oauth/callback` URI in the Trakt application.
7. Re-run `npm test`, `node --check server.js`, inline script syntax checks, `git diff --check`, and local HTTP smoke tests.
8. Test real Trakt OAuth end-to-end only after callback registration.
9. Scan for secrets, personal paths, private exports, and credential-bearing logs before each push.

## Privacy boundary

Generated add-on URL contains Trakt access/refresh tokens, configured username, and optional TMDB API key. Base64URL is not encryption. Anyone with the URL may use the credentials. Hosting infrastructure may log request paths. Stateless mode cannot persist rotated refresh tokens, so reauthorization/reinstall may be required. Never claim 100% privacy or that a bearer-token URL is accessible only to its creator.
