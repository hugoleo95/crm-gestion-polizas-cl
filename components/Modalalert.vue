<template>
  <div id="modalalert">
    <div class="title">
      {{ title }}
    </div>
    <div class="mensaje">
      {{ mensaje }}
    </div>
    <tr>
      <td
        width="20%"
        align="center"
      >
        <button
          type="button"
          class="botonaction"
          @click="$emit('buttonaction')"
        >
          {{ mensajebotton }}
        </button>
      </td>
    </tr>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    mensaje: {
      type: String,
      default: ''
    },
    mensajebotton: {
      type: String,
      default: ''
    }
  }

}
</script>

<style lang="scss" scoped>
#modalalert {
  font-family: Rubik;
  position: absolute;
  width: 400px;
  height: 190px;
  background-color: #fff;
  text-align: center;
  border-radius: 8px;
  border: 1px solid #cfcfcf;
  padding: 25px;
  position: fixed;
  z-index: 1;
  left: 35%;
  bottom: 40%;
  z-index: 1;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}
#modalalert .title {
  color: black;
  font-size: 20px;
  padding-bottom: 10px;
  font-weight: 500;
}
#modalalert .mensaje {
  color: black;
  font-size: 13px;
  padding-bottom: 35px;
  font-weight: 500;
}
#modalalert button.botonaction {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 9px 19px;
  background: #233348;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #fff;
}
</style>
