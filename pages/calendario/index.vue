<template>
  <div>
    <div v-if="calendar" class="w-100 d-flex">
      <div class="w-100 d-flex justify-content-end">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4 px-3"
          variant="primary"
          @click="newEvent()"
        >
          <fa-icon class="mr-1" :icon="['fas', 'plus']" /> Nuevo evento
        </b-button>
      </div>
    </div>
    <div v-if="calendar" class="w-100 mb-5 mt-3">
      <iframe
        :src="urlcalendar"
        style="border-width: 0"
        width="100%"
        height="500"
        frameborder="0"
        scrolling="no"
      />
    </div>
    <b-modal
      ref="modal-new-event"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <section class="ftco-section">
        <div class="form-row w-100 d-flex justify-content-center mt-4">
          <div class="form-group-relation w-100">
            <h3 class="title">Por favor Ingrese los campos</h3>
            <label class="text-base" for="name">Titulo :</label>
            <input
              id="titulo"
              v-model="Event.title"
              placeholder=""
              class="form-control form-input mt-1"
              type="text"
            />
            <label class="text-base" for="name">Descripción :</label>
            <input
              id="descripcion"
              v-model="Event.descripcion"
              placeholder=""
              class="form-control form-input mt-1"
              type="text"
            />
            <label class="text-base mt-1" for="name">Fecha y hora :</label>

            <input
              id="fecha"
              v-model="Event.date"
              placeholder=""
              class="form-control form-input mt-1 w-50"
              type="datetime-local"
            />
            <div class="pl-0 mt-3">
              <label class="text-base" for="birth_date"
                >Invitados Simplee :</label
              >
              <!-- Prop `add-on-change` is needed to enable adding tags vie the `change` event -->
              <b-form-tags
                id="tags-component-select"
                v-model="Event.attendes"
                size="md"
                add-on-change
                tag-variant="primary"
                no-outer-focus
                class=""
              >
                <template
                  #default="{
                    tags,
                    inputAttrs,
                    inputHandlers,
                    disabled,
                    removeTag,
                  }"
                >
                  <b-form-select
                    v-bind="inputAttrs"
                    :disabled="disabled || availableOptions.length === 0"
                    :options="availableOptions"
                    class="form-control w-100 form-input custom-select mb-3"
                    v-on="inputHandlers"
                  >
                    <template #first>
                      <!-- This is required to prevent bugs with Safari -->
                      <option disabled value="">Seleccione una etiqueta</option>
                    </template>
                  </b-form-select>
                  <ul
                    v-if="tags.length > 0"
                    class="list-inline d-inline-block mb-2"
                  >
                    <li
                      v-for="tag in tags"
                      :key="tag"
                      class="list-inline-item mb-2"
                    >
                      <b-form-tag
                        :title="tag"
                        :disabled="disabled"
                        class="text-white"
                        variant="primary"
                        @remove="removeTag(tag)"
                      >
                        {{ tag }}
                      </b-form-tag>
                    </li>
                  </ul>
                </template>
              </b-form-tags>
            </div>
            <div class="pl-0 mt-3">
              <label class="text-base" for="birth_date"
                >Invitados Externos :</label
              >
              <!-- Prop `add-on-change` is needed to enable adding tags vie the `change` event -->
              <b-form-tags
                id="tags-component-select"
                v-model="Event.attendess"
                size="md"
                add-on-change
                tag-variant="primary"
                no-outer-focus
              >
                <template
                  #default="{
                    tags,
                    inputAttrs,
                    inputHandlers,
                    disabled,
                    removeTag,
                  }"
                >
                  <b-form-input
                    v-bind="inputAttrs"
                    :disabled="disabled || availableOptions2.length === 0"
                    :options="availableOptions2"
                    class="form-control w-100 form-input custom-select mb-3"
                    v-on="inputHandlers"
                  >
                    <template #first>
                      <!-- This is required to prevent bugs with Safari -->
                      <option disabled value="">Seleccione una etiqueta</option>
                    </template>
                  </b-form-input>
                  <ul
                    v-if="tags.length > 0"
                    class="list-inline d-inline-block mb-2"
                  >
                    <li
                      v-for="tag in tags"
                      :key="tag"
                      class="list-inline-item mb-2"
                    >
                      <b-form-tag
                        :title="tag"
                        :disabled="disabled"
                        class="text-white"
                        variant="primary"
                        @remove="removeTag(tag)"
                      >
                        {{ tag }}
                      </b-form-tag>
                    </li>
                  </ul>
                </template>
              </b-form-tags>
            </div>
            <b-button
              class="text-white p-2 px-3 mt-5"
              size="sm"
              variant="danger"
              @click="hideEventModal()"
            >
              Cancelar
            </b-button>
            <b-button
              class="text-white p-2 px-3 mt-5 ml-4"
              size="sm"
              variant="primary"
              @click="PostEvent()"
            >
              Crear
            </b-button>
          </div>
        </div>
      </section>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import moment from "moment";
import Session from "@/mixins/auth";

