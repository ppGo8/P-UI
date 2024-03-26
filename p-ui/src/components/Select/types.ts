// 父组件在子组件上绑定的事件
// 1.定义在props中【不常用，本节使用】
// 2.定义在emits中【常用】

import type { VNode } from "vue";

// 下拉菜单中每一项的内容
export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}
// 允许传入函数Vnode，直接渲染【代替插槽】
export type RenderLabelFunc = (option: SelectOption) => VNode
// 用户自定义筛选数组的方法
export type CustomFilterFunc = (value: string) => SelectOption[];
// 用户自定义远程搜索方法
// promise范型中第一个参数为成功时返回的类型，第二个参数为失败时候返回的类型一般为Error可以省略
// 使用promise.resolve和promise.reject方法创建的 范型参数可以省略
export type CunstomRemoteFunc = (value: string) => Promise<SelectOption[]>;
export interface SelectProps {
  modelValue: string;
  options?: SelectOption[]; // 可以不传 支持远程搜索
  // 一些表单基本属性
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  // 函数式渲染，效果类似于插槽，更加灵活，不方便写插槽的可以使用这个
  renderLabel? : RenderLabelFunc; // 传入的函数是对 options的每一项进行操作 
  // 筛选相关
  filterable?: boolean; 
  filterMethod?: CustomFilterFunc; // 用户自定义筛选函数
  // 远程搜索相关
  remote?: boolean;
  remoteMethod?: CunstomRemoteFunc; 
}

export interface SelectEmits {
  (e: 'change', value: string): void;
  (e: 'update:modelValue', value: string): void;
  // 下拉菜单打开还是关闭
  (e: 'visible-change', value: boolean): void;
  // 点击清空按钮
  (e: 'clear'): void;
}


// 下拉菜单中 选择的内容
export interface SelectStates {
  inputLabel: string, 
  selectedOption: null | SelectOption,
  // 鼠标是否正悬浮在input框上
  mosueHover: boolean,
  // 下拉菜单的内容是否正在加载
  loading: boolean,
  highlightIndex: number,
}

