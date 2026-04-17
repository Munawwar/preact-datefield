"use strict";
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

// lib/PreactDatefield.jsx
var PreactDatefield_exports = {};
__export(PreactDatefield_exports, {
  buildDateSuggestions: () => buildDateSuggestions,
  default: () => PreactDatefield_default,
  isoToDisplayLabel: () => isoToDisplayLabel
});
module.exports = __toCommonJS(PreactDatefield_exports);

// node_modules/@popperjs/core/lib/enums.js
var top = "top";
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [top, bottom, right, left];
var start = "start";
var end = "end";
var clippingParents = "clippingParents";
var viewport = "viewport";
var popper = "popper";
var reference = "reference";
var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []);
var beforeRead = "beforeRead";
var read = "read";
var afterRead = "afterRead";
var beforeMain = "beforeMain";
var main = "main";
var afterMain = "afterMain";
var beforeWrite = "beforeWrite";
var write = "write";
var afterWrite = "afterWrite";
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

// node_modules/@popperjs/core/lib/dom-utils/getNodeName.js
function getNodeName(element) {
  return element ? (element.nodeName || "").toLowerCase() : null;
}

// node_modules/@popperjs/core/lib/dom-utils/getWindow.js
function getWindow(node) {
  if (node == null) {
    return window;
  }
  if (node.toString() !== "[object Window]") {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
  return node;
}

// node_modules/@popperjs/core/lib/dom-utils/instanceOf.js
function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}
function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

// node_modules/@popperjs/core/lib/modifiers/applyStyles.js
function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function(name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name];
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    }
    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function(name2) {
      var value = attributes[name2];
      if (value === false) {
        element.removeAttribute(name2);
      } else {
        element.setAttribute(name2, value === true ? "" : value);
      }
    });
  });
}
function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;
  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }
  return function() {
    Object.keys(state.elements).forEach(function(name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
      var style = styleProperties.reduce(function(style2, property) {
        style2[property] = "";
        return style2;
      }, {});
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function(attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
}
var applyStyles_default = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: applyStyles,
  effect,
  requires: ["computeStyles"]
};

// node_modules/@popperjs/core/lib/utils/getBasePlacement.js
function getBasePlacement(placement) {
  return placement.split("-")[0];
}

// node_modules/@popperjs/core/lib/utils/math.js
var max = Math.max;
var min = Math.min;
var round = Math.round;

// node_modules/@popperjs/core/lib/utils/userAgent.js
function getUAString() {
  var uaData = navigator.userAgentData;
  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function(item) {
      return item.brand + "/" + item.version;
    }).join(" ");
  }
  return navigator.userAgent;
}

// node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js
function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}

// node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js
function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;
  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }
  var _ref = isElement(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x3 = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y3 = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width,
    height,
    top: y3,
    right: x3 + width,
    bottom: y3 + height,
    left: x3,
    x: x3,
    y: y3
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js
function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element);
  var width = element.offsetWidth;
  var height = element.offsetHeight;
  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }
  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width,
    height
  };
}

// node_modules/@popperjs/core/lib/dom-utils/contains.js
function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode();
  if (parent.contains(child)) {
    return true;
  } else if (rootNode && isShadowRoot(rootNode)) {
    var next = child;
    do {
      if (next && parent.isSameNode(next)) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}

// node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}

// node_modules/@popperjs/core/lib/dom-utils/isTableElement.js
function isTableElement(element) {
  return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
}

// node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js
function getDocumentElement(element) {
  return ((isElement(element) ? element.ownerDocument : (
    // $FlowFixMe[prop-missing]
    element.document
  )) || window.document).documentElement;
}

// node_modules/@popperjs/core/lib/dom-utils/getParentNode.js
function getParentNode(element) {
  if (getNodeName(element) === "html") {
    return element;
  }
  return (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || // DOM Element detected
    (isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element)
  );
}

// node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js
function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle(element).position === "fixed") {
    return null;
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());
  if (isIE && isHTMLElement(element)) {
    var elementCss = getComputedStyle(element);
    if (elementCss.position === "fixed") {
      return null;
    }
  }
  var currentNode = getParentNode(element);
  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }
  while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode);
    if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
}
function getOffsetParent(element) {
  var window2 = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static")) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}

// node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}

// node_modules/@popperjs/core/lib/utils/within.js
function within(min2, value, max2) {
  return max(min2, min(value, max2));
}
function withinMaxClamp(min2, value, max2) {
  var v3 = within(min2, value, max2);
  return v3 > max2 ? max2 : v3;
}

// node_modules/@popperjs/core/lib/utils/getFreshSideObject.js
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

// node_modules/@popperjs/core/lib/utils/mergePaddingObject.js
function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}

// node_modules/@popperjs/core/lib/utils/expandToHashMap.js
function expandToHashMap(value, keys) {
  return keys.reduce(function(hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

// node_modules/@popperjs/core/lib/modifiers/arrow.js
var toPaddingObject = function toPaddingObject2(padding, state) {
  padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
};
function arrow(_ref) {
  var _state$modifiersData$;
  var state = _ref.state, name = _ref.name, options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? "height" : "width";
  if (!arrowElement || !popperOffsets2) {
    return;
  }
  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === "y" ? top : left;
  var maxProp = axis === "y" ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
  var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2;
  var min2 = paddingObject[minProp];
  var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset2 = within(min2, center, max2);
  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
}
function effect2(_ref2) {
  var state = _ref2.state, options = _ref2.options;
  var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
  if (arrowElement == null) {
    return;
  }
  if (typeof arrowElement === "string") {
    arrowElement = state.elements.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return;
    }
  }
  if (!contains(state.elements.popper, arrowElement)) {
    return;
  }
  state.elements.arrow = arrowElement;
}
var arrow_default = {
  name: "arrow",
  enabled: true,
  phase: "main",
  fn: arrow,
  effect: effect2,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};

// node_modules/@popperjs/core/lib/utils/getVariation.js
function getVariation(placement) {
  return placement.split("-")[1];
}

// node_modules/@popperjs/core/lib/modifiers/computeStyles.js
var unsetSides = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function roundOffsetsByDPR(_ref, win) {
  var x3 = _ref.x, y3 = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x3 * dpr) / dpr || 0,
    y: round(y3 * dpr) / dpr || 0
  };
}
function mapToStyles(_ref2) {
  var _Object$assign2;
  var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x, x3 = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y3 = _offsets$y === void 0 ? 0 : _offsets$y;
  var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
    x: x3,
    y: y3
  }) : {
    x: x3,
    y: y3
  };
  x3 = _ref3.x;
  y3 = _ref3.y;
  var hasX = offsets.hasOwnProperty("x");
  var hasY = offsets.hasOwnProperty("y");
  var sideX = left;
  var sideY = top;
  var win = window;
  if (adaptive) {
    var offsetParent = getOffsetParent(popper2);
    var heightProp = "clientHeight";
    var widthProp = "clientWidth";
    if (offsetParent === getWindow(popper2)) {
      offsetParent = getDocumentElement(popper2);
      if (getComputedStyle(offsetParent).position !== "static" && position === "absolute") {
        heightProp = "scrollHeight";
        widthProp = "scrollWidth";
      }
    }
    offsetParent = offsetParent;
    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        offsetParent[heightProp]
      );
      y3 -= offsetY - popperRect.height;
      y3 *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        offsetParent[widthProp]
      );
      x3 -= offsetX - popperRect.width;
      x3 *= gpuAcceleration ? 1 : -1;
    }
  }
  var commonStyles = Object.assign({
    position
  }, adaptive && unsetSides);
  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x3,
    y: y3
  }, getWindow(popper2)) : {
    x: x3,
    y: y3
  };
  x3 = _ref4.x;
  y3 = _ref4.y;
  if (gpuAcceleration) {
    var _Object$assign;
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x3 + "px, " + y3 + "px)" : "translate3d(" + x3 + "px, " + y3 + "px, 0)", _Object$assign));
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y3 + "px" : "", _Object$assign2[sideX] = hasX ? x3 + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref5) {
  var state = _ref5.state, options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration,
    isFixed: state.options.strategy === "fixed"
  };
  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive,
      roundOffsets
    })));
  }
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: "absolute",
      adaptive: false,
      roundOffsets
    })));
  }
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-placement": state.placement
  });
}
var computeStyles_default = {
  name: "computeStyles",
  enabled: true,
  phase: "beforeWrite",
  fn: computeStyles,
  data: {}
};

// node_modules/@popperjs/core/lib/modifiers/eventListeners.js
var passive = {
  passive: true
};
function effect3(_ref) {
  var state = _ref.state, instance = _ref.instance, options = _ref.options;
  var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
  var window2 = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
  if (scroll) {
    scrollParents.forEach(function(scrollParent) {
      scrollParent.addEventListener("scroll", instance.update, passive);
    });
  }
  if (resize) {
    window2.addEventListener("resize", instance.update, passive);
  }
  return function() {
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.removeEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.removeEventListener("resize", instance.update, passive);
    }
  };
}
var eventListeners_default = {
  name: "eventListeners",
  enabled: true,
  phase: "write",
  fn: function fn() {
  },
  effect: effect3,
  data: {}
};

// node_modules/@popperjs/core/lib/utils/getOppositePlacement.js
var hash = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function(matched) {
    return hash[matched];
  });
}

// node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js
var hash2 = {
  start: "end",
  end: "start"
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function(matched) {
    return hash2[matched];
  });
}

// node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js
function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft,
    scrollTop
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

// node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js
function getViewportRect(element, strategy) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x3 = 0;
  var y3 = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = isLayoutViewport();
    if (layoutViewport || !layoutViewport && strategy === "fixed") {
      x3 = visualViewport.offsetLeft;
      y3 = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x3 + getWindowScrollBarX(element),
    y: y3
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js
function getDocumentRect(element) {
  var _element$ownerDocumen;
  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x3 = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y3 = -winScroll.scrollTop;
  if (getComputedStyle(body || html).direction === "rtl") {
    x3 += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }
  return {
    width,
    height,
    x: x3,
    y: y3
  };
}

// node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js
function isScrollParent(element) {
  var _getComputedStyle = getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

// node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js
function getScrollParent(node) {
  if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument.body;
  }
  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }
  return getScrollParent(getParentNode(node));
}

// node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js
function listScrollParents(element, list) {
  var _element$ownerDocumen;
  if (list === void 0) {
    list = [];
  }
  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    updatedList.concat(listScrollParents(getParentNode(target)))
  );
}

// node_modules/@popperjs/core/lib/utils/rectToClientRect.js
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

// node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js
function getInnerBoundingClientRect(element, strategy) {
  var rect = getBoundingClientRect(element, false, strategy === "fixed");
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
  var clippingParents2 = listScrollParents(getParentNode(element));
  var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
  if (!isElement(clipperElement)) {
    return [];
  }
  return clippingParents2.filter(function(clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
  });
}
function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
  var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents2[0];
  var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

// node_modules/@popperjs/core/lib/utils/computeOffsets.js
function computeOffsets(_ref) {
  var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference2.x + reference2.width / 2 - element.width / 2;
  var commonY = reference2.y + reference2.height / 2 - element.height / 2;
  var offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference2.y - element.height
      };
      break;
    case bottom:
      offsets = {
        x: commonX,
        y: reference2.y + reference2.height
      };
      break;
    case right:
      offsets = {
        x: reference2.x + reference2.width,
        y: commonY
      };
      break;
    case left:
      offsets = {
        x: reference2.x - element.width,
        y: commonY
      };
      break;
    default:
      offsets = {
        x: reference2.x,
        y: reference2.y
      };
  }
  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
  if (mainAxis != null) {
    var len = mainAxis === "y" ? "height" : "width";
    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
        break;
      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
        break;
      default:
    }
  }
  return offsets;
}

// node_modules/@popperjs/core/lib/utils/detectOverflow.js
function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets2 = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: "absolute",
    placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset;
  if (elementContext === popper && offsetData) {
    var offset2 = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function(key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
      overflowOffsets[key] += offset2[axis] * multiply;
    });
  }
  return overflowOffsets;
}

// node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js
function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements2 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
    return getVariation(placement2) === variation;
  }) : basePlacements;
  var allowedPlacements = placements2.filter(function(placement2) {
    return allowedAutoPlacements.indexOf(placement2) >= 0;
  });
  if (allowedPlacements.length === 0) {
    allowedPlacements = placements2;
  }
  var overflows = allowedPlacements.reduce(function(acc, placement2) {
    acc[placement2] = detectOverflow(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding
    })[getBasePlacement(placement2)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function(a3, b2) {
    return overflows[a3] - overflows[b2];
  });
}

// node_modules/@popperjs/core/lib/modifiers/flip.js
function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }
  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}
function flip(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  if (state.modifiersData[name]._skip) {
    return;
  }
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
    return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding,
      flipVariations,
      allowedAutoPlacements
    }) : placement2);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = /* @__PURE__ */ new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements2[0];
  for (var i4 = 0; i4 < placements2.length; i4++) {
    var placement = placements2[i4];
    var _basePlacement = getBasePlacement(placement);
    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? "width" : "height";
    var overflow = detectOverflow(state, {
      placement,
      boundary,
      rootBoundary,
      altBoundary,
      padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }
    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];
    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }
    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }
    if (checks.every(function(check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }
    checksMap.set(placement, checks);
  }
  if (makeFallbackChecks) {
    var numberOfChecks = flipVariations ? 3 : 1;
    var _loop = function _loop2(_i2) {
      var fittingPlacement = placements2.find(function(placement2) {
        var checks2 = checksMap.get(placement2);
        if (checks2) {
          return checks2.slice(0, _i2).every(function(check) {
            return check;
          });
        }
      });
      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };
    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);
      if (_ret === "break") break;
    }
  }
  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
}
var flip_default = {
  name: "flip",
  enabled: true,
  phase: "main",
  fn: flip,
  requiresIfExists: ["offset"],
  data: {
    _skip: false
  }
};

// node_modules/@popperjs/core/lib/modifiers/hide.js
function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }
  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}
function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function(side) {
    return overflow[side] >= 0;
  });
}
function hide(_ref) {
  var state = _ref.state, name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: "reference"
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets,
    popperEscapeOffsets,
    isReferenceHidden,
    hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-reference-hidden": isReferenceHidden,
    "data-popper-escaped": hasPopperEscaped
  });
}
var hide_default = {
  name: "hide",
  enabled: true,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: hide
};

// node_modules/@popperjs/core/lib/modifiers/offset.js
function distanceAndSkiddingToXY(placement, rects, offset2) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
  var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
    placement
  })) : offset2, skidding = _ref[0], distance = _ref[1];
  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}
function offset(_ref2) {
  var state = _ref2.state, options = _ref2.options, name = _ref2.name;
  var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function(acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement], x3 = _data$state$placement.x, y3 = _data$state$placement.y;
  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x3;
    state.modifiersData.popperOffsets.y += y3;
  }
  state.modifiersData[name] = data;
}
var offset_default = {
  name: "offset",
  enabled: true,
  phase: "main",
  requires: ["popperOffsets"],
  fn: offset
};

// node_modules/@popperjs/core/lib/modifiers/popperOffsets.js
function popperOffsets(_ref) {
  var state = _ref.state, name = _ref.name;
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: "absolute",
    placement: state.placement
  });
}
var popperOffsets_default = {
  name: "popperOffsets",
  enabled: true,
  phase: "read",
  fn: popperOffsets,
  data: {}
};

// node_modules/@popperjs/core/lib/utils/getAltAxis.js
function getAltAxis(axis) {
  return axis === "x" ? "y" : "x";
}

// node_modules/@popperjs/core/lib/modifiers/preventOverflow.js
function preventOverflow(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary,
    rootBoundary,
    padding,
    altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };
  if (!popperOffsets2) {
    return;
  }
  if (checkMainAxis) {
    var _offsetModifierState$;
    var mainSide = mainAxis === "y" ? top : left;
    var altSide = mainAxis === "y" ? bottom : right;
    var len = mainAxis === "y" ? "height" : "width";
    var offset2 = popperOffsets2[mainAxis];
    var min2 = offset2 + overflow[mainSide];
    var max2 = offset2 - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide];
    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset2 + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min2, tetherMin) : min2, offset2, tether ? max(max2, tetherMax) : max2);
    popperOffsets2[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset2;
  }
  if (checkAltAxis) {
    var _offsetModifierState$2;
    var _mainSide = mainAxis === "x" ? top : left;
    var _altSide = mainAxis === "x" ? bottom : right;
    var _offset = popperOffsets2[altAxis];
    var _len = altAxis === "y" ? "height" : "width";
    var _min = _offset + overflow[_mainSide];
    var _max = _offset - overflow[_altSide];
    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
    popperOffsets2[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }
  state.modifiersData[name] = data;
}
var preventOverflow_default = {
  name: "preventOverflow",
  enabled: true,
  phase: "main",
  fn: preventOverflow,
  requiresIfExists: ["offset"]
};

