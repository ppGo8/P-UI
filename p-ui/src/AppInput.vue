<template>
    <!-- <Input v-model="test" placeholder="基础文本框，请输入" /> -->
    <Input v-model="test" clearable placeholder="输入字符以后可以点击清空"/>
    <!-- <Input v-model="test" placeholder="prepend append">
      <template #prepend>Https://</template>
      <template #append>.com</template>
    </Input>

    <Input v-model="test" placeholder="prefix suffix">
      <template #prefix>
        <Icon icon="fa-user" />
      </template>
      <template #suffix>
        <Icon icon="fa-user" />
      </template>
    </Input> -->
    <Input v-model="test" type="text" :showPassword="true"/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Input from './components/Input/Input.vue';
const test = ref('')

</script>
