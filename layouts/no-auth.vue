<template>
  <nuxt v-if="mountedApp" />
  <div
    v-else
    class="d-flex justify-content-center align-items-center h-100 vh-100"
  >
    <b-spinner
      style="width: 2.5rem; height: 2.5rem;"
      variant="primary"
      center
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      mountedApp: false
    }
  },
  mounted () {
    this.mountedApp = true
  }
}
</script>
