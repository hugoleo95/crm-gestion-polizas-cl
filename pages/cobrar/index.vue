<template>
  <div>
    <div class="main-container" />
    <s-tool-bar
      ref="reftoolbar"
      class="toolbar"
      search-input
      cobranza
      filter-by-user
      filter-by-type-buy
      :current-filters="leadsFilters"
      @search="searchConfig"
      @set-rut="setRut"
      @save-filters="setFilters"
      @resetFilters="setFilters"
      @new-lead="newCobro"
    >
      <template #buttons>
       <!--
         <div class="flex flex-row bg-gray-800">
          <nuxt-link :to="{
              name:'cobrar-nuevo',
            }">
            <b-button
              class="text-white shadow-dropdow btn-new ml-2"
              :style="leadsFilters.optionDate ? 'width: 7rem !important; margin-left: 1rem !important;' : ''"
              variant="primary"
            >
              <fa-icon
                class="mr-1"
                :icon="['fas', 'plus']"
              />Nuevo cobro
            </b-button>
          </nuxt-link>
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

          <nuxt-link :to="{name:'cobrar-cuotas',}">
            <b-button
              class="text-white shadow-dropdow btn-new ml-2"
              :style="leadsFilters.optionDate ? 'width: 7rem !important; margin-left: 1rem !important;' : ''"
              variant="info"
            >
              Cuotas Vencidas
            </b-button>
          </nuxt-link>
          <b-button
            class="text-white shadow-dropdow btn-new ml-2"
            :style="leadsFilters.optionDate ? 'width: 7rem !important; margin-left: 1rem !important;' : ''"
            variant="warning"
            @click="importPoliza = true"
          >
            <fa-icon
              class="mr-1"
              :icon="['fas', 'file']"
            />Pólizas Caidas
          </b-button>
        </div>-->
      </template>
    </s-tool-bar>
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
            <template #cell(product_name)="{value}">
              {{ getProductName(value) }}
            </template>
            <template #cell(n_cuotas)="{value}">
              {{ GetCuotasPaid(value) }}
            </template>
            <template #cell(valor_proxima_cuota)="{value}">
              {{ GetPaymentAmount(value) }}
            </template>
            <template #cell(current_payment_type)="{value}">
              {{ GetPaymentType2(value) }}
            </template>
            <template #cell(fecha_pago)="{value}">
              {{ GetPaymentDate(value) }}
            </template>
            <template #cell(dues_list)="{value}">
              {{ getPaymentstatus(value) }}
            </template>
            <template #cell(created_at)="{value}">
              <p>{{ getLeadDate(value) }}</p>
            </template>
            <template #cell(executive)="{value}">
              <p>{{ getLeadUser(value) }}</p>
            </template>
            <template #cell(actions)="{item}">
              <div class="d-flex justify-content-center">
                <button
                  v-b-tooltip.hover
                  class="circle mr-2 bg-white shadow-sm border p-3"
                  title="Información del cobro"
                  @click="ViewCobro(item)"
                >
                  <fa-icon
                    :icon="['fas', 'eye']"
                    class="text-primary"
                    style="font-size: .9rem"
                  />
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
    <s-modal-cobranza
      v-if="modalImport"
      ref="modallead"
      @hidde="onCloseModal"
      @save-lead="onSaveModal"
      @cancel-lead="onCloseModal"
    />
    <s-modal-import-polizas
      v-if="importPoliza"
      ref="modalImporPolizas"
      @hidde="onCloseModalImport"
      @save-lead="onSaveModalImport"
      @cancel-lead="onCloseModalImport"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Session from '@/mixins/auth'
import SToolBar from '~/components/base/SToolBar.vue'
import SModalCobranza from '~/components/base/SModalCobranza.vue'
import SModalImportPolizas from '~/components/base/SModalImportPolizas.vue'
import leadsStaticVars from '~/static/leadsStaticVars.json'
import productscl from '~/static/productsgroup.json'
import productsmx from '~/static/productsgroupmx.json'
export default {
  name: 'Cobrar',
  components: {
    SToolBar,
    SModalCobranza,
    SModalImportPolizas
  },
  mixins: [Session],
  data () {
    return {
      fields: leadsStaticVars.tableFieldsCobranza,
      DataCobro: [],
      modalImport: false,
      importPoliza: false,
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
        tipo_pago: this.leadsFilters.tipo_pago
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
    const id = this.$route.query?.id
    if (id) {
      this.OpenCobranza(id)
    }
    this.resetFilters(this.leadsFilters)
    if (process.env.version === 'CL') {
      this.products = productscl
    } else {
      this.products = productsmx
    }
  },
  mounted () {
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
      this.ViewCobro(data)
    },
    async ListCobranza (page) {
      if (!page) { page = 1 }
      this.page = page
      this.setLoadingLeads(true)
      const data = await this.$ListCobranza(page, this.urlParams)
      const Response = data.results
      this.totalRows = data.count
      for (let i = 0; i < Response.length; i++) {
        if (Response[i].lead_details) {
          if (Response[i].lead_details.razon_social) {
            Response[i].name = Response[i].lead_details.razon_social
          } else if (Response[i].lead_details.name && Response[i].lead_details.last_name) {
            Response[i].name = Response[i].lead_details.name + ' ' + Response[i].lead_details.last_name
          } else if (!Response[i].lead_details.name && Response[i].lead_details.last_name) {
            Response[i].name = Response[i].lead_details.last_name
          } else if (Response[i].lead_details.name && !Response[i].lead_details.last_name) {
            Response[i].name = Response[i].lead_details.name
          } else {
            Response[i].name = 'Sin lead'
          }
        }
        if (Response[i].product_details) {
          if (Response[i].product_details.name) {
            Response[i].product_name = Response[i].product_details.name
          } else {
            Response[i].product_name = 'Sin producto'
          }
          if (Response[i].product_details.nro_poliza) {
            Response[i].nro_poliza = Response[i].product_details.nro_poliza
          } else {
            Response[i].nro_poliza = 'Sin poliza'
          }
        }

        if (Response[i].dues_list) {
          Response[i].payment_type = Response[i].dues_list
          Response[i].n_cuotas = Response[i].dues_list
          Response[i].valor_proxima_cuota = Response[i].dues_list
          Response[i].fecha_pago = Response[i].dues_list
        }
      }

      this.setLoadingLeads(false)
      this.DataCobro = Response
    },
    resetFilters (localFilters) {
      const filters = {
        ...localFilters
      }
      if (localFilters.tipo_pago.length === 0) {
        filters.tipo_pago = leadsStaticVars.typesbuyKeys
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
    GetPaymentType (value) {
      let type
      for (let i = 0; i < value.length; i++) {
        if (!type) {
          if (value[i].state === 'pending') {
            type = value[i]
          }
        }
      }
      if (!type) {
        for (let i = 0; i < value.length; i++) {
          if (value[i].state === 'paid') {
            type = value[i]
          }
        }
      }
      const PageType = this.typesPaid.find(({ value }) => value === type.cobranza_payment_type)
      if (PageType) { return PageType.text }
      return 'Sin Tipo'
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
    ViewCobro (value) {
      const id = value.id
      const item = value
      this.$router.push({ name: 'cobrar-ver', query: { id, item } })
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
</style>
