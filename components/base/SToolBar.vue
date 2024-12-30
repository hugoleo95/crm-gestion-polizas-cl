<template>
  <div class="d-flex justify-content-between flex-column flex-row flex-md-column">
    <div class="d-flex d-md-none justify-content-start">
      <button
        class="btn text-white btn-primary btn-md"
        @click="mostrarFiltros"
      >{{ showFilters ? 'Ocultar' : 'Mostrar' }}Filtros</button>
    </div>
    <div
      v-if="showFilters"
      class="d-flex justify-content-between flex-column flex-md-row"
    >
      <div
        v-if="selectedFilter"
        class="transparent-bg"
        @click="hiddeFilters"
      />
      <div class="d-flex pb-2 pb-md-0 flex-column flex-md-row">
        <div class="d-flex mt-4 mt-md-0">
          <b-button
            v-b-tooltip.hover
            class="text-white clearFiltersBtn mr-3 mr-md-3"
            variant="primary"
            pill
            size="sm"
            title="Limpiar filtros"
            @click="resetFilters"
          >
            <fa-icon
              :icon="['fas', 'times']"
              class="text-white"
              style="font-size: 1.2rem"
            />
          </b-button>

          <b-dropdown
            ref="dropdown"
            class="shadow-dropdow mr-3 mr-md-4"
            variant="light"
            toggle-class="text-dropdown"
            no-caret
          >
            <template #button-content>
              <div class="icon">
                <fa-icon :icon="['far', 'calendar-alt']" /> {{ localFilters.optionDate }}
              </div>
            </template>
            <b-dropdown-item
              v-if="!onlyDate"
              :active="localFilters.optionDate == 'Semana actual'"
              @click="setWeekly(false)"
            >
              Semana actual
            </b-dropdown-item>
            <b-dropdown-item
              v-if="!onlyDate"
              :active="localFilters.optionDate == 'Mes actual'"
              @click="setMonthly(false)"
            >
              Mes actual
            </b-dropdown-item>
            <b-dropdown-item
              v-if="!onlyDate"
              :active="localFilters.optionDate == 'Año actual'"
              @click="setAnnual(false)"
            >
              Año actual
            </b-dropdown-item>
            <b-dropdown-divider />
            <div
              v-if="postventa"
              class="px-4 mt-2"
            >
              Mes vencimiento
              <b-form-select
                v-model="localFilters.mes_termino_vigencia"
                @change="setMontVenci(false)"
              >
                <b-form-select-option value="1">
                  Enero
                </b-form-select-option>
                <b-form-select-option value="2">
                  Febrero
                </b-form-select-option>
                <b-form-select-option value="3">
                  Marzo
                </b-form-select-option>
                <b-form-select-option value="4">
                  Abril
                </b-form-select-option>
                <b-form-select-option value="5">
                  Mayo
                </b-form-select-option>
                <b-form-select-option value="6">
                  Junio
                </b-form-select-option>
                <b-form-select-option value="7">
                  Julio
                </b-form-select-option>
                <b-form-select-option value="8">
                  Agosto
                </b-form-select-option>
                <b-form-select-option value="9">
                  Septiembre
                </b-form-select-option>
                <b-form-select-option value="10">
                  Octubre
                </b-form-select-option>
                <b-form-select-option value="11">
                  Noviembre
                </b-form-select-option>
                <b-form-select-option value="12">
                  Diciembre
                </b-form-select-option>
              </b-form-select>
            </div>
            <b-dropdown-header>{{ !onlyDate ? 'Rango de fechas' : 'Fechas por Salida/Llegada'}}</b-dropdown-header>
            
            <div
              v-if="filterByRenewalDates"
              class="px-4"
            >
              <b-form-select v-model="localFilters.selectedDateFilter">
                <b-form-select-option value="emited">
                  Emisión
                </b-form-select-option>
                <b-form-select-option value="vigency">
                  Término vigencia
                </b-form-select-option>
              </b-form-select>
            </div>
            <div
              v-if="filterByDateType"
              class="px-4"
            >
              <b-form-select v-model="localFilters.date_type">
                <b-form-select-option value="created_at">
                  Fecha de creación
                </b-form-select-option>
                <b-form-select-option value="closed_at">
                  Fecha de cierre
                </b-form-select-option>
              </b-form-select>
            </div>
            <b-dropdown-form
              v-if="request || dashboard || defaults"
              header="Rango de fechas"
            >
              <div class="d-flex justify-content-between align-items-center my-2">
                <label>
                  Desde
                </label>
                <input
                  v-model="localFilters.startDate"
                  type="date"
                  placeholder="YYYY-MM-DD"
                  autocomplete="off"
                  class="ml-2 px-2"
                >
              </div>
              <div class="d-flex justify-content-between align-items-center mt-2 mb-3">
                <label for="example-input">
                  Hasta
                </label>
                <input
                  v-model="localFilters.endDate"
                  type="date"
                  placeholder="YYYY-MM-DD"
                  autocomplete="off"
                  class="ml-2 px-2"
                >
              </div>

              <b-button
                variant="primary"
                size="sm"
                block
                @click="setCustomDatesRange()"
              >
                Filtrar
              </b-button>
            </b-dropdown-form>
            <b-dropdown-form
              v-else
              header="Rango de fechas"
            >
              <div class="d-flex justify-content-between align-items-center my-2">
                <label>
                  Desde
                </label>
                <input
                  v-model="localFilters.startDate"
                  type="date"
                  placeholder="YYYY-MM-DD"
                  autocomplete="off"
                  class="ml-2 px-2"
                >
              </div>
              <div class="d-flex justify-content-between align-items-center mt-2 mb-3">
                <label for="example-input">
                  Hasta
                </label>
                <input
                  v-model="localFilters.endDate"
                  type="date"
                  placeholder="YYYY-MM-DD"
                  autocomplete="off"
                  class="ml-2 px-2"
                >
              </div>

              <b-button
                variant="primary"
                size="sm"
                block
                @click="useFilters()"
              >
                Filtrar
              </b-button>
            </b-dropdown-form>
          </b-dropdown>
          <b-dropdown
            v-if="dashboard || filterByUser || filterByStatePay || filterByProducts || filterByProductsInterest || filterByTypeProduct || filterByCompanies || filterByState || filterByEtiquetas || filterByPriority || filterByTypeBuy || filterByPriorityRequest || filterByTypeRequest || filterByReferral || filterByChannel || filterByPolicy || filterByStateRC || filterByProporsalRC || filterByStatePaidRC"
            ref="filterDropdown"
            variant="light"
            toggle-class="text-dropdown"
            class="shadow-dropdow mr-3 mr-md-4"
            no-caret
          >
            <template #button-content>
              <div class="icon">
                <fa-icon :icon="['fas', 'filter']" /> Filtros
              </div>
            </template>
            <div
              class="p-1"
              style="width: 20rem"
            >
              <b-dropdown-form @click="selectFilter">
                <div
                  v-if="dashboard"
                  class="d-flex justify-content-between align-items-center my-2"
                >
                  <label>
                    Canal
                  </label>
                  <b-form-select
                    v-model="localFilters.channelDashboard"
                    :options="ChanDasOp"
                    style="width: 55%"
                  />
                </div>
                <div
                  v-if="filterByUser && !pagos"
                  class="d-flex justify-content-between align-items-center my-2"
                >
                  <label>
                    Ejecutivo
                  </label>
                  <b-form-select
                    v-model="localFilters.email"
                    :options="executivesOptions"
                    style="width: 55%"
                  />
                </div>
                <div
                  v-if="filterByStatePay"
                  class="d-flex justify-content-between align-items-center my-2 position-relative"
                >
                  <label>
                    Estado
                  </label>
                  <div
                    class="custom-select"
                    style="width: 55%"
                    title="estado_pago"
                    @click="selectFilter"
                  >
                    Seleccionar
                  </div>
                  <b-dropdown-form
                    v-show="selectedFilter === 'estado_pago'"
                    class="fake-dropdowns"
                    name="estado_pago"
                  >
                    <b-form-checkbox
                      v-model="allSelectedStatePay"
                      class="d-flex flex-column font-weight-bold text-nowrap"
                      type="checkbox"
                      name="estado_pago"
                      @change="toggleAllStatusPay"
                    >
                      {{ allSelectedStatePay ? '(Deseleccionar todo)' : '(Seleccionar todo)' }}
                    </b-form-checkbox>
                    <b-form-checkbox-group
                      v-model="localFilters.statePay"
                      :options="allStatePay"
                      class="d-flex flex-column"
                      type="checkbox"
                      name="estado_pago"
                    />
                  </b-dropdown-form>
                </div>
                <div
                  v-if="filterByStateBitacora"
                  class="d-flex justify-content-between align-items-center my-2 position-relative"
                >
                  <label>
                    Estado
                  </label>
                  <div
                    class="custom-select"
                    style="width: 55%"
                    title="estado_bitacora"
                    @click="selectFilter"
                  >
                    Seleccionar
                  </div>
                  <b-dropdown-form
                    v-show="selectedFilter === 'estado_bitacora'"
                    class="fake-dropdowns"
                    name="estado_bitacora"
                  >
                    <b-form-checkbox
                      v-model="allSelectedStateBitacora"
                      class="d-flex flex-column font-weight-bold text-nowrap"
                      type="checkbox"
                      name="estado_bitacora"
                      @change="toggleAllStatusBitacora"
                    >
                      {{ allSelectedStateBitacora ? '(Deseleccionar todo)' : '(Seleccionar todo)' }}
                    </b-form-checkbox>
                    <b-form-checkbox-group
                      v-model="localFilters.bitacora_status"
                      :options="allStateBitacora"
                      class="d-flex flex-column"
                      type="checkbox"
                      name="estado_bitacora"
                    />
                  </b-dropdown-form>
                </div>
                <div
                  v-if="filterByProducts"
                  class="d-flex justify-content-between align-items-center my-2 position-relative"
                >
                  <label>
                    Productos
                  </label>
                  <div
                    class="custom-select"
                    style="width: 55%"
                    title="products"
                    @click="selectFilter"
                  >
                    Seleccionar
                  </div>
                  <b-dropdown-form
                    v-show="selectedFilter === 'products'"
                    class="fake-dropdowns"
                    name="products"
                  >
                    <b-form-checkbox
                      v-model="allSelectedProduct"
                      class="d-flex flex-column font-weight-bold text-nowrap"
                      type="checkbox"
                      name="products"
                      @change="toggleAllProduct"
                    >
                      {{ allSelectedProduct ? '(Deseleccionar todo)' : '(Seleccionar todo)' }}
                    </b-form-checkbox>
                    <b-form-checkbox-group
                      v-model="localFilters.products"
                      :options="allProducts"
                      class="d-flex flex-column text-nowrap"
                      type="checkbox"
                      name="products"
                    />
                  </b-dropdown-form>
                </div>
                <!--<div
                  v-if="filterByProductsInterest"
                  class="d-flex justify-content-between align-items-center my-2 position-relative"
                >
                  <label>
                    Productos
                  </label>
                  <div
                    class="custom-select"
                    style="width: 55%"
                    title="productsinterest"
                    @click="selectFilter"
                  >
                    Seleccionar
                  </div>
                  <b-dropdown-form
                    v-show="selectedFilter === 'productsinterest'"
                    class="fake-dropdowns"
                    name="productsinterest"
                  >
                    <b-form-checkbox
                      v-model="allSelectedProducts"
                      class="d-flex flex-column font-weight-bold text-nowrap"
                      type="checkbox"
                      name="productsinterest"
                      @change="toggleAll"
                    >
                      {{ allSelectedProducts ? '(Deseleccionar todo)' : '(Seleccionar todo)' }}
                    </b-form-checkbox>
                    <b-form-checkbox-group
                      v-model="localFilters.product_interest"
                      :options="optionProductsInterest"
                      class="d-flex flex-column"
                      type="checkbox"
                      name="productsinterest"
                    />
                  </b-dropdown-form>
                </div>
              -->
                <div
                  v-if="filterByProductsInterest"
                  class="d-flex justify-content-between align-items-center my-2 position-relative"
                >
                  <label>
                    Productos
                  </label>
                  <div
                    class="custom-select"
                    style="width: 55%"
                    title="productsinterest"
                    @click="selectFilter"
                  >
                    Seleccionar
                  </div>
                  <b-dropdown-form
                    v-show="selectedFilter === 'productsinterest'"
                    class="fake-dropdowns"
                    name="productsinterest"
                  >
                    <b-form-checkbox
                      v-model="allSelectedProducts"
                      class="d-flex flex-column font-weight-bold text-nowrap"
                      type="checkbox"
                      name="productsinterest"
                      @change="toggleAll"
                    >
                      {{ allSelectedProducts ? '(Deseleccionar todo)' : '(Seleccionar todo)' }}
                    </b-form-checkbox>
                    <b-form-checkbox-group
                      v-model="localFilters.product_group"
                      :options="optionProductsInterest"
                      class="d-flex flex-column"
                      type="checkbox"
                      name="productsinterest"
                    />
                  </b-dropdown-form>
                </div>
                <div
                  v-if="filterByTypeProduct"
                  class="d-flex justify-content-between align-items-center my-2 position-relative"
                >
                  <label>
                    Tipo Producto
                  </label>
                  <div
                    class="custom-select"
                    style="width: 55%"
                    title="tipo_producto"
                    @click="selectFilter"
                  >
                    Seleccionar
                  </div>
                  <b-dropdown-form
                    v-show="selectedFilter === 'tipo_producto'"
                    class="fake-dropdowns"
                    name="tipo_producto"
                  >
                    <b-form-checkbox
                      v-model="allSelectedTypeProduct"
                      class="d-flex flex-column font-weight-bold text-nowrap"
                      type="checkbox"
                      name="tipo_producto"
                      @change="toggleAllTypesProducts"
                    >
                      {{ allSelectedTypeProduct ? '(Deseleccionar todo)' : '(Seleccionar todo)' }}
                    </b-form-checkbox>
                    <b-form-checkbox-group
                      v-model="localFilters.product_type"
                      :options="alltypeproduct"
                      class="d-flex flex-column"
                      type="checkbox"
                      name="tipo_producto"
                    />
                  </b-dropdown-form>
                </div>
                <div
                  v-if="filterByCompanies"
                  class="d-flex justify-content-between align-items-center my-2 position-relative"
                >
                  <label>
                    Compañias
                  </label>
                  <div
                    class="custom-select"
                    style="width: 55%"
                    title="companies"
                    @click="selectFilter"
                  >
                    Seleccionar
                  </div>
                  <b-dropdown-form
                    v-show="selectedFilter === 'companies'"
                    class="fake-dropdowns"
                    name="companies"
                  >
                    <b-form-checkbox
                      v-model="allSelectedCompanies"
                      class="d-flex flex-column font-weight-bold text-nowrap"
                      type="checkbox"
                      name="companies"
                      @change="toggleAllCompanies"
                    >
                      {{ allSelectedCompanies ? '(Deseleccionar todo)' : '(Seleccionar todo)' }}
                    </b-form-checkbox>
                    <b-form-checkbox-group
                      v-model="localFilters.companies"
                      :options="allCompanies"
                      class="d-flex flex-column"
                      type="checkbox"
                      name="companies"
                    />
                  </b-dropdown-form>
                </div>
                <div
                  v-if="filterByState"
                  class="d-flex justify-content-between align-items-center my-2 position-relative"
                >
                  <label>
                    Estados
                  </label>
                  <div
                    class="custom-select"
                    style="width: 55%"
                    title="estados"
                    @click="selectFilter"
                  >
                    Seleccionar
                  </div>
                  <b-dropdown-form
                    v-show="selectedFilter === 'estados'"
                    class="fake-dropdowns"
                    name="estados"
                  >
                    <b-form-checkbox
                      v-model="allSelected"
                      class="d-flex flex-column font-weight-bold text-nowrap"
                      type="checkbox"
                      name="estados"
                      @change="toggleAllState"
                    >
                      {{ allSelected ? '(Deseleccionar todo)' : '(Seleccionar todo)' }}
                    </b-form-checkbox>
                    <b-form-checkbox-group
                      v-model="localFilters.states"
                      :options="allStates"
                      class="d-flex flex-column"
                      type="checkbox"
                      name="estados"
                    />
                  </b-dropdown-form>
                </div>
                <div
                  v-if="filterByEtiquetas"
                  class="d-flex justify-content-between align-items-center my-2 position-relative"
                >
                  <label>
                    Partners
                  </label>
                  <div
                    class="custom-select"
                    style="width: 55%"
                    title="partners"
                    @click="selectFilter"
                  >
                    Seleccionar
                  </div>
                  <b-dropdown-form
                    v-show="selectedFilter === 'partners'"
                    class="fake-dropdowns"
                    name="partners"
                  >
                    <b-form-checkbox
                      v-model="allSelectedPartners"
                      class="d-flex flex-column font-weight-bold text-nowrap"
                      type="checkbox"
                      name="partners"
                      @change="toggleAllStatePartners"
                    >
                      {{ allSelectedPartners ? '(Deseleccionar todo)' : '(Seleccionar todo)' }}
                    </b-form-checkbox>
                    <b-form-checkbox-group
                      v-model="localFilters.partnership"
                      :options="PartnersOptions"
                      class="d-flex flex-column"
                      type="checkbox"
                      name="partners"
                    />
                  </b-dropdown-form>
                </div>
                <div
                  v-if="filterByEtiquetas"
                  class="d-flex justify-content-between align-items-center my-2 position-relative"
                >
                  <label>
                    Etiquetas
                  </label>
                  <div
                    class="custom-select"
                    style="width: 55%"
                    title="etiquetas"
                    @click="selectFilter"
                  >
                    Seleccionar
                  </div>
                  <b-dropdown-form
                    v-show="selectedFilter === 'etiquetas'"
                    class="fake-dropdowns"
                    name="etiquetas"
                  >
                    <b-form-checkbox
                      v-model="allSelectedEtiquetas"
                      class="d-flex flex-column font-weight-bold text-nowrap"
                      type="checkbox"
                      name="etiquetas"
                      @change="toggleAllStateEtiquetas"
                    >
                      {{ allSelectedEtiquetas ? '(Deseleccionar todo)' : '(Seleccionar todo)' }}
                    </b-form-checkbox>
                    <b-form-checkbox-group
                      v-model="localFilters.tags"
                      :options="etiquetass"
                      class="d-flex flex-column"
                      type="checkbox"
                      name="etiquetas"
                    />
                  </b-dropdown-form>
                </div>
                <div
                  v-if="filterByPriority"
                  class="d-flex justify-content-between align-items-center my-2 position-relative"
                >
                  <label>
                    Prioridades
                  </label>
                  <div
                    class="custom-select"
                    style="width: 55%"
                    title="prioridades"
                    @click="selectFilter"
                  >
                    Seleccionar
                  </div>
                  <b-dropdown-form
                    v-show="selectedFilter === 'prioridades'"
                    class="fake-dropdowns"
                    name="prioridades"
                  >
                    <b-form-checkbox-group
                      v-model="localFilters.priorities"
                      :options="allPriorities"
                      class="d-flex flex-column"
                      type="checkbox"
                      name="prioridades"
                    />
                  </b-dropdown-form>
                </div>
                <div
                  v-if="filterByTypeBuy"
                  class="d-flex justify-content-between align-items-center my-2 position-relative"
                >
                  <label>
                    Tipo Pago
                  </label>
                  <div
                    class="custom-select"
                    style="width: 55%"
                    title="typebuy"
                    @click="selectFilter"
                  >
                    Seleccionar
                  </div>
                  <b-dropdown-form
                    v-show="selectedFilter === 'typebuy'"
                    class="fake-dropdowns"
                    name="typebuy"
                  >
                    <b-form-checkbox
                      v-model="allSelectedTypesBuys"
                      class="d-flex flex-column font-weight-bold text-nowrap"
                      type="checkbox"
                      name="typebuy"
                      @change="toggleAllTypesBuys"
                    >
                      {{ allSelectedTypesBuys ? '(Deseleccionar todo)' : '(Seleccionar todo)' }}
                    </b-form-checkbox>
                    <b-form-checkbox-group
                      v-model="localFilters.tipo_pago"
                      :options="allTypesBuy"
                      class="d-flex flex-column"
                      type="checkbox"
                      name="typebuy"
                    />
                  </b-dropdown-form>
                </div>
                <div
                  v-if="filterByPriorityRequest"
                  class="d-flex justify-content-between align-items-center my-2 position-relative"
                >
                  <label>
                    Tipo Solicitud
                  </label>
                  <div
                    class="custom-select"
                    style="width: 55%"
                    title="typesolicitud"
                    @click="selectFilter"
                  >
                    Seleccionar
                  </div>
                  <b-dropdown-form
                    v-show="selectedFilter === 'typesolicitud'"
                    class="fake-dropdowns"
                    name="typesolicitud"
                  >
                    <b-form-checkbox
                      v-model="allSelectedTypes"
                      class="d-flex flex-column font-weight-bold text-nowrap"
                      type="checkbox"
                      name="typesolicitud"
                      @change="toggleAllTypes"
                    >
                      {{ allSelectedTypes ? '(Deseleccionar todo)' : '(Seleccionar todo)' }}
                    </b-form-checkbox>
                    <b-form-checkbox-group
                      v-model="localFilters.request_type"
                      :options="allTypesRequest"
                      class="d-flex flex-column"
                      type="checkbox"
                      name="typesolicitud"
                    />
                  </b-dropdown-form>
                </div>

                <div
                  v-if="filterByTypeRequest"
                  class="d-flex justify-content-between align-items-center my-2 position-relative"
                >
                  <label>
                    Prioridades
                  </label>
                  <b-form-select
                    v-model="localFilters.priorities_scores"
                    :options="allPrioritiesRequest"
                    style="width: 55%"
                  />
                </div>

              
                <div
                  v-if="dashboard"
                  class="d-flex justify-content-between align-items-center my-2"
                >
                  <label>
                    Tipo de Venta
                  </label>
                  <b-form-select
                    v-model="localFilters.tipoVentaDashboard"
                    :options="TipoVentaOp"
                    style="width: 55%"
                  />
                </div>
                <!-- <div
              <div
                v-if="filterByShowProduct"
                class="d-flex justify-content-between align-items-center my-2"
              >
                <label>
                  Solo Productos
                </label>
                <b-form-checkbox
                  size="lg"
                  class="mx-2"
                  @change="Searchonlyproduct"
                />
              </div>
              -->
                <div
                  v-if="filterByChannel"
                  class="d-flex justify-content-between align-items-center my-2 position-relative"
                >
                  <label>
                    Canal
                  </label>
                  <div
                    class="custom-select"
                    style="width: 55%"
                    title="canales"
                    @click="selectFilter"
                  >
                    Seleccionar
                  </div>
                  <b-dropdown-form
                    v-show="selectedFilter === 'canales'"
                    class="fake-dropdowns"
                    name="canales"
                  >
                    <b-form-checkbox
                      v-model="allSelectedCanales"
                      class="d-flex flex-column font-weight-bold text-nowrap"
                      type="checkbox"
                      name="canales"
                      @change="toggleAllStateCanales"
                    >
                      {{ allSelectedCanales ? '(Deseleccionar todo)' : '(Seleccionar todo)' }}
                    </b-form-checkbox>
                    <b-form-checkbox-group
                      v-model="localFilters.channel"
                      :options="channelsOptions"
                      class="d-flex flex-column"
                      type="checkbox"
                      name="canales"
                      @change="updatecampanas2"
                    />
                  </b-dropdown-form>
                </div>
                <div
                  v-if="viewCampanas && filterByChannel"
                  class="d-flex justify-content-between align-items-center my-2 position-relative"
                >
                  <label>
                    Campañas
                  </label>
                  <div
                    class="custom-select"
                    style="width: 55%"
                    title="campanas"
                    @click="selectFilter"
                  >
                    Seleccionar
                  </div>
                  <b-dropdown-form
                    v-show="selectedFilter === 'campanas'"
                    class="fake-dropdowns"
                    name="campanas"
                  >
                    <b-form-checkbox
                      v-model="allSelectedCampanas"
                      class="d-flex flex-column font-weight-bold text-nowrap"
                      type="checkbox"
                      name="campanas"
                      @change="toggleAllStateCampanas"
                    >
                      {{ allSelectedCampanas ? '(Deseleccionar todo)' : '(Seleccionar todo)' }}
                    </b-form-checkbox>
                    <b-form-checkbox-group
                      v-model="localFilters.campaign_slugs"
                      :options="allcampanas"
                      class="d-flex flex-column"
                      type="checkbox"
                      name="campanas"
                    />
                  </b-dropdown-form>
                </div>
                <div
                  v-if="filterByPolicy"
                  class="d-flex justify-content-between align-items-center my-2 position-relative"
                >
                  <label>
                    N Poliza
                  </label>
                  <div class="relative">
                    <input
                      v-model="localFilters.nro_policy"
                      class="px-2"
                      placeholder="Ingrese"
                      @input="debouncedSearch"
                    >
                  </div>
                </div>
                <div
                  v-if="filterByStateRC"
                  class="d-flex justify-content-between align-items-center my-2"
                >
                  <label>
                    Estado
                  </label>
                  <b-form-select
                    v-model="localFilters.state"
                    :options="optionsStatusRc"
                    style="width: 55%"
                  />
                </div>
                <div
                  v-if="filterByProporsalRC"
                  class="d-flex justify-content-between align-items-center my-2"
                >
                  <label>
                    Tipo propuesta
                  </label>
                  <b-form-select
                    v-model="localFilters.type_proposal"
                    :options="optionsTypeProporsalRc"
                    style="width: 55%"
                  />
                </div>
                <div
                  v-if="filterByStatePaidRC"
                  class="d-flex justify-content-between align-items-center my-2"
                >
                  <label>
                    Pagado
                  </label>
                  <b-form-select
                    v-model="localFilters.paid"
                    :options="optionsPaidRc"
                    style="width: 55%"
                  />
                </div>
                <div class="mt-4 d-flex">
                  <b-button
                    class="text-white"
                    variant="primary"
                    size="sm"
                    block
                    @click="useFilters"
                  >
                    Aplicar
                  </b-button>
                  <b-button
                    class="my-0 ml-2 text-white"
                    variant="secondary"
                    size="sm"
                    block
                    @click="hiddeFilters"
                  >
                    Cancelar
                  </b-button>
                </div>
              </b-dropdown-form>
            </div>
          </b-dropdown>
        </div>
        <div class="d-flex mt-4 mt-md-0">
          <div v-if="dashboard && !consulta">
            <button
              class="btn text-white btn-primary btn-md"
              @click="mostrarConsultasD"
            >
              Consultar
            </button>
          </div>
          <div
            v-if="searchField || searchInput"
            class="position-relative"
          >
            <fa-icon
              class="position-absolute text-secondary icon-search"
              :icon="['fas', 'search']"
            />
            <div class="relative">
              <input
                v-model="localFilters.search"
                class="searchBar"
                placeholder="Ingrese"
              >
            </div>
          </div>
          <div
            v-if="searchField || searchInput"
            class="relative ml-2 my-1"
          >
            <b-button
              variant="primary"
              size="sm"
              block
              class="text-white"
              @click="debouncedSearch2()"
            >
              Buscar
            </b-button>
          </div>
          <!-- <div
          v-if="searchField"
          class="position-relative d-flex ml-2 align-items-center"
        >
          <span
            v-if="typeIdentification === 'CL'"
            class="text-secondary ml-1"
          >
            Solo por RUT
          </span>
          <span
            v-if="typeIdentification === 'MX'"
            class="text-secondary ml-1"
          >
            Solo por RFC
          </span>
          <b-form-checkbox
            size="lg"
            class="mx-2"
            @change="SearchRut"
          />
        </div> -->
          <div v-if="ButtonVentas">
            <b-button
              v-if="!filterpay"
              v-b-tooltip.hover
              class="text-white clearFiltersBtn ml-3"
              variant="primary"
              pill
              size="sm"
              title="Ver ventas"
              @click="VentasFilter"
            >
              <fa-icon
                :icon="['fas', 'dollar-sign']"
                class="text-white"
                style="font-size: 1.2rem"
              />
            </b-button>
            <b-button
              v-else
              v-b-tooltip.hover
              class="text-white clearFiltersBtn ml-3"
              variant="primary"
              pill
              size="sm"
              title="Revertir"
              @click="ReVentasFilter"
            >
              <fa-icon
                :icon="['fas', 'tag']"
                class="text-white"
                style="font-size: 1.2rem"
              />
            </b-button>
          </div>
        </div>
      </div>
      <div class="d-flex">
        <slot name="buttons" />
        <b-button
          v-if="newBtn"
          class="text-white shadow-dropdow btn-new ml-4 px-3"
          variant="primary"
          @click="$emit('new-lead')"
        >
          <fa-icon
            class="mr-1"
            :icon="['fas', 'plus']"
          /> Crear nueva
        </b-button>
      </div>
    </div>
    <div
      v-if="showFilters"
      class="d-flex justify-content-between"
    >
      <div class="filterss w-100 mt-4">
        <ul class="filterss_content">
          <li
            v-for="(filter, i) in filtersselect"
            :key="i"
          >
            <div class="d-flex">
              <span>
                <fa-icon
                  :icon="['fas', 'times']"
                  class="text-white mr-2"
                  @click="DeleteFilter(i, filter.key)"
                />{{ filter.text }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import allStates from '~/static/states.json'
import allPriorities from '~/static/priorities.json'
import allPrioritiesRequest from '~/static/prioritiesrequest.json'
import allTypesRequest from '~/static/typerequest.json'
import allproductsmx from '~/static/allproductsmx.json'
import allproducts from '~/static/allproducts.json'
import productscl from '~/static/productsgroup.json'
import productsmx from '~/static/productsgroupmx.json'
import companies from '~/static/companies.json'
import companiesmx from '~/static/companiesmx.json'

export default {
  name: 'SToolBar',
  props: {
    onlyDate: {
      type: Boolean,
      default: false
    },
    currentFilters: {
      type: Object,
      default: null
    },
    searchField: {
      type: Boolean,
      default: false
    },
    ButtonVentas: {
      type: Boolean,
      default: false
    },
    dashboard: {
      type: Boolean,
      default: false
    },
    request: {
      type: Boolean,
      default: false
    },
    quote: {
      type: Boolean,
      default: false
    },
    defaults: {
      type: Boolean,
      default: false
    },
    postventa: {
      type: Boolean,
      default: false
    },
    cobranza: {
      type: Boolean,
      default: false
    },
    pagos: {
      type: Boolean,
      default: false
    },
    searchInput: {
      type: Boolean,
      default: false
    },
    newBtn: {
      type: Boolean,
      default: false
    },
    filterByState: {
      type: Boolean,
      default: false
    },
    filterByEtiquetas: {
      type: Boolean,
      default: false
    },
    activePost: {
      type: Boolean,
      default: false
    },
    filterByUser: {
      type: Boolean,
      default: true
    },
    filterByReferral: {
      type: Boolean,
      default: false
    },
    filterByShowProduct: {
      type: Boolean,
      default: false
    },
    filterByProducts: {
      type: Boolean,
      default: false
    },
    filterByProductsInterest: {
      type: Boolean,
      default: false
    },
    filterByCompanies: {
      type: Boolean,
      default: false
    },
    filterByTypeProduct: {
      type: Boolean,
      default: false
    },
    filterByPriority: {
      type: Boolean,
      default: false
    },
    filterByPriorityRequest: {
      type: Boolean,
      default: false
    },
    filterByTypeBuy: {
      type: Boolean,
      default: false
    },
    filterByTypeRequest: {
      type: Boolean,
      default: false
    },
    filterByStatePay: {
      type: Boolean,
      default: false
    },
    filterByStateBitacora: {
      type: Boolean,
      default: false
    },
    filterByChannel: {
      type: Boolean,
      default: false
    },
    filterByPolicy: {
      type: Boolean,
      default: false
    },
    filterByStateRC: {
      type: Boolean,
      default: false
    },
    filterByProporsalRC: {
      type: Boolean,
      default: false
    },
    filterByStatePaidRC: {
      type: Boolean,
      default: false
    },
    filterByRenewalDates: {
      type: Boolean,
      default: false
    },
    filterByDateType: {
      type: Boolean,
      default: false
    },
    consulta: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      localFilters: {
        id: null,
        email: 'General',
        optionDate: '',
        startDate: null,
        emitedStartDate: null,
        emitedEndDate: null,
        endDate: null,
        range: true,
        refferal: null,
        channel: [],
        etiquetass: [],
        states: [],
        products: [],
        companies: [],
        priorities: [],
        product_group: [],
        request_type: [],
        campaign_slugs: [],
        nro_policy: '',
        state: null,
        type_proposal: null,
        paid: null,
        search: '',
        date_type: 'created_at',
        selectedDateFilter: 'emited',
      },
      canalesDashboardOptions: [
        { value: 'Todos', text: 'Todos' },
        { value: 'Asistido', text: 'Asistido' },
        { value: 'Digital', text: 'Digital' },
        { value: 'Referido', text: 'Referido' },
        { value: 'Sponsor', text: 'Sponsor' },
      ],
      tipoventasDashboard: [
        { value: 'Todas', text: 'Todas' },
        { value: 'Nueva', text: 'Nueva' },
        { value: 'Renovacion', text: 'Renovación' },
        { value: 'Endoso', text: 'Endoso' },
      ],
      showFilters: false,
      viewCampanas: false,
      products: {},
      typeIdentification: '',
      groupscl: [
        { value: 'asistencias', text: 'Asistencias' },
        { value: 'diagnostico_de_riesgo', text: 'Diagnostico De riesgo' },
        { value: 'seguro_de_accidentes_personales', text: 'Seguro De Accidentes Personales' },
        { value: 'seguro_de_accidentes_personales_digitales', text: 'Seguro De Accidentes Personales Digitales' },
        { value: 'seguro_de_responsabilidad_civil', text: 'Seguro De Responsabilidad Civil' },
        { value: 'seguro_de_responsabilidad_civil_digital', text: 'Seguro De Responsabilidad Civil Digital' },
        { value: 'seguros_para_la_ingenieria', text: 'Seguro Para La Ingeneria' },
        { value: 'seguro_de_vehiculos', text: 'Seguro De Vehiculos' },
        { value: 'seguro_de_incendio_sismo_y_robo', text: 'Seguro De Incendio, Sismo Y Robo' },
        { value: 'seguro_de_incendio_sismo_y_robo_digital', text: 'Seguro De Incendio, Sismo Y Robo Digital' },
        { value: 'seguro_de_transporte_y_carga', text: 'Seguro De Transporte Y Carga' },
        { value: 'otros_seguros', text: 'Otros Seguros' },
        { value: 'seguro_colectivo_de_salud', text: 'Seguros de Salud' },
        { value: 'seguro_de_garantia', text: 'Seguro De Garantia(antiguo)' },
        { value: 'seguro_de_garantia_digital_publica', text: 'Seguro de Garantia Digital Publica' },
        { value: 'seguro_de_garantia_digital_privada', text: 'Seguro De Garantia Digital Privada' },
        { value: 'seguro_de_garantia_publica', text: 'Seguro De Garantia Publica' },
        { value: 'seguro_de_garantia_privada', text: 'Seguro De Garantia Privada' },
        { value: 'seguro_de_garantia_fondos', text: 'Seguro De Garantia Fondos' },
        { value: 'seguro_de_garantia_creditos', text: 'Seguro De Garantia Creditos' },
      ],
      groupsmx: [
        { value: 'asistencias', text: 'Asistencias' },
        { value: 'seguro_de_responsabilidad_civil', text: 'Seguro De Responsabilidad Civil' },
        { value: 'seguro_de_danos', text: 'Seguro de Daños' },
        { value: 'seguro_de_transporte_y_carga', text: 'Seguro de Transporte de Mercancías' },
        { value: 'seguro_de_vehiculos', text: 'Seguro de Vehículos' },
        { value: 'seguro_de_proteccion_cibernetica', text: 'Seguro de Protección Cibernética' },
        { value: 'otros_seguros', text: 'Otros Seguros' },
        { value: 'seguro_colectivo_de_gastos_medicos_mayores', text: 'Seguros de Salud' },
        { value: 'affinity', text: 'Seguros para Personas' }
      ],
      alltypeproduct: [
        { value: 'poliza', text: 'Póliza' },
        { value: 'endoso', text: 'Endoso' },
        { value: 'renovacion', text: 'Renovación' }
      ],
      groups: [],
      optionProductsInterest: {},
      selectedFilter: null,
      selectedDateFilter: 'emited',
      allStates: [],
      allProducts: [],
      allCompanies: [],
      allcampanas: [],
      allPriorities: [],
      SelectAllStates: [],
      SelectAllEtiquetas: [],
      SelectAllPartners: [],
      SelectallProducts: [],
      SelectallTypes: [],
      SelectallTypesBuys: [],
      SelectallCompanies: [],
      SelectallTypesProducts: [],
      SelectallStatePay: [],
      SelectallStateBitacora: [],
      SelectallCampanas: [],
      SelectallCanales: [],
      allProductsInterest: [],
      allSelected: false,
      allSelectedEtiquetas: false,
      allSelectedPartners: false,
      allSelectedProduct: false,
      allSelectedProducts: true,
      allSelectedTypes: true,
      allSelectedTypesBuys: true,
      allSelectedCompanies: true,
      allSelectedTypeProduct: true,
      allSelectedStatePay: true,
      allSelectedStateBitacora: false,
      allSelectedCampanas: true,
      allSelectedCanales: false,
      allPriorities: [],
      allPrioritiesRequest: [],
      allStateBitacora: [
        {
          "value": "pending",
          "text": "Pendiente"
        },
        {
          "value": "renewed",
          "text": "Renovada"
        },
        {
          "value": "change_company",
          "text": "Cambio compañia"
        },
        {
          "value": "no_corresponde",
          "text": "No corresponde"
        }
      ],
      allStatePay: [
        {
          "value": "PENDING",
          "text": "Pendiente"
        },
        {
          "value": "PAID",
          "text": "Pagada"
        },
        {
          "value": "CANCELLED",
          "text": "Cancelado"
        }
      ],
      allTypesBuy: [],
      types_payment_cl: [
        { value: null, text: 'Sin Tipo' },
        { value: 'contado', text: 'Contado' },
        { value: 'contado_transbank', text: 'Contado Transbank' },
        { value: 'pac_activo', text: 'PAC activo' },
        { value: 'pac_no_activo', text: 'PAC no activo' },
        { value: 'pat_activo', text: 'PAT activo' },
        { value: 'pat_no_activo', text: 'PAT no activo' },
        { value: 'aviso_de_cobranza', text: 'Aviso de cobranza' },
        { value: 'suscripcion_transbank', text: 'Suscripción Transbank' }
      ],
      types_payment_mx: [
        { value: null, text: 'Sin Tipo' },
        { value: 'anual', text: 'Anual' },
        { value: 'mensual', text: 'Mensual' },
        { value: 'semestral', text: 'Semestral' }
      ],
      allTypesRequest: [],
      optionsStatusRc: [
        { value: 'processed', text: 'Procesada' },
        { value: 'not_processed', text: 'No procesada' }
      ],
      optionsTypeProporsalRc: [
        { value: 'proposal', text: 'Propuesta' },
        { value: 'quote', text: 'Cotización' },
        { value: 'cancelled', text: 'Cancelada' }
      ],
      optionsPaidRc: [
        { value: true, text: 'Si' },
        { value: false, text: 'No' }
      ]
    }
  },
  computed: {
    ...mapState(['filtersselect', 'leads', 'filterpay', 'leadsFilterssave']),
    ...mapState('leads', ['refferals', 'partners', 'userskam', 'channels', 'campanas']),
    ...mapState('localStorage', ['user', 'userPermissions']),
    executivesOptions () {
      if (this.user.role !== 'KAM' && this.user.role !== 'EXT_KAM') {
        const options = this.userskam.filter(user => user.first_name).map((executive) => {
          return {
            value: executive.email,
            text: executive.first_name
          }
        })
        options.unshift({ value: 'General', text: 'General' })
        return options
      } else {
        const userone = [{
          id: this.user.id,
          email: this.user.email,
          first_name: this.user.first_name
        }]
        const options = userone.filter(user => user.first_name).map((executive) => {
          return {
            value: executive.email,
            text: executive.first_name
          }
        })
        // options.unshift({ value: 'General', text: 'General' })
        return options
      }
    },
    ChanDasOp () {
      return this.canalesDashboardOptions
    },
    TipoVentaOp () {
      return this.tipoventasDashboard
    },
    refferalsOptions () {
      const options = this.refferals.map((ref) => {
        return {
          value: ref.id,
          text: ref.name
        }
      })
      options.unshift({ value: null, text: 'Seleccionar' })
      return options
    },
    PartnersOptions () {
      const options = this.partners.map((ref) => {
        return {
          value: ref.id,
          text: ref.name
        }
      })
      return options
    },
    channelsOptions () {
      const options = this.channels.map((channel) => {
        return {
          value: channel.id,
          text: channel.name
        }
      })
      return options
    }
  },
  watch: {
    'localFilters.email': {
      handler (val, oldVal) {
        if (val !== oldVal) {
          this.localFilters.id = val !== 'General' ? this.userskam.find(u => u.email === val)?.id : null
        }
      }
    }
  },
  created () {
    const lead = []
    for (const [key, value] of Object.entries(this.leads.etiquetas)) {
      if (value) {
        const newlead = {
          text: value.id,
          value: value.id
        }
        lead.push(newlead)
      }
    }
    this.etiquetass = lead
    this.setValuesFromCurrentFilters()
    this.getOptions()
    this.setDateRange()
    if (this.request && this.user.role === 'KAM') {
      this.filterByUser = false
    } if (this.dashboard && this.user.role === 'KAM') {
      this.filterByUser = false
    }
    if (this.dashboard) {
      this.allSelectedCanales = true
    }
    this.$root.$on('bv::dropdown::hide', (e) => {
      if (e.type === 'hide') {
        this.setValuesFromCurrentFilters()
      }
    })
    const widthScreen = window.innerWidth;
    console.log(widthScreen)
    if (widthScreen > 768) {
      this.showFilters = true;
    }
  },
  methods: {
    debouncedSearch: _.debounce(function (e) {
      /* if (this.request) {
        this.setFilterselected()
      }
      else if (this.defaults) {
        this.setFilterselecteddefault()
      }
      else if (this.postventa) {
        this.setFilterselectedpost()
      }
      else if (this.quote) {
        this.setFilterselectedQuote()
      }
      console.log(e.target.value)
      //this.$emit('search', e.target.value)
      */
    }, 750),
    mostrarConsultasD () {
      this.$emit('showData')
    },
    mostrarFiltros () {
      this.showFilters = !this.showFilters;
    },
    debouncedSearch2 () {
      const value = this.localFilters.search
      if (this.request) {
        this.setFilterselected()
      } else if (this.defaults) {
        this.setFilterselecteddefault()
      } else if (this.postventa) {
        this.setFilterselectedpost()
      } else if (this.quote) {
        this.setFilterselectedQuote()
      } else if (this.cobranza) {
        this.setFilterselectedCobranza()
      }
      else if (this.pagos) {
        this.setFilterselectedPagos()
      }
      console.log('hola5445')
      this.$emit('save-filters', this.localFilters)
      this.hiddeFilters()
    },
    toStringDate: time => new Date(time).toISOString().split('T')[0],
    setValuesFromCurrentFilters () {
      this.localFilters = Object.assign({}, this.currentFilters)
    },
    setValuesFromCurrentFilters2 (value) {
      this.localFilters = Object.assign({}, value)
    },
    getOptions () {
      this.allTypesRequest = allTypesRequest
      this.allPrioritiesRequest = allPrioritiesRequest
      this.allPriorities = allPriorities
      this.allStates = allStates
      if (process.env.version === 'CL') {
        this.allTypesBuy = this.types_payment_cl
        this.groups = this.groupscl
        this.allProducts = allproducts
        this.allCompanies = companies
        this.typeIdentification = 'CL'
        this.products = productscl
      } else {
        this.allTypesBuy = this.types_payment_mx
        this.groups = this.groupsmx
        this.allProducts = allproductsmx
        this.allCompanies = companiesmx
        this.typeIdentification = 'MX'
        this.products = productsmx
      }
      this.updatecampanas()
      // this.optionProductsInterest = Object.values(this.products).reduce((acc, curr) => [...acc, ...curr], [])
      this.optionProductsInterest = this.groups
      const productnull = {
        text: 'Sin Grupo',
        value: 'sin_grupo'
      }
      // console.log(this.optionProductsInterest)
      this.optionProductsInterest.unshift(productnull)
      this.toggleAll(true)
      // console.log(this.optionProductsInterest)
    },
    updatecampanas () {
      const campanas = this.campanas.filter(campana => campana.channel === this.localFilters.channel)
      const newcampanas = []
      for (let i = 0; i < campanas.length; i++) {
        const neww = {
          text: campanas[i].name,
          value: campanas[i].slug
        }
        newcampanas.push(neww)
      }
      this.allcampanas = newcampanas
    },
    updatecampanas2 () {
      console.log(this.localFilters.channel.length)
      if (this.localFilters.channel.length > 0 && this.localFilters.channel.length < 2) {
        this.viewCampanas = true
        const campanas = this.campanas.filter(campana => campana.channel === this.localFilters.channel[0])
        const newcampanas = []
        for (let i = 0; i < campanas.length; i++) {
          const neww = {
            text: campanas[i].name,
            value: campanas[i].slug
          }
          newcampanas.push(neww)
        }
        this.allcampanas = newcampanas
        this.toggleAllStateCampanas(true)
      } else {
        this.viewCampanas = false
        this.localFilters.campaign_slugs = []
      }
    },
    setDateRange (updateLocalOnly = false) {
      if (this.localFilters.optionDate === 'Año actual') {
        this.setAnnual(updateLocalOnly)
      } else if (this.localFilters.optionDate === 'Mes actual') {
        this.setMonthly(updateLocalOnly)
      } else if (this.localFilters.optionDate === 'Semana actual') {
        this.setWeekly(updateLocalOnly)
      } else if (this.localFilters.range) {
        console.log(this.localFilters.range)
      } else {
        this.alldates(updateLocalOnly)
      }
    },
    toggleAllProduct (checked) {
      this.SelectallProducts = []
      for (let i = 0; i < this.allProducts.length; i++) {
        this.SelectallProducts.push(this.allProducts[i].value)
      }
      this.localFilters.products = checked ? this.SelectallProducts.slice() : []
    },
    toggleAllTypesBuys (checked) {
      this.SelectallTypesBuys = []
      for (let i = 0; i < this.allTypesBuy.length; i++) {
        this.SelectallTypesBuys.push(this.allTypesBuy[i].value)
      }
      this.localFilters.tipo_pago = checked ? this.SelectallTypesBuys.slice() : []
    },
    toggleAllTypes (checked) {
      this.SelectallTypes = []
      for (let i = 0; i < this.allTypesRequest.length; i++) {
        this.SelectallTypes.push(this.allTypesRequest[i].value)
      }
      this.localFilters.request_type = checked ? this.SelectallTypes.slice() : []
    },
    toggleAllCompanies (checked) {
      this.SelectallCompanies = []
      for (let i = 0; i < this.allCompanies.length; i++) {
        this.SelectallCompanies.push(this.allCompanies[i].value)
      }
      this.localFilters.companies = checked ? this.SelectallCompanies.slice() : []
    },
    toggleAllTypesProducts (checked) {
      this.SelectallTypesProducts = []
      for (let i = 0; i < this.alltypeproduct.length; i++) {
        this.SelectallTypesProducts.push(this.alltypeproduct[i].value)
      }
      this.localFilters.product_type = checked ? this.SelectallTypesProducts.slice() : []
    },
    toggleAllStatusPay (checked) {
      this.SelectallStatePay = []
      for (let i = 0; i < this.allStatePay.length; i++) {
        this.SelectallStatePay.push(this.allStatePay[i].value)
      }
      this.localFilters.statePay = checked ? this.SelectallStatePay.slice() : []
    },
    toggleAllStatusBitacora (checked) {
      this.SelectallStateBitacora = []
      for (let i = 0; i < this.allStateBitacora.length; i++) {
        this.SelectallStateBitacora.push(this.allStateBitacora[i].value)
      }
      this.localFilters.bitacora_status = checked ? this.SelectallStateBitacora.slice() : []
    },
    toggleAllStateCampanas (checked) {
      this.SelectallCampanas = []
      for (let i = 0; i < this.allcampanas.length; i++) {
        this.SelectallCampanas.push(this.allcampanas[i].value)
      }
      this.localFilters.campaign_slugs = checked ? this.SelectallCampanas.slice() : []
    },
    toggleAllStateCanales (checked) {
      this.SelectallCanales = []
      for (let i = 0; i < this.channelsOptions.length; i++) {
        this.SelectallCanales.push(this.channelsOptions[i].value)
      }
      this.localFilters.channel = checked ? this.SelectallCanales.slice() : []
    },
    toggleAllState (checked) {
      this.SelectAllStates = []
      for (let i = 0; i < this.allStates.length; i++) {
        this.SelectAllStates.push(this.allStates[i].value)
      }
      this.localFilters.states = checked ? this.SelectAllStates.slice() : []
    },
    toggleAllStateEtiquetas (checked) {
      this.SelectAllEtiquetas = []
      for (let i = 0; i < this.etiquetass.length; i++) {
        this.SelectAllEtiquetas.push(this.etiquetass[i].value)
      }
      this.localFilters.tags = checked ? this.SelectAllEtiquetas.slice() : []
    },
    toggleAllStatePartners (checked) {
      this.SelectAllPartners = []
      for (let i = 0; i < this.partners.length; i++) {
        this.SelectAllPartners.push(this.partners[i].value)
      }
      this.localFilters.partnership = checked ? this.SelectAllPartners.slice() : []
    },
    SearchRut (all) {
      this.$emit('set-rut', all)
    },
    Searchonlyproduct (all) {
      this.$emit('set-only-product', all)
    },
    setWeekly (updateLocalOnly = false) {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - date.getDay())
      this.localFilters.startDate = this.toStringDate(date.getTime())
      console.log(date.getTime())
      this.localFilters.emitedStartDate = this.toStringDate(date.getTime())
      date.setDate(date.getDate() + 6)
      this.localFilters.endDate = this.toStringDate(date.getTime())
      this.localFilters.emitedEndDate = this.toStringDate(date.getTime())
      this.localFilters.optionDate = 'Semana actual'
      this.localFilters.range = false
      if (!updateLocalOnly) { this.$emit('save-filters', this.localFilters) }
    },
    setMontVenci (updateLocalOnly = false) {
      if (!updateLocalOnly) { this.$emit('save-filters', this.localFilters) }
    },
    setMonthly (updateLocalOnly = false) {
      const today = new Date()
      const firstDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      const lastDay = new Date(today.getFullYear(), today.getMonth(), 1)

      this.localFilters.startDate = this.toStringDate(lastDay.getTime())
      this.localFilters.endDate = this.toStringDate(firstDay.getTime())
      this.localFilters.emitedStartDate = this.toStringDate(lastDay.getTime())
      this.localFilters.emitedEndDate = this.toStringDate(firstDay.getTime())
      this.localFilters.optionDate = 'Mes actual'
      this.localFilters.range = false
      if (!updateLocalOnly) { this.$emit('save-filters', this.localFilters) }
    },
    setAnnual (updateLocalOnly = false) {
      const date = new Date()
      this.localFilters.startDate = this.toStringDate(new Date(date.getFullYear(), 0, 1).getTime())
      this.localFilters.endDate = this.toStringDate(new Date(date.getFullYear(), 11, 31).getTime())
      this.localFilters.emitedStartDate = this.toStringDate(new Date(date.getFullYear(), 0, 1).getTime())
      this.localFilters.emitedEndDate = this.toStringDate(new Date(date.getFullYear(), 11, 31).getTime())
      this.localFilters.optionDate = 'Año actual'
      this.localFilters.range = false
      if (!updateLocalOnly) { this.$emit('save-filters', this.localFilters) }
    },
    alldates (updateLocalOnly = false) {
      if (this.dashboard) {
        const datestart = new Date()
        this.localFilters.startDate = this.toStringDate(new Date(datestart.getFullYear(), 0, 1).getTime())
        this.localFilters.emitedStartDate = this.toStringDate(new Date(datestart.getFullYear(), 0, 1).getTime())
      } else {
        const datestart = new Date('December 17, 2015 03:24:00')
        this.localFilters.startDate = this.toStringDate(new Date(datestart.getFullYear(), 0, 1).getTime())
        this.localFilters.emitedStartDate = this.toStringDate(new Date(datestart.getFullYear(), 0, 1).getTime())
      }
      const dateend = new Date()
      this.localFilters.endDate = this.toStringDate(new Date(dateend.getFullYear(), 11, 31).getTime())
      this.localFilters.emitedEndDate = this.toStringDate(new Date(dateend.getFullYear(), 11, 31).getTime())
      this.localFilters.range = false
      if (!updateLocalOnly) { this.$emit('save-filters', this.localFilters) }
    },
    setCustomDatesRange () {
      const startDate = this.localFilters.startDate.split('-').reverse().join('/')
      const endDate = this.localFilters.endDate.split('-').reverse().join('/')
      this.localFilters.optionDate = startDate + ' a ' + endDate
      this.localFilters.range = true
      this.useFilters()
    },
    selectFilter (e) {
      this.selectedFilter = e.target.title || e.target.name
    },
    hiddeFilters () {
      if (this.$refs.filterDropdown) {
        this.$refs.filterDropdown.hide(true)
      }
      this.selectedFilter = null
    },
    useFilters () {
      /* if (this.activePost) {
         if (this.localFilters.selectedDateFilter === 'vigency') {
           delete this.localFilters.emitedEndDate
           delete this.localFilters.emitedStartDate
         } else {
           delete this.localFilters.endDate
           delete this.localFilters.startDate
         }
       }
       */
      if (this.request) {
        this.setFilterselected()
      } else if (this.defaults) {
        this.setFilterselecteddefault()
      } else if (this.postventa) {
        this.setFilterselectedpost()
      } else if (this.quote) {
        this.setFilterselectedQuote()
      } else if (this.cobranza) {
        this.setFilterselectedCobranza()
      }
      else if (this.pagos) {
        this.setFilterselectedPagos()
      }

      this.$emit('save-filters', this.localFilters)
      this.hiddeFilters()
    },
    setFilterselected () {
      const payload = []
      this.$store.commit('setFiltersselect', '')
      // console.log(this.localFilters)

      if (this.localFilters.email !== 'General') {
        if (this.localFilters.email) {
          const leadUser = this.userskam.find(({ email }) => this.localFilters.email === email)
          if (leadUser) {
            const newvalue = {
              text: 'Ejecutivo: ' + leadUser.first_name,
              key: 'email'
            }
            payload.push(newvalue)
          } else {
            const newvalue = {
              text: 'Ejecutivo: No Kam',
              key: 'email'
            }
            payload.push(newvalue)
          }
        }
      }
      console.log(this.localFilters.product_group)
      if (this.localFilters.product_group.length > 0) {
        const newvalue = {
          text: 'Productos ',
          key: 'product_group'
        }
        payload.push(newvalue)
      }

      if (this.localFilters.states.length > 0) {
        const newvalue = {
          text: 'Estados ',
          key: 'states'
        }
        payload.push(newvalue)
      }

      if (this.localFilters.request_type.length > 0) {
        const newvalue = {
          text: 'Tipo de solicitud ',
          key: 'request_type'
        }
        payload.push(newvalue)
      }
      console.log(this.localFilters.priorities_scores)
      if (this.localFilters.priorities_scores) {
        const newvalue = {
          text: 'Prioridad: ' + this.localFilters.priorities_scores,
          key: 'priorities_scores'
        }
        payload.push(newvalue)
      }

      if (this.localFilters.refferal) {
        const refeUser = this.refferals.find(({ id }) => this.localFilters.refferal === id)
        const newvalue = {
          text: 'Referido: ' + refeUser.name,
          key: 'refferal'
        }
        payload.push(newvalue)
      }

      if (this.localFilters.channel) {
        if (this.localFilters.channel.length > 0) {
          const newvalue = {
            text: 'Canales',
            key: 'channel'
          }
          payload.push(newvalue)
        }
      }
      if (this.localFilters.campaign_slugs) {
        if (this.localFilters.campaign_slugs.length > 0 && this.localFilters.channel) {
          this.viewCampanas = true
          const newvalue = {
            text: 'Campañas ',
            key: 'campaign_slugs'
          }
          payload.push(newvalue)
        }
      }
      if (this.localFilters.search) {
        const newvalue = {
          text: 'Busqueda: ' + this.localFilters.search,
          key: 'search'
        }
        payload.push(newvalue)
      }
      console.log(payload)
      this.$store.commit('setFiltersselect', payload)
    },
    setFilterselecteddefault () {
      const payload = []
      this.$store.commit('setFiltersselect', '')
      // console.log(this.localFilters)

      if (this.localFilters.email !== 'General') {
        if (this.localFilters.email) {
          const leadUser = this.userskam.find(({ email }) => this.localFilters.email === email)
          if (leadUser) {
            const newvalue = {
              text: 'Ejecutivo: ' + leadUser.first_name,
              key: 'email'
            }
            payload.push(newvalue)
          } else {
            const newvalue = {
              text: 'Ejecutivo: No Kam',
              key: 'email'
            }
            payload.push(newvalue)
          }
        }
      }
      console.log(this.localFilters.search)
      if (this.localFilters.search) {
        const newvalue = {
          text: 'Busqueda: ' + this.localFilters.search,
          key: 'search'
        }
        payload.push(newvalue)
      }
      this.$store.commit('setFiltersselect', payload)
    },
    setFilterselectedpost () {
      const payload = []
      this.$store.commit('setFiltersselect', '')
      // console.log(this.localFilters)

      if (this.localFilters.email !== 'General') {
        if (this.localFilters.email) {
          const leadUser = this.userskam.find(({ email }) => this.localFilters.email === email)
          if (leadUser) {
            const newvalue = {
              text: 'Ejecutivo: ' + leadUser.first_name,
              key: 'email'
            }
            payload.push(newvalue)
          } else {
            const newvalue = {
              text: 'Ejecutivo: No Kam',
              key: 'email'
            }
            payload.push(newvalue)
          }
        }
      }
      if (this.localFilters.products) {
        if (this.localFilters.products.length > 0) {
          const newvalue = {
            text: 'Productos ',
            key: 'products'
          }
          payload.push(newvalue)
        }
      }
      if (this.localFilters.companies) {
        if (this.localFilters.companies.length > 0) {
          const newvalue = {
            text: 'Compañias ',
            key: 'companies'
          }
          payload.push(newvalue)
        }
      }
      if (this.localFilters.search) {
        const newvalue = {
          text: 'Busqueda: ' + this.localFilters.search,
          key: 'search'
        }
        payload.push(newvalue)
      }
      if (this.localFilters.refferal) {
        const refeUser = this.refferals.find(({ id }) => this.localFilters.refferal === id)
        const newvalue = {
          text: 'Referido: ' + refeUser.name,
          key: 'refferal'
        }
        payload.push(newvalue)
      }
      this.$store.commit('setFiltersselect', payload)
    },
    setFilterselectedCobranza () {
      const payload = []
      this.$store.commit('setFiltersselect', '')
      // console.log(this.localFilters)

      if (this.localFilters.email !== 'General') {
        if (this.localFilters.email) {
          const leadUser = this.userskam.find(({ email }) => this.localFilters.email === email)
          if (leadUser) {
            const newvalue = {
              text: 'Ejecutivo: ' + leadUser.first_name,
              key: 'email'
            }
            payload.push(newvalue)
          } else {
            const newvalue = {
              text: 'Ejecutivo: No Kam',
              key: 'email'
            }
            payload.push(newvalue)
          }
        }
      }
      if (this.localFilters.search) {
        const newvalue = {
          text: 'Busqueda: ' + this.localFilters.search,
          key: 'search'
        }
        payload.push(newvalue)
      }
      if (this.localFilters.tipo_pago && this.localFilters.tipo_pago.length > 0) {
        const newvalue = {
          text: 'Tipos Pago ',
          key: 'tipo_pago'
        }
        payload.push(newvalue)
      }
      this.$store.commit('setFiltersselect', payload)
    },
    setFilterselectedPagos () {
      const payload = []
      this.$store.commit('setFiltersselect', '')
      // console.log(this.localFilters)

      if (this.localFilters.search) {
        const newvalue = {
          text: 'Busqueda: ' + this.localFilters.search,
          key: 'search'
        }
        payload.push(newvalue)
      }
      this.$store.commit('setFiltersselect', payload)
    },
    setFilterselectedQuote () {
      const payload = []
      this.$store.commit('setFiltersselect', '')
      // console.log(this.localFilters)
      if (this.localFilters.email !== 'General') {
        if (this.localFilters.email) {
          const leadUser = this.userskam.find(({ email }) => this.localFilters.email === email)
          if (leadUser) {
            const newvalue = {
              text: 'Ejecutivo: ' + leadUser.first_name,
              key: 'email'
            }
            payload.push(newvalue)
          } else {
            const newvalue = {
              text: 'Ejecutivo: No Kam',
              key: 'email'
            }
            payload.push(newvalue)
          }
        }
      }
      if (this.localFilters.nro_policy) {
        const newvalue = {
          text: 'Poliza: ' + this.localFilters.nro_policy,
          key: 'nro_policy'
        }
        payload.push(newvalue)
      }
      if (this.localFilters.state) {
        let value
        if (this.localFilters.state === 'processed') {
          value = 'Procesado'
        } else {
          value = 'No Procesado'
        }
        const newvalue = {
          text: 'Estado: ' + value,
          key: 'state'
        }
        payload.push(newvalue)
      }
      if (this.localFilters.type_proposal) {
        let value
        if (this.localFilters.type_proposal === 'proposal') {
          value = 'Propuesta'
        } else if (this.localFilters.type_proposal === 'quote') {
          value = 'Cotización'
        } else {
          value = 'Cancelada'
        }
        const newvalue = {
          text: 'Tipo Propuesta: ' + value,
          key: 'type_proposal'
        }
        payload.push(newvalue)
      }
      if (this.localFilters.paid) {
        let value
        if (this.localFilters.paid === true) {
          value = 'Si'
        } else if (this.localFilters.paid === false) {
          value = 'No'
        }
        const newvalue = {
          text: 'Pagado: ' + value,
          key: 'paid'
        }
        payload.push(newvalue)
      }

      this.$store.commit('setFiltersselect', payload)
    },
    DeleteFilter (i, key) {
      let payload = this.filtersselect
      const num = i
      if (key === 'email') {
        this.localFilters.id = null
        this.localFilters.email = 'General'
      }
      if (key === 'product_group') {
        this.allSelectedProducts = false
        this.localFilters.product_group = []
      }
      if (key === 'tags') {
        this.allSelected = false
        this.localFilters.states = []
      } if (key === 'states') {
        this.allSelectedEtiquetas = false
        this.localFilters.tags = []
      }
      if (key === 'request_type') {
        this.allSelectedTypes = false
        this.localFilters.request_type = []
      }
      if (key === 'tipo_pago') {
        this.allSelectedTypesBuys = false
        this.localFilters.tipo_pago = []
      }
      if (key === 'priorities_scores') {
        this.localFilters.priorities_scores = null
      }
      if (key === 'refferal') {
        this.localFilters.refferal = null
      }
      if (key === 'channel') {
        this.allSelectedCanales = false
        this.allSelectedCampanas = false
        const newnum = parseInt(num) + parseInt(1)
        payload = payload.filter((_, index) => index !== newnum)
        this.localFilters.campaign_slugs = []
      }
      if (key === 'campaign_slugs') {
        this.allSelectedCampanas = false
        this.localFilters.campaign_slugs = []
      }
      if (key === 'search') {
        this.localFilters.search = null
      }
      if (key === 'nro_policy') {
        this.localFilters.nro_policy = null
      }
      if (key === 'type_proposal') {
        this.localFilters.type_proposal = null
      }
      if (key === 'state') {
        this.localFilters.state = null
      }
      if (key === 'paid') {
        this.localFilters.paid = null
      }
      if (key === 'products') {
        this.allSelectedProduct = false
        this.localFilters.products = []
      }
      if (key === 'companies') {
        this.allSelectedCompanies = false
        this.localFilters.companies = []
      }
      if (key === 'tipo_producto') {
        this.allSelectedTypeProduct = false
        this.localFilters.product_type = []
      }
      if (key === 'estado_pago') {
        this.allSelectedStatePay = false
        this.localFilters.statePay = []
      }
      if (key === 'estado_bitacora') {
        this.allSelectedStateBitacora = false
        this.localFilters.bitacora_status = []

      }
      payload = payload.filter((_, index) => index !== num)
      this.$emit('save-filters', this.localFilters)
      this.$store.commit('setFiltersselect', payload)
    },
    VentasFilter () {
      if (this.filterpay) {
        this.$store.commit('setFiltersPay', false)
      } else {
        this.$store.commit('setFiltersPay', true)
      }
      const today = new Date()
      const firstDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      const lastDay = new Date(today.getFullYear(), today.getMonth(), 1)
      const startDate = this.toStringDate(lastDay.getTime())
      const endDate = this.toStringDate(firstDay.getTime())
      const optionDate = 'Mes actual'
      const range = false
      const checked = true
      this.allProductsInterest = []
      for (let i = 0; i < this.optionProductsInterest.length; i++) {
        this.allProductsInterest.push(this.optionProductsInterest[i].value)
      }
      const product_group = checked ? this.allProductsInterest.slice() : []
      this.SelectallTypes = []
      for (let i = 0; i < this.allTypesRequest.length; i++) {
        this.SelectallTypes.push(this.allTypesRequest[i].value)
      }
      const request_type = checked ? this.SelectallTypes.slice() : []
      const oldfilters = this.localFilters
      this.$store.commit('setFiltersselectold', oldfilters)
      this.localFilters = {
        id: null,
        email: this.$store.state.localStorage.user.email,
        id: this.$store.state.localStorage.user.id,
        search: '',
        optionDate,
        range,
        startDate,
        endDate,
        states: ['cliente_cerrado'],
        product_group,
        request_type,
        date_type: 'closed_at'
      }
      this.$emit('resetFilters', this.localFilters)
      this.$emit('pagereset')
      this.$emit('pagepay', 'pay')
      setTimeout(() => this.setValuesFromCurrentFilters2(this.localFilters), 500)
    },
    ReVentasFilter () {
      if (this.filterpay) {
        this.$store.commit('setFiltersPay', false)
      } else {
        this.$store.commit('setFiltersPay', true)
      }
      this.$emit('resetFilters', this.leadsFilterssave)
      this.$emit('pagereset')
      this.$emit('pagenopay', 'normal')
      setTimeout(() => this.setValuesFromCurrentFilters2(this.leadsFilterssave), 500)
    },
    resetFilters () {
      const payload = []
      this.$store.commit('setFiltersselect', '')
      if (this.dashboard) {
        const datestart = new Date()
        const startDate2 = this.toStringDate(new Date(datestart.getFullYear(), 0, 1).getTime())
        const emitedStartDate2 = this.toStringDate(new Date(datestart.getFullYear(), 0, 1).getTime())
        const dateend = new Date()
        const endDate2 = this.toStringDate(new Date(dateend.getFullYear(), 11, 31).getTime())
        const emitedEndDate2 = this.toStringDate(new Date(dateend.getFullYear(), 11, 31).getTime())
        const range2 = false
        this.localFilters = {
          id: null,
          email: 'General',
          optionDate: '',
          startDate: startDate2,
          endDate: endDate2,
          emitedStartDate: emitedStartDate2,
          emitedEndDate: emitedEndDate2,
          range: range2,
          refferal: null,
          channel: [],
          states: [],
          products: [],
          companies: [],
          product_group: [],
          request_type: [],
          priorities: [],
          nro_policy: '',
          state: null,
          type_proposal: null,
          paid: null,
          selectedDateFilter: 'emited',
          date_type: null
        }
        this.setDateRange()
        this.$emit('resetFilters', this.localFilters)
        setTimeout(() => this.setValuesFromCurrentFilters(), 500)
      } else {
        const datestart = new Date('December 17, 2015 03:24:00')
        const startDate2 = this.toStringDate(new Date(datestart.getFullYear(), 0, 1).getTime())
        const emitedStartDate2 = this.toStringDate(new Date(datestart.getFullYear(), 0, 1).getTime())
        const dateend = new Date()
        const endDate2 = this.toStringDate(new Date(dateend.getFullYear(), 11, 31).getTime())
        const emitedEndDate2 = this.toStringDate(new Date(dateend.getFullYear(), 11, 31).getTime())
        const range2 = false
        this.localFilters = {
          id: null,
          email: 'General',
          optionDate: '',
          startDate: startDate2,
          endDate: endDate2,
          emitedStartDate: emitedStartDate2,
          emitedEndDate: emitedEndDate2,
          range: range2,
          refferal: null,
          channel: [],
          states: [],
          products: [],
          companies: [],
          product_group: [],
          request_type: [],
          priorities: [],
          date_type: null,
          nro_policy: '',
          state: null,
          type_proposal: null,
          paid: null,
          selectedDateFilter: 'emited'
        }
        this.setDateRange()
        // console.log(this.localFilters)
        this.$emit('resetFilters', this.localFilters)
        setTimeout(() => this.setValuesFromCurrentFilters(), 500)
      }
    },
    toggleAll (checked) {
      this.allProductsInterest = []
      for (let i = 0; i < this.optionProductsInterest.length; i++) {
        this.allProductsInterest.push(this.optionProductsInterest[i].value)
      }
      this.localFilters.product_group = checked ? this.allProductsInterest.slice() : []
    },
    toggleAllProduct (checked) {
      this.SelectallProducts = []
      for (let i = 0; i < this.allProducts.length; i++) {
        this.SelectallProducts.push(this.allProducts[i].value)
      }
      this.localFilters.products = checked ? this.SelectallProducts.slice() : []
    },
    toggleAllCompanies (checked) {
      this.SelectallCompanies = []
      for (let i = 0; i < this.allCompanies.length; i++) {
        this.SelectallCompanies.push(this.allCompanies[i].value)
      }
      this.localFilters.companies = checked ? this.SelectallCompanies.slice() : []
    },
    toggleAllTypesProducts (checked) {
      this.SelectallTypesProducts = []
      for (let i = 0; i < this.alltypeproduct.length; i++) {
        this.SelectallTypesProducts.push(this.alltypeproduct[i].value)
      }
      this.localFilters.product_type = checked ? this.SelectallTypesProducts.slice() : []
    },
    toggleAllStatusPay (checked) {
      this.SelectallStatePay = []
      for (let i = 0; i < this.allStatePay.length; i++) {
        this.SelectallStatePay.push(this.allStatePay[i].value)
      }
      this.localFilters.statePay = checked ? this.SelectallStatePay.slice() : []
    },
    toggleAllStatusBitacora (checked) {
      this.SelectallStateBitacora = []
      for (let i = 0; i < this.allStateBitacora.length; i++) {
        this.SelectallStateBitacora.push(this.allStateBitacora[i].value)
      }
      this.localFilters.bitacora_status = checked ? this.SelectallStateBitacora.slice() : []
    },
    toggleAllStateCampanas (checked) {
      this.SelectallCampanas = []
      for (let i = 0; i < this.allcampanas.length; i++) {
        this.SelectallCampanas.push(this.allcampanas[i].value)
      }
      this.localFilters.campaign_slugs = checked ? this.SelectallCampanas.slice() : []
    },
    toggleAllState (checked) {
      this.SelectAllStates = []
      for (let i = 0; i < this.allStates.length; i++) {
        this.SelectAllStates.push(this.allStates[i].value)
      }
      this.localFilters.states = checked ? this.SelectAllStates.slice() : []
    },
    toggleAllStateEtiquetas (checked) {
      this.SelectAllEtiquetas = []
      for (let i = 0; i < this.etiquetass.length; i++) {
        this.SelectAllEtiquetas.push(this.etiquetass[i].value)
      }
      this.localFilters.tags = checked ? this.SelectAllEtiquetas.slice() : []
    },
    toggleAllStatePartners (checked) {
      this.SelectAllPartners = []
      for (let i = 0; i < this.partners.length; i++) {
        this.SelectAllPartners.push(this.partners[i].value)
      }
      this.localFilters.partnership = checked ? this.SelectAllPartners.slice() : []
    },
  },
  mounted () {
    if (this.request) {
      this.setFilterselected()
    } else if (this.defaults) {
      this.setFilterselecteddefault()
    } else if (this.postventa) {
      this.setFilterselectedpost()
    } else if (this.quote) {
      this.setFilterselectedQuote()
    } else if (this.cobranza) {
      this.setFilterselectedCobranza()
    }
    else if (this.pagos) {
      this.setFilterselectedPagos()
    }
  }
}
</script>

