<template>
  <form
    class="input-box"
    @submit="createNewGoal($event)"
  >
    <h3>{{ executive.first_name }}</h3>
    <p>{{ month }}</p>
    <input
      v-model="amount"
      type="number"
      placeholder="Monto asignado en UF"
      :class="error ? 'input-error' : ''"
    >
    <button
      class="save-btn"
      type="submit"
    >
      Guardar cambios
    </button>
  </form>
</template>

<script>
import Months from '@/static/months.json'
export default {
  props: {
    executive: {
      type: Object,
      required: true
    },
    goals: {
      type: Array,
      require: true,
      default: () => []
    },
    selectedMonth: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      months: Months,
      error: false,
      goalsEdit: {
        user: this.executive.id,
        amount: null,
        start_date: null,
        end_date: null
      }
    }
  },
  computed: {
    month () {
      return this.months.find(m => (m.id === this.selectedMonth + 1)).month
    },
    amount: {
      get () { return this.goalsEdit.amount },
      set (val) { this.goalsEdit.amount = Number(val) }
    }
  },
  watch: {
    selectedMonth () {
      this.getDates()
    }
  },
  created () {
    this.getDates()
  },
  methods: {
    getDates () {
      const currentYear = new Date().getFullYear()
      const firstDay = new Date(currentYear, this.selectedMonth, 1).toISOString().split('T')[0]
      const lastDay = new Date(currentYear, this.selectedMonth + 1, 0).toISOString().split('T')[0]
      this.goalsEdit.start_date = firstDay
      this.goalsEdit.end_date = lastDay
    },
    async createNewGoal ($event) {
      $event.preventDefault()
      if (this.goalsEdit.amount === null || this.goalsEdit.amount < 0) {
        this.error = true
        return
      }
      const existingGoal = this.goals.find(goal => goal.user === this.goalsEdit.user && goal.start_date === this.goalsEdit.start_date)
      if (existingGoal) {
        const res = await this.$setNewGoal({ ...this.goalsEdit, update: true, id: existingGoal.id })
        res && this.$store.commit('setAlertMessage', { success: 'Se ha actualizado una meta con exito!' })
      } else {
        const res = await this.$setNewGoal(this.goalsEdit)
        res && this.$store.commit('setAlertMessage', { success: 'Se ha creado una nueva meta con exito!' })
      }
      this.$emit('reload')
      this.error = false
      this.goalsEdit.amount = null
    }
  }
}
</script>

<style lang="scss" scoped>
.input-box {
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 17% 15% 40% 28%;
  grid-column-gap: 1rem;
  align-items: center;
  h3,
  p {
    font-size: 0.9rem;
    top: 0.45rem;
  }
  p {
    color: gray;
    position: relative;
    top: 0.4rem;
  }
  input {
    appearance: none;
    padding: 0 1rem;
    outline: none;
    border: 1px solid #233348;
    &:focus {
      border: 1px solid #056d53;
    }
  }
  .input-error {
    border: 2px solid red;
  }
  input,
  button {
    font-size: 0.9rem;
  }
  .save-btn {
    color: #fff;
    background-color: #233348;
    border: none;
    border-radius: 5px;
    height: 65%;
    padding: 0 1rem;
    transition: background 0.3s ease;
    height: 100%;
    width: 100%;
    padding: 0;
    &:hover {
      background-color: rgb(59, 189, 59);
    }
  }
}
</style>
