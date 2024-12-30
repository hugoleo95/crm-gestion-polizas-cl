<template>
  <div class="table-responsive">
    <span class="title-correccion">Polizas por corregir</span>
    <b-table
      :items="productos"
      :fields="productfields"
      responsive="sm"
      :busy="loadingLeads"
      class="mt-2"
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
      <template #cell(emited_date)="{ value }">
        <p>{{ getProductDate(value) }}</p>
      </template>
      <template #cell(fecha_inicio_vigencia)="{ value }">
        <p>{{ getProductDate(value) }}</p>
      </template>
      <template #cell(fecha_termino_vigencia)="{ value }">
        <p>{{ getProductDate(value) }}</p>
      </template>
      <template #cell(state)="row">
        {{ getProductState(row.item.state) }}
      </template>
      <template #cell(actions)="{ item }">
        <div class="d-flex justify-content-center">
          <button
            v-b-tooltip.hover
            class="circle bg-white shadow-sm border p-3"
            title="Corregir"
            @click="GetProductEdit(item)"
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
    <request-product-modal-edit
      v-if="editProduct"
      :dataproduct="ProductsRequest"
      :show-lead-info2="true"
      fromto="correcciones"
      @hidde="editProduct = false"
      @save-lead="onSaveProductEdit"
      @cancel-lead="editProduct = false"
    />
    <b-modal
      ref="modal-alert4"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h3 class="text-base title-text">
          Se ha guardado la información del producto
        </h3>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4"
          variant="primary"
          @click="closeRequestAlertModal4"
        >
          ¡Entendido!
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-alert5"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h3 class="text-base title-text">
          Debe Registrar el Documento para poder Corregir
        </h3>
      </div>
      <div class="text-center">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4"
          variant="primary"
          :to="{
            name: 'postventa',
            query: {
              id: ProductsRequest.id,
            },
          }"
        >
          Agregar Documento
        </b-button>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import Session from '@/mixins/auth'
import productscl from '~/static/productsgroup.json'
import productsmx from '~/static/productsgroupmx.json'
import RequestProductModalEdit from '~/components/RequestProductModalEdit.vue'
export default {
  components: {
    RequestProductModalEdit
  },
  mixins: [Session],
  data () {
    return {
      products: {},
      ProductsRequest: {},
      editProduct: false,
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
          key: 'emited_date',
          label: 'Fecha emisión',
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
      productos: {}
    }
  },
  computed: {
    ...mapState('leads', [
      'loadingLeads'
    ])
  },
  created () {
    if (process.env.version === 'CL') {
      this.products = productscl
    } else {
      this.products = productsmx
    }
    this.Getproducts()
  },
  beforeDestroy () {
    this.setLoadingLeads(false)
  },
  methods: {
    ...mapMutations('leads', [
      'setLoadingLeads', 'setPolizaError'
    ]),
    getProductDate (product) {
      return product.split('-').reverse().join('/')
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
    GetProductEdit (item) {
      this.ProductsRequest = item
      if (this.editProduct === false) {
        this.editProduct = true
      } else {
        this.editProduct = false
      }
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
    onSaveProductEdit (data) {
      if (data.documents.length === 0) {
        this.$refs['modal-alert5'].show()
      } else {
        delete data.documents
        data.mod = true
        this.$updateProduct(data.id, data)
        this.ProductsRequest = data
        this.Getproducts()
        this.$refs['modal-alert4'].show()
      }
      this.editProduct = false
    },
    closeRequestAlertModal4 () {
      this.$refs['modal-alert4'].hide()
    },
    closeRequestAlertModal5 () {
      this.$refs['modal-alert5'].hide()
    },
    async Getproducts () {
      this.setLoadingLeads(true)
      const user = this.$store.state.localStorage.user.id
      // const user = null
      const params = {
        user,
        inerror: true
      }
      try {
        const {
          data: { results, count }
        } = await this.$simpleeApi.get('/product/', { params })
        for (let i = 0; i < results.length; i++) {
          results[i]._showDetails = false
        }
        this.productos = results
        this.setPolizaError(count)
      } catch (error) {
        // store.commit('setAlertMessage', error.response.data)
      }
      setTimeout(() => {
        this.setLoadingLeads(false)
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
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
.pl-4 {
  padding-left: 1.5rem;
}
.btn-corporativo {
  background-color: #0097a7;
}
.results span {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 14px;
  color: #acacac;
}
.lead-relation {
  padding: 20px;
  margin-top: 20px;
}
.lead-relation h4 {
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #000000;
}
.title-correccion {
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #000000;
}
</style>
