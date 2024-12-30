<template>
  <div>
    <div class="d-flex justify-content-between mb-0">
      <nuxt-link
        :to="{
          name: 'cobrar',
        }"
      >
        <span class="text-base pointer">
          <fa-icon
            :icon="['fas', 'arrow-left']"
            class="text-primary return"
          />
          <b>Regresar a pagos</b>
        </span>
      </nuxt-link>
    </div>
    <div class="row g-4 margin-text">
      <div class="col-lg-4 col-12 pl-0">
        <div class="card-client">
          <div class="signup-content pb-5">
            <div class="signup-form margin-text p-4">
              <div class="form-row mb-5">
                <!-- <div class="w-100 mt-4">
                  <label
                    class="text-label mb-3"
                    for="father_name"
                  >Tipo de producto:</label>
                  <b-form-select
                    v-model="select_producto"
                    placeholder="Seleccione un tipo de producto"
                    :options="options_select_producto"
                    :class="select_producto ? 'active' : ''"
                    class="form-control form-input"
                    @change="changeType"
                    required
                  />
                </div>-->
              </div>
              <!-- <div v-if="select_producto ==='nuevo'">
                <label class="text-label mb-3">
                  ID de la solicitud:
                </label>
                <div class="form-row">
                  <div>
                    <input
                      v-model="solicitud"
                      :class="error ? 'input-error' : 'active'"
                      placeholder="Ingrese el ID de la solicitud"
                      class="form-control form-input w-static"
                      type="text"
                    >
                  </div>
                  <div>
                    <b-button
                      @click="search"
                      class="text-white shadow-dropdow btn-new ml-2 align-items-end"
                      variant="primary"
                    >
                      <fa-icon
                        class="text-white"
                        :icon="['fas', 'search']"
                      />
                      Buscar
                    </b-button>
                  </div>
                </div>
                <p
                  v-if="error && !success"
                  class="text-base error mt-2 mb-0"
                >
                  La solicitud ingresada no existe. Puedes crear la Solicitud
                  haciendo click en el botón de abajo.
                </p>
                <div v-if="success && !error">
                  <ul class="text-base data pl-0 mt-4">
                    <li
                      class="mb-2"
                      v-for="data in solicitud_data"
                    >
                      {{ data.value }}: {{ data.text }}
                    </li>
                  </ul>
                  <div class="form-col mt-5">
                    <div class="align-items-center">
                      <label class="text-label mb-3">
                        Email adicional:
                      </label>
                      <input
                        v-model="email"
                        placeholder="Ingresa un correo electrónico adicional"
                        :class="success_email ? 'active' : ''"
                        class="form-control form-input"
                        type="text"
                      >
                    </div>
                    <div class="mt-4">
                      <b-button
                        @click="validate_email"
                        class="text-white shadow-dropdow btn-new w-100"
                        variant="primary"
                      >
                        Confirmar
                      </b-button>
                    </div>
                  </div>
                </div>
              </div>
            -->
              <div>
                <label class="text-label"> ID del producto: </label>
                <div class="form-row mx-0">
                  <div class="align-items-center">
                    <input
                      v-model="product_id"
                      placeholder="Ingrese el ID del producto"
                      class="form-control form-input w-static"
                      type="text"
                      @input="DeletePoliza"
                    >
                  </div>
                </div>
                <label class="text-label mt-4">
                  Numero de poliza del producto:
                </label>
                <div class="form-row mx-0">
                  <div class="align-items-center">
                    <input
                      v-model="num_poliza"
                      placeholder="Ingrese el Numero de poliza"
                      class="form-control form-input w-static"
                      type="text"
                      @input="IdProducto"
                    >
                  </div>
                </div>
                <div class="form-row mx-0 mt-4">
                  <div class="align-items-center">
                    <b-button
                      class="text-white shadow-dropdow btn-new ml-2 align-items-end"
                      variant="primary"
                      @click="searchProduct"
                    >
                      <fa-icon
                        class="text-white"
                        :icon="['fas', 'search']"
                      />
                      Buscar
                    </b-button>
                  </div>
                </div>
                <p
                  v-if="product_data === null && !error_product"
                  class="text-base error mt-2 mb-0"
                >
                  El producto ingresado no existe. Intente nuevamente
                </p>
                <div v-if="error_product">
                  <ul class="text-base data pl-0 mt-4">
                    <li class="mb-2">
                      Linea: {{ GetFormateProduct2(product_data.line, "line") }}
                    </li>
                    <li class="mb-2">
                      Grupo:
                      {{ GetFormateProduct2(product_data.group, "group") }}
                    </li>
                    <li class="mb-2">
                      Producto:
                      {{ GetFormateProduct2(product_data.name, "name") }}
                    </li>
                    <li class="mb-2">
                      Tipo: {{ product_data.product_type }}
                    </li>
                    <li class="mb-2">
                      Compañia:
                      {{ GetFormateProduct2(product_data.company, "company") }}
                    </li>
                    <li class="mb-2">
                      Nro Poliza: {{ product_data.nro_poliza }}
                    </li>
                    <li class="mb-2">
                      Prima: {{ product_data.prima }}
                    </li>
                    <li
                      v-if="product_data.lead"
                      class="mb-2"
                    >
                      Razón social: {{ product_data.lead.razon_social }}
                    </li>
                    <li
                      v-if="product_data.lead"
                      class="mb-2"
                    >
                      Correo Electrónico: {{ product_data.lead.email }}
                    </li>
                  </ul>
                  <div class="form-col mt-5">
                    <!--<div class="align-items-center">
                      <label class="text-label mb-3">
                        Email adicional:
                      </label>
                      <input
                        v-model="email_product"
                        placeholder="Ingresa un correo electrónico adicional"
                        :class="product_email ? 'active' : ''"
                        class="form-control form-input"
                        type="text"
                      >
                    </div>
                  -->
                    <div class="mt-4">
                      <b-button
                        class="text-white shadow-dropdow btn-new w-100"
                        variant="primary"
                        @click="NextCobro"
                      >
                        Confirmar
                      </b-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="error"
              class="d-flex p-3"
            >
              <b-button
                class="text-white shadow-dropdow btn-new w-100"
                variant="primary"
                @click="rutatoadd()"
              >
                Crear Solicitud
              </b-button>
            </div>
          </div>
        </div>
      </div>
      <div class="card-client col-lg-8 col-12 pr-0">
        <div class="p-4">
          <div class="w-100 d-flex mt-4 mb-0">
            <div class="ml-2">
              <h1 class="text-label">
                Datos del producto
              </h1>
            </div>
          </div>
          <div
            v-if="ProductConfirm"
            class="form-Client"
          >
            <form
              id="register-form"
              method="POST"
              class="register-form"
            >
              <div class="form-row mtrow">
                <div class="form-group-request">
                  <label
                    class="text-base w-100 d-flex flex-row"
                    for="city"
                  >Línea de producto:</label>
                  <div class="form-select">
                    <b-form-select
                      v-model="product_data.line"
                      :options="Lines"
                      disabled
                      class="form-control form-input"
                      @click="getLineGrup(product_data.line)"
                    />
                  </div>
                </div>
                <div class="form-group-request">
                  <label
                    class="text-base w-100 d-flex flex-row"
                    for="name"
                  >
                    Fecha de Inicio:
                  </label>
                  <div class="relative">
                    <input
                      v-model="product_data.fecha_inicio_vigencia"
                      disabled
                      placeholder="Selecciona una fecha de inicio"
                      class="form-control form-input"
                      type="date"
                      @change="getDate()"
                    >
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group-request">
                  <label
                    class="text-base"
                    for="father_name"
                  >Grupo Producto:
                  </label>
                  <b-form-select
                    v-model="product_data.group"
                    :options="getLineGrup(product_data.line)"
                    disabled
                    class="form-control form-input"
                  />
                </div>
                <div class="form-group-request">
                  <label
                    class="text-base"
                    for="father_name"
                  >Tipo Producto:
                  </label>
                  <b-form-select
                    id="Lines"
                    v-model="product_data.product_type"
                    placeholder="Selecciona un tipo de producto"
                    class="form-control form-input"
                    :options="Productype"
                    disabled
                    @change="UpdateTypeProduct"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group-request">
                  <label
                    class="text-base"
                    for="father_name"
                  >Producto: </label>
                  <b-form-select
                    v-model="product_data.name"
                    placeholder="Selecciona un producto"
                    :options="getLineProducts(product_data.group)"
                    class="form-control form-input"
                    disabled
                  />
                </div>
                <div class="form-group-request">
                  <label
                    class="text-base"
                    for="father_name"
                  >Término de vigencia:
                  </label>
                  <input
                    v-model="product_data.fecha_termino_vigencia"
                    disabled
                    placeholder="Selecciona una fecha de vigencia"
                    class="form-control form-input"
                    type="date"
                    @change="getDate()"
                  >
                </div>
              </div>
              <div class="form-row">
                <div class="form-group-request">
                  <label
                    class="text-base"
                    for="father_name"
                  >Compañía: </label>
                  <b-form-select
                    v-model="product_data.company"
                    :options="companies"
                    disabled
                    class="form-control form-input"
                  />
                </div>
                <div class="form-group-request">
                  <label
                    class="text-base"
                    for="father_name"
                  >Renovación:
                  </label>
                  <b-form-select
                    v-model="product_data.renewable"
                    class="form-control form-input"
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
                </div>
              </div>
              <div class="form-row">
                <div class="form-group-request">
                  <label
                    class="text-base"
                    for="father_name"
                  >Nro Poliza:
                  </label>
                  <input
                    v-model="product_data.nro_poliza"
                    disabled
                    placeholder=""
                    type="text"
                    class="form-control form-input"
                  >
                </div>
                <div class="form-group-request">
                  <label
                    class="text-base"
                    for="name"
                  >Prima: </label>

                  <input
                    v-model="product_data.prima"
                    disabled
                    class="form-control form-input"
                    placeholder="Ingresa la prima"
                    type="text"
                  >
                </div>
              </div>
              <div class="form-row">
                <div class="form-group-request">
                  <label
                    class="text-base"
                    for="name"
                  >Tipo de Pago:</label>
                  <b-form-select
                    v-model="CobranzaPay.payment_type"
                    :options="types_payment"
                    class="form-control form-input"
                    @change="UpdateDues()"
                  />
                </div>
                <div class="form-group-request">
                  <label
                    class="text-base"
                    for="father_name"
                  >Fecha inicio pago:
                  </label>
                  <input
                    v-model="CobranzaPay.payment_date_start"
                    placeholder="Selecciona una fecha de vigencia"
                    class="form-control form-input"
                    type="date"
                  >
                </div>
              </div>
              <div class="form-row">
                <div class="form-group-request">
                  <label
                    class="text-base"
                    for="city"
                  >N° de cuotas: </label>
                  <input
                    v-model="CobranzaPay.dues"
                    placeholder="Ingrese el numero de cuotas a pagar"
                    type="number"
                    class="form-control form-input"
                  >
                </div>
                <div class="form-group-request">
                  <label
                    class="text-base"
                    for="father_name"
                  >Ejecutiva a cargo:
                  </label>
                  <b-form-select
                    v-model="CobranzaPay.executive"
                    :options="executives"
                    class="form-control form-input"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group-request">
                  <label
                    class="text-base"
                    for="name"
                  >IVA:</label>
                  <input
                    v-model="CobranzaPay.iva_percentage"
                    placeholder="Ingrese el IVA"
                    type="number"
                    class="form-control form-input"
                  >
                </div>
                <div class="form-group-request">
                  <label
                    class="text-base"
                    for="name"
                  >Monto Cuotas:</label>
                  <input
                    v-model="CobranzaPay.amount_dues"
                    placeholder="Ingrese el Monto de la(s) Cuotas en UF"
                    type="number"
                    class="form-control form-input"
                  >
                </div>
              </div>
              <p
                v-if="errorForm"
                class="text-base text-center error mt-4 mb-2"
              >
                Todos los datos son obligatorios.
              </p>
              <div class="form-row mt-4 justify-content-end">
                <div class="form-group-request form-justify justify-content-center">
                  <b-button
                    v-if="success_product"
                    height="20px"
                    class="text-white shadow-dropdow btn-new w-100 form-btn"
                    variant="primary"
                    @click="confirmPay"
                  >
                    Enviar
                  </b-button>
                  <b-button
                    v-else
                    height="20px"
                    class="text-white shadow-dropdow btn-new w-75 form-btn"
                    variant="primary"
                    @click="confirmProduct"
                  >
                    Crear
                  </b-button>
                </div>
              </div>
            </form>

            <p
              v-if="errorDate"
              class="text-base error mt-2 mb-0"
            >
              {{ errorDateMsg }}
            </p>
          </div>
          <div v-if="!ProductConfirm">
            <p class="msg text-base data">
              No hay datos para mostrar.
            </p>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      v-model="modal"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5 pb-3 mt-2">
        <h3 class="title-text">
          {{ modalTitle }}
        </h3>
      </div>
      <div class="my-2 text-right">
        <b-button
          class="btn-new ml-4"
          variant="outline-primary"
          @click="modal = false"
        >
          Cancelar
        </b-button>
        <!--<b-button
          v-if="success_email"
          @click="successProduct"
          class="text-white btn-new ml-2"
          variant="primary"
        >
          Crear producto
        </b-button>
        <b-button
          v-else
          @click="successPay"
          class="text-white btn-new ml-2"
          variant="primary"
        >
          Crear producto
        </b-button>
      -->
      </div>
    </b-modal>
    <b-modal
      v-model="modalSuccess"
      :no-close-on-backdrop="true"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-4 d-flex align-items-center justify-content-center">
        <div class="d-flex icon-success align-items-center justify-content-center">
          <fa-icon
            :icon="['fas', 'check']"
            class="text-primary icon-size"
          />
        </div>
      </div>
      <div class="pt-4 pb-3 mt-2">
        <h3 class="title-text text-center">
          {{ modalMsg }}
        </h3>
      </div>
      <div class="my-2 text-center">
        <b-button
          :to="{
            name: 'cobrar-ver',
            query: {
              id: NewCobroId,
            },
          }"
          class="text-white btn-new ml-2 w-25"
          variant="primary"
        >
          OK
        </b-button>
      </div>
    </b-modal>
    <b-modal
      v-model="modalError"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-4 d-flex align-items-center justify-content-center">
        <div class="d-flex icon-error align-items-center justify-content-center">
          <fa-icon
            :icon="['fas', 'times']"
            class="icon-size"
            style="color: red"
          />
        </div>
      </div>
      <div class="pt-4 pb-3 mt-2">
        <h3 class="title-text text-center">
          {{ modalMsgError }}
        </h3>
      </div>
      <div class="my-2 text-center">
        <b-button
          class="text-white btn-new ml-2 w-25"
          variant="danger"
          @click="modalError = false"
        >
          OK
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import productsv2 from '~/static/productsv2.json'
import productsmxv2 from '~/static/productsmxv2.json'
import productscl from '~/static/productsgroup.json'
import productsmx from '~/static/productsgroupmx.json'
import companiescl from '~/static/companies.json'
import companiesmx from '~/static/companiesmx.json'
export default {
  name: 'Cobrar',
  data () {
    return {
      CobranzaPay: {
        payment_type: null,
        dues: 1,
        payment_date_start: null,
        executive: null,
        iva_percentage: 19,
        amount_dues: null
      },
      GroupsLine: [],
      companies: [],
      products: [],
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
      Lines: null,
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
      Productype: [
        { value: 'poliza', text: 'Poliza' },
        { value: 'endoso', text: 'Endoso' },
        { value: 'renovacion', text: 'Renovación' }
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
      types_cl: [
        null,
        'pac_activo',
        'pac_no_activo',
        'contado',
        'aviso_de_cobranza',
        'pat_activo',
        'pat_no_activo'
      ],
      types_mx: [null, 'mensual', 'trimestral', 'semestral', 'anual'],
      ProductConfirm: false,
      type: '',
      optionProducts: [],
      error: false,
      success: false,
      email: null,
      NewCobroId: '',
      solicitud: null,
      email_product: null,
      success_email: false,
      product_email: false,
      product_id: null,
      num_poliza: null,
      success_product: false,
      error_product: false,
      vigencia_desde: null,
      vigencia_hasta: null,
      modal: false,
      modalSuccess: false,
      modalTitle: '',
      modalMsg: '',
      modalError: false,
      modalMsgError: '',
      errorForm: false,
      errorDate: false,
      errorDateMsg: null,
      solicitud_data: [
        {
          value: 'Fecha de solicitud',
          text: '01/12/2022'
        },
        {
          value: 'Producto',
          text: 'TRC'
        },
        {
          value: 'Estado',
          text: 'Espera de confirmación'
        },
        {
          value: 'Razón Social',
          text: 'Cowork Labs SPA'
        },
        {
          value: 'Correo',
          text: 'felipe@coworklabs.cl'
        }
      ],
      product_data: [],
      linea: null,
      options_linea: [
        { value: null, text: 'Selecciona una línea de producto' },
        { value: 'generales', text: 'Generales' }
      ],
      select_producto: null,
      options_select_producto: [
        { value: 'nuevo', text: 'Nuevo' },
        { value: 'existente', text: 'Existente' }
      ],
      producto: null,
      options_producto: [
        { value: null, text: 'Selecciona un producto' },
        { value: 'transporte', text: 'Transporte' }
      ],
      compania: null,
      options_compania: [
        { value: null, text: 'Selecciona una compañía' },
        { value: 'contempora', text: 'Contempora' }
      ],
      prima: null,
      renovacion: null,
      options_renovacion: [
        { value: null, text: 'Selecciona' },
        { value: 'renovable', text: 'Renovable' }
      ],
      ejecutivo: null,
      options_ejecutivo: [
        { value: null, text: 'Selecciona a una ejecutiva' },
        { value: 'lucia', text: 'Lucía' }
      ],
      pago: null,
      options_pago: [
        { value: null, text: 'Selecciona el tipo de pago' },
        { value: 'unico', text: 'Pago Único' }
      ],
      cuota: null,
      options_cuota: [
        { value: null, text: 'Selecciona la primera cuota' },
        { value: 'inmediata', text: 'Inmediata' }
      ],
      nro_cuotas: null,
      options_nro_cuotas: [
        { value: null, text: 'Ingresa el número de cuotas' },
        { value: '1', text: '1' }
      ]
    }
  },
  computed: {
    executives () {
      return this.$store.state.leads.users.map(({ id, email }) => ({
        value: id,
        text: email
      }))
    }
  },
  created () {
    if (process.env.version === 'CL') {
      this.CobranzaPay.iva_percentage = 19
      this.types_payment = this.types_payment_cl
      this.Lines = this.LinesCl
      this.companies = companiescl
      this.groups = this.groupscl
      this.products = productscl
    } else {
      this.CobranzaPay.iva_percentage = 16
      this.types_payment = this.types_payment_mx
      this.Lines = this.LinesMx
      this.companies = companiesmx
      this.groups = this.groupsmx
      this.products = productsmx
    }
    this.optionProducts = Object.values(this.products).reduce(
      (acc, curr) => [...acc, ...curr],
      []
    )
    const id = this.$route.query?.id
    if (id) {
      this.product_id = id
      this.searchProduct()
      this.ProductConfirm = true
    }
  },
  methods: {
    IdProducto () {
      this.product_id = null
    },
    DeletePoliza () {
      this.num_poliza = null
    },
    NextViewPay () {
      this.modalSuccess = false
    },
    UpdateDues () {
      if (process.env.version === 'CL') {
        if (
          this.CobranzaPay.payment_type === 'contado' ||
          this.CobranzaPay.payment_type === 'contado_transbank' ||
          this.CobranzaPay.payment_type === 'anual'
        ) {
          this.CobranzaPay.dues = 1
        }
      } else {
        if (this.CobranzaPay.payment_type === 'mensual') {
          this.CobranzaPay.dues = 12
        }
        if (this.CobranzaPay.payment_type === 'anual') {
          this.CobranzaPay.dues = 1
        }
        if (this.CobranzaPay.payment_type === 'semestral') {
          this.CobranzaPay.dues = 2
        }
        if (this.CobranzaPay.payment_type === 'trimestral') {
          this.CobranzaPay.dues = 4
        }
      }
    },
    getCompanies () {
      if (process.env.version === 'CL') {
        return companies
      } else {
        return companiesmx
      }
    },
    UpdateTypeProduct (value) {
      this.product_data.product_type = value
    },
    getLineGrup (line) {
      console.log(process.env.version, line)
      if (line) {
        if (process.env.version === 'CL') {
          if (
            line === 'garantia' ||
            line === 'generales' ||
            line === 'salud' ||
            line === 'asistencias'
          ) {
            const option = productsv2[line]
            this.GroupsLine = productsv2[line]
            const lead = []
            for (let i = 0; i < option.length; i++) {
              for (const [key] of Object.entries(option[i])) {
                if (key === 'otros_seguros') {
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
            return lead
          }
        } else if (
          line === 'affinity' ||
          line === 'generales' ||
          line === 'salud' ||
          line === 'asistencias'
        ) {
          const option = productsmxv2[line]
          this.GroupsLine = productsmxv2[line]
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
          return lead
        }
      }
    },
    getLineProducts (group) {
      if (group) {
        console.log(group)
        console.log(this.GroupsLine)
        if (process.env.version === 'CL') {
          for (let i = 0; i < this.GroupsLine.length; i++) {
            for (const [key, value] of Object.entries(this.GroupsLine[i])) {
              if (group === key) {
                value
                return value
              }
            }
          }
        } else {
          for (let i = 0; i < this.GroupsLine.length; i++) {
            for (const [key, value] of Object.entries(this.GroupsLine[i])) {
              if (group === key) {
                value
                return value
              }
            }
          }
        }
      }
    },
    changeType () {
      this.error = false
      this.success = false
      this.success_email = false
      this.error_product = false
      this.product_email = false
      this.success_product = false
    },
    GetFormateProduct2 (valor, key) {
      if (key === 'line') {
        if (valor) {
          const requestObject = this.Lines.find(({ value }) => value === valor)
          if (requestObject) {
            return requestObject.text
          }
          return 'Sin estado'
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
      } else if (key === 'company') {
        if (valor) {
          return this.companies.reduce(
            (a, { text, value }) => ({ ...a, [value]: text }),
            {}
          )[valor]
        } else {
          return ''
        }
      } else {
        return valor
      }
    },
    search () {
      if (this.solicitud == '12345') {
        this.success = true
        this.error = false
        this.success_email = false
      } else {
        this.error = true
        this.success = false
        this.success_email = false
      }
    },
    async searchProduct () {
      let Data
      if (this.num_poliza) {
        Data = await this.$GetProductRequestPoliza(this.num_poliza)
      } else {
        Data = await this.$GetProductRequest(this.product_id)
      }
      console.log(Data)
      if (Data) {
        this.error_product = true
        this.product_data = Data
      } else {
        this.error_product = false
        this.product_data = null
      }
    },
    rutatoadd () {
      this.$router.push({ path: '/solicitudes' })
    },
    NextCobro () {
      this.ProductConfirm = true
    },
    validate_email () {
      if (this.email == 'prueba@simplee.cl' && this.success) {
        this.success_email = true
        this.pago = null
        this.cuota = null
        this.nro_cuotas = null
        this.linea = null
        this.producto = null
        this.compania = null
        this.renovacion = null
        this.ejecutivo = null
        this.prima = null
        this.vigencia_desde = null
        this.vigencia_hasta = null
      } else if (
        this.email_product == 'prueba@simplee.cl' &&
        this.success_product
      ) {
        this.product_email = true
        this.linea = 'generales'
        this.producto = 'transporte'
        this.compania = 'contempora'
        this.renovacion = 'renovable'
        this.ejecutivo = 'lucia'
        this.prima = '56'
        this.vigencia_desde = '18/11/2022'
        this.vigencia_hasta = '18/11/2023'
        this.pago = null
        this.cuota = null
        this.nro_cuotas = null
      } else {
        this.error_email = true
      }
    },
    confirmProduct () {
      const { CobranzaPay } = this
      console.log(CobranzaPay)
      if (
        !CobranzaPay.payment_type ||
        !CobranzaPay.dues ||
        !CobranzaPay.payment_date_start ||
        !CobranzaPay.executive ||
        !CobranzaPay.iva_percentage
      ) {
        this.errorForm = true
        return
      }
      if (process.env.version === 'CL') {
        if (
          CobranzaPay.payment_type === 'contado' ||
          CobranzaPay.payment_type === 'contado_transbank'
        ) {
          this.type = 'unico'
        } else {
          this.type = 'recurrente'
        }
      } else if (CobranzaPay.payment_type === 'anual') {
        this.type = 'unico'
      } else {
        this.type = 'recurrente'
      }
      console.log(this.type, CobranzaPay.dues)
      if (this.type === 'unico' && parseInt(CobranzaPay.dues) !== 1) {
        this.modalError = true
        this.modalMsgError =
          'El campo de cuotas tiene que coincidir con el tipo de pago que seleccione, por favor modificar'
        return
      }
      if (this.type === 'recurrente' && parseInt(CobranzaPay.dues) === 1) {
        this.modalError = true
        this.modalMsgError =
          'El campo de cuotas tiene que coincidir con el tipo de pago que seleccione, por favor modificar'
        return
      }
      this.$bvModal
        .msgBoxConfirm(
          '¿Estas seguro de que deseas crear pagos para este producto, por favor verifique los datos?',
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
            setTimeout(() => this.saveProductCobranza(), 500)
          }
        })
    },
    async saveProductCobranza () {
      const { CobranzaPay, product_data } = this
      try {
        const { data } = await this.$simpleeApi.post(
          '/cobranza/collect_payment/',
          {
            product: product_data.id,
            payment_type: CobranzaPay.payment_type,
            dues: CobranzaPay.dues,
            payment_date_start: CobranzaPay.payment_date_start,
            executive: CobranzaPay.executive,
            total_amount: product_data.prima,
            iva_percentage: CobranzaPay.iva_percentage,
            amount_dues: CobranzaPay.amount_dues
          }
        )
        console.log(data)
        this.PostPagoUnique(product_data.id)
        this.NewCobroId = data.id
      } catch (error) {
        this.$store.commit('setAlertMessage', error.response.data)
      }
    },
    async PostPagoUnique () {
      this.modalSuccess = true
      this.modalMsg = 'La cobranza fue registrada exitosamente!'
      /* try {
        await this.$simpleeApi.post('/cobranza/unique_pay/', {
          id: id,
        })

      } catch (error) {
        console.log(error)
        this.$store.commit('setAlertMessage', error.response.data)
      }
      */
    },
    BackRequest () { },
    successProduct () {
      this.modal = false
      this.modalMsg = 'Producto creado exitosamente'
      this.modalSuccess = true
    },
    confirmPay () {
      if (!this.pago || !this.cuota || !this.nro_cuotas) {
        this.errorForm = true
      } else {
        this.errorForm = false
        this.modal = true
        this.modalTitle =
          '¿Estás seguro que los datos ingresados son los correctos?'
      }
    },
    successPay () {
      this.modal = false
      this.modalMsg = 'Cobranza enviada correctamente'
      this.modalSuccess = true
    },
    getDate () {
      const Ini = new Date(this.vigencia_desde)
      const Fin = new Date(this.vigencia_hasta)
      const isValidDate = Date.parse(this.vigencia_hasta)
      this.errorDate = false
      this.errorDateMsg = ''
      if (Ini > Fin) {
        this.errorDate = true
        this.errorDateMsg =
          'La fecha Término de la vigencia no puede ser menor a Inicio de vigencia'
      } else if (isNaN(isValidDate)) {
        this.errorDate = true
        this.errorDateMsg = 'Fecha no valida'
        return false
      } else {
        this.errorDate = false
        this.errorDateMsg = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.card-client {
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  background-color: #fff;
}
.margin-text {
  padding-top: 20px;
}
.title-text {
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
}
.text-label {
  font-family: "Rubik";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 21px;
  color: #000000;
}
.text-base {
  font-family: "Rubik";
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
}
.error {
  color: #fd0c1a;
  font-style: italic;
}
.msg {
  font-style: italic;
}
.color-black {
  color: #000000 !important;
}
.data {
  color: #acacac;
  list-style-type: none;
}
.form-row .form-group {
  width: 50%;
  padding: 0 15px;
}
.form-row .form-group-request {
  width: 50%;
  padding: 8px 15px;
}
.form-col .form-group-request {
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
}
.form-group {
  margin-bottom: 23px;
  position: relative;
}
.form-justify {
  display: flex;
  align-items: flex-end;
}
.form-btn {
  height: 40px;
}
label {
  margin-bottom: 8px;
}
::placeholder {
  color: #acacac;
  font-size: 14px;
}
.input-error {
  border: 1px solid red !important;
  color: red !important;
}
.icon-size {
  width: 50px;
  height: auto;
}
.icon-success {
  border-radius: 50%;
  border: 10px solid #233348;
  width: 100px;
  height: 100px;
  margin: auto;
}
.icon-error {
  border-radius: 50%;
  border: 10px solid red;
  width: 100px;
  height: 100px;
  margin: auto;
}
input,
select {
  outline: none;
  appearance: unset !important;
  -moz-appearance: unset !important;
  -webkit-appearance: unset !important;
  -o-appearance: unset !important;
  -ms-appearance: unset !important;
}
.form-input {
  border: 1px solid #acacac;
  font-size: 13px;
  border-radius: 8px;
  height: 36px;
  &.active {
    border: 1px solid #233348;
  }
}
.btn-new {
  border-radius: 8px;
  height: 36px;
}
.w-static {
  width: 223px;
}
.span-uf {
  position: absolute;
  margin-top: 35px;
  margin-left: -30px;
}
.input-uf {
  color: #acacac;
  height: 34px;
  background: #ffffff;
  border: none;
  box-sizing: border-box;
  border-radius: 5px;
  width: 88%;
}
.disabled {
  background-color: #e9ecef !important;
  opacity: 1 !important;
}
.register-form {
  padding: 13px 20px 50px 20px;
}
</style>
