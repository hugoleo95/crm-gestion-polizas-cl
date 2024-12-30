<template>
  <s-form-table
    ref="productForm"
    :class="{ formErrors: hasErrors }"
    class="tb-margin"
  >
    <span v-if="localProduct.id" class="id-product">
      ID Solicitud: {{ localProduct.id }}
    </span>
    <tr>
      <th>Producto</th>
      <td>
        <b-form-select
          id="prod"
          v-model="localProduct.product_interest"
          class="form-control form-input"
          :options="optionProducts"
          disabled
        />
      </td>
    </tr>
    <tr>
      <th>Tipo solicitud</th>
      <td>
        <b-form-select
          id="request_type"
          v-model="localProduct.request_type"
          class="form-control form-input"
          disabled
        >
          <option value="alianza_comercial">Alianza comercial</option>
          <option value="solicitud_cotizacion">Cotización</option>
          <option value="cancelacion_o_anulacion_de_poliza">
            Cancelación o anulación de políza
          </option>
          <option value="denuncia_siniestro">Denuncia siniestro</option>
          <option value="endosos">Endosos</option>
          <option value="renovacion">Renovación</option>
          <option value="soporte">Soporte</option>
          <option value="solicitud_informacion_productos">
            Información de productos
          </option>
        </b-form-select>
      </td>
    </tr>
    <tr>
      <th>Estado</th>
      <td>
        <b-form-select
          id="state"
          v-model="localProduct.state"
          class="form-control form-input"
          :options="states"
          disabled
        />
      </td>
    </tr>
    <tr v-if="localProduct.state === 'perdido'">
      <th>Razon del estado</th>
      <td>
        <b-form-select
          v-model="localProduct.state_reason"
          class="form-control form-input"
          disabled
        >
          <template #first>
            <b-form-select-option :value="null">
              Seleccione el motivo de perdida
            </b-form-select-option>
          </template>
          <b-form-select-option value="sin respuesta del cliente">
            Sin respuesta del cliente
          </b-form-select-option>
          <b-form-select-option value="no hay interes del producto">
            No hay interés del producto
          </b-form-select-option>
          <b-form-select-option value="compro con otra aseguradora">
            Compró con otra aseguradora
          </b-form-select-option>
          <b-form-select-option value="no ofrecemos seguro solicitado">
            No ofrecemos seguro solicitado
          </b-form-select-option>
          <b-form-select-option value="precio alto">
            Precio alto
          </b-form-select-option>
          <b-form-select-option value="solo buscaba informacion">
            Sólo buscaba información
          </b-form-select-option>
          <b-form-select-option value="forma de pago no valido">
            Forma de pago no válido
          </b-form-select-option>
          <b-form-select-option value="no se pudo contactar al cliente">
            No se pudo contactar al cliente
          </b-form-select-option>
          <b-form-select-option value="no cumple con los requisitos">
            No cumple con los requisitos
          </b-form-select-option>
          <b-form-select-option value="no envio informacion">
            No envió información
          </b-form-select-option>
          <b-form-select-option value="no existe Cobertura">
            No existe Cobertura
          </b-form-select-option>
          <b-form-select-option value="otro"> Otro </b-form-select-option>
        </b-form-select>
      </td>
    </tr>
    <tr>
      <th>Ejecutivo a cargo</th>
      <td>
        <b-form-select
          id="user"
          v-model="localProduct.user"
          class="form-control form-input"
          :options="executives"
          disabled
        />
      </td>
    </tr>
    <tr>
      <th>Canal</th>
      <td>
        <b-form-select
          id="channel"
          v-model="localProduct.channel"
          class="form-control form-input"
          :options="channels"
          disabled
        />
      </td>
    </tr>
    <tr v-if="localProduct.channel">
      <th>Campaña</th>
      <td>
        <b-form-select
          id="channel"
          v-model="localProduct.campaign_slug"
          class="form-control form-input"
          disabled
        >
          <option
            v-for="chan in getcampaing(localProduct.channel)"
            :key="chan.id"
            :value="chan.slug"
          >
            {{ chan.name }}
          </option>
        </b-form-select>
      </td>
    </tr>
    <tr v-if="localProduct.campaign_slug === channelreferido">
      <th>Referido</th>
      <td>
        <b-form-select
          id="channel"
          v-model="localProduct.referred"
          class="form-control form-input"
          :options="refferals"
          disabled
        />
      </td>
    </tr>
    <tr
      v-if="
        localProduct.campaign_slug === 'staree' || localProduct.referral_code
      "
    >
      <th>Código referido</th>
      <td>
        <b-input
          v-model="localProduct.referral_code"
          disabled
          type="text"
          placeholder=""
        />
      </td>
    </tr>
    <tr>
      <th>Prioridad</th>
      <td>
        <b-form-select
          id="priority"
          v-model="localProduct.priority_score"
          class="form-control form-input"
          disabled
        >
          <option selected value="0">Sin Prioridad</option>
          <option value="5">Baja</option>
          <option value="9">Media</option>
          <option value="13">Alta</option>
        </b-form-select>
      </td>
    </tr>
    <tr v-if="version === 'mx'">
      <th>Recepción cotización</th>
      <td>
        <b-input
          v-model="localProduct.quotation_received"
          disabled
          type="date"
        />
      </td>
    </tr>
    <tr v-if="version === 'mx'">
      <th>Entrega de cotización</th>
      <td>
        <b-input
          v-model="localProduct.quotation_delivered"
          disabled
          type="date"
        />
      </td>
    </tr>
    <tr v-if="localProduct.product_details">
      <th>Poliza Producto</th>
      <td>
        <b-input
          v-model="localProduct.product_details.nro_poliza"
          disabled
          type="text"
          placeholder="No tiene producto"
        />
      </td>
    </tr>
    <tr>
      <th>Comentarios</th>
      <td>
        <b-form-textarea
          v-model="localProduct.comment"
          type="text"
          placeholder=""
          disabled
        />
      </td>
    </tr>
  </s-form-table>
