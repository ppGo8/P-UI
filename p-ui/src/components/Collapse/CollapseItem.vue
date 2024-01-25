<template>
  <div
    class="pp-collapse-item"
    :class="{
      'is-disabled': disabled,
      'is-active': isActive
    }"
  >
    <div
      class="pp-collapse-item__header"
      :id="`item-header-${name}`"
      @click="handleClick">
      <!-- 功能: 
        1. 通过prop传递简单的title,使用模板字符串渲染;
        2. 支持传递复杂的title,以slot传递和渲染
        3. 当以slot的方法传递复杂内容时,隐藏模板字符串渲染的title
           实现方法：插槽的**默认值**,当使用插槽时则会有内容覆盖默认值；当未使用插槽时, 渲染插槽中的默认值
      -->
      <slot name="title">{{ title }}</slot>
    </div>
    <div 
      v-show="isActive"
      class="pp-collapse-item__content" 
      :id="`item-content-${name}`"
    >
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { CollapseItemPopps } from './types'
import { inject, computed } from 'vue';
import { collapseContextKey } from './types'

// 定义组件
defineOptions({
  name: 'PpCollapseItem'
})

// 接受数据
const props = defineProps<CollapseItemPopps>()
const collapseContext = inject(collapseContextKey) // 无需显示声明Inject接受的类型, 使用了InjectionKey后此处会类型推导

// content是否显示
const isActive = computed(()=> collapseContext?.activeNames.value.includes(props.name)) 
// 点击header触发
const handleClick = () => {
  if (props.disabled) return
  collapseContext?.handleItemClick(props.name)
}
</script>