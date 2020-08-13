<template>
  <div id="app">
    <div class="show-part">
      <form-render
        :formProps="{
          labelPosition: 'left',
          labelWidth: '120px'
        }"
        :fields="testData"
      >
        <template slot="getListButton">
          <div>
            测试插槽:
            <el-button size="small" @click="updateConfig">更新下拉列表</el-button>
          </div>
        </template>
      </form-render>
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
      model: {}
    }
  },
  methods: {
    updateConfig () {
      const schema = this.testData.find(c => c.name === 'testSelect')
      schema.uiProp.options.push({
        label: 'CCC',
        value: 3
      })
    }
  }
}
</script>

<style lang="scss">
.show-part {
  margin: 100px auto;
  width: 500px;
  background: #fafafa;
  padding: 20px;
}
</style>
