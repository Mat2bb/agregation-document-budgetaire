function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var VNode = function VNode() {};

var options = {};
var stack = [];
var EMPTY_CHILDREN = [];

function h(nodeName, attributes) {
  var children = EMPTY_CHILDREN,
      lastSimple,
      child,
      simple,
      i;

  for (i = arguments.length; i-- > 2;) {
    stack.push(arguments[i]);
  }

  if (attributes && attributes.children != null) {
    if (!stack.length) stack.push(attributes.children);
    delete attributes.children;
  }

  while (stack.length) {
    if ((child = stack.pop()) && child.pop !== undefined) {
      for (i = child.length; i--;) {
        stack.push(child[i]);
      }
    } else {
      if (typeof child === 'boolean') child = null;

      if (simple = typeof nodeName !== 'function') {
        if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
      }

      if (simple && lastSimple) {
        children[children.length - 1] += child;
      } else if (children === EMPTY_CHILDREN) {
        children = [child];
      } else {
        children.push(child);
      }

      lastSimple = simple;
    }
  }

  var p = new VNode();
  p.nodeName = nodeName;
  p.children = children;
  p.attributes = attributes == null ? undefined : attributes;
  p.key = attributes == null ? undefined : attributes.key;
  return p;
}

function extend(obj, props) {
  for (var i in props) {
    obj[i] = props[i];
  }

  return obj;
}

function applyRef(ref, value) {
  if (ref != null) {
    if (typeof ref == 'function') ref(value);else ref.current = value;
  }
}

var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
var items = [];

function enqueueRender(component) {
  if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
    (defer)(rerender);
  }
}

function rerender() {
  var p;

  while (p = items.pop()) {
    if (p._dirty) renderComponent(p);
  }
}

function isSameNodeType(node, vnode, hydrating) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return node.splitText !== undefined;
  }

  if (typeof vnode.nodeName === 'string') {
    return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
  }

  return hydrating || node._componentConstructor === vnode.nodeName;
}

function isNamedNode(node, nodeName) {
  return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

function getNodeProps(vnode) {
  var props = extend({}, vnode.attributes);
  props.children = vnode.children;
  var defaultProps = vnode.nodeName.defaultProps;

  if (defaultProps !== undefined) {
    for (var i in defaultProps) {
      if (props[i] === undefined) {
        props[i] = defaultProps[i];
      }
    }
  }

  return props;
}

function createNode(nodeName, isSvg) {
  var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
  node.normalizedNodeName = nodeName;
  return node;
}

function removeNode(node) {
  var parentNode = node.parentNode;
  if (parentNode) parentNode.removeChild(node);
}

function setAccessor(node, name, old, value, isSvg) {
  if (name === 'className') name = 'class';

  if (name === 'key') ; else if (name === 'ref') {
    applyRef(old, null);
    applyRef(value, node);
  } else if (name === 'class' && !isSvg) {
    node.className = value || '';
  } else if (name === 'style') {
    if (!value || typeof value === 'string' || typeof old === 'string') {
      node.style.cssText = value || '';
    }

    if (value && typeof value === 'object') {
      if (typeof old !== 'string') {
        for (var i in old) {
          if (!(i in value)) node.style[i] = '';
        }
      }

      for (var i in value) {
        node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
      }
    }
  } else if (name === 'dangerouslySetInnerHTML') {
    if (value) node.innerHTML = value.__html || '';
  } else if (name[0] == 'o' && name[1] == 'n') {
    var useCapture = name !== (name = name.replace(/Capture$/, ''));
    name = name.toLowerCase().substring(2);

    if (value) {
      if (!old) node.addEventListener(name, eventProxy, useCapture);
    } else {
      node.removeEventListener(name, eventProxy, useCapture);
    }

    (node._listeners || (node._listeners = {}))[name] = value;
  } else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
    try {
      node[name] = value == null ? '' : value;
    } catch (e) {}

    if ((value == null || value === false) && name != 'spellcheck') node.removeAttribute(name);
  } else {
    var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ''));

    if (value == null || value === false) {
      if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
    } else if (typeof value !== 'function') {
      if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
    }
  }
}

function eventProxy(e) {
  return this._listeners[e.type](e);
}

var mounts = [];
var diffLevel = 0;
var isSvgMode = false;
var hydrating = false;

function flushMounts() {
  var c;

  while (c = mounts.shift()) {
    if (c.componentDidMount) c.componentDidMount();
  }
}

function diff(dom, vnode, context, mountAll, parent, componentRoot) {
  if (!diffLevel++) {
    isSvgMode = parent != null && parent.ownerSVGElement !== undefined;
    hydrating = dom != null && !('__preactattr_' in dom);
  }

  var ret = idiff(dom, vnode, context, mountAll, componentRoot);
  if (parent && ret.parentNode !== parent) parent.appendChild(ret);

  if (! --diffLevel) {
    hydrating = false;
    if (!componentRoot) flushMounts();
  }

  return ret;
}

function idiff(dom, vnode, context, mountAll, componentRoot) {
  var out = dom,
      prevSvgMode = isSvgMode;
  if (vnode == null || typeof vnode === 'boolean') vnode = '';

  if (typeof vnode === 'string' || typeof vnode === 'number') {
    if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
      if (dom.nodeValue != vnode) {
        dom.nodeValue = vnode;
      }
    } else {
      out = document.createTextNode(vnode);

      if (dom) {
        if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
        recollectNodeTree(dom, true);
      }
    }

    out['__preactattr_'] = true;
    return out;
  }

  var vnodeName = vnode.nodeName;

  if (typeof vnodeName === 'function') {
    return buildComponentFromVNode(dom, vnode, context, mountAll);
  }

  isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;
  vnodeName = String(vnodeName);

  if (!dom || !isNamedNode(dom, vnodeName)) {
    out = createNode(vnodeName, isSvgMode);

    if (dom) {
      while (dom.firstChild) {
        out.appendChild(dom.firstChild);
      }

      if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
      recollectNodeTree(dom, true);
    }
  }

  var fc = out.firstChild,
      props = out['__preactattr_'],
      vchildren = vnode.children;

  if (props == null) {
    props = out['__preactattr_'] = {};

    for (var a = out.attributes, i = a.length; i--;) {
      props[a[i].name] = a[i].value;
    }
  }

  if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
    if (fc.nodeValue != vchildren[0]) {
      fc.nodeValue = vchildren[0];
    }
  } else if (vchildren && vchildren.length || fc != null) {
    innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
  }

  diffAttributes(out, vnode.attributes, props);
  isSvgMode = prevSvgMode;
  return out;
}

function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
  var originalChildren = dom.childNodes,
      children = [],
      keyed = {},
      keyedLen = 0,
      min = 0,
      len = originalChildren.length,
      childrenLen = 0,
      vlen = vchildren ? vchildren.length : 0,
      j,
      c,
      f,
      vchild,
      child;

  if (len !== 0) {
    for (var i = 0; i < len; i++) {
      var _child = originalChildren[i],
          props = _child['__preactattr_'],
          key = vlen && props ? _child._component ? _child._component.__key : props.key : null;

      if (key != null) {
        keyedLen++;
        keyed[key] = _child;
      } else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
        children[childrenLen++] = _child;
      }
    }
  }

  if (vlen !== 0) {
    for (var i = 0; i < vlen; i++) {
      vchild = vchildren[i];
      child = null;
      var key = vchild.key;

      if (key != null) {
        if (keyedLen && keyed[key] !== undefined) {
          child = keyed[key];
          keyed[key] = undefined;
          keyedLen--;
        }
      } else if (min < childrenLen) {
        for (j = min; j < childrenLen; j++) {
          if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
            child = c;
            children[j] = undefined;
            if (j === childrenLen - 1) childrenLen--;
            if (j === min) min++;
            break;
          }
        }
      }

      child = idiff(child, vchild, context, mountAll);
      f = originalChildren[i];

      if (child && child !== dom && child !== f) {
        if (f == null) {
          dom.appendChild(child);
        } else if (child === f.nextSibling) {
          removeNode(f);
        } else {
          dom.insertBefore(child, f);
        }
      }
    }
  }

  if (keyedLen) {
    for (var i in keyed) {
      if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
    }
  }

  while (min <= childrenLen) {
    if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
  }
}

function recollectNodeTree(node, unmountOnly) {
  var component = node._component;

  if (component) {
    unmountComponent(component);
  } else {
    if (node['__preactattr_'] != null) applyRef(node['__preactattr_'].ref, null);

    if (unmountOnly === false || node['__preactattr_'] == null) {
      removeNode(node);
    }

    removeChildren(node);
  }
}

function removeChildren(node) {
  node = node.lastChild;

  while (node) {
    var next = node.previousSibling;
    recollectNodeTree(node, true);
    node = next;
  }
}

function diffAttributes(dom, attrs, old) {
  var name;

  for (name in old) {
    if (!(attrs && attrs[name] != null) && old[name] != null) {
      setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
    }
  }

  for (name in attrs) {
    if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
      setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
    }
  }
}

var recyclerComponents = [];

function createComponent(Ctor, props, context) {
  var inst,
      i = recyclerComponents.length;

  if (Ctor.prototype && Ctor.prototype.render) {
    inst = new Ctor(props, context);
    Component.call(inst, props, context);
  } else {
    inst = new Component(props, context);
    inst.constructor = Ctor;
    inst.render = doRender;
  }

  while (i--) {
    if (recyclerComponents[i].constructor === Ctor) {
      inst.nextBase = recyclerComponents[i].nextBase;
      recyclerComponents.splice(i, 1);
      return inst;
    }
  }

  return inst;
}

function doRender(props, state, context) {
  return this.constructor(props, context);
}

function setComponentProps(component, props, renderMode, context, mountAll) {
  if (component._disable) return;
  component._disable = true;
  component.__ref = props.ref;
  component.__key = props.key;
  delete props.ref;
  delete props.key;

  if (typeof component.constructor.getDerivedStateFromProps === 'undefined') {
    if (!component.base || mountAll) {
      if (component.componentWillMount) component.componentWillMount();
    } else if (component.componentWillReceiveProps) {
      component.componentWillReceiveProps(props, context);
    }
  }

  if (context && context !== component.context) {
    if (!component.prevContext) component.prevContext = component.context;
    component.context = context;
  }

  if (!component.prevProps) component.prevProps = component.props;
  component.props = props;
  component._disable = false;

  if (renderMode !== 0) {
    if (renderMode === 1 || options.syncComponentUpdates !== false || !component.base) {
      renderComponent(component, 1, mountAll);
    } else {
      enqueueRender(component);
    }
  }

  applyRef(component.__ref, component);
}

function renderComponent(component, renderMode, mountAll, isChild) {
  if (component._disable) return;
  var props = component.props,
      state = component.state,
      context = component.context,
      previousProps = component.prevProps || props,
      previousState = component.prevState || state,
      previousContext = component.prevContext || context,
      isUpdate = component.base,
      nextBase = component.nextBase,
      initialBase = isUpdate || nextBase,
      initialChildComponent = component._component,
      skip = false,
      snapshot = previousContext,
      rendered,
      inst,
      cbase;

  if (component.constructor.getDerivedStateFromProps) {
    state = extend(extend({}, state), component.constructor.getDerivedStateFromProps(props, state));
    component.state = state;
  }

  if (isUpdate) {
    component.props = previousProps;
    component.state = previousState;
    component.context = previousContext;

    if (renderMode !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
      skip = true;
    } else if (component.componentWillUpdate) {
      component.componentWillUpdate(props, state, context);
    }

    component.props = props;
    component.state = state;
    component.context = context;
  }

  component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
  component._dirty = false;

  if (!skip) {
    rendered = component.render(props, state, context);

    if (component.getChildContext) {
      context = extend(extend({}, context), component.getChildContext());
    }

    if (isUpdate && component.getSnapshotBeforeUpdate) {
      snapshot = component.getSnapshotBeforeUpdate(previousProps, previousState);
    }

    var childComponent = rendered && rendered.nodeName,
        toUnmount,
        base;

    if (typeof childComponent === 'function') {
      var childProps = getNodeProps(rendered);
      inst = initialChildComponent;

      if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
        setComponentProps(inst, childProps, 1, context, false);
      } else {
        toUnmount = inst;
        component._component = inst = createComponent(childComponent, childProps, context);
        inst.nextBase = inst.nextBase || nextBase;
        inst._parentComponent = component;
        setComponentProps(inst, childProps, 0, context, false);
        renderComponent(inst, 1, mountAll, true);
      }

      base = inst.base;
    } else {
      cbase = initialBase;
      toUnmount = initialChildComponent;

      if (toUnmount) {
        cbase = component._component = null;
      }

      if (initialBase || renderMode === 1) {
        if (cbase) cbase._component = null;
        base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
      }
    }

    if (initialBase && base !== initialBase && inst !== initialChildComponent) {
      var baseParent = initialBase.parentNode;

      if (baseParent && base !== baseParent) {
        baseParent.replaceChild(base, initialBase);

        if (!toUnmount) {
          initialBase._component = null;
          recollectNodeTree(initialBase, false);
        }
      }
    }

    if (toUnmount) {
      unmountComponent(toUnmount);
    }

    component.base = base;

    if (base && !isChild) {
      var componentRef = component,
          t = component;

      while (t = t._parentComponent) {
        (componentRef = t).base = base;
      }

      base._component = componentRef;
      base._componentConstructor = componentRef.constructor;
    }
  }

  if (!isUpdate || mountAll) {
    mounts.push(component);
  } else if (!skip) {
    if (component.componentDidUpdate) {
      component.componentDidUpdate(previousProps, previousState, snapshot);
    }
  }

  while (component._renderCallbacks.length) {
    component._renderCallbacks.pop().call(component);
  }

  if (!diffLevel && !isChild) flushMounts();
}

function buildComponentFromVNode(dom, vnode, context, mountAll) {
  var c = dom && dom._component,
      originalComponent = c,
      oldDom = dom,
      isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
      isOwner = isDirectOwner,
      props = getNodeProps(vnode);

  while (c && !isOwner && (c = c._parentComponent)) {
    isOwner = c.constructor === vnode.nodeName;
  }

  if (c && isOwner && (!mountAll || c._component)) {
    setComponentProps(c, props, 3, context, mountAll);
    dom = c.base;
  } else {
    if (originalComponent && !isDirectOwner) {
      unmountComponent(originalComponent);
      dom = oldDom = null;
    }

    c = createComponent(vnode.nodeName, props, context);

    if (dom && !c.nextBase) {
      c.nextBase = dom;
      oldDom = null;
    }

    setComponentProps(c, props, 1, context, mountAll);
    dom = c.base;

    if (oldDom && dom !== oldDom) {
      oldDom._component = null;
      recollectNodeTree(oldDom, false);
    }
  }

  return dom;
}

function unmountComponent(component) {
  var base = component.base;
  component._disable = true;
  if (component.componentWillUnmount) component.componentWillUnmount();
  component.base = null;
  var inner = component._component;

  if (inner) {
    unmountComponent(inner);
  } else if (base) {
    if (base['__preactattr_'] != null) applyRef(base['__preactattr_'].ref, null);
    component.nextBase = base;
    removeNode(base);
    recyclerComponents.push(component);
    removeChildren(base);
  }

  applyRef(component.__ref, null);
}

function Component(props, context) {
  this._dirty = true;
  this.context = context;
  this.props = props;
  this.state = this.state || {};
  this._renderCallbacks = [];
}

extend(Component.prototype, {
  setState: function setState(state, callback) {
    if (!this.prevState) this.prevState = this.state;
    this.state = extend(extend({}, this.state), typeof state === 'function' ? state(this.state, this.props) : state);
    if (callback) this._renderCallbacks.push(callback);
    enqueueRender(this);
  },
  forceUpdate: function forceUpdate(callback) {
    if (callback) this._renderCallbacks.push(callback);
    renderComponent(this, 2);
  },
  render: function render() {}
});

function render(vnode, parent, merge) {
  return diff(merge, vnode, {}, false, parent, false);
}

var EOL = {},
    EOF = {},
    QUOTE = 34,
    NEWLINE = 10,
    RETURN = 13;

function objectConverter(columns) {
  return new Function("d", "return {" + columns.map(function (name, i) {
    return JSON.stringify(name) + ": d[" + i + "]";
  }).join(",") + "}");
}

function customConverter(columns, f) {
  var object = objectConverter(columns);
  return function (row, i) {
    return f(object(row), i, columns);
  };
} // Compute unique columns in order of discovery.


