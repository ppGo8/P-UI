# Switch开关

## 组件基本信息

特点：

- 功能类似于checkbox ，有两个状态，所以内部可能是有一个checkbox在工作

  >- checkbox特点(优化需要保存这一特点)：
  >  - 可以使用`tab`键获取到焦点
  >  - 使用空格选中或取消选中
  >
  >- 默认可以tab获取焦点的元素
  >  - `a`标签 
  >  - `button`
  >  - `textarea`
  >  - 表单元素
  >- 当一个元素获得焦点时，浏览器会默认展示样式：一个竖线或者轮廓

- 样式独特、好看

## 开发细节

### css样式

- `:focus`伪类

  鼠标点击焦点元素、使用键盘的Tab 键（或快捷键）触发焦点元素焦点环的样式

-  `:focus-visible`伪类 

  只有键盘的Tab 键（或快捷键）触发焦点元素焦点环的样式

- ` outline: 2px solid blue;`属性： 

   `outline`不占用位置 主要用于在元素获得焦点时展示边框  

### checkbox和switch联动

- `checkbox`是不能在**模板中删除元素**的

  因为要保留他的浏览器支持的特殊功能**获取焦点**，进而将对应的操作**写在按钮上**

  >**真正的方法：**使用css隐藏，看着没有实际有 可以用tab切换到

- 所以需要实现双向联动

  - `checkbox`流向按钮

    - 挂载时

    - 键盘事件

    - 鼠标事件

      由于按钮也需要绑定鼠标事件，因此这里可以将click绑定在二者的父元素上

  - 按钮流向`checkbox`

    - 挂载时
    - 鼠标事件

  一个组件`template`中，有`checkbox`和`siwtch`这两个组件

  - 一个组件发生变化，想要引起另外一个的联动的方法

    - 绑定属性 直接变化

    - 源内容变化的事件

    - 如果源内容的事件结果是改变了一个值，那么还可以用`watch`检测

      如果有多个事件引起源内容变化，且是改变一个值，那么建议用`watch`

### v-model自定义组件双向流动

- 子组件代码

  ```js
  // 接收
  // 首次接收：父组件传递过来的开关的原始值
  const innerValue = ref(props.modelValue); 
  // 父组件中途props值发生变化：父组件处传递的值发生变化，子组件使用的数值要重新赋值
  watch(() => props.modelValue, (newVal)=> { 
    innerValue.value = newVal;
  })
  
  // 传递
  // 点击按钮，开关绑定的v-model变化，需要通知父组件的数据也改变
  const switchValue = () => {
    // 其他业务逻辑pass
    emits('update:modelValue', innerValue.value); // 【重要】响应式到父组件中
  }
  ```

- 父组件代码

  - 父组件只需要在子组件上写`v-model`即可

  - `update:modelValue`事件会自动解析和执行

### 修改模板上属性的方法

- `：属性=XXX`，直接绑定数据
- 通过`ref`获取对应的`dom`节点，然后使用ref.xxx的方式更改上面的属性值

## 拓展

### 焦点

- 焦点获得的方式：鼠标点击选中元素、通过 **tab** 键定位到元素时进行focus操作，触发focus事件
- 或者使用`js`的`focus() `方法进行focus操作，触发 focus 事件

> 当元素获得焦点时，触发 focus 事件

#### 键盘获取焦点

- 默认情况下，可以通过键盘获得焦点的元素

  - 有`href`属性的`a`
  - `button`
  - `input`、`select`等表单元素
  - `textarea`

  > 其他元素如div、span等都是无法通过tab获得焦点

- 想让其他元素也通过`tab`或鼠标点击获得焦点

  方法：使用`tabindex`属性

  - 设置`tableindex`属性一定可以使用鼠标获得焦点

  - 是否可以使用`tab`获得焦点 要看`tabindex`的数值

    ![image-20240317234806917](/Users/ppgo8/Library/Application Support/typora-user-images/image-20240317234806917.png)



**参考文章**

[焦点管理](https://alibaba-fusion.github.io/next/part2/content-creation-link/page4.html)



