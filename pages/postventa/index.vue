<template>
  <div>
    <product-modal
      v-if="modal"
      v-model="product"
      @save="onSaveModal"
      @hidde="onCloseModal"
      @cancel="onCloseModal"
      @cancel2="onCloseModal2"
    />
    <div class="table-container">
      <s-tool-bar
        ref="reftoolbar"
        class="toolbar"
        :users="users"
        search-field
        postventa
        filter-by-products
        filter-by-companies
        filter-by-type-product
        filter-by-state-bitacora
        filter-by-user
        filter-by-referral
        active-post
        filter-by-renewal-dates
        :current-filters="leadsFilters"
        @search="searchConfig"
        @set-rut="setRut"
        @save-filters="setFilters"
        @resetFilters="resetFilters"
        @new-lead="newPoliza"
      >
        <template #buttons>
          <b-button
            class="text-white shadow-dropdow btn-new ml-2"
            variant="primary"
            @click="CheckAddProduct();"
          >
            <fa-icon
              class="mr-1"
              :icon="['fas', 'plus']"
            />Nuevo Producto
          </b-button>
          <download-informe-ventas class="ml-4" />
        </template>
      </s-tool-bar>
      <div class="d-flex mb-2 justify-content-end results">
        <span> {{ totalItems }} Resultados</span>
      </div>
      <div class="actionbar d-flex align-items-center">
        <b-form-checkbox
          :checked="areProductsSelected"
          size="lg"
          class="mx-2"
          :disabled="loadingProducts"
          @change="toggleRows"
        />
        <div
          v-if="areProductsSelected"
          class="actions"
        >
          <div class="group">
            <div class="px-3">
              <fa-icon
                :icon="['far', 'calendar-check']"
                role="button"
                title="Marcar como vigente"
                @click="markProducts({ state: 'valid' })"
              />
            </div>
            <span class="separator" />
            <div>
              <b-dropdown
                variant="link"
                toggle-class="text-decoration-none"
                no-caret
              >
                <template #button-content>
                  <fa-icon
                    :icon="['fas', 'check-circle']"
                    class="text-secondary"
                    style="font-size: 18px"
                    title="Marcar como pagada"
                  />
                </template>
                <b-dropdown-item @click="markProducts({ client_payment_state: 'paid' })">
                  Pagada por el cliente
                </b-dropdown-item>
                <b-dropdown-item @click="markProducts({ company_payment_state: 'paid' })">
                  Pagada por la compañia
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
          <div class="group">
            <div>
              <b-dropdown
                variant="link"
                toggle-class="text-decoration-none"
                no-caret
              >
                <template #button-content>
                  <fa-icon
                    :icon="['far', 'clock']"
                    class="text-secondary"
                    style="font-size: 18px"
                    title="Marcar como pago pendiente"
                  />
                </template>
                <b-dropdown-item @click="markProducts({ client_payment_state: 'pending' })">
                  Por el cliente
                </b-dropdown-item>
                <b-dropdown-item @click="markProducts({ company_payment_state: 'pending' })">
                  Por la compañia
                </b-dropdown-item>
              </b-dropdown>
            </div>
            <span class="separator" />
            <div class="px-3">
              <fa-icon
                :icon="['fas', 'ban']"
                role="button"
                title="Marcar como cancelada"
                @click="markProducts({ state: 'canceled' })"
              />
            </div>
          </div>
        </div>
      </div>

      <b-card
        no-body
        class="table"
      >
        <b-table
          ref="productTable"
          sticky-header="100%"
          no-border-collapse
          responsive
          :per-page="25"
          :items="items"
          :fields="fieldsWithSelected"
          :busy="loadingProducts"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          selectable
          select-mode="multi"
          @row-selected="onRowSelected"
        >
          <template #table-busy>
            <div class="d-flex">
              <div class="text-center text-primary pa-5 mx-auto">
                <b-spinner class="align-middle" />
                <strong>Cargando...</strong>
              </div>
            </div>
          </template>
          <template #cell(fecha_inicio_vigencia)="{ value }">
            <p>{{ getLeadDate(value) }}</p>
          </template>
          <template #cell(fecha_termino_vigencia)="{ value }">
            <p>{{ getLeadDate(value) }}</p>
          </template>
          <template #cell(selected)="{ rowSelected, index }">
            <b-form-checkbox
              :checked="rowSelected"
              :value="true"
              @change="selectRow({ row: index, selected: $event })"
            />
          </template>

          <template #cell(state)="{ value }">
            <div
              v-if="value"
              class="w-100 flex"
            >
              <div
                :class="`circle ${value} mx-auto`"
                :title="states[value].text"
              >
                <fa-icon
                  v-if="value"
                  :icon="states[value].icon"
                  :title="states[value].text"
                  class="text-white"
                />
              </div>
            </div>
          </template>
          <template #cell(email)="{ value }">
            <a
              :href="`https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${value}`"
              target="_blank"
              :title="value"
            >{{ value.slice(0, 15) }}...</a>
          </template>
          <template #cell(name)="{ value }">
            <p>{{ getProductName(value) }}</p>
          </template>
          <template #cell(compnay)="{ value }">
            <p>{{ getCompanyName(value) }}</p>
          </template>
          <template #cell(user)="{ value }">
            <p>{{ getLeadUser(value) }}</p>
          </template>
          <template #cell(renewable)="{ value }">
            <p>{{ getRenewal(value) }}</p>
          </template>

          <template #cell(actions)="{ item }">
            <div class="d-flex justify-content-center">
              <button
                class="circle mr-2 bg-white shadow-sm border p-3"
                @click="editExistingProduct(item.id)"
              >
                <fa-icon
                  :icon="['fas', 'edit']"
                  class="text-primary"
                  style="font-size: 0.9rem"
                />
              </button>

              <button
                v-if="$store.state.localStorage.user.is_superuser"
                class="circle bg-white shadow-sm border p-3"
                @click="deleteProduct(item)"
              >
                <fa-icon
                  :icon="['fas', 'trash-alt']"
                  class="text-danger"
                  style="font-size: 0.9rem"
                />
              </button>
              <button
              v-b-tooltip.hover
              class="circle bg-white shadow-sm border p-3"
              title="Crear endoso o renovación"
              @click="CrearRenoEndoso(item)"
            >
              <fa-icon
                :icon="['fas', 'file']"
                class="text-primary"
                style="font-size: 0.9rem"
              />
            </button>
            </div>
          </template>
        </b-table>
      </b-card>

      <div class="pages">
        <b-pagination
          class="mb-0"
          align="center"
          :value="page"
          :per-page="25"
          :total-rows="totalItems"
          pills
          size="sm"
          @change="getLeadspagition"
        />
      </div>
      <b-modal
        ref="modal-alert"
        hide-footer
        title="AVISO"
      >
        <div class="d-block text-center">
          <h5>EL REGISTRO DE LA POLIZA SE GUARDO EXITOSAMENTE</h5>
        </div>
        <b-button
          class="mt-3"
          variant="outline-success"
          block
          @click="getSavedProduct"
        >
          Ir a la poliza
        </b-button>
        <b-button
          class="mt-3"
          variant="outline-danger"
          block
          @click="closeAlertModal"
        >
          Cerrar
        </b-button>
      </b-modal>
    </div>
    <request-product-modal
      v-if="addproduct"
      postventa
      @hidde="onCloseModal"
      @save-lead="onSaveProduct"
      @cancel-lead="onCloseModal"
    />
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
/* eslint-disable camelcase */
import { mapState, mapMutations } from 'vuex'
import Session from '@/mixins/auth'
import SToolBar from '~/components/base/SToolBar.vue'
import productModal from '~/components/productModal.vue'
import DownloadCsv from '~/components/DownloadCsv.vue'
import DownloadInformeVentas from '~/components/DownloadInformeVentas.vue'
import tableFields from '~/static/polizas/tableFields.json'
import RequestProductModal from '~/components/RequestProductModal.vue'
import companiesList from '~/static/polizas/companiesList.json'
import productsList from '~/static/polizas/productsList.json'
import products from '~/static/products.json'
import companies from '~/static/companies.json'

