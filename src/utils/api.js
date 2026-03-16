import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://lostfound-backend-8u9x.onrender.com'

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30s - Render free tier spins down, needs time to wake
  withCredentials: false, // must be false when using Authorization header
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