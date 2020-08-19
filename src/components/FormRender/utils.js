import nestedProperty from 'nested-property'
import isFunction from 'lodash/isFunction'
import kebabCase from 'lodash/kebabCase'
import isNumber from 'lodash/isNumber'

// 执行链表
class ExecLinkedList {
  constructor (count = 0) {
    if (!isNumber(count) || count < 2) {
      throw new TypeError('count需为number类型, 且大于2')
    }
    this.count = count
    this.list = new Array(count)
  }

  /**
   * 设置执行顺序
   */
  set (val, execIndex) {
    if (!val || !isFunction(val)) {
      throw new Error('val必须为function')
    }
    if (execIndex === undefined) {
      this.list.push(val)
    } else if (isNumber(execIndex) && execIndex < this.count) {
      this.list[execIndex] = val
    } else {
      throw new TypeError('execIndex需为number或undefined, 且小于传入的coun队列长度')
    }
    this._exec()
  }

  /**
   * 执行队列内函数
   */
  _exec () {
    const length = this.list.filter(v => v).length
    if (length === this.count) {
      console.log('exec')
      this.list.forEach(fn => fn())
      this.list = []
    }
  }
}

/**
 * 创造一个定长的执行链表, 当链表填满后, 依次执行其中的同步函数
 * @param {number} count 执行队列长度
 */
export function createExecList (count) {
  return new ExecLinkedList(count)
}

export function setNestedProperty (target, prop, val) {
  return nestedProperty.set(target, prop, val)
}

export function getNestedProperty (target, prop) {
  return nestedProperty.get(target, prop)
}

export const toKebabCase = kebabCase // 字符串转连接符格式  firstName => first-name
