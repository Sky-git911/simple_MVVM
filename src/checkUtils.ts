export function isObject(target: unknown): boolean {
  return typeof target === "object" && target != null;
}

export const isRef = function (target: any) {
  return isObject(target) && "isRef" in target && target.isRef;
};
