<template>
  <div class="main-container">
    <h4>Estatus Asignaciones</h4>
    <table>
      <tr>
        <th>
          KAMS
        </th>
        <th class="text-center">
          Asignaciones
        </th>
      </tr>

      <tr
        v-for="(row, index) in kams.results"
        :key="row.id"
        :class="i%2==0 && 'bg-gray'"
      >
        <td>
          <p>
            {{ getLeadUser(row.user) }}
          </p>
        </td>

        <td class="center" align="center">
          <p>
            {{ row.counter }}
          </p>
        </td>

      </tr>
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
      Ussers: {},
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
    this.datakams()
  },
  computed: {
    ...mapState('leads', ['users'])
  },
  methods: {
    async datakams () {
      try {
        const dat = await this.$simpleeApi.get('/user_assignation/')
        //console.log('user_assignation', dat)
        //console.log('users', this.users)
        this.kams = dat.data
        this.selectedRoles = []
      } catch (error) {
        this.$store.commit('setAlertMessage', error.response.data)
      }
    },
    getLeadUser (user) {
      if (user) {
        const leadUser = this.users.find(({ id }) => user === id)
        if(leadUser){ 
          let nameUser = leadUser.first_name
          if (leadUser.last_name) { nameUser = nameUser + ' ' + leadUser.last_name }
          return nameUser || leadUser.email || leadUser.email.split('@')[0]
        } else {
          return user
        }
      }
      return ''
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
    color: #acacac;
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
