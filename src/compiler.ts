import { toArray } from "./utils";

const removeSpaceAndLineBreak = /\s*|[\r\n]/g; // 去掉多余的空格和换行符
const escape = /({{([\s\S]+?)}})+/g;

export type elemOption = {
  [props: string]: any;
};

/**
 * 模板编译 将其处理成 render 函数
 * 通过 new Function 来生成函数
 * 借助 with() {} 语法，保证表达式能从环境中取到对应的值
 */
export const compile = function (element: Element) {
  let code = `with(this) {return ${processElem(element)}}`;
  return new Function(code);
};

/**
 *  处理元素
 */
const processElem = function (element: Element | Text) {
  let code = "";
  // 处理元素节点， _c 代替 createElement
  if (element instanceof Element) code = `_c("${element.localName}",`;
  // 处理文本节点
  else if (element instanceof Text) {
    let text = element.wholeText.replace(removeSpaceAndLineBreak, ""); // 去掉空格回车
    let newText = text.replace(escape, function (match: string) {
      // 处理 ref 的情况 用 _v 方法包起来
      // 最终有效结果  xxx{{yyy}}xxx => `xxx${_v(yyy)}xxx`
      return `\${_v(${match.slice(2, -2)})}`;
    });
    return `\`${newText}\``;
  } else return;

  code += processAttrs(element);

  // 子元素递归调用
  let children = toArray(element.childNodes).map(processElem);
  code += `,[${children.join(",")}]`;

  return (code += ")");
};

/**
 * 处理元素属性
 */
const processAttrs = function ({ attributes }: Element) {
  let code: string[] = [];
  // options 结构：{attr: {key: value or expression}, event: {key: expression}}
  let options: elemOption = {
    attrs: [],
    event: [],
  };
  let attrs: any[] = Array.prototype.slice.call(attributes);
  attrs.forEach(({ name, value }) => {
    // 非原生属性  key 要把前缀删掉(:  @)
    if (name[0] === ":") {
      // : 开头的动态属性
      options.attrs.push(`${name.slice(1)}:${value}`);
    } else if (name[0] === "@") {
      // @ 开头的事件
      options.event.push(`${name.slice(1)}:${value}`);
      // } else if (name[0] === "v") {  toDo...
      //   // v- 开头的事件
      //   options.event.push(`${name.split("-")[1]}:${value}`);
    } else {
      // 原生的元素属性 如 class="box"
      options.attrs.push(`${name}:"${value}"`);
    }
  });

  Object.keys(options).forEach((key) => {
    if (options[key].length > 0)
      code.push(`${key}:{${options[key].join(",")}}`);
  });

  return `{${code.join(",")}}`;
};
