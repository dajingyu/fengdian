import { axios } from '@/utils/request'

const auth = '/auth/'

/** login 只有登录登出接口带 auth **/
export function login (parameter) {
  return axios({
    url: auth + 'wflogin',
    method: 'post',
    params: parameter
  })
}
export function logout (token) {
  return axios({
    url: auth + 'logout',
    method: 'post'
  })
}