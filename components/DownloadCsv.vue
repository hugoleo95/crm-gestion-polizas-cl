
<template>
  <div class="position-relative">
    <b-spinner
      v-if="loading"
      small
      class="position-absolute text-secondary"
      style="left: .75rem; top: .75rem; z-index: 999; font-size: .85rem"
    />
    <fa-icon
      v-else
      class="position-absolute text-secondary"
      style="left: .75rem; top: .80rem; z-index: 999; font-size: .85rem"
      :icon="['fas', 'download']"
    />
    <b-dropdown
      ref="dropdown"
      variant="light"
      toggle-class="text-dropdown"
      class="shadow-dropdow h-100"
      no-caret
    >
      <template #button-content>
        <div class="pl-4 d-flex align-items-center">
          {{ loading ? `${parseInt(progress)}%` : 'Exportar' }}
        </div>
      </template>
      <b-dropdown-form>
        <!--Paginas {{ downloadPages }}/{{ pages }}
        <b-form-input
          v-model.number="downloadPages"
          :min="1"
          :max="pages"
          :disabled="loading"
          type="text"
          variant="primary"
          placeholder="Paginas"
          class="w-100"
        />
        -->
        <span>Zona horaria</span>
        <b-form-select
          v-model="timezone"
          class="mb-3"
        >
          <b-form-select-option value="cl">Chile</b-form-select-option>
          <b-form-select-option value="mx">Mexico</b-form-select-option>
          <b-form-select-option value="ve">Venezuela</b-form-select-option>
        </b-form-select>
        <b-button
          variant="primary"
          class="text-white mb-2"
          block
          :disabled="loading"
          @click="$emit('generate-csv',timezone)"
        >
          Enviar csv
        </b-button>

        <vue-json-to-csv
          v-if="leads && leads.length > 0"
          :json-data="jsonData"
          :csv-title="fileTitle"
          :labels="labels"
        >
          <b-button
            ref="csvDownloadBtn"
            block
            variant="primary"
            class="text-white"
            @click="clearCsvInfo"
          >
            Descargar
          </b-button>
        </vue-json-to-csv>
      </b-dropdown-form>
    </b-dropdown>
  </div>
</template>

<script>
import VueJsonToCsv from 'vue-json-to-csv'
/* eslint-disable camelcase */

