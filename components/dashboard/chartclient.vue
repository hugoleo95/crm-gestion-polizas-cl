<template>
  <b-card class="shadow" no-body>
    <b-card-body class="d-flex flex-column align-content-between">
      <div v-if="loading" class="d-flex flex-fill h-100">
        <div class="text-center text-primary pa-5 mx-auto my-auto">
          <b-spinner class="align-middle" />
          <strong>Cargando...</strong>
        </div>
      </div>
      <template v-else>
        <div class="d-flex">
          <b-card-title title-tag="h5">
            Estadisticas del Cliente
          </b-card-title>
        </div>
        <div class="d-flex">
            <div :class="{'op-btn-active': typeShow === 'Solicitudes', 'op-btn': typeShow !== 'Solicitudes'}" @click="cambiarMostrar('Solicitudes')">Solicitudes</div>
            <div :class="{'op-btn-active': typeShow === 'Productos', 'op-btn': typeShow !== 'Productos'}" @click="cambiarMostrar('Productos')">Productos</div>
            <div :class="{'op-btn-active': typeShow === 'StatePo', 'op-btn': typeShow !== 'StatePo'}" @click="cambiarMostrar('StatePo')">Estados Pólizas</div>
        </div>
        <div v-if="typeShow === 'Solicitudes'">
          <b-card-title title-tag="h6">
            Solicitudes Totales {{ totalRequests }}
          </b-card-title>
          <div class="position-relative my-auto">
            <doughtnut
              :chart-data="chartRequest"
              :options="{
                legend: {
                  position: 'bottom',
                  align: 'center',
                  labels: {
                    fontFamily: 'Rubik',
                    filter: (legendItem, data) =>
                      data.datasets[0].data[legendItem.index] !== 0,
                  },
                },
              }"
            />
          </div>
        </div>
        <div v-else-if="typeShow === 'Productos'">
          <b-card-title title-tag="h6">
            Productos Totales {{ totalProducts }}
          </b-card-title>
          <div class="position-relative my-auto">
            <doughtnut
              :chart-data="chartProduct"
              :options="{
                legend: {
                  position: 'bottom',
                  align: 'center',
                  labels: {
                    fontFamily: 'Rubik',
                    filter: (legendItem, data) =>
                      data.datasets[0].data[legendItem.index] !== 0,
                  },
                },
              }"
            />
          </div>
        </div>
        <div v-else-if="typeShow === 'StatePo'">
          <div class="position-relative my-auto">
            <doughtnut
              :chart-data="chartStatePo"
              :options="{
                legend: {
                  position: 'bottom',
                  align: 'center',
                  labels: {
                    fontFamily: 'Rubik',
                    filter: (legendItem, data) =>
                      data.datasets[0].data[legendItem.index] !== 0,
                  },
                },
              }"
            />
          </div>
        </div>
        
      </template>
    </b-card-body>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'
