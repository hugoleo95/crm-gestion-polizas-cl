<template>
  <div>
    <div
      v-if="option === 'list'"
      class="main-container"
    >
      <s-tool-bar
        ref="reftoolbar"
        class="toolbar"
        quote
        new-btn
        filter-by-policy
        filter-by-state-r-c
        filter-by-state-paid-r-c
        filter-by-proporsal-r-c
        search-input
        :current-filters="leadsFilters"
        @save-filters="setFilters"
        @resetFilters="setFilters"
        @search="searchConfig"
        @new-lead="newQuote"
      />
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
              responsive="sm"
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
              <template #cell(persons)="{ value }">
                {{ getName(value) }}
              </template>
              <template #cell(general_data)="{ value }">
                {{ GetPlan(value) }}
              </template>
              <template #cell(nro_policy)="{ value }">
                {{ GetPolice(value) }}
              </template>
              <template #cell(payment_plan)="{ value }">
                {{ GetPagado(value) }}
              </template>
              <template #cell(type_proposal)="{ value }">
                <span :class="['btn-state', getRCStatus(value).class]">
                  <fa-icon
                    :icon="['fas', getRCStatus(value).icon]"
                    class="mr-2"
                  />{{ getRCStatus(value).text }}
                </span>
              </template>
              <template #cell(state)="{ value }">
                <span :class="['btn-state', getRCStatus(value).class]">
                  <fa-icon
                    :icon="['fas', getRCStatus(value).icon]"
                    class="mr-2"
                  />{{ getRCStatus(value).text }}
                </span>
              </template>
              <template #cell(created_at)="{ value }">
                {{ getLeadDate(value) }}
              </template>
              <template #cell(metadata)="{ value }">
                {{ getLeadUser(value) }}
              </template>
              <template #cell(actions)="{ item }">
                <div class="d-flex justify-content-center">
                  <button
                    v-b-tooltip.hover
                    class="circle mr-2 bg-white shadow-sm border p-3"
                    title="Información de la solicitud"
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
                @change="ListPolizas"
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
      />
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import Session from "@/mixins/auth";
import SToolBar from "~/components/base/SToolBar.vue";
import leadsStaticVars from "~/static/leadsStaticVars.json";
import Vista from "@/components/cotizador/rc/view.vue";
export default {
  components: {
    SToolBar,
    Vista,
  },
  mixins: [Session],
  data () {
    return {
      Polizas: {},
      page: 1,
      pages: 1,
      totalRows: 1,
      quote: {},
      fields: leadsStaticVars.tableFieldsRC,
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
        user: this.leadsFilters.id,
        start: this.leadsFilters.startDate,
        end: this.leadsFilters.endDate,
        nro_policy: this.leadsFilters.nro_policy,
        state: this.leadsFilters.state,
        type_proposal: this.leadsFilters.type_proposal,
        paid: this.leadsFilters.paid,
      };
    },
  },
  watch: {
    urlParams: {
      deep: true,
      handler () {
        if (!this.loadingLeads) {
          this.ListPolizas(this.page);
        }
      },
    },
  },
  created () {
    const id = this.$route.query?.id;
    if (id) {
      this.GetQuoteWeb(id);
    }
    this.ListPolizas();
    if (this.$store.state.localStorage.alertalks) {
      this.modalShow = true;
      this.$store.commit("localStorage/AlertTalks");
    }
  },
  methods: {
    ...mapMutations("leads", ["clearCsvInfo", "setLoadingLeads"]),
    ...mapMutations(["setFilters"]),
    async ListPolizas (page) {
      this.page = page;
      this.setLoadingLeads(true);
      const data = await this.$ListPolizas(page, this.urlParams);
      const Response = data.results;
      console.log(Response);
      this.totalRows = data.count;
      for (let i = 0; i < Response.length; i++) {
        if (Response[i].is_old === true) {
          Response[i]._rowVariant = "danger";
        }
        /* if (Response[i].metadata.user) {
          const user = Response[i].metadata.user
          console.log(user)
          const [leadUser] = this.users.filter(({ id }) => id === user)
          if (leadUser) {
            Response[i].user = leadUser.first_name || leadUser.email.split('@')[0]
          } else {
            Response[i].user = 'Sin asignar'
          }
        } else {
          Response[i].user = 'Sin asignar'
        }
        */
      }
      this.setLoadingLeads(false);
      this.Polizas = Response;
    },
    async GetQuoteWeb (id) {
      const data = await this.$GetRc(id);
      if (data) {
        this.openExistingQuote(data);
      } else {
        this.option = 'list'
      }
    },
    searchConfig (value) {
      console.log(value);
      this.leadsFilters.search = value;
    },
    getLeadUser (data) {
      console.log(data.user);
      const user = Number(data.user);
      if (user) {
        const leadUser = this.users.find(({ id }) => user === id);
        if (leadUser) {
          return leadUser.first_name || leadUser.email.split("@")[0];
        }
      }
      return "Sin asignar";
    },
    backlistdos () {
      const queries = {};
      this.$router.push({
        path: "/cotizador",
        query: queries,
      });
      this.option = 'list'
    },
    getLeadDate (leadDate) {
      const createdAt = new Date(leadDate).toLocaleString("en-GB");
      const [date, hour] = createdAt.split(",");
      return `${date}\n${hour}`;
    },
    openExistingQuote (item) {
      this.option = "view";
      console.log(item);
      this.quote = item;
      if (item?.id) {
        const newQuery = { id: item.id };
        this.updateLeadIdInQuery(newQuery);
      }
    },
    updateLeadIdInQuery (query) {
      query.type = "rc";
      this.$router.push({ path: "cotizador", query });
    },
    newQuote () {
      // this.$emit('newquote')
      const urlEnv = process.env.apiUrl
      if (urlEnv === 'https://api.dev.simplee.cl/api') {
        const url =
          "https://simplee-web.dev.simplee.cl/cotizar_st/seguros/rc?step=1&user=" +
          this.$store.state.localStorage.user.id +
          "&user_name=" +
          this.$store.state.localStorage.user.first_name;
        window.location = url;
      } else {
        const url =
          "http://simplee.cl/cotizar_st/seguros/rc?step=1&user=" +
          this.$store.state.localStorage.user.id +
          "&user_name=" +
          this.$store.state.localStorage.user.first_name;
        window.location = url;
      }
    },
    GetProposal (value) {
      if (!value) {
        return "No tiene";
      } else {
        return value;
      }
    },
    getName (data) {
      const persons = data;
      for (let i = 0; i < persons.length; i++) {
        if (persons[i].role === "proponente") {
          return persons[i].name + " " + persons[i].last_name;
        }
      }
    },
    GetPlan (data) {
      if (data.technical_plan === 7746) {
        return "RC de Empresas";
      } else if (data.technical_plan === 7747) {
        return "RC de Construcción";
      } else {
        return "RC para MOP";
      }
    },
    GetPolice (value) {
      if (!value) {
        return "No tiene";
      } else {
        return value;
      }
    },
    GetPagado (value) {
      if (!value.paid) {
        return "No";
      } else {
        return "Si";
      }
    },
    GetConciliado (value) {
      if (!value) {
        return "No";
      } else {
        return "Si";
      }
    },
    getRCStatus (state) {
      return state
        ? leadsStaticVars.detailedStatesRC[state]
        : leadsStaticVars.detailedStatesRC.sin_estado;
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
  &.quote {
    background-color: #7a082b;
  }
  &.cancelled {
    background-color: #ea1051;
  }
  &.processed {
    background-color: #9dd345;
  }
  &.proposal {
    background-color: #f07f28;
  }
}
</style>
