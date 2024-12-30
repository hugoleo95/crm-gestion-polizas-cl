
<template>
  <b-table
    ref="table"
    :data="localLeads"
    :paginated="false"
    :loading="loading"
    aria-next-label="Next page"
    aria-previous-label="Previous page"
    aria-page-label="Page"
    aria-current-label="Current page"
    class="over-x"
  >
    <template slot-scope="{row}">
      <b-table-column
        field="comments"
        label="Comentarios"
      >
        <p :title="row.comment">
          {{ row.comment | shortText(20) }}
        </p>
      </b-table-column>
      <b-table-column
        field="razon_social"
        label="Razon social"
      >
        {{ row.razon_social }}
      </b-table-column>
      <b-table-column
        field="name"
        label="Nombre"
      >
        {{ row.name }} {{ row.last_name }}
      </b-table-column>
      <b-table-column
        field="email"
        label="Email"
      >
        {{ row.email }}
      </b-table-column>

      <b-table-column label="Telefono">
        {{ row.phone }}
      </b-table-column>
      <b-table-column
        field="created_at"
        label="Fecha de contacto"
        centered
      >
        <span class="tag is-success">{{ new Date(row.created_at).toLocaleString("en-GB") }}</span>
      </b-table-column>
      <b-table-column
        label="Canal"
        field="channel_id"
        sortable
      >
        <span>{{ row.channel }}</span>
      </b-table-column>
      <b-table-column
        field="user.email"
        label="Ejecutiva/o"
      >
        {{ row.user ? row.user.email : 'Sin asignar' }}
      </b-table-column>
      <b-table-column
        label="Estado"
        field="state"
        sortable
      >
        <span
          :class="['tag',row.state.class]"
        >{{ row.state.text }}</span>
      </b-table-column>
      <b-table-column
        label="Acciones"
        centered
      >
        <b-button
          class="is-primary"
          @click="$emit('click-edit-button',row.id)"
        >
          Ver detalle
        </b-button>
        <b-button
          v-if="$store.state.localStorage.user.role == 'admin'"
          class="is-danger"
          @click="$emit('click-delete-button',row.id)"
        >
          Eliminar
        </b-button>
      </b-table-column>
    </template>
  </b-table>
</template>

<script>
export default {
  props: {
    leads: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    localLeads () {
      if (this.leads.length < 1) { return [] }
      const channels = {
        1: 'Formulario sitio web',
        2: 'Julieta Chatbot',
        3: 'Número en header sitio web',
        4: 'Flujo de compra RC',
        5: 'Directo',
        6: 'Referido',
        7: 'Landing SeguroGarantia.cl',
        8: 'Mercado publico'
      }
      const states = {
        perdido: { class: 'is-danger', text: 'Perdido' },
        cliente_no_aplica: { class: 'is-danger', text: 'Cliente no aplica' },
        en_espera_de_informacion_cliente: { class: 'is-warning', text: 'Espera de informacion' },
        en_espera_de_precio: { class: 'is-warning', text: 'Espera de precio' },
        en_espera_de_confirmacion: { class: 'is-warning', text: 'Espera de confirmación' },
        en_licitacion: { class: 'is-warning', text: 'En licitacion' },
        sin_contactar: { class: 'is-warning', text: 'Sin contactar' },
        contactado: { class: 'is-warning', text: 'Contactado' },
        cliente_cerrado: { class: 'is-success', text: 'Cliente cerrado' }
      }
      // eslint-disable-next-line camelcase
      return this.leads.map((lead) => {
        const channel = lead.channel_id ? channels[lead.channel_id] : 'Canal no definido aún'
        const state = lead.state ? states[lead.state] : { class: '', text: 'Sin estado' }
        return { ...lead, channel, state }
      })
    }
  }
}
</script>
