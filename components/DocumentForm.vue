<template>
  <div>
    <s-form-table>
      <!--
        <tr>
        <th>Nombre </th>
        <td>
          <b-form-input
            v-model="document.title"
            label="Nombre"
            type="text"
            placeholder="Agregar nombre del documento"
          />
        </td>
      </tr>
       -->
      <tr>
        <th>Documento</th>
        <td>
          <a
            v-if="document.document_url"
            class="link"
            target="_blank"
            :href="document.document_url"
          >{{ document.title }}</a>
          <a
            v-else-if="document.document"
            class="link"
            target="_blank"
            :href="document.document"
          >{{ document.title }}</a>
          <b-form-file
            v-else
            :state="Boolean(document.document)"
            placeholder="Suba un archivo"
            drop-placeholder="Arrastre un archivo hasta aquí..."
            @input="setDocumentFile({file:$event})"
          />
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <b-button
            block
            @click="$emit('delete')"
          >
            Eliminar documento
          </b-button>
        </td>
      </tr>
    </s-form-table>
  </div>
</template>

<script>
import SFormTable from '@/components/base/SFormTable.vue'

export default {
  name: 'DocumentForm',
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
    document: {
      get () { return this.value },
      set (value) { this.$emit('input', value) }
    }
  },
  methods: {
    setDocumentFile ({ file }) {
      this.document.title = file.name
      const reader = new FileReader()
      reader.onload = () => {
        this.document.document64 = reader.result
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

<style lang="scss" scoped>
.link {
  padding-left: 0.75rem;
}
</style>
