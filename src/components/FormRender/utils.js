import nestedProperty from 'nested-property'

export function setNestedProperty (target, prop, val) {
  return nestedProperty.set(target, prop, val)
}

export function getNestedProperty (target, prop) {
  return nestedProperty.get(target, prop)
}