// node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js
function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

// node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js
function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

// node_modules/@popperjs/core/lib/utils/orderModifiers.js
function order(modifiers) {
  var map = /* @__PURE__ */ new Map();
  var visited = /* @__PURE__ */ new Set();
  var result = [];
  modifiers.forEach(function(modifier) {
    map.set(modifier.name, modifier);
  });
  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function(dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);
        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }
  modifiers.forEach(function(modifier) {
    if (!visited.has(modifier.name)) {
      sort(modifier);
    }
  });
  return result;
}
function orderModifiers(modifiers) {
  var orderedModifiers = order(modifiers);
  return modifierPhases.reduce(function(acc, phase) {
    return acc.concat(orderedModifiers.filter(function(modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

// node_modules/@popperjs/core/lib/utils/debounce.js
function debounce(fn3) {
  var pending;
  return function() {
    if (!pending) {
      pending = new Promise(function(resolve) {
        Promise.resolve().then(function() {
          pending = void 0;
          resolve(fn3());
        });
      });
    }
    return pending;
  };
}

// node_modules/@popperjs/core/lib/utils/mergeByName.js
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function(merged2, current) {
    var existing = merged2[current.name];
    merged2[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged2;
  }, {});
  return Object.keys(merged).map(function(key) {
    return merged[key];
  });
}

// node_modules/@popperjs/core/lib/createPopper.js
var DEFAULT_OPTIONS = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return !args.some(function(element) {
    return !(element && typeof element.getBoundingClientRect === "function");
  });
}
function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }
  var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper2(reference2, popper2, options) {
    if (options === void 0) {
      options = defaultOptions;
    }
    var state = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference2,
        popper: popper2
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state,
      setOptions: function setOptions(setOptionsAction) {
        var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options2);
        state.scrollParents = {
          reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
          popper: listScrollParents(popper2)
        };
        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
        state.orderedModifiers = orderedModifiers.filter(function(m3) {
          return m3.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }
        var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
        if (!areValidElements(reference3, popper3)) {
          return;
        }
        state.rects = {
          reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
          popper: getLayoutRect(popper3)
        };
        state.reset = false;
        state.placement = state.options.placement;
        state.orderedModifiers.forEach(function(modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }
          var _state$orderedModifie = state.orderedModifiers[index], fn3 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
          if (typeof fn3 === "function") {
            state = fn3({
              state,
              options: _options,
              name,
              instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function() {
        return new Promise(function(resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };
    if (!areValidElements(reference2, popper2)) {
      return instance;
    }
    instance.setOptions(options).then(function(state2) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state2);
      }
    });
    function runModifierEffects() {
      state.orderedModifiers.forEach(function(_ref) {
        var name = _ref.name, _ref$options = _ref.options, options2 = _ref$options === void 0 ? {} : _ref$options, effect4 = _ref.effect;
        if (typeof effect4 === "function") {
          var cleanupFn = effect4({
            state,
            name,
            instance,
            options: options2
          });
          var noopFn = function noopFn2() {
          };
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }
    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function(fn3) {
        return fn3();
      });
      effectCleanupFns = [];
    }
    return instance;
  };
}

// node_modules/@popperjs/core/lib/popper.js
var defaultModifiers = [eventListeners_default, popperOffsets_default, computeStyles_default, applyStyles_default, offset_default, flip_default, preventOverflow_default, arrow_default, hide_default];
var createPopper = /* @__PURE__ */ popperGenerator({
  defaultModifiers
});

// node_modules/preact/dist/preact.module.js
var n;
var l;
var u;
var t;
var i;
var r;
var o;
var e;
var f;
var c;
var s;
var a;
var h;
var p = {};
var v = [];
var y = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var d = Array.isArray;
function w(n2, l3) {
  for (var u4 in l3) n2[u4] = l3[u4];
  return n2;
}
function _(n2) {
  n2 && n2.parentNode && n2.parentNode.removeChild(n2);
}
function g(l3, u4, t3) {
  var i4, r3, o3, e3 = {};
  for (o3 in u4) "key" == o3 ? i4 = u4[o3] : "ref" == o3 ? r3 = u4[o3] : e3[o3] = u4[o3];
  if (arguments.length > 2 && (e3.children = arguments.length > 3 ? n.call(arguments, 2) : t3), "function" == typeof l3 && null != l3.defaultProps) for (o3 in l3.defaultProps) void 0 === e3[o3] && (e3[o3] = l3.defaultProps[o3]);
  return m(l3, e3, i4, r3, null);
}
function m(n2, t3, i4, r3, o3) {
  var e3 = { type: n2, props: t3, key: i4, ref: r3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o3 ? ++u : o3, __i: -1, __u: 0 };
  return null == o3 && null != l.vnode && l.vnode(e3), e3;
}
function k(n2) {
  return n2.children;
}
function x(n2, l3) {
  this.props = n2, this.context = l3;
}
function C(n2, l3) {
  if (null == l3) return n2.__ ? C(n2.__, n2.__i + 1) : null;
  for (var u4; l3 < n2.__k.length; l3++) if (null != (u4 = n2.__k[l3]) && null != u4.__e) return u4.__e;
  return "function" == typeof n2.type ? C(n2) : null;
}
function S(n2) {
  var l3, u4;
  if (null != (n2 = n2.__) && null != n2.__c) {
    for (n2.__e = n2.__c.base = null, l3 = 0; l3 < n2.__k.length; l3++) if (null != (u4 = n2.__k[l3]) && null != u4.__e) {
      n2.__e = n2.__c.base = u4.__e;
      break;
    }
    return S(n2);
  }
}
function M(n2) {
  (!n2.__d && (n2.__d = true) && i.push(n2) && !P.__r++ || r !== l.debounceRendering) && ((r = l.debounceRendering) || o)(P);
}
function P() {
  var n2, u4, t3, r3, o3, f4, c3, s3;
  for (i.sort(e); n2 = i.shift(); ) n2.__d && (u4 = i.length, r3 = void 0, f4 = (o3 = (t3 = n2).__v).__e, c3 = [], s3 = [], t3.__P && ((r3 = w({}, o3)).__v = o3.__v + 1, l.vnode && l.vnode(r3), j(t3.__P, r3, o3, t3.__n, t3.__P.namespaceURI, 32 & o3.__u ? [f4] : null, c3, null == f4 ? C(o3) : f4, !!(32 & o3.__u), s3), r3.__v = o3.__v, r3.__.__k[r3.__i] = r3, z(c3, r3, s3), r3.__e != f4 && S(r3)), i.length > u4 && i.sort(e));
  P.__r = 0;
}
function $(n2, l3, u4, t3, i4, r3, o3, e3, f4, c3, s3) {
  var a3, h3, y3, d3, w3, _3, g4 = t3 && t3.__k || v, m3 = l3.length;
  for (f4 = I(u4, l3, g4, f4, m3), a3 = 0; a3 < m3; a3++) null != (y3 = u4.__k[a3]) && (h3 = -1 === y3.__i ? p : g4[y3.__i] || p, y3.__i = a3, _3 = j(n2, y3, h3, i4, r3, o3, e3, f4, c3, s3), d3 = y3.__e, y3.ref && h3.ref != y3.ref && (h3.ref && V(h3.ref, null, y3), s3.push(y3.ref, y3.__c || d3, y3)), null == w3 && null != d3 && (w3 = d3), 4 & y3.__u || h3.__k === y3.__k ? f4 = A(y3, f4, n2) : "function" == typeof y3.type && void 0 !== _3 ? f4 = _3 : d3 && (f4 = d3.nextSibling), y3.__u &= -7);
  return u4.__e = w3, f4;
}
function I(n2, l3, u4, t3, i4) {
  var r3, o3, e3, f4, c3, s3 = u4.length, a3 = s3, h3 = 0;
  for (n2.__k = new Array(i4), r3 = 0; r3 < i4; r3++) null != (o3 = l3[r3]) && "boolean" != typeof o3 && "function" != typeof o3 ? (f4 = r3 + h3, (o3 = n2.__k[r3] = "string" == typeof o3 || "number" == typeof o3 || "bigint" == typeof o3 || o3.constructor == String ? m(null, o3, null, null, null) : d(o3) ? m(k, { children: o3 }, null, null, null) : void 0 === o3.constructor && o3.__b > 0 ? m(o3.type, o3.props, o3.key, o3.ref ? o3.ref : null, o3.__v) : o3).__ = n2, o3.__b = n2.__b + 1, e3 = null, -1 !== (c3 = o3.__i = L(o3, u4, f4, a3)) && (a3--, (e3 = u4[c3]) && (e3.__u |= 2)), null == e3 || null === e3.__v ? (-1 == c3 && h3--, "function" != typeof o3.type && (o3.__u |= 4)) : c3 != f4 && (c3 == f4 - 1 ? h3-- : c3 == f4 + 1 ? h3++ : (c3 > f4 ? h3-- : h3++, o3.__u |= 4))) : n2.__k[r3] = null;
  if (a3) for (r3 = 0; r3 < s3; r3++) null != (e3 = u4[r3]) && 0 == (2 & e3.__u) && (e3.__e == t3 && (t3 = C(e3)), q(e3, e3));
  return t3;
}
function A(n2, l3, u4) {
  var t3, i4;
  if ("function" == typeof n2.type) {
    for (t3 = n2.__k, i4 = 0; t3 && i4 < t3.length; i4++) t3[i4] && (t3[i4].__ = n2, l3 = A(t3[i4], l3, u4));
    return l3;
  }
  n2.__e != l3 && (l3 && n2.type && !u4.contains(l3) && (l3 = C(n2)), u4.insertBefore(n2.__e, l3 || null), l3 = n2.__e);
  do {
    l3 = l3 && l3.nextSibling;
  } while (null != l3 && 8 == l3.nodeType);
  return l3;
}
function H(n2, l3) {
  return l3 = l3 || [], null == n2 || "boolean" == typeof n2 || (d(n2) ? n2.some(function(n3) {
    H(n3, l3);
  }) : l3.push(n2)), l3;
}
function L(n2, l3, u4, t3) {
  var i4, r3, o3 = n2.key, e3 = n2.type, f4 = l3[u4];
  if (null === f4 || f4 && o3 == f4.key && e3 === f4.type && 0 == (2 & f4.__u)) return u4;
  if (t3 > (null != f4 && 0 == (2 & f4.__u) ? 1 : 0)) for (i4 = u4 - 1, r3 = u4 + 1; i4 >= 0 || r3 < l3.length; ) {
    if (i4 >= 0) {
      if ((f4 = l3[i4]) && 0 == (2 & f4.__u) && o3 == f4.key && e3 === f4.type) return i4;
      i4--;
    }
    if (r3 < l3.length) {
      if ((f4 = l3[r3]) && 0 == (2 & f4.__u) && o3 == f4.key && e3 === f4.type) return r3;
      r3++;
    }
  }
  return -1;
}
function T(n2, l3, u4) {
  "-" == l3[0] ? n2.setProperty(l3, null == u4 ? "" : u4) : n2[l3] = null == u4 ? "" : "number" != typeof u4 || y.test(l3) ? u4 : u4 + "px";
}
function F(n2, l3, u4, t3, i4) {
  var r3;
  n: if ("style" == l3) if ("string" == typeof u4) n2.style.cssText = u4;
  else {
    if ("string" == typeof t3 && (n2.style.cssText = t3 = ""), t3) for (l3 in t3) u4 && l3 in u4 || T(n2.style, l3, "");
    if (u4) for (l3 in u4) t3 && u4[l3] === t3[l3] || T(n2.style, l3, u4[l3]);
  }
  else if ("o" == l3[0] && "n" == l3[1]) r3 = l3 != (l3 = l3.replace(f, "$1")), l3 = l3.toLowerCase() in n2 || "onFocusOut" == l3 || "onFocusIn" == l3 ? l3.toLowerCase().slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + r3] = u4, u4 ? t3 ? u4.u = t3.u : (u4.u = c, n2.addEventListener(l3, r3 ? a : s, r3)) : n2.removeEventListener(l3, r3 ? a : s, r3);
  else {
    if ("http://www.w3.org/2000/svg" == i4) l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l3 && "height" != l3 && "href" != l3 && "list" != l3 && "form" != l3 && "tabIndex" != l3 && "download" != l3 && "rowSpan" != l3 && "colSpan" != l3 && "role" != l3 && "popover" != l3 && l3 in n2) try {
      n2[l3] = null == u4 ? "" : u4;
      break n;
    } catch (n3) {
    }
    "function" == typeof u4 || (null == u4 || false === u4 && "-" != l3[4] ? n2.removeAttribute(l3) : n2.setAttribute(l3, "popover" == l3 && 1 == u4 ? "" : u4));
  }
}
function O(n2) {
  return function(u4) {
    if (this.l) {
      var t3 = this.l[u4.type + n2];
      if (null == u4.t) u4.t = c++;
      else if (u4.t < t3.u) return;
      return t3(l.event ? l.event(u4) : u4);
    }
  };
}
function j(n2, u4, t3, i4, r3, o3, e3, f4, c3, s3) {
  var a3, h3, p3, v3, y3, g4, m3, b2, C3, S2, M2, P4, I2, A4, H3, L2, T4, F4 = u4.type;
  if (void 0 !== u4.constructor) return null;
  128 & t3.__u && (c3 = !!(32 & t3.__u), o3 = [f4 = u4.__e = t3.__e]), (a3 = l.__b) && a3(u4);
  n: if ("function" == typeof F4) try {
    if (b2 = u4.props, C3 = "prototype" in F4 && F4.prototype.render, S2 = (a3 = F4.contextType) && i4[a3.__c], M2 = a3 ? S2 ? S2.props.value : a3.__ : i4, t3.__c ? m3 = (h3 = u4.__c = t3.__c).__ = h3.__E : (C3 ? u4.__c = h3 = new F4(b2, M2) : (u4.__c = h3 = new x(b2, M2), h3.constructor = F4, h3.render = B), S2 && S2.sub(h3), h3.props = b2, h3.state || (h3.state = {}), h3.context = M2, h3.__n = i4, p3 = h3.__d = true, h3.__h = [], h3._sb = []), C3 && null == h3.__s && (h3.__s = h3.state), C3 && null != F4.getDerivedStateFromProps && (h3.__s == h3.state && (h3.__s = w({}, h3.__s)), w(h3.__s, F4.getDerivedStateFromProps(b2, h3.__s))), v3 = h3.props, y3 = h3.state, h3.__v = u4, p3) C3 && null == F4.getDerivedStateFromProps && null != h3.componentWillMount && h3.componentWillMount(), C3 && null != h3.componentDidMount && h3.__h.push(h3.componentDidMount);
    else {
      if (C3 && null == F4.getDerivedStateFromProps && b2 !== v3 && null != h3.componentWillReceiveProps && h3.componentWillReceiveProps(b2, M2), !h3.__e && (null != h3.shouldComponentUpdate && false === h3.shouldComponentUpdate(b2, h3.__s, M2) || u4.__v == t3.__v)) {
        for (u4.__v != t3.__v && (h3.props = b2, h3.state = h3.__s, h3.__d = false), u4.__e = t3.__e, u4.__k = t3.__k, u4.__k.some(function(n3) {
          n3 && (n3.__ = u4);
        }), P4 = 0; P4 < h3._sb.length; P4++) h3.__h.push(h3._sb[P4]);
        h3._sb = [], h3.__h.length && e3.push(h3);
        break n;
      }
      null != h3.componentWillUpdate && h3.componentWillUpdate(b2, h3.__s, M2), C3 && null != h3.componentDidUpdate && h3.__h.push(function() {
        h3.componentDidUpdate(v3, y3, g4);
      });
    }
    if (h3.context = M2, h3.props = b2, h3.__P = n2, h3.__e = false, I2 = l.__r, A4 = 0, C3) {
      for (h3.state = h3.__s, h3.__d = false, I2 && I2(u4), a3 = h3.render(h3.props, h3.state, h3.context), H3 = 0; H3 < h3._sb.length; H3++) h3.__h.push(h3._sb[H3]);
      h3._sb = [];
    } else do {
      h3.__d = false, I2 && I2(u4), a3 = h3.render(h3.props, h3.state, h3.context), h3.state = h3.__s;
    } while (h3.__d && ++A4 < 25);
    h3.state = h3.__s, null != h3.getChildContext && (i4 = w(w({}, i4), h3.getChildContext())), C3 && !p3 && null != h3.getSnapshotBeforeUpdate && (g4 = h3.getSnapshotBeforeUpdate(v3, y3)), f4 = $(n2, d(L2 = null != a3 && a3.type === k && null == a3.key ? a3.props.children : a3) ? L2 : [L2], u4, t3, i4, r3, o3, e3, f4, c3, s3), h3.base = u4.__e, u4.__u &= -161, h3.__h.length && e3.push(h3), m3 && (h3.__E = h3.__ = null);
  } catch (n3) {
    if (u4.__v = null, c3 || null != o3) if (n3.then) {
      for (u4.__u |= c3 ? 160 : 128; f4 && 8 == f4.nodeType && f4.nextSibling; ) f4 = f4.nextSibling;
      o3[o3.indexOf(f4)] = null, u4.__e = f4;
    } else for (T4 = o3.length; T4--; ) _(o3[T4]);
    else u4.__e = t3.__e, u4.__k = t3.__k;
    l.__e(n3, u4, t3);
  }
  else null == o3 && u4.__v == t3.__v ? (u4.__k = t3.__k, u4.__e = t3.__e) : f4 = u4.__e = N(t3.__e, u4, t3, i4, r3, o3, e3, c3, s3);
  return (a3 = l.diffed) && a3(u4), 128 & u4.__u ? void 0 : f4;
}
function z(n2, u4, t3) {
  for (var i4 = 0; i4 < t3.length; i4++) V(t3[i4], t3[++i4], t3[++i4]);
  l.__c && l.__c(u4, n2), n2.some(function(u5) {
    try {
      n2 = u5.__h, u5.__h = [], n2.some(function(n3) {
        n3.call(u5);
      });
    } catch (n3) {
      l.__e(n3, u5.__v);
    }
  });
}
function N(u4, t3, i4, r3, o3, e3, f4, c3, s3) {
  var a3, h3, v3, y3, w3, g4, m3, b2 = i4.props, k3 = t3.props, x3 = t3.type;
  if ("svg" == x3 ? o3 = "http://www.w3.org/2000/svg" : "math" == x3 ? o3 = "http://www.w3.org/1998/Math/MathML" : o3 || (o3 = "http://www.w3.org/1999/xhtml"), null != e3) {
    for (a3 = 0; a3 < e3.length; a3++) if ((w3 = e3[a3]) && "setAttribute" in w3 == !!x3 && (x3 ? w3.localName == x3 : 3 == w3.nodeType)) {
      u4 = w3, e3[a3] = null;
      break;
    }
  }
  if (null == u4) {
    if (null == x3) return document.createTextNode(k3);
    u4 = document.createElementNS(o3, x3, k3.is && k3), c3 && (l.__m && l.__m(t3, e3), c3 = false), e3 = null;
  }
  if (null === x3) b2 === k3 || c3 && u4.data === k3 || (u4.data = k3);
  else {
    if (e3 = e3 && n.call(u4.childNodes), b2 = i4.props || p, !c3 && null != e3) for (b2 = {}, a3 = 0; a3 < u4.attributes.length; a3++) b2[(w3 = u4.attributes[a3]).name] = w3.value;
    for (a3 in b2) if (w3 = b2[a3], "children" == a3) ;
    else if ("dangerouslySetInnerHTML" == a3) v3 = w3;
    else if (!(a3 in k3)) {
      if ("value" == a3 && "defaultValue" in k3 || "checked" == a3 && "defaultChecked" in k3) continue;
      F(u4, a3, null, w3, o3);
    }
    for (a3 in k3) w3 = k3[a3], "children" == a3 ? y3 = w3 : "dangerouslySetInnerHTML" == a3 ? h3 = w3 : "value" == a3 ? g4 = w3 : "checked" == a3 ? m3 = w3 : c3 && "function" != typeof w3 || b2[a3] === w3 || F(u4, a3, w3, b2[a3], o3);
    if (h3) c3 || v3 && (h3.__html === v3.__html || h3.__html === u4.innerHTML) || (u4.innerHTML = h3.__html), t3.__k = [];
    else if (v3 && (u4.innerHTML = ""), $(u4, d(y3) ? y3 : [y3], t3, i4, r3, "foreignObject" == x3 ? "http://www.w3.org/1999/xhtml" : o3, e3, f4, e3 ? e3[0] : i4.__k && C(i4, 0), c3, s3), null != e3) for (a3 = e3.length; a3--; ) _(e3[a3]);
    c3 || (a3 = "value", "progress" == x3 && null == g4 ? u4.removeAttribute("value") : void 0 !== g4 && (g4 !== u4[a3] || "progress" == x3 && !g4 || "option" == x3 && g4 !== b2[a3]) && F(u4, a3, g4, b2[a3], o3), a3 = "checked", void 0 !== m3 && m3 !== u4[a3] && F(u4, a3, m3, b2[a3], o3));
  }
  return u4;
}
function V(n2, u4, t3) {
  try {
    if ("function" == typeof n2) {
      var i4 = "function" == typeof n2.__u;
      i4 && n2.__u(), i4 && null == u4 || (n2.__u = n2(u4));
    } else n2.current = u4;
  } catch (n3) {
    l.__e(n3, t3);
  }
}
function q(n2, u4, t3) {
  var i4, r3;
  if (l.unmount && l.unmount(n2), (i4 = n2.ref) && (i4.current && i4.current !== n2.__e || V(i4, null, u4)), null != (i4 = n2.__c)) {
    if (i4.componentWillUnmount) try {
      i4.componentWillUnmount();
    } catch (n3) {
      l.__e(n3, u4);
    }
    i4.base = i4.__P = null;
  }
  if (i4 = n2.__k) for (r3 = 0; r3 < i4.length; r3++) i4[r3] && q(i4[r3], u4, t3 || "function" != typeof n2.type);
  t3 || _(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
}
function B(n2, l3, u4) {
  return this.constructor(n2, u4);
}
function D(u4, t3, i4) {
  var r3, o3, e3, f4;
  t3 == document && (t3 = document.documentElement), l.__ && l.__(u4, t3), o3 = (r3 = "function" == typeof i4) ? null : i4 && i4.__k || t3.__k, e3 = [], f4 = [], j(t3, u4 = (!r3 && i4 || t3).__k = g(k, null, [u4]), o3 || p, p, t3.namespaceURI, !r3 && i4 ? [i4] : o3 ? null : t3.firstChild ? n.call(t3.childNodes) : null, e3, !r3 && i4 ? i4 : o3 ? o3.__e : t3.firstChild, r3, f4), z(e3, u4, f4);
}
n = v.slice, l = { __e: function(n2, l3, u4, t3) {
  for (var i4, r3, o3; l3 = l3.__; ) if ((i4 = l3.__c) && !i4.__) try {
    if ((r3 = i4.constructor) && null != r3.getDerivedStateFromError && (i4.setState(r3.getDerivedStateFromError(n2)), o3 = i4.__d), null != i4.componentDidCatch && (i4.componentDidCatch(n2, t3 || {}), o3 = i4.__d), o3) return i4.__E = i4;
  } catch (l4) {
    n2 = l4;
  }
  throw n2;
} }, u = 0, t = function(n2) {
  return null != n2 && null == n2.constructor;
}, x.prototype.setState = function(n2, l3) {
  var u4;
  u4 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = w({}, this.state), "function" == typeof n2 && (n2 = n2(w({}, u4), this.props)), n2 && w(u4, n2), null != n2 && this.__v && (l3 && this._sb.push(l3), M(this));
}, x.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), M(this));
}, x.prototype.render = k, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n2, l3) {
  return n2.__v.__b - l3.__v.__b;
}, P.__r = 0, f = /(PointerCapture)$|Capture$/i, c = 0, s = O(false), a = O(true), h = 0;

// node_modules/preact/hooks/dist/hooks.module.js
var t2;
var r2;
var u2;
var i2;
var o2 = 0;
var f2 = [];
var c2 = l;
var e2 = c2.__b;
var a2 = c2.__r;
var v2 = c2.diffed;
var l2 = c2.__c;
var m2 = c2.unmount;
var s2 = c2.__;
function d2(n2, t3) {
  c2.__h && c2.__h(r2, n2, o2 || t3), o2 = 0;
  var u4 = r2.__H || (r2.__H = { __: [], __h: [] });
  return n2 >= u4.__.length && u4.__.push({}), u4.__[n2];
}
function h2(n2) {
  return o2 = 1, p2(D2, n2);
}
function p2(n2, u4, i4) {
  var o3 = d2(t2++, 2);
  if (o3.t = n2, !o3.__c && (o3.__ = [i4 ? i4(u4) : D2(void 0, u4), function(n3) {
    var t3 = o3.__N ? o3.__N[0] : o3.__[0], r3 = o3.t(t3, n3);
    t3 !== r3 && (o3.__N = [r3, o3.__[1]], o3.__c.setState({}));
  }], o3.__c = r2, !r2.u)) {
    var f4 = function(n3, t3, r3) {
      if (!o3.__c.__H) return true;
      var u5 = o3.__c.__H.__.filter(function(n4) {
        return !!n4.__c;
      });
      if (u5.every(function(n4) {
        return !n4.__N;
      })) return !c3 || c3.call(this, n3, t3, r3);
      var i5 = o3.__c.props !== n3;
      return u5.forEach(function(n4) {
        if (n4.__N) {
          var t4 = n4.__[0];
          n4.__ = n4.__N, n4.__N = void 0, t4 !== n4.__[0] && (i5 = true);
        }
      }), c3 && c3.call(this, n3, t3, r3) || i5;
    };
    r2.u = true;
    var c3 = r2.shouldComponentUpdate, e3 = r2.componentWillUpdate;
    r2.componentWillUpdate = function(n3, t3, r3) {
      if (this.__e) {
        var u5 = c3;
        c3 = void 0, f4(n3, t3, r3), c3 = u5;
      }
      e3 && e3.call(this, n3, t3, r3);
    }, r2.shouldComponentUpdate = f4;
  }
  return o3.__N || o3.__;
}
function y2(n2, u4) {
  var i4 = d2(t2++, 3);
  !c2.__s && C2(i4.__H, u4) && (i4.__ = n2, i4.i = u4, r2.__H.__h.push(i4));
}
function _2(n2, u4) {
  var i4 = d2(t2++, 4);
  !c2.__s && C2(i4.__H, u4) && (i4.__ = n2, i4.i = u4, r2.__h.push(i4));
}
function A2(n2) {
  return o2 = 5, T2(function() {
    return { current: n2 };
  }, []);
}
function F2(n2, t3, r3) {
  o2 = 6, _2(function() {
    return "function" == typeof n2 ? (n2(t3()), function() {
      return n2(null);
    }) : n2 ? (n2.current = t3(), function() {
      return n2.current = null;
    }) : void 0;
  }, null == r3 ? r3 : r3.concat(n2));
}
function T2(n2, r3) {
  var u4 = d2(t2++, 7);
  return C2(u4.__H, r3) && (u4.__ = n2(), u4.__H = r3, u4.__h = n2), u4.__;
}
function q2(n2, t3) {
  return o2 = 8, T2(function() {
    return n2;
  }, t3);
}
function g2() {
  var n2 = d2(t2++, 11);
  if (!n2.__) {
    for (var u4 = r2.__v; null !== u4 && !u4.__m && null !== u4.__; ) u4 = u4.__;
    var i4 = u4.__m || (u4.__m = [0, 0]);
    n2.__ = "P" + i4[0] + "-" + i4[1]++;
  }
  return n2.__;
}
function j2() {
  for (var n2; n2 = f2.shift(); ) if (n2.__P && n2.__H) try {
    n2.__H.__h.forEach(z2), n2.__H.__h.forEach(B2), n2.__H.__h = [];
  } catch (t3) {
    n2.__H.__h = [], c2.__e(t3, n2.__v);
  }
}
c2.__b = function(n2) {
  r2 = null, e2 && e2(n2);
}, c2.__ = function(n2, t3) {
  n2 && t3.__k && t3.__k.__m && (n2.__m = t3.__k.__m), s2 && s2(n2, t3);
}, c2.__r = function(n2) {
  a2 && a2(n2), t2 = 0;
  var i4 = (r2 = n2.__c).__H;
  i4 && (u2 === r2 ? (i4.__h = [], r2.__h = [], i4.__.forEach(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.i = n3.__N = void 0;
  })) : (i4.__h.forEach(z2), i4.__h.forEach(B2), i4.__h = [], t2 = 0)), u2 = r2;
}, c2.diffed = function(n2) {
  v2 && v2(n2);
  var t3 = n2.__c;
  t3 && t3.__H && (t3.__H.__h.length && (1 !== f2.push(t3) && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t3.__H.__.forEach(function(n3) {
    n3.i && (n3.__H = n3.i), n3.i = void 0;
  })), u2 = r2 = null;
}, c2.__c = function(n2, t3) {
  t3.some(function(n3) {
    try {
      n3.__h.forEach(z2), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B2(n4);
      });
    } catch (r3) {
      t3.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t3 = [], c2.__e(r3, n3.__v);
    }
  }), l2 && l2(n2, t3);
}, c2.unmount = function(n2) {
  m2 && m2(n2);
  var t3, r3 = n2.__c;
  r3 && r3.__H && (r3.__H.__.forEach(function(n3) {
    try {
      z2(n3);
    } catch (n4) {
      t3 = n4;
    }
  }), r3.__H = void 0, t3 && c2.__e(t3, r3.__v));
};
var k2 = "function" == typeof requestAnimationFrame;
function w2(n2) {
  var t3, r3 = function() {
    clearTimeout(u4), k2 && cancelAnimationFrame(t3), setTimeout(n2);
  }, u4 = setTimeout(r3, 100);
  k2 && (t3 = requestAnimationFrame(r3));
}
function z2(n2) {
  var t3 = r2, u4 = n2.__c;
  "function" == typeof u4 && (n2.__c = void 0, u4()), r2 = t3;
}
function B2(n2) {
  var t3 = r2;
  n2.__c = n2.__(), r2 = t3;
}
function C2(n2, t3) {
  return !n2 || n2.length !== t3.length || t3.some(function(t4, r3) {
    return t4 !== n2[r3];
  });
}
function D2(n2, t3) {
  return "function" == typeof t3 ? t3(n2) : t3;
}

