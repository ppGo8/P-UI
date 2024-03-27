import type { InjectionKey } from "vue";
import type { RuleItem, ValidateError, ValidateFieldsError } from 'async-validator'

// props 数据类型
// async-valiadtor提供的RuleItem当中没有trigger类型
export interface FormItemRule extends RuleItem {
  trigger?: string;
}
export type FormRules = Record<string, FormItemRule[]>
export interface FormProps {
  model: Record<string, any>;
  rules: FormRules;
}
export interface FormItemProps {
  label: string,
  prop?: string, // formitem使用名为prop的属性和规则进行判断
}

// formitem表单验证状态类型 
export interface ValidateStatusTyp {
  state: 'init' | 'success' | 'error',
  errorMessage: string,
  loading: boolean
}

// provide 和 inject 提供的数据类型
// vue3定义: interface InjectionKey<T> extends Symbol {} 
// InjectionKey具有一个类型，保证provide和inject传递数据的类型为InjectionKey的数据类型
// formitem组件provid的数据类型
export interface formItemContext { 
  prop: string, // 要验证的规则、数据的名字，二者名字相同
  validate: (trigger?: string) => any; // formitem的验证规则的方法
  resetField(): void; // 表单恢复到初始状态 包括数据和验证规则
  clearValidate(): void; // 清空验证规则
}
// Form组件provid的数据类型
export interface FormContext extends FormProps {
  addField: (field: formItemContext) => void; // 添加formitem验证方法的函数
  removeField: (field: formItemContext) => void; // 删除formitem验证方法的函数
}
export const formContextKey: InjectionKey<FormContext> = Symbol('formContextKey')
export const formItemContextKey: InjectionKey<formItemContext> = Symbol('formItemContextKey')

// async验证 catch得到的e参数的类型
// 观察async-validator提供的真是的数据类型写的，而不是自己瞎写的
export interface FormValidateFailure {
  errors: ValidateError[] | null,
  fields: ValidateFieldsError,
}

// form表单实例
export interface FormInstance {
  validate: () => Promise<boolean>;
  resetFields: (props?: string[]) => void;
  clearValidate: (props?: string[]) => void;
}
// formitem表单实例
export interface FormItemInstance {
  validateStatus: ValidateStatusTyp,
  validate: () => Promise<boolean>,
  resetField(): void,
  clearValidate(): void,
}
