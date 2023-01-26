import { elemOption } from "./compiler";
import { VNode, NodeType } from "./vnode";

type createElement = (
  tagName: string,
  options: elemOption,
  children: Array<VNode | string>
) => VNode;

type createText = (value: string) => VNode;

/**
 * 创建元素
 */
export const createElement: createElement = function (
  tagName,
  { attrs, event },
  children = []
) {
  let vnodeList: VNode[] = children.map((item) => {
    if (typeof item === "string") {
      return createText(item);
    } else {
      return item;
    }
  });

  return new VNode({
    tagName,
    attrs,
    event,
    children: vnodeList,
    type: NodeType.Element,
  });
};

/**
 * 创建文本
 */
export const createText: createText = function (value) {
  return new VNode({
    nodeValue: value,
    type: NodeType.Text,
  });
};
