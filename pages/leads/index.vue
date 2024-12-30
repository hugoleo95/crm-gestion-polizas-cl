<template>
  <div>
    <lead-modal
      v-if="modal"
      ref="modallead"
      v-model="lead"
      @hidde="onCloseModal"
      @save-lead="onSaveModal"
      @cancel-lead="onCloseModal"
    />
    <div class="table-container">
      <s-tool-bar
        class="toolbar"
        search-field
        :current-filters="leadsFilters"
        @search="searchConfig"
        @set-rut="setRut"
        @new-lead="openExistingLead"
        @save-filters="setFilters"
        @resetFilters="resetFilters"
      >
        <template #buttons>
          <download-csv
            :leads="leadsCsv"
            :loading="loadingCsv"
            :progress="leadsCsvProgress"
            :count="totalRows"
            filename="leads"
            crm
            @generate-csv="generateCsv"
            @clearCsvInfo="clearCsvInfo"
          />
        </template>
      </s-tool-bar>
      <span class="text-center text-aviso">Estos leads son anteriores a la subida del ST 2.0</span>
      <b-card
        no-body
        class="table"
      >
        <b-table
          sticky-header="100%"
          no-border-collapse
          responsive
          :items="items"
          :fields="fields"
          :busy="loadingLeads"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
        >
          <template #table-busy>
            <div class="d-flex h-100">
              <div class="text-center text-primary pa-5 mx-auto h-100">
                <b-spinner class="align-middle" />
                <strong>Cargando...</strong>
              </div>
            </div>
          </template>
          <template #cell(name)="{item}">
            {{ item.name }} {{ item.last_name }}
          </template>
          <template #cell(state)="{value}">
            <span :class="['btn-state', getLeadStatus(value).class]">
              <fa-icon
                :icon="['fas', getLeadStatus(value).icon]"
                class="mr-2"
              />{{ getLeadStatus(value).text }}
            </span>
          </template>
          <template #cell(email)="{value}">
            <a
              :href="`https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${value}`"
              target="_blank"
              :title="value"
            >{{ value.slice(0,15) }}...</a>
          </template>
          <template #cell(phone)="{value}">
            <a
              target="_blank"
              :href="`https://api.whatsapp.com/send?phone=${formatWhatsAppNumber(value)}`"
              :title="value"
            >{{ value }}</a>
          </template>
          <template #cell(created_at)="{value}">
            <p class="mb-0">
              {{ getLeadDate(value) }}
            </p>
          </template>
          <template #cell(channel)="{value}">
            <p class="mb-0">
              {{ getLeadChannel(value) }}
            </p>
          </template>
          <template #cell(priority)="{value}">
            <div
              v-if="value"
              :class="`circle ${value} mx-auto`"
              :title="value"
            >
              <fa-icon
                v-if="value"
                :icon="['fas', 'exclamation']"
                :title="value"
                class="text-white"
              />
            </div>
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
              <!-- <button
                class="circle mr-2 bg-white shadow-sm border p-3"
                @click="openExistingLeadInNewTab(item.id)"
              >
                <fa-icon
                  :icon="['fas', 'arrow-right']"
                  class="text-primary"
                  style="font-size: .9rem"
                />
              </button> -->
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
          <h5>EL REGISTRO DEL LEAD FUE GUARDADO EXITOSAMENTE</h5>
        </div>
        <b-button
          class="mt-3"
          variant="outline-success"
          block
          @click="getSavedLead"
        >
          Ir al lead
        </b-button>
        <b-button
          class="mt-3"
          variant="outline-danger"
          block
          @click="closeLeadAlertModal"
        >
          Cerrar
        </b-button>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import Session from '@/mixins/auth'
import SToolBar from '~/components/base/SToolBar.vue'
import leadModal from '~/components/leadModal.vue'
import DownloadCsv from '~/components/DownloadCsv.vue'
import leadsStaticVars from '~/static/leadsStaticVars.json'
import compareTwoObjects from '~/helpers/compareTwoObjects.js'

