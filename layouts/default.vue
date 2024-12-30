<template>
  <keep-alive>
    <div v-if="mounted">
      <b-toast
        v-for="{
          message,
          data,
          id,
          id_notification,
        } in unreadNotifications.slice(0, 5)"
        :id="`example-toast${id}`"
        :key="id"
        title="Solicitud"
        visible
        class="position-absolute"
      >
        <b-button
          variant="light"
          @click="
            openLead({
              id: data.lead_request,
              datas: data,
              idnotification: id_notification,
              idcontrol: id,
            })
          "
        >
          {{ message }}
        </b-button>
      </b-toast>

      <div :class="gripadaptable">
        <b-navbar class="py-2 bnavbar">

          <b-navbar-brand class="font-weight-bold d-flex align-items-center mr-0 mr-md-3">
            <fa-icon
              :icon="['fas', 'bars']"
              :style="{ height: '29px' }"
              class="text-primary mr-2 d-flex pointer"
              @click="showSideBar"
            />
            <fa-icon
              :icon="pageIcon"
              :style="{ height: '29px' }"
              class="text-primary mr-2 d-none"
            />
            {{ replacetitle(pageTitle) }}
          </b-navbar-brand>
        <!--
            <b-navbar-nav
            v-if="refreshingLeads"
            class="refreshingLeads-alert"
          >
            Recargando solicitudes
            <b-spinner
              class="ml-2"
              small
              variant="primary"
              label="Small Spinner"
            />
          </b-navbar-nav>-->
          <b-navbar-nav class="refreshingLeads-alert">
            <fa-icon
              class="cursor-pointer"
              style="font-size: 20px;"
              @click="PushBusqueda"
              :icon="['fas', 'search']"
            />
          </b-navbar-nav>
          <b-navbar-nav
            v-if="showNotification"
            class="ml-auto"
          >
            <b-nav-item-dropdown
              :text="$store.state.localStorage.user.email"
              class="font-weight-bold text-black"
            >
              <b-dropdown-item @click="handleClickLogOutButton">
                Cerrar sesión
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-navbar>

        <div :class="sidebarClasses">
          <nuxt-link to="/dashboard">
            <img
              src="~assets/logo2.png"
              class="sidebar-brand"
              alt="Digital Jump - Desarrollo de software"
              @click="clickBar"
            >
          </nuxt-link>

          <div class="links">
            <!--<nuxt-link to="/calendario">
            <fa-icon
              :icon="['fas', 'calendar-alt']"
              :class="getSelectedRoute('calendario')"
            />

            Calendario
          </nuxt-link>-->
            <nuxt-link
              to="/dashboard"
              @click="clickBar"
            >
              <fa-icon
                :icon="['fas', 'th']"
                :class="getSelectedRoute('dashboard')"
              />

              Dashboard
            </nuxt-link>
            <nuxt-link
            v-if="version === 'CL'"
            :to="{ path: '/cotizador' }"
            @click="clickBar"
          >
            <fa-icon
              :icon="['fa', 'list-alt']"
              :class="getSelectedRoute('cotizador')"
            />
            Cotizadores
          </nuxt-link>
          
            <nuxt-link
              :to="{ path: '/postventa' }"
              @click="clickBar"
            >
              <fa-icon
                :icon="['fas', 'file-alt']"
                :class="getSelectedRoute('postventa')"
              />
              Producción
            </nuxt-link>
            <nuxt-link
              :to="{ path: '/cobrar' }"
              @click="clickBar"
            >
              <fa-icon
                :icon="['fas', 'money-bill-alt']"
                :class="getSelectedRoute('cobrar')"
              />
              Cobranza
            </nuxt-link>
         
            <nuxt-link
              :to="{ path: '/leadsnew' }"
              @click="clickBar"
            >
              <fa-icon
                :icon="['fas', 'address-book']"
                :class="getSelectedRoute('leadsnew')"
              />
              <span>Contactos</span>
            </nuxt-link>
            <nuxt-link
              v-if="$store.state.localStorage.user.role !== 'EXT_KAM'"
              :to="{ path: '/configuracion' }"
              @click="clickBar"
            >
              <fa-icon
                :icon="['fas', 'cog']"
                :class="getSelectedRoute('configuracion')"
              />
              Configuración
            </nuxt-link>
          </div>
        </div>

        <nuxt :class="viewMain" />
      </div>
      <b-modal
        id="error-modal"
        v-model="showModal"
        hide-footer
      >
        <template #modal-title>
          {{ error ? "Ops, ha ocurrido un error!" : "Operacion exitosa!" }}
        </template>
        <div
          v-if="typeof alertMessage !== 'string'"
          class="d-block text-center"
        >
          <h4
            v-for="(message, i) in alertMessage"
            :key="i"
            class="text-xs"
          >
            {{ message }}
          </h4>
        </div>
        <div
          v-else
          class="d-block text-center"
        >
          <h4 class="text-xs">
            {{ alertMessage }}
          </h4>
        </div>
        <b-button
          :class="`${error ? 'bg-danger text-white' : 'bg-primary'} mt-3`"
          block
          @click="showModal = false"
        >
          Entendido
        </b-button>
      </b-modal>
      <div
        v-if="modalShow"
        style="z-index: 10000"
      >
        <b-modal
          v-model="modalShow"
          size="lg"
          hide-footer
          hide-header
          centered
          :no-close-on-backdrop="true"
          class="modal-class"
        >
          <div class="d-block text-center modalcontent2">
            <div>
              <h2 class="mt-5 mb-3 text-center">
                ATENCIÓN
                <fa-icon :icon="['fas', 'exclamation-triangle']" />
              </h2>
              <h4 class="text-center">
                Su tiempo de sesión ha expirado
              </h4>
            </div>
            <div class="text-center">
              <b-button
                class="mt-4"
                variant="outline-success"
                size="lg"
                @click="Outlogin"
              >
                Iniciar sesión
              </b-button>
            </div>
          </div>
        </b-modal>
      </div>
    </div>
    <div
      v-else
      class="d-flex justify-content-center align-items-center h-100 vh-100"
    >
      <b-spinner
        style="width: 2.5rem; height: 2.5rem"
        variant="primary"
        center
      />
    </div>
  </keep-alive>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import _ from 'lodash'
