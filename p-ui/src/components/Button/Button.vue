<template>
  <button
    ref="_ref"
    class="pp-button"
    :class="{
      [`pp-button--${type}`]: type,
      [`pp-button--${size}`]: size,
      'is-plain': props.plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
      'is-loading': loading
    }"
    :disabled="disabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
  >
    <Icon icon="spinner" spin v-if="loading"/>
    <Icon :icon="icon" v-if="icon"/>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Icon from '../Icon/Icon.vue'
defineOptions({
  name: 'PpButton'
})

// vue3.3支持defineProps使用从其他文件import type的类型
// vue3.2不支持 解决方法:1.可以使用外部导入的基于运行时的类型 2.使用Vue-Macro
import type { ButtonProps} from './types'
import type { icon } from '@fortawesome/fontawesome-svg-core';
const props = defineProps<ButtonProps>()

// 暴露button dom给外部使用
const _ref = ref<HTMLButtonElement | null>(null)
defineExpose({ 
  ref: _ref 
})
</script>

<style scoped>

</style>