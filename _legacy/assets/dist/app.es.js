const propMap = {
  class: "className",
  contenteditable: "contentEditable",
  for: "htmlFor",
  readonly: "readOnly",
  maxlength: "maxLength",
  tabindex: "tabIndex",
  colspan: "colSpan",
  rowspan: "rowSpan",
  usemap: "useMap"
};
function attempt(fn2, arg) {
  try {
    return fn2(arg);
  } catch (_a) {
    return arg;
  }
}
const doc = document, win = window, docEle = doc.documentElement, createElement = doc.createElement.bind(doc), div = createElement("div"), table = createElement("table"), tbody = createElement("tbody"), tr = createElement("tr"), { isArray, prototype: ArrayPrototype } = Array, { concat, filter, indexOf, map, push, slice, some, splice } = ArrayPrototype;
const idRe = /^#(?:[\w-]|\\.|[^\x00-\xa0])*$/, classRe = /^\.(?:[\w-]|\\.|[^\x00-\xa0])*$/, htmlRe = /<.+>/, tagRe = /^\w+$/;
function find(selector, context) {
  const isFragment = isDocumentFragment(context);
  return !selector || !isFragment && !isDocument(context) && !isElement(context) ? [] : !isFragment && classRe.test(selector) ? context.getElementsByClassName(selector.slice(1)) : !isFragment && tagRe.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector);
}
class Cash {
  constructor(selector, context) {
    if (!selector)
      return;
    if (isCash(selector))
      return selector;
    let eles = selector;
    if (isString(selector)) {
      const ctx = (isCash(context) ? context[0] : context) || doc;
      eles = idRe.test(selector) && "getElementById" in ctx ? ctx.getElementById(selector.slice(1)) : htmlRe.test(selector) ? parseHTML(selector) : find(selector, ctx);
      if (!eles)
        return;
    } else if (isFunction(selector)) {
      return this.ready(selector);
    }
    if (eles.nodeType || eles === win)
      eles = [eles];
    this.length = eles.length;
    for (let i = 0, l = this.length; i < l; i++) {
      this[i] = eles[i];
    }
  }
  init(selector, context) {
    return new Cash(selector, context);
  }
}
const fn = Cash.prototype, cash = fn.init;
cash.fn = cash.prototype = fn;
fn.length = 0;
fn.splice = splice;
if (typeof Symbol === "function") {
  fn[Symbol["iterator"]] = ArrayPrototype[Symbol["iterator"]];
}
fn.map = function(callback) {
  return cash(concat.apply([], map.call(this, (ele, i) => callback.call(ele, i, ele))));
};
fn.slice = function(start, end) {
  return cash(slice.call(this, start, end));
};
const dashAlphaRe = /-([a-z])/g;
function camelCase(str) {
  return str.replace(dashAlphaRe, (match, letter) => letter.toUpperCase());
}
cash.guid = 1;
function matches(ele, selector) {
  const matches2 = ele && (ele["matches"] || ele["webkitMatchesSelector"] || ele["msMatchesSelector"]);
  return !!matches2 && !!selector && matches2.call(ele, selector);
}
function isCash(x) {
  return x instanceof Cash;
}
function isWindow(x) {
  return !!x && x === x.window;
}
function isDocument(x) {
  return !!x && x.nodeType === 9;
}
function isDocumentFragment(x) {
  return !!x && x.nodeType === 11;
}
function isElement(x) {
  return !!x && x.nodeType === 1;
}
function isBoolean(x) {
  return typeof x === "boolean";
}
function isFunction(x) {
  return typeof x === "function";
}
function isString(x) {
  return typeof x === "string";
}
function isUndefined(x) {
  return x === void 0;
}
function isNull(x) {
  return x === null;
}
function isNumeric(x) {
  return !isNaN(parseFloat(x)) && isFinite(x);
}
function isPlainObject(x) {
  if (typeof x !== "object" || x === null)
    return false;
  const proto = Object.getPrototypeOf(x);
  return proto === null || proto === Object.prototype;
}
cash.isWindow = isWindow;
cash.isFunction = isFunction;
cash.isArray = isArray;
cash.isNumeric = isNumeric;
cash.isPlainObject = isPlainObject;
fn.get = function(index2) {
  if (isUndefined(index2))
    return slice.call(this);
  index2 = Number(index2);
  return this[index2 < 0 ? index2 + this.length : index2];
};
fn.eq = function(index2) {
  return cash(this.get(index2));
};
fn.first = function() {
  return this.eq(0);
};
fn.last = function() {
  return this.eq(-1);
};
function each(arr, callback, _reverse) {
  if (_reverse) {
    let i = arr.length;
    while (i--) {
      if (callback.call(arr[i], i, arr[i]) === false)
        return arr;
    }
  } else if (isPlainObject(arr)) {
    const keys = Object.keys(arr);
    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i];
      if (callback.call(arr[key], key, arr[key]) === false)
        return arr;
    }
  } else {
    for (let i = 0, l = arr.length; i < l; i++) {
      if (callback.call(arr[i], i, arr[i]) === false)
        return arr;
    }
  }
  return arr;
}
cash.each = each;
fn.each = function(callback) {
  return each(this, callback);
};
fn.prop = function(prop, value) {
  if (!prop)
    return;
  if (isString(prop)) {
    prop = propMap[prop] || prop;
    if (arguments.length < 2)
      return this[0] && this[0][prop];
    return this.each((i, ele) => {
      ele[prop] = value;
    });
  }
  for (const key in prop) {
    this.prop(key, prop[key]);
  }
  return this;
};
fn.removeProp = function(prop) {
  return this.each((i, ele) => {
    delete ele[propMap[prop] || prop];
  });
};
function extend(...sources) {
  const deep = isBoolean(sources[0]) ? sources.shift() : false, target = sources.shift(), length = sources.length;
  if (!target)
    return {};
  if (!length)
    return extend(deep, cash, target);
  for (let i = 0; i < length; i++) {
    const source = sources[i];
    for (const key in source) {
      if (deep && (isArray(source[key]) || isPlainObject(source[key]))) {
        if (!target[key] || target[key].constructor !== source[key].constructor)
          target[key] = new source[key].constructor();
        extend(deep, target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}
cash.extend = extend;
fn.extend = function(plugins) {
  return extend(fn, plugins);
};
function getCompareFunction(comparator) {
  return isString(comparator) ? (i, ele) => matches(ele, comparator) : isFunction(comparator) ? comparator : isCash(comparator) ? (i, ele) => comparator.is(ele) : !comparator ? () => false : (i, ele) => ele === comparator;
}
fn.filter = function(comparator) {
  const compare = getCompareFunction(comparator);
  return cash(filter.call(this, (ele, i) => compare.call(ele, i, ele)));
};
function filtered(collection, comparator) {
  return !comparator ? collection : collection.filter(comparator);
}
const splitValuesRe = /\S+/g;
function getSplitValues(str) {
  return isString(str) ? str.match(splitValuesRe) || [] : [];
}
fn.hasClass = function(cls) {
  return !!cls && some.call(this, (ele) => isElement(ele) && ele.classList.contains(cls));
};
fn.removeAttr = function(attr2) {
  const attrs = getSplitValues(attr2);
  return this.each((i, ele) => {
    if (!isElement(ele))
      return;
    each(attrs, (i2, a) => {
      ele.removeAttribute(a);
    });
  });
};
function attr(attr2, value) {
  if (!attr2)
    return;
  if (isString(attr2)) {
    if (arguments.length < 2) {
      if (!this[0] || !isElement(this[0]))
        return;
      const value2 = this[0].getAttribute(attr2);
      return isNull(value2) ? void 0 : value2;
    }
    if (isUndefined(value))
      return this;
    if (isNull(value))
      return this.removeAttr(attr2);
    return this.each((i, ele) => {
      if (!isElement(ele))
        return;
      ele.setAttribute(attr2, value);
    });
  }
  for (const key in attr2) {
    this.attr(key, attr2[key]);
  }
  return this;
}
fn.attr = attr;
fn.toggleClass = function(cls, force) {
  const classes = getSplitValues(cls), isForce = !isUndefined(force);
  return this.each((i, ele) => {
    if (!isElement(ele))
      return;
    each(classes, (i2, c) => {
      if (isForce) {
        force ? ele.classList.add(c) : ele.classList.remove(c);
      } else {
        ele.classList.toggle(c);
      }
    });
  });
};
fn.addClass = function(cls) {
  return this.toggleClass(cls, true);
};
fn.removeClass = function(cls) {
  if (arguments.length)
    return this.toggleClass(cls, false);
  return this.attr("class", "");
};
function pluck(arr, prop, deep, until) {
  const plucked = [], isCallback = isFunction(prop), compare = until && getCompareFunction(until);
  for (let i = 0, l = arr.length; i < l; i++) {
    if (isCallback) {
      const val2 = prop(arr[i]);
      if (val2.length)
        push.apply(plucked, val2);
    } else {
      let val2 = arr[i][prop];
      while (val2 != null) {
        if (until && compare(-1, val2))
          break;
        plucked.push(val2);
        val2 = deep ? val2[prop] : null;
      }
    }
  }
  return plucked;
}
function unique(arr) {
  return arr.length > 1 ? filter.call(arr, (item, index2, self) => indexOf.call(self, item) === index2) : arr;
}
cash.unique = unique;
fn.add = function(selector, context) {
  return cash(unique(this.get().concat(cash(selector, context).get())));
};
function computeStyle(ele, prop, isVariable) {
  if (!isElement(ele))
    return;
  const style2 = win.getComputedStyle(ele, null);
  return isVariable ? style2.getPropertyValue(prop) || void 0 : style2[prop] || ele.style[prop];
}
function computeStyleInt(ele, prop) {
  return parseInt(computeStyle(ele, prop), 10) || 0;
}
const cssVariableRe = /^--/;
function isCSSVariable(prop) {
  return cssVariableRe.test(prop);
}
const prefixedProps = {}, { style } = div, vendorsPrefixes = ["webkit", "moz", "ms"];
function getPrefixedProp(prop, isVariable = isCSSVariable(prop)) {
  if (isVariable)
    return prop;
  if (!prefixedProps[prop]) {
    const propCC = camelCase(prop), propUC = `${propCC[0].toUpperCase()}${propCC.slice(1)}`, props = `${propCC} ${vendorsPrefixes.join(`${propUC} `)}${propUC}`.split(" ");
    each(props, (i, p) => {
      if (p in style) {
        prefixedProps[prop] = p;
        return false;
      }
    });
  }
  return prefixedProps[prop];
}
const numericProps = {
  animationIterationCount: true,
  columnCount: true,
  flexGrow: true,
  flexShrink: true,
  fontWeight: true,
  gridArea: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnStart: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowStart: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  widows: true,
  zIndex: true
};
function getSuffixedValue(prop, value, isVariable = isCSSVariable(prop)) {
  return !isVariable && !numericProps[prop] && isNumeric(value) ? `${value}px` : value;
}
function css(prop, value) {
  if (isString(prop)) {
    const isVariable = isCSSVariable(prop);
    prop = getPrefixedProp(prop, isVariable);
    if (arguments.length < 2)
      return this[0] && computeStyle(this[0], prop, isVariable);
    if (!prop)
      return this;
    value = getSuffixedValue(prop, value, isVariable);
    return this.each((i, ele) => {
      if (!isElement(ele))
        return;
      if (isVariable) {
        ele.style.setProperty(prop, value);
      } else {
        ele.style[prop] = value;
      }
    });
  }
  for (const key in prop) {
    this.css(key, prop[key]);
  }
  return this;
}
fn.css = css;
const JSONStringRe = /^\s+|\s+$/;
function getData(ele, key) {
  const value = ele.dataset[key] || ele.dataset[camelCase(key)];
  if (JSONStringRe.test(value))
    return value;
  return attempt(JSON.parse, value);
}
function setData(ele, key, value) {
  value = attempt(JSON.stringify, value);
  ele.dataset[camelCase(key)] = value;
}
function data(name, value) {
  if (!name) {
    if (!this[0])
      return;
    const datas = {};
    for (const key in this[0].dataset) {
      datas[key] = getData(this[0], key);
    }
    return datas;
  }
  if (isString(name)) {
    if (arguments.length < 2)
      return this[0] && getData(this[0], name);
    if (isUndefined(value))
      return this;
    return this.each((i, ele) => {
      setData(ele, name, value);
    });
  }
  for (const key in name) {
    this.data(key, name[key]);
  }
  return this;
}
fn.data = data;
function getDocumentDimension(doc2, dimension) {
  const docEle2 = doc2.documentElement;
  return Math.max(doc2.body[`scroll${dimension}`], docEle2[`scroll${dimension}`], doc2.body[`offset${dimension}`], docEle2[`offset${dimension}`], docEle2[`client${dimension}`]);
}
function getExtraSpace(ele, xAxis) {
  return computeStyleInt(ele, `border${xAxis ? "Left" : "Top"}Width`) + computeStyleInt(ele, `padding${xAxis ? "Left" : "Top"}`) + computeStyleInt(ele, `padding${xAxis ? "Right" : "Bottom"}`) + computeStyleInt(ele, `border${xAxis ? "Right" : "Bottom"}Width`);
}
each([true, false], (i, outer) => {
  each(["Width", "Height"], (i2, prop) => {
    const name = `${outer ? "outer" : "inner"}${prop}`;
    fn[name] = function(includeMargins) {
      if (!this[0])
        return;
      if (isWindow(this[0]))
        return outer ? this[0][`inner${prop}`] : this[0].document.documentElement[`client${prop}`];
      if (isDocument(this[0]))
        return getDocumentDimension(this[0], prop);
      return this[0][`${outer ? "offset" : "client"}${prop}`] + (includeMargins && outer ? computeStyleInt(this[0], `margin${i2 ? "Top" : "Left"}`) + computeStyleInt(this[0], `margin${i2 ? "Bottom" : "Right"}`) : 0);
    };
  });
});
each(["Width", "Height"], (index2, prop) => {
  const propLC = prop.toLowerCase();
  fn[propLC] = function(value) {
    if (!this[0])
      return isUndefined(value) ? void 0 : this;
    if (!arguments.length) {
      if (isWindow(this[0]))
        return this[0].document.documentElement[`client${prop}`];
      if (isDocument(this[0]))
        return getDocumentDimension(this[0], prop);
      return this[0].getBoundingClientRect()[propLC] - getExtraSpace(this[0], !index2);
    }
    const valueNumber = parseInt(value, 10);
    return this.each((i, ele) => {
      if (!isElement(ele))
        return;
      const boxSizing = computeStyle(ele, "boxSizing");
      ele.style[propLC] = getSuffixedValue(propLC, valueNumber + (boxSizing === "border-box" ? getExtraSpace(ele, !index2) : 0));
    });
  };
});
const defaultDisplay = {};
function getDefaultDisplay(tagName) {
  if (defaultDisplay[tagName])
    return defaultDisplay[tagName];
  const ele = createElement(tagName);
  doc.body.insertBefore(ele, null);
  const display = computeStyle(ele, "display");
  doc.body.removeChild(ele);
  return defaultDisplay[tagName] = display !== "none" ? display : "block";
}
function isHidden(ele) {
  return computeStyle(ele, "display") === "none";
}
const displayProperty = "___cd";
fn.toggle = function(force) {
  return this.each((i, ele) => {
    if (!isElement(ele))
      return;
    const show = isUndefined(force) ? isHidden(ele) : force;
    if (show) {
      ele.style.display = ele[displayProperty] || "";
      if (isHidden(ele)) {
        ele.style.display = getDefaultDisplay(ele.tagName);
      }
    } else {
      ele[displayProperty] = computeStyle(ele, "display");
      ele.style.display = "none";
    }
  });
};
fn.hide = function() {
  return this.toggle(false);
};
fn.show = function() {
  return this.toggle(true);
};
function hasNamespaces(ns1, ns2) {
  return !ns2 || !some.call(ns2, (ns) => ns1.indexOf(ns) < 0);
}
const eventsNamespace = "___ce", eventsNamespacesSeparator = ".", eventsFocus = { focus: "focusin", blur: "focusout" }, eventsHover = { mouseenter: "mouseover", mouseleave: "mouseout" }, eventsMouseRe = /^(mouse|pointer|contextmenu|drag|drop|click|dblclick)/i;
function getEventNameBubbling(name) {
  return eventsHover[name] || eventsFocus[name] || name;
}
function getEventsCache(ele) {
  return ele[eventsNamespace] = ele[eventsNamespace] || {};
}
function addEvent(ele, name, namespaces, selector, callback) {
  const eventCache = getEventsCache(ele);
  eventCache[name] = eventCache[name] || [];
  eventCache[name].push([namespaces, selector, callback]);
  ele.addEventListener(name, callback);
}
function parseEventName(eventName) {
  const parts = eventName.split(eventsNamespacesSeparator);
  return [parts[0], parts.slice(1).sort()];
}
function removeEvent(ele, name, namespaces, selector, callback) {
  const cache = getEventsCache(ele);
  if (!name) {
    for (name in cache) {
      removeEvent(ele, name, namespaces, selector, callback);
    }
  } else if (cache[name]) {
    cache[name] = cache[name].filter(([ns, sel, cb]) => {
      if (callback && cb.guid !== callback.guid || !hasNamespaces(ns, namespaces) || selector && selector !== sel)
        return true;
      ele.removeEventListener(name, cb);
    });
  }
}
fn.off = function(eventFullName, selector, callback) {
  if (isUndefined(eventFullName)) {
    this.each((i, ele) => {
      if (!isElement(ele) && !isDocument(ele) && !isWindow(ele))
        return;
      removeEvent(ele);
    });
  } else if (!isString(eventFullName)) {
    for (const key in eventFullName) {
      this.off(key, eventFullName[key]);
    }
  } else {
    if (isFunction(selector)) {
      callback = selector;
      selector = "";
    }
    each(getSplitValues(eventFullName), (i, eventFullName2) => {
      const [nameOriginal, namespaces] = parseEventName(eventFullName2), name = getEventNameBubbling(nameOriginal);
      this.each((i2, ele) => {
        if (!isElement(ele) && !isDocument(ele) && !isWindow(ele))
          return;
        removeEvent(ele, name, namespaces, selector, callback);
      });
    });
  }
  return this;
};
function on(eventFullName, selector, data2, callback, _one) {
  if (!isString(eventFullName)) {
    for (const key in eventFullName) {
      this.on(key, selector, data2, eventFullName[key], _one);
    }
    return this;
  }
  if (!isString(selector)) {
    if (isUndefined(selector) || isNull(selector)) {
      selector = "";
    } else if (isUndefined(data2)) {
      data2 = selector;
      selector = "";
    } else {
      callback = data2;
      data2 = selector;
      selector = "";
    }
  }
  if (!isFunction(callback)) {
    callback = data2;
    data2 = void 0;
  }
  if (!callback)
    return this;
  each(getSplitValues(eventFullName), (i, eventFullName2) => {
    const [nameOriginal, namespaces] = parseEventName(eventFullName2), name = getEventNameBubbling(nameOriginal), isEventHover = nameOriginal in eventsHover, isEventFocus = nameOriginal in eventsFocus;
    if (!name)
      return;
    this.each((i2, ele) => {
      if (!isElement(ele) && !isDocument(ele) && !isWindow(ele))
        return;
      const finalCallback = function(event) {
        if (event.target[`___i${event.type}`])
          return event.stopImmediatePropagation();
        if (event.namespace && !hasNamespaces(namespaces, event.namespace.split(eventsNamespacesSeparator)))
          return;
        if (!selector && (isEventFocus && (event.target !== ele || event.___ot === name) || isEventHover && event.relatedTarget && ele.contains(event.relatedTarget)))
          return;
        let thisArg = ele;
        if (selector) {
          let target = event.target;
          while (!matches(target, selector)) {
            if (target === ele)
              return;
            target = target.parentNode;
            if (!target)
              return;
          }
          thisArg = target;
        }
        Object.defineProperty(event, "currentTarget", {
          configurable: true,
          get() {
            return thisArg;
          }
        });
        Object.defineProperty(event, "delegateTarget", {
          configurable: true,
          get() {
            return ele;
          }
        });
        Object.defineProperty(event, "data", {
          configurable: true,
          get() {
            return data2;
          }
        });
        const returnValue = callback.call(thisArg, event, event.___td);
        if (_one) {
          removeEvent(ele, name, namespaces, selector, finalCallback);
        }
        if (returnValue === false) {
          event.preventDefault();
          event.stopPropagation();
        }
      };
      finalCallback.guid = callback.guid = callback.guid || cash.guid++;
      addEvent(ele, name, namespaces, selector, finalCallback);
    });
  });
  return this;
}
fn.on = on;
function one(eventFullName, selector, data2, callback) {
  return this.on(eventFullName, selector, data2, callback, true);
}
fn.one = one;
fn.ready = function(callback) {
  const cb = () => setTimeout(callback, 0, cash);
  if (doc.readyState !== "loading") {
    cb();
  } else {
    doc.addEventListener("DOMContentLoaded", cb);
  }
  return this;
};
fn.trigger = function(event, data2) {
  if (isString(event)) {
    const [nameOriginal, namespaces] = parseEventName(event), name = getEventNameBubbling(nameOriginal);
    if (!name)
      return this;
    const type = eventsMouseRe.test(name) ? "MouseEvents" : "HTMLEvents";
    event = doc.createEvent(type);
    event.initEvent(name, true, true);
    event.namespace = namespaces.join(eventsNamespacesSeparator);
    event.___ot = nameOriginal;
  }
  event.___td = data2;
  const isEventFocus = event.___ot in eventsFocus;
  return this.each((i, ele) => {
    if (isEventFocus && isFunction(ele[event.___ot])) {
      ele[`___i${event.type}`] = true;
      ele[event.___ot]();
      ele[`___i${event.type}`] = false;
    }
    ele.dispatchEvent(event);
  });
};
function getValue(ele) {
  if (ele.multiple && ele.options)
    return pluck(filter.call(ele.options, (option) => option.selected && !option.disabled && !option.parentNode.disabled), "value");
  return ele.value || "";
}
const queryEncodeSpaceRe = /%20/g, queryEncodeCRLFRe = /\r?\n/g;
function queryEncode(prop, value) {
  return `&${encodeURIComponent(prop)}=${encodeURIComponent(value.replace(queryEncodeCRLFRe, "\r\n")).replace(queryEncodeSpaceRe, "+")}`;
}
const skippableRe = /file|reset|submit|button|image/i, checkableRe = /radio|checkbox/i;
fn.serialize = function() {
  let query = "";
  this.each((i, ele) => {
    each(ele.elements || [ele], (i2, ele2) => {
      if (ele2.disabled || !ele2.name || ele2.tagName === "FIELDSET" || skippableRe.test(ele2.type) || checkableRe.test(ele2.type) && !ele2.checked)
        return;
      const value = getValue(ele2);
      if (!isUndefined(value)) {
        const values = isArray(value) ? value : [value];
        each(values, (i3, value2) => {
          query += queryEncode(ele2.name, value2);
        });
      }
    });
  });
  return query.slice(1);
};
function val(value) {
  if (!arguments.length)
    return this[0] && getValue(this[0]);
  return this.each((i, ele) => {
    const isSelect = ele.multiple && ele.options;
    if (isSelect || checkableRe.test(ele.type)) {
      const eleValue = isArray(value) ? map.call(value, String) : isNull(value) ? [] : [String(value)];
      if (isSelect) {
        each(ele.options, (i2, option) => {
          option.selected = eleValue.indexOf(option.value) >= 0;
        }, true);
      } else {
        ele.checked = eleValue.indexOf(ele.value) >= 0;
      }
    } else {
      ele.value = isUndefined(value) || isNull(value) ? "" : value;
    }
  });
}
fn.val = val;
fn.clone = function() {
  return this.map((i, ele) => ele.cloneNode(true));
};
fn.detach = function(comparator) {
  filtered(this, comparator).each((i, ele) => {
    if (ele.parentNode) {
      ele.parentNode.removeChild(ele);
    }
  });
  return this;
};
const fragmentRe = /^\s*<(\w+)[^>]*>/, singleTagRe = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;
const containers = {
  "*": div,
  tr: tbody,
  td: tr,
  th: tr,
  thead: table,
  tbody: table,
  tfoot: table
};
function parseHTML(html2) {
  if (!isString(html2))
    return [];
  if (singleTagRe.test(html2))
    return [createElement(RegExp.$1)];
  const fragment = fragmentRe.test(html2) && RegExp.$1, container = containers[fragment] || containers["*"];
  container.innerHTML = html2;
  return cash(container.childNodes).detach().get();
}
cash.parseHTML = parseHTML;
fn.empty = function() {
  return this.each((i, ele) => {
    while (ele.firstChild) {
      ele.removeChild(ele.firstChild);
    }
  });
};
function html(html2) {
  if (!arguments.length)
    return this[0] && this[0].innerHTML;
  if (isUndefined(html2))
    return this;
  return this.each((i, ele) => {
    if (!isElement(ele))
      return;
    ele.innerHTML = html2;
  });
}
fn.html = html;
fn.remove = function(comparator) {
  filtered(this, comparator).detach().off();
  return this;
};
function text(text2) {
  if (isUndefined(text2))
    return this[0] ? this[0].textContent : "";
  return this.each((i, ele) => {
    if (!isElement(ele))
      return;
    ele.textContent = text2;
  });
}
fn.text = text;
fn.unwrap = function() {
  this.parent().each((i, ele) => {
    if (ele.tagName === "BODY")
      return;
    const $ele = cash(ele);
    $ele.replaceWith($ele.children());
  });
  return this;
};
fn.offset = function() {
  const ele = this[0];
  if (!ele)
    return;
  const rect = ele.getBoundingClientRect();
  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset
  };
};
fn.offsetParent = function() {
  return this.map((i, ele) => {
    let offsetParent = ele.offsetParent;
    while (offsetParent && computeStyle(offsetParent, "position") === "static") {
      offsetParent = offsetParent.offsetParent;
    }
    return offsetParent || docEle;
  });
};
fn.position = function() {
  const ele = this[0];
  if (!ele)
    return;
  const isFixed = computeStyle(ele, "position") === "fixed", offset = isFixed ? ele.getBoundingClientRect() : this.offset();
  if (!isFixed) {
    const doc2 = ele.ownerDocument;
    let offsetParent = ele.offsetParent || doc2.documentElement;
    while ((offsetParent === doc2.body || offsetParent === doc2.documentElement) && computeStyle(offsetParent, "position") === "static") {
      offsetParent = offsetParent.parentNode;
    }
    if (offsetParent !== ele && isElement(offsetParent)) {
      const parentOffset = cash(offsetParent).offset();
      offset.top -= parentOffset.top + computeStyleInt(offsetParent, "borderTopWidth");
      offset.left -= parentOffset.left + computeStyleInt(offsetParent, "borderLeftWidth");
    }
  }
  return {
    top: offset.top - computeStyleInt(ele, "marginTop"),
    left: offset.left - computeStyleInt(ele, "marginLeft")
  };
};
fn.children = function(comparator) {
  return filtered(cash(unique(pluck(this, (ele) => ele.children))), comparator);
};
fn.contents = function() {
  return cash(unique(pluck(this, (ele) => ele.tagName === "IFRAME" ? [ele.contentDocument] : ele.tagName === "TEMPLATE" ? ele.content.childNodes : ele.childNodes)));
};
fn.find = function(selector) {
  return cash(unique(pluck(this, (ele) => find(selector, ele))));
};
const HTMLCDATARe = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, scriptTypeRe = /^$|^module$|\/(java|ecma)script/i, scriptAttributes = ["type", "src", "nonce", "noModule"];
function evalScripts(node, doc2) {
  const collection = cash(node);
  collection.filter("script").add(collection.find("script")).each((i, ele) => {
    if (scriptTypeRe.test(ele.type) && docEle.contains(ele)) {
      const script = createElement("script");
      script.text = ele.textContent.replace(HTMLCDATARe, "");
      each(scriptAttributes, (i2, attr2) => {
        if (ele[attr2])
          script[attr2] = ele[attr2];
      });
      doc2.head.insertBefore(script, null);
      doc2.head.removeChild(script);
    }
  });
}
function insertElement(anchor, target, left, inside, evaluate) {
  if (inside) {
    anchor.insertBefore(target, left ? anchor.firstChild : null);
  } else {
    if (anchor.nodeName === "HTML") {
      anchor.parentNode.replaceChild(target, anchor);
    } else {
      anchor.parentNode.insertBefore(target, left ? anchor : anchor.nextSibling);
    }
  }
  if (evaluate) {
    evalScripts(target, anchor.ownerDocument);
  }
}
function insertSelectors(selectors, anchors, inverse, left, inside, reverseLoop1, reverseLoop2, reverseLoop3) {
  each(selectors, (si, selector) => {
    each(cash(selector), (ti, target) => {
      each(cash(anchors), (ai, anchor) => {
        const anchorFinal = inverse ? target : anchor, targetFinal = inverse ? anchor : target, indexFinal = inverse ? ti : ai;
        insertElement(anchorFinal, !indexFinal ? targetFinal : targetFinal.cloneNode(true), left, inside, !indexFinal);
      }, reverseLoop3);
    }, reverseLoop2);
  }, reverseLoop1);
  return anchors;
}
fn.after = function() {
  return insertSelectors(arguments, this, false, false, false, true, true);
};
fn.append = function() {
  return insertSelectors(arguments, this, false, false, true);
};
fn.appendTo = function(selector) {
  return insertSelectors(arguments, this, true, false, true);
};
fn.before = function() {
  return insertSelectors(arguments, this, false, true);
};
fn.insertAfter = function(selector) {
  return insertSelectors(arguments, this, true, false, false, false, false, true);
};
fn.insertBefore = function(selector) {
  return insertSelectors(arguments, this, true, true);
};
fn.prepend = function() {
  return insertSelectors(arguments, this, false, true, true, true, true);
};
fn.prependTo = function(selector) {
  return insertSelectors(arguments, this, true, true, true, false, false, true);
};
fn.replaceWith = function(selector) {
  return this.before(selector).remove();
};
fn.replaceAll = function(selector) {
  cash(selector).replaceWith(this);
  return this;
};
fn.wrapAll = function(selector) {
  let structure = cash(selector), wrapper = structure[0];
  while (wrapper.children.length)
    wrapper = wrapper.firstElementChild;
  this.first().before(structure);
  return this.appendTo(wrapper);
};
fn.wrap = function(selector) {
  return this.each((i, ele) => {
    const wrapper = cash(selector)[0];
    cash(ele).wrapAll(!i ? wrapper : wrapper.cloneNode(true));
  });
};
fn.wrapInner = function(selector) {
  return this.each((i, ele) => {
    const $ele = cash(ele), contents = $ele.contents();
    contents.length ? contents.wrapAll(selector) : $ele.append(selector);
  });
};
fn.has = function(selector) {
  const comparator = isString(selector) ? (i, ele) => find(selector, ele).length : (i, ele) => ele.contains(selector);
  return this.filter(comparator);
};
fn.is = function(comparator) {
  const compare = getCompareFunction(comparator);
  return some.call(this, (ele, i) => compare.call(ele, i, ele));
};
fn.next = function(comparator, _all, _until) {
  return filtered(cash(unique(pluck(this, "nextElementSibling", _all, _until))), comparator);
};
fn.nextAll = function(comparator) {
  return this.next(comparator, true);
};
fn.nextUntil = function(until, comparator) {
  return this.next(comparator, true, until);
};
fn.not = function(comparator) {
  const compare = getCompareFunction(comparator);
  return this.filter((i, ele) => (!isString(comparator) || isElement(ele)) && !compare.call(ele, i, ele));
};
fn.parent = function(comparator) {
  return filtered(cash(unique(pluck(this, "parentNode"))), comparator);
};
fn.index = function(selector) {
  const child = selector ? cash(selector)[0] : this[0], collection = selector ? this : cash(child).parent().children();
  return indexOf.call(collection, child);
};
fn.closest = function(comparator) {
  const filtered2 = this.filter(comparator);
  if (filtered2.length)
    return filtered2;
  const $parent = this.parent();
  if (!$parent.length)
    return filtered2;
  return $parent.closest(comparator);
};
fn.parents = function(comparator, _until) {
  return filtered(cash(unique(pluck(this, "parentElement", true, _until))), comparator);
};
fn.parentsUntil = function(until, comparator) {
  return this.parents(comparator, until);
};
fn.prev = function(comparator, _all, _until) {
  return filtered(cash(unique(pluck(this, "previousElementSibling", _all, _until))), comparator);
};
fn.prevAll = function(comparator) {
  return this.prev(comparator, true);
};
fn.prevUntil = function(until, comparator) {
  return this.prev(comparator, true, until);
};
fn.siblings = function(comparator) {
  return filtered(cash(unique(pluck(this, (ele) => cash(ele).parent().children().not(ele)))), comparator);
};
function ajax(url = "", method = "get") {
  return new Promise(function(resolve, reject, notify) {
    if (!XMLHttpRequest)
      reject(`Not support browser`);
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {
      if (this.status === 200 || this.status === 201) {
        resolve(this.responseText);
      } else {
        reject(this.responseText);
      }
    });
    xhr.addEventListener("error", function() {
      reject("error request");
    });
    xhr.open(method, url);
    xhr.send();
  });
}
const isTouchDevice = function() {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
};
const $html = cash("html");
const $header = cash(".layout-header");
function toggleNavigation() {
  const $button = $header.find(".layout-header__buttons > button");
  const $navigation = $header.find(".header-navigation");
  const $dropdownContents = $header.find(".header-navigation, .layout-header__buttons > button");
  $dropdownContents.on("click", (e) => e.stopPropagation());
  $button.on("click", function() {
    const $self = cash(this);
    $html.off("click.headerButtons");
    if ($self.hasClass("navigation")) {
      if ($self.hasClass("on")) {
        $self.removeClass("on");
        $navigation.removeClass("on");
      } else {
        $self.addClass("on");
        $navigation.addClass("on");
      }
    }
    $html.on("click.headerButtons", () => {
      $navigation.removeClass("on");
      $self.removeClass("on");
    });
  });
}
function initNavigation() {
  let $buttons = $header.find(".header-navigation > ul > li > a");
  $buttons.on("click", function() {
    if (cash(window).width() < 768)
      return true;
    return !(isTouchDevice() && cash(this).next().length);
  });
}
function layout() {
  toggleNavigation();
  initNavigation();
}
function shuffle($el, options) {
  options = Object.assign({}, {
    text: "",
    waitChar: "-",
    charSpeed: 1,
    moveFix: 25,
    moveRange: 10,
    moveTrigger: 25,
    fps: 60,
    pattern: "abcdefghijklmnopqrstuvwxyz0123456789-_!@#$%^&*()+~<>",
    randomTextType: null,
    callback: null
  }, options);
  options.text = options.text.trim();
  let textKeys = [];
  let frame;
  let position;
  let currentText;
  let checkLast;
  let checkPlay = false;
  function stack() {
    let str = currentText;
    checkLast = true;
    for (let tick = position; tick <= frame; tick++) {
      if (textKeys[tick] !== 0 && textKeys[tick] != null) {
        checkLast = false;
        const selectKey = textKeys[tick];
        if (Math.abs(selectKey) <= options.moveTrigger) {
          let txt = "";
          switch (options.randomTextType) {
            case "pattern":
              txt = randomWord(options.pattern);
              break;
            case "unicode":
            default:
              const unicode = Math.min(Math.max(options.text.charCodeAt(tick) + selectKey, 33), 126);
              txt = String.fromCharCode(unicode);
              break;
          }
          str += txt;
        } else {
          str += options.waitChar;
        }
        selectKey > 0 ? textKeys[tick] -= 1 : textKeys[tick] += 1;
      } else {
        if (position === tick - 1) {
          position = tick;
          currentText = options.text.substring(0, position);
        }
        str += options.text.charAt(tick);
      }
      $el.textContent = str;
    }
    if (frame <= options.text.length) {
      frame += options.charSpeed;
    } else {
      checkPlay = true;
    }
    if (checkLast && checkPlay) {
      if ($el.dataset.id)
        clearInterval(parseInt($el.dataset.id));
      $el.textContent = currentText;
      $el.dataset.run = "false";
      if (options.callback)
        options.callback();
    }
  }
  function randomWord(pattern) {
    const n = Math.floor(Math.random() * pattern.length);
    return pattern.substring(n, n + 1);
  }
  if (options.text && $el.dataset.run !== "true") {
    $el.dataset.run = "true";
    $el.textContent = options.waitChar;
    for (let i = 0; i <= options.text.length - 1; i++) {
      if (options.text.charAt(0) !== " ") {
        textKeys[i] = (options.moveFix + Math.round(Math.random() * options.moveRange)) * (Math.round(Math.random()) - 0.5) * 2;
      } else {
        textKeys[i] = 0;
      }
    }
    frame = 0;
    position = 0;
    currentText = "";
    clearInterval(parseInt($el.dataset.id));
    const intervalId = setInterval(stack, 1e3 / options.fps);
    $el.dataset.id = intervalId.toString();
  }
}
function toggleCategoryNavigation() {
  const $button = cash(".index-categories > button");
  if (!$button.length)
    return;
  $button.on("click", function() {
    cash(this).parent().toggleClass("index-categories--on");
  });
}
function mouseOverItems() {
  const $works = cash(".index-works a, .index-random-works a");
  $works.each(function() {
    cash(this).on("mouseenter", function() {
      if (cash(window).width() < 768)
        return true;
      const $caption = cash(this).find(".index-work__caption");
      const $elements = $caption.find("strong, em");
      $elements.each(function(n) {
        const self = this;
        setTimeout(() => shuffle(self, {
          text: self.innerText,
          pattern: "abcdefghijklmnopqrstuvwxyz0123456789-_!@#$%^&*()+~<>\u3131\u3134\u3137\u3139\u3141\u3142\u3145\u3147\u3148\u314A\u314B\u314C\u314D\u314E\u3132\u3138\u3143\u3146\u3149",
          randomTextType: n === 0 ? "pattern" : "unicode"
        }), 180 * n);
      });
    });
  });
}
function index() {
  toggleCategoryNavigation();
  mouseOverItems();
}
function LightBox() {
  const id = "lightbox";
  const htmlClass = "popup-lightbox";
  this.$body = null;
  function template(src, alt) {
    const template2 = document.createElement("template");
    let html2 = `<div id="${id}" class="lightbox">`;
    html2 += `<figure class="lightbox__body">`;
    html2 += `<img src="${src}" alt="${alt}"/>`;
    html2 += `</figure>`;
    html2 += `</div>`;
    html2 = html2.trim();
    template2.innerHTML = html2;
    return template2.content.firstChild;
  }
  this.open = function(src, alt) {
    if (!!this.$body) {
      this.$body.remove();
      this.$body = null;
    }
    this.$body = template(src, alt);
    this.$body.addEventListener("click", () => this.close());
    document.body.appendChild(this.$body);
    document.querySelector("html").classList.add(htmlClass);
  };
  this.close = function() {
    if (!this.$body)
      return;
    this.$body.remove();
    this.$body = null;
    document.querySelector("html").classList.remove(htmlClass);
  };
}
const app$1 = window.app;
const $detail = cash(".detail");
function toggleLikeButtonEvent() {
  const $button = $detail.find(".detail__like > button");
  $button.on("click", function() {
    const $self = cash(this);
    $self.prop("disabled", true);
    ajax(`/on-like/${app$1.srl}/`, "post").then(function(res) {
      try {
        res = JSON.parse(res);
        if (!res.success)
          throw new Error();
        $self.find("em").text(res.star);
      } catch (e) {
        throw new Error();
      }
    }).catch(function(error) {
      $self.prop("disabled", false);
      alert("Error update like");
    });
  });
}
function initImagesInGridItem() {
  const lightbox = new LightBox();
  const $images = $detail.find("img");
  $images.each(function() {
    if (!!this.closest("picture"))
      return;
    this.addEventListener("click", (e) => {
      if (!e.target.src)
        return;
      lightbox.open(e.target.src, e.target.name);
    });
  });
}
function initHeadingElements() {
  const { origin, pathname } = location;
  const $elements = $detail.find(".detail__body").find("h1,h2,h3,h4,h5,h6");
  $elements.each((_, el) => {
    let text2 = el.innerText.replace(/\s+/g, "-").toLowerCase();
    const appendElement = document.createElement("a");
    appendElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
    appendElement.href = `${origin}${pathname}#${text2}`;
    appendElement.className = "anchor";
    el.insertBefore(appendElement, el.firstChild);
  });
}
function detail() {
  toggleLikeButtonEvent();
  initImagesInGridItem();
  initHeadingElements();
}
var app = /* @__PURE__ */ (() => '/*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}h1{font-size:2em;margin:.67em 0}hr{box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button}button::-moz-focus-inner,[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner{border-style:none;padding:0}button:-moz-focusring,[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{vertical-align:baseline}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details{display:block}summary{display:list-item}template{display:none}[hidden]{display:none}:root{--color-text-hsl: 0 0% 13%;--color-text: hsl(var(--color-text-hsl));--color-bg-hsl: 210 25% 98%;--color-bg: hsl(var(--color-bg-hsl));--color-text-blur-hsl: 0 0% 47%;--color-text-blur: hsl(var(--color-text-blur-hsl));--color-key-hsl: 350 70% 41%;--color-key: hsl(var(--color-key-hsl));--color-sub-hsl: 233 100% 65%;--color-sub: hsl(var(--color-sub-hsl));--size-side-padding: 24px;--size-header-height: 48px;--font-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";--font-eng: "ortsa", Helvetica, Arial, sans-serif;--font-title: "AritaBuri", sans-serif;--font-code: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace}@media (prefers-color-scheme: dark){:root{color-scheme:dark;--color-text-hsl: 0 0% 85%;--color-bg-hsl: 0 0% 13%;--color-text-blur-hsl: 0 0% 47%;--color-key-hsl: 142 76% 46%;--color-sub-hsl: 250 80% 68%}}@media (min-width: 768px){:root{--size-side-padding: 54px;--size-header-height: 54px}}html{touch-action:manipulation}body{margin:0;min-width:320px;color:var(--color-text);background:var(--color-bg);-webkit-touch-callout:none;overflow-x:hidden}body,button,input,textarea,select{font-family:var(--font-base);font-size:1rem;line-height:1.54;-webkit-text-size-adjust:none}a{color:var(--color-key)}code,kbd,pre,samp{font-family:var(--font-code)}::selection{background:var(--color-key);color:#fff}.layout-header{z-index:3;position:sticky;left:0;right:0;top:0;height:var(--size-header-height);box-sizing:border-box;background:var(--header-color-bg, rgba(255, 255, 255, .9));box-shadow:var(--header-shadow, 0 0 0 .5px rgba(0, 0, 0, .1), 0 1px 8px rgba(0, 0, 0, .1))}@supports (backdrop-filter: blur(15px)){.layout-header{backdrop-filter:blur(12px)}}.layout-header__wrap{position:relative;box-sizing:border-box;height:100%;max-width:1024px;margin:0 auto}.layout-header__logo{position:absolute;left:50%;top:0;margin:0;z-index:2;transform:translate(-50%)}.layout-header__logo a{display:block;padding:5px;-webkit-tap-highlight-color:transparent;user-select:none}.layout-header__logo img{display:block;width:76px}.layout-header__buttons>button{display:block;position:absolute;top:0;bottom:0;width:var(--size-header-height);height:var(--size-header-height);margin:0;padding:0;box-sizing:border-box;border:none;background:none;outline:none;user-select:none;cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0)}.layout-header__buttons>button svg{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);transform-origin:50% 50%;color:var(--header-color-button-fill, rgb(34, 34, 34));transition:transform .2s ease-out}.layout-header__buttons>button svg:nth-child(1){transform:translate(-50%,-50%) scale(1)}.layout-header__buttons>button svg:nth-child(2){transform:translate(-50%,-50%) scale(0)}.layout-header__buttons>button:active svg:nth-child(1){transform:translate(-50%,-50%) scale(.75)}.layout-header__buttons>button.navigation{left:0}.layout-header__buttons>button.on svg:nth-child(1){transform:translate(-50%,-50%) scale(0)}.layout-header__buttons>button.on svg:nth-child(2){transform:translate(-50%,-50%) scale(1)}.layout-header__buttons>button.on:active svg:nth-child(2){transform:translate(-50%,-50%) scale(.75)}@media (min-width: 768px){.layout-header{padding:0 var(--size-side-padding)}.layout-header__logo{left:24px;top:6px;margin:0;transform:none}.layout-header__logo a{padding:0}.layout-header__logo img{width:86px}.layout-header__buttons{display:none}}@media (prefers-color-scheme: dark){.layout-header{--header-color-button-fill: rgb(255 255 255);--header-color-bg: rgb(0 0 0 / 80%)}}.header-navigation{--color-bg-gradient-start: rgb(204 91 64 / 95%);--color-bg-gradient-end: rgb(123 42 121 / 95%);display:none;position:absolute;left:0;right:0;top:var(--size-header-height);box-sizing:border-box;padding:24px var(--size-side-padding) 30px;box-shadow:inset 0 2px 8px #0003;user-select:none;background:var(--color-key);background:linear-gradient(to bottom,var(--color-bg-gradient-start),var(--color-bg-gradient-end))}.header-navigation a{display:block;text-decoration:none;-webkit-tap-highlight-color:transparent;transition:opacity .12s ease-out;box-sizing:border-box;font-family:var(--font-eng)}.header-navigation ul{display:grid;gap:16px;margin:0;padding:0;list-style:none;box-sizing:border-box}.header-navigation ul>li>a{font-size:18px;font-weight:600;color:#fff}.header-navigation ul>li>a:active{opacity:.5}.header-navigation li{box-sizing:border-box}.header-navigation ol{margin:6px 0 0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(2,1fr);box-sizing:border-box}.header-navigation ol a{padding:6px 16px 6px 0;box-sizing:border-box;color:#fff;line-height:1.42;font-size:13px;font-weight:400}.header-navigation ol a:active{opacity:.75}.header-navigation.on{display:block}@media (min-width: 768px){.header-navigation{display:block;left:auto;right:0;top:0;height:var(--size-header-height);margin:0;padding:0;background:none;box-shadow:none}.header-navigation ul{display:flex;align-items:center;gap:0;height:100%}.header-navigation ul>li{height:100%}.header-navigation ul>li>a{display:grid;align-content:center;height:100%;padding:0 24px;font-family:var(--font-eng);font-weight:600;font-size:.875rem;color:var(--color-text);text-decoration:none;transition:color .12s ease-out,background .12s ease-out}.header-navigation ul>li>a:active{opacity:1}.header-navigation ul>li>div{position:relative;display:none}.header-navigation ul>li:focus-within>a,.header-navigation ul>li:hover>a{background:rgba(0,0,0,.03);color:var(--color-key)}.header-navigation ul>li:focus-within>div,.header-navigation ul>li:hover>div{display:block}.header-navigation ul>li.on>a{color:var(--color-key)}.header-navigation ol{display:block;margin:0;padding:16px 0;position:absolute;left:0;top:0;min-width:120px;border-bottom-left-radius:4px;border-bottom-right-radius:4px;background:var(--color-key);background:linear-gradient(to bottom,var(--color-bg-gradient-start),var(--color-bg-gradient-end))}.header-navigation ol>li>a{padding:4px 25px;color:#fff;font-size:.75rem;font-weight:500;text-decoration:none;white-space:nowrap}.header-navigation ol>li>a:hover,.header-navigation ol>li>a:active{opacity:.75}.header-navigation ol>li.on>a{text-decoration:underline}.header-navigation ol>li.on>a:hover{opacity:1}}@media (prefers-color-scheme: dark){.header-navigation{--color-bg-gradient-start: rgb(28 205 92 / 95%);--color-bg-gradient-end: rgba(8 188 140 / 95%)}}@media (prefers-color-scheme: dark) and (min-width: 768px){.header-navigation ul>li:focus-within>a,.header-navigation ul>li:hover>a{background:rgba(255,255,255,.07)}}.layout-footer{margin:44px 0 0;padding:0 0 24px;box-sizing:border-box}.layout-footer__copyright{text-align:center;margin:0;font-size:10px;font-weight:400;color:var(--color-text-blur);user-select:none}@media (min-width: 768px){.layout-footer{margin:72px 0 0}}.index{--size-intro-margin-top: 42px;--size-works-gap: 16px;margin:var(--size-intro-margin-top) 0 0}@media (min-width: 768px){.index{--size-intro-margin-top: 36px}}@media (min-width: 1024px){.index{--size-intro-margin-top: 54px;--size-works-gap: 24px}}@media (min-width: 1440px){.index{--size-works-gap: 30px}}.index-header{--color-index-header-title: var(--color-text);margin:0 0 24px;padding:0 var(--size-side-padding)}.index-header__title{margin:0;text-align:center;font-family:var(--font-eng);font-size:32px;line-height:1.15;letter-spacing:-.5px;font-weight:600;color:var(--color-index-header-title)}@media (min-width: 768px){.index-header__title{font-size:42px}}@media (prefers-color-scheme: dark){.index-header{--color-index-header-title: #fff}}.index-categories{--count-categories-column: 2;margin:16px calc(var(--size-side-padding) * -1) calc(var(--size-side-padding) * -1);user-select:none}.index-categories>button{width:100%;display:block;box-sizing:border-box;margin:0;padding:0 var(--size-side-padding);border:none;background:none;background:rgb(230,230,230);cursor:pointer;-webkit-tap-highlight-color:transparent;outline:none;color:var(--color-text)}.index-categories>button:active{opacity:.75}.index-categories>button span{display:flex;align-items:center;justify-content:space-between;height:44px;box-sizing:border-box}.index-categories>button em{display:flex;font-family:var(--font-eng);font-size:14px;font-weight:500;font-style:normal;letter-spacing:-.25px}.index-categories>button svg{display:block;margin-right:3px;width:12px;height:6px;transition:transform .2s ease-out}.index-categories>nav{display:none;background:rgb(240,240,240);padding:15px 0}.index-categories>nav ul{margin:0;padding:0;list-style:none;box-sizing:border-box;display:grid;grid-template-columns:repeat(var(--count-categories-column),1fr)}.index-categories>nav li{font-size:0}.index-categories>nav a{display:block;padding:8px var(--size-side-padding);font-family:var(--font-eng);font-size:.8125rem;font-weight:400;color:var(--color-text);text-decoration:none;box-sizing:border-box;letter-spacing:-.25px;-webkit-tap-highlight-color:transparent}.index-categories>nav a:active{opacity:.5}.index-categories>nav em{font-style:normal}.index-categories>nav em:before{content:"("}.index-categories>nav em:after{content:")"}.index-categories>nav li.on a{color:var(--color-key)}.index-categories>nav li.on a:active{opacity:1}.index-categories--on>button{background:rgb(210,210,210)}.index-categories--on>button svg{transform:scaleY(-1)}.index-categories--on>nav{display:block}@media (min-width: 480px){.index-categories{--count-categories-column: 3;margin-bottom:-8px}}@media (min-width: 768px){.index-categories{margin:4px 0 10px}.index-categories>button{display:none}.index-categories>nav{display:block;background:none;margin:0;padding:0}.index-categories>nav ul{display:flex;margin:0;padding:0;list-style:none;flex-wrap:wrap;box-sizing:border-box;justify-content:center}.index-categories>nav li{width:auto}.index-categories>nav a{padding:0 6px;font-size:.75rem}.index-categories>nav a:hover{opacity:1;text-decoration:underline}.index-categories>nav li.on a{color:var(--color-key)}.index-categories>nav li.on a:active{opacity:1}.index-categories>nav li.on a:hover{text-decoration:none}}@media (prefers-color-scheme: dark){.index-categories>button{background:#111}.index-categories>button:active{opacity:.75}.index-categories--on>button{opacity:.75}.index-categories--on>nav{background:#1a1a1a}}@media (prefers-color-scheme: dark) and (min-width: 768px){.index-categories>nav{background:none}}.index-works{--count-works-column: 1;--size-works-margin-top: 0;--side-works-padding: 0;margin:var(--size-works-margin-top) auto 0;padding:var(--side-works-padding)}.index-works__list{max-width:1440px;margin:0 auto;padding:0;list-style:none;display:grid;grid-gap:var(--size-works-gap);grid-template-columns:repeat(var(--count-works-column),1fr)}.index-works--body{--size-works-margin-top: 32px}@media (min-width: 480px){.index-works{--count-works-column: 2;--side-works-padding: 0 var(--size-side-padding);--size-works-margin-top: 32px}}@media (min-width: 768px){.index-works{--size-works-margin-top: 32px}}@media (min-width: 1024px){.index-works{--count-works-column: 4}.index-works--head{--size-works-margin-top: 30px}.index-works--body{--size-works-margin-top: 36px}}.index-work{--size-image-height: 68vw;--size-image-max-height: auto;box-sizing:border-box;min-width:0}.index-work__wrap{display:block;text-decoration:none;padding:0 0 8px;-webkit-tap-highlight-color:transparent}.index-work__image{position:relative;margin:0;overflow:hidden;background:rgb(240,240,240);height:var(--size-image-height);max-height:var(--size-image-max-height);box-sizing:border-box}.index-work__image img{position:absolute;left:50%;top:50%;display:block;width:100%;transform:translate(-50%,-50%) scale(1);transform-origin:50% 50%;transition:transform .2s ease-out 50ms}@supports (object-fit: cover){.index-work__image img{left:0;top:0;width:100%;height:100%;object-fit:cover;transform:scale(1)}}.index-work__image svg{display:block;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:48px;height:48px;color:var(--color-text-blur);opacity:.75;stroke-width:.75}.index-work__image:active img{transform:scale(1.05)}.index-work__caption{padding:12px 20px 0;text-align:center}.index-work__caption strong{display:block;font-size:.875rem;color:var(--color-text);font-weight:600;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.index-work__caption span{display:block;margin:0;font-family:var(--font-eng);font-size:.625rem;color:var(--color-text-blur)}.index-work__caption em{font-style:normal}.index-work__caption em:nth-child(n+2):before{content:" / "}@media (min-width: 480px){.index-work{--size-image-height: 28vw}.index-work__image{border-radius:2px}.index-work__caption{padding:8px 0 0;text-align:left}}@media (min-width: 768px){.index-work__wrap:hover .index-work__image img{transform:scale(1.1) translate(-45%,-45%)}@supports (object-fit: cover){.index-work__wrap:hover .index-work__image img{transform:scale(1.1)}}.index-work__image{box-sizing:border-box;overflow:hidden;transform:translateZ(0)}.index-work__image img{transition:transform .3s ease-out;transform-origin:50% 50%;backface-visibility:hidden}}@media (min-width: 1024px){.index-work{--size-image-height: 15vw;--size-image-max-height: 200px}}@media (min-width: 1440px){.index-work{--size-image-height: 20vw;--size-image-max-height: 240px}}@media (prefers-color-scheme: dark){.index-work__image{background:#111}}.index-random-works{position:relative;margin:16px 0 0;padding:32px 0 0;box-sizing:border-box}.index-random-works:before{content:"";display:block;position:absolute;left:50%;width:100vw;max-width:100%;top:0;bottom:0;transform:translate(-50%);background:rgba(0,0,0,.05);box-sizing:border-box}.index-random-works__list{position:relative;padding:0 0 16px;list-style:none;display:block;margin:0;white-space:nowrap;font-size:0;line-height:0;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;-webkit-scroll-snap-type:x mandatory;scroll-snap-type:x mandatory;-webkit-scroll-padding-left:24px;scroll-padding-left:24px}.index-random-works__item{--size-image-height: 55vw;--size-image-max-height: 240px;position:relative;display:inline-block;margin-left:16px;padding:0;-webkit-scroll-snap-align:start;scroll-snap-align:start;vertical-align:top;white-space:normal;line-height:normal;font-size:initial;width:80vw}.index-random-works__item:first-child{margin-left:24px}.index-random-works__item:last-child{margin-right:24px}.index-random-works .index-work__image{background:rgb(255,255,255)}@media (min-width: 480px){.index-random-works__item{--size-image-height: 28vw;width:40vw}}@media (min-width: 768px){.index-random-works{margin-top:24px;padding-top:36px}.index-random-works__list{display:block;padding-bottom:16px;margin:0;white-space:nowrap;font-size:0;line-height:0;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;-webkit-scroll-snap-type:x mandatory;scroll-snap-type:x mandatory;-webkit-scroll-padding-left:54px;scroll-padding-left:54px}.index-random-works__item{position:relative;display:inline-block;margin-left:24px;padding:0;-webkit-scroll-snap-align:start;scroll-snap-align:start;vertical-align:top;white-space:normal;line-height:normal;font-size:initial;--size-image-max-height: 240px}.index-random-works__item:first-child{margin-left:54px}.index-random-works__item:last-child{margin-right:54px}}@media (min-width: 1024px){.index-random-works{padding:48px var(--size-side-padding) 36px}.index-random-works__list{max-width:1440px;overflow:visible;white-space:normal;display:grid;grid-template-columns:repeat(4,1fr);grid-gap:var(--size-works-gap);padding:0;margin:0 auto}.index-random-works__item{--size-image-height: 15vw;--size-image-max-height: 200px;display:block;margin-left:0;padding:0;width:auto}.index-random-works__item:first-child{margin-left:0}.index-random-works__item:last-child{margin-right:0}}@media (min-width: 1440px){.index-random-works__item{--size-image-height: 20vw;--size-image-max-height: 240px}}@media (prefers-color-scheme: dark){.index-random-works:before{background:rgba(0,0,0,.25)}.index-random-works .index-work__image{background:rgb(48,48,48)}}.index-empty{padding:62px 0}.index-empty img{width:180px;max-width:100%;display:block;margin:0 auto}.index-empty p{margin:32px 0 0;text-align:center;font-size:1.25rem;font-weight:500;font-family:var(--font-eng)}.index-paginate{--size-paginate-item: 48px;--size-paginate-item-text: 14px;--color-paginate-active-bg: #ddd;margin:16px 0 0}.index-paginate .paginate{align-items:center;justify-content:center}.index-paginate .paginate strong,.index-paginate .paginate a{display:flex;align-items:center;justify-content:center;width:var(--size-paginate-item);height:var(--size-paginate-item);font-family:var(--font-eng);font-size:var(--size-paginate-item-text);color:var(--color-text);font-weight:500;box-sizing:border-box;user-select:none;text-decoration:none;-webkit-tap-highlight-color:transparent}.index-paginate .paginate a:active{background:var(--color-paginate-active-bg);border-radius:2px}.index-paginate .paginate strong{color:var(--color-key)}.index-paginate .paginate__prev,.index-paginate .paginate__next{font-size:0}.index-paginate .paginate__prev svg,.index-paginate .paginate__next svg{display:block}.index-paginate .paginate--mobile{display:flex}.index-paginate .paginate--desktop{display:none}@media (min-width: 768px){.index-paginate{--size-paginate-item: 40px;margin-top:32px}.index-paginate .paginate--mobile{display:none}.index-paginate .paginate--desktop{display:flex}}@media (prefers-color-scheme: dark){.index-paginate{--color-paginate-active-bg: #1a1a1a}}.intro__title{font-size:0}.intro__index{--size-intro-margin-top: 0px}@media (min-width: 480px){.intro__index{--size-intro-margin-top: var(--size-side-padding)}}@media (min-width: 768px){.intro__index{--size-intro-margin-top: 64px}}@media (min-width: 1440px){.intro__index{--size-intro-margin-top: 72px}}.redgoose-body{--color-text: #222;--color-text-key: #b31f37;--color-text-title: #111;--color-text-code: #4f64ff;--color-content-bg: #f3f4f5;--color-content-line: #ddd;--color-blockqueote-bg: rgb(0 0 0 / 10%);--size-text: 1rem;--size-text-length: 1.75;--size-margin-vertical: 2rem;font-size:var(--size-text);line-height:var(--size-text-length);color:var(--color-text)}.redgoose-body h1,.redgoose-body h2,.redgoose-body h3,.redgoose-body h4,.redgoose-body h5,.redgoose-body h6{line-height:1.25;font-weight:600;color:var(--color-text-title)}.redgoose-body h1,.redgoose-body h2{margin:2.5rem 0 1.5rem;font-weight:800}.redgoose-body h3,.redgoose-body h4{margin:2rem 0 1.25rem;font-weight:700}.redgoose-body h5,.redgoose-body h6{margin:1.5rem 0 1rem}.redgoose-body h1{font-size:2em;letter-spacing:-1px}.redgoose-body h2{font-size:1.75em;letter-spacing:-.75px}.redgoose-body h3{font-size:1.5em;letter-spacing:-.5px}.redgoose-body h4{font-size:1.25em;letter-spacing:-.25px}.redgoose-body h5{font-size:1em}.redgoose-body h6{font-size:.9375em}.redgoose-body p{margin:var(--size-margin-vertical) 0}.redgoose-body ul,.redgoose-body ol{margin:var(--size-margin-vertical) 0;padding-left:1.125rem}.redgoose-body ul li,.redgoose-body ol li{margin:.25rem 0}.redgoose-body a{color:var(--color-text-key)}.redgoose-body picture,.redgoose-body img{display:block;margin:calc(var(--size-margin-vertical) * 2.5) auto var(--size-margin-vertical);max-width:100%}.redgoose-body h1+*>img:first-child,.redgoose-body h1+*>picture:first-child,.redgoose-body h1+img,.redgoose-body h1+picture,.redgoose-body h2+*>img:first-child,.redgoose-body h2+*>picture:first-child,.redgoose-body h2+img,.redgoose-body h2+picture,.redgoose-body h3+*>img:first-child,.redgoose-body h3+*>picture:first-child,.redgoose-body h3+img,.redgoose-body h3+picture{margin-top:1rem}.redgoose-body picture>img{margin:0 auto}.redgoose-body hr{--size: 1.25em;display:block;margin:calc(var(--size-margin-vertical) * 2.5) 0;padding:0 0 calc(var(--size) * .5);border:none}.redgoose-body hr:after{content:"...";position:relative;display:block;top:calc(var(-1) * var(--size) * .5);text-align:center;font-family:Georgia,Cambria,Times New Roman,Times,serif;font-size:var(--size);text-indent:calc(var(--size) * .5);letter-spacing:8px;font-weight:800;line-height:1;color:var(--color-text)}.redgoose-body table{margin:var(--size-margin-vertical) 0;border-collapse:collapse;font-size:.875em;box-sizing:border-box}.redgoose-body table th,.redgoose-body table td{padding:.5rem 1rem;border:1px solid var(--color-content-line);box-sizing:border-box}.redgoose-body table thead th,.redgoose-body table thead td{background-color:var(--color-content-bg)}.redgoose-body table tbody td{word-break:keep-all;word-wrap:break-word}.redgoose-body a{word-break:break-all}.redgoose-body code{word-break:break-word;font-size:92.5%;color:var(--color-text-code)}.redgoose-body pre{margin:var(--size-margin-vertical) 0;padding:1rem;background:var(--color-content-bg);font-size:.9375em;line-height:1.5;overflow:auto;-webkit-overflow-scrolling:touch;border-radius:2px}.redgoose-body pre::-webkit-scrollbar{width:4px;height:4px}.redgoose-body pre::-webkit-scrollbar-track{background:transparent}.redgoose-body pre::-webkit-scrollbar-thumb{background:rgba(0,0,0,.3);border-radius:4px}.redgoose-body pre::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.4)}html[data-theme=dark] .redgoose-body pre::-webkit-scrollbar-thumb{background:rgba(255,255,255,.2)}html[data-theme=dark] .redgoose-body pre::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.3)}@media (prefers-color-scheme: dark){html[data-theme=system] .redgoose-body pre::-webkit-scrollbar-thumb,html:not([data-theme]) .redgoose-body pre::-webkit-scrollbar-thumb,html[data-theme=""] .redgoose-body pre::-webkit-scrollbar-thumb{background:rgba(255,255,255,.2)}html[data-theme=system] .redgoose-body pre::-webkit-scrollbar-thumb:hover,html:not([data-theme]) .redgoose-body pre::-webkit-scrollbar-thumb:hover,html[data-theme=""] .redgoose-body pre::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.3)}}.redgoose-body pre>code{margin:0;padding:0;background:none;white-space:pre;border-radius:0;color:var(--color-text-base);font-size:1em}.redgoose-body input[type=checkbox]{margin-right:3px}.redgoose-body iframe{display:block;margin:var(--size-margin-vertical) auto;max-width:100%}.redgoose-body .iframe{position:relative;margin:var(--size-margin-vertical) 0;aspect-ratio:var(--size-aspect-ratio, 16/9)}.redgoose-body .iframe>iframe{width:100%;height:100%}.redgoose-body embed{display:block;max-width:100%;margin:var(--size-margin-vertical) auto;background:var(--color-content-bg)}.redgoose-body blockquote{position:relative;margin:var(--size-margin-vertical) 0;padding:1rem 1rem 1rem calc(1rem + var(--blockquote-size, 6px));box-shadow:inset 0 0 0 1px var(--color-content-line);box-sizing:border-box;background-color:var(--color-blockqueote-bg)}.redgoose-body blockquote:before{content:"";display:block;position:absolute;left:0;right:0;top:0;bottom:0;border:1px solid rgba(0,0,0,.025);pointer-events:none}.redgoose-body blockquote:after{content:"";position:absolute;left:0;top:0;bottom:0;width:var(--blockquote-size, 6px);background:var(--color-text-key)}.redgoose-body blockquote p,.redgoose-body blockquote pre,.redgoose-body blockquote table,.redgoose-body blockquote ul,.redgoose-body blockquote ol{margin:calc(var(--size-margin-vertical) * .5) 0}.redgoose-body blockquote *:first-child{margin-top:0}.redgoose-body blockquote *:last-child{margin-bottom:0}.redgoose-body>*:first-child{margin-top:0}.redgoose-body>*:first-child *:first-child{margin-top:0}.redgoose-body>*:last-child{margin-bottom:0}.redgoose-body>*:last-child *:last-child{margin-bottom:0}html[data-theme=dark] .redgoose-body--dark{--color-text: #d4d4d4;--color-text-key: #1ccd5c;--color-text-title: #fff;--color-text-code: #ffcd3a;--color-content-bg: #1a1a1a;--color-content-line: #383838;--color-blockqueote-bg: rgb(0 0 0 / 15%)}@media (prefers-color-scheme: dark){html[data-theme=system] .redgoose-body--dark,html:not([data-theme]) .redgoose-body--dark,html[data-theme=""] .redgoose-body--dark{--color-text: #d4d4d4;--color-text-key: #1ccd5c;--color-text-title: #fff;--color-text-code: #ffcd3a;--color-content-bg: #1a1a1a;--color-content-line: #383838;--color-blockqueote-bg: rgb(0 0 0 / 15%)}}@media (min-width: 1280px) and (-webkit-min-device-pixel-ratio: 2){.redgoose-body img{zoom:.75}}.detail{margin:40px 0 0;padding:0 var(--size-side-padding)}.detail__header{text-align:center}.detail__header p{margin:0;color:#aaa;font-size:0}.detail__header p span{display:inline-block;font-family:var(--font-eng);font-size:.625rem}.detail__header p span:nth-child(n+2):before{content:"/";display:inline-block;margin:0 5px;line-height:1.2}.detail__header h1{margin:1px 0 0;padding:0 20px;letter-spacing:-.1rem;line-height:1.25;font-family:var(--font-title);font-weight:600;font-size:30px}.detail__body{margin:20px 0 0}.detail__like{margin:40px 0 0;text-align:center}.detail__error{display:flex;align-items:center;justify-content:center;padding:50px 0}.detail__error img{display:block;width:232px;max-width:100%}.detail__error p{margin:30px 0 0;text-align:center;font-family:var(--font-eng);font-size:1rem;font-weight:400}@media (min-width: 768px){.detail{margin:50px 0 0}.detail__wrap{max-width:768px;margin:0 auto}.detail__header p span{font-size:.75rem}.detail__header h1{padding:0;font-size:42px;line-height:1.15}.detail__body{margin:50px 0 0}}@media (prefers-color-scheme: dark){.detail__header p{color:#888}.detail__header h1{color:#fff}}.button-like{--color-like-step-1: #EB6635;--color-like-step-2: #B31E36;--color-like-step-3: #3422FF;display:block;margin:0 auto;padding:10px;border:none;background:transparent;font-size:0;-webkit-tap-highlight-color:transparent;cursor:pointer;outline:none;width:90px;height:90px;border-radius:50%;transition:box-shadow .1s ease-out,background-color .25s ease-out;user-select:none}.button-like span{display:block}.button-like svg{display:block;margin:0 auto;width:38px;height:38px;transition:transform .3s cubic-bezier(.24,1.35,.8,1.22)}.button-like svg .step-1{color:var(--color-like-step-1)}.button-like svg .step-2{color:var(--color-like-step-2)}.button-like svg .step-3{color:var(--color-like-step-3)}.button-like em{display:block;margin:-2px 0 0;font-style:normal;font-family:var(--font-eng);font-size:11px;font-weight:400;color:var(--color-text-blur);transition:opacity .15s ease-out}.button-like:disabled{--color-like-step-1: #ddd;--color-like-step-2: #bbb;--color-like-step-3: #aaa;cursor:default}.button-like:disabled:focus{outline:none}.button-like:disabled:active svg{transform:none}.button-like:active,.button-like:focus{background:rgba(0,0,0,.05)}.button-like:active svg,.button-like:focus svg{transform:scale(1.4) translateY(6px)}.button-like:active em,.button-like:focus em{opacity:0}.button-like:disabled:active{background:none}.button-like:disabled:active em{opacity:1}@media (prefers-color-scheme: dark){.button-like{--color-like-step-1: #8ef01f;--color-like-step-2: var(--color-key);--color-like-step-3: #033615}.button-like:disabled{--color-like-step-1: #666;--color-like-step-2: #444;--color-like-step-3: #333}.button-like:active,.button-like:focus{background:rgba(0,0,0,.15)}}.redgoose-body h1,.redgoose-body h2,.redgoose-body h3,.redgoose-body h4,.redgoose-body h5,.redgoose-body h6{font-family:var(--font-title);font-weight:400}.redgoose-body h1:target,.redgoose-body h2:target,.redgoose-body h3:target,.redgoose-body h4:target,.redgoose-body h5:target,.redgoose-body h6:target{scroll-margin-top:calc(var(--size-header-height) + 30px)}.redgoose-body h1 .anchor,.redgoose-body h2 .anchor,.redgoose-body h3 .anchor,.redgoose-body h4 .anchor,.redgoose-body h5 .anchor,.redgoose-body h6 .anchor{display:none}.redgoose-body img{display:block;position:relative;left:50%;max-width:100vw;margin:calc(var(--size-margin-vertical) * 2.5) 0 var(--size-margin-vertical);transform:translate(-50%);transform-origin:50% 50%;transition:opacity .2s ease-out;cursor:pointer}@media (min-width: 1024px){.redgoose-body img{max-width:1024px}}@media (min-width: 1024px) and (-webkit-min-device-pixel-ratio: 2){.redgoose-body img{zoom:.75}}@media (min-width: 1440px){.redgoose-body img{max-width:1440px}}@media (max-width: 320px){.redgoose-body img{max-width:100%}}.redgoose-body img:active{opacity:.75}.redgoose-body picture img{cursor:auto}.redgoose-body picture img:active{opacity:unset}.redgoose-body .grid-item{--grid-item-columns: 1;--grid-item-gap: 10px;position:relative;display:grid;grid-template-columns:repeat(var(--grid-item-columns, 1),1fr);grid-gap:var(--grid-item-gap);margin:calc(var(--size-margin-vertical) * 2.5) auto var(--size-margin-vertical);left:50%;transform:translate(-50%);width:100vw;max-width:1280px;transform-origin:50% 50%}.redgoose-body .grid-item>p{position:relative;margin:0;box-sizing:border-box;padding-top:var(--padding-top, 100%);grid-column:var(--grid-column, auto)}.redgoose-body .grid-item>p>img{position:absolute;margin:0;left:0;top:0;width:100%;height:100%;max-width:none;max-height:none;transform:none;box-sizing:border-box;object-fit:cover}.redgoose-body .grid-item[data-mobile="1"]{--grid-item-columns: 1}.redgoose-body .grid-item>p[col="1"]{--padding-top:100%;--grid-column: span 1}.redgoose-body .grid-item[data-mobile="2"]{--grid-item-columns: 2}.redgoose-body .grid-item>p[col="2"]{--padding-top:50%;--grid-column: span 2}.redgoose-body .grid-item[data-mobile="3"]{--grid-item-columns: 3}.redgoose-body .grid-item>p[col="3"]{--padding-top: calc(100% / 3);--grid-column: span 3}.redgoose-body .grid-item[data-mobile="4"]{--grid-item-columns: 4}.redgoose-body .grid-item>p[col="4"]{--padding-top:25%;--grid-column: span 4}.redgoose-body .grid-item[data-mobile="5"]{--grid-item-columns: 5}.redgoose-body .grid-item>p[col="5"]{--padding-top:20%;--grid-column: span 5}.redgoose-body .grid-item[data-mobile="6"]{--grid-item-columns: 6}.redgoose-body .grid-item>p[col="6"]{--padding-top: calc(100% / 6);--grid-column: span 6}@media (min-width: 768px){.redgoose-body .grid-item[data-tablet="1"]{--grid-item-columns: 1}.redgoose-body .grid-item>p[col-tablet="1"]{--padding-top:100%;--grid-column: span 1}.redgoose-body .grid-item[data-tablet="2"]{--grid-item-columns: 2}.redgoose-body .grid-item>p[col-tablet="2"]{--padding-top:50%;--grid-column: span 2}.redgoose-body .grid-item[data-tablet="3"]{--grid-item-columns: 3}.redgoose-body .grid-item>p[col-tablet="3"]{--padding-top: calc(100% / 3);--grid-column: span 3}.redgoose-body .grid-item[data-tablet="4"]{--grid-item-columns: 4}.redgoose-body .grid-item>p[col-tablet="4"]{--padding-top:25%;--grid-column: span 4}.redgoose-body .grid-item[data-tablet="5"]{--grid-item-columns: 5}.redgoose-body .grid-item>p[col-tablet="5"]{--padding-top:20%;--grid-column: span 5}.redgoose-body .grid-item[data-tablet="6"]{--grid-item-columns: 6}.redgoose-body .grid-item>p[col-tablet="6"]{--padding-top: calc(100% / 6);--grid-column: span 6}}@media (min-width: 1024px){.redgoose-body .grid-item{width:90vw}.redgoose-body .grid-item[data-desktop="1"]{--grid-item-columns: 1}.redgoose-body .grid-item>p[col-desktop="1"]{--padding-top:100%;--grid-column: span 1}.redgoose-body .grid-item[data-desktop="2"]{--grid-item-columns: 2}.redgoose-body .grid-item>p[col-desktop="2"]{--padding-top:50%;--grid-column: span 2}.redgoose-body .grid-item[data-desktop="3"]{--grid-item-columns: 3}.redgoose-body .grid-item>p[col-desktop="3"]{--padding-top: calc(100% / 3);--grid-column: span 3}.redgoose-body .grid-item[data-desktop="4"]{--grid-item-columns: 4}.redgoose-body .grid-item>p[col-desktop="4"]{--padding-top:25%;--grid-column: span 4}.redgoose-body .grid-item[data-desktop="5"]{--grid-item-columns: 5}.redgoose-body .grid-item>p[col-desktop="5"]{--padding-top:20%;--grid-column: span 5}.redgoose-body .grid-item[data-desktop="6"]{--grid-item-columns: 6}.redgoose-body .grid-item>p[col-desktop="6"]{--padding-top: calc(100% / 6);--grid-column: span 6}}@media (min-width: 1440px){.redgoose-body .grid-item[data-desktop-large="1"]{--grid-item-columns: 1}.redgoose-body .grid-item>p[col-desktop-large="1"]{--padding-top:100%;--grid-column: span 1}.redgoose-body .grid-item[data-desktop-large="2"]{--grid-item-columns: 2}.redgoose-body .grid-item>p[col-desktop-large="2"]{--padding-top:50%;--grid-column: span 2}.redgoose-body .grid-item[data-desktop-large="3"]{--grid-item-columns: 3}.redgoose-body .grid-item>p[col-desktop-large="3"]{--padding-top: calc(100% / 3);--grid-column: span 3}.redgoose-body .grid-item[data-desktop-large="4"]{--grid-item-columns: 4}.redgoose-body .grid-item>p[col-desktop-large="4"]{--padding-top:25%;--grid-column: span 4}.redgoose-body .grid-item[data-desktop-large="5"]{--grid-item-columns: 5}.redgoose-body .grid-item>p[col-desktop-large="5"]{--padding-top:20%;--grid-column: span 5}.redgoose-body .grid-item[data-desktop-large="6"]{--grid-item-columns: 6}.redgoose-body .grid-item>p[col-desktop-large="6"]{--padding-top: calc(100% / 6);--grid-column: span 6}}@media (max-width: 320px){.redgoose-body .grid-item{max-width:100%;transform:none;left:auto}}.redgoose-body .grid-item:first-child{margin-top:0}.redgoose-body .grid-item:last-child{margin-bottom:0}.redgoose-body .grid-group{margin:calc(var(--size-margin-vertical) * 2.5) auto var(--size-margin-vertical)}.redgoose-body .grid-group>.grid-item{margin-top:var(--grid-item-gap);margin-bottom:var(--grid-item-gap)}.redgoose-body .grid-group>.grid-item:first-child{margin-top:0}.redgoose-body .grid-group>.grid-item:last-child{margin-bottom:0}@media (min-width: 768px){.redgoose-body h1,.redgoose-body h2,.redgoose-body h3,.redgoose-body h4,.redgoose-body h5,.redgoose-body h6{position:relative}.redgoose-body h1 .anchor,.redgoose-body h2 .anchor,.redgoose-body h3 .anchor,.redgoose-body h4 .anchor,.redgoose-body h5 .anchor,.redgoose-body h6 .anchor{display:block;position:absolute;left:-42px;top:50%;opacity:0;transition:opacity .1s ease-out;transform:translateY(-50%);padding:10px;box-sizing:border-box}.redgoose-body h1 .anchor svg,.redgoose-body h2 .anchor svg,.redgoose-body h3 .anchor svg,.redgoose-body h4 .anchor svg,.redgoose-body h5 .anchor svg,.redgoose-body h6 .anchor svg{display:block;width:20px;aspect-ratio:1/1;color:hsl(var(--color-text-blur-hsl));stroke-width:1.75}}@media (min-width: 768px) and (hover: hover){.redgoose-body h1:hover .anchor,.redgoose-body h2:hover .anchor,.redgoose-body h3:hover .anchor,.redgoose-body h4:hover .anchor,.redgoose-body h5:hover .anchor,.redgoose-body h6:hover .anchor{opacity:1}}.error{display:grid;place-content:center;padding:72px 0;height:calc(100vh - var(--size-header-height) - 100px);box-sizing:border-box}.error img{display:block;width:180px;max-width:100%;user-select:none}.error h1{margin:42px 0 0;text-align:center;font-family:var(--font-eng);font-size:1.25rem;font-weight:400;line-height:1.15}@media (min-width: 768px){.error{height:calc(100vh - var(--size-header-height) - 160px)}}@media (prefers-color-scheme: dark){.error img{filter:invert(60%) sepia(26%) saturate(2284%) hue-rotate(24deg) brightness(104%) contrast(78%)}}.about{--color-about-metas-section-title: #111;padding:50px var(--size-side-padding) 40px}.about__wrap{max-width:920px;margin:0 auto}.about__header{text-align:center}.about__header p{margin:0;font-family:var(--font-eng);font-size:11px;color:var(--color-text-blur)}.about__header h1{margin:2px 0 0;font-family:var(--font-title);font-size:32px;font-weight:600;line-height:1;letter-spacing:-.5px;color:var(--color-about-metas-section-title)}.about__profile{margin:30px 0 0;padding:0 40px}.about__profile img{display:block;margin:0 auto;width:180px;max-width:100%;user-select:none}.about__description{margin:30px 0 0}.about__description p{margin:0;font-size:.875rem;line-height:1.64}.about__metas{margin:30px 0 0}.about__metas section{margin:30px 0 0}.about__metas section:first-child{margin-top:0}.about__metas section>h1{margin:0;font-family:var(--font-title);font-size:24px;font-weight:600;color:var(--color-about-metas-section-title);letter-spacing:-.5px}.about__metas section>h1:after{content:"";display:block;width:12px;height:1px;background:var(--color-text-blur)}.about__metas section>dl{margin:10px 0 0;font-size:12px;line-height:20px}.about__metas section>dl>dt{margin-top:12px;font-family:var(--font-eng);font-weight:500;font-size:15px;color:var(--color-about-metas-section-title)}.about__metas section>dl>dd{margin:5px 0 0;font-family:var(--font-eng)}@media (min-width: 768px){.about{padding-top:50px;padding-bottom:0}.about__header p{font-size:12px}.about__header h1{font-size:36px}.about__profile{margin:40px 0 0}.about__profile img{width:240px}.about__metas{margin:50px 0 0}.about__metas>div{display:flex;flex-wrap:wrap}.about__metas section{width:50%;margin:0;padding:0 0 40px}}@media (min-width: 1024px){.about__metas section>dl>dt{margin:0;padding:4px 0 0;float:left;width:90px;font-size:12px;line-height:20px;font-weight:400}.about__metas section>dl>dd{margin:0 0 0 90px;padding:4px 0 0;line-height:20px}}@media (prefers-color-scheme: dark){.about{--color-about-metas-section-title: #fff;--color-about-metas-section-sub-title: #fff}}html.popup-lightbox,html.popup-lightbox>body{overflow:hidden}.lightbox{position:fixed;z-index:99999;left:0;right:0;top:0;bottom:0;background:rgba(255,255,255,.75);cursor:zoom-out}.lightbox__body{margin:0;display:flex;align-items:center;justify-content:center;width:100%;height:100%;box-sizing:border-box;padding:0}.lightbox__body img{display:block;max-width:100%;max-height:100%;box-sizing:border-box;object-fit:contain;background:var(--color-bg)}@supports (backdrop-filter: blur(10px)){.lightbox{background:rgba(255,255,255,.75);backdrop-filter:blur(10px)}}@media (prefers-color-scheme: dark){.lightbox{background:rgba(0,0,0,.75)}}@media (min-width: 1024px){.lightbox__body{padding:40px}}@media (min-width: 1024px) and (-webkit-min-device-pixel-ratio: 2){.lightbox__body img{zoom:.75}}\n')();
layout();
index();
detail();
