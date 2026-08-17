require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fetch = (...args) => import('node-fetch').then(({default:fetch})=>fetch(...args))

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5178

function buildPrompt({ name, role, company, skills, resumeText }){
  let prompt = `Dear Hiring Manager at ${company},\n\nMy name is ${name} and I am excited to apply for the ${role} position at ${company}. With skills including ${skills}, I am confident I can contribute meaningfully to your team.`
  if(resumeText){
    prompt += `\n\nResume excerpt:\n${resumeText}`
  }
  prompt += `\n\nPlease produce a professional, concise, and personalized cover letter in markdown format that is suitable to send in an email. Keep it to 3-5 short paragraphs.`
  return prompt
}

app.post('/api/generate', async (req, res) => {
  const { name, role, company, skills, resumeText } = req.body || {}
  if(!name || !role || !company){
    return res.status(400).json({ error: 'Missing required fields: name, role, company' })
  }

  const prompt = buildPrompt({ name, role, company, skills, resumeText })

  // If no GEMINI_API_KEY is set, return a simulated response (safe for local dev)
  if(!process.env.GEMINI_API_KEY){
    const simulated = `Dear Hiring Manager at ${company},\n\nMy name is ${name} and I am excited to apply for the ${role} position at ${company}. With skills including ${skills}, I am confident I can contribute meaningfully to your team.\n\nSincerely,\n${name}`
    return res.json({ text: simulated, simulated: true })
  }

  try{
    // Default Gemini-like endpoint. You can override with GEMINI_API_URL in .env if your provider requires a different path.
    const apiUrl = process.env.GEMINI_API_URL || 'https://generative.googleapis.com/v1beta2/models/text-bison-001:generate'

    // Body shape below is a conservative, minimal one. You may need to adjust the shape to match your Gemini version.
    const body = {
      prompt: {
        text: prompt
      },
      temperature: 0.2,
      maxOutputTokens: 512
    }

    const r = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify(body)
    })

    const data = await r.json()
    // Attempt to extract a reasonable text field from common response shapes
    let text = null
    if(data?.candidates && data.candidates[0]){
      text = data.candidates[0].output || data.candidates[0].content || JSON.stringify(data.candidates[0])
    } else if(data?.output?.[0]?.content){
      text = data.output[0].content
    } else if(typeof data?.text === 'string'){
      text = data.text
    } else if(typeof data?.output_text === 'string'){
      text = data.output_text
    } else {
      // fallback: stringify the response (useful for debugging)
      text = JSON.stringify(data)
    }

    return res.json({ text, simulated: false })
  }catch(err){
    console.error('LLM call failed', err)
    return res.status(500).json({ error: 'LLM request failed', details: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT} — POST /api/generate`)
})
