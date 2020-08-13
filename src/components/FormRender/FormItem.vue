<template>
<div>
  <slot
    :name="config.slot"
    v-if="config.slot"
  >
    slot: {{config.slot}} here
  </slot>
  <el-form-item
    v-else
    v-show="!isHide"
    v-bind="itemProp"
    :prop="config.name"
  >
    <component
      :is="type"
      ref="uiComp"
      v-bind="widgetProp"
      v-on="eventBind"
      :value="value"
    >
    </component>
  </el-form-item>
</div>
</template>

<script>
import PresetSelect from './ElItemWrapper/PresetSelect.vue'

export default {
  name: 'FormItem',
  inject: ['FR'],
  components: {
    PresetSelect
  },
  props: {
    config: Object,
    value: [String, Number, Boolean]
    // model: Object
  },
  computed: {
    type () {
      return this.config.type
    },
    itemProp () {
      return {
        label: this.config.label,
        labelWidth: this.config.uiProp.labelWidth,
        rules: this.config.uiProp.rules,
        prop: this.config.name
      }
    },
    widgetProp () {
      return this.config.uiProp
    },
    eventBind () {
      const handlers = this.config.uiOn

      const originChange = handlers.change
      const originInput = handlers.input
      handlers.change = (val) => {
        // this.$emit('input', val)
        // console.log(val, 'change')
        // this.$set(this.FR.model, this.config.name, val)
        originChange && originChange.call(this.FR, val, this.FR.eleFields, this.FR.model)
      }
      handlers.input = (val) => {
        // this.$set(this.model, this.config.name, val)
        this.FR.updateValue(this.config.name, val)
        // console.log('input', this.FR.model, this.config.name)
        // this.$forceUpdate()
        originInput && originInput.call(this.FR, val, this.FR.eleFields, this.FR.model)
      }
      // handlers.blur = (val) => {
      //   console.log(val, 'blur')
      //   // originChange.call(this.FR, val, this.FR.eleFields, this.FR.model)
      // }

      return handlers
    },
    isHide () {
      const flag = this.config.uiHide && this.config.uiHide(this.FR.model)
      return flag
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
