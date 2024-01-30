<!-- dropdown组件 -->
<template>
  <Dropdown ref="dropdownRef" :menu-options="options" manual>
    <Button>仅支持手动写方法触发下拉菜单</Button>
  </Dropdown>
  <Button @click="openD">显示下拉菜单</Button>
  <Button @click="closeD">关闭下拉菜单</Button>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'

import Button from './components/Button/Button.vue'
import Dropdown from './components/Dropdown/Dropdown.vue' // sfc定义的组件
// import Dropdown from './components/Dropdown/Dropdown' // jsx定义的组件

import type { DropdownInstance } from './components/Dropdown/types'
import type { MenuOption } from './components/Dropdown/types'

const options: MenuOption[] = [
  {key: 1, label: 'item1'},
  {key: 2, label: h('h2', 'this is h2')},
  {key: 3, label: 'item3', disabled: true},
  {key: 4, label: 'item4', divided: true}
]
let dropdownRef = ref<DropdownInstance | null>(null)

console.info(dropdownRef.value,)
const openD = () => {
  dropdownRef.value?.open()
}
const closeD = () => {
  dropdownRef.value?.close()
}

</script>