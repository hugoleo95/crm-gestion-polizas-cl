<template>
    <div class="salesG" :class="cargardata ? 'cardDespues' : 'cardAntesCarga'">
        <div> 
            Ventas Globales
            <div class="d-flex justify-content-between">
                <b-card-title title-tag="h6">
                    Canales
                </b-card-title>
            </div>
        </div>
        <div class="d-flex flex-column justify-content-center align-items-center text-center">
            <div class="row">
                <div class="col-4">
                    <b-card-title title-tag="h6">100 % Digital</b-card-title>
                    <div class="justify-content-center align-items-center text-center">
                        <b-card
                            class="shadow"
                            no-body
                        >
                            <b-card-body class="d-flex flex-column">
                                <div class="d-flex justify-content-between mb-4">
                                    <div class="d-flex options">
                                    <p
                                        :class="[{ active: chartType=== 'uf_prima' }, 'mr-2']"
                                        @click="chartType = 'uf_prima'"
                                    >
                                        UF Prima
                                    </p>
                                    <p
                                        :class="[{ active: chartType==='comision' }, 'mr-2']"
                                        @click="chartType = 'comision'"
                                    >
                                        Comision
                                    </p>
                                    <p
                                        :class="[{ active: chartType==='producto' }, 'mr-2']"
                                        @click="chartType = 'producto'"
                                    >
                                        Productos
                                    </p>
                                    <p
                                        :class="[{ active: chartType==='compania' }]"
                                        @click="chartType = 'compania'"
                                    >
                                        Compañia
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
                                <div class="d-flex justify-content-between mb-4">
                                    <div class="d-flex options">
                                        <p class="active my-1">
                                            Total: 100
                                        </p>
                                    </div>
                                </div>
                            </b-card-body>
                        </b-card>
                    </div>
                </div>
                <div class="col-4">
                    <b-card-title title-tag="h6">Asistido</b-card-title>
                    <div class="justify-content-center align-items-center text-center">
                        <b-card
                            class="shadow"
                            no-body
                        >
                            <b-card-body class="d-flex flex-column">
                                <div class="d-flex justify-content-between mb-4">
                                    <div class="d-flex options">
                                    <p
                                        :class="[{ active: chartType=== 'uf_prima' }, 'mr-2']"
                                        @click="chartType = 'uf_prima'"
                                    >
                                        UF Prima
                                    </p>
                                    <p
                                        :class="[{ active: chartType==='comision' }, 'mr-2']"
                                        @click="chartType = 'comision'"
                                    >
                                        Comision
                                    </p>
                                    <p
                                        :class="[{ active: chartType==='producto' }, 'mr-2']"
                                        @click="chartType = 'producto'"
                                    >
                                        Productos
                                    </p>
                                    <p
                                        :class="[{ active: chartType==='compania' }]"
                                        @click="chartType = 'compania'"
                                    >
                                        Compañia
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
                                <div class="d-flex justify-content-between mb-4">
                                    <div class="d-flex options">
                                        <p class="active my-1">
                                            Total: 100
                                        </p>
                                    </div>
                                </div>
                            </b-card-body>
                        </b-card>
                    </div>
                </div>
                <div class="col-4">
                    <b-card-title title-tag="h6">Esponsor</b-card-title>
                    <div class="justify-content-center align-items-center text-center">
                        <b-card
                            class="shadow"
                            no-body
                        >
                            <b-card-body class="d-flex flex-column">
                                <div class="d-flex justify-content-between mb-4">
                                    <div class="d-flex options">
                                    <p
                                        :class="[{ active: chartType=== 'uf_prima' }, 'mr-2']"
                                        @click="chartType = 'uf_prima'"
                                    >
                                        UF Prima
                                    </p>
                                    <p
                                        :class="[{ active: chartType==='comision' }, 'mr-2']"
                                        @click="chartType = 'comision'"
                                    >
                                        Comision
                                    </p>
                                    <p
                                        :class="[{ active: chartType==='producto' }, 'mr-2']"
                                        @click="chartType = 'producto'"
                                    >
                                        Productos
                                    </p>
                                    <p
                                        :class="[{ active: chartType==='compania' }]"
                                        @click="chartType = 'compania'"
                                    >
                                        Compañia
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
                                <div class="d-flex justify-content-between mb-4">
                                    <div class="d-flex options">
                                        <p class="active my-1">
                                            Total: 100
                                        </p>
                                    </div>
                                </div>
                            </b-card-body>
                        </b-card>
                    </div>              
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import Bar from '@/components/dashboard/Bar.js'
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
    name: 'SalesGlobal',
    components: {
        Bar
    },
    props: {
        cargardata: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            chartType: 'uf_prima',
            loading: false,
            chart: {
                labels: [],
                datasets: [{ data: [] }, { data: [] }]
            },
        };
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
    },
    computed: {
        ...mapState(['leadsFilters']),
        payload () {
            const payload = {
                start: this.leadsFilters.startDate,
                end: this.leadsFilters.endDate,
                type: 'statics_uf'
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
    mounted() {
        if (this.cargardata) {
            this.updateChart = debounce(this.getChart, 2000)
            this.updateChart()
        }
    }
};
</script>

<style scoped>
.salesG {
  display:flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  align-items: left;
  justify-content: left;
}
.cardAntesCarga {
  opacity: 0.5;
}
.cardDespues {
  opacity: 1;
}
</style>