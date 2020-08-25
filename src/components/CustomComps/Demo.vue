<template>
  <div>
    <h3>测试自定义组件注册和使用</h3>
    <p>
      {{value}}
    </p>
    <button @click.stop.prevent="clickHandler">change</button>
  </div>
</template>

<script>
export default {
  name: 'Demo',
  props: ['value'],
  methods: {
    clickHandler () {
      this.$emit('input', this.value + '1') // '01'
    }
  }
}
</script>
