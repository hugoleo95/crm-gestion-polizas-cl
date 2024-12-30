import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins
export default {
  extends: Bar,
  mixins: [reactiveProp],
  data () {
    return {
      gradient: null
    }
  },
  mounted () {
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        filter (tooltipItem) {
          return tooltipItem.datasetIndex === 0
        }
      },
      plugins: { datalabels: { display: false } },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          },
          stacked: true
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          stacked: true,
          ticks: {
            beginAtZero: false
          }
        }]
      },
      legend: {
        display: false
      }
    })
  }
}
