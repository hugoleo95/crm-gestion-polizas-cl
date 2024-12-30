<template>
  <div class="container">
    <div class="headerLogo">
      <img
        class="logo"
        src="~/assets/logoblanco.png"
      >
    </div>
    <div class="overlay-containerr">
      <div>
        <img
          class="logo"
          src="~/assets/logoblanco.png"
        >
      </div>
      <div class="overlay">
        <div class="overlay-panel overlay-right">
          <h1>Te damos la bienvenida a <br> Service Swicth</h1>
          <p>Digitaliza tu negocio de seguros, emite pólizas de múltiples productos con múltiples compañias </p>
          <button
            class="ghost"
            @click="active_view = 'register'"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
    <div
      v-show="!loading"
      class="form-container sign-in-container"
    >
      <div
        v-if="active_view === 'mensajeentrada'"
        class="w-100 d-flex h-100 justify-content-center align-items-center"
      >
        <div class="card login">
          <h1>
            Comprueba tu bandeja de entrada
          </h1>
          <p>
            ¡Te has registrado correctamente! Por favor revisa tu correo para autorizar tu cuenta!
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
                <button
                  class="sesion"
                  @click="active_view ='login'"
                >
                  Iniciar Sesión
                </button>
              </td>
            </tr>
          </form>
        </div>
      </div>
      <form
        v-if="active_view == 'login'"
        class="f-login"
        @submit.prevent="handleSendSignInForm"
      >
        <div class="titulo">
          <h1>¡Inicia sesión para continuar!</h1>
        </div>
        <!--<span>or use your account</span>-->
        <div class="login">
          <div class="login__field">
            <span class="login__icon">
              <fa-icon
                :icon="['fas', 'envelope']"
                class="login__icon"
              />
            </span>
            <input
              v-model="user.email"
              class="login__input"
              placeholder="Email"
              required
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
              v-model="user.password"
              type="password"
              minlength="6"
              maxlength="30"
              placeholder="Contraseña"
              required
              class="login__input"
              value="holaa"
            >
          </div>
        </div>
        <div class="opciones">
          <tr>
            <td
              width="20%"
              align="left"
              class="recuerdame"
            >
              <div class="squaredThree">
                <input
                  id="squaredThree"
                  v-model="user.recuerdame"
                  type="checkbox"
                  value="si"
                >
                <label for="squaredThree">
                  <span>
                    Recuérdame
                  </span>
                </label>
              </div>
            </td>
            <td />
            <td align="right">
              <nuxt-link
                :to="{ name: 'recovery_password' }"
                class="olvidaste"
              >
                ¿Olvidaste tu contraseña?
              </nuxt-link>
            </td>
          </tr>
          <tr>
            <td>
              &nbsp;
            </td>
          </tr>

          <tr>
            <td
              align="left"
              class="TDsesion"
            >
              <button
                class="sesion"
                type="submit"
                variant="primary"
              >
                Iniciar sesión
              </button>
            </td>
          </tr>
          <tr>
            <td>
              &nbsp;
            </td>
          </tr>
          <tr>
            <td
              align="left"
              colspan="3"
              width="50%"
            >
              <span class="sincuenta">
                ¿No tienes una cuenta?
                <a
                  class="sincuenta"
                  @click="active_view = 'register'"
                >¡Regístrate!
                </a>
              </span>
            </td>
          </tr>
        </div>

      </form>
      <form
        v-if="active_view == 'register'"
        class="f-login"
        @submit.prevent="handleSendSignUpForm"
      >
        <div class="titulo-re mb-2">
          <h1>¡Solicita tu registro!</h1>
        </div>
        <!--<span>or use your account</span>-->
        <div class="login-re">
          <div class="login__field-re">
            <span class="sincuenta">
              Seleccione el tipo de compañia para el registro de la cuenta
            </span>
          </div>
          <div class="login__field-re">
            <div class="d-flex justify-content-center items-center">
              Corredora &nbsp;<input
                type="radio"
                name="typeusuario"
                value="corredor"
              >&nbsp;&nbsp;&nbsp;
              Aseguradora &nbsp;<input
                type="radio"
                name="typeusuario"
                value="aseguradora"
              >
            </div>
          </div>
          <div class="login__field-re">
            <span class="login__icon-re">
              <fa-icon
                :icon="['fas', 'user']"
                class="login__icon-re"
              />
            </span>
            <input
              v-model="user.first_name"
              class="login__input-re"
              placeholder="Ingrese Nombre"
              required
            >
          </div>
          <div class="login__field-re">
            <span class="login__icon-re">
              <fa-icon
                :icon="['fas', 'user']"
                class="login__icon-re"
              />
            </span>
            <input
              v-model="user.last_name"
              class="login__input-re"
              placeholder="Ingrese Apellido"
              required
            >
          </div>
          <div class="login__field-re">
            <span class="login__icon-re">
              <fa-icon
                :icon="['fas', 'phone']"
                class="login__icon-re"
              />
            </span>
            <input
              v-model="user.phone"
              class="login__input-re"
              placeholder="Ingrese Telefono"
              required
            >
          </div>
          <div class="login__field-re">
            <span class="login__icon-re">
              <fa-icon
                :icon="['fas', 'envelope']"
                class="login__icon-re"
              />
            </span>
            <input
              v-model="user.email"
              class="login__input-re"
              placeholder="Ingrese Correo"
              required
            >
          </div>
          <div class="login__field-re text-left">
            <span class="sincuenta text-left">
              Si eres una ejecutiva o ejecutivo de un corredor, el registro de la cuenta lo tiene que hacer un administrador de la corredora y el se encargara de crear los usuarios ejecutivos.
            </span>
          </div>
        </div>
        <div class="opciones-re">
          <tr>
            <td align="left">
              <button
                class="sesion"
                type="submit"
                variant="primary"
              >
                Solicitar registro
              </button>
            </td>
          </tr>
          <tr>
            <td>
              &nbsp;
            </td>
          </tr>
          <tr>
            <td align="left">
              <span class="sincuenta">¿Ya tienes una cuenta?
                <a
                  class="sincuenta"
                  @click="active_view = 'login'"
                >¡Inicia sesión!
                </a>
              </span>
            </td>
          </tr>
        </div>
      </form>
    </div>
    <div
      v-show="loading"
      class="form-container sign-in-container"
    >
      <div id="loader">
        <div
          class="divider"
          aria-hidden="true"
        >
          <p
            class="loading-text"
            aria-label="Loading"
          >
            <span
              class="letter"
              aria-hidden="true"
            >C</span>
            <span
              class="letter"
              aria-hidden="true"
            >a</span>
            <span
              class="letter"
              aria-hidden="true"
            >r</span>
            <span
              class="letter"
              aria-hidden="true"
            >g</span>
            <span
              class="letter"
              aria-hidden="true"
            >a</span>
            <span
              class="letter"
              aria-hidden="true"
            >n</span>
            <span
              class="letter"
              aria-hidden="true"
            >d</span>
            <span
              class="letter"
              aria-hidden="true"
            >o</span>
          </p>
        </div>
      </div>
    </div>
    <b-modal
      id="error-modal"
      v-model="showModal"
      hide-footer
      size="lg"
    >
      <template #modal-title>
        Operacion exitosa!
      </template>
      <div class="d-block text-center">
        <h4 class="text-xs">
          Muchas gracias por tu solicitud, en breve nos pondremos en contacto contigo para continuar con el proceso de registro de tu compañia
        </h4>
      </div>
      <b-button
        :class="`${error ? 'bg-danger text-white' : 'bg-primary text-white '} mt-3`"
        block
        @click="showModal = false"
      >
        Entendido
      </b-button>
    </b-modal>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Session from '@/mixins/no-auth'
