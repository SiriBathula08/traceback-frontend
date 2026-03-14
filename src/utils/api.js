import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tb_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}, Promise.reject)

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tb_token')
      localStorage.removeItem('tb_user')
      window.dispatchEvent(new Event('tb:logout'))
    }
    return Promise.reject(err)
  }
)

export default api
