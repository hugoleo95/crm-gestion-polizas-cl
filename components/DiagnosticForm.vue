<template>
  <div>
    <s-form-table>
      <tr>
        <th>Startup</th>
        <td>
          <b-form-checkbox
            v-model="localDiagnostic.is_startup"
            class="mx-2"
            type="checkbox"
          />
        </td>
      </tr>
      <tr>
        <th>Actividad</th>
        <td>
          <b-input
            v-model="localDiagnostic.activity"
            type="text"
            list="my-list-id"
          />

          <datalist id="my-list-id">
            <option
              v-for="option in options"
              :key="option"
            >
              {{ option }}
            </option>
          </datalist>
        </td>
      </tr>
      <tr>
        <th>Oficina Propia</th>
        <td>
          <b-form-checkbox
            v-model="localDiagnostic.is_startup"
            class="mx-2"
            type="checkbox"
          />
        </td>
      </tr>
      <tr>
        <th>Cantidad de vehículos livianos</th>
        <td>
          <b-input
            v-model.number="localDiagnostic.light_vehicules"
            type="number"
            placeholder="0"
          />
        </td>
      </tr>

      <tr>
        <th>Cantidad de vehículos pesados</th>
        <td>
          <b-input
            v-model.number="localDiagnostic.heavy_vehicules"
            type="number"
            placeholder="0"
          />
        </td>
      </tr>
      <tr>
        <th>Cantidad de trabajadores propios</th>
        <td>
          <b-input
            v-model.number="localDiagnostic.workers"
            type="number"
            placeholder="0"
          />
        </td>
      </tr>
      <tr>
        <th>Tiene equipo movíl</th>
        <td>
          <b-form-checkbox
            v-model="localDiagnostic.has_mobile_equipment"
            class="mx-2"
            type="checkbox"
          />
        </td>
      </tr>
      <tr>
        <th>Transporta carga</th>
        <td>
          <b-form-checkbox
            v-model="localDiagnostic.transport_cargo"
            class="mx-2"
            type="checkbox"
          />
        </td>
      </tr>
      <tr>
        <th>Participa en licitación</th>
        <td>
          <b-form-checkbox
            v-model="localDiagnostic.has_mobile_equipment"
            class="mx-2"
            type="checkbox"
          />
        </td>
      </tr>
      <tr v-if="localDiagnostic.document">
        <th>Documento</th>
        <td>
          <a
            :href="localDiagnostic.document"
            target="_blank"
            rel="noopener noreferrer"
          >enlace</a>
        </td>
      </tr>
      <tr class="table-row-container">
        <th class="flex items-center justify-center">
          Seguros contratados
        </th>
        <td
          :class="`select-btn ${ availableOptions.length === 0 && 'no-more-options'}`"
          @click="openSelect = !openSelect"
        >
          <span>
            {{ availableOptions.length === 0 ? 'Ya has seleccionado todos los seguros' : 'Selecciona los seguros contratados' }}
          </span>
          <img src="https://img.icons8.com/ios/50/000000/expand-arrow--v2.png">
        </td>
        <td
          v-if="openSelect"
          class="selection-container shadow-mb"
        >
          <div
            v-for="(insurance, ix) in availableOptions"
            :key="ix"
            class="w-full option-container"
          >
            <label class="text-black w-full">
              <input
                v-model="selected"
                :value="insurance.value"
                type="checkbox"
                class="form-checkbox"
              >{{ insurance.text }}</label>
          </div>
        </td>
      </tr>
      <tr
        v-for="(insurance, i) in localDiagnostic.insurances_contrated"
        :key="i"
      >
        <th>{{ insurances.find(ins => ins.value.insurance === insurance.insurance).text }}</th>
        <td class="inputs-container">
          <b-form-input
            v-model="localDiagnostic.insurances_contrated[localDiagnostic.insurances_contrated.indexOf(insurance)].amount"
            placeholder="ingresa monto en UF"
            type="text"
          />
          <b-form-checkbox
            v-model="selected"
            type="checkbox"
            :value="insurance"
            class="delete"
          />
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <b-button
            v-if="localDiagnostic.created_at"
            class="mt-2"
            variant="success"
            block
            @click="$emit('saveDocument', localDiagnostic.id)"
          >
            Generar documento
          </b-button>
          <b-button
            block
            @click="$emit('delete')"
          >
            Eliminar diagnostico
          </b-button>
        </td>
      </tr>
    </s-form-table>
    <div
      v-if="openSelect"
      class="transparent-bg"
      @click="openSelect = false"
    />
  </div>
</template>

<script>
import SFormTable from '@/components/base/SFormTable.vue'
import insurances from '@/static/insurances.json'

export default {
  name: 'DiagnosticForm',
  components: {
    SFormTable
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    commission: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      options: [
        'Gastronomía, restaurante, cafetería',
        'Construcción',
        'Transporte y almacenamiento',
        'Manufactura y fabricación',
        'Consultoría, asesoría y servicios',
        'Hotel y alojamiento',
        'Tecnología',
        'Almacén y minimarket'
      ],
      insurances,
      openSelect: false
    }
  },
  computed: {
    selected: {
      get () { return this.localDiagnostic.insurances_contrated },
      set (val) { this.localDiagnostic.insurances_contrated = val }
    },
    localDiagnostic: {
      get () { return this.value },
      set (local) { this.$emit('input', local) }
    },
    availableOptions () {
      if (!this.localDiagnostic.insurances_contrated) {
        return insurances
      } else {
        const arr = this.localDiagnostic.insurances_contrated.map(ins => ins.insurance)
        return insurances.filter(({ value }) => !arr.includes(value.insurance))
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.table-row-container
  position: relative
  .select-btn
    cursor: pointer
    font-weight: 400
    display: flex
    align-items: center
    justify-content: space-between
    height: 2.1rem
    padding: 0 1rem
    img
      width: 15px
      height: 15px
  .no-more-options
    pointer-events: none
    opacity: .5
  .selection-container
    z-index: 2
    background: #fff
    position: absolute
    border-radius: 10px
    top: 2rem
    right: 0
    width: 68.5%
    max-height: 10rem
    overflow-y: scroll
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px
    .option-container
      height: 2rem
      margin: 0
      width: 100%
      display: flex
      justify-content: center
      border-bottom: 1px solid #e2e2e2
      label
        width: 100%
        height: 100%
        display: flex
        align-items: center
        justify-content: center
        transition: background .3s ease
        &:hover
          cursor: pointer
          background: #e3e3e3

.inputs-container
  display: flex
  align-items: center
  justify-content: space-between
  padding: 0 1rem 0 0
  height: 100%
  .delete
    margin: 0 0 0 1rem
.form-checkbox
  display: none
.transparent-bg
  z-index: 1
  position: absolute
  top: 0
  bottom: -30%
  right: 0
  left: 0
</style>>
