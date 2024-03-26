<template>
  <!-- 带清空功能 -->
  <Select 
    v-model="test"
    placeholder="请输入内容"
    :options="option2"  
    clearable
  >
  </Select>
  <br />

  <!-- 自定义模板 -->
  <Select 
    v-model="test"
    placeholder="请输入内容"
    :options="option2"
    :renderLabel="customRender"
    clearable
  >
  </Select>
  <br />
  
  <!-- 支持输入筛选 -->
  <Select 
    v-model="test"
    placeholder="请输入内容"
    :options="option2"
    clearable
    filterable
  >
  </Select>
</template>

<script setup>
import { ref, reactive, h} from 'vue';
import Select from '@/components/Select/Select.vue';

const test = ref('3');
const option2 = [
  {label: 'a', value: '1'},
  {label: 'b', value: '2'},
  {label: 'c', value: '3'},
]

const customRender = (option) => {
  return h('div', { className: 'xyz'}, [ h('span', option.label) , h('span', option.value)])
}
</script>

<style>
/* 样式修改 */
.pp-select-menu__item , .xyz{
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
</style>