export const state = () => ({
  logged: false,
  cerrar: false,
  user: {
    id: 0,
    email: '',
    accounts: [],
    role: 'user'
  },
  alertalks: false,
  refresh: '',
  death_date: '',
  userPermissions: {}
})

export const mutations = {
  loginAction (state, payload) {
    state.logged = true
    state.cerrar = true
    state.close = true
    state.alertalks = true
    state.user = payload
    state.token = state.user.token.access
    state.refresh = state.user.token.refresh
    state.death_date = state.user.token.death_date
  },
  loginRecuer (state, payload) {
    state.email_recuer = payload.key1
    state.password_recuer = payload.key2
    state.recuerdame = true
  },
  InloginRecuer (state) {
    state.email_recuer = ''
    state.password_recuer = ''
    state.recuerdame = false
  },
  logout (state) {
    state.logged = false
    state.refresh = ''
    state.token = ''
    state.user = {
      id: 0,
      email: '',
      accounts: []
    }
  },
  cerrarreload (state) {
    state.cerrar = false
  },
  setUserPermissions (state, payload) {
    state.userPermissions = payload
  },
  CloseOut (state) {
    state.close = false
  },
  CloseIn (state) {
    state.close = true
  },
  AlertTalks (state) {
    state.alertalks = false
  },
  UPLOAD_TOKEN (state, token) {
    state.token = token
  }
}
export const actions = {
  async getUserPermissions ({ state, commit }) {
    try {
      const { data } = await this.$simpleeApi.get(`/permission/?user=${state.user.id}`)
      commit('setUserPermissions', data.results[0])
    } catch (error) {
      commit('setAlertMessage', error.response.data)
    }
  }
}
