<template>
  <b-modal
    id="lead-modal"
    ref="leadModal"
    v-model="localShow"
    modal-class="draggable-modal"
    size="lg"
    :title="title"
    body-class="padding-modal"
    scrollable
    no-close-on-backdrop
    @hidden="$emit('hidde')"
  >
    <template #modal-header="{}">
      <div
        class="max-size"
        @mousedown="dragModal"
      >
        <h5>
          <fa-icon
            :icon="['fas', 'edit']"
            class="text-primary mr-2"
          /><b>{{ title }}/</b>
          {{ localLead.razon_social || "Simplee" }}
        </h5>
        <p>Manten presionado para arrastrar el modal2</p>
      </div>
    </template>
    <template #modal-footer="{}">
      <!-- <b-button
        class="text-white py-2 px-3 mr-2"
        size="sm"
        variant="danger"
        @click="saveLead()"
      >
        Eliminar lead
      </b-button> -->
      <b-button
        v-if="$store.state.localStorage.user.role !== 'EXT_KAM'"
        class="text-white py-2 px-3 mr-2"
        size="sm"
        variant="primary"
        :disabled="BotonGuardar"
        @click="saveLead()"
      >
        Guardar y continuar
      </b-button>
      <b-button
        class="text-white p-2 px-3"
        size="sm"
        variant="secondary"
        @click="cancelLead()"
      >
        Cancelar
      </b-button>
    </template>
    <div class="products mt-4">
      <div
        v-for="(product, key) in localLead.products"
        :key="key"
      >
        <b-collapse
          :id="`product-${key}`"
          visible
          accordion="my-accordion"
          role="tabpanel"
        >
          <product-form
            v-model="productsdata"
            show-link
            :cobranza="CobranzaPay"
            :requestdata="requestidpass"
            :commission="commission"
            :state="localLead.state"
            :has-errors="productsWithError.includes(key)"
            :usser="user"
            :show-lead-info="showLeadInfo2"
            :showinfocobranza="fromto === 'correcciones' ? false : true"
            @errorsResolved="removeProductFromErrors(key)"
          />
          <!-- :has-error="localLead.inputsErrors.length > 0" -->
        </b-collapse>
      </div>
    </div>
  </b-modal>
</template>

