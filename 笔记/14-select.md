# select

## 组件分析

### 需求分析

- 基本功能

  - 点击展开下拉菜单
  - 选中下拉菜单其中一项，下拉菜单关闭
  - select获取选中状态，并填充对应选项

- 高级功能

  - 可清空按钮

    - 解决方法
      - 完全复用input的功能
      - 不复用 重新写

  - 自定义模板：

    - 需求描述：

      每个`li`包裹的内容和样式允许用户传入 自定义（效果同于插槽）

    - 解决方法：

      - 不好用插槽

        原因：使用`v-for`循环渲染`li`的，传进来的数量不确定，导致插槽名称也无法确定

      - 返回值为`Vnode`的函数，使用自定义组件渲染这个虚拟节点

        - 用户传递一个函数，函数对每一项的`item`进行操作，该函数返回`Vnode`

          `(e: selectOption) = >VNode`

        - 写一个自定义组件，不写模板只写`setup`

          `setup`函数返回的虚拟节点、文本内容、`jsx`会直接渲染为该自定义组件

          （注意同时要支持仅渲染文本，当用户没有传入函数的时候就直接渲染label）

        - 将用户传递函数的返回值传递给自定义组件

        - [渲染函数 & JSX](https://cn.vuejs.org/guide/extras/render-function.html)

  - 支持筛选

    - 需求描述

      允许输入内容，自动过滤下拉菜单选项

    - 解决方法：

      - `input`事件和回调

      - 有很多细节值得注意

        - 只有在有下拉的框的时候允许输入，通过`readonly`

        - 当已经选择一个值，再次点击`input`时

          `input`框内容清空，`placeholder`设置为清空前的值

          下拉框应该选择全部内容

        - 如果输入的不在筛选列表的值，点击其他区域失去焦点时，重制内容为上一次选择的

  - 支持远程搜索（难点）：类似自动联想

    - 属性
      - 开启remote功能
      - 自定义remote方式
    - 思路：在input输入的过程中，根据用户的传入方式进行操作

  - 拓展支持：键盘移动

    - 在input focus状态，按下enter打开或关闭菜单

    - 按esc关闭菜单

    - **按上下键盘移动菜单选项，高亮显示当前移动到的选项**

      - 问题：如何移动到下拉菜单中，里面是li元素无法直接通过tab获得焦点

      - 解决方案：

        并不是通过焦点获得，而是在input组件上检测键盘上移或下移事件

        每次移动时计算当前高亮的元素的index，然后和模板中li的index进行判断，使用动态类名添加css背景样式

    - 按下enter选中下拉菜单特定选项

  - 可支持多选

## 组件开发



## 拓展知识

### 不影响布局的情况下扩大可点击区域

- 块类元素：

  使用伪元素 + 定位 + `top bottom left right` + `z-index`(不必须)

  举例：`top: -10px bottom: 0px left: 0px right:0px` 可以在上方多出10px

- 行内元素

  `padding`可以扩大垂直方向的可点击区域，但是不会影响布局（在布局的时候不会显示padding）

- 浮动元素/脱离文档流定位元素

  可以直接设置透明`border`，这个已经脱离文档流，不会影响文档流布局（但会影响自身）

### 鼠标相关事件执行顺序

-  `mousedown` -> `blur` -> `mouseup` -> `click` 

  - 分析：`mousedown`触发后 原来获得焦点的内容就已经失去焦点了

  - 需求：鼠标点击后，不想让已获得焦点的内容失去焦点

    解决方法：`mousedown.prevent `

    原因：`mousedown`事件第一个触发，所以阻止他的默认行为

### 重要思想

- 动态`class`控制显示的样式

- 不相信用户的输入

  一个表单元素，可以同时存储两个内容

  - 一个用于接收`v-model`

  - 一个用于存储上一次`v-model`和上一次其他更多的信息

    ```vue
    <template>
    	<input
        v-model="innerlabel"
      />
    </template>
    <scirpt>
      const selectedOptions = ref({
      	innerlabel: string,
      	option: {
      		label: string,
      		value: string,
      	}
      })
      // js处可以进行的操作
      selectedOptions.innerlabel = selectedOptions.option.label;
    </scirpt>
    ```

    

  > 这样再用户进行某些操作时，可以随时重置返回上一次的内容

### `hover`优化

- `hover`是能检测到鼠标的悬浮

  但其实很多需求：**在鼠标悬浮时展示什么**，是需要同时检测悬浮和非悬浮的事件的然后执行操作

- 解决方法：

  - 使用`mouseEnter`和`mosueLeave`

  - 而不使用`hover`	

### 事件

- 有些事件只有在特定元素，如表单元素上有
  - `focus`
  - `blur`
  - `hover`

### 节流

节流一般针对的是整个函数，如果相对函数里面的某个部分需要节流

<font color=red>就需要直接对着整个函数进行节流</font>

