<template>
  <b-card
    class="shadow"
    no-body
  >
    <b-card-body class="d-flex flex-column" :class="cargardata ? 'cardDespues' : 'cardAntesCarga'">
      <div class="d-flex justify-content-between">
        <b-card-title title-tag="h6">
          Estadísticas
        </b-card-title>
        <div class="d-flex options">
          <p
            :class="[{ active: chartType=== 'statics_uf' }, 'mr-2']"
            @click="chartType = 'statics_uf'"
          >
            Cantidad de {{ Names.moneda }}
          </p>
          <p
            :class="[{ active: chartType==='statics_business' }]"
            @click="chartType = 'statics_business'"
          >
            Cantidad de negocios
          </p>
        </div>
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
          <bar :chart-data="chart" />
        </div>
      </template>
    </b-card-body>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'
import Bar from '@/components/dashboard/Bar.js'
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
    Bar
  },
  props: {
    cargardata: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      chartType: 'statics_uf',
      chart: {
        labels: [],
        datasets: [{ data: [] }, { data: [] }]
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
        console.log('dataset1',dataset1)
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
      top: 20px;
      width: 95%;
    }
  }
}
.cardAntesCarga {
  opacity: 0.1;
}
.cardDespues {
  opacity: 1;
}
</style>