// node_modules/preact/compat/dist/compat.module.js
function g3(n2, t3) {
  for (var e3 in t3) n2[e3] = t3[e3];
  return n2;
}
function E2(n2, t3) {
  for (var e3 in n2) if ("__source" !== e3 && !(e3 in t3)) return true;
  for (var r3 in t3) if ("__source" !== r3 && n2[r3] !== t3[r3]) return true;
  return false;
}
function N2(n2, t3) {
  this.props = n2, this.context = t3;
}
(N2.prototype = new x()).isPureReactComponent = true, N2.prototype.shouldComponentUpdate = function(n2, t3) {
  return E2(this.props, n2) || E2(this.state, t3);
};
var T3 = l.__b;
l.__b = function(n2) {
  n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), T3 && T3(n2);
};
var A3 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
function D3(n2) {
  function t3(t4) {
    var e3 = g3({}, t4);
    return delete e3.ref, n2(e3, t4.ref || null);
  }
  return t3.$$typeof = A3, t3.render = t3, t3.prototype.isReactComponent = t3.__f = true, t3.displayName = "ForwardRef(" + (n2.displayName || n2.name) + ")", t3;
}
var F3 = l.__e;
l.__e = function(n2, t3, e3, r3) {
  if (n2.then) {
    for (var u4, o3 = t3; o3 = o3.__; ) if ((u4 = o3.__c) && u4.__c) return null == t3.__e && (t3.__e = e3.__e, t3.__k = e3.__k), u4.__c(n2, t3);
  }
  F3(n2, t3, e3, r3);
};
var U = l.unmount;
function V2(n2, t3, e3) {
  return n2 && (n2.__c && n2.__c.__H && (n2.__c.__H.__.forEach(function(n3) {
    "function" == typeof n3.__c && n3.__c();
  }), n2.__c.__H = null), null != (n2 = g3({}, n2)).__c && (n2.__c.__P === e3 && (n2.__c.__P = t3), n2.__c = null), n2.__k = n2.__k && n2.__k.map(function(n3) {
    return V2(n3, t3, e3);
  })), n2;
}
function W(n2, t3, e3) {
  return n2 && e3 && (n2.__v = null, n2.__k = n2.__k && n2.__k.map(function(n3) {
    return W(n3, t3, e3);
  }), n2.__c && n2.__c.__P === t3 && (n2.__e && e3.appendChild(n2.__e), n2.__c.__e = true, n2.__c.__P = e3)), n2;
}
function P3() {
  this.__u = 0, this.o = null, this.__b = null;
}
function j3(n2) {
  var t3 = n2.__.__c;
  return t3 && t3.__a && t3.__a(n2);
}
function B3() {
  this.i = null, this.l = null;
}
l.unmount = function(n2) {
  var t3 = n2.__c;
  t3 && t3.__R && t3.__R(), t3 && 32 & n2.__u && (n2.type = null), U && U(n2);
}, (P3.prototype = new x()).__c = function(n2, t3) {
  var e3 = t3.__c, r3 = this;
  null == r3.o && (r3.o = []), r3.o.push(e3);
  var u4 = j3(r3.__v), o3 = false, i4 = function() {
    o3 || (o3 = true, e3.__R = null, u4 ? u4(c3) : c3());
  };
  e3.__R = i4;
  var c3 = function() {
    if (!--r3.__u) {
      if (r3.state.__a) {
        var n3 = r3.state.__a;
        r3.__v.__k[0] = W(n3, n3.__c.__P, n3.__c.__O);
      }
      var t4;
      for (r3.setState({ __a: r3.__b = null }); t4 = r3.o.pop(); ) t4.forceUpdate();
    }
  };
  r3.__u++ || 32 & t3.__u || r3.setState({ __a: r3.__b = r3.__v.__k[0] }), n2.then(i4, i4);
}, P3.prototype.componentWillUnmount = function() {
  this.o = [];
}, P3.prototype.render = function(n2, e3) {
  if (this.__b) {
    if (this.__v.__k) {
      var r3 = document.createElement("div"), o3 = this.__v.__k[0].__c;
      this.__v.__k[0] = V2(this.__b, r3, o3.__O = o3.__P);
    }
    this.__b = null;
  }
  var i4 = e3.__a && g(k, null, n2.fallback);
  return i4 && (i4.__u &= -33), [g(k, null, e3.__a ? null : n2.children), i4];
};
var H2 = function(n2, t3, e3) {
  if (++e3[1] === e3[0] && n2.l.delete(t3), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.l.size)) for (e3 = n2.i; e3; ) {
    for (; e3.length > 3; ) e3.pop()();
    if (e3[1] < e3[0]) break;
    n2.i = e3 = e3[2];
  }
};
function Z(n2) {
  return this.getChildContext = function() {
    return n2.context;
  }, n2.children;
}
function Y(n2) {
  var e3 = this, r3 = n2.h;
  e3.componentWillUnmount = function() {
    D(null, e3.v), e3.v = null, e3.h = null;
  }, e3.h && e3.h !== r3 && e3.componentWillUnmount(), e3.v || (e3.h = r3, e3.v = { nodeType: 1, parentNode: r3, childNodes: [], contains: function() {
    return true;
  }, appendChild: function(n3) {
    this.childNodes.push(n3), e3.h.appendChild(n3);
  }, insertBefore: function(n3, t3) {
    this.childNodes.push(n3), e3.h.insertBefore(n3, t3);
  }, removeChild: function(n3) {
    this.childNodes.splice(this.childNodes.indexOf(n3) >>> 1, 1), e3.h.removeChild(n3);
  } }), D(g(Z, { context: e3.context }, n2.__v), e3.v);
}
function $2(n2, e3) {
  var r3 = g(Y, { __v: n2, h: e3 });
  return r3.containerInfo = e3, r3;
}
(B3.prototype = new x()).__a = function(n2) {
  var t3 = this, e3 = j3(t3.__v), r3 = t3.l.get(n2);
  return r3[0]++, function(u4) {
    var o3 = function() {
      t3.props.revealOrder ? (r3.push(u4), H2(t3, n2, r3)) : u4();
    };
    e3 ? e3(o3) : o3();
  };
}, B3.prototype.render = function(n2) {
  this.i = null, this.l = /* @__PURE__ */ new Map();
  var t3 = H(n2.children);
  n2.revealOrder && "b" === n2.revealOrder[0] && t3.reverse();
  for (var e3 = t3.length; e3--; ) this.l.set(t3[e3], this.i = [1, 0, this.i]);
  return n2.children;
}, B3.prototype.componentDidUpdate = B3.prototype.componentDidMount = function() {
  var n2 = this;
  this.l.forEach(function(t3, e3) {
    H2(n2, e3, t3);
  });
};
var q3 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;
var G2 = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
var J2 = /^on(Ani|Tra|Tou|BeforeInp|Compo)/;
var K = /[A-Z0-9]/g;
var Q = "undefined" != typeof document;
var X = function(n2) {
  return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n2);
};
x.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t3) {
  Object.defineProperty(x.prototype, t3, { configurable: true, get: function() {
    return this["UNSAFE_" + t3];
  }, set: function(n2) {
    Object.defineProperty(this, t3, { configurable: true, writable: true, value: n2 });
  } });
});
var en = l.event;
function rn() {
}
function un() {
  return this.cancelBubble;
}
function on() {
  return this.defaultPrevented;
}
l.event = function(n2) {
  return en && (n2 = en(n2)), n2.persist = rn, n2.isPropagationStopped = un, n2.isDefaultPrevented = on, n2.nativeEvent = n2;
};
var cn;
var ln = { enumerable: false, configurable: true, get: function() {
  return this.class;
} };
var fn2 = l.vnode;
l.vnode = function(n2) {
  "string" == typeof n2.type && function(n3) {
    var t3 = n3.props, e3 = n3.type, u4 = {}, o3 = -1 === e3.indexOf("-");
    for (var i4 in t3) {
      var c3 = t3[i4];
      if (!("value" === i4 && "defaultValue" in t3 && null == c3 || Q && "children" === i4 && "noscript" === e3 || "class" === i4 || "className" === i4)) {
        var l3 = i4.toLowerCase();
        "defaultValue" === i4 && "value" in t3 && null == t3.value ? i4 = "value" : "download" === i4 && true === c3 ? c3 = "" : "translate" === l3 && "no" === c3 ? c3 = false : "o" === l3[0] && "n" === l3[1] ? "ondoubleclick" === l3 ? i4 = "ondblclick" : "onchange" !== l3 || "input" !== e3 && "textarea" !== e3 || X(t3.type) ? "onfocus" === l3 ? i4 = "onfocusin" : "onblur" === l3 ? i4 = "onfocusout" : J2.test(i4) && (i4 = l3) : l3 = i4 = "oninput" : o3 && G2.test(i4) ? i4 = i4.replace(K, "-$&").toLowerCase() : null === c3 && (c3 = void 0), "oninput" === l3 && u4[i4 = l3] && (i4 = "oninputCapture"), u4[i4] = c3;
      }
    }
    "select" == e3 && u4.multiple && Array.isArray(u4.value) && (u4.value = H(t3.children).forEach(function(n4) {
      n4.props.selected = -1 != u4.value.indexOf(n4.props.value);
    })), "select" == e3 && null != u4.defaultValue && (u4.value = H(t3.children).forEach(function(n4) {
      n4.props.selected = u4.multiple ? -1 != u4.defaultValue.indexOf(n4.props.value) : u4.defaultValue == n4.props.value;
    })), t3.class && !t3.className ? (u4.class = t3.class, Object.defineProperty(u4, "className", ln)) : (t3.className && !t3.class || t3.class && t3.className) && (u4.class = u4.className = t3.className), n3.props = u4;
  }(n2), n2.$$typeof = q3, fn2 && fn2(n2);
};
var an = l.__r;
l.__r = function(n2) {
  an && an(n2), cn = n2.__c;
};
var sn = l.diffed;
l.diffed = function(n2) {
  sn && sn(n2);
  var t3 = n2.props, e3 = n2.__e;
  null != e3 && "textarea" === n2.type && "value" in t3 && t3.value !== e3.value && (e3.value = null == t3.value ? "" : t3.value), cn = null;
};

