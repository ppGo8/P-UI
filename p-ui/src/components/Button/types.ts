// vue3定义prop类型有两种方式
// 1.编译时声明类型 ts语法 如interface 
// 2.运行时声明类型 vue语法 const 变量 = {}
type ButtonType = 'primary' | 'danger'  | 'info' | 'success' | 'warning';
type ButtonSize =  'small' | 'normal' | 'large';
export type NativeType = 'button' | 'submit' | 'reset'; // html button原生的type属性的值
// 1.编译时声明类型
export interface ButtonProps {
  type?: ButtonType
  size?: ButtonSize
  plain?: boolean
  round?: boolean
  circle?: boolean
  // button按钮的原生属性
  disabled?: boolean
  nativeType?: NativeType
  autofocus?: boolean
  icon?:string
  loading?: boolean
}
export interface ButtonInstance {
  ref: HTMLButtonElement
}
// 2.运行时声明类型
import type { PropType } from 'vue'
export const ButtonProps = {
  type: String as PropType<ButtonType>,
  size: String as PropType<ButtonSize>,
  plain: Boolean,
  round: Boolean,
  circle: Boolean,
  disabled: Boolean,
  nativeType: Boolean,
}

// 注意：变量类型的大小写会有影响