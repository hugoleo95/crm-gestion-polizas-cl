<template>
  <div>
    <b-modal
      id="lead-modal"
      ref="leadModal"
      v-model="localShow"
      modal-class="draggable-modal"
      size="lg"
      title="Importar excel"
      body-class="padding-modal"
      scrollable
      @hidden="$emit('hidde')"
    >
      <template #modal-header="{ }">
        <div
          class="max-size"
          @mousedown="dragModal"
        >
          <h5>
            <fa-icon
              :icon="['fas', 'edit']"
              class="text-primary mr-2"
            /><b>Importar excel cobros</b>
          </h5>
          <p>Manten presionado para arrastrar el modal</p>
        </div>
      </template>
      <template #modal-footer="{ }">
        <!-- <b-button
          class="text-white py-2 px-3 mr-2"
          size="sm"
          variant="danger"
          @click="saveLead()"
        >
          Eliminar lead
        </b-button> -->
        <b-button
          v-if="Statuscarga === 'leido'"
          class="text-white py-2 px-3 mr-2"
          size="sm"
          variant="primary"
          @click="saveLead()"
        >
          Cargar Cobranza
        </b-button>
        <b-button
          v-if="Statuscarga === 'finalizado'"
          class="text-white p-2 px-3"
          size="sm"
          variant="secondary"
          @click="ReverCarga()"
        >
          Volver a cargar
        </b-button>
        <b-button
          class="text-white p-2 px-3"
          size="sm"
          variant="danger"
          @click="cancelLead()"
        >
          Cerrar
        </b-button>
      </template>
      <div class="d-flex w-100 flex-column align-items-center">
        <div class="text-center w-100 pt-3">
          <InputMassive
            v-if="StatusInputMasivve"
            type="product"
            title="Arrastre el archivo excel para la carga masiva de cobros"
            urldocument="/formatocargacobranza.xlsx"
            @push-register="addCobranzas"
            @ActiveLoader="ActiveSetLoader"
            @DesactiveLoader="DesactiveSetLoader"
          />
        </div>
        <div
          v-if="StatusLoader"
          class="w-100 mt-3 d-flex justify-content-center"
        >
          <b-spinner
            style="width: 2.5rem; height: 2.5rem;"
            variant="primary"
            center
          />
        </div>
        <div
          v-if="Statuscarga === 'leido'"
          class="w-100 mt-3"
        >
          <span>-Polizas encontradas:</span>
          <b-table
            :items="PolizasEncontradas"
            :fields="CobranzaFields"
            thead-class="rowClassrequest2"
          >
            <template #table-busy>
              <div class="d-flex h-100">
                <div class="text-center text-primary pa-5 mx-auto h-100">
                  <b-spinner class="align-middle" />
                  <strong>Cargando...</strong>
                </div>
              </div>
            </template>
            <template #cell(date)="{ value }">
              {{ getBicatoraDate(value) }}
            </template>
          </b-table>
        </div>
        <div
          v-if="Statuscarga === 'finalizado'"
          class="w-100 mt-3"
        >
          <span>Se registraron {{ CobrosSatisfactorios }} cobros nuevos</span>
        </div>
        <div
          v-if="Statuscarga === 'leido'"
          class="w-100 mt-3"
        >
          <span>-Polizas no encontradas en la base de datos:</span>
          <b-table
            :items="PolizasNoEncontradas"
            :fields="CobranzaFields"
            thead-class="rowClassrequest2"
          >
            <template #table-busy>
              <div class="d-flex h-100">
                <div class="text-center text-primary pa-5 mx-auto h-100">
                  <b-spinner class="align-middle" />
                  <strong>Cargando...</strong>
                </div>
              </div>
            </template>
            <template #cell(date)="{ value }">
              {{ getBicatoraDate(value) }}
            </template>
          </b-table>
        </div>
        <div
          v-if="Statuscarga === 'finalizado' && PolizasYaCobranza.length > 0"
          class="w-100 mt-3"
        >
          <span>-Cobros que no se subieron porque la poliza que ya tienen cobranza o otro error:</span>
          <b-table
            :items="PolizasYaCobranza"
            :fields="CobranzaFieldsYaCobranza"
            thead-class="rowClassrequest2"
          >
            <template #table-busy>
              <div class="d-flex h-100">
                <div class="text-center text-primary pa-5 mx-auto h-100">
                  <b-spinner class="align-middle" />
                  <strong>Cargando...</strong>
                </div>
              </div>
            </template>
            <template #cell(date)="{ value }">
              {{ getBicatoraDate(value) }}
            </template>
          </b-table>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import InputMassive from '@/components/InputMassiveCobranza'
