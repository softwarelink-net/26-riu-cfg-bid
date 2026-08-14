const BASE = ''

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  const token = localStorage.getItem('riu_token')
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json().catch(() => ({ ok: false, error: 'Invalid JSON' }))
  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/api/auth/me'),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  getTender: () => request('/api/tender'),
  getTemplates: () => request('/api/riu/templates'),
  generateRiu: (payload) =>
    request('/api/riu/generate', { method: 'POST', body: JSON.stringify(payload) }),
  verifyRiu: (payload) =>
    request('/api/riu/verify', { method: 'POST', body: JSON.stringify(payload) }),
  getConfigs: () => request('/api/riu/configs'),
  getSystemConfigs: () => request('/api/system/configs'),
  updateSystemConfig: (config_key, config_value) =>
    request('/api/system/configs', {
      method: 'PUT',
      body: JSON.stringify({ config_key, config_value }),
    }),
  getAuditLogs: () => request('/api/audit/logs'),
  health: () => request('/api/health'),
}
