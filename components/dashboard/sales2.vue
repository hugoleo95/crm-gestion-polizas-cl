<template>
  <b-card
    class="shadow"
    no-body
  >
    <b-card-body class="d-flex flex-column ">
      <div class="d-flex justify-content-between">
        <b-card-title title-tag="h6">
          Ventas Globales Por Tipo de Producto
        </b-card-title>
      </div>
      <div
        v-if="loading"
        class="d-flex flex-fill h-100"
      >
        <div class="text-center text-primary pa-5 mx-auto my-auto ">
          <b-spinner class="align-middle" />
          <strong>Cargando...</strong>
        </div>
      </div>
      <template v-else>
        <div class="position-relative  my-auto prueba mh-75">
          <linea :chart-data="chart" />
        </div>
      </template>
    </b-card-body>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'
import Linea from '@/components/dashboard/Line.js'
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
  components: {
    Linea
  },
  data () {
    return {
      chartType: 'chartsales',
      chart: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ],
        datasets: [
          {
            label: 'Renta nacional',
            backgroundColor: '#f87979',
            borderColor: '#f87979',
            data: [40, 55, 45, 70, 65, 90, 85, 110, 105, 130, 125, 150],
            fill: false
          },
          {
            label: 'Sura',
            backgroundColor: '#9DD345',
            borderColor: '#9DD345',
            data: [20, 35, 25, 50, 45, 70, 65, 90, 85, 110, 105, 130],
            fill: false
          },
          {
            label: 'Zurich',
            backgroundColor: '#F07F28',
            borderColor: '#F07F28',
            data: [10, 25, 15, 40, 35, 60, 55, 80, 75, 100, 95, 120],
            fill: false
          },
          {
            label: 'Maxxa',
            backgroundColor: '#EA1051',
            borderColor: '#EA1051',
            data: [5, 20, 10, 35, 30, 55, 50, 75, 70, 95, 90, 115],
            fill: false
          }
        ]
      },
      loading: false,
      NamesCL: {
        moneda: 'UF'
      },
      NamesMX: {
        moneda: 'PESOS'
      },
      Names: ''
    }
  },
  computed: {
    ...mapState(['leadsFilters']),
    payload () {
      const payload = {
        start: this.leadsFilters.startDate,
        end: this.leadsFilters.endDate,
        type: this.chartType
      }
      if (this.leadsFilters.id) { payload.user = this.leadsFilters.id }
      return payload
    }
  },
  watch: {
    payload () {
      this.loading = true
      // this.updateChart()
    }
  },
  mounted () {
    // this.updateChart = debounce(this.getChart, 2000)
    // this.updateChart()
  },
  created () {
    if (process.env.version === 'CL') {
      this.Names = this.NamesCL
    } else {
      this.Names = this.NamesMX
    }
  },
  methods: {
    async getChart () {
      try {
        const { data: { labels, data } } = await this.$simpleeApi.post('/chart/', this.payload)
        const dataset1 = { data, backgroundColor: data.map(_x => '#233348') }
        const dataset2 = { data: data.map(x => Math.max(...data) - x), backgroundColor: data.map(_x => '#E1E1E1') }
        this.chart = {
          labels,
          datasets: [
            dataset1,
            dataset2
          ]
        }
      } catch (error) {
        console.log(error)
        this.$store.commit('setAlertMessage', error.response.data)
      }
      this.loading = false
    }
  }
}
</script>

  <style lang="scss">
  .options {
    p {
      text-transform: uppercase;
      font-family: Rubik;
      font-style: normal;
      font-size: 14px;
      line-height: 18px;
      color: #233348;
      position: relative;
      display: grid;
      grid-template-areas: "hero";
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &.active {
        color: var(--primary);
      }
      &.active::after {
        border-bottom: 1px solid var(--primary);
        content: "";
        grid-area: hero;
        margin-left: auto;
        margin-right: auto;
        position: relative;
      }
    }
  }
  </style>
