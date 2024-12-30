<template>
  <div>
    <lead-modal
      v-if="modal"
      v-model="lead"
      :loading="loading"
      @hidde="onCloseModal"
      @save-lead="onSaveModal"
      @save-document-only="saveDocument"
      @cancel-lead="onCloseModal"
    />
    <div class="table-container">
      <s-tool-bar
        class="toolbar"
        search-field
        filter-by-channel
        filter-by-referral
        optionfilter="client"
        :current-filters="leadsFilters"
        @search="searchConfig"
        @set-rut="setRut"
        @new-lead="openExistingLead"
        @save-filters="setFilters"
        @resetFilters="setFilters"
      >
        <template #buttons>
          <download-csv
            :leads="leadsCsv"
            :loading="loadingCsv"
            :count="totalRows"
            crm
            :progress="leadsCsvProgress"
            @generate-csv="generateCsv"
            @clearCsvInfo="clearCsvInfo"
          />
        </template>
      </s-tool-bar>
      <span class="text-center text-aviso">Estos contactos son anteriores a la fecha (fecha subida ST 2.0)</span>
      <b-card
        no-body
        class="table"
      >
        <b-table
          sticky-header="100%"
          no-border-collapse
          responsive
          :per-page="25"
          :items="items"
          :fields="fields"
          :busy="loadingContacts"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
        >
          <template #table-busy>
            <div class="d-flex">
              <div class="text-center text-primary mx-auto">
                <b-spinner class="align-middle" />
                <strong>Cargando...</strong>
              </div>
            </div>
          </template>
          <template #cell(name)="{item}">
            {{ item.name }} {{ item.last_name }}
          </template>
          <template #cell(state)="{value}">
            <span :class="['btn-state',value.class]">
              <fa-icon
                :icon="['fas', value.icon]"
                class="mr-2"
              />{{ value.text }}
            </span>
          </template>
          <template #cell(email)="{value}">
            <a
              :href="`https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${value}`"
              target="_blank"
              :title="value"
            >{{ value.slice(0,15) }}...</a>
          </template>

          <!-- <template #cell(products)="{value}">
            <p>{{ value[value.length - 1].nro_poliza || '' }}</p>
          </template> -->
          <template #cell(last_emited_date)="{value}">
            <p>{{ getLeadDate(value) }}</p>
          </template>
          <template #cell(channel)="{value}">
            <p>{{ getLeadChannel(value) }}</p>
          </template>
          <template #cell(user_details)="{value}">
            <p>{{ value.first_name }}</p>
          </template>
          <template #cell(actions)="{item}">
            <div class="d-flex justify-content-center">
              <button
                class="circle mr-2 bg-white shadow-sm border p-3"
                @click="openExistingLead(item)"
              >
                <fa-icon
                  :icon="['fas', 'edit']"
                  class="text-primary"
                  style="font-size: .9rem"
                />
              </button>

              <button
                v-if="user.is_superuser || userPermissions.can_delete_lead"
                class="circle bg-white shadow-sm border p-3"
                @click="deleteLead(item)"
              >
                <fa-icon
                  :icon="['fas', 'trash-alt']"
                  class="text-danger"
                  style="font-size: .9rem"
                />
              </button>
            </div>
          </template>
        </b-table>
      </b-card>

      <div class="pages">
        <b-pagination
          class="mb-0"
          align="center"
          :value="page"
          :per-page="25"
          :total-rows="totalRows"
          pills
          size="sm"
          @change="getLeadspagition"
        />
      </div>
      <b-modal
        ref="modal-alert"
        hide-footer
        title="AVISO"
      >
        <div class="d-block text-center">
          <h5>EL REGISTRO DEL CLIENTE FUE GUARDADO EXITOSAMENTE</h5>
        </div>
        <b-button
          class="mt-3"
          variant="outline-success"
          block
          @click="getSavedLead"
        >
          Ir al cliente
        </b-button>
        <b-button
          class="mt-3"
          variant="outline-danger"
          block
          @click="CloseAlertModal"
        >
          Cerrar
        </b-button>
      </b-modal>
    </div>
  </div>
</template>

<script>
/* eslint-disable camelcase */
import { mapState, mapActions, mapMutations } from 'vuex'
import Session from '@/mixins/auth'
import SToolBar from '~/components/base/SToolBar.vue'
import leadModal from '~/components/leadModal.vue'
import DownloadCsv from '~/components/DownloadCsv.vue'
import compareTwoObjects from '~/helpers/compareTwoObjects.js'

