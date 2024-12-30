<template>
  <b-card
    class="shadow"
    no-body
  >
    <b-card-body class="d-flex flex-column" :class="cargardata ? 'cardDespues' : 'cardAntesCarga'">
      <div class="d-flex justify-content-between">
        <b-card-title title-tag="h6">
          Performance
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
          <bar2 :chart-data="chart" />
        </div>
      </template>
    </b-card-body>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'
import Bar2 from '@/components/dashboard/Bar2.js'
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
  components: {
    Bar2
  },
  props: {
    cargardata: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      chartType: 'performance',
      typedata: 'sales',
      chart: {
        labels: [],
        datasets: []
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
        type: this.chartType,
        channel: this.leadsFilters.channelDashboard,
        referido: this.leadsFilters.refferal,
        type_sale: this.leadsFilters.tipoVentaDashboard
      }
      if (this.leadsFilters.id) { payload.user = this.leadsFilters.id }
      return payload
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
    //this.updateChart = debounce(this.getChart, 2000)
    //this.updateChart()
    if (this.cargardata) {
      this.updateChart = debounce(this.getChart, 2000)
      this.updateChart()
    }
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
        let { data: { labels, datasets } } = await this.$simpleeApi.post('/chart/', this.payload)
        /*console.log('labels Original', labels)
        console.log('datasets Originals', datasets)*/
        if (this.Names.moneda=='PESOS'){
            datasets = datasets.map(dataset => {
              if (dataset.label.includes('UF')) {
                dataset.label = dataset.label.replace('UF', '$')
              }
              return dataset
            })
        }
        this.chart = {
          'labels': labels,
          'datasets': datasets
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
      color: #acacac;
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