// node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
var f3 = 0;
var i3 = Array.isArray;
function u3(e3, t3, n2, o3, i4, u4) {
  t3 || (t3 = {});
  var a3, c3, p3 = t3;
  if ("ref" in p3) for (c3 in p3 = {}, t3) "ref" == c3 ? a3 = t3[c3] : p3[c3] = t3[c3];
  var l3 = { type: e3, props: p3, key: n2, ref: a3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f3, __i: -1, __u: 0, __source: i4, __self: u4 };
  if ("function" == typeof e3 && (a3 = e3.defaultProps)) for (c3 in a3) void 0 === p3[c3] && (p3[c3] = a3[c3]);
  return l.vnode && l.vnode(l3), l3;
}

// lib/utils.jsx
function toHTMLId(text) {
  return text.replace(/[^a-zA-Z0-9\-_:.]/g, "");
}

// lib/OptionsListbox.jsx
var OptionsListbox = D3(
  ({
    id,
    searchText,
    filteredOptions,
    isLoading,
    arrayValues,
    invalidValues,
    multiple,
    allowFreeText,
    onOptionSelect,
    onActiveDescendantChange,
    onClose,
    optionRenderer,
    warningIcon,
    tickIcon,
    optionIconRenderer,
    showValue,
    language,
    loadingRenderer,
    translations,
    theme,
    maxPresentedOptions,
    isOpen,
    shouldUseTray,
    setDropdownRef
  }, ref) => {
    const [activeDescendant, setActiveDescendant] = h2("");
    const listRef = A2(
      /** @type {HTMLUListElement | null} */
      null
    );
    const searchTextTrimmed = searchText.trim();
    const addNewOptionVisible = !isLoading && allowFreeText && searchTextTrimmed && !arrayValues.includes(searchTextTrimmed) && !filteredOptions.find((o3) => o3.value === searchTextTrimmed);
    const scrollOptionIntoView = q2(
      /** @param {string} optionValue */
      (optionValue) => {
        if (!listRef.current || !optionValue) return;
        const elementId = `${id}-option-${toHTMLId(optionValue)}`;
        const element = listRef.current.querySelector(`#${CSS.escape(elementId)}`);
        if (element) {
          const listRect = listRef.current.getBoundingClientRect();
          const itemRect = element.getBoundingClientRect();
          if (itemRect.bottom > listRect.bottom) {
            listRef.current.scrollTop += itemRect.bottom - listRect.bottom;
          } else if (itemRect.top < listRect.top) {
            listRef.current.scrollTop += itemRect.top - listRect.top;
          }
        }
      },
      [id]
    );
    const getNavigableOptions = q2(() => {
      const options = filteredOptions.filter((o3) => !o3.disabled).map((o3) => o3.value);
      if (addNewOptionVisible) {
        return [searchTextTrimmed, ...options];
      }
      return options;
    }, [filteredOptions, addNewOptionVisible, searchTextTrimmed]);
    F2(
      ref,
      () => ({
        navigateDown: () => {
          const options = getNavigableOptions();
          if (options.length === 0) return;
          const currentIndex = activeDescendant ? options.indexOf(activeDescendant) : -1;
          const nextIndex = currentIndex === options.length - 1 ? 0 : currentIndex + 1;
          const nextValue = options[nextIndex];
          if (nextValue !== void 0) {
            setActiveDescendant(nextValue);
            scrollOptionIntoView(nextValue);
          }
        },
        navigateUp: () => {
          const options = getNavigableOptions();
          if (options.length === 0) return;
          const currentIndex = activeDescendant ? options.indexOf(activeDescendant) : 0;
          const prevIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
          const prevValue = options[prevIndex];
          if (prevValue !== void 0) {
            setActiveDescendant(prevValue);
            scrollOptionIntoView(prevValue);
          }
        },
        navigateToFirst: () => {
          const options = getNavigableOptions();
          if (options.length === 0) return;
          const firstValue = options[0];
          if (firstValue !== void 0) {
            setActiveDescendant(firstValue);
            scrollOptionIntoView(firstValue);
          }
        },
        navigateToLast: () => {
          const options = getNavigableOptions();
          if (options.length === 0) return;
          const lastValue = options[options.length - 1];
          if (lastValue !== void 0) {
            setActiveDescendant(lastValue);
            scrollOptionIntoView(lastValue);
          }
        },
        navigatePageDown: () => {
          const options = getNavigableOptions();
          if (options.length === 0) return;
          const firstOptionEl = listRef.current?.querySelector(".PreactDatefield-option");
          const pageSize = listRef.current && firstOptionEl ? Math.max(
            1,
            Math.floor(
              listRef.current.clientHeight / firstOptionEl.getBoundingClientRect().height
            )
          ) : 10;
          const currentIndex = activeDescendant ? options.indexOf(activeDescendant) : -1;
          const targetIndex = Math.min(currentIndex + pageSize, options.length - 1);
          const targetValue = options[targetIndex];
          if (targetValue !== void 0) {
            setActiveDescendant(targetValue);
            scrollOptionIntoView(targetValue);
          }
        },
        navigatePageUp: () => {
          const options = getNavigableOptions();
          if (options.length === 0) return;
          const firstOptionEl = listRef.current?.querySelector(".PreactDatefield-option");
          const pageSize = listRef.current && firstOptionEl ? Math.max(
            1,
            Math.floor(
              listRef.current.clientHeight / firstOptionEl.getBoundingClientRect().height
            )
          ) : 10;
          const currentIndex = activeDescendant ? options.indexOf(activeDescendant) : options.length;
          const targetIndex = Math.max(currentIndex - pageSize, 0);
          const targetValue = options[targetIndex];
          if (targetValue !== void 0) {
            setActiveDescendant(targetValue);
            scrollOptionIntoView(targetValue);
          }
        },
        selectActive: () => {
          if (!activeDescendant) return false;
          if (addNewOptionVisible && activeDescendant === searchTextTrimmed) {
            onOptionSelect(searchTextTrimmed);
            if (!multiple && onClose) {
              onClose();
            }
            return true;
          }
          const option = filteredOptions.find(
            (o3) => o3.value === activeDescendant
          );
          if (option && !option.disabled) {
            onOptionSelect(option.value, { toggleSelected: true });
            if (!multiple && onClose) {
              onClose();
            }
            return true;
          }
          return false;
        },
        getActiveDescendant: () => activeDescendant,
        setActiveDescendant: (value) => {
          setActiveDescendant(value);
          scrollOptionIntoView(value);
        },
        clearActiveDescendant: () => setActiveDescendant("")
      }),
      [
        activeDescendant,
        getNavigableOptions,
        scrollOptionIntoView,
        addNewOptionVisible,
        searchTextTrimmed,
        filteredOptions,
        onOptionSelect,
        multiple,
        onClose
      ]
    );
    y2(() => {
      if (!isOpen) {
        setActiveDescendant("");
      }
    }, [isOpen]);
    y2(() => {
      onActiveDescendantChange?.(activeDescendant);
    }, [activeDescendant, onActiveDescendantChange]);
    const handleListRef = q2(
      /** @param {HTMLUListElement | null} el */
      (el) => {
        listRef.current = el;
        if (setDropdownRef && !shouldUseTray) {
          setDropdownRef(el);
        }
      },
      [setDropdownRef, shouldUseTray]
    );
    if (!isOpen) {
      return null;
    }
    return (
      // biome-ignore lint/a11y/useFocusableInteractive: <explanation>
      /* @__PURE__ */ u3(
        "ul",
        {
          className: [
            "PreactDatefield-options",
            `PreactDatefield--${theme}`,
            shouldUseTray ? "PreactDatefield-options--tray" : ""
          ].filter(Boolean).join(" "),
          role: "listbox",
          id: `${id}-options-listbox`,
          "aria-multiselectable": multiple ? "true" : void 0,
          hidden: !isOpen,
          ref: handleListRef,
          children: isLoading && loadingRenderer ? /* @__PURE__ */ u3("li", { className: "PreactDatefield-option", "aria-disabled": true, children: loadingRenderer(translations.loadingOptions || "Loading...") }) : /* @__PURE__ */ u3(k, { children: [
            addNewOptionVisible && /* @__PURE__ */ u3(
              "li",
              {
                id: `${id}-option-${toHTMLId(searchTextTrimmed)}`,
                className: `PreactDatefield-option ${activeDescendant === searchTextTrimmed ? "PreactDatefield-option--active" : ""}`,
                role: "option",
                tabIndex: -1,
                "aria-selected": false,
                onMouseEnter: () => setActiveDescendant(searchTextTrimmed),
                onMouseDown: (e3) => {
                  e3.preventDefault();
                  e3.stopPropagation();
                  onOptionSelect(searchTextTrimmed);
                  if (!multiple && onClose) {
                    onClose();
                  }
                },
                children: (translations.addOption || 'Add "{value}"').replace("{value}", searchTextTrimmed)
              },
              searchTextTrimmed
            ),
            filteredOptions.map((option) => {
              const isActive = activeDescendant === option.value;
              const isSelected = arrayValues.includes(option.value);
              const isInvalid = invalidValues.includes(option.value);
              const isDisabled = option.disabled;
              const hasDivider = option.divider && !searchTextTrimmed;
              const optionClasses = [
                "PreactDatefield-option",
                isActive ? "PreactDatefield-option--active" : "",
                isSelected ? "PreactDatefield-option--selected" : "",
                isInvalid ? "PreactDatefield-option--invalid" : "",
                isDisabled ? "PreactDatefield-option--disabled" : "",
                hasDivider ? "PreactDatefield-option--divider" : ""
              ].filter(Boolean).join(" ");
              return /* @__PURE__ */ u3(
                "li",
                {
                  id: `${id}-option-${toHTMLId(option.value)}`,
                  className: optionClasses,
                  role: "option",
                  tabIndex: -1,
                  "aria-selected": isSelected,
                  "aria-disabled": isDisabled,
                  onMouseEnter: () => !isDisabled && setActiveDescendant(option.value),
                  onMouseDown: (e3) => {
                    e3.preventDefault();
                    e3.stopPropagation();
                    if (isDisabled) return;
                    onOptionSelect(option.value, { toggleSelected: true });
                    if (!multiple && onClose) {
                      onClose();
                    }
                  },
                  children: [
                    optionRenderer ? optionRenderer({
                      option,
                      language: language || "en",
                      isActive,
                      isSelected,
                      isInvalid,
                      showValue: showValue || false,
                      warningIcon,
                      tickIcon,
                      optionIconRenderer
                    }) : option.label,
                    isSelected && translations.selectedOption ? /* @__PURE__ */ u3(
                      "span",
                      {
                        className: "PreactDatefield-srOnly",
                        "aria-atomic": "true",
                        "data-reader": "selected",
                        "aria-hidden": !isActive,
                        children: translations.selectedOption
                      }
                    ) : null,
                    isInvalid && translations.invalidOption ? /* @__PURE__ */ u3(
                      "span",
                      {
                        className: "PreactDatefield-srOnly",
                        "aria-atomic": "true",
                        "data-reader": "invalid",
                        "aria-hidden": !isActive,
                        children: translations.invalidOption
                      }
                    ) : null
                  ]
                },
                option.value
              );
            }),
            filteredOptions.length === 0 && !isLoading && (!allowFreeText || !searchText || arrayValues.includes(searchText)) && /* @__PURE__ */ u3("li", { className: "PreactDatefield-option", children: translations.noOptionsFound }),
            filteredOptions.length === maxPresentedOptions && translations.typeToLoadMore && /* @__PURE__ */ u3("li", { className: "PreactDatefield-option", children: translations.typeToLoadMore })
          ] })
        }
      )
    );
  }
);
var OptionsListbox_default = OptionsListbox;

