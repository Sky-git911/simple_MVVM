import { effect, reactive, ref } from "../src";
// 执行命令： ts-node '.\test\responsiveTest.ts'

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
data.title = "Hello"; //Hello world
words.value = "World"; //Hello World