import Doughtnut from '@/components/dashboard/Doughtnut.js'
/* eslint-disable vue/require-prop-types */
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
  name: 'Channels',
  components: { Doughtnut },
  props: {
    idlead: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      typeShow: 'Solicitudes',
      chartRequest: {
        labels: [],
        datasets: [{ data: [] }]
      },
      chartProduct: {
        labels: [],
        datasets: [{ data: [] }]
      },
      chartStatePo: {
        labels: [],
        datasets: [{ data: [] }]
      },
      data: [{}],
      total: 0,
      loading: true,
      perPage: 8,
      currentPage: 1,
      totalRequests: 0,
      totalProducts: 0,
      letcolorsgroup: {},
      groups: []
    }
  },
  computed: {
    ...mapState(['leadsFilters']),
    payload () {
      const payload = {
        start: this.leadsFilters.startDate,
        end: this.leadsFilters.endDate,
        type: 'client_stats',
        lead: this.idlead
      }
      if (this.leadsFilters.id) {
        payload.user = this.leadsFilters.id
      }
      return payload
    },
    paginatedData () {
      const { currentPage, perPage } = this
      return this.data.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
      )
    }
  },
  watch: {
    payload () {
      this.loading = true
      this.updateChart = debounce(this.getChart, 2000)
      this.updateChart()
    }
  },
  mounted () {
    if (process.env.version === 'CL') {
      this.groups = this.groupscl
    } else {
      this.groups = this.groupsmx
    }
    this.updateChart = debounce(this.getChart, 2000)
    this.updateChart()
  },
  methods: {
    percentage (count, total) {
      if (count <= 0 || total <= 0) {
        return 0
      } else {
        return ((count / total) * 100).toFixed(2)
      }
    },
    cambiarMostrar (type) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 350);
      this.typeShow = type
    },
    async getChart () {
      try {
        const {
          data: { request, products, products_valid_groups }
        } = await this.$simpleeApi.post('/chart/', this.payload)
        const backgroundColors = [
          '#00FFFF',
          '#00cc99',
          '#f4b460',
          '#c5ffe4',
          '#bbbcff',
          '#76c4ff',
          '#0ebdf5',
          '#fd7979',
          '#fad500',
          '#00fcbd',
          '#7673ff',
          '#027afa',
          '#FF4500',
          '#5c667f',
          '#ffb3b3',
          '#ffcc99',
          '#ffff99',
          '#ccffcc',
          '#ccffff',
          '#99ccff',
          '#ff99cc',
          '#ffccff',
          '#ccccff',
          '#ff6666',
          '#ff9966',
          '#ffb6c1',
          '#ffa07a',
          '#ffdab9',
          '#e6e6fa',
          '#d8bfd8',
          '#dda0dd',
          '#b0e0e6',
          '#afeeee',
          '#98fb98',
          '#f0e68c',
        ]
        /*console.log('getChart')
        console.log(this.payload)
        console.log(request)
        console.log(products)
        console.log(products_valid_groups)*/

        const totalRequests = request.reduce(
          (sum, current) => sum + current[1],
          0
        )
        this.totalRequests = totalRequests
        const labelsOriginal = request.map(item => item[0])
        const numbers = request.map(item => item[1])
        const labelMapping = {
          cliente_cerrado: 'Cerrado',
          en_espera_de_confirmacion: 'Espera de confirmación',
          en_espera_de_precio: 'Espera de precio',
          en_espera_de_informacion_cliente: 'Espera de informacion',
          en_licitacion: 'En licitación',
          sin_contactar: 'Sin contactar',
          null: 'Sin estado',
          perdido: 'Perdido',
          resuelto: 'Resuelto',
          cliente_no_aplica: 'Cliente no aplica',
          derivado_a_kam: 'Derivado a KAM',
          en_espera_de_pago: 'Espera de Pago'
        }
        let labels = labelsOriginal.map(label => labelMapping[label] || label)
        const chartRequest = {
          labels,
          datasets: [{ data: numbers, backgroundColor: backgroundColors }]
        }
        this.chartRequest = Object.assign({}, chartRequest)


        const totalProducts = products.reduce(
          (sum, current) => sum + current[1],
          0
        )
        this.totalProducts = totalProducts
        const labelsOriginalProduct = products.map(item => item[0])
        const numbersProduct = products.map(item => item[1])
        const labelMappingProduct = {
          risk_diagnostic: 'Diagnóstico De Riesgo',
          ap_digital: 'AP Digital',
          ap_colectivo: 'AP Colectivo',
          ap_individual: 'AP Individual',
          ap_mas_vida_guardia: 'AP + Vida Guardias',
          rc_empresas_digital: 'RC Digital Empresas',
          rc_mercosur: 'RCI Mercosur',
          rc_mop_digital: 'RC Digital MOP',
          rc_construccion_digital: 'RC Digital Construcción',
          rc_empresas: 'RC Empresa',
          rc_construccion: 'RC Construcción',
          rc_medica: 'RC Médica',
          rc_profesional: 'RC Profesional',
          rc_drone: 'RC Drone',
          d_and_o: 'RC D&O',
          rc: 'RC(Producto antiguo)',
          rc_mal_praxis: 'RC Mal Praxis (Producto antiguo)',
          todo_riesgo_de_construccion: 'Todo Riesgo De Construcción',
          equipo_movil: 'Equipo Movil',
          trc: 'TRC (Producto antiguo)',
          vehiculos_pesados: 'Vehiculos Pesados',
          vehiculos_livianos: 'Vehículo Liviano',
          flota_vehiculos: 'Flota Vehiculos',
          moto: 'Motocicletas',
          automovil: 'Automovil (Producto antiguo)',
          property: 'Property',
          seguro_pyme: 'Pyme',
          minipyme: 'Minipyme',
          hogar: 'Hogar (Producto antiguo)',
          incendio: 'Incendio (Producto antiguo)',
          carga_anual: 'Carga Anual',
          carga_unica: 'Carga Única',
          transporte_terrestre: 'Transporte Terrestre (Producto antiguo)',
          asiento_pasajero: 'Asiento De Pasajeros',
          vida_conductor: 'Vida Conductor',
          espacios_comunes: 'Condominio / Espacios Comunes',
          complementario_salud_individual: 'Complementario Salud Individual',
          asistencia_viaje: 'Asistencia En Viaje',
          asistencia_telemedicina: 'Asistencia Telemedicina',
          condominio: 'Condominio (Producto antiguo)',
          arriendo: 'Arriendo (Producto antiguo)',
          vida_tradicional: 'Vida Tradicional',
          apv: 'APV (Producto antiguo)',
          colectivo_vida: 'Colectivo Vida (Producto antiguo)',
          colectivo_salud: 'Colectivo De Salud',
          colectivo_salud_bci: 'Colectivo De Salud BCI',
          salud: 'Salud (Producto antiguo)',
          seguro_covid: 'Seguro COVID (Producto antiguo)',
          garantia_publica: 'Garantía Pública (Producto antiguo)',
          garantia_privada: 'Garantía Privada (Producto antiguo)',
          seriedad_oferta: 'Seriedad de oferta',
          fiel_cumplimiento: 'Fiel Cumplimiento',
          correcto_uso: 'Correcto Uso de Anticipo',
          otras_garantias: 'Otras Garantías',
          seguro_de_credito: 'Seguro de Crédito ',
          garantia_corfo: 'Garantía CORFO (Producto antiguo)',
          garantia_sercotec: 'Garantía SERCOTEC (Producto antiguo)',
          garantia: 'Garantía (Producto antiguo)'
        }
        //console.log(labelsOriginalProduct)
        labels = labelsOriginalProduct.map(label => labelMappingProduct[label] || label)
        const chartProduct = {
          labels,
          datasets: [{ data: numbersProduct, backgroundColor: backgroundColors }]
        }
        this.chartProduct = Object.assign({}, chartProduct)
        

        const labelStates = products_valid_groups.map(item => item[0])
        const numbersStates = products_valid_groups.map(item => item[1])
        const labelMap = {
          valid : 'Vigente'
        }
        labels = labelStates.map(label => labelMap[label] || label)
        const chartStatePolizas = {
          labels,
          datasets: [{ data: numbersStates, backgroundColor: backgroundColors }]
        }
        this.chartStatePo = Object.assign({}, chartStatePolizas)

      } catch (error) {
        console.log(error)
        this.$store.commit('setAlertMessage', error.response.data)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
// * {
//   outline: 1px solid red;
// }
.op-btn-active {
  padding: 0;
  width: 4.5rem;
  cursor: pointer;
  background-color: transparent;
  border: none;
  float: right;
  width: auto;
  margin-right: 2rem;
  margin-bottom: 20px;
  font-weight: 600;
  color: #00cc99;
  text-decoration: underline;
}
.op-btn {
  padding: 0;
  width: 4.5rem;
  cursor: pointer;
  background-color: transparent;
  border: none;
  float: right;
  width: auto;
  margin-right: 2rem;
  margin-bottom: 20px;
  font-weight: 600;
}

.percentage {
  font-size: 0.95rem;
  color: #acacac;
  font-weight: 300;
  line-height: 17px;
}
.channel-name {
  font-style: normal;
  font-weight: 300;
  font-size: 0.95rem;
  padding: 0;
  margin: 8px 0;
}
</style>
