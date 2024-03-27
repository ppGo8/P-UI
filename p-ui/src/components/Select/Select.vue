<template>
  <div
    class="pp-select"
    :class="{ 'is-disabled': disabled }"
    @click="toggleDropdown"
  >
    <!-- 给内部包裹的组件提供弹出层，这里的弹出层是下拉菜单 -->
    <Tooltip
      ref="tooltipRef"
      :popperOptions="popperOptions"
      placement="bottom-start"
      manual
      @click-outside="controlDropdown(false)"
    >
      <div
        class="pp-input__container"
        @mouseenter="() => {
          states.mosueHover = true;
        }"
        @mouseleave="() => {
          states.mosueHover = false;
        }"
      >
        <!-- 支持功能： 1.点击出现下拉菜单 2.支持输入内容进行筛选或远程搜索 （只有筛选和远程支持输入） -->
        <!-- 封装好的Input在获得焦点时，会添加is-focus类 所以在这里就不用再次实现了 判断是否获得焦点 -->
        <!-- 回调函数不传递参数，默认隐藏传递事件对象 -->
        <Input
          v-model="states.inputLabel"
          :disabled="disabled"
          :placeholder="filteredPlaceHoleder"
          :readonly="!filterable || !isDropdownShow"
          @input="debounceOnFilter"
          @keydown="handleKeydown"
        >
          <!-- input框右侧按钮区域 -->
          <template #suffix>
              <!-- 悬浮清空按钮 -->
              <Icon v-if="showClearIcon" icon="circle-xmark" class="pp-input__clear" @click.stop="clearHandle"/>
              <!-- 普通提示按钮 -->
              <Icon v-else icon="angle-down" class="header-angle" :class="{'is-active': isDropdownShow }"/>
          </template>
        </Input>
      </div>
      <!-- 下拉菜单区域 -->
      <template #content>
        <!-- 远程搜索下拉菜单显示加载中 -->
        <div v-if="states.loading" class="pp-select__loading">
          <Icon icon="spinner" spin/>
        </div>
        <!-- 筛选搜索、远程搜索没有搜索到内容 -->
        <div 
          v-else-if="filterable && filteredOptions.length === 0" class="pp-select__nodata"
        >
          no matching data
        </div>
        <!-- 显示下拉菜单内容 -->
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
              <!-- {{ item.label }} 中的内容只支持文本 现在要支持同时渲染Vnode和文本  -->
              <!-- 支持渲染v-node是因为此处应该允许渲染用户的自定义内容，包含标签
                   插槽可以渲染用户自定义模板，但是在该组件内部不适合使用插槽：v-for循环数量不固定，且不好命名 
                   因此允许用户传入生成v-node虚拟节点的函数 格式形如 () => return h(xxx)
              -->
              <!-- 在模板标签中调用传入的渲染函数 将函数返回值即虚拟节点传递给RenderVnode自定义组件 -->
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
import Tooltip from '../Tooltip/Tooltip.vue';
import Input from '../Input/Input.vue';
import Icon from '../Icon/Icon.vue';
import RenderVnode from '../Common/RenderVnode';
import { isFunction, debounce } from 'lodash-es';
import { ref, reactive, computed, watch } from 'vue';
import type { SelectProps, SelectEmits, SelectOption, SelectStates} from './types';
import type { TooltipInstance } from '../Tooltip/types';
import type { Ref } from 'vue';

defineOptions({
  name: 'PpSelect'
})

const emits = defineEmits<SelectEmits>();
const props = withDefaults(defineProps<SelectProps>(),
  { // 一开始options为必传数组，所以代码中可以 随意些 props.options.数组方法
    // 后面修改为可选，由于其不一定被传入所以访问一个null的数组方法会报错
    // 所以设置options默认值为空数组
    // 在vue中，直接给props或data(vue2)中输入赋值引用类型会有问题，因此需要借助工厂函数
    options: () => []
  }
); 

// initialOption：组件初始选中值
const findOption = (value: string) => {
  // 判断value是否在全部下拉框数据中
  // 如果值在下拉数组框中则返回这个值所在对象{ label: xxx, value: xxx}，否则返回空
  const option = props.options.find(option => option.value === value);
  return option ? option : null;
}
// 注意：这个并不是input组件绑定的v-model值 此处只用做中介判断
const initialOption = findOption(props.modelValue); 

// props.options 下拉框可以显示的全部内容
// filteredOptions 支持搜索筛选下拉框内容的功能，所以此处命名为filter
const filteredOptions = ref(props.options);  // 父组件给的初始值
watch(() => props.options, (newOptions) => { // 父组件运行过程中传递的值发生变化 ，子组件同步更新
  filteredOptions.value = newOptions;
})
// 下拉框状态 打开、关闭
const isDropdownShow = ref(false);

