<template>
  <div class="row g-4 margin-text">
    <div class="w-100" v-if="modo==='new'">
    <div class="d-flex justify-content-between">
      <nuxt-link :to="{ path: '/cotizador' }">
        <span
          class="text-base pointer"
        >
          <fa-icon
            :icon="['fas', 'arrow-left']"
            class="text-primary return"
          />
          <b>Regresar a los productos</b>
        </span>
      </nuxt-link>
    </div>
    <div class=" col-12 pl-0 mb-3 mt-2">
      <form-producto
        ref="componentnew"
      />
    </div>
    </div>
    <div class="w-100" v-else>
      <div>
        <Ga />
      </div>
    </div>
  </div>
</template>

<script>
import Session from '@/mixins/auth'
import FormProducto from '@/components/productos/sura/FormProducto.vue'
import Ga from '@/components/cotizador/ga/list.vue'
export default {
  components: {
    FormProducto,
    Ga
  },
  mixins: [Session],
  data () {
    return {
      modo: '',
    }
  },
  created () {
    const modo = this.$route.query?.modo
    if (modo) {
      this.modo = modo
    }
  }
}
</script>