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
/* 1.原理：自定义组件上绑定了v-model=searchText,会被解析为
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
  let _activeNames = [...activeNames.value ]
  if (props.accordion) {
    _activeNames= [ _activeNames[0] === item ? '' : item ]
  } else {
    const index = _activeNames.indexOf(item)
    if ( index > -1) {
      // content由显示 ==> 不显示
      _activeNames.splice(index, 1);
    } else {
      // content由不显示 ==> 显示
      _activeNames.push(item)
    }
  }
  /**
   * activeNames.value是通过provide传递给子组件
   * 子组件使用inject接受数据,每个子组件实例是共享同一份对象的(类似vuex)
   * provide/inject的响应式：
   *   死数据非响应式,父组件数据变化子组件不变
   *   ref和reactive的响应式数组,父组件数据变化子组件变化,子组件数据变化需要事件触发更改(单项数据流)
   *   
   *  emits('change', activeNames.value)在测试中发现了一个问题
   *  现象：如果每触发一次,查看一次结果发现传递的参数是正常的；
   *  现象：多次触发emits事件后,最后一起查看结果,发现传递的参数为一个值,为最后一次触发的值；
   *  原因：inject接受到的数据在各个子组件中是共享的,共同指向该对象所在的空间,因此测试在最后一起查看参数时,会变成最后一次触发的值
   *  解决方案：
   *    函数开始时：声明局部变量(存在于每个组件实例自己的内存空间中)接受inject的数据activeNames.value
   *    函数结束时：将操作后的局部变量的重新赋值给activeNames.value(请在函数末尾修改)),将局部变量作为参数传递给emits
   */ 
  activeNames.value = [ ..._activeNames ]
  emits('update:modelValue', _activeNames)
}

provide(collapseContextKey, {
  activeNames,
  handleItemClick
})
</script>
