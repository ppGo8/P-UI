import type { VNode, ComponentInternalInstance } from 'vue'

// message sfc组件中需要的props类型
export interface MessageProps {
  message?: string | VNode;
  duration?: number;
  showClose?: boolean;
  type?: 'success'| 'info'| 'warning'| 'danger';
  onDestroy: () => void,
  id: string,
  // 每个message实例之间的距离
  offset?: number
}

// 函数式组件 创建message的函数需要传入的参数
export type CreateMessageProps = Omit<MessageProps, 'onDestroy' | 'id'> // 排除某个属性

// 存储所有创建的Message实例
export interface MessageContext {
  id: string;
  vnode: VNode;
  vm: ComponentInternalInstance;
  props: CreateMessageProps;
}