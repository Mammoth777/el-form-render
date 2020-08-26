<template>
  <el-checkbox-group :value="value" @change="val => $emit('input', val)" v-bind="$attrs" v-on="$listeners">
    <el-checkbox
      v-for="item in options"
      :key="getNestedProperty(item, keyProp)"
      :label="getNestedProperty(item, labelProp)"
      :disabled="!!getNestedProperty(item, disabledProp)"
    >
      {{
        getNestedProperty(item, nameProp) || getNestedProperty(item, labelProp)
      }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script>
import { getNestedProperty } from '../utils'

export default {
  name: 'CheckboxGroup',
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    options: {
      type: Array
    },
    keyProp: {
      type: String,
      default: 'id'
    },
    labelProp: {
      type: String,
      default: 'label'
    },
    nameProp: {
      type: String,
      default: 'name'
    },
    disabledProp: {
      type: String,
      default: 'disabled'
    }
  },
  methods: {
    getNestedProperty
  }
}
</script>

<style lang="scss" scoped>

</style>
