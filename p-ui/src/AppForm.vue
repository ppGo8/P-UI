<template>
  <pp-form ref="formRef" :model="model" :rules="rules">
    <pp-form-item label="姓名" prop="name">
      <template #label="{ label }">
        <pp-button> {{ label }} </pp-button>
      </template>
      <pp-input v-model="model.name" type="text" />
    </pp-form-item>
    <pp-form-item label="年龄" prop="age">
      <pp-input v-model.number="model.age" type="number" />
    </pp-form-item>
    <pp-form-item label="操作">
      <pp-button @click="submit">提交</pp-button>
      <pp-button @click="reset">重置</pp-button>
      <pp-button @click="clearValidate">清空规则</pp-button>
    </pp-form-item>
  </pp-form> 
</template>

<script setup lang="ts">
import PpForm from './components/Form/Form.vue';
import PpFormItem from './components/Form/FormItem.vue';
import PpButton from './components/Button/Button.vue';
import PpInput from './components/Input/Input.vue';
import { reactive, ref } from 'vue';
import type { FormInstance } from  './components/Form/types';

const model = reactive({ name: 'pp', age: 28});
const rules = reactive({
  name: [{ type: 'string', required: true ,trigger: 'blur'}],
  age: [{ type: 'number', required: true ,trigger: 'blur', min: 10,max: 100}]
} )

const formRef = ref<FormInstance>();
const submit = async () => {
  try {
    await formRef.value?.validate();
  } catch(e) {
    console.log('error',e);
  }
}
const reset = () => {
  formRef.value?.resetFields();
}
const clearValidate = () => {
  formRef.value?.clearValidate();
}
</script>

