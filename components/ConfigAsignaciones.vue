<template>
    <div class="main-container">
        <h4>Configurar Asignaciones</h4>
        <div class="submain">
            <div class="d-flex flex-column w-100">
                <div class="d-flex flex-row justify-content-start align-content-start">
                    <h4>Kams</h4>
                    <span v-if="!SelecACtual" class="ml-2">(Seleccione)</span>
                </div>
                <div class="container p-2">
                    <div class="row">
                      <div v-for="(a, index) in asign" :key="index" class="col-4 my-1">
                        <div :class="SelecACtual === a.id ? 'kamNameSelec' : 'kamName'" @click="selecKam(a.id)">
                          {{ getLeadUser(a.id) }}
                        </div>
                      </div>
                    </div>
                </div>
            </div>
            <hr class="w-100" />
            <div class="d-flex justify-content-center align-items-baseline w-100 mb-4 border rounded-lg p-3">
               <div class="d-flex w-1-3">
                  <div class="w-100 d-flex justify-start flex-column text-left px-2">
                      <h4 class="mb-1">Grupo de Productos</h4>
                      <div class="border-bottomTit"></div>
                      <div class="flex mt-4">
                        <div v-if="loading">
                          <div class="d-flex flex-fill h-100 loading text-center mt-8">
                            <div class="text-center text-primary pa-5 mx-auto">
                              <b-spinner class="align-middle" />
                              <strong>Cargando...</strong>
                            </div>
                          </div>
                        </div>
                        <div v-else-if="SelecACtual" class="d-flex justify-content-start align-items-left my-2 position-relative flex-column scrollable-div">
                          <b-form-checkbox
                            v-model="allSelectedProductGroup"
                            class="d-flex flex-column font-weight-bold text-nowrap mb-3 ml-1"
                            type="checkbox"
                            name="products"
                            @change="toggleAllProductGroup"
                          >
                            {{ allSelectedProductGroup ? '(Deseleccionar todo)' : '(Seleccionar todo)' }}
                          </b-form-checkbox>
                          <b-form-checkbox-group
                            v-model="group_products"
                            :options="allGroupsProduct"
                            class="d-flex flex-column pl-1"
                            type="checkbox"
                            name="group_products"
                            @change="getProductList"
                          />
                        </div>
                        <div v-else class="text-mensaje">
                          Seleccione una Kam
                        </div>
                      </div>
                  </div>
               </div>
               <div class="d-flex w-1-3">
                  <div class="w-100 d-flex justify-start flex-column text-left px-2">
                    <h4 class="mb-1">Producto</h4>
                    <div class="border-bottomTit"></div>
                    <div class="flex mt-4 px-4">
                      <div v-if="loading">
                        <div class="d-flex flex-fill h-100 loading text-center mt-8">
                          <div class="text-center text-primary pa-5 mx-auto">
                            <b-spinner class="align-middle" />
                            <strong>Cargando...</strong>
                          </div>
                        </div>
                      </div>
                      <div v-else-if="SelecACtual" class="d-flex justify-content-start align-items-left my-2 position-relative flex-column scrollable-div">
                          <b-form-checkbox
                            v-if="allOnlyProduct.length>0"
                            v-model="allSelectedProduct"
                            class="d-flex flex-column font-weight-bold text-nowrap mb-3 ml-1"
                            type="checkbox"
                            name="products"
                            @change="toggleAllProduct"
                          >
                            {{ allSelectedProduct ? '(Deseleccionar todo)' : '(Seleccionar todo)' }}
                          </b-form-checkbox>
                          <b-form-checkbox-group
                            v-model="onlyproduct"
                            :options="allOnlyProduct"
                            class="d-flex flex-column pl-1"
                            type="checkbox"
                            name="onlyproduct"
                          />
                      </div>
                      <div v-else class="text-mensaje">
                        Seleccione una Kam
                      </div>
                    </div>
                  </div>
               </div>
               <div class="d-flex w-1-3 justify-content-center align-items-center">
                    <div class="w-100 d-flex justify-content-center flex-column text-left">
                        <h4 class="mb-1 px-4">Montos</h4>
                        <div class="border-bottomTit"></div>
                        <div class="flex mt-4">
                          <div v-if="loading">
                            <div class="d-flex flex-fill h-100 loading text-center mt-8">
                              <div class="text-center text-primary pa-5 mx-auto">
                                <b-spinner class="align-middle" />
                                <strong>Cargando...</strong>
                              </div>
                            </div>
                          </div>
                          <div v-else-if="SelecACtual" class="d-flex flex-column mt-4 px-4">
                              <div class="d-flex flex-column text-left mb-4">
                                  <p>Monto Asegurado Minimo (UF)</p>
                                  <input v-model="montomin" type="number" placeholder="0" class="inputSty" />
                              </div>
                              <div class="d-flex flex-column text-left">
                                  <p>Monto Asegurado Maximo (UF)</p>
                                  <input v-model="montomax" type="number" placeholder="0" class="inputSty" />
                              </div>
                          </div>
                          <div v-else class="text-mensaje">
                            Seleccione una Kam
                          </div>
                        </div>
                    </div>
               </div>
            </div>
        </div>
        <div v-if="SelecACtual" class="row-container2">
            <button class="save-user" @click="saveAsignar">Guardar cambios</button>
        </div>
    </div>    
