<template>
  <div class="form-new">
    <div class="d-flex justify-content-between mb-4">
      <span
        class="text-base pointer"
        @click="BackQuotes"
      >
        <fa-icon
          :icon="['fas', 'arrow-left']"
          class="text-primary return"
        />
        <b>Regresar a cotizaciones</b>
      </span>
    </div>
    <div class="row">
      <div class="principal">
        <div class="container">
          <div class="d-flex pt-4 justify-content-between align-items-start flex-row request-title">
            <div class="menu_request d-flex w-75">
              <h2>
                <fa-icon
                  :icon="['fas', 'address-book']"
                  class="text-primary mr-2"
                />Ver Cotización {{ NameQuote(Quote.general_data.technical_plan) }}
              </h2>
            </div>
            <div
              v-if="!Quote.payment_plan.paid"
              class="menu_request justify-content-end d-flex w-25"
            >
              <a
                :href="linkedit"
                target="_blank"
              >
                <h2>
                  <fa-icon
                    :icon="['fas', 'edit']"
                    class="text-primary mr-2"
                  />Editar
                </h2>
              </a>
            </div>
          </div>
          <div class="signup-content flex-column">
            <div class="w-100 mr-3">
              <div
                v-if="loading"
                class="d-flex flex-fill h-100 loading"
              >
                <div class="text-center text-primary pa-5 mx-auto my-auto ">
                  <b-spinner class="align-middle" />
                  <strong class="pr-1">Cargando...</strong>
                </div>
              </div>
              <div
                v-else
                class="signup-form-Client"
              >
                <form
                  id="register-form"
                  method="POST"
                  class="register-form"
                >
                  <div class="w-100 d-flex justify-content-end mb-3">
                    <div class="w-25 d-flex justify-content-end aling-items-center">
                      <div class="d-flex">
                        <slot name="buttons" />
                        <b-button
                          class="text-white shadow-dropdow btn-new ml-4 px-3"
                          variant="primary"
                          @click="confirmSendEmail"
                        >
                          <fa-icon
                            class="mr-1"
                            :icon="['fas', 'envelope']"
                          /> Enviar al Correo
                        </b-button>
                      </div>
                    </div>
                  </div>
                  <div class="w-100 d-flex justify-content-end">
                    <div
                      v-if="!Quote.payment_plan.paid && !validdates"
                      class="w-75 d-flex justify-content-start aling-items-center"
                    >
                      <h4 class="pointer">
                        <fa-icon
                          :icon="['fas', 'money-check']"
                          class="text-primary mr-2"
                        /> Link de pago: <a
                          target="_blank"
                          :href="linkpago"
                        >simplee.cl/cotizar/seguros/rc?proposal={{ Quote.id }}&user={{ $store.state.localStorage.user.id }}</a>
                      </h4>
                    </div>
                    <div class="w-25 d-flex justify-content-end aling-items-center">
                      <h4 class="pointer">
                        <fa-icon
                          :icon="['fas', 'file-alt']"
                          class="text-primary mr-2"
                        /> <a
                          target="_blank"
                          :href="quoteUrl"
                        >Descargar cotización</a>
                      </h4>
                    </div>
                    <!--<div class="w-50 d-flex justify-content-end">
                      <h4 class="pointer">
                        <fa-icon
                          :icon="['fas', 'edit']"
                          class="text-primary mr-2"
                        /> Editar Cotización
                      </h4>
                    </div>-->
                  </div>
                  <div
                    v-if="validdates"
                    class="w-100 d-flex mt-2 bordertopp"
                  >
                    <div class="w-100 d-flex justify-content-center">
                      <h4>
                        Las fechas de vigencia son inválidas para poder comprar la misma por favor edite esta cotización.
                      </h4>
                    </div>
                  </div>
                  <div v-if="Quote.general_data.technical_plan === 7746">
                    <div class="w-100 d-flex mt-2">
                      <div class="w-50">
                        <h4>
                          ID Cotización: {{ Quote.id }}
                        </h4>
                      </div>
                    </div>
                    <div class="w-100 d-flex mt-2 bordertopp">
                      <div class="w-50">
                        <h4>
                          Datos Cotización
                        </h4>
                      </div>
                    </div>
                    <div class="form-row mtrow">
                      <div class="form-group-request w-50">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Prima total:</strong> {{ Quote.prima_total }}
                        </span>
                      </div>
                      <div class="form-group-request w-50">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Prima mensual:</strong> {{ Quote.prima_total_por_cuotas }}
                        </span>
                      </div>
                    </div>
                    <div class="form-row mtrow">
                      <div class="form-group-request w-50">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Numero propuesta:</strong> {{ GetProposal(Quote.nro_proposal) }}
                        </span>
                      </div>
                      <div class="form-group-request w-50">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Numero poliza:</strong> {{ GetPolice(Quote.nro_policy) }}
                        </span>
                      </div>
                    </div>
                    <div
                      v-if="Quote.payment_plan"
                      class="form-row mtrow"
                    >
                      <div class="form-group-request w-50">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Pagado:</strong> {{ GetPagado(Quote.payment_plan.paid) }}
                        </span>
                      </div>
                      <div class="form-group-request w-50">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Tipo propuesta:</strong> {{ getRCStatus(Quote.type_proposal) }}
                        </span>
                      </div>
                    </div>
                    <div
                      v-if="Quote.payment_plan"
                      class="form-row mtrow"
                    >
                      <div class="form-group-request w-50">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Tipo de pago:</strong> {{ GetTipoDePago(Quote.payment_plan.dues) }}
                        </span>
                      </div>
                      <div
                        v-if="Quote.payment_plan"
                        class="form-group-request w-50"
                      >
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Fecha de pago:</strong> {{ getFechaPago(Quote.payment_plan.payment_day) }}
                        </span>
                      </div>
                    </div>
                    <div class="form-row mtrow">
                      <div class="form-group-request w-50">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Estado:</strong> {{ getRCStatus(Quote.state) }}
                        </span>
                      </div>
                      <div class="form-group-request w-50">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Ejecutivo:</strong> {{ Quote.user }}
                        </span>
                      </div>
                    </div>
                    <div
                      v-if="datecontacto"
                      class="w-100 d-flex mt-2 bordertopp"
                    >
                      <div class="w-50">
                        <h4>
                          Datos del contacto
                        </h4>
                      </div>
                      <div
                        v-if="Quote.lead_request"
                        class="w-50 d-flex justify-content-end aling-items-center"
                      >
                        <h4 class="pointer">
                          <fa-icon
                            :icon="['fas', 'user']"
                            class="text-primary mr-2"
                          /> <nuxt-link
                            :to="{
                              name:'solicitudes',
                              query:{
                                idrequest:Quote.lead_request
                              }
                            }"
                            class="text-left"
                          >
                            Ir a la solicitud de la cotización
                          </nuxt-link>
                        </h4>
                      </div>
                    </div>
                    <div
                      v-if="datecontacto"
                      class="form-row mtrow"
                    >
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Nombre Cliente :</strong> {{ datecontacto.name }}
                        </span>
                      </div>
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Apellido Cliente :</strong> {{ datecontacto.last_name }}
                        </span>
                      </div>
                    </div>
                    <div
                      v-if="datecontacto"
                      class="form-row mtrow"
                    >
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Telefono Cliente :</strong> {{ datecontacto.phone }}
                        </span>
                      </div>
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Correo Cliente :</strong> {{ datecontacto.email }}
                        </span>
                      </div>
                    </div>
                    <div class="w-100 d-flex mt-2 bordertopp">
                      <div class="w-50">
                        <h4>
                          Datos de la empresa
                        </h4>
                      </div>
                    </div>
                    <div
                      v-if="Quote.persons[1]"
                      class="form-row mtrow"
                    >
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            RUT de la empresa:</strong> {{ Quote.persons[1].rut }}
                        </span>
                      </div>
                      <div
                        v-if="Quote.persons[1]"
                        class="form-group-request"
                      >
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Nombre o razón social de tu empresa:</strong> {{ Quote.persons[1].name }}
                        </span>
                      </div>
                    </div>
                    <div class="form-row mtrow">
                      <div class="form-group-request w-100">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Actividad de tu empresa:</strong> {{ GetActivities(Quote.matter_insured.company_occupation) }}
                        </span>
                      </div>
                    </div>
                    <div class="form-row mtrow">
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Año de constitución: :</strong> {{ Quote.year_of_incorporation }}
                        </span>
                      </div>
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            N° de trabajadores:</strong> {{ Quote.matter_insured.nro_contractors }}
                        </span>
                      </div>
                    </div>
                    <div class="form-row mtrow">
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Ingreso anual 2022 (UF):</strong> {{ Quote.matter_insured.current_annual_income }}
                        </span>
                      </div>
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Ingreso 2023 proyectado (UF):</strong> {{ Quote.matter_insured.projected_annual_income }}
                        </span>
                      </div>
                    </div>
                    <div class="form-row mtrow">
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Inicio de vigencia:</strong> {{ Quote.general_data.start_date }}
                        </span>
                      </div>
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Término de vigencia:</strong> {{ Quote.general_data.end_date }}
                        </span>
                      </div>
                    </div>
                    <div class="form-row mtrow">
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Monto asegurado (UF):</strong> {{ Quote.insured_amount }}
                        </span>
                      </div>
                    </div>
                    <div class="form-row mtrow">
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            ¿Tienen vehículos?:</strong> {{ GetStatus(Quote.matter_insured.has_vehicles) }}
                        </span>
                      </div>
                      <div
                        v-if="Quote.matter_insured.has_vehicles"
                        class="form-group-request"
                      >
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            ¿Cuantos vehículos?:</strong> {{ Quote.matter_insured.nro_vehicles }}
                        </span>
                      </div>
                    </div>
                    <div class="form-row mtrow">
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            ¿Has tenido siniestros de RC en los últimos 5 años?:</strong> {{ GetStatus(Quote.matter_insured.has_sinister) }}
                        </span>
                      </div>
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            ¿Tienen equipos móviles?:</strong> {{ GetStatus(Quote.matter_insured.has_mobile_equipment) }}
                        </span>
                      </div>
                    </div>
                    <!--<div class="form-row mtrow">
                      <div
                        v-if="Quote.matter_insured.company_occupation == '27480006200'"
                        class="form-group-request"
                      >
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                          ¿Transportan o almacenan material peligroso?:</strong> {{ Quote.matter_insured.company_occupation }}
                        </span>
                      </div>
                      <div
                        v-if="Quote.matter_insured.company_occupation === '27480005800'"
                        class="form-group-request"
                      >
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                          Realizan limpieza en altura?:</strong> {{ Quote.matter_insured.company_occupation }}
                        </span>
                      </div>
                    </div>
                    <div
                      v-if="
                    Quote.matter_insured.company_occupation === '27480004000' ||
                    Quote.matter_insured.company_occupation === '27480005700'
                  "
                      class="form-row mtrow"
                    >
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                          ¿Realizan trabajos en instalaciones electricas de alta tension?:</strong> {{ Quote.matter_insured.company_occupation }}
                        </span>
                      </div>
                    </div>
                  -->
                    <div
                      v-if="Quote.coverages.length > 0"
                      class="w-100 d-flex mt-2 bordertopp"
                    >
                      <div class="w-50">
                        <h4>
                          Coberturas adicionales
                        </h4>
                      </div>
                    </div>
                    <div
                      v-if="Quote.coverages.length > 0"
                      class="form-row mtrow"
                    >
                      <div
                        v-if="Quote.coverages[0]"
                        class="form-group-request"
                      >
                        <span class="text-base w-100 d-flex flex-row">
                          {{ GetCoverages(Quote.coverages[0].coverage_code) }}
                          <fa-icon
                            :icon="['fas', 'check']"
                            class="text-primary return pl-1"
                          />
                        </span>
                      </div>
                      <div
                        v-if="Quote.coverages[1]"
                        class="form-group-request"
                      >
                        <span class="text-base w-100 d-flex flex-row">
                          {{ GetCoverages(Quote.coverages[1].coverage_code) }}
                          <fa-icon
                            :icon="['fas', 'check']"
                            class="text-primary return pl-1"
                          />
                        </span>
                      </div>
                    </div>
                    <div
                      v-if="Quote.matter_insured.nro_locations"
                      class="w-100 d-flex mt-2 bordertopp"
                    >
                      <div class="w-50">
                        <h4>
                          Datos de ubicación
                        </h4>
                      </div>
                    </div>
                    <div
                      v-for="loca in Quote.matter_insured.locations"
                      :key="loca"
                      class="w-100"
                    >
                      <div class="form-row mtrow">
                        <div class="form-group-request w-100">
                          <span class="text-base w-100 d-flex flex-row">
                            <strong class="pr-1">
                              Dirección comercial:</strong> {{ loca.address }}
                          </span>
                        </div>
                      </div>
                      <div class="form-row mtrow">
                        <div class="form-group-request">
                          <span class="text-base w-100 d-flex flex-row">
                            <strong class="pr-1">
                              Comuna:</strong> {{ GetCommune(loca.commune) }}
                          </span>
                        </div>
                        <div class="form-group-request">
                          <span class="text-base w-100 d-flex flex-row">
                            <strong class="pr-1">
                              Ciudad:</strong> {{ loca.location }}
                          </span>
                        </div>
                      </div>
                      <div class="form-row mtrow">
                        <div class="form-group-request w-75">
                          <span class="text-base w-100 d-flex flex-row">
                            <strong class="pr-1">
                              Región:</strong> {{ loca.region }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="Quote.beneficiaries.length > 0"
                      class="w-100 d-flex mt-2 bordertopp"
                    >
                      <div class="w-50">
                        <h4>
                          Asegurados adicionales
                        </h4>
                      </div>
                    </div>
                    <div
                      v-if="Quote.beneficiaries[0]"
                      class="form-row mtrow"
                    >
                      <div class="form-group-request ">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Nombre Asegurado:</strong> {{ Quote.beneficiaries[0].name }} {{ Quote.beneficiaries[0].last_name }}
                        </span>
                      </div>
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Rut Asegurado:</strong> {{ Quote.beneficiaries[0].rut }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="w-100 d-flex mt-2">
                      <div class="w-50">
                        <h4>
                          ID Cotización: {{ Quote.id }}
                        </h4>
                      </div>
                    </div>
                    <div class="w-100 d-flex mt-2 bordertopp">
                      <div class="w-50">
                        <h4>
                          Datos Cotización
                        </h4>
                      </div>
                    </div>
                    <div class="form-row mtrow">
                      <div class="form-group-request w-50">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Prima total:</strong> {{ Quote.prima_total }}
                        </span>
                      </div>
                      <div class="form-group-request w-50">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Prima mensual:</strong> {{ Quote.prima_total_por_cuotas }}
                        </span>
                      </div>
                    </div>
                    <div class="form-row mtrow">
                      <div class="form-group-request w-50">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Numero propuesta:</strong> {{ GetProposal(Quote.nro_proposal) }}
                        </span>
                      </div>
                      <div class="form-group-request w-50">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Numero poliza:</strong> {{ GetPolice(Quote.nro_policy) }}
                        </span>
                      </div>
                    </div>
                    <div
                      v-if="Quote.payment_plan"
                      class="form-row mtrow"
                    >
                      <div class="form-group-request w-50">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Pagado:</strong> {{ GetPagado(Quote.payment_plan.paid) }}
                        </span>
                      </div>
                      <div class="form-group-request w-50">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Tipo propuesta:</strong> {{ getRCStatus(Quote.type_proposal) }}
                        </span>
                      </div>
                    </div>
                    <div
                      v-if="Quote.payment_plan"
                      class="form-row mtrow"
                    >
                      <div class="form-group-request w-50">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Tipo de pago:</strong> {{ GetTipoDePago(Quote.payment_plan.dues) }}
                        </span>
                      </div>
                      <div
                        v-if="Quote.payment_plan"
                        class="form-group-request w-50"
                      >
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Fecha de pago:</strong> {{ getFechaPago(Quote.payment_plan.payment_day) }}
                        </span>
                      </div>
                    </div>
                    <div class="form-row mtrow">
                      <div class="form-group-request w-50">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Estado:</strong> {{ getRCStatus(Quote.state) }}
                        </span>
                      </div>
                      <div class="form-group-request w-50">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Ejecutivo:</strong> {{ Quote.user }}
                        </span>
                      </div>
                    </div>
                    <div
                      v-if="datecontacto"
                      class="w-100 d-flex mt-2 bordertopp"
                    >
                      <div class="w-50">
                        <h4>
                          Datos del contacto
                        </h4>
                      </div>
                      <div
                        v-if="Quote.lead_request"
                        class="w-50 d-flex justify-content-end aling-items-center"
                      >
                        <h4 class="pointer">
                          <fa-icon
                            :icon="['fas', 'user']"
                            class="text-primary mr-2"
                          /><nuxt-link
                            :to="{
                              name:'solicitudes',
                              query:{
                                idrequest:Quote.lead_request
                              }
                            }"
                            class="text-left"
                          >
                            Ir a la solicitud de la cotización
                          </nuxt-link>
                        </h4>
                      </div>
                    </div>
                    <div
                      v-if="datecontacto"
                      class="form-row mtrow"
                    >
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Nombre Cliente :</strong> {{ datecontacto.name }}
                        </span>
                      </div>
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Apellido Cliente :</strong> {{ datecontacto.last_name }}
                        </span>
                      </div>
                    </div>
                    <div
                      v-if="datecontacto"
                      class="form-row mtrow"
                    >
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Telefono Cliente :</strong> {{ datecontacto.phone }}
                        </span>
                      </div>
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Correo Cliente :</strong> {{ datecontacto.email }}
                        </span>
                      </div>
                    </div>
                    <div class="w-100 d-flex mt-2 bordertopp">
                      <div class="w-50">
                        <h4>
                          Datos de la empresa
                        </h4>
                      </div>
                    </div>
                    <div
                      v-if="Quote.persons[1]"
                      class="form-row mtrow"
                    >
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            RUT de la empresa:</strong> {{ Quote.persons[1].rut }}
                        </span>
                      </div>
                      <div
                        v-if="Quote.persons[1]"
                        class="form-group-request"
                      >
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Nombre o razón social de tu empresa:</strong> {{ Quote.persons[1].name }}
                        </span>
                      </div>
                    </div>
                    <div
                      v-if="Quote.general_data.technical_plan === 7747"
                      class="w-100"
                    >
                      <div
                        v-if="Quote.persons[2]"
                        class="form-row mtrow"
                      >
                        <div class="form-group-request">
                          <span class="text-base w-100 d-flex flex-row">
                            <strong class="pr-1">
                              RUT del mandante:</strong> {{ Quote.persons[2].rut }}
                          </span>
                        </div>
                      </div>
                      <div
                        v-if="Quote.persons[2].last_name && Quote.persons[2]"
                        class="form-row mtrow"
                      >
                        <div class="form-group-request">
                          <span class="text-base w-100 d-flex flex-row">
                            <strong class="pr-1">Nombre del mandante: </strong>{{ Quote.persons[2].name }}
                          </span>
                        </div>
                        <div class="form-group-request">
                          <span class="text-base w-100 d-flex flex-row">
                            <strong class="pr-1">
                              Apellido del mandante:</strong> {{ Quote.persons[2].last_name }}
                          </span>
                        </div>
                      </div>
                      <div
                        v-else
                        class="form-row mtrow"
                      >
                        <div class="form-group-request">
                          <span class="text-base w-100 d-flex flex-row">
                            <strong class="pr-1">
                              Razón Social del mandante:</strong> {{ Quote.persons[2].name }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      v-else
                      class="w-100"
                    >
                      <div
                        v-if="Quote.persons[3]"
                        class="form-row mtrow"
                      >
                        <div class="form-group-request">
                          <span class="text-base w-100 d-flex flex-row">
                            <strong class="pr-1">
                              RUT del mandante:</strong> {{ Quote.persons[3].rut }}
                          </span>
                        </div>
                        <div
                          v-if="Quote.persons[3]"
                          class="form-group-request"
                        >
                          <span class="text-base w-100 d-flex flex-row">
                            <strong class="pr-1">Nombre del mandante: </strong>{{ Quote.persons[3].name }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="form-row mtrow">
                      <div class="form-group-request w-100">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Descripción de la obra:</strong> {{ GetObras(Quote.matter_insured.company_occupation) }}
                        </span>
                      </div>
                    </div>
                    <div class="form-row mtrow">
                      <div class="form-group-request w-100">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Descripción adicional de la obra:</strong> {{ Quote.matter_insured.description }}
                        </span>
                      </div>
                    </div>
                    <div class="form-row mtrow">
                      <div class="form-group-request w-100">
                        <span class="text-base d-flex flex-row">
                          <strong class="pr-1">
                            Tu experiencia como contratista en este tipo de trabajos:</strong> {{ Quote.matter_insured.exp }} Años
                        </span>
                      </div>
                    </div>
                    <div class="form-row mtrow">
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Valor del proyecto en UF:</strong> {{ Quote.matter_insured.project_value }}
                        </span>
                      </div>
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            N° de trabajadores:</strong> {{ Quote.matter_insured.nro_workers }}
                        </span>
                      </div>
                    </div>
                    <div class="form-row mtrow">
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Inicio de vigencia:</strong> {{ Quote.general_data.start_date }}
                        </span>
                      </div>
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Término de vigencia:</strong> {{ Quote.general_data.end_date }}
                        </span>
                      </div>
                    </div>
                    <div class="form-row mtrow">
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Monto asegurado (UF):</strong> {{ Quote.insured_amount }}
                        </span>
                      </div>
                      <div
                        v-if="Quote.general_data.technical_plan === 7749"
                        class="form-group-request"
                      >
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            N° de resolución:
                          </strong> {{ Quote.matter_insured.resolution_number }}
                        </span>
                      </div>
                    </div>
                    <div class="form-row mtrow">
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">¿Existe excavación?:</strong> {{ GetStatus(Quote.matter_insured.has_excavation) }}
                        </span>
                      </div>
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            ¿Has tenido siniestros de RC en los últimos 5 años?:</strong> {{ GetStatus(Quote.matter_insured.has_sinister) }}
                        </span>
                      </div>
                    </div>
                    <div
                      v-if="Quote.matter_insured.has_excavation"
                      class="form-row mtrow"
                    >
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Profundidad de la excavación:</strong> {{ Quote.matter_insured.matter_depth }} Metros
                        </span>
                      </div>
                      <div class="form-group-request">
                        <span class="text-base w-100 d-flex flex-row">
                          <strong class="pr-1">
                            Distancia colindancia más cercana:</strong> {{ Quote.matter_insured.distance }} Metros
                        </span>
                      </div>
                    </div>
                    <div
                      v-if="Quote.matter_insured.nro_locations"
                      class="w-100 d-flex mt-2 bordertopp"
                    >
                      <div class="w-50">
                        <h4>
                          Datos de ubicación
                        </h4>
                      </div>
                    </div>
                    <div class="w-100">
                      <div class="form-row mtrow">
                        <div class="form-group-request w-100">
                          <span class="text-base w-100 d-flex flex-row">
                            <strong class="pr-1">
                              Dirección comercial:</strong> {{ Quote.matter_insured.locations[0].address }}
                          </span>
                        </div>
                      </div>
                      <div class="form-row mtrow">
                        <div class="form-group-request">
                          <span class="text-base w-100 d-flex flex-row">
                            <strong class="pr-1">
                              Comuna:</strong> {{ GetCommune(Quote.matter_insured.locations[0].commune) }}
                          </span>
                        </div>
                        <div class="form-group-request">
                          <span class="text-base w-100 d-flex flex-row">
                            <strong class="pr-1">
                              Ciudad:</strong> {{ Quote.matter_insured.locations[0].location }}
                          </span>
                        </div>
                      </div>
                      <div class="form-row mtrow">
                        <div class="form-group-request w-75">
                          <span class="text-base w-100 d-flex flex-row">
                            <strong class="pr-1">
                              Región:</strong> {{ Quote.matter_insured.locations[0].region }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="w-100">
                      <div class="form-row mtrow">
                        <div class="form-group-request w-100">
                          <span class="text-base w-100 d-flex flex-row">
                            <strong class="pr-1">
                              Dirección de la obra:</strong> {{ Quote.matter_insured.locations[1].address }}
                          </span>
                        </div>
                      </div>
                      <div class="form-row mtrow">
                        <div class="form-group-request">
                          <span class="text-base w-100 d-flex flex-row">
                            <strong class="pr-1">
                              Comuna:</strong> {{ GetCommune(Quote.matter_insured.locations[1].commune) }}
                          </span>
                        </div>
                        <div class="form-group-request">
                          <span class="text-base w-100 d-flex flex-row">
                            <strong class="pr-1">
                              Ciudad:</strong> {{ Quote.matter_insured.locations[1].location }}
                          </span>
                        </div>
                      </div>
                      <div class="form-row mtrow">
                        <div class="form-group-request w-75">
                          <span class="text-base w-100 d-flex flex-row">
                            <strong class="pr-1">
                              Región:</strong> {{ Quote.matter_insured.locations[1].region }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
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
          {{ messageError }}
        </h3>
      </div>
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
          Error {{ messageError }}
        </h3>
      </div>
      <div class="text-right">
        <b-button
          class="text-white shadow-dropdow btn-new ml-4"
          variant="primary"
          @click="closeRequestAlertModal2"
        >
          Cerrar
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import Session from '@/mixins/auth'
import RC_options from '~/util/RC_options.json'
import AsignRole from '~/components/AsignRole.vue'
export default {
  components: {
  },
  mixins: [Session],
  props: {
    Quote: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      QuoteEmpre: {},
      validdates: false,
      linkpago: '',
      linkedit: '',
      quoteUrl: '',
      company_occupation: '',
      QuoteCont: {},
      QuoteMop: {},
      Lead: {},
      optionrc: '7746',
      datecontacto: {},
      RC_options,
      messageError: ''
    }
  },
  computed: {
    ...mapState(['leadsFilters', 'leadFromSocket']),
    ...mapState('leads', ['users', 'channels', 'campanas', 'loadingLeads']),
    ...mapState('localStorage', ['user', 'userPermissions'])
  },
  created () {
    this.linkedit = 'http://simplee.cl/cotizar_st/seguros/rc?proposal=' + this.Quote.id + '&user=' + this.$store.state.localStorage.user.id + '&user_name=' + this.$store.state.localStorage.user.first_name
    this.linkpago = 'http://simplee.cl/cotizar/seguros/rc?proposal=' + this.Quote.id + '&user=' + this.$store.state.localStorage.user.id
    this.quoteUrl = this.Quote.document_quote
    this.ValidateFechas()
    this.ValidatePersons()
  },
  methods: {
    ValidateFechas () {
      const Datenew = moment()
      const DateOld = moment(this.Quote.general_data.start_date)
      const Days = Datenew.diff(DateOld, 'days')
      if (Days > 0) {
        this.validdates = true
      } else {
        this.validdates = false
      }
    },
    ValidatePersons () {
      const persons = this.Quote.persons
      for (let i = 0; i < persons.length; i++) {
        if (persons[i].role === 'proponente') {
          this.datecontacto = persons[i]
        }
      }
    },
    BackQuotes () {
      this.$emit('backlist')
    },
    GetCoverages (value) {
      const estatus = this.RC_options.optionalInsurancesInfo.find(
        p => p.coverage_code === value
      )
      return estatus.mainMessage
    },
    GetObras (event) {
      console.log(event)
      const estatus = this.RC_options.constructionSiteDescriptionOptions.find(
        p => p.value === event
      )
      return estatus.text
    },
    GetActivities (event) {
      console.log(event)
      const estatus = this.RC_options.activitiesOptions.find(
        p => p.value === event
      )
      return estatus.text
    },
    GetCommune (value) {
      const datacomuna = this.RC_options.comunasCodes.find(
        p => p.value === value
      )
      return datacomuna.text
    },
    GetStatus (value) {
      if (value) {
        return 'Si'
      } else {
        return 'No'
      }
    },
    NameQuote (value) {
      if (value === 7746) {
        return 'RC de Empresas y Servicios'
      } else if (value === 7747) {
        return 'RC de Construcción'
      } else {
        return 'RC de Construcción para MOP'
      }
    },
    GetProposal (value) {
      if (!value) {
        return 'No tiene'
      } else {
        return value
      }
    },
    GetPolice (value) {
      if (!value) {
        return 'No tiene'
      } else {
        return value
      }
    },
    GetTipoDePago (value) {
      if (value === 10) {
        return 'Mensual'
      } else {
        return 'Anual'
      }
    },
    getFechaPago (value) {
      if (value) {
        return value
      } else {
        return 'Sin pagar'
      }
    },
    GetPagado (value) {
      if (!value) {
        return 'No'
      } else {
        return 'Si'
      }
    },
    GetConciliado (value) {
      if (!value) {
        return 'No'
      } else {
        return 'Si'
      }
    },
    getRCStatus (state) {
      if (state) {
        if (state === 'not_processed') {
          return 'No procesado'
        }
        if (state === 'processed') {
          return 'Procesado'
        }
        if (state === 'quote') {
          return 'Cotización'
        }
        if (state === 'cancelled') {
          return 'Cancelado'
        }
        if (state === 'proposal') {
          return 'Propuesta'
        }
      } else {
        return 'Sin estado'
      }
    },
    GenerateRCEmpresa () {
      if (
        !this.QuoteEmpre.request_type
      ) {
        this.$store.commit('setAlertMessage', { error: 'El campo tipo de solicitud es obligatorio' })
      }
    },
    confirmSendEmail () {
      console.log('entra en send email')
      this.$bvModal
        .msgBoxConfirm('¿Esta seguro de enviar correo al Cliente de la Cotización?', {
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
            setTimeout(() => this.SendEmail(), 500)
          }
        })
    },
    async SendEmail () {
      try {
        const id = this.Quote.id
        const resp = await this.$simpleeApi.post('/send_quote', {
          entity_id: id,
          entity_type: 'RC'
        })
        if (resp.data) {
          this.messageError = 'Se ha Enviado el Correo Exitosamente'
          this.$refs['modal-alert'].show()
        }
      } catch (error) {
        if (error) {
          this.messageError = error
        }
        this.$store.commit('setAlertMessage', error)
        this.$refs['modal-alert2'].show()
      }
    },
    closeRequestAlertModal () {
      this.$refs['modal-alert'].hide()
    },
    closeRequestAlertModal2 () {
      this.$refs['modal-alert2'].hide()
    }
  }
}
</script>

<style lang="scss" scoped>
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
  &.resuelto {
    background-color: #9dd345;
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
  &.sin_contactar {
    background-color: #6980ad;
  }
}
</style>
<style lang="scss">
h2,
h3,
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
  width: 95%;
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
  color: #acacac;
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
button {
  &.active {
    color: #000000;
    border-bottom: 3px solid #acacac;
  }
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
  padding-right: 25px;
  padding-left: 25px;
}

.signup-img,
.signup-form {
  width: 100%;
}

.signup-form-Request {
  width: 30%;
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
  margin-left: 20px;
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
  padding: 23px 20px 50px 20px;
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
  width: 50%;
  padding: 2px 15px !important;
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
  position: relative !important;
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
  font-size: 17px;
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
.loader2 {
  right: 0px;
  top: -10px;
  position: absolute;
}
@media (max-width: 1236px) {
  .loader {
    right: 9px;
    top: 45px;
  }
  .loader2 {
    right: 0px;
    top: -10px;
  }
}
@media (max-width: 1080px) {
  .loader {
    right: 9px;
    top: 45px;
  }
  .loader2 {
    right: 0px;
    top: -10px;
  }
}
@media (max-width: 960px) {
  .loader {
    right: 9px;
    top: 45px;
  }
  .loader2 {
    right: 0px;
    top: -10px;
  }
}
@media (max-width: 904px) {
  .loader {
    right: 9px;
    top: 45px;
  }
  .loader2 {
    right: 0px;
    top: -10px;
  }
}
@media (max-width: 904px) {
  .loader {
    right: 9px;
    top: 45px;
  }
  .loader2 {
    right: 0px;
    top: -10px;
  }
}
@media (max-width: 768px) {
  .loader {
    right: 9px;
    top: 45px;
  }
  .loader2 {
    right: 0px;
    top: -10px;
  }
}
.w-16 {
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
  color: #acacac;
}

input[type="radio"] {
  visibility: visible !important;
}
input[type="radio"]:checked ~ .check {
  border: 1px solid #ff6801 !important;
}
input[type="radio"]:checked ~ .check::before {
  background: #ff6801 !important;
}
.w-33 {
  width: 33%;
}
.aviso {
  font-size: 16px;
  font-weight: 600;
  text-decoration: underline;
}
.bordertopp {
  border-top: 1px solid #222;
  padding-top: 10px;
}
</style>