</template>

<script>
import { mapState } from "vuex";
import SFormTable from "@/components/base/SFormTable.vue";
import productscl from "~/static/products.json";
import productsmx from "~/static/productsmx.json";
import companies from "~/static/companies.json";
import companiesmx from "~/static/companiesmx.json";
import states from "~/static/states.json";
export default {
  name: "ProductForm",
  components: {
    SFormTable,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
    showDelete: {
      type: Boolean,
      default: true,
    },
    showLink: {
      type: Boolean,
      default: false,
    },
    commission: {
      type: Number,
      default: 0,
    },
    usser: {
      type: Number,
      default: 0,
    },
    page: {
      type: String,
      required: false,
      default: "default",
    },
    state: {
      required: true,
      validator: (prop) => typeof prop === "string" || prop === null,
    },
    showLeadInfo: {
      type: Boolean,
      default: false,
    },
    hasErrors: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      amount: 0,
      date: "",
      Lines: null,
      userold: "",
      errorDate: null,
      optionProducts: {},
      states: states.filter(({ value }) => value !== "sin_estado"),
      channelreferido: "ejecutivos-externos",
    };
  },
  computed: {
    ...mapState("localStorage", {
      currentUser: "user",
      userPermissions: "userPermissions",
    }),
    ...mapState("leads", ["users", "channels", "campanas", "loadingLeads"]),
    channels() {
      return this.$store.state.leads.channels.map(({ id, name }) => ({
        value: id,
        text: name,
      }));
    },
    localProduct: {
      get() {
        return this.value;
      },
      set(localProduct) {
        this.$emit("input", localProduct);
      },
    },
    discount() {
      const { amount, date } = this;
      return { amount, date };
    },
    refferals() {
      return this.$store.state.leads.refferals.map(
        ({ id, name, comision }) => ({
          value: id,
          text: name,
          commission: comision,
        })
      );
    },
    executives() {
      return this.$store.state.leads.users.map(({ id, email }) => ({
        value: id,
        text: email,
      }));
    },
  },
  watch: {
    commission: {
      immediate: true,
      handler(value) {
        if (value > 0) {
          this.localProduct.comision_final =
            this.localProduct.comision - this.localProduct.comision * value;
        } else {
          this.localProduct.comision_final = this.localProduct.comision;
          if (!this.localProduct.comision_final) {
            delete this.localProduct.comision_final;
          }
        }
      },
    },
    discount() {
      const { amount, date } = this;
      if (amount && date) {
        this.localProduct.discount = { amount, date };
      }
    },
    hasErrors: {
      immediate: true,
      handler(val) {
        const inputs = this.$refs.productForm?.$children.filter(
          (i) =>
            !i.$el.value &&
            !i.$el.disabled &&
            !i.$el.classList.contains("no-validate")
        );
        if (val) {
          inputs?.forEach((e) => {
            if (!e.$el.value) {
              e.$el.classList.add("inputError");
            }
          });
        }
      },
    },
    localProduct: {
      deep: true,
      handler() {
        if (this.hasErrors) {
          const inputs = this.$refs.productForm?.$children;
          inputs?.forEach((f) => {
            if (!f.$el.value && !f.$el.disabled) {
              f.$el.classList.add("inputError");
            } else {
              f.$el.classList.remove("inputError");
            }
          });
          if (
            inputs.filter(
              (i) => !i.$el.value && !i.$el.classList.contains("no-validate")
            ).length === 0
          ) {
            this.$emit("errorsResolved");
          }
        }
      },
    },
  },
  created() {
    if (process.env.version === "CL") {
      this.version = "cl";
      this.products = productscl;
    } else {
      this.version = "mx";
      this.products = productsmx;
    }
    this.optionProducts = Object.values(this.products).reduce(
      (acc, curr) => [...acc, ...curr],
      []
    );
  },
  methods: {
    getLineProducts(line) {
      if (process.env.version === "CL") {
        return products[line];
      } else {
        return productsmx[line];
      }
    },
    initializeDiscount(discount) {
      if (discount) {
        this.amount = discount.amount;
        this.date = discount.date;
      }
    },
    getLeadUser(user) {
      if (user) {
        const leadUser = this.users.find(({ id }) => user === id);
        return leadUser.first_name || leadUser.email.split("@")[0];
      }
      return "Sin asignar";
    },
    getCompanies() {
      if (process.env.version === "CL") {
        return companies;
      } else {
        return companiesmx;
      }
    },
    setComision(comision) {
      this.localProduct.comision = comision;
      const value = this.commission;
      console.log(value);
      if (value > 0) {
        this.localProduct.comision_final =
          this.localProduct.comision - this.localProduct.comision * value;
      } else {
        this.localProduct.comision_final = this.localProduct.comision;
      }
    },
    getcampaing(id) {
      const campanas = this.campanas.filter(
        (campana) => campana.channel === id
      );
      return campanas;
    },
    getDate() {
      const Ini = new Date(this.localProduct.fecha_inicio_vigencia);
      const Fin = new Date(this.localProduct.fecha_termino_vigencia);
      const isValidDate = Date.parse(this.localProduct.fecha_termino_vigencia);
      this.errorDate = null;
      if (Ini > Fin) {
        this.errorDate =
          "La fecha Término de la vigencia no puede ser menor a Inicio de vigencia";
      } else if (isNaN(isValidDate)) {
        this.errorDate = "Fecha no valida";
        return false;
      } else {
        this.errorDate = null;
      }
    },
  },
};
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
</style>
