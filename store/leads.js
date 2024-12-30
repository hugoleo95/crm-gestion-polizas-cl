/* eslint-disable camelcase */

export const state = () => ({
  items: [],
  page: 1,
  search: null,
  pages: 1,
  startTime: new Date().getTime(),
  endTime: new Date().getTime(),
  users: [],
  userskam: [],
  refferals: [],
  partners: [],
  etiquetas: [],
  polizaerror: null,
  channels: [],
  channels2: [],
  campanas: [],
  leadsCsv: [],
  alertMessagelead: null,
  leadsCsvProgress: 0,
  loadingLeads: false,
  loadingContacts: false,
  loadingProducts: false,
  loadingCsv: false,
  selectedClients: [],
  selectedClientsFinish: {
    name: '',
    last_name: '',
    rut: '',
    razon_social: '',
    giro: '',
    person: '',
    email: '',
    phone: '',
    address: '',
    comuna: '',
    user: ''
  }
})

export const mutations = {
  setAlertMessage (state, payload) {
    state.alertMessagelead = null
    if (payload) {
      const data = Object.values(payload)[0]
      state.error = Object.keys(payload)[0] !== 'success'
      if (typeof data === 'string') {
        state.alertMessagelead = data
      } else {
        if (data.length === 1) {
          state.alertMessagelead = data[0]
          return
        }
        state.alertMessagelead = data.map((obj) => {
          const val = Object.keys(obj)
          return obj[val] && `${val}: ${obj[val]}`
        })
      }
      return
    }
    state.alertMessagelead = null
  },
  deletestatemessage (state, payload) {
    state.alertMessagelead = payload
  },
  setLeads (state, payload) {
    state.items = payload
  },
  setPages (state, payload) {
    state.pages = payload
  },
  setUsersalls (state, users) {
    state.userskams = users
  },
  setUsers (state, users) {
    state.users = users
  },
  setUsersalls (state, users) {
    state.userskam = users
  },
  setPage (state, page) {
    state.page = page
  },
  updateLead (state, lead) {
    const foundIndex = state.items.findIndex(element => element.id === lead.id)
    if (foundIndex > -1) {
      state.items.splice(foundIndex, 1, lead)
    } else {
      state.items.unshift(lead)
    }
  },
  deleteLead (state, lead) {
    const newLeads = state.items.filter(({ id }) => lead.id !== id)
    state.items = newLeads
  },
  setRefferals (state, refferals) {
    state.refferals = refferals
  },
  setPartners (state, partners) {
    state.partners = partners
  },
  setEtiquetas (state, etiquetas) {
    state.etiquetas = etiquetas
  },
  setPolizaError (state, polizaerror) {
    state.polizaerror = polizaerror
  },
  setChannels (state, channels) {
    state.channels = channels
  },
  setChannels2 (state, channels2) {
    state.channels2 = channels2
  },
  setCampanas (state, campanas) {
    state.campanas = campanas
  },
  setLoadingLeads: (state, payload) => {
    state.loadingLeads = payload
  },
  setLoadingContacts: (state, payload) => {
    state.loadingContacts = payload
  },
  setLoadingProducts: (state, payload) => {
    state.loadingProducts = payload
  },
  setLoadingCsvLeads (state, bool) {
    state.loadingCsv = bool
  },
  setLeadsCsvProgress (state, percentage) {
    state.leadsCsvProgress += percentage
  },
  setLeadsCsv (state, payload) {
    state.leadsCsv = payload
  },
  clearCsvInfo (state) {
    state.leadsCsv = []
    state.leadsCsvProgress = 0
  },
  onselectedClients (state, payload) {
    state.selectedClients = payload
    // try {
    //   state.selectedClients = payload.map(({ name }) => name)
    // } catch (error) {
    //   console.log(error)
    // }
  },
  onselectedClientsFinish (state, payload) {
    state.selectedClientsFinish = payload
    // try {
    //   state.selectedClients = payload.map(({ name }) => name)
    // } catch (error) {
    //   console.log(error)
    // }
  }
}

