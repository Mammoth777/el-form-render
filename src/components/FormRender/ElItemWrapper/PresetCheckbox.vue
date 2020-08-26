<template>
  <el-checkbox
    :value="value"
    @change="val => $emit('input', val)"
    v-bind="$attrs"
    v-on="$listeners"
   >
    {{text}}
   </el-checkbox>
</template>

<script>
export default {
  name: 'PresetCheckbox',
  props: {
    text: String,
    value: [String, Number]
  }
}
</script>
