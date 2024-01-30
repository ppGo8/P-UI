/**
 * 使用jsx语法实现dropdown组件,
 */
import { defineComponent, computed, Fragment, ref } from "vue";
import type { PropType } from "vue";
import type { Placement, Options } from "@popperjs/core";
import type { MenuOption } from "./types";
import type { TooltipInstance } from "../Tooltip/types";
import Tooltip from "../Tooltip/Tooltip.vue";

export default defineComponent({
  name: 'PpDropdown',
  // tsx没办法使用泛型写法,要使用对象字面量写法
  props: {
    placement: {
      type: String as PropType<Placement>,
      default: 'bottom'
    },
    trigger: {
      type: String as PropType<'hover' | 'click'>,
      default: 'hover'
    },
    transition: {
      type: String,
      default: 'fade'
    },
    openDelay: {
      type: Number,
      default: 0
    },
    closeDelay: {
      type: Number,
      default: 0,
    },
    popperOptions: {
      type: Object as PropType<Options>,
    },
    menuOptions: {
      type: Array as PropType<MenuOption[]>,
      required: true
    },
    hideAfterClick: {
      type: Boolean,
      default: true
    },
    manual: {
      type: Boolean
    }
  },
  emits: ['visible-change', 'select'],
  setup(props, { slots, emit, expose }) {
    // 获取自定义组件的ref对象
    const tooltipRef = ref<TooltipInstance | null>()
    const visibleChangeHandler = (value: boolean) => {
      emit('visible-change', value) // 继续触发外层使用Dropdown组件的visible-change事件
    }
    const itemClickHandle = (item: MenuOption) => {
      if(item.disabled) return 
      emit('select', item)
      if(props.hideAfterClick) {
        tooltipRef.value?.closePopper();
      }
    }
    // 使用jsx语法渲染v-for和v-if
    const options = computed(() => {
      // v-for使用数组循环
      return props.menuOptions.map(item => {
        return (
          <Fragment key={item.key}>
            {/* v-if使用三元表达式 */}
            { item.divided?  <li role="separator" class="divided-placeholder"></li>: '' }
            <li 
              class={{
                'pp-dropdown__item': true,
                'is-disabled': item.disabled,
                'is-divided': item.divided
              }}
              id={`dropdown-item-${item.key}`}
              onClick={ () => itemClickHandle(item) }
            >
              { item.label }
            </li>
          </Fragment>
        )
      })
    })

    // 暴露组件实例
    expose({
      open: () => tooltipRef.value?.openPopper(),
      close: () => tooltipRef.value?.closePopper()
    })

    // 写多行的jsx使用圆括号括起来
    return () => (
      <div
        class='pp-dropdown'
      >
        <Tooltip
          trigger = { props.trigger }
          manual = { props.manual }
          placement = { props.placement }
          popper-options = { props.popperOptions }
          open-delay = { props.openDelay }
          close-delay = { props.closeDelay }
          ref={tooltipRef}
          onVisible-change = { visibleChangeHandler }
        >
          {/* 插槽内容包裹在{{}}中 */}
          {{
            default: () => slots.default && slots.default(),
            content: () => (
              <ul class="pp-dropdown__menu">
                {/* jsx不支持v-for和v-if等vue内置指令,需要使用js语法生成节点、内容*/}
                { options.value }
              </ul>
            )
          }}
        </Tooltip>
      </div>
    )
  }
})