export const getters = {
  leadsByDate ({ items, startTime, endTime }) {
    return items.filter(({ created_at }) => {
      const created = new Date(created_at).getTime()
      return created >= startTime && created <= endTime
    })
  },
  leadsByExecutive ({ executiveSearch, items }) {
    let leads = items
    if (executiveSearch) {
      leads = items.filter(({ user }) => user === executiveSearch.id)
    }
    return leads
  },
  filterLeads ({ executiveSearch }, { leadsByDate }) {
    let leads = leadsByDate
    if (executiveSearch) {
      leads = leadsByDate.filter(({ user }) => user === executiveSearch.id)
    }
    return leads
  },
  total (_state, { filterLeads }) {
    return filterLeads.length
  },
  products ({ endTime, startTime }, { leadsByExecutive }) {
    const filterRange = ({ created_at, emited_date }) => {
      const date = emited_date || created_at
      const created = new Date(date).getTime()
      return created >= startTime && created <= endTime
    }
    const withProducts = leadsByExecutive.filter(
      ({ state }) => state === 'cliente_cerrado'
    )
    const products = withProducts.map(({ products }) => products).flat()

    return products.filter(filterRange)
  },
  documents (_state, { filterLeads }) {
    const withProducts = filterLeads.filter(
      ({ state }) => state === 'cliente_cerrado'
    )
    return withProducts.map(({ documents }) => documents).flat()
  }
}

