<template>
  {{ name }}
</template>
<script setup>
import { ref } from 'vue'
const name = ref("张三")
const sayName = ()=>{
  console.log("我叫 "+name.value)
}
defineExpose({
  name,
  sayName
});
</script>