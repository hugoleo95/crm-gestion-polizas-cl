<template>
  <div class="main-container">
    <div class="form-row">
      <div
        class="form-group-request"
      >
        <input
          v-model="FormData.name"
          class="form-control form-input"
          placeholder="Nombre"
          type="text"
        />
      </div>
      <div class="form-group-request">
        <input
          v-model="FormData.lastName"
          class="form-control form-input"
          placeholder="Apellido"
          type="text"
        />
      </div>
      <div class="form-group-request">
        <input
          v-model="FormData.cargo"
          class="form-control form-input"
          placeholder="Cargo"
          type="text"
        />
      </div>
    </div>
    <div class="form-row">
      <div
        class="form-group-request"
      >
        <input
          v-model="FormData.phone"
          class="form-control form-input"
          placeholder="Teléfono"
          type="text"
        />
      </div>
      <div class="form-group-request">
        <input
          v-model="FormData.email"
          class="form-control form-input"
          placeholder="Correo Electrónico"
          type="text"
        />
      </div>
      <div class="form-group-request">
        <input
          v-model="FormData.picture"
          class="form-control form-input"
          placeholder="Añade una fotografía"
          type="text"
        />
      </div>
      <div class="form-group-request">
        <b-button
          @click="show = true"
          class="text-white w-100"
          variant="primary"
        >
          Crear Firma
        </b-button>
      </div>
    </div>
    <div v-if="show" class="mt-4">
      <table>
        <tbody>
          <tr>
            <td>
              <div style="display: flex; ">
                <div style="padding-right: 6px;position:relative;">
                  <img style="width: 130px; height: 130px;z-index: 1;"
                      :src="FormData.picture"
                      alt="imagen de firma">
                </div>
              </div>
            </td>
            <td>
              <div style="padding-left: 3px;">
                <h1
                  style="font-weight: 700; font-family: 'Verdana'; font-size: 16px; letter-spacing: 0.1em;margin-top: 0px;margin-bottom: 0px;">
                  {{ FormData.name }} {{ FormData.lastName }}
                </h1>
                <p style="font-family: 'Verdana';font-size: 12px; font-style: italic;margin-top: 4px;margin-bottom: 0px;line-height: 0.8;">
                  {{ FormData.cargo }}
                </p>
                <div style="margin-top: 2px;">
                  <span>
                    <img style="width: 14px; height: 8px; padding-right: 4px;" src="https://i.imgur.com/3iaTIfy.png">
                    <a
                    :href="`mailto: ${FormData.email}`"
                    style="text-decoration:none; font-family: 'Verdana'; font-size: 12px; color:#000000"
                    >
                      {{ FormData.email }}
                    </a>
                  </span>
                  <span style="align-items: center; font-family: 'Verdana'; font-size: 12px; display: table-row-group;">
                    <img style="width: 14px; height: 12px; padding-right: 4px;" src="https://i.imgur.com/zJfMEbK.png">
                    {{ FormData.phone }}
                  </span>
                </div>
                <div style="margin-top: 5px;">
                  <a href="https://www.facebook.com/simpleeseguros/" target="_blank"><img
                          style="margin-right:10px;"
                          src="https://i.imgur.com/W5pg4ES.png"
                          alt="facebook"></a>
                  <a href="https://www.instagram.com/simpleeseguros/" target="_blank"><img
                    style="margin-right:10px;"
                    src="https://i.imgur.com/KKcFRju.png"
                    alt="instagram"></a>
                  <a href="http://linkedin.com/company/simplee-seguros/" target="_blank"><img
                          style="width:23px; height:23px;margin-right:10px;"
                          src="https://i.imgur.com/T1ssBwf.png"
                          alt="linkedin"></a>
                  <a href="https://www.youtube.com/channel/UC7z5pvtIfUslQbQ6FkV37Tg" target="_blank"><img
                    style="width:23px; height:23px;margin-right:10px;"
                    src="https://i.imgur.com/36bCUbZ.png"
                    alt="Youtube"></a>
                </div>
                <a style="letter-spacing: 0.2em;"
                    href="https://simpleeseguros.com" target="_blank">
                    <img
                    src="https://i.imgur.com/Vw1pckO.png"
                    alt="">
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      error: false,
      show: false,
      FormData: {
        name: "",
        lastName: "",
        cargo: "",
        phone: "",
        email: "",
        picture: "",
      },
    }
  },
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
}
.form-row .form-group {
  width: 50%;
  padding: 0 15px;
}
.form-row .form-group-request {
  width: 25%;
  padding: 8px 15px;
}
.form-col .form-group-request {
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
}
.form-group {
  margin-bottom: 23px;
  position: relative;
}
.form-justify {
  display: flex;
  align-items: flex-end;;
}
.form-btn {
  height: 40px;
}
label {
  margin-bottom: 8px;
}
::placeholder {
  color: #233348;
  font-size: 14px;
}
.input-error {
  border: 1px solid red !important;
  color: red !important;
}
.icon-size {
  width: 50px;
  height: auto;
}
.icon-success {
  border-radius: 50%;
  border: 10px solid #233348;
  width: 100px;
  height: 100px;
  margin: auto;
}
input,
select {
  outline: none;
  appearance: unset !important;
  -moz-appearance: unset !important;
  -webkit-appearance: unset !important;
  -o-appearance: unset !important;
  -ms-appearance: unset !important;
}
.form-input {
  border: 1px solid #233348;
  font-size: 13px;
  border-radius: 8px;
  height: 36px;
  &.active {
    border: 1px solid #233348;
  }
}
</style>
