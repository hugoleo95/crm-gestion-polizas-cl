<template>
  <b-card class="shadow" no-body>
    <b-card-body class="d-flex flex-column" :class="cargardata ? 'cardDespues' : 'cardAntesCarga'">
      <div class="d-flex justify-content-between">
        <b-card-title title-tag="h6">
          Productos
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
        <div class="position-relative my-2 mh-75">
          <doughtnut
            :chart-data="chart"
            :options="{
              legend: {
                position: 'bottom',
                align: 'left',
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
        asistencias: 'Asistencias',
        garantia: 'Garantia',
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
        asistencias: 'Asistencias',
        seguro_de_garantia_digital_publica: 'Seguro De Garantia Digital Publica',
        seguro_de_incendio_sismo_y_robo_digital: 'Seguro De Incendio Sismo Y Robo Digital',
        seguro_de_garantia_fondos: 'Seguro De Garantia Fondos',
        seguro_de_garantia_publica: 'Seguro De Garantia Publica',
        seguro_de_garantia_digital_privada: 'Seguro De Garantia Digital Privada',
        seguro_de_garantia_privada: 'Seguro De Garantia Privada',
        seguro_de_responsabilidad_civil_digital: 'Seguro De Responsabilidad Civil Digital',
      },
      groupsmx: {
        diagnostico_de_riesgo: 'Diagnostico De riesgo',
        seguro_colectivo_de_salud: 'Seguros de Salud',
        seguro_de_accidentes_personales: 'Seguro De Accidentes Personales',
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
        asistencias: 'Asistencias',
        seguro_de_garantia : 'Seguro de Garantía',
        seguro_de_garantia_digital_publica: 'Seguro de Garantía Digital Pública',
        seguro_de_garantia_fondos: 'Seguro de Garantía Fondos',
        seguro_de_garantia_publica: 'Seguro de Garantía Pública',
        seguro_de_incendio_sismo_y_robo: 'Seguro de Incendio, Sismo y Robo',
        seguro_de_incendio_sismo_y_robo_digital: 'Seguro de Incendio, Sismo y Robo Digital',
        seguros_para_la_ingenieria: 'Seguros para la Ingeniería'
      },
      groups: [],
      products: {},
      colors: {
        asistencias: '#233348',
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
  },
  watch: {
    payload () {
      this.loading = true
      this.updateChart = debounce(this.getChart, 2000)
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
        let {
          data: { labels, data }
        } = await this.$simpleeApi.post('/chart/', this.payload)
        /*console.log(this.payload, labels, data, this.chartType);
        console.log('labels', labels);
        console.log('data', data);*/
        if (this.chartType !== 'policies') {
          /*const simbolos = '0123456789ABCDEF'
          const letcolorsgroup = {}
          for (const [key, value] of Object.entries(this.groups)) {
            let color = '#'
            for (let j = 0; j < 6; j++) {
              color = color + simbolos[Math.floor(Math.random() * 16)]
            }
            letcolorsgroup[key] = color
          }
          this.letcolorsgroup = letcolorsgroup*/
          const backgroundColor = [
            {
            key: 'seguro_de_accidentes_personales',
            color: '#bbbcff'
            },
            {
            key: 'seguro_de_accidentes_personales_digitales',
            color: '#fd7979'
            },
            {
            key: 'asistencias',
            color: '#f4b460'
            },
            {
              key: 'otros_seguros',
              color: '#f4b450'
            },
            {
            key: 'diagnostico_de_riesgo',
            color: '#c5ffe4'
            },
            {
            key: "seguro_de_garantiaseguro_de_garantia",
            color: '#00FFFF'
            },
            {
            key: "seguro_de_garantia_digital_publica",
            color: '#76c4ff'
            },
            {
            key: "seguro_de_garantia_publica",
            color: '#0ebdf5'
            },
            {
            key: "seguro_de_incendio_sismo_y_robo",
            color: '#00cc99'
            },
            {
            key: "seguro_de_incendio_sismo_y_robo_digital",
            color: '#00cc99'
            },
            {
            key: "seguro_de_responsabilidad_civil_profesional",
            color: '#fad500'
            },
            {
            key: "seguro_de_responsabilidad_civil_empresarial",
            color: "#ffff99"
            },
            {
            key: "seguro_colectivo_de_salud",
            color: '#00fcbd'
            },
            {
            key: "seguros_para_la_ingenieria",
            color: '#7673ff'
            },
            {
            key: "seguro_de_transporte_y_carga",
            color: '#027afa'
            },
            {
            key: "seguro_de_vehiculos",
            color: '#FF4500'
            },
            {
              key: "seguro_de_garantia_digital_privada",
              color: '#ffb3b3'
            },
            {
              key: "seguro_de_garantia_fondos",
              color: '#ffcc99'
            },
            {
              key: "seguro_de_garantia_privada",
              color: '#5c667f'
            },
            {
              key: "seguro_de_responsabilidad_civil_digital",
              color: '#ccffcc'
            },
            {
              key: "seguro_de_garantia",
              color: '#00FFFF'
            },
            {
              key: "seguro_de_danos",
              color: '#ccffff'
            }
          ];

          const colors = {};
          backgroundColor.forEach(item => {
            /*if (item.key === 'anywhere') {
            item.colors.forEach(color => {
              colors[color] = color;
            });
            } else {*/
              colors[item.key] = item.color;
            //}
          });
          const labelTexts2 = this.groups
          //console.log('colors', colors);
          this.chart = {
            labels: labels.map(v => labelTexts2[v]),
            datasets: [{
              data: data,
              backgroundColor: labels.map(v => colors[v])
            }]
          };
          //console.log('chart modificado', this.chart)
        }else {
          const colors = this.colors
          const labelTexts = this.lines
          this.chart = {
            labels: labels.map(v => labelTexts[v]),
            datasets: [{ data, backgroundColor: labels.map(v => colors[v]) }]
          }
        }
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
