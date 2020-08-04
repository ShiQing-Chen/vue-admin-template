import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, getRefreshToken, setToken } from '@/utils/auth'

// 创建axios 实例对象
const baseUrl = process.env.VUE_APP_BASE_API

// create an axios instance
const service = axios.create({
  baseURL: baseUrl, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    return response.data
  },
  error => {
    if (error.response.status === 401) {
      return refreshToken(error)
    } else {
      // console.log('err' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

// 刷新token
function refreshToken(error) {
  // return Promise.reject(error)
  return axios.post(baseUrl +'/api/refreshToken', {
    refreshToken: getRefreshToken()
  }).then(response => {
    if (response.status === 200 && !response.data.success) {
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
    } else {
      setToken(response.data.data)
      // 重新请求
      console.log('%c刷新token 成功，正在重新请求', 'background:green;')
      error.config.headers['Authorization'] = getToken()
      return axios.request(error.config).then(res => {
        return res.data
      })
    }
  }).catch(function(error) {
    return Promise.reject(error)
  })
}

export default service
