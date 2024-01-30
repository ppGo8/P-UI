<template>
  <div
    v-show="visible"
    class="pp-message"
    :class="{
      [`pp-message--${type}`]: type,
      'is-close': showClose
    }"
    role="alert"
    ref="messageRef"
    :style="cssStyle"
  >
    <div class="pp-message__content">
      <!-- 允许用户通过模板或者属性传递string/vnode过来 -->
      <!-- 模板优先级 > 属性优先级 -->
      <slot>
        <RenderVnode 
          v-if="message"
          :v-node="message"
        />
      </slot>
    </div>
    <!-- 关闭按钮 -->
    <div
      v-if="showClose"
      class="pp-message__close"
    >
      <Icon @click="closeHandler" icon="xmark" />
    </div>
    {{selfTopOffset}} {{selfHeight}} {{ selfBottomOffset}} {{ lastOffset }}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import type { MessageProps } from './types'
import RenderVnode from '../Common/RenderVnode'
import Icon from '../Icon/Icon.vue'
import { getLastBottomOffset } from './Message'

const props = withDefaults(defineProps<MessageProps>(), {
  duration: 3000,
  type: 'info',
  offset: 20
})

const visible = ref(false)

const messageRef = ref<HTMLDivElement>();
// const lastInstance = getLastInstance()
// 自己的高度
// (此时还没有挂载,不知道具体高度,在onMounted中可以获取到真正的高度)
const selfHeight = ref(0)
// 上一个实例最下面的高度
const lastOffset = computed(() => {
  // console.info('函数调用处', props.id)
  return getLastBottomOffset(props.id)
})
// 该元素应该使用的topOffset
const selfTopOffset = computed(() => lastOffset.value + props.offset)
// 给下一个元素使用的高度,需要暴露出去
const selfBottomOffset = computed(() => selfTopOffset.value + selfHeight.value) 
// 生成自己的css样式
const cssStyle = computed(()=> ({
  top: selfTopOffset.value + 'px'
}))
function startTimer() {
  if(props.duration === 0) return
  setTimeout(() => {
    visible.value = false
  }, props.duration)
}
const closeHandler = () => {
  visible.value = false
}
onMounted(async () => {
  visible.value = true
  startTimer()
  // 要等待dom节点  visible.value = true 更新完毕显示出来；否则是同步代码dom还没有更新
  await nextTick()
  selfHeight.value = messageRef.value!.getBoundingClientRect().height 
  // getBoundingClientRect可以获取一个方法的各个内容
})
watch(visible, (newValue) => {
  // message弹窗关闭时,销毁组件
  // 不是通过v-if自动销毁,而是需要完全做到手动控制
  if(newValue === false) {
    props.onDestroy();
  }
})

// 需要暴露出自己的属性,给后面使用
defineExpose({
  selfBottomOffset
})
</script>

<style>
.pp-message {
  width: max-content;
  /* 固定定位,相当于视窗 */
  position: fixed; 
  top: 20px;
  /* left: 50%; */
  border: 1px solid red;
  display: inline-block;
}
</style>
