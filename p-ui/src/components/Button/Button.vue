<template>
  <div>
    <button
      ref="_ref"
      class="pp-button"
      :class="{
        [`pp-button--${type}`]: type,
        [`pp-button--${size}`]: size,
        'is-plain': props.plain,
        'is-round': round,
        'is-circle': circle,
        'is-disabled': disabled
      }"
      :disabled="disabled"
      :autofocus="autofocus"
      :type="nativeType"
    >
      <slot></slot>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
defineOptions({
  name: 'PpButton'
})

// vue3.3支持defineProps使用从其他文件import type的类型
// vue3.2不支持 解决方法:1.可以使用外部导入的基于运行时的类型 2.使用Vue-Macro
import type { ButtonProps} from './types'
const props = defineProps<ButtonProps>()

// 暴露button dom给外部使用
const _ref = ref<HTMLButtonElement | null>(null)
defineExpose({ 
  ref: _ref 
})
</script>

<style scoped>

</style>