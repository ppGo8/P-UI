<template>
  <div
    class="pp-form"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { FormProps, FormContext ,formItemContext, FormValidateFailure, FormInstance} from './types';
import type { ValidateFieldsError } from 'async-validator';
import {  formContextKey } from './types'; // 不是类型 而是const声明的常量
import { provide } from 'vue';

defineOptions({
  name: 'PpFrom'
})

const props = defineProps<FormProps>();
// fields: 存储子组件formitem上的验证字段、验证方法
const fields: formItemContext[] = []; // 存储了所有子组件上的验证方法
const addField: FormContext['addField'] = (field: formItemContext) => {
  fields.push(field)
}
const removeField: FormContext['removeField'] = (field: formItemContext) => {
  // field 每个子组件上的验证方法
  // 自己子组件调用add和remove传进来的都是一个field 因此可以这样删除
  fields.splice(fields.indexOf(field), 1);
}

// 整个表单验证
const validate = async () => {
  // 此处只要组件验证后的error.fields的数据
  let validationErrors : ValidateFieldsError = {}; // key是验证规则的属性名，value是错误信息
  // 循环调用各个验证，还可以使用promise.allSettled
  for (const filed of fields) {
    try {
      await filed.validate(''); // 传空值 表示验证所有规则
    } catch(e) {
      const error = e as FormValidateFailure['fields']; // 因为在catch的参数中无法直接定义类型
      validationErrors = {
        ...validationErrors,
        ...error
      }
    }
  }
  // 验证成功
  if (Object.keys(validationErrors).length === 0) {
    return Promise.resolve(true);
  } // 验证失败
  else {
    return Promise.reject(validationErrors);
  }
}

// 表单重置为初始状态
// 允许传递字符串数组决定重置哪几个值和规则
const resetFields = (keys: string[] = []) => {
  const filterArr = keys.length > 0 ? fields.filter(field => keys.includes(field.prop)) : fields;
  filterArr.forEach(field => field.resetField()); // 执行筛选出来的数组的方法
}

// 表单清空验证规则
// 允许传递字符串数组决定清空哪几个值的规则
const clearValidate = (keys: string[] = []) => {
  const filterArr = keys.length > 0 ? fields.filter(field => keys.includes(field.prop)) : fields;
  filterArr.forEach(field => field.clearValidate()); // 执行筛选出来的数组的方法
} 

// 提供数据给formitem组件
provide(formContextKey, {
  ...props, // 绑定在自身的 model 和 rules
  addField,
  removeField,
});

// 暴露整个表单的验证方法，给外部的方法使用
defineExpose<FormInstance>({
  validate,
  resetFields,
  clearValidate
})
</script>