// lib/hooks.js
function useLive(initialValue) {
  const [refreshValue, forceRefresh] = h2(0);
  const ref = A2(initialValue);
  let hasValueChanged = false;
  const getValue = T2(() => {
    hasValueChanged = true;
    return () => ref.current;
  }, [refreshValue]);
  const setValue = q2(
    /** @param {T} value */
    (value) => {
      if (value !== ref.current) {
        ref.current = value;
        forceRefresh((x3) => x3 + 1);
      }
    },
    []
  );
  return [getValue, setValue, hasValueChanged];
}
var isTouchDevice = typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)")?.matches;
var visualViewportInitialHeight = window.visualViewport?.height ?? 0;
function subscribeToVirtualKeyboard({ visibleCallback, heightCallback }) {
  if (!isTouchDevice || typeof window === "undefined" || !window.visualViewport) return null;
  let isVisible = false;
  const handleViewportResize = () => {
    if (!window.visualViewport) return;
    const heightDiff = visualViewportInitialHeight - window.visualViewport.height;
    const isVisibleNow = heightDiff > 150;
    if (isVisible !== isVisibleNow) {
      isVisible = isVisibleNow;
      visibleCallback?.(isVisible);
    }
    heightCallback?.(heightDiff, isVisible);
  };
  window.visualViewport.addEventListener("resize", handleViewportResize, { passive: true });
  return () => {
    window.visualViewport?.removeEventListener("resize", handleViewportResize);
  };
}
var isPlaywright = typeof navigator !== "undefined" && navigator.webdriver === true;

// lib/TraySearchList.jsx
var TraySearchList = ({
  id,
  isOpen,
  onClose,
  trayLabel,
  theme,
  translations,
  onInputChange,
  children
}) => {
  const [trayInputValue, setTrayInputValue] = h2("");
  const [virtualKeyboardHeight, setVirtualKeyboardHeight] = h2(0);
  const trayInputRef = A2(
    /** @type {HTMLInputElement | null} */
    null
  );
  const trayModalRef = A2(
    /** @type {HTMLDivElement | null} */
    null
  );
  const originalOverflowRef = A2("");
  const virtualKeyboardHeightAdjustSubscription = A2(
    /** @type {function | null} */
    null
  );
  const virtualKeyboardExplicitlyClosedRef = A2(false);
  const readonlyResetTimeoutRef = A2(
    /** @type {ReturnType<typeof setTimeout> | null} */
    null
  );
  const handleTrayInputChange = q2(
    /**
     * @param {import('preact/compat').ChangeEvent<HTMLInputElement>} e
     */
    (e3) => {
      const value = e3.currentTarget.value;
      setTrayInputValue(value);
      onInputChange(value);
    },
    [onInputChange]
  );
  const preventKeyboardReopenOnOptionTap = q2(() => {
    const input = trayInputRef.current;
    if (!input) return;
    const shouldTemporarilyDisableInput = virtualKeyboardExplicitlyClosedRef.current === true && document.activeElement === input;
    if (!shouldTemporarilyDisableInput) return;
    input.setAttribute("readonly", "readonly");
    if (readonlyResetTimeoutRef.current) {
      clearTimeout(readonlyResetTimeoutRef.current);
    }
    readonlyResetTimeoutRef.current = setTimeout(() => {
      input.removeAttribute("readonly");
      readonlyResetTimeoutRef.current = null;
    }, 10);
  }, []);
  const handleClose = q2(() => {
    setTrayInputValue("");
    setVirtualKeyboardHeight(0);
    virtualKeyboardExplicitlyClosedRef.current = false;
    virtualKeyboardHeightAdjustSubscription.current?.();
    virtualKeyboardHeightAdjustSubscription.current = null;
    if (readonlyResetTimeoutRef.current) {
      clearTimeout(readonlyResetTimeoutRef.current);
      readonlyResetTimeoutRef.current = null;
    }
    trayInputRef.current?.removeAttribute("readonly");
    const scrollingElement = (
      /** @type {HTMLElement} */
      document.scrollingElement || document.documentElement
    );
    scrollingElement.style.overflow = originalOverflowRef.current;
    onClose();
  }, [onClose]);
  y2(() => {
    if (isOpen) {
      const scrollingElement = (
        /** @type {HTMLElement} */
        document.scrollingElement || document.documentElement
      );
      originalOverflowRef.current = scrollingElement.style.overflow;
      scrollingElement.style.overflow = "hidden";
      if (!virtualKeyboardHeightAdjustSubscription.current) {
        virtualKeyboardHeightAdjustSubscription.current = subscribeToVirtualKeyboard({
          heightCallback(keyboardHeight, isVisible) {
            setVirtualKeyboardHeight(isVisible ? keyboardHeight : 0);
            virtualKeyboardExplicitlyClosedRef.current = !isVisible;
          }
        });
      }
      trayInputRef.current?.focus();
    }
  }, [isOpen]);
  y2(() => {
    return () => {
      if (virtualKeyboardHeightAdjustSubscription.current) {
        virtualKeyboardHeightAdjustSubscription.current();
        virtualKeyboardHeightAdjustSubscription.current = null;
      }
      if (readonlyResetTimeoutRef.current) {
        clearTimeout(readonlyResetTimeoutRef.current);
        readonlyResetTimeoutRef.current = null;
      }
      trayInputRef.current?.removeAttribute("readonly");
      virtualKeyboardExplicitlyClosedRef.current = false;
    };
  }, []);
  if (!isOpen) {
    return null;
  }
  return (
    // I couldn't use native <dialog> element because trying to focus input right
    // after dialog.close() doesn't seem to work on Chrome (Android).
    /* @__PURE__ */ u3(
      "div",
      {
        ref: trayModalRef,
        className: `PreactDatefield-modal ${`PreactDatefield--${theme}`}`,
        style: { display: isOpen ? null : "none" },
        onClick: (e3) => {
          if (e3.target === trayModalRef.current) {
            handleClose();
          }
        },
        onKeyDown: (e3) => {
          if (e3.key === "Escape") {
            handleClose();
          }
        },
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": trayLabel ? `${id}-tray-label` : void 0,
        tabIndex: -1,
        children: /* @__PURE__ */ u3("div", { className: `PreactDatefield-tray ${`PreactDatefield--${theme}`}`, children: [
          /* @__PURE__ */ u3("div", { className: "PreactDatefield-trayHeader", children: [
            trayLabel && /* @__PURE__ */ u3(
              "label",
              {
                id: `${id}-tray-label`,
                className: "PreactDatefield-trayLabel",
                htmlFor: `${id}-tray-input`,
                children: trayLabel
              }
            ),
            /* @__PURE__ */ u3(
              "input",
              {
                id: `${id}-tray-input`,
                ref: trayInputRef,
                type: "text",
                value: trayInputValue,
                placeholder: translations.searchPlaceholder,
                onChange: handleTrayInputChange,
                onKeyDown: (e3) => {
                  if (e3.key === "Escape") {
                    handleClose();
                  }
                },
                className: `PreactDatefield-trayInput ${!trayLabel ? "PreactDatefield-trayInput--noLabel" : ""}`,
                role: "combobox",
                "aria-expanded": "true",
                "aria-haspopup": "listbox",
                "aria-controls": `${id}-options-listbox`,
                "aria-label": trayLabel || translations.searchPlaceholder,
                autoComplete: "off"
              }
            )
          ] }),
          /* @__PURE__ */ u3(
            "div",
            {
              onMouseDownCapture: preventKeyboardReopenOnOptionTap,
              onTouchStartCapture: preventKeyboardReopenOnOptionTap,
              children
            }
          ),
          virtualKeyboardHeight > 0 && /* @__PURE__ */ u3(
            "div",
            {
              className: "PreactDatefield-virtualKeyboardSpacer",
              style: { height: `${virtualKeyboardHeight}px` },
              "aria-hidden": "true"
            }
          )
        ] })
      }
    )
  );
};
var TraySearchList_default = TraySearchList;

