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
        :filter-by-user="false"
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
      <div class="d-flex justify-content-between mb-3">
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
              <template #cell(additional_data)="{ value }">
                {{ GetPolice(value) }}
              </template>
              <template #cell(tipo_ga)="{ value }">
                {{ GetType(value) }}
              </template>
              <template #cell(payment_state)="{ value }">
                <span
                  v-if="value"
                  :class="['btn-state', getGAStatus(value).class]"
                >
                  <fa-icon
                    :icon="['fas', getGAStatus(value).icon]"
                    class="mr-2"
                  />{{ getGAStatus(value).text }}
                </span>
                <span
                  v-else
                  :class="['btn-state', 'vacio']"
                >
                  <fa-icon
                    :icon="['fas', 'circle']"
                    class="mr-2"
                  />Sin pago
                </span>
              </template>
              <template #cell(status_renta)="{ value }">
                {{ GetStatusRenta(value) }}
              </template>
              <template #cell(created_at)="{ value }">
                {{ getLeadDate(value) }}
              </template>
              <template #cell(user_details)="{ value }">
                {{ getLeadUser2(value) }}
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
                @change="ListPolizasGa"
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
  </div>
</template>
  <script>
import { mapState, mapMutations } from "vuex";
import Session from "@/mixins/auth";
import SToolBar from "~/components/base/SToolBar.vue";
import leadsStaticVars from "~/static/leadsStaticVars.json";
import Vista from "@/components/cotizador/ga/view.vue";
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
      fields: leadsStaticVars.tableFieldsGA,
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
          this.ListPolizasGa(this.page);
        }
      },
    },
  },
  created () {
    const id = this.$route.query?.id;
    if (id) {
      this.GetQuoteWeb(id);
    }
    this.ListPolizasGa();
  },
  methods: {
    ...mapMutations("leads", ["clearCsvInfo", "setLoadingLeads"]),
    ...mapMutations(["setFilters"]),
    async ListPolizasGa (page) {
      this.page = page;
      this.setLoadingLeads(true);
      const data = await this.$ListPolizasGa(page, this.urlParams);
      const Response = data.results;
      console.log(Response);
      this.totalRows = data.count;
      for (let i = 0; i < Response.length; i++) {
        /* if (Response[i].metadata.user) {
          const user = Response[i].metadata.user
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
    backlistdos () {
      const queries = {
        modo: "list",
      };
      this.$router.push({
        path: "/cotizador/garantia/sura",
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
      console.log(value);
      this.leadsFilters.search = value;
    },
    getLeadUser2 (data) {
      if (data) {
        return data.first_name;
      } else {
        return "Sin asignar";
      }
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
    getLeadDate (leadDate) {
      const createdAt = new Date(leadDate).toLocaleString("en-GB");
      const [date, hour] = createdAt.split(",");
      return `${date}\n${hour}`;
    },
    openExistingQuotePrev () {
      location.reload();
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
      query.type = "ga";
      this.$router.push({ path: "sura", query });
    },
    newQuote () {
      // this.$emit('newquote')
      const urlEnv = process.env.apiUrl
      if (urlEnv === 'https://api.dev.simplee.cl/api') {
        const url =
          "https://simplee-web.dev.simplee.cl/cotizar_st/seguros/garantia?step=1&user=" +
          this.$store.state.localStorage.user.id +
          "&user_name=" +
          this.$store.state.localStorage.user.first_name;
        window.location = url;
      } else {
        const url =
          "http://simplee.cl/cotizar_st/seguros/garantia?step=1&user=" +
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
      if (value.Datos) {
        return value.Datos.Detalles.numeroFolio;
      } else {
        return "No tiene";
      }
    },
    GetPagado (value) {
      if (!value) {
        return "No";
      } else {
        return "Si";
      }
    },
    GetType (value) {
      if (value === 'seriedad_oferta') {
        return 'Seriedad de la oferta'
      } else {
        return 'Fiel cumplimiento'
      }
    },
    GetStatusRenta (value) {
      if (value === 'pending') {
        return 'Pendiente'
      } else if (value === 'approve') {
        return 'Aprobado'
      } else {
        return 'Declinada'
      }
    },
    GetConciliado (value) {
      if (!value) {
        return "No";
      } else {
        return "Si";
      }
    },
    getGAStatus (state) {
      return state
        ? leadsStaticVars.detailedStatesGA[state]
        : leadsStaticVars.detailedStatesGA.sin_estado;
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
  