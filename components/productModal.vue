<template>
  <b-modal
    id="product-modal"
    ref="product-modal"
    v-model="localShow"
    size="lg"
    modal-class="draggable-modal"
    body-class="padding-modal"
    scrollable
    no-close-on-backdrop
    @hidden="$emit('hidde')"
  >
    <template #modal-header="{}">
      <div class="max-size" @mousedown="dragModal">
        <h5>
          <fa-icon :icon="['fas', 'edit']" class="text-primary mr-2" /><b>Editar/</b>
          {{ localProduct.razon_social }}
        </h5>
        <p>Manten presionado para arrastrar el modal</p>
      </div>
    </template>
    <template #modal-footer="{}">
      <b-button
        class="text-white py-2 px-3 mr-2"
        size="sm"
        variant="primary"
        @click="save()"
      >
        Guardar y continuar
      </b-button>
      <b-button
        class="text-white p-2 px-3"
        size="sm"
        variant="secondary"
        @click="cancelproduct()"
      >
        Cancelar
      </b-button>
    </template>
    <div class="d-flex justify-content-between align-items-center">
      <div class="menu-product-modal d-flex">
        <button
          :class="['mr-5', { active: option === 'poliza' }]"
          @click="option = 'poliza'"
        >
          Póliza
        </button>
        <button
          :class="['mr-5', { active: option === 'relacion' }]"
          @click="
            option = 'relacion';
            GetProduct();
          "
        >
          Póliza relacionadas
        </button>
        <button
          :class="['mr-5', { active: option === 'bitacora' }]"
          @click="option = 'bitacora'"
        >
          Bitacora
        </button>
        <button
          :class="['mr-5', { active: option === 'documents' }]"
          @click="option = 'documents'"
        >
          Documentos
        </button>
      </div>
      <button v-if="option === 'documents'" class="add" @click="addDocument">
        <fa-icon class="" :icon="['fas', 'plus']" />
      </button>
    </div>
    <div v-if="option === 'poliza'" class="d-flex flex-column">
      <div class="d-flex mb-0 justify-content-end">
        <nuxt-link
          v-if="localProduct.lead"
          :to="{
            path: '/clientes',
            query: {
              id: localProduct.lead.id,
            },
          }"
          class="text-underline text-right w-50"
        >
          Ir al cliente
        </nuxt-link>
        <nuxt-link
          v-if="localProduct.lead_request"
          :to="{
            path: '/solicitudes',
            query: {
              idrequest: localProduct.lead_request,
            },
          }"
          class="text-underline text-right w-50"
        >
          Ir a la solicitud
        </nuxt-link>
      </div>
      <product-form
        v-model="localProduct"
        class="mt-2"
        :commission="0"
        :state="'cliente_cerrado'"
        :show-delete="false"
        show-lead-info
        page="postventa"
        @CloseModal="cancelproduct2"
      />
    </div>
    <div v-if="option === 'relacion'" class="d-flex flex-column">
      <div class="signup-form-Client mx-0">
        <form id="register-form" method="POST" class="register-form">
          <div class="w-100 d-flex">
            <div class="w-100">
              <h4 class="mb-4">
                <fa-icon :icon="['fas', 'file']" class="text-primary mr-2" />
                Pólizas relacionadas con este producto
              </h4>
            </div>
          </div>
          <div class="form-row w-100">
            <b-table
              :items="ProductsRelation"
              :fields="relacionFields"
              :tbody-tr-class="rowClassrequest"
              thead-class="rowClassrequest2"
            >
              <template #table-busy>
                <div class="d-flex h-100">
                  <div class="text-center text-primary pa-5 mx-auto h-100">
                    <b-spinner class="align-middle" />
                    <strong>Cargando...</strong>
                  </div>
                </div>
              </template>
              <template #cell(line)="{ value }">
                {{ GetFormateProduct2(value, "line") }}
              </template>
              <template #cell(name)="{ value }">
                {{ GetFormateProduct2(value, "name") }}
              </template>
              <template #cell(group)="{ value }">
                {{ GetFormateProduct2(value, "group") }}
              </template>
              <template #cell(actions)="{ item }">
                <div class="d-flex justify-content-center">
                  <button
                    class="circle bg-white shadow-sm border p-3"
                    title="ir a poliza"
                    @click="pushpolizaroute(item)"
                  >
                    <fa-icon
                      :icon="['fas', 'share']"
                      class="text-danger"
                      style="font-size: 0.9rem"
                    />
                  </button>
                </div>
              </template>
            </b-table>
          </div>
        </form>
      </div>
    </div>
    <div v-if="option === 'bitacora'" class="action-container">
      <b-modal-bitacora
      v-if="modalbitacora"
      :bitacoradata="bitacorarequestdata"
      :idrequest="idrequest"
      no-close-on-backdrop
      :requestsi="requestbitacoraval"
      @save-bitacora="savebitacora"
      @edit-bitacora="saveeditbitacora"
      @cancel-bitacora="cancelbitacora"
      @hidde="modalbitacora = false"
    />
      <div class="signup-form-Client py-3 py-md-0">
        <form
          id="register-form"
          method="POST"
          class="register-form"
        >
          <div class="w-100 d-flex text-center text-md-left px-2 px-md-0 flex-column flex-md-row mb-4">
            <div class="w-bitW w-50">
              <h4 class="mb-2 mb-md-4 text-left">
                <fa-icon
                  :icon="['fas', 'file']"
                  class="text-primary mr-2"
                />
                Bitácora
              </h4>
            </div>
            <div class="w-bitW w-50 text-left d-flex">
              <a
                class="solicitud-btn"
                @click="showmodalbitacora(localProduct.id)"
              >
                <fa-icon
                  :icon="['fas', 'plus']"
                  class="text-primary edit-ico mr-2"
                />Agregar Bitacora
              </a>
            </div>
          </div>
          <div class="d-none d-md-block form-row w-100">
            <b-table
              :items="bitacorasolicitud"
              :fields="bitacoraFields"
              :busy="loadingLeads"
              :tbody-tr-class="rowClassrequest"
              thead-class="rowClassrequest2"
              @row-clicked="onRowClicked"
            >
              <template #table-busy>
                <div class="d-flex h-100">
                  <div class="text-center text-primary pa-5 mx-auto h-100">
                    <b-spinner class="align-middle" />
                    <strong>Cargando...</strong>
                  </div>
                </div>
              </template>
              <template #cell(state)="{ value }">
                {{ getLeadState(value) }}
              </template>
              <template #cell(created_at)="{ value }">
                {{ getLeadDate(value) }}
              </template>
              <template #cell(actions)="{ item }">
                <div class="d-flex justify-content-center">
                  <!-- <button
                    class="circle bg-white shadow-sm border p-3 mr-2"
                    title="Eliminar Bitacora"
                    @click.prevent="deletebitacora(item)"
                  >
                    <fa-icon
                      :icon="['fas', 'trash-alt']"
                      class="text-danger"
                      style="font-size: 0.9rem"
                    />
                  </button> -->
                  <button
                    class="circle bg-white shadow-sm border p-3"
                    title="Editar"
                    @click.prevent="editBitacora(item, localProduct.id)"
                  >
                    <fa-icon
                      :icon="['fas', 'edit']"
                      class="text-primary"
                      style="font-size: 0.9rem"
                    />
                  </button>
                </div>
              </template>
            </b-table>
          </div>
          <div class="d-block d-md-none form-row w-100 table-responsive">
            <b-table
              :items="bitacorasolicitud"
              :fields="bitacoraFields"
              :busy="loadingLeads"
              :tbody-tr-class="rowClassrequest"
              thead-class="rowClassrequest2"
              @row-clicked="onRowClicked"
            >
              <template #table-busy>
                <div class="d-flex h-100">
                  <div class="text-center text-primary pa-5 mx-auto h-100">
                    <b-spinner class="align-middle" />
                    <strong>Cargando...</strong>
                  </div>
                </div>
              </template>
              <template #cell(created_at)="{ value }">
                {{ getLeadDate(value) }}
              </template>
              <template #cell(actions)="{ item }">
                <div class="d-flex justify-content-center">
                  <!-- <button
                    class="circle bg-white shadow-sm border p-3 mr-2"
                    title="Eliminar Bitacora"
                    @click.prevent="deletebitacora(item)"
                  >
                    <fa-icon
                      :icon="['fas', 'trash-alt']"
                      class="text-danger"
                      style="font-size: 0.9rem"
                    />
                  </button> -->
                  <button
                    class="circle bg-white shadow-sm border p-3"
                    title="Editar"
                    @click.prevent="editBitacora(item, localProduct.id)"
                  >
                    <fa-icon
                      :icon="['fas', 'edit']"
                      class="text-primary"
                      style="font-size: 0.9rem"
                    />
                  </button>
                </div>
              </template>
            </b-table>
          </div>

          <div class="form-row w-100 py-4 py-md-0">
            <div class="flex w-full text-left text-md-right justify-content-end completo">
              <b-button
                class="text-white shadow-dropdow btn-new ml-4"
                variant="primary"
                @click="showmodalbitacora(localProduct.id)"
              >
                Agregar Nueva Bitacora
              </b-button>
            </div>
          </div>
        </form>
      </div>
      </div>
    <div v-if="option === 'actions'" class="action-container">
      <b-form-select
        v-model="selected"
        class="mb-3"
        @change="editItem({ type: $event })"
      >
        <!-- This slot appears above the options from 'options' prop -->
        <template #first>
          <b-form-select-option :value="null" disabled>
            <p class="font-weight-bold">
              Selecciona la acción a realizar
            </p>
          </b-form-select-option>
        </template>

        <!-- <b-form-select-option value="endorsement">
          Endoso
        </b-form-select-option>
        <b-form-select-option value="renewal">
          Renovación
        </b-form-select-option>-->
        <b-form-select-option value="sinister">
          Siniestro
        </b-form-select-option>
        <b-form-select-option value="other">
          Otro
        </b-form-select-option>
      </b-form-select>
      <template v-if="actionEditType">
        <component
          :is="editComponent"
          v-if="actionEditType === actionEditType"
          v-model="item"
          :show-delete="false"
          :has-errors="
            renewalFormHasError || renewalsWithErrors.includes(item.id)
          "
          @errorsResolved="removeRenewalFromErrors"
        />
        <div class="buttons-container">
          <b-button
            variant="primary"
            @click="saveItem({ type: actionEditType })"
          >
            Guardar
          </b-button>
          <b-button variant="secondary" @click="cancel">
            Cancelar
          </b-button>
        </div>
      </template>
      <template v-else>
        <h5>Historial</h5>

        <div
          v-for="(
            { id, comment, document, created_at, type, message }, key
          ) in localProduct.history"
          :key="key"
          class="action"
          :class="{
            formErrors: renewalsWithErrors.includes(id),
          }"
        >
          <div class="body" :title="comment">
            <p>
              <a :href="document" target="_blank">{{ types[type] }}</a> -
              {{ message }}.
            </p>
          </div>
          <div class="footer">
            <span class="date">{{ created_at | formatDate }}</span>
            <div v-if="type !== 'vigency'" class="buttons">
              <fa-icon
                :icon="['far', 'edit']"
                title="Editar"
                class="icon"
                @click="editItem({ type, id })"
              />
              <fa-icon
                :icon="['far', 'trash-alt']"
                title="Eliminar"
                class="icon trash"
                @click="deleteItem({ type, id })"
              />
            </div>
          </div>
        </div>
      </template>
    </div>

    <div v-if="option === 'documents'" class="documents">
      <div v-for="(_document, key) in localProduct.documents" :key="key">
        <b-button
          v-b-toggle="`document-${key}`"
          variant="outline-secondary"
          block
          class="mb-3"
        >
          {{ _document.title || "Documento" }}
        </b-button>
        <b-collapse
          :id="`document-${key}`"
          visible
          accordion="my-accordion"
          role="tabpanel"
        >
          <document-form
            v-model="localProduct.documents[key]"
            @delete="deleteDocument(key)"
          />
        </b-collapse>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { mapState } from 'vuex'
