
<template>
  <div class="main-container">
    hola
  </div>
</template>
  
  <script>
import Data from "~/static/basura.json";

export default {
    layout: 'no-auth',
  data () {
    return {
      Ruts: Data
    }
  },
  created () {
    this.getJsonToExcel()
  },
  methods: {
    async getJsonToExcel () {
      let NewData = [];
      for (let i = 0; i < this.Ruts.length; i++) {
        const onlyNumbers = this.Ruts[i].RUT.replace(/[^0-9]+/g, ""); // esto retorna '1234'
        if (onlyNumbers) {
          console.log('aqui', this.Ruts[i].RUT)
          try {
            const _response = await this.$simpleeApi.get(
              `/get_data_sii/?rut=${this.Ruts[i].RUT}`
            );
            const data = _response.data
            NewData[i] = {
              rut: this.Ruts[i].RUT,
              razon_social: data.razon_social,
              giro: data.giro
            }
          } catch (error) {
          }
        }
      }
      console.log('aquii el resultado', NewData)
    }
  }
}
  </script>
  <style lang="scss" scoped>
</style>
  