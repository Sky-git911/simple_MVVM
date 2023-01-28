# 一个简单的 MVVM 框架
基于 `vue3` 的响应式原理实现的一个简单的 `MVVM` 模型

框架主要实现的几个部分：
- reactivity: 响应式数据 使用 proxy 数据代理实现数据劫持。
- compiler： 模板编译，这里没有将模板字符串转换成为`AST`，而是直接获取 Element 将其处理成 render 函数。
- vnode: 虚拟 dom, 用于 diff 过程。
- mount: 实例挂载，调用 compiler 处理模版得到 render 函数，处理 setup 得到数据。

## 使用方法

### 安装依赖

```
yarn install / npm install
```

### 打包构建

生成 `bundle.js`

```
yarn build / npm run build
```

打包构建后打开根目录 `instance.html`即可

### 测试

```
yarn test / npm run test
```



## 代码结构

### reactivity

#### 使用 `proxy` 实现 `reactive`

```js
const proxyedReactiveMap = new WeakMap();

export const reactive = function (target: object) {
  if (!isObject(target)) return target;

  if (proxyedReactiveMap.has(target)) return proxyedReactiveMap.get(target);

  let handler: ProxyHandler<object> = {
    get(target: object, key: string | symbol, receiver) {
      let result = Reflect.get(target, key, receiver);
		
      // 处理数组
      if (Array.isArray(result)) {
        track(target, key);
        return reactiveArray(result, target, key);
      }

      track(target, key);
      return isObject(result) ? reactive(result) : result;
    },
    set(target: object, key: string | symbol, value: unknown, receiver) {
      let result = Reflect.set(target, key, value, receiver);

      trigger(target, key);
      return result;
    },
    deleteProperty(target: object, key: string | symbol) {
      const result = Reflect.deleteProperty(target, key);
      return result;
    },
  };

  let observed = new Proxy(target, handler);

  proxyedReactiveMap.set(target, observed);

  return observed;
};
```
> 其中使用 WeakMap 来储存已经处理过的对象和代理对象，防止对一个对象多次代理。在 getter 中对值进行是否对象的判断，这样的好处相较于`vue2`响应式的一次性递归，更加提升性能，不用一次性遍历对象，因为 proxy 只做一层代理，所以当其真正被用到时再对其进行代理。

- 想要实现响应式，必须首先创建响应式对象
```js
<script src="../dist/bundle.js"></script>

const { reactive } = simpleMVVM;
const data = {
    number: {
        count: 0
    }
}
const a = reactive(data);
const b = reactive(data);
console.log(a === b) // true
console.log(a.number) // Proxy {count: 0}
```

#### 实现数组响应式

```ts
/**
 * 设置响应式数组
 */
function reactiveArray(
  targetArr: Array<any>,
  targetObj: Record<any, any>,
  Arrkey: string | symbol
) {
  let handler: ProxyHandler<Record<any, any>> = {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);

      if (isObject(res)) {
        return reactive(res);
      }

      return res;
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver);
      trigger(targetObj, Arrkey);
      return res;
    },
    deleteProperty(target: object, key: string | symbol) {
      const result = Reflect.deleteProperty(target, key);
      return result;
    },
  };
  return new Proxy(targetArr, handler);
}
```

效果：

```js
<script src="../dist/bundle.js"></script>

const { reactive } = simpleMVVM;
const arr = reactive([10,20,30])
console.log(arr) // Proxy {0: 10, 1: 20, 2: 30}
arr.push(40);
arr.shift()
console.log(arr) // Proxy {0: 20, 1: 30, 2: 40}
```

#### 实现 `ref` 包装基本类型

```js
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
```

- 创建一个 ref 基本对象
```js
<script src="../dist/bundle.js"></script>

const { ref } = simpleMVVM;

let a = ref('hello');
console.log(a.value) // hello
a.value = 'world'
console.log(a.value) // world
```

#### 实现 `effect` 

用于包装一个方法，在 `render` 函数中用于响应触发依赖 和 后续的 patch 过程
```js
let activeEffect;
export const effect = function (fn){
  const effect = function (...args: any[]) {
    try {
      activeEffect = effect;
      return fn(...args);
    } finally {
      activeEffect = undefined;
    }
  } as ReactiveEffect;

  effect._isEffect = true;
  effect.deps = new Array<Dep>();

  effect();

  return effect;
};
```
简单包装之后会调用原方法，在调用过程中会暂存当前的包装方法 activeEffect = effect，调用过程中会触发我们的依赖收集(getter)将 activeEffect 与我们的响应式对象及其 key 绑定。