function inferColumns(rows) {
  var columnSet = Object.create(null),
      columns = [];
  rows.forEach(function (row) {
    for (var column in row) {
      if (!(column in columnSet)) {
        columns.push(columnSet[column] = column);
      }
    }
  });
  return columns;
}

function pad(value, width) {
  var s = value + "",
      length = s.length;
  return length < width ? new Array(width - length + 1).join(0) + s : s;
}

function formatYear(year) {
  return year < 0 ? "-" + pad(-year, 6) : year > 9999 ? "+" + pad(year, 6) : pad(year, 4);
}

function formatDate(date) {
  var hours = date.getUTCHours(),
      minutes = date.getUTCMinutes(),
      seconds = date.getUTCSeconds(),
      milliseconds = date.getUTCMilliseconds();
  return isNaN(date) ? "Invalid Date" : formatYear(date.getUTCFullYear(), 4) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2) + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z" : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z" : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z" : "");
}

function dsv (delimiter) {
  var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
      DELIMITER = delimiter.charCodeAt(0);

  function parse(text, f) {
    var convert,
        columns,
        rows = parseRows(text, function (row, i) {
      if (convert) return convert(row, i - 1);
      columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
    });
    rows.columns = columns || [];
    return rows;
  }

  function parseRows(text, f) {
    var rows = [],
        // output rows
    N = text.length,
        I = 0,
        // current character index
    n = 0,
        // current line number
    t,
        // current token
    eof = N <= 0,
        // current token followed by EOF?
    eol = false; // current token followed by EOL?
    // Strip the trailing newline.

    if (text.charCodeAt(N - 1) === NEWLINE) --N;
    if (text.charCodeAt(N - 1) === RETURN) --N;

    function token() {
      if (eof) return EOF;
      if (eol) return eol = false, EOL; // Unescape quotes.

      var i,
          j = I,
          c;

      if (text.charCodeAt(j) === QUOTE) {
        while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);

        if ((i = I) >= N) eof = true;else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;else if (c === RETURN) {
          eol = true;
          if (text.charCodeAt(I) === NEWLINE) ++I;
        }
        return text.slice(j + 1, i - 1).replace(/""/g, "\"");
      } // Find next delimiter or newline.


      while (I < N) {
        if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;else if (c === RETURN) {
          eol = true;
          if (text.charCodeAt(I) === NEWLINE) ++I;
        } else if (c !== DELIMITER) continue;
        return text.slice(j, i);
      } // Return last token before EOF.


      return eof = true, text.slice(j, N);
    }

    while ((t = token()) !== EOF) {
      var row = [];

      while (t !== EOL && t !== EOF) row.push(t), t = token();

      if (f && (row = f(row, n++)) == null) continue;
      rows.push(row);
    }

    return rows;
  }

  function preformatBody(rows, columns) {
    return rows.map(function (row) {
      return columns.map(function (column) {
        return formatValue(row[column]);
      }).join(delimiter);
    });
  }

  function format(rows, columns) {
    if (columns == null) columns = inferColumns(rows);
    return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
  }

  function formatBody(rows, columns) {
    if (columns == null) columns = inferColumns(rows);
    return preformatBody(rows, columns).join("\n");
  }

  function formatRows(rows) {
    return rows.map(formatRow).join("\n");
  }

  function formatRow(row) {
    return row.map(formatValue).join(delimiter);
  }

  function formatValue(value) {
    return value == null ? "" : value instanceof Date ? formatDate(value) : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\"" : value;
  }

  return {
    parse: parse,
    parseRows: parseRows,
    format: format,
    formatBody: formatBody,
    formatRows: formatRows
  };
}

var csv = dsv(",");
var csvParse = csv.parse;
var csvParseRows = csv.parseRows;
var csvFormat = csv.format;
var csvFormatBody = csv.formatBody;
var csvFormatRows = csv.formatRows;

var tsv = dsv("\t");
var tsvParse = tsv.parse;
var tsvParseRows = tsv.parseRows;
var tsvFormat = tsv.format;
var tsvFormatBody = tsv.formatBody;
var tsvFormatRows = tsv.formatRows;

function responseText(response) {
  if (!response.ok) throw new Error(response.status + " " + response.statusText);
  return response.text();
}

function text (input, init) {
  return fetch(input, init).then(responseText);
}

function dsvParse(parse) {
  return function (input, init, row) {
    if (arguments.length === 2 && typeof init === "function") row = init, init = undefined;
    return text(input, init).then(function (response) {
      return parse(response, row);
    });
  };
}
var csv$1 = dsvParse(csvParse);

function parser(type) {
  return function (input, init) {
    return text(input, init).then(function (text) {
      return new DOMParser().parseFromString(text, type);
    });
  };
}

var xml = parser("application/xml");

function ascending (a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function bisector (compare) {
  if (compare.length === 1) compare = ascendingComparator(compare);
  return {
    left: function (a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;

      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;else hi = mid;
      }

      return lo;
    },
    right: function (a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;

      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;else lo = mid + 1;
      }

      return lo;
    }
  };
}

function ascendingComparator(f) {
  return function (d, x) {
    return ascending(f(d), x);
  };
}

var ascendingBisect = bisector(ascending);

function sum(values, valueof) {
  let sum = 0;

  if (valueof === undefined) {
    for (let value of values) {
      if (value = +value) {
        sum += value;
      }
    }
  } else {
    let index = -1;

    for (let value of values) {
      if (value = +valueof(value, ++index, values)) {
        sum += value;
      }
    }
  }

  return sum;
}

function makeLigneBudgetId(ligneBudget) {
  return [ligneBudget['CodRD'], ligneBudget['Fonction'], ligneBudget['Nature']].join(' ');
}

function xmlDocumentToDocumentBudgetaire(doc) {
  var BlocBudget = doc.getElementsByTagName('BlocBudget')[0];
  var exer = Number(BlocBudget.getElementsByTagName('Exer')[0].getAttribute('V')); // In the XML files, the same (CodRD, Nature, Fonction) tuple can appear
  // We consider them as a single LigneBudget

  var xmlRowsById = new Map();
  var lignes = Array.from(doc.getElementsByTagName('LigneBudget')).filter(function (l) {
    var isOR = l.getElementsByTagName('OpBudg')[0].getAttribute('V') === '0';
    var hasNon0Amount = Number(l.getElementsByTagName('MtReal')[0].getAttribute('V')) !== 0;
    var n = l.getElementsByTagName('Nature')[0].getAttribute('V');
    var f = l.getElementsByTagName('Fonction')[0].getAttribute('V');
    return isOR && hasNon0Amount && !(n === '001' && f === '01') && !(n === '002' && f === '0202');
  }).map(function (l) {
    var ret = {};
    ['Nature', 'Fonction', 'CodRD', 'MtReal'].forEach(function (key) {
      ret[key] = l.getElementsByTagName(key)[0].getAttribute('V');
    });
    ret['MtReal'] = Number(ret['MtReal']);
    return ret;
  });
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = lignes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var r = _step.value;
      var id = makeLigneBudgetId(r);
      var idRows = xmlRowsById.get(id) || [];
      idRows.push(r);
      xmlRowsById.set(id, idRows);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return {
    LibelleColl: doc.getElementsByTagName('LibelleColl')[0].getAttribute('V'),
    Nomenclature: doc.getElementsByTagName('Nomenclature')[0].getAttribute('V'),
    NatDec: BlocBudget.getElementsByTagName('NatDec')[0].getAttribute('V'),
    Exer: exer,
    IdColl: doc.getElementsByTagName('IdColl')[0].getAttribute('V'),
    rows: new Set(_toConsumableArray(xmlRowsById.values()).map(function (xmlRows) {
      var amount = sum(xmlRows.map(function (r) {
        return Number(r['MtReal']);
      }));
      var r = xmlRows[0];
      return Object.freeze(_objectSpread({}, r, {
        'MtReal': amount
      }));
    }))
  };
}

function makeNatureToChapitreFI (plansDeCompte) {
  var dataByExer = new Map();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var pc = _step.value;
      var exer = Number(pc.getElementsByTagName('Nomenclature')[0].getAttribute('Exer'));
      var chapitreCodeByNatureR = new Map();
      var chapitreCodeByNatureD = new Map();
      var FIByChapitreCode = new Map();
      Array.from(pc.getElementsByTagName('Compte')).forEach(function (c) {
        var code = c.getAttribute('Code');
        if (!chapitreCodeByNatureR.has(code)) chapitreCodeByNatureR.set(code, c.getAttribute('RR'));
        if (!chapitreCodeByNatureD.has(code)) chapitreCodeByNatureD.set(code, c.getAttribute('DR'));
      });
      Array.from(pc.getElementsByTagName('Chapitre')).map(function (c) {
        var code = c.getAttribute('Code');
        if (!FIByChapitreCode.has(code)) FIByChapitreCode.set(code, c.getAttribute('Section'));
      });
      dataByExer.set(exer, {
        chapitreCodeByNatureR: chapitreCodeByNatureR,
        chapitreCodeByNatureD: chapitreCodeByNatureD,
        FIByChapitreCode: FIByChapitreCode
      });
    };

    for (var _iterator = plansDeCompte[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var exers = Array.from(dataByExer.keys());
  var minExer = Math.min.apply(Math, _toConsumableArray(exers));
  return function (exer, RD, nature) {
    if (exer < minExer) exer = minExer;

    var _dataByExer$get = dataByExer.get(exer),
        chapitreCodeByNatureR = _dataByExer$get.chapitreCodeByNatureR,
        chapitreCodeByNatureD = _dataByExer$get.chapitreCodeByNatureD,
        FIByChapitreCode = _dataByExer$get.FIByChapitreCode;

    var chapitreCodeByNature = RD === 'R' ? chapitreCodeByNatureR : chapitreCodeByNatureD;
    var chapitreCode = chapitreCodeByNature.get(nature);
    if (!chapitreCode) console.warn('No chapitreCode for', RD, nature);
    var FI = FIByChapitreCode.get(chapitreCode);
    if (!FI) console.warn('No FI (section) for', RD, nature, chapitreCode);
    return {
      FI: FI,
      Chapitre: chapitreCode
    };
  };
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */

var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */

var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */

var now = function () {
  return root.Date.now();
};

/** Built-in value references. */

var Symbol$1 = root.Symbol;

/** Used for built-in method references. */

var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString = objectProto.toString;
/** Built-in value references. */

var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;
/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */

function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);

  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }

  return result;
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString$1 = objectProto$1.toString;
/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */

function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

/** `Object#toString` result references. */

var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';
/** Built-in value references. */

var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;
/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */

function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }

  return symToStringTag$1 && symToStringTag$1 in Object(value) ? getRawTag(value) : objectToString(value);
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */

var symbolTag = '[object Symbol]';
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */

function isSymbol(value) {
  return typeof value == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag;
}

/** Used as references for various `Number` constants. */

var NAN = 0 / 0;
/** Used to match leading and trailing whitespace. */

var reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */

var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */

var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */

var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */

var freeParseInt = parseInt;
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */

function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }

  if (isSymbol(value)) {
    return NAN;
  }

  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }

  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }

  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

/** Error message constants. */

var FUNC_ERROR_TEXT = 'Expected a function';
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeMax = Math.max,
    nativeMin = Math.min;
/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */

function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  wait = toNumber(wait) || 0;

  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time; // Start the timer for the trailing edge.

    timerId = setTimeout(timerExpired, wait); // Invoke the leading edge.

    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;
    return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime; // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.

    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }

  function timerExpired() {
    var time = now();

    if (shouldInvoke(time)) {
      return trailingEdge(time);
    } // Restart the timer.


    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined; // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }

    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }

    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }

      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }

    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }

    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

//
// Main
//
function memoize(fn, options) {
  var cache = options && options.cache ? options.cache : cacheDefault;
  var serializer = options && options.serializer ? options.serializer : serializerDefault;
  var strategy = options && options.strategy ? options.strategy : strategyDefault;
  return strategy(fn, {
    cache: cache,
    serializer: serializer
  });
} //
// Strategy
//


function isPrimitive(value) {
  return value == null || typeof value === 'number' || typeof value === 'boolean'; // || typeof value === "string" 'unsafe' primitive for our needs
}

function monadic(fn, cache, serializer, arg) {
  var cacheKey = isPrimitive(arg) ? arg : serializer(arg);
  var computedValue = cache.get(cacheKey);

  if (typeof computedValue === 'undefined') {
    computedValue = fn.call(this, arg);
    cache.set(cacheKey, computedValue);
  }

  return computedValue;
}

function variadic(fn, cache, serializer) {
  var args = Array.prototype.slice.call(arguments, 3);
  var cacheKey = serializer(args);
  var computedValue = cache.get(cacheKey);

  if (typeof computedValue === 'undefined') {
    computedValue = fn.apply(this, args);
    cache.set(cacheKey, computedValue);
  }

  return computedValue;
}

function assemble(fn, context, strategy, cache, serialize) {
  return strategy.bind(context, fn, cache, serialize);
}

function strategyDefault(fn, options) {
  var strategy = fn.length === 1 ? monadic : variadic;
  return assemble(fn, this, strategy, options.cache.create(), options.serializer);
}

function strategyVariadic(fn, options) {
  var strategy = variadic;
  return assemble(fn, this, strategy, options.cache.create(), options.serializer);
}

function strategyMonadic(fn, options) {
  var strategy = monadic;
  return assemble(fn, this, strategy, options.cache.create(), options.serializer);
} //
// Serializer
//


function serializerDefault() {
  return JSON.stringify(arguments);
} //
// Cache
//


function ObjectWithoutPrototypeCache() {
  this.cache = Object.create(null);
}

ObjectWithoutPrototypeCache.prototype.has = function (key) {
  return key in this.cache;
};

ObjectWithoutPrototypeCache.prototype.get = function (key) {
  return this.cache[key];
};

ObjectWithoutPrototypeCache.prototype.set = function (key, value) {
  this.cache[key] = value;
};

var cacheDefault = {
  create: function create() {
    return new ObjectWithoutPrototypeCache();
  } //
  // API
  //

};
var src = memoize;
var strategies = {
  variadic: strategyVariadic,
  monadic: strategyMonadic
};
src.strategies = strategies;

// It doesn't work well with Set/Map/WeakSet/WeakMap which always serialize to '{}'

function Serializer() {
  var objectCounter = new WeakMap();
  var next = 1;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.map(function (arg) {
      if (arg === null || arg === undefined || typeof arg === 'boolean') {
        return String(arg);
      }

      switch (_typeof(arg)) {
        case 'number':
        case 'string':
          {
            return "".concat(_typeof(arg), "(").concat(arg, ")");
          }

        case 'object': // null handled above

        case 'symbol':
          {
            var id = objectCounter.get(arg);

            if (id === undefined) {
              id = next;
              objectCounter.set(arg, id);
              next++;
            }

            return id.toString(36);
          }

        default:
          {
            console.error('Unhandled type', _typeof(arg));
            return 'Ser' + Math.random().toString(36).slice(2);
          }
      }
    }).join(' ');
  };
} // copy of most useful code of fast-memoize


function isPrimitive$1(value) {
  return value == null || typeof value === 'number' || typeof value === 'boolean'; // || typeof value === "string" 'unsafe' primitive for our needs
}

function monadic$1(fn, cache, serializer, arg) {
  var cacheKey = isPrimitive$1(arg) ? arg : serializer(arg);
  var computedValue = cache.get(cacheKey);

  if (typeof computedValue === 'undefined') {
    computedValue = fn.call(this, arg);
    cache.set(cacheKey, computedValue);
  }

  return computedValue;
}

function variadic$1(fn, cache, serializer) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
    args[_key2 - 3] = arguments[_key2];
  }

  var cacheKey = serializer.apply(void 0, args);
  var computedValue = cache.get(cacheKey);

  if (typeof computedValue === 'undefined') {
    computedValue = fn.apply(this, args);
    cache.set(cacheKey, computedValue);
  }

  return computedValue;
}

function assemble$1(fn, context, strategy, cache, serialize) {
  return strategy.bind(context, fn, cache, serialize);
}

