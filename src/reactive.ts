import { isObject } from "./checkUtils";

/**
 * 实现响应式对象
 */
export const reactive = function (target: object) {
  if (!isObject(target)) return target;

  let handler: ProxyHandler<object> = {
    get(target: object, key: string | symbol, receiver) {
      let result = Reflect.get(target, key, receiver);

      return isObject(result) ? reactive(result) : result;
    },
    set(target: object, key: string | symbol, value: unknown, receiver) {
      Reflect.set(target, key, value, receiver);
      return true;
    },
  };

  let observed = new Proxy(target, handler);

  return observed;
};
