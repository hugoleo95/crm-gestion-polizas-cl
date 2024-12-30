<template>
  <s-form-table
    ref="productForm"
    :class="{ formErrors: hasErrors }"
    class="tb-margin"
  >
    <span
      v-if="localProduct.id"
      class="id-product"
    >
      ID Producto: {{ localProduct.id }}
    </span>
    <tr v-if="showLeadInfo">
      <th>Nombre del lead</th>
      <td>
        <b-form-input
          v-model="localProduct.names"
          placeholder="Nombre del lead"
          disabled
        />
      </td>
    </tr>
    <tr v-if="showLeadInfo">
      <th>Razón social</th>
      <td>
        <b-form-input
          v-model="localProduct.razon_social"
          placeholder="Razón social"
          disabled
        />
      </td>
    </tr>
    <tr>
      <th>Línea de producto</th>
      <td>
        <b-form-select
          id="Lines"
          v-model="localProduct.line"
          placeholder="Selecciona una linea de producto"
          :options="Lines"
          disabled
        />
      </td>
    </tr>
    <tr>
      <th>Producto</th>
      <td>
        <b-form-select
          v-model="localProduct.name"
          placeholder="Selecciona un producto"
          :options="getLineProducts(localProduct.line)"
          disabled
        >
          <template #first>
            <b-form-select-option
              :value="null"
              disabled
            >
              Seleccione un producto
            </b-form-select-option>
          </template>
        </b-form-select>
      </td>
    </tr>
    <tr>
      <th>Compañia</th>
      <td>
        <b-form-select
          v-model="localProduct.company"
          placeholder="Selecciona una compañia"
          :options="getCompanies()"
          disabled
        >
          <template #first>
            <b-form-select-option
              :value="null"
              disabled
            >
              Seleccione una línea de producto
            </b-form-select-option>
          </template>
          <!-- <b-form-select-option
            v-for="({companyValue,name},index) in companies"
            :key="index"
            :value="companyValue"
          >
            {{ name }}
          </b-form-select-option> -->
        </b-form-select>
      </td>
    </tr>
    <tr>
      <th>Número de poliza</th>
      <td>
        <b-input
          v-model="localProduct.nro_poliza"
          disabled
          type="text"
          placeholder=""
        />
      </td>
    </tr>
    <tr>
      <th>Prima</th>
      <td>
        <b-input
          v-model="localProduct.prima"
          disabled
          type="number"
          step=".01"
          placeholder=""
        />
      </td>
    </tr>
    <!--
    <tr v-if="localProduct.prima_bruta">
      <th>Prima Con IVA</th>
      <td>
        <b-input
          v-model="localProduct.prima_bruta"
          disabled
          type="number"
          step=".01"
          placeholder=""
        />
      </td>
    </tr>-->
    <tr v-if="state === 'en_licitacion'">
      <th>Fecha de adjudicación</th>
      <td>
        <b-input
          v-model="localProduct.adjudication_date"
          disabled
          type="date"
          placeholder=""
        />
      </td>
    </tr>
    <tr>
      <th>Fecha de emisión</th>
      <td>
        <b-input
          v-model="localProduct.emited_date"
          disabled
          type="date"
          placeholder=""
        />
      </td>
    </tr>
    <tr>
      <th>Inicio de vigencia</th>
      <td>
        <b-input
          v-model="localProduct.fecha_inicio_vigencia"
          disabled
          type="date"
          placeholder=""
          @change="getDate()"
        />
      </td>
    </tr>
    <tr>
      <th>Término de la vigencia</th>
      <td>
        <b-input
          v-model="localProduct.fecha_termino_vigencia"
          disabled
          type="date"
          :min="localProduct.fecha_inicio_vigencia"
          placeholder=""
          @change="getDate()"
        />
        <span class="textred">{{ errorDate }}</span>
      </td>
    </tr>
    <tr>
      <th>Renovable</th>
      <td>
        <b-form-select
          v-model="localProduct.renewable"
          disabled
        >
          <template #first>
            <b-form-select-option value="renovable">
              Renovable
            </b-form-select-option>
            <b-form-select-option value="no_renovable">
              No renovable
            </b-form-select-option>
            <b-form-select-option value="extension_fecha">
              Extension fecha
            </b-form-select-option>
          </template>
        </b-form-select>
      </td>
    </tr>
    <!--
    <tr>
      <th>Tipo de Pago</th>
      <td>
        <b-form-select disabled v-model="localProduct.tipo_de_pago">
          <template #first>
            <b-form-select-option
              disabled
              :value="null"
            >
              Seleccione un tipo de pago
            </b-form-select-option>
          </template>
          <b-form-select-option
            v-for="{valuepayment, text} in types_payment"
            :key="valuepayment"
            :value="valuepayment"
          >
            {{ text }}
          </b-form-select-option>
        </b-form-select>
      </td>
    </tr>
  -->
    <tr v-if="localProduct.tipo_de_pago === 'aviso_de_cobranza'">
      <th>Dia de cobro</th>
      <td>
        <b-form-select v-model="localProduct.payment_day">
          <template #first>
            <b-form-select-option disabled>
              Seleccione el dia de cobro
            </b-form-select-option>
          </template>
          <b-form-select-option value="5">
            5
          </b-form-select-option>
          <b-form-select-option value="10">
            10
          </b-form-select-option>
          <b-form-select-option value="15">
            15
          </b-form-select-option>
          <b-form-select-option value="20">
            20
          </b-form-select-option>
          <b-form-select-option value="25">
            25
          </b-form-select-option>
        </b-form-select>
      </td>
    </tr>
    <tr>
      <th>Comisión</th>
      <td>
        <b-input
          disabled
          :value="localProduct.comision"
          type="number"
          step=".01"
          placeholder=""
          @input="setComision"
        />
      </td>
    </tr>
    <tr>
      <th>Comisión Final</th>
      <td>
        <b-input
          disabled
          type="number"
          step=".01"
          :value="localProduct.comision_final"
          placeholder=""
        />
      </td>
    </tr>
    <tr>
      <th>Estado póliza</th>
      <td>
        <b-form-select v-model="localProduct.state">
          <b-form-select-option :value="null">
            Sin estado
          </b-form-select-option>
          <b-form-select-option value="valid">
            Vigente
          </b-form-select-option>
          <b-form-select-option value="invalid">
            No Vigente
          </b-form-select-option>
          <b-form-select-option value="canceled">
            Cancelada
          </b-form-select-option>
          <b-form-select-option value="renewed">
            Renovada
          </b-form-select-option>
          <b-form-select-option value="rehabilitated">
            Rehabilitada
          </b-form-select-option>
          <b-form-select-option value="change_company">
            Cambio compañía
          </b-form-select-option>
          <b-form-select-option value="canceled_nopay">
            Cancelada Por No Pago
          </b-form-select-option>
        </b-form-select>
      </td>
    </tr>
    <tr v-if="page === 'poliza'">
      <th>Pago Cliente</th>
      <td>
        <b-form-select v-model="localProduct.client_payment_state">
          <b-form-select-option :value="null">
            Sin estado
          </b-form-select-option>
          <b-form-select-option value="paid">
            Pagada por el cliente
          </b-form-select-option>
          <b-form-select-option value="pending">
            Pendiente de pago
          </b-form-select-option>
          <b-form-select-option value="canceled">
            Cancelada
          </b-form-select-option>
        </b-form-select>
      </td>
    </tr>
    <tr v-if="page === 'poliza'">
      <th>Pago compañía</th>
      <td>
        <b-form-select v-model="localProduct.company_payment_state">
          <b-form-select-option :value="null">
            Sin estado
          </b-form-select-option>
          <b-form-select-option value="paid">
            Pagada por la compañía
          </b-form-select-option>
          <b-form-select-option value="pending">
            Pendiente de pago
          </b-form-select-option>
          <b-form-select-option value="canceled">
            Cancelada
          </b-form-select-option>
        </b-form-select>
      </td>
    </tr>
    <tr v-if="
        (page === 'poliza' && currentUser.is_superuser) ||
          userPermissions.can_make_discount
      ">
      <th>Descuento Monto</th>
      <td>
        <b-input
          v-model="amount"
          disabled
          type="number"
          placeholder="Agrega monto a descontar"
        />
      </td>
    </tr>
    <tr v-if="
        (page === 'poliza' && currentUser.is_superuser) ||
          userPermissions.can_make_discount
      ">
      <th>Descuento Fecha</th>
      <td>
        <b-input
          v-model="date"
          disabled
          type="date"
          placeholder=""
        />
      </td>
    </tr>
    <tr>
      <th>Ejecutivo a cargo</th>
      <td>
        <b-form-select
          v-model="localProduct.user"
          :disabled="usser"
          placeholder="Selecciona una compañia"
          :options="executives"
        >
          <template #first>
            <b-form-select-option
              :value="null"
              disabled
            >
              Seleccione un ejecutivo
            </b-form-select-option>
          </template>
        </b-form-select>
      </td>
    </tr>
    <tr>
      <th>ID Solicitud</th>
      <td>
        <b-input
          v-model="localProduct.lead_request"
          disabled
          type="text"
          placeholder=""
        />
      </td>
    </tr>
    <tr>
      <th>Descripción</th>
      <td>
        <b-form-textarea
          v-model="localProduct.description"
          type="text"
          placeholder=""
          disabled
        />
      </td>
    </tr>

    <tr v-if="localProduct.id && showLink">
      <td colspan="2">
        <b-button
          class="no-validate"
          block
          :to="{
            name: 'postventa',
            query: {
              id: localProduct.id,
            },
          }"
          variant="primary"
        >
          Ir a la póliza
        </b-button>
      </td>
    </tr>
  </s-form-table>
