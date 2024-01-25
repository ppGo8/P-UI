import type { Ref, InjectionKey } from 'vue'

export type NameType = string | number

export interface CollapsePopps {
  modelValue: NameType[]
  accordion?: boolean // 手风琴模式
}

export interface CollapseEmits {
  (e: 'update:modelValue', values: NameType[]): void;
  (e: 'change', values: NameType[]): void
}

export interface CollapseItemPopps {
  name: NameType
  title?: string
  disabled?: boolean
}

// InjectionKey
// 用途：说明provide和Inject传递的数据的类型,但是类型语法是写在了key上
// 语法：const key:InjectionKey<传递数据类型> = Symbol()
// 作用：
//   1. 保证provide传递的数据为key后的类型
//   2. 告诉inject处接收到的数据类型 从而在Inject接受处可以自动推导处类型,而不必在赋值号左侧写类型
export interface CollapseContext {
  activeNames: Ref<NameType[]>,
  // 函数表达式的类型，而不是使用接口的方式
  handleItemClick: (item: NameType)=> void
}
export const collapseContextKey:InjectionKey<CollapseContext> = Symbol('collapseContextKey')