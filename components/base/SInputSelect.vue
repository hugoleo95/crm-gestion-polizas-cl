<template>
  <div class="w-full relative">
    <input
      id="comuna"
      v-model="computedValue"
      class="form-control form-input form-control form-input z-50 select-arrow custom-select"
      type="text"
      :disabled="DisabledOption"
      @focus="selectInputFocus = true"
      @blur="onBlur"
    >
    <s-invisible-box v-if="selectInputFocus" />
    <div
      v-if="selectInputFocus"
      class="select-box"
      :class="{
        'top-16': thin,
        'top-21': !thin,
      }"
    >
      <ul>
        <li
          v-for="(option, i) in computedOptions"
          :key="i"
          class="px-4 py-2"
          :class="{
            comunasstyle: option.value,
          }"
          @click="selectOption(option.value)"
        >
          {{ option.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import SInvisibleBox from '~/components/base/SInvisibleBox.vue'
export default {
  components: {
    SInvisibleBox
  },
  props: {
    value: {
      required: true
    },
    name: {
      type: String,
      required: false
    },
    placeholder: {
      type: String,
      required: true
    },
    hintText: {
      type: String,
      required: false
    },
    tooltipMessage: {
      type: String,
      required: false
    },
    options: {
      type: Array,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    DisabledOption: {
      type: Boolean,
      default: false
    },
    thin: {
      type: Boolean,
      default: false
    },
    capitalize: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    invisibleError: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: true
    },
    errorType: {
      type: String,
      default: 'error',
      validator (value) {
        return ['error', 'alert'].includes(value)
      }
    },
    errorMessage: {
      type: String,
      required: false
    },
    immediateError: {
      type: Boolean,
      default: false
    },
    showErrorMessage: {
      type: Boolean,
      default: true
    },
    showLastOptionIfNoResults: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      search: '',
      selectInputFocus: false
    }
  },
  computed: {
    computedValue: {
      get () {
        if (this.selectInputFocus) {
          return this.search
        } else {
          // console.log(this.value, this.options)
          /* if (this.value) {
             return this.options.find(
               (o) =>
                 o.value.toString().toLowerCase() ===
                 this.value.toString().toLowerCase()
             ).text;
           } else {
             return this.value;
           }
           */
          return this.value
        }
      },
      set (val) {
        this.search = val
      }
    },
    computedOptions () {
      console.log(this.options)
      const options = this.options.filter((op) => {
        return (
          this.formatText(op.text).includes(this.formatText(this.search)) ||
          op.keywords?.every(k => k.includes(this.formatText(this.search)))
        )
      })
      if (options.length === 0) {
        if (this.showLastOptionIfNoResults) {
          // en caso de que no haya coinsidencias, se mostrara la ultima opción del arreglo
          return [this.options[this.options.length - 1]]
        } else {
          return [
            {
              text: 'No hay resultados para tu busqueda',
              value: null
            }
          ]
        }
      } else {
        return options
      }
    }
  },
  methods: {
    formatText (text) {
      const vowels = [
        {
          vowel: 'ü',
          replace: 'u'
        },
        {
          vowel: 'é',
          replace: 'e'
        },
        {
          vowel: 'á',
          replace: 'a'
        },
        {
          vowel: 'í',
          replace: 'i'
        },
        {
          vowel: 'ó',
          replace: 'o'
        },
        {
          vowel: 'ú',
          replace: 'u'
        }
      ]
      let formatedText = text.toLowerCase().trim()
      vowels.forEach((v) => {
        formatedText = formatedText.replaceAll(v.vowel, v.replace)
      })
      return formatedText
    },
    selectOption (value) {
      this.search = ''
      this.$emit('input', value)
      this.$emit('onChange', { target: { name: this.name, value } })
      this.selectInputFocus = false
    },
    onBlur () {
      setTimeout(() => {
        this.search = ''
        this.selectInputFocus = false
      }, 300)
    }
  }
}
</script>
<style scoped>
.select-box {
  position: absolute;
  /* top: 5.25rem; */
  z-index: 1000;
  overflow-y: auto;
  border: 1px solid #9ca3af;
  border-radius: 0.375rem;
  background: #fff;
  width: 100%;
  height: fit-content;
  max-height: 14rem;
}

.form-row {
  margin: 0 -15px;
}
.form-col {
  margin: 0 -15px;
  flex-direction: column;
}
.form-row .form-group {
  width: 50%;
  padding: 0 15px;
}
.form-row .form-group-request {
  width: 50%;
  padding: 12px 15px;
}
.form-col .form-group-request {
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
}
.form-input {
  border: 1px solid #505755;
  font-size: 14px;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 23px;
  position: relative;
}
ul {
  list-style-type: none;
  padding-left: 0;
}
.comunasstyle {
  cursor: pointer;
}
.comunasstyle:hover {
  color: #000;
}
</style>
