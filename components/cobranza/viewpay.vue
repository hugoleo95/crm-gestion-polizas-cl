<template>
  <div>
    <div class="d-flex justify-content-between mb-0">
      <nuxt-link
        v-if="route"
        :to="{
          name: 'cobrar-cuotas',
        }"
        class="text-base pointer"
      >
        <fa-icon
          :icon="['fas', 'arrow-left']"
          class="text-primary return"
        />
        <b>Regresar a Cuotas</b>
      </nuxt-link>
      <nuxt-link
        v-else
        :to="{
          name: 'cobrar',
        }"
        class="text-base pointer"
      >
        <fa-icon
          :icon="['fas', 'arrow-left']"
          class="text-primary return"
        />
        <b>Regresar a pagos</b>
      </nuxt-link>
    </div>
    <div class="row g-4 margin-text">
      <div class="card-client col-lg-4 col-12 pr-0">
        <div class="p-4">
          <div class="w-100 d-flex mt-4 mb-0">
            <div class="ml-2">
              <h1 class="text-label">
                Datos del producto
              </h1>
            </div>
          </div>
          <div
            v-if="product_data"
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
                  >IVA:</label>
                  <input
                    v-model="CobranzaPay.iva_percentage"
                    placeholder="Ingrese el IVA"
                    type="number"
                    class="form-control form-input"
                    disabled
                  >
                </div>
                <div class="form-group-request">
                  <label
                    class="text-base"
                    for="father_name"
                  >Fecha inicio pago:
                  </label>
                  <input
                    v-model="CobranzaPay.first_payment_day"
                    placeholder="Selecciona una fecha de vigencia"
                    class="form-control form-input"
                    type="date"
                    disabled
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
                    v-model="CobranzaPay.dues_count"
                    placeholder="Ingrese el numero de cuotas a pagar"
                    type="number"
                    class="form-control form-input"
                    disabled
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
                    disabled
                  />
                </div>
              </div>
              <p
                v-if="errorForm"
                class="text-base text-center error mt-4 mb-2"
              >
                Todos los datos son obligatorios.
              </p>
            </form>

            <p
              v-if="errorDate"
              class="text-base error mt-2 mb-0"
            >
              {{ errorDateMsg }}
            </p>
          </div>
          <div v-if="!product_data">
            <p class="msg text-base data">
              No hay datos para mostrar.
            </p>
          </div>
        </div>
      </div>
      <div class="col-lg-8 col-12 pr-0">
        <div class="card-client">
          <div class="signup-content pb-5">
            <div class="signup-form margin-text p-4 item">
              <div>
                <div
                  v-if="CobranzaPay.dues_count === 1"
                  class="w-100 d-flex justify-content-start aling-items-center mb-4"
                >
                  <h4 class="pointer text-label text-primary">
                    <fa-icon
                      :icon="['fas', 'money-check']"
                      class="text-primary mr-2"
                    />
                    Link de pago:
                    <a
                      target="_blank"
                      :href="CobranzaPay.payment_link"
                    >{{
                      CobranzaPay.payment_link
                    }}</a>
                  </h4>
                </div>
                <div
                  v-if="PermiteEditarFechas"
                  class="w-100 d-flex justify-content-start aling-items-center mb-4 text-label text-primary align-items-center"
                >
                  Editar Fechas de Cuotas
                  <button
                    v-b-tooltip.hover
                    class="circle mr-2 bg-white shadow-sm border p-3 ml-2"
                    title="Cambiar Fecha de Cuotas"
                    @click="OpEditDate()"
                  >
                    <fa-icon
                      :icon="['fas', 'edit']"
                      class="text-primary"
                      style="font-size: 0.9rem"
                    />
                  </button>
                </div>
                <label class="text-label"> Cuotas del pago </label>
                <div class="form-row w-100">
                  <b-table
                    :items="CuotasObject"
                    :fields="CuotasFields"
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
                    <template #cell(amount)="{ value }">
                      {{ getFormattedPrice(value, true) }}
                    </template>
                    <template #cell(cobranza_payment_type)="{ value }">
                      {{ GetTypePago(value) }}
                    </template>
                    <template #cell(payment_date)="{ value }">
                      {{ getLeadDate(value) }}
                    </template>
                    <template #cell(has_reminder)="{ item }">
                      {{ getavisomoroso(item) }}
                    </template>
                    <template #cell(state)="{ value }">
                      <span :class="['btn-state', GetCuotasPaid(value)]">
                        {{ GetCuotasPaid(value) }}
                      </span>
                    </template>
                    <template #cell(actions)="{ item }">
                      <div class="d-flex justify-content-start">
                        <button
                          v-if="item.state === 'pending'"
                          class="circle bg-white shadow-sm border p-3 mr-2"
                          title="pagar cuota"
                          @click="PostPay(item)"
                        >
                          <fa-icon
                            :icon="['fas', 'dollar-sign']"
                            class="text-primary"
                            style="font-size: 1.2rem"
                          />
                        </button>
                        <button
                          v-if="item.cobranza_payment_type === 'suscripcion_transbank' && item.state === 'pending'"
                          class="circle bg-white shadow-sm border p-3 mr-2"
                          title="pagar cuota transbank"
                          @click="PostPayTransbank(item)"
                        >
                          <fa-icon
                            :icon="['fas', 'shopping-cart']"
                            class="text-primary"
                            style="font-size: 1.2rem"
                          />
                        </button>
                        <button
                          v-if="item.state === 'paid'"
                          class="circle bg-white shadow-sm border p-3 mr-2"
                          title="editar cuota"
                          @click="GetPay(item)"
                        >
                          <fa-icon
                            :icon="['fas', 'edit']"
                            class="text-primary"
                            style="font-size: 1.2rem"
                          />
                        </button>
                        <a
                          v-if="item.document_receipt"
                          :href="item.document_receipt"
                          target="_blank"
                        >
                          <button
                            class="circle bg-white shadow-sm border p-3"
                            title="ir a poliza"
                          >
                            <fa-icon
                              :icon="['fas', 'file']"
                              class="text-primary"
                              style="font-size: 1.2rem"
                            />
                          </button>
                        </a>
                        <button
                          v-if="getCanSendEmail(item)"
                          class="circle bg-white shadow-sm border p-3 mr-2"
                          title="Enviar Correo Notificando la Cuota"
                          @click="confirmSendEmail(item)"
                        >
                          <fa-icon
                            :icon="['fas', 'envelope']"
                            class="text-primary"
                            style="font-size: 1.2rem"
                          />
                        </button>
                      </div>
                    </template>
                  </b-table>
                </div>
              </div>
            </div>
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
          class="text-white btn-new ml-2 w-25"
          variant="primary"
          @click="modalSuccess = false"
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
    <b-modal
      ref="modal-new-pay"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <section class="ftco-section">
        <div class="form-row w-100 d-flex justify-content-center mt-4">
          <div class="form-group-relation w-100">
            <h3
              v-if="StatusModal === 'pay'"
              class="titlemodal mb-4"
            >
              Por favor ingrese el documento y confirme el pago
            </h3>
            <h3
              v-else
              class="titlemodal mb-4"
            >
              Actualice la información del pago
            </h3>
            <div class="d-flex flex-column">
              <label
                class="text-base"
                for="name"
              >Tipo de Pago:</label>
              <b-form-select
                v-model="NewPay.cobranza_payment_type"
                :options="types_payment"
                class="form-control form-input w-75"
              />
              <label
                v-if="StatusModal === 'pay'"
                class="text-base mt-3"
                for="name"
              >Comprobante :</label>
              <label
                v-if="StatusModal === 'edit'"
                class="text-base mt-3"
                for="name"
              >Adjunte otro comprobante para sustituir el anterior
                <a
                  :href="document_receipt_time"
                  target="_blank"
                >Documento</a>
                :</label>
              <b-form-file
                id="file"
                placeholder=""
                class="mt-1 w-75 pt-1"
                type="file"
                @input="setDocumentFile({ file: $event })"
              />
              <label
                class="text-base mt-3"
                for="name"
              >Fecha de pago:</label>
              <b-input
                v-model="NewPay.payment_date"
                type="datetime-local"
                class="mt-1 w-75 pt-1"
              />
            </div>
            <p
              v-if="errorFormModal"
              class="text-base text-center error mt-4 mb-2"
            >
              Debe ingresar la fecha para el pago.
            </p>
            <b-button
              class="text-white p-2 px-3 mt-5"
              size="sm"
              variant="danger"
              @click="hideEventModal()"
            >
              Cancelar
            </b-button>
            <b-button
              class="text-white p-2 px-3 mt-5 ml-4"
              size="sm"
              variant="primary"
              @click="confirmPay()"
            >
              Confirmar
            </b-button>
          </div>
        </div>
      </section>
    </b-modal>

    <b-modal
      ref="modal-alert"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h3 class="">
          {{ messageError }}
        </h3>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4"
          variant="primary"
          @click="closeRequestAlertModal"
        >
          ¡Entendido!
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-alert2"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h3 class="">
          Error {{ messageError }}
        </h3>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4"
          variant="primary"
          @click="closeRequestAlertModal2"
        >
          Cerrar
        </b-button>
      </div>
    </b-modal>

    <b-modal
      ref="modal-Edit-date"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <section class="ftco-section">
        <div class="form-row w-100 d-flex justify-content-center mt-4">
          <div class="form-group-relation w-full">
            <h3 class="titlemodal mb-4">
              Por favor Ingrese la Fecha Inicial de las Cuotas
            </h3>
            <div class="d-flex flex-column datew-40">
              <label
                class="text-base mt-3"
                for="name"
              >Fecha:</label>
              <input
                v-model="NewDate.payment_date"
                class="form-control form-input"
                type="date"
              >
            </div>
            <p
              v-if="errorFormModal2"
              class="text-base text-center error mt-4 mb-2"
            >
              Debe ingresar la fecha.
            </p>
            <b-button
              class="text-white p-2 px-3 mt-5"
              size="sm"
              variant="danger"
              @click="hideOpEditDate()"
            >
              Cancelar
            </b-button>
            <b-button
              class="text-white p-2 px-3 mt-5 ml-4"
              size="sm"
              variant="primary"
              @click="confirmeEditDate()"
            >
              Confirmar
            </b-button>
          </div>
        </div>
      </section>
    </b-modal>
  </div>
