<template>
  <s-form-table
    ref="productForm"
    :class="{ formErrors: hasErrors }"
    class="tb-margin"
  >
    <span class="id-product"> ID Producto: {{ localProduct.id }} </span>
    <tr v-if="typeproduct !== 'endoso'">
      <th>Renovable</th>
      <td>
        <b-form-select v-model="localProduct.renewable">
          <template #first>
            <b-form-select-option value="renovable">
              Renovable
            </b-form-select-option>
            <b-form-select-option value="no_renovable">
              No renovable
            </b-form-select-option>
            <b-form-select-option value="extension_fecha">
              Extension fecha
            </b-form-select-option>
          </template>
        </b-form-select>
      </td>
    </tr>

    <tr v-if="page === 'postventa' || userPermissions.can_change_police_state">
      <th>Estado póliza</th>
      <td>
        <b-form-select v-model="localProduct.state">
          <b-form-select-option :value="null">
            Sin estado
          </b-form-select-option>
          <b-form-select-option value="valid">
            Vigente
          </b-form-select-option>
          <b-form-select-option value="invalid">
            No Vigente
          </b-form-select-option>
          <b-form-select-option value="canceled">
            Cancelada
          </b-form-select-option>
          <b-form-select-option value="renewed">
            Renovada
          </b-form-select-option>
          <b-form-select-option value="rehabilitated">
            Rehabilitada
          </b-form-select-option>
          <b-form-select-option value="change_company">
            Cambio compañía
          </b-form-select-option>
          <b-form-select-option value="canceled_nopay">
            Cancelada Por No Pago
          </b-form-select-option>
        </b-form-select>
      </td>
    </tr>
    <tr>
      <th>ANS</th>
      <td class="text-center">
        <div class="opcion">
          <b-form-radio-group
            v-model="localProduct.is_ans"
            :options="optionsans"
            class="mb-1"
            value-field="item"
            text-field="name"
            disabled-field="notEnabled"
            :disabled="page === 'postventa'"
          ></b-form-radio-group>
        </div>
      </td>
    </tr>
    <tr>
      <th>Tipo de producto</th>
      <td>
        <b-form-select
          id="Lines"
          v-model="localProduct.product_type"
          placeholder="Selecciona un tipo de producto"
          :options="Productype"
          @change="UpdateTypeProduct"
        />
      </td>
    </tr>
    <tr>
      <th>Producto padre</th>
      <td>
        <div class="d-flex d-flex-row justify-content-end align-items-center">
          <nuxt-link
            v-if="localProduct.parent_product"
            :to="{
              path: '/postventa',
              query: {
                id: localProduct.parent_product,
              },
            }"
            class="text-underline w-100 d-flex pl-2"
          >
            {{ localProduct.parent_product }}
          </nuxt-link>
        </div>
      </td>
    </tr>
    <tr v-if="typeproduct === 'renovacion'">
      <th>Número de renovación</th>
      <td>
        <b-input
          v-model="localProduct.renewal_number"
          type="text"
          placeholder=""
        />
      </td>
    </tr>
    <tr v-if="typeproduct === 'endoso'">
      <th>Número de endoso</th>
      <td>
        <b-input
          v-model="localProduct.endorsement_nro"
          type="text"
          placeholder=""
        />
      </td>
    </tr>
    <!-- <tr v-if="page === 'postventa'">
      <th>Pago Cliente</th>
      <td>
        <b-form-select v-model="localProduct.client_payment_state">
          <b-form-select-option :value="null">
            Sin estado
          </b-form-select-option>
          <b-form-select-option value="paid">
            Pagada por el cliente
          </b-form-select-option>
          <b-form-select-option value="pending">
            Pendiente de pago
          </b-form-select-option>
          <b-form-select-option value="canceled">
            Cancelada
          </b-form-select-option>
        </b-form-select>
      </td>
    </tr>
    <tr v-if="page === 'postventa'">
      <th>Pago compañía</th>
      <td>
        <b-form-select v-model="localProduct.company_payment_state">
          <b-form-select-option :value="null">
            Sin estado
          </b-form-select-option>
          <b-form-select-option value="paid">
            Pagada por la compañía
          </b-form-select-option>
          <b-form-select-option value="pending">
            Pendiente de pago
          </b-form-select-option>
          <b-form-select-option value="canceled">
            Cancelada
          </b-form-select-option>
        </b-form-select>
      </td>
    </tr>
    <tr v-if="page === 'postventa' && currentUser.is_superuser || userPermissions.can_make_discount">
      <th>Descuento Monto</th>
      <td>
        <b-input
          v-model="amount"
          type="number"
          placeholder="Agrega monto a descontar"
        />
      </td>
    </tr>
    <tr v-if="page === 'postventa' && currentUser.is_superuser || userPermissions.can_make_discount">
      <th>Descuento Fecha</th>
      <td>
        <b-input
          v-model="date"
          type="date"
          placeholder=""
        />
      </td>
    </tr> -->
    <tr>
      <th>Línea de producto</th>
      <td>
        <b-form-select
          id="Lines"
          v-model="localProduct.line"
          placeholder="Selecciona una linea de producto"
          :options="Lines"
          :disabled="page === 'postventa'"
          @click="getLineGrup(localProduct.line)"
        />
      </td>
    </tr>
    <tr>
      <th>Grupo de producto</th>
      <td>
        <b-form-select
          id="Lines"
          v-model="localProduct.group"
          placeholder="Selecciona un grupo de producto"
          :disabled="page === 'postventa'"
          :options="getLineGrup(localProduct.line)"
        />
      </td>
    </tr>
    <tr>
      <th>Producto</th>
      <td>
        <b-form-select
          v-model="localProduct.name"
          placeholder="Selecciona un producto"
          :options="getLineProducts(localProduct.group)"
          :disabled="page === 'postventa'"
        >
          <template #first>
            <b-form-select-option
              :value="null"
              disabled
            >
              Seleccione un producto
            </b-form-select-option>
          </template>
        </b-form-select>
      </td>
    </tr>
    <tr>
      <th>Compañia</th>
      <td>
        <b-form-select
          v-model="localProduct.company"
          placeholder="Selecciona una compañia"
          :options="getCompanies()"
          :disabled="page === 'postventa'"
        >
          <template #first>
            <b-form-select-option
              :value="null"
              disabled
            >
              Seleccione una línea de producto
            </b-form-select-option>
          </template>
          <!-- <b-form-select-option
            v-for="({companyValue,name},index) in companies"
            :key="index"
            :value="companyValue"
          >
            {{ name }}
          </b-form-select-option> -->
        </b-form-select>
      </td>
    </tr>
    <!--
     <tr>
      <th>Tipo de producto</th>
      <td>
        <b-form-select
          id="Lines"
          v-model="localProduct.product_type"
          placeholder="Selecciona un tipo de producto"
          :options="Productype"
        />
      </td>
    </tr>
   -->
    <tr>
      <th>Número de poliza</th>
      <td>
        <b-input
          v-model="localProduct.nro_poliza"
          type="text"
          placeholder=""
          :disabled="page === 'postventa'"
        />
      </td>
    </tr>
    <tr>
      <th>Prima</th>
      <td>
        <b-input
          v-model="localProduct.prima"
          type="number"
          step=".01"
          placeholder=""
          :disabled="page === 'postventa'"
        />
      </td>
    </tr>
    <!--
    <tr v-if="localProduct.prima_bruta">
      <th>Prima Con IVA</th>
      <td>
        <b-input
          v-model="localProduct.prima_bruta"
          disabled
          type="number"
          step=".01"
          placeholder=""
        />
      </td>
    </tr>-->
    <tr v-if="state === 'en_licitacion'">
      <th>Fecha de adjudicación</th>
      <td>
        <b-input
          v-model="localProduct.adjudication_date"
          type="date"
          placeholder=""
          :disabled="page === 'postventa'"
        />
      </td>
    </tr>
    <tr>
      <th>Fecha de emisión</th>
      <td>
        <b-input
          v-model="localProduct.emited_date"
          type="date"
          placeholder=""
        />
      </td>
    </tr>
    <tr>
      <th>Inicio de vigencia</th>
      <td>
        <b-input
          v-model="localProduct.fecha_inicio_vigencia"
          type="date"
          placeholder=""
          :disabled="page === 'postventa'"
          @change="getDate()"
        />
      </td>
    </tr>
    <tr>
      <th>Término de la vigencia</th>
      <td>
        <b-input
          v-model="localProduct.fecha_termino_vigencia"
          type="date"
          :min="localProduct.fecha_inicio_vigencia"
          placeholder=""
          :disabled="page === 'postventa'"
          @change="getDate()"
        />
        <span class="textred">{{ errorDate }}</span>
      </td>
    </tr>
    <tr v-if="page !== 'postventa'">
      <th>Renovable</th>
      <td>
        <b-form-select v-model="localProduct.renewable">
          <template #first>
            <b-form-select-option value="renovable">
              Renovable
            </b-form-select-option>
            <b-form-select-option value="no_renovable">
              No renovable
            </b-form-select-option>
            <b-form-select-option value="extension_fecha">
              Extension fecha
            </b-form-select-option>
          </template>
        </b-form-select>
      </td>
    </tr>
    <tr>
      <th>Tipo de Pago</th>
      <td>
        <b-form-select
          v-model="localProduct.tipo_de_pago"
          :disabled="page === 'postventa'"
        >
          <template #first>
            <b-form-select-option
              disabled
              :value="null"
            >
              Seleccione un tipo de pago
            </b-form-select-option>
          </template>
          <b-form-select-option
            v-for="{ valuepayment, text } in types_payment"
            :key="valuepayment"
            :value="valuepayment"
          >
            {{ text }}
          </b-form-select-option>
        </b-form-select>
      </td>
    </tr>
    <tr v-if="localProduct.tipo_de_pago === 'aviso_de_cobranza'">
      <th>Dia de cobro</th>
      <td>
        <b-form-select
          v-model="localProduct.payment_day"
          :disabled="page === 'postventa'"
        >
          <template #first>
            <b-form-select-option disabled>
              Seleccione el dia de cobro
            </b-form-select-option>
          </template>
          <b-form-select-option value="5">
            5
          </b-form-select-option>
          <b-form-select-option value="10">
            10
          </b-form-select-option>
          <b-form-select-option value="15">
            15
          </b-form-select-option>
          <b-form-select-option value="20">
            20
          </b-form-select-option>
          <b-form-select-option value="25">
            25
          </b-form-select-option>
        </b-form-select>
      </td>
    </tr>
    <tr>
      <th>Comisión</th>
      <td>
        <b-input
          :value="localProduct.comision"
          type="number"
          step=".01"
          placeholder=""
          disabled
          @input="setComision"
        />
      </td>
    </tr>
    <tr>
      <th>Comisión Final</th>
      <td>
        <b-input
          type="number"
          step=".01"
          :value="localProduct.comision_final"
          disabled
          placeholder=""
        />
      </td>
    </tr>
    <tr v-if="
        (page === 'poliza' && currentUser.is_superuser) ||
          userPermissions.can_change_police_state
      ">
      <th>Estado póliza</th>
      <td>
        <b-form-select v-model="localProduct.state">
          <b-form-select-option :value="null">
            Sin estado
          </b-form-select-option>
          <b-form-select-option value="valid">
            Vigente
          </b-form-select-option>
          <b-form-select-option value="invalid">
            No Vigente
          </b-form-select-option>
          <b-form-select-option value="canceled">
            Cancelada
          </b-form-select-option>
          <b-form-select-option value="renewed">
            Renovada
          </b-form-select-option>
          <b-form-select-option value="rehabilitated">
            Rehabilitada
          </b-form-select-option>
          <b-form-select-option value="change_company">
            Cambio compañía
          </b-form-select-option>
          <b-form-select-option value="canceled_nopay">
            Cancelada Por No Pago
          </b-form-select-option>
        </b-form-select>
      </td>
    </tr>
    <tr v-if="page === 'poliza'">
      <th>Pago Cliente</th>
      <td>
        <b-form-select v-model="localProduct.client_payment_state">
          <b-form-select-option :value="null">
            Sin estado
          </b-form-select-option>
          <b-form-select-option value="paid">
            Pagada por el cliente
          </b-form-select-option>
          <b-form-select-option value="pending">
            Pendiente de pago
          </b-form-select-option>
          <b-form-select-option value="canceled">
            Cancelada
          </b-form-select-option>
        </b-form-select>
      </td>
    </tr>
    <tr v-if="page === 'poliza'">
      <th>Pago compañía</th>
      <td>
        <b-form-select v-model="localProduct.company_payment_state">
          <b-form-select-option :value="null">
            Sin estado
          </b-form-select-option>
          <b-form-select-option value="paid">
            Pagada por la compañía
          </b-form-select-option>
          <b-form-select-option value="pending">
            Pendiente de pago
          </b-form-select-option>
          <b-form-select-option value="canceled">
            Cancelada
          </b-form-select-option>
        </b-form-select>
      </td>
    </tr>
    <tr v-if="
        (page === 'poliza' && currentUser.is_superuser) ||
          userPermissions.can_make_discount
      ">
      <th>Descuento Monto</th>
      <td>
        <b-input
          v-model="amount"
          type="number"
          placeholder="Agrega monto a descontar"
        />
      </td>
    </tr>
    <tr v-if="
        (page === 'poliza' && currentUser.is_superuser) ||
          userPermissions.can_make_discount
      ">
      <th>Descuento Fecha</th>
      <td>
        <b-input
          v-model="date"
          type="date"
          placeholder=""
        />
      </td>
    </tr>
    <tr>
      <th>Ejecutivo a cargo</th>
      <td>
        <b-form-select
          v-model="localProduct.user"
          placeholder="Selecciona una compañia"
          :options="executives"
          :disabled="page === 'postventa'"
        >
          <template #first>
            <b-form-select-option
              :value="null"
              disabled
            >
              Seleccione un ejecutivo
            </b-form-select-option>
          </template>
        </b-form-select>
      </td>
    </tr>
    <tr>
      <th>Descripción</th>
      <td>
        <b-form-textarea
          v-model="localProduct.description"
          type="text"
          placeholder=""
        />
      </td>
    </tr>
    <tr v-if="localProduct.id && showLink">
      <td colspan="2">
        <b-button
          class="no-validate"
          block
          :to="{
            name: 'postventa',
            query: {
              id: localProduct.id,
            },
          }"
          variant="primary"
        >
          Ir a la póliza
        </b-button>
      </td>
    </tr>
    <tr v-if="localProduct.id && showLink">
      <td colspan="2">
        <b-button
          class="no-validate"
          block
          :to="{
            name: 'postventa',
            query: {
              id: localProduct.id,
            },
          }"
          variant="primary"
        >
          Ir a la póliza
        </b-button>
      </td>
    </tr>
    <tr v-if="localProduct.collect_payment && localProduct.digital_quotation && localProduct.state !=='canceled_nopay'">
      <td colspan="2">
        <b-button
          class="no-validate"
          block
          @click="CancelProduct(localProduct.digital_quotation)"
          variant="dark "
        >
          Cancelar producto digital
        </b-button>
      </td>
    </tr>
    <tr v-if="localProduct.id && version ==='CL'">
      <td colspan="2">
        <b-button
          class="no-validate text-white"
          block
          @click="sendDocumentPoliza"
          variant="dark"
        >
          Enviar Documento de Poliza al correo del cliente
        </b-button>
      </td>
    </tr>
    <tr v-if="localProduct.collect_payment">
      <td colspan="2">
        <b-button
          class="no-validate"
          block
          :to="{
          name: 'cobrar',
          query: {
            id: localProduct.collect_payment.id,
          },
        }"
          variant="info"
        >
          Ir a la cobranza
        </b-button>
      </td>
    </tr>
    <tr v-else>
      <td colspan="2">
        <b-button
          class="no-validate"
          block
          :to="{
            name: 'cobrar-nuevo',
            query: {
              id: localProduct.id,
            },
          }"
          variant="success"
        >
          Pagar
        </b-button>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <b-button
          class="no-validate d-flex justify-content-center"
          block
          variant="danger"
          @click="clickSendEndoso(true)"
        >
          <div class="circle bg-white border mr-2">
            <fa-icon
              :icon="['fas', 'file']"
              class="text-primary"
              style="font-size: .9rem"
            />
          </div>
          <span>Crear Endoso</span>
        </b-button>
      </td>
    </tr>
    <tr v-if="localProduct.id">
      <td colspan="2">
        <s-form-table
          ref="productForm2"
          class=""
        >
    <tr>
      <td
        colspan="1"
        style="width: 50%;"
      >
        <b-button
          class="no-validate d-flex justify-content-center"
          block
          variant="secondary"
          @click="clickSendR('True')"
        >
          <div class="circle bg-white border mr-2">
            <fa-icon
              :icon="['fas', 'envelope']"
              class="text-primary"
              style="font-size: .9rem"
            />
          </div>
          <span>Aviso Renovación Cambio Términos</span>
        </b-button>
      </td>
      <td colspan="1">
        <b-button
          class="no-validate"
          block
          variant="secondary"
          @click="clickSendW('True')"
        >
          <img
            class="imgicon"
            :src="require(`~/assets/icons/WhatsApp.png`)"
          >
          Renovación Cambio Términos
        </b-button>
      </td>
    </tr>
  </s-form-table>
  </td>
  </tr>
  <tr v-if="localProduct.id">
    <td colspan="2">
      <s-form-table
        ref="productForm2"
        class=""
      >
  <tr>
    <td
      colspan="1"
      style="width: 50%;"
    >
      <b-button
        class="no-validate d-flex justify-content-center"
        block
        variant="warning"
        @click="clickSendR('False')"
      >
        <div class="circle bg-white border mr-2">
          <fa-icon
            :icon="['fas', 'envelope']"
            class="text-primary"
            style="font-size: .9rem"
          />
        </div>
        <span>
          Aviso Renovación Mismos Términos
        </span>
      </b-button>
    </td>
    <td colspan="1">
      <b-button
        class="no-validate"
        block
        variant="warning"
        @click="clickSendW('False')"
      >
        <img
          class="imgicon"
          :src="require(`~/assets/icons/WhatsApp.png`)"
        >
        Renovación Mismos Términos
      </b-button>
    </td>
  </tr>
  </s-form-table>
  </td>
  </tr>
  <tr v-if="localProduct.id">
    <td colspan="2">
      <s-form-table
        ref="productForm3"
        class=""
      >
  <tr>
    <td
      colspan="1"
      style="width: 50%;"
    >
      <b-button
        class="no-validate d-flex justify-content-center"
        block
        variant="danger"
        @click="clickSendR('Auto')"
      >
        <div class="circle bg-white border mr-2">
          <fa-icon
            :icon="['fas', 'envelope']"
            class="text-primary"
            style="font-size: .9rem"
          />
        </div>
        <span>
          Aviso Renovación Automatica
        </span>
      </b-button>
    </td>
    <td colspan="1">
      <b-button
        class="no-validate"
        block
        variant="danger"
        @click="clickSendW('Auto')"
      >
        <img
          class="imgicon"
          :src="require(`~/assets/icons/WhatsApp.png`)"
        >
        Renovación Automatica
      </b-button>
    </td>
  </tr>
  </s-form-table>
  </td>
  </tr>

  <tr v-if="showDelete">
    <td colspan="2">
      <b-button
        block
        @click="$emit('delete')"
      >
        Eliminar producto
      </b-button>
    </td>
  </tr>
  <reasignar-product-request
    v-if="modalreasigproduct"
    postventa
    @hidde="onCloseModal"
    @cancel-lead="onCloseModal"
    @UpdateProduct="UpdateProductNew"
  />
  <b-modal
    ref="modal-sendRenovation"
    size="md"
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
            Enviar Aviso Renovación {{ typeSendR ? 'con' : 'sin' }} términos
          </h3>

          <div class="w-100 d-flex flex-row mt-3">
            <div class="w-50 d-flex flex-column mr-2">
              <div class="w-100 d-flex flex-column">
                <label
                  class="text-base mt-0"
                  for="tipoCertificado"
                >Se Envia a:</label>
                <input
                  id="emailToSend"
                  v-model="emailToSend"
                  class="border border-gray-600 p-2 inputsSAc"
                  style="width: 15rem !important;"
                  type="email"
                >
              </div>
            </div>
          </div>
          <div class="w-100 d-flex flex-col mt-3">
            <div class="w-100 d-flex flex-col mr-2">
              <div class="w-100 d-flex flex-row">
                <label
                  for="checksendO"
                  class="text-base mt-0 mr-2"
                >Con Copia Oculta</label>
                <input
                  id="checksendO"
                  v-model="checksendO"
                  class="inputcheck"
                  type="checkbox"
                  @click="handleCheckboxClick()"
                >
              </div>
            </div>
          </div>
          <div
            v-if="checksendO"
            class="w-100 d-flex flex-col mt-2"
          >
            <div class="w-100 d-flex flex-col mr-2">
              <div class="w-100 d-flex flex-row">
                <input
                  id="emailToSendCC"
                  v-model="emailToSendCC"
                  class="border border-gray-600 p-2 inputsSAc"
                  style="width: 15rem !important;"
                  type="email"
                >
              </div>
            </div>
          </div>
          <div class="flex w-full">
            <b-button
              class="text-white p-2 px-3 mt-5"
              size="sm"
              variant="primary"
              @click="PostRenovacion(typeSendR)"
            >
              Enviar
            </b-button>
            <b-button
              class="text-white p-2 px-3 mt-5 ml-4"
              size="sm"
              variant="danger"
              @click="hideModalSend()"
            >
              Cancelar
            </b-button>
          </div>
        </div>
      </div>
    </section>
  </b-modal>

  <b-modal
    ref="modal-endoso"
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
            Crear endoso para este producto
          </h3>

          <div class="w-100 d-flex flex-row mt-3">
            <div class="w-100 d-flex flex-column mr-2">
              <div class="w-50 d-flex flex-column my-2">
                <label
                  class="text-base mt-0"
                  for="tipoCertificado"
                >Nro Endoso:</label>
                <input
                  id=""
                  v-model="ObjEndoso.nro_endoso"
                  class="border border-gray-600 p-2 inputsSAc"
                  style="width: 15rem !important;"
                  type="text"
                >
              </div>
              <div class="w-50 d-flex flex-column my-2">
                <label
                  class="text-base mt-0"
                  for="tipoCertificado"
                >Tipo Endoso:</label>
                <input
                  id=""
                  v-model="ObjEndoso.type"
                  class="border border-gray-600 p-2 inputsSAc"
                  style="width: 15rem !important;"
                  type="text"
                >
              </div>
              <div class="w-100 d-flex flex-column my-2">
                <label
                  class="text-base mt-0"
                  for="tipoCertificado"
                >Mensaje:</label>
                <textarea
                  id=""
                  v-model="ObjEndoso.mensaje"
                  class="border border-gray-600 p-2 inputsSAc"
                  style="height: 100% !important;"
                  cols="30"
                >
                </textarea>
              </div>
              <div class="w-50 d-flex flex-column my-2">
                <label
                  class="text-base mt-0"
                  for="tipoCertificado"
                >Fecha inicio:</label>
                <input
                  id=""
                  v-model="ObjEndoso.fecha_inicio"
                  class="border border-gray-600 p-2 inputsSAc"
                  style="width: 15rem !important;"
                  type="date"
                >
              </div>
              <div class="w-50 d-flex flex-column my-2">
                <label
                  class="text-base mt-0"
                  for="tipoCertificado"
                >Fecha Fin:</label>
                <input
                  id=""
                  v-model="ObjEndoso.fecha_fin"
                  class="border border-gray-600 p-2 inputsSAc"
                  style="width: 15rem !important;"
                  type="date"
                >
              </div>
            </div>
          </div>
          <!--
            <div class="mt-3">
            <span>El endoso se enviara al correo: <strong v-if="localProduct.lead">{{ localProduct.lead.email }}</strong></span>
          </div>
          <div class="w-100 d-flex flex-col mt-1">
            <div class="w-100 d-flex flex-col mr-2">
              <div class="w-100 d-flex flex-row">
                <label
                  for="checksendEndoso"
                  class="text-base mt-0 mr-2"
                >Enviar a otro</label>
                <input
                  id="checksendEndoso"
                  v-model="checksendEndoso"
                  class="inputcheck mt-1"
                  type="checkbox"
                  @click="handleCheckboxClickEndoso()"
                >
              </div>
            </div>
          </div>
          <div
            v-if="checksendEndoso"
            class="w-100 d-flex flex-col mt-2"
          >
            <div class="w-100 d-flex flex-col mr-2">
              <div class="w-100 d-flex flex-row">
                <input
                  id="emailToSendCCEndoso"
                  v-model="emailToSendCCEndoso"
                  class="border border-gray-600 p-2 inputsSAc"
                  style="width: 15rem !important;"
                  type="email"
                >
              </div>
            </div>
          </div>-->
          <div class="flex w-full">
            <b-button
              class="text-white p-2 px-3 mt-5"
              size="sm"
              variant="primary"
              @click="PostEndoso()"
            >
              Enviar
            </b-button>
            <b-button
              class="text-white p-2 px-3 mt-5 ml-4"
              size="sm"
              variant="danger"
              @click="hideModalSendEndoso()"
            >
              Cancelar
            </b-button>
          </div>
        </div>
      </div>
    </section>
  </b-modal>
  <b-modal
    ref="modal-sendWhatsapp"
    size="md"
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
            Cliente no Tiene Telefono Registrado
          </h3>
          <nuxt-link
            v-if="localProduct.lead"
            :to="{
                path: '/clientes',
                query: {
                  id: localProduct.lead.id,
                },
              }"
            class="text-underline text-right w-50"
          >
            Ir al cliente
          </nuxt-link>
          <div class="flex w-full">
            <b-button
              class="text-white p-2 px-3 mt-5"
              size="sm"
              variant="primary"
              @click="hideModalWhat()"
            >
              Ok
            </b-button>
          </div>
        </div>
      </div>
    </section>
  </b-modal>
  </s-form-table>
