<template>
  <s-form-table>
    <tr>
      <th>Nombre</th>
      <td>
        <b-form-input
          id="name"
          v-model="other.name"
          label="Nombre"
          type="text"
          placeholder="Agregar nombre del documento"
        />
      </td>
    </tr>
    <tr>
      <th>Documento</th>
      <td>
        <a
          v-if="other.document && other.name"
          target="_blank"
          :href="other.document"
        >{{ other.name }}</a>
        <b-form-file
          v-else
          :state="Boolean(other.document)"
          placeholder="Suba un archivo"
          drop-placeholder="Arrastre un archivo hasta aquí..."
          @input="setDocumentFile({file:$event})"
        />
      </td>
    </tr>
    <tr>
      <th>Fecha</th>
      <td>
        <b-input
          v-model="other.date"
          type="date"
          placeholder=""
        />
      </td>
    </tr>

    <tr>
      <th>Comentario</th>
      <td>
        <b-form-textarea
          v-model="other.comment"
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
          Eliminar otro
        </b-button>
      </td>
    </tr>
  </s-form-table>
</template>

<script>
import SFormTable from '@/components/base/SFormTable.vue'

export default {
  name: 'OtherForm',
  components: {
    SFormTable
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    showDelete: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    other: {
      get () { return this.value },
      set (value) { this.$emit('input', value) }
    }
  },
  created () {
    this.other.date = new Date().toISOString().split('T')[0]
  },
  methods: {
    setDocumentFile ({ file }) {
      const reader = new FileReader()
      reader.onload = () => {
        this.other.document64 = reader.result
      }
      reader.onerror = (error) => {
        this.$store.commit('setAlertMessage', { error: 'Hubo un error al cargar el archivo, por favor intentalo de nuevo.' })
        console.log({ error })
      }
      reader.readAsDataURL(file)
    }
  }

}
</script>

<style>
</style>
