import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Icon from '../Icon/Icon.vue'

/**
 * 测试内容： 1.组件是否存在 2.组件属性是否正确, 包括props传递和插槽传递 S
 */

// describe分组
describe('Button.vue', () => {
  // test每个测试用例
  test('basic button', () => {
    const wrapper = mount(Button, {
      // 在组件上写属性
      props: {
        type: 'primary',
      },
      // 传递插槽
      slots: {
        // 默认插槽
        default: 'button'
      }
    })
    // 输出dom结构
    console.info(wrapper.html());

    // 类名测试
    expect(wrapper.classes()).toContain('pp-button--primary')
    // slot文本测试
    // get, find 遍历对应的节点,这两个会返回新的dom
    // get中的参数可以写querySelector也支持的内容
    // 检验文本是否等于button
    expect(wrapper.get('button').text()).toBe('button') 
    // events测试
    wrapper.get('button').trigger('click') // 触发对应事件
    console.log(wrapper.emitted()) // emitted输出当前触发的所有事件的名称的对象,
    expect(wrapper.emitted()).toHaveProperty('click') // object中是否包含对应的属性
  })

  test('disabled', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true
      },
      slots: {
        default: 'disabled'
      }
    })

    console.info(wrapper.html())
    
    // attributes获取一个dom节点上的属性
    expect(wrapper.attributes('disabled')).toBeDefined()
    
    // 拿到真正的dom节点而不是wrapper
    // wrapper.find('button').element 即button属性所代表的的真正的节点
    expect(wrapper.find('button').element.disabled).toBeDefined()
   
    // disabled就不能触发click事件了
    wrapper.get('button').trigger('click') // 触发对应事件
    console.log(wrapper.emitted()) // emitted输出当前触发的所有事件的名称的对象,
    expect(wrapper.emitted()).not.toHaveProperty('click') // object中是否包含对应的属性
  })


  /**
   * button使用图标时,会使用第三方组件库：FontAwesomeIcon; 
   *   注意此处仅限第三方组件库会有问题,当前测试组件中使用了本地封装的组件是不会报错的
   *   如果这个测试组件中没有引入图标的组件,就是会报错stderr
   * 好的测试：在测试时不使用第三方组件库,加快测试速度
   * 解决方法: stubs存根
   *   也可以stub本地二次封装的组件
   */
  test('icon', () => {
    const wrapper = mount(Button, {
      props: {
        icon: 'user',
      },
      slots: {
        default: 'button'
      },
      // 将第三方组件模拟为简单的内容
      // 使用html()输出dom后，会直接将第三方组件显示为一个标签节点<第三方组件名-sub>,而不会渲染成他下面对应的真实的dom
      global: {
        stubs: ['FontAwesomeIcon']
      }
    })

    // 查看渲染出来的dom结构
    console.info(wrapper.html());
    
    // 找组件 
    // findComponent 找不到也不会报错；get如果找不到会报错
    const iconComponent = wrapper.findComponent(FontAwesomeIcon)
    expect(iconComponent.exists()).toBeTruthy() // 检验组件是否存在
    expect(iconComponent.attributes('icon')).toBe('user')
  })

  test('loading', ()=> {
    const wrapper = mount(Button, {
      props: {
        loading: true,
      },
      slots: {
        default: 'button'
      },
      // 将第三方组件模拟为简单的内容
      // 使用html()输出dom后，会直接将第三方组件显示为一个标签节点<第三方组件名-sub>,而不会渲染成他下面对应的真实的dom
      global: {
        stubs: ['Icon']
      }
    })

    // 查看渲染出来的dom结构
    console.info(wrapper.html());
    
    // 找组件 
    // findComponent 找不到也不会报错；get如果找不到会报错
    const iconComponent = wrapper.findComponent(Icon)
    expect(iconComponent.exists()).toBeTruthy() // 检验组件是否存在
    expect(iconComponent.attributes('icon')).toBe('spinner')
  })
})