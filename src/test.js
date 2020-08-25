import Demo from './components/CustomComps/Demo.vue'
const config = [
  {
    name: 'test.a.b.c',
    label: '显示/隐藏[嵌套属性测试]',
    type: 'switch',
    defaultValue: true,
    uiProp: {
      labelWidth: '200px'
    },
    uiOn: {}
  },
  {
    name: 'title',
    label: '名称',
    type: 'input',
    defaultValue: '',
    uiProp: {
      size: 'small',
      placeholder: '请输入啊巴扎黑...',
      labelPosition: 'left',
      labelWidth: '70px',
      rules: [
        {
          required: true,
          message: '真敢不填吗???',
          trigger: 'blur'
          // validator: (rule, value, callback) => {
          //   console.log(rule, value, 'title value')
          //   callback()
          // }
        }
      ]
    },
    uiOn: {
      change (val, schema, model, event) {
        // this: FormRender vm instance
        console.log({ val, schema, model, event }, '来自配置json的log')
        const config = schema.find(s => s.name === 'title')
        this.$set(config, 'label', val + '名称')
        // config.label = val + '名称'
      }
    }
  },
  {
    name: 'info.a',
    label: '嵌套属性测试',
    type: 'input',
    defaultValue: '测试',
    uiProp: {
      rules: [
        {
          required: true,
          message: '求求你填一下吧'
        }
      ]
    },
    uiOn: {},
    uiHide: model => model.test.a.b.c === true
  },
  {
    name: 'testSelect',
    label: '测试select',
    type: 'select',
    defaultValue: 1,
    uiProp: {
      options: [
        { label: 'AAA', value: 1 },
        { label: 'BBB', value: 2, disabled: true }
      ]
    },
    uiOn: {},
    colSpan: 12 // 1-24
  },
  {
    name: 'nouse',
    label: '禁用测试: ',
    type: 'input',
    uiProp: {
      disabled: true,
      size: 'small'
    }
  },
  {
    name: 'testRadioGroup',
    label: '测试单选组',
    type: 'radio-group',
    defaultValue: 1,
    uiProp: {
      options: [
        { label: 1, name: '第一个' },
        { label: 2, name: '第二个' }
      ]
    }
  },
  {
    name: 'testCheckboxGroup',
    label: '测试多选组',
    type: 'checkbox-group',
    defaultValue: [2], // 注意: 多选组, 值必须为数组, 这是element要求的
    uiProp: {
      options: [
        { label: 1, name: '第一个' },
        { label: 2, name: '第二个' }
      ]
    }
  },
  {
    name: 'yihangliangge',
    label: '测试colSpan配置:',
    type: 'text',
    colSpan: 12,
    defaultValue: '文字值'
  },
  {
    slot: 'getListButton',
    colSpan: 12
  },
  {
    name: 'testClass',
    label: 'testClass',
    className: 'test-class'
  },
  {
    name: 'diyComp',
    label: '自定义组件',
    component: Demo,
    defaultValue: '0'
  }
]
function formatCfg (configList) {
  return configList.map(config => {
    return Object.assign(
      {
        name: '',
        label: '',
        type: 'input',
        uiProp: {},
        uiOn: {}
      }, config)
  })
}

export default formatCfg(config)
