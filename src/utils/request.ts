// import { getToken } from './auth'
import axios from 'axios'
import { requestLogin } from '@/utils/auth'

// 配置 Axios
const instance = axios.create({
  baseURL:
    import.meta.env.MODE === 'dev'
      ? 'https://station.zdwp.tech/api/zdwp-idea'
      : 'https://hh.zdwp.net/api/zdwp-idea', // 替换为你的 API 基础 URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 添加 token 或其他请求头
    const token = localStorage.getItem('IdeaToken') // 假设 token 存储在 storage 中
    if (token && config.url != '/auth/login') {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.status === 401) {
      return requestLogin()
        .then(() => {
          // 刷新 token 后重新发起原请求
          error.config.headers['Authorization'] =
            `Bearer ${localStorage.getItem('IdeaToken')}`
          // 重新发送请求并返回响应
          return axios(error.config).then((res) => {
            return res // 返回重新发起的请求结果
          })
        })
        .catch((loginError) => {
          // 处理登录失败的情况，例如跳转到登录页面
          console.error('Login failed:', loginError)
          return Promise.reject(loginError)
        })
    }
    return Promise.reject(error)
  },
)

// 封装 GET 请求
export const get = (url, params = {}) => {
  return instance.get(url, { params })
}

// 封装 POST 请求
export const post = (url, data = {}, ifFormData = false) => {
  if (ifFormData) {
    const formData = new FormData()
    for (const k in data) {
      formData.append(k, data[k])
    }
    return instance.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
  return instance.post(url, data)
}

export default {
  get,
  post,
}
