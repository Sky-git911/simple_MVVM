import { effect, reactive, ref } from "../src";

/**
 * 测试响应式数据
 */

let data = reactive({
  title: "hello",
});
let words = ref("world");
effect(function () {
  console.log(`${data.title} ${words.value}`);
});
// data.title = "Hello";
// words.value = "World";
