import { isObject, isRef } from "./utils";
import { track, trigger } from "./reactive";

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
