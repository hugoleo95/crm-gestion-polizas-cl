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
            <div class="menu_request d-flex w-35">
              <h2>
                <fa-icon
                  :icon="['fas', 'edit']"
                  class="text-primary mr-2"
                />Crear Cotización
              </h2>
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
                  <strong>Cargando...</strong>
                </div>
              </div>
              <div
                v-else
                class="signup-form-Client"
              >
                <form
                  method="POST"
                  class="register-form"
                  id="register-form"
                >
                  <div class="w-100 d-flex">
                    <div class="w-50">
                      <h4>
                        <fa-icon
                          :icon="['fas', 'address-book']"
                          class="text-primary mr-2"
                        /> Datos de la cotización
                      </h4>
                    </div>
                  </div>
                  <div class="form-row mtrow d-flex flex-column menu_request">
                    <div class="form-group-request w-100 d-flex flex-column justify-content-center align-items-center">
                      <span>Seleccione el tipo de Responsabilidad Civil que necesita</span>
                      <div class="d-flex w-100 justify-content-center align-items-center mt-4">
                        <div class="menu w-33 d-flex flex-row justify-content-center align-items-center">
                          <button
                            :class="[{active:optionrc === 'rcempresa'}, 'mr-3']"
                            style="font-size: 1rem"
                            @click.prevent="optionrc = 'rcempresa'"
                          >
                            RC de empesas y servicios
                          </button>
                        </div>
                        <div class="menu w-33 d-flex flex-row justify-content-center align-items-center">
                          <button
                            :class="[{active:optionrc === 'rccon'}, 'mr-3']"
                            style="font-size: 1rem"
                            @click.prevent="optionrc = 'rccon'"
                          >
                            RC de construcción
                          </button>
                        </div>
                        <div class="menu w-33 d-flex flex-row justify-content-center align-items-center">
                          <button
                            :class="[{active:optionrc === 'rcmop'}, 'mr-3']"
                            style="font-size: 1rem"
                            @click.prevent="optionrc = 'rcmop'"
                          >
                            RC de construcción para MOP
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="optionrc === 'rcempresa'">
                    <div class="form-row mtrow">
                      <div class="form-group-request">
                        <label
                          class="text-base w-100 d-flex flex-row"
                          for="name"
                        >
                          Actividad de tu empresa :
                          <tool-tip
                            class="tooltiposition ml-2"
                            text="Ingresa el RUT para buscar los datos de la empresa en SII"
                          />
                        </label>
                        <div class="form-select">
                          <b-form-select
                            id="optionsPerson"
                            v-model="QuoteEmpre.company_occupation"
                            class="form-control form-input"
                            :options="RC_options.activitiesOptions"
                          />
                        </div>
                      </div>
                      <div
                        v-if="QuoteEmpre.company_occupation === '1000'"
                        class="form-group-request"
                      >
                        <label
                          class="text-base w-100 d-flex flex-row"
                          for="city"
                        >Otra actividad: </label>
                        <input
                          v-model="QuoteEmpre.customCompanyActivity"
                          class="form-control form-input"
                          type="text"
                          id="razon_social"
                          placeholder="escriba la otra actividad"
                        />
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="father_name"
                        >Año de constitución:</label>
                        <input
                          v-model="QuoteEmpre.year_of_incorporation"
                          class="form-control form-input"
                          type="number"
                          id="razon_social"
                          placeholder="eje: 2020"
                        />
                      </div>
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="father_name"
                        >N° de trabajadores: :</label>
                        <div class="form-select">
                          <b-form-select
                            id="optionsPerson"
                            v-model="QuoteEmpre.nro_contractors"
                            class="form-control form-input"
                            :options="RC_options.contractorsNum"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="name"
                        >Ingreso anual 2022 (UF): </label>
                        <input
                          v-model="QuoteEmpre.current_annual_income"
                          class="form-control form-input"
                          type="text"
                          id="name"
                          placeholder="Ej: 6000"
                        />
                      </div>
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="father_name"
                        >Ingreso proyectado 2023 (UF): </label>
                        <input
                          v-model="QuoteEmpre.projected_annual_income"
                          class="form-control form-input"
                          type="text"
                          id="last_name"
                          placeholder="Ej: 6000"
                        />
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="name"
                        >Inicio de vigencia: </label>
                        <input
                          v-model="QuoteEmpre.startDate"
                          class="form-control form-input"
                          type="date"
                          id="email"
                        />
                      </div>
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="father_name"
                        >Término de vigencia :</label>
                        <input
                          v-model="QuoteEmpre.endDate"
                          class="form-control form-input"
                          type="date"
                          id="phone"
                        />
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="name"
                        >Monto asegurado (UF): </label>
                        <input
                          v-model.number="QuoteEmpre.insuredAmount"
                          type="number"
                          class="form-control form-input"
                          id="address"
                          placeholder="Ej: 1000"
                        />
                      </div>
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="father_name"
                        >Modalidad de trabajo: </label>
                        <div class="form-select">
                          <b-form-select
                            class="form-control form-input"
                            v-model="QuoteEmpre.work_modality"
                            :options="RC_options.workModality"
                            id="user"
                          >
                          </b-form-select>
                        </div>
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group-request">
                        <div class="w-75">
                          <label
                            class="text-base"
                            for="name"
                          >Tiene Vehiculos: </label>
                          <div class="d-flex justify-content-center align-items-center">
                            <div class="d-flex justify-content-center align-items-center w-50">
                              <span class="mr-3">Si</span>
                              <input
                                v-model.number="QuoteEmpre.has_vehicles"
                                value="si"
                                type="radio"
                                class="form-control form-input"
                                id="address"
                              />
                            </div>
                            <div class="d-flex justify-content-center align-items-center w-50">
                              <span class="mr-3">No</span>
                              <input
                                v-model.number="QuoteEmpre.has_vehicles"
                                type="radio"
                                value="no"
                                class="form-control form-input"
                                id="address"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="form-group-request">
                        <div class="w-75">
                          <label
                            class="text-base"
                            for="name"
                          >Tienen equipos móviles: </label>
                          <div class="d-flex justify-content-center align-items-center">
                            <div class="d-flex justify-content-center align-items-center w-50">
                              <span class="mr-3">Si</span>
                              <input
                                v-model.number="QuoteEmpre.has_mobile_equipment"
                                value="si"
                                type="radio"
                                class="form-control form-input"
                                id="address"
                              />
                            </div>
                            <div class="d-flex justify-content-center align-items-center w-50">
                              <span class="mr-3">No</span>
                              <input
                                v-model.number="QuoteEmpre.has_mobile_equipment"
                                type="radio"
                                value="no"
                                class="form-control form-input"
                                id="address"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="QuoteEmpre.has_vehicles"
                      class="form-row"
                    >
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="city"
                        >Cantidad de vehículos :</label>
                        <div class="form-select">
                          <b-form-select
                            class="form-control form-input"
                            v-model="QuoteEmpre.nro_vehicles"
                            :options="RC_options.vehiclesQuantityOptions"
                            id="user"
                          >
                          </b-form-select>
                        </div>
                      </div>
                    </div>
                    <div class="form-row mt-3">
                      <div class="w-100 d-flex justify-content-center align-items-center">
                        <span class="aviso">Para realizar la cotización el cliente no debe haber tenido siniestros de RC en los ultimos 5 años</span>
                      </div>
                    </div>
                    <div
                      v-if="QuoteEmpre.company_occupation == '27480006200'"
                      class="mt-3 w-75 form-row"
                    >
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="name"
                        >Transportan o almacenan material peligroso: </label>
                        <div class="d-flex justify-content-center align-items-center">
                          <div class="d-flex justify-content-center align-items-center w-50">
                            <span class="mr-3">Si</span>
                            <input
                              v-model.number="QuoteEmpre.high_voltage"
                              value="si"
                              type="radio"
                              class="form-control form-input"
                              id="address"
                            />
                          </div>
                          <div class="d-flex justify-content-center align-items-center w-50">
                            <span class="mr-3">No</span>
                            <input
                              v-model.number="QuoteEmpre.high_voltage"
                              type="radio"
                              value="no"
                              class="form-control form-input"
                              id="address"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="QuoteEmpre.company_occupation == '27480005800'"
                      class="mt-3 w-75 form-row"
                    >
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="name"
                        >Realizan limpieza en altura: </label>
                        <div class="d-flex justify-content-center align-items-center">
                          <div class="d-flex justify-content-center align-items-center w-50">
                            <span class="mr-3">Si</span>
                            <input
                              v-model.number="QuoteEmpre.high_cleanup"
                              value="si"
                              type="radio"
                              class="form-control form-input"
                              id="address"
                            />
                          </div>
                          <div class="d-flex justify-content-center align-items-center w-50">
                            <span class="mr-3">No</span>
                            <input
                              v-model.number="QuoteEmpre.high_cleanup"
                              type="radio"
                              value="no"
                              class="form-control form-input"
                              id="address"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="QuoteEmpre.company_occupation === '27480004000' || QuoteEmpre.company_occupation === '27480005700'"
                      class="mt-3 w-75 form-row"
                    >
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="name"
                        >Realizan trabajos en instalaciones electricas de alta tension: </label>
                        <div class="d-flex justify-content-center align-items-center">
                          <div class="d-flex justify-content-center align-items-center w-50">
                            <span class="mr-3">Si</span>
                            <input
                              v-model.number="QuoteEmpre.high_voltage"
                              value="si"
                              type="radio"
                              class="form-control form-input"
                              id="address"
                            />
                          </div>
                          <div class="d-flex justify-content-center align-items-center w-50">
                            <span class="mr-3">No</span>
                            <input
                              v-model.number="QuoteEmpre.high_voltage"
                              type="radio"
                              value="no"
                              class="form-control form-input"
                              id="address"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="mt-5 w-100 d-flex justify-content-center align-items-center">
                      <b-button
                        @click="GenerateRCEmpresa()"
                        class="text-white shadow-dropdow btn-new ml-4"
                        variant="primary"
                      >
                        Generar Precio
                      </b-button>
                    </div>
                  </div>
                  <div v-if="optionrc === 'rccon'">
                    <div class="form-row mtrow">
                      <div class="form-group-request">
                        <label
                          class="text-base w-100 d-flex flex-row"
                          for="name"
                        >
                          {{ QuoteCont.rut }}* :
                          <tool-tip
                            class="tooltiposition ml-2"
                            text="Ingresa el RUT para buscar los datos de la empresa en SII"
                          />
                        </label>
                        <input
                          v-model="QuoteCont.rut"
                          class="form-control form-input"
                          type="text"
                          id="rut"
                        />
                      </div>
                      <div class="form-group-request">
                        <label
                          class="text-base w-100 d-flex flex-row"
                          for="city"
                        >Persona* :</label>
                        <div class="form-select">
                          <b-form-select
                            disabled
                            id="optionsPerson"
                            v-model="QuoteCont.person"
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
                          v-model="QuoteCont.razon_social"
                          class="form-control form-input"
                          type="text"
                          id="razon_social"
                        />
                      </div>
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="father_name"
                        >Giro* :</label>
                        <input
                          v-model="QuoteCont.giro"
                          class="form-control form-input"
                          type="text"
                          id="father_name"
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
                          v-model="QuoteCont.name"
                          class="form-control form-input"
                          type="text"
                          id="name"
                        />
                      </div>
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="father_name"
                        >Apellido* :</label>
                        <input
                          v-model="QuoteCont.last_name"
                          class="form-control form-input"
                          type="text"
                          id="last_name"
                        />
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="name"
                        >Email:* <a
                            v-if="QuoteCont.email"
                            :href="`https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${QuoteCont.email}`"
                            target="_blank"
                            class="solicitud-btn mb-0 ml-4"
                          >
                            Enviar correo
                            <fa-icon
                              :icon="['fas', 'envelope']"
                              class="text-primary edit-ico mr-2"
                            />
                          </a></label>
                        <input
                          v-model="QuoteCont.email"
                          class="form-control form-input"
                          type="text"
                          id="email"
                        />
                      </div>
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="father_name"
                        >Telefono* :</label>
                        <input
                          v-model="QuoteCont.phone"
                          class="form-control form-input"
                          type="text"
                          id="phone"
                        />
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="name"
                        >Dirección :</label>
                        <input
                          v-model="QuoteCont.address"
                          class="form-control form-input"
                          type="text"
                          id="address"
                        />
                      </div>
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="father_name"
                        >{{ QuoteCont.comuna }} :</label>
                        <input
                          v-model="QuoteCont.comuna"
                          class="form-control form-input"
                          type="text"
                          id="comuna"
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
                            class="form-control form-input"
                            disabled
                            v-model="QuoteCont.user"
                            :options="executives"
                            id="user"
                          >
                          </b-form-select>
                        </div>
                      </div>
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="city"
                        >Numero de trabajadores* :</label>
                        <div class="form-select">
                          <b-form-select
                            class="form-control form-input"
                            disabled
                            v-model="QuoteCont.employee_quantity_choice"
                            :options="employes"
                            id="user"
                          >
                          </b-form-select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="optionrc === 'rcmop'">
                    <div class="form-row mtrow">
                      <div class="form-group-request">
                        <label
                          class="text-base w-100 d-flex flex-row"
                          for="name"
                        >
                          {{ QuoteMop.rut }}* :
                          <tool-tip
                            class="tooltiposition ml-2"
                            text="Ingresa el RUT para buscar los datos de la empresa en SII"
                          />
                        </label>
                        <input
                          v-model="QuoteMop.rut"
                          class="form-control form-input"
                          type="text"
                          id="rut"
                        />
                      </div>
                      <div class="form-group-request">
                        <label
                          class="text-base w-100 d-flex flex-row"
                          for="city"
                        >Persona* :</label>
                        <div class="form-select">
                          <b-form-select
                            disabled
                            id="optionsPerson"
                            v-model="QuoteMop.person"
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
                          v-model="QuoteMop.razon_social"
                          class="form-control form-input"
                          type="text"
                          id="razon_social"
                        />
                      </div>
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="father_name"
                        >Giro* :</label>
                        <input
                          v-model="QuoteMop.giro"
                          class="form-control form-input"
                          type="text"
                          id="father_name"
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
                          v-model="QuoteMop.name"
                          class="form-control form-input"
                          type="text"
                          id="name"
                        />
                      </div>
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="father_name"
                        >Apellido* :</label>
                        <input
                          v-model="QuoteMop.last_name"
                          class="form-control form-input"
                          type="text"
                          id="last_name"
                        />
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="name"
                        >Email:* <a
                            v-if="QuoteMop.email"
                            :href="`https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${QuoteMop.email}`"
                            target="_blank"
                            class="solicitud-btn mb-0 ml-4"
                          >
                            Enviar correo
                            <fa-icon
                              :icon="['fas', 'envelope']"
                              class="text-primary edit-ico mr-2"
                            />
                          </a></label>
                        <input
                          v-model="QuoteMop.email"
                          class="form-control form-input"
                          type="text"
                          id="email"
                        />
                      </div>
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="father_name"
                        >Telefono* :</label>
                        <input
                          v-model="QuoteMop.phone"
                          class="form-control form-input"
                          type="text"
                          id="phone"
                        />
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="name"
                        >Dirección :</label>
                        <input
                          v-model="QuoteMop.address"
                          class="form-control form-input"
                          type="text"
                          id="address"
                        />
                      </div>
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="father_name"
                        >{{ QuoteMop.comuna }} :</label>
                        <input
                          v-model="QuoteMop.comuna"
                          class="form-control form-input"
                          type="text"
                          id="comuna"
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
                            class="form-control form-input"
                            disabled
                            v-model="QuoteMop.user"
                            :options="executives"
                            id="user"
                          >
                          </b-form-select>
                        </div>
                      </div>
                      <div class="form-group-request">
                        <label
                          class="text-base"
                          for="city"
                        >Numero de trabajadores* :</label>
                        <div class="form-select">
                          <b-form-select
                            class="form-control form-input"
                            disabled
                            v-model="QuoteMop.employee_quantity_choice"
                            :options="employes"
                            id="user"
                          >
                          </b-form-select>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div class="w-100 mr-3 mt-4">
              <div
                v-if="loading"
                class="d-flex flex-fill h-100 loading"
              >
                <div class="text-center text-primary pa-5 mx-auto my-auto ">
                  <b-spinner class="align-middle" />
                  <strong>Cargando...</strong>
                </div>
              </div>
              <div
                v-else
                class="signup-form-Client"
              >
                <form
                  method="POST"
                  class="register-form"
                  id="register-form"
                >
                  <div class="w-100 d-flex">
                    <div class="w-50">
                      <h4>
                        <fa-icon
                          :icon="['fas', 'address-book']"
                          class="text-primary mr-2"
                        /> Datos del contacto
                      </h4>
                    </div>
                    <div class="w-100 px-3 text-right cursor-pointer d-flex flex-row justify-content-end">
                      <b-button
                        @click="modalreasigproductedit=true"
                        class="text-white shadow-dropdow btn-new ml-4"
                        variant="primary"
                      >
                        Contacto existente
                      </b-button>
                      <tool-tip
                        class="tooltiposition d-flex align-items-center ml-2"
                        placement="topleft"
                        text="Reasigna otro contacto para esta solicitud"
                        newClass="span-right"
                      />
                    </div>
                  </div>
                  <div class="form-row mtrow">
                    <div class="form-group-request">
                      <label
                        class="text-base w-100 d-flex flex-row"
                        for="name"
                      >
                        {{ Lead.rut }}* :
                        <tool-tip
                          class="tooltiposition ml-2"
                          text="Ingresa el RUT para buscar los datos de la empresa en SII"
                        />
                      </label>
                      <input
                        disabled
                        v-model="Lead.rut"
                        class="form-control form-input"
                        type="text"
                        id="rut"
                      />
                    </div>
                    <div class="form-group-request">
                      <label
                        class="text-base w-100 d-flex flex-row"
                        for="city"
                      >Persona* :</label>
                      <div class="form-select">
                        <b-form-select
                          disabled
                          id="optionsPerson"
                          v-model="Lead.person"
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
                        disabled
                        v-model="Lead.razon_social"
                        class="form-control form-input"
                        type="text"
                        id="razon_social"
                      />
                    </div>
                    <div class="form-group-request">
                      <label
                        class="text-base"
                        for="father_name"
                      >Giro* :</label>
                      <input
                        disabled
                        v-model="Lead.giro"
                        class="form-control form-input"
                        type="text"
                        id="father_name"
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
                        disabled
                        v-model="Lead.name"
                        class="form-control form-input"
                        type="text"
                        id="name"
                      />
                    </div>
                    <div class="form-group-request">
                      <label
                        class="text-base"
                        for="father_name"
                      >Apellido* :</label>
                      <input
                        disabled
                        v-model="Lead.last_name"
                        class="form-control form-input"
                        type="text"
                        id="last_name"
                      />
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group-request">
                      <label
                        class="text-base"
                        for="name"
                      >Email:* <a
                          v-if="Lead.email"
                          :href="`https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${Lead.email}`"
                          target="_blank"
                          class="solicitud-btn mb-0 ml-4"
                        >
                          Enviar correo
                          <fa-icon
                            :icon="['fas', 'envelope']"
                            class="text-primary edit-ico mr-2"
                          />
                        </a></label>
                      <input
                        disabled
                        v-model="Lead.email"
                        class="form-control form-input"
                        type="text"
                        id="email"
                      />
                    </div>
                    <div class="form-group-request">
                      <label
                        class="text-base"
                        for="father_name"
                      >Telefono* :</label>
                      <input
                        disabled
                        v-model="Lead.phone"
                        class="form-control form-input"
                        type="text"
                        id="phone"
                      />
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group-request">
                      <label
                        class="text-base"
                        for="name"
                      >Dirección :</label>
                      <input
                        disabled
                        v-model="Lead.address"
                        class="form-control form-input"
                        type="text"
                        id="address"
                      />
                    </div>
                    <div class="form-group-request">
                      <label
                        class="text-base"
                        for="father_name"
                      >{{ Lead.comuna }} :</label>
                      <input
                        disabled
                        v-model="Lead.comuna"
                        class="form-control form-input"
                        type="text"
                        id="comuna"
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
                          class="form-control form-input"
                          disabled
                          v-model="Lead.user"
                          :options="executives"
                          id="user"
                        >
                        </b-form-select>
                      </div>
                    </div>
                    <div class="form-group-request">
                      <label
                        class="text-base"
                        for="city"
                      >Numero de trabajadores* :</label>
                      <div class="form-select">
                        <b-form-select
                          class="form-control form-input"
                          disabled
                          v-model="Lead.employee_quantity_choice"
                          :options="employes"
                          id="user"
                        >
                        </b-form-select>
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
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Session from '@/mixins/auth'
import RC_options from "~/util/RC_options.json";
export default {
  components: {
  },
  mixins: [Session],
  data () {
    return {
      QuoteEmpre: {},
      QuoteCont: {},
      QuoteMop: {},
      Lead: {},
      optionrc: 'rcempresa',
      RC_options
    }
  },
  computed: {
    ...mapState(['leadsFilters', 'leadFromSocket']),
    ...mapState('leads', ['users', 'channels', 'campanas', 'loadingLeads']),
    ...mapState('localStorage', ['user', 'userPermissions']),
  },
  created () {

  },
  methods: {
    BackQuotes () {
      this.$emit('backlist')
    },
    GenerateRCEmpresa () {
      if (
        !this.QuoteEmpre.request_type
      ) {
        this.$store.commit('setAlertMessage', { error: 'El campo tipo de solicitud es obligatorio' })
        return
      }
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
</style>
