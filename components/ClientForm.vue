<template>
  <div class="card-client card-padding">
    <h4 class="color-base title">
      <fa-icon :icon="['fas', 'edit']" class="text-primary mr-2" />
      Editar <span v-if="viewproduct">Cliente</span> <span v-else>Lead</span>
    </h4>
    <div class="mt-4">
      <p class="new">
        ID Contacto: {{ Leads.id }}
      </p>
    </div>
    <div class="margin-card">
      <h6 class="text-base sub-title">
        <fa-icon
          :icon="['fas', 'address-book']"
          class="text-primary mr-2"
        />Datos de <span v-if="viewproduct">Cliente</span>
        <span v-else>Lead</span>
      </h6>
      <div class="signup-content margin-text">
        <div v-if="loadingClient" class="d-flex flex-fill h-100 loading">
          <div class="text-center text-primary pa-5 mx-auto my-auto">
            <b-spinner class="align-middle" />
            <strong>Cargando...</strong>
          </div>
        </div>
        <div v-else class="signup-form">
          <form id="register-form" method="POST">
            <div v-if="Leads.partnership_details" class="mb-3">
              <label class="text-base" for="name">Partnership* :</label>
              <input
                id="rut"
                v-model="Leads.partnership_details.name"
                disabled
                placeholder="11.111.111-1"
                class="form-control form-input"
                type="text"
              >
            </div>
            <div class="mb-3">
              <label class="text-base" for="name">{{ Names.rut }}* :</label>
              <input
                id="rut"
                v-model="Leads.rut"
                placeholder="11.111.111-1"
                class="form-control form-input"
                type="text"
                @input="debouncedSearchRUTPrev"
              >
            </div>
            <div class="mb-3">
              <label class="text-base" for="father_name">Persona* :</label>
              <b-form-select
                id="persona"
                v-model="Leads.person"
                :options="optionsPerson"
                class="form-control form-input"
                required
              />
            </div>
            <div class="mb-3">
              <label class="text-base" for="father_name">Giro* :</label>
              <s-input-select
                ref="Leads.comuna_select"
                show-last-option-if-no-results
                :value="Leads.giro"
                placeholder="giro"
                :options="giros"
                hint-text="Selecciona el giro"
                name="giro"
                @onChange="changegiro"
              />
            </div>
            <div class="mb-3">
              <label class="text-base" for="father_name">Razón social :</label>
              <input
                id="razon_social"
                v-model="Leads.razon_social"
                placeholder="El negocio de Juan Pérez"
                class="form-control form-input"
                type="text"
              >
            </div>
            <div class="form-group">
              <div class="mb-3">
                <label class="text-base" for="name">Nombre* :</label>
                <input
                  id="name"
                  v-model="Leads.name"
                  placeholder="Juan"
                  class="form-control form-input"
                  type="text"
                >
              </div>
              <div class="mb-3">
                <label class="text-base" for="father_name">Apellido* :</label>
                <input
                  id="last_name"
                  v-model="Leads.last_name"
                  placeholder="Pérez"
                  class="form-control form-input"
                  type="text"
                >
              </div>
              <div class="mb-3">
                <label class="text-base" for="name">Email* :</label>
                <input
                  id="email"
                  v-model="Leads.email"
                  placeholder="juanperez@gmail.com"
                  class="form-control form-input"
                  type="text"
                >
              </div>
              <div class="mb-3">
                <label class="text-base" for="father_name">Telefono* :</label>
                <input
                  id="phone"
                  v-model="fullNumber"
                  placeholder="9 66545253"
                  class="form-control form-input"
                  type="text"
                >
              </div>
              <div class="mb-3">
                <label class="text-base" for="father_name">Dirección:</label>
                <input
                  id="dirección"
                  v-model="Leads.address"
                  placeholder="Manuel Barros Borgoño 160"
                  class="form-control form-input"
                  type="text"
                >
              </div>
              <div v-if="version === 'MX'" class="">
                <label
                  class="text-base"
                  for="father_name"
                >Código Postal:</label>
                <input
                  id="comuna"
                  v-model="Leads.zip_code"
                  placeholder="65650"
                  class="form-control form-input"
                  type="text"
                >
              </div>
              <div v-else class="mb-3">
                <label class="text-base" for="father_name">Comuna :</label>
                <s-input-select
                  ref="Leads.comuna_select"
                  show-last-option-if-no-results
                  :value="Leads.comuna"
                  placeholder="Comuna"
                  :options="Comunascl"
                  hint-text="Selecciona la comuna"
                  name="Leadscomuna"
                  @onChange="changeComuna"
                />
              </div>
              <div v-if="version === 'MX'" class="">
                <div class="w-100 mt-2">
                  <label
                    class="text-base"
                    for="father_name"
                  >Municipio* :</label>
                  <s-input-select
                    ref="Leads.city"
                    show-last-option-if-no-results
                    :value="Leads.city"
                    placeholder="Municipio"
                    :options="getMunicipios(Leads.zip_code)"
                    hint-text="Selecciona el municipio"
                    name="municipio"
                    :disabled-option="ValidateMunicipios"
                    @onChange="changeMunicipio"
                  />
                </div>
                <div class="w-100 mt-2">
                  <label class="text-base" for="father_name">Colonia* :</label>
                  <s-input-select
                    ref="Leads.comuna"
                    show-last-option-if-no-results
                    :value="Leads.comuna"
                    placeholder="Comuna"
                    :options="getComunas(Leads.zip_code)"
                    hint-text="Selecciona la comuna"
                    name="Leadscomuna"
                    :disabled-option="ValidateComuna"
                    @onChange="changeComuna"
                  />
                </div>
              </div>
              <div class="mb-3 mt-2">
                <label
                  class="text-base"
                  for="father_name"
                >Numero trabajadores :</label>
                <b-form-select
                  id="user"
                  v-model="Leads.employee_quantity_choice"
                  :options="employes"
                  class="form-control form-input"
                  required
                />
              </div>
              <div class="mb-3">
                <label
                  class="text-base"
                  for="father_name"
                >Ejecutivo/a a cargo* :</label>
                <b-form-select
                  id="user"
                  v-model="Leads.user"
                  :options="executives"
                  class="form-control form-input"
                  required
                />
              </div>
              <div class="form-group-request mt-3">
                <label class="text-base" for="birth_date">Etiquetas :</label>
                <!-- Prop `add-on-change` is needed to enable adding tags vie the `change` event -->
                <b-form-tags
                  id="tags-component-select"
                  v-model="Leads.tags"
                  size="md"
                  add-on-change
                  tag-variant="primary"
                  no-outer-focus
                >
                  <template
                    #default="{
                      tags,
                      inputAttrs,
                      inputHandlers,
                      disabled,
                      removeTag,
                    }"
                  >
                    <b-form-select
                      v-bind="inputAttrs"
                      :disabled="disabled || availableOptions.length === 0"
                      :options="availableOptions"
                      class="form-control form-input custom-select mb-3"
                      v-on="inputHandlers"
                    >
                      <template #first>
                        <!-- This is required to prevent bugs with Safari -->
                        <option disabled value="">
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
              </div>
              <div
                class="mt-3"
              >
                <label
                  class="text-base"
                  for="father_name"
                >Información Adicional :</label>
                <textarea
                  id="comment"
                  v-model="Leads.comment"
                  rows="6"
                />
              </div>
              <!--  <div
                v-if="Leads.state"
                class="mb-3"
              >
                <label
                  class="text-base"
                  for="father_name"
                >Estado :</label>
                <b-form-select
                  disabled
                  id="user"
                  v-model="Leads.state"
                  :options="states"
                  class="form-control form-input"
                  required
                />
              </div>
              <div
                v-if="Leads.priority"
                class="mb-3"
              >
                <label
                  class="text-base"
                  for="father_name"
                >Prioridad :</label>
                <b-form-select
                  disabled
                  id="user"
                  v-model="Leads.priority"
                  :options="optionsPriority"
                  class="form-control form-input"
                  required
                />
              </div>
              <div
                v-if="Leads.channel"
                class="mb-3"
              >
                <label
                  class="text-base"
                  for="father_name"
                >Canal :</label>
                <b-form-select
                  disabled
                  id="user"
                  v-model="Leads.channel"
                  :options="channels"
                  class="form-control form-input"
                  required
                />
              </div>

            -->
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import parsePhoneNumber from 'libphonenumber-js'
import { validateRut } from '@fdograph/rut-utilities'
import SInputSelect from '~/components/base/SInputSelect.vue'
import Comunascl from '~/static/comunascl.json'
import municipiosmx from '~/static/municipiosmx.json'
import coloniasmx from '~/static/coloniasmx.json'
import giroscl from '~/static/giroscl.json'
import girosmx from '~/static/girosmx.json'
import states from '~/static/states.json'
import employes from '~/static/employes.json'
export default {
  name: 'Editar',
  components: {
    SInputSelect
  },
  props: {
    leadsedit: {
      type: Object,
      required: true
    },
    viewproduct: {
      type: Boolean,
      default: false
    },
    leadvalue: {
      type: Boolean,
      default: false
    },
    loadingClient: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      Comunascl,
      option: 'historial',
      selected: null,
      employes,
      codePhone: null,
      version: '',
      ValidateMunicipios: false,
      ValidateComuna: false,
      giros: [],
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
        document: null,
        selectedCountry: null,
        city: null,
        zip_code: null
      },
      states: states.filter(({ value }) => value !== 'sin_estado'),
      optionsPriority: [
        { value: null, text: 'Sin prioridad' },
        { value: 'baja', text: 'Baja' },
        { value: 'media', text: 'Media' },
        { value: 'alta', text: 'Alta' }
      ],
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
  watch: {
    leadsedit: {
      handler (val) {
        this.LeadEdit(val)
      }
    }
  },
  computed: {
    ...mapState(['leadsFilters', 'leadFromSocket', 'leads']),
    ...mapState('leads', ['users', 'channels2', 'campanas', 'loadingLeads']),
    channels () {
      return this.$store.state.leads.channels2.map(({ id, name }) => ({
        value: id,
        text: name
      }))
    },
    availableOptions () {
      if (typeof this.Leads.tags === 'undefined') {
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
          ({ value }) => !this.Leads.tags.includes(value)
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
  created () {
    if (process.env.version === 'CL') {
      this.giros = giroscl
      this.Names = this.NamesCL
      this.optionsPerson = this.optionsPersonCL
    } else {
      this.giros = girosmx
      this.Names = this.NamesMX
      this.optionsPerson = this.optionsPersonMX
    }
    this.version = process.env.version
  },
  methods: {
    capitalizarPrimeraLetra (str) {
      return str.toUpperCase()
    },
    debouncedSearchRUTPrev () {
      this.GetTipoLead()
    },
    GetTipoLead () {
      let rut = this.Leads.rut.split('.').join('')
      rut = rut.split('-').join('')
      rut = rut.substring(0, rut.length - 1)
      if (rut <= 30000000) {
        this.Leads.person = 'natural_person'
      } else if (rut > 50000000) {
        this.Leads.person = 'legal_person'
      }
    },
    getMunicipios (id) {
      const options = municipiosmx
        .filter(key => key.postal === id)
        .map((obj) => {
          return {
            value: this.capitalizarPrimeraLetra(obj.value),
            text: this.capitalizarPrimeraLetra(obj.text)
          }
        })
      if (options.length > 0) {
        this.ValidateMunicipios = false
        return options
      } else {
        this.ValidateMunicipios = true
      }
    },
    getComunas (id) {
      const options = coloniasmx
        .filter(key => key.postal === id)
        .map((obj) => {
          return {
            value: this.capitalizarPrimeraLetra(obj.value),
            text: this.capitalizarPrimeraLetra(obj.text)
          }
        })
      if (options.length > 0) {
        this.ValidateComuna = false
        return options
      } else {
        this.ValidateComuna = true
      }
    },
    changegiro (event) {
      this.Leads.giro = event.target.value
    },
    changeMunicipio (event) {
      console.log(event.target.value)
      this.Leads.city = event.target.value
    },
    LeadEdit (val) {
      this.Leads = val
    },
    changeComuna (event) {
      this.Leads.comuna = event.target.value
    },
    codigoPhone () {
      if (process.env.version === 'CL') {
        this.codePhone = '+'
      } else {
        this.codePhone = '+'
      }
      if (this.Leads.phone == null) {
        return this.codePhone
      } else {
        return this.Leads.phone
      }
    },
    resetPhone (newValue) {
      this.Leads.phone = newValue
      if (this.Leads.phone.includes(this.codePhone) === false) {
        this.Leads.phone = this.codePhone
      }
    },
    validateNumber () {
      const phone = this.Leads.phone?.length
      if (!phone) {
        return false
      }
      this.selectedCountry = process.env.version
      const phoneNumber = parsePhoneNumber(
        this.Leads.phone,
        this.selectedCountry
      )
      if (!phoneNumber.isValid()) {
        return false
      } else {
        return true
      }
    },
    validRFC () {
      const valueLength = this.Leads.rut?.length
      if (!valueLength) {
        return false
      }

      const regex = /^[A-ZÑ&]{3}\d{6}[A-Z\d]{3}$/
      const regexperson = /^[A-ZÑ&]{4}\d{6}[A-Z\d]{3}$/
      const rfcWithoutSATKey = this.Leads.rut?.slice(0, valueLength - 3)
      const rfcSATKey = this.Leads.rut?.slice(valueLength - 3, valueLength)

      if (!rfcWithoutSATKey || !rfcSATKey) {
        return false
      }

      const rfcFisico = `${rfcWithoutSATKey}${rfcSATKey.replaceAll(
        '-',
        ''
      )}`.match(regexperson)
      const rfcMoral = `${rfcWithoutSATKey}${rfcSATKey.replaceAll(
        '-',
        ''
      )}`.match(regex)

      if (rfcFisico == null && rfcMoral == null) {
        return false
      } else {
        return true
      }
    },
    validateEmail () {
      const value = this.Leads.email?.length
      if (!value) {
        return false
      }
      if (
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(this.Leads.email)
      ) {
        return true
      } else {
        return false
      }
    },
    async saveLead () {
      const lead = this.Leads
      if (!this.Leads.email && !this.leadvalue) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo Email es obligatorio'
        })
        return
      }
      if ((!this.Leads.phone || this.Leads.phone === '+') && !this.leadvalue) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo Telefono es obligatorio'
        })
        return
      } else if (this.Leads.phone === '+') {
        this.Leads.phone = ''
      }

      if (!this.Leads.rut && !this.leadvalue) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo RUT es obligatorio'
        })
        return
      }
      if (this.Leads.rut) {
        if (process.env.version === 'CL') {
          this.document = 'RUT'
          if (this.Leads.rut?.length && validateRut(this.Leads.rut) === false) {
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
      if (!this.Leads.person && !this.leadvalue) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo tipo de persona es obligatorio'
        })
        return
      }
      if (this.Leads.person === 'legal_person' && !this.leadvalue) {
        if (!this.Leads.razon_social) {
          this.$store.commit('setAlertMessage', {
            error: 'El campo razon social es obligatorio'
          })
          return
        }
      }
      if (!this.Leads.name && !this.leadvalue) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo Nombre es obligatorio'
        })
        return
      }
      if (!this.Leads.last_name && !this.leadvalue) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo Apellido es obligatorio'
        })
        return
      }
      if (!this.Leads.phone && !this.leadvalue) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo Telefono es obligatorio'
        })
        return
      }
      if (this.Leads.phone) {
        const telefono = this.Leads.phone
        if (telefono.length > 3) {
          if (this.validateNumber() === false) {
            this.$store.commit('setAlertMessage', {
              error: 'Número de teléfono no valido'
            })
            return
          }
        }
      }
      if (!this.Leads.email && !this.leadvalue) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo email es obligatorio'
        })
        return
      }
      if (this.Leads.email) {
        if (this.validateEmail() === false) {
          this.$store.commit('setAlertMessage', {
            error: 'correo electrónico no valido'
          })
          return
        }
      }
      if (!this.Leads.giro && !this.leadvalue) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo giro es obligatorio'
        })
        return
      }
      if (!this.Leads.address && !this.leadvalue) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo Dirección es obligatorio'
        })
        return
      }
      if (
        !this.Leads.zip_code &&
        !this.leadvalue &&
        process.env.version === 'MX'
      ) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo Código postal es obligatorio'
        })
        return
      }
      if (!this.Leads.city && !this.leadvalue && process.env.version === 'MX') {
        this.$store.commit('setAlertMessage', {
          error: 'El campo Municipio es obligatorio'
        })
        return
      }
      if (!this.Leads.comuna && !this.leadvalue) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo Comuna/Colonia es obligatorio'
        })
        return
      }
      if (!this.Leads.user && !this.leadvalue) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo Ejecutiva es obligatorio'
        })
        return
      }
      if (this.Leads.tags) {
        const leadetiqueta = []
        for (const [key, value] of Object.entries(this.Leads.tags)) {
          if (value) {
            const newlead2 = {
              id: value
            }
            leadetiqueta.push(newlead2)
          }
          lead.tags = leadetiqueta
        }
      }
      try {
        await this.$simpleeApi.put(`/lead/${lead.id}/`, lead)
        this.$emit('SaveActClientGod')
      } catch (error) {
        this.$sendErrorPayload({
          payload: lead,
          origin: 'Leads',
          errorResponse: error.response,
          expectedBehavior: `Deberia actualizarse el lead con el id ${lead.id}`
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.margin-card {
  margin-top: 30px;
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
  padding: 30px 40px 60px 40px;
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
.loading {
  font-size: 14px;
  opacity: 0.5;
}
::placeholder {
  color: #233348;
  opacity: 0.7;
}
:-ms-input-placeholder {
  color: #233348;
  opacity: 0.7;
}
::-webkit-input-placeholder {
  color: #233348;
  opacity: 0.7;
} /* WebKit */
::-moz-placeholder {
  color: #233348;
  opacity: 0.7;
}
.title {
  font-weight: 500;
  font-size: 18px;
}
.sub-title {
  font-weight: 400;
  font-size: 16px;
}
textarea {
  display: block !important;
  height: 60% !important;
  color: #000 !important;
  width: 100% !important;
  border: 1px solid #505755;
  border-radius: 8px;
  padding: 11px 20px !important;
  box-sizing: border-box !important;
  font-weight: 400 !important;
  font-size: 14px !important;
  resize: none;
}
.b-form-tag {
  font-size: 16px !important;
}
.form-control {
  border: 1px solid #505755 !important;
  border-radius: 8px !important;
}
</style>
