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
      :class="{
        'is-disabled': disabled,
        'is-active': isActive
      }"
      :id="`item-header-${name}`"
      @click="handleClick">
      <!-- 功能: 
        1. 通过prop传递简单的title,使用模板字符串渲染;
        2. 支持传递复杂的title,以slot传递和渲染
        3. 当以slot的方法传递复杂内容时,隐藏模板字符串渲染的title
           实现方法：插槽的**默认值**,当使用插槽时则会有内容覆盖默认值；当未使用插槽时, 渲染插槽中的默认值
      -->
      <slot name="title">{{ title }}</slot>
      <Icon 
        icon="angle-right"
        class="header-angle" 
      />
    </div>
    <!-- v-on绑定一个对象,其中的每一个key:value会被解析为 @key=value的形式 -->
    <Transition name="slide"  v-on="transitionEvents">
      <!-- 外面嵌套一层wrapper的原因
        1.为了实现content展开和收起的动画效果: 监听height属性实现变化
        2.但是content元素自己上还有padding(必须要设置的UI效果),只监听height padding会直接出现
        3.解决方法：考虑到只能监听height,那把content嵌套在一个父元素中,这个父元素不设置任何padding,这样检测复原的height变化即可
      -->
      <div
        v-show="isActive"
        class="pp-collapse-wrapper"
        >
        <div 
          class="pp-collapse-item__content" 
          :id="`item-content-${name}`"
        >
          <slot></slot>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import type { CollapseItemPopps } from './types'
import { inject, computed } from 'vue'
import { collapseContextKey } from './types'
import Icon from '../Icon/Icon.vue'

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

// vue+js实现不定高度的动画效果
const transitionEvents: Record<string, (el: HTMLElement) => void> = {
  beforeEnter(el) {
    el.style.height = '0px'
    /**
     * 使用overflow的原因：
     *   默认情况：子元素高度高于父元素,子元素的内容也会完整显示
     *   现实情况：当使用动画效果时，父元素的height会不断变下或变大,但是子元素内容却一直显示**直到整个父元素消失**
     *   需求: 想要子元素的内容只显示父元素动画已经显示出来的内容/残留的内容,因此使用overflow
     */
    el.style.overflow = 'hidden'
  },
  enter(el) {
    el.style.height = `${el.scrollHeight}px`
  },
  afterEnter(el) {
    // css属性写成'', 代表删除属性显示设置,恢复默认值: 即由元素内容及文本撑开盒子
    el.style.height = ''
    el.style.overflow = ''
  },
  beforeLeave(el) { 
    el.style.height = `${el.offsetHeight}px`
    el.style.overflow = 'hidden'
  },
  leave(el) {
    el.style.height = '0px'
  },
  afterLeave(el) {
    el.style.height = ''
    el.style.overflow = ''

  }

}
</script>