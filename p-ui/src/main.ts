// 引入图标相关包
import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
// 引入单个图标
// import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
// 引入全部图标
import { fas } from '@fortawesome/free-solid-svg-icons'

// import App from './App1.vue'
import App from './AppInput.vue'

// 添加图标 引入后需要在这里添加
library.add(fas)
import './styles/index.css' // 引入自己的自定义样式

createApp(App)
  .mount('#app')
