<script setup lang="ts">
import { ref} from 'vue'
import Button from './components/Button/Button.vue'
import Icon from './components/Icon/Icon.vue'
import Collapse from './components/Collapse/Collapse.vue'
import CollapseItem from './components/Collapse/CollapseItem.vue'
import Tooltip from './components/Tooltip/Tooltip.vue'

const activeItem = ref(['a'])

let events = ref<'hover' | 'click'>('click')
import type { TooltipInstance } from './components/Tooltip/types'
const tooltipRef = ref<TooltipInstance | null>(null)
const open = () => {
  tooltipRef.value?.openPopper()
}
const close = () => {
  tooltipRef.value?.closePopper()
}

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

  <main v-if="false">
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
  
  <main v-if="true">
    <!-- <Tooltip content="poper" placement="bottom-start" manual ref="tooltipRef" trigger="hover">
      <img src="./assets/test.jpg" alt="图片未加载" style="width: 200px;">
    </Tooltip>
    <button @click="open">显示popper</button>
    <button @click="close">关闭popper</button>
    <br />

    <Tooltip content="poper" placement="bottom-start" trigger="hover" :open-delay="1000" :close-delay="1000">
      <img src="./assets/test.jpg" alt="图片未加载" style="width: 200px;">
    </Tooltip> -->
    
    <br />
    <Tooltip content="我是popper的内容" trigger="click" placement="right">
      <img src="./assets/test.jpg" alt="图片未加载" style="width: 200px;">
    </Tooltip>
  </main>
</template>

<style scoped>
.test {
  padding-bottom: 25px;
  height: 0px;
  background-color: pink;
}
</style>
