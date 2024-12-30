<template>
  <div>
    <div class="main-container">
      <div class="section-container">
        <div class="row-container header">
          <h2>Configuración general de la cuenta</h2>
          <button
            v-if="editing !== 'nombre'"
            class="edit-btn"
            @click="setOpenMenu('nombre')"
          >
            <fa-icon
              :icon="['fas', 'edit']"
              class="text-primary edit-ico"
            />Editar
          </button>
        </div>
        <div class="bottom-info">
          <div v-if="editing !== 'nombre'">
            <div class="row-container">
              <h3>Nombre</h3>
              <p>
                {{ `${firstName} ${lastName}` }}
              </p>
            </div>
            <div class="row-container">
              <h3>Correo electronico</h3>
              <p>
                {{ email }}
              </p>
            </div>
            <div class="row-container">
              <h3>Fecha Nacimiento</h3>
              <p>
                {{ Born_date }}
              </p>
            </div>
            <div class="row-container">
              <h3>Sobre ti</h3>
              <p>
                {{ About }}
              </p>
            </div>
          </div>
          <div v-else>
            <div class="row-container">
              <div class="name-box">
                <h2>Nombre-Apellido</h2>
                <input
                  v-model="firstName"
                  type="text"
                  placeholder="Nombre"
                >
                <div />
                <input
                  v-model="lastName"
                  type="text"
                  placeholder="Apellido"
                >
              </div>
              <div />
            </div>
            <div class="row-container">
              <div class="name-box">
                <h2>Fecha Nacimiento</h2>
                <input
                  v-model="Born_date_edit"
                  type="date"
                  placeholder="Fecha Nacimiento"
                >
              </div>
              <div />
            </div>
            <div class="row-container">
              <div class="name-box">
                <h2>Sobre Ti</h2>
                <textarea
                  v-model="About"
                  placeholder="Escribe sobre ti"
                  rows="3"
                />
                <div />
              </div>
              <div />
            </div>
          </div>
          <div
            v-if="editing === 'nombre'"
            class="row-container"
          >
            <button
              class="save-user"
              @click="changeName"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
      <div class="section-container">
        <div class="row-container header">
          <h2>Inicio de sesión</h2>
        </div>
        <div class="bottom-info">
          <div class="row-container">
            <h3>Cambiar contraseña</h3>
            <div
              v-if="editing === 'password'"
              class="change-password-box"
            >
              <div class="input-box">
                <h2>Actual</h2>
                <input
                  v-model="password.old_password"
                  type="password"
                >
              </div>
              <div class="input-box">
                <h2>Nueva</h2>
                <input
                  v-model="password.new_password"
                  type="password"
                >
              </div>
              <div class="input-box">
                <h2>Repetir nueva</h2>
                <input
                  v-model="password.confirmed_new_password"
                  type="password"
                >
                <button
                  class="save-btn"
                  @click="changePassword"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
            <button
              v-if="editing !== 'password'"
              class="edit-btn"
              name="password"
              @click="setOpenMenu('password')"
            >
              <fa-icon
                :icon="['fas', 'edit']"
                class="text-primary edit-ico"
              />Editar
            </button>
            <button
              v-else
              class="close-btn"
              @click="setOpenMenu()"
            >
              <fa-icon
                :icon="['fas', 'times']"
                class="text-primary edit-ico close-ico"
              />Cerrar
            </button>
          </div>
        </div>
      </div>
      <b-overlay
        :show="loading"
        spinner-variant="primary"
        spinner-type="grow"
        spinner-small
        rounded="sm"
      >
        <div class="section-container">
          <div class="row-container header">
            <h2>Administrar</h2>
          </div>
          <div class="bottom-info">
            <!--
            <div
              v-if="$store.state.localStorage.user.is_superuser"
              class="row-container"
            >
              <h3>Asignar metas</h3>
              <div
                v-if="editing === 'goals-assign'"
                class="asignar-metas-box"
              >
                <div class="input-box">
                  <h2>Ejecutivo</h2>
                  <select v-model="selectedMonth">
                    <option
                      v-for="month in months"
                      :key="month.id"
                      :value="month.id - 1"
                    >
                      {{ month.month.substring(0, 3) }}
                    </option>
                  </select>
                  <h2>Meta en UF</h2>
                </div>
                <GoalForm
                  v-for="executive in fullInfoExecutives"
                  :key="executive.id"
                  :executive="executive"
                  :goals="goals"
                  :selected-month="selectedMonth"
                  @reload="getGoals"
                />
              </div>
              <button
                v-if="editing !== 'goals-assign'"
                class="edit-btn"
                name="goals-assign"
                @click="setOpenMenu('goals-assign')"
              >
                <fa-icon
                  :icon="['fas', 'edit']"
                  class="text-primary edit-ico"
                />Editar
              </button>
              <button
                v-else
                class="close-btn"
                @click="setOpenMenu()"
              >
                <fa-icon
                  :icon="['fas', 'times']"
                  class="text-primary edit-ico close-ico"
                />Cerrar
              </button>
            </div>
            -->
        
    
            <div
              class="row-container"
            >
              <!-- v-if="$store.state.localStorage.user.is_superuser" -->
              <h3>Gestionar permisos</h3>
              <div
                v-if="editing === 'permits-manager'"
                class="col-container"
              >
                <permitsManager
                  title="¿Quien puede borrar productos?"
                  :value="permissions.can_delete_lead || []"
                  :executives="executives"
                  @emitedValue="permissions.can_delete_lead = $event"
                />
                <permitsManager
                  title="¿Quien puede modificar estados de polizas?"
                  :value="permissions.can_change_police_state || []"
                  :executives="executives"
                  @emitedValue="permissions.can_change_police_state = $event"
                />
                <permitsManager
                  title="¿Quien puede emitir polizas?"
                  :value="permissions.can_make_discount || []"
                  :executives="executives"
                  @emitedValue="permissions.can_make_discount = $event"
                />
              </div>
              <button
                v-if="editing !== 'permits-manager'"
                class="dropdown-btn"
                name="permits-manager"
                @click="setOpenMenu('permits-manager')"
              >
                <fa-icon
                  :icon="['fas', 'chevron-down']"
                  class="text-primary drop-ico"
                />
              </button>
              <button
                v-else
                class="close-btn"
                @click="setOpenMenu()"
              >
                <fa-icon
                  :icon="['fas', 'chevron-up']"
                  class="text-primary drop-ico"
                />
              </button>
            </div>
            <div
              v-if="$store.state.localStorage.user.is_superuser"
              class="row-container"
            >
              <h3>Gestionar entradas</h3>
              <div
                v-if="editing === 'entrances-manager'"
                class="entrances"
              >
                <EntrancesTable
                  name="canales"
                  :val="leads.channels"
                  :channels="leads.channels"
                  @refresh="$store.dispatch('leads/getChannels')"
                />
              </div>
              <button
                v-if="editing !== 'entrances-manager'"
                class="dropdown-btn"
                name="entrances-manager"
                @click="setOpenMenu('entrances-manager')"
              >
                <fa-icon
                  :icon="['fas', 'chevron-down']"
                  class="text-primary drop-ico"
                />
              </button>
              <button
                v-else
                class="close-btn"
                @click="setOpenMenu()"
              >
                <fa-icon
                  :icon="['fas', 'chevron-up']"
                  class="text-primary drop-ico"
                />
              </button>
            </div>
            <div
              v-if="$store.state.localStorage.user.role === 'OWNER' || $store.state.localStorage.user.role === 'DEVELOPER'"
              class="row-container"
            >
              <h3>Gestionar Usuarios</h3>
              <div
                v-if="editing === 'asignaciones'"
                class="entrances"
              >
                <AsignacionTable
                  name="canales"
                  :val="leads.channels"
                  :channels="leads.channels"
                  @refresh="$store.dispatch('leads/getChannels')"
                />
                <AsiganacionTableList :val="leads" />
              </div>
              <button
                v-if="editing !== 'asignaciones'"
                class="dropdown-btn"
                name="asignaciones"
                @click="setOpenMenu('asignaciones')"
              >
                <fa-icon
                  :icon="['fas', 'chevron-down']"
                  class="text-primary drop-ico"
                />
              </button>
              <button
                v-else
                class="close-btn"
                @click="setOpenMenu()"
              >
                <fa-icon
                  :icon="['fas', 'chevron-up']"
                  class="text-primary drop-ico"
                />
              </button>
            </div>
            <div
              v-if="$store.state.localStorage.user.role === 'OWNER' || $store.state.localStorage.user.role === 'DEVELOPER'"
              class="row-container"
            >
              <h3>Configuración Productos</h3>
              <div
                v-if="editing === 'Configasignaciones'"
                class="entrances"
              >
                <ConfigAsignaciones />
              </div>
              <button
                v-if="editing !== 'Configasignaciones'"
                class="dropdown-btn"
                name="Configasignaciones"
                @click="setOpenMenu('Configasignaciones')"
              >
                <fa-icon
                  :icon="['fas', 'chevron-down']"
                  class="text-primary drop-ico"
                />
              </button>
              <button
                v-else
                class="close-btn"
                @click="setOpenMenu()"
              >
                <fa-icon
                  :icon="['fas', 'chevron-up']"
                  class="text-primary drop-ico"
                />
              </button>
            </div>

            <div
              v-if="$store.state.localStorage.user.role === 'OWNER' || $store.state.localStorage.user.role === 'DEVELOPER'"
              class="row-container"
            >
              <h3>Gestionar Roles</h3>
              <div
                v-if="editing === 'roles'"
                class="entrances"
              >
                <AsignRole
                  name="canales"
                  :val="leads.channels"
                  :channels="leads.channels"
                  @refresh="$store.dispatch('leads/getChannels')"
                />
              </div>
              <button
                v-if="editing !== 'roles'"
                class="dropdown-btn"
                name="roles"
                @click="setOpenMenu('roles')"
              >
                <fa-icon
                  :icon="['fas', 'chevron-down']"
                  class="text-primary drop-ico"
                />
              </button>
              <button
                v-else
                class="close-btn"
                @click="setOpenMenu()"
              >
                <fa-icon
                  :icon="['fas', 'chevron-up']"
                  class="text-primary drop-ico"
                />
              </button>
            </div>
          </div>
        </div>
      </b-overlay>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Session from '@/mixins/auth'
