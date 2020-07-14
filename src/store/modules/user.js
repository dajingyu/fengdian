import Vue from 'vue'
import { login , logout } from '@/api/login'
import { getInfo } from '@/api/system'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    userId: '',
    token: '',
    name: '',
    deptName: '',
    phonenumner: '',
    email: '',
    loginName: '',
    welcome: '',
    avatar: '',
    roles: [],
    buttons: [], // 按钮权限
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_DEPTNAME: (state, deptName) => {
      state.deptName = deptName
    },
    SET_PHONENUMNER: (state, phonenumner) => {
      state.phonenumner = phonenumner
    },
    SET_EMAIL: (state, EMAIL) => {
      state.EMAIL = EMAIL
    },
    SET_LOGINNAME: (state, loginName) => {
      state.loginName = loginName
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_BUTTONS: (state, buttons) => {
      state.buttons = buttons
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          console.log('login response:', response)
          const result = response.data
          Vue.ls.set(ACCESS_TOKEN, result.token, result.expire)
          commit('SET_TOKEN', result.token)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        const loginParams = {}
        loginParams.wfCode = 'F040'
        getInfo(loginParams).then(response => {
          const result = response.data
          console.log(result)
          if (result.roleIds) {
            commit('SET_ROLES', result.roleIds)
            commit('SET_BUTTONS', result.buttons)
            commit('SET_USERID', result.userId)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
          commit('SET_DEPTNAME', result.dept.deptName)
          commit('SET_PHONENUMNER', result.phonenumner)
          commit('SET_EMAIL', result.email)
          commit('SET_LOGINNAME', result.loginName)
          commit('SET_NAME', { name: result.userName, welcome: welcome() })
          commit('SET_AVATAR', result.avatar || '/default.png')
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_INFO', {})
          Vue.ls.remove(ACCESS_TOKEN)
        })
      })
    }

  }
}

export default user
