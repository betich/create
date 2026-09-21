# Auth

Most projects need only these two providers:

- **LINE Login** for Thai consumer products, where people arrive from a LINE OA. Use LIFF when the app runs inside LINE.
- **Google** for everything else, and alongside LINE for people who don't use it.

| Stack | How |
|---|---|
| elysia | [Better Auth](https://www.better-auth.com) with its Drizzle adapter (Google is built in, LINE is a generic OAuth provider), or a small hand-rolled OAuth flow with signed session cookies |
| cloudflare | the same Better Auth setup with the D1 adapter, or a hand-rolled OAuth flow with an HMAC session token checked in the Worker |
| pocketbase | PocketBase auth collections with its OAuth2 providers (Google and LINE are both built in) |

Keep a dev-only sign-in bypass behind an env flag and a build tag, so local and agent testing doesn't need a real OAuth round trip. Make sure it's excluded from production builds.
