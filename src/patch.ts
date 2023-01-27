import { ComponentInstance } from "./createAPP";
import { getValue, isRef } from "./utils";
import { NodeType, VNode } from "./vnode";

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
