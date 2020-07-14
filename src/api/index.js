import { axios } from '@/utils/request'

const ems = '/ems/'

const api = {
  turbineManage: ems + 'emsTurbine'
}

export function getTurbineList(parameter) {  //获取风机列表接口请求
  return axios({
    url: api.turbineManage + '/list',
    method: 'POST',
    params: parameter
  })
}

