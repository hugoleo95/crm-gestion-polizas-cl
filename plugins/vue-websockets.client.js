import VueNativeSock from 'vue-native-websocket'
import Vue from 'vue'
const socketUrl = process.env.leadSocketUrl

// Vue.use(VueNativeSock, socketUrl, {
//   format: 'json',
//   connectManually: true
// })
export default ({ store }, inject) => {
  Vue.use(VueNativeSock, socketUrl, {
    store,
    format: 'json',
    connectManually: true
  })
}
