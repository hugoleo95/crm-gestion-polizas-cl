<template>
  <div>
    <div class="d-flex justify-content-between mb-4">
      <div>
        <span class="text-base cursor-pointer" @click="BackClient">
          <fa-icon :icon="['fas', 'arrow-left']" class="text-primary return" />
          <b>Regresar a fusionar</b>
        </span>
      </div>
      <div>
        <b-button
          v-b-toggle.leads-merge
          class="text-white shadow-dropdow btn-new ml-4"
          variant="primary"
          @click="fusionar()"
        >
          Fusionar
        </b-button>
      </div>
    </div>
    <div v-if="showMerge">
      <leads-merge
        :data="selectedClientsFinish"
        :products="productosall"
        :solicitudes="solicitudesall"
        :loader="loaderall"
        title="Vista previa de Fusión"
        width="345px"
        variant="new-default"
        @BackClient="BackClient"
        @SaveMerge="MergeLead"
        @backfusionar="backfusion()"
      />
    </div>
    <div class="grid-container">
      <div v-for="lead in data" :key="lead" class="card shadow p-4">
        <h4 class="color-base">{{ lead.name }} {{ lead.last_name }}</h4>
        <div class="content-merge pt-4 pb-3">
          <span
            v-if="lead.product_count"
            class="cursor-pointer"
            @click="Getproducts(lead.id)"
          >
            <h6 class="new pb-2">
              {{ lead.product_count }} Productos
              <fa-icon
                :icon="['fas', 'file-alt']"
                class="pl-1 text-primary return"
                style="width: 20px"
              />
            </h6>
          </span>
          <span
            v-if="lead.request_count"
            class="pl-2 cursor-pointer"
            @click="GetRequest(lead.id)"
          >
            <h6 class="new pb-2">
              {{ lead.request_count }} Solicitudes
              <fa-icon
                :icon="['fas', 'inbox']"
                class="pl-1 text-primary return"
                style="width: 20px"
              />
            </h6>
          </span>
          <span class="col text-span text-base mb-2">
            <b-form-checkbox v-model="leadprincipal" :value="lead.id">
              <label class="pt-1">Principal </label>
            </b-form-checkbox>
          </span>
        </div>
        <h6 class="color-base mb-4">Datos de cliente</h6>
        <div class="d-flex flex-column align-content-between mt-2">
          <b-form-checkbox
            :checked="lead.rutvalue"
            class="mb-2 mb-sm-0 text-base pb-check"
            @change="
              selectRow({
                id: lead.id,
                row: lead.rut,
                selected: $event,
                title: 'rut',
              })
            "
          >
            <div :class="OnClassValue(lead.rutvalue)" class="content-merge">
              <span v-if="version === 'CL'">Rut:</span>
              <span v-if="version === 'MX'">Rfc:</span>
              <div class="stext col">
                {{ lead.rut }}
              </div>
            </div>
          </b-form-checkbox>
          <b-form-checkbox
            :checked="lead.razon_socialvalue"
            class="mb-2 mb-sm-0 text-base pb-check"
            @change="
              selectRow({
                id: lead.id,
                row: lead.razon_social,
                selected: $event,
                title: 'razon_social',
              })
            "
          >
            <div
              :class="OnClassValue(lead.razon_socialvalue)"
              class="content-merge"
            >
              Razón Social:
              <span class="stext col">
                {{ lead.razon_social }}
              </span>
            </div>
          </b-form-checkbox>
          <b-form-checkbox
            :checked="lead.namevalue"
            class="mb-2 mb-sm-0 text-base pb-check"
            @change="
              selectRow({
                id: lead.id,
                row: lead.name,
                selected: $event,
                title: 'name',
              })
            "
          >
            <div :class="OnClassValue(lead.namevalue)" class="content-merge">
              Nombre:
              <span class="stext col">
                {{ lead.name }}
              </span>
            </div>
          </b-form-checkbox>
          <b-form-checkbox
            :checked="lead.last_namevalue"
            class="mb-2 mb-sm-0 text-base pb-check"
            @change="
              selectRow({
                id: lead.id,
                row: lead.last_name,
                selected: $event,
                title: 'last_name',
              })
            "
          >
            <div
              :class="OnClassValue(lead.last_namevalue)"
              class="content-merge"
            >
              Apellido:
              <span class="stext col">
                {{ lead.last_name }}
              </span>
            </div>
          </b-form-checkbox>
          <b-form-checkbox
            :checked="lead.girovalue"
            class="mb-2 mb-sm-0 text-base pb-check"
            @change="
              selectRow({
                id: lead.id,
                row: lead.giro,
                selected: $event,
                title: 'giro',
              })
            "
          >
            <div :class="OnClassValue(lead.girovalue)" class="content-merge">
              Giro:
              <span class="stext col">
                {{ lead.giro }}
              </span>
            </div>
          </b-form-checkbox>
          <b-form-checkbox
            :checked="lead.personvalue"
            class="mb-2 mb-sm-0 text-base pb-check"
            @change="
              selectRow({
                id: lead.id,
                row: lead.person,
                selected: $event,
                title: 'person',
              })
            "
          >
            <div :class="OnClassValue(lead.personvalue)" class="content-merge">
              Persona:
              <span class="stext col">
                {{ FormaterPerson(lead.person) }}
              </span>
            </div>
          </b-form-checkbox>
          <b-form-checkbox
            :checked="lead.emailvalue"
            class="mb-2 mb-sm-0 text-base pb-check"
            @change="
              selectRow({
                id: lead.id,
                row: lead.email,
                selected: $event,
                title: 'email',
              })
            "
          >
            <div :class="OnClassValue(lead.emailvalue)" class="content-merge">
              Email:
              <span class="stext col">
                {{ lead.email }}
              </span>
            </div>
          </b-form-checkbox>
          <b-form-checkbox
            :checked="lead.phonevalue"
            class="mb-2 mb-sm-0 text-base pb-check"
            @change="
              selectRow({
                id: lead.id,
                row: lead.phone,
                selected: $event,
                title: 'phone',
              })
            "
          >
            <div :class="OnClassValue(lead.phonevalue)" class="content-merge">
              Teléfono:
              <span class="stext col">
                {{ lead.phone }}
              </span>
            </div>
          </b-form-checkbox>
          <b-form-checkbox
            :checked="lead.addressvalue"
            class="mb-2 mb-sm-0 text-base pb-check"
            @change="
              selectRow({
                id: lead.id,
                row: lead.address,
                selected: $event,
                title: 'address',
              })
            "
          >
            <div :class="OnClassValue(lead.addressvalue)" class="content-merge">
              Dirección:
              <span class="stext col">
                {{ lead.address }}
              </span>
            </div>
          </b-form-checkbox>
          <b-form-checkbox
            :checked="lead.comunavalue"
            class="mb-2 mb-sm-0 text-base pb-check"
            @change="
              selectRow({
                id: lead.id,
                row: lead.comuna,
                selected: $event,
                title: 'comuna',
              })
            "
          >
            <div :class="OnClassValue(lead.comunavalue)" class="content-merge">
              Comuna:
              <span class="stext col">
                {{ lead.comuna }}
              </span>
            </div>
          </b-form-checkbox>
          <b-form-checkbox
            :checked="lead.uservalue"
            class="mb-2 mb-sm-0 text-base pb-check"
            @change="
              selectRow({
                id: lead.id,
                row: lead.user,
                selected: $event,
                title: 'user',
              })
            "
          >
            <div :class="OnClassValue(lead.uservalue)" class="content-merge">
              Ejecutivo:
              <span class="stext col">
                {{ getLeadUser(lead.user) }}
              </span>
            </div>
          </b-form-checkbox>
        </div>
      </div>
    </div>
    <view-products-lead
      v-if="viewproduct"
      :data="productos"
      :idlead="data.id"
      @hidde="onCloseModal"
      @cancel-lead="onCloseModal"
    />
    <view-request-lead
      v-if="viewrequest"
      :data="solicitudes"
      :idlead="data.id"
      @hidde="onCloseModal2"
      @cancel-lead="onCloseModal2"
    />
    <b-modal
      ref="modal-alert"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-4 pb-3">
        <h3 class="title-text">Aviso</h3>
      </div>
      <p class="my-4 text-lg">
        {{ messagealert }}
      </p>
      <div class="my-2 text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4"
          variant="primary"
          @click="offalert"
        >
          ¡Entendido!
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-success-finish"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
      no-close-on-backdrop
    >
      <div class="pt-5 pb-3">
        <h3 class="title-text">Se han fusionado los leads correctamente</h3>
      </div>
      <div class="my-2 text-right">
        <nuxt-link
          :to="{
            name: 'clientes',
            query: {
              id: leadnew,
            },
          }"
        >
          <b-button class="btn-new ml-4" variant="outline-primary">
            ir al cliente
          </b-button>
        </nuxt-link>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import LeadsMerge from "~/components/LeadsMergeFinish.vue";
