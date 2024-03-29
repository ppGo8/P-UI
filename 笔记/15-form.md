# form

## 需求分析

- 自定义`UI`

  根据传入的表单项渲染内容

- 表单验证
  - 单独验证：每个表单元素**失去焦点**单独验证
  - 联动验证：两个密码框要输入内容一致
  - 整个表单验证：点击**提交按钮**验证整个表单

## 组件开发

### 组件结构

- 语义化结构

  通过传递的模板内容渲染UI结构

- 属性

  - `model `传递的属性值

  - `rules` 表单验证规则

  ![image-20240326151840261](/Users/ppgo8/Library/Application Support/typora-user-images/image-20240326151840261.png)

### 验证功能【难点】

#### 验证要素：

- `value`数据

- `rules`规则

- 在合适时机，**拿到数据和规则** 进行验证

>**如何同时拿到`value`和`rules`规则**
>
>

#### 验证类型

- 单个验证
- 整个表单验证

整个表单验证就是单个表单验证的汇总结果

#### 单个验证

- 位置：

  单个表单项验证在`formItem`组件中

  单个验证的错误信息要显示的对应的结构下面

- 获取数据和规则

  - `formitem`组件在下面的结构中获取输入数据和规则

    ```vue
    <template>
      <pp-form :model="model" :rules="rules">
        <pp-form-item label="名字" prop='name'>
          <!-- 这部分是form-item的插槽,所以form-item没办法直接拿到form上的数据 -->
          <pp-input v-model="model.age" type="text" />
        </pp-form-item>
      </pp-form> 
    </template>
    ```

    - `pp-form`通过`povided`提供全部`model`数据和`rules`数据给每个`formitem`组件

    - `formitem`组件通过传递进来的`prop属性获取得到自己的数据和规则

      ---

      总结：

      - from父组件传全部输入数据和规则给formitem 子组件
      - 子组件通过prop属性判断自己身上的规则和数据
      - 然后实现对应的验证方法

- <font color=red>怎么在特定时刻验证，如失去焦点</font>

  - 由**dom事件触发**要找到最基本的dom元素，以` Input `为例子，所以要将验证方法继续传递到` Input`组件中

  - 将传入规则的`trigger`作为参数传递给验证方法，筛选得到对应规则

  - 使用`povided`传递验证方法，在 Input自定义组件中找到` input`上绑定对应的事件和回调函数，在回调函数中执行来自`formitem`的验证方法 

### 整个表单验证

- 原理：就是执行所有fromitem的验证规则
- 方法：
  - 各`formitem`调用`form`组件注入的方法，将自己的验证方法和数据提供给`form`
  - `form`执行所有方法

## 拓展知识

### 判断条件

- 0 和空字符串“”判断条件为`false`，但是对于输入有时可能是正常情况，需要注意
- 有时候只需要判断`undefined`或者`null`

### 执行存放异步方法的数组

- `Promise.all` 

  特点：只要有一个失败就会直接返回，其他也不运行，

  全部表单验证需要所有的执行，获取所有成功的和失败的

- `Promise.allSettled`

  等待所有`Promise`都执行完，而不会因为部分失败直接返回

  适合全部表单验证的行为

### promise的错误

- 如果没有catch就会在控制台打印出来promise.error

### 依赖注入

- 适用场景
  - 爷孙组件
  - 组件向他的插槽组件（已经传入了实际内容的模板）传递数据

- 爷孙组件之间通信 

  - 只需要根据**模板看亲自关系**

    只要在模板中一个组件中写了另外一个组件的标签，就算是建立了关系

- 数据是共享的

  - 爷组件和子组件共享数据
  - 如果有多个子组件接受，这些个子组件之间也是共享数据的

- 传递是双向的

  - 爷组件通过provided传递数据和方法给子组件

  - 子组件可以调用爷组件的方法，向爷组件中的数据中添加数据

    >**注意**
    >
    >这个方法是爷组件中定义的，其中使用了爷组件的数据，然后向里面添加数据
    >
    >如const add = (item) => { arr.push(item )} arr是爷组件中定义的数据
    >
    >所以子 组件的调用这个方法就是向爷组件的数据中传递了数据

