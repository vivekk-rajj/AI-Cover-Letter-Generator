import React, { useState } from 'react'
import GeneratedLetter from './GeneratedLetter'

function simulateGenerateLetter({ name, role, company, skills }){
  // simulated latency
  const template = `Dear Hiring Manager at ${company},\n\nMy name is ${name} and I am excited to apply for the ${role} position at ${company}. With skills including ${skills}, I am confident I can contribute meaningfully to your team. I look forward to the possibility of discussing how my background aligns with your needs.\n\nSincerely,\n${name}`
  return template
}

export default function CoverForm(){
  const [form, setForm] = useState({ name: '', role: '', company: '', skills: '' })
  const [loading, setLoading] = useState(false)
  const [letter, setLetter] = useState('')

  function onChange(e){
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e){
    e.preventDefault()
    setLoading(true)
    setLetter('')
    // simulate latency (like an LLM call)
    await new Promise(r => setTimeout(r, 1200))
    const output = simulateGenerateLetter(form)
    setLetter(output)
    setLoading(false)
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="form">
        <label>
          Candidate Name
          <input name="name" value={form.name} onChange={onChange} required />
        </label>

        <label>
          Job Role
          <input name="role" value={form.role} onChange={onChange} required />
        </label>

        <label>
          Target Company
          <input name="company" value={form.company} onChange={onChange} required />
        </label>

        <label>
          Key Skills (comma separated)
          <input name="skills" value={form.skills} onChange={onChange} placeholder="e.g. React, Node.js, Testing" />
        </label>

        <div className="actions">
          <button type="submit" className="primary">Generate Cover Letter</button>
        </div>
      </form>

      <div className="output">
        {loading ? <p className="loading">Generating...</p> : null}
        <GeneratedLetter text={letter} />
      </div>
    </div>
  )
}
