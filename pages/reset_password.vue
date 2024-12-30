<template>
  <div class="login-page">
    <client-only>
      <div class="container">
        <div class="row">
          <div class="col-lg-6 col-md-10 col-sm-12 mx-auto">
            <div>
              <tr>
                <td
                  align="center"
                  width="23%"
                >
                  <img
                    src="~/assets/simplee.png"
                    class="logo"
                  >
                </td>
              </tr>
            </div>
            <div class="card login">
              <h1>
                Cambio de contraseña
              </h1>
              <p>
                Has solicitado restablecer tu contraseña de Service Swicth.
                Ingresa tu nueva contraseña a continuación
              </p>
              <form
                v-if="active_view == 'reset'"
                class="form-group"
                @submit.prevent="handleSendRePassForm"
              >
                <div class="login__field">
                  <span class="login__icon">
                    <fa-icon
                      :icon="['fas', 'lock']"
                      class="login__icon"
                    />
                  </span>
                  <input
                    v-model="password"
                    class="login__input"
                    placeholder="Nueva Contraseña"
                    required
                    type="password"
                    minlength="6"
                    maxlength="30"
                  >
                </div>
                <div class="login__field">
                  <span class="login__icon">
                    <fa-icon
                      :icon="['fas', 'lock']"
                      class="login__icon"
                    />
                  </span>
                  <input
                    v-model="repeat_password"
                    class="login__input"
                    placeholder="Confirmación Contraseña"
                    required
                    type="password"
                    minlength="6"
                    maxlength="30"
                  >
                </div>
                <tr>
                  <td
                    width="20%"
                    align="center"
                  >
                    <button
                      class="sesion"
                      type="submit"
                      variant="primary"
                    >
                      Cambiar Contraseña
                    </button>
                  </td>
                </tr>
              </form>
            </div>
            <Modalalert
              v-show="modalaviso"
              mensaje="Gracias. Tu contraseña se ha restablecido con éxito!"
              title="Contraseña restablecida"
              mensajebotton="Iniciar Sesión"
              @buttonaction="Reditsesion"
            />
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import Session from '@/mixins/no-auth'
import Modalalert from '~/components/Modalalert.vue'

export default {
  components: {
    Modalalert
  },
  mixins: [Session],
  layout: 'no-auth',
  data () {
    return {
      active_view: 'reset',
      password: '',
      repeat_password: '',
      modalaviso: false
    }
  },
  methods: {
    async handleSendRePassForm (dato) {
      const passwordsMath = this.password === this.repeat_password
      const query = this.$route.query
      if (passwordsMath) {
        try {
          await this.$simpleeApi.post('auth/password_reset/confirm/', {
            password: this.password,
            token: query.token
          })
          this.active_view = ''
          this.modalaviso = true
        } catch (error) {
          let message = ''
          if (error.response.data.password) {
            message = error.response.data.password[0]
          } else {
            message = 'No se pudo restablecer la contraseña'
          }
          const variant = 'danger'
          this.$bvToast.toast(message, {
            variant,
            solid: true
          })
          this.$store.commit('setAlertMessage', error.response.data)
        }
      } else {
        const message = 'Las contraseñas no coinciden'
        const variant = 'danger'
        this.$bvToast.toast(message, {
          variant,
          solid: true
        })
      }
    },
    Reditsesion () {
      this.$router.push({ path: '/auth' })
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  line-height: 1rem;
}

a:hover {
  text-decoration: none;
}

.card {
  width: 550px;
  height: 470px;
  padding: 35px;
  background-color: #f8f8f8;
  border-radius: 15px;
  margin-bottom: 60px;
}

.card h1 {
  font-family: Rubik;
  font-style: normal;
  font-weight: 500;
  font-size: 33px;
  line-height: 47px;
  text-align: center;
  color: #233348;
  margin-bottom: 20px;
}
.card p {
  font-family: Rubik;
  font-style: normal;
  font-weight: 450;
  font-size: 15px;
  line-height: 20px;
  text-align: center;
  color: #cfcfcf;
}

.card button.sesion {
  margin-top: 12px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 17px 31px;
  background: #233348;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #fff;
}

.login__field {
  padding: 10px 0px;
  position: relative;
}

.login__icon {
  position: absolute;
  top: 23px;
  font-family: Font Awesome 5 Free;
  font-style: normal;
  font-weight: normal;
  font-size: 17px;
  line-height: 23px;
  left: 5%;

  color: #acacac;
}

.login__input {
  background: #ffff;
  border-radius: 5px;
  font-family: Rubik;
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 24px;
  border: 1px solid #cfcfcf;
  padding: 23px 23px;
  margin: 8px 0;
  width: 100%;
  text-align: left;
  color: #cfcfcf;
  height: auto;
}

input.login__input {
  padding-left: 64px;
}
.login__input:active,
.login__input:focus,
.login__input:hover {
  outline: none;
}
.sincuenta {
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 21px;
  cursor: pointer;
  color: #acacac;
}
.sincuenta a {
  font-weight: bold;
  color: #4ad7b4;
  text-decoration: underline;
}

.logo {
  width: 180px;
  height: 70px;
  z-index: 1;
  margin-bottom: 20px;
}

.login-page {
  align-items: center;
  display: flex;
  height: 90vh;
}

@media (min-width: 48rem) {
  #container {
    transform: scale(0.725rem);
  }
}

@media (min-width: 62rem) {
  #container {
    transform: scale(0.85);
  }
}
</style>