export default {
  name: "Calendario",
  components: {},
  mixins: [Session],
  data() {
    return {
      titlestate: "Estado de solicitudes",
      calendar: true,
      Event: {},
      urlcalendar:
        "https://calendar.google.com/calendar/embed?src=" +
        this.$store.state.localStorage.user.email +
        "&bgcolor=%23233348&wkst=2&showPrint=0&showTitle=0&showNav=1&mode=WEEK&color=%23039BE5&color=%23AD1457&color=%2333B679&color=%230B8043",
    };
  },
  computed: {
    ...mapState("leads", ["refferals", "users", "channels", "campanas"]),
    ...mapState(["leadsFilters", "filtersselect"]),
    urlParams() {
      return {
        start: this.leadsFilters.startDate,
        end: this.leadsFilters.endDate,
      };
    },
    availableOptions() {
      console.log(this.users);
      if (typeof this.Event.attendes === "undefined") {
        const lead = [];
        for (const [key, value] of Object.entries(this.users)) {
          if (value) {
            const newlead = {
              text: value.email,
              value: value.email,
            };
            lead.push(newlead);
          }
        }
        return lead;
      } else {
        this.users = this.users.filter(
          ({ value }) => !this.Event.attendes.includes(value)
        );
        const lead = [];
        for (const [key, value] of Object.entries(this.users)) {
          if (value) {
            const newlead = {
              text: value.email,
              value: value.email,
            };
            lead.push(newlead);
          }
        }
        return lead;
      }
    },
    availableOptions2() {
      console.log(this.users);
      if (typeof this.Event.attendess === "undefined") {
        const lead = [];
        for (const [key, value] of Object.entries(this.users)) {
          if (value) {
            const newlead = {
              text: value.email,
              value: value.email,
            };
            lead.push(newlead);
          }
        }
        return lead;
      } else {
        this.users = this.users.filter(
          ({ value }) => !this.Event.attendess.includes(value)
        );
        const lead = [];
        for (const [key, value] of Object.entries(this.users)) {
          if (value) {
            const newlead = {
              text: value.email,
              value: value.email,
            };
            lead.push(newlead);
          }
        }
        return lead;
      }
    },
  },
  watch: {
    urlParams: {
      deep: true,
      handler(value) {
        this.ChangeTitle(value.start);
      },
    },
  },
  methods: {
    ...mapMutations(["setFilters"]),
    ChangeTitle(value) {
      console.log(value);
      if (moment(value) > moment("2023-01-01")) {
        this.titlestate = "Estado de solicitudes";
      } else {
        this.titlestate = "Estado de leads";
      }
    },
    newEvent() {
      this.$refs["modal-new-event"].show();
    },
    hideEventModal() {
      this.$refs["modal-new-event"].hide();
    },
    async PostEvent() {
      if (!this.Event.title || !this.Event.descripcion || !this.Event.date) {
        this.$store.commit("setAlertMessage", {
          error: "Todos los campos son obligatorios",
        });
        return;
      }
      this.calendar = false;
      if (this.Event.attendess.length > 0 && this.Event.attendes.length > 0) {
        const lead = [];
        for (let i = 0; i < this.Event.attendes.length; i++) {
          lead.push(this.Event.attendes[i]);
        }
        for (let i = 0; i < this.Event.attendess.length; i++) {
          lead.push(this.Event.attendess[i]);
        }
        this.Event.attendes = lead;
      }
      if (this.Event.attendess.length > 0 && this.Event.attendes.length === 0) {
        this.Event.attendes = this.Event.attendess;
      }
      if (this.Event.attendess.length == 0 && this.Event.attendes.length > 0) {
        this.Event.attendes = this.Event.attendes;
      }
      console.log(this.Event.attendes);
      try {
        await this.$simpleeApi.post("/add_calendar_custom_event/", {
          date: this.Event.date,
          title: this.Event.title,
          description: this.Event.descripcion,
          attendes: this.Event.attendes,
        });
        this.$store.commit("setAlertMessage", { success: "Evento creado!" });
        this.$refs["modal-new-event"].hide();
        this.calendar = true;
      } catch (error) {
        this.calendar = true;
        this.$store.commit("setAlertMessage", error.response.data);
      }
      this.Event.attendes = [];
      this.Event.attendess = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  min-height: 100%;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: minmax(38px, 40px) minmax(600px, max-content) minmax(
      400px,
      max-content
    );
  gap: 1.5em 1.5em;
}
.toolbar {
  grid-column: 1/4;
  grid-row: 1;
}

.commisions,
.states,
.channels {
  grid-row: 2;
}
.channels {
  grid-column: 1;
}
.states {
  grid-column: 2;
}
.commisions {
  grid-column: 3;
}
.sub-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-auto-rows: minmax(0, 1fr);
  gap: 0em 1.5em;
  grid-column: 1/4;
  grid-row: 3;
}
.policies {
  grid-column: 2/3;
  grid-row: 1;
}
.ufs {
  grid-column: 1/2;
  grid-row: 1;
}
.shadow {
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}
.prueba {
  height: inherit;
}
.title {
  margin-bottom: 10px;
  background-color: transparent;
  font-family: Rubik;
  font-style: normal;
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 19px;
  outline: 0px solid transparent;
  border: 0px solid transparent;
  padding-bottom: 7px;
  color: #000;
}
.form-control {
  border: 1px solid #505755 !important;
  border-radius: 8px !important;
}
.form-row .form-group-request {
  width: 100%;
}
</style>