</template>

<script>
import moment from 'moment'
import productsv2 from '~/static/productsv2.json'
import productsmxv2 from '~/static/productsmxv2.json'
import productscl from '~/static/productsgroup.json'
import productsmx from '~/static/productsgroupmx.json'
import companiescl from '~/static/companies.json'
import companiesmx from '~/static/companiesmx.json'
import { getFormattedPrice } from '@/helpers/sharedFunctions'
export default {
  name: 'Cobrar',
  data () {
    return {
      CobranzaPay: {
        payment_type: null,
        dues: 1,
        payment_date_start: null,
        executive: null,
        iva_percentage: 19
      },
      CuotasObject: [],
      PermiteEditarFechas: true,
      NewPay: {
        id: null,
        state: 'paid',
        document_receipt: null,
        cobranza_payment_type: '',
        payment_date: null
      },
      NewDate: {
        id: null,
        payment_date: null
      },
      CuotasFields: [
        {
          key: 'amount',
          label: 'Monto',
          sortable: false
        },
        {
          key: 'cobranza_payment_type',
          label: 'Tipo de pago',
          sortable: false
        },
        {
          key: 'date',
          label: 'Compromiso Pago',
          sortable: false
        },
        {
          key: 'payment_date',
          label: 'Fecha pago',
          sortable: false
        },
        {
          key: 'has_reminder',
          label: 'Vencida',
          sortable: false
        },
        {
          key: 'state',
          label: 'Estado',
          sortable: false
        },
        {
          key: 'actions',
          label: 'Acciones'
        }
      ],
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
      typesPaid: [
        { value: 'contado', text: 'Contado' },
        { value: 'contado_transbank', text: 'Contado Transbank' },
        { value: 'pac_activo', text: 'PAC activo' },
        { value: 'pac_no_activo', text: 'PAC no activo' },
        { value: 'pat_activo', text: 'PAT activo' },
        { value: 'pat_no_activo', text: 'PAT no activo' },
        { value: 'aviso_de_cobranza', text: 'Aviso de cobranza' },
        { value: 'suscripcion_transbank', text: 'Suscripción Transbank' },
        { value: 'anual', text: 'Anual' },
        { value: 'mensual', text: 'Mensual' },
        { value: 'semestral', text: 'Semestral' }
      ],
      ProductConfirm: false,
      type: '',
      optionProducts: [],
      StatusModal: '',
      document_receipt_time: '',
      error: false,
      success: false,
      email: null,
      solicitud: null,
      email_product: null,
      success_email: false,
      product_email: false,
      product_id: null,
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
      errorFormModal: false,
      errorFormModal2: false,
      errorDate: false,
      errorDateMsg: null,
      CuotaUpdate: '',
      IdCuota: '',
      digital_proposal: '',
      itemcobranza: {},
      messageError: '',
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
      this.types_payment = this.types_payment_cl
      this.Lines = this.LinesCl
      this.companies = companiescl
      this.groups = this.groupscl
      this.products = productscl
    } else {
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
    //const item = this.$route.query?.item
    const route = this.$route.query?.route
    this.route = route
    this.IdCuota = id
    //this.itemcobranza = item
    this.getCobranza(id)
  },
  methods: {
    getFormattedPrice,
    async getCobranza (id) {
      try {
        const res = await this.$simpleeApi.get(
          `cobranza/collect_payment/${id}/`
        )
        const results = res.data
        // console.log(results)
        this.CobranzaPay = results
        this.product_data = results.product_details
        this.CuotasObject = results.dues_list
        this.digital_proposal = results.digital_proposal
        console.log(this.CobranzaPay, this.product_data)
        this.canEditDate()
      } catch (error) {
        console.log(error)
        this.$store.commit('setAlertMessage', error.response.data)
      }
    },
    canEditDate () {
      this.CuotasObject.forEach((item) => {
        if (item.state !== 'pending') {
          this.PermiteEditarFechas = false
        }
      })
    },
    setDocumentFile ({ file }) {
      const reader = new FileReader()
      reader.onload = () => {
        this.NewPay.document_receipt = reader.result
      }
      reader.onerror = (error) => {
        this.$store.commit('setAlertMessage', {
          error:
            'Hubo un error al cargar el archivo, por favor intentalo de nuevo.'
        })
        console.log({ error })
      }
      reader.readAsDataURL(file)
    },
    confirmPay () {
      const { NewPay, StatusModal } = this
      console.log(NewPay)
      let message
      if (StatusModal === 'pay') {
        message =
          '¿Estas seguro de pagar la cuota? verifique que el comprobante sea el correcto'
        if (!NewPay.payment_date) {
          this.errorFormModal = true
          return
        } else {
          this.errorFormModal = false
        }
      } else {
        message =
          '¿Estas seguro de modificar la información del pago de la cuota?'
      }
      this.$bvModal
        .msgBoxConfirm(message, {
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
        })
        .then((value) => {
          if (value) {
            setTimeout(() => this.PostPayFinish(), 500)
          }
        })
    },
    async PostPayFinish () {
      const { NewPay, CobranzaPay } = this
      const payload = {
        state: NewPay.state,
        document_receipt: NewPay.document_receipt,
        cobranza_payment_type: NewPay.cobranza_payment_type,
        collect_payment: CobranzaPay.id,
        payment_date: NewPay.payment_date
      }
      if (!NewPay.document_receipt) {
        delete payload.document_receipt
      }
      try {
        const results = await this.$simpleeApi.put(
          `/cobranza/dues/${this.CuotaUpdate}/`,
          payload
        )
        const data = results.data
        console.log(data)
        this.$refs['modal-new-pay'].hide()
        this.modalSuccess = true
        if (this.StatusModal === 'pay') {
          this.modalMsg = 'La Cuota fue pagada exitosamente!'
        } else {
          this.modalMsg = 'Se guardaron los cambios exitosamente!'
        }
        this.getCobranza(this.IdCuota)
      } catch (error) {
        console.log(error)
        this.$store.commit('setAlertMessage', error.response.data)
      }
    },
    async PostPayTransbank () {
      const id_quote = this.digital_proposal
      const product = this.product_data
      let name_product;
      if (product.name === 'minipyme') {
        name_product = 'MP'
      } else {
        name_product = 'RC'
      }
      try {
        const { data } = await this.$simpleeApi.post('/recurrent-payment/', {
          entity_type: name_product,
          entity_id: id_quote
        })
        const details = data.details[0]
        if (details.status === 'AUTHORIZED') {
          this.$store.commit('setAlertMessage', { success: 'El cobro por Transbank se ha realizado satisfactoriamente' })
        } else {
          this.$store.commit('setAlertMessage', 'No se pudo cobrar la cuota por Transbank por falta de saldo o que el cliente desuscribió la tarjeta')
        }
        this.getCobranza(this.IdCuota)
      } catch (error) {
        console.log(error)
        this.$store.commit('setAlertMessage', 'No se pudo cobrar la cuota por Transbank por falta de saldo o que el cliente desuscribió la tarjeta')
      }
    },
    PostPay (item) {
      this.StatusModal = 'pay'
      this.CuotaUpdate = item.id
      this.NewPay = {
        id: null,
        state: 'paid',
        document_receipt: null,
        cobranza_payment_type: '',
        payment_date: null
      }
      this.$refs['modal-new-pay'].show()
    },
    OpEditDate () {
      this.$refs['modal-Edit-date'].show()
    },
    confirmeEditDate () {
      const { NewDate } = this
      console.log(NewDate.payment_date)
      const message = '¿Estas seguro de modificar la información de Fecha?'
      if (!NewDate.payment_date) {
        this.errorFormModal2 = true
        return
      } else {
        this.errorFormModal2 = false
      }
      this.$bvModal
        .msgBoxConfirm(message, {
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
        })
        .then((value) => {
          if (value) {
            setTimeout(() => this.PostEditDate(), 500)
          }
        })
    },
    async PostEditDate () {
      console.log('entra en PostEditDate')
      console.log(this.IdCuota)
      const { NewDate } = this
      const payload = {
        payment_date: NewDate.payment_date
      }
      console.log(payload)

      try {
        const results = await this.$simpleeApi.put(
          `/cobranza/updateInfoDues/${this.IdCuota}/`,
          payload
        )
        const data = results.data
        console.log(data)
        this.$refs['modal-Edit-date'].hide()
        this.modalSuccess = true
        this.modalMsg = 'Se guardaron los cambios exitosamente!'
        this.getCobranza(this.IdCuota)
      } catch (error) {
        console.log(error)
        this.$store.commit('setAlertMessage', error.response.data)
      }
    },
    hideOpEditDate () {
      this.$refs['modal-Edit-date'].hide()
    },
    GetPay (item) {
      this.StatusModal = 'edit'
      this.CuotaUpdate = item.id
      const datefinish = moment(item.payment_date).format('YYYY-MM-DDThh:mm')
      this.document_receipt_time = item.document_receipt
      this.NewPay = {
        id: null,
        state: item.state,
        document_receipt: null,
        cobranza_payment_type: item.cobranza_payment_type,
        payment_date: datefinish
      }
      this.$refs['modal-new-pay'].show()
    },
    hideEventModal () {
      this.$refs['modal-new-pay'].hide()
    },
    GetCuotasPaid (value) {
      if (value === 'pending') {
        return 'Pendiente'
      } else if (value === 'failed') {
        return 'Fallido'
      } else if (value === 'canceled') {
        return 'Cancelado'
      } else {
        return 'Pagado'
      }
    },
    getLeadDate (leadDate) {
      if (leadDate) {
        const createdAt = new Date(leadDate).toLocaleString('en-GB')
        const [date, hour] = createdAt.split(',')
        return `${date}\n${hour}`
      } else {
        return '-'
      }
    },
    getavisomoroso (value) {
      const fechaEspecifica = new Date(`${value.date}`)
      const fechaActual = new Date()
      // value.state === 'pending' && !value.payment_date &&
      if (fechaEspecifica < fechaActual) {
        return 'Si'
      } else {
        return 'No'
      }
    },
    getCanSendEmail (value) {
      const fechaEspecifica = new Date(`${value.date}`)
      const fechaActual = new Date()
      if (value.state === 'pending' && !value.payment_date && fechaEspecifica < fechaActual) {
        return true
      } else {
        return false
      }
    },
    GetTypePago (id) {
      const PageType = this.typesPaid.find(({ value }) => value === id)
      if (PageType) {
        return PageType.text
      }
      return 'Sin Tipo'
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
      const Data = await this.$GetProductRequest(this.product_id)
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
      } else if (CobranzaPay.payment_this.type === 'anual') {
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
            iva_percentage: CobranzaPay.iva_percentage
          }
        )
        console.log(data)
        this.PostPagoUnique(data.id)
      } catch (error) {
        this.$store.commit('setAlertMessage', error.response.data)
      }
    },
    async PostPagoUnique (id) {
      try {
        await this.$simpleeApi.post('/cobranza/unique_pay/', {
          id
        })
        this.modalSuccess = true
        this.modalMsg = 'La cobranza fue registrada exitosamente!'
      } catch (error) {
        console.log(error)
        this.$store.commit('setAlertMessage', error.response.data)
      }
    },
    BackRequest () { },
    successProduct () {
      this.modal = false
      this.modalMsg = 'Producto creado exitosamente'
      this.modalSuccess = true
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
    },
    confirmSendEmail (item) {
      this.$bvModal
        .msgBoxConfirm('¿Esta seguro de que desea enviar correo de notificación?', {
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
        })
        .then((value) => {
          if (value) {
            setTimeout(() => this.SendEmail(item), 500)
          }
        })
    },
    async SendEmail (value) {
      try {
        const id = value.id
        const resp = await this.$simpleeApi.get(`/recordatorio_cobranza/${id}`)
        if (resp.data.Message.mensaje) {
          this.messageError = resp.data.Message.mensaje
        }
        this.$refs['modal-alert'].show()
      } catch (error) {
        if (error) {
          this.messageError = error
        }
        this.$store.commit('setAlertMessage', error)
        this.$refs['modal-alert2'].show()
      }
    },
    closeRequestAlertModal () {
      this.$refs['modal-alert'].hide()
    },
    closeRequestAlertModal2 () {
      this.$refs['modal-alert2'].hide()
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
  font-size: 18px;
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
.titlemodal {
  font-size: 26px;
}
.circle {
  width: 25px;
  height: 25px;
  left: 1273px;
  top: 306px;
  border-color: transparent;
  font-style: normal;
  font-weight: normal;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  padding: 0px;
  line-height: 21px;
  background: var(--primary);
  border-radius: 30px;
}
.pointer {
  cursor: pointer;
}
.btn-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 4px;
  max-width: 80px;
  border-radius: 3px;
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  white-space: nowrap;
  color: #ffffff;
}
.btn-state.Pagado {
  background-color: #233348;
}
.btn-state.Pendiente {
  background-color: #ea1051;
}
.btn-state.Fallido {
  background-color: #ff0000;
}
.btn-state.Cancelado {
  background-color: #414542;
}
.datew-40 {
  width: 10rem;
}
</style>
