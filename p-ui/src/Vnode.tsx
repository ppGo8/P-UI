// 直接使用ts创建虚拟dom然后渲染到页面中,而无需使用模板

// 创建vnode的方法
// 1.h函数 2.createVnode函数
// 语法： h(节点或自定义组件,属性,子节点) 
import { h, defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'Vnode',
  props: {
    msg: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const count = ref(1)
    // render function
    // setup可以返回 1.对象,给模板使用 2.函数,函数返回值就直接整个渲染在页面上
    // return () => h('h1', props.msg + count.value); 
    // 上面渲染函数h的写法较复杂,语义化不明确,对于复杂结构较难读懂
    // 因此使用jsx语法(无需写渲染函数),可以直接写dom结构解析
    //   细节: jsx中使用变量用一个花括号,模板是两个花括号
    //         使用响应式数据时依然需要写.value语法
    return () => (
      <div>
        <h1>{props.msg}</h1>
        <h1>{count.value}</h1>
      </div>
    )
  },
})