</template>

<script>
import { mapState } from 'vuex'
import SFormTable from '@/components/base/SFormTable.vue'
import products from '~/static/productsv2.json'
import productsmx from '~/static/productsmxv2.json'
import companies from '~/static/companies.json'
import companiesmx from '~/static/companiesmx.json'
import ReasignarProductRequest from '~/components/ReasignarProductRequest2.vue'
export default {
  name: 'ProductForm',
  components: {
    SFormTable,
    ReasignarProductRequest
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    showDelete: {
      type: Boolean,
      default: true
    },
    showLink: {
      type: Boolean,
      default: false
    },
    commission: {
      type: Number,
      default: 0
    },
    page: {
      type: String,
      required: false,
      default: 'default'
    },
    state: {
      required: true,
      validator: prop => typeof prop === 'string' || prop === null
    },
    showLeadInfo: {
      type: Boolean,
      default: false
    },
    hasErrors: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      emailToSend: '',
      ObjEndoso: {
        nro_endoso: '',
        type: '',
        mensaje: '',
        fecha_inicio: '',
        fecha_fin: ''
      },
      emailToSendCC: '',
      emailToSendCCEndoso: '',
      checksendO: false,
      checksendEndoso: false,
      typeSendR: false,
      amount: 0,
      date: '',
      Lines: null,
      userkam: 0,
      errorDate: null,
      typeproduct: '',
      modalreasigproduct: false,
      optionsans: [
        { item: 'true', name: 'Si' },
        { item: 'false', name: 'No' }
      ],
      Productype: [
        { value: 'poliza', text: 'Poliza' },
        { value: 'endoso', text: 'Endoso' },
        { value: 'renovacion', text: 'Renovación' }
      ],
      LinesCl: [
        { value: 'asistencias', text: 'Asistencias' },
        { value: 'garantia', text: 'Garantia' },
        { value: 'generales', text: 'Generales' },
        { value: 'salud', text: 'Salud' }
      ],
      LinesMx: [
        { value: 'asistencias', text: 'Asistencias' },
        { value: 'generales', text: 'Generales' },
        { value: 'salud', text: 'Salud' },
        { value: 'affinity', text: 'Affinity' }
      ],
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
      types_cl: [
        null,
        'pac_activo',
        'pac_no_activo',
        'contado',
        'aviso_de_cobranza',
        'pat_activo',
        'pat_no_activo'
      ],
      types_mx: [null, 'mensual', 'trimestral', 'semestral', 'anual']
    }
  },
  computed: {
    ...mapState('localStorage', {
      currentUser: 'user',
      userPermissions: 'userPermissions'
    }),
    localProduct: {
      get () {
        return this.value
      },
      set (localProduct) {
        this.$emit('input', localProduct)
      }
    },
    // discount () {
    //   const { amount, date } = this
    //   return { amount, date }
    // },
    executives () {
      return this.$store.state.leads.users.map(({ id, email }) => ({
        value: id,
        text: email
      }))
    }
  },
  watch: {
    commission: {
      immediate: true,
      handler () {
        this.localProduct.comision_final = this.localProduct.comision_final
        if (!this.localProduct.comision_final) {
          delete this.localProduct.comision_final
        }
      }
    },
    // discount () {
    //   const { amount, date } = this
    //   if (amount && date) {
    //     this.localProduct.discount = { amount, date }
    //   }
    // },
    hasErrors: {
      immediate: true,
      handler (val) {
        const inputs = this.$refs.productForm?.$children.filter(
          i =>
            !i.$el.value &&
            !i.$el.disabled &&
            !i.$el.classList.contains('no-validate')
        )
        if (val) {
          inputs?.forEach((e) => {
            if (!e.$el.value) {
              e.$el.classList.add('inputError')
            }
          })
        }
      }
    },
    localProduct: {
      deep: true,
      handler () {
        if (this.hasErrors) {
          const inputs = this.$refs.productForm?.$children
          inputs?.forEach((f) => {
            if (!f.$el.value && !f.$el.disabled) {
              f.$el.classList.add('inputError')
            } else {
              f.$el.classList.remove('inputError')
            }
          })
          if (
            inputs.filter(
              i => !i.$el.value && !i.$el.classList.contains('no-validate')
            ).length === 0
          ) {
            this.$emit('errorsResolved')
          }
        }
      }
    }
  },
  created () {
    if (this.localProduct.nro_poliza) {
      this.ObjEndoso.nro_endoso = this.localProduct.nro_poliza
    }
    if (this.localProduct.product_type) {
      this.typeproduct = this.localProduct.product_type
    } else {
      this.typeproduct = 'poliza'
    }
    if (this.localProduct.renewal_info) {
      this.localProduct.renewal_number =
        this.localProduct.renewal_info.renewal_number
    }
    if (this.localProduct.endorsement_info) {
      this.localProduct.endorsement_nro =
        this.localProduct.endorsement_info.endorsement_nro
    }
    this.userkam = this.$store.state.localStorage.user.id
    if (process.env.version === 'CL') {
      this.Lines = this.LinesCl
      this.types_payment = this.types_payment_cl
      const types = [
        null,
        'pac_activo',
        'pac_no_activo',
        'contado',
        'aviso_de_cobranza',
        'pat_activo',
        'pat_no_activo'
      ]
      if (this.localProduct.tipo_de_pago) {
        this.localProduct.tipo_de_pago =
          this.localProduct.tipo_de_pago.toLowerCase()
      }
      // eslint-disable-next-line camelcase
      const { tipo_de_pago = '' } = this.localProduct

      if (types.includes(tipo_de_pago)) {
        return null
      }
      if (tipo_de_pago.includes('pac')) {
        this.localProduct.tipo_de_pago = 'pac_activo'
      } else if (tipo_de_pago.includes('contado')) {
        this.localProduct.tipo_de_pago = 'contado'
      } else if (tipo_de_pago.includes('pat')) {
        this.localProduct.tipo_de_pago = 'pat_activo'
      } else {
        delete this.localProduct.tipo_de_pago
      }
    } else {
      this.Lines = this.LinesMx
      this.types_payment = this.types_payment_mx
    }
    // this.initializeDiscount(this.localProduct.discount)
    if (this.userkam !== 5) {
      this.localProduct.emited_date =
        this.localProduct.emited_date || new Date().toISOString().split('T')[0]
    }

    if (process.env.version === 'CL') {
      this.Lines = this.LinesCl
    } else {
      this.Lines = this.LinesMx
    }
  },
  methods: {
    async sendDocumentPoliza () {
      const payload = {
        product: this.localProduct.id,
        emailToSend: null,
        user: this.$store.state.localStorage.user.id
      };
      try {
        await this.$simpleeApi.post("/send_policy", payload);
        this.$store.commit("setAlertMessage", {
          success: "Se ha enviado el documento exitosamente!",
        });
      } catch (error) {
        console.log(error)
      }
    },
    CancelProduct (data) {
      this.$bvModal
        .msgBoxConfirm('¿Esta seguro de cancelar esta poliza digital?', {
          title: 'Confirmar',
          titleClass: 'mdtitle',
          size: 'md',
          buttonSize: 'md',
          okVariant: 'danger',
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
            this.CancelProductEnd(data)
          }
        })
    },
    async CancelProductEnd (data) {
      try {
        const dataSend = {
          entity_type: data.type,
          entity_id: data.id
        }
        const resp = await this.$simpleeApi.post('/cancel-proposal/', dataSend)
        this.$emit('CloseModal')
        this.$store.commit('setAlertMessage', { success: 'La poliza digital se ha cancelado correctamente' })
      } catch (err) {
        console.log(err)
        this.$store.commit('setAlertMessage', { error: 'Ocurrio un Error Inesperado' })
      }
    },
    UpdateTypeProduct (value) {
      this.typeproduct = value
    },
    clickSendR (type) {
      if (this.localProduct.lead) {
        this.emailToSend = this.localProduct.lead.email
      }
      this.$refs['modal-sendRenovation'].show()
      this.typeSendR = type
    },
    clickSendEndoso () {
      this.$refs['modal-endoso'].show()
    },
    clickSendW (type) {
      if (this.localProduct.lead && this.localProduct.lead.phone) {
        this.clickSendRWS(type)
      } else {
        this.$refs['modal-sendWhatsapp'].show()
      }
    },
    async clickSendRWS (terms) {
      try {
        const dataSend = {
          type: 'renew',
          product: this.localProduct.id,
          term: terms,
          leadId: this.localProduct.lead.id
        }
        console.log(dataSend)
        const resp = await this.$simpleeApi.post('/wsp_msj/', dataSend)
        const url = resp.data.url.url
        window.open(url, '_blank')
      } catch (err) {
        console.log(err)
        this.$store.commit('setAlertMessage', { error: 'Ocurrio un Error Inesperado' })
      }
    },
    hideModalSend () {
      this.$refs['modal-sendRenovation'].hide()
    },
    hideModalSendEndoso () {
      this.$refs['modal-endoso'].hide()
    },
    hideModalWhat () {
      this.$refs['modal-sendWhatsapp'].hide()
    },
    handleCheckboxClick () {
      this.checksendO = !this.checksendO
      if (this.checksendO) {
        this.emailToSendCC = ''
      } else {
        this.emailToSendCC = ''
      }
    },
    handleCheckboxClickEndoso () {
      this.checksendEndoso = !this.checksendEndoso
      if (this.checksendEndoso) {
        this.emailToSendCCEndoso = ''
      } else {
        this.emailToSendCCEndoso = ''
      }
    },
    async PostEndoso () {
      try {
        this.$refs['modal-endoso'].hide()
        const dataSend =
        {
          parent: this.localProduct.id,
          type: this.ObjEndoso.type ?? null,
          nro_endoso: this.ObjEndoso.nro_endoso ?? null,
          user: this.$store.state.localStorage.user.id,
          msj: this.ObjEndoso.mensaje ?? null,
          fecha_inicio: this.ObjEndoso.fecha_inicio ?? null,
          fecha_termino: this.ObjEndoso.fecha_fin ?? null,
        }
        console.log(dataSend)
        const respo = await this.$simpleeApi.post('/issue_endorsement/', dataSend)
        this.$store.commit('setAlertMessage', {
          success: 'Se ha creado y enviado el endoso, al cerrar esta ventana se abrira el nuevo Endoso'
        })
        const datanew = respo.data
        const query = {
          id: datanew.product_endorsement_id
        }
        this.$router.push({ path: 'postventa', query })

      } catch (error) {
        console.log(error)
      }
    },
    async PostEndosoOld () {
      try {
        this.$refs['modal-endoso'].hide()
        if (!this.emailToSendCCEndoso) {
          this.emailToSendCCEndoso = this.localProduct.lead.email
        }
        if (this.emailToSendCCEndoso) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          const isValidEmail = emailRegex.test(this.emailToSendCCEndoso)
          if (!isValidEmail) {
            this.$store.commit('setAlertMessage', { error: 'Email no valido' })
          } else {
            const dataSend =
            {
              parent: this.localProduct.id,
              type: this.ObjEndoso.type ?? null,
              nro_endoso: this.ObjEndoso.nro_endoso ?? null,
              user: this.$store.state.localStorage.user.id,
              msj: this.ObjEndoso.mensaje ?? null,
              fecha_inicio: this.ObjEndoso.fecha_inicio ?? null,
              fecha_termino: this.ObjEndoso.fecha_fin ?? null,
            }
            console.log(dataSend)
            const respo = await this.$simpleeApi.post('/issue_endorsement/', dataSend)
            this.$store.commit('setAlertMessage', {
              success: 'Se ha creado y enviado el endoso'
            })
            const datanew = respo.data
            const query = {
              id: datanew.product_endorsement_id
            }
            this.$router.push({ path: 'postventa', query })
          }
        } else {
          this.$store.commit('setAlertMessage', { error: 'No puede estar Vacio el Campo Email a Enviar' })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async PostRenovacion (terms) {
      try {
        this.$refs['modal-sendRenovation'].hide()
        if (this.emailToSend) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          const isValidEmail = emailRegex.test(this.emailToSend)
          if (!isValidEmail) {
            this.$store.commit('setAlertMessage', { error: 'Email no valido' })
          } else {
            const isValidEmailCC = emailRegex.test(this.emailToSendCC)
            if (this.emailToSendCC !== '' && !isValidEmailCC) {
              this.$store.commit('setAlertMessage', { error: 'Email de copia no valido' })
            } else {
              const dataSend = {
                product: this.localProduct.id,
                terms,
                user: this.$store.state.localStorage.user.id,
                emailToSend: this.emailToSend,
                emailToSendCC: this.emailToSendCC
              }
              console.log(dataSend)
              await this.$simpleeApi.post('/send_renew', dataSend)
              this.$store.commit('setAlertMessage', {
                success: 'Se ha enviado el aviso de renovación'
              })
            }
          }
        } else {
          this.$store.commit('setAlertMessage', { error: 'No puede estar Vacio el Campo Email a Enviar' })
        }
      } catch (error) {
        console.log(error)
      }
    },
    getLineGrup (line) {
      if (line) {
        if (process.env.version === 'CL') {
          if (
            line === 'garantia' ||
            line === 'generales' ||
            line === 'salud' ||
            line === 'asistencias'
          ) {
            const option = products[line]
            this.GroupsLine = products[line]
            const lead = []
            for (let i = 0; i < option.length; i++) {
              for (const [key] of Object.entries(option[i])) {
                if (key === 'otros_seguros') {
                  const newlead = {
                    value: key,
                    text: 'Otros Seguros'
                  }
                  lead.push(newlead)
                } else if (key === 'seguro_de_garantia') {
                  const newlead = {
                    value: key,
                    text: 'Seguros de Garantia (no valido)'
                  }
                  lead.push(newlead)
                } else if (key) {
                  let text = key
                  text = text.replace('_', ' ')
                  text = text.replace('_', ' ')
                  text = text.replace('_', ' ')
                  text = text.replace('_', ' ')
                  text = text.replace('_', ' ')
                  text = text.replace('_', ' ')
                  const miOracion = text
                  const palabras = miOracion.split(' ')

                  for (let i = 0; i < palabras.length; i++) {
                    palabras[i] =
                      palabras[i][0].toUpperCase() + palabras[i].substr(1)
                  }

                  text = palabras.join(' ')
                  const newlead = {
                    value: key,
                    text
                  }
                  lead.push(newlead)
                }
              }
            }
            return lead
          }
        } else if (
          line === 'affinity' ||
          line === 'generales' ||
          line === 'salud' ||
          line === 'asistencias'
        ) {
          const option = productsmx[line]
          this.GroupsLine = productsmx[line]
          const lead = []
          for (let i = 0; i < option.length; i++) {
            for (const [key] of Object.entries(option[i])) {
              if (key === 'seguro_colectivo_de_gastos_medicos_mayores') {
                const newlead = {
                  value: key,
                  text: 'Seguros de Salud'
                }
                lead.push(newlead)
              } else if (key === 'affinity') {
                const newlead = {
                  value: key,
                  text: 'Seguros para Personas'
                }
                lead.push(newlead)
              } else if (key === 'otros_seguros') {
                const newlead = {
                  value: key,
                  text: 'Otros Seguros'
                }
                lead.push(newlead)
              } else if (key) {
                let text = key
                text = text.replace('_', ' ')
                text = text.replace('_', ' ')
                text = text.replace('_', ' ')
                text = text.replace('_', ' ')
                text = text.replace('_', ' ')
                text = text.replace('_', ' ')
                const miOracion = text
                const palabras = miOracion.split(' ')

                for (let i = 0; i < palabras.length; i++) {
                  palabras[i] =
                    palabras[i][0].toUpperCase() + palabras[i].substr(1)
                }

                text = palabras.join(' ')
                const newlead = {
                  value: key,
                  text
                }
                lead.push(newlead)
              }
            }
          }
          return lead
        }
      }
    },
    UpdateProductNew (value) {
      this.localProduct.parent_product = value.id
      this.onCloseModal()
    },
    onCloseModal () {
      this.modalreasigproduct = false
    },
    getLineProducts (group) {
      if (group) {
        console.log(group)
        console.log(this.GroupsLine)
        if (process.env.version === 'CL') {
          for (let i = 0; i < this.GroupsLine.length; i++) {
            for (const [key, value] of Object.entries(this.GroupsLine[i])) {
              if (group === key) {
                value
                return value
              }
            }
          }
        } else {
          for (let i = 0; i < this.GroupsLine.length; i++) {
            for (const [key, value] of Object.entries(this.GroupsLine[i])) {
              if (group === key) {
                value
                return value
              }
            }
          }
        }
      }
    },
    initializeDiscount (discount) {
      if (discount) {
        this.amount = discount.amount
        this.date = discount.date
      }
    },
    getDate () {
      const Ini = new Date(this.localProduct.fecha_inicio_vigencia)
      const Fin = new Date(this.localProduct.fecha_termino_vigencia)
      const isValidDate = Date.parse(this.localProduct.fecha_termino_vigencia)
      this.errorDate = null
      if (Ini > Fin) {
        this.errorDate =
          'La fecha Término de la vigencia no puede ser menor a Inicio de vigencia'
      } else if (isNaN(isValidDate)) {
        this.errorDate = 'Fecha no valida'
        return false
      } else {
        this.errorDate = null
      }
    },
    getCompanies () {
      if (process.env.version === 'CL') {
        return companies
      } else {
        return companiesmx
      }
    },
    setComision (comision) {
      this.localProduct.comision = comision_final
      this.localProduct.comision_final = this.localProduct.comision
    },
    getDate () {
      const Ini = new Date(this.localProduct.fecha_inicio_vigencia)
      const Fin = new Date(this.localProduct.fecha_termino_vigencia)
      const isValidDate = Date.parse(this.localProduct.fecha_termino_vigencia)
      this.errorDate = null
      if (Ini > Fin) {
        this.errorDate =
          'La fecha Término de la vigencia no puede ser menor a Inicio de vigencia'
      } else if (isNaN(isValidDate)) {
        this.errorDate = 'Fecha no valida'
        return false
      } else {
        this.errorDate = null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.formErrors,
.inputError {
  border: 1px solid red;
}
.textred {
  color: red;
}
span::after {
  padding-left: 5px;
}
input:invalid {
  border: 1px solid red;
}
input:valid {
  border: transparent;
}
.tb-margin {
  margin-top: 30px;
}
.id-product {
  position: absolute;
  margin-top: -25px;
  color: #6461ed !important;
}

.inputcheck {
  margin-top: 5px;
  color: #acacac;
  height: 14px;
  background: #ffffff;
  border: 1px solid #e1e1e1;
  box-sizing: border-box;
  border-radius: 5px;
  width: 16px;
}
.inputsSAc {
  color: #222;
}
</style>
