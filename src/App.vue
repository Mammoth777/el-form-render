<template>
  <div id="app">
    <pre v-text="testData" class="code-part"></pre>
    <div class="show-part">
      <form-render
        ref="form"
        :formProps="{
          labelPosition: 'left',
          labelWidth: '120px'
        }"
        :fields="testData"
        :formModel="model"
      >
        <template slot="getListButton">
          <div class="vertical-align-center">
            <span>
              测试插槽:
            </span>
            <el-button size="small" @click="updateConfig">更新下拉列表</el-button>
          </div>
        </template>
      </form-render>
    </div>
    <div>
      <el-button size="small" @click="model = $refs.form.getData()">getData</el-button>
      <el-button size="small" @click="$refs.form.resetFields()">resetFields</el-button>
      <el-button size="small" @click="$refs.form.validate()">validate</el-button>
      <el-button size="small" @click="$refs.form.clearValidate()">clearValidate</el-button>
      <br>
      <pre v-text="model" class="code-part"></pre>
    </div>
  </div>
</template>

<script>
import FormRender from '@/components/FormRender/index.vue'
import testData from './test'

export default {
  name: 'App',
  components: {
    FormRender
  },
  data () {
    return {
      testData,
      model: {
        info: {
          a: '我覆盖默认值'
        }
      }
    }
  },
  methods: {
    updateConfig () {
      const schema = this.testData.find(c => c.name === 'testSelect')
      const len = schema.uiProp.options.length
      schema.uiProp.options.push({
        label: new Array(3).fill(String.fromCharCode(65 + len)).join(''),
        value: len
      })
    }
  }
}
</script>

<style lang="scss">
#app {
  display: flex;
}
.show-part {
  margin: 80px auto;
  width: 500px;
  background: #fafafa;
  padding: 20px;
}
.vertical-align-center {
  line-height: 40px;
}
.code-part {
  height: 90vh;
  overflow: auto;
  background-color: #fafafa;
  margin: 0 10px;
  padding: 0 10px;
}
</style>
