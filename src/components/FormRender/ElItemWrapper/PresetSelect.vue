<template>
  <el-select :value="value" @change="val => $emit('input', val)" v-bind="$attrs" v-on="$listeners">
    <el-option v-for="item in options"
      :key="getNestedVal(item, keyProp)"
      :label="getNestedVal(item, labelProp)"
      :value="getNestedVal(item, valueProp)"
      :disabled="!!getNestedVal(item, disabledProp)"
    >
    </el-option>
  </el-select>
</template>

<script>
const getNestedProperty = (obj, path) => {
  const keys = path.split('.')
  return keys.reduce((o, key) => o && o[key], obj)
}

export default {
  name: 'PresetSelect',
  props: {
    value: {},
    options: {
      type: Array,
      default: () => ([])
    },
    keyProp: {
      type: String,
      default: 'id'
    },
    labelProp: {
      type: String,
      default: 'label'
    },
    valueProp: {
      type: String,
      default: 'value'
    },
    disabledProp: {
      type: String,
      default: 'disabled'
    },
    valueMustInRange: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    info () {
      const { options, value } = this
      return {
        options,
        value
      }
    }
  },
  created () {
    // **feat** 验证当前选择的id, 是否在所有的options内
    if (this.valueMustInRange) {
      const unwatch = this.$watch('info', function (info, prevInfo) {
        let { options, value } = info
        const prevValue = prevInfo && prevInfo.value
        if (!value || prevValue === value) return
        const valueProp = this.valueProp
        const isMultiple = Reflect.has(this.$attrs, 'multiple')
        const isMatch = val => options.some(opt => opt[valueProp] === val)
        let updateFlag = false
        // 1. 多选下拉菜单
        if (isMultiple && Array.isArray(value)) {
          for (let i = value.length - 1; i >= 0; i--) {
            if (!isMatch(value[i])) {
              value.splice(i, 1)
              updateFlag = true
            }
          }
        } else {
          // 2. 单选下拉菜单
          if (!isMatch(value)) {
            value = ''
            updateFlag = true
          }
        }
        if (updateFlag) {
          this.$emit('input', value)
          unwatch && unwatch()
        }
      }, { immediate: true })
    }
  },
  methods: {
    getNestedVal (obj, val) {
      return getNestedProperty(obj, val)
    }
  }
}
</script>
