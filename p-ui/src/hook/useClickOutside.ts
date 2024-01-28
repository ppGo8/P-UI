import type { Ref } from "vue";
import { onMounted, onUnmounted } from "vue";
/**
 * 判断触发点击事件元素是否在传入的指定元素之内,则触发指定操作
 * @param elementRef 指定元素
 * @param callback 用户点击元素不在指定元素之内则执行该回调函数
 */
const userClickOutside = (elementRef: Ref<HTMLElement | undefined>, callback: () => void): void => {
  // 点击任意地方的回调函数
  const clickHandeler = (e: MouseEvent): void => {
    // contains: dom提供的方法,判断一个元素是否为某个元素的子元素(包括元素本身)
    if (elementRef.value && e.target) {
      if (!elementRef.value.contains(e.target as HTMLElement)) {
        callback()
      }
    }
  }
  onMounted(() => {
    // 在domcument上添加点击事件,这样才能收集所有的click事件然后判断
    document.addEventListener('click', clickHandeler)
  })
  onUnmounted(() =>{
    document.removeEventListener('click', clickHandeler)
  })
}

export default userClickOutside
