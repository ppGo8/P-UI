/**
 * 中介组件：可以自动解析传入的vnode
 * 原理：setup return一个函数,该函数的返回值会被渲染在当前组件上（渲染优先级高于模板）
 *   return h(tagName or vc,属性,子组件) // h函数返回Vnode节点
 *   return () => Vnode节点
 */
import { defineComponent } from "vue";
const RenderVnode = defineComponent({
  props: {
    vNode: {
      type: [String, Object],
      required: true
    }
  },
  setup(props) {
    return () => props.vNode  // setup返回的函数为渲染函数,render 该函数可以将虚拟节点渲染为真实DOM,显示在界面上
  }
})

export default RenderVnode