<template>
  <div
    class="pp-form-item"
    :class="{
      'is-error': validateStatus.state === 'error',
      'is-success': validateStatus.state === 'success',
      'is-loading': validateStatus.loading,
      'is-required': isRequied,
    }"
  >
    <!-- 1.需求：label区域支持用户自定义UI 方案：插槽 
            作用域插槽作用：允许父组件插槽处使用来自子组件的数据
            其实这里不使用作用域插槽也可以，因为label的值本身就来源于父组件
         2.需求：不传插槽显示label字符串 方案：插槽默认值-->
    <label class="pp-form-item__label">
      <slot name="label" :label="label">
        {{ label }}
      </slot>
    </label>
    <div class="pp-form-item__content">
      <slot></slot>
      <!-- 单条验证失败 错误信息 -->
      <div 
        v-if="validateStatus.state === 'error'"
        class="pp-form-item__error-msg"
      >
        {{ validateStatus.errorMessage }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormItemProps, FormValidateFailure, formItemContext, ValidateStatusTyp, FormItemInstance } from './types'; 
import { formContextKey, formItemContextKey } from './types'
import { inject, computed, reactive, provide, onMounted, onUnmounted } from 'vue';
import { isNil } from 'lodash-es';
import Schema from 'async-validator';

defineOptions({
  name: 'PpFromItem'
})

const props = defineProps<FormItemProps>();
// form表单上绑定的全部数据
const formContext = inject(formContextKey);
// 该formitem上绑定的的数据 
const innerValue = computed(()=> {
  const model = formContext?.model;
  if (model && props.prop && !isNil(model[props.prop]) ) {
    return model[props.prop];
  }
  return null; // 没传递数据、不需要判断规则、为undefind或null
})
// 该formitem上绑定的规则
const itemRules = computed(()=> {
  const rules = formContext?.rules;
  if (rules && props.prop && rules[props.prop] ) { // rules[props.prop]条件必须写在最后面：rules不为空且props.prop不为空
    return rules[props.prop];
  }
  return null;
})
// rules规则验证状态
const validateStatus: ValidateStatusTyp = reactive({
  state: 'init', // 初始状态init、成功success、失败failed
  errorMessage: '', 
  loading: false, // 用于异步请求的验证，是否正在加载中
})
// 表单初始数值(挂载)
let initialValue: any = null;
// 表单是否必填
const isRequied = computed(() => {
  // 只有有一项为required就是true
  return itemRules.value?.some(rule => rule.required);
})

// 清空验证状态
// 具体效果：已经验证了的会有错误的提示 清空下面的提示 重置到未验证状态
const clearValidate = () => {
  validateStatus.state = 'init';
  validateStatus.errorMessage = '';
  validateStatus.loading = false;
}
// 恢复到表单最开始的状态（组件挂在时的初始状态）
const resetField = () => {
  // 清空已经验证的状态
  clearValidate();
  // 恢复数据
  // 本组件绑定的数据是通过 inject 得到数据 ，然后使用计算属性得到
  // 不能直接修改计算属性，而且要恢复数据需要父组件form、可能子组件input均修改数据
  // 所以修改inject得到的数据 model[props.prop]
  const model = formContext?.model; // inject 得到的数据
  if (model && props.prop && !isNil(model[props.prop])) {
    model[props.prop] = initialValue;
  }

}

// 获取某trigger下的验证规则
// 作用：在某triiger触发时，执行它对应的规则
// 特殊：1. 调用该函数没有传递trigger事件触发时机 什么时候什么都不传？在整个表单验证处，form 组件调用子组件的所有验证规则进行验证
//      2. 外部传递进来的某条规则没有写trigger，那么该规则会在自己写的 所有触发时机（input blur focus）中被触发一次
const getTriggerRules = (trigger?: string) =>  {
  const rules = itemRules.value;
  if (rules) {
    return rules.filter(ruleItem => {
      if (!trigger || !ruleItem.trigger) return true;
      return ruleItem.trigger === trigger;
    })
  }
  // 没有传验证规则进来 返回空数组
  return [];
}
// 在trigger时的验证方法
// 为了方便使用，全部返回Promise
const validate = async (trigger?: string) => {
  const modelName = props.prop;
  if(!modelName) return Promise.resolve(true);
  // 获取传递的trigger下的规则
  const triggerRules = getTriggerRules(trigger);
  // 提前终止条件：如果没有该trigge对应的规则，直接返回true 通过验证
  if (triggerRules.length === 0) return Promise.resolve(true); 
  const descriptor = {
    [modelName]: triggerRules,
  }
  const validator = new Schema(descriptor);
  validateStatus.loading = true;
  return validator.validate({ [modelName]: innerValue.value }) // validate中的对象是要验证的数据
    .then(()=> {
      validateStatus.state = 'success';
      validateStatus.errorMessage = '';
      return Promise.resolve(true);
    })
    .catch((e: FormValidateFailure) => {
      validateStatus.state = 'error';
      validateStatus.errorMessage = (e.errors && e.errors.length > 0) ? e.errors[0].message || '' : '' ;
      return Promise.reject(e.fields);
    })
    .finally(() => {
      validateStatus.loading = false;
    })
}

// formItemContent
// provid提供给子组件；
// 使用父组件form的addField提供给付组件
const formItemContent: formItemContext =  { 
  prop: props.prop || '',
  validate,
  clearValidate,
  resetField,
};
provide(formItemContextKey, formItemContent);

onMounted(() => {
  if (props.prop) {
    formContext?.addField(formItemContent);
  }
  initialValue = innerValue.value;
});
onUnmounted(() => {
  if (props.prop) {
    formContext?.removeField(formItemContent);
  }
})

// 暴漏组件
defineExpose<FormItemInstance>({
  validateStatus,
  validate,
  resetField,
  clearValidate,
})
</script>
