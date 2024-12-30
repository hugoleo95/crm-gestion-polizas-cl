<template>
  <div class="row g-4 margin-text">
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
</template>

<script>
import FormProducto from '@/components/productos/sura/FormProducto.vue'
export default {
  components: {
    FormProducto,
  },
}
</script>