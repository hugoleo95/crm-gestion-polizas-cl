<template>
  <div>
    <div class="main-container">
      <div class="main">
        <div
          v-if="option === 'datos'"
          class="form-new"
        >
          <div class="row">
            <div class="principal">
              <div class="container">
                <div class="signup-content">
                  <div class="signup-form">
                    <form
                      id="register-form"
                      method="POST"
                      class="register-form"
                    >
                      <h2 class="mb-4">
                        Cotizar Responsabilidad Civil
                      </h2>
                      <h5 class="mb-4 mt-4">
                        Información personal
                      </h5>
                      <div class="form-row">
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="name"
                          >Nombres :</label>
                          <input
                            id="rut"
                            v-model="personsproposal.name"
                            class="input_request"
                            type="text"
                          >
                        </div>
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="father_name"
                          >Apellidos :</label>
                          <input
                            id="razon_social"
                            v-model="personsproposal.last_name"
                            class="input_request"
                            type="text"
                          >
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="name"
                          >Correo :</label>
                          <input
                            id="name"
                            v-model="personsproposal.email"
                            class="input_request"
                            :class="[
                              errores[1]
                                ? 'errorborder'
                                : '',
                            ]"
                            type="email"
                            @input="inputEmail($event)"
                          >
                        </div>
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="father_name"
                          >Telefono :</label>
                          <input
                            id="last_name"
                            v-model="personsproposal.phone"
                            class="input_request"
                            type="text"
                          >
                        </div>
                      </div>
                      <span
                        v-if="errores[1]"
                        class="errortext"
                      >
                        Formato de correo no valido
                      </span>
                      <h5 class="mb-4 mt-4">
                        Información de la empresa
                      </h5>
                      <div class="form-row">
                        <div class="form-group-completed">
                          <label
                            class="label_request"
                            for="name"
                          >Razón social :</label>
                          <input
                            id="email"
                            v-model="personsasegurado.name"
                            class="input_request"
                            type="text"
                          >
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="father_name"
                          >Rut Empresa :</label>
                          <input
                            id="phone"
                            :value="personsasegurado.rut"
                            class="input_request"
                            type="text"
                            :maxlength="rutValue && rutValue.includes('.') ? '12' : '10'"
                            @input="rutValue = $event"
                          >
                        </div>
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="city"
                          >Actividad Empresa :</label>
                          <div class="form-select">
                            <select
                              id="city"
                              v-model="matter_insured.company_occupation"
                              class="select_request"
                            >
                              <option
                                v-for="activi in rcoptions.activitiesOptions"
                                :key="activi.value"
                                :value="activi.value"
                              >
                                {{ activi.text }}
                              </option>
                            </select>
                            <span class="select-icon">
                              <fa-icon
                                :icon="['fas', 'sort-down']"
                                class="icon"
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="city"
                          >N° Trabajadores :</label>
                          <div class="form-select">
                            <select
                              id="city"
                              v-model="matter_insured.nro_workers"
                              class="select_request"
                            >
                              <option
                                v-for="work in rcoptions.workersNumOptions"
                                :key="work.value"
                                :value="work.value"
                              >
                                {{ work.text }}
                              </option>
                            </select>
                            <span class="select-icon">
                              <fa-icon
                                :icon="['fas', 'sort-down']"
                                class="icon"
                              />
                            </span>
                          </div>
                        </div>
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="name"
                          >Año constitución :</label>
                          <input
                            id="email"
                            v-model="base.year_of_incorporation"
                            class="input_request"
                            type="text"
                          >
                        </div>
                      </div>
                      <!--<div class="form-row">
                        <div class="form-group">
                          <div class="form-group-radio">
                            <label
                              class="label_request"
                              for="name"
                            >¿Son STARTUP? :</label>
                            <input
                              v-model="startup"
                              class="input_request"
                              type="checkbox"
                              id="address"
                              @click="optionstartup = true"
                            />
                          </div>
                        </div>
                        <div
                          class="form-group"
                          v-if="optionstartup"
                        >
                          <label
                            class="label_request"
                            for="father_name"
                          >Modalidad de trabajo :</label>
                          <div class="form-select">
                            <select
                              v-model="base.work_model"
                              class="select_request"
                              id="city"
                            >
                              <option
                                v-for="work in rcoptions.workModality"
                                :value="work.value"
                                :key="work.value"
                              >{{work.text}}</option>
                            </select>
                            <span class="select-icon">
                              <fa-icon
                                :icon="['fas', 'sort-down']"
                                class="icon"
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                      -->
                      <h5 class="mb-4 mt-4">
                        Información de ubicación
                      </h5>
                      <div class="form-row">
                        <div class="form-group-completed">
                          <label
                            class="label_request"
                            for="name"
                          >Dirección :</label>
                          <input
                            id="email"
                            v-model="matter_insured.locations[0].address"
                            class="input_request"
                            type="text"
                          >
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="state"
                          >Comuna :</label>
                          <div class="form-select">
                            <select
                              id="prod"
                              v-model="matter_insured.locations[0].commune"
                              class="select_request"
                            >
                              <option
                                v-for="comu in rcoptions.comunasCodes"
                                :key="comu.value"
                                :value="comu.value"
                              >
                                {{ comu.text }}
                              </option>
                            </select>
                            <span class="select-icon">
                              <fa-icon
                                :icon="['fas', 'sort-down']"
                                class="icon"
                              />
                            </span>
                          </div>
                        </div>
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="city"
                          >Ciudad :</label>
                          <div class="form-select">
                            <select
                              id="request_type"
                              v-model="matter_insured.locations[0].location"
                              class="select_request"
                            >
                              <option
                                v-for="ci in rcoptions.cities"
                                :key="ci.value"
                                :value="ci.value"
                              >
                                {{ ci.text }}
                              </option>
                            </select>
                            <span class="select-icon">
                              <fa-icon
                                :icon="['fas', 'sort-down']"
                                class="icon"
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                      <!--<div class="form-row">
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="state"
                          >Ofic./Depto :</label>
                          <div class="form-select">
                            <select
                              class="select_request"
                              v-model="matter_insured.locations[0].commune"
                              id="state"
                            >
                              <option
                                v-for="sta in states"
                                :value="sta.value"
                                :key="sta.value"
                              >{{sta.text}}</option>
                            </select>
                            <span class="select-icon">
                              <fa-icon
                                :icon="['fas', 'sort-down']"
                                class="icon"
                              />
                            </span>
                          </div>
                        </div>
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="city"
                          >Región :</label>
                          <div class="form-select">
                            <select
                              class="select_request"
                              v-model="matter_insured.locations[0].commune"
                              id="user"
                            >
                              <option
                                v-for="exec in executives"
                                :value="exec.value"
                                :key="exec.value"
                              >{{exec.text}}</option>
                            </select>
                            <span class="select-icon">
                              <fa-icon
                                :icon="['fas', 'sort-down']"
                                class="icon"
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="name"
                          >Pisos :</label>
                          <input
                            v-model="matter_insured.locations[0].commune"
                            class="input_request"
                            type="text"
                            id="name"
                          />
                        </div>
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="father_name"
                          >N° Ubicaciones :</label>
                          <div class="form-select">
                            <select
                              class="select_request"
                              v-model="matter_insured.locations[0].commune"
                              id="user"
                            >
                              <option
                                v-for="exec in executives"
                                :value="exec.value"
                                :key="exec.value"
                              >{{exec.text}}</option>
                            </select>
                            <span class="select-icon">
                              <fa-icon
                                :icon="['fas', 'sort-down']"
                                class="icon"
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                      -->
                      <h5 class="mb-4 mt-4">
                        Monto asegurar
                      </h5>
                      <div class="form-row">
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="name"
                          >Inicio Vigencia :</label>
                          <input
                            id="name"
                            v-model="base.start_date"
                            class="input_request"
                            type="date"
                          >
                        </div>
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="father_name"
                          >Término Vigencia :</label>
                          <input
                            id="last_name"
                            v-model="base.end_date"
                            class="input_request"
                            type="date"
                          >
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="name"
                          >Ingreso Anual 2021 :</label>
                          <input
                            id="name"
                            v-model="matter_insured.current_annual_income"
                            class="input_request"
                            type="text"
                          >
                        </div>
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="father_name"
                          >Ingreso anual proyectado para 2022 :</label>
                          <input
                            id="last_name"
                            v-model="matter_insured.projected_annual_income"
                            class="input_request"
                            type="text"
                          >
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="name"
                          >Monto asegurado en UF :</label>
                          <input
                            id="name"
                            v-model="base.insured_amount"
                            class="input_request"
                            type="text"
                          >
                        </div>
                      </div>
                      <h5 class="mb-4 mt-4">
                        Asegurado Adicional
                      </h5>
                      <p class="mb-2 mt-2">
                        En este apartado puedes agregar aseguradores adicionales
                      </p>
                      <label
                        v-if="!optionaditional"
                        class="label_subenlace mb-2 mt-2"
                        for="city"
                        @click="optionaditional = true"
                      >Agregar
                        <fa-icon
                          :icon="['fas', 'plus']"
                          class="icon"
                        />
                      </label>
                      <div
                        v-if="optionaditional"
                        class="form-row"
                      >
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="name"
                          >Tipo Persona :</label>
                          <div class="form-select">
                            <select
                              id="user"
                              v-model="personType"
                              class="select_request"
                            >
                              <option
                                v-for="perstype in rcoptions.otherPersonType"
                                :key="perstype.value"
                                :value="perstype.value"
                              >
                                {{ perstype.text }}
                              </option>
                            </select>
                            <span class="select-icon">
                              <fa-icon
                                :icon="['fas', 'sort-down']"
                                class="icon"
                              />
                            </span>
                          </div>
                        </div>
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="father_name"
                          >Nombre :</label>
                          <input
                            id="last_name"
                            v-model="personsdeudor.name"
                            class="input_request"
                            type="text"
                          >
                        </div>
                      </div>
                      <div
                        v-if="optionaditional"
                        class="form-row"
                      >
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="name"
                          >Apellido Paterno :</label>
                          <input
                            id="name"
                            v-model="personsdeudor.last_name"
                            class="input_request"
                            type="text"
                          >
                        </div>
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="father_name"
                          >Apellido Materno :</label>
                          <input
                            id="last_name"
                            v-model="personsdeudor.last_name2"
                            class="input_request"
                            type="text"
                          >
                        </div>
                      </div>
                      <div
                        v-if="optionaditional"
                        class="form-row"
                      >
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="name"
                          >RUT :</label>
                          <input
                            id="name"
                            v-model="personsdeudor.rut"
                            class="input_request"
                            type="text"
                          >
                        </div>
                        <div class="form-group">
                          <label
                            v-if="optionaditional"
                            class="label_subenlace mt-5"
                            for="city"
                            @click="optionaditional = false"
                          >Cancelar
                            <fa-icon
                              :icon="['fas', 'trash-alt']"
                              class="icon"
                            />
                          </label>
                        </div>
                      </div>
                      <h5 class="mb-4 mt-4">
                        Caracteristicas de la empresa
                      </h5>
                      <div class="form-row">
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="name"
                          >¿Tienen Vehículos? :</label>
                          <div class="form-group-radio">
                            <span>Si</span>
                            <input
                              id="address"
                              value="Si"
                              class="input_request"
                              type="radio"
                              @click="optionvehiculos = true"
                            >
                            <span>No</span>
                            <input
                              id="address"
                              value="No"
                              class="input_request"
                              type="radio"
                              @click="optionvehiculos = false"
                            >
                          </div>
                        </div>
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="name"
                          >¿Tienen equipos móviles? :</label>
                          <div class="form-group-radio">
                            <span>Si</span>
                            <input
                              id="address"
                              value="Si"
                              class="input_request"
                              type="radio"
                            >
                            <span>No</span>
                            <input
                              id="address"
                              value="No"
                              class="input_request"
                              type="radio"
                            >
                          </div>
                        </div>
                      </div>
                      <div
                        v-if="optionvehiculos"
                        class="form-row"
                      >
                        <div class="form-group">
                          <label
                            class="label_request"
                            for="name"
                          >Cantidad Vehiculos :</label>
                          <div class="form-select">
                            <select
                              id="user"
                              v-model="matter_insured.nro_vehicles"
                              class="select_request"
                            >
                              <option
                                v-for="vequanti in rcoptions.vehiclesQuantityOptions"
                                :key="vequanti.value"
                                :value="vequanti.value"
                              >
                                {{ vequanti.text }}
                              </option>
                            </select>
                            <span class="select-icon">
                              <fa-icon
                                :icon="['fas', 'sort-down']"
                                class="icon"
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                      <!--
                      <div class="form-row">
                        <div class="form-group-completed">
                          <label
                            class="label_request"
                            for="name"
                          >¿Han tenido siniestros de Responsabilidad Civil en los últimos 5 años? :</label>
                          <div class="form-group-radio">
                            <span>Si</span>
                            <input
                              value="Si"
                              class="input_request"
                              type="radio"
                              id="address"
                            />
                            <span>No</span>
                            <input
                              value="No"
                              class="input_request"
                              type="radio"
                              id="address"
                            />
                          </div>
                        </div>
                      </div>
                      -->
                      <h5 class="mb-4 mt-4">
                        Coberturas adicionales
                      </h5>
                      <div class="form-row">
                        <div class="form-group">
                          <div class="form-group-radio">
                            <span>Resp. Civil de Transporte de Carga</span>
                            <input
                              id="address"
                              value="Si"
                              class="input_request"
                              type="checkbox"
                            >
                          </div>
                        </div>
                        <div class="form-group">
                          <div class="form-group-radio">
                            <span>Resp. Civil de Transporte de Pasajeros</span>
                            <input
                              id="address"
                              value="Si"
                              class="input_request"
                              type="checkbox"
                            >
                          </div>
                        </div>
                      </div>
                      <div class="form-submit mt-4">
                        <b-button
                          class="text-white py-2 px-3 mr-2"
                          size="sm"
                          variant="primary"
                          @click="ProcessPrice()"
                        >
                          Procesar precio
                        </b-button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="option === 'precio'"
          class="form-new"
        >
          <div class="row">
            <div class="principal">
              <div class="container-price">
                <div class="price-date">
                  <h2 class="mb-4">
                    Precio
                  </h2>
                  <p class="mb-1 mt-1">
                    Anual
                  </p>
                  <p class="mb-1 mt-1">
                    <span>$1.020.646</span>
                  </p>
                  <p class="mb-1 mt-1">
                    <span>UF 31,78</span>
                  </p>
                  <p class="mb-1 mt-1">
                    *IVA INCLUIDO
                  </p>
                  <div class="form-submit mt-4">
                    <b-button
                      class="text-white py-2 px-3 mr-2"
                      size="sm"
                      variant="primary"
                      @click="option = 'datos'"
                    >
                      Volver
                    </b-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Session from '@/mixins/auth'
