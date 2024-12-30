
<template>
  <b-card
    class="shadow"
    no-body
  >
    <b-card-body class="d-flex flex-column" :class="cargardata ? 'cardDespues' : 'cardAntesCarga'">
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
        <b-card-title title-tag="h6">
          <div class="d-flex">
            <span class="w-50 text-left">{{ title }}</span>
            <tool-tip
              class="tooltiposition d-flex align-items-center ml-2"
              placement="topleft"
              text="Todas la solicitudes son filtradas por la fecha de creacion, exceptuando las que tienen estado Cliente Cerrado, que son filtrado por su fecha de cierre."
              new-class="span-right"
            />
            <!--<span class="w-50 text-right"> {{ TotalSolitudes }} </span>-->
          </div>
        </b-card-title>
        <div class="position-relative  my-auto">
          <doughtnut
            :chart-data="chart"
            :options="{
              legend:{position:'bottom',align:'center',
                      labels: {
                        fontFamily: 'Rubik',
                        filter: (legendItem, data) => data.datasets[0].data[legendItem.index] !== 0
                      }}, }"
          />
        </div>
      </template>
    </b-card-body>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'
import Doughtnut from '@/components/dashboard/Doughtnut.js'
import { loading } from '~/nuxt.config'
import ToolTip from '~/components/base/tooltip.vue'
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
    Doughtnut,
    ToolTip
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    cargardata: {
      type: Boolean,
      default: false
    },
    chart: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    },
    TotalSolitudes: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      /*chart: {
        labels: [],
        datasets: [{ data: [] }]
      },
      loading: false,
      TotalSolitudes: 0*/
    }
  },
  computed: {
    ...mapState(['leadsFilters']),
    payload () {
      const payload = {
        start: this.leadsFilters.startDate,
        end: this.leadsFilters.endDate,
        type: 'states',
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
      this.updateChart = debounce(this.getChart, 2000)
      this.updateChart()
    },
    cargardata (newVal) {
      if (newVal) {
        this.loading = true
        /*this.updateChart = debounce(this.getChart, 2000)
        this.updateChart()*/
      }
    }
  },
  mounted () {
    if (this.cargardata) {
      /*this.updateChart = debounce(this.getChart, 2000)
      this.updateChart()*/
    }
  },
  methods: {
    async getChart () {
      try {
        const { data: { labels, data } } = await this.$simpleeApi.post('/chart/', this.payload)
        const backgroundColor = [
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
        this.chart = {
          labels,
          datasets: [{ data, backgroundColor }]
        }
        let sumaTotalSolicitudes = 0;
        for (let i = 0; i < data.length; i++) {
          sumaTotalSolicitudes += data[i];  
        }
        this.TotalSolitudes = sumaTotalSolicitudes;
      } catch (error) {
        console.log(error)
        this.$store.commit('setAlertMessage', error.response.data)
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
