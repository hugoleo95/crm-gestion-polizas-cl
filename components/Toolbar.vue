
<template>
  <div class="container">
    <div class="columns">
      <div class="column is-4">
        <label>Filtro
          <small>Escribe para filtrar</small>
        </label>
        <b-input
          v-model.lazy="localSearch"
          placeholder="Buscar por Nombre o rut"
        />
      </div>
      <div class="column is-4">
        <label>Filtrar por ejecutivo</label>
        <b-select v-model="localExecutive">
          <option
            v-for="user in users"
            :key="user.id"
            :value="user.email"
          >
            {{ user.email }}
          </option>
        </b-select>
      </div>
      <div class="column is-4">
        <label>Acciones</label>
        <br>
        <div class="is-flex prueba space-evenly">
          <b-button
            type="is-primary"
            @click="$emit('new-client')"
          >
            Nuevo cliente
          </b-button>

          <b-button
            type="is-primary-outline"
            @click="$emit('update-clients')"
          >
            Actualizar
          </b-button>

          <download-csv
            v-if="leadsCsv"
            :leads="leadsCsv"
            :loading="loadingCsv"
          />
        </div>
      </div>
    </div>
    <br>
  </div>
</template>

<script>
import DownloadCsv from '~/components/DownloadCsv.vue'

function debounce (fn, delay) {
  let timeoutID = null
  return function () {
    clearTimeout(timeoutID)
    const args = arguments
    const that = this
    timeoutID = setTimeout(function () {
      fn.apply(that, args)
    }, delay)
  }
}

export default {
  components: { DownloadCsv },
  props: {
    search: {
      type: String,
      required: true
    },
    executive: {
      type: String,
      required: true
    },
    users: {
      type: Array,
      required: true
    },
    leadsCsv: {
      type: Array,
      default: null
    },
    loadingCsv: {
      type: Boolean
    }
  },
  computed: {
    localSearch: {
      get () {
        return this.search
      },
      set (value) {
        this.$emit('update:search', value)
        this.updateDebounce()
      }

    },
    localExecutive: {
      get () {
        return this.executive
      },
      set (value) {
        this.$emit('update:executive', value)
      }
    }
  },
  created () {
    this.updateDebounce = debounce(() => { this.$emit('update-clients') }, 500)
  }
}
</script>

<style lang="scss">
.space-evenly {
  justify-content: space-evenly;
}
</style>
