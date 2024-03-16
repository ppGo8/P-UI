import { defineConfig } from 'vitepress';
import { containerPreview, componentPreview } from '@vitepress-demo-preview/plugin'
;
import { fileURLToPath, URL } from 'node:url';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "P-Element 组件库",
  description: "使用vue3.3 + TS5打造的UI组件库",
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../../src', import.meta.url))
      }
    }
  },
  // 设置为markdown匹配路的文件夹,默认为整个根文件夹
  // srcDir:'components',
  markdown: {
    config(md) {
      md.use(containerPreview)
      md.use(componentPreview)
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // 右侧导航
    nav: [
      { text: '首页', link: '/' },
      { text: '开始使用', link: '/components/Introduce' }
    ],
    // 进入右侧导航后 左侧目录
    sidebar: [
      {
        text: '开发指南',
        items: [
          { text: '安装', link: '/components/Introduce' },
          { text: '快速上手', link: '/components/#' },
          { text: '国际化', link: '/components/#' },
        ]
      },
      {
        text: '组件列表',
        items: [
          { text: 'Button 按钮', link: '/components/Button' },
          { text: 'Alert 提示', link: '/components/#' },
          { text: 'Collapse 折叠面板', link: '/components/#' },
          { text: 'Tooltip 文字提示', link: '/components/#' },
          { text: 'Dropdown 下拉菜单', link: '/components/#' },
          { text: 'Message 消息提示', link: '/components/#' },
          { text: 'Notification 通知', link: '/components/#' },
          { text: 'Input 输入框', link: '/components/#' },
          { text: 'Switch 开关', link: '/components/#' },
          { text: 'Select 选择器', link: '/components/#' },
          { text: 'Form 表单', link: '/components/#' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})