export default {
  mixins: [Session],
  layout: 'no-auth',
  data () {
    return {
      active_view: 'login',
      showModal: false,
      user: {
        email: this.$store.state.localStorage.email_recuer || '',
        email_recuperacion: '',
        password: this.$store.state.localStorage.password_recuer || '',
        repeat_password: '',
        recuerdame: this.$store.state.localStorage.recuerdame || '',
        about: '',
        first_name: '',
        last_name: '',
        born_date: ''
      },
      loading: false,
      cerrar: false,
      logged_user: {
        id: 0,
        email: '',
        accounts: []
      }
    }
  },
  created () {

    console.log(process.env.NUXT_ENV_API_URL, process.env.NUXT_ENV_LEAD_SOCKET_URL, process.env.VERSION, 'hola estoy aquiii jaja22222', process.env.apiUrl, process.env.version, process.env.leadSocketUrl, process.env.NODE_ENV)
    this.cerrar = true
    if (this.$route.params.active_view === 'register') {
      this.active_view = 'register'
      this.$route.params.active_view = ''
    }
    /*
     if (this.$store.state.localStorage.cerrar) {
       this.$store.commit('localStorage/cerrarreload')
       //location.reload()
       this.cerrar = false
     }
     this.cerrar = false
     */
  },
  methods: {
    ...mapMutations(['setAlertMessage']),
    async handleSendSignUpForm () {
      this.showModal = true
      this.active_view = 'login'
    },
    async handleSendSignUpForm2 () {
      const passwordsMath = this.user.password === this.user.repeat_password
      let message = 'Las contraseñas no coinciden'
      let variant = 'danger'
      this.loading = true
      const payload = {
        email: this.user.email,
        password: this.user.password,
        password2: this.user.repeat_password,
        about: this.user.about,
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        born_date: this.user.born_date
      }
      if (!payload.about) {
        delete payload.about
      }
      if (passwordsMath) {
        try {
          const { data: { data: loggedUser } } = await this.$simpleeApi.post('auth/register/', payload)
          message = '¡Te has registrado correctamente! Por favor revisa tu correo para autorizar tu cuenta'
          variant = 'success'
          // this.$store.commit('localStorage/loginAction', loggedUser)
          // this.$router.push({ path: '/calendario/crm' })
          this.active_view = 'mensajeentrada'
          console.log(loggedUser)
        } catch (error) {
          message = 'La cuenta ya está registrada'
          this.setAlertMessage(error.response.data)
        }
      }
      this.loading = false
      if (this.active_view !== 'mensajeentrada') {
        this.$bvToast.toast(message, {
          variant,
          solid: true
        })
      }
    },
    async handleSendSignInForm () {
      console.log('entre aqui nuevo deploy')
      this.loading = true
      let message = 'Has iniciado sesión correctamente'
      let variant = 'success'
      try {
        const { data } = await this.$simpleeApi.post('/auth/login/', {
          email: this.user.email,
          password: this.user.password
        })
        console.log('entre aqui')
        if (!this.$store.state.localStorage.close) {
          this.connectSocket(data.token.access)
        }
        console.log('entre aqui2')
        this.$store.commit('localStorage/loginAction', data)
        const payload = { key1: this.user.email, key2: this.user.password }
        if (this.user.recuerdame) {
          this.$store.commit('localStorage/loginRecuer', payload)
        } else {
          this.$store.commit('localStorage/InloginRecuer')
        }
        console.log('entre aqui3')
        if (this.$store.state.localStorage.user.role === 'EXT_KAM') {
          this.$router.push({ path: '/solicitudes' })
        } else {
          this.$router.push({ path: '/dashboard' })
        }
        console.log('entre aqui4')
        this.$simpleeApi.setToken(data.token.access, 'Bearer')
        this.$simpleeApiMudango.setToken(data.token.access, 'Bearer')
        // this.$store.dispatch('getDates')
        this.$store.dispatch('getAllNotifications', { unseenOnly: true, page: 1 })
        this.$store.dispatch('getAllPolizasInError', {})
        console.log('entre aqui5')
      } catch (error) {
        console.log('aquii un error', error)
        //message = 'La combinación de usuario y contraseña no es correcta'
        if (error.response) {
          if (error.response.data.password) {
            message = error.response.data.password[0]
          } else {
            message = 'La combinación de usuario y contraseña no es correcta'
          }
        } else {
          message = 'Hubo un error, contacte a soporte de TI por favor'
        }
        variant = 'danger'
        this.setAlertMessage(error.response.data)
      }
      this.loading = false
      this.$bvToast.toast(message, {
        variant,
        solid: true
      })
    },
    connectSocket (token) {
      this.$connect(`${process.env.leadSocketUrl}?token=${token}`, { format: 'json', reconnection: true, store: this.$store })
    }
  }
}
</script>

