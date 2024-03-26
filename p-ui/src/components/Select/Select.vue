<template>
  <div
    class="pp-select"
    :class="{ 'is-disabled': disabled }"
    @click="toggleDropdown"
  >
    <!-- 给内部包裹的组件提供弹出层 -->
    <Tooltip
      ref="tooltipRef"
      :popperOptions="popperOptions"
      placement="bottom-start"
      @click-outside="controlDropdown(false)"
      manual
    >
      <div
        class="pp-input__container"
        @mouseenter="() => {
          states.mosueHover = true
        }"
        @mouseleave="() => {
          states.mosueHover = false
        }"
      >
        <!-- 允许输入，然后筛选/远程搜索，得到下拉菜单内容 -->
        <!-- 封装好的Input在获得焦点时，会添加is-focus类 所以在这里就不用再次实现了 -->
        <!-- 回调函数不传递参数，默认隐藏传递事件对象 -->
        <Input
          v-model="states.inputLabel"
          :disabled="disabled"
          :placeholder="filteredPlaceHoleder"
          :readonly="!filterable || !isDropdownShow"
          @input="debounceOnFilter"
          @keydown="handleKeydown"
        >
        <template #suffix>
            <!-- 悬浮清空按钮 -->
            <Icon 
              v-if="showClearIcon"
              icon="circle-xmark"
              class="pp-input__clear"
              @click.stop="clearHandle"
            />
            <Icon 
              v-else
              icon="angle-down"
              class="header-angle"
              :class="{
                'is-active': isDropdownShow
              }"
            />
        </template>
        </Input>
      </div>
      <template #content>
        <!-- 远程搜索下拉菜单显示加载中 -->
        <div
          v-if="states.loading"
          class="pp-select__loading"
        >
          <Icon icon="spinner" spin/>
        </div>
        <!-- 筛选搜索、远程搜索没有搜索到内容 -->
        <div 
          v-else-if="filterable && filteredOptions.length === 0"
          class="pp-select__nodata"
        >
          no matching data
        </div>
        <ul v-else class="pp-select__menu">
          <template v-for="(item, index) in filteredOptions" :key="index">
            <!-- 'is-selected' 当前下拉菜单选项是否被选中 -->
            <!-- @mousedown.prevent="()=>{}" 作用：当点击下拉菜单选中某一个item后，input框的焦点不消失-->
            <li
              class="pp-select__menu-item"
              :class="{
                'is-disabled': item.disabled,
                'is-selected': states.selectedOption?.value === item.value,
                'is-highlighted': states.highlightIndex === index,
                }"
              :id="`slect-item-${item.value}`"
              @click="itemSelect(item)"
              @mousedown.prevent="()=>{}"
            >
              <!-- {{ item.label }} 中的内容只支持文本,现在要同时渲染Vnode和文本  -->
              <!-- 在模板的标签中调用函数 将函数的返回值作为要传递的值 -->
              <RenderVnode 
                :v-node="renderLabel ? renderLabel(item) : item.label"
              />
            </li>
          </template>
        </ul>
      </template>
    </Tooltip>
  </div>
</template>
<script setup lang="ts">
import type { SelectProps, SelectEmits, SelectOption, SelectStates} from './types';
import type { TooltipInstance } from '../Tooltip/types';
import type { Ref } from 'vue';
import { isFunction, debounce } from 'lodash-es';
import { ref, reactive, computed, watch } from 'vue';
import Tooltip from '../Tooltip/Tooltip.vue';
import Input from '../Input/Input.vue';
import Icon from '../Icon/Icon.vue';
import RenderVnode from '../Common/RenderVnode'

defineOptions({
  name: 'PpSelect'
})

// 由于一开始options是必传的，后面修改为可选传入
// 所以为了防止之前写的（访问一个空值的类型）代码报错，赋值给options默认值
const props = withDefaults(defineProps<SelectProps>(),
  {
    // 直接传递一个数组会报错，因此传递函数形式的数组
    options: () => []
  }
); 
const emits = defineEmits<SelectEmits>();
// 使用popper.js提供的操作，让弹出层和引起弹出层的内容宽度保持一致
const popperOptions: any = {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 9],
      },
    },
    {
      name: "sameWidth",
      enabled: true,
      fn: ({ state }: { state: any }) => {
          state.styles.popper.width = `${state.rects.reference.width}px`;
      },
      phase: "beforeWrite",
      requires: ["computeStyles"],
    }
  ],
}

// 响应式的options
// 初始值
const filteredOptions = ref(props.options);
// 如果运行中父组件处值发生变化
watch(() => props.options, (newOptions) => {
  filteredOptions.value = newOptions;
})
// 用户输入内容，筛选数组
const getFilterOptions = async (searchValue: string) => {
  if (!props.filterable) return;
  if (props.filterMethod && isFunction(props.filterMethod)) {
    // 用户自定义函数
    filteredOptions.value = props.filterMethod(searchValue);
  } else if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
    states.loading = true;
    try {
      filteredOptions.value = await props.remoteMethod(searchValue);
    } catch (error) {
      console.log(error);
      filteredOptions.value = [];
    } finally {
      states.loading = false;
    }
  } else {
    filteredOptions.value = props.options.filter(option => option.label.includes(searchValue));
  }

  states.highlightIndex = -1;
}

const timeout = computed(() => props.remote ? 300 : 0)
const onFilter = () => {
  getFilterOptions(states.inputLabel);
}
const debounceOnFilter = debounce(() => {
  onFilter();
}, timeout.value);

