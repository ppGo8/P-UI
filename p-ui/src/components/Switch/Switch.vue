<template>
  <div 
    class="pp-switch"
    :class="{
      [`pp-switch--${size}`]: size,
      'is-disabled': disabled,
      'is-checked': checked
    }"
    @click="switchValue"
  >
    <!-- 实现方式：内部checkbox结合switch按钮 -->
    <input
      ref="ppInputRef"
      class="pp-switch__input"
      type="checkbox"
      role="switch"
      :name="name"
      :disabled="disabled"
      @keydown.enter="switchValue"
    />
    <!-- switch核心部分，使用的是css伪类实现的
         这个组件全程没有使用v-model绑定值
         而是根据事件和watch修改组件中的值，进而标签上的类名发生变化
    -->
    <div class="pp-swicth__core">
      <!-- 文字提示部分 -->
      <div class="pp-switch__core-inner">
        <p 
          v-if="activeText || inactiveText"
          class="pp-switch__core-inner-text"
        >
          {{ checked ? activeText : inactiveText}}
        </p>
      </div>
      <!-- 圆形按钮部分 -->
      <div class="pp-switch__core-action"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { SwitchProps, SwitchEmits } from './types';
defineOptions({
  name: 'PpSwitch',
  inheritAttrs: false
})

const props = withDefaults(defineProps<SwitchProps>(), {
  activeValue: true,
  inactiveValue: false,
});
const emits = defineEmits<SwitchEmits>();

// 父组件传递过来的开关的原始值
const innerValue = ref(props.modelValue); 
watch(() => props.modelValue, (newVal)=> { // 父组件处传递的值发生变化，子组件使用的数值要重新赋值
  innerValue.value = newVal;
})

// 是否被选中 checked
const checked = computed(() => {
  return innerValue.value === props.activeValue;
})
// 点击按钮
// 开关绑定的v-model变化，需要通知父组件的数据也改变
const switchValue = () => {
  if(props.disabled) return; // 细节处理
  const newInnerValue = checked.value ? props.inactiveValue : props.activeValue;
  innerValue.value = newInnerValue;
  emits('update:modelValue', innerValue.value); // 响应式到父组件中
  emits('change', innerValue.value); // 触发change事件 自己封装中没有在父组件中使用change事件；但是使用组件的人可能需要值发生改变时就进行操作，比如弹窗
}

// 实现联动状态 
// 方法1: 直接在input帮签上绑定 :checked="checked"
// 方法2: 在js中获取input的dom 然后手动修改checked属性 [此处使用方法2实现]
const ppInputRef = ref<HTMLInputElement>();
// 挂载时，input和switch状态同步
onMounted(()=> {
  ppInputRef.value!.checked = checked.value;
})
// 鼠标事件修改switch时，状态同步到input
watch(checked,(newVal)=> {
  ppInputRef.value!.checked = newVal;
})

</script>
