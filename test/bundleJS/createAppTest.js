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

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.compile = void 0;\r\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\r\nconst removeSpaceAndLineBreak = /\\s*|[\\r\\n]/g; // ?????????????????????????????????\r\nconst escape = /({{([\\s\\S]+?)}})+/g;\r\n/**\r\n * ???????????? ??????????????? render ??????\r\n * ?????? new Function ???????????????\r\n * ?????? with() {} ?????????????????????????????????????????????????????????\r\n */\r\nconst compile = function (element) {\r\n    let code = `with(this) {return ${processElem(element)}}`;\r\n    return new Function(code);\r\n};\r\nexports.compile = compile;\r\n/**\r\n *  ????????????\r\n */\r\nconst processElem = function (element) {\r\n    let code = \"\";\r\n    // ????????????????????? _c ?????? createElement\r\n    if (element instanceof Element)\r\n        code = `_c(\"${element.localName}\",`;\r\n    // ??????????????????\r\n    else if (element instanceof Text) {\r\n        let text = element.wholeText.replace(removeSpaceAndLineBreak, \"\"); // ??????????????????\r\n        let newText = text.replace(escape, function (match) {\r\n            // ?????? ref ????????? ??? _v ???????????????\r\n            // ??????????????????  xxx{{yyy}}xxx => `xxx${_v(yyy)}xxx`\r\n            return `\\${_v(${match.slice(2, -2)})}`;\r\n        });\r\n        return `\\`${newText}\\``;\r\n    }\r\n    else\r\n        return;\r\n    code += processAttrs(element);\r\n    // ?????????????????????\r\n    let children = (0, utils_1.toArray)(element.childNodes).map(processElem);\r\n    code += `,[${children.join(\",\")}]`;\r\n    return (code += \")\");\r\n};\r\n/**\r\n * ??????????????????\r\n */\r\nconst processAttrs = function ({ attributes }) {\r\n    let code = [];\r\n    // options ?????????{attr: {key: value or expression}, event: {key: expression}}\r\n    let options = {\r\n        attrs: [],\r\n        event: [],\r\n    };\r\n    let attrs = Array.prototype.slice.call(attributes);\r\n    attrs.forEach(({ name, value }) => {\r\n        // ???????????????  key ??????????????????(:  @)\r\n        if (name[0] === \":\") {\r\n            // : ?????????????????????\r\n            options.attrs.push(`${name.slice(1)}:${value}`);\r\n        }\r\n        else if (name[0] === \"@\") {\r\n            // @ ???????????????\r\n            options.event.push(`${name.slice(1)}:${value}`);\r\n        }\r\n        else {\r\n            // ????????????????????? ??? class=\"box\"\r\n            options.attrs.push(`${name}:\"${value}\"`);\r\n        }\r\n    });\r\n    Object.keys(options).forEach((key) => {\r\n        if (options[key].length > 0)\r\n            code.push(`${key}:{${options[key].join(\",\")}}`);\r\n    });\r\n    return `{${code.join(\",\")}}`;\r\n};\r\n\n\n//# sourceURL=webpack://simpleMVVM/./src/compiler.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.createApp = exports.createText = exports.createElement = exports.compile = exports.ref = exports.effect = exports.reactive = void 0;\r\nvar reactive_1 = __webpack_require__(/*! ./reactivity/reactive */ \"./src/reactivity/reactive.ts\");\r\nObject.defineProperty(exports, \"reactive\", ({ enumerable: true, get: function () { return reactive_1.reactive; } }));\r\nObject.defineProperty(exports, \"effect\", ({ enumerable: true, get: function () { return reactive_1.effect; } }));\r\nvar ref_1 = __webpack_require__(/*! ./reactivity/ref */ \"./src/reactivity/ref.ts\");\r\nObject.defineProperty(exports, \"ref\", ({ enumerable: true, get: function () { return ref_1.ref; } }));\r\nvar compiler_1 = __webpack_require__(/*! ./compiler */ \"./src/compiler.ts\");\r\nObject.defineProperty(exports, \"compile\", ({ enumerable: true, get: function () { return compiler_1.compile; } }));\r\nvar createElem_1 = __webpack_require__(/*! ./vnode/createElem */ \"./src/vnode/createElem.ts\");\r\nObject.defineProperty(exports, \"createElement\", ({ enumerable: true, get: function () { return createElem_1.createElement; } }));\r\nObject.defineProperty(exports, \"createText\", ({ enumerable: true, get: function () { return createElem_1.createText; } }));\r\nvar createAPP_1 = __webpack_require__(/*! ./mount/createAPP */ \"./src/mount/createAPP.ts\");\r\nObject.defineProperty(exports, \"createApp\", ({ enumerable: true, get: function () { return createAPP_1.createApp; } }));\r\n\n\n//# sourceURL=webpack://simpleMVVM/./src/index.ts?");

