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
    console.log('this.chartData', this.chartData)
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(tooltipItem, data) {
            if(tooltipItem.yLabel>0){
              return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel;
            } else {
              return '';  
            }
      
          }
        }
      },
      plugins: {
        datalabels: {
          display: function(context) {
            return ''
            //return context.dataset.data[context.dataIndex] > 0; // Mostrar solo si el valor es mayor a 0
          },
          formatter: function(value, context) {
            return value > 0 ? value : ''; // Formatear solo si el valor es mayor a 0
          }
        }
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: true
          },
          stacked: true,
        }],
        yAxes: [{
          gridLines: {
            display: true
          },
          stacked: true,
          ticks: {
            beginAtZero: true,
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
