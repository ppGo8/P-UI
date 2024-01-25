<script setup lang="ts">
import Button from './components/Button/Button.vue'
import Icon from './components/Icon/Icon.vue'
</script>

<template>
  <main v-if="true">
    <h1>Button按钮</h1>
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
  </main>

  <main>
    <h1>Icon图标</h1>
    <Icon icon="arrow-up"/>
    <Icon icon="arrow-up" color="red"/>
    <Icon icon="arrow-up" type="danger"/>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