/***/ }),

/***/ "./src/mount/createAPP.ts":
/*!********************************!*\
  !*** ./src/mount/createAPP.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.createApp = void 0;\r\nconst compiler_1 = __webpack_require__(/*! ../compiler */ \"./src/compiler.ts\");\r\nconst createElem_1 = __webpack_require__(/*! ../vnode/createElem */ \"./src/vnode/createElem.ts\");\r\nconst patch_1 = __webpack_require__(/*! ./patch */ \"./src/mount/patch.ts\");\r\nconst utils_1 = __webpack_require__(/*! ../utils */ \"./src/utils.ts\");\r\nconst reactive_1 = __webpack_require__(/*! ../reactivity/reactive */ \"./src/reactivity/reactive.ts\");\r\n/**\r\n * ????????????\r\n * mount ?????????????????????\r\n * ???????????????compiler ?????????????????? render ?????????  ?????? setup ????????????\r\n */\r\nconst createApp = function (options) {\r\n    let instance = createInstance(options);\r\n    /**\r\n     * app ?????????\r\n     * $option ??????????????????\r\n     * component ???????????????\r\n     * mount ???????????????????????????\r\n     * ?????? instance ??? _c???_v ??? render ????????????\r\n     */\r\n    let app = {\r\n        $option: options,\r\n        component: instance,\r\n        mount(selector) {\r\n            let el = document.querySelector(selector);\r\n            if (!el)\r\n                return;\r\n            let instance = this.component;\r\n            instance.el = el;\r\n            //????????????????????? dom ????????????????????? dom ???????????? render ??????\r\n            instance.render = (0, compiler_1.compile)(el);\r\n            // ?????? setup ?????? -> ???????????????????????? instance ??????????????????????????? this.xxx ???????????????\r\n            processSetup(instance);\r\n            // ??? effect ???????????? render ????????? ????????? patch ??????\r\n            // ?????????????????????????????? render ??????????????????????????????\r\n            // ???????????????????????????????????? instance.update ?????????????????????\r\n            instance.update = (0, reactive_1.effect)(function () {\r\n                var _a;\r\n                let vnode = (_a = instance.render) === null || _a === void 0 ? void 0 : _a.call(instance.proxy);\r\n                let oldVNode = instance.vnode;\r\n                instance.vnode = vnode;\r\n                (0, patch_1.patch)(oldVNode, vnode, instance);\r\n            });\r\n        },\r\n    };\r\n    return app;\r\n};\r\nexports.createApp = createApp;\r\nconst createInstance = function (options) {\r\n    let instance = {\r\n        $option: options,\r\n        _c: createElem_1.createElement,\r\n        _v: utils_1.getValue,\r\n        proxy: {},\r\n    };\r\n    return instance;\r\n};\r\n/**\r\n ?????????????????? setup ??????\r\n */\r\nconst processSetup = function (instance) {\r\n    let { setup } = instance.$option;\r\n    if (setup) {\r\n        instance.setupRes = setup.call(instance, createElem_1.createElement);\r\n        let setupRes = instance.setupRes;\r\n        instance.proxy = new Proxy(instance, {\r\n            get: (target, key, receiver) => {\r\n                if (key in setupRes) {\r\n                    return setupRes[key];\r\n                }\r\n                else {\r\n                    return Reflect.get(target, key, receiver);\r\n                }\r\n            },\r\n            set(target, key, value, receiver) {\r\n                if (key in setupRes) {\r\n                    setupRes[key] = value;\r\n                    return true;\r\n                }\r\n                let result = Reflect.set(target, key, value, receiver);\r\n                return result;\r\n            },\r\n            //   has ????????? ?????? with ??????????????????\r\n            has(target, key) {\r\n                return key in setupRes || Reflect.has(target, key);\r\n            },\r\n        });\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack://simpleMVVM/./src/mount/createAPP.ts?");

