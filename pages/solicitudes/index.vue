<template>
  <div>
    <s-modal
      v-if="modaldocuments"
      :documentsdata="documentsproducts"
      :idproduct="idproduct"
      :idrequest="idrequest"
      no-close-on-backdrop
      :requestsi="requestval"
      @save-documents="savedocuments"
      @save-documents2="savedocuments2"
      @delete-documents="deletedocuments"
      @delete-documents2="deletedocuments2"
      @cancel-lead="modaldocuments = false"
      @hidde="modaldocuments = false"
    />
    <b-modal-bitacora
      v-if="modalbitacora"
      :bitacoradata="bitacorarequestdata"
      :idrequest="idrequest"
      no-close-on-backdrop
      :requestsi="requestbitacoraval"
      @save-bitacora="savebitacora"
      @edit-bitacora="saveeditbitacora"
      @cancel-bitacora="cancelbitacora"
      @hidde="modalbitacora = false"
    />
    <div class="main-container">
      <s-tool-bar
        v-if="option === 'table'"
        ref="reftoolbar"
        class="toolbar"
        :new-btn="newbtn"
        search-input
        request
        button-ventas
        filter-by-state
        filter-by-user
        filter-by-etiquetas
        filter-by-date-type
        filter-by-priority-request
        filter-by-type-request
        filter-by-products-interest
        filter-by-referral
        filter-by-channel
        :current-filters="leadsFilters"
        @search="searchConfig"
        @set-rut="setRut"
        @save-filters="setFilters"
        @resetFilters="setFilters"
        @pagereset="page = 1"
        @pagepay="ChangeOptionFilter"
        @pagenopay="ChangeOptionFilter"
        @new-lead="newRequest"
      >
        <template #buttons>
          <download-csv
            :leads="leadsCsv"
            :count="totalRows"
            filename="solicitudes"
            crm
            @generate-csv="generateCsv"
          />
        </template>
      </s-tool-bar>
      <div
        v-if="option === 'table'"
        class="d-flex mb-2 w-100 results"
      >
        <div class="w-50 d-flex justify-content-start">
          <nuxt-link :to="{
              name: 'solicitudes-prioridades',
            }">
            <span class="text-lg pointer">
              <fa-icon
                :icon="['fas', 'star']"
                class="text-primary return starcolor"
              />
              <b>Prioridades</b>
            </span>
          </nuxt-link>
        </div>
        <div class="w-50 d-flex justify-content-end">
          <span> {{ totalRows }} Resultados</span>
        </div>
      </div>
      <div class="main">
        <div
          v-if="option === 'table'"
          class="form-sections"
        >
          <div class="table-responsive">
            <b-table
              id="table-principal"
              :items="Requeses"
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
              <template #cell(priority_score)="{ value }">
                <div
                  :class="getTypePriority1(value)"
                  :title="getTypePrioritytitle(value)"
                >
                  <div :class="getTypePriority2(value)">
                    {{ getTypePriorityNull(value) }}
                  </div>
                </div>
              </template>
              <template #cell(lead_details)="{ value }">
                {{ value.name }} {{ value.last_name }}
              </template>
              <template #cell(razon_social)="{ value }">
                {{ value }}
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
              <template #cell(request_type)="{ value }">
                {{ getTypeRequest(value) }}
              </template>
              <template #cell(product_group)="{ value }">
                {{ getTypeProductInterest(value) }}
              </template>
              <template #cell(comision_final)="{ value }">
                {{ getComisionFinal(value) }}
              </template>
              <template #cell(created_at)="{ value }">
                {{ getLeadDate(value) }}
              </template>
              <!--<template #cell(channel)="{value}">
                {{ getLeadChannel(value) }}
              </template>
              -->
              <!--<template #cell(priority)="{value}">
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
              -->
              <template #cell(state)="{ value }">
                <span :class="['btn-state', getLeadStatus(value).class]">
                  <fa-icon
                    :icon="['fas', getLeadStatus(value).icon]"
                    class="mr-2"
                  />{{ getLeadStatus(value).text }}
                </span>
              </template>
              <template #cell(user_details)="{ value }">
                <p>{{ GetUserStatusKam(value) }}</p>
              </template>
              <template #cell(actions)="{ item }">
                <div class="d-flex justify-content-center">
                  <button
                    v-b-tooltip.hover
                    class="circle mr-2 bg-white shadow-sm border p-3"
                    title="Información de la solicitud"
                    @click="openExistingLead(item)"
                  >
                    <fa-icon
                      :icon="['fas', 'edit']"
                      class="text-primary"
                      style="font-size: 0.9rem"
                    />
                  </button>
                  <button
                    v-if="user.is_superuser"
                    class="circle bg-white shadow-sm border p-3 mr-1"
                    title="Eliminar cliente"
                    @click="deleteSolicitud(item)"
                  >
                    <fa-icon
                      :icon="['fas', 'trash-alt']"
                      class="text-danger"
                      style="font-size: 0.9rem"
                    />
                  </button>
                  <button
                    class="circle bg-white shadow-sm border p-3 mr-1"
                    title="Enviar correo"
                    @click="UpdatePrioridad(item)"
                  >
                    <fa-icon
                      v-if="!item.prioridades"
                      :icon="['far', 'star']"
                      class="text-danger"
                      style="font-size: 0.9rem"
                    />
                    <fa-icon
                      v-if="item.prioridades"
                      :icon="['fas', 'star']"
                      class="starcolor"
                      style="font-size: 0.9rem"
                    />
                  </button>
                  <!--<button
                    v-if="version === 'cl'"
                    class="circle bg-white shadow-sm border p-3 mr-1"
                    @click="sendcorreos(item)"
                    title="Enviar correo"
                  >
                    <fa-icon
                      :icon="['fas', 'envelope']"
                      class="text-success"
                      style="font-size: .9rem"
                    />
                  </button>

                  <button
                    v-if="version === 'cl'"
                    class="circle bg-white shadow-sm border p-3"
                    @click="sendwhatsapp(item)"
                    title="Enviar whastapp"
                  >
                    <img
                      class="imgicon"
                      :src="require(`~/assets/icons/WhatsApp.png`)"
                    >
                  </button>
                  -->
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
                @change="ListRequests"
              />
            </div>
          </div>
        </div>
        <div
          v-if="option === 'table-prioridad'"
          class="form-sections"
        >
          <div class="table-responsive">
            <b-table
              id="table-principal"
              :items="Requesesprioridad"
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
              <template #cell(priority_score)="{ value }">
                <div
                  :class="getTypePriority1(value)"
                  :title="getTypePrioritytitle(value)"
                >
                  <div :class="getTypePriority2(value)">
                    {{ getTypePriorityNull(value) }}
                  </div>
                </div>
              </template>
              <template #cell(lead_details)="{ value }">
                {{ value.name }} {{ value.last_name }}
              </template>
              <template #cell(razon_social)="{ value }">
                {{ value }}
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
              <template #cell(request_type)="{ value }">
                {{ getTypeRequest(value) }}
              </template>
              <template #cell(product_group)="{ value }">
                {{ getTypeProductInterest(value) }}
              </template>
              <template #cell(product_details)="{ value }">
                {{ getTypeProductPrima(value) }}
              </template>
              <template #cell(created_at)="{ value }">
                {{ getLeadDate(value) }}
              </template>
              <!--<template #cell(channel)="{value}">
              {{ getLeadChannel(value) }}
            </template>
            -->
              <!--<template #cell(priority)="{value}">
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
            -->
              <template #cell(state)="{ value }">
                <span :class="['btn-state', getLeadStatus(value).class]">
                  <fa-icon
                    :icon="['fas', getLeadStatus(value).icon]"
                    class="mr-2"
                  />{{ getLeadStatus(value).text }}
                </span>
              </template>
              <template #cell(user_details)="{ value }">
                <p>{{ GetUserStatusKam(value) }}</p>
              </template>
              <template #cell(actions)="{ item }">
                <div class="d-flex justify-content-center">
                  <button
                    v-b-tooltip.hover
                    class="circle mr-2 bg-white shadow-sm border p-3"
                    title="Información de la solicitud"
                    @click="openExistingLead(item)"
                  >
                    <fa-icon
                      :icon="['fas', 'edit']"
                      class="text-primary"
                      style="font-size: 0.9rem"
                    />
                  </button>
                  <button
                    v-if="user.is_superuser"
                    class="circle bg-white shadow-sm border p-3 mr-1"
                    title="Eliminar cliente"
                    @click="deleteSolicitud(item)"
                  >
                    <fa-icon
                      :icon="['fas', 'trash-alt']"
                      class="text-danger"
                      style="font-size: 0.9rem"
                    />
                  </button>
                  <button
                    v-if="version === 'cl'"
                    class="circle bg-white shadow-sm border p-3 mr-1"
                    title="Enviar correo"
                    @click="sendcorreos(item)"
                  >
                    <fa-icon
                      :icon="['fas', 'envelope']"
                      class="text-success"
                      style="font-size: 0.9rem"
                    />
                  </button>
                  <!--
                <button
                  v-if="version === 'cl'"
                  class="circle bg-white shadow-sm border p-3"
                  @click="sendwhatsapp(item)"
                  title="Enviar whastapp"
                >
                  <img
                    class="imgicon"
                    :src="require(`~/assets/icons/WhatsApp.png`)"
                  >
                </button>
                -->
                </div>
              </template>
            </b-table>
            <div class="pages">
              <b-pagination
                class="mb-0"
                align="center"
                :value="page"
                :per-page="25"
                :total-rows="totalRows2"
                pills
                size="sm"
                @change="ListRequestsPriority"
              />
            </div>
          </div>
        </div>
        <div
          v-if="option === 'new'"
          class="form-new"
        >
          <div class="d-flex justify-content-between mb-4">
            <nuxt-link
              v-if="optioncliente !== ''"
              :to="{
                name: optioncliente,
                query: {
                  id: idcliente,
                },
              }"
            >
              <span class="text-base pointer w-50">
                <fa-icon
                  :icon="['fas', 'arrow-left']"
                  class="text-primary return"
                />
                <b v-if="optioncliente === 'clientes'">Regresar al cliente</b>
                <b v-if="optioncliente === 'leadsnew'">Regresar al lead</b>
              </span>
            </nuxt-link>
            <span
              v-else
              class="text-base pointer w-50"
              @click="BackRequest"
            >
              <fa-icon
                :icon="['fas', 'arrow-left']"
                class="text-primary return"
              />
              <b>Regresar a Solicitudes</b>
            </span>
            <div>
              <b-button
                class="text-white shadow-dropdow btn-new ml-4"
                variant="primary"
                @click="saveRequest()"
                :disabled="Botonguardarcambios"
              >
                Guardar cambios
              </b-button>
            </div>
          </div>
          <div class="row">
            <div class="principal">
              <div class="container">
                <div class="d-flex pt-4 justify-content-between align-items-start flex-column request-title">
                  <div class="menu_request d-flex">
                    <h2 class="mb-4">
                      <fa-icon
                        :icon="['fas', 'edit']"
                        class="text-primary mr-2"
                      />Nueva Solicitud
                    </h2>
                  </div>
                </div>
                <div class="signup-content">
                  <div class="signup-form-Request">
                    <form
                      id="register-form"
                      method="POST"
                      class="register-form"
                    >
                      <h4 class="mb-4 pl-2 pl-md-0">
                        <fa-icon
                          :icon="['fas', 'inbox']"
                          class="text-primary mr-2"
                        />
                        Datos de la solicitud
                      </h4>
                      <div class="form-col">
                        <div class="form-group-request">
                          <label
                            class="text-base"
                            for="state"
                          >Grupo de producto* :</label>
                          <div class="form-select">
                            <b-form-select
                              id="prod"
                              v-model="Request.product_group"
                              class="form-control form-input"
                              :options="groups"
                            />
                          </div>
                        </div>
                        <div class="form-group-request">
                          <label
                            class="text-base"
                            for="state"
                          >Producto :</label>
                          <div class="form-select">
                            <b-form-select
                              id="prod"
                              v-model="Request.product_interest"
                              class="form-control form-input"
                              :options="getLineProducts(Request.product_group)"
                              :disabled="!Request.product_group"
                            />
                          </div>
                        </div>
                        <div class="form-group-request">
                          <label
                            class="text-base"
                            for="city"
                          >Tipo Solicitud* :</label>
                          <div class="form-select">
                            <b-form-select
                              id="request_type"
                              v-model="Request.request_type"
                              class="form-control form-input"
                              @change="StatusInfo2()"
                            >
                              <option value="alianza_comercial">
                                Alianza comercial
                              </option>
                              <option value="solicitud_cotizacion">
                                Cotización
                              </option>
                              <option value="cancelacion_o_anulacion_de_poliza">
                                Cancelación o anulación de políza
                              </option>
                              <option value="denuncia_siniestro">
                                Denuncia siniestro
                              </option>
                              <option value="endosos">
                                Endosos
                              </option>
                              <option value="renovacion">
                                Renovación
                              </option>
                              <option value="soporte">
                                Soporte
                              </option>
                              <option value="solicitud_informacion_productos">
                                Información de productos
                              </option>
                            </b-form-select>
                          </div>
                        </div>
                      </div>
                      <div class="form-col">
                        <div class="form-group-request">
                          <label
                            class="text-base"
                            for="state"
                          >Estado* :</label>
                          <div class="form-select">
                            <b-form-select
                              id="state"
                              v-model="Request.state"
                              class="form-control form-input"
                              :options="states"
                            />
                          </div>
                        </div>
                        <div
                          v-if="Request.state === 'en_licitacion'"
                          class="form-group-request"
                        >
                          <label
                            class="text-base"
                            for="name"
                          >Fecha adjudicación :</label>
                          <input
                            id="codigoreferido"
                            v-model="Request.adjudication_date"
                            class="form-control form-input"
                            type="date"
                          >
                        </div>
                        <div
                          v-if="Request.state === 'perdido'"
                          class="form-group-request"
                        >
                          <label
                            class="text-base"
                            for="city"
                          >Razon del estado* :</label>
                          <div class="form-select">
                            <b-form-select
                              v-model="Request.state_reason"
                              class="form-control form-input"
                            >
                              <template #first>
                                <b-form-select-option
                                  :value="null"
                                  disabled
                                >
                                  Seleccione el motivo de perdida
                                </b-form-select-option>
                              </template>
                              <b-form-select-option value="sin respuesta del cliente">
                                Sin respuesta del cliente
                              </b-form-select-option>
                              <b-form-select-option value="no hay interes del producto">
                                No hay interés del producto
                              </b-form-select-option>
                              <b-form-select-option value="compro con otra aseguradora">
                                Compró con otra aseguradora
                              </b-form-select-option>
                              <b-form-select-option value="no ofrecemos seguro solicitado">
                                No ofrecemos seguro solicitado
                              </b-form-select-option>
                              <b-form-select-option value="precio alto">
                                Precio alto
                              </b-form-select-option>
                              <b-form-select-option value="solo buscaba informacion">
                                Sólo buscaba información
                              </b-form-select-option>
                              <b-form-select-option value="forma de pago no valido">
                                Forma de pago no válido
                              </b-form-select-option>
                              <b-form-select-option value="no se pudo contactar al cliente">
                                No se pudo contactar al cliente
                              </b-form-select-option>
                              <b-form-select-option value="no cumple con los requisitos">
                                No cumple con los requisitos
                              </b-form-select-option>
                              <b-form-select-option value="no envio informacion">
                                No envió información
                              </b-form-select-option>
                              <b-form-select-option value="no existe Cobertura">
                                No existe Cobertura
                              </b-form-select-option>
                              <b-form-select-option value="otro">
                                Otro
                              </b-form-select-option>
                            </b-form-select>
                          </div>
                        </div>

                        <div class="form-group-request">
                          <label
                            class="text-base"
                            for="city"
                          >Ejecutivo a cargo* :</label>
                          <div class="form-select">
                            <b-form-select
                              id="user"
                              v-model="Request.user"
                              class="form-control form-input"
                              :options="executives"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="form-col">
                        <div class="form-group-request">
                          <label
                            class="text-base"
                            for="state"
                          >Canal* :</label>
                          <div class="form-select">
                            <b-form-select
                              id="channel"
                              v-model="Request.channel"
                              class="form-control form-input"
                              :options="channels"
                              :disabled="$store.state.localStorage.user.role === 'EXT_KAM'"
                            />
                          </div>
                        </div>
                        <div
                          v-if="Request.channel"
                          class="form-group-request"
                        >
                          <label
                            class="text-base"
                            for="state"
                          >Campaña* :</label>
                          <div class="form-select">
                            <b-form-select
                              id="channel"
                              v-model="Request.campaign_slug"
                              class="form-control form-input"
                              :disabled="$store.state.localStorage.user.role === 'EXT_KAM'"
                            >
                              <option
                                v-for="chan in getcampaing(Request.channel)"
                                :key="chan.id"
                                :value="chan.slug"
                              >
                                {{ chan.name }}
                              </option>
                            </b-form-select>
                          </div>
                        </div>
                        <div
                          v-if="Request.campaign_slug === channelreferido"
                          class="form-group-request"
                        >
                          <label
                            class="text-base"
                            for="state"
                          >Referido* :</label>
                          <div class="form-select">
                            <b-form-select
                              id="channel"
                              v-model="Request.referred"
                              class="form-control form-input"
                              :options="refferals"
                            />
                          </div>
                        </div>
                        <div
                          v-if="
                        Request.campaign_slug === 'scotiabank'
                      "
                          class="form-group-request"
                        >
                          <label
                            class="text-base"
                            for="state"
                          >Referido Externo* :</label>
                          <div class="form-select">
                            <b-form-select
                              id="channel"
                              v-model="Request.referred_ext"
                              class="form-control form-input"
                              :options="refferals_ext_list"
                            />
                          </div>
                        </div>
                        <div
                          v-if="
                            Request.campaign_slug === 'staree' ||
                              Request.referral_code
                          "
                          class="form-group-request"
                        >
                          <label
                            class="text-base"
                            for="name"
                          >Código referido* :</label>
                          <input
                            id="codigoreferido"
                            v-model="Request.referral_code"
                            class="form-control form-input"
                            type="text"
                          >
                        </div>
                        <!--               <div class="form-group-request">
                          <label
                            class="text-base"
                            for="state"
                          >Número de trabajadores :</label>
                          <div class="form-select">
                            <b-form-select
                              class="form-control form-input"
                              v-model="Request.employee_quantity_choice"
                              id="channel"
                            >
                              <option
                                v-for="emp in employes"
                                :value="emp.value"
                                :key="emp.value"
                              >{{emp.text}}</option>
                            </b-form-select>
                          </div>
                        </div>
                        -->
                        <div class="form-group-request">
                          <label
                            class="text-base"
                            for="name"
                          >Comisión proyectada* :</label>
                          <input
                            id="codigoreferido"
                            v-model="Request.projected_quote"
                            class="form-control form-input"
                            type="number"
                          >
                        </div>
                        <div class="form-group-request mt-3">
                          <label
                            class="text-base"
                            for="birth_date"
                          >Etiquetas :</label>
                          <!-- Prop `add-on-change` is needed to enable adding tags vie the `change` event -->
                          <b-form-tags
                            id="tags-component-select"
                            v-model="Request.tags"
                            size="md"
                            add-on-change
                            tag-variant="primary"
                            no-outer-focus
                          >
                            <template #default="{
                                tags,
                                inputAttrs,
                                inputHandlers,
                                disabled,
                                removeTag,
                              }">
                              <b-form-select
                                v-bind="inputAttrs"
                                :disabled="
                                  disabled || availableOptions.length === 0
                                "
                                :options="availableOptions"
                                class="form-control form-input custom-select mb-3"
                                v-on="inputHandlers"
                              >
                                <template #first>
                                  <!-- This is required to prevent bugs with Safari -->
                                  <option
                                    disabled
                                    value=""
                                  >
                                    Seleccione una etiqueta
                                  </option>
                                </template>
                              </b-form-select>
                              <ul
                                v-if="tags.length > 0"
                                class="list-inline d-inline-block mb-2"
                              >
                                <li
                                  v-for="tag in tags"
                                  :key="tag"
                                  class="list-inline-item mb-2"
                                >
                                  <b-form-tag
                                    :title="tag"
                                    :disabled="disabled"
                                    class="text-white"
                                    variant="primary"
                                    @remove="removeTag(tag)"
                                  >
                                    {{ tag }}
                                  </b-form-tag>
                                </li>
                              </ul>
                            </template>
                          </b-form-tags>
                        </div>
                        <div class="form-group-request">
                          <label
                            class="text-base"
                            for="city"
                          >Prioridad :</label>
                          <div class="form-select">
                            <b-form-select
                              id="priority"
                              v-model="Request.priority"
                              class="form-control form-input"
                              @change="ChangePriority"
                            >
                              <option
                                selected
                                value="0"
                              >
                                Sin Prioridad
                              </option>
                              <option value="baja">
                                Baja
                              </option>
                              <option value="media">
                                Media
                              </option>
                              <option value="alta">
                                Alta
                              </option>
                            </b-form-select>
                          </div>
                        </div>
                        <!--
                        <div
                          v-if="version === 'mx'"
                          class="form-group-request"
                        >
                          <label
                            class="text-base"
                            for="name"
                          >Recepción cotización :</label>
                          <input
                            v-model="Request.quotation_received"
                            class="form-control form-input"
                            type="date"
                            id="codigoreferido"
                          />
                        </div>
                        <div
                          v-if="version === 'mx'"
                          class="form-group-request"
                        >
                          <label
                            class="text-base"
                            for="name"
                          >Entrega de cotización :</label>
                          <input
                            v-model="Request.quotation_delivered"
                            class="form-control form-input"
                            type="date"
                            id="codigoreferido"
                          />
                        </div>
                      -->
                      </div>
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="birth_date"
                        >Comentarios :</label>
                        <textarea
                          id="comment"
                          v-model="Request.comment"
                          rows="6"
                        />
                      </div>
                    </form>
                  </div>
                  <div class="dataCentral mt-4 mt-md-0">
                    <div class="signup-form-Client py-3 py-md-0">
                      <form
                        id="register-form"
                        method="POST"
                        class="register-form"
                      >
                        <div class="w-100 d-flex flex-column flex-md-row">
                          <div class="w-100 w-md-50">
                            <h4>
                              <fa-icon
                                :icon="['fas', 'address-book']"
                                class="text-primary mr-2"
                              />
                              Datos del contacto
                            </h4>
                          </div>
                          <div
                            v-if="!asignclientexistnewequest"
                            class="w-100 px-md-3 text-right cursor-pointer d-flex flex-row justify-content-end"
                          >
                            <b-button
                              class="text-white shadow-dropdow btn-new ml-md-4"
                              variant="primary"
                              @click="InfoNewClient('add')"
                            >
                              Asignar
                            </b-button>
                            <tool-tip
                              class="tooltiposition d-flex align-items-center ml-2"
                              text="Busca si el contacto ya existe en la base de datos"
                              new-class="span-right"
                            />
                          </div>
                          <div
                            v-else
                            class="w-100 px-3 text-right cursor-pointer d-flex flex-row justify-content-end"
                            @click="InfoNewClient('delete')"
                          >
                            <span class="pointer">
                              Eliminar
                              <fa-icon
                                :icon="['fas', 'trash']"
                                class="icon"
                              />
                            </span>
                          </div>
                        </div>
                        <div
                          v-if="mensajeloader !== ''"
                          class="form-row w-100"
                        >
                          <div class="form-group-request w-100">
                            <span
                              v-if="mensajeloader === 'encontrado'"
                              class="mensajerut"
                            >{{ Names.rut }} encontrado en SII</span>
                            <span
                              v-if="mensajeloader === 'noencontrado'"
                              class="mensajerutfalse"
                            >No se encuentra resultados en SII para el RUT
                              ingresado</span>
                          </div>
                        </div>
                        <div class="form-row mtrow">
                          <div class="form-group-request">
                            <label
                              class="text-base w-100 d-flex flex-row"
                              for="name"
                            >
                              {{ Names.rut }}* :
                              <tool-tip
                                class="tooltiposition ml-2"
                                text="Ingresa el RUT para buscar los datos de la empresa en SII"
                              />
                            </label>
                            <div
                              v-if="version === 'cl'"
                              class="relative"
                            >
                              <input
                                id="rut"
                                v-model="Leads.rut"
                                :disabled="asignclientexistnewequest"
                                class="form-control form-input"
                                type="text"
                                @input="debouncedSearchRUTPrev"
                              >
                              <span
                                v-if="loader"
                                class="absolute loaderrequest2"
                              >
                                <img
                                  src="~assets/icons/loading.gif"
                                  class="w-16-request"
                                >
                              </span>
                            </div>
                            <div
                              v-else
                              class="relative"
                            >
                              <input
                                id="rut"
                                v-model="Leads.rut"
                                :disabled="asignclientexistnewequest"
                                class="form-control form-input"
                                type="text"
                              >
                              <span
                                v-if="loader"
                                class="absolute loaderrequest2"
                              >
                                <img
                                  src="~assets/icons/loading.gif"
                                  class="w-16-request"
                                >
                              </span>
                            </div>
                          </div>
                          <div class="form-group-request">
                            <label
                              class="text-base w-100 d-flex flex-row"
                              for="city"
                            >Persona* :</label>
                            <div class="form-select">
                              <b-form-select
                                id="optionsPerson"
                                v-model="Leads.person"
                                :disabled="asignclientexistnewequest"
                                placeholder="Selecciona un tipo de persona"
                                class="form-control form-input"
                                :options="optionsPerson"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="father_name"
                            >Razón social :</label>
                            <input
                              id="razon_social"
                              v-model="Leads.razon_social"
                              :disabled="asignclientexistnewequest"
                              class="form-control form-input"
                              type="text"
                            >
                          </div>
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="father_name"
                            >Giro* :</label>
                            <s-input-select
                              ref="Leads.comuna_select"
                              show-last-option-if-no-results
                              :value="Leads.giro"
                              placeholder="giro"
                              :options="giros"
                              hint-text="Selecciona el giro"
                              name="giro"
                              :disabled-option="asignclientexistnewequest"
                              @onChange="changegiro"
                            />
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="name"
                            >Nombre* :</label>
                            <input
                              id="name"
                              v-model="Leads.name"
                              :disabled="asignclientexistnewequest"
                              class="form-control form-input"
                              type="text"
                            >
                          </div>
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="father_name"
                            >Apellido* :</label>
                            <input
                              id="last_name"
                              v-model="Leads.last_name"
                              :disabled="asignclientexistnewequest"
                              class="form-control form-input"
                              type="text"
                            >
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="name"
                            >Email* :</label>
                            <input
                              id="email"
                              v-model="Leads.email"
                              :disabled="asignclientexistnewequest"
                              class="form-control form-input"
                              type="text"
                            >
                          </div>
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="father_name"
                            >Telefono* :</label>
                            <input
                              id="phone"
                              v-model="fullNumber"
                              :disabled="asignclientexistnewequest"
                              class="form-control form-input"
                              type="text"
                            >
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="name"
                            >Dirección :</label>
                            <input
                              id="address"
                              v-model="Leads.address"
                              :disabled="asignclientexistnewequest"
                              class="form-control form-input"
                              type="text"
                            >
                          </div>
                          <div
                            v-if="version === 'mx'"
                            class="form-group-request"
                          >
                            <label
                              class="text-base"
                              for="father_name"
                            >Código Postal:</label>
                            <input
                              id="comuna"
                              v-model="Leads.zip_code"
                              placeholder="65650"
                              class="form-control form-input"
                              type="text"
                            >
                          </div>
                          <div
                            v-else
                            class="form-group-request"
                          >
                            <label
                              class="text-base"
                              for="father_name"
                            >{{ Names.comuna }} :</label>
                            <s-input-select
                              ref="Leads.comuna_select"
                              :disabled-option="asignclientexistnewequest"
                              show-last-option-if-no-results
                              :value="Leads.comuna"
                              placeholder="Comuna"
                              :options="Comunascl"
                              hint-text="Selecciona la comuna"
                              name="Leadscomuna"
                              @onChange="changeComuna"
                            />
                          </div>
                        </div>
                        <div
                          v-if="version === 'mx'"
                          class="form-row"
                        >
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="father_name"
                            >Municipio* :</label>
                            <s-input-select
                              ref="Leads.city"
                              show-last-option-if-no-results
                              :value="Leads.city"
                              placeholder="Municipio"
                              :options="getMunicipios(Leads.zip_code)"
                              hint-text="Selecciona el municipio"
                              name="municipio"
                              :disabled-option="ValidateMunicipios"
                              @onChange="changeMunicipio"
                            />
                          </div>
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="father_name"
                            >Colonia* :</label>
                            <s-input-select
                              ref="Leads.comuna"
                              show-last-option-if-no-results
                              :value="Leads.comuna"
                              placeholder="Comuna"
                              :options="getComunas(Leads.zip_code)"
                              hint-text="Selecciona la comuna"
                              name="Leadscomuna"
                              :disabled-option="ValidateComuna"
                              @onChange="changeComuna"
                            />
                          </div>
                        </div>
                        <div class="form-row">
                          <div
                            v-if="asignclientexistnewequest"
                            class="form-group-request"
                          >
                            <label
                              class="text-base"
                              for="city"
                            >Ejecutivo a cargo* :</label>
                            <div class="form-select">
                              <b-form-select
                                id="user"
                                v-model="Leads.user"
                                class="form-control form-input"
                                :disabled="asignclientexistnewequest"
                                :options="executives"
                              />
                            </div>
                          </div>
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="city"
                            >Numero de trabajadores* :</label>
                            <div class="form-select">
                              <b-form-select
                                id="user"
                                v-model="Leads.employee_quantity_choice"
                                class="form-control form-input"
                                :disabled="asignclientexistnewequest"
                                :options="employes"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                    <!-- <div class="signup-form-Client mt-4">
                      <form
                        method="POST"
                        class="register-form"
                        id="register-form"
                      >
                        <div class="form-col">
                          <div class="form-group-request product-title pt-0">
                            <h2 class="mb-4">
                              <fa-icon
                                :icon="['fas', 'edit']"
                                class="text-primary mr-2"
                              />Producto
                            </h2>
                          </div>
                        </div>
                        <div
                          v-if="!this.ProductsRequest.nro_poliza"
                          class="form-col"
                        >
                          <div class="form-group-request ">
                            <label
                              @click="addproduct = true;Changecomissionreferred2(Requestedit.referred)"
                              class="label_subenlace"
                              for="city"
                            >
                              <fa-icon
                                :icon="['fas', 'plus']"
                                class="icon"
                              /> Nuevo producto
                            </label>
                          </div>
                          <div class="form-group-request">
                            <label
                              @click="modalreasigproduct2 = true"
                              class="label_subenlace"
                              for="city"
                            >
                              <fa-icon
                                :icon="['fas', 'plus']"
                                class="icon"
                              />Asignar producto existente
                            </label>
                          </div>
                        </div>
                        <div
                          v-if="this.ProductsRequest.nro_poliza"
                          class="form-col"
                        >
                          <div class="form-group-request">
                            <table class="mb-0 w-100">
                              <thead>
                                <tr>
                                  <th>N° Poliza</th>
                                  <th>Producto</th>
                                  <th>Compañia</th>
                                  <th></th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>{{ this.ProductsRequest.nro_poliza }}</td>
                                  <td>{{ getProductName(this.ProductsRequest.name) }}</td>
                                  <td>{{ getCompanyName(this.ProductsRequest.company) }}</td>
                                  <td>
                                    <fa-icon
                                      @click="editProduct"
                                      :icon="['fas', 'edit']"
                                      class="icon pointer"
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </form>
                    </div>
                    -->
                  </div>
                </div>
              </div>
            </div>
          </div>
          <reasignar-product-request
            v-if="modalreasigproduct"
            :loading="loading"
            @hidde="onCloseModal"
            @cancel-lead="onCloseModal"
            @UpdateContact="UpdateContactNewRequest"
          />
          <request-product-modal
            v-if="addproduct"
            :dataproduct="ProductsRequest2"
            :comesto="cometo"
            @hidde="onCloseModal"
            @save-lead="onSaveProduct"
            @cancel-lead="onCloseModal"
          />
          <request-product-modal-edit
            v-if="editProducts"
            :cobranza="CobranzaPay"
            :dataproduct="ProductsRequest"
            @hidde="onCloseModal"
            @save-lead="onSaveProductEdit"
            @cancel-lead="onCloseModal"
          />
        </div>
        <div
          v-if="option === 'edit'"
          class="form-new"
        >
          <div class="d-flex justify-content-between mb-4">
            <nuxt-link
              v-if="optioncliente !== ''"
              :to="{
                name: optioncliente,
                query: {
                  id: idcliente,
                  sitio,
                },
              }"
            >
              <span class="text-base pointer w-50">
                <fa-icon
                  :icon="['fas', 'arrow-left']"
                  class="text-primary return"
                />
                <b v-if="optioncliente === 'clientes'">Regresar al cliente</b>
                <b v-if="optioncliente === 'leadsnew'">Regresar al lead</b>
              </span>
            </nuxt-link>
            <span
              v-else
              class="text-base pointer w-50"
              @click="BackRequest"
            >
              <fa-icon
                :icon="['fas', 'arrow-left']"
                class="text-primary return"
              />
              <b>Regresar a Solicitudes</b>
            </span>
            <div>
              <b-button
                class="text-white shadow-dropdow btn-new ml-4"
                variant="primary"
                @click="confirmSolicitud()"
                :disabled="Botonguardarcambios"
              >
                Guardar cambios
              </b-button>
            </div>
          </div>
          <div class="row">
            <div class="principal">
              <div class="container">
                <div class="d-flex pt-4 justify-content-between align-items-start flex-row request-title">
                  <div class="menu_request d-flex w-35">
                    <h2>
                      <fa-icon
                        :icon="['fas', 'edit']"
                        class="text-primary mr-2"
                      />Editar Solicitud
                    </h2>
                  </div>
                  <div class="menu_request justify-content-end d-flex w-75 mr-4 mr-md-0">
                    <h4
                      v-if="$store.state.localStorage.user.role !== 'EXT_KAM'"
                      class="cursor-pointer"
                      @click="deleteSolicitud(Requestedit)"
                    >
                      <fa-icon
                        :icon="['fas', 'trash-alt']"
                        class="text-danger mr-2"
                      />Eliminar solicitud
                    </h4>
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-start flex-row pb-4 pb-md-2">
                  <div class="menu_request d-flex w-idS">
                    <p class="new ml-4">
                      ID Solicitud: {{ Requestedit.id }}
                    </p>
                  </div>
                  <div class="menu_request w-opS justify-content-start d-none d-md-flex">
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="menu d-flex p-0 flex-column flex-md-row">
                        <button
                          :class="[
                            { active: optiondetail === 'bitacora' },
                            'mr-3',
                          ]"
                          style="font-size: 1rem"
                          @click="optiondetail = 'bitacora'"
                        >
                          Bitacora
                        </button>
                        <button
                          :class="[
                            { active: optiondetail === 'cliente' },
                            'mr-3',
                          ]"
                          style="font-size: 1rem"
                          @click="optiondetail = 'cliente'"
                        >
                          Contacto
                        </button>
                        <button
                          :class="[
                            { active: optiondetail === 'producto' },
                            'mr-3',
                          ]"
                          style="font-size: 1rem"
                          @click="optiondetail = 'producto'"
                        >
                          Formulario
                        </button>
                        <button
                          :class="[
                            { active: optiondetail === 'documentos' },
                            'mr-3',
                          ]"
                          style="font-size: 1rem"
                          @click="optiondetail = 'documentos'"
                        >
                          Documentos
                        </button>
                        <button
                          v-if="Requestedit.product_group === 'seguro_colectivo_de_salud'"
                          :class="[
                            { active: optiondetail === 'colectivo' },
                            'mr-3',
                          ]"
                          style="font-size: 1rem"
                          @click="optiondetail = 'colectivo'"
                        >
                          Colectivo
                        </button>
                        <button
                          v-if="$store.state.localStorage.user.role !== 'EXT_KAM'"
                          :class="[
                            { active: optiondetail === 'historial' },
                            'mr-3',
                          ]"
                          style="font-size: 1rem"
                          @click="optiondetail = 'historial'"
                        >
                          Historial
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="signup-content">
                  <div
                    v-if="loading"
                    class="d-flex flex-fill h-100 loading"
                  >
                    <div class="text-center text-primary pa-5 mx-auto my-auto">
                      <b-spinner class="align-middle" />
                      <strong>Cargando...</strong>
                    </div>
                  </div>
                  <div
                    v-else
                    class="signup-form-Request px-2 px-md-0 py-3 py-md-0"
                  >
                    <form
                      id="register-form"
                      method="POST"
                      class="register-form"
                    >
                      <div class="d-flex flex-row justify-content-center align-items-center justify-content-md-between">
                        <h4 class="mb-md-4 pl-2 pl-md-0">
                          <fa-icon
                            :icon="['fas', 'inbox']"
                            class="text-primary mr-2"
                          />
                          Datos de la solicitud
                          <img
                            v-if="!viewRequestMobile"
                            class="d-inline d-md-none img-contain"
                            alt="flecha"
                            :src="require(`~/assets/flecha.png`)"
                            @click="viewDataRequest()"
                          >
                          <img
                            v-if="viewRequestMobile"
                            class="d-inline d-md-none img-contain"
                            alt="flecha2"
                            :src="require(`~/assets/flechaabajo.png`)"
                            @click="viewDataRequest()"
                          >
                        </h4>
                      </div>
                      <div v-if="viewRequestMobile">
                        <div class="form-col">
                          <div
                            v-if="Requestedit.partnership"
                            class="form-group-request"
                          >
                            <label
                              class="text-base"
                              for="city"
                            >Cliente partnership :</label>
                            <input
                              id="partnership"
                              v-model="Requestedit.partnership_details.name"
                              class="form-control form-input"
                              type="text"
                              disabled
                            >
                          </div>
                          <div
                            v-if="messaggepartnert2"
                            class="form-group-request pt-1 pb-1"
                          >
                            <strong
                              style="font-size: 12px"
                              for="state"
                            >*{{ messaggepartnert2 }}*</strong>
                          </div>
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="state"
                            >Grupo de producto* :</label>
                            <div class="form-select">
                              <b-form-select
                                id="prod"
                                v-model="Requestedit.product_group"
                                class="form-control form-input"
                                :options="groups"
                              />
                            </div>
                          </div>
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="state"
                            >Producto :</label>
                            <div class="form-select">
                              <b-form-select
                                id="prod"
                                v-model="Requestedit.product_interest"
                                class="form-control form-input"
                                :options="
                                  getLineProducts(Requestedit.product_group)
                                "
                                :disabled="!Requestedit.product_group"
                              />
                            </div>
                          </div>
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="city"
                            >Tipo Solicitud* :</label>
                            <div class="form-select">
                              <b-form-select
                                id="request_type"
                                v-model="Requestedit.request_type"
                                @change="StatusInfo()"
                                class="form-control form-input"
                              >
                                <option value="alianza_comercial">
                                  Alianza comercial
                                </option>
                                <option value="solicitud_cotizacion">
                                  Cotización
                                </option>
                                <option value="cancelacion_o_anulacion_de_poliza">
                                  Cancelación o anulación de políza
                                </option>
                                <option value="denuncia_siniestro">
                                  Denuncia siniestro
                                </option>
                                <option value="endosos">
                                  Endosos
                                </option>
                                <option value="renovacion">
                                  Renovación
                                </option>
                                <option value="soporte">
                                  Soporte
                                </option>
                                <option value="solicitud_informacion_productos">
                                  Información de productos
                                </option>
                              </b-form-select>
                            </div>
                          </div>
                        </div>
                        <div class="form-col">
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="state"
                            >Estado* :</label>
                            <div class="form-select">
                              <b-form-select
                                id="state"
                                v-model="Requestedit.state"
                                class="form-control form-input"
                                :options="states"
                              />
                            </div>
                          </div>
                          <div
                            v-if="Requestedit.state"
                            class="form-group-request"
                          >
                            <label
                              class="text-base"
                              for="name"
                            >Agendar próxima llamada :</label>
                            <input
                              id="codigoreferido"
                              v-model="dateevent"
                              class="form-control form-input"
                              type="datetime-local"
                            >
                          </div>
                          <div
                            v-if="Requestedit.state === 'en_licitacion'"
                            class="form-group-request"
                          >
                            <label
                              class="text-base"
                              for="name"
                            >Fecha adjudicación :</label>
                            <input
                              id="codigoreferido"
                              v-model="Requestedit.adjudication_date"
                              class="form-control form-input"
                              type="date"
                            >
                          </div>
                          <div
                            v-if="Requestedit.state === 'perdido'"
                            class="form-group-request"
                          >
                            <label
                              class="text-base"
                              for="city"
                            >Razon del estado* :</label>
                            <div class="form-select">
                              <b-form-select
                                v-model="Requestedit.state_reason"
                                class="form-control form-input"
                              >
                                <template #first>
                                  <b-form-select-option
                                    :value="null"
                                    disabled
                                  >
                                    Seleccione el motivo de perdida
                                  </b-form-select-option>
                                </template>
                                <b-form-select-option value="sin respuesta del cliente">
                                  Sin respuesta del cliente
                                </b-form-select-option>
                                <b-form-select-option value="no hay interes del producto">
                                  No hay interés del producto
                                </b-form-select-option>
                                <b-form-select-option value="compro con otra aseguradora">
                                  Compró con otra aseguradora
                                </b-form-select-option>
                                <b-form-select-option value="no ofrecemos seguro solicitado">
                                  No ofrecemos seguro solicitado
                                </b-form-select-option>
                                <b-form-select-option value="precio alto">
                                  Precio alto
                                </b-form-select-option>
                                <b-form-select-option value="solo buscaba informacion">
                                  Sólo buscaba información
                                </b-form-select-option>
                                <b-form-select-option value="forma de pago no valido">
                                  Forma de pago no válido
                                </b-form-select-option>
                                <b-form-select-option value="no se pudo contactar al cliente">
                                  No se pudo contactar al cliente
                                </b-form-select-option>
                                <b-form-select-option value="no cumple con los requisitos">
                                  No cumple con los requisitos
                                </b-form-select-option>
                                <b-form-select-option value="no envio informacion">
                                  No envió información
                                </b-form-select-option>
                                <b-form-select-option value="no existe Cobertura">
                                  No existe Cobertura
                                </b-form-select-option>
                                <b-form-select-option value="otro">
                                  Otro
                                </b-form-select-option>
                              </b-form-select>
                            </div>
                          </div>
                          <div
                            v-if="
                              user.role !== 'KAM' || user.id === Requestedit.user
                            "
                            class="form-group-request"
                          >
                            <label
                              class="text-base"
                              for="city"
                            >Ejecutivo a cargo* :</label>
                            <div class="form-select">
                              <b-form-select
                                id="user"
                                v-model="Requestedit.user"
                                class="form-control form-input"
                                :options="executives"
                                :disabled="$store.state.localStorage.user.role === 'EXT_KAM'"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="form-col">
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="state"
                            >Canal* :</label>
                            <div class="form-select">
                              <b-form-select
                                id="channel"
                                v-model="Requestedit.channel"
                                class="form-control form-input"
                                :options="channels"
                                :disabled="$store.state.localStorage.user.role === 'EXT_KAM'"
                              />
                            </div>
                          </div>
                          <div
                            v-if="Requestedit.channel"
                            class="form-group-request"
                          >
                            <label
                              class="text-base"
                              for="state"
                            >Campaña* :</label>
                            <div class="form-select">
                              <b-form-select
                                id="channel"
                                v-model="Requestedit.campaign_slug"
                                class="form-control form-input"
                                @change="ChangecomissionPartnership"
                                :disabled="$store.state.localStorage.user.role === 'EXT_KAM'"
                              >
                                <option
                                  v-for="chan in getcampaing(Requestedit.channel)"
                                  :key="chan.id"
                                  :value="chan.slug"
                                >
                                  {{ chan.name }}
                                </option>
                              </b-form-select>
                            </div>
                          </div>
                          <div
                            v-if="messaggepartnert"
                            class="form-group-request pt-1 pb-1"
                          >
                            <strong
                              style="font-size: 12px"
                              for="state"
                            >*{{ messaggepartnert }}*</strong>
                          </div>
                          <div
                            v-if="Requestedit.campaign_slug === channelreferido"
                            class="form-group-request"
                          >
                            <label
                              class="text-base"
                              for="state"
                            >Referido* :</label>
                            <div class="form-select">
                              <b-form-select
                                id="channel"
                                v-model="Requestedit.referred"
                                class="form-control form-input"
                                :options="refferals"
                                @change="Changecomissionreferred2"
                              />
                            </div>
                          </div>
                          <div
                            v-if="
                          Requestedit.campaign_slug === 'scotiabank'
                        "
                            class="form-group-request"
                          >
                            <label
                              class="text-base"
                              for="state"
                            >Referido Externo* :</label>
                            <div class="form-select">
                              <b-form-select
                                id="channel"
                                v-model="Requestedit.referred_ext"
                                class="form-control form-input"
                                :options="refferals_ext_list"
                              />
                            </div>
                          </div>
                          <div
                            v-if="
                              Requestedit.campaign_slug === 'staree' ||
                                Requestedit.referral_code
                            "
                            class="form-group-request"
                          >
                            <label
                              class="text-base"
                              for="name"
                            >Código referido* :</label>
                            <input
                              id="codigoreferido"
                              v-model="Requestedit.referral_code"
                              class="form-control form-input"
                              type="text"
                            >
                          </div>
                          <!--                    <div class="form-group-request">
                            <label
                              class="text-base"
                              for="state"
                            >Número de trabajadores :</label>
                            <div class="form-select">
                              <b-form-select
                                class="form-control form-input"
                                v-model="Requestedit.employee_quantity_choice"
                                id="channel"
                              >
                                <option
                                  v-for="emp in employes"
                                  :value="emp.value"
                                  :key="emp.value"
                                >{{emp.text}}</option>
                              </b-form-select>
                            </div>
                          </div>
                          -->
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="name"
                            >Comisión proyectada* :</label>
                            <input
                              id="codigoreferido"
                              v-model="Requestedit.projected_quote"
                              class="form-control form-input"
                              type="number"
                            >
                          </div>
                          <div class="form-group-request mt-3">
                            <label
                              class="text-base"
                              for="birth_date"
                            >Etiquetas :</label>
                            <!-- Prop `add-on-change` is needed to enable adding tags vie the `change` event -->
                            <b-form-tags
                              id="tags-component-select"
                              v-model="Requestedit.tags"
                              size="md"
                              add-on-change
                              tag-variant="primary"
                              no-outer-focus
                            >
                              <template #default="{
                                  tags,
                                  inputAttrs,
                                  inputHandlers,
                                  disabled,
                                  removeTag,
                                }">
                                <b-form-select
                                  v-bind="inputAttrs"
                                  :disabled="
                                    disabled || availableOptions2.length === 0
                                  "
                                  :options="availableOptions2"
                                  class="form-control form-input custom-select mb-3"
                                  v-on="inputHandlers"
                                >
                                  <template #first>
                                    <!-- This is required to prevent bugs with Safari -->
                                    <option
                                      disabled
                                      value=""
                                    >
                                      Seleccione una etiqueta
                                    </option>
                                  </template>
                                </b-form-select>
                                <ul
                                  v-if="tags.length > 0"
                                  class="list-inline d-inline-block mb-2"
                                >
                                  <li
                                    v-for="tag in tags"
                                    :key="tag"
                                    class="list-inline-item mb-2"
                                  >
                                    <b-form-tag
                                      :title="tag"
                                      :disabled="disabled"
                                      class="text-white"
                                      variant="primary"
                                      @remove="removeTag(tag)"
                                    >
                                      {{ tag }}
                                    </b-form-tag>
                                  </li>
                                </ul>
                              </template>
                            </b-form-tags>
                          </div>
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="city"
                            >Prioridad :</label>
                            <div class="form-select">
                              <b-form-select
                                id="priority"
                                v-model="Requestedit.priority"
                                class="form-control form-input"
                                @change="ChangePriorityEdit"
                              >
                                <option
                                  selected
                                  value="0"
                                >
                                  Sin Prioridad
                                </option>
                                <option value="baja">
                                  Baja
                                </option>
                                <option value="media">
                                  Media
                                </option>
                                <option value="alta">
                                  Alta
                                </option>
                              </b-form-select>
                            </div>
                          </div>
                          <!--
                          <div
                            v-if="version === 'mx'"
                            class="form-group-request"
                          >
                            <label
                              class="text-base"
                              for="name"
                            >Recepción cotización :</label>
                            <input
                              v-model="Requestedit.quotation_received"
                              class="form-control form-input"
                              type="date"
                              id="codigoreferido"
                            />
                          </div>
                          <div
                            v-if="version === 'mx'"
                            class="form-group-request"
                          >
                            <label
                              class="text-base"
                              for="name"
                            >Entrega de cotización :</label>
                            <input
                              v-model="Requestedit.quotation_delivered"
                              class="form-control form-input"
                              type="date"
                              id="codigoreferido"
                            />
                          </div>
                              -->
                        </div>
                        <div class="form-group-request">
                          <label
                            class="text-base"
                            for="birth_date"
                          >Comentarios :</label>
                          <textarea
                            id="comment"
                            v-model="Requestedit.comment"
                            rows="6"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="menu d-flex d-md-none p-0 flex-column flex-md-row py-4 align-items-start">
                    <button
                      :class="[
                        { active: optiondetail === 'bitacora' },
                        'mr-3 pb-2',
                      ]"
                      style="font-size: 1rem"
                      @click="optiondetail = 'bitacora'"
                    >
                      Bitacora
                    </button>
                    <button
                      :class="[
                        { active: optiondetail === 'cliente' },
                        'mr-3 pb-2',
                      ]"
                      style="font-size: 1rem"
                      @click="optiondetail = 'cliente'"
                    >
                      Contacto
                    </button>
                    <button
                      :class="[
                        { active: optiondetail === 'producto' },
                        'mr-3 pb-2',
                      ]"
                      style="font-size: 1rem"
                      @click="optiondetail = 'producto'"
                    >
                      Formulario
                    </button>
                    <button
                      :class="[
                        { active: optiondetail === 'documentos' },
                        'mr-3 pb-2',
                      ]"
                      style="font-size: 1rem"
                      @click="optiondetail = 'documentos'"
                    >
                      Documentos
                    </button>
                    <button
                      v-if="Requestedit.product_group === 'seguro_colectivo_de_salud'"
                      :class="[
                        { active: optiondetail === 'colectivo' },
                        'mr-3 pb-2',
                      ]"
                      style="font-size: 1rem"
                      @click="optiondetail = 'colectivo'"
                    >
                      Colectivo
                    </button>
                    <button
                      v-if="$store.state.localStorage.user.role !== 'EXT_KAM'"
                      :class="[
                        { active: optiondetail === 'historial' },
                        'mr-3 pb-2',
                      ]"
                      style="font-size: 1rem"
                      @click="optiondetail = 'historial'"
                    >
                      Historial
                    </button>
                  </div>
                  <div
                    v-if="optiondetail === 'cliente'"
                    class="w-cli mt-4 mt-md-0 mr-md-3"
                  >
                    <div
                      v-if="loading"
                      class="d-flex flex-fill h-100 loading"
                    >
                      <div class="text-center text-primary pa-5 mx-auto my-auto">
                        <b-spinner class="align-middle" />
                        <strong>Cargando...</strong>
                      </div>
                    </div>
                    <div
                      v-else
                      class="signup-form-Client py-3 py-md-0"
                    >
                      <form
                        id="register-form"
                        method="POST"
                        class="register-form"
                      >
                        <div class="w-100 d-flex px-3 px-md-0">
                          <div class="w-50">
                            <h4>
                              <fa-icon
                                :icon="['fas', 'address-book']"
                                class="text-primary mr-2"
                              />
                              Datos del contacto
                            </h4>
                          </div>
                          <div class="w-reA px-3 text-right cursor-pointer d-flex flex-row justify-content-end">
                            <b-button
                              class="text-white shadow-dropdow btn-new ml-4"
                              variant="primary"
                              @click="modalreasigproductedit = true"
                            >
                              Reasignar
                            </b-button>
                            <tool-tip
                              class="tooltiposition d-flex align-items-center ml-2"
                              placement="topleft"
                              text="Reasigna otro contacto para esta solicitud"
                              new-class="span-right"
                            />
                          </div>
                        </div>
                        <div class="form-row mtrow">
                          <div class="form-group-request">
                            <label
                              class="text-base w-100 d-flex flex-row"
                              for="name"
                            >
                              {{ Names.rut }}* :
                              <tool-tip
                                class="tooltiposition ml-2"
                                text="Ingresa el RUT para buscar los datos de la empresa en SII"
                              />
                            </label>
                            <input
                              id="rut"
                              v-model="InfoContact.rut"
                              disabled
                              class="form-control form-input"
                              type="text"
                            >
                          </div>
                          <div class="form-group-request">
                            <label
                              class="text-base w-100 d-flex flex-row"
                              for="city"
                            >Persona* :</label>
                            <div class="form-select">
                              <b-form-select
                                id="optionsPerson"
                                v-model="InfoContact.person"
                                disabled
                                placeholder="Selecciona un tipo de persona"
                                class="form-control form-input"
                                :options="optionsPerson"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="father_name"
                            >Razón social :</label>
                            <input
                              id="razon_social"
                              v-model="InfoContact.razon_social"
                              disabled
                              class="form-control form-input"
                              type="text"
                            >
                          </div>
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="father_name"
                            >Giro* :</label>
                            <s-input-select
                              ref="Leads.comuna_select"
                              show-last-option-if-no-results
                              :value="InfoContact.giro"
                              placeholder="giro"
                              :options="giros"
                              hint-text="Selecciona el giro"
                              name="giro"
                              disabled-option
                              @onChange="changegiro"
                            />
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="name"
                            >Nombre* :</label>
                            <input
                              id="name"
                              v-model="InfoContact.name"
                              disabled
                              class="form-control form-input"
                              type="text"
                            >
                          </div>
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="father_name"
                            >Apellido* :</label>
                            <input
                              id="last_name"
                              v-model="InfoContact.last_name"
                              disabled
                              class="form-control form-input"
                              type="text"
                            >
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="name"
                            >Email:*
                              <a
                                v-if="InfoContact.email"
                                :href="`https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${InfoContact.email}`"
                                target="_blank"
                                class="solicitud-btn mb-0 ml-4"
                              >
                                Enviar correo
                                <fa-icon
                                  :icon="['fas', 'envelope']"
                                  class="text-primary edit-ico mr-2"
                                /> </a></label>
                            <input
                              id="email"
                              v-model="InfoContact.email"
                              disabled
                              class="form-control form-input"
                              type="text"
                            >
                          </div>
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="father_name"
                            >Telefono* :</label>
                            <input
                              id="phone"
                              v-model="InfoContact.phone"
                              disabled
                              class="form-control form-input"
                              type="text"
                            >
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="name"
                            >Dirección :</label>
                            <input
                              id="address"
                              v-model="InfoContact.address"
                              disabled
                              class="form-control form-input"
                              type="text"
                            >
                          </div>
                          <div
                            v-if="version === 'mx'"
                            class="form-group-request"
                          >
                            <label
                              class="text-base"
                              for="father_name"
                            >Código Postal:</label>
                            <input
                              id="comuna"
                              v-model="InfoContact.zip_code"
                              placeholder="65650"
                              class="form-control form-input"
                              type="text"
                              disabled
                            >
                          </div>
                          <div
                            v-else
                            class="form-group-request"
                          >
                            <label
                              class="text-base"
                              for="father_name"
                            >{{ Names.comuna }} :</label>
                            <s-input-select
                              ref="Leads.comuna_select"
                              disabled-option
                              show-last-option-if-no-results
                              :value="InfoContact.comuna"
                              placeholder="Comuna"
                              :options="Comunascl"
                              hint-text="Selecciona la comuna"
                              name="Leadscomuna"
                              @onChange="changeComuna"
                            />
                          </div>
                        </div>
                        <div
                          v-if="version === 'mx'"
                          class="form-row"
                        >
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="father_name"
                            >Municipio* :</label>
                            <s-input-select
                              ref="Leads.city"
                              show-last-option-if-no-results
                              :value="InfoContact.city"
                              placeholder="Municipio"
                              :options="getMunicipios(Leads.zip_code)"
                              hint-text="Selecciona el municipio"
                              name="municipio"
                              disabled-option
                              @onChange="changeMunicipio"
                            />
                          </div>
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="father_name"
                            >Colonia* :</label>
                            <s-input-select
                              ref="Leads.comuna"
                              show-last-option-if-no-results
                              :value="InfoContact.comuna"
                              placeholder="Comuna"
                              :options="getComunas(Leads.zip_code)"
                              hint-text="Selecciona la comuna"
                              name="Leadscomuna"
                              disabled-option
                              @onChange="changeComuna"
                            />
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="city"
                            >Ejecutivo a cargo* :</label>
                            <div class="form-select">
                              <b-form-select
                                id="user"
                                v-model="InfoContact.user"
                                class="form-control form-input"
                                disabled
                                :options="executives"
                              />
                            </div>
                          </div>
                          <div class="form-group-request">
                            <label
                              class="text-base"
                              for="city"
                            >Numero de trabajadores* :</label>
                            <div class="form-select">
                              <b-form-select
                                id="user"
                                v-model="InfoContact.employee_quantity_choice"
                                class="form-control form-input"
                                disabled
                                :options="employes"
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="InfoContact.is_lead_client"
                          class="w-100 d-flex mt-5"
                        >
                          <nuxt-link
                            :to="{
                              name: 'clientes',
                              query: {
                                id: InfoContact.id,
                                idrequest: Requestedit.id,
                              },
                            }"
                            class="w-100 text-right"
                          >
                            <a
                              href="#"
                              class="w-100 d-flex flex-row"
                            >
                              <span class="w-100 px-3 text-right cursor-pointer">
                                <fa-icon
                                  :icon="['fas', 'edit']"
                                  class="icon"
                                />
                                Ir al Contacto
                              </span>
                            </a>
                          </nuxt-link>
                        </div>
                        <div
                          v-else
                          class="w-100 d-flex mt-5"
                        >
                          <nuxt-link
                            :to="{
                              name: 'leadsnew',
                              query: {
                                id: InfoContact.id,
                                idrequest: Requestedit.id,
                              },
                            }"
                            class="w-100 text-right"
                          >
                            <a
                              href="#"
                              class="w-100 d-flex flex-row"
                            >
                              <span class="w-100 px-3 text-right cursor-pointer">
                                <fa-icon
                                  :icon="['fas', 'edit']"
                                  class="icon"
                                />
                                Ir al Contacto
                              </span>
                            </a>
                          </nuxt-link>
                        </div>
                      </form>
                    </div>
                    <div class="signup-form-Client mt-4">
                      <form
                        id="register-form"
                        method="POST"
                        class="register-form"
                      >
                        <div class="form-row px-1">
                          <div class="w-25 product-title pt-0">
                            <h2 class="mb-4">
                              <fa-icon
                                :icon="['fas', 'edit']"
                                class="text-primary mr-2"
                              />Producto
                            </h2>
                          </div>
                          <a
                            v-if="ProductExistente"
                            href="#"
                            class="w-25 d-flex flex-row py-2 py-md-0"
                            @click="editProduct"
                          >
                            <span class="w-100 px-3 text-right cursor-pointer">
                              <fa-icon
                                :icon="['fas', 'edit']"
                                class="icon"
                              />
                              Modificar producto
                            </span>
                          </a>
                          <a
                            v-if="ProductExistente && productold && $store.state.localStorage.user.role !== 'EXT_KAM'"
                            href="#"
                            class="w-25 d-flex flex-row py-2 py-md-0"
                            @click="modalreasigproduct2 = true"
                          >
                            <span class="w-100 px-3 text-right cursor-pointer">
                              <fa-icon
                                :icon="['fas', 'share-square']"
                                class="icon"
                              />
                              Reasignar producto
                            </span>
                          </a>
                          <a
                            v-if="ProductExistente && productold"
                            href="#"
                            class="w-25 d-flex flex-row py-2 py-md-0"
                            @click="showmodaldocuments(ProductsRequest.id)"
                          >
                            <span class="w-100 px-3 text-right cursor-pointer">
                              <fa-icon
                                :icon="['fas', 'file-alt']"
                                class="icon"
                              />
                              Documentos
                            </span>
                          </a>
                        </div>
                        <div
                          v-if="!ProductExistente"
                          class="form-col"
                        >
                          <div class="form-group-request">
                            <label
                              class="label_subenlace"
                              for="city"
                              @click="
                                CheckAddProduct();
                                Changecomissionreferred2(Requestedit.referred);
                                ChangecomissionPartnership(
                                  Requestedit.campaign_slug
                                );
                              "
                            >
                              <fa-icon
                                :icon="['fas', 'plus']"
                                class="icon"
                              />
                              Nuevo producto
                            </label>
                          </div>
                          <div class="form-group-request">
                            <label
                              class="label_subenlace"
                              for="city"
                              @click="CheckAddExistProduct()"
                            >
                              <fa-icon
                                :icon="['fas', 'plus']"
                                class="icon"
                              />Asignar producto existente
                            </label>
                          </div>
                        </div>
                        <div
                          v-if="ProductExistente"
                          class="form-col"
                        >
                          <div class="form-group-request">
                            <table class="mb-0 w-100">
                              <tbody>
                                <tr>
                                  <td class="tableproduct new">
                                    ID Producto:
                                    <span class="new">
                                      {{ ProductsRequest.id }}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="tableproduct">
                                    N° Poliza:
                                    <span>
                                      {{ ProductsRequest.nro_poliza }}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="tableproduct">
                                    Producto:
                                    <span>{{
                                      getProductName(ProductsRequest.name)
                                    }}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="tableproduct">
                                    Compañia:
                                    <span>{{
                                      getCompanyName(ProductsRequest.company)
                                    }}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="tableproduct">
                                    <a
                                      v-if="$store.state.localStorage.user.role !== 'EXT_KAM'"
                                      href="#"
                                      class="w-100 d-flex flex-row"
                                      @click="SendCertificate(ProductsRequest.id)"
                                    >
                                      <span class="w-100 px-3 text-primary text-right cursor-pointer">
                                        <fa-icon
                                          :icon="['fas', 'file']"
                                          class="icon"
                                        />
                                        Enviar certificado
                                      </span>
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div
                    v-if="optiondetail === 'documentos'"
                    class="dataCentral mt-4 mt-md-0"
                  >
                    <div class="signup-form-Client py-3 py-md-0">
                      <form
                        id="register-form"
                        method="POST"
                        class="register-form"
                      >
                        <div class="w-100 d-flex text-center text-md-left px-2 px-md-0 flex-column flex-md-row mb-4">
                          <div class="w-bitW">
                            <h4 class="mb-2 mb-md-4 text-left">
                              <fa-icon
                                :icon="['fas', 'file']"
                                class="text-primary mr-2"
                              />
                              Documentos de la solicitud
                            </h4>
                          </div>
                          <div class="w-bitW text-left d-flex">
                            <a
                              class="solicitud-btn"
                              @click="showmodaldocuments2(Requestedit.id)"
                            >
                              <fa-icon
                                :icon="['fas', 'plus']"
                                class="text-primary edit-ico mr-2"
                              />Agregar
                            </a>
                          </div>
                        </div>
                        <div class="d-none d-md-block form-row w-100">
                          <b-table
                            :items="documentossolicitud"
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
                        <div class="d-block d-md-none form-row w-100 table-responsive">
                          <b-table
                            :items="documentossolicitud"
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
                      </form>
                    </div>
                  </div>
                  <div
                    v-if="optiondetail === 'colectivo'"
                    class="dataCentral mt-4 mt-md-0"
                  >
                    <div class="signup-form-Client py-3 py-md-0">
                      <form
                        id="register-form"
                        method="POST"
                        class="register-form"
                      >
                        <div class="w-100 d-flex px-3 px-md-0">
                          <div class="w-50">
                            <h4 class="mb-4">
                              <fa-icon
                                :icon="['fas', 'users']"
                                class="text-primary mr-2"
                              />
                              Datos de colectivo
                            </h4>
                          </div>
                          <div class="w-50">
                            <a
                              class="solicitud-btn"
                              @click="newcolectivo()"
                            >
                              <fa-icon
                                :icon="['fas', 'plus']"
                                class="text-primary edit-ico mr-2"
                              />Agregar
                            </a>
                          </div>
                        </div>
                        <div class="form-row w-100">
                          <b-table
                            :items="colectivossolicitud"
                            :fields="colectivoFields"
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
                                  class="circle bg-white shadow-sm border p-3 mr-2"
                                  title="Eliminar empleado"
                                  @click.prevent="deleteColectivo(item)"
                                >
                                  <fa-icon
                                    :icon="['fas', 'trash-alt']"
                                    class="text-danger"
                                    style="font-size: 0.9rem"
                                  />
                                </button>
                                <button
                                  class="circle bg-white shadow-sm border p-3"
                                  title="Editar empleado"
                                  @click.prevent="EditColectivoEmpleado(item)"
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
                        </div>
                      </form>
                    </div>
                  </div>
                  <div
                    v-if="optiondetail === 'producto'"
                    class="dataCentral mt-4 mt-md-0"
                  >
                    <div class="signup-form-Client py-3 py-md-0">
                      <form
                        id="register-form"
                        method="POST"
                        class="register-form"
                      >
                        <div class="w-100 d-flex px-3 px-md-0">
                          <div class="w-50">
                            <h4 class="mb-4">
                              <fa-icon
                                :icon="['fas', 'clipboard-list']"
                                class="text-primary mr-2"
                              />
                              Datos de formulario
                            </h4>
                          </div>
                          <div
                            v-if="ViewAditionalData"
                            class="w-50 flex justify-center items-center"
                          >
                            <h4 class="mb-4">
                              Mostrar campos omitidos
                              <input
                                v-model="ViewOmitidos"
                                type="checkbox"
                                @click="changeOmitidos"
                              >
                            </h4>
                          </div>
                        </div>
                        <div class="w-100 d-flex px-3 px-md-0">
                          <div class="w-50">
                            <a
                              v-if="Requestedit.aditional_data && ViewAditionalData"
                              href="#"
                              class="w-100 d-flex flex-row py-2 py-md-0"
                              @click="editAditionalData"
                            >
                              <span class="w-100 text-left cursor-pointer">
                                <fa-icon
                                  :icon="['fas', 'edit']"
                                  class="icon"
                                />
                                Modificar Datos
                              </span>
                            </a>
                          </div>
                          <div class="w-50 flex justify-center items-center">
                            <a
                              v-if="Requestedit.aditional_data && ViewAditionalData && Requestedit.product_group ==='seguro_de_accidentes_personales'"
                              href="#"
                              class="w-100 d-flex flex-row py-2 py-md-0"
                              @click="PostPDF"
                            >
                              <span class="w-100 text-left cursor-pointer">
                                <fa-icon
                                  :icon="['fas', 'file']"
                                  class="icon"
                                />
                                Generar PDF
                              </span>
                            </a>
                          </div>
                        </div>
                        <div
                          v-if="ViewAditionalData"
                          class="w-100"
                        >
                          <div
                            v-if="ViewOmitidos"
                            class="form-row"
                          >
                            <b-card
                              align="center"
                              class="card-detail border-0 w-100"
                              body-class="text-center body-detail"
                            >
                              <b-row
                                v-for="(item, index) in productnodetails"
                                :key="index"
                                class="div-style m-0"
                              >
                                <b-col class="text-left text-base">
                                  {{ item.label }}
                                </b-col>
                                <b-col
                                  v-if="item.data_type === 'list'"
                                  class="text-left ml-4 text-base text-val"
                                >
                                  Opciones:
                                </b-col>
                                <b-col
                                  v-else
                                  class="text-left ml-4 text-base text-val"
                                >
                                  {{ item.value }}
                                </b-col>
                                <div
                                  v-if="item.data_type === 'list'"
                                  class="w-100 d-flex flex-column justify-content-end align-items-end"
                                >
                                  <b-row
                                    v-for="(name, index) in item.value"
                                    :key="index"
                                    class="div-style2 m-0"
                                  >
                                    <b-col class="text-left text-base">
                                      {{ name }}
                                    </b-col>
                                    <div />
                                  </b-row>
                                </div>
                              </b-row>
                            </b-card>
                          </div>
                          <div class="form-row">
                            <b-card
                              align="center"
                              class="card-detail border-0 w-100"
                              body-class="text-center body-detail"
                            >
                              <b-row
                                v-for="(item, index) in productdetails"
                                :key="index"
                                class="div-style m-0"
                              >
                                <b-col class="text-left text-base">
                                  {{ item.label }}
                                </b-col>
                                <b-col
                                  v-if="item.data_type === 'list'"
                                  class="text-left ml-4 text-base text-val"
                                >
                                  Opciones:
                                </b-col>
                                <b-col
                                  v-else
                                  class="text-left ml-4 text-base text-val"
                                >
                                  {{ item.value }}
                                </b-col>
                                <div
                                  v-if="item.data_type === 'list'"
                                  class="w-100 d-flex flex-column justify-content-end align-items-end"
                                >
                                  <b-row
                                    v-for="(name, index) in item.value"
                                    :key="index"
                                    class="div-style2 m-0"
                                  >
                                    <b-col class="text-left text-base">
                                      {{ name }}
                                    </b-col>
                                    <div />
                                  </b-row>
                                </div>
                              </b-row>
                            </b-card>
                          </div>
                        </div>
                        <div
                          v-if="this.Requestedit.product_group ==='seguro_de_accidentes_personales' && Requestedit.aditional_data && ViewAditionalData"
                          class="w-100"
                        >
                          <div class="w-50">
                            <h4 class="mb-4">
                              <fa-icon
                                :icon="['fas', 'clipboard-list']"
                                class="text-primary mr-2"
                              />
                              Datos de accidentes personales
                            </h4>
                          </div>
                          <div class="form-row">
                            <b-card
                              align="center"
                              class="card-detail border-0 w-100"
                              body-class="text-center body-detail"
                            >
                              <b-row class="div-style m-0">
                                <b-col class="text-left text-base">
                                  Observaciones
                                </b-col>
                                <b-col
                                  v-if="AditionalDataAp.observaciones"
                                  class="text-left ml-4 text-base text-val"
                                >
                                  {{AditionalDataAp.observaciones}}
                                </b-col>
                              </b-row>
                              <!--
                                 <b-row class="div-style m-0">
                                <b-col class="text-left text-base">
                                  Siniestralidad
                                </b-col>
                                <b-col
                                  v-if="AditionalDataAp.siniestralidad"
                                  class="text-left ml-4 text-base text-val"
                                >
                                  {{AditionalDataAp.siniestralidad}}
                                </b-col>
                              </b-row>
                              <b-row class="div-style m-0">
                                <b-col class="text-left text-base">
                                  Coberturas
                                </b-col>
                                <b-col
                                  v-if="AditionalDataAp.coberturas"
                                  class="text-left ml-4 text-base text-val"
                                >
                                  <b-row class="div-style m-0">
                                    <b-col
                                      v-for="cober in AditionalDataAp.coberturas"
                                      :key="cober"
                                      class="text-left text-base"
                                    >
                                      {{cober}}
                                    </b-col>
                                  </b-row>
                                </b-col>
                              </b-row>
                              -->
                              <b-row class="div-style m-0">
                                <b-col class="text-left text-base">
                                  Grupos de Asegurados
                                </b-col>
                              </b-row>
                              <b-row class="div-style m-0">
                                <b-col
                                  v-for="asegurados in AditionalDataAp.AseguradosAdicionales"
                                  :key="asegurados"
                                  class="text-left ml-4 text-base text-val"
                                >
                                  <b-row
                                    v-if="asegurados"
                                    class="div-style m-0"
                                  >
                                    <b-col class="text-left text-base">
                                      Duración del seguro
                                    </b-col>
                                    <b-col
                                      v-if="asegurados.time_quote"
                                      class="text-left ml-4 text-base text-val"
                                    >
                                      {{asegurados.time_quote}}
                                    </b-col>
                                  </b-row>
                                  <b-row
                                    v-if="asegurados"
                                    class="div-style m-0"
                                  >
                                    <b-col class="text-left text-base">
                                      Tipo de jornada
                                    </b-col>
                                    <b-col
                                      v-if="asegurados.type_jornada"
                                      class="text-left ml-4 text-base text-val"
                                    >
                                      {{asegurados.type_jornada}}
                                    </b-col>
                                  </b-row>
                                  <b-row
                                    v-if="asegurados"
                                    class="div-style m-0"
                                  >
                                    <b-col class="text-left text-base">
                                      Siniestralidad
                                    </b-col>
                                    <b-col
                                      v-if="asegurados.siniestralidad"
                                      class="text-left ml-4 text-base text-val"
                                    >
                                      {{asegurados.siniestralidad}}
                                    </b-col>
                                  </b-row>
                                  <b-row
                                    v-if="asegurados"
                                    class="div-style m-0"
                                  >
                                    <b-col class="text-left text-base">
                                      Actividad de beneficiarios
                                    </b-col>
                                    <b-col
                                      v-if="asegurados.actividad_beneficiarios"
                                      class="text-left ml-4 text-base text-val"
                                    >
                                      {{asegurados.actividad_beneficiarios}}
                                    </b-col>
                                  </b-row>
                                  <b-row
                                    v-if="asegurados"
                                    class="div-style m-0"
                                  >
                                    <b-col class="text-left text-base">
                                      Cantidad de asegurados
                                    </b-col>
                                    <b-col
                                      v-if="asegurados.employee_quantity_choice"
                                      class="text-left ml-4 text-base text-val"
                                    >
                                      {{asegurados.employee_quantity_choice}}
                                    </b-col>
                                  </b-row>
                                  <b-row
                                    v-if="asegurados"
                                    class="div-style m-0"
                                  >
                                    <b-col class="text-left text-base">
                                      Coberturas
                                    </b-col>
                                    <b-col
                                      v-if="asegurados.coberturas"
                                      class="text-left ml-4 text-base text-val"
                                    >
                                      <b-row class="div-style m-0">
                                        <b-col
                                          v-for="cober2 in asegurados.coberturas"
                                          :key="cober2"
                                          class="text-left text-base"
                                        >
                                          {{cober2}}
                                        </b-col>
                                      </b-row>
                                    </b-col>
                                  </b-row>
                                </b-col>
                              </b-row>
                            </b-card>
                          </div>

                        </div>
                        <div
                          v-if="!ViewAditionalData"
                          class="signup-content"
                        >
                          <div class="w-100">
                            <form
                              id="register-form"
                              method="POST"
                              class="register-form"
                            >
                              <h4 class="mb-4 pl-2 pl-md-0">
                                <fa-icon
                                  :icon="['fas', 'inbox']"
                                  class="text-primary mr-2"
                                />
                                Editar datos de formulario
                              </h4>

                              <div
                                v-for="pro in Requestedit.aditional_data"
                                :key="pro"
                                class="form-col"
                              >
                                <div
                                  v-if="pro.data_type !=='list'"
                                  class="form-group-request"
                                >
                                  <label
                                    class="text-base"
                                    for="name"
                                  >{{ pro.label }} :</label>
                                  <input
                                    :id="pro.field_name"
                                    v-model="AditionalDataEdit[pro.field_name]"
                                    class="form-control form-input"
                                    type="text"
                                  >
                                </div>
                                <div
                                  v-else
                                  class="form-group-request"
                                >
                                  <label
                                    class="text-base"
                                    for="name"
                                  >{{ pro.label }} :</label>
                                  <input
                                    id="codigoreferido"
                                    v-model="Request.projected_quote"
                                    class="form-control form-input"
                                    type="number"
                                  >
                                </div>
                              </div>
                              <div
                                v-if="Requestedit.product_group ==='seguro_de_accidentes_personales'"
                                class="form-group-request mt-4"
                              >
                                <span>Esta solicitud pertenece al grupo de seguro de accidentes personales, puedes ingresar los siguientes campos para generar un PDF</span>
                              </div>
                              <div
                                v-if="Requestedit.product_group ==='seguro_de_accidentes_personales'"
                                class="form-col"
                              >
                                <div class="form-group-request">
                                  <label
                                    class="text-base"
                                    for="name"
                                  >Observaciones y comentarios :</label>
                                  <input
                                    id="observaciones"
                                    v-model="AditionalDataAp.observaciones"
                                    class="form-control form-input"
                                    type="text"
                                  >
                                </div>
                                <!--
                                 <div class="form-group-request">
                                  <label
                                    class="text-base"
                                    for="name"
                                  >SINIESTRALIDAD DE LOS ÚLTIMOS TRES AÑOS (MONTO Y PORCENTAJE):</label>
                                  <input
                                    id="observaciones"
                                    v-model="AditionalDataAp.siniestralidad"
                                    class="form-control form-input"
                                    type="text"
                                  >
                                </div>
                                <div class="form-group-request">
                                  <label
                                    class="text-base"
                                    for="name"
                                  >Coberturas:</label>
                                  <b-form-tags
                                    id="coberturas-component-select"
                                    v-model="AditionalDataAp.coberturas"
                                    size="md"
                                    add-on-change
                                    tag-variant="primary"
                                    no-outer-focus
                                  >
                                    <template #default="{
                                          tags,
                                          inputAttrs,
                                          inputHandlers,
                                          disabled,
                                          removeTag,
                                        }">
                                      <b-form-select
                                        v-bind="inputAttrs"
                                        :disabled="
                                  disabled || availableOptions.length === 0
                                "
                                        :options="availableOptions3"
                                        class="form-control form-input custom-select mb-3"
                                        v-on="inputHandlers"
                                      >
                                        <template #first>
                                          <option
                                            disabled
                                            value=""
                                          >
                                            Seleccione una cobertura
                                          </option>
                                        </template>
                                      </b-form-select>
                                      <ul
                                        v-if="tags.length > 0"
                                        class="list-inline d-inline-block mb-2"
                                      >
                                        <li
                                          v-for="tag in tags"
                                          :key="tag"
                                          class="list-inline-item mb-2"
                                        >
                                          <b-form-tag
                                            :title="tag"
                                            :disabled="disabled"
                                            class="text-white"
                                            variant="primary"
                                            @remove="removeTag(tag)"
                                          >
                                            {{ tag }}
                                          </b-form-tag>
                                        </li>
                                      </ul>
                                    </template>
                                  </b-form-tags>
                                </div>
                                  -->
                              </div>
                              <div
                                v-if="Requestedit.product_group ==='seguro_de_accidentes_personales'"
                                class="form-group-request mt-4"
                              >
                                <h4>Asegurados Adicionales <fa-icon
                                    @click="addAseguradosAdicionales()"
                                    :icon="['fas', 'plus']"
                                    class="text-primary ml-2 cursor-pointer"
                                    alt="Agregar asegurado"
                                  /></h4>
                              </div>
                              <div
                                v-if="Requestedit.product_group ==='seguro_de_accidentes_personales'"
                                class="w-100"
                              >
                                <div
                                  v-for="aseg, index in AditionalDataAp.AseguradosAdicionales"
                                  :key="index"
                                  class="form-col asegurados-adicionales"
                                >
                                  <div class="form-group-request d-flex justify-content-end">
                                    <fa-icon
                                      :icon="['fas', 'times']"
                                      class="text-primary cursor-pointer"
                                      @click="removeAseguradosAdicionales(index)"
                                    />
                                  </div>
                                  <div class="form-group-request">
                                    <label
                                      class="text-base"
                                      for="name"
                                    >Empleados a asegurar:</label>
                                    <input
                                      id="employee_quantity_choice"
                                      v-model="aseg.employee_quantity_choice"
                                      class="form-control form-input"
                                      type="text"
                                    >
                                  </div>
                                  <div class="form-group-request">
                                    <label
                                      class="text-base"
                                      for="name"
                                    >Actividad Beneficiarios:</label>
                                    <input
                                      id="actividad_beneficiarios"
                                      v-model="aseg.actividad_beneficiarios"
                                      class="form-control form-input"
                                      type="text"
                                    >
                                  </div>
                                  <div class="form-group-request">
                                    <label
                                      class="text-base"
                                      for="name"
                                    >Tipo de jornada:</label>
                                    <input
                                      id="type_jornada"
                                      v-model="aseg.type_jornada"
                                      class="form-control form-input"
                                      type="text"
                                    >
                                  </div>
                                  <div class="form-group-request">
                                    <label
                                      class="text-base"
                                      for="name"
                                    >Duración del seguro:</label>
                                    <input
                                      id="time_quote"
                                      v-model="aseg.time_quote"
                                      class="form-control form-input"
                                      type="text"
                                    >
                                  </div>
                                  <div class="form-group-request">
                                    <label
                                      class="text-base"
                                      for="name"
                                    >SINIESTRALIDAD DE LOS ÚLTIMOS TRES AÑOS (MONTO Y PORCENTAJE):</label>
                                    <input
                                      id="observaciones"
                                      v-model="aseg.siniestralidad"
                                      class="form-control form-input"
                                      type="text"
                                    >
                                  </div>
                                  <div class="form-group-request">
                                    <label
                                      class="text-base"
                                      for="name"
                                    >Coberturas:</label>
                                    <b-form-tags
                                      id="coberturas-component-select"
                                      v-model="aseg.coberturas"
                                      size="md"
                                      add-on-change
                                      tag-variant="primary"
                                      no-outer-focus
                                    >
                                      <template #default="{
                                      tags,
                                      inputAttrs,
                                      inputHandlers,
                                      disabled,
                                      removeTag,
                                    }">
                                        <b-form-select
                                          v-bind="inputAttrs"
                                          :disabled="
                              disabled || availableOptions.length === 0
                            "
                                          :options="availableOptions3"
                                          class="form-control form-input custom-select mb-3"
                                          v-on="inputHandlers"
                                        >
                                          <template #first>
                                            <!-- This is required to prevent bugs with Safari -->
                                            <option
                                              disabled
                                              value=""
                                            >
                                              Seleccione una cobertura
                                            </option>
                                          </template>
                                        </b-form-select>
                                        <ul
                                          v-if="tags.length > 0"
                                          class="list-inline d-inline-block mb-2"
                                        >
                                          <li
                                            v-for="tag in tags"
                                            :key="tag"
                                            class="list-inline-item mb-2"
                                          >
                                            <b-form-tag
                                              :title="tag"
                                              :disabled="disabled"
                                              class="text-white"
                                              variant="primary"
                                              @remove="removeTag(tag)"
                                            >
                                              {{ tag }}
                                            </b-form-tag>
                                          </li>
                                        </ul>
                                      </template>
                                    </b-form-tags>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                        <div v-if="!ViewAditionalData">
                          <b-button
                            class="text-white shadow-dropdow btn-new ml-4"
                            variant="primary"
                            @click.prevent="saveRequestAditionalData"
                          >
                            Guardar cambios
                          </b-button>
                          <b-button
                            class="text-white shadow-dropdow btn-new ml-4"
                            variant="danger"
                            @click="ViewAditionalData = true"
                          >
                            Cancelar
                          </b-button>
                        </div>
                      </form>
                    </div>
                    <div class="signup-form-Client mt-2 py-3 py-md-0">
                      <form
                        id="register-form"
                        method="POST"
                        class="register-form"
                      >
                        <div class="form-row px-1">
                          <div class="w-25 product-title pt-0">
                            <h2 class="mb-4">
                              <fa-icon
                                :icon="['fas', 'edit']"
                                class="text-primary mr-2"
                              />Producto
                            </h2>
                          </div>
                          <a
                            href="#"
                            class="w-25 d-flex flex-row py-2 py-md-0"
                            @click="editProduct"
                          >
                            <span class="w-100 px-3 text-right cursor-pointer">
                              <fa-icon
                                :icon="['fas', 'edit']"
                                class="icon"
                              />
                              Modificar producto
                            </span>
                          </a>
                          <a
                            v-if="$store.state.localStorage.user.role !== 'EXT_KAM'"
                            href="#"
                            class="w-25 d-flex flex-row py-2 py-md-0"
                            @click="modalreasigproduct222 = true"
                          >
                            <span class="w-100 px-3 text-right cursor-pointer">
                              <fa-icon
                                :icon="['fas', 'share-square']"
                                class="icon"
                              />
                              Reasignar producto
                            </span>
                          </a>
                          <a
                            v-if="ProductExistente && productold"
                            href="#"
                            class="w-25 d-flex flex-row py-2 py-md-0"
                            @click="showmodaldocuments(ProductsRequest.id)"
                          >
                            <span class="w-100 px-3 text-right cursor-pointer">
                              <fa-icon
                                :icon="['fas', 'file-alt']"
                                class="icon"
                              />
                              Documentos
                            </span>
                          </a>
                        </div>
                        <div
                          v-if="!ProductExistente"
                          class="form-col"
                        >
                          <div class="form-group-request">
                            <label
                              class="label_subenlace"
                              for="city"
                              @click="
                                CheckAddProduct();
                                Changecomissionreferred2(Requestedit.referred);
                                ChangecomissionPartnership(
                                  Requestedit.campaign_slug
                                );
                              "
                            >
                              <fa-icon
                                :icon="['fas', 'plus']"
                                class="icon"
                              />
                              Nuevo producto
                            </label>
                          </div>
                          <div class="form-group-request">
                            <label
                              class="label_subenlace"
                              for="city"
                              @click="CheckAddExistProduct()"
                            >
                              <fa-icon
                                :icon="['fas', 'plus']"
                                class="icon"
                              />Asignar producto existente
                            </label>
                          </div>
                        </div>
                        <div
                          v-if="ProductExistente"
                          class="form-col"
                        >
                          <div class="form-group-request">
                            <table class="mb-0 w-100">
                              <tbody>
                                <tr>
                                  <td class="tableproduct new">
                                    ID Producto:
                                    <span class="new">
                                      {{ ProductsRequest.id }}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="tableproduct">
                                    N° Poliza:
                                    <span>
                                      {{ ProductsRequest.nro_poliza }}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="tableproduct">
                                    Producto:
                                    <span>{{
                                      getProductName(ProductsRequest.name)
                                    }}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="tableproduct">
                                    Compañia:
                                    <span>{{
                                      getCompanyName(ProductsRequest.company)
                                    }}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="tableproduct">
                                    <a
                                      v-if="$store.state.localStorage.user.role !== 'EXT_KAM'"
                                      href="#"
                                      class="w-100 d-flex flex-row"
                                      @click="SendCertificate(ProductsRequest.id)"
                                    >
                                      <span class="w-100 px-3 text-primary text-right cursor-pointer">
                                        <fa-icon
                                          :icon="['fas', 'file']"
                                          class="icon"
                                        />
                                        Enviar certificado
                                      </span>
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div
                    v-if="optiondetail === 'bitacora'"
                    class="w-cli mt-4 mt-md-0 mr-md-3"
                  >
                    <div class="signup-form-Client py-3 py-md-0">
                      <form
                        id="register-form"
                        method="POST"
                        class="register-form"
                      >
                        <div class="w-100 d-flex text-center text-md-left px-2 px-md-0 flex-column flex-md-row mb-4">
                          <div class="w-bitW">
                            <h4 class="mb-2 mb-md-4 text-left">
                              <fa-icon
                                :icon="['fas', 'file']"
                                class="text-primary mr-2"
                              />
                              Bitácora
                            </h4>
                          </div>
                          <div class="w-bitW text-left d-flex">
                            <a
                              class="solicitud-btn"
                              @click="showmodalbitacora(Requestedit.id)"
                            >
                              <fa-icon
                                :icon="['fas', 'plus']"
                                class="text-primary edit-ico mr-2"
                              />Agregar Bitacora
                            </a>
                          </div>
                        </div>
                        <div class="d-none d-md-block form-row w-100">
                          <b-table
                            :items="bitacorasolicitud"
                            :fields="bitacoraFields"
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
                            <template #cell(date)="{ value }">
                              {{ getBicatoraDate(value) }}
                            </template>
                            <template #cell(actions)="{ item }">
                              <div class="d-flex justify-content-center">
                                <!-- <button
                                  class="circle bg-white shadow-sm border p-3 mr-2"
                                  title="Eliminar Bitacora"
                                  @click.prevent="deletebitacora(item)"
                                >
                                  <fa-icon
                                    :icon="['fas', 'trash-alt']"
                                    class="text-danger"
                                    style="font-size: 0.9rem"
                                  />
                                </button> -->
                                <button
                                  class="circle bg-white shadow-sm border p-3"
                                  title="Editar"
                                  @click.prevent="editBitacora(item, Requestedit.id)"
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
                        </div>
                        <div class="d-block d-md-none form-row w-100 table-responsive">
                          <b-table
                            :items="bitacorasolicitud"
                            :fields="bitacoraFields"
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
                            <template #cell(date)="{ value }">
                              {{ getBicatoraDate(value) }}
                            </template>
                            <template #cell(actions)="{ item }">
                              <div class="d-flex justify-content-center">
                                <!-- <button
                                  class="circle bg-white shadow-sm border p-3 mr-2"
                                  title="Eliminar Bitacora"
                                  @click.prevent="deletebitacora(item)"
                                >
                                  <fa-icon
                                    :icon="['fas', 'trash-alt']"
                                    class="text-danger"
                                    style="font-size: 0.9rem"
                                  />
                                </button> -->
                                <button
                                  class="circle bg-white shadow-sm border p-3"
                                  title="Editar"
                                  @click.prevent="editBitacora(item, Requestedit.id)"
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
                        </div>

                        <div class="form-row w-100 py-4 py-md-0">
                          <div class="flex w-full text-left text-md-right justify-content-end completo">
                            <b-button
                              class="text-white shadow-dropdow btn-new ml-4"
                              variant="primary"
                              @click="showmodalbitacora(Requestedit.id)"
                            >
                              Agregar Nueva Bitacora
                            </b-button>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div class="signup-form-Client mt-2 py-3 py-md-0">
                      <form
                        id="register-form"
                        method="POST"
                        class="register-form"
                      >
                        <div class="form-row px-1">
                          <div class="w-25 product-title pt-0">
                            <h2 class="mb-4">
                              <fa-icon
                                :icon="['fas', 'edit']"
                                class="text-primary mr-2"
                              />Producto
                            </h2>
                          </div>
                          <div class="w-75 d-flex flex-column flex-md-row mb-4 mb-md-0">
                            <a
                              v-if="ProductExistente"
                              href="#"
                              class="w-1-3 d-flex flex-row pb-4 pb-md-0"
                              @click="editProduct"
                            >
                              <span class="w-100 px-3 text-right cursor-pointer">
                                <fa-icon
                                  :icon="['fas', 'edit']"
                                  class="icon"
                                />
                                Modificar producto
                              </span>
                            </a>
                            <a
                              v-if="ProductExistente && productold && $store.state.localStorage.user.role !== 'EXT_KAM'"
                              href="#"
                              class="w-1-3 d-flex flex-row pb-4 pb-md-0"
                              @click="modalreasigproduct2 = true"
                            >
                              <span class="w-100 px-3 text-right cursor-pointer">
                                <fa-icon
                                  :icon="['fas', 'share-square']"
                                  class="icon"
                                />
                                Reasignar producto
                              </span>
                            </a>
                            <a
                              v-if="ProductExistente && productold"
                              href="#"
                              class="w-1-3 d-flex flex-row pb-4 pb-md-0"
                              @click="showmodaldocuments(ProductsRequest.id)"
                            >
                              <span class="w-100 px-3 text-right cursor-pointer">
                                <fa-icon
                                  :icon="['fas', 'file-alt']"
                                  class="icon"
                                />
                                Documentos
                              </span>
                            </a>
                          </div>
                        </div>
                        <div
                          v-if="!ProductExistente"
                          class="form-col pl-2 pl-md-0"
                        >
                          <div class="form-group-request">
                            <label
                              class="label_subenlace"
                              for="city"
                              @click="
                                CheckAddProduct();
                                Changecomissionreferred2(Requestedit.referred);
                                ChangecomissionPartnership(
                                  Requestedit.campaign_slug
                                );
                              "
                            >
                              <fa-icon
                                :icon="['fas', 'plus']"
                                class="icon"
                              />
                              Nuevo producto
                            </label>
                          </div>
                          <div class="form-group-request">
                            <label
                              class="label_subenlace"
                              for="city"
                              @click="CheckAddExistProduct()"
                            >
                              <fa-icon
                                :icon="['fas', 'plus']"
                                class="icon"
                              />Asignar producto existente
                            </label>
                          </div>
                        </div>
                        <div
                          v-if="ProductExistente"
                          class="form-col"
                        >
                          <div class="form-group-request">
                            <table class="mb-0 w-100">
                              <tbody>
                                <tr>
                                  <td class="tableproduct new">
                                    ID Producto:
                                    <span class="new">
                                      {{ ProductsRequest.id }}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="tableproduct">
                                    N° Poliza:
                                    <span>
                                      {{ ProductsRequest.nro_poliza }}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="tableproduct">
                                    Producto:
                                    <span>{{
                                      getProductName(ProductsRequest.name)
                                    }}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="tableproduct">
                                    Compañia:
                                    <span>{{
                                      getCompanyName(ProductsRequest.company)
                                    }}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="mb-4" />
                                </tr>
                                <tr>
                                  <td class="tableproduct">
                                    <a
                                      v-if="$store.state.localStorage.user.role !== 'EXT_KAM'"
                                      href="#"
                                      class="w-100 d-flex flex-row"
                                      @click="SendCertificate(ProductsRequest.id)"
                                    >
                                      <span class="w-100 px-3 text-primary text-right cursor-pointer">
                                        <fa-icon
                                          :icon="['fas', 'file']"
                                          class="icon"
                                        />
                                        Enviar certificado
                                      </span>
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div
                    v-show="optiondetail === 'historial'"
                    class="dataCentral mt-4 mt-md-0"
                  >
                    <div class="signup-form-Client py-3 py-md-0">
                      <history-request
                        :historyedit="history"
                        :loading="loadingH"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <reasignar-product-request2
              v-if="modalreasigproduct2"
              @hidde="onCloseModal"
              @cancel-lead="onCloseModal"
              @UpdateProduct="UpdateProductNew"
            />
            <reasignar-product-request-edit
              v-if="modalreasigproductedit"
              @hidde="onCloseModal"
              @cancel-lead="onCloseModal"
              @UpdateContactEdit="UpdateContactNew"
            />
          </div>
          <request-product-modal
            v-if="addproduct"
            :user="Requestedit.user"
            :commission="commission"
            :dataproduct="ProductsRequest2"
            :requestidpass="Requestedit"
            :comesto="cometo"
            @hidde="onCloseModal"
            @save-lead="onSaveProduct"
            @cancel-lead="onCloseModal"
          />
          <request-product-modal-edit
            v-if="editProducts"
            :cobranza="CobranzaPay"
            :dataproduct="ProductsRequest"
            :requestidpass="Requestedit"
            :user="Requestedit.user"
            :commission="commission"
            @hidde="onCloseModal"
            @save-lead="onSaveProductEdit"
            @cancel-lead="onCloseModal"
          />
        </div>
      </div>
    </div>
    <b-modal
      ref="modal-alertreque"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5 pb-3">
        <h3 class="title-text">
          El registro de la solicitud fue guardado exitosamente
        </h3>
      </div>
      <div class="my-2 text-right">
        <b-button
          class="btn-new ml-4"
          variant="outline-primary"
          @click="getSavedRequest2(requestnew)"
        >
          Ir a la solicitud
        </b-button>
        <b-button
          class="text-white btn-new ml-4"
          variant="primary"
          @click="getSavedRequest(requestnew)"
        >
          <span v-if="optioncliente === 'clientes'"> Regresar al cliente </span>
          <span v-if="optioncliente === 'leadsnew'"> Regresar al lead </span>
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-alertrequeeditAditional"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5 pb-3">
        <h3 class="title-text">
          Los cambios de la solicitud fue guardado exitosamente
        </h3>
      </div>
      <div class="my-2 text-right">
        <b-button
          class="btn-new ml-4"
          variant="outline-primary"
          @click="closeRequestAlertModalAditional()"
        >
          Cerrar
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-alertrequeedit"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5 pb-3">
        <h3 class="title-text">
          Los cambios de la solicitud fue guardado exitosamente
        </h3>
      </div>
      <div class="my-2 text-right">
        <b-button
          class="btn-new ml-4"
          variant="outline-primary"
          @click="getSavedRequest2(requestnew)"
        >
          Ir a la solicitud
        </b-button>
        <b-button
          class="text-white btn-new ml-4"
          variant="primary"
          @click="getSavedRequest(requestnew)"
        >
          <span v-if="optioncliente === 'clientes'"> Regresar al cliente </span>
          <span v-if="optioncliente === 'leadsnew'"> Regresar al lead </span>
        </b-button>
      </div>
    </b-modal>
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
          El registro de la solicitud fue guardado exitosamente
        </h3>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4 mt-3"
          variant="primary"
          @click="closeRequestAlertModal"
        >
          ¡Entendido!
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-alert3"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h5 class="text-base title-text">
          Se ha reasignado el producto a la solicitud correctamente
        </h5>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4 mt-3"
          variant="primary"
          @click="closeRequestAlertModal3"
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
        <h5 class="text-base title-text">
          Se ha guardado la información del producto
        </h5>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4 mt-3"
          variant="primary"
          @click="closeRequestAlertModal4"
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
        <h5 class="text-base title-text">
          Se ha reasignado el contacto de la solicitud correctamente
        </h5>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4 mt-3"
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
          Se ha borrado la solicitud correctamente
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
      ref="modal-alert-bitacora"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h5 class="text-base title-text">
          El registro de la Bitacora fue exitoso
        </h5>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4 mt-3"
          variant="primary"
          @click="closeRequestAlertModalBitacora"
        >
          ¡Entendido!
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-alert-bitacoraEdit"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h5 class="text-base title-text">
          El registro de la Bitacora fue Modificado
        </h5>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4 mt-3"
          variant="primary"
          @click="closeRequestAlertModalBitacoraEdit"
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
      ref="modal-alert13"
      h-e-a-d
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h5 class="text-base title-text">
          Se
          elimino
          el
          empleado
          correctamente
        </h5>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4 mt-3"
          variant="danger"
          @click="closeRequestAlertModal13"
        >
          ¡Entendido!
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-alert-deleteB"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h5 class="text-base title-text">
          Se
          elimino
          el
          registro
          de
          bitacora
          correctamente
        </h5>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4 mt-3"
          variant="danger"
          @click="closeRequestAlertModalBitacoraDelete"
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
        <h5 class="text-base title-text">
          Se envio el correo correctamente
        </h5>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4 mt-3"
          variant="danger"
          @click="closeRequestAlertModal9"
        >
          ¡Entendido!
        </b-button>
      </div>
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
        <h5 class="text-base title-text">
          Se envio el whatsapp correctamente
        </h5>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4 mt-3"
          variant="danger"
          @click="closeRequestAlertModal10"
        >
          ¡Entendido!
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-alert11"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h5 class="text-base title-text">
          Para poner esta solicitud en estatus cerrado tiene que agregar un
          producto
        </h5>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4 mt-3"
          variant="danger"
          @click="closeRequestAlertModal11"
        >
          ¡Entendido!
        </b-button>
      </div>
    </b-modal>
    <b-modal
      ref="modal-alert12"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <div class="pt-5">
        <h5 class="text-base title-text">
          Para poner agregar un producto, la ficha del cliente al que pertenece
          esta solicitud debe estar llenada completamente
        </h5>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new mt-3"
          variant="success"
          @click="closeRequestAlertModal12"
        >
          ¡Entendido!
        </b-button>
        <nuxt-link
          :to="{
            name: 'clientes',
            query: {
              id: InfoContact.id,
              idrequest: Requestedit.id,
            },
          }"
          class="w-100 text-right"
        >
          <b-button
            class="text-white shadow-dropdow btn-new ml-4 mt-3"
            variant="danger"
          >
            ¡Ir al contacto!
          </b-button>
        </nuxt-link>
      </div>
    </b-modal>
    <b-modal
      ref="modal-new-colectivo"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <section class="ftco-section">
        <div class="form-row w-100 d-flex justify-content-center mt-4">
          <div class="form-group-relation w-100">
            <h3 class="title">
              Por favor Ingrese los campos
            </h3>
            <label
              class="text-base mt-2"
              for="rut"
            >Rut :</label>
            <input
              id="rut"
              v-model="ColectivoData.rut"
              placeholder=""
              class="form-control form-input mt-0 w-50"
              type="text"
            >
            <div class="w-100 d-flex flex-row mt-3">
              <div class="w-50 d-flex flex-column mr-2">
                <label
                  class="text-base"
                  for="name"
                >Nombre :</label>
                <input
                  id="titulo"
                  v-model="ColectivoData.name"
                  placeholder=""
                  class="form-control form-input"
                  type="text"
                >
              </div>
              <div class="w-50 d-flex flex-column">
                <label
                  class="text-base"
                  for="last_name"
                >Apellido :</label>
                <input
                  id="last_name"
                  v-model="ColectivoData.last_name"
                  placeholder=""
                  class="form-control form-input"
                  type="text"
                >
              </div>
            </div>
            <div class="w-100 d-flex flex-row mt-3">
              <div class="w-50 d-flex flex-column mr-2">
                <label
                  class="text-base"
                  for="name"
                >Profesión :</label>
                <input
                  id="descripcion"
                  v-model="ColectivoData.profession"
                  placeholder=""
                  class="form-control form-input "
                  type="text"
                >
              </div>
              <div class="w-50 d-flex flex-column">
                <label
                  class="text-base "
                  for="name"
                >Especialidad :</label>
                <input
                  id="descripcion"
                  v-model="ColectivoData.specialty"
                  placeholder=""
                  class="form-control form-input "
                  type="text"
                >
              </div>
            </div>
            <div class="w-100 d-flex flex-row mt-3">
              <div class="w-50 d-flex flex-column mr-2">
                <label
                  class="text-base "
                  for="name"
                >Telefono :</label>
                <input
                  id="descripcion"
                  v-model="ColectivoData.phone"
                  placeholder=""
                  class="form-control form-input"
                  type="text"
                >
              </div>
              <div class="w-50 d-flex flex-column">
                <label
                  class="text-base "
                  for="name"
                >Correo :</label>
                <input
                  id="descripcion"
                  v-model="ColectivoData.email"
                  placeholder=""
                  class="form-control form-input"
                  type="text"
                >
              </div>
            </div>
            <div class="w-100 d-flex flex-row mt-3">
              <div class="w-50 d-flex flex-column mr-2">
                <div class="w-100 d-flex flex-column">
                  <label
                    class="text-base mt-0"
                    for="father_name"
                  >Sexo* :</label>
                  <b-form-select
                    id="user"
                    v-model="ColectivoData.sex"
                    :options="SexoOpciones"
                    class="form-control form-input"
                    required
                  />
                </div>
              </div>
              <div class="w-50 d-flex flex-column mr-2">
                <label
                  class="text-base"
                  for="name"
                >Fecha Nacimiento :</label>

                <input
                  id="fecha"
                  v-model="ColectivoData.birthday"
                  placeholder=""
                  class="form-control form-input"
                  type="date"
                >
              </div>
            </div>
            <div class="w-100 d-flex flex-row mt-3">
              <div class="w-50 d-flex flex-column mr-2">
                <div class="w-100 d-flex flex-column">
                  <label
                    class="text-base mt-0"
                    for="father_name"
                  >Estatus* :</label>
                  <b-form-select
                    id="user"
                    v-model="ColectivoData.status"
                    :options="EstatusColectivoOpciones"
                    class="form-control form-input"
                    required
                  />
                </div>
              </div>
            </div>
            <b-button
              class="text-white p-2 px-3 mt-5"
              size="sm"
              variant="danger"
              @click="hidecolectivoModal()"
            >
              Cancelar
            </b-button>
            <b-button
              v-if="StatusColectivo === 'new'"
              class="text-white p-2 px-3 mt-5 ml-4"
              size="sm"
              variant="primary"
              @click="PostEventColectivo()"
            >
              Crear
            </b-button>
            <b-button
              v-if="StatusColectivo === 'mod'"
              class="text-white p-2 px-3 mt-5 ml-4"
              size="sm"
              variant="primary"
              @click="ModEventColectivo()"
            >
              Modificar
            </b-button>
          </div>
        </div>
      </section>
    </b-modal>

    <b-modal
      ref="modal-cetificate"
      size="lg"
      centered
      hide-footer
      hide-header
      body-class="padding-modal"
      content-class="border-0 radius"
    >
      <section class="ftco-section">
        <div class="form-row w-100 d-flex justify-content-center mt-4">
          <div class="form-group-relation w-100">
            <h3 class="title">
              Enviar Certificado
            </h3>

            <div class="w-100 d-flex flex-row mt-3">
              <div class="w-50 d-flex flex-column mr-2">
                <div class="w-100 d-flex flex-column">
                  <label
                    class="text-base mt-0"
                    for="tipoCertificado"
                  >Tipo de Certificado* :</label>
                  <b-form-select
                    id="tipoCertificado"
                    v-model="tipoCertificado"
                    :options="OpcionesCertificado"
                    class="form-control form-input"
                    required
                    @change="handleTipoCertificadoChange"
                  />
                </div>
              </div>
            </div>
            <label
              v-if="mostrarMensajeDelCertificado"
              class="text-base mt-2"
              for="mensajeDelCertificado"
            >Mensaje:</label>
            <textarea
              v-if="mostrarMensajeDelCertificado"
              id="mensajeDelCertificado"
              v-model="mensajeDelCertificado"
              placeholder=""
              style="height: 100px !important; width: 100% !important;"
            />
            <div class="w-100 d-flex flex-col mt-3">
              <div class="w-100 d-flex flex-col mr-2">
                <div class="w-50 d-flex flex-col">
                  <input
                    id="checkSendKam"
                    v-model="checkSendKam"
                    type="checkbox"
                    checked
                  >
                  <label
                    for="checkSendKam"
                    class="text-base mt-0 ml-2"
                  >Enviar a la Kam</label>
                </div>
              </div>
            </div>
            <div class="w-100 d-flex flex-col mt-3">
              <div class="w-100 d-flex flex-col mr-2">
                <div class="w-100 d-flex flex-row">
                  <input
                    id="checksendO"
                    v-model="checksendO"
                    type="checkbox"
                    @click="handleCheckboxClick()"
                  >
                  <label
                    for="checksendO"
                    class="text-base mt-0 ml-2"
                  >Enviar a otro</label>
                </div>
              </div>
            </div>
            <div
              v-if="checksendO"
              class="w-100 d-flex flex-col mt-3"
            >
              <div class="w-100 d-flex flex-col mr-2">
                <div class="w-100 d-flex flex-row">
                  <input
                    id="emailToSend"
                    v-model="emailToSend"
                    style="width: 15rem !important; border:1px solid #505755"
                    type="email"
                  >
                </div>
              </div>
            </div>
            <b-button
              class="text-white p-2 px-3 mt-5"
              size="sm"
              variant="danger"
              @click="hideModalSendCertificate()"
            >
              Cancelar
            </b-button>
            <b-button
              v-if="StatusColectivo === 'new'"
              class="text-white p-2 px-3 mt-5 ml-4"
              size="sm"
              variant="primary"
              @click="PostEmisionDocument()"
            >
              Enviar
            </b-button>
          </div>
        </div>
      </section>
    </b-modal>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import _ from 'lodash'
import { validateRut } from '@fdograph/rut-utilities'
import parsePhoneNumber from 'libphonenumber-js'
import Session from '@/mixins/auth'
import Comunascl from '~/static/comunascl.json'
import SModal from '@/components/base/SModalDocuments.vue'
import BModalBitacora from '@/components/base/SModalBitacora.vue'
import productscl from '~/static/productsgroup.json'
import productsmx from '~/static/productsgroupmx.json'
import companiescl from '~/static/companies.json'
import companiesmx from '~/static/companiesmx.json'
import employes from '~/static/employes.json'
import states3 from '~/static/states.json'
import states2 from '~/static/statesposventa.json'
import SToolBar from '~/components/base/SToolBar.vue'
import RequestProductModal from '~/components/RequestProductModal.vue'
import DownloadCsv from '~/components/DownloadCsv.vue'
import ToolTip from '~/components/base/tooltip.vue'
import giroscl from '~/static/giroscl.json'
import girosmx from '~/static/girosmx.json'
import RequestProductModalEdit from '~/components/RequestProductModalEdit.vue'
import ReasignarProductRequest from '~/components/ReasignarProductRequest.vue'
import ReasignarProductRequestEdit from '~/components/ReasignarProductRequestEdit.vue'
import ReasignarProductRequest2 from '~/components/ReasignarProductRequest2.vue'
import leadsStaticVars from '~/static/leadsStaticVars.json'
import SInputSelect from '~/components/base/SInputSelect.vue'
import municipiosmx from '~/static/municipiosmx.json'
import coloniasmx from '~/static/coloniasmx.json'
import HistoryRequest from '~/components/HistoryRequest.vue'
export default {
  components: {
    SToolBar,
    RequestProductModal,
    RequestProductModalEdit,
    ReasignarProductRequest,
    ReasignarProductRequest2,
    ReasignarProductRequestEdit,
    ToolTip,
    SModal,
    BModalBitacora,
    SInputSelect,
    DownloadCsv,
    HistoryRequest
  },
  mixins: [Session],
  data () {
    return {
      viewRequestMobile: true,
      AditionalDataEdit: {},
      AditionalDataAp: {
        observaciones: '',
        AseguradosAdicionales: [],
      },
      history: {},
      loadingH: true,
      newbtn: true,
      idRequestToSend: 45,
      Comunascl,
      page: 1,
      pages: 1,
      option: 'table',
      idcolectivo: '',
      StatusColectivo: 'new',
      employes,
      ValidateMunicipios: false,
      ValidateComuna: false,
      requestval: true,
      requestbitacoraval: true,
      optionProducts: {},
      Places: {},
      addproduct: false,
      editProducts: false,
      ProductExistente: false,
      Botonguardarcambios: false,
      requestid: '',
      ColectivoData: [],
      documentsproducts: [],
      productold: false,
      dataproducto: [],
      loader: false,
      loading: true,
      mensajeloader: '',
      infonewclientfull: false,
      opcionlink: '',
      asignclientexistnewequest: false,
      requestdinamin: {},
      leadid: '',
      statesReason: {},
      messaggepartnert: '',
      essaggepartnert2: '',
      priority_class: '',
      fieldsOption: 'normal',
      fields: [],
      fieldsdefault: leadsStaticVars.tableFieldsRequest,
      fieldsventas: leadsStaticVars.tableFieldsRequestVentas,
      Requeses: {},
      Requesesprioridad: {},
      channelreferido: 'ejecutivos-externos',
      InfoContact: {},
      optioncliente: '',
      products: {},
      version: '',
      newItems: [],
      idcliente: '',
      search: '',
      Requestedit: {},
      commission: 0,
      sitio: 'historial',
      modalreasigproduct: false,
      modalreasigproduct2: false,
      modalreasigproductedit: false,
      totalRows: 1,
      totalRows2: 1,
      optiondetail: 'bitacora',
      giros: [],
      selectedCountry: null,
      codePhone: null,
      modaldocuments: false,
      refferals_ext_list: [
        { value: 0, text: 'Fabián Pinto' },
        { value: 1, text: 'Mauricio Solís' },
        { value: 2, text: 'Bárbara Soto' },
        { value: 3, text: 'Carolina Escobar' },
        { value: 4, text: 'Javier Henríquez' },
        { value: 5, text: 'Katherine Cisternas' },
        { value: 6, text: 'Luis Ramos' },
        { value: 7, text: 'Liliana Durán' },
        { value: 8, text: 'Vanessa Cerda' },
        { value: 9, text: 'Catalina Morales' },
        { value: 10, text: 'Alex Bull' },
        { value: 11, text: 'Miriam Milanca' },
        { value: 12, text: 'Jeannette Droguett' }

      ],
      SexoOpciones: [
        { value: 'M', text: 'Masculino' },
        { value: 'F', text: 'Femenino' }
      ],
      EstatusColectivoOpciones: [
        { value: 'solicitante', text: 'Solicitante' },
        { value: 'inactivo', text: 'Inactivo' },
        { value: 'activo', text: 'Activo' }
      ],
      OpcionesCertificado: [
        { value: 'poliza', text: 'Poliza' },
        { value: 'pagosAlDia', text: 'Pagos al Día' },
        { value: 'endoso', text: 'Endoso' }
      ],
      tipoCertificado: 'poliza',
      mensajeDelCertificado: '',
      checkSendKam: true,
      checksendO: false,
      emailToSend: '',
      mostrarMensajeDelCertificado: false,
      currentIdProduct: null,
      modalbitacora: false,
      bitacorarequestdata: [],
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
      optionsPerson: [
        { value: 'legal_person', text: 'Jurídica' },
        { value: 'natural_person', text: 'Natural' }
      ],
      optionsPersonCL: [
        { value: 'legal_person', text: 'Jurídica' },
        { value: 'natural_person', text: 'Natural' }
      ],
      optionsPersonMX: [
        { value: 'legal_person', text: 'Moral' },
        { value: 'natural_person', text: 'Fisica' }
      ],
      NamesCL: {
        rut: 'Rut',
        comuna: 'Comuna'
      },
      NamesMX: {
        rut: 'Rfc',
        comuna: 'Colonia'
      },
      Names: '',
      ProductsRequest2: {},
      cometo: '',
      ProductsRequest: {
        id: '',
        nro_poliza: '',
        name: '',
        company: ''
      },
      companies: {},
      CobranzaPay: {},
      productdetails: [],
      productnodetails: [],
      documentossolicitud: [],
      colectivossolicitud: [],
      bitacorasolicitud: [],
      quoterRouteClient: {
        path: '/clientes',
        query: {
          data: this.InfoContact
        }
      },
      requestnew: [],
      Request: {
        product_interest: null,
        product_group: null,
        request_type: null,
        state: null,
        channel: null,
        campaign_slug: null,
        priority: null,
        priority_score: null,
        place: null,
        state_reason: null,
        user: null,
        comment: null,
        referred: null,
        referral_code: null
      },
      idproduct: '',
      idrequest: '',
      idToSendNewPro: 0,
      dateevent: null,
      ViewOmitidos: false,
      ViewAditionalData: true,
      Leads: {
        rut: null,
        razon_social: null,
        name: null,
        last_name: null,
        email: null,
        phone: null,
        person: null,
        giro: null,
        address: null,
        comuna: null,
        employee_quantity_choice: null
      },
      stateresuelto: {
        value: "resuelto",
        text: "Resuelto"
      },
      states2,
      states3,
      states: states3.filter(({ value }) => value !== 'sin_estado' && value !== 'resuelto'),
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
      bitacoraFields: [
        {
          key: 'title',
          label: 'Titulo',
          sortable: false
        },
        {
          key: 'description',
          label: 'Descripcion',
          sortable: false
        },
        {
          key: 'date',
          label: 'Fecha Registro',
          sortable: false
        },
        {
          key: 'actions',
          label: 'Acciones'
        }
      ],
      colectivoFields: [
        {
          key: 'rut',
          label: 'Rut',
          sortable: false
        },
        {
          key: 'name',
          label: 'Nombre',
          sortable: false
        },
        {
          key: 'last_name',
          label: 'Apellido',
          sortable: false
        },
        {
          key: 'status',
          label: 'Estatus',
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
      modalShow: false,
      Modal: {
        slider1: true,
        slider2: false
      }
    }
  },
  computed: {
    ...mapState(['leadsFilters', 'leadFromSocket', 'leads']),
    ...mapState('leads', ['users', 'channels', 'campanas', 'loadingLeads']),
    ...mapState('localStorage', ['user', 'userPermissions']),
    channels () {
      return this.$store.state.leads.channels.map(({ id, name }) => ({
        value: id,
        text: name
      }))
    },
    executives () {
      return this.$store.state.leads.userskam.map(({ id, email }) => ({
        value: id,
        text: email
      }))
    },
    getMunicipios2 () {
      const options = municipiosmx
        .filter(key => key.postal)
        .map((obj) => {
          return {
            value: obj.value,
            text: obj.text
          }
        })
      if (options.length) {
        this.ValidateMunicipios = false
        return options
      } else {
        this.ValidateMunicipios = true
      }
    },
    executivesall () {
      return this.$store.state.leads.users.map(({ id, email }) => ({
        value: id,
        text: email
      }))
    },
    refferals () {
      return this.$store.state.leads.refferals.map(
        ({ id, name, comision }) => ({
          value: id,
          text: name,
          commission: comision
        })
      )
    },
    availableOptions3 () {
      const opcion = [
        {
          text: 'MUERTE ACCIDENTAL',
          value: 'muerte_accidental'
        },
        {
          text: 'INCAPACIDAD TOTAL Y PERMANENTE POR ACCIDENTE',
          value: 'incapacidad_total_y_permante_por_accidente'
        },
        {
          text: 'DESMEMBRAMIENTO ACCIDENTAL',
          value: 'desmembramiento_accidental'
        },
        {
          text: 'GASTOS MÉDICOS POR ACCIDENTE',
          value: 'gastos_medicos_por_accidente'
        },
        {
          text: 'GASTOS FUNERARIOS POR ACCIDENTE',
          value: 'gastos_funerarios_por_accidente'
        },
      ]
      return opcion
    },
    availableOptions () {
      if (typeof this.Request.tags === 'undefined') {
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
        return lead
      } else {
        const etiquetaslead = this.leads.etiquetas.filter(
          ({ value }) => !this.Request.tags.includes(value)
        )
        const lead = []
        for (const [key, value] of Object.entries(etiquetaslead)) {
          if (value) {
            const newlead = {
              text: value.id,
              value: value.id
            }
            lead.push(newlead)
          }
        }
        return lead
      }
    },
    availableOptions2 () {
      if (typeof this.Requestedit.tags === 'undefined') {
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
        return lead
      } else {
        let etiquetas = this.leads.etiquetas
        etiquetas = etiquetas.filter(
          ({ value }) => !this.Requestedit.tags.includes(value)
        )
        const lead = []
        for (const [key, value] of Object.entries(etiquetas)) {
          if (value) {
            const newlead = {
              text: value.id,
              value: value.id
            }
            lead.push(newlead)
          }
        }
        return lead
      }
    },
    fullNumber: {
      // getter
      get () {
        return this.codigoPhone()
      },
      // setter
      set (newValue) {
        this.resetPhone(newValue)
      }
    },
    thereAreNoFiltersApplied () {
      const { page } = this
      return page === 1
    },
    urlParams () {
      return {
        sort_by: this.sort,
        search: this.leadsFilters.search,
        searchrut: this.searchrut,
        rut: this.rut,
        user: this.leadsFilters.id,
        states: this.leadsFilters.states,
        tags: this.leadsFilters.tags,
        start: this.leadsFilters.startDate,
        end: this.leadsFilters.endDate,
        partnership: this.leadsFilters.partnership,
        priorities_scores: this.leadsFilters.priorities_scores,
        referred: this.leadsFilters.refferal,
        channel: this.leadsFilters.channel,
        product_group: this.leadsFilters.product_group,
        request_type: this.leadsFilters.request_type,
        campaign_slugs: this.leadsFilters.campaign_slugs,
        date_type: this.leadsFilters.date_type
      }
    }
  },
  watch: {
    leadFromSocket: {
      handler (newvalue, oldvalue) {
        if (newvalue !== oldvalue && this.thereAreNoFiltersApplied) {
          this.pushNewLead(newvalue)
        }
      }
    },
    urlParams: {
      deep: true,
      handler () {
        if (!this.loadingLeads) {
          this.ListRequests(this.page)
        }
      }
    }
  },
  created () {
    if (this.$store.state.localStorage.user.role === 'EXT_KAM') {
      this.newbtn = true
      this.Request.user = this.$store.state.localStorage.user.id
      this.Request.channel = 115
      if (this.$store.state.localStorage.user.partnership === 3) {
        this.Request.campaign_slug = 'alvi'
      }
    }
    this.idRequestToSend = 100
    this.fields = this.fieldsdefault
    const idrequest = this.$route.query?.idrequest
    const id = this.$route.query?.id
    const tipo = this.$route.query?.tipo
    const poliza = this.$route.query?.poliza
    const comeTo = this.$route.query?.comeTo
    this.cometo = comeTo
    this.resetFilters(this.leadsFilters)

    if (idrequest) {
      if (poliza) {
        this.getRequestQuery2(idrequest, poliza)
      } else {
        this.getRequestQuery(idrequest)
      }
      if (tipo) {
        this.optioncliente = tipo
      } else {
        this.optioncliente = ''
      }
      this.sitio = 'solicitudes'
    }
    if (id) {
      this.option = 'new'
      if (!tipo) {
        this.optioncliente = ''
        this.getRequestQuery(id)
      } else {
        this.optioncliente = tipo
        this.UpdateContactNewRequest(id)
      }
      this.idcliente = id
    } else {
      this.ListRequests()
    }
    this.idcolectivo = ''
    /* setInterval(() => {
       this.refreshLeads()
     }, 300000)
     */
    if (process.env.version === 'CL') {
      this.giros = giroscl
      this.groups = this.groupscl
      this.version = 'cl'
      this.products = productscl
      this.Names = this.NamesCL
      this.optionsPerson = this.optionsPersonCL
      this.companies = companiescl
    } else {
      this.giros = girosmx
      this.groups = this.groupsmx
      this.version = 'mx'
      this.products = productsmx
      this.Names = this.NamesMX
      this.optionsPerson = this.optionsPersonMX
      this.companies = companiesmx
    }
    this.optionProducts = Object.values(this.products).reduce(
      (acc, curr) => [...acc, ...curr],
      []
    )
    //this.resetFilters(this.leadsFilters)
    // this.ListPlace()
    // this.ListStateReason()
  },
  beforeDestroy () {
    this.setLoadingLeads(false)
  },
  methods: {
    ...mapActions(['getCsvRequest']),
    ...mapMutations(['setFilters']),
    ...mapMutations('leads', ['clearCsvInfo', 'setLoadingLeads']),
    viewDataRequest () {
      this.viewRequestMobile = !this.viewRequestMobile
    },
    async getHistory (idrequest) {
      try {
        const res = await this.$simpleeApi.get(
          `/request_history/?search=${idrequest}`
        )
        this.history = res.data.results
        // console.log('this.history',this.history)
        this.loadingH = false;
      } catch (error) {
        store.commit('setAlertMessage', error.response.data)
      }
    },
    addAseguradosAdicionales () {
      const newlead = {
        employee_quantity_choice: '',
        actividad_beneficiarios: '',
        type_jornada: '',
        time_quote: '',
        siniestralidad: '',
        coberturas: '',
      }
      console.log(this.AditionalDataAp.AseguradosAdicionales, newlead, this.AditionalDataAp)
      this.AditionalDataAp.AseguradosAdicionales.push(newlead)
    },
    StatusInfo () {
      if (this.Requestedit.request_type) {
        if (this.Requestedit.request_type === 'denuncia_siniestro' || this.Requestedit.request_type === 'cancelacion_o_anulacion_de_poliza' || this.Requestedit.request_type === 'soporte') {
          this.states = this.states2
        } else {
          this.states = this.states3
        }
      }
    },
    StatusInfo2 () {
      if (this.Request.request_type) {
        if (this.Request.request_type === 'denuncia_siniestro' || this.Request.request_type === 'cancelacion_o_anulacion_de_poliza' || this.Request.request_type === 'soporte') {
          this.states = this.states2
        } else {
          this.states = this.states3
        }
      }
    },
    removeAseguradosAdicionales (index) {
      this.AditionalDataAp.AseguradosAdicionales.splice(index, 1)
    },
    editAditionalData () {
      this.ViewAditionalData = false
    },
    PostPDF () {
      const id = this.Requestedit.id
      this.$bvModal
        .msgBoxConfirm('¿Desea generar un PDF de esta cotización?', {
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
            this.PostPDFEnd(id)
          }
        })
    },
    async PostPDFEnd (id) {
      try {
        const { data } = await this.$simpleeApi.post('/export_request_pdf/', {
          id: id,
          user: this.$store.state.localStorage.user.id
        })
        console.log(data)
        this.$store.commit('setAlertMessage', {
          success: 'Se ha enviado el pdf a su correo!'
        })
      } catch (error) {
        store.commit('setAlertMessage', error.response.data)
      }
    },
    async getRequestQuery (id) {
      const data = await this.$GetRequest(id)
      this.openExistingLead(data)
    },
    async getRequestQuery2 (id, poliza) {
      const data = await this.$GetRequest(id)
      this.openExistingLead3(data, poliza)
    },
    capitalizarPrimeraLetra (str) {
      return str.toUpperCase()
    },
    async getProductPo (id) {
      const Response = await this.$GetProductRequest(id)
      if (Response.collect_payment) {
        this.CobranzaPay = await this.$GetProductCobranzaPoliza(Response.collect_payment.id)
      }
      Response.parent_product = id
      Response.product_type = null
      delete Response.id
      delete Response.unique_id
      this.ProductsRequest2 = Response
      this.addproduct = true
    },
    ChangeOptionFilter (value) {
      if (value === 'pay') {
        this.fieldsOption = 'pay'
      } else {
        this.fieldsOption = 'normal'
      }
      this.ChangeFields()
    },
    ChangeFields () {
      if (this.fieldsOption === 'pay') {
        this.fields = this.fieldsventas
      } else {
        this.fields = this.fieldsdefault
      }
    },
    getMunicipios (id) {
      const options = municipiosmx
        .filter(key => key.postal === id)
        .map((obj) => {
          return {
            value: this.capitalizarPrimeraLetra(obj.value),
            text: this.capitalizarPrimeraLetra(obj.text)
          }
        })
      if (options.length > 0) {
        this.ValidateMunicipios = false
        return options
      } else {
        this.ValidateMunicipios = true
      }
    },
    getComunas (id) {
      const options = coloniasmx
        .filter(key => key.postal === id)
        .map((obj) => {
          return {
            value: this.capitalizarPrimeraLetra(obj.value),
            text: this.capitalizarPrimeraLetra(obj.text)
          }
        })
      if (options.length > 0) {
        this.ValidateComuna = false
        return options
      } else {
        this.ValidateComuna = true
      }
    },
    async refreshLeads () {
      if (this.thereAreNoFiltersApplied) {
        console.log(
          `actualizando solicitudes ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
        )
        this.$store.commit('setReloading', true)
        await this.ListRequests(1)
        this.$store.commit('setReloading', false)
      }
    },
    async UpdatePrioridad (item) {
      if (item.prioridades) {
        const eliminar = 'prioritario'
        const index = item.tags.findIndex(x => x.id === eliminar)
        item.tags.splice(index, 1)
        const data = await this.$UpdateRequest(item.id, item)
        this.$store.commit('setAlertMessage', {
          success: 'Se ha quitado como prioritario!'
        })
      } else {
        const newlead = {
          id: 'prioritario'
        }
        const lead = item.tags
        lead.push(newlead)
        item.tags = lead
        const data = await this.$UpdateRequest(item.id, item)
        console.log(data)
        this.$store.commit('setAlertMessage', {
          success: 'Se ha puesto como prioritario!'
        })
      }
      this.ListRequests(this.page)
    },
    changeComuna (event) {
      this.Leads.comuna = event.target.value
    },
    changeMunicipio (event) {
      this.Leads.city = event.target.value
    },
    EditColectivoEmpleado (item) {
      this.StatusColectivo = 'mod'
      this.ColectivoData = item
      this.$refs['modal-new-colectivo'].show()
    },
    newcolectivo () {
      this.StatusColectivo = 'new'
      this.ColectivoData = {
        name: null,
        last_name: null,
        rut: null,
        profession: null,
        specialty: null,
        email: null,
        phone: null,
        sex: null,
        birthday: null,
        status: null
      }
      this.$refs['modal-new-colectivo'].show()
    },
    hidecolectivoModal () {
      this.$refs['modal-new-colectivo'].hide()
    },
    hideModalSendCertificate () {
      this.currentIdProduct = null
      this.tipoCertificado = 'poliza'
      this.mensajeDelCertificado = ''
      this.checkSendKam = true
      this.checksendO = false
      this.emailToSend = ''
      this.mostrarMensajeDelCertificado = false
      this.$refs['modal-cetificate'].hide()
    },
    changeOmitidos () {
      this.ViewOmitidos = !this.ViewOmitidos
    },
    async pushNewLead (id) {
      const { data } = await this.$simpleeApi.get(`/request/${id}/`)
      if (data.is_old === true) {
        this.newItems = [{ _rowVariant: 'info', ...data }, ...this.Requeses]
      } else {
        this.newItems = [{ _rowVariant: 'primary', ...data }, ...this.Requeses]
      }
      this.newItems.pop()
      const notificacionnew = this.Requeses.find(key => key.id === id)
      if (!notificacionnew) {
        let newData = [...this.newItems]
        newData = newData.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        for (let i = 0; i < newData.length; i++) {
          if (newData[i].product_details) {
            newData[i].prima = newData[i].product_details.prima
            newData[i].comision = newData[i].product_details.comision
            newData[i].comision_final = {
              monto: newData[i].product_details.comision_final,
              referred: newData[i].referred,
              campaign_slug: newData[i].campaign_slug
            }
          }
          if (newData[i].lead_details) {
            if (newData[i].lead_details.email) {
              newData[i].email = newData[i].lead_details.email
              newData[i].phone = newData[i].lead_details.phone
              newData[i].razon_social = newData[i].lead_details.razon_social
            }
          }
        }
        this.Requeses = newData
      }
    },
    changegiro (event) {
      this.Leads.giro = event.target.value
    },
    RequestTable () {
      this.ListRequestsPriority(1)
      this.option = 'table-prioridad'
    },
    RequestTableBack () {
      this.ListRequests(1)
      this.option = 'table'
    },
    CheckedPartners () {
      if (process.env.version === 'MX') {
        const channelObject = this.channels.find(
          ({ value }) => value === this.Requestedit.channel
        )
        if (channelObject) {
          const channeltext = channelObject.text
          // lounn
          if (
            this.Requestedit.product_interest === 'mok' &&
            channeltext === 'Partnership' &&
            this.Requestedit.campaign_slug === 'lounn'
          ) {
            this.messaggepartnert = 'ESTE CLIENTE APLICA A DESCUENTO DE UN 15%'
          } else {
            this.messaggepartnert = ''
          }
        }
      } else {
        const channelObject = this.channels.find(
          ({ value }) => value === this.Requestedit.channel
        )
        if (channelObject) {
          const channeltext = channelObject.text
          // lounn
          if (
            channeltext === 'Partnership' &&
            this.Requestedit.campaign_slug === 'licitalab'
          ) {
            this.messaggepartnert =
              'Es cliente Simplee, aplica para descuento de 5%'
          } else {
            this.messaggepartnert = ''
          }
        }
      }
    },
    Changecomissionreferred (value) {
      if (value) {
        const [referred] = this.refferals.filter(
          ({ value }) => value === this.Request.referred
        )
        this.commission = referred.commission
      } else {
        this.commission = 0
      }
    },
    CheckAddProduct () {
      if (
        !this.InfoContact.email ||
        !this.InfoContact.phone ||
        !this.InfoContact.rut ||
        !this.InfoContact.giro ||
        !this.InfoContact.name ||
        !this.InfoContact.last_name ||
        !this.InfoContact.address ||
        (!this.InfoContact.comuna && process.env.version === 'CL') ||
        ((!this.InfoContact.zip_code ||
          !this.InfoContact.city ||
          !this.InfoContact.comuna) &&
          process.env.version === 'MX') ||
        !this.InfoContact.user
      ) {
        if (this.InfoContact.person === 'legal_person') {
          if (!this.InfoContact.razon_social) {
            this.$refs['modal-alert12'].show()
            return
          }
        }
        this.$refs['modal-alert12'].show()
      } else {
        this.addproduct = true
      }
    },
    CheckAddExistProduct () {
      if (
        !this.InfoContact.email ||
        !this.InfoContact.phone ||
        !this.InfoContact.rut ||
        !this.InfoContact.giro ||
        !this.InfoContact.name ||
        !this.InfoContact.last_name ||
        !this.InfoContact.address ||
        !this.InfoContact.comuna ||
        !this.InfoContact.user
      ) {
        if (this.InfoContact.person === 'legal_person') {
          if (!this.InfoContact.razon_social) {
            this.$refs['modal-alert12'].show()
            return
          }
        }
        this.$refs['modal-alert12'].show()
      } else {
        this.modalreasigproduct2 = true
      }
    },
    Changecomissionreferred2 (value) {
      if (value) {
        const [referred] = this.refferals.filter(
          ({ value }) => value === this.Requestedit.referred
        )
        this.commission = referred.commission
      } else {
        this.commission = 0
      }
    },
    ChangecomissionPartnership (value) {
      if (value !== 'ejecutivos-externos') {
        if (!value) {
          value = this.Requestedit.campaign_slug
        }
        if (value) {
          if (value === 'que-plan') {
            this.commission = 0.3
          } else if (value === 'asegurateonline') {
            this.commission = 0.5
          } else if (value === 'kapitallis') {
            this.commission = 0.3
          } else {
            this.commission = 0
          }
        } else {
          this.commission = 0
        }
      }
    },
    codigoPhone () {
      if (process.env.version === 'CL') {
        this.codePhone = '+56'
      } else {
        this.codePhone = '+52'
      }
      if (this.Leads.phone == null) {
        return this.codePhone
      } else {
        return this.Leads.phone
      }
    },
    FormatedString (oracion) {
      const miOracion = oracion
      const palabras = miOracion.split(' ')

      for (let i = 0; i < palabras.length; i++) {
        palabras[i] = palabras[i][0].toUpperCase() + palabras[i].substr(1)
      }

      return palabras.join(' ')
    },
    resetPhone (newValue) {
      this.Leads.phone = newValue
      if (this.Leads.phone.includes(this.codePhone) === false) {
        this.Leads.phone = this.codePhone
      }
    },
    resetFilters (localFilters) {
      const filters = {
        ...localFilters
      }
      if (localFilters.states.length === 0) {
        filters.states = leadsStaticVars.statesKeys
      }
      if (localFilters.request_type.length === 0) {
        filters.request_type = leadsStaticVars.request_typeKeys
      }
      if (localFilters.product_group.length === 0) {
        if (process.env.version === 'CL') {
          filters.product_group = leadsStaticVars.request_groupcl
        } else {
          filters.product_group = leadsStaticVars.request_groupmx
        }
      }
      if (filters.states) {
        this.statesCopy = [...filters.states]
      }
      if (filters.priorities) {
        this.prioritiesCopy = [...filters.priorities]
      }
      this.setFilters(filters)
    },
    async ListRequestsPriority (page) {
      if (!page) {
        page = 1
      }
      this.page = page
      this.setLoadingLeads(true)
      if (this.urlParams.priorities_scores === 'alta') {
        this.urlParams.priority_score_start = 11
        this.urlParams.priority_score_end = 14
      } else if (this.urlParams.priorities_scores === 'media') {
        this.urlParams.priority_score_start = 7
        this.urlParams.priority_score_end = 10
      } else if (this.urlParams.priorities_scores === 'baja') {
        this.urlParams.priority_score_start = 3
        this.urlParams.priority_score_end = 6
      } else if (this.urlParams.priorities_scores === 'sin_prioridad') {
        this.urlParams.priority_score_start = 0
        this.urlParams.priority_score_end = 2
      }
      delete this.urlParams.priorities_scores
      if (this.urlParams.partnership) {
        let newpartnership;
        const partnership = this.urlParams.partnership
        for (let k = 0; k < partnership.length; k++) {
          if (!newpartnership) {
            newpartnership = partnership[k]
          } else {
            newpartnership = newpartnership + ',' + partnership[k]
          }
        }
        this.urlParams.partnership = newpartnership
      }
      const data = await this.$ListRequestsprioridades(page, this.urlParams)
      const Response = data.results
      this.totalRows2 = data.count
      for (let i = 0; i < Response.length; i++) {
        if (Response[i].is_old === true) {
          Response[i]._rowVariant = 'danger'
        }
        if (Response[i].product_details) {
          Response[i].prima = Response[i].product_details.prima
          Response[i].comision = Response[i].product_details.comision
          Response[i].comision_final = {
            monto: Response[i].product_details.comision_final,
            referred: Response[i].referred,
            campaign_slug: Response[i].campaign_slug
          }
        }
        if (Response[i].lead_details) {
          if (
            Response[i].lead_details.email ||
            Response[i].lead_details.phone ||
            Response[i].lead_details.razon_social
          ) {
            Response[i].email = Response[i].lead_details.email
            Response[i].phone = Response[i].lead_details.phone
            Response[i].razon_social = Response[i].lead_details.razon_social
          }
        }
      }
      /* for (let i = 0; i < Response.length; i++) {
        if (Response[i].aditional_data) {
          const aditionalData = Response[i].aditional_data
          for (let j = 0; j < aditionalData.length; j++) {
            if (aditionalData[j].field_name === 'name' || aditionalData[j].field_name === 'last_name') {
              if (!Response[i].name) {
                Response[i].name = aditionalData[j].value
              } else {
                Response[i].name = Response[i].name + ' ' + aditionalData[j].value
              }
            }
            if (aditionalData[j].field_name === 'email') {
              Response[i].correo = aditionalData[j].value
            }
          }
        }
      } */
      this.setLoadingLeads(false)
      this.Requesesprioridad = Response
    },
    async ListRequests (page) {
      if (!page) {
        page = 1
      }
      this.page = page
      this.setLoadingLeads(true)
      if (this.urlParams.priorities_scores === 'alta') {
        this.urlParams.priority_score_start = 11
        this.urlParams.priority_score_end = 14
      } else if (this.urlParams.priorities_scores === 'media') {
        this.urlParams.priority_score_start = 7
        this.urlParams.priority_score_end = 10
      } else if (this.urlParams.priorities_scores === 'baja') {
        this.urlParams.priority_score_start = 3
        this.urlParams.priority_score_end = 6
      } else if (this.urlParams.priorities_scores === 'sin_prioridad') {
        this.urlParams.priority_score_start = 0
        this.urlParams.priority_score_end = 2
      }
      delete this.urlParams.priorities_scores
      const fields = `id,lead_details,request_type,product_group,created_at,state,user_details,lead,tags,product_details,is_old`
      console.log("urlParams", this.urlParams)
      if (this.urlParams.partnership) {
        let newpartnership;
        const partnership = this.urlParams.partnership
        for (let k = 0; k < partnership.length; k++) {
          if (!newpartnership) {
            newpartnership = partnership[k]
          } else {
            newpartnership = newpartnership + ',' + partnership[k]
          }
        }
        this.urlParams.partnership = newpartnership
      }
      const data = await this.$ListRequests(page, this.urlParams, fields)
      const Response = data.results
      console.log(Response)
      this.totalRows = data.count
      for (let i = 0; i < Response.length; i++) {
        const ObjetoPrioridad = Response[i].tags.filter(
          item => item.id === 'prioritario'
        )
        if (ObjetoPrioridad.length > 0) {
          Response[i].prioridades = true
        } else {
          Response[i].prioridades = false
        }
        if (Response[i].product_details) {
          Response[i].prima = Response[i].product_details.prima
          Response[i].comision = Response[i].product_details.comision
          Response[i].comision_final = {
            monto: Response[i].product_details.comision_final,
            referred: Response[i].referred,
            campaign_slug: Response[i].campaign_slug
          }
        }
        if (Response[i].is_old === true) {
          Response[i]._rowVariant = 'danger'
        }
        if (Response[i].lead_details) {
          if (
            Response[i].lead_details.email ||
            Response[i].lead_details.phone ||
            Response[i].lead_details.razon_social
          ) {
            Response[i].email = Response[i].lead_details.email
            Response[i].phone = Response[i].lead_details.phone
            Response[i].razon_social = Response[i].lead_details.razon_social
          }
        }
      }
      /* for (let i = 0; i < Response.length; i++) {
        if (Response[i].aditional_data) {
          const aditionalData = Response[i].aditional_data
          for (let j = 0; j < aditionalData.length; j++) {
            if (aditionalData[j].field_name === 'name' || aditionalData[j].field_name === 'last_name') {
              if (!Response[i].name) {
                Response[i].name = aditionalData[j].value
              } else {
                Response[i].name = Response[i].name + ' ' + aditionalData[j].value
              }
            }
            if (aditionalData[j].field_name === 'email') {
              Response[i].correo = aditionalData[j].value
            }
          }
        }
      } */
      this.setLoadingLeads(false)
      this.Requeses = Response
    },
    validateNumber () {
      const phone = this.Leads.phone?.length
      if (phone) {
        this.selectedCountry = process.env.version
        const phoneNumber = parsePhoneNumber(
          this.Leads.phone,
          this.selectedCountry
        )
        if (this.Leads.phone.length > 7 && phoneNumber.isValid()) {
          return true
        } else {
          return false
        }
      }
    },
    validateEmail () {
      const value = this.Leads.email?.length
      if (value) {
        if (
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(this.Leads.email)
        ) {
          return true
        } else {
          return false
        }
      }
    },
    async checkproductlead () {
      try {
        const res = await this.$simpleeApi.get(
          `/product/?lead=${this.Requestedit.lead}`
        )
        const results = res.data.count
      } catch (error) {
        // store.commit('setAlertMessage', error.response.data)
      }
    },
    async showmodaldocuments (id) {
      this.idrequest = null
      this.idproduct = id
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
      this.idproduct = null
      this.idrequest = id
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
    showmodalbitacora (id) {
      this.idproduct = null
      this.idrequest = id
      this.requestbitacoraval = false
      if (id) {
        this.modalbitacora = true
      }
    },
    savedocuments (val) {
      const docsToAdd = val?.filter(d => !d.id) || []
      if (docsToAdd.length > 0) {
        docsToAdd.forEach(async (doc) => {
          if (doc.document64) {
            try {
              await this.$simpleeApi.post(
                `/product/${this.ProductsRequest.id}/document/`,
                doc
              )
              this.$refs['modal-alert7'].show()
            } catch (error) {
              this.$sendErrorPayload({
                payload: doc,
                origin: 'producto',
                errorResponse: error.response,
                expectedBehavior: `Deberia agregarse un nuevo documento al producto ${this.ProductsRequest.id}`
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
                `/request/${this.Requestedit.id}/document/`,
                doc
              )
              this.$refs['modal-alert7'].show()
              this.openExistingLead(this.Requestedit)
            } catch (error) {
              this.$sendErrorPayload({
                payload: doc,
                origin: 'solicitud',
                errorResponse: error.response,
                expectedBehavior: `Deberia agregarse un nuevo documento a la solicitud ${this.Requestedit.id}`
              })
            }
            this.modaldocuments = false
          }
        })
      }
    },
    async savebitacora (val) {
      // Guardar al historial
      val.leadrequest = this.Requestedit.id
      val.user = this.user.id
      try {
        await this.$simpleeApi.post(
          `/request/${this.Requestedit.id}/lead_request_bitacora/`,
          val
        )
        this.openExistingLead(this.Requestedit)
        this.$refs['modal-alert-bitacora'].show()
      } catch (error) {
        this.$sendErrorPayload({
          payload: val,
          origin: 'request',
          errorResponse: error.response,
          expectedBehavior: `Deberia agregarse un nuevo registro de bitacora a la solicitud ${this.Requestedit.id}`
        })
      }
    },
    async saveeditbitacora (val) {
      // Edita Bitacora
      val.leadrequest = this.Requestedit.id
      val.user = this.user.id
      try {
        await this.$simpleeApi.put(
          `/request/${this.Requestedit.id}/lead_request_bitacora/${val.id}/`,
          val
        )
        this.openExistingLead(this.Requestedit)
        this.$refs['modal-alert-bitacoraEdit'].show()
      } catch (error) {
        this.$sendErrorPayload({
          payload: val,
          origin: 'request',
          errorResponse: error.response,
          expectedBehavior: `Deberia modificarse un nuevo registro de bitacora a la solicitud ${this.Requestedit.id}`
        })
      }
    },
    async cancelbitacora (val) {
      this.modalbitacora = false
      this.bitacorarequestdata = []
      this.bitacorasolicitud = await this.$GetBitacoraRequest(
        this.Requestedit.id
      )
    },
    async deletedocuments (id) {
      if (id) {
        try {
          await this.$simpleeApi.delete(
            `/product/${this.ProductsRequest.id}/document/${id}/`
          )
          this.$refs['modal-alert8'].show()
        } catch (error) {
          this.$sendErrorPayload({
            payload: id,
            origin: 'producto',
            errorResponse: error.response,
            expectedBehavior: `Deberia borrarse documento al producto ${this.ProductsRequest.id}`
          })
        }
      }
    },
    async deletedocuments2 (id) {
      if (id) {
        try {
          await this.$simpleeApi.delete(
            `/request/${this.Requestedit.id}/document/${id}/`
          )
          this.$refs['modal-alert8'].show()
          this.openExistingLead(this.Requestedit)
        } catch (error) {
          this.$sendErrorPayload({
            payload: id,
            origin: 'solicitud',
            errorResponse: error.response,
            expectedBehavior: `Deberia borrarse documento a la solicitud ${this.Requestedit.id}`
          })
        }
      }
    },
    validRFC () {
      const valueLength = this.Leads.rut?.length
      if (valueLength) {
        const regex = /^[A-ZÑ&]{3}\d{6}[A-Z\d]{3}$/
        const regexperson = /^[A-ZÑ&]{4}\d{6}[A-Z\d]{3}$/
        const rfcWithoutSATKey = this.Leads.rut?.slice(0, valueLength - 3)
        const rfcSATKey = this.Leads.rut?.slice(valueLength - 3, valueLength)

        if (!rfcWithoutSATKey || !rfcSATKey) {
          return false
        }

        const rfcFisico = `${rfcWithoutSATKey}${rfcSATKey.replaceAll(
          '-',
          ''
        )}`.match(regexperson)
        const rfcMoral = `${rfcWithoutSATKey}${rfcSATKey.replaceAll(
          '-',
          ''
        )}`.match(regex)

        if (rfcFisico == null && rfcMoral == null) {
          return false
        } else {
          return true
        }
      }
    },
    debouncedSearchRUTPrev () {
      this.loader = true
      this.debouncedSearchRUT()
    },
    debouncedSearchRUT: _.debounce(function () {
      this.ValidateRut()
      this.GetTipoLead()
    }, 2000),
    GetTipoLead () {
      let rut = this.Leads.rut.split('.').join('')
      rut = rut.split('-').join('')
      rut = rut.substring(0, rut.length - 1)
      if (rut <= 30000000) {
        this.Leads.person = 'natural_person'
      } else if (rut > 50000000) {
        this.Leads.person = 'legal_person'
      }
    },
    async ValidateRut () {
      try {
        const _response = await this.$simpleeApi.get(
          `/get_data_sii/?rut=${this.Leads.rut}`
        )
        this.loader = false
        const results = _response.data
        this.Leads.razon_social = results.razon_social
        this.Leads.giro = results.giro
        this.mensajeloader = 'encontrado'
      } catch (error) {
        this.loader = false
        this.Leads.razon_social = ''
        this.Leads.giro = ''
        this.mensajeloader = 'noencontrado'
        return null
      }
    },
    validateNumber2 () {
      const phone = this.ColectivoData.phone?.length
      if (!phone || this.ColectivoData.phone.length < 7) {
        return false
      }
      this.selectedCountry = process.env.version
      const phoneNumber = parsePhoneNumber(
        this.ColectivoData.phone,
        this.selectedCountry
      )
      if (!phoneNumber.isValid()) {
        return false
      } else {
        return true
      }
    },
    validRFC2 () {
      const valueLength = this.ColectivoData.rut?.length
      if (!valueLength) {
        return false
      }

      const regex = /^[A-ZÑ&]{3}\d{6}[A-Z\d]{3}$/
      const regexperson = /^[A-ZÑ&]{4}\d{6}[A-Z\d]{3}$/
      const rfcWithoutSATKey = this.ColectivoData.rut?.slice(0, valueLength - 3)
      const rfcSATKey = this.ColectivoData.rut?.slice(valueLength - 3, valueLength)

      if (!rfcWithoutSATKey || !rfcSATKey) {
        return false
      }

      const rfcFisico = `${rfcWithoutSATKey}${rfcSATKey.replaceAll(
        '-',
        ''
      )}`.match(regexperson)
      const rfcMoral = `${rfcWithoutSATKey}${rfcSATKey.replaceAll(
        '-',
        ''
      )}`.match(regex)

      if (rfcFisico == null && rfcMoral == null) {
        return false
      } else {
        return true
      }
    },
    validateEmail2 () {
      const value = this.ColectivoData.email?.length
      if (!value) {
        return false
      }
      if (
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(this.ColectivoData.email)
      ) {
        return true
      } else {
        return false
      }
    },
    async ListPlace () {
      this.Places = await this.$ListPlace()
    },
    async ListStateReason () {
      this.statesReason = await this.$ListStateReason()
    },

    async saveRequestAditionalData () {
      let AditionalAp = []
      if (this.Requestedit.product_group === 'seguro_de_accidentes_personales') {

        for (const [key, value] of Object.entries(this.AditionalDataAp)) {
          let typedata = 'str'
          if (key === 'coberturas') {
            typedata = 'list'
          }
          if (key === 'AseguradosAdicionales') {
            typedata = 'list'
          }
          if (value) {
            const newlead = {
              value,
              data_type: typedata,
              label: key,
              field_name: key
            }
            AditionalAp.push(newlead)
          }
        }
      }
      const AditionalData = this.Requestedit.aditional_data
      let leadetiqueta = []
      for (const [key, value] of Object.entries(this.AditionalDataEdit)) {
        const consolidacion = AditionalData.find(
          ({ field_name }) => field_name === key
        )
        if (consolidacion.data_type === 'list') {
          consolidacion.data_type = 'str'
        }
        if (consolidacion.field_name === 'insured_amount') {
          consolidacion.value = parseFloat(value)
        } else {
          consolidacion.value = value
        }
        leadetiqueta.push(consolidacion)
      }
      const NewAditional = [...leadetiqueta, ...AditionalAp]
      console.log('aquii', NewAditional)
      this.Requestedit.aditional_data = NewAditional
      const data = await this.$UpdateRequest(this.Requestedit.id, this.Requestedit)
      if (data.success) {
        this.requestnew = data
        for (const [key, data] of Object.entries(data.tags)) {
          if (data) {
            lead.push(data.id)
          }
        }
        this.Requestedit = data
        this.Requestedit.aditional_data = this.Requestedit.aditional_data.filter(
          item => item.field_name !== 'observaciones' && item.field_name !== 'observaciones' && item.field_name !== 'siniestralidad' && item.field_name !== 'coberturas' && item.field_name !== 'AseguradosAdicionales'
        )
        this.$refs['modal-alertrequeeditAditional'].show()
        let aditionaldatadelete = this.Requestedit.aditional_data
        const aditionaldatanodelete = this.Requestedit.aditional_data
        for (let i = 0; i < aditionaldatanodelete.length; i++) {
          this.AditionalDataEdit[aditionaldatanodelete[i].field_name] = aditionaldatanodelete[i].value
        }
        const aditionalnodelete2 = []
        if (aditionaldatadelete) {
          for (const [key] of Object.entries(this.Leads)) {
            aditionaldatadelete = aditionaldatadelete.filter(
              item => item.field_name !== key || item.show_in_frontend === false
            )
            const noaditional = aditionaldatanodelete.find(
              ({ field_name }) => key === field_name
            )
            if (
              noaditional &&
              noaditional.field_name !== 'employee_quantity_choice'
            ) {
              aditionalnodelete2.push(noaditional)
            }
          }
          this.productdetails = aditionaldatadelete
          this.productnodetails = aditionalnodelete2
        } else {
          this.productdetails = []
          this.productnodetails = []
        }
        this.ViewAditionalData = true
        this.ListRequests()
        if (this.$store.state.localStorage.user.role !== 'EXT_KAM') {
          this.getHistory(this.Requestedit.id);
        }
      }
    },
    async saveRequest () {
      this.Botonguardarcambios = true
      if (!this.Leads.email && !this.Leads.phone && !this.Leads.rut) {
        this.$store.commit('setAlertMessage', {
          error:
            'Para crear un nuevo contacto se debe agregar al menos email, telefono o rut'
        })
        this.Botonguardarcambios = false
        return
      }
      /* if (
         !this.Leads.rut && !this.asignclientexistnewequest
       ) {
         this.$store.commit('setAlertMessage', { error: 'El campo RUT es obligatorio' })
         this.Botonguardarcambios = false
         return
       } */
      if (this.Leads.rut) {
        if (!this.asignclientexistnewequest) {
          if (process.env.version === 'CL') {
            this.document = 'RUT'
            if (
              this.Leads.rut?.length &&
              validateRut(this.Leads.rut) === false
            ) {
              this.$store.commit('setAlertMessage', { error: 'RUT no válido' })
              this.Botonguardarcambios = false
              return
            }
          } else {
            this.document = 'RFC'
            if (this.validRFC() === false) {
              this.$store.commit('setAlertMessage', { error: 'RFC no válido' })
              this.Botonguardarcambios = false
              return
            }
          }
        }
      }
      /*
      if (
        !this.Leads.person && !this.asignclientexistnewequest
      ) {
        this.$store.commit('setAlertMessage', { error: 'El campo tipo de persona es obligatorio' })
        this.Botonguardarcambios = false
        return
      }
      if (
        this.Leads.person === 'legal_person' && !this.asignclientexistnewequest
      ) {
        if (
          !this.Leads.razon_social
        ) {
          this.$store.commit('setAlertMessage', { error: 'El campo razon social es obligatorio' })
          this.Botonguardarcambios = false
          return
        }
      }
      if (
        !this.Leads.name && !this.asignclientexistnewequest
      ) {
        this.$store.commit('setAlertMessage', { error: 'El campo Nombre es obligatorio' })
        this.Botonguardarcambios = false
        return
      }
      if (
        !this.Leads.last_name && !this.asignclientexistnewequest
      ) {
        this.$store.commit('setAlertMessage', { error: 'El campo Apellido es obligatorio' })
        this.Botonguardarcambios = false
        return
      }
      if (
        !this.Leads.phone && !this.asignclientexistnewequest
      ) {
        this.$store.commit('setAlertMessage', { error: 'El campo Telefono es obligatorio' })
        this.Botonguardarcambios = false
        return
      }
      */
      if (this.Leads.phone) {
        const telefono = this.Leads.phone
        if (telefono.length > 3) {
          if (this.validateNumber() === false) {
            this.$store.commit('setAlertMessage', {
              error: 'Número de teléfono no valido'
            })
            this.Botonguardarcambios = false
            return
          }
        }
      }
      /*
      if (
        !this.Leads.email && !this.asignclientexistnewequest
      ) {
        this.$store.commit('setAlertMessage', { error: 'El campo email es obligatorio' })
        this.Botonguardarcambios = false
        return
      }
      */
      if (this.Leads.email) {
        if (this.validateEmail() === false) {
          this.$store.commit('setAlertMessage', {
            error: 'correo electrónico no valido'
          })
          this.Botonguardarcambios = false
          return
        }
      }
      /* if (
        !this.Leads.giro && !this.asignclientexistnewequest
      ) {
        this.$store.commit('setAlertMessage', { error: 'El campo giro es obligatorio' })
        this.Botonguardarcambios = false
        return
      }
       if (
        !this.Leads.employee_quantity_choice && !this.asignclientexistnewequest
      ) {
        this.$store.commit('setAlertMessage', { error: 'El campo numero de trabajadores es obligatorio' })
        this.Botonguardarcambios = false
        return
      } */
      if (!this.Request.request_type) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo tipo de solicitud es obligatorio'
        })
        this.Botonguardarcambios = false
        return
      }
      console.log(this.Request.state);
      if (this.Request.state === 'en_espera_de_confirmacion') {
        console.log("mostrando project_quote", this.Request.projected_quote);
        if (this.Request.projected_quote === undefined) {
          this.$store.commit('setAlertMessage', {
            error: 'El campo Comisión Proyectada es obligatorio'
          })
          this.Botonguardarcambios = false
          return
        }
      }
      if (
        !this.Request.adjudication_date &&
        this.Request.state === 'en_licitacion'
      ) {
        this.$store.commit('setAlertMessage', {
          error:
            'El campo fecha de adjudicación es obligatorio, ya que el estado es en licitación'
        })
        this.Botonguardarcambios = false
        return
      }
      /* if (
        !this.Request.product_interest
      ) {
        this.$store.commit('setAlertMessage', { error: 'El campo producto es obligatorio' })
        this.Botonguardarcambios = false
        return
      }

      if (
        !this.Request.state
      ) {
        this.$store.commit('setAlertMessage', { error: 'El campo estado es obligatorio' })
        this.Botonguardarcambios = false
        return
      }
      */
      if (this.$store.state.localStorage.user.role === 'EXT_KAM') {
        this.Request.channel = 80
      }
      if (!this.Request.channel) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo canal es obligatorio'
        })
        this.Botonguardarcambios = false
        return
      }
      if (this.$store.state.localStorage.user.role === 'EXT_KAM') {
        if (this.$store.state.localStorage.user.partnership === 3) {
          this.Request.campaign_slug = 'alvi'
        }
      }
      if (this.Request.channel) {
        if (!this.Request.campaign_slug) {
          this.$store.commit('setAlertMessage', {
            error: 'El campo Campaña es obligatorio'
          })
          this.Botonguardarcambios = false
          return
        }
      }
      if (this.Request.campaign_slug === 'ejecutivos-externos') {
        if (!this.Request.referred) {
          this.$store.commit('setAlertMessage', {
            error: 'El campo ejecutivo referido es obligatorio'
          })
          this.Botonguardarcambios = false
          return
        }
      }
      if (this.Request.campaign_slug === 'staree') {
        if (!this.Request.referral_code) {
          this.$store.commit('setAlertMessage', {
            error: 'El campo codigo de referido es obligatorio'
          })
          this.Botonguardarcambios = false
          return
        }
      }
      if (this.$store.state.localStorage.user.role === 'EXT_KAM') {
        this.Request.user = this.$store.state.localStorage.user.id
      }
      if (!this.Request.user) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo ejecutivo es obligatorio'
        })
        this.Botonguardarcambios = false
        return
      }
      let leadetiqueta = []
      if (this.Request.tags) {
        for (const [key, value] of Object.entries(this.Request.tags)) {
          if (value) {
            const newlead2 = {
              id: value
            }
            leadetiqueta.push(newlead2)
          }
        }
      } else {
        leadetiqueta = []
      }
      const lead = []
      for (const [key, value] of Object.entries(this.Leads)) {
        let typedata = 'str'
        if (key === 'user') {
          typedata = 'int'
        }
        if (value) {
          const newlead = {
            value,
            data_type: typedata,
            label: key,
            field_name: key
          }
          lead.push(newlead)
        }
      }
      if (this.asignclientexistnewequest) {
        this.requestdinamin = {
          aditional_data: null,
          product_interest: this.Request.product_interest,
          tags: leadetiqueta ?? null,
          product_group: this.Request.product_group,
          referred_ext: this.Request.referred_ext,
          request_type: this.Request.request_type,
          state: this.Request.state,
          place: this.Request.place,
          state_reason: this.Request.state_reason,
          priority_score: this.Request.priority_score,
          user: this.Request.user,
          comment: this.Request.comment,
          lead: this.leadid,
          referred: this.Request.referred,
          referral_code: this.Request.referral_code,
          projected_quote: this.Request.projected_quote,
          quotation_received: this.Request.quotation_received,
          adjudication_date: this.Request.adjudication_date,
          quotation_delivered: this.Request.quotation_delivered,
          campaign_slug: this.Request.campaign_slug
        }
        this.asignclientexistnewequest = false
      } else {
        this.requestdinamin = {
          aditional_data: lead,
          product_interest: this.Request.product_interest,
          referred_ext: this.Request.referred_ext,
          tags: leadetiqueta ?? null,
          product_group: this.Request.product_group,
          request_type: this.Request.request_type,
          state: this.Request.state,
          place: this.Request.place,
          state_reason: this.Request.state_reason,
          priority_score: this.Request.priority_score,
          user: this.Request.user,
          comment: this.Request.comment,
          referred: this.Request.referred,
          referral_code: this.Request.referral_code,
          projected_quote: this.Request.projected_quote,
          quotation_received: this.Request.quotation_received,
          adjudication_date: this.Request.adjudication_date,
          quotation_delivered: this.Request.quotation_delivered,
          campaign_slug: this.Request.campaign_slug
        }
      }
      // this.dataproducto = await this.$PostProduct(this.ProductsRequest)
      this.Botonguardarcambios = false
      if (this.$store.state.localStorage.user.role === 'EXT_KAM') {
          this.requestdinamin.partnership = this.$store.state.localStorage.user.partnership
      }
      const error = await this.$PostRequest(this.requestdinamin)
      if (error) {
        this.Leads = {}
        this.requestnew = error
        // this.Requestedit = error
        this.Request = {
          product_interest: null,
          product_group: null,
          request_type: null,
          state: null,
          channel: null,
          priority: null,
          place: null,
          state_reason: null,
          user: null,
          comment: null
        }
        this.option = 'edit'
        if (this.optioncliente !== '') {
          this.$refs['modal-alertreque'].show()
        } else {
          this.$refs['modal-alert'].show()
          this.option = 'table'
          this.ProductExistente = false
        }
        this.ListRequests()
      }
      this.Botonguardarcambios = false

    },
    async PostEventColectivo () {
      if (!this.idcolectivo) {
        try {
          const { data } = await this.$simpleeApi.post('/colectivo/', {
            name_coletivo: 'Colectivo solicitud: ' + this.Requestedit.id,
            lead_request: this.Requestedit.id
          })
          this.idcolectivo = data.id
        } catch (error) {
          console.log(error)
        }
      }
      if (!this.ColectivoData.name && !this.ColectivoData.last_name && !this.ColectivoData.rut) {
        this.$store.commit('setAlertMessage', {
          error:
            'Para crear un nuevo empleado se debe agregar al menos el nombre, apellido y rut'
        })
        return
      }
      if (!this.ColectivoData.rut) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo RUT es obligatorio'
        })
        return
      }
      /* if (!this.ColectivoData.birthday) {
         this.$store.commit("setAlertMessage", {
           error: "El campo fecha de nacimiento es obligatorio",
         });
         return;
       }
       */
      if (this.ColectivoData.rut) {
        if (process.env.version === 'CL') {
          if (this.ColectivoData.rut?.length && validateRut(this.ColectivoData.rut) === false) {
            this.$store.commit('setAlertMessage', { error: 'RUT no válido' })
            return
          }
        } else if (this.validRFC2() === false) {
          this.$store.commit('setAlertMessage', { error: 'RFC no válido' })
          return
        }
      }

      if (this.ColectivoData.phone) {
        const telefono = this.ColectivoData.phone
        if (telefono.length > 3) {
          if (this.validateNumber2() === false) {
            this.$store.commit('setAlertMessage', {
              error: 'Número de teléfono no valido'
            })
            return
          }
        }
      }
      if (this.ColectivoData.email) {
        if (this.validateEmail2() === false) {
          this.$store.commit('setAlertMessage', {
            error: 'correo electrónico no valido'
          })
          return
        }
      }
      try {
        await this.$simpleeApi.post('/colectivo_empleado/', {
          name: this.ColectivoData.name,
          last_name: this.ColectivoData.last_name,
          profession: this.ColectivoData.profession,
          specialty: this.ColectivoData.specialty,
          email: this.ColectivoData.email,
          phone: this.ColectivoData.phone,
          rut: this.ColectivoData.rut,
          sex: this.ColectivoData.sex,
          birthday: this.ColectivoData.birthday,
          status: this.ColectivoData.status,
          colectivo: this.idcolectivo
        })
        this.hidecolectivoModal()
        this.$store.commit('setAlertMessage', {
          success: 'Se ha agregado el empleado'
        })
      } catch (error) {
        console.log(error)
      }
      this.colectivossolicitud = await this.$GetColectivoRequest(
        this.idcolectivo
      )
    },
    async ModEventColectivo () {
      if (!this.ColectivoData.name && !this.ColectivoData.last_name && !this.ColectivoData.rut) {
        this.$store.commit('setAlertMessage', {
          error:
            'Para crear un nuevo empleado se debe agregar al menos el nombre, apellido y rut'
        })
        return
      }
      if (!this.ColectivoData.rut) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo RUT es obligatorio'
        })
        return
      }
      /* if (!this.ColectivoData.birthday) {
         this.$store.commit("setAlertMessage", {
           error: "El campo fecha de nacimiento es obligatorio",
         });
         return;
       }
       */
      if (this.ColectivoData.rut) {
        if (process.env.version === 'CL') {
          if (this.ColectivoData.rut?.length && validateRut(this.ColectivoData.rut) === false) {
            this.$store.commit('setAlertMessage', { error: 'RUT no válido' })
            return
          }
        } else if (this.validRFC2() === false) {
          this.$store.commit('setAlertMessage', { error: 'RFC no válido' })
          return
        }
      }

      if (this.ColectivoData.phone) {
        const telefono = this.ColectivoData.phone
        if (telefono.length > 3) {
          if (this.validateNumber2() === false) {
            this.$store.commit('setAlertMessage', {
              error: 'Número de teléfono no valido'
            })
            return
          }
        }
      }
      if (this.ColectivoData.email) {
        if (this.validateEmail2() === false) {
          this.$store.commit('setAlertMessage', {
            error: 'correo electrónico no valido'
          })
          return
        }
      }
      try {
        await this.$simpleeApi.put(`/colectivo_empleado/${this.ColectivoData.id}/`, {
          name: this.ColectivoData.name,
          last_name: this.ColectivoData.last_name,
          profession: this.ColectivoData.profession,
          specialty: this.ColectivoData.specialty,
          email: this.ColectivoData.email,
          phone: this.ColectivoData.phone,
          rut: this.ColectivoData.rut,
          sex: this.ColectivoData.sex,
          birthday: this.ColectivoData.birthday,
          status: this.ColectivoData.status,
          colectivo: this.idcolectivo
        })
        this.hidecolectivoModal()
        this.$store.commit('setAlertMessage', {
          success: 'Se ha Modificado el empleado'
        })
      } catch (error) {
        console.log(error)
      }
      this.colectivossolicitud = await this.$GetColectivoRequest(
        this.idcolectivo
      )
    },
    async SaveEvent () {
      try {
        await this.$simpleeApi.post('/add_calendar_event/', {
          date: this.dateevent,
          lead_request: this.Requestedit.id
        })
      } catch (error) {
        console.log(error)
      }
    },
    async saveRequestEdit () {
      this.Botonguardarcambios = true
      if (this.dateevent) {
        this.SaveEvent()
      }
      if (!this.Requestedit.request_type) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo tipo de solicitud es obligatorio'
        })
        this.Botonguardarcambios = false
        return
      }
      if (this.Requestedit.state === 'cliente_cerrado') {
        if (!this.ProductExistente) {
          this.$refs['modal-alert11'].show()
          this.Botonguardarcambios = false
          return
        }
        if (!this.Requestedit.product_interest) {
          this.$store.commit('setAlertMessage', {
            error: 'El campo producto es obligatorio para cerra la solicitud'
          })
          this.Botonguardarcambios = false
          return
        }

        if (!this.Requestedit.product_group) {
          this.$store.commit('setAlertMessage', {
            error:
              'El campo Grupo de producto es obligatorio para cerra la solicitud'
          })
          this.Botonguardarcambios = false
          return
        }
      }
      if (!this.Requestedit.channel) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo canal es obligatorio'
        })
        this.Botonguardarcambios = false
        return
      }
      if (this.Requestedit.channel) {
        if (!this.Requestedit.campaign_slug) {
          this.$store.commit('setAlertMessage', {
            error: 'El campo Campaña es obligatorio'
          })
          this.Botonguardarcambios = false
          return
        }
      }
      if (this.Requestedit.campaign_slug === 'ejecutivos-externos') {
        if (!this.Requestedit.referred) {
          this.$store.commit('setAlertMessage', {
            error: 'El campo ejecutivo referido es obligatorio'
          })
          this.Botonguardarcambios = false
          return
        }
      }
      if (this.Requestedit.campaign_slug === 'staree') {
        if (!this.Requestedit.referral_code) {
          this.$store.commit('setAlertMessage', {
            error: 'El campo codigo de referido es obligatorio'
          })
          this.Botonguardarcambios = false
          return
        }
      }
      if (!this.Requestedit.user) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo ejecutivo es obligatorio'
        })
        this.Botonguardarcambios = false
        return
      }
      if (this.Requestedit.state !== 'perdido') {
        this.Requestedit.state_reason = null
      }
      if (
        !this.Requestedit.adjudication_date &&
        this.Requestedit.state === 'en_licitacion'
      ) {
        this.$store.commit('setAlertMessage', {
          error:
            'El campo fecha de adjudicación es obligatorio, ya que el estado es en licitación'
        })
        this.Botonguardarcambios = false
        return
      }
      let leadetiqueta = []
      if (this.Requestedit.tags) {
        for (const [key, value] of Object.entries(this.Requestedit.tags)) {
          if (value) {
            const newlead2 = {
              id: value
            }
            leadetiqueta.push(newlead2)
          }
        }
      } else {
        leadetiqueta = []
      }
      if (this.productold) {
        this.Request = {
          product_interest: this.Requestedit.product_interest,
          product_group: this.Requestedit.product_group,
          tags: leadetiqueta ?? null,
          request_type: this.Requestedit.request_type,
          state: this.Requestedit.state,
          place: this.Requestedit.place,
          state_reason: this.Requestedit.state_reason,
          priority_score: this.Requestedit.priority_score,
          user: this.Requestedit.user,
          comment: this.Requestedit.comment,
          referred: this.Requestedit.referred,
          referral_code: this.Requestedit.referral_code,
          projected_quote: this.Requestedit.projected_quote,
          campaign_slug: this.Requestedit.campaign_slug,
          quotation_received: this.Requestedit.quotation_received,
          adjudication_date: this.Requestedit.adjudication_date,
          quotation_delivered: this.Requestedit.quotation_delivered
        }
      } else {
        /* if (this.ProductExistente) {
          if (this.Requestedit.user) {
            this.ProductsRequest.user = this.Requestedit.user
          }
          this.dataproducto = await this.$PostProduct(this.ProductsRequest)
        }
        */
        this.Request = {
          product_interest: this.Requestedit.product_interest,
          product_group: this.Requestedit.product_group,
          request_type: this.Requestedit.request_type,
          referred_ext: this.Requestedit.referred_ext,
          tags: leadetiqueta ?? null,
          state: this.Requestedit.state,
          place: this.Requestedit.place,
          state_reason: this.Requestedit.state_reason,
          priority_score: this.Requestedit.priority_score,
          user: this.Requestedit.user,
          comment: this.Requestedit.comment,
          product: this.dataproducto.id,
          referred: this.Requestedit.referred,
          referral_code: this.Requestedit.referral_code,
          projected_quote: this.Requestedit.projected_quote,
          campaign_slug: this.Requestedit.campaign_slug,
          quotation_received: this.Requestedit.quotation_received,
          adjudication_date: this.Requestedit.adjudication_date,
          quotation_delivered: this.Requestedit.quotation_delivered
        }
      }
      this.Botonguardarcambios = false
      const data = await this.$UpdateRequest(this.Requestedit.id, this.Request)
      if (data.success) {
        this.requestnew = data
        if (this.optioncliente !== '') {
          this.$refs['modal-alertrequeedit'].show()
        } else {
          this.$refs['modal-alert'].show()
        }
        this.ListRequests()
        if (this.$store.state.localStorage.user.role !== 'EXT_KAM') {
          this.getHistory(this.Requestedit.id);
        }
      }
      this.Botonguardarcambios = false
    },
    async openExistingLead (value) {
      this.AditionalDataAp = {
        observaciones: '',
        AseguradosAdicionales: [],
      }
      this.idcolectivo = ''
      this.ViewOmitidos = false
      this.loading = true
      const datarequest = await this.$GetRequest(value.id)
      this.requestnew = datarequest
      this.ProductExistente = false
      this.$nuxt.$loading.start()
      this.ProductsRequest.id = ''
      this.ProductsRequest.nro_poliza = ''
      this.ProductsRequest.name = ''
      this.ProductsRequest.company = ''
      this.option = 'edit'
      this.productdetails = []
      this.productnodetails = []
      const lead = []
      for (const [key, datarequest] of Object.entries(datarequest.tags)) {
        if (datarequest) {
          lead.push(datarequest.id)
        }
      }
      this.Requestedit = datarequest
      this.Requestedit.tags = lead
      this.CheckedPartners()
      if (this.Requestedit?.id) {
        const newQuery = { id: this.Requestedit.id }
        this.updateLeadIdInQuery(newQuery)
      }
      this.GetChangePriority(this.Requestedit.priority_score)
      /* if (this.Requestedit.state_reason) {
        const idStatereason = this.Requestedit.state_reason.id
        this.Requestedit.state_reason = idStatereason
      } */
      // this.InfoContact = await this.$GetContact(this.Requestedit.lead)
      this.InfoContact = this.Requestedit.lead_details
      this.colectivossolicitud = {}
      this.documentossolicitud = await this.$GetDocumentsRequest(
        this.Requestedit.id
      )
      if (this.$store.state.localStorage.user.role !== 'EXT_KAM') {
        this.getHistory(this.Requestedit.id);
      }
      if (this.Requestedit.product_group === 'seguro_colectivo_de_salud') {
        const idempresa = await this.$GetColectivoEmpresa(
          this.Requestedit.id
        )
        if (idempresa) {
          this.idcolectivo = idempresa
          this.colectivossolicitud = await this.$GetColectivoRequest(
            idempresa
          )
        }
      }
      this.bitacorasolicitud = await this.$GetBitacoraRequest(
        this.Requestedit.id
      )
      this.idcliente = this.InfoContact.id
      // this.Requestedit.user = this.InfoContact.user
      console.log(this.Requestedit.aditional_data);
      if (this.Requestedit.product_group === 'seguro_de_accidentes_personales' && this.Requestedit.aditional_data) {
        if (!this.Requestedit.aditional_data) {
          this.Requestedit.aditional_data = []
        }
        const observaciones = this.Requestedit.aditional_data.filter(
          item => item.field_name === 'observaciones'
        )
        console.log(observaciones, 'observaciones');
        if (observaciones.length > 0 && observaciones[0].value) {
          this.AditionalDataAp.observaciones = observaciones[0].value
        }
        /* const siniestralidad = this.Requestedit.aditional_data.filter(
           item => item.field_name === 'siniestralidad'
         )
         if (siniestralidad.length > 0 && siniestralidad[0].value) {
           this.AditionalDataAp.siniestralidad = siniestralidad[0].value
         }
         const coberturas = this.Requestedit.aditional_data.filter(
           item => item.field_name === 'coberturas'
         )
         if (coberturas.length > 0 && coberturas[0].value) {
           this.AditionalDataAp.coberturas = coberturas[0].value
         }
           */
        const AseguradosAdicionales = this.Requestedit.aditional_data.filter(
          item => item.field_name === 'AseguradosAdicionales'
        )
        if (AseguradosAdicionales.length > 0 && AseguradosAdicionales[0].value) {
          this.AditionalDataAp.AseguradosAdicionales = AseguradosAdicionales[0].value
        }


        this.Requestedit.aditional_data = this.Requestedit.aditional_data.filter(
          item => item.field_name !== 'observaciones' && item.field_name !== 'observaciones' && item.field_name !== 'siniestralidad' && item.field_name !== 'coberturas' && item.field_name !== 'AseguradosAdicionales'
        )
      }
      let aditionaldatadelete = this.Requestedit.aditional_data
      const aditionaldatanodelete = this.Requestedit.aditional_data
      if (aditionaldatadelete) {
        for (let i = 0; i < aditionaldatadelete.length; i++) {
          this.AditionalDataEdit[aditionaldatadelete[i].field_name] = aditionaldatadelete[i].value
        }
      }
      const aditionalnodelete2 = []
      if (aditionaldatadelete) {
        for (const [key] of Object.entries(this.Leads)) {
          aditionaldatadelete = aditionaldatadelete.filter(
            item => item.field_name !== key || item.show_in_frontend === false
          )
          const noaditional = aditionaldatanodelete.find(
            ({ field_name }) => key === field_name
          )
          if (
            noaditional &&
            noaditional.field_name !== 'employee_quantity_choice'
          ) {
            aditionalnodelete2.push(noaditional)
          }
        }
        this.productdetails = aditionaldatadelete
        this.productnodetails = aditionalnodelete2
      } else {
        this.productdetails = []
        this.productnodetails = []
      }

      /* if (this.productdetails) {
        // const personaEliminar = 'list'
        // const oldproductdetails = this.productdetails
        // const newproductdetails = oldproductdetails.filter(x => x.data_type !== personaEliminar)
        this.productdetails = this.productdetails
      }
      */
      if (this.Requestedit.product) {
        this.ProductsRequest = await this.$GetProductRequest(
          this.Requestedit.product
        )
        if (this.ProductsRequest.collect_payment) {
          this.CobranzaPay = await this.$GetProductCobranzaPoliza(this.ProductsRequest.collect_payment.id)
        }
        const lead = []
        for (const [key, request] of Object.entries(this.ProductsRequest.tags)) {
          if (request) {
            lead.push(request.id)
          }
        }
        this.ProductsRequest.tags = lead
        if (!this.ProductsRequest) {
          this.productold = false
          this.ProductExistente = false
        } else {
          this.ProductExistente = true
          this.productold = true
        }
      }
      this.StatusInfo()
      setTimeout(() => {
        this.loading = false
      }, 1000)
      this.$nuxt.$loading.finish()
    },
    async openExistingLead2 (value, clienteid) {
      this.AditionalDataAp = {
        observaciones: '',
        AseguradosAdicionales: [],
      }
      this.idcolectivo = ''
      this.ViewOmitidos = false
      this.requestnew = value
      this.ProductExistente = false
      this.$nuxt.$loading.start()
      this.ProductsRequest.id = ''
      this.ProductsRequest.nro_poliza = ''
      this.ProductsRequest.name = ''
      this.ProductsRequest.company = ''
      this.option = 'edit'
      const lead = []
      this.productdetails = []
      this.productnodetails = []
      for (const [key, value] of Object.entries(value.tags)) {
        if (value) {
          lead.push(value.id)
        }
      }
      this.Requestedit = value
      this.Requestedit.tags = lead
      this.CheckedPartners()
      this.Requestedit = clienteid
      if (this.Requestedit?.id) {
        const newQuery = { id: this.Requestedit.id }
        this.updateLeadIdInQuery(newQuery)
      }
      this.GetChangePriority(this.Requestedit.priority_score)
      /* if (this.Requestedit.state_reason) {
        const idStatereason = this.Requestedit.state_reason.id
        this.Requestedit.state_reason = idStatereason
      } */
      this.InfoContact = this.Requestedit.lead_details
      if (this.Requestedit.product_group === 'seguro_de_accidentes_personales' && this.Requestedit.aditional_data) {
        if (!this.Requestedit.aditional_data) {
          this.Requestedit.aditional_data = []
        }
        const observaciones = this.Requestedit.aditional_data.filter(
          item => item.field_name === 'observaciones'
        )
        console.log(observaciones, 'observaciones');
        if (observaciones.length > 0 && observaciones[0].value) {
          this.AditionalDataAp.observaciones = observaciones[0].value
        }
        /* const siniestralidad = this.Requestedit.aditional_data.filter(
           item => item.field_name === 'siniestralidad'
         )
         if (siniestralidad.length > 0 && siniestralidad[0].value) {
           this.AditionalDataAp.siniestralidad = siniestralidad[0].value
         }
         const coberturas = this.Requestedit.aditional_data.filter(
           item => item.field_name === 'coberturas'
         )
         if (coberturas.length > 0 && coberturas[0].value) {
           this.AditionalDataAp.coberturas = coberturas[0].value
         }
           */
        const AseguradosAdicionales = this.Requestedit.aditional_data.filter(
          item => item.field_name === 'AseguradosAdicionales'
        )
        if (AseguradosAdicionales.length > 0 && AseguradosAdicionales[0].value) {
          this.AditionalDataAp.AseguradosAdicionales = AseguradosAdicionales[0].value
        }

        this.Requestedit.aditional_data = this.Requestedit.aditional_data.filter(
          item => item.field_name !== 'observaciones' || item.field_name !== 'observaciones' || item.field_name !== 'siniestralidad' || item.field_name !== 'coberturas' || item.field_name !== 'AseguradosAdicionales'
        )
      }
      let aditionaldatadelete = this.Requestedit.aditional_data
      const aditionaldatanodelete = this.Requestedit.aditional_data
      if (aditionaldatadelete) {
        for (let i = 0; i < aditionaldatadelete.length; i++) {
          this.AditionalDataEdit[aditionaldatadelete[i].field_name] = aditionaldatadelete[i].value
        }
      }
      const aditionalnodelete2 = []
      if (aditionaldatadelete) {
        for (const [key] of Object.entries(this.Leads)) {
          aditionaldatadelete = aditionaldatadelete.filter(
            item => item.field_name !== key || item.show_in_frontend === false
          )
          const noaditional = aditionaldatanodelete.find(
            ({ field_name }) => key === field_name
          )
          if (
            noaditional &&
            noaditional.field_name !== 'employee_quantity_choice'
          ) {
            aditionalnodelete2.push(noaditional)
          }
        }
        this.productdetails = aditionaldatadelete
        this.productnodetails = aditionalnodelete2
      } else {
        this.productdetails = []
        this.productnodetails = []
      }
      /* if (this.productdetails) {
        // const personaEliminar = 'list'
        // const oldproductdetails = this.productdetails
        // const newproductdetails = oldproductdetails.filter(x => x.data_type !== personaEliminar)
        this.productdetails = this.productdetails
      }
      */
      if (this.Requestedit.product) {
        this.ProductsRequest = await this.$GetProductRequest(
          this.Requestedit.product
        )
        if (this.ProductsRequest.collect_payment) {
          this.CobranzaPay = await this.$GetProductCobranzaPoliza(this.ProductsRequest.collect_payment.id)
        }
        const lead = []
        for (const [key, value] of Object.entries(this.ProductsRequest.tags)) {
          if (value) {
            lead.push(value.id)
          }
        }
        this.ProductsRequest.tags = lead
        if (!this.ProductsRequest) {
          this.productold = false
          this.ProductExistente = false
        } else {
          this.ProductExistente = true
          this.productold = true
        }
      }
      this.$nuxt.$loading.finish()
    },
    async openExistingLead3 (value, poliza) {
      this.AditionalDataAp = {
        observaciones: '',
        AseguradosAdicionales: [],
      }
      this.idcolectivo = ''
      this.ViewOmitidos = false
      this.loading = true
      const datarequest = await this.$GetRequest(value.id)
      this.requestnew = datarequest
      this.ProductExistente = false
      this.$nuxt.$loading.start()
      this.option = 'edit'
      const lead = []
      this.productdetails = []
      this.productnodetails = []
      for (const [key, datarequest] of Object.entries(datarequest.tags)) {
        if (datarequest) {
          lead.push(datarequest.id)
        }
      }
      this.Requestedit = datarequest
      this.Requestedit.tags = lead
      this.CheckedPartners()
      if (this.Requestedit?.id) {
        const newQuery = { id: this.Requestedit.id }
        this.updateLeadIdInQuery(newQuery)
      }
      this.getProductPo(poliza)
      this.InfoContact = this.Requestedit.lead_details
      this.colectivossolicitud = {}
      this.documentossolicitud = await this.$GetDocumentsRequest(
        this.Requestedit.id
      )
      if (this.Requestedit.product_group === 'seguro_colectivo_de_salud') {
        const idempresa = await this.$GetColectivoEmpresa(
          this.Requestedit.id
        )
        if (idempresa) {
          this.idcolectivo = idempresa
          this.colectivossolicitud = await this.$GetColectivoRequest(
            idempresa
          )
        }
      }
      this.bitacorasolicitud = await this.$GetBitacoraRequest(
        this.Requestedit.id
      )
      this.idcliente = this.InfoContact.id
      // this.Requestedit.user = this.InfoContact.user
      if (this.Requestedit.product_group === 'seguro_de_accidentes_personales' && this.Requestedit.aditional_data) {
        if (!this.Requestedit.aditional_data) {
          this.Requestedit.aditional_data = []
        }
        const observaciones = this.Requestedit.aditional_data.filter(
          item => item.field_name === 'observaciones'
        )
        console.log(observaciones, 'observaciones');
        if (observaciones.length > 0 && observaciones[0].value) {
          this.AditionalDataAp.observaciones = observaciones[0].value
        }
        /*const siniestralidad = this.Requestedit.aditional_data.filter(
          item => item.field_name === 'siniestralidad'
        )
        if (siniestralidad.length > 0 && siniestralidad[0].value) {
          this.AditionalDataAp.siniestralidad = siniestralidad[0].value
        }
        const coberturas = this.Requestedit.aditional_data.filter(
          item => item.field_name === 'coberturas'
        )
        if (coberturas.length > 0 && coberturas[0].value) {
          this.AditionalDataAp.coberturas = coberturas[0].value
        }
          */
        const AseguradosAdicionales = this.Requestedit.aditional_data.filter(
          item => item.field_name === 'AseguradosAdicionales'
        )
        if (AseguradosAdicionales.length > 0 && AseguradosAdicionales[0].value) {
          this.AditionalDataAp.AseguradosAdicionales = AseguradosAdicionales[0].value
        }

        this.Requestedit.aditional_data = this.Requestedit.aditional_data.filter(
          item => item.field_name !== 'observaciones' || item.field_name !== 'observaciones' || item.field_name !== 'siniestralidad' || item.field_name !== 'coberturas' || item.field_name !== 'AseguradosAdicionales'
        )
      }
      let aditionaldatadelete = this.Requestedit.aditional_data
      const aditionaldatanodelete = this.Requestedit.aditional_data
      if (aditionaldatadelete) {
        for (let i = 0; i < aditionaldatadelete.length; i++) {
          this.AditionalDataEdit[aditionaldatadelete[i].field_name] = aditionaldatadelete[i].value
        }
      }
      const aditionalnodelete2 = []
      if (aditionaldatadelete) {
        for (const [key] of Object.entries(this.Leads)) {
          aditionaldatadelete = aditionaldatadelete.filter(
            item => item.field_name !== key || item.show_in_frontend === false
          )
          const noaditional = aditionaldatanodelete.find(
            ({ field_name }) => key === field_name
          )
          if (
            noaditional &&
            noaditional.field_name !== 'employee_quantity_choice'
          ) {
            aditionalnodelete2.push(noaditional)
          }
        }
        this.productdetails = aditionaldatadelete
        this.productnodetails = aditionalnodelete2
      } else {
        this.productdetails = []
        this.productnodetails = []
      }

      /* if (this.productdetails) {
        // const personaEliminar = 'list'
        // const oldproductdetails = this.productdetails
        // const newproductdetails = oldproductdetails.filter(x => x.data_type !== personaEliminar)
        this.productdetails = this.productdetails
      }
      */
      setTimeout(() => {
        this.loading = false
      }, 1000)
      this.StatusInfo()
      this.$nuxt.$loading.finish()
    },
    updateLeadIdInQuery (query) {
      this.$router.push({ path: 'solicitudes', query })
    },
    deleteSolicitud (data) {
      const id = data.id
      this.$bvModal
        .msgBoxConfirm('¿Desea Eliminar esta solicitud?', {
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
            this.DeleteRequestEnd(id)
          }
        })
    },
    getLineProducts (group) {
      return this.products[group]
    },
    async DeleteRequestEnd (id) {
      try {
        await this.$simpleeApi.delete(`/request/${id}/`)
        this.$refs['modal-alert6'].show()

        this.ListRequests(this.page)
        this.option = 'table'
      } catch (error) {
        console.log({ error })
        this.$store.commit('setAlertMessage', error.response.data)
      }
    },
    sendcorreos (data) {
      const id = data.id
      this.$bvModal
        .msgBoxConfirm('¿Desea enviar un correo a esta solicitud?', {
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
            this.Sendcorreofinish(id)
          }
        })
    },
    async Sendcorreofinish (id) {
      try {
        await this.$simpleeApi.post('/first_contact_email/', {
          request: id
        })
        this.$refs['modal-alert9'].show()
      } catch (error) {
        this.$sendErrorPayload({
          payload: id,
          origin: 'correo',
          errorResponse: error.response,
          expectedBehavior: `Deberia enviar un correo a la solicitud ${id}`
        })
      }
    },
    sendwhatsapp (data) {
      const id = data.id
      this.$bvModal
        .msgBoxConfirm('¿Desea enviar un Whatsapp a esta solicitud?', {
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
            this.sendwhatsappfinish(id)
          }
        })
    },
    async sendwhatsappfinish (id) {
      try {
        await this.$simpleeApi.post('/send_ws_contact_message/', {
          request: id
        })
        this.$refs['modal-alert10'].show()
      } catch (error) {
        this.$sendErrorPayload({
          payload: id,
          origin: 'whatsapp',
          errorResponse: error.response,
          expectedBehavior: `Deberia enviar un whatsapp a la solicitud ${id}`
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
    confirmSolicitud () {
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
            setTimeout(() => this.saveRequestEdit(), 500)
          }
        })
    },
    deleteColectivo (data) {
      const id = data.id
      this.$bvModal
        .msgBoxConfirm('¿Desea Eliminar este empleado?', {
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
            this.DeleteEmpleado(id)
          }
        })
      this.ListRequests()
    },
    async DeleteEmpleado (id) {
      try {
        await this.$simpleeApi.delete(
          `/colectivo_empleado/${id}`
        )
        this.$refs['modal-alert13'].show()
        this.openExistingLead(this.Requestedit)
      } catch (error) {
        this.$sendErrorPayload({
          payload: id,
          origin: 'colectivo',
          errorResponse: error.response,
          expectedBehavior: `Deberia borrarse el empleado de la solicitud ${this.Requestedit.id}`
        })
      }
    },
    deletedocumento (data) {
      const id = data.id
      this.$bvModal
        .msgBoxConfirm('¿Desea Eliminar este documento?', {
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
      this.ListRequests()
    },
    deletebitacora (data) {
      const id = data.id
      this.$bvModal
        .msgBoxConfirm('¿Desea Eliminar este Registro?', {
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
            this.DeleteBitacora(id)
            this.ListRequests()
          }
        })
    },
    editBitacora (data, request) {
      this.idrequest = request
      this.idproduct = null
      this.requestbitacoraval = true
      data.date = data.date.substring(0, data.date.length - 1)
      this.bitacorarequestdata = data
      this.modalbitacora = true
    },
    async Deletedocument (id) {
      try {
        await this.$simpleeApi.delete(
          `/request/${this.Requestedit.id}/document/${id}/`
        )
        this.$refs['modal-alert8'].show()
        this.openExistingLead(this.Requestedit)
      } catch (error) {
        this.$sendErrorPayload({
          payload: id,
          origin: 'producto',
          errorResponse: error.response,
          expectedBehavior: `Deberia borrarse documento de la solicitud ${this.Requestedit.id}`
        })
      }
    },
    async DeleteBitacora (id) {
      try {
        await this.$simpleeApi.delete(
          `/request/${this.Requestedit.id}/lead_request_bitacora/${id}/`
        )
        this.$refs['modal-alert-deleteB'].show()
        this.openExistingLead(this.Requestedit)
      } catch (error) {
        this.$sendErrorPayload({
          payload: id,
          origin: 'solicitud',
          errorResponse: error.response,
          expectedBehavior: `Deberia borrarse bitacora de la solicitud ${this.Requestedit.id}`
        })
      }
    },
    async UpdateContactNewRequest (value) {
      this.asignclientexistnewequest = true
      this.$nuxt.$loading.start()
      this.Leads = await this.$GetContact(value)
      this.leadid = this.Leads.id
      this.Request.user = this.Leads.user
      this.modalreasigproduct = false
      this.$nuxt.$loading.finish()
    },
    async UpdateContactNew (value) {
      this.$nuxt.$loading.start()
      let request = null
      this.modalreasigproductedit = false
      request = {
        lead: value,
        request_type: this.Requestedit.request_type
      }
      const data = await this.$UpdateRequest(this.Requestedit.id, request)
      if (data.success) {
        this.openExistingLead(data)
        this.$refs['modal-alert2'].show()
      }
      this.$nuxt.$loading.finish()
    },
    async UpdateProductNew (value) {
      if (!this.Requestedit.request_type) {
        this.$store.commit('setAlertMessage', {
          error:
            'El campo tipo de solicitud es obligatorio antes de agregar el producto'
        })
        return
      }
      if (!this.Requestedit.product_interest) {
        this.$store.commit('setAlertMessage', {
          error:
            'El campo producto en la solicitud es obligatorio para agregar el producto'
        })
        return
      }

      if (!this.Requestedit.product_group) {
        this.$store.commit('setAlertMessage', {
          error:
            'El campo Grupo de producto es obligatorio para agregar el producto'
        })
        return
      }
      if (!this.Requestedit.channel) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo canal es obligatorio antes de agregar el producto'
        })
        return
      }
      if (this.Requestedit.channel) {
        if (!this.Requestedit.campaign_slug) {
          this.$store.commit('setAlertMessage', {
            error:
              'El campo Campaña es obligatorio antes de agregar el producto'
          })
          return
        }
      }
      if (this.Requestedit.campaign_slug === 'ejecutivos-externos') {
        if (!this.Requestedit.referred) {
          this.$store.commit('setAlertMessage', {
            error:
              'El campo ejecutivo referido es obligatorio antes de agregar el producto'
          })
          return
        }
      }
      if (this.Requestedit.campaign_slug === 'staree') {
        if (!this.Requestedit.referral_code) {
          this.$store.commit('setAlertMessage', {
            error:
              'El campo codigo de referido es obligatorio antes de agregar el producto'
          })
          return
        }
      }
      if (!this.Requestedit.user) {
        this.$store.commit('setAlertMessage', {
          error:
            'El campo ejecutivo es obligatorio antes de agregar el producto'
        })
        return
      }
      this.$nuxt.$loading.start()
      const productchange = await this.$GetProductRequest(value)
      const lead = []
      for (const [key, value] of Object.entries(productchange.tags)) {
        console.log(value)
        if (value) {
          lead.push(value.id)
        }
      }
      productchange.tags = lead
      if (productchange.lead_request) {
        const datarequestold = await this.$GetRequest(
          productchange.lead_request
        )
        let request = null
        request = {
          product: null,
          request_type: datarequestold.request_type
        }
        await this.$UpdateRequest(productchange.lead_request, request)
      }
      productchange.lead_request = this.Requestedit.id
      await this.$updateProduct(productchange.id, productchange)
      let request = null
      this.modalreasigproduct2 = false
      request = {
        product: value,
        request_type: this.Requestedit.request_type,
        state: 'cliente_cerrado'
      }
      const error = await this.$UpdateRequest(this.Requestedit.id, request)
      if (error.success) {
        this.reloadproduct(this.Requestedit.id)
        this.$refs['modal-alert3'].show()
      } else {
        console.log(error.response)
      }
      this.$nuxt.$loading.finish()
    },
    async reloadproduct (id) {
      const data = await this.$GetRequest(id)
      this.openExistingLead(data)
    },
    async onSaveProduct (data) {
      if (!this.Requestedit.request_type) {
        this.$store.commit('setAlertMessage', {
          error:
            'El campo tipo de solicitud es obligatorio antes de agregar el producto'
        })
        return
      }
      /*
      if (!this.Requestedit.product_interest) {
        this.$store.commit("setAlertMessage", {
          error:
            "El campo producto en la solicitud es obligatorio para agregar el producto",
        });
        return;
      }

      if (!this.Requestedit.product_group) {
        this.$store.commit("setAlertMessage", {
          error:
            "El campo Grupo de producto es obligatorio para agregar el producto",
        });
        return;
      }
      */
      if (!this.Requestedit.channel) {
        this.$store.commit('setAlertMessage', {
          error: 'El campo canal es obligatorio antes de agregar el producto'
        })
        return
      }
      if (this.Requestedit.channel) {
        if (!this.Requestedit.campaign_slug) {
          this.$store.commit('setAlertMessage', {
            error:
              'El campo Campaña es obligatorio antes de agregar el producto'
          })
          return
        }
      }
      if (this.Requestedit.campaign_slug === 'ejecutivos-externos') {
        if (!this.Requestedit.referred) {
          this.$store.commit('setAlertMessage', {
            error:
              'El campo ejecutivo referido es obligatorio antes de agregar el producto'
          })
          return
        }
      }
      if (this.Requestedit.campaign_slug === 'staree') {
        if (!this.Requestedit.referral_code) {
          this.$store.commit('setAlertMessage', {
            error:
              'El campo codigo de referido es obligatorio antes de agregar el producto'
          })
          return
        }
      }
      if (!this.Requestedit.user) {
        this.$store.commit('setAlertMessage', {
          error:
            'El campo ejecutivo es obligatorio antes de agregar el producto'
        })
        return
      }
      if (data.tags) {
        const leadetiqueta = []
        for (const [key, value] of Object.entries(data.tags)) {
          if (value) {
            const newlead2 = {
              id: value
            }
            leadetiqueta.push(newlead2)
          }
        }
        data.tags = leadetiqueta
      }
      this.Requestedit.state = 'cliente_cerrado'
      if (data.product_type === 'endoso') {
        this.Requestedit.request_type = 'endosos'
      }
      if (data.product_type === 'renovacion') {
        this.Requestedit.request_type = data.product_type
      }
      this.ProductExistente = true
      data.lead_request = this.Requestedit.id
      delete data.tags
      const Cobranza = data.Cobranza
      delete data.Cobranza
      const product = await this.$PostProduct(data)
      if (this.version === 'cl' && Cobranza.payment_type && Cobranza.payment_date_start && Cobranza.dues) {
        try {
          const { data } = await this.$simpleeApi.post(
            '/cobranza/collect_payment/',
            {
              product: product.id,
              payment_type: Cobranza.payment_type,
              dues: Cobranza.dues,
              payment_date_start: Cobranza.payment_date_start,
              executive: Cobranza.executive,
              total_amount: product.prima,
              iva_percentage: Cobranza.iva_percentage,
              amount_dues: Cobranza.amount_dues
            }
          )
          console.log(data)
        } catch (error) {
          console.log(error)
        }
      }
      const Request = {
        product: product.id,
        product_interest: this.Requestedit.product_interest ?? data.name,
        product_group: this.Requestedit.product_group ?? data.group,
        referred_ext: this.Requestedit.referred_ext,
        request_type: this.Requestedit.request_type,
        state: this.Requestedit.state,
        place: this.Requestedit.place,
        state_reason: this.Requestedit.state_reason,
        priority_score: this.Requestedit.priority_score,
        user: this.Requestedit.user,
        comment: this.Requestedit.comment,
        referred: this.Requestedit.referred,
        referral_code: this.Requestedit.referral_code,
        projected_quote: this.Requestedit.projected_quote,
        campaign_slug: this.Requestedit.campaign_slug,
        quotation_received: this.Requestedit.quotation_received,
        adjudication_date: this.Requestedit.adjudication_date,
        quotation_delivered: this.Requestedit.quotation_delivered
      }
      await this.$UpdateRequest(this.Requestedit.id, Request)
      this.ProductsRequest = data
      const request = await this.$GetRequest(this.Requestedit.id)
      this.openExistingLead(request)
      this.onCloseModal()
      this.$refs['modal-alert4'].show()
      // this.PostEmisionDocumentprev(product.id);
    },
    PostEmisionDocumentprev: _.debounce(function (id) {
      this.PostEmisionDocument(id)
    }, 10000),
    SendCertificate (idProduct) {
      this.currentIdProduct = idProduct
      this.$refs['modal-cetificate'].show()
    },
    handleCheckboxClick () {
      this.checksendO = !this.checksendO
    },
    async PostEmisionDocument () {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const isValidEmail = emailRegex.test(this.emailToSend)

      if (!this.checkSendKam && !this.checksendO) {
        this.$store.commit('setAlertMessage', {
          error: 'Debe seleccionar si envía a la KAM o a otro correo'
        })
        return
      }
      if (this.checksendO) {
        if (!isValidEmail) {
          this.$store.commit('setAlertMessage', {
            error: 'No esta Ingresando un correo Válido'
          })
          return
        }
      }
      try {
        this.$refs['modal-cetificate'].hide()
        const data = {
          IdProduct: this.currentIdProduct,
          typeCertificate: this.tipoCertificado,
          message: this.mensajeDelCertificado,
          checkSendKam: this.checkSendKam,
          emailToSend: this.emailToSend
        }
        console.log(data)
        await this.$simpleeApi.post('/pol_emision/', data)
        this.$store.commit('setAlertMessage', {
          success: 'Certificado enviado a tu correo'
        })
        this.currentIdProduct = null
        this.tipoCertificado = 'poliza'
        this.mensajeDelCertificado = ''
        this.checkSendKam = true
        this.checksendO = false
        this.emailToSend = ''
        this.mostrarMensajeDelCertificado = false
      } catch (error) {
        console.log(error)
      }
    },
    handleTipoCertificadoChange () {
      if (this.tipoCertificado === 'endoso') {
        this.mostrarMensajeDelCertificado = true
      } else {
        this.mostrarMensajeDelCertificado = false
      }
    },
    async onSaveProductEdit (data) {
      delete data.documents
      const Ini = new Date(data.fecha_inicio_vigencia)
      const Fin = new Date(data.fecha_termino_vigencia)
      const isValidDate = Date.parse(data.fecha_termino_vigencia)
      if (Ini > Fin) {
        this.$store.commit('setAlertMessage', {
          error:
            'La fecha Término de la vigencia no puede ser menor a Inicio de vigencia'
        })
        return
      } else if (isNaN(isValidDate)) {
        this.$store.commit('setAlertMessage', { error: 'Fecha no valida' })
        return
      }
      if (this.Requestedit.user) {
        data.user = this.Requestedit.user
      }
      if (data.tags) {
        const leadetiqueta = []
        for (const [key, value] of Object.entries(data.tags)) {
          if (value) {
            const newlead2 = {
              id: value
            }
            leadetiqueta.push(newlead2)
          }
        }
        data.tags = leadetiqueta
      }
      delete data.documents
      delete data.tags
      const Cobranza = data.Cobranza
      delete data.Cobranza
      await this.$updateProduct(data.id, data)
      if (this.version === 'cl' && Cobranza.payment_type && Cobranza.payment_date_start && Cobranza.dues) {
        if (!Cobranza.id) {
          try {
            const { datados } = await this.$simpleeApi.post(
              '/cobranza/collect_payment/',
              {
                product: data.id,
                payment_type: Cobranza.payment_type,
                dues: Cobranza.dues,
                payment_date_start: Cobranza.payment_date_start,
                executive: 15,
                total_amount: data.prima,
                iva_percentage: 19,
                amount_dues: null
              }
            )
            console.log(datados)
          } catch (error) {
            console.log(error)
          }
        }
      }
      this.ProductExistente = true
      const productupdate = await this.$GetProductRequest(data.id)
      const lead = []
      for (const [key, value] of Object.entries(productupdate.tags)) {
        console.log(value)
        if (value) {
          lead.push(value.id)
        }
      }
      productupdate.tags = lead
      this.ProductsRequest = productupdate
      if (this.ProductsRequest.collect_payment) {
        this.CobranzaPay = await this.$GetProductCobranzaPoliza(this.ProductsRequest.collect_payment.id)
      }
      this.$refs['modal-alert4'].show()
      this.onCloseModal()
    },
    GetChangePriority (value) {
      if (value > 10 && value < 15) {
        this.Requestedit.priority = 'alta'
      } else if (value > 6 && value < 11) {
        this.Requestedit.priority = 'media'
      } else if (value > 2 && value < 7) {
        this.Requestedit.priority = 'baja'
      } else {
        this.Requestedit.priority = 'sin_prioridad'
      }
    },
    ChangePriority () {
      if (this.Request.priority === 'alta') {
        this.Request.priority_score = 13
      } else if (this.Request.priority === 'media') {
        this.Request.priority_score = 9
      } else if (this.Request.priority === 'baja') {
        this.Request.priority_score = 5
      } else {
        this.Request.priority_score = 0
      }
    },
    ChangePriorityEdit () {
      if (this.Requestedit.priority === 'alta') {
        this.Requestedit.priority_score = 13
      } else if (this.Requestedit.priority === 'media') {
        this.Requestedit.priority_score = 9
      } else if (this.Requestedit.priority === 'baja') {
        this.Requestedit.priority_score = 5
      } else {
        this.Requestedit.priority_score = 0
      }
    },
    getSavedRequest (data) {
      if (this.optioncliente !== '') {
        const idclient = this.idcliente
        this.$refs['modal-alertreque'].hide()
        this.$router.push({
          path: this.optioncliente,
          query: { id: idclient, sitio: 'solicitudes' }
        })
      } else {
        this.openExistingLead(data)
        this.$refs['modal-alert'].hide()
      }
    },
    getSavedRequest2 (data) {
      this.openExistingLead(data)
      this.$refs['modal-alertrequeedit'].hide()
      this.$refs['modal-alertreque'].hide()
    },
    closeRequestAlertModal () {
      this.$refs['modal-alert'].hide()
    },
    closeRequestAlertModalAditional () {
      this.$refs['modal-alertrequeeditAditional'].hide()
    },
    closeRequestAlertModal2 () {
      this.$refs['modal-alert2'].hide()
    },
    closeRequestAlertModal6 () {
      this.$refs['modal-alert6'].hide()
    },
    closeRequestAlertModal3 () {
      this.$refs['modal-alert3'].hide()
    },
    closeRequestAlertModal4 () {
      this.$refs['modal-alert4'].hide()
    },
    closeRequestAlertModal7 () {
      this.$refs['modal-alert7'].hide()
    },
    closeRequestAlertModalBitacoraDelete () {
      this.$refs['modal-alert-deleteB'].hide()
    },
    closeRequestAlertModalBitacora () {
      this.$refs['modal-alert-bitacora'].hide()
    },
    closeRequestAlertModalBitacoraEdit () {
      this.$refs['modal-alert-bitacoraEdit'].hide()
    },
    closeRequestAlertModal8 () {
      this.$refs['modal-alert8'].hide()
    },
    closeRequestAlertModal9 () {
      this.$refs['modal-alert9'].hide()
    },
    closeRequestAlertModal10 () {
      this.$refs['modal-alert10'].hide()
    },
    closeRequestAlertModal11 () {
      this.$refs['modal-alert11'].hide()
    },
    closeRequestAlertModal12 () {
      this.$refs['modal-alert12'].hide()
    },
    closeRequestAlertModal13 () {
      this.$refs['modal-alert13'].hide()
    },
    cancelRquest () {
      this.option = 'table'
      this.ProductExistente = false
    },
    newRequest () {
      this.option = 'new'
    },
    getBicatoraDate (bitaDate) {
      const date = new Date(bitaDate)

      const day = ('0' + date.getUTCDate()).slice(-2)
      const month = ('0' + (date.getUTCMonth() + 1)).slice(-2)
      const year = date.getUTCFullYear()
      const hours = ('0' + date.getUTCHours()).slice(-2)
      const minutes = ('0' + date.getUTCMinutes()).slice(-2)

      return `${day}/${month}/${year} ${hours}:${minutes}`
    },
    getLeadDate (leadDate) {
      const createdAt = new Date(leadDate).toLocaleString('en-GB')
      const [date, hour] = createdAt.split(',')
      return `${date}\n${hour}`
    },
    getComisionFinal (value) {
      if (value.referred) {
        return value.monto
        /*
  const referredd = this.refferals.filter(
           xd => xd.value === value.referred
         )
         const referred_final = referredd[0].commission
         const comision_final = value.monto * referred_final
         return value.monto - comision_final
        */
      } else if (value.campaign_slug) {
        return value.monto
        /* let referred_final
        if (value.campaign_slug === 'que-plan') {
          referred_final = 0.3
          const comision_final = value.monto * referred_final
          return value.monto - comision_final
        } else if (value.campaign_slug === 'asegurateonline') {
          referred_final = 0.5
          const comision_final = value.monto * referred_final
          return value.monto - comision_final
        } else if (value.campaign_slug === 'kapitallis') {
          referred_final = 0.3
          const comision_final = value.monto * referred_final
          return value.monto - comision_final
        } else {
          return value.monto
        }
        */
      } else {
        return value.monto
      }
    },
    getLeadChannel (channel) {
      const channelObject = this.channels.find(
        ({ value }) => value === channel
      )
      if (channelObject) {
        return channelObject.text
      }
      return 'Canal no creado'
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
    getTypePriorityNull () {
      return ''
    },
    rowClassrequest () {
      return 'rowClassrequest'
    },
    getcampaing (id) {
      const campanas = this.campanas.filter(
        campana => campana.channel === id
      )
      return campanas
    },
    formatWhatsAppNumber (text) {
      const phone = text.replace(/ /g, '')
      return phone.replace('+', '')
    },
    getTypePrioritytitle (value) {
      if (value > 10 && value < 15) {
        return 'Prioridad alta'
      } else if (value > 6 && value < 11) {
        return 'Prioridad media'
      } else if (value > 2 && value < 7) {
        return ''
      }
    },
    getTypePriority1 (value) {
      if (value > 10 && value < 15) {
        return 'outer-circle-alta'
      } else if (value > 6 && value < 11) {
        return 'outer-circle-media'
      } else if (value > 2 && value < 7) {
        return ''
      }
    },
    getTypePriority2 (value) {
      if (value > 10 && value < 15) {
        return 'inner-circle-alta'
      } else if (value > 6 && value < 11) {
        return 'inner-circle-media'
      } else if (value > 2 && value < 7) {
        return ''
      }
    },
    generateCsv (timezone) {
      this.getCsvRequest({ urlParams: this.urlParams, timezone })
    },
    getTypeProductInterest (request) {
      const requestObject = this.groups.find(({ value }) => value === request)
      if (requestObject) {
        return requestObject.text
      }
      return 'No tiene'
    },
    getTypeProductPrima (value) {
      if (value) {
        return value
        // return value.prima + '/' + value.comision + '/' + value.comision_final
      } else {
        return 'sin prima'
      }
    },
    getLeadStatus (state) {
      return state
        ? leadsStaticVars.detailedStates[state]
        : leadsStaticVars.detailedStates.sin_estado
    },
    GetUserStatusKam (value) {
      if (this.user.id == value.id || this.user.role !== 'KAM') {
        return value.first_name
      } else {
        return 'Otro ejecutivo'
      }
    },
    getLeadUser (user) {
      if (user) {
        const leadUser = this.users.find(({ id }) => user === id)
        return leadUser.first_name || leadUser.email.split('@')[0]
      }
      return 'Sin asignar'
    },
    getCompanyName (key) {
      return this.companies.reduce(
        (a, { text, value }) => ({ ...a, [value]: text }),
        {}
      )[key]
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
    onCloseModal () {
      this.addproduct = false
      this.editProducts = false
      this.modalreasigproduct = false
      this.modalreasigproduct2 = false
      this.modalreasigproductedit = false
    },
    editProduct () {
      this.Changecomissionreferred2(this.Requestedit.referred)
      this.ChangecomissionPartnership(this.Requestedit.campaign_slug)
      if (this.editProducts === false) {
        this.editProducts = true
      } else {
        this.editProducts = false
      }
    },
    InfoNewClient (value) {
      if (value === 'add') {
        this.modalreasigproduct = true
        this.infonewclientfull = true
      } else {
        this.asignclientexistnewequest = false
        this.Leads = {}
        this.infonewclientfull = false
      }
    },
    FormaterPerson (date) {
      if (process.env.version === 'CL') {
        if (date === 'legal_person') {
          return 'Persona legal'
        } else {
          return 'Persona natural'
        }
      }
      if (process.env.version === 'MX') {
        if (date === 'legal_person') {
          return 'Persona Moral'
        } else {
          return 'Persona Fisica'
        }
      }
    },
    BackRequest () {
      this.option = 'table'
      this.ProductExistente = false
      this.productdetails = []
      this.productnodetails = []
      this.Leads = {}
      this.mensajeloader = ''
    },
    capitalizeString (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    searchConfig (value) {
      this.leadsFilters.search = value
    },
    setRut (valid) {
      this.searchrut = valid
    }
  }
}
</script>
<style lang="scss">
.img-contain {
  margin-left: 2rem;
  width: 30px;
  object-fit: contain;
}
.w-1-3 {
  width: 33.33% !important;
}
.w-cli,
.w-bitW {
  width: 100%;
}
.w-idS,
.w-reA {
  width: 50%;
}
.w-opS {
  width: 50%;
}
.container {
  padding-right: 2px !important;
  padding-left: 2px !important;
}
.signup-form-Request {
  width: 100% !important;
}
.register-form {
  padding: 0px !important;
}
.signup-form-Client {
  margin-left: 0px !important;
}
.form-row .form-group-request {
  width: 100% !important;
}
.menu {
  padding: 1.2rem 0;

  button {
    background-color: transparent;
    font-family: Rubik;
    font-style: normal;
    font-weight: 500;
    font-size: 1.2rem;
    line-height: 19px;
    outline: 0px solid transparent;
    border: 0px solid transparent;
    color: rgba(211, 211, 211, 1);
    &.active {
      color: black;
      text-decoration: underline;
    }
  }

  /* identical to box height */
  //

  color: #000000;
}
.text-base {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #000000;
  margin-bottom: 10px;
}
.menu_request {
  padding-top: 0 !important;
  padding-bottom: 5px !important;
  width: 100%;
}
.menu_request button {
  background-color: transparent;
  font-family: Rubik;
  font-style: normal;
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 19px;
  outline: 0px solid transparent;
  border: 0px solid transparent;
  padding-bottom: 7px;
  color: #9e9e9e;
}
h2,
h3,
.dataCentral {
  width: 100%;
  margin-right: 1rem;
}
.contact_info h2 {
  font-size: 18px;
  padding-top: 15px;
  text-align: center;
  margin-bottom: 3px;
}
h2 {
  line-height: 1.66;
  margin: 0;
  padding: 0;
  font-weight: 500;
  color: #222;
  font-size: 24px;
  text-transform: uppercase;
  margin-bottom: 32px;
}
.request-title h2 {
  text-transform: none;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
}
.product-title h2 {
  text-transform: none;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 19px;
}
.request-title h4 {
  text-transform: none;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 28px;
}
.form-new {
  width: 98% !important;
}

@media (min-width: 768px) {
  h2,
  h3,
  .dataCentral {
    width: 75%;
    margin-right: 1rem;
  }
  p {
    margin: 0;
    padding: 0;
  }
  .main-container {
    width: 100%;
  }
  .menu_request {
    padding-top: 0 !important;
    padding-bottom: 5px !important;
    width: 100%;
  }
  .menu_request button {
    background-color: transparent;
    font-family: Rubik;
    font-style: normal;
    font-weight: 500;
    font-size: 1.2rem;
    line-height: 19px;
    outline: 0px solid transparent;
    border: 0px solid transparent;
    padding-bottom: 7px;
    color: #9e9e9e;
  }
  input:focus,
  textarea:focus {
    outline: none !important;
    border-color: transparent !important;
  }
  .main {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: auto;
    margin-top: 0px;
    flex-direction: row;
    flex: 1 1 0%;
    display: flex;
    align-items: flex-start;
    justify-items: start;
  }
  .row {
    width: 100%;
    margin: 0px auto;
    display: flex;
    color: #515365;
    margin-bottom: 20px;
    flex-direction: row;
  }
  .container-request {
    max-width: 100% !important;
    padding-right: 0;
    padding-left: 0;
  }
  .form-sections {
    width: 100%;
    padding: 0px 0px;
  }

  .form-edit {
    width: 70%;
    padding: 0px 0px;
  }

  .form-new {
    width: 95% !important;
    padding: 0px 0px;
  }

  .principal {
    width: 100%;
  }

  .contact_row {
    width: 70%;
    height: 100%;
    padding-left: 25px;
    padding-right: 25px;
  }
  .loadmorefeed {
    text-align: center;
    background-color: #ccd1e0;
    width: 50px;
    height: 50px;
    border-radius: 100%;
    color: #ff763a;
    line-height: 3;
  }
  /*select */
  .select-css {
    display: block;
    font-size: 14px;
    font-weight: 400;
    color: #9e9e9e;
    line-height: 17px;
    padding: 0.6em 1.7em 0.6em 1.7em;
    width: 400420px;
    max-width: 100%;
    box-sizing: border-box;
    margin: 20px auto;
    border: 0px solid #aaa;
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.03);
    border-radius: 25px;
    background-color: #f8f8f8;
    background-repeat: no-repeat, repeat;
    background-position: right 0.7em top 50%, 0 0;
    background-size: 0.65em auto, 100%;
  }
  .select-css::-ms-expand {
    display: none;
  }
  .select-css:hover {
    border-color: #888;
  }
  .select-css:focus {
    border-color: #aaa;
    color: #9e9e9e;
    outline: none;
  }
  .select-css option {
    font-weight: normal;
    border-radius: 25px;
    background-color: #f8f8f8;
  }
  .classOfElementToColor:hover {
    background-color: red;
    color: black;
  }
  .select-css option[selected] {
    background-color: orange;
  }
  .drop-ico {
    font-size: 18px;
  }
  .icon-color1 {
    color: #fcbf49;
  }
  .icon-color2 {
    color: #4cc9f0;
  }
  .icon-color3 {
    color: #f9c74f;
  }
  .icon-color4 {
    color: #ffd166;
  }
  .filters {
    display: flex;
    padding-left: 8px;
  }
  .filters_content {
    width: 95%;
    margin-bottom: 0px;
  }
  .filters_content li {
    height: 50px;
    display: inline-block;
    line-height: 2.5;
    font-size: 17px;
    line-height: 3.5;
    text-align: center;
    font-weight: 400;
    margin-right: 14px;
  }
  .shadow-dropdow {
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }
  .pointer {
    cursor: pointer;
  }
  .text-dropdown {
    font-family: Rubik;
    font-style: normal;
    line-height: 17px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #233348 !important;
    .icon {
      display: flex;
      &::after {
        align-self: center;
        justify-self: end;
        margin-left: 6px;
        content: "";
        width: 0.65em;
        height: 0.35em;
        background-color: #233348;
        clip-path: polygon(25% 0, 50% 50%, 75% 0%, 100% 0, 50% 100%, 0 0);
      }
      svg {
        height: 18px;
        min-width: 14px;
        margin-right: 5px;
        color: #233348;
      }
    }
  }
  .optionpost {
    height: 15px;
    letter-spacing: 1px;
    width: 100%;
    text-align: right;
  }
  .optionpost button {
    font-size: 15px;
  }
  .optionpost .icon {
    cursor: pointer;
    margin-right: 7px;
  }
  input[type="radio"],
  input[type="checkbox"] {
    color: #233348;
    height: 14px;
    background: #ffffff;
    border: 1px solid #e1e1e1;
    box-sizing: border-box;
    border-radius: 5px;
    width: 16px;
  }
  .loading-scroll {
    display: flex;
    align-items: center;
    width: 100%;
    justify-items: center;
  }
  .post-empty {
    display: flex;
    align-items: center;
    width: 100%;
    justify-items: center;
    height: 400px;
  }
  .spinner-container {
    display: flex;
    align-items: center;
    width: 100%;
    justify-items: center;
    flex-direction: column;
  }
  .spinner-container .spinner {
    color: #233348;
    margin-right: 1rem;
  }
  .spinner-container p {
    margin: 0;
    color: #233348;
    height: fit-content;
  }
  .spinner-container .empty {
    margin: 0;
    color: #233348;
    height: fit-content;
    font-size: 20px;
  }
  .formrequest {
    display: none;
    width: 33%;
    padding: 0px 0px;
    height: 100vh;
    position: fixed;
    right: 0px;
    top: 160px;
  }
  .border-radius-tags {
    height: auto;
    background: rgba(217, 217, 217, 0.1);
    border-radius: 16px;
  }
  .contact_info {
    width: 100%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
  }
  .contact_info h2 {
    font-size: 18px;
    padding-top: 15px;
    text-align: center;
    margin-bottom: 3px;
  }

  .more {
    font-size: 18px;
  }

  .table-wrap {
    overflow-x: scroll;
  }

  .table {
    width: 100%;
    -webkit-box-shadow: 0px 5px 12px -12px rgba(0, 0, 0, 0.29);
    -moz-box-shadow: 0px 5px 12px -12px rgba(0, 0, 0, 0.29);
    box-shadow: 0px 5px 12px -12px rgba(0, 0, 0, 0.29);
  }
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
  a:focus,
  a:active {
    text-decoration: none;
    outline: none;
    transition: all 300ms ease 0s;
    -moz-transition: all 300ms ease 0s;
    -webkit-transition: all 300ms ease 0s;
    -o-transition: all 300ms ease 0s;
    -ms-transition: all 300ms ease 0s;
  }
  input,
  select,
  textarea {
    outline: none;
    appearance: unset !important;
    -moz-appearance: unset !important;
    -webkit-appearance: unset !important;
    -o-appearance: unset !important;
    -ms-appearance: unset !important;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    appearance: none !important;
    -moz-appearance: none !important;
    -webkit-appearance: none !important;
    -o-appearance: none !important;
    -ms-appearance: none !important;
    margin: 0;
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    box-shadow: none !important;
    -moz-box-shadow: none !important;
    -webkit-box-shadow: none !important;
    -o-box-shadow: none !important;
    -ms-box-shadow: none !important;
  }

  input[type="checkbox"] {
    appearance: checkbox !important;
    -moz-appearance: checkbox !important;
    -webkit-appearance: checkbox !important;
    -o-appearance: checkbox !important;
    -ms-appearance: checkbox !important;
  }

  input[type="radio"] {
    appearance: radio !important;
    -moz-appearance: radio !important;
    -webkit-appearance: radio !important;
    -o-appearance: radio !important;
    -ms-appearance: radio !important;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  figure {
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield !important;
    appearance: none !important;
    -webkit-appearance: none !important;
  }

  input:-webkit-autofill {
    box-shadow: 0 0 0 30px transparent inset;
    -moz-box-shadow: 0 0 0 30px transparent inset;
    -webkit-box-shadow: 0 0 0 30px transparent inset;
    -o-box-shadow: 0 0 0 30px transparent inset;
    -ms-box-shadow: 0 0 0 30px transparent inset;
  }

  h2 {
    line-height: 1.66;
    margin: 0;
    padding: 0;
    font-weight: 500;
    color: #222;
    font-size: 24px;
    text-transform: uppercase;
    margin-bottom: 32px;
  }

  .clear {
    clear: both;
  }
  .container {
    width: 100%;
    position: relative;
    margin: 0 auto;
    background: #ffffff;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
    border-radius: 5px;
    max-width: none;
    padding-right: 25px !important;
    padding-left: 25px !important;
  }

  .signup-img,
  .signup-form {
    width: 100%;
  }

  .signup-form-Request {
    width: 30% !important;
    background: rgba(217, 217, 217, 0.1);
    border-radius: 16px;
  }
  .signup-form-Request h4 {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #000000;
  }

  .signup-form-Client {
    width: 100%;
    background: rgba(217, 217, 217, 0.1);
    border-radius: 16px;
    margin-left: 20px !important;
  }
  .signup-form-Client h4 {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: #000000;
  }
  .signup-img {
    margin-bottom: -7px;
  }

  .register-form {
    padding: 23px 20px 50px 20px !important;
  }

  .form-row {
    margin: 0 -15px;
  }
  .form-col {
    margin: 0 -15px;
    flex-direction: column;
  }
  .form-row .form-group {
    width: 50%;
    padding: 0 15px;
  }
  .form-row .form-group-request {
    width: 50% !important;
    padding: 12px 15px;
  }
  .form-col .form-group-request {
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 12px;
    padding-bottom: 12px;
  }

  .form-group {
    margin-bottom: 23px;
    position: relative;
  }

  .input_request,
  .select_request {
    display: block !important;
    height: 52px !important;
    color: #000 !important;
    width: 100% !important;
    border: 3px solid #ebebeb !important;
    padding: 11px 20px !important;
    box-sizing: border-box !important;
    font-weight: 500 !important;
    font-size: 16px !important;
  }
  textarea {
    display: block !important;
    height: 60% !important;
    color: #000 !important;
    width: 100% !important;
    border: 1px solid #505755;
    border-radius: 8px;
    padding: 11px 20px !important;
    box-sizing: border-box !important;
    font-weight: 400 !important;
    font-size: 14px !important;
    resize: none;
  }
  input:focus,
  textarea:focus,
  select:focus {
    border: 2px solid #22e6b4 !important;
  }

  .label_request {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 2px;
    display: block;
  }

  .label_enlace {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 2px;
    display: block;
    cursor: pointer;
  }
  .label_subenlace {
    margin-bottom: 2px;
    display: block;
    cursor: pointer;
    text-decoration: underline;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 17px;
    color: #000000;
  }

  .form-radio {
    margin-bottom: 18px;
  }
  .form-radio input {
    width: auto;
    display: inline-block;
  }

  .radio-label {
    padding-right: 72px;
  }

  .form-radio-item {
    position: relative;
    margin-right: 45px;
  }
  .form-radio-item label {
    font-weight: 500;
    font-size: 13px;
    padding-left: 25px;
    position: relative;
    z-index: 9;
    display: block;
    cursor: pointer;
  }

  .check {
    display: inline-block;
    position: absolute;
    border: 1px solid #ebebeb;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    -o-border-radius: 50%;
    -ms-border-radius: 50%;
    height: 13px;
    width: 13px;
    top: 4px;
    left: 0px;
    z-index: 5;
    transition: border 0.25s linear;
    -webkit-transition: border 0.25s linear;
  }
  .check:before {
    position: absolute;
    display: block;
    content: "";
    width: 9px;
    height: 9px;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    -o-border-radius: 50%;
    -ms-border-radius: 50%;
    top: 2px;
    left: 2px;
    margin: auto;
    transition: background 0.25s linear;
    -webkit-transition: background 0.25s linear;
  }

  input[type="radio"] {
    position: absolute;
    visibility: hidden;
  }
  input[type="radio"]:checked ~ .check {
    border: 1px solid #ff6801;
  }
  input[type="radio"]:checked ~ .check::before {
    background: #ff6801;
  }

  .form-select {
    position: relative;
  }

  .select-icon {
    z-index: 0;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    padding-right: 10px;
    justify-content: center;
    -moz-justify-content: center;
    -webkit-justify-content: center;
    -o-justify-content: center;
    -ms-justify-content: center;
    align-items: center;
    -moz-align-items: center;
    -webkit-align-items: center;
    -o-align-items: center;
    -ms-align-items: center;
  }
  .select-icon i {
    justify-content: center;
    -moz-justify-content: center;
    -webkit-justify-content: center;
    -o-justify-content: center;
    -ms-justify-content: center;
    align-items: center;
    -moz-align-items: center;
    -webkit-align-items: center;
    -o-align-items: center;
    -ms-align-items: center;
    width: 40px;
    height: 20px;
    font-size: 18px;
    color: #999;
  }

  .form-submit {
    text-align: right;
    padding-top: 27px;
  }

  .submit {
    width: 140px;
    height: 40px;
    display: inline-block;
    font-weight: 400;
    font-size: 13px;
    padding: 10px;
    border: none;
    cursor: pointer;
  }

  #reset {
    background: #f8f8f8;
    color: #999;
    margin-right: 8px;
  }
  #reset:hover {
    background: #ff6801;
    color: #fff;
  }

  #submit {
    background: #ff6801;
    color: #fff;
  }
  #submit:hover {
    background-color: #cd5300;
  }

  @media screen and (max-width: 992px) {
    .container {
      width: calc(100% - 40px);
      max-width: 100%;
    }

    .signup-content {
      flex-direction: column;
      -moz-flex-direction: column;
      -webkit-flex-direction: column;
      -o-flex-direction: column;
      -ms-flex-direction: column;
    }

    .signup-img,
    .signup-form {
      width: 100%;
    }
  }
  @media screen and (max-width: 768px) {
    .register-form {
      padding: 50px 40px 50px 40px;
    }
  }
  @media screen and (max-width: 575px) {
    .form-row {
      flex-direction: column;
      -moz-flex-direction: column;
      -webkit-flex-direction: column;
      -o-flex-direction: column;
      -ms-flex-direction: column;
      margin: 0px;
    }

    .form-row .form-group {
      width: 100%;
      padding: 0px;
    }

    .radio-label {
      padding-right: 22px;
    }

    .form-radio-item {
      margin-right: 25px;
    }
  }
  @media screen and (max-width: 480px) {
    .form-radio {
      flex-direction: column;
      -moz-flex-direction: column;
      -webkit-flex-direction: column;
      -o-flex-direction: column;
      -ms-flex-direction: column;
    }

    .submit {
      width: 100%;
    }

    #reset {
      margin-right: 0px;
      margin-bottom: 10px;
    }
  }

  /*# sourceMappingURL=style.css.map */
  display-flex,
  .signup-content,
  .form-row,
  .form-radio,
  .select-icon,
  .select-icon .icon {
    display: flex;
    display: -webkit-flex;
  }

  .contact_info {
    width: 100%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
  }
  .contact_info h2 {
    font-size: 18px;
    padding-top: 15px;
    text-align: center;
  }
  .contact_info p {
    font-size: 16px;
    padding-top: 2px;
    padding-left: 2px;
    padding-right: 2px;
    text-align: center;
  }
  .contact_info_title {
    padding: 10px 10px 10px 10px;
    width: 100%;
    letter-spacing: 1px;
    align-items: center;
    color: #515365;
  }
  .contact_info_title span {
    text-decoration: underline;
    cursor: pointer;
  }
  .contact_info_title h4 {
    font-size: 16px;
    padding-left: 17px;
  }
  .contact_info_detail {
    width: 100%;
    padding-left: 5px;
    padding-right: 5px;
  }
  .contact_info_detail th {
    padding-top: 20px;
  }
  /*::-webkit-scrollbar {
    display: none;
  }*/
  .toolbar {
    display: none;
    margin-bottom: 1.5em;
  }
  .newth {
    border-bottom: 3px solid rgba(203, 203, 203, 0.31) !important;
  }
  .vencida {
    background-color: #ffebeb !important;
  }
  .request-title {
    padding-left: 25px;
  }

  .form-col .form-input {
    border: 1px solid #505755;
    font-size: 14px;
    border-radius: 8px;
    height: 36px;
  }
  .form-row .form-input {
    border: 1px solid #505755;
    font-size: 14px;
    border-radius: 8px;
    height: 36px;
  }
  .form-input {
    border: 1px solid #505755;
    font-size: 14px;
    border-radius: 8px;
  }
  .text-base {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: #000000;
    margin-bottom: 10px;
  }
  .tableproduct {
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 17px;
    color: #000000;
  }
  .tableproduct span {
    padding-left: 20px;
    font-style: normal;
    font-weight: 500;
    font-size: 17px;
    line-height: 19px;
    color: #000000;
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
  .w-35 {
    width: 25%;
  }
  .w-65 {
    width: 70%;
  }
  .bg-fondo-option {
    background-color: #000000;
  }
  .menu {
    padding: 1.2rem 0;

    button {
      background-color: transparent;
      font-family: Rubik;
      font-style: normal;
      font-weight: 500;
      font-size: 1.2rem;
      line-height: 19px;
      outline: 0px solid transparent;
      border: 0px solid transparent;
      color: rgba(211, 211, 211, 1);
      &.active {
        color: black;
        text-decoration: underline;
      }
    }

    /* identical to box height */
    //

    color: #000000;
  }
  .card-detail {
    align-items: center;
    background: transparent;
  }
  .body-detail {
    width: 95%;
  }
  .div-style {
    padding: 10px;
    border-bottom: 1px solid #cbcbcb !important;
    margin-bottom: 30px !important;
  }
  .div-style2 {
    padding: 10px 0px 10px 0px;
    width: 50%;
    border-top: 2px solid #233348 !important;
  }
  .new {
    color: #6461ed !important;
  }
  .outer-circle-alta {
    background-color: rgba(230, 25, 82, 0.2);
    border-radius: 100%;
    height: 16px;
    width: 16px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .inner-circle-alta {
    background: #e61952;
    border-radius: 100%;
    height: 10px;
    width: 10px;
    top: 0;
    left: 0%;
  }
  .outer-circle-media {
    background-color: rgba(244, 152, 19, 0.2);
    border-radius: 100%;
    height: 16px;
    width: 16px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .inner-circle-media {
    background: #f49813;
    border-radius: 100%;
    height: 10px;
    width: 10px;
    top: 0;
    left: 0%;
  }
  .loader {
    right: 9px;
    top: 45px;
  }
  .loaderrequest2 {
    right: 0px;
    top: -14px;
    position: absolute;
  }
  @media (max-width: 1236px) {
    .loader {
      right: 9px;
      top: 45px;
    }
    .loaderrequest2 {
      right: 0px;
      top: -10px;
    }
  }
  @media (max-width: 1080px) {
    .loader {
      right: 9px;
      top: 45px;
    }
    .loaderrequest2 {
      right: 0px;
      top: -10px;
    }
  }
  @media (max-width: 960px) {
    .loader {
      right: 9px;
      top: 45px;
    }
    .loaderrequest2 {
      right: 0px;
      top: -10px;
    }
  }
  @media (max-width: 904px) {
    .loader {
      right: 9px;
      top: 45px;
    }
    .loaderrequest2 {
      right: 0px;
      top: -10px;
    }
  }
  @media (max-width: 904px) {
    .loader {
      right: 9px;
      top: 45px;
    }
    .loaderrequest2 {
      right: 0px;
      top: -10px;
    }
  }
  @media (max-width: 768px) {
    .loader {
      right: 9px;
      top: 45px;
    }
    .loaderrequest2 {
      right: 0px;
      top: -10px;
    }
  }
  .w-16-request {
    width: 65px;
  }
  .relative {
    position: relative;
  }
  .mensajerut {
    color: #6461ed;
  }
  .mensajerutfalse {
    color: red;
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
  .rowClassrequest {
    background-color: transparent !important;
  }
  .rowClassrequest2 tr {
    background-color: transparent !important;
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
  .mtrow {
    margin-top: 0.7rem !important;
  }
  .title-text {
    font-weight: 500;
    font-size: 26px;
    line-height: 28px;
  }
  .imgicon {
    width: 21px;
    max-width: none;
  }
  .results span {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 14px;
    color: #233348;
  }
  .b-form-tag {
    font-size: 16px !important;
  }
  .form-control {
    border: 1px solid #505755 !important;
    border-radius: 8px !important;
  }
  .starcolor {
    color: #d4af37;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .w-idS {
    width: 25%;
  }
  .w-opS {
    width: 70%;
  }
  .w-cli {
    width: 75%;
  }
  .w-bitW {
    width: 50%;
  }
  .completo,
  .w-reA {
    width: 100%;
  }
  .request-title h2 {
    text-transform: none;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 28px;
  }
  .request-title h4 {
    text-transform: none;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 28px;
  }
  .product-title h2 {
    text-transform: none;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 19px;
  }
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
      background-color: #ffa500;
    }
    &.sin-estado {
      background-color: #d3d3d3;
      color: black;
    }
    &.abandono {
      background-color: #ff6347;
    }
    &.perdido {
      background-color: #ff4500;
    }
    &.resuelto {
      background-color: #9dd345;
    }
    &.error_de_pago {
      background-color: #dc143c;
    }
    &.confirmacion {
      background-color: #32cd32;
    }
    &.cerrado {
      background-color: var(--primary);
    }
    &.licitacion {
      background-color: #1e90ff;
    }
    &.llamar {
      background-color: #ffd700;
    }
    &.dg_contactado {
      background-color: #4682b4;
    }
    &.sin_contactar {
      background-color: #6a5acd;
    }
  }
}
.asegurados-adicionales {
  border: 1px solid #505755;
  border-radius: 10px;
  margin-bottom: 20px !important;
}
</style>
