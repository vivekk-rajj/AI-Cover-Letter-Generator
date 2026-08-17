import React from 'react'

export default function GeneratedLetter({ text }){
  async function copy(){
    if(!text) return
    try{
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard')
    }catch(err){
      alert('Copy failed: ' + err.message)
    }
  }

  if(!text) return null

  // render paragraphs by splitting on double newlines
  const paragraphs = text.split('\n\n')

  return (
    <div className="card">
      <div className="card-header">
        <h3>Generated Cover Letter</h3>
        <button onClick={copy}>Copy to Clipboard</button>
      </div>
      <div className="card-body">
        {paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>
    </div>
  )
}