function memoize$1(fn) {
  return src(fn, {
    serializer: new Serializer(),
    strategy: function strategyDefault(fn, options) {
      var strategy = fn.length === 1 ? monadic$1 : variadic$1;
      return assemble$1(fn, this, strategy, options.cache.create(), options.serializer);
    }
  });
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var nearley = createCommonjsModule(function (module) {
  (function (root, factory) {
    if (module.exports) {
      module.exports = factory();
    } else {
      root.nearley = factory();
    }
  })(commonjsGlobal, function () {
    function Rule(name, symbols, postprocess) {
      this.id = ++Rule.highestId;
      this.name = name;
      this.symbols = symbols; // a list of literal | regex class | nonterminal

      this.postprocess = postprocess;
      return this;
    }

    Rule.highestId = 0;

    Rule.prototype.toString = function (withCursorAt) {
      function stringifySymbolSequence(e) {
        return e.literal ? JSON.stringify(e.literal) : e.type ? '%' + e.type : e.toString();
      }

      var symbolSequence = typeof withCursorAt === "undefined" ? this.symbols.map(stringifySymbolSequence).join(' ') : this.symbols.slice(0, withCursorAt).map(stringifySymbolSequence).join(' ') + " ● " + this.symbols.slice(withCursorAt).map(stringifySymbolSequence).join(' ');
      return this.name + " → " + symbolSequence;
    }; // a State is a rule at a position from a given starting point in the input stream (reference)


    function State(rule, dot, reference, wantedBy) {
      this.rule = rule;
      this.dot = dot;
      this.reference = reference;
      this.data = [];
      this.wantedBy = wantedBy;
      this.isComplete = this.dot === rule.symbols.length;
    }

    State.prototype.toString = function () {
      return "{" + this.rule.toString(this.dot) + "}, from: " + (this.reference || 0);
    };

    State.prototype.nextState = function (child) {
      var state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);
      state.left = this;
      state.right = child;

      if (state.isComplete) {
        state.data = state.build();
      }

      return state;
    };

    State.prototype.build = function () {
      var children = [];
      var node = this;

      do {
        children.push(node.right.data);
        node = node.left;
      } while (node.left);

      children.reverse();
      return children;
    };

    State.prototype.finish = function () {
      if (this.rule.postprocess) {
        this.data = this.rule.postprocess(this.data, this.reference, Parser.fail);
      }
    };

    function Column(grammar, index) {
      this.grammar = grammar;
      this.index = index;
      this.states = [];
      this.wants = {}; // states indexed by the non-terminal they expect

      this.scannable = []; // list of states that expect a token

      this.completed = {}; // states that are nullable
    }

    Column.prototype.process = function (nextColumn) {
      var states = this.states;
      var wants = this.wants;
      var completed = this.completed;

      for (var w = 0; w < states.length; w++) {
        // nb. we push() during iteration
        var state = states[w];

        if (state.isComplete) {
          state.finish();

          if (state.data !== Parser.fail) {
            // complete
            var wantedBy = state.wantedBy;

            for (var i = wantedBy.length; i--;) {
              // this line is hot
              var left = wantedBy[i];
              this.complete(left, state);
            } // special-case nullables


            if (state.reference === this.index) {
              // make sure future predictors of this rule get completed.
              var exp = state.rule.name;
              (this.completed[exp] = this.completed[exp] || []).push(state);
            }
          }
        } else {
          // queue scannable states
          var exp = state.rule.symbols[state.dot];

          if (typeof exp !== 'string') {
            this.scannable.push(state);
            continue;
          } // predict


          if (wants[exp]) {
            wants[exp].push(state);

            if (completed.hasOwnProperty(exp)) {
              var nulls = completed[exp];

              for (var i = 0; i < nulls.length; i++) {
                var right = nulls[i];
                this.complete(state, right);
              }
            }
          } else {
            wants[exp] = [state];
            this.predict(exp);
          }
        }
      }
    };

    Column.prototype.predict = function (exp) {
      var rules = this.grammar.byName[exp] || [];

      for (var i = 0; i < rules.length; i++) {
        var r = rules[i];
        var wantedBy = this.wants[exp];
        var s = new State(r, 0, this.index, wantedBy);
        this.states.push(s);
      }
    };

    Column.prototype.complete = function (left, right) {
      var copy = left.nextState(right);
      this.states.push(copy);
    };

    function Grammar(rules, start) {
      this.rules = rules;
      this.start = start || this.rules[0].name;
      var byName = this.byName = {};
      this.rules.forEach(function (rule) {
        if (!byName.hasOwnProperty(rule.name)) {
          byName[rule.name] = [];
        }

        byName[rule.name].push(rule);
      });
    } // So we can allow passing (rules, start) directly to Parser for backwards compatibility


    Grammar.fromCompiled = function (rules, start) {
      var lexer = rules.Lexer;

      if (rules.ParserStart) {
        start = rules.ParserStart;
        rules = rules.ParserRules;
      }

      var rules = rules.map(function (r) {
        return new Rule(r.name, r.symbols, r.postprocess);
      });
      var g = new Grammar(rules, start);
      g.lexer = lexer; // nb. storing lexer on Grammar is iffy, but unavoidable

      return g;
    };

    function StreamLexer() {
      this.reset("");
    }

    StreamLexer.prototype.reset = function (data, state) {
      this.buffer = data;
      this.index = 0;
      this.line = state ? state.line : 1;
      this.lastLineBreak = state ? -state.col : 0;
    };

    StreamLexer.prototype.next = function () {
      if (this.index < this.buffer.length) {
        var ch = this.buffer[this.index++];

        if (ch === '\n') {
          this.line += 1;
          this.lastLineBreak = this.index;
        }

        return {
          value: ch
        };
      }
    };

    StreamLexer.prototype.save = function () {
      return {
        line: this.line,
        col: this.index - this.lastLineBreak
      };
    };

    StreamLexer.prototype.formatError = function (token, message) {
      // nb. this gets called after consuming the offending token,
      // so the culprit is index-1
      var buffer = this.buffer;

      if (typeof buffer === 'string') {
        var nextLineBreak = buffer.indexOf('\n', this.index);
        if (nextLineBreak === -1) nextLineBreak = buffer.length;
        var line = buffer.substring(this.lastLineBreak, nextLineBreak);
        var col = this.index - this.lastLineBreak;
        message += " at line " + this.line + " col " + col + ":\n\n";
        message += "  " + line + "\n";
        message += "  " + Array(col).join(" ") + "^";
        return message;
      } else {
        return message + " at index " + (this.index - 1);
      }
    };

    function Parser(rules, start, options) {
      if (rules instanceof Grammar) {
        var grammar = rules;
        var options = start;
      } else {
        var grammar = Grammar.fromCompiled(rules, start);
      }

      this.grammar = grammar; // Read options

      this.options = {
        keepHistory: false,
        lexer: grammar.lexer || new StreamLexer()
      };

      for (var key in options || {}) {
        this.options[key] = options[key];
      } // Setup lexer


      this.lexer = this.options.lexer;
      this.lexerState = undefined; // Setup a table

      var column = new Column(grammar, 0);
      var table = this.table = [column]; // I could be expecting anything.

      column.wants[grammar.start] = [];
      column.predict(grammar.start); // TODO what if start rule is nullable?

      column.process();
      this.current = 0; // token index
    } // create a reserved token for indicating a parse fail


    Parser.fail = {};

    Parser.prototype.feed = function (chunk) {
      var lexer = this.lexer;
      lexer.reset(chunk, this.lexerState);
      var token;

      while (token = lexer.next()) {
        // We add new states to table[current+1]
        var column = this.table[this.current]; // GC unused states

        if (!this.options.keepHistory) {
          delete this.table[this.current - 1];
        }

        var n = this.current + 1;
        var nextColumn = new Column(this.grammar, n);
        this.table.push(nextColumn); // Advance all tokens that expect the symbol

        var literal = token.text !== undefined ? token.text : token.value;
        var value = lexer.constructor === StreamLexer ? token.value : token;
        var scannable = column.scannable;

        for (var w = scannable.length; w--;) {
          var state = scannable[w];
          var expect = state.rule.symbols[state.dot]; // Try to consume the token
          // either regex or literal

          if (expect.test ? expect.test(value) : expect.type ? expect.type === token.type : expect.literal === literal) {
            // Add it
            var next = state.nextState({
              data: value,
              token: token,
              isToken: true,
              reference: n - 1
            });
            nextColumn.states.push(next);
          }
        } // Next, for each of the rules, we either
        // (a) complete it, and try to see if the reference row expected that
        //     rule
        // (b) predict the next nonterminal it expects by adding that
        //     nonterminal's start state
        // To prevent duplication, we also keep track of rules we have already
        // added


        nextColumn.process(); // If needed, throw an error:

        if (nextColumn.states.length === 0) {
          // No states at all! This is not good.
          var message = this.lexer.formatError(token, "invalid syntax") + "\n";
          message += "Unexpected " + (token.type ? token.type + " token: " : "");
          message += JSON.stringify(token.value !== undefined ? token.value : token) + "\n";
          var err = new Error(message);
          err.offset = this.current;
          err.token = token;
          throw err;
        } // maybe save lexer state


        if (this.options.keepHistory) {
          column.lexerState = lexer.save();
        }

        this.current++;
      }

      if (column) {
        this.lexerState = lexer.save();
      } // Incrementally keep track of results


      this.results = this.finish(); // Allow chaining, for whatever it's worth

      return this;
    };

    Parser.prototype.save = function () {
      var column = this.table[this.current];
      column.lexerState = this.lexerState;
      return column;
    };

    Parser.prototype.restore = function (column) {
      var index = column.index;
      this.current = index;
      this.table[index] = column;
      this.table.splice(index + 1);
      this.lexerState = column.lexerState; // Incrementally keep track of results

      this.results = this.finish();
    }; // nb. deprecated: use save/restore instead!


    Parser.prototype.rewind = function (index) {
      if (!this.options.keepHistory) {
        throw new Error('set option `keepHistory` to enable rewinding');
      } // nb. recall column (table) indicies fall between token indicies.
      //        col 0   --   token 0   --   col 1


      this.restore(this.table[index]);
    };

    Parser.prototype.finish = function () {
      // Return the possible parsings
      var considerations = [];
      var start = this.grammar.start;
      var column = this.table[this.table.length - 1];
      column.states.forEach(function (t) {
        if (t.rule.name === start && t.dot === t.rule.symbols.length && t.reference === 0 && t.data !== Parser.fail) {
          considerations.push(t);
        }
      });
      return considerations.map(function (c) {
        return c.data;
      });
    };

    return {
      Parser: Parser,
      Grammar: Grammar,
      Rule: Rule
    };
  });
});

var grammar = createCommonjsModule(function (module) {
  // Generated automatically by nearley, version 2.16.0
  // http://github.com/Hardmath123/nearley
  (function () {
    function id(x) {
      return x[0];
    }

    var grammar = {
      Lexer: undefined,
      ParserRules: [{
        "name": "main",
        "symbols": ["_", "AS", "_"],
        "postprocess": function postprocess(ts) {
          return ts[1];
        }
      }, {
        "name": "P",
        "symbols": [{
          "literal": "("
        }, "_", "AS", "_", {
          "literal": ")"
        }],
        "postprocess": function postprocess(ts) {
          return ts.filter(function (x) {
            return !!x;
          });
        }
      }, {
        "name": "P",
        "symbols": ["SUBSET"],
        "postprocess": id
      }, {
        "name": "M",
        "symbols": ["M", "_", {
          "literal": "∩"
        }, "_", "P"],
        "postprocess": function postprocess(ts) {
          return ts.filter(function (x) {
            return !!x;
          });
        }
      }, {
        "name": "M",
        "symbols": ["P"],
        "postprocess": id
      }, {
        "name": "AS",
        "symbols": ["AS", "_", {
          "literal": "+"
        }, "_", "M"],
        "postprocess": function postprocess(ts) {
          return ts.filter(function (x) {
            return !!x;
          });
        }
      }, {
        "name": "AS",
        "symbols": ["AS", "_", {
          "literal": "∪"
        }, "_", "M"],
        "postprocess": function postprocess(ts) {
          return ts.filter(function (x) {
            return !!x;
          });
        }
      }, {
        "name": "AS",
        "symbols": ["AS", "_", {
          "literal": "-"
        }, "_", "M"],
        "postprocess": function postprocess(ts) {
          return ts.filter(function (x) {
            return !!x;
          });
        }
      }, {
        "name": "AS",
        "symbols": ["M"],
        "postprocess": id
      }, {
        "name": "SUBSET",
        "symbols": ["RD"],
        "postprocess": id
      }, {
        "name": "SUBSET",
        "symbols": ["FI"],
        "postprocess": id
      }, {
        "name": "SUBSET",
        "symbols": ["RDFI"],
        "postprocess": id
      }, {
        "name": "SUBSET",
        "symbols": ["CHAPITRE"],
        "postprocess": id
      }, {
        "name": "SUBSET",
        "symbols": ["COMPTE"],
        "postprocess": id
      }, {
        "name": "SUBSET",
        "symbols": ["FONCTION"],
        "postprocess": id
      }, {
        "name": "SUBSET",
        "symbols": ["ANNEE"],
        "postprocess": id
      }, {
        "name": "RD",
        "symbols": [{
          "literal": "R"
        }],
        "postprocess": id
      }, {
        "name": "RD",
        "symbols": [{
          "literal": "D"
        }],
        "postprocess": id
      }, {
        "name": "FI",
        "symbols": [{
          "literal": "F"
        }],
        "postprocess": id
      }, {
        "name": "FI",
        "symbols": [{
          "literal": "I"
        }],
        "postprocess": id
      }, {
        "name": "RDFI",
        "symbols": ["RD", "FI"],
        "postprocess": function postprocess(ts) {
          return ts.join('');
        }
      }, {
        "name": "CHAPITRE$string$1",
        "symbols": [{
          "literal": "C"
        }, {
          "literal": "h"
        }],
        "postprocess": function joiner(d) {
          return d.join('');
        }
      }, {
        "name": "CHAPITRE$ebnf$1",
        "symbols": [/[0-9]/]
      }, {
        "name": "CHAPITRE$ebnf$1",
        "symbols": ["CHAPITRE$ebnf$1", /[0-9]/],
        "postprocess": function arrpush(d) {
          return d[0].concat([d[1]]);
        }
      }, {
        "name": "CHAPITRE",
        "symbols": ["CHAPITRE$string$1", "CHAPITRE$ebnf$1"],
        "postprocess": function postprocess(ts) {
          return ts[0] + ts[1].join('');
        }
      }, {
        "name": "COMPTE$ebnf$1",
        "symbols": [/[0-9]/]
      }, {
        "name": "COMPTE$ebnf$1",
        "symbols": ["COMPTE$ebnf$1", /[0-9]/],
        "postprocess": function arrpush(d) {
          return d[0].concat([d[1]]);
        }
      }, {
        "name": "COMPTE",
        "symbols": [{
          "literal": "C"
        }, "COMPTE$ebnf$1"],
        "postprocess": function postprocess(ts) {
          return ts[0] + ts[1].join('');
        }
      }, {
        "name": "FONCTION$ebnf$1",
        "symbols": [/[0-9]/]
      }, {
        "name": "FONCTION$ebnf$1",
        "symbols": ["FONCTION$ebnf$1", /[0-9]/],
        "postprocess": function arrpush(d) {
          return d[0].concat([d[1]]);
        }
      }, {
        "name": "FONCTION",
        "symbols": [{
          "literal": "F"
        }, "FONCTION$ebnf$1"],
        "postprocess": function postprocess(ts) {
          return ts[0] + ts[1].join('');
        }
      }, {
        "name": "ANNEE$string$1",
        "symbols": [{
          "literal": "A"
        }, {
          "literal": "n"
        }, {
          "literal": "n"
        }],
        "postprocess": function joiner(d) {
          return d.join('');
        }
      }, {
        "name": "ANNEE$ebnf$1",
        "symbols": [/[0-9]/]
      }, {
        "name": "ANNEE$ebnf$1",
        "symbols": ["ANNEE$ebnf$1", /[0-9]/],
        "postprocess": function arrpush(d) {
          return d[0].concat([d[1]]);
        }
      }, {
        "name": "ANNEE",
        "symbols": ["ANNEE$string$1", "ANNEE$ebnf$1"],
        "postprocess": function postprocess(ts) {
          return ts[0] + ts[1].join('');
        }
      }, {
        "name": "_$ebnf$1",
        "symbols": []
      }, {
        "name": "_$ebnf$1",
        "symbols": ["_$ebnf$1", /[\s]/],
        "postprocess": function arrpush(d) {
          return d[0].concat([d[1]]);
        }
      }, {
        "name": "_",
        "symbols": ["_$ebnf$1"],
        "postprocess": function postprocess() {
          return null;
        }
      }],
      ParserStart: "main"
    };

    {
      module.exports = grammar;
    }
  })();
});

