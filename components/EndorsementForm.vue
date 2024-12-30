<template>
  <s-form-table>
    <tr>
      <th>Nombre</th>
      <td colspan="2">
        <b-form-input
          id="name"
          v-model="endorsement.name"
          label="Nombre"
          type="text"
          placeholder="Agregar nombre del documento"
        />
      </td>
    </tr>
    <tr>
      <th>Documento</th>
      <td colspan="2">
        <a
          v-if="endorsement.document && endorsement.name"
          target="_blank"
          :href="endorsement.document"
        >{{ endorsement.name }}</a>
        <b-form-file
          v-else
          :state="Boolean(endorsement.document)"
          placeholder="Suba un archivo"
          drop-placeholder="Arrastre un archivo hasta aquí..."
          @input="setDocumentFile({file:$event})"
        />
      </td>
    </tr>
    <tr>
      <th>Fecha</th>
      <td colspan="2">
        <b-input
          v-model="endorsement.date"
          type="date"
          placeholder=""
        />
      </td>
    </tr>
    <tr>
      <th>N endoso</th>
      <td colspan="2">
        <b-input
          v-model="endorsement.endorsement_nro"
          type="number"
          placeholder="Agregue el número del endoso"
        />
      </td>
    </tr>
    <tr>
      <th>Tipo de endoso</th>
      <td colspan="2">
        <b-form-select
          v-model="endorsement.endorsement_type"
          @change="EndosoPrima({option:$event})"
        >
          <b-form-select-option value="endorsement_prima">
            Endoso de prima
          </b-form-select-option>
          <b-form-select-option value="endorsement_other">
            Otro
          </b-form-select-option>
        </b-form-select>
      </td>
    </tr>
    <tr v-if="endprima">
      <th>Prima y comisión</th>
      <td>
        <b-input
          v-model="endorsement.prima"
          type="number"
          placeholder="Agrega nueva prima UF 20"
        />
      </td>
      <td>
        <b-input
          v-model="endorsement.comision"
          type="number"
          placeholder="Agrega comisión UF 1.3"
        />
      </td>
    </tr>
    <tr>
      <th>Comentario</th>
      <td colspan="2">
        <b-form-textarea
          v-model="endorsement.comment"
          placeholder=""
          rows="2"
          max-rows="10"
        />
      </td>
    </tr>
    <tr v-if="showDelete">
      <td colspan="2">
        <b-button
          block
          @click="$emit('delete')"
        >
          Eliminar endoso
        </b-button>
      </td>
    </tr>
  </s-form-table>
</template>

<script>
import SFormTable from '@/components/base/SFormTable.vue'

export default {
  name: 'EndorsementForm',
  components: {
    SFormTable
  },
  props: {
    value: {
      type: Object,
      required: true,
      default: () => ({
        endorsement: [{ endorsement_nro: 0 }]
      })
    },
    showDelete: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      endprima: false
    }
  },
  computed: {
    endorsement: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  created () {
    if (!this.endorsement.prima) {
      this.endorsement.prima = 0
    }
    if (!this.endorsement.comision) {
      this.endorsement.comision = 0
    }
    if (!this.endorsement.endorsement_type || this.endorsement.endorsement_type === 'endorsement_other') {
      this.endorsement.endorsement_type = 'endorsement_other'
      this.endprima = false
    } else {
      this.endprima = true
    }
  },
  methods: {
    setDocumentFile ({ file }) {
      const reader = new FileReader()
      reader.onload = () => {
        this.endorsement.document64 = reader.result
      }
      reader.onerror = (error) => {
        this.$store.commit('setAlertMessage', { error: 'Hubo un error al cargar el archivo, por favor intentalo de nuevo.' })
        console.log({ error })
      }
      reader.readAsDataURL(file)
    },
    EndosoPrima ({ option }) {
      this.endorsement.endorsement_type = option
      if (option === 'endorsement_prima') {
        this.endprima = true
      } else {
        this.endprima = false
      }
    }
  }

}
</script>

<style>
</style>
