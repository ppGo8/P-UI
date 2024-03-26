<template>
  <div
    class="pp-input"
    :class="{
      [`pp-input--${type}`]: type,
      [`pp-input--${size}`]: size,
      'is-disabled': disabled,
      'is-prepend': $slots.prepend,
      'is-append': $slots.append,
      'is-prefix': $slots.prefix,
      'is-suffix': $slots.suffix,
      'is-focus': isFocus,
    }"
  >
  <!-- $slots.插槽名的作用：判断父组件是否有使用对应的子组件插槽；如果没有使用那么值为undefined
    $slot.default 默认插槽
    $slot.xxx 具名插槽的插槽名
  -->

    <!-- 1.input区域 -->
    <template v-if="type !== 'textarea'">
      <!-- prepend slot -->
      <div v-if="$slots.prepend" class="pp-input__prepend">
        <slot name="prepend"/>
      </div>

      <!-- input inner -->
      <div class="pp-input__wrapper">
        <span
          v-if="$slots.prefix"
          class="pp-input__prefix"
        >
          <slot name="prefix"/>
        </span>
        <!-- 需求：input上除了支持自己在ts的定义和声明属性,
                  应该还支持自己没有声明，但是原生input标签支持的属性
             解决方法：数据透传，1.禁用透传属性自动到根节点 2.将透传属性写在核心标签input上
             -->
        <input
          class="pp-input__inner" 
          :type="showPassword ?  (isPasswordVisible ? 'text' : 'password') : type"
          ref="inputRef"
          :disabled="disabled"
          v-model="innerValue"
          v-bind="attrs"
          :readonly="readonly"
          :autocomplete="autocomplete"
          :placeholder="placeholder"
          :autofocus="autofocus"
          :form="form"
          @input="handlerInput"
          @change="handleChange"
          @focus="handlerFocus"
          @blur="handlerBlur"
        />
        <span
          v-if="$slots.suffix || isShowClearIcon || isShowPasswordEyeIcon"
          class="pp-input__suffix"
        >
          <slot name="suffix" />
          <!-- @mousedown.prevent="() => {}"
              问题：点击叉符号时(位于input框外部的节点)，input输入框失去焦点。
              原因：默认行为，点击某个具有焦点的框的其他元素事，源框就会失去焦点
              解决方法：@mousedown.prevent="() => {}" 用来阻止默认行为。
                 写在哪里：希望点击谁之后源输入框不失去焦点就写在谁身上，这里写在叉号上
          -->
          <Icon 
            icon="circle-xmark"
            v-if="isShowClearIcon"
            class="pp-input__clear"
            @click="handlerClearIconClick"
            @mousedown.prevent="() => {}"
          />
          <Icon 
            icon= "eye"
            v-if= "isShowPasswordEyeIcon && isPasswordVisible"
            class= "pp-input__password"
            @click = "togglePasswordVisible"
          />
          <Icon 
            icon="eye-slash"
            v-if="isShowPasswordEyeIcon && !isPasswordVisible"
            class="pp-input__password"
            @click="togglePasswordVisible"
          />
        </span>
      </div>

      <!-- append slot -->
      <div v-if="$slots.append" class="pp-inpur__append">
        <slot name="append"/>
      </div>
    </template>

    <!-- 2.textarea区域 -->
    <template v-else>
      <textarea 
        ref="inputRef"
        class="pp-textarea__wrapper"
        :disabled="disabled"
        v-model="innerValue"
        v-bind="attrs"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :form="form"
      />
    </template>

  </div>
</template>

<script setup lang="ts">
import type { InputProps, InputEmits } from './types';
import { ref, watch, computed, useAttrs, nextTick } from 'vue';
import type { Ref } from 'vue';
import Icon from '../Icon/Icon.vue';

defineOptions({
  name:'PpInput',
  inheritAttrs: false
})

const inputRef = ref() as Ref<HTMLInputElement>;

const props = withDefaults(defineProps<InputProps>(), { 
  type: 'text',
  autocomplete: 'off'
})
const attrs = useAttrs(); // 使用v-bind展开透传对象；v-bind绑定一个对象会自动把该对象的每一个key:value解析为： v-bind:key = value
const emits = defineEmits<InputEmits>();

const innerValue = ref(props.modelValue); // 原生input标签绑定的值
const isFocus = ref(false); 
const isShowClearIcon = computed(() => {  
  // 显示条件： 1.开始clearable 2.获取焦点 3.有值 4.不为disable
  return props.clearable && isFocus.value && !!innerValue.value && !props.disabled
})
const isPasswordVisible = ref(false); // 密码显示为 **** 还是显示内容; 由右侧眼睛icon控制，默认不显示内容
const isShowPasswordEyeIcon = computed(() => {
  return props.showPassword && !props.disabled && !!innerValue.value && isFocus
})

// 实现自定义组件(父组件绑定在这个自定义的input vue组件上)v-model双向绑定
// 用户修改数据流向组件实例, 修改数据到父组件给子组件使用的数据中
const handlerInput = () => {
  emits('update:modelValue', innerValue.value);
  emits('input', innerValue.value);

}
// 父组件处直接修改传递给 子组件的props数据值 子组件响应
watch(() => props.modelValue, (newValue) => {
  innerValue.value = newValue;
})

const handleChange = () => {
  emits('change', innerValue.value);
}
const handlerFocus = (event: FocusEvent) => {
  isFocus.value = true;
  emits('focus', event);
}
const handlerBlur = (event: FocusEvent) => {
  isFocus.value = false;
  emits('focus', event);
}
const handlerClearIconClick = () => {
  // 注意：
  // 在用户界面/组件内部修改自定义组件“上” 双向绑定的值
  // 都需要重新发射给父组件 让父组件的值也发生变化
  console.log('@清空');
  innerValue.value = '';
  emits('update:modelValue', '');
  emits('clear');
  emits('input', '');
  emits('change', '');
}
const togglePasswordVisible = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
  // 点击眼睛后 重新获得焦点
  keepFocus();
}
// 点击 是否显示密码icon后 依旧保持焦点
const keepFocus = async () => {
  // 需要等待所有dom完成更新后进行操作
  await nextTick();
  /* isFocus.value = true; 
    这样写并不会让input获得焦点
    isFoucs的作用：当前是否获得焦点，当触发Foucs或Blur事件时调用回调函数改变其值 
    改变方法：编程式触发foucs事件
  */
  inputRef.value.focus(); // js触发dom的focus事件 模拟用户操作
}

// 暴露组件
defineExpose({
  ref: inputRef
})
</script>
