import { isObject } from "./checkUtils";

// 目标对象到映射对象(暂存已经代理过的对象)
const proxyedReactiveMap = new WeakMap();

/**
 * 实现响应式对象
 */
export const reactive = function (target: object) {
  if (!isObject(target)) return target;

  if (proxyedReactiveMap.has(target)) return proxyedReactiveMap.get(target);

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

  proxyedReactiveMap.set(target, observed);

  return observed;
};

type Dep = Set<ReactiveEffect>;
type KeyMap = Map<any, Dep>; // key 是 target 中的某个 key , 其对应的 value 是和该 key 所有绑定的 effect 的集合，是一个 Set。
const targetMap = new WeakMap<any, KeyMap>(); //储存所有的依赖关系 , key 是目标对象 target , 值是一个 Map

/**
 * 追踪绑定依赖
 */
export const track = function (target: object, key: string | symbol): void {
  if (!activeEffect) return;

  let keyMap = targetMap.get(target);
  if (!keyMap) targetMap.set(target, (keyMap = new Map()));

  let depsOfKey = keyMap.get(key);
  if (!depsOfKey) keyMap.set(key, (depsOfKey = new Set()));

  if (!depsOfKey.has(activeEffect)) depsOfKey.add(activeEffect);
};

/**
 * 响应触发依赖
 */
export const trigger = function (target: object, key: string | symbol): void {
  let keyMap = targetMap.get(target);
  if (!keyMap) return;
  let deps = keyMap.get(key);
  if (!deps) return;
  deps.forEach((effect: ReactiveEffect) => {
    effect();
  });
};

export interface ReactiveEffect<T = any> {
  (...args: any[]): T;
  _isEffect: true;
  deps: Array<Dep>;
}

let activeEffect: ReactiveEffect | undefined; //只要当前 activeEffect 存在，就把它存进 targetMap 的对应位置中，这样就完成了一次依赖收集。

export const effect = function <T = any>(
  fn: (...args: any[]) => T
): ReactiveEffect<T> {
  const effect = function (...args: any[]) {
    try {
      activeEffect = effect;
      return fn(...args);
    } finally {
      activeEffect = undefined;
    }
  } as ReactiveEffect;

  effect._isEffect = true;
  effect.deps = new Array<Dep>();

  effect();

  return effect;
};
