<template>
    <div>
      <s-modal :changesedit="changes" />
      <div class="hist-padding px-3 px-md-0 pt-md-0">
        <div>
          <div v-if="loading" class="d-flex flex-fill h-100 loading">
            <div class="text-center text-primary pa-5 mx-auto my-auto">
              <b-spinner class="align-middle" />
              <strong>Cargando...</strong>
            </div>
          </div>
          <div v-for="(hist, index) in historial" :key="index">
            <div class="card-body margin-text d-flex flex-column py-3 py-md-0">
              <span class="sdate card-text d-flex justify-content-end">
                {{ getDate(hist.history_date) }}
              </span>
              <h6 class="d-flex text-base mb-0">
                <span class="d-flex icon-circle mr-3">
                  <fa-icon :icon="['fas', 'user']" />
                </span>
                <span class="span-title">
                  {{ getTitle(hist.history_type) }}
                </span>
              </h6>
              <div class="histcard-padding">
                <p class="card-text">
                  {{ getText(hist.history_type) }}
                  <span v-if="hist.history_type === '~'"
                    >-
                    <button
                      class="view-change"
                      @click="
                        HistoryView(index, hist.fields_changed);
                      "
                    >
                      <fa-icon
                        :icon="['fas', 'user-edit']"
                        class="text-primary edit-ico mr-2"
                      />Ver cambios
                    </button>
                  </span>
                </p>
                <p class="card-text pt-3">
                  <b>{{ getTypeChange(hist.history_type) }}</b>
                  {{ getUserChange(hist.history_type, hist.history_user) }}
                </p>
                <div v-if="hist.details" class="table-responsive tb-padding pt-4">
                  <s-form-table>
                    <tr>
                      <th class="text-base pd-val">Campo</th>
                      <th class="text-base pd-val">Ahora</th>
                      <th class="text-base pd-val">Antes</th>
                    </tr>
                    <tr v-for="(chang, index) in hist.fields_changed" :key="index">
                      <td class="text-val pd-val">
                        {{ Formatefield(chang.field) }}
                      </td>
                      <td class="text-val pd-val">
                        {{ Formatefielchange(chang.new, chang.field) }}
                      </td>
                      <td class="text-val pd-val">
                        {{ Formatefielchange(chang.old, chang.field) }}
                      </td>
                    </tr>
                  </s-form-table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  import { mapState } from "vuex";
  import SModal from "@/components/base/SModalChange.vue";
  import SFormTable from "@/components/base/SFormTable.vue";
  import productsallcl from "~/static/allproducts.json";
  import productsallmx from "~/static/allproductsmx.json";
  import productscl from "~/static/products.json";
  import productsmx from "~/static/productsmx.json";
  import companies from "~/static/companies.json";
  export default {
    name: "History",
    components: {
      SModal,
      SFormTable,
    },
    props: {
      historyedit: {
        type: Object,
        required: true,
      },
      solicitudesedit: {
        type: Object,
        required: false,
      },
      viewproduct: {
        type: Boolean,
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      idRequest: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        historial: [],
        solicitudes: {},
        modalchange: false,
        changes: {},
        productsall: {},
        groupall:{},
        products2: {},
        companies,
        optionProducts: {},
        Lines: [
          { value: "asistencia", text: "Asistencia" },
          { value: "garantia", text: "Garantia" },
          { value: "generales", text: "Generales" },
          { value: "vida", text: "Vida" },
          { value: "colectivo_vida", text: "Colectivo vida" },
        ],
        types_payment: [
          { valuepayment: "pac_activo", text: "PAC - Activo" },
          { valuepayment: "pac_no_activo", text: "PAC - No activo" },
          { valuepayment: "contado", text: "Contado" },
          { valuepayment: "aviso_de_cobranza", text: "Aviso de cobranza" },
          { valuepayment: "pat_activo", text: "PAT - Activo" },
          { valuepayment: "pat_no_activo", text: "PAT - No activo" },
        ],
        payment_day: [
          { id: "5", text: "5 Dias" },
          { id: "10", text: "10 Dias" },
          { id: "15", text: "15 Dias" },
          { id: "20", text: "20 Dias" },
          { id: "25", text: "25 Dias" },
        ],
        renewable: [
          { id: "renovable", text: "Renovable" },
          { id: "no_renovable", text: "No renovable" },
          { id: "extension_fecha", text: "Extensión fecha" },
        ],
        personas: [
          { value: "legal_person", text: "Jurídica" },
          { value: "natural_person", text: "Natural" },
        ],
        labelClientProduct: [
          {
            id: "line",
            name: "Línea de producto",
          },
          {
            id: "name",
            name: "Producto",
          },
          {
            id: "company",
            name: "Compañia",
          },
          {
            id: "nro_poliza",
            name: "Numero póliza",
          },
          {
            id: "prima",
            name: "Prima",
          },
          {
            id: "emited_date",
            name: "Fecha emisión",
          },
          {
            id: "fecha_inicio_vigencia",
            name: "Fecha inicio vigencia",
            type: "list",
          },
          {
            id: "fecha_termino_vigencia",
            name: "Fecha termino vigencia",
          },
          {
            id: "renewable",
            name: "Renovable",
          },
          {
            id: "tipo_de_pago",
            name: "Tipo de pago",
          },
          {
            id: "comision",
            name: "Comisión",
          },
          {
            id: "comision_final",
            name: "Comisión final",
          },
          {
            id: "payment_day",
            name: "Día de cobro",
          },
          {
            id: "user",
            name: "Ejecutivo a cargo",
          },
          {
            id: "description",
            name: "Descripción",
          },
          {
            id: "state",
            name: "Estado póliza",
          },
        ],
        labelClient: [
          {
            id: "name",
            name: "Nombre cliente",
          },
          {
            id: "rut",
            name: "RUT",
          },
          {
            id: "last_name",
            name: "Apellido cliente",
          },
          {
            id: "phone",
            name: "Telefono cliente",
          },
          {
            id: "email",
            name: "Correo cliente",
          },
          {
            id: "address",
            name: "Dirección",
          },
          {
            id: "razon_social",
            name: "Razón social",
            type: "list",
          },
          {
            id: "giro",
            name: "Giro",
          },
          {
            id: "person",
            name: "Persona",
          },
          {
            id: "comuna",
            name: "Comuna",
          },
          {
            id: "employee_quantity_choice",
            name: "Numero Trabajadores",
          },
          {
            id: "user",
            name: "Ejecutivo a cargo",
          },
        ],
        labelRequest: [
          {
            id: "product_group",
            name: "Grupo de producto",
          },
          {
            id: "product_interest",
            name: "Producto",
          },
          {
            id: "request_type",
            name: "Tipo de solicitud",
          },
          {
            id: "channel",
            name: "Canal",
          },
          {
            id: "company",
            name: "Compañia",
          },
          {
            id: "nro_poliza",
            name: "Numero póliza",
          },
          {
            id: "prima",
            name: "Prima",
          },
          {
            id: "emited_date",
            name: "Fecha emisión",
          },
          {
            id: "fecha_inicio_vigencia",
            name: "Fecha inicio vigencia",
            type: "list",
          },
          {
            id: "fecha_termino_vigencia",
            name: "Fecha termino vigencia",
          },
          {
            id: "renewable",
            name: "Renovable",
          },
          {
            id: "tipo_de_pago",
            name: "Tipo de pago",
          },
          {
            id: "comision",
            name: "Comisión",
          },
          {
            id: "comision_final",
            name: "Comisión final",
          },
          {
            id: "payment_day",
            name: "Día de cobro",
          },
          {
            id: "user",
            name: "Ejecutivo a cargo",
          },
          {
            id: "description",
            name: "Descripción",
          },
          {
            id: "state",
            name: "Estado",
          },
          {
            id: "campaign",
            name: "Campaña",
          },
          {
            id: "lead",
            name: "Lead",
          }
        ],
        detailedStates: {
            "abandono": {
                "class": "abandono",
                "text": "Abandono",
                "icon": "times"
            },
            "perdido": {
                "class": "perdido",
                "text": "Perdido",
                "icon": "times"
            },
            "resuelto": {
                "class": "informacion",
                "text": "Resuelto",
                "icon": "check"
            },
            "cliente_no_aplica": {
                "class": "perdido",
                "text": "No aplica",
                "icon": "times"
            },
            "en_espera_de_informacion_cliente": {
                "class": "informacion",
                "text": "Informacion",
                "icon": "clock"
            },
            "en_espera_de_precio": {
                "class": "informacion",
                "text": "Precio",
                "icon": "clock"
            },
            "en_espera_de_pago": {
                "class": "informacion",
                "text": "Espera Pago",
                "icon": "clock"
            },
            "en_espera_de_confirmacion": {
                "class": "confirmacion",
                "text": "Confirmación",
                "icon": "clock"
            },
            "en_licitacion": {
                "class": "licitacion",
                "text": "En licitacion",
                "icon": "gavel"
            },
            "sin_contactar": {
                "class": "sin_contactar",
                "text": "Sin contactar",
                "icon": "clock"
            },
            "sin_estado": {
                "class": "sin-estado",
                "text": "Sin estado",
                "icon": "circle"
            },
            "contactado": {
                "class": "licitacion",
                "text": "Contactado",
                "icon": "check"
            },
            "cliente_cerrado": {
                "class": "cerrado",
                "text": "Cerrado",
                "icon": "check"
            },
            "volver_a_llamar": {
                "class": "llamar",
                "text": "Volver a Llamar",
                "icon": "phone"
            },
            "no_contactar": {
                "class": "perdido",
                "text": "No Contactar",
                "icon": "times"
            },
            "derivado_a_kam": {
                "class": "confirmacion",
                "text": "Derivado a KAM"
            },
            "dg_sin_contactar": {
                "class": "perdido",
                "text": "Sin contactar",
                "icon": "circle"
            },
            "error_de_pago": {
                "class": "error_de_pago",
                "text": "Error pago",
                "icon": "exclamation-triangle"
            }
        },
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
      };
    },
    watch: {
      historyedit: {
        handler(val) {
          this.History(val);
        },
      },
      solicitudesedit: {
        handler(val) {
          this.solicitud(val);
        },
      },
    },
    computed: {
      ...mapState("leads", [
        "items",
        "users",
        "channels",
        "leadsCsv",
        "leadsCsvProgress",
        "loadingCsv",
        "loadingLeads",
        "campanas"
      ]),
    },
    created() {
      if (process.env.version === "CL") {
        this.productsall = productsallcl;
        this.products2 = productscl;
        this.groupall = this.groupscl;
      } else {
        this.productsall = productsallmx;
        this.products2 = productsmx;
        this.groupall = this.groupsmx;
      }
      this.optionProducts = Object.values(this.products2).reduce(
        (acc, curr) => [...acc, ...curr],
        []
      );
    },
    methods: {
      async fetchLeadData(field, i, j) {
        try {
          const response = await this.$simpleeApi.get(`/lead/${field.new}/`);
          this.$set(this.historial[i].fields_changed[j], 'new', `${response.data.name} ${response.data.last_name}`);
          
          if (field.old) {
            const response2 = await this.$simpleeApi.get(`/lead/${field.old}/`);
            this.$set(this.historial[i].fields_changed[j], 'old', `${response2.data.name} ${response2.data.last_name}`);
          }
        } catch (error) {
          console.error(`Error fetching lead ${field.new}:`, error);
        }
      },
      async getNameLead(allhistorial) {
        const leadRequests = [];

        for (let i = 0; i < allhistorial.length; i++) {
          const fields_changed = allhistorial[i].fields_changed;
          for (let j = 0; j < fields_changed.length; j++) {
            if (fields_changed[j].field === "lead" && !isNaN(fields_changed[j].new)) {
              leadRequests.push(this.fetchLeadData(fields_changed[j], i, j));
            }
          }
        }
        await Promise.all(leadRequests);
      },
      History(val) {
        for (let i = 0; i < val.length; i++) {
          val[i].details = false;
        }
        this.historial = val;
      },
      HistoryChange(val) {
        this.historial = "";
        this.historial = val;
      },
      HistoryView(index) {
        //console.log(this.historial)
        this.historial[index].details = !this.historial[index].details;
        this.HistoryChange(this.historial);
        this.getNameLead(this.historial);
      },
      ProductChange(val) {
        this.solicitudes = "";
        this.solicitudes = val;
      },
      ProductView(index) {
        this.solicitudes[index].details = !this.solicitudes[index].details;
        this.ProductChange(this.solicitudes);
      },
      solicitud(val) {
        this.solicitudes = val;
      },
      getDate(data) {
        const createdAt = new Date(data).toLocaleString("en-GB");
        const [date, hour] = createdAt.split(",");
        return `${date}\n${hour}`;
      },
      getTitle(val) {
        if (val === "~") {
          const title = "Cambio de datos";
          return title;
        } else if (val === "+") {
          const title = "Creación de Solicitud";
          return title;
        }
      },
      getTitleProduct(val) {
        if (val === "~") {
          const title = "Cambio de datos";
          return title;
        } else if (val === "+") {
          const title = "Creación del Producto";
          return title;
        }
      },
      getText(val) {
        if (val === "~") {
          const text = "Se han actualizado campos de la solicitud";
          return text;
        } else if (val === "+") {
          const text = "Se ha creado una Nueva Solicitud";
          return text;
        }
      },
      getTextProduct(val, name, poliza) {
        if (val === "~") {
          const text =
            "Se han actualizado campos del producto " +
            name +
            " numero de poliza: " +
            poliza;
          return text;
        } else if (val === "+") {
          const text =
            "Se ha creado un producto nuevo " +
            name +
            " numero de poliza: " +
            poliza;
          return text;
        }
      },
      getTypeChange(val) {
        if (val === "~") {
          const text = "Editado por";
          return text;
        } else if (val === "+") {
          const text = "Creado por";
          return text;
        }
      },
      getLeadChannel(channel) {
        const channelObject = this.channels.find(({ id }) => id === channel);
        if (channelObject) {
          return channelObject.name;
        }
        return "Canal no creado";
      },
      Formatefield(value) {
        const channelObject = this.labelRequest.find(({ id }) => id === value);
        if (channelObject) {
          return channelObject.name;
        }
        return "No reconocido";
      },
      Formatefielchange(change, field) {
        if (field === "user") {
          const leadUser = this.users.find(({ id }) => change === id);
          if (leadUser) {
            if (leadUser.first_name) {
              return leadUser.first_name;
            } else {
              return leadUser.email.split("@")[0];
            }
          } else {
            return "Sin ejecutivo";
          }
        } else if (field === "person") {
          const channelObject = this.personas.find(
            ({ value }) => value === change
          );
          if (channelObject) {
            return channelObject.text;
          }
          return "No reconocido";
        } else if (field === "product_interest") {
          const channelObject = this.productsall.find(({ value }) => value === change);
          if (channelObject) {
            return channelObject.text;
          }
          return "";
        } else if (field === "product_group") {
          const channelObject = this.groupall.find(({ value }) => value === change);
          if (channelObject) {
            return channelObject.text;
          }
          return "";
        } else if (field === "campaign") {
          const campanasObj = this.campanas.filter(campana => campana.id === change)
          if (campanasObj.length > 0) {
            return campanasObj[0].name;
          } else {
            if (change){
              return "campaña No existe";
            } else {
              return "Sin campaña";
            }
          }
        } else if (field === "lead") {
          if (change){
            return change;
          } else {
            return "Sin lead";
          }
        } else if (field === "state") {
          if(change){
            return this.detailedStates[change].text
          } else {
            return "Sin estado";
          }
        } else {
          return change;
        }
      },
      getLeadProduct(product) {
        const productObject = this.productsall.find(
          ({ value }) => value === product
        );
        if (productObject) {
          return productObject.text;
        }
        return "Producto no creado";
      },
      getProductName(key) {
        return Object.values(this.productsall).reduce(
          (acc, curr) => ({
            ...acc,
            ...curr.reduce((a, { text, value }) => ({ ...a, [value]: text }), {}),
          }),
          {}
        )[key];
      },
      getUserChange(val, user) {
        if (val === "~") {
          if (user) {
            const text = user.first_name + " " + user.last_name;
            return text;
          } else {
            const text = "Sistema";
            return text;
          }
        } else if (val === "+") {
          const text = "usuario";
          return text;
        }
      },
    },
  };
  </script>
  <style lang="scss" scoped>
  .text-base {
    font-family: "Rubik";
    font-style: normal;
    font-size: 14px;
    line-height: 17px;
    color: #000000;
  }
  .card-text {
    font-size: 14px;
  }
  .card-padding {
    padding: 30px 60px 60px 60px;
  }
  .hist-padding {
    padding: 0px;
  }
  @media (min-width: 768px) {
    .hist-padding {
      padding: 30px;
    }
  }
  .histcard-padding {
    padding: 10px 20px 20px 47px;
  }
  .sdate {
    float: right;
  }
  .icon-circle {
    justify-content: center;
    align-items: center;
    font-size: 16px;
    line-height: 21px;
    color: #fff;
    width: 31px;
    height: 31px;
    background: var(--primary);
    border-radius: 30px;
  }
  @media screen and (max-width: 480px) {
    .histcard-padding {
      padding: 0px;
    }
    .card-body {
      padding: 0px;
    }
  }
  .view-change {
    padding: 0;
    width: 4.5rem;
    color: #233348;
    cursor: pointer;
    background-color: transparent;
    border: none;
    width: 180px;
    padding-left: 10px;
    font-weight: 600;
    color: #00cc99;
    text-align: left;
  }
  .pointer {
    cursor: pointer;
  }
  .tb-padding {
    padding: 13px;
  }
  .text-base {
    font-family: "Rubik";
    font-style: normal;
    font-size: 14px;
    line-height: 17px;
    color: #000000;
  }
  .title-text {
    font-weight: 500;
    font-size: 24px;
    line-height: 28px;
  }
  .text-val {
    padding: 0.5rem 1rem;
    font-weight: 300 !important;
    line-height: 18px !important;
  }
  .pd-val {
    padding: 0.8rem 1rem;
  }
  .nav-link {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-family: "Rubik";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #d3d3d3;
    cursor: pointer;
  }
  .nav-link.active {
    color: #000000;
    background-color: transparent;
  }
  .form-input {
    border: 1px solid #505755;
    border-radius: 8px;
  }
  .ml-2 {
    margin-left: 5px;
  }
  .pl-0 {
    padding-left: 0px !important;
  }
  .radius {
    border-radius: 6px;
  }
  .btn-new {
    padding: 10px 12px !important;
    font-size: 14px !important;
  }
  .morado {
    color: #6461ed;
    font-size: 14px;
    font-weight: 500;
  }
  .loading {
    font-size: 14px;
    opacity: 0.5;
  }
  .span-title {
    display: flex;
    align-items: center;
    justify-items: center;
    font-weight: 500;
    line-height: 16.59px;
  }
  .poliza {
    font-weight: 500;
  }
  </style>
  