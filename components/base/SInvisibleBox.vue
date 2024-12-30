<template>
  <div
    :class="`box
    ${showNav && 'show-nav'}
    ${transparent && 'transparent'}
    ${opaque && 'opaque'}
    `"
  />
</template>

<script>
export default {
  props: {
    showNav: {
      type: Boolean,
      default: false
    },
    transparent: {
      type: Boolean,
      default: true
    },
    opaque: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.show-nav {
  top: 5.5rem;
}
.transparent {
  background: transparent;
}
.opaque {
  background: rgba(0, 0, 0, 0.3);
}
</style>
