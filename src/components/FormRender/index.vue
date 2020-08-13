<template>
  <div class="form-render">
    <el-form
      :model="model"
      v-bind="formProps"
    >
      <el-row :gutter="20">
        <el-col
          v-for="formItem in eleFields"
          :span="formItem.colSpan || 24"
          :key="formItem.name"
        >
          <form-item
            :config="formItem"
            :value="getNestedProperty(model, formItem.name)"
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
import { setNestedProperty, getNestedProperty } from './utils'
import cloneDeep from 'lodash/cloneDeep'
import isFunction from 'lodash/isFunction'
import isNumber from 'lodash/isNumber'

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

class ExecQueue {
  constructor (count = 0) {
    if (!isNumber(count)) {
      throw new TypeError('count需为number类型')
    }
    this.count = count
    this.queue = new Array(count)
  }

  /**
   * 设置执行顺序
   */
  set (val, execIndex) {
    if (!val || !isFunction(val)) {
      throw new Error('val必须为function')
    }
    if (execIndex === undefined) {
      this.queue.push(val)
    } else if (isNumber(execIndex)) {
      this.queue[execIndex] = val
    } else {
      throw new TypeError('execIndex需为number或undefined')
    }
    this._exec()
  }

  /**
   * 执行队列内函数
   */
  _exec () {
    const length = this.queue.filter(v => v).length
    if (length === this.count) {
      console.log('exec')
      this.queue.forEach(fn => fn())
    }
  }
}

const execQ = new ExecQueue(2)

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
    formProps: Object,
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
          execQ.set(() => {
            this.model = cloneDeep(val)
          }, 0)
        }
      }
    },
    fields: {
      immediate: true,
      handler (val) {
        execQ.set(() => {
          // 1. 初始化每个字段默认值
          val.forEach(field => {
            if (field.name && !this.model[field.name]) {
              setNestedProperty(this.model, field.name, field.defaultValue)
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
        const map = {
          select: 'PresetSelect'
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
    getNestedProperty,
    getData () {
      return cloneDeep(this.model)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