export default {
  name: 'DownloadCsv',
  components: {
    VueJsonToCsv
  },
  props: {
    leads: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false,
      required: true
    },
    count: {
      type: Number,
      required: true
    },
    progress: {
      type: Number,
      required: true
    },
    filename: {
      type: String,
      default: 'clientes'
    },
    crm: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      show: false,
      labels: {
        name: { title: 'Nombre' },
        last_name: { title: 'Apellido' },
        razon_social: { title: 'Razón social' },
        rut: { title: 'RUT' },
        person: { title: 'Persona' },
        email: { title: 'Correo' },
        phone: { title: 'Télefono' },
        channel: { title: 'Canal' },
        created_at: { title: 'Fecha de contacto' },
        state: { title: 'Estado' },
        giro: { title: 'Giro' },
        address: { title: 'Dirección' },
        comuna: { title: 'Comuna' },
        executive: { title: 'Ejecutiv@' },
        referred: { title: 'Referido' }, // ---------------
        productName: { title: 'Producto' },
        line: { title: 'Linea' },
        company: { title: 'Compañia' },
        prima: { title: 'Prima' },
        comision: { title: 'Comision' },
        comision_final: { title: 'Comision Final' },
        nro_poliza: { title: 'N Poliza' },
        emited_date: { title: 'Fecha de emisión' },
        fecha_inicio_vigencia: { title: 'Fecha de  inicio de vigencia' },
        fecha_termino_vigencia: { title: 'Fecha de  inicio de vigencia' },
        tipo_de_pago: { title: 'Tipo de pago' },
        description: { title: 'Descripción' }
      },
      downloadPages: 1,
      executive2: ''
    }
  },
  computed: {
    start () {
      return this.$store.state.leads.startTime
    },
    end () {
      return this.$store.state.leads.endTime
    },
    jsonData () {
      if (this.leads.length < 1) {
        return []
      }

      const channels = [
        'Formulario sitio web',
        'Julieta Chatbot',
        'Número en header sitio web',
        'Flujo de compra RC',
        'Directo',
        'Referido',
        'Landing SeguroGarantia.cl',
        'Mercado publico'
      ]

      const leads = []

      this.leads.forEach((l) => {
        const lead = {
          name: this.formatColum(l.name),
          last_name: this.formatColum(l.last_name),
          razon_social: this.formatColum(l.razon_social),
          rut: this.formatColum(l.rut),
          person: this.formatColum(l.person),
          email: this.formatColum(l.email),
          phone: this.formatColum(l.phone),
          giro: this.formatColum(l.giro),
          state: this.formatColum(l.state),
          address: this.formatColum(l.address),
          comuna: this.formatColum(l.comuna),
          executive: this.formatColum(l.executive),
          channel: this.formatColum(l.channel),
          created_at: this.formatColum(l.created_at)
        }

        if (l.products?.length > 0) {
          l.products.forEach((p) => {
            leads.push({
              ...lead,
              productName: this.formatColum(p.name),
              line: this.formatColum(p.line),
              company: this.formatColum(p.company),
              prima: this.formatColum(p.prima),
              comision: this.formatColum(p.comision),
              comision_final: this.formatColum(p.comision_final),
              nro_poliza: this.formatColum(p.nro_poliza),
              emited_date: this.formatColum(p.emited_date),
              fecha_inicio_vigencia: this.formatColum(p.fecha_inicio_vigencia),
              fecha_termino_vigencia: this.formatColum(p.fecha_termino_vigencia),
              tipo_de_pago: this.formatColum(p.tipo_de_pago),
              description: this.formatColum(p.description)
            })
          })
        } else {
          leads.push(lead)
        }
      })

      if (this.crm) { return leads }

      const modifiedLeads = [...leads.map((lead) => {
        const channel = lead.channel ? channels[lead.channel - 1] : 'Canal no creado aun'
        const created_at = new Date(lead.created_at).toLocaleDateString('en-CA')

        if (lead.products?.length !== 0) {
          this.executive2 = { ...this.$store.state.leads.users.find(({ id }) => id === lead.products[0]?.user) }
        } else {
          this.executive2 = { ...this.$store.state.leads.users.find(({ id }) => id === lead.user) }
        }

        let referred = this.$store.state.leads.refferals.find(({ id }) => id === lead.referred)
        const executive = this.executive2 ? this.executive2.first_name : 'Sin asignar'
        referred = referred && channel === 'Referido' ? referred.name : ''
        return {
          ...lead,
          channel,
          created_at,
          executive,
          referred
        }
      })] ?? []

      if (this.crm) { return modifiedLeads }

      return modifiedLeads.reduce((acc, curr) => {
        const { products, ...lead } = curr
        const rows = products.filter(({ emited_date }) => {
          if (!emited_date) { return false }
          const emitedTime = new Date(emited_date.replaceAll('-', '/')).getTime()
          return emitedTime >= this.start && emitedTime <= this.end
        }
        ).map((product) => {
          const is_renewal = product.is_renewal ? 'Si' : 'No'
          const comision = product.comision ? product.comision.toFixed(4).replace('.', ',') : 0
          const comision_final = product.comision_final ? product.comision_final.toFixed(4).replace('.', ',') : 0
          const prima = product.prima ? product.prima.toFixed(4).replace('.', ',') : 0
          return { ...lead, ...product, productName: product.name, is_renewal, name: lead.name, comision, comision_final, prima }
        })
        return [...acc, ...rows]
      }, [])
    },
    fileTitle () {
      return `${this.filename}-${new Date().toLocaleString('en-CA')}`
    },
    pages () {
      return Math.ceil(this.count / 25)
    }
  },
  watch: {
    leads: {
      handler (val) {
        if (val.length > 0) {
          this.downloadCsvAuto()
        }
      }
    }
  },
  methods: {
    formatColum: text => text ?? '',
    async downloadCsvAuto () {
      await new Promise(resolve => setTimeout(resolve, 500))
      this.$refs.csvDownloadBtn.click()
    },
    clearCsvInfo () {
      this.$emit('clearCsvInfo')
    }
  }
}
</script>

<style lang="scss"  scoped>
p {
  padding: 1rem;
}
</style>
