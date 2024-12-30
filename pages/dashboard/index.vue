<template>
  <div>
    <div class="grid-container mt-3">
      <s-tool-bar
        ref="reftoolbar"
        class="toolbar flow-item"
        :current-filters="leadsFilters"
        filter-by-user
        dashboard
        defaults
        :consulta="getDataChannels"
        @save-filters="setFilters"
        @showData="showData"
      />
      <channels
        :cargardata="getDataChannels"
        :data="dataGetChannels"
        :total="totalChannesls"
        :loading="loadingDataChannels"
        class="channels flow-item"
        :class="[filtersselect.length > 0 ? 'mt-5' : 'mt-0']"
      />
      <states
        :cargardata="getDataStates"
        :chart="chartStates"
        :TotalSolitudes="TotalSolitudes"
        :loading="loadingStates"
        :title="titlestate"
        class="states flow-item"
        :class="[filtersselect.length > 0 ? 'mt-5' : 'mt-0']"
      />
      <!--<sales
        :cargardata="getData"
        class="commisions flow-item"
        :class="[filtersselect.length > 0 ? 'mt-5' : 'mt-0']"
      />-->
      <resultados 
        :cargardata="getDataResultados"
        :loading="loadingResults"
        class="commisions flow-item"
        :class="[filtersselect.length > 0 ? 'mt-5' : 'mt-0']"
      />
      <div class="sub-grid flow-item">
        <!--<statics :cargardata="getData" class="policies" />
        <policies :cargardata="getData" class="ufs" />-->
        <Companiaproducto :cargardata="getDataCompaniaProducto" class="policies" />
        <producto :cargardata="getDataProducto" class="ufs" />
      </div>

      <div class="sub-grid2">
        <chartsales :cargardata="getDataPerformance" class="ufs" />
      </div>
      <!--<div class="sub-grid2">
        <example1 class="ufs" />
        <example2 class="ufs" />
      </div>-->
    </div>
    <!--<sales-global />-->
    <b-modal
      ref="modal-new-event"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <section class="ftco-section">
        <div class="form-row w-100 d-flex justify-content-center mt-4">
          <div class="form-group-relation w-100">
            <h3 class="title">
              Por favor Ingrese los campos
            </h3>
            <label
              class="text-base"
              for="name"
            >Titulo :</label>
            <input
              id="titulo"
              v-model="Event.title"
              placeholder=""
              class="form-control form-input mt-1"
              type="text"
            >
            <label
              class="text-base"
              for="name"
            >Descripción :</label>
            <input
              id="descripcion"
              v-model="Event.descripcion"
              placeholder=""
              class="form-control form-input mt-1"
              type="text"
            >
            <label
              class="text-base"
              for="name"
            >Fecha y hora :</label>
            <input
              id="fecha"
              v-model="Event.date"
              placeholder=""
              class="form-control form-input mt-1 w-50"
              type="datetime-local"
            >
            <b-button
              class="text-white p-2 px-3 mt-5"
              size="sm"
              variant="danger"
              @click="hideEventModal()"
            >
              Cancelar
            </b-button>
            <b-button
              class="text-white p-2 px-3 mt-5 ml-4"
              size="sm"
              variant="primary"
              @click="PostEvent()"
            >
              Crear
            </b-button>
          </div>
        </div>
      </section>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import moment from 'moment'
import Session from '@/mixins/auth'
import channels from '@/components/dashboard/channels'
import sales from '@/components/dashboard/sales'
import policies from '@/components/dashboard/policies'
import states from '@/components/dashboard/states'
import statics from '@/components/dashboard/statics'
import SToolBar from '~/components/base/SToolBar.vue'
import chartsales from '@/components/dashboard/chartsales'
import sales2 from '@/components/dashboard/sales2'
import salesGlobal from '~/components/dashboard/salesGlobal.vue'

import resultados from '@/components/dashboard/resultados.vue'
import producto from '@/components/dashboard/Producto.vue'
import Companiaproducto from '~/components/dashboard/companiaproducto.vue'