// lib/dateParser.js
var MONTH_KEYS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december"
];
var MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
var MONTH_SHORT_KEYS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec"
];
var WEEKDAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
var WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
var WEEKDAY_ALIASES = [
  ["sun"],
  ["mon"],
  ["tue", "tues"],
  ["wed", "weds"],
  ["thu", "thur", "thurs"],
  ["fri"],
  ["sat"]
];
var timeZoneFormatterCache = /* @__PURE__ */ new Map();
function normalizeInput(input) {
  return input.toLowerCase().replace(/[,]+/g, " ").replace(/\s+/g, " ").trim();
}
function normalizeToken(token) {
  return token.toLowerCase().replace(/,/g, "").replace(/^[.]+|[.]+$/g, "");
}
function toInt(token) {
  if (!/^\d+$/.test(token)) return null;
  const value = Number(token);
  return Number.isNaN(value) ? null : value;
}
function toDayNumber(token) {
  const asInt = toInt(token);
  if (asInt !== null) return asInt >= 1 && asInt <= 31 ? asInt : null;
  const ordinalMatch = token.toLowerCase().match(/^(\d{1,2})([a-z]{1,4})$/);
  if (!ordinalMatch) return null;
  const suffix = ordinalMatch[2] || "";
  if (suffix === "a" || suffix === "am" || suffix === "p" || suffix === "pm") return null;
  const day = Number(ordinalMatch[1]);
  if (Number.isNaN(day) || day < 1 || day > 31) return null;
  return day;
}
function pad(value, size = 2) {
  return String(value).padStart(size, "0");
}
function isValidDate(year, month, day) {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}
function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}
function monthMatches(token) {
  if (!token || !/^[a-z]+$/.test(token)) return [];
  const out = [];
  for (let i4 = 0; i4 < MONTH_KEYS.length; i4 += 1) {
    const full = MONTH_KEYS[i4] || "";
    const short = MONTH_SHORT_KEYS[i4] || "";
    if (full.startsWith(token) || short.startsWith(token)) {
      out.push({ month: i4 + 1, partial: token !== full && token !== short });
    }
  }
  return out;
}
function weekdayMatches(token) {
  if (!token || !/^[a-z]+$/.test(token)) return [];
  const out = [];
  for (let i4 = 0; i4 < WEEKDAY_KEYS.length; i4 += 1) {
    const full = WEEKDAY_KEYS[i4] || "";
    const aliases = WEEKDAY_ALIASES[i4] || [];
    let matches = full.startsWith(token);
    for (const alias of aliases) {
      if (alias.startsWith(token)) {
        matches = true;
        break;
      }
    }
    if (!matches) continue;
    const isExact = full === token || aliases.includes(token);
    out.push({ weekday: i4, partial: !isExact });
  }
  return out;
}
function parseMeridiem(token) {
  const normalized = normalizeToken(token);
  if (normalized === "a" || normalized === "am") return "am";
  if (normalized === "p" || normalized === "pm") return "pm";
  return null;
}
function resolveDateOrder(dateOrder, locale) {
  if (dateOrder && dateOrder !== "auto") return dateOrder;
  if (!locale) return "DMY";
  const parts = new Intl.DateTimeFormat(locale).formatToParts(new Date(Date.UTC(2006, 0, 2))).filter((part) => part.type === "year" || part.type === "month" || part.type === "day").map((part) => part.type);
  const joined = parts.join("-");
  if (joined === "month-day-year") return "MDY";
  if (joined === "day-month-year") return "DMY";
  if (joined === "year-month-day") return "YMD";
  return "DMY";
}
function normalizeYear(year) {
  if (year >= 1e3 && year <= 9999) return year;
  if (year >= 0 && year <= 99) return 2e3 + year;
  return null;
}
function getPairMonthDay(first, second, resolvedOrder) {
  if (first < 1 || second < 1 || first > 31 || second > 31) return [];
  if (first > 12 && second > 12) return [];
  if (first > 12) return [{ month: second, day: first, ambiguousOrder: false, orderPenalty: 0 }];
  if (second > 12) return [{ month: first, day: second, ambiguousOrder: false, orderPenalty: 0 }];
  const order2 = resolvedOrder === "DMY" ? "DMY" : "MDY";
  if (order2 === "DMY") {
    return [
      { month: second, day: first, ambiguousOrder: true, orderPenalty: 0 },
      { month: first, day: second, ambiguousOrder: true, orderPenalty: 1 }
    ];
  }
  return [
    { month: first, day: second, ambiguousOrder: true, orderPenalty: 0 },
    { month: second, day: first, ambiguousOrder: true, orderPenalty: 1 }
  ];
}
function parseTimeFields(hourRaw, minuteRaw, secondRaw, millisecondRaw, meridiem, allowSeconds, allowMilliseconds) {
  const hourBase = Number(hourRaw);
  const minute = minuteRaw ? Number(minuteRaw) : 0;
  const second = secondRaw ? Number(secondRaw) : 0;
  const millisecond = millisecondRaw ? Number(millisecondRaw.padEnd(3, "0").slice(0, 3)) : 0;
  if ([hourBase, minute, second, millisecond].some((value) => Number.isNaN(value))) return [];
  if (minute < 0 || minute > 59) return [];
  if (second < 0 || second > 59) return [];
  if (millisecond < 0 || millisecond > 999) return [];
  if (!allowSeconds && secondRaw) return [];
  if (!allowMilliseconds && millisecondRaw) return [];
  const hadSeconds = Boolean(secondRaw);
  const hadMilliseconds = Boolean(millisecondRaw);
  if (meridiem) {
    if (hourBase < 1 || hourBase > 12) return [];
    const hour = meridiem === "pm" ? hourBase % 12 + 12 : hourBase % 12;
    return [
      { hour, minute, second, millisecond, assumedMeridiem: false, hadSeconds, hadMilliseconds }
    ];
  }
  if (hourBase < 0 || hourBase > 23) return [];
  if (hourBase >= 13 || hourBase === 0) {
    return [
      {
        hour: hourBase,
        minute,
        second,
        millisecond,
        assumedMeridiem: false,
        hadSeconds,
        hadMilliseconds
      }
    ];
  }
  return [
    {
      hour: hourBase % 12,
      minute,
      second,
      millisecond,
      assumedMeridiem: true,
      hadSeconds,
      hadMilliseconds
    },
    {
      hour: hourBase % 12 + 12,
      minute,
      second,
      millisecond,
      assumedMeridiem: true,
      hadSeconds,
      hadMilliseconds
    }
  ];
}
function parseTimeCandidates(tokens, allowSeconds, allowMilliseconds) {
  const out = [];
  const consumed = /* @__PURE__ */ new Set();
  for (let i4 = 0; i4 < tokens.length; i4 += 1) {
    if (consumed.has(i4)) continue;
    const token = normalizeToken(tokens[i4] || "");
    if (!token) continue;
    let match = token.match(
      /^(\d{1,2})(?::(\d{1,2})(?::(\d{1,2})(?:[:.](\d{1,3}))?)?)?(a|am|p|pm)$/
    );
    if (match) {
      const meridiem = match[5] === "a" || match[5] === "am" ? "am" : "pm";
      const parsed2 = parseTimeFields(
        match[1] || "",
        match[2],
        match[3],
        match[4],
        meridiem,
        allowSeconds,
        allowMilliseconds
      );
      if (parsed2.length) {
        consumed.add(i4);
        for (const item of parsed2) out.push({ ...item, usedIndices: /* @__PURE__ */ new Set([i4]) });
      }
      continue;
    }
    const nextMeridiem = i4 + 1 < tokens.length ? parseMeridiem(tokens[i4 + 1] || "") : null;
    match = token.match(/^(\d{1,2})(?::(\d{1,2})(?::(\d{1,2})(?:[:.](\d{1,3}))?)?)?$/);
    if (match && nextMeridiem) {
      const parsed2 = parseTimeFields(
        match[1] || "",
        match[2],
        match[3],
        match[4],
        nextMeridiem,
        allowSeconds,
        allowMilliseconds
      );
      if (parsed2.length) {
        consumed.add(i4);
        consumed.add(i4 + 1);
        for (const item of parsed2) out.push({ ...item, usedIndices: /* @__PURE__ */ new Set([i4, i4 + 1]) });
      }
      continue;
    }
    match = token.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:[:.](\d{1,3}))?)?$/);
    if (!match) continue;
    const parsed = parseTimeFields(
      match[1] || "",
      match[2],
      match[3],
      match[4],
      null,
      allowSeconds,
      allowMilliseconds
    );
    if (!parsed.length) continue;
    consumed.add(i4);
    for (const item of parsed) out.push({ ...item, usedIndices: /* @__PURE__ */ new Set([i4]) });
  }
  return out;
}
function buildYearOnlyDate(timeFavor) {
  if (timeFavor === "end") return { month: 12, day: 31, boundary: "endOfYear" };
  return { month: 1, day: 1, boundary: "startOfYear" };
}
function getWeekdayDate(now, targetWeekday, dayFavor) {
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentWeekday = date.getDay();
  if (dayFavor === "past") {
    const delta = (currentWeekday - targetWeekday + 7) % 7;
    date.setDate(date.getDate() - delta);
  } else {
    let delta = (targetWeekday - currentWeekday + 7) % 7;
    if (delta === 0) delta = 7;
    date.setDate(date.getDate() + delta);
  }
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  };
}
function shiftDate(date, deltaDays) {
  const shifted = new Date(Date.UTC(date.year, date.month - 1, date.day));
  shifted.setUTCDate(shifted.getUTCDate() + deltaDays);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate()
  };
}
function addDateCandidate(list, year, month, day, usedIndices, explicitYear, explicitMonth, explicitDay, ambiguousOrder, orderPenalty, partialMonth, boundary, weekday = null) {
  if (!isValidDate(year, month, day)) return;
  list.push({
    year,
    month,
    day,
    usedIndices,
    explicitYear,
    explicitMonth,
    explicitDay,
    ambiguousOrder,
    orderPenalty,
    partialMonth,
    boundary,
    weekday
  });
}
function parseDateCandidates(tokens, consumedTimeIndices, now, resolvedOrder, timeFavor, dayFavor) {
  const out = [];
  const separated = [];
  const monthWordTokens = [];
  const numericTokens = [];
  const dayTokens = [];
  const weekdayTokens = [];
  for (let i4 = 0; i4 < tokens.length; i4 += 1) {
    if (consumedTimeIndices.has(i4)) continue;
    const token = normalizeToken(tokens[i4] || "");
    if (!token) continue;
    const separatedMatch = token.match(/^(\d{1,4})[\/.-](\d{1,2})(?:[\/.-](\d{1,4}))?$/);
    if (separatedMatch) {
      separated.push({
        index: i4,
        a: Number(separatedMatch[1]),
        b: Number(separatedMatch[2]),
        c: separatedMatch[3] ? Number(separatedMatch[3]) : null
      });
      continue;
    }
    const months = monthMatches(token);
    if (months.length) {
      monthWordTokens.push({ index: i4, months });
      continue;
    }
    const weekdays = weekdayMatches(token);
    if (weekdays.length) {
      weekdayTokens.push({ index: i4, weekdays });
      continue;
    }
    const day = toDayNumber(token);
    if (day !== null) dayTokens.push({ index: i4, value: day });
    const numeric = toInt(token);
    if (numeric !== null) numericTokens.push({ index: i4, value: numeric });
  }
  for (const item of separated) {
    const { a: a3, b: b2, c: c3, index } = item;
    if (c3 !== null) {
      if (a3 >= 1e3 && a3 <= 9999) {
        addDateCandidate(out, a3, b2, c3, /* @__PURE__ */ new Set([index]), true, true, true, false, 0, false, "none");
        continue;
      }
      const normalizedYear = normalizeYear(c3);
      if (normalizedYear !== null) {
        const pairs2 = getPairMonthDay(a3, b2, resolvedOrder);
        for (const pair of pairs2) {
          addDateCandidate(
            out,
            normalizedYear,
            pair.month,
            pair.day,
            /* @__PURE__ */ new Set([index]),
            true,
            true,
            true,
            pair.ambiguousOrder,
            pair.orderPenalty,
            false,
            "none"
          );
        }
      }
      continue;
    }
    if (a3 >= 1e3 && a3 <= 9999 && b2 >= 1 && b2 <= 12) {
      const day = timeFavor === "end" ? daysInMonth(a3, b2) : 1;
      addDateCandidate(
        out,
        a3,
        b2,
        day,
        /* @__PURE__ */ new Set([index]),
        true,
        true,
        false,
        false,
        0,
        false,
        timeFavor === "end" ? "endOfMonth" : "startOfMonth"
      );
      continue;
    }
    const pairs = getPairMonthDay(a3, b2, resolvedOrder);
    for (const pair of pairs) {
      addDateCandidate(
        out,
        now.getFullYear(),
        pair.month,
        pair.day,
        /* @__PURE__ */ new Set([index]),
        false,
        true,
        true,
        pair.ambiguousOrder,
        pair.orderPenalty,
        false,
        "none"
      );
    }
  }
  const dayNumbers = dayTokens;
  const yearNumbers = numericTokens.filter((token) => token.value >= 1e3 && token.value <= 9999);
  const shortYearNumbers = numericTokens.filter((token) => token.value >= 0 && token.value <= 99).map((token) => ({ index: token.index, value: 2e3 + token.value }));
  const candidateYearNumbers = [...yearNumbers, ...shortYearNumbers];
  if (monthWordTokens.length && dayNumbers.length) {
    for (const monthToken of monthWordTokens) {
      for (const monthItem of monthToken.months) {
        for (const dayToken of dayNumbers) {
          const years = candidateYearNumbers.filter((token) => token.index !== dayToken.index);
          if (years.length) {
            for (const yearToken of years) {
              addDateCandidate(
                out,
                yearToken.value,
                monthItem.month,
                dayToken.value,
                /* @__PURE__ */ new Set([monthToken.index, dayToken.index, yearToken.index]),
                true,
                true,
                true,
                false,
                0,
                monthItem.partial,
                "none"
              );
            }
            continue;
          }
          addDateCandidate(
            out,
            now.getFullYear(),
            monthItem.month,
            dayToken.value,
            /* @__PURE__ */ new Set([monthToken.index, dayToken.index]),
            false,
            true,
            true,
            false,
            0,
            monthItem.partial,
            "none"
          );
        }
      }
    }
  }
  if (!monthWordTokens.length && !separated.length) {
    const yearOnly = yearNumbers.length === 1 ? yearNumbers[0] : null;
    if (yearOnly && dayNumbers.length === 0 && numericTokens.length === 1) {
      const boundaryDate = buildYearOnlyDate(timeFavor);
      addDateCandidate(
        out,
        yearOnly.value,
        boundaryDate.month,
        boundaryDate.day,
        /* @__PURE__ */ new Set([yearOnly.index]),
        true,
        false,
        false,
        false,
        0,
        false,
        boundaryDate.boundary
      );
    }
    const nonYear = numericTokens.filter((token) => token.value < 1e3);
    if (nonYear.length >= 2) {
      const first = nonYear[0];
      const second = nonYear[1];
      const firstYear = yearNumbers[0] || (nonYear.length >= 3 ? shortYearNumbers.find(
        (token) => token.index !== first?.index && token.index !== second?.index
      ) || null : null);
      if (first && second) {
        const inferredYear = firstYear ? firstYear.value : now.getFullYear();
        const pairs = getPairMonthDay(first.value, second.value, resolvedOrder);
        for (const pair of pairs) {
          addDateCandidate(
            out,
            inferredYear,
            pair.month,
            pair.day,
            /* @__PURE__ */ new Set([first.index, second.index, ...firstYear ? [firstYear.index] : []]),
            Boolean(firstYear),
            true,
            true,
            pair.ambiguousOrder,
            pair.orderPenalty,
            false,
            "none"
          );
        }
      }
    }
    if (dayNumbers.length) {
      const firstDay = dayNumbers[0];
      const firstYear = yearNumbers[0] || null;
      if (firstDay) {
        addDateCandidate(
          out,
          firstYear ? firstYear.value : now.getFullYear(),
          now.getMonth() + 1,
          firstDay.value,
          /* @__PURE__ */ new Set([firstDay.index, ...firstYear ? [firstYear.index] : []]),
          Boolean(firstYear),
          false,
          true,
          false,
          0,
          false,
          "none"
        );
      }
    }
    if (!numericTokens.length && weekdayTokens.length) {
      const today = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
      const currentWeekday = now.getDay();
      for (const weekdayToken of weekdayTokens) {
        for (const weekdayItem of weekdayToken.weekdays) {
          const pastDate = getWeekdayDate(now, weekdayItem.weekday, "past");
          const upcomingDate = getWeekdayDate(now, weekdayItem.weekday, "future");
          const candidates = weekdayItem.weekday === currentWeekday ? dayFavor === "future" ? [upcomingDate, today, shiftDate(today, -7)] : [shiftDate(today, -7), today, upcomingDate] : dayFavor === "future" ? [upcomingDate, pastDate] : [pastDate, upcomingDate];
          for (let orderPenalty = 0; orderPenalty < candidates.length; orderPenalty += 1) {
            const candidate = candidates[orderPenalty];
            if (!candidate) continue;
            addDateCandidate(
              out,
              candidate.year,
              candidate.month,
              candidate.day,
              /* @__PURE__ */ new Set([weekdayToken.index]),
              false,
              false,
              false,
              false,
              orderPenalty,
              weekdayItem.partial,
              "none",
              weekdayItem.weekday
            );
          }
        }
      }
    }
  }
  return out;
}
function scoreCandidate(candidate, explicitTime, assumedMeridiem, ignoredTokenCount, mode) {
  let score = 100;
  score += candidate.explicitYear ? 9 : -9;
  score += candidate.explicitMonth ? 8 : -8;
  score += candidate.explicitDay ? 8 : -8;
  if (explicitTime) score += 12;
  if (mode === "datetime" && !explicitTime) score -= 4;
  if (candidate.ambiguousOrder) score -= 3;
  score -= candidate.orderPenalty * 2;
  if (candidate.partialMonth) score -= 2;
  if (assumedMeridiem) score -= 2;
  if (candidate.boundary !== "none") score -= 2;
  score -= ignoredTokenCount * 2;
  return score;
}
function toTimeLabel(hour, minute, second, millisecond, includeSeconds, includeMilliseconds) {
  const meridiem = hour >= 12 ? "PM" : "AM";
  const clockHour = hour % 12 || 12;
  let text = `${clockHour}:${pad(minute)} ${meridiem}`;
  if (includeSeconds) text = `${clockHour}:${pad(minute)}:${pad(second)} ${meridiem}`;
  if (includeMilliseconds)
    text = `${clockHour}:${pad(minute)}:${pad(second)}.${pad(millisecond, 3)} ${meridiem}`;
  return text;
}
function toDateLabel(year, month, day) {
  const monthName = MONTH_SHORT[month - 1] || MONTH_SHORT[0];
  return `${monthName} ${day}, ${year}`;
}
function toParsedDateLabel(parsedDate, now) {
  const base = toDateLabel(parsedDate.year, parsedDate.month, parsedDate.day);
  if (parsedDate.weekday == null) return base;
  const weekday = WEEKDAY_LABELS[parsedDate.weekday];
  const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const candidateUTC = Date.UTC(parsedDate.year, parsedDate.month - 1, parsedDate.day);
  const prefix = candidateUTC < todayUTC ? "Past" : candidateUTC > todayUTC ? "Upcoming" : "Today";
  return `${prefix} ${weekday}, ${base}`;
}
function toDateValue(year, month, day) {
  return `${year}-${pad(month)}-${pad(day)}`;
}
function getTimeZoneFormatter(timezone) {
  const cached = timeZoneFormatterCache.get(timezone);
  if (cached) return cached;
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    calendar: "iso8601",
    numberingSystem: "latn",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  timeZoneFormatterCache.set(timezone, formatter);
  return formatter;
}
function getZonedParts(epochMs, timezone) {
  const formatter = getTimeZoneFormatter(timezone);
  const parts = {};
  for (const part of formatter.formatToParts(new Date(epochMs))) {
    if (part.type === "year") parts.year = Number(part.value);
    else if (part.type === "month") parts.month = Number(part.value);
    else if (part.type === "day") parts.day = Number(part.value);
    else if (part.type === "hour") parts.hour = Number(part.value);
    else if (part.type === "minute") parts.minute = Number(part.value);
    else if (part.type === "second") parts.second = Number(part.value);
  }
  return {
    year: parts.year || 0,
    month: parts.month || 0,
    day: parts.day || 0,
    hour: parts.hour || 0,
    minute: parts.minute || 0,
    second: parts.second || 0
  };
}
function getOffsetMs(epochMs, timezone) {
  const baseMs = Math.trunc(epochMs / 1e3) * 1e3;
  const parts = getZonedParts(baseMs, timezone);
  const asUTC = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );
  return asUTC - baseMs;
}
function zonedDateTimeToUTCISOString(year, month, day, hour, minute, second, millisecond, timezone) {
  const desiredLocalAsUTC = Date.UTC(year, month - 1, day, hour, minute, second, 0);
  let guess = desiredLocalAsUTC;
  for (let i4 = 0; i4 < 3; i4 += 1) {
    const next = desiredLocalAsUTC - getOffsetMs(guess, timezone);
    if (next === guess) break;
    guess = next;
  }
  const finalEpoch = guess + millisecond;
  const resolved = getZonedParts(finalEpoch, timezone);
  const isExact = resolved.year === year && resolved.month === month && resolved.day === day && resolved.hour === hour && resolved.minute === minute && resolved.second === second;
  if (!isExact) return null;
  return new Date(finalEpoch).toISOString();
}
function toDateTimeValue(year, month, day, hour, minute, second, millisecond, timezone) {
  try {
    const iso = zonedDateTimeToUTCISOString(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      timezone
    );
    if (iso) return iso;
  } catch (_error) {
  }
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond)).toISOString();
}
function toComparableValue(value, mode) {
  if (!value) return null;
  if (mode === "date") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (!isValidDate(year, month, day)) return null;
    return Date.UTC(year, month - 1, day);
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.getTime();
}
function suggestionComparableValue(suggestion) {
  return suggestion.mode === "date" ? Date.UTC(suggestion.year, suggestion.month - 1, suggestion.day) : new Date(suggestion.value).getTime();
}
function isWithinBounds(suggestion, minComparable, maxComparable, bounds) {
  const value = suggestionComparableValue(suggestion);
  if (Number.isNaN(value)) return false;
  if (minComparable !== null) {
    if (bounds === "exclusive" ? value <= minComparable : value < minComparable) return false;
  }
  if (maxComparable !== null) {
    if (bounds === "exclusive" ? value >= maxComparable : value > maxComparable) return false;
  }
  return true;
}
function buildDefaultSuggestion(mode, timeFavor, timezone, defaultDate) {
  const year = defaultDate.getFullYear();
  const month = defaultDate.getMonth() + 1;
  const day = defaultDate.getDate();
  if (mode === "date") {
    return {
      label: toDateLabel(year, month, day),
      value: toDateValue(year, month, day),
      score: -1e3,
      timezone,
      mode,
      inferredBoundary: "none",
      inferredYear: true,
      inferredMonth: true,
      inferredDay: true,
      inferredTime: true,
      year,
      month,
      day,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    };
  }
  const isEnd = timeFavor === "end";
  const hour = isEnd ? 23 : 0;
  const minute = isEnd ? 59 : 0;
  const second = isEnd ? 59 : 0;
  const millisecond = isEnd ? 999 : 0;
  const inferredBoundary = isEnd ? "endOfDay" : "startOfDay";
  return {
    label: `${toDateLabel(year, month, day)} - ${isEnd ? "end of day" : "start of day"} (${timezone})`,
    value: toDateTimeValue(year, month, day, hour, minute, second, millisecond, timezone),
    score: -1e3,
    timezone,
    mode,
    inferredBoundary,
    inferredYear: true,
    inferredMonth: true,
    inferredDay: true,
    inferredTime: true,
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond
  };
}
function buildDateSuggestions(input, options = {}) {
  const normalizedInput = normalizeInput(input || "");
  const mode = options.mode || "date";
  const timeFavor = options.timeFavor === "end" ? "end" : "start";
  const dayFavor = options.dayFavor === "future" ? "future" : "past";
  const now = options.now || /* @__PURE__ */ new Date();
  const defaultDate = options.defaultDate || now;
  const includeDefaultOption = options.includeDefaultOption !== false;
  const timezone = options.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const resolvedOrder = resolveDateOrder(options.dateOrder || "DMY", options.locale);
  const allowSeconds = Boolean(options.allowSeconds);
  const allowMilliseconds = Boolean(options.allowMilliseconds);
  const bounds = options.bounds === "exclusive" ? "exclusive" : "inclusive";
  const minComparable = toComparableValue(options.minValue, mode);
  const maxComparable = toComparableValue(options.maxValue, mode);
  const maxOptions = Math.max(1, options.maxOptions || 10);
  if (minComparable !== null && maxComparable !== null && (bounds === "exclusive" ? minComparable >= maxComparable : minComparable > maxComparable)) {
    return [];
  }
  if (!normalizedInput) {
    if (!includeDefaultOption) return [];
    const defaultSuggestion = buildDefaultSuggestion(mode, timeFavor, timezone, defaultDate);
    return isWithinBounds(defaultSuggestion, minComparable, maxComparable, bounds) ? [defaultSuggestion] : [];
  }
  const tokens = normalizedInput.split(" ").filter(Boolean);
  const timeCandidates = parseTimeCandidates(tokens, allowSeconds, allowMilliseconds);
  const consumedTimeIndices = /* @__PURE__ */ new Set();
  for (const time of timeCandidates)
    for (const index of time.usedIndices) consumedTimeIndices.add(index);
  let dateCandidates = parseDateCandidates(
    tokens,
    consumedTimeIndices,
    now,
    resolvedOrder,
    timeFavor,
    dayFavor
  );
  if (!dateCandidates.length && mode === "datetime" && timeCandidates.length) {
    dateCandidates = [
      {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        usedIndices: /* @__PURE__ */ new Set(),
        explicitYear: false,
        explicitMonth: false,
        explicitDay: false,
        ambiguousOrder: false,
        orderPenalty: 0,
        partialMonth: false,
        boundary: "none",
        weekday: null
      }
    ];
  }
  if (!dateCandidates.length) return [];
  const suggestions = [];
  const seen = /* @__PURE__ */ new Set();
  for (const dateCandidate of dateCandidates) {
    if (mode === "date") {
      const usedIndices2 = new Set(dateCandidate.usedIndices);
      const ignoredTokenCount2 = Math.max(0, tokens.length - usedIndices2.size);
      const score2 = scoreCandidate(dateCandidate, false, false, ignoredTokenCount2, mode);
      const value2 = toDateValue(dateCandidate.year, dateCandidate.month, dateCandidate.day);
      if (seen.has(value2)) continue;
      seen.add(value2);
      suggestions.push({
        label: toParsedDateLabel(dateCandidate, now),
        value: value2,
        score: score2,
        timezone,
        mode,
        inferredBoundary: "none",
        inferredYear: !dateCandidate.explicitYear,
        inferredMonth: !dateCandidate.explicitMonth,
        inferredDay: !dateCandidate.explicitDay,
        inferredTime: true,
        year: dateCandidate.year,
        month: dateCandidate.month,
        day: dateCandidate.day,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
      });
      continue;
    }
    if (timeCandidates.length) {
      for (const timeCandidate of timeCandidates) {
        const usedIndices2 = /* @__PURE__ */ new Set([...dateCandidate.usedIndices, ...timeCandidate.usedIndices]);
        const ignoredTokenCount2 = Math.max(0, tokens.length - usedIndices2.size);
        const score2 = scoreCandidate(
          dateCandidate,
          true,
          timeCandidate.assumedMeridiem,
          ignoredTokenCount2,
          mode
        );
        const value2 = toDateTimeValue(
          dateCandidate.year,
          dateCandidate.month,
          dateCandidate.day,
          timeCandidate.hour,
          timeCandidate.minute,
          timeCandidate.second,
          timeCandidate.millisecond,
          timezone
        );
        if (seen.has(value2)) continue;
        seen.add(value2);
        const label2 = `${toParsedDateLabel(dateCandidate, now)} - ${toTimeLabel(
          timeCandidate.hour,
          timeCandidate.minute,
          timeCandidate.second,
          timeCandidate.millisecond,
          timeCandidate.hadSeconds,
          timeCandidate.hadMilliseconds
        )} (${timezone})`;
        suggestions.push({
          label: label2,
          value: value2,
          score: score2,
          timezone,
          mode,
          inferredBoundary: "none",
          inferredYear: !dateCandidate.explicitYear,
          inferredMonth: !dateCandidate.explicitMonth,
          inferredDay: !dateCandidate.explicitDay,
          inferredTime: false,
          year: dateCandidate.year,
          month: dateCandidate.month,
          day: dateCandidate.day,
          hour: timeCandidate.hour,
          minute: timeCandidate.minute,
          second: timeCandidate.second,
          millisecond: timeCandidate.millisecond
        });
      }
      continue;
    }
    const isEnd = dateCandidate.boundary === "endOfDay" || dateCandidate.boundary === "endOfYear" || timeFavor === "end";
    const isYearBoundary = dateCandidate.boundary === "startOfYear" || dateCandidate.boundary === "endOfYear";
    const hour = isEnd ? 23 : 0;
    const minute = isEnd ? 59 : 0;
    const second = isEnd ? 59 : 0;
    const millisecond = isEnd ? 999 : 0;
    const inferredBoundary = dateCandidate.boundary === "none" ? isEnd ? "endOfDay" : "startOfDay" : dateCandidate.boundary;
    const usedIndices = new Set(dateCandidate.usedIndices);
    const ignoredTokenCount = Math.max(0, tokens.length - usedIndices.size);
    const score = scoreCandidate(dateCandidate, false, false, ignoredTokenCount, mode);
    const value = toDateTimeValue(
      dateCandidate.year,
      dateCandidate.month,
      dateCandidate.day,
      hour,
      minute,
      second,
      millisecond,
      timezone
    );
    if (seen.has(value)) continue;
    seen.add(value);
    const boundaryLabel = inferredBoundary === "startOfDay" ? "start of day" : inferredBoundary === "endOfDay" ? "end of day" : inferredBoundary === "startOfMonth" ? "start of month" : inferredBoundary === "endOfMonth" ? "end of month" : inferredBoundary === "startOfYear" ? "start of year" : "end of year";
    const label = `${toParsedDateLabel(dateCandidate, now)} - ${boundaryLabel} (${timezone})`;
    suggestions.push({
      label,
      value,
      score: isYearBoundary ? score + 1 : score,
      timezone,
      mode,
      inferredBoundary,
      inferredYear: !dateCandidate.explicitYear,
      inferredMonth: !dateCandidate.explicitMonth,
      inferredDay: !dateCandidate.explicitDay,
      inferredTime: true,
      year: dateCandidate.year,
      month: dateCandidate.month,
      day: dateCandidate.day,
      hour,
      minute,
      second,
      millisecond
    });
  }
  const boundedSuggestions = suggestions.filter(
    (suggestion) => isWithinBounds(suggestion, minComparable, maxComparable, bounds)
  );
  boundedSuggestions.sort(
    (a3, b2) => b2.score - a3.score || a3.year - b2.year || a3.month - b2.month || a3.day - b2.day || a3.hour - b2.hour || a3.minute - b2.minute || a3.second - b2.second || a3.millisecond - b2.millisecond || a3.label.localeCompare(b2.label)
  );
  return boundedSuggestions.slice(0, maxOptions);
}
function isoToDisplayLabel(value, options = {}) {
  if (!value) return "";
  const mode = options.mode || "date";
  const timezone = options.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const allowSeconds = Boolean(options.allowSeconds);
  const allowMilliseconds = Boolean(options.allowMilliseconds);
  try {
    if (mode === "date") {
      const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (!match) return "";
      const year = Number(match[1]);
      const month = Number(match[2]);
      const day = Number(match[3]);
      if (!isValidDate(year, month, day)) return "";
      const parts2 = {
        year,
        month,
        day,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        timezone,
        mode
      };
      if (options.labelFormatter) return options.labelFormatter(parts2);
      return toDateLabel(year, month, day);
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const zonedParts = getZonedParts(date.getTime(), timezone);
    const ms = date.getTime() % 1e3;
    const parts = {
      year: zonedParts.year,
      month: zonedParts.month,
      day: zonedParts.day,
      hour: zonedParts.hour,
      minute: zonedParts.minute,
      second: zonedParts.second,
      millisecond: ms,
      timezone,
      mode
    };
    if (options.labelFormatter) return options.labelFormatter(parts);
    const dateStr = toDateLabel(zonedParts.year, zonedParts.month, zonedParts.day);
    const includeSeconds = allowSeconds && (zonedParts.second !== 0 || ms !== 0);
    const includeMs = allowMilliseconds && ms !== 0;
    const timeStr = toTimeLabel(
      zonedParts.hour,
      zonedParts.minute,
      zonedParts.second,
      ms,
      includeSeconds,
      includeMs
    );
    return `${dateStr} - ${timeStr} (${timezone})`;
  } catch (_error) {
    return "";
  }
}

// lib/PreactDatefield.jsx
var defaultTranslations = {
  searchPlaceholder: "Type a date...",
  noOptionsFound: "No dates found",
  clearValue: "Clear date"
};
var Portal = ({ parent = document.body, children, rootElementRef }) => {
  const [dir, setDir] = h2(
    /** @type {string|null} */
    null
  );
  y2(() => {
    if (rootElementRef?.current) {
      const rootDir = window.getComputedStyle(rootElementRef.current).direction;
      const parentDir = window.getComputedStyle(parent).direction;
      if (rootDir !== parentDir) {
        setDir(rootDir);
      } else {
        setDir(null);
      }
    }
  }, [rootElementRef, parent]);
  const wrappedChildren = dir ? /* @__PURE__ */ u3("div", { dir: (
    /** @type {"auto" | "rtl" | "ltr"} */
    dir
  ), style: { direction: dir }, children }) : children;
  return $2(wrappedChildren, parent);
};
var dropdownPopperModifiers = [
  {
    name: "flip",
    enabled: true
  },
  {
    name: "referenceElementWidth",
    enabled: true,
    phase: "beforeWrite",
    requires: ["computeStyles"],
    // @ts-ignore
    fn: ({ state }) => {
      state.styles.popper.minWidth = `${state.rects.reference.width}px`;
    },
    // @ts-ignore
    effect: ({ state }) => {
      state.elements.popper.style.minWidth = `${state.elements.reference.offsetWidth}px`;
    }
  },
  {
    name: "eventListeners",
    enabled: true,
    options: {
      scroll: true,
      resize: true
    }
  }
];
var defaultChevronIcon = /* @__PURE__ */ u3(
  "svg",
  {
    className: "PreactDatefield-chevron",
    viewBox: "0 0 24 24",
    width: "24",
    height: "24",
    "aria-hidden": "true",
    children: /* @__PURE__ */ u3("path", { d: "M7 10l5 5 5-5z" })
  }
);
function suggestionsToOptions(suggestions) {
  return suggestions.map((s3) => ({
    label: s3.label,
    value: s3.value,
    score: s3.score,
    matched: (
      /** @type {const} */
      "label"
    ),
    matchSlices: []
  }));
}
var PreactDatefield = ({
  id: idProp,
  name,
  className = "",
  value,
  onChange,
  onBlur: onBlurProp,
  mode = "date",
  timeFavor,
  favor,
  dayFavor = "past",
  timezone: timezoneProp,
  dateOrder = "auto",
  locale = "en-US",
  allowSeconds = false,
  allowMilliseconds = false,
  minValue,
  maxValue,
  bounds = "inclusive",
  labelFormatter,
  placeholder = "",
  required = false,
  disabled = false,
  formSubmitCompatible = false,
  theme = "system",
  tray = "auto",
  trayBreakpoint = "768px",
  trayLabel: trayLabelProp,
  showClearButton = true,
  portal = document.body,
  rootElementProps,
  inputProps = {},
  maxSuggestions = 10
}) => {
  const timezone = timezoneProp || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const resolvedTimeFavor = (
    /** @type {DateBoundaryPreference} */
    timeFavor === "end" || timeFavor == null && favor === "end" ? "end" : "start"
  );
  const autoId = g2();
  const id = idProp || autoId;
  const [inputValue, setInputValue] = h2("");
  const [getIsDropdownOpen, setIsDropdownOpen] = useLive(false);
  const [getIsFocused, setIsFocused] = useLive(false);
  const [announcement, setAnnouncement] = h2("");
  const optionsListboxRef = A2(
    /** @type {OptionsListboxRef | null} */
    null
  );
  const [activeDescendantValue, setActiveDescendantValue] = h2("");
  const inputRef = A2(
    /** @type {HTMLInputElement | null} */
    null
  );
  const blurTimeoutRef = A2(
    /** @type {number | undefined} */
    void 0
  );
  const rootElementRef = A2(
    /** @type {HTMLDivElement | null} */
    null
  );
  const dropdownPopperRef = A2(
    /** @type {HTMLUListElement | null} */
    null
  );
  const dropdownClosedExplicitlyRef = A2(false);
  const [getTrayLabel, setTrayLabel] = useLive(trayLabelProp);
  const previousValidValueRef = A2(value || "");
  y2(() => {
    if (value) previousValidValueRef.current = value;
  }, [value]);
  const [getIsTrayOpen, setIsTrayOpen] = useLive(false);
  const trayClosedExplicitlyRef = A2(false);
  const [isMobileScreen, setIsMobileScreen] = h2(false);
  const [trayActiveInputValue, setTrayActiveInputValue] = h2("");
  y2(() => {
    if (tray === "auto") {
      const mediaQuery = window.matchMedia(`(max-width: ${trayBreakpoint})`);
      setIsMobileScreen(mediaQuery.matches);
      const handleChange = (e3) => setIsMobileScreen(e3.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [tray, trayBreakpoint]);
  const shouldUseTray = tray === true || tray === "auto" && isMobileScreen;
  const activeInputValue = getIsTrayOpen() ? trayActiveInputValue : inputValue;
  const displayLabel = T2(
    () => isoToDisplayLabel(value, { mode, timezone, allowSeconds, allowMilliseconds, labelFormatter }),
    [value, mode, timezone, allowSeconds, allowMilliseconds, labelFormatter]
  );
  const parserOptions = T2(
    () => ({
      mode,
      timeFavor: resolvedTimeFavor,
      dayFavor,
      timezone,
      dateOrder,
      locale,
      allowSeconds,
      allowMilliseconds,
      minValue,
      maxValue,
      bounds,
      maxOptions: maxSuggestions
    }),
    [
      mode,
      resolvedTimeFavor,
      dayFavor,
      timezone,
      dateOrder,
      locale,
      allowSeconds,
      allowMilliseconds,
      minValue,
      maxValue,
      bounds,
      maxSuggestions
    ]
  );
  const suggestions = T2(
    () => buildDateSuggestions(activeInputValue, parserOptions),
    [activeInputValue, parserOptions]
  );
  const filteredOptions = T2(() => suggestionsToOptions(suggestions), [suggestions]);
  const computeEffectiveTrayLabel = q2(() => {
    if (trayLabelProp) return trayLabelProp;
    if (typeof self === "undefined" || !inputRef.current) return "";
    const inputElement = inputRef.current;
    const ariaLabelledBy = inputElement.getAttribute("aria-labelledby");
    if (ariaLabelledBy) {
      const labelElement = document.getElementById(ariaLabelledBy);
      if (labelElement) return labelElement.textContent?.trim() || "";
    }
    const ariaLabel = inputElement.getAttribute("aria-label");
    if (ariaLabel) return ariaLabel.trim();
    if (inputElement.id) {
      const labelElement = document.querySelector(`label[for="${inputElement.id}"]`);
      if (labelElement) return labelElement.textContent?.trim() || "";
    }
    const wrappingLabel = inputElement.closest("label");
    if (wrappingLabel) return wrappingLabel.textContent?.trim() || "";
    const title = inputElement.getAttribute("title");
    if (title) return title.trim();
    return "";
  }, [trayLabelProp]);
  _2(() => {
    setTrayLabel(computeEffectiveTrayLabel());
  }, [setTrayLabel, computeEffectiveTrayLabel]);
  const isListOpen = shouldUseTray ? getIsTrayOpen() : getIsDropdownOpen();
  const handleActiveDescendantChange = q2(
    /** @param {string} val */
    (val) => setActiveDescendantValue(val),
    []
  );
  const closeDropdown = q2(
    (closedExplicitly = false) => {
      setIsDropdownOpen(false);
      if (dropdownPopperRef.current) {
        dropdownPopperRef.current.style.display = "none";
      }
      if (closedExplicitly) {
        dropdownClosedExplicitlyRef.current = true;
      }
      optionsListboxRef.current?.clearActiveDescendant();
    },
    [setIsDropdownOpen]
  );
  y2(() => {
    if (getIsDropdownOpen() && !shouldUseTray && rootElementRef.current && dropdownPopperRef.current) {
      const computedDir = window.getComputedStyle(rootElementRef.current).direction;
      const placement = computedDir === "rtl" ? "bottom-end" : "bottom-start";
      const popperInstance = createPopper(rootElementRef.current, dropdownPopperRef.current, {
        placement,
        // @ts-ignore
        modifiers: dropdownPopperModifiers
      });
      dropdownPopperRef.current.style.display = "block";
      return () => popperInstance.destroy();
    }
    if (shouldUseTray && dropdownPopperRef.current) {
      dropdownPopperRef.current.style.display = "none";
    }
  }, [getIsDropdownOpen, shouldUseTray]);
  const handleOptionSelect = q2(
    /** @param {string} selectedValue */
    (selectedValue) => {
      onChange(selectedValue);
      const match = suggestions.find((s3) => s3.value === selectedValue);
      if (match) {
        const label = labelFormatter ? labelFormatter(match) : match.label;
        setInputValue(label);
        setAnnouncement(`Selected ${label}`);
      }
      closeDropdown();
    },
    [onChange, suggestions, labelFormatter, closeDropdown]
  );
  const virtualKeyboardExplicitlyClosedRef = A2(null);
  const virtualKeyboardDismissSubscription = A2(
    /** @type {function | null} */
    null
  );
  const focusInputWithVirtualKeyboardGuard = q2(
    /**
     * @param {Object} params
     * @param {HTMLInputElement | null} params.input
     * @param {boolean} [params.shouldPreventKeyboardReopen]
     * @param {boolean} [params.forceOpenKeyboard]
     */
    (params) => {
      const { input, shouldPreventKeyboardReopen = false, forceOpenKeyboard = false } = params;
      if (!input) return;
      const shouldTemporarilyDisableInput = shouldPreventKeyboardReopen && !forceOpenKeyboard;
      if (shouldTemporarilyDisableInput) {
        input.setAttribute("readonly", "readonly");
      }
      input.focus();
      if (shouldTemporarilyDisableInput) {
        setTimeout(() => input.removeAttribute("readonly"), 10);
      }
    },
    []
  );
  const focusInput = q2(
    (forceOpenKeyboard = false) => {
      focusInputWithVirtualKeyboardGuard({
        input: inputRef.current,
        shouldPreventKeyboardReopen: getIsFocused() && virtualKeyboardExplicitlyClosedRef.current === true,
        forceOpenKeyboard
      });
    },
    [getIsFocused, focusInputWithVirtualKeyboardGuard]
  );
  const openTray = q2(() => {
    if (!shouldUseTray) return;
    setIsTrayOpen(true);
    setIsDropdownOpen(false);
    trayClosedExplicitlyRef.current = false;
  }, [shouldUseTray, setIsDropdownOpen, setIsTrayOpen]);
  const closeTray = q2(() => {
    setIsTrayOpen(false);
    setTrayActiveInputValue("");
    trayClosedExplicitlyRef.current = true;
    focusInput(true);
  }, [setIsTrayOpen, focusInput]);
  const handleInputChange = q2(
    /** @param {import('preact/compat').ChangeEvent<HTMLInputElement>} e */
    (e3) => {
      if (shouldUseTray) {
        e3.preventDefault();
        openTray();
        return;
      }
      setInputValue(e3.currentTarget.value);
      if (!dropdownClosedExplicitlyRef.current) {
        setIsDropdownOpen(true);
      }
    },
    [setIsDropdownOpen, shouldUseTray, openTray]
  );
  const handleTrayInputChange = q2(
    /** @param {string} val */
    (val) => setTrayActiveInputValue(val),
    []
  );
  const handleInputFocus = q2(() => {
    setIsFocused(true);
    clearTimeout(blurTimeoutRef.current);
    blurTimeoutRef.current = void 0;
    if (shouldUseTray) {
      if (!trayClosedExplicitlyRef.current) openTray();
      trayClosedExplicitlyRef.current = false;
    } else {
      if (value && inputRef.current) {
        inputRef.current.select();
      }
      if (inputValue) {
        setIsDropdownOpen(true);
      }
      dropdownClosedExplicitlyRef.current = false;
      if (!virtualKeyboardDismissSubscription.current) {
        virtualKeyboardDismissSubscription.current = subscribeToVirtualKeyboard({
          visibleCallback(isVisible) {
            virtualKeyboardExplicitlyClosedRef.current = !isVisible;
          }
        });
      }
    }
  }, [setIsFocused, setIsDropdownOpen, openTray, shouldUseTray, value, inputValue]);
  const handleInputBlur = q2(() => {
    setIsFocused(false);
    clearTimeout(blurTimeoutRef.current);
    blurTimeoutRef.current = void 0;
    closeDropdown();
    dropdownClosedExplicitlyRef.current = false;
    const text = inputRef.current?.value?.trim() || "";
    const input = inputRef.current;
    if (!text) {
      if (value !== "") onChange("");
      if (input) {
        input.setCustomValidity(required ? "Please select a date" : "");
      }
      setInputValue("");
    } else if (text === displayLabel) {
      if (input) input.setCustomValidity("");
    } else {
      const results = buildDateSuggestions(text, parserOptions);
      const best = results[0];
      if (best) {
        onChange(best.value);
        const bestLabel = labelFormatter ? labelFormatter(best) : best.label;
        setInputValue(bestLabel);
        if (input) input.setCustomValidity("");
        setAnnouncement(`Selected ${bestLabel}`);
      } else {
        if (previousValidValueRef.current) {
          const prevLabel = isoToDisplayLabel(previousValidValueRef.current, {
            mode,
            timezone,
            allowSeconds,
            allowMilliseconds,
            labelFormatter
          });
          setInputValue(prevLabel);
          if (input) input.setCustomValidity("");
        } else {
          setInputValue("");
          onChange("");
          if (input) {
            input.setCustomValidity(required ? "Please enter a valid date" : "");
          }
        }
      }
    }
    setAnnouncement("");
    if (!shouldUseTray) {
      virtualKeyboardDismissSubscription.current?.();
      virtualKeyboardDismissSubscription.current = null;
      virtualKeyboardExplicitlyClosedRef.current = null;
    }
    if (onBlurProp && inputRef.current) {
      onBlurProp(new FocusEvent("blur"));
    }
  }, [
    setIsFocused,
    closeDropdown,
    shouldUseTray,
    value,
    onChange,
    required,
    displayLabel,
    parserOptions,
    labelFormatter,
    mode,
    timezone,
    allowSeconds,
    allowMilliseconds,
    onBlurProp
  ]);
  const handleKeyDown = q2(
    /** @param {import('preact/compat').KeyboardEvent<HTMLInputElement>} e */
    (e3) => {
      if (e3.key === "Enter") {
        e3.preventDefault();
        optionsListboxRef.current?.selectActive();
      } else if (e3.key === "ArrowDown") {
        e3.preventDefault();
        setIsDropdownOpen(true);
        dropdownClosedExplicitlyRef.current = false;
        optionsListboxRef.current?.navigateDown();
      } else if (e3.key === "ArrowUp") {
        e3.preventDefault();
        setIsDropdownOpen(true);
        dropdownClosedExplicitlyRef.current = false;
        optionsListboxRef.current?.navigateUp();
      } else if (e3.key === "Escape") {
        setInputValue(displayLabel);
        closeDropdown(true);
      } else if (e3.key === "Home" && (e3.ctrlKey || !inputValue) && getIsDropdownOpen()) {
        e3.preventDefault();
        optionsListboxRef.current?.navigateToFirst();
      } else if (e3.key === "End" && (e3.ctrlKey || !inputValue) && getIsDropdownOpen()) {
        e3.preventDefault();
        optionsListboxRef.current?.navigateToLast();
      } else if (e3.key === "PageDown") {
        e3.preventDefault();
        setIsDropdownOpen(true);
        dropdownClosedExplicitlyRef.current = false;
        optionsListboxRef.current?.navigatePageDown();
      } else if (e3.key === "PageUp") {
        e3.preventDefault();
        setIsDropdownOpen(true);
        dropdownClosedExplicitlyRef.current = false;
        optionsListboxRef.current?.navigatePageUp();
      }
    },
    [inputValue, displayLabel, getIsDropdownOpen, setIsDropdownOpen, closeDropdown]
  );
  const handleClearValue = q2(
    /** @param {import('preact/compat').MouseEvent<HTMLButtonElement>} e */
    (e3) => {
      e3.stopPropagation();
      setInputValue("");
      onChange("");
      setAnnouncement("Date cleared");
      if (inputRef.current) {
        inputRef.current.setCustomValidity(required ? "Please select a date" : "");
      }
    },
    [onChange, required]
  );
  const handleClearMouseDown = q2(
    /** @param {import('preact/compat').MouseEvent<HTMLButtonElement>} e */
    (e3) => {
      e3.preventDefault();
    },
    []
  );
  const handleRootElementClick = q2(() => {
    if (disabled) return;
    if (shouldUseTray) {
      openTray();
    } else {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        focusInput(true);
      }
      setIsDropdownOpen(true);
      dropdownClosedExplicitlyRef.current = false;
    }
  }, [disabled, shouldUseTray, openTray, focusInput, setIsDropdownOpen]);
  y2(() => {
    if (!getIsFocused()) {
      setInputValue(displayLabel);
    }
  }, [displayLabel, getIsFocused]);
  const setDropdownRef = q2(
    /** @param {HTMLUListElement | null} el */
    (el) => {
      dropdownPopperRef.current = el;
    },
    []
  );
  const optionsListbox = /* @__PURE__ */ u3(
    OptionsListbox_default,
    {
      ref: optionsListboxRef,
      id,
      searchText: activeInputValue,
      filteredOptions,
      isLoading: false,
      arrayValues: value ? [value] : [],
      invalidValues: [],
      multiple: false,
      allowFreeText: false,
      onOptionSelect: handleOptionSelect,
      onActiveDescendantChange: handleActiveDescendantChange,
      onClose: shouldUseTray ? closeTray : closeDropdown,
      showValue: false,
      language: "en",
      translations: defaultTranslations,
      theme,
      maxPresentedOptions: maxSuggestions,
      isOpen: isListOpen,
      shouldUseTray,
      setDropdownRef
    }
  );
  return /* @__PURE__ */ u3(
    "div",
    {
      className: [
        className,
        "PreactDatefield",
        disabled ? "PreactDatefield--disabled" : "",
        `PreactDatefield--${theme}`,
        tray === "auto" ? "PreactDatefield--trayAuto" : ""
      ].filter(Boolean).join(" "),
      "aria-disabled": disabled,
      onClick: handleRootElementClick,
      id: `${id}-root`,
      ref: rootElementRef,
      ...rootElementProps,
      children: [
        /* @__PURE__ */ u3("div", { className: "PreactDatefield-srOnly", "aria-live": "polite", "aria-atomic": "true", children: getIsFocused() ? announcement : "" }),
        /* @__PURE__ */ u3("div", { className: `PreactDatefield-field ${disabled ? "PreactDatefield-field--disabled" : ""}`, children: [
          /* @__PURE__ */ u3(
            "input",
            {
              id,
              ref: inputRef,
              type: "text",
              value: inputValue,
              placeholder: !shouldUseTray && getIsDropdownOpen() ? defaultTranslations.searchPlaceholder : displayLabel || placeholder,
              onChange: handleInputChange,
              onKeyDown: handleKeyDown,
              onFocus: handleInputFocus,
              onBlur: () => {
                blurTimeoutRef.current = setTimeout(handleInputBlur, 200);
              },
              className: `PreactDatefield-input ${disabled ? "PreactDatefield-input--disabled" : ""}`,
              role: "combobox",
              "aria-expanded": getIsDropdownOpen(),
              "aria-haspopup": "listbox",
              "aria-controls": `${id}-options-listbox`,
              "aria-activedescendant": activeDescendantValue ? `${id}-option-${toHTMLId(activeDescendantValue)}` : void 0,
              autocomplete: "off",
              disabled,
              required: required && !value,
              ...inputProps
            }
          ),
          !disabled && showClearButton && value ? /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              className: "PreactDatefield-clearButton",
              "aria-label": defaultTranslations.clearValue,
              onMouseDown: handleClearMouseDown,
              onClick: handleClearValue,
              children: /* @__PURE__ */ u3("span", { "aria-hidden": "true", children: "\u2715" })
            }
          ) : null,
          defaultChevronIcon,
          formSubmitCompatible ? /* @__PURE__ */ u3("input", { type: "hidden", name, value: value || "" }) : null
        ] }),
        /* @__PURE__ */ u3(Portal, { parent: portal, rootElementRef, children: shouldUseTray ? /* @__PURE__ */ u3(
          TraySearchList_default,
          {
            id,
            isOpen: getIsTrayOpen(),
            onClose: closeTray,
            trayLabel: getTrayLabel() || "",
            theme,
            translations: defaultTranslations,
            onInputChange: handleTrayInputChange,
            children: optionsListbox
          }
        ) : optionsListbox })
      ]
    }
  );
};
var PreactDatefield_default = PreactDatefield;
//# sourceMappingURL=PreactDatefield.js.map
