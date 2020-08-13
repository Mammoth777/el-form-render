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
    defaultValue: '',
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
        { label: 'BBB', value: 2 }
      ]
    },
    uiOn: {},
    colSpan: 12
  },
  {
    slot: 'getListButton',
    colSpan: 12
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
