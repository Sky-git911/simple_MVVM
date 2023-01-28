/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["simpleMVVM"] = factory();
	else
		root["simpleMVVM"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\r\n    if (k2 === undefined) k2 = k;\r\n    var desc = Object.getOwnPropertyDescriptor(m, k);\r\n    if (!desc || (\"get\" in desc ? !m.__esModule : desc.writable || desc.configurable)) {\r\n      desc = { enumerable: true, get: function() { return m[k]; } };\r\n    }\r\n    Object.defineProperty(o, k2, desc);\r\n}) : (function(o, m, k, k2) {\r\n    if (k2 === undefined) k2 = k;\r\n    o[k2] = m[k];\r\n}));\r\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\r\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\r\n}) : function(o, v) {\r\n    o[\"default\"] = v;\r\n});\r\nvar __importStar = (this && this.__importStar) || function (mod) {\r\n    if (mod && mod.__esModule) return mod;\r\n    var result = {};\r\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\r\n    __setModuleDefault(result, mod);\r\n    return result;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst simpleMVVM = __importStar(__webpack_require__(/*! ./src/index */ \"./src/index.ts\"));\r\nexports[\"default\"] = simpleMVVM;\r\n\n\n//# sourceURL=webpack://simpleMVVM/./index.ts?");

/***/ }),

/***/ "./src/compiler.ts":
/*!*************************!*\
  !*** ./src/compiler.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.compile = void 0;\r\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\r\nconst removeSpaceAndLineBreak = /\\s*|[\\r\\n]/g; // 去掉多余的空格和换行符\r\nconst escape = /({{([\\s\\S]+?)}})+/g;\r\n/**\r\n * 模板编译 将其处理成 render 函数\r\n * 通过 new Function 来生成函数\r\n * 借助 with() {} 语法，保证表达式能从环境中取到对应的值\r\n */\r\nconst compile = function (element) {\r\n    let code = `with(this) {return ${processElem(element)}}`;\r\n    return new Function(code);\r\n};\r\nexports.compile = compile;\r\n/**\r\n *  处理元素\r\n */\r\nconst processElem = function (element) {\r\n    let code = \"\";\r\n    // 处理元素节点， _c 代替 createElement\r\n    if (element instanceof Element)\r\n        code = `_c(\"${element.localName}\",`;\r\n    // 处理文本节点\r\n    else if (element instanceof Text) {\r\n        let text = element.wholeText.replace(removeSpaceAndLineBreak, \"\"); // 去掉空格回车\r\n        let newText = text.replace(escape, function (match) {\r\n            // 处理 ref 的情况 用 _v 方法包起来\r\n            // 最终有效结果  xxx{{yyy}}xxx => `xxx${_v(yyy)}xxx`\r\n            return `\\${_v(${match.slice(2, -2)})}`;\r\n        });\r\n        return `\\`${newText}\\``;\r\n    }\r\n    else\r\n        return;\r\n    code += processAttrs(element);\r\n    // 子元素递归调用\r\n    let children = (0, utils_1.toArray)(element.childNodes).map(processElem);\r\n    code += `,[${children.join(\",\")}]`;\r\n    return (code += \")\");\r\n};\r\n/**\r\n * 处理元素属性\r\n */\r\nconst processAttrs = function ({ attributes }) {\r\n    let code = [];\r\n    // options 结构：{attr: {key: value or expression}, event: {key: expression}}\r\n    let options = {\r\n        attrs: [],\r\n        event: [],\r\n    };\r\n    let attrs = Array.prototype.slice.call(attributes);\r\n    attrs.forEach(({ name, value }) => {\r\n        // 非原生属性  key 要把前缀删掉(:  @)\r\n        if (name[0] === \":\") {\r\n            // : 开头的动态属性\r\n            options.attrs.push(`${name.slice(1)}:${value}`);\r\n        }\r\n        else if (name[0] === \"@\") {\r\n            // @ 开头的事件\r\n            options.event.push(`${name.slice(1)}:${value}`);\r\n        }\r\n        else {\r\n            // 原生的元素属性 如 class=\"box\"\r\n            options.attrs.push(`${name}:\"${value}\"`);\r\n        }\r\n    });\r\n    Object.keys(options).forEach((key) => {\r\n        if (options[key].length > 0)\r\n            code.push(`${key}:{${options[key].join(\",\")}}`);\r\n    });\r\n    return `{${code.join(\",\")}}`;\r\n};\r\n\n\n//# sourceURL=webpack://simpleMVVM/./src/compiler.ts?");

/***/ }),

