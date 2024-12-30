example2<template>
  <b-card
    class="shadow"
    no-body
  >
    <b-card-body class="d-flex flex-column ">
      <div class="d-flex justify-content-between">
        <b-card-title title-tag="h6">
          Desempeño de los seguros digitales (Pruebas)
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
          <div id="chart">
            <apexchart type="bar" height="350" :options="chartOptions" :series="series" />
          </div>
        </div>
      </template>
    </b-card-body>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'
import VueApexCharts from 'vue-apexcharts'
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
    apexchart: VueApexCharts
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
      series: [{
        name: 'Renta Nacional',
        data: [44, 55, 41, 67, 22, 43]
      }, {
        name: 'Sura',
        data: [13, 23, 20, 8, 13, 27]
      }, {
        name: 'Zurich',
        data: [11, 17, 15, 15, 21, 14]
      }, {
        name: 'Maxxa',
        data: [21, 7, 25, 13, 22, 8]
      }],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: true
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 10,
            borderRadiusApplication: 'end', // 'around', 'end'
            borderRadiusWhenStacked: 'last', // 'all', 'last'
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: '13px',
                  fontWeight: 900
                }
              }
            }
          }
        },
        xaxis: {
          type: 'datetime',
          categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT',
            '01/05/2011 GMT', '01/06/2011 GMT'
          ]
        },
        legend: {
          position: 'right',
          offsetY: 40
        },
        fill: {
          opacity: 1
        }
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
          top: 20px;
          width: 95%;
        }
      }
    }
    </style>
