import DefaultTheme from "vitepress/theme";

// 引入第三方图标库
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);

// 导入点击demo与显示源码相关内容
import { ElementPlusContainer } from '@vitepress-demo-preview/component';
import '@vitepress-demo-preview/component/dist/style.css'

// 导入用户组件需要使用的样式表
import '../../../src/styles/index.css';

// 导入vitepress相关自定义样式
import './custom.css';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('demo-preview', ElementPlusContainer)
  }
}