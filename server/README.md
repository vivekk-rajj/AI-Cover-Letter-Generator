# Server (Phase 2)

This folder contains a simple Express server that exposes a POST /api/generate endpoint. The endpoint will: 
- Read GEMINI_API_KEY (and optional GEMINI_API_URL) from the environment.
- Build a prompt from the incoming payload (name, role, company, skills, optional resumeText).
- If no GEMINI_API_KEY is present, return a simulated response to make local testing easy.
- If a key is present, proxy the request to the configured Gemini-like endpoint.

How to run the server locally
1. cd server
2. npm install
3. Create a .env file (see ../.env.example) and set GEMINI_API_KEY and optionally GEMINI_API_URL
4. npm run start

Notes
- The exact request/response schema for Google Gemini may differ depending on your account and API version. If you get unexpected responses, set GEMINI_API_URL in .env to the correct endpoint for your account and inspect the returned JSON for the correct field to extract the generated text.