</template>
<script>
import { get } from "lodash";
import { mapState } from "vuex";
import { loading } from "~/nuxt.config";
import productscl from '~/static/productsgroup.json'
import productsmx from '~/static/productsgroupmx.json'

export default {
  computed: {
    ...mapState("leads", ["users"]),
  },
  data() {
    return {
      asign: [],
      kams: [],
      product:{},
      SelecACtual: null,
      loading: false,
      allSelectedProductGroup: false,
      allSelectedProduct:false,
      group_products: [],
      onlyproduct:[],
      allGroupsProduct: [],
      SelectallProductsGroup: [],
      SelectallProducts: [],
      allOnlyProduct: [],
      groupscl: [
        { value: 'asistencias', text: 'Asistencias' },
        { value: 'diagnostico_de_riesgo', text: 'Diagnostico De riesgo' },
        {
          value: 'seguro_de_accidentes_personales',
          text: 'Seguro De Accidentes Personales'
        },
        { value: 'seguro_de_accidentes_personales_digitales', text: 'Seguro De Accidentes Personales Digitales' },
        {
          value: 'seguro_de_responsabilidad_civil',
          text: 'Seguro De Responsabilidad Civil'
        },
        { value: 'seguro_de_responsabilidad_civil_digital', text: 'Seguro De Responsabilidad Civil Digital' },
        {
          value: 'seguros_para_la_ingenieria',
          text: 'Seguro Para La Ingeneria'
        },
        { value: 'seguro_de_vehiculos', text: 'Seguro De Vehiculos' },
        {
          value: 'seguro_de_incendio_sismo_y_robo',
          text: 'Seguro De Incendio, Sismo Y Robo'
        },
        { value: 'seguro_de_incendio_sismo_y_robo_digital', text: 'Seguro De Incendio, Sismo Y Robo Digital' },
        {
          value: 'seguro_de_transporte_y_carga',
          text: 'Seguro De Transporte Y Carga'
        },
        { value: 'otros_seguros', text: 'Otros Seguros' },
        {
          value: 'seguro_colectivo_de_salud',
          text: 'Seguros de Salud'
        },
        { value: 'seguro_de_garantia', text: 'Seguro De Garantia (No valído)' },
        { value: 'seguro_de_garantia_digital_publica', text: 'Seguro de Garantia Digital Publica' },
        { value: 'seguro_de_garantia_digital_privada', text: 'Seguro De Garantia Digital Privada' },
        { value: 'seguro_de_garantia_publica', text: 'Seguro De Garantia Publica' },
        { value: 'seguro_de_garantia_privada', text: 'Seguro De Garantia Privada' },
        { value: 'seguro_de_garantia_fondos', text: 'Seguro De Garantia Fondos' },
        { value: 'seguro_de_garantia_creditos', text: 'Seguro De Garantia Creditos' },
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
      montomin: '',
      montomax: '',
      idAsignation: '',
    };
  },
  created() {
    this.IDKamsAsignadas();
    this.getOptions();
  },
  methods: {
    selecKam (idKams){
      this.loading = true;
      this.getDataKams(idKams);
      this.SelecACtual = idKams;
      setTimeout(() => {
        this.loading = false;
      }, 2000);
     
    },
    async getDataKams(idK) {
      try {
        const { data: { results }} = await this.$simpleeApi.get(`/user_parameters/?user=${idK}`);
        this.idAsignation = results[0].id;
        if (results[0].min_insured_amount>0) {
          this.montomin = results[0].min_insured_amount;
        } else {
          this.montomin = '';
        }
        if (results[0].max_insured_amount>0) {
          this.montomax = results[0].max_insured_amount;
        } else {
          this.montomax = '';
        }
        if(results[0].preferred_group!=null){
          this.group_products = results[0].preferred_group;
        } else {
          this.group_products = [];
        }
        this.allOnlyProductText = [];
        for (const group of this.group_products) {
            if (this.product[group]) {
                for (const product of this.product[group]) {
                    this.allOnlyProductText.unshift(product);
                }
            }
        }
        this.allOnlyProduct = this.allOnlyProductText;
        if(results[0].preferred_products!=null){
          this.onlyproduct = results[0].preferred_products;
        } else {
          this.onlyproduct = [];
        }
      } catch (error) {
        this.$store.commit("setAlertMessage", error.response.data);
        console.log(error.response.data);
      }
      this.loading = false;
    },
    async saveAsignar() {
      this.montomin = this.montomin.toString().replace(',', '.');
      this.montomax = this.montomax.toString().replace(',', '.');
      if (this.montomin==0 || this.montomax==0) {
        this.$store.commit("setAlertMessage", {
          error: "Debe ingresar un monto minimo y maximo",
        });
        return;
      }else {
        this.montomin = parseFloat(this.montomin);
      this.montomax = parseFloat(this.montomax);
      }
      if (this.montomin > this.montomax) {
        this.$store.commit("setAlertMessage", {
          error: "El monto minimo no puede ser mayor al monto maximo",
        });
        return;
      }
      if (this.montomin < 0 || this.montomax < 0) {
        this.$store.commit("setAlertMessage", {
          error: "El monto minimo y maximo no pueden ser negativos",
        });
        return;
      }
      if (this.montomin === this.montomax) {
        this.$store.commit("setAlertMessage", {
          error: "El monto minimo y maximo no pueden ser iguales",
        });
        return;
      }
      if (!this.SelecACtual) {
        this.$store.commit("setAlertMessage", {
          error: "Debe seleccionar un Kams",
        });
        return;
      }
      if (this.group_products.length === 0) {
        this.$store.commit("setAlertMessage", {
          error: "Debe seleccionar al menos un grupo de productos",
        });
        return;
      }
      if (this.onlyproduct.length === 0) {
        this.$store.commit("setAlertMessage", {
          error: "Debe seleccionar al menos un producto",
        });
        return;
      }
      const preferred_products = this.onlyproduct;
      const preferred_group = this.group_products;
      const payload = {
        preferred_group: preferred_group,
        preferred_products: preferred_products,
        min_insured_amount: this.montomin,
        max_insured_amount: this.montomax,
        user: this.SelecACtual,
      };
      //console.log("payload", payload);
      try {
        await this.$simpleeApi.put(`/user_parameters/${this.idAsignation}/`, payload);
        this.$store.commit("setAlertMessage", {
          success: "Se ha actualizado Exitosamente!",
        });
        this.group_products = [];
        this.onlyproduct = [];
        this.montomin = '';
        this.montomax = '';
        this.SelecACtual = null;
      } catch (error) {
        this.$store.commit("setAlertMessage", error.response.data);
      }
    },
    async IDKamsAsignadas() {
      const asingss = [];
      try {
        const resp = await this.$simpleeApi.get("/user_assign_group/");
        const asignaciones = resp.data;
        for (let j = 0; j < asignaciones.assigned.length; j++) {
          const newasing = {
            id: asignaciones.assigned[j],
          };
          asingss.push(newasing);
        }
        this.asign = asingss;
      } catch (error) {
        this.$store.commit("setAlertMessage", error.response.data);
      }
    },
    getLeadUser(user) {
      if (user) {
        const leadUser = this.users.find(({ id }) => user === id);
        return leadUser.first_name || leadUser.email.split("@")[0];
      }
      return "Sin asignar";
    },
    toggleAllProductGroup (checked) {
      this.SelectallProductsGroup = []
      for (let i = 0; i < this.allGroupsProduct.length; i++) {
        this.SelectallProductsGroup.push(this.allGroupsProduct[i].value)
      }
      this.group_products = checked ? this.SelectallProductsGroup.slice() : []
      this.getProductList()
    },
    toggleAllProduct (checked) {
      this.SelectallProducts = []
      for (let i = 0; i < this.allOnlyProduct.length; i++) {
        this.SelectallProducts.push(this.allOnlyProduct[i].value)
      }
      this.onlyproduct = checked ? this.SelectallProducts.slice() : []
    },
    getProductList () {
        this.allOnlyProductText = [];
        for (const group of this.group_products) {
            if (this.product[group]) {
                for (const product of this.product[group]) {
                    this.allOnlyProductText.unshift(product);
                }
            }
        }
        //this.allOnlyProductText.sort((a, b) => a.text.localeCompare(b.text)); Ordena alfabeticamente
        this.allOnlyProduct = this.allOnlyProductText;
        
        for (let j = 0; j < this.onlyproduct.length; j++) {
          if (this.allOnlyProduct.find(product => product.value === this.onlyproduct[j])) {
            this.onlyproduct.splice(j, 1);
            j--;
          }
        }
    },
    getOptions () {
      if (process.env.version === 'CL') {
        this.allGroupsProduct = this.groupscl
        this.product = productscl
      } else {
        this.allGroupsProduct = this.groupsmx
        this.product = productsmx
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.w-1-3{
  width: 33%;
}
.submain {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.main-container {
  width: 100%;
  margin: 2.5rem 0 0 0;
  padding-bottom: 2rem;
  border-bottom: 1px solid #cccbcb;
  &:last-child {
    padding-bottom: 3rem;
    border: none;
  }
  h4,
  h5 {
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
  }
  p {
    margin: 0;
  }
  h4 {
    margin-bottom: 1.5rem;
  }
  .table {
    width: 90%;
    position: relative;
    left: 2%;
    .rowchannels {
      background-color: #f8f8f8;
      display: grid;
      grid-template-columns: 30% 37% 15% 10% 8%;
      align-items: center;
      padding: 0.5rem 1rem;
      position: relative;
      border-right: 2px solid #eac9c9;
      input {
        width: 90%;
        padding: 0 0.7rem;
      }
      .add {
        position: absolute;
        width: 1.7rem;
        height: 1.7rem;
        left: 105%;
        top: 0;
        cursor: pointer;
      }
      .actions-container {
        display: flex;
        justify-content: space-around;
        img {
          height: 1.8rem;
          width: 1.8rem;
          cursor: pointer;
        }
      }
    }
    .row {
      background-color: #f8f8f8;
      margin-top: 0.5rem;
      display: grid;
      grid-template-columns: 40% 43% 17%;
      align-items: center;
      padding: 0.5rem 1rem;
      position: relative;
      input {
        width: 90%;
        padding: 0 0.7rem;
      }
      .add {
        position: absolute;
        width: 1.7rem;
        height: 1.7rem;
        left: 105%;
        top: 0;
        cursor: pointer;
      }
      .actions-container {
        display: flex;
        justify-content: space-around;
        img {
          height: 1.8rem;
          width: 1.8rem;
          cursor: pointer;
        }
      }
    }
  }
  .more {
    width: fit-content;
    color: #233348;
    text-decoration: #233348;
    &:hover {
      cursor: pointer;
      text-decoration: solid underline #233348;
    }
  }
}
select {
  appearance: auto !important;
  color: #acacac;
  height: 34px;
  background: #ffffff;
  border: 1px solid #e1e1e1;
  box-sizing: border-box;
  border-radius: 5px;
  width: 90%;
  padding: 0 0.7rem;
}
.icon {
  font-size: 16px;
  cursor: pointer;
}
.row-container2 {
    display: flex;
    width: 100%;
    text-align: center;
    justify-content: center;
    align-items: center;
}
.save-user {
  margin-bottom: 30px;
  border-color: transparent;
  position: relative !important;
  top: 0.6rem;
  color: #fff;
  background-color: #233348;
  border-radius: 5px;
  height: 65%;
  /* max-height: 2.5rem; */
  padding: 0.4rem 1rem;
  transition: background 0.3s ease;
  &:hover {
    background-color: rgb(59, 189, 59);
  }
}
.kamName {
    cursor: pointer;
    color: #222;
    font-size: 1rem;
    font-weight: 500;
}
.kamName:hover {
    color: #233348;
}
.kamNameSelec {
    cursor: pointer;
    color: #233348;
    font-weight: 600;
}
.border-bottomTit {
    border-bottom: solid 1px #9c9a9a;
}
.loading {
  font-size: 14px;
  opacity: 0.5;
}
.scrollable-div {
  height: 18rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #233348 #f1f1f1; 
  overflow-x: hidden;
}

/* Para navegadores basados en WebKit (Chrome, Safari) */
.scrollable-div::-webkit-scrollbar {
  width: 8px;
}

.scrollable-div::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scrollable-div::-webkit-scrollbar-thumb {
  background-color: #233348;
  border-radius: 10px;
  border: 2px solid #f1f1f1;
}
.text-mensaje {
  color: #222;
  opacity: 0.5;
}
.inputSty {
  color: #000;
  padding-left: 0.5rem;
  border: 1px solid #dee2e6;
}
.inputSty:focus {
  border: solid 1px #233348;
  outline: none;
}
.custom-checkbox {
  padding-bottom: 15px !important;
}
</style>
