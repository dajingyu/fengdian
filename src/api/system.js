import { axios } from '@/utils/request'

const sys = '/sys/'

const api = {
  user: sys + 'user',
  company: sys + 'company',
  role: sys + 'role',
  module: sys + 'module',
  rolePermission: sys + 'roleMenu'
}

/** menu
 * 获取后端路由信息的 axios API
 * @returns {Promise}
 */
export function getRouterByUser(parameter) {
  return axios({
    url: api.user + '/menu',
    method: 'get',
    params: parameter
  })
}

export function getInfo (parameter) {
  return axios({
    url: api.user + '/info',
    method: 'get',
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

//turbine
export function saveTurbineParam(parameter) {
  return axios({
    url: api.turbineManage + '/updateByCode',
    method: 'POST',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// user
export function getUserList(parameter) {
  return axios({
    url: api.user + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveUser(parameter) {
  return axios({
    // url: api.user + (parameter.userId > 0 ? '/update' : '/save'),
    url: api.user + '/saveUser',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// dictType
export function getDictTypeList(parameter) {
  return axios({
    url: api.dictType + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveDictType(parameter) {
  return axios({
    url: api.dictType + '/save',
    method: 'post',
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delDictType(parameter) {
  return axios({
    url: api.dictType + '/deleteBatchList',
    method: 'post',
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