<style lang="scss" scoped>
body {
  background-color: #fff;
}
.container {
  background-color: #fff;
  padding-left: 0px !important;
  padding-right: 0px !important;
  margin-left: 0px !important;
  margin-right: 0px !important;
}
.headerLogo {
  background-image: url(../assets/login.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  align-items: center;
  display: flex;
  justify-content: center;
}
.logo {
  width: 70%;
  height: 70%;
  z-index: 1;
  margin-bottom: 20px;
}
.overlay-containerr {
  display: none;
}
.form-container .titulo h1 {
  font-family: Rubik;
  font-style: normal;
  font-weight: 500;
  font-size: 35px;
  line-height: 47px;
  text-align: center;
  color: #233348;
}
.form-container {
  padding-top: 2rem;
  padding-bottom: 2rem;
  position: unset;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}
.form-container .titulo {
  position: unset;
  top: 15.89%;
}
.form-container .titulo-re {
  position: unset;
  top: 5.89%;
}
.form-container h1 {
  font-family: Rubik;
  font-style: normal;
  font-weight: 500;
  font-size: 40px;
  line-height: 47px;
  text-align: center;
  color: #233348;
}
form.f-login {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 30px;
  height: 100%;
  text-align: center;
}
.login p {
  margin: 20px 0 30px;
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 36px;
  text-align: center;
  color: #233348;
}
.login {
  width: 90%;
  padding: 0.5rem;
  padding-bottom: 2px;
  margin-bottom: 2rem;
}
.login__field {
  padding: 5px 0px;
  position: relative;
}
.login__icon {
  position: absolute;
  top: 15px;
  font-family: Font Awesome 5 Free;
  font-style: normal;
  font-weight: normal;
  font-size: 17px;
  line-height: 23px;
  left: 5%;
  /* identical to box height */
  color: #233348;
}
.login-re {
  width: 100%;
  padding: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 2px;
}
.login__field-re {
  padding: 5px 0px;
  position: relative;
}
.login__icon-re {
  position: absolute;
  top: 11.5px;
  font-family: Font Awesome 5 Free;
  font-style: normal;
  font-weight: normal;
  font-size: 17px;
  line-height: 23px;
  left: 5%;
  /* identical to box height */
  color: #233348;
}
input.login__input {
  padding-left: 64px;
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
  padding: 15px 15px;
  margin: 8px 0;
  width: 100%;
  text-align: left;
  color: #cfcfcf;
  height: auto;
}
.login__input:active,
.login__input:focus,
.login__input:hover {
  outline: none;
  border-bottom-color: #6a679e;
}
textarea {
  resize: none;
}
textarea:active,
textarea:focus,
textarea:hover {
  outline: none;
  border-bottom-color: #6a679e;
}
.login__textarea-re {
  background: #f8f8f8;
  border-radius: 5px;
  font-family: Rubik;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  border: none;
  padding: 20px 20px;
  margin: 4px 0;
  width: 100%;
  text-align: left;
  color: #233348;
}
input.login__input-re {
  padding-left: 64px;
  resize: none;
}
.login__input-re {
  background: #f8f8f8;
  border-radius: 5px;
  font-family: Rubik;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  border: none;
  padding: 20px 20px;
  margin: 4px 0;
  width: 100%;
  text-align: left;
  color: #233348;
  height: 20px;
}
.login__input-re:active,
.login__input-re:focus,
.login__input-re:hover {
  outline: none;
  border-bottom-color: #6a679e;
}
.sign-in-container {
  background-color: #fff;
  width: 100%;
  z-index: 2;
  right: 0%;
}
.sign-in-container .recuerdame {
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 17px;
  line-height: 21px;
  color: #233348;
}
.sign-in-container .olvidaste {
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 17px;
  line-height: 21px;
  text-decoration-line: underline;
  cursor: pointer;
  color: #233348;
}
.sign-in-container .sincuenta {
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 21px;
  cursor: pointer;
  color: #233348;
}
.sign-in-container .sincuenta a {
  font-weight: bold;
  color: #233348;
  text-decoration: underline;
}

.sign-in-container .sincuenta a {
  font-weight: bold;
  color: #233348;
  text-decoration: underline;
}
.sign-in-container .opciones {
  width: 100%;
}
.sign-in-container .opciones-re {
  width: 100%;
  margin-top: 30px;
}
.container.right-panel-active .sign-in-container {
  transform: translateX(100%);
}
.squaredThree {
  width: 20px;
  position: relative;
}
.squaredThree span {
  margin-left: 25px;
}
.squaredThree label {
  width: 20px;
  height: 20px;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#222222),
    to(#45484d)
  );
  background: #233348;
  border-radius: 4px;
}
.squaredThree label:after {
  content: "";
  width: 9px;
  height: 5px;
  position: absolute;
  top: 8px;
  left: 5px;
  border: 3px solid #fcfff4;
  border-top: none;
  border-right: none;
  background: transparent;
  opacity: 0;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.squaredThree label:hover::after {
  opacity: 0.3;
}
.squaredThree input[type="checkbox"] {
  visibility: hidden;
}
.squaredThree input[type="checkbox"]:checked + label:after {
  opacity: 1;
}
$verde: #233348;
$blanco: #fff;
@mixin pseudo($content: "") {
  position: absolute;
  content: $content;
}
* {
  box-sizing: border-box;
  &::before,
  &::after {
    box-sizing: border-box;
  }
}
#loader {
  position: relative;
  transform: scale(0.725);
  top: 40%;
  left: 10%;
}
.loading-text {
  position: relative;
  font-size: 3.8rem;
  font-weight: 500;
  margin: 0;
  white-space: nowrap;
  font-family: Rubik;
  &::before {
    // For dot
    @include pseudo;
    z-index: 1;
    top: 40px;
    left: 115px;
    width: 6px;
    height: 6px;
    background: $verde;
    border-radius: 50%;
    animation: dotMove 1800ms cubic-bezier(0.25, 0.25, 0.75, 0.75) infinite;
  }
  .letter {
    display: inline-block;
    position: relative;
    color: $verde;
    letter-spacing: 8px;
    &:nth-child(1) {
      // For the letter "L"
      transform-origin: 100% 70%;
      transform: scale(1, 1.275);
      &::before {
        @include pseudo;
        top: 22px;
        left: 0;
        width: 14px;
        height: 36px;
        background: $blanco;
        transform-origin: 100% 0;
        animation: lineStretch 1800ms cubic-bezier(0.25, 0.25, 0.75, 0.75)
          infinite;
      }
    }
    &:nth-child(5) {
      // For the letter "i"
      transform-origin: 100% 70%;
      animation: letterStretch 1800ms cubic-bezier(0.25, 0.23, 0.73, 0.75)
        infinite;
      &::before {
        @include pseudo;
        top: 15px;
        left: 2px;
        width: 9px;
        height: 15px;
        background: $blanco;
      }
    }
  }
}
button {
  border: 1px solid #ff4b2b;
  background-color: #ff4b2b;
  font-family: Rubik;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  color: #fff;
  text-align: center;
  padding: 15px 25px;
  transition: transform 80ms ease-in;
  border-radius: 3px;
}
button.ghost {
  background-color: transparent;
  border-color: #ffffff;
}
button.sesion {
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
  width: 10rem;
}
.TDsesion {
  width: 100%;
}

@media (min-width: 768px) {
  .TDsesion {
    width: auto;
  }
  .headerLogo {
    display: none;
  }
  .form-container .titulo h1 {
    font-family: Rubik;
    font-style: normal;
    font-weight: 500;
    font-size: 35px;
    line-height: 47px;
    text-align: center;
    color: #233348;
  }
  .overlay p {
    margin: 20px 0 30px;
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 36px;
    text-align: center;
    color: #ffffff;
  }
  .login p {
    margin: 20px 0 30px;
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 36px;
    text-align: center;
    color: #233348;
  }
  .overlay h1 {
    font-family: Rubik;
    font-style: normal;
    font-weight: 500;
    font-size: 40px;
    line-height: 47px;
    text-align: center;
    color: #ffffff;
  }
  button {
    border: 1px solid #ff4b2b;
    background-color: #ff4b2b;
    font-family: Rubik;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 19px;
    color: #fff;
    text-align: center;
    padding: 15px 25px;
    transition: transform 80ms ease-in;
    border-radius: 3px;
  }
  button.ghost {
    background-color: transparent;
    border-color: #ffffff;
  }
  button.sesion {
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
  }
  form.f-login {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 50px;
    height: 100%;
    text-align: center;
  }
  input.checkbox {
    width: 15px;
  }
  .container {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    min-height: 100%;
    height: 100%;
  }
  .form-container {
    position: absolute;
    top: -1.5rem;
    height: 100%;
    transition: all 0.6s ease-in-out;
    padding-top: 0rem;
    padding-bottom: 0rem;
  }
  .form-container .titulo {
    position: absolute;
    padding-bottom: 3rem;
  }
  .form-container .titulo-re {
    position: relative;
    padding-top: 3rem;
    padding-bottom: 0rem;
  }
  .form-container h1 {
    font-family: Rubik;
    font-style: normal;
    font-weight: 500;
    font-size: 40px;
    line-height: 47px;
    text-align: center;
    color: #233348;
  }
  .sign-in-container {
    background-color: #fff;
    width: 60%;
    z-index: 2;
    right: 0%;
  }
  .sign-in-container .recuerdame {
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
    font-size: 17px;
    line-height: 21px;
    color: #233348;
  }
  .sign-in-container .olvidaste {
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
    font-size: 17px;
    line-height: 21px;
    text-decoration-line: underline;
    cursor: pointer;
    color: #233348;
  }
  .sign-in-container .sincuenta {
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 21px;
    cursor: pointer;
    color: #233348;
  }
  .sign-in-container .sincuenta a {
    font-weight: bold;
    color: #233348;
    text-decoration: underline;
  }
  .sign-in-container .opciones {
    width: 70%;
  }
  .sign-in-container .opciones-re {
    width: 70%;
    margin-top: 30px;
  }
  .container.right-panel-active .sign-in-container {
    transform: translateX(100%);
  }
  .sign-up-container {
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 1;
  }
  .container.right-panel-active .sign-up-container {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
    animation: show 0.6s;
  }
  @keyframes show {
    0%,
    49.99% {
      opacity: 0;
      z-index: 1;
    }
    50%,
    100% {
      opacity: 1;
      z-index: 5;
    }
  }
  .overlay-containerr {
    background-color: #fff;
    display: inline;
    position: absolute;
    top: 0;
    left: 0%;
    width: 40%;
    height: 100%;
    overflow: hidden;
    transition: transform 0.6s ease-in-out;
    z-index: 100;
  }
  .overlay-containerr .logo {
    position: absolute;
    left: 5.66%;
    right: 77.37%;
    top: 2.89%;
    bottom: 92%;
    width: 120px;
    height: auto;
    z-index: 1;
  }
  .overlay-containerr .texto {
    position: absolute;
    left: 32.36%;
    right: 67.15%;
    top: 4.56%;
    bottom: 93.11%;
    font-family: Rubik;
    font-style: italic;
    font-weight: 300;
    font-size: 18px;
    line-height: 21px;
    color: #ffffff;
  }
  .container.right-panel-active .overlay-containerr {
    transform: translateX(-100%);
  }
  .overlay {
    background-image: url(../assets/login.jpg);
    transform: rotate(-90deg);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0 0;
    color: #ffffff;
    position: relative;
    height: 100%;
    width: 100%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
  }
  .container.right-panel-active .overlay {
    transform: translateX(50%);
  }
  .overlay-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    text-align: center;
    top: 0;
    height: 100%;
    width: 100%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
  }
  .overlay-left {
    transform: translateX(-20%);
  }
  .container.right-panel-active .overlay-left {
    transform: translateX(0);
  }
  .overlay-right {
    right: 0;
    transform: translateX(0);
  }
  .container.right-panel-active .overlay-right {
    transform: translateX(20%);
  }
  .social-container {
    margin: 20px 0;
  }
  .social-container a {
    border: 1px solid #dddddd;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px;
    height: 40px;
    width: 40px;
  }
  .login {
    width: 78%;
    padding: 30px;
    padding-top: 55px;
    padding-bottom: 2px;
    margin-bottom: 0rem;
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
    /* identical to box height */
    color: #233348;
  }
  .login-re {
    width: 78%;
    padding: 30px;
    padding-top: 55px;
    padding-bottom: 2px;
  }
  .login__field-re {
    padding: 5px 0px;
    position: relative;
  }
  .login__icon-re {
    position: absolute;
    top: 11.5px;
    font-family: Font Awesome 5 Free;
    font-style: normal;
    font-weight: normal;
    font-size: 17px;
    line-height: 23px;
    left: 5%;
    /* identical to box height */
    color: #233348;
  }
  input.login__input {
    padding-left: 64px;
  }
  .login__input {
    background: #f8f8f8;
    border-radius: 5px;
    font-family: Rubik;
    font-style: normal;
    font-weight: 700;
    font-size: 17px;
    line-height: 24px;
    border: none;
    padding: 20px 20px;
    margin: 8px 0;
    width: 100%;
    text-align: left;
    color: #233348;
    height: auto;
  }
  .login__input:active,
  .login__input:focus,
  .login__input:hover {
    outline: none;
    border-bottom-color: #6a679e;
  }
  textarea {
    resize: none;
  }
  textarea:active,
  textarea:focus,
  textarea:hover {
    outline: none;
    border-bottom-color: #6a679e;
  }
  .login__textarea-re {
    background: #f8f8f8;
    border-radius: 5px;
    font-family: Rubik;
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 24px;
    border: none;
    padding: 20px 20px;
    margin: 4px 0;
    width: 100%;
    text-align: left;
    color: #233348;
  }
  input.login__input-re {
    padding-left: 64px;
    resize: none;
  }
  .login__input-re {
    background: #f8f8f8;
    border-radius: 5px;
    font-family: Rubik;
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 24px;
    border: none;
    padding: 20px 20px;
    margin: 4px 0;
    width: 100%;
    text-align: left;
    color: #233348;
    height: 20px;
  }
  .login__input-re:active,
  .login__input-re:focus,
  .login__input-re:hover {
    outline: none;
    border-bottom-color: #6a679e;
  }
  // checkbox
  .squaredThree {
    width: 20px;
    position: relative;
  }
  .squaredThree span {
    margin-left: 25px;
  }
  .squaredThree label {
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    background: -webkit-gradient(
      linear,
      left top,
      left bottom,
      from(#222222),
      to(#45484d)
    );
    background: #233348;
    border-radius: 4px;
  }
  .squaredThree label:after {
    content: "";
    width: 9px;
    height: 5px;
    position: absolute;
    top: 8px;
    left: 5px;
    border: 3px solid #fcfff4;
    border-top: none;
    border-right: none;
    background: transparent;
    opacity: 0;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .squaredThree label:hover::after {
    opacity: 0.3;
  }
  .squaredThree input[type="checkbox"] {
    visibility: hidden;
  }
  .squaredThree input[type="checkbox"]:checked + label:after {
    opacity: 1;
  }
  //Loading
  $verde: #233348;
  $blanco: #fff;
  @mixin pseudo($content: "") {
    position: absolute;
    content: $content;
  }
  * {
    box-sizing: border-box;
    &::before,
    &::after {
      box-sizing: border-box;
    }
  }
  #loader {
    position: relative;
    transform: scale(0.725);
    top: 40%;
    left: 10%;
  }
  .loading-text {
    position: relative;
    font-size: 3.8rem;
    font-weight: 500;
    margin: 0;
    white-space: nowrap;
    font-family: Rubik;
    &::before {
      // For dot
      @include pseudo;
      z-index: 1;
      top: 40px;
      left: 115px;
      width: 6px;
      height: 6px;
      background: $verde;
      border-radius: 50%;
      animation: dotMove 1800ms cubic-bezier(0.25, 0.25, 0.75, 0.75) infinite;
    }
    .letter {
      display: inline-block;
      position: relative;
      color: $verde;
      letter-spacing: 8px;
      &:nth-child(1) {
        // For the letter "L"
        transform-origin: 100% 70%;
        transform: scale(1, 1.275);
        &::before {
          @include pseudo;
          top: 22px;
          left: 0;
          width: 14px;
          height: 36px;
          background: $blanco;
          transform-origin: 100% 0;
          animation: lineStretch 1800ms cubic-bezier(0.25, 0.25, 0.75, 0.75)
            infinite;
        }
      }
      &:nth-child(5) {
        // For the letter "i"
        transform-origin: 100% 70%;
        animation: letterStretch 1800ms cubic-bezier(0.25, 0.23, 0.73, 0.75)
          infinite;
        &::before {
          @include pseudo;
          top: 15px;
          left: 2px;
          width: 9px;
          height: 15px;
          background: $blanco;
        }
      }
    }
  }
  // For the dot
  @keyframes dotMove {
    0%,
    100% {
      transform: rotate(180deg) translate(-110px, -10px) rotate(-180deg);
    }
    50% {
      transform: rotate(0deg) translate(-111px, 10px) rotate(0deg);
    }
  }
  // For the letter "i"
  @keyframes letterStretch {
    0%,
    100% {
      transform: scale(1, 0.35);
      transform-origin: 100% 75%;
    }
    8%,
    28% {
      transform: scale(1, 2.125);
      transform-origin: 100% 67%;
    }
    37% {
      transform: scale(1, 0.875);
      transform-origin: 100% 75%;
    }
    46% {
      transform: scale(1, 1.03);
      transform-origin: 100% 75%;
    }
    50%,
    97% {
      transform: scale(1);
      transform-origin: 100% 75%;
    }
  }
  // For the letter "L"
  @keyframes lineStretch {
    0%,
    45%,
    70%,
    100% {
      transform: scaleY(0.125);
    }
    49% {
      transform: scaleY(0.75);
    }
    50% {
      transform: scaleY(0.875);
    }
    53% {
      transform: scaleY(0.5);
    }
    60% {
      transform: scaleY(0);
    }
    68% {
      transform: scaleY(0.18);
    }
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
  p {
    line-height: 1rem;
  }
  a:hover {
    text-decoration: none;
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
    color: #233348;
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
}
</style>
