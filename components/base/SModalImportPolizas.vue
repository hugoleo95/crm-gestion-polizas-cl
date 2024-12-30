<!-- eslint-disable spaced-comment -->
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
      <template #modal-header="{}">
        <div class="max-size" @mousedown="dragModal">
          <h5>
            <fa-icon :icon="['fas', 'edit']" class="text-primary mr-2" /><b>Importar excel de Pólizas Caidas (No Pago)</b>
          </h5>
          <p>Manten presionado para arrastrar el modal</p>
        </div>
      </template>
      <template #modal-footer="{}">
        <b-button
          v-if="Statuscarga === 'leido'"
          class="text-white py-2 px-3 mr-2"
          size="sm"
          variant="primary"
          @click="savePolizas()"
        >
          Actualizar Pólizas
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
          <InputImportPolizasCaidas
            v-if="StatusInputMasivve"
            type="product"
            title="Arrastre el archivo excel"
            urldocument="/formatoPolizasNoPago.xlsx"
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
            style="width: 2.5rem; height: 2.5rem"
            variant="primary"
            center
          />
        </div>
        <div v-if="Statuscarga === 'leido'" class="w-100 mt-3">
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
        <div v-if="Statuscarga === 'finalizado'" class="w-100 mt-3">
          <span>Se registraron {{ CobrosSatisfactorios }} Polizas Modificadas a Cancelada No Pago</span>
        </div>
        <div v-if="Statuscarga === 'leido'" class="w-100 mt-3">
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
          v-if="Statuscarga === 'finalizado' && PolizasModificadaExito.length > 0"
          class="w-100 mt-3"
        >
          <span>-Modificaciones hicieron Correctamente:</span>
          <b-table
            :items="PolizasModificadaExito"
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
          v-if="Statuscarga === 'finalizado' && PolizasConAlgunError.length > 0"
          class="w-100 mt-3"
        >
          <span>-Modificaciones que no se hicieron por error:</span>
          <b-table
            :items="PolizasConAlgunError"
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
      </div>
    </b-modal>
  </div>
</template>

<script>
import InputImportPolizasCaidas from '@/components/InputImportPolizasCaidas.vue'
export default {
  components: {
    InputImportPolizasCaidas
  },
  data () {
    return {
      CobrosSatisfactorios: 0,
      StatusInputMasivve: true,
      localShow: true,
      Statuscarga: 'sincargar',
      PolizasEncontradas: [],
      PolizasNoEncontradas: [],
      PolizasConAlgunError: [],
      PolizasModificadaExito: []
    }
  },
  methods: {
    ActiveSetLoader () {
      this.PolizasEncontradas = []
      this.PolizasNoEncontradas = []
      this.PolizasModificadaExito = []
      this.PolizasConAlgunError = []
      this.StatusLoader = true
    },
    DesactiveSetLoader () {
      this.Statuscarga = 'leido'
      this.StatusLoader = false
    },
    cancelLead () {
      this.$emit('cancel-lead')
    },
    async savePolizas () {
      const { PolizasEncontradas } = this
      for (let i = 0; i < PolizasEncontradas.length; i++) {
        try {
          const dataProduct = await this.$simpleeApi.get(`/product/${PolizasEncontradas[i].productid}/`) // Obteniene la Poliza segun el ID
          dataProduct.data.state = 'canceled_nopay' // Modifica es estado de la poliza

          const { data } = await this.$simpleeApi.put(`/product/${dataProduct.data.id}/`, dataProduct.data)
          console.log(data)
          this.CobrosSatisfactorios = this.CobrosSatisfactorios + 1
          this.PolizasModificadaExito.push(PolizasEncontradas[i])
        } catch (error) {
          this.PolizasConAlgunError.push(PolizasEncontradas[i])
        }
        this.Statuscarga = 'finalizado'
        this.StatusInputMasivve = false
      }
    },
    ReverCarga () {
      this.CobrosSatisfactorios = 0
      this.StatusInputMasivve = true
      this.Statuscarga = 'sincargar'
      this.PolizasEncontradas = []
      this.PolizasNoEncontradas = []
      this.PolizasConAlgunError = []
      this.PolizasModificadaExito = []
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
    async addCobranzas (register) {
      const params = {
        nro_poliza: register.nro_poliza,
        product_type: 'poliza'
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
