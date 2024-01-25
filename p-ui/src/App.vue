<script setup lang="ts">
import { ref } from 'vue'
import Button from './components/Button/Button.vue'
import Icon from './components/Icon/Icon.vue'
import Collapse from './components/Collapse/Collapse.vue'
import CollapseItem from './components/Collapse/CollapseItem.vue'
const activeItem = ref(['a'])
</script>

<template>
  <main v-if="false">
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

  <main v-if="false">
    <h1>Icon图标</h1>
    <Icon icon="arrow-up"/>
    <Icon icon="arrow-up" color="red"/>
    <Icon icon="arrow-up" type="danger"/>
  </main>

  <main v-if="true">
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
    {{ activeItem }}
    <br />
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
