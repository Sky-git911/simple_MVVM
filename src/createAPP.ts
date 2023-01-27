import { createElement } from "./createElem";
import { isRef } from "./utils";

/**
 * 构建实例
 * mount 方法：挂载页面
 * 大概流程：compiler 处理模版得到 render 函数，  处理 setup 得到数据
 */
const createApp = function (options) {
  let instance = createInstance(options);
  let app = {
    $option: options,
    component: instance,
    mount(selector) {},
  };
  return app;
};

const getValue = function (target: any) {
  return isRef(target) ? target.value : target;
};

const createInstance = function (options) {
  let instance = {
    $option: options,
    _c: createElement,
    _v: getValue,
    proxy: {},
  };
  return instance;
};
