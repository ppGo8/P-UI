<template>
    <Switch v-model="test" inactive-value="left" active-value="right" :active-text="'on状态'" :inactive-text="'off状态'"/>
    <div></div>
    <Switch v-model="test"/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Switch from './components/Switch/Switch.vue';

const test = ref('heihie');
</script>
