import { isObject, isRef } from "./checkUtils";

export const ref = function (value: any) {
  if (isObject(value)) {
    if (isRef(value)) return value;
    else return;
  }

  let result = Object.create(Object.prototype, {
    isRef: { value: true },
    value: {
      get() {
        return value;
      },
      set(newValue) {
        value = newValue;
      },
    },
  });
  return result;
};
