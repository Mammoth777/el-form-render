<template>
  <div class="form-render">
    <el-form
      :model="model"
      v-bind="formProps"
      ref="form"
    >
      <el-row :gutter="20">
        <el-col
          v-for="formItem in eleFields"
          :span="formItem.colSpan || 24"
          :key="formItem.name"
        >
          <form-item
            :config="formItem"
            :value="getFieldValue(formItem.name)"
            :class="formItem.className || ''"
          >
            <!-- 传递一层slot -->
            <slot :name="formItem.slot" :slot="formItem.slot"></slot>
          </form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import FormItem from './FormItem.vue'
import uniqBy from 'lodash/uniqBy'
import { setNestedProperty, getNestedProperty, createExecList, toKebabCase } from './utils'
import cloneDeep from 'lodash/cloneDeep'
import isObject from 'lodash/isObject'

/**
 * 验证名称重复
 */
function checkNameUniq (schema) {
  if (uniqBy(schema, 'name').length === schema.length) {
    return true
  } else {
    throw new Error('name有重复')
  }
}

function checkTypeExist (schema) {
  const flag = schema.every(s => s.type)
  if (!flag) {
    throw new Error('监测到type不存在')
  }
  return true
}

const execList = createExecList(2) // 创建执行队列

export default {
  name: 'FormRender',
  provide () {
    return {
      FR: this
    }
  },
  components: {
    FormItem
  },
  props: {
    // el-form props 配置项
    formProps: {
      default: () => ({}),
      type: Object
    },
    fields: {
      validator (schema) {
        // todo 优化
        // 1. name不重复
        const flag =
          checkNameUniq(schema) &&
          // 2. type存在
          checkTypeExist(schema)
        return flag
      }
    },
    // 获取props重的model, 克隆至此
    formModel: {}
  },
  data () {
    return {
      model: {}
    }
  },
  watch: {
    formModel: {
      immediate: true,
      handler (val) {
        if (val) {
          execList.set(() => {
            // 0. 深克隆模型数据值
            this.model = cloneDeep(val)
          }, 0)
        }
      }
    },
    fields: {
      immediate: true,
      handler (val) {
        execList.set(() => {
          // 1. 初始化每个字段默认值
          val.forEach(field => {
            if (field.name && !this.model[field.name]) {
              const valueInModel = this.getFieldValue(field.name)
              const defaultValue = valueInModel === undefined ? field.defaultValue : valueInModel
              setNestedProperty(this.model, field.name, defaultValue)
              this.$emit('on-field-init', {
                fieldName: field.name,
                value: field.defaultValue
              })
            }
          })
        }, 1)
      }
    }
  },
  computed: {
    // 表单类型转换成Element表单元素名称
    eleFields () {
      const createElType = type => {
        type = toKebabCase(type)
        const map = {
          text: 'TextComp', // 对应ElItemWrapper内组件名
          select: 'PresetSelect',
          'radio-group': 'RadioGroup',
          checkbox: 'PresetCheckbox',
          'checkbox-group': 'CheckboxGroup'
        }
        type = type.replace(/el-/g, '')
        if (Object.values(map).includes(type)) {
          return type
        } else {
          return map[type] || 'el-' + type
        }
      }
      // const _fields = cloneDeep(this.fields) // 这里克隆了就不能响应了啊, 还是不要克隆的好
      const _fields = this.fields
      return _fields.map(field => {
        field.type = createElType(field.type)
        return field
      })
    }
  },
  methods: {
    /**
     * 更新表单数据
     * @param  {String} options.name 表单name
     * @param  {All} options.value 表单数据
     */
    updateValue (name, value) {
      setNestedProperty(this.model, name, value)
      console.log(
        'update value: ',
        {
          model: this.model,
          name,
          value
        }
      )
      this.model = { ...this.model }
    },
    /**
     * 更新整个表单数据
     */
    updateForm (formModel) {
      if (!isObject(formModel)) {
        throw new Error('更新表单数据处报错: formModel 不是对象')
      }
      this.fields.forEach(field => {
        const newVal = getNestedProperty(formModel, field.name)
        const oldVal = getNestedProperty(this.model, field.name)
        if (newVal !== oldVal) {
          setNestedProperty(this.model, field.name, newVal)
        }
      })
    },
    getFieldValue (name) {
      return getNestedProperty(this.model, name)
    },
    getData () {
      return cloneDeep(this.model)
    },
    // el-form相关方法传递
    validate () {
      this.$refs.form.validate()
    },
    resetFields () {
      this.$refs.form.resetFields()
    },
    clearValidate () {
      this.$refs.form.clearValidate()
    }
  }
}
</script>

<style scoped lang="scss">

</style>
