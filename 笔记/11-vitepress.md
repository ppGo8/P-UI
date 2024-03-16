# vitepress

## 基本介绍

- 常见的静态站点搭建工具
- 基于`markdown`的文档工具
- 基于`vite`和`vue`
- 可以直接在`markdown`中写`vue`
- 使用场景
  - 博客
  - 文档

## 路由系统

- 由文件夹和`markdown`文件构成路由系统

- 两个重要的文件夹：

  - `projecet root`文件夹：

    存放`.vitepress`文件夹的文件夹

  - `source`文件夹：

    - 存放相关md文件的文件夹，默认和`projecet root`相同
    - 可以处理这个文件夹下的所有markdown文件，**自动生成**对应的路由

    - 可以使用配置文件中的`srcDir`属性修改

## 语法

- 概括

  - `markdown`语法

  - `vue`组件语法

    - `script setup`: 里面写`vue`中脚本语法

    - 模板语法直接写，不需要写`template`标签

      通常模板下方会写的markdown的```vue注释语法，来展示相应的源代码

    - `style`标签写样式

      也可以在`.vitepress`建立文件夹引入外部样式表

- 进一步优化

  - **需求：组件展示的样式和源代码代码重复,程序员希望只写一次而不是两次**

  - 解决方法：使用插件`vitepress-demo-preview`
    - 将需要展示的内容单独写在`demo`文件夹下的`vue`组件中
    - 然后将`vue`组件引入到有路由规则的markdown文件中

  - 使用效果：

    ![image-20240316182815579](/Users/ppgo8/Library/Application Support/typora-user-images/image-20240316182815579.png)

## 修改vitepress主题颜色

- 在theme下写`custom.css`文件

## 添加属性列表

- 直接写markdown的table，较为复杂

- 借助网站：

  将excel等内容转换为markdown表格

  https://markdown-convert.com/en/tool/table#help_excel

