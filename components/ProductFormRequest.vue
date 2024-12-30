<!-- eslint-disable semi -->
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
      <th>Nombre del contacto</th>
      <td>
        <b-form-input
          v-model="leadName"
          placeholder="Nombre del lead"
          disabled
        />
      </td>
    </tr>
    <tr v-if="showLeadInfo">
      <th>Razón social</th>
      <td>
        <b-form-input
          v-model="leadRazonSocial"
          placeholder="Razón social"
          disabled
        />
      </td>
    </tr>
    <tr v-if="showLeadInfo">
      <th>RUT</th>
      <td>
        <b-form-input
          v-model="leadRut"
          placeholder="Rut"
          disabled
        />
      </td>
    </tr>
    <tr v-if="showLeadInfo">
      <th>Correo</th>
      <td>
        <b-form-input
          v-model="leadEmail"
          placeholder="Correo"
          disabled
        />
      </td>
    </tr>
  
    <tr>
      <th>Tipo de producto</th>
      <td>
        <b-form-select
          id="Lines"
          v-model="localProduct.product_type"
          placeholder="Selecciona un tipo de producto"
          :options="productOptions"
          @change="UpdateTypeProduct"
        />
      </td>
    </tr>
    <tr v-if="typeproduct !== 'poliza' || localProduct.parent_product">
      <th>ID Producto padre</th>
      <td>
        <div class="d-flex d-flex-row justify-content-end align-items-center">
          <nuxt-link
            v-if="localProduct.parent_product"
            :to="{
              path: '/postventa',
              query: {
                id: localProduct.parent_product,
              },
            }"
            class="text-underline w-50 d-flex pl-2"
          >
            {{ localProduct.parent_product }}
          </nuxt-link>
          <span
            class="messageuser w-50 text-right cursor-pointer"
            @click="modalreasigproduct = true"
          ><fa-icon
              :icon="['fas', 'search']"
              class="mr-2"
            />Buscar
          </span>
          <span
            class="messageuser w-50 text-right pr-2 cursor-pointer"
            @click="deleteProduct"
          ><fa-icon
              :icon="['fas', 'trash-alt']"
              class="mr-2"
            />Limpiar
          </span>
        </div>
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
          @change="getLineGrup(localProduct.line)"
        />
      </td>
    </tr>
    <tr>
      <th>Grupo de producto</th>
      <td>
        <b-form-select
          id="Lines"
          v-model="localProduct.group"
          placeholder="Selecciona un grupo de producto"
          :disabled="!localProduct.line"
          :options="GroupsSelect"
          @change="getLineProducts(localProduct.group);getCompanies()"
        />
      </td>
    </tr>
    <tr>
      <th>Producto</th>
      <td>
        <b-form-select
          v-model="localProduct.name"
          placeholder="Selecciona un producto"
          :options="ProductSelect"
          :disabled="!localProduct.group"
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
          :disabled="!localProduct.group"
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
      <th>Poliza en emisión</th>
      <td
        class="text-center"
        style="display:flex;justify-content:center;"
      >
        <b-form-checkbox
          id="checkbox-1"
          v-model="statusPoliza"
          name="checkbox-1"
          :value="true"
          @change="selectRow({ $event })"
        />
      </td>
    </tr>
    <tr>
      <th>Número de poliza</th>
      <td>
        <b-input
          v-model="localProduct.nro_poliza"
          type="text"
          placeholder=""
          :disabled="statusPoliza"
        />
      </td>
    </tr>
    <!--<tr v-if="typeproduct === 'renovacion'">
      <th>Número de renovación</th>
      <td>
        <b-input
          v-model="localProduct.renewal_number"
          type="text"
          placeholder=""
        />
      </td>
    </tr>
    -->
    <tr v-if="typeproduct === 'endoso'">
      <th>Número de endoso</th>
      <td>
        <b-input
          v-model="localProduct.endorsement_nro"
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
          type="date"
          :min="localProduct.fecha_inicio_vigencia"
          placeholder=""
          @change="getDate()"
        />
        <span class="textred">{{ errorDate }}</span>
      </td>
    </tr>
    <tr v-if="typeproduct !== 'endoso'">
      <th>Renovable</th>
      <td>
        <b-form-select v-model="localProduct.renewable">
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
    -->
    <tr>
      <th>Comisión</th>
      <td>
        <b-input
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
          type="number"
          step=".01"
          :value="localProduct.comision_final"
          disabled
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
        (page === 'poliza' && currentUser.is_superuser)
      ">
      <th>Descuento Monto</th>
      <td>
        <b-input
          v-model="amount"
          type="number"
          placeholder="Agrega monto a descontar"
        />
      </td>
    </tr>
    <tr v-if="
        (page === 'poliza' && currentUser.is_superuser)
      ">
      <th>Descuento Fecha</th>
      <td>
        <b-input
          v-model="date"
          type="date"
          placeholder=""
        />
      </td>
    </tr>
    <tr v-if="!localProduct.user">
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

    <tr v-if="
        localProduct.user &&
          (currentUser.role !== 'KAM' || currentUser.id === localProduct.user)
      ">
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
    <tr v-if="userold">
      <td
        colspan="2"
        class="px-4 py-2"
      >
        <span class="messageuser">Este producto tiene asignado a:
          <strong>{{ getLeadUser(userold) }} </strong> como ejecutivo, presione
          <strong> Guardar y continuar </strong> para asignarle el ejecutivo de
          la solicitud : <strong>{{ getLeadUser(localProduct.user) }}</strong>
        </span>
      </td>
    </tr>

    <!-- <tr>
      <th>Etiquetas</th>
      <td>
        <b-form-tags
          id="tags-component-select"
          v-model="localProduct.tags"
          size="md"
          add-on-change
          tag-variant="primary"
          no-outer-focus
        >
          <template #default="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
            <b-form-select
              v-bind="inputAttrs"
              :disabled="disabled || availableOptions.length === 0"
              :options="availableOptions"
              v-on="inputHandlers"
              class="formedit form-input custom-select mb-3"
            >
              <template #first>
                <option
                  disabled
                  value=""
                >
                  Seleccione una etiqueta
                </option>
              </template>
            </b-form-select>
            <ul
              v-if="tags.length > 0"
              class="list-inline d-inline-block mb-2"
            >
              <li
                v-for="tag in tags"
                :key="tag"
                class="list-inline-item mb-2"
              >
                <b-form-tag
                  :title="tag"
                  :disabled="disabled"
                  class="text-white"
                  variant="primary"
                  @remove="removeTag(tag)"
                >
                  {{ tag }}
                </b-form-tag>
              </li>
            </ul>

          </template>
        </b-form-tags>
      </td>
    </tr>
    -->
    <tr>
      <th>Descripción</th>
      <td>
        <b-form-textarea
          v-model="localProduct.description"
          type="text"
          placeholder=""
        />
      </td>
    </tr>
    <tr v-if="version ==='CL' && showinfocobranza===true">
      <td
        colspan="2"
        class="px-3 py-2"
      >
        <span class="messageuser">Información de cobranza
        </span>
      </td>
    </tr>
    <tr v-if="version ==='CL' && showinfocobranza===true">
      <th>Tipo de Pago</th>
      <td>
        <b-form-select
          v-model="localProduct.Cobranza.payment_type"
          :disabled="localProduct.Cobranza.id"
          @change="ChangeTypePago({option:$event})"
        >
          <template #first>
            <b-form-select-option :value="null">
              Seleccione un tipo de pago
            </b-form-select-option>
          </template>
          <b-form-select-option
            v-for="{value, text} in types_payment"
            :key="value"
            :value="value"
          >
            {{ text }}
          </b-form-select-option>
        </b-form-select>
      </td>
    </tr>
    <tr v-if="version ==='CL' && showinfocobranza===true">
      <th>Inicio cobranza</th>
      <td>
        <b-input
          v-model="localProduct.Cobranza.payment_date_start"
          type="date"
          placeholder=""
          :disabled="localProduct.Cobranza.id"
          @change="getDate()"
        />
      </td>
    </tr>
    <tr v-if="version ==='CL' && showinfocobranza===true">
      <th>N° de cuotas</th>
      <td>
        <b-input
          v-model="localProduct.Cobranza.dues"
          type="number"
          placeholder=""
          :disabled="localProduct.Cobranza.id"
        />
      </td>
    </tr>
    <tr v-if="localProduct.id && version ==='CL'">
      <td colspan="2">
        <b-button
          class="no-validate text-white"
          block
          @click="sendDocumentPoliza"
          variant="dark"
        >
          Enviar Documento de Poliza al correo del cliente
        </b-button>
      </td>
    </tr>
    <tr v-if="localProduct.Cobranza.id && version ==='CL'">
      <td colspan="2">
        <b-button
          class="no-validate"
          block
          :to="{
            name: 'cobrar',
            query: {
              id: localProduct.Cobranza.id,
            },
          }"
          variant="info"
        >
          Ir a la Cobranza
        </b-button>
      </td>
    </tr>
    <tr v-if="localProduct.id && showLink && $store.state.localStorage.user.role !== 'EXT_KAM'">
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
    <tr v-if="localProduct.id && $store.state.localStorage.user.role !== 'EXT_KAM'">
      <td colspan="2">
        <b-button
          class="no-validate"
          block
          :to="{
            name: 'cobrar-nuevo',
            query: {
              id: localProduct.id,
            },
          }"
          variant="success"
        >
          Pagar
        </b-button>
      </td>
    </tr>
    <reasignar-product-request
      v-if="modalreasigproduct"
      postventa
      @hidde="onCloseModal"
      @cancel-lead="onCloseModal"
      @UpdateProduct="UpdateProductNew"
    />
  </s-form-table>
