const defaullFilters = {
  id: null,
  email: 'General',
  search: '',
  optionDate: '',
  date_type: 'created_at',
  mes_termino_vigencia: null,
  tipo_pago: [],
  startDate: null,
  endDate: null,
  start: null,
  end: null,
  emitedStartDate: null,
  campaign_slugs: [],
  emitedEndDate: null,
  range: null,
  refferal: null,
  channel: [],
  states: [],
  tags: [],
  products: [],
  partnership: [],
  companies: [],
  priorities: [],
  priorities_scores: null,
  searchbusqueda: null,
  product_interest: [],
  request_type: [],
  nro_policy: '',
  state: null,
  statePay: 'PENDING',
  statePay: [],
  bitacora_status: [],
  type_proposal: null,
  product_type: [],
  paid: null,
  selectedDateFilter: 'emited',
  product_group: [],
  channelDashboard: 'Todos',
  tipoVentaDashboard: 'Todas'

}

export const state = () => ({
  nextId: 0,
  leadsFilters: { ...defaullFilters },
  leadsFilterssave: {},
  filterpay: false,
  notifications: [],
  notificationsCount: 0,
  unseenNotificationsCount: 0,
  leadFromSocket: null,
  alertMessage: null,
  error: false,
  filtersselect: [],
  refreshingLeads: false
})

export const mutations = {
  setAlertMessage (state, payload) {
    console.log(payload)
    if (payload) {
      const data = Object.values(payload)[0]
      state.error = Object.keys(payload)[0] !== 'success'
      if (typeof data === 'string') {
        state.alertMessage = data
      } else {
        if (data.length === 1) {
          state.alertMessage = data[0]
          return
        }
        state.alertMessage = data.map((obj) => {
          const val = Object.keys(obj)
          return obj[val] && `${val}: ${obj[val]}`
        })
      }
      return
    }
    state.alertMessage = null
  },
  setFiltersPay (state, value) {
    state.filterpay = value
  },
  setSearchBusqueda (state, value) {
    state.searchbusqueda = value
  },
  setFiltersselectold (state, payload) {
    if (payload) {
      state.leadsFilterssave = payload
    } else {
      state.leadsFilterssave = []
    }
  },
  setFiltersselect (state, payload) {
    if (payload) {
      state.filtersselect = payload
    } else {
      state.filtersselect = []
    }
  },
  setNotificationsCount: (state, count) => {
    state.notificationsCount = count
  },
  setUnseenNotificationsCount: (state, count) => {
    state.unseenNotificationsCount = count
  },
  deleteNotifications: (state) => {
    state.notifications = []
  },
  seenNotification (state, id) {
    state.notifications.forEach((n) => {
      if (n.id_notification === id) {
        n.seen = true
        state.unseenNotificationsCount -= 1
      }
    })
  },
  addNotifications (state, payload) {
    state.notifications = payload.map((n, i) => {
      this.commit('ModNextID', i)
      let message
      if (n.type === 'new_lead') {
        message = 'Ha llegado un lead'
      }
      if (n.type === 'lead_asigned') {
        message = 'Te han asignado un lead'
      }
      return {
        id: i,
        id_notification: n.id,
        message: message ?? n.message,
        type: n.type,
        data: n.data,
        seen: n.seen,
        date: n.created_date
      }
    })
  },
  resetFilters (state) {
    state.leadsFilters = { ...defaullFilters }
  },
  deleteUserInfo (state) {
    state.notifications = []
    state.leadsFilters = { ...defaullFilters }
  },
  setFilters: (state, payload) => {
    state.leadsFilters = Object.assign({}, payload)
  },
  ModNextID: (state, count) => {
    state.nextId = state.nextId + count
  },
  setReloading: (state, payload) => {
    state.refreshingLeads = payload
  },
  SOCKET_ONMESSAGE (state, notifications) {
    console.log(state.localStorage.user.id)
    console.log(notifications.to_user)
    console.log(notifications.type)
    if (state.localStorage.user.id === notifications.to_user) {
      state.nextId = state.nextId + 1
      if (
        notifications.type === 'new_lead_request' ||
        notifications.type === 'lead_request_assigned' ||
        notifications.type === 'reminder'
      ) {
        console.log('entre')
        state.notifications = [
          {
            id_notification: notifications.id,
            id: state.nextId,
            message: notifications.message,
            data: notifications.data,
            seen: notifications.seen,
            date: new Date(notifications.created_date)
          },
          ...state.notifications
        ]
        if (state.notifications.length > 5) {
          state.notifications.pop()
        }
      }
      if (
        notifications.type === 'new_lead_request' ||
        notifications.type === 'lead_request_assigned' ||
        notifications.type === 'reminder'
      ) {
        state.leadFromSocket = notifications.data.lead_request
        state.unseenNotificationsCount += 1
      }
    }
  }
}

export const getters = {
  unreadNotifications ({ notifications }) {
    return notifications.filter(({ seen }) => !seen)
  }
}