export default {
  name: 'Polizas',
  components: {
    SToolBar,
    productModal,
    DownloadInformeVentas,
    RequestProductModal,
    DownloadCsv
  },
  mixins: [Session],
  data () {
    return {
      page: 1,
      rut: '',
      search: '',
      searchrut: false,
      addproduct: false,
      sortBy: '',
      poliza_new: '',
      dateField: 'fecha_termino_vigencia',
      totalItems: 1,
      fields: tableFields,
      items: [],
      product: {},
      productsSelected: [],
      companiesSelected: [],
      selectedProducts: [],
      states: {
        valid: {
          text: 'Vigente',
          icon: ['fas', 'check']
        },
        invalid: {
          text: 'No Vigente',
          icon: ['fas', 'times']
        },
        change_company: {
          text: 'Cambio compañia',
          icon: ['fas', 'landmark']
        },
        canceled: {
          text: 'Cancelada',
          icon: ['fas', 'times']
        },
        renewed: {
          text: 'Renovada',
          icon: ['fas', 'redo']
        },
        pending: {
          text: 'Pendiente',
          icon: ['far', 'clock']
        },
        paid: {
          text: 'Pagada',
          icon: ['fas', 'check']
        },
        canceled_nopay: {
          text: 'Cancelada Por No Pago',
          icon: ['fas', 'times']
        }
      },
      products,
      companies,
      sortDesc: false,
      modal: false,
      loadingProductById: false
    }
  },
  computed: {
    ...mapState(['leadsFilters']),
    ...mapState('leads', ['users', 'executiveSearch', 'loadingProducts']),
    sort () {
      const { sortBy, sortDesc, dateField } = this
      const field = sortBy === dateField ? 'fecha_termino_vigencia' : sortBy
      return sortDesc ? `-${field}` : field
    },
    areProductsSelected () {
      return this.selectedProducts.length > 0
    },
    fieldsWithSelected () {
      if (this.areProductsSelected) {
        return [{ label: '', key: 'selected' }, ...this.fields]
      }
      return this.fields
    },
    urlParams () {
      return {
        addproduct: false,
        sort_by: this.sort,
        search: this.leadsFilters.search,
        searchrut: this.searchrut,
        rut: this.rut,
        user: this.leadsFilters.id,
        product_type: this.leadsFilters.product_type,
        start: this.leadsFilters.startDate,
        emited_date_start: this.leadsFilters.emitedStartDate,
        emited_date_end: this.leadsFilters.emitedEndDate,
        end: this.leadsFilters.endDate,
        products: this.leadsFilters.products,
        companies: this.leadsFilters.companies,
        referred: this.leadsFilters.refferal,
        channel: this.leadsFilters.channel,
        selected_date_filter: this.leadsFilters.selectedDateFilter,
        mes_termino_vigencia: this.leadsFilters.mes_termino_vigencia,
        bitacora_status: this.leadsFilters.bitacora_status
      }
    }
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler (queries) {
        if (queries.id) {
          this.getProductById(queries.id)
        }
      }
    },
    urlParams: {
      deep: true,
      handler () {
        this.fetchProducts(this.page)
      }
    }
  },
  created () {
    this.resetFilters(this.leadsFilters)
  },
  beforeDestroy () {
    this.setLoadingProducts(false)
  },
  methods: {
    ...mapMutations(['setFilters']),
    ...mapMutations('leads', ['setLoadingProducts']),
    resetFilters (filters) {
      const newfilters = {
        ...filters
      }
      if (filters.products.length === 0) {
        newfilters.products =
          productsList.products[process.env.version?.toLowerCase() ?? 'mx']
      }
      if (filters.companies.length === 0) {
        newfilters.companies =
          companiesList.companies[process.env.version?.toLowerCase() ?? 'mx']
      }
      if (filters.product_type.length === 0) {
        const list = ['poliza', 'endoso', 'renovacion']
        newfilters.product_type = list
      }
      this.setFilters(newfilters)
    },
    newPoliza () {
      this.addproduct = true
    },
    CheckAddProduct () {
        this.addproduct = true
    },
    async onSaveProduct (value) {
      const product = await this.$PostProduct(value)
      console.log(product)
      if (product.id) {
        this.addproduct = false
        this.$store.commit('setAlertMessage', {
          success: 'Se registro el producto exitosamente!'
        })
      } else {
        this.$store.commit('setAlertMessage', {
          error: 'hubo un error al guardar el producto'
        })
      }
      this.getLeadspagition(this.page)
    },
    async onCloseModal2 () {
      await this.getLeadspagition(this.page)
      this.addproduct = false
    },
    getLeadUser (user) {
      if (user) {
        const response = this.$store.state.leads.users.find(
          ({ id }) => user === id
        )
        if (response) {
          if (response.first_name) {
            return response.first_name
          } else {
            return response.email.split('@')[0]
          }
        } else {
          'usuario invalido'
        }
      }
      return 'Sin asignar'
    },
    getLeadDate (leadDate) {
      if (!leadDate) {
        return ''
      }
      const [year, month, day] = leadDate.split('-')
      return new Date(year, parseInt(month) - 1, day).toLocaleDateString(
        'en-GB'
      )
    },
    getRenewal (value) {
      if (value === 'renovable') {
        return 'Renovable'
      } else if (value === 'no_renovable') {
        return 'No renovable'
      } else if (value === 'extension_fecha') {
        return 'Extension fecha'
      }
    },
    getCompanyName (key) {
      return this.companies.reduce(
        (a, { text, value }) => ({ ...a, [value]: text }),
        {}
      )[key]
    },
    getProductName (key) {
      return Object.values(this.products).reduce(
        (acc, curr) => ({
          ...acc,
          ...curr.reduce((a, { text, value }) => ({ ...a, [value]: text }), {})
        }),
        {}
      )[key]
    },
    onRowSelected (items) {
      this.selectedProducts = items
    },
    toggleRows (all) {
      if (all) {
        this.$refs.productTable.selectAllRows()
      } else {
        this.$refs.productTable.clearSelected()
      }
    },
    searchConfig (value) {
      if (this.searchrut) {
        this.search = ''
        this.rut = value
      } else {
        this.search = value
        this.rut = ''
      }
    },
    setRut (valid) {
      this.searchrut = valid
    },
    selectRow ({ row, selected }) {
      if (selected) {
        this.$refs.productTable.selectRow(row)
      } else {
        this.$refs.productTable.unselectRow(row)
      }
    },
    async markProducts (options = {}) {
      const products = this.selectedProducts.map(({ id }) => id)
      this.toggleRows(false)
      await this.$markProducts({ products, ...options })
      this.getLeadspagition(this.page)
    },
    async getLeadspagition (page) {
      this.setLoadingProducts(true)
      if (this.urlParams.selected_date_filter === 'createdAt') {
        delete this.urlParams.end
        delete this.urlParams.start
      } else {
        delete this.urlParams.emited_date_end
        delete this.urlParams.emited_date_start
      }
      const fieldss = `id,nro_poliza,lead_request,lead,name,company,fecha_inicio_vigencia,fecha_termino_vigencia,prima,comision,state,product_type,user`
      const [error, data] = await this.$getProducts(page, this.urlParams, fieldss)
      this.page = page
      if (!error) {
        const { results, count } = data
        this.totalItems = count

        const formattedName = lead =>
          `${lead?.name || ''} ${lead?.last_name || ''}`

        this.items = results.map(({ user, lead, ...rest }) => {
          if (lead) {
            if (!user) {
              return {
                ...rest,
                lead,
                user: lead.user,
                razon_social: lead.razon_social,
                names: formattedName(lead)
              }
            }
            return {
              ...rest,
              user,
              lead,
              razon_social: lead.razon_social,
              names: formattedName(lead)
            }
          } else {
            const lead2 = {
              name: 'Sin',
              last_name: 'Lead'
            }
            return {
              ...rest,
              user,
              lead,
              razon_social: 'Sin lead',
              names: formattedName(lead2)
            }
          }
        })
      }

      this.setLoadingProducts(false)
    },
    async fetchProducts (page) {
      page = 1
      this.setLoadingProducts(true)
      if (this.urlParams.selected_date_filter === 'createdAt') {
        delete this.urlParams.end
        delete this.urlParams.start
      } else {
        delete this.urlParams.emited_date_end
        delete this.urlParams.emited_date_start
      }
      const fieldss = `id,nro_poliza,lead_request,lead,name,company,fecha_inicio_vigencia,fecha_termino_vigencia,prima,comision,state,product_type,user`
      const [error, data] = await this.$getProducts(page, this.urlParams, fieldss)
      this.page = page
      if (!error) {
        const { results, count } = data
        this.totalItems = count

        const formattedName = lead =>
          `${lead?.name || ''} ${lead?.last_name || ''}`
        this.items = results.map(({ user, lead, ...rest }) => {
          if (lead) {
            if (!user) {
              return {
                ...rest,
                lead,
                user: lead.user,
                razon_social: lead.razon_social,
                names: formattedName(lead)
              }
            }
            return {
              ...rest,
              user,
              lead,
              razon_social: lead.razon_social,
              names: formattedName(lead)
            }
          } else {
            const lead2 = {
              name: 'Sin',
              last_name: 'Lead'
            }
            return {
              ...rest,
              user,
              lead,
              razon_social: 'Sin lead',
              names: formattedName(lead2)
            }
          }
        })
      }
      this.setLoadingProducts(false)
    },
    editExistingProduct (id) {
      const newQuery = { id }
      this.updateProductIdInQuery(newQuery)
    },
    async getProductById (id) {
      this.loadingProductById = true
      let data;
      [, data] = await this.$getProduct({ id })
      if (data.lead_request) {
        const datasolicitud = await this.$GetRequest(
          data.lead_request
        )
        if (datasolicitud.digital_quotation) {
          data.digital_quotation = datasolicitud.digital_quotation
        }
      }
      this.modal = true
      this.product = data
      this.loadingProductById = false
    },
    async onSaveModal () {
      await this.saveProduct()
      await this.getLeadspagition(this.page)
      this.onCloseModal()
    },
    onCloseModal () {
      this.addproduct = false
      this.product = {}
      //this.$router.replace({ query: null })
      this.modal = false
    },
    closeAlertModal () {
      this.$refs['modal-alert'].hide()
    },
    async saveProduct () {
      if (this.product.product_type === 'poliza') {
        delete this.product.endorsement_info
        delete this.product.renewal_info
      }
      if (this.product.product_type === 'renovacion') {
        this.product.comision = 0
        this.product.comision_final = 0
        delete this.product.endorsement_info
        this.product.renewal_info = {
          renewal_number: this.product.renewal_number
        }
      }
      if (this.product.product_type === 'endoso') {
        this.product.renewable = null
        delete this.product.renewal_info
        this.product.renewable = null
        this.product.endorsement_info = {
          endorsement_nro: this.product.endorsement_nro
        }
      }
      /* console.log('documents of product', this.product.documents.length)
      if (this.product.documents.length > 0) {
        this.product.mod = true
      } */
      // this.product.mod = this.checkNroPoliza()
      const [error, data] = await this.$updateProduct(
        this.product.id,
        this.product
      )
      this.product = {}
      console.log({ error, data })
      this.poliza_new = data.id
      this.$refs['modal-alert'].show()
    },
    checkNroPoliza () {
      if (this.isValidNroPoliza(this.product.nro_poliza)) {
        return true
      } else {
        return false
      }
    },
    isValidNroPoliza (nro_poliza) {
      const regex = /^(?!.*[a-zA-Z]{3}).+$/
      return nro_poliza !== '' && regex.test(nro_poliza)
    },
    CrearRenoEndoso (data) {
      this.$bvModal
        .msgBoxConfirm(
          '¿Esta seguro de crear un endoso o renovación a este producto?',
          {
            title: 'Confirmar',
            titleClass: 'mdtitle',
            size: 'md',
            buttonSize: 'md',
            cancelVariant: 'btn text-white p-2 px-3 btn-secondary',
            okVariant: 'btn text-white p-2 px-3 btn-danger',
            okTitle: 'Si',
            cancelTitle: 'No',
            contentClass: 'border-0 radius',
            bodyClass: 'pxmodal',
            headerClass: 'pdmodal border-bottom-0',
            footerClass: 'pdmodal border-top-0',
            centered: true
          }
        )
        .then((value) => {
          if (value) {
            setTimeout(() => this.PostEndosoRenovacion(data), 500)
          }
        })
    },
    async PostEndosoRenovacion (data) {
      console.log(data)
      if (data.lead_request) {
        const Response = await this.$GetRequest(data.lead_request)
        console.log(Response)
        const requestdinamin = {
          aditional_data: null,
          product_interest: Response.product_interest,
          tags: [],
          product_group: Response.product_group,
          request_type: Response.request_type,
          state: Response.state,
          place: Response.place,
          state_reason: Response.state_reason,
          priority_score: Response.priority_score,
          user: this.$store.state.localStorage.user.id,
          comment: null,
          lead: Response.lead,
          referred: Response.referred,
          referral_code: Response.referral_code,
          quotation_received: Response.quotation_received,
          adjudication_date: Response.adjudication_date,
          quotation_delivered: Response.quotation_delivered,
          campaign_slug: 'desde-clientes'
        }
        const error = await this.$PostRequest(requestdinamin)
        if (error) {
          const query = {
            idrequest: error.id,
            tipo: 'clientes',
            poliza: data.id,
            comeTo: 'productos'
          }
          this.$router.push({ path: 'solicitudes', query })
        }
      } else {
        this.$store.commit('setAlertMessage', {
          error: 'Este producto no tiene solicitud'
        })
      }
    },
    deleteProduct (product) {
      this.$bvModal
        .msgBoxConfirm('¿Desea eleminar esta poliza?', {
          title: 'Confirmar',
          titleClass: 'mdtitle',
          size: 'md',
          buttonSize: 'md',
          okVariant: 'danger',
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
            this.$deleteProduct(product)
            this.getLeadspagition(this.page)
          }
        })
    },
    getSavedProduct () {
      this.closeAlertModal()
      if (this.poliza_new) {
        const newQuery = { id: this.poliza_new }
        this.updateProductIdInQuery(newQuery)
      }
    },
    updateProductIdInQuery (query) {
      this.$router.push({ name: 'postventa', query })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-container {
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: none;
  margin-bottom: 1.5em;
}

.table {
  height: calc(100vh - 16rem);
  background-color: #ffffff;
}

.pages {
  grid-row: 4;
  grid-column: 1 / span 2;
}
.circle {
  width: 33px;
  height: 33px;
  left: 1273px;
  top: 306px;
  border-color: transparent;
  font-style: normal;
  font-weight: normal;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  padding: 6px;
  line-height: 21px;
  background: var(--primary);
  border-radius: 30px;

  &.canceled {
    background: #ea1051;
  }
  &.delete {
    background: #ea1051;
  }
  &.valid {
    background: var(--primary);
  }
  &.renewed {
    background: #052f59;
  }
  &.pending {
    background: #f07f28;
  }
}
.separator {
  border-left: 0.75px solid #acacac; /* Border on the left */
  width: 0.75px; /* Width instead of height */
  height: 26px;
}
.actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  list-style-type: none;
  .group {
    margin-right: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    div {
      color: #acacac;
      font-size: 18px;
    }
  }
}
.pdmodal {
  padding: 2rem !important;
}
.pxmodal {
  padding-left: 2rem !important;
  padding-right: 2rem !important;
}
.radius {
  border-radius: 6px !important;
}
.mdtitle {
  font-size: 24px !important;
  line-height: 28px !important;
}
.results span {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 14px;
  color: #acacac;
}
</style>
