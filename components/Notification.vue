<template>
  <div
    class="notification-container"
    @click="$emit('execute')"
  >
    <fa-icon
      :icon="['fas', 'user']"
      class="text-primary user-icon"
    />
    <div class="d-flex flex-column justify-content-between">
      <h3 v-if="notification.type == 'lead_request_assigned' && showName">
        Te han asignado una nueva solicitud <strong>{{ notification.name && `- ${notification.name}` }}</strong>
      </h3>
      <h3 v-else-if="notification.type == 'new_lead_request' && showName">
        Ha llegado una nueva solicitud <strong>{{ notification.name && `- ${notification.name}` }}</strong>
      </h3>
      <h3 v-else>
        {{ notification.message }}
      </h3>
      <p class="text-primary">
        {{ date }}
      </p>
    </div>
    <span
      v-if="!notification.seen"
      class="unSeen"
    />
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    notification: {
      type: Object,
      required: true
    },
    showName: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      date: null
    }
  },
  created () {
    this.date = this.DateFormate(this.notification.date)
    setInterval(() => {
      this.date = this.DateFormate(this.notification.date)
    }, 60000)
  },
  methods: {
    DateFormate (date) {
      const Datenew = moment()
      const DateOld = moment(date)
      const Days = Datenew.diff(DateOld, 'days')
      const hours = Datenew.diff(DateOld, 'hours')

      if (Days > 0) {
        return 'Hace ' + Days + ` ${Days === 1 ? 'Dia' : 'Dias'}`
      } else if (hours > 0) {
        return 'Hace ' + hours + ` ${hours === 1 ? 'Hora' : 'Horas'}`
      } else {
        const minutes = Datenew.diff(DateOld, 'minutes')
        return 'Hace ' + minutes + ` ${minutes === 1 ? 'Minuto' : 'Minutos'}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
.notification-container {
  display: flex;
  align-items: center;
  height: 5rem;
  padding: 0.75rem 1.75rem;
  min-width: 17.5rem;
  cursor: pointer;
  position: relative;
  transition: background 0.3s ease;
  &:hover {
    background: rgb(241, 238, 238);
  }
  .user-icon {
    margin-right: 1.5rem;
  }
  h3 {
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 0.5rem;
  }
  .unSeen {
    width: 20px;
    height: 20px;
    background: #233348;
    border-radius: 50%;
    position: absolute;
    right: 1.75rem;
  }
}
</style>
