
// 组件的slot为另外一个自定义组件的两种较为复杂的写法
// 1. h渲染函数 2.tsx
// 3.在另外一个测试文件中介绍：在mounted中第一个参数写为函数,函数返回值为tsx

import { describe, expect, test } from "vitest";
// import { h } from 'vue';
import { mount } from '@vue/test-utils';
import Collapse from "./Collapse.vue";
import CollapseItem from "./CollapseItem.vue";

describe('Collapse.vue',() => {
  test('basic Collapse', async () => {
    const wrapper = mount(Collapse, {
      props: {
        // v-model实际渲染的内容,v-model是语法糖
        modelValue: ['a']
      },
      // 【重点】因为传递给slots的内容是一个组件,所以此处要传递一个vnode
      slots: {
        // default: h(CollapseItem, { name: 'a', title: 'a'}, 'item a'), // 使用渲染函数语法,文件名后缀为.ts
        default: // 使用Jsx语法写slot,注意多行slot必须写在同一个父节点下
          (<> 
            <CollapseItem name='a' title='a'>content a</CollapseItem> 
            <CollapseItem name='b' title='b'>content b</CollapseItem> 
            <CollapseItem name='c' title='c' disabled>content c</CollapseItem> 
          </>)
      },
      // 存根某个自定义组件或第三方组件
      global: {
        stubs: ['Icon']
      },
      attachTo: document.body
    })

    console.info(wrapper.html())

    // 编写测试用例
    // 获取需要测试的dom结构
    const [firstHeader, secondHeader, disabledHeader] = wrapper.findAll('.pp-collapse-item__header')
    const [firstContent, secondContent, disabledContent ] = wrapper.findAll('.pp-collapse-wrapper')
    
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

    // 事件
    await firstHeader.trigger('click');
    expect(firstContent.isVisible()).toBeFalsy();
    await secondHeader.trigger('click');
    expect(secondContent.isVisible()).toBeTruthy();
    // wrapper.emitted()获取所有已经触发的事件
    // wrapper.emitted('xxx') 获取所有触发的为xxx的事件的信息
    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    const event = wrapper.emitted('update:modelValue') as any[]
    console.table(event)
    expect(event).toHaveLength(2)
    expect(event[0]).toEqual([[]])
    expect(event[1]).toEqual([['b']])

    // 测试disabled
    await disabledHeader.trigger('click');
    expect(disabledHeader.classes()).contain('is-disabled');
    expect(disabledContent.isVisible()).toBeFalsy();

  })
})
