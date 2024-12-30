<template>
  <div>
    <div class="products mt-4">
      <section class="ftco-section">
        <div class="position-relative">
          <fa-icon
            class="position-absolute text-secondary"
            style="left: .60rem; top: .72rem"
            :icon="['fas', 'search']"
          />
          <div class="relative">
            <input
            v-model="searchbusqueda2"
              class="searchBar w-25"
              placeholder="Buscar"
              @input="debouncedSearch"
            >
          </div>
        </div>
        <div
          v-if="loading"
          class="d-flex flex-fill h-100 loading text-center pt-5"
        >
          <div class="text-center text-primary pa-5 mx-auto my-auto ">
            <b-spinner class="align-middle" />
            <strong>Cargando...</strong>
          </div>
        </div>
        <div
          v-if="Requeses.length > 0"
          class="w-100 pt-4"
        >
          <div class="w-100 pt-4">
            <h4>Resultados en solicitudes: </h4>
          </div>
          <div class="shadow container-request">
            <div class="row mt-0">
              <div class="col-md-12 pl-0 pr-0">
                <div class="table-wrap">
                  <b-table
                    id="table-principal"
                    :items="Requeses"
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
                    <template #cell(priority_score)="{ value }">
                      <div
                        :class="getTypePriority1(value)"
                        :title="getTypePrioritytitle(value)"
                      >
                        <div :class="getTypePriority2(value)">
                          {{ getTypePriorityNull(value) }}
                        </div>
                      </div>
                    </template>
                    <template #cell(lead_details)="{ value }">
                      {{ value.name }} {{ value.last_name }}
                    </template>
                    <template #cell(razon_social)="{ value }">
                      {{ value }}
                    </template>
                    <template #cell(phone)="{ value }">
                      <a
                        target="_blank"
                        :href="`https://api.whatsapp.com/send?phone=${formatWhatsAppNumber(
                          value
                        )}`"
                        :title="value"
                      >{{ value }}</a>
                    </template>
                    <template #cell(request_type)="{ value }">
                      {{ getTypeRequest(value) }}
                    </template>
                    <template #cell(product_group)="{ value }">
                      {{ getTypeProductInterest(value) }}
                    </template>
                    <template #cell(comision_final)="{ value }">
                      {{ getComisionFinal(value) }}
                    </template>
                    <template #cell(created_at)="{ value }">
                      {{ getLeadDate(value) }}
                    </template>
                    <!--<template #cell(channel)="{value}">
                      {{ getLeadChannel(value) }}
                    </template>
                    -->
                    <!--<template #cell(priority)="{value}">
                      <div
                        v-if="value"
                        :class="`circle ${value} mx-auto`"
                        :title="value"
                      >
                        <fa-icon
                          v-if="value"
                          :icon="['fas', 'exclamation']"
                          :title="value"
                          class="text-white"
                        />
                      </div>
                    </template>
                    -->
                    <template #cell(state)="{ value }">
                      <span :class="['btn-state', getLeadStatus(value).class]">
                        <fa-icon
                          :icon="['fas', getLeadStatus(value).icon]"
                          class="mr-2"
                        />{{ getLeadStatus(value).text }}
                      </span>
                    </template>
                    <template #cell(user_details)="{ value }">
                      <p>{{ GetUserStatusKam(value) }}</p>
                    </template>
                    <template #cell(actions)="{ item }">
                      <div class="d-flex justify-content-center">
                        <nuxt-link :to="{
                            name: 'solicitudes',
                            query: {
                              id: item.id,
                            },
                          }">
                          <button
                            v-b-tooltip.hover
                            class="circle mr-2 bg-white shadow-sm border p-3"
                            title="Ir a la solicitud"
                          >
                            <fa-icon
                              :icon="['fas', 'share']"
                              class="text-primary"
                              style="font-size: 0.9rem"
                            />
                          </button>
                        </nuxt-link>
                      </div>
                    </template>
                  </b-table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="itemsLead.length > 0"
          class="w-100 pt-4"
        >
          <div class="w-100 pt-4">
            <h4>Resultados en Lead: </h4>
          </div>
          <div class="shadow container-request">
            <div class="row mt-0">
              <div class="col-md-12 pl-0 pr-0">
                <div class="table-wrap">
                  <b-table
                    id="table-principal"
                    :items="itemsLead"
                    :fields="fieldsLead"
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
                    <template #head(rut)>
                      <span v-if="version === 'MX'"> Rfc </span>
                    </template>
                    <template #cell(name)="{ item }">
                      {{ item.name }} {{ item.last_name }}
                    </template>
                    <template #cell(razon_social)="{ value }">
                      {{ value }}
                    </template>
                    <template #cell(rut)="{ value }">
                      <span v-if="version === 'CL'">
                        {{ formatRUT(value) }}
                      </span>
                      <span v-else>
                        {{ value }}
                      </span>
                    </template>
                    <template #cell(state)="{ value }">
                      <span :class="['btn-state', getLeadStatus(value).class]">
                        <fa-icon
                          :icon="['fas', getLeadStatus(value).icon]"
                          class="mr-2"
                        />{{ getLeadStatus(value).text }}
                      </span>
                    </template>
                    <template #cell(email)="{ value }">
                      <a
                        :href="`https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${value}`"
                        target="_blank"
                        :title="value"
                      >{{ value.slice(0, 15) }}...</a>
                    </template>
                    <template #cell(phone)="{ value }">
                      <a
                        target="_blank"
                        :href="`https://api.whatsapp.com/send?phone=${formatWhatsAppNumber(
                          value
                        )}`"
                        :title="value"
                      >{{ value }}</a>
                    </template>
                    <template #cell(last_request_creation)="{ value }">
                      {{ getLeadDate(value) }}
                    </template>
                    <template #cell(created_at)="{ value }">
                      {{ getLeadDate(value) }}
                    </template>
                    <template #cell(user_details)="{ value }">
                      <p>{{ value.first_name }}</p>
                    </template>
                    <template #cell(actions)="{ item }">
                      <div class="d-flex justify-content-center">
                        <nuxt-link :to="{
                            name: 'leadsnew',
                            query: {
                              id: item.id,
                            },
                          }">
                          <button
                            v-b-tooltip.hover
                            class="circle mr-2 bg-white shadow-sm border p-3"
                            title="Ir al lead"
                          >
                            <fa-icon
                              :icon="['fas', 'share']"
                              class="text-primary"
                              style="font-size: 0.9rem"
                            />
                          </button>
                        </nuxt-link>
                      </div>
                    </template>
                  </b-table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="itemsClient.length > 0"
          class="w-100 pt-4"
        >
          <div class="w-100 pt-4">
            <h4>Resultados en Clientes: </h4>
          </div>
          <div class="shadow container-request">
            <div class="row mt-0">
              <div class="col-md-12 pl-0 pr-0">
                <div class="table-wrap">
                  <b-table
                    id="table-principal"
                    :items="itemsClient"
                    :fields="fieldsLead"
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
                    <template #head(rut)>
                      <span v-if="version === 'MX'"> Rfc </span>
                    </template>
                    <template #cell(name)="{ item }">
                      {{ item.name }} {{ item.last_name }}
                    </template>
                    <template #cell(razon_social)="{ value }">
                      {{ value }}
                    </template>
                    <template #cell(rut)="{ value }">
                      <span v-if="version === 'CL'">
                        {{ formatRUT(value) }}
                      </span>
                      <span v-else>
                        {{ value }}
                      </span>
                    </template>
                    <template #cell(state)="{ value }">
                      <span :class="['btn-state', getLeadStatus(value).class]">
                        <fa-icon
                          :icon="['fas', getLeadStatus(value).icon]"
                          class="mr-2"
                        />{{ getLeadStatus(value).text }}
                      </span>
                    </template>
                    <template #cell(email)="{ value }">
                      <a
                        :href="`https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${value}`"
                        target="_blank"
                        :title="value"
                      >{{ value.slice(0, 15) }}...</a>
                    </template>
                    <template #cell(phone)="{ value }">
                      <a
                        target="_blank"
                        :href="`https://api.whatsapp.com/send?phone=${formatWhatsAppNumber(
                        value
                      )}`"
                        :title="value"
                      >{{ value }}</a>
                    </template>
                    <template #cell(last_request_creation)="{ value }">
                      {{ getLeadDate(value) }}
                    </template>
                    <template #cell(created_at)="{ value }">
                      {{ getLeadDate(value) }}
                    </template>
                    <template #cell(user_details)="{ value }">
                      <p>{{ value.first_name }}</p>
                    </template>
                    <template #cell(actions)="{ item }">
                      <div class="d-flex justify-content-center">
                        <nuxt-link :to="{
                            name: 'leadsnew',
                            query: {
                              id: item.id,
                            },
                          }">
                          <button
                            v-b-tooltip.hover
                            class="circle mr-2 bg-white shadow-sm border p-3"
                            title="Ir al Cliente"
                          >
                            <fa-icon
                              :icon="['fas', 'share']"
                              class="text-primary"
                              style="font-size: 0.9rem"
                            />
                          </button>
                        </nuxt-link>
                      </div>
                    </template>
                  </b-table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="itemsProduct.length > 0"
          class="w-100 pt-4"
        >
          <div class="w-100 pt-4">
            <h4>Resultados en Productos: </h4>
          </div>
          <div class="shadow container-request">
            <div class="row mt-0">
              <div class="col-md-12 pl-0 pr-0">
                <div class="table-wrap">
                  <b-table
                    :items="itemsProduct"
                    :fields="productfields"
                    responsive="sm"
                    :busy="loadingLeads"
                    @row-clicked="onRowClicked2"
                  >
                    <template #table-busy>
                      <div class="d-flex h-100">
                        <div class="text-center text-primary pa-5 mx-auto h-100">
                          <b-spinner class="align-middle" />
                          <strong>Cargando...</strong>
                        </div>
                      </div>
                    </template>
                    <template #cell(name)="{ value }">
                      <p>{{ getProductName(value) }}</p>
                    </template>
                    <template #cell(endorsement_info)="{ value }">
                      <p>{{ getNumeroEndoso(value) }}</p>
                    </template>
                    <template #cell(fecha_inicio_vigencia)="{ value }">
                      <p>{{ getProductDate(value) }}</p>
                    </template>
                    <template #cell(fecha_termino_vigencia)="{ value }">
                      <p>{{ getProductDate(value) }}</p>
                    </template>
                    <template #cell(state)="row">
                      {{ getProductState(row.item.state) }}
                      <span
                        size="sm"
                        class="text-base ml-3 span-sort"
                      >
                        <fa-icon
                          v-if="row.detailsShowing"
                          :icon="['fas', 'sort-up']"
                          class="text-base"
                        />
                        <fa-icon
                          v-else
                          :icon="['fas', 'sort-down']"
                          class="text-base span-sort"
                        />
                      </span>
                    </template>
                    <template #cell(actions)="{ item }">
                      <div class="d-flex justify-content-center">
                        <nuxt-link :to="{
                            name: 'postventa',
                            query: {
                              id: item.id,
                            },
                          }">
                          <button
                            v-b-tooltip.hover
                            class="circle mr-2 bg-white shadow-sm border p-3"
                            title="Ir al producto"
                          >
                            <fa-icon
                              :icon="['fas', 'share']"
                              class="text-primary"
                              style="font-size: 0.9rem"
                            />
                          </button>
                        </nuxt-link>
                      </div>
                    </template>

                  </b-table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import { mapState,mapMutations  } from 'vuex'
import Session from '@/mixins/auth'
import _ from 'lodash'
import leadsStaticVars from '~/static/leadsStaticVars.json'
import formatRUT from '~/helpers/formatRUT.js'
import productscl from '~/static/productsgroup.json'
import productsmx from '~/static/productsgroupmx.json'
export default {
  mixins: [Session],
  data () {
    return {
      loading: false,
      searchbusqueda2: null,
      fields: leadsStaticVars.tableFieldsRequest,
      fieldsLead: leadsStaticVars.tableFieldsClient,
      Requeses: {},
      itemsLead: {},
      itemsClient: {},
      itemsProduct: {},
      products: {},
      version: '',
      productfields: [
        {
          key: 'name',
          label: 'Producto',
          sortable: true,
          class: 'pl-4'
        },
        {
          key: 'product_type',
          label: 'Tipo',
          sortable: true
        },
        {
          key: 'nro_poliza',
          label: 'N° de Póliza',
          sortable: true
        },
        {
          key: 'endorsement_info',
          label: 'N Endoso',
          sortable: true
        },
        {
          key: 'fecha_inicio_vigencia',
          label: 'Inicio de vigencia',
          sortable: true
        },
        {
          key: 'fecha_termino_vigencia',
          label: 'Fin de vigencia',
          sortable: true
        },
        {
          key: 'state',
          label: 'Estado de póliza',
          sortable: true
        },
        {
          key: 'actions',
          label: 'Acciones'
        }
      ],
      typeRequest: [
        {
          value: 'alianza_comercial',
          name: 'Alianza comercial'
        },
        {
          value: 'solicitud_cotizacion',
          name: 'Cotización'
        },
        {
          value: 'cancelacion_o_anulacion_de_poliza',
          name: 'Cancelación o anulación de políza'
        },
        {
          value: 'denuncia_siniestro',
          name: 'Siniestro'
        },
        {
          value: 'endosos',
          name: 'Endosos'
        },
        {
          value: 'renovacion',
          name: 'Renovación'
        },
        {
          value: 'soporte',
          name: 'Soporte'
        },
        {
          value: 'denuncia_siniestro',
          name: 'Denuncia siniestro'
        },
        {
          value: 'solicitud_informacion_productos',
          name: 'Info Productos'
        }
      ],
      groupscl: [
        { value: 'asistencias', text: 'Asistencias' },
        { value: 'diagnostico_de_riesgo', text: 'Diagnostico De riesgo' },
        {
          value: 'seguro_de_accidentes_personales',
          text: 'Seguro De Accidentes Personales'
        },
        { value: 'seguro_de_accidentes_personales_digitales', text: 'Seguro De Accidentes Personales Digitales' },
        {
          value: 'seguro_de_responsabilidad_civil',
          text: 'Seguro De Responsabilidad Civil'
        },
        { value: 'seguro_de_responsabilidad_civil_digital', text: 'Seguro De Responsabilidad Civil Digital' },
        {
          value: 'seguros_para_la_ingenieria',
          text: 'Seguro Para La Ingeneria'
        },
        { value: 'seguro_de_vehiculos', text: 'Seguro De Vehiculos' },
        {
          value: 'seguro_de_incendio_sismo_y_robo',
          text: 'Seguro De Incendio, Sismo Y Robo'
        },
        { value: 'seguro_de_incendio_sismo_y_robo_digital', text: 'Seguro De Incendio, Sismo Y Robo Digital' },
        {
          value: 'seguro_de_transporte_y_carga',
          text: 'Seguro De Transporte Y Carga'
        },
        { value: 'otros_seguros', text: 'Otros Seguros' },
        {
          value: 'seguro_colectivo_de_salud',
          text: 'Seguros de Salud'
        },
        { value: 'seguro_de_garantia', text: 'Seguro De Garantia (No valído)' },
        { value: 'seguro_de_garantia_digital_publica', text: 'Seguro de Garantia Digital Publica' },
        { value: 'seguro_de_garantia_digital_privada', text: 'Seguro De Garantia Digital Privada' },
        { value: 'seguro_de_garantia_publica', text: 'Seguro De Garantia Publica' },
        { value: 'seguro_de_garantia_privada', text: 'Seguro De Garantia Privada' },
        { value: 'seguro_de_garantia_fondos', text: 'Seguro De Garantia Fondos' },
        { value: 'seguro_de_garantia_creditos', text: 'Seguro De Garantia Creditos' },
      ],
      groupsmx: [
        { value: 'asistencias', text: 'Asistencias' },
        {
          value: 'seguro_de_responsabilidad_civil',
          text: 'Seguro De Responsabilidad Civil'
        },
        { value: 'seguro_de_danos', text: 'Seguro de Daños' },
        {
          value: 'seguro_de_transporte_y_carga',
          text: 'Seguro de Transporte de Mercancías'
        },
        { value: 'seguro_de_vehiculos', text: 'Seguro de Vehículos' },
        {
          value: 'seguro_de_proteccion_cibernetica',
          text: 'Seguro de Protección Cibernética'
        },
        { value: 'otros_seguros', text: 'Otros Seguros' },
        {
          value: 'seguro_colectivo_de_gastos_medicos_mayores',
          text: 'Seguros de Salud'
        },
        { value: 'affinity', text: 'Seguros para Personas' }
      ],
      groups: [],
    }
  },
  created () {
    this.version = process.env.version
    if (process.env.version === 'CL') {
      this.groups = this.groupscl
      this.products = productscl
    } else {
      this.groups = this.groupsmx
      this.products = productsmx
    }
    if(this.searchbusqueda){
        this.searchbusqueda2 = this.searchbusqueda
        this.SearchBusqueda(this.searchbusqueda)
    }
  },
  computed: {
    ...mapState(['leadsFilters', 'leadFromSocket', 'leads', 'searchbusqueda']),
    ...mapState('leads', ['users', 'channels', 'campanas', 'loadingLeads']),
    ...mapState('localStorage', ['user', 'userPermissions']),
  },
  methods: {
    ...mapMutations(["setSearchBusqueda"]),
    formatRUT,
    debouncedSearch: _.debounce(function (e) {
      this.loading = true
      this.setSearchBusqueda(e.target.value)
      this.searchbusqueda2 = e.target.value
      this.SearchBusqueda(e.target.value)
    }, 750),
    getProductName (key) {
      return Object.values(this.products).reduce(
        (acc, curr) => ({
          ...acc,
          ...curr.reduce((a, { text, value }) => ({ ...a, [value]: text }), {})
        }),
        {}
      )[key]
    },
    getNumeroEndoso (endoso) {
      if (endoso.endorsement_nro) {
        return endoso.endorsement_nro
      } else {
        return 'No aplica'
      }
    },
    getProductDate (product) {
      return product.split('-').reverse().join('/')
    },
    getProductState (val) {
      if (val === 'valid') {
        return 'Vigente'
      }
      if (val === 'canceled') {
        return 'Cancelada'
      }
      if (val === 'canceled_nopay') {
        return 'Cancelada Por No Pago'
      }
      if (val === 'renewed') {
        return 'Renovada'
      }
      if (val === 'rehabilited') {
        return 'Rehabilitada'
      }
    },
    async SearchBusqueda (valor) {
      // solicitudes
      if (valor) {
        const urlParams1 = {
          search: valor
        }
        const fields = `id,lead_details,request_type,product_group,created_at,state,user_details,lead,tags`
        const data = await this.$ListRequests(1, urlParams1, fields)
        const Response = data.results
        for (let i = 0; i < Response.length; i++) {
          const ObjetoPrioridad = Response[i].tags.filter(
            item => item.id === 'prioritario'
          )
          if (ObjetoPrioridad.length > 0) {
            Response[i].prioridades = true
          } else {
            Response[i].prioridades = false
          }
          if (Response[i].product_details) {
            Response[i].prima = Response[i].product_details.prima
            Response[i].comision = Response[i].product_details.comision
            Response[i].comision_final = {
              monto: Response[i].product_details.comision_final,
              referred: Response[i].referred,
              campaign_slug: Response[i].campaign_slug
            }
          }
          if (Response[i].is_old === true) {
            Response[i]._rowVariant = 'danger'
          }
          if (Response[i].lead_details) {
            if (
              Response[i].lead_details.email ||
              Response[i].lead_details.phone ||
              Response[i].lead_details.razon_social
            ) {
              Response[i].email = Response[i].lead_details.email
              Response[i].phone = Response[i].lead_details.phone
              Response[i].razon_social = Response[i].lead_details.razon_social
            }
          }
        }
        this.Requeses = Response
      } else {
        this.Requeses = {}
      }
      const page = 1

      // leads
      if (valor) {
        const fieldss2 = `id,name,last_name,razon_social,rut,email,phone,last_request_creation,created_at,user_details`
        const urlParams2 = {
          search: valor
        }
        try {
          const res = await this.$simpleeApi.get('/lead/?no_products=true', {
            params: { page, ...urlParams2, fields: fieldss2 }
          })
          this.itemsLead = res.data.results
        } catch (error) {
          this.$store.commit('setAlertMessage', error.response.data)
        }
      } else {
        this.itemsLead = {}
      }
      // clientes
      if (valor) {
        const fieldss3 = `id,name,last_name,razon_social,rut,email,phone,last_request_creation,created_at,user_details`
        const urlParams3 = {
          search: valor
        }
        try {
          const res = await this.$simpleeApi.get('/lead/?clientes', {
            params: { page, ...urlParams3, fields: fieldss3 }
          })
          this.itemsClient = res.data.results
        } catch (error) {
          this.$store.commit('setAlertMessage', error.response.data)
        }
      } else {
        this.itemsClient = {}
      }

      // productos
      if (valor) {
        const params = {
          search: valor
        }
        try {
          const {
            data: { results }
          } = await this.$simpleeApi.get('/product/', { params })
          this.itemsProduct = results
        } catch (error) {
          // store.commit('setAlertMessage', error.response.data)
        }
      } else {
        this.itemsProduct = {}
      }
      this.loading = false
    },
    formatWhatsAppNumber (text) {
      const phone = text.replace(/ /g, '')
      return phone.replace('+', '')
    },
    getTypeProductInterest (request) {
      const requestObject = this.groups.find(({ value }) => value === request)
      if (requestObject) {
        return requestObject.text
      }
      return 'No tiene'
    },
    getLeadDate (leadDate) {
      const createdAt = new Date(leadDate).toLocaleString('en-GB')
      const [date, hour] = createdAt.split(',')
      return `${date}\n${hour}`
    },
    GetUserStatusKam (value) {
      if (this.user.id == value.id || this.user.role !== 'KAM') {
        return value.first_name
      } else {
        return 'Otro ejecutivo'
      }
    },
    getLeadStatus (state) {
      return state
        ? leadsStaticVars.detailedStates[state]
        : leadsStaticVars.detailedStates.sin_estado
    },
    getComisionFinal (value) {
      if (value.referred) {
        return value.monto
        /*
  const referredd = this.refferals.filter(
           xd => xd.value === value.referred
         )
         const referred_final = referredd[0].commission
         const comision_final = value.monto * referred_final
         return value.monto - comision_final
        */
      } else if (value.campaign_slug) {
        return value.monto
        /* let referred_final
        if (value.campaign_slug === 'que-plan') {
          referred_final = 0.3
          const comision_final = value.monto * referred_final
          return value.monto - comision_final
        } else if (value.campaign_slug === 'asegurateonline') {
          referred_final = 0.5
          const comision_final = value.monto * referred_final
          return value.monto - comision_final
        } else if (value.campaign_slug === 'kapitallis') {
          referred_final = 0.3
          const comision_final = value.monto * referred_final
          return value.monto - comision_final
        } else {
          return value.monto
        }
        */
      } else {
        return value.monto
      }
    },
    getTypeRequest (request) {
      const requestObject = this.typeRequest.find(
        ({ value }) => value === request
      )
      if (requestObject) {
        return requestObject.name
      }
      return 'No Asignado'
    },
    getTypePrioritytitle (value) {
      if (value > 10 && value < 15) {
        return 'Prioridad alta'
      } else if (value > 6 && value < 11) {
        return 'Prioridad media'
      } else if (value > 2 && value < 7) {
        return ''
      }
    },
    getTypePriority1 (value) {
      if (value > 10 && value < 15) {
        return 'outer-circle-alta'
      } else if (value > 6 && value < 11) {
        return 'outer-circle-media'
      } else if (value > 2 && value < 7) {
        return ''
      }
    },
    getTypePriorityNull () {
      return ''
    },
    getTypePriority2 (value) {
      if (value > 10 && value < 15) {
        return 'inner-circle-alta'
      } else if (value > 6 && value < 11) {
        return 'inner-circle-media'
      } else if (value > 2 && value < 7) {
        return ''
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.table tbody th,
.table tbody td {
  padding: 8px 6px !important;
  font-size: 14px !important;
  vertical-align: middle !important;
}
.menu {
  padding: 1.2rem 0;

  button {
    background-color: transparent;
    font-family: Rubik;
    font-style: normal;
    font-weight: 500;
    font-size: 1.2rem;
    line-height: 19px;
    outline: 0px solid transparent;
    border: 0px solid transparent;
    color: rgba(211, 211, 211, 1);
    &.active {
      color: black;
    }
  }

  /* identical to box height */
  //

  color: #000000;
}
.padding-modal {
  padding: 0px 20px 40px 20px !important;
}
@media (min-width: 768px) {
  .padding-modal {
    padding: 0px 72px 40px 72px !important;
  }
}
.product-button {
  background: #ffffff;
  border: 1px solid #d3d3d3;
  box-sizing: border-box;
  border-radius: 5px;
}
.products,
.documents,
.diagnostic,
.tracking {
  div + div {
    margin-top: 1rem;
  }
}
.add {
  left: 1273px;
  top: 306px;
  border-color: transparent;
  font-style: normal;
  font-weight: normal;
  display: flex;
  color: white;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding: 3px;
  line-height: 21px;
  background: var(--primary);
  border-radius: 30px;
}
.comment-row {
  td,
  th {
    height: 200px;
  }
}
.mandatory {
  color: #233348;
}
.doc-title {
  padding: 0 0.75rem;
}
.draggable-modal {
  .modal-header {
    padding: 0;
    height: 4rem;
  }
}
.modal-body {
  padding-top: 0;
}
.max-size {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.3s ease;
  h5 {
    margin-left: 4.5rem;
    margin-bottom: 0;
  }
  p {
    opacity: 0;
    margin: 0 5.5rem 0 0;
    transition: opacity 0.3s ease;
  }
  &:hover {
    cursor: grab;
    background-color: rgb(247, 243, 243);
    p {
      opacity: 1;
    }
  }
}
.loading {
  font-size: 14px;
  opacity: 0.5;
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
.btn-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 20px;
  max-width: 150px;
  border-radius: 3px;
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  white-space: nowrap;
  color: #ffffff;
  svg {
    font-size: 10px;
  }
  &.informacion {
    background-color: #ffa500;
  }
  &.sin-estado {
    background-color: #d3d3d3;
    color: black;
  }
  &.abandono {
    background-color: #ff6347;
  }
  &.perdido {
    background-color: #ff4500;
  }
  &.resuelto {
    background-color: #9dd345;
  }
  &.error_de_pago {
    background-color: #dc143c;
  }
  &.confirmacion {
    background-color: #32cd32;
  }
  &.cerrado {
    background-color: var(--primary);
  }
  &.licitacion {
    background-color: #1e90ff;
  }
  &.llamar {
    background-color: #ffd700;
  }
  &.dg_contactado {
    background-color: #4682b4;
  }
  &.sin_contactar {
    background-color: #6a5acd;
  }
}
</style>