export default {
  name: 'Contactos',
  components: {
    SToolBar,
    leadModal,
    DownloadCsv
  },
  mixins: [Session],
  data () {
    return {
      loading: false,
      page: 1,
      rut: null,
      search: null,
      searchrut: false,
      totalRows: 1,
      downloadPages: 1,
      items: [],
      lead: {},
      newLeadId: null,
      leadCopy: {},
      modal: false,
      sortBy: '',
      leadGeneralInfoCopy: null,
      leadProductsCopy: null,
      leadDocumentsCopy: null,
      sortDesc: false,
      fields: [
        {
          key: 'name',
          label: 'Nombre',
          sortable: true
        },
        {
          key: 'razon_social',
          label: 'Razon social',
          sortable: true
        },

        {
          key: 'email',
          label: 'Email',
          sortable: true
        },
        // {
        //   key: 'products',
        //   label: 'Último n° póliza'
        // },
        {
          key: 'last_emited_date',
          label: 'Última fecha emisión',
          sortable: true
        },
        {
          key: 'channel',
          label: 'Canal',
          sortable: true
        },
        {
          key: 'user_details',
          label: 'Ejecutiva/o',
          sortable: true
        },
        {
          key: 'actions',
          label: 'Acciones'
        }
      ]
    }
  },
  computed: {
    ...mapState('leads', ['users', 'refferals', 'channels', 'loadingCsv', 'leadsCsv', 'leadsCsvProgress', 'loadingContacts']),
    ...mapState('localStorage', ['user', 'userPermissions']),
    ...mapState(['leadsFilters']),
    sort () {
      const { sortBy, sortDesc } = this
      const field = sortBy === 'last_emited_date' ? 'date' : sortBy
      return sortDesc ? `-${field}` : field
    },
    urlParams () {
      return {
        sort_by: this.sort,
        search: this.leadsFilters.search,
        searchrut: this.searchrut,
        rut: this.rut,
        user: this.leadsFilters.id,
        start: this.leadsFilters.startDate,
        end: this.leadsFilters.endDate,
        referred: this.leadsFilters.refferal,
        channel: this.leadsFilters.channel
      }
    }
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler (queries) {
        this.getLeadById(queries)
      }
    },
    urlParams: {
      deep: true,
      handler () {
        this.getLeadContacts(this.page)
      }
    },
    'lead.products': {
      handler (value, oldValue) {
        if (!oldValue) {
          this.leadProductsCopy = [...value].map((prod) => { return { ...prod } })
        }
      }
    },
    'lead.documents': {
      handler (value, oldValue) {
        if (!oldValue) {
          this.leadDocumentsCopy = [...value].map((doc) => { return { ...doc } })
        }
      }
    }
  },
  beforeDestroy () {
    this.setLoadingContacts(false)
  },
  methods: {
    ...mapMutations(['setFilters']),
    ...mapMutations('leads', ['clearCsvInfo', 'setLoadingContacts']),
    ...mapActions('leads', ['getCsvLeads']),
    compareTwoObjects,
    getLeadDate (leadDate) {
      if (!leadDate) { return '' }
      const [year, month, day] = leadDate.split('-')
      return new Date(year, parseInt(month) - 1, day).toLocaleDateString('en-GB')
    },
    getLeadChannel (channel) {
      const channelObject = this.$store.state.leads.channels.find(({ id }) => id === channel)
      if (channelObject) { return channelObject.name }
      return 'Canal no creado'
    },
    getLeadUser (user) {
      if (user) {
        const { first_name, email } = this.$store.state.leads.users.find(({ id }) => user === id)
        return first_name || email.split('@')[0]
      }
      return 'Sin asignar'
    },
    getSavedLead () {
      this.CloseAlertModal()
      if (this.newLeadId) {
        const newQuery = { id: this.newLeadId }
        this.updateContactIdInQuery(newQuery)
      }
    },
    async getLeadById (queries) {
      if (queries.id) {
        try {
          const { data } = await this.$simpleeApi.get(`/lead/${queries.id}/`)
          this.openExistingLead(data)
        } catch (error) {
          this.$store.commit('setAlertMessage', error?.response?.data)
        }
      }
    },
    async getLeadspagition (page) {
      this.setLoadingContacts(true)
      try {
        const {
          data: { results, count }
        } = await this.$simpleeApi.get('/lead/?clientes', { params: { page, ...this.urlParams } })
        // const [, data] = await this.$getProducts({ page, ...this.urlParams })
        // this.totalRows = data.count

        this.totalRows = count
        this.page = page
        this.items = results.map((lead) => {
          const { rut, razon_social, person, email } = lead
          if ([rut, email].some(v => !v)) { return { _rowVariant: 'danger', ...lead } }
          if (person === 'legal_person' && !razon_social) { return { _rowVariant: 'danger', ...lead } }

          // if (lead.products.length === 0 || lead.documents.length === 0) { return { _rowVariant: 'danger', ...lead } }

          // const incompleteProducts = lead.products.reduce(
          //   (a, { emited_date, comision_final, nro_poliza, fecha_inicio_vigencia, fecha_termino_vigencia, line, name, company, prima, tipo_de_pago }) => {
          //     return [...a, emited_date, comision_final, nro_poliza, fecha_inicio_vigencia, fecha_termino_vigencia, line, name, company, prima, tipo_de_pago]
          //   }, []
          // )

          // if (incompleteProducts.some(v => !v)) { return { _rowVariant: 'danger', ...lead } }

          return lead
        })
      } catch (error) {
        this.$store.commit('setAlertMessage', error?.response?.data)
      }
      this.setLoadingContacts(false)
    },
    async getLeadContacts (page) {
      page = 1
      this.setLoadingContacts(true)
      try {
        const {
          data: { results, count }
        } = await this.$simpleeApi.get('/lead/?clientes', { params: { page, ...this.urlParams } })
        // const [, data] = await this.$getProducts({ page, ...this.urlParams })
        // this.totalRows = data.count

        this.totalRows = count
        this.page = page
        this.items = results.map((lead) => {
          const { rut, razon_social, person, email } = lead
          if ([rut, email].some(v => !v)) { return { _rowVariant: 'danger', ...lead } }
          if (person === 'legal_person' && !razon_social) { return { _rowVariant: 'danger', ...lead } }

          // if (lead.products.length === 0 || lead.documents.length === 0) { return { _rowVariant: 'danger', ...lead } }

          // const incompleteProducts = lead.products.reduce(
          //   (a, { emited_date, comision_final, nro_poliza, fecha_inicio_vigencia, fecha_termino_vigencia, line, name, company, prima, tipo_de_pago }) => {
          //     return [...a, emited_date, comision_final, nro_poliza, fecha_inicio_vigencia, fecha_termino_vigencia, line, name, company, prima, tipo_de_pago]
          //   }, []
          // )

          // if (incompleteProducts.some(v => !v)) { return { _rowVariant: 'danger', ...lead } }

          return lead
        })
      } catch (error) {
        this.$store.commit('setAlertMessage', error?.response?.data)
      }
      this.setLoadingContacts(false)
    },
    openExistingLead (lead = {}) {
      this.modal = true
      this.lead = {
        diagnostics: [{
          is_startup: false,
          has_own_office: false,
          light_vehicules: 0,
          heavy_vehicules: 0,
          workers: 0,
          has_mobile_equipment: false,
          transport_cargo: false,
          participate_in_tenders: false,
          insurances_contrated: []
        }],
        ...lead
      }
      this.leadCopy = { ...this.lead }
      this.leadGeneralInfoCopy = { ...lead }
      this.modal = true
      if (this.lead?.id) {
        const newQuery = this.lead.id
          ? { id: this.lead.id }
          : { id: null }
        this.updateContactIdInQuery(newQuery)
      }
    },
    async onSaveModal () {
      await this.saveLead({ lead: this.lead })
      await this.getLeadspagition(this.page)
      this.onCloseModal()
    },
    onCloseModal () {
      this.$router.replace({ query: null })
      this.leadGeneralInfoCopy = null
      this.leadProductsCopy = null
      this.leadDocumentsCopy = null
      this.modal = false
    },
    searchConfig (value) {
      if (this.searchrut) {
        this.search = ''
        this.rut = value
      } else {
        this.search = value
        this.rut = ''
      }
    },
    setRut (valid) {
      this.searchrut = valid
    },
    async saveLead ({ lead }) {
      lead.documents?.forEach((doc, i) => {
        if (!doc.title) {
          lead.documents?.splice(i, 1)
        }
      })

      lead.products?.forEach((product, i) => {
        if (Object.keys(product).length === 0) {
          lead.products?.splice(i, 1)
        }
      })

      lead.diagnostics?.forEach((diagnostic, i) => {
        if (Object.keys(diagnostic).length <= 1) {
          lead.diagnostics?.splice(i, 1)
        }
      })

      if (lead.id) {
        const { products, documents, ...leadGeneralInfo } = lead

        // Lead general info ---------------------------------------------------------------------------------------------------

        // check if general info has changed and needs to be updated
        if (!this.compareTwoObjects(leadGeneralInfo, this.leadGeneralInfoCopy)) {
          try {
            await this.$simpleeApi.put(`/lead/${lead.id}/`, lead)
          } catch (error) {
            this.$sendErrorPayload({
              payload: lead,
              origin: 'Leads',
              errorResponse: error.response,
              expectedBehavior: `Deberia actualizarse el lead con el id ${lead.id}`
            })
          }
        }

        // Lead products -------------------------------------------------------------------------------------------------------

        // check if there are products to update
        const prodsToUpdate = []
        products?.forEach((prod) => {
          if (prod.id) {
            const prodCopy = this.leadProductsCopy.find(d => d.id === prod.id)
            if (prodCopy) {
              if (!this.compareTwoObjects(prod, prodCopy)) {
                prodsToUpdate.push(prod)
              }
            }
          }
        })

        if (prodsToUpdate.length > 0) {
          prodsToUpdate.forEach(async (prod) => {
            try {
              await this.$simpleeApi.put(`/lead/${lead.id}/product/${prod.id}/`, prod)
            } catch (error) {
              this.$sendErrorPayload({
                payload: prod,
                origin: 'Leads',
                errorResponse: error.response,
                expectedBehavior: `Deberia actualizarse el producto ${prod.id} del lead ${lead.id}`
              })
            }
          })
        }

        // check if there are products to add or delete
        const prodsToAdd = products?.filter(d => !d.id) ?? []
        const prodsToEliminate = this.leadProductsCopy?.filter(d => !products?.find(doc => doc.id === d.id)) ?? []

        if (prodsToEliminate.length > 0) {
          prodsToEliminate.forEach(async (prod) => {
            try {
              await this.$simpleeApi.delete(`/lead/${lead.id}/product/${prod.id}/`)
            } catch (error) {
              this.$store.commit('setAlertMessage', error.response.data)
            }
          })
        }

        if (prodsToAdd.length > 0) {
          prodsToAdd.forEach(async (prod) => {
            try {
              await this.$simpleeApi.post(`/lead/${lead.id}/product/`, prod)
            } catch (error) {
              this.$sendErrorPayload({
                payload: prod,
                origin: 'Leads',
                errorResponse: error.response,
                expectedBehavior: `Deberia agregarse un nuevo producto al lead ${lead.id}`
              })
            }
          })
        }

        // Lead documents -------------------------------------------------------------------------------------------------------

        // check if there are docs to update
        const docsToUpdate = []
        documents?.forEach((doc) => {
          if (doc.id) {
            const docCopy = this.leadDocumentsCopy.find(d => d.id === doc.id)
            if (docCopy) {
              if (!this.compareTwoObjects(doc, docCopy)) {
                docsToUpdate.push(doc)
              }
            }
          }
        })

        if (docsToUpdate.length > 0) {
          docsToUpdate.forEach(async (doc) => {
            try {
              await this.$simpleeApi.put(`/lead/${lead.id}/document/${doc.id}/`, doc)
            } catch (error) {
              this.$sendErrorPayload({
                payload: doc,
                origin: 'Leads',
                errorResponse: error.response,
                expectedBehavior: `Deberia actualizarse el documento ${doc.id} del lead ${lead.id}`
              })
            }
          })
        }

        // check if there are docs to add or eliminate
        const docsToAdd = documents?.filter(d => !d.id) || []
        const docsToEliminate = this.leadDocumentsCopy?.filter(d => !documents?.find(doc => doc.id === d.id)) ?? []

        if (docsToEliminate.length > 0) {
          docsToEliminate.forEach(async (doc) => {
            await this.$simpleeApi.delete(`/lead/${lead.id}/document/${doc.id}/`)
          })
        }

        if (docsToAdd.length > 0) {
          docsToAdd.forEach(async (doc) => {
            try {
              await this.$simpleeApi.post(`/lead/${lead.id}/document/`, doc)
            } catch (error) {
              this.$sendErrorPayload({
                payload: doc,
                origin: 'Leads',
                errorResponse: error.response,
                expectedBehavior: `Deberia agregarse un nuevo documento al lead ${lead.id}`
              })
            }
          })
        }

        this.newLeadId = lead.id
      } else {
        let data

        try {
          const res = await this.$simpleeApi.post('/lead/', lead)
          data = res.data
        } catch (error) {
          this.$sendErrorPayload({
            payload: lead,
            origin: 'Leads',
            errorResponse: error.response,
            expectedBehavior: 'Deberia crearse un nuevo lead'
          })
        }

        if (data) {
          if (lead?.products?.length > 0) {
            lead.products.forEach(async (prod) => {
              try {
                await this.$simpleeApi.post(`/lead/${data.id}/product/`, prod)
              } catch (error) {
                this.$sendErrorPayload({
                  payload: prod,
                  origin: 'Leads',
                  errorResponse: error.response,
                  expectedBehavior: `Deberia crearse un nuevo producto para el nuevo lead ${lead.id}`
                })
              }
            })
          }

          if (lead?.documents?.length > 0) {
            lead.documents.forEach(async (doc) => {
              try {
                await this.$simpleeApi.post(`/lead/${data.id}/document/`, doc)
              } catch (error) {
                this.$sendErrorPayload({
                  payload: doc,
                  origin: 'Leads',
                  errorResponse: error.response,
                  expectedBehavior: `Deberia crearse un nuevo documento para el nuevo lead ${lead.id}`
                })
              }
            })
          }
        }

        this.newLeadId = data.id
      }

      if (this.newLeadId) {
        this.$refs['modal-alert'].show()
      }
    },
    deleteLead (lead) {
      this.$bvModal
        .msgBoxConfirm('¿Desea eleminar este lead?', {
          title: 'Confirmar',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'primary',
          okTitle: 'Si',
          cancelTitle: 'No',
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0',
          centered: true
        })
        .then((value) => {
          if (value) {
            this.$store.dispatch('leads/deleteLead', { lead })
          }
        })
    },
    async saveDocument ($event) {
      const lead = this.leadCopy
      try {
        await this.saveLead({ lead })
        await this.$generateDiagnosticPdf($event)
      } catch (error) {
        console.log(error)
        this.$store.commit('setAlertMessage', error?.response?.data)
      }
    },
    CloseAlertModal () {
      this.$refs['modal-alert'].hide()
    },
    generateCsv () {
      this.getCsvLeads({ urlParams: this.urlParams })
    },
    updateContactIdInQuery (query) {
      this.$router.push({ path: 'contactos', query })
    }
  }
}
</script>
<style lang="scss" scoped>
.btn-state {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px 20px;
  max-width: 150px;
  border-radius: 3px;
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  white-space: nowrap;
  color: #ffffff;
  svg {
    font-size: 10px;
  }
  &.informacion {
    background-color: #eb7e60;
  }
  &.sin-estado {
    background-color: #f8f8f8;
    color: black;
  }
  &.perdido {
    background-color: #ea1051;
  }
  &.resuelto {
    background-color: #9dd345;
  }
  &.confirmacion {
    background-color: #9dd345;
  }
  &.cerrado {
    background-color: var(--primary);
  }
  &.licitacion {
    background-color: #f07f28;
  }
}
</style>
<style lang="scss" scoped>
.table-container {
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: none;
  margin-bottom: 1.5em;
}

.table {
  height: calc(100vh - 14rem);
  background-color: #ffffff;
}

.pages {
  grid-row: 3;
  grid-column: 1 / span 2;
}
.circle {
  width: 25px;
  height: 25px;
  left: 1273px;
  top: 306px;
  border-color: transparent;
  font-style: normal;
  font-weight: normal;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  padding: 0px;
  line-height: 21px;
  background: var(--primary);
  border-radius: 30px;
  &.delete {
    background: #ea1051;
  }
}
.text-aviso {
  font-size: 18px;
  font-weight: 700;
  color: #eb7e60;
}
</style>
