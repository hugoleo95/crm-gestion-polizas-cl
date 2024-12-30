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
              v-if="data.length > 0"
              class="text-white shadow-dropdow btn-new btn-width py-2 px-3"
              variant="primary"
              @click="mergeSave()"
            >
              Fusionar
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
      <div class="justify-content-between align-items-center">
        <div class="pd-merge">
          <div
            v-for="lead in data"
            :key="lead"
            class="mb-3 w-100 d-flex align-items-end"
          >
            <b-form-checkbox
              :checked="lead.value"
              size="sm"
              class="mx-2 d-flex align-items-center"
              @change="selectRow({ row: lead.id })"
            />
            <div class="content-merge">
              <label class="text-merge">{{ lead.name }}</label>
            </div>
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
        Una vez lo hayas hecho, el nuevo cliente aparecerá en la primera fila en la pantalla de “Clientes”
      </p>
      <div class="my-2 text-right">
        <b-button
          class="btn-new ml-4"
          variant="outline-primary"
        >
          Cancelar
        </b-button>
        <b-button
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
  </div>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      required: false,
      default: () => ([])
    },
    title: {
      type: String,
      default: 'Selección'
    },
    showlead: {
      type: Boolean,
      default: false
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
  data () {
    return {
      allSelectedLeads: false
    }
  },
  computed: {
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
    toggleAll () {
      this.selected = this.allSelectedLeads ? this.data.slice() : []
    },
    mergeSave () {
      this.$bvModal.msgBoxConfirm('¿Seguro que estos son todos los leads que deseas a fusionar?', {
        title: 'Confirmar',
        titleClass: 'mdtitle',
        size: 'md',
        buttonSize: 'md',
        cancelVariant: 'btn text-white p-2 px-3 btn-secondary',
        okVariant: 'btn text-white p-2 px-3 btn-danger',
        okTitle: 'Si',
        cancelTitle: 'No',
        contentClass: 'border-0 radius',
        bodyClass: 'pxmodal',
        headerClass: 'pdmodal border-bottom-0',
        footerClass: 'pdmodal border-top-0',
        centered: true
      }).then((value) => {
        if (value) {
          this.$emit('SaveMerge')
        }
      })
    },
    mergeSaveModal () {
      this.$refs['modal-success'].show()
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
  margin-top: 3px;
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
</style>