export default {
  components: {
    InputMassive
  },
  data () {
    return {
      CobrosSatisfactorios: 0,
      StatusInputMasivve: true,
      Statuscarga: 'sincargar',
      StatusLoader: false,
      localShow: true,
      PolizasEncontradas: [],
      PolizasNoEncontradas: [],
      PolizasYaCobranza: [],
      CobranzaFields: [
        {
          key: 'nro_poliza',
          label: 'Numero Poliza',
          sortable: false
        },
        {
          key: 'payment_type',
          label: 'Tipo de pago',
          sortable: false
        },
        {
          key: 'payment_date_start',
          label: 'Fecha inicio pago',
          sortable: false
        },
        {
          key: 'dues',
          label: 'Cuotas',
          sortable: false
        },
        {
          key: 'executive',
          label: 'Ejecutiva',
          sortable: false
        },
        {
          key: 'iva_percentage',
          label: 'Iva',
          sortable: false
        },
        {
          key: 'amount_dues',
          label: 'Monto Cuotas',
          sortable: false
        }
      ],
      CobranzaFieldsYaCobranza: [
        {
          key: 'nro_poliza',
          label: 'Numero Poliza',
          sortable: false
        },
        {
          key: 'payment_type',
          label: 'Tipo de pago',
          sortable: false
        },
        {
          key: 'payment_date_start',
          label: 'Fecha inicio pago',
          sortable: false
        },
        {
          key: 'dues',
          label: 'Cuotas',
          sortable: false
        },
        {
          key: 'executive',
          label: 'Ejecutiva',
          sortable: false
        },
        {
          key: 'iva_percentage',
          label: 'Iva',
          sortable: false
        },
        {
          key: 'amount_dues',
          label: 'Monto Cuotas',
          sortable: false
        },
        {
          key: 'error',
          label: 'Error Carga',
          sortable: false
        }
      ]
    }
  },
  methods: {
    ActiveSetLoader () {
      this.PolizasEncontradas = []
      this.PolizasNoEncontradas = []
      this.PolizasYaCobranza = []
      this.StatusLoader = true
    },
    DesactiveSetLoader () {
      this.Statuscarga = 'leido'
      this.StatusLoader = false
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
    cancelLead () {
      this.$emit('cancel-lead')
    },
    async saveLead () {
      const { PolizasEncontradas } = this
      for (let i = 0; i < PolizasEncontradas.length; i++) {
        try {
          const dataSend = {
            product: PolizasEncontradas[i].productid,
            payment_type: PolizasEncontradas[i].payment_type,
            dues: PolizasEncontradas[i].dues,
            payment_date_start: PolizasEncontradas[i].payment_date_start,
            executive: PolizasEncontradas[i].executive,
            total_amount: PolizasEncontradas[i].prima,
            iva_percentage: PolizasEncontradas[i].iva_percentage,
            amount_dues: PolizasEncontradas[i].amount_dues
          }
          const { data } = await this.$simpleeApi.post(
            '/cobranza/collect_payment/',
            dataSend
          )
          this.CobrosSatisfactorios = this.CobrosSatisfactorios + 1
          console.log(data)
        } catch (error) {
          if (error.response) {
            if (error.response.data.non_field_errors) {
              this.PolizasYaCobranza.push({
                ...PolizasEncontradas[i],
                error: error.response.data.non_field_errors[0]
              })
            } else {
              this.PolizasYaCobranza.push({
                ...PolizasEncontradas[i],
                error: error.response.data[0]
              })
            }
          } else {
            this.PolizasYaCobranza.push({
              ...PolizasEncontradas[i],
              error: 'Error desconocido'
            })
          }
        }
        this.Statuscarga = 'finalizado'
        this.StatusInputMasivve = false
      }
      // this.$emit('save-lead')
    },
    ReverCarga () {
      this.CobrosSatisfactorios = 0
      this.StatusInputMasivve = true
      this.Statuscarga = 'sincargar'
      this.PolizasEncontradas = []
      this.PolizasNoEncontradas = []
      this.PolizasYaCobranza = []
    },
    async addCobranzas (register) {
      let params
      params = {
        nro_poliza: register.nro_poliza
      }
      try {
        const {
          data: { results, count }
        } = await this.$simpleeApi.get('/product/', {
          params: { ...params }
        })
        if (count > 0) {
          register.productid = results[0].id
          register.prima = results[0].prima
          this.PolizasEncontradas.push(register)
        } else {
          this.PolizasNoEncontradas.push(register)
        }
      } catch (error) {
        this.PolizasNoEncontradas.push(register)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
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
    color: rgba(211, 211, 211, 1);
    &.active {
      color: black;
    }
  }

  /* identical to box height */
  //

  color: #000000;
}
.padding-modal {
  padding: 0px 20px 40px 20px !important;
}
@media (min-width: 768px) {
  .padding-modal {
    padding: 0px 72px 40px 72px !important;
  }
}
.product-button {
  background: #ffffff;
  border: 1px solid #d3d3d3;
  box-sizing: border-box;
  border-radius: 5px;
}
.products,
.documents,
.diagnostic,
.tracking {
  div + div {
    margin-top: 1rem;
  }
}
.add {
  left: 1273px;
  top: 306px;
  border-color: transparent;
  font-style: normal;
  font-weight: normal;
  display: flex;
  color: white;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding: 3px;
  line-height: 21px;
  background: var(--primary);
  border-radius: 30px;
}
.comment-row {
  td,
  th {
    height: 200px;
  }
}
.mandatory {
  color: #233348;
}
.doc-title {
  padding: 0 0.75rem;
}
.draggable-modal {
  .modal-header {
    padding: 0;
    height: 4rem;
  }
}
.modal-body {
  padding-top: 0;
}
.max-size {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.3s ease;
  h5 {
    margin-left: 1rem;
    margin-bottom: 0;
  }
  p {
    opacity: 0;
    margin: 0 5.5rem 0 0;
    transition: opacity 0.3s ease;
  }
  &:hover {
    cursor: grab;
    background-color: rgb(247, 243, 243);
    p {
      opacity: 1;
    }
  }
}
</style>