export const actions = {
  async nuxtServerInit ({ commit, dispatch, state }) {
    try {
      const deathDateStr = state.localStorage.death_date
      if (deathDateStr) {
        const deathDate = new Date(deathDateStr)
        const currentDate = new Date()
        // Calcular la diferencia en milisegundos
        const diffInMs = currentDate - deathDate
        // Convertir la diferencia a horas
        const diffInHours = diffInMs / (1000 * 60 * 60)

        if (diffInHours >= 12) {
          await dispatch('getPartners')
          await dispatch('getRefferals')
          await dispatch('leads/getUsers')
          await dispatch('leads/getChannels')
          await dispatch('leads/getCampanas')
          await dispatch('getEtiquetas')
        } else {
          return
        }
      } else {
        await dispatch('getPartners')
        await dispatch('getRefferals')
        await dispatch('leads/getUsers')
        await dispatch('leads/getChannels')
        await dispatch('leads/getCampanas')
        await dispatch('getEtiquetas')
      }
    } catch (error) {
      commit('setAlertMessage', { error: 'Ha ocurrido un error' })
    }
  },
  async getEtiquetas ({ commit }) {
    try {
      const {
        data: { results, count }
      } = await this.$simpleeApi.get('/tags/')
      let tags = results
      const pages = Math.ceil(count / 25)
      if (pages > 1) {
        await Promise.all(
          getRange(2, pages).map(async (page) => {
            const {
              data: { results }
            } = await this.$simpleeApi.get(`/tags/?page=${page}`)
            tags = [...tags, ...results]
          })
        )
      }
      commit('leads/setEtiquetas', [...new Set(tags)])
    } catch (error) {
      commit('setAlertMessage', { error: 'Ha ocurrido un error' })
    }
  },
  async getPartners ({ commit }) {
    try {
      const {
        data: { results, count }
      } = await this.$simpleeApi.get('/partnership/')
      let partnership = results
      const pages = Math.ceil(count / 25)
      if (pages > 1) {
        await Promise.all(
          getRange(2, pages).map(async (page) => {
            const {
              data: { results }
            } = await this.$simpleeApi.get(`/partnership/?page=${page}`)
            partnership = [...partnership, ...results]
          })
        )
      }
      commit('leads/setPartners', [...new Set(partnership)])
    } catch (error) {
      commit('setAlertMessage', { error: 'Ha ocurrido un error' })
    }
  },
  async getRefferals ({ commit }) {
    try {
      const {
        data: { results, count }
      } = await this.$simpleeApi.get('/reffered/')
      let refferals = results
      const pages = Math.ceil(count / 25)
      if (pages > 1) {
        await Promise.all(
          getRange(2, pages).map(async (page) => {
            const {
              data: { results }
            } = await this.$simpleeApi.get(`/reffered/?page=${page}`)
            refferals = [...refferals, ...results]
          })
        )
      }
      commit('leads/setRefferals', [...new Set(refferals)])
    } catch (error) {
      commit('setAlertMessage', { error: 'Ha ocurrido un error' })
    }
  },
  async deleteRequest ({ commit }, { id }) {
    try {
      await this.$simpleeApi.delete(`/request/${id}/`)
    } catch (error) {
      console.log({ error })
      commit('setAlertMessage', error.response.data)
    }
  },
  async DeleteClient ({ commit }, { id }) {
    try {
      await this.$simpleeApi.delete(`/lead/${id}/`)
    } catch (error) {
      console.log({ error })
      commit('setAlertMessage', error.response.data)
    }
  },
  async DeleteProduct ({ commit }, { id }) {
    try {
      await this.$simpleeApi.delete(`/product/${id}/`)
    } catch (error) {
      console.log({ error })
      commit('setAlertMessage', error.response.data)
    }
  },
  async getAllNotifications ({ commit }, { unseenOnly = true, page = 1 }) {
    try {
      const { data } = await this.$simpleeApi.get(
        unseenOnly
          ? `/notification/?state=unseen&page=${page}`
          : `/notification/?page=${page}`
      )
      if (unseenOnly) {
        commit('setUnseenNotificationsCount', data.count)
      }
      commit('setNotificationsCount', data.count)
      commit('addNotifications', data.results)
    } catch (error) {
      commit('setAlertMessage', { error })
    }
  },
  async getAllPolizasInError ({ commit, state }, { }) {
    let valor = false
    while (valor === false) {
      console.log('jejeje aquii', valor)
      const user = state.localStorage.user.id
      // const user = null
      const params = {
        user,
        inerror: true
      }
      try {
        const {
          data: { count }
        } = await this.$simpleeApi.get('/product/', { params })
        commit('setPolizaError', count)
        valor = true
      } catch (error) {
        // store.commit('setAlertMessage', error.response.data)
      }
    }
  },
  async getCsvLeads ({ commit }, { urlParams, paramsone, timezone }) {
    if (paramsone === 'clientes') {
      urlParams.clientes = true
    } else {
      urlParams.no_products = true
    }
    urlParams.timezone = timezone
    const data = await this.$simpleeApi.get('/export_csv/', {
      params: urlParams
    })
    console.log(data)
    commit('setAlertMessage', { success: 'El CSV fue enviado a su correo' })
  },
  async getCsvRequest ({ commit }, { urlParams, timezone }) {
    urlParams.timezone = timezone
    try {
      const data = await this.$simpleeApi.get('/request_export_csv/', {
        params: urlParams
      })
      console.log(data)
      commit('setAlertMessage', { success: 'El CSV fue enviado a su correo' })
    } catch (error) {
      commit('setAlertMessage', { error })
    }
  },
  async deleteAllNotifications ({ commit }) {
    try {
      await this.$simpleeApi.put('/read_all_notifications/')
      commit('deleteNotifications')
      commit('setUnseenNotificationsCount', 0)
    } catch (error) {
      console.log(error)
      // commit('setAlertMessage', { error })
    }
  },
  LogoutSession ({ commit }) {
    return new Promise((resolve, reject) => {
      try {
        console.log('LogoutSession entra')
        commit('localStorage/logout')
        commit('localStorage/CloseOut')
        commit('deleteUserInfo')
        resolve() // Resuelve la promesa después de completar las acciones
      } catch (error) {
        reject(error) // Rechaza la promesa si ocurre un error
      }
    })
  }
}

function getRange (start, end) {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx)
}
