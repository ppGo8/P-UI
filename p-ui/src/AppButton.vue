<!-- Button -->
<template>
  <Button ref="buttonRef" type="success">Test Button</Button>
  <Button round>Round Button</Button>
  <Button plain >Plain Button</Button>
  <Button round>Round Button</Button>
  <Button circle>VK</Button>
  <Button disabled>Disabled Button</Button><br/><br/>
  <Button type="primary" disabled>Primary</Button>
  <Button type="success">Success</Button>
  <Button type="info">Info</Button>
  <Button type="warning">Warning</Button>
  <Button type="danger">Danger</Button><br/><br/>
  <Button type="primary" plain>Primary</Button>
  <Button type="success" plain>Success</Button>
  <Button type="info" plain>Info</Button>
  <Button type="warning" plain>Warning</Button>
  <Button type="danger" plain>Danger</Button><br/><br/>
  <Button size="large">Large</Button>
  <Button size="small">Small</Button><br/><br/>
  <Button size="large" loading type="success">slot</Button><br/><br/>    
  <Button size="large" loading icon="arrow-up" >Icon</Button><br/><br/>    
</template>

<script setup lang="ts">
import Button from './components/Button/Button.vue';
</script>