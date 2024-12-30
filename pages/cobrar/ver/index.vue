<template>
  <div>
    <viewpay />
  </div>
</template>
<script>
import Session from '@/mixins/auth'
import viewpay from '~/components/cobranza/viewpay.vue'
export default {
  name: 'VerCobranza',
  components: {
    viewpay
  },
  mixins: [Session]
}
</script>
  <style scoped>
</style>
