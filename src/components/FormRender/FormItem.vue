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
    <!-- 1. 用户自定义的组件 -->
    <custom-component
      v-if="config.component"
      :component="config.component"
      :value="value"
      v-bind="widgetProp"
      v-on="eventBind"
    >
    </custom-component>
    <!-- 2. 内置的element组件 -->
    <component
      v-else
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
import RadioGroup from './ElItemWrapper/RadioGroup.vue'
import CheckboxGroup from './ElItemWrapper/CheckboxGrup.vue'
import TextComp from './ElItemWrapper/TextComp.vue'

export default {
  name: 'FormItem',
  inject: ['FR'],
  components: {
    /**
     * 🐂🍺只需要有组件选项对象，就可以立刻包装成函数式组件在 template 中使用
     * FYI: https://cn.vuejs.org/v2/guide/render-function.html#%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6
     * 灵感来源: (抄作业) https://github.com/FEMessage/el-form-renderer/blob/dev/src/components/render-form-item.vue
     */
    CustomComponent: {
      functional: true,
      render: (h, ctx) => h(ctx.props.component, ctx.data, ctx.children)
    },
    TextComp,
    PresetSelect,
    RadioGroup,
    CheckboxGroup
  },
  props: {
    config: Object,
    value: [String, Number, Boolean, Array]
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
        this.FR.$emit('on-field-change', {
          fieldName: this.config.name,
          value: val
        })
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
