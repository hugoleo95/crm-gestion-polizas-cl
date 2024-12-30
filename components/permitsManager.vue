<template>
  <div class="permits-container">
    <b-form-tags
      id="tags-component-select"
      v-model="computedValue"
      size="md"
      :class="`form-tags ${computedValue.length > 0 && 'border-bottom'}`"
      add-on-change
      tag-variant="primary"
      no-outer-focus
    >
      <template #default="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
        <b-form-select
          v-bind="inputAttrs"
          :disabled="disabled || availableOptions.length === 0"
          :options="availableOptions"
          class="select-form"
          v-on="inputHandlers"
        >
          <template #first>
            <!-- This is required to prevent bugs with Safari -->
            <option
              disabled
              value=""
            >
              {{ title }}
            </option>
          </template>
        </b-form-select>
        <ul
          v-if="tags.length > 0"
          class="list-inline d-inline-block"
        >
          <li
            v-for="tag in tags"
            :key="tag"
            class="list-inline-item"
          >
            <b-form-tag
              :title="tag"
              :disabled="disabled"
              class="text-black p-1 tag"
              variant="secondary"
              @remove="removeTag(tag)"
            >
              <img
                :src="getImage(tag)"
                :alt="`${tag}`"
              >
              {{ getTag(tag) }}
            </b-form-tag>
          </li>
        </ul>
      </template>
    </b-form-tags>
  </div>
</template>

<script>
export default {
  props: {
    executives: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    value: {
      type: Array,
      required: true
    }
  },
  computed: {
    computedValue: {
      get () { return this.getParsedData(this.value) },
      set (val) { this.$emit('emitedValue', this.emitParsedData(val)) }
    },
    availableOptions () {
      const { executives } = this
      return executives.filter(executive => !this.computedValue.includes(executive.first_name)).map(e => e.first_name)
    }
  },
  methods: {
    getParsedData (ids) {
      return ids.map(id => this.executives.find(executive => executive.id === id)?.first_name)
    },
    emitParsedData (names) {
      return names.map(name => this.executives.find(executive => executive.first_name === name).id)
    },
    getTag (tag) {
      return this.executives.find(executive => executive.first_name === tag)?.first_name
    },
    getImage (tag) {
      try {
        const { id = null } = this.executives.find(e => e.first_name === tag)
        return require(`~/assets/team/${id}.png`)
      } catch (err) {
        return require('~/assets/simplee-logo.png')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.permits-container {
  position: relative;
  margin: 2rem 3rem;
  width: 70%;
  left: 53%;
  transform: translateX(-80.5%);
  &:first-child {
    margin-top: 3rem;
  }
  .form-tags {
    border: none;
    display: flex;
    flex-direction: column;
    .select-form {
      background: #f8f8f8;
      width: fit-content;
      border: 1px solid #e1e1e1;
      font-weight: 400;
    }
    ul {
      width: fit-content;
      border: 1px solid #e1e1e1;
      border-radius: 6px;
      margin: 1rem 0 2rem 0;
      padding: 0.25rem 0.5rem 0.25rem 0.5rem;
      background: #f8f8f8;
      li {
        margin: 0.25rem;
        .tag {
          background: #fff;
          border-radius: 4rem;
          border: 1px solid #e1e1e1;
          img {
            width: 2.5rem;
            height: 2rem;
          }
        }
      }
    }
  }
  .border-bottom {
    border-bottom: 1px solid #e1e1e1;
  }
  &:last-child {
    margin-bottom: 2rem;
    .border-bottom {
      border-bottom: 0 !important;
    }
    ul {
      margin-bottom: 0 !important;
    }
  }
}
</style>