export const actions = {
  updateLeads ({ commit }, { payload, sort = false }) {
    let newData = [...payload]
    if (sort) {
      newData = newData.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }
    commit('setLeads', newData)
  },
  async getUsers ({ commit }) {
    let pagAct = 1
    let nextP = true
    let userskams = []
    try {
      while (nextP) {
        const { data } = await this.$simpleeApi.get(`/user?executive=&page=${pagAct}`)
        //const { data } = await this.$simpleeApi.get('/user?executive')
        //userskams = data.results
        userskams = [...userskams, ...data.results]
        if (data.next) {
          pagAct += 1
        }
        nextP = data.next
      }
    } catch (error) {
      commit('setAlertMessage', error.response.data)
    }
    for (let j = 0; j < userskams.length; j++) {
      if (!userskams[j].first_name) {
        userskams[j].first_name = 'Sin nombre'
      }
    }
    userskams = userskams.sort((a, b) =>
      a.first_name.localeCompare(b.first_name)
    )
    commit('setUsersalls', userskams)
    let actualPage = 1
    let nextPage = true
    let users = []
    try {
      while (nextPage) {
        const {
          data: { results, next }
        } = await this.$simpleeApi.get(`/user?page=${actualPage}`)
        users = [...users, ...results]
        if (next) {
          actualPage += 1
        }
        nextPage = next
      }
    } catch (error) {
      commit('setAlertMessage', error.response.data)
    }

    commit('setUsers', users)
  },
  async getUsersold ({ commit }) {
    let actualPage = 1
    let nextPage = true
    let users = []
    try {
      while (nextPage) {
        const {
          data: { results, next }
        } = await this.$simpleeApi.get(`/user?page=${actualPage}`)
        users = [...users, ...results]
        if (next) {
          actualPage += 1
        }
        nextPage = next
      }
    } catch (error) {
      commit('setAlertMessage', error.response.data)
    }

    commit('setUsers', users)
  },
  async deleteLead ({ commit }, { lead }) {
    try {
      await this.$simpleeApi.delete(`/lead/${lead.id}/`)
      commit('deleteLead', lead)
    } catch (error) {
      console.log({ error })
      commit('setAlertMessage', error.response.data)
    }
  },
  async getChannels ({ commit }) {
    const {
      data: { results, count }
    } = await this.$simpleeApi.get('/channel/')
    let channels = results
    const pages = [...Array(Math.ceil(count / 25) + 1).keys()]
    pages.shift()
    try {
      await Promise.all(
        pages
          .filter(value => value !== 1)
          .map(async (page) => {
            const {
              data: { results }
            } = await this.$simpleeApi.get(`/channel/?page=${page}`)
            channels = [...channels, ...results]
          })
      )
    } catch (error) {
      console.log({ error })
      commit('setAlertMessage', error.response.data)
    }
    commit('setChannels2', channels)
    if (channels) {
      let channels2 = channels
      for (let j = 0; j < channels.length; j++) {
        channels2 = channels.filter(item => item.is_new === true)
      }
      channels = channels2
    }
    commit('setChannels', channels)
  },
  async getCampanas ({ commit }) {
    const {
      data: { results, count }
    } = await this.$simpleeApi.get('/campaigns/')
    let campanas = results
    const pages = [...Array(Math.ceil(count / 25) + 1).keys()]
    pages.shift()
    try {
      await Promise.all(
        pages
          .filter(value => value !== 1)
          .map(async (page) => {
            const {
              data: { results }
            } = await this.$simpleeApi.get(`/campaigns/?page=${page}`)
            campanas = [...campanas, ...results]
          })
      )
    } catch (error) {
      console.log({ error })
      commit('setAlertMessage', error.response.data)
    }

    commit('setCampanas', campanas)
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
    const formatemessage = ''
    commit('deletestatemessage', formatemessage)
    commit('setAlertMessage', { success: 'El CSV fue enviado a su correo' })
  },
  async getCsvLeadsold ({ commit }, { url = 'lead', page, urlParams }) {
    const pages = [...Array(page + 1).keys()]
    pages.shift()

    commit('setLoadingCsvLeads', true)
    commit('setLeadsCsvProgress', 0)

    const leads = []

    if (url === 'lead') {
      let numOfRequest = (page - 1) * 25

      for await (const p of pages) {
        const res = await this.$simpleeApi.get('/lead/', {
          params: { page: p, ...urlParams }
        })
        await new Promise(resolve => setTimeout(resolve, 1000))
        leads.push(...res.data.results)
      }

      numOfRequest = numOfRequest + (leads.length - numOfRequest) + page
      commit('setLeadsCsvProgress', (page / numOfRequest) * 100)

      const pPlus = ((page / numOfRequest) * 100) / page

      for await (const l of leads) {
        try {
          const res = await this.$simpleeApi.get(`/lead/${l.id}/product/`)
          await new Promise(resolve => setTimeout(resolve, 1000))
          l.products = res?.data?.results ?? []
          commit('setLeadsCsvProgress', pPlus)
        } catch (error) {
          console.log(error)
        }
      }
    }

    if (url === 'contacts') {
      const pPlus = ((page / page) * 100) / page

      for await (const p of pages) {
        const res = await this.$simpleeApi.get('/product/', {
          params: { page: p, ...urlParams }
        })
        await new Promise(resolve => setTimeout(resolve, 1000))
        commit('setLeadsCsvProgress', pPlus)

        const products = [...res.data.results]
        let leadsFromProducts = []

        products
          .map((p) => {
            return {
              ...p,
              user: p.user ?? p.lead.user
            }
          })
          .forEach((prod) => {
            leadsFromProducts.push(prod.lead)
          })
        leadsFromProducts = leadsFromProducts.map((l) => {
          return {
            ...l,
            products: products
              .filter(p => p.lead.id === l.id)
              .map(({ lead, ...p }) => p)
          }
        })

        leads.push(...leadsFromProducts)
      }
    }

    leads.forEach((lead) => {
      lead.products?.map((product) => {
        product.created_at = new Date(product.created_at).toLocaleDateString(
          'en-CA'
        )
        return product
      })
    })
    console.log(leads)
    commit('setLeadsCsv', leads)
    commit('setLoadingCsvLeads', false)
  }
}
