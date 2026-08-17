import React, { useState } from 'react'
import GeneratedLetter from './GeneratedLetter'

export default function CoverForm(){
  const [form, setForm] = useState({ name: '', role: '', company: '', skills: '' })
  const [loading, setLoading] = useState(false)
  const [letter, setLetter] = useState('')
  const [error, setError] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [uploading, setUploading] = useState(false)

  function onChange(e){
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function uploadResume(file){
    if(!file) return
    setUploading(true)
    setError(null)
    try{
      const fd = new FormData()
      fd.append('resume', file)
      const resp = await fetch('/api/extract-resume', {
        method: 'POST',
        body: fd
      })
      const data = await resp.json()
      if(!resp.ok){
        setError(data.error || 'Failed to extract resume')
      } else {
        setResumeText(data.text || '')
      }
    }catch(err){
      setError(err.message)
    }finally{
      setUploading(false)
    }
  }

  async function onSubmit(e){
    e.preventDefault()
    setLoading(true)
    setLetter('')
    setError(null)

    const payload = { ...form, resumeText }

    try{
      const resp = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await resp.json()
      if(!resp.ok){
        setError(data.error || 'Generation failed')
      } else {
        setLetter(data.text || '')
      }
    }catch(err){
      setError(err.message)
    }finally{
      setLoading(false)
    }
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

        <label>
          Upload Resume (PDF)
          <input type="file" accept="application/pdf" onChange={(e)=>uploadResume(e.target.files[0])} />
        </label>
        {uploading ? <p className="loading">Extracting resume...</p> : null}
        {resumeText ? <details style={{ marginTop: 8 }}><summary>Preview extracted resume text</summary><pre style={{ whiteSpace: 'pre-wrap' }}>{resumeText.slice(0, 1000)}</pre></details> : null}

        <div className="actions">
          <button type="submit" className="primary" disabled={loading || uploading}>Generate Cover Letter</button>
        </div>
      </form>

      <div className="output">
        {loading ? <p className="loading">Generating...</p> : null}
        {error ? <p style={{ color: 'red' }}>{error}</p> : null}
        <GeneratedLetter text={letter} />
      </div>
    </div>
  )
}