/***/ "./src/createElem.ts":
/*!***************************!*\
  !*** ./src/createElem.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.createText = exports.createElement = void 0;\r\nconst vnode_1 = __webpack_require__(/*! ./vnode */ \"./src/vnode.ts\");\r\n/**\r\n * 创建元素\r\n */\r\nconst createElement = function (tagName, { attrs, event }, children = []) {\r\n    let vnodeList = children.map((item) => {\r\n        if (typeof item === \"string\") {\r\n            return (0, exports.createText)(item);\r\n        }\r\n        else {\r\n            return item;\r\n        }\r\n    });\r\n    return new vnode_1.VNode({\r\n        tagName,\r\n        attrs,\r\n        event,\r\n        children: vnodeList,\r\n        type: vnode_1.NodeType.Element,\r\n    });\r\n};\r\nexports.createElement = createElement;\r\n/**\r\n * 创建文本\r\n */\r\nconst createText = function (value) {\r\n    return new vnode_1.VNode({\r\n        nodeValue: value,\r\n        type: vnode_1.NodeType.Text,\r\n    });\r\n};\r\nexports.createText = createText;\r\n\n\n//# sourceURL=webpack://simpleMVVM/./src/createElem.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.createText = exports.createElement = exports.compile = exports.ref = exports.effect = exports.reactive = void 0;\r\nvar reactive_1 = __webpack_require__(/*! ./reactive */ \"./src/reactive.ts\");\r\nObject.defineProperty(exports, \"reactive\", ({ enumerable: true, get: function () { return reactive_1.reactive; } }));\r\nObject.defineProperty(exports, \"effect\", ({ enumerable: true, get: function () { return reactive_1.effect; } }));\r\nvar ref_1 = __webpack_require__(/*! ./ref */ \"./src/ref.ts\");\r\nObject.defineProperty(exports, \"ref\", ({ enumerable: true, get: function () { return ref_1.ref; } }));\r\nvar compiler_1 = __webpack_require__(/*! ./compiler */ \"./src/compiler.ts\");\r\nObject.defineProperty(exports, \"compile\", ({ enumerable: true, get: function () { return compiler_1.compile; } }));\r\nvar createElem_1 = __webpack_require__(/*! ./createElem */ \"./src/createElem.ts\");\r\nObject.defineProperty(exports, \"createElement\", ({ enumerable: true, get: function () { return createElem_1.createElement; } }));\r\nObject.defineProperty(exports, \"createText\", ({ enumerable: true, get: function () { return createElem_1.createText; } }));\r\n\n\n//# sourceURL=webpack://simpleMVVM/./src/index.ts?");

/***/ }),

/***/ "./src/reactive.ts":
/*!*************************!*\
  !*** ./src/reactive.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.effect = exports.trigger = exports.track = exports.reactive = void 0;\r\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\r\n// 目标对象到映射对象(暂存已经代理过的对象)\r\nconst proxyedReactiveMap = new WeakMap();\r\n/**\r\n * 实现响应式对象\r\n */\r\nconst reactive = function (target) {\r\n    if (!(0, utils_1.isObject)(target))\r\n        return target;\r\n    if (proxyedReactiveMap.has(target))\r\n        return proxyedReactiveMap.get(target);\r\n    let handler = {\r\n        get(target, key, receiver) {\r\n            let result = Reflect.get(target, key, receiver);\r\n            if (Array.isArray(result)) {\r\n                (0, exports.track)(target, key);\r\n                return reactiveArray(result, target, key);\r\n            }\r\n            (0, exports.track)(target, key);\r\n            return (0, utils_1.isObject)(result) ? (0, exports.reactive)(result) : result;\r\n        },\r\n        set(target, key, value, receiver) {\r\n            let result = Reflect.set(target, key, value, receiver);\r\n            (0, exports.trigger)(target, key);\r\n            return result;\r\n        },\r\n    };\r\n    let observed = new Proxy(target, handler);\r\n    proxyedReactiveMap.set(target, observed);\r\n    return observed;\r\n};\r\nexports.reactive = reactive;\r\n/**\r\n * 设置响应式数组\r\n */\r\nfunction reactiveArray(targetArr, targetObj, Arrkey) {\r\n    let handler = {\r\n        get(target, key, receiver) {\r\n            const res = Reflect.get(target, key, receiver);\r\n            if ((0, utils_1.isObject)(res)) {\r\n                return (0, exports.reactive)(res);\r\n            }\r\n            return res;\r\n        },\r\n        set(target, key, value, receiver) {\r\n            const res = Reflect.set(target, key, value, receiver);\r\n            (0, exports.trigger)(targetObj, Arrkey);\r\n            return res;\r\n        },\r\n    };\r\n    console.log(\"设置数组\", targetArr);\r\n    return new Proxy(targetArr, handler);\r\n}\r\nconst targetMap = new WeakMap(); //储存所有的依赖关系 , key 是目标对象 target , 值是一个 Map\r\n/**\r\n * 追踪绑定依赖\r\n */\r\nconst track = function (target, key) {\r\n    if (!activeEffect)\r\n        return;\r\n    let keyMap = targetMap.get(target);\r\n    if (!keyMap)\r\n        targetMap.set(target, (keyMap = new Map()));\r\n    let depsOfKey = keyMap.get(key);\r\n    if (!depsOfKey)\r\n        keyMap.set(key, (depsOfKey = new Set()));\r\n    if (!depsOfKey.has(activeEffect))\r\n        depsOfKey.add(activeEffect);\r\n};\r\nexports.track = track;\r\n/**\r\n * 响应触发依赖\r\n */\r\nconst trigger = function (target, key) {\r\n    let keyMap = targetMap.get(target);\r\n    if (!keyMap)\r\n        return;\r\n    let deps = keyMap.get(key);\r\n    if (!deps)\r\n        return;\r\n    deps.forEach((effect) => {\r\n        effect();\r\n    });\r\n};\r\nexports.trigger = trigger;\r\nlet activeEffect; //只要当前 activeEffect 存在，就把它存进 targetMap 的对应位置中，这样就完成了一次依赖收集。\r\nconst effect = function (fn) {\r\n    const effect = function (...args) {\r\n        try {\r\n            activeEffect = effect;\r\n            return fn(...args);\r\n        }\r\n        finally {\r\n            activeEffect = undefined;\r\n        }\r\n    };\r\n    effect._isEffect = true;\r\n    effect.deps = new Array();\r\n    effect();\r\n    return effect;\r\n};\r\nexports.effect = effect;\r\n\n\n//# sourceURL=webpack://simpleMVVM/./src/reactive.ts?");

/***/ }),

