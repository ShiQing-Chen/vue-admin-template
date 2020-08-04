import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { loginText, loginPass } = userInfo
    return new Promise((resolve, reject) => {
      login({ loginText: loginText.trim(), loginPass: loginPass }).then(res => {
        if (res.success) {
          const {data} = res
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          setRefreshToken(data.refreshToken)
          resolve()
        } else {
          reject(res.message)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const {realName, avatar, roles} = data
        const roleCodes = ['admin']
        data.roles = roleCodes
        // roles must be a non-empty array
        if (!roleCodes || roleCodes.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', roleCodes)
        commit('SET_NAME', realName)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        commit('SET_NAME', '')
        commit('SET_ROLES', [])
        resetRouter()
        resolve()
      }).catch(error => {
        commit('SET_TOKEN', '')
        removeToken()
        commit('SET_NAME', '')
        commit('SET_ROLES', [])
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_NAME', '')
      commit('SET_ROLES', [])
      removeToken() // must remove  token  first
      removeRefreshToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

