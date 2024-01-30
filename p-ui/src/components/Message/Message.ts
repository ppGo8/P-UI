import { render, h, shallowReactive } from 'vue'
import type { CreateMessageProps, MessageContext } from './types'
import MessageConstuctor from './Message.vue'

// 注意: 全局变量
let seed = 1
const MessageInstances: MessageContext[] = shallowReactive([])
// const MessageInstances: MessageContext[] = []

/**
 * 创建message实例对象, 在某个组件上显示
 * @param props 
 * @returns 
 */
export const createMessage = (props: CreateMessageProps) => {
  const id = `message_${seed++}`

  // dom容器, 用来存放挂载Message组件
  const container = document.createElement('div')

  // 卸载组件的方法
  const destroy = () => {
    const idx = MessageInstances.findIndex(instance => instance.id === id)
    if (idx == -1) return
    MessageInstances.splice(idx, 1)
    render(null, container)
  }
  const newProps = {
    id,
    ...props,
    onDestroy: destroy
  }

  // 创建组件的虚拟节点 
  const vnode = h(MessageConstuctor, newProps)

  // 组件挂载到container上 render不返回任何值
  render(vnode, container) // Vnode渲染到了实际的DOM容器中，但是容器还没有挂载到界面上

  // 直接渲染container会导致多外面一层div
  // 最优的效果：只渲染div的第一个子节点(里面也只有有且只有一个子节点)
  document.body.appendChild(container.firstElementChild!) // !非空断言操作符的简便语法,告诉ts这个变量不会为null或undefined
  
  // 获取创建出来的组件实例对象,里面存储组件暴露出来的数据
  const vm = vnode.component!
  const instance = {
    id,
    vnode,
    vm,
    props: newProps
  }
  MessageInstances.push(instance)
  // 返回当前创建的实例对象
  return instance
}

/**
 * 获取最后一个
 * @returns 
 */
export const getLastInstance = () => {
  // 返回数组最后一项
  /**
   * 上述代码中：
   * 第一次创建message组件：
   *   使用render挂载message为虚拟节点到dom上(已经首次执行完毕message组件实例中的方法)
   *   还没有将本次创建的组件实例push到数组中 就已经创建完了、执行完组件中的方法
   *   所以第一次获取得到getLastInstance为undefined（合理：因为在创建的时候获取的应该是他前面最近的一次的节点的id，首次创建之前就是没有）
   * 第n次创建组件实例的过程中,
   *   getLastInstance,获取到的是第n-1次创建的message实例对象
   */
  return MessageInstances.at(-1) // 注意上述
}

/**
 * 获取上一个实例的bootomOffset
 * @param id 这个组件的id
 * @returns 
 */
export const getLastBottomOffset = (id: string) => {
  console.info('方法被调用了',id)

  const idx = MessageInstances.findIndex(instance => instance.id === id)
  if(idx <= 0) {
    return 0
  } else {
    // 返回上一个元素的bottomOffset
    const prev = MessageInstances[idx - 1]
    console.info(prev.vm.exposed!.selfBottomOffset.value)
    return prev.vm.exposed!.selfBottomOffset.value
  }
}