/***/ }),

/***/ "./src/mount/patch.ts":
/*!****************************!*\
  !*** ./src/mount/patch.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.patch = void 0;\r\nconst utils_1 = __webpack_require__(/*! ../utils */ \"./src/utils.ts\");\r\nconst vnode_1 = __webpack_require__(/*! ../vnode/vnode */ \"./src/vnode/vnode.ts\");\r\nfunction patch(oldVNode, newVNode, instance) {\r\n    var _a;\r\n    // ?????????????????????\r\n    if (!oldVNode) {\r\n        let el = vnodeToElem(newVNode);\r\n        if (el && instance.el) {\r\n            (_a = instance.el.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(el, instance.el);\r\n        }\r\n        return;\r\n    }\r\n}\r\nexports.patch = patch;\r\nfunction vnodeToElem(vnode) {\r\n    if (vnode.type === vnode_1.NodeType.Text) {\r\n        let el = document.createTextNode((0, utils_1.getValue)(vnode.nodeValue) || \"\");\r\n        vnode.el = el;\r\n        return el;\r\n    }\r\n    //   ??????????????? ?????? ??????\r\n    if (!vnode.tagName)\r\n        return;\r\n    let el = document.createElement(vnode.tagName);\r\n    //   ??????????????????\r\n    for (let key in vnode.attrs) {\r\n        if ((0, utils_1.isRef)(vnode.attrs[key])) {\r\n            el.setAttribute(key, vnode.attrs[key].value);\r\n        }\r\n        else {\r\n            el.setAttribute(key, vnode.attrs[key]);\r\n        }\r\n    }\r\n    //   ??????????????????\r\n    for (let key in vnode.event) {\r\n        el.addEventListener(key, vnode.event[key]);\r\n    }\r\n    //   ???????????????????????????\r\n    if (vnode.children.length > 0) {\r\n        vnode.children.forEach((v) => {\r\n            let child = vnodeToElem(v);\r\n            child && el.appendChild(child);\r\n        });\r\n    }\r\n    vnode.el = el;\r\n    return el;\r\n}\r\n\n\n//# sourceURL=webpack://simpleMVVM/./src/mount/patch.ts?");

/***/ }),

