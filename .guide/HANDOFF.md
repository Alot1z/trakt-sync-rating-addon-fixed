# Agent Handoff

## Target

Work only in:
repository root (`.`)

Target fork:
https://github.com/Alot1z/trakt-sync-rating-addon-fixed

Do not modify upstream repository. Do not expose or retrieve local tokens. Do not deploy or alter Trakt app settings without explicit authorization.

## Next actions

1. Re-run npm test, node --check server.js, inline-script syntax checks, and git diff --check.
2. Start local server and verify /oauth/initiate rejects missing or invalid PKCE parameters; valid requests redirect with code_challenge_method=S256, exact callback, state, and challenge.
3. Verify /oauth/callback sends no-store headers and same-origin postMessage.
4. Verify /oauth/exchange rejects missing verifier and mismatched redirect URI without calling Trakt.
5. Inspect all OAuth and config routes. Confirm tokens and secrets never appear in application logs.
6. Review token refresh behavior. Stateless mode does not persist rotated refresh tokens; document reauthorization/reinstall or design an explicit opt-in user-owned persistence mode before claiming seamless operation.
7. Run full repository secret scan. Exclude .git and node_modules; never print secret values. Check tracked files for .env, personal paths, tokens, email addresses, private exports, and credentials.
8. Verify .gitignore excludes .env, .vercel, node_modules, and generated local files.
9. Review diff and stage only source, docs, tests, and .guide artifacts. Never commit node_modules or personal files.
10. Commit only after review. Push only to origin = Alot1z/trakt-sync-rating-addon-fixed after authentication is valid.
11. Update GitHub About/homepage through GitHub UI because current GitHub tools lack repository-settings mutation. Configure GitHub Pages explicitly if wanted; Pages is not the Express API host.
12. Do not claim published or deployed until commit, push, deployment, and live smoke tests are observed.

## Important limitation

A public stateless Stremio add-on cannot simultaneously guarantee no token persistence anywhere, seamless refresh with rotating refresh tokens, and a generated link usable only by its creator. Explain this trade-off; do not hide it.