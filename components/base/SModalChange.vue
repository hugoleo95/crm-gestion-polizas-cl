<template>
  <div>
    <div>
      <b-modal
        id="changes"
        title="Changes Client"
        modal-class="draggable-modal"
        headerClass="border-bottom-0"
        size="lg"
        body-class="padding-modal"
        scrollable
        ok-only
        content-class="border-0 radius"
      >
        <template #modal-header="{ }">
          <div
            class="max-size pl-3 pt-5"
            @mousedown="dragModal"
          >
            <h5>
              <fa-icon
                :icon="['fas', 'edit']"
                class="text-primary mr-2"
              /><b>Cambios</b>/ campos
            </h5>
            <p>Manten presionado para arrastrar el modal</p>
          </div>
        </template>
        <div
          v-if="infovalue === 'vacio'"
          class="pt-5"
        >
          <p class="my-4 text-lg text-center">No hay cambios en ningun campo de este cliente.</p>
        </div>
        <div
          v-if="infovalue === 'full'"
          class="table-responsive tb-padding pt-4"
        >
          <s-form-table>
            <tr>
              <th class="text-base pd-val">Campo</th>
              <th class="text-base pd-val">
                Ahora
              </th>
              <th class="text-base pd-val">
                Antes
              </th>
            </tr>
            <tr
              v-for="(chang, index) in youchanges"
              :key="index"
            >
              <td class="text-val pd-val">{{ chang.field}}</td>
              <td class="text-val pd-val">
                {{ chang.new}}
              </td>
              <td class="text-val pd-val">
                {{ chang.old}}
              </td>
            </tr>
          </s-form-table>
        </div>
      </b-modal>
    </div>
  </div>
</template>
<script>
import SFormTable from '@/components/base/SFormTable.vue'
export default {
  components: {
    SFormTable
  },
  props: {
    changesedit: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      youchanges: {},
      infovalue: ''
    }
  },
  watch: {
    changesedit: {
      handler (val) {
        this.Changes(val)
      }
    }
  },
  methods: {
    Changes (val) {
      if (val.length > 0) {
        this.infovalue = 'full'
        this.youchanges = val
      } else {
        this.infovalue = 'vacio'
      }
    },
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
    }
  }
}
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
