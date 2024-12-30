<template>
  <div class="card-client card-padding">
    <h4 class="color-base">
      <fa-icon
        :icon="['fas', 'edit']"
        class="text-primary mr-2"
      />
      Crear <span v-if="viewproduct">Cliente Relacionado</span> <span v-else>Lead Relacionado</span>
    </h4>
    <div class="margin-card">
      <h6 class="text-base">
        <fa-icon
          :icon="['fas', 'address-book']"
          class="text-primary mr-2"
        />Datos de <span v-if="viewproduct">Cliente</span> <span v-else>Lead</span>
      </h6>
      <div class="signup-content margin-text">
        <div class="signup-form">
          <form
            id="register-form"
            method="POST"
          >
            <div
              v-if="mensajeloader !== ''"
              class="form-row w-100"
            >
              <div class="form-group-request w-100">
                <span
                  v-if="mensajeloader === 'encontrado'"
                  class="mensajerut"
                >{{ Names.rut }} encontrado en SII</span>
                <span
                  v-if="mensajeloader === 'noencontrado'"
                  class="mensajerutfalse"
                >No se encuentra resultados en SII para el RUT ingresado</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group-request relative">
                <label
                  class="text-base"
                  for="name"
                >{{ Names.rut }}* :</label>
                <div
                  v-if="version === 'CL'"
                  class="relative"
                >
                  <input
                    id="rut"
                    v-model="Leadsrelation.rut"
                    placeholder="11.111.111-1"
                    class="form-control form-input"
                    type="text"
                    @input="debouncedSearchRUTPrev"
                  >
                  <span
                    v-if="loader"
                    class="absolute loader2"
                  >
                    <img
                      src="~assets/icons/loading.gif"
                      class="w-16"
                    >
                  </span>
                </div>
                <div
                  v-else
                  class="relative"
                >
                  <input
                    id="rut"
                    v-model="Leadsrelation.rut"
                    class="form-control form-input"
                    type="text"
                  >
                  <span
                    v-if="loader"
                    class="absolute loader2"
                  >
                    <img
                      src="~assets/icons/loading.gif"
                      class="w-16"
                    >
                  </span>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group-request">
                <label
                  class="text-base"
                  for="name"
                >Nombre* :</label>
                <input
                  id="name"
                  v-model="Leadsrelation.name"
                  placeholder="Juan"
                  class="form-control form-input"
                  type="text"
                >
              </div>
              <div class="form-group-request">
                <label
                  class="text-base"
                  for="father_name"
                >Apellido* :</label>
                <input
                  id="last_name"
                  v-model="Leadsrelation.last_name"
                  placeholder="Pérez"
                  class="form-control form-input"
                  type="text"
                >
              </div>
            </div>
            <div
              class="form-row"
            >
              <div class="form-group-request relative">
                <label
                  class="text-base"
                  for="father_name"
                >Tipo de relación con contacto :</label>
                <input
                  id="razon_social"
                  v-model="Leadsrelation.type"
                  placeholder="El negocio de Juan Pérez"
                  class="form-control form-input"
                  type="text"
                >
              </div>
            </div>
            <div class="form-row">
              <div class="form-group-request">
                <label
                  class="text-base"
                  for="name"
                >Email* :</label>
                <input
                  id="email"
                  v-model="Leadsrelation.email"
                  placeholder="juanperez@gmail.com"
                  class="form-control form-input"
                  type="text"
                >
              </div>
              <div class="form-group-request">
                <label
                  class="text-base"
                  for="father_name"
                >Telefono* :</label>
                <input
                  id="phone"
                  v-model="fullNumber"
                  placeholder="9 66545253"
                  class="form-control form-input"
                  type="text"
                >
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="w-100 mt-5 text-center">
      <b-button
        class="text-white shadow-dropdow btn-new ml-4"
        variant="primary"
        @click="saveLead()"
      >
        Registrar
      </b-button>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import parsePhoneNumber from 'libphonenumber-js'
