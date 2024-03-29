var VueRuntimeDOM = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
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

  // packages/runtime-dom/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    Fragment: () => Fragment,
    Text: () => Text,
    computed: () => computed,
    createRenderer: () => createRenderer,
    createVNode: () => createVNode,
    effect: () => effect,
    h: () => h,
    reactive: () => reactive,
    ref: () => ref,
    render: () => render,
    toRef: () => toRef,
    toRefs: () => toRefs,
    watch: () => watch
  });

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value !== null;
  };
  var isFunction = (value) => {
    return typeof value === "function";
  };
  var isString = (value) => {
    return typeof value === "string";
  };
  var isNumber = (value) => {
    return typeof value === "number";
  };
  var isArray = Array.isArray;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var hasOwn = (obj, key) => hasOwnProperty.call(obj, key);

  // packages/reactivity/src/effect.ts
  var activeEffect = void 0;
  function cleanEffect(effect2) {
    let deps = effect2.deps;
    for (let i = 0; i < deps.length; ++i) {
      deps[i].delete(effect2);
    }
    effect2.deps.length = 0;
  }
  var ReactiveEffect = class {
    constructor(fn, scheduler) {
      this.fn = fn;
      this.scheduler = scheduler;
      this.active = true;
      this.parent = null;
      this.deps = [];
    }
    run() {
      if (!this.active) {
        return this.fn();
      } else {
        try {
          this.parent = activeEffect;
          activeEffect = this;
          cleanEffect(this);
          return this.fn();
        } finally {
          activeEffect = this.parent;
          this.parent = null;
        }
      }
    }
    stop() {
      if (this.active) {
        this.active = false;
        cleanEffect(this);
      }
    }
  };
  var targetMap = /* @__PURE__ */ new WeakMap();
  function track(target, key) {
    if (activeEffect) {
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let deps = depsMap.get(key);
      if (!deps) {
        depsMap.set(key, deps = /* @__PURE__ */ new Set());
      }
      trackEffects(deps);
    }
  }
  function trackEffects(deps) {
    let shouldTrack = !deps.has(activeEffect);
    if (shouldTrack) {
      deps.add(activeEffect);
      activeEffect.deps.push(deps);
    }
  }
  function trigger(target, key, value) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      return;
    }
    let effects = depsMap.get(key);
    triggerEffects(effects);
  }
  function triggerEffects(effects) {
    if (effects) {
      effects = new Set(effects);
      effects.forEach((effect2) => {
        if (effect2 !== activeEffect) {
          if (effect2.scheduler) {
            effect2.scheduler();
          } else {
            effect2.run();
          }
        }
      });
    }
  }
  function effect(fn, options = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    _effect.run();
    let runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
  }

  // packages/reactivity/src/baseHandler.ts
  function isReactive(value) {
    return value && value["__v_isReactive" /* IS_REACTIVE */];
  }
  var baseHandler = {
    get(target, key, receiver) {
      if (key === "__v_isReactive" /* IS_REACTIVE */) {
        return true;
      }
      track(target, key);
      let res = Reflect.get(target, key, receiver);
      if (isObject(res)) {
        return reactive(res);
      }
      return res;
    },
    set(target, key, value, receiver) {
      let oldValue = target[key];
      if (oldValue !== value) {
        let result = Reflect.set(target, key, value, receiver);
        trigger(target, key, value);
        return result;
      }
    }
  };

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function reactive(target) {
    if (!isObject(target)) {
      return target;
    }
    if (target["__v_isReactive" /* IS_REACTIVE */]) {
      return target;
    }
    const existing = reactiveMap.get(target);
    if (existing) {
      return existing;
    }
    const proxy = new Proxy(target, baseHandler);
    reactiveMap.set(target, proxy);
    return proxy;
  }

  // packages/reactivity/src/computed.ts
  function computed(getterOrOptions) {
    let getter = null;
    let setter = null;
    let fn = () => {
      throw new Error("this function is onlyRead");
    };
    let isGetter = isFunction(getterOrOptions);
    if (isGetter) {
      getter = getterOrOptions;
      setter = fn;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set || fn;
    }
    return new computedRefImpl(getter, setter);
  }
  var computedRefImpl = class {
    constructor(getter, setter) {
      this.setter = setter;
      this._value = null;
      this._dirty = true;
      this.effect = null;
      this.deps = null;
      this.effect = new ReactiveEffect(getter, () => {
        if (!this._dirty) {
          this._dirty = true;
          triggerEffects(this.deps);
        }
      });
    }
    get value() {
      debugger;
      if (activeEffect) {
        trackEffects(this.deps || (this.deps = /* @__PURE__ */ new Set()));
      }
      if (this._dirty) {
        this._dirty = false;
        this._value = this.effect.run();
      }
      return this._value;
    }
    set value(newValue) {
      this.setter(newValue);
    }
  };

  // packages/reactivity/src/watch.ts
  function traversal(value, set = /* @__PURE__ */ new Set()) {
    if (!isObject(value)) {
      return value;
    }
    if (set.has(value)) {
      return value;
    }
    set.add(value);
    for (let key in value) {
      traversal(value[key], set);
    }
    return value;
  }
  function watch(source, cb) {
    let get = null;
    let cleanUp = null;
    let oldValue = null;
    if (isReactive(source)) {
      get = () => traversal(source);
    } else if (isFunction(source)) {
      get = source;
    }
    const onCleanUp = (fn) => {
      this.cleanUp = fn;
    };
    let job = () => {
      cleanUp && cleanUp();
      let newValue = effect2.run;
      cb(oldValue, newValue, onCleanUp);
      oldValue = newValue;
    };
    let effect2 = new ReactiveEffect(get, job);
    oldValue = effect2.run();
  }

  // packages/reactivity/src/ref.ts
  function ref(value) {
    return new RefImpl(value);
  }
  function proxyRefs(object) {
    return new Proxy(object, {
      get(target, key, receiver) {
        let r = Reflect.get(target, key, receiver);
        return r.__v_isRef ? r.value : r;
      },
      set(target, key, value, receiver) {
        if (target[key].__v_isRef) {
          target[key].value = value;
          return true;
        }
        return Reflect.set(target, key, value, receiver);
      }
    });
  }
  function toRef(object, key) {
    return new ObjectRefImpl(object, key);
  }
  function toRefs(object) {
    let result = {};
    for (let key in object) {
      result[key] = toRef(object, key);
    }
    return result;
  }
  var ObjectRefImpl = class {
    constructor(object, key) {
      this.object = object;
      this.key = key;
      this.__v_isRef = true;
      this._value = null;
    }
    get value() {
      return this.object[this.key];
    }
    set value(newValue) {
      this.object[this.key] = newValue;
    }
  };
  var RefImpl = class {
    constructor(rawValue) {
      this.rawValue = rawValue;
      this._value = null;
      this.__v_isRef = true;
      this.dep = null;
      this._value = toReactive(rawValue);
    }
    get value() {
      if (activeEffect) {
        trackEffects(this.dep || (this.dep = /* @__PURE__ */ new Set()));
      }
      return this._value;
    }
    set value(newValue) {
      if (newValue !== this.rawValue) {
        this._value = toReactive(newValue);
        this.rawValue = newValue;
        triggerEffects(this.dep);
      }
    }
  };
  function toReactive(value) {
    return isObject(value) ? reactive(value) : value;
  }

  // packages/runtime-core/src/components.ts
  function createComponentInstance(vnode) {
    let instance = {
      data: null,
      vnode,
      subTree: null,
      isMounted: false,
      update: null,
      render: null,
      propsOption: vnode.type.props || {},
      props: {},
      attrs: {},
      proxy: null
    };
    return instance;
  }
  function initProps(instance, rawProps) {
    const props = {};
    const attrs = {};
    const options = instance.propsOption;
    if (rawProps) {
      for (let key in rawProps) {
        let value = rawProps[key];
        if (key in options) {
          props[key] = value;
        } else {
          attrs[key] = value;
        }
      }
    }
    instance.props = reactive(props);
    instance.attrs = attrs;
  }
  var publicProperties = {
    $attrs: (instance) => instance.attrs
  };
  var instanceProxy = {
    get(target, key) {
      const { data, props, setupState } = target;
      if (data && hasOwn(data, key)) {
        return data[key];
      } else if (setupState && hasOwn(setupState, key)) {
        return setupState[key];
      } else if (props && hasOwn(props, key)) {
        return props[key];
      }
      let getter = publicProperties[key];
      if (getter) {
        return getter(target);
      }
    },
    set(target, key, value, receiver) {
      const { data, props, setupState } = target;
      if (data && hasOwn(data, key)) {
        data[key] = value;
      } else if (setupState && hasOwn(setupState, key)) {
        setupState[key] = value;
      } else if (props && hasOwn(props, key)) {
        console.warn("props not update");
        return false;
      }
      return true;
    }
  };
  function setupComponent(instance) {
    let { type, props, children } = instance.vnode;
    let { data, render: render2, setup } = type;
    initProps(instance, props);
    instance.proxy = new Proxy(instance, instanceProxy);
    if (data) {
      if (!isFunction(data)) {
        return console.warn("The data option must be a function.");
      }
      instance.data = reactive(data.call({}));
    }
    if (setup) {
      const context = {};
      const setupResult = setup(instance.props, context);
      if (isFunction(setupResult)) {
        instance.render = setupResult;
      } else if (isObject(setupResult)) {
        instance.setupState = proxyRefs(setupResult);
      }
    }
    if (!instance.render) {
      if (render2) {
        instance.render = render2;
      } else {
      }
    }
  }

  // packages/runtime-core/src/createVNode.ts
  var Text = Symbol("Text");
  var Fragment = Symbol("Fragment");
  function isVnode(val) {
    return !!val.__v_isVNode;
  }
  function isSameVNode(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }
  function createVNode(type, props = null, children = null) {
    let shapeFlags = isString(type) ? 1 /* ELEMENT */ : isObject(type) ? 4 /* STATEFUL_COMPONENT */ : 0;
    const vnode = {
      __v_isVNode: true,
      type,
      props,
      children,
      key: props && props.key,
      el: null,
      shapeFlags
    };
    if (children) {
      let temp = 0;
      if (isArray(children)) {
        temp = 16 /* ARRAY_CHILDREN */;
      } else {
        children = String(children);
        temp = 8 /* TEXT_CHILDREN */;
      }
      vnode.shapeFlags = vnode.shapeFlags | temp;
    }
    return vnode;
  }

  // packages/runtime-core/src/schedules.ts
  var queue = /* @__PURE__ */ new Set();
  var isFlushing = false;
  var resolvePromise = Promise.resolve();
  function queueJob(job) {
    queue.add(job);
    if (!isFlushing) {
      isFlushing = true;
      resolvePromise.then(() => {
        try {
          queue.forEach((job2) => job2());
        } finally {
          isFlushing = false;
          queue.clear();
        }
      });
    }
  }

  // packages/runtime-core/src/sequence.ts
  function getSequence(arr) {
    let len = arr.length;
    let result = [0];
    let p = new Array(len).fill(0);
    let lastIndex, start, end, middle;
    for (let i2 = 0; i2 < len; i2++) {
      let arrI = arr[i2];
      if (arrI !== 0) {
        lastIndex = result[result.length - 1];
        if (arr[lastIndex] < arrI) {
          result.push(i2);
          p[i2] = lastIndex;
        } else {
          start = 0;
          end = result.length - 1;
          while (start < end) {
            middle = Math.floor((start + end) / 2);
            if (arr[result[middle]] < arrI) {
              start = middle + 1;
            } else {
              end = middle;
            }
          }
          if (arr[result[end]] > arrI) {
            p[i2] = result[end - 1];
            result[end] = i2;
          }
        }
      }
    }
    let i = result.length;
    let last = result[i - 1];
    while (i-- > 0) {
      result[i] = last;
      last = p[last];
    }
    return result;
  }

  // packages/runtime-core/src/renderer.ts
  function createRenderer(options) {
    let {
      createElement: hostCreateElement,
      createTextNode: hostCreateTextNode,
      insert: hostInsert,
      remove: hostRemove,
      querySelector: hostQuerySelector,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      setText: hostSetText,
      setElementText: hostSetElementText,
      patchProp: hostPatchProp
    } = options;
    function patchProps(oldProps, newProps, el) {
      if (oldProps == null) {
        oldProps = {};
      }
      if (newProps == null) {
        newProps = {};
      }
      for (let key in newProps) {
        hostPatchProp(el, key, oldProps[key], newProps[key]);
      }
      for (let key in oldProps) {
        if (newProps[key] == null) {
          hostPatchProp(el, key, oldProps[key], null);
        }
      }
    }
    function umount(vnode) {
      hostRemove(vnode.el);
    }
    function patch(n1, n2, container, anchor = null) {
      if (n1 && !isSameVNode(n1, n2)) {
        umount(n1);
        n1 = null;
      }
      const { type, shapeFlags } = n2;
      switch (type) {
        case Text:
          processText(n1, n2, container);
          break;
        case Fragment:
          processFragment(n1, n2, container);
        default:
          if (shapeFlags & 1 /* ELEMENT */) {
            processElement(n1, n2, container, anchor);
          } else if (shapeFlags & 4 /* STATEFUL_COMPONENT */) {
            processComponent(n1, n2, container, anchor);
          }
      }
    }
    function processComponent(n1, n2, container, anchor) {
      if (n1 == null) {
        mountComponent(n2, container, anchor);
      } else {
        updateComponent(n1, n2);
      }
    }
    function mountComponent(vnode, container, anchor) {
      const instance = vnode.component = createComponentInstance(vnode);
      setupComponent(instance);
      setupRenderEffect(instance, container, anchor);
    }
    function setupRenderEffect(instance, container, anchor) {
      const componentUpdate = () => {
        const { render: render3, data } = instance;
        if (!instance.isMounted) {
          const subTree = render3.call(instance.proxy);
          patch(null, subTree, container, anchor);
          instance.subTree = subTree;
          instance.isMounted = true;
        } else {
          let next = instance.next;
          if (next) {
            updateComponentPreRender(instance, next);
          }
          const subTree = render3.call(instance.proxy);
          patch(instance.subTree, subTree, container, anchor);
          instance.subTree = subTree;
        }
      };
      const effect2 = new ReactiveEffect(componentUpdate, () => {
        queueJob(instance.update);
      });
      let update = instance.update = effect2.run.bind(effect2);
      update();
    }
    function updateComponentPreRender(instance, next) {
      instance.next = null;
      instance.vnode = next;
      updateProps(instance, instance.props, next.props);
    }
    function updateProps(instance, preProps, nextProps) {
      for (let key in nextProps) {
        instance.props[key] = nextProps[key];
      }
      for (let key in instance.props) {
        if (!(key in nextProps)) {
          delete instance.props[key];
        }
      }
    }
    function hasChange(preProps, nextPros) {
      for (let key in nextPros) {
        if (nextPros[key] != preProps[key]) {
          return true;
        }
      }
      return false;
    }
    function shouldComponentUpdate(n1, n2) {
      const prevProps = n1.props;
      const nextProps = n2.props;
      return hasChange(prevProps, nextProps);
    }
    function updateComponent(n1, n2) {
      const instance = n2.component = n1.component;
      if (shouldComponentUpdate(n1, n2)) {
        instance.next = n2;
        instance.update();
      } else {
        instance.vnode = n2;
      }
    }
    function render2(vnode, container) {
      if (vnode == null) {
        if (container._vnode) {
          umount(container._vnode);
        }
      } else {
        patch(container._vnode || null, vnode, container);
      }
      container._vnode = vnode;
    }
    return {
      render: render2
    };
    function normalize(children, i) {
      if (isString(children[i]) || isNumber(children[i])) {
        children[i] = createVNode(Text, null, children[i]);
      }
      return children[i];
    }
    function mountChildren(children, container) {
      for (let i = 0; i < children.length; ++i) {
        let child = normalize(children, i);
        patch(null, child, container);
      }
    }
    function unmountChildren(children) {
      children.forEach((child) => {
        umount(child);
      });
    }
    function patchChildren(n1, n2, el) {
      let c1 = n1.children;
      let c2 = n2.children;
      const prevShapeFlag = n1.shapeFlags;
      const shapeFlag = n2.shapeFlags;
      if (shapeFlag && shapeFlag & 8 /* TEXT_CHILDREN */) {
        if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
          unmountChildren(c1);
        }
        if (c1 !== c2) {
          hostSetElementText(el, c2);
        }
      } else {
        if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
          if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
            patchKeyedChildren(c1, c2, el);
          } else {
            unmountChildren(c1);
          }
        } else {
          if (prevShapeFlag & 8 /* TEXT_CHILDREN */) {
            hostSetElementText(el, "");
          }
          if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
            mountChildren(c2, el);
          }
        }
      }
    }
    function mountElement(vnode, container, anchor) {
      let { type, shapeFlags, props, children } = vnode;
      let el = vnode.el = hostCreateElement(type);
      if (props) {
        patchProps(null, props, el);
      }
      if (shapeFlags & 8 /* TEXT_CHILDREN */) {
        hostSetElementText(el, children);
      }
      if (shapeFlags & 16 /* ARRAY_CHILDREN */) {
        mountChildren(children, el);
      }
      hostInsert(el, container, anchor);
    }
    function patchElement(n1, n2) {
      let el = n2.el = n1.el;
      let oldProps = n1.props;
      let newProps = n2.props;
      patchProps(oldProps, newProps, el);
      patchChildren(n1, n2, el);
    }
    function processText(n1, n2, container) {
      if (n1 == null) {
        hostInsert(n2.el = hostCreateTextNode(n2.children), container);
      } else {
        const el = n2.el = n1.el;
        let newText = n2.children;
        if (newText !== n1.children) {
          hostSetText(newText);
        }
      }
    }
    function processElement(n1, n2, container, anchor) {
      if (n1 == null) {
        mountElement(n2, container, anchor);
      } else {
        patchElement(n1, n2);
      }
    }
    function patchKeyedChildren(c1, c2, el) {
      let i = 0;
      let e1 = c1.length - 1;
      let e2 = c2.length - 1;
      while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i];
        if (isSameVNode(n1, n2)) {
          patch(n1, n2, el);
        } else {
          break;
        }
        i++;
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2];
        if (isSameVNode(n1, n2)) {
          patch(n1, n2, el);
        } else {
          break;
        }
        e1--;
        e2--;
      }
      if (i > e1) {
        if (i < e2) {
          while (i < e2) {
            const nextPos = e2 + 1;
            let anchor = c2.length <= nextPos ? null : c2[nextPos].el;
            patch(null, c2[i], el, anchor);
            i++;
          }
        }
      } else if (i > e1) {
        if (i <= e1) {
          while (i <= e1) {
            umount(c1[i]);
            i++;
          }
        }
      } else {
        let s1 = i;
        let s2 = i;
        let toBePatched = e2 - s2 + 1;
        const keyToNewIndexMap = /* @__PURE__ */ new Map();
        for (let i2 = s2; i2 <= e2; i2++) {
          keyToNewIndexMap.set(c2[i2].key, i2);
        }
        const seq = new Array(toBePatched).fill(0);
        for (let i2 = s1; i2 <= e1; ++i2) {
          let oldValue = c1[i2];
          let newIndex = keyToNewIndexMap.get(c1.key);
          if (newIndex == null) {
            umount(oldValue);
          } else {
            seq[newIndex - s2] = i2 + 1;
            patch(oldValue, c2[newIndex], el);
          }
        }
        let incr = getSequence(seq);
        let j = incr.length - 1;
        for (let i2 = toBePatched - 1; i2 >= 0; i2--) {
          const currentIndex = i2 + s2;
          const child = c2[currentIndex];
          const anchor = c2.length <= currentIndex + 1 ? null : c2[currentIndex + 1].el;
          if (seq[i2] === 0) {
            patch(null, child, el, anchor);
          } else {
            if (i2 !== incr[j]) {
              hostInsert(child.el, el, anchor);
            } else {
              j--;
            }
          }
        }
      }
    }
    function processFragment(n1, n2, container) {
      if (n1 == null) {
        mountChildren(n2.children, container);
      } else {
        patchKeyedChildren(n1.children, n2.children, container);
      }
    }
  }

  // packages/runtime-dom/src/nodeOps.ts
  var nodeOps = {
    createElement(tagName) {
      return document.createElement(tagName);
    },
    createTextNode(text) {
      return document.createTextNode(text);
    },
    insert(element, container, anchor = null) {
      container.insertBefore(element, anchor);
    },
    remove(child) {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    querySelector(selectors) {
      return document.querySelector(selectors);
    },
    parentNode(child) {
      return child.parentNode;
    },
    nextSibling(child) {
      return child.nextSibling;
    },
    setText(element, text) {
      element.nodeValue = text;
    },
    setElementText(element, text) {
      element.textContent = text;
    }
  };

  // packages/runtime-dom/src/patch-prop/patchAttr.ts
  function patchAttr(el, key, nextValue) {
    if (nextValue === null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextValue);
    }
  }

  // packages/runtime-dom/src/patch-prop/patchClass.ts
  function patchClass(el, nextValue) {
    if (nextValue === null) {
      el.removeAttribute("class");
    } else {
      el.calssName = nextValue;
    }
  }

  // packages/runtime-dom/src/patch-prop/patchEvent.ts
  function createInvoker(preValue) {
    const invoker = (e) => {
      invoker.value(e);
    };
    invoker.value = preValue;
    return invoker;
  }
  function patchEvent(el, eventName, nextValue) {
    const invokers = el._vei || (el._vei = {});
    const exitingInvoker = invokers[eventName];
    if (exitingInvoker && nextValue) {
      exitingInvoker.value = nextValue;
    } else {
      const eName = eventName.slice(2).toLowerCase();
      if (nextValue) {
        const invoker = createInvoker(nextValue);
        invokers[eventName] = invoker;
        el.addEventListener(eName, invoker);
      } else if (exitingInvoker) {
        el.removeEventListener(eName, exitingInvoker);
        invokers[eventName] = null;
      }
    }
  }

  // packages/runtime-dom/src/patch-prop/patchStyle.ts
  function patchStyle(el, preValue, nextValue) {
    const style = el.style;
    for (let key in nextValue) {
      style[key] = nextValue[key];
    }
    if (preValue) {
      for (let key in preValue) {
        if (nextValue[key] === null) {
          style[key] = null;
        }
      }
    }
  }

  // packages/runtime-dom/src/patchProp.ts
  var patchProp = (el, key, preValue, nextValue) => {
    if (key === "clsss") {
      patchClass(el, nextValue);
    } else if (key === "style") {
      patchStyle(el, preValue, nextValue);
    } else if (/on[^a-z]/.test(key)) {
      patchEvent(el, key, nextValue);
    } else {
      patchAttr(el, key, nextValue);
    }
  };

  // packages/runtime-core/src/h.ts
  function h(type, propsOrChildren, children) {
    const l = arguments.length;
    if (l == 2) {
      if (isObject(propsOrChildren) && !isFunction(propsOrChildren)) {
        if (isVnode(propsOrChildren)) {
          return createVNode(type, null, [propsOrChildren]);
        }
        return createVNode(type, propsOrChildren);
      } else {
        return createVNode(type, null, propsOrChildren);
      }
    } else {
      if (l === 3 && isVnode(children)) {
        return createVNode(type, propsOrChildren, [children]);
      } else if (l > 3) {
        children = Array.from(arguments).slice(2);
      }
      return createVNode(type, propsOrChildren, children);
    }
  }

  // packages/runtime-dom/src/index.ts
  var renderOptions = __spreadValues({ patchProp }, nodeOps);
  function render(vnode, container) {
    let { render: render2 } = createRenderer(renderOptions);
    return render2(vnode, container);
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=runtime-dom.global.js.map