import EndorsementForm from './EndorsementForm.vue'
import SinisterForm from './SinisterForm.vue'
import RenewalForm from './RenewalForm.vue'
import OtherForm from './OtherForm.vue'
import DocumentForm from './DocumentForm.vue'
import ProductForm from '@/components/ProductForm.vue'
import productscl from '~/static/productsgroup.json'
import productsmx from '~/static/productsgroupmx.json'
import BModalBitacora from '@/components/base/SModalBitacoraProduct.vue'

// import SFormTable from '@/components/base/SFormTable.vue'

export default {
  components: {
    ProductForm,
    EndorsementForm,
    SinisterForm,
    RenewalForm,
    OtherForm,
    DocumentForm,
    BModalBitacora
  },
  props: {
    show: {
      type: Boolean,
      default: true
    },
    value: {
      type: Object,
      default: () => ({
        documents: [{ document: null }],
        endorsements: [{}],
        renewals: [{}],
        sinisters: [{}]
      })
    }
  },
  data () {
    return {
      option: 'poliza',
      bitacorarequestdata: [],
      bitacorasolicitud: [],
      bitacoraFields: [
        {
          key: 'state',
          label: 'Estado',
          sortable: false
        },
        {
          key: 'description',
          label: 'Descripcion',
          sortable: false
        },
        {
          key: 'created_at',
          label: 'Fecha Registro',
          sortable: false
        },
        {
          key: 'actions',
          label: 'Acciones'
        }
      ],
      modalbitacora: false,
      requestbitacoraval: true,
      selected: null,
      renewalFormHasError: false,
      ProductsRelation: [],
      renewalsWithErrors: [],
      productos: [],
      Lines: [
        { value: 'asistencias', text: 'Asistencia' },
        { value: 'garantia', text: 'Garantia' },
        { value: 'generales', text: 'Generales' },
        { value: 'vida', text: 'Vida' },
        { value: 'colectivo_vida', text: 'Colectivo vida' }
      ],
      groupscl: [
        { value: 'asistencias', text: 'Asistencias' },
        { value: 'diagnostico_de_riesgo', text: 'Diagnostico De riesgo' },
        {
          value: 'seguro_de_accidentes_personales',
          text: 'Seguro De Accidentes Personales'
        },
        {
          value: 'seguro_de_responsabilidad_civil',
          text: 'Seguro De Responsabilidad Civil'
        },
        {
          value: 'seguros_para_la_ingenieria',
          text: 'Seguro Para La Ingeneria'
        },
        { value: 'seguro_de_vehiculos', text: 'Seguro De Vehiculos' },
        {
          value: 'seguro_de_incendio_sismo_y_robo',
          text: 'Seguro De Incendio, Sismo Y Robo'
        },
        {
          value: 'seguro_de_transporte_y_carga',
          text: 'Seguro De Transporte Y Carga'
        },
        { value: 'otros_seguros', text: 'Otros Seguros' },
        {
          value: 'seguro_colectivo_de_salud',
          text: 'Seguros de Salud'
        },
        { value: 'seguro_de_garantia', text: 'Seguro De Garantia' }
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
      relacionFields: [
        {
          key: 'line',
          label: 'Linea',
          sortable: false
        },
        {
          key: 'group',
          label: 'Grupo',
          sortable: false
        },
        {
          key: 'name',
          label: 'Producto',
          sortable: false
        },
        {
          key: 'nro_poliza',
          label: 'N poliza',
          sortable: false
        },
        {
          key: 'product_type',
          label: 'Tipo',
          sortable: false
        },
        {
          key: 'actions',
          label: 'Acciones'
        }
      ],
      types: {
        other: 'OTRO',
        renewal: 'RENOVACIÓN',
        vigency: 'VIGENCIA',
        sinister: 'SINIESTRO',
        endorsement: 'ENDOSO'
      },
      actionEditType: null,
      relatedTypes: {
        other: 'others',
        renewal: 'renewals',
        vigency: 'vigencys',
        sinister: 'sinisters',
        endorsement: 'endorsements'
      },
      componentsForms: {
        other: 'OtherForm',
        renewal: 'RenewalForm',
        sinister: 'SinisterForm',
        endorsement: 'EndorsementForm'
      }
    }
  },
  computed: {
    ...mapState('localStorage', ['user', 'userPermissions']),
    executives () {
      return this.$store.state.leads.users.map(({ id, email }) => ({
        value: id,
        text: email
      }))
    },
    localProduct: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    localShow: {
      get () {
        return this.show
      },
      set (value) {
        this.$emit('update:show', value)
      }
    },
    editComponent () {
      const { componentsForms, actionEditType } = this
      return componentsForms[actionEditType]
    }
  },
  created () {
    if (process.env.version === 'CL') {
      this.groups = this.groupscl
      this.products = productscl
    } else {
      this.groups = this.groupsmx
      this.products = productsmx
    }
    this.optionProducts = Object.values(this.products).reduce(
      (acc, curr) => [...acc, ...curr],
      []
    )
    
    this.GetDocument()
    this.GetBitacora()
    this.cancel()
  },
  mounted () {
    this.GetProduct()
  },
  methods: {
    async GetBitacora(){
      this.bitacorasolicitud = await this.$GetBitacoraProduct(this.localProduct.id)
    },
    async savebitacora (val) {
      // Guardar al historial
      val.product = this.localProduct.id
      val.user = this.user.id
      try {
        await this.$simpleeApi.post(
          `/product_bitacora/`,
          val
        )
        this.GetBitacora()
        this.modalbitacora = false
        this.$store.commit('setAlertMessage', { success: 'Se guardo la bitacora' })
      } catch (error) {
        this.$sendErrorPayload({
          payload: val,
          origin: 'request',
          errorResponse: error.response,
          expectedBehavior: `Deberia agregarse un nuevo registro de bitacora a la solicitud ${this.localProduct.id}`
        })
      }
    },
    async cancelbitacora (val) {
      this.modalbitacora = false
      this.bitacorarequestdata = []
      this.bitacorasolicitud = await this.$GetBitacoraProduct(
        this.localProduct.id
      )
    },
    showmodalbitacora (id) {
      this.idproduct = null
      this.idrequest = id
      this.requestbitacoraval = false
      if (id) {
        this.modalbitacora = true
      }
    },
    getLeadState(value){
      if(value === 'renewed') {
        return "Renovado"
      }
      else if(value === 'pending') {
        return "Pendiente"
      }
      else if(value === 'no_corresponde') {
        return "No corresponde"
      }
      else if(value === 'change_company') {
        return "Cambio de compañia"
      }
    },
    getLeadDate (leadDate) {
      const createdAt = new Date(leadDate).toLocaleString('en-GB')
      const [date, hour] = createdAt.split(',')
      return `${date}\n${hour}`
    },
    getBicatoraDate (bitaDate) {
      const date = new Date(bitaDate)

      const day = ('0' + date.getUTCDate()).slice(-2)
      const month = ('0' + (date.getUTCMonth() + 1)).slice(-2)
      const year = date.getUTCFullYear()
      const hours = ('0' + date.getUTCHours()).slice(-2)
      const minutes = ('0' + date.getUTCMinutes()).slice(-2)

      return `${day}/${month}/${year} ${hours}:${minutes}`
    },
    editBitacora (data) {
      this.requestbitacoraval = true
      data.created_at = data.created_at.substring(0, data.created_at.length - 1)
      this.bitacorarequestdata = data
      this.modalbitacora = true
    },
    async saveeditbitacora (val) {
      // Edita Bitacora
      val.product = this.localProduct.id
      val.user = this.user.id
      try {
        await this.$simpleeApi.put(
          `/product_bitacora/${val.id}/`,
          val
        )
        this.GetBitacora()
        this.modalbitacora = false
        this.$store.commit('setAlertMessage', { success: 'Se actualizo la bitacora' })
      } catch (error) {
        this.$sendErrorPayload({
          payload: val,
          origin: 'product',
          errorResponse: error.response,
          expectedBehavior: `Deberia modificarse un nuevo registro de bitacora del producto ${this.localProduct.id}`
        })
      }
    },
    GetFormateProduct2 (valor, key) {
      if (key === 'line') {
        if (valor) {
          const requestObject = this.Lines.find(({ value }) => value === valor)
          if (requestObject) {
            return requestObject.text
          }
          return 'Sin linea'
        } else {
          return ''
        }
      } else if (key === 'name') {
        if (valor) {
          const requestObject = this.optionProducts.find(
            ({ value }) => value === valor
          )
          if (requestObject) {
            return requestObject.text
          }
          return 'No tiene'
        } else {
          return ''
        }
      } else if (key === 'group') {
        if (valor) {
          const requestObject = this.groups.find(
            ({ value }) => value === valor
          )
          if (requestObject) {
            return requestObject.text
          }
          return 'No tiene'
        } else {
          return ''
        }
      } else {
        return valor
      }
    },
    pushpolizaroute (item) {
      const query = {
        id: item.id
      }
      this.$router.push({ path: 'postventa', query })
    },
    async GetProduct () {
      const parent_product = this.value.id
      try {
        const { data } = await this.$simpleeApi.get('/product/', {
          params: { parent_product }
        })
        console.log(data)
        this.ProductsRelation = data.results
      } catch (error) {
        console.log(error)
      }
    },
    GetDocument () {
      for (let i = 0; i < this.localProduct.documents.length; i++) {
        console.log(this.localProduct.documents[i])
        if (this.localProduct.documents[i].title === null) {
          let indice =
            this.localProduct.documents[i].document.indexOf('media/')
          indice = indice + 6
          const extraida =
            this.localProduct.documents[i].document.substring(indice)
          this.localProduct.documents[i].title = extraida
        }
      }
    },
    dragModal (e) {
      const modal = document.querySelector('.draggable-modal')
      const position = modal.getBoundingClientRect()

      window.addEventListener('mousemove', mouseMove)
      window.addEventListener('mouseup', mouseUp)

      const prevX = e.clientX
      const prevY = e.clientY
      function mouseMove (e) {
        document.querySelector('.max-size').style.cursor = 'grabbing'
        const newX = prevX - e.clientX
        const newY = prevY - e.clientY
        modal.style.left = position.left - newX + 'px'
        modal.style.top = position.top - newY + 'px'
      }
      function mouseUp (e) {
        document.querySelector('.max-size').style.cursor = 'grab'
        window.removeEventListener('mousemove', mouseMove)
        window.removeEventListener('mouseup', mouseUp)
      }
    },
    cancel () {
      this.actionEditType = null
      this.item = null
      this.selected = null
    },
    deleteDocument (key) {
      this.localProduct.documents = this.localProduct.documents.filter(
        (_, index) => index !== key
      )
    },
    saveItem ({ type }) {
      if (type === 'renewal') {
        if (!this.item.start_vigency) {
          this.$store.commit('setAlertMessage', {
            error: 'El inicio de vigencia es obligatorio'
          })
          this.renewalFormHasError = true
          return
        }
        if (!this.item.end_vigency) {
          this.$store.commit('setAlertMessage', {
            error: 'El término  de vigencia es obligatorio'
          })
          this.renewalFormHasError = true
          return
        }
        this.renewalFormHasError = false
      }
      const { relatedTypes } = this
      const attribute = relatedTypes[type]
      if (this.item.id) {
        this.localProduct[attribute] = this.localProduct[attribute].map(
          (toUpdate) => {
            if (toUpdate.id !== this.item.id) {
              return toUpdate
            }
            return this.item
          }
        )
      } else {
        this.localProduct[attribute].push(this.item)
      }
      this.actionEditType = null
      this.item = null
    },
    editItem ({ type, id = -1 }) {
      const { relatedTypes } = this
      const attribute = relatedTypes[type]
      const itemToEdit = this.localProduct[attribute].find(
        item => item.id === id
      )
      if (itemToEdit) {
        this.item = { ...itemToEdit }
      } else {
        this.item = {}
      }
      this.actionEditType = type
    },
    deleteItem ({ type, id }) {
      const { relatedTypes } = this
      const attribute = relatedTypes[type]
      this.localProduct.history = this.localProduct.history.filter(
        action => !(action.type === type && action.id === id)
      )
      this.localProduct[attribute] = this.localProduct[attribute].filter(
        item => item.id !== id
      )
    },
    addDocument () {
      this.localProduct.documents.push({})
    },
    save () {
      if (this.loadingDocument) {
        this.$store.commit('setAlertMessage', {
          error: 'Espere un momento, se está cargando un documento.'
        })
      } else {
        this.$emit('save')
      }
    },
    cancelproduct () {
      this.$refs['product-modal'].hide()
      this.$emit('cancel')
    },
    cancelproduct2 () {
      this.$refs['product-modal'].hide()
      this.$emit('cancel2')
    },
    newItem () {
      if (this.option === 'documents') {
        this.addDocument()
      }
    },
    setDocumentFile ({ key, file }) {
      const reader = new FileReader()
      reader.onload = () => {
        this.localProduct.documents[key].document64 = reader.result
      }
      reader.onerror = (error) => {
        alert(
          'Hubo un error al cargar el archivo, por favor intentalo de nuevo.'
        )
        console.log('Error: cargar archivo')
        console.log({ error })
      }

      this.loadingDocument = true
      reader.readAsDataURL(file)
      this.loadingDocument = false
    },
    setChannel (value) {
      this.localProduct.channel = value
      this.localProduct.referred = null
    },
    getTag (tag) {
      const { products } = this
      return products.find(({ value }) => value === tag).text
    },
    removeRenewalFromErrors (id) {
      this.renewalsWithErrors = this.renewalsWithErrors.filter(r => r !== id)
    }
  }
}
</script>

<style lang="scss">
// *{
//   outline: 1px solid red;
// }
.menu-product-modal {
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

  color: #000000;
}

.padding-modal {
  padding: 40px 72px;
}
.product-button {
  background: #ffffff;
  border: 1px solid #d3d3d3;
  box-sizing: border-box;
  border-radius: 5px;
}
.products,
.documents,
.diagnostic {
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
.action-container {
  display: flex;
  flex-direction: column;
  gap: 20px 0;
}
.action {
  width: 100%;
  min-height: 84px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #d3d3d3;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 14px 18px;
  gap: 0px 7px;

  .body {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;

    a {
      color: #000000;
      font-weight: 500;
      &[href] {
        text-decoration: underline;
      }
    }
  }
  .footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    .buttons {
      display: flex;
      gap: 0px 20px;

      .icon {
        color: var(--primary);
        background: #ffffff;
        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.25);
        border-radius: 2px;
        padding: 2px 3px;
        font-size: 18px;
        line-height: 21px;
        cursor: pointer;

        &.trash {
          color: var(--secondary);
        }
      }
    }
    .date {
      color: var(--primary);
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 18px;
    }
  }
}
.buttons-container {
  display: flex;
  flex-direction: row;
  margin-top: auto;
  margin-left: auto;
  gap: 10px 10px;
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
.formErrors {
  border: 2px solid red;
}
.rowClassrequest2 tr {
  background-color: transparent !important;
}
.register-form {
  padding: 23px 20px 50px 20px !important;
}
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
</style>
