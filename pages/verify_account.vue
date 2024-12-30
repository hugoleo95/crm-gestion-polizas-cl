<template>
  <div class="verify-page">
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
                {{ message_first }}
              </h1>
              <p class="">
                {{ message_second }}
              </p>
              <form
                v-if="inputs"
                class="form-group"
                @submit.prevent="handleReSendVerify"
              >
                <div class="verify__field">
                  <span class="verify__icon">
                    <fa-icon
                      :icon="['fas', 'lock']"
                      class="verify__icon"
                    />
                  </span>
                  <input
                    v-model="password"
                    class="verify__input"
                    placeholder="Correo"
                    required
                    type="text"
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
                      Enviar
                    </button>
                  </td>
                </tr>
              </form>
              <tr v-if="button_home">
                <td
                  width="20%"
                  align="center"
                >
                  <button
                    class="sesion"
                    type="submit"
                    variant="primary"
                    @click="Reditsesion"
                  >
                    Iniciar Sesión
                  </button>
                </td>
              </tr>
            </div>
            <Modalalert
              v-show="modalnew"
              mensaje="Por favor revisa tu correo con el nuevo enlace con el token valido"
              title="Correo enviado"
              mensajebotton="Ir a Inicio"
              @buttonaction="Reditsesion"
            />
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import Modalalert from '~/components/Modalalert.vue'

export default {
  components: {
    Modalalert
  },
  layout: 'no-auth',
  data () {
    return {
      message_first: '',
      message_second: '',
      inputs: false,
      modalnew: false,
      button_home: false,
      password: ''
    }
  },
  async fetch () {
    const query = this.$route.query
    const code = query.token
    try {
      await this.$simpleeApi.get(`auth/verify_email/?code=${code}`)
      this.message_first = 'Cuenta Verificada'
      this.message_second = 'Su cuenta ha sido verificada correctamente puede entrar a Service Swicth'
      this.button_home = true
    } catch (error) {
      console.log(error.response.data)
      this.message_first = 'Cuenta no verificada'
      this.message_second = 'El token no es valido por favor vuelva ingresar el correo de su cuenta para volver generar un token valido y verificar la cuenta'
      this.inputs = true
      this.button_home = false
    }
  },
  watch: {
    '$route.query': '$fetch'
  },
  methods: {
    async handleReSendVerify (dato) {
      const correo = this.password
      try {
        await this.$simpleeApi.get(`auth/resend-ver-link/?email=${correo}`)
        this.modalnew = true
      } catch (error) {
        this.message_first = 'Correo invalido'
        this.message_second = 'Por favor ingresa un correo valido registrado'
        this.inputs = true
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
  font-size: 19px;
  line-height: 20px;
  text-align: center;
  color: #cfcfcf;
}

.sesion {
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

.verify__field {
  padding: 10px 0px;
  position: relative;
}

.verify__icon {
  position: absolute;
  top: 23px;
  font-family: Font Awesome 5 Free;
  font-style: normal;
  font-weight: normal;
  font-size: 17px;
  line-height: 23px;
  left: 5%;

  color: #233348;
}

.verify__input {
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

input.verify__input {
  padding-left: 64px;
}
.verify__input:active,
.verify__input:focus,
.verify__input:hover {
  outline: none;
}
.sincuenta {
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 21px;
  cursor: pointer;
  color: #233348;
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

.verify-page {
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
