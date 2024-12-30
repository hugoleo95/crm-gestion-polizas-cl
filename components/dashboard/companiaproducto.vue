<template>
  <b-card
    class="shadow"
    no-body
  >
    <b-card-body class="d-flex flex-column" :class="cargardata ? 'cardDespues' : 'cardAntesCarga'">
      <div class="d-flex justify-content-between">
        <b-card-title title-tag="h6">
          Compañia / Productos
        </b-card-title>
        <div class="d-flex options">
          <p
            :class="[{ active: chartFor=== 'Ncant' }, 'mr-2']"
            @click="chartFor = 'Ncant'"
          >
            Cantidad
          </p>
          <p
            :class="[{ active: chartFor==='prima' }, 'mr-2']"
            @click="chartFor = 'prima'"
          >
            Prima
          </p>
          <p
            :class="[{ active: chartFor==='comision' }, 'mr-2']"
            @click="chartFor = 'comision'"
          >
            Comisión
          </p>
          <p
            :class="[{ active: chartFor==='comisionS' }]"
            @click="chartFor = 'comisionS'"
          >
            Comisión Simplee
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
import Bar from '@/components/dashboard/BarSpecial.js'
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
      chartType: 'compaproduct',
      chartFor: 'Ncant',
      chart: {
        labels: ['Continental', 'Reale', 'Sura', 'Continental', 'Reale', 'Sura','Continental', 'Reale', 'Sura','Continental', 'Reale', 'Sura'],
        datasets: [
          {
            label: 'Salud',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            data: [4, 3, 5]
          },
          {
            label: 'Garantia',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            data: [6, 2, 4]
          },
          {
            label: 'Resp Civil',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            data: [8, 2, 3]
          },
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
    },
    chartFor() {
      this.loading = true
      this.updateChart = debounce(this.getChart, 2000)
      this.updateChart()
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
    getRandomColor() {
      let r, g, b;
      do {
        r = Math.floor(Math.random() * 256);
        g = Math.floor(Math.random() * 256);
        b = Math.floor(Math.random() * 256);
      } while (r > 240 && g > 240 && b > 240); // Avoid very light colors close to white
      const a = (Math.random() * 0.5 + 0.5).toFixed(2); // Ensure higher opacity
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    },
    async getChart () {
      try {
        const { data: { labels, datasets }} = await this.$simpleeApi.post('/chart/', this.payload)
        let dataShow = []
          const backgroundColor = [
          {
            key: 'Accidentes Personales',
            color: '#bbbcff'
          },
          {
            key: 'Accidentes Personales Digitales',
            color: '#fd7979'
          },
          {
            key: 'Asistencias',
            color: '#f4b460'
          },
          {
            key: 'Diagnostico De Riesgo',
            color: '#c5ffe4'
          },
          {
            key: "Garantia",
            color: '#00FFFF'
          },
          {
            key: "Garantia Digital Publica",
            color: '#76c4ff'
          },
          {
            key: "Garantia Fondos",
            color: '#0ebdf5'
          },
          {
            key: "Incendio Sismo Y Robo",
            color: '#00cc99'
          },
          {
            key: "Incendio Sismo Y Robo Digital",
            color: '#00cc99'
          },
          {
            key: "Responsabilidad Civil",
            color: '#fad500'
          },
          {
            key: "Responsabilidad Civil Empresarial",
            color: "'#5c667f'"
          },
          {
            key: "Responsabilidad Civil Digital",
            color: '#ffff99'
          },
          {
            key: "Seguro Colectivo De Salud",
            color: '#00fcbd'
          },
          {
            key: "Seguros Para La Ingenieria",
            color: '#7673ff'
          },
          {
            key: "Transporte Y Carga",
            color: '#027afa'
          },
          {
            key: "Vehiculos",
            color: '#FF4500'
          },
          {
            key: "Garantia Privada",
            color: '#5c667f'
          },
          {
            key: "Garantia Fondos",
            color: '#ffcc99'
          },
          {
            key: "Garantia Digital Privada",
            color: '#ffb3b3'
          },
          {
            key: "Garantia Publica",
            color: '#0ebdf5'
          },
          {
            key: "Otros Seguros",
            color: '#f4b450'
          },
          {
            key: "Reponsabilidad Civil Digital",
            color: '#ccffcc'
          },
          {
            key: "Danos",
            color: '#ccffff'
          },
          {
            key: "anywhere",
            colors: [
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
            '#ff6347'
            ]
          }
          ]
          datasets.forEach((dset) => {
            const colorObj = backgroundColor.find(bg => bg.key === dset.label);
            if (colorObj) {
              dset.backgroundColor = colorObj.color;
            } else {
              const anywhereColors = backgroundColor.find(bg => bg.key === 'anywhere').colors;
              dset.backgroundColor = anywhereColors[Math.floor(Math.random() * anywhereColors.length)];
            }
          });
          
          
        datasets.sort((a, b) => a.label.localeCompare(b.label));
        if(this.chartFor == 'Ncant'){
          datasets.forEach(dset => {
            dset.data = dset.dataN; // Cambiar el nombre de dataN a data
            delete dset.dataN; // Eliminar dataN
            delete dset.dataP; // Eliminar dataP
            delete dset.dataC; // Eliminar dataC
            delete dset.dataCS; // Eliminar dataCS
            //dset.backgroundColor = this.getRandomColor(); // Agregar color de fondo aleatorio
            delete dset._meta; // Eliminar _meta si existe
            dataShow.push(dset);
          });
        } else if (this.chartFor == 'prima') {
          datasets.forEach(dset => {
            dset.data = dset.dataP; // Cambiar el nombre de dataN a data
            delete dset.dataP; // Eliminar dataP
            delete dset.dataN; // Eliminar dataN
            delete dset.dataC; // Eliminar dataC
            delete dset.dataCS; // Eliminar dataCS
            //dset.backgroundColor = this.getRandomColor(); // Agregar color de fondo aleatorio
            delete dset._meta; // Eliminar _meta si existe
            dataShow.push(dset);
          });
        } else if (this.chartFor == 'comision') {
          datasets.forEach(dset => {
            dset.data = dset.dataC; // Cambiar el nombre de dataN a data
            delete dset.dataC; // Eliminar dataN
            delete dset.dataN; // Eliminar dataN
            delete dset.dataP; // Eliminar dataP
            delete dset.dataCS; // Eliminar dataCS
            //dset.backgroundColor = this.getRandomColor(); // Agregar color de fondo aleatorio
            delete dset._meta; // Eliminar _meta si existe
            dataShow.push(dset);
          });
        } else if (this.chartFor == 'comisionS') {
          datasets.forEach(dset => {
            dset.data = dset.dataCS; // Cambiar el nombre de dataN a data
            delete dset.dataCS; // Eliminar dataN
            delete dset.dataN; // Eliminar dataN
            delete dset.dataP; // Eliminar dataP
            delete dset.dataC; // Eliminar dataC
            //dset.backgroundColor = this.getRandomColor(); // Agregar color de fondo aleatorio
            delete dset._meta; // Eliminar _meta si existe
            dataShow.push(dset);
          });
         }
          this.chart = {
            labels: labels.map(label => label === 'Danos' ? 'Daños' : label),
            datasets: dataShow
          };
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
.cardAntesCarga {
  opacity: 0.1;
}
.cardDespues {
  opacity: 1;
}
</style>
