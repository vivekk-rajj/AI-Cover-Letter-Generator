# Server (Phase 2 + Resume Parsing + Hardening)

This folder contains an Express server that provides:

- POST /api/extract-resume — Accepts a file upload (multipart/form-data, field name `resume`) and returns extracted text using pdf-parse.
- POST /api/generate — Accepts JSON { name, role, company, skills, resumeText } and returns a simulated or real Gemini response.

Added hardening
- Input validation using Joi
- Rate limiting via express-rate-limit
- Request logging via morgan

How to run locally
1. cd server
2. npm install
3. Create a .env file (or use top-level .env) and set GEMINI_API_KEY and optionally GEMINI_API_URL
4. npm run start

Dev & tests
- npm run dev (nodemon)
- npm test (runs Jest + supertest)

Notes
- The server returns a simulated response if GEMINI_API_KEY is missing to make local testing easy and safe.
- Resume uploads are kept in memory with a 5 MB limit by default. Adjust multer settings if needed.
