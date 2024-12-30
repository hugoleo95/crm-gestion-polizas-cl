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
    const datasets = this.chartData.datasets.map((dataset, index) => {
      if (index !== 0) {
        dataset.hidden = true
      }
      return dataset
    })

    const chartData = {
      ...this.chartData,
      datasets
    }

    this.renderChart(chartData, {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {},
      plugins: { datalabels: { display: false } },
      scales: {
        xAxes: [{
          gridLines: {
            display: true
          },
          stacked: false
        }],
        yAxes: [{
          gridLines: {
            display: true
          },
          stacked: false,
          ticks: {
            beginAtZero: false,
            display: true
          }
        }]
      },
      legend: {
        display: true
      }
    })
  }
}