export default {
  name: 'Leads',
  components: {
    SToolBar,
    leadModal,
    DownloadCsv
  },
  mixins: [Session],
  data () {
    return {
      page: 1,
      pages: 1,
      totalRows: 1,
      rut: '',
      search: '',
      searchrut: false,
      sortBy: '',
      lead: {},
      leadGeneralInfoCopy: null,
      leadProductsCopy: null,
      leadDocumentsCopy: null,
      newLeadId: null,
      statesCopy: null,
      prioritiesCopy: null,
      fields: leadsStaticVars.tableFields,
      modal: false,
      sortDesc: false
    }
  },
  computed: {
    ...mapState(['leadsFilters', 'leadFromSocket']),
    ...mapState('leads', ['items', 'users', 'channels', 'leadsCsv', 'leadsCsvProgress', 'loadingCsv', 'loadingLeads']),
    ...mapState('localStorage', ['user', 'userPermissions']),
    sort () {
      const { sortBy, sortDesc } = this
      const field = sortBy === 'created_at' ? 'date' : sortBy
      return sortDesc ? `-${field}` : field
    },
    urlParams () {
      return {
        sort_by: this.sort,
        search: this.search,
        searchrut: this.searchrut,
        rut: this.rut,
        user: this.leadsFilters.id,
        states: this.leadsFilters.states,
        start: this.leadsFilters.startDate,
        end: this.leadsFilters.endDate,
        priorities: this.leadsFilters.priorities,
        referred: this.leadsFilters.refferal,
        channel: this.leadsFilters.channel
      }
    },
    thereAreNoFiltersApplied () {
      const { email, optionDate, refferal, channel, states, priorities } = this.leadsFilters
      const { modal, page, statesCopy, prioritiesCopy } = this

      const sameStates = statesCopy?.every(e => states.includes(e))
      const samePriorities = prioritiesCopy?.every(p => priorities.includes(p))

      return !modal &&
        page === 1 &&
        sameStates &&
        samePriorities &&
        email === 'General' &&
        optionDate === 'Año actual' &&
        !refferal &&
        !channel
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
        if (!this.loadingLeads) {
          this.getLeads(this.page)
        }
      }
    },
    leadFromSocket: {
      handler (newvalue, oldvalue) {
        if (newvalue !== oldvalue && this.thereAreNoFiltersApplied) {
          this.pushNewLead(newvalue)
        }
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
  created () {
    this.resetFilters(this.leadsFilters)

    /*setInterval(() => {
      if (this.thereAreNoFiltersApplied) {
        this.refreshLeads()
      }
    }, 300000)
    */
  },
  beforeDestroy () {
    this.setLoadingLeads(false)
  },
  methods: {
    ...mapMutations(['setFilters']),
    ...mapMutations('leads', ['clearCsvInfo', 'setLoadingLeads']),
    ...mapActions('leads', [
      'updateLeads',
      'deleteLead',
      'getCsvLeads'
    ]),
    compareTwoObjects,
    resetFilters (localFilters) {
      let filters = {
        ...localFilters,
        states: leadsStaticVars.statesKeys,
        priorities: leadsStaticVars.priorities
      }
      if (['sofia@simplee.cl', 'diego@simplee.cl'].includes(this.user.email)) {
        filters = {
          ...filters,
          states: [...localFilters.states, 'cliente_no_aplica']
        }
      }
      this.statesCopy = [...filters.states]
      this.prioritiesCopy = [...filters.priorities]
      this.setFilters(filters)
    },
    getLeadDate (leadDate) {
      const createdAt = new Date(leadDate).toLocaleString('en-GB')
      const [date, hour] = createdAt.split(',')
      return `${date}\n${hour}`
    },
    getLeadChannel (channel) {
      const channelObject = this.channels.find(({ id }) => id === channel)
      if (channelObject) { return channelObject.name }
      return 'Canal no creado'
    },
    getLeadStatus (state) {
      return state ? leadsStaticVars.detailedStates[state] : leadsStaticVars.detailedStates.sin_estado
    },
    getLeadUser (user) {
      if (user) {
        const leadUser = this.users.find(({ id }) => user === id)
        return leadUser.first_name || leadUser.email.split('@')[0]
      }
      return 'Sin asignar'
    },
    async getLeadspagition (page) {
      this.setLoadingLeads(true)
      try {
        const res = await this.$simpleeApi.get('/lead/', { params: { page, ...this.urlParams } })
        this.updateLeads({ payload: res.data.results, sort: true })
        this.totalRows = res.data.count
        this.page = page
        console.log(res)
      } catch (error) {
        this.$store.commit('setAlertMessage', error.response.data)
      }

      this.setLoadingLeads(false)
    },
    getSavedLead () {
      this.closeLeadAlertModal()
      if (this.newLeadId) {
        const newQuery = { id: this.newLeadId }
        this.updateLeadIdInQuery(newQuery)
      }
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
    async getLeadById (queries) {
      if (queries.id) {
        try {
          const { data } = await this.$simpleeApi.get(`/lead/${queries.id}/`)
          this.openExistingLead(data)
        } catch (error) {
          this.$store.commit('setAlertMessage', error.response.data)
        }
      }
    },
    async getLeads (page) {
      page = 1
      this.setLoadingLeads(true)
      try {
        const res = await this.$simpleeApi.get('/lead/', { params: { page, ...this.urlParams } })
        this.updateLeads({ payload: res.data.results, sort: true })
        this.totalRows = res.data.count
        this.page = page
        console.log(res)
      } catch (error) {
        this.$store.commit('setAlertMessage', error.response.data)
      }

      this.setLoadingLeads(false)
    },
    async refreshLeads () {
      console.log(`actualizando leads ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`)
      this.$store.commit('setReloading', true)
      await this.getLeads(1)
      this.$store.commit('setReloading', false)
    },
    async pushNewLead (id) {
      const { data } = await this.$simpleeApi.get(`/lead/${id}/`)
      const newItems = [{ _rowVariant: 'primary', ...data }, ...this.items]
      newItems.pop()
      const notificacionnew = this.items.find(key => key.id === id)
      if (!notificacionnew) {
        this.updateLeads({ payload: newItems, sort: true })
      }
    },
    openExistingLeadInNewTab: id => window.open(`${window.location.origin}/leads?id=${id}`, '_blank'),
    openExistingLead (lead) {
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
      this.leadGeneralInfoCopy = { ...lead }
      this.modal = true
      if (lead?.id) {
        const newQuery = { id: lead.id }
        this.updateLeadIdInQuery(newQuery)
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
      this.$bvModal.msgBoxConfirm('¿Desea eleminar este lead?', {
        title: 'Confirmar',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'primary',
        okTitle: 'Si',
        cancelTitle: 'No',
        headerClass: 'p-2 border-bottom-0',
        footerClass: 'p-2 border-top-0',
        centered: true
      }).then((value) => {
        if (value) {
          this.$store.dispatch('leads/deleteLead', { lead })
        }
      })
    },
    closeLeadAlertModal () {
      this.$refs['modal-alert'].hide()
    },
    generateCsv (pages) {
      this.getCsvLeads({ page: pages, urlParams: this.urlParams })
    },
    formatWhatsAppNumber (text) {
      const phone = text.replace(/ /g, '')
      return phone.replace('+', '')
    },
    updateLeadIdInQuery (query) {
      this.$router.push({ path: 'leads', query })
    }
  }
}
</script>
<style lang="scss">
.btn-state {
  display: flex;
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
  &.abandono {
    background-color: #7a082b;
  }
  &.perdido {
    background-color: #ea1051;
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
  &.llamar {
    background-color: #f88f04;
  }
  &.dg_contactado {
    background-color: #f07f28;
  }
  &.dg_sin_contactar {
    background-color: #ea1051;
  }
  &.error_de_pago {
    background-color: #6d6668;
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

  &.alta {
    background: #ea1051;
  }

  &.media {
    background-color: #f07f28;
  }

  &.baja {
    background: #9dd345;
  }
}
.text-aviso {
  font-size: 18px;
  font-weight: 700;
  color: #eb7e60;
}
</style>
