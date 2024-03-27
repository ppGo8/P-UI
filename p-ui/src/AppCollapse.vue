<!-- Collapse -->
<template>
  <Collapse v-model="activeItem" accordion>
    <CollapseItem name="a" title="a">
      我是a
    </CollapseItem>
    <CollapseItem name="b" title="b">
      我是b
    </CollapseItem>
    <CollapseItem name="c" title="c">
      我是c
    </CollapseItem>
  </Collapse>
</template>

<script lang="ts" setup>
import { ref  } from 'vue'
import Collapse from './components/Collapse/Collapse.vue'
import CollapseItem from './components/Collapse/CollapseItem.vue'
const activeItem = ref(['a'])
</script>
