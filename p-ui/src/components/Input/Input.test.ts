import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Input from './Input.vue';

describe('Input', () => {
  it('基本展示', () => {
    const wrapper = mount(Input, {
      props: {
        size: 'small',
        type: 'text',
        modelValue: 'test',
      },
      slots: {
        prepend: 'prepend',
        prefix: 'prefix',
      }
    })

    console.log(wrapper.html());
    
    // 1.classes是否正确
    // 注意：classes是获得组件解析为html最外层标签上(包括注释标签)的class
    console.log(wrapper.classes());
    expect(wrapper.classes()).toContain('pp-input--small');
    expect(wrapper.classes()).toContain('is-prepend');

    // 2.是否渲染正确的标签和节点
    expect(wrapper.find('input').exists()).toBeTruthy();
    expect(wrapper.get('input').attributes('type')).toBe('text');

    // 3.slots
    expect(wrapper.find('.pp-input__prepend').exists()).toBeTruthy();
    expect(wrapper.get('.pp-input__prepend').text()).toBe('prepend');
    expect(wrapper.find('.pp-input__prefix').exists()).toBeTruthy();
    expect(wrapper.get('.pp-input__prefix').text()).toBe('prefix');

    // textarea 
    const wrapper2 = mount(Input, {
      props: {
        type: 'textarea',
        modelValue: '',
      }
    })
    expect(wrapper2.find('textarea').exists()).toBeTruthy();
  }) 

  it('支持v-model',async () => {
    const wrapper = mount(Input, {
      props: {
        type: 'text',
        modelValue: 'test',
        'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e})  // 测试中 组件上的事件也是通过props传递的
      }
    })
    // console.log('v-model', wrapper.html());

    // 1.初始值
    const input = wrapper.get('input');
    expect(input.element.value).toBe('test');

    // 2.更新值: 从界面用户处更新值
    // 注意 setValue 是组合事件会触发 input 以及 change
    await input.setValue('mynewval'); 
    expect(input.element.value).toBe('mynewval'); // 查看dom处的值
    expect(wrapper.props('modelValue')).toBe('mynewval'); // 查看vue中props的值

    // 3.查看触发的事件
    console.log('@触发的事件列表', wrapper.emitted());
    // wrapper.emitted()，结构为对象数组，存储所有触发的事件和参数值
    // key: 事件名
    // value: 二维数组，用于存储触发事件传递的参数（下标为0的数组存储的最近一次事件的参数）
    expect(wrapper.emitted()).toHaveProperty('input');
    expect(wrapper.emitted()).toHaveProperty('change');
    const inputEvent = wrapper.emitted('input');
    const changeEvent = wrapper.emitted('change');
    expect(inputEvent![0]).toEqual(['mynewval']);
    expect(changeEvent![0]).toEqual(['mynewval']);

    // 4.更新值: 从props处更新值，也称为异步更新。
    // 问题：从父组件处修改传递给子组件的props的值，那为什么不是响应式的呢？
    // 原因： 
    //   子组件定义处： const innerValue = ref(props.modelVaue) 只会在组件挂载的时候执行一次； 在子组件内部的input v-model = innerValue; 因为这里是允许双向修改的，所以不能直接写父组件的props
    //   所以父组件修改了值 子组件的props.modelVaue确实发生了变化
    //   但是赋值的innerValue语句不会执行第二次 所以不会发生改变
    // 解决方法：
    //   子组件中watch props.modelVaue，发生变化时候重新为innerValue赋值
    await wrapper.setProps({modelValue: 'propupdate'}); 
    expect(wrapper.props('modelValue')).toBe('propupdate');  // 查看vue中poprs的值
    expect(input.element.value).toBe('propupdate');  // 查看dom处的值

  })

  it('支持点击清空', async () => {
    const wrapper = mount(Input, {
      props: {
          modelValue: 'test',
          clearable: true,
          type: 'text' 
      },
      global: {
        stubs: ['Icon']
      }
    })

    // 开始状态：不应该出现对应Icon区域
    // console.log(wrapper.html());
    expect(wrapper.find('.pp-input__clear').exists()).toBeFalsy();

    // 获取焦点后： 出现对应的区域
    const input = wrapper.get('input');
    await input.trigger('focus');
    expect(wrapper.find('.pp-input__clear').exists()).toBeTruthy();
    
    // 点击icon后值变为空
    await wrapper.get('.pp-input__clear').trigger('click');
    expect(input.element.value).toBe('');

    // 事件
    // 点击clear后会触发下面三个事件
    console.log('@触发的事件列表', wrapper.emitted());
    expect(wrapper.emitted()).toHaveProperty('clear');
    expect(wrapper.emitted()).toHaveProperty('input');
    expect(wrapper.emitted()).toHaveProperty('change');
    const inputEvent = wrapper.emitted('input');
    const changeEvent = wrapper.emitted('change');
    expect(inputEvent![0]).toEqual(['']);
    expect(changeEvent![0]).toEqual(['']);

    // await input.trigger('blur');
    // expect(wrapper.emitted()).toHaveProperty('blur');

  }) 

  it('支持切换密码显示', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
        showPassword: true,
        type: 'text',
      },
      global: {
        stubs: ['Icon'],
      }
    })

    // 开始状态
    // 不存在对应的Icon区域 因为当前值为空
    expect(wrapper.find('pp-input__password').exists()).toBeFalsy();
    // input类型
    const input = wrapper.get('input');
    expect(input.element.type).toBe('password');

    // 输入内容， 出现icon区域
    await input.setValue('123'); // [注意]： setValue这个方法会触发input和change
    const eyeIcon = wrapper.find('.pp-input__password');
    expect(eyeIcon.exists()).toBeTruthy();
    expect(eyeIcon.attributes('icon')).toBe('eye-slash');
    
    // 点击值切换input类型  由password切换为text
    await eyeIcon.trigger('click');
    expect(input.element.type).toBe('text');
    expect(wrapper.find('.pp-input__password').attributes('icon')).toBe('eye');
  })
})