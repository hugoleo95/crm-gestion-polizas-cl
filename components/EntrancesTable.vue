<template>
  <div class="main-container">
    <h4>Administrar Compañias</h4>
    <div class="table">
      <div
        :class="[
          name === 'Compañias' || name === 'campañas' ? 'rowchannels' : 'row',
        ]"
      >
        <h5 v-if="name === 'campañas'">slug</h5>
        <h5 v-if="name === 'campañas'">
          {{ name }}
        </h5>
        <h5>
          {{
            name === "Compañias" || name === "campañas" ? "Canal" : "Nombre"
          }}
        </h5>
        <h5 v-if="name !== 'campañas'">
          {{ name === "Compañias" ? "ID" : "Descripcion" }}
        </h5>
        <h5 class="text-center">Acciones</h5>
        <img
          v-if="!creating"
          class="add"
          :src="require(`~/assets/icons/add_icon.svg`)"
          @click="setCreating(true)"
        />
      </div>
      <div v-if="creating" class="row">
        <input
          v-if="name === 'campañas'"
          v-model="newItem.name"
          type="text"
          placeholder="Nombre de la campaña"
        />
        <select v-if="name === 'campañas'" v-model="newItem.channel">
          <option v-for="chan in channelss" :key="chan.id" :value="chan.id">
            {{ chan.name }}
          </option>
        </select>
        <input
          v-if="name !== 'campañas'"
          v-model="newItem.name"
          type="text"
          :placeholder="
            name === 'Compañias' || name === 'campañas'
              ? 'Nombre del canal'
              : 'Nombre y apellido'
          "
        />
        <input
          v-if="name === 'Compañias'"
          v-model="newItem.description"
          type="text"
          placeholder="Agregar descripcion"
        />
        <input
          v-else-if="name === 'referidos'"
          v-model="newItem.comision"
          type="number"
          placeholder="Agregar UF"
        />
        <div class="actions-container">
          <img
            :src="require(`~/assets/icons/confirm_icon.svg`)"
            @click="sendNewItem"
          />
          <img
            :src="require(`~/assets/icons/delete_icon.svg`)"
            @click="confirmDelete(null)"
          />
        </div>
      </div>
      <div v-if="val.length > 0">
        <div
          v-for="row in computedValue"
          :key="row.id"
          :class="[
            name === 'Compañias' || name === 'campañas' ? 'rowchannels' : 'row',
          ]"
        >
          <p v-if="name === 'campañas'">
            {{ row.slug }}
          </p>
          <input
            v-if="editing === row.id"
            v-model="newItem.name"
            type="text"
            :placeholder="
              name === 'Compañias' || name === 'campañas'
                ? 'Nombre del canal'
                : 'Nombre y apellido'
            "
          />
          <p v-else>
            {{ row.name }}
          </p>
          <input
            v-if="name === 'Compañias' && editing === row.id"
            v-model="newItem.description"
            type="text"
            placeholder="Agregar descripcion"
          />
          <select
            v-if="name === 'campañas' && editing === row.id"
            v-model="newItem.channel"
          >
            <option v-for="chan in channelss" :key="chan.id" :value="chan.id">
              {{ chan.name }}
            </option>
          </select>
          <input
            v-else-if="name === 'referidos' && editing === row.id"
            v-model="newItem.comision"
            type="number"
            placeholder="Agregar UF"
          />
          <div v-else>
            <p v-if="name === 'campañas'">
              {{ getLeadChannel(row.channel) }}
            </p>
            <p v-else-if="name === 'Compañias'">
              {{ row.id }}
            </p>
            <p v-else>
              {{ row.description || `UF ${row.comision}` }}
            </p>
          </div>
          <div class="actions-container">
            <img
              v-if="editing === row.id"
              :src="require(`~/assets/icons/confirm_icon.svg`)"
              @click="sendNewItem(row.id)"
            />
            <img
              v-else
              :src="require(`~/assets/icons/edit_icon.svg`)"
              @click="setEditing(row.id)"
            />
            <img
              :src="require(`~/assets/icons/delete_icon.svg`)"
              @click="confirmDelete(row)"
            />
          </div>
        </div>
      </div>
    </div>
    <p class="more" @click="more = !more">
      {{ more ? "Ver menos" : `Ver mas (${val.length})` }}
    </p>
    <b-modal v-model="error" size="sm" centered title="Ha ocurrido un error!">
      <p class="my-4">Todos los campos son obligatorios</p>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    val: {
      type: Array,
      required: true,
    },
    channels: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      error: false,
      more: false,
      creating: false,
      editing: null,
      channelss: {},
      newItem: {},
    };
  },
  computed: {
    computedValue() {
      const [a, b, c] = this.val;
      if (this.more) {
        return this.val;
      } else {
        return [a, b, c];
      }
    },
  },
  created() {
    this.formatechannels();
  },
  methods: {
    formatechannels() {
      if (this.channels) {
        let channles = this.channels;
        for (let j = 0; j < this.channels.length; j++) {
          channles = this.channels.filter((item) => item.is_new === true);
        }
        this.channelss = channles;
      } else {
        this.channelss = this.channels;
      }
    },
    getLeadChannel(channel) {
      const channelObject = this.channels.find(({ id }) => id === channel);
      if (channelObject) {
        return channelObject.name;
      }
      return "Canal no creado";
    },
    setCreating(bool = false) {
      this.newItem = {};
      this.creating = bool;
      this.editing = null;
    },
    setEditing(id = null) {
      this.newItem = {};
      this.creating = false;
      this.editing = id;
    },
    async sendNewItem(id) {
      const { name, description, comision, channel } = this.newItem;
      if (this.editing) {
        this.newItem.id = id;
      }
      if (this.name === "compañias") {
        if (!name || !description) {
          this.error = true;
          return;
        }
        await this.$setNewChannel(this.newItem);
      } else if (this.name === "campañas") {
        if (!name || !channel) {
          this.error = true;
          return;
        }
        await this.$setNewCampana(this.newItem);
      } else {
        if (!name || !comision) {
          this.error = true;
          return;
        }
        await this.$setNewRefered(this.newItem);
      }
      this.setCreating();
      this.setEditing();
      this.$emit("refresh");
    },
    async deleteItem(row) {
      if (row.description) {
        await this.$deleteChannel(row.id);
      } else if (row.channel) {
        await this.$deleteCampana(row.id);
      } else {
        await this.$deleteReffered(row.id);
      }
      this.$emit("refresh");
    },
    confirmDelete(row) {
      if (!row || this.editing === row.id) {
        this.editing = null;
        this.creating = false;
        this.newItem = {};
        return;
      }
      this.$bvModal
        .msgBoxConfirm("¿Seguro que quieres eliminar este elemento?.", {
          title: "Confirmar",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "SI",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then(() => {
          this.deleteItem(row);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-container {
  width: 70%;
  margin: 2.5rem 0 0 0;
  padding-bottom: 2rem;
  border-bottom: 1px solid #cccbcb;
  &:last-child {
    padding-bottom: 3rem;
    border: none;
  }
  h4,
  h5 {
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
  }
  p {
    margin: 0;
  }
  h4 {
    margin-bottom: 1.5rem;
  }
  .table {
    width: 90%;
    position: relative;
    left: 2%;
    .rowchannels {
      background-color: #f8f8f8;
      margin-top: 0.5rem;
      display: grid;
      grid-template-columns: 30% 37% 15% 10% 8%;
      align-items: center;
      padding: 0.5rem 1rem;
      position: relative;
      input {
        width: 90%;
        padding: 0 0.7rem;
      }
      .add {
        position: absolute;
        width: 1.7rem;
        height: 1.7rem;
        left: 105%;
        top: 0;
        cursor: pointer;
      }
      .actions-container {
        display: flex;
        justify-content: space-around;
        img {
          height: 1.8rem;
          width: 1.8rem;
          cursor: pointer;
        }
      }
    }
    .row {
      background-color: #f8f8f8;
      margin-top: 0.5rem;
      display: grid;
      grid-template-columns: 40% 43% 17%;
      align-items: center;
      padding: 0.5rem 1rem;
      position: relative;
      input {
        width: 90%;
        padding: 0 0.7rem;
      }
      .add {
        position: absolute;
        width: 1.7rem;
        height: 1.7rem;
        left: 105%;
        top: 0;
        cursor: pointer;
      }
      .actions-container {
        display: flex;
        justify-content: space-around;
        img {
          height: 1.8rem;
          width: 1.8rem;
          cursor: pointer;
        }
      }
    }
  }
  .more {
    width: fit-content;
    color: #233348;
    text-decoration: #233348;
    &:hover {
      cursor: pointer;
      text-decoration: solid underline #233348;
    }
  }
}
select {
  appearance: auto !important;
  color: #acacac;
  height: 34px;
  background: #ffffff;
  border: 1px solid #e1e1e1;
  box-sizing: border-box;
  border-radius: 5px;
  width: 90%;
  padding: 0 0.7rem;
}
</style>