import moment from 'moment'
import Notification from '@/components/Notification.vue'
export default {
  components: {
    Notification
  },
  data () {
    return {
      page: 1,
      showModal: false,
      modalShow: false,
      showNotification: true,
      mounted: false,
      errorPoliza: 0,
      optionnotification: 'request',
      version: 'CL',
      usuario: this.$store.state.localStorage.user.id,
      viewSidebar: false
    }
  },
  head () {
    return {
      title: this.titleTab
    }
  },
  computed: {
    ...mapState([
      'notifications',
      'unseenNotificationsCount',
      'alertMessage',
      'error',
      'refreshingLeads'
    ]),
    ...mapState('leads', ['alertMessagelead', 'polizaerror']),
    ...mapGetters(['unreadNotifications']),
    pageTitle () {
      console.log(this.$route.name, 'aquiii')
      return (
        this.$route.name.charAt(0).toUpperCase() + this.$route.name.slice(1)
      )
    },
    pageIcon () {
      const icons = {
        dashboard: 'th',
        calendario: 'calendar-alt',
        leads: 'user-plus',
        leadsnew: 'user-plus',
        solicitudes: 'inbox',
        polizas: 'file-alt',
        configuracion: 'cog',
        notificaciones: 'bell',
        clientes: 'address-book',
        cobrar: 'money-bill-alt',
        buscar: 'search',
        pagos: 'money-check'
      }
      return ['fas', icons?.[this.$route.name]]

    },
    titleTab () {
      const { pageTitle, unseenNotificationsCount } = this
      const counter =
        unseenNotificationsCount > 0
          ? `${pageTitle} (${unseenNotificationsCount})`
          : pageTitle
      return counter
    },
    paginateNotifications () {
      return this.notifications.slice(0, this.page * 5)
    },
    sidebarClasses () {
      return {
        'sidebar d-flex flex-column aling-items-center': true, // Clases comunes
        'sidebar-open': this.viewSidebar, // Clase cuando el sidebar está abierto
        'sidebar-closed': !this.viewSidebar, // Clase cuando el sidebar está cerrado
      };
    },
    viewMain () {
      const width = window.innerWidth;
      console.log('viewMain')
      if (width > 768) {
        return 'page'
      } else {
        if (this.viewSidebar) {
          return 'page d-none'
        } else {
          return 'page'
        }
      }
    },
    gripadaptable () {
      if (!this.viewSidebar) {
        return 'grid-layout mainR'
      } else {
        return 'grid-layout2 mainA'
      }
    }
  },
  watch: {
    alertMessage () {
      if (this.alertMessage !== 'Given token not valid for any token type') {
        this.showModal = this.alertMessage && true
      }
    },
    alertMessagelead () {
      console.log(this.alertMessagelead)
      this.setAlertMessage({ success: this.alertMessagelead })
    },
    showModal () {
      if (!this.showModal) {
        this.setAlertMessage(null)
      }
    },
    unreadNotifications: {
      deep: true,
      handler (val) {
        const icon = require('~/assets/simplee-logo.png')
        if (val.length > 0) {
          this.$notification.show(
            'Tienes notificaciones nuevas sin leer',
            {
              body: val[val.length - 1].message,
              icon
            },
            {}
          )
        }
      }
    }
  },
  created () {
    const urlEnv = process.env.apiUrl
    if (urlEnv === 'https://api.dev.simplee.cl/api') {
      this.Entorno = 'Entorno QA'
    } else {
      this.Entorno = ''
    }

    if (process.env.version === 'CL') {
      this.version = 'CL'
    } else {
      this.version = 'MX'
    }
    console.log(this.version)
    if (this.$store.state.localStorage.user.id) {
      //this.$store.dispatch('localStorage/getUserPermissions')
    }
    // this.validatetoken();
    // this.validatetoken2();
  },
  mounted () {
    this.mounted = true
    if (this.$store.state.localStorage.user.role !== 'EXT_KAM' && this.$store.state.localStorage.user.id) {
      this.GetPolizasError()
    }
  },
  methods: {
    ...mapMutations(['seenNotification', 'setAlertMessage']),
    ...mapMutations('leads', ['setPolizaError']),
    showSideBar () {
      this.viewSidebar = !this.viewSidebar;
    },
    handleClickLogOutButton () {
      console.log('entra en logout')
      this.$store.dispatch('LogoutSession').then(() => {
        // Acciones a realizar después de que se complete el cierre de sesión
        window.location.reload()
      }).catch((error) => {
        console.error('Error al cerrar sesión:', error)
      })
      /*
      this.$simpleeApi.setToken(false, "Bearer");
      this.$store.commit("localStorage/logout");
      this.$store.commit("localStorage/CloseOut");
      this.$store.commit("deleteUserInfo");
      //this.$simpleeApi.setToken(false, "Bearer");
      //const LocationActual = window.location;
      //location.href = LocationActual;
      //this.$router.push({ path: "/auth", query: { cerrar: "si" } });
      this.$router.push('/auth')
      */
    },
    async GetPolizasError () {
      const user = this.$store.state.localStorage.user.id
      // const user = null
      const params = {
        user,
        inerror: true
      }
      try {
        const {
          data: { count }
        } = await this.$simpleeApi.get('/product/', { params })
        this.setPolizaError(count)
      } catch (error) {
        // store.commit('setAlertMessage', error.response.data)
      }
    },
    PushCorreccion () {
      this.$router.push('correcciones')
    },
    PushBusqueda () {
      this.$router.push('buscar')
    },
    async openLead ({ id, datas, idnotification }) {
      await this.$simpleeApi.put(`/notification/${idnotification}/`, {
        data: datas,
        seen: true
      })
      this.seenNotification(idnotification)
      this.$router.push({ name: 'solicitudes', query: { id } })
    },
    showMore () {
      this.page += 1
    },
    replacetitle (value) {
      let title = value
      title = title.replace('new', '')
      title = title.replace('Clientes-', '')
      const primary = title[0].toUpperCase()
      title = primary + title.substring(1)
      if (title == 'Corporativo') {
        title = ''
      }
      return title
    },
    MoreView () {
      this.$router.push({ path: '/notificaciones' })
    },
    rutatoadd () {
      this.viewSidebar = false;
      this.$router.push({ path: '/solicitudes' })
    },
    clickBar () {
      console.log('clickBar executed');
      this.viewSidebar = false;
    },
    resetPage () {
      if (this.paginateNotifications.length >= 7) {
        this.page = 1
      }
    },
    validatetoken () {
      const Datenew = moment()
      const DateOld = moment(this.$store.state.localStorage.death_date)
      const seconds = Datenew.diff(DateOld, 'seconds')
      console.log(seconds)
      if (seconds > 0 || !seconds || isNaN(seconds) || seconds === null) {
        this.showModal = false
        this.modalShow = true
      }
    },
    validatetoken2 () {
      const Datenew = moment()
      const DateOld = moment(this.$store.state.localStorage.death_date)
      const seconds = Datenew.diff(DateOld, 'seconds')
      if (seconds > 0 || !seconds || isNaN(seconds) || seconds === null) {
        this.$simpleeApi.setToken(false, 'Bearer')
        this.modalShow = false
        this.$store.commit('deleteUserInfo')
        this.$store.commit('localStorage/logout')
        this.$store.commit('localStorage/CloseOut')
        this.$router.push('/auth')
      }
    },
    async Outlogin () {
      this.modalShow = false
      this.$store.commit('deleteUserInfo')
      this.$store.commit('localStorage/logout')
      this.$store.commit('localStorage/CloseOut')
      this.$router.push('/auth')
      this.$simpleeApi.setToken(false, 'Bearer')
      /*
      try {
        const { data } = await this.$simpleeApi.post('auth/verify-token/', {
          token: this.$store.state.localStorage.token
        })
        console.log(data)
        this.modalShow = false
      } catch (error) {
        this.$simpleeApi.setToken(false, 'Bearer')
        this.modalShow = false
        this.$store.commit('deleteUserInfo')
        this.$store.commit('localStorage/logout')
        this.$store.commit('localStorage/CloseOut')
        this.$router.push('/auth')
      }
      */
    },
    getSelectedRoute (route) {
      /*
      if (route === 'solicitudes') {
        return this.$route.name === route ? 'new mt-2' : 'new mt-2'
      } else if (route === 'clientes') {
        return this.$route.name === route ? 'new' : 'new'
      } else if (route === 'request(nuevo)') {
        return this.$route.name === route ? 'new' : 'new'
      } else {
        return this.$route.name === route ? 'text-primary' : 'text-secondary'
      }
      */
      return this.$route.name === route ? 'text-primary' : 'text-secondary'
    },
    async UnviewNotification () {
      await this.$store.dispatch('deleteAllNotifications')
    }
  }
}
</script>
<style lang="scss" scoped>
.alert-polizas {
  display: none;
}
.sidebar-closed {
  display: none !important;
}
.sidebar-open {
  display: flex !important;
}
.refreshingLeads-alert {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  background: #e6f9f4;
  color: #333333;
  font-weight: 500;
}
.btnNotifications {
  display: none;
}
.sidebar-brand {
  width: 100%;
  height: auto;
  padding: 0 32px;
  margin-bottom: 1.5rem;
  object-fit: scale-down;
}
.sidebar-brand-logo {
  width: 100%;
  height: 30px;
  padding: 0 0;
  margin-bottom: 3.5rem;
  -o-object-fit: scale-down;
  object-fit: scale-down;
}
.links {
  display: flex;
  flex-direction: column;
  padding-left: 32px;
  a {
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    color: #fff;
    text-decoration: unset;
    height: 45px;
    line-height: 45px;
    text-align: end;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    svg {
      height: 24px;
      min-width: 20px;
      margin-right: 10px;
    }
  }
  .nuxt-link-active {
    color: #000;
    border-right: 3px solid var(--primary);
  }
}
.header {
  grid-area: header;
  padding: 1.85em 4.5em;
}
.page {
  grid-area: page;
  overflow-y: scroll;
  padding-top: 1.55em;
  padding-left: 1em;
  padding-right: 1em;
  padding-bottom: 1.55em;
  min-height: 0;
}
p {
  margin-bottom: 0 !important;
}
p.time {
  padding-left: 2.4rem;
}

