<template>
  <div>
    <newpay></newpay>
  </div>
</template>
<script>
import Session from '@/mixins/auth'
import newpay from '~/components/cobranza/newpay.vue'
export default {
  name: 'Nueva cobranza',
  components: {
    newpay,
  },
  mixins: [Session],
}
</script>
<style scoped>
</style>