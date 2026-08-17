require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fetch = (...args) => import('node-fetch').then(({default:fetch})=>fetch(...args))
const pdfParse = require('pdf-parse')
const multer = require('multer')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const Joi = require('joi')

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

const PORT = process.env.PORT || 5178

// Basic rate limiter
const limiter = rateLimit({ windowMs: 60 * 1000, max: 30 }) // 30 requests per minute
app.use(limiter)

const generateSchema = Joi.object({
  name: Joi.string().min(1).required(),
  role: Joi.string().min(1).required(),
  company: Joi.string().min(1).required(),
  skills: Joi.string().allow('', null),
  resumeText: Joi.string().allow('', null)
})

function buildPrompt({ name, role, company, skills, resumeText }){
  let prompt = `Dear Hiring Manager at ${company},\n\nMy name is ${name} and I am excited to apply for the ${role} position at ${company}. With skills including ${skills || 'relevant technologies'}, I am confident I can contribute meaningfully to your team.`
  if(resumeText){
    prompt += `\n\nResume excerpt:\n${resumeText}`
  }
  prompt += `\n\nPlease produce a professional, concise, and personalized cover letter in markdown format that is suitable to send in an email. Keep it to 3-5 short paragraphs.`
  return prompt
}

app.post('/api/extract-resume', upload.single('resume'), async (req, res) => {
  try{
    if(!req.file) return res.status(400).json({ error: 'No file uploaded' })
    const buffer = req.file.buffer
    const data = await pdfParse(buffer)
    const text = (data && data.text) ? data.text.trim() : ''
    return res.json({ text })
  }catch(err){
    console.error('Resume extraction failed', err)
    return res.status(500).json({ error: 'Resume extraction failed', details: err.message })
  }
})

app.post('/api/generate', async (req, res) => {
  const validation = generateSchema.validate(req.body)
  if(validation.error) return res.status(400).json({ error: validation.error.details.map(d=>d.message).join(', ') })

  const { name, role, company, skills, resumeText } = validation.value
  const prompt = buildPrompt({ name, role, company, skills, resumeText })

  // If no GEMINI_API_KEY is set, return a simulated response (safe for local dev)
  if(!process.env.GEMINI_API_KEY){
    const simulated = `Dear Hiring Manager at ${company},\n\nMy name is ${name} and I am excited to apply for the ${role} position at ${company}. With skills including ${skills || 'relevant technologies'}, I am confident I can contribute meaningfully to your team.\n\nSincerely,\n${name}`
    return res.json({ text: simulated, simulated: true })
  }

  try{
    const apiUrl = process.env.GEMINI_API_URL || 'https://generative.googleapis.com/v1beta2/models/text-bison-001:generate'

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
      text = JSON.stringify(data)
    }

    return res.json({ text, simulated: false })
  }catch(err){
    console.error('LLM call failed', err)
    return res.status(500).json({ error: 'LLM request failed', details: err.message })
  }
})

app.get('/health', (req, res) => res.json({ status: 'ok' }))

if(require.main === module){
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT} — POST /api/generate`)
  })
}

module.exports = app