/***/ "./src/reactivity/reactive.ts":
/*!************************************!*\
  !*** ./src/reactivity/reactive.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.effect = exports.trigger = exports.track = exports.reactive = void 0;\r\nconst utils_1 = __webpack_require__(/*! ../utils */ \"./src/utils.ts\");\r\n// ???????????????????????????(??????????????????????????????)\r\nconst proxyedReactiveMap = new WeakMap();\r\n/**\r\n * ?????????????????????\r\n */\r\nconst reactive = function (target) {\r\n    if (!(0, utils_1.isObject)(target))\r\n        return target;\r\n    if (proxyedReactiveMap.has(target))\r\n        return proxyedReactiveMap.get(target);\r\n    let handler = {\r\n        get(target, key, receiver) {\r\n            let result = Reflect.get(target, key, receiver);\r\n            if (Array.isArray(result)) {\r\n                (0, exports.track)(target, key);\r\n                return reactiveArray(result, target, key);\r\n            }\r\n            (0, exports.track)(target, key);\r\n            return (0, utils_1.isObject)(result) ? (0, exports.reactive)(result) : result;\r\n        },\r\n        set(target, key, value, receiver) {\r\n            let result = Reflect.set(target, key, value, receiver);\r\n            (0, exports.trigger)(target, key);\r\n            return result;\r\n        },\r\n        deleteProperty(target, key) {\r\n            const result = Reflect.deleteProperty(target, key);\r\n            return result;\r\n        },\r\n    };\r\n    let observed = new Proxy(target, handler);\r\n    proxyedReactiveMap.set(target, observed);\r\n    return observed;\r\n};\r\nexports.reactive = reactive;\r\n/**\r\n * ?????????????????????\r\n */\r\nfunction reactiveArray(targetArr, targetObj, Arrkey) {\r\n    let handler = {\r\n        get(target, key, receiver) {\r\n            const res = Reflect.get(target, key, receiver);\r\n            if ((0, utils_1.isObject)(res)) {\r\n                return (0, exports.reactive)(res);\r\n            }\r\n            return res;\r\n        },\r\n        set(target, key, value, receiver) {\r\n            const res = Reflect.set(target, key, value, receiver);\r\n            (0, exports.trigger)(targetObj, Arrkey);\r\n            return res;\r\n        },\r\n    };\r\n    console.log(\"????????????\", targetArr);\r\n    return new Proxy(targetArr, handler);\r\n}\r\nconst targetMap = new WeakMap(); //??????????????????????????? , key ??????????????? target , ???????????? Map\r\n/**\r\n * ??????????????????\r\n */\r\nconst track = function (target, key) {\r\n    if (!activeEffect)\r\n        return;\r\n    let keyMap = targetMap.get(target);\r\n    if (!keyMap)\r\n        targetMap.set(target, (keyMap = new Map()));\r\n    let depsOfKey = keyMap.get(key);\r\n    if (!depsOfKey)\r\n        keyMap.set(key, (depsOfKey = new Set()));\r\n    if (!depsOfKey.has(activeEffect))\r\n        depsOfKey.add(activeEffect);\r\n};\r\nexports.track = track;\r\n/**\r\n * ??????????????????\r\n */\r\nconst trigger = function (target, key) {\r\n    let keyMap = targetMap.get(target);\r\n    if (!keyMap)\r\n        return;\r\n    let deps = keyMap.get(key);\r\n    if (!deps)\r\n        return;\r\n    deps.forEach((effect) => {\r\n        effect();\r\n    });\r\n};\r\nexports.trigger = trigger;\r\nlet activeEffect; //???????????? activeEffect ???????????????????????? targetMap ????????????????????????????????????????????????????????????\r\nconst effect = function (fn) {\r\n    const effect = function (...args) {\r\n        try {\r\n            activeEffect = effect;\r\n            return fn(...args);\r\n        }\r\n        finally {\r\n            activeEffect = undefined;\r\n        }\r\n    };\r\n    effect._isEffect = true;\r\n    effect.deps = new Array();\r\n    effect();\r\n    return effect;\r\n};\r\nexports.effect = effect;\r\n\n\n//# sourceURL=webpack://simpleMVVM/./src/reactivity/reactive.ts?");

/***/ }),

