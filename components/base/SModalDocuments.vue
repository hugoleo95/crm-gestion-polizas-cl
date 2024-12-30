<template>
  <div>
    <b-modal
      v-model="localShow"
      title="Crear/Simplee"
      modal-class="draggable-modal"
      header-class="border-bottom-0"
      size="lg"
      body-class="padding-modal"
      scrollable
      content-class="border-0 radius"
      no-close-on-backdrop
      @hidden="$emit('hidde')"
    >
      <template #modal-header="{}">
        <div
          class="max-size pl-3 pt-5"
          @mousedown="dragModal"
        >
          <h5>
            <fa-icon
              :icon="['fas', 'edit']"
              class="text-primary mr-2"
            /><b>Documentos</b>/ Simplee
          </h5>
          <p>Manten presionado para arrastrar el modal</p>
        </div>
      </template>
      <template #modal-footer="{}">
        <!-- <b-button
        class="text-white py-2 px-3 mr-2"
        size="sm"
        variant="danger"
        @click="saveLead()"
      >
        Eliminar lead
      </b-button> -->
        <b-button
          v-if="activesave"
          class="text-white py-2 px-3 mr-2"
          size="sm"
          variant="primary"
          @click="saveLead()"
        >
          Guardar y continuar
        </b-button>
        <b-button
          class="text-white p-2 px-3"
          size="sm"
          variant="secondary"
          @click="cancelLead()"
        >
          Cerrar
        </b-button>
      </template>
      <div class="d-flex justify-content-between align-items-center">
        <div class="menu d-flex">
          <button
            v-if="documents.length > 0"
            :class="[{ active: optiond === 'list' }, 'mr-3']"
            style="font-size: 1.15rem"
            @click="optiond = 'list'"
          >
            Documentos
          </button>
          <button
            :class="[
              { active: optiond === 'crear' || documents.length === 0 },
              'mr-3',
            ]"
            style="font-size: 1.15rem"
            @click="optiond = 'crear'"
          >
            Nuevo
          </button>
        </div>
        <button
          v-if="optiond === 'crear' || documents.length === 0"
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
        v-if="optiond === 'list' && documents.length > 0"
        class="documents"
      >
        <div
          v-for="(_document, key) in documents"
          v-show="
            (pag_document - 1) * NUM_RESULTS_DOCUMENT <= key &&
            pag_document * NUM_RESULTS_DOCUMENT > key
          "
          :key="key"
        >
          <b-button
            v-b-toggle="`document-${key}`"
            variant="outline-secondary"
            block
            class="mb-3"
          >
            {{ documents[key].title || "-" }}
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
                    v-if="documents[key].document_url"
                    target="_blank"
                    :href="documents[key].document_url"
                    class="doc-title"
                  >{{ documents[key].title }}</a>
                  <a
                    v-else-if="documents[key].document"
                    target="_blank"
                    :href="documents[key].document"
                    class="doc-title"
                  >{{ documents[key].title }}</a>
                  <b-form-file
                    v-else
                    :state="Boolean(documents[key].document)"
                    :placeholder="documents[key].title || 'Suba un archivo'"
                    drop-placeholder="Arrastre un archivo hasta aquí..."
                    @input="setDocumentFile({ key, file: $event })"
                  />
                </td>
              </tr>
              <tr v-if="$store.state.localStorage.user.role !== 'EXT_KAM'">
                <th>Eliminar</th>
                <td
                  co
                  lspan="2"
                >
                  <b-button
                    block
                    @click="deleteDocument(documents[key].id, key)"
                  >
                    Eliminar este documento
                  </b-button>
                </td>
              </tr>
            </s-form-table>
          </b-collapse>
        </div>
        <div
          v-if="documents && documents.length > 0"
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
          <strong class="text-secondary">&nbsp;&nbsp;{{ CountPageDocument }} -
            {{ documents.length }} Documentos&nbsp;&nbsp;</strong>
          <b-button
            v-show="
              (pag_document * NUM_RESULTS_DOCUMENT) / documents.length < 1
            "
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
      </div>
      <div
        v-else
        class="documents"
      >
        <div
          v-for="(_document, key) in documentsnew"
          :key="key"
        >
          <b-button
            v-b-toggle="`document-${key}`"
            variant="outline-secondary"
            block
            class="mb-3"
          >
            {{ documentsnew[key].title || "-" }}
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
                    v-if="documentsnew[key].document_url"
                    target="_blank"
                    :href="documentsnew[key].document_url"
                    class="doc-title"
                  >{{ documentsnew[key].title }}</a>
                  <a
                    v-else-if="documentsnew[key].document"
                    target="_blank"
                    :href="documentsnew[key].document"
                    class="doc-title"
                  >{{ documentsnew[key].title }}</a>
                  <b-form-file
                    v-else
                    :state="Boolean(documentsnew[key].document)"
                    :placeholder="documentsnew[key].title || 'Suba un archivo'"
                    drop-placeholder="Arrastre un archivo hasta aquí..."
                    @input="setDocumentFile({ key, file: $event })"
                  />
                </td>
              </tr>
              <tr v-if="$store.state.localStorage.user.role !== 'EXT_KAM'">
                <th>Eliminar</th>
                <td
                  co
                  lspan="2"
                >
                  <b-button
                    block
                    @click="deleteDocument2(key)"
                  >
                    Eliminar este documento
                  </b-button>
                </td>
              </tr>
            </s-form-table>
          </b-collapse>
        </div>
        <div class="text-center">
          <InputMassive
            type="document"
            title="Arrastre varios documentos a la vez para la carga masiva"
            @addDocument="setDocumentFile({ file: $event })"
          />
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import InputMassive from "@/components/InputMassiveProducts";
import SFormTable from "@/components/base/SFormTable.vue";
import states from "~/static/states.json";
import products from "~/static/products.json";
import productsmx from "~/static/productsmx.json";
import ReasonContact from "~/static/reason_contact.json";
export default {
  components: {
    InputMassive,
    SFormTable,
  },
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    idproduct: {
      type: Number,
      default: 0,
    },
    idrequest: {
      type: Number,
      default: 0,
    },
    idlead: {
      type: Number,
      default: 0,
    },
    value: {
      type: Object,
      default: () => ({
        documents: [{ document: null }],
        products: [{}],
        diagnostics: [{}],
      }),
    },
    Documentsdata: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: "Crear",
    },
    requestsi: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      clonedLead: null,
      states: states.filter(({ value }) => value !== "sin_estado"),
      optiond: "list",
      commission: 0,
      documents: [],
      documentsnew: [{}],
      activesave: false,
      idgene: 0,
      urldocument: "",
      channelreferido: "",
      productsWithError: [],
      NamesCL: {
        rut: "Rut",
        comuna: "Comuna",
      },
      NamesMX: {
        rut: "Rfc",
        comuna: "Colonia",
      },
      Names: "",
      optionsPerson: [
        { value: "legal_person", text: "Jurídica" },
        { value: "natural_person", text: "Natural" },
      ],
      optionsPersonCL: [
        { value: "legal_person", text: "Jurídica" },
        { value: "natural_person", text: "Natural" },
      ],
      optionsPersonMX: [
        { value: "legal_person", text: "Moral" },
        { value: "natural_person", text: "Fisica" },
      ],
      optionsPriority: [
        { value: null, text: "Sin prioridad" },
        { value: "baja", text: "Baja" },
        { value: "media", text: "Media" },
        { value: "alta", text: "Alta" },
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
      products: Object.values(products).reduce(
        (acc, curr) => [...acc, ...curr],
        []
      ),
      productsmx: Object.values(productsmx).reduce(
        (acc, curr) => [...acc, ...curr],
        []
      ),
      reason_contact: ReasonContact,
    };
  },
  computed: {
    channels () {
      return this.$store.state.leads.channels.map(({ id, name }) => ({
        value: id,
        text: name,
      }));
    },
    executives () {
      return this.$store.state.leads.users.map(({ id, email }) => ({
        value: id,
        text: email,
      }));
    },
    CountPageProduct () {
      if (
        this.localLead.products?.length >
        this.NUM_RESULTS_PRODUCTS * this.pag_product
      ) {
        return this.pag_product * this.NUM_RESULTS_PRODUCTS;
      }
      return this.localLead.products?.length || 0;
    },
    CountPageDocument () {
      if (
        this.documents?.length >
        this.NUM_RESULTS_DOCUMENT * this.pag_document
      ) {
        return this.pag_document * this.NUM_RESULTS_DOCUMENT;
      }
      return this.documents?.length ?? 0;
    },
    refferals () {
      return this.$store.state.leads.refferals.map(
        ({ id, name, comision }) => ({
          value: id,
          text: name,
          commission: comision,
        })
      );
    },
    localLead: {
      get () {
        return this.value;
      },
      set (value) {
        this.$emit("input", value);
      },
    },
    localShow: {
      get () {
        return this.show;
      },
      set (value) {
        this.$emit("update:show", value);
      },
    },
    availableOptions () {
      if (process.env.version === "CL") {
        const { products } = this;
        if (typeof this.localLead.product_interest === "undefined") {
          return products;
        } else {
          return products.filter(
            ({ value }) => !this.localLead.product_interest.includes(value)
          );
        }
      } else {
        const { productsmx } = this;
        if (typeof this.localLead.product_interest === "undefined") {
          return productsmx;
        } else {
          return productsmx.filter(
            ({ value }) => !this.localLead.product_interest.includes(value)
          );
        }
      }
    },
    optionsDocuments () {
      return this.localLead.products
        ? this.localLead.products
          .filter((product) => product.id)
          .map((product) => {
            return {
              value: product.id,
              text: `${product.name || ""} ${product.nro_poliza || ""} ${product.company || ""
                }`,
            };
          })
        : [];
    },
  },
  watch: {
    localLead: {
      handler (value) {
        console.log(value);
      },
    },
    "localLead.channel": {
      immediate: true,
      handler (value) {
        const channelReffered = this.channels.find(
          ({ text }) => text === "Referido"
        );

        if (value !== channelReffered?.value) {
          this.localLead.referred = null;
        }
      },
    },
    "localLead.referred": {
      immediate: true,
      handler (value) {
        if (value) {
          const [referred] = this.refferals.filter(
            ({ value }) => value === this.localLead.referred
          );
          this.commission = referred.commission;
        } else {
          this.commission = 0;
        }
      },
    },
    "localLead.products": {
      handler (value) {
        this.documents?.forEach((doc, i) => {
          const exists = value.find((prod) => prod.id === doc.product);
          if (!exists) {
            this.documents[i].product = null;
          }
        });
      },
    },
    "localLead.rut": {
      handler () {
        this.getLeadsWithSameRut();
      },
    },
    "localLead.state": {
      handler (val) {
        if (val !== "cliente_cerrado") {
          this.productsWithError = [];
        }
      },
    },
    Documentsdata: {
      handler (val) {
        this.datadocument(val);
      },
    },
    selectedDuplicate (id) {
      if (id) {
        this.$router.push({ path: "/leads", query: { id } });
      }
    },
    option (val) {
      if (val === "products" && !this.productsLoaded) {
        this.getLeadProducts();
      }
      if (val === "documents" && !this.documentsLoaded) {
        this.getLeadDocuments();
      }
    },
  },
  created () {
    if (this.requestsi) {
      this.optiond = "crear";
    }
    this.getLeadDocuments();
    this.duplicatedRutLeads = this.formatDuplicates(this.localLead.duplicates);
    if (process.env.version === "CL") {
      this.channelreferido = 6;
      this.Names = this.NamesCL;
      this.optionsPerson = this.optionsPersonCL;
      this.urldocument = "/formatoproductosimplee.xlsx";
    } else {
      this.channelreferido = 24;
      this.Names = this.NamesMX;
      this.optionsPerson = this.optionsPersonMX;
      this.urldocument = "/formatoproductosimpleemx.xlsx";
    }
  },
  methods: {
    datadocument (val) {
      this.documents = val;
    },
    dragModal (e) {
      const modal = document.querySelector(".draggable-modal");
      const position = modal.getBoundingClientRect();

      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);

      const prevX = e.clientX;
      const prevY = e.clientY;
      function mouseMove (e) {
        document.querySelector(".max-size").style.cursor = "grabbing";
        const newX = prevX - e.clientX;
        const newY = prevY - e.clientY;
        modal.style.left = position.left - newX + "px";
        modal.style.top = position.top - newY + "px";
      }
      function mouseUp (e) {
        document.querySelector(".max-size").style.cursor = "grab";
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", mouseUp);
      }
    },
    async getLeadProducts () {
      if (this.localLead.id) {
        this.loadingSection = true;
        try {
          const products = await this.$simpleeApi.get(
            `/lead/${this.value.id}/product/`
          );
          this.localLead = {
            ...this.localLead,
            products: products.data.results,
          };
          this.productsLoaded = true;
        } catch (error) {
          this.$store.commit("setAlertMessage", error.response.data);
          this.product = "general";
        }
        this.loadingSection = false;
      } else {
        this.localLead = {
          ...this.localLead,
          products: this.localLead.products ?? [],
        };
      }
    },
    async getLeadDocuments () {
      if (this.idproduct) {
        this.idgene = this.idproduct;
        try {
          const { data } = await this.$simpleeApi.get(
            `/product/${this.idgene}/document`
          );
          console.log(data.results);
          this.documents = data.results;
          // this.openExistingLead(data)
        } catch (error) {
          this.$store.commit("setAlertMessage", error.response.data);
        }
      } else if (this.idrequest) {
        this.idgene = this.idrequest;
        try {
          const { data } = await this.$simpleeApi.get(
            `/request/${this.idgene}/document`
          );
          console.log(data.results);
          this.documents = data.results;
          // this.openExistingLead(data)
        } catch (error) {
          this.$store.commit("setAlertMessage", error.response.data);
        }
      } else if (this.idlead) {
        this.idgene = this.idlead;
        try {
          const { data } = await this.$simpleeApi.get(
            `/lead/${this.idgene}/document`
          );
          console.log(data.results);
          this.documents = data.results;
          // this.openExistingLead(data)
        } catch (error) {
          this.$store.commit("setAlertMessage", error.response.data);
        }
      }
    },
    getDoc ($event) {
      this.$emit("save-document-only", $event);
    },
    deleteProduct (key) {
      this.localLead.products = this.localLead.products?.filter(
        (_, index) => index !== key
      );
    },
    deleteDocument (id, key) {
      this.$bvModal
        .msgBoxConfirm("¿Desea eleminar este documento?", {
          title: "Confirmar",
          titleClass: "mdtitle",
          size: "md",
          buttonSize: "md",
          cancelVariant: "btn text-white p-2 px-3 btn-secondary",
          okVariant: "btn text-white p-2 px-3 btn-danger",
          okTitle: "Si",
          cancelTitle: "No",
          contentClass: "border-0 radius",
          bodyClass: "pxmodal",
          headerClass: "pdmodal border-bottom-0",
          footerClass: "pdmodal border-top-0",
          centered: true,
        })
        .then((value) => {
          if (value) {
            if (this.idproduct) {
              this.$emit("delete-documents", id);
              this.documents = this.documents.filter(
                (_, index) => index !== key
              );
            } else if (this.idrequest) {
              this.$emit("delete-documents2", id);
              this.documents = this.documents.filter(
                (_, index) => index !== key
              );
            } else if (this.idlead) {
              this.$emit("delete-documents3", id);
              this.documents = this.documents.filter(
                (_, index) => index !== key
              );
            }
          }
        });
    },
    deleteDocument2 (key) {
      this.documentsnew = this.documentsnew.filter((_, index) => index !== key);
    },
    deleteDiagnostic (key) {
      this.localLead.diagnostics = this.localLead.diagnostics.filter(
        (_, index) => index !== key
      );
    },
    addProduct (register) {
      if (register) {
        this.localLead.products?.push({ ...register });
      } else {
        this.localLead.products?.push({
          line: null,
          name: "Nuevo Producto",
          company: null,
        });
      }
    },
    addDocument (document = {}) {
      this.documentsnew.push(document);
    },
    addDiagnostic () {
      this.localLead.diagnostics.push({ insurances_contrated: [] });
    },
    saveLead () {
      if (this.idproduct) {
        this.$emit("save-documents", this.documentsnew);
      } else if (this.idrequest) {
        this.$emit("save-documents2", this.documentsnew);
      } else if (this.idlead) {
        this.$emit("save-documents3", this.documentsnew);
      }
    },
    cancelLead () {
      this.$emit("cancel-lead");
    },
    newItem () {
      this.addDocument();
    },
    setDocumentFile ({ key = null, file }) {
      const reader = new FileReader();
      reader.onload = () => {
        if (key === null) {
          this.addDocument({
            document64: reader.result,
            title: file.name,
          });
        } else {
          this.documentsnew[key].document64 = reader.result;
          this.documentsnew[key].title = file.name;
        }
        this.activesave = true;
      };
      reader.onerror = (error) => {
        this.$store.commit("setAlertMessage", {
          error:
            "Hubo un error al cargar el archivo, por favor intentalo de nuevo.",
        });
        console.log({ error });
      };

      this.loadingDocument = true;
      reader.readAsDataURL(file);
      this.loadingDocument = false;
    },
    setChannel (value) {
      this.localLead.channel = value;
      this.localLead.referred = null;
    },
    setReasonContact (value) {
      this.localLead.contact_reason = value;
    },
    getTag (tag) {
      const { products } = this;
      return products.find(({ value }) => value === tag).text;
    },
    formatDuplicates (data) {
      if (data && data.length > 0) {
        return data
          .filter((lead) => lead.id !== this.localLead.id)
          .map((lead) => {
            return {
              Value: lead.id,
              text: `${lead.name || ""} ${lead.last_name || ""} ${lead.razon_social || ""
                }`,
            };
          });
      } else {
        return [];
      }
    },
    setProductsErrors () {
      this.productsWithError = [
        ...this.localLead.products.filter((p) => {
          return (
            !p.comision ||
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
          );
        }),
      ].map((p) => this.localLead.products.indexOf(p));
    },
    removeProductFromErrors (key) {
      this.productsWithError = this.productsWithError.filter((p) => p !== key);
    },
  },
};
</script>
<style lang="scss" scoped>
.tb-padding {
  padding: 13px;
}
.text-base {
  font-family: "Rubik";
  font-style: normal;
  font-size: 14px;
  line-height: 17px;
  color: #000000;
}
.title-text {
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
}
.text-val {
  padding: 0.5rem 1rem;
  font-weight: 300 !important;
  line-height: 18px !important;
}
.pd-val {
  padding: 0.8rem 1rem;
}
.nav-link {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-family: "Rubik";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #d3d3d3;
  cursor: pointer;
}
.nav-link.active {
  color: #000000;
  background-color: transparent;
}
.form-input {
  border: 1px solid #505755;
  border-radius: 8px;
}
.ml-2 {
  margin-left: 5px;
}
.pl-0 {
  padding-left: 0px !important;
}
.radius {
  border-radius: 6px;
}
.btn-new {
  padding: 10px 12px !important;
  font-size: 14px !important;
}
</style>
