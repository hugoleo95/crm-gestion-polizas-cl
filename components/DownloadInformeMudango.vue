<template>
  <div class="position-relative">
    <fa-icon
      class="position-absolute text-secondary"
      style="left: .75rem; top: .80rem; z-index: 999; font-size: .85rem"
      :icon="['fas', 'envelope']"
    />
    <b-dropdown
      ref="dropdown"
      variant="light"
      toggle-class="text-dropdown"
      class="shadow-dropdow mr-4 w-100 h-100"
      no-caret
    >
      <template #button-content>
        <div style="padding-left: .85rem">
          Exportar Informe
        </div>
      </template>
      <b-dropdown-form class="w-full">
        <div v-if="step === 1">
          <label for="slider-pages">Selecciona el rango de fechas</label>
          <div class="d-flex flex-column p-1 mt-2">
            <div class="mb-2">
              <label class="mb-0">
                Fecha de inicio
              </label>
              <b-form-input
                v-model="start"
                type="date"
              />
            </div>
            <div>
              <label class="mb-0">
                Fecha de termino
              </label>
              <b-form-input
                v-model="end"
                type="date"
              />
            </div>
          </div>
          <b-button
            :disabled="!start || !end"
            variant="primary"
            class="text-white my-2"
            block
            @click="SendVentasInforme"
          >
            <b-spinner
              v-if="loading"
              class="align-middle mr-2"
              small
            />
            Enviar
          </b-button>
        </div>
      </b-dropdown-form>
    </b-dropdown>
  </div>
</template>
  
  <script>
import { mapState } from 'vuex'
import VueJsonToCsv from 'vue-json-to-csv'
/* eslint-disable camelcase */

export default {
  name: 'DownloadCsv',
  components: {
    VueJsonToCsv
  },
  data () {
    return {
      step: 1,
      pages: 1,
      start: null,
      end: null,
      executive: null,
      policiesCount: null,
      policies: [],
      loading: false,
      labels: {
        name: { title: 'Nombre' },
        nro_poliza: { title: 'Nro de Poliza' },
        nro_cuotas: { title: 'Nro de Cuotas' },
        state: { title: 'Estado' },
        prima: { title: 'Prima' },
        renewal_created_at: { title: 'Fecha de renovacion' },
        renewal_number: { title: 'Nro de renovacion' },
        new_policy_number: { title: 'Nuevo nro de poliza' },
        line: { title: 'Linea' },
        vigency: { title: 'Vigencia' },
        description: { title: 'Descripción' },
        tipo_de_pago: { title: 'Tipo de pago' },
        executive: { title: 'Ejecutiv@' },
        emited_date: { title: 'Fecha de emisión' },
        fecha_inicio_vigencia: { title: 'Fecha de  inicio de vigencia' },
        fecha_termino_vigencia: { title: 'Fecha de  inicio de vigencia' }
      }
    }
  },
  computed: {
    ...mapState('leads', ['userskam']),
    executivesOptions () {
      const options = this.userskam.filter(user => user.first_name).map((executive) => {
        return {
          value: executive.id,
          text: executive.first_name
        }
      })
      options.unshift({ value: null, text: 'General' })
      return options
    },
    jsonData () {
      if (this.policies.length > 0 && !this.loading) {
        const policies = []

        this.policies.forEach((policy) => {
          const policyData = {
            name: this.getCsvField(policy.name),
            nro_poliza: this.getCsvField(policy.nro_poliza),
            nro_cuotas: this.getCsvField(policy.nro_cuotas),
            state: this.getCsvField(policy.state),
            prima: this.getCsvField(policy.prima),
            renewal_created_at: this.getCsvField(policy?.renewals[0]?.created_at),
            renewal_number: this.getCsvField(policy?.renewals[0]?.renewal_nro),
            new_policy_number: this.getCsvField(policy?.renewals[0]?.new_police_nro),
            line: this.getCsvField(policy.line),
            vigency: this.getCsvField(policy.vigency),
            description: this.getCsvField(policy.description),
            tipo_de_pago: this.getCsvField(policy.tipo_de_pago),
            executive: this.getCsvField(policy.executive),
            emited_date: this.getCsvField(policy.emited_date),
            fecha_inicio_vigencia: this.getCsvField(policy.fecha_inicio_vigencia),
            fecha_termino_vigencia: this.getCsvField(policy.fecha_termino_vigencia)
          }
          if (policy?.renewals?.length > 0) {
            policy.renewals.forEach((renewal) => {
              policies.push({
                ...policyData,
                renewal_created_at: this.getCsvField(renewal?.created_at),
                renewal_number: this.getCsvField(renewal?.renewal_nro),
                new_policy_number: this.getCsvField(renewal?.new_police_nro)
              })
            })
          } else {
            policies.push(policyData)
          }
        })

        return policies
      } else {
        return []
      }
    },
    fileTitle () {
      return `Polizas (${this.start} - ${this.end})`
    },
    computedPages () {
      if (this.policiesCount) {
        return Math.ceil(this.policiesCount / 25)
      } else {
        return null
      }
    }
  },
  methods: {
    getCsvField: data => data ?? 'Indefinido',
    async consultPoliciesPerDate () {
      this.loading = true
      try {
        const res = await this.$simpleeApi.get('/product/', { params: { start: this.start, end: this.end } })
        this.policies = res.data.results
        this.policiesCount = res.data.count

        if (this.computedPages > 1) {
          this.step = 2
        } else {
          this.step = 3
        }
      } catch (error) {
        this.$store.commit('setAlertMessage', error.response.data)
      }
      this.loading = false
    },
    async SendVentasInforme () {
      this.loading = true
      try {
        const res = await this.$simpleeApiMudango.post('/export_mudango_reporte/', { start: this.start, end: this.end, emailUser: this.$store.state.localStorage.user.email })
        console.log(res)
        this.$store.commit('setAlertMessage', { success: 'El CSV fue enviado a su correo' })
      } catch (error) {
        this.$store.commit('setAlertMessage', error.response.data)
      }
      this.loading = false
    },
    async consultPoliciesPerDateAndPages () {
      this.loading = true
      const policies = []
      for (let i = 0; i < this.pages; i++) {
        const res = await this.$simpleeApi.get('/product/', { params: { start: this.start, end: this.end, page: i + 1 } })
        policies.push(...res.data.results)
      }
      this.policies = policies
      this.loading = false
      this.step = 3
    },
    clearState () {
      this.step = 1
      this.start = null
      this.end = null
      this.policies = []
      this.policiesCount = null
    }
  }
}
  </script>
  
  <style lang="scss"  scoped>
p {
  padding: 1rem;
}
.w-full {
  width: 15rem;
}
</style>
  