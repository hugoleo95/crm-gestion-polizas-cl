<template>
    <div>
      <div
        v-if="option === 'list'"
        class="main-container"
      >
        <s-tool-bar
          ref="reftoolbar"
          class="toolbar"
          :onlyDate="true"
          quote
          :filter-by-user="false"
          search-input
          :current-filters="leadsFilters"
          @save-filters="setFilters"
          @resetFilters="setFilters"
          @search="searchConfig"
          @new-lead="newQuote"
        >
          <template #buttons>
            <download-informe-mudango class="mr-4" />
          </template>
        </s-tool-bar>
        <div class="d-flex mb-2 justify-content-end results">
          <span> {{ totalRows }} Resultados</span>
        </div>
        <div class="main">
          <div class="form-sections">
            <div class="table-responsive">
              <b-table
                id="table-principal"
                :items="Polizas"
                :fields="fields"
                responsive="lg"
                thead-class="newth"
                :busy="loadingLeads"
              >
                <template #table-busy>
                  <div class="d-flex h-100">
                    <div class="text-center text-primary pa-5 mx-auto h-100">
                      <b-spinner class="align-middle" />
                      <strong>Cargando...</strong>
                    </div>
                  </div>
                </template>
                <template #cell(nro_id_servicio)="{ value }">
                  {{ getNroIdService(value) }}
                </template>
                <template #cell(created_at)="{ value }">
                  {{ getLeadDate(value) }}
                </template>
                <template #cell(start_day)="{ value }">
                  {{ getDateF(value) }}
                </template>
                <template #cell(end_day)="{ value }">
                  {{ getDateF(value) }}
                </template>
                <template #cell(plan_cost)="{ value }">
                  {{ getCostoForm(value) }}
                </template>
                <template #cell(actions)="{ item }">
                  <div class="d-flex justify-content-center">
                    <button
                      v-b-tooltip.hover
                      class="circle mr-2 bg-white shadow-sm border p-3"
                      title="Ver Documento"
                      @click="openExistingQuote(item)"
                    >
                      <fa-icon
                        :icon="['fas', 'edit']"
                        class="text-primary"
                        style="font-size: 0.9rem"
                      />
                    </button>
                  </div>
                </template>
              </b-table>
              <div class="pages">
                <b-pagination
                  class="mb-0"
                  align="center"
                  :value="page"
                  :per-page="25"
                  :total-rows="totalRows"
                  pills
                  size="sm"
                  @change="ListMudango"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="option === 'view'">
        <Vista
          :quote="quote"
          @backlist="backlistdos"
          @UpdateQuote="openExistingQuotePrev(quote)"
        />
      </div>
      <b-modal
        ref="modal-alert"
        size="lg"
        centered
        hide-footer
        hide-header
        body-class="padding-modal"
        content-class="border-0 radius"
        >
            <div class="pt-5">
                <h3 class="text-base title-text">
                No tiene Documento Asociado
                </h3>
            </div>
            <div class="text-right">
                <b-button
                class="text-white shadow-dropdow btn-new ml-4"
                variant="primary"
                @click="closeModal"
                >
                ¡Entendido!
                </b-button>
            </div>
      </b-modal>
    </div>
  </template>
    <script>
  import { mapState, mapMutations } from "vuex";
  import Session from "@/mixins/auth";
  import SToolBar from "~/components/base/SToolBar.vue";
  import leadsStaticVars from "~/static/leadsStaticVars.json";
  import Vista from "@/components/partners/vistamudando.vue";
  import DownloadInformeMudango from '~/components/DownloadInformeMudango.vue'
  export default {
    components: {
      SToolBar,
      Vista,
      DownloadInformeMudango
    },
    mixins: [Session],
    data () {
      return {
        Polizas: {},
        page: 1,
        pages: 1,
        totalRows: 1,
        quote: {},
        fields: leadsStaticVars.tableFieldsMudangoPartners,
        option: "list",
        modalShow: false,
        Modal: {
          slider1: true,
          slider2: false,
        },
      };
    },
    computed: {
      ...mapState(["leadsFilters", "leadFromSocket"]),
      ...mapState("leads", ["users", "channels", "campanas", "loadingLeads"]),
      ...mapState("localStorage", ["user", "userPermissions"]),
      urlParams () {
        return {
          search: this.leadsFilters.search,
          user: this.$store.state.localStorage.user.id,
          start: this.leadsFilters.startDate,
          end: this.leadsFilters.endDate,
          nro_policy: this.leadsFilters.nro_policy,
          state: this.leadsFilters.state,
          type_proposal: this.leadsFilters.type_proposal,
          paid: this.leadsFilters.paid,
          user__isnull: true,
        };
      },
    },
    watch: {
      urlParams: {
        deep: true,
        handler () {
          if (!this.loadingLeads) {
            this.ListMudango(this.page);
          }
        },
      },
    },
    created () {
      const id = this.$route.query?.id;
      if (id) {
        this.GetQuoteWeb(id);
      }
      this.ListMudango();
    },
    methods: {
      ...mapMutations("leads", ["clearCsvInfo", "setLoadingLeads"]),
      ...mapMutations(["setFilters"]),
      closeModal () {
        this.$refs['modal-alert'].hide()
      },
      async ListMudango (page) {
        this.page = page;
        this.setLoadingLeads(true);
        const data = await this.$ListMudangoPartners(page, this.urlParams);
        const Response = data.results;
        this.totalRows = data.count;
        this.setLoadingLeads(false);
        this.Polizas = Response;
      },
      backlistdos () {
        const queries = {};
        this.$router.push({
          path: "/partners",
          query: queries,
        });
        this.option = 'list'
      },
      async GetQuoteWeb (id) {
        const data = await this.$GetGa(id);
        if (data) {
          this.openExistingQuote(data);
        } else {
          this.option = 'list'
        }
      },
      searchConfig (value) {
        this.leadsFilters.search = value;
      },
      getLeadUser (data) {
        const user = Number(data.user);
        if (user) {
          const leadUser = this.users.find(({ id }) => user === id);
          if (leadUser) {
            return leadUser.first_name || leadUser.email.split("@")[0];
          }
        }
        return "Sin asignar";
      },
      getLeadDate (leadDate) {
        const createdAt = new Date(leadDate).toLocaleString("en-GB");
        const [date, hour] = createdAt.split(",");
        return `${date}\n${hour}`;
      },
      getNroIdService (val) {
        if(val){
          return val
        }else {
          return 'No tiene';
        }
      },
      getDateF (Date) {
        const [year, month, day] = Date.split('-');
        return `${day}/${month}/${year}`;
      },
      openExistingQuotePrev () {
        location.reload();
      },
      getCostoForm(cost){
        if (!cost) return '0,00';
        return '$' + cost.toFixed(2).replace(/\d(?=(\d{3})+(?!\d))/g, '$&.').replace(/(\d+)\.(\d{2})$/, '$1,$2');
      },
    openExistingQuote (item) {
      /*if (item.document) {
        window.open(item.document.document, '_blank', 'noopener,noreferrer');
      } else {
        this.$refs['modal-alert'].show()
      }*/
      this.option = "view";
      this.quote = item;
      /*if (item?.id) {
        const newQuery = { id: item.id };
        this.updateLeadIdInQuery(newQuery);
      }*/
    },
    },
  };
    </script>
    <style scoped lang="scss">
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
    &.not_processed {
      background-color: #eb7e60;
    }
    &.failed {
      background-color: #7a082b;
    }
    &.canceled {
      background-color: #ea1051;
    }
    &.paid {
      background-color: #9dd345;
    }
    &.pending {
      background-color: #f07f28;
    }
    &.vacio {
      background-color: #7a082b;
    }
  }
  </style>
    