#### 实现一个简单的 发布订阅

```js
type Dep = Set<ReactiveEffect>;
type KeyMap = Map<any, Dep>; // key 是 target 中的某个 key , 其对应的 value 是和该 key 所有绑定的 effect 的集合，是一个 Set。
const targetMap = new WeakMap<any, KeyMap>(); //储存所有的依赖关系 , key 是目标对象 target , 值是一个 Map

/**
 * 追踪绑定依赖
 */
export const track = function (target: object, key: string | symbol): void {
  if (!activeEffect) return;

  let keyMap = targetMap.get(target);
  if (!keyMap) targetMap.set(target, (keyMap = new Map()));

  let depsOfKey = keyMap.get(key);
  if (!depsOfKey) keyMap.set(key, (depsOfKey = new Set()));

  if (!depsOfKey.has(activeEffect)) depsOfKey.add(activeEffect);
};

/**
 * 响应触发依赖
 */
export const trigger = function (target: object, key: string | symbol): void {
  let keyMap = targetMap.get(target);
  if (!keyMap) return;
  let deps = keyMap.get(key);
  if (!deps) return;
  deps.forEach((effect) => {
    effect();
  });
};
```
只要当前 activeEffect 存在，就把它存进 targetMap 的对应位置中，这样就完成了一次依赖收集。

如此一来 一个简单的响应式数据就完成了:
```js
let data = reactive({
  title: "hello",
});
let words = ref("world");
effect(function () {
  console.log(`${data.title} ${words.value}`);  // hello world
});
data.title = "Hello"; // Hello world
words.value = "World"; // Hello World
```

效果如图：

![响应式](.\static\响应式.gif)

### compiler 模板编译器 将其处理成 render 函数

简单处理，直接对 element 处理。
```ts
export const compile = function (element: Element) {
  let code = `with(this) {return ${processElem(element)}}`;
  return new Function(code);
};
```
将模版转化成脚本字符串，借助 with() {} 语法，保证表达式能从环境中取到对应的值，这样可以保留表达式，然后通过 `new Function` 来生成函数

> 这里并没有把所有的逻辑都放在脚本字符串中，可以先只提取重要信息，然后再调用方法统一处理。
> 如: `createElement(tagName, options, children)` 方法接收三个参数: 
>
> - `tagName`: 元素节点的 tagName
> - `options`: 冤死的各种属性 (在这个简易框架中只实现属性和事件)
> - `children`: 父元素的子元素集合
> 如此一来只需要将模板处理成: `createElement(tagName, {attrs: ..., event: ...}, [createElement(...), ...])` 即可

#### `pocessElem` 处理节点(元素节点和文本节点)

> 文本节点和元素节点有所不同，它没有标签名和属性，只有内容，所以我们直接输出字符串，后续交给 `createElement` 处理。同时文本节点可能会出现 `{{value}}` 的语法，我们要对其处理：

1. 首先通过正则去掉多余换行符和空格 (`removeSpaceAndLineBreak`)
2. 通过正则 `escape` 去替换 插值表达式 `{{xxx}}`
3. 插值表达式的内容有可能是 `ref` 方法处理的响应式对象， 所以在外包一层 `_v()`方便后续处理
4. 最终效果: `xxx{{yyy}}xxx => xxx${_v(yyy)}xxx`

```ts
const removeSpaceAndLineBreak = /\s*|[\r\n]/g; // 去掉多余的空格和换行符
const escape = /({{([\s\S]+?)}})+/g;

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
```

#### processAttrs 处理元素属性

> 这里只处理元素的三种情况
>
> 1.  : 开头的动态属性
> 2.  @ 开头的事件
> 3.  原生的元素属性 如 class="box"

##### 可扩展性

