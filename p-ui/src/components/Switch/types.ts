// 子组件支持的modelValue类型，用于控制swich的开关
export type SwitchValueType = boolean | string | number;

export interface SwitchProps {
  // 暂时仅支持布尔，后续完善支持number或string
  modelValue: SwitchValueType;
  disabled?: boolean;
  activeText?: string;
  inactiveText?: string;
  activeValue?: SwitchValueType;
  inactiveValue?: SwitchValueType;
  name?: string;
  id?: string;
  size?: 'small' | 'large';
}

export interface SwitchEmits {
  (e: 'change', value: SwitchValueType): void;
  (e: 'update:modelValue', value: SwitchValueType): void;
}