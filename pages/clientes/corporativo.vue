<template>
  <div>
    <div class="div-group">
      <b-navbar-brand class="font-weight-bold d-flex align-items-start">
        <fa-icon
          :icon="['fas', 'briefcase']"
          style="height:29px"
          class="text-primary mr-2"
        />
        Clientes Corporativos
      </b-navbar-brand>
      <b-button
        class="text-white btn-corporativo ml-2"
        variant="info"
      >
        MedLaw
        <fa-icon
          :icon="['fas', 'caret-down']"
          class="text-white icon"
        />
      </b-button>
      <div class="ml-4">
        <p class="info">Rut: <b>78079136-K</b></p>
        <p class="info">Nombre de contacto: <b>Sebastián Méndez</b></p>
        <p class="info">Correo electrónico: <b>sebastian@simplee.cl</b></p>
        <p class="info">Tipo de producto contratado: <b>RC</b></p>
      </div>
    </div>
    <div>
      <div class="mt-4">
        <s-tool-bar
          class="toolbar"
          search-input
          optionfilter="client"
          ref="reftoolbar"
          defaults
          :current-filters="leadsFilters"
        >
          <template #buttons>
            <b-button
              class="btn-import shadow-dropdow px3"
              variant="light"
            >
              <fa-icon
                class="mx-2"
                :icon="['fas', 'upload']"
              />
              Importar
            </b-button>
          </template>
        </s-tool-bar>
      </div>
      <div class="table-responsive">
        <b-table
          id="table-principal"
          ref="clientTable"
          :fields="fields"
          :items="items"
          responsive="sm"
          thead-class="newth"
          select-mode="multi"
          selected-variant=""
        >
          <template #table-busy>
            <div class="d-flex h-100">
              <div class="text-center text-primary pa-5 mx-auto h-100">
                <b-spinner class="align-middle" />
                <strong>Cargando...</strong>
              </div>
            </div>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import Session from '@/mixins/auth'
import DownloadCsv from '~/components/DownloadCsv.vue'
import leadsStaticVars from '~/static/leadsStaticVars.json'
import SToolBar from '~/components/base/SToolBar.vue'
export default {
  name: 'Clientes',
  components: {
    SToolBar,
    DownloadCsv,
  },
  mixins: [Session],
  props: {
    show: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      fields: leadsStaticVars.tableFieldsCorporativo,
      version: process.env.version,
      items: [
        {
          poliza: 5555555555,
          compania: 'Sura',
          valid_since: '01/03/2023',
          validity_until: '01/03/2024',
          prima: 'UF 1000',
          comision: 'UF 100',
          name: 'Juan Pérez',
          rut: '00.000.000-0',
          profesion: 'Médico',
          especialidad: 'Oftamología',
          endoso: 'Aumento de cobertura',
        },
        {
          poliza: 5555555555,
          compania: 'Sura',
          valid_since: '01/03/2023',
          validity_until: '01/03/2024',
          prima: 'UF 1000',
          comision: 'UF 100',
          name: 'Reinaldo Soto',
          rut: '00.000.000-0',
          profesion: 'Médico',
          especialidad: 'Oftamología',
          endoso: 'Aumento de cobertura',
        },
        {
          poliza: 5555555555,
          compania: 'Sura',
          valid_since: '01/03/2023',
          validity_until: '01/03/2024',
          prima: 'UF 1000',
          comision: 'UF 100',
          name: 'Carla Quintanilla',
          rut: '00.000.000-0',
          profesion: 'Médico',
          especialidad: 'Oftamología',
          endoso: 'Aumento de cobertura',
        },
        {
          poliza: 5555555555,
          compania: 'Sura',
          valid_since: '01/03/2023',
          validity_until: '01/03/2024',
          prima: 'UF 1000',
          comision: 'UF 100',
          name: 'Rodolfo Acuña',
          rut: '00.000.000-0',
          profesion: 'Médico',
          especialidad: 'Oftamología',
          endoso: 'Aumento de cobertura',
        },
        {
          poliza: 5555555555,
          compania: 'Sura',
          valid_since: '01/03/2023',
          validity_until: '01/03/2024',
          prima: 'UF 1000',
          comision: 'UF 100',
          name: 'Fernanda Nuñez',
          rut: '00.000.000-0',
          profesion: 'Médico',
          especialidad: 'Oftamología',
          endoso: 'Aumento de cobertura',
        }
      ]
    }
  },
  computed: {
    ...mapState(['leadsFilters']),
    ...mapState('localStorage', ['user', 'userPermissions']),
  },
  methods: {
    ...mapMutations(['setFilters']),
  },
}
</script>
<style lang="scss" scoped>
.newth {
  border-bottom: 3px solid rgba(203, 203, 203, 0.31) !important;
  padding: 30px !important;
}
.toolbar {
  display: none;
  margin-bottom: 1.5em;
}
.text-blue {
  color: #0097A7;
}
.btn-corporativo {
  background-color: #0097A7;
  color: white;
  height: 40px;
}
.shadow-dropdow {
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}
.btn-import {
  font-size: 14px;
  color: #222222;
  font-weight: 500;
}
</style>

<style lang="scss">
.table thead th {
  border: none;
  padding: 15px;
  font-size: 14px;
  text-align: left;
  font-family: "Rubik";
  font-style: normal;
  font-weight: 500;
  line-height: 17px;
  color: #000000;
}
.table thead tr {
  background: #fff;
}
.table tbody tr {
  background: #fff;
}
.table tbody th,
.table tbody td {
  padding: 0.75rem;
  font-size: 14px;
  vertical-align: middle;
  text-align: left;
}
.table tbody td .close span {
  font-size: 12px;
  color: #dc3545;
}
.pl-4 {
  padding-left: 1.5rem;
}
.btn-coorporativo {
  background-color: #0097A7;
  color: white;
  height: 40px;
}
.text-blue {
  color: #0097A7;
}
.icon {
  margin-left: 90px;
}
.div-group {
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 15px;
}
.info {
  margin-bottom: 0px;
  font-size: 14px;
}
</style>
