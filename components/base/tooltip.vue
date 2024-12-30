<template>
  <div class="relative">
    <fa-icon
      :icon="['fas', 'info-circle']"
      class="icon mr-1"
      title="Tooltip directive content"
      @click="showOnClick"
      @mouseover="show = true"
      @mouseleave="show = false"
    />
    <!-- <s-invisible-box
      v-if="show"
      @click.native="show = false"
      @mouseover="show = false"
    /> -->
    <div
      v-if="show"
      class="ToolTip show"
      :class="newClass"
    >
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    newClass: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    showOnClick () {
      this.show = true
      setTimeout(() => {
        this.show = false
      }, 5000)
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
    color: #6461ed;
}
.relative {
  position: relative;
}
.ToolTip {
  opacity: 0;
  width: 90vw;
  pointer-events: none;
  background-color: #6461ed;
  color: #fff;
  text-align: center;
  border-radius: 10px;
  padding: 16px;
  z-index: 100;
  font-size: 17px;
  position: fixed;
  left: 50%;
  top: 1rem;
  transform: translateX(-50%);

  @media (min-width: 768px) {
    width: 50vw;
  }

  @media (min-width: 1024px) {
    position: absolute;
    left: 0;
    top: 25px;
    width: 30vw;

    &::after {
      content: " ";
      position: absolute;
      bottom: 100%;
      left: 52.5%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: transparent transparent #6461ed transparent;
    }
  }
}

.show {
  animation: fadein 0.5s ease forwards;
}

.hide {
  animation: fadeout 0.5s ease forwards;
}

@keyframes fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeout {
  0% {
    pointer-events: all;
    opacity: 1;
  }
  100% {
    pointer-events: none;
    opacity: 0;
  }
}
.span-right {
  transform: translateX(-88%);
}
.span-right::after {
  left: 90%;
}
.ToolTip2 {
  left: 2px;
  width: 13vw;
}
</style>
