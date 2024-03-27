// 定义的属性分为：1.自己自定义的属性 2.原生input组件支持的原生属性
export interface InputProps {
  type?: string;
  modelValue: string | number;
  size?: 'large' | 'small';
  disabled?: boolean;
  clearable?: boolean;
  showPassword?: boolean; // 变成密码栏目 不需要修改type 为password
  placeholder?: string;
  readonly?: boolean;
  autocomplete?: string; // 注意这个为string类型
  autofocus?: boolean;
  form?: string;
}

export interface InputEmits {
  (e: 'update:modelValue', value: string | number): void;
  (e: 'input', value: string | number): void; // input值发生变化就触发
  (e: 'change', value: string | number): void; // change值发生变化 在 失去焦点时触发 
  (e: 'focus', value: FocusEvent): void;
  (e: 'blur', value: FocusEvent): void;
  (e: 'clear'): void;
}