import rcoptions from '~/static/RC_options.json'
export default {
  mixins: [Session],
  data () {
    return {
      optionaditional: false,
      optionvehiculos: false,
      optionstartup: false,
      personType: 'n',
      option: 'datos',
      errores: [],
      rcoptions,
      year_of_incorporation: '',
      startup: '',
      innerDataRut: null,
      expectedDvRut: '1',
      base: {
        year_of_incorporation: null
      },
      personsproposal: {
        rut: '',
        name: '',
        role: 'proponente',
        commune: '',
        last_name: '',
        last_name2: '',
        phone: '',
        email: '',
        address: ''
      },
      personsdeudor: {
        rut: '',
        name: '',
        role: 'deudor',
        commune: '',
        last_name: '',
        last_name2: '',
        phone: '',
        email: '',
        address: ''
      },
      personsasegurado: {
        rut: '',
        name: '',
        role: 'asegurado',
        commune: '',
        last_name: '',
        last_name2: '',
        phone: '',
        email: '',
        address: ''
      },
      matter_insured: {
        location_address: null,
        commune: null,
        type_address: 'P',
        project_value: null,
        company_occupation: null,
        resolution_number: null,
        description: null,
        nro_workers: null,
        nro_contractors: null,
        nro_locations: 1,
        has_vehicles: null,
        nro_vehicles: null,
        has_mobile_equipment: null,
        current_annual_income: null,
        projected_annual_income: null,
        has_sinister: null,
        has_excavation: null,
        matter_depth: null,
        distance: null,
        exp: null,
        locations: [
          {
            location: null,
            address: null,
            commune: null,
            type_address: 'P'
          }
        ]
      },
      modalShow: false,
      Modal: {
        slider1: true,
        slider2: false
      }
    }
  },
  computed: {
    rutValue: {
      get () {
        return this.value
      },
      set (val) {
        this.inputRut(val)
      }
    },
    rut: {
      get () {
        return this.innerDataRut.replace(/(\d{7,8})(\w|\d){1}/g, '$1-$2')
      },
      set (value) {
        if (!value) { return }
        const valor = value?.replace(/\W/g, '').toUpperCase()
        let cuerpo = valor?.slice(0, -1)
        let multiplo = 2
        let suma = 0
        cuerpo = cuerpo.split('').reverse().join('')
        for (const char of cuerpo) {
          suma += multiplo * parseInt(char)
          if (multiplo < 7) {
            multiplo++
          } else {
            multiplo = 2
          }
        }
        const division = suma % 11
        let expectedDV = 11 - division
        if (expectedDV === 11) { expectedDV = 0 }
        if (expectedDV === 10) { expectedDV = 'K' }
        this.expectedDvRut = expectedDV
        this.innerDataRut = valor
      }
    },
    validrut () {
      const { innerDataRut, expectedDvRut } = this
      const validLength = innerDataRut?.slice(0, -1).length >= 7
      const validDv = innerDataRut?.slice(-1) === expectedDvRut
      return validLength && validDv
    },
    regex () {
      return `\\d{7,8}-${this.expectedDv}`
    }
  },
  methods: {
    ProcessPrice () {
      this.$nuxt.$loading.start()
      this.option = 'precio'
      this.$nuxt.$loading.finish()
    },
    inputEmail (event) {
      const value = event.target.value
      if (/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        this.errores[1] = false
      } else {
        this.errores[1] = true
      }
    },
    inputRut (event) {
      this.rut = event.target.value
      this.personsasegurado.rut = this.rut
      if (!this.validrut) {
        this.errores[2] = true
      } else {
        this.errores[2] = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.btn-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 20px;
  max-width: 150px;
  border-radius: 3px;
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  white-space: nowrap;
  color: #ffffff;
  svg {
    font-size: 10px;
  }
  &.informacion {
    background-color: #eb7e60;
  }
  &.sin-estado {
    background-color: #f8f8f8;
    color: black;
  }
  &.abandono {
    background-color: #7a082b;
  }
  &.perdido {
    background-color: #ea1051;
  }
  &.resuelto {
    background-color: #9dd345;
  }
  &.confirmacion {
    background-color: #9dd345;
  }
  &.cerrado {
    background-color: var(--primary);
  }
  &.licitacion {
    background-color: #f07f28;
  }
  &.llamar {
    background-color: #f88f04;
  }
  &.dg_contactado {
    background-color: #f07f28;
  }
  &.dg_sin_contactar {
    background-color: #ea1051;
  }
}
</style>
<style lang="scss" scoped>
h2,
h3,
p {
  margin: 0;
  padding: 0;
}
.main-container {
  width: 100%;
}
.menu_request {
  padding-top: 0 !important;
  padding-bottom: 5px !important;
}
.menu_request button {
  background-color: transparent;
  font-family: Rubik;
  font-style: normal;
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 19px;
  outline: 0px solid transparent;
  border: 0px solid transparent;
  padding-bottom: 7px;
  color: #9e9e9e;
}
input:focus,
textarea:focus {
  outline: none !important;
  border-color: transparent !important;
}
.main {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: auto;
  margin-top: 0px;
  flex-direction: row;
  flex: 1 1 0%;
  display: flex;
  align-items: flex-start;
  justify-items: start;
}
.row {
  width: 100%;
  margin: 10px auto;
  display: flex;
  color: #515365;
  margin-bottom: 20px;
  flex-direction: row;
}
.container-request {
  max-width: 100% !important;
  padding-right: 0;
  padding-left: 0;
}
.form-sections {
  width: 100%;
  padding: 0px 0px;
}
.form-edit {
  width: 70%;
  padding: 0px 0px;
}
.form-new {
  width: 100%;
  padding: 0px 0px;
}
.principal {
  width: 100%;
  padding: 0px 15px;
}
.contact_row {
  width: 30%;
  height: 100%;
}
.loadmorefeed {
  text-align: center;
  background-color: #ccd1e0;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  color: #ff763a;
  line-height: 3;
}
/*select */
.select-css {
  display: block;
  font-size: 14px;
  font-weight: 400;
  color: #9e9e9e;
  line-height: 17px;
  padding: 0.6em 1.7em 0.6em 1.7em;
  width: 400420px;
  max-width: 100%;
  box-sizing: border-box;
  margin: 20px auto;
  border: 0px solid #aaa;
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.03);
  border-radius: 25px;
  background-color: #f8f8f8;
  background-repeat: no-repeat, repeat;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 0.65em auto, 100%;
}
.select-css::-ms-expand {
  display: none;
}
.select-css:hover {
  border-color: #888;
}
.select-css:focus {
  border-color: #aaa;
  color: #9e9e9e;
  outline: none;
}
.select-css option {
  font-weight: normal;
  border-radius: 25px;
  background-color: #f8f8f8;
}
.classOfElementToColor:hover {
  background-color: red;
  color: black;
}
.select-css option[selected] {
  background-color: orange;
}
.drop-ico {
  font-size: 18px;
}
.icon-color1 {
  color: #fcbf49;
}
.icon-color2 {
  color: #4cc9f0;
}
.icon-color3 {
  color: #f9c74f;
}
.icon-color4 {
  color: #ffd166;
}
.filters {
  display: flex;
  padding-left: 8px;
}
.filters_content {
  width: 95%;
  margin-bottom: 0px;
}
.filters_content li {
  height: 50px;
  display: inline-block;
  line-height: 2.5;
  font-size: 17px;
  line-height: 3.5;
  text-align: center;
  font-weight: 400;
  margin-right: 14px;
}
.shadow-dropdow {
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}
.pointer {
  cursor: pointer;
}
.text-dropdown {
  font-family: Rubik;
  font-style: normal;
  line-height: 17px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #233348 !important;
  .icon {
    display: flex;
    &::after {
      align-self: center;
      justify-self: end;
      margin-left: 6px;
      content: "";
      width: 0.65em;
      height: 0.35em;
      background-color: #233348;
      clip-path: polygon(25% 0, 50% 50%, 75% 0%, 100% 0, 50% 100%, 0 0);
    }
    svg {
      height: 18px;
      min-width: 14px;
      margin-right: 5px;
      color: #233348;
    }
  }
}
.optionpost {
  height: 15px;
  letter-spacing: 1px;
  width: 100%;
  text-align: right;
}
.optionpost button {
  font-size: 15px;
}
.optionpost .icon {
  cursor: pointer;
  margin-right: 7px;
}
input[type="checkbox"] {
  color: #233348 !important;
  height: 16px !important;
  background: #ffffff !important;
  border: 1px solid #e1e1e1 !important;
  box-sizing: border-box !important;
  border-radius: 5px !important;
  width: 16px !important;
  margin-left: 16px;
  margin-right: 16px;
}
input[type="radio"] {
  color: #233348 !important;
  height: 16px !important;
  background: #ffffff !important;
  border: 1px solid #e1e1e1 !important;
  box-sizing: border-box !important;
  border-radius: 5px !important;
  width: 16px !important;
  margin-left: 16px;
  margin-right: 16px;
}
.loading-scroll {
  display: flex;
  align-items: center;
  width: 100%;
  justify-items: center;
}
.post-empty {
  display: flex;
  align-items: center;
  width: 100%;
  justify-items: center;
  height: 400px;
}
.spinner-container {
  display: flex;
  align-items: center;
  width: 100%;
  justify-items: center;
  flex-direction: column;
}
.spinner-container .spinner {
  color: #233348;
  margin-right: 1rem;
}
.spinner-container p {
  margin: 0;
  color: #233348;
  height: fit-content;
}
.spinner-container .empty {
  margin: 0;
  color: #233348;
  height: fit-content;
  font-size: 20px;
}
.formrequest {
  display: none;
  width: 33%;
  padding: 0px 0px;
  height: 100vh;
  position: fixed;
  right: 0px;
  top: 160px;
}
.border-radius-tags {
  background: #ffffff;
  border-radius: 5px;
  height: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
}
.contact_info {
  width: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}
.contact_info h2 {
  font-size: 18px;
  padding-top: 15px;
  text-align: center;
  margin-bottom: 3px;
}
.more {
  font-size: 18px;
}
.table-wrap {
  overflow-x: scroll;
}
.table {
  width: 100%;
  -webkit-box-shadow: 0px 5px 12px -12px rgba(0, 0, 0, 0.29);
  -moz-box-shadow: 0px 5px 12px -12px rgba(0, 0, 0, 0.29);
  box-shadow: 0px 5px 12px -12px rgba(0, 0, 0, 0.29);
}
.table thead th {
  border: none;
  padding: 30px;
  font-size: 16px;
  text-align: center;
  color: #000;
  font-weight: 400;
  text-transform: uppercase;
}
.table thead tr {
  background: #fff;
}
.table tbody tr {
  background: #fff;
}
.table tbody th,
.table tbody td {
  padding: 20px 30px;
  font-size: 14px;
  vertical-align: middle;
}
.table tbody td .close span {
  font-size: 12px;
  color: #dc3545;
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
  &.delete {
    background: #ea1051;
  }
  &.alta {
    background: #ea1051;
  }
  &.media {
    background-color: #f07f28;
  }
  &.baja {
    background: #9dd345;
  }
}
a:focus,
a:active {
  text-decoration: none;
  outline: none;
  transition: all 300ms ease 0s;
  -moz-transition: all 300ms ease 0s;
  -webkit-transition: all 300ms ease 0s;
  -o-transition: all 300ms ease 0s;
  -ms-transition: all 300ms ease 0s;
}
button {
  &.active {
    color: #000000;
    border-bottom: 3px solid #233348;
  }
}
input,
select,
textarea {
  outline: none;
  appearance: unset !important;
  -moz-appearance: unset !important;
  -webkit-appearance: unset !important;
  -o-appearance: unset !important;
  -ms-appearance: unset !important;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  appearance: none !important;
  -moz-appearance: none !important;
  -webkit-appearance: none !important;
  -o-appearance: none !important;
  -ms-appearance: none !important;
  margin: 0;
}
input:focus,
select:focus,
textarea:focus {
  outline: none;
  box-shadow: none !important;
  -moz-box-shadow: none !important;
  -webkit-box-shadow: none !important;
  -o-box-shadow: none !important;
  -ms-box-shadow: none !important;
}
input[type="checkbox"] {
  appearance: checkbox !important;
  -moz-appearance: checkbox !important;
  -webkit-appearance: checkbox !important;
  -o-appearance: checkbox !important;
  -ms-appearance: checkbox !important;
}
input[type="radio"] {
  appearance: radio !important;
  -moz-appearance: radio !important;
  -webkit-appearance: radio !important;
  -o-appearance: radio !important;
  -ms-appearance: radio !important;
}
img {
  max-width: 100%;
  height: auto;
}
figure {
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield !important;
  appearance: none !important;
  -webkit-appearance: none !important;
}
input:-webkit-autofill {
  box-shadow: 0 0 0 30px transparent inset;
  -moz-box-shadow: 0 0 0 30px transparent inset;
  -webkit-box-shadow: 0 0 0 30px transparent inset;
  -o-box-shadow: 0 0 0 30px transparent inset;
  -ms-box-shadow: 0 0 0 30px transparent inset;
}
h2 {
  line-height: 1.66;
  margin: 0;
  padding: 0;
  font-weight: 500;
  color: #222;
  font-size: 24px;
  text-transform: uppercase;
  margin-bottom: 32px;
}
.clear {
  clear: both;
}
.container {
  width: 100%;
  position: relative;
  margin: 0 auto;
  background: #ffffff;
}
.container-price {
  width: 50%;
  position: relative;
  margin: 0 auto;
  background: #ffffff;
}
.signup-img,
.signup-form {
  width: 100%;
}
.signup-img {
  margin-bottom: -7px;
}
.register-form {
  padding: 23px 100px 50px 70px;
}
.price-date {
  padding: 23px 100px 50px 70px;
}
.price-date p {
  font-size: 22px;
  text-align: center;
}
.price-date span {
  font-size: 20px;
  text-align: center !important;
  font-weight: bold;
}
.form-row {
  margin: 0 -15px;
}
.form-row .form-group {
  width: 50%;
  padding: 0 15px;
}
.form-row .form-group-radio {
  display: flex;
  align-items: center;
}
.form-row .form-group-completed {
  width: 100%;
  padding: 0 15px;
}
.form-group {
  margin-bottom: 23px;
  position: relative;
}
.form-group-completed {
  margin-bottom: 23px;
  position: relative;
}
.input_request,
.select_request {
  display: block !important;
  height: 52px !important;
  color: #000 !important;
  width: 100% !important;
  border: 3px solid #ebebeb !important;
  padding: 11px 20px !important;
  box-sizing: border-box !important;
  font-weight: 500 !important;
  font-size: 16px !important;
}
textarea {
  display: block !important;
  height: 60% !important;
  color: #000 !important;
  width: 100% !important;
  border: 3px solid #233348 !important;
  padding: 11px 20px !important;
  box-sizing: border-box !important;
  font-weight: 500 !important;
  font-size: 16px !important;
  resize: none;
}
input:focus,
textarea:focus,
select:focus {
  border: 2px solid #22e6b4 !important;
}
.label_request {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 2px;
  display: block;
}
.label_enlace {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 2px;
  display: block;
  cursor: pointer;
}
.label_subenlace {
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 2px;
  display: block;
  cursor: pointer;
}
.form-radio {
  margin-bottom: 18px;
}
.form-radio input {
  width: auto;
  display: inline-block;
}
.radio-label {
  padding-right: 72px;
}
.form-radio-item {
  position: relative;
  margin-right: 45px;
}
.form-radio-item label {
  font-weight: 500;
  font-size: 13px;
  padding-left: 25px;
  position: relative;
  z-index: 9;
  display: block;
  cursor: pointer;
}
.check {
  display: inline-block;
  position: absolute;
  border: 1px solid #ebebeb;
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  -o-border-radius: 50%;
  -ms-border-radius: 50%;
  height: 13px;
  width: 13px;
  top: 4px;
  left: 0px;
  z-index: 5;
  transition: border 0.25s linear;
  -webkit-transition: border 0.25s linear;
}
.check:before {
  position: absolute;
  display: block;
  content: "";
  width: 9px;
  height: 9px;
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  -o-border-radius: 50%;
  -ms-border-radius: 50%;
  top: 2px;
  left: 2px;
  margin: auto;
  transition: background 0.25s linear;
  -webkit-transition: background 0.25s linear;
}
input[type="radio"]:checked ~ .check {
  border: 1px solid #ff6801;
}
input[type="radio"]:checked ~ .check::before {
  background: #ff6801;
}
.form-select {
  position: relative;
}
.select-icon {
  z-index: 0;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 10px;
  justify-content: center;
  -moz-justify-content: center;
  -webkit-justify-content: center;
  -o-justify-content: center;
  -ms-justify-content: center;
  align-items: center;
  -moz-align-items: center;
  -webkit-align-items: center;
  -o-align-items: center;
  -ms-align-items: center;
}
.select-icon i {
  justify-content: center;
  -moz-justify-content: center;
  -webkit-justify-content: center;
  -o-justify-content: center;
  -ms-justify-content: center;
  align-items: center;
  -moz-align-items: center;
  -webkit-align-items: center;
  -o-align-items: center;
  -ms-align-items: center;
  width: 40px;
  height: 20px;
  font-size: 18px;
  color: #999;
}
.form-submit {
  text-align: right;
  padding-top: 27px;
}
.submit {
  width: 140px;
  height: 40px;
  display: inline-block;
  font-weight: 400;
  font-size: 13px;
  padding: 10px;
  border: none;
  cursor: pointer;
}
#reset {
  background: #f8f8f8;
  color: #999;
  margin-right: 8px;
}
#reset:hover {
  background: #ff6801;
  color: #fff;
}
#submit {
  background: #ff6801;
  color: #fff;
}
#submit:hover {
  background-color: #cd5300;
}
@media screen and (max-width: 992px) {
  .container {
    width: calc(100% - 40px);
    max-width: 100%;
  }
  .signup-content {
    flex-direction: column;
    -moz-flex-direction: column;
    -webkit-flex-direction: column;
    -o-flex-direction: column;
    -ms-flex-direction: column;
  }
  .signup-img,
  .signup-form {
    width: 100%;
  }
}
@media screen and (max-width: 768px) {
  .register-form {
    padding: 50px 40px 50px 40px;
  }
  .price-date {
    padding: 50px 40px 50px 40px;
  }
}
@media screen and (max-width: 575px) {
  .form-row {
    flex-direction: column;
    -moz-flex-direction: column;
    -webkit-flex-direction: column;
    -o-flex-direction: column;
    -ms-flex-direction: column;
    margin: 0px;
  }
  .form-row .form-group {
    width: 100%;
    padding: 0px;
  }
  .form-row .form-group-completed {
    width: 100%;
    padding: 0px;
  }
  .radio-label {
    padding-right: 22px;
  }
  .form-radio-item {
    margin-right: 25px;
  }
}
@media screen and (max-width: 480px) {
  .form-radio {
    flex-direction: column;
    -moz-flex-direction: column;
    -webkit-flex-direction: column;
    -o-flex-direction: column;
    -ms-flex-direction: column;
  }
  .submit {
    width: 100%;
  }
  #reset {
    margin-right: 0px;
    margin-bottom: 10px;
  }
}
/*# sourceMappingURL=style.css.map */
display-flex,
.signup-content,
.form-row,
.form-radio,
.select-icon,
.select-icon .icon {
  display: flex;
  display: -webkit-flex;
}
.contact_info {
  width: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}
.contact_info h2 {
  font-size: 18px;
  padding-top: 15px;
  text-align: center;
}
.contact_info p {
  font-size: 16px;
  padding-top: 2px;
  padding-left: 2px;
  padding-right: 2px;
  text-align: center;
}
.contact_info_title {
  padding: 10px 10px 10px 10px;
  width: 100%;
  letter-spacing: 1px;
  align-items: center;
  color: #515365;
}
.contact_info_title span {
  text-decoration: underline;
  cursor: pointer;
}
.contact_info_title h4 {
  font-size: 16px;
  padding-left: 17px;
}
.contact_info_detail {
  width: 100%;
  padding-left: 5px;
  padding-right: 5px;
}
.contact_info_detail th {
  padding-top: 20px;
}
/*::-webkit-scrollbar {
  display: none;
}*/
.toolbar {
  display: none;
  margin-bottom: 1.5em;
}
.errortext {
  color: red !important;
}
.errorborder {
  border-color: red !important;
  &:focus {
    outline-color: #ea1051 !important;
    border-color: red !important;
  }
}
</style>
