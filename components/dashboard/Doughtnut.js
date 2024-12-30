import { Doughnut, mixins } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
const { reactiveProp } = mixins
export default {
  extends: Doughnut,
  props: ['options'],
  mixins: [reactiveProp],
  components: {
    ChartDataLabels
  },
  mounted () {
    this.renderChart(this.chartData, {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        datalabels: {
          clip: true,
          clamp: true,
          display: 'auto',
          font: {
            family: 'Rubik'
          },
          formatter: (value, ctx) => {
            if (value >= 1) {
              const dataArr = ctx.chart.data.datasets[0].data
              const sum = dataArr.reduce((acc, curr) => acc + curr, 0)
              const percentage = (value * 100 / sum).toFixed(0) + '%'
              return percentage
            }
            return ''
          },
          color: '#fff'
        }
      },
      ...this.options
    })
  }
}
