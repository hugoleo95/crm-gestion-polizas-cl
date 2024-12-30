<template>
  <div>
    <s-modal
      v-if="modaldocuments"
      :documentsdata="documentsproducts"
      :idlead="Leads.id"
      no-close-on-backdrop
      :requestsi="requestval"
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
          new-btn
          defaults
          optionfilter="client"
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
          </template>
        </s-tool-bar>
      </div>
      <div class="d-flex mb-2 justify-content-end results">
        <span> {{ totalRows }} Resultados</span>
      </div>
      <div class="table-responsive">
        <b-table
          id="table-principal"
          :items="items"
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
          <template #head(rut)>
            <span v-if="version === 'MX'"> Rfc </span>
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
                title="Información del Lead"
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
                title="Eliminar Lead"
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
          <b>Regresar a leads</b>
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
            leadvalue
            :leadsedit="Leads"
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
                :class="['mr-5', { active: option === 'historial' }]"
                @click="optionEditClient('historial')"
              >
                Historial
              </a>
              <a
                class="nav-link"
                aria-current="page"
                :class="['mr-5', { active: option === 'solicitudes' }]"
                @click="optionEditClient('solicitudes')"
              >
                Solicitudes
              </a>
              <a
                class="nav-link"
                aria-current="page"
                :class="['mr-5', { active: option === 'documentos' }]"
                @click="optionEditClient('documentos')"
              >
                Documentos
              </a>
            </nav>
            <div v-show="option === 'historial'">
              <history-form
                :historyedit="history"
                :solicitudesedit="solicitudes"
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
                        tipo: 'leadsnew',
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
                                  tipo: 'leadsnew',
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
                    @click="showmodaldocuments2(Leads.id)"
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
                <div class="text-base margin-text">
                  <button class="solicitud-btn filtrar">
                    Filtrado por
                  </button>
                </div>
                <div>
                  <b-table
                    :items="productos"
                    :fields="productfields"
                    responsive="sm"
                    :tbody-tr-class="rowClass"
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
                    <template #cell(name)="{ value }">
                      <p>{{ getProductName(value) }}</p>
                    </template>
                    <template #cell(state)="{ value }">
                      <p>{{ getProductState(value) }}</p>
                    </template>
                    <!--<template #cell(estado_de_poliza)="row">
                      <span
                        v-if="row.item.estado_de_poliza === 'Vencida'"
                        style="color: #DE0E0E"
                      >
                        {{ row.item.estado_de_poliza }}
                      </span>
                      <span v-else>
                        {{ row.item.estado_de_poliza }}
                      </span>
                       </template>-->
                    <!--<span
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
                      -->
                    <template #row-details>
                      <b-card
                        align="center"
                        class="card-detail border-0"
                        body-class="text-center body-detail"
                      >
                        <b-row
                          v-for="item in productdetail"
                          :key="item"
                          class="div-style m-0"
                        >
                          <b-col class="text-left text-base">
                            {{ item.text }}
                          </b-col>
                          <b-col
                            v-if="item.text === 'Documentos'"
                            class="text-left ml-4 text-base text-val"
                          >
                            <a
                              v-b-modal.document
                              class="link"
                            >
                              {{ item.value }}
                            </a>
                          </b-col>
                          <b-col
                            v-else
                            class="text-left ml-4 text-base text-val"
                          >
                            {{ item.value }}
                          </b-col>
                        </b-row>
                      </b-card>
                    </template>
                  </b-table>
                </div>
                <div class="product-btn">
                  <b-button
                    class="btn-md text-white shadow-dropdow btn-new ml-4"
                    variant="primary"
                  >
                    Exportar
                  </b-button>
                </div>
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
                          @click.prevent="gorelationcontacto(item)"
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
        </div>
      </div>
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
          <client-form-new
            ref="componentnew"
            leadvalue
            :idlead="leadrelation"
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
      <!-- <p class="my-4 text-base">Al darle click al botón, volverás automáticamente a la pestaña de “Contactos”.</p> -->
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
          Se ha registrado el nuevo Lead
        </h3>
      </div>
      <!-- <p class="my-4 text-base">Al darle click al botón, volverás automáticamente a la pestaña de “Contactos”.</p> -->
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
          Se ha borrado el Lead correctamente
        </h3>
      </div>
      <div class="text-right">
        <b-button
          class="mt-3"
          variant="outline-danger"
          block
          @click="closeRequestAlertModal6"
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
        <h5 class="text-base title-text">
          El registro de documentos fue exitoso
        </h5>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4 mt-3"
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
        <h5 class="text-base title-text">
          Se elimino el documento correctamente
        </h5>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4 mt-3"
          variant="danger"
          @click="closeRequestAlertModal8"
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
          Se ha Eliminado la Relacion con el contacto correctamente
        </h3>
      </div>
      <div class="text-right">
        <b-button
          class="mt-3"
          variant="outline-danger"
          block
          @click="closeRequestAlertModal9"
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
import ReasignarProductRequest from '~/components/AsignRelationContact.vue'
import SToolBar from '~/components/base/SToolBar.vue'
import productscl from '~/static/products.json'
import productsmx from '~/static/productsmx.json'
import states from '~/static/states.json'
import formatRUT from '~/helpers/formatRUT.js'
export default {
  name: 'Leads',
  components: {
    ClientForm,
    ClientFormNew,
    HistoryForm,
    SToolBar,
    DownloadCsv,
    SModal,
    ReasignarProductRequest,
    ClientFormNewRelated
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
      rut: '',
      relation: {
        type: '',
        id: '',
        lead_related: '',
        lead_to_relate: ''
      },
      search: '',
      searchrut: false,
      modalreasigproduct: false,
      backclientrequest: 'client',
      sortBy: '',
      lead: {},
      Leads: {},
      contactosrelacionados: [],
      history: {},
      solicitudes: {},
      productos: {},
      states,
      idedit: '',
      fields: leadsStaticVars.tableFieldsClient,
      leadGeneralInfoCopy: null,
      documentosleads: [],
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
      clientidnew: '',
      leadProductsCopy: null,
      leadDocumentsCopy: null,
      newLeadId: null,
      statesCopy: null,
      prioritiesCopy: null,
      leadrelation: 0,
      optionProducts: {},
      products: {},
      modal: false,
      sortDesc: false,
      option: 'historial',
      content: 'list',
      selected: null,
      showModal: false,
      icon: 'sort-down',
      modaldocuments: false,
      requestval: true,
      expand: false,
      onlyproduct: false,
      loading: true,
      loadingClient: true,
      url: './editar.vue',
      version: '',
      solicituddetailsinfo: [],
      productData: [
        {
          id: '1',
          producto: 'Colectivo de Salud',
          nro_de_poliza: '010203',
          inicio_de_vigencia: '10/08/2022',
          fin_de_vigencia: '10/09/2022',
          estado_de_poliza: 'Vigente',
          _showDetails: false
        },
        {
          id: '2',
          producto: 'AP',
          nro_de_poliza: '010203',
          inicio_de_vigencia: '05/09/2022',
          fin_de_vigencia: '05/10/2023',
          estado_de_poliza: 'Vigente',
          _showDetails: false
        },
        {
          id: '3',
          producto: 'Garantía',
          nro_de_poliza: '010203',
          inicio_de_vigencia: '08/07/2021',
          fin_de_vigencia: '09/10/2023',
          estado_de_poliza: 'Vigente',
          _showDetails: false
        },
        {
          id: '4',
          producto: 'Transporte',
          nro_de_poliza: '010205',
          inicio_de_vigencia: '10/10/2021',
          fin_de_vigencia: '05/10/2022',
          estado_de_poliza: 'Vencida',
          _showDetails: false
        },
        {
          id: '5',
          producto: 'RC',
          nro_de_poliza: '010203',
          inicio_de_vigencia: '10/09/2021',
          fin_de_vigencia: '10/11/2022',
          estado_de_poliza: 'Vigente',
          _showDetails: false
        }
      ],
      productfields: [
        {
          key: 'name',
          label: 'Producto',
          sortable: true,
          class: 'pl-4'
        },
        {
          key: 'nro_poliza',
          label: 'N° de Póliza',
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
      ]
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
      'loadingLeads'
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
      this.products = productscl
    } else {
      this.products = productsmx
    }
    this.version = process.env.version
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
    ...mapMutations('leads', ['clearCsvInfo', 'setLoadingLeads']),
    ...mapActions('leads', ['updateLeads', 'deleteLead']),
    ...mapActions(['getCsvLeads']),
    formatRUT,
    async prueba () {
      try {
        const { data } = await this.$simpleeApi.get('/request/?lead=12861')
      } catch (error) {
        // store.commit('setAlertMessage', error.response.data)
      }
    },
    async getLeads (page) {
      this.page = page
      this.setLoadingLeads(true)
      const fieldss = `id,name,last_name,razon_social,rut,email,phone,last_request_creation,created_at,user_details`
      if (this.onlyproduct) {
        try {
          const res = await this.$simpleeApi.get('/lead/?no_products=true', {
            params: { page, ...this.urlParams, fields: fieldss }
          })
          this.totalRows = res.data.count
          this.updateLeads({ payload: res.data.results, sort: false })
          // console.log(res)
          this.page = page
        } catch (error) {
          this.$store.commit('setAlertMessage', error.response.data)
        }
      } else {
        try {
          const res = await this.$simpleeApi.get('/lead/?no_products=true', {
            params: { page, ...this.urlParams, fields: fieldss }
          })
          this.totalRows = res.data.count
          this.updateLeads({ payload: res.data.results, sort: false })

          // console.log(res)

          this.page = page
        } catch (error) {
          this.$store.commit('setAlertMessage', error.response.data)
        }
      }
      this.setLoadingLeads(false)
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
        this.$refs['modal-alert9'].show()
        if (this.$store.state.localStorage.user.role !== 'EXT_KAM') {
          setTimeout(() => this.GetRelationContacto(this.Leads.id), 500)
        }
      } catch (error) {
        console.log({ error })
        this.$store.commit('setAlertMessage', error.response.data)
      }
    },
    InfoNewClient () {
      this.modalreasigproduct = true
    },
    async UpdateContactNewRequest (value) {
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
    async showmodaldocuments2 (id) {
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
    async getLeadById (queries) {
      if (queries.id) {
        try {
          const { data } = await this.$simpleeApi.get(`/lead/${queries.id}/`)
          this.Leads = data
          if (this.option === 'historial') {
            this.optionEditClient('historial')
          } else if (this.option === 'productos') {
            this.optionEditClient('productos')
          } else {
            this.optionEditClient('documentos')
          }
          if (this.$store.state.localStorage.user.role !== 'EXT_KAM') {
            this.GetRelationContacto(this.Leads.id)
          }
        } catch (error) {
          this.$store.commit('setAlertMessage', error.response.data)
        }
      }
    },
    updateLeadIdInQuery (query) {
      this.$router.push({ path: 'leadsnew', query })
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
    searchConfig (value) {
      if (this.searchrut) {
        this.leadsFilters.search = ''
        this.rut = value
      } else {
        this.leadsFilters.search = value
        this.rut = ''
      }
    },
    deleteclient (data) {
      const id = data.id
      this.$bvModal
        .msgBoxConfirm('¿Desea eleminar este Lead?', {
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
              this.openContent(this.Leads)
              this.$refs['modal-alert7'].show()
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
    hideRelationModal () {
      this.$refs['modal-update-relation'].hide()
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
    closeRequestAlertModal7 () {
      this.$refs['modal-alert7'].hide()
    },
    closeRequestAlertModal8 () {
      this.$refs['modal-alert8'].hide()
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
        this.loading = true
        try {
          const res = await this.$simpleeApi.get(
            `/product/?lead=${this.idedit}`
          )
          this.productos = res.data.results
        } catch (error) {
          // store.commit('setAlertMessage', error.response.data)
        }
        setTimeout(() => {
          this.loading = false
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
        setTimeout(() => {
          this.loading = false
        }, 1000)
        this.option = val
      } else if (val === 'documentos') {
        this.loading = true
        this.documentosleads = await this.$GetDocumentsLeads(this.Leads.id)
        setTimeout(() => {
          this.loading = false
        }, 1000)
        this.option = val
      }
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
    setonlyproduct (valid) {
      this.onlyproduct = valid
    },
    setRut (valid) {
      this.searchrut = valid
    },
    getProductName (key) {
      // console.log(this.products)
      return Object.values(this.products).reduce(
        (acc, curr) => ({
          ...acc,
          ...curr.reduce((a, { text, value }) => ({ ...a, [value]: text }), {})
        }),
        {}
      )[key]
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
      }
    },
    RequestDetails (data) {
      this.requestid = data.id
      const lead = []
      for (const [key, value] of Object.entries(data)) {
        const requestObject = this.solicitudetail.find(
          ({ campo }) => campo === key
        )
        if (requestObject) {
          const newlead = {
            value,
            text: requestObject.text,
            key
          }
          lead.push(newlead)
        }
      }
      this.solicituddetailsinfo = lead
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
    getTypeProductInterest (request) {
      const requestObject = this.optionProducts.find(
        ({ value }) => value === request
      )
      if (requestObject) {
        return requestObject.text
      }
      return 'No tiene'
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
    generateCsv (timezone) {
      this.getCsvLeads({
        urlParams: this.urlParams,
        paramsone: 'lead',
        timezone
      })
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
    rowClass (item) {
      if (item != null && item.state === 'Vencida') {
        return 'vencida'
      }
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
  margin-bottom: 0px;
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
  padding-left: 1.5rem !important;
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