import { validateRut } from '@fdograph/rut-utilities'
import employes from '~/static/employes.json'
export default {
  name: 'Editar',
  props: {
    leadsedit: {
      type: Object,
      required: true
    },
    leadvalue: {
      type: Boolean,
      default: false
    },
    idlead: {
      type: String,
      default: ''
    },
    viewproduct: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      option: 'historial',
      selected: null,
      employes,
      codePhone: null,
      loader: false,
      version: '',
      mensajeloader: '',
      Leadsrelation: {
        name: null,
        last_name: null,
        rut: null,
        razon_social: null,
        giro: null,
        person: null,
        email: null,
        phone: null,
        address: null,
        comuna: null,
        user: null,
        type: null
      },
      Leads: {
        name: null,
        last_name: null,
        rut: null,
        razon_social: null,
        giro: null,
        person: null,
        email: null,
        phone: null,
        address: null,
        comuna: null,
        user: null,
        type: null
      },
      optionsPerson: [
        { value: 'legal_person', text: 'Jurídica' },
        { value: 'natural_person', text: 'Natural' }
      ],
      optionsPersonCL: [
        { value: 'legal_person', text: 'Jurídica' },
        { value: 'natural_person', text: 'Natural' }
      ],
      optionsPersonMX: [
        { value: 'legal_person', text: 'Moral' },
        { value: 'natural_person', text: 'Fisica' }
      ],
      NamesCL: {
        rut: 'Rut',
        comuna: 'Comuna'
      },
      NamesMX: {
        rut: 'Rfc',
        comuna: 'Colonia'
      },
      Names: ''
    }
  },
  computed: {
    fullNumber: {
      // getter
      get () {
        return this.codigoPhone()
      },
      set (newValue) {
        this.resetPhone(newValue)
      }
    },
    executives () {
      return this.$store.state.leads.userskam.map(({ id, email }) => ({
        value: id,
        text: email
      }))
    }
  },
  watch: {
    leadsedit: {
      handler (val) {
        this.LeadEdit(val)
      }
    }
  },
  created () {
    if (process.env.version === 'CL') {
      this.Names = this.NamesCL
      this.optionsPerson = this.optionsPersonCL
    } else {
      this.Names = this.NamesMX
      this.optionsPerson = this.optionsPersonMX
    }
    this.version = process.env.version
  },
  methods: {
    LeadEdit (val) {
      this.Leads = val
      this.Leadsrelation.person = this.Leads.person
      this.Leadsrelation.razon_social = this.Leads.razon_social
      this.Leadsrelation.giro = this.Leads.giro
      this.Leadsrelation.address = this.Leads.address
      this.Leadsrelation.comuna = this.Leads.comuna
      this.Leadsrelation.employee_quantity_choice = this.Leads.employee_quantity_choice
      this.Leadsrelation.user = this.Leads.user
    },
    debouncedSearchRUTPrev () {
      this.loader = true
      this.debouncedSearchRUT()
    },
    debouncedSearchRUT: _.debounce(function () {
      this.ValidateRut()
    }, 2000),
    debouncedSearchRFC: _.debounce(function () {
      this.validRFC()
    }, 2000),
    async ValidateRut () {
      try {
        const _response = await this.$simpleeApi.get(`/get_data_sii/?rut=${this.Leadsrelation.rut}`)
        console.log(_response)
        this.loader = false
        const results = _response.data
        this.Leadsrelation.razon_social = results.razon_social
        this.Leadsrelation.giro = results.giro
        this.mensajeloader = 'encontrado'
      } catch (error) {
        this.loader = false
        this.Leadsrelation.razon_social = ''
        this.Leadsrelation.giro = ''
        this.mensajeloader = 'noencontrado'
        return null
      }
    },
    codigoPhone () {
      if (process.env.version === 'CL') {
        this.codePhone = '+'
      } else {
        this.codePhone = '+'
      }
      if (this.Leadsrelation.phone == null) {
        return this.codePhone
      } else {
        return this.Leadsrelation.phone
      }
    },
    resetPhone (newValue) {
      this.Leadsrelation.phone = newValue
      if (this.Leadsrelation.phone.includes(this.codePhone) === false) {
        this.Leadsrelation.phone = this.codePhone
      }
    },
    validateNumber () {
      const phone = this.Leadsrelation.phone?.length
      if (!phone || this.Leadsrelation.phone.length < 7) {
        return false
      }
      this.selectedCountry = process.env.version
      const phoneNumber = parsePhoneNumber(
        this.Leadsrelation.phone,
        this.selectedCountry
      )
      if (!phoneNumber.isValid()) {
        return false
      } else {
        return true
      }
    },
    validRFC () {
      const valueLength = this.Leadsrelation.rut?.length
      if (!valueLength) {
        return false
      }

      const regex = /^[A-ZÑ&]{3}\d{6}[A-Z\d]{3}$/
      const regexperson = /^[A-ZÑ&]{4}\d{6}[A-Z\d]{3}$/
      const rfcWithoutSATKey = this.Leadsrelation.rut?.slice(0, valueLength - 3)
      const rfcSATKey = this.Leadsrelation.rut?.slice(valueLength - 3, valueLength)

      if (!rfcWithoutSATKey || !rfcSATKey) {
        return false
      }

      const rfcFisico = `${rfcWithoutSATKey}${rfcSATKey.replaceAll('-', '')}`.match(regexperson)
      const rfcMoral = `${rfcWithoutSATKey}${rfcSATKey.replaceAll('-', '')}`.match(regex)

      if (rfcFisico == null && rfcMoral == null) {
        return false
      } else {
        return true
      }
    },
    validateEmail () {
      const value = this.Leadsrelation.email?.length
      if (!value) {
        return false
      }
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(this.Leadsrelation.email)) {
        return true
      } else {
        return false
      }
    },
    async saveLead () {
      if (
        !this.Leadsrelation.email &&
        !this.Leadsrelation.phone &&
        !this.Leadsrelation.rut
      ) {
        this.$store.commit('setAlertMessage', { error: 'Para crear un nuevo contacto se debe agregar al menos email, telefono o rut' })
        return
      }
      if (
        !this.Leadsrelation.rut && !this.leadvalue
      ) {
        this.$store.commit('setAlertMessage', { error: 'El campo RUT es obligatorio' })
        return
      }
      console.log(this.Leadsrelation.rut)
      if (
        this.Leadsrelation.rut
      ) {
        if (process.env.version === 'CL') {
          this.document = 'RUT'
          if (this.Leadsrelation.rut?.length && validateRut(this.Leadsrelation.rut) === false) {
            this.$store.commit('setAlertMessage', { error: 'RUT no válido' })
            return
          }
        } else {
          this.document = 'RFC'
          if (this.validRFC() === false) {
            this.$store.commit('setAlertMessage', { error: 'RFC no válido' })
            return
          }
        }
      }
      console.log(this.leadvalue)
      if (
        !this.Leadsrelation.person && !this.leadvalue
      ) {
        this.$store.commit('setAlertMessage', { error: 'El campo tipo de persona es obligatorio' })
        return
      }
      if (
        this.Leadsrelation.person === 'legal_person' && !this.leadvalue
      ) {
        if (
          !this.Leadsrelation.razon_social
        ) {
          this.$store.commit('setAlertMessage', { error: 'El campo razon social es obligatorio' })
          return
        }
      }
      if (
        !this.Leadsrelation.name && !this.leadvalue
      ) {
        this.$store.commit('setAlertMessage', { error: 'El campo Nombre es obligatorio' })
        return
      }
      if (
        !this.Leadsrelation.last_name && !this.leadvalue
      ) {
        this.$store.commit('setAlertMessage', { error: 'El campo Apellido es obligatorio' })
        return
      }
      if (
        !this.Leadsrelation.phone && !this.leadvalue
      ) {
        this.$store.commit('setAlertMessage', { error: 'El campo Telefono es obligatorio' })
        return
      }
      if (
        this.Leadsrelation.phone
      ) {
        const telefono = this.Leadsrelation.phone
        if (
          telefono.length > 3
        ) {
          if (this.validateNumber() === false) {
            this.$store.commit('setAlertMessage', { error: 'Número de teléfono no valido' })
            return
          }
        }
      }
      if (
        !this.Leadsrelation.email && !this.leadvalue
      ) {
        this.$store.commit('setAlertMessage', { error: 'El campo email es obligatorio' })
        return
      }
      if (
        this.Leadsrelation.email
      ) {
        if (this.validateEmail() === false) {
          this.$store.commit('setAlertMessage', { error: 'correo electrónico no valido' })
          return
        }
      }
      /*
      if (
        !this.Leadsrelation.giro
      ) {
        this.$store.commit('setAlertMessage', { error: 'El campo giro es obligatorio' })
        return
      }
      */
      if (this.idlead) {
        this.Leadsrelation.related_lead = {
          lead_related: this.idlead,
          relation_type: this.Leadsrelation.type
        }
        if (
          !this.Leadsrelation.type
        ) {
          this.$store.commit('setAlertMessage', { error: 'El campo de relación de contacto es obligatorio' })
          return
        }
      }
      const lead = this.Leadsrelation
      this.Leadsrelation = {}
      try {
        const res = await this.$simpleeApi.post('/lead/', lead)
        const data = res.data
        this.$emit('SaveNewClientGod', data.id)
      } catch (error) {
        this.$sendErrorPayload({
          payload: lead,
          origin: 'Leads',
          errorResponse: error.response,
          expectedBehavior: 'Deberia crearse un nuevo Cliente'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
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
.card-client {
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  background-color: #fff;
}
.card-padding {
  padding: 30px 100px 60px 100px;
}
.form-input {
  border: 1px solid #505755;
  font-size: 14px;
  border-radius: 8px;
}
@media screen and (max-width: 480px) {
  .card-padding {
    padding: 10px 10px 10px 10px;
  }
  .page {
    padding: 10px 10px 10px 10px !important;
  }
}
.loader {
  right: 9px;
  top: 45px;
}
.loader2 {
  right: 0px;
  top: -10px;
  position: absolute;
}
@media (max-width: 1236px) {
  .loader {
    right: 9px;
    top: 45px;
  }
  .loader2 {
    right: 0px;
    top: -10px;
  }
}
@media (max-width: 1080px) {
  .loader {
    right: 9px;
    top: 45px;
  }
  .loader2 {
    right: 0px;
    top: -10px;
  }
}
@media (max-width: 960px) {
  .loader {
    right: 9px;
    top: 45px;
  }
  .loader2 {
    right: 0px;
    top: -10px;
  }
}
@media (max-width: 904px) {
  .loader {
    right: 9px;
    top: 45px;
  }
  .loader2 {
    right: 0px;
    top: -10px;
  }
}
@media (max-width: 904px) {
  .loader {
    right: 9px;
    top: 45px;
  }
  .loader2 {
    right: 0px;
    top: -10px;
  }
}
@media (max-width: 768px) {
  .loader {
    right: 9px;
    top: 45px;
  }
  .loader2 {
    right: 0px;
    top: -10px;
  }
}
.w-16 {
  width: 65px;
}
.relative {
  position: relative;
}
.mensajerut {
  color: #6461ed;
}
.mensajerutfalse {
  color: red;
}
::placeholder {
  color: #acacac;
  opacity: 0.7;
}
:-ms-input-placeholder {
  color: #acacac;
  opacity: 0.7;
}
::-webkit-input-placeholder {
  color: #acacac;
  opacity: 0.7;
} /* WebKit */
::-moz-placeholder {
  color: #acacac;
  opacity: 0.7;
}
.form-row {
  margin: 0 -15px;
}
.form-col {
  margin: 0 -15px;
  flex-direction: column;
}
.form-row .form-group {
  width: 50%;
  padding: 0 15px;
}
.form-row .form-group-request {
  width: 50%;
  padding: 12px 15px;
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
</style>
