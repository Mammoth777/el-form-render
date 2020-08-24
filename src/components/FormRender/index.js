import FormRender from './index.vue'

export function formatCfg (configList) {
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

export default FormRender
