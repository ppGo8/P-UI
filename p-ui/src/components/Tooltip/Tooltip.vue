<template>
  <!-- style="border: 10px solid pink;" -->
  <div
    class="pp-tooltip"
    ref="popperContainerNode"
    v-on="eventsParent"
  >
    <div
      ref="triggerNode"
      class="pp-tooltip__trigger"
      v-on="events"
    >
      <slot></slot>
    </div>
    <transition :name="transition">
      <div
        v-if="isOpen"
        ref="popperNode"
        class="pp-tooltip__popper"
      >
        <slot name="content">{{ content }}</slot>
        <div id="arrow" data-popper-arrow></div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import type { TooltipProps, TooltipEmits, TooltipInstance } from './types'
import type { Instance } from "@popperjs/core";
import { createPopper } from '@popperjs/core';
import { ref, watch, reactive, onUnmounted, computed } from 'vue';
import useClickOutside from '../../hook/useClickOutside';
import { debounce } from 'lodash-es';

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'top',
  trigger: 'hover',
  transition: 'popperFade',
  openDelay: 0,
  closeDelay: 0,
})
const emits = defineEmits<TooltipEmits>()

// 显示或隐藏Tooltip
let poperInstance: Instance // 显示poper的节点
const isOpen = ref(false); // 根据该变量的值进行操作
const popperNode = ref<HTMLElement>()
const triggerNode = ref<HTMLElement>()
const popperContainerNode = ref<HTMLElement>()
let events: Record<string, any> = reactive({});
let eventsParent: Record<string, any> = reactive({});
let openTimes = 0
let closeTimes = 0
// props.popperOptions中placement的优先级高于直接传递过来的props.placement,
// 因此将props.popperOptions写在了后面,会自动覆盖前面
const popperOptions = computed(() => {
  return {
    placement: props.placement,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 9],
        },
      }
    ],
    ...props.popperOptions
  }
})
const togglePopper = () => {
  if (isOpen.value) {
    closePopperDebuonceFinal();
  } else {
    openPopperDebuonceFinal()
  }
  emits('visible-change', isOpen.value);
}
const openPopper = () => {
  openTimes = openTimes + 1
  // console.info('openTimes', openTimes);
  isOpen.value = true;
  emits('visible-change', isOpen.value);
}
const closePopper = () => {
  closeTimes= closeTimes + 1
  // console.info('closeTimes', closeTimes)
  isOpen.value = false;
  emits('visible-change', isOpen.value);
}
// debounce第二个参数：延迟多少毫秒之后 执行回调函数
const openPopperDebuonce = debounce(openPopper, props.openDelay) 
const closePopperDebuonce = debounce(closePopper, props.openDelay) 
/**
 * 不使用cancel的情况
 * 当多次来回触发Hover的事件时,停下来,最后会触发两次
 * 第一次：和第二步相反,因为防抖是检测后面是否有事件触发,一直移动后,倒数第二次触发的事件后面只有最后一次没防抖，它的回调函数会被放在任务队列中等待执行
 * 第二次：当前鼠标悬浮的事件，如开，在其中取消了上次的任务
 */
const openPopperDebuonceFinal = () => {
  closePopperDebuonce.cancel() // 取消延迟函数 
  openPopperDebuonce()
} 
const closePopperDebuonceFinal = () => {
  openPopperDebuonce.cancel()  // 取消延迟函数
  closePopperDebuonce()
} 
// 根据外部传进来的trigger参数,动态绑定事件
const attachEvent = () => {
  if(props.trigger === 'hover') {
    events['mouseenter'] = openPopperDebuonceFinal;
    eventsParent['mouseleave'] = closePopperDebuonceFinal; // 绑定在父元素上, 实现：从triggle移到popper上,popper也不会消失
  } else {
    events['click'] = togglePopper;
  }
}
if(!props.manual) {
  attachEvent();
}

// 当click显示poper时,此时点击外部任意地方都将关闭popper
const useClickOutsideFn = () => {
  useClickOutside(popperContainerNode, () => {
    if( props.trigger === 'click' && isOpen.value && !props.manual) {
      closePopper();
    }
    // 触发事件 允许外部进行一定的业务逻辑处理
    if (isOpen.value) {
      emits('click-outside', true);
    }
  })
}
useClickOutsideFn()
watch(()=> props.manual, (newValue) => {
  if(newValue) {
    // 清空事件列表
    events = {}
    eventsParent = {}
  } else {
    // 注册事件列表
    attachEvent()
    useClickOutsideFn()
  }
})
watch(()=> props.trigger, (newValue, oldValue) => {
  if(newValue !== oldValue) {
    events = {} // 清空原事件
    attachEvent(); // 重新设置绑定事件
  }
})
// 控制显示和隐藏的业务逻辑
watch(isOpen, (newValue) => {
  if(newValue) {
    if(triggerNode.value && popperNode.value) {
      // 使用js方法明显操作界面
      poperInstance = createPopper(triggerNode.value, popperNode.value, popperOptions.value)
    }
  } else {
    // 销毁,取消显示 此处业务逻辑需要修改
    // poperInstance?.destroy() // 并没有在dom更新后执行
    // console.info('销毁')
  }
}, { flush: 'post' })

onUnmounted(() => {
  poperInstance?.destroy();
})

defineExpose<TooltipInstance>({
  openPopper: openPopperDebuonceFinal,
  closePopper: closePopperDebuonceFinal,
})
</script>