function matchesSimple(r, planDeCompte, subset) {
  switch (subset) {
    case 'R':
    case 'D':
      return r['CodRD'] === subset;

    case 'F':
    case 'I':
      return planDeCompte.ligneBudgetFI(r) === subset;

    case 'RF':
    case 'RI':
    case 'DF':
    case 'DI':
      return r['CodRD'] === subset[0] && planDeCompte.ligneBudgetFI(r) === subset[1];
  }

  if (subset.startsWith('Ch')) return planDeCompte.ligneBudgetIsInChapitre(r, subset.slice('Ch'.length));
  if (subset.startsWith('C')) return planDeCompte.ligneBudgetIsInCompte(r, subset.slice('C'.length));
  if (subset.startsWith('F')) return planDeCompte.ligneBudgetIsInFonction(r, subset.slice('F'.length));
  if (subset.startsWith('Ann')) return subset.slice('Ann'.length) === String(planDeCompte.Exer);
  console.warn('matchesSubset - Unhandled case', subset);
}

function matchesComplex(r, planDeCompte, combo) {
  if (typeof combo === 'string') return matchesSimple(r, planDeCompte, combo); // assert(Array.isArray(combo))

  var _combo = _slicedToArray(combo, 3),
      left = _combo[0],
      middle = _combo[1],
      right = _combo[2];

  if (left === '(' && right === ')') return matchesComplex(r, planDeCompte, middle);else {
    var operator = middle;

    switch (operator) {
      case '+':
      case '∪':
        return matchesComplex(r, planDeCompte, left) || matchesComplex(r, planDeCompte, right);

      case '∩':
        return matchesComplex(r, planDeCompte, left) && matchesComplex(r, planDeCompte, right);

      case '-':
        return matchesComplex(r, planDeCompte, left) && !matchesComplex(r, planDeCompte, right);

      default:
        console.warn('matchesSubset - Unhandled case', operator, combo);
    }
  }
  console.warn('matchesSubset - Unhandled case', combo);
}

var returnFalseFunction = Object.freeze(function () {
  return false;
});
/*
    returns a function that can be used in the context of a documentBudgetaire.rows.filter()
*/

var makeLigneBudgetFilterFromFormula = memoize$1(function makeLigneBudgetFilterFromFormula(formula, planDeCompte) {
  var parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

  try {
    parser.feed(formula);
    if (parser.results[0] === undefined) return returnFalseFunction;else return memoize$1(function (budgetRow) {
      return matchesComplex(budgetRow, planDeCompte, parser.results[0]);
    });
  } catch (e) {
    return returnFalseFunction;
  }
});

var makeAggregateFunction = memoize$1(function makeAggregateFunction(aggregationDescription, planDeCompte) {
  var aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode = memoize$1(function (aggregationDescriptionNode, documentBudgetaire, planDeCompte) {
    var id = aggregationDescriptionNode.id,
        name = aggregationDescriptionNode.name,
        children = aggregationDescriptionNode.children,
        formula = aggregationDescriptionNode.formula;
    return children ? // non-leaf
    {
      id: id,
      name: name,
      children: Object.values(children).map(function (n) {
        return aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode(n, documentBudgetaire, planDeCompte);
      })
    } : // leaf, has .formula
    {
      id: id,
      name: name,
      elements: new Set(_toConsumableArray(documentBudgetaire.rows).filter(makeLigneBudgetFilterFromFormula(formula, planDeCompte)))
    };
  });
  return memoize$1(function aggregate(docBudg) {
    return aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode(aggregationDescription, docBudg, planDeCompte);
  });
});

/*

    An AggregationDescription is a tree-shaped data structure that describes an aggregation
    The leaves contain a "formula" which acts like a filter on a DocumentBudgetaire

interface AggregationDescription extends AggregationDescriptionNode, Readonly<{
    children: Map<id, AggregationDescription | AggregationDescriptionLeaf>
}>{}

interface AggregationDescriptionNode extends Readonly<{
    id: string,
    label: string
}>{}

interface AggregationDescriptionLeaf extends AggregationDescriptionNode, Readonly<{
    formula: string
}>{}

*/

function AggregationDescriptionToJSON(aggregationDescription) {
  var id = aggregationDescription.id,
      name = aggregationDescription.name,
      formula = aggregationDescription.formula,
      children = aggregationDescription.children;
  return children ? {
    id: id,
    name: name,
    children: Object.values(children).map(AggregationDescriptionToJSON)
  } : {
    id: id,
    name: name,
    formula: formula
  };
}
function AggregationDescriptionFromJSON(aggregationDescriptionJSON) {
  var id = aggregationDescriptionJSON.id,
      name = aggregationDescriptionJSON.name,
      formula = aggregationDescriptionJSON.formula,
      children = aggregationDescriptionJSON.children;
  return children ? {
    id: id,
    name: name,
    children: Object.fromEntries(children.map(function (c) {
      return [c.id, AggregationDescriptionFromJSON(c)];
    }))
  } : {
    id: id,
    name: name,
    formula: formula
  };
}
/*
    An AggregatedDocumentBudgetaire is the result of an AggregationDescription applied to a DocumentBudgetaire
    It's a tree-shaped data structures that mirrors the AggregationDescription structure

interface AggregatedDocumentBudgetaire extends AggregationDocumentBudgetaireNode, Readonly<{
    children: OrderedSet<AggregatedDocumentBudgetaire | AggregatedDocumentBudgetaireLeaf>
}>{}

interface AggregationDocumentBudgetaireNode extends Readonly<{
    id: string,
    label: string
}>{}

interface AggregatedDocumentBudgetaireLeaf extends AggregationDocumentBudgetaireNode, Readonly<{
    elements: Set<LigneBudget>
}>{}



interface AggregateMaker {
    (desc: AggregationDescription): 
        (doc: DocumentBudgetaire) => AggregatedDocumentBudgetaire;
}

*/

function getAggregatedDocumentBudgetaireLeaves(aggregatedDocumentBudgetaire) {
  return aggregatedDocumentBudgetaire.children ? Object.values(aggregatedDocumentBudgetaire.children).map(getAggregatedDocumentBudgetaireLeaves).flat() : aggregatedDocumentBudgetaire;
}
/*
    Function to compute the LigneBudget elements of a given node in the AggregatedDocumentBudgetaire tree
    by making the union of children, recursively
*/

function rawAggregatedDocumentBudgetaireNodeElements(node) {
  if (!node.children) return node.elements;else {
    var union = new Set();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = node.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var child = _step.value;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = aggregatedDocumentBudgetaireNodeElements(child)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var el = _step2.value;
            union.add(el);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return union;
  }
}

var aggregatedDocumentBudgetaireNodeElements = memoize$1(rawAggregatedDocumentBudgetaireNodeElements);
/*
    Function to compute the LigneBudget elements total of a given node in the AggregatedDocumentBudgetaire tree
*/

function rawAggregatedDocumentBudgetaireNodeTotal(node) {
  // [...arr] is carefully placed so the result stops being a Set *before* the .map
  // if the .map was done before the [...arr], similar amounts would be counted only once leading
  // to an incorrect sum
  return sum(_toConsumableArray(aggregatedDocumentBudgetaireNodeElements(node)).map(function (row) {
    return row['MtReal'];
  }));
}

var aggregatedDocumentBudgetaireNodeTotal = memoize$1(rawAggregatedDocumentBudgetaireNodeTotal);

function makeUnusedLigneBudgetSet(documentBudgetaire, aggregatedDocumentBudgetaire) {
  var leaves = getAggregatedDocumentBudgetaireLeaves(aggregatedDocumentBudgetaire);
  var usedLigneBudgets = new Set();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = leaves[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var leaf = _step.value;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = leaf.elements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var lb = _step2.value;
          usedLigneBudgets.add(lb);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return _toConsumableArray(documentBudgetaire.rows).filter(function (ligneBudget) {
    return !usedLigneBudgets.has(ligneBudget);
  });
}

function makeUsedMoreThanOnceLigneBudgetSet(documentBudgetaire, aggregatedDocumentBudgetaire) {
  var leaves = getAggregatedDocumentBudgetaireLeaves(aggregatedDocumentBudgetaire);
  var aggregationSetsByRow = new Map();
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = documentBudgetaire.rows[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var ligneBudget = _step3.value;
      var aggregationSets = [];
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = leaves[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var aggLeaf = _step4.value;

          if (aggLeaf.elements.has(ligneBudget)) {
            aggregationSets.push(aggLeaf);
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      if (aggregationSets.length >= 2) {
        aggregationSetsByRow.set(ligneBudget, aggregationSets);
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return _toConsumableArray(aggregationSetsByRow.entries()).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        row = _ref2[0],
        aggregationSets = _ref2[1];

    return {
      row: row,
      aggregationSets: aggregationSets
    };
  });
}

var AggregationAnalysis =
/*#__PURE__*/
function (_Component) {
  _inherits(AggregationAnalysis, _Component);

  // heavily inspired of https://github.com/podefr/react-debounce-render/blob/master/src/index.js (MIT)
  function AggregationAnalysis(props) {
    var _this;

    _classCallCheck(this, AggregationAnalysis);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AggregationAnalysis).call(this, props));
    _this.updateDebounced = debounce(_this.forceUpdate, 1000);
    return _this;
  }

  _createClass(AggregationAnalysis, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate() {
      this.updateDebounced();
      return false;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.updateDebounced.cancel();
    }
  }, {
    key: "render",
    value: function render(_ref3) {
      var aggregationDescription = _ref3.aggregationDescription,
          documentBudgetairesWithPlanDeCompte = _ref3.documentBudgetairesWithPlanDeCompte;

      if (documentBudgetairesWithPlanDeCompte.length === 0) {
        return undefined;
      }

      var analyzedDocBudgs = documentBudgetairesWithPlanDeCompte.map(function (_ref4) {
        var documentBudgetaire = _ref4.documentBudgetaire,
            planDeCompte = _ref4.planDeCompte;
        var aggregated = makeAggregateFunction(aggregationDescription, planDeCompte)(documentBudgetaire);
        return {
          documentBudgetaire: documentBudgetaire,
          planDeCompte: planDeCompte,
          unusedRows: makeUnusedLigneBudgetSet(documentBudgetaire, aggregated),
          rowsUsedMoreThanOnce: makeUsedMoreThanOnceLigneBudgetSet(documentBudgetaire, aggregated)
        };
      });
      return h("section", {
        class: "analysis"
      }, h("h1", null, "Analyse"), analyzedDocBudgs.map(function (_ref5) {
        var documentBudgetaire = _ref5.documentBudgetaire;
        return h("p", null, "Il y a ", documentBudgetaire && documentBudgetaire.rows.size, " lignes dans le document budgetaire ", documentBudgetaire["LibelleColl"], " - ", h("strong", null, documentBudgetaire["Exer"]));
      }), h("h2", null, "Lignes non-utilis\xE9es"), analyzedDocBudgs.map(function (_ref6) {
        var documentBudgetaire = _ref6.documentBudgetaire,
            planDeCompte = _ref6.planDeCompte,
            unusedRows = _ref6.unusedRows;
        return h("details", null, h("summary", null, h("h3", null, documentBudgetaire["LibelleColl"], " - ", h("strong", null, documentBudgetaire["Exer"]), " (", unusedRows.length, ")")), h("table", null, unusedRows.map(function (row) {
          return h("tr", null, h("td", null, row["CodRD"], planDeCompte.ligneBudgetFI(row)), h("td", null, "F", row["Fonction"]), h("td", null, "Ch", planDeCompte.ligneBudgetChapitre(row)), h("td", null, "C", row["Nature"]), h("td", {
            class: "money-amount"
          }, row["MtReal"].toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          })));
        })));
      }), h("h2", null, "Lignes utilis\xE9es plus qu'une fois"), analyzedDocBudgs.map(function (_ref7) {
        var documentBudgetaire = _ref7.documentBudgetaire,
            planDeCompte = _ref7.planDeCompte,
            rowsUsedMoreThanOnce = _ref7.rowsUsedMoreThanOnce;
        return h("details", null, h("summary", null, h("h3", null, documentBudgetaire["LibelleColl"], " - ", h("strong", null, documentBudgetaire["Exer"]), " (", rowsUsedMoreThanOnce.length, ")")), h("table", null, rowsUsedMoreThanOnce.map(function (_ref8) {
          var row = _ref8.row,
              aggregationSets = _ref8.aggregationSets;
          return h("tr", null, h("td", null, row["CodRD"], planDeCompte.ligneBudgetFI(row), " F", row["Fonction"], " Ch", planDeCompte.ligneBudgetChapitre(row), " C", row["Nature"]), h("td", null, aggregationSets.map(function (_ref9) {
            var name = _ref9.name;
            return name;
          }).join(' & ')));
        })));
      }));
    }
  }]);

  return AggregationAnalysis;
}(Component);

var obj;
var NOTHING = typeof Symbol !== "undefined" ? Symbol("immer-nothing") : (obj = {}, obj["immer-nothing"] = true, obj);
var DRAFTABLE = typeof Symbol !== "undefined" && Symbol.for ? Symbol.for("immer-draftable") : "__$immer_draftable";
var DRAFT_STATE = typeof Symbol !== "undefined" && Symbol.for ? Symbol.for("immer-state") : "__$immer_state";

function isDraft(value) {
  return !!value && !!value[DRAFT_STATE];
}

function isDraftable(value) {
  if (!value || typeof value !== "object") {
    return false;
  }

  if (Array.isArray(value)) {
    return true;
  }

  var proto = Object.getPrototypeOf(value);

  if (!proto || proto === Object.prototype) {
    return true;
  }

  return !!value[DRAFTABLE] || !!value.constructor[DRAFTABLE];
}

var assign = Object.assign || function assign(target, value) {
  for (var key in value) {
    if (has(value, key)) {
      target[key] = value[key];
    }
  }

  return target;
};

var ownKeys = typeof Reflect !== "undefined" && Reflect.ownKeys ? Reflect.ownKeys : typeof Object.getOwnPropertySymbols !== "undefined" ? function (obj) {
  return Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));
} : Object.getOwnPropertyNames;

function shallowCopy(base, invokeGetters) {
  if (invokeGetters === void 0) invokeGetters = false;

  if (Array.isArray(base)) {
    return base.slice();
  }

  var clone = Object.create(Object.getPrototypeOf(base));
  ownKeys(base).forEach(function (key) {
    if (key === DRAFT_STATE) {
      return; // Never copy over draft state.
    }

    var desc = Object.getOwnPropertyDescriptor(base, key);
    var value = desc.value;

    if (desc.get) {
      if (!invokeGetters) {
        throw new Error("Immer drafts cannot have computed properties");
      }

      value = desc.get.call(base);
    }

    if (desc.enumerable) {
      clone[key] = value;
    } else {
      Object.defineProperty(clone, key, {
        value: value,
        writable: true,
        configurable: true
      });
    }
  });
  return clone;
}

function each(value, cb) {
  if (Array.isArray(value)) {
    for (var i = 0; i < value.length; i++) {
      cb(i, value[i], value);
    }
  } else {
    ownKeys(value).forEach(function (key) {
      return cb(key, value[key], value);
    });
  }
}

function isEnumerable(base, prop) {
  var desc = Object.getOwnPropertyDescriptor(base, prop);
  return !!desc && desc.enumerable;
}

function has(thing, prop) {
  return Object.prototype.hasOwnProperty.call(thing, prop);
}

