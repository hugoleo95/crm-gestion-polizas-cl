<template>
  <div class="hero is-info">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          {{ title }}
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroHeader',
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>