</template>

<script>
import { mapState } from 'vuex'
import SFormTable from '@/components/base/SFormTable.vue'
import products from '~/static/products.json'
import productsmx from '~/static/productsmx.json'
import companies from '~/static/companies.json'
import companiesmx from '~/static/companiesmx.json'
export default {
  name: 'ProductForm',
  components: {
    SFormTable
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    showDelete: {
      type: Boolean,
      default: true
    },
    showLink: {
      type: Boolean,
      default: false
    },
    commission: {
      type: Number,
      default: 0
    },
    usser: {
      type: Number,
      default: 0
    },
    page: {
      type: String,
      required: false,
      default: 'default'
    },
    state: {
      required: true,
      validator: prop => typeof prop === 'string' || prop === null
    },
    showLeadInfo: {
      type: Boolean,
      default: false
    },
    hasErrors: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      amount: 0,
      date: '',
      Lines: null,
      userold: '',
      errorDate: null,
      LinesCl: [
        { value: 'asistencia', text: 'Asistencia' },
        { value: 'garantia', text: 'Garantia' },
        { value: 'generales', text: 'Generales' },
        { value: 'vida', text: 'Vida' },
        { value: 'colectivo_vida', text: 'Colectivo vida' }
      ],
      LinesMx: [
        { value: 'danos', text: 'Daños' },
        { value: 'affinity', text: 'Affinity' },
        { value: 'asistencia', text: 'Asistencia' }
      ],
      types_payment: [],
      types_payment_cl: [
        { valuepayment: 'pac_activo', text: 'PAC - Activo' },
        { valuepayment: 'pac_no_activo', text: 'PAC - No activo' },
        { valuepayment: 'contado', text: 'Contado' },
        { valuepayment: 'aviso_de_cobranza', text: 'Aviso de cobranza' },
        { valuepayment: 'pat_activo', text: 'PAT - Activo' },
        { valuepayment: 'pat_no_activo', text: 'PAT - No activo' }
      ],
      types_payment_mx: [
        { valuepayment: 'mensual', text: 'Mensual' },
        { valuepayment: 'trimestral', text: 'Trimestral' },
        { valuepayment: 'semestral', text: 'Semestral' },
        { valuepayment: 'anual', text: 'Anual' }
      ],
      types_cl: [
        null,
        'pac_activo',
        'pac_no_activo',
        'contado',
        'aviso_de_cobranza',
        'pat_activo',
        'pat_no_activo'
      ],
      types_mx: [null, 'mensual', 'trimestral', 'semestral', 'anual']
    }
  },
  computed: {
    ...mapState('localStorage', {
      currentUser: 'user',
      userPermissions: 'userPermissions'
    }),
    ...mapState('leads', ['users']),
    localProduct: {
      get () {
        return this.value
      },
      set (localProduct) {
        this.$emit('input', localProduct)
      }
    },
    discount () {
      const { amount, date } = this
      return { amount, date }
    },
    executives () {
      return this.$store.state.leads.users.map(({ id, email }) => ({
        value: id,
        text: email
      }))
    }
  },
  watch: {
    commission: {
      immediate: true,
      handler (value) {
        if (value > 0) {
          this.localProduct.comision_final =
            this.localProduct.comision - this.localProduct.comision * value
        } else {
          this.localProduct.comision_final = this.localProduct.comision
          if (!this.localProduct.comision_final) {
            delete this.localProduct.comision_final
          }
        }
      }
    },
    discount () {
      const { amount, date } = this
      if (amount && date) {
        this.localProduct.discount = { amount, date }
      }
    },
    hasErrors: {
      immediate: true,
      handler (val) {
        const inputs = this.$refs.productForm?.$children.filter(
          i =>
            !i.$el.value &&
            !i.$el.disabled &&
            !i.$el.classList.contains('no-validate')
        )
        if (val) {
          inputs?.forEach((e) => {
            if (!e.$el.value) {
              e.$el.classList.add('inputError')
            }
          })
        }
      }
    },
    localProduct: {
      deep: true,
      handler () {
        if (this.hasErrors) {
          const inputs = this.$refs.productForm?.$children
          inputs?.forEach((f) => {
            if (!f.$el.value && !f.$el.disabled) {
              f.$el.classList.add('inputError')
            } else {
              f.$el.classList.remove('inputError')
            }
          })
          if (
            inputs.filter(
              i => !i.$el.value && !i.$el.classList.contains('no-validate')
            ).length === 0
          ) {
            this.$emit('errorsResolved')
          }
        }
      }
    }
  },
  created () {
    if (this.usser) {
      console.log(this.localProduct.user)
      console.log(this.usser)
      if (this.localProduct.user !== this.usser) {
        this.userold = this.localProduct.user
      }
      this.localProduct.user = this.usser
    }
    if (process.env.version === 'CL') {
      this.Lines = this.LinesCl
      this.types_payment = this.types_payment_cl
      const types = [
        null,
        'pac_activo',
        'pac_no_activo',
        'contado',
        'aviso_de_cobranza',
        'pat_activo',
        'pat_no_activo'
      ]
      if (this.localProduct.tipo_de_pago) {
        this.localProduct.tipo_de_pago =
          this.localProduct.tipo_de_pago.toLowerCase()
      }
      // eslint-disable-next-line camelcase
      const { tipo_de_pago = '' } = this.localProduct

      if (types.includes(tipo_de_pago)) {
        return null
      }
      if (tipo_de_pago.includes('pac')) {
        this.localProduct.tipo_de_pago = 'pac_activo'
      } else if (tipo_de_pago.includes('contado')) {
        this.localProduct.tipo_de_pago = 'contado'
      } else if (tipo_de_pago.includes('pat')) {
        this.localProduct.tipo_de_pago = 'pat_activo'
      } else {
        delete this.localProduct.tipo_de_pago
      }
    } else {
      this.Lines = this.LinesMx
      this.types_payment = this.types_payment_mx
    }
    // this.initializeDiscount(this.localProduct.discount)
    if (!this.currentUser.is_superuser) {
      this.localProduct.emited_date =
        this.localProduct.emited_date || new Date().toISOString().split('T')[0]
    }

    if (process.env.version === 'CL') {
      this.Lines = this.LinesCl
    } else {
      this.Lines = this.LinesMx
    }
  },
  methods: {
    getLineProducts (line) {
      if (process.env.version === 'CL') {
        return products[line]
      } else {
        return productsmx[line]
      }
    },
    initializeDiscount (discount) {
      if (discount) {
        this.amount = discount.amount
        this.date = discount.date
      }
    },
    getLeadUser (user) {
      if (user) {
        const leadUser = this.users.find(({ id }) => user === id)
        return leadUser.first_name || leadUser.email.split('@')[0]
      }
      return 'Sin asignar'
    },
    getCompanies () {
      if (process.env.version === 'CL') {
        return companies
      } else {
        return companiesmx
      }
    },
    setComision (comision) {
      this.localProduct.comision = comision
      const value = this.commission
      if (value > 0) {
        this.localProduct.comision_final =
          this.localProduct.comision - this.localProduct.comision * value
      } else {
        this.localProduct.comision_final = this.localProduct.comision
      }
    },
    getDate () {
      const Ini = new Date(this.localProduct.fecha_inicio_vigencia)
      const Fin = new Date(this.localProduct.fecha_termino_vigencia)
      const isValidDate = Date.parse(this.localProduct.fecha_termino_vigencia)
      this.errorDate = null
      if (Ini > Fin) {
        this.errorDate =
          'La fecha Término de la vigencia no puede ser menor a Inicio de vigencia'
      } else if (isNaN(isValidDate)) {
        this.errorDate = 'Fecha no valida'
        return false
      } else {
        this.errorDate = null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.formErrors,
.inputError {
  border: 1px solid red;
}
.textred {
  color: red;
}
span::after {
  padding-left: 5px;
}
input:invalid {
  border: 1px solid red;
}
input:valid {
  border: transparent;
}
.tb-margin {
  margin-top: 30px;
}
.id-product {
  position: absolute;
  margin-top: -25px;
  color: #6461ed !important;
}
.messageuser {
  font-weight: 400;
}
.form-control2 {
  border: 1px solid transparent !important;
  border-radius: 8px !important;
}
</style>
