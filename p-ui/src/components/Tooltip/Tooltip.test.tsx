import { describe, test, expect, vi, beforeEach } from "vitest";
import { mount } from '@vue/test-utils';
import Tooltip from "./Tooltip.vue";

// mock掉第三方库的效果 提高运行速度
vi.mock('@popperjs/core') 
const fn = vi.fn() 
describe('Tooltip.vue', () => {

  beforeEach(() => {
    vi.useFakeTimers()
  })

  test('basic Tooltio', async () => {
    const wrapper = mount(() => 
      <>
        <div id='outside'></div>
        <Tooltip content="hello" trigger="click" onVisible-change = { fn }>
          <button id='trigger'>Trigger</button>
        </Tooltip>
      </>
    , {
      attachTo: document.body
    })
    // 静态测试
    const triggerDom = wrapper.find('#trigger')
    expect(triggerDom.exists()).toBeTruthy()
    expect(wrapper.find('.pp-tooltip__popper').exists()).toBeFalsy()
    console.info('before', wrapper.html())

    // 测试行为
    triggerDom.trigger('click')
    // 等待组件库点击trigger后,代码中的所有待执行定时器执行完毕
    await vi.runAllTimers()  // 重要,因为在原来的代码中 执行poper显示与隐藏的回调函数被包裹在了定时器中
    expect(wrapper.find('.pp-tooltip__popper').exists()).toBeTruthy()
    expect(wrapper.get('.pp-tooltip__popper').text()).toBe('hello')
    expect(fn).toHaveBeenCalledWith(true)
    console.info('after', wrapper.html())
    const outsideDom = wrapper.find('#outside')
    outsideDom.trigger('click')
    await vi.runAllTimers()  // 重要
    expect(wrapper.find('.pp-tooltip__popper').exists()).toBeFalsy()
    expect(fn).toHaveBeenCalledWith(false)
  })
})