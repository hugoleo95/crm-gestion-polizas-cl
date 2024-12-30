<template>
  <div class="d-flex justify-content-between flex-column">
    <div class="d-flex justify-content-between">
      <div
        v-if="selectedFilter"
        class="transparent-bg"
        @click="hiddeFilters"
      />
      <div class="d-flex">
        <b-button
          v-b-tooltip.hover
          class="text-white clearFiltersBtn mr-3"
          variant="primary"
          pill
          size="sm"
          title="Limpiar filtros"
          @click="resetFilters"
        >
          <fa-icon
            :icon="['fas', 'times']"
            class="text-white"
            style="font-size: 1.2rem"
          />
        </b-button>

        <b-dropdown
          ref="dropdown"
          class="shadow-dropdow mr-4"
          variant="light"
          toggle-class="text-dropdown"
          no-caret
        >
          <template #button-content>
            <div class="icon">
              <fa-icon :icon="['far', 'calendar-alt']" /> {{ dateToday }}
            </div>
          </template>
          <b-dropdown-form
            header="Filtrar por Fecha"
          >
            <div class="d-flex justify-content-between align-items-center mt-2 mb-3">
              <label for="example-input">
                Hasta
              </label>
              <input
                v-model="localFilters.fecha"
                type="date"
                placeholder="YYYY-MM-DD"
                autocomplete="off"
                class="ml-2 px-2"
              >
            </div>

            <b-button
              variant="primary"
              size="sm"
              block
              @click="setCustomDatesRange()"
            >
              Filtrar
            </b-button>
          </b-dropdown-form>
        </b-dropdown>

        <b-dropdown
          ref="filterDropdown"
          variant="light"
          toggle-class="text-dropdown"
          class="shadow-dropdow mr-4"
          no-caret
        >
          <template #button-content>
            <div class="icon">
              <fa-icon :icon="['fas', 'filter']" /> Filtros
            </div>
          </template>
          <div
            class="p-1"
            style="width: 20rem"
          >
            <b-dropdown-form @click="selectFilter">
              <div
                v-if="filterByUser"
                class="d-flex justify-content-between align-items-center my-2"
              >
                <label>
                  Ejecutivo
                </label>
                <b-form-select
                  v-model="email"
                  :options="executivesOptions"
                  style="width: 55%"
                />
              </div>
              <div
                v-if="filterByProducts"
                class="d-flex justify-content-between align-items-center my-2 position-relative"
              >
                <label>
                  Productos
                </label>
                <div
                  class="custom-select"
                  style="width: 55%"
                  title="products"
                  @click="selectFilter"
                >
                  Seleccionar
                </div>
                <b-dropdown-form
                  v-show="selectedFilter === 'products'"
                  class="fake-dropdowns"
                  name="products"
                >
                  <b-form-checkbox
                    v-model="allSelectedProduct"
                    class="d-flex flex-column font-weight-bold text-nowrap"
                    type="checkbox"
                    name="products"
                    @change="toggleAllProduct"
                  >
                    {{ allSelectedProduct ? '(Deseleccionar todo)' : '(Seleccionar todo)' }}
                  </b-form-checkbox>
                  <b-form-checkbox-group
                    v-model="localFilters.products"
                    :options="allProducts"
                    class="d-flex flex-column text-nowrap"
                    type="checkbox"
                    name="products"
                  />
                </b-dropdown-form>
              </div>
              <div
                v-if="filterByCompanies"
                class="d-flex justify-content-between align-items-center my-2 position-relative"
              >
                <label>
                  Compañias
                </label>
                <div
                  class="custom-select"
                  style="width: 55%"
                  title="companies"
                  @click="selectFilter"
                >
                  Seleccionar
                </div>
                <b-dropdown-form
                  v-show="selectedFilter === 'companies'"
                  class="fake-dropdowns"
                  name="companies"
                >
                  <b-form-checkbox
                    v-model="allSelectedCompanies"
                    class="d-flex flex-column font-weight-bold text-nowrap"
                    type="checkbox"
                    name="companies"
                    @change="toggleAllCompanies"
                  >
                    {{ allSelectedCompanies ? '(Deseleccionar todo)' : '(Seleccionar todo)' }}
                  </b-form-checkbox>
                  <b-form-checkbox-group
                    v-model="localFilters.company"
                    :options="allCompanies"
                    class="d-flex flex-column"
                    type="checkbox"
                    name="companies"
                  />
                </b-dropdown-form>
              </div>
              <div
                v-if="filterByTypeBuy"
                class="d-flex justify-content-between align-items-center my-2 position-relative"
              >
                <label>
                  Tipo Pago
                </label>
                <div
                  class="custom-select"
                  style="width: 55%"
                  title="typebuy"
                  @click="selectFilter"
                >
                  Seleccionar
                </div>
                <b-dropdown-form
                  v-show="selectedFilter === 'typebuy'"
                  class="fake-dropdowns"
                  name="typebuy"
                >
                  <b-form-checkbox
                    v-model="allSelectedTypesBuys"
                    class="d-flex flex-column font-weight-bold text-nowrap"
                    type="checkbox"
                    name="typebuy"
                    @change="toggleAllTypesBuys"
                  >
                    {{ allSelectedTypesBuys ? '(Deseleccionar todo)' : '(Seleccionar todo)' }}
                  </b-form-checkbox>
                  <b-form-checkbox-group
                    v-model="localFilters.tipo_pago"
                    :options="allTypesBuy"
                    class="d-flex flex-column"
                    type="checkbox"
                    name="typebuy"
                  />
                </b-dropdown-form>
              </div>
              <div
                v-if="filterByPolicy"
                class="d-flex justify-content-between align-items-center my-2 position-relative"
              >
                <label>
                  N Poliza
                </label>
                <div class="relative">
                  <input
                    v-model="localFilters.nro_policy"
                    class="px-2"
                    placeholder="Ingrese"
                    @input="debouncedSearch"
                  >
                </div>
              </div>
              <div class="mt-4 d-flex">
                <b-button
                  class="text-white"
                  variant="primary"
                  size="sm"
                  block
                  @click="useFilters"
                >
                  Aplicar
                </b-button>
                <b-button
                  class="my-0 ml-2 text-white"
                  variant="secondary"
                  size="sm"
                  block
                  @click="hiddeFilters"
                >
                  Cancelar
                </b-button>
              </div>
            </b-dropdown-form>
          </div>
        </b-dropdown>
        <div
          v-if="searchField || searchInput"
          class="position-relative"
        >
          <fa-icon
            class="position-absolute text-secondary icon-search"
            :icon="['fas', 'search']"
          />
          <div class="relative">
            <input
              v-model="localFilters.search"
              class="searchBar"
              placeholder="Ingrese"
            >
          </div>
        </div>
        <div
          v-if="searchField || searchInput"
          class="relative ml-2 my-1"
        >
          <b-button
            variant="primary"
            size="sm"
            block
            class="text-white"
            @click="debouncedSearch2()"
          >
            Buscar
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import allStates from '~/static/states.json'
import allPriorities from '~/static/priorities.json'
import allPrioritiesRequest from '~/static/prioritiesrequest.json'
import allTypesRequest from '~/static/typerequest.json'
import allproductsmx from '~/static/allproductsmx.json'
import allproducts from '~/static/allproducts.json'
import productscl from '~/static/productsgroup.json'
import productsmx from '~/static/productsgroupmx.json'
import companies from '~/static/companies.json'
import companiesmx from '~/static/companiesmx.json'

