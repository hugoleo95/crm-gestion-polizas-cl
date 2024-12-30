<template>
  <b-modal
    id="lead-modal"
    ref="leadModal"
    v-model="localShow"
    modal-class="draggable-modal"
    size="lg"
    :title="title"
    body-class="padding-modal"
    scrollable
    @hidden="$emit('hidde')"
  >
    <template #modal-header="{ }">
      <div
        class="max-size"
        @mousedown="dragModal"
      >
        <h5>
          <fa-icon
            :icon="['fas', 'edit']"
            class="text-primary mr-2"
          /><b>{{ title }}/</b> {{ localLead.razon_social || 'Simplee' }}
        </h5>
        <p>Manten presionado para arrastrar el modal</p>
      </div>
    </template>
    <template #modal-footer="{ }">
      <!-- <b-button
        class="text-white py-2 px-3 mr-2"
        size="sm"
        variant="danger"
        @click="saveLead()"
      >
        Eliminar lead
      </b-button> -->
      <!--<b-button
        v-if="onbutton"
        class="text-white py-2 px-3 mr-2"
        size="sm"
        variant="primary"
        @click="saveLead()"
      >
        Guardar y continuar
      </b-button>
      -->
      <b-button
        v-if="onbutton"
        class="text-white p-2 px-3"
        size="sm"
        variant="secondary"
        @click="cancelLead()"
      >
        Cerrar
      </b-button>
    </template>
    <div class="d-flex  justify-content-between align-items-center">
      <div class="menu d-flex">
        <button
          :class="[{active:option === 'general'}, 'mr-3']"
          style="font-size: 1.15rem"
          @click="option = 'general'"
        >
          Datos generales
        </button>
        <!-- <button
          :class="[{active:option === 'products'}, 'mr-3']"
          style="font-size: 1.15rem"
          @click="option = 'products'"
        >
          Productos
        </button>
        <button
          :class="[{active:option === 'documents'}, 'mr-3']"
          style="font-size: 1.15rem"
          @click="option = 'documents'"
        >
          Documentos
        </button>
        <button
          :class="[{active:option === 'diagnostic'}, 'mr-3']"
          style="font-size: 1.15rem"
          @click="option = 'diagnostic'"
        >
          Diagnostico
        </button>
        -->
      </div>
      <button
        v-if="option !== 'general'"
        class="add"
        @click="newItem"
      >
        <fa-icon
          class=""
          :icon="['fas', 'plus']"
        />
      </button>
    </div>
    <div
      v-if="loadingSection"
      class="d-flex align-items-center justify-content-center p-4"
    >
      <b-spinner
        variant="primary"
        label="Loading..."
      />
    </div>
    <div v-else>
      <div v-if="option=== 'general'">
        <s-form-table>
          <tr>
            <th>{{ Names.rut }} <span class="mandatory">*</span></th>
            <td>
              <b-form-input
                id="rut"
                v-model="localLead.rut"
                type="text"
                placeholder="10123123-5"
              />
            </td>
          </tr>
          <tr>
            <th>Leads duplicados</th>
            <td>
              <b-form-select
                v-model="selectedDuplicate"
                :disabled="duplicatedRutLeads.length === 0"
              >
                <template #first>
                  <b-form-select-option
                    :value="null"
                    disabled
                  >
                    Seleccione un lead para visualizarlo
                  </b-form-select-option>
                </template>
                <b-form-select-option
                  v-for="{Value, text} in duplicatedRutLeads"
                  :key="Value"
                  :value="Value"
                >
                  {{ text }}
                </b-form-select-option>
              </b-form-select>
            </td>
          </tr>
          <tr>
            <th>Nombre <span class="mandatory">*</span></th>
            <td>
              <b-form-input
                id="name"
                v-model="localLead.name"
                label="Nombre"
                type="text"
                placeholder="Juan"
              />
            </td>
          </tr>
          <tr>
            <th>Apellido <span class="mandatory">*</span></th>
            <td>
              <b-form-input
                id="last_name"
                v-model="localLead.last_name"
                label="Apellido"
                type="text"
                placeholder="Perez"
              />
            </td>
          </tr>
          <tr>
            <th>Email <span class="mandatory">*</span></th>
            <td>
              <b-form-input
                id="email"
                v-model="localLead.email"
                label="Email"
                type="email"
                placeholder="cliente@suemail.cl"
              />
            </td>
          </tr>
          <tr>
            <th>Télefono <span class="mandatory">*</span></th>
            <td>
              <b-form-input
                id="phone"
                v-model="localLead.phone"
                label="Telefono"
                type="text"
                placeholder="+56988887777"
              />
            </td>
          </tr>
          <tr>
            <th>Persona <span class="mandatory">*</span></th>
            <td>
              <b-form-select
                id="optionsPerson"
                v-model="localLead.person"
                placeholder="Selecciona un tipo de persona"
                :options="optionsPerson"
              />
            </td>
          </tr>
          <tr v-if="localLead.person === 'legal_person'">
            <th>Razón social <span class="mandatory">*</span></th>
            <td>
              <b-form-input
                id="company"
                v-model="localLead.razon_social"
                type="text"
                placeholder="Empresa SpA"
              />
            </td>
          </tr>
          <tr v-if="localLead.person === 'legal_person'">
            <th>Giro <span class="mandatory">*</span></th>
            <td>
              <b-form-input
                id="giro"
                v-model="localLead.giro"
                label="Giro"
                type="text"
                placeholder="Desarrollo de software"
              />
            </td>
          </tr>
          <tr>
            <th>Dirección <span class="mandatory">*</span></th>
            <td>
              <b-form-input
                id="address"
                v-model="localLead.address"
                label="Dirección"
                type="text"
                placeholder="Nueva providencia 1363"
              />
            </td>
          </tr>
          <tr>
            <th>{{ Names.comuna }} <span class="mandatory">*</span></th>
            <td>
              <b-form-input
                id="comuna"
                v-model="localLead.comuna"
                label="Comuna"
                type="text"
                placeholder="Providencia"
              />
            </td>
          </tr>
          <tr>
            <th>Estado <span class="mandatory">*</span></th>
            <td>
              <b-form-select
                id="state"
                v-model="localLead.state"
                placeholder="Selecciona un estado"
                :options="states"
              />
            </td>
          </tr>
          <tr v-if="version === 'mx' && localLead.state === 'perdido'">
            <th>Motivo Perdida</th>
            <td>
              <b-form-select v-model="localLead.lost_reason">
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
                <b-form-select-option value="no envio información">
                  No envió información
                </b-form-select-option>
                <b-form-select-option value="otro">
                  Otro
                </b-form-select-option>
              </b-form-select>
            </td>
          </tr>
          <tr v-if="version === 'mx' && localLead.state === 'cliente_no_aplica'">
            <th>Motivo no aplica</th>
            <td>
              <b-form-select v-model="localLead.lost_reason">
                <template #first>
                  <b-form-select-option
                    :value="null"
                    disabled
                  >
                    Seleccione el motivo de porque no aplica
                  </b-form-select-option>
                </template>
                <b-form-select-option value="No buscaba un seguro">
                  No buscaba un seguro
                </b-form-select-option>
                <b-form-select-option value="No aplica para el país de origen">
                  No aplica para el país de origen
                </b-form-select-option>
                <b-form-select-option value="Ofrecía alianza comercial">
                  Ofrecía alianza comercial
                </b-form-select-option>
                <b-form-select-option value="No existe cobertura en el mercado">
                  No existe cobertura en el mercado
                </b-form-select-option>
                <b-form-select-option value="Otro">
                  Otro
                </b-form-select-option>
              </b-form-select>
            </td>
          </tr>
          <tr v-if="version === 'mx' && localLead.state === 'perdido' | localLead.state === 'cliente_no_aplica' && localLead.lost_reason === 'Otro'">
            <th>Otro motivo</th>
            <td>
              <b-form-input
                id="otro"
                v-model="localLead.lost_reason_description"
                label="otro"
                type="text"
                placeholder="Especifique el otro motivo de perdida"
              />
            </td>
          </tr>
          <tr v-if="version === 'mx'">
            <th>Recepción cotización</th>
            <td>
              <b-form-input
                id="recepcion"
                v-model="localLead.quotation_received"
                label="recepcion"
                type="date"
                placeholder="recepcion"
              />
            </td>
          </tr>
          <tr v-if="version === 'mx'">
            <th>Entrega de cotización</th>
            <td>
              <b-form-input
                id="entrega"
                v-model="localLead.quotation_delivered"
                label="entrega"
                type="date"
                placeholder="entrega"
              />
            </td>
          </tr>
          <tr v-if="localLead.state === 'en_espera_de_confirmacion'">
            <th>Comisión proyectada <span class="mandatory">*</span></th>
            <td>
              <b-form-input
                id="comision_proyectada"
                v-model="localLead.projected_quote"
                label="comision_proyectada"
                type="number"
                placeholder="Comisión"
              />
            </td>
          </tr>
          <tr>
            <th>Ejecutivo a cargo <span class="mandatory">*</span></th>
            <td>
              <b-form-select
                id="executive"
                v-model="localLead.user"
                :options="executives"
                placeholder="Selecciona quien está a cargo de este cliente"
              />
            </td>
          </tr>
          <tr>
            <th>Canal <span class="mandatory">*</span></th>
            <td>
              <b-form-select
                id="channel"
                :value="localLead.channel"
                placeholder="Selecciona un estado"
                :options="channels"
                @input="setChannel"
              />
            </td>
          </tr>
          <tr v-if="localLead.channel === 62 || localLead.channel === 66">
            <th>Motivo Contacto</th>
            <td>
              <b-form-select
                id="reasons"
                :value="localLead.contact_reason"
                placeholder="Selecciona un motivo"
                :options="reason_contact"
                @input="setReasonContact"
              />
            </td>
          </tr>
          <tr v-if="localLead.channel === channelreferido">

            <th>Referido <span class="mandatory">*</span></th>
            <td>
              <b-form-select
                v-model="localLead.referred"
                placeholder="Selecciona un referido"
                :options="refferals"
              />
            </td>
          </tr>
          <tr v-if="localLead.referral_code">
            <th>Código Referido</th>
            <td>
              <b-form-select
                v-model="localLead.referral_code"
                placeholder="Selecciona la prioridad"
                :options="optionsPriority"
              />
            </td>
          </tr>
          <tr>
            <th>Prioridad</th>
            <td>
              <b-form-select
                v-model="localLead.priority"
                placeholder="Selecciona la prioridad"
                :options="optionsPriority"
              />
            </td>
          </tr>
          <tr v-if="version === 'mx'">
            <th>Código Referido</th>
            <td>
              <b-form-input
                id="cod_referido"
                v-model="localLead.referral_code"
                label="código referido"
                type="text"
                placeholder="ingrese"
              />
            </td>
          </tr>

          <tr>
            <th>Intereses</th>
            <td>
              <!-- Prop `add-on-change` is needed to enable adding tags vie the `change` event -->
              <b-form-tags
                id="tags-component-select"
                v-model="localLead.product_interest"
                size="md"
                add-on-change
                tag-variant="primary"
                no-outer-focus
              >
                <template #default="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
                  <ul
                    v-if="tags.length > 0"
                    class="list-inline d-inline-block mb-2"
                  >
                    <li
                      v-for="tag in tags"
                      :key="tag"
                      class="list-inline-item"
                    >
                      <b-form-tag
                        :title="tag"
                        :disabled="disabled"
                        class="text-white"
                        variant="primary"
                        @remove="removeTag(tag)"
                      >
                        {{ getTag(tag) }}
                      </b-form-tag>
                    </li>
                  </ul>
                  <b-form-select
                    v-bind="inputAttrs"
                    :disabled="disabled || availableOptions.length === 0"
                    :options="availableOptions"
                    v-on="inputHandlers"
                  >
                    <template #first>
                      <!-- This is required to prevent bugs with Safari -->
                      <option
                        disabled
                        value=""
                      >
                        Seleccione un producto
                      </option>
                    </template>
                  </b-form-select>
                </template>
              </b-form-tags>
            </td>
          </tr>
          <tr>
            <th>Comentario</th>
            <td>
              <b-form-textarea
                v-model="localLead.comment"
                placeholder=""
                rows="2"
                max-rows="10"
              />
            </td>
          </tr>
        </s-form-table>
        <h4
          v-if="localLead.contacts && localLead.contacts.length > 0"
          class="my-4"
        >
          Contactos
        </h4>
        <s-form-table v-if="localLead.contacts && localLead.contacts.length > 0">
          <tr
            v-for="({id,message,created_at}) in localLead.contacts"
            :key="id"
          >
            <th>{{ new Date(created_at).toLocaleDateString('es-ES') }}</th>
            <td>
              {{ message }}
            </td>
          </tr>
        </s-form-table>
      </div>
      <div
        v-if="option === 'products'"
        class="products"
      >
        <div
          v-for="(product,key) in localLead.products"
          v-show="(pag_product - 1) * NUM_RESULTS_PRODUCTS <= key && pag_product * NUM_RESULTS_PRODUCTS > key"
          :key="key"
        >
          <b-button
            v-b-toggle="`product-${key}`"
            :variant="`${productsWithError.includes(key) ? 'outline-danger' : 'outline-secondary'}`"
            block
            class="mb-3"
          >
            {{ product.name }} {{ product.nro_poliza }}-{{ product.company }}
          </b-button>
          <b-collapse
            :id="`product-${key}`"
            visible
            accordion="my-accordion"
            role="tabpanel"
          >
            <product-form
              v-model="localLead.products[key]"
              show-link
              :commission="commission"
              :state="localLead.state"
              page="default"
              :has-errors="productsWithError.includes(key)"
              @errorsResolved="removeProductFromErrors(key)"
              @delete="deleteProduct(key)"
            />
            <!-- :has-error="localLead.inputsErrors.length > 0" -->
          </b-collapse>
        </div>
        <div
          v-if="localLead.products.length > 0"
          class="text-center"
        >
          <b-button
            v-show="pag_product != 1"
            variant="primary"
            aria-label="Previous"
            class="py-1 px-1"
            @click.prevent="pag_product -= 1"
          >
            <span aria-hidden="true">
              <fa-icon
                :icon="['fas', 'arrow-left']"
                class="text-white"
              />
            </span>
          </b-button>
          <strong class="text-secondary">&nbsp;&nbsp;{{ CountPageProduct }} / {{ localLead.products.length }} Productos&nbsp;&nbsp;</strong>
          <b-button
            v-show="pag_product * NUM_RESULTS_PRODUCTS / localLead.products.length < 1"
            variant="primary"
            aria-label="Next"
            class="py-1 px-1"
            @click.prevent="pag_product += 1"
          >
            <span aria-hidden="true">
              <fa-icon
                :icon="['fas', 'arrow-right']"
                class="text-white"
              />
            </span>
          </b-button>
        </div>
        <div class="text-center">
          <InputMassive
            type="product"
            title="Arrastre el archivo excel para la carga masiva de productos"
            :urldocument="urldocument"
            @push-register="addProduct"
          />
        </div>
      </div>
      <div
        v-if="option=== 'documents'"
        class="documents"
      >
        <div
          v-for="(_document,key) in localLead.documents"
          v-show="(pag_document - 1) * NUM_RESULTS_DOCUMENT <= key && pag_document * NUM_RESULTS_DOCUMENT > key"
          :key="key"
        >
          <b-button
            v-b-toggle="`document-${key}`"
            variant="outline-secondary"
            block
            class="mb-3"
          >
            {{ localLead.documents[key].title || '-' }}
          </b-button>
          <b-collapse
            :id="`document-${key}`"
            visible
            accordion="my-accordion"
            role="tabpanel"
          >
            <s-form-table>
              <tr>
                <th>Documento</th>
                <td>
                  <a
                    v-if="localLead.documents[key].document_url"
                    target="_blank"
                    :href="localLead.documents[key].document_url"
                    class="doc-title"
                  >{{ localLead.documents[key].title }}</a>
                  <a
                    v-else-if="localLead.documents[key].document"
                    target="_blank"
                    :href="localLead.documents[key].document"
                    class="doc-title"
                  >{{ localLead.documents[key].title }}</a>
                  <b-form-file
                    v-else
                    :state="Boolean(localLead.documents[key].document)"
                    :placeholder="localLead.documents[key].title || 'Suba un archivo'"
                    drop-placeholder="Arrastre un archivo hasta aquí..."
                    @input="setDocumentFile({key,file:$event})"
                  />
                </td>
              </tr>
              <tr v-if="optionsDocuments.length > 0">
                <th>Producto</th>
                <td>
                  <b-form-select
                    v-model="localLead.documents[key].product"
                    :options="optionsDocuments"
                  />
                </td>
              </tr>
              <tr>
                <th>Eliminar</th>
                <td
                  co
                  lspan="2"
                >
                  <b-button
                    block
                    @click="deleteDocument(key)"
                  >
                    Eliminar este documento
                  </b-button>
                </td>
              </tr>
            </s-form-table>
          </b-collapse>
        </div>
        <div
          v-if="localLead.documents && localLead.documents.length > 0"
          class="text-center"
        >
          <b-button
            v-show="pag_document != 1"
            variant="primary"
            aria-label="Previous"
            class="py-1 px-1"
            @click.prevent="pag_document -= 1"
          >
            <span aria-hidden="true">
              <fa-icon
                :icon="['fas', 'arrow-left']"
                class="text-white"
              />
            </span>
          </b-button>
          <strong class="text-secondary">&nbsp;&nbsp;{{ CountPageDocument }} - {{ localLead.documents.length }} Documentos&nbsp;&nbsp;</strong>
          <b-button
            v-show="pag_document * NUM_RESULTS_DOCUMENT / localLead.documents.length < 1"
            variant="primary"
            aria-label="Next"
            class="py-1 px-1"
            @click.prevent="pag_document += 1"
          >
            <span aria-hidden="true">
              <fa-icon
                :icon="['fas', 'arrow-right']"
                class="text-white"
              />
            </span>
          </b-button>
        </div>
        <div class="text-center">
          <InputMassive
            type="document"
            title="Arrastre varios documentos a la vez para la carga masiva"
            @addDocument="setDocumentFile({file: $event})"
          />
        </div>
      </div>
      <div
        v-if="option=== 'diagnostic'"
        class="diagnostic"
      >
        <div
          v-for="(diagnostic,key) in localLead.diagnostics"
          :key="key"
        >
          <b-button
            v-b-toggle="`diagnostic-${key}`"
            variant="outline-secondary"
            block
            class="mb-3"
          >
            Diagnostico {{ key +1 }}
          </b-button>
          <b-collapse
            :id="`diagnostic-${key}`"
            visible
            accordion="my-accordion"
            role="tabpanel"
          >
            <diagnostic-form
              v-model="localLead.diagnostics[key]"
              @delete="deleteDiagnostic(key)"
              @saveDocument="getDoc"
            />
          </b-collapse>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import ProductForm from '@/components/ProductForm.vue'
