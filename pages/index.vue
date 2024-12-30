<template>
  <section class="hero is-primary has-text-centered">
    <div class="hero-body">
      <div class="container" />
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomePage',
  created () {
    if (this.$store.state.localStorage.logged) {
      if (this.$store.state.localStorage.user.role === 'EXT_KAM') {
        this.$router.push({ path: '/solicitudes' })
      } else {
        this.$router.push({ path: '/dashboard' })
      }
    } else {
      this.$router.push({ path: '/auth' })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
