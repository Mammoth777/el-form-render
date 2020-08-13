<template>
  <div class="form-render">
    <el-form
      :model="model"
      v-bind="formProps"
    >
      <form-item
        v-for="formItem in eleFields"
        :key="formItem.name"
        :config="formItem"
        :value="getNestedProperty(model, formItem.name)"
      >
        <!-- 传递一层slot -->
        <slot :name="formItem.slot" :slot="formItem.slot"></slot>
      </form-item>
    </el-form>
  </div>
</template>

<script>
import FormItem from './FormItem.vue'
import uniqBy from 'lodash/uniqBy'
import { setNestedProperty, getNestedProperty } from './utils'

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
    formProps: Object,
    fields: {
      validator (schema) {
        // todo 优化
        // 1. name不重复
        let flag = checkNameUniq(schema)
        // 2. type存在
        flag = checkTypeExist(schema)
        return flag
      }
    }
  },
  data () {
    return {
      model: {}
    }
  },
  watch: {
    fields: {
      immediate: true,
      handler (val) {
        val.forEach(field => {
          if (!this.model[field.name]) {
            setNestedProperty(this.model, field.name, field.defaultValue)
            // this.model[field.name] = ''
          }
        })
      }
    }
  },
  computed: {
    eleFields () {
      const createElType = type => {
        const map = {
          select: 'PresetSelect'
        }
        return map[type] || 'el-' + type
      }
      // const _fields = cloneDeep(this.fields)
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
      console.log(this.model, 'update value')
      this.model = { ...this.model }
    },
    getNestedProperty,
    checkHideItem (changedItemConfig) {
      console.log(changedItemConfig)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