import Months from '@/static/months.json'
import permitsManager from '@/components/permitsManager.vue'
import EntrancesTable from '@/components/EntrancesTable.vue'
import EntrancesTableEtiquetas from '@/components/EntrancesTableEtiquetas.vue'
import AsignacionTable from '@/components/AsignacionTable.vue'
import AsignRole from '@/components/AsignRole.vue'
import Signature from '@/components/Signature.vue'
import AsiganacionTableList from '~/components/AsiganacionTableList.vue'
import ConfigAsignaciones from '~/components/ConfigAsignaciones.vue'
export default {
  components: {
    permitsManager,
    EntrancesTable,
    AsignacionTable,
    AsignRole,
    EntrancesTableEtiquetas,
    Signature,
    AsiganacionTableList,
    ConfigAsignaciones
  },
  mixins: [Session],
  data () {
    return {
      loading: false,
      editing: '',
      months: Months,
      campanas: [],
      goals: [],
      firstName: '',
      lastName: '',
      Born_date: '',
      Born_date_edit: '',
      About: '',
      password: {
        old_password: '',
        new_password: '',
        confirmed_new_password: ''
      },
      executives: [],
      selectedMonth: new Date().getMonth(),
      permissions: {},
      permissionsCopy: {},
      goalsmetas: [],
      goalsedit: []
    }
  },
  computed: {
    ...mapState(['localStorage', 'leads']),
    computedGoals () {
      const newGoals = []
      this.goals.forEach((goal) => {
        const month = new Date(goal.end_date).getMonth() + 1
        const newGoal = {
          id: goal.id,
          amount: goal.amount,
          user: goal.user,
          month
        }
        newGoals.push(newGoal)
      })
      return newGoals
    },
    computedExecutives () {
      const newExecutives = []
      this.executives.forEach((executive) => {
        const goals = this.computedGoals.filter(goal => goal.user === executive.id)
        if (goals.length > 0 && executive.first_name) {
          const newExecutive = {
            id: executive.id,
            name: executive.first_name,
            goals,
            edit: false
          }
          newExecutives.push(newExecutive)
        } else if (goals.length < 1 && executive.first_name) {
          const newExecutive = {
            id: executive.id,
            name: executive.first_name,
            goals: [{
              id: 0,
              amount: 0,
              user: executive.id,
              month: 0
            }],
            edit: false
          }
          newExecutives.push(newExecutive)
        }
      })
      return newExecutives
    },
    fullInfoExecutives () {
      return this.executives.filter(ex => ex.first_name)
    }
  },
  watch: {
    permissions: {
      deep: true,
      handler (newVal) {
        const oldValues = Object.values(this.permissionsCopy)
        const newValues = Object.values(newVal)
        newValues.forEach((nVal, i) => {
          if (nVal.length > oldValues[i].length) {
            this.sendPermissions(nVal.find(nv => !oldValues[i].includes(nv)))
          } else if (nVal.length < oldValues[i].length) {
            this.sendPermissions(oldValues[i].find(nv => !nVal.includes(nv)))
          }
        })
      }
    }
  },
  created () {
    console.log('asadkasd', this.leads)
    // this.$store.dispatch('getEtiquetas')
    this.email = this.localStorage.user.email
    this.name = this.localStorage.user.first_name
    this.getUsers()
    this.getCampanas()
    // this.getEtiquetas()
    this.getName()
    this.getGoals()
    this.getPermissions()
    console.log(this.$store.state.localStorage.user.role)
  },
  methods: {
    async getUsers () {
      const data = await this.$getUsers()
      this.executives = data.results.sort((a, b) => a.first_name.localeCompare(b.first_name))
    },
    async getName () {
      const data = await this.$getProfile()
      if (!data) { return }
      this.firstName = await data.first_name
      this.lastName = await data.last_name
      this.About = await data.about
      this.Born_date_edit = await data.born_date
      const date = await data.born_date
      this.Born_date = date.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$3/$2/$1')
    },
    async changeName () {
      if (!this.firstName || !this.lastName || !this.About || !this.Born_date_edit) {
        this.$store.commit('setAlertMessage', { error: 'Todos los campos son obligatorios' })
        return
      }
      const user = {
        first_name: this.firstName,
        last_name: this.lastName,
        born_date: this.Born_date_edit,
        about: this.About
      }
      await this.$changeName(user)
      await this.getName()
      this.editing = ''
    },
    setOpenMenu (menu = '') {
      this.editing = menu
    },
    async changePassword () {
      // eslint-disable-next-line camelcase
      const { new_password, confirmed_new_password, old_password } = this.password
      if (new_password.length === 0 || confirmed_new_password.length === 0) {
        this.$store.commit('setAlertMessage', { error: 'Todos los campos son obligatorios' })
        return
      }
      // eslint-disable-next-line camelcase
      if (new_password !== confirmed_new_password) {
        this.$store.commit('setAlertMessage', { error: 'Ambas contraseñas deben coincidir' })
        return
      }
      // eslint-disable-next-line camelcase
      if (old_password === new_password) {
        this.$store.commit('setAlertMessage', { error: 'La nueva contraseña debe ser diferente a la anterior' })
        return
      }
      const res = await this.$changePassword(this.password)
      if (!res) {
        this.$store.commit('setAlertMessage', { error: 'La contraseña actual es incorrecta' })
        return
      }
      this.$store.commit('localStorage/UPLOAD_TOKEN', res.token)
      this.$store.commit('setAlertMessage', { success: res.message })
      this.password = {
        old_password: '',
        new_password: '',
        confirmed_new_password: ''
      }
    },
    async getGoals () {
      if (this.$store.state.localStorage.user.is_superuser) {
        let stop = ''
        let i = 1
        let goalsold = ''
        while (stop !== null) {
          const goals = await this.$getGoalsNew(i)
          if (!goalsold) {
            goalsold = goals.results
          } else {
            goalsold = goalsold.concat(goals.results)
          }
          stop = goals.next
          i = i + 1
        }
        this.goals = goalsold
        this.goalsmetas = this.computedExecutives
      }
    },
    getRowUF (goals, monthId) {
      const amount = goals.find(goal => goal.month === monthId)
      if (!amount) {
        return 0
      } else {
        return amount.amount
      }
    },
    getTotalRow (goals) {
      return goals.reduce((acc, curr) => acc + curr.amount, 0)
    },
    async getPermissions () {
      this.permissions = await this.$getAllPermissions()
      this.permissionsCopy = { ...this.permissions }
    },
    async sendPermissions (user) {
      const userPermissions = {
        user,
        can_delete_lead: this.permissions.can_delete_lead.includes(user),
        can_change_police_state: this.permissions.can_change_police_state.includes(user),
        can_make_discount: this.permissions.can_make_discount.includes(user)
      }
      const exist = this.localStorage.userPermissions
      if (exist) { userPermissions.id = exist.id }
      await console.log(userPermissions)
      await this.$updatePermissions(userPermissions)
      // this.getPermissions()
    },
    async Updategoal () {
      this.loading = true
      for (let i = 0; i < 12; i++) {
        if (this.goalsedit[i].value) {
          this.goalsedit[i].mes = this.goalsedit[i].mes - 1
          const currentYear = new Date().getFullYear()
          const startdate = new Date(currentYear, this.goalsedit[i].mes, 1).toISOString().split('T')[0]
          const enddate = new Date(currentYear, this.goalsedit[i].mes + 1, 0).toISOString().split('T')[0]
          const goalsNew = {
            amount: this.goalsedit[i].value,
            start_date: startdate,
            end_date: enddate,
            user: this.goalsedit[i].user
          }
          console.log(goalsNew)
          console.log(this.goalsedit[i].idgoal)
          if (this.goalsedit[i].new === true) {
            await this.$setNewGoal({ ...goalsNew, update: true, id: this.goalsedit[i].idgoal })
          } else {
            await this.$setNewGoal(goalsNew)
          }
        }
        this.goalsmetas[i].edit = false
      }
      this.getGoals()
      this.loading = false
      // this.$store.commit('setAlertMessage', { success: 'Se ha actualizado las metas!' })
    },
    async getCampanas () {
      const campanas = await this.$getCampana()
      this.campanas = campanas
    },
    Editgoal (index, goals, user) {
      this.loading = true
      const conteo = (this.goalsmetas.length)
      for (let i = 0; i < conteo; i++) {
        console.log(i)
        const editgpal = {
          value: '',
          new: false,
          idgoal: '',
          mes: '',
          user: ''
        }
        console.log(this.goalsmetas[i].edit)
        this.goalsedit.push(editgpal)
        this.goalsmetas[i].edit = false
        const amount = goals.find(goal => goal.month === i + 1)
        if (!amount) {
          this.goalsedit[i].value = 0
          this.goalsedit[i].user = user
          this.goalsedit[i].mes = i + 1
        } else {
          this.goalsedit[i].value = amount.amount
          this.goalsedit[i].idgoal = amount.id
          this.goalsedit[i].mes = i + 1
          this.goalsedit[i].user = amount.user
          this.goalsedit[i].new = true
        }
      }
      if (this.goalsmetas[index].edit) {
        this.goalsmetas[index].edit = false
      } else {
        this.goalsmetas[index].edit = true
      }
      this.loading = false
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
textarea {
  color: #233348;
  resize: none;
  background: #ffffff;
  border: 1px solid #e1e1e1;
  box-sizing: border-box;
  border-radius: 5px;
  width: 400px;
  padding: 0 1rem;
  outline: none;
  &:focus {
    border: 1px solid #056d53;
  }
}
input,
textarea,
button {
  font-size: 0.9rem;
}
.main-container {
  width: 100%;
  .section-container {
    margin-bottom: 2rem;
    border-radius: 5px;
    background: #fff;
    -webkit-box-shadow: 0px 2px 5px 0px rgba(148, 139, 148, 0.2);
    -moz-box-shadow: 0px 2px 5px 0px rgba(148, 139, 148, 0.2);
    box-shadow: 0px 2px 5px 0px rgba(148, 139, 148, 0.2);
    .row-container {
      position: relative;
      display: flex;
      align-items: center;
      padding: 0;
      min-height: 3.5rem;
      border-bottom: 1px solid rgba(156, 154, 154, 0.3);
      &:last-child {
        border: none;
      }
      h3 {
        font-size: 1.05rem;
        font-weight: 400;
        width: 30%;
        position: relative;
        left: 0;
        top: 1.25rem;
        align-self: flex-start;
      }
      h2 {
        font-size: 1.05rem;
        font-weight: 400;
        width: 100%;
        position: relative;
        left: 0;
        top: 0.25rem;
        align-self: flex-start;
      }
      button {
        border: none;
        background: none;
        position: absolute;
        right: 0;
        top: 1.25rem;
      }
      .edit-btn,
      .close-btn {
        padding: 0;
        width: 4.5rem;
        color: #233348;
        .edit-ico {
          margin-right: 0.3rem;
          cursor: pointer;
        }
        .close-ico {
          color: red !important;
        }
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
      .save-user {
        position: relative !important;
        top: 0.6rem;
        color: #fff;
        background-color: #233348;
        border-radius: 5px;
        height: 65%;
        /* max-height: 2.5rem; */
        padding: 0.4rem 1rem;
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
          width: 50%;
          &:last-child {
            margin-left: 1rem;
          }
        }
      }
      .change-password-box,
      .asignar-metas-box {
        width: 50%;
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
        margin: 1rem;
        width: 100%;
        position: relative;
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
            padding-left: 14px;
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
            text-align: center;
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
      border-bottom: 2px solid rgba(156, 154, 154, 0.4);
      h2 {
        font-size: 1.05rem;
      }
    }
    .bottom-info {
      padding: 0 2rem 0.25rem 2rem;
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
.input-box {
  margin-right: 2px;
  margin-left: 2px;
  grid-template-columns: 17% 15% 40% 28%;
  grid-column-gap: 5px;
  align-items: center;
  display: flex;
  h3,
  p {
    font-size: 0.9rem;
    top: 0.45rem;
  }
  p {
    color: gray;
    position: relative;
    top: 0.4rem;
  }
  input {
    appearance: none;
    padding: 0 7px;
    outline: none;
    width: 80%;
    border: 1px solid #233348;
    &:focus {
      border: 1px solid #056d53 !important;
    }
  }
  .input-error {
    border: 2px solid red;
  }
  input,
  button {
    font-size: 0.9rem;
  }
}
.cursor-button {
  cursor: pointer;
}

.icogoals {
  font-size: 18px;
}
</style>
