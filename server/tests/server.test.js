const request = require('supertest')
const app = require('../index')

describe('Server endpoints', () => {
  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health')
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBe('ok')
  })

  test('POST /api/generate returns 400 when missing fields', async () => {
    const res = await request(app).post('/api/generate').send({ name: 'A' })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBeDefined()
  })

  test('POST /api/generate returns simulated when valid fields and no key', async () => {
    const payload = { name: 'Alex', role: 'Engineer', company: 'Acme' }
    const res = await request(app).post('/api/generate').send(payload)
    expect(res.statusCode).toBe(200)
    expect(res.body.simulated).toBe(true)
    expect(res.body.text).toContain('Dear Hiring Manager')
  })

  test('POST /api/extract-resume without file returns 400', async () => {
    const res = await request(app).post('/api/extract-resume')
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBeDefined()
  })
})