> 这边使用 `forEach`  遍历元素的所有属性，通过 `if` 语句判断属性/事件类型，还可以后续实现其他事件方法 如  `v-if` `v-for`  `v-html`等等
>
> 例: else if (name[0] === "v") {  toDo...
>
> ​      // v- 开头的事件
>
> ​     options.event.push(`${name.split("-")[1]}:${value}`);
>
> }
>
> 后续在将 虚拟节点 转为 真实 dom 节点时， 可对 上述 事件做后续处理

##### `v-show`

此处以实现 `v-show` 为例：在处理元素属性时，将 `v-` 开头的事件添加至 `elemOption` 的 `event` 中，后续在将 `vnode` 转为真实 `dom` 时，对事件进行响应式处理

```js
// in patch.ts -> function vnodeToElem
//   绑定元素事件
  for (let key in vnode.event) {
    if (key === "show") {
      effect(function () {
        el.style.display = getValue(vnode.event[key]) ? "inherit" : "none";
      });
    }
    el.addEventListener(key, vnode.event[key]);
  }
```







```ts
const processAttrs = function ({ attributes }: Element) {
  let code: string[] = [];
    
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
    } else if (name[0] === "v") {
      // v- 开头的事件
      options.event.push(`${name.split("-")[1]}:${value}`);
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
```

最终效果：

```js
<div class="box" :value="div" @click="handleClick"></div>
<!--处理成 文本-->
{
    attrs: {
        class: "box", // 原生属性的属性值用引号包裹
        value: div
    },
    event: {
        click: handleClick
    }
}
```

如此一来 `compile`方法就基本实现了:

![模板编译结果](.\static\模板编译结果.png)



### VNode

由于真实 `DOM` 的创建、更新、插入等操作会带来大量的性能损耗，从而就会极大地降低渲染效率，因此这里也实现了一个简单的虚拟`dom`来代替真实`dom`，主要是为解决渲染效率的问题

> 实现一个 VNode 类，用来描述一个真实的元素

```ts
export class VNode {
  tagName?: string;
  attrs: elemOption = {};
  event: EventOptions = {};
  children: VNode[] = [];
  el: Element | Text | undefined; // 存放真实元素对象
  nodeValue?: string; // 文本元素的值
  type: NodeType;

  constructor({tagName,attrs,event,children,nodeValue,type}:VNodeOptions){
    this.tagName = tagName;
    attrs && (this.attrs = attrs);
    event && (this.event = event);
    children && (this.children = children);
    this.nodeValue = nodeValue;
    this.type = type;
  }
}
```

> 创建元素或文本的虚拟`dom`树

```ts
/**
 * 创建元素
 */
export const createElement: createElement = function (tagName,{ attrs, event },children = []) {
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
```

生成后的 vnode 如图所示：

![vnode](.\static\vnode.png)



### createApp

用函数来构建实例，实例提供 `mount` 方法用于挂载页面

大概流程:  compiler 处理模版得到 render 函数，  处理 setup 得到数据

```ts
const createApp = function(options) {
    let instance = createInstance(options);
    let app = {
        $option: options,
        component: instance,
        mount(selector) {
            ...
        }
    };
    return app;
};

const createInstance = function(options) {
    let instance = {
        $option: options,
        _c: createElement,
        _v: getValue,
        proxy: {}
    };
    return instance;
}
```

app 实例中 `$option` 储存原始配置，`mount` 用于向目标元素挂载，`component` 存组件实例，其中会有 `_c`、`_v` 供 render 函数调用，还会存各种处理的结果。

接下来就是 `mount` 方法

```ts
mount(selector) { // 接收参数：元素选择器
    let el = document.querySelector(selector);
    if (!el) return;

    let instance = this.component;
    instance.el = el;
    //拿到需要挂载的 dom 元素后，将目标 dom 树编译成 render 函数
    instance.render = compile(el);
    // 处理 setup 方法 -> 将数据对象代理至 instance 上，这样就可以通过 this.xxx 拿到数据了
    processSetup(instance);

    // 用 effect 方法包裹 render 方法去 处理和 patch 过程
    // 这样第一次处理并调用 render 函数时会进行依赖收集
    // 之后每次数据变化都会调用 instance.update 来实时刷新页面
    instance.update = effect(function () {
        let vnode = instance.render?.call(instance.proxy);
        let oldVNode = instance.vnode;
        instance.vnode = vnode;

        patch(oldVNode, vnode, instance);
    });
    return app;
},
/** 
 处理实例中的 setup 函数
 */
const processSetup = function (instance: ComponentInstance) {
  let { setup } = instance.$option;
  if (setup) {
    instance.setupRes = setup.call(instance, createElement);
    let setupRes = instance.setupRes;

    instance.proxy = new Proxy(instance, {
      get: (target: ComponentInstance, key: string, receiver) => {
        if (key in setupRes) {
          return setupRes[key];
        } else {
          return Reflect.get(target, key, receiver);
        }
      },
      set(target: ComponentInstance, key: string, value: any, receiver) {
        if (key in setupRes) {
          setupRes[key] = value;
          return true;
        }
        let result = Reflect.set(target, key, value, receiver);
        return result;
      },
      //   has 方法， 帮助 with 语句拿到结果
      has(target: ComponentInstance, key: string) {
        return key in setupRes || Reflect.has(target, key);
      },
    });
  }
};
```

