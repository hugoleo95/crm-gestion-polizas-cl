
<template>
  <b-card
    class="shadow"
    no-body
  >
    <b-card-body class="d-flex flex-column align-content-between" :class="cargardata ? 'cardDespues' : 'cardAntesCarga'">
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
            <span class="w-50 text-left"> Canales de llegada</span>
            <tool-tip
              class="tooltiposition d-flex align-items-center ml-2"
              placement="topright"
              text="Filtra por fecha de creacion."
              new-class="span-left ToolTip2"
            />
            <span class="w-50 text-right"> {{ total }} </span>
          </div>
        </b-card-title>
        <div
          v-for="({count,name},key) in paginatedData"
          :key="key"
        >
          <p class="channel-name">
            {{ name }} - {{ count }}
          </p>
          <div class="d-flex justify-content-between align-items-center">
            <s-progress-bar
              :value="count"
              :max="total"
              width="75%"
              height="8px"
            />
            <span
              class="percentage"
              :title="`${count}/${total}`"
            >{{ percentage(count,total) }} %</span>
          </div>
        </div>
        <b-pagination
          v-if="data.length > 0"
          v-model="currentPage"
          pills
          class="mx-auto mt-auto"
          :total-rows="data.length"
          :per-page="perPage"
          size="sm"
        />
      </template>
    </b-card-body>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'
import SProgressBar from '../base/SProgressBar.vue'
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
  components: { SProgressBar, ToolTip },
  props: {
    cargardata: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      /*data: [{}],
      total: 0,
      loading: false,*/
      perPage: 8,
      currentPage: 1
    }
  },
  computed: {
    ...mapState(['leadsFilters']),
    payload () {
      const payload = {
        start: this.leadsFilters.startDate,
        end: this.leadsFilters.endDate,
        type: 'channels',
        channel: this.leadsFilters.channelDashboard,
        referido: this.leadsFilters.refferal,
        type_sale: this.leadsFilters.tipoVentaDashboard
      }
      if (this.leadsFilters.id) { payload.user = this.leadsFilters.id }
      return payload
    },
    paginatedData () {
      const { currentPage, perPage } = this
      return this.data.slice((currentPage - 1) * perPage, currentPage * perPage)
    }

  },
  watch: {
    payload () {
      this.loading = true
      this.updateChart = debounce(this.getChart, 2000)
      this.updateChart()
    },
    cargardata (newVal) {
      /*if (newVal) {
        this.loading = true
        this.updateChart = debounce(this.getChart, 2000)
        this.updateChart()
      }*/
    }
  },
  mounted () {
    if (this.cargardata) {
      this.updateChart = debounce(this.getChart, 2000)
      this.updateChart()
    }
  },
  methods: {
    percentage (count, total) {
      if (count <= 0 || total <= 0) { return 0 } else {
        return ((count / total) * 100).toFixed(2)
      }
    },
    async getChart () {
      try {
        const { data: { labels, data } } = await this.$simpleeApi.post('/chart/', this.payload)
        this.chart = {
          labels,
          data
        }
        this.data = labels.map((c, i) => ({ name: c, count: data[i] }))
        this.total = data.reduce((a, c) => a + c, 0)
      } catch (error) {
        console.log(error)
        console.log("error al get carga de channels")
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
.cardAntesCarga {
  opacity: 0.1;
}
.cardDespues {
  opacity: 1;
}
</style>
