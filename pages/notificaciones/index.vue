
<template>
  <div class="main-container">
    <div class="notifications-main-container">
      <div
        v-if="!loading && unreadNotifications.length > 0"
        class="text-left"
      >
        <b-button
          class="text-white py-2 px-3 mr-2 mb-3"
          size="sm"
          variant="primary"
          @click="UnviewNotification"
        >
          Marcar todo como leido
        </b-button>
      </div>
      <div
        v-if="loading"
        class="spinner-container"
      >
        <b-spinner class="spinner" />
        <p>Cargando notificaciones...</p>
      </div>
      <div v-else>
        <div
          v-if="todayNotifications.length > 0"
          class="notifications-box"
        >
          <div class="row-container header">
            <h2>Hoy</h2>
          </div>
          <notification
            v-for="notification in todayNotifications"
            :key="notification.id"
            :notification="notification"
            show-name
            @execute="getLead({id: notification.id, idNotification: notification.id_notification, data: notification.data})"
          />
        </div>
        <div
          v-if="oldNotifications.length > 0"
          class="notifications-box"
        >
          <div class="row-container header">
            <h2>Dias anteriores</h2>
          </div>
          <notification
            v-for="notification in oldNotifications"
            :key="notification.id"
            :notification="notification"
            show-name
            @execute="getLead({id: notification.id, idNotification: notification.id_notification, data: notification.data})"
          />
        </div>
      </div>
    </div>
    <b-pagination
      v-if="!loading"
      align="center"
      :value="page"
      :per-page="25"
      :total-rows="notificationsCount"
      pills
      size="sm"
      @change="getN"
    />
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'
import Notification from '@/components/Notification.vue'
import Session from '@/mixins/auth'

export default {
  components: {
    Notification
  },
  mixins: [Session],
  data () {
    return {
      page: 1,
      todayNotifications: [],
      oldNotifications: [],
      timeoption: '',
      loading: false
    }
  },
  computed: {
    ...mapState(['notifications', 'notificationsCount']),
    ...mapGetters(['unreadNotifications'])
  },
  created () {
    this.getNotifications(false, this.page)
  },
  methods: {
    ...mapMutations(['seenNotification']),
    ...mapActions(['getAllNotifications']),
    async getNotifications (bool = true, page = 1) {
      this.loading = true
      this.todayNotifications = []
      this.oldNotifications = []
      await this.getAllNotifications({ unseenOnly: bool, page })
      await this.parseNotifications(this.notifications)
      this.loading = false
    },
    async parseNotifications (notifications) {
      for (const n of notifications) {
        if (n.data.lead) {
          const { data } = await this.$simpleeApi.get(`/lead/${n.data.lead}/`)
          const notification = {
            id: n.data.lead,
            data,
            name: data.name,
            seen: n.seen,
            type: n.type,
            message: n.message,
            date: n.date,
            id_notification: n.id_notification
          }
          this.setDateSection(n.date) === 'today'
            ? this.todayNotifications.push(notification)
            : this.oldNotifications.push(notification)
        }
      }
    },
    setDateSection (date) {
      const today = new Date()
      const nDate = new Date(date)
      const diff = ((nDate.getTime() - today.getTime()) / 1000) / 60

      return Math.abs(Math.round(diff)) > 1440 ? 'before' : 'today'
    },
    async getLead ({ id, data, idNotification }) {
      await this.$simpleeApi.put(`/notification/${idNotification}/`, {
        data,
        seen: true
      })
      this.seenNotification(idNotification)
      this.$router.push({ name: 'leads', query: { id } })
    },
    async UnviewNotification () {
      await this.$store.dispatch('deleteAllNotifications')
      this.todayNotifications = []
      this.oldNotifications = []
      await this.getNotifications(false)
    },
    getN (page) {
      this.page = page
      this.getNotifications(false, page)
    }
  }
}
</script>
<style lang="scss" scoped>
.main-container {
  .notifications-main-container {
    width: 65%;
    .spinner-container {
      display: flex;
      align-items: center;
      .spinner {
        color: #233348;
        margin-right: 1rem;
      }
      p {
        margin: 0;
        color: #233348;
        height: fit-content;
      }
    }
    .notifications-box {
      background: #fff;
      border-radius: 10px;
      padding: 1.25rem 0;
      box-shadow: rgba(149, 157, 165, 0.1) 0px 8px 24px;
      margin-bottom: 2rem;
      h2 {
        font-size: 1.1rem;
        padding-left: 1.75rem;
        margin-bottom: 1rem;
      }
    }
  }
}
</style>
