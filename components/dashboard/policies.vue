<template>
  <b-card class="shadow" no-body>
    <b-card-body class="d-flex flex-column" :class="cargardata ? 'cardDespues' : 'cardAntesCarga'">
      <div class="d-flex justify-content-between">
        <b-card-title title-tag="h6">
          Polizas
        </b-card-title>
        <div class="d-flex options">
          <p
            role="button"
            :class="[{ active: chartType === 'policies' }, 'mr-2']"
            @click="chartType = 'policies'"
          >
            Linea
          </p>
          <p
            role="button"
            :class="[{ active: chartType === 'policies_product' }]"
            @click="chartType = 'policies_product'"
          >
            Grupo Producto
          </p>
        </div>
      </div>
      <div v-if="loading" class="d-flex flex-fill h-100">
        <div class="text-center text-primary pa-5 mx-auto my-auto">
          <b-spinner class="align-middle" />
          <strong>Cargando...</strong>
        </div>
      </div>
      <template v-else>
        <div class="position-relative my-auto mh-75">
          <doughtnut
            :chart-data="chart"
            :options="{
              legend: {
                position: 'right',
                align: 'center',
                labels: {
                  filter: (item, data) =>
                    data.datasets[0].data[item.index] !== 0,
                },
              },
            }"
          />
        </div>
      </template>
    </b-card-body>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'
import Doughtnut from '@/components/dashboard/Doughtnut.js'
import productscl from '~/static/products.json'
import productsmx from '~/static/productsmx.json'

function debounce (fn, delay) {
  let timeoutID = null
  return function () {
    clearTimeout(timeoutID)
    const args = arguments
    const that = this
    timeoutID = setTimeout(function () {
      fn.apply(that, args)
    }, delay)
  }
}
export default {
  components: { Doughtnut },
  props: {
    cargardata: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      chartType: 'policies',
      chart: {
        labels: [],
        datasets: [{ data: [] }]
      },
      loading: false,
      letcolorsgroup: {},
      lines: {},
      linescl: {
        asistencia: 'Asistencia',
        garantia: 'Garantia',
        generales: 'Generales',
        vida: 'Vida',
        colectivo_vida: 'Colectivo',
        salud: 'Salud',
        danos: 'Daños',
        asistencias: 'Asistencias'
      },
      linesmx: {
        danos: 'Daños',
        affinity: 'affinity',
        asistencia: 'Asistencia',
        salud: 'Salud',
        generales: 'Generales',
        asistencias: 'Asistencias'
      },
      groupscl: {
        diagnostico_de_riesgo: 'Diagnostico De riesgo',
        seguro_de_accidentes_personales: 'Seguro De Accidentes Personales',
        seguro_de_responsabilidad_civil_profesional:
          'Seguro De Responsabilidad Civil Profesional',
        seguro_de_responsabilidad_civil_empresarial:
          'Seguro De Responsabilidad Civil para Empresas',
        seguros_para_la_ingenieria: 'Seguro Para La Ingeneria',
        seguro_de_vehiculos: 'Seguro De Vehiculos',
        seguro_de_incendio_sismo_y_robo: 'Seguro De Incendio, Sismo Y Robo',
        seguro_de_transporte_y_carga: 'Seguro De Transporte Y Carga',
        otros_seguros: 'Otros Seguros',
        seguro_colectivo_de_salud: 'Seguros de Salud',
        seguro_de_garantia: 'Seguro De Garantia',
        asistencias: 'Asistencias'
      },
      groupsmx: {
        seguro_de_responsabilidad_civil_profesional:
          'Seguro De Responsabilidad Civil Profesional',
        seguro_de_responsabilidad_civil_empresarial:
          'Seguro De Responsabilidad Civil para Empresas',
        seguro_de_danos: 'Seguro de Daños',
        seguro_de_transporte_y_carga: 'Seguro de Transporte de Mercancías',
        seguro_de_vehiculos: 'Seguro de Vehículos',
        seguro_de_proteccion_cibernetica: 'Seguro de Protección Cibernética',
        otros_seguros: 'Otros Seguros',
        seguro_colectivo_de_gastos_medicos_mayores: 'Seguros de Salud',
        affinity: 'Seguros para Personas',
        asistencias: 'Asistencias'
      },
      groups: [],
      products: {},
      colors: {
        asistencia: '#233348',
        danos: '#233348',
        garantia: '9DD345',
        generales: '#F07F28',
        vida: '#EB7E60',
        colectivo_vida: '#EA1051',
        salud: '#FFBD33'
      }
    }
  },
  computed: {
    ...mapState(['leadsFilters']),
    payload () {
      const payload = {
        start: this.leadsFilters.startDate,
        end: this.leadsFilters.endDate,
        type: this.chartType,
        channel: this.leadsFilters.channelDashboard,
        referido: this.leadsFilters.refferal,
        type_sale: this.leadsFilters.tipoVentaDashboard
      }
      if (this.leadsFilters.id) {
        payload.user = this.leadsFilters.id
      }
      return payload
    },
    productsColors () {
      const { colors } = this
      const unpackObject = (acc, [key, curr]) => ({
        ...acc,
        ...curr.reduce(
          (acc, { value }) => ({ ...acc, [value]: colors[key] }),
          {}
        )
      })
      return Object.entries(this.groups).reduce(unpackObject, {})
    },
    productsLabels () {
      return Object.values(this.groups).reduce(
        (acc, curr) => ({
          ...acc,
          ...curr.reduce((a, { text, value }) => ({ ...a, [value]: text }), {})
        }),
        {}
      )
    }
  },
  watch: {
    payload () {
      this.loading = true
      this.updateChart()
    },
    cargardata (newVal) {
      if (newVal) {
        this.loading = true
        this.updateChart = debounce(this.getChart, 2000)
        this.updateChart()
      }
    }
  },
  mounted () {
    if (process.env.version === 'CL') {
      this.products = productscl
      this.groups = this.groupscl
      this.lines = this.linescl
    } else {
      this.products = productsmx
      this.groups = this.groupsmx
      this.lines = this.linesmx
    }
    if (this.cargardata) {
      this.updateChart = debounce(this.getChart, 2000)
      this.updateChart()
    }
  },
  methods: {
    async getChart () {
      try {
        const {
          data: { labels, data }
        } = await this.$simpleeApi.post('/chart/', this.payload)
        // console.log(this.payload, labels, data, this.chartType);
        if (this.chartType !== 'policies') {
          const simbolos = '0123456789ABCDEF'
          const letcolorsgroup = {}
          for (const [key, value] of Object.entries(this.groups)) {
            // console.log(value, key);
            let color = '#'
            for (let j = 0; j < 6; j++) {
              color = color + simbolos[Math.floor(Math.random() * 16)]
            }
            // console.log(color);
            letcolorsgroup[key] = color
          }
          // console.log(letcolorsgroup);
          this.letcolorsgroup = letcolorsgroup
        }
        const colors =
          this.chartType === 'policies' ? this.colors : this.letcolorsgroup
        const labelTexts =
          this.chartType === 'policies' ? this.lines : this.groups
        const prueba = labels.map(v => colors[v])
        this.chart = {
          labels: labels.map(v => labelTexts[v]),
          datasets: [{ data, backgroundColor: labels.map(v => colors[v]) }]
        }
        // console.log(this.chart);
      } catch (error) {
        console.log(error)
        // this.$store.commit('setAlertMessage', error.response.data)
      }
      this.loading = false
    }
  }
}
</script>

<style>
.cardAntesCarga {
  opacity: 0.1;
}
.cardDespues {
  opacity: 1;
}
</style>