function is(x, y) {
  // From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}
/** Each scope represents a `produce` call. */


var ImmerScope = function ImmerScope(parent) {
  this.drafts = [];
  this.parent = parent; // Whenever the modified draft contains a draft from another scope, we
  // need to prevent auto-freezing so the unowned draft can be finalized.

  this.canAutoFreeze = true; // To avoid prototype lookups:

  this.patches = null;
};

ImmerScope.prototype.usePatches = function usePatches(patchListener) {
  if (patchListener) {
    this.patches = [];
    this.inversePatches = [];
    this.patchListener = patchListener;
  }
};

ImmerScope.prototype.revoke = function revoke$1() {
  this.leave();
  this.drafts.forEach(revoke);
  this.drafts = null; // Make draft-related methods throw.
};

ImmerScope.prototype.leave = function leave() {
  if (this === ImmerScope.current) {
    ImmerScope.current = this.parent;
  }
};

ImmerScope.current = null;

ImmerScope.enter = function () {
  return this.current = new ImmerScope(this.current);
};

function revoke(draft) {
  draft[DRAFT_STATE].revoke();
} // but share them all instead


var descriptors = {};

function willFinalize(scope, result, isReplaced) {
  scope.drafts.forEach(function (draft) {
    draft[DRAFT_STATE].finalizing = true;
  });

  if (!isReplaced) {
    if (scope.patches) {
      markChangesRecursively(scope.drafts[0]);
    } // This is faster when we don't care about which attributes changed.


    markChangesSweep(scope.drafts);
  } // When a child draft is returned, look for changes.
  else if (isDraft(result) && result[DRAFT_STATE].scope === scope) {
      markChangesSweep(scope.drafts);
    }
}

function createProxy(base, parent) {
  var isArray = Array.isArray(base);
  var draft = clonePotentialDraft(base);
  each(draft, function (prop) {
    proxyProperty(draft, prop, isArray || isEnumerable(base, prop));
  }); // See "proxy.js" for property documentation.

  var scope = parent ? parent.scope : ImmerScope.current;
  var state = {
    scope: scope,
    modified: false,
    finalizing: false,
    // es5 only
    finalized: false,
    assigned: {},
    parent: parent,
    base: base,
    draft: draft,
    copy: null,
    revoke: revoke$1,
    revoked: false // es5 only

  };
  createHiddenProperty(draft, DRAFT_STATE, state);
  scope.drafts.push(draft);
  return draft;
}

function revoke$1() {
  this.revoked = true;
}

function source(state) {
  return state.copy || state.base;
} // Access a property without creating an Immer draft.


function peek(draft, prop) {
  var state = draft[DRAFT_STATE];

  if (state && !state.finalizing) {
    state.finalizing = true;
    var value = draft[prop];
    state.finalizing = false;
    return value;
  }

  return draft[prop];
}

function get(state, prop) {
  assertUnrevoked(state);
  var value = peek(source(state), prop);

  if (state.finalizing) {
    return value;
  } // Create a draft if the value is unmodified.


  if (value === peek(state.base, prop) && isDraftable(value)) {
    prepareCopy(state);
    return state.copy[prop] = createProxy(value, state);
  }

  return value;
}

function set(state, prop, value) {
  assertUnrevoked(state);
  state.assigned[prop] = true;

  if (!state.modified) {
    if (is(value, peek(source(state), prop))) {
      return;
    }

    markChanged(state);
    prepareCopy(state);
  }

  state.copy[prop] = value;
}

function markChanged(state) {
  if (!state.modified) {
    state.modified = true;

    if (state.parent) {
      markChanged(state.parent);
    }
  }
}

function prepareCopy(state) {
  if (!state.copy) {
    state.copy = clonePotentialDraft(state.base);
  }
}

function clonePotentialDraft(base) {
  var state = base && base[DRAFT_STATE];

  if (state) {
    state.finalizing = true;
    var draft = shallowCopy(state.draft, true);
    state.finalizing = false;
    return draft;
  }

  return shallowCopy(base);
}

function proxyProperty(draft, prop, enumerable) {
  var desc = descriptors[prop];

  if (desc) {
    desc.enumerable = enumerable;
  } else {
    descriptors[prop] = desc = {
      configurable: true,
      enumerable: enumerable,
      get: function get$1() {
        return get(this[DRAFT_STATE], prop);
      },
      set: function set$1(value) {
        set(this[DRAFT_STATE], prop, value);
      }
    };
  }

  Object.defineProperty(draft, prop, desc);
}

function assertUnrevoked(state) {
  if (state.revoked === true) {
    throw new Error("Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + JSON.stringify(source(state)));
  }
} // This looks expensive, but only proxies are visited, and only objects without known changes are scanned.


function markChangesSweep(drafts) {
  // The natural order of drafts in the `scope` array is based on when they
  // were accessed. By processing drafts in reverse natural order, we have a
  // better chance of processing leaf nodes first. When a leaf node is known to
  // have changed, we can avoid any traversal of its ancestor nodes.
  for (var i = drafts.length - 1; i >= 0; i--) {
    var state = drafts[i][DRAFT_STATE];

    if (!state.modified) {
      if (Array.isArray(state.base)) {
        if (hasArrayChanges(state)) {
          markChanged(state);
        }
      } else if (hasObjectChanges(state)) {
        markChanged(state);
      }
    }
  }
}

function markChangesRecursively(object) {
  if (!object || typeof object !== "object") {
    return;
  }

  var state = object[DRAFT_STATE];

  if (!state) {
    return;
  }

  var base = state.base;
  var draft = state.draft;
  var assigned = state.assigned;

  if (!Array.isArray(object)) {
    // Look for added keys.
    Object.keys(draft).forEach(function (key) {
      // The `undefined` check is a fast path for pre-existing keys.
      if (base[key] === undefined && !has(base, key)) {
        assigned[key] = true;
        markChanged(state);
      } else if (!assigned[key]) {
        // Only untouched properties trigger recursion.
        markChangesRecursively(draft[key]);
      }
    }); // Look for removed keys.

    Object.keys(base).forEach(function (key) {
      // The `undefined` check is a fast path for pre-existing keys.
      if (draft[key] === undefined && !has(draft, key)) {
        assigned[key] = false;
        markChanged(state);
      }
    });
  } else if (hasArrayChanges(state)) {
    markChanged(state);
    assigned.length = true;

    if (draft.length < base.length) {
      for (var i = draft.length; i < base.length; i++) {
        assigned[i] = false;
      }
    } else {
      for (var i$1 = base.length; i$1 < draft.length; i$1++) {
        assigned[i$1] = true;
      }
    }

    for (var i$2 = 0; i$2 < draft.length; i$2++) {
      // Only untouched indices trigger recursion.
      if (assigned[i$2] === undefined) {
        markChangesRecursively(draft[i$2]);
      }
    }
  }
}

function hasObjectChanges(state) {
  var base = state.base;
  var draft = state.draft; // Search for added keys and changed keys. Start at the back, because
  // non-numeric keys are ordered by time of definition on the object.

  var keys = Object.keys(draft);

  for (var i = keys.length - 1; i >= 0; i--) {
    var key = keys[i];
    var baseValue = base[key]; // The `undefined` check is a fast path for pre-existing keys.

    if (baseValue === undefined && !has(base, key)) {
      return true;
    } // Once a base key is deleted, future changes go undetected, because its
    // descriptor is erased. This branch detects any missed changes.
    else {
        var value = draft[key];
        var state$1 = value && value[DRAFT_STATE];

        if (state$1 ? state$1.base !== baseValue : !is(value, baseValue)) {
          return true;
        }
      }
  } // At this point, no keys were added or changed.
  // Compare key count to determine if keys were deleted.


  return keys.length !== Object.keys(base).length;
}

function hasArrayChanges(state) {
  var draft = state.draft;

  if (draft.length !== state.base.length) {
    return true;
  } // See #116
  // If we first shorten the length, our array interceptors will be removed.
  // If after that new items are added, result in the same original length,
  // those last items will have no intercepting property.
  // So if there is no own descriptor on the last position, we know that items were removed and added
  // N.B.: splice, unshift, etc only shift values around, but not prop descriptors, so we only have to check
  // the last one


  var descriptor = Object.getOwnPropertyDescriptor(draft, draft.length - 1); // descriptor can be null, but only for newly created sparse arrays, eg. new Array(10)

  if (descriptor && !descriptor.get) {
    return true;
  } // For all other cases, we don't have to compare, as they would have been picked up by the index setters


  return false;
}

function createHiddenProperty(target, prop, value) {
  Object.defineProperty(target, prop, {
    value: value,
    enumerable: false,
    writable: true
  });
}

var legacyProxy =
/*#__PURE__*/
Object.freeze({
  willFinalize: willFinalize,
  createProxy: createProxy
});

function willFinalize$1() {}

function createProxy$1(base, parent) {
  var scope = parent ? parent.scope : ImmerScope.current;
  var state = {
    // Track which produce call this is associated with.
    scope: scope,
    // True for both shallow and deep changes.
    modified: false,
    // Used during finalization.
    finalized: false,
    // Track which properties have been assigned (true) or deleted (false).
    assigned: {},
    // The parent draft state.
    parent: parent,
    // The base state.
    base: base,
    // The base proxy.
    draft: null,
    // Any property proxies.
    drafts: {},
    // The base copy with any updated values.
    copy: null,
    // Called by the `produce` function.
    revoke: null
  };
  var ref = Array.isArray(base) ? // [state] is used for arrays, to make sure the proxy is array-ish and not violate invariants,
  // although state itself is an object
  Proxy.revocable([state], arrayTraps) : Proxy.revocable(state, objectTraps);
  var revoke = ref.revoke;
  var proxy = ref.proxy;
  state.draft = proxy;
  state.revoke = revoke;
  scope.drafts.push(proxy);
  return proxy;
}

var objectTraps = {
  get: get$1,
  has: function has(target, prop) {
    return prop in source$1(target);
  },
  ownKeys: function ownKeys(target) {
    return Reflect.ownKeys(source$1(target));
  },
  set: set$1,
  deleteProperty: deleteProperty,
  getOwnPropertyDescriptor: getOwnPropertyDescriptor,
  defineProperty: function defineProperty() {
    throw new Error("Object.defineProperty() cannot be used on an Immer draft"); // prettier-ignore
  },
  getPrototypeOf: function getPrototypeOf(target) {
    return Object.getPrototypeOf(target.base);
  },
  setPrototypeOf: function setPrototypeOf() {
    throw new Error("Object.setPrototypeOf() cannot be used on an Immer draft"); // prettier-ignore
  }
};
var arrayTraps = {};
each(objectTraps, function (key, fn) {
  arrayTraps[key] = function () {
    arguments[0] = arguments[0][0];
    return fn.apply(this, arguments);
  };
});

arrayTraps.deleteProperty = function (state, prop) {
  if (isNaN(parseInt(prop))) {
    throw new Error("Immer only supports deleting array indices"); // prettier-ignore
  }

  return objectTraps.deleteProperty.call(this, state[0], prop);
};

arrayTraps.set = function (state, prop, value) {
  if (prop !== "length" && isNaN(parseInt(prop))) {
    throw new Error("Immer only supports setting array indices and the 'length' property"); // prettier-ignore
  }

  return objectTraps.set.call(this, state[0], prop, value);
}; // returns the object we should be reading the current value from, which is base, until some change has been made


function source$1(state) {
  return state.copy || state.base;
} // Access a property without creating an Immer draft.


function peek$1(draft, prop) {
  var state = draft[DRAFT_STATE];
  var desc = Reflect.getOwnPropertyDescriptor(state ? source$1(state) : draft, prop);
  return desc && desc.value;
}

function get$1(state, prop) {
  if (prop === DRAFT_STATE) {
    return state;
  }

  var drafts = state.drafts; // Check for existing draft in unmodified state.

  if (!state.modified && has(drafts, prop)) {
    return drafts[prop];
  }

  var value = source$1(state)[prop];

  if (state.finalized || !isDraftable(value)) {
    return value;
  } // Check for existing draft in modified state.


  if (state.modified) {
    // Assigned values are never drafted. This catches any drafts we created, too.
    if (value !== peek$1(state.base, prop)) {
      return value;
    } // Store drafts on the copy (when one exists).


    drafts = state.copy;
  }

  return drafts[prop] = createProxy$1(value, state);
}

function set$1(state, prop, value) {
  if (!state.modified) {
    var baseValue = peek$1(state.base, prop); // Optimize based on value's truthiness. Truthy values are guaranteed to
    // never be undefined, so we can avoid the `in` operator. Lastly, truthy
    // values may be drafts, but falsy values are never drafts.

    var isUnchanged = value ? is(baseValue, value) || value === state.drafts[prop] : is(baseValue, value) && prop in state.base;

    if (isUnchanged) {
      return true;
    }

    markChanged$1(state);
  }

  state.assigned[prop] = true;
  state.copy[prop] = value;
  return true;
}

function deleteProperty(state, prop) {
  // The `undefined` check is a fast path for pre-existing keys.
  if (peek$1(state.base, prop) !== undefined || prop in state.base) {
    state.assigned[prop] = false;
    markChanged$1(state);
  }

  if (state.copy) {
    delete state.copy[prop];
  }

  return true;
} // Note: We never coerce `desc.value` into an Immer draft, because we can't make
// the same guarantee in ES5 mode.


function getOwnPropertyDescriptor(state, prop) {
  var owner = source$1(state);
  var desc = Reflect.getOwnPropertyDescriptor(owner, prop);

  if (desc) {
    desc.writable = true;
    desc.configurable = !Array.isArray(owner) || prop !== "length";
  }

  return desc;
}

function markChanged$1(state) {
  if (!state.modified) {
    state.modified = true;
    state.copy = assign(shallowCopy(state.base), state.drafts);
    state.drafts = null;

    if (state.parent) {
      markChanged$1(state.parent);
    }
  }
}

var modernProxy =
/*#__PURE__*/
Object.freeze({
  willFinalize: willFinalize$1,
  createProxy: createProxy$1
});

function generatePatches(state, basePath, patches, inversePatches) {
  Array.isArray(state.base) ? generateArrayPatches(state, basePath, patches, inversePatches) : generateObjectPatches(state, basePath, patches, inversePatches);
}

function generateArrayPatches(state, basePath, patches, inversePatches) {
  var assign, assign$1;
  var base = state.base;
  var copy = state.copy;
  var assigned = state.assigned; // Reduce complexity by ensuring `base` is never longer.

  if (copy.length < base.length) {
    assign = [copy, base], base = assign[0], copy = assign[1];
    assign$1 = [inversePatches, patches], patches = assign$1[0], inversePatches = assign$1[1];
  }

  var delta = copy.length - base.length; // Find the first replaced index.

  var start = 0;

  while (base[start] === copy[start] && start < base.length) {
    ++start;
  } // Find the last replaced index. Search from the end to optimize splice patches.


  var end = base.length;

  while (end > start && base[end - 1] === copy[end + delta - 1]) {
    --end;
  } // Process replaced indices.


  for (var i = start; i < end; ++i) {
    if (assigned[i] && copy[i] !== base[i]) {
      var path = basePath.concat([i]);
      patches.push({
        op: "replace",
        path: path,
        value: copy[i]
      });
      inversePatches.push({
        op: "replace",
        path: path,
        value: base[i]
      });
    }
  }

  var useRemove = end != base.length;
  var replaceCount = patches.length; // Process added indices.

  for (var i$1 = end + delta - 1; i$1 >= end; --i$1) {
    var path$1 = basePath.concat([i$1]);
    patches[replaceCount + i$1 - end] = {
      op: "add",
      path: path$1,
      value: copy[i$1]
    };

    if (useRemove) {
      inversePatches.push({
        op: "remove",
        path: path$1
      });
    }
  } // One "replace" patch reverses all non-splicing "add" patches.


  if (!useRemove) {
    inversePatches.push({
      op: "replace",
      path: basePath.concat(["length"]),
      value: base.length
    });
  }
}

function generateObjectPatches(state, basePath, patches, inversePatches) {
  var base = state.base;
  var copy = state.copy;
  each(state.assigned, function (key, assignedValue) {
    var origValue = base[key];
    var value = copy[key];
    var op = !assignedValue ? "remove" : key in base ? "replace" : "add";

    if (origValue === value && op === "replace") {
      return;
    }

    var path = basePath.concat(key);
    patches.push(op === "remove" ? {
      op: op,
      path: path
    } : {
      op: op,
      path: path,
      value: value
    });
    inversePatches.push(op === "add" ? {
      op: "remove",
      path: path
    } : op === "remove" ? {
      op: "add",
      path: path,
      value: origValue
    } : {
      op: "replace",
      path: path,
      value: origValue
    });
  });
}

function applyPatches(draft, patches) {
  for (var i = 0; i < patches.length; i++) {
    var patch = patches[i];
    var path = patch.path;

    if (path.length === 0 && patch.op === "replace") {
      draft = patch.value;
    } else {
      var base = draft;

      for (var i$1 = 0; i$1 < path.length - 1; i$1++) {
        base = base[path[i$1]];

        if (!base || typeof base !== "object") {
          throw new Error("Cannot apply patch, path doesn't resolve: " + path.join("/"));
        } // prettier-ignore

      }

      var key = path[path.length - 1];

      switch (patch.op) {
        case "replace":
          base[key] = patch.value;
          break;

        case "add":
          if (Array.isArray(base)) {
            // TODO: support "foo/-" paths for appending to an array
            base.splice(key, 0, patch.value);
          } else {
            base[key] = patch.value;
          }

          break;

        case "remove":
          if (Array.isArray(base)) {
            base.splice(key, 1);
          } else {
            delete base[key];
          }

          break;

        default:
          throw new Error("Unsupported patch operation: " + patch.op);
      }
    }
  }

  return draft;
}

function verifyMinified() {}

var configDefaults = {
  useProxies: typeof Proxy !== "undefined" && typeof Reflect !== "undefined",
  autoFreeze: typeof process !== "undefined" ? process.env.NODE_ENV !== "production" : verifyMinified.name === "verifyMinified",
  onAssign: null,
  onDelete: null,
  onCopy: null
};

var Immer = function Immer(config) {
  assign(this, configDefaults, config);
  this.setUseProxies(this.useProxies);
  this.produce = this.produce.bind(this);
};

Immer.prototype.produce = function produce(base, recipe, patchListener) {
  var this$1 = this; // curried invocation

  if (typeof base === "function" && typeof recipe !== "function") {
    var defaultBase = recipe;
    recipe = base;
    var self = this;
    return function curriedProduce(base) {
      var this$1 = this;
      if (base === void 0) base = defaultBase;
      var args = [],
          len = arguments.length - 1;

      while (len-- > 0) args[len] = arguments[len + 1];

      return self.produce(base, function (draft) {
        return recipe.call.apply(recipe, [this$1, draft].concat(args));
      }); // prettier-ignore
    };
  } // prettier-ignore


  {
    if (typeof recipe !== "function") {
      throw new Error("The first or second argument to `produce` must be a function");
    }

    if (patchListener !== undefined && typeof patchListener !== "function") {
      throw new Error("The third argument to `produce` must be a function or undefined");
    }
  }
  var result; // Only plain objects, arrays, and "immerable classes" are drafted.

  if (isDraftable(base)) {
    var scope = ImmerScope.enter();
    var proxy = this.createProxy(base);
    var hasError = true;

    try {
      result = recipe(proxy);
      hasError = false;
    } finally {
      // finally instead of catch + rethrow better preserves original stack
      if (hasError) {
        scope.revoke();
      } else {
        scope.leave();
      }
    }

    if (result instanceof Promise) {
      return result.then(function (result) {
        scope.usePatches(patchListener);
        return this$1.processResult(result, scope);
      }, function (error) {
        scope.revoke();
        throw error;
      });
    }

    scope.usePatches(patchListener);
    return this.processResult(result, scope);
  } else {
    result = recipe(base);

    if (result === undefined) {
      return base;
    }

    return result !== NOTHING ? result : undefined;
  }
};

Immer.prototype.createDraft = function createDraft(base) {
  if (!isDraftable(base)) {
    throw new Error("First argument to `createDraft` must be a plain object, an array, or an immerable object"); // prettier-ignore
  }

  var scope = ImmerScope.enter();
  var proxy = this.createProxy(base);
  proxy[DRAFT_STATE].isManual = true;
  scope.leave();
  return proxy;
};

Immer.prototype.finishDraft = function finishDraft(draft, patchListener) {
  var state = draft && draft[DRAFT_STATE];

  if (!state || !state.isManual) {
    throw new Error("First argument to `finishDraft` must be a draft returned by `createDraft`"); // prettier-ignore
  }

  if (state.finalized) {
    throw new Error("The given draft is already finalized"); // prettier-ignore
  }

  var scope = state.scope;
  scope.usePatches(patchListener);
  return this.processResult(undefined, scope);
};

Immer.prototype.setAutoFreeze = function setAutoFreeze(value) {
  this.autoFreeze = value;
};

Immer.prototype.setUseProxies = function setUseProxies(value) {
  this.useProxies = value;
  assign(this, value ? modernProxy : legacyProxy);
};

Immer.prototype.applyPatches = function applyPatches$1(base, patches) {
  // Mutate the base state when a draft is passed.
  if (isDraft(base)) {
    return applyPatches(base, patches);
  } // Otherwise, produce a copy of the base state.


  return this.produce(base, function (draft) {
    return applyPatches(draft, patches);
  });
};
/** @internal */


Immer.prototype.processResult = function processResult(result, scope) {
  var baseDraft = scope.drafts[0];
  var isReplaced = result !== undefined && result !== baseDraft;
  this.willFinalize(scope, result, isReplaced);

  if (isReplaced) {
    if (baseDraft[DRAFT_STATE].modified) {
      scope.revoke();
      throw new Error("An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft."); // prettier-ignore
    }

    if (isDraftable(result)) {
      // Finalize the result in case it contains (or is) a subset of the draft.
      result = this.finalize(result, null, scope);
    }

    if (scope.patches) {
      scope.patches.push({
        op: "replace",
        path: [],
        value: result
      });
      scope.inversePatches.push({
        op: "replace",
        path: [],
        value: baseDraft[DRAFT_STATE].base
      });
    }
  } else {
    // Finalize the base draft.
    result = this.finalize(baseDraft, [], scope);
  }

  scope.revoke();

  if (scope.patches) {
    scope.patchListener(scope.patches, scope.inversePatches);
  }

  return result !== NOTHING ? result : undefined;
};
/**
 * @internal
 * Finalize a draft, returning either the unmodified base state or a modified
 * copy of the base state.
 */


Immer.prototype.finalize = function finalize(draft, path, scope) {
  var this$1 = this;
  var state = draft[DRAFT_STATE];

  if (!state) {
    if (Object.isFrozen(draft)) {
      return draft;
    }

    return this.finalizeTree(draft, null, scope);
  } // Never finalize drafts owned by another scope.


  if (state.scope !== scope) {
    return draft;
  }

  if (!state.modified) {
    return state.base;
  }

  if (!state.finalized) {
    state.finalized = true;
    this.finalizeTree(state.draft, path, scope);

    if (this.onDelete) {
      // The `assigned` object is unreliable with ES5 drafts.
      if (this.useProxies) {
        var assigned = state.assigned;

        for (var prop in assigned) {
          if (!assigned[prop]) {
            this.onDelete(state, prop);
          }
        }
      } else {
        var base = state.base;
        var copy = state.copy;
        each(base, function (prop) {
          if (!has(copy, prop)) {
            this$1.onDelete(state, prop);
          }
        });
      }
    }

    if (this.onCopy) {
      this.onCopy(state);
    } // At this point, all descendants of `state.copy` have been finalized,
    // so we can be sure that `scope.canAutoFreeze` is accurate.


    if (this.autoFreeze && scope.canAutoFreeze) {
      Object.freeze(state.copy);
    }

    if (path && scope.patches) {
      generatePatches(state, path, scope.patches, scope.inversePatches);
    }
  }

  return state.copy;
};
/**
 * @internal
 * Finalize all drafts in the given state tree.
 */


Immer.prototype.finalizeTree = function finalizeTree(root, rootPath, scope) {
  var this$1 = this;
  var state = root[DRAFT_STATE];

  if (state) {
    if (!this.useProxies) {
      // Create the final copy, with added keys and without deleted keys.
      state.copy = shallowCopy(state.draft, true);
    }

    root = state.copy;
  }

  var needPatches = !!rootPath && !!scope.patches;

  var finalizeProperty = function (prop, value, parent) {
    if (value === parent) {
      throw Error("Immer forbids circular references");
    } // In the `finalizeTree` method, only the `root` object may be a draft.


    var isDraftProp = !!state && parent === root;

    if (isDraft(value)) {
      var path = isDraftProp && needPatches && !state.assigned[prop] ? rootPath.concat(prop) : null; // Drafts owned by `scope` are finalized here.

      value = this$1.finalize(value, path, scope); // Drafts from another scope must prevent auto-freezing.

      if (isDraft(value)) {
        scope.canAutoFreeze = false;
      } // Preserve non-enumerable properties.


      if (Array.isArray(parent) || isEnumerable(parent, prop)) {
        parent[prop] = value;
      } else {
        Object.defineProperty(parent, prop, {
          value: value
        });
      } // Unchanged drafts are never passed to the `onAssign` hook.


      if (isDraftProp && value === state.base[prop]) {
        return;
      }
    } // Unchanged draft properties are ignored.
    else if (isDraftProp && is(value, state.base[prop])) {
        return;
      } // Search new objects for unfinalized drafts. Frozen objects should never contain drafts.
      else if (isDraftable(value) && !Object.isFrozen(value)) {
          each(value, finalizeProperty);
        }

    if (isDraftProp && this$1.onAssign) {
      this$1.onAssign(state, prop, value);
    }
  };

  each(root, finalizeProperty);
  return root;
};

var immer = new Immer();
/**
 * The `produce` function takes a value and a "recipe function" (whose
 * return value often depends on the base state). The recipe function is
 * free to mutate its first argument however it wants. All mutations are
 * only ever applied to a __copy__ of the base state.
 *
 * Pass only a function to create a "curried producer" which relieves you
 * from passing the recipe function every time.
 *
 * Only plain objects and arrays are made mutable. All other objects are
 * considered uncopyable.
 *
 * Note: This function is __bound__ to its `Immer` instance.
 *
 * @param {any} base - the initial state
 * @param {Function} producer - function that receives a proxy of the base state as first argument and which can be freely modified
 * @param {Function} patchListener - optional function that will be called with all the patches produced here
 * @returns {any} a new state, or the initial state if nothing was modified
 */

var produce = immer.produce;
/**
 * Pass true to automatically freeze all copies created by Immer.
 *
 * By default, auto-freezing is disabled in production.
 */

var setAutoFreeze = immer.setAutoFreeze.bind(immer);
/**
 * Pass true to use the ES2015 `Proxy` class when creating drafts, which is
 * always faster than using ES5 proxies.
 *
 * By default, feature detection is used, so calling this is rarely necessary.
 */

var setUseProxies = immer.setUseProxies.bind(immer);
/**
 * Apply an array of Immer patches to the first argument.
 *
 * This function is a producer, which means copy-on-write is in effect.
 */

var applyPatches$1 = immer.applyPatches.bind(immer);
/**
 * Create an Immer draft from the given base state, which may be a draft itself.
 * The draft can be modified until you finalize it with the `finishDraft` function.
 */

var createDraft = immer.createDraft.bind(immer);
/**
 * Finalize an Immer draft from a `createDraft` call, returning the base state
 * (if no changes were made) or a modified copy. The draft must *not* be
 * mutated afterwards.
 *
 * Pass a function as the 2nd argument to generate Immer patches based on the
 * changes that were made.
 */

var finishDraft = immer.finishDraft.bind(immer);

var FormulaEditor =
/*#__PURE__*/
function (_Component) {
  _inherits(FormulaEditor, _Component);

  function FormulaEditor(props) {
    var _this;

    _classCallCheck(this, FormulaEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FormulaEditor).call(this, props));
    _this.state = {
      value: props.formula
    };
    var onFormulaChange = props.onFormulaChange;
    _this.inputElement = undefined;

    _this.setTextInputRef = function (element) {
      _this.inputElement = element;
    };

    _this.focusTextInput = function () {
      // Focus the text input using the raw DOM API
      if (_this.inputElement) _this.inputElement.focus();
    };

    _this.handleChange = function (e) {
      var value = e.target.value;

      _this.setState({
        value: value
      });

      onFormulaChange(value);
    };

    _this.buttonClick = function (e) {
      var value = _this.state.value + e.target.getAttribute('data-add');

      _this.setState({
        value: value
      });

      onFormulaChange(value);

      _this.focusTextInput();
    };

    return _this;
  }

  _createClass(FormulaEditor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // autofocus the input on mount
      this.focusTextInput();
    }
  }, {
    key: "render",
    value: function render(props, _ref) {
      var _this2 = this;

      var value = _ref.value;
      // RF∩(N7478141 ∪ N7478142 ∪ N74788∩F53∩Ann2016)
      return h("section", {
        class: "formula-editor"
      }, h("div", {
        class: "buttons"
      }, [{
        add: 'DF',
        legend: 'DF'
      }, {
        add: 'RF',
        legend: 'RF'
      }, {
        add: 'DI',
        legend: 'DI'
      }, {
        add: 'RI',
        legend: 'RI'
      }].map(function (_ref2) {
        var add = _ref2.add,
            legend = _ref2.legend;
        return h("button", {
          "data-add": add,
          onClick: _this2.buttonClick
        }, legend);
      })), h("div", {
        class: "buttons"
      }, [{
        add: '∩',
        legend: '∩'
      }, {
        add: '∪',
        legend: '∪'
      }].map(function (_ref3) {
        var add = _ref3.add,
            legend = _ref3.legend;
        return h("button", {
          "data-add": add,
          onClick: _this2.buttonClick
        }, legend);
      })), h("div", {
        class: "buttons"
      }, [{
        add: 'F',
        legend: 'F(onction)'
      }, {
        add: 'C',
        legend: 'C(compte)'
      }, {
        add: 'Ch',
        legend: 'Ch(apitre)'
      }].map(function (_ref4) {
        var add = _ref4.add,
            legend = _ref4.legend;
        return h("button", {
          "data-add": add,
          onClick: _this2.buttonClick
        }, legend);
      })), h("input", {
        type: "text",
        value: value,
        ref: this.setTextInputRef,
        onInput: this.handleChange
      }));
    }
  }]);

  return FormulaEditor;
}(Component);