const filteredPlaceHoleder = computed(() => {
  return (props.filterable && states.selectedOption && isDropdownShow) ? states.selectedOption.label : props.placeholder;
})
// 获取tooltip自定义组件dom
// 使用这个组件控制 打开和关闭下拉菜单
// const tooltipRef = ref<TooltipInstance>(); // 类型推倒后有个undefined
const tooltipRef = ref() as Ref<TooltipInstance>;
// 下拉菜单当前是否打开
const isDropdownShow = ref(false);
// 用来进行打开和关闭下拉菜单的函数，供其他业务逻辑调用；未绑定在dom上
const controlDropdown = (show: boolean) => {
  // show: 想打开还是关闭
  if (show) {
    // filter模式，选择过某个option
    // input框内容清空 placeholder显示之前显示的内容
    if(props.filterable && states.inputLabel) {
      states.inputLabel = '';  // 只清空了label，没有清空option
    }
    // fitler模式
    // 下拉菜单展示全部内容
    if(props.filterable) {
      getFilterOptions(states.inputLabel);  // 筛选的是空值 相当于没筛选
    }
    tooltipRef.value.openPopper();
  } else {
    tooltipRef.value.closePopper();
    // 筛选模式
    // 关闭时下拉弹窗的操作
    // 1. 选中下拉菜单某个option关闭弹窗，此时states.inputLabel为最新选中的值。  
    //    states.inputLabel 被赋值了两次相同的内容，但是不影响效果 1.点击下拉菜单 2.下拉菜单关闭时
    // 2. 点击其他区域关闭下拉菜单
    //    其值为上一次选择的值，也是plcaholder显示的灰色值
    if (props.filterable) {
       // 这里使用selectOption重新给inputlabel赋值
       // 好处：用户输入错误不在筛选列表中，会被重新赋值为上次选择的内容
       // 理解：永远不要相信用户输入，使用额外的内容、数组存储用户已经选择的内容
      states.inputLabel = states.selectedOption ? states.selectedOption.label : '';
    }
    // 重置上下移动键盘的移动到的值
    states.highlightIndex = -1;
  }
  // 修改展示和关闭状态
  isDropdownShow.value = show;
  emits('visible-change', show);
}
// 真正绑定在dom上 根据当前状态判断打开还是关闭的函数
const toggleDropdown = () => {
  if (props.disabled) return;
  if (isDropdownShow.value) {
    controlDropdown(false);
  } else {
    controlDropdown(true);
  }
}

// input框的基本功能
const findOption = (value: string) => {
  // 判断传递进来的value是否在options即下拉菜单数组中
  const option = props.options.find(option => option.value === value);
  return option ? option : null;
}
// 初始option
const initialOption = findOption(props.modelValue);
// 选中的下拉菜单的值
// 1.初始值为首次传递进来的 2.为用户点击操作的修改
// 初始值
const states = reactive<SelectStates>({
  inputLabel: initialOption ? initialOption.label : '',
  selectedOption: initialOption,
  mosueHover: false,
  loading: false,
  highlightIndex: -1, // -1 代表什么都没有选择
})

// 用户点击操作，点击item选项 
const itemSelect = (e: SelectOption) => {
  if (e.disabled) return;
  // 修改当前选中的值
  states.inputLabel = e.label;
  states.selectedOption = e;
  emits('update:modelValue', e.value);
  emits('change', e.value);
  // 点击后会自动冒泡到根结点 到关闭下拉菜单的回调函数 因此此处无需再调用
  // 如果想在此处再次调用：需要禁止click事件冒泡，这样父组件的click就不会被冒泡再次执行，倒置无法关闭
}

// 悬浮在input上 是否显示清空按钮
const showClearIcon = computed(() => {
  // 重点条件：正在悬浮
  return props.clearable
    && states.inputLabel.trim() !== ''
    && states.selectedOption 
    && !props.disabled 
    && states.mosueHover
})
// 点击清空按钮 
const clearHandle = function() {
  states.inputLabel = '';
  states.selectedOption = null;
  emits('clear');
  emits('change','');
  emits('update:modelValue','');
}

// 鼠标事件
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Enter':
      if (!isDropdownShow.value) {
        controlDropdown(true);
      } else {
        if(states.highlightIndex > -1 && filteredOptions.value[states.highlightIndex]) {
          itemSelect(filteredOptions.value[states.highlightIndex]);
          controlDropdown(false);
        } else {
          controlDropdown(false);
        }
      }
      break;
    case 'Escape':
      controlDropdown(false);
      break;
    // 键盘向上移动
    case 'ArrowUp':
      // 阻止 滚动条移动(如果有滚动条）
      e.preventDefault();
      if(filteredOptions.value.length === 0) return;
      if(states.highlightIndex === -1 || states.highlightIndex === 0) {
        states.highlightIndex = filteredOptions.value.length - 1;
      } else {
        states.highlightIndex = states.highlightIndex - 1;
      }
      console.log('上移动',states.highlightIndex)
      break;
    // 键盘向下移动
    case 'ArrowDown':
      e.preventDefault();
      if(filteredOptions.value.length === 0) return;
      if(states.highlightIndex === -1 || states.highlightIndex === filteredOptions.value.length - 1) {
        states.highlightIndex = 0;
      } else {
        states.highlightIndex = states.highlightIndex + 1;
      }
      break;
    default:
      break;
  }
}

</script>