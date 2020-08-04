import Cookies from 'js-cookie'

const TokenKey = 'vue_token'
const RefreshToken = 'refresh_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setRefreshToken(refreshToken) {
  return Cookies.set(RefreshToken, refreshToken)
}
export function getRefreshToken() {
  return Cookies.get(RefreshToken)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshToken)
}
