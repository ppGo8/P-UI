<template>
  <div
    class="pp-collapse"
  >
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { ref, provide, watch } from 'vue'
import type { NameType, CollapsePopps, CollapseEmits } from './types'
import { collapseContextKey } from './types'

defineOptions({
  name: 'PpCollapse'
})

const props = defineProps<CollapsePopps>();
/* 1.原理：自定义组件上绑定了v-model,会被解析为
     :modelValue='searchText'
     @update:modelValue = '(newValue )=>{ searchText = newValue }'
   2.在自定义组件上实现双向绑定过程
     2.1 写v-model <Custom v-model='var'> 
         底层会自动解析为：
           :modelValue='var'
           @update:modelValue = '(newValue )=>{ var = newValue }'
     2.2 在Cunstom内部emit调用@update:modelValue,传递新值给使用Custom
           通常都是由用户触发click、input等事件(双向绑定 从UA流向底层),然后执行一个回调函数,
           在这个用户事件的回调函数中执行emit触发@update:modelValue
*/
const emits = defineEmits<CollapseEmits>(); 

// 被激活的子组件,存储name的数组
// activeNames基于props得到值,只会在vc首次加载的时候执行
// 后续在运行过程中如果父组件作为props变量发生变化,子组件没有再次调用语句重新读取赋值,所以依旧为旧数据
// 解决办法：watch监听
const activeNames = ref<NameType[]>(props.modelValue)
watch(() => props.modelValue, ()=> activeNames.value = props.modelValue) // 当porps变化时,子组件处也及时响应
if (props.accordion && activeNames.value.length > 1) {
  console.warn('手风琴模式只能有一个被激活项！')
}
const handleItemClick = (item: NameType) => {
  if (props.accordion) {
    activeNames.value = [ activeNames.value[0] === item ? '' : item ]
  } else {
    const index = activeNames.value.indexOf(item)
    if ( index > -1) {
      // content由显示 ==> 不显示
      activeNames.value.splice(index, 1);
    } else {
      // content由不显示 ==> 显示
      activeNames.value.push(item)
    }
  }
  emits('update:modelValue', activeNames.value)
  // emits('change', activeNames.value)
}

provide(collapseContextKey, {
  activeNames,
  handleItemClick
})
</script>