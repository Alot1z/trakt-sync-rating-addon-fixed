# Trakt Sync & Rating Add-on for Stremio

Stremio add-on for syncing watched states and ratings with Trakt.tv.

- Source repository: https://github.com/Alot1z/trakt-sync-rating-addon-fixed
- Public app hosting: deploy this Express application to a Node.js host such as Vercel; GitHub Pages alone cannot run the OAuth exchange and Stremio API routes.

## Features

- Mark movies and episodes watched or unwatched
- Rate movies, episodes, and series
- Optional watchlist actions
- Trakt OAuth Authorization Code flow with PKCE (S256)
- No Trakt client secret required

## Trakt OAuth setup

1. Open [Trakt API applications](https://trakt.tv/oauth/applications) and create an application.
2. Set Redirect URI to the exact callback URL of your deployed app: `https://YOUR-APP-DOMAIN/oauth/callback`.
3. Copy your Trakt Client ID into the app. Do not enter or publish a client secret.
4. Deploy this application to that same HTTPS origin. Callback URLs must match exactly.

The browser generates a PKCE verifier, S256 challenge, and random OAuth state. The callback is accepted only from the same origin and the frontend validates the returned state before exchanging the code.

## Privacy model and important limitation

The default mode does not require this project's own user database. Trakt tokens and the optional TMDB API key remain in page memory during setup and are not saved to browser local storage by the setup UI. Credentials are included in the generated Stremio add-on URL because Stremio must send them to the add-on server for Trakt actions. After reloading the setup page, reconnect to Trakt to generate another URL.

**Treat the generated add-on URL like a password.** It contains access and refresh tokens, configured username, and optional TMDB API key in a Base64URL-encoded configuration path. Base64URL is encoding, not encryption. Anyone who obtains the link may be able to use the connected Trakt account. Hosting providers may also record request paths in operational logs. This architecture therefore cannot honestly promise that only the link creator can access the connection or that token data is never processed by infrastructure.

This stateless mode avoids persistent token storage by this project's application, but it cannot guarantee seamless token refresh forever: Trakt can rotate refresh tokens, and a stateless add-on URL cannot rewrite itself after a refresh. Reauthorization and reinstalling a new add-on URL may be required when credentials expire or rotate. Seamless refresh requires persistent per-user token storage, which is a separate privacy trade-off and must be opt-in with storage controlled by the user.

Do not share generated add-on URLs. Clear browser site data to remove saved non-secret preferences. If a generated URL is exposed, remove this app's authorization from your Trakt account settings and generate a new add-on URL. Remove the add-on from Stremio when you no longer want it to access Trakt.

## Run locally

Requires Node.js 18 or newer.

```bash
git clone https://github.com/Alot1z/trakt-sync-rating-addon-fixed.git
cd trakt-sync-rating-addon-fixed
npm install
npm start
```

Open http://localhost:7000. For OAuth testing, register the exact localhost callback URL with Trakt if accepted by Trakt; otherwise test using your HTTPS deployment.

## Environment

Copy `.env.example` to `.env` and set `SERVER_URL` to your canonical origin without a trailing slash. Never commit `.env`, OAuth tokens, refresh tokens, or storage credentials.

- `PORT`: server port (default `7000`)
- `SERVER_URL`: canonical deployed origin
- Trakt Client ID: entered by each user in the UI
- TMDB key: optional user-provided value

## Deploy

Deploy the Node.js Express app using the included `vercel.json` and `api/index.js`, or another compatible Node.js host. Configure `SERVER_URL` and register `SERVER_URL/oauth/callback` in the Trakt application.

GitHub Pages can host static documentation only. It cannot replace this Express backend without moving the backend routes to a serverless/API host.

## Verify

```bash
npm test
node --check server.js
```

## Security notes

- OAuth uses PKCE S256 and state validation.
- Authorization-code exchange accepts only a same-origin `/oauth/callback` URI.
- The default configuration does not use a project-owned token database.
- Do not commit local environment files, personal exports, tokens, or deployment credentials.
