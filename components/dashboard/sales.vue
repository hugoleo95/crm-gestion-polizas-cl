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
        <div class="d-flex justify-content-between">
          <b-card-title title-tag="h6">
            Mis ventas
          </b-card-title>
          <div class="d-flex options">
            <p
              role="button"
              :class="[{ active: chartType === 'sales' }, 'mr-2']"
              @click="chartType = 'sales'"
            >
              Ventas
            </p>
            <p
              role="button"
              :class="[{ active: chartType === 'projected_quote' }]"
              @click="chartType = 'projected_quote'"
            >
              Proyeccion
            </p>
          </div>
        </div>
        <div class="d-flex flex-column flex-fill">
          <p>Monto actual: {{ Buys ? Buys.toFixed(2) : '' }}</p>
          <p>Meta: {{ meta }}</p>
          <div
            class="my-auto text-center"
            :title="`${ventas}/${meta}`"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="far"
              data-icon="smile-wink"
              class="svg-inline--fa fa-smile-wink  svg"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
            >
              <path
                v-if="percentage > 90 "
                fill="url(#myGradient)"
                d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm105.6-151.4c-25.9 8.3-64.4 13.1-105.6 13.1s-79.6-4.8-105.6-13.1c-9.8-3.1-19.4 5.3-17.7 15.3 7.9 47.2 71.3 80 123.3 80s115.3-32.9 123.3-80c1.6-9.8-7.7-18.4-17.7-15.3zm-227.9-57.5c-1 6.2 5.4 11 11 7.9l31.3-16.3 31.3 16.3c5.6 3.1 12-1.7 11-7.9l-6-34.9 25.4-24.6c4.5-4.5 1.9-12.2-4.3-13.2l-34.9-5-15.5-31.6c-2.9-5.8-11-5.8-13.9 0l-15.5 31.6-34.9 5c-6.2.9-8.9 8.6-4.3 13.2l25.4 24.6-6.1 34.9zm259.7-72.7l-34.9-5-15.5-31.6c-2.9-5.8-11-5.8-13.9 0l-15.5 31.6-34.9 5c-6.2.9-8.9 8.6-4.3 13.2l25.4 24.6-6 34.9c-1 6.2 5.4 11 11 7.9l31.3-16.3 31.3 16.3c5.6 3.1 12-1.7 11-7.9l-6-34.9 25.4-24.6c4.5-4.6 1.8-12.2-4.4-13.2z"
              />
              <path
                v-else-if="percentage > 50 "
                fill="url(#myGradient)"
                d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm117.8-146.4c-10.2-8.5-25.3-7.1-33.8 3.1-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8zM168 240c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-60c-25.7 0-55.9 16.9-59.9 42.1-1.7 11.2 11.5 18.2 19.8 10.8l9.5-8.5c14.8-13.2 46.2-13.2 61 0l9.5 8.5c8.5 7.4 21.6.3 19.8-10.8-3.8-25.2-34-42.1-59.7-42.1z"
              />
              <path
                v-else
                fill="url(#myGradient)"
                d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-80 128c-40.2 0-78 17.7-103.8 48.6-8.5 10.2-7.1 25.3 3.1 33.8 10.2 8.4 25.3 7.1 33.8-3.1 16.6-19.9 41-31.4 66.9-31.4s50.3 11.4 66.9 31.4c8.1 9.7 23.1 11.9 33.8 3.1 10.2-8.5 11.5-23.6 3.1-33.8C326 321.7 288.2 304 248 304z"
              />
              <linearGradient
                id="myGradient"
                y1="100%"
                x1="100%"
              >
                <!-- <stop :offset="firstColor" stop-color="rgba(0, 226, 170, 0.6)" />
              <stop :offset="secondColor" stop-color="rgba(26, 142, 137, 0.6)" /> -->
                <stop
                  :offset="`${percentage}%`"
                  stop-color="#233348"
                />
                <stop
                  v-if="percentage < 100"
                  offset="0%"
                  stop-color="#233348"
                />
              </linearGradient>
            </svg>
          </div>

          <div class="d-flex flex-column  percentage align-self-start mt-5 mb-3">
            <h2 :title="`${ventas}/${meta}`">
              {{ percentage.toFixed(0) }} %
              <h2 :title="`${ventas}/${meta}`">
                completado
              </h2>
            </h2>
          </div>
        </div>
      </template>
    </b-card-body>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'
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
  name: 'Sales',
  props: {
    start: {
      type: String,
      required: true
    },
    end: {
      type: String,
      required: true
    },
    user: {
      type: String,
      required: true
    },
    cargardata: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      chartType: 'sales',
      meta: 0,
      ventas: 0,
      loading: false
    }
  },
  computed: {
    ...mapState(['leadsFilters']),
    /*
    sales () {
      return this.chartType === 'sales' ? this.ventas[0] : this.ventas
    },
    discount () {
      return this.chartType === 'sales' ? this.ventas[1].toFixed(2) : null
    },
    total () {
      return this.sales - this.discount
    },
    */
    percentage () {
      const { meta, Buys } = this
      return meta > 0 ? (Buys / meta) * 100 : 0
    },
    firstColor () {
      return `${this.percentage * 16.39 / 100}%`
    },
    secondColor () {
      return `${this.percentage * 63.59 / 100}%`
    },
    thirdColor () {
      return `${this.percentage * 100 / 100}%`
    },
    Buys () {
      if (this.chartType === 'sales') {
        return this.ventas[0]
      } else {
        return this.ventas
      }
    },
    payload () {
      const payload = {
        start: this.leadsFilters.startDate,
        end: this.leadsFilters.endDate,
        type: this.chartType
      }
      if (this.leadsFilters.id) {
        payload.user = this.leadsFilters.id
      }
      return payload
    }
  },
  watch: {
    payload () {
      this.loading = true
      this.updateChart()
    },
    chartType () {
      this.getChart()
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
  methods: {
    async getChart () {
      this.getGoals()
      try {
        const { data: { data } } = await this.$simpleeApi.post('/chart/', this.payload)
        this.ventas = data
      } catch (error) {
        this.$store.commit('setAlertMessage', error.response.data)
      }
      this.loading = false
    },
    async getGoals () {
      try {
        const {
          data: { results }
        } = await this.$simpleeApi.get(`/goal/?start=${this.payload.start}&end=${this.payload.end}&user=${this.payload.user || null}`)
        let metas = 0
        if (results) {
          for (let j = 0; j < results.length; j++) {
            metas = metas + results[j].amount
          }
        }
        this.meta = metas
      } catch (error) {
        console.log(error)
        this.$store.commit('setAlertMessage', error.response.data)
      }
    }
  }
}
</script>

<style lang="scss">
$background: linear-gradient(
  270deg,
  rgba(0, 226, 170, 0.6) 16.39%,
  rgba(26, 142, 137, 0.6) 65.55%,
  rgba(5, 47, 89, 0.6) 112.37%
);
// *{
//   outline: 1px solid red;
// }

.half-circle {
  position: relative;
  width: 100%;
  height: 300px; /* as the half of the width */
  border-top-left-radius: 70%; /* 100px of height + 10px of border */
  border-top-right-radius: 70%; /* 100px of height + 10px of border */
  border: 20px solid transparent;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(white, white), $background;
  animation: progress-bar 5s infinite;
}
@keyframes progress-bar {
  from {
    background-clip: padding-box, border-box;
    background-size: 100% 100%, 0% 0%;
  }
  to {
    background-clip: padding-box, border-box;
    background-size: 100% 100%, 100% 100%;
  }
}
.svg {
  font-size: 10rem;
}

.percentage {
  h2 {
    font-family: Rubik;
    font-style: normal;
    font-weight: 300;
    font-size: 36px;
    line-height: 30px;
    /* or 83% */

    text-align: right;

    color: #000000;
  }
}
.cont {
  overflow: hidden;
  height: 180px;
}

$pw-wrapper-width: 250px;
.progress-wheel-wrapper {
  width: $pw-wrapper-width;
  height: $pw-wrapper-width/2;
  overflow: hidden;
}
.pw-body {
  width: $pw-wrapper-width;
  height: $pw-wrapper-width;
  position: relative;
}
.pw-circle {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  transition: transform 0.25s cubic-bezier(0.25, 0.75, 0.5, 1.25);
  background: $background center top / 100% 50% no-repeat,
    linear-gradient(green, green) center bottom / 100% 50% no-repeat;
}
.pw-circle-overlay {
  position: absolute;
  width: 75%;
  height: 75%;
  left: calc(25% / 2);
  top: calc(25% / 2);
  background-color: white;
  border-radius: 50%;
}
.cardAntesCarga {
  opacity: 0.1;
}
.cardDespues {
  opacity: 1;
}
</style>