/***/ "./src/ref.ts":
/*!********************!*\
  !*** ./src/ref.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.ref = void 0;\r\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\r\nconst reactive_1 = __webpack_require__(/*! ./reactive */ \"./src/reactive.ts\");\r\nconst ref = function (value) {\r\n    if ((0, utils_1.isObject)(value)) {\r\n        if ((0, utils_1.isRef)(value))\r\n            return value;\r\n        else\r\n            return;\r\n    }\r\n    let result = Object.create(Object.prototype, {\r\n        isRef: { value: true },\r\n        value: {\r\n            get() {\r\n                (0, reactive_1.track)(result, \"value\");\r\n                return value;\r\n            },\r\n            set(newValue) {\r\n                value = newValue;\r\n                (0, reactive_1.trigger)(result, \"value\");\r\n            },\r\n        },\r\n    });\r\n    return result;\r\n};\r\nexports.ref = ref;\r\n\n\n//# sourceURL=webpack://simpleMVVM/./src/ref.ts?");

/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.toArray = exports.isRef = exports.isObject = void 0;\r\nfunction isObject(target) {\r\n    return typeof target === \"object\" && target != null;\r\n}\r\nexports.isObject = isObject;\r\nconst isRef = function (target) {\r\n    return isObject(target) && \"isRef\" in target && target.isRef;\r\n};\r\nexports.isRef = isRef;\r\nfunction toArray(arr) {\r\n    return Array.prototype.slice.call(arr);\r\n}\r\nexports.toArray = toArray;\r\n\n\n//# sourceURL=webpack://simpleMVVM/./src/utils.ts?");

/***/ }),

/***/ "./src/vnode.ts":
/*!**********************!*\
  !*** ./src/vnode.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.VNode = exports.NodeType = void 0;\r\nvar NodeType;\r\n(function (NodeType) {\r\n    NodeType[NodeType[\"Element\"] = 1] = \"Element\";\r\n    NodeType[NodeType[\"Attr\"] = 2] = \"Attr\";\r\n    NodeType[NodeType[\"Text\"] = 3] = \"Text\";\r\n})(NodeType = exports.NodeType || (exports.NodeType = {}));\r\nclass VNode {\r\n    constructor({ tagName, attrs, event, children, nodeValue, type, }) {\r\n        this.attrs = {};\r\n        this.event = {};\r\n        this.children = [];\r\n        this.tagName = tagName;\r\n        attrs && (this.attrs = attrs);\r\n        event && (this.event = event);\r\n        children && (this.children = children);\r\n        this.nodeValue = nodeValue;\r\n        this.type = type;\r\n    }\r\n}\r\nexports.VNode = VNode;\r\n\n\n//# sourceURL=webpack://simpleMVVM/./src/vnode.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./index.ts");
/******/ 	__webpack_exports__ = __webpack_exports__["default"];
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});