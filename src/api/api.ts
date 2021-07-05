import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

import { Tokens, UserInfoContextType } from '../models/UserInfo'
import { get, save } from '../storage/Storage'
import { LoginResponse } from '../models/LoginResponse'

const onRequest = async (
  config: AxiosRequestConfig,
): Promise<AxiosRequestConfig> => {
  const tokens = await get<Tokens>('tokens')
  const auth = tokens ? `Bearer ${tokens.accessToken}` : ''
  config.headers.common['Authorization'] = auth
  config.headers.common['Accept'] = 'application/json'
  config.headers.common['Content-Type'] = 'application/json'
  config.headers.common['Access-Control-Allow-Origin'] = '*'

  console.info(`[request] [${JSON.stringify(config)}]`)
  return config
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  console.error(`[request error] [${JSON.stringify(error)}]`)
  return Promise.reject(error)
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response
}

const onResponseError = async (error: AxiosError): Promise<AxiosError> => {
  console.error(`[response error] [${JSON.stringify(error)}]`)
  const { status, data } = error.response
  const originalRequest = error.request
  if (status === 401 && error.config && !originalRequest._retry) {
    originalRequest._retry = true
    const tokens = await get<Tokens>('tokens')
    if (tokens != null) {
      let res = fetch('http://localhost:4000/api/v1/session/renew', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Authorization: tokens.renewalToken,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res)
          let { access_token, renewal_token } = res.data
          save('tokens', {
            accessToken: access_token,
            renewalToken: renewal_token,
          })
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`

          const axiosInstance = instance()

          return axiosInstance(originalRequest)
        })

      Promise.resolve(res)
    } else {
      return Promise.reject(error)
    }
  }

  return Promise.reject(error)
}

const instance = () => {
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000/api/v1',
    timeout: 15000,
  })

  axiosInstance.interceptors.request.use(onRequest, onRequestError)
  axiosInstance.interceptors.response.use(onResponse, onResponseError)

  return axiosInstance
}

const responseBody = (response: AxiosResponse) => response.data

const requests = {
  get: (url: string) => instance().get(url).then(responseBody),
  post: (url: string, body: {}) =>
    instance().post(url, body).then(responseBody),
  //   put: (url: string, body: {}) => instance().put(url, body).then(responseBody),
  //   delete: (url: string) => instance().delete(url).then(responseBody),
}

export const LoginApi = {
  tryLogin: (email1: string, password1: string): Promise<LoginResponse> => {
    return requests.post('session', {
      user: { email: email1, password: password1 },
    })
  },
  // getPosts: (): Promise<PostType[]> => requests.get('posts'),
  // getAPost: (id: number): Promise<PostType> => requests.get(`posts/${id}`),
  // createPost: (post: PostType): Promise<PostType> =>
  // 	requests.post('posts', post),
  // updatePost: (post: PostType, id: number) =>
  // 	requests.put(`posts/${id}`, post),
  // deletePost: (id: number): Promise<void> => requests.delete(`posts/${id}`),
}
