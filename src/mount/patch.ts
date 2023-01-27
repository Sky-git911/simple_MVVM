import { ComponentInstance } from "./createAPP";
import { getValue, isRef, isSameVNode } from "../utils";
import { NodeType, VNode } from "../vnode/vnode";

export function patch(
  oldVNode: VNode | undefined,
  newVNode: VNode,
  instance: ComponentInstance
) {
  // 初始化时的挂载
  if (!oldVNode) {
    let el = vnodeToElem(newVNode);
    if (el && instance.el) {
      instance.el.parentNode?.replaceChild(el, instance.el);
    }
    return;
  }

  /**
   * diff
   * 比较时只判断元素类型和 tagName （input 元素还判断 type 类型）（不实现 key 值）
   * 相似就复用，不相似就替换
   */
  if (!isSameVNode(oldVNode, newVNode)) {
    let el = vnodeToElem(newVNode);
    if (el && oldVNode.el) {
      oldVNode.el.parentNode?.replaceChild(el, oldVNode.el);
    }
  } else {
    // 文本节点但内容改变
    if (
      newVNode.type === NodeType.Text &&
      oldVNode.nodeValue !== newVNode.nodeValue
    ) {
      newVNode.nodeValue && (oldVNode.el!.nodeValue = newVNode.nodeValue);
    } else {
      // 元素节点
    }
  }
}

function vnodeToElem(vnode: VNode) {
  if (vnode.type === NodeType.Text) {
    let el = document.createTextNode(getValue(vnode.nodeValue) || "");
    vnode.el = el;
    return el;
  }
  //   此时已经是 文本 节点
  if (!vnode.tagName) return;

  let el = document.createElement(vnode.tagName);
  //   设置元素属性
  for (let key in vnode.attrs) {
    if (isRef(vnode.attrs[key])) {
      el.setAttribute(key, vnode.attrs[key].value);
    } else {
      el.setAttribute(key, vnode.attrs[key]);
    }
  }
  //   绑定元素事件
  for (let key in vnode.event) {
    el.addEventListener(key, vnode.event[key]);
  }
  //   循环递归生成子元素
  if (vnode.children.length > 0) {
    vnode.children.forEach((v) => {
      let child = vnodeToElem(v);
      child && el.appendChild(child);
    });
  }

  vnode.el = el;
  return el;
}
