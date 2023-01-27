import { VNode } from "./vnode/vnode";

/**
 * 判断是否为 object 对象
 * @param target unknown
 * @returns boolean
 */
export function isObject(target: unknown): boolean {
  return typeof target === "object" && target != null;
}

/**
 * 判断是否是 ref 基本属性值
 * @param target any
 * @returns boolean
 */
export function isRef(target: any): boolean {
  return isObject(target) && "isRef" in target && target.isRef;
}

interface ArrayLike {
  [index: number]: any;
  length: number;
}

export function toArray(arr: ArrayLike) {
  return Array.prototype.slice.call(arr);
}

/**
 * 获取 target 的值
 * @param target any
 * @returns any
 */
export function getValue(target: any) {
  return isRef(target) ? target.value : target;
}

/**
 * diff判断是否是相同节点
 * @param oldVNode VNode
 * @param newVNode VNode
 * @returns boolean
 */
export function isSameVNode(oldVNode: VNode, newVNode: VNode): boolean {
  if (
    oldVNode.type === newVNode.type &&
    oldVNode.tagName === "input" &&
    newVNode.tagName === "input"
  ) {
    if (!oldVNode.attrs.type && !newVNode.attrs.type) return true;
    return oldVNode.attrs.type === newVNode.attrs.type;
  } else {
    return (
      oldVNode.type === newVNode.type && oldVNode.tagName === newVNode.tagName
    );
  }
}
