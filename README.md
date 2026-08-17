Updated README: Phase 2 server instructions added.

Server (Phase 2)
- Start the server: cd server && npm install && npm run start
- Ensure you set GEMINI_API_KEY in server/.env (or top-level .env if running both server & client together)
- The client expects the server to be reachable at the same origin (proxy in dev or deploy together); for local development you can run the server on port 5178 and the client on 5173 and configure a proxy (or call full URL)