@media (min-width: 768px) {
  .mainA {
    position: absolute !important;
  }
  .mainR {
    position: relative !important;
  }
  .sidebar-closed {
    display: flex !important;
  }
  .sidebar-open {
    display: none !important;
  }
  .btnNotifications {
    display: flex;
  }
  .bnavbar {
    padding: 0 2.5rem;
  }
  .grid-layout {
    display: grid;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background-color: #e7d2f1;
    grid-template-columns: 0.17fr minmax(0, 1fr);
    grid-template-rows: minmax(40px, 65px) minmax(50%, 1fr);
    gap: 0 0;
    grid-template-areas:
      "sidebar header"
      "sidebar page";
  }
  .grid-layout2 {
    display: grid;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background-color: #e7d2f1;
    grid-template-columns: 1fr; /* Aquí faltaba el punto y coma */
    grid-template-rows: minmax(40px, 65px) minmax(50%, 1fr);
    gap: 0 0;
    grid-template-areas:
      "header"
      "page";
  }
  p {
    margin-bottom: 0 !important;
  }
  p.time {
    padding-left: 2.4rem;
  }
  .sidebar {
    grid-area: sidebar;
    padding-top: 5px;
    background: #107c8f;
    display: flex;
    overflow: auto;
  }
  .edit-btn,
  .close-btn {
    padding: 0;
    width: 4.5rem;
    color: #233348;
    border: none;
    background: none;
    .edit-ico {
      margin-right: 0.3rem;
    }
    .close-ico {
      color: red !important;
    }
  }
  .links {
    display: flex;
    flex-direction: column;
    padding-left: 32px;
    a {
      font-style: normal;
      font-weight: 500;
      font-size: 1rem;
      color: #fff;
      text-decoration: unset;
      height: 45px;
      line-height: 45px;
      text-align: end;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      svg {
        height: 24px;
        min-width: 20px;
        margin-right: 10px;
      }
    }
    .nuxt-link-active {
      color: #000;
      border-right: 3px solid var(--primary);
    }
  }
  .sidebar-brand {
    width: 100%;
    height: 120px;
    padding: 0 32px;
    margin-bottom: 1.5rem;
    object-fit: scale-down;
  }
  .sidebar-brand-logo {
    width: 100%;
    height: 30px;
    padding: 0 0;
    margin-bottom: 3.5rem;
    -o-object-fit: scale-down;
    object-fit: scale-down;
  }
  .header {
    grid-area: header;
    padding: 1.85em 4.5em;
  }
  .page {
    grid-area: page;
    overflow-y: scroll;
    padding-top: 1.55em;
    padding-left: 2.4em;
    padding-right: 1.7em;
    padding-bottom: 1.55em;
    min-height: 0;
  }
  .z-index {
    z-index: 99;
  }
  .button {
    display: inline-block; /* Inline elements with width and height. TL;DR they make the icon buttons stack from left-to-right instead of top-to-bottom */
    position: relative; /* All 'absolute'ly positioned elements are relative to this one */
    padding: 2px 5px;
    border-radius: 50%; /* Add some padding so it looks nice */
    background-color: white;
  }
  .edit-ico {
    margin-right: 1.2999999999999998rem;
    top: 0.45rem;
    margin-top: 0.5rem;
  }
  .noseen {
    padding: 0;
    margin-right: 0.3rem;
    border-radius: 50%;
    background: #233348;
    margin-left: 16px;
  }
  /* Make the badge float in the top right corner of the button */
  .button__badge {
    background-color: #fa3e3e;
    border-radius: 50%;
    color: #fa3e3e;
    padding: 1px 3px;
    font-size: 4px;
    position: absolute; /* Position the badge within the relatively positioned button */
    top: 0;
    right: 0;
  }
  .refreshingLeads-alert {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    background: #e6f9f4;
    color: #333333;
    font-weight: 500;
  }
  * {
    &::-webkit-scrollbar {
      width: 7.5px !important;
      height: 7.5px !important;
    }
    &::-webkit-scrollbar-track {
      background: #f1f1f1 !important;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px !important;
      background: rgb(52, 211, 153) !important;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: rgb(5, 150, 105) !important;
    }
  }
  .modalcontent2 {
    height: 200px;
    padding: 0px 80px;
  }
  .modal {
    z-index: 2000;
  }
  .new {
    color: #6461ed;
  }
  .pointer {
    cursor: pointer;
  }
  .alert-polizas {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #e6f9f4;
    color: #333333;
    font-weight: 500;
  }
  .alert-polizas span {
    cursor: pointer;
    color: #233348;
    text-decoration: underline;
  }
  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  .element {
    animation: bounce 1s infinite;
  }
}
</style>
