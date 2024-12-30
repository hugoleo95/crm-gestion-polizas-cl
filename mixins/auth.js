export default {
  methods: {
    async validate () {
      this.loaded()
      /*
try {
        const { data } = await this.$simpleeApi.post('auth/verify-token/', {
          token: this.$store.state.localStorage.token
        })
        this.loaded()
        console.log(data)
      } catch (error) {
        this.$simpleeApi.setToken(false, 'Bearer')
        this.$store.commit('deleteUserInfo')
        this.$store.commit('localStorage/logout')
        this.$store.commit('localStorage/CloseOut')
        this.$router.push('/auth')
      }
      */
    },
    loaded () {
      if (process.client) {
        if (!this.$store.state.localStorage.logged) {
          this.$simpleeApi.setToken(false, 'Bearer')
          this.$router.push('/auth')
        } else if (this.$store.state.localStorage.logged) {
          this.$simpleeApi.setToken(this.$store.state.localStorage.token, 'Bearer')
          if (!this.$store.state.localStorage.close) {
            this.connectSocket(this.$store.state.localStorage.token)
            // this.$store.dispatch('getDates')
            this.$store.dispatch('getAllNotifications', { unseenOnly: true, page: 1 })
            this.$store.dispatch('getAllPolizasInError', { })
            this.$store.commit('localStorage/CloseIn')
          }
        }
      }
    },
    CloseToken () {
      this.$store.commit('localStorage/CloseOut')
    },
    connectSocket (token) {
      this.$connect(`${process.env.leadSocketUrl}?token=${token}`, { format: 'json', reconnection: true, store: this.$store })
    }
  },
  created () {
    this.loaded()
    if (process.browser) {
      window.addEventListener('beforeunload', this.CloseToken)
    }
  }
}