// states: input选中的下拉框值的相关数据
// 思想：把用于接收父组件传递过来的初始值xxx和v-model绑定的数据分开
//      可能的原因：还要记录当前选中的数据的其他复杂状态，因此分开 【适用场景】
// 组件挂载的初始值，因为下面的内容只会执行一次
const states = reactive<SelectStates>({
  inputLabel: initialOption ? initialOption.label : '', // v-model绑定的值，通过该值和Input dom交互
  // v-model是双向绑定的和用户输入实时
  // 而这个数组需要手动调用方法修改，所以比v-model要慢一点
  // 所以它里面还可以存储历史信息，最近一次选中的值
  // 作用：1.如果用户输入错误的内容，可以使用这个恢复 2.获取最近一次内容进行操作
  selectedOption: initialOption, // 最近一次选中内容 
  mosueHover: false,  // 鼠标是否悬浮在当前input框上
  loading: false,  // 是否正在加载数据
  highlightIndex: -1, // 选择了下拉框中的索引为x的数据，-1没选
})

// select组件只允许点击实现打开或关闭下拉框
// 因此需要在click事件时调用tooltipRef提供的打开、关闭下拉框的方法
// poper组件就是这么实现的，如果只允许点击那么就提供方法接口 让用户自己实现什么时候点击开启 什么时候点击关闭 点击哪里开启 点击哪里关闭
// const tooltipRef = ref<TooltipInstance>(); // 类型推倒后有个undefined
const tooltipRef = ref() as Ref<TooltipInstance>;

// input框右侧是否显示清空按钮 
// 需要满足一定的条件
const showClearIcon = computed(() => {
  return props.clearable // 开启功能
    && states.inputLabel.trim() !== '' // 已经选择内容
    && states.selectedOption // 已选择内容
    && !props.disabled  // 未开启disatble功能
    && states.mosueHover // 悬浮
})

// placeholer显示的内容
// 1.不支持筛选和远程搜索时，同时用户也不能输入；因此只需要显示请选择内容即可
// 2.支持筛选和远程搜索，允许用于输入
//   为了提供更好的用户体验：
//      1）每次点击时，应该清空内容，方便用户直接输入内容
//      2）但是为了保存用户已经选择的内容，所以将placeholder设置为上次选择的内容。
//         states.inputLabel已经被清空了，这里就用到了states.options数组，存储了上一次选择的信息
const filteredPlaceHoleder = computed(() => {
  return (props.filterable && states.selectedOption && isDropdownShow) ? states.selectedOption.label : props.placeholder;
})

// 节流函数时间
const timeout = computed(() => props.remote ? 300 : 0)

// 使用popper.js提供的设置，让弹出层和引起弹出层的内容宽度保持一致
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

// 打开和关闭下拉框的方法
// 注意：这个方法没有作为dom上事件的回调函数，是一个作为中介方法，在js其他函数中被调用
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
// 点击input和下拉框，打开或关闭下拉框
// 注意：dom上click事件的回调函数
const toggleDropdown = () => {
  if (props.disabled) return;
  // 多选模式点击内部不关闭，只有点击外部才关闭
  if (isDropdownShow.value && !props.multiple) {
    controlDropdown(false);
  } else {
    controlDropdown(true);
  }
}

// 点击选择下拉框中的某个选项
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

// 键盘操作input框
// enter键 显示或打开下拉框
// 上下键 选择下拉框中的某个选项
// 注意：上下键的展示效果是作用在下拉框选项中的，但是事件绑定是在input上的
//       1）主要是通过states.hightlightIndex判断当前应该选中哪个选项，然后为对应li设置动态类型，css实现当前选中的样式
//       2）上下键盘的事件是绑定在父节点input上的，而不是li自己上
//          js角度：要维护记录所有子节点状态，当前选择了第几个
//          用户行为实际角度：tab到在input上按下enter后按上下键，此时焦点还在input上，因此只能检测到input上的上下键事件
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

// 点击清空按钮 
const clearHandle = function() {
  states.inputLabel = '';
  states.selectedOption = null;
  emits('clear');
  emits('change','');
  emits('update:modelValue','');
}

// 筛选、远程搜索功能的方法
// 没有直接绑定在dom上
const getFilterOptions = async (searchValue: string) => {
  if (!props.filterable) return;
  // 筛选、用户传入了自定义筛选函数
  if (props.filterMethod && isFunction(props.filterMethod)) {
    filteredOptions.value = props.filterMethod(searchValue);
  } // 远程搜索 
  else if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
    states.loading = true;
    try {
      filteredOptions.value = await props.remoteMethod(searchValue);
    } catch (error) {
      console.log(error);
      filteredOptions.value = [];
    } finally {
      states.loading = false;
    }
  } // 筛选 用户未传入自定义函数
  else {
    filteredOptions.value = props.options.filter(option => option.label.includes(searchValue));
  }
  // 每次都要重置当前选中的项索引 确保键盘事件准确
  states.highlightIndex = -1;
}

// 筛选、远程搜索方法
const onFilter = () => {
  getFilterOptions(states.inputLabel);
}
// 真正绑定在dom的input事件的方法，节流后的筛选和远程搜索方法
const debounceOnFilter = debounce(() => {
  onFilter();
}, timeout.value);

// 多选功能


</script>