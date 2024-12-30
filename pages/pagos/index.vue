<template>
  <div>
    <div class="main-container" />
    <s-tool-bar
      ref="reftoolbar"
      class="toolbar"
      search-input
      pagos
      filterByStatePay
      filterByCompanies
      :current-filters="leadsFilters"
      @search="searchConfig"
      @set-rut="setRut"
      @save-filters="setFilters"
      @resetFilters="setFilters"
      @new-lead="newCobro"
    >
      <template #buttons>
        <download-informe-pagos class="mr-4" />
        <div class="flex flex-row bg-gray-800">
          <b-button
            class="text-white shadow-dropdow btn-new ml-2"
            :style="leadsFilters.optionDate ? 'width: 7rem !important; margin-left: 1rem !important;' : ''"
            variant="danger"
            @click="modalImport = true"
          >
            <fa-icon
              class="mr-1"
              :icon="['fas', 'file']"
            />Importar Excel
          </b-button>
        </div>
      </template>
    </s-tool-bar>
    <div
      v-if="OptionPage === 'list'"
      class="w-100"
    >
      <div class="d-flex mb-2 w-100 results">
        <div class="w-100 d-flex justify-content-end">
          <span> {{ totalRows }} Resultados</span>
        </div>
      </div>
      <div class="main">
        <div class="form-sections">
          <div class="table-responsive">
            <b-table
              id="table-principal"
              :items="DataCobro"
              :fields="fields"
              responsive="md"
              thead-class="newth"
              :busy="loadingLeads"
            >
              <template #table-busy>
                <div class="d-flex h-100">
                  <div class="text-center text-primary pa-5 mx-auto h-100">
                    <b-spinner class="align-middle" />
                    <strong>Cargando...</strong>
                  </div>
                </div>
              </template>
              <template #cell(company)="{ value }">
                <p>{{ getCompanyName(value) }}</p>
              </template>
              <template #cell(state)="{value}">
                {{ GetPaymentType(value) }}
              </template>
              <template #cell(reminder_sent)="{value}">
                {{ GetStatuNotification(value) }}
              </template>
              <template #cell(actions)="{item}">
                <div class="d-flex justify-content-center">
                  <button
                    v-b-tooltip.hover
                    class="circle mr-1 bg-white shadow-sm border p-2"
                    title="Ver detalle"
                    @click="GetCuotas(item)"
                  >
                    <fa-icon
                      :icon="['fas', 'eye']"
                      class="text-primary"
                      style="font-size: .9rem"
                    />
                  </button>
                  <button
                    v-if="item.state !=='PAID' && item.state !=='CANCELLED'"
                    v-b-tooltip.hover
                    class="circle mr-1 bg-white shadow-sm border p-2"
                    title="Pagar"
                    @click="PayCobro(item)"
                  >
                    <fa-icon
                      :icon="['fas', 'dollar-sign']"
                      class="text-primary"
                      style="font-size: .9rem"
                    />
                  </button>
                  <button
                    v-if="item.state !=='CANCELLED' && item.state !=='PAID'"
                    v-b-tooltip.hover
                    class="circle mr-1 bg-white shadow-sm border p-2"
                    title="Cancelar"
                    @click="CancelCobro(item)"
                  >
                    <fa-icon
                      :icon="['fas', 'times']"
                      class="text-primary"
                      style="font-size: .9rem"
                    />
                  </button>
                  <button
                    v-b-tooltip.hover
                    class="circle mr-1 bg-white shadow-sm border p-2"
                    title="Enviar Correo"
                    @click="confirmEmailPrev(item)"
                  >
                    <fa-icon
                      :icon="['fas', 'envelope']"
                      class="text-primary"
                      style="font-size: .9rem"
                    />
                  </button>
                  <button
                    v-b-tooltip.hover
                    class="circle mr-1 bg-white shadow-sm border p-2"
                    title="Enviar Whatsapp"
                    @click="confirmSendWhatsapp(item)"
                  >
                    <img
                      class="imgicon"
                      :src="require(`~/assets/icons/WhatsApp.png`)"
                    >
                  </button>
                </div>
              </template>
            </b-table>
            <div class="pages">
              <b-pagination
                class="mb-0"
                align="center"
                :value="page"
                :per-page="25"
                :total-rows="totalRows"
                pills
                size="sm"
                @change="ListCobranza"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <viewdues
        :idCuota="idCuota"
        :DataMadre="DataMadre"
        @BackList="OptionPage = 'list';ListCobranzaTotal();ListCobranza()"
      ></viewdues>
    </div>
    <b-modal
      ref="modal-alert"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h3 class="text-base title-text">
          {{ messageError }}
        </h3>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4"
          variant="primary"
          @click="closeRequestAlertModal"
        >
          ¡Entendido!
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-alert2"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h3 class="text-base title-text">
          Error {{ messageError }}
        </h3>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4"
          variant="primary"
          @click="closeRequestAlertModal2"
        >
          Cerrar
        </b-button>
      </div>
    </b-modal>
    <s-modal-cobranza-pay
      v-if="modalImport"
      :CuotasExistentes="CuotasExistentes"
      ref="modallead"
      @hidde="onCloseModal"
      @carga-cuotas="ListCobranza"
      @carga-cuotas-totales="ListCobranzaTotal"
      @cancel-lead="onCloseModal"
    />
    <s-modal-import-polizas
      v-if="importPoliza"
      ref="modalImporPolizas"
      @hidde="onCloseModalImport"
      @save-lead="onSaveModalImport"
      @cancel-lead="onCloseModalImport"
    />
    <b-modal
      ref="modal-alertreque"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5 pb-1">
        <h3 class="title-text">
          ¡Listo! la cuota fue actualizada exitosamente
        </h3>
      </div>
      <div
        v-if="ResultsProduct.status === true"
        class="pt-2 pb-3"
      >
        <p>
          Encontramos un producto creado con el numero de políza en el Simplee teams, por favor cancela por no pago.
        </p>
        <div class="my-2 text-left">
          <b-button
            class="btn-new"
            variant="outline-primary"
            :to="{
                name: 'postventa',
                query: {
                  id: ResultsProduct.id,
                },
              }"
          >
            Ir al producto
          </b-button>
        </div>
      </div>
      <div
        v-if="ResultsCobranza.status === true"
        class="pt-2 pb-3"
      >
        <p>
          Encontramos que esta cuota esta creada en la cobranza del Simplee teams, por favor actualiza la cuota.
        </p>
        <div class="my-2 text-left">
          <b-button
            class="btn-new"
            variant="outline-primary"
            :to="{
                name: 'cobrar',
                query: {
                  id: ResultsCobranza.id,
                },
              }"
          >
            Ir a la cobranza
          </b-button>
        </div>
      </div>
      <div
        v-if="ResultsClient.status === true"
        class="pt-2 pb-3"
      >
        <p>
          Por el numero de poliza no pudimos encontrar cobranza tampoco el producto en el Simplee teams, pero encontramos al cliente, por favor busca en los productos del cliente.
        </p>
        <div class="my-2 text-left">
          <b-button
            class="btn-new"
            variant="outline-primary"
            :to="{
                name: 'clientes',
                query: {
                  id: ResultsClient.id,
                },
              }"
          >
            Ir a los productos del cliente
          </b-button>
        </div>
      </div>
      <div class="my-2 text-right">
        <b-button
          class="btn-new ml-4"
          variant="outline-primary"
          @click="OutModalPay()"
        >
          Cerrar
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-correo"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5 pb-1">
        <h3 class="title-text">
          Por favor seleccione el tipo de correo a enviar
        </h3>
      </div>
      <div class="w-50 d-flex flex-column mr-2 my-4">
        <div class="w-100 d-flex flex-column">
          <label
            class="text-base mt-0"
            for="father_name"
          >Tipo de correo* :</label>
          <b-form-select
            id="user"
            v-model="typecorreo"
            :options="correoopciones"
            class="form-control form-input"
            required
          />
        </div>
      </div>
      <div
        class="w-100 d-flex flex-col mt-3"
        style="flex-direction: column"
      >
        <span class="my-2">Se enviara el aviso al correo registrado: <strong>{{itemcorreo.email}}</strong></span>
        <div class="w-100 d-flex flex-col mr-2">
          <div class="w-100 d-flex flex-row">
            <input
              id="checksendO"
              v-model="checksendO"
              type="checkbox"
              @click="handleCheckboxClick()"
            >
            <label
              for="checksendO"
              class="text-base mt-0 ml-2"
            >Enviar a otro</label>
          </div>
        </div>
      </div>
      <div
        v-if="checksendO"
        class="w-100 d-flex flex-col mt-3"
        style="flex-direction: column"
      >
        <div class="w-100 d-flex flex-col mr-2">
          <div class="w-100 d-flex flex-row">
            <input
              id="emailToSend"
              v-model="emailToSend"
              style="width: 15rem !important; border:1px solid #505755;padding-left: 0.5rem;padding-right: 0.5rem;"
              type="email"
            >
          </div>
        </div>
        <span class="my-2">Ingresar un correo distinto al registrado en la cuota</span>
      </div>
      <div class="my-2 text-right">
        <b-button
          class="btn-new ml-4"
          variant="outline-primary"
          @click="confirmSendEmail(itemcorreo)"
        >
          Enviar
        </b-button>
      </div>
    </b-modal>
  </div>
</template>
  
  <script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Session from '@/mixins/auth'
import SToolBar from '~/components/base/SToolBar.vue'
import SModalCobranzaPay from '~/components/base/SModalCobranzaPay.vue'
import viewdues from '~/components/pagos/viewdues.vue'
import SModalImportPolizas from '~/components/base/SModalImportPolizas.vue'
import leadsStaticVars from '~/static/leadsStaticVars.json'
import DownloadInformePagos from '~/components/DownloadInformePagos.vue'
import companiesList from '~/static/polizas/companiesList.json'
import companies from '~/static/companies.json'
export default {
  name: 'Cobrar',
  components: {
    SToolBar,
    SModalCobranzaPay,
    SModalImportPolizas,
    viewdues,
    DownloadInformePagos,
  },
  mixins: [Session],
  data () {
    return {
      fields: leadsStaticVars.tableFieldsCobranzaPagos,
      page: 1,
      pages: 1,
      OptionPage: 'list',
      checksendO: false,
      emailToSend: '',
      itemcorreo: [],
      typecorreo: 'cuota',
      CuotasExistentes: [],
      idCuota: null,
      DataMadre: {},
      DataCobro: [],
      modalImport: false,
      messageError: '',
      importPoliza: false,
      companies,
      ResultsProduct: {
        status: false,
        id: null
      },
      ResultsCobranza: {
        status: false,
        id: null
      },
      ResultsClient: {
        status: false,
        id: null
      },
      correoopciones: [
        { value: 'cuota', text: 'Aviso Cuota' },
        { value: 'cancelacion', text: 'Aviso de cancelación de pagos' }
      ],
      typesPaid: [
        { value: 'contado', text: 'Contado' },
        { value: 'contado_transbank', text: 'Contado Transbank' },
        { value: 'pac_activo', text: 'PAC activo' },
        { value: 'pac_no_activo', text: 'PAC no activo' },
        { value: 'pat_activo', text: 'PAT activo' },
        { value: 'pat_no_activo', text: 'PAT no activo' },
        { value: 'aviso_de_cobranza', text: 'Aviso de cobranza' },
        { value: 'suscripcion_transbank', text: 'Suscripción Transbank' },
        { value: 'anual', text: 'Anual' },
        { value: 'mensual', text: 'Mensual' },
        { value: 'semestral', text: 'Semestral' }
      ]
    }
  },
  computed: {
    ...mapState(['leadsFilters']),
    ...mapState('leads', ['users', 'loadingLeads']),
    urlParams () {
      return {
        search: this.leadsFilters.search,
        rut: this.rut,
        user: this.leadsFilters.id,
        start: this.leadsFilters.startDate,
        end: this.leadsFilters.endDate,
        state: this.leadsFilters.statePay,
        companies: this.leadsFilters.companies,
      }
    }
  },
  watch: {
    urlParams: {
      deep: true,
      handler () {
        if (!this.loadingLeads) {
          this.ListCobranza(this.page)
        }
      }
    }
  },
  created () {

  },
  mounted () {
    this.ListCobranzaTotal()
    this.ListCobranza()
  },
  beforeDestroy () {
    this.setLoadingLeads(false)
  },
  methods: {
    ...mapMutations('leads', ['setLoadingLeads']),
    ...mapMutations(['setFilters']),
    async OpenCobranza (id) {
      const data = await this.$GetProductCobranzaPoliza(id)
      this.PayCobro(data)
    },
    handleCheckboxClick () {
      this.checksendO = !this.checksendO
      if (!this.checksendO) {
        this.emailToSend = ''
      }
    },
    async ListCobranzaTotal () {
      let actualPage = 1
      let nextPage = true
      let cuotas = []
      try {
        while (nextPage) {
          const {
            data: { results, next }
          } = await this.$simpleeApi.get(`cobranza/physical_debtors?page=${actualPage}`)
          cuotas = [...cuotas, ...results]
          console.log(next)
          if (next) {
            actualPage += 1
          }
          nextPage = next
        }
      } catch (error) {
        console.log(error)
        commit('setAlertMessage', error.response.data)
      }
      this.CuotasExistentes = cuotas
    },
    async ListCobranza (page) {
      if (!page) { page = 1 }
      this.page = page
      this.setLoadingLeads(true)
      const data = await this.$ListCobranzaPagos(page, this.urlParams)
      const Response = data.results
      this.totalRows = data.count
      for (let i = 0; i < Response.length; i++) {
        if (Response[i].paid_dues && Response[i].total_dues) {
          Response[i].status_dues = Response[i].paid_dues + '/' + Response[i].total_dues
        } else {
          Response[i].status_dues = 'Error en carga'
        }
      }
      console.log(Response)
      this.setLoadingLeads(false)
      this.DataCobro = Response
    },
    getCompanyName (key) {
      return this.companies.reduce(
        (a, { text, value }) => ({ ...a, [value]: text }),
        {}
      )[key]
    },
    resetFilters (localFilters) {
      const filters = {
        ...localFilters
      }
      if (localFilters.tipo_pago.length === 0) {
        filters.tipo_pago = leadsStaticVars.typesbuyKeys
      }
      if (filters.companies.length === 0) {
        filters.companies =
          companiesList.companies[process.env.version?.toLowerCase() ?? 'mx']
      }
      this.setFilters(filters)
    },
    onCloseModal () {
      this.modalImport = false
    },
    onCloseModalImport () {
      this.importPoliza = false
    },
    onSaveModal () {

    },
    onSaveModalImport () {

    },
    getProductName (key) {
      return Object.values(this.products).reduce((acc, curr) => ({ ...acc, ...curr.reduce((a, { text, value }) => ({ ...a, [value]: text }), {}) }), {})[key]
    },
    closeRequestAlertModal () {
      this.$refs['modal-alert'].hide()
    },
    closeRequestAlertModal2 () {
      this.$refs['modal-alert2'].hide()
    },
    confirmSendWhatsapp (item) {
      this.$bvModal
        .msgBoxConfirm('¿Esta seguro de que desea enviar whatsapp de notificación?', {
          title: 'Confirmar',
          titleClass: 'mdtitle',
          size: 'md',
          buttonSize: 'md',
          cancelVariant: 'btn text-white p-2 px-3 btn-secondary',
          okVariant: 'btn text-white p-2 px-3 btn-primary',
          okTitle: 'Si',
          cancelTitle: 'No',
          contentClass: 'border-0 radius',
          bodyClass: 'pxmodal',
          headerClass: 'pdmodal border-bottom-0',
          footerClass: 'pdmodal border-top-0',
          centered: true
        })
        .then((value) => {
          if (value) {
            setTimeout(() => this.SendWhatsapp(item), 500)
          }
        })
    },
    confirmEmailPrev (item) {
      this.itemcorreo = item
      this.$refs['modal-correo'].show()
    },
    confirmSendEmail (item) {
      this.$bvModal
        .msgBoxConfirm('¿Esta seguro de que desea enviar correo de notificación?', {
          title: 'Confirmar',
          titleClass: 'mdtitle',
          size: 'md',
          buttonSize: 'md',
          cancelVariant: 'btn text-white p-2 px-3 btn-secondary',
          okVariant: 'btn text-white p-2 px-3 btn-primary',
          okTitle: 'Si',
          cancelTitle: 'No',
          contentClass: 'border-0 radius',
          bodyClass: 'pxmodal',
          headerClass: 'pdmodal border-bottom-0',
          footerClass: 'pdmodal border-top-0',
          centered: true
        })
        .then((value) => {
          if (value) {
            setTimeout(() => this.SendEmail(item), 500)
          }
        })
    },
    async UpdateNotifications (item) {
      item.reminder_sent = true
      try {
        await this.$simpleeApi.put(`cobranza/physical_debtors/${item.id}/`, item)
        this.GetCobranzaClient(item, state)
      } catch (error) {
        console.log(error)
      }
    },
    async SendEmail (value) {
      let correoalt = ''
      if (this.emailToSend) {
        correoalt = this.emailToSend
      } else {
        correoalt = null
      }
      if (this.typecorreo === 'cuota') {
        try {
          const id = value.id
          const resp = await this.$simpleeApi.post('/cobranza/send_reminder/', {
            id: id,
            send_ws: false,
            custom_email: correoalt,
            custom_phone: null
          })
          console.log(resp.data.mensaje)
          if (resp.data.mensaje) {
            this.messageError = 'Enviado la notificación de la cuota correctamente'
          }
          this.emailToSend = ''
          this.UpdateNotifications(value)
          this.$refs['modal-correo'].hide()
          this.$refs['modal-alert'].show()
        } catch (error) {
          if (error) {
            this.messageError = error
          }
          this.$store.commit('setAlertMessage', error)
          this.$refs['modal-alert2'].show()
        }
      } else {
        try {
          const id = value.id
          const resp = await this.$simpleeApi.post('/cobranza/send_cancellation/', {
            id: id,
            send_ws: false,
            custom_email: correoalt,
            custom_phone: null
          })
          console.log(resp.data.mensaje)
          if (resp.data.mensaje) {
            this.messageError = 'Enviado la notificación de la cancelación de pagos correctamente'
          }
          this.emailToSend = ''
          this.UpdateNotifications(value)
          this.$refs['modal-correo'].hide()
          this.$refs['modal-alert'].show()
        } catch (error) {
          if (error) {
            this.messageError = error
          }
          this.$store.commit('setAlertMessage', error)
          this.$refs['modal-alert2'].show()
        }
      }
    },
    async SendWhatsapp (value) {
      try {
        const id = value.id
        const resp = await this.$simpleeApi.post('/cobranza/send_reminder/', {
          id: id,
          send_ws: true,
          custom_email: null,
          custom_phone: null
        })
        const url = resp.data.url
        console.log(resp)
        window.open(url, '_blank')
      } catch (error) {
        // this.$refs['modal-alert2'].show()
      }
    },
    GetCuotas (value) {
      this.DataMadre = value
      this.idCuota = value.id
      this.OptionPage = 'cuotas';
    },
    GetCuotasPaid (value) {
      let paids = 0
      const total = value.length
      for (let i = 0; i < value.length; i++) {
        if (value[i].state === 'paid') {
          paids = paids + 1
        }
      }
      return paids + '/' + total
    },
    GetStatuNotification (value) {
      if (value === true) {
        return 'Enviado'
      } else {
        return 'Pendiente'
      }
    },
    GetPaymentType (value) {
      if (value) {
        if (value === 'PENDING') {
          return 'Pendiente'
        } else if (value === 'CANCELLED') {
          return 'Cancelado'
        } else {
          return 'Pagado'
        }
      } else {
        return 'Sin info'
      }
    },
    GetPaymentType2 (type) {
      const PageType = this.typesPaid.find(({ value }) => value === type)
      if (PageType) { return PageType.text }
      return 'Sin Tipo'
    },
    GetPaymentAmount (value) {
      let amountObject
      for (let i = 0; i < value.length; i++) {
        if (!amountObject) {
          if (value[i].state === 'pending') {
            amountObject = value[i]
          }
        }
      }
      if (!amountObject) {
        for (let i = 0; i < value.length; i++) {
          if (value[i].state === 'paid') {
            amountObject = value[i]
          }
        }
      }
      if (amountObject) {
        return amountObject.amount
      } else {
        return 'Sin cuotas'
      }
    },
    GetPaymentDate (value) {
      if (value.length > 0) {
        let ObjectDate
        for (let i = 0; i < value.length; i++) {
          if (!ObjectDate) {
            if (value[i].state === 'pending') {
              ObjectDate = value[i]
            }
          }
        }
        if (!ObjectDate) {
          for (let i = 0; i < value.length; i++) {
            if (value[i].state === 'paid') {
              ObjectDate = value[i]
            }
          }
        }
        if (!ObjectDate) {
          for (let i = 0; i < value.length; i++) {
            if (value[i].state === 'canceled') {
              ObjectDate = value[i]
            }
          }
        }
        // const createdAt = new Date(ObjectDate.date).toLocaleString()
        // const [date] = createdAt.split(',')
        return `${ObjectDate.date}`
      } else {
        return 'sin cuotas'
      }
    },
    getPaymentstatus (value) {
      if (value.length > 0) {
        let ObjectState
        for (let i = 0; i < value.length; i++) {
          if (!ObjectState) {
            if (value[i].state === 'pending') {
              ObjectState = value[i]
            }
          }
        }
        if (!ObjectState) {
          for (let i = 0; i < value.length; i++) {
            if (value[i].state === 'paid') {
              ObjectState = value[i]
            }
          }
        }
        if (!ObjectState) {
          for (let i = 0; i < value.length; i++) {
            if (value[i].state === 'canceled') {
              ObjectState = value[i]
            }
          }
        }
        if (ObjectState.state === 'pending') {
          return 'Pendiente'
        } if (ObjectState.state === 'canceled') {
          return 'Cancelada'
        } else {
          return 'Pagado'
        }
      } else {
        return 'sin cuotas'
      }
    },
    getLeadDate (leadDate) {
      const createdAt = new Date(leadDate).toLocaleString('en-GB')
      const [date, hour] = createdAt.split(',')
      return `${date}\n${hour}`
    },
    getLeadUser (user) {
      if (this.users.length > 0) {
        if (user) {
          const leadUser = this.users.find(({ id }) => user === id)
          if (leadUser.first_name) {
            return leadUser.first_name || leadUser.email.split('@')[0]
          }
        }
      }
      return 'Sin asignar'
    },
    searchConfig (value) {
      this.leadsFilters.search = value
    },
    newCobro () {
      this.$router.push({ name: 'cobrar-nuevo' })
    },
    OutModalPay () {
      this.$refs['modal-alertreque'].hide()
    },
    async UpdateCuotaHija (item, state) {
      const payload = {
        id: item.id,
        due: item.paid_dues,
        state: state
      }
      try {
        await this.$simpleeApi.post(`cobranza/change_pd_due_state/`, payload)
      } catch (error) {
        console.log(error)
      }
    },
    async UpdateCuota (item, state) {
      item.state = state
      try {
        await this.$simpleeApi.put(`cobranza/physical_debtors/${item.id}/`, item)
        this.GetCobranzaClient(item, state)
      } catch (error) {
        console.log(error)
      }
    },
    OkUpdateCuota () {
    },
    async GetCobranzaClient (item, state) {
      const urlParams = {
        search: item.nro_poliza
      }
      if (state === 'PAID') {
        const data = await this.$ListCobranza(1, urlParams)
        console.log(data)
        if (data.count > 0) {
          this.ResultsCobranza.status = true
          this.ResultsCobranza.id = data.results[0].id
        } else {
          let encontre = 0;
          const filtros = [item.rut, item.razon_social, item.email, item.phone]
          let conteo = 0;
          while (encontre < 1) {
            console.log(encontre)
            const page = 1
            const urlParams2 = {
              search: filtros[conteo]
            }
            try {
              const res = await this.$simpleeApi.get('/lead/', {
                params: { page, ...urlParams2 }
              })
              if (res.data.count > 0) {
                this.ResultsClient.status = true
                this.ResultsClient.id = res.data.results[0].id
                encontre = encontre + 1
              } else {
                conteo = conteo + 1
              }
              if (conteo > 3) {
                encontre = encontre + 1
              }
            } catch (error) {
              console.log(error)
            }
          }
        }
      } else {
        const fieldss = `id`
        const data = await this.$getProducts(1, urlParams, fieldss)
        console.log(data)
        if (data[1].count > 0) {
          this.ResultsProduct.status = true
          this.ResultsProduct.id = data[1].results[0].id
        } else {
          let encontre = 0;
          const filtros = [item.rut, item.razon_social, item.email, item.phone]
          let conteo = 0;
          while (encontre < 1) {
            console.log(encontre)
            const page = 1
            const urlParams2 = {
              search: filtros[conteo]
            }
            try {
              const res = await this.$simpleeApi.get('/lead/', {
                params: { page, ...urlParams2 }
              })
              if (res.data.count > 0) {
                this.ResultsClient.status = true
                this.ResultsClient.id = res.data.results[0].id
                encontre = encontre + 1
              } else {
                conteo = conteo + 1
              }
              if (conteo > 3) {
                encontre = encontre + 1
              }
            } catch (error) {
              console.log(error)
            }
          }
        }
      }
      this.$refs['modal-alertreque'].show()
      this.ListCobranza()
    },
    CancelCobro (data) {
      this.$bvModal
        .msgBoxConfirm('¿Esta seguro de poner como cancelada esta cuota?', {
          title: 'Confirmar',
          titleClass: 'mdtitle',
          size: 'md',
          buttonSize: 'md',
          cancelVariant: 'btn text-white p-2 px-3 btn-secondary',
          okVariant: 'btn text-white p-2 px-3 btn-primary',
          okTitle: 'Si',
          cancelTitle: 'No',
          contentClass: 'border-0 radius',
          bodyClass: 'pxmodal',
          headerClass: 'pdmodal border-bottom-0',
          footerClass: 'pdmodal border-top-0',
          centered: true
        })
        .then((value) => {
          if (value) {
            setTimeout(() => this.UpdateCuota(data, 'CANCELLED'), 500)
          }
        })
    },
    PayCobro (data) {
      this.$bvModal
        .msgBoxConfirm('¿Esta seguro de poner como pagado esta cuota?', {
          title: 'Confirmar',
          titleClass: 'mdtitle',
          size: 'md',
          buttonSize: 'md',
          cancelVariant: 'btn text-white p-2 px-3 btn-secondary',
          okVariant: 'btn text-white p-2 px-3 btn-primary',
          okTitle: 'Si',
          cancelTitle: 'No',
          contentClass: 'border-0 radius',
          bodyClass: 'pxmodal',
          headerClass: 'pdmodal border-bottom-0',
          footerClass: 'pdmodal border-top-0',
          centered: true
        })
        .then((value) => {
          if (value) {
            setTimeout(() => this.UpdateCuota(data, 'PAID'), 500)
          }
        })
    }
  }
}
  </script>
  <style lang="scss">
