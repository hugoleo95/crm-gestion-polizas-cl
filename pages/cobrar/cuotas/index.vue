<template>
  <div>
    <div class="main-container" />
    <s-tool-bar-cobranza-cuotas
      ref="reftoolbar"
      class="toolbar"
      :current-filters="leadsFilters"
      filter-by-companies
      filter-by-type-buy
      search-input
      @save-filters="ListCuotas"
      @resetFilters="setFilters"
      @getListCuotas="ListCuotas"
    />
    <div class="d-flex justify-content-between mb-0">
      <nuxt-link
        :to="{
          name: 'cobrar',
        }"
      >
        <span class="text-base pointer">
          <fa-icon
            :icon="['fas', 'arrow-left']"
            class="text-primary return mt-4"
          />
          <b>Regresar a pagos</b>
        </span>
      </nuxt-link>
    </div>
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
            :items="DataCuotas"
            :fields="fields"
            responsive="sm"
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
            <template #cell(cobranza_payment_type)="{value}">
              {{ GetPaymentType2(value) }}
            </template>
            <template #cell(executive)="{value}">
              <p>{{ getLeadUser(value) }}</p>
            </template>
            <template #cell(amount)="{ value }">
              {{ getFormattedPrice(value, true) }}
            </template>
            <template #cell(actions)="{item}">
              <div class="d-flex justify-content-center">
                <button
                  v-b-tooltip.hover
                  class="circle mr-2 bg-white shadow-sm border p-3"
                  title="Información de la Cobranza"
                  @click="ViewCobro(item)"
                >
                  <fa-icon
                    :icon="['fas', 'eye']"
                    class="text-primary"
                    style="font-size: .9rem"
                  />
                </button>
                <button
                  v-b-tooltip.hover
                  class="circle mr-2 bg-white shadow-sm border p-3"
                  title="Enviar Correo Notificando la Cuota"
                  @click="confirmSendEmail(item)"
                >
                  <fa-icon
                    :icon="['fas', 'envelope']"
                    class="text-primary"
                    style="font-size: .9rem"
                  />
                </button>
                <button
                  v-b-tooltip.hover
                  class="circle mr-2 bg-white shadow-sm border p-3"
                  title="Enviar Whatsapp Notificando la Cuota"
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
              @change="ListCuotas"
            />
          </div>
        </div>
      </div>
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
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import SToolBarCobranzaCuotas from '~/components/base/SToolBarCobranzaCuotas'
import leadsStaticVars from '~/static/leadsStaticVars.json'
import Session from '@/mixins/auth'
import productscl from '~/static/productsgroup.json'
import productsmx from '~/static/productsgroupmx.json'
import { getFormattedPrice } from '@/helpers/sharedFunctions'
export default {
  name: 'CobrarCuotas',
  components: {
    SToolBarCobranzaCuotas
  },
  mixins: [Session],
  data () {
    return {
      fields: leadsStaticVars.tableFieldsCuotasVencidas,
      DataCuotas: [],
      fecha: this.currentDate,
      pag: 1,
      currentDate: '',
      messageError: '',
      totalRows: '',
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
        fecha: this.currentDate
      }
    }
  },
  watch: {
    urlParams: {
      deep: true,
      handler () {
        if (!this.loadingLeads) {
          this.ListCuotas(this.urlParams, this.page)
        }
      }
    }
  },
  created () {
    if (process.env.version === 'CL') {
      this.products = productscl
    } else {
      this.products = productsmx
    }
    this.currentDate = this.getCurrentDate()
  },
  mounted () {
    this.ListCuotas(this.urlParams, this.pag)
  },
  beforeDestroy () {
    this.setLoadingLeads(true)
  },
  methods: {
    ...mapMutations('leads', ['setLoadingLeads']),
    ...mapMutations(['setFilters']),
    getFormattedPrice,
    async ListCuotas (date, page) {
      if (!page) { page = 1 }
      if (!date) { date = this.fecha } else { this.fecha = date }
      this.page = page
      this.setLoadingLeads(true)
      console.log(date)
      console.log('fecha listcuotas', this.fecha)
      const data = await this.$ListCuotasVencidas(page, date)
      const Response = data.results
      this.totalRows = data.count
      for (let i = 0; i < Response.length; i++) {
        if (Response[i].payment_details) {
          if (Response[i].payment_details.product) {
            if (Response[i].payment_details.product.nro_poliza) {
              Response[i].nro_poliza = Response[i].payment_details.product.nro_poliza
            }
            if (Response[i].payment_details.product.company) {
              Response[i].company = Response[i].payment_details.product.company
            }
            if (Response[i].payment_details.product.prima) {
              Response[i].prima = Response[i].payment_details.product.prima
            }
            if (Response[i].payment_details.product.group) {
              Response[i].group = Response[i].payment_details.product.group
            }
          }
        }
      }
      this.setLoadingLeads(false)
      this.DataCuotas = Response
    },
    getCurrentDate () {
      const date = new Date()
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    GetPaymentDate (value) {
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
      // const createdAt = new Date(ObjectDate.date).toLocaleString()
      // const [date] = createdAt.split(',')
      return `${ObjectDate.date}`
    },
    GetPaymentType2 (type) {
      const PageType = this.typesPaid.find(({ value }) => value === type)
      if (PageType) { return PageType.text }
      return 'Sin Tipo'
    },
    ViewCobro (value) {
      const id = value.collect_payment
      const route = 'cuotasCobranza'
      this.$router.push({ name: 'cobrar-ver', query: { id, route } })
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
    async SendEmail (value) {
      try {
        const id = value.id
        const resp = await this.$simpleeApi.get(`/recordatorio_cobranza/${id}`)
        console.log(resp.data.Message.mensaje)
        if (resp.data.Message.mensaje) {
          this.messageError = resp.data.Message.mensaje
        }
        this.$refs['modal-alert'].show()
      } catch (error) {
        if (error) {
          this.messageError = error
        }
        this.$store.commit('setAlertMessage', error)
        this.$refs['modal-alert2'].show()
      }
    },
    async SendWhatsapp (value) {
      try {
        const id = value.id
        const resp = await this.$simpleeApi.post('/wsp_msj/', {
          due: id
        })
        const url = resp.data.url.url
        console.log(url)
        window.open(url, '_blank')
      } catch (error) {
        // this.$refs['modal-alert2'].show()
      }
    },
    closeRequestAlertModal () {
      this.$refs['modal-alert'].hide()
    },
    closeRequestAlertModal2 () {
      this.$refs['modal-alert2'].hide()
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
    }
  }
}
</script>
