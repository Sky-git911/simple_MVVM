import { isObject, isRef } from "../utils";
import { track, trigger } from "./reactive";

/**
 * 基本数据类型响应式
 */

// 方法一
export const ref = function (value: any) {
  if (isObject(value)) {
    if (isRef(value)) return value;
    else return;
  }

  let result = Object.create(Object.prototype, {
    isRef: { value: true },
    value: {
      get() {
        track(result, "value");
        return value;
      },
      set(newValue) {
        value = newValue;
        trigger(result, "value");
      },
    },
  });
  return result;
};

// 方法二

// export class RefImpl<T = any> {
//   private _value: T;
//   private readonly _target: Record<any, any>;
//   private isRef: Record<any, boolean>;

//   constructor(value: T) {
//     this._value = value;
//     this._target = { value: this._value };
//     this.isRef = { value: true };
//   }

//   get value() {
//     track(this._target, "value");
//     return this._value;
//   }

//   set value(value) {
//     this._value = value;
//     this._target.value = this._value;
//     trigger(this._target, "value");
//   }
// }

// export function ref<T extends any>(value: T): RefImpl<T> {
//   return new RefImpl(value);
// }
