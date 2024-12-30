<template>
  <div>
    <s-modal :changesedit="changes" />
    <div class="hist-padding">
      <nav class="nav nav-pills nav-fill mb-4">
        <a
          class="nav-link pointer"
          aria-current="page"
          :class="['mr-5', { active: optionchanges === 'historial' }]"
          @click="optionchanges = 'historial'"
        >
          Historial Contacto
        </a>
        <a
          v-if="viewproduct"
          class="nav-link pointer"
          aria-current="page"
          :class="['mr-5', { active: optionchanges === 'solicitudes' }]"
          @click="optionchanges = 'solicitudes'"
        >
          Historial Producto
        </a>
      </nav>
      <div v-if="optionchanges === 'historial'">
        <div v-if="loading" class="d-flex flex-fill h-100 loading">
          <div class="text-center text-primary pa-5 mx-auto my-auto">
            <b-spinner class="align-middle" />
            <strong>Cargando...</strong>
          </div>
        </div>
        <div v-for="(hist, index) in historial" v-else :key="index">
          <div class="card-body margin-text d-flex flex-column">
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
                      ViewChanges(hist.fields_changed);
                      HistoryView(index);
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
                  <tr v-for="(chang, index) in youchanges" :key="index">
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
      <div v-if="optionchanges === 'solicitudes'">
        <div v-for="(soli, index) in solicitudes" :key="index">
          <div class="card-body margin-text">
            <span class="sdate card-text">
              {{ getDate(soli.history_date) }}
            </span>
            <h6 class="d-flex text-base mb-0">
              <span class="d-flex icon-circle mr-3">
                <fa-icon :icon="['fas', 'file-alt']" />
              </span>
              <span class="span-title">
                {{ getTitleProduct(soli.history_type) }}
              </span>
            </h6>
            <div class="histcard-padding">
              <p class="card-text">
                <span v-if="soli.history_type === '~'">
                  Se han actualizado campos del producto
                  <strong class="morado">{{
                    getLeadProduct(soli.name)
                  }}</strong>
                  <br />
                  Nº de poliza:
                  <strong class="poliza morado">{{ soli.nro_poliza }}</strong>
                </span>
                <span v-else>
                  Se ha creado un producto nuevo
                  <strong class="morado">{{
                    getLeadProduct(soli.name)
                  }}</strong>
                  <br />
                  Nº de poliza:
                  <strong class="poliza morado">{{ soli.nro_poliza }}</strong>
                </span>
                <span v-if="soli.history_type === '~'"
                  >-
                  <button
                    class="view-change"
                    @click="
                      ViewChangesProduct(soli.fields_changed);
                      ProductView(index);
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
                {{ getTypeChange(soli.history_type) }}
                <b>{{ getUserChange(soli.history_type, soli.history_user) }}</b>
              </p>
              <div v-if="soli.details" class="table-responsive tb-padding pt-4">
                <s-form-table>
                  <tr>
                    <th class="text-base pd-val">Campo</th>
                    <th class="text-base pd-val">Ahora</th>
                    <th class="text-base pd-val">Antes</th>
                  </tr>
                  <tr v-for="(chang, index) in youchangesproducts" :key="index">
                    <td class="text-val pd-val">
                      {{ Formatefieldproduct(chang.field) }}
                    </td>
                    <td class="text-val pd-val">
                      {{ FormatefielchangeProduct(chang.new, chang.field) }}
                    </td>
                    <td class="text-val pd-val">
                      {{ FormatefielchangeProduct(chang.old, chang.field) }}
                    </td>
                  </tr>
                </s-form-table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--  <div v-if="optionchanges === 'solicitudes'">
        <div
          v-for="(soli, index) in solicitudes"
          :key="index"
        >
          <div class="card-body mb-4">
            <span class="sdate card-text">
              {{ getDate(soli.created_at) }}
            </span>
            <h6 class="text-base">
              <span class="icon-circle mr-2">
                <fa-icon :icon="['fas', 'archive']" />
              </span>
              Solicitud creada
            </h6>
            <div class="histcard-padding">
              <p class="card-text">
                {{ getLeadRazonsocial(soli.aditional_data)}} solicito una cotización de {{ getLeadProduct(soli.product_interest) }}.
              </p>
              <p class="card-text pt-3">
                <b>Creado desde: </b>
                {{ getLeadChannel(soli.channel) }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="product-btn text-center">
        <b-button
          class="btn-md text-white shadow-dropdow btn-new ml-4"
          variant="primary"
        >
          Cargar más
        </b-button>
      </div>-->
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
      required: true,
    },
    viewproduct: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      historial: [],
      solicitudes: {},
      modalchange: false,
      changes: {},
      youchanges: {},
      youchangesproducts: {},
      optionchanges: "historial",
      productsall: {},
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
    ]),
  },
  created() {
    if (process.env.version === "CL") {
      this.productsall = productsallcl;
      this.products2 = productscl;
    } else {
      this.productsall = productsallmx;
      this.products2 = productsmx;
    }
    this.optionProducts = Object.values(this.products2).reduce(
      (acc, curr) => [...acc, ...curr],
      []
    );
  },
  methods: {
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
      this.historial[index].details = !this.historial[index].details;
      this.HistoryChange(this.historial);
    },
    ProductChange(val) {
      this.solicitudes = "";
      this.solicitudes = val;
    },
    ProductView(index) {
      console.log(this.solicitudes[index].details);
      this.solicitudes[index].details = !this.solicitudes[index].details;
      console.log(this.solicitudes[index].details);
      this.ProductChange(this.solicitudes);
    },
    solicitud(val) {
      console.log(val);
      this.solicitudes = val;
    },
    getDate(data) {
      const createdAt = new Date(data).toLocaleString("en-GB");
      const [date, hour] = createdAt.split(",");
      return `${date}\n${hour}`;
    },
    ViewChanges(val) {
      this.youchanges = val;
    },
    ViewChangesProduct(val) {
      console.log(val);
      this.youchangesproducts = val;
    },
    getTitle(val) {
      if (val === "~") {
        const title = "Cambio de datos";
        return title;
      } else if (val === "+") {
        const title = "Creación del contacto";
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
        const text = "Se han actualizado campos del contacto";
        return text;
      } else if (val === "+") {
        const text = "Se ha creado un contacto nuevo";
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
      const channelObject = this.labelClient.find(({ id }) => id === value);
      if (channelObject) {
        return channelObject.name;
      }
      return "No reconocido";
    },
    Formatefieldproduct(value) {
      const channelObject = this.labelClientProduct.find(
        ({ id }) => id === value
      );
      if (channelObject) {
        return channelObject.name;
      }
      return "No reconocido";
    },
    FormatefielchangeProduct(valor, key) {
      if (key === "line") {
        const requestObject = this.Lines.find(({ value }) => value === valor);
        if (requestObject) {
          return requestObject.text;
        }
        return "Sin estado";
      } else if (key === "name") {
        const requestObject = this.optionProducts.find(
          ({ value }) => value === valor
        );
        if (requestObject) {
          return requestObject.text;
        }
        return "No tiene";
      } else if (key === "company") {
        return this.companies.reduce(
          (a, { text, value }) => ({ ...a, [value]: text }),
          {}
        )[valor];
      } else if (key === "tipo_de_pago") {
        const channelObject = this.types_payment.find(
          ({ valuepayment }) => valuepayment === valor
        );
        if (channelObject) {
          return channelObject.text;
        }
        return "";
      } else if (key === "emited_date") {
        return valor.split("-").reverse().join("/");
      } else if (key === "fecha_inicio_vigencia") {
        return valor.split("-").reverse().join("/");
      } else if (key === "fecha_termino_vigencia") {
        return valor.split("-").reverse().join("/");
      } else if (key === "payment_day") {
        return this.payment_day.reduce(
          (a, { text, id }) => ({ ...a, [id]: text }),
          {}
        )[valor];
      } else if (key === "user") {
        if (valor) {
          const leadUser = this.users.find(({ id }) => valor === id);
          return leadUser.first_name || leadUser.email.split("@")[0];
        }
        return "Sin asignar";
      } else if (key === "renewable") {
        const channelObject = this.renewable.find(({ id }) => id === valor);
        if (channelObject) {
          return channelObject.text;
        }
        return "";
      } else {
        return valor;
      }
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
      } else {
        return change;
      }
    },
    getLeadProduct(product) {
      console.log(product);
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
    getLeadRazonsocial(value) {
      if (value) {
        for (let j = 0; j < value.length; j++) {
          if (value[j].field_name === "razon_social") {
            const razonsocial = value[j].value;
            return razonsocial;
          }
        }
      } else {
        return "Sistema";
      }
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