function AggregationDescriptionLeafEditor(_ref5) {
  var aggregationDescriptionLeaf = _ref5.aggregationDescriptionLeaf,
      aggregatedDocumentBudgetaireCorrespondingNode = _ref5.aggregatedDocumentBudgetaireCorrespondingNode,
      planDeCompte = _ref5.planDeCompte,
      onFormulaChange = _ref5.onFormulaChange;
  var id = aggregationDescriptionLeaf.id,
      name = aggregationDescriptionLeaf.name,
      formula = aggregationDescriptionLeaf.formula;
  return h("div", {
    class: "formula-editor-with-preview"
  }, h("h1", null, name, " ", h("small", null, "(", id, ")")), h("div", null, h("strong", null, "Formule"), " ", h("a", {
    class: "help",
    target: "_blank",
    href: "./exemples_formules.html"
  }, "?"), h(FormulaEditor, {
    key: id,
    formula: formula,
    onFormulaChange: onFormulaChange
  }), aggregatedDocumentBudgetaireCorrespondingNode ? [h("table", {
    class: "summary"
  }, h("tr", null, h("td", null, "Nombre d'\xE9l\xE9ments"), h("td", null, h("strong", null, aggregatedDocumentBudgetaireCorrespondingNode.elements.size))), h("tr", null, h("td", null, "Total"), h("td", {
    class: "money-amount"
  }, h("strong", null, aggregatedDocumentBudgetaireNodeTotal(aggregatedDocumentBudgetaireCorrespondingNode).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }))))), h("table", {
    class: "formula-rows"
  }, h("thead", null, h("tr", null, ['RDFI', 'Fonction', 'Nature', 'Montant'].map(function (s) {
    return h("th", null, s);
  }))), h("tbody", null, _toConsumableArray(aggregatedDocumentBudgetaireCorrespondingNode.elements).sort(function (r1, r2) {
    return r2['MtReal'] - r1['MtReal'];
  }).map(function (r) {
    return h("tr", null, h("td", null, r['CodRD'] + planDeCompte.ligneBudgetFI(r)), h("td", null, r['Fonction']), h("td", null, r['Nature']), h("td", {
      class: "money-amount"
    }, r['MtReal'].toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    })));
  })))] : undefined));
}

