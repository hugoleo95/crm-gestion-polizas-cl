export default {
  methods: {
    loaded () {
      if (process.client) {
        if (this.$store.state.localStorage.logged) {
          this.$simpleeApi.setToken(this.$store.state.localStorage.token, 'Bearer')
          this.connectSocket(this.$store.state.localStorage.token)
          // this.$store.dispatch('getDates')
          this.$store.dispatch('getAllNotifications', { unseenOnly: true, page: 1 })
          this.$store.dispatch('getAllPolizasInError', { })
          // this.$store.dispatch('leads/getUsers')
          this.$store.commit('localStorage/CloseIn')
          if (this.$store.state.localStorage.user.role === 'EXT_KAM') {
            this.$router.push('/solicitudes')
          } else {
            this.$router.push('/dashboard')
          }
        }
      }
    },
    connectSocket (token) {
      this.$connect(`${process.env.leadSocketUrl}?token=${token}`, { format: 'json', reconnection: true, store: this.$store })
    }
  },
  created () {
    this.loaded()
  }
}
