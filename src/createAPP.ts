import { compile } from "./compiler";
import { createElement } from "./createElem";
import { isRef } from "./utils";

interface setupOptions {
  setup?: (fn: createElement) => any;
}

interface App {
  $option: setupOptions;
  component: ComponentInstance;
  mount: (selector: string) => void;
}

interface ComponentInstance {
  $option: setupOptions;
  render?: Function;
  el?: Element;
  _c: createElement;
  _v: (target: any) => any;
  proxy: object;
}

/**
 * 构建实例
 * mount 方法：挂载页面
 * 大概流程：compiler 处理模版得到 render 函数，  处理 setup 得到数据
 */
const createApp = function (options: setupOptions) {
  let instance = createInstance(options);
  /**
   * app 实例中
   * $option 储存原始配置
   * component 存组件实例
   * mount 用于向目标元素挂载
   * 其中会有 _c、_v 供 render 函数调用
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

      processSetup(instance);
    },
  };
  return app;
};

const getValue = function (target: any) {
  return isRef(target) ? target.value : target;
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
const processSetup = function (instance: ComponentInstance) {};