import InputMassive from '@/components/InputMassiveProducts'
import SFormTable from '@/components/base/SFormTable.vue'
import _ from 'lodash'
import DiagnosticForm from './DiagnosticForm.vue'
import states from '~/static/states.json'
import products from '~/static/products.json'
import productsmx from '~/static/productsmx.json'
import ReasonContact from '~/static/reason_contact.json'

export default {
  components: {
    ProductForm,
    InputMassive,
    SFormTable,
    DiagnosticForm
  },
  props: {
    show: {
      type: Boolean,
      default: true
    },
    value: {
      type: Object,
      default: () => ({
        documents: [{ document: null }],
        products: [{}],
        diagnostics: [{}]
      })
    },
    title: {
      type: String,
      default: 'Crear'
    }
  },
  data () {
    return {
      clonedLead: null,
      onbutton: true,
      states: states.filter(({ value }) => value !== 'sin_estado'),
      option: 'general',
      commission: 0,
      urldocument: '',
      channelreferido: '',
      productsWithError: [],
      version: '',
      NamesCL: {
        rut: 'Rut',
        comuna: 'Comuna'
      },
      NamesMX: {
        rut: 'Rfc',
        comuna: 'Colonia'
      },
      Names: '',
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
      optionsPriority: [
        { value: null, text: 'Sin prioridad' },
        { value: 'baja', text: 'Baja' },
        { value: 'media', text: 'Media' },
        { value: 'alta', text: 'Alta' }

      ],
      duplicatedRutLeads: [],
      NUM_RESULTS_PRODUCTS: 5,
      pag_product: 1,
      NUM_RESULTS_DOCUMENT: 5,
      pag_document: 1,
      selectedDuplicate: null,
      loadingDocument: false,
      loadingSection: false,
      productsLoaded: false,
      documentsLoaded: false,
      products: Object.values(products).reduce((acc, curr) => [...acc, ...curr], []),
      productsmx: Object.values(productsmx).reduce((acc, curr) => [...acc, ...curr], []),
      reason_contact: ReasonContact
    }
  },
  computed: {
    channels () {
      return this.$store.state.leads.channels.map(({ id, name }) => ({ value: id, text: name }))
    },
    executives () {
      return this.$store.state.leads.users.map(({ id, email }) => ({
        value: id,
        text: email
      }))
    },
    CountPageProduct () {
      if (this.localLead.products?.length > this.NUM_RESULTS_PRODUCTS * this.pag_product) {
        return this.pag_product * this.NUM_RESULTS_PRODUCTS
      }
      return this.localLead.products?.length || 0
    },
    CountPageDocument () {
      if (this.localLead.documents?.length > this.NUM_RESULTS_DOCUMENT * this.pag_document) {
        return this.pag_document * this.NUM_RESULTS_DOCUMENT
      }
      return this.localLead.documents?.length ?? 0
    },
    refferals () {
      return this.$store.state.leads.refferals.map(({ id, name, comision }) => ({
        value: id,
        text: name,
        commission: comision
      }))
    },
    localLead: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    localShow: {
      get () {
        return this.show
      },
      set (value) {
        this.$emit('update:show', value)
      }

    },
    availableOptions () {
      if (process.env.version === 'CL') {
        const { products } = this
        if (typeof this.localLead.product_interest === 'undefined') {
          return products
        } else {
          return products.filter(({ value }) => !this.localLead.product_interest.includes(value))
        }
      } else {
        const { productsmx } = this
        if (typeof this.localLead.product_interest === 'undefined') {
          return productsmx
        } else {
          return productsmx.filter(({ value }) => !this.localLead.product_interest.includes(value))
        }
      }
    },
    optionsDocuments () {
      return this.localLead.products
        ? this.localLead.products.filter(product => product.id).map((product) => {
          return {
            value: product.id,
            text: `${product.name || ''} ${product.nro_poliza || ''} ${product.company || ''}`
          }
        })
        : []
    }
  },
  watch: {
    'localLead.channel': {
      immediate: true,
      handler (value) {
        const channelReffered = this.channels.find(({ text }) => text === 'Referido')

        if (value !== channelReffered?.value) {
          this.localLead.referred = null
        }
      }
    },
    'localLead.referred': {
      immediate: true,
      handler (value) {
        if (value) {
          const [referred] = this.refferals.filter(({ value }) => value === this.localLead.referred)
          this.commission = referred.commission
        } else {
          this.commission = 0
        }
      }
    },
    'localLead.products': {
      handler (value) {
        this.localLead.documents?.forEach((doc, i) => {
          const exists = value.find(prod => prod.id === doc.product)
          if (!exists) { this.localLead.documents[i].product = null }
        })
      }
    },
    'localLead.rut': {
      handler () {
        this.getLeadsWithSameRut()
      }
    },
    'localLead.state': {
      handler (val) {
        if (val !== 'cliente_cerrado') {
          this.productsWithError = []
        }
      }
    },
    selectedDuplicate (id) {
      if (id) {
        this.$router.push({ path: '/leads', query: { id } })
      }
    },
    option (val) {
      if (val === 'products' && !this.productsLoaded) {
        this.getLeadProducts()
      }
      if (val === 'documents' && !this.documentsLoaded) {
        this.getLeadDocuments()
      }
    }
  },
  created () {
    this.duplicatedRutLeads = this.formatDuplicates(this.localLead.duplicates)
    if (process.env.version === 'CL') {
      this.version = 'cl'
      this.channelreferido = 6
      this.Names = this.NamesCL
      this.optionsPerson = this.optionsPersonCL
      this.urldocument = '/formatoproductosimplee.xlsx'
    } else {
      this.version = 'mx'
      this.channelreferido = 24
      this.Names = this.NamesMX
      this.optionsPerson = this.optionsPersonMX
      this.urldocument = '/formatoproductosimpleemx.xlsx'
    }
  },
  methods: {
    dragModal (e) {
      const modal = document.querySelector('.draggable-modal')
      const position = modal.getBoundingClientRect()

      window.addEventListener('mousemove', mouseMove)
      window.addEventListener('mouseup', mouseUp)

      const prevX = e.clientX
      const prevY = e.clientY
      function mouseMove (e) {
        document.querySelector('.max-size').style.cursor = 'grabbing'
        const newX = prevX - e.clientX
        const newY = prevY - e.clientY
        modal.style.left = position.left - newX + 'px'
        modal.style.top = position.top - newY + 'px'
      }
      function mouseUp (e) {
        document.querySelector('.max-size').style.cursor = 'grab'
        window.removeEventListener('mousemove', mouseMove)
        window.removeEventListener('mouseup', mouseUp)
      }
    },
    async getLeadProducts () {
      if (this.localLead.id) {
        this.loadingSection = true
        try {
          const products = await this.$simpleeApi.get(`/lead/${this.value.id}/product/`)
          this.localLead = {
            ...this.localLead,
            products: products.data.results
          }
          this.productsLoaded = true
        } catch (error) {
          this.$store.commit('setAlertMessage', error.response.data)
          this.product = 'general'
        }
        this.loadingSection = false
      } else {
        this.localLead = {
          ...this.localLead,
          products: this.localLead.products ?? []
        }
      }
    },
    async getLeadDocuments () {
      if (this.localLead.id) {
        this.loadingSection = true
        try {
          const documents = await this.$simpleeApi.get(`/lead/${this.value.id}/document/`)
          this.localLead = {
            ...this.localLead,
            documents: documents.data.results
          }
          if (!this.localLead.products) {
            await this.getLeadProducts()
          }
          this.documentsLoaded = true
        } catch (error) {
          this.$store.commit('setAlertMessage', error.response.data)
          this.product = 'general'
        }
        this.loadingSection = false
      } else {
        this.localLead = {
          ...this.localLead,
          documents: this.localLead.documents ?? []
        }
      }
    },
    getDoc ($event) {
      this.$emit('save-document-only', $event)
    },
    deleteProduct (key) {
      this.localLead.products = this.localLead.products?.filter((_, index) => index !== key)
    },
    deleteDocument (key) {
      this.localLead.documents = this.localLead.documents.filter((_, index) => index !== key)
    },
    deleteDiagnostic (key) {
      this.localLead.diagnostics = this.localLead.diagnostics.filter((_, index) => index !== key)
    },
    addProduct (register) {
      if (register) {
        this.localLead.products?.push({ ...register })
      } else {
        this.localLead.products?.push({ line: null, name: 'Nuevo Producto', company: null })
      }
    },
    addDocument (document = {}) {
      this.localLead.documents.push(document)
    },
    addDiagnostic () {
      this.localLead.diagnostics.push({ insurances_contrated: [] })
    },
    saveLead () {
      this.onbutton = false
      if (!this.localLead.channel) {
        this.$store.commit('setAlertMessage', { error: 'Debes agregar el canal' })
        this.onbutton = true
        return
      }
      if (!this.localLead.quotation_delivered) {
        this.localLead.quotation_delivered = null
      }
      if (!this.localLead.quotation_received) {
        this.localLead.quotation_received = null
      }
      if (this.localLead.state === 'cliente_cerrado') {
        if (
          !this.localLead.name ||
          !this.localLead.last_name ||
          !this.localLead.email ||
          !this.localLead.phone ||
          !this.localLead.address ||
          !this.localLead.comuna ||
          !this.localLead.rut ||
          !this.localLead.user
        ) {
          this.$store.commit('setAlertMessage', { error: 'Todos los campos que contienen un * son obligatorios' })
          this.onbutton = true
          return
        }
        if (process.env.version === 'CL') {
          const indexOfDash = this.localLead.rut.indexOf('-')
          if (indexOfDash === -1) {
            this.$store.commit('setAlertMessage', { error: 'Formato de rut invalido' })
            this.onbutton = true
            return
          }
          const rutNumbers = this.localLead.rut.slice(0, indexOfDash)
          if (this.localLead.person === 'legal_person') {
            if (!this.localLead.giro || !this.localLead.razon_social) {
              this.$store.commit('setAlertMessage', { error: 'Todos los campos que contienen un * son obligatorios' })
              this.onbutton = true
              return
            }
            if (rutNumbers <= 50000000 || rutNumbers > 999999999) {
              this.$store.commit('setAlertMessage', { error: 'Rut juridico no valido, por favor ingrese un rut de entre 50,000,001 a 99,999,999' })
              this.onbutton = true
              return
            }
          }
          if (this.localLead.person === 'natural_person') {
            if (rutNumbers > 50000000) {
              this.$store.commit('setAlertMessage', { error: 'Rut natural no valido, por favor ingrese un rut de entre 1 a 50,000,000' })
              this.onbutton = true
              return
            }
          }
        } else if (process.env.version === 'MX') {
          if (this.localLead.person === 'legal_person') {
            if (!this.localLead.giro || !this.localLead.razon_social) {
              this.$store.commit('setAlertMessage', { error: 'Todos los campos que contienen un * son obligatorios' })
              this.onbutton = true
              return
            }
          }
        }
        if (this.localLead.channel === this.channelreferido && !this.localLead.referred) {
          this.$store.commit('setAlertMessage', { error: 'Todos los campos que contienen un * son obligatorios' })
          this.onbutton = true
          return
        }
        if (this.localLead.products?.length === 0 ?? true) {
          this.$store.commit('setAlertMessage', { error: 'Debes agregar al menos un producto' })
          this.onbutton = true
          return
        }
        for (let i = 0; i < this.localLead.products?.length ?? 0; i++) {
          const Ini = new Date(this.localLead.products[i].fecha_inicio_vigencia)
          const Fin = new Date(this.localLead.products[i].fecha_termino_vigencia)
          const isValidDate = Date.parse(this.localLead.products[i].fecha_termino_vigencia)
          if (Ini > Fin) {
            this.setProductsErrors()
            this.$store.commit('setAlertMessage', { error: 'La fecha Término de la vigencia no puede ser menor a Inicio de vigencia' })
            this.onbutton = true
            return
          } else if (isNaN(isValidDate)) {
            this.setProductsErrors()
            this.$store.commit('setAlertMessage', { error: 'Fecha no valida' })
            this.onbutton = true
            return
          }
          if (!this.localLead.products[i].prima) {
            this.localLead.products[i].prima = 0
          }
          if (
            !this.localLead.products[i].comision ||
            !this.localLead.products[i].comision_final ||
            !this.localLead.products[i].company ||
            !this.localLead.products[i].emited_date ||
            !this.localLead.products[i].fecha_inicio_vigencia ||
            !this.localLead.products[i].fecha_termino_vigencia ||
            !this.localLead.products[i].line ||
            !this.localLead.products[i].name ||
            !this.localLead.products[i].nro_poliza ||
            !this.localLead.products[i].tipo_de_pago ||
            !this.localLead.products[i].user ||
            !this.localLead.products[i].description
          ) {
            this.setProductsErrors()
            this.$store.commit('setAlertMessage', { error: 'Todos los campos de todos sus productos son obligatorios' })
            this.onbutton = true
            return
          }
        }
      }
      if (this.localLead.state === 'en_espera_de_confirmacion' && !this.localLead.projected_quote) {
        this.$store.commit('setAlertMessage', { error: 'El campo de comision proyectada es obligatorio.' })
        this.onbutton = true
        return
      }
      if (this.loadingDocument) {
        this.$store.commit('setAlertMessage', { error: 'Espere un momento, se está cargando un documento.' })
        this.onbutton = true
        return
      }
      this.$emit('save-lead')
      this.onbutton = true
    },
    cancelLead () {
      this.$emit('cancel-lead')
    },
    newItem () {
      if (this.option === 'products') {
        this.addProduct()
      }
      if (this.option === 'documents') {
        this.addDocument()
      }
      if (this.option === 'diagnostic') {
        this.addDiagnostic()
      }
    },
    setDocumentFile ({ key = null, file }) {
      const reader = new FileReader()
      reader.onload = () => {
        if (key === null) {
          this.addDocument({
            document64: reader.result,
            title: file.name
          })
        } else {
          this.localLead.documents[key].document64 = reader.result
          this.localLead.documents[key].title = file.name
        }
      }
      reader.onerror = (error) => {
        this.$store.commit('setAlertMessage', { error: 'Hubo un error al cargar el archivo, por favor intentalo de nuevo.' })
        console.log({ error })
      }

      this.loadingDocument = true
      reader.readAsDataURL(file)
      this.loadingDocument = false
    },
    setChannel (value) {
      this.localLead.channel = value
      this.localLead.referred = null
    },
    setReasonContact (value) {
      this.localLead.contact_reason = value
    },
    getTag (tag) {
      const { products } = this
      return products.find(({ value }) => value === tag).text
    },
    formatDuplicates (data) {
      if (data && data.length > 0) {
        return data.filter(lead => lead.id !== this.localLead.id).map((lead) => {
          return {
            Value: lead.id,
            text: `${lead.name || ''} ${lead.last_name || ''} ${lead.razon_social || ''}`
          }
        })
      } else {
        return []
      }
    },
    getLeadsWithSameRut: _.debounce(async function () {
      if (this.localLead.rut && this.localLead.rut.length > 0) {
        try {
          const { data } = await this.$simpleeApi.get(`/lead/?rut=${this.localLead.rut}`)
          this.duplicatedRutLeads = this.formatDuplicates(data.results)
          this.selectedDuplicate = null
        } catch (error) {
          this.$store.commit('setAlertMessage', error.response.data)
        }
      } else {
        this.duplicatedRutLeads = []
      }
    }, 500),
    setProductsErrors () {
      this.productsWithError = [...this.localLead.products.filter((p) => {
        return !p.comision ||
          !p.comision_final ||
          !p.company ||
          !p.emited_date ||
          !p.fecha_inicio_vigencia ||
          !p.fecha_termino_vigencia ||
          !p.line ||
          !p.name ||
          !p.nro_poliza ||
          !p.prima ||
          !p.tipo_de_pago ||
          !p.user ||
          !p.description
      })].map(p => this.localLead.products.indexOf(p))
    },
    removeProductFromErrors (key) {
      this.productsWithError = this.productsWithError.filter(p => p !== key)
    }
  }
}
</script>

<style lang="scss">
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
    }
  }

  /* identical to box height */
  //

  color: #000000;
}
.padding-modal {
  padding: 0px 20px 40px 20px !important;
}
@media (min-width: 768px) {
  .padding-modal {
    padding: 0px 72px 40px 72px !important;
  }
}
.product-button {
  background: #ffffff;
  border: 1px solid #d3d3d3;
  box-sizing: border-box;
  border-radius: 5px;
}
.products,
.documents,
.diagnostic,
.tracking {
  div + div {
    margin-top: 1rem;
  }
}
.add {
  left: 1273px;
  top: 306px;
  border-color: transparent;
  font-style: normal;
  font-weight: normal;
  display: flex;
  color: white;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding: 3px;
  line-height: 21px;
  background: var(--primary);
  border-radius: 30px;
}
.comment-row {
  td,
  th {
    height: 200px;
  }
}
.mandatory {
  color: #233348;
}
.doc-title {
  padding: 0 0.75rem;
}
.draggable-modal {
  .modal-header {
    padding: 0;
    height: 4rem;
  }
}
.modal-body {
  padding-top: 0;
}
.max-size {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.3s ease;
  h5 {
    margin-left: 4.5rem;
    margin-bottom: 0;
  }
  p {
    opacity: 0;
    margin: 0 5.5rem 0 0;
    transition: opacity 0.3s ease;
  }
  &:hover {
    cursor: grab;
    background-color: rgb(247, 243, 243);
    p {
      opacity: 1;
    }
  }
}
</style>
