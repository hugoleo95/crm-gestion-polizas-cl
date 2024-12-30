<template>
  <div>
    <s-modal
      v-if="modaldocuments"
      :documentsdata="documentsproducts"
      :idproduct="productid"
      :idrequest="requestid"
      :idlead="Leads.id"
      no-close-on-backdrop
      @save-documents="savedocuments"
      @save-documents2="savedocuments2"
      @delete-documents="deletedocuments"
      @delete-documents2="deletedocuments2"
      @save-documents3="savedocuments3"
      @delete-documents3="deletedocuments3"
      @cancel-lead="modaldocuments = false"
      @hidde="modaldocuments = false"
    />
    <div v-if="content === 'list'">
      <div>
        <s-tool-bar
          ref="reftoolbar"
          class="toolbar"
          search-input
          optionfilter="client"
          defaults
          filter-by-user
          filter-by-etiquetas
          :current-filters="leadsFilters"
          @search="searchConfig"
          @set-rut="setRut"
          @set-only-product="setonlyproduct"
          @save-filters="setFilters"
          @resetFilters="setFilters"
          @new-lead="viewNew"
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
            <div>
              <nuxt-link
                v-if="user.role === 'OWNER' || user.role === 'DEVELOPER'"
                :to="{
                  name: 'clientes-fusionar',
                }"
              >
                <b-button
                  class="text-white shadow-dropdow btn-new ml-4"
                  variant="primary"
                >
                  Fusionar
                </b-button>
              </nuxt-link>
              <!--
              <nuxt-link
                :to="{
                  name:'clientes-corporativo',
                }"
              >
                <b-button
                  class="text-white btn-new btn-corporativo ml-2"
                  variant="info"
                >
                  <fa-icon
                    :icon="['fas', 'briefcase']"
                    class="text-white mx-2"
                  />
                  Corporativo
                </b-button>
              </nuxt-link>
              -->
            </div>
          </template>
        </s-tool-bar>
      </div>
      <leads-merge
        v-if="showSelected"
        :data="selectedClients"
        @onSelectedLeads="onRowSelectedFromModal"
        @SaveMerge="MergeLead"
      />
      <div class="d-flex mb-2 justify-content-end results">
        <span> {{ totalRows }} Resultados</span>
      </div>
      <div class="table-responsive">
        <b-table
          id="table-principal"
          ref="clientTable"
          :items="items"
          :fields="fieldsWithSelected"
          responsive="sm"
          thead-class="newth"
          :busy="loadingLeads"
          :selectable="showSelected"
          select-mode="multi"
          selected-variant=""
          @row-selected="onRowSelectedFromTable"
        >
          <template #table-busy>
            <div class="d-flex h-100">
              <div class="text-center text-primary pa-5 mx-auto h-100">
                <b-spinner class="align-middle" />
                <strong>Cargando...</strong>
              </div>
            </div>
          </template>
          <template #head(rut)>
            <span v-if="version === 'MX'"> Rfc </span>
          </template>
          <template #cell(selected)="{ item }">
            <div class="custom-control custom-checkbox">
              <input
                type="checkbox"
                :checked="item"
                :value="true"
                class="custom-control-input"
                @change="selectRow({ row: index, selected: $event })"
              >
              <label class="custom-control-label" />
            </div>
          </template>
          <template #cell(name)="{ item }">
            {{ item.name }} {{ item.last_name }}
          </template>
          <template #cell(razon_social)="{ value }">
            {{ value }}
          </template>
          <template #cell(rut)="{ value }">
            <span v-if="version === 'CL'">
              {{ formatRUT(value) }}
            </span>
            <span v-else>
              {{ value }}
            </span>
          </template>
          <template #cell(state)="{ value }">
            <span :class="['btn-state', getLeadStatus(value).class]">
              <fa-icon
                :icon="['fas', getLeadStatus(value).icon]"
                class="mr-2"
              />{{ getLeadStatus(value).text }}
            </span>
          </template>
          <template #cell(email)="{ value }">
            <a
              :href="`https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${value}`"
              target="_blank"
              :title="value"
            >{{ value.slice(0, 15) }}...</a>
          </template>
          <template #cell(phone)="{ value }">
            <a
              target="_blank"
              :href="`https://api.whatsapp.com/send?phone=${formatWhatsAppNumber(
                value
              )}`"
              :title="value"
            >{{ value }}</a>
          </template>
          <template #cell(last_request_creation)="{ value }">
            {{ getLeadDate(value) }}
          </template>
          <template #cell(created_at)="{ value }">
            {{ getLeadDate(value) }}
          </template>
          <template #cell(user_details)="{ value }">
            <p>{{ value.first_name }}</p>
          </template>
          <template #cell(actions)="{ item }">
            <div class="d-flex justify-content-center">
              <button
                v-b-tooltip.hover
                class="circle mr-2 bg-white shadow-sm border p-3"
                title="Información del cliente"
                @click="openContent(item)"
              >
                <fa-icon
                  :icon="['fas', 'edit']"
                  class="text-primary"
                  style="font-size: 0.9rem"
                />
              </button>
              <button
                v-if="user.is_superuser"
                v-b-tooltip.hover
                class="circle bg-white shadow-sm border p-3"
                title="Eliminar cliente"
                @click="deleteclient(item)"
              >
                <fa-icon
                  :icon="['fas', 'trash-alt']"
                  class="text-danger"
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
            @change="getLeads"
          />
        </div>
      </div>
    </div>
    <div v-show="content === 'merge'">
      <leads-merge-select @BackClient="BackClient" />
    </div>
    <div
      v-show="content === 'edit'"
      id="editar"
    >
      <div class="d-flex justify-content-between">
        <span
          v-if="backclientrequest === 'client'"
          class="text-base pointer"
          @click="BackClient"
        >
          <fa-icon
            :icon="['fas', 'arrow-left']"
            class="text-primary return"
          />
          <b>Regresar a Clientes</b>
        </span>
        <nuxt-link
          v-else
          :to="{
            name: 'solicitudes',
            query: {
              idrequest: idrequest,
            },
          }"
          class="text-left"
        >
          <span class="text-base pointer">
            <fa-icon
              :icon="['fas', 'arrow-left']"
              class="text-primary return"
            />
            <b>Regresar a solicitud</b>
          </span>
        </nuxt-link>
        <div>
          <b-button
            class="text-white shadow-dropdow btn-new ml-4"
            variant="primary"
            @click="confirmClient()"
          >
            Guardar cambios
          </b-button>
        </div>
      </div>
      <div class="row g-4 margin-text">
        <div class="col-lg-4 col-12 pl-0 mb-3">
          <client-form
            ref="componenteedit"
            :leadsedit="Leads"
            viewproduct
            :loading-client="loadingClient"
            @SaveActClientGod="ActClientSave"
          />
        </div>
        <div class="col-lg-8 col-12 pr-0">
          <div class="card-client">
            <nav class="nav nav-pills nav-fill">
              <a
                class="nav-link"
                aria-current="page"
                :class="['', { active: option === 'historial' }]"
                @click="optionEditClient('historial')"
              >
                Historial
              </a>
              <a
                class="nav-link"
                aria-current="page"
                :class="['', { active: option === 'solicitudes' }]"
                @click="optionEditClient('solicitudes')"
              >
                Solicitudes
              </a>
              <a
                class="nav-link"
                :class="['', { active: option === 'productos' }]"
                @click="optionEditClient('productos')"
              >
                Productos
              </a>
              <a
                class="nav-link"
                aria-current="page"
                :class="['', { active: option === 'documentos' }]"
                @click="optionEditClient('documentos')"
              >
                Documentos
              </a>
            </nav>
            <div v-show="option === 'historial'">
              <history-form
                :historyedit="history"
                :solicitudesedit="solicitudes"
                viewproduct
                :loading="loading"
              />
            </div>
            <div v-show="option === 'solicitudes'">
              <div class="table-responsive">
                <div class="text-base margin-text">
                  <nuxt-link
                    :to="{
                      name: 'solicitudes',
                      query: {
                        id: idedit,
                        tipo: 'clientes',
                      },
                    }"
                    class="text-rigth"
                  >
                    <button class="solicitud-btn">
                      <fa-icon
                        :icon="['fas', 'plus']"
                        class="text-primary edit-ico mr-2"
                      />Nueva solicitud
                    </button>
                  </nuxt-link>
                </div>
                <div>
                  <b-table
                    :items="solicitudes"
                    :fields="solicitudFields"
                    responsive="sm"
                    :busy="loadingLeads"
                    @row-clicked="onRowClicked"
                  >
                    <template #table-busy>
                      <div class="d-flex h-100">
                        <div class="text-center text-primary pa-5 mx-auto h-100">
                          <b-spinner class="align-middle" />
                          <strong>Cargando...</strong>
                        </div>
                      </div>
                    </template>
                    <template #cell(id)="{ value }">
                      {{ value }}
                    </template>
                    <template #cell(request_type)="{ value }">
                      {{ getTypeRequest(value) }}
                    </template>
                    <template #cell(created_at)="{ value }">
                      {{ getLeadDate(value) }}
                    </template>
                    <template #cell(product_interest)="{ value }">
                      {{ getTypeProductInterest(value) }}
                    </template>
                    <template #cell(lead_details)="{ value }">
                      {{ getUserRequest(value) }}
                    </template>
                    <template #cell(state)="{ value }">
                      {{ getLeadStatus2(value) }}
                    </template>
                    <template #cell(user)="row">
                      {{ GetUserStatusKam(row.item.user) }}
                      <span
                        size="sm"
                        class="text-base ml-3 span-sort"
                      >
                        <fa-icon
                          v-if="row.detailsShowing"
                          :icon="['fas', 'sort-up']"
                          class="text-base"
                        />
                        <fa-icon
                          v-else
                          :icon="['fas', 'sort-down']"
                          class="text-base span-sort"
                        />
                      </span>
                    </template>
                    <template #row-details>
                      <b-card
                        align="center"
                        class="card-detail border-0"
                        body-class="text-center body-detail"
                      >
                        <b-row class="div-style m-0">
                          <b-col
                            colspan="2"
                            class="new text-center ml-4 text-base"
                          >
                            ID Solicitud: {{ requestid }}
                          </b-col>
                        </b-row>
                        <b-row
                          v-for="item in solicituddetailsinfo"
                          :key="item"
                          class="div-style m-0"
                        >
                          <b-col class="text-left text-base">
                            {{ item.text }}
                          </b-col>
                          <b-col class="text-left ml-4 text-base text-val">
                            {{ GetFormateProduct(item.value, item.key) }}
                          </b-col>
                        </b-row>
                        <b-row class="div-style m-0">
                          <b-col class="text-left text-base">
                            Documentos
                          </b-col>
                          <b-col class="text-left ml-4 text-base text-val">
                            <fa-icon
                              :icon="['fas', 'file']"
                              class="text-primary mr-2"
                            />
                            <a
                              class="link"
                              @click="showmodaldocuments2(requestid)"
                            >
                              Abrir
                            </a>
                          </b-col>
                        </b-row>
                        <b-row>
                          <b-col class="text-right ml-4 pt-3 text-base text-val">
                            <fa-icon
                              :icon="['fas', 'edit']"
                              class="text-primary mr-2"
                            />
                            <nuxt-link
                              class="link"
                              :to="{
                                name: 'solicitudes',
                                query: {
                                  idrequest: requestid,
                                  tipo: 'clientes',
                                },
                              }"
                            >
                              Editar solicitud
                            </nuxt-link>
                          </b-col>
                        </b-row>
                      </b-card>
                    </template>
                  </b-table>
                </div>
              </div>
            </div>
            <div v-show="option === 'documentos'">
              <div class="table-responsive">
                <div class="text-base margin-text">
                  <a
                    class="text-rigth"
                    @click="showmodaldocuments3(Leads.id)"
                  >
                    <button class="solicitud-btn">
                      <fa-icon
                        :icon="['fas', 'plus']"
                        class="text-primary edit-ico mr-2"
                      />Nuevos documento
                    </button>
                  </a>
                </div>
                <div>
                  <b-table
                    :items="documentosleads"
                    :fields="documentsFields"
                    :busy="loadingLeads"
                    :tbody-tr-class="rowClassrequest"
                    thead-class="rowClassrequest2"
                    @row-clicked="onRowClicked"
                  >
                    <template #table-busy>
                      <div class="d-flex h-100">
                        <div class="text-center text-primary pa-5 mx-auto h-100">
                          <b-spinner class="align-middle" />
                          <strong>Cargando...</strong>
                        </div>
                      </div>
                    </template>
                    <template #cell(document)="{ value }">
                      <a
                        target="_blank"
                        :href="value"
                        class="doc-title"
                      >Ver documento
                        <fa-icon
                          :icon="['fas', 'file']"
                          class="text-primary mr-2"
                        />
                      </a>
                    </template>
                    <template #cell(created_at)="{ value }">
                      {{ getLeadDate(value) }}
                    </template>
                    <template #cell(actions)="{ item }">
                      <div class="d-flex justify-content-center">
                        <button
                          class="circle bg-white shadow-sm border p-3"
                          title="Eliminar documento"
                          @click="deletedocumento(item)"
                        >
                          <fa-icon
                            :icon="['fas', 'trash-alt']"
                            class="text-danger"
                            style="font-size: 0.9rem"
                          />
                        </button>
                      </div>
                    </template>
                  </b-table>
                </div>
              </div>
            </div>
            <div v-show="option === 'productos'">
              <div class="table-responsive">
                <div class="form-group px-4">
                  <div class="mb-3">
                    <label
                      class="text-base"
                      for="buscar"
                    >Buscar producto :</label>
                    <input
                      id="buscar"
                      v-model="SearchProduct"
                      placeholder="Numero de poliza, nombre completo, correo completo"
                      class="form-control w-50 form-input"
                      type="text"
                      @input="debouncedSearch"
                    >
                  </div>
                </div>
                <!--div class="text-base margin-text">
                  <button class="solicitud-btn filtrar">
                    Filtrado por
                  </button>
                </div>
                -->
                <div>
                  <b-table
                    :items="productos"
                    :fields="productfields"
                    responsive="sm"
                    :busy="loadingLeads"
                    @row-clicked="onRowClicked2"
                  >
                    <template #table-busy>
                      <div class="d-flex h-100">
                        <div class="text-center text-primary pa-5 mx-auto h-100">
                          <b-spinner class="align-middle" />
                          <strong>Cargando...</strong>
                        </div>
                      </div>
                    </template>
                    <template #cell(name)="{ value }">
                      <p>{{ getProductName(value) }}</p>
                    </template>
                    <template #cell(endorsement_info)="{ value }">
                      <p>{{ getNumeroEndoso(value) }}</p>
                    </template>
                    <template #cell(fecha_inicio_vigencia)="{ value }">
                      <p>{{ getProductDate(value) }}</p>
                    </template>
                    <template #cell(fecha_termino_vigencia)="{ value }">
                      <p>{{ getProductDate(value) }}</p>
                    </template>
                    <template #cell(state)="row">
                      {{ getProductState(row.item.state) }}
                      <span
                        size="sm"
                        class="text-base ml-3 span-sort"
                      >
                        <fa-icon
                          v-if="row.detailsShowing"
                          :icon="['fas', 'sort-up']"
                          class="text-base"
                        />
                        <fa-icon
                          v-else
                          :icon="['fas', 'sort-down']"
                          class="text-base span-sort"
                        />
                      </span>
                    </template>
                    <template #cell(actions)="{ item }">
                      <div class="d-flex justify-content-center">
                        <button
                          v-if="user.is_superuser || user.role === 'OWNER'"
                          v-b-tooltip.hover
                          class="circle bg-white shadow-sm border p-3 mr-2"
                          title="Eliminar producto"
                          @click="DeleteProduct(item)"
                        >
                          <fa-icon
                            :icon="['fas', 'trash-alt']"
                            class="text-danger"
                            style="font-size: 0.9rem"
                          />
                        </button>
                        <button
                          v-b-tooltip.hover
                          class="circle bg-white shadow-sm border p-3"
                          title="Crear endoso o renovación"
                          @click="CrearRenoEndoso(item)"
                        >
                          <fa-icon
                            :icon="['fas', 'file']"
                            class="text-primary"
                            style="font-size: 0.9rem"
                          />
                        </button>
                      </div>
                    </template>
                    <template #row-details>
                      <b-card
                        align="center"
                        class="card-detail border-0"
                        body-class="text-center body-detail"
                      >
                        <b-row class="div-style m-0">
                          <b-col
                            colspan="2"
                            class="new text-center ml-4 text-base"
                          >
                            ID Producto: {{ productid }}
                          </b-col>
                        </b-row>
                        <b-row
                          v-for="item in productdetailsinfo"
                          :key="item"
                          class="div-style m-0"
                        >
                          <b-col class="text-left text-base">
                            {{ item.text }}
                          </b-col>
                          <b-col class="text-left ml-4 text-base text-val">
                            {{ GetFormateProduct2(item.value, item.key) }}
                          </b-col>
                        </b-row>
                        <b-row class="div-style m-0">
                          <b-col class="text-left text-base">
                            Documentos
                          </b-col>
                          <b-col class="text-left ml-4 text-base text-val">
                            <fa-icon
                              :icon="['fas', 'file']"
                              class="text-primary mr-2"
                            />
                            <a
                              class="link"
                              @click="showmodaldocuments(productid)"
                            >
                              Abrir
                            </a>
                          </b-col>
                        </b-row>
                        <b-row class="div-style m-0">
                          <b-col class="text-left text-base">
                            PostVenta
                          </b-col>
                          <b-col class="text-left ml-4 text-base text-val">
                            <fa-icon
                              :icon="['fas', 'file-alt']"
                              class="text-primary mr-2"
                            />
                            <nuxt-link
                              :to="{
                                name: 'postventa',
                                query: {
                                  id: productid,
                                },
                              }"
                              class="link"
                            >
                              Ir a la póliza
                            </nuxt-link>
                          </b-col>
                        </b-row>
                        <b-row>
                          <b-col class="text-right ml-4 pt-3 text-base text-val">
                            <fa-icon
                              :icon="['fas', 'edit']"
                              class="text-primary mr-2"
                            />
                            <a
                              class="link"
                              @click="editProducts"
                            >
                              Modificar
                            </a>
                          </b-col>
                        </b-row>
                      </b-card>
                    </template>
                  </b-table>
                </div>
                <!-- <div class="product-btn">
                  <b-button
                    class="btn-md text-white shadow-dropdow btn-new ml-4"
                    variant="primary"
                  >
                    Exportar
                  </b-button>
                </div>-->
              </div>
            </div>
          </div>
          <div class="w-100">
            <div class="card-client">
              <form
                id="register-form"
                method="POST"
                class="lead-relation"
              >
                <div class="w-100 d-flex">
                  <div class="w-50">
                    <h4 class="mb-4">
                      <fa-icon
                        :icon="['fas', 'users']"
                        class="text-primary mr-2"
                      />
                      Contactos relacionados
                    </h4>
                  </div>
                  <div class="w-25">
                    <a
                      class="solicitud-btn"
                      @click="GoLeadNew()"
                    >
                      <fa-icon
                        :icon="['fas', 'plus']"
                        class="text-primary edit-ico mr-2"
                      />Agregar nuevo
                    </a>
                  </div>
                  <div class="w-25">
                    <a
                      class="solicitud-btn"
                      @click="InfoNewClient('add')"
                    >
                      <fa-icon
                        :icon="['fas', 'plus']"
                        class="text-primary edit-ico mr-2"
                      />Agregar existente
                    </a>
                  </div>
                </div>
                <div class="form-row w-100">
                  <b-table
                    :items="contactosrelacionados"
                    :fields="ClientRelaFields"
                    :busy="loadingLeads"
                    :tbody-tr-class="rowClassrequest"
                    thead-class="rowClassrequest2"
                    @row-clicked="onRowClicked"
                  >
                    <template #table-busy>
                      <div class="d-flex h-100">
                        <div class="text-center text-primary pa-5 mx-auto h-100">
                          <b-spinner class="align-middle" />
                          <strong>Cargando...</strong>
                        </div>
                      </div>
                    </template>
                    <template #cell(lead_related_details)="{ value }">
                      {{ getlead_details(value) }}
                    </template>
                    <template #cell(actions)="{ item }">
                      <div class="d-flex justify-content-start">
                        <button
                          class="circle bg-white shadow-sm border p-3"
                          title="Ir al contacto"
                          @click="gorelationcontacto(item)"
                        >
                          <fa-icon
                            :icon="['fas', 'share']"
                            class="text-primary"
                            style="font-size: 0.9rem"
                          />
                        </button>
                        <button
                          class="circle bg-white shadow-sm border p-3 ml-2"
                          title="Editar"
                          @click.prevent="editrelationshow(item)"
                        >
                          <fa-icon
                            :icon="['fas', 'edit']"
                            class="text-edit"
                            style="font-size: 0.9rem"
                          />
                        </button>
                        <button
                          v-if="user.is_superuser"
                          class="circle bg-white shadow-sm border p-3 ml-2"
                          title="Eliminar Relacion"
                          @click.prevent="deleteRelationWithContact(item)"
                        >
                          <fa-icon
                            :icon="['fas', 'trash-alt']"
                            class="text-danger"
                            style="font-size: 0.9rem"
                          />
                        </button>
                      </div>
                    </template>
                  </b-table>
                </div>
              </form>
            </div>
          </div>

          <chart-client
            class="lead-relation"
            :idlead="Leads.id"
            :idrequest="Leads.id"
          />
        </div>
      </div>
      <request-product-modal-edit
        v-if="editProduct"
        :dataproduct="ProductsRequest"
        @hidde="editProduct = false"
        @save-lead="onSaveProductEdit"
        @cancel-lead="editProduct = false"
      />
    </div>
    <div
      v-show="content === 'new'"
      id="editar"
    >
      <div class="d-flex justify-content-between">
        <span
          v-if="!leadrelation"
          class="text-base pointer"
          @click="BackClient"
        >
          <fa-icon
            :icon="['fas', 'arrow-left']"
            class="text-primary return"
          />
          <b>Regresar a Clientes</b>
        </span>
        <span
          v-if="leadrelation"
          class="text-base pointer"
          @click="content = 'edit'"
        >
          <fa-icon
            :icon="['fas', 'arrow-left']"
            class="text-primary return"
          />
          <b>Volver</b>
        </span>
      </div>
      <div class="row g-4 margin-text">
        <div class="col-lg-7 col-12 pl-0 mb-3">
          <client-form-new
            ref="componentnew"
            :idlead="leadrelation"
            viewproduct
            @SaveNewClientGod="NewClientSave"
          />
        </div>
      </div>
    </div>
    <div
      v-show="content === 'relation'"
      id="editar"
    >
      <div class="d-flex justify-content-between">
        <span
          v-if="!leadrelation"
          class="text-base pointer"
          @click="BackClient"
        >
          <fa-icon
            :icon="['fas', 'arrow-left']"
            class="text-primary return"
          />
          <b>Regresar a Leads</b>
        </span>
        <span
          v-if="leadrelation"
          class="text-base pointer"
          @click="content = 'edit'"
        >
          <fa-icon
            :icon="['fas', 'arrow-left']"
            class="text-primary return"
          />
          <b>Volver</b>
        </span>
      </div>
      <div class="row g-4 margin-text">
        <div class="col-lg-7 col-12 pl-0 mb-3">
          <client-form-new-related
            ref="componentnew"
            leadvalue
            :leadsedit="Leads"
            :idlead="leadrelation"
            @SaveNewClientGod="NewClientSaveRelation"
          />
        </div>
      </div>
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
          Se han guardado los cambios
        </h3>
      </div>
      <!-- <p class="my-4 text-base">
        Al darle click al botón, volverás automáticamente a la pestaña de “Contactos”.
      </p> -->
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4"
          variant="primary"
          @click="closeRequestAlertModal"
        >
          ¡Entendido!
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-alert2b"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h3 class="text-base title-text">
          Se ha registrado el nuevo Lead relacionado
        </h3>
      </div>
      <!-- <p class="my-4 text-base">Al darle click al botón, volverás automáticamente a la pestaña de “Contactos”.</p> -->
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4"
          variant="primary"
          @click="closeRequestAlertModal2b"
        >
          ¡Entendido!
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-alert2"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h3 class="text-base title-text">
          Se ha registrado el nuevo cliente
        </h3>
      </div>
      <!-- <p class="my-4 text-base">
        Al darle click al botón, volverás automáticamente a la pestaña de “Contactos”.
      </p> -->
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4"
          variant="primary"
          @click="closeRequestAlertModal2"
        >
          ¡Entendido!
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-alert6"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h3 class="text-base title-text">
          Se ha borrado el cliente correctamente
        </h3>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4"
          variant="danger"
          @click="closeRequestAlertModal6"
        >
          ¡Entendido!
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-alert9"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h3 class="text-base title-text">
          Se ha borrado el producto correctamente
        </h3>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4"
          variant="danger"
          @click="closeRequestAlertModal9"
        >
          ¡Entendido!
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-alert4"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h3 class="text-base title-text">
          Se ha guardado la información del producto
        </h3>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4"
          variant="primary"
          @click="closeRequestAlertModal4"
        >
          ¡Entendido!
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-alert7"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h3 class="text-base title-text">
          El registro de documentos fue exitoso
        </h3>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4"
          variant="primary"
          @click="closeRequestAlertModal7"
        >
          ¡Entendido!
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-alert8"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h3 class="text-base title-text">
          Se elimino el documento correctamente
        </h3>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4"
          variant="danger"
          @click="closeRequestAlertModal8"
        >
          ¡Entendido!
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-update-relation"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <section class="ftco-section">
        <div class="form-row w-100 d-flex justify-content-center mt-4">
          <div class="form-group-relation">
            <label
              class="text-base"
              for="name"
            >Por favor Modifique la relación con el contacto :</label>
            <input
              id="email"
              v-model="relation.type"
              placeholder=""
              class="form-control form-input mt-3"
              type="text"
            >
            <b-button
              class="text-white p-2 px-3 mt-3"
              size="sm"
              variant="danger"
              @click="hideRelationModal()"
            >
              Cancelar
            </b-button>
            <b-button
              class="text-white p-2 px-3 mt-3 ml-4"
              size="sm"
              variant="primary"
              @click="RelationLead()"
            >
              Modificar
            </b-button>
          </div>
        </div>
      </section>
    </b-modal>
    <b-modal
      ref="modal-alert10"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h3 class="text-base title-text">
          Se ha Eliminado la Relacion con el contacto correctamente
        </h3>
      </div>
      <div class="text-right">
        <b-button
          class="mt-3"
          variant="outline-danger"
          block
          @click="closeRequestAlertModal10"
        >
          ¡Entendido!
        </b-button>
      </div>
    </b-modal>
    <reasignar-product-request
      v-if="modalreasigproduct"
      :loading="loading"
      @hidde="onCloseModal"
      @cancel-lead="onCloseModal"
      @UpdateContact="UpdateContactNewRequest"
    />
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import _ from 'lodash'
import Session from '@/mixins/auth'
import SModal from '@/components/base/SModalDocuments.vue'
import ClientForm from '@/components/ClientForm.vue'
import ClientFormNew from '@/components/ClientFormNew.vue'
import ClientFormNewRelated from '@/components/ClientFormNewRelated.vue'
import HistoryForm from '@/components/HistoryForm.vue'
import DownloadCsv from '~/components/DownloadCsv.vue'
import leadsStaticVars from '~/static/leadsStaticVars.json'
import SToolBar from '~/components/base/SToolBar.vue'
import RequestProductModalEdit from '~/components/RequestProductModalEdit.vue'
import LeadsMerge from '~/components/LeadsMerge.vue'
import ReasignarProductRequest from '~/components/AsignRelationContact.vue'
import LeadsMergeSelect from '~/components/LeadsMergeSelect.vue'
import productscl from '~/static/productsgroup.json'
import productsmx from '~/static/productsgroupmx.json'
import states from '~/static/states.json'
import companiescl from '~/static/companies.json'
import companiesmx from '~/static/companiesmx.json'
import formatRUT from '~/helpers/formatRUT.js'
import ChartClient from '@/components/dashboard/chartclient'
export default {
  name: 'Clientes',
  components: {
    ClientForm,
    ClientFormNew,
    HistoryForm,
    SToolBar,
    SModal,
    RequestProductModalEdit,
    DownloadCsv,
    LeadsMerge,
    LeadsMergeSelect,
    ReasignarProductRequest,
    ClientFormNewRelated,
    ChartClient
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
      page: 1,
      pages: 1,
      totalRows: 1,
      SearchProduct: '',
      modaldocuments: false,
      documentsproducts: [],
      modalreasigproduct: false,
      contactosrelacionados: [],
      ClientRelaFields: [
        {
          key: 'lead_related_details',
          label: 'Contacto',
          sortable: false
        },
        {
          key: 'relation_type',
          label: 'Tipo Relación',
          sortable: false
        },
        {
          key: 'actions',
          label: 'Acciones'
        }
      ],
      leadrelation: 0,
      rut: '',
      search: '',
      states,
      searchrut: false,
      sortBy: '',
      lead: {},
      relation: {
        type: '',
        id: '',
        lead_related: '',
        lead_to_relate: ''
      },
      Leads: [],
      editProduct: false,
      history: {},
      solicitudes: [],
      backclientrequest: 'client',
      idrequest: '',
      companies: [],
      productos: [],
      documentsFields: [
        {
          key: 'title',
          label: 'Titulo',
          sortable: false
        },
        {
          key: 'document',
          label: 'Documento',
          sortable: false
        },
        {
          key: 'created_at',
          label: 'Fecha',
          sortable: false
        },
        {
          key: 'actions',
          label: 'Acciones'
        }
      ],
      idedit: '',
      loading: true,
      loadingClient: true,
      Lines: [
        { value: 'asistencias', text: 'Asistencia' },
        { value: 'garantia', text: 'Garantia' },
        { value: 'generales', text: 'Generales' },
        { value: 'vida', text: 'Vida' },
        { value: 'colectivo_vida', text: 'Colectivo vida' }
      ],
      fields: leadsStaticVars.tableFieldsClient,
      optionProducts: {},
      products: {},
      leadGeneralInfoCopy: null,
      leadProductsCopy: null,
      clientidnew: '',
      leadDocumentsCopy: null,
      newLeadId: null,
      statesCopy: null,
      prioritiesCopy: null,
      productid: '',
      requestid: '',
      idlead: '',
      requestval: true,
      modal: false,
      sortDesc: false,
      option: 'historial',
      content: 'list',
      selected: null,
      icon: 'sort-down',
      expand: false,
      onlyproduct: false,
      url: './editar.vue',
      version: process.env.version,
      solicituddetailsinfo: [],
      productdetailsinfo: [],
      leadsmerge: {},
      types_payment: [],
      types_payment_cl: [
        { valuepayment: 'pac_activo', text: 'PAC - Activo' },
        { valuepayment: 'pac_no_activo', text: 'PAC - No activo' },
        { valuepayment: 'contado', text: 'Contado' },
        { valuepayment: 'aviso_de_cobranza', text: 'Aviso de cobranza' },
        { valuepayment: 'pat_activo', text: 'PAT - Activo' },
        { valuepayment: 'pat_no_activo', text: 'PAT - No activo' }
      ],
      types_payment_mx: [
        { valuepayment: 'mensual', text: 'Mensual' },
        { valuepayment: 'trimestral', text: 'Trimestral' },
        { valuepayment: 'semestral', text: 'Semestral' },
        { valuepayment: 'anual', text: 'Anual' }
      ],
      payment_day: [
        { id: '5', text: '5 Dias' },
        { id: '10', text: '10 Dias' },
        { id: '15', text: '15 Dias' },
        { id: '20', text: '20 Dias' },
        { id: '25', text: '25 Dias' }
      ],
      renewable: [
        { id: 'renovable', text: 'Renovable' },
        { id: 'no_renovable', text: 'No renovable' },
        { id: 'extension_fecha', text: 'Extensión fecha' }
      ],
      productfields: [
        {
          key: 'name',
          label: 'Producto',
          sortable: true,
          class: 'pl-4'
        },
        {
          key: 'product_type',
          label: 'Tipo',
          sortable: true
        },
        {
          key: 'nro_poliza',
          label: 'N° de Póliza',
          sortable: true
        },
        {
          key: 'endorsement_info',
          label: 'N Endoso',
          sortable: true
        },
        {
          key: 'fecha_inicio_vigencia',
          label: 'Inicio de vigencia',
          sortable: true
        },
        {
          key: 'fecha_termino_vigencia',
          label: 'Fin de vigencia',
          sortable: true
        },
        {
          key: 'state',
          label: 'Estado de póliza',
          sortable: true
        },
        {
          key: 'actions',
          label: 'Acciones'
        }
      ],
      solicitudFields: [
        {
          key: 'request_type',
          label: 'Tipo de solicitud',
          sortable: false
        },
        {
          key: 'created_at',
          label: 'Fecha',
          sortable: false
        },
        {
          key: 'product_interest',
          label: 'Producto',
          sortable: false
        },
        {
          key: 'lead_details',
          label: 'Solicitante',
          sortable: false
        },
        {
          key: 'state',
          label: 'Estado',
          sortable: false
        },
        {
          key: 'user',
          label: 'Ejecutivo',
          sortable: true
        }
      ],
      productdetail: [
        {
          value: 'Garantía',
          text: 'Línea de producto'
        },
        {
          value: 'Garantía',
          text: 'Producto'
        },
        {
          value: 'Orsan',
          text: 'Compañia'
        },
        {
          value: '5759',
          text: 'Número de póliza'
        },
        {
          value: '29,04',
          text: 'Prima'
        },
        {
          value: '26/08/2022',
          text: 'Fecha de emision'
        },
        {
          value: '25/08/2022',
          text: 'Inicio Vigencia'
        },
        {
          value: '10/05/2023',
          text: 'Término Vigencia'
        },
        {
          value: 'No',
          text: 'Renovable'
        },
        {
          value: 'Contado',
          text: 'Tipo de pago'
        },
        {
          value: '3.78',
          text: 'Comisión'
        },
        {
          value: '3.78',
          text: 'Comisión final'
        },
        {
          value: 'alvaro@simplee.cl',
          text: 'Ejecutivo a cargo'
        },
        {
          value: 'No hay',
          text: 'Descripción'
        },
        {
          value: 'Ver Documentos',
          text: 'Documentos'
        }
      ],
      typeRequest: [
        {
          value: 'alianza_comercial',
          name: 'Alianza comercial'
        },
        {
          value: 'solicitud_cotizacion',
          name: 'Cotización'
        },
        {
          value: 'cancelacion_o_anulacion_de_poliza',
          name: 'Cancelación o anulación de políza'
        },
        {
          value: 'denuncia_siniestro',
          name: 'Siniestro'
        },
        {
          value: 'endosos',
          name: 'Endosos'
        },
        {
          value: 'renovacion',
          name: 'Renovación'
        },
        {
          value: 'soporte',
          name: 'Soporte'
        },
        {
          value: 'denuncia_siniestro',
          name: 'Denuncia siniestro'
        },
        {
          value: 'solicitud_informacion_productos',
          name: 'Info Productos'
        }
      ],
      solicitudetail: [
        {
          text: 'Tipo de Solicitud',
          campo: 'request_type'
        },
        {
          text: 'Producto',
          campo: 'product_interest'
        },
        {
          text: 'N° de póliza',
          campo: 'nro_poliza'
        },
        {
          text: 'Estado',
          campo: 'state'
        },
        {
          text: 'Canal',
          campo: 'channel'
        },
        {
          text: 'Prioridad',
          campo: 'priorities_scores'
        },
        {
          text: 'Comentario',
          campo: 'comment'
        }
      ],
      productdetails: [
        {
          text: 'Linea',
          campo: 'line'
        },
        {
          text: 'Grupo Producto',
          campo: 'group'
        },
        {
          text: 'Producto',
          campo: 'name'
        },
        {
          text: 'Compañia',
          campo: 'company'
        },
        {
          text: 'Numero póliza',
          campo: 'nro_poliza'
        },
        {
          text: 'Prima',
          campo: 'prima'
        },
        {
          text: 'Fecha emisión',
          campo: 'emited_date'
        },
        {
          text: 'Fecha inicio vigencia',
          campo: 'fecha_inicio_vigencia'
        },
        {
          text: 'Fecha termino vigencia',
          campo: 'fecha_termino_vigencia'
        },
        {
          text: 'Renovable',
          campo: 'renewable'
        },
        {
          text: 'Tipo de pago',
          campo: 'tipo_de_pago'
        },
        {
          text: 'Aviso de cobro',
          campo: 'payment_day'
        },
        {
          text: 'Comisión',
          campo: 'comision'
        },
        {
          text: 'Comisión final',
          campo: 'comision_final'
        },
        {
          text: 'Ejecutivo a cargo',
          campo: 'user'
        },
        {
          text: 'Descripción',
          campo: 'description'
        }
      ],
      groupscl: [
        { value: 'asistencias', text: 'Asistencias' },
        { value: 'diagnostico_de_riesgo', text: 'Diagnostico De riesgo' },
        {
          value: 'seguro_de_accidentes_personales',
          text: 'Seguro De Accidentes Personales'
        },
        { value: 'seguro_de_accidentes_personales_digitales', text: 'Seguro De Accidentes Personales Digitales' },
        {
          value: 'seguro_de_responsabilidad_civil',
          text: 'Seguro De Responsabilidad Civil'
        },
        { value: 'seguro_de_responsabilidad_civil_digital', text: 'Seguro De Responsabilidad Civil Digital' },
        {
          value: 'seguros_para_la_ingenieria',
          text: 'Seguro Para La Ingeneria'
        },
        { value: 'seguro_de_vehiculos', text: 'Seguro De Vehiculos' },
        {
          value: 'seguro_de_incendio_sismo_y_robo',
          text: 'Seguro De Incendio, Sismo Y Robo'
        },
        { value: 'seguro_de_incendio_sismo_y_robo_digital', text: 'Seguro De Incendio, Sismo Y Robo Digital' },
        {
          value: 'seguro_de_transporte_y_carga',
          text: 'Seguro De Transporte Y Carga'
        },
        { value: 'otros_seguros', text: 'Otros Seguros' },
        {
          value: 'seguro_colectivo_de_salud',
          text: 'Seguros de Salud'
        },
        { value: 'seguro_de_garantia', text: 'Seguro De Garantia (No valído)' },
        { value: 'seguro_de_garantia_digital_publica', text: 'Seguro de Garantia Digital Publica' },
        { value: 'seguro_de_garantia_digital_privada', text: 'Seguro De Garantia Digital Privada' },
        { value: 'seguro_de_garantia_publica', text: 'Seguro De Garantia Publica' },
        { value: 'seguro_de_garantia_privada', text: 'Seguro De Garantia Privada' },
        { value: 'seguro_de_garantia_fondos', text: 'Seguro De Garantia Fondos' },
        { value: 'seguro_de_garantia_creditos', text: 'Seguro De Garantia Creditos' },
      ],
      groupsmx: [
        { value: 'asistencias', text: 'Asistencias' },
        {
          value: 'seguro_de_responsabilidad_civil',
          text: 'Seguro De Responsabilidad Civil'
        },
        { value: 'seguro_de_danos', text: 'Seguro de Daños' },
        {
          value: 'seguro_de_transporte_y_carga',
          text: 'Seguro de Transporte de Mercancías'
        },
        { value: 'seguro_de_vehiculos', text: 'Seguro de Vehículos' },
        {
          value: 'seguro_de_proteccion_cibernetica',
          text: 'Seguro de Protección Cibernética'
        },
        { value: 'otros_seguros', text: 'Otros Seguros' },
        {
          value: 'seguro_colectivo_de_gastos_medicos_mayores',
          text: 'Seguros de Salud'
        },
        { value: 'affinity', text: 'Seguros para Personas' }
      ],
      groups: [],
      leadselect: [
        'Reinaldo Soto',
        'Carla Quintanilla',
        'Álvaro Rojas',
        'Francisca Ahumada'
      ],
      showSelected: false
    }
  },
  computed: {
    ...mapState(['leadsFilters', 'leadFromSocket']),
    ...mapState('leads', [
      'items',
      'users',
      'channels',
      'leadsCsv',
      'leadsCsvProgress',
      'loadingCsv',
      'loadingLeads',
      'selectedClients'
    ]),
    ...mapState('localStorage', ['user', 'userPermissions']),
    sort () {
      const { sortBy, sortDesc } = this
      const field = sortBy === 'created_at' ? 'date' : sortBy
      return sortDesc ? `-${field}` : field
    },
    urlParams () {
      return {
        sort_by: this.sort,
        search: this.leadsFilters.search,
        tags: this.leadsFilters.tags,
        searchrut: this.searchrut,
        rut: this.rut,
        user: this.leadsFilters.id,
        start: this.leadsFilters.startDate,
        end: this.leadsFilters.endDate
      }
    },
    // areClientsSelected () {
    //   return this.selectedClients.length > 0
    // },
    fieldsWithSelected () {
      if (this.showSelected) {
        return [{ label: '', key: 'selected' }, ...this.fields]
      }
      return this.fields
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
    }
  },
  created () {
    if (process.env.version === 'CL') {
      this.types_payment = this.types_payment_cl
      this.companies = companiescl
      this.groups = this.groupscl
      this.products = productscl
    } else {
      this.types_payment = this.types_payment_mx
      this.companies = companiesmx
      this.groups = this.groupsmx
      this.products = productsmx
    }
    this.optionProducts = Object.values(this.products).reduce(
      (acc, curr) => [...acc, ...curr],
      []
    )
    const data = this.$route.query?.id
    const idrequest = this.$route.query?.idrequest
    const sitio = this.$route.query?.sitio
    if (sitio) {
      this.option = sitio
    }
    if (data && idrequest) {
      this.backclientrequest = 'request'
      this.idrequest = idrequest
      this.openContent2(data)
    } else if (data && !idrequest) {
      this.openContent2(data)
    } else {
      this.getLeads()
      this.prueba()
    }
  },
  beforeDestroy () {
    this.setLoadingLeads(false)
  },
  methods: {
    ...mapMutations(['setFilters']),
    ...mapMutations('leads', [
      'clearCsvInfo',
      'setLoadingLeads',
      'onselectedClients'
    ]),
    ...mapActions('leads', ['updateLeads', 'deleteLead']),
    formatRUT,
    ...mapActions(['getCsvLeads']),
    async prueba () {
      try {
        const { data } = await this.$simpleeApi.get('/request/?lead=12861')
        console.log(data)
      } catch (error) {
        // store.commit('setAlertMessage', error.response.data)
      }
    },
    debouncedSearch: _.debounce(function (e) {
      this.optionEditClient('productos')
    }, 750),
    async getLeads (page) {
      this.page = page
      this.setLoadingLeads(true)
      const fieldss = `id,name,last_name,razon_social,rut,email,phone,last_request_creation,created_at,user_details`
      if (this.onlyproduct) {
        try {
          const res = await this.$simpleeApi.get('/lead/?clientes', {
            params: { page, ...this.urlParams, fields: fieldss }
          })
          this.totalRows = res.data.count
          this.updateLeads({ payload: res.data.results, sort: false })
          this.page = page
        } catch (error) {
          this.$store.commit('setAlertMessage', error.response.data)
        }
      } else {
        try {
          const res = await this.$simpleeApi.get('/lead/?clientes', {
            params: { page, ...this.urlParams, fields: fieldss }
          })
          this.totalRows = res.data.count
          this.updateLeads({ payload: res.data.results, sort: false })
          this.page = page
        } catch (error) {
          this.$store.commit('setAlertMessage', error.response.data)
        }
      }
      this.setLoadingLeads(false)
    },
    async getLeadById (queries) {
      if (queries.id) {
        try {
          const { data } = await this.$simpleeApi.get(`/lead/${queries.id}/`)
          console.log(data)
          this.Leads = data
          if (this.option === 'historial') {
            this.optionEditClient('historial')
          } else if (this.option === 'productos') {
            this.optionEditClient('productos')
          } else if (this.option === 'solicitudes') {
            this.optionEditClient('solicitudes')
          } else {
            this.optionEditClient('documentos')
          }
          if (this.$store.state.localStorage.user.role !== 'EXT_KAM') {
            this.GetRelationContacto(this.Leads.id)
          }
          // this.openExistingLead(data)
        } catch (error) {
          this.$store.commit('setAlertMessage', error.response.data)
        }
      }
    },
    GoLeadNew () {
      this.leadrelation = this.Leads.id
      this.content = 'relation'
    },
    async GetRelationContacto (id) {
      try {
        const { data } = await this.$simpleeApi.get(`/related_lead/?lead_id=${id}`)
        const payload = data.results
        payload.forEach((item) => {
          if (item.lead_related === id) {
            item.lead_related_details = item.lead_to_relate_details
          }
        })
        //console.log('ver todos los relations', payload)
        this.contactosrelacionados = payload
      } catch (error) {
        this.$store.commit('setAlertMessage', error.response.data)
      }
    },
    onCloseModal () {
      this.modalreasigproduct = false
    },
    async RelationLead () {
      this.$nuxt.$loading.start()
      const payload = {
        relation_type: this.relation.type,
        lead_to_relate: this.relation.lead_to_relate,
        lead_related: this.relation.lead_related
      }
      try {
        await this.$simpleeApi.put(
          `/related_lead/${this.relation.id}/`,
          payload
        )
        this.$refs['modal-update-relation'].hide()
        this.$refs['modal-alert'].show()
        if (this.$store.state.localStorage.user.role !== 'EXT_KAM') {
          this.GetRelationContacto(this.Leads.id)
        }
      } catch (error) {
        this.$store.commit('setAlertMessage', error.response.data)
      }
      this.$nuxt.$loading.finish()
    },
    editrelationshow (value) {
      this.relation.type = value.relation_type
      this.relation.lead_to_relate = value.lead_to_relate
      this.relation.lead_related = value.lead_related
      this.relation.id = value.id
      this.$refs['modal-update-relation'].show()
    },
    deleteRelationWithContact (value) {
      this.$bvModal
        .msgBoxConfirm(`¿Desea eliminar la Relacion con ${value.lead_related_details.name} ${value.lead_related_details.last_name} ?`, {
          title: 'Confirmar',
          titleClass: 'mdtitle',
          size: 'md',
          buttonSize: 'md',
          cancelVariant: 'btn text-white p-2 px-3 btn-secondary',
          okVariant: 'btn text-white p-2 px-3 btn-danger',
          okTitle: 'Si',
          cancelTitle: 'No',
          contentClass: 'border-0 radius',
          bodyClass: 'pxmodal',
          headerClass: 'pdmodal border-bottom-0',
          footerClass: 'pdmodal border-top-0',
          centered: true
        })
        .then((confirmValue) => {
          if (confirmValue) {
            this.DeleteRelation(value.id)
          }
        })
    },
    async DeleteRelation (id) {
      try {
        await this.$simpleeApi.delete(`/related_lead/${id}/`)
        this.$refs['modal-alert10'].show()
        if (this.$store.state.localStorage.user.role !== 'EXT_KAM') {
          setTimeout(() => this.GetRelationContacto(this.Leads.id), 500)
        }

      } catch (error) {
        console.log({ error })
        this.$store.commit('setAlertMessage', error.response.data)
      }
    },
    hideRelationModal () {
      this.$refs['modal-update-relation'].hide()
    },
    InfoNewClient () {
      this.modalreasigproduct = true
    },
    async UpdateContactNewRequest (value) {
      console.log(value)
      this.$nuxt.$loading.start()
      const payload = {
        related_lead: {
          lead_related: value.id,
          relation_type: value.type
        }
      }
      try {
        await this.$simpleeApi.put(`/lead/${this.Leads.id}/`, payload)
        this.modalreasigproduct = false
        this.$refs['modal-alert'].show()
        if (this.$store.state.localStorage.user.role !== 'EXT_KAM') {
          this.GetRelationContacto(this.Leads.id)
        }
      } catch (error) {
        this.$store.commit('setAlertMessage', error.response.data)
      }
      this.$nuxt.$loading.finish()
    },
    getlead_details (value) {
      if (value.name && value.last_name) {
        return value.name + ' ' + value.last_name
      } else if (value.email) {
        return value.email
      } else if (value.razon_social) {
        return value.razon_social
      } else {
        return 'Sin nombre'
      }
    },
    async deleterelation (data) {
      this.$nuxt.$loading.start()
      const payload = {
        related_lead: {
          lead_related: 0,
          relation_type: null
        }
      }
      try {
        await this.$simpleeApi.put(`/lead/${data.lead_related}/`, payload)
        this.$refs['modal-alert'].show()
        if (this.$store.state.localStorage.user.role !== 'EXT_KAM') {
          this.GetRelationContacto(this.Leads.id)
        }
      } catch (error) {
        this.$store.commit('setAlertMessage', error.response.data)
      }
      this.$nuxt.$loading.finish()
    },
    gorelationcontacto (data) {
      if (data.lead_related === this.Leads.id) {
        const query = {
          id: data.lead_to_relate
        }
        if (data.lead_related_details.product_count != null) {
          this.$router.push({ path: 'clientes', query })
        } else {
          this.$router.push({ path: 'leadsnew', query })
        }
      } else {
        const query = {
          id: data.lead_related
        }
        if (data.lead_related_details.product_count != null) {
          this.$router.push({ path: 'clientes', query })
        } else {
          this.$router.push({ path: 'leadsnew', query })
        }
      }
    },
    async showmodaldocuments (id) {
      this.requestid = null
      this.idlead = null
      this.requestval = false
      if (id) {
        try {
          const { data } = await this.$simpleeApi.get(
            `/product/${id}/document`
          )
          this.documentsproducts = data.results
          this.modaldocuments = true
          // this.openExistingLead(data)
        } catch (error) {
          this.$store.commit('setAlertMessage', error.response.data)
        }
      }
    },
    async showmodaldocuments2 (id) {
      this.idlead = null
      this.productid = null
      this.requestval = false
      if (id) {
        try {
          const { data } = await this.$simpleeApi.get(
            `/request/${id}/document`
          )
          this.documentsproducts = data.results
          this.modaldocuments = true
          // this.openExistingLead(data)
        } catch (error) {
          this.$store.commit('setAlertMessage', error.response.data)
        }
      }
    },
    async showmodaldocuments3 (id) {
      this.requestid = null
      this.productid = null
      this.requestval = true
      if (id) {
        try {
          const { data } = await this.$simpleeApi.get(`/lead/${id}/document`)
          this.documentsproducts = data.results
          this.modaldocuments = true
          // this.openExistingLead(data)
        } catch (error) {
          this.$store.commit('setAlertMessage', error.response.data)
        }
      }
    },
    getLeadDate (leadDate) {
      if (leadDate) {
        const createdAt = new Date(leadDate).toLocaleString('en-GB')
        const [date, hour] = createdAt.split(',')
        return `${date}\n${hour}`
      } else {
        return 'No tiene'
      }
    },
    getLeadChannel (channel) {
      const channelObject = this.channels.find(({ id }) => id === channel)
      if (channelObject) {
        return channelObject.name
      }
      return 'Canal no creado'
    },
    getLeadStatus (state) {
      return state
        ? leadsStaticVars.detailedStates[state]
        : leadsStaticVars.detailedStates.sin_estado
    },
    getLeadStatus2 (state) {
      const requestObject = this.states.find(({ value }) => value === state)
      if (requestObject) {
        return requestObject.text
      }
      return 'No Asignado'
    },
    GetUserStatusKam (user) {
      if (user) {
        if (this.user.id == user || this.user.role !== 'KAM') {
          const leadUser = this.users.find(({ id }) => user === id)
          return leadUser.first_name || leadUser.email.split('@')[0]
        } else {
          return 'Otro ejecutivo'
        }
      }
      return 'Sin asignar'
    },
    getLeadUser (user) {
      if (user) {
        const leadUser = this.users.find(({ id }) => user === id)
        return leadUser.first_name || leadUser.email.split('@')[0]
      }
      return 'Sin asignar'
    },
    GetFormateProduct (valor, key) {
      if (key === 'state') {
        const requestObject = this.states.find(({ value }) => value === valor)
        if (requestObject) {
          return requestObject.text
        }
        return 'Sin estado'
      } else if (key === 'request_type') {
        const requestObject = this.typeRequest.find(
          ({ value }) => value === valor
        )
        if (requestObject) {
          return requestObject.name
        }
        return 'No Asignado'
      } else if (key === 'product_interest') {
        const requestObject = this.optionProducts.find(
          ({ value }) => value === valor
        )
        if (requestObject) {
          return requestObject.text
        }
        return 'No tiene'
      } else if (key === 'channel') {
        const channelObject = this.channels.find(({ id }) => id === valor)
        if (channelObject) {
          return channelObject.name
        }
        return 'Canal no creado'
      } else {
        return valor
      }
    },
    GetFormateProduct2 (valor, key) {
      if (key === 'line') {
        if (valor) {
          const requestObject = this.Lines.find(({ value }) => value === valor)
          if (requestObject) {
            return requestObject.text
          }
          return 'Sin estado'
        } else {
          return ''
        }
      } else if (key === 'name') {
        if (valor) {
          const requestObject = this.optionProducts.find(
            ({ value }) => value === valor
          )
          if (requestObject) {
            return requestObject.text
          }
          return 'No tiene'
        } else {
          return ''
        }
      } else if (key === 'group') {
        if (valor) {
          const requestObject = this.groups.find(
            ({ value }) => value === valor
          )
          if (requestObject) {
            return requestObject.text
          }
          return 'No tiene'
        } else {
          return ''
        }
      } else if (key === 'company') {
        if (valor) {
          return this.companies.reduce(
            (a, { text, value }) => ({ ...a, [value]: text }),
            {}
          )[valor]
        } else {
          return ''
        }
      } else if (key === 'tipo_de_pago') {
        if (valor) {
          const channelObject = this.types_payment.find(
            ({ valuepayment }) => valuepayment === valor
          )
          if (channelObject) {
            return channelObject.text
          }
          return ''
        } else {
          return ''
        }
      } else if (key === 'emited_date') {
        if (valor) {
          return valor.split('-').reverse().join('/')
        } else {
          return ''
        }
      } else if (key === 'fecha_inicio_vigencia') {
        if (valor) {
          return valor.split('-').reverse().join('/')
        } else {
          return ''
        }
      } else if (key === 'fecha_termino_vigencia') {
        if (valor) {
          return valor.split('-').reverse().join('/')
        } else {
          return ''
        }
      } else if (key === 'payment_day') {
        if (valor) {
          return this.payment_day.reduce(
            (a, { text, id }) => ({ ...a, [id]: text }),
            {}
          )[valor]
        } else {
          return ''
        }
      } else if (key === 'user') {
        if (valor) {
          const leadUser = this.users.find(({ id }) => valor === id)
          return leadUser.first_name || leadUser.email.split('@')[0]
        }
        return 'Sin asignar'
      } else if (key === 'renewable') {
        if (valor) {
          const channelObject = this.renewable.find(({ id }) => id === valor)
          if (channelObject) {
            return channelObject.text
          }
          return ''
        } else {
          return ''
        }
      } else {
        return valor
      }
    },
    deletedocumento (data) {
      const id = data.id
      this.$bvModal
        .msgBoxConfirm('¿Desea eleminar este documento?', {
          title: 'Confirmar',
          titleClass: 'mdtitle',
          size: 'md',
          buttonSize: 'md',
          cancelVariant: 'btn text-white p-2 px-3 btn-secondary',
          okVariant: 'btn text-white p-2 px-3 btn-danger',
          okTitle: 'Si',
          cancelTitle: 'No',
          contentClass: 'border-0 radius',
          bodyClass: 'pxmodal',
          headerClass: 'pdmodal border-bottom-0',
          footerClass: 'pdmodal border-top-0',
          centered: true
        })
        .then((value) => {
          if (value) {
            this.Deletedocument(id)
          }
        })
    },
    async Deletedocument (id) {
      try {
        await this.$simpleeApi.delete(`/lead/${this.Leads.id}/document/${id}/`)
        this.$refs['modal-alert8'].show()
        this.openContent(this.Leads)
      } catch (error) {
        this.$sendErrorPayload({
          payload: id,
          origin: 'lead',
          errorResponse: error.response,
          expectedBehavior: `Deberia borrarse documento del lead ${this.Leads.id}`
        })
      }
    },
    searchConfig (value) {
      if (this.searchrut) {
        this.leadsFilters.search = ''
        this.rut = value
      } else {
        this.leadsFilters.search = value
        this.rut = ''
      }
    },
    async optionEditClient (val) {
      if (val === 'solicitudes') {
        this.setLoadingLeads(true)
        try {
          const res = await this.$simpleeApi.get(
            `/request/?lead=${this.idedit}`
          )
          const results = res.data.results
          for (let i = 0; i < results.length; i++) {
            results[i]._showDetails = false
          }
          this.solicitudes = results
        } catch (error) {
          // store.commit('setAlertMessage', error.response.data)
        }
        setTimeout(() => {
          this.setLoadingLeads(false)
        }, 1000)
        this.option = val
      } else if (val === 'productos') {
        this.setLoadingLeads(true)
        const params = {
          search: this.SearchProduct,
          lead: this.idedit
        }
        try {
          const {
            data: { results, count }
          } = await this.$simpleeApi.get('/product/', { params })
          for (let i = 0; i < results.length; i++) {
            results[i]._showDetails = false
          }
          console.log(results)
          this.productos = results
        } catch (error) {
          // store.commit('setAlertMessage', error.response.data)
        }
        setTimeout(() => {
          this.setLoadingLeads(false)
        }, 1000)
        this.option = val
      } else if (val === 'historial') {
        this.loading = true
        try {
          const res = await this.$simpleeApi.get(
            `/lead_history/?lead__id=${this.idedit}`
          )
          this.history = res.data.results
        } catch (error) {
          // store.commit('setAlertMessage', error.response.data)
        }
        try {
          const res = await this.$simpleeApi.get(
            `/product_history/?lead__id=${this.idedit}`
          )
          this.solicitudes = res.data.results
        } catch (error) {
          // store.commit('setAlertMessage', error.response.data)
        }
        this.option = val
        setTimeout(() => {
          this.loading = false
        }, 1000)
      } else if (val === 'documentos') {
        this.loading = true
        this.documentosleads = await this.$GetDocumentsLeads(this.Leads.id)
        setTimeout(() => {
          this.loading = false
        }, 1000)
        this.option = val
      }
    },
    savedocuments (val) {
      const docsToAdd = val?.filter(d => !d.id) || []
      if (docsToAdd.length > 0) {
        docsToAdd.forEach(async (doc) => {
          if (doc.document64) {
            try {
              await this.$simpleeApi.post(
                `/product/${this.productid}/document/`,
                doc
              )
              this.$refs['modal-alert7'].show()
            } catch (error) {
              this.$sendErrorPayload({
                payload: doc,
                origin: 'producto',
                errorResponse: error.response,
                expectedBehavior: `Deberia agregarse un nuevo documento al producto ${this.productid}`
              })
            }
            this.modaldocuments = false
          }
        })
      }
    },
    savedocuments2 (val) {
      const docsToAdd = val?.filter(d => !d.id) || []
      if (docsToAdd.length > 0) {
        docsToAdd.forEach(async (doc) => {
          if (doc.document64) {
            try {
              await this.$simpleeApi.post(
                `/request/${this.requestid}/document/`,
                doc
              )
              this.$refs['modal-alert7'].show()
            } catch (error) {
              this.$sendErrorPayload({
                payload: doc,
                origin: 'solicitud',
                errorResponse: error.response,
                expectedBehavior: `Deberia agregarse un nuevo documento a la solicitud ${this.requestid}`
              })
            }
            this.modaldocuments = false
          }
        })
      }
    },
    async deletedocuments (id) {
      if (id) {
        try {
          await this.$simpleeApi.delete(
            `/product/${this.productid}/document/${id}/`
          )
          this.$refs['modal-alert8'].show()
        } catch (error) {
          this.$sendErrorPayload({
            payload: id,
            origin: 'producto',
            errorResponse: error.response,
            expectedBehavior: `Deberia borrarse documento al producto ${this.productid}`
          })
        }
      }
    },
    async deletedocuments2 (id) {
      if (id) {
        try {
          await this.$simpleeApi.delete(
            `/request/${this.requestid}/document/${id}/`
          )
          this.$refs['modal-alert8'].show()
        } catch (error) {
          this.$sendErrorPayload({
            payload: id,
            origin: 'solicitud',
            errorResponse: error.response,
            expectedBehavior: `Deberia borrarse documento a la solicitud ${this.requestid}`
          })
        }
      }
    },
    savedocuments3 (val) {
      const docsToAdd = val?.filter(d => !d.id) || []
      if (docsToAdd.length > 0) {
        docsToAdd.forEach(async (doc) => {
          if (doc.document64) {
            try {
              await this.$simpleeApi.post(
                `/lead/${this.Leads.id}/document/`,
                doc
              )
              this.$refs['modal-alert7'].show()
              this.openContent(this.Leads)
            } catch (error) {
              this.$sendErrorPayload({
                payload: doc,
                origin: 'solicitud',
                errorResponse: error.response,
                expectedBehavior: `Deberia agregarse un nuevo documento al lead ${this.Leads.id}`
              })
            }
            this.modaldocuments = false
          }
        })
      }
    },
    async deletedocuments3 (id) {
      console.log(id)
      if (id) {
        try {
          await this.$simpleeApi.delete(
            `/lead/${this.Leads.id}/document/${id}/`
          )
          this.$refs['modal-alert8'].show()
          this.openContent(this.Leads)
        } catch (error) {
          this.$sendErrorPayload({
            payload: id,
            origin: 'lead',
            errorResponse: error.response,
            expectedBehavior: `Deberia borrarse documento al lead ${this.Leads.id}`
          })
        }
      }
    },
    setonlyproduct (valid) {
      this.onlyproduct = valid
    },
    setRut (valid) {
      this.searchrut = valid
    },
    getNumeroEndoso (endoso) {
      if (endoso.endorsement_nro) {
        return endoso.endorsement_nro
      } else {
        return 'No aplica'
      }
    },
    getProductName (key) {
      return Object.values(this.products).reduce(
        (acc, curr) => ({
          ...acc,
          ...curr.reduce((a, { text, value }) => ({ ...a, [value]: text }), {})
        }),
        {}
      )[key]
    },
    editProducts () {
      if (this.editProduct === false) {
        this.editProduct = true
      } else {
        this.editProduct = false
      }
    },
    closeRequestAlertModal () {
      this.$refs['modal-alert'].hide()
    },
    closeRequestAlertModal2 () {
      this.$refs['modal-alert2'].hide()
      this.openContent2(this.clientidnew)
    },
    closeRequestAlertModal2b () {
      this.$refs['modal-alert2b'].hide()
      this.openContent2(this.Leads.id)
    },
    closeRequestAlertModal6 () {
      this.$refs['modal-alert6'].hide()
    },
    closeRequestAlertModal9 () {
      this.$refs['modal-alert9'].hide()
    },
    closeRequestAlertModal10 () {
      this.$refs['modal-alert10'].hide()
    },
    getProductState (val) {
      if (val === 'valid') {
        return 'Vigente'
      }
      if (val === 'canceled') {
        return 'Cancelada'
      }
      if (val === 'canceled_nopay') {
        return 'Cancelada Por No Pago'
      }
      if (val === 'renewed') {
        return 'Renovada'
      }
      if (val === 'rehabilited') {
        return 'Rehabilitada'
      }
    },
    formatWhatsAppNumber (text) {
      const phone = text.replace(/ /g, '')
      return phone.replace('+', '')
    },
    async openContent (data) {
      const dataLead = await this.$simpleeApi.get(`/lead/${data.id}/`)
      const datanew = dataLead.data
      if (this.$store.state.localStorage.user.role !== 'EXT_KAM') {
        this.GetRelationContacto(datanew.id)
      }
      this.loadingClient = true
      const lead = []
      for (const [key, value] of Object.entries(datanew.tags)) {
        console.log(value)
        if (value) {
          lead.push(value.id)
        }
      }
      datanew.tags = lead
      this.Leads = datanew
      this.leadrelation = this.Leads.id
      this.idedit = datanew.id
      if (datanew?.id) {
        const newQuery = { id: datanew.id }
        this.updateLeadIdInQuery(newQuery)
      }
      if (this.$store.state.localStorage.user.role !== 'EXT_KAM') {
        if (!this.option) {
          this.optionEditClient('historial')
        } else {
          this.optionEditClient(this.option)
        }
      } else {
        if (!this.option) {
          this.optionEditClient('solicitudes')
        } else {
          this.optionEditClient('solicitudes')
        }
      }
      setTimeout(() => {
        this.loadingClient = false
      }, 1000)
      this.content = 'edit'
    },
    async openContent2 (id) {
      if (this.$store.state.localStorage.user.role !== 'EXT_KAM') {
        this.GetRelationContacto(id)
      }
      const data = await this.$GetContact(id)
      this.openContent(data)
    },
    updateLeadIdInQuery (query) {
      this.$router.push({ path: 'clientes', query })
    },
    getproductorequest (value) {
      if (value.name) {
        const name = value.name
        return name
      } else {
        return 'Sin producto'
      }
    },
    getUserRequest (value) {
      if (value.email) {
        return value.email
      } else {
        return 'Ninguno'
      }
    },
    async onSaveProductEdit (data) {
      delete data.documents
      await this.$updateProduct(data.id, data)
      this.ProductsRequest = data
      this.$refs['modal-alert4'].show()
      this.editProduct = false
      this.optionEditClient('productos')
    },
    getTypeProductInterest (request) {
      const requestObject = this.optionProducts.find(
        ({ value }) => value === request
      )
      if (requestObject) {
        return requestObject.text
      }
      return 'No tiene'
    },
    Productdetails (data) {
      this.productid = data.id
      const lead = []
      for (const [key, value] of Object.entries(data)) {
        const requestObject = this.productdetails.find(
          ({ campo }) => campo === key
        )
        console.log(key, value)
        if (requestObject) {
          const newlead = {
            value,
            text: requestObject.text,
            key
          }
          lead.push(newlead)
        }
      }
      this.productdetailsinfo = lead
      console.log(lead)
    },
    RequestDetails (data) {
      this.requestid = data.id
      const lead = []
      for (let [key, value] of Object.entries(data)) {
        if (key === 'product_details') {
          if (value) {
            key = 'nro_poliza'
            value = value.nro_poliza
          }
        }
        const requestObject = this.solicitudetail.find(
          ({ campo }) => campo === key
        )
        if (requestObject) {
          if (value) {
            const newlead = {
              value,
              text: requestObject.text,
              key
            }
            lead.push(newlead)
          }
        }
      }
      const ordenlead = []
      for (let i = 0; i < this.solicitudetail.length; i++) {
        const requestObject = lead.find(
          ({ key }) => key === this.solicitudetail[i].campo
        )
        if (requestObject) {
          ordenlead.push(requestObject)
        }
      }
      this.solicituddetailsinfo = ordenlead
      console.log(ordenlead)
    },
    generateCsv (timezone) {
      this.getCsvLeads({
        urlParams: this.urlParams,
        paramsone: 'clientes',
        timezone
      })
    },
    deleteclient (data) {
      const id = data.id
      this.$bvModal
        .msgBoxConfirm('¿Desea eleminar este cliente?', {
          title: 'Confirmar',
          titleClass: 'mdtitle',
          size: 'md',
          buttonSize: 'md',
          cancelVariant: 'btn text-white p-2 px-3 btn-secondary',
          okVariant: 'btn text-white p-2 px-3 btn-danger',
          okTitle: 'Si',
          cancelTitle: 'No',
          contentClass: 'border-0 radius',
          bodyClass: 'pxmodal',
          headerClass: 'pdmodal border-bottom-0',
          footerClass: 'pdmodal border-top-0',
          centered: true
        })
        .then((value) => {
          if (value) {
            this.DeleteClientEnd(id)
          }
        })
    },
    async DeleteClientEnd (id) {
      try {
        await this.$simpleeApi.delete(`/lead/${id}/`)
        this.$refs['modal-alert6'].show()
        setTimeout(() => this.getLeads(this.page), 500)
      } catch (error) {
        console.log({ error })
        this.$store.commit('setAlertMessage', error.response.data)
      }
    },
    DeleteProduct (data) {
      const id = data.id
      console.log(id)
      this.$bvModal
        .msgBoxConfirm('¿Desea eleminar este producto?', {
          title: 'Confirmar',
          titleClass: 'mdtitle',
          size: 'md',
          buttonSize: 'md',
          cancelVariant: 'btn text-white p-2 px-3 btn-secondary',
          okVariant: 'btn text-white p-2 px-3 btn-danger',
          okTitle: 'Si',
          cancelTitle: 'No',
          contentClass: 'border-0 radius',
          bodyClass: 'pxmodal',
          headerClass: 'pdmodal border-bottom-0',
          footerClass: 'pdmodal border-top-0',
          centered: true
        })
        .then((value) => {
          if (value) {
            this.$refs['modal-alert9'].show()
            this.$store.dispatch('DeleteProduct', { id })
            setTimeout(() => this.optionEditClient('productos'), 500)
          }
        })
    },
    CrearRenoEndoso (data) {
      this.$bvModal
        .msgBoxConfirm(
          '¿Esta seguro de crear un endoso o renovación a este producto?',
          {
            title: 'Confirmar',
            titleClass: 'mdtitle',
            size: 'md',
            buttonSize: 'md',
            cancelVariant: 'btn text-white p-2 px-3 btn-secondary',
            okVariant: 'btn text-white p-2 px-3 btn-danger',
            okTitle: 'Si',
            cancelTitle: 'No',
            contentClass: 'border-0 radius',
            bodyClass: 'pxmodal',
            headerClass: 'pdmodal border-bottom-0',
            footerClass: 'pdmodal border-top-0',
            centered: true
          }
        )
        .then((value) => {
          if (value) {
            setTimeout(() => this.PostEndosoRenovacion(data), 500)
          }
        })
    },
    async PostEndosoRenovacion (data) {
      console.log(data)
      if (data.lead_request) {
        const Response = await this.$GetRequest(data.lead_request)
        console.log(Response)
        const requestdinamin = {
          aditional_data: null,
          product_interest: Response.product_interest,
          tags: [],
          product_group: Response.product_group,
          request_type: Response.request_type,
          state: Response.state,
          place: Response.place,
          state_reason: Response.state_reason,
          priority_score: Response.priority_score,
          user: this.$store.state.localStorage.user.id,
          comment: null,
          lead: Response.lead,
          referred: Response.referred,
          referral_code: Response.referral_code,
          quotation_received: Response.quotation_received,
          adjudication_date: Response.adjudication_date,
          quotation_delivered: Response.quotation_delivered,
          campaign_slug: 'desde-clientes'
        }
        const error = await this.$PostRequest(requestdinamin)
        if (error) {
          const query = {
            idrequest: error.id,
            tipo: 'clientes',
            poliza: data.id,
            comeTo: 'productos'
          }
          this.$router.push({ path: 'solicitudes', query })
        }
      } else {
        this.$store.commit('setAlertMessage', {
          error: 'Este producto no tiene solicitud'
        })
      }
    },
    confirmClient () {
      this.$bvModal
        .msgBoxConfirm('¿Esta seguro de hacer estos cambios?', {
          title: 'Confirmar',
          titleClass: 'mdtitle',
          size: 'md',
          buttonSize: 'md',
          cancelVariant: 'btn text-white p-2 px-3 btn-secondary',
          okVariant: 'btn text-white p-2 px-3 btn-primary',
          okTitle: 'Si',
          cancelTitle: 'No',
          contentClass: 'border-0 radius',
          bodyClass: 'pxmodal',
          headerClass: 'pdmodal border-bottom-0',
          footerClass: 'pdmodal border-top-0',
          centered: true
        })
        .then((value) => {
          if (value) {
            setTimeout(() => this.saveClient(), 500)
          }
        })
    },
    getTypeRequest (request) {
      const requestObject = this.typeRequest.find(
        ({ value }) => value === request
      )
      if (requestObject) {
        return requestObject.name
      }
      return 'No Asignado'
    },
    BackClient () {
      this.content = 'list'
      this.getLeads()
    },
    onRowClicked (item) {
      const results = this.solicitudes
      for (let i = 0; i < results.length; i++) {
        if (item.id !== results[i].id) {
          results[i]._showDetails = false
        }
      }
      item._showDetails = !item._showDetails
      this.RequestDetails(item)
    },
    onRowClicked2 (item) {
      const results = this.productos
      for (let i = 0; i < results.length; i++) {
        if (item.id !== results[i].id) {
          results[i]._showDetails = false
        }
      }
      item._showDetails = !item._showDetails
      this.ProductsRequest = item
      this.Productdetails(item)
    },
    closeRequestAlertModal4 () {
      this.$refs['modal-alert4'].hide()
    },
    closeRequestAlertModal7 () {
      this.$refs['modal-alert7'].hide()
    },
    closeRequestAlertModal8 () {
      this.$refs['modal-alert8'].hide()
    },
    saveClient () {
      this.$refs.componenteedit.saveLead()
    },
    saveClientNew () {
      this.$refs.componentnew.saveLead()
    },
    ActClientSave () {
      this.$refs['modal-alert'].show()
    },
    NewClientSave (id) {
      this.clientidnew = id
      this.$refs['modal-alert2'].show()
    },
    NewClientSaveRelation () {
      this.$refs['modal-alert2b'].show()
    },
    viewNew () {
      this.content = 'new'
    },
    getProductDate (product) {
      return product.split('-').reverse().join('/')
    },
    rowClass (item) {
      if (item != null && item.vencida === 'Vencida') {
        return 'vencida'
      }
    },
    onRowSelectedFromTable () {
      // this.onselectedClients(items.map(({ name }) => name))
    },
    onRowSelectedFromModal () {
      // this.onselectedClients(items)
    },
    selectRow ({ row, selected }) {
      if (selected) {
        this.$refs.clientTable.selectRow(row)
      } else {
        this.$refs.clientTable.unselectRow(row)
      }
    },
    mergeClients () {
      this.showSelected = !this.showSelected
      if (!this.showSelected) {
        this.$refs.clientTable.clearSelected()
      }
    },
    MergeLead () {
      this.content = 'merge'
    }
  }
}
</script>
<style lang="scss" scoped>
.newth {
  border-bottom: 3px solid rgba(203, 203, 203, 0.31) !important;
  padding: 30px !important;
}
.margin-card {
  margin-top: 40px;
}
.margin-text {
  margin-top: 20px;
}
.color-base {
  color: #000000;
}
.text-base {
  font-family: "Rubik";
  font-style: normal;
  font-size: 14px;
  line-height: 17px;
  color: #000000;
  margin-bottom: 0px !important;
}
.card-text {
  font-size: 14px;
}
.text-val {
  font-weight: 300;
  line-height: 18px;
  color: #505755;
}
.return-ico {
  width: 30px;
}
.card-client {
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  background-color: #fff;
}
.nav-link {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 35px;
  font-family: "Rubik";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #cbcbcb;
  cursor: pointer;
}
.nav-pills .nav-link.active {
  background-color: transparent;
  color: #000000;
  border-bottom: 4px solid #233348;
}
.form-input {
  border: 1px solid #505755;
  border-radius: 8px;
}
.solicitud-btn {
  padding: 0;
  width: 4.5rem;
  color: #233348;
  cursor: pointer;
  background-color: transparent;
  border: none;
  float: right;
  width: 180px;
  margin-bottom: 20px;
  font-weight: 600;
  color: #00cc99;
}
.filtrar {
  float: left !important;
  width: 140px;
}
.product-btn {
  text-align: center;
  padding: 30px;
}
.btn-new {
  font-size: 14px;
  padding: 8px;
}
.span-sort {
  cursor: pointer;
  float: right;
}
.card-detail {
  align-items: center;
}
.body-detail {
  width: 60%;
}
.div-style {
  padding: 14px 10px;
  border-bottom: 1px solid #cbcbcb !important;
  margin-bottom: 0px !important;
}
.link {
  cursor: pointer;
}
.return {
  cursor: pointer;
}
.pointer {
  cursor: pointer;
}
.new {
  color: #6461ed !important;
}
.pdmodal {
  padding: 2rem !important;
}
.pxmodal {
  padding-left: 2rem !important;
  padding-right: 2rem !important;
}
.radius {
  border-radius: 6px !important;
}
.mdtitle {
  font-size: 24px !important;
  line-height: 28px !important;
}
.loading {
  font-size: 14px;
  opacity: 0.5;
}
.page {
  padding-right: 3em;
}
.title-text {
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
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
.toolbar {
  display: none;
  margin-bottom: 1.5em;
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
.btn-corporativo {
  background-color: #0097a7;
}
.results span {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 14px;
  color: #acacac;
}
.lead-relation {
  padding: 20px;
  margin-top: 20px;
}
.lead-relation h4 {
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #000000;
}
</style>
