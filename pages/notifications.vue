
<template>
  <div>
    <div
      v-if="loading"
      class="main-container"
    >
      <div class="section-container">
        <div class="row-container header loading">
          <div class="d-flex">
            <div class="text-center text-primary pa-5 mx-auto ">
              <b-spinner class="align-middle" />
              <strong>Cargando...</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!loading"
      class="main-container"
    >
      <div
        v-if="Itemsnew.length > 0"
        class="section-container"
      >
        <div class="row-container header">
          <h2>Hoy</h2>
        </div>
        <div
          v-for="item in Itemsnew"
          :key="item.id"
          class="bottom-info"
        >
          <div
            class="item"
            @click="getLead({id: item.id, id_notification: item.id_notification, data: item.data})"
          >
            <div class="row-container">
              <fa-icon
                :icon="['fas', 'user']"
                class="text-primary edit-ico"
              />
              <h3 v-if="item.type == 'lead_asigned'">
                Te han asignado un nuevo lead - <strong>{{ item.nombre }}</strong>
              </h3>
              <h3 v-else-if="item.type == 'new_lead'">
                Ha llegado un nuevo lead - <strong>{{ item.nombre }}</strong>
              </h3>
              <h3 v-else>
                {{ item.message }}
              </h3>
              <div />
              <span
                v-if="!item.seen"
                class="noseen"
              />
            </div>
            <div class="time">
              <p class="text-primary">
                {{ item.date }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="Itemsold.length > 0"
        class="section-container"
      >
        <div class="row-container header">
          <h2>Anteriores</h2>
        </div>
        <div
          v-for="item in Itemsold"
          :key="item.id"
          class="bottom-info"
        >
          <div
            class="item"
            @click="getLead({id: item.id, id_notification: item.id_notification, data: item.data})"
          >
            <div class="row-container">
              <fa-icon
                :icon="['fas', 'user']"
                class="text-primary edit-ico"
              />
              <h3 v-if="item.type == 'lead_asigned'">
                Te han asignado un nuevo lead - <strong>{{ item.nombre }}</strong>
              </h3>
              <h3 v-else-if="item.type == 'new_lead'">
                Ha llegado un nuevo lead - <strong>{{ item.nombre }}</strong>
              </h3>
              <h3 v-else>
                {{ item.message }}
              </h3>
              <div />
              <span
                v-if="!item.seen"
                class="noseen"
              />
            </div>
            <div class="time">
              <p class="text-primary">
                {{ item.date }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Session from '@/mixins/auth'
import moment from 'moment'

function debounce (fn, delay) {
  let timeoutID = null
  return function () {
    clearTimeout(timeoutID)
    const args = arguments
    const that = this
    timeoutID = setTimeout(function () {
      fn.apply(that, args)
    }, delay)
  }
}
export default {
  components: {
  },
  mixins: [Session],
  data () {
    return {
      editing: '',
      Itemsnew: [],
      Itemsold: [],
      Item1: [],
      Item2: [],
      time: '',
      timeoption: '',
      getNotifications: '',
      loading: true
    }
  },
  computed: {
    ...mapState({ notifications: 'notifications' })
  },
  mounted () {
    this.getNotifications = debounce(this.getNotification, 500)
    this.getNotifications(1)
  },
  methods: {
    ...mapMutations(['seenNotification']),
    async getNotification () {
      const {
        data: { results }
      } = await this.$simpleeApi.get('/notification/')
      console.log(results)
      for (let i = 0; i < results.length; i++) {
        if (results[i].type !== 'talks_tag' && results[i].type !== 'talks_like' && results[i].type !== 'talks_comment') {
          this.DateFormate(results[i].created_date)
          if (this.timeoption === 'Days') {
            const id = results[i].data.lead
            if (id) {
              const { data } = await this.$simpleeApi.get(`/lead/${id}/`)
              const agregar = { id_notification: results[i].id, id, nombre: data.name, data, type: results[i].type, message: results[i].message, date: this.time, seen: results[i].seen }
              this.Item1.push(agregar)
            }
          } else {
            const id = results[i].data.lead
            if (id) {
              const { data } = await this.$simpleeApi.get(`/lead/${id}/`)
              const agregar = { id_notification: results[i].id, id, nombre: data.name, data, type: results[i].type, message: results[i].message, date: this.time, seen: results[i].seen }
              this.Item2.push(agregar)
            }
          }
        }
      }
      this.Itemsold = this.Item1
      this.Itemsnew = this.Item2
      this.loading = false
    },
    DateFormate (date) {
      const Datenew = moment()
      const DateOld = moment(date)
      const Days = Datenew.diff(DateOld, 'days')
      const hours = Datenew.diff(DateOld, 'hours')
      if (Days > 0) {
        this.time = 'Hace ' + Days + ' Dias'
        this.timeoption = 'Days'
      } else if (hours > 0) {
        this.time = 'Hace ' + hours + ' Horas'
        this.timeoption = 'hours'
      } else {
        const minutes = Datenew.diff(DateOld, 'minutes')
        this.time = 'Hace ' + minutes + ' Minutos'
        this.timeoption = 'minutes'
      }
    },
    async getLead (ids) {
      if (ids) {
        const { data } = await this.$simpleeApi.put(`/notification/${ids.id_notification}/`, {
          data: ids.data,
          seen: true
        })
        // const notification = this.notifications.filter(x => x.id_notification === ids.id_notification)
        // this.delete(notification.id)
        this.seenNotification(ids.id_notification)
        console.log(data)
        this.$router.push({ path: '/leads', query: { id: ids.id } })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
h2,
h3,
p {
  margin: 0;
  padding: 0;
}
input {
  padding: 0 1rem;
  outline: none;
  border: 1px solid #233348;
  &:focus {
    border: 1px solid #056d53;
  }
}
input,
button {
  font-size: 0.9rem;
}
.noseen {
  padding: 0;
  margin-right: 0.3rem;
  width: 32px;
  height: 16px;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
  background: #233348;
  margin-top: 10px;
}
.main-container {
  width: 65%;
  .section-container {
    border-radius: 5px;
    background: #fff;
    -webkit-box-shadow: 0px 2px 5px 0px rgba(148, 139, 148, 0.2);
    -moz-box-shadow: 0px 2px 5px 0px rgba(148, 139, 148, 0.2);
    box-shadow: 0px 2px 5px 0px rgba(148, 139, 148, 0.2);
    border-bottom: 2px solid rgba(156, 154, 154, 0.4);
    padding-bottom: 20px;
    .item:hover {
      background-color: #f3f0f0;
      border-radius: 7px;
      padding: 5px;
    }
    .time {
      margin-left: 2.1rem;
      top: 0.7rem;
    }
    .row-container {
      position: relative;
      display: flex;
      align-items: center;
      padding: 0;
      padding-bottom: 0;
      min-height: 2.7rem;
      cursor: pointer;
      &:last-child {
        border: none;
      }
      h3 {
        font-size: 17px;
        font-weight: 400;
        width: 100%;
        position: relative;
        left: 0;
        top: 0.9rem;
        align-self: flex-start;
        margin-right: 230px;
        margin-bottom: 20px;
      }
      p {
        font-size: 14px;
        font-weight: 400;
        width: 60%;
        position: relative;
        left: 0;
        top: 1.25rem;
        align-self: flex-start;
      }
      button {
        border: none;
        background: none;
        position: absolute;
        right: 0;
        top: 1.25rem;
      }
      .edit-ico {
        margin-right: 1.2999999999999998rem;
        top: 0.45rem;
        margin-top: 1.5rem;
      }
      .dropdown-btn {
        top: 1.25rem;
        right: 1.5rem;
      }
      .save-btn {
        top: 0.6rem;
        color: #fff;
        background-color: #233348;
        border-radius: 5px;
        height: 65%;
        /* max-height: 2.5rem; */
        padding: 0 1rem;
        transition: background 0.3s ease;
        &:hover {
          background-color: rgb(59, 189, 59);
        }
      }
      .close-btn {
        color: red;
      }
      .name-box {
        display: flex;
        margin: 0.75rem 0;
        input {
          width: 35%;
          &:last-child {
            margin-left: 1rem;
          }
        }
      }
      .change-password-box,
      .asignar-metas-box {
        padding: 1rem 0 0 0;
        margin: 0.5rem 0;
        .input-box {
          margin-bottom: 1rem;
          display: grid;
          grid-column-gap: 0.5rem;
          grid-template-columns: 25% 45% 30%;
          align-items: center;
          h2 {
            font-size: 0.9rem;
          }
          .save-btn {
            position: static;
            height: 100%;
            width: 100%;
            padding: 0;
          }
        }
      }
      .asignar-metas-box {
        width: 54%;
        position: relative;
        left: -60%;
        transform: translateX(100%);
        .input-box {
          grid-template-columns: 17% 15% 40% 28%;
          grid-column-gap: 1rem;
          &:first-child {
            padding-bottom: 0.75rem;
            border-bottom: 1px solid rgba(163, 160, 160, 0.3);
          }
          h3,
          p {
            font-size: 0.9rem;
            top: 0.45rem;
          }
          p {
            color: gray;
          }
          select {
            padding: 0.25rem 0;
            color: #fff;
            text-align: center;
            border: none;
            border-radius: 5px;
            background-color: #37dd28;
            width: 70%;
            outline: none;
          }
        }
      }
      table {
        margin: 3rem;
        width: 85%;
        position: relative;
        left: 60%;
        transform: translateX(-97.5%);
        .bg-gray {
          background-color: rgba(163, 160, 160, 0.3);
        }
        tr {
          border-bottom: 1px solid rgba(163, 160, 160, 0.3);
          &:last-child {
            border: none;
          }
          th {
            font-size: 0.9rem;
            padding: 0.75rem 0;
            &:first-child {
              padding-left: 1rem;
            }
            &:last-child {
              color: #233348;
            }
          }
          td {
            padding: 0.75rem 0;
            font-size: 0.9rem;
            &:first-child {
              padding-left: 1rem;
            }
            &:last-child {
              color: #233348;
            }
          }
        }
      }
      .col-container {
        flex-direction: column;
      }
      .entrances {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding-top: 1.5rem;
      }
    }

    .header {
      display: flex;
      padding: 1.25rem 2rem;
      h2 {
        font-size: 1.05rem;
      }
    }

    .loading {
      padding-left: 17rem;
    }
    .bottom-info {
      padding: 0 2rem 1rem 2rem;
    }
    .name-error,
    .text-error,
    .text-success {
      color: red;
      font-size: 0.9rem;
      text-align: center;
      padding-bottom: 0.25rem;
    }
    .text-success {
      color: #22e411;
    }
    .name-error {
      text-align: left;
    }
  }
}
</style>
