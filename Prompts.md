# Prompts and Integration Notes

This file documents the prompt template used in Phase 1 (simulation) and notes for Phase 2 LLM integration.

Simulation template (used in Phase 1 controller):

Dear Hiring Manager at ${company},

My name is ${name} and I am excited to apply for the ${role} position at ${company}. With skills including ${skills}, I am confident I can contribute meaningfully to your team. I look forward to the possibility of discussing how my background aligns with your needs.

Sincerely,
${name}

Phase 2 integration notes:
- Move generation to a server-side endpoint (e.g., /api/generate) to keep API key secret in environment variables.
- Use .env to store API keys and never commit them. Provide .env.example as reference.
- Construct a system + user prompt for the LLM and include resume text when available.
- Return markdown from the LLM and parse into paragraphs on the frontend.