import ViewProductsLead from "~/components/ViewProductsLead.vue";
import ViewRequestLead from "~/components/ViewRequestLead.vue";

export default {
  name: "Merge",
  components: {
    LeadsMerge,
    ViewProductsLead,
    ViewRequestLead,
  },
  props: {
    data: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      option: "Merge",
      viewproduct: false,
      viewrequest: false,
      selected: null,
      version: process.env.version,
      leadprincipal: "",
      leadnew: "",
      messagealert: "",
      rut: false,
      showMerge: false,
      loaderall: true,
      productos: [],
      solicitudes: [],
      productosall: [],
      solicitudesall: [],
      children: [],
      LeadFisrt: {
        name: "",
        last_name: "",
        rut: "",
        razon_social: "",
        giro: "",
        person: "",
        email: "",
        phone: "",
        address: "",
        comuna: "",
        user: "",
      },
      showSelected: false,
    };
  },
  created() {
    this.editdata();
  },
  computed: {
    ...mapState("leads", ["users", "selectedClientsFinish"]),
  },
  methods: {
    ...mapMutations("leads", ["onselectedClientsFinish"]),
    editdata() {
      const data = this.data;
      if (data) {
        for (let i = 0; i < data.length; i++) {
          (data[i].namevalue = ""),
            (data[i].last_namevalue = ""),
            (data[i].rutvalue = ""),
            (data[i].razon_socialvalue = ""),
            (data[i].girovalue = ""),
            (data[i].personvalue = ""),
            (data[i].emailvalue = ""),
            (data[i].phonevalue = ""),
            (data[i].addressvalue = ""),
            (data[i].comunavalue = ""),
            (data[i].uservalue = "");
        }
        this.data = data;
      }
    },
    BackClient() {
      this.$emit("BackClient");
    },
    onCloseModal() {
      this.viewproduct = false;
    },
    onCloseModal2() {
      this.viewrequest = false;
    },
    checkedrow(id, title) {
      for (let i = 0; i < this.children.length; i++) {
        if (this.children[i].lead === id) {
          const resultado = this.children[i].fields.filter(
            (value) => value === title
          );
          if (resultado) {
            return false;
          } else {
            return true;
          }
        }
      }
    },
    selectRow({ id, row, selected, title }) {
      const valor = {
        campo: title,
        value: row,
      };
      if (selected === true) {
        const agregar = {
          lead: id,
          fields: [],
        };
        if (this.children.length > 0) {
          const Object = this.children.find(({ lead }) => lead === id);
          if (Object) {
            for (let i = 0; i < this.children.length; i++) {
              const resultado = this.children[i].fields.filter(
                (value) => value === title
              );
              if (resultado) {
                const fielnew = this.children[i].fields.filter(
                  (value) => value !== title
                );
                this.children[i].fields = fielnew;
              }
              if (this.children[i].lead === id) {
                this.children[i].fields.push(title);
              }
            }
          } else {
            for (let i = 0; i < this.children.length; i++) {
              const resultado = this.children[i].fields.filter(
                (value) => value === title
              );
              if (resultado) {
                const fielnew = this.children[i].fields.filter(
                  (value) => value !== title
                );
                this.children[i].fields = fielnew;
              }
            }
            agregar.fields.push(title);
            this.children.push(agregar);
          }
        } else {
          agregar.fields.push(title);
          this.children.push(agregar);
        }
        this.onRowSelectedFromTable(valor);
        this.onChangeValueRow(valor, id);
      } else if (selected === false) {
        for (let i = 0; i < this.children.length; i++) {
          if (this.children[i].lead === id) {
            const resultado = this.children[i].fields.filter(
              (value) => value !== title
            );
            this.children[i].fields = resultado;
          }
        }
        const valor = {
          campo: title,
          value: "",
        };
        this.onRowSelectedFromTable(valor);
      }
    },
    onChangeValueRow(items, id) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].id === id) {
          if (items.campo === "name") {
            this.data[i].namevalue = true;
          }
          if (items.campo === "last_name") {
            this.data[i].last_namevalue = true;
          }
          if (items.campo === "razon_social") {
            this.data[i].razon_socialvalue = true;
          }
          if (items.campo === "rut") {
            this.data[i].rutvalue = true;
          }
          if (items.campo === "giro") {
            this.data[i].girovalue = true;
          }
          if (items.campo === "person") {
            this.data[i].personvalue = true;
          }
          if (items.campo === "email") {
            this.data[i].emailvalue = true;
          }
          if (items.campo === "phone") {
            this.data[i].phonevalue = true;
          }
          if (items.campo === "address") {
            this.data[i].addressvalue = true;
          }
          if (items.campo === "comuna") {
            this.data[i].comunavalue = true;
          }
          if (items.campo === "user") {
            this.data[i].uservalue = true;
          }
        } else {
          if (items.campo === "name") {
            this.data[i].namevalue = false;
          }
          if (items.campo === "last_name") {
            this.data[i].last_namevalue = false;
          }
          if (items.campo === "razon_social") {
            this.data[i].razon_socialvalue = false;
          }
          if (items.campo === "rut") {
            this.data[i].rutvalue = false;
          }
          if (items.campo === "giro") {
            this.data[i].girovalue = false;
          }
          if (items.campo === "person") {
            this.data[i].personvalue = false;
          }
          if (items.campo === "email") {
            this.data[i].emailvalue = false;
          }
          if (items.campo === "phone") {
            this.data[i].phonevalue = false;
          }
          if (items.campo === "address") {
            this.data[i].addressvalue = false;
          }
          if (items.campo === "comuna") {
            this.data[i].comunavalue = false;
          }
          if (items.campo === "user") {
            this.data[i].uservalue = false;
          }
        }
      }
      const data = this.data;
      this.data = {};
      this.data = data;
    },
    onRowSelectedFromTable(items) {
      if (items.campo === "name") {
        this.LeadFisrt.name = items.value;
      }
      if (items.campo === "last_name") {
        this.LeadFisrt.last_name = items.value;
      }
      if (items.campo === "razon_social") {
        this.LeadFisrt.razon_social = items.value;
      }
      if (items.campo === "rut") {
        this.LeadFisrt.rut = items.value;
      }
      if (items.campo === "giro") {
        this.LeadFisrt.giro = items.value;
      }
      if (items.campo === "person") {
        this.LeadFisrt.person = items.value;
      }
      if (items.campo === "email") {
        this.LeadFisrt.email = items.value;
      }
      if (items.campo === "phone") {
        this.LeadFisrt.phone = items.value;
      }
      if (items.campo === "address") {
        this.LeadFisrt.address = items.value;
      }
      if (items.campo === "comuna") {
        this.LeadFisrt.comuna = items.value;
      }
      if (items.campo === "user") {
        this.LeadFisrt.user = items.value;
      }
      this.onselectedClientsFinish(this.LeadFisrt);
    },
    async Getproducts(id) {
      try {
        const res = await this.$simpleeApi.get(`/product/?lead=${id}`);
        const results = res.data.results;
        this.productos = results;
        this.viewproduct = true;
      } catch (error) {
        // this.$store.commit('setAlertMessage', error.response.data)
      }
    },
    async GetRequest(id) {
      try {
        const res = await this.$simpleeApi.get(`/request/?lead=${id}`);
        const results = res.data.results;
        this.solicitudes = results;
        this.viewrequest = true;
      } catch (error) {
        // this.$store.commit('setAlertMessage', error.response.data)
      }
    },
    async fusionar() {
      if (!this.leadprincipal) {
        this.messagealert = "Debe elegir el lead principal";
        this.$refs["modal-alert"].show();
      } /* else if (!this.LeadFisrt.name || !this.LeadFisrt.last_name || !this.LeadFisrt.razon_social || !this.LeadFisrt.rut || !this.LeadFisrt.email || !this.LeadFisrt.phone
        || !this.LeadFisrt.address || !this.LeadFisrt.user) {
        this.messagealert = 'Debe seleccionar todos los campos requeridos para leads'
        this.$refs['modal-alert'].show()
      } */ else {
        this.showMerge = !this.showMerge;
        this.getdatall();
      }
    },
    offalert() {
      this.$refs["modal-alert"].hide();
    },
    async getdatall() {
      this.productosall = [];
      this.solicitudesall = [];
      for (let i = 0; i < this.data.length; i++) {
        try {
          const res = await this.$simpleeApi.get(
            `/product/?lead=${this.data[i].id}`
          );
          const results = res.data.results;
          for (let j = 0; j < results.length; j++) {
            if (results[j]) {
              this.productosall.push(results[j]);
            }
          }
        } catch (error) {
          // this.$store.commit('setAlertMessage', error.response.data)
        }
      }
      for (let i = 0; i < this.data.length; i++) {
        try {
          const res = await this.$simpleeApi.get(
            `/request/?lead=${this.data[i].id}`
          );
          const results = res.data.results;
          for (let j = 0; j < results.length; j++) {
            if (results[j]) {
              this.solicitudesall.push(results[j]);
            }
          }
        } catch (error) {
          // this.$store.commit('setAlertMessage', error.response.data)
        }
      }
      this.loaderall = false;
    },
    OnClassValue(value) {
      if (value === "") {
        return "";
      } else if (value === true) {
        return "";
      }
      if (value === false) {
        return "tachado";
      }
    },
    async GetproductsNr(id) {
      try {
        const res = await this.$simpleeApi.get(`/product/?lead=${id}`);
        const results = res.data.count;
        const numero = parseInt(results);
        return numero;
      } catch (error) {
        return "0";
        // this.$store.commit('setAlertMessage', error.response.data)
      }
    },
    async MergeLead() {
      const arraydata = [];
      for (let j = 0; j < this.children.length; j++) {
        arraydata.push(this.children[j].lead);
      }
      for (let i = 0; i < this.data.length; i++) {
        const resp = arraydata.includes(this.data[i].id);
        if (!resp) {
          const agregar = {
            lead: this.data[i].id,
            fields: [],
          };
          this.children.push(agregar);
        }
      }
      const filtered = this.children.filter(
        (el) => el.lead !== this.leadprincipal
      );
      this.children = filtered;
      const payload = {
        father: this.leadprincipal,
        keep_father_data: true,
        children: this.children,
      };
      try {
        const respo = await this.$simpleeApi.post("/fuse_leads/", payload);
        const newlead = respo.data.new_lead;
        this.leadnew = newlead.id;
        this.$refs["modal-success-finish"].show();
      } catch (error) {
        this.$store.commit("setAlertMessage", error.response.data);
      }
    },
    backfusion() {
      this.$emit("BackClient");
    },
    RouteClient() {
      this.$emit("onSelectedLeads");
      this.$refs["modal-success-finish"].hide();
      this.$router.push({ name: "clientes" });
    },
    RouteRequest() {
      this.$emit("BackClient");
      this.$emit("onSelectedLeads");
      this.$refs["modal-success-finish"].hide();
    },
    getLeadUser(user) {
      if (user) {
        const leadUser = this.users.find(({ id }) => user === id);
        if (leadUser.first_name) {
          return leadUser.first_name;
        } else if (leadUser.email) {
          return leadUser.email.split("@")[0];
        } else {
          return "Sin asignar";
        }
      }
      return "Sin asignar";
    },
    FormaterPerson(date) {
      if (process.env.version === "CL") {
        if (date === "legal_person") {
          return "Persona legal";
        } else {
          return "Persona natural";
        }
      }
      if (process.env.version === "MX") {
        if (date === "legal_person") {
          return "Persona Moral";
        } else {
          return "Persona Fisica";
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.grid-container {
  display: grid;
  min-height: 100%;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  gap: 1.5em 1.5em;
}
.margin-card {
  margin-top: 40px;
}
.margin-text {
  margin-top: 20px;
}
.color-base {
  color: #000000;
}
.text-base {
  font-family: "Rubik";
  font-style: normal;
  font-size: 14px;
  line-height: 17px;
  color: #000000;
}
.lbold {
  font-weight: 500;
}
.stext {
  color: #8d8d8d;
  padding-right: 0px;
}
.content-merge {
  display: flex;
  flex-wrap: wrap;
}
.form-group {
  margin-bottom: 5px !important;
  position: relative;
}
.card {
  border: none;
}
.pb-check {
  padding-bottom: 20px !important;
}
.tachado {
  text-decoration: line-through;
}
.new {
  color: #6461ed;
}
.text-span {
  text-align: right;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