`mount` 方法接受一个元素选择器，所以可以通过选择器拿到需要挂载的 dom 元素，首先将目标 dom 树编译成 render 函数。接着处理 `setup` 方法拿到数据对象，并代理到 instance 上，这样就可以用 `this.xxx` 获取对应数据。接着再调用 render 方法获得 `vnode`。 有了 vnode 之后就可以去生成元素挂载了。



### patch

初始化时的挂载

> 此时只需要生成一个 dom 树并替换调原先的 dom 树即可

```ts
function patch(oldVNode: VNode | undefined,newVNode: VNode,instance:ComponentInstance) {
  // 初始化时的挂载
  if (!oldVNode) {
    let el = vnodeToElem(newVNode);
    if (el && instance.el) {
      instance.el.parentNode?.replaceChild(el, instance.el);
    }
    return;
  }
}
/**
 * 虚拟节点转为真实dom节点
 */
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
    el.setAttribute(key, getValue(vnode.attrs[key]));
  }
  //   绑定元素事件
  for (let key in vnode.event) {
    // if (key === "show") {
    //   el.style.display = getValue(vnode.event[key]) ? "inherit" : "none";
    // } toDo...
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
```

此时的效果如图：

![页面挂载](.\static\页面挂载.png)

这样第一次处理并调用 `render` 函数时会进行依赖收集，之后每次数据变化都会调用 `instance.update` 来试试刷新页面

#### diff

比较时只判断元素类型和 tagName (input 元素还判断 type 类型) (不实现 key 值)

```ts
export function patch(oldVNode: VNode | undefined,newVNode: VNode,instance:ComponentInstance) {
  // 初始化时的挂载
  if (!oldVNode) {
	...
  }

  /**
   * diff
   * 比较时只判断元素类型和 tagName (input 元素还判断 type 类型) (不实现 key 值)
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
      updateAttrs(oldVNode, newVNode);
      newVNode.children.forEach((child: VNode, index: number) =>
        patch(oldVNode.children[index], child, instance)
      );
    }

    newVNode.el = oldVNode.el;
  }
}
/**
 * 更新节点属性
 */
function updateAttrs(oldVNode: VNode, newVNode: VNode) {
  if (!(oldVNode.el instanceof Element)) return;

  let { attrs = {} } = newVNode;
  let { attrs: oldAttrs = {} } = oldVNode;

  // 设置新的属性或修改的属性
  for (let key in attrs) {
    if (!(key in oldAttrs) || oldAttrs[key] !== attrs[key]) {
      oldVNode.el?.setAttribute(key, getValue(attrs[key]));
    }
  }

  // 删除没有的属性
  for (let key in oldAttrs) {
    if (!(key in attrs)) {
      oldVNode.el?.removeAttribute(key);
    }
  }
}
```

diff 过程中对每一个节点进行比较，不同的话就直接替换整个 dom，相同就复用之前的节点元素。文本节点的话就只需要替换 `nodeValue` 就好了

对于元素节点还需要进行新旧属性的判断 `updateAttrs` ，留下新属性删除旧属性

最后递归处理 `children`。

如此一来页面就是响应式的了。

#### 双向绑定

在 `mount` 方法中，使用 `effect` 方法包裹 render 方法和 patch 过程，因此页面就变成响应式的了，也就实现了双向绑定。

![双向绑定](.\static\双向绑定.gif)

