import type { Placement, Options } from "@popperjs/core";


// poperOptions中存在placement属性
// 优先级：poperOptions中的placement大于直接写的placement
export interface TooltipProps {
  content?: string
  trigger?: 'hover' | 'click'
  placement?: Placement
  manual?: boolean
  popperOptions?: Partial<Options> // poperjs支持的配置,这里拿过来直接使用
  transition?: string
  openDelay?: number;
  closeDelay?: number;
}

export interface TooltipEmits {
  (e: 'visible-change', value: boolean): void;
  (e: 'click-outside', value: boolean): void;
}

export interface TooltipInstance {
  openPopper: () => void
  closePopper: () => void
}