<style lang="scss">
.space {
  div + div {
    margin-left: 24px;
  }
}
.date-height {
  height: 34px;
}
.shadow-dropdow {
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}
.text-dropdown {
  font-family: Rubik;
  font-style: normal;
  line-height: 17px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #acacac !important;
  .icon {
    display: flex;
    &::after {
      align-self: center;
      justify-self: end;
      margin-left: 6px;
      content: "";
      width: 0.65em;
      height: 0.35em;
      background-color: #acacac;
      clip-path: polygon(25% 0, 50% 50%, 75% 0%, 100% 0, 50% 100%, 0 0);
    }
    svg {
      height: 18px;
      min-width: 14px;
      margin-right: 5px;
      color: #acacac;
    }
  }
}
label {
  margin-bottom: 0;
}
input {
  color: #acacac;
  height: 36px;
  background: #ffffff;
  border: 1px solid #e1e1e1;
  box-sizing: border-box;
  border-radius: 5px;
  width: 147px;
}
.searchBar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 50px 10px 2rem;
  width: 100%;
  text-align: left;

  line-height: 17px;
  font-size: 0.9rem;
  /* Filtros */

  font-family: Rubik;
  font-style: normal;
  font-weight: 500;
  height: 100%;
  outline: 0px solid black;
  /* identical to box height */

  color: #acacac;

  background: #fff;
  border-radius: 5px;
}
.btn-new {
  font-family: Rubik;
  font-style: normal;
  font-weight: 500;
  height: 100%;
  font-size: 14px;
}
.fake-dropdowns {
  position: absolute;
  background: #fff;
  max-height: 25rem;
  width: fit-content;
  overflow-y: auto;
  padding: 1rem 0;
  left: 44%;
  top: 0;
  z-index: 1002;
  border: 1px solid #e1e1e1;
}
.transparent-bg {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
}
.clearFiltersBtn {
  font-size: 1.2rem !important;
  height: 36px;
  width: 36px;
  align-self: center;
}
.stitle {
  font-size: 14px !important;
}
.icon-search {
  left: 0.6rem;
  top: 0.72rem;
}
.filterss {
  display: flex;
}
.filterss_content {
  width: 95%;
  margin-bottom: 15px;
  padding-left: 0px;
}
.dropdown-option {
  font-size: 25px;
}
.filterss_content li .icon {
  cursor: pointer;
  margin-left: 7px;
}
.filterss_content li span {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: #ffffff;
}
.filterss_content li {
  height: auto;
  display: inline-block;
  line-height: 1;
  cursor: pointer;
  font-size: 14px;
  text-align: center;
  margin-right: 14px;
  background: #233348;
  border-radius: 45px;
  padding: 10px 24px;
  margin-bottom: 10px;
}
</style>
