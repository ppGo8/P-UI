import { beforeAll, describe, expect, test, vi } from "vitest";
import { mount } from '@vue/test-utils';
import type { VueWrapper, DOMWrapper } from '@vue/test-utils';
import Collapse from "./Collapse.vue";
import CollapseItem from "./CollapseItem.vue";

const fn = vi.fn()
let wrapper: VueWrapper
let headers: DOMWrapper<Element>[], contents: DOMWrapper<Element>[]
let firstContent: DOMWrapper<Element>, secondContent: DOMWrapper<Element>, disabledContent: DOMWrapper<Element>,
  firstHeader: DOMWrapper<Element>, secondHeader: DOMWrapper<Element>, disabledHeader: DOMWrapper<Element>

describe('Collapse.vue',() => {
  // 在所以用例执行前执行一次
  // 作用：在其中挂载组件实例就不用在每个test中写一遍了
  beforeAll(() => {
    // jsx语法 {}
    // 此处可以写解析后的modelValue的格式,也可以写v-model
    wrapper = mount(()=> 
      <Collapse modelValue={['a']} onUpdate:model-value={fn}>
        <CollapseItem name='a' title='a'>content a</CollapseItem>
        <CollapseItem name='b' title='b'>content b</CollapseItem>
        <CollapseItem name='c' title='c' disabled>content c</CollapseItem>
      </Collapse>
    , {
      global: {
        stubs: ['Icon'],
      },
      // 解决问题：
      // 触发事件后, 改变了dom的v-if/v-show,但是测试的isVisible()方法却没有检测到
      attachTo: document.body
    })
    // 获取对应的dom
    headers = wrapper.findAll('.pp-collapse-item__header')
    contents = wrapper.findAll('.pp-collapse-wrapper')
    firstHeader = headers[0]
    secondHeader = headers[1]
    disabledHeader = headers[2]
    firstContent = contents[0]
    secondContent = contents[1]
    disabledContent = contents[2]
  })

  test('文本和基础结构', () => {
    // 文本内容
    expect(firstHeader.text()).toBe('a')
    expect(secondHeader.text()).toBe('b')
    expect(disabledHeader.text()).toBe('c')
    
    expect(firstContent.text()).toBe('content a')
    expect(secondContent.text()).toBe('content b')
    expect(disabledContent.text()).toBe('content c')

    // 是否可见 v-if和v-show
    expect(firstContent.isVisible()).toBeTruthy();
    expect(secondContent.isVisible()).toBeFalsy();
    expect(disabledContent.isVisible()).toBeFalsy();
  })

  test('点击事件效果', async () => {
    // 测试点： 1.dom事件是否触发 emitted 2.事件的回调函数是否执行 3.是否产生预期的效果
    // 注意点：
    //   1.dom事件是异步的 因此想测试结果需要写await; 
    //   2.触发事件不需要写在await中
    //   3.事件测试方案：触发后的表现为预期的结果
    await firstHeader.trigger('click');
    expect(firstContent.isVisible()).toBeFalsy();

    await secondHeader.trigger('click');
    expect(secondContent.isVisible()).toBeTruthy();
    // expect(fn).toHaveBeenLastCalledWith(['b'])
    expect(fn).toHaveBeenCalledWith([])
    expect(fn).toHaveBeenCalledWith(['b'])
  })

  test('disabled效果', async () => {
    fn.mockClear() // 清除事件之前已经被触发存储的聂荣
    await disabledHeader.trigger('click');
    expect(disabledHeader.classes()).contain('is-disabled');
    expect(disabledContent.isVisible()).toBeFalsy();
    expect(fn).not.toHaveBeenCalled()
  })

})