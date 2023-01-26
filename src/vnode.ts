import { elemOption } from "./compiler";

export enum NodeType {
  Element = 1,
  Attr,
  Text,
}

// 虚拟节点参数约束
type VNodeOptions = {
  tagName?: string;
  attrs?: elemOption;
  event?: EventOptions;
  children?: VNode[];
  nodeValue?: string; // 文本元素的值
  type: NodeType;
};

// 事件参数约束
type EventOptions = {
  [props: string]: EventListener | EventListenerObject;
};

export class VNode {
  tagName?: string;
  attrs: elemOption = {};
  event: EventOptions = {};
  children: VNode[] = [];
  el: Element | Text | undefined; // 存放真实元素对象
  nodeValue?: string;
  type: NodeType;

  constructor({
    tagName,
    attrs,
    event,
    children,
    nodeValue,
    type,
  }: VNodeOptions) {
    this.tagName = tagName;
    attrs && (this.attrs = attrs);
    event && (this.event = event);
    children && (this.children = children);
    this.nodeValue = nodeValue;
    this.type = type;
  }
}