/***/ "./src/reactivity/ref.ts":
/*!*******************************!*\
  !*** ./src/reactivity/ref.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.ref = void 0;\r\nconst utils_1 = __webpack_require__(/*! ../utils */ \"./src/utils.ts\");\r\nconst reactive_1 = __webpack_require__(/*! ./reactive */ \"./src/reactivity/reactive.ts\");\r\nconst ref = function (value) {\r\n    if ((0, utils_1.isObject)(value)) {\r\n        if ((0, utils_1.isRef)(value))\r\n            return value;\r\n        else\r\n            return;\r\n    }\r\n    let result = Object.create(Object.prototype, {\r\n        isRef: { value: true },\r\n        value: {\r\n            get() {\r\n                (0, reactive_1.track)(result, \"value\");\r\n                return value;\r\n            },\r\n            set(newValue) {\r\n                value = newValue;\r\n                (0, reactive_1.trigger)(result, \"value\");\r\n            },\r\n        },\r\n    });\r\n    return result;\r\n};\r\nexports.ref = ref;\r\n\n\n//# sourceURL=webpack://simpleMVVM/./src/reactivity/ref.ts?");

/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.getValue = exports.toArray = exports.isRef = exports.isObject = void 0;\r\nfunction isObject(target) {\r\n    return typeof target === \"object\" && target != null;\r\n}\r\nexports.isObject = isObject;\r\nconst isRef = function (target) {\r\n    return isObject(target) && \"isRef\" in target && target.isRef;\r\n};\r\nexports.isRef = isRef;\r\nfunction toArray(arr) {\r\n    return Array.prototype.slice.call(arr);\r\n}\r\nexports.toArray = toArray;\r\nfunction getValue(target) {\r\n    return (0, exports.isRef)(target) ? target.value : target;\r\n}\r\nexports.getValue = getValue;\r\n\n\n//# sourceURL=webpack://simpleMVVM/./src/utils.ts?");

/***/ }),

/***/ "./src/vnode/createElem.ts":
/*!*********************************!*\
  !*** ./src/vnode/createElem.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.createText = exports.createElement = void 0;\r\nconst vnode_1 = __webpack_require__(/*! ./vnode */ \"./src/vnode/vnode.ts\");\r\n/**\r\n * ????????????\r\n */\r\nconst createElement = function (tagName, { attrs, event }, children = []) {\r\n    let vnodeList = children.map((item) => {\r\n        if (typeof item === \"string\") {\r\n            return (0, exports.createText)(item);\r\n        }\r\n        else {\r\n            return item;\r\n        }\r\n    });\r\n    return new vnode_1.VNode({\r\n        tagName,\r\n        attrs,\r\n        event,\r\n        children: vnodeList,\r\n        type: vnode_1.NodeType.Element,\r\n    });\r\n};\r\nexports.createElement = createElement;\r\n/**\r\n * ????????????\r\n */\r\nconst createText = function (value) {\r\n    return new vnode_1.VNode({\r\n        nodeValue: value,\r\n        type: vnode_1.NodeType.Text,\r\n    });\r\n};\r\nexports.createText = createText;\r\n\n\n//# sourceURL=webpack://simpleMVVM/./src/vnode/createElem.ts?");

/***/ }),

/***/ "./src/vnode/vnode.ts":
/*!****************************!*\
  !*** ./src/vnode/vnode.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.VNode = exports.NodeType = void 0;\r\nvar NodeType;\r\n(function (NodeType) {\r\n    NodeType[NodeType[\"Element\"] = 1] = \"Element\";\r\n    NodeType[NodeType[\"Attr\"] = 2] = \"Attr\";\r\n    NodeType[NodeType[\"Text\"] = 3] = \"Text\";\r\n})(NodeType = exports.NodeType || (exports.NodeType = {}));\r\nclass VNode {\r\n    constructor({ tagName, attrs, event, children, nodeValue, type, }) {\r\n        this.attrs = {};\r\n        this.event = {};\r\n        this.children = [];\r\n        this.tagName = tagName;\r\n        attrs && (this.attrs = attrs);\r\n        event && (this.event = event);\r\n        children && (this.children = children);\r\n        this.nodeValue = nodeValue;\r\n        this.type = type;\r\n    }\r\n}\r\nexports.VNode = VNode;\r\n\n\n//# sourceURL=webpack://simpleMVVM/./src/vnode/vnode.ts?");

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