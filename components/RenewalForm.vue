<template>
  <s-form-table id="renewalForm">
    <!--<tr>
      <th>N de renovación</th>
      <td>
        <b-input
          v-model="renewal.renewal_nro"
          type="number"
          placeholder="Agregue el número de renovación"
        />
      </td>
    </tr>
    -->
    <tr>
      <th>N de póliza renovada</th>
      <td>
        <b-input
          v-model="renewal.new_police_nro"
          type="text"
          placeholder="Agregue el número de póliza"
        />
      </td>
    </tr>
    <tr>
      <th>Nombre</th>
      <td>
        <b-form-input
          id="name"
          v-model="renewal.name"
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
          v-if="renewal.document && renewal.name"
          class="link"
          target="_blank"
          :href="renewal.document"
        >{{ `${renewal.name} (Documento)` }}</a>
        <b-form-file
          v-else
          :state="Boolean(renewal.document)"
          placeholder="Suba un archivo"
          drop-placeholder="Arrastre un archivo hasta aquí..."
          @input="setDocumentFile({file:$event})"
        />
      </td>
    </tr>
    <tr>
      <th>Fecha de creación</th>
      <td>
        <b-input
          v-model="renewal.date"
          type="date"
          placeholder=""
        />
      </td>
    </tr>
    <tr>
      <th>Inicio de vigencia</th>
      <td>
        <b-input
          v-model="renewal.start_vigency"
          class="validate"
          type="date"
          required
        />
      </td>
    </tr>
    <tr>
      <th>Término de vigencia</th>
      <td>
        <b-input
          v-model="renewal.end_vigency"
          class="validate"
          type="date"
          required
        />
      </td>
    </tr>
    <tr>
      <th>Prima</th>
      <td>
        <b-input
          v-model="renewal.prima"
          type="number"
          placeholder="Agregue la prima"
        />
      </td>
    </tr>
    <tr>
      <th>Comisión</th>
      <td>
        <b-input
          v-model="renewal.comision"
          type="number"
          placeholder="Agregue la comisión"
        />
      </td>
    </tr>
    <!-- <tr>
      <th>N póliza nuevo</th>
      <td>
        <b-input
          v-model="renewal.new_police_nro"
          type="number"
          placeholder="Agregue el número nuevo"
        />
      </td>
    </tr> -->
    <tr>
      <th>Comentario</th>
      <td>
        <b-form-textarea
          v-model="renewal.comment"
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
          Eliminar renovación
        </b-button>
      </td>
    </tr>
  </s-form-table>
</template>

<script>
import SFormTable from '@/components/base/SFormTable.vue'

export default {
  name: 'RenewalForm',
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
    },
    hasErrors: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      renewal: {
        name: null,
        comision: null,
        comment: null,
        date: null,
        end_vigency: null,
        new_police_nro: '3013114',
        prima: 0,
        renewal_nro: 3013114,
        start_vigency: null
      }
    }
  },
  watch: {
    hasErrors: {
      immediate: true,
      handler (val) {
        if (val) {
          setTimeout(() => {
            const inputs = document.querySelectorAll('.validate')
            inputs?.forEach(e => e.classList.add('inputError'))
          }, 50)
        }
      }
    },
    renewal: {
      deep: true,
      handler (value) {
        this.$emit('input', value)
        if (this.hasErrors) {
          const inputs = document.querySelectorAll('.inputError')
          inputs?.forEach((i) => {
            if (i.value) {
              i.classList.remove('inputError')
            }
          })
          if (inputs.length === 0) {
            this.$emit('errorsResolved', value.id)
          }
        }
      }
    }
  },
  created () {
    this.renewal = Object.assign({}, this.value)
    this.renewal.date = new Date().toISOString().split('T')[0]
  },
  methods: {
    setDocumentFile ({ file }) {
      const reader = new FileReader()
      reader.onload = () => {
        this.renewal.document64 = reader.result
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
  margin-left: 0.75rem;
  color: #61d4ae;
  text-decoration: underline;
}
.inputError {
  border: 1px solid red;
}
</style>
