<!-- Tooltip -->
<template>
  <Tooltip trigger="hover" placement="right">
    <Button>悬浮显示</Button>
    <template #content>
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
    </template>
  </Tooltip>

  <!-- <Tooltip content="poper" placement="bottom-start" trigger="hover" :open-delay="1000" :close-delay="1000">
    <Button>hover打开和关闭延迟1s</Button>
  </Tooltip> 
  <br />

  <Tooltip content="我是popper的内容" :trigger="events" placement="right">
    <Button>click点击无延迟</Button>
  </Tooltip>
  <br />

  <Tooltip ref="tooltipRef" content="poper" placement="right" manual  trigger="click">
    <img src="./assets/test.jpg" a style="width: 200px;">
  </Tooltip> <br />
  <Button @click="open">仅支持手动显示popper</Button> 
  <Button @click="close">仅支持手动关闭popper</Button>
  <br /> -->
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from './components/Button/Button.vue'
import Tooltip from './components/Tooltip/Tooltip.vue'
import type { TooltipInstance } from './components/Tooltip/types'

let events = ref<'hover' | 'click'>('click')
const tooltipRef = ref<TooltipInstance | null>(null)
const open = () => {
  tooltipRef.value?.openPopper()
}
const close = () => {
  tooltipRef.value?.closePopper()
}

</script>
