<template>
  <div>
    <div class="calendar">
      <div class="col leftCol">
        <div class="content">
          <h1 class="date">
            2022
          </h1>
        </div>
        <div class="notes">
          <div
            class="mes"
            :class="[{messelect:option === 1}]"
            @click="option = 1;Mes(1)"
          >
            <div class="enter">
              <span class="list">
                Enero
              </span>
              <span class="count">
                3
              </span>
            </div>
          </div>
          <div
            class="mes"
            :class="[{messelect:option === 2}]"
            @click="option = 2;Mes(2)"
          >
            <div class="enter">
              <span class="list">
                Febrero
              </span>
              <span class="count">
                1
              </span>
            </div>
          </div>
          <div
            class="mes"
            :class="[{messelect:option === 3}]"
            @click="option = 3;Mes(3)"
          >
            <div class="enter">
              <span class="list">
                Marzo
              </span>
              <span class="count">
                4
              </span>
            </div>
          </div>
          <div
            class="mes"
            :class="[{messelect:option === 4}]"
            @click="option = 4;Mes(4)"
          >
            <div class="enter">
              <span class="list">
                Abril
              </span>
              <span class="count">
                3
              </span>
            </div>
          </div>
          <div
            class="mes"
            :class="[{messelect:option === 5}]"
            @click="option = 5;Mes(5)"
          >
            <div class="enter">
              <span class="list">
                Mayo
              </span>
              <span class="count">
                1
              </span>
            </div>
          </div>
          <div
            class="mes"
            :class="[{messelect:option === 6}]"
            @click="option = 6;Mes(6)"
          >
            <div class="enter">
              <span class="list">
                Junio
              </span>
              <span class="count">
                4
              </span>
            </div>
          </div>
          <div
            class="mes"
            :class="[{messelect:option === 7}]"
            @click="option = 7;Mes(7)"
          >
            <div class="enter">
              <span class="list">
                Julio
              </span>
              <span class="count">
                2
              </span>
            </div>
          </div>
          <div
            class="mes"
            :class="[{messelect:option === 8}]"
            @click="option = 8;Mes(8)"
          >
            <div class="enter">
              <span class="list">
                Agosto
              </span>
              <span class="count">
                2
              </span>
            </div>
          </div>
          <div
            class="mes"
            :class="[{messelect:option === 9}]"
            @click="option = 9;Mes(9)"
          >
            <div class="enter">
              <span class="list">
                Septiembre
              </span>
              <span class="count">
                3
              </span>
            </div>
          </div>
          <div
            class="mes"
            :class="[{messelect:option === 10}]"
            @click="option = 10;Mes(10)"
          >
            <div class="enter">
              <span class="list">
                Octubre
              </span>
              <span class="count">
                0
              </span>
            </div>
          </div>
          <div
            class="mes"
            :class="[{messelect:option === 11}]"
            @click="option = 11;Mes(11)"
          >
            <div class="enter">
              <span class="list">
                Noviembre
              </span>
              <span class="count">
                4
              </span>
            </div>
          </div>
          <div
            class="mes"
            :class="[{messelect:option === 12}]"
            @click="option = 12;Mes(12)"
          >
            <div class="enter">
              <span class="list">
                Diciembre
              </span>
              <span class="count">
                1
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="col centerCol">
        <div class="content">
          <h2 class="date mayus">
            {{ mes }}
          </h2>
        </div>
        <div class="fechas">
          <div class="clearfix" />
          <ul class="weekday">
            <li>
              <a
                href="#"
                title="Mon"
                data-value="1"
              >Lun
              </a>
            </li>
            <li>
              <a
                href="#"
                title="Tue"
                data-value="2"
              >Mar
              </a>
            </li>
            <li>
              <a
                href="#"
                title="Wed"
                data-value="3"
              >Mie
              </a>
            </li>
            <li>
              <a
                href="#"
                title="Thu"
                data-value="4"
              >Jue
              </a>
            </li>
            <li>
              <a
                href="#"
                title="Fri"
                data-value="5"
              >Vie
              </a>
            </li>
            <li>
              <a
                href="#"
                title="Say"
                data-value="6"
              >Sab
              </a>
            </li>
            <li>
              <a
                href="#"
                title="Sun"
                data-value="7"
              >Dom
              </a>
            </li>
          </ul>
          <div class="clearfix" />
          <ul
            v-if="option === 1"
            class="days"
          >
            <li
              v-for="(tarea, indice) in Enero"
              :key="indice"
            >
              <a
                :class="[
                  tarea.status === true
                    ? tarea.color
                    : '',
                ]"
                href="#"
              >
                <span>
                  {{ tarea.day }}
                </span>
                <b
                  v-if="tarea.status"
                  class="bounce animated"
                >
                  🎂
                </b>
              </a>
            </li>
          </ul>
          <ul
            v-if="option === 2"
            class="days"
          >
            <li
              v-for="(tarea, indice) in Febrero"
              :key="indice"
            >
              <a
                :class="[
                  tarea.status === true
                    ? tarea.color
                    : '',
                ]"
                href="#"
              >
                <span>
                  {{ tarea.day }}
                </span>
                <b
                  v-if="tarea.status"
                  class="bounce animated"
                >
                  🎂
                </b>
              </a>
            </li>
          </ul>
          <ul
            v-if="option === 3"
            class="days"
          >
            <li
              v-for="(tarea, indice) in Marzo"
              :key="indice"
            >
              <a
                :class="[
                  tarea.status === true
                    ? tarea.color
                    : '',
                ]"
                href="#"
              >
                <span>
                  {{ tarea.day }}
                </span>
                <b
                  v-if="tarea.status"
                  class="bounce animated"
                >
                  🎂
                </b>
              </a>
            </li>
          </ul>
          <ul
            v-if="option === 4"
            class="days"
          >
            <li
              v-for="(tarea, indice) in Abril"
              :key="indice"
            >
              <a
                :class="[
                  tarea.status === true
                    ? tarea.color
                    : '',
                ]"
                href="#"
              >
                <span>
                  {{ tarea.day }}
                </span>
                <b
                  v-if="tarea.status"
                  class="bounce animated"
                >
                  🎂
                </b>
              </a>
            </li>
          </ul>
          <ul
            v-if="option === 5"
            class="days"
          >
            <li
              v-for="(tarea, indice) in Mayo"
              :key="indice"
            >
              <a
                :class="[
                  tarea.status === true
                    ? tarea.color
                    : '',
                ]"
                href="#"
              >
                <span>
                  {{ tarea.day }}
                </span>
                <b
                  v-if="tarea.status"
                  class="bounce animated"
                >
                  🎂
                </b>
              </a>
            </li>
          </ul>
          <ul
            v-if="option === 6"
            class="days"
          >
            <li
              v-for="(tarea, indice) in Junio"
              :key="indice"
            >
              <a
                :class="[
                  tarea.status === true
                    ? tarea.color
                    : '',
                ]"
                href="#"
              >
                <span>
                  {{ tarea.day }}
                </span>
                <b
                  v-if="tarea.status"
                  class="bounce animated"
                >
                  🎂
                </b>
              </a>
            </li>
          </ul>
          <ul
            v-if="option === 7"
            class="days"
          >
            <li
              v-for="(tarea, indice) in Julio"
              :key="indice"
            >
              <a
                :class="[
                  tarea.status === true
                    ? tarea.color
                    : '',
                ]"
                href="#"
              >
                <span>
                  {{ tarea.day }}
                </span>
                <b
                  v-if="tarea.status"
                  class="bounce animated"
                >
                  🎂
                </b>
              </a>
            </li>
          </ul>
          <ul
            v-if="option === 8"
            class="days"
          >
            <li
              v-for="(tarea, indice) in Agosto"
              :key="indice"
            >
              <a
                :class="[
                  tarea.status === true
                    ? tarea.color
                    : '',
                ]"
                href="#"
              >
                <span>
                  {{ tarea.day }}
                </span>
                <b
                  v-if="tarea.status"
                  class="bounce animated"
                >
                  🎂
                </b>
              </a>
            </li>
          </ul>
          <ul
            v-if="option === 9"
            class="days"
          >
            <li
              v-for="(tarea, indice) in Septiembre"
              :key="indice"
            >
              <a
                :class="[
                  tarea.status === true
                    ? tarea.color
                    : '',
                ]"
                href="#"
              >
                <span>
                  {{ tarea.day }}
                </span>
                <b
                  v-if="tarea.status"
                  class="bounce animated"
                >
                  🎂
                </b>
              </a>
            </li>
          </ul>
          <ul
            v-if="option === 10"
            class="days"
          >
            <li
              v-for="(tarea, indice) in Octubre"
              :key="indice"
            >
              <a
                :class="[
                  tarea.status === true
                    ? tarea.color
                    : '',
                ]"
                href="#"
              >
                <span>
                  {{ tarea.day }}
                </span>
                <b
                  v-if="tarea.status"
                  class="bounce animated"
                >
                  🎂
                </b>
              </a>
            </li>
          </ul>
          <ul
            v-if="option === 11"
            class="days"
          >
            <li
              v-for="(tarea, indice) in Noviembre"
              :key="indice"
            >
              <a
                :class="[
                  tarea.status === true
                    ? tarea.color
                    : '',
                ]"
                href="#"
              >
                <span>
                  {{ tarea.day }}
                </span>
                <b
                  v-if="tarea.status"
                  class="bounce animated"
                >
                  🎂
                </b>
              </a>
            </li>
          </ul>
          <ul
            v-if="option === 12"
            class="days"
          >
            <li
              v-for="(tarea, indice) in Diciembre"
              :key="indice"
            >
              <a
                :class="[
                  tarea.status === true
                    ? tarea.color
                    : '',
                ]"
                href="#"
              >
                <span>
                  {{ tarea.day }}
                </span>
                <b
                  v-if="tarea.status"
                  class="bounce animated"
                >
                  🎂
                </b>
              </a>
            </li>
          </ul>
          <div class="clearfix" />
        </div>
      </div>
      <div class="col rightCol">
        <div
          v-if="option === 1"
          class="notes"
        >
          <div class="birthday">
            <span class="icon textyellow">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Miercoles 5 de Enero cumpleaños de Helen
            </span>
          </div>
          <div class="birthday">
            <span class="icon textblue">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Jueves 6 de Enero cumpleaños de Augusto
            </span>
          </div>
          <div class="birthday">
            <span class="icon textgreen">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Viernes 28 de enero cumpleaños de Hugo
            </span>
          </div>
        </div>
        <div
          v-if="option === 2"
          class="notes"
        >
          <div class="birthday">
            <span class="icon textgreen">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Viernes 25 de Febrero cumpleaños de Fernanda
            </span>
          </div>
        </div>
        <div
          v-if="option === 3"
          class="notes"
        >
          <div class="birthday">
            <span class="icon textyellow">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Martes 1 de Marzo cumpleaños de Valeria
            </span>
          </div>
          <div class="birthday">
            <span class="icon textgreen">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Viernes 4 de Marzo cumpleaños de Sebastian
            </span>
          </div>
          <div class="birthday">
            <span class="icon textred">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Jueves 10 de marzo cumpleaños de Alberto
            </span>
          </div>
          <div class="birthday">
            <span class="icon textblue">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Miercoles 23 de marzo cumpleaños de Denis
            </span>
          </div>
        </div>
        <div
          v-if="option === 4"
          class="notes"
        >
          <div class="birthday">
            <span class="icon textred">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Viernes 15 de Abril cumpleaños de Santa
            </span>
          </div>
          <div class="birthday">
            <span class="icon textred">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Viernes 15 de Abril cumpleaños de Bárbara
            </span>
          </div>
          <div class="birthday">
            <span class="icon textblue">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Viernes 29 de Abril cumpleaños de Ester
            </span>
          </div>
        </div>
        <div
          v-if="option === 5"
          class="notes"
        >
          <div class="birthday">
            <span class="icon textgreen">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Martes 3 de Mayo cumpleaños de Constanza
            </span>
          </div>
        </div>
        <div
          v-if="option === 6"
          class="notes"
        >
          <div class="birthday">
            <span class="icon textred">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Viernes 10 de Junio cumpleaños de Nestor
            </span>
          </div>
          <div class="birthday">
            <span class="icon textyellow">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Jueves 23 de Junio cumpleaños de Jésus
            </span>
          </div>
          <div class="birthday">
            <span class="icon textgreen">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Sabado 25 de Junio cumpleaños de Macarena
            </span>
          </div>
          <div class="birthday">
            <span class="icon textblue">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Domingo 26 de Junio cumpleaños de Diego
            </span>
          </div>
        </div>
        <div
          v-if="option === 7"
          class="notes"
        >
          <div class="birthday">
            <span class="icon textred">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Jueves 21 de Julio cumpleaños de Sofia
            </span>
          </div>
          <div class="birthday">
            <span class="icon textgreen">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Viernes 22 de Julio cumpleaños de Angie
            </span>
          </div>
        </div>
        <div
          v-if="option === 8"
          class="notes"
        >
          <div class="birthday">
            <span class="icon textred">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Sabado 20 de Agosto cumpleaños de Vanessa
            </span>
          </div>
          <div class="birthday">
            <span class="icon textblue">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Miercoles 27 de Agosto cumpleaños de Alvaro
            </span>
          </div>
        </div>
        <div
          v-if="option === 9"
          class="notes"
        >
          <div class="birthday">
            <span class="icon textyellow">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Miercoles 14 de Septiembre cumpleaños de Vasco
            </span>
          </div>
          <div class="birthday">
            <span class="icon textgreen">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Jueves 15 de Septiembre cumpleaños de Daniela
            </span>
          </div>
          <div class="birthday">
            <span class="icon textblue">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Viernes 16 de Septiembre cumpleaños de Miguel
            </span>
          </div>
        </div>
        <div
          v-if="option === 10"
          class="notes"
        />
        <div
          v-if="option === 11"
          class="notes"
        >
          <div class="birthday">
            <span class="icon textred">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Viernes 11 de Noviembre cumpleaños de Lennon
            </span>
          </div>
          <div class="birthday">
            <span class="icon textblue">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Sabado 12 de Noviembre cumpleaños de Isabel
            </span>
          </div>
          <div class="birthday">
            <span class="icon textblue">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Sabado 12 de Noviembre cumpleaños de Claudia
            </span>
          </div>
          <div class="birthday">
            <span class="icon textgreen">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Miercoles 23 de Noviembre cumpleaños de Domingo
            </span>
          </div>
        </div>
        <div
          v-if="option === 12"
          class="notes"
        >
          <div class="birthday">
            <span class="icon textred">
              <fa-icon :icon="['fas', 'circle']" />
            </span>
            <span class="list">
              Lunes 19 de Diciembre cumpleaños de Pamela
            </span>
          </div>
        </div>
      </div>
      <div class="clearfix" />
    </div>
  </div>
</template>

<script>
import Meses from '~/static/meses.json'
export default {
  data () {
    return {
      Enero: {},
      Febrero: {},
      Marzo: {},
      Abril: {},
      Mayo: {},
      Junio: {},
      Julio: {},
      Agosto: {},
      Septiembre: {},
      Noviembre: {},
      Octubre: {},
      Diciembre: {},
      option: '',
      mes: ''
    }
  },
  created () {
    const date = new Date()
    const mesActual = date.getMonth() + 1
    this.option = mesActual
    console.log(this.option)
    this.Mes(this.option)
    this.Meses()
  },
  methods: {
    Meses () {
      this.Enero = Meses.enero
      this.Febrero = Meses.febrero
      this.Marzo = Meses.marzo
      this.Abril = Meses.abril
      this.Mayo = Meses.mayo
      this.Junio = Meses.junio
      this.Julio = Meses.julio
      this.Agosto = Meses.agosto
      this.Septiembre = Meses.septiembre
      this.Octubre = Meses.octubre
      this.Noviembre = Meses.noviembre
      this.Diciembre = Meses.diciembre
    },
    Mes (mes) {
      console.log(mes)
      if (mes === 1) {
        this.mes = 'Enero'
      }
      if (mes === 2) {
        this.mes = 'Febrero'
      }
      if (mes === 3) {
        this.mes = 'Marzo'
      }
      if (mes === 4) {
        this.mes = 'Abril'
      }
      if (mes === 5) {
        this.mes = 'Mayo'
      }
      if (mes === 6) {
        this.mes = 'Junio'
      }
      if (mes === 7) {
        this.mes = 'Julio'
      }
      if (mes === 8) {
        this.mes = 'Agosto'
      }
      if (mes === 9) {
        this.mes = 'Septiembre'
      }
      if (mes === 10) {
        this.mes = 'Octubre'
      }
      if (mes === 11) {
        this.mes = 'Noviembre'
      }
      if (mes === 12) {
        this.mes = 'Diciembre'
      }
    }
  }
}
</script>