export default {
  name: 'Dashboard',
  components: {
    SToolBar,
    channels,
    states,
    policies,
    sales,
    statics,
    chartsales,
    sales2,
    salesGlobal,
    resultados,
    producto,
    Companiaproducto

  },
  mixins: [Session],
  data () {
    return {
      titlestate: 'Estado de polizas',
      calendar: true,
      Event: {},
      urlcalendar: 'https://calendar.google.com/calendar/embed?src=' + this.$store.state.localStorage.user.email + '&bgcolor=%23233348&wkst=2&showPrint=0&showTitle=0&showNav=1&mode=WEEK&color=%23039BE5&color=%23AD1457&color=%2333B679&color=%230B8043',
      getData: false,
      getDataChannels: false,
      getDataResultados: false,
      getDataCompaniaProducto: false,
      getDataProducto: false,
      getDataPerformance: false,
      dataGetChannels: [],
      totalChannesls: 0,
      loadingDataChannels: false,
      getDataStates: false,
      chartStates: {
        labels: [],
        datasets: [{ data: [] }]
      },
      TotalSolitudes: 0,
      loadingStates: false,
      loadingResults: false
    }
  },
  computed: {
    ...mapState(['leadsFilters', 'filtersselect']),
    urlParams () {
      return {
        start: this.leadsFilters.startDate,
        end: this.leadsFilters.endDate
      }
    }
  },
  watch: {
    urlParams: {
      deep: true,
      handler (value) {
        this.ChangeTitle(value.start)
      }
    },
    payload () {
      this.showData()
    },
  },
  mounted () {
    this.$refs.reftoolbar.setFilterselecteddefault()
  },
  methods: {
    ...mapMutations(['setFilters']),
    ChangeTitle (value) {
      console.log(value)
      if (moment(value) > moment('2023-01-01')) {
        this.titlestate = 'Estado de polizas'
      } else {
        this.titlestate = 'Estado de contactos'
      }
    },
    newEvent () {
      this.$refs['modal-new-event'].show()
    },
    hideEventModal () {
      this.$refs['modal-new-event'].hide()
    },
    async PostEvent () {
      if (!this.Event.title || !this.Event.descripcion || !this.Event.date) {
        this.$store.commit('setAlertMessage', { error: 'Todos los campos son obligatorios' })
        return
      }
      this.calendar = false
      try {
        await this.$simpleeApi.post('/add_calendar_custom_event/', {
          date: this.Event.date,
          title: this.Event.title,
          description: this.Event.descripcion
        })
        this.$store.commit('setAlertMessage', { success: 'Evento creado!' })
        this.$refs['modal-new-event'].hide()
        this.calendar = true
      } catch (error) {
        this.calendar = true
        this.$store.commit('setAlertMessage', error.response.data)
      }
    },
    async showData () {
      console.log("entra en mostrar data")
      this.loadingDataChannels = true;
      this.loadingStates = true;
      this.loadingResults = true;
      this.getDataChannels = true;
      this.getDataStates = true;
      await Promise.all([
        this.getChart(),
        this.getChartStates()
      ]);
      this.getDataResultados = true;
      this.loadingDataChannels = false;
      this.loadingStates = false;
      setTimeout(() => {
        this.getDataProducto = true;
      }, 1000);
      setTimeout(() => {
        this.getDataCompaniaProducto = true;
      }, 2000);
      setTimeout(() => {
        this.getDataPerformance = true;
      }, 3000);
    },
    async getChart () {
      try {
        const payload = {
          start: this.leadsFilters.startDate,
          end: this.leadsFilters.endDate,
          type: 'channels',
          channel: this.leadsFilters.channelDashboard,
          referido: this.leadsFilters.refferal,
          type_sale: this.leadsFilters.tipoVentaDashboard
        }
        if (this.leadsFilters.id) { payload.user = this.leadsFilters.id }
        const { data: { labels, data } } = await this.$simpleeApi.post('/chart/', payload)
        this.dataGetChannels = labels.map((c, i) => ({ name: c, count: data[i] }))
        this.totalChannesls = data.reduce((a, c) => a + c, 0)
      } catch (error) {
        console.log(error)
        console.log("error al get carga de channels")
        this.$store.commit('setAlertMessage', error.response.data)
      }
      this.loading = false
    },
    async getChartStates () {
      try {
        const payload = {
          start: this.leadsFilters.startDate,
          end: this.leadsFilters.endDate,
          type: 'states',
          channel: this.leadsFilters.channelDashboard,
          referido: this.leadsFilters.refferal,
          type_sale: this.leadsFilters.tipoVentaDashboard
        }
        if (this.leadsFilters.id) { payload.user = this.leadsFilters.id }
        const { data: { labels, data } } = await this.$simpleeApi.post('/chart/', payload)
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
        this.chartStates = {
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

<style lang="scss" scoped>
.grid-container {
  display: flow;
  min-height: 100%;
}
.flow-item {
  margin-bottom: 1.5em;
}



@media (min-width: 768px) {
  .grid-container {
    display: grid;
    min-height: 100%;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
    /*grid-template-rows: minmax(38px, 40px) minmax(600px, max-content) minmax(400px, max-content) minmax(200px, max-content) minmax(200px, max-content);*/
    grid-template-rows: minmax(38px, 40px) minmax(600px, max-content) minmax(400px, max-content);
    gap: 1.5em 1.5em;
    margin-bottom: 2rem;
  }
  .flow-item {
    margin-bottom: 0em;
  }
  .toolbar {
    grid-column: 1/4;
    grid-row: 1;
  }

  .commisions,
  .states,
  .channels {
    grid-row: 2;
  }
  .channels {
    grid-column: 1;
  }
  .states {
    grid-column: 2;
  }
  .commisions {
    grid-column: 3;
  }
  .sub-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-auto-rows: minmax(0, 1fr);
    gap: 0em 1.5em;
    grid-column: 1/4;
    grid-row: 3;
  }

  .sub-grid2 {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(0, 1fr);
    gap: 0em 1.5em;
    grid-column: 1/4;
    grid-row: 4;
    padding-left: 4rem;
    padding-right: 4rem;
  }
  .sub-grid3 {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-auto-rows: minmax(0, 1fr);
    gap: 0em 1.5em;
    grid-column: 1/4;
    grid-row: 5;
  }
  .policies {
    grid-column: 2/3;
    grid-row: 1;
  }
  .ufs {
    grid-column: 1/2;
    grid-row: 1;
  }
  .shadow {
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }
  .prueba {
    height: inherit;
  }
  .title {
    margin-bottom: 10px;
    background-color: transparent;
    font-family: Rubik;
    font-style: normal;
    font-weight: 500;
    font-size: 1.2rem;
    line-height: 19px;
    outline: 0px solid transparent;
    border: 0px solid transparent;
    padding-bottom: 7px;
    color: #000;
  }
}
</style>
