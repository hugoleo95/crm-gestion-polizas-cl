<template>
  <div>
    <div class="main-container">
      <div class="d-flex  justify-content-between align-items-center">
        <div class="menu d-flex">
          <button
            :class="[{active:option === 'calendar'}, 'mr-3']"
            style="font-size: 1.15rem"
            @click="option = 'calendar'"
          >
            <fa-icon :icon="['fas', 'calendar-alt']" />
            Calendario
          </button>
          <button
            :class="[{active:option === 'wall'}, 'mr-3']"
            style="font-size: 1.15rem"
            @click="option = 'wall'"
          >
            <fa-icon :icon="['fas', 'edit']" />
            Feedback
          </button>
          <button
            :class="[{active:option === 'comunity'}, 'mr-3']"
            style="font-size: 1.15rem"
            @click="option = 'comunity'"
          >
            <fa-icon :icon="['fas', 'lightbulb']" />
            Comunidad
          </button>
        </div>
      </div>
      <Calendar v-if="option=== 'calendar'" />
      <Wall v-if="option=== 'wall'" />
      <Comunity v-if="option=== 'comunity'" />
    </div>
    <b-modal
      v-model="modalShow"
      size="lg"
      hide-footer
      hide-header
      :modal-class="[
        Modal.slider1 === true
          ? 'modal-class'
          : 'modal-class2',
      ]"
    >
      <div
        class="d-block text-center"
        :class="[
          Modal.slider1 === true
            ? 'modalcontent2'
            : 'modalcontent',
        ]"
      >
        <div
          v-if="Modal.slider2"
          id="arrow-left"
          class="arrow"
          @click="Modal.slider1 = true;Modal.slider2 = false"
        />
        <div
          v-if="Modal.slider1"
          id="arrow-right"
          class="arrow"
          @click="Modal.slider2 = true;Modal.slider1 = false"
        />
        <div
          v-if="Modal.slider1"
          class="d-flex flex-row slider1 h-100"
        >
          <div class="img">
            <img
              class="w-100 h-100"
              src="~assets/simpleetalks/personaje1.svg"
            >
          </div>
          <div class="text">
            <h4 class="my-3">
              ¡Te damos la bienvenida a Simplee Talk!
            </h4>
            <p class="text-justify">
              Esta idea nace de la necesidad de tener un espacio en donde todos los miembros del equipo podamos interactuar, compartir y encontrarnos virtualmente en cualquier momento, aunque no estemos cerca físicamente.
            </p>
          </div>
        </div>
        <div v-if="Modal.slider2">
          <h4 class="mt-4 mb-3">
            ¿Para qué me servirá?
          </h4>
          <p class="text-justify">
            Para que interactuemos entre todos, son tres secciones donde podremos compartir de diferentes maneras:
          </p>
          <ul class="mt-4 mb-0 listaruleswall">
            <li>
              <fa-icon :icon="['fas', 'calendar-alt']" />
              <strong>Calendario:</strong>
              <br>
              Podremos ver la fecha de cumpleaños de todos los miembros de nuestro equipo ¡así nos da tiempo para preparar una bonita celebración! también podremos estar al tanto de eventos, lanzamientos, reuniones, entre otras.
            </li>
            <li>
              <fa-icon :icon="['fas', 'edit']" />
              <strong>Feedback:</strong>
              <br> Podremos dar sugerencias, criticar constructivamente, felicitar, agradecer, o comentar como nos sentimos siempre desde la empatía y el respeto.
            </li>
            <li>
              <fa-icon :icon="['fas', 'lightbulb']" />
              <strong>Muro de Comunidad:</strong>
              <ul class="my-1">
                <li>Recomienda películas, series, libros, recetas, etc.</li>
                <li>Publica fotos de tus pasatiempos, viajes, tiempo libre, deportes, memes, etc.</li>
                <li class="pb-1">
                  Comparte, datos, opiniones, reflexiones, información, etc.
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div
          v-if="Modal.slider2"
          class="text-center"
        >
          <b-button
            class="mt-1"
            variant="outline-success"
            size="lg"
            @click="modalShow = false"
          >
            Entendido
          </b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Session from '@/mixins/auth'
import Calendar from '~/components/simpleetalk/Calendar.vue'
import Wall from '~/components/simpleetalk/Wall.vue'
import Comunity from '~/components/simpleetalk/Comunity.vue'
export default {
  components: {
    Calendar,
    Wall,
    Comunity
  },
  mixins: [Session],
  data () {
    return {
      option: 'comunity',
      modalShow: false,
      Modal: {
        slider1: true,
        slider2: false
      }
    }
  },
  created () {
    if (this.$store.state.localStorage.alertalks) {
      this.modalShow = true
      this.$store.commit('localStorage/AlertTalks')
    }
  }
}
</script>

<style lang="scss">
h2,
h3,
p {
  margin: 0;
  padding: 0;
}
.main-container {
  width: 100%;
}
.menu {
  padding: 1.2rem 0;
  button {
    background-color: transparent;
    font-family: Rubik;
    font-style: normal;
    font-weight: 500;
    font-size: 1.2rem;
    line-height: 19px;
    outline: 0px solid transparent;
    border: 0px solid transparent;
    padding-bottom: 7px;
    color: #9e9e9e;
    &.active {
      color: #000000;
      border-bottom: 3px solid black;
    }
  }
}
.listaruleswall {
  list-style-type: none;
  text-align: left;
}
.modalcontent {
  height: 561px;
  padding: 0px 80px;
}
.modalcontent2 {
  height: 453px;
  padding: 0px 80px;
}
.modalcontent2 .slider1 {
  padding-top: 35px;
}
.modalcontent2 .slider1 .img {
  width: 40%;
}
.modalcontent2 .slider1 .text {
  width: 60%;
  padding-top: 77px;
}
.modal-class > .modal-dialog > .modal-content > .modal-body {
  background-image: url(../../assets/simpleetalks/fondomodal.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.modal-class2 > .modal-dialog > .modal-content > .modal-body {
  background-image: url(../../assets/simpleetalks/fondomodal2.png);
  background-size: cover;
  background-repeat: no-repeat;
}
.arrow {
  cursor: pointer;
  position: absolute;
  top: 50%;
  margin-top: -35px;
  width: 0;
  height: 0;
  border-style: solid;
}
#arrow-left {
  border-width: 20px 30px 20px 0;
  border-color: transparent rgb(49, 47, 47) transparent transparent;
  left: 0;
  margin-left: 20px;
}
#arrow-right {
  border-width: 20px 0 20px 30px;
  border-color: transparent transparent transparent rgb(49, 47, 47);
  right: 0;
  margin-right: 20px;
}
</style>
