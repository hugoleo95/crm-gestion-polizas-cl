<template>
  <div
    role="progressbar"
    aria-valuemin="0"
    :aria-valuemax="max"
    :aria-valuenow="value"
    :style="{height,width}"
    class="bar"
    :title="`${value}/${max}`"
  >
    <div
      class="background"
      :style="{width:progress}"
    />
  </div>
</template>

<script>
export default {
  name: 'SProgressBar',
  props: {
    value: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    height: {
      type: String,
      default: '8px'
    },
    width: {
      type: String,
      default: '100%'
    }
  },
  computed: {
    progress () {
      return this.max > 0 ? `${(this.value / this.max) * 100}%` : '0%'
    }
  }
}
</script>

<style lang="scss" scoped>
.background {
  background: var(--primary);
  border-radius: 5px;
}
.bar {
  display: flex;
  overflow: hidden;
  line-height: 0;
  font-size: 0.75rem;
  background-color: #e1e1e1;
  border-radius: 5px;
}
</style>
