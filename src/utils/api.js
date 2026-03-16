import axios from 'axios'

const api = axios.create({
  baseURL: 'https://lostfound-backend-8u9x.onrender.com',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tb_token')

  // Do not attach token for login/register
  if (
    token &&
    !config.url.includes('/auth/login') &&
    !config.url.includes('/auth/register')
  ) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tb_token')
      localStorage.removeItem('tb_user')
      window.dispatchEvent(new Event('tb:logout'))
    }
    return Promise.reject(error)
  }
)

export default api