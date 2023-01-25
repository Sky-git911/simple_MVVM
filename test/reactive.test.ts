import { reactive } from "../src/reactive";
import { ref } from "../src/ref";

describe("测试数据劫持代理", () => {
  it("对象", () => {
    let a = {
      content: {
        val: 1,
      },
    };
    let b = reactive(a);
    let c = reactive(a);
    expect(b === c).toBe(true);
  });

  it("数组", () => {
    let arr = reactive([10, 20, 30]);
    arr.push(40);
    arr.push({ a: 50 });
    expect(arr).toEqual([10, 20, 30, 40, { a: 50 }]);
  });

  it("基本值类型", () => {
    let a = ref(10);
    let b = ref(10);
    expect(a.value === b.value).toBe(true);
  });

  it("数据响应式", () => {
    let data = reactive({
      name: "hello",
    });
    let name = ref("world");

    data.name = "Hello";
    name.value = "World";

    expect(data.name).toEqual("Hello");
    expect(name.value).toEqual("World");
  });
});
