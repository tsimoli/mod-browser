import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

import {Tokens } from '../models/UserInfo'
import { get, save } from '../storage/Storage'
import { LoginResponse } from '../models/LoginResponse'
import { ModModel } from '../models/Mod'

const config = {
  baseURL: 'http://localhost:4000/api/v1',
  timeout: 15000,
}

const onRequest = async (
  config: AxiosRequestConfig,
): Promise<AxiosRequestConfig> => {
  const tokens = await get<Tokens>('tokens')
  const auth = tokens ? `${tokens.access_token}` : ''
  config.headers.common['Authorization'] = auth
  config.headers.common['Accept'] = 'application/json'
  config.headers.common['Content-Type'] = 'application/json'
  config.headers.common['Access-Control-Allow-Origin'] = '*'

  return config
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  console.error(`[request error] [${JSON.stringify(error)}]`)
  return Promise.reject(error)
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response
}

const onResponseError = async (error: AxiosError) => {
  const originalRequest = error.config
  if (
    error.response &&
    error.response.status === 401 &&
    error.config &&
    !error.request._retry
  ) {
    error.request._retry = true
    const tokens = await get<Tokens>('tokens')
    if (tokens != null) {
      const axiosInstance = axios.create(config)
      let res = axiosInstance
        .post(
          'session/renew',
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: tokens.renewal_token,
            },
          },
        )
        .then((res) => {
          let { access_token, renewal_token } = res.data.data
          save('tokens', {
            access_token: access_token,
            renewal_token: renewal_token,
          })
          originalRequest.headers['Authorization'] = `${access_token}`

          return axiosInstance(originalRequest)
        })

      return res
    } else {
      return Promise.reject(error)
    }
  }

  return Promise.reject(error)
}

const instance = () => {
  const axiosInstance = axios.create(config)

  axiosInstance.interceptors.request.use(onRequest, onRequestError)
  axiosInstance.interceptors.response.use(onResponse, onResponseError)

  return axiosInstance
}

const responseBody = (response: AxiosResponse) => response.data

const requests = {
  get: (url: string) => instance().get(url),
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

export const ModApi = {
  getDailyMod: (): any => {
    return requests.get('mods/daily')
  },
  getDailyGuestMod: (): any => {
    return requests.get('guest/mods/daily')
  },
  // getPosts: (): Promise<PostType[]> => requests.get('posts'),
  // getAPost: (id: number): Promise<PostType> => requests.get(`posts/${id}`),
  // createPost: (post: PostType): Promise<PostType> =>
  // 	requests.post('posts', post),
  // updatePost: (post: PostType, id: number) =>
  // 	requests.put(`posts/${id}`, post),
  // deletePost: (id: number): Promise<void> => requests.delete(`posts/${id}`),
}