.table {
  width: 100%;
  -webkit-box-shadow: 0px 5px 12px -12px rgba(0, 0, 0, 0.29);
  -moz-box-shadow: 0px 5px 12px -12px rgba(0, 0, 0, 0.29);
  box-shadow: 0px 5px 12px -12px rgba(0, 0, 0, 0.29);
}
.table thead th {
  border: none;
  padding: 15px;
  font-size: 14px;
  text-align: left;
  font-family: "Rubik";
  font-style: normal;
  font-weight: 500;
  line-height: 17px;
  color: #000000;
}
.table thead tr {
  background: #fff;
}
.table tbody tr {
  background: #fff;
}
.table tbody th,
.table tbody td {
  padding: 0.75rem;
  font-size: 14px;
  vertical-align: middle;
  text-align: left;
}
.table tbody td .close span {
  font-size: 12px;
  color: #dc3545;
}
.main-container {
  width: 100%;
}
.form-sections {
  width: 100%;
  padding: 0px 0px;
}
.form-new {
  width: 95%;
  padding: 0px 0px;
}
.newth {
  border-bottom: 3px solid rgba(203, 203, 203, 0.31) !important;
}
.table-wrap {
  overflow-x: scroll;
}
.circle {
  width: 25px;
  height: 25px;
  left: 1273px;
  top: 306px;
  border-color: transparent;
  font-style: normal;
  font-weight: normal;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  padding: 0px;
  line-height: 21px;
  background: var(--primary);
  border-radius: 30px;
}
.imgicon {
  width: 21px;
  max-width: none;
}
</style>
  