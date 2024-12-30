<template>
  <s-form-table>
    <tr>
      <th>Nombre</th>
      <td>
        <b-form-input
          id="name"
          v-model="sinister.name"
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
          v-if="sinister.document && sinister.name"
          target="_blank"
          :href="sinister.document"
        >{{ sinister.name }}</a>
        <b-form-file
          v-else
          :state="Boolean(sinister.document)"
          placeholder="Suba un archivo"
          drop-placeholder="Arrastre un archivo hasta aquí..."
          @input="setDocumentFile({file:$event})"
        />
      </td>
    </tr>
    <tr>
      <th>Fecha de denuncia</th>
      <td>
        <b-input
          v-model="sinister.date"
          type="date"
          placeholder="Agregar fecha de denuncia del siniestro"
        />
      </td>
    </tr>
    <tr>
      <th>Fecha de liquidación</th>
      <td>
        <b-input
          v-model="sinister.settlement_date"
          type="date"
          placeholder="Agregar fecha de liquidación del siniestro"
        />
      </td>
    </tr>

    <tr>
      <th>Comentario</th>
      <td>
        <b-form-textarea
          v-model="sinister.comment"
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
          Eliminar siniestro
        </b-button>
      </td>
    </tr>
  </s-form-table>
</template>

<script>
import SFormTable from '@/components/base/SFormTable.vue'

export default {
  name: 'SinisterForm',
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
    sinister: {
      get () { return this.value },
      set (value) { this.$emit('input', value) }
    }
  },
  created () {
    this.sinister.date = new Date().toISOString().split('T')[0]
  },
  methods: {
    setDocumentFile ({ file }) {
      const reader = new FileReader()
      reader.onload = () => {
        this.sinister.document64 = reader.result
      }
      reader.onerror = (error) => {
        this.$store.commit('setAlertMessage', error.response.data)
        console.log({ error })
      }
      reader.readAsDataURL(file)
    }
  }

}
</script>
