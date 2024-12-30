<template>
  <div class="main-container">
    <h4>Administrar Roles</h4>
    <div class="row-container2">
      <button class="save-user" @click="saveCambios">
        Guardar cambios
      </button>
    </div>
    <table>
      <tr>
        <th>
          Usuarios
        </th>
        <th class="text-center">
          Rol Actual
        </th>
        <th class="text-center">
          Cambiar Rol
        </th>
      </tr>

      <tr
        v-for="(row, index) in kams.results"
        :key="row.id"
        :class="i%2==0 && 'bg-gray'"
      >
        <td>
          <p>
            {{ getLeadUser(row.id) }}
          </p>
        </td>

        <td class="center" align="center">
          <p>
            {{ getUserRol(row.role) }}
          </p>
        </td>

        <td align="center">
          <select
            v-model="selectedRoles[index]"
          >
            <option v-for="op in roles" :key="op.value" :value="op.value">
              {{ op.label }}
            </option>
          </select>
        </td>
      </tr>
      <p v-if="kams.results && (kams.results.length < kams.count)" class="more" @click="vertodos(page)">
        {{ `Ver Mas (${kams.count - enpantalla })` }}
      </p>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    val: {
      type: Array,
      required: true
    },
    channels: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      kams: {},
      page: 2,
      enpantalla: 25,
      roles: [
        { value: 'OWNER', label: 'OWNER' },
        { value: 'BASE', label: 'BASE' },
        { value: 'KAM', label: 'KAM' },
        { value: 'POST_VENTA', label: 'POST VENTA' },
        { value: 'DIRECTORA_COMERCIAL', label: 'DIRECTORA COMERCIAL' },
        { value: 'DEVELOPER', label: 'DEVELOPER' }
      ],
      selectedRoles: []
    }
  },
  created () {
    this.datausers()
  },
  computed: {
    ...mapState('leads', ['users'])
  },
  methods: {
    async datausers () {
      try {
        const dat = await this.$simpleeApi.get('/profileRole')
        this.kams = dat.data
        this.selectedRoles = []
      } catch (error) {
        this.$store.commit('setAlertMessage', error.response.data)
      }
    },
    async vertodos (pag) {
      try {
        const dat = await this.$simpleeApi.get(`/profileRole/?page=${pag}`)
        this.page = this.page + 1
        this.enpantalla = this.enpantalla + 25
        this.kams.results = this.kams.results.concat(dat.data.results)
      } catch (error) {
        this.$store.commit('setAlertMessage', error.response.data)
      }
    },
    async saveCambios () {
      if (this.selectedRoles) {
        for (let i = 0; i < this.selectedRoles.length; i++) {
          if (this.selectedRoles[i]) {
            const element = this.selectedRoles[i]
            const aguardar =
            {
              id: this.kams.results[i].id,
              first_name: this.getUserName(this.kams.results[i].id),
              last_name: this.getUserLastName(this.kams.results[i].id),
              email: this.getUserEmail(this.kams.results[i].id),
              role: element
            }
            try {
              await this.$simpleeApi.put(`/profileRole/${this.kams.results[i].id}/`, aguardar)
              this.$store.commit('setAlertMessage', {
                success: 'Se ha actualizado los Roles!'
              })
            } catch (error) {
              this.$store.commit('setAlertMessage', error.response.data)
            }
          }
        }
        this.page = 2
        this.enpantalla = 25
        this.datausers()
      }
    },
    getLeadUser (user) {
      if (user) {
        const leadUser = this.users.find(({ id }) => user === id)
        let nameUser = leadUser.first_name
        if (leadUser.last_name) { nameUser = nameUser + ' ' + leadUser.last_name }
        return nameUser || leadUser.email.split('@')[0]
      }
      return ''
    },
    getUserName (user) {
      if (user) {
        const leadUser = this.users.find(({ id }) => user === id)
        return leadUser.first_name || null
      }
      return ''
    },
    getUserLastName (user) {
      if (user) {
        const leadUser = this.users.find(({ id }) => user === id)
        return leadUser.last_name || null
      }
      return ''
    },
    getUserEmail (user) {
      if (user) {
        const leadUser = this.users.find(({ id }) => user === id)
        return leadUser.email || null
      }
      return ''
    },
    getUserRol (role) {
      const roleview = role.replace(/_/g, ' ')
      return roleview
    }
  }
}
</script>

  <style lang="scss" scoped>
  .submain {
    display: flex;
  }
  .main-container {
    width: 70%;
    margin: 2.5rem 0 0 0;
    padding-bottom: 2rem;
    border-bottom: 1px solid #cccbcb;
    &:last-child {
      padding-bottom: 3rem;
      border: none;
    }
    h4,
    h5 {
      font-size: 1rem;
      font-weight: 500;
      margin: 0;
    }
    p {
      margin: 0;
    }
    h4 {
      margin-bottom: 1.5rem;
    }
    .table {
      width: 90%;
      position: relative;
      left: 2%;
      .rowchannels {
        background-color: #f8f8f8;
        display: grid;
        grid-template-columns: 30% 37% 15% 10% 8%;
        align-items: center;
        padding: 0.5rem 1rem;
        position: relative;
        border-right: 2px solid #eac9c9;
        input {
          width: 90%;
          padding: 0 0.7rem;
        }
        .add {
          position: absolute;
          width: 1.7rem;
          height: 1.7rem;
          left: 105%;
          top: 0;
          cursor: pointer;
        }
        .actions-container {
          display: flex;
          justify-content: space-around;
          img {
            height: 1.8rem;
            width: 1.8rem;
            cursor: pointer;
          }
        }
      }
      .row {
        background-color: #f8f8f8;
        margin-top: 0.5rem;
        display: grid;
        grid-template-columns: 40% 43% 17%;
        align-items: center;
        padding: 0.5rem 1rem;
        position: relative;
        input {
          width: 90%;
          padding: 0 0.7rem;
        }
        .add {
          position: absolute;
          width: 1.7rem;
          height: 1.7rem;
          left: 105%;
          top: 0;
          cursor: pointer;
        }
        .actions-container {
          display: flex;
          justify-content: space-around;
          img {
            height: 1.8rem;
            width: 1.8rem;
            cursor: pointer;
          }
        }
      }
    }
    .more {
      width: fit-content;
      color: #233348;
      text-decoration: #233348;
      &:hover {
        cursor: pointer;
        text-decoration: solid underline #233348;
      }
    }
  }
  select {
    appearance: auto !important;
    color: #233348;
    height: 34px;
    background: #ffffff;
    border: 1px solid #e1e1e1;
    box-sizing: border-box;
    border-radius: 5px;
    width: 90%;
    padding: 0 0.7rem;
  }
  .icon {
    font-size: 16px;
    cursor: pointer;
  }
  .row-container2 {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  }
  .save-user {
    margin-bottom: 30px;
    border-color: transparent;
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
  </style>