var MillerColumn =
/*#__PURE__*/
function (_Component) {
  _inherits(MillerColumn, _Component);

  function MillerColumn(props) {
    var _this;

    _classCallCheck(this, MillerColumn);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MillerColumn).call(this, props));
    _this.state = {
      adding: Object.values(props.aggregationDescription.children).length === 0,
      editingNode: undefined
    };
    return _this;
  }

  _createClass(MillerColumn, [{
    key: "render",
    value: function render(_ref, _ref2) {
      var _this2 = this;

      var aggregationDescription = _ref.aggregationDescription,
          addChild = _ref.addChild,
          editChild = _ref.editChild,
          removeChild = _ref.removeChild,
          onNodeSelection = _ref.onNodeSelection,
          selectedChildId = _ref.selectedChildId,
          isLast = _ref.isLast;
      var adding = _ref2.adding,
          editingNode = _ref2.editingNode;
      return h("ol", null, Object.values(aggregationDescription.children).map(function (node) {
        var isSelected = node.id === selectedChildId;
        return !editingNode || editingNode.id !== node.id ? h("li", {
          key: node.id,
          class: [isSelected ? 'selected' : undefined, node.children ? 'group' : 'formula'].filter(function (x) {
            return x;
          }).join(' '),
          onClick: function onClick() {
            return onNodeSelection(isSelected ? undefined : node.id);
          }
        }, isSelected && isLast ? h("button", {
          title: "\xC9diter",
          class: "edit",
          onClick: function onClick() {
            return _this2.setState({
              editingNode: node
            });
          }
        }, "\u270E") : undefined, h("span", null, node.name)) : undefined;
      }), h("li", null, adding || editingNode ? h("form", {
        onSubmit: function onSubmit(e) {
          e.preventDefault();
          var newChild = e.target.querySelector('input[name="type"]:checked').value === 'group' ? {
            id: e.target.querySelector('input[name="id"]').value,
            name: e.target.querySelector('input[name="name"]').value,
            children: editingNode && editingNode.children || Object.create(null)
          } : {
            id: e.target.querySelector('input[name="id"]').value,
            name: e.target.querySelector('input[name="name"]').value,
            formula: editingNode && editingNode.formula || ''
          };

          if (editingNode) {
            editChild(editingNode, newChild);
          } else {
            // adding
            addChild(newChild);
          }

          _this2.setState({
            adding: false,
            editingNode: undefined
          });
        }
      }, h("label", null, "Codification unique", h("input", {
        autocomplete: "off",
        name: "id",
        placeholder: "DF.1.7.2",
        defaultValue: editingNode && editingNode.id
      })), h("label", null, "Nom", h("input", {
        autocomplete: "off",
        name: "name",
        defaultValue: editingNode && editingNode.name
      })), h("section", null, "Type", h("label", null, h("input", {
        defaultChecked: editingNode ? editingNode.children : true,
        type: "radio",
        name: "type",
        value: "group"
      }), "Groupe"), h("label", null, h("input", {
        defaultChecked: editingNode && 'formula' in editingNode,
        type: "radio",
        name: "type",
        value: "formula"
      }), "Formule")), h("section", null, h("button", {
        type: "submit"
      }, "ok"), h("button", {
        type: "button",
        onClick: function onClick() {
          return _this2.setState({
            adding: false,
            editingNode: undefined
          });
        }
      }, "annuler")), editingNode ? h("button", {
        type: "button",
        class: "delete",
        title: "Supprimer",
        onClick: function onClick() {
          removeChild(editingNode);

          _this2.setState({
            adding: false,
            editingNode: undefined
          });
        }
      }, "Supprimer") : undefined) : h("button", {
        class: "add",
        title: "Rajouter un \xE9l\xE9ment",
        onClick: function onClick() {
          return _this2.setState({
            adding: true
          });
        }
      }, "+")));
    }
  }]);

  return MillerColumn;
}(Component); // https://en.wikipedia.org/wiki/Miller_columns


var MillerColumns =
/*#__PURE__*/
function (_Component2) {
  _inherits(MillerColumns, _Component2);

  function MillerColumns(props) {
    var _this3;

    _classCallCheck(this, MillerColumns);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(MillerColumns).call(this, props));
    _this3.state = {
      adding: Object.values(props.aggregationDescription.children).length === 0,
      editingNode: undefined
    };
    _this3.columnsContainerElement = undefined;

    _this3.setColumnsContainerElement = function (element) {
      _this3.columnsContainerElement = element;
    };

    return _this3;
  }

  _createClass(MillerColumns, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.columnsContainerElement.scrollLeft = this.columnsContainerElement.scrollWidth;
    }
  }, {
    key: "render",
    value: function render(_ref3) {
      var aggregationDescription = _ref3.aggregationDescription,
          aggregatedDocumentBudgetaire = _ref3.aggregatedDocumentBudgetaire,
          planDeCompte = _ref3.planDeCompte,
          selectedList = _ref3.selectedList,
          _ref3$aggregationDesc = _ref3.aggregationDescriptionMutations,
          addChild = _ref3$aggregationDesc.addChild,
          removeChild = _ref3$aggregationDesc.removeChild,
          _editChild = _ref3$aggregationDesc.editChild,
          setSelectionList = _ref3.millerColumnSelection.set;
      var firstSelectedId = selectedList[0];
      var editChildByLevel = selectedList.map(function (id, i) {
        return i === 0 ? _editChild : function (previousChild, newChild, newSelectedList) {
          var parent = aggregationDescription;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = selectedList.slice(0, i)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var selected = _step.value;
              parent = parent.children[selected];
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          editChildByLevel[i - 1](parent, produce(parent, function (draft) {
            var newId = newChild.id;
            var previousId = previousChild.id;

            if (previousId !== newId) {
              delete draft.children[previousId];
            }

            draft.children[newId] = newChild;
          }), [newChild.id].concat(_toConsumableArray(newSelectedList)));
        };
      });
      return h("section", {
        class: "miller-columns"
      }, h("h2", null, "Cr\xE9ation/\xE9dition"), h("div", {
        class: "columns",
        ref: this.setColumnsContainerElement
      }, h(MillerColumn, {
        aggregationDescription: aggregationDescription,
        selectedChildId: firstSelectedId,
        isLast: selectedList.length === 1,
        addChild: addChild,
        editChild: function editChild(previousChild, newChild) {
          return _editChild(previousChild, newChild, []);
        },
        removeChild: removeChild,
        onNodeSelection: function onNodeSelection(id) {
          return setSelectionList(id ? [id] : []);
        }
      }), selectedList.map(function (id, i) {
        var descriptionNode = aggregationDescription;
        var aggregatedNode = aggregatedDocumentBudgetaire;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          var _loop = function _loop() {
            var selected = _step2.value;
            descriptionNode = descriptionNode.children[selected];
            aggregatedNode = aggregatedNode && aggregatedNode.children.find(function (c) {
              return c.id === selected;
            });
          };

          for (var _iterator2 = selectedList.slice(0, i + 1)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            _loop();
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        var addChildDeep = function addChildDeep(newChild) {
          editChildByLevel[i](descriptionNode, produce(descriptionNode, function (draft) {
            draft.children[newChild.id] = newChild;
          }), [newChild.id]);
        };

        var removeChildDeep = function removeChildDeep(childToRemove) {
          editChildByLevel[i](descriptionNode, produce(descriptionNode, function (draft) {
            delete draft.children[childToRemove.id];
          }), []);
        };

        return descriptionNode.children ? h(MillerColumn, {
          key: id,
          aggregationDescription: descriptionNode,
          selectedChildId: selectedList[i + 1],
          isLast: i === selectedList.length - 2,
          addChild: addChildDeep,
          editChild: function editChild(previousChild, newChild) {
            return editChildByLevel[i](descriptionNode, produce(descriptionNode, function (draft) {
              var newId = newChild.id;
              var previousId = previousChild.id;

              if (previousId !== newId) {
                delete draft.children[previousId];
              }

              draft.children[newId] = newChild;
            }), []);
          },
          removeChild: removeChildDeep,
          onNodeSelection: function onNodeSelection(id) {
            return setSelectionList(id ? [].concat(_toConsumableArray(selectedList.slice(0, i + 1)), [id]) : selectedList.slice(0, i + 1));
          }
        }) : h(AggregationDescriptionLeafEditor, {
          aggregationDescriptionLeaf: descriptionNode,
          aggregatedDocumentBudgetaireCorrespondingNode: aggregatedNode,
          planDeCompte: planDeCompte,
          onFormulaChange: function onFormulaChange(formula) {
            return editChildByLevel[i](descriptionNode, {
              id: descriptionNode.id,
              name: descriptionNode.name,
              formula: formula
            }, []);
          }
        });
      })));
    }
  }]);

  return MillerColumns;
}(Component);

function AggregationDescriptionImportExport(_ref4) {
  var triggerAggregationDescriptionDownload = _ref4.triggerAggregationDescriptionDownload,
      importAggregationDescription = _ref4.importAggregationDescription;
  return h("section", {
    class: "aggregation-description-import-export"
  }, h("section", {
    class: "import"
  }, h("h2", null, "Import"), "Importer un fichier de description d'agr\xE9gation", h("input", {
    type: "file",
    onChange: function onChange(e) {
      var file = e.target.files[0];

      if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        reader.onload = function (e) {
          return importAggregationDescription(AggregationDescriptionFromJSON(JSON.parse(e.target.result)));
        }; // TODO error case

      }
    }
  })), h("section", {
    class: "export"
  }, h("h2", null, "Export"), h("button", {
    onClick: triggerAggregationDescriptionDownload
  }, "Exporter au format JSON")));
}

function AggregationDescriptionEditor (props) {
  var aggregationDescription = props.aggregationDescription,
      triggerAggregationDescriptionDownload = props.triggerAggregationDescriptionDownload,
      importAggregationDescription = props.importAggregationDescription;
  return h("section", null, h("h1", null, "Description d'aggr\xE9gation"), h(AggregationDescriptionImportExport, {
    aggregationDescription: aggregationDescription,
    triggerAggregationDescriptionDownload: triggerAggregationDescriptionDownload,
    importAggregationDescription: importAggregationDescription
  }), h(MillerColumns, props));
}

function Aggregation (_ref) {
  var aggregationDescription = _ref.aggregationDescription,
      aggregatedDocumentBudgetaire = _ref.aggregatedDocumentBudgetaire,
      documentBudgetairesWithPlanDeCompte = _ref.documentBudgetairesWithPlanDeCompte,
      selectedList = _ref.selectedList,
      aggregationDescriptionMutations = _ref.aggregationDescriptionMutations,
      millerColumnSelection = _ref.millerColumnSelection,
      triggerAggregationDescriptionDownload = _ref.triggerAggregationDescriptionDownload,
      importAggregationDescription = _ref.importAggregationDescription;
  var planDeCompte = documentBudgetairesWithPlanDeCompte[0] && documentBudgetairesWithPlanDeCompte[0].planDeCompte;
  return h("div", null, h(AggregationDescriptionEditor, {
    aggregationDescription: aggregationDescription,
    aggregatedDocumentBudgetaire: aggregatedDocumentBudgetaire,
    selectedList: selectedList,
    aggregationDescriptionMutations: aggregationDescriptionMutations,
    millerColumnSelection: millerColumnSelection,
    triggerAggregationDescriptionDownload: triggerAggregationDescriptionDownload,
    importAggregationDescription: importAggregationDescription,
    planDeCompte: planDeCompte
  }), h(AggregationAnalysis, {
    aggregationDescription: aggregationDescription,
    documentBudgetairesWithPlanDeCompte: documentBudgetairesWithPlanDeCompte
  }));
}

function DocumentBudgetaireInput(_ref) {
  var onNewDocumentBudgetaireText = _ref.onNewDocumentBudgetaireText;

  function onChange(e) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = e.target.files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var file = _step.value;
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        reader.onload = function (e) {
          return onNewDocumentBudgetaireText(e.target.result);
        }; // MISSING error case

      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  return h("label", null, "Charger un ou plusieurs ", h("a", {
    target: "_blank",
    href: "https://github.com/DavidBruant/colors-of-the-finances/blob/master/docs/format-fichier.md"
  }, "Document Budgetaire (format xml)"), h("input", {
    type: "file",
    multiple: true,
    onChange: onChange
  }));
}

function ContextHeader (_ref2) {
  var documentBudgetairesWithPlanDeCompte = _ref2.documentBudgetairesWithPlanDeCompte,
      selected = _ref2.selected,
      onNewDocumentBudgetaireText = _ref2.onNewDocumentBudgetaireText,
      onSelectDocumentBudgetaire = _ref2.onSelectDocumentBudgetaire,
      errors = _ref2.errors;
  return h("header", null, h("h1", null, "Agr\xE9gation de Document Budg\xE9taire"), h("section", null, h("h2", null, "Documents Budg\xE9taires"), h("div", null, "Documents budg\xE9taires charg\xE9s :", documentBudgetairesWithPlanDeCompte.length === 0 ? ' (aucun)' : h("ul", {
    class: "documents-budgetaires"
  }, documentBudgetairesWithPlanDeCompte.map(function (dbwpc) {
    return h("li", {
      class: selected === dbwpc ? 'selected' : '',
      onClick: function onClick(e) {
        return onSelectDocumentBudgetaire(dbwpc);
      }
    }, dbwpc.documentBudgetaire["LibelleColl"], " - (", dbwpc.documentBudgetaire["Nomenclature"], ") - ", h("strong", null, dbwpc.documentBudgetaire["Exer"]));
  }))), errors && errors.map(function (err) {
    return h("strong", {
      class: "error"
    }, "Erreur : ", err);
  }), h(DocumentBudgetaireInput, {
    onNewDocumentBudgetaireText: onNewDocumentBudgetaireText
  })));
}

var ASYNC_STATUS = Symbol('async status property name');
var STATUS_PENDING = Symbol('async status pending');
var STATUS_ERROR = Symbol('async status error');
var STATUS_VALUE = Symbol('async status value');

function fromXMLDocument(pc) {
  var Nomenclature = pc.querySelector('Nomenclature');
  var chapitreCodeByNatureR = new Map();
  var chapitreCodeByNatureD = new Map();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Nomenclature.querySelectorAll('Compte')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var c = _step.value;
      var code = c.getAttribute('Code');
      chapitreCodeByNatureR.set(code, c.getAttribute('RR'));
      chapitreCodeByNatureD.set(code, c.getAttribute('DR'));
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var FIByChapitreCode = new Map();
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = Nomenclature.querySelectorAll('Chapitre')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var ch = _step2.value;

      var _code = ch.getAttribute('Code');

      FIByChapitreCode.set(_code, ch.getAttribute('Section'));
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return {
    Norme: Nomenclature.getAttribute('Norme'),
    Declinaison: Nomenclature.getAttribute('Declinaison'),
    Exer: Number(Nomenclature.getAttribute('Exer')),
    ligneBudgetFI: function ligneBudgetFI(_ref) {
      var CodRD = _ref.CodRD,
          Nature = _ref.Nature;
      var chapitreCodeByNature = CodRD === 'R' ? chapitreCodeByNatureR : chapitreCodeByNatureD;
      var chapitreCode = chapitreCodeByNature.get(Nature);
      return FIByChapitreCode.get(chapitreCode);
    },
    ligneBudgetChapitre: function ligneBudgetChapitre(_ref2) {
      var CodRD = _ref2.CodRD,
          Nature = _ref2.Nature;
      var chapitreCodeByNature = CodRD === 'R' ? chapitreCodeByNatureR : chapitreCodeByNatureD;
      return chapitreCodeByNature.get(Nature);
    },
    ligneBudgetIsInChapitre: function ligneBudgetIsInChapitre(_ref3, chapitre) {
      var CodRD = _ref3.CodRD,
          Nature = _ref3.Nature;
      var chapitreCodeByNature = CodRD === 'R' ? chapitreCodeByNatureR : chapitreCodeByNatureD;
      var chapitreCode = chapitreCodeByNature.get(Nature);
      return chapitreCode === chapitre;
    },
    ligneBudgetIsInCompte: function ligneBudgetIsInCompte(_ref4, compte) {
      var Nature = _ref4.Nature;
      var compteElement = Nomenclature.querySelector("Compte[Code=\"".concat(Nature, "\"]"));
      if (!compteElement) // compte does not exist for this nature
        return false; // look up to see if the compte is a parent of the LigneBudget's Nature

      var testedCompteElement = compteElement;

      while (testedCompteElement) {
        if (testedCompteElement.getAttribute('Code') === compte) {
          return true;
        } else {
          testedCompteElement = testedCompteElement.parentNode;
          if (testedCompteElement.localName.toLowerCase() !== 'Compte'.toLowerCase()) return false;
        }
      }

      return false;
    },
    ligneBudgetIsInFonction: function ligneBudgetIsInFonction(_ref5, fonction) {
      var Fonction = _ref5.Fonction;
      var fonctionElement = Nomenclature.querySelector("RefFonctionnelles RefFonc[Code=\"".concat(Fonction, "\"]"));
      if (!fonctionElement) // compte does not exist for this nature
        return false; // look up to see if the compte is a parent of the LigneBudget's Nature

      var testedFonctionElement = fonctionElement;

      while (testedFonctionElement) {
        if (testedFonctionElement.getAttribute('Code') === fonction) {
          return true;
        } else {
          testedFonctionElement = testedFonctionElement.parentNode;
          if (testedFonctionElement.localName.toLowerCase() !== 'RefFonc'.toLowerCase()) return false;
        }
      }

      return false;
    }
  };
}

