/* eslint-disable camelcase */
import qs from 'query-string'

const urlEnv = process.env.apiUrl
const urlMudango = process.env.NUXT_ENV_API_URL ? 'https://api.simplee.cl/api' : 'https://api.dev.simplee.cl/api'
export default function ({ $axios, store }, inject) {
  // Create a custom axios instance
  const simpleeApi = $axios.create({
    baseURL: urlEnv,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
  })

  const simpleeApiMudango = $axios.create({
    baseURL: urlMudango,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
  })

  const getProduct = async ({ id }) => {
    try {
      const {
        data
      } = await simpleeApi.get(`/product/${id}/`)
      return [null, data]
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
      return [error, null]
    }
  }

  const getProducts = async (page, urlParams, fieldss) => {
    try {
      const {
        data
      } = await simpleeApi.get('/product/', {
        params: {
          page,
          ...urlParams,
          fields: fieldss
        }
      })
      return [null, data]
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
      return [error, null]
    }
  }
  const markProducts = async (payload) => {
    try {
      const {
        data
      } = await simpleeApi.put('/mark_products_as/', payload)
      return [null, data]
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
      return [error, null]
    }
  }

  const updateProduct = async (id, payload) => {
    try {
      const {
        data
      } = await simpleeApi.put(`/product/${id}/`, payload)
      return [null, data]
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
      return [error, null]
    }
  }

  const deleteProduct = async ({ id }) => {
    try {
      const {
        data
      } = await simpleeApi.delete(`/product/${id}/`)
      return [null, data]
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
      return [error, null]
    }
  }

  const getProfile = async () => {
    try {
      const { data } = await simpleeApi.get('/profile/')
      return data
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
      return null
    }
  }
  const getUsers = async () => {
    try {
      const { data } = await simpleeApi.get('/user?executive')
      return data
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
      return null
    }
  }
  const changeName = async (payload) => {
    try {
      await simpleeApi.put('/profile/', payload)
      store.commit('setAlertMessage', { success: 'Se ha cambiado tu nombre exitosamente!' })
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }
  const autoselectLeads = async (status) => {
    try {
      await simpleeApi.post('/toggle_leads_config/')
      if (status === true) {
        store.commit('setAlertMessage', { success: 'Se ha desactivado la asignación automatica de leads!' })
      } else {
        store.commit('setAlertMessage', { success: 'Se ha activado la asignación automatica de leads!' })
      }
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }
  const getselectLeads = async () => {
    try {
      const { data: { results } } = await simpleeApi.get('/toggle_leads_config/')
      const is_active = results[0].is_active
      return is_active
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
      return null
    }
  }
  const changePassword = async (payload) => {
    try {
      const { data } = await simpleeApi.put('/auth/change-password/', payload)
      return data
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
      return null
    }
  }

  const setNewGoal = async (payload) => {
    try {
      if (!payload.update) {
        const { data } = await simpleeApi.post('/goal/', payload)
        return data
      } else {
        delete payload.update
        const { data } = await simpleeApi.put(`/goal/${payload.id}/`, payload)
        return data
      }
    } catch (error) {
      sendErrorPayload({
        payload,
        origin: 'Configuracion',
        errorResponse: error.response,
        expectedBehavior: payload.update ? `Deberia actualizarse la meta ${payload.id}` : 'Deberia crearse una nueva meta'
      })
      return null
    }
  }

  const getGoals = async () => {
    try {
      const { data } = await simpleeApi.get('/goal/')
      return data.results
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }

  const getCampana = async () => {
    const { data: { results, count } } = await simpleeApi.get('/campaigns/')
    let campanas = results
    const pages = [...Array(Math.ceil(count / 25) + 1).keys()]
    pages.shift()
    try {
      await Promise.all(pages.filter(value => value !== 1).map(async (page) => {
        const { data: { results } } = await simpleeApi.get(`/campaigns/?page=${page}`)
        campanas = [...campanas, ...results]
      }))
    } catch (error) {
      console.log({ error })
    }
    return campanas
  }

  const getGoalsNew = async (page) => {
    try {
      const { data } = await simpleeApi.get('/goal/', { params: { page } })
      return data
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }

  const generateDiagnosticPdf = async (id) => {
    const doc = {
      option: 'generate',
      risk_diagnostic: id
    }
    try {
      const { data } = await simpleeApi.post('/generate_diagnostic_pdf/', doc)
      window.open(data.document, '_blank')
      return data.document
    } catch (error) {
      sendErrorPayload({
        payload: doc,
        origin: 'Contactos',
        errorResponse: error.response,
        expectedBehavior: 'Deberia crearse un nuevo diagnostico'
      })
      return null
    }
  }

  const setNewChannel = async (channel) => {
    try {
      if (channel.id) {
        const { data } = await simpleeApi.put(`/channel/${channel.id}/`, channel)
        return data
      } else {
        const { data } = await simpleeApi.post('/channel/', channel)
        return data
      }
    } catch (error) {
      sendErrorPayload({
        payload: channel,
        origin: 'Configuracion',
        errorResponse: error.response,
        expectedBehavior: channel.id ? `Deberia actualizarse el canal ${channel.id}` : 'Deberia crearse un nuevo canal'
      })
    }
  }
  const setNewEtiqueta = async (tags) => {
    try {
      if (tags.codigo) {
        const { data } = await simpleeApi.put(`/tags/${tags.codigo}/`, tags)
        return data
      } else {
        const { data } = await simpleeApi.post('/tags/', tags)
        return data
      }
    } catch (error) {
      sendErrorPayload({
        payload: tags,
        origin: 'Configuracion',
        errorResponse: error.response,
        expectedBehavior: tags.id ? `Deberia actualizarse la Etiqueta ${tags.id}` : 'Deberia crearse una nueva Etiqueta'
      })
    }
  }

  const setNewCampana = async (campaigns) => {
    try {
      if (campaigns.id) {
        const { data } = await simpleeApi.put(`/campaigns/${campaigns.id}/`, campaigns)
        return data
      } else {
        const { data } = await simpleeApi.post('/campaigns/', campaigns)
        return data
      }
    } catch (error) {
      sendErrorPayload({
        payload: campaigns,
        origin: 'Configuracion',
        errorResponse: error.response,
        expectedBehavior: campaigns.id ? `Deberia actualizarse el canal ${campaigns.id}` : 'Deberia crearse un nuevo canal'
      })
    }
  }

  const deleteChannel = async (id) => {
    try {
      const { data } = await simpleeApi.delete(`/channel/${id}`)
      return data
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }

  const deleteCampana = async (id) => {
    try {
      const { data } = await simpleeApi.delete(`/campaigns/${id}`)
      return data
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }

  const setNewRefered = async (reffered) => {
    try {
      if (reffered.id) {
        const { data } = await simpleeApi.put(`/reffered/${reffered.id}/`, reffered)
        return data
      } else {
        const { data } = await simpleeApi.post('/reffered/', reffered)
        return data
      }
    } catch (error) {
      sendErrorPayload({
        payload: reffered,
        origin: 'Configuracion',
        errorResponse: error.response,
        expectedBehavior: reffered.id ? `Deberia actualizarse el referido ${reffered.id}` : 'Deberia crearse un nuevo referido'
      })
    }
  }

  const deleteReffered = async (id) => {
    try {
      const { data } = await simpleeApi.delete(`/reffered/${id}`)
      return data
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }
  const deleteEtiqueta = async (id) => {
    try {
      const { data } = await simpleeApi.delete(`/tags/${id}`)
      return data
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }

  const getAllPermissions = async () => {
    try {
      const { data } = await simpleeApi.get('/permission-user/')
      return data.results[0]
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }

  const updatePermissions = async (permission) => {
    const { id = null, ...permit } = permission
    try {
      if (id) {
        await simpleeApi.put(`/permission/${id}/`, permit)
      } else {
        await simpleeApi.post('/permission/', permission)
      }
    } catch (error) {
      sendErrorPayload({
        payload: id ? permit : permission,
        origin: 'Configuracion',
        errorResponse: error.response,
        expectedBehavior: permission.id ? `Deberia actualizarse el permiso ${permission.id}` : 'Deberia crearse un nuevo permiso'
      })
    }
  }

  const PublicPost = async (payload) => {
    try {
      await simpleeApi.post('/poster/', payload)
    } catch (error) {
      sendErrorPayload({
        payload,
        origin: 'Simplee talk',
        errorResponse: error.response,
        expectedBehavior: 'Deberia crearse un nuevo post'
      })
    }
  }

  const UpdatePost = async (id, payload) => {
    try {
      await simpleeApi.put(`/poster/${id}/`, payload)
    } catch (error) {
      sendErrorPayload({
        payload,
        origin: 'Simplee talk',
        errorResponse: error.response,
        expectedBehavior: `Deberia actualizarse el post ${id}`
      })
    }
  }

  const UpdateRequest = async (id, payload) => {
    try {
      const results = await simpleeApi.put(`/request/${id}/`, payload)
      const data = results.data
      data.success = true
      return data
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
      const data = []
      data.success = false
      data.response = error.response.data
      return data
    }
  }

  const DeletePost = async (id) => {
    try {
      await simpleeApi.delete(`/poster/${id}`)
      store.commit('setAlertMessage', { success: 'Se ha borrado su Post correctamente!' })
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }

  const DeleteRequest = async (id) => {
    try {
      await simpleeApi.delete(`/request/${id}`)
      store.commit('setAlertMessage', { success: 'Se ha borrado la solicitud correctamente!' })
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }

  const DeleteClient = async (id) => {
    try {
      await simpleeApi.delete(`/lead/${id}`)
      store.commit('setAlertMessage', { success: 'Se ha borrado el cliente correctamente!' })
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }

  const PublicMemo = async (payload) => {
    try {
      await simpleeApi.post('/memos/', payload)
    } catch (error) {
      sendErrorPayload({
        payload,
        origin: 'Simplee talk',
        errorResponse: error.response,
        expectedBehavior: 'Deberia crearse un nuevo memo'
      })
    }
  }

  const EditMemo = async (id, payload) => {
    try {
      await simpleeApi.put('/memos/' + id + '/', payload)
      store.commit('setAlertMessage', { success: 'Se ha publicado exitosamente!' })
    } catch (error) {
      sendErrorPayload({
        payload,
        origin: 'Simplee talk',
        errorResponse: error.response,
        expectedBehavior: `Deberia editarse el memo ${id}`
      })
    }
  }

  const DeleteMemo = async (id) => {
    try {
      await simpleeApi.delete(`/memos/${id}`)
      store.commit('setAlertMessage', { success: 'Se ha borrado su Post correctamente!' })
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }

  const PublicComent = async (payload) => {
    try {
      const { data } = await simpleeApi.post('/comments/', payload)
      return data
    } catch (error) {
      sendErrorPayload({
        payload,
        origin: 'Simplee talk',
        errorResponse: error.response,
        expectedBehavior: 'Deberia crearse un nuevo comentario'
      })
    }
  }

  const PostContact = async (payload) => {
    try {
      const { data } = await simpleeApi.post('/lead/', payload)
      return data
    } catch (error) {
      sendErrorPayload({
        payload,
        origin: 'Solicitudes',
        errorResponse: error.response,
        expectedBehavior: 'Deberia crearse un nuevo contacto'
      })
    }
  }

  const PostProduct = async (payload) => {
    try {
      const { data } = await simpleeApi.post('/product/', payload)
      console.log(data)
      return data
    } catch (error) {
      sendErrorPayload({
        payload,
        origin: 'Solicitudes-Producto',
        errorResponse: error.response,
        expectedBehavior: 'Deberia crearse un nuevo producto'
      })
      return false
    }
  }

  const PostRequest = async (payload) => {
    try {
      const { data } = await simpleeApi.post('/request/', payload)
      console.log(data)
      return data
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
      return false
    }
  }

  const ConfigLike = async (payload) => {
    try {
      await simpleeApi.post('/toggle_like/', payload)
    } catch (error) {
      sendErrorPayload({
        payload,
        origin: 'Simplee talk',
        errorResponse: error.response,
        expectedBehavior: 'Deberia crearse un nuevo like'
      })
    }
  }

  const ModPost = async (id, payload) => {
    try {
      await simpleeApi.put('/poster/' + id + '/', payload)
      store.commit('setAlertMessage', { success: 'Se ha publicado exitosamente!' })
    } catch (error) {
      sendErrorPayload({
        payload,
        origin: 'Simplee talk',
        errorResponse: error.response,
        expectedBehavior: `Deberia actualizarse el post ${id}`
      })
    }
  }

  const GetPost = async (id) => {
    try {
      const { data } = await simpleeApi.get(`/poster/${id}`)
      return data
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }

  const GetRequest = async (id) => {
    try {
      const { data } = await simpleeApi.get(`/request/${id}`)
      return data
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }

  const GetRc = async (id) => {
    try {
      const { data } = await simpleeApi.get(`/rc/${id}`)
      return data
    } catch (error) {
      //store.commit('setAlertMessage', error.response.data)
    }
  }

  const GetMp = async (id) => {
    try {
      const { data } = await simpleeApi.get(`/micro_pyme/${id}`)
      return data
    } catch (error) {
      //store.commit('setAlertMessage', error.response.data)
    }
  }

  const GetGa = async (id) => {
    try {
      const { data } = await simpleeApi.get(`/gaproposal/${id}`)
      return data
    } catch (error) {
      //store.commit('setAlertMessage', error.response.data)
    }
  }

  const GetContact = async (id) => {
    try {
      const { data } = await simpleeApi.get(`/lead/${id}`)
      return data
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }

  const GetDocumentsRequest = async (id) => {
    try {
      const { data } = await simpleeApi.get(`/request/${id}/document`)

      return data.results
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }
  const GetColectivoEmpresa = async (id) => {
    try {
      const { data } = await simpleeApi.get('/colectivo/', { params: { lead_request: id } })
      return data.results[0].id
    } catch (error) {
      console.log(error)
    }
  }
  const GetColectivoRequest = async (id) => {
    try {
      const { data } = await simpleeApi.get('/colectivo_empleado/', { params: { colectivo: id } })
      return data.results
    } catch (error) {
      console.log(error)
    }
  }

  const GetBitacoraRequest = async (id) => {
    try {
      const { data } = await simpleeApi.get(`/request/${id}/lead_request_bitacora`)
      return data.results
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }
  const GetBitacoraProduct = async (id) => {
    const urlParams = {
      product: id
    }
    try {
      const {
        data
      } = await simpleeApi.get('/product_bitacora/', {
        params: {
          ...urlParams
        }
      })
      return data.results
    } catch (error) {
      return null
    }
  }

  const GetDocumentsLeads = async (id) => {
    try {
      const { data } = await simpleeApi.get(`/lead/${id}/document`)
      return data.results
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }

  const GetProductRequest = async (id) => {
    try {
      const { data } = await simpleeApi.get(`/product/${id}`)
      return data
    } catch (error) {
      return null
    }
  }
  const GetProductRequestPoliza = async (value) => {
    const urlParams = {
      search: value
    }
    try {
      const {
        data
      } = await simpleeApi.get('/product/', {
        params: {
          ...urlParams
        }
      })
      return data.results[0]
    } catch (error) {
      return null
    }
  }
  const GetProductCobranzaPoliza = async (id) => {
    try {
      const { data } = await simpleeApi.get(`/cobranza/collect_payment/${id}`)
      return data
    } catch (error) {
      return null
    }
  }

  const ListPoster = async (val, page) => {
    if (val) {
      try {
        const { data } = await simpleeApi.get('/poster/?tags=' + val, { params: { page } })
        return data
      } catch (error) {
        const data = 'vacio'
        return data
        // store.commit('setAlertMessage', error.response.data)
      }
    } else {
      try {
        const { data } = await simpleeApi.get('/poster/', { params: { page } })
        return data
      } catch (error) {
        const data = 'vacio'
        return data
        // store.commit('setAlertMessage', error.response.data)
      }
    }
  }

  const ListMemos = async (date_start, date_end, page) => {
    const start = date_start
    const end = date_end
    try {
      const { data } = await simpleeApi.get('/memos/?date_start=' + start + '&date_end=' + end, { params: { page } })
      return data
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }

  const GetMemo = async (id) => {
    try {
      const { data } = await simpleeApi.get(`/memos/${id}`)
      return data
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }

  const ListTags = async () => {
    try {
      const { data } = await simpleeApi.get('/tags/?quantity=7')
      return data.results
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }

  const sendErrorPayload = async ({ errorResponse, origin, expectedBehavior, payload } = {}) => {
    store.commit('setAlertMessage', errorResponse.data)
    if (Number(errorResponse.status) === 400 || Number(errorResponse.status) === 500) {
      try {
        const bug = {
          origen: origin,
          comp_esperado: expectedBehavior,
          project: 'simplee-teams',
          description: `payload de la request: ${JSON.stringify(payload)}`
        }
        await simpleeApi.post('/bug/', bug)
        // store.commit('setAlertMessage', { error: 'El error ha sido reportado al equipo de TI' })
      } catch (error) {
        console.log(error)
        // store.commit('setAlertMessage', { error: 'Ha ocurrido un error al reportar el fallo' })
      }
    }
  }

  const ListPlace = async () => {
    try {
      const { data } = await simpleeApi.get('/origin_place/')
      return data.results
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }

  const ListRequests = async (page, urlParams, fieldss) => {
    try {
      const { data } = await simpleeApi.get('/request/', { params: { page, ...urlParams,  fields: fieldss  } })
      return data
    } catch (error) {
      sendErrorPayload({
        origin: 'Solicitudes',
        errorResponse: error.response,
        expectedBehavior: 'Deberia listar las solicitudes'
      })
    }
  }

  const ListCobranza = async (page, urlParams) => {
    try {
      const { data } = await simpleeApi.get('cobranza/collect_payment/', { params: { page, ...urlParams } })
      return data
    } catch (error) {
      sendErrorPayload({
        origin: 'Cobranza',
        errorResponse: error.response,
        expectedBehavior: 'Deberia listar las cobranzas'
      })
    }
  }
  const ListCobranzaPagos = async (page, urlParams) => {
    try {
      const { data } = await simpleeApi.get('cobranza/physical_debtors/', { params: { page, ...urlParams } })
      return data
    } catch (error) {
      sendErrorPayload({
        origin: 'physical_debtors',
        errorResponse: error.response,
        expectedBehavior: 'Deberia listar los pagos'
      })
    }
  }
  
  const ListCuotasVencidas = async (page, urlParams) => {
    try {
      const { data } = await simpleeApi.get('cobranza/dues/', { params: { page, ...urlParams } })
      return data
    } catch (error) {
      sendErrorPayload({
        origin: 'Cobranza',
        errorResponse: error.response,
        expectedBehavior: 'Deberia listar las Cuotas Vencidas'
      })
    }
  }

  const ListRequestsprioridades = async (page, urlParams) => {
    urlParams.tags = 'prioritario'
    try {
      const { data } = await simpleeApi.get('/request/', { params: { page, ...urlParams } })
      return data
    } catch (error) {
      sendErrorPayload({
        origin: 'Solicitudes',
        errorResponse: error.response,
        expectedBehavior: 'Deberia listar las solicitudes'
      })
    }
  }

  const ListPolizas = async (page, urlParams) => {
    //urlParams.has_persons = true
    try {
      const { data } = await simpleeApi.get('/rc/', { params: { page, ...urlParams } })
      return data
    } catch (error) {
      sendErrorPayload({
        origin: 'RC',
        errorResponse: error.response,
        expectedBehavior: 'Deberia listar los RC'
      })
    }
  }
  const ListPolizasMp = async (page, urlParams) => {
    //urlParams.has_persons = true
    try {
      const { data } = await simpleeApi.get('/micro_pyme/', { params: { page, ...urlParams } })
      return data
    } catch (error) {
      sendErrorPayload({
        origin: 'MP',
        errorResponse: error.response,
        expectedBehavior: 'Deberia listar los MP'
      })
    }
  }
  const ListPolizasGa = async (page, urlParams) => {
    try {
      const { data } = await simpleeApi.get('/gaproposal/', { params: { page, ...urlParams } })
      return data
    } catch (error) {
      sendErrorPayload({
        origin: 'Garantia',
        errorResponse: error.response,
        expectedBehavior: 'Deberia listar los Garantia'
      })
    }
  }
  const ListMudangoPartners = async (page, urlParams) => {
    try {
      const { data } = await simpleeApiMudango.get('/mudango/certificate/', { params: { page, ...urlParams } })
      return data
    } catch (error) {
      sendErrorPayload({
        origin: 'Partners',
        errorResponse: error.response,
        expectedBehavior: 'Deberia listar mudango certificados'
      })
    }
  }
  const ListStateReason = async () => {
    try {
      const { data } = await simpleeApi.get('/state_reason/')
      return data.results
    } catch (error) {
      store.commit('setAlertMessage', error.response.data)
    }
  }

  // Inject to context as $api
  inject('simpleeApi', simpleeApi)
  inject('simpleeApiMudango', simpleeApiMudango)
  inject('getProducts', getProducts)
  inject('markProducts', markProducts)
  inject('updateProduct', updateProduct)
  inject('deleteProduct', deleteProduct)
  inject('getProduct', getProduct)
  inject('getProfile', getProfile)
  inject('getUsers', getUsers)
  inject('changeName', changeName)
  inject('autoselectLeads', autoselectLeads)
  inject('getselectLeads', getselectLeads)
  inject('changePassword', changePassword)
  inject('setNewGoal', setNewGoal)
  inject('getGoals', getGoals)
  inject('getGoalsNew', getGoalsNew)
  inject('getCampana', getCampana)
  inject('setNewChannel', setNewChannel)
  inject('setNewEtiqueta', setNewEtiqueta)
  inject('setNewCampana', setNewCampana)
  inject('deleteChannel', deleteChannel)
  inject('deleteCampana', deleteCampana)
  inject('setNewRefered', setNewRefered)
  inject('deleteReffered', deleteReffered)
  inject('deleteEtiqueta', deleteEtiqueta)
  inject('generateDiagnosticPdf', generateDiagnosticPdf)
  inject('getAllPermissions', getAllPermissions)
  inject('updatePermissions', updatePermissions)
  inject('ListPoster', ListPoster)
  inject('ListTags', ListTags)
  inject('ListMemos', ListMemos)
  inject('PublicPost', PublicPost)
  inject('PublicComent', PublicComent)
  inject('PublicMemo', PublicMemo)
  inject('ConfigLike', ConfigLike)
  inject('ModPost', ModPost)
  inject('GetPost', GetPost)
  inject('GetMemo', GetMemo)
  inject('EditMemo', EditMemo)
  inject('UpdatePost', UpdatePost)
  inject('DeletePost', DeletePost)
  inject('DeleteMemo', DeleteMemo)
  inject('sendErrorPayload', sendErrorPayload)
  inject('ListPlace', ListPlace)
  inject('ListStateReason', ListStateReason)
  inject('PostContact', PostContact)
  inject('PostRequest', PostRequest)
  inject('ListCobranza', ListCobranza)
  inject('ListCobranzaPagos', ListCobranzaPagos)
  inject('ListCuotasVencidas', ListCuotasVencidas)
  inject('ListRequests', ListRequests)
  inject('ListRequestsprioridades', ListRequestsprioridades)
  inject('ListPolizas', ListPolizas)
  inject('ListPolizasMp', ListPolizasMp)
  inject('ListPolizasGa', ListPolizasGa)
  inject('ListMudangoPartners', ListMudangoPartners)
  inject('GetRequest', GetRequest)
  inject('GetRc', GetRc)
  inject('GetMp', GetMp)
  inject('GetGa', GetGa)
  inject('GetContact', GetContact)
  inject('GetColectivoEmpresa', GetColectivoEmpresa)
  inject('GetDocumentsRequest', GetDocumentsRequest)
  inject('GetColectivoRequest', GetColectivoRequest)
  inject('GetDocumentsLeads', GetDocumentsLeads)
  inject('UpdateRequest', UpdateRequest)
  inject('DeleteRequest', DeleteRequest)
  inject('DeleteClient', DeleteClient)
  inject('PostProduct', PostProduct)
  inject('GetProductRequest', GetProductRequest)
  inject('GetProductRequestPoliza', GetProductRequestPoliza)
  inject('GetProductCobranzaPoliza', GetProductCobranzaPoliza)
  inject('GetBitacoraRequest', GetBitacoraRequest)
  inject('GetBitacoraProduct', GetBitacoraProduct)
}