<style scoped>
h1,
h2,
h3,
h4,
h5,
p {
  margin-bottom: 10px;
}
p {
  line-height: 20px;
}
a {
  text-decoration: none;
  color: #ff462b;
}
.clearfix {
  clear: both;
}
.animate {
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
/* required */
.calendar {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  width: 1200px;
  height: 720px;
  background-color: #ffffff;
  color: #333333;
  margin-top: 20px;
  flex-direction: row;
  flex: 1 1 0%;
}
.calendar h1,
.calendar h2 {
  font-weight: 300;
  font-size: 26px;
  line-height: 28px;
  text-transform: uppercase;
  margin: 0px 0px 20px 0px;
}
.calendar h1 span {
  display: block;
}
.calendar .col {
  position: relative;
  float: left;
  height: 100%;
}
.calendar .col .content {
  padding: 28px 5px 5px;
  text-align: center;
}
.calendar .col .fechas {
  padding: 15px 10px;
  text-align: center;
  width: 100%;
}
.calendar ul {
  margin: 0px;
}
.calendar ul li {
  list-style: none;
}
.calendar .leftCol {
  width: 20%;
  background-color: #233348;
  padding: 16px 0px;
}
.calendar .noteList li {
  color: #ffffff;
  margin-bottom: 10px;
}
.notes {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-wrap: wrap;
  padding-left: 5px;
  padding-right: 5px;
  align-items: center;
  justify-items: center;
}
.notes .mes {
  width: 100%;
  cursor: pointer;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  cursor: pointer;
}
.notes .mes:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}
.notes .mes .enter {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  padding-left: 35px;
  padding-right: 35px;
}
.messelect {
  background-color: rgba(255, 255, 255, 0.2);
}
.notes .mes .list {
  width: 50%;
  text-align: left;
  color: #ffffff;
  font-size: 16px;
}
.notes .mes .count {
  width: 50%;
  text-align: right;
  color: #ffffff;
  font-size: 18px;
}
.notes .birthday {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  margin: 25px 0px;
}
.notes .birthday .list {
  width: 90%;
  text-align: left;
  color: #9e9e9e;
  font-size: 16px;
  padding-left: 15px;
  padding-right: 15px;
}
.notes .birthday .birthday {
  width: 10%;
  text-align: left;
  color: gray;
  font-size: 18px;
  padding-left: 15px;
  padding-right: 15px;
}
.calendar .notes input {
  background-color: #f48989;
  color: #ffffff;
  border: none;
  width: 200px;
}
.calendar .addNote,
.calendar .removeNote {
  float: right;
  color: rgba(255, 255, 255, 0.4);
  font-weight: bold;
  margin-left: 20px;
}
.calendar .addNote:hover,
.calendar .removeNote:hover {
  color: #ffffff;
}
.mayus {
  text-transform: uppercase;
}
.calendar .addNote {
  font-size: 16px;
}
.calendar .leftCol h1 {
  color: #ffffff;
  margin-bottom: 6px;
}
.calendar .rightCol {
  width: 25%;
  padding-top: 80px;
  padding-bottom: 15px;
  padding-left: 24px;
  padding-right: 20px;
}
.calendar .centerCol {
  width: 55%;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
}
.calendar .rightCol h2 {
  color: #c7bebe;
  text-align: right;
  margin-bottom: 70px;
}
.calendar .centerCol h2 {
  color: #333333;
  text-align: center;
  padding-bottom: 3px;
  padding-top: 60px;
  font-weight: 500;
}
.calendar .months li,
.calendar .weekday li {
  float: left;
  text-transform: uppercase;
}
.calendar .days li {
  float: left;
  text-transform: uppercase;
  margin-bottom: 5px;
}
.calendar .months li a,
.calendar .weekday li a,
.calendar .days li a {
  display: block;
  color: #000;
}
.calendar .months li a {
  font-size: 10px;
  color: #c7bebe;
  text-align: center;
  width: 32px;
  margin-bottom: 20px;
}
.calendar .months li .selected {
  font-weight: bold;
  color: #747978;
}
.calendar .weekday li a {
  width: 72px;
  text-align: center;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 500;
}
.calendar .days li {
  width: 72px;
}
.calendar .days li a {
  width: 3.5rem;
  height: 3.5rem;
  text-align: center;
  margin: auto auto;
  font-size: 18px;
  font-weight: 500;
  border-radius: 50%;
  display: grid;
  place-items: center;
  display: flex;
  padding-left: 10px;
}
.calendar .days li a b {
  width: 60%;
  text-align: center;
  font-size: 20px;
}
.calendar .days li a span {
  width: 40%;
  text-align: left;
}
.calendar .days li a:hover {
  background-color: #eeede9;
}
.calendar .days li .selected {
  background-color: #f5a1a3 !important;
  color: #ffffff;
}
.calendar .days li .event {
  color: #f5a1a3;
}
/* placeholder color */
::-webkit-input-placeholder {
  color: #ffffff;
}
:-moz-placeholder {
  color: #ffffff;
}
::-moz-placeholder {
  color: #ffffff;
}
:-ms-input-placeholder {
  color: #ffffff;
}
.yellow {
  background: #9dd345;
  color: #fff !important;
}
.red {
  background: #ea1051;
  color: #fff !important;
}
.green {
  background: #233348;
  color: #fff !important;
}
.blue {
  background: #eb7e60;
  color: #fff !important;
}
.textblue {
  color: #eb7e60;
}
.textyellow {
  color: #9dd345;
}
.textred {
  color: #ea1051;
}
.textgreen {
  color: #233348;
}
.textblue {
  color: #eb7e60;
}
.bounce {
  animation: bounce 2s infinite;
  -webkit-animation: bounce 2s infinite;
  -moz-animation: bounce 2s infinite;
  -o-animation: bounce 2s infinite;
}
.bounce2 {
  animation: bounce 2s infinite;
  -webkit-animation: bounce 2s infinite;
  -moz-animation: bounce 2s infinite;
  -o-animation: bounce 2s infinite;
  -webkit-animation-delay: 0.5s;
  animation-delay: 0.5s;
}
.bounce3 {
  animation: bounce 2s infinite;
  -webkit-animation: bounce 2s infinite;
  -moz-animation: bounce 2s infinite;
  -o-animation: bounce 2s infinite;
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
}
@-webkit-keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    -webkit-transform: translateY(0);
  }
  40% {
    -webkit-transform: translateY(-30px);
  }
  60% {
    -webkit-transform: translateY(-15px);
  }
}
@-moz-keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    -moz-transform: translateY(0);
  }
  40% {
    -moz-transform: translateY(-30px);
  }
  60% {
    -moz-transform: translateY(-15px);
  }
}
@-o-keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    -o-transform: translateY(0);
  }
  40% {
    -o-transform: translateY(-30px);
  }
  60% {
    -o-transform: translateY(-15px);
  }
}
@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}
</style>