export default {
  name: 'SToolBarCobranzaCuotas',
  props: {
    searchInput: {
      type: Boolean,
      default: false
    },
    getListCuotas: {
      type: String,
      required: true
    },
    filterByUser: {
      type: Boolean,
      default: true
    },
    filterByProducts: {
      type: Boolean,
      default: false
    },
    filterByCompanies: {
      type: Boolean,
      default: false
    },
    filterByTypeBuy: {
      type: Boolean,
      default: false
    },
    filterByPolicy: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      localFilters: {
        fecha: null,
        user: null,
        products: [],
        company: [],
        search: null
      },
      email: 'General',
      dateToday: null,
      viewCampanas: false,
      products: {},
      typeIdentification: '',
      optionProductsInterest: {},
      selectedFilter: null,
      selectedDateFilter: 'emited',
      allSelected: false,
      allSelectedEtiquetas: false,
      allSelectedProduct: false,
      allSelectedProducts: true,
      allSelectedTypes: true,
      allSelectedTypesBuys: false,
      allSelectedCompanies: true,
      allSelectedTypeProduct: true,
      allSelectedCampanas: false,
      allSelectedCanales: false,
      allPrioritiesRequest: [],
      allTypesBuy: [],
      allProducts: [],
      allCompanies: [],
      SelectallCompanies: [],
      types_payment_cl: [
        { value: null, text: 'Sin Tipo' },
        { value: 'contado', text: 'Contado' },
        { value: 'contado_transbank', text: 'Contado Transbank' },
        { value: 'pac_activo', text: 'PAC activo' },
        { value: 'pac_no_activo', text: 'PAC no activo' },
        { value: 'pat_activo', text: 'PAT activo' },
        { value: 'pat_no_activo', text: 'PAT no activo' },
        { value: 'aviso_de_cobranza', text: 'Aviso de cobranza' },
        { value: 'suscripcion_transbank', text: 'Suscripción Transbank' }
      ],
      types_payment_mx: [
        { value: null, text: 'Sin Tipo' },
        { value: 'anual', text: 'Anual' },
        { value: 'mensual', text: 'Mensual' },
        { value: 'semestral', text: 'Semestral' }
      ]
    }
  },
  computed: {
    ...mapState(['filtersselect', 'leads', 'filterpay', 'leadsFilterssave']),
    ...mapState('leads', ['refferals', 'userskam', 'channels', 'campanas']),
    ...mapState('localStorage', ['user', 'userPermissions']),
    executivesOptions () {
      if (this.user.role !== 'KAM') {
        const options = this.userskam.filter(user => user.first_name).map((executive) => {
          return {
            value: executive.email,
            text: executive.first_name
          }
        })
        options.unshift({ value: 'General', text: 'General' })
        return options
      } else {
        const userone = [{
          id: this.user.id,
          email: this.user.email,
          first_name: this.user.first_name
        }]
        const options = userone.filter(user => user.first_name).map((executive) => {
          return {
            value: executive.email,
            text: executive.first_name
          }
        })
        // options.unshift({ value: 'General', text: 'General' })
        return options
      }
    }
  },
  watch: {
  },
  created () {
    const lead = []
    for (const [key, value] of Object.entries(this.leads.etiquetas)) {
      if (value) {
        const newlead = {
          text: value.id,
          value: value.id
        }
        lead.push(newlead)
      }
    }
    this.etiquetass = lead
    this.getOptions()
    this.getCurrentDate()
  },
  mounted () {
    this.setFilterselectedCobranzaCuotas()
  },
  methods: {
    debouncedSearch: _.debounce(function (e) {
    }, 750),
    toStringDate: time => new Date(time).toISOString().split('T')[0],
    getOptions () {
      this.allTypesRequest = allTypesRequest
      this.allPrioritiesRequest = allPrioritiesRequest
      this.allPriorities = allPriorities
      this.allStates = allStates
      if (process.env.version === 'CL') {
        this.allTypesBuy = this.types_payment_cl
        this.allProducts = allproducts
        this.allCompanies = companies
        this.typeIdentification = 'CL'
        this.products = productscl
      } else {
        this.allTypesBuy = this.types_payment_mx
        this.allProducts = allproductsmx
        this.allCompanies = companiesmx
        this.typeIdentification = 'MX'
        this.products = productsmx
      }
    },
    useFilters () {
      this.setFilterselectedCobranzaCuotas()
      this.$emit('save-filters', this.localFilters)
      this.hiddeFilters()
    },
    setFilterselectedCobranzaCuotas () {
      const payload = []
      this.$store.commit('setFiltersselect', '')
      console.log(this.email)
      if (this.email !== 'General') {
        if (this.email) {
          const leadUser = this.userskam.find(({ email }) => this.email === email)
          if (leadUser) {
            const newvalue = {
              text: 'Ejecutivo: ' + leadUser.first_name,
              key: 'user'
            }
            payload.push(newvalue)
          } else {
            const newvalue = {
              text: 'Ejecutivo: No Kam',
              key: 'email'
            }
            payload.push(newvalue)
          }
          this.localFilters.user = leadUser.id
        }
      }
      if (this.dateToday !== null) {
        const newvalue = {
          text: 'fecha: ' + this.dateToday,
          key: 'fecha'
        }
        payload.push(newvalue)
      }
      console.log('payload', payload)
      this.$store.commit('setFiltersselect', payload)
    },
    resetFilters () {
      this.$store.commit('setFiltersselect', '')

      this.localFilters = {
        fecha: null,
        user: null,
        products: [],
        company: [],
        search: null
      }
      this.email = 'General'
      this.getCurrentDate()
      this.$emit('save-filters', this.localFilters)
      this.hiddeFilters()
    },
    getCurrentDate () {
      const date = new Date()
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      this.dateToday = `${day}/${month}/${year}`
      this.localFilters.fecha = `${year}-${month}-${day}`
    },
    selectFilter (e) {
      this.selectedFilter = e.target.title || e.target.name
    },
    hiddeFilters () {
      console.log('hiddeFilters')
      this.$refs.filterDropdown.hide(true)
      this.selectedFilter = null
      console.log(this.selectedFilter)
    },
    toggleAllProduct (checked) {
      this.SelectallProducts = []
      for (let i = 0; i < this.allProducts.length; i++) {
        this.SelectallProducts.push(this.allProducts[i].value)
      }
      this.localFilters.products = checked ? this.SelectallProducts.slice() : []
    },
    toggleAllCompanies (checked) {
      this.SelectallCompanies = []
      for (let i = 0; i < this.allCompanies.length; i++) {
        this.SelectallCompanies.push(this.allCompanies[i].value)
      }
      this.localFilters.company = checked ? this.SelectallCompanies.slice() : []
    },
    toggleAllTypesBuys (checked) {
      this.SelectallTypesBuys = []
      for (let i = 0; i < this.allTypesBuy.length; i++) {
        this.SelectallTypesBuys.push(this.allTypesBuy[i].value)
      }
      this.localFilters.tipo_pago = checked ? this.SelectallTypesBuys.slice() : []
    },
    setCustomDatesRange () {
      const dateToSend = this.dateToday.split('-').reverse().join('/')
      console.log(dateToSend)
      this.useFilters()
    },
    debouncedSearch2 () {
      this.setFilterselectedCobranzaCuotas()
      this.$emit('save-filters', this.localFilters)
      this.hiddeFilters()
    }
  }
}
</script>

  <style lang="scss">
  .space {
    div + div {
      margin-left: 24px;
    }
  }
  .date-height {
    height: 34px;
  }
  .shadow-dropdow {
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }
  .text-dropdown {
    font-family: Rubik;
    font-style: normal;
    line-height: 17px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #233348 !important;
    .icon {
      display: flex;
      &::after {
        align-self: center;
        justify-self: end;
        margin-left: 6px;
        content: "";
        width: 0.65em;
        height: 0.35em;
        background-color: #233348;
        clip-path: polygon(25% 0, 50% 50%, 75% 0%, 100% 0, 50% 100%, 0 0);
      }
      svg {
        height: 18px;
        min-width: 14px;
        margin-right: 5px;
        color: #233348;
      }
    }
  }
  label {
    margin-bottom: 0;
  }
  input {
    color: #233348;
    height: 36px;
    background: #ffffff;
    border: 1px solid #e1e1e1;
    box-sizing: border-box;
    border-radius: 5px;
    width: 147px;
  }
  .btn-new {
    font-family: Rubik;
    font-style: normal;
    font-weight: 500;
    height: 100%;
    font-size: 14px;
  }
  .fake-dropdowns {
    position: absolute;
    background: #fff;
    max-height: 25rem;
    width: fit-content;
    overflow-y: auto;
    padding: 1rem 0;
    left: 44%;
    top: 0;
    z-index: 1002;
    border: 1px solid #e1e1e1;
  }
  .transparent-bg {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 999;
  }
  .clearFiltersBtn {
    font-size: 1.2rem !important;
    height: 36px;
    width: 36px;
    align-self: center;
  }
  .stitle {
    font-size: 14px !important;
  }
  .icon-search {
    left: 0.6rem;
    top: 0.72rem;
  }
  .filterss {
    display: flex;
  }
  .filterss_content {
    width: 95%;
    margin-bottom: 15px;
    padding-left: 0px;
  }
  .dropdown-option {
    font-size: 25px;
  }
  .filterss_content li .icon {
    cursor: pointer;
    margin-left: 7px;
  }
  .filterss_content li span {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 14px;
    color: #ffffff;
  }
  .filterss_content li {
    height: auto;
    display: inline-block;
    line-height: 1;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    margin-right: 14px;
    background: #233348;
    border-radius: 45px;
    padding: 10px 24px;
    margin-bottom: 10px;
  }
  </style>
