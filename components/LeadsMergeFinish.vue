<template>
  <div>
    <div class="d-flex btn-open">
      <b-button
        v-b-toggle.leads-merge
        class="py-2 pdbutton position-absolute"
        size="sm"
        variant="primary"
      >
        <fa-icon
          :icon="['fas', 'chevron-left']"
          class="text-white"
          style="font-size: .9rem"
        />
      </b-button>
    </div>
    <b-sidebar
      id="leads-merge"
      :sidebar-class="{
        'merge top': variant === 'default',
        'merge mtop': variant === 'new-default',
      }"
      :width="width"
      body-class="sidebar-body"
      header-class="header-sidebar"
      footer-class="align-items-center justify-content-center p-4"
      right
      shadow
    >
      <template #header="">
        <b-button
          v-b-toggle.leads-merge
          class="text-white py-2 pdbutton btn-close mr-4"
          size="sm"
          variant="primary"
        >
          <fa-icon
            :icon="['fas', 'chevron-right']"
            class="text-white"
            style="font-size: .9rem"
          />
        </b-button>
        <h4 id="sidebar-no-header-title">
          {{ title }}
        </h4>
      </template>
      <template #footer="">
        <div :class="{ 'mgfooter': variant === 'default', 'mfooter': variant === 'new-default' }">
          <div class="mb-2">
            <b-button
              class="text-white shadow-dropdow btn-new btn-width py-2 px-3"
              variant="primary"
              @click="mergeSaveModal()"
            >
              Confirmar
            </b-button>
          </div>
          <!--<b-button
            v-model="allSelectedLeads"
            class="shadow-dropdow btn-new py-2 px-3"
            variant="outline-primary"
            :pressed.sync="allSelectedLeads"
            @click="toggleAll"
          >
            {{ allSelectedLeads ? 'Deseleccionar todo' : 'Seleccionar todo' }}
          </b-button>
          -->
        </div>
      </template>
      <div
        v-if="loader"
        class="w-100 d-flex justify-content-center"
      >
        <span class="loader2">
          <img
            src="~assets/icons/loading2.gif"
            class="w-16"
          />
        </span>
      </div>
      <div v-else>
        <div class="justify-content-between align-items-center">
          <div class="pd-merge">
            <div class="mb-3 w-100 d-flex align-items-end">
              <div class="d-flex flex-column align-content-between mt-2">
                <div class="content-merge">
                  Rut:
                  <div class="stext col">
                    {{ data.rut }}
                  </div>
                </div>
                <div class="content-merge">
                  Razón Social:
                  <span class="stext col">
                    {{ data.razon_social }}
                  </span>
                </div>
                <div class="content-merge">
                  Nombre:
                  <span class="stext col">
                    {{ data.name }}
                  </span>
                </div>
                <div class="content-merge">
                  Apellido:
                  <span class="stext col">
                    {{ data.last_name }}
                  </span>
                </div>
                <div class="content-merge">
                  Giro:
                  <span class="stext col">
                    {{ data.giro }}
                  </span>
                </div>
                <div class="content-merge">
                  Persona:
                  <span class="stext col">
                    {{ FormaterPerson(data.person) }}
                  </span>
                </div>
                <div class="content-merge">
                  Email:
                  <span class="stext col">
                    {{ data.email }}
                  </span>
                </div>
                <div class="content-merge">
                  Teléfono:
                  <span class="stext col">
                    {{ data.phone }}
                  </span>
                </div>
                <div class="content-merge">
                  Dirección:
                  <span class="stext col">
                    {{ data.address }}
                  </span>
                </div>
                <div class="content-merge">
                  Comuna:
                  <span class="stext col">
                    {{ data.comuna }}
                  </span>
                </div>
                <div class="content-merge">
                  Ejecutivo:
                  <span class="stext col">
                    {{ getLeadUser(data.user) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="justify-content-between align-items-center">
          <div class="content-merge pt-4 pb-3">
            <span
              v-if="Products"
              @click="viewmodalproduct()"
              class="cursor-pointer"
            >
              <h6 class="new pb-2">
                {{ Products.length }}
                Productos
                <fa-icon
                  :icon="['fas', 'file-alt']"
                  class="pl-1 text-primary return"
                  style="width:20px;"
                />
              </h6>
            </span>
            <span
              v-if="Solicitudes"
              @click="viewmodalrequest()"
              class="pl-2 cursor-pointer"
            >
              <h6 class="new pb-2">
                {{ Solicitudes.length }}
                Solicitudes
                <fa-icon
                  :icon="['fas', 'inbox']"
                  class="pl-1 text-primary return"
                  style="width:20px;"
                />
              </h6>
            </span>
          </div>
        </div>
      </div>
    </b-sidebar>
    <b-modal
      ref="modal-success"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5 pb-3">
        <h3 class="title-text">
          ¿Estás seguro que quieres fusionar los datos?
        </h3>
      </div>
      <p class="my-4 text-base">
        Una vez lo hayas hecho, el nuevo cliente aparecerá en la primera fila en la pantalla de Leads o Clientes ya sea el caso,
        y los demas leads quedaran ocultos
      </p>
      <div class="my-2 text-right">
        <b-button
          @click="nomergeSave"
          class="btn-new ml-4"
          variant="outline-primary"
        >
          Cancelar
        </b-button>
        <b-button
          @click="mergeSave"
          class="text-white btn-new ml-4"
          variant="primary"
        >
          Fusionar los datos
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-alert"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-4 d-flex align-items-center justify-content-center">
        <b-avatar
          text="X"
          size="4rem"
          variant="danger"
          class="align-center"
        />
      </div>
      <div class="pt-4 pb-3">
        <h3 class="title-text">
          Lo sentimos, no podemos fusionar los datos
        </h3>
      </div>
      <p class="my-4 text-base">
        Para poder completar la fusión de datos, debes seleccionar un campo para cada uno de los datos, de contacto
      </p>
      <div class="my-2 text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4"
          variant="primary"
        >
          ¡Entendido!
        </b-button>
      </div>
    </b-modal>
    <view-products-lead
      v-if="viewproduct"
      :data="Products"
      @hidde="onCloseModal"
      @cancel-lead="onCloseModal"
    />
    <view-request-lead
      v-if="viewrequest"
      :data="Solicitudes"
      @hidde="onCloseModal2"
      @cancel-lead="onCloseModal2"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import ViewProductsLead from '~/components/ViewProductsLead.vue'
import ViewRequestLead from '~/components/ViewRequestLead.vue'

export default {
  props: {
    show: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object,
      required: false
    },
    Products: {
      type: Object,
      required: false
    },
    Solicitudes: {
      type: Object,
      required: false
    },
    title: {
      type: String,
      default: 'Selección'
    },
    showlead: {
      type: Boolean,
      default: false
    },
    loader: {
      type: Boolean,
      default: true
    },
    newlead: {
      type: Array,
      required: false,
      default: () => ([])
    },
    width: {
      type: String,
      default: '260px'
    },
    variant: {
      type: String,
      default: 'default'
    }
  },
  components: {
    ViewProductsLead,
    ViewRequestLead
  },
  data () {
    return {
      allSelectedLeads: false,
      viewproduct: false,
      viewrequest: false
    }
  },
  computed: {
    ...mapState('leads', ['users']),
    localShow: {
      get () {
        return this.show
      },
      set (value) {
        this.$emit('update:show', value)
      }
    },
    selected: {
      get () {
        return this.data
      },
      set (value) {
        if (value) {
          this.$emit('onSelectedLeads', value)
        }
      }
    }
  },
  methods: {
    viewmodalproduct () {
      this.viewproduct = true
    },
    viewmodalrequest () {
      this.viewrequest = true
    },
    toggleAll () {
      this.selected = this.allSelectedLeads ? this.data.slice() : []
    },
    onCloseModal () {
      this.viewproduct = false
    },
    onCloseModal2 () {
      this.viewrequest = false
    },
    mergeSave () {
      this.$emit('SaveMerge')
      this.nomergeSave()
    },
    mergeSaveModal () {
      this.$refs['modal-success'].show()
    },
    nomergeSave () {
      this.$refs['modal-success'].hide()
    },
    getLeadUser (user) {
      if (user) {
        const leadUser = this.users.find(({ id }) => user === id)
        if (leadUser.first_name) {
          return leadUser.first_name
        } else if (leadUser.email) {
          return leadUser.email.split('@')[0]
        } else {
          return 'Sin asignar'
        }
      }
      return 'Sin asignar'
    },
    FormaterPerson (date) {
      if (process.env.version === 'CL') {
        if (date === 'legal_person') {
          return 'Persona legal'
        } else {
          return 'Persona natural'
        }
      }
      if (process.env.version === 'MX') {
        if (date === 'legal_person') {
          return 'Persona Moral'
        } else {
          return 'Persona Fisica'
        }
      }
    },
    selectRow ({ row }) {
      const payload = {
        id: row
      }
      this.$emit('deleteselect', payload)
    }
  }
}
</script>
<style lang="scss">
.merge {
  border-top-left-radius: 10px;
}
.top {
  top: 140px;
}
.mtop {
  top: 80px;
}
.custom-checkbox {
  padding-bottom: 15px !important;
}
.mfooter {
  margin-bottom: 80px;
  display: grid;
}
.mgfooter {
  margin-bottom: 150px;
  display: grid;
}
.btn-open {
  justify-content: end;
  margin-right: -45px;
}
.btn-close {
  justify-content: start;
  margin-left: -30px;
}
.sidebar-body {
  padding: 10px 30px 10px 30px;
}
.header-sidebar {
  padding-top: 60px !important;
}
.content-merge {
  display: flex;
  flex-wrap: wrap;
}
.stext {
  color: #8d8d8d !important;
  padding-right: 0px;
}
.text-merge {
  font-style: normal;
  font-size: 14px;
  line-height: 17px;
  color: #000000;
}
.pd-merge {
  padding-left: 15px;
  padding-right: 15px;
}
.title-text {
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
}
.pdbutton {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.btn-width {
  width: 100%;
}
.btn-outline-primary:hover {
  color: #ffffff;
}
.b-avatar-text {
  font-size: calc(2.8rem) !important;
}
.cursor-pointer {
  cursor: pointer;
}
.loader {
  right: 9px;
  top: 45px;
}
.loader2 {
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-items: center;
  position: relative !important;
}
@media (max-width: 1236px) {
  .loader {
    right: 9px;
    top: 45px;
  }
  .loader2 {
    right: 0px;
    top: -10px;
  }
}
@media (max-width: 1080px) {
  .loader {
    right: 9px;
    top: 45px;
  }
  .loader2 {
    right: 0px;
    top: -10px;
  }
}
@media (max-width: 960px) {
  .loader {
    right: 9px;
    top: 45px;
  }
  .loader2 {
    right: 0px;
    top: -10px;
  }
}
@media (max-width: 904px) {
  .loader {
    right: 9px;
    top: 45px;
  }
  .loader2 {
    right: 0px;
    top: -10px;
  }
}
@media (max-width: 904px) {
  .loader {
    right: 9px;
    top: 45px;
  }
  .loader2 {
    right: 0px;
    top: -10px;
  }
}
@media (max-width: 768px) {
  .loader {
    right: 9px;
    top: 45px;
  }
  .loader2 {
    right: 0px;
    top: -10px;
  }
}
.w-16 {
  width: 150px !important;
}
</style>
