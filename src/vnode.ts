import { elemOption } from "./compiler";
class VNode {
  tagName?: string;
  attrs: elemOption = {};
  event = {};
  children: VNode[] = [];
  el: Element | Text | undefined;
  nodeValue?: string;
  type;
  constructor({ tagName, attrs, event, children, nodeValue, type }) {
    this.tagName = tagName;
    attrs && (this.attrs = attrs);
    event && (this.event = event);
    children && (this.children = children);
    this.nodeValue = nodeValue;
    this.type = type;
  }
}
