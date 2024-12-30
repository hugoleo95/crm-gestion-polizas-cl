<template>
  <div class="dropzonepa">
    <div
      class="dropzone"
      :class="{ 'active-dropzone': active }"
      @drop.prevent="toggleActive"
      @dragenter.prevent="toggleActive"
      @dragleave.prevent="toggleActive"
      @dragover.prevent
    >
      <span v-if="!active"> {{ title }} </span>
      <span v-if="active"> Suelte el archivo </span>
      <label for="dropzoneFile"> Seleccionar Archivo </label>
      <input id="dropzoneFile" type="file" multiple @change="toggleActive">
    </div>
    <div v-if="type === 'product'" class="mt-3">
      Descargue el formato excel
      <a :href="urldocument" target="_blank" download> Presionando aqui </a>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import XLSX from 'xlsx'

export default {
  name: 'DropZone',
  props: {
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    urldocument: {
      type: String,
      default: '',
      required: false
    }
  },
  data () {
    return {
      active: false
    }
  },
  methods: {
    toggleActive (e) {
      this.$emit('ActiveLoader')
      this.active = !this.active
      const file = e.target.files || e.dataTransfer.files
      this.dropzoneFile = file
      this.productMethodPrev()
    },
    productMethodPrev: _.debounce(function () {
      this.productMethod()
    }, 3000),
    productMethod () {
      if (this.dropzoneFile[0]) {
        const types = (this.dropzoneFile[0].name || '').split('.')[1]
        const fileType = [
          'xlsx',
          'xlc',
          'xlm',
          'xls',
          'xlt',
          'xlw',
          'csv'
        ].some(item => item === types)
        if (!fileType) {
          alert(
            'Hubo un error al cargar el archivo, el formato tiene que ser de excel, intente nuevamente.'
          )
        } else {
          const reader = new FileReader()
          reader.onload = (e) => {
            const data = e.target.result
            const workbook = XLSX.read(data, { type: 'binary' })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            const rowObject = XLSX.utils.sheet_to_row_object_array(worksheet)
            let j = 1
            for (let i = 0; i < rowObject.length; i++) {
              if (j === rowObject.length) {
                this.$emit('DesactiveLoader')
              }
              if (rowObject[i].nro_poliza) {
                let register = {}
                register = {
                  nro_poliza: rowObject[i].nro_poliza
                }
                this.$emit('push-register', register)
              }
              j++
            }
          }
          reader.readAsBinaryString(this.dropzoneFile[0])
        }
      }
    },
    documentMethod () {
      Object.keys(this.dropzoneFile).forEach((file) => {
        this.$emit('addDocument', this.dropzoneFile[file])
      })
    }
  }
}
</script>

<style scoped lang="scss">
.dropzone {
  width: 100%;
  height: 167px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 16px;
  border: 1px dashed #233348;
  transition: 0.3s ease all;
  font-family: "Rubik";
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  color: #000000;
  border-radius: 5px;

  label {
    padding: 8px 12px;
    color: #fff;
    background: #233348;
    border-radius: 6px;
    transition: 0.3s ease all;
  }

  input {
    display: none;
    padding: 10px 12px;
  }
}
.active-dropzone {
  color: #fff;
  border-color: #fff;
  background: #233348;

  label {
    background-color: #fff;
    color: #41b883;
  }
}
.mt-2 {
  margin-top: 10px;
}
</style>
