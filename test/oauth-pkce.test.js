import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const server = fs.readFileSync(new URL('../server.js', import.meta.url), 'utf8');
const page = fs.readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
const readme = fs.readFileSync(new URL('../README.md', import.meta.url), 'utf8');

test('authorization request uses PKCE S256 and registered callback', () => {
  assert.match(server, /code_challenge:\s*codeChallenge/);
  assert.match(server, /code_challenge_method:\s*'S256'/);
  assert.match(server, /parsed\.pathname === '\/oauth\/callback'/);
  assert.doesNotMatch(server, /req\.get\('x-forwarded-host'\)/);
  assert.match(server, /if \(process\.env\.NODE_ENV === 'production'\) return ''/);
  assert.match(page, /window\.location\.origin \+ '\/oauth\/callback'/);
});

test('token exchange sends verifier and does not require client secret', () => {
  assert.match(server, /code_verifier:\s*codeVerifier/);
  assert.match(server, /const \{ code, codeVerifier, redirectUri, clientId/);
  assert.doesNotMatch(server, /client_secret:\s*clientSecret/);
  assert.doesNotMatch(server, /urn:ietf:wg:oauth:2\.0:oob/);
  assert.doesNotMatch(page, /clientSecretInput/);
});

test('browser callback checks origin, popup source, and OAuth state', () => {
  assert.match(page, /event\.origin !== window\.location\.origin/);
  assert.match(page, /event\.source !== oauthPopup/);
  assert.match(page, /result\.state !== pending\.state/);
});

test('stateless generated add-on config never embeds Upstash credentials', () => {
  const generator = page.slice(page.indexOf('function generateAddonUrl()'), page.indexOf('function installInStremioDesktop()'));
  assert.match(generator, /config\.storage = 'url'/);
  assert.doesNotMatch(generator, /config\.upstashUrl|config\.upstashToken|config\.configId/);
  assert.match(generator, /config\.refresh_token = traktTokens\.refresh_token/);
  assert.match(generator, /Privacy warning: generated Stremio add-on URL contains Trakt access and refresh tokens, your username, and optional TMDB key/);
});

test('legacy browser config removes saved client secret and Upstash credentials', () => {
  assert.match(page, /delete data\[key\]/);
  assert.match(page, /'clientSecret', 'upstashUrl', 'upstashToken', 'traktTokens', 'storageMethod', 'configId', 'tmdbKey', 'currentUsername'/);
  const saveBlock = page.slice(page.indexOf('function saveData()'), page.indexOf('// Helper function to convert UTF-8 string to Base64 URL-safe'));
  assert.doesNotMatch(saveBlock, /tmdbKey:|traktTokens:|currentUsername:/);
  assert.match(page, /Never restore legacy Upstash credentials/);
  assert.doesNotMatch(page, /clientSecretInput\.value = data\.clientSecret/);
});

test('docs explain privacy boundary and do not claim perfect privacy', () => {
  assert.match(readme, /Base64URL is encoding, not encryption/i);
  assert.match(readme, /cannot honestly promise/i);
  assert.match(readme, /GitHub Pages can host static documentation only/i);
  assert.match(readme, /github\.com\/Alot1z\/trakt-sync-rating-addon-fixed/);
});