function makePlanDeCompteURL(docBudg) {
  var _docBudg$Nomenclature = docBudg.Nomenclature.split('-'),
      _docBudg$Nomenclature2 = _slicedToArray(_docBudg$Nomenclature, 2),
      norme = _docBudg$Nomenclature2[0],
      sousNorme = _docBudg$Nomenclature2[1];

  var année = docBudg.Exer;
  return "https://dtc-innovation.github.io/plans-de-compte/".concat(année, "/").concat(norme, "/").concat(sousNorme, "/planDeCompte.xml");
}

function _actions (store) {
  return {
    onNewDocumentBudgetaireText: function onNewDocumentBudgetaireText(fileText) {
      var docBudgP = Promise.resolve().then(function () {
        return new DOMParser().parseFromString(fileText, "text/xml");
      }).then(xmlDocumentToDocumentBudgetaire);
      store.mutations.documentBudgetaires.add.setPending(docBudgP);
      docBudgP.then(function (docBudg) {
        store.mutations.documentBudgetaires.add.setValue(docBudgP, docBudg);
      });
      docBudgP.catch(function (err) {
        return store.mutations.documentBudgetaires.add.setError(docBudgP, err);
      });
      docBudgP.then(function (docBudg) {
        var planDeCompteURL = makePlanDeCompteURL(docBudg);
        var planDeCompteP = xml(planDeCompteURL).then(fromXMLDocument).then(function (planDeCompte) {
          return store.mutations.documentBudgetaires.planDeCompte.setValue(docBudg, planDeCompte);
        });
        store.mutations.documentBudgetaires.planDeCompte.setPending(docBudg, planDeCompteP);
        planDeCompteP.catch(function (err) {
          store.mutations.documentBudgetaires.planDeCompte.setError(docBudg, Object.assign(err, {
            url: planDeCompteURL
          }));
        });
      });
    },
    importAggregationDescription: store.mutations.aggregationDescription.set
  };
}

function mapStateToProps(_ref) {
  var aggregationDescription = _ref.aggregationDescription,
      _ref$selectedDocument = _ref.selectedDocumentBudgetaireWithPlanDeCompte,
      selectedDocumentBudgetaireWithPlanDeCompte = _ref$selectedDocument === void 0 ? {} : _ref$selectedDocument,
      documentBudgetairesWithPlanDeCompte = _ref.documentBudgetairesWithPlanDeCompte,
      millerColumnSelection = _ref.millerColumnSelection;
  var documentBudgetaire = selectedDocumentBudgetaireWithPlanDeCompte.documentBudgetaire,
      planDeCompte = selectedDocumentBudgetaireWithPlanDeCompte.planDeCompte;
  return {
    aggregationDescription: aggregationDescription,
    selectedList: millerColumnSelection,
    aggregatedDocumentBudgetaire: aggregationDescription && documentBudgetaire && documentBudgetaire[ASYNC_STATUS] === STATUS_VALUE && planDeCompte && planDeCompte[ASYNC_STATUS] === STATUS_VALUE ? makeAggregateFunction(aggregationDescription, planDeCompte)(documentBudgetaire) : undefined,
    documentBudgetairesWithPlanDeCompte: documentBudgetairesWithPlanDeCompte.filter(function (_ref2) {
      var documentBudgetaire = _ref2.documentBudgetaire,
          planDeCompte = _ref2.planDeCompte;
      return documentBudgetaire && documentBudgetaire[ASYNC_STATUS] === STATUS_VALUE && planDeCompte && planDeCompte[ASYNC_STATUS] === STATUS_VALUE;
    })
  };
}

function Main (_ref3) {
  var store = _ref3.store;

  var actions = _actions(store);

  var _store$state = store.state,
      _store$state$selected = _store$state.selectedDocumentBudgetaireWithPlanDeCompte,
      selectedDocumentBudgetaireWithPlanDeCompte = _store$state$selected === void 0 ? {} : _store$state$selected,
      aggregationDescription = _store$state.aggregationDescription,
      documentBudgetairesWithPlanDeCompte = _store$state.documentBudgetairesWithPlanDeCompte;
  var props = Object.assign({}, store.mutations, {
    // disambiguation with props with the 'aggregationDescription'
    aggregationDescriptionMutations: store.mutations.aggregationDescription,
    triggerAggregationDescriptionDownload: function triggerAggregationDescriptionDownload() {
      var content = JSON.stringify(AggregationDescriptionToJSON(aggregationDescription), null, 2);
      var blob = new Blob([content], {
        type: 'application/json'
      });
      var blobUrl = URL.createObjectURL(blob);
      var date = new Date();
      var a = document.createElement('a');
      a.style.position = "absolute"; // getting off document flow
      // making an effort to hide the element as much as possible

      a.style.zIndex = -1;
      a.style.opacity = 0;
      a.setAttribute('href', blobUrl);
      a.setAttribute('download', "description-agr\xE9gation-".concat(date.getFullYear(), "-").concat((date.getMonth() + 1).toString().padStart(2, '0'), "-").concat(date.getDate().toString().padStart(2, '0'), "-").concat(date.getHours().toString().padStart(2, '0'), "h").concat(date.getMinutes().toString().padStart(2, '0'), ".json"));
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, mapStateToProps(store.state), actions);
  var errors = store.state.documentBudgetairesWithPlanDeCompte.filter(function (_ref4) {
    var planDeCompte = _ref4.planDeCompte;
    return planDeCompte && planDeCompte[ASYNC_STATUS] === STATUS_ERROR;
  }).map(function (_ref5) {
    var _ref5$documentBudgeta = _ref5.documentBudgetaire,
        Nomenclature = _ref5$documentBudgeta.Nomenclature,
        Exer = _ref5$documentBudgeta.Exer,
        planDeCompte = _ref5.planDeCompte;
    return "Le plan de compte pour la nomenclature ".concat(Nomenclature, ", ann\xE9e ").concat(Exer, " n'a pas pu \xEAtre r\xE9cup\xE9r\xE9 (").concat(planDeCompte.url, ", \"").concat(planDeCompte.message, "\")");
  });
  return h("main", null, h(ContextHeader, {
    documentBudgetairesWithPlanDeCompte: documentBudgetairesWithPlanDeCompte,
    selected: selectedDocumentBudgetaireWithPlanDeCompte,
    errors: errors,
    onNewDocumentBudgetaireText: actions.onNewDocumentBudgetaireText,
    onSelectDocumentBudgetaire: store.mutations.selectedDocumentBudgetaireWithPlanDeCompte.set
  }), h(Aggregation, props));
}

function Store({
  state: initialState,
  mutations
}) {
  let state = initialState;
  const subscribers = new Set();
  let callToSubscribersScheduled = false;

  function scheduleCallToSubscribers() {
    // schedule for next micro-task (or something like that)
    if (!callToSubscribersScheduled) {
      callToSubscribersScheduled = true;
      Promise.resolve().then(() => {
        for (const s of subscribers) {
          try {
            s(state);
          } catch (e) {
            console.error('subscriber error', e);
          }
        }

        callToSubscribersScheduled = false;
      });
    }
  }

  function makeSubscribleMutationWrapper(mutations, propSequence = []) {
    return new Proxy(mutations, {
      get(mutations, name) {
        if (name in mutations) {
          return makeSubscribleMutationWrapper(mutations[name], [...propSequence, name]);
        } else {
          throw new TypeError(`No ${name} property in \`mutations.${propSequence.join('.')}\``);
        }
      },

      apply(mutations, thisArg, argList) {
        // TODO : need to allow some logging plugin. Probably by defining other events
        //console.log('apply trap', propSequence, argList)
        if (typeof mutations !== 'function') {
          throw new TypeError(`\`mutations.${propSequence.join('.')}\` is not a function`);
        } else {
          const returnValue = Reflect.apply(mutations, undefined, [state, ...argList]);

          if (returnValue !== undefined) {
            state = returnValue;
          }

          scheduleCallToSubscribers();
          return returnValue;
        }
      }

    });
  }

  return {
    get state() {
      return state;
    },

    mutations: makeSubscribleMutationWrapper(mutations),

    subscribe(fn) {
      subscribers.add(fn);
      return () => {
        subscribers.delete(fn);
      };
    }

  };
}

var store = new Store({
  state: {
    millerColumnSelection: [],
    aggregationDescription: undefined,
    selectedDocumentBudgetaireWithPlanDeCompte: undefined,
    documentBudgetairesWithPlanDeCompte: []
  },
  mutations: {
    aggregationDescription: {
      set: function set(state, aggregationDescription) {
        return produce(state, function (draft) {
          draft.aggregationDescription = aggregationDescription;
          draft.millerColumnSelection = [];
        });
      },
      addChild: function addChild(state, child) {
        // add child to only root
        return produce(state, function (draft) {
          draft.aggregationDescription.children[child.id] = child; // select newly created node

          draft.millerColumnSelection = [child.id];
        });
      },
      editChild: function editChild(state, previousChild, newChild, newSelectedList) {
        // edit child at only root
        //console.log('editChild root', previousChild, newChild, newSelectedList)
        return produce(state, function (draft) {
          var newId = newChild.id;
          var previousId = previousChild.id;

          if (previousId !== newId) {
            delete draft.aggregationDescription.children[previousId];
            draft.millerColumnSelection[draft.millerColumnSelection.findIndex(function (id) {
              return id === previousId;
            })] = newId;
          }

          draft.aggregationDescription.children[newId] = newChild;
          if (newSelectedList) draft.millerColumnSelection = [newChild.id].concat(_toConsumableArray(newSelectedList));
        });
      },
      removeChild: function removeChild(state, child) {
        // add child to only root
        return produce(state, function (draft) {
          delete draft.aggregationDescription.children[child.id]; // select newly created node

          draft.millerColumnSelection = [];
        });
      }
    },
    millerColumnSelection: {
      set: function set(state, newSelection) {
        return produce(state, function (draft) {
          draft.millerColumnSelection = newSelection;
        });
      }
    },
    documentBudgetaires: {
      add: {
        setPending: function setPending(state, pendingValue) {
          return produce(state, function (draft) {
            pendingValue[ASYNC_STATUS] = STATUS_PENDING;
            draft.documentBudgetairesWithPlanDeCompte.push({
              documentBudgetaire: pendingValue
            });
          });
        },
        setError: function setError(state, pendingValue, error) {
          return produce(state, function (draft) {
            error[ASYNC_STATUS] = STATUS_ERROR;
            var index = draft.documentBudgetairesWithPlanDeCompte.findIndex(function (_ref) {
              var documentBudgetaire = _ref.documentBudgetaire;
              return documentBudgetaire === pendingValue;
            });
            draft.documentBudgetairesWithPlanDeCompte[index] = {
              documentBudgetaire: error
            };
          });
        },
        setValue: function setValue(state, pendingValue, value) {
          value[ASYNC_STATUS] = STATUS_VALUE;
          return produce(state, function (draft) {
            var index = draft.documentBudgetairesWithPlanDeCompte.findIndex(function (_ref2) {
              var documentBudgetaire = _ref2.documentBudgetaire;
              return documentBudgetaire === pendingValue;
            });
            draft.documentBudgetairesWithPlanDeCompte[index] = {
              documentBudgetaire: value
            };
            draft.documentBudgetairesWithPlanDeCompte = draft.documentBudgetairesWithPlanDeCompte.sort(function (dbwpc1, dbwpc2) {
              var Exer1 = dbwpc1.documentBudgetaire.Exer;
              var Exer2 = dbwpc2.documentBudgetaire.Exer;
              return Exer2 - Exer1;
            });
            draft.selectedDocumentBudgetaireWithPlanDeCompte = draft.documentBudgetairesWithPlanDeCompte[0];
          });
        }
      },
      planDeCompte: {
        setPending: function setPending(state, docBudg, pendingValue) {
          pendingValue[ASYNC_STATUS] = STATUS_PENDING;
          var dbwpdc = state.documentBudgetairesWithPlanDeCompte.find(function (_ref3) {
            var documentBudgetaire = _ref3.documentBudgetaire;
            return documentBudgetaire === docBudg;
          });
          dbwpdc.planDeCompte = pendingValue;
        },
        setError: function setError(state, docBudg, error) {
          error[ASYNC_STATUS] = STATUS_ERROR;
          var dbwpdc = state.documentBudgetairesWithPlanDeCompte.find(function (_ref4) {
            var documentBudgetaire = _ref4.documentBudgetaire;
            return documentBudgetaire === docBudg;
          });
          dbwpdc.planDeCompte = error;
        },
        setValue: function setValue(state, docBudg, planDeCompte) {
          planDeCompte[ASYNC_STATUS] = STATUS_VALUE;
          var dbwpdc = state.documentBudgetairesWithPlanDeCompte.find(function (_ref5) {
            var documentBudgetaire = _ref5.documentBudgetaire;
            return documentBudgetaire === docBudg;
          });
          dbwpdc.planDeCompte = planDeCompte;
        }
      }
    },
    selectedDocumentBudgetaireWithPlanDeCompte: {
      set: function set(state, dbwpc) {
        return produce(state, function (draft) {
          draft.selectedDocumentBudgetaireWithPlanDeCompte = dbwpc;
        });
      }
    }
  }
});

var AGGREGATION_DESCRIPTION_KEY = 'aggregation-description';
function getStoredState() {
  var stored = localStorage.getItem(AGGREGATION_DESCRIPTION_KEY) || undefined;
  return stored && AggregationDescriptionFromJSON(JSON.parse(stored));
}
function saveState(state) {
  localStorage.setItem(AGGREGATION_DESCRIPTION_KEY, JSON.stringify(AggregationDescriptionToJSON(state.aggregationDescription)));
}

// initialize store

store.mutations.aggregationDescription.set({
  id: 'racine',
  name: 'racine',
  children: Object.create(null)
});
var isMontreuil = new Set(new URLSearchParams(location.search).keys()).has('montreuil');

if (isMontreuil) {
  // Download and transform some Compte Administratif for easier use
  var docBudgP = Promise.all([xml('./data/CA/CA 2017.xml'), xml('./data/plansDeCompte/plan-de-compte-M14-M14_COM_SUP3500-2017.xml').then(function (pdC) {
    return makeNatureToChapitreFI([pdC]);
  })]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        doc = _ref2[0],
        natureToChapitreFI = _ref2[1];

    return xmlDocumentToDocumentBudgetaire(doc, natureToChapitreFI);
  }).then(function (docBudg) {
    console.log('docBudg', docBudg);
    store.mutations.testedDocumentBudgetaire.setValue(docBudg);
    return docBudg;
  }).catch(console.error); // Download Montreuil "Open data nomenclature" CSV and transform it to formulas

  Promise.all([csv$1('./data/agregation-Montreuil-v4.csv'), docBudgP]).then(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        csvData = _ref4[0],
        docBudg = _ref4[1];

    return montreuilCVSToAggregationFormulas(csvData, [docBudg]);
  }).then(function (formulas) {
    console.log('formulas', formulas);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = formulas[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = _step.value,
            name = _step$value.name,
            formula = _step$value.formula;
        store.mutations.addFormula({
          id: name,
          name: name,
          formula: formula
        });
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });
} else {
  // load stored aggregation description
  var storedAggregationDescription = getStoredState();

  if (storedAggregationDescription) {
    console.log('storedAggregationDescription', storedAggregationDescription);
    store.mutations.aggregationDescription.set(storedAggregationDescription);
  }
} // UI render


var container = document.querySelector('#react-content');

function renderUI() {
  render(h(Main, {
    store: _objectSpread({}, store)
  }), container, container.firstElementChild);
} // initial render


renderUI(); // render when state changes

store.subscribe(renderUI); // Save state regularly

store.subscribe(saveState);
