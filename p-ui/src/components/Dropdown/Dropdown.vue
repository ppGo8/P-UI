<template>
  <div
    class="pp-dropdown"
  >
    <Toooltip
      :trigger="trigger"
      :manual="manual"
      :placement="placement"
      :popper-options="popperOptions" 
      :open-delay="openDelay"
      :close-delay="closeDelay"
      @visible-change="visibleChangeHandler"
      ref="tooltipRef"
    >
      <!-- trigger区域的插槽,在tooltip中也为默认插槽 -->
      <slot/>
      <!-- popper区域的插槽,在tooltip中为poper区域的插槽; -->
      <!-- Dropdwon仅允许外界传入下拉菜单数组或vnode,然后在这里主动传递显式插槽到Tooltip组件中; -->
      <template #content>
        <ul class="pp-dropdowb__menu">
          <template v-for="item in menuOptions" :key="item.key">
            <li
              v-if="item.divided"
              role="separator"
              class="pp-dropdown__item__divided"  
            ></li>
            <li
              class="pp-dropdwon__item"
              :class="{
                'is-disabled': item.disabled,
                'is-divided': item.divided
              }"
              :id="`dropdown-item-${item.key}`"
              @click="itemClickHandle(item)"
            >
              <!-- {{ item.label }} 这样写不能解析vnode语法 -->
              <RenderVnode :v-node="item.label" />
            </li>
          </template>
        </ul>
      </template>
    </Toooltip>
  </div>
</template>
<script setup lang="ts">
import type { DropdwonProps, DropdownEmits, DropdownInstance, MenuOption } from './types';
import type { TooltipInstance } from '../Tooltip/types'
import Toooltip from '../Tooltip/Tooltip.vue'
import type { Ref } from 'vue';
import { ref } from 'vue';
import RenderVnode from '../Common/RenderVnode'

defineOptions({
  name: 'PpDropdown'
})

const props = withDefaults(defineProps<DropdwonProps>(), { hideAfterClick: true })
const emits = defineEmits<DropdownEmits>()

const tooltipRef = ref() as Ref<TooltipInstance>

const visibleChangeHandler = (value: boolean) => {
  emits('visible-change', value) // 继续触发外层使用Dropdown组件的visible-change事件
}
const itemClickHandle = (item: MenuOption) => {
  if(item.disabled) return 
  emits('select', item)
  if(props.hideAfterClick) {
    tooltipRef.value.closePopper();
  }
}

/**
 * setup执行时机在所有生命周期之前,所以一开始传递到外面的tooltipRef为空
 * 使用闭包，传递给show一个函数,当调用用户在dom上点击(此时已经有了dom),vue执行show和close函数
 * 此时使用的就是 tooltipRef.value?.openPopper() 
 */
defineExpose<DropdownInstance>({
   open: () => tooltipRef.value?.openPopper(),
   close: () => tooltipRef.value?.closePopper()
})
</script>
