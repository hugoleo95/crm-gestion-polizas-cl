<template>
  <b-modal
    id="lead-modal"
    ref="leadModal"
    v-model="localShow"
    modal-class="draggable-modal"
    size="xl"
    :title="title"
    body-class="padding-modal pr-5 pl-5"
    scrollable
    @hidden="$emit('hidde')"
  >
    <template #modal-header="{}">
      <div class="max-size" @mousedown="dragModal">
        <h5>
          <fa-icon :icon="['fas', 'edit']" class="text-primary mr-2" /><b>{{ title }}/</b>
          {{ localLead.razon_social || "Simplee" }}
        </h5>
        <p>Manten presionado para arrastrar el modal</p>
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
        class="text-white p-2 px-3"
        size="sm"
        variant="secondary"
        @click="cancelLead()"
      >
        Cancelar
      </b-button>
    </template>
    <div class="products mt-4">
      <section class="ftco-section">
        <div v-if="!postventa" class="position-relative w-100 text-center">
          <span>
            <strong>
              Recuerde que si el producto es antiguo el producto deber
              pertenecer al mismo contacto que pertenece la solicitud
            </strong>
          </span>
        </div>
        <div class="position-relative">
          <fa-icon
            class="position-absolute text-secondary"
            style="left: 0.6rem; top: 0.72rem"
            :icon="['fas', 'search']"
          />
          <div class="relative">
            <input
              class="searchBar"
              placeholder="Buscar"
              @input="debouncedSearch"
            >
          </div>
        </div>
        <div class="container shadow container-request">
          <div class="row mt-0">
            <div class="col-md-12 pl-0 pr-0">
              <div class="table-wrap">
                <table class="table table-hover table-striped mb-0">
                  <thead>
                    <tr>
                      <th>N° Poliza</th>
                      <th>Tipo Producto</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Producto</th>
                      <th>Ejecutiva/o</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    <td
                      v-if="loading"
                      class="text-center"
                      scope="row"
                      colspan="5"
                    >
                      <div class="d-flex flex-fill h-100 loading text-center">
                        <div
                          class="text-center text-primary pa-5 mx-auto my-auto"
                        >
                          <b-spinner class="align-middle" />
                          <strong>Cargando...</strong>
                        </div>
                      </div>
                    </td>
                    <tr
                      v-for="(re, id) in Polizas"
                      v-else
                      :key="id"
                      class="table-primary"
                    >
                      <td class="text-center">
                        {{ re.nro_poliza }}
                      </td>
                      <td class="text-center">
                        {{ re.product_type }}
                      </td>
                      <td class="text-center" scope="row">
                        {{ re.names }}
                      </td>
                      <td class="text-center">
                        {{ re.email }}
                      </td>
                      <td class="text-center">
                        {{ re.name }}
                      </td>
                      <td class="text-center">
                        {{ getLeadUser(re.user) }}
                      </td>
                      <td class="text-center">
                        <div class="d-flex justify-content-center">
                          <button
                            class="circle mr-2 bg-white shadow-sm border p-3"
                            @click="ModificarPoliza(re)"
                          >
                            <fa-icon
                              :icon="['fas', 'thumbtack']"
                              class="text-primary"
                              style="font-size: 0.9rem"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div v-if="nPolizas < 1" class="position-relative w-100 text-center">
          <span>
            Por favor ingrese el numero de poliza, nombre completo, correo
            completo o nombre producto completo del producto en el campo de
            busqueda
          </span>
        </div>
      </section>
    </div>
  </b-modal>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import states from '~/static/states.json'
import products from '~/static/products.json'
import productsmx from '~/static/productsmx.json'
import ReasonContact from '~/static/reason_contact.json'
export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: true
    },
    postventa: {
      type: Boolean,
      default: false
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
    title: {
      type: String,
      default: 'Reasignar Producto'
    }
  },
  data () {
    return {
      clonedLead: null,
      states: states.filter(({ value }) => value !== 'sin_estado'),
      option: 'general',
      commission: 0,
      urldocument: '',
      Polizas: {},
      nPolizas: 0,
      productsWithError: [],
      productsdata: this.dataproduct,
      loading: false,
      NamesCL: {
        rut: 'Rut',
        comuna: 'Comuna'
      },
      NamesMX: {
        rut: 'Rfc',
        comuna: 'Colonia'
      },
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
    ...mapState('leads', ['users']),
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
              text: `${product.name || ''} ${product.nro_poliza || ''} ${
                  product.company || ''
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
    'localLead.referred': {
      immediate: true,
      handler (value) {
        if (value) {
          const [referred] = this.refferals.filter(
            ({ value }) => value === this.localLead.referred
          )
          this.commission = referred.commission
        } else {
          this.commission = 0
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
  methods: {
    debouncedSearch: _.debounce(function (e) {
      this.getPoliza(e.target.value)
    }, 750),
    async getPoliza (dato) {
      this.loading = true
      const params = {
        search: dato
      }
      const page = 1
      this.Polizas = null
      try {
        const {
          data: { results, count }
        } = await this.$simpleeApi.get('/product/', {
          params: { ...params }
        })
        this.totalItems = count

        const formattedName = lead =>
          `${lead?.name || ''} ${lead?.last_name || ''}`

        this.Polizas = results.map(({ user, lead, ...rest }) => {
          return {
            ...rest,
            user: user || lead?.user || '',
            lead,
            razon_social: lead?.razon_social || '',
            email: lead?.email || '',
            names: formattedName(lead)
          }
        })
        console.log(this.Polizas)
        console.log(dato)
        this.nPolizas = count
        if (!dato) {
          this.nPolizas = 0
          this.Polizas = {}
        }
      } catch (error) {
        this.$store.commit('setAlertMessage', error?.response?.data)
      }
      this.loading = false
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
    getLeadUser (user) {
      if (user) {
        const { firstname, email } = this.$store.state.leads.users.find(
          ({ id }) => user === id
        )
        return firstname || email.split('@')[0]
      }
      return 'Sin asignar'
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
      if (
        !this.productsdata.comision ||
        !this.productsdata.comision_final ||
        !this.productsdata.company ||
        !this.productsdata.emited_date ||
        !this.productsdata.fecha_inicio_vigencia ||
        !this.productsdata.fecha_termino_vigencia ||
        !this.productsdata.line ||
        !this.productsdata.name ||
        !this.productsdata.nro_poliza ||
        !this.productsdata.prima ||
        !this.productsdata.user ||
        !this.productsdata.description
      ) {
        this.$store.commit('setAlertMessage', {
          error: 'Todos los campos de todos sus productos son obligatorios'
        })
        return
      }
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
    ModificarPoliza (value) {
      let product
      if (!this.postventa) {
        product = value.id
      } else {
        product = value
      }
      this.$bvModal
        .msgBoxConfirm(
          '¿Esta seguro de asignar el producto a esta solicitud?',
          {
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
          }
        )
        .then((value) => {
          if (value) {
            this.$emit('UpdateProduct', product)
          }
        })
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
              text: `${lead.name || ''} ${lead.last_name || ''} ${
                lead.razon_social || ''
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
    padding: 0px 40px 40px 40px !important;
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
</style>
