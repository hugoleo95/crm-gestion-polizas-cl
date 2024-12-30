<template>
  <div class="main-container">
    <div class="row-container2">
      <button class="save-user" @click="saveAsignar">Guardar cambios</button>
    </div>
    <h4>Administrar Asignaciones</h4>
    <div class="submain">
      <div class="table">
        <div class="rowchannels">
          <h5>Kams</h5>
        </div>
        <div>
          <div v-for="(k, index) in kams" :key="index" class="rowchannels">
            <p>
              {{ getLeadUser(k.id) }}
              <fa-icon
                :icon="['fas', 'sign-in-alt']"
                class="ml-3 text-primary icon"
                @click="agregarkam(index, k.id)"
              />
            </p>
          </div>
        </div>
      </div>
      <div class="table">
        <div class="rowchannels">
          <h5>Asignadas</h5>
        </div>
        <div>
          <div v-for="(a, index) in asign" :key="index" class="rowchannels">
            <p>
              {{ getLeadUser(a.id) }}
              <fa-icon
                :icon="['fas', 'times']"
                class="ml-3 text-primary icon"
                @click="deletekam(index, a.id)"
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
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
      kams: {},
      asign: {},
    };
  },
  created() {
    this.asignkams();
  },
  computed: {
    ...mapState("leads", ["users"]),
    computedValue() {
      const [a, b, c] = this.val;
      if (this.more) {
        return this.val;
      } else {
        return [a, b, c];
      }
    },
  },
  methods: {
    async saveAsignar() {
      const assigned = [];
      const not_assigned = [];
      if (this.asign) {
        for (let i = 0; i < this.asign.length; i++) {
          assigned.push(this.asign[i].id);
        }
      }
      if (this.kams) {
        for (let j = 0; j < this.kams.length; j++) {
          not_assigned.push(this.kams[j].id);
        }
      }
      const payload = {
        assigned,
        not_assigned,
      };
      try {
        await this.$simpleeApi.post("/user_assign_group/", payload);
        this.$store.commit("setAlertMessage", {
          success: "Se ha actualizado las asignaciones!",
        });
      } catch (error) {
        this.$store.commit("setAlertMessage", error.response.data);
      }
    },
    async asignkams() {
      const noasig = [];
      const asingss = [];
      try {
        const resp = await this.$simpleeApi.get("/user_assign_group/");
        const asignaciones = resp.data;
        for (let i = 0; i < asignaciones.not_assigned.length; i++) {
          const newasing = {
            id: asignaciones.not_assigned[i],
          };
          noasig.push(newasing);
        }
        for (let j = 0; j < asignaciones.assigned.length; j++) {
          const newasing = {
            id: asignaciones.assigned[j],
          };
          asingss.push(newasing);
        }
        this.kams = noasig;
        this.asign = asingss;
      } catch (error) {
        this.$store.commit("setAlertMessage", error.response.data);
      }
    },
    agregarkam(key, id) {
      this.kams = this.kams?.filter((_, index) => index !== key);
      const newitem = {
        id,
      };
      this.asign.unshift(newitem);
    },
    deletekam(key, id) {
      this.asign = this.asign?.filter((_, index) => index !== key);
      const newitem = {
        id,
      };
      this.kams.unshift(newitem);
    },
    getLeadUser(user) {
      if (user) {
        const leadUser = this.users.find(({ id }) => user === id);
        return leadUser.first_name || leadUser.email.split("@")[0];
      }
      return "Sin asignar";
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
      if (this.name === "canales") {
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
.submain {
  display: flex;
}
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
      display: grid;
      grid-template-columns: 30% 37% 15% 10% 8%;
      align-items: center;
      padding: 0.5rem 1rem;
      position: relative;
      border-right: 2px solid #eac9c9;
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
.icon {
  font-size: 16px;
  cursor: pointer;
}
.row-container2 {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
.save-user {
  margin-bottom: 30px;
  border-color: transparent;
  position: relative !important;
  top: 0.6rem;
  color: #fff;
  background-color: #233348;
  border-radius: 5px;
  height: 65%;
  /* max-height: 2.5rem; */
  padding: 0.4rem 1rem;
  transition: background 0.3s ease;
  &:hover {
    background-color: rgb(59, 189, 59);
  }
}
</style>
