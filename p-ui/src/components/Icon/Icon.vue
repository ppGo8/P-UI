<template>
  <i 
    class="pp-icon"
    :class="{[`pp-icon--${type}`] : type }"
    :style="customStyles"
    v-bind="$attrs"
  >
    <!-- v-bind="$props"作用: 接收父组件传递的所有props, 注意只能接受子组件已经声明的props 透传的属性不可以 -->
    <!-- v-bind的值为一个对象,该对象中的每一个键值对会被解析为v-bind:key = value -->
    <font-awesome-icon v-bind="filterProps"/>
    <!-- {{ $props }} -->
  </i>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { omit } from 'lodash-es';
// vue3.3可直接导入第三方库的类型 ts不提示报错,但是实际不能使用
// import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'
import type { FontIcons } from './types'
const props = defineProps<FontIcons>()
// 注意:基于响应式数据如props的操作应该要包装的computed中
const filterProps = computed(()=> omit(props, ['type', 'color'])) // font-awesome-icon不支持这两个属性,因此排除
const customStyles = computed(() => {
  return props.color ? { color: props.color } : {}
})
defineOptions({
  name:'PpIcon',
  inheritAttrs: false // 修改数据透传默认行为: 传递到子组件的根目录下;
})
</script>

<style scoped>

</style>