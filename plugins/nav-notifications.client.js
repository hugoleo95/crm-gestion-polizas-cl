import Vue from 'vue'
import VueNativeNotification from 'vue-native-notification'

Vue.use(VueNativeNotification, {
  requestOnNotify: true
})

Vue.notification.requestPermission()
  .then(console.log)
