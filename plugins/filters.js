import Vue from 'vue'

Vue.filter('shortText', (value, lenght = 10) => {
  if (!value) { return '' }
  return `${value.slice(0, lenght)}...`
})

Vue.filter('formatDate', (value) => {
  if (!value) { return '' }
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(value.replaceAll('-', '/')).toLocaleDateString('es', options)
})
