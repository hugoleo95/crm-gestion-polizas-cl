<template>
    <div>
      <b-modal
        v-model="localShow"
        title="Crear/Simplee"
        modal-class="draggable-modal"
        header-class="border-bottom-0"
        size="lg"
        body-class="padding-modal"
        scrollable
        content-class="border-0 radius"
        no-close-on-backdrop
        @hidden="$emit('hidde')"
      >
        <template #modal-header="{}">
          <div class="max-size pl-3 pt-5" @mousedown="dragModal">
            <h5>
              <fa-icon :icon="['fas', 'edit']" class="text-primary mr-2" /><b>Bitacora</b>/ Simplee
            </h5>
            <p>Manten presionado para arrastrar el modal</p>
          </div>
        </template>
        <template #modal-footer="{}">
          <b-button
            v-if="activesave"
            class="text-white py-2 px-3 mr-2"
            size="sm"
            variant="primary"
            @click="saveBitacora()"
          >
            Guardar y continuar
          </b-button>
          <b-button
            v-if="activesaveEdit && optiond=='list'"
            class="text-white py-2 px-3 mr-2"
            size="sm"
            variant="primary"
            @click="EditBitacora()"
          >
            Modificar y continuar
          </b-button>
          <b-button
            class="text-white p-2 px-3"
            size="sm"
            variant="secondary"
            @click="cancelBitacora()"
          >
            Cerrar
          </b-button>
        </template>
        <div class="d-flex justify-content-between align-items-center">
          <div class="menu d-flex">
            <button
              v-if="optiond === 'list'"
              :class="[{ active: optiond === 'list' }, 'mr-3']"
              style="font-size: 1.15rem;"
              @click="optiond = 'list'"
            >
              Editar
            </button>
            <button
              v-if="optiond === 'crear'"
              :class="[
                { active: optiond === 'crear' },
                'mr-3',
              ]"
              style="font-size: 1.15rem;"
              @click="optiond = 'crear'"
            >
              Nuevo
            </button>
          </div>
        </div>
        <div class="action-container">
          <s-form-table>
            <tr>
              <th>Estado</th>
              <td>
                <b-form-select v-model="stateinput">
                    <template #first>
                      <b-form-select-option value="pending">
                        Pendiente
                      </b-form-select-option>
                      <b-form-select-option value="renewed">
                        Renovado
                      </b-form-select-option>
                      <b-form-select-option value="change_company">
                        Cambio de compañia
                      </b-form-select-option>
                      <b-form-select-option value="no_corresponde">
                        No corresponde
                      </b-form-select-option>
                    </template>
                  </b-form-select>
              </td>
            </tr>
  
            <tr>
              <th>Descripción</th>
              <td>
                <b-form-textarea
                  id="descriptioninput"
                  v-model="descriptioninput"
                  placeholder="Agregar Descripción de Bitacora"
                  rows="2"
                  max-rows="10"
                  @input="setVerifyForm"
                />
              </td>
            </tr>
  
            <!--<tr>
              <th>Fecha</th>
              <td>
                <b-form-input
                  id="inputdate"
                  v-model="inputdate"
                  class="form-control form-input"
                  type="datetime-local"
                  @input="setVerifyForm"
                />
              </td>
            </tr>-->
          </s-form-table>
        </div>
      </b-modal>
    </div>
  </template>
  <script>
  import SFormTable from '@/components/base/SFormTable.vue'
  export default {
    components: {
      SFormTable
    },
    props: {
      show: {
        type: Boolean,
        default: true
      },
      idrequest: {
        type: Number,
        default: 0
      },
      idlead: {
        type: Number,
        default: 0
      },
      value: {
        type: Object,
        default: () => ({
          bitacora: [{ bitacora: null }],
          diagnostics: [{}]
        })
      },
      bitacoradata: {
        type: Array,
        required: true
      },
      requestsi: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        optiond: 'crear',
        bitacora: this.bitacoradata || [],
        titleinput: this.bitacoradata.title || '',
        stateinput: this.bitacoradata.state || '',
        descriptioninput: this.bitacoradata.description || '',
        inputdate: this.bitacoradata.created_at,
        activesave: false,
        activesaveEdit: true
      }
    },
    computed: {
      localLead: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      },
  
      localShow: {
        get () {
          return this.show
        },
        set (value) {
          this.$emit('update:show', value)
        }
      }
  
    },
    watch: {
      localLead: {
        handler (value) {
          console.log(value)
        }
      },
  
      'localLead.rut': {
        handler () {
          this.getLeadsWithSameRut()
        }
      },
  
      Bitacoradata: {
        handler (val) {
          console.log('valor vall:', val)
          this.databitacora(val)
        }
      }
  
    },
    created () {
      if (this.requestsi) {
        this.optiond = 'list'
      }
    },
    methods: {
      databitacora (val) {
        this.bitacora = val
      },
      dragModal (e) {
        const modal = document.querySelector('.draggable-modal')
        const position = modal.getBoundingClientRect()
  
        window.addEventListener('mousemove', mouseMove)
        window.addEventListener('mouseup', mouseUp)
  
        const prevX = e.clientX
        const prevY = e.clientY
        function mouseMove (e) {
          document.querySelector('.max-size').style.cursor = 'grabbing'
          const newX = prevX - e.clientX
          const newY = prevY - e.clientY
          modal.style.left = position.left - newX + 'px'
          modal.style.top = position.top - newY + 'px'
        }
        function mouseUp (e) {
          document.querySelector('.max-size').style.cursor = 'grab'
          window.removeEventListener('mousemove', mouseMove)
          window.removeEventListener('mouseup', mouseUp)
        }
      },
      getFechaActual () {
        const currentDateTime = new Date()
        const year = currentDateTime.getFullYear()
        const month = ('0' + (currentDateTime.getMonth() + 1)).slice(-2)
        const datee = ('0' + currentDateTime.getDate()).slice(-2)
        const hours = ('0' + currentDateTime.getHours()).slice(-2)
        const minutes = ('0' + currentDateTime.getMinutes()).slice(-2)
        // this.inputdate =
        return `${year}-${month}-${datee}T${hours}:${minutes}`
      },
      saveBitacora () {
        if (this.idrequest) {
          const datasend = {
            title: null,
            state: this.stateinput,
            description: this.descriptioninput,
            date: this.getFechaActual()
          }
  
          this.$emit('save-bitacora', datasend)
        }
      },
      EditBitacora () {
        console.log(this.stateinput, this.descriptioninput, this.inputdate)
          if ((this.stateinput && this.descriptioninput && this.inputdate)) {
            const datasend = {
              state: this.stateinput,
              description: this.descriptioninput,
              id: this.bitacora.id
            }
            this.$emit('edit-bitacora', datasend)
          }
      },
      cancelBitacora () {
        this.bitacora = []
        this.$emit('cancel-bitacora')
      },
  
      setVerifyForm () {
        if ((this.stateinput && this.descriptioninput)) {
          if (this.optiond === 'crear') {
            this.activesave = true
          } else {
            this.activesaveEdit = true
          }
        } else if (this.optiond === 'crear') {
          this.activesave = false
        } else {
          this.activesaveEdit = false
        }
      }
    }
  }
  </script>
  <style lang="scss" scoped>
  .tb-padding {
    padding: 13px;
  }
  
  .text-base {
    font-family: "Rubik";
    font-style: normal;
    font-size: 14px;
    line-height: 17px;
    color: #000000;
  }
  
  .title-text {
    font-weight: 500;
    font-size: 24px;
    line-height: 28px;
  }
  
  .text-val {
    padding: 0.5rem 1rem;
    font-weight: 300 !important;
    line-height: 18px !important;
  }
  
  .pd-val {
    padding: 0.8rem 1rem;
  }
  
  .nav-link {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-family: "Rubik";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #d3d3d3;
    cursor: pointer;
  }
  
  .nav-link.active {
    color: #000000;
    background-color: transparent;
  }
  
  .form-input {
    border: 1px solid #505755;
    border-radius: 8px;
  }
  
  .ml-2 {
    margin-left: 5px;
  }
  
  .pl-0 {
    padding-left: 0px !important;
  }
  
  .radius {
    border-radius: 6px;
  }
  
  .btn-new {
    padding: 10px 12px !important;
    font-size: 14px !important;
  }
  </style>
  