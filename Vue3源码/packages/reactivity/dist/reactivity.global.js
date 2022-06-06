var VueReactivity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/reactivity/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    reactive: () => reactive
  });

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value !== null;
  };

  // packages/reactivity/src/reactive.ts
  function reactive(target) {
    if (!isObject(target)) {
      return target;
    }
    const proxy = new Proxy(target, {
      get(target2, key, receiver) {
        console.log("\u8FD9\u4E2A\u5C5E\u6027\u88AB\u53D6\u5230\u4E86");
        return Reflect.get(target2, key, receiver);
      },
      set(target2, key, value, receiver) {
        console.log("\u8FD9\u4E2A\u5C5E\u6027\u6539\u53D8\u4E86");
        target2[key] = value;
        return Reflect.set(target2, key, value, receiver);
      }
    });
    return proxy;
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.global.js.map
