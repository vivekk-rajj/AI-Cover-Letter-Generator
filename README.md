# AI Cover Letter Generator

Phase 1: Base MVP & Data Simulation for the AI Cover Letter Generator sprint.

This small Vite + React app provides a form to capture Candidate Name, Job Role, Target Company, and Key Skills, simulates generating a cover letter by interpolating these values into a template string, and renders the result with a Copy to Clipboard button.

How to run locally:

1. npm install
2. npm run dev
3. Open http://localhost:5173

Files added for Phase 1:
- src/App.jsx
- src/main.jsx
- src/components/Form.jsx
- src/components/GeneratedLetter.jsx
- index.html
- styles.css

Security:
- .env is in .gitignore. Use .env.example to document required variables.

Next steps for Phase 2:
- Implement a server-side endpoint to call Google Gemini / OpenAI using API keys stored in .env
- Replace simulateGenerateLetter with a network call and show a proper "Generating..." state