<script>
import _ from 'lodash'
import ProductForm from '@/components/ProductFormRequest.vue'
import states from '~/static/states.json'
import products from '~/static/products.json'
import productsmx from '~/static/productsmx.json'
import ReasonContact from '~/static/reason_contact.json'
export default {
  components: {
    ProductForm
  },
  props: {
    show: {
      type: Boolean,
      default: true
    },
    showLeadInfo2: {
      type: Boolean,
      default: false
    },
    commission: {
      type: Number,
      default: 0
    },
    value: {
      type: Object,
      default: () => ({
        documents: [{ document: null }],
        products: [{}],
        diagnostics: [{}]
      })
    },
    dataproduct: {
      type: Object,
      default: () => ({})
    },
    requestidpass: {
      type: Object,
      default: () => ({})
    },
    Cobranza: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: 'Crear'
    },
    user: {
      type: Number,
      default: 0
    },
    fromto: {
      type: String,
      default: ''
    }

  },
  data () {
    return {
      clonedLead: null,
      states: states.filter(({ value }) => value !== 'sin_estado'),
      option: 'general',
      urldocument: '',
      version: 'CL',
      BotonGuardar: false,
      productsWithError: [],
      productsdata: this.dataproduct,
      CobranzaPay: {
        id: null,
        payment_type: '',
        dues: 1,
        payment_date_start: null,
        executive: 15,
        iva_percentage: 19,
        amount_dues: null
      },
      NamesCL: {
        rut: 'Rut',
        comuna: 'Comuna'
      },
      NamesMX: {
        rut: 'Rfc',
        comuna: 'Colonia'
      },
      Productsold: [
        'rc',
        'rc_mal_praxis',
        'trc',
        'automovil',
        'incendio',
        'hogar',
        'transporte_terrestre',
        'condominio',
        'arriendo',
        'apv',
        'colectivo_vida',
        'seguro_covid',
        'salud',
        'garantia'
      ],
      Names: '',
      optionsPerson: [
        { value: 'legal_person', text: 'Jurídica' },
        { value: 'natural_person', text: 'Natural' }
      ],
      optionsPersonCL: [
        { value: 'legal_person', text: 'Jurídica' },
        { value: 'natural_person', text: 'Natural' }
      ],
      optionsPersonMX: [
        { value: 'legal_person', text: 'Moral' },
        { value: 'natural_person', text: 'Fisica' }
      ],
      optionsPriority: [
        { value: null, text: 'Sin prioridad' },
        { value: 'baja', text: 'Baja' },
        { value: 'media', text: 'Media' },
        { value: 'alta', text: 'Alta' }
      ],
      duplicatedRutLeads: [],
      NUM_RESULTS_PRODUCTS: 5,
      pag_product: 1,
      NUM_RESULTS_DOCUMENT: 5,
      pag_document: 1,
      selectedDuplicate: null,
      loadingDocument: false,
      loadingSection: false,
      productsLoaded: false,
      documentsLoaded: false,
      products: Object.values(products).reduce(
        (acc, curr) => [...acc, ...curr],
        []
      ),
      productsmx: Object.values(productsmx).reduce(
        (acc, curr) => [...acc, ...curr],
        []
      ),
      reason_contact: ReasonContact
    }
  },
  computed: {
    channels () {
      return this.$store.state.leads.channels.map(({ id, name }) => ({
        value: id,
        text: name
      }))
    },
    executives () {
      return this.$store.state.leads.users.map(({ id, email }) => ({
        value: id,
        text: email
      }))
    },
    CountPageProduct () {
      if (
        this.localLead.products?.length >
        this.NUM_RESULTS_PRODUCTS * this.pag_product
      ) {
        return this.pag_product * this.NUM_RESULTS_PRODUCTS
      }
      return this.localLead.products?.length || 0
    },
    CountPageDocument () {
      if (
        this.localLead.documents?.length >
        this.NUM_RESULTS_DOCUMENT * this.pag_document
      ) {
        return this.pag_document * this.NUM_RESULTS_DOCUMENT
      }
      return this.localLead.documents?.length ?? 0
    },
    refferals () {
      return this.$store.state.leads.refferals.map(
        ({ id, name, comision }) => ({
          value: id,
          text: name,
          commission: comision
        })
      )
    },
    localLead: {
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
    availableOptions () {
      if (process.env.version === 'CL') {
        const { products } = this
        if (typeof this.localLead.product_interest === 'undefined') {
          return products
        } else {
          return products.filter(
            ({ value }) => !this.localLead.product_interest.includes(value)
          )
        }
      } else {
        const { productsmx } = this
        if (typeof this.localLead.product_interest === 'undefined') {
          return productsmx
        } else {
          return productsmx.filter(
            ({ value }) => !this.localLead.product_interest.includes(value)
          )
        }
      }
    },
    optionsDocuments () {
      return this.localLead.products
        ? this.localLead.products
          .filter(product => product.id)
          .map((product) => {
            return {
              value: product.id,
              text: `${product.name || ''} ${product.nro_poliza || ''} ${product.company || ''
                }`
            }
          })
        : []
    }
  },
  watch: {
    'localLead.channel': {
      immediate: true,
      handler (value) {
        const channelReffered = this.channels.find(
          ({ text }) => text === 'Referido'
        )

        if (value !== channelReffered?.value) {
          this.localLead.referred = null
        }
      }
    },
    'localLead.products': {
      handler (value) {
        this.localLead.documents?.forEach((doc, i) => {
          const exists = value.find(prod => prod.id === doc.product)
          if (!exists) {
            this.localLead.documents[i].product = null
          }
        })
      }
    },
    'localLead.rut': {
      handler () {
        this.getLeadsWithSameRut()
      }
    },
    'localLead.state': {
      handler (val) {
        if (val !== 'cliente_cerrado') {
          this.productsWithError = []
        }
      }
    },
    selectedDuplicate (id) {
      if (id) {
        this.$router.push({ path: '/leads', query: { id } })
      }
    },
    option (val) {
      if (val === 'products' && !this.productsLoaded) {
        this.getLeadProducts()
      }
      if (val === 'documents' && !this.documentsLoaded) {
        this.getLeadDocuments()
      }
    }
  },
  created () {
    this.version = process.env.version
    if (this.Cobranza) {
      this.CobranzaPay.dues = this.Cobranza.dues_count
      this.CobranzaPay.payment_type = this.Cobranza.current_payment_type
      this.CobranzaPay.payment_date_start = this.Cobranza.first_payment_day
      this.CobranzaPay.id = this.Cobranza.id
    }
    this.duplicatedRutLeads = this.formatDuplicates(this.localLead.duplicates)
    if (process.env.version === 'CL') {
      this.Names = this.NamesCL
      this.optionsPerson = this.optionsPersonCL
      this.urldocument = '/formatoproductosimplee.xlsx'
    } else {
      this.Names = this.NamesMX
      this.optionsPerson = this.optionsPersonMX
      this.urldocument = '/formatoproductosimpleemx.xlsx'
    }
  },
  methods: {
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
    async getLeadProducts () {
      if (this.localLead.id) {
        this.loadingSection = true
        try {
          const products = await this.$simpleeApi.get(
            `/lead/${this.value.id}/product/`
          )
          this.localLead = {
            ...this.localLead,
            products: products.data.results
          }
          this.productsLoaded = true
        } catch (error) {
          this.$store.commit('setAlertMessage', error.response.data)
          this.product = 'general'
        }
        this.loadingSection = false
      } else {
        this.localLead = {
          ...this.localLead,
          products: this.localLead.products ?? []
        }
      }
    },
    getDoc ($event) {
      this.$emit('save-document-only', $event)
    },
    deleteProduct (key) {
      this.localLead.products = this.localLead.products?.filter(
        (_, index) => index !== key
      )
    },
    deleteDocument (key) {
      this.localLead.documents = this.localLead.documents.filter(
        (_, index) => index !== key
      )
    },
    deleteDiagnostic (key) {
      this.localLead.diagnostics = this.localLead.diagnostics.filter(
        (_, index) => index !== key
      )
    },
    addProduct (register) {
      if (register) {
        this.localLead.products?.push({ ...register })
      } else {
        this.localLead.products?.push({
          line: null,
          name: 'Nuevo Producto',
          company: null
        })
      }
    },
    addDocument (document = {}) {
      this.localLead.documents.push(document)
    },
    addDiagnostic () {
      this.localLead.diagnostics.push({ insurances_contrated: [] })
    },
    saveLead () {
      this.BotonGuardar = true
      if (!this.productsdata.is_ans) {
        this.$store.commit('setAlertMessage', {
          error: 'Tienes que indicar si el producto es de ANS'
        })
        this.BotonGuardar = false
        return
      }
      if (this.productsdata.parent_product && this.productsdata.product_type === 'poliza') {
        this.$store.commit('setAlertMessage', {
          error: 'Solo los productos tipo endoso o renovación pueden tener un producto padre'
        })
        this.BotonGuardar = false
        return
      }
      if (!this.productsdata.nro_poliza) {
        this.productsdata.nro_poliza = null
      }
      console.log(this.productsdata)
      if (this.productsdata.product_type !== 'poliza') {
        /**
          if (
            !this.productsdata.parent_product ||
            !this.productsdata.product_type
          ) {
            this.$store.commit('setAlertMessage', {
              error: 'Todos los campos del producto son obligatorios'
            })
            this.BotonGuardar = false
            return
          }
        */
        if (this.productsdata.product_type === 'endoso') {
          if (!this.productsdata.comision) {
            this.productsdata.comision = 0
          }
          if (!this.productsdata.comision_final) {
            this.productsdata.comision_final = 0
          }
          if (!this.productsdata.prima) {
            this.productsdata.prima = 0
          }
          console.log(this.productsdata)
          if (
            !this.productsdata.company ||
            !this.productsdata.endorsement_nro ||
            !this.productsdata.emited_date ||
            !this.productsdata.fecha_inicio_vigencia ||
            !this.productsdata.fecha_termino_vigencia ||
            !this.productsdata.line ||
            !this.productsdata.name ||
            !this.productsdata.user ||
            !this.productsdata.group
          ) {
            this.$store.commit('setAlertMessage', {
              error: 'Todos los campos del producto son obligatorios'
            })
            this.BotonGuardar = false
            return
          }
        } else if (
          !this.productsdata.company ||
          !this.productsdata.renewable ||
          !this.productsdata.emited_date ||
          !this.productsdata.fecha_inicio_vigencia ||
          !this.productsdata.fecha_termino_vigencia ||
          !this.productsdata.line ||
          !this.productsdata.name ||
          !this.productsdata.prima ||
          !this.productsdata.user ||
          !this.productsdata.group
        ) {
          this.$store.commit('setAlertMessage', {
            error: 'Todos los campos del producto son obligatorios'
          })
          this.BotonGuardar = false
          return
        }
      } else if (
        !this.productsdata.comision ||
        !this.productsdata.product_type ||
        !this.productsdata.comision_final ||
        !this.productsdata.company ||
        !this.productsdata.renewable ||
        !this.productsdata.emited_date ||
        !this.productsdata.fecha_inicio_vigencia ||
        !this.productsdata.fecha_termino_vigencia ||
        !this.productsdata.line ||
        !this.productsdata.name ||
        !this.productsdata.prima ||
        !this.productsdata.user ||
        !this.productsdata.group
      ) {
        this.$store.commit('setAlertMessage', {
          error: 'Todos los campos de todos sus productos son obligatorios'
        })
        this.BotonGuardar = false
        return
      }
      if (this.productsdata.name) {
        for (let i = 0; i < this.Productsold.length; i++) {
          console.log(this.productsdata.name, this.Productsold[i])
          if (this.productsdata.name == this.Productsold[i]) {
            this.$store.commit('setAlertMessage', {
              error:
                'Esta seleccionando un producto que ya no es valido, por favor ingrese otro valido'
            })
            this.BotonGuardar = false
            return
          }
        }
      }
      /* if (this.productsdata.tipo_de_pago === 'aviso_de_cobranza'
      ) {
        if (!this.productsdata.payment_day
        ) {
          this.$store.commit('setAlertMessage', { error: 'Si el tipo de pago es aviso de cobranza, debe ingresar los dias de cobro' })
          this.BotonGuardar = false
          return
        }
      }
      */
      if (this.productsdata.product_type === 'poliza') {
        delete this.productsdata.renewal_info
        delete this.productsdata.endorsement_info
      }
      if (this.productsdata.product_type === 'renovacion') {
        delete this.productsdata.endorsement_info
        this.productsdata.renewal_info = null
      }
      if (this.productsdata.product_type === 'endoso') {
        this.productsdata.renewable = null
        delete this.productsdata.renewal_info
        this.productsdata.renewable = null
        this.productsdata.endorsement_info = {
          endorsement_nro: this.productsdata.endorsement_nro
        }
      }
      if (this.version === 'CL' && this.fromto === '' && this.productsdata.product_type !== 'endoso') {
        if (!this.productsdata.Cobranza.id) {
          if (
            !this.productsdata.Cobranza.payment_type ||
            !this.productsdata.Cobranza.payment_date_start ||
            !this.productsdata.Cobranza.dues
          ) {
            this.$store.commit('setAlertMessage', {
              error: 'Todos los campos de la cobranza son obligatorios'
            })
            this.BotonGuardar = false
            return
          }
        }
      }
      this.BotonGuardar = false
      this.$emit('save-lead', this.productsdata)
    },
    cancelLead () {
      this.$emit('cancel-lead')
    },
    newItem () {
      if (this.option === 'products') {
        this.addProduct()
      }
      if (this.option === 'documents') {
        this.addDocument()
      }
      if (this.option === 'diagnostic') {
        this.addDiagnostic()
      }
    },
    setDocumentFile ({ key = null, file }) {
      const reader = new FileReader()
      reader.onload = () => {
        if (key === null) {
          this.addDocument({
            document64: reader.result,
            title: file.name
          })
        } else {
          this.localLead.documents[key].document64 = reader.result
          this.localLead.documents[key].title = file.name
        }
      }
      reader.onerror = (error) => {
        this.$store.commit('setAlertMessage', {
          error:
            'Hubo un error al cargar el archivo, por favor intentalo de nuevo.'
        })
        console.log({ error })
      }

      this.loadingDocument = true
      reader.readAsDataURL(file)
      this.loadingDocument = false
    },
    setChannel (value) {
      this.localLead.channel = value
      this.localLead.referred = null
    },
    setReasonContact (value) {
      this.localLead.contact_reason = value
    },
    getTag (tag) {
      const { products } = this
      return products.find(({ value }) => value === tag).text
    },
    formatDuplicates (data) {
      if (data && data.length > 0) {
        return data
          .filter(lead => lead.id !== this.localLead.id)
          .map((lead) => {
            return {
              Value: lead.id,
              text: `${lead.name || ''} ${lead.last_name || ''} ${lead.razon_social || ''
                }`
            }
          })
      } else {
        return []
      }
    },
    getLeadsWithSameRut: _.debounce(async function () {
      if (this.localLead.rut && this.localLead.rut.length > 0) {
        try {
          const { data } = await this.$simpleeApi.get(
            `/lead/?rut=${this.localLead.rut}`
          )
          this.duplicatedRutLeads = this.formatDuplicates(data.results)
          this.selectedDuplicate = null
        } catch (error) {
          this.$store.commit('setAlertMessage', error.response.data)
        }
      } else {
        this.duplicatedRutLeads = []
      }
    }, 500),
    setProductsErrors () {
      this.productsWithError = [
        ...this.localLead.products.filter((p) => {
          return (
            !p.comision ||
            !p.comision_final ||
            !p.company ||
            !p.emited_date ||
            !p.fecha_inicio_vigencia ||
            !p.fecha_termino_vigencia ||
            !p.line ||
            !p.name ||
            !p.nro_poliza ||
            !p.prima ||
            !p.tipo_de_pago ||
            !p.user ||
            !p.description
          )
        })
      ].map(p => this.localLead.products.indexOf(p))
    },
    removeProductFromErrors (key) {
      this.productsWithError = this.productsWithError.filter(p => p !== key)
    }
  }
}
</script>

<style lang="scss">
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
</style>
