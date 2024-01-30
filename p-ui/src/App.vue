<!-- <template>
  <Message show-close><h1>slot传递</h1></Message>
  <Message show-close :message="'string参数,没有定时关闭'" :duration="0" />
  <Message show-close :message="h('h1','vnode传入')" />
</template> -->

<script setup lang="ts">
import { h, onMounted } from 'vue'
import Message from './components/Message/Message.vue'

// 只写函数就创建了一个组件,而该函数并不是通过defineComponent创建一个组件
import { createMessage } from './components/Message/Message'

onMounted(()=> {
  createMessage({
    message:'函数式组件message',
    duration: 0,
    showClose: true
  })
  createMessage({
    message:'函数式组件message',
    duration: 0,
    showClose: true
  })
  createMessage({
    message:'函数式组件message',
    duration: 0,
    showClose: true
  })
})
</script>
