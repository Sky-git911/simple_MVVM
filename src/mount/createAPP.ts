import { compile } from "../compiler";
import { createElement } from "../vnode/createElem";
import { patch } from "./patch";
import { getValue } from "../utils";
import { VNode } from "../vnode/vnode";
import { effect, ReactiveEffect } from "../reactivity/reactive";

interface setupOptions {
  setup?: (fn: createElement) => any;
}

interface App {
  $option: setupOptions;
  component: ComponentInstance;
  mount: (selector: string) => void;
}

export interface ComponentInstance {
  $option: setupOptions;
  render?: Function;
  el?: Element;
  _c: createElement;
  _v: (target: any) => any;
  proxy: object;
  vnode?: VNode;
  setupRes?: any;
  update?: ReactiveEffect;
}

/**
 * 构建实例
 * mount 方法：挂载页面
 * 大概流程：compiler 处理模版得到 render 函数，  处理 setup 得到数据
 */
export const createApp = function (options: setupOptions) {
  let instance = createInstance(options);
  /**
   * app 实例中
   * $option 储存原始配置
   * component 存组件实例
   * mount 用于向目标元素挂载
   * 其中 instance 的 _c、_v 供 render 函数调用
   */
  let app: App = {
    $option: options,
    component: instance,
    mount(selector) {
      let el = document.querySelector(selector);
      if (!el) return;

      let instance = this.component;
      instance.el = el;
      //拿到需要挂载的 dom 元素后，将目标 dom 树编译成 render 函数
      instance.render = compile(el);
      // 处理 setup 方法 -> 将数据对象代理至 instance 上，这样就可以通过 this.xxx 拿到数据了
      processSetup(instance);

      // 用 effect 方法包裹 render 方法去 处理和 patch 过程
      // 这样第一次处理并调用 render 函数时会进行依赖收集
      // 之后每次数据变化都会调用 instance.update 来实时刷新页面
      instance.update = effect(function () {
        let vnode = instance.render?.call(instance.proxy);
        let oldVNode = instance.vnode;
        instance.vnode = vnode;

        patch(oldVNode, vnode, instance);
      });
      return app;
    },
  };
  return app;
};

const createInstance = function (options: setupOptions): ComponentInstance {
  let instance = {
    $option: options,
    _c: createElement,
    _v: getValue,
    proxy: {},
  };
  return instance;
};

/** 
 处理实例中的 setup 函数
 */
const processSetup = function (instance: ComponentInstance) {
  let { setup } = instance.$option;
  if (setup) {
    instance.setupRes = setup.call(instance, createElement);
    let setupRes = instance.setupRes;

    instance.proxy = new Proxy(instance, {
      get: (target: ComponentInstance, key: string, receiver) => {
        if (key in setupRes) {
          return setupRes[key];
        } else {
          return Reflect.get(target, key, receiver);
        }
      },
      set(target: ComponentInstance, key: string, value: any, receiver) {
        if (key in setupRes) {
          setupRes[key] = value;
          return true;
        }
        let result = Reflect.set(target, key, value, receiver);
        return result;
      },
      //   has 方法， 帮助 with 语句拿到结果
      has(target: ComponentInstance, key: string) {
        return key in setupRes || Reflect.has(target, key);
      },
    });
  }
};
