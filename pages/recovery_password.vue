<template>
  <div class="login-page">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 col-md-10 col-sm-12 mx-auto paddContainer">
          <div class="mtlogo">
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
          <div
            v-if="active_view == 'recovery'"
            class="card login"
          >
            <h1>
              Restablecer tu contraseña
            </h1>
            <p>
              Para obtener instrucciones para restablecer tu contraseña, por favor,
              introduce la dirección de correo electrónico asociada a tu cuenta de Simplee
              Teams
            </p>
            <form
              class="form-group"
              @submit.prevent="handleSendReForm"
            >
              <div class="login__field">
                <span class="login__icon">
                  <fa-icon
                    :icon="['fas', 'envelope']"
                    class="login__icon"
                  />
                </span>
                <input
                  v-model="email"
                  class="login__input"
                  placeholder="Email"
                  required
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
                    Enviar Instrucciones
                  </button>
                </td>
              </tr>
            </form>
          </div>
          <div
            v-if="active_view == 'mensaje'"
            class="card login"
          >
            <h1>
              Comprueba tu bandeja de entrada
            </h1>
            <p>
              Si ya existe una cuenta de Service Swicth con el {{ email_recovery }} se enviará un
              correo electrónico con más instrucciones
            </p>
            <p>
              Si no has recibido el correo electrónico, por favor comprueba la
              carpeta de correo no deseado o contacta con nosotros
            </p>
            <form class="form-group">
              <tr>
                <td
                  width="20%"
                  align="center"
                >
                  <nuxt-link :to="{ name: 'auth' }">
                    <button class="sesion">
                      Iniciar Sesión
                    </button>
                  </nuxt-link>
                </td>
              </tr>
            </form>
          </div>
          <div class="pbnoCuent">
            <tr v-if="active_view == 'recovery'">
              <td
                align="center"
                width="50%"
              >
                <span class="sincuenta">
                  ¿No tienes una cuenta?
                  <nuxt-link
                    :to="{ name: 'auth', params: { active_view: 'register' } }"
                    class="sincuenta"
                  >¡Registrate!
                  </nuxt-link>
                </span>
              </td>
            </tr>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Session from '@/mixins/no-auth'

export default {
  mixins: [Session],
  layout: 'no-auth',
  data () {
    return {
      active_view: 'recovery',
      email: '',
      email_recovery: ''
    }
  },
  methods: {
    async handleSendReForm () {
      const message = 'El correo enviado no esta registrado en Service Swicth'
      const variant = 'danger'
      try {
        await this.$simpleeApi.post('/auth/password_reset/', { email: this.email })
        this.email_recovery = this.email
        this.active_view = 'mensaje'
      } catch (error) {
        this.$bvToast.toast(message, {
          variant,
          solid: true
        })
        this.$store.commit('setAlertMessage', error.response.data)
      }
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
  width: 100%;
  height: auto;
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 15px;
  margin-bottom: 60px;
}
.mtlogo {
  margin-top: 9rem;
}
.pbnoCuent {
  padding-bottom: 2rem;
}
.card h1 {
  font-family: Rubik;
  font-style: normal;
  font-weight: 500;
  font-size: 1.7rem;
  line-height: 47px;
  text-align: center;
  color: #233348;
  margin-bottom: 20px;
}
.card button.sesion {
  margin-top: 12px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 9px 18px;
  background: #233348;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #fff;
}
.paddContainer {
  padding-left: 2rem;
  padding-right: 2rem;
}


@media (min-width: 768px) {
  .mtlogo {
    margin-top: auto;
  }
  .card {
    width: 550px;
    height: 400px;
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
  .paddContainer {
    padding-right: 15px;
    padding-left: 15px;
  }
  .pbnoCuent {
    padding-bottom: 0rem;
  }
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



.login__field {
  padding: 20px 0px;
  position: relative;
}

.login__icon {
  position: absolute;
  top: 25px;
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
  font-size: 20px;
  line-height: 24px;
  border: 1px solid #cfcfcf;
  padding: 20px 20px;
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