</template>

<script>
import { mapState } from 'vuex'
import SFormTable from '@/components/base/SFormTable.vue'
import products from '~/static/productsv2.json'
import productsmx from '~/static/productsmxv2.json'
import companies from '~/static/companies.json'
import companiesmx from '~/static/companiesmx.json'
import ReasignarProductRequest from '~/components/ReasignarProductRequest2.vue'
export default {
  name: 'ProductForm',
  components: {
    SFormTable,
    ReasignarProductRequest
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    postventa: {
      type: Boolean,
      default: false
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
    },
    requestdata: {
      type: Object,
      default: () => ({})
    },
    cobranza: {
      type: Object,
      default: () => ({})
    },
    comefrom: {
      type: String,
      default: ''
    },
    showinfocobranza: {
      type: Boolean,
      default: true
    }

  },
  data () {
    return {
      amount: 0,
      date: '',
      Lines: null,
      userold: '',
      statusPoliza: true,
      version: 'CL',
      typeproduct: '',
      modalreasigproduct: false,
      errorDate: null,
      Groups: [],
      ProductSelect: [],
      GroupsSelect: [],
      GroupsLine: [],
      ProductsGroup: [],
      optionsans: [
        { item: 'true', name: 'Si' },
        { item: 'false', name: 'No' }
      ],
      CobranzaPay: {},
      Productype: [
        { value: 'poliza', text: 'Poliza' },
        { value: 'endoso', text: 'Endoso' },
        { value: 'renovacion', text: 'Renovación' }
      ],
      ProductypeOutPoliza: [
        { value: 'endoso', text: 'Endoso' },
        { value: 'renovacion', text: 'Renovación' }
      ],
      LinesCl: [
        { value: 'asistencias', text: 'Asistencias' },
        { value: 'garantia', text: 'Garantia' },
        { value: 'generales', text: 'Generales' },
        { value: 'salud', text: 'Salud' }
      ],
      LinesMx: [
        { value: 'asistencias', text: 'Asistencias' },
        { value: 'generales', text: 'Generales' },
        { value: 'salud', text: 'Salud' },
        { value: 'affinity', text: 'Affinity' }
      ],
      types_payment: [],
      types_payment_cl: [
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
        { value: 'anual', text: 'Anual' },
        { value: 'mensual', text: 'Mensual' },
        { value: 'trimestral', text: 'Trimestral' },
        { value: 'semestral', text: 'Semestral' }
      ],
      GruposDigitales: [
        { value: 'seguro_de_garantia_digital_publica' },
        { value: 'seguro_de_garantia_digital_privada' },
        { value: 'seguro_de_accidentes_personales_digitales' },
        { value: 'seguro_de_responsabilidad_civil_digital' },
        { value: 'seguro_de_incendio_sismo_y_robo_digital' }
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
    ...mapState(['leads']),
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
    leadName () {
      return this.localProduct.lead ? this.localProduct.lead.name : ''
    },
    leadRazonSocial () {
      return this.localProduct.lead ? this.localProduct.lead.razon_social : ''
    },
    leadRut () {
      return this.localProduct.lead ? this.localProduct.lead.rut : ''
    },
    leadEmail () {
      return this.localProduct.lead ? this.localProduct.lead.email : ''
    },
    availableOptions () {
      console.log(typeof this.localProduct.tags)
      console.log(this.localProduct.tags)
      if (typeof this.localProduct.tags === 'undefined') {
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
        return lead
      } else {
        const etiquetaslead = this.leads.etiquetas.filter(
          ({ value }) => !this.localProduct.tags.includes(value)
        )
        const lead = []
        for (const [key, value] of Object.entries(etiquetaslead)) {
          if (value) {
            const newlead = {
              text: value.id,
              value: value.id
            }
            lead.push(newlead)
          }
        }
        return lead
      }
    },
    executives () {
      return this.$store.state.leads.users.map(({ id, email }) => ({
        value: id,
        text: email
      }))
    },
    productOptions () {
      return this.comefrom ? this.ProductypeOutPoliza : this.Productype
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
    this.version = process.env.version
    this.localProduct.Cobranza = this.cobranza
    if (this.requestdata && Object.keys(this.requestdata).length > 0) {
      if (this.requestdata.product_group === 'asistencias') {
        this.localProduct.line = 'asistencias'
      }
      if (this.requestdata.product_group === 'seguro_de_garantia') {
        this.localProduct.line = 'garantia'
      }
      if (this.requestdata.product_group === 'diagnostico_de_riesgo' || this.requestdata.product_group === 'seguro_de_accidentes_personales' || this.requestdata.product_group === 'seguro_de_accidentes_personales_digitales' || this.requestdata.product_group === 'seguro_de_responsabilidad_civil_digital' || this.requestdata.product_group === 'seguro_de_incendio_sismo_y_robo_digital' || this.requestdata.product_group === 'seguro_de_responsabilidad_civil' || this.requestdata.product_group === 'seguros_para_la_ingenieria' || this.requestdata.product_group === 'seguros_de_vehiculos' || this.requestdata.product_group === 'seguro_de_incendio_sismo_y_robo' || this.requestdata.product_group === 'seguro_de_transporte_y_carga' || this.requestdata.product_group === 'otros_seguros') {
        this.localProduct.line = 'generales'
      }
      if (this.requestdata.product_group === 'seguro_colectivo_de_salud') {
        this.localProduct.line = 'salud'
      }
      if (this.requestdata.product_group === 'seguro_de_garantia' || this.requestdata.product_group === 'seguro_de_garantia_digital_publica' || this.requestdata.product_group === 'seguro_de_garantia_digital_privada' || this.requestdata.product_group === 'seguro_de_garantia_publica' || this.requestdata.product_group === 'seguro_de_garantia_privada' || this.requestdata.product_group === 'seguro_de_garantia_fondos' || this.requestdata.product_group === 'seguro_de_garantia_creditos') {
        this.localProduct.line = 'garantia'
      }
      this.localProduct.group = this.requestdata.product_group
      this.localProduct.name = this.requestdata.product_interest
    }
    console.log(this.localProduct, 'sadjdkddkds')
    if (this.localProduct.line) {
      this.getLineGrup(this.localProduct.line)
    }
    if (this.localProduct.group) {
      this.getLineProducts(this.localProduct.group)
    }
    if (this.usser) {
      if (this.localProduct.user !== this.usser) {
        this.userold = this.localProduct.user
      }
      this.localProduct.user = this.usser
    }
    if (this.localProduct.product_type) {
      this.typeproduct = this.localProduct.product_type
    } else {
      this.typeproduct = 'poliza'
    }
    if (this.localProduct.renewal_info) {
      this.localProduct.renewal_number =
        this.localProduct.renewal_info.renewal_number
    }
    if (this.localProduct.endorsement_info) {
      this.localProduct.endorsement_nro =
        this.localProduct.endorsement_info.endorsement_nro
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
      if (this.localProduct.nro_poliza) {
        this.statusPoliza = false
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
    async sendDocumentPoliza () {
      const payload = {
        product: this.localProduct.id,
        emailToSend: null,
        user: this.$store.state.localStorage.user.id
      };
      try {
        await this.$simpleeApi.post("/send_policy", payload);
        this.$store.commit("setAlertMessage", {
          success: "Se ha enviado el documento exitosamente!",
        });
      } catch (error) {
        console.log(error)
      }
    },
    ChangeTypePago ({ option }) {
      console.log('holaaa', option)
      this.localProduct.Cobranza.payment_type = option
    },
    UpdateTypeProduct (value) {
      this.typeproduct = value
    },
    UpdateProductNew (value) {
      if (value.nro_poliza) {
        this.localProduct.nro_poliza_parent = value.nro_poliza
      } else {
        this.localProduct.nro_poliza_parent = value.id
      }
      this.localProduct.parent_product = value.id
      this.onCloseModal()
    },
    onCloseModal () {
      this.modalreasigproduct = false
    },
    getLineProducts (group) {
      if (group) {
        console.log(group)
        console.log(this.GroupsLine)
        console.log('aquiiiidsds')
        if (process.env.version === 'CL') {
          for (let i = 0; i < this.GroupsLine.length; i++) {
            for (const [key, value] of Object.entries(this.GroupsLine[i])) {
              console.log(group, '-', key, '-', value)
              if (group === key) {
                this.ProductSelect = value
              }
            }
          }
        } else {
          for (let i = 0; i < this.GroupsLine.length; i++) {
            for (const [key, value] of Object.entries(this.GroupsLine[i])) {
              if (group === key) {
                this.ProductSelect = value
              }
            }
          }
        }
      }
    },
    getLineGrup (line) {
      if (line) {
        if (process.env.version === 'CL') {
          if (
            line === 'garantia' ||
            line === 'generales' ||
            line === 'salud' ||
            line === 'asistencias'
          ) {
            const option = products[line]
            this.GroupsLine = products[line]
            const lead = []
            for (let i = 0; i < option.length; i++) {
              for (const [key] of Object.entries(option[i])) {
                if (key === 'otros_seguros') {
                  const newlead = {
                    value: key,
                    text: 'Otros Seguros'
                  }
                  lead.push(newlead)
                } else if (key === 'seguro_de_garantia') {
                  const newlead = {
                    value: key,
                    text: 'Seguros de Garantia (no valido)'
                  }
                  lead.push(newlead)
                } else if (key) {
                  let text = key
                  text = text.replace('_', ' ')
                  text = text.replace('_', ' ')
                  text = text.replace('_', ' ')
                  text = text.replace('_', ' ')
                  text = text.replace('_', ' ')
                  text = text.replace('_', ' ')
                  const miOracion = text
                  const palabras = miOracion.split(' ')

                  for (let i = 0; i < palabras.length; i++) {
                    palabras[i] =
                      palabras[i][0].toUpperCase() + palabras[i].substr(1)
                  }

                  text = palabras.join(' ')
                  const newlead = {
                    value: key,
                    text
                  }
                  lead.push(newlead)
                }
              }
            }
            console.log(lead, 'ajjajaajaj')
            this.GroupsSelect = lead
          }
        } else if (
          line === 'affinity' ||
          line === 'generales' ||
          line === 'salud' ||
          line === 'asistencias'
        ) {
          const option = productsmx[line]
          this.GroupsLine = productsmx[line]
          console.log(option)
          const lead = []
          for (let i = 0; i < option.length; i++) {
            for (const [key] of Object.entries(option[i])) {
              if (key === 'seguro_colectivo_de_gastos_medicos_mayores') {
                const newlead = {
                  value: key,
                  text: 'Seguros de Salud'
                }
                lead.push(newlead)
              } else if (key === 'affinity') {
                const newlead = {
                  value: key,
                  text: 'Seguros para Personas'
                }
                lead.push(newlead)
              } else if (key === 'otros_seguros') {
                const newlead = {
                  value: key,
                  text: 'Otros Seguros'
                }
                lead.push(newlead)
              } else if (key) {
                let text = key
                text = text.replace('_', ' ')
                text = text.replace('_', ' ')
                text = text.replace('_', ' ')
                text = text.replace('_', ' ')
                text = text.replace('_', ' ')
                text = text.replace('_', ' ')
                const miOracion = text
                const palabras = miOracion.split(' ')

                for (let i = 0; i < palabras.length; i++) {
                  palabras[i] =
                    palabras[i][0].toUpperCase() + palabras[i].substr(1)
                }

                text = palabras.join(' ')
                const newlead = {
                  value: key,
                  text
                }
                lead.push(newlead)
              }
            }
          }
          this.GroupsSelect = lead
        }
      }
    },
    initializeDiscount (discount) {
      if (discount) {
        this.amount = discount.amount
        this.date = discount.date
      }
    },
    selectRow (value) {
      this.statusPoliza = value.$event
    },
    selectRow2 (value) {
      this.localProduct.is_ans = value.$event
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
        if (this.localProduct.group) {
          const Companies = this.GruposDigitales.find(
            ({ value }) => value === this.localProduct.group
          )
          console.log(Companies, 'auqiiii')
          if (Companies) {
            if (Companies.value === 'seguro_de_garantia_digital_publica' || Companies.value === 'seguro_de_garantia_digital_privada') {
              const CompaniesNew = [
                {
                  "value": "renta_nacional",
                  "text": "Renta nacional"
                },
              ]
              return CompaniesNew
            } else {
              const CompaniesNew = [
                {
                  "value": "sura",
                  "text": "Sura"
                }
              ]
              return CompaniesNew
            }
          } else {
            return companies
          }
        } else {
          return companies
        }
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
    },
    deleteProduct () {
      this.localProduct.parent_product = null
    }
  }
}
</script>
<style lang="scss">
.opcion label {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}
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
.formedit {
  border: 1px solid #505755 !important;
  border-radius: 8px !important;
}
.cursor-pointer {
  cursor: pointer;
}
.custom-control-label {
  display: flex !important;
  justify-content: start !important;
  align-items: center !important;
}
.tb-margin {
  background-color: #fff;
}
</style>
