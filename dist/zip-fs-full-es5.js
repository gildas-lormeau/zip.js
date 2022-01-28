(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.zip = {}));
})(this, (function (exports) { 'use strict';

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
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
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
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
    Object.defineProperty(subClass, "prototype", {
      writable: false
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

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
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
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get() {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(arguments.length < 3 ? target : receiver);
        }

        return desc.value;
      };
    }

    return _get.apply(this, arguments);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
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

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var check = function (it) {
    return it && it.Math == Math && it;
  };

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global$19 =
    // eslint-disable-next-line es/no-global-this -- safe
    check(typeof globalThis == 'object' && globalThis) ||
    check(typeof window == 'object' && window) ||
    // eslint-disable-next-line no-restricted-globals -- safe
    check(typeof self == 'object' && self) ||
    check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
    // eslint-disable-next-line no-new-func -- fallback
    (function () { return this; })() || Function('return this')();

  var objectGetOwnPropertyDescriptor = {};

  var fails$D = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  var fails$C = fails$D;

  // Detect IE8's incomplete defineProperty implementation
  var descriptors = !fails$C(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
  });

  var fails$B = fails$D;

  var functionBindNative = !fails$B(function () {
    var test = (function () { /* empty */ }).bind();
    // eslint-disable-next-line no-prototype-builtins -- safe
    return typeof test != 'function' || test.hasOwnProperty('prototype');
  });

  var NATIVE_BIND$3 = functionBindNative;

  var call$m = Function.prototype.call;

  var functionCall = NATIVE_BIND$3 ? call$m.bind(call$m) : function () {
    return call$m.apply(call$m, arguments);
  };

  var objectPropertyIsEnumerable = {};

  var $propertyIsEnumerable$2 = {}.propertyIsEnumerable;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var getOwnPropertyDescriptor$5 = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG = getOwnPropertyDescriptor$5 && !$propertyIsEnumerable$2.call({ 1: 2 }, 1);

  // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
  objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor$5(this, V);
    return !!descriptor && descriptor.enumerable;
  } : $propertyIsEnumerable$2;

  var createPropertyDescriptor$7 = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var NATIVE_BIND$2 = functionBindNative;

  var FunctionPrototype$3 = Function.prototype;
  var bind$b = FunctionPrototype$3.bind;
  var call$l = FunctionPrototype$3.call;
  var uncurryThis$G = NATIVE_BIND$2 && bind$b.bind(call$l, call$l);

  var functionUncurryThis = NATIVE_BIND$2 ? function (fn) {
    return fn && uncurryThis$G(fn);
  } : function (fn) {
    return fn && function () {
      return call$l.apply(fn, arguments);
    };
  };

  var uncurryThis$F = functionUncurryThis;

  var toString$c = uncurryThis$F({}.toString);
  var stringSlice$9 = uncurryThis$F(''.slice);

  var classofRaw$1 = function (it) {
    return stringSlice$9(toString$c(it), 8, -1);
  };

  var global$18 = global$19;
  var uncurryThis$E = functionUncurryThis;
  var fails$A = fails$D;
  var classof$e = classofRaw$1;

  var Object$5 = global$18.Object;
  var split$3 = uncurryThis$E(''.split);

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var indexedObject = fails$A(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins -- safe
    return !Object$5('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classof$e(it) == 'String' ? split$3(it, '') : Object$5(it);
  } : Object$5;

  var global$17 = global$19;

  var TypeError$o = global$17.TypeError;

  // `RequireObjectCoercible` abstract operation
  // https://tc39.es/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible$8 = function (it) {
    if (it == undefined) throw TypeError$o("Can't call method on " + it);
    return it;
  };

  // toObject with fallback for non-array-like ES3 strings
  var IndexedObject$3 = indexedObject;
  var requireObjectCoercible$7 = requireObjectCoercible$8;

  var toIndexedObject$b = function (it) {
    return IndexedObject$3(requireObjectCoercible$7(it));
  };

  // `IsCallable` abstract operation
  // https://tc39.es/ecma262/#sec-iscallable
  var isCallable$p = function (argument) {
    return typeof argument == 'function';
  };

  var isCallable$o = isCallable$p;

  var isObject$k = function (it) {
    return typeof it == 'object' ? it !== null : isCallable$o(it);
  };

  var global$16 = global$19;
  var isCallable$n = isCallable$p;

  var aFunction = function (argument) {
    return isCallable$n(argument) ? argument : undefined;
  };

  var getBuiltIn$9 = function (namespace, method) {
    return arguments.length < 2 ? aFunction(global$16[namespace]) : global$16[namespace] && global$16[namespace][method];
  };

  var uncurryThis$D = functionUncurryThis;

  var objectIsPrototypeOf = uncurryThis$D({}.isPrototypeOf);

  var getBuiltIn$8 = getBuiltIn$9;

  var engineUserAgent = getBuiltIn$8('navigator', 'userAgent') || '';

  var global$15 = global$19;
  var userAgent$5 = engineUserAgent;

  var process$3 = global$15.process;
  var Deno = global$15.Deno;
  var versions = process$3 && process$3.versions || Deno && Deno.version;
  var v8 = versions && versions.v8;
  var match, version;

  if (v8) {
    match = v8.split('.');
    // in old Chrome, versions of V8 isn't V8 = Chrome / 10
    // but their correct versions are not interesting for us
    version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
  }

  // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
  // so check `userAgent` even if `.v8` exists, but 0
  if (!version && userAgent$5) {
    match = userAgent$5.match(/Edge\/(\d+)/);
    if (!match || match[1] >= 74) {
      match = userAgent$5.match(/Chrome\/(\d+)/);
      if (match) version = +match[1];
    }
  }

  var engineV8Version = version;

  /* eslint-disable es/no-symbol -- required for testing */

  var V8_VERSION$3 = engineV8Version;
  var fails$z = fails$D;

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
  var nativeSymbol = !!Object.getOwnPropertySymbols && !fails$z(function () {
    var symbol = Symbol();
    // Chrome 38 Symbol has incorrect toString conversion
    // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
    return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
      // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
      !Symbol.sham && V8_VERSION$3 && V8_VERSION$3 < 41;
  });

  /* eslint-disable es/no-symbol -- required for testing */

  var NATIVE_SYMBOL$3 = nativeSymbol;

  var useSymbolAsUid = NATIVE_SYMBOL$3
    && !Symbol.sham
    && typeof Symbol.iterator == 'symbol';

  var global$14 = global$19;
  var getBuiltIn$7 = getBuiltIn$9;
  var isCallable$m = isCallable$p;
  var isPrototypeOf$7 = objectIsPrototypeOf;
  var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

  var Object$4 = global$14.Object;

  var isSymbol$5 = USE_SYMBOL_AS_UID$1 ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    var $Symbol = getBuiltIn$7('Symbol');
    return isCallable$m($Symbol) && isPrototypeOf$7($Symbol.prototype, Object$4(it));
  };

  var global$13 = global$19;

  var String$5 = global$13.String;

  var tryToString$5 = function (argument) {
    try {
      return String$5(argument);
    } catch (error) {
      return 'Object';
    }
  };

  var global$12 = global$19;
  var isCallable$l = isCallable$p;
  var tryToString$4 = tryToString$5;

  var TypeError$n = global$12.TypeError;

  // `Assert: IsCallable(argument) is true`
  var aCallable$7 = function (argument) {
    if (isCallable$l(argument)) return argument;
    throw TypeError$n(tryToString$4(argument) + ' is not a function');
  };

  var aCallable$6 = aCallable$7;

  // `GetMethod` abstract operation
  // https://tc39.es/ecma262/#sec-getmethod
  var getMethod$5 = function (V, P) {
    var func = V[P];
    return func == null ? undefined : aCallable$6(func);
  };

  var global$11 = global$19;
  var call$k = functionCall;
  var isCallable$k = isCallable$p;
  var isObject$j = isObject$k;

  var TypeError$m = global$11.TypeError;

  // `OrdinaryToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-ordinarytoprimitive
  var ordinaryToPrimitive$1 = function (input, pref) {
    var fn, val;
    if (pref === 'string' && isCallable$k(fn = input.toString) && !isObject$j(val = call$k(fn, input))) return val;
    if (isCallable$k(fn = input.valueOf) && !isObject$j(val = call$k(fn, input))) return val;
    if (pref !== 'string' && isCallable$k(fn = input.toString) && !isObject$j(val = call$k(fn, input))) return val;
    throw TypeError$m("Can't convert object to primitive value");
  };

  var shared$5 = {exports: {}};

  var isPure = false;

  var global$10 = global$19;

  // eslint-disable-next-line es/no-object-defineproperty -- safe
  var defineProperty$b = Object.defineProperty;

  var setGlobal$3 = function (key, value) {
    try {
      defineProperty$b(global$10, key, { value: value, configurable: true, writable: true });
    } catch (error) {
      global$10[key] = value;
    } return value;
  };

  var global$$ = global$19;
  var setGlobal$2 = setGlobal$3;

  var SHARED = '__core-js_shared__';
  var store$3 = global$$[SHARED] || setGlobal$2(SHARED, {});

  var sharedStore = store$3;

  var store$2 = sharedStore;

  (shared$5.exports = function (key, value) {
    return store$2[key] || (store$2[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.20.3',
    mode: 'global',
    copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
    license: 'https://github.com/zloirock/core-js/blob/v3.20.3/LICENSE',
    source: 'https://github.com/zloirock/core-js'
  });

  var global$_ = global$19;
  var requireObjectCoercible$6 = requireObjectCoercible$8;

  var Object$3 = global$_.Object;

  // `ToObject` abstract operation
  // https://tc39.es/ecma262/#sec-toobject
  var toObject$d = function (argument) {
    return Object$3(requireObjectCoercible$6(argument));
  };

  var uncurryThis$C = functionUncurryThis;
  var toObject$c = toObject$d;

  var hasOwnProperty = uncurryThis$C({}.hasOwnProperty);

  // `HasOwnProperty` abstract operation
  // https://tc39.es/ecma262/#sec-hasownproperty
  var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
    return hasOwnProperty(toObject$c(it), key);
  };

  var uncurryThis$B = functionUncurryThis;

  var id$1 = 0;
  var postfix = Math.random();
  var toString$b = uncurryThis$B(1.0.toString);

  var uid$5 = function (key) {
    return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$b(++id$1 + postfix, 36);
  };

  var global$Z = global$19;
  var shared$4 = shared$5.exports;
  var hasOwn$i = hasOwnProperty_1;
  var uid$4 = uid$5;
  var NATIVE_SYMBOL$2 = nativeSymbol;
  var USE_SYMBOL_AS_UID = useSymbolAsUid;

  var WellKnownSymbolsStore$1 = shared$4('wks');
  var Symbol$1 = global$Z.Symbol;
  var symbolFor = Symbol$1 && Symbol$1['for'];
  var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$4;

  var wellKnownSymbol$s = function (name) {
    if (!hasOwn$i(WellKnownSymbolsStore$1, name) || !(NATIVE_SYMBOL$2 || typeof WellKnownSymbolsStore$1[name] == 'string')) {
      var description = 'Symbol.' + name;
      if (NATIVE_SYMBOL$2 && hasOwn$i(Symbol$1, name)) {
        WellKnownSymbolsStore$1[name] = Symbol$1[name];
      } else if (USE_SYMBOL_AS_UID && symbolFor) {
        WellKnownSymbolsStore$1[name] = symbolFor(description);
      } else {
        WellKnownSymbolsStore$1[name] = createWellKnownSymbol(description);
      }
    } return WellKnownSymbolsStore$1[name];
  };

  var global$Y = global$19;
  var call$j = functionCall;
  var isObject$i = isObject$k;
  var isSymbol$4 = isSymbol$5;
  var getMethod$4 = getMethod$5;
  var ordinaryToPrimitive = ordinaryToPrimitive$1;
  var wellKnownSymbol$r = wellKnownSymbol$s;

  var TypeError$l = global$Y.TypeError;
  var TO_PRIMITIVE$1 = wellKnownSymbol$r('toPrimitive');

  // `ToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-toprimitive
  var toPrimitive$2 = function (input, pref) {
    if (!isObject$i(input) || isSymbol$4(input)) return input;
    var exoticToPrim = getMethod$4(input, TO_PRIMITIVE$1);
    var result;
    if (exoticToPrim) {
      if (pref === undefined) pref = 'default';
      result = call$j(exoticToPrim, input, pref);
      if (!isObject$i(result) || isSymbol$4(result)) return result;
      throw TypeError$l("Can't convert object to primitive value");
    }
    if (pref === undefined) pref = 'number';
    return ordinaryToPrimitive(input, pref);
  };

  var toPrimitive$1 = toPrimitive$2;
  var isSymbol$3 = isSymbol$5;

  // `ToPropertyKey` abstract operation
  // https://tc39.es/ecma262/#sec-topropertykey
  var toPropertyKey$5 = function (argument) {
    var key = toPrimitive$1(argument, 'string');
    return isSymbol$3(key) ? key : key + '';
  };

  var global$X = global$19;
  var isObject$h = isObject$k;

  var document$3 = global$X.document;
  // typeof document.createElement is 'object' in old IE
  var EXISTS$1 = isObject$h(document$3) && isObject$h(document$3.createElement);

  var documentCreateElement$2 = function (it) {
    return EXISTS$1 ? document$3.createElement(it) : {};
  };

  var DESCRIPTORS$j = descriptors;
  var fails$y = fails$D;
  var createElement$1 = documentCreateElement$2;

  // Thanks to IE8 for its funny defineProperty
  var ie8DomDefine = !DESCRIPTORS$j && !fails$y(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty(createElement$1('div'), 'a', {
      get: function () { return 7; }
    }).a != 7;
  });

  var DESCRIPTORS$i = descriptors;
  var call$i = functionCall;
  var propertyIsEnumerableModule$2 = objectPropertyIsEnumerable;
  var createPropertyDescriptor$6 = createPropertyDescriptor$7;
  var toIndexedObject$a = toIndexedObject$b;
  var toPropertyKey$4 = toPropertyKey$5;
  var hasOwn$h = hasOwnProperty_1;
  var IE8_DOM_DEFINE$1 = ie8DomDefine;

  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var $getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
  objectGetOwnPropertyDescriptor.f = DESCRIPTORS$i ? $getOwnPropertyDescriptor$2 : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject$a(O);
    P = toPropertyKey$4(P);
    if (IE8_DOM_DEFINE$1) try {
      return $getOwnPropertyDescriptor$2(O, P);
    } catch (error) { /* empty */ }
    if (hasOwn$h(O, P)) return createPropertyDescriptor$6(!call$i(propertyIsEnumerableModule$2.f, O, P), O[P]);
  };

  var objectDefineProperty = {};

  var DESCRIPTORS$h = descriptors;
  var fails$x = fails$D;

  // V8 ~ Chrome 36-
  // https://bugs.chromium.org/p/v8/issues/detail?id=3334
  var v8PrototypeDefineBug = DESCRIPTORS$h && fails$x(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty(function () { /* empty */ }, 'prototype', {
      value: 42,
      writable: false
    }).prototype != 42;
  });

  var global$W = global$19;
  var isObject$g = isObject$k;

  var String$4 = global$W.String;
  var TypeError$k = global$W.TypeError;

  // `Assert: Type(argument) is Object`
  var anObject$i = function (argument) {
    if (isObject$g(argument)) return argument;
    throw TypeError$k(String$4(argument) + ' is not an object');
  };

  var global$V = global$19;
  var DESCRIPTORS$g = descriptors;
  var IE8_DOM_DEFINE = ie8DomDefine;
  var V8_PROTOTYPE_DEFINE_BUG$1 = v8PrototypeDefineBug;
  var anObject$h = anObject$i;
  var toPropertyKey$3 = toPropertyKey$5;

  var TypeError$j = global$V.TypeError;
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  var $defineProperty$1 = Object.defineProperty;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
  var ENUMERABLE = 'enumerable';
  var CONFIGURABLE$1 = 'configurable';
  var WRITABLE = 'writable';

  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  objectDefineProperty.f = DESCRIPTORS$g ? V8_PROTOTYPE_DEFINE_BUG$1 ? function defineProperty(O, P, Attributes) {
    anObject$h(O);
    P = toPropertyKey$3(P);
    anObject$h(Attributes);
    if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
      var current = $getOwnPropertyDescriptor$1(O, P);
      if (current && current[WRITABLE]) {
        O[P] = Attributes.value;
        Attributes = {
          configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
          enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
          writable: false
        };
      }
    } return $defineProperty$1(O, P, Attributes);
  } : $defineProperty$1 : function defineProperty(O, P, Attributes) {
    anObject$h(O);
    P = toPropertyKey$3(P);
    anObject$h(Attributes);
    if (IE8_DOM_DEFINE) try {
      return $defineProperty$1(O, P, Attributes);
    } catch (error) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError$j('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var DESCRIPTORS$f = descriptors;
  var definePropertyModule$7 = objectDefineProperty;
  var createPropertyDescriptor$5 = createPropertyDescriptor$7;

  var createNonEnumerableProperty$a = DESCRIPTORS$f ? function (object, key, value) {
    return definePropertyModule$7.f(object, key, createPropertyDescriptor$5(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var redefine$d = {exports: {}};

  var uncurryThis$A = functionUncurryThis;
  var isCallable$j = isCallable$p;
  var store$1 = sharedStore;

  var functionToString$1 = uncurryThis$A(Function.toString);

  // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
  if (!isCallable$j(store$1.inspectSource)) {
    store$1.inspectSource = function (it) {
      return functionToString$1(it);
    };
  }

  var inspectSource$4 = store$1.inspectSource;

  var global$U = global$19;
  var isCallable$i = isCallable$p;
  var inspectSource$3 = inspectSource$4;

  var WeakMap$1 = global$U.WeakMap;

  var nativeWeakMap = isCallable$i(WeakMap$1) && /native code/.test(inspectSource$3(WeakMap$1));

  var shared$3 = shared$5.exports;
  var uid$3 = uid$5;

  var keys$2 = shared$3('keys');

  var sharedKey$4 = function (key) {
    return keys$2[key] || (keys$2[key] = uid$3(key));
  };

  var hiddenKeys$6 = {};

  var NATIVE_WEAK_MAP = nativeWeakMap;
  var global$T = global$19;
  var uncurryThis$z = functionUncurryThis;
  var isObject$f = isObject$k;
  var createNonEnumerableProperty$9 = createNonEnumerableProperty$a;
  var hasOwn$g = hasOwnProperty_1;
  var shared$2 = sharedStore;
  var sharedKey$3 = sharedKey$4;
  var hiddenKeys$5 = hiddenKeys$6;

  var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
  var TypeError$i = global$T.TypeError;
  var WeakMap = global$T.WeakMap;
  var set$2, get$1, has;

  var enforce = function (it) {
    return has(it) ? get$1(it) : set$2(it, {});
  };

  var getterFor = function (TYPE) {
    return function (it) {
      var state;
      if (!isObject$f(it) || (state = get$1(it)).type !== TYPE) {
        throw TypeError$i('Incompatible receiver, ' + TYPE + ' required');
      } return state;
    };
  };

  if (NATIVE_WEAK_MAP || shared$2.state) {
    var store = shared$2.state || (shared$2.state = new WeakMap());
    var wmget = uncurryThis$z(store.get);
    var wmhas = uncurryThis$z(store.has);
    var wmset = uncurryThis$z(store.set);
    set$2 = function (it, metadata) {
      if (wmhas(store, it)) throw new TypeError$i(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      wmset(store, it, metadata);
      return metadata;
    };
    get$1 = function (it) {
      return wmget(store, it) || {};
    };
    has = function (it) {
      return wmhas(store, it);
    };
  } else {
    var STATE = sharedKey$3('state');
    hiddenKeys$5[STATE] = true;
    set$2 = function (it, metadata) {
      if (hasOwn$g(it, STATE)) throw new TypeError$i(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      createNonEnumerableProperty$9(it, STATE, metadata);
      return metadata;
    };
    get$1 = function (it) {
      return hasOwn$g(it, STATE) ? it[STATE] : {};
    };
    has = function (it) {
      return hasOwn$g(it, STATE);
    };
  }

  var internalState = {
    set: set$2,
    get: get$1,
    has: has,
    enforce: enforce,
    getterFor: getterFor
  };

  var DESCRIPTORS$e = descriptors;
  var hasOwn$f = hasOwnProperty_1;

  var FunctionPrototype$2 = Function.prototype;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var getDescriptor = DESCRIPTORS$e && Object.getOwnPropertyDescriptor;

  var EXISTS = hasOwn$f(FunctionPrototype$2, 'name');
  // additional protection from minified / mangled / dropped function names
  var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
  var CONFIGURABLE = EXISTS && (!DESCRIPTORS$e || (DESCRIPTORS$e && getDescriptor(FunctionPrototype$2, 'name').configurable));

  var functionName = {
    EXISTS: EXISTS,
    PROPER: PROPER,
    CONFIGURABLE: CONFIGURABLE
  };

  var global$S = global$19;
  var isCallable$h = isCallable$p;
  var hasOwn$e = hasOwnProperty_1;
  var createNonEnumerableProperty$8 = createNonEnumerableProperty$a;
  var setGlobal$1 = setGlobal$3;
  var inspectSource$2 = inspectSource$4;
  var InternalStateModule$9 = internalState;
  var CONFIGURABLE_FUNCTION_NAME$2 = functionName.CONFIGURABLE;

  var getInternalState$7 = InternalStateModule$9.get;
  var enforceInternalState = InternalStateModule$9.enforce;
  var TEMPLATE = String(String).split('String');

  (redefine$d.exports = function (O, key, value, options) {
    var unsafe = options ? !!options.unsafe : false;
    var simple = options ? !!options.enumerable : false;
    var noTargetGet = options ? !!options.noTargetGet : false;
    var name = options && options.name !== undefined ? options.name : key;
    var state;
    if (isCallable$h(value)) {
      if (String(name).slice(0, 7) === 'Symbol(') {
        name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
      }
      if (!hasOwn$e(value, 'name') || (CONFIGURABLE_FUNCTION_NAME$2 && value.name !== name)) {
        createNonEnumerableProperty$8(value, 'name', name);
      }
      state = enforceInternalState(value);
      if (!state.source) {
        state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
      }
    }
    if (O === global$S) {
      if (simple) O[key] = value;
      else setGlobal$1(key, value);
      return;
    } else if (!unsafe) {
      delete O[key];
    } else if (!noTargetGet && O[key]) {
      simple = true;
    }
    if (simple) O[key] = value;
    else createNonEnumerableProperty$8(O, key, value);
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, 'toString', function toString() {
    return isCallable$h(this) && getInternalState$7(this).source || inspectSource$2(this);
  });

  var objectGetOwnPropertyNames = {};

  var ceil = Math.ceil;
  var floor$7 = Math.floor;

  // `ToIntegerOrInfinity` abstract operation
  // https://tc39.es/ecma262/#sec-tointegerorinfinity
  var toIntegerOrInfinity$9 = function (argument) {
    var number = +argument;
    // eslint-disable-next-line no-self-compare -- safe
    return number !== number || number === 0 ? 0 : (number > 0 ? floor$7 : ceil)(number);
  };

  var toIntegerOrInfinity$8 = toIntegerOrInfinity$9;

  var max$4 = Math.max;
  var min$8 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
  var toAbsoluteIndex$8 = function (index, length) {
    var integer = toIntegerOrInfinity$8(index);
    return integer < 0 ? max$4(integer + length, 0) : min$8(integer, length);
  };

  var toIntegerOrInfinity$7 = toIntegerOrInfinity$9;

  var min$7 = Math.min;

  // `ToLength` abstract operation
  // https://tc39.es/ecma262/#sec-tolength
  var toLength$a = function (argument) {
    return argument > 0 ? min$7(toIntegerOrInfinity$7(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var toLength$9 = toLength$a;

  // `LengthOfArrayLike` abstract operation
  // https://tc39.es/ecma262/#sec-lengthofarraylike
  var lengthOfArrayLike$f = function (obj) {
    return toLength$9(obj.length);
  };

  var toIndexedObject$9 = toIndexedObject$b;
  var toAbsoluteIndex$7 = toAbsoluteIndex$8;
  var lengthOfArrayLike$e = lengthOfArrayLike$f;

  // `Array.prototype.{ indexOf, includes }` methods implementation
  var createMethod$5 = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject$9($this);
      var length = lengthOfArrayLike$e(O);
      var index = toAbsoluteIndex$7(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare -- NaN check
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare -- NaN check
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) {
        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.es/ecma262/#sec-array.prototype.includes
    includes: createMethod$5(true),
    // `Array.prototype.indexOf` method
    // https://tc39.es/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod$5(false)
  };

  var uncurryThis$y = functionUncurryThis;
  var hasOwn$d = hasOwnProperty_1;
  var toIndexedObject$8 = toIndexedObject$b;
  var indexOf$1 = arrayIncludes.indexOf;
  var hiddenKeys$4 = hiddenKeys$6;

  var push$8 = uncurryThis$y([].push);

  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject$8(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !hasOwn$d(hiddenKeys$4, key) && hasOwn$d(O, key) && push$8(result, key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (hasOwn$d(O, key = names[i++])) {
      ~indexOf$1(result, key) || push$8(result, key);
    }
    return result;
  };

  // IE8- don't enum bug keys
  var enumBugKeys$3 = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf'
  ];

  var internalObjectKeys$1 = objectKeysInternal;
  var enumBugKeys$2 = enumBugKeys$3;

  var hiddenKeys$3 = enumBugKeys$2.concat('length', 'prototype');

  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  // eslint-disable-next-line es/no-object-getownpropertynames -- safe
  objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return internalObjectKeys$1(O, hiddenKeys$3);
  };

  var objectGetOwnPropertySymbols = {};

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
  objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

  var getBuiltIn$6 = getBuiltIn$9;
  var uncurryThis$x = functionUncurryThis;
  var getOwnPropertyNamesModule$2 = objectGetOwnPropertyNames;
  var getOwnPropertySymbolsModule$2 = objectGetOwnPropertySymbols;
  var anObject$g = anObject$i;

  var concat$3 = uncurryThis$x([].concat);

  // all object keys, includes non-enumerable and symbols
  var ownKeys$1 = getBuiltIn$6('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = getOwnPropertyNamesModule$2.f(anObject$g(it));
    var getOwnPropertySymbols = getOwnPropertySymbolsModule$2.f;
    return getOwnPropertySymbols ? concat$3(keys, getOwnPropertySymbols(it)) : keys;
  };

  var hasOwn$c = hasOwnProperty_1;
  var ownKeys = ownKeys$1;
  var getOwnPropertyDescriptorModule$2 = objectGetOwnPropertyDescriptor;
  var definePropertyModule$6 = objectDefineProperty;

  var copyConstructorProperties$2 = function (target, source, exceptions) {
    var keys = ownKeys(source);
    var defineProperty = definePropertyModule$6.f;
    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule$2.f;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!hasOwn$c(target, key) && !(exceptions && hasOwn$c(exceptions, key))) {
        defineProperty(target, key, getOwnPropertyDescriptor(source, key));
      }
    }
  };

  var fails$w = fails$D;
  var isCallable$g = isCallable$p;

  var replacement = /#|\.prototype\./;

  var isForced$4 = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL ? true
      : value == NATIVE ? false
      : isCallable$g(detection) ? fails$w(detection)
      : !!detection;
  };

  var normalize = isForced$4.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  };

  var data = isForced$4.data = {};
  var NATIVE = isForced$4.NATIVE = 'N';
  var POLYFILL = isForced$4.POLYFILL = 'P';

  var isForced_1 = isForced$4;

  var global$R = global$19;
  var getOwnPropertyDescriptor$4 = objectGetOwnPropertyDescriptor.f;
  var createNonEnumerableProperty$7 = createNonEnumerableProperty$a;
  var redefine$c = redefine$d.exports;
  var setGlobal = setGlobal$3;
  var copyConstructorProperties$1 = copyConstructorProperties$2;
  var isForced$3 = isForced_1;

  /*
    options.target      - name of the target object
    options.global      - target is the global object
    options.stat        - export as static methods of target
    options.proto       - export as prototype methods of target
    options.real        - real prototype method for the `pure` version
    options.forced      - export even if the native feature is available
    options.bind        - bind methods to the target, required for the `pure` version
    options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe      - use the simple assignment of property instead of delete + defineProperty
    options.sham        - add a flag to not completely full polyfills
    options.enumerable  - export as enumerable property
    options.noTargetGet - prevent calling a getter on target
    options.name        - the .name of the function if it does not match the key
  */
  var _export = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
      target = global$R;
    } else if (STATIC) {
      target = global$R[TARGET] || setGlobal(TARGET, {});
    } else {
      target = (global$R[TARGET] || {}).prototype;
    }
    if (target) for (key in source) {
      sourceProperty = source[key];
      if (options.noTargetGet) {
        descriptor = getOwnPropertyDescriptor$4(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];
      FORCED = isForced$3(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
      // contained in target
      if (!FORCED && targetProperty !== undefined) {
        if (typeof sourceProperty == typeof targetProperty) continue;
        copyConstructorProperties$1(sourceProperty, targetProperty);
      }
      // add a flag to not completely full polyfills
      if (options.sham || (targetProperty && targetProperty.sham)) {
        createNonEnumerableProperty$7(sourceProperty, 'sham', true);
      }
      // extend global
      redefine$c(target, key, sourceProperty, options);
    }
  };

  var uncurryThis$w = functionUncurryThis;
  var aCallable$5 = aCallable$7;
  var NATIVE_BIND$1 = functionBindNative;

  var bind$a = uncurryThis$w(uncurryThis$w.bind);

  // optional / simple context binding
  var functionBindContext = function (fn, that) {
    aCallable$5(fn);
    return that === undefined ? fn : NATIVE_BIND$1 ? bind$a(fn, that) : function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  var classof$d = classofRaw$1;

  // `IsArray` abstract operation
  // https://tc39.es/ecma262/#sec-isarray
  // eslint-disable-next-line es/no-array-isarray -- safe
  var isArray$4 = Array.isArray || function isArray(argument) {
    return classof$d(argument) == 'Array';
  };

  var wellKnownSymbol$q = wellKnownSymbol$s;

  var TO_STRING_TAG$4 = wellKnownSymbol$q('toStringTag');
  var test = {};

  test[TO_STRING_TAG$4] = 'z';

  var toStringTagSupport = String(test) === '[object z]';

  var global$Q = global$19;
  var TO_STRING_TAG_SUPPORT$2 = toStringTagSupport;
  var isCallable$f = isCallable$p;
  var classofRaw = classofRaw$1;
  var wellKnownSymbol$p = wellKnownSymbol$s;

  var TO_STRING_TAG$3 = wellKnownSymbol$p('toStringTag');
  var Object$2 = global$Q.Object;

  // ES3 wrong here
  var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (error) { /* empty */ }
  };

  // getting tag from ES6+ `Object.prototype.toString`
  var classof$c = TO_STRING_TAG_SUPPORT$2 ? classofRaw : function (it) {
    var O, tag, result;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (tag = tryGet(O = Object$2(it), TO_STRING_TAG$3)) == 'string' ? tag
      // builtinTag case
      : CORRECT_ARGUMENTS ? classofRaw(O)
      // ES3 arguments fallback
      : (result = classofRaw(O)) == 'Object' && isCallable$f(O.callee) ? 'Arguments' : result;
  };

  var uncurryThis$v = functionUncurryThis;
  var fails$v = fails$D;
  var isCallable$e = isCallable$p;
  var classof$b = classof$c;
  var getBuiltIn$5 = getBuiltIn$9;
  var inspectSource$1 = inspectSource$4;

  var noop = function () { /* empty */ };
  var empty = [];
  var construct = getBuiltIn$5('Reflect', 'construct');
  var constructorRegExp = /^\s*(?:class|function)\b/;
  var exec$4 = uncurryThis$v(constructorRegExp.exec);
  var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

  var isConstructorModern = function isConstructor(argument) {
    if (!isCallable$e(argument)) return false;
    try {
      construct(noop, empty, argument);
      return true;
    } catch (error) {
      return false;
    }
  };

  var isConstructorLegacy = function isConstructor(argument) {
    if (!isCallable$e(argument)) return false;
    switch (classof$b(argument)) {
      case 'AsyncFunction':
      case 'GeneratorFunction':
      case 'AsyncGeneratorFunction': return false;
    }
    try {
      // we can't check .prototype since constructors produced by .bind haven't it
      // `Function#toString` throws on some built-it function in some legacy engines
      // (for example, `DOMQuad` and similar in FF41-)
      return INCORRECT_TO_STRING || !!exec$4(constructorRegExp, inspectSource$1(argument));
    } catch (error) {
      return true;
    }
  };

  isConstructorLegacy.sham = true;

  // `IsConstructor` abstract operation
  // https://tc39.es/ecma262/#sec-isconstructor
  var isConstructor$4 = !construct || fails$v(function () {
    var called;
    return isConstructorModern(isConstructorModern.call)
      || !isConstructorModern(Object)
      || !isConstructorModern(function () { called = true; })
      || called;
  }) ? isConstructorLegacy : isConstructorModern;

  var global$P = global$19;
  var isArray$3 = isArray$4;
  var isConstructor$3 = isConstructor$4;
  var isObject$e = isObject$k;
  var wellKnownSymbol$o = wellKnownSymbol$s;

  var SPECIES$6 = wellKnownSymbol$o('species');
  var Array$7 = global$P.Array;

  // a part of `ArraySpeciesCreate` abstract operation
  // https://tc39.es/ecma262/#sec-arrayspeciescreate
  var arraySpeciesConstructor$1 = function (originalArray) {
    var C;
    if (isArray$3(originalArray)) {
      C = originalArray.constructor;
      // cross-realm fallback
      if (isConstructor$3(C) && (C === Array$7 || isArray$3(C.prototype))) C = undefined;
      else if (isObject$e(C)) {
        C = C[SPECIES$6];
        if (C === null) C = undefined;
      }
    } return C === undefined ? Array$7 : C;
  };

  var arraySpeciesConstructor = arraySpeciesConstructor$1;

  // `ArraySpeciesCreate` abstract operation
  // https://tc39.es/ecma262/#sec-arrayspeciescreate
  var arraySpeciesCreate$3 = function (originalArray, length) {
    return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
  };

  var bind$9 = functionBindContext;
  var uncurryThis$u = functionUncurryThis;
  var IndexedObject$2 = indexedObject;
  var toObject$b = toObject$d;
  var lengthOfArrayLike$d = lengthOfArrayLike$f;
  var arraySpeciesCreate$2 = arraySpeciesCreate$3;

  var push$7 = uncurryThis$u([].push);

  // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
  var createMethod$4 = function (TYPE) {
    var IS_MAP = TYPE == 1;
    var IS_FILTER = TYPE == 2;
    var IS_SOME = TYPE == 3;
    var IS_EVERY = TYPE == 4;
    var IS_FIND_INDEX = TYPE == 6;
    var IS_FILTER_REJECT = TYPE == 7;
    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    return function ($this, callbackfn, that, specificCreate) {
      var O = toObject$b($this);
      var self = IndexedObject$2(O);
      var boundFunction = bind$9(callbackfn, that);
      var length = lengthOfArrayLike$d(self);
      var index = 0;
      var create = specificCreate || arraySpeciesCreate$2;
      var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
      var value, result;
      for (;length > index; index++) if (NO_HOLES || index in self) {
        value = self[index];
        result = boundFunction(value, index, O);
        if (TYPE) {
          if (IS_MAP) target[index] = result; // map
          else if (result) switch (TYPE) {
            case 3: return true;              // some
            case 5: return value;             // find
            case 6: return index;             // findIndex
            case 2: push$7(target, value);      // filter
          } else switch (TYPE) {
            case 4: return false;             // every
            case 7: push$7(target, value);      // filterReject
          }
        }
      }
      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
    };
  };

  var arrayIteration = {
    // `Array.prototype.forEach` method
    // https://tc39.es/ecma262/#sec-array.prototype.foreach
    forEach: createMethod$4(0),
    // `Array.prototype.map` method
    // https://tc39.es/ecma262/#sec-array.prototype.map
    map: createMethod$4(1),
    // `Array.prototype.filter` method
    // https://tc39.es/ecma262/#sec-array.prototype.filter
    filter: createMethod$4(2),
    // `Array.prototype.some` method
    // https://tc39.es/ecma262/#sec-array.prototype.some
    some: createMethod$4(3),
    // `Array.prototype.every` method
    // https://tc39.es/ecma262/#sec-array.prototype.every
    every: createMethod$4(4),
    // `Array.prototype.find` method
    // https://tc39.es/ecma262/#sec-array.prototype.find
    find: createMethod$4(5),
    // `Array.prototype.findIndex` method
    // https://tc39.es/ecma262/#sec-array.prototype.findIndex
    findIndex: createMethod$4(6),
    // `Array.prototype.filterReject` method
    // https://github.com/tc39/proposal-array-filtering
    filterReject: createMethod$4(7)
  };

  var fails$u = fails$D;
  var wellKnownSymbol$n = wellKnownSymbol$s;
  var V8_VERSION$2 = engineV8Version;

  var SPECIES$5 = wellKnownSymbol$n('species');

  var arrayMethodHasSpeciesSupport$5 = function (METHOD_NAME) {
    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/677
    return V8_VERSION$2 >= 51 || !fails$u(function () {
      var array = [];
      var constructor = array.constructor = {};
      constructor[SPECIES$5] = function () {
        return { foo: 1 };
      };
      return array[METHOD_NAME](Boolean).foo !== 1;
    });
  };

  var $$q = _export;
  var $map$1 = arrayIteration.map;
  var arrayMethodHasSpeciesSupport$4 = arrayMethodHasSpeciesSupport$5;

  var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport$4('map');

  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  // with adding support of @@species
  $$q({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 }, {
    map: function map(callbackfn /* , thisArg */) {
      return $map$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var toObject$a = toObject$d;
  var toAbsoluteIndex$6 = toAbsoluteIndex$8;
  var lengthOfArrayLike$c = lengthOfArrayLike$f;

  // `Array.prototype.fill` method implementation
  // https://tc39.es/ecma262/#sec-array.prototype.fill
  var arrayFill$1 = function fill(value /* , start = 0, end = @length */) {
    var O = toObject$a(this);
    var length = lengthOfArrayLike$c(O);
    var argumentsLength = arguments.length;
    var index = toAbsoluteIndex$6(argumentsLength > 1 ? arguments[1] : undefined, length);
    var end = argumentsLength > 2 ? arguments[2] : undefined;
    var endPos = end === undefined ? length : toAbsoluteIndex$6(end, length);
    while (endPos > index) O[index++] = value;
    return O;
  };

  var objectDefineProperties = {};

  var internalObjectKeys = objectKeysInternal;
  var enumBugKeys$1 = enumBugKeys$3;

  // `Object.keys` method
  // https://tc39.es/ecma262/#sec-object.keys
  // eslint-disable-next-line es/no-object-keys -- safe
  var objectKeys$4 = Object.keys || function keys(O) {
    return internalObjectKeys(O, enumBugKeys$1);
  };

  var DESCRIPTORS$d = descriptors;
  var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
  var definePropertyModule$5 = objectDefineProperty;
  var anObject$f = anObject$i;
  var toIndexedObject$7 = toIndexedObject$b;
  var objectKeys$3 = objectKeys$4;

  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  // eslint-disable-next-line es/no-object-defineproperties -- safe
  objectDefineProperties.f = DESCRIPTORS$d && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject$f(O);
    var props = toIndexedObject$7(Properties);
    var keys = objectKeys$3(Properties);
    var length = keys.length;
    var index = 0;
    var key;
    while (length > index) definePropertyModule$5.f(O, key = keys[index++], props[key]);
    return O;
  };

  var getBuiltIn$4 = getBuiltIn$9;

  var html$2 = getBuiltIn$4('document', 'documentElement');

  /* global ActiveXObject -- old IE, WSH */

  var anObject$e = anObject$i;
  var definePropertiesModule$1 = objectDefineProperties;
  var enumBugKeys = enumBugKeys$3;
  var hiddenKeys$2 = hiddenKeys$6;
  var html$1 = html$2;
  var documentCreateElement$1 = documentCreateElement$2;
  var sharedKey$2 = sharedKey$4;

  var GT = '>';
  var LT = '<';
  var PROTOTYPE$2 = 'prototype';
  var SCRIPT = 'script';
  var IE_PROTO$1 = sharedKey$2('IE_PROTO');

  var EmptyConstructor = function () { /* empty */ };

  var scriptTag = function (content) {
    return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
  };

  // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
  var NullProtoObjectViaActiveX = function (activeXDocument) {
    activeXDocument.write(scriptTag(''));
    activeXDocument.close();
    var temp = activeXDocument.parentWindow.Object;
    activeXDocument = null; // avoid memory leak
    return temp;
  };

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var NullProtoObjectViaIFrame = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement$1('iframe');
    var JS = 'java' + SCRIPT + ':';
    var iframeDocument;
    iframe.style.display = 'none';
    html$1.appendChild(iframe);
    // https://github.com/zloirock/core-js/issues/475
    iframe.src = String(JS);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(scriptTag('document.F=Object'));
    iframeDocument.close();
    return iframeDocument.F;
  };

  // Check for document.domain and active x support
  // No need to use active x approach when document.domain is not set
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  // avoid IE GC bug
  var activeXDocument;
  var NullProtoObject = function () {
    try {
      activeXDocument = new ActiveXObject('htmlfile');
    } catch (error) { /* ignore */ }
    NullProtoObject = typeof document != 'undefined'
      ? document.domain && activeXDocument
        ? NullProtoObjectViaActiveX(activeXDocument) // old IE
        : NullProtoObjectViaIFrame()
      : NullProtoObjectViaActiveX(activeXDocument); // WSH
    var length = enumBugKeys.length;
    while (length--) delete NullProtoObject[PROTOTYPE$2][enumBugKeys[length]];
    return NullProtoObject();
  };

  hiddenKeys$2[IE_PROTO$1] = true;

  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  var objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      EmptyConstructor[PROTOTYPE$2] = anObject$e(O);
      result = new EmptyConstructor();
      EmptyConstructor[PROTOTYPE$2] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO$1] = O;
    } else result = NullProtoObject();
    return Properties === undefined ? result : definePropertiesModule$1.f(result, Properties);
  };

  var wellKnownSymbol$m = wellKnownSymbol$s;
  var create$5 = objectCreate;
  var definePropertyModule$4 = objectDefineProperty;

  var UNSCOPABLES = wellKnownSymbol$m('unscopables');
  var ArrayPrototype$1 = Array.prototype;

  // Array.prototype[@@unscopables]
  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
    definePropertyModule$4.f(ArrayPrototype$1, UNSCOPABLES, {
      configurable: true,
      value: create$5(null)
    });
  }

  // add a key to Array.prototype[@@unscopables]
  var addToUnscopables$3 = function (key) {
    ArrayPrototype$1[UNSCOPABLES][key] = true;
  };

  var $$p = _export;
  var fill$1 = arrayFill$1;
  var addToUnscopables$2 = addToUnscopables$3;

  // `Array.prototype.fill` method
  // https://tc39.es/ecma262/#sec-array.prototype.fill
  $$p({ target: 'Array', proto: true }, {
    fill: fill$1
  });

  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables$2('fill');

  var TO_STRING_TAG_SUPPORT$1 = toStringTagSupport;
  var classof$a = classof$c;

  // `Object.prototype.toString` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.tostring
  var objectToString = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString() {
    return '[object ' + classof$a(this) + ']';
  };

  var TO_STRING_TAG_SUPPORT = toStringTagSupport;
  var redefine$b = redefine$d.exports;
  var toString$a = objectToString;

  // `Object.prototype.toString` method
  // https://tc39.es/ecma262/#sec-object.prototype.tostring
  if (!TO_STRING_TAG_SUPPORT) {
    redefine$b(Object.prototype, 'toString', toString$a, { unsafe: true });
  }

  var toPropertyKey$2 = toPropertyKey$5;
  var definePropertyModule$3 = objectDefineProperty;
  var createPropertyDescriptor$4 = createPropertyDescriptor$7;

  var createProperty$6 = function (object, key, value) {
    var propertyKey = toPropertyKey$2(key);
    if (propertyKey in object) definePropertyModule$3.f(object, propertyKey, createPropertyDescriptor$4(0, value));
    else object[propertyKey] = value;
  };

  var $$o = _export;
  var global$O = global$19;
  var fails$t = fails$D;
  var isArray$2 = isArray$4;
  var isObject$d = isObject$k;
  var toObject$9 = toObject$d;
  var lengthOfArrayLike$b = lengthOfArrayLike$f;
  var createProperty$5 = createProperty$6;
  var arraySpeciesCreate$1 = arraySpeciesCreate$3;
  var arrayMethodHasSpeciesSupport$3 = arrayMethodHasSpeciesSupport$5;
  var wellKnownSymbol$l = wellKnownSymbol$s;
  var V8_VERSION$1 = engineV8Version;

  var IS_CONCAT_SPREADABLE = wellKnownSymbol$l('isConcatSpreadable');
  var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
  var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';
  var TypeError$h = global$O.TypeError;

  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/679
  var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION$1 >= 51 || !fails$t(function () {
    var array = [];
    array[IS_CONCAT_SPREADABLE] = false;
    return array.concat()[0] !== array;
  });

  var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport$3('concat');

  var isConcatSpreadable = function (O) {
    if (!isObject$d(O)) return false;
    var spreadable = O[IS_CONCAT_SPREADABLE];
    return spreadable !== undefined ? !!spreadable : isArray$2(O);
  };

  var FORCED$5 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

  // `Array.prototype.concat` method
  // https://tc39.es/ecma262/#sec-array.prototype.concat
  // with adding support of @@isConcatSpreadable and @@species
  $$o({ target: 'Array', proto: true, forced: FORCED$5 }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    concat: function concat(arg) {
      var O = toObject$9(this);
      var A = arraySpeciesCreate$1(O, 0);
      var n = 0;
      var i, k, length, len, E;
      for (i = -1, length = arguments.length; i < length; i++) {
        E = i === -1 ? O : arguments[i];
        if (isConcatSpreadable(E)) {
          len = lengthOfArrayLike$b(E);
          if (n + len > MAX_SAFE_INTEGER$1) throw TypeError$h(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
          for (k = 0; k < len; k++, n++) if (k in E) createProperty$5(A, n, E[k]);
        } else {
          if (n >= MAX_SAFE_INTEGER$1) throw TypeError$h(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
          createProperty$5(A, n++, E);
        }
      }
      A.length = n;
      return A;
    }
  });

  var iterators = {};

  var fails$s = fails$D;

  var correctPrototypeGetter = !fails$s(function () {
    function F() { /* empty */ }
    F.prototype.constructor = null;
    // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });

  var global$N = global$19;
  var hasOwn$b = hasOwnProperty_1;
  var isCallable$d = isCallable$p;
  var toObject$8 = toObject$d;
  var sharedKey$1 = sharedKey$4;
  var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;

  var IE_PROTO = sharedKey$1('IE_PROTO');
  var Object$1 = global$N.Object;
  var ObjectPrototype$3 = Object$1.prototype;

  // `Object.getPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.getprototypeof
  var objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? Object$1.getPrototypeOf : function (O) {
    var object = toObject$8(O);
    if (hasOwn$b(object, IE_PROTO)) return object[IE_PROTO];
    var constructor = object.constructor;
    if (isCallable$d(constructor) && object instanceof constructor) {
      return constructor.prototype;
    } return object instanceof Object$1 ? ObjectPrototype$3 : null;
  };

  var fails$r = fails$D;
  var isCallable$c = isCallable$p;
  var getPrototypeOf$3 = objectGetPrototypeOf;
  var redefine$a = redefine$d.exports;
  var wellKnownSymbol$k = wellKnownSymbol$s;

  var ITERATOR$8 = wellKnownSymbol$k('iterator');
  var BUGGY_SAFARI_ITERATORS$1 = false;

  // `%IteratorPrototype%` object
  // https://tc39.es/ecma262/#sec-%iteratorprototype%-object
  var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

  /* eslint-disable es/no-array-prototype-keys -- safe */
  if ([].keys) {
    arrayIterator = [].keys();
    // Safari 8 has buggy iterators w/o `next`
    if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
    else {
      PrototypeOfArrayIteratorPrototype = getPrototypeOf$3(getPrototypeOf$3(arrayIterator));
      if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
    }
  }

  var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == undefined || fails$r(function () {
    var test = {};
    // FF44- legacy iterators case
    return IteratorPrototype$2[ITERATOR$8].call(test) !== test;
  });

  if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

  // `%IteratorPrototype%[@@iterator]()` method
  // https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
  if (!isCallable$c(IteratorPrototype$2[ITERATOR$8])) {
    redefine$a(IteratorPrototype$2, ITERATOR$8, function () {
      return this;
    });
  }

  var iteratorsCore = {
    IteratorPrototype: IteratorPrototype$2,
    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
  };

  var defineProperty$a = objectDefineProperty.f;
  var hasOwn$a = hasOwnProperty_1;
  var wellKnownSymbol$j = wellKnownSymbol$s;

  var TO_STRING_TAG$2 = wellKnownSymbol$j('toStringTag');

  var setToStringTag$8 = function (target, TAG, STATIC) {
    if (target && !STATIC) target = target.prototype;
    if (target && !hasOwn$a(target, TO_STRING_TAG$2)) {
      defineProperty$a(target, TO_STRING_TAG$2, { configurable: true, value: TAG });
    }
  };

  var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;
  var create$4 = objectCreate;
  var createPropertyDescriptor$3 = createPropertyDescriptor$7;
  var setToStringTag$7 = setToStringTag$8;
  var Iterators$4 = iterators;

  var returnThis$1 = function () { return this; };

  var createIteratorConstructor$2 = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
    var TO_STRING_TAG = NAME + ' Iterator';
    IteratorConstructor.prototype = create$4(IteratorPrototype$1, { next: createPropertyDescriptor$3(+!ENUMERABLE_NEXT, next) });
    setToStringTag$7(IteratorConstructor, TO_STRING_TAG, false);
    Iterators$4[TO_STRING_TAG] = returnThis$1;
    return IteratorConstructor;
  };

  var global$M = global$19;
  var isCallable$b = isCallable$p;

  var String$3 = global$M.String;
  var TypeError$g = global$M.TypeError;

  var aPossiblePrototype$1 = function (argument) {
    if (typeof argument == 'object' || isCallable$b(argument)) return argument;
    throw TypeError$g("Can't set " + String$3(argument) + ' as a prototype');
  };

  /* eslint-disable no-proto -- safe */

  var uncurryThis$t = functionUncurryThis;
  var anObject$d = anObject$i;
  var aPossiblePrototype = aPossiblePrototype$1;

  // `Object.setPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.setprototypeof
  // Works with __proto__ only. Old v8 can't work with null proto objects.
  // eslint-disable-next-line es/no-object-setprototypeof -- safe
  var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
    var CORRECT_SETTER = false;
    var test = {};
    var setter;
    try {
      // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
      setter = uncurryThis$t(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
      setter(test, []);
      CORRECT_SETTER = test instanceof Array;
    } catch (error) { /* empty */ }
    return function setPrototypeOf(O, proto) {
      anObject$d(O);
      aPossiblePrototype(proto);
      if (CORRECT_SETTER) setter(O, proto);
      else O.__proto__ = proto;
      return O;
    };
  }() : undefined);

  var $$n = _export;
  var call$h = functionCall;
  var FunctionName$1 = functionName;
  var isCallable$a = isCallable$p;
  var createIteratorConstructor$1 = createIteratorConstructor$2;
  var getPrototypeOf$2 = objectGetPrototypeOf;
  var setPrototypeOf$5 = objectSetPrototypeOf;
  var setToStringTag$6 = setToStringTag$8;
  var createNonEnumerableProperty$6 = createNonEnumerableProperty$a;
  var redefine$9 = redefine$d.exports;
  var wellKnownSymbol$i = wellKnownSymbol$s;
  var Iterators$3 = iterators;
  var IteratorsCore = iteratorsCore;

  var PROPER_FUNCTION_NAME$2 = FunctionName$1.PROPER;
  var CONFIGURABLE_FUNCTION_NAME$1 = FunctionName$1.CONFIGURABLE;
  var IteratorPrototype = IteratorsCore.IteratorPrototype;
  var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
  var ITERATOR$7 = wellKnownSymbol$i('iterator');
  var KEYS = 'keys';
  var VALUES = 'values';
  var ENTRIES = 'entries';

  var returnThis = function () { return this; };

  var defineIterator$3 = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
    createIteratorConstructor$1(IteratorConstructor, NAME, next);

    var getIterationMethod = function (KIND) {
      if (KIND === DEFAULT && defaultIterator) return defaultIterator;
      if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
      switch (KIND) {
        case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
        case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
        case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
      } return function () { return new IteratorConstructor(this); };
    };

    var TO_STRING_TAG = NAME + ' Iterator';
    var INCORRECT_VALUES_NAME = false;
    var IterablePrototype = Iterable.prototype;
    var nativeIterator = IterablePrototype[ITERATOR$7]
      || IterablePrototype['@@iterator']
      || DEFAULT && IterablePrototype[DEFAULT];
    var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
    var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
    var CurrentIteratorPrototype, methods, KEY;

    // fix native
    if (anyNativeIterator) {
      CurrentIteratorPrototype = getPrototypeOf$2(anyNativeIterator.call(new Iterable()));
      if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
        if (getPrototypeOf$2(CurrentIteratorPrototype) !== IteratorPrototype) {
          if (setPrototypeOf$5) {
            setPrototypeOf$5(CurrentIteratorPrototype, IteratorPrototype);
          } else if (!isCallable$a(CurrentIteratorPrototype[ITERATOR$7])) {
            redefine$9(CurrentIteratorPrototype, ITERATOR$7, returnThis);
          }
        }
        // Set @@toStringTag to native iterators
        setToStringTag$6(CurrentIteratorPrototype, TO_STRING_TAG, true);
      }
    }

    // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
    if (PROPER_FUNCTION_NAME$2 && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
      if (CONFIGURABLE_FUNCTION_NAME$1) {
        createNonEnumerableProperty$6(IterablePrototype, 'name', VALUES);
      } else {
        INCORRECT_VALUES_NAME = true;
        defaultIterator = function values() { return call$h(nativeIterator, this); };
      }
    }

    // export additional methods
    if (DEFAULT) {
      methods = {
        values: getIterationMethod(VALUES),
        keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
        entries: getIterationMethod(ENTRIES)
      };
      if (FORCED) for (KEY in methods) {
        if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
          redefine$9(IterablePrototype, KEY, methods[KEY]);
        }
      } else $$n({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
    }

    // define iterator
    if (IterablePrototype[ITERATOR$7] !== defaultIterator) {
      redefine$9(IterablePrototype, ITERATOR$7, defaultIterator, { name: DEFAULT });
    }
    Iterators$3[NAME] = defaultIterator;

    return methods;
  };

  var toIndexedObject$6 = toIndexedObject$b;
  var addToUnscopables$1 = addToUnscopables$3;
  var Iterators$2 = iterators;
  var InternalStateModule$8 = internalState;
  var defineProperty$9 = objectDefineProperty.f;
  var defineIterator$2 = defineIterator$3;
  var DESCRIPTORS$c = descriptors;

  var ARRAY_ITERATOR = 'Array Iterator';
  var setInternalState$8 = InternalStateModule$8.set;
  var getInternalState$6 = InternalStateModule$8.getterFor(ARRAY_ITERATOR);

  // `Array.prototype.entries` method
  // https://tc39.es/ecma262/#sec-array.prototype.entries
  // `Array.prototype.keys` method
  // https://tc39.es/ecma262/#sec-array.prototype.keys
  // `Array.prototype.values` method
  // https://tc39.es/ecma262/#sec-array.prototype.values
  // `Array.prototype[@@iterator]` method
  // https://tc39.es/ecma262/#sec-array.prototype-@@iterator
  // `CreateArrayIterator` internal method
  // https://tc39.es/ecma262/#sec-createarrayiterator
  var es_array_iterator = defineIterator$2(Array, 'Array', function (iterated, kind) {
    setInternalState$8(this, {
      type: ARRAY_ITERATOR,
      target: toIndexedObject$6(iterated), // target
      index: 0,                          // next index
      kind: kind                         // kind
    });
  // `%ArrayIteratorPrototype%.next` method
  // https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
  }, function () {
    var state = getInternalState$6(this);
    var target = state.target;
    var kind = state.kind;
    var index = state.index++;
    if (!target || index >= target.length) {
      state.target = undefined;
      return { value: undefined, done: true };
    }
    if (kind == 'keys') return { value: index, done: false };
    if (kind == 'values') return { value: target[index], done: false };
    return { value: [index, target[index]], done: false };
  }, 'values');

  // argumentsList[@@iterator] is %ArrayProto_values%
  // https://tc39.es/ecma262/#sec-createunmappedargumentsobject
  // https://tc39.es/ecma262/#sec-createmappedargumentsobject
  var values = Iterators$2.Arguments = Iterators$2.Array;

  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables$1('keys');
  addToUnscopables$1('values');
  addToUnscopables$1('entries');

  // V8 ~ Chrome 45- bug
  if (DESCRIPTORS$c && values.name !== 'values') try {
    defineProperty$9(values, 'name', { value: 'values' });
  } catch (error) { /* empty */ }

  // eslint-disable-next-line es/no-typed-arrays -- safe
  var arrayBufferNative = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';

  var redefine$8 = redefine$d.exports;

  var redefineAll$4 = function (target, src, options) {
    for (var key in src) redefine$8(target, key, src[key], options);
    return target;
  };

  var global$L = global$19;
  var isPrototypeOf$6 = objectIsPrototypeOf;

  var TypeError$f = global$L.TypeError;

  var anInstance$7 = function (it, Prototype) {
    if (isPrototypeOf$6(Prototype, it)) return it;
    throw TypeError$f('Incorrect invocation');
  };

  var global$K = global$19;
  var toIntegerOrInfinity$6 = toIntegerOrInfinity$9;
  var toLength$8 = toLength$a;

  var RangeError$6 = global$K.RangeError;

  // `ToIndex` abstract operation
  // https://tc39.es/ecma262/#sec-toindex
  var toIndex$2 = function (it) {
    if (it === undefined) return 0;
    var number = toIntegerOrInfinity$6(it);
    var length = toLength$8(number);
    if (number !== length) throw RangeError$6('Wrong length or index');
    return length;
  };

  // IEEE754 conversions based on https://github.com/feross/ieee754
  var global$J = global$19;

  var Array$6 = global$J.Array;
  var abs = Math.abs;
  var pow$1 = Math.pow;
  var floor$6 = Math.floor;
  var log = Math.log;
  var LN2 = Math.LN2;

  var pack = function (number, mantissaLength, bytes) {
    var buffer = Array$6(bytes);
    var exponentLength = bytes * 8 - mantissaLength - 1;
    var eMax = (1 << exponentLength) - 1;
    var eBias = eMax >> 1;
    var rt = mantissaLength === 23 ? pow$1(2, -24) - pow$1(2, -77) : 0;
    var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
    var index = 0;
    var exponent, mantissa, c;
    number = abs(number);
    // eslint-disable-next-line no-self-compare -- NaN check
    if (number != number || number === Infinity) {
      // eslint-disable-next-line no-self-compare -- NaN check
      mantissa = number != number ? 1 : 0;
      exponent = eMax;
    } else {
      exponent = floor$6(log(number) / LN2);
      c = pow$1(2, -exponent);
      if (number * c < 1) {
        exponent--;
        c *= 2;
      }
      if (exponent + eBias >= 1) {
        number += rt / c;
      } else {
        number += rt * pow$1(2, 1 - eBias);
      }
      if (number * c >= 2) {
        exponent++;
        c /= 2;
      }
      if (exponent + eBias >= eMax) {
        mantissa = 0;
        exponent = eMax;
      } else if (exponent + eBias >= 1) {
        mantissa = (number * c - 1) * pow$1(2, mantissaLength);
        exponent = exponent + eBias;
      } else {
        mantissa = number * pow$1(2, eBias - 1) * pow$1(2, mantissaLength);
        exponent = 0;
      }
    }
    while (mantissaLength >= 8) {
      buffer[index++] = mantissa & 255;
      mantissa /= 256;
      mantissaLength -= 8;
    }
    exponent = exponent << mantissaLength | mantissa;
    exponentLength += mantissaLength;
    while (exponentLength > 0) {
      buffer[index++] = exponent & 255;
      exponent /= 256;
      exponentLength -= 8;
    }
    buffer[--index] |= sign * 128;
    return buffer;
  };

  var unpack = function (buffer, mantissaLength) {
    var bytes = buffer.length;
    var exponentLength = bytes * 8 - mantissaLength - 1;
    var eMax = (1 << exponentLength) - 1;
    var eBias = eMax >> 1;
    var nBits = exponentLength - 7;
    var index = bytes - 1;
    var sign = buffer[index--];
    var exponent = sign & 127;
    var mantissa;
    sign >>= 7;
    while (nBits > 0) {
      exponent = exponent * 256 + buffer[index--];
      nBits -= 8;
    }
    mantissa = exponent & (1 << -nBits) - 1;
    exponent >>= -nBits;
    nBits += mantissaLength;
    while (nBits > 0) {
      mantissa = mantissa * 256 + buffer[index--];
      nBits -= 8;
    }
    if (exponent === 0) {
      exponent = 1 - eBias;
    } else if (exponent === eMax) {
      return mantissa ? NaN : sign ? -Infinity : Infinity;
    } else {
      mantissa = mantissa + pow$1(2, mantissaLength);
      exponent = exponent - eBias;
    } return (sign ? -1 : 1) * mantissa * pow$1(2, exponent - mantissaLength);
  };

  var ieee754 = {
    pack: pack,
    unpack: unpack
  };

  var global$I = global$19;
  var toAbsoluteIndex$5 = toAbsoluteIndex$8;
  var lengthOfArrayLike$a = lengthOfArrayLike$f;
  var createProperty$4 = createProperty$6;

  var Array$5 = global$I.Array;
  var max$3 = Math.max;

  var arraySliceSimple = function (O, start, end) {
    var length = lengthOfArrayLike$a(O);
    var k = toAbsoluteIndex$5(start, length);
    var fin = toAbsoluteIndex$5(end === undefined ? length : end, length);
    var result = Array$5(max$3(fin - k, 0));
    for (var n = 0; k < fin; k++, n++) createProperty$4(result, n, O[k]);
    result.length = n;
    return result;
  };

  var global$H = global$19;
  var uncurryThis$s = functionUncurryThis;
  var DESCRIPTORS$b = descriptors;
  var NATIVE_ARRAY_BUFFER$1 = arrayBufferNative;
  var FunctionName = functionName;
  var createNonEnumerableProperty$5 = createNonEnumerableProperty$a;
  var redefineAll$3 = redefineAll$4;
  var fails$q = fails$D;
  var anInstance$6 = anInstance$7;
  var toIntegerOrInfinity$5 = toIntegerOrInfinity$9;
  var toLength$7 = toLength$a;
  var toIndex$1 = toIndex$2;
  var IEEE754 = ieee754;
  var getPrototypeOf$1 = objectGetPrototypeOf;
  var setPrototypeOf$4 = objectSetPrototypeOf;
  var getOwnPropertyNames$2 = objectGetOwnPropertyNames.f;
  var defineProperty$8 = objectDefineProperty.f;
  var arrayFill = arrayFill$1;
  var arraySlice$a = arraySliceSimple;
  var setToStringTag$5 = setToStringTag$8;
  var InternalStateModule$7 = internalState;

  var PROPER_FUNCTION_NAME$1 = FunctionName.PROPER;
  var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
  var getInternalState$5 = InternalStateModule$7.get;
  var setInternalState$7 = InternalStateModule$7.set;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var DATA_VIEW = 'DataView';
  var PROTOTYPE$1 = 'prototype';
  var WRONG_LENGTH$1 = 'Wrong length';
  var WRONG_INDEX = 'Wrong index';
  var NativeArrayBuffer = global$H[ARRAY_BUFFER];
  var $ArrayBuffer = NativeArrayBuffer;
  var ArrayBufferPrototype$1 = $ArrayBuffer && $ArrayBuffer[PROTOTYPE$1];
  var $DataView = global$H[DATA_VIEW];
  var DataViewPrototype$1 = $DataView && $DataView[PROTOTYPE$1];
  var ObjectPrototype$2 = Object.prototype;
  var Array$4 = global$H.Array;
  var RangeError$5 = global$H.RangeError;
  var fill = uncurryThis$s(arrayFill);
  var reverse = uncurryThis$s([].reverse);

  var packIEEE754 = IEEE754.pack;
  var unpackIEEE754 = IEEE754.unpack;

  var packInt8 = function (number) {
    return [number & 0xFF];
  };

  var packInt16 = function (number) {
    return [number & 0xFF, number >> 8 & 0xFF];
  };

  var packInt32 = function (number) {
    return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
  };

  var unpackInt32 = function (buffer) {
    return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
  };

  var packFloat32 = function (number) {
    return packIEEE754(number, 23, 4);
  };

  var packFloat64 = function (number) {
    return packIEEE754(number, 52, 8);
  };

  var addGetter$1 = function (Constructor, key) {
    defineProperty$8(Constructor[PROTOTYPE$1], key, { get: function () { return getInternalState$5(this)[key]; } });
  };

  var get = function (view, count, index, isLittleEndian) {
    var intIndex = toIndex$1(index);
    var store = getInternalState$5(view);
    if (intIndex + count > store.byteLength) throw RangeError$5(WRONG_INDEX);
    var bytes = getInternalState$5(store.buffer).bytes;
    var start = intIndex + store.byteOffset;
    var pack = arraySlice$a(bytes, start, start + count);
    return isLittleEndian ? pack : reverse(pack);
  };

  var set$1 = function (view, count, index, conversion, value, isLittleEndian) {
    var intIndex = toIndex$1(index);
    var store = getInternalState$5(view);
    if (intIndex + count > store.byteLength) throw RangeError$5(WRONG_INDEX);
    var bytes = getInternalState$5(store.buffer).bytes;
    var start = intIndex + store.byteOffset;
    var pack = conversion(+value);
    for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
  };

  if (!NATIVE_ARRAY_BUFFER$1) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance$6(this, ArrayBufferPrototype$1);
      var byteLength = toIndex$1(length);
      setInternalState$7(this, {
        bytes: fill(Array$4(byteLength), 0),
        byteLength: byteLength
      });
      if (!DESCRIPTORS$b) this.byteLength = byteLength;
    };

    ArrayBufferPrototype$1 = $ArrayBuffer[PROTOTYPE$1];

    $DataView = function DataView(buffer, byteOffset, byteLength) {
      anInstance$6(this, DataViewPrototype$1);
      anInstance$6(buffer, ArrayBufferPrototype$1);
      var bufferLength = getInternalState$5(buffer).byteLength;
      var offset = toIntegerOrInfinity$5(byteOffset);
      if (offset < 0 || offset > bufferLength) throw RangeError$5('Wrong offset');
      byteLength = byteLength === undefined ? bufferLength - offset : toLength$7(byteLength);
      if (offset + byteLength > bufferLength) throw RangeError$5(WRONG_LENGTH$1);
      setInternalState$7(this, {
        buffer: buffer,
        byteLength: byteLength,
        byteOffset: offset
      });
      if (!DESCRIPTORS$b) {
        this.buffer = buffer;
        this.byteLength = byteLength;
        this.byteOffset = offset;
      }
    };

    DataViewPrototype$1 = $DataView[PROTOTYPE$1];

    if (DESCRIPTORS$b) {
      addGetter$1($ArrayBuffer, 'byteLength');
      addGetter$1($DataView, 'buffer');
      addGetter$1($DataView, 'byteLength');
      addGetter$1($DataView, 'byteOffset');
    }

    redefineAll$3(DataViewPrototype$1, {
      getInt8: function getInt8(byteOffset) {
        return get(this, 1, byteOffset)[0] << 24 >> 24;
      },
      getUint8: function getUint8(byteOffset) {
        return get(this, 1, byteOffset)[0];
      },
      getInt16: function getInt16(byteOffset /* , littleEndian */) {
        var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
        return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
      },
      getUint16: function getUint16(byteOffset /* , littleEndian */) {
        var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
        return bytes[1] << 8 | bytes[0];
      },
      getInt32: function getInt32(byteOffset /* , littleEndian */) {
        return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
      },
      getUint32: function getUint32(byteOffset /* , littleEndian */) {
        return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
      },
      getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
        return unpackIEEE754(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
      },
      getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
        return unpackIEEE754(get(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
      },
      setInt8: function setInt8(byteOffset, value) {
        set$1(this, 1, byteOffset, packInt8, value);
      },
      setUint8: function setUint8(byteOffset, value) {
        set$1(this, 1, byteOffset, packInt8, value);
      },
      setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
        set$1(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
        set$1(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
        set$1(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
        set$1(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
        set$1(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
        set$1(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
      }
    });
  } else {
    var INCORRECT_ARRAY_BUFFER_NAME = PROPER_FUNCTION_NAME$1 && NativeArrayBuffer.name !== ARRAY_BUFFER;
    /* eslint-disable no-new -- required for testing */
    if (!fails$q(function () {
      NativeArrayBuffer(1);
    }) || !fails$q(function () {
      new NativeArrayBuffer(-1);
    }) || fails$q(function () {
      new NativeArrayBuffer();
      new NativeArrayBuffer(1.5);
      new NativeArrayBuffer(NaN);
      return INCORRECT_ARRAY_BUFFER_NAME && !CONFIGURABLE_FUNCTION_NAME;
    })) {
    /* eslint-enable no-new -- required for testing */
      $ArrayBuffer = function ArrayBuffer(length) {
        anInstance$6(this, ArrayBufferPrototype$1);
        return new NativeArrayBuffer(toIndex$1(length));
      };

      $ArrayBuffer[PROTOTYPE$1] = ArrayBufferPrototype$1;

      for (var keys$1 = getOwnPropertyNames$2(NativeArrayBuffer), j$2 = 0, key$1; keys$1.length > j$2;) {
        if (!((key$1 = keys$1[j$2++]) in $ArrayBuffer)) {
          createNonEnumerableProperty$5($ArrayBuffer, key$1, NativeArrayBuffer[key$1]);
        }
      }

      ArrayBufferPrototype$1.constructor = $ArrayBuffer;
    } else if (INCORRECT_ARRAY_BUFFER_NAME && CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty$5(NativeArrayBuffer, 'name', ARRAY_BUFFER);
    }

    // WebKit bug - the same parent prototype for typed arrays and data view
    if (setPrototypeOf$4 && getPrototypeOf$1(DataViewPrototype$1) !== ObjectPrototype$2) {
      setPrototypeOf$4(DataViewPrototype$1, ObjectPrototype$2);
    }

    // iOS Safari 7.x bug
    var testView = new $DataView(new $ArrayBuffer(2));
    var $setInt8 = uncurryThis$s(DataViewPrototype$1.setInt8);
    testView.setInt8(0, 2147483648);
    testView.setInt8(1, 2147483649);
    if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll$3(DataViewPrototype$1, {
      setInt8: function setInt8(byteOffset, value) {
        $setInt8(this, byteOffset, value << 24 >> 24);
      },
      setUint8: function setUint8(byteOffset, value) {
        $setInt8(this, byteOffset, value << 24 >> 24);
      }
    }, { unsafe: true });
  }

  setToStringTag$5($ArrayBuffer, ARRAY_BUFFER);
  setToStringTag$5($DataView, DATA_VIEW);

  var arrayBuffer = {
    ArrayBuffer: $ArrayBuffer,
    DataView: $DataView
  };

  var global$G = global$19;
  var isConstructor$2 = isConstructor$4;
  var tryToString$3 = tryToString$5;

  var TypeError$e = global$G.TypeError;

  // `Assert: IsConstructor(argument) is true`
  var aConstructor$2 = function (argument) {
    if (isConstructor$2(argument)) return argument;
    throw TypeError$e(tryToString$3(argument) + ' is not a constructor');
  };

  var anObject$c = anObject$i;
  var aConstructor$1 = aConstructor$2;
  var wellKnownSymbol$h = wellKnownSymbol$s;

  var SPECIES$4 = wellKnownSymbol$h('species');

  // `SpeciesConstructor` abstract operation
  // https://tc39.es/ecma262/#sec-speciesconstructor
  var speciesConstructor$4 = function (O, defaultConstructor) {
    var C = anObject$c(O).constructor;
    var S;
    return C === undefined || (S = anObject$c(C)[SPECIES$4]) == undefined ? defaultConstructor : aConstructor$1(S);
  };

  var $$m = _export;
  var uncurryThis$r = functionUncurryThis;
  var fails$p = fails$D;
  var ArrayBufferModule$1 = arrayBuffer;
  var anObject$b = anObject$i;
  var toAbsoluteIndex$4 = toAbsoluteIndex$8;
  var toLength$6 = toLength$a;
  var speciesConstructor$3 = speciesConstructor$4;

  var ArrayBuffer$3 = ArrayBufferModule$1.ArrayBuffer;
  var DataView$2 = ArrayBufferModule$1.DataView;
  var DataViewPrototype = DataView$2.prototype;
  var un$ArrayBufferSlice = uncurryThis$r(ArrayBuffer$3.prototype.slice);
  var getUint8$1 = uncurryThis$r(DataViewPrototype.getUint8);
  var setUint8$1 = uncurryThis$r(DataViewPrototype.setUint8);

  var INCORRECT_SLICE = fails$p(function () {
    return !new ArrayBuffer$3(2).slice(1, undefined).byteLength;
  });

  // `ArrayBuffer.prototype.slice` method
  // https://tc39.es/ecma262/#sec-arraybuffer.prototype.slice
  $$m({ target: 'ArrayBuffer', proto: true, unsafe: true, forced: INCORRECT_SLICE }, {
    slice: function slice(start, end) {
      if (un$ArrayBufferSlice && end === undefined) {
        return un$ArrayBufferSlice(anObject$b(this), start); // FF fix
      }
      var length = anObject$b(this).byteLength;
      var first = toAbsoluteIndex$4(start, length);
      var fin = toAbsoluteIndex$4(end === undefined ? length : end, length);
      var result = new (speciesConstructor$3(this, ArrayBuffer$3))(toLength$6(fin - first));
      var viewSource = new DataView$2(this);
      var viewTarget = new DataView$2(result);
      var index = 0;
      while (first < fin) {
        setUint8$1(viewTarget, index++, getUint8$1(viewSource, first++));
      } return result;
    }
  });

  var typedArrayConstructor = {exports: {}};

  var wellKnownSymbol$g = wellKnownSymbol$s;

  var ITERATOR$6 = wellKnownSymbol$g('iterator');
  var SAFE_CLOSING = false;

  try {
    var called = 0;
    var iteratorWithReturn = {
      next: function () {
        return { done: !!called++ };
      },
      'return': function () {
        SAFE_CLOSING = true;
      }
    };
    iteratorWithReturn[ITERATOR$6] = function () {
      return this;
    };
    // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
    Array.from(iteratorWithReturn, function () { throw 2; });
  } catch (error) { /* empty */ }

  var checkCorrectnessOfIteration$4 = function (exec, SKIP_CLOSING) {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
    var ITERATION_SUPPORT = false;
    try {
      var object = {};
      object[ITERATOR$6] = function () {
        return {
          next: function () {
            return { done: ITERATION_SUPPORT = true };
          }
        };
      };
      exec(object);
    } catch (error) { /* empty */ }
    return ITERATION_SUPPORT;
  };

  var NATIVE_ARRAY_BUFFER = arrayBufferNative;
  var DESCRIPTORS$a = descriptors;
  var global$F = global$19;
  var isCallable$9 = isCallable$p;
  var isObject$c = isObject$k;
  var hasOwn$9 = hasOwnProperty_1;
  var classof$9 = classof$c;
  var tryToString$2 = tryToString$5;
  var createNonEnumerableProperty$4 = createNonEnumerableProperty$a;
  var redefine$7 = redefine$d.exports;
  var defineProperty$7 = objectDefineProperty.f;
  var isPrototypeOf$5 = objectIsPrototypeOf;
  var getPrototypeOf = objectGetPrototypeOf;
  var setPrototypeOf$3 = objectSetPrototypeOf;
  var wellKnownSymbol$f = wellKnownSymbol$s;
  var uid$2 = uid$5;

  var Int8Array$4 = global$F.Int8Array;
  var Int8ArrayPrototype$1 = Int8Array$4 && Int8Array$4.prototype;
  var Uint8ClampedArray$1 = global$F.Uint8ClampedArray;
  var Uint8ClampedArrayPrototype = Uint8ClampedArray$1 && Uint8ClampedArray$1.prototype;
  var TypedArray$1 = Int8Array$4 && getPrototypeOf(Int8Array$4);
  var TypedArrayPrototype$2 = Int8ArrayPrototype$1 && getPrototypeOf(Int8ArrayPrototype$1);
  var ObjectPrototype$1 = Object.prototype;
  var TypeError$d = global$F.TypeError;

  var TO_STRING_TAG$1 = wellKnownSymbol$f('toStringTag');
  var TYPED_ARRAY_TAG$1 = uid$2('TYPED_ARRAY_TAG');
  var TYPED_ARRAY_CONSTRUCTOR$2 = uid$2('TYPED_ARRAY_CONSTRUCTOR');
  // Fixing native typed arrays in Opera Presto crashes the browser, see #595
  var NATIVE_ARRAY_BUFFER_VIEWS$2 = NATIVE_ARRAY_BUFFER && !!setPrototypeOf$3 && classof$9(global$F.opera) !== 'Opera';
  var TYPED_ARRAY_TAG_REQUIRED = false;
  var NAME$1, Constructor, Prototype;

  var TypedArrayConstructorsList = {
    Int8Array: 1,
    Uint8Array: 1,
    Uint8ClampedArray: 1,
    Int16Array: 2,
    Uint16Array: 2,
    Int32Array: 4,
    Uint32Array: 4,
    Float32Array: 4,
    Float64Array: 8
  };

  var BigIntArrayConstructorsList = {
    BigInt64Array: 8,
    BigUint64Array: 8
  };

  var isView = function isView(it) {
    if (!isObject$c(it)) return false;
    var klass = classof$9(it);
    return klass === 'DataView'
      || hasOwn$9(TypedArrayConstructorsList, klass)
      || hasOwn$9(BigIntArrayConstructorsList, klass);
  };

  var isTypedArray$1 = function (it) {
    if (!isObject$c(it)) return false;
    var klass = classof$9(it);
    return hasOwn$9(TypedArrayConstructorsList, klass)
      || hasOwn$9(BigIntArrayConstructorsList, klass);
  };

  var aTypedArray$m = function (it) {
    if (isTypedArray$1(it)) return it;
    throw TypeError$d('Target is not a typed array');
  };

  var aTypedArrayConstructor$3 = function (C) {
    if (isCallable$9(C) && (!setPrototypeOf$3 || isPrototypeOf$5(TypedArray$1, C))) return C;
    throw TypeError$d(tryToString$2(C) + ' is not a typed array constructor');
  };

  var exportTypedArrayMethod$n = function (KEY, property, forced, options) {
    if (!DESCRIPTORS$a) return;
    if (forced) for (var ARRAY in TypedArrayConstructorsList) {
      var TypedArrayConstructor = global$F[ARRAY];
      if (TypedArrayConstructor && hasOwn$9(TypedArrayConstructor.prototype, KEY)) try {
        delete TypedArrayConstructor.prototype[KEY];
      } catch (error) {
        // old WebKit bug - some methods are non-configurable
        try {
          TypedArrayConstructor.prototype[KEY] = property;
        } catch (error2) { /* empty */ }
      }
    }
    if (!TypedArrayPrototype$2[KEY] || forced) {
      redefine$7(TypedArrayPrototype$2, KEY, forced ? property
        : NATIVE_ARRAY_BUFFER_VIEWS$2 && Int8ArrayPrototype$1[KEY] || property, options);
    }
  };

  var exportTypedArrayStaticMethod = function (KEY, property, forced) {
    var ARRAY, TypedArrayConstructor;
    if (!DESCRIPTORS$a) return;
    if (setPrototypeOf$3) {
      if (forced) for (ARRAY in TypedArrayConstructorsList) {
        TypedArrayConstructor = global$F[ARRAY];
        if (TypedArrayConstructor && hasOwn$9(TypedArrayConstructor, KEY)) try {
          delete TypedArrayConstructor[KEY];
        } catch (error) { /* empty */ }
      }
      if (!TypedArray$1[KEY] || forced) {
        // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
        try {
          return redefine$7(TypedArray$1, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS$2 && TypedArray$1[KEY] || property);
        } catch (error) { /* empty */ }
      } else return;
    }
    for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global$F[ARRAY];
      if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
        redefine$7(TypedArrayConstructor, KEY, property);
      }
    }
  };

  for (NAME$1 in TypedArrayConstructorsList) {
    Constructor = global$F[NAME$1];
    Prototype = Constructor && Constructor.prototype;
    if (Prototype) createNonEnumerableProperty$4(Prototype, TYPED_ARRAY_CONSTRUCTOR$2, Constructor);
    else NATIVE_ARRAY_BUFFER_VIEWS$2 = false;
  }

  for (NAME$1 in BigIntArrayConstructorsList) {
    Constructor = global$F[NAME$1];
    Prototype = Constructor && Constructor.prototype;
    if (Prototype) createNonEnumerableProperty$4(Prototype, TYPED_ARRAY_CONSTRUCTOR$2, Constructor);
  }

  // WebKit bug - typed arrays constructors prototype is Object.prototype
  if (!NATIVE_ARRAY_BUFFER_VIEWS$2 || !isCallable$9(TypedArray$1) || TypedArray$1 === Function.prototype) {
    // eslint-disable-next-line no-shadow -- safe
    TypedArray$1 = function TypedArray() {
      throw TypeError$d('Incorrect invocation');
    };
    if (NATIVE_ARRAY_BUFFER_VIEWS$2) for (NAME$1 in TypedArrayConstructorsList) {
      if (global$F[NAME$1]) setPrototypeOf$3(global$F[NAME$1], TypedArray$1);
    }
  }

  if (!NATIVE_ARRAY_BUFFER_VIEWS$2 || !TypedArrayPrototype$2 || TypedArrayPrototype$2 === ObjectPrototype$1) {
    TypedArrayPrototype$2 = TypedArray$1.prototype;
    if (NATIVE_ARRAY_BUFFER_VIEWS$2) for (NAME$1 in TypedArrayConstructorsList) {
      if (global$F[NAME$1]) setPrototypeOf$3(global$F[NAME$1].prototype, TypedArrayPrototype$2);
    }
  }

  // WebKit bug - one more object in Uint8ClampedArray prototype chain
  if (NATIVE_ARRAY_BUFFER_VIEWS$2 && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype$2) {
    setPrototypeOf$3(Uint8ClampedArrayPrototype, TypedArrayPrototype$2);
  }

  if (DESCRIPTORS$a && !hasOwn$9(TypedArrayPrototype$2, TO_STRING_TAG$1)) {
    TYPED_ARRAY_TAG_REQUIRED = true;
    defineProperty$7(TypedArrayPrototype$2, TO_STRING_TAG$1, { get: function () {
      return isObject$c(this) ? this[TYPED_ARRAY_TAG$1] : undefined;
    } });
    for (NAME$1 in TypedArrayConstructorsList) if (global$F[NAME$1]) {
      createNonEnumerableProperty$4(global$F[NAME$1], TYPED_ARRAY_TAG$1, NAME$1);
    }
  }

  var arrayBufferViewCore = {
    NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS$2,
    TYPED_ARRAY_CONSTRUCTOR: TYPED_ARRAY_CONSTRUCTOR$2,
    TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQUIRED && TYPED_ARRAY_TAG$1,
    aTypedArray: aTypedArray$m,
    aTypedArrayConstructor: aTypedArrayConstructor$3,
    exportTypedArrayMethod: exportTypedArrayMethod$n,
    exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
    isView: isView,
    isTypedArray: isTypedArray$1,
    TypedArray: TypedArray$1,
    TypedArrayPrototype: TypedArrayPrototype$2
  };

  /* eslint-disable no-new -- required for testing */

  var global$E = global$19;
  var fails$o = fails$D;
  var checkCorrectnessOfIteration$3 = checkCorrectnessOfIteration$4;
  var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

  var ArrayBuffer$2 = global$E.ArrayBuffer;
  var Int8Array$3 = global$E.Int8Array;

  var typedArrayConstructorsRequireWrappers = !NATIVE_ARRAY_BUFFER_VIEWS$1 || !fails$o(function () {
    Int8Array$3(1);
  }) || !fails$o(function () {
    new Int8Array$3(-1);
  }) || !checkCorrectnessOfIteration$3(function (iterable) {
    new Int8Array$3();
    new Int8Array$3(null);
    new Int8Array$3(1.5);
    new Int8Array$3(iterable);
  }, true) || fails$o(function () {
    // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
    return new Int8Array$3(new ArrayBuffer$2(2), 1, undefined).length !== 1;
  });

  var isObject$b = isObject$k;

  var floor$5 = Math.floor;

  // `IsIntegralNumber` abstract operation
  // https://tc39.es/ecma262/#sec-isintegralnumber
  // eslint-disable-next-line es/no-number-isinteger -- safe
  var isIntegralNumber$1 = Number.isInteger || function isInteger(it) {
    return !isObject$b(it) && isFinite(it) && floor$5(it) === it;
  };

  var global$D = global$19;
  var toIntegerOrInfinity$4 = toIntegerOrInfinity$9;

  var RangeError$4 = global$D.RangeError;

  var toPositiveInteger$1 = function (it) {
    var result = toIntegerOrInfinity$4(it);
    if (result < 0) throw RangeError$4("The argument can't be less than 0");
    return result;
  };

  var global$C = global$19;
  var toPositiveInteger = toPositiveInteger$1;

  var RangeError$3 = global$C.RangeError;

  var toOffset$2 = function (it, BYTES) {
    var offset = toPositiveInteger(it);
    if (offset % BYTES) throw RangeError$3('Wrong offset');
    return offset;
  };

  var classof$8 = classof$c;
  var getMethod$3 = getMethod$5;
  var Iterators$1 = iterators;
  var wellKnownSymbol$e = wellKnownSymbol$s;

  var ITERATOR$5 = wellKnownSymbol$e('iterator');

  var getIteratorMethod$5 = function (it) {
    if (it != undefined) return getMethod$3(it, ITERATOR$5)
      || getMethod$3(it, '@@iterator')
      || Iterators$1[classof$8(it)];
  };

  var global$B = global$19;
  var call$g = functionCall;
  var aCallable$4 = aCallable$7;
  var anObject$a = anObject$i;
  var tryToString$1 = tryToString$5;
  var getIteratorMethod$4 = getIteratorMethod$5;

  var TypeError$c = global$B.TypeError;

  var getIterator$4 = function (argument, usingIterator) {
    var iteratorMethod = arguments.length < 2 ? getIteratorMethod$4(argument) : usingIterator;
    if (aCallable$4(iteratorMethod)) return anObject$a(call$g(iteratorMethod, argument));
    throw TypeError$c(tryToString$1(argument) + ' is not iterable');
  };

  var wellKnownSymbol$d = wellKnownSymbol$s;
  var Iterators = iterators;

  var ITERATOR$4 = wellKnownSymbol$d('iterator');
  var ArrayPrototype = Array.prototype;

  // check on default Array iterator
  var isArrayIteratorMethod$3 = function (it) {
    return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR$4] === it);
  };

  var bind$8 = functionBindContext;
  var call$f = functionCall;
  var aConstructor = aConstructor$2;
  var toObject$7 = toObject$d;
  var lengthOfArrayLike$9 = lengthOfArrayLike$f;
  var getIterator$3 = getIterator$4;
  var getIteratorMethod$3 = getIteratorMethod$5;
  var isArrayIteratorMethod$2 = isArrayIteratorMethod$3;
  var aTypedArrayConstructor$2 = arrayBufferViewCore.aTypedArrayConstructor;

  var typedArrayFrom$1 = function from(source /* , mapfn, thisArg */) {
    var C = aConstructor(this);
    var O = toObject$7(source);
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iteratorMethod = getIteratorMethod$3(O);
    var i, length, result, step, iterator, next;
    if (iteratorMethod && !isArrayIteratorMethod$2(iteratorMethod)) {
      iterator = getIterator$3(O, iteratorMethod);
      next = iterator.next;
      O = [];
      while (!(step = call$f(next, iterator)).done) {
        O.push(step.value);
      }
    }
    if (mapping && argumentsLength > 2) {
      mapfn = bind$8(mapfn, arguments[2]);
    }
    length = lengthOfArrayLike$9(O);
    result = new (aTypedArrayConstructor$2(C))(length);
    for (i = 0; length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var getBuiltIn$3 = getBuiltIn$9;
  var definePropertyModule$2 = objectDefineProperty;
  var wellKnownSymbol$c = wellKnownSymbol$s;
  var DESCRIPTORS$9 = descriptors;

  var SPECIES$3 = wellKnownSymbol$c('species');

  var setSpecies$3 = function (CONSTRUCTOR_NAME) {
    var Constructor = getBuiltIn$3(CONSTRUCTOR_NAME);
    var defineProperty = definePropertyModule$2.f;

    if (DESCRIPTORS$9 && Constructor && !Constructor[SPECIES$3]) {
      defineProperty(Constructor, SPECIES$3, {
        configurable: true,
        get: function () { return this; }
      });
    }
  };

  var isCallable$8 = isCallable$p;
  var isObject$a = isObject$k;
  var setPrototypeOf$2 = objectSetPrototypeOf;

  // makes subclassing work correct for wrapped built-ins
  var inheritIfRequired$3 = function ($this, dummy, Wrapper) {
    var NewTarget, NewTargetPrototype;
    if (
      // it can work only with native `setPrototypeOf`
      setPrototypeOf$2 &&
      // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
      isCallable$8(NewTarget = dummy.constructor) &&
      NewTarget !== Wrapper &&
      isObject$a(NewTargetPrototype = NewTarget.prototype) &&
      NewTargetPrototype !== Wrapper.prototype
    ) setPrototypeOf$2($this, NewTargetPrototype);
    return $this;
  };

  var $$l = _export;
  var global$A = global$19;
  var call$e = functionCall;
  var DESCRIPTORS$8 = descriptors;
  var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = typedArrayConstructorsRequireWrappers;
  var ArrayBufferViewCore$n = arrayBufferViewCore;
  var ArrayBufferModule = arrayBuffer;
  var anInstance$5 = anInstance$7;
  var createPropertyDescriptor$2 = createPropertyDescriptor$7;
  var createNonEnumerableProperty$3 = createNonEnumerableProperty$a;
  var isIntegralNumber = isIntegralNumber$1;
  var toLength$5 = toLength$a;
  var toIndex = toIndex$2;
  var toOffset$1 = toOffset$2;
  var toPropertyKey$1 = toPropertyKey$5;
  var hasOwn$8 = hasOwnProperty_1;
  var classof$7 = classof$c;
  var isObject$9 = isObject$k;
  var isSymbol$2 = isSymbol$5;
  var create$3 = objectCreate;
  var isPrototypeOf$4 = objectIsPrototypeOf;
  var setPrototypeOf$1 = objectSetPrototypeOf;
  var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
  var typedArrayFrom = typedArrayFrom$1;
  var forEach$1 = arrayIteration.forEach;
  var setSpecies$2 = setSpecies$3;
  var definePropertyModule$1 = objectDefineProperty;
  var getOwnPropertyDescriptorModule$1 = objectGetOwnPropertyDescriptor;
  var InternalStateModule$6 = internalState;
  var inheritIfRequired$2 = inheritIfRequired$3;

  var getInternalState$4 = InternalStateModule$6.get;
  var setInternalState$6 = InternalStateModule$6.set;
  var nativeDefineProperty$1 = definePropertyModule$1.f;
  var nativeGetOwnPropertyDescriptor$1 = getOwnPropertyDescriptorModule$1.f;
  var round = Math.round;
  var RangeError$2 = global$A.RangeError;
  var ArrayBuffer$1 = ArrayBufferModule.ArrayBuffer;
  var ArrayBufferPrototype = ArrayBuffer$1.prototype;
  var DataView$1 = ArrayBufferModule.DataView;
  var NATIVE_ARRAY_BUFFER_VIEWS = ArrayBufferViewCore$n.NATIVE_ARRAY_BUFFER_VIEWS;
  var TYPED_ARRAY_CONSTRUCTOR$1 = ArrayBufferViewCore$n.TYPED_ARRAY_CONSTRUCTOR;
  var TYPED_ARRAY_TAG = ArrayBufferViewCore$n.TYPED_ARRAY_TAG;
  var TypedArray = ArrayBufferViewCore$n.TypedArray;
  var TypedArrayPrototype$1 = ArrayBufferViewCore$n.TypedArrayPrototype;
  var aTypedArrayConstructor$1 = ArrayBufferViewCore$n.aTypedArrayConstructor;
  var isTypedArray = ArrayBufferViewCore$n.isTypedArray;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var WRONG_LENGTH = 'Wrong length';

  var fromList = function (C, list) {
    aTypedArrayConstructor$1(C);
    var index = 0;
    var length = list.length;
    var result = new C(length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key) {
    nativeDefineProperty$1(it, key, { get: function () {
      return getInternalState$4(this)[key];
    } });
  };

  var isArrayBuffer = function (it) {
    var klass;
    return isPrototypeOf$4(ArrayBufferPrototype, it) || (klass = classof$7(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
  };

  var isTypedArrayIndex = function (target, key) {
    return isTypedArray(target)
      && !isSymbol$2(key)
      && key in target
      && isIntegralNumber(+key)
      && key >= 0;
  };

  var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
    key = toPropertyKey$1(key);
    return isTypedArrayIndex(target, key)
      ? createPropertyDescriptor$2(2, target[key])
      : nativeGetOwnPropertyDescriptor$1(target, key);
  };

  var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
    key = toPropertyKey$1(key);
    if (isTypedArrayIndex(target, key)
      && isObject$9(descriptor)
      && hasOwn$8(descriptor, 'value')
      && !hasOwn$8(descriptor, 'get')
      && !hasOwn$8(descriptor, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !descriptor.configurable
      && (!hasOwn$8(descriptor, 'writable') || descriptor.writable)
      && (!hasOwn$8(descriptor, 'enumerable') || descriptor.enumerable)
    ) {
      target[key] = descriptor.value;
      return target;
    } return nativeDefineProperty$1(target, key, descriptor);
  };

  if (DESCRIPTORS$8) {
    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
      getOwnPropertyDescriptorModule$1.f = wrappedGetOwnPropertyDescriptor;
      definePropertyModule$1.f = wrappedDefineProperty;
      addGetter(TypedArrayPrototype$1, 'buffer');
      addGetter(TypedArrayPrototype$1, 'byteOffset');
      addGetter(TypedArrayPrototype$1, 'byteLength');
      addGetter(TypedArrayPrototype$1, 'length');
    }

    $$l({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
      getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
      defineProperty: wrappedDefineProperty
    });

    typedArrayConstructor.exports = function (TYPE, wrapper, CLAMPED) {
      var BYTES = TYPE.match(/\d+$/)[0] / 8;
      var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
      var GETTER = 'get' + TYPE;
      var SETTER = 'set' + TYPE;
      var NativeTypedArrayConstructor = global$A[CONSTRUCTOR_NAME];
      var TypedArrayConstructor = NativeTypedArrayConstructor;
      var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
      var exported = {};

      var getter = function (that, index) {
        var data = getInternalState$4(that);
        return data.view[GETTER](index * BYTES + data.byteOffset, true);
      };

      var setter = function (that, index, value) {
        var data = getInternalState$4(that);
        if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
        data.view[SETTER](index * BYTES + data.byteOffset, value, true);
      };

      var addElement = function (that, index) {
        nativeDefineProperty$1(that, index, {
          get: function () {
            return getter(this, index);
          },
          set: function (value) {
            return setter(this, index, value);
          },
          enumerable: true
        });
      };

      if (!NATIVE_ARRAY_BUFFER_VIEWS) {
        TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
          anInstance$5(that, TypedArrayConstructorPrototype);
          var index = 0;
          var byteOffset = 0;
          var buffer, byteLength, length;
          if (!isObject$9(data)) {
            length = toIndex(data);
            byteLength = length * BYTES;
            buffer = new ArrayBuffer$1(byteLength);
          } else if (isArrayBuffer(data)) {
            buffer = data;
            byteOffset = toOffset$1(offset, BYTES);
            var $len = data.byteLength;
            if ($length === undefined) {
              if ($len % BYTES) throw RangeError$2(WRONG_LENGTH);
              byteLength = $len - byteOffset;
              if (byteLength < 0) throw RangeError$2(WRONG_LENGTH);
            } else {
              byteLength = toLength$5($length) * BYTES;
              if (byteLength + byteOffset > $len) throw RangeError$2(WRONG_LENGTH);
            }
            length = byteLength / BYTES;
          } else if (isTypedArray(data)) {
            return fromList(TypedArrayConstructor, data);
          } else {
            return call$e(typedArrayFrom, TypedArrayConstructor, data);
          }
          setInternalState$6(that, {
            buffer: buffer,
            byteOffset: byteOffset,
            byteLength: byteLength,
            length: length,
            view: new DataView$1(buffer)
          });
          while (index < length) addElement(that, index++);
        });

        if (setPrototypeOf$1) setPrototypeOf$1(TypedArrayConstructor, TypedArray);
        TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = create$3(TypedArrayPrototype$1);
      } else if (TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS) {
        TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
          anInstance$5(dummy, TypedArrayConstructorPrototype);
          return inheritIfRequired$2(function () {
            if (!isObject$9(data)) return new NativeTypedArrayConstructor(toIndex(data));
            if (isArrayBuffer(data)) return $length !== undefined
              ? new NativeTypedArrayConstructor(data, toOffset$1(typedArrayOffset, BYTES), $length)
              : typedArrayOffset !== undefined
                ? new NativeTypedArrayConstructor(data, toOffset$1(typedArrayOffset, BYTES))
                : new NativeTypedArrayConstructor(data);
            if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
            return call$e(typedArrayFrom, TypedArrayConstructor, data);
          }(), dummy, TypedArrayConstructor);
        });

        if (setPrototypeOf$1) setPrototypeOf$1(TypedArrayConstructor, TypedArray);
        forEach$1(getOwnPropertyNames$1(NativeTypedArrayConstructor), function (key) {
          if (!(key in TypedArrayConstructor)) {
            createNonEnumerableProperty$3(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
          }
        });
        TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
      }

      if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
        createNonEnumerableProperty$3(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
      }

      createNonEnumerableProperty$3(TypedArrayConstructorPrototype, TYPED_ARRAY_CONSTRUCTOR$1, TypedArrayConstructor);

      if (TYPED_ARRAY_TAG) {
        createNonEnumerableProperty$3(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
      }

      exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

      $$l({
        global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
      }, exported);

      if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
        createNonEnumerableProperty$3(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
      }

      if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
        createNonEnumerableProperty$3(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
      }

      setSpecies$2(CONSTRUCTOR_NAME);
    };
  } else typedArrayConstructor.exports = function () { /* empty */ };

  var createTypedArrayConstructor$3 = typedArrayConstructor.exports;

  // `Uint8Array` constructor
  // https://tc39.es/ecma262/#sec-typedarray-objects
  createTypedArrayConstructor$3('Uint8', function (init) {
    return function Uint8Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  var toObject$6 = toObject$d;
  var toAbsoluteIndex$3 = toAbsoluteIndex$8;
  var lengthOfArrayLike$8 = lengthOfArrayLike$f;

  var min$6 = Math.min;

  // `Array.prototype.copyWithin` method implementation
  // https://tc39.es/ecma262/#sec-array.prototype.copywithin
  // eslint-disable-next-line es/no-array-prototype-copywithin -- safe
  var arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
    var O = toObject$6(this);
    var len = lengthOfArrayLike$8(O);
    var to = toAbsoluteIndex$3(target, len);
    var from = toAbsoluteIndex$3(start, len);
    var end = arguments.length > 2 ? arguments[2] : undefined;
    var count = min$6((end === undefined ? len : toAbsoluteIndex$3(end, len)) - from, len - to);
    var inc = 1;
    if (from < to && to < from + count) {
      inc = -1;
      from += count - 1;
      to += count - 1;
    }
    while (count-- > 0) {
      if (from in O) O[to] = O[from];
      else delete O[to];
      to += inc;
      from += inc;
    } return O;
  };

  var uncurryThis$q = functionUncurryThis;
  var ArrayBufferViewCore$m = arrayBufferViewCore;
  var $ArrayCopyWithin = arrayCopyWithin;

  var u$ArrayCopyWithin = uncurryThis$q($ArrayCopyWithin);
  var aTypedArray$l = ArrayBufferViewCore$m.aTypedArray;
  var exportTypedArrayMethod$m = ArrayBufferViewCore$m.exportTypedArrayMethod;

  // `%TypedArray%.prototype.copyWithin` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin
  exportTypedArrayMethod$m('copyWithin', function copyWithin(target, start /* , end */) {
    return u$ArrayCopyWithin(aTypedArray$l(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
  });

  var ArrayBufferViewCore$l = arrayBufferViewCore;
  var $every = arrayIteration.every;

  var aTypedArray$k = ArrayBufferViewCore$l.aTypedArray;
  var exportTypedArrayMethod$l = ArrayBufferViewCore$l.exportTypedArrayMethod;

  // `%TypedArray%.prototype.every` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.every
  exportTypedArrayMethod$l('every', function every(callbackfn /* , thisArg */) {
    return $every(aTypedArray$k(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var ArrayBufferViewCore$k = arrayBufferViewCore;
  var call$d = functionCall;
  var $fill = arrayFill$1;

  var aTypedArray$j = ArrayBufferViewCore$k.aTypedArray;
  var exportTypedArrayMethod$k = ArrayBufferViewCore$k.exportTypedArrayMethod;

  // `%TypedArray%.prototype.fill` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill
  exportTypedArrayMethod$k('fill', function fill(value /* , start, end */) {
    var length = arguments.length;
    return call$d(
      $fill,
      aTypedArray$j(this),
      value,
      length > 1 ? arguments[1] : undefined,
      length > 2 ? arguments[2] : undefined
    );
  });

  var lengthOfArrayLike$7 = lengthOfArrayLike$f;

  var arrayFromConstructorAndList$1 = function (Constructor, list) {
    var index = 0;
    var length = lengthOfArrayLike$7(list);
    var result = new Constructor(length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var ArrayBufferViewCore$j = arrayBufferViewCore;
  var speciesConstructor$2 = speciesConstructor$4;

  var TYPED_ARRAY_CONSTRUCTOR = ArrayBufferViewCore$j.TYPED_ARRAY_CONSTRUCTOR;
  var aTypedArrayConstructor = ArrayBufferViewCore$j.aTypedArrayConstructor;

  // a part of `TypedArraySpeciesCreate` abstract operation
  // https://tc39.es/ecma262/#typedarray-species-create
  var typedArraySpeciesConstructor$4 = function (originalArray) {
    return aTypedArrayConstructor(speciesConstructor$2(originalArray, originalArray[TYPED_ARRAY_CONSTRUCTOR]));
  };

  var arrayFromConstructorAndList = arrayFromConstructorAndList$1;
  var typedArraySpeciesConstructor$3 = typedArraySpeciesConstructor$4;

  var typedArrayFromSpeciesAndList = function (instance, list) {
    return arrayFromConstructorAndList(typedArraySpeciesConstructor$3(instance), list);
  };

  var ArrayBufferViewCore$i = arrayBufferViewCore;
  var $filter$1 = arrayIteration.filter;
  var fromSpeciesAndList = typedArrayFromSpeciesAndList;

  var aTypedArray$i = ArrayBufferViewCore$i.aTypedArray;
  var exportTypedArrayMethod$j = ArrayBufferViewCore$i.exportTypedArrayMethod;

  // `%TypedArray%.prototype.filter` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter
  exportTypedArrayMethod$j('filter', function filter(callbackfn /* , thisArg */) {
    var list = $filter$1(aTypedArray$i(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    return fromSpeciesAndList(this, list);
  });

  var ArrayBufferViewCore$h = arrayBufferViewCore;
  var $find$1 = arrayIteration.find;

  var aTypedArray$h = ArrayBufferViewCore$h.aTypedArray;
  var exportTypedArrayMethod$i = ArrayBufferViewCore$h.exportTypedArrayMethod;

  // `%TypedArray%.prototype.find` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.find
  exportTypedArrayMethod$i('find', function find(predicate /* , thisArg */) {
    return $find$1(aTypedArray$h(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
  });

  var ArrayBufferViewCore$g = arrayBufferViewCore;
  var $findIndex = arrayIteration.findIndex;

  var aTypedArray$g = ArrayBufferViewCore$g.aTypedArray;
  var exportTypedArrayMethod$h = ArrayBufferViewCore$g.exportTypedArrayMethod;

  // `%TypedArray%.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex
  exportTypedArrayMethod$h('findIndex', function findIndex(predicate /* , thisArg */) {
    return $findIndex(aTypedArray$g(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
  });

  var ArrayBufferViewCore$f = arrayBufferViewCore;
  var $forEach$2 = arrayIteration.forEach;

  var aTypedArray$f = ArrayBufferViewCore$f.aTypedArray;
  var exportTypedArrayMethod$g = ArrayBufferViewCore$f.exportTypedArrayMethod;

  // `%TypedArray%.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach
  exportTypedArrayMethod$g('forEach', function forEach(callbackfn /* , thisArg */) {
    $forEach$2(aTypedArray$f(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var ArrayBufferViewCore$e = arrayBufferViewCore;
  var $includes = arrayIncludes.includes;

  var aTypedArray$e = ArrayBufferViewCore$e.aTypedArray;
  var exportTypedArrayMethod$f = ArrayBufferViewCore$e.exportTypedArrayMethod;

  // `%TypedArray%.prototype.includes` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes
  exportTypedArrayMethod$f('includes', function includes(searchElement /* , fromIndex */) {
    return $includes(aTypedArray$e(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
  });

  var ArrayBufferViewCore$d = arrayBufferViewCore;
  var $indexOf = arrayIncludes.indexOf;

  var aTypedArray$d = ArrayBufferViewCore$d.aTypedArray;
  var exportTypedArrayMethod$e = ArrayBufferViewCore$d.exportTypedArrayMethod;

  // `%TypedArray%.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof
  exportTypedArrayMethod$e('indexOf', function indexOf(searchElement /* , fromIndex */) {
    return $indexOf(aTypedArray$d(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
  });

  var global$z = global$19;
  var fails$n = fails$D;
  var uncurryThis$p = functionUncurryThis;
  var ArrayBufferViewCore$c = arrayBufferViewCore;
  var ArrayIterators = es_array_iterator;
  var wellKnownSymbol$b = wellKnownSymbol$s;

  var ITERATOR$3 = wellKnownSymbol$b('iterator');
  var Uint8Array$2 = global$z.Uint8Array;
  var arrayValues = uncurryThis$p(ArrayIterators.values);
  var arrayKeys = uncurryThis$p(ArrayIterators.keys);
  var arrayEntries = uncurryThis$p(ArrayIterators.entries);
  var aTypedArray$c = ArrayBufferViewCore$c.aTypedArray;
  var exportTypedArrayMethod$d = ArrayBufferViewCore$c.exportTypedArrayMethod;
  var TypedArrayPrototype = Uint8Array$2 && Uint8Array$2.prototype;

  var GENERIC = !fails$n(function () {
    TypedArrayPrototype[ITERATOR$3].call([1]);
  });

  var ITERATOR_IS_VALUES = !!TypedArrayPrototype
    && TypedArrayPrototype.values
    && TypedArrayPrototype[ITERATOR$3] === TypedArrayPrototype.values
    && TypedArrayPrototype.values.name === 'values';

  var typedArrayValues = function values() {
    return arrayValues(aTypedArray$c(this));
  };

  // `%TypedArray%.prototype.entries` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.entries
  exportTypedArrayMethod$d('entries', function entries() {
    return arrayEntries(aTypedArray$c(this));
  }, GENERIC);
  // `%TypedArray%.prototype.keys` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys
  exportTypedArrayMethod$d('keys', function keys() {
    return arrayKeys(aTypedArray$c(this));
  }, GENERIC);
  // `%TypedArray%.prototype.values` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
  exportTypedArrayMethod$d('values', typedArrayValues, GENERIC || !ITERATOR_IS_VALUES, { name: 'values' });
  // `%TypedArray%.prototype[@@iterator]` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator
  exportTypedArrayMethod$d(ITERATOR$3, typedArrayValues, GENERIC || !ITERATOR_IS_VALUES, { name: 'values' });

  var ArrayBufferViewCore$b = arrayBufferViewCore;
  var uncurryThis$o = functionUncurryThis;

  var aTypedArray$b = ArrayBufferViewCore$b.aTypedArray;
  var exportTypedArrayMethod$c = ArrayBufferViewCore$b.exportTypedArrayMethod;
  var $join = uncurryThis$o([].join);

  // `%TypedArray%.prototype.join` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.join
  exportTypedArrayMethod$c('join', function join(separator) {
    return $join(aTypedArray$b(this), separator);
  });

  var NATIVE_BIND = functionBindNative;

  var FunctionPrototype$1 = Function.prototype;
  var apply$7 = FunctionPrototype$1.apply;
  var call$c = FunctionPrototype$1.call;

  // eslint-disable-next-line es/no-reflect -- safe
  var functionApply = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call$c.bind(apply$7) : function () {
    return call$c.apply(apply$7, arguments);
  });

  var fails$m = fails$D;

  var arrayMethodIsStrict$2 = function (METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return !!method && fails$m(function () {
      // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
      method.call(null, argument || function () { throw 1; }, 1);
    });
  };

  /* eslint-disable es/no-array-prototype-lastindexof -- safe */
  var apply$6 = functionApply;
  var toIndexedObject$5 = toIndexedObject$b;
  var toIntegerOrInfinity$3 = toIntegerOrInfinity$9;
  var lengthOfArrayLike$6 = lengthOfArrayLike$f;
  var arrayMethodIsStrict$1 = arrayMethodIsStrict$2;

  var min$5 = Math.min;
  var $lastIndexOf$1 = [].lastIndexOf;
  var NEGATIVE_ZERO = !!$lastIndexOf$1 && 1 / [1].lastIndexOf(1, -0) < 0;
  var STRICT_METHOD$1 = arrayMethodIsStrict$1('lastIndexOf');
  var FORCED$4 = NEGATIVE_ZERO || !STRICT_METHOD$1;

  // `Array.prototype.lastIndexOf` method implementation
  // https://tc39.es/ecma262/#sec-array.prototype.lastindexof
  var arrayLastIndexOf = FORCED$4 ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO) return apply$6($lastIndexOf$1, this, arguments) || 0;
    var O = toIndexedObject$5(this);
    var length = lengthOfArrayLike$6(O);
    var index = length - 1;
    if (arguments.length > 1) index = min$5(index, toIntegerOrInfinity$3(arguments[1]));
    if (index < 0) index = length + index;
    for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
    return -1;
  } : $lastIndexOf$1;

  var ArrayBufferViewCore$a = arrayBufferViewCore;
  var apply$5 = functionApply;
  var $lastIndexOf = arrayLastIndexOf;

  var aTypedArray$a = ArrayBufferViewCore$a.aTypedArray;
  var exportTypedArrayMethod$b = ArrayBufferViewCore$a.exportTypedArrayMethod;

  // `%TypedArray%.prototype.lastIndexOf` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof
  exportTypedArrayMethod$b('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
    var length = arguments.length;
    return apply$5($lastIndexOf, aTypedArray$a(this), length > 1 ? [searchElement, arguments[1]] : [searchElement]);
  });

  var ArrayBufferViewCore$9 = arrayBufferViewCore;
  var $map = arrayIteration.map;
  var typedArraySpeciesConstructor$2 = typedArraySpeciesConstructor$4;

  var aTypedArray$9 = ArrayBufferViewCore$9.aTypedArray;
  var exportTypedArrayMethod$a = ArrayBufferViewCore$9.exportTypedArrayMethod;

  // `%TypedArray%.prototype.map` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.map
  exportTypedArrayMethod$a('map', function map(mapfn /* , thisArg */) {
    return $map(aTypedArray$9(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
      return new (typedArraySpeciesConstructor$2(O))(length);
    });
  });

  var global$y = global$19;
  var aCallable$3 = aCallable$7;
  var toObject$5 = toObject$d;
  var IndexedObject$1 = indexedObject;
  var lengthOfArrayLike$5 = lengthOfArrayLike$f;

  var TypeError$b = global$y.TypeError;

  // `Array.prototype.{ reduce, reduceRight }` methods implementation
  var createMethod$3 = function (IS_RIGHT) {
    return function (that, callbackfn, argumentsLength, memo) {
      aCallable$3(callbackfn);
      var O = toObject$5(that);
      var self = IndexedObject$1(O);
      var length = lengthOfArrayLike$5(O);
      var index = IS_RIGHT ? length - 1 : 0;
      var i = IS_RIGHT ? -1 : 1;
      if (argumentsLength < 2) while (true) {
        if (index in self) {
          memo = self[index];
          index += i;
          break;
        }
        index += i;
        if (IS_RIGHT ? index < 0 : length <= index) {
          throw TypeError$b('Reduce of empty array with no initial value');
        }
      }
      for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
        memo = callbackfn(memo, self[index], index, O);
      }
      return memo;
    };
  };

  var arrayReduce = {
    // `Array.prototype.reduce` method
    // https://tc39.es/ecma262/#sec-array.prototype.reduce
    left: createMethod$3(false),
    // `Array.prototype.reduceRight` method
    // https://tc39.es/ecma262/#sec-array.prototype.reduceright
    right: createMethod$3(true)
  };

  var ArrayBufferViewCore$8 = arrayBufferViewCore;
  var $reduce = arrayReduce.left;

  var aTypedArray$8 = ArrayBufferViewCore$8.aTypedArray;
  var exportTypedArrayMethod$9 = ArrayBufferViewCore$8.exportTypedArrayMethod;

  // `%TypedArray%.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce
  exportTypedArrayMethod$9('reduce', function reduce(callbackfn /* , initialValue */) {
    var length = arguments.length;
    return $reduce(aTypedArray$8(this), callbackfn, length, length > 1 ? arguments[1] : undefined);
  });

  var ArrayBufferViewCore$7 = arrayBufferViewCore;
  var $reduceRight = arrayReduce.right;

  var aTypedArray$7 = ArrayBufferViewCore$7.aTypedArray;
  var exportTypedArrayMethod$8 = ArrayBufferViewCore$7.exportTypedArrayMethod;

  // `%TypedArray%.prototype.reduceRicht` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright
  exportTypedArrayMethod$8('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
    var length = arguments.length;
    return $reduceRight(aTypedArray$7(this), callbackfn, length, length > 1 ? arguments[1] : undefined);
  });

  var ArrayBufferViewCore$6 = arrayBufferViewCore;

  var aTypedArray$6 = ArrayBufferViewCore$6.aTypedArray;
  var exportTypedArrayMethod$7 = ArrayBufferViewCore$6.exportTypedArrayMethod;
  var floor$4 = Math.floor;

  // `%TypedArray%.prototype.reverse` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse
  exportTypedArrayMethod$7('reverse', function reverse() {
    var that = this;
    var length = aTypedArray$6(that).length;
    var middle = floor$4(length / 2);
    var index = 0;
    var value;
    while (index < middle) {
      value = that[index];
      that[index++] = that[--length];
      that[length] = value;
    } return that;
  });

  var global$x = global$19;
  var call$b = functionCall;
  var ArrayBufferViewCore$5 = arrayBufferViewCore;
  var lengthOfArrayLike$4 = lengthOfArrayLike$f;
  var toOffset = toOffset$2;
  var toIndexedObject$4 = toObject$d;
  var fails$l = fails$D;

  var RangeError$1 = global$x.RangeError;
  var Int8Array$2 = global$x.Int8Array;
  var Int8ArrayPrototype = Int8Array$2 && Int8Array$2.prototype;
  var $set = Int8ArrayPrototype && Int8ArrayPrototype.set;
  var aTypedArray$5 = ArrayBufferViewCore$5.aTypedArray;
  var exportTypedArrayMethod$6 = ArrayBufferViewCore$5.exportTypedArrayMethod;

  var WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS = !fails$l(function () {
    // eslint-disable-next-line es/no-typed-arrays -- required for testing
    var array = new Uint8ClampedArray(2);
    call$b($set, array, { length: 1, 0: 3 }, 1);
    return array[1] !== 3;
  });

  // https://bugs.chromium.org/p/v8/issues/detail?id=11294 and other
  var TO_OBJECT_BUG = WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS && ArrayBufferViewCore$5.NATIVE_ARRAY_BUFFER_VIEWS && fails$l(function () {
    var array = new Int8Array$2(2);
    array.set(1);
    array.set('2', 1);
    return array[0] !== 0 || array[1] !== 2;
  });

  // `%TypedArray%.prototype.set` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
  exportTypedArrayMethod$6('set', function set(arrayLike /* , offset */) {
    aTypedArray$5(this);
    var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
    var src = toIndexedObject$4(arrayLike);
    if (WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS) return call$b($set, this, src, offset);
    var length = this.length;
    var len = lengthOfArrayLike$4(src);
    var index = 0;
    if (len + offset > length) throw RangeError$1('Wrong length');
    while (index < len) this[offset + index] = src[index++];
  }, !WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS || TO_OBJECT_BUG);

  var uncurryThis$n = functionUncurryThis;

  var arraySlice$9 = uncurryThis$n([].slice);

  var ArrayBufferViewCore$4 = arrayBufferViewCore;
  var typedArraySpeciesConstructor$1 = typedArraySpeciesConstructor$4;
  var fails$k = fails$D;
  var arraySlice$8 = arraySlice$9;

  var aTypedArray$4 = ArrayBufferViewCore$4.aTypedArray;
  var exportTypedArrayMethod$5 = ArrayBufferViewCore$4.exportTypedArrayMethod;

  var FORCED$3 = fails$k(function () {
    // eslint-disable-next-line es/no-typed-arrays -- required for testing
    new Int8Array(1).slice();
  });

  // `%TypedArray%.prototype.slice` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice
  exportTypedArrayMethod$5('slice', function slice(start, end) {
    var list = arraySlice$8(aTypedArray$4(this), start, end);
    var C = typedArraySpeciesConstructor$1(this);
    var index = 0;
    var length = list.length;
    var result = new C(length);
    while (length > index) result[index] = list[index++];
    return result;
  }, FORCED$3);

  var ArrayBufferViewCore$3 = arrayBufferViewCore;
  var $some = arrayIteration.some;

  var aTypedArray$3 = ArrayBufferViewCore$3.aTypedArray;
  var exportTypedArrayMethod$4 = ArrayBufferViewCore$3.exportTypedArrayMethod;

  // `%TypedArray%.prototype.some` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.some
  exportTypedArrayMethod$4('some', function some(callbackfn /* , thisArg */) {
    return $some(aTypedArray$3(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var arraySlice$7 = arraySliceSimple;

  var floor$3 = Math.floor;

  var mergeSort = function (array, comparefn) {
    var length = array.length;
    var middle = floor$3(length / 2);
    return length < 8 ? insertionSort(array, comparefn) : merge(
      array,
      mergeSort(arraySlice$7(array, 0, middle), comparefn),
      mergeSort(arraySlice$7(array, middle), comparefn),
      comparefn
    );
  };

  var insertionSort = function (array, comparefn) {
    var length = array.length;
    var i = 1;
    var element, j;

    while (i < length) {
      j = i;
      element = array[i];
      while (j && comparefn(array[j - 1], element) > 0) {
        array[j] = array[--j];
      }
      if (j !== i++) array[j] = element;
    } return array;
  };

  var merge = function (array, left, right, comparefn) {
    var llength = left.length;
    var rlength = right.length;
    var lindex = 0;
    var rindex = 0;

    while (lindex < llength || rindex < rlength) {
      array[lindex + rindex] = (lindex < llength && rindex < rlength)
        ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
        : lindex < llength ? left[lindex++] : right[rindex++];
    } return array;
  };

  var arraySort$1 = mergeSort;

  var userAgent$4 = engineUserAgent;

  var firefox = userAgent$4.match(/firefox\/(\d+)/i);

  var engineFfVersion = !!firefox && +firefox[1];

  var UA = engineUserAgent;

  var engineIsIeOrEdge = /MSIE|Trident/.test(UA);

  var userAgent$3 = engineUserAgent;

  var webkit = userAgent$3.match(/AppleWebKit\/(\d+)\./);

  var engineWebkitVersion = !!webkit && +webkit[1];

  var global$w = global$19;
  var uncurryThis$m = functionUncurryThis;
  var fails$j = fails$D;
  var aCallable$2 = aCallable$7;
  var internalSort = arraySort$1;
  var ArrayBufferViewCore$2 = arrayBufferViewCore;
  var FF = engineFfVersion;
  var IE_OR_EDGE = engineIsIeOrEdge;
  var V8 = engineV8Version;
  var WEBKIT = engineWebkitVersion;

  var Array$3 = global$w.Array;
  var aTypedArray$2 = ArrayBufferViewCore$2.aTypedArray;
  var exportTypedArrayMethod$3 = ArrayBufferViewCore$2.exportTypedArrayMethod;
  var Uint16Array$1 = global$w.Uint16Array;
  var un$Sort = Uint16Array$1 && uncurryThis$m(Uint16Array$1.prototype.sort);

  // WebKit
  var ACCEPT_INCORRECT_ARGUMENTS = !!un$Sort && !(fails$j(function () {
    un$Sort(new Uint16Array$1(2), null);
  }) && fails$j(function () {
    un$Sort(new Uint16Array$1(2), {});
  }));

  var STABLE_SORT = !!un$Sort && !fails$j(function () {
    // feature detection can be too slow, so check engines versions
    if (V8) return V8 < 74;
    if (FF) return FF < 67;
    if (IE_OR_EDGE) return true;
    if (WEBKIT) return WEBKIT < 602;

    var array = new Uint16Array$1(516);
    var expected = Array$3(516);
    var index, mod;

    for (index = 0; index < 516; index++) {
      mod = index % 4;
      array[index] = 515 - index;
      expected[index] = index - 2 * mod + 3;
    }

    un$Sort(array, function (a, b) {
      return (a / 4 | 0) - (b / 4 | 0);
    });

    for (index = 0; index < 516; index++) {
      if (array[index] !== expected[index]) return true;
    }
  });

  var getSortCompare = function (comparefn) {
    return function (x, y) {
      if (comparefn !== undefined) return +comparefn(x, y) || 0;
      // eslint-disable-next-line no-self-compare -- NaN check
      if (y !== y) return -1;
      // eslint-disable-next-line no-self-compare -- NaN check
      if (x !== x) return 1;
      if (x === 0 && y === 0) return 1 / x > 0 && 1 / y < 0 ? 1 : -1;
      return x > y;
    };
  };

  // `%TypedArray%.prototype.sort` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
  exportTypedArrayMethod$3('sort', function sort(comparefn) {
    if (comparefn !== undefined) aCallable$2(comparefn);
    if (STABLE_SORT) return un$Sort(this, comparefn);

    return internalSort(aTypedArray$2(this), getSortCompare(comparefn));
  }, !STABLE_SORT || ACCEPT_INCORRECT_ARGUMENTS);

  var ArrayBufferViewCore$1 = arrayBufferViewCore;
  var toLength$4 = toLength$a;
  var toAbsoluteIndex$2 = toAbsoluteIndex$8;
  var typedArraySpeciesConstructor = typedArraySpeciesConstructor$4;

  var aTypedArray$1 = ArrayBufferViewCore$1.aTypedArray;
  var exportTypedArrayMethod$2 = ArrayBufferViewCore$1.exportTypedArrayMethod;

  // `%TypedArray%.prototype.subarray` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray
  exportTypedArrayMethod$2('subarray', function subarray(begin, end) {
    var O = aTypedArray$1(this);
    var length = O.length;
    var beginIndex = toAbsoluteIndex$2(begin, length);
    var C = typedArraySpeciesConstructor(O);
    return new C(
      O.buffer,
      O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
      toLength$4((end === undefined ? length : toAbsoluteIndex$2(end, length)) - beginIndex)
    );
  });

  var global$v = global$19;
  var apply$4 = functionApply;
  var ArrayBufferViewCore = arrayBufferViewCore;
  var fails$i = fails$D;
  var arraySlice$6 = arraySlice$9;

  var Int8Array$1 = global$v.Int8Array;
  var aTypedArray = ArrayBufferViewCore.aTypedArray;
  var exportTypedArrayMethod$1 = ArrayBufferViewCore.exportTypedArrayMethod;
  var $toLocaleString = [].toLocaleString;

  // iOS Safari 6.x fails here
  var TO_LOCALE_STRING_BUG = !!Int8Array$1 && fails$i(function () {
    $toLocaleString.call(new Int8Array$1(1));
  });

  var FORCED$2 = fails$i(function () {
    return [1, 2].toLocaleString() != new Int8Array$1([1, 2]).toLocaleString();
  }) || !fails$i(function () {
    Int8Array$1.prototype.toLocaleString.call([1, 2]);
  });

  // `%TypedArray%.prototype.toLocaleString` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring
  exportTypedArrayMethod$1('toLocaleString', function toLocaleString() {
    return apply$4(
      $toLocaleString,
      TO_LOCALE_STRING_BUG ? arraySlice$6(aTypedArray(this)) : aTypedArray(this),
      arraySlice$6(arguments)
    );
  }, FORCED$2);

  var exportTypedArrayMethod = arrayBufferViewCore.exportTypedArrayMethod;
  var fails$h = fails$D;
  var global$u = global$19;
  var uncurryThis$l = functionUncurryThis;

  var Uint8Array$1 = global$u.Uint8Array;
  var Uint8ArrayPrototype = Uint8Array$1 && Uint8Array$1.prototype || {};
  var arrayToString = [].toString;
  var join$3 = uncurryThis$l([].join);

  if (fails$h(function () { arrayToString.call({}); })) {
    arrayToString = function toString() {
      return join$3(this);
    };
  }

  var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

  // `%TypedArray%.prototype.toString` method
  // https://tc39.es/ecma262/#sec-%typedarray%.prototype.tostring
  exportTypedArrayMethod('toString', arrayToString, IS_NOT_ARRAY_METHOD);

  var createTypedArrayConstructor$2 = typedArrayConstructor.exports;

  // `Uint16Array` constructor
  // https://tc39.es/ecma262/#sec-typedarray-objects
  createTypedArrayConstructor$2('Uint16', function (init) {
    return function Uint16Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  var $$k = _export;
  var global$t = global$19;
  var isArray$1 = isArray$4;
  var isConstructor$1 = isConstructor$4;
  var isObject$8 = isObject$k;
  var toAbsoluteIndex$1 = toAbsoluteIndex$8;
  var lengthOfArrayLike$3 = lengthOfArrayLike$f;
  var toIndexedObject$3 = toIndexedObject$b;
  var createProperty$3 = createProperty$6;
  var wellKnownSymbol$a = wellKnownSymbol$s;
  var arrayMethodHasSpeciesSupport$2 = arrayMethodHasSpeciesSupport$5;
  var un$Slice = arraySlice$9;

  var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport$2('slice');

  var SPECIES$2 = wellKnownSymbol$a('species');
  var Array$2 = global$t.Array;
  var max$2 = Math.max;

  // `Array.prototype.slice` method
  // https://tc39.es/ecma262/#sec-array.prototype.slice
  // fallback for not array-like ES3 strings and DOM objects
  $$k({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 }, {
    slice: function slice(start, end) {
      var O = toIndexedObject$3(this);
      var length = lengthOfArrayLike$3(O);
      var k = toAbsoluteIndex$1(start, length);
      var fin = toAbsoluteIndex$1(end === undefined ? length : end, length);
      // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
      var Constructor, result, n;
      if (isArray$1(O)) {
        Constructor = O.constructor;
        // cross-realm fallback
        if (isConstructor$1(Constructor) && (Constructor === Array$2 || isArray$1(Constructor.prototype))) {
          Constructor = undefined;
        } else if (isObject$8(Constructor)) {
          Constructor = Constructor[SPECIES$2];
          if (Constructor === null) Constructor = undefined;
        }
        if (Constructor === Array$2 || Constructor === undefined) {
          return un$Slice(O, k, fin);
        }
      }
      result = new (Constructor === undefined ? Array$2 : Constructor)(max$2(fin - k, 0));
      for (n = 0; k < fin; k++, n++) if (k in O) createProperty$3(result, n, O[k]);
      result.length = n;
      return result;
    }
  });

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */

  var _ref3, _ref4;
  var MAX_BITS$1 = 15;
  var D_CODES = 30;
  var BL_CODES = 19;
  var LENGTH_CODES = 29;
  var LITERALS = 256;
  var L_CODES = LITERALS + 1 + LENGTH_CODES;
  var HEAP_SIZE = 2 * L_CODES + 1;
  var END_BLOCK = 256; // Bit length codes must not exceed MAX_BL_BITS bits

  var MAX_BL_BITS = 7; // repeat previous bit length 3-6 times (2 bits of repeat count)

  var REP_3_6 = 16; // repeat a zero length 3-10 times (3 bits of repeat count)

  var REPZ_3_10 = 17; // repeat a zero length 11-138 times (7 bits of repeat count)

  var REPZ_11_138 = 18; // The lengths of the bit length codes are sent in order of decreasing
  // probability, to avoid transmitting the lengths for unused bit
  // length codes.

  var Buf_size = 8 * 2; // JZlib version : "1.0.2"

  var Z_DEFAULT_COMPRESSION = -1; // compression strategy

  var Z_FILTERED = 1;
  var Z_HUFFMAN_ONLY = 2;
  var Z_DEFAULT_STRATEGY = 0;
  var Z_NO_FLUSH$1 = 0;
  var Z_PARTIAL_FLUSH = 1;
  var Z_FULL_FLUSH = 3;
  var Z_FINISH$1 = 4;
  var Z_OK$1 = 0;
  var Z_STREAM_END$1 = 1;
  var Z_NEED_DICT$1 = 2;
  var Z_STREAM_ERROR$1 = -2;
  var Z_DATA_ERROR$1 = -3;
  var Z_BUF_ERROR$1 = -5; // Tree

  function extractArray(array) {
    return flatArray(array.map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          length = _ref2[0],
          value = _ref2[1];

      return new Array(length).fill(value, 0, length);
    }));
  }

  function flatArray(array) {
    return array.reduce(function (a, b) {
      return a.concat(Array.isArray(b) ? flatArray(b) : b);
    }, []);
  } // see definition of array dist_code below


  var _dist_code = (_ref3 = [0, 1, 2, 3]).concat.apply(_ref3, _toConsumableArray(extractArray([[2, 4], [2, 5], [4, 6], [4, 7], [8, 8], [8, 9], [16, 10], [16, 11], [32, 12], [32, 13], [64, 14], [64, 15], [2, 0], [1, 16], [1, 17], [2, 18], [2, 19], [4, 20], [4, 21], [8, 22], [8, 23], [16, 24], [16, 25], [32, 26], [32, 27], [64, 28], [64, 29]])));

  function Tree() {
    var that = this; // dyn_tree; // the dynamic tree
    // max_code; // largest code with non zero frequency
    // stat_desc; // the corresponding static tree
    // Compute the optimal bit lengths for a tree and update the total bit
    // length
    // for the current block.
    // IN assertion: the fields freq and dad are set, heap[heap_max] and
    // above are the tree nodes sorted by increasing frequency.
    // OUT assertions: the field len is set to the optimal bit length, the
    // array bl_count contains the frequencies for each bit length.
    // The length opt_len is updated; static_len is also updated if stree is
    // not null.

    function gen_bitlen(s) {
      var tree = that.dyn_tree;
      var stree = that.stat_desc.static_tree;
      var extra = that.stat_desc.extra_bits;
      var base = that.stat_desc.extra_base;
      var max_length = that.stat_desc.max_length;
      var h; // heap index

      var n, m; // iterate over the tree elements

      var bits; // bit length

      var xbits; // extra bits

      var f; // frequency

      var overflow = 0; // number of elements with bit length too large

      for (bits = 0; bits <= MAX_BITS$1; bits++) {
        s.bl_count[bits] = 0;
      } // In a first pass, compute the optimal bit lengths (which may
      // overflow in the case of the bit length tree).


      tree[s.heap[s.heap_max] * 2 + 1] = 0; // root of the heap

      for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
        n = s.heap[h];
        bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;

        if (bits > max_length) {
          bits = max_length;
          overflow++;
        }

        tree[n * 2 + 1] = bits; // We overwrite tree[n*2+1] which is no longer needed

        if (n > that.max_code) continue; // not a leaf node

        s.bl_count[bits]++;
        xbits = 0;
        if (n >= base) xbits = extra[n - base];
        f = tree[n * 2];
        s.opt_len += f * (bits + xbits);
        if (stree) s.static_len += f * (stree[n * 2 + 1] + xbits);
      }

      if (overflow === 0) return; // This happens for example on obj2 and pic of the Calgary corpus
      // Find the first bit length which could increase:

      do {
        bits = max_length - 1;

        while (s.bl_count[bits] === 0) {
          bits--;
        }

        s.bl_count[bits]--; // move one leaf down the tree

        s.bl_count[bits + 1] += 2; // move one overflow item as its brother

        s.bl_count[max_length]--; // The brother of the overflow item also moves one step up,
        // but this does not affect bl_count[max_length]

        overflow -= 2;
      } while (overflow > 0);

      for (bits = max_length; bits !== 0; bits--) {
        n = s.bl_count[bits];

        while (n !== 0) {
          m = s.heap[--h];
          if (m > that.max_code) continue;

          if (tree[m * 2 + 1] != bits) {
            s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
            tree[m * 2 + 1] = bits;
          }

          n--;
        }
      }
    } // Reverse the first len bits of a code, using straightforward code (a
    // faster
    // method would use a table)
    // IN assertion: 1 <= len <= 15


    function bi_reverse(code, // the value to invert
    len // its bit length
    ) {
      var res = 0;

      do {
        res |= code & 1;
        code >>>= 1;
        res <<= 1;
      } while (--len > 0);

      return res >>> 1;
    } // Generate the codes for a given tree and bit counts (which need not be
    // optimal).
    // IN assertion: the array bl_count contains the bit length statistics for
    // the given tree and the field len is set for all tree elements.
    // OUT assertion: the field code is set for all tree elements of non
    // zero code length.


    function gen_codes(tree, // the tree to decorate
    max_code, // largest code with non zero frequency
    bl_count // number of codes at each bit length
    ) {
      var next_code = []; // next code value for each
      // bit length

      var code = 0; // running code value

      var bits; // bit index

      var n; // code index

      var len; // The distribution counts are first used to generate the code values
      // without bit reversal.

      for (bits = 1; bits <= MAX_BITS$1; bits++) {
        next_code[bits] = code = code + bl_count[bits - 1] << 1;
      } // Check that the bit counts in bl_count are consistent. The last code
      // must be all ones.
      // Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
      // "inconsistent bit counts");
      // Tracev((stderr,"gen_codes: max_code %d ", max_code));


      for (n = 0; n <= max_code; n++) {
        len = tree[n * 2 + 1];
        if (len === 0) continue; // Now reverse the bits

        tree[n * 2] = bi_reverse(next_code[len]++, len);
      }
    } // Construct one Huffman tree and assigns the code bit strings and lengths.
    // Update the total bit length for the current block.
    // IN assertion: the field freq is set for all tree elements.
    // OUT assertions: the fields len and code are set to the optimal bit length
    // and corresponding code. The length opt_len is updated; static_len is
    // also updated if stree is not null. The field max_code is set.


    that.build_tree = function (s) {
      var tree = that.dyn_tree;
      var stree = that.stat_desc.static_tree;
      var elems = that.stat_desc.elems;
      var n, m; // iterate over heap elements

      var max_code = -1; // largest code with non zero frequency

      var node; // new node being created
      // Construct the initial heap, with least frequent element in
      // heap[1]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
      // heap[0] is not used.

      s.heap_len = 0;
      s.heap_max = HEAP_SIZE;

      for (n = 0; n < elems; n++) {
        if (tree[n * 2] !== 0) {
          s.heap[++s.heap_len] = max_code = n;
          s.depth[n] = 0;
        } else {
          tree[n * 2 + 1] = 0;
        }
      } // The pkzip format requires that at least one distance code exists,
      // and that at least one bit should be sent even if there is only one
      // possible code. So to avoid special checks later on we force at least
      // two codes of non zero frequency.


      while (s.heap_len < 2) {
        node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
        tree[node * 2] = 1;
        s.depth[node] = 0;
        s.opt_len--;
        if (stree) s.static_len -= stree[node * 2 + 1]; // node is 0 or 1 so it does not have extra bits
      }

      that.max_code = max_code; // The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
      // establish sub-heaps of increasing lengths:

      for (n = Math.floor(s.heap_len / 2); n >= 1; n--) {
        s.pqdownheap(tree, n);
      } // Construct the Huffman tree by repeatedly combining the least two
      // frequent nodes.


      node = elems; // next internal node of the tree

      do {
        // n = node of least frequency
        n = s.heap[1];
        s.heap[1] = s.heap[s.heap_len--];
        s.pqdownheap(tree, 1);
        m = s.heap[1]; // m = node of next least frequency

        s.heap[--s.heap_max] = n; // keep the nodes sorted by frequency

        s.heap[--s.heap_max] = m; // Create a new node father of n and m

        tree[node * 2] = tree[n * 2] + tree[m * 2];
        s.depth[node] = Math.max(s.depth[n], s.depth[m]) + 1;
        tree[n * 2 + 1] = tree[m * 2 + 1] = node; // and insert the new node in the heap

        s.heap[1] = node++;
        s.pqdownheap(tree, 1);
      } while (s.heap_len >= 2);

      s.heap[--s.heap_max] = s.heap[1]; // At this point, the fields freq and dad are set. We can now
      // generate the bit lengths.

      gen_bitlen(s); // The field len is now set, we can generate the bit codes

      gen_codes(tree, that.max_code, s.bl_count);
    };
  }

  Tree._length_code = (_ref4 = [0, 1, 2, 3, 4, 5, 6, 7]).concat.apply(_ref4, _toConsumableArray(extractArray([[2, 8], [2, 9], [2, 10], [2, 11], [4, 12], [4, 13], [4, 14], [4, 15], [8, 16], [8, 17], [8, 18], [8, 19], [16, 20], [16, 21], [16, 22], [16, 23], [32, 24], [32, 25], [32, 26], [31, 27], [1, 28]])));
  Tree.base_length = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 0];
  Tree.base_dist = [0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144, 8192, 12288, 16384, 24576]; // Mapping from a distance to a distance code. dist is the distance - 1 and
  // must not have side effects. _dist_code[256] and _dist_code[257] are never
  // used.

  Tree.d_code = function (dist) {
    return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
  }; // extra bits for each length code


  Tree.extra_lbits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]; // extra bits for each distance code

  Tree.extra_dbits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]; // extra bits for each bit length code

  Tree.extra_blbits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];
  Tree.bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]; // StaticTree

  function StaticTree(static_tree, extra_bits, extra_base, elems, max_length) {
    var that = this;
    that.static_tree = static_tree;
    that.extra_bits = extra_bits;
    that.extra_base = extra_base;
    that.elems = elems;
    that.max_length = max_length;
  }

  StaticTree.static_ltree = [12, 8, 140, 8, 76, 8, 204, 8, 44, 8, 172, 8, 108, 8, 236, 8, 28, 8, 156, 8, 92, 8, 220, 8, 60, 8, 188, 8, 124, 8, 252, 8, 2, 8, 130, 8, 66, 8, 194, 8, 34, 8, 162, 8, 98, 8, 226, 8, 18, 8, 146, 8, 82, 8, 210, 8, 50, 8, 178, 8, 114, 8, 242, 8, 10, 8, 138, 8, 74, 8, 202, 8, 42, 8, 170, 8, 106, 8, 234, 8, 26, 8, 154, 8, 90, 8, 218, 8, 58, 8, 186, 8, 122, 8, 250, 8, 6, 8, 134, 8, 70, 8, 198, 8, 38, 8, 166, 8, 102, 8, 230, 8, 22, 8, 150, 8, 86, 8, 214, 8, 54, 8, 182, 8, 118, 8, 246, 8, 14, 8, 142, 8, 78, 8, 206, 8, 46, 8, 174, 8, 110, 8, 238, 8, 30, 8, 158, 8, 94, 8, 222, 8, 62, 8, 190, 8, 126, 8, 254, 8, 1, 8, 129, 8, 65, 8, 193, 8, 33, 8, 161, 8, 97, 8, 225, 8, 17, 8, 145, 8, 81, 8, 209, 8, 49, 8, 177, 8, 113, 8, 241, 8, 9, 8, 137, 8, 73, 8, 201, 8, 41, 8, 169, 8, 105, 8, 233, 8, 25, 8, 153, 8, 89, 8, 217, 8, 57, 8, 185, 8, 121, 8, 249, 8, 5, 8, 133, 8, 69, 8, 197, 8, 37, 8, 165, 8, 101, 8, 229, 8, 21, 8, 149, 8, 85, 8, 213, 8, 53, 8, 181, 8, 117, 8, 245, 8, 13, 8, 141, 8, 77, 8, 205, 8, 45, 8, 173, 8, 109, 8, 237, 8, 29, 8, 157, 8, 93, 8, 221, 8, 61, 8, 189, 8, 125, 8, 253, 8, 19, 9, 275, 9, 147, 9, 403, 9, 83, 9, 339, 9, 211, 9, 467, 9, 51, 9, 307, 9, 179, 9, 435, 9, 115, 9, 371, 9, 243, 9, 499, 9, 11, 9, 267, 9, 139, 9, 395, 9, 75, 9, 331, 9, 203, 9, 459, 9, 43, 9, 299, 9, 171, 9, 427, 9, 107, 9, 363, 9, 235, 9, 491, 9, 27, 9, 283, 9, 155, 9, 411, 9, 91, 9, 347, 9, 219, 9, 475, 9, 59, 9, 315, 9, 187, 9, 443, 9, 123, 9, 379, 9, 251, 9, 507, 9, 7, 9, 263, 9, 135, 9, 391, 9, 71, 9, 327, 9, 199, 9, 455, 9, 39, 9, 295, 9, 167, 9, 423, 9, 103, 9, 359, 9, 231, 9, 487, 9, 23, 9, 279, 9, 151, 9, 407, 9, 87, 9, 343, 9, 215, 9, 471, 9, 55, 9, 311, 9, 183, 9, 439, 9, 119, 9, 375, 9, 247, 9, 503, 9, 15, 9, 271, 9, 143, 9, 399, 9, 79, 9, 335, 9, 207, 9, 463, 9, 47, 9, 303, 9, 175, 9, 431, 9, 111, 9, 367, 9, 239, 9, 495, 9, 31, 9, 287, 9, 159, 9, 415, 9, 95, 9, 351, 9, 223, 9, 479, 9, 63, 9, 319, 9, 191, 9, 447, 9, 127, 9, 383, 9, 255, 9, 511, 9, 0, 7, 64, 7, 32, 7, 96, 7, 16, 7, 80, 7, 48, 7, 112, 7, 8, 7, 72, 7, 40, 7, 104, 7, 24, 7, 88, 7, 56, 7, 120, 7, 4, 7, 68, 7, 36, 7, 100, 7, 20, 7, 84, 7, 52, 7, 116, 7, 3, 8, 131, 8, 67, 8, 195, 8, 35, 8, 163, 8, 99, 8, 227, 8];
  StaticTree.static_dtree = [0, 5, 16, 5, 8, 5, 24, 5, 4, 5, 20, 5, 12, 5, 28, 5, 2, 5, 18, 5, 10, 5, 26, 5, 6, 5, 22, 5, 14, 5, 30, 5, 1, 5, 17, 5, 9, 5, 25, 5, 5, 5, 21, 5, 13, 5, 29, 5, 3, 5, 19, 5, 11, 5, 27, 5, 7, 5, 23, 5];
  StaticTree.static_l_desc = new StaticTree(StaticTree.static_ltree, Tree.extra_lbits, LITERALS + 1, L_CODES, MAX_BITS$1);
  StaticTree.static_d_desc = new StaticTree(StaticTree.static_dtree, Tree.extra_dbits, 0, D_CODES, MAX_BITS$1);
  StaticTree.static_bl_desc = new StaticTree(null, Tree.extra_blbits, 0, BL_CODES, MAX_BL_BITS); // Deflate

  var MAX_MEM_LEVEL = 9;
  var DEF_MEM_LEVEL = 8;

  function Config(good_length, max_lazy, nice_length, max_chain, func) {
    var that = this;
    that.good_length = good_length;
    that.max_lazy = max_lazy;
    that.nice_length = nice_length;
    that.max_chain = max_chain;
    that.func = func;
  }

  var STORED$1 = 0;
  var FAST = 1;
  var SLOW = 2;
  var config_table = [new Config(0, 0, 0, 0, STORED$1), new Config(4, 4, 8, 4, FAST), new Config(4, 5, 16, 8, FAST), new Config(4, 6, 32, 32, FAST), new Config(4, 4, 16, 16, SLOW), new Config(8, 16, 32, 32, SLOW), new Config(8, 16, 128, 128, SLOW), new Config(8, 32, 128, 256, SLOW), new Config(32, 128, 258, 1024, SLOW), new Config(32, 258, 258, 4096, SLOW)];
  var z_errmsg = ["need dictionary", // Z_NEED_DICT
  // 2
  "stream end", // Z_STREAM_END 1
  "", // Z_OK 0
  "", // Z_ERRNO (-1)
  "stream error", // Z_STREAM_ERROR (-2)
  "data error", // Z_DATA_ERROR (-3)
  "", // Z_MEM_ERROR (-4)
  "buffer error", // Z_BUF_ERROR (-5)
  "", // Z_VERSION_ERROR (-6)
  ""]; // block not completed, need more input or more output

  var NeedMore = 0; // block flush performed

  var BlockDone = 1; // finish started, need only more output at next deflate

  var FinishStarted = 2; // finish done, accept no more input or output

  var FinishDone = 3; // preset dictionary flag in zlib header

  var PRESET_DICT$1 = 0x20;
  var INIT_STATE = 42;
  var BUSY_STATE = 113;
  var FINISH_STATE = 666; // The deflate compression method

  var Z_DEFLATED$1 = 8;
  var STORED_BLOCK = 0;
  var STATIC_TREES = 1;
  var DYN_TREES = 2;
  var MIN_MATCH = 3;
  var MAX_MATCH = 258;
  var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;

  function smaller(tree, n, m, depth) {
    var tn2 = tree[n * 2];
    var tm2 = tree[m * 2];
    return tn2 < tm2 || tn2 == tm2 && depth[n] <= depth[m];
  }

  function Deflate$1() {
    var that = this;
    var strm; // pointer back to this zlib stream

    var status; // as the name implies
    // pending_buf; // output still pending

    var pending_buf_size; // size of pending_buf
    // pending_out; // next pending byte to output to the stream
    // pending; // nb of bytes in the pending buffer
    // dist_buf; // buffer for distances
    // lc_buf; // buffer for literals or lengths
    // To simplify the code, dist_buf and lc_buf have the same number of elements.
    // To use different lengths, an extra flag array would be necessary.

    var last_flush; // value of flush param for previous deflate call

    var w_size; // LZ77 window size (32K by default)

    var w_bits; // log2(w_size) (8..16)

    var w_mask; // w_size - 1

    var window; // Sliding window. Input bytes are read into the second half of the window,
    // and move to the first half later to keep a dictionary of at least wSize
    // bytes. With this organization, matches are limited to a distance of
    // wSize-MAX_MATCH bytes, but this ensures that IO is always
    // performed with a length multiple of the block size. Also, it limits
    // the window size to 64K, which is quite useful on MSDOS.
    // To do: use the user input buffer as sliding window.

    var window_size; // Actual size of window: 2*wSize, except when the user input buffer
    // is directly used as sliding window.

    var prev; // Link to older string with same hash index. To limit the size of this
    // array to 64K, this link is maintained only for the last 32K strings.
    // An index in this array is thus a window index modulo 32K.

    var head; // Heads of the hash chains or NIL.

    var ins_h; // hash index of string to be inserted

    var hash_size; // number of elements in hash table

    var hash_bits; // log2(hash_size)

    var hash_mask; // hash_size-1
    // Number of bits by which ins_h must be shifted at each input
    // step. It must be such that after MIN_MATCH steps, the oldest
    // byte no longer takes part in the hash key, that is:
    // hash_shift * MIN_MATCH >= hash_bits

    var hash_shift; // Window position at the beginning of the current output block. Gets
    // negative when the window is moved backwards.

    var block_start;
    var match_length; // length of best match

    var prev_match; // previous match

    var match_available; // set if previous match exists

    var strstart; // start of string to insert

    var match_start; // start of matching string

    var lookahead; // number of valid bytes ahead in window
    // Length of the best match at previous step. Matches not greater than this
    // are discarded. This is used in the lazy match evaluation.

    var prev_length; // To speed up deflation, hash chains are never searched beyond this
    // length. A higher limit improves compression ratio but degrades the speed.

    var max_chain_length; // Attempt to find a better match only when the current match is strictly
    // smaller than this value. This mechanism is used only for compression
    // levels >= 4.

    var max_lazy_match; // Insert new strings in the hash table only if the match length is not
    // greater than this length. This saves time but degrades compression.
    // max_insert_length is used only for compression levels <= 3.

    var level; // compression level (1..9)

    var strategy; // favor or force Huffman coding
    // Use a faster search when the previous match is longer than this

    var good_match; // Stop searching when current match exceeds this

    var nice_match;
    var dyn_ltree; // literal and length tree

    var dyn_dtree; // distance tree

    var bl_tree; // Huffman tree for bit lengths

    var l_desc = new Tree(); // desc for literal tree

    var d_desc = new Tree(); // desc for distance tree

    var bl_desc = new Tree(); // desc for bit length tree
    // that.heap_len; // number of elements in the heap
    // that.heap_max; // element of largest frequency
    // The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
    // The same heap array is used to build all trees.
    // Depth of each subtree used as tie breaker for trees of equal frequency

    that.depth = []; // Size of match buffer for literals/lengths. There are 4 reasons for
    // limiting lit_bufsize to 64K:
    // - frequencies can be kept in 16 bit counters
    // - if compression is not successful for the first block, all input
    // data is still in the window so we can still emit a stored block even
    // when input comes from standard input. (This can also be done for
    // all blocks if lit_bufsize is not greater than 32K.)
    // - if compression is not successful for a file smaller than 64K, we can
    // even emit a stored file instead of a stored block (saving 5 bytes).
    // This is applicable only for zip (not gzip or zlib).
    // - creating new Huffman trees less frequently may not provide fast
    // adaptation to changes in the input data statistics. (Take for
    // example a binary file with poorly compressible code followed by
    // a highly compressible string table.) Smaller buffer sizes give
    // fast adaptation but have of course the overhead of transmitting
    // trees more frequently.
    // - I can't count above 4

    var lit_bufsize;
    var last_lit; // running index in dist_buf and lc_buf
    // that.opt_len; // bit length of current block with optimal trees
    // that.static_len; // bit length of current block with static trees

    var matches; // number of string matches in current block

    var last_eob_len; // bit length of EOB code for last block
    // Output buffer. bits are inserted starting at the bottom (least
    // significant bits).

    var bi_buf; // Number of valid bits in bi_buf. All bits above the last valid bit
    // are always zero.

    var bi_valid; // number of codes at each bit length for an optimal tree

    that.bl_count = []; // heap used to build the Huffman trees

    that.heap = [];
    dyn_ltree = [];
    dyn_dtree = [];
    bl_tree = [];

    function lm_init() {
      window_size = 2 * w_size;
      head[hash_size - 1] = 0;

      for (var i = 0; i < hash_size - 1; i++) {
        head[i] = 0;
      } // Set the default configuration parameters:


      max_lazy_match = config_table[level].max_lazy;
      good_match = config_table[level].good_length;
      nice_match = config_table[level].nice_length;
      max_chain_length = config_table[level].max_chain;
      strstart = 0;
      block_start = 0;
      lookahead = 0;
      match_length = prev_length = MIN_MATCH - 1;
      match_available = 0;
      ins_h = 0;
    }

    function init_block() {
      var i; // Initialize the trees.

      for (i = 0; i < L_CODES; i++) {
        dyn_ltree[i * 2] = 0;
      }

      for (i = 0; i < D_CODES; i++) {
        dyn_dtree[i * 2] = 0;
      }

      for (i = 0; i < BL_CODES; i++) {
        bl_tree[i * 2] = 0;
      }

      dyn_ltree[END_BLOCK * 2] = 1;
      that.opt_len = that.static_len = 0;
      last_lit = matches = 0;
    } // Initialize the tree data structures for a new zlib stream.


    function tr_init() {
      l_desc.dyn_tree = dyn_ltree;
      l_desc.stat_desc = StaticTree.static_l_desc;
      d_desc.dyn_tree = dyn_dtree;
      d_desc.stat_desc = StaticTree.static_d_desc;
      bl_desc.dyn_tree = bl_tree;
      bl_desc.stat_desc = StaticTree.static_bl_desc;
      bi_buf = 0;
      bi_valid = 0;
      last_eob_len = 8; // enough lookahead for inflate
      // Initialize the first block of the first file:

      init_block();
    } // Restore the heap property by moving down the tree starting at node k,
    // exchanging a node with the smallest of its two sons if necessary,
    // stopping
    // when the heap property is re-established (each father smaller than its
    // two sons).


    that.pqdownheap = function (tree, // the tree to restore
    k // node to move down
    ) {
      var heap = that.heap;
      var v = heap[k];
      var j = k << 1; // left son of k

      while (j <= that.heap_len) {
        // Set j to the smallest of the two sons:
        if (j < that.heap_len && smaller(tree, heap[j + 1], heap[j], that.depth)) {
          j++;
        } // Exit if v is smaller than both sons


        if (smaller(tree, v, heap[j], that.depth)) break; // Exchange v with the smallest son

        heap[k] = heap[j];
        k = j; // And continue down the tree, setting j to the left son of k

        j <<= 1;
      }

      heap[k] = v;
    }; // Scan a literal or distance tree to determine the frequencies of the codes
    // in the bit length tree.


    function scan_tree(tree, // the tree to be scanned
    max_code // and its largest code of non zero frequency
    ) {
      var prevlen = -1; // last emitted length

      var curlen; // length of current code

      var nextlen = tree[0 * 2 + 1]; // length of next code

      var count = 0; // repeat count of the current code

      var max_count = 7; // max repeat count

      var min_count = 4; // min repeat count

      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      }

      tree[(max_code + 1) * 2 + 1] = 0xffff; // guard

      for (var n = 0; n <= max_code; n++) {
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];

        if (++count < max_count && curlen == nextlen) {
          continue;
        } else if (count < min_count) {
          bl_tree[curlen * 2] += count;
        } else if (curlen !== 0) {
          if (curlen != prevlen) bl_tree[curlen * 2]++;
          bl_tree[REP_3_6 * 2]++;
        } else if (count <= 10) {
          bl_tree[REPZ_3_10 * 2]++;
        } else {
          bl_tree[REPZ_11_138 * 2]++;
        }

        count = 0;
        prevlen = curlen;

        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        } else if (curlen == nextlen) {
          max_count = 6;
          min_count = 3;
        } else {
          max_count = 7;
          min_count = 4;
        }
      }
    } // Construct the Huffman tree for the bit lengths and return the index in
    // bl_order of the last bit length code to send.


    function build_bl_tree() {
      var max_blindex; // index of last bit length code of non zero freq
      // Determine the bit length frequencies for literal and distance trees

      scan_tree(dyn_ltree, l_desc.max_code);
      scan_tree(dyn_dtree, d_desc.max_code); // Build the bit length tree:

      bl_desc.build_tree(that); // opt_len now includes the length of the tree representations, except
      // the lengths of the bit lengths codes and the 5+5+4 bits for the
      // counts.
      // Determine the number of bit length codes to send. The pkzip format
      // requires that at least 4 bit length codes be sent. (appnote.txt says
      // 3 but the actual value used is 4.)

      for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
        if (bl_tree[Tree.bl_order[max_blindex] * 2 + 1] !== 0) break;
      } // Update opt_len to include the bit length tree and counts


      that.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
      return max_blindex;
    } // Output a byte on the stream.
    // IN assertion: there is enough room in pending_buf.


    function put_byte(p) {
      that.pending_buf[that.pending++] = p;
    }

    function put_short(w) {
      put_byte(w & 0xff);
      put_byte(w >>> 8 & 0xff);
    }

    function putShortMSB(b) {
      put_byte(b >> 8 & 0xff);
      put_byte(b & 0xff & 0xff);
    }

    function send_bits(value, length) {
      var val;
      var len = length;

      if (bi_valid > Buf_size - len) {
        val = value; // bi_buf |= (val << bi_valid);

        bi_buf |= val << bi_valid & 0xffff;
        put_short(bi_buf);
        bi_buf = val >>> Buf_size - bi_valid;
        bi_valid += len - Buf_size;
      } else {
        // bi_buf |= (value) << bi_valid;
        bi_buf |= value << bi_valid & 0xffff;
        bi_valid += len;
      }
    }

    function send_code(c, tree) {
      var c2 = c * 2;
      send_bits(tree[c2] & 0xffff, tree[c2 + 1] & 0xffff);
    } // Send a literal or distance tree in compressed form, using the codes in
    // bl_tree.


    function send_tree(tree, // the tree to be sent
    max_code // and its largest code of non zero frequency
    ) {
      var n; // iterates over all tree elements

      var prevlen = -1; // last emitted length

      var curlen; // length of current code

      var nextlen = tree[0 * 2 + 1]; // length of next code

      var count = 0; // repeat count of the current code

      var max_count = 7; // max repeat count

      var min_count = 4; // min repeat count

      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      }

      for (n = 0; n <= max_code; n++) {
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];

        if (++count < max_count && curlen == nextlen) {
          continue;
        } else if (count < min_count) {
          do {
            send_code(curlen, bl_tree);
          } while (--count !== 0);
        } else if (curlen !== 0) {
          if (curlen != prevlen) {
            send_code(curlen, bl_tree);
            count--;
          }

          send_code(REP_3_6, bl_tree);
          send_bits(count - 3, 2);
        } else if (count <= 10) {
          send_code(REPZ_3_10, bl_tree);
          send_bits(count - 3, 3);
        } else {
          send_code(REPZ_11_138, bl_tree);
          send_bits(count - 11, 7);
        }

        count = 0;
        prevlen = curlen;

        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        } else if (curlen == nextlen) {
          max_count = 6;
          min_count = 3;
        } else {
          max_count = 7;
          min_count = 4;
        }
      }
    } // Send the header for a block using dynamic Huffman trees: the counts, the
    // lengths of the bit length codes, the literal tree and the distance tree.
    // IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.


    function send_all_trees(lcodes, dcodes, blcodes) {
      var rank; // index in bl_order

      send_bits(lcodes - 257, 5); // not +255 as stated in appnote.txt

      send_bits(dcodes - 1, 5);
      send_bits(blcodes - 4, 4); // not -3 as stated in appnote.txt

      for (rank = 0; rank < blcodes; rank++) {
        send_bits(bl_tree[Tree.bl_order[rank] * 2 + 1], 3);
      }

      send_tree(dyn_ltree, lcodes - 1); // literal tree

      send_tree(dyn_dtree, dcodes - 1); // distance tree
    } // Flush the bit buffer, keeping at most 7 bits in it.


    function bi_flush() {
      if (bi_valid == 16) {
        put_short(bi_buf);
        bi_buf = 0;
        bi_valid = 0;
      } else if (bi_valid >= 8) {
        put_byte(bi_buf & 0xff);
        bi_buf >>>= 8;
        bi_valid -= 8;
      }
    } // Send one empty static block to give enough lookahead for inflate.
    // This takes 10 bits, of which 7 may remain in the bit buffer.
    // The current inflate code requires 9 bits of lookahead. If the
    // last two codes for the previous block (real code plus EOB) were coded
    // on 5 bits or less, inflate may have only 5+3 bits of lookahead to decode
    // the last real code. In this case we send two empty static blocks instead
    // of one. (There are no problems if the previous block is stored or fixed.)
    // To simplify the code, we assume the worst case of last real code encoded
    // on one bit only.


    function _tr_align() {
      send_bits(STATIC_TREES << 1, 3);
      send_code(END_BLOCK, StaticTree.static_ltree);
      bi_flush(); // Of the 10 bits for the empty block, we have already sent
      // (10 - bi_valid) bits. The lookahead for the last real code (before
      // the EOB of the previous block) was thus at least one plus the length
      // of the EOB plus what we have just sent of the empty static block.

      if (1 + last_eob_len + 10 - bi_valid < 9) {
        send_bits(STATIC_TREES << 1, 3);
        send_code(END_BLOCK, StaticTree.static_ltree);
        bi_flush();
      }

      last_eob_len = 7;
    } // Save the match info and tally the frequency counts. Return true if
    // the current block must be flushed.


    function _tr_tally(dist, // distance of matched string
    lc // match length-MIN_MATCH or unmatched char (if dist==0)
    ) {
      var out_length, in_length, dcode;
      that.dist_buf[last_lit] = dist;
      that.lc_buf[last_lit] = lc & 0xff;
      last_lit++;

      if (dist === 0) {
        // lc is the unmatched char
        dyn_ltree[lc * 2]++;
      } else {
        matches++; // Here, lc is the match length - MIN_MATCH

        dist--; // dist = match distance - 1

        dyn_ltree[(Tree._length_code[lc] + LITERALS + 1) * 2]++;
        dyn_dtree[Tree.d_code(dist) * 2]++;
      }

      if ((last_lit & 0x1fff) === 0 && level > 2) {
        // Compute an upper bound for the compressed length
        out_length = last_lit * 8;
        in_length = strstart - block_start;

        for (dcode = 0; dcode < D_CODES; dcode++) {
          out_length += dyn_dtree[dcode * 2] * (5 + Tree.extra_dbits[dcode]);
        }

        out_length >>>= 3;
        if (matches < Math.floor(last_lit / 2) && out_length < Math.floor(in_length / 2)) return true;
      }

      return last_lit == lit_bufsize - 1; // We avoid equality with lit_bufsize because of wraparound at 64K
      // on 16 bit machines and because stored blocks are restricted to
      // 64K-1 bytes.
    } // Send the block data compressed using the given Huffman trees


    function compress_block(ltree, dtree) {
      var dist; // distance of matched string

      var lc; // match length or unmatched char (if dist === 0)

      var lx = 0; // running index in dist_buf and lc_buf

      var code; // the code to send

      var extra; // number of extra bits to send

      if (last_lit !== 0) {
        do {
          dist = that.dist_buf[lx];
          lc = that.lc_buf[lx];
          lx++;

          if (dist === 0) {
            send_code(lc, ltree); // send a literal byte
          } else {
            // Here, lc is the match length - MIN_MATCH
            code = Tree._length_code[lc];
            send_code(code + LITERALS + 1, ltree); // send the length
            // code

            extra = Tree.extra_lbits[code];

            if (extra !== 0) {
              lc -= Tree.base_length[code];
              send_bits(lc, extra); // send the extra length bits
            }

            dist--; // dist is now the match distance - 1

            code = Tree.d_code(dist);
            send_code(code, dtree); // send the distance code

            extra = Tree.extra_dbits[code];

            if (extra !== 0) {
              dist -= Tree.base_dist[code];
              send_bits(dist, extra); // send the extra distance bits
            }
          } // literal or match pair ?

        } while (lx < last_lit);
      }

      send_code(END_BLOCK, ltree);
      last_eob_len = ltree[END_BLOCK * 2 + 1];
    } // Flush the bit buffer and align the output on a byte boundary


    function bi_windup() {
      if (bi_valid > 8) {
        put_short(bi_buf);
      } else if (bi_valid > 0) {
        put_byte(bi_buf & 0xff);
      }

      bi_buf = 0;
      bi_valid = 0;
    } // Copy a stored block, storing first the length and its
    // one's complement if requested.


    function copy_block(buf, // the input data
    len, // its length
    header // true if block header must be written
    ) {
      bi_windup(); // align on byte boundary

      last_eob_len = 8; // enough lookahead for inflate

      if (header) {
        put_short(len);
        put_short(~len);
      }

      that.pending_buf.set(window.subarray(buf, buf + len), that.pending);
      that.pending += len;
    } // Send a stored block


    function _tr_stored_block(buf, // input block
    stored_len, // length of input block
    eof // true if this is the last block for a file
    ) {
      send_bits((STORED_BLOCK << 1) + (eof ? 1 : 0), 3); // send block type

      copy_block(buf, stored_len, true); // with header
    } // Determine the best encoding for the current block: dynamic trees, static
    // trees or store, and output the encoded block to the zip file.


    function _tr_flush_block(buf, // input block, or NULL if too old
    stored_len, // length of input block
    eof // true if this is the last block for a file
    ) {
      var opt_lenb, static_lenb; // opt_len and static_len in bytes

      var max_blindex = 0; // index of last bit length code of non zero freq
      // Build the Huffman trees unless a stored block is forced

      if (level > 0) {
        // Construct the literal and distance trees
        l_desc.build_tree(that);
        d_desc.build_tree(that); // At this point, opt_len and static_len are the total bit lengths
        // of
        // the compressed block data, excluding the tree representations.
        // Build the bit length tree for the above two trees, and get the
        // index
        // in bl_order of the last bit length code to send.

        max_blindex = build_bl_tree(); // Determine the best encoding. Compute first the block length in
        // bytes

        opt_lenb = that.opt_len + 3 + 7 >>> 3;
        static_lenb = that.static_len + 3 + 7 >>> 3;
        if (static_lenb <= opt_lenb) opt_lenb = static_lenb;
      } else {
        opt_lenb = static_lenb = stored_len + 5; // force a stored block
      }

      if (stored_len + 4 <= opt_lenb && buf != -1) {
        // 4: two words for the lengths
        // The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
        // Otherwise we can't have processed more than WSIZE input bytes
        // since
        // the last block flush, because compression would have been
        // successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
        // transform a block into a stored block.
        _tr_stored_block(buf, stored_len, eof);
      } else if (static_lenb == opt_lenb) {
        send_bits((STATIC_TREES << 1) + (eof ? 1 : 0), 3);
        compress_block(StaticTree.static_ltree, StaticTree.static_dtree);
      } else {
        send_bits((DYN_TREES << 1) + (eof ? 1 : 0), 3);
        send_all_trees(l_desc.max_code + 1, d_desc.max_code + 1, max_blindex + 1);
        compress_block(dyn_ltree, dyn_dtree);
      } // The above check is made mod 2^32, for files larger than 512 MB
      // and uLong implemented on 32 bits.


      init_block();

      if (eof) {
        bi_windup();
      }
    }

    function flush_block_only(eof) {
      _tr_flush_block(block_start >= 0 ? block_start : -1, strstart - block_start, eof);

      block_start = strstart;
      strm.flush_pending();
    } // Fill the window when the lookahead becomes insufficient.
    // Updates strstart and lookahead.
    //
    // IN assertion: lookahead < MIN_LOOKAHEAD
    // OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
    // At least one byte has been read, or avail_in === 0; reads are
    // performed for at least two bytes (required for the zip translate_eol
    // option -- not supported here).


    function fill_window() {
      var n, m;
      var p;
      var more; // Amount of free space at the end of the window.

      do {
        more = window_size - lookahead - strstart; // Deal with !@#$% 64K limit:

        if (more === 0 && strstart === 0 && lookahead === 0) {
          more = w_size;
        } else if (more == -1) {
          // Very unlikely, but possible on 16 bit machine if strstart ==
          // 0
          // and lookahead == 1 (input done one byte at time)
          more--; // If the window is almost full and there is insufficient
          // lookahead,
          // move the upper half to the lower one to make room in the
          // upper half.
        } else if (strstart >= w_size + w_size - MIN_LOOKAHEAD) {
          window.set(window.subarray(w_size, w_size + w_size), 0);
          match_start -= w_size;
          strstart -= w_size; // we now have strstart >= MAX_DIST

          block_start -= w_size; // Slide the hash table (could be avoided with 32 bit values
          // at the expense of memory usage). We slide even when level ==
          // 0
          // to keep the hash table consistent if we switch back to level
          // > 0
          // later. (Using level 0 permanently is not an optimal usage of
          // zlib, so we don't care about this pathological case.)

          n = hash_size;
          p = n;

          do {
            m = head[--p] & 0xffff;
            head[p] = m >= w_size ? m - w_size : 0;
          } while (--n !== 0);

          n = w_size;
          p = n;

          do {
            m = prev[--p] & 0xffff;
            prev[p] = m >= w_size ? m - w_size : 0; // If n is not on any hash chain, prev[n] is garbage but
            // its value will never be used.
          } while (--n !== 0);

          more += w_size;
        }

        if (strm.avail_in === 0) return; // If there was no sliding:
        // strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
        // more == window_size - lookahead - strstart
        // => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
        // => more >= window_size - 2*WSIZE + 2
        // In the BIG_MEM or MMAP case (not yet supported),
        // window_size == input_size + MIN_LOOKAHEAD &&
        // strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
        // Otherwise, window_size == 2*WSIZE so more >= 2.
        // If there was sliding, more >= WSIZE. So in all cases, more >= 2.

        n = strm.read_buf(window, strstart + lookahead, more);
        lookahead += n; // Initialize the hash value now that we have some input:

        if (lookahead >= MIN_MATCH) {
          ins_h = window[strstart] & 0xff;
          ins_h = (ins_h << hash_shift ^ window[strstart + 1] & 0xff) & hash_mask;
        } // If the whole input has less than MIN_MATCH bytes, ins_h is
        // garbage,
        // but this is not important since only literal bytes will be
        // emitted.

      } while (lookahead < MIN_LOOKAHEAD && strm.avail_in !== 0);
    } // Copy without compression as much as possible from the input stream,
    // return
    // the current block state.
    // This function does not insert new strings in the dictionary since
    // uncompressible data is probably not useful. This function is used
    // only for the level=0 compression option.
    // NOTE: this function should be optimized to avoid extra copying from
    // window to pending_buf.


    function deflate_stored(flush) {
      // Stored blocks are limited to 0xffff bytes, pending_buf is limited
      // to pending_buf_size, and each stored block has a 5 byte header:
      var max_block_size = 0xffff;
      var max_start;

      if (max_block_size > pending_buf_size - 5) {
        max_block_size = pending_buf_size - 5;
      } // Copy as much as possible from input to output:
      // eslint-disable-next-line no-constant-condition


      while (true) {
        // Fill the window as much as possible:
        if (lookahead <= 1) {
          fill_window();
          if (lookahead === 0 && flush == Z_NO_FLUSH$1) return NeedMore;
          if (lookahead === 0) break; // flush the current block
        }

        strstart += lookahead;
        lookahead = 0; // Emit a stored block if pending_buf will be full:

        max_start = block_start + max_block_size;

        if (strstart === 0 || strstart >= max_start) {
          // strstart === 0 is possible when wraparound on 16-bit machine
          lookahead = strstart - max_start;
          strstart = max_start;
          flush_block_only(false);
          if (strm.avail_out === 0) return NeedMore;
        } // Flush if we may have to slide, otherwise block_start may become
        // negative and the data will be gone:


        if (strstart - block_start >= w_size - MIN_LOOKAHEAD) {
          flush_block_only(false);
          if (strm.avail_out === 0) return NeedMore;
        }
      }

      flush_block_only(flush == Z_FINISH$1);
      if (strm.avail_out === 0) return flush == Z_FINISH$1 ? FinishStarted : NeedMore;
      return flush == Z_FINISH$1 ? FinishDone : BlockDone;
    }

    function longest_match(cur_match) {
      var chain_length = max_chain_length; // max hash chain length

      var scan = strstart; // current string

      var match; // matched string

      var len; // length of current match

      var best_len = prev_length; // best match length so far

      var limit = strstart > w_size - MIN_LOOKAHEAD ? strstart - (w_size - MIN_LOOKAHEAD) : 0;
      var _nice_match = nice_match; // Stop when cur_match becomes <= limit. To simplify the code,
      // we prevent matches with the string of window index 0.

      var wmask = w_mask;
      var strend = strstart + MAX_MATCH;
      var scan_end1 = window[scan + best_len - 1];
      var scan_end = window[scan + best_len]; // The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of
      // 16.
      // It is easy to get rid of this optimization if necessary.
      // Do not waste too much time if we already have a good match:

      if (prev_length >= good_match) {
        chain_length >>= 2;
      } // Do not look for matches beyond the end of the input. This is
      // necessary
      // to make deflate deterministic.


      if (_nice_match > lookahead) _nice_match = lookahead;

      do {
        match = cur_match; // Skip to next match if the match length cannot increase
        // or if the match length is less than 2:

        if (window[match + best_len] != scan_end || window[match + best_len - 1] != scan_end1 || window[match] != window[scan] || window[++match] != window[scan + 1]) continue; // The check at best_len-1 can be removed because it will be made
        // again later. (This heuristic is not always a win.)
        // It is not necessary to compare scan[2] and match[2] since they
        // are always equal when the other bytes match, given that
        // the hash keys are equal and that HASH_BITS >= 8.

        scan += 2;
        match++; // We check for insufficient lookahead only every 8th comparison;
        // the 256th check will be made at strstart+258.
        // eslint-disable-next-line no-empty

        do {} while (window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match] && scan < strend);

        len = MAX_MATCH - (strend - scan);
        scan = strend - MAX_MATCH;

        if (len > best_len) {
          match_start = cur_match;
          best_len = len;
          if (len >= _nice_match) break;
          scan_end1 = window[scan + best_len - 1];
          scan_end = window[scan + best_len];
        }
      } while ((cur_match = prev[cur_match & wmask] & 0xffff) > limit && --chain_length !== 0);

      if (best_len <= lookahead) return best_len;
      return lookahead;
    } // Compress as much as possible from the input stream, return the current
    // block state.
    // This function does not perform lazy evaluation of matches and inserts
    // new strings in the dictionary only for unmatched strings or for short
    // matches. It is used only for the fast compression options.


    function deflate_fast(flush) {
      // short hash_head = 0; // head of the hash chain
      var hash_head = 0; // head of the hash chain

      var bflush; // set if current block must be flushed
      // eslint-disable-next-line no-constant-condition

      while (true) {
        // Make sure that we always have enough lookahead, except
        // at the end of the input file. We need MAX_MATCH bytes
        // for the next match, plus MIN_MATCH bytes to insert the
        // string following the next match.
        if (lookahead < MIN_LOOKAHEAD) {
          fill_window();

          if (lookahead < MIN_LOOKAHEAD && flush == Z_NO_FLUSH$1) {
            return NeedMore;
          }

          if (lookahead === 0) break; // flush the current block
        } // Insert the string window[strstart .. strstart+2] in the
        // dictionary, and set hash_head to the head of the hash chain:


        if (lookahead >= MIN_MATCH) {
          ins_h = (ins_h << hash_shift ^ window[strstart + (MIN_MATCH - 1)] & 0xff) & hash_mask; // prev[strstart&w_mask]=hash_head=head[ins_h];

          hash_head = head[ins_h] & 0xffff;
          prev[strstart & w_mask] = head[ins_h];
          head[ins_h] = strstart;
        } // Find the longest match, discarding those <= prev_length.
        // At this point we have always match_length < MIN_MATCH


        if (hash_head !== 0 && (strstart - hash_head & 0xffff) <= w_size - MIN_LOOKAHEAD) {
          // To simplify the code, we prevent matches with the string
          // of window index 0 (in particular we have to avoid a match
          // of the string with itself at the start of the input file).
          if (strategy != Z_HUFFMAN_ONLY) {
            match_length = longest_match(hash_head);
          } // longest_match() sets match_start

        }

        if (match_length >= MIN_MATCH) {
          // check_match(strstart, match_start, match_length);
          bflush = _tr_tally(strstart - match_start, match_length - MIN_MATCH);
          lookahead -= match_length; // Insert new strings in the hash table only if the match length
          // is not too large. This saves time but degrades compression.

          if (match_length <= max_lazy_match && lookahead >= MIN_MATCH) {
            match_length--; // string at strstart already in hash table

            do {
              strstart++;
              ins_h = (ins_h << hash_shift ^ window[strstart + (MIN_MATCH - 1)] & 0xff) & hash_mask; // prev[strstart&w_mask]=hash_head=head[ins_h];

              hash_head = head[ins_h] & 0xffff;
              prev[strstart & w_mask] = head[ins_h];
              head[ins_h] = strstart; // strstart never exceeds WSIZE-MAX_MATCH, so there are
              // always MIN_MATCH bytes ahead.
            } while (--match_length !== 0);

            strstart++;
          } else {
            strstart += match_length;
            match_length = 0;
            ins_h = window[strstart] & 0xff;
            ins_h = (ins_h << hash_shift ^ window[strstart + 1] & 0xff) & hash_mask; // If lookahead < MIN_MATCH, ins_h is garbage, but it does
            // not
            // matter since it will be recomputed at next deflate call.
          }
        } else {
          // No match, output a literal byte
          bflush = _tr_tally(0, window[strstart] & 0xff);
          lookahead--;
          strstart++;
        }

        if (bflush) {
          flush_block_only(false);
          if (strm.avail_out === 0) return NeedMore;
        }
      }

      flush_block_only(flush == Z_FINISH$1);

      if (strm.avail_out === 0) {
        if (flush == Z_FINISH$1) return FinishStarted;else return NeedMore;
      }

      return flush == Z_FINISH$1 ? FinishDone : BlockDone;
    } // Same as above, but achieves better compression. We use a lazy
    // evaluation for matches: a match is finally adopted only if there is
    // no better match at the next window position.


    function deflate_slow(flush) {
      // short hash_head = 0; // head of hash chain
      var hash_head = 0; // head of hash chain

      var bflush; // set if current block must be flushed

      var max_insert; // Process the input block.
      // eslint-disable-next-line no-constant-condition

      while (true) {
        // Make sure that we always have enough lookahead, except
        // at the end of the input file. We need MAX_MATCH bytes
        // for the next match, plus MIN_MATCH bytes to insert the
        // string following the next match.
        if (lookahead < MIN_LOOKAHEAD) {
          fill_window();

          if (lookahead < MIN_LOOKAHEAD && flush == Z_NO_FLUSH$1) {
            return NeedMore;
          }

          if (lookahead === 0) break; // flush the current block
        } // Insert the string window[strstart .. strstart+2] in the
        // dictionary, and set hash_head to the head of the hash chain:


        if (lookahead >= MIN_MATCH) {
          ins_h = (ins_h << hash_shift ^ window[strstart + (MIN_MATCH - 1)] & 0xff) & hash_mask; // prev[strstart&w_mask]=hash_head=head[ins_h];

          hash_head = head[ins_h] & 0xffff;
          prev[strstart & w_mask] = head[ins_h];
          head[ins_h] = strstart;
        } // Find the longest match, discarding those <= prev_length.


        prev_length = match_length;
        prev_match = match_start;
        match_length = MIN_MATCH - 1;

        if (hash_head !== 0 && prev_length < max_lazy_match && (strstart - hash_head & 0xffff) <= w_size - MIN_LOOKAHEAD) {
          // To simplify the code, we prevent matches with the string
          // of window index 0 (in particular we have to avoid a match
          // of the string with itself at the start of the input file).
          if (strategy != Z_HUFFMAN_ONLY) {
            match_length = longest_match(hash_head);
          } // longest_match() sets match_start


          if (match_length <= 5 && (strategy == Z_FILTERED || match_length == MIN_MATCH && strstart - match_start > 4096)) {
            // If prev_match is also MIN_MATCH, match_start is garbage
            // but we will ignore the current match anyway.
            match_length = MIN_MATCH - 1;
          }
        } // If there was a match at the previous step and the current
        // match is not better, output the previous match:


        if (prev_length >= MIN_MATCH && match_length <= prev_length) {
          max_insert = strstart + lookahead - MIN_MATCH; // Do not insert strings in hash table beyond this.
          // check_match(strstart-1, prev_match, prev_length);

          bflush = _tr_tally(strstart - 1 - prev_match, prev_length - MIN_MATCH); // Insert in hash table all strings up to the end of the match.
          // strstart-1 and strstart are already inserted. If there is not
          // enough lookahead, the last two strings are not inserted in
          // the hash table.

          lookahead -= prev_length - 1;
          prev_length -= 2;

          do {
            if (++strstart <= max_insert) {
              ins_h = (ins_h << hash_shift ^ window[strstart + (MIN_MATCH - 1)] & 0xff) & hash_mask; // prev[strstart&w_mask]=hash_head=head[ins_h];

              hash_head = head[ins_h] & 0xffff;
              prev[strstart & w_mask] = head[ins_h];
              head[ins_h] = strstart;
            }
          } while (--prev_length !== 0);

          match_available = 0;
          match_length = MIN_MATCH - 1;
          strstart++;

          if (bflush) {
            flush_block_only(false);
            if (strm.avail_out === 0) return NeedMore;
          }
        } else if (match_available !== 0) {
          // If there was no match at the previous position, output a
          // single literal. If there was a match but the current match
          // is longer, truncate the previous match to a single literal.
          bflush = _tr_tally(0, window[strstart - 1] & 0xff);

          if (bflush) {
            flush_block_only(false);
          }

          strstart++;
          lookahead--;
          if (strm.avail_out === 0) return NeedMore;
        } else {
          // There is no previous match to compare with, wait for
          // the next step to decide.
          match_available = 1;
          strstart++;
          lookahead--;
        }
      }

      if (match_available !== 0) {
        bflush = _tr_tally(0, window[strstart - 1] & 0xff);
        match_available = 0;
      }

      flush_block_only(flush == Z_FINISH$1);

      if (strm.avail_out === 0) {
        if (flush == Z_FINISH$1) return FinishStarted;else return NeedMore;
      }

      return flush == Z_FINISH$1 ? FinishDone : BlockDone;
    }

    function deflateReset(strm) {
      strm.total_in = strm.total_out = 0;
      strm.msg = null; //

      that.pending = 0;
      that.pending_out = 0;
      status = BUSY_STATE;
      last_flush = Z_NO_FLUSH$1;
      tr_init();
      lm_init();
      return Z_OK$1;
    }

    that.deflateInit = function (strm, _level, bits, _method, memLevel, _strategy) {
      if (!_method) _method = Z_DEFLATED$1;
      if (!memLevel) memLevel = DEF_MEM_LEVEL;
      if (!_strategy) _strategy = Z_DEFAULT_STRATEGY; // byte[] my_version=ZLIB_VERSION;
      //
      // if (!version || version[0] != my_version[0]
      // || stream_size != sizeof(z_stream)) {
      // return Z_VERSION_ERROR;
      // }

      strm.msg = null;
      if (_level == Z_DEFAULT_COMPRESSION) _level = 6;

      if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || _method != Z_DEFLATED$1 || bits < 9 || bits > 15 || _level < 0 || _level > 9 || _strategy < 0 || _strategy > Z_HUFFMAN_ONLY) {
        return Z_STREAM_ERROR$1;
      }

      strm.dstate = that;
      w_bits = bits;
      w_size = 1 << w_bits;
      w_mask = w_size - 1;
      hash_bits = memLevel + 7;
      hash_size = 1 << hash_bits;
      hash_mask = hash_size - 1;
      hash_shift = Math.floor((hash_bits + MIN_MATCH - 1) / MIN_MATCH);
      window = new Uint8Array(w_size * 2);
      prev = [];
      head = [];
      lit_bufsize = 1 << memLevel + 6; // 16K elements by default

      that.pending_buf = new Uint8Array(lit_bufsize * 4);
      pending_buf_size = lit_bufsize * 4;
      that.dist_buf = new Uint16Array(lit_bufsize);
      that.lc_buf = new Uint8Array(lit_bufsize);
      level = _level;
      strategy = _strategy;
      return deflateReset(strm);
    };

    that.deflateEnd = function () {
      if (status != INIT_STATE && status != BUSY_STATE && status != FINISH_STATE) {
        return Z_STREAM_ERROR$1;
      } // Deallocate in reverse order of allocations:


      that.lc_buf = null;
      that.dist_buf = null;
      that.pending_buf = null;
      head = null;
      prev = null;
      window = null; // free

      that.dstate = null;
      return status == BUSY_STATE ? Z_DATA_ERROR$1 : Z_OK$1;
    };

    that.deflateParams = function (strm, _level, _strategy) {
      var err = Z_OK$1;

      if (_level == Z_DEFAULT_COMPRESSION) {
        _level = 6;
      }

      if (_level < 0 || _level > 9 || _strategy < 0 || _strategy > Z_HUFFMAN_ONLY) {
        return Z_STREAM_ERROR$1;
      }

      if (config_table[level].func != config_table[_level].func && strm.total_in !== 0) {
        // Flush the last buffer:
        err = strm.deflate(Z_PARTIAL_FLUSH);
      }

      if (level != _level) {
        level = _level;
        max_lazy_match = config_table[level].max_lazy;
        good_match = config_table[level].good_length;
        nice_match = config_table[level].nice_length;
        max_chain_length = config_table[level].max_chain;
      }

      strategy = _strategy;
      return err;
    };

    that.deflateSetDictionary = function (strm, dictionary, dictLength) {
      var length = dictLength;
      var n,
          index = 0;
      if (!dictionary || status != INIT_STATE) return Z_STREAM_ERROR$1;
      if (length < MIN_MATCH) return Z_OK$1;

      if (length > w_size - MIN_LOOKAHEAD) {
        length = w_size - MIN_LOOKAHEAD;
        index = dictLength - length; // use the tail of the dictionary
      }

      window.set(dictionary.subarray(index, index + length), 0);
      strstart = length;
      block_start = length; // Insert all strings in the hash table (except for the last two bytes).
      // s->lookahead stays null, so s->ins_h will be recomputed at the next
      // call of fill_window.

      ins_h = window[0] & 0xff;
      ins_h = (ins_h << hash_shift ^ window[1] & 0xff) & hash_mask;

      for (n = 0; n <= length - MIN_MATCH; n++) {
        ins_h = (ins_h << hash_shift ^ window[n + (MIN_MATCH - 1)] & 0xff) & hash_mask;
        prev[n & w_mask] = head[ins_h];
        head[ins_h] = n;
      }

      return Z_OK$1;
    };

    that.deflate = function (_strm, flush) {
      var i, header, level_flags, old_flush, bstate;

      if (flush > Z_FINISH$1 || flush < 0) {
        return Z_STREAM_ERROR$1;
      }

      if (!_strm.next_out || !_strm.next_in && _strm.avail_in !== 0 || status == FINISH_STATE && flush != Z_FINISH$1) {
        _strm.msg = z_errmsg[Z_NEED_DICT$1 - Z_STREAM_ERROR$1];
        return Z_STREAM_ERROR$1;
      }

      if (_strm.avail_out === 0) {
        _strm.msg = z_errmsg[Z_NEED_DICT$1 - Z_BUF_ERROR$1];
        return Z_BUF_ERROR$1;
      }

      strm = _strm; // just in case

      old_flush = last_flush;
      last_flush = flush; // Write the zlib header

      if (status == INIT_STATE) {
        header = Z_DEFLATED$1 + (w_bits - 8 << 4) << 8;
        level_flags = (level - 1 & 0xff) >> 1;
        if (level_flags > 3) level_flags = 3;
        header |= level_flags << 6;
        if (strstart !== 0) header |= PRESET_DICT$1;
        header += 31 - header % 31;
        status = BUSY_STATE;
        putShortMSB(header);
      } // Flush as much pending output as possible


      if (that.pending !== 0) {
        strm.flush_pending();

        if (strm.avail_out === 0) {
          // console.log(" avail_out==0");
          // Since avail_out is 0, deflate will be called again with
          // more output space, but possibly with both pending and
          // avail_in equal to zero. There won't be anything to do,
          // but this is not an error situation so make sure we
          // return OK instead of BUF_ERROR at next call of deflate:
          last_flush = -1;
          return Z_OK$1;
        } // Make sure there is something to do and avoid duplicate
        // consecutive
        // flushes. For repeated and useless calls with Z_FINISH, we keep
        // returning Z_STREAM_END instead of Z_BUFF_ERROR.

      } else if (strm.avail_in === 0 && flush <= old_flush && flush != Z_FINISH$1) {
        strm.msg = z_errmsg[Z_NEED_DICT$1 - Z_BUF_ERROR$1];
        return Z_BUF_ERROR$1;
      } // User must not provide more input after the first FINISH:


      if (status == FINISH_STATE && strm.avail_in !== 0) {
        _strm.msg = z_errmsg[Z_NEED_DICT$1 - Z_BUF_ERROR$1];
        return Z_BUF_ERROR$1;
      } // Start a new block or continue the current one.


      if (strm.avail_in !== 0 || lookahead !== 0 || flush != Z_NO_FLUSH$1 && status != FINISH_STATE) {
        bstate = -1;

        switch (config_table[level].func) {
          case STORED$1:
            bstate = deflate_stored(flush);
            break;

          case FAST:
            bstate = deflate_fast(flush);
            break;

          case SLOW:
            bstate = deflate_slow(flush);
            break;
        }

        if (bstate == FinishStarted || bstate == FinishDone) {
          status = FINISH_STATE;
        }

        if (bstate == NeedMore || bstate == FinishStarted) {
          if (strm.avail_out === 0) {
            last_flush = -1; // avoid BUF_ERROR next call, see above
          }

          return Z_OK$1; // If flush != Z_NO_FLUSH && avail_out === 0, the next call
          // of deflate should use the same flush parameter to make sure
          // that the flush is complete. So we don't have to output an
          // empty block here, this will be done at next call. This also
          // ensures that for a very small output buffer, we emit at most
          // one empty block.
        }

        if (bstate == BlockDone) {
          if (flush == Z_PARTIAL_FLUSH) {
            _tr_align();
          } else {
            // FULL_FLUSH or SYNC_FLUSH
            _tr_stored_block(0, 0, false); // For a full flush, this empty block will be recognized
            // as a special marker by inflate_sync().


            if (flush == Z_FULL_FLUSH) {
              // state.head[s.hash_size-1]=0;
              for (i = 0; i < hash_size
              /*-1*/
              ; i++) {
                // forget history
                head[i] = 0;
              }
            }
          }

          strm.flush_pending();

          if (strm.avail_out === 0) {
            last_flush = -1; // avoid BUF_ERROR at next call, see above

            return Z_OK$1;
          }
        }
      }

      if (flush != Z_FINISH$1) return Z_OK$1;
      return Z_STREAM_END$1;
    };
  } // ZStream


  function ZStream$1() {
    var that = this;
    that.next_in_index = 0;
    that.next_out_index = 0; // that.next_in; // next input byte

    that.avail_in = 0; // number of bytes available at next_in

    that.total_in = 0; // total nb of input bytes read so far
    // that.next_out; // next output byte should be put there

    that.avail_out = 0; // remaining free space at next_out

    that.total_out = 0; // total nb of bytes output so far
    // that.msg;
    // that.dstate;
  }

  ZStream$1.prototype = {
    deflateInit: function deflateInit(level, bits) {
      var that = this;
      that.dstate = new Deflate$1();
      if (!bits) bits = MAX_BITS$1;
      return that.dstate.deflateInit(that, level, bits);
    },
    deflate: function deflate(flush) {
      var that = this;

      if (!that.dstate) {
        return Z_STREAM_ERROR$1;
      }

      return that.dstate.deflate(that, flush);
    },
    deflateEnd: function deflateEnd() {
      var that = this;
      if (!that.dstate) return Z_STREAM_ERROR$1;
      var ret = that.dstate.deflateEnd();
      that.dstate = null;
      return ret;
    },
    deflateParams: function deflateParams(level, strategy) {
      var that = this;
      if (!that.dstate) return Z_STREAM_ERROR$1;
      return that.dstate.deflateParams(that, level, strategy);
    },
    deflateSetDictionary: function deflateSetDictionary(dictionary, dictLength) {
      var that = this;
      if (!that.dstate) return Z_STREAM_ERROR$1;
      return that.dstate.deflateSetDictionary(that, dictionary, dictLength);
    },
    // Read a new buffer from the current input stream, update the
    // total number of bytes read. All deflate() input goes through
    // this function so some applications may wish to modify it to avoid
    // allocating a large strm->next_in buffer and copying from it.
    // (See also flush_pending()).
    read_buf: function read_buf(buf, start, size) {
      var that = this;
      var len = that.avail_in;
      if (len > size) len = size;
      if (len === 0) return 0;
      that.avail_in -= len;
      buf.set(that.next_in.subarray(that.next_in_index, that.next_in_index + len), start);
      that.next_in_index += len;
      that.total_in += len;
      return len;
    },
    // Flush as much pending output as possible. All deflate() output goes
    // through this function so some applications may wish to modify it
    // to avoid allocating a large strm->next_out buffer and copying into it.
    // (See also read_buf()).
    flush_pending: function flush_pending() {
      var that = this;
      var len = that.dstate.pending;
      if (len > that.avail_out) len = that.avail_out;
      if (len === 0) return; // if (that.dstate.pending_buf.length <= that.dstate.pending_out || that.next_out.length <= that.next_out_index
      // || that.dstate.pending_buf.length < (that.dstate.pending_out + len) || that.next_out.length < (that.next_out_index +
      // len)) {
      // console.log(that.dstate.pending_buf.length + ", " + that.dstate.pending_out + ", " + that.next_out.length + ", " +
      // that.next_out_index + ", " + len);
      // console.log("avail_out=" + that.avail_out);
      // }

      that.next_out.set(that.dstate.pending_buf.subarray(that.dstate.pending_out, that.dstate.pending_out + len), that.next_out_index);
      that.next_out_index += len;
      that.dstate.pending_out += len;
      that.total_out += len;
      that.avail_out -= len;
      that.dstate.pending -= len;

      if (that.dstate.pending === 0) {
        that.dstate.pending_out = 0;
      }
    }
  }; // Deflate

  function ZipDeflate(options) {
    var that = this;
    var z = new ZStream$1();
    var bufsize = getMaximumCompressedSize$1(options && options.chunkSize ? options.chunkSize : 64 * 1024);
    var flush = Z_NO_FLUSH$1;
    var buf = new Uint8Array(bufsize);
    var level = options ? options.level : Z_DEFAULT_COMPRESSION;
    if (typeof level == "undefined") level = Z_DEFAULT_COMPRESSION;
    z.deflateInit(level);
    z.next_out = buf;

    that.append = function (data, onprogress) {
      var err,
          array,
          lastIndex = 0,
          bufferIndex = 0,
          bufferSize = 0;
      var buffers = [];
      if (!data.length) return;
      z.next_in_index = 0;
      z.next_in = data;
      z.avail_in = data.length;

      do {
        z.next_out_index = 0;
        z.avail_out = bufsize;
        err = z.deflate(flush);
        if (err != Z_OK$1) throw new Error("deflating: " + z.msg);
        if (z.next_out_index) if (z.next_out_index == bufsize) buffers.push(new Uint8Array(buf));else buffers.push(buf.slice(0, z.next_out_index));
        bufferSize += z.next_out_index;

        if (onprogress && z.next_in_index > 0 && z.next_in_index != lastIndex) {
          onprogress(z.next_in_index);
          lastIndex = z.next_in_index;
        }
      } while (z.avail_in > 0 || z.avail_out === 0);

      if (buffers.length > 1) {
        array = new Uint8Array(bufferSize);
        buffers.forEach(function (chunk) {
          array.set(chunk, bufferIndex);
          bufferIndex += chunk.length;
        });
      } else {
        array = buffers[0] || new Uint8Array(0);
      }

      return array;
    };

    that.flush = function () {
      var err,
          array,
          bufferIndex = 0,
          bufferSize = 0;
      var buffers = [];

      do {
        z.next_out_index = 0;
        z.avail_out = bufsize;
        err = z.deflate(Z_FINISH$1);
        if (err != Z_STREAM_END$1 && err != Z_OK$1) throw new Error("deflating: " + z.msg);
        if (bufsize - z.avail_out > 0) buffers.push(buf.slice(0, z.next_out_index));
        bufferSize += z.next_out_index;
      } while (z.avail_in > 0 || z.avail_out === 0);

      z.deflateEnd();
      array = new Uint8Array(bufferSize);
      buffers.forEach(function (chunk) {
        array.set(chunk, bufferIndex);
        bufferIndex += chunk.length;
      });
      return array;
    };
  }

  function getMaximumCompressedSize$1(uncompressedSize) {
    return uncompressedSize + 5 * (Math.floor(uncompressedSize / 16383) + 1);
  }

  var createTypedArrayConstructor$1 = typedArrayConstructor.exports;

  // `Int32Array` constructor
  // https://tc39.es/ecma262/#sec-typedarray-objects
  createTypedArrayConstructor$1('Int32', function (init) {
    return function Int32Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  var MAX_BITS = 15;
  var Z_OK = 0;
  var Z_STREAM_END = 1;
  var Z_NEED_DICT = 2;
  var Z_STREAM_ERROR = -2;
  var Z_DATA_ERROR = -3;
  var Z_MEM_ERROR = -4;
  var Z_BUF_ERROR = -5;
  var inflate_mask = [0x00000000, 0x00000001, 0x00000003, 0x00000007, 0x0000000f, 0x0000001f, 0x0000003f, 0x0000007f, 0x000000ff, 0x000001ff, 0x000003ff, 0x000007ff, 0x00000fff, 0x00001fff, 0x00003fff, 0x00007fff, 0x0000ffff];
  var MANY = 1440; // JZlib version : "1.0.2"

  var Z_NO_FLUSH = 0;
  var Z_FINISH = 4; // InfTree

  var fixed_bl = 9;
  var fixed_bd = 5;
  var fixed_tl = [96, 7, 256, 0, 8, 80, 0, 8, 16, 84, 8, 115, 82, 7, 31, 0, 8, 112, 0, 8, 48, 0, 9, 192, 80, 7, 10, 0, 8, 96, 0, 8, 32, 0, 9, 160, 0, 8, 0, 0, 8, 128, 0, 8, 64, 0, 9, 224, 80, 7, 6, 0, 8, 88, 0, 8, 24, 0, 9, 144, 83, 7, 59, 0, 8, 120, 0, 8, 56, 0, 9, 208, 81, 7, 17, 0, 8, 104, 0, 8, 40, 0, 9, 176, 0, 8, 8, 0, 8, 136, 0, 8, 72, 0, 9, 240, 80, 7, 4, 0, 8, 84, 0, 8, 20, 85, 8, 227, 83, 7, 43, 0, 8, 116, 0, 8, 52, 0, 9, 200, 81, 7, 13, 0, 8, 100, 0, 8, 36, 0, 9, 168, 0, 8, 4, 0, 8, 132, 0, 8, 68, 0, 9, 232, 80, 7, 8, 0, 8, 92, 0, 8, 28, 0, 9, 152, 84, 7, 83, 0, 8, 124, 0, 8, 60, 0, 9, 216, 82, 7, 23, 0, 8, 108, 0, 8, 44, 0, 9, 184, 0, 8, 12, 0, 8, 140, 0, 8, 76, 0, 9, 248, 80, 7, 3, 0, 8, 82, 0, 8, 18, 85, 8, 163, 83, 7, 35, 0, 8, 114, 0, 8, 50, 0, 9, 196, 81, 7, 11, 0, 8, 98, 0, 8, 34, 0, 9, 164, 0, 8, 2, 0, 8, 130, 0, 8, 66, 0, 9, 228, 80, 7, 7, 0, 8, 90, 0, 8, 26, 0, 9, 148, 84, 7, 67, 0, 8, 122, 0, 8, 58, 0, 9, 212, 82, 7, 19, 0, 8, 106, 0, 8, 42, 0, 9, 180, 0, 8, 10, 0, 8, 138, 0, 8, 74, 0, 9, 244, 80, 7, 5, 0, 8, 86, 0, 8, 22, 192, 8, 0, 83, 7, 51, 0, 8, 118, 0, 8, 54, 0, 9, 204, 81, 7, 15, 0, 8, 102, 0, 8, 38, 0, 9, 172, 0, 8, 6, 0, 8, 134, 0, 8, 70, 0, 9, 236, 80, 7, 9, 0, 8, 94, 0, 8, 30, 0, 9, 156, 84, 7, 99, 0, 8, 126, 0, 8, 62, 0, 9, 220, 82, 7, 27, 0, 8, 110, 0, 8, 46, 0, 9, 188, 0, 8, 14, 0, 8, 142, 0, 8, 78, 0, 9, 252, 96, 7, 256, 0, 8, 81, 0, 8, 17, 85, 8, 131, 82, 7, 31, 0, 8, 113, 0, 8, 49, 0, 9, 194, 80, 7, 10, 0, 8, 97, 0, 8, 33, 0, 9, 162, 0, 8, 1, 0, 8, 129, 0, 8, 65, 0, 9, 226, 80, 7, 6, 0, 8, 89, 0, 8, 25, 0, 9, 146, 83, 7, 59, 0, 8, 121, 0, 8, 57, 0, 9, 210, 81, 7, 17, 0, 8, 105, 0, 8, 41, 0, 9, 178, 0, 8, 9, 0, 8, 137, 0, 8, 73, 0, 9, 242, 80, 7, 4, 0, 8, 85, 0, 8, 21, 80, 8, 258, 83, 7, 43, 0, 8, 117, 0, 8, 53, 0, 9, 202, 81, 7, 13, 0, 8, 101, 0, 8, 37, 0, 9, 170, 0, 8, 5, 0, 8, 133, 0, 8, 69, 0, 9, 234, 80, 7, 8, 0, 8, 93, 0, 8, 29, 0, 9, 154, 84, 7, 83, 0, 8, 125, 0, 8, 61, 0, 9, 218, 82, 7, 23, 0, 8, 109, 0, 8, 45, 0, 9, 186, 0, 8, 13, 0, 8, 141, 0, 8, 77, 0, 9, 250, 80, 7, 3, 0, 8, 83, 0, 8, 19, 85, 8, 195, 83, 7, 35, 0, 8, 115, 0, 8, 51, 0, 9, 198, 81, 7, 11, 0, 8, 99, 0, 8, 35, 0, 9, 166, 0, 8, 3, 0, 8, 131, 0, 8, 67, 0, 9, 230, 80, 7, 7, 0, 8, 91, 0, 8, 27, 0, 9, 150, 84, 7, 67, 0, 8, 123, 0, 8, 59, 0, 9, 214, 82, 7, 19, 0, 8, 107, 0, 8, 43, 0, 9, 182, 0, 8, 11, 0, 8, 139, 0, 8, 75, 0, 9, 246, 80, 7, 5, 0, 8, 87, 0, 8, 23, 192, 8, 0, 83, 7, 51, 0, 8, 119, 0, 8, 55, 0, 9, 206, 81, 7, 15, 0, 8, 103, 0, 8, 39, 0, 9, 174, 0, 8, 7, 0, 8, 135, 0, 8, 71, 0, 9, 238, 80, 7, 9, 0, 8, 95, 0, 8, 31, 0, 9, 158, 84, 7, 99, 0, 8, 127, 0, 8, 63, 0, 9, 222, 82, 7, 27, 0, 8, 111, 0, 8, 47, 0, 9, 190, 0, 8, 15, 0, 8, 143, 0, 8, 79, 0, 9, 254, 96, 7, 256, 0, 8, 80, 0, 8, 16, 84, 8, 115, 82, 7, 31, 0, 8, 112, 0, 8, 48, 0, 9, 193, 80, 7, 10, 0, 8, 96, 0, 8, 32, 0, 9, 161, 0, 8, 0, 0, 8, 128, 0, 8, 64, 0, 9, 225, 80, 7, 6, 0, 8, 88, 0, 8, 24, 0, 9, 145, 83, 7, 59, 0, 8, 120, 0, 8, 56, 0, 9, 209, 81, 7, 17, 0, 8, 104, 0, 8, 40, 0, 9, 177, 0, 8, 8, 0, 8, 136, 0, 8, 72, 0, 9, 241, 80, 7, 4, 0, 8, 84, 0, 8, 20, 85, 8, 227, 83, 7, 43, 0, 8, 116, 0, 8, 52, 0, 9, 201, 81, 7, 13, 0, 8, 100, 0, 8, 36, 0, 9, 169, 0, 8, 4, 0, 8, 132, 0, 8, 68, 0, 9, 233, 80, 7, 8, 0, 8, 92, 0, 8, 28, 0, 9, 153, 84, 7, 83, 0, 8, 124, 0, 8, 60, 0, 9, 217, 82, 7, 23, 0, 8, 108, 0, 8, 44, 0, 9, 185, 0, 8, 12, 0, 8, 140, 0, 8, 76, 0, 9, 249, 80, 7, 3, 0, 8, 82, 0, 8, 18, 85, 8, 163, 83, 7, 35, 0, 8, 114, 0, 8, 50, 0, 9, 197, 81, 7, 11, 0, 8, 98, 0, 8, 34, 0, 9, 165, 0, 8, 2, 0, 8, 130, 0, 8, 66, 0, 9, 229, 80, 7, 7, 0, 8, 90, 0, 8, 26, 0, 9, 149, 84, 7, 67, 0, 8, 122, 0, 8, 58, 0, 9, 213, 82, 7, 19, 0, 8, 106, 0, 8, 42, 0, 9, 181, 0, 8, 10, 0, 8, 138, 0, 8, 74, 0, 9, 245, 80, 7, 5, 0, 8, 86, 0, 8, 22, 192, 8, 0, 83, 7, 51, 0, 8, 118, 0, 8, 54, 0, 9, 205, 81, 7, 15, 0, 8, 102, 0, 8, 38, 0, 9, 173, 0, 8, 6, 0, 8, 134, 0, 8, 70, 0, 9, 237, 80, 7, 9, 0, 8, 94, 0, 8, 30, 0, 9, 157, 84, 7, 99, 0, 8, 126, 0, 8, 62, 0, 9, 221, 82, 7, 27, 0, 8, 110, 0, 8, 46, 0, 9, 189, 0, 8, 14, 0, 8, 142, 0, 8, 78, 0, 9, 253, 96, 7, 256, 0, 8, 81, 0, 8, 17, 85, 8, 131, 82, 7, 31, 0, 8, 113, 0, 8, 49, 0, 9, 195, 80, 7, 10, 0, 8, 97, 0, 8, 33, 0, 9, 163, 0, 8, 1, 0, 8, 129, 0, 8, 65, 0, 9, 227, 80, 7, 6, 0, 8, 89, 0, 8, 25, 0, 9, 147, 83, 7, 59, 0, 8, 121, 0, 8, 57, 0, 9, 211, 81, 7, 17, 0, 8, 105, 0, 8, 41, 0, 9, 179, 0, 8, 9, 0, 8, 137, 0, 8, 73, 0, 9, 243, 80, 7, 4, 0, 8, 85, 0, 8, 21, 80, 8, 258, 83, 7, 43, 0, 8, 117, 0, 8, 53, 0, 9, 203, 81, 7, 13, 0, 8, 101, 0, 8, 37, 0, 9, 171, 0, 8, 5, 0, 8, 133, 0, 8, 69, 0, 9, 235, 80, 7, 8, 0, 8, 93, 0, 8, 29, 0, 9, 155, 84, 7, 83, 0, 8, 125, 0, 8, 61, 0, 9, 219, 82, 7, 23, 0, 8, 109, 0, 8, 45, 0, 9, 187, 0, 8, 13, 0, 8, 141, 0, 8, 77, 0, 9, 251, 80, 7, 3, 0, 8, 83, 0, 8, 19, 85, 8, 195, 83, 7, 35, 0, 8, 115, 0, 8, 51, 0, 9, 199, 81, 7, 11, 0, 8, 99, 0, 8, 35, 0, 9, 167, 0, 8, 3, 0, 8, 131, 0, 8, 67, 0, 9, 231, 80, 7, 7, 0, 8, 91, 0, 8, 27, 0, 9, 151, 84, 7, 67, 0, 8, 123, 0, 8, 59, 0, 9, 215, 82, 7, 19, 0, 8, 107, 0, 8, 43, 0, 9, 183, 0, 8, 11, 0, 8, 139, 0, 8, 75, 0, 9, 247, 80, 7, 5, 0, 8, 87, 0, 8, 23, 192, 8, 0, 83, 7, 51, 0, 8, 119, 0, 8, 55, 0, 9, 207, 81, 7, 15, 0, 8, 103, 0, 8, 39, 0, 9, 175, 0, 8, 7, 0, 8, 135, 0, 8, 71, 0, 9, 239, 80, 7, 9, 0, 8, 95, 0, 8, 31, 0, 9, 159, 84, 7, 99, 0, 8, 127, 0, 8, 63, 0, 9, 223, 82, 7, 27, 0, 8, 111, 0, 8, 47, 0, 9, 191, 0, 8, 15, 0, 8, 143, 0, 8, 79, 0, 9, 255];
  var fixed_td = [80, 5, 1, 87, 5, 257, 83, 5, 17, 91, 5, 4097, 81, 5, 5, 89, 5, 1025, 85, 5, 65, 93, 5, 16385, 80, 5, 3, 88, 5, 513, 84, 5, 33, 92, 5, 8193, 82, 5, 9, 90, 5, 2049, 86, 5, 129, 192, 5, 24577, 80, 5, 2, 87, 5, 385, 83, 5, 25, 91, 5, 6145, 81, 5, 7, 89, 5, 1537, 85, 5, 97, 93, 5, 24577, 80, 5, 4, 88, 5, 769, 84, 5, 49, 92, 5, 12289, 82, 5, 13, 90, 5, 3073, 86, 5, 193, 192, 5, 24577]; // Tables for deflate from PKZIP's appnote.txt.

  var cplens = [// Copy lengths for literal codes 257..285
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0]; // see note #13 above about 258

  var cplext = [// Extra bits for literal codes 257..285
  0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 112, 112 // 112==invalid
  ];
  var cpdist = [// Copy offsets for distance codes 0..29
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
  var cpdext = [// Extra bits for distance codes
  0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]; // If BMAX needs to be larger than 16, then h and x[] should be uLong.

  var BMAX = 15; // maximum bit length of any code

  function InfTree() {
    var that = this;
    var hn; // hufts used in space

    var v; // work area for huft_build

    var c; // bit length count table

    var r; // table entry for structure assignment

    var u; // table stack

    var x; // bit offsets, then code stack

    function huft_build(b, // code lengths in bits (all assumed <=
    // BMAX)
    bindex, n, // number of codes (assumed <= 288)
    s, // number of simple-valued codes (0..s-1)
    d, // list of base values for non-simple codes
    e, // list of extra bits for non-simple codes
    t, // result: starting table
    m, // maximum lookup bits, returns actual
    hp, // space for trees
    hn, // hufts used in space
    v // working area: values in order of bit length
    ) {
      // Given a list of code lengths and a maximum table size, make a set of
      // tables to decode that set of codes. Return Z_OK on success,
      // Z_BUF_ERROR
      // if the given code set is incomplete (the tables are still built in
      // this
      // case), Z_DATA_ERROR if the input is invalid (an over-subscribed set
      // of
      // lengths), or Z_MEM_ERROR if not enough memory.
      var a; // counter for codes of length k

      var f; // i repeats in table every f entries

      var g; // maximum code length

      var h; // table level

      var i; // counter, current code

      var j; // counter

      var k; // number of bits in current code

      var l; // bits per table (returned in m)

      var mask; // (1 << w) - 1, to avoid cc -O bug on HP

      var p; // pointer into c[], b[], or v[]

      var q; // points to current table

      var w; // bits before this table == (l * h)

      var xp; // pointer into x

      var y; // number of dummy codes added

      var z; // number of entries in current table
      // Generate counts for each bit length

      p = 0;
      i = n;

      do {
        c[b[bindex + p]]++;
        p++;
        i--; // assume all entries <= BMAX
      } while (i !== 0);

      if (c[0] == n) {
        // null input--all zero length codes
        t[0] = -1;
        m[0] = 0;
        return Z_OK;
      } // Find minimum and maximum length, bound *m by those


      l = m[0];

      for (j = 1; j <= BMAX; j++) {
        if (c[j] !== 0) break;
      }

      k = j; // minimum code length

      if (l < j) {
        l = j;
      }

      for (i = BMAX; i !== 0; i--) {
        if (c[i] !== 0) break;
      }

      g = i; // maximum code length

      if (l > i) {
        l = i;
      }

      m[0] = l; // Adjust last length count to fill out codes, if needed

      for (y = 1 << j; j < i; j++, y <<= 1) {
        if ((y -= c[j]) < 0) {
          return Z_DATA_ERROR;
        }
      }

      if ((y -= c[i]) < 0) {
        return Z_DATA_ERROR;
      }

      c[i] += y; // Generate starting offsets into the value table for each length

      x[1] = j = 0;
      p = 1;
      xp = 2;

      while (--i !== 0) {
        // note that i == g from above
        x[xp] = j += c[p];
        xp++;
        p++;
      } // Make a table of values in order of bit lengths


      i = 0;
      p = 0;

      do {
        if ((j = b[bindex + p]) !== 0) {
          v[x[j]++] = i;
        }

        p++;
      } while (++i < n);

      n = x[g]; // set n to length of v
      // Generate the Huffman codes and for each, make the table entries

      x[0] = i = 0; // first Huffman code is zero

      p = 0; // grab values in bit order

      h = -1; // no tables yet--level -1

      w = -l; // bits decoded == (l * h)

      u[0] = 0; // just to keep compilers happy

      q = 0; // ditto

      z = 0; // ditto
      // go through the bit lengths (k already is bits in shortest code)

      for (; k <= g; k++) {
        a = c[k];

        while (a-- !== 0) {
          // here i is the Huffman code of length k bits for value *p
          // make tables up to required level
          while (k > w + l) {
            h++;
            w += l; // previous table always l bits
            // compute minimum size table less than or equal to l bits

            z = g - w;
            z = z > l ? l : z; // table size upper limit

            if ((f = 1 << (j = k - w)) > a + 1) {
              // try a k-w bit table
              // too few codes for
              // k-w bit table
              f -= a + 1; // deduct codes from patterns left

              xp = k;

              if (j < z) {
                while (++j < z) {
                  // try smaller tables up to z bits
                  if ((f <<= 1) <= c[++xp]) break; // enough codes to use up j bits

                  f -= c[xp]; // else deduct codes from patterns
                }
              }
            }

            z = 1 << j; // table entries for j-bit table
            // allocate new table

            if (hn[0] + z > MANY) {
              // (note: doesn't matter for fixed)
              return Z_DATA_ERROR; // overflow of MANY
            }

            u[h] = q =
            /* hp+ */
            hn[0]; // DEBUG

            hn[0] += z; // connect to last table, if there is one

            if (h !== 0) {
              x[h] = i; // save pattern for backing up

              r[0] =
              /* (byte) */
              j; // bits in this table

              r[1] =
              /* (byte) */
              l; // bits to dump before this table

              j = i >>> w - l;
              r[2] =
              /* (int) */
              q - u[h - 1] - j; // offset to this table

              hp.set(r, (u[h - 1] + j) * 3); // to
              // last
              // table
            } else {
              t[0] = q; // first table is returned result
            }
          } // set up table entry in r


          r[1] =
          /* (byte) */
          k - w;

          if (p >= n) {
            r[0] = 128 + 64; // out of values--invalid code
          } else if (v[p] < s) {
            r[0] =
            /* (byte) */
            v[p] < 256 ? 0 : 32 + 64; // 256 is
            // end-of-block

            r[2] = v[p++]; // simple code is just the value
          } else {
            r[0] =
            /* (byte) */
            e[v[p] - s] + 16 + 64; // non-simple--look
            // up in lists

            r[2] = d[v[p++] - s];
          } // fill code-like entries with r


          f = 1 << k - w;

          for (j = i >>> w; j < z; j += f) {
            hp.set(r, (q + j) * 3);
          } // backwards increment the k-bit code i


          for (j = 1 << k - 1; (i & j) !== 0; j >>>= 1) {
            i ^= j;
          }

          i ^= j; // backup over finished tables

          mask = (1 << w) - 1; // needed on HP, cc -O bug

          while ((i & mask) != x[h]) {
            h--; // don't need to update q

            w -= l;
            mask = (1 << w) - 1;
          }
        }
      } // Return Z_BUF_ERROR if we were given an incomplete table


      return y !== 0 && g != 1 ? Z_BUF_ERROR : Z_OK;
    }

    function initWorkArea(vsize) {
      var i;

      if (!hn) {
        hn = []; // []; //new Array(1);

        v = []; // new Array(vsize);

        c = new Int32Array(BMAX + 1); // new Array(BMAX + 1);

        r = []; // new Array(3);

        u = new Int32Array(BMAX); // new Array(BMAX);

        x = new Int32Array(BMAX + 1); // new Array(BMAX + 1);
      }

      if (v.length < vsize) {
        v = []; // new Array(vsize);
      }

      for (i = 0; i < vsize; i++) {
        v[i] = 0;
      }

      for (i = 0; i < BMAX + 1; i++) {
        c[i] = 0;
      }

      for (i = 0; i < 3; i++) {
        r[i] = 0;
      } // for(int i=0; i<BMAX; i++){u[i]=0;}


      u.set(c.subarray(0, BMAX), 0); // for(int i=0; i<BMAX+1; i++){x[i]=0;}

      x.set(c.subarray(0, BMAX + 1), 0);
    }

    that.inflate_trees_bits = function (c, // 19 code lengths
    bb, // bits tree desired/actual depth
    tb, // bits tree result
    hp, // space for trees
    z // for messages
    ) {
      var result;
      initWorkArea(19);
      hn[0] = 0;
      result = huft_build(c, 0, 19, 19, null, null, tb, bb, hp, hn, v);

      if (result == Z_DATA_ERROR) {
        z.msg = "oversubscribed dynamic bit lengths tree";
      } else if (result == Z_BUF_ERROR || bb[0] === 0) {
        z.msg = "incomplete dynamic bit lengths tree";
        result = Z_DATA_ERROR;
      }

      return result;
    };

    that.inflate_trees_dynamic = function (nl, // number of literal/length codes
    nd, // number of distance codes
    c, // that many (total) code lengths
    bl, // literal desired/actual bit depth
    bd, // distance desired/actual bit depth
    tl, // literal/length tree result
    td, // distance tree result
    hp, // space for trees
    z // for messages
    ) {
      var result; // build literal/length tree

      initWorkArea(288);
      hn[0] = 0;
      result = huft_build(c, 0, nl, 257, cplens, cplext, tl, bl, hp, hn, v);

      if (result != Z_OK || bl[0] === 0) {
        if (result == Z_DATA_ERROR) {
          z.msg = "oversubscribed literal/length tree";
        } else if (result != Z_MEM_ERROR) {
          z.msg = "incomplete literal/length tree";
          result = Z_DATA_ERROR;
        }

        return result;
      } // build distance tree


      initWorkArea(288);
      result = huft_build(c, nl, nd, 0, cpdist, cpdext, td, bd, hp, hn, v);

      if (result != Z_OK || bd[0] === 0 && nl > 257) {
        if (result == Z_DATA_ERROR) {
          z.msg = "oversubscribed distance tree";
        } else if (result == Z_BUF_ERROR) {
          z.msg = "incomplete distance tree";
          result = Z_DATA_ERROR;
        } else if (result != Z_MEM_ERROR) {
          z.msg = "empty distance tree with lengths";
          result = Z_DATA_ERROR;
        }

        return result;
      }

      return Z_OK;
    };
  }

  InfTree.inflate_trees_fixed = function (bl, // literal desired/actual bit depth
  bd, // distance desired/actual bit depth
  tl, // literal/length tree result
  td // distance tree result
  ) {
    bl[0] = fixed_bl;
    bd[0] = fixed_bd;
    tl[0] = fixed_tl;
    td[0] = fixed_td;
    return Z_OK;
  }; // InfCodes
  // waiting for "i:"=input,
  // "o:"=output,
  // "x:"=nothing


  var START = 0; // x: set up for LEN

  var LEN = 1; // i: get length/literal/eob next

  var LENEXT = 2; // i: getting length extra (have base)

  var DIST = 3; // i: get distance next

  var DISTEXT = 4; // i: getting distance extra

  var COPY = 5; // o: copying bytes in window, waiting
  // for space

  var LIT = 6; // o: got literal, waiting for output
  // space

  var WASH = 7; // o: got eob, possibly still output
  // waiting

  var END = 8; // x: got eob and all data flushed

  var BADCODE = 9; // x: got error

  function InfCodes() {
    var that = this;
    var mode; // current inflate_codes mode
    // mode dependent information

    var len = 0;
    var tree; // pointer into tree

    var tree_index = 0;
    var need = 0; // bits needed

    var lit = 0; // if EXT or COPY, where and how much

    var get = 0; // bits to get for extra

    var dist = 0; // distance back to copy from

    var lbits = 0; // ltree bits decoded per branch

    var dbits = 0; // dtree bits decoder per branch

    var ltree; // literal/length/eob tree

    var ltree_index = 0; // literal/length/eob tree

    var dtree; // distance tree

    var dtree_index = 0; // distance tree
    // Called with number of bytes left to write in window at least 258
    // (the maximum string length) and number of input bytes available
    // at least ten. The ten bytes are six bytes for the longest length/
    // distance pair plus four bytes for overloading the bit buffer.

    function inflate_fast(bl, bd, tl, tl_index, td, td_index, s, z) {
      var t; // temporary pointer

      var tp; // temporary pointer

      var tp_index; // temporary pointer

      var e; // extra bits or operation

      var b; // bit buffer

      var k; // bits in bit buffer

      var p; // input data pointer

      var n; // bytes available there

      var q; // output window write pointer

      var m; // bytes to end of window or read pointer

      var ml; // mask for literal/length tree

      var md; // mask for distance tree

      var c; // bytes to copy

      var d; // distance back to copy from

      var r; // copy source pointer

      var tp_index_t_3; // (tp_index+t)*3
      // load input, output, bit values

      p = z.next_in_index;
      n = z.avail_in;
      b = s.bitb;
      k = s.bitk;
      q = s.write;
      m = q < s.read ? s.read - q - 1 : s.end - q; // initialize masks

      ml = inflate_mask[bl];
      md = inflate_mask[bd]; // do until not enough input or output space for fast loop

      do {
        // assume called with m >= 258 && n >= 10
        // get literal/length code
        while (k < 20) {
          // max bits for literal/length code
          n--;
          b |= (z.read_byte(p++) & 0xff) << k;
          k += 8;
        }

        t = b & ml;
        tp = tl;
        tp_index = tl_index;
        tp_index_t_3 = (tp_index + t) * 3;

        if ((e = tp[tp_index_t_3]) === 0) {
          b >>= tp[tp_index_t_3 + 1];
          k -= tp[tp_index_t_3 + 1];
          s.window[q++] =
          /* (byte) */
          tp[tp_index_t_3 + 2];
          m--;
          continue;
        }

        do {
          b >>= tp[tp_index_t_3 + 1];
          k -= tp[tp_index_t_3 + 1];

          if ((e & 16) !== 0) {
            e &= 15;
            c = tp[tp_index_t_3 + 2] + (
            /* (int) */
            b & inflate_mask[e]);
            b >>= e;
            k -= e; // decode distance base of block to copy

            while (k < 15) {
              // max bits for distance code
              n--;
              b |= (z.read_byte(p++) & 0xff) << k;
              k += 8;
            }

            t = b & md;
            tp = td;
            tp_index = td_index;
            tp_index_t_3 = (tp_index + t) * 3;
            e = tp[tp_index_t_3];

            do {
              b >>= tp[tp_index_t_3 + 1];
              k -= tp[tp_index_t_3 + 1];

              if ((e & 16) !== 0) {
                // get extra bits to add to distance base
                e &= 15;

                while (k < e) {
                  // get extra bits (up to 13)
                  n--;
                  b |= (z.read_byte(p++) & 0xff) << k;
                  k += 8;
                }

                d = tp[tp_index_t_3 + 2] + (b & inflate_mask[e]);
                b >>= e;
                k -= e; // do the copy

                m -= c;

                if (q >= d) {
                  // offset before dest
                  // just copy
                  r = q - d;

                  if (q - r > 0 && 2 > q - r) {
                    s.window[q++] = s.window[r++]; // minimum
                    // count is
                    // three,

                    s.window[q++] = s.window[r++]; // so unroll
                    // loop a
                    // little

                    c -= 2;
                  } else {
                    s.window.set(s.window.subarray(r, r + 2), q);
                    q += 2;
                    r += 2;
                    c -= 2;
                  }
                } else {
                  // else offset after destination
                  r = q - d;

                  do {
                    r += s.end; // force pointer in window
                  } while (r < 0); // covers invalid distances


                  e = s.end - r;

                  if (c > e) {
                    // if source crosses,
                    c -= e; // wrapped copy

                    if (q - r > 0 && e > q - r) {
                      do {
                        s.window[q++] = s.window[r++];
                      } while (--e !== 0);
                    } else {
                      s.window.set(s.window.subarray(r, r + e), q);
                      q += e;
                      r += e;
                      e = 0;
                    }

                    r = 0; // copy rest from start of window
                  }
                } // copy all or what's left


                if (q - r > 0 && c > q - r) {
                  do {
                    s.window[q++] = s.window[r++];
                  } while (--c !== 0);
                } else {
                  s.window.set(s.window.subarray(r, r + c), q);
                  q += c;
                  r += c;
                  c = 0;
                }

                break;
              } else if ((e & 64) === 0) {
                t += tp[tp_index_t_3 + 2];
                t += b & inflate_mask[e];
                tp_index_t_3 = (tp_index + t) * 3;
                e = tp[tp_index_t_3];
              } else {
                z.msg = "invalid distance code";
                c = z.avail_in - n;
                c = k >> 3 < c ? k >> 3 : c;
                n += c;
                p -= c;
                k -= c << 3;
                s.bitb = b;
                s.bitk = k;
                z.avail_in = n;
                z.total_in += p - z.next_in_index;
                z.next_in_index = p;
                s.write = q;
                return Z_DATA_ERROR;
              } // eslint-disable-next-line no-constant-condition

            } while (true);

            break;
          }

          if ((e & 64) === 0) {
            t += tp[tp_index_t_3 + 2];
            t += b & inflate_mask[e];
            tp_index_t_3 = (tp_index + t) * 3;

            if ((e = tp[tp_index_t_3]) === 0) {
              b >>= tp[tp_index_t_3 + 1];
              k -= tp[tp_index_t_3 + 1];
              s.window[q++] =
              /* (byte) */
              tp[tp_index_t_3 + 2];
              m--;
              break;
            }
          } else if ((e & 32) !== 0) {
            c = z.avail_in - n;
            c = k >> 3 < c ? k >> 3 : c;
            n += c;
            p -= c;
            k -= c << 3;
            s.bitb = b;
            s.bitk = k;
            z.avail_in = n;
            z.total_in += p - z.next_in_index;
            z.next_in_index = p;
            s.write = q;
            return Z_STREAM_END;
          } else {
            z.msg = "invalid literal/length code";
            c = z.avail_in - n;
            c = k >> 3 < c ? k >> 3 : c;
            n += c;
            p -= c;
            k -= c << 3;
            s.bitb = b;
            s.bitk = k;
            z.avail_in = n;
            z.total_in += p - z.next_in_index;
            z.next_in_index = p;
            s.write = q;
            return Z_DATA_ERROR;
          } // eslint-disable-next-line no-constant-condition

        } while (true);
      } while (m >= 258 && n >= 10); // not enough input or output--restore pointers and return


      c = z.avail_in - n;
      c = k >> 3 < c ? k >> 3 : c;
      n += c;
      p -= c;
      k -= c << 3;
      s.bitb = b;
      s.bitk = k;
      z.avail_in = n;
      z.total_in += p - z.next_in_index;
      z.next_in_index = p;
      s.write = q;
      return Z_OK;
    }

    that.init = function (bl, bd, tl, tl_index, td, td_index) {
      mode = START;
      lbits =
      /* (byte) */
      bl;
      dbits =
      /* (byte) */
      bd;
      ltree = tl;
      ltree_index = tl_index;
      dtree = td;
      dtree_index = td_index;
      tree = null;
    };

    that.proc = function (s, z, r) {
      var j; // temporary storage

      var tindex; // temporary pointer

      var e; // extra bits or operation

      var b = 0; // bit buffer

      var k = 0; // bits in bit buffer

      var p = 0; // input data pointer

      var n; // bytes available there

      var q; // output window write pointer

      var m; // bytes to end of window or read pointer

      var f; // pointer to copy strings from
      // copy input/output information to locals (UPDATE macro restores)

      p = z.next_in_index;
      n = z.avail_in;
      b = s.bitb;
      k = s.bitk;
      q = s.write;
      m = q < s.read ? s.read - q - 1 : s.end - q; // process input and output based on current state
      // eslint-disable-next-line no-constant-condition

      while (true) {
        switch (mode) {
          // waiting for "i:"=input, "o:"=output, "x:"=nothing
          case START:
            // x: set up for LEN
            if (m >= 258 && n >= 10) {
              s.bitb = b;
              s.bitk = k;
              z.avail_in = n;
              z.total_in += p - z.next_in_index;
              z.next_in_index = p;
              s.write = q;
              r = inflate_fast(lbits, dbits, ltree, ltree_index, dtree, dtree_index, s, z);
              p = z.next_in_index;
              n = z.avail_in;
              b = s.bitb;
              k = s.bitk;
              q = s.write;
              m = q < s.read ? s.read - q - 1 : s.end - q;

              if (r != Z_OK) {
                mode = r == Z_STREAM_END ? WASH : BADCODE;
                break;
              }
            }

            need = lbits;
            tree = ltree;
            tree_index = ltree_index;
            mode = LEN;

          /* falls through */

          case LEN:
            // i: get length/literal/eob next
            j = need;

            while (k < j) {
              if (n !== 0) r = Z_OK;else {
                s.bitb = b;
                s.bitk = k;
                z.avail_in = n;
                z.total_in += p - z.next_in_index;
                z.next_in_index = p;
                s.write = q;
                return s.inflate_flush(z, r);
              }
              n--;
              b |= (z.read_byte(p++) & 0xff) << k;
              k += 8;
            }

            tindex = (tree_index + (b & inflate_mask[j])) * 3;
            b >>>= tree[tindex + 1];
            k -= tree[tindex + 1];
            e = tree[tindex];

            if (e === 0) {
              // literal
              lit = tree[tindex + 2];
              mode = LIT;
              break;
            }

            if ((e & 16) !== 0) {
              // length
              get = e & 15;
              len = tree[tindex + 2];
              mode = LENEXT;
              break;
            }

            if ((e & 64) === 0) {
              // next table
              need = e;
              tree_index = tindex / 3 + tree[tindex + 2];
              break;
            }

            if ((e & 32) !== 0) {
              // end of block
              mode = WASH;
              break;
            }

            mode = BADCODE; // invalid code

            z.msg = "invalid literal/length code";
            r = Z_DATA_ERROR;
            s.bitb = b;
            s.bitk = k;
            z.avail_in = n;
            z.total_in += p - z.next_in_index;
            z.next_in_index = p;
            s.write = q;
            return s.inflate_flush(z, r);

          case LENEXT:
            // i: getting length extra (have base)
            j = get;

            while (k < j) {
              if (n !== 0) r = Z_OK;else {
                s.bitb = b;
                s.bitk = k;
                z.avail_in = n;
                z.total_in += p - z.next_in_index;
                z.next_in_index = p;
                s.write = q;
                return s.inflate_flush(z, r);
              }
              n--;
              b |= (z.read_byte(p++) & 0xff) << k;
              k += 8;
            }

            len += b & inflate_mask[j];
            b >>= j;
            k -= j;
            need = dbits;
            tree = dtree;
            tree_index = dtree_index;
            mode = DIST;

          /* falls through */

          case DIST:
            // i: get distance next
            j = need;

            while (k < j) {
              if (n !== 0) r = Z_OK;else {
                s.bitb = b;
                s.bitk = k;
                z.avail_in = n;
                z.total_in += p - z.next_in_index;
                z.next_in_index = p;
                s.write = q;
                return s.inflate_flush(z, r);
              }
              n--;
              b |= (z.read_byte(p++) & 0xff) << k;
              k += 8;
            }

            tindex = (tree_index + (b & inflate_mask[j])) * 3;
            b >>= tree[tindex + 1];
            k -= tree[tindex + 1];
            e = tree[tindex];

            if ((e & 16) !== 0) {
              // distance
              get = e & 15;
              dist = tree[tindex + 2];
              mode = DISTEXT;
              break;
            }

            if ((e & 64) === 0) {
              // next table
              need = e;
              tree_index = tindex / 3 + tree[tindex + 2];
              break;
            }

            mode = BADCODE; // invalid code

            z.msg = "invalid distance code";
            r = Z_DATA_ERROR;
            s.bitb = b;
            s.bitk = k;
            z.avail_in = n;
            z.total_in += p - z.next_in_index;
            z.next_in_index = p;
            s.write = q;
            return s.inflate_flush(z, r);

          case DISTEXT:
            // i: getting distance extra
            j = get;

            while (k < j) {
              if (n !== 0) r = Z_OK;else {
                s.bitb = b;
                s.bitk = k;
                z.avail_in = n;
                z.total_in += p - z.next_in_index;
                z.next_in_index = p;
                s.write = q;
                return s.inflate_flush(z, r);
              }
              n--;
              b |= (z.read_byte(p++) & 0xff) << k;
              k += 8;
            }

            dist += b & inflate_mask[j];
            b >>= j;
            k -= j;
            mode = COPY;

          /* falls through */

          case COPY:
            // o: copying bytes in window, waiting for space
            f = q - dist;

            while (f < 0) {
              // modulo window size-"while" instead
              f += s.end; // of "if" handles invalid distances
            }

            while (len !== 0) {
              if (m === 0) {
                if (q == s.end && s.read !== 0) {
                  q = 0;
                  m = q < s.read ? s.read - q - 1 : s.end - q;
                }

                if (m === 0) {
                  s.write = q;
                  r = s.inflate_flush(z, r);
                  q = s.write;
                  m = q < s.read ? s.read - q - 1 : s.end - q;

                  if (q == s.end && s.read !== 0) {
                    q = 0;
                    m = q < s.read ? s.read - q - 1 : s.end - q;
                  }

                  if (m === 0) {
                    s.bitb = b;
                    s.bitk = k;
                    z.avail_in = n;
                    z.total_in += p - z.next_in_index;
                    z.next_in_index = p;
                    s.write = q;
                    return s.inflate_flush(z, r);
                  }
                }
              }

              s.window[q++] = s.window[f++];
              m--;
              if (f == s.end) f = 0;
              len--;
            }

            mode = START;
            break;

          case LIT:
            // o: got literal, waiting for output space
            if (m === 0) {
              if (q == s.end && s.read !== 0) {
                q = 0;
                m = q < s.read ? s.read - q - 1 : s.end - q;
              }

              if (m === 0) {
                s.write = q;
                r = s.inflate_flush(z, r);
                q = s.write;
                m = q < s.read ? s.read - q - 1 : s.end - q;

                if (q == s.end && s.read !== 0) {
                  q = 0;
                  m = q < s.read ? s.read - q - 1 : s.end - q;
                }

                if (m === 0) {
                  s.bitb = b;
                  s.bitk = k;
                  z.avail_in = n;
                  z.total_in += p - z.next_in_index;
                  z.next_in_index = p;
                  s.write = q;
                  return s.inflate_flush(z, r);
                }
              }
            }

            r = Z_OK;
            s.window[q++] =
            /* (byte) */
            lit;
            m--;
            mode = START;
            break;

          case WASH:
            // o: got eob, possibly more output
            if (k > 7) {
              // return unused byte, if any
              k -= 8;
              n++;
              p--; // can always return one
            }

            s.write = q;
            r = s.inflate_flush(z, r);
            q = s.write;
            m = q < s.read ? s.read - q - 1 : s.end - q;

            if (s.read != s.write) {
              s.bitb = b;
              s.bitk = k;
              z.avail_in = n;
              z.total_in += p - z.next_in_index;
              z.next_in_index = p;
              s.write = q;
              return s.inflate_flush(z, r);
            }

            mode = END;

          /* falls through */

          case END:
            r = Z_STREAM_END;
            s.bitb = b;
            s.bitk = k;
            z.avail_in = n;
            z.total_in += p - z.next_in_index;
            z.next_in_index = p;
            s.write = q;
            return s.inflate_flush(z, r);

          case BADCODE:
            // x: got error
            r = Z_DATA_ERROR;
            s.bitb = b;
            s.bitk = k;
            z.avail_in = n;
            z.total_in += p - z.next_in_index;
            z.next_in_index = p;
            s.write = q;
            return s.inflate_flush(z, r);

          default:
            r = Z_STREAM_ERROR;
            s.bitb = b;
            s.bitk = k;
            z.avail_in = n;
            z.total_in += p - z.next_in_index;
            z.next_in_index = p;
            s.write = q;
            return s.inflate_flush(z, r);
        }
      }
    };

    that.free = function () {// ZFREE(z, c);
    };
  } // InfBlocks
  // Table for deflate from PKZIP's appnote.txt.


  var border = [// Order of the bit length code lengths
  16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
  var TYPE = 0; // get type bits (3, including end bit)

  var LENS = 1; // get lengths for stored

  var STORED = 2; // processing stored block

  var TABLE = 3; // get table lengths

  var BTREE = 4; // get bit lengths tree for a dynamic
  // block

  var DTREE = 5; // get length, distance trees for a
  // dynamic block

  var CODES = 6; // processing fixed or dynamic block

  var DRY = 7; // output remaining window bytes

  var DONELOCKS = 8; // finished last block, done

  var BADBLOCKS = 9; // ot a data error--stuck here

  function InfBlocks(z, w) {
    var that = this;
    var mode = TYPE; // current inflate_block mode

    var left = 0; // if STORED, bytes left to copy

    var table = 0; // table lengths (14 bits)

    var index = 0; // index into blens (or border)

    var blens; // bit lengths of codes

    var bb = [0]; // bit length tree depth

    var tb = [0]; // bit length decoding tree

    var codes = new InfCodes(); // if CODES, current state

    var last = 0; // true if this block is the last block

    var hufts = new Int32Array(MANY * 3); // single malloc for tree space

    var check = 0; // check on output

    var inftree = new InfTree();
    that.bitk = 0; // bits in bit buffer

    that.bitb = 0; // bit buffer

    that.window = new Uint8Array(w); // sliding window

    that.end = w; // one byte after sliding window

    that.read = 0; // window read pointer

    that.write = 0; // window write pointer

    that.reset = function (z, c) {
      if (c) c[0] = check; // if (mode == BTREE || mode == DTREE) {
      // }

      if (mode == CODES) {
        codes.free(z);
      }

      mode = TYPE;
      that.bitk = 0;
      that.bitb = 0;
      that.read = that.write = 0;
    };

    that.reset(z, null); // copy as much as possible from the sliding window to the output area

    that.inflate_flush = function (z, r) {
      var n;
      var p;
      var q; // local copies of source and destination pointers

      p = z.next_out_index;
      q = that.read; // compute number of bytes to copy as far as end of window

      n =
      /* (int) */
      (q <= that.write ? that.write : that.end) - q;
      if (n > z.avail_out) n = z.avail_out;
      if (n !== 0 && r == Z_BUF_ERROR) r = Z_OK; // update counters

      z.avail_out -= n;
      z.total_out += n; // copy as far as end of window

      z.next_out.set(that.window.subarray(q, q + n), p);
      p += n;
      q += n; // see if more to copy at beginning of window

      if (q == that.end) {
        // wrap pointers
        q = 0;
        if (that.write == that.end) that.write = 0; // compute bytes to copy

        n = that.write - q;
        if (n > z.avail_out) n = z.avail_out;
        if (n !== 0 && r == Z_BUF_ERROR) r = Z_OK; // update counters

        z.avail_out -= n;
        z.total_out += n; // copy

        z.next_out.set(that.window.subarray(q, q + n), p);
        p += n;
        q += n;
      } // update pointers


      z.next_out_index = p;
      that.read = q; // done

      return r;
    };

    that.proc = function (z, r) {
      var t; // temporary storage

      var b; // bit buffer

      var k; // bits in bit buffer

      var p; // input data pointer

      var n; // bytes available there

      var q; // output window write pointer

      var m; // bytes to end of window or read pointer

      var i; // copy input/output information to locals (UPDATE macro restores)
      // {

      p = z.next_in_index;
      n = z.avail_in;
      b = that.bitb;
      k = that.bitk; // }
      // {

      q = that.write;
      m =
      /* (int) */
      q < that.read ? that.read - q - 1 : that.end - q; // }
      // process input based on current state
      // DEBUG dtree
      // eslint-disable-next-line no-constant-condition

      while (true) {
        var bl = void 0,
            bd = void 0,
            tl = void 0,
            td = void 0,
            bl_ = void 0,
            bd_ = void 0,
            tl_ = void 0,
            td_ = void 0;

        switch (mode) {
          case TYPE:
            while (k < 3) {
              if (n !== 0) {
                r = Z_OK;
              } else {
                that.bitb = b;
                that.bitk = k;
                z.avail_in = n;
                z.total_in += p - z.next_in_index;
                z.next_in_index = p;
                that.write = q;
                return that.inflate_flush(z, r);
              }

              n--;
              b |= (z.read_byte(p++) & 0xff) << k;
              k += 8;
            }

            t =
            /* (int) */
            b & 7;
            last = t & 1;

            switch (t >>> 1) {
              case 0:
                // stored
                // {
                b >>>= 3;
                k -= 3; // }

                t = k & 7; // go to byte boundary
                // {

                b >>>= t;
                k -= t; // }

                mode = LENS; // get length of stored block

                break;

              case 1:
                // fixed
                // {
                bl = []; // new Array(1);

                bd = []; // new Array(1);

                tl = [[]]; // new Array(1);

                td = [[]]; // new Array(1);

                InfTree.inflate_trees_fixed(bl, bd, tl, td);
                codes.init(bl[0], bd[0], tl[0], 0, td[0], 0); // }
                // {

                b >>>= 3;
                k -= 3; // }

                mode = CODES;
                break;

              case 2:
                // dynamic
                // {
                b >>>= 3;
                k -= 3; // }

                mode = TABLE;
                break;

              case 3:
                // illegal
                // {
                b >>>= 3;
                k -= 3; // }

                mode = BADBLOCKS;
                z.msg = "invalid block type";
                r = Z_DATA_ERROR;
                that.bitb = b;
                that.bitk = k;
                z.avail_in = n;
                z.total_in += p - z.next_in_index;
                z.next_in_index = p;
                that.write = q;
                return that.inflate_flush(z, r);
            }

            break;

          case LENS:
            while (k < 32) {
              if (n !== 0) {
                r = Z_OK;
              } else {
                that.bitb = b;
                that.bitk = k;
                z.avail_in = n;
                z.total_in += p - z.next_in_index;
                z.next_in_index = p;
                that.write = q;
                return that.inflate_flush(z, r);
              }

              n--;
              b |= (z.read_byte(p++) & 0xff) << k;
              k += 8;
            }

            if ((~b >>> 16 & 0xffff) != (b & 0xffff)) {
              mode = BADBLOCKS;
              z.msg = "invalid stored block lengths";
              r = Z_DATA_ERROR;
              that.bitb = b;
              that.bitk = k;
              z.avail_in = n;
              z.total_in += p - z.next_in_index;
              z.next_in_index = p;
              that.write = q;
              return that.inflate_flush(z, r);
            }

            left = b & 0xffff;
            b = k = 0; // dump bits

            mode = left !== 0 ? STORED : last !== 0 ? DRY : TYPE;
            break;

          case STORED:
            if (n === 0) {
              that.bitb = b;
              that.bitk = k;
              z.avail_in = n;
              z.total_in += p - z.next_in_index;
              z.next_in_index = p;
              that.write = q;
              return that.inflate_flush(z, r);
            }

            if (m === 0) {
              if (q == that.end && that.read !== 0) {
                q = 0;
                m =
                /* (int) */
                q < that.read ? that.read - q - 1 : that.end - q;
              }

              if (m === 0) {
                that.write = q;
                r = that.inflate_flush(z, r);
                q = that.write;
                m =
                /* (int) */
                q < that.read ? that.read - q - 1 : that.end - q;

                if (q == that.end && that.read !== 0) {
                  q = 0;
                  m =
                  /* (int) */
                  q < that.read ? that.read - q - 1 : that.end - q;
                }

                if (m === 0) {
                  that.bitb = b;
                  that.bitk = k;
                  z.avail_in = n;
                  z.total_in += p - z.next_in_index;
                  z.next_in_index = p;
                  that.write = q;
                  return that.inflate_flush(z, r);
                }
              }
            }

            r = Z_OK;
            t = left;
            if (t > n) t = n;
            if (t > m) t = m;
            that.window.set(z.read_buf(p, t), q);
            p += t;
            n -= t;
            q += t;
            m -= t;
            if ((left -= t) !== 0) break;
            mode = last !== 0 ? DRY : TYPE;
            break;

          case TABLE:
            while (k < 14) {
              if (n !== 0) {
                r = Z_OK;
              } else {
                that.bitb = b;
                that.bitk = k;
                z.avail_in = n;
                z.total_in += p - z.next_in_index;
                z.next_in_index = p;
                that.write = q;
                return that.inflate_flush(z, r);
              }

              n--;
              b |= (z.read_byte(p++) & 0xff) << k;
              k += 8;
            }

            table = t = b & 0x3fff;

            if ((t & 0x1f) > 29 || (t >> 5 & 0x1f) > 29) {
              mode = BADBLOCKS;
              z.msg = "too many length or distance symbols";
              r = Z_DATA_ERROR;
              that.bitb = b;
              that.bitk = k;
              z.avail_in = n;
              z.total_in += p - z.next_in_index;
              z.next_in_index = p;
              that.write = q;
              return that.inflate_flush(z, r);
            }

            t = 258 + (t & 0x1f) + (t >> 5 & 0x1f);

            if (!blens || blens.length < t) {
              blens = []; // new Array(t);
            } else {
              for (i = 0; i < t; i++) {
                blens[i] = 0;
              }
            } // {


            b >>>= 14;
            k -= 14; // }

            index = 0;
            mode = BTREE;

          /* falls through */

          case BTREE:
            while (index < 4 + (table >>> 10)) {
              while (k < 3) {
                if (n !== 0) {
                  r = Z_OK;
                } else {
                  that.bitb = b;
                  that.bitk = k;
                  z.avail_in = n;
                  z.total_in += p - z.next_in_index;
                  z.next_in_index = p;
                  that.write = q;
                  return that.inflate_flush(z, r);
                }

                n--;
                b |= (z.read_byte(p++) & 0xff) << k;
                k += 8;
              }

              blens[border[index++]] = b & 7; // {

              b >>>= 3;
              k -= 3; // }
            }

            while (index < 19) {
              blens[border[index++]] = 0;
            }

            bb[0] = 7;
            t = inftree.inflate_trees_bits(blens, bb, tb, hufts, z);

            if (t != Z_OK) {
              r = t;

              if (r == Z_DATA_ERROR) {
                blens = null;
                mode = BADBLOCKS;
              }

              that.bitb = b;
              that.bitk = k;
              z.avail_in = n;
              z.total_in += p - z.next_in_index;
              z.next_in_index = p;
              that.write = q;
              return that.inflate_flush(z, r);
            }

            index = 0;
            mode = DTREE;

          /* falls through */

          case DTREE:
            // eslint-disable-next-line no-constant-condition
            while (true) {
              t = table;

              if (index >= 258 + (t & 0x1f) + (t >> 5 & 0x1f)) {
                break;
              }

              var j = void 0,
                  c = void 0;
              t = bb[0];

              while (k < t) {
                if (n !== 0) {
                  r = Z_OK;
                } else {
                  that.bitb = b;
                  that.bitk = k;
                  z.avail_in = n;
                  z.total_in += p - z.next_in_index;
                  z.next_in_index = p;
                  that.write = q;
                  return that.inflate_flush(z, r);
                }

                n--;
                b |= (z.read_byte(p++) & 0xff) << k;
                k += 8;
              } // if (tb[0] == -1) {
              // System.err.println("null...");
              // }


              t = hufts[(tb[0] + (b & inflate_mask[t])) * 3 + 1];
              c = hufts[(tb[0] + (b & inflate_mask[t])) * 3 + 2];

              if (c < 16) {
                b >>>= t;
                k -= t;
                blens[index++] = c;
              } else {
                // c == 16..18
                i = c == 18 ? 7 : c - 14;
                j = c == 18 ? 11 : 3;

                while (k < t + i) {
                  if (n !== 0) {
                    r = Z_OK;
                  } else {
                    that.bitb = b;
                    that.bitk = k;
                    z.avail_in = n;
                    z.total_in += p - z.next_in_index;
                    z.next_in_index = p;
                    that.write = q;
                    return that.inflate_flush(z, r);
                  }

                  n--;
                  b |= (z.read_byte(p++) & 0xff) << k;
                  k += 8;
                }

                b >>>= t;
                k -= t;
                j += b & inflate_mask[i];
                b >>>= i;
                k -= i;
                i = index;
                t = table;

                if (i + j > 258 + (t & 0x1f) + (t >> 5 & 0x1f) || c == 16 && i < 1) {
                  blens = null;
                  mode = BADBLOCKS;
                  z.msg = "invalid bit length repeat";
                  r = Z_DATA_ERROR;
                  that.bitb = b;
                  that.bitk = k;
                  z.avail_in = n;
                  z.total_in += p - z.next_in_index;
                  z.next_in_index = p;
                  that.write = q;
                  return that.inflate_flush(z, r);
                }

                c = c == 16 ? blens[i - 1] : 0;

                do {
                  blens[i++] = c;
                } while (--j !== 0);

                index = i;
              }
            }

            tb[0] = -1; // {

            bl_ = []; // new Array(1);

            bd_ = []; // new Array(1);

            tl_ = []; // new Array(1);

            td_ = []; // new Array(1);

            bl_[0] = 9; // must be <= 9 for lookahead assumptions

            bd_[0] = 6; // must be <= 9 for lookahead assumptions

            t = table;
            t = inftree.inflate_trees_dynamic(257 + (t & 0x1f), 1 + (t >> 5 & 0x1f), blens, bl_, bd_, tl_, td_, hufts, z);

            if (t != Z_OK) {
              if (t == Z_DATA_ERROR) {
                blens = null;
                mode = BADBLOCKS;
              }

              r = t;
              that.bitb = b;
              that.bitk = k;
              z.avail_in = n;
              z.total_in += p - z.next_in_index;
              z.next_in_index = p;
              that.write = q;
              return that.inflate_flush(z, r);
            }

            codes.init(bl_[0], bd_[0], hufts, tl_[0], hufts, td_[0]); // }

            mode = CODES;

          /* falls through */

          case CODES:
            that.bitb = b;
            that.bitk = k;
            z.avail_in = n;
            z.total_in += p - z.next_in_index;
            z.next_in_index = p;
            that.write = q;

            if ((r = codes.proc(that, z, r)) != Z_STREAM_END) {
              return that.inflate_flush(z, r);
            }

            r = Z_OK;
            codes.free(z);
            p = z.next_in_index;
            n = z.avail_in;
            b = that.bitb;
            k = that.bitk;
            q = that.write;
            m =
            /* (int) */
            q < that.read ? that.read - q - 1 : that.end - q;

            if (last === 0) {
              mode = TYPE;
              break;
            }

            mode = DRY;

          /* falls through */

          case DRY:
            that.write = q;
            r = that.inflate_flush(z, r);
            q = that.write;
            m =
            /* (int) */
            q < that.read ? that.read - q - 1 : that.end - q;

            if (that.read != that.write) {
              that.bitb = b;
              that.bitk = k;
              z.avail_in = n;
              z.total_in += p - z.next_in_index;
              z.next_in_index = p;
              that.write = q;
              return that.inflate_flush(z, r);
            }

            mode = DONELOCKS;

          /* falls through */

          case DONELOCKS:
            r = Z_STREAM_END;
            that.bitb = b;
            that.bitk = k;
            z.avail_in = n;
            z.total_in += p - z.next_in_index;
            z.next_in_index = p;
            that.write = q;
            return that.inflate_flush(z, r);

          case BADBLOCKS:
            r = Z_DATA_ERROR;
            that.bitb = b;
            that.bitk = k;
            z.avail_in = n;
            z.total_in += p - z.next_in_index;
            z.next_in_index = p;
            that.write = q;
            return that.inflate_flush(z, r);

          default:
            r = Z_STREAM_ERROR;
            that.bitb = b;
            that.bitk = k;
            z.avail_in = n;
            z.total_in += p - z.next_in_index;
            z.next_in_index = p;
            that.write = q;
            return that.inflate_flush(z, r);
        }
      }
    };

    that.free = function (z) {
      that.reset(z, null);
      that.window = null;
      hufts = null; // ZFREE(z, s);
    };

    that.set_dictionary = function (d, start, n) {
      that.window.set(d.subarray(start, start + n), 0);
      that.read = that.write = n;
    }; // Returns true if inflate is currently at the end of a block generated
    // by Z_SYNC_FLUSH or Z_FULL_FLUSH.


    that.sync_point = function () {
      return mode == LENS ? 1 : 0;
    };
  } // Inflate
  // preset dictionary flag in zlib header


  var PRESET_DICT = 0x20;
  var Z_DEFLATED = 8;
  var METHOD = 0; // waiting for method byte

  var FLAG = 1; // waiting for flag byte

  var DICT4 = 2; // four dictionary check bytes to go

  var DICT3 = 3; // three dictionary check bytes to go

  var DICT2 = 4; // two dictionary check bytes to go

  var DICT1 = 5; // one dictionary check byte to go

  var DICT0 = 6; // waiting for inflateSetDictionary

  var BLOCKS = 7; // decompressing blocks

  var DONE = 12; // finished check, done

  var BAD = 13; // got an error--stay here

  var mark = [0, 0, 0xff, 0xff];

  function Inflate$1() {
    var that = this;
    that.mode = 0; // current inflate mode
    // mode dependent information

    that.method = 0; // if FLAGS, method byte
    // if CHECK, check values to compare

    that.was = [0]; // new Array(1); // computed check value

    that.need = 0; // stream check value
    // if BAD, inflateSync's marker bytes count

    that.marker = 0; // mode independent information

    that.wbits = 0; // log2(window size) (8..15, defaults to 15)
    // this.blocks; // current inflate_blocks state

    function inflateReset(z) {
      if (!z || !z.istate) return Z_STREAM_ERROR;
      z.total_in = z.total_out = 0;
      z.msg = null;
      z.istate.mode = BLOCKS;
      z.istate.blocks.reset(z, null);
      return Z_OK;
    }

    that.inflateEnd = function (z) {
      if (that.blocks) that.blocks.free(z);
      that.blocks = null; // ZFREE(z, z->state);

      return Z_OK;
    };

    that.inflateInit = function (z, w) {
      z.msg = null;
      that.blocks = null; // set window size

      if (w < 8 || w > 15) {
        that.inflateEnd(z);
        return Z_STREAM_ERROR;
      }

      that.wbits = w;
      z.istate.blocks = new InfBlocks(z, 1 << w); // reset state

      inflateReset(z);
      return Z_OK;
    };

    that.inflate = function (z, f) {
      var r;
      var b;
      if (!z || !z.istate || !z.next_in) return Z_STREAM_ERROR;
      var istate = z.istate;
      f = f == Z_FINISH ? Z_BUF_ERROR : Z_OK;
      r = Z_BUF_ERROR; // eslint-disable-next-line no-constant-condition

      while (true) {
        switch (istate.mode) {
          case METHOD:
            if (z.avail_in === 0) return r;
            r = f;
            z.avail_in--;
            z.total_in++;

            if (((istate.method = z.read_byte(z.next_in_index++)) & 0xf) != Z_DEFLATED) {
              istate.mode = BAD;
              z.msg = "unknown compression method";
              istate.marker = 5; // can't try inflateSync

              break;
            }

            if ((istate.method >> 4) + 8 > istate.wbits) {
              istate.mode = BAD;
              z.msg = "invalid window size";
              istate.marker = 5; // can't try inflateSync

              break;
            }

            istate.mode = FLAG;

          /* falls through */

          case FLAG:
            if (z.avail_in === 0) return r;
            r = f;
            z.avail_in--;
            z.total_in++;
            b = z.read_byte(z.next_in_index++) & 0xff;

            if (((istate.method << 8) + b) % 31 !== 0) {
              istate.mode = BAD;
              z.msg = "incorrect header check";
              istate.marker = 5; // can't try inflateSync

              break;
            }

            if ((b & PRESET_DICT) === 0) {
              istate.mode = BLOCKS;
              break;
            }

            istate.mode = DICT4;

          /* falls through */

          case DICT4:
            if (z.avail_in === 0) return r;
            r = f;
            z.avail_in--;
            z.total_in++;
            istate.need = (z.read_byte(z.next_in_index++) & 0xff) << 24 & 0xff000000;
            istate.mode = DICT3;

          /* falls through */

          case DICT3:
            if (z.avail_in === 0) return r;
            r = f;
            z.avail_in--;
            z.total_in++;
            istate.need += (z.read_byte(z.next_in_index++) & 0xff) << 16 & 0xff0000;
            istate.mode = DICT2;

          /* falls through */

          case DICT2:
            if (z.avail_in === 0) return r;
            r = f;
            z.avail_in--;
            z.total_in++;
            istate.need += (z.read_byte(z.next_in_index++) & 0xff) << 8 & 0xff00;
            istate.mode = DICT1;

          /* falls through */

          case DICT1:
            if (z.avail_in === 0) return r;
            r = f;
            z.avail_in--;
            z.total_in++;
            istate.need += z.read_byte(z.next_in_index++) & 0xff;
            istate.mode = DICT0;
            return Z_NEED_DICT;

          case DICT0:
            istate.mode = BAD;
            z.msg = "need dictionary";
            istate.marker = 0; // can try inflateSync

            return Z_STREAM_ERROR;

          case BLOCKS:
            r = istate.blocks.proc(z, r);

            if (r == Z_DATA_ERROR) {
              istate.mode = BAD;
              istate.marker = 0; // can try inflateSync

              break;
            }

            if (r == Z_OK) {
              r = f;
            }

            if (r != Z_STREAM_END) {
              return r;
            }

            r = f;
            istate.blocks.reset(z, istate.was);
            istate.mode = DONE;

          /* falls through */

          case DONE:
            return Z_STREAM_END;

          case BAD:
            return Z_DATA_ERROR;

          default:
            return Z_STREAM_ERROR;
        }
      }
    };

    that.inflateSetDictionary = function (z, dictionary, dictLength) {
      var index = 0,
          length = dictLength;
      if (!z || !z.istate || z.istate.mode != DICT0) return Z_STREAM_ERROR;
      var istate = z.istate;

      if (length >= 1 << istate.wbits) {
        length = (1 << istate.wbits) - 1;
        index = dictLength - length;
      }

      istate.blocks.set_dictionary(dictionary, index, length);
      istate.mode = BLOCKS;
      return Z_OK;
    };

    that.inflateSync = function (z) {
      var n; // number of bytes to look at

      var p; // pointer to bytes

      var m; // number of marker bytes found in a row

      var r, w; // temporaries to save total_in and total_out
      // set up

      if (!z || !z.istate) return Z_STREAM_ERROR;
      var istate = z.istate;

      if (istate.mode != BAD) {
        istate.mode = BAD;
        istate.marker = 0;
      }

      if ((n = z.avail_in) === 0) return Z_BUF_ERROR;
      p = z.next_in_index;
      m = istate.marker; // search

      while (n !== 0 && m < 4) {
        if (z.read_byte(p) == mark[m]) {
          m++;
        } else if (z.read_byte(p) !== 0) {
          m = 0;
        } else {
          m = 4 - m;
        }

        p++;
        n--;
      } // restore


      z.total_in += p - z.next_in_index;
      z.next_in_index = p;
      z.avail_in = n;
      istate.marker = m; // return no joy or set up to restart on a new block

      if (m != 4) {
        return Z_DATA_ERROR;
      }

      r = z.total_in;
      w = z.total_out;
      inflateReset(z);
      z.total_in = r;
      z.total_out = w;
      istate.mode = BLOCKS;
      return Z_OK;
    }; // Returns true if inflate is currently at the end of a block generated
    // by Z_SYNC_FLUSH or Z_FULL_FLUSH. This function is used by one PPP
    // implementation to provide an additional safety check. PPP uses
    // Z_SYNC_FLUSH
    // but removes the length bytes of the resulting empty stored block. When
    // decompressing, PPP checks that at the end of input packet, inflate is
    // waiting for these length bytes.


    that.inflateSyncPoint = function (z) {
      if (!z || !z.istate || !z.istate.blocks) return Z_STREAM_ERROR;
      return z.istate.blocks.sync_point();
    };
  } // ZStream


  function ZStream() {}

  ZStream.prototype = {
    inflateInit: function inflateInit(bits) {
      var that = this;
      that.istate = new Inflate$1();
      if (!bits) bits = MAX_BITS;
      return that.istate.inflateInit(that, bits);
    },
    inflate: function inflate(f) {
      var that = this;
      if (!that.istate) return Z_STREAM_ERROR;
      return that.istate.inflate(that, f);
    },
    inflateEnd: function inflateEnd() {
      var that = this;
      if (!that.istate) return Z_STREAM_ERROR;
      var ret = that.istate.inflateEnd(that);
      that.istate = null;
      return ret;
    },
    inflateSync: function inflateSync() {
      var that = this;
      if (!that.istate) return Z_STREAM_ERROR;
      return that.istate.inflateSync(that);
    },
    inflateSetDictionary: function inflateSetDictionary(dictionary, dictLength) {
      var that = this;
      if (!that.istate) return Z_STREAM_ERROR;
      return that.istate.inflateSetDictionary(that, dictionary, dictLength);
    },
    read_byte: function read_byte(start) {
      var that = this;
      return that.next_in[start];
    },
    read_buf: function read_buf(start, size) {
      var that = this;
      return that.next_in.subarray(start, start + size);
    }
  }; // Inflater

  function ZipInflate(options) {
    var that = this;
    var z = new ZStream();
    var bufsize = options && options.chunkSize ? Math.floor(options.chunkSize * 2) : 128 * 1024;
    var flush = Z_NO_FLUSH;
    var buf = new Uint8Array(bufsize);
    var nomoreinput = false;
    z.inflateInit();
    z.next_out = buf;

    that.append = function (data, onprogress) {
      var buffers = [];
      var err,
          array,
          lastIndex = 0,
          bufferIndex = 0,
          bufferSize = 0;
      if (data.length === 0) return;
      z.next_in_index = 0;
      z.next_in = data;
      z.avail_in = data.length;

      do {
        z.next_out_index = 0;
        z.avail_out = bufsize;

        if (z.avail_in === 0 && !nomoreinput) {
          // if buffer is empty and more input is available, refill it
          z.next_in_index = 0;
          nomoreinput = true;
        }

        err = z.inflate(flush);

        if (nomoreinput && err === Z_BUF_ERROR) {
          if (z.avail_in !== 0) throw new Error("inflating: bad input");
        } else if (err !== Z_OK && err !== Z_STREAM_END) throw new Error("inflating: " + z.msg);

        if ((nomoreinput || err === Z_STREAM_END) && z.avail_in === data.length) throw new Error("inflating: bad input");
        if (z.next_out_index) if (z.next_out_index === bufsize) buffers.push(new Uint8Array(buf));else buffers.push(buf.slice(0, z.next_out_index));
        bufferSize += z.next_out_index;

        if (onprogress && z.next_in_index > 0 && z.next_in_index != lastIndex) {
          onprogress(z.next_in_index);
          lastIndex = z.next_in_index;
        }
      } while (z.avail_in > 0 || z.avail_out === 0);

      if (buffers.length > 1) {
        array = new Uint8Array(bufferSize);
        buffers.forEach(function (chunk) {
          array.set(chunk, bufferIndex);
          bufferIndex += chunk.length;
        });
      } else {
        array = buffers[0] || new Uint8Array(0);
      }

      return array;
    };

    that.flush = function () {
      z.inflateEnd();
    };
  }

  var DESCRIPTORS$7 = descriptors;
  var uncurryThis$k = functionUncurryThis;
  var call$a = functionCall;
  var fails$g = fails$D;
  var objectKeys$2 = objectKeys$4;
  var getOwnPropertySymbolsModule$1 = objectGetOwnPropertySymbols;
  var propertyIsEnumerableModule$1 = objectPropertyIsEnumerable;
  var toObject$4 = toObject$d;
  var IndexedObject = indexedObject;

  // eslint-disable-next-line es/no-object-assign -- safe
  var $assign = Object.assign;
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  var defineProperty$6 = Object.defineProperty;
  var concat$2 = uncurryThis$k([].concat);

  // `Object.assign` method
  // https://tc39.es/ecma262/#sec-object.assign
  var objectAssign = !$assign || fails$g(function () {
    // should have correct order of operations (Edge bug)
    if (DESCRIPTORS$7 && $assign({ b: 1 }, $assign(defineProperty$6({}, 'a', {
      enumerable: true,
      get: function () {
        defineProperty$6(this, 'b', {
          value: 3,
          enumerable: false
        });
      }
    }), { b: 2 })).b !== 1) return true;
    // should work with symbols and should have deterministic property order (V8 bug)
    var A = {};
    var B = {};
    // eslint-disable-next-line es/no-symbol -- safe
    var symbol = Symbol();
    var alphabet = 'abcdefghijklmnopqrst';
    A[symbol] = 7;
    alphabet.split('').forEach(function (chr) { B[chr] = chr; });
    return $assign({}, A)[symbol] != 7 || objectKeys$2($assign({}, B)).join('') != alphabet;
  }) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
    var T = toObject$4(target);
    var argumentsLength = arguments.length;
    var index = 1;
    var getOwnPropertySymbols = getOwnPropertySymbolsModule$1.f;
    var propertyIsEnumerable = propertyIsEnumerableModule$1.f;
    while (argumentsLength > index) {
      var S = IndexedObject(arguments[index++]);
      var keys = getOwnPropertySymbols ? concat$2(objectKeys$2(S), getOwnPropertySymbols(S)) : objectKeys$2(S);
      var length = keys.length;
      var j = 0;
      var key;
      while (length > j) {
        key = keys[j++];
        if (!DESCRIPTORS$7 || call$a(propertyIsEnumerable, S, key)) T[key] = S[key];
      }
    } return T;
  } : $assign;

  var $$j = _export;
  var assign$1 = objectAssign;

  // `Object.assign` method
  // https://tc39.es/ecma262/#sec-object.assign
  // eslint-disable-next-line es/no-object-assign -- required for testing
  $$j({ target: 'Object', stat: true, forced: Object.assign !== assign$1 }, {
    assign: assign$1
  });

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  var DEFAULT_CONFIGURATION = {
    chunkSize: 512 * 1024,
    maxWorkers: typeof navigator != "undefined" && navigator.hardwareConcurrency || 2,
    terminateWorkerTimeout: 5000,
    useWebWorkers: true,
    workerScripts: undefined
  };
  var config = Object.assign({}, DEFAULT_CONFIGURATION);

  function getConfiguration() {
    return config;
  }

  function configure(configuration) {
    if (configuration.baseURL !== undefined) {
      config.baseURL = configuration.baseURL;
    }

    if (configuration.chunkSize !== undefined) {
      config.chunkSize = configuration.chunkSize;
    }

    if (configuration.maxWorkers !== undefined) {
      config.maxWorkers = configuration.maxWorkers;
    }

    if (configuration.terminateWorkerTimeout !== undefined) {
      config.terminateWorkerTimeout = configuration.terminateWorkerTimeout;
    }

    if (configuration.useWebWorkers !== undefined) {
      config.useWebWorkers = configuration.useWebWorkers;
    }

    if (configuration.Deflate !== undefined) {
      config.Deflate = configuration.Deflate;
    }

    if (configuration.Inflate !== undefined) {
      config.Inflate = configuration.Inflate;
    }

    if (configuration.workerScripts !== undefined) {
      if (configuration.workerScripts.deflate) {
        if (!Array.isArray(configuration.workerScripts.deflate)) {
          throw new Error("workerScripts.deflate must be an array");
        }

        if (!config.workerScripts) {
          config.workerScripts = {};
        }

        config.workerScripts.deflate = configuration.workerScripts.deflate;
      }

      if (configuration.workerScripts.inflate) {
        if (!Array.isArray(configuration.workerScripts.inflate)) {
          throw new Error("workerScripts.inflate must be an array");
        }

        if (!config.workerScripts) {
          config.workerScripts = {};
        }

        config.workerScripts.inflate = configuration.workerScripts.inflate;
      }
    }
  }

  var global$s = global$19;
  var classof$6 = classof$c;

  var String$2 = global$s.String;

  var toString$9 = function (argument) {
    if (classof$6(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
    return String$2(argument);
  };

  var anObject$9 = anObject$i;

  // `RegExp.prototype.flags` getter implementation
  // https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
  var regexpFlags$1 = function () {
    var that = anObject$9(this);
    var result = '';
    if (that.global) result += 'g';
    if (that.ignoreCase) result += 'i';
    if (that.multiline) result += 'm';
    if (that.dotAll) result += 's';
    if (that.unicode) result += 'u';
    if (that.sticky) result += 'y';
    return result;
  };

  var fails$f = fails$D;
  var global$r = global$19;

  // babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
  var $RegExp$2 = global$r.RegExp;

  var UNSUPPORTED_Y$2 = fails$f(function () {
    var re = $RegExp$2('a', 'y');
    re.lastIndex = 2;
    return re.exec('abcd') != null;
  });

  // UC Browser bug
  // https://github.com/zloirock/core-js/issues/1008
  var MISSED_STICKY = UNSUPPORTED_Y$2 || fails$f(function () {
    return !$RegExp$2('a', 'y').sticky;
  });

  var BROKEN_CARET = UNSUPPORTED_Y$2 || fails$f(function () {
    // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
    var re = $RegExp$2('^r', 'gy');
    re.lastIndex = 2;
    return re.exec('str') != null;
  });

  var regexpStickyHelpers = {
    BROKEN_CARET: BROKEN_CARET,
    MISSED_STICKY: MISSED_STICKY,
    UNSUPPORTED_Y: UNSUPPORTED_Y$2
  };

  var fails$e = fails$D;
  var global$q = global$19;

  // babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
  var $RegExp$1 = global$q.RegExp;

  var regexpUnsupportedDotAll = fails$e(function () {
    var re = $RegExp$1('.', 's');
    return !(re.dotAll && re.exec('\n') && re.flags === 's');
  });

  var fails$d = fails$D;
  var global$p = global$19;

  // babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
  var $RegExp = global$p.RegExp;

  var regexpUnsupportedNcg = fails$d(function () {
    var re = $RegExp('(?<a>b)', 'g');
    return re.exec('b').groups.a !== 'b' ||
      'b'.replace(re, '$<a>c') !== 'bc';
  });

  /* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
  /* eslint-disable regexp/no-useless-quantifier -- testing */
  var call$9 = functionCall;
  var uncurryThis$j = functionUncurryThis;
  var toString$8 = toString$9;
  var regexpFlags = regexpFlags$1;
  var stickyHelpers$1 = regexpStickyHelpers;
  var shared$1 = shared$5.exports;
  var create$2 = objectCreate;
  var getInternalState$3 = internalState.get;
  var UNSUPPORTED_DOT_ALL = regexpUnsupportedDotAll;
  var UNSUPPORTED_NCG = regexpUnsupportedNcg;

  var nativeReplace = shared$1('native-string-replace', String.prototype.replace);
  var nativeExec = RegExp.prototype.exec;
  var patchedExec = nativeExec;
  var charAt$6 = uncurryThis$j(''.charAt);
  var indexOf = uncurryThis$j(''.indexOf);
  var replace$6 = uncurryThis$j(''.replace);
  var stringSlice$8 = uncurryThis$j(''.slice);

  var UPDATES_LAST_INDEX_WRONG = (function () {
    var re1 = /a/;
    var re2 = /b*/g;
    call$9(nativeExec, re1, 'a');
    call$9(nativeExec, re2, 'a');
    return re1.lastIndex !== 0 || re2.lastIndex !== 0;
  })();

  var UNSUPPORTED_Y$1 = stickyHelpers$1.BROKEN_CARET;

  // nonparticipating capturing group, copied from es5-shim's String#split patch.
  var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

  var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1 || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

  if (PATCH) {
    patchedExec = function exec(string) {
      var re = this;
      var state = getInternalState$3(re);
      var str = toString$8(string);
      var raw = state.raw;
      var result, reCopy, lastIndex, match, i, object, group;

      if (raw) {
        raw.lastIndex = re.lastIndex;
        result = call$9(patchedExec, raw, str);
        re.lastIndex = raw.lastIndex;
        return result;
      }

      var groups = state.groups;
      var sticky = UNSUPPORTED_Y$1 && re.sticky;
      var flags = call$9(regexpFlags, re);
      var source = re.source;
      var charsAdded = 0;
      var strCopy = str;

      if (sticky) {
        flags = replace$6(flags, 'y', '');
        if (indexOf(flags, 'g') === -1) {
          flags += 'g';
        }

        strCopy = stringSlice$8(str, re.lastIndex);
        // Support anchored sticky behavior.
        if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt$6(str, re.lastIndex - 1) !== '\n')) {
          source = '(?: ' + source + ')';
          strCopy = ' ' + strCopy;
          charsAdded++;
        }
        // ^(? + rx + ) is needed, in combination with some str slicing, to
        // simulate the 'y' flag.
        reCopy = new RegExp('^(?:' + source + ')', flags);
      }

      if (NPCG_INCLUDED) {
        reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
      }
      if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

      match = call$9(nativeExec, sticky ? reCopy : re, strCopy);

      if (sticky) {
        if (match) {
          match.input = stringSlice$8(match.input, charsAdded);
          match[0] = stringSlice$8(match[0], charsAdded);
          match.index = re.lastIndex;
          re.lastIndex += match[0].length;
        } else re.lastIndex = 0;
      } else if (UPDATES_LAST_INDEX_WRONG && match) {
        re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
      }
      if (NPCG_INCLUDED && match && match.length > 1) {
        // Fix browsers whose `exec` methods don't consistently return `undefined`
        // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
        call$9(nativeReplace, match[0], reCopy, function () {
          for (i = 1; i < arguments.length - 2; i++) {
            if (arguments[i] === undefined) match[i] = undefined;
          }
        });
      }

      if (match && groups) {
        match.groups = object = create$2(null);
        for (i = 0; i < groups.length; i++) {
          group = groups[i];
          object[group[0]] = match[group[1]];
        }
      }

      return match;
    };
  }

  var regexpExec$3 = patchedExec;

  var $$i = _export;
  var exec$3 = regexpExec$3;

  // `RegExp.prototype.exec` method
  // https://tc39.es/ecma262/#sec-regexp.prototype.exec
  $$i({ target: 'RegExp', proto: true, forced: /./.exec !== exec$3 }, {
    exec: exec$3
  });

  // TODO: Remove from `core-js@4` since it's moved to entry points

  var uncurryThis$i = functionUncurryThis;
  var redefine$6 = redefine$d.exports;
  var regexpExec$2 = regexpExec$3;
  var fails$c = fails$D;
  var wellKnownSymbol$9 = wellKnownSymbol$s;
  var createNonEnumerableProperty$2 = createNonEnumerableProperty$a;

  var SPECIES$1 = wellKnownSymbol$9('species');
  var RegExpPrototype = RegExp.prototype;

  var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
    var SYMBOL = wellKnownSymbol$9(KEY);

    var DELEGATES_TO_SYMBOL = !fails$c(function () {
      // String methods call symbol-named RegEp methods
      var O = {};
      O[SYMBOL] = function () { return 7; };
      return ''[KEY](O) != 7;
    });

    var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails$c(function () {
      // Symbol-named RegExp methods call .exec
      var execCalled = false;
      var re = /a/;

      if (KEY === 'split') {
        // We can't use real regex here since it causes deoptimization
        // and serious performance degradation in V8
        // https://github.com/zloirock/core-js/issues/306
        re = {};
        // RegExp[@@split] doesn't call the regex's exec method, but first creates
        // a new one. We need to return the patched regex when creating the new one.
        re.constructor = {};
        re.constructor[SPECIES$1] = function () { return re; };
        re.flags = '';
        re[SYMBOL] = /./[SYMBOL];
      }

      re.exec = function () { execCalled = true; return null; };

      re[SYMBOL]('');
      return !execCalled;
    });

    if (
      !DELEGATES_TO_SYMBOL ||
      !DELEGATES_TO_EXEC ||
      FORCED
    ) {
      var uncurriedNativeRegExpMethod = uncurryThis$i(/./[SYMBOL]);
      var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
        var uncurriedNativeMethod = uncurryThis$i(nativeMethod);
        var $exec = regexp.exec;
        if ($exec === regexpExec$2 || $exec === RegExpPrototype.exec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: uncurriedNativeRegExpMethod(regexp, str, arg2) };
          }
          return { done: true, value: uncurriedNativeMethod(str, regexp, arg2) };
        }
        return { done: false };
      });

      redefine$6(String.prototype, KEY, methods[0]);
      redefine$6(RegExpPrototype, SYMBOL, methods[1]);
    }

    if (SHAM) createNonEnumerableProperty$2(RegExpPrototype[SYMBOL], 'sham', true);
  };

  var isObject$7 = isObject$k;
  var classof$5 = classofRaw$1;
  var wellKnownSymbol$8 = wellKnownSymbol$s;

  var MATCH$1 = wellKnownSymbol$8('match');

  // `IsRegExp` abstract operation
  // https://tc39.es/ecma262/#sec-isregexp
  var isRegexp = function (it) {
    var isRegExp;
    return isObject$7(it) && ((isRegExp = it[MATCH$1]) !== undefined ? !!isRegExp : classof$5(it) == 'RegExp');
  };

  var uncurryThis$h = functionUncurryThis;
  var toIntegerOrInfinity$2 = toIntegerOrInfinity$9;
  var toString$7 = toString$9;
  var requireObjectCoercible$5 = requireObjectCoercible$8;

  var charAt$5 = uncurryThis$h(''.charAt);
  var charCodeAt$2 = uncurryThis$h(''.charCodeAt);
  var stringSlice$7 = uncurryThis$h(''.slice);

  var createMethod$2 = function (CONVERT_TO_STRING) {
    return function ($this, pos) {
      var S = toString$7(requireObjectCoercible$5($this));
      var position = toIntegerOrInfinity$2(pos);
      var size = S.length;
      var first, second;
      if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
      first = charCodeAt$2(S, position);
      return first < 0xD800 || first > 0xDBFF || position + 1 === size
        || (second = charCodeAt$2(S, position + 1)) < 0xDC00 || second > 0xDFFF
          ? CONVERT_TO_STRING
            ? charAt$5(S, position)
            : first
          : CONVERT_TO_STRING
            ? stringSlice$7(S, position, position + 2)
            : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
    };
  };

  var stringMultibyte = {
    // `String.prototype.codePointAt` method
    // https://tc39.es/ecma262/#sec-string.prototype.codepointat
    codeAt: createMethod$2(false),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: createMethod$2(true)
  };

  var charAt$4 = stringMultibyte.charAt;

  // `AdvanceStringIndex` abstract operation
  // https://tc39.es/ecma262/#sec-advancestringindex
  var advanceStringIndex$2 = function (S, index, unicode) {
    return index + (unicode ? charAt$4(S, index).length : 1);
  };

  var global$o = global$19;
  var call$8 = functionCall;
  var anObject$8 = anObject$i;
  var isCallable$7 = isCallable$p;
  var classof$4 = classofRaw$1;
  var regexpExec$1 = regexpExec$3;

  var TypeError$a = global$o.TypeError;

  // `RegExpExec` abstract operation
  // https://tc39.es/ecma262/#sec-regexpexec
  var regexpExecAbstract = function (R, S) {
    var exec = R.exec;
    if (isCallable$7(exec)) {
      var result = call$8(exec, R, S);
      if (result !== null) anObject$8(result);
      return result;
    }
    if (classof$4(R) === 'RegExp') return call$8(regexpExec$1, R, S);
    throw TypeError$a('RegExp#exec called on incompatible receiver');
  };

  var apply$3 = functionApply;
  var call$7 = functionCall;
  var uncurryThis$g = functionUncurryThis;
  var fixRegExpWellKnownSymbolLogic$1 = fixRegexpWellKnownSymbolLogic;
  var isRegExp$1 = isRegexp;
  var anObject$7 = anObject$i;
  var requireObjectCoercible$4 = requireObjectCoercible$8;
  var speciesConstructor$1 = speciesConstructor$4;
  var advanceStringIndex$1 = advanceStringIndex$2;
  var toLength$3 = toLength$a;
  var toString$6 = toString$9;
  var getMethod$2 = getMethod$5;
  var arraySlice$5 = arraySliceSimple;
  var callRegExpExec = regexpExecAbstract;
  var regexpExec = regexpExec$3;
  var stickyHelpers = regexpStickyHelpers;
  var fails$b = fails$D;

  var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
  var MAX_UINT32 = 0xFFFFFFFF;
  var min$4 = Math.min;
  var $push = [].push;
  var exec$2 = uncurryThis$g(/./.exec);
  var push$6 = uncurryThis$g($push);
  var stringSlice$6 = uncurryThis$g(''.slice);

  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  // Weex JS has frozen built-in prototypes, so use try / catch wrapper
  var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails$b(function () {
    // eslint-disable-next-line regexp/no-empty-group -- required for testing
    var re = /(?:)/;
    var originalExec = re.exec;
    re.exec = function () { return originalExec.apply(this, arguments); };
    var result = 'ab'.split(re);
    return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
  });

  // @@split logic
  fixRegExpWellKnownSymbolLogic$1('split', function (SPLIT, nativeSplit, maybeCallNative) {
    var internalSplit;
    if (
      'abbc'.split(/(b)*/)[1] == 'c' ||
      // eslint-disable-next-line regexp/no-empty-group -- required for testing
      'test'.split(/(?:)/, -1).length != 4 ||
      'ab'.split(/(?:ab)*/).length != 2 ||
      '.'.split(/(.?)(.?)/).length != 4 ||
      // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
      '.'.split(/()()/).length > 1 ||
      ''.split(/.?/).length
    ) {
      // based on es5-shim implementation, need to rework it
      internalSplit = function (separator, limit) {
        var string = toString$6(requireObjectCoercible$4(this));
        var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
        if (lim === 0) return [];
        if (separator === undefined) return [string];
        // If `separator` is not a regex, use native split
        if (!isRegExp$1(separator)) {
          return call$7(nativeSplit, string, separator, lim);
        }
        var output = [];
        var flags = (separator.ignoreCase ? 'i' : '') +
                    (separator.multiline ? 'm' : '') +
                    (separator.unicode ? 'u' : '') +
                    (separator.sticky ? 'y' : '');
        var lastLastIndex = 0;
        // Make `global` and avoid `lastIndex` issues by working with a copy
        var separatorCopy = new RegExp(separator.source, flags + 'g');
        var match, lastIndex, lastLength;
        while (match = call$7(regexpExec, separatorCopy, string)) {
          lastIndex = separatorCopy.lastIndex;
          if (lastIndex > lastLastIndex) {
            push$6(output, stringSlice$6(string, lastLastIndex, match.index));
            if (match.length > 1 && match.index < string.length) apply$3($push, output, arraySlice$5(match, 1));
            lastLength = match[0].length;
            lastLastIndex = lastIndex;
            if (output.length >= lim) break;
          }
          if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
        }
        if (lastLastIndex === string.length) {
          if (lastLength || !exec$2(separatorCopy, '')) push$6(output, '');
        } else push$6(output, stringSlice$6(string, lastLastIndex));
        return output.length > lim ? arraySlice$5(output, 0, lim) : output;
      };
    // Chakra, V8
    } else if ('0'.split(undefined, 0).length) {
      internalSplit = function (separator, limit) {
        return separator === undefined && limit === 0 ? [] : call$7(nativeSplit, this, separator, limit);
      };
    } else internalSplit = nativeSplit;

    return [
      // `String.prototype.split` method
      // https://tc39.es/ecma262/#sec-string.prototype.split
      function split(separator, limit) {
        var O = requireObjectCoercible$4(this);
        var splitter = separator == undefined ? undefined : getMethod$2(separator, SPLIT);
        return splitter
          ? call$7(splitter, separator, O, limit)
          : call$7(internalSplit, toString$6(O), separator, limit);
      },
      // `RegExp.prototype[@@split]` method
      // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
      //
      // NOTE: This cannot be properly polyfilled in engines that don't support
      // the 'y' flag.
      function (string, limit) {
        var rx = anObject$7(this);
        var S = toString$6(string);
        var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);

        if (res.done) return res.value;

        var C = speciesConstructor$1(rx, RegExp);

        var unicodeMatching = rx.unicode;
        var flags = (rx.ignoreCase ? 'i' : '') +
                    (rx.multiline ? 'm' : '') +
                    (rx.unicode ? 'u' : '') +
                    (UNSUPPORTED_Y ? 'g' : 'y');

        // ^(? + rx + ) is needed, in combination with some S slicing, to
        // simulate the 'y' flag.
        var splitter = new C(UNSUPPORTED_Y ? '^(?:' + rx.source + ')' : rx, flags);
        var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
        if (lim === 0) return [];
        if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
        var p = 0;
        var q = 0;
        var A = [];
        while (q < S.length) {
          splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
          var z = callRegExpExec(splitter, UNSUPPORTED_Y ? stringSlice$6(S, q) : S);
          var e;
          if (
            z === null ||
            (e = min$4(toLength$3(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p
          ) {
            q = advanceStringIndex$1(S, q, unicodeMatching);
          } else {
            push$6(A, stringSlice$6(S, p, q));
            if (A.length === lim) return A;
            for (var i = 1; i <= z.length - 1; i++) {
              push$6(A, z[i]);
              if (A.length === lim) return A;
            }
            q = p = e;
          }
        }
        push$6(A, stringSlice$6(S, p));
        return A;
      }
    ];
  }, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  var table$1 = {
    "application": {
      "andrew-inset": "ez",
      "annodex": "anx",
      "atom+xml": "atom",
      "atomcat+xml": "atomcat",
      "atomserv+xml": "atomsrv",
      "bbolin": "lin",
      "cap": ["cap", "pcap"],
      "cu-seeme": "cu",
      "davmount+xml": "davmount",
      "dsptype": "tsp",
      "ecmascript": ["es", "ecma"],
      "futuresplash": "spl",
      "hta": "hta",
      "java-archive": "jar",
      "java-serialized-object": "ser",
      "java-vm": "class",
      "javascript": "js",
      "m3g": "m3g",
      "mac-binhex40": "hqx",
      "mathematica": ["nb", "ma", "mb"],
      "msaccess": "mdb",
      "msword": ["doc", "dot"],
      "mxf": "mxf",
      "oda": "oda",
      "ogg": "ogx",
      "pdf": "pdf",
      "pgp-keys": "key",
      "pgp-signature": ["asc", "sig"],
      "pics-rules": "prf",
      "postscript": ["ps", "ai", "eps", "epsi", "epsf", "eps2", "eps3"],
      "rar": "rar",
      "rdf+xml": "rdf",
      "rss+xml": "rss",
      "rtf": "rtf",
      "smil": ["smi", "smil"],
      "xhtml+xml": ["xhtml", "xht"],
      "xml": ["xml", "xsl", "xsd"],
      "xspf+xml": "xspf",
      "zip": "zip",
      "vnd.android.package-archive": "apk",
      "vnd.cinderella": "cdy",
      "vnd.google-earth.kml+xml": "kml",
      "vnd.google-earth.kmz": "kmz",
      "vnd.mozilla.xul+xml": "xul",
      "vnd.ms-excel": ["xls", "xlb", "xlt", "xlm", "xla", "xlc", "xlw"],
      "vnd.ms-pki.seccat": "cat",
      "vnd.ms-pki.stl": "stl",
      "vnd.ms-powerpoint": ["ppt", "pps", "pot"],
      "vnd.oasis.opendocument.chart": "odc",
      "vnd.oasis.opendocument.database": "odb",
      "vnd.oasis.opendocument.formula": "odf",
      "vnd.oasis.opendocument.graphics": "odg",
      "vnd.oasis.opendocument.graphics-template": "otg",
      "vnd.oasis.opendocument.image": "odi",
      "vnd.oasis.opendocument.presentation": "odp",
      "vnd.oasis.opendocument.presentation-template": "otp",
      "vnd.oasis.opendocument.spreadsheet": "ods",
      "vnd.oasis.opendocument.spreadsheet-template": "ots",
      "vnd.oasis.opendocument.text": "odt",
      "vnd.oasis.opendocument.text-master": "odm",
      "vnd.oasis.opendocument.text-template": "ott",
      "vnd.oasis.opendocument.text-web": "oth",
      "vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
      "vnd.openxmlformats-officedocument.spreadsheetml.template": "xltx",
      "vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
      "vnd.openxmlformats-officedocument.presentationml.slideshow": "ppsx",
      "vnd.openxmlformats-officedocument.presentationml.template": "potx",
      "vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
      "vnd.openxmlformats-officedocument.wordprocessingml.template": "dotx",
      "vnd.smaf": "mmf",
      "vnd.stardivision.calc": "sdc",
      "vnd.stardivision.chart": "sds",
      "vnd.stardivision.draw": "sda",
      "vnd.stardivision.impress": "sdd",
      "vnd.stardivision.math": ["sdf", "smf"],
      "vnd.stardivision.writer": ["sdw", "vor"],
      "vnd.stardivision.writer-global": "sgl",
      "vnd.sun.xml.calc": "sxc",
      "vnd.sun.xml.calc.template": "stc",
      "vnd.sun.xml.draw": "sxd",
      "vnd.sun.xml.draw.template": "std",
      "vnd.sun.xml.impress": "sxi",
      "vnd.sun.xml.impress.template": "sti",
      "vnd.sun.xml.math": "sxm",
      "vnd.sun.xml.writer": "sxw",
      "vnd.sun.xml.writer.global": "sxg",
      "vnd.sun.xml.writer.template": "stw",
      "vnd.symbian.install": ["sis", "sisx"],
      "vnd.visio": ["vsd", "vst", "vss", "vsw"],
      "vnd.wap.wbxml": "wbxml",
      "vnd.wap.wmlc": "wmlc",
      "vnd.wap.wmlscriptc": "wmlsc",
      "vnd.wordperfect": "wpd",
      "vnd.wordperfect5.1": "wp5",
      "x-123": "wk",
      "x-7z-compressed": "7z",
      "x-abiword": "abw",
      "x-apple-diskimage": "dmg",
      "x-bcpio": "bcpio",
      "x-bittorrent": "torrent",
      "x-cbr": ["cbr", "cba", "cbt", "cb7"],
      "x-cbz": "cbz",
      "x-cdf": ["cdf", "cda"],
      "x-cdlink": "vcd",
      "x-chess-pgn": "pgn",
      "x-cpio": "cpio",
      "x-csh": "csh",
      "x-debian-package": ["deb", "udeb"],
      "x-director": ["dcr", "dir", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"],
      "x-dms": "dms",
      "x-doom": "wad",
      "x-dvi": "dvi",
      "x-httpd-eruby": "rhtml",
      "x-font": "pcf.Z",
      "x-freemind": "mm",
      "x-gnumeric": "gnumeric",
      "x-go-sgf": "sgf",
      "x-graphing-calculator": "gcf",
      "x-gtar": ["gtar", "taz"],
      "x-hdf": "hdf",
      "x-httpd-php": ["phtml", "pht", "php"],
      "x-httpd-php-source": "phps",
      "x-httpd-php3": "php3",
      "x-httpd-php3-preprocessed": "php3p",
      "x-httpd-php4": "php4",
      "x-httpd-php5": "php5",
      "x-ica": "ica",
      "x-info": "info",
      "x-internet-signup": ["ins", "isp"],
      "x-iphone": "iii",
      "x-iso9660-image": "iso",
      "x-java-jnlp-file": "jnlp",
      "x-jmol": "jmz",
      "x-killustrator": "kil",
      "x-koan": ["skp", "skd", "skt", "skm"],
      "x-kpresenter": ["kpr", "kpt"],
      "x-kword": ["kwd", "kwt"],
      "x-latex": "latex",
      "x-lha": "lha",
      "x-lyx": "lyx",
      "x-lzh": "lzh",
      "x-lzx": "lzx",
      "x-maker": ["frm", "maker", "frame", "fm", "fb", "book", "fbdoc"],
      "x-ms-wmd": "wmd",
      "x-ms-wmz": "wmz",
      "x-msdos-program": ["com", "exe", "bat", "dll"],
      "x-msi": "msi",
      "x-netcdf": ["nc", "cdf"],
      "x-ns-proxy-autoconfig": ["pac", "dat"],
      "x-nwc": "nwc",
      "x-object": "o",
      "x-oz-application": "oza",
      "x-pkcs7-certreqresp": "p7r",
      "x-python-code": ["pyc", "pyo"],
      "x-qgis": ["qgs", "shp", "shx"],
      "x-quicktimeplayer": "qtl",
      "x-redhat-package-manager": "rpm",
      "x-ruby": "rb",
      "x-sh": "sh",
      "x-shar": "shar",
      "x-shockwave-flash": ["swf", "swfl"],
      "x-silverlight": "scr",
      "x-stuffit": "sit",
      "x-sv4cpio": "sv4cpio",
      "x-sv4crc": "sv4crc",
      "x-tar": "tar",
      "x-tcl": "tcl",
      "x-tex-gf": "gf",
      "x-tex-pk": "pk",
      "x-texinfo": ["texinfo", "texi"],
      "x-trash": ["~", "%", "bak", "old", "sik"],
      "x-troff": ["t", "tr", "roff"],
      "x-troff-man": "man",
      "x-troff-me": "me",
      "x-troff-ms": "ms",
      "x-ustar": "ustar",
      "x-wais-source": "src",
      "x-wingz": "wz",
      "x-x509-ca-cert": ["crt", "der", "cer"],
      "x-xcf": "xcf",
      "x-xfig": "fig",
      "x-xpinstall": "xpi",
      "applixware": "aw",
      "atomsvc+xml": "atomsvc",
      "ccxml+xml": "ccxml",
      "cdmi-capability": "cdmia",
      "cdmi-container": "cdmic",
      "cdmi-domain": "cdmid",
      "cdmi-object": "cdmio",
      "cdmi-queue": "cdmiq",
      "docbook+xml": "dbk",
      "dssc+der": "dssc",
      "dssc+xml": "xdssc",
      "emma+xml": "emma",
      "epub+zip": "epub",
      "exi": "exi",
      "font-tdpfr": "pfr",
      "gml+xml": "gml",
      "gpx+xml": "gpx",
      "gxf": "gxf",
      "hyperstudio": "stk",
      "inkml+xml": ["ink", "inkml"],
      "ipfix": "ipfix",
      "json": "json",
      "jsonml+json": "jsonml",
      "lost+xml": "lostxml",
      "mads+xml": "mads",
      "marc": "mrc",
      "marcxml+xml": "mrcx",
      "mathml+xml": "mathml",
      "mbox": "mbox",
      "mediaservercontrol+xml": "mscml",
      "metalink+xml": "metalink",
      "metalink4+xml": "meta4",
      "mets+xml": "mets",
      "mods+xml": "mods",
      "mp21": ["m21", "mp21"],
      "mp4": "mp4s",
      "oebps-package+xml": "opf",
      "omdoc+xml": "omdoc",
      "onenote": ["onetoc", "onetoc2", "onetmp", "onepkg"],
      "oxps": "oxps",
      "patch-ops-error+xml": "xer",
      "pgp-encrypted": "pgp",
      "pkcs10": "p10",
      "pkcs7-mime": ["p7m", "p7c"],
      "pkcs7-signature": "p7s",
      "pkcs8": "p8",
      "pkix-attr-cert": "ac",
      "pkix-crl": "crl",
      "pkix-pkipath": "pkipath",
      "pkixcmp": "pki",
      "pls+xml": "pls",
      "prs.cww": "cww",
      "pskc+xml": "pskcxml",
      "reginfo+xml": "rif",
      "relax-ng-compact-syntax": "rnc",
      "resource-lists+xml": "rl",
      "resource-lists-diff+xml": "rld",
      "rls-services+xml": "rs",
      "rpki-ghostbusters": "gbr",
      "rpki-manifest": "mft",
      "rpki-roa": "roa",
      "rsd+xml": "rsd",
      "sbml+xml": "sbml",
      "scvp-cv-request": "scq",
      "scvp-cv-response": "scs",
      "scvp-vp-request": "spq",
      "scvp-vp-response": "spp",
      "sdp": "sdp",
      "set-payment-initiation": "setpay",
      "set-registration-initiation": "setreg",
      "shf+xml": "shf",
      "sparql-query": "rq",
      "sparql-results+xml": "srx",
      "srgs": "gram",
      "srgs+xml": "grxml",
      "sru+xml": "sru",
      "ssdl+xml": "ssdl",
      "ssml+xml": "ssml",
      "tei+xml": ["tei", "teicorpus"],
      "thraud+xml": "tfi",
      "timestamped-data": "tsd",
      "vnd.3gpp.pic-bw-large": "plb",
      "vnd.3gpp.pic-bw-small": "psb",
      "vnd.3gpp.pic-bw-var": "pvb",
      "vnd.3gpp2.tcap": "tcap",
      "vnd.3m.post-it-notes": "pwn",
      "vnd.accpac.simply.aso": "aso",
      "vnd.accpac.simply.imp": "imp",
      "vnd.acucobol": "acu",
      "vnd.acucorp": ["atc", "acutc"],
      "vnd.adobe.air-application-installer-package+zip": "air",
      "vnd.adobe.formscentral.fcdt": "fcdt",
      "vnd.adobe.fxp": ["fxp", "fxpl"],
      "vnd.adobe.xdp+xml": "xdp",
      "vnd.adobe.xfdf": "xfdf",
      "vnd.ahead.space": "ahead",
      "vnd.airzip.filesecure.azf": "azf",
      "vnd.airzip.filesecure.azs": "azs",
      "vnd.amazon.ebook": "azw",
      "vnd.americandynamics.acc": "acc",
      "vnd.amiga.ami": "ami",
      "vnd.anser-web-certificate-issue-initiation": "cii",
      "vnd.anser-web-funds-transfer-initiation": "fti",
      "vnd.antix.game-component": "atx",
      "vnd.apple.installer+xml": "mpkg",
      "vnd.apple.mpegurl": "m3u8",
      "vnd.aristanetworks.swi": "swi",
      "vnd.astraea-software.iota": "iota",
      "vnd.audiograph": "aep",
      "vnd.blueice.multipass": "mpm",
      "vnd.bmi": "bmi",
      "vnd.businessobjects": "rep",
      "vnd.chemdraw+xml": "cdxml",
      "vnd.chipnuts.karaoke-mmd": "mmd",
      "vnd.claymore": "cla",
      "vnd.cloanto.rp9": "rp9",
      "vnd.clonk.c4group": ["c4g", "c4d", "c4f", "c4p", "c4u"],
      "vnd.cluetrust.cartomobile-config": "c11amc",
      "vnd.cluetrust.cartomobile-config-pkg": "c11amz",
      "vnd.commonspace": "csp",
      "vnd.contact.cmsg": "cdbcmsg",
      "vnd.cosmocaller": "cmc",
      "vnd.crick.clicker": "clkx",
      "vnd.crick.clicker.keyboard": "clkk",
      "vnd.crick.clicker.palette": "clkp",
      "vnd.crick.clicker.template": "clkt",
      "vnd.crick.clicker.wordbank": "clkw",
      "vnd.criticaltools.wbs+xml": "wbs",
      "vnd.ctc-posml": "pml",
      "vnd.cups-ppd": "ppd",
      "vnd.curl.car": "car",
      "vnd.curl.pcurl": "pcurl",
      "vnd.dart": "dart",
      "vnd.data-vision.rdz": "rdz",
      "vnd.dece.data": ["uvf", "uvvf", "uvd", "uvvd"],
      "vnd.dece.ttml+xml": ["uvt", "uvvt"],
      "vnd.dece.unspecified": ["uvx", "uvvx"],
      "vnd.dece.zip": ["uvz", "uvvz"],
      "vnd.denovo.fcselayout-link": "fe_launch",
      "vnd.dna": "dna",
      "vnd.dolby.mlp": "mlp",
      "vnd.dpgraph": "dpg",
      "vnd.dreamfactory": "dfac",
      "vnd.ds-keypoint": "kpxx",
      "vnd.dvb.ait": "ait",
      "vnd.dvb.service": "svc",
      "vnd.dynageo": "geo",
      "vnd.ecowin.chart": "mag",
      "vnd.enliven": "nml",
      "vnd.epson.esf": "esf",
      "vnd.epson.msf": "msf",
      "vnd.epson.quickanime": "qam",
      "vnd.epson.salt": "slt",
      "vnd.epson.ssf": "ssf",
      "vnd.eszigno3+xml": ["es3", "et3"],
      "vnd.ezpix-album": "ez2",
      "vnd.ezpix-package": "ez3",
      "vnd.fdf": "fdf",
      "vnd.fdsn.mseed": "mseed",
      "vnd.fdsn.seed": ["seed", "dataless"],
      "vnd.flographit": "gph",
      "vnd.fluxtime.clip": "ftc",
      "vnd.framemaker": ["fm", "frame", "maker", "book"],
      "vnd.frogans.fnc": "fnc",
      "vnd.frogans.ltf": "ltf",
      "vnd.fsc.weblaunch": "fsc",
      "vnd.fujitsu.oasys": "oas",
      "vnd.fujitsu.oasys2": "oa2",
      "vnd.fujitsu.oasys3": "oa3",
      "vnd.fujitsu.oasysgp": "fg5",
      "vnd.fujitsu.oasysprs": "bh2",
      "vnd.fujixerox.ddd": "ddd",
      "vnd.fujixerox.docuworks": "xdw",
      "vnd.fujixerox.docuworks.binder": "xbd",
      "vnd.fuzzysheet": "fzs",
      "vnd.genomatix.tuxedo": "txd",
      "vnd.geogebra.file": "ggb",
      "vnd.geogebra.tool": "ggt",
      "vnd.geometry-explorer": ["gex", "gre"],
      "vnd.geonext": "gxt",
      "vnd.geoplan": "g2w",
      "vnd.geospace": "g3w",
      "vnd.gmx": "gmx",
      "vnd.grafeq": ["gqf", "gqs"],
      "vnd.groove-account": "gac",
      "vnd.groove-help": "ghf",
      "vnd.groove-identity-message": "gim",
      "vnd.groove-injector": "grv",
      "vnd.groove-tool-message": "gtm",
      "vnd.groove-tool-template": "tpl",
      "vnd.groove-vcard": "vcg",
      "vnd.hal+xml": "hal",
      "vnd.handheld-entertainment+xml": "zmm",
      "vnd.hbci": "hbci",
      "vnd.hhe.lesson-player": "les",
      "vnd.hp-hpgl": "hpgl",
      "vnd.hp-hpid": "hpid",
      "vnd.hp-hps": "hps",
      "vnd.hp-jlyt": "jlt",
      "vnd.hp-pcl": "pcl",
      "vnd.hp-pclxl": "pclxl",
      "vnd.hydrostatix.sof-data": "sfd-hdstx",
      "vnd.ibm.minipay": "mpy",
      "vnd.ibm.modcap": ["afp", "listafp", "list3820"],
      "vnd.ibm.rights-management": "irm",
      "vnd.ibm.secure-container": "sc",
      "vnd.iccprofile": ["icc", "icm"],
      "vnd.igloader": "igl",
      "vnd.immervision-ivp": "ivp",
      "vnd.immervision-ivu": "ivu",
      "vnd.insors.igm": "igm",
      "vnd.intercon.formnet": ["xpw", "xpx"],
      "vnd.intergeo": "i2g",
      "vnd.intu.qbo": "qbo",
      "vnd.intu.qfx": "qfx",
      "vnd.ipunplugged.rcprofile": "rcprofile",
      "vnd.irepository.package+xml": "irp",
      "vnd.is-xpr": "xpr",
      "vnd.isac.fcs": "fcs",
      "vnd.jam": "jam",
      "vnd.jcp.javame.midlet-rms": "rms",
      "vnd.jisp": "jisp",
      "vnd.joost.joda-archive": "joda",
      "vnd.kahootz": ["ktz", "ktr"],
      "vnd.kde.karbon": "karbon",
      "vnd.kde.kchart": "chrt",
      "vnd.kde.kformula": "kfo",
      "vnd.kde.kivio": "flw",
      "vnd.kde.kontour": "kon",
      "vnd.kde.kpresenter": ["kpr", "kpt"],
      "vnd.kde.kspread": "ksp",
      "vnd.kde.kword": ["kwd", "kwt"],
      "vnd.kenameaapp": "htke",
      "vnd.kidspiration": "kia",
      "vnd.kinar": ["kne", "knp"],
      "vnd.koan": ["skp", "skd", "skt", "skm"],
      "vnd.kodak-descriptor": "sse",
      "vnd.las.las+xml": "lasxml",
      "vnd.llamagraphics.life-balance.desktop": "lbd",
      "vnd.llamagraphics.life-balance.exchange+xml": "lbe",
      "vnd.lotus-1-2-3": "123",
      "vnd.lotus-approach": "apr",
      "vnd.lotus-freelance": "pre",
      "vnd.lotus-notes": "nsf",
      "vnd.lotus-organizer": "org",
      "vnd.lotus-screencam": "scm",
      "vnd.lotus-wordpro": "lwp",
      "vnd.macports.portpkg": "portpkg",
      "vnd.mcd": "mcd",
      "vnd.medcalcdata": "mc1",
      "vnd.mediastation.cdkey": "cdkey",
      "vnd.mfer": "mwf",
      "vnd.mfmp": "mfm",
      "vnd.micrografx.flo": "flo",
      "vnd.micrografx.igx": "igx",
      "vnd.mif": "mif",
      "vnd.mobius.daf": "daf",
      "vnd.mobius.dis": "dis",
      "vnd.mobius.mbk": "mbk",
      "vnd.mobius.mqy": "mqy",
      "vnd.mobius.msl": "msl",
      "vnd.mobius.plc": "plc",
      "vnd.mobius.txf": "txf",
      "vnd.mophun.application": "mpn",
      "vnd.mophun.certificate": "mpc",
      "vnd.ms-artgalry": "cil",
      "vnd.ms-cab-compressed": "cab",
      "vnd.ms-excel.addin.macroenabled.12": "xlam",
      "vnd.ms-excel.sheet.binary.macroenabled.12": "xlsb",
      "vnd.ms-excel.sheet.macroenabled.12": "xlsm",
      "vnd.ms-excel.template.macroenabled.12": "xltm",
      "vnd.ms-fontobject": "eot",
      "vnd.ms-htmlhelp": "chm",
      "vnd.ms-ims": "ims",
      "vnd.ms-lrm": "lrm",
      "vnd.ms-officetheme": "thmx",
      "vnd.ms-powerpoint.addin.macroenabled.12": "ppam",
      "vnd.ms-powerpoint.presentation.macroenabled.12": "pptm",
      "vnd.ms-powerpoint.slide.macroenabled.12": "sldm",
      "vnd.ms-powerpoint.slideshow.macroenabled.12": "ppsm",
      "vnd.ms-powerpoint.template.macroenabled.12": "potm",
      "vnd.ms-project": ["mpp", "mpt"],
      "vnd.ms-word.document.macroenabled.12": "docm",
      "vnd.ms-word.template.macroenabled.12": "dotm",
      "vnd.ms-works": ["wps", "wks", "wcm", "wdb"],
      "vnd.ms-wpl": "wpl",
      "vnd.ms-xpsdocument": "xps",
      "vnd.mseq": "mseq",
      "vnd.musician": "mus",
      "vnd.muvee.style": "msty",
      "vnd.mynfc": "taglet",
      "vnd.neurolanguage.nlu": "nlu",
      "vnd.nitf": ["ntf", "nitf"],
      "vnd.noblenet-directory": "nnd",
      "vnd.noblenet-sealer": "nns",
      "vnd.noblenet-web": "nnw",
      "vnd.nokia.n-gage.data": "ngdat",
      "vnd.nokia.n-gage.symbian.install": "n-gage",
      "vnd.nokia.radio-preset": "rpst",
      "vnd.nokia.radio-presets": "rpss",
      "vnd.novadigm.edm": "edm",
      "vnd.novadigm.edx": "edx",
      "vnd.novadigm.ext": "ext",
      "vnd.oasis.opendocument.chart-template": "otc",
      "vnd.oasis.opendocument.formula-template": "odft",
      "vnd.oasis.opendocument.image-template": "oti",
      "vnd.olpc-sugar": "xo",
      "vnd.oma.dd2+xml": "dd2",
      "vnd.openofficeorg.extension": "oxt",
      "vnd.openxmlformats-officedocument.presentationml.slide": "sldx",
      "vnd.osgeo.mapguide.package": "mgp",
      "vnd.osgi.dp": "dp",
      "vnd.osgi.subsystem": "esa",
      "vnd.palm": ["pdb", "pqa", "oprc"],
      "vnd.pawaafile": "paw",
      "vnd.pg.format": "str",
      "vnd.pg.osasli": "ei6",
      "vnd.picsel": "efif",
      "vnd.pmi.widget": "wg",
      "vnd.pocketlearn": "plf",
      "vnd.powerbuilder6": "pbd",
      "vnd.previewsystems.box": "box",
      "vnd.proteus.magazine": "mgz",
      "vnd.publishare-delta-tree": "qps",
      "vnd.pvi.ptid1": "ptid",
      "vnd.quark.quarkxpress": ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"],
      "vnd.realvnc.bed": "bed",
      "vnd.recordare.musicxml": "mxl",
      "vnd.recordare.musicxml+xml": "musicxml",
      "vnd.rig.cryptonote": "cryptonote",
      "vnd.rn-realmedia": "rm",
      "vnd.rn-realmedia-vbr": "rmvb",
      "vnd.route66.link66+xml": "link66",
      "vnd.sailingtracker.track": "st",
      "vnd.seemail": "see",
      "vnd.sema": "sema",
      "vnd.semd": "semd",
      "vnd.semf": "semf",
      "vnd.shana.informed.formdata": "ifm",
      "vnd.shana.informed.formtemplate": "itp",
      "vnd.shana.informed.interchange": "iif",
      "vnd.shana.informed.package": "ipk",
      "vnd.simtech-mindmapper": ["twd", "twds"],
      "vnd.smart.teacher": "teacher",
      "vnd.solent.sdkm+xml": ["sdkm", "sdkd"],
      "vnd.spotfire.dxp": "dxp",
      "vnd.spotfire.sfs": "sfs",
      "vnd.stepmania.package": "smzip",
      "vnd.stepmania.stepchart": "sm",
      "vnd.sus-calendar": ["sus", "susp"],
      "vnd.svd": "svd",
      "vnd.syncml+xml": "xsm",
      "vnd.syncml.dm+wbxml": "bdm",
      "vnd.syncml.dm+xml": "xdm",
      "vnd.tao.intent-module-archive": "tao",
      "vnd.tcpdump.pcap": ["pcap", "cap", "dmp"],
      "vnd.tmobile-livetv": "tmo",
      "vnd.trid.tpt": "tpt",
      "vnd.triscape.mxs": "mxs",
      "vnd.trueapp": "tra",
      "vnd.ufdl": ["ufd", "ufdl"],
      "vnd.uiq.theme": "utz",
      "vnd.umajin": "umj",
      "vnd.unity": "unityweb",
      "vnd.uoml+xml": "uoml",
      "vnd.vcx": "vcx",
      "vnd.visionary": "vis",
      "vnd.vsf": "vsf",
      "vnd.webturbo": "wtb",
      "vnd.wolfram.player": "nbp",
      "vnd.wqd": "wqd",
      "vnd.wt.stf": "stf",
      "vnd.xara": "xar",
      "vnd.xfdl": "xfdl",
      "vnd.yamaha.hv-dic": "hvd",
      "vnd.yamaha.hv-script": "hvs",
      "vnd.yamaha.hv-voice": "hvp",
      "vnd.yamaha.openscoreformat": "osf",
      "vnd.yamaha.openscoreformat.osfpvg+xml": "osfpvg",
      "vnd.yamaha.smaf-audio": "saf",
      "vnd.yamaha.smaf-phrase": "spf",
      "vnd.yellowriver-custom-menu": "cmp",
      "vnd.zul": ["zir", "zirz"],
      "vnd.zzazz.deck+xml": "zaz",
      "voicexml+xml": "vxml",
      "widget": "wgt",
      "winhlp": "hlp",
      "wsdl+xml": "wsdl",
      "wspolicy+xml": "wspolicy",
      "x-ace-compressed": "ace",
      "x-authorware-bin": ["aab", "x32", "u32", "vox"],
      "x-authorware-map": "aam",
      "x-authorware-seg": "aas",
      "x-blorb": ["blb", "blorb"],
      "x-bzip": "bz",
      "x-bzip2": ["bz2", "boz"],
      "x-cfs-compressed": "cfs",
      "x-chat": "chat",
      "x-conference": "nsc",
      "x-dgc-compressed": "dgc",
      "x-dtbncx+xml": "ncx",
      "x-dtbook+xml": "dtb",
      "x-dtbresource+xml": "res",
      "x-eva": "eva",
      "x-font-bdf": "bdf",
      "x-font-ghostscript": "gsf",
      "x-font-linux-psf": "psf",
      "x-font-otf": "otf",
      "x-font-pcf": "pcf",
      "x-font-snf": "snf",
      "x-font-ttf": ["ttf", "ttc"],
      "x-font-type1": ["pfa", "pfb", "pfm", "afm"],
      "x-font-woff": "woff",
      "x-freearc": "arc",
      "x-gca-compressed": "gca",
      "x-glulx": "ulx",
      "x-gramps-xml": "gramps",
      "x-install-instructions": "install",
      "x-lzh-compressed": ["lzh", "lha"],
      "x-mie": "mie",
      "x-mobipocket-ebook": ["prc", "mobi"],
      "x-ms-application": "application",
      "x-ms-shortcut": "lnk",
      "x-ms-xbap": "xbap",
      "x-msbinder": "obd",
      "x-mscardfile": "crd",
      "x-msclip": "clp",
      "x-msdownload": ["exe", "dll", "com", "bat", "msi"],
      "x-msmediaview": ["mvb", "m13", "m14"],
      "x-msmetafile": ["wmf", "wmz", "emf", "emz"],
      "x-msmoney": "mny",
      "x-mspublisher": "pub",
      "x-msschedule": "scd",
      "x-msterminal": "trm",
      "x-mswrite": "wri",
      "x-nzb": "nzb",
      "x-pkcs12": ["p12", "pfx"],
      "x-pkcs7-certificates": ["p7b", "spc"],
      "x-research-info-systems": "ris",
      "x-silverlight-app": "xap",
      "x-sql": "sql",
      "x-stuffitx": "sitx",
      "x-subrip": "srt",
      "x-t3vm-image": "t3",
      "x-tads": "gam",
      "x-tex": "tex",
      "x-tex-tfm": "tfm",
      "x-tgif": "obj",
      "x-xliff+xml": "xlf",
      "x-xz": "xz",
      "x-zmachine": ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"],
      "xaml+xml": "xaml",
      "xcap-diff+xml": "xdf",
      "xenc+xml": "xenc",
      "xml-dtd": "dtd",
      "xop+xml": "xop",
      "xproc+xml": "xpl",
      "xslt+xml": "xslt",
      "xv+xml": ["mxml", "xhvml", "xvml", "xvm"],
      "yang": "yang",
      "yin+xml": "yin",
      "envoy": "evy",
      "fractals": "fif",
      "internet-property-stream": "acx",
      "olescript": "axs",
      "vnd.ms-outlook": "msg",
      "vnd.ms-pkicertstore": "sst",
      "x-compress": "z",
      "x-compressed": "tgz",
      "x-gzip": "gz",
      "x-perfmon": ["pma", "pmc", "pml", "pmr", "pmw"],
      "x-pkcs7-mime": ["p7c", "p7m"],
      "ynd.ms-pkipko": "pko"
    },
    "audio": {
      "amr": "amr",
      "amr-wb": "awb",
      "annodex": "axa",
      "basic": ["au", "snd"],
      "flac": "flac",
      "midi": ["mid", "midi", "kar", "rmi"],
      "mpeg": ["mpga", "mpega", "mp2", "mp3", "m4a", "mp2a", "m2a", "m3a"],
      "mpegurl": "m3u",
      "ogg": ["oga", "ogg", "spx"],
      "prs.sid": "sid",
      "x-aiff": ["aif", "aiff", "aifc"],
      "x-gsm": "gsm",
      "x-ms-wma": "wma",
      "x-ms-wax": "wax",
      "x-pn-realaudio": "ram",
      "x-realaudio": "ra",
      "x-sd2": "sd2",
      "x-wav": "wav",
      "adpcm": "adp",
      "mp4": "mp4a",
      "s3m": "s3m",
      "silk": "sil",
      "vnd.dece.audio": ["uva", "uvva"],
      "vnd.digital-winds": "eol",
      "vnd.dra": "dra",
      "vnd.dts": "dts",
      "vnd.dts.hd": "dtshd",
      "vnd.lucent.voice": "lvp",
      "vnd.ms-playready.media.pya": "pya",
      "vnd.nuera.ecelp4800": "ecelp4800",
      "vnd.nuera.ecelp7470": "ecelp7470",
      "vnd.nuera.ecelp9600": "ecelp9600",
      "vnd.rip": "rip",
      "webm": "weba",
      "x-aac": "aac",
      "x-caf": "caf",
      "x-matroska": "mka",
      "x-pn-realaudio-plugin": "rmp",
      "xm": "xm",
      "mid": ["mid", "rmi"]
    },
    "chemical": {
      "x-alchemy": "alc",
      "x-cache": ["cac", "cache"],
      "x-cache-csf": "csf",
      "x-cactvs-binary": ["cbin", "cascii", "ctab"],
      "x-cdx": "cdx",
      "x-chem3d": "c3d",
      "x-cif": "cif",
      "x-cmdf": "cmdf",
      "x-cml": "cml",
      "x-compass": "cpa",
      "x-crossfire": "bsd",
      "x-csml": ["csml", "csm"],
      "x-ctx": "ctx",
      "x-cxf": ["cxf", "cef"],
      "x-embl-dl-nucleotide": ["emb", "embl"],
      "x-gamess-input": ["inp", "gam", "gamin"],
      "x-gaussian-checkpoint": ["fch", "fchk"],
      "x-gaussian-cube": "cub",
      "x-gaussian-input": ["gau", "gjc", "gjf"],
      "x-gaussian-log": "gal",
      "x-gcg8-sequence": "gcg",
      "x-genbank": "gen",
      "x-hin": "hin",
      "x-isostar": ["istr", "ist"],
      "x-jcamp-dx": ["jdx", "dx"],
      "x-kinemage": "kin",
      "x-macmolecule": "mcm",
      "x-macromodel-input": ["mmd", "mmod"],
      "x-mdl-molfile": "mol",
      "x-mdl-rdfile": "rd",
      "x-mdl-rxnfile": "rxn",
      "x-mdl-sdfile": ["sd", "sdf"],
      "x-mdl-tgf": "tgf",
      "x-mmcif": "mcif",
      "x-mol2": "mol2",
      "x-molconn-Z": "b",
      "x-mopac-graph": "gpt",
      "x-mopac-input": ["mop", "mopcrt", "mpc", "zmt"],
      "x-mopac-out": "moo",
      "x-ncbi-asn1": "asn",
      "x-ncbi-asn1-ascii": ["prt", "ent"],
      "x-ncbi-asn1-binary": ["val", "aso"],
      "x-pdb": ["pdb", "ent"],
      "x-rosdal": "ros",
      "x-swissprot": "sw",
      "x-vamas-iso14976": "vms",
      "x-vmd": "vmd",
      "x-xtel": "xtel",
      "x-xyz": "xyz"
    },
    "image": {
      "gif": "gif",
      "ief": "ief",
      "jpeg": ["jpeg", "jpg", "jpe"],
      "pcx": "pcx",
      "png": "png",
      "svg+xml": ["svg", "svgz"],
      "tiff": ["tiff", "tif"],
      "vnd.djvu": ["djvu", "djv"],
      "vnd.wap.wbmp": "wbmp",
      "x-canon-cr2": "cr2",
      "x-canon-crw": "crw",
      "x-cmu-raster": "ras",
      "x-coreldraw": "cdr",
      "x-coreldrawpattern": "pat",
      "x-coreldrawtemplate": "cdt",
      "x-corelphotopaint": "cpt",
      "x-epson-erf": "erf",
      "x-icon": "ico",
      "x-jg": "art",
      "x-jng": "jng",
      "x-nikon-nef": "nef",
      "x-olympus-orf": "orf",
      "x-photoshop": "psd",
      "x-portable-anymap": "pnm",
      "x-portable-bitmap": "pbm",
      "x-portable-graymap": "pgm",
      "x-portable-pixmap": "ppm",
      "x-rgb": "rgb",
      "x-xbitmap": "xbm",
      "x-xpixmap": "xpm",
      "x-xwindowdump": "xwd",
      "bmp": "bmp",
      "cgm": "cgm",
      "g3fax": "g3",
      "ktx": "ktx",
      "prs.btif": "btif",
      "sgi": "sgi",
      "vnd.dece.graphic": ["uvi", "uvvi", "uvg", "uvvg"],
      "vnd.dwg": "dwg",
      "vnd.dxf": "dxf",
      "vnd.fastbidsheet": "fbs",
      "vnd.fpx": "fpx",
      "vnd.fst": "fst",
      "vnd.fujixerox.edmics-mmr": "mmr",
      "vnd.fujixerox.edmics-rlc": "rlc",
      "vnd.ms-modi": "mdi",
      "vnd.ms-photo": "wdp",
      "vnd.net-fpx": "npx",
      "vnd.xiff": "xif",
      "webp": "webp",
      "x-3ds": "3ds",
      "x-cmx": "cmx",
      "x-freehand": ["fh", "fhc", "fh4", "fh5", "fh7"],
      "x-pict": ["pic", "pct"],
      "x-tga": "tga",
      "cis-cod": "cod",
      "pipeg": "jfif"
    },
    "message": {
      "rfc822": ["eml", "mime", "mht", "mhtml", "nws"]
    },
    "model": {
      "iges": ["igs", "iges"],
      "mesh": ["msh", "mesh", "silo"],
      "vrml": ["wrl", "vrml"],
      "x3d+vrml": ["x3dv", "x3dvz"],
      "x3d+xml": ["x3d", "x3dz"],
      "x3d+binary": ["x3db", "x3dbz"],
      "vnd.collada+xml": "dae",
      "vnd.dwf": "dwf",
      "vnd.gdl": "gdl",
      "vnd.gtw": "gtw",
      "vnd.mts": "mts",
      "vnd.vtu": "vtu"
    },
    "text": {
      "cache-manifest": ["manifest", "appcache"],
      "calendar": ["ics", "icz", "ifb"],
      "css": "css",
      "csv": "csv",
      "h323": "323",
      "html": ["html", "htm", "shtml", "stm"],
      "iuls": "uls",
      "mathml": "mml",
      "plain": ["txt", "text", "brf", "conf", "def", "list", "log", "in", "bas"],
      "richtext": "rtx",
      "scriptlet": ["sct", "wsc"],
      "texmacs": ["tm", "ts"],
      "tab-separated-values": "tsv",
      "vnd.sun.j2me.app-descriptor": "jad",
      "vnd.wap.wml": "wml",
      "vnd.wap.wmlscript": "wmls",
      "x-bibtex": "bib",
      "x-boo": "boo",
      "x-c++hdr": ["h++", "hpp", "hxx", "hh"],
      "x-c++src": ["c++", "cpp", "cxx", "cc"],
      "x-component": "htc",
      "x-dsrc": "d",
      "x-diff": ["diff", "patch"],
      "x-haskell": "hs",
      "x-java": "java",
      "x-literate-haskell": "lhs",
      "x-moc": "moc",
      "x-pascal": ["p", "pas"],
      "x-pcs-gcd": "gcd",
      "x-perl": ["pl", "pm"],
      "x-python": "py",
      "x-scala": "scala",
      "x-setext": "etx",
      "x-tcl": ["tcl", "tk"],
      "x-tex": ["tex", "ltx", "sty", "cls"],
      "x-vcalendar": "vcs",
      "x-vcard": "vcf",
      "n3": "n3",
      "prs.lines.tag": "dsc",
      "sgml": ["sgml", "sgm"],
      "troff": ["t", "tr", "roff", "man", "me", "ms"],
      "turtle": "ttl",
      "uri-list": ["uri", "uris", "urls"],
      "vcard": "vcard",
      "vnd.curl": "curl",
      "vnd.curl.dcurl": "dcurl",
      "vnd.curl.scurl": "scurl",
      "vnd.curl.mcurl": "mcurl",
      "vnd.dvb.subtitle": "sub",
      "vnd.fly": "fly",
      "vnd.fmi.flexstor": "flx",
      "vnd.graphviz": "gv",
      "vnd.in3d.3dml": "3dml",
      "vnd.in3d.spot": "spot",
      "x-asm": ["s", "asm"],
      "x-c": ["c", "cc", "cxx", "cpp", "h", "hh", "dic"],
      "x-fortran": ["f", "for", "f77", "f90"],
      "x-opml": "opml",
      "x-nfo": "nfo",
      "x-sfv": "sfv",
      "x-uuencode": "uu",
      "webviewhtml": "htt"
    },
    "video": {
      "avif": ".avif",
      "3gpp": "3gp",
      "annodex": "axv",
      "dl": "dl",
      "dv": ["dif", "dv"],
      "fli": "fli",
      "gl": "gl",
      "mpeg": ["mpeg", "mpg", "mpe", "m1v", "m2v", "mp2", "mpa", "mpv2"],
      "mp4": ["mp4", "mp4v", "mpg4"],
      "quicktime": ["qt", "mov"],
      "ogg": "ogv",
      "vnd.mpegurl": ["mxu", "m4u"],
      "x-flv": "flv",
      "x-la-asf": ["lsf", "lsx"],
      "x-mng": "mng",
      "x-ms-asf": ["asf", "asx", "asr"],
      "x-ms-wm": "wm",
      "x-ms-wmv": "wmv",
      "x-ms-wmx": "wmx",
      "x-ms-wvx": "wvx",
      "x-msvideo": "avi",
      "x-sgi-movie": "movie",
      "x-matroska": ["mpv", "mkv", "mk3d", "mks"],
      "3gpp2": "3g2",
      "h261": "h261",
      "h263": "h263",
      "h264": "h264",
      "jpeg": "jpgv",
      "jpm": ["jpm", "jpgm"],
      "mj2": ["mj2", "mjp2"],
      "vnd.dece.hd": ["uvh", "uvvh"],
      "vnd.dece.mobile": ["uvm", "uvvm"],
      "vnd.dece.pd": ["uvp", "uvvp"],
      "vnd.dece.sd": ["uvs", "uvvs"],
      "vnd.dece.video": ["uvv", "uvvv"],
      "vnd.dvb.file": "dvb",
      "vnd.fvt": "fvt",
      "vnd.ms-playready.media.pyv": "pyv",
      "vnd.uvvu.mp4": ["uvu", "uvvu"],
      "vnd.vivo": "viv",
      "webm": "webm",
      "x-f4v": "f4v",
      "x-m4v": "m4v",
      "x-ms-vob": "vob",
      "x-smv": "smv"
    },
    "x-conference": {
      "x-cooltalk": "ice"
    },
    "x-world": {
      "x-vrml": ["vrm", "vrml", "wrl", "flr", "wrz", "xaf", "xof"]
    }
  };

  var mimeTypes = function () {
    var mimeTypes = {};

    for (var type in table$1) {
      // eslint-disable-next-line no-prototype-builtins
      if (table$1.hasOwnProperty(type)) {
        for (var subtype in table$1[type]) {
          // eslint-disable-next-line no-prototype-builtins
          if (table$1[type].hasOwnProperty(subtype)) {
            var value = table$1[type][subtype];

            if (typeof value == "string") {
              mimeTypes[value] = type + "/" + subtype;
            } else {
              for (var indexMimeType = 0; indexMimeType < value.length; indexMimeType++) {
                mimeTypes[value[indexMimeType]] = type + "/" + subtype;
              }
            }
          }
        }
      }
    }

    return mimeTypes;
  }();

  function getMimeType(filename) {
    var defaultValue = "application/octet-stream";
    return filename && mimeTypes[filename.split(".").pop().toLowerCase()] || defaultValue;
  }

  var $$h = _export;
  var $find = arrayIteration.find;
  var addToUnscopables = addToUnscopables$3;

  var FIND = 'find';
  var SKIPS_HOLES = true;

  // Shouldn't skip holes
  if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  $$h({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
    find: function find(callbackfn /* , that = undefined */) {
      return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables(FIND);

  var global$n = global$19;

  var nativePromiseConstructor = global$n.Promise;

  var call$6 = functionCall;
  var anObject$6 = anObject$i;
  var getMethod$1 = getMethod$5;

  var iteratorClose$2 = function (iterator, kind, value) {
    var innerResult, innerError;
    anObject$6(iterator);
    try {
      innerResult = getMethod$1(iterator, 'return');
      if (!innerResult) {
        if (kind === 'throw') throw value;
        return value;
      }
      innerResult = call$6(innerResult, iterator);
    } catch (error) {
      innerError = true;
      innerResult = error;
    }
    if (kind === 'throw') throw value;
    if (innerError) throw innerResult;
    anObject$6(innerResult);
    return value;
  };

  var global$m = global$19;
  var bind$7 = functionBindContext;
  var call$5 = functionCall;
  var anObject$5 = anObject$i;
  var tryToString = tryToString$5;
  var isArrayIteratorMethod$1 = isArrayIteratorMethod$3;
  var lengthOfArrayLike$2 = lengthOfArrayLike$f;
  var isPrototypeOf$3 = objectIsPrototypeOf;
  var getIterator$2 = getIterator$4;
  var getIteratorMethod$2 = getIteratorMethod$5;
  var iteratorClose$1 = iteratorClose$2;

  var TypeError$9 = global$m.TypeError;

  var Result = function (stopped, result) {
    this.stopped = stopped;
    this.result = result;
  };

  var ResultPrototype = Result.prototype;

  var iterate$4 = function (iterable, unboundFunction, options) {
    var that = options && options.that;
    var AS_ENTRIES = !!(options && options.AS_ENTRIES);
    var IS_ITERATOR = !!(options && options.IS_ITERATOR);
    var INTERRUPTED = !!(options && options.INTERRUPTED);
    var fn = bind$7(unboundFunction, that);
    var iterator, iterFn, index, length, result, next, step;

    var stop = function (condition) {
      if (iterator) iteratorClose$1(iterator, 'normal', condition);
      return new Result(true, condition);
    };

    var callFn = function (value) {
      if (AS_ENTRIES) {
        anObject$5(value);
        return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
      } return INTERRUPTED ? fn(value, stop) : fn(value);
    };

    if (IS_ITERATOR) {
      iterator = iterable;
    } else {
      iterFn = getIteratorMethod$2(iterable);
      if (!iterFn) throw TypeError$9(tryToString(iterable) + ' is not iterable');
      // optimisation for array iterators
      if (isArrayIteratorMethod$1(iterFn)) {
        for (index = 0, length = lengthOfArrayLike$2(iterable); length > index; index++) {
          result = callFn(iterable[index]);
          if (result && isPrototypeOf$3(ResultPrototype, result)) return result;
        } return new Result(false);
      }
      iterator = getIterator$2(iterable, iterFn);
    }

    next = iterator.next;
    while (!(step = call$5(next, iterator)).done) {
      try {
        result = callFn(step.value);
      } catch (error) {
        iteratorClose$1(iterator, 'throw', error);
      }
      if (typeof result == 'object' && result && isPrototypeOf$3(ResultPrototype, result)) return result;
    } return new Result(false);
  };

  var userAgent$2 = engineUserAgent;

  var engineIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent$2);

  var classof$3 = classofRaw$1;
  var global$l = global$19;

  var engineIsNode = classof$3(global$l.process) == 'process';

  var global$k = global$19;
  var apply$2 = functionApply;
  var bind$6 = functionBindContext;
  var isCallable$6 = isCallable$p;
  var hasOwn$7 = hasOwnProperty_1;
  var fails$a = fails$D;
  var html = html$2;
  var arraySlice$4 = arraySlice$9;
  var createElement = documentCreateElement$2;
  var IS_IOS$1 = engineIsIos;
  var IS_NODE$2 = engineIsNode;

  var set = global$k.setImmediate;
  var clear = global$k.clearImmediate;
  var process$2 = global$k.process;
  var Dispatch = global$k.Dispatch;
  var Function$1 = global$k.Function;
  var MessageChannel = global$k.MessageChannel;
  var String$1 = global$k.String;
  var counter = 0;
  var queue$1 = {};
  var ONREADYSTATECHANGE = 'onreadystatechange';
  var location, defer, channel, port;

  try {
    // Deno throws a ReferenceError on `location` access without `--location` flag
    location = global$k.location;
  } catch (error) { /* empty */ }

  var run = function (id) {
    if (hasOwn$7(queue$1, id)) {
      var fn = queue$1[id];
      delete queue$1[id];
      fn();
    }
  };

  var runner = function (id) {
    return function () {
      run(id);
    };
  };

  var listener = function (event) {
    run(event.data);
  };

  var post = function (id) {
    // old engines have not location.origin
    global$k.postMessage(String$1(id), location.protocol + '//' + location.host);
  };

  // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
  if (!set || !clear) {
    set = function setImmediate(fn) {
      var args = arraySlice$4(arguments, 1);
      queue$1[++counter] = function () {
        apply$2(isCallable$6(fn) ? fn : Function$1(fn), undefined, args);
      };
      defer(counter);
      return counter;
    };
    clear = function clearImmediate(id) {
      delete queue$1[id];
    };
    // Node.js 0.8-
    if (IS_NODE$2) {
      defer = function (id) {
        process$2.nextTick(runner(id));
      };
    // Sphere (JS game engine) Dispatch API
    } else if (Dispatch && Dispatch.now) {
      defer = function (id) {
        Dispatch.now(runner(id));
      };
    // Browsers with MessageChannel, includes WebWorkers
    // except iOS - https://github.com/zloirock/core-js/issues/624
    } else if (MessageChannel && !IS_IOS$1) {
      channel = new MessageChannel();
      port = channel.port2;
      channel.port1.onmessage = listener;
      defer = bind$6(port.postMessage, port);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
    } else if (
      global$k.addEventListener &&
      isCallable$6(global$k.postMessage) &&
      !global$k.importScripts &&
      location && location.protocol !== 'file:' &&
      !fails$a(post)
    ) {
      defer = post;
      global$k.addEventListener('message', listener, false);
    // IE8-
    } else if (ONREADYSTATECHANGE in createElement('script')) {
      defer = function (id) {
        html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
          html.removeChild(this);
          run(id);
        };
      };
    // Rest old browsers
    } else {
      defer = function (id) {
        setTimeout(runner(id), 0);
      };
    }
  }

  var task$1 = {
    set: set,
    clear: clear
  };

  var userAgent$1 = engineUserAgent;
  var global$j = global$19;

  var engineIsIosPebble = /ipad|iphone|ipod/i.test(userAgent$1) && global$j.Pebble !== undefined;

  var userAgent = engineUserAgent;

  var engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(userAgent);

  var global$i = global$19;
  var bind$5 = functionBindContext;
  var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;
  var macrotask = task$1.set;
  var IS_IOS = engineIsIos;
  var IS_IOS_PEBBLE = engineIsIosPebble;
  var IS_WEBOS_WEBKIT = engineIsWebosWebkit;
  var IS_NODE$1 = engineIsNode;

  var MutationObserver = global$i.MutationObserver || global$i.WebKitMutationObserver;
  var document$2 = global$i.document;
  var process$1 = global$i.process;
  var Promise$1 = global$i.Promise;
  // Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
  var queueMicrotaskDescriptor = getOwnPropertyDescriptor$3(global$i, 'queueMicrotask');
  var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

  var flush, head, last, notify$1, toggle, node, promise, then;

  // modern engines have queueMicrotask method
  if (!queueMicrotask) {
    flush = function () {
      var parent, fn;
      if (IS_NODE$1 && (parent = process$1.domain)) parent.exit();
      while (head) {
        fn = head.fn;
        head = head.next;
        try {
          fn();
        } catch (error) {
          if (head) notify$1();
          else last = undefined;
          throw error;
        }
      } last = undefined;
      if (parent) parent.enter();
    };

    // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
    // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
    if (!IS_IOS && !IS_NODE$1 && !IS_WEBOS_WEBKIT && MutationObserver && document$2) {
      toggle = true;
      node = document$2.createTextNode('');
      new MutationObserver(flush).observe(node, { characterData: true });
      notify$1 = function () {
        node.data = toggle = !toggle;
      };
    // environments with maybe non-completely correct, but existent Promise
    } else if (!IS_IOS_PEBBLE && Promise$1 && Promise$1.resolve) {
      // Promise.resolve without an argument throws an error in LG WebOS 2
      promise = Promise$1.resolve(undefined);
      // workaround of WebKit ~ iOS Safari 10.1 bug
      promise.constructor = Promise$1;
      then = bind$5(promise.then, promise);
      notify$1 = function () {
        then(flush);
      };
    // Node.js without promises
    } else if (IS_NODE$1) {
      notify$1 = function () {
        process$1.nextTick(flush);
      };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout
    } else {
      // strange IE + webpack dev server bug - use .bind(global)
      macrotask = bind$5(macrotask, global$i);
      notify$1 = function () {
        macrotask(flush);
      };
    }
  }

  var microtask$1 = queueMicrotask || function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify$1();
    } last = task;
  };

  var newPromiseCapability$2 = {};

  var aCallable$1 = aCallable$7;

  var PromiseCapability = function (C) {
    var resolve, reject;
    this.promise = new C(function ($$resolve, $$reject) {
      if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
      resolve = $$resolve;
      reject = $$reject;
    });
    this.resolve = aCallable$1(resolve);
    this.reject = aCallable$1(reject);
  };

  // `NewPromiseCapability` abstract operation
  // https://tc39.es/ecma262/#sec-newpromisecapability
  newPromiseCapability$2.f = function (C) {
    return new PromiseCapability(C);
  };

  var anObject$4 = anObject$i;
  var isObject$6 = isObject$k;
  var newPromiseCapability$1 = newPromiseCapability$2;

  var promiseResolve$1 = function (C, x) {
    anObject$4(C);
    if (isObject$6(x) && x.constructor === C) return x;
    var promiseCapability = newPromiseCapability$1.f(C);
    var resolve = promiseCapability.resolve;
    resolve(x);
    return promiseCapability.promise;
  };

  var global$h = global$19;

  var hostReportErrors$1 = function (a, b) {
    var console = global$h.console;
    if (console && console.error) {
      arguments.length == 1 ? console.error(a) : console.error(a, b);
    }
  };

  var perform$1 = function (exec) {
    try {
      return { error: false, value: exec() };
    } catch (error) {
      return { error: true, value: error };
    }
  };

  var Queue$1 = function () {
    this.head = null;
    this.tail = null;
  };

  Queue$1.prototype = {
    add: function (item) {
      var entry = { item: item, next: null };
      if (this.head) this.tail.next = entry;
      else this.head = entry;
      this.tail = entry;
    },
    get: function () {
      var entry = this.head;
      if (entry) {
        this.head = entry.next;
        if (this.tail === entry) this.tail = null;
        return entry.item;
      }
    }
  };

  var queue = Queue$1;

  var engineIsBrowser = typeof window == 'object';

  var $$g = _export;
  var global$g = global$19;
  var getBuiltIn$2 = getBuiltIn$9;
  var call$4 = functionCall;
  var NativePromise = nativePromiseConstructor;
  var redefine$5 = redefine$d.exports;
  var redefineAll$2 = redefineAll$4;
  var setPrototypeOf = objectSetPrototypeOf;
  var setToStringTag$4 = setToStringTag$8;
  var setSpecies$1 = setSpecies$3;
  var aCallable = aCallable$7;
  var isCallable$5 = isCallable$p;
  var isObject$5 = isObject$k;
  var anInstance$4 = anInstance$7;
  var inspectSource = inspectSource$4;
  var iterate$3 = iterate$4;
  var checkCorrectnessOfIteration$2 = checkCorrectnessOfIteration$4;
  var speciesConstructor = speciesConstructor$4;
  var task = task$1.set;
  var microtask = microtask$1;
  var promiseResolve = promiseResolve$1;
  var hostReportErrors = hostReportErrors$1;
  var newPromiseCapabilityModule = newPromiseCapability$2;
  var perform = perform$1;
  var Queue = queue;
  var InternalStateModule$5 = internalState;
  var isForced$2 = isForced_1;
  var wellKnownSymbol$7 = wellKnownSymbol$s;
  var IS_BROWSER = engineIsBrowser;
  var IS_NODE = engineIsNode;
  var V8_VERSION = engineV8Version;

  var SPECIES = wellKnownSymbol$7('species');
  var PROMISE = 'Promise';

  var getInternalState$2 = InternalStateModule$5.getterFor(PROMISE);
  var setInternalState$5 = InternalStateModule$5.set;
  var getInternalPromiseState = InternalStateModule$5.getterFor(PROMISE);
  var NativePromisePrototype = NativePromise && NativePromise.prototype;
  var PromiseConstructor = NativePromise;
  var PromisePrototype = NativePromisePrototype;
  var TypeError$8 = global$g.TypeError;
  var document$1 = global$g.document;
  var process = global$g.process;
  var newPromiseCapability = newPromiseCapabilityModule.f;
  var newGenericPromiseCapability = newPromiseCapability;

  var DISPATCH_EVENT = !!(document$1 && document$1.createEvent && global$g.dispatchEvent);
  var NATIVE_REJECTION_EVENT = isCallable$5(global$g.PromiseRejectionEvent);
  var UNHANDLED_REJECTION = 'unhandledrejection';
  var REJECTION_HANDLED = 'rejectionhandled';
  var PENDING = 0;
  var FULFILLED = 1;
  var REJECTED = 2;
  var HANDLED = 1;
  var UNHANDLED = 2;
  var SUBCLASSING = false;

  var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

  var FORCED$1 = isForced$2(PROMISE, function () {
    var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(PromiseConstructor);
    var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(PromiseConstructor);
    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
    // We can't detect it synchronously, so just check versions
    if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true;
    // We can't use @@species feature detection in V8 since it causes
    // deoptimization and performance degradation
    // https://github.com/zloirock/core-js/issues/679
    if (V8_VERSION >= 51 && /native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) return false;
    // Detect correctness of subclassing with @@species support
    var promise = new PromiseConstructor(function (resolve) { resolve(1); });
    var FakePromise = function (exec) {
      exec(function () { /* empty */ }, function () { /* empty */ });
    };
    var constructor = promise.constructor = {};
    constructor[SPECIES] = FakePromise;
    SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
    if (!SUBCLASSING) return true;
    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return !GLOBAL_CORE_JS_PROMISE && IS_BROWSER && !NATIVE_REJECTION_EVENT;
  });

  var INCORRECT_ITERATION$1 = FORCED$1 || !checkCorrectnessOfIteration$2(function (iterable) {
    PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
  });

  // helpers
  var isThenable = function (it) {
    var then;
    return isObject$5(it) && isCallable$5(then = it.then) ? then : false;
  };

  var callReaction = function (reaction, state) {
    var value = state.value;
    var ok = state.state == FULFILLED;
    var handler = ok ? reaction.ok : reaction.fail;
    var resolve = reaction.resolve;
    var reject = reaction.reject;
    var domain = reaction.domain;
    var result, then, exited;
    try {
      if (handler) {
        if (!ok) {
          if (state.rejection === UNHANDLED) onHandleUnhandled(state);
          state.rejection = HANDLED;
        }
        if (handler === true) result = value;
        else {
          if (domain) domain.enter();
          result = handler(value); // can throw
          if (domain) {
            domain.exit();
            exited = true;
          }
        }
        if (result === reaction.promise) {
          reject(TypeError$8('Promise-chain cycle'));
        } else if (then = isThenable(result)) {
          call$4(then, result, resolve, reject);
        } else resolve(result);
      } else reject(value);
    } catch (error) {
      if (domain && !exited) domain.exit();
      reject(error);
    }
  };

  var notify = function (state, isReject) {
    if (state.notified) return;
    state.notified = true;
    microtask(function () {
      var reactions = state.reactions;
      var reaction;
      while (reaction = reactions.get()) {
        callReaction(reaction, state);
      }
      state.notified = false;
      if (isReject && !state.rejection) onUnhandled(state);
    });
  };

  var dispatchEvent = function (name, promise, reason) {
    var event, handler;
    if (DISPATCH_EVENT) {
      event = document$1.createEvent('Event');
      event.promise = promise;
      event.reason = reason;
      event.initEvent(name, false, true);
      global$g.dispatchEvent(event);
    } else event = { promise: promise, reason: reason };
    if (!NATIVE_REJECTION_EVENT && (handler = global$g['on' + name])) handler(event);
    else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
  };

  var onUnhandled = function (state) {
    call$4(task, global$g, function () {
      var promise = state.facade;
      var value = state.value;
      var IS_UNHANDLED = isUnhandled(state);
      var result;
      if (IS_UNHANDLED) {
        result = perform(function () {
          if (IS_NODE) {
            process.emit('unhandledRejection', value, promise);
          } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
        });
        // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
        state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
        if (result.error) throw result.value;
      }
    });
  };

  var isUnhandled = function (state) {
    return state.rejection !== HANDLED && !state.parent;
  };

  var onHandleUnhandled = function (state) {
    call$4(task, global$g, function () {
      var promise = state.facade;
      if (IS_NODE) {
        process.emit('rejectionHandled', promise);
      } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
    });
  };

  var bind$4 = function (fn, state, unwrap) {
    return function (value) {
      fn(state, value, unwrap);
    };
  };

  var internalReject = function (state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    state.value = value;
    state.state = REJECTED;
    notify(state, true);
  };

  var internalResolve = function (state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    try {
      if (state.facade === value) throw TypeError$8("Promise can't be resolved itself");
      var then = isThenable(value);
      if (then) {
        microtask(function () {
          var wrapper = { done: false };
          try {
            call$4(then, value,
              bind$4(internalResolve, wrapper, state),
              bind$4(internalReject, wrapper, state)
            );
          } catch (error) {
            internalReject(wrapper, error, state);
          }
        });
      } else {
        state.value = value;
        state.state = FULFILLED;
        notify(state, false);
      }
    } catch (error) {
      internalReject({ done: false }, error, state);
    }
  };

  // constructor polyfill
  if (FORCED$1) {
    // 25.4.3.1 Promise(executor)
    PromiseConstructor = function Promise(executor) {
      anInstance$4(this, PromisePrototype);
      aCallable(executor);
      call$4(Internal, this);
      var state = getInternalState$2(this);
      try {
        executor(bind$4(internalResolve, state), bind$4(internalReject, state));
      } catch (error) {
        internalReject(state, error);
      }
    };
    PromisePrototype = PromiseConstructor.prototype;
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    Internal = function Promise(executor) {
      setInternalState$5(this, {
        type: PROMISE,
        done: false,
        notified: false,
        parent: false,
        reactions: new Queue(),
        rejection: false,
        state: PENDING,
        value: undefined
      });
    };
    Internal.prototype = redefineAll$2(PromisePrototype, {
      // `Promise.prototype.then` method
      // https://tc39.es/ecma262/#sec-promise.prototype.then
      // eslint-disable-next-line unicorn/no-thenable -- safe
      then: function then(onFulfilled, onRejected) {
        var state = getInternalPromiseState(this);
        var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
        state.parent = true;
        reaction.ok = isCallable$5(onFulfilled) ? onFulfilled : true;
        reaction.fail = isCallable$5(onRejected) && onRejected;
        reaction.domain = IS_NODE ? process.domain : undefined;
        if (state.state == PENDING) state.reactions.add(reaction);
        else microtask(function () {
          callReaction(reaction, state);
        });
        return reaction.promise;
      },
      // `Promise.prototype.catch` method
      // https://tc39.es/ecma262/#sec-promise.prototype.catch
      'catch': function (onRejected) {
        return this.then(undefined, onRejected);
      }
    });
    OwnPromiseCapability = function () {
      var promise = new Internal();
      var state = getInternalState$2(promise);
      this.promise = promise;
      this.resolve = bind$4(internalResolve, state);
      this.reject = bind$4(internalReject, state);
    };
    newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
      return C === PromiseConstructor || C === PromiseWrapper
        ? new OwnPromiseCapability(C)
        : newGenericPromiseCapability(C);
    };

    if (isCallable$5(NativePromise) && NativePromisePrototype !== Object.prototype) {
      nativeThen = NativePromisePrototype.then;

      if (!SUBCLASSING) {
        // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
        redefine$5(NativePromisePrototype, 'then', function then(onFulfilled, onRejected) {
          var that = this;
          return new PromiseConstructor(function (resolve, reject) {
            call$4(nativeThen, that, resolve, reject);
          }).then(onFulfilled, onRejected);
        // https://github.com/zloirock/core-js/issues/640
        }, { unsafe: true });

        // makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
        redefine$5(NativePromisePrototype, 'catch', PromisePrototype['catch'], { unsafe: true });
      }

      // make `.constructor === Promise` work for native promise-based APIs
      try {
        delete NativePromisePrototype.constructor;
      } catch (error) { /* empty */ }

      // make `instanceof Promise` work for native promise-based APIs
      if (setPrototypeOf) {
        setPrototypeOf(NativePromisePrototype, PromisePrototype);
      }
    }
  }

  $$g({ global: true, wrap: true, forced: FORCED$1 }, {
    Promise: PromiseConstructor
  });

  setToStringTag$4(PromiseConstructor, PROMISE, false);
  setSpecies$1(PROMISE);

  PromiseWrapper = getBuiltIn$2(PROMISE);

  // statics
  $$g({ target: PROMISE, stat: true, forced: FORCED$1 }, {
    // `Promise.reject` method
    // https://tc39.es/ecma262/#sec-promise.reject
    reject: function reject(r) {
      var capability = newPromiseCapability(this);
      call$4(capability.reject, undefined, r);
      return capability.promise;
    }
  });

  $$g({ target: PROMISE, stat: true, forced: FORCED$1 }, {
    // `Promise.resolve` method
    // https://tc39.es/ecma262/#sec-promise.resolve
    resolve: function resolve(x) {
      return promiseResolve(this, x);
    }
  });

  $$g({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION$1 }, {
    // `Promise.all` method
    // https://tc39.es/ecma262/#sec-promise.all
    all: function all(iterable) {
      var C = this;
      var capability = newPromiseCapability(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = perform(function () {
        var $promiseResolve = aCallable(C.resolve);
        var values = [];
        var counter = 0;
        var remaining = 1;
        iterate$3(iterable, function (promise) {
          var index = counter++;
          var alreadyCalled = false;
          remaining++;
          call$4($promiseResolve, C, promise).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[index] = value;
            --remaining || resolve(values);
          }, reject);
        });
        --remaining || resolve(values);
      });
      if (result.error) reject(result.value);
      return capability.promise;
    },
    // `Promise.race` method
    // https://tc39.es/ecma262/#sec-promise.race
    race: function race(iterable) {
      var C = this;
      var capability = newPromiseCapability(C);
      var reject = capability.reject;
      var result = perform(function () {
        var $promiseResolve = aCallable(C.resolve);
        iterate$3(iterable, function (promise) {
          call$4($promiseResolve, C, promise).then(capability.resolve, reject);
        });
      });
      if (result.error) reject(result.value);
      return capability.promise;
    }
  });

  var $$f = _export;
  var global$f = global$19;
  var toAbsoluteIndex = toAbsoluteIndex$8;
  var toIntegerOrInfinity$1 = toIntegerOrInfinity$9;
  var lengthOfArrayLike$1 = lengthOfArrayLike$f;
  var toObject$3 = toObject$d;
  var arraySpeciesCreate = arraySpeciesCreate$3;
  var createProperty$2 = createProperty$6;
  var arrayMethodHasSpeciesSupport$1 = arrayMethodHasSpeciesSupport$5;

  var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport$1('splice');

  var TypeError$7 = global$f.TypeError;
  var max$1 = Math.max;
  var min$3 = Math.min;
  var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
  var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

  // `Array.prototype.splice` method
  // https://tc39.es/ecma262/#sec-array.prototype.splice
  // with adding support of @@species
  $$f({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
    splice: function splice(start, deleteCount /* , ...items */) {
      var O = toObject$3(this);
      var len = lengthOfArrayLike$1(O);
      var actualStart = toAbsoluteIndex(start, len);
      var argumentsLength = arguments.length;
      var insertCount, actualDeleteCount, A, k, from, to;
      if (argumentsLength === 0) {
        insertCount = actualDeleteCount = 0;
      } else if (argumentsLength === 1) {
        insertCount = 0;
        actualDeleteCount = len - actualStart;
      } else {
        insertCount = argumentsLength - 2;
        actualDeleteCount = min$3(max$1(toIntegerOrInfinity$1(deleteCount), 0), len - actualStart);
      }
      if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
        throw TypeError$7(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
      }
      A = arraySpeciesCreate(O, actualDeleteCount);
      for (k = 0; k < actualDeleteCount; k++) {
        from = actualStart + k;
        if (from in O) createProperty$2(A, k, O[from]);
      }
      A.length = actualDeleteCount;
      if (insertCount < actualDeleteCount) {
        for (k = actualStart; k < len - actualDeleteCount; k++) {
          from = k + actualDeleteCount;
          to = k + insertCount;
          if (from in O) O[to] = O[from];
          else delete O[to];
        }
        for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
      } else if (insertCount > actualDeleteCount) {
        for (k = len - actualDeleteCount; k > actualStart; k--) {
          from = k + actualDeleteCount - 1;
          to = k + insertCount - 1;
          if (from in O) O[to] = O[from];
          else delete O[to];
        }
      }
      for (k = 0; k < insertCount; k++) {
        O[k + actualStart] = arguments[k + 2];
      }
      O.length = len - actualDeleteCount + insertCount;
      return A;
    }
  });

  var global$e = global$19;

  var globalIsFinite = global$e.isFinite;

  // `Number.isFinite` method
  // https://tc39.es/ecma262/#sec-number.isfinite
  // eslint-disable-next-line es/no-number-isfinite -- safe
  var numberIsFinite$1 = Number.isFinite || function isFinite(it) {
    return typeof it == 'number' && globalIsFinite(it);
  };

  var $$e = _export;
  var numberIsFinite = numberIsFinite$1;

  // `Number.isFinite` method
  // https://tc39.es/ecma262/#sec-number.isfinite
  $$e({ target: 'Number', stat: true }, { isFinite: numberIsFinite });

  var uncurryThis$f = functionUncurryThis;

  // `thisNumberValue` abstract operation
  // https://tc39.es/ecma262/#sec-thisnumbervalue
  var thisNumberValue$1 = uncurryThis$f(1.0.valueOf);

  // a string of all valid unicode whitespaces
  var whitespaces$2 = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
    '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

  var uncurryThis$e = functionUncurryThis;
  var requireObjectCoercible$3 = requireObjectCoercible$8;
  var toString$5 = toString$9;
  var whitespaces$1 = whitespaces$2;

  var replace$5 = uncurryThis$e(''.replace);
  var whitespace = '[' + whitespaces$1 + ']';
  var ltrim = RegExp('^' + whitespace + whitespace + '*');
  var rtrim = RegExp(whitespace + whitespace + '*$');

  // `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
  var createMethod$1 = function (TYPE) {
    return function ($this) {
      var string = toString$5(requireObjectCoercible$3($this));
      if (TYPE & 1) string = replace$5(string, ltrim, '');
      if (TYPE & 2) string = replace$5(string, rtrim, '');
      return string;
    };
  };

  var stringTrim = {
    // `String.prototype.{ trimLeft, trimStart }` methods
    // https://tc39.es/ecma262/#sec-string.prototype.trimstart
    start: createMethod$1(1),
    // `String.prototype.{ trimRight, trimEnd }` methods
    // https://tc39.es/ecma262/#sec-string.prototype.trimend
    end: createMethod$1(2),
    // `String.prototype.trim` method
    // https://tc39.es/ecma262/#sec-string.prototype.trim
    trim: createMethod$1(3)
  };

  var DESCRIPTORS$6 = descriptors;
  var global$d = global$19;
  var uncurryThis$d = functionUncurryThis;
  var isForced$1 = isForced_1;
  var redefine$4 = redefine$d.exports;
  var hasOwn$6 = hasOwnProperty_1;
  var inheritIfRequired$1 = inheritIfRequired$3;
  var isPrototypeOf$2 = objectIsPrototypeOf;
  var isSymbol$1 = isSymbol$5;
  var toPrimitive = toPrimitive$2;
  var fails$9 = fails$D;
  var getOwnPropertyNames = objectGetOwnPropertyNames.f;
  var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
  var defineProperty$5 = objectDefineProperty.f;
  var thisNumberValue = thisNumberValue$1;
  var trim = stringTrim.trim;

  var NUMBER = 'Number';
  var NativeNumber = global$d[NUMBER];
  var NumberPrototype = NativeNumber.prototype;
  var TypeError$6 = global$d.TypeError;
  var arraySlice$3 = uncurryThis$d(''.slice);
  var charCodeAt$1 = uncurryThis$d(''.charCodeAt);

  // `ToNumeric` abstract operation
  // https://tc39.es/ecma262/#sec-tonumeric
  var toNumeric = function (value) {
    var primValue = toPrimitive(value, 'number');
    return typeof primValue == 'bigint' ? primValue : toNumber(primValue);
  };

  // `ToNumber` abstract operation
  // https://tc39.es/ecma262/#sec-tonumber
  var toNumber = function (argument) {
    var it = toPrimitive(argument, 'number');
    var first, third, radix, maxCode, digits, length, index, code;
    if (isSymbol$1(it)) throw TypeError$6('Cannot convert a Symbol value to a number');
    if (typeof it == 'string' && it.length > 2) {
      it = trim(it);
      first = charCodeAt$1(it, 0);
      if (first === 43 || first === 45) {
        third = charCodeAt$1(it, 2);
        if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
      } else if (first === 48) {
        switch (charCodeAt$1(it, 1)) {
          case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
          case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
          default: return +it;
        }
        digits = arraySlice$3(it, 2);
        length = digits.length;
        for (index = 0; index < length; index++) {
          code = charCodeAt$1(digits, index);
          // parseInt parses a string to a first unavailable symbol
          // but ToNumber should return NaN if a string contains unavailable symbols
          if (code < 48 || code > maxCode) return NaN;
        } return parseInt(digits, radix);
      }
    } return +it;
  };

  // `Number` constructor
  // https://tc39.es/ecma262/#sec-number-constructor
  if (isForced$1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
    var NumberWrapper = function Number(value) {
      var n = arguments.length < 1 ? 0 : NativeNumber(toNumeric(value));
      var dummy = this;
      // check on 1..constructor(foo) case
      return isPrototypeOf$2(NumberPrototype, dummy) && fails$9(function () { thisNumberValue(dummy); })
        ? inheritIfRequired$1(Object(n), dummy, NumberWrapper) : n;
    };
    for (var keys = DESCRIPTORS$6 ? getOwnPropertyNames(NativeNumber) : (
      // ES3:
      'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
      // ES2015 (in case, if modules with ES2015 Number statics required before):
      'EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,' +
      // ESNext
      'fromString,range'
    ).split(','), j$1 = 0, key; keys.length > j$1; j$1++) {
      if (hasOwn$6(NativeNumber, key = keys[j$1]) && !hasOwn$6(NumberWrapper, key)) {
        defineProperty$5(NumberWrapper, key, getOwnPropertyDescriptor$2(NativeNumber, key));
      }
    }
    NumberWrapper.prototype = NumberPrototype;
    NumberPrototype.constructor = NumberWrapper;
    redefine$4(global$d, NUMBER, NumberWrapper);
  }

  var $$d = _export;
  var $filter = arrayIteration.filter;
  var arrayMethodHasSpeciesSupport = arrayMethodHasSpeciesSupport$5;

  var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  // with adding support of @@species
  $$d({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
    filter: function filter(callbackfn /* , thisArg */) {
      return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // iterable DOM collections
  // flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
  var domIterables = {
    CSSRuleList: 0,
    CSSStyleDeclaration: 0,
    CSSValueList: 0,
    ClientRectList: 0,
    DOMRectList: 0,
    DOMStringList: 0,
    DOMTokenList: 1,
    DataTransferItemList: 0,
    FileList: 0,
    HTMLAllCollection: 0,
    HTMLCollection: 0,
    HTMLFormElement: 0,
    HTMLSelectElement: 0,
    MediaList: 0,
    MimeTypeArray: 0,
    NamedNodeMap: 0,
    NodeList: 1,
    PaintRequestList: 0,
    Plugin: 0,
    PluginArray: 0,
    SVGLengthList: 0,
    SVGNumberList: 0,
    SVGPathSegList: 0,
    SVGPointList: 0,
    SVGStringList: 0,
    SVGTransformList: 0,
    SourceBufferList: 0,
    StyleSheetList: 0,
    TextTrackCueList: 0,
    TextTrackList: 0,
    TouchList: 0
  };

  // in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
  var documentCreateElement = documentCreateElement$2;

  var classList = documentCreateElement('span').classList;
  var DOMTokenListPrototype$2 = classList && classList.constructor && classList.constructor.prototype;

  var domTokenListPrototype = DOMTokenListPrototype$2 === Object.prototype ? undefined : DOMTokenListPrototype$2;

  var $forEach$1 = arrayIteration.forEach;
  var arrayMethodIsStrict = arrayMethodIsStrict$2;

  var STRICT_METHOD = arrayMethodIsStrict('forEach');

  // `Array.prototype.forEach` method implementation
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  var arrayForEach = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
    return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  // eslint-disable-next-line es/no-array-prototype-foreach -- safe
  } : [].forEach;

  var global$c = global$19;
  var DOMIterables$1 = domIterables;
  var DOMTokenListPrototype$1 = domTokenListPrototype;
  var forEach = arrayForEach;
  var createNonEnumerableProperty$1 = createNonEnumerableProperty$a;

  var handlePrototype$1 = function (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
      createNonEnumerableProperty$1(CollectionPrototype, 'forEach', forEach);
    } catch (error) {
      CollectionPrototype.forEach = forEach;
    }
  };

  for (var COLLECTION_NAME$1 in DOMIterables$1) {
    if (DOMIterables$1[COLLECTION_NAME$1]) {
      handlePrototype$1(global$c[COLLECTION_NAME$1] && global$c[COLLECTION_NAME$1].prototype);
    }
  }

  handlePrototype$1(DOMTokenListPrototype$1);

  var runtime = {exports: {}};

  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  (function (module) {
  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function define(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
      return obj[key];
    }
    try {
      // IE 8 has a broken Object.defineProperty that only works on DOM objects.
      define({}, "");
    } catch (err) {
      define = function(obj, key, value) {
        return obj[key] = value;
      };
    }

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    define(IteratorPrototype, iteratorSymbol, function () {
      return this;
    });

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = GeneratorFunctionPrototype;
    define(Gp, "constructor", GeneratorFunctionPrototype);
    define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
    GeneratorFunction.displayName = define(
      GeneratorFunctionPrototype,
      toStringTagSymbol,
      "GeneratorFunction"
    );

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        define(prototype, method, function(arg) {
          return this._invoke(method, arg);
        });
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define(genFun, toStringTagSymbol, "GeneratorFunction");
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
      return this;
    });
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;

      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList),
        PromiseImpl
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    define(Gp, toStringTagSymbol, "Generator");

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    define(Gp, iteratorSymbol, function() {
      return this;
    });

    define(Gp, "toString", function() {
      return "[object Generator]";
    });

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    module.exports 
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, in modern engines
    // we can explicitly access globalThis. In older engines we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    if (typeof globalThis === "object") {
      globalThis.regeneratorRuntime = runtime;
    } else {
      Function("r", "regeneratorRuntime = r")(runtime);
    }
  }
  }(runtime));

  var global$b = global$19;
  var isRegExp = isRegexp;

  var TypeError$5 = global$b.TypeError;

  var notARegexp = function (it) {
    if (isRegExp(it)) {
      throw TypeError$5("The method doesn't accept regular expressions");
    } return it;
  };

  var wellKnownSymbol$6 = wellKnownSymbol$s;

  var MATCH = wellKnownSymbol$6('match');

  var correctIsRegexpLogic = function (METHOD_NAME) {
    var regexp = /./;
    try {
      '/./'[METHOD_NAME](regexp);
    } catch (error1) {
      try {
        regexp[MATCH] = false;
        return '/./'[METHOD_NAME](regexp);
      } catch (error2) { /* empty */ }
    } return false;
  };

  var $$c = _export;
  var uncurryThis$c = functionUncurryThis;
  var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
  var toLength$2 = toLength$a;
  var toString$4 = toString$9;
  var notARegExp$1 = notARegexp;
  var requireObjectCoercible$2 = requireObjectCoercible$8;
  var correctIsRegExpLogic$1 = correctIsRegexpLogic;

  // eslint-disable-next-line es/no-string-prototype-startswith -- safe
  var un$StartsWith = uncurryThis$c(''.startsWith);
  var stringSlice$5 = uncurryThis$c(''.slice);
  var min$2 = Math.min;

  var CORRECT_IS_REGEXP_LOGIC$1 = correctIsRegExpLogic$1('startsWith');
  // https://github.com/zloirock/core-js/pull/702
  var MDN_POLYFILL_BUG$1 = !CORRECT_IS_REGEXP_LOGIC$1 && !!function () {
    var descriptor = getOwnPropertyDescriptor$1(String.prototype, 'startsWith');
    return descriptor && !descriptor.writable;
  }();

  // `String.prototype.startsWith` method
  // https://tc39.es/ecma262/#sec-string.prototype.startswith
  $$c({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG$1 && !CORRECT_IS_REGEXP_LOGIC$1 }, {
    startsWith: function startsWith(searchString /* , position = 0 */) {
      var that = toString$4(requireObjectCoercible$2(this));
      notARegExp$1(searchString);
      var index = toLength$2(min$2(arguments.length > 1 ? arguments[1] : undefined, that.length));
      var search = toString$4(searchString);
      return un$StartsWith
        ? un$StartsWith(that, search, index)
        : stringSlice$5(that, index, index + search.length) === search;
    }
  });

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  var table = [];

  for (var i = 0; i < 256; i++) {
    var t = i;

    for (var j = 0; j < 8; j++) {
      if (t & 1) {
        t = t >>> 1 ^ 0xEDB88320;
      } else {
        t = t >>> 1;
      }
    }

    table[i] = t;
  }

  var Crc32 = /*#__PURE__*/function () {
    function Crc32(crc) {
      _classCallCheck(this, Crc32);

      this.crc = crc || -1;
    }

    _createClass(Crc32, [{
      key: "append",
      value: function append(data) {
        var crc = this.crc | 0;

        for (var offset = 0, length = data.length | 0; offset < length; offset++) {
          crc = crc >>> 8 ^ table[(crc ^ data[offset]) & 0xFF];
        }

        this.crc = crc;
      }
    }, {
      key: "get",
      value: function get() {
        return ~this.crc;
      }
    }]);

    return Crc32;
  }();

  var global$a = global$19;
  var DOMIterables = domIterables;
  var DOMTokenListPrototype = domTokenListPrototype;
  var ArrayIteratorMethods = es_array_iterator;
  var createNonEnumerableProperty = createNonEnumerableProperty$a;
  var wellKnownSymbol$5 = wellKnownSymbol$s;

  var ITERATOR$2 = wellKnownSymbol$5('iterator');
  var TO_STRING_TAG = wellKnownSymbol$5('toStringTag');
  var ArrayValues = ArrayIteratorMethods.values;

  var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
    if (CollectionPrototype) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[ITERATOR$2] !== ArrayValues) try {
        createNonEnumerableProperty(CollectionPrototype, ITERATOR$2, ArrayValues);
      } catch (error) {
        CollectionPrototype[ITERATOR$2] = ArrayValues;
      }
      if (!CollectionPrototype[TO_STRING_TAG]) {
        createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
      }
      if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
        // some Chrome versions have non-configurable methods on DOMTokenList
        if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
          createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
        } catch (error) {
          CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
        }
      }
    }
  };

  for (var COLLECTION_NAME in DOMIterables) {
    handlePrototype(global$a[COLLECTION_NAME] && global$a[COLLECTION_NAME].prototype, COLLECTION_NAME);
  }

  handlePrototype(DOMTokenListPrototype, 'DOMTokenList');

  var anObject$3 = anObject$i;
  var iteratorClose = iteratorClose$2;

  // call something on iterator step with safe closing on error
  var callWithSafeIterationClosing$1 = function (iterator, fn, value, ENTRIES) {
    try {
      return ENTRIES ? fn(anObject$3(value)[0], value[1]) : fn(value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
  };

  var global$9 = global$19;
  var bind$3 = functionBindContext;
  var call$3 = functionCall;
  var toObject$2 = toObject$d;
  var callWithSafeIterationClosing = callWithSafeIterationClosing$1;
  var isArrayIteratorMethod = isArrayIteratorMethod$3;
  var isConstructor = isConstructor$4;
  var lengthOfArrayLike = lengthOfArrayLike$f;
  var createProperty$1 = createProperty$6;
  var getIterator$1 = getIterator$4;
  var getIteratorMethod$1 = getIteratorMethod$5;

  var Array$1 = global$9.Array;

  // `Array.from` method implementation
  // https://tc39.es/ecma262/#sec-array.from
  var arrayFrom$1 = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject$2(arrayLike);
    var IS_CONSTRUCTOR = isConstructor(this);
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    if (mapping) mapfn = bind$3(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
    var iteratorMethod = getIteratorMethod$1(O);
    var index = 0;
    var length, result, step, iterator, next, value;
    // if the target is not iterable or it's an array with the default iterator - use a simple case
    if (iteratorMethod && !(this == Array$1 && isArrayIteratorMethod(iteratorMethod))) {
      iterator = getIterator$1(O, iteratorMethod);
      next = iterator.next;
      result = IS_CONSTRUCTOR ? new this() : [];
      for (;!(step = call$3(next, iterator)).done; index++) {
        value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
        createProperty$1(result, index, value);
      }
    } else {
      length = lengthOfArrayLike(O);
      result = IS_CONSTRUCTOR ? new this(length) : Array$1(length);
      for (;length > index; index++) {
        value = mapping ? mapfn(O[index], index) : O[index];
        createProperty$1(result, index, value);
      }
    }
    result.length = index;
    return result;
  };

  var $$b = _export;
  var from = arrayFrom$1;
  var checkCorrectnessOfIteration$1 = checkCorrectnessOfIteration$4;

  var INCORRECT_ITERATION = !checkCorrectnessOfIteration$1(function (iterable) {
    // eslint-disable-next-line es/no-array-from -- required for testing
    Array.from(iterable);
  });

  // `Array.from` method
  // https://tc39.es/ecma262/#sec-array.from
  $$b({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
    from: from
  });

  var charAt$3 = stringMultibyte.charAt;
  var toString$3 = toString$9;
  var InternalStateModule$4 = internalState;
  var defineIterator$1 = defineIterator$3;

  var STRING_ITERATOR = 'String Iterator';
  var setInternalState$4 = InternalStateModule$4.set;
  var getInternalState$1 = InternalStateModule$4.getterFor(STRING_ITERATOR);

  // `String.prototype[@@iterator]` method
  // https://tc39.es/ecma262/#sec-string.prototype-@@iterator
  defineIterator$1(String, 'String', function (iterated) {
    setInternalState$4(this, {
      type: STRING_ITERATOR,
      string: toString$3(iterated),
      index: 0
    });
  // `%StringIteratorPrototype%.next` method
  // https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
  }, function next() {
    var state = getInternalState$1(this);
    var string = state.string;
    var index = state.index;
    var point;
    if (index >= string.length) return { value: undefined, done: true };
    point = charAt$3(string, index);
    state.index += point.length;
    return { value: point, done: false };
  });

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */

  function encodeText(value) {
    if (typeof TextEncoder == "undefined") {
      value = unescape(encodeURIComponent(value));
      var result = new Uint8Array(value.length);

      for (var i = 0; i < result.length; i++) {
        result[i] = value.charCodeAt(i);
      }

      return result;
    } else {
      return new TextEncoder().encode(value);
    }
  }

  var createTypedArrayConstructor = typedArrayConstructor.exports;

  // `Uint32Array` constructor
  // https://tc39.es/ecma262/#sec-typedarray-objects
  createTypedArrayConstructor('Uint32', function (init) {
    return function Uint32Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // Derived from https://github.com/xqdoo00o/jszip/blob/master/lib/sjcl.js
  var bitArray = {
    /**
     * Concatenate two bit arrays.
     * @param {bitArray} a1 The first array.
     * @param {bitArray} a2 The second array.
     * @return {bitArray} The concatenation of a1 and a2.
     */
    concat: function concat(a1, a2) {
      if (a1.length === 0 || a2.length === 0) {
        return a1.concat(a2);
      }

      var last = a1[a1.length - 1],
          shift = bitArray.getPartial(last);

      if (shift === 32) {
        return a1.concat(a2);
      } else {
        return bitArray._shiftRight(a2, shift, last | 0, a1.slice(0, a1.length - 1));
      }
    },

    /**
     * Find the length of an array of bits.
     * @param {bitArray} a The array.
     * @return {Number} The length of a, in bits.
     */
    bitLength: function bitLength(a) {
      var l = a.length;

      if (l === 0) {
        return 0;
      }

      var x = a[l - 1];
      return (l - 1) * 32 + bitArray.getPartial(x);
    },

    /**
     * Truncate an array.
     * @param {bitArray} a The array.
     * @param {Number} len The length to truncate to, in bits.
     * @return {bitArray} A new array, truncated to len bits.
     */
    clamp: function clamp(a, len) {
      if (a.length * 32 < len) {
        return a;
      }

      a = a.slice(0, Math.ceil(len / 32));
      var l = a.length;
      len = len & 31;

      if (l > 0 && len) {
        a[l - 1] = bitArray.partial(len, a[l - 1] & 0x80000000 >> len - 1, 1);
      }

      return a;
    },

    /**
     * Make a partial word for a bit array.
     * @param {Number} len The number of bits in the word.
     * @param {Number} x The bits.
     * @param {Number} [_end=0] Pass 1 if x has already been shifted to the high side.
     * @return {Number} The partial word.
     */
    partial: function partial(len, x, _end) {
      if (len === 32) {
        return x;
      }

      return (_end ? x | 0 : x << 32 - len) + len * 0x10000000000;
    },

    /**
     * Get the number of bits used by a partial word.
     * @param {Number} x The partial word.
     * @return {Number} The number of bits used by the partial word.
     */
    getPartial: function getPartial(x) {
      return Math.round(x / 0x10000000000) || 32;
    },

    /** Shift an array right.
     * @param {bitArray} a The array to shift.
     * @param {Number} shift The number of bits to shift.
     * @param {Number} [carry=0] A byte to carry in
     * @param {bitArray} [out=[]] An array to prepend to the output.
     * @private
     */
    _shiftRight: function _shiftRight(a, shift, carry, out) {
      if (out === undefined) {
        out = [];
      }

      for (; shift >= 32; shift -= 32) {
        out.push(carry);
        carry = 0;
      }

      if (shift === 0) {
        return out.concat(a);
      }

      for (var i = 0; i < a.length; i++) {
        out.push(carry | a[i] >>> shift);
        carry = a[i] << 32 - shift;
      }

      var last2 = a.length ? a[a.length - 1] : 0;
      var shift2 = bitArray.getPartial(last2);
      out.push(bitArray.partial(shift + shift2 & 31, shift + shift2 > 32 ? carry : out.pop(), 1));
      return out;
    }
  };
  /** @fileOverview Bit array codec implementations.
   *
   * @author Emily Stark
   * @author Mike Hamburg
   * @author Dan Boneh
   */

  /**
   * Arrays of bytes
   * @namespace
   */

  var codec = {
    bytes: {
      /** Convert from a bitArray to an array of bytes. */
      fromBits: function fromBits(arr) {
        var bl = bitArray.bitLength(arr);
        var byteLength = bl / 8;
        var out = new Uint8Array(byteLength);
        var tmp;

        for (var i = 0; i < byteLength; i++) {
          if ((i & 3) === 0) {
            tmp = arr[i / 4];
          }

          out[i] = tmp >>> 24;
          tmp <<= 8;
        }

        return out;
      },

      /** Convert from an array of bytes to a bitArray. */
      toBits: function toBits(bytes) {
        var out = [];
        var i;
        var tmp = 0;

        for (i = 0; i < bytes.length; i++) {
          tmp = tmp << 8 | bytes[i];

          if ((i & 3) === 3) {
            out.push(tmp);
            tmp = 0;
          }
        }

        if (i & 3) {
          out.push(bitArray.partial(8 * (i & 3), tmp));
        }

        return out;
      }
    }
  };
  var hash = {};
  /**
   * Context for a SHA-1 operation in progress.
   * @constructor
   */

  hash.sha1 = function (hash) {
    if (hash) {
      this._h = hash._h.slice(0);
      this._buffer = hash._buffer.slice(0);
      this._length = hash._length;
    } else {
      this.reset();
    }
  };

  hash.sha1.prototype = {
    /**
     * The hash's block size, in bits.
     * @constant
     */
    blockSize: 512,

    /**
     * Reset the hash state.
     * @return this
     */
    reset: function reset() {
      var sha1 = this;
      sha1._h = this._init.slice(0);
      sha1._buffer = [];
      sha1._length = 0;
      return sha1;
    },

    /**
     * Input several words to the hash.
     * @param {bitArray|String} data the data to hash.
     * @return this
     */
    update: function update(data) {
      var sha1 = this;

      if (typeof data === "string") {
        data = codec.utf8String.toBits(data);
      }

      var b = sha1._buffer = bitArray.concat(sha1._buffer, data);
      var ol = sha1._length;
      var nl = sha1._length = ol + bitArray.bitLength(data);

      if (nl > 9007199254740991) {
        throw new Error("Cannot hash more than 2^53 - 1 bits");
      }

      var c = new Uint32Array(b);
      var j = 0;

      for (var i = sha1.blockSize + ol - (sha1.blockSize + ol & sha1.blockSize - 1); i <= nl; i += sha1.blockSize) {
        sha1._block(c.subarray(16 * j, 16 * (j + 1)));

        j += 1;
      }

      b.splice(0, 16 * j);
      return sha1;
    },

    /**
     * Complete hashing and output the hash value.
     * @return {bitArray} The hash value, an array of 5 big-endian words. TODO
     */
    finalize: function finalize() {
      var sha1 = this;
      var b = sha1._buffer;
      var h = sha1._h; // Round out and push the buffer

      b = bitArray.concat(b, [bitArray.partial(1, 1)]); // Round out the buffer to a multiple of 16 words, less the 2 length words.

      for (var i = b.length + 2; i & 15; i++) {
        b.push(0);
      } // append the length


      b.push(Math.floor(sha1._length / 0x100000000));
      b.push(sha1._length | 0);

      while (b.length) {
        sha1._block(b.splice(0, 16));
      }

      sha1.reset();
      return h;
    },

    /**
     * The SHA-1 initialization vector.
     * @private
     */
    _init: [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0],

    /**
     * The SHA-1 hash key.
     * @private
     */
    _key: [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6],

    /**
     * The SHA-1 logical functions f(0), f(1), ..., f(79).
     * @private
     */
    _f: function _f(t, b, c, d) {
      if (t <= 19) {
        return b & c | ~b & d;
      } else if (t <= 39) {
        return b ^ c ^ d;
      } else if (t <= 59) {
        return b & c | b & d | c & d;
      } else if (t <= 79) {
        return b ^ c ^ d;
      }
    },

    /**
     * Circular left-shift operator.
     * @private
     */
    _S: function _S(n, x) {
      return x << n | x >>> 32 - n;
    },

    /**
     * Perform one cycle of SHA-1.
     * @param {Uint32Array|bitArray} words one block of words.
     * @private
     */
    _block: function _block(words) {
      var sha1 = this;
      var h = sha1._h; // When words is passed to _block, it has 16 elements. SHA1 _block
      // function extends words with new elements (at the end there are 80 elements). 
      // The problem is that if we use Uint32Array instead of Array, 
      // the length of Uint32Array cannot be changed. Thus, we replace words with a 
      // normal Array here.

      var w = Array(80); // do not use Uint32Array here as the instantiation is slower

      for (var j = 0; j < 16; j++) {
        w[j] = words[j];
      }

      var a = h[0];
      var b = h[1];
      var c = h[2];
      var d = h[3];
      var e = h[4];

      for (var t = 0; t <= 79; t++) {
        if (t >= 16) {
          w[t] = sha1._S(1, w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16]);
        }

        var tmp = sha1._S(5, a) + sha1._f(t, b, c, d) + e + w[t] + sha1._key[Math.floor(t / 20)] | 0;
        e = d;
        d = c;
        c = sha1._S(30, b);
        b = a;
        a = tmp;
      }

      h[0] = h[0] + a | 0;
      h[1] = h[1] + b | 0;
      h[2] = h[2] + c | 0;
      h[3] = h[3] + d | 0;
      h[4] = h[4] + e | 0;
    }
  };
  /** @fileOverview Low-level AES implementation.
   *
   * This file contains a low-level implementation of AES, optimized for
   * size and for efficiency on several browsers.  It is based on
   * OpenSSL's aes_core.c, a public-domain implementation by Vincent
   * Rijmen, Antoon Bosselaers and Paulo Barreto.
   *
   * An older version of this implementation is available in the public
   * domain, but this one is (c) Emily Stark, Mike Hamburg, Dan Boneh,
   * Stanford University 2008-2010 and BSD-licensed for liability
   * reasons.
   *
   * @author Emily Stark
   * @author Mike Hamburg
   * @author Dan Boneh
   */

  var cipher = {};
  /**
   * Schedule out an AES key for both encryption and decryption.  This
   * is a low-level class.  Use a cipher mode to do bulk encryption.
   *
   * @constructor
   * @param {Array} key The key as an array of 4, 6 or 8 words.
   */

  cipher.aes = /*#__PURE__*/function () {
    function _class(key) {
      _classCallCheck(this, _class);

      /**
       * The expanded S-box and inverse S-box tables.  These will be computed
       * on the client so that we don't have to send them down the wire.
       *
       * There are two tables, _tables[0] is for encryption and
       * _tables[1] is for decryption.
       *
       * The first 4 sub-tables are the expanded S-box with MixColumns.  The
       * last (_tables[01][4]) is the S-box itself.
       *
       * @private
       */
      var aes = this;
      aes._tables = [[[], [], [], [], []], [[], [], [], [], []]];

      if (!aes._tables[0][0][0]) {
        aes._precompute();
      }

      var sbox = aes._tables[0][4];
      var decTable = aes._tables[1];
      var keyLen = key.length;
      var i,
          encKey,
          decKey,
          rcon = 1;

      if (keyLen !== 4 && keyLen !== 6 && keyLen !== 8) {
        throw new Error("invalid aes key size");
      }

      aes._key = [encKey = key.slice(0), decKey = []]; // schedule encryption keys

      for (i = keyLen; i < 4 * keyLen + 28; i++) {
        var tmp = encKey[i - 1]; // apply sbox

        if (i % keyLen === 0 || keyLen === 8 && i % keyLen === 4) {
          tmp = sbox[tmp >>> 24] << 24 ^ sbox[tmp >> 16 & 255] << 16 ^ sbox[tmp >> 8 & 255] << 8 ^ sbox[tmp & 255]; // shift rows and add rcon

          if (i % keyLen === 0) {
            tmp = tmp << 8 ^ tmp >>> 24 ^ rcon << 24;
            rcon = rcon << 1 ^ (rcon >> 7) * 283;
          }
        }

        encKey[i] = encKey[i - keyLen] ^ tmp;
      } // schedule decryption keys


      for (var j = 0; i; j++, i--) {
        var _tmp = encKey[j & 3 ? i : i - 4];

        if (i <= 4 || j < 4) {
          decKey[j] = _tmp;
        } else {
          decKey[j] = decTable[0][sbox[_tmp >>> 24]] ^ decTable[1][sbox[_tmp >> 16 & 255]] ^ decTable[2][sbox[_tmp >> 8 & 255]] ^ decTable[3][sbox[_tmp & 255]];
        }
      }
    } // public

    /* Something like this might appear here eventually
    name: "AES",
    blockSize: 4,
    keySizes: [4,6,8],
    */

    /**
     * Encrypt an array of 4 big-endian words.
     * @param {Array} data The plaintext.
     * @return {Array} The ciphertext.
     */


    _createClass(_class, [{
      key: "encrypt",
      value: function encrypt(data) {
        return this._crypt(data, 0);
      }
      /**
       * Decrypt an array of 4 big-endian words.
       * @param {Array} data The ciphertext.
       * @return {Array} The plaintext.
       */

    }, {
      key: "decrypt",
      value: function decrypt(data) {
        return this._crypt(data, 1);
      }
      /**
       * Expand the S-box tables.
       *
       * @private
       */

    }, {
      key: "_precompute",
      value: function _precompute() {
        var encTable = this._tables[0];
        var decTable = this._tables[1];
        var sbox = encTable[4];
        var sboxInv = decTable[4];
        var d = [];
        var th = [];
        var xInv, x2, x4, x8; // Compute double and third tables

        for (var i = 0; i < 256; i++) {
          th[(d[i] = i << 1 ^ (i >> 7) * 283) ^ i] = i;
        }

        for (var x = xInv = 0; !sbox[x]; x ^= x2 || 1, xInv = th[xInv] || 1) {
          // Compute sbox
          var s = xInv ^ xInv << 1 ^ xInv << 2 ^ xInv << 3 ^ xInv << 4;
          s = s >> 8 ^ s & 255 ^ 99;
          sbox[x] = s;
          sboxInv[s] = x; // Compute MixColumns

          x8 = d[x4 = d[x2 = d[x]]];
          var tDec = x8 * 0x1010101 ^ x4 * 0x10001 ^ x2 * 0x101 ^ x * 0x1010100;
          var tEnc = d[s] * 0x101 ^ s * 0x1010100;

          for (var _i = 0; _i < 4; _i++) {
            encTable[_i][x] = tEnc = tEnc << 24 ^ tEnc >>> 8;
            decTable[_i][s] = tDec = tDec << 24 ^ tDec >>> 8;
          }
        } // Compactify.  Considerable speedup on Firefox.


        for (var _i2 = 0; _i2 < 5; _i2++) {
          encTable[_i2] = encTable[_i2].slice(0);
          decTable[_i2] = decTable[_i2].slice(0);
        }
      }
      /**
       * Encryption and decryption core.
       * @param {Array} input Four words to be encrypted or decrypted.
       * @param dir The direction, 0 for encrypt and 1 for decrypt.
       * @return {Array} The four encrypted or decrypted words.
       * @private
       */

    }, {
      key: "_crypt",
      value: function _crypt(input, dir) {
        if (input.length !== 4) {
          throw new Error("invalid aes block size");
        }

        var key = this._key[dir];
        var nInnerRounds = key.length / 4 - 2;
        var out = [0, 0, 0, 0];
        var table = this._tables[dir]; // load up the tables

        var t0 = table[0];
        var t1 = table[1];
        var t2 = table[2];
        var t3 = table[3];
        var sbox = table[4]; // state variables a,b,c,d are loaded with pre-whitened data

        var a = input[0] ^ key[0];
        var b = input[dir ? 3 : 1] ^ key[1];
        var c = input[2] ^ key[2];
        var d = input[dir ? 1 : 3] ^ key[3];
        var kIndex = 4;
        var a2, b2, c2; // Inner rounds.  Cribbed from OpenSSL.

        for (var i = 0; i < nInnerRounds; i++) {
          a2 = t0[a >>> 24] ^ t1[b >> 16 & 255] ^ t2[c >> 8 & 255] ^ t3[d & 255] ^ key[kIndex];
          b2 = t0[b >>> 24] ^ t1[c >> 16 & 255] ^ t2[d >> 8 & 255] ^ t3[a & 255] ^ key[kIndex + 1];
          c2 = t0[c >>> 24] ^ t1[d >> 16 & 255] ^ t2[a >> 8 & 255] ^ t3[b & 255] ^ key[kIndex + 2];
          d = t0[d >>> 24] ^ t1[a >> 16 & 255] ^ t2[b >> 8 & 255] ^ t3[c & 255] ^ key[kIndex + 3];
          kIndex += 4;
          a = a2;
          b = b2;
          c = c2;
        } // Last round.


        for (var _i3 = 0; _i3 < 4; _i3++) {
          out[dir ? 3 & -_i3 : _i3] = sbox[a >>> 24] << 24 ^ sbox[b >> 16 & 255] << 16 ^ sbox[c >> 8 & 255] << 8 ^ sbox[d & 255] ^ key[kIndex++];
          a2 = a;
          a = b;
          b = c;
          c = d;
          d = a2;
        }

        return out;
      }
    }]);

    return _class;
  }();
  /** @fileOverview CTR mode implementation.
   *
   * Special thanks to Roy Nicholson for pointing out a bug in our
   * implementation.
   *
   * @author Emily Stark
   * @author Mike Hamburg
   * @author Dan Boneh
   */

  /** Brian Gladman's CTR Mode.
  * @constructor
  * @param {Object} _prf The aes instance to generate key.
  * @param {bitArray} _iv The iv for ctr mode, it must be 128 bits.
  */


  var mode = {};
  /**
   * Brian Gladman's CTR Mode.
   * @namespace
   */

  mode.ctrGladman = /*#__PURE__*/function () {
    function _class2(prf, iv) {
      _classCallCheck(this, _class2);

      this._prf = prf;
      this._initIv = iv;
      this._iv = iv;
    }

    _createClass(_class2, [{
      key: "reset",
      value: function reset() {
        this._iv = this._initIv;
      }
      /** Input some data to calculate.
       * @param {bitArray} data the data to process, it must be intergral multiple of 128 bits unless it's the last.
       */

    }, {
      key: "update",
      value: function update(data) {
        return this.calculate(this._prf, data, this._iv);
      }
    }, {
      key: "incWord",
      value: function incWord(word) {
        if ((word >> 24 & 0xff) === 0xff) {
          //overflow
          var b1 = word >> 16 & 0xff;
          var b2 = word >> 8 & 0xff;
          var b3 = word & 0xff;

          if (b1 === 0xff) {
            // overflow b1   
            b1 = 0;

            if (b2 === 0xff) {
              b2 = 0;

              if (b3 === 0xff) {
                b3 = 0;
              } else {
                ++b3;
              }
            } else {
              ++b2;
            }
          } else {
            ++b1;
          }

          word = 0;
          word += b1 << 16;
          word += b2 << 8;
          word += b3;
        } else {
          word += 0x01 << 24;
        }

        return word;
      }
    }, {
      key: "incCounter",
      value: function incCounter(counter) {
        if ((counter[0] = this.incWord(counter[0])) === 0) {
          // encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
          counter[1] = this.incWord(counter[1]);
        }
      }
    }, {
      key: "calculate",
      value: function calculate(prf, data, iv) {
        var l;

        if (!(l = data.length)) {
          return [];
        }

        var bl = bitArray.bitLength(data);

        for (var i = 0; i < l; i += 4) {
          this.incCounter(iv);
          var e = prf.encrypt(iv);
          data[i] ^= e[0];
          data[i + 1] ^= e[1];
          data[i + 2] ^= e[2];
          data[i + 3] ^= e[3];
        }

        return bitArray.clamp(data, bl);
      }
    }]);

    return _class2;
  }();

  var misc = {};
  /** @fileOverview HMAC implementation.
   *
   * @author Emily Stark
   * @author Mike Hamburg
   * @author Dan Boneh
   */

  /** HMAC with the specified hash function.
   * @constructor
   * @param {bitArray} key the key for HMAC.
   * @param {Object} [Hash=hash.sha1] The hash function to use.
   */

  misc.hmacSha1 = /*#__PURE__*/function () {
    function _class3(key) {
      _classCallCheck(this, _class3);

      var hmac = this;
      var Hash = hmac._hash = hash.sha1;
      var exKey = [[], []];
      var bs = Hash.prototype.blockSize / 32;
      hmac._baseHash = [new Hash(), new Hash()];

      if (key.length > bs) {
        key = Hash.hash(key);
      }

      for (var i = 0; i < bs; i++) {
        exKey[0][i] = key[i] ^ 0x36363636;
        exKey[1][i] = key[i] ^ 0x5C5C5C5C;
      }

      hmac._baseHash[0].update(exKey[0]);

      hmac._baseHash[1].update(exKey[1]);

      hmac._resultHash = new Hash(hmac._baseHash[0]);
    }

    _createClass(_class3, [{
      key: "reset",
      value: function reset() {
        var hmac = this;
        hmac._resultHash = new hmac._hash(hmac._baseHash[0]);
        hmac._updated = false;
      }
    }, {
      key: "update",
      value: function update(data) {
        var hmac = this;
        hmac._updated = true;

        hmac._resultHash.update(data);
      }
    }, {
      key: "digest",
      value: function digest() {
        var hmac = this;

        var w = hmac._resultHash.finalize();

        var result = new hmac._hash(hmac._baseHash[1]).update(w).finalize();
        hmac.reset();
        return result;
      }
    }]);

    return _class3;
  }();

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  var ERR_INVALID_PASSWORD = "Invalid pasword";
  var BLOCK_LENGTH = 16;
  var RAW_FORMAT = "raw";
  var PBKDF2_ALGORITHM = {
    name: "PBKDF2"
  };
  var HASH_ALGORITHM = {
    name: "HMAC"
  };
  var HASH_FUNCTION = "SHA-1";
  var BASE_KEY_ALGORITHM = Object.assign({
    hash: HASH_ALGORITHM
  }, PBKDF2_ALGORITHM);
  var DERIVED_BITS_ALGORITHM = Object.assign({
    iterations: 1000,
    hash: {
      name: HASH_FUNCTION
    }
  }, PBKDF2_ALGORITHM);
  var DERIVED_BITS_USAGE = ["deriveBits"];
  var SALT_LENGTH = [8, 12, 16];
  var KEY_LENGTH = [16, 24, 32];
  var SIGNATURE_LENGTH = 10;
  var COUNTER_DEFAULT_VALUE = [0, 0, 0, 0];
  var codecBytes = codec.bytes;
  var Aes = cipher.aes;
  var CtrGladman = mode.ctrGladman;
  var HmacSha1 = misc.hmacSha1;

  var AESDecrypt = /*#__PURE__*/function () {
    function AESDecrypt(password, signed, strength) {
      _classCallCheck(this, AESDecrypt);

      Object.assign(this, {
        password: password,
        signed: signed,
        strength: strength - 1,
        pendingInput: new Uint8Array(0)
      });
    }

    _createClass(AESDecrypt, [{
      key: "append",
      value: function () {
        var _append2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(input) {
          var aesCrypto, preamble, output;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  aesCrypto = this;

                  if (!aesCrypto.password) {
                    _context.next = 9;
                    break;
                  }

                  preamble = subarray(input, 0, SALT_LENGTH[aesCrypto.strength] + 2);
                  _context.next = 5;
                  return createDecryptionKeys(aesCrypto, preamble, aesCrypto.password);

                case 5:
                  aesCrypto.password = null;
                  aesCrypto.aesCtrGladman = new CtrGladman(new Aes(aesCrypto.keys.key), Array.from(COUNTER_DEFAULT_VALUE));
                  aesCrypto.hmac = new HmacSha1(aesCrypto.keys.authentication);
                  input = subarray(input, SALT_LENGTH[aesCrypto.strength] + 2);

                case 9:
                  output = new Uint8Array(input.length - SIGNATURE_LENGTH - (input.length - SIGNATURE_LENGTH) % BLOCK_LENGTH);
                  return _context.abrupt("return", _append(aesCrypto, input, output, 0, SIGNATURE_LENGTH, true));

                case 11:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function append(_x) {
          return _append2.apply(this, arguments);
        }

        return append;
      }()
    }, {
      key: "flush",
      value: function flush() {
        var aesCrypto = this;
        var pendingInput = aesCrypto.pendingInput;
        var chunkToDecrypt = subarray(pendingInput, 0, pendingInput.length - SIGNATURE_LENGTH);
        var originalSignature = subarray(pendingInput, pendingInput.length - SIGNATURE_LENGTH);
        var decryptedChunkArray = new Uint8Array(0);

        if (chunkToDecrypt.length) {
          var encryptedChunk = codecBytes.toBits(chunkToDecrypt);
          aesCrypto.hmac.update(encryptedChunk);
          var decryptedChunk = aesCrypto.aesCtrGladman.update(encryptedChunk);
          decryptedChunkArray = codecBytes.fromBits(decryptedChunk);
        }

        var valid = true;

        if (aesCrypto.signed) {
          var signature = subarray(codecBytes.fromBits(aesCrypto.hmac.digest()), 0, SIGNATURE_LENGTH);

          for (var indexSignature = 0; indexSignature < SIGNATURE_LENGTH; indexSignature++) {
            if (signature[indexSignature] != originalSignature[indexSignature]) {
              valid = false;
            }
          }
        }

        return {
          valid: valid,
          data: decryptedChunkArray
        };
      }
    }]);

    return AESDecrypt;
  }();

  var AESEncrypt = /*#__PURE__*/function () {
    function AESEncrypt(password, strength) {
      _classCallCheck(this, AESEncrypt);

      Object.assign(this, {
        password: password,
        strength: strength - 1,
        pendingInput: new Uint8Array(0)
      });
    }

    _createClass(AESEncrypt, [{
      key: "append",
      value: function () {
        var _append3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(input) {
          var aesCrypto, preamble, output;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  aesCrypto = this;
                  preamble = new Uint8Array(0);

                  if (!aesCrypto.password) {
                    _context2.next = 9;
                    break;
                  }

                  _context2.next = 5;
                  return createEncryptionKeys(aesCrypto, aesCrypto.password);

                case 5:
                  preamble = _context2.sent;
                  aesCrypto.password = null;
                  aesCrypto.aesCtrGladman = new CtrGladman(new Aes(aesCrypto.keys.key), Array.from(COUNTER_DEFAULT_VALUE));
                  aesCrypto.hmac = new HmacSha1(aesCrypto.keys.authentication);

                case 9:
                  output = new Uint8Array(preamble.length + input.length - input.length % BLOCK_LENGTH);
                  output.set(preamble, 0);
                  return _context2.abrupt("return", _append(aesCrypto, input, output, preamble.length, 0));

                case 12:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function append(_x2) {
          return _append3.apply(this, arguments);
        }

        return append;
      }()
    }, {
      key: "flush",
      value: function flush() {
        var aesCrypto = this;
        var encryptedChunkArray = new Uint8Array(0);

        if (aesCrypto.pendingInput.length) {
          var encryptedChunk = aesCrypto.aesCtrGladman.update(codecBytes.toBits(aesCrypto.pendingInput));
          aesCrypto.hmac.update(encryptedChunk);
          encryptedChunkArray = codecBytes.fromBits(encryptedChunk);
        }

        var signature = subarray(codecBytes.fromBits(aesCrypto.hmac.digest()), 0, SIGNATURE_LENGTH);
        return {
          data: concat$1(encryptedChunkArray, signature),
          signature: signature
        };
      }
    }]);

    return AESEncrypt;
  }();

  function _append(aesCrypto, input, output, paddingStart, paddingEnd, verifySignature) {
    var inputLength = input.length - paddingEnd;

    if (aesCrypto.pendingInput.length) {
      input = concat$1(aesCrypto.pendingInput, input);
      output = expand(output, inputLength - inputLength % BLOCK_LENGTH);
    }

    var offset;

    for (offset = 0; offset <= inputLength - BLOCK_LENGTH; offset += BLOCK_LENGTH) {
      var inputChunk = codecBytes.toBits(subarray(input, offset, offset + BLOCK_LENGTH));

      if (verifySignature) {
        aesCrypto.hmac.update(inputChunk);
      }

      var outputChunk = aesCrypto.aesCtrGladman.update(inputChunk);

      if (!verifySignature) {
        aesCrypto.hmac.update(outputChunk);
      }

      output.set(codecBytes.fromBits(outputChunk), offset + paddingStart);
    }

    aesCrypto.pendingInput = subarray(input, offset);
    return output;
  }

  function createDecryptionKeys(_x3, _x4, _x5) {
    return _createDecryptionKeys.apply(this, arguments);
  }

  function _createDecryptionKeys() {
    _createDecryptionKeys = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(decrypt, preambleArray, password) {
      var passwordVerification, passwordVerificationKey;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return createKeys$1(decrypt, password, subarray(preambleArray, 0, SALT_LENGTH[decrypt.strength]));

            case 2:
              passwordVerification = subarray(preambleArray, SALT_LENGTH[decrypt.strength]);
              passwordVerificationKey = decrypt.keys.passwordVerification;

              if (!(passwordVerificationKey[0] != passwordVerification[0] || passwordVerificationKey[1] != passwordVerification[1])) {
                _context3.next = 6;
                break;
              }

              throw new Error(ERR_INVALID_PASSWORD);

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _createDecryptionKeys.apply(this, arguments);
  }

  function createEncryptionKeys(_x6, _x7) {
    return _createEncryptionKeys.apply(this, arguments);
  }

  function _createEncryptionKeys() {
    _createEncryptionKeys = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(encrypt, password) {
      var salt;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH[encrypt.strength]));
              _context4.next = 3;
              return createKeys$1(encrypt, password, salt);

            case 3:
              return _context4.abrupt("return", concat$1(salt, encrypt.keys.passwordVerification));

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _createEncryptionKeys.apply(this, arguments);
  }

  function createKeys$1(_x8, _x9, _x10) {
    return _createKeys.apply(this, arguments);
  }

  function _createKeys() {
    _createKeys = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(target, password, salt) {
      var encodedPassword, basekey, derivedBits, compositeKey;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              encodedPassword = encodeText(password);
              _context5.next = 3;
              return crypto.subtle.importKey(RAW_FORMAT, encodedPassword, BASE_KEY_ALGORITHM, false, DERIVED_BITS_USAGE);

            case 3:
              basekey = _context5.sent;
              _context5.next = 6;
              return crypto.subtle.deriveBits(Object.assign({
                salt: salt
              }, DERIVED_BITS_ALGORITHM), basekey, 8 * (KEY_LENGTH[target.strength] * 2 + 2));

            case 6:
              derivedBits = _context5.sent;
              compositeKey = new Uint8Array(derivedBits);
              target.keys = {
                key: codecBytes.toBits(subarray(compositeKey, 0, KEY_LENGTH[target.strength])),
                authentication: codecBytes.toBits(subarray(compositeKey, KEY_LENGTH[target.strength], KEY_LENGTH[target.strength] * 2)),
                passwordVerification: subarray(compositeKey, KEY_LENGTH[target.strength] * 2)
              };

            case 9:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _createKeys.apply(this, arguments);
  }

  function concat$1(leftArray, rightArray) {
    var array = leftArray;

    if (leftArray.length + rightArray.length) {
      array = new Uint8Array(leftArray.length + rightArray.length);
      array.set(leftArray, 0);
      array.set(rightArray, leftArray.length);
    }

    return array;
  }

  function expand(inputArray, length) {
    if (length && length > inputArray.length) {
      var array = inputArray;
      inputArray = new Uint8Array(length);
      inputArray.set(array, 0);
    }

    return inputArray;
  }

  function subarray(array, begin, end) {
    return array.subarray(begin, end);
  }

  var $$a = _export;
  var fails$8 = fails$D;

  // eslint-disable-next-line es/no-math-imul -- required for testing
  var $imul = Math.imul;

  var FORCED = fails$8(function () {
    return $imul(0xFFFFFFFF, 5) != -5 || $imul.length != 2;
  });

  // `Math.imul` method
  // https://tc39.es/ecma262/#sec-math.imul
  // some WebKit versions fails with big numbers, some has wrong arity
  $$a({ target: 'Math', stat: true, forced: FORCED }, {
    imul: function imul(x, y) {
      var UINT16 = 0xFFFF;
      var xn = +x;
      var yn = +y;
      var xl = UINT16 & xn;
      var yl = UINT16 & yn;
      return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
    }
  });

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  var HEADER_LENGTH = 12;

  var ZipCryptoDecrypt = /*#__PURE__*/function () {
    function ZipCryptoDecrypt(password, passwordVerification) {
      _classCallCheck(this, ZipCryptoDecrypt);

      var zipCrypto = this;
      Object.assign(zipCrypto, {
        password: password,
        passwordVerification: passwordVerification
      });
      createKeys(zipCrypto, password);
    }

    _createClass(ZipCryptoDecrypt, [{
      key: "append",
      value: function append(input) {
        var zipCrypto = this;

        if (zipCrypto.password) {
          var decryptedHeader = decrypt(zipCrypto, input.subarray(0, HEADER_LENGTH));
          zipCrypto.password = null;

          if (decryptedHeader[HEADER_LENGTH - 1] != zipCrypto.passwordVerification) {
            throw new Error(ERR_INVALID_PASSWORD);
          }

          input = input.subarray(HEADER_LENGTH);
        }

        return decrypt(zipCrypto, input);
      }
    }, {
      key: "flush",
      value: function flush() {
        return {
          valid: true,
          data: new Uint8Array(0)
        };
      }
    }]);

    return ZipCryptoDecrypt;
  }();

  var ZipCryptoEncrypt = /*#__PURE__*/function () {
    function ZipCryptoEncrypt(password, passwordVerification) {
      _classCallCheck(this, ZipCryptoEncrypt);

      var zipCrypto = this;
      Object.assign(zipCrypto, {
        password: password,
        passwordVerification: passwordVerification
      });
      createKeys(zipCrypto, password);
    }

    _createClass(ZipCryptoEncrypt, [{
      key: "append",
      value: function append(input) {
        var zipCrypto = this;
        var output;
        var offset;

        if (zipCrypto.password) {
          zipCrypto.password = null;
          var header = crypto.getRandomValues(new Uint8Array(HEADER_LENGTH));
          header[HEADER_LENGTH - 1] = zipCrypto.passwordVerification;
          output = new Uint8Array(input.length + header.length);
          output.set(encrypt(zipCrypto, header), 0);
          offset = HEADER_LENGTH;
        } else {
          output = new Uint8Array(input.length);
          offset = 0;
        }

        output.set(encrypt(zipCrypto, input), offset);
        return output;
      }
    }, {
      key: "flush",
      value: function flush() {
        return {
          data: new Uint8Array(0)
        };
      }
    }]);

    return ZipCryptoEncrypt;
  }();

  function decrypt(target, input) {
    var output = new Uint8Array(input.length);

    for (var index = 0; index < input.length; index++) {
      output[index] = getByte(target) ^ input[index];
      updateKeys(target, output[index]);
    }

    return output;
  }

  function encrypt(target, input) {
    var output = new Uint8Array(input.length);

    for (var index = 0; index < input.length; index++) {
      output[index] = getByte(target) ^ input[index];
      updateKeys(target, input[index]);
    }

    return output;
  }

  function createKeys(target, password) {
    target.keys = [0x12345678, 0x23456789, 0x34567890];
    target.crcKey0 = new Crc32(target.keys[0]);
    target.crcKey2 = new Crc32(target.keys[2]);

    for (var index = 0; index < password.length; index++) {
      updateKeys(target, password.charCodeAt(index));
    }
  }

  function updateKeys(target, byte) {
    target.crcKey0.append([byte]);
    target.keys[0] = ~target.crcKey0.get();
    target.keys[1] = getInt32(target.keys[1] + getInt8(target.keys[0]));
    target.keys[1] = getInt32(Math.imul(target.keys[1], 134775813) + 1);
    target.crcKey2.append([target.keys[1] >>> 24]);
    target.keys[2] = ~target.crcKey2.get();
  }

  function getByte(target) {
    var temp = target.keys[2] | 2;
    return getInt8(Math.imul(temp, temp ^ 1) >>> 8);
  }

  function getInt8(number) {
    return number & 0xFF;
  }

  function getInt32(number) {
    return number & 0xFFFFFFFF;
  }

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  var CODEC_DEFLATE = "deflate";
  var CODEC_INFLATE = "inflate";
  var ERR_INVALID_SIGNATURE = "Invalid signature";

  var Inflate = /*#__PURE__*/function () {
    function Inflate(codecConstructor, _ref, _ref2) {
      var signature = _ref.signature,
          password = _ref.password,
          signed = _ref.signed,
          compressed = _ref.compressed,
          zipCrypto = _ref.zipCrypto,
          passwordVerification = _ref.passwordVerification,
          encryptionStrength = _ref.encryptionStrength;
      var chunkSize = _ref2.chunkSize;

      _classCallCheck(this, Inflate);

      var encrypted = Boolean(password);
      Object.assign(this, {
        signature: signature,
        encrypted: encrypted,
        signed: signed,
        compressed: compressed,
        inflate: compressed && new codecConstructor({
          chunkSize: chunkSize
        }),
        crc32: signed && new Crc32(),
        zipCrypto: zipCrypto,
        decrypt: encrypted && zipCrypto ? new ZipCryptoDecrypt(password, passwordVerification) : new AESDecrypt(password, signed, encryptionStrength)
      });
    }

    _createClass(Inflate, [{
      key: "append",
      value: function () {
        var _append = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
          var codec;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  codec = this;

                  if (!(codec.encrypted && data.length)) {
                    _context.next = 5;
                    break;
                  }

                  _context.next = 4;
                  return codec.decrypt.append(data);

                case 4:
                  data = _context.sent;

                case 5:
                  if (!(codec.compressed && data.length)) {
                    _context.next = 9;
                    break;
                  }

                  _context.next = 8;
                  return codec.inflate.append(data);

                case 8:
                  data = _context.sent;

                case 9:
                  if ((!codec.encrypted || codec.zipCrypto) && codec.signed && data.length) {
                    codec.crc32.append(data);
                  }

                  return _context.abrupt("return", data);

                case 11:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function append(_x) {
          return _append.apply(this, arguments);
        }

        return append;
      }()
    }, {
      key: "flush",
      value: function () {
        var _flush = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
          var codec, signature, data, result, dataViewSignature;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  codec = this;
                  data = new Uint8Array(0);

                  if (!codec.encrypted) {
                    _context2.next = 7;
                    break;
                  }

                  result = codec.decrypt.flush();

                  if (result.valid) {
                    _context2.next = 6;
                    break;
                  }

                  throw new Error(ERR_INVALID_SIGNATURE);

                case 6:
                  data = result.data;

                case 7:
                  if (!((!codec.encrypted || codec.zipCrypto) && codec.signed)) {
                    _context2.next = 13;
                    break;
                  }

                  dataViewSignature = new DataView(new Uint8Array(4).buffer);
                  signature = codec.crc32.get();
                  dataViewSignature.setUint32(0, signature);

                  if (!(codec.signature != dataViewSignature.getUint32(0, false))) {
                    _context2.next = 13;
                    break;
                  }

                  throw new Error(ERR_INVALID_SIGNATURE);

                case 13:
                  if (!codec.compressed) {
                    _context2.next = 22;
                    break;
                  }

                  _context2.next = 16;
                  return codec.inflate.append(data);

                case 16:
                  _context2.t0 = _context2.sent;

                  if (_context2.t0) {
                    _context2.next = 19;
                    break;
                  }

                  _context2.t0 = new Uint8Array(0);

                case 19:
                  data = _context2.t0;
                  _context2.next = 22;
                  return codec.inflate.flush();

                case 22:
                  return _context2.abrupt("return", {
                    data: data,
                    signature: signature
                  });

                case 23:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function flush() {
          return _flush.apply(this, arguments);
        }

        return flush;
      }()
    }]);

    return Inflate;
  }();

  var Deflate = /*#__PURE__*/function () {
    function Deflate(codecConstructor, _ref3, _ref4) {
      var encrypted = _ref3.encrypted,
          signed = _ref3.signed,
          compressed = _ref3.compressed,
          level = _ref3.level,
          zipCrypto = _ref3.zipCrypto,
          password = _ref3.password,
          passwordVerification = _ref3.passwordVerification,
          encryptionStrength = _ref3.encryptionStrength;
      var chunkSize = _ref4.chunkSize;

      _classCallCheck(this, Deflate);

      Object.assign(this, {
        encrypted: encrypted,
        signed: signed,
        compressed: compressed,
        deflate: compressed && new codecConstructor({
          level: level || 5,
          chunkSize: chunkSize
        }),
        crc32: signed && new Crc32(),
        zipCrypto: zipCrypto,
        encrypt: encrypted && zipCrypto ? new ZipCryptoEncrypt(password, passwordVerification) : new AESEncrypt(password, encryptionStrength)
      });
    }

    _createClass(Deflate, [{
      key: "append",
      value: function () {
        var _append2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(inputData) {
          var codec, data;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  codec = this;
                  data = inputData;

                  if (!(codec.compressed && inputData.length)) {
                    _context3.next = 6;
                    break;
                  }

                  _context3.next = 5;
                  return codec.deflate.append(inputData);

                case 5:
                  data = _context3.sent;

                case 6:
                  if (!(codec.encrypted && data.length)) {
                    _context3.next = 10;
                    break;
                  }

                  _context3.next = 9;
                  return codec.encrypt.append(data);

                case 9:
                  data = _context3.sent;

                case 10:
                  if ((!codec.encrypted || codec.zipCrypto) && codec.signed && inputData.length) {
                    codec.crc32.append(inputData);
                  }

                  return _context3.abrupt("return", data);

                case 12:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function append(_x2) {
          return _append2.apply(this, arguments);
        }

        return append;
      }()
    }, {
      key: "flush",
      value: function () {
        var _flush2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
          var codec, signature, data, result, newData;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  codec = this;
                  data = new Uint8Array(0);

                  if (!codec.compressed) {
                    _context4.next = 9;
                    break;
                  }

                  _context4.next = 5;
                  return codec.deflate.flush();

                case 5:
                  _context4.t0 = _context4.sent;

                  if (_context4.t0) {
                    _context4.next = 8;
                    break;
                  }

                  _context4.t0 = new Uint8Array(0);

                case 8:
                  data = _context4.t0;

                case 9:
                  if (!codec.encrypted) {
                    _context4.next = 19;
                    break;
                  }

                  _context4.next = 12;
                  return codec.encrypt.append(data);

                case 12:
                  data = _context4.sent;
                  result = codec.encrypt.flush();
                  signature = result.signature;
                  newData = new Uint8Array(data.length + result.data.length);
                  newData.set(data, 0);
                  newData.set(result.data, data.length);
                  data = newData;

                case 19:
                  if ((!codec.encrypted || codec.zipCrypto) && codec.signed) {
                    signature = codec.crc32.get();
                  }

                  return _context4.abrupt("return", {
                    data: data,
                    signature: signature
                  });

                case 21:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function flush() {
          return _flush2.apply(this, arguments);
        }

        return flush;
      }()
    }]);

    return Deflate;
  }();

  function createCodec$1(codecConstructor, options, config) {
    if (options.codecType.startsWith(CODEC_DEFLATE)) {
      return new Deflate(codecConstructor, options, config);
    } else if (options.codecType.startsWith(CODEC_INFLATE)) {
      return new Inflate(codecConstructor, options, config);
    }
  }

  var fails$7 = fails$D;
  var wellKnownSymbol$4 = wellKnownSymbol$s;
  var IS_PURE = isPure;

  var ITERATOR$1 = wellKnownSymbol$4('iterator');

  var nativeUrl = !fails$7(function () {
    // eslint-disable-next-line unicorn/relative-url-style -- required for testing
    var url = new URL('b?a=1&b=2&c=3', 'http://a');
    var searchParams = url.searchParams;
    var result = '';
    url.pathname = 'c%20d';
    searchParams.forEach(function (value, key) {
      searchParams['delete']('b');
      result += key + value;
    });
    return (IS_PURE && !url.toJSON)
      || !searchParams.sort
      || url.href !== 'http://a/c%20d?a=1&c=3'
      || searchParams.get('c') !== '3'
      || String(new URLSearchParams('?a=1')) !== 'a=1'
      || !searchParams[ITERATOR$1]
      // throws in Edge
      || new URL('https://a@b').username !== 'a'
      || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
      // not punycoded in Edge
      || new URL('http://тест').host !== 'xn--e1aybc'
      // not escaped in Chrome 62-
      || new URL('http://a#б').hash !== '#%D0%B1'
      // fails in Chrome 66-
      || result !== 'a1c3'
      // throws in Safari
      || new URL('http://x', undefined).host !== 'x';
  });

  // based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
  var global$8 = global$19;
  var uncurryThis$b = functionUncurryThis;

  var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
  var base = 36;
  var tMin = 1;
  var tMax = 26;
  var skew = 38;
  var damp = 700;
  var initialBias = 72;
  var initialN = 128; // 0x80
  var delimiter = '-'; // '\x2D'
  var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
  var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
  var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
  var baseMinusTMin = base - tMin;

  var RangeError = global$8.RangeError;
  var exec$1 = uncurryThis$b(regexSeparators.exec);
  var floor$2 = Math.floor;
  var fromCharCode = String.fromCharCode;
  var charCodeAt = uncurryThis$b(''.charCodeAt);
  var join$2 = uncurryThis$b([].join);
  var push$5 = uncurryThis$b([].push);
  var replace$4 = uncurryThis$b(''.replace);
  var split$2 = uncurryThis$b(''.split);
  var toLowerCase$1 = uncurryThis$b(''.toLowerCase);

  /**
   * Creates an array containing the numeric code points of each Unicode
   * character in the string. While JavaScript uses UCS-2 internally,
   * this function will convert a pair of surrogate halves (each of which
   * UCS-2 exposes as separate characters) into a single code point,
   * matching UTF-16.
   */
  var ucs2decode = function (string) {
    var output = [];
    var counter = 0;
    var length = string.length;
    while (counter < length) {
      var value = charCodeAt(string, counter++);
      if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
        // It's a high surrogate, and there is a next character.
        var extra = charCodeAt(string, counter++);
        if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
          push$5(output, ((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
        } else {
          // It's an unmatched surrogate; only append this code unit, in case the
          // next code unit is the high surrogate of a surrogate pair.
          push$5(output, value);
          counter--;
        }
      } else {
        push$5(output, value);
      }
    }
    return output;
  };

  /**
   * Converts a digit/integer into a basic code point.
   */
  var digitToBasic = function (digit) {
    //  0..25 map to ASCII a..z or A..Z
    // 26..35 map to ASCII 0..9
    return digit + 22 + 75 * (digit < 26);
  };

  /**
   * Bias adaptation function as per section 3.4 of RFC 3492.
   * https://tools.ietf.org/html/rfc3492#section-3.4
   */
  var adapt = function (delta, numPoints, firstTime) {
    var k = 0;
    delta = firstTime ? floor$2(delta / damp) : delta >> 1;
    delta += floor$2(delta / numPoints);
    while (delta > baseMinusTMin * tMax >> 1) {
      delta = floor$2(delta / baseMinusTMin);
      k += base;
    }
    return floor$2(k + (baseMinusTMin + 1) * delta / (delta + skew));
  };

  /**
   * Converts a string of Unicode symbols (e.g. a domain name label) to a
   * Punycode string of ASCII-only symbols.
   */
  var encode = function (input) {
    var output = [];

    // Convert the input in UCS-2 to an array of Unicode code points.
    input = ucs2decode(input);

    // Cache the length.
    var inputLength = input.length;

    // Initialize the state.
    var n = initialN;
    var delta = 0;
    var bias = initialBias;
    var i, currentValue;

    // Handle the basic code points.
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < 0x80) {
        push$5(output, fromCharCode(currentValue));
      }
    }

    var basicLength = output.length; // number of basic code points.
    var handledCPCount = basicLength; // number of code points that have been handled;

    // Finish the basic string with a delimiter unless it's empty.
    if (basicLength) {
      push$5(output, delimiter);
    }

    // Main encoding loop:
    while (handledCPCount < inputLength) {
      // All non-basic code points < n have been handled already. Find the next larger one:
      var m = maxInt;
      for (i = 0; i < input.length; i++) {
        currentValue = input[i];
        if (currentValue >= n && currentValue < m) {
          m = currentValue;
        }
      }

      // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
      var handledCPCountPlusOne = handledCPCount + 1;
      if (m - n > floor$2((maxInt - delta) / handledCPCountPlusOne)) {
        throw RangeError(OVERFLOW_ERROR);
      }

      delta += (m - n) * handledCPCountPlusOne;
      n = m;

      for (i = 0; i < input.length; i++) {
        currentValue = input[i];
        if (currentValue < n && ++delta > maxInt) {
          throw RangeError(OVERFLOW_ERROR);
        }
        if (currentValue == n) {
          // Represent delta as a generalized variable-length integer.
          var q = delta;
          var k = base;
          while (true) {
            var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
            if (q < t) break;
            var qMinusT = q - t;
            var baseMinusT = base - t;
            push$5(output, fromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
            q = floor$2(qMinusT / baseMinusT);
            k += base;
          }

          push$5(output, fromCharCode(digitToBasic(q)));
          bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
          delta = 0;
          handledCPCount++;
        }
      }

      delta++;
      n++;
    }
    return join$2(output, '');
  };

  var stringPunycodeToAscii = function (input) {
    var encoded = [];
    var labels = split$2(replace$4(toLowerCase$1(input), regexSeparators, '\u002E'), '.');
    var i, label;
    for (i = 0; i < labels.length; i++) {
      label = labels[i];
      push$5(encoded, exec$1(regexNonASCII, label) ? 'xn--' + encode(label) : label);
    }
    return join$2(encoded, '.');
  };

  var global$7 = global$19;

  var TypeError$4 = global$7.TypeError;

  var validateArgumentsLength$1 = function (passed, required) {
    if (passed < required) throw TypeError$4('Not enough arguments');
    return passed;
  };

  // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`

  var $$9 = _export;
  var global$6 = global$19;
  var getBuiltIn$1 = getBuiltIn$9;
  var call$2 = functionCall;
  var uncurryThis$a = functionUncurryThis;
  var USE_NATIVE_URL$1 = nativeUrl;
  var redefine$3 = redefine$d.exports;
  var redefineAll$1 = redefineAll$4;
  var setToStringTag$3 = setToStringTag$8;
  var createIteratorConstructor = createIteratorConstructor$2;
  var InternalStateModule$3 = internalState;
  var anInstance$3 = anInstance$7;
  var isCallable$4 = isCallable$p;
  var hasOwn$5 = hasOwnProperty_1;
  var bind$2 = functionBindContext;
  var classof$2 = classof$c;
  var anObject$2 = anObject$i;
  var isObject$4 = isObject$k;
  var $toString$2 = toString$9;
  var create$1 = objectCreate;
  var createPropertyDescriptor$1 = createPropertyDescriptor$7;
  var getIterator = getIterator$4;
  var getIteratorMethod = getIteratorMethod$5;
  var validateArgumentsLength = validateArgumentsLength$1;
  var wellKnownSymbol$3 = wellKnownSymbol$s;
  var arraySort = arraySort$1;

  var ITERATOR = wellKnownSymbol$3('iterator');
  var URL_SEARCH_PARAMS = 'URLSearchParams';
  var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
  var setInternalState$3 = InternalStateModule$3.set;
  var getInternalParamsState = InternalStateModule$3.getterFor(URL_SEARCH_PARAMS);
  var getInternalIteratorState = InternalStateModule$3.getterFor(URL_SEARCH_PARAMS_ITERATOR);

  var n$Fetch = getBuiltIn$1('fetch');
  var N$Request = getBuiltIn$1('Request');
  var Headers = getBuiltIn$1('Headers');
  var RequestPrototype = N$Request && N$Request.prototype;
  var HeadersPrototype = Headers && Headers.prototype;
  var RegExp$1 = global$6.RegExp;
  var TypeError$3 = global$6.TypeError;
  var decodeURIComponent = global$6.decodeURIComponent;
  var encodeURIComponent$1 = global$6.encodeURIComponent;
  var charAt$2 = uncurryThis$a(''.charAt);
  var join$1 = uncurryThis$a([].join);
  var push$4 = uncurryThis$a([].push);
  var replace$3 = uncurryThis$a(''.replace);
  var shift$1 = uncurryThis$a([].shift);
  var splice = uncurryThis$a([].splice);
  var split$1 = uncurryThis$a(''.split);
  var stringSlice$4 = uncurryThis$a(''.slice);

  var plus = /\+/g;
  var sequences = Array(4);

  var percentSequence = function (bytes) {
    return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp$1('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
  };

  var percentDecode = function (sequence) {
    try {
      return decodeURIComponent(sequence);
    } catch (error) {
      return sequence;
    }
  };

  var deserialize = function (it) {
    var result = replace$3(it, plus, ' ');
    var bytes = 4;
    try {
      return decodeURIComponent(result);
    } catch (error) {
      while (bytes) {
        result = replace$3(result, percentSequence(bytes--), percentDecode);
      }
      return result;
    }
  };

  var find = /[!'()~]|%20/g;

  var replacements = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+'
  };

  var replacer = function (match) {
    return replacements[match];
  };

  var serialize = function (it) {
    return replace$3(encodeURIComponent$1(it), find, replacer);
  };

  var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
    setInternalState$3(this, {
      type: URL_SEARCH_PARAMS_ITERATOR,
      iterator: getIterator(getInternalParamsState(params).entries),
      kind: kind
    });
  }, 'Iterator', function next() {
    var state = getInternalIteratorState(this);
    var kind = state.kind;
    var step = state.iterator.next();
    var entry = step.value;
    if (!step.done) {
      step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
    } return step;
  }, true);

  var URLSearchParamsState = function (init) {
    this.entries = [];
    this.url = null;

    if (init !== undefined) {
      if (isObject$4(init)) this.parseObject(init);
      else this.parseQuery(typeof init == 'string' ? charAt$2(init, 0) === '?' ? stringSlice$4(init, 1) : init : $toString$2(init));
    }
  };

  URLSearchParamsState.prototype = {
    type: URL_SEARCH_PARAMS,
    bindURL: function (url) {
      this.url = url;
      this.update();
    },
    parseObject: function (object) {
      var iteratorMethod = getIteratorMethod(object);
      var iterator, next, step, entryIterator, entryNext, first, second;

      if (iteratorMethod) {
        iterator = getIterator(object, iteratorMethod);
        next = iterator.next;
        while (!(step = call$2(next, iterator)).done) {
          entryIterator = getIterator(anObject$2(step.value));
          entryNext = entryIterator.next;
          if (
            (first = call$2(entryNext, entryIterator)).done ||
            (second = call$2(entryNext, entryIterator)).done ||
            !call$2(entryNext, entryIterator).done
          ) throw TypeError$3('Expected sequence with length 2');
          push$4(this.entries, { key: $toString$2(first.value), value: $toString$2(second.value) });
        }
      } else for (var key in object) if (hasOwn$5(object, key)) {
        push$4(this.entries, { key: key, value: $toString$2(object[key]) });
      }
    },
    parseQuery: function (query) {
      if (query) {
        var attributes = split$1(query, '&');
        var index = 0;
        var attribute, entry;
        while (index < attributes.length) {
          attribute = attributes[index++];
          if (attribute.length) {
            entry = split$1(attribute, '=');
            push$4(this.entries, {
              key: deserialize(shift$1(entry)),
              value: deserialize(join$1(entry, '='))
            });
          }
        }
      }
    },
    serialize: function () {
      var entries = this.entries;
      var result = [];
      var index = 0;
      var entry;
      while (index < entries.length) {
        entry = entries[index++];
        push$4(result, serialize(entry.key) + '=' + serialize(entry.value));
      } return join$1(result, '&');
    },
    update: function () {
      this.entries.length = 0;
      this.parseQuery(this.url.query);
    },
    updateURL: function () {
      if (this.url) this.url.update();
    }
  };

  // `URLSearchParams` constructor
  // https://url.spec.whatwg.org/#interface-urlsearchparams
  var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
    anInstance$3(this, URLSearchParamsPrototype);
    var init = arguments.length > 0 ? arguments[0] : undefined;
    setInternalState$3(this, new URLSearchParamsState(init));
  };

  var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

  redefineAll$1(URLSearchParamsPrototype, {
    // `URLSearchParams.prototype.append` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-append
    append: function append(name, value) {
      validateArgumentsLength(arguments.length, 2);
      var state = getInternalParamsState(this);
      push$4(state.entries, { key: $toString$2(name), value: $toString$2(value) });
      state.updateURL();
    },
    // `URLSearchParams.prototype.delete` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
    'delete': function (name) {
      validateArgumentsLength(arguments.length, 1);
      var state = getInternalParamsState(this);
      var entries = state.entries;
      var key = $toString$2(name);
      var index = 0;
      while (index < entries.length) {
        if (entries[index].key === key) splice(entries, index, 1);
        else index++;
      }
      state.updateURL();
    },
    // `URLSearchParams.prototype.get` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-get
    get: function get(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = $toString$2(name);
      var index = 0;
      for (; index < entries.length; index++) {
        if (entries[index].key === key) return entries[index].value;
      }
      return null;
    },
    // `URLSearchParams.prototype.getAll` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
    getAll: function getAll(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = $toString$2(name);
      var result = [];
      var index = 0;
      for (; index < entries.length; index++) {
        if (entries[index].key === key) push$4(result, entries[index].value);
      }
      return result;
    },
    // `URLSearchParams.prototype.has` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-has
    has: function has(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = $toString$2(name);
      var index = 0;
      while (index < entries.length) {
        if (entries[index++].key === key) return true;
      }
      return false;
    },
    // `URLSearchParams.prototype.set` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-set
    set: function set(name, value) {
      validateArgumentsLength(arguments.length, 1);
      var state = getInternalParamsState(this);
      var entries = state.entries;
      var found = false;
      var key = $toString$2(name);
      var val = $toString$2(value);
      var index = 0;
      var entry;
      for (; index < entries.length; index++) {
        entry = entries[index];
        if (entry.key === key) {
          if (found) splice(entries, index--, 1);
          else {
            found = true;
            entry.value = val;
          }
        }
      }
      if (!found) push$4(entries, { key: key, value: val });
      state.updateURL();
    },
    // `URLSearchParams.prototype.sort` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
    sort: function sort() {
      var state = getInternalParamsState(this);
      arraySort(state.entries, function (a, b) {
        return a.key > b.key ? 1 : -1;
      });
      state.updateURL();
    },
    // `URLSearchParams.prototype.forEach` method
    forEach: function forEach(callback /* , thisArg */) {
      var entries = getInternalParamsState(this).entries;
      var boundFunction = bind$2(callback, arguments.length > 1 ? arguments[1] : undefined);
      var index = 0;
      var entry;
      while (index < entries.length) {
        entry = entries[index++];
        boundFunction(entry.value, entry.key, this);
      }
    },
    // `URLSearchParams.prototype.keys` method
    keys: function keys() {
      return new URLSearchParamsIterator(this, 'keys');
    },
    // `URLSearchParams.prototype.values` method
    values: function values() {
      return new URLSearchParamsIterator(this, 'values');
    },
    // `URLSearchParams.prototype.entries` method
    entries: function entries() {
      return new URLSearchParamsIterator(this, 'entries');
    }
  }, { enumerable: true });

  // `URLSearchParams.prototype[@@iterator]` method
  redefine$3(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries, { name: 'entries' });

  // `URLSearchParams.prototype.toString` method
  // https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
  redefine$3(URLSearchParamsPrototype, 'toString', function toString() {
    return getInternalParamsState(this).serialize();
  }, { enumerable: true });

  setToStringTag$3(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

  $$9({ global: true, forced: !USE_NATIVE_URL$1 }, {
    URLSearchParams: URLSearchParamsConstructor
  });

  // Wrap `fetch` and `Request` for correct work with polyfilled `URLSearchParams`
  if (!USE_NATIVE_URL$1 && isCallable$4(Headers)) {
    var headersHas = uncurryThis$a(HeadersPrototype.has);
    var headersSet = uncurryThis$a(HeadersPrototype.set);

    var wrapRequestOptions = function (init) {
      if (isObject$4(init)) {
        var body = init.body;
        var headers;
        if (classof$2(body) === URL_SEARCH_PARAMS) {
          headers = init.headers ? new Headers(init.headers) : new Headers();
          if (!headersHas(headers, 'content-type')) {
            headersSet(headers, 'content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
          }
          return create$1(init, {
            body: createPropertyDescriptor$1(0, $toString$2(body)),
            headers: createPropertyDescriptor$1(0, headers)
          });
        }
      } return init;
    };

    if (isCallable$4(n$Fetch)) {
      $$9({ global: true, enumerable: true, forced: true }, {
        fetch: function fetch(input /* , init */) {
          return n$Fetch(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
        }
      });
    }

    if (isCallable$4(N$Request)) {
      var RequestConstructor = function Request(input /* , init */) {
        anInstance$3(this, RequestPrototype);
        return new N$Request(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
      };

      RequestPrototype.constructor = RequestConstructor;
      RequestConstructor.prototype = RequestPrototype;

      $$9({ global: true, forced: true }, {
        Request: RequestConstructor
      });
    }
  }

  var web_urlSearchParams = {
    URLSearchParams: URLSearchParamsConstructor,
    getState: getInternalParamsState
  };

  // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`

  var $$8 = _export;
  var DESCRIPTORS$5 = descriptors;
  var USE_NATIVE_URL = nativeUrl;
  var global$5 = global$19;
  var bind$1 = functionBindContext;
  var uncurryThis$9 = functionUncurryThis;
  var defineProperties = objectDefineProperties.f;
  var redefine$2 = redefine$d.exports;
  var anInstance$2 = anInstance$7;
  var hasOwn$4 = hasOwnProperty_1;
  var assign = objectAssign;
  var arrayFrom = arrayFrom$1;
  var arraySlice$2 = arraySliceSimple;
  var codeAt = stringMultibyte.codeAt;
  var toASCII = stringPunycodeToAscii;
  var $toString$1 = toString$9;
  var setToStringTag$2 = setToStringTag$8;
  var URLSearchParamsModule = web_urlSearchParams;
  var InternalStateModule$2 = internalState;

  var setInternalState$2 = InternalStateModule$2.set;
  var getInternalURLState = InternalStateModule$2.getterFor('URL');
  var URLSearchParams$1 = URLSearchParamsModule.URLSearchParams;
  var getInternalSearchParamsState = URLSearchParamsModule.getState;

  var NativeURL = global$5.URL;
  var TypeError$2 = global$5.TypeError;
  var parseInt$1 = global$5.parseInt;
  var floor$1 = Math.floor;
  var pow = Math.pow;
  var charAt$1 = uncurryThis$9(''.charAt);
  var exec = uncurryThis$9(/./.exec);
  var join = uncurryThis$9([].join);
  var numberToString = uncurryThis$9(1.0.toString);
  var pop = uncurryThis$9([].pop);
  var push$3 = uncurryThis$9([].push);
  var replace$2 = uncurryThis$9(''.replace);
  var shift = uncurryThis$9([].shift);
  var split = uncurryThis$9(''.split);
  var stringSlice$3 = uncurryThis$9(''.slice);
  var toLowerCase = uncurryThis$9(''.toLowerCase);
  var unshift = uncurryThis$9([].unshift);

  var INVALID_AUTHORITY = 'Invalid authority';
  var INVALID_SCHEME = 'Invalid scheme';
  var INVALID_HOST = 'Invalid host';
  var INVALID_PORT = 'Invalid port';

  var ALPHA = /[a-z]/i;
  // eslint-disable-next-line regexp/no-obscure-range -- safe
  var ALPHANUMERIC = /[\d+-.a-z]/i;
  var DIGIT = /\d/;
  var HEX_START = /^0x/i;
  var OCT = /^[0-7]+$/;
  var DEC = /^\d+$/;
  var HEX = /^[\da-f]+$/i;
  /* eslint-disable regexp/no-control-character -- safe */
  var FORBIDDEN_HOST_CODE_POINT = /[\0\t\n\r #%/:<>?@[\\\]^|]/;
  var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\0\t\n\r #/:<>?@[\\\]^|]/;
  var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u0020]+|[\u0000-\u0020]+$/g;
  var TAB_AND_NEW_LINE = /[\t\n\r]/g;
  /* eslint-enable regexp/no-control-character -- safe */
  var EOF;

  // https://url.spec.whatwg.org/#ipv4-number-parser
  var parseIPv4 = function (input) {
    var parts = split(input, '.');
    var partsLength, numbers, index, part, radix, number, ipv4;
    if (parts.length && parts[parts.length - 1] == '') {
      parts.length--;
    }
    partsLength = parts.length;
    if (partsLength > 4) return input;
    numbers = [];
    for (index = 0; index < partsLength; index++) {
      part = parts[index];
      if (part == '') return input;
      radix = 10;
      if (part.length > 1 && charAt$1(part, 0) == '0') {
        radix = exec(HEX_START, part) ? 16 : 8;
        part = stringSlice$3(part, radix == 8 ? 1 : 2);
      }
      if (part === '') {
        number = 0;
      } else {
        if (!exec(radix == 10 ? DEC : radix == 8 ? OCT : HEX, part)) return input;
        number = parseInt$1(part, radix);
      }
      push$3(numbers, number);
    }
    for (index = 0; index < partsLength; index++) {
      number = numbers[index];
      if (index == partsLength - 1) {
        if (number >= pow(256, 5 - partsLength)) return null;
      } else if (number > 255) return null;
    }
    ipv4 = pop(numbers);
    for (index = 0; index < numbers.length; index++) {
      ipv4 += numbers[index] * pow(256, 3 - index);
    }
    return ipv4;
  };

  // https://url.spec.whatwg.org/#concept-ipv6-parser
  // eslint-disable-next-line max-statements -- TODO
  var parseIPv6 = function (input) {
    var address = [0, 0, 0, 0, 0, 0, 0, 0];
    var pieceIndex = 0;
    var compress = null;
    var pointer = 0;
    var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

    var chr = function () {
      return charAt$1(input, pointer);
    };

    if (chr() == ':') {
      if (charAt$1(input, 1) != ':') return;
      pointer += 2;
      pieceIndex++;
      compress = pieceIndex;
    }
    while (chr()) {
      if (pieceIndex == 8) return;
      if (chr() == ':') {
        if (compress !== null) return;
        pointer++;
        pieceIndex++;
        compress = pieceIndex;
        continue;
      }
      value = length = 0;
      while (length < 4 && exec(HEX, chr())) {
        value = value * 16 + parseInt$1(chr(), 16);
        pointer++;
        length++;
      }
      if (chr() == '.') {
        if (length == 0) return;
        pointer -= length;
        if (pieceIndex > 6) return;
        numbersSeen = 0;
        while (chr()) {
          ipv4Piece = null;
          if (numbersSeen > 0) {
            if (chr() == '.' && numbersSeen < 4) pointer++;
            else return;
          }
          if (!exec(DIGIT, chr())) return;
          while (exec(DIGIT, chr())) {
            number = parseInt$1(chr(), 10);
            if (ipv4Piece === null) ipv4Piece = number;
            else if (ipv4Piece == 0) return;
            else ipv4Piece = ipv4Piece * 10 + number;
            if (ipv4Piece > 255) return;
            pointer++;
          }
          address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
          numbersSeen++;
          if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
        }
        if (numbersSeen != 4) return;
        break;
      } else if (chr() == ':') {
        pointer++;
        if (!chr()) return;
      } else if (chr()) return;
      address[pieceIndex++] = value;
    }
    if (compress !== null) {
      swaps = pieceIndex - compress;
      pieceIndex = 7;
      while (pieceIndex != 0 && swaps > 0) {
        swap = address[pieceIndex];
        address[pieceIndex--] = address[compress + swaps - 1];
        address[compress + --swaps] = swap;
      }
    } else if (pieceIndex != 8) return;
    return address;
  };

  var findLongestZeroSequence = function (ipv6) {
    var maxIndex = null;
    var maxLength = 1;
    var currStart = null;
    var currLength = 0;
    var index = 0;
    for (; index < 8; index++) {
      if (ipv6[index] !== 0) {
        if (currLength > maxLength) {
          maxIndex = currStart;
          maxLength = currLength;
        }
        currStart = null;
        currLength = 0;
      } else {
        if (currStart === null) currStart = index;
        ++currLength;
      }
    }
    if (currLength > maxLength) {
      maxIndex = currStart;
      maxLength = currLength;
    }
    return maxIndex;
  };

  // https://url.spec.whatwg.org/#host-serializing
  var serializeHost = function (host) {
    var result, index, compress, ignore0;
    // ipv4
    if (typeof host == 'number') {
      result = [];
      for (index = 0; index < 4; index++) {
        unshift(result, host % 256);
        host = floor$1(host / 256);
      } return join(result, '.');
    // ipv6
    } else if (typeof host == 'object') {
      result = '';
      compress = findLongestZeroSequence(host);
      for (index = 0; index < 8; index++) {
        if (ignore0 && host[index] === 0) continue;
        if (ignore0) ignore0 = false;
        if (compress === index) {
          result += index ? ':' : '::';
          ignore0 = true;
        } else {
          result += numberToString(host[index], 16);
          if (index < 7) result += ':';
        }
      }
      return '[' + result + ']';
    } return host;
  };

  var C0ControlPercentEncodeSet = {};
  var fragmentPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
    ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
  });
  var pathPercentEncodeSet = assign({}, fragmentPercentEncodeSet, {
    '#': 1, '?': 1, '{': 1, '}': 1
  });
  var userinfoPercentEncodeSet = assign({}, pathPercentEncodeSet, {
    '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
  });

  var percentEncode = function (chr, set) {
    var code = codeAt(chr, 0);
    return code > 0x20 && code < 0x7F && !hasOwn$4(set, chr) ? chr : encodeURIComponent(chr);
  };

  // https://url.spec.whatwg.org/#special-scheme
  var specialSchemes = {
    ftp: 21,
    file: null,
    http: 80,
    https: 443,
    ws: 80,
    wss: 443
  };

  // https://url.spec.whatwg.org/#windows-drive-letter
  var isWindowsDriveLetter = function (string, normalized) {
    var second;
    return string.length == 2 && exec(ALPHA, charAt$1(string, 0))
      && ((second = charAt$1(string, 1)) == ':' || (!normalized && second == '|'));
  };

  // https://url.spec.whatwg.org/#start-with-a-windows-drive-letter
  var startsWithWindowsDriveLetter = function (string) {
    var third;
    return string.length > 1 && isWindowsDriveLetter(stringSlice$3(string, 0, 2)) && (
      string.length == 2 ||
      ((third = charAt$1(string, 2)) === '/' || third === '\\' || third === '?' || third === '#')
    );
  };

  // https://url.spec.whatwg.org/#single-dot-path-segment
  var isSingleDot = function (segment) {
    return segment === '.' || toLowerCase(segment) === '%2e';
  };

  // https://url.spec.whatwg.org/#double-dot-path-segment
  var isDoubleDot = function (segment) {
    segment = toLowerCase(segment);
    return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
  };

  // States:
  var SCHEME_START = {};
  var SCHEME = {};
  var NO_SCHEME = {};
  var SPECIAL_RELATIVE_OR_AUTHORITY = {};
  var PATH_OR_AUTHORITY = {};
  var RELATIVE = {};
  var RELATIVE_SLASH = {};
  var SPECIAL_AUTHORITY_SLASHES = {};
  var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
  var AUTHORITY = {};
  var HOST = {};
  var HOSTNAME = {};
  var PORT = {};
  var FILE = {};
  var FILE_SLASH = {};
  var FILE_HOST = {};
  var PATH_START = {};
  var PATH = {};
  var CANNOT_BE_A_BASE_URL_PATH = {};
  var QUERY = {};
  var FRAGMENT = {};

  var URLState = function (url, isBase, base) {
    var urlString = $toString$1(url);
    var baseState, failure, searchParams;
    if (isBase) {
      failure = this.parse(urlString);
      if (failure) throw TypeError$2(failure);
      this.searchParams = null;
    } else {
      if (base !== undefined) baseState = new URLState(base, true);
      failure = this.parse(urlString, null, baseState);
      if (failure) throw TypeError$2(failure);
      searchParams = getInternalSearchParamsState(new URLSearchParams$1());
      searchParams.bindURL(this);
      this.searchParams = searchParams;
    }
  };

  URLState.prototype = {
    type: 'URL',
    // https://url.spec.whatwg.org/#url-parsing
    // eslint-disable-next-line max-statements -- TODO
    parse: function (input, stateOverride, base) {
      var url = this;
      var state = stateOverride || SCHEME_START;
      var pointer = 0;
      var buffer = '';
      var seenAt = false;
      var seenBracket = false;
      var seenPasswordToken = false;
      var codePoints, chr, bufferCodePoints, failure;

      input = $toString$1(input);

      if (!stateOverride) {
        url.scheme = '';
        url.username = '';
        url.password = '';
        url.host = null;
        url.port = null;
        url.path = [];
        url.query = null;
        url.fragment = null;
        url.cannotBeABaseURL = false;
        input = replace$2(input, LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
      }

      input = replace$2(input, TAB_AND_NEW_LINE, '');

      codePoints = arrayFrom(input);

      while (pointer <= codePoints.length) {
        chr = codePoints[pointer];
        switch (state) {
          case SCHEME_START:
            if (chr && exec(ALPHA, chr)) {
              buffer += toLowerCase(chr);
              state = SCHEME;
            } else if (!stateOverride) {
              state = NO_SCHEME;
              continue;
            } else return INVALID_SCHEME;
            break;

          case SCHEME:
            if (chr && (exec(ALPHANUMERIC, chr) || chr == '+' || chr == '-' || chr == '.')) {
              buffer += toLowerCase(chr);
            } else if (chr == ':') {
              if (stateOverride && (
                (url.isSpecial() != hasOwn$4(specialSchemes, buffer)) ||
                (buffer == 'file' && (url.includesCredentials() || url.port !== null)) ||
                (url.scheme == 'file' && !url.host)
              )) return;
              url.scheme = buffer;
              if (stateOverride) {
                if (url.isSpecial() && specialSchemes[url.scheme] == url.port) url.port = null;
                return;
              }
              buffer = '';
              if (url.scheme == 'file') {
                state = FILE;
              } else if (url.isSpecial() && base && base.scheme == url.scheme) {
                state = SPECIAL_RELATIVE_OR_AUTHORITY;
              } else if (url.isSpecial()) {
                state = SPECIAL_AUTHORITY_SLASHES;
              } else if (codePoints[pointer + 1] == '/') {
                state = PATH_OR_AUTHORITY;
                pointer++;
              } else {
                url.cannotBeABaseURL = true;
                push$3(url.path, '');
                state = CANNOT_BE_A_BASE_URL_PATH;
              }
            } else if (!stateOverride) {
              buffer = '';
              state = NO_SCHEME;
              pointer = 0;
              continue;
            } else return INVALID_SCHEME;
            break;

          case NO_SCHEME:
            if (!base || (base.cannotBeABaseURL && chr != '#')) return INVALID_SCHEME;
            if (base.cannotBeABaseURL && chr == '#') {
              url.scheme = base.scheme;
              url.path = arraySlice$2(base.path);
              url.query = base.query;
              url.fragment = '';
              url.cannotBeABaseURL = true;
              state = FRAGMENT;
              break;
            }
            state = base.scheme == 'file' ? FILE : RELATIVE;
            continue;

          case SPECIAL_RELATIVE_OR_AUTHORITY:
            if (chr == '/' && codePoints[pointer + 1] == '/') {
              state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
              pointer++;
            } else {
              state = RELATIVE;
              continue;
            } break;

          case PATH_OR_AUTHORITY:
            if (chr == '/') {
              state = AUTHORITY;
              break;
            } else {
              state = PATH;
              continue;
            }

          case RELATIVE:
            url.scheme = base.scheme;
            if (chr == EOF) {
              url.username = base.username;
              url.password = base.password;
              url.host = base.host;
              url.port = base.port;
              url.path = arraySlice$2(base.path);
              url.query = base.query;
            } else if (chr == '/' || (chr == '\\' && url.isSpecial())) {
              state = RELATIVE_SLASH;
            } else if (chr == '?') {
              url.username = base.username;
              url.password = base.password;
              url.host = base.host;
              url.port = base.port;
              url.path = arraySlice$2(base.path);
              url.query = '';
              state = QUERY;
            } else if (chr == '#') {
              url.username = base.username;
              url.password = base.password;
              url.host = base.host;
              url.port = base.port;
              url.path = arraySlice$2(base.path);
              url.query = base.query;
              url.fragment = '';
              state = FRAGMENT;
            } else {
              url.username = base.username;
              url.password = base.password;
              url.host = base.host;
              url.port = base.port;
              url.path = arraySlice$2(base.path);
              url.path.length--;
              state = PATH;
              continue;
            } break;

          case RELATIVE_SLASH:
            if (url.isSpecial() && (chr == '/' || chr == '\\')) {
              state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
            } else if (chr == '/') {
              state = AUTHORITY;
            } else {
              url.username = base.username;
              url.password = base.password;
              url.host = base.host;
              url.port = base.port;
              state = PATH;
              continue;
            } break;

          case SPECIAL_AUTHORITY_SLASHES:
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
            if (chr != '/' || charAt$1(buffer, pointer + 1) != '/') continue;
            pointer++;
            break;

          case SPECIAL_AUTHORITY_IGNORE_SLASHES:
            if (chr != '/' && chr != '\\') {
              state = AUTHORITY;
              continue;
            } break;

          case AUTHORITY:
            if (chr == '@') {
              if (seenAt) buffer = '%40' + buffer;
              seenAt = true;
              bufferCodePoints = arrayFrom(buffer);
              for (var i = 0; i < bufferCodePoints.length; i++) {
                var codePoint = bufferCodePoints[i];
                if (codePoint == ':' && !seenPasswordToken) {
                  seenPasswordToken = true;
                  continue;
                }
                var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
                if (seenPasswordToken) url.password += encodedCodePoints;
                else url.username += encodedCodePoints;
              }
              buffer = '';
            } else if (
              chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
              (chr == '\\' && url.isSpecial())
            ) {
              if (seenAt && buffer == '') return INVALID_AUTHORITY;
              pointer -= arrayFrom(buffer).length + 1;
              buffer = '';
              state = HOST;
            } else buffer += chr;
            break;

          case HOST:
          case HOSTNAME:
            if (stateOverride && url.scheme == 'file') {
              state = FILE_HOST;
              continue;
            } else if (chr == ':' && !seenBracket) {
              if (buffer == '') return INVALID_HOST;
              failure = url.parseHost(buffer);
              if (failure) return failure;
              buffer = '';
              state = PORT;
              if (stateOverride == HOSTNAME) return;
            } else if (
              chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
              (chr == '\\' && url.isSpecial())
            ) {
              if (url.isSpecial() && buffer == '') return INVALID_HOST;
              if (stateOverride && buffer == '' && (url.includesCredentials() || url.port !== null)) return;
              failure = url.parseHost(buffer);
              if (failure) return failure;
              buffer = '';
              state = PATH_START;
              if (stateOverride) return;
              continue;
            } else {
              if (chr == '[') seenBracket = true;
              else if (chr == ']') seenBracket = false;
              buffer += chr;
            } break;

          case PORT:
            if (exec(DIGIT, chr)) {
              buffer += chr;
            } else if (
              chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
              (chr == '\\' && url.isSpecial()) ||
              stateOverride
            ) {
              if (buffer != '') {
                var port = parseInt$1(buffer, 10);
                if (port > 0xFFFF) return INVALID_PORT;
                url.port = (url.isSpecial() && port === specialSchemes[url.scheme]) ? null : port;
                buffer = '';
              }
              if (stateOverride) return;
              state = PATH_START;
              continue;
            } else return INVALID_PORT;
            break;

          case FILE:
            url.scheme = 'file';
            if (chr == '/' || chr == '\\') state = FILE_SLASH;
            else if (base && base.scheme == 'file') {
              if (chr == EOF) {
                url.host = base.host;
                url.path = arraySlice$2(base.path);
                url.query = base.query;
              } else if (chr == '?') {
                url.host = base.host;
                url.path = arraySlice$2(base.path);
                url.query = '';
                state = QUERY;
              } else if (chr == '#') {
                url.host = base.host;
                url.path = arraySlice$2(base.path);
                url.query = base.query;
                url.fragment = '';
                state = FRAGMENT;
              } else {
                if (!startsWithWindowsDriveLetter(join(arraySlice$2(codePoints, pointer), ''))) {
                  url.host = base.host;
                  url.path = arraySlice$2(base.path);
                  url.shortenPath();
                }
                state = PATH;
                continue;
              }
            } else {
              state = PATH;
              continue;
            } break;

          case FILE_SLASH:
            if (chr == '/' || chr == '\\') {
              state = FILE_HOST;
              break;
            }
            if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(join(arraySlice$2(codePoints, pointer), ''))) {
              if (isWindowsDriveLetter(base.path[0], true)) push$3(url.path, base.path[0]);
              else url.host = base.host;
            }
            state = PATH;
            continue;

          case FILE_HOST:
            if (chr == EOF || chr == '/' || chr == '\\' || chr == '?' || chr == '#') {
              if (!stateOverride && isWindowsDriveLetter(buffer)) {
                state = PATH;
              } else if (buffer == '') {
                url.host = '';
                if (stateOverride) return;
                state = PATH_START;
              } else {
                failure = url.parseHost(buffer);
                if (failure) return failure;
                if (url.host == 'localhost') url.host = '';
                if (stateOverride) return;
                buffer = '';
                state = PATH_START;
              } continue;
            } else buffer += chr;
            break;

          case PATH_START:
            if (url.isSpecial()) {
              state = PATH;
              if (chr != '/' && chr != '\\') continue;
            } else if (!stateOverride && chr == '?') {
              url.query = '';
              state = QUERY;
            } else if (!stateOverride && chr == '#') {
              url.fragment = '';
              state = FRAGMENT;
            } else if (chr != EOF) {
              state = PATH;
              if (chr != '/') continue;
            } break;

          case PATH:
            if (
              chr == EOF || chr == '/' ||
              (chr == '\\' && url.isSpecial()) ||
              (!stateOverride && (chr == '?' || chr == '#'))
            ) {
              if (isDoubleDot(buffer)) {
                url.shortenPath();
                if (chr != '/' && !(chr == '\\' && url.isSpecial())) {
                  push$3(url.path, '');
                }
              } else if (isSingleDot(buffer)) {
                if (chr != '/' && !(chr == '\\' && url.isSpecial())) {
                  push$3(url.path, '');
                }
              } else {
                if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
                  if (url.host) url.host = '';
                  buffer = charAt$1(buffer, 0) + ':'; // normalize windows drive letter
                }
                push$3(url.path, buffer);
              }
              buffer = '';
              if (url.scheme == 'file' && (chr == EOF || chr == '?' || chr == '#')) {
                while (url.path.length > 1 && url.path[0] === '') {
                  shift(url.path);
                }
              }
              if (chr == '?') {
                url.query = '';
                state = QUERY;
              } else if (chr == '#') {
                url.fragment = '';
                state = FRAGMENT;
              }
            } else {
              buffer += percentEncode(chr, pathPercentEncodeSet);
            } break;

          case CANNOT_BE_A_BASE_URL_PATH:
            if (chr == '?') {
              url.query = '';
              state = QUERY;
            } else if (chr == '#') {
              url.fragment = '';
              state = FRAGMENT;
            } else if (chr != EOF) {
              url.path[0] += percentEncode(chr, C0ControlPercentEncodeSet);
            } break;

          case QUERY:
            if (!stateOverride && chr == '#') {
              url.fragment = '';
              state = FRAGMENT;
            } else if (chr != EOF) {
              if (chr == "'" && url.isSpecial()) url.query += '%27';
              else if (chr == '#') url.query += '%23';
              else url.query += percentEncode(chr, C0ControlPercentEncodeSet);
            } break;

          case FRAGMENT:
            if (chr != EOF) url.fragment += percentEncode(chr, fragmentPercentEncodeSet);
            break;
        }

        pointer++;
      }
    },
    // https://url.spec.whatwg.org/#host-parsing
    parseHost: function (input) {
      var result, codePoints, index;
      if (charAt$1(input, 0) == '[') {
        if (charAt$1(input, input.length - 1) != ']') return INVALID_HOST;
        result = parseIPv6(stringSlice$3(input, 1, -1));
        if (!result) return INVALID_HOST;
        this.host = result;
      // opaque host
      } else if (!this.isSpecial()) {
        if (exec(FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT, input)) return INVALID_HOST;
        result = '';
        codePoints = arrayFrom(input);
        for (index = 0; index < codePoints.length; index++) {
          result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
        }
        this.host = result;
      } else {
        input = toASCII(input);
        if (exec(FORBIDDEN_HOST_CODE_POINT, input)) return INVALID_HOST;
        result = parseIPv4(input);
        if (result === null) return INVALID_HOST;
        this.host = result;
      }
    },
    // https://url.spec.whatwg.org/#cannot-have-a-username-password-port
    cannotHaveUsernamePasswordPort: function () {
      return !this.host || this.cannotBeABaseURL || this.scheme == 'file';
    },
    // https://url.spec.whatwg.org/#include-credentials
    includesCredentials: function () {
      return this.username != '' || this.password != '';
    },
    // https://url.spec.whatwg.org/#is-special
    isSpecial: function () {
      return hasOwn$4(specialSchemes, this.scheme);
    },
    // https://url.spec.whatwg.org/#shorten-a-urls-path
    shortenPath: function () {
      var path = this.path;
      var pathSize = path.length;
      if (pathSize && (this.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
        path.length--;
      }
    },
    // https://url.spec.whatwg.org/#concept-url-serializer
    serialize: function () {
      var url = this;
      var scheme = url.scheme;
      var username = url.username;
      var password = url.password;
      var host = url.host;
      var port = url.port;
      var path = url.path;
      var query = url.query;
      var fragment = url.fragment;
      var output = scheme + ':';
      if (host !== null) {
        output += '//';
        if (url.includesCredentials()) {
          output += username + (password ? ':' + password : '') + '@';
        }
        output += serializeHost(host);
        if (port !== null) output += ':' + port;
      } else if (scheme == 'file') output += '//';
      output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
      if (query !== null) output += '?' + query;
      if (fragment !== null) output += '#' + fragment;
      return output;
    },
    // https://url.spec.whatwg.org/#dom-url-href
    setHref: function (href) {
      var failure = this.parse(href);
      if (failure) throw TypeError$2(failure);
      this.searchParams.update();
    },
    // https://url.spec.whatwg.org/#dom-url-origin
    getOrigin: function () {
      var scheme = this.scheme;
      var port = this.port;
      if (scheme == 'blob') try {
        return new URLConstructor(scheme.path[0]).origin;
      } catch (error) {
        return 'null';
      }
      if (scheme == 'file' || !this.isSpecial()) return 'null';
      return scheme + '://' + serializeHost(this.host) + (port !== null ? ':' + port : '');
    },
    // https://url.spec.whatwg.org/#dom-url-protocol
    getProtocol: function () {
      return this.scheme + ':';
    },
    setProtocol: function (protocol) {
      this.parse($toString$1(protocol) + ':', SCHEME_START);
    },
    // https://url.spec.whatwg.org/#dom-url-username
    getUsername: function () {
      return this.username;
    },
    setUsername: function (username) {
      var codePoints = arrayFrom($toString$1(username));
      if (this.cannotHaveUsernamePasswordPort()) return;
      this.username = '';
      for (var i = 0; i < codePoints.length; i++) {
        this.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    },
    // https://url.spec.whatwg.org/#dom-url-password
    getPassword: function () {
      return this.password;
    },
    setPassword: function (password) {
      var codePoints = arrayFrom($toString$1(password));
      if (this.cannotHaveUsernamePasswordPort()) return;
      this.password = '';
      for (var i = 0; i < codePoints.length; i++) {
        this.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    },
    // https://url.spec.whatwg.org/#dom-url-host
    getHost: function () {
      var host = this.host;
      var port = this.port;
      return host === null ? ''
        : port === null ? serializeHost(host)
        : serializeHost(host) + ':' + port;
    },
    setHost: function (host) {
      if (this.cannotBeABaseURL) return;
      this.parse(host, HOST);
    },
    // https://url.spec.whatwg.org/#dom-url-hostname
    getHostname: function () {
      var host = this.host;
      return host === null ? '' : serializeHost(host);
    },
    setHostname: function (hostname) {
      if (this.cannotBeABaseURL) return;
      this.parse(hostname, HOSTNAME);
    },
    // https://url.spec.whatwg.org/#dom-url-port
    getPort: function () {
      var port = this.port;
      return port === null ? '' : $toString$1(port);
    },
    setPort: function (port) {
      if (this.cannotHaveUsernamePasswordPort()) return;
      port = $toString$1(port);
      if (port == '') this.port = null;
      else this.parse(port, PORT);
    },
    // https://url.spec.whatwg.org/#dom-url-pathname
    getPathname: function () {
      var path = this.path;
      return this.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
    },
    setPathname: function (pathname) {
      if (this.cannotBeABaseURL) return;
      this.path = [];
      this.parse(pathname, PATH_START);
    },
    // https://url.spec.whatwg.org/#dom-url-search
    getSearch: function () {
      var query = this.query;
      return query ? '?' + query : '';
    },
    setSearch: function (search) {
      search = $toString$1(search);
      if (search == '') {
        this.query = null;
      } else {
        if ('?' == charAt$1(search, 0)) search = stringSlice$3(search, 1);
        this.query = '';
        this.parse(search, QUERY);
      }
      this.searchParams.update();
    },
    // https://url.spec.whatwg.org/#dom-url-searchparams
    getSearchParams: function () {
      return this.searchParams.facade;
    },
    // https://url.spec.whatwg.org/#dom-url-hash
    getHash: function () {
      var fragment = this.fragment;
      return fragment ? '#' + fragment : '';
    },
    setHash: function (hash) {
      hash = $toString$1(hash);
      if (hash == '') {
        this.fragment = null;
        return;
      }
      if ('#' == charAt$1(hash, 0)) hash = stringSlice$3(hash, 1);
      this.fragment = '';
      this.parse(hash, FRAGMENT);
    },
    update: function () {
      this.query = this.searchParams.serialize() || null;
    }
  };

  // `URL` constructor
  // https://url.spec.whatwg.org/#url-class
  var URLConstructor = function URL(url /* , base */) {
    var that = anInstance$2(this, URLPrototype);
    var base = arguments.length > 1 ? arguments[1] : undefined;
    var state = setInternalState$2(that, new URLState(url, false, base));
    if (!DESCRIPTORS$5) {
      that.href = state.serialize();
      that.origin = state.getOrigin();
      that.protocol = state.getProtocol();
      that.username = state.getUsername();
      that.password = state.getPassword();
      that.host = state.getHost();
      that.hostname = state.getHostname();
      that.port = state.getPort();
      that.pathname = state.getPathname();
      that.search = state.getSearch();
      that.searchParams = state.getSearchParams();
      that.hash = state.getHash();
    }
  };

  var URLPrototype = URLConstructor.prototype;

  var accessorDescriptor = function (getter, setter) {
    return {
      get: function () {
        return getInternalURLState(this)[getter]();
      },
      set: setter && function (value) {
        return getInternalURLState(this)[setter](value);
      },
      configurable: true,
      enumerable: true
    };
  };

  if (DESCRIPTORS$5) {
    defineProperties(URLPrototype, {
      // `URL.prototype.href` accessors pair
      // https://url.spec.whatwg.org/#dom-url-href
      href: accessorDescriptor('serialize', 'setHref'),
      // `URL.prototype.origin` getter
      // https://url.spec.whatwg.org/#dom-url-origin
      origin: accessorDescriptor('getOrigin'),
      // `URL.prototype.protocol` accessors pair
      // https://url.spec.whatwg.org/#dom-url-protocol
      protocol: accessorDescriptor('getProtocol', 'setProtocol'),
      // `URL.prototype.username` accessors pair
      // https://url.spec.whatwg.org/#dom-url-username
      username: accessorDescriptor('getUsername', 'setUsername'),
      // `URL.prototype.password` accessors pair
      // https://url.spec.whatwg.org/#dom-url-password
      password: accessorDescriptor('getPassword', 'setPassword'),
      // `URL.prototype.host` accessors pair
      // https://url.spec.whatwg.org/#dom-url-host
      host: accessorDescriptor('getHost', 'setHost'),
      // `URL.prototype.hostname` accessors pair
      // https://url.spec.whatwg.org/#dom-url-hostname
      hostname: accessorDescriptor('getHostname', 'setHostname'),
      // `URL.prototype.port` accessors pair
      // https://url.spec.whatwg.org/#dom-url-port
      port: accessorDescriptor('getPort', 'setPort'),
      // `URL.prototype.pathname` accessors pair
      // https://url.spec.whatwg.org/#dom-url-pathname
      pathname: accessorDescriptor('getPathname', 'setPathname'),
      // `URL.prototype.search` accessors pair
      // https://url.spec.whatwg.org/#dom-url-search
      search: accessorDescriptor('getSearch', 'setSearch'),
      // `URL.prototype.searchParams` getter
      // https://url.spec.whatwg.org/#dom-url-searchparams
      searchParams: accessorDescriptor('getSearchParams'),
      // `URL.prototype.hash` accessors pair
      // https://url.spec.whatwg.org/#dom-url-hash
      hash: accessorDescriptor('getHash', 'setHash')
    });
  }

  // `URL.prototype.toJSON` method
  // https://url.spec.whatwg.org/#dom-url-tojson
  redefine$2(URLPrototype, 'toJSON', function toJSON() {
    return getInternalURLState(this).serialize();
  }, { enumerable: true });

  // `URL.prototype.toString` method
  // https://url.spec.whatwg.org/#URL-stringification-behavior
  redefine$2(URLPrototype, 'toString', function toString() {
    return getInternalURLState(this).serialize();
  }, { enumerable: true });

  if (NativeURL) {
    var nativeCreateObjectURL = NativeURL.createObjectURL;
    var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
    // `URL.createObjectURL` method
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
    if (nativeCreateObjectURL) redefine$2(URLConstructor, 'createObjectURL', bind$1(nativeCreateObjectURL, NativeURL));
    // `URL.revokeObjectURL` method
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
    if (nativeRevokeObjectURL) redefine$2(URLConstructor, 'revokeObjectURL', bind$1(nativeRevokeObjectURL, NativeURL));
  }

  setToStringTag$2(URLConstructor, 'URL');

  $$8({ global: true, forced: !USE_NATIVE_URL, sham: !DESCRIPTORS$5 }, {
    URL: URLConstructor
  });

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  var MESSAGE_INIT = "init";
  var MESSAGE_APPEND = "append";
  var MESSAGE_FLUSH = "flush";
  var MESSAGE_EVENT_TYPE = "message";
  var classicWorkersSupported = true;
  var getWorker = (function (workerData, codecConstructor, options, config, _onTaskFinished, webWorker, scripts) {
    Object.assign(workerData, {
      busy: true,
      codecConstructor: codecConstructor,
      options: Object.assign({}, options),
      scripts: scripts,
      terminate: function terminate() {
        if (workerData.worker && !workerData.busy) {
          workerData.worker.terminate();
          workerData.interface = null;
        }
      },
      onTaskFinished: function onTaskFinished() {
        workerData.busy = false;

        _onTaskFinished(workerData);
      }
    });
    return webWorker ? createWebWorkerInterface(workerData, config) : createWorkerInterface(workerData, config);
  });

  function createWorkerInterface(workerData, config) {
    var interfaceCodec = createCodec$1(workerData.codecConstructor, workerData.options, config);
    return {
      append: function append(data) {
        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return interfaceCodec.append(data);

                case 3:
                  return _context.abrupt("return", _context.sent);

                case 6:
                  _context.prev = 6;
                  _context.t0 = _context["catch"](0);
                  workerData.onTaskFinished();
                  throw _context.t0;

                case 10:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[0, 6]]);
        }))();
      },
      flush: function flush() {
        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.prev = 0;
                  _context2.next = 3;
                  return interfaceCodec.flush();

                case 3:
                  return _context2.abrupt("return", _context2.sent);

                case 4:
                  _context2.prev = 4;
                  workerData.onTaskFinished();
                  return _context2.finish(4);

                case 7:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, null, [[0,, 4, 7]]);
        }))();
      }
    };
  }

  function createWebWorkerInterface(workerData, config) {
    var messageTask;
    var workerOptions = {
      type: "module"
    };

    if (!workerData.interface) {
      if (!classicWorkersSupported) {
        workerData.worker = getWorker(workerOptions, config.baseURL);
      } else {
        try {
          workerData.worker = getWorker({}, config.baseURL);
        } catch (error) {
          classicWorkersSupported = false;
          workerData.worker = getWorker(workerOptions, config.baseURL);
        }
      }

      workerData.worker.addEventListener(MESSAGE_EVENT_TYPE, onMessage, false);
      workerData.interface = {
        append: function append(data) {
          return initAndSendMessage({
            type: MESSAGE_APPEND,
            data: data
          });
        },
        flush: function flush() {
          return initAndSendMessage({
            type: MESSAGE_FLUSH
          });
        }
      };
    }

    return workerData.interface;

    function getWorker(options, baseURL) {
      var url;

      try {
        url = new URL(workerData.scripts[0], baseURL);
      } catch (error) {
        url = workerData.scripts[0];
      }

      return new Worker(url, options);
    }

    function initAndSendMessage(_x) {
      return _initAndSendMessage.apply(this, arguments);
    }

    function _initAndSendMessage() {
      _initAndSendMessage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(message) {
        var options, scripts;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (messageTask) {
                  _context3.next = 5;
                  break;
                }

                options = workerData.options;
                scripts = workerData.scripts.slice(1);
                _context3.next = 5;
                return sendMessage({
                  scripts: scripts,
                  type: MESSAGE_INIT,
                  options: options,
                  config: {
                    chunkSize: config.chunkSize
                  }
                });

              case 5:
                return _context3.abrupt("return", sendMessage(message));

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));
      return _initAndSendMessage.apply(this, arguments);
    }

    function sendMessage(message) {
      var worker = workerData.worker;
      var result = new Promise(function (resolve, reject) {
        return messageTask = {
          resolve: resolve,
          reject: reject
        };
      });

      try {
        if (message.data) {
          try {
            message.data = message.data.buffer;
            worker.postMessage(message, [message.data]);
          } catch (error) {
            worker.postMessage(message);
          }
        } else {
          worker.postMessage(message);
        }
      } catch (error) {
        messageTask.reject(error);
        messageTask = null;
        workerData.onTaskFinished();
      }

      return result;
    }

    function onMessage(event) {
      var message = event.data;

      if (messageTask) {
        var reponseError = message.error;
        var type = message.type;

        if (reponseError) {
          var error = new Error(reponseError.message);
          error.stack = reponseError.stack;
          messageTask.reject(error);
          messageTask = null;
          workerData.onTaskFinished();
        } else if (type == MESSAGE_INIT || type == MESSAGE_FLUSH || type == MESSAGE_APPEND) {
          var data = message.data;

          if (type == MESSAGE_FLUSH) {
            messageTask.resolve({
              data: new Uint8Array(data),
              signature: message.signature
            });
            messageTask = null;
            workerData.onTaskFinished();
          } else {
            messageTask.resolve(data && new Uint8Array(data));
          }
        }
      }
    }
  }

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  var pool = [];
  var pendingRequests = [];

  function createCodec(codecConstructor, options, config) {
    var streamCopy = !options.compressed && !options.signed && !options.encrypted;
    var webWorker = !streamCopy && (options.useWebWorkers || options.useWebWorkers === undefined && config.useWebWorkers);
    var scripts = webWorker && config.workerScripts ? config.workerScripts[options.codecType] : [];

    if (pool.length < config.maxWorkers) {
      var workerData = {};
      pool.push(workerData);
      return getWorker(workerData, codecConstructor, options, config, onTaskFinished, webWorker, scripts);
    } else {
      var _workerData = pool.find(function (workerData) {
        return !workerData.busy;
      });

      if (_workerData) {
        clearTerminateTimeout(_workerData);
        return getWorker(_workerData, codecConstructor, options, config, onTaskFinished, webWorker, scripts);
      } else {
        return new Promise(function (resolve) {
          return pendingRequests.push({
            resolve: resolve,
            codecConstructor: codecConstructor,
            options: options,
            webWorker: webWorker,
            scripts: scripts
          });
        });
      }
    }

    function onTaskFinished(workerData) {
      if (pendingRequests.length) {
        var _pendingRequests$spli = pendingRequests.splice(0, 1),
            _pendingRequests$spli2 = _slicedToArray(_pendingRequests$spli, 1),
            _pendingRequests$spli3 = _pendingRequests$spli2[0],
            resolve = _pendingRequests$spli3.resolve,
            _codecConstructor = _pendingRequests$spli3.codecConstructor,
            _options = _pendingRequests$spli3.options,
            _webWorker = _pendingRequests$spli3.webWorker,
            _scripts = _pendingRequests$spli3.scripts;

        resolve(getWorker(workerData, _codecConstructor, _options, config, onTaskFinished, _webWorker, _scripts));
      } else if (workerData.worker) {
        clearTerminateTimeout(workerData);

        if (Number.isFinite(config.terminateWorkerTimeout) && config.terminateWorkerTimeout >= 0) {
          workerData.terminateTimeout = setTimeout(function () {
            pool = pool.filter(function (data) {
              return data != workerData;
            });
            workerData.terminate();
          }, config.terminateWorkerTimeout);
        }
      } else {
        pool = pool.filter(function (data) {
          return data != workerData;
        });
      }
    }
  }

  function clearTerminateTimeout(workerData) {
    if (workerData.terminateTimeout) {
      clearTimeout(workerData.terminateTimeout);
      workerData.terminateTimeout = null;
    }
  }

  function terminateWorkers() {
    pool.forEach(function (workerData) {
      clearTerminateTimeout(workerData);
      workerData.terminate();
    });
  }

  var d = function d(_d) {
    if ("function" == typeof URL.createObjectURL) {
      var Z = atob("dmFyIHQ9InVuZGVmaW5lZCIhPXR5cGVvZiBnbG9iYWxUaGlzP2dsb2JhbFRoaXM6InVuZGVmaW5lZCIhPXR5cGVvZiB3aW5kb3c/d2luZG93OiJ1bmRlZmluZWQiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDoidW5kZWZpbmVkIiE9dHlwZW9mIHNlbGY/c2VsZjp7fTshZnVuY3Rpb24odCl7dmFyIGU9ZnVuY3Rpb24odCl7dmFyIGUsbj1PYmplY3QucHJvdG90eXBlLHI9bi5oYXNPd25Qcm9wZXJ0eSxpPSJmdW5jdGlvbiI9PXR5cGVvZiBTeW1ib2w/U3ltYm9sOnt9LG89aS5pdGVyYXRvcnx8IkBAaXRlcmF0b3IiLGE9aS5hc3luY0l0ZXJhdG9yfHwiQEBhc3luY0l0ZXJhdG9yIix1PWkudG9TdHJpbmdUYWd8fCJAQHRvU3RyaW5nVGFnIjtmdW5jdGlvbiBjKHQsZSxuKXtyZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsZSx7dmFsdWU6bixlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMH0pLHRbZV19dHJ5e2Moe30sIiIpfWNhdGNoKHQpe2M9ZnVuY3Rpb24odCxlLG4pe3JldHVybiB0W2VdPW59fWZ1bmN0aW9uIGYodCxlLG4scil7dmFyIGk9ZSYmZS5wcm90b3R5cGUgaW5zdGFuY2VvZiB5P2U6eSxvPU9iamVjdC5jcmVhdGUoaS5wcm90b3R5cGUpLGE9bmV3IE8ocnx8W10pO3JldHVybiBvLl9pbnZva2U9ZnVuY3Rpb24odCxlLG4pe3ZhciByPWw7cmV0dXJuIGZ1bmN0aW9uKGksbyl7aWYocj09PWgpdGhyb3cgbmV3IEVycm9yKCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nIik7aWYocj09PXApe2lmKCJ0aHJvdyI9PT1pKXRocm93IG87cmV0dXJuIEkoKX1mb3Iobi5tZXRob2Q9aSxuLmFyZz1vOzspe3ZhciBhPW4uZGVsZWdhdGU7aWYoYSl7dmFyIHU9UyhhLG4pO2lmKHUpe2lmKHU9PT12KWNvbnRpbnVlO3JldHVybiB1fX1pZigibmV4dCI9PT1uLm1ldGhvZCluLnNlbnQ9bi5fc2VudD1uLmFyZztlbHNlIGlmKCJ0aHJvdyI9PT1uLm1ldGhvZCl7aWYocj09PWwpdGhyb3cgcj1wLG4uYXJnO24uZGlzcGF0Y2hFeGNlcHRpb24obi5hcmcpfWVsc2UicmV0dXJuIj09PW4ubWV0aG9kJiZuLmFicnVwdCgicmV0dXJuIixuLmFyZyk7cj1oO3ZhciBjPXModCxlLG4pO2lmKCJub3JtYWwiPT09Yy50eXBlKXtpZihyPW4uZG9uZT9wOmQsYy5hcmc9PT12KWNvbnRpbnVlO3JldHVybnt2YWx1ZTpjLmFyZyxkb25lOm4uZG9uZX19InRocm93Ij09PWMudHlwZSYmKHI9cCxuLm1ldGhvZD0idGhyb3ciLG4uYXJnPWMuYXJnKX19fSh0LG4sYSksb31mdW5jdGlvbiBzKHQsZSxuKXt0cnl7cmV0dXJue3R5cGU6Im5vcm1hbCIsYXJnOnQuY2FsbChlLG4pfX1jYXRjaCh0KXtyZXR1cm57dHlwZToidGhyb3ciLGFyZzp0fX19dC53cmFwPWY7dmFyIGw9InN1c3BlbmRlZFN0YXJ0IixkPSJzdXNwZW5kZWRZaWVsZCIsaD0iZXhlY3V0aW5nIixwPSJjb21wbGV0ZWQiLHY9e307ZnVuY3Rpb24geSgpe31mdW5jdGlvbiBfKCl7fWZ1bmN0aW9uIGcoKXt9dmFyIGI9e307YyhiLG8sKGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KSk7dmFyIHc9T2JqZWN0LmdldFByb3RvdHlwZU9mLHg9dyYmdyh3KGooW10pKSk7eCYmeCE9PW4mJnIuY2FsbCh4LG8pJiYoYj14KTt2YXIgbT1nLnByb3RvdHlwZT15LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGIpO2Z1bmN0aW9uIGsodCl7WyJuZXh0IiwidGhyb3ciLCJyZXR1cm4iXS5mb3JFYWNoKChmdW5jdGlvbihlKXtjKHQsZSwoZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX2ludm9rZShlLHQpfSkpfSkpfWZ1bmN0aW9uIEEodCxlKXtmdW5jdGlvbiBuKGksbyxhLHUpe3ZhciBjPXModFtpXSx0LG8pO2lmKCJ0aHJvdyIhPT1jLnR5cGUpe3ZhciBmPWMuYXJnLGw9Zi52YWx1ZTtyZXR1cm4gbCYmIm9iamVjdCI9PXR5cGVvZiBsJiZyLmNhbGwobCwiX19hd2FpdCIpP2UucmVzb2x2ZShsLl9fYXdhaXQpLnRoZW4oKGZ1bmN0aW9uKHQpe24oIm5leHQiLHQsYSx1KX0pLChmdW5jdGlvbih0KXtuKCJ0aHJvdyIsdCxhLHUpfSkpOmUucmVzb2x2ZShsKS50aGVuKChmdW5jdGlvbih0KXtmLnZhbHVlPXQsYShmKX0pLChmdW5jdGlvbih0KXtyZXR1cm4gbigidGhyb3ciLHQsYSx1KX0pKX11KGMuYXJnKX12YXIgaTt0aGlzLl9pbnZva2U9ZnVuY3Rpb24odCxyKXtmdW5jdGlvbiBvKCl7cmV0dXJuIG5ldyBlKChmdW5jdGlvbihlLGkpe24odCxyLGUsaSl9KSl9cmV0dXJuIGk9aT9pLnRoZW4obyxvKTpvKCl9fWZ1bmN0aW9uIFModCxuKXt2YXIgcj10Lml0ZXJhdG9yW24ubWV0aG9kXTtpZihyPT09ZSl7aWYobi5kZWxlZ2F0ZT1udWxsLCJ0aHJvdyI9PT1uLm1ldGhvZCl7aWYodC5pdGVyYXRvci5yZXR1cm4mJihuLm1ldGhvZD0icmV0dXJuIixuLmFyZz1lLFModCxuKSwidGhyb3ciPT09bi5tZXRob2QpKXJldHVybiB2O24ubWV0aG9kPSJ0aHJvdyIsbi5hcmc9bmV3IFR5cGVFcnJvcigiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZCIpfXJldHVybiB2fXZhciBpPXMocix0Lml0ZXJhdG9yLG4uYXJnKTtpZigidGhyb3ciPT09aS50eXBlKXJldHVybiBuLm1ldGhvZD0idGhyb3ciLG4uYXJnPWkuYXJnLG4uZGVsZWdhdGU9bnVsbCx2O3ZhciBvPWkuYXJnO3JldHVybiBvP28uZG9uZT8oblt0LnJlc3VsdE5hbWVdPW8udmFsdWUsbi5uZXh0PXQubmV4dExvYywicmV0dXJuIiE9PW4ubWV0aG9kJiYobi5tZXRob2Q9Im5leHQiLG4uYXJnPWUpLG4uZGVsZWdhdGU9bnVsbCx2KTpvOihuLm1ldGhvZD0idGhyb3ciLG4uYXJnPW5ldyBUeXBlRXJyb3IoIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0Iiksbi5kZWxlZ2F0ZT1udWxsLHYpfWZ1bmN0aW9uIEUodCl7dmFyIGU9e3RyeUxvYzp0WzBdfTsxIGluIHQmJihlLmNhdGNoTG9jPXRbMV0pLDIgaW4gdCYmKGUuZmluYWxseUxvYz10WzJdLGUuYWZ0ZXJMb2M9dFszXSksdGhpcy50cnlFbnRyaWVzLnB1c2goZSl9ZnVuY3Rpb24gVCh0KXt2YXIgZT10LmNvbXBsZXRpb258fHt9O2UudHlwZT0ibm9ybWFsIixkZWxldGUgZS5hcmcsdC5jb21wbGV0aW9uPWV9ZnVuY3Rpb24gTyh0KXt0aGlzLnRyeUVudHJpZXM9W3t0cnlMb2M6InJvb3QifV0sdC5mb3JFYWNoKEUsdGhpcyksdGhpcy5yZXNldCghMCl9ZnVuY3Rpb24gaih0KXtpZih0KXt2YXIgbj10W29dO2lmKG4pcmV0dXJuIG4uY2FsbCh0KTtpZigiZnVuY3Rpb24iPT10eXBlb2YgdC5uZXh0KXJldHVybiB0O2lmKCFpc05hTih0Lmxlbmd0aCkpe3ZhciBpPS0xLGE9ZnVuY3Rpb24gbigpe2Zvcig7KytpPHQubGVuZ3RoOylpZihyLmNhbGwodCxpKSlyZXR1cm4gbi52YWx1ZT10W2ldLG4uZG9uZT0hMSxuO3JldHVybiBuLnZhbHVlPWUsbi5kb25lPSEwLG59O3JldHVybiBhLm5leHQ9YX19cmV0dXJue25leHQ6SX19ZnVuY3Rpb24gSSgpe3JldHVybnt2YWx1ZTplLGRvbmU6ITB9fXJldHVybiBfLnByb3RvdHlwZT1nLGMobSwiY29uc3RydWN0b3IiLGcpLGMoZywiY29uc3RydWN0b3IiLF8pLF8uZGlzcGxheU5hbWU9YyhnLHUsIkdlbmVyYXRvckZ1bmN0aW9uIiksdC5pc0dlbmVyYXRvckZ1bmN0aW9uPWZ1bmN0aW9uKHQpe3ZhciBlPSJmdW5jdGlvbiI9PXR5cGVvZiB0JiZ0LmNvbnN0cnVjdG9yO3JldHVybiEhZSYmKGU9PT1ffHwiR2VuZXJhdG9yRnVuY3Rpb24iPT09KGUuZGlzcGxheU5hbWV8fGUubmFtZSkpfSx0Lm1hcms9ZnVuY3Rpb24odCl7cmV0dXJuIE9iamVjdC5zZXRQcm90b3R5cGVPZj9PYmplY3Quc2V0UHJvdG90eXBlT2YodCxnKToodC5fX3Byb3RvX189ZyxjKHQsdSwiR2VuZXJhdG9yRnVuY3Rpb24iKSksdC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShtKSx0fSx0LmF3cmFwPWZ1bmN0aW9uKHQpe3JldHVybntfX2F3YWl0OnR9fSxrKEEucHJvdG90eXBlKSxjKEEucHJvdG90eXBlLGEsKGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KSksdC5Bc3luY0l0ZXJhdG9yPUEsdC5hc3luYz1mdW5jdGlvbihlLG4scixpLG8pe3ZvaWQgMD09PW8mJihvPVByb21pc2UpO3ZhciBhPW5ldyBBKGYoZSxuLHIsaSksbyk7cmV0dXJuIHQuaXNHZW5lcmF0b3JGdW5jdGlvbihuKT9hOmEubmV4dCgpLnRoZW4oKGZ1bmN0aW9uKHQpe3JldHVybiB0LmRvbmU/dC52YWx1ZTphLm5leHQoKX0pKX0sayhtKSxjKG0sdSwiR2VuZXJhdG9yIiksYyhtLG8sKGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KSksYyhtLCJ0b1N0cmluZyIsKGZ1bmN0aW9uKCl7cmV0dXJuIltvYmplY3QgR2VuZXJhdG9yXSJ9KSksdC5rZXlzPWZ1bmN0aW9uKHQpe3ZhciBlPVtdO2Zvcih2YXIgbiBpbiB0KWUucHVzaChuKTtyZXR1cm4gZS5yZXZlcnNlKCksZnVuY3Rpb24gbigpe2Zvcig7ZS5sZW5ndGg7KXt2YXIgcj1lLnBvcCgpO2lmKHIgaW4gdClyZXR1cm4gbi52YWx1ZT1yLG4uZG9uZT0hMSxufXJldHVybiBuLmRvbmU9ITAsbn19LHQudmFsdWVzPWosTy5wcm90b3R5cGU9e2NvbnN0cnVjdG9yOk8scmVzZXQ6ZnVuY3Rpb24odCl7aWYodGhpcy5wcmV2PTAsdGhpcy5uZXh0PTAsdGhpcy5zZW50PXRoaXMuX3NlbnQ9ZSx0aGlzLmRvbmU9ITEsdGhpcy5kZWxlZ2F0ZT1udWxsLHRoaXMubWV0aG9kPSJuZXh0Iix0aGlzLmFyZz1lLHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKFQpLCF0KWZvcih2YXIgbiBpbiB0aGlzKSJ0Ij09PW4uY2hhckF0KDApJiZyLmNhbGwodGhpcyxuKSYmIWlzTmFOKCtuLnNsaWNlKDEpKSYmKHRoaXNbbl09ZSl9LHN0b3A6ZnVuY3Rpb24oKXt0aGlzLmRvbmU9ITA7dmFyIHQ9dGhpcy50cnlFbnRyaWVzWzBdLmNvbXBsZXRpb247aWYoInRocm93Ij09PXQudHlwZSl0aHJvdyB0LmFyZztyZXR1cm4gdGhpcy5ydmFsfSxkaXNwYXRjaEV4Y2VwdGlvbjpmdW5jdGlvbih0KXtpZih0aGlzLmRvbmUpdGhyb3cgdDt2YXIgbj10aGlzO2Z1bmN0aW9uIGkocixpKXtyZXR1cm4gdS50eXBlPSJ0aHJvdyIsdS5hcmc9dCxuLm5leHQ9cixpJiYobi5tZXRob2Q9Im5leHQiLG4uYXJnPWUpLCEhaX1mb3IodmFyIG89dGhpcy50cnlFbnRyaWVzLmxlbmd0aC0xO28+PTA7LS1vKXt2YXIgYT10aGlzLnRyeUVudHJpZXNbb10sdT1hLmNvbXBsZXRpb247aWYoInJvb3QiPT09YS50cnlMb2MpcmV0dXJuIGkoImVuZCIpO2lmKGEudHJ5TG9jPD10aGlzLnByZXYpe3ZhciBjPXIuY2FsbChhLCJjYXRjaExvYyIpLGY9ci5jYWxsKGEsImZpbmFsbHlMb2MiKTtpZihjJiZmKXtpZih0aGlzLnByZXY8YS5jYXRjaExvYylyZXR1cm4gaShhLmNhdGNoTG9jLCEwKTtpZih0aGlzLnByZXY8YS5maW5hbGx5TG9jKXJldHVybiBpKGEuZmluYWxseUxvYyl9ZWxzZSBpZihjKXtpZih0aGlzLnByZXY8YS5jYXRjaExvYylyZXR1cm4gaShhLmNhdGNoTG9jLCEwKX1lbHNle2lmKCFmKXRocm93IG5ldyBFcnJvcigidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHkiKTtpZih0aGlzLnByZXY8YS5maW5hbGx5TG9jKXJldHVybiBpKGEuZmluYWxseUxvYyl9fX19LGFicnVwdDpmdW5jdGlvbih0LGUpe2Zvcih2YXIgbj10aGlzLnRyeUVudHJpZXMubGVuZ3RoLTE7bj49MDstLW4pe3ZhciBpPXRoaXMudHJ5RW50cmllc1tuXTtpZihpLnRyeUxvYzw9dGhpcy5wcmV2JiZyLmNhbGwoaSwiZmluYWxseUxvYyIpJiZ0aGlzLnByZXY8aS5maW5hbGx5TG9jKXt2YXIgbz1pO2JyZWFrfX1vJiYoImJyZWFrIj09PXR8fCJjb250aW51ZSI9PT10KSYmby50cnlMb2M8PWUmJmU8PW8uZmluYWxseUxvYyYmKG89bnVsbCk7dmFyIGE9bz9vLmNvbXBsZXRpb246e307cmV0dXJuIGEudHlwZT10LGEuYXJnPWUsbz8odGhpcy5tZXRob2Q9Im5leHQiLHRoaXMubmV4dD1vLmZpbmFsbHlMb2Msdik6dGhpcy5jb21wbGV0ZShhKX0sY29tcGxldGU6ZnVuY3Rpb24odCxlKXtpZigidGhyb3ciPT09dC50eXBlKXRocm93IHQuYXJnO3JldHVybiJicmVhayI9PT10LnR5cGV8fCJjb250aW51ZSI9PT10LnR5cGU/dGhpcy5uZXh0PXQuYXJnOiJyZXR1cm4iPT09dC50eXBlPyh0aGlzLnJ2YWw9dGhpcy5hcmc9dC5hcmcsdGhpcy5tZXRob2Q9InJldHVybiIsdGhpcy5uZXh0PSJlbmQiKToibm9ybWFsIj09PXQudHlwZSYmZSYmKHRoaXMubmV4dD1lKSx2fSxmaW5pc2g6ZnVuY3Rpb24odCl7Zm9yKHZhciBlPXRoaXMudHJ5RW50cmllcy5sZW5ndGgtMTtlPj0wOy0tZSl7dmFyIG49dGhpcy50cnlFbnRyaWVzW2VdO2lmKG4uZmluYWxseUxvYz09PXQpcmV0dXJuIHRoaXMuY29tcGxldGUobi5jb21wbGV0aW9uLG4uYWZ0ZXJMb2MpLFQobiksdn19LGNhdGNoOmZ1bmN0aW9uKHQpe2Zvcih2YXIgZT10aGlzLnRyeUVudHJpZXMubGVuZ3RoLTE7ZT49MDstLWUpe3ZhciBuPXRoaXMudHJ5RW50cmllc1tlXTtpZihuLnRyeUxvYz09PXQpe3ZhciByPW4uY29tcGxldGlvbjtpZigidGhyb3ciPT09ci50eXBlKXt2YXIgaT1yLmFyZztUKG4pfXJldHVybiBpfX10aHJvdyBuZXcgRXJyb3IoImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdCIpfSxkZWxlZ2F0ZVlpZWxkOmZ1bmN0aW9uKHQsbixyKXtyZXR1cm4gdGhpcy5kZWxlZ2F0ZT17aXRlcmF0b3I6aih0KSxyZXN1bHROYW1lOm4sbmV4dExvYzpyfSwibmV4dCI9PT10aGlzLm1ldGhvZCYmKHRoaXMuYXJnPWUpLHZ9fSx0fSh0LmV4cG9ydHMpO3RyeXtyZWdlbmVyYXRvclJ1bnRpbWU9ZX1jYXRjaCh0KXsib2JqZWN0Ij09dHlwZW9mIGdsb2JhbFRoaXM/Z2xvYmFsVGhpcy5yZWdlbmVyYXRvclJ1bnRpbWU9ZTpGdW5jdGlvbigiciIsInJlZ2VuZXJhdG9yUnVudGltZSA9IHIiKShlKX19KHtleHBvcnRzOnt9fSk7dmFyIGU9ZnVuY3Rpb24odCl7cmV0dXJuIHQmJnQuTWF0aD09TWF0aCYmdH0sbj1lKCJvYmplY3QiPT10eXBlb2YgZ2xvYmFsVGhpcyYmZ2xvYmFsVGhpcyl8fGUoIm9iamVjdCI9PXR5cGVvZiB3aW5kb3cmJndpbmRvdyl8fGUoIm9iamVjdCI9PXR5cGVvZiBzZWxmJiZzZWxmKXx8ZSgib2JqZWN0Ij09dHlwZW9mIHQmJnQpfHxmdW5jdGlvbigpe3JldHVybiB0aGlzfSgpfHxGdW5jdGlvbigicmV0dXJuIHRoaXMiKSgpLHI9e30saT1mdW5jdGlvbih0KXt0cnl7cmV0dXJuISF0KCl9Y2F0Y2godCl7cmV0dXJuITB9fSxvPSFpKChmdW5jdGlvbigpe3JldHVybiA3IT1PYmplY3QuZGVmaW5lUHJvcGVydHkoe30sMSx7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIDd9fSlbMV19KSksYT0haSgoZnVuY3Rpb24oKXt2YXIgdD1mdW5jdGlvbigpe30uYmluZCgpO3JldHVybiJmdW5jdGlvbiIhPXR5cGVvZiB0fHx0Lmhhc093blByb3BlcnR5KCJwcm90b3R5cGUiKX0pKSx1PWEsYz1GdW5jdGlvbi5wcm90b3R5cGUuY2FsbCxmPXU/Yy5iaW5kKGMpOmZ1bmN0aW9uKCl7cmV0dXJuIGMuYXBwbHkoYyxhcmd1bWVudHMpfSxzPXt9LGw9e30ucHJvcGVydHlJc0VudW1lcmFibGUsZD1PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLGg9ZCYmIWwuY2FsbCh7MToyfSwxKTtzLmY9aD9mdW5jdGlvbih0KXt2YXIgZT1kKHRoaXMsdCk7cmV0dXJuISFlJiZlLmVudW1lcmFibGV9Omw7dmFyIHAsdix5PWZ1bmN0aW9uKHQsZSl7cmV0dXJue2VudW1lcmFibGU6ISgxJnQpLGNvbmZpZ3VyYWJsZTohKDImdCksd3JpdGFibGU6ISg0JnQpLHZhbHVlOmV9fSxfPWEsZz1GdW5jdGlvbi5wcm90b3R5cGUsYj1nLmJpbmQsdz1nLmNhbGwseD1fJiZiLmJpbmQodyx3KSxtPV8/ZnVuY3Rpb24odCl7cmV0dXJuIHQmJngodCl9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZmdW5jdGlvbigpe3JldHVybiB3LmFwcGx5KHQsYXJndW1lbnRzKX19LGs9bSxBPWsoe30udG9TdHJpbmcpLFM9aygiIi5zbGljZSksRT1mdW5jdGlvbih0KXtyZXR1cm4gUyhBKHQpLDgsLTEpfSxUPW0sTz1pLGo9RSxJPW4uT2JqZWN0LFI9VCgiIi5zcGxpdCksUD1PKChmdW5jdGlvbigpe3JldHVybiFJKCJ6IikucHJvcGVydHlJc0VudW1lcmFibGUoMCl9KSk/ZnVuY3Rpb24odCl7cmV0dXJuIlN0cmluZyI9PWoodCk/Uih0LCIiKTpJKHQpfTpJLE09bi5UeXBlRXJyb3IsTD1mdW5jdGlvbih0KXtpZihudWxsPT10KXRocm93IE0oIkNhbid0IGNhbGwgbWV0aG9kIG9uICIrdCk7cmV0dXJuIHR9LFU9UCxDPUwsRj1mdW5jdGlvbih0KXtyZXR1cm4gVShDKHQpKX0sQj1mdW5jdGlvbih0KXtyZXR1cm4iZnVuY3Rpb24iPT10eXBlb2YgdH0sTj1CLEQ9ZnVuY3Rpb24odCl7cmV0dXJuIm9iamVjdCI9PXR5cGVvZiB0P251bGwhPT10Ok4odCl9LHo9bixHPUIsVj1mdW5jdGlvbih0KXtyZXR1cm4gRyh0KT90OnZvaWQgMH0sVz1mdW5jdGlvbih0LGUpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPDI/Vih6W3RdKTp6W3RdJiZ6W3RdW2VdfSxZPW0oe30uaXNQcm90b3R5cGVPZiksSD1XKCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiKXx8IiIsSz1uLHE9SCwkPUsucHJvY2VzcyxYPUsuRGVubyxKPSQmJiQudmVyc2lvbnN8fFgmJlgudmVyc2lvbixRPUomJkoudjg7USYmKHY9KHA9US5zcGxpdCgiLiIpKVswXT4wJiZwWzBdPDQ/MTorKHBbMF0rcFsxXSkpLCF2JiZxJiYoIShwPXEubWF0Y2goL0VkZ2VcLyhcZCspLykpfHxwWzFdPj03NCkmJihwPXEubWF0Y2goL0Nocm9tZVwvKFxkKykvKSkmJih2PStwWzFdKTt2YXIgWj12LHR0PVosZXQ9aSxudD0hIU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMmJiFldCgoZnVuY3Rpb24oKXt2YXIgdD1TeW1ib2woKTtyZXR1cm4hU3RyaW5nKHQpfHwhKE9iamVjdCh0KWluc3RhbmNlb2YgU3ltYm9sKXx8IVN5bWJvbC5zaGFtJiZ0dCYmdHQ8NDF9KSkscnQ9bnQmJiFTeW1ib2wuc2hhbSYmInN5bWJvbCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3IsaXQ9VyxvdD1CLGF0PVksdXQ9cnQsY3Q9bi5PYmplY3QsZnQ9dXQ/ZnVuY3Rpb24odCl7cmV0dXJuInN5bWJvbCI9PXR5cGVvZiB0fTpmdW5jdGlvbih0KXt2YXIgZT1pdCgiU3ltYm9sIik7cmV0dXJuIG90KGUpJiZhdChlLnByb3RvdHlwZSxjdCh0KSl9LHN0PW4uU3RyaW5nLGx0PWZ1bmN0aW9uKHQpe3RyeXtyZXR1cm4gc3QodCl9Y2F0Y2godCl7cmV0dXJuIk9iamVjdCJ9fSxkdD1CLGh0PWx0LHB0PW4uVHlwZUVycm9yLHZ0PWZ1bmN0aW9uKHQpe2lmKGR0KHQpKXJldHVybiB0O3Rocm93IHB0KGh0KHQpKyIgaXMgbm90IGEgZnVuY3Rpb24iKX0seXQ9dnQsX3Q9ZnVuY3Rpb24odCxlKXt2YXIgbj10W2VdO3JldHVybiBudWxsPT1uP3ZvaWQgMDp5dChuKX0sZ3Q9ZixidD1CLHd0PUQseHQ9bi5UeXBlRXJyb3IsbXQ9e2V4cG9ydHM6e319LGt0PW4sQXQ9T2JqZWN0LmRlZmluZVByb3BlcnR5LFN0PWZ1bmN0aW9uKHQsZSl7dHJ5e0F0KGt0LHQse3ZhbHVlOmUsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwfSl9Y2F0Y2gobil7a3RbdF09ZX1yZXR1cm4gZX0sRXQ9U3QsVHQ9blsiX19jb3JlLWpzX3NoYXJlZF9fIl18fEV0KCJfX2NvcmUtanNfc2hhcmVkX18iLHt9KSxPdD1UdDsobXQuZXhwb3J0cz1mdW5jdGlvbih0LGUpe3JldHVybiBPdFt0XXx8KE90W3RdPXZvaWQgMCE9PWU/ZTp7fSl9KSgidmVyc2lvbnMiLFtdKS5wdXNoKHt2ZXJzaW9uOiIzLjIwLjMiLG1vZGU6Imdsb2JhbCIsY29weXJpZ2h0OiLCqSAyMDE0LTIwMjIgRGVuaXMgUHVzaGthcmV2ICh6bG9pcm9jay5ydSkiLGxpY2Vuc2U6Imh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2Jsb2IvdjMuMjAuMy9MSUNFTlNFIixzb3VyY2U6Imh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzIn0pO3ZhciBqdD1MLEl0PW4uT2JqZWN0LFJ0PWZ1bmN0aW9uKHQpe3JldHVybiBJdChqdCh0KSl9LFB0PVJ0LE10PW0oe30uaGFzT3duUHJvcGVydHkpLEx0PU9iamVjdC5oYXNPd258fGZ1bmN0aW9uKHQsZSl7cmV0dXJuIE10KFB0KHQpLGUpfSxVdD1tLEN0PTAsRnQ9TWF0aC5yYW5kb20oKSxCdD1VdCgxLi50b1N0cmluZyksTnQ9ZnVuY3Rpb24odCl7cmV0dXJuIlN5bWJvbCgiKyh2b2lkIDA9PT10PyIiOnQpKyIpXyIrQnQoKytDdCtGdCwzNil9LER0PW4senQ9bXQuZXhwb3J0cyxHdD1MdCxWdD1OdCxXdD1udCxZdD1ydCxIdD16dCgid2tzIiksS3Q9RHQuU3ltYm9sLHF0PUt0JiZLdC5mb3IsJHQ9WXQ/S3Q6S3QmJkt0LndpdGhvdXRTZXR0ZXJ8fFZ0LFh0PWZ1bmN0aW9uKHQpe2lmKCFHdChIdCx0KXx8IVd0JiYic3RyaW5nIiE9dHlwZW9mIEh0W3RdKXt2YXIgZT0iU3ltYm9sLiIrdDtXdCYmR3QoS3QsdCk/SHRbdF09S3RbdF06SHRbdF09WXQmJnF0P3F0KGUpOiR0KGUpfXJldHVybiBIdFt0XX0sSnQ9ZixRdD1ELFp0PWZ0LHRlPV90LGVlPWZ1bmN0aW9uKHQsZSl7dmFyIG4scjtpZigic3RyaW5nIj09PWUmJmJ0KG49dC50b1N0cmluZykmJiF3dChyPWd0KG4sdCkpKXJldHVybiByO2lmKGJ0KG49dC52YWx1ZU9mKSYmIXd0KHI9Z3Qobix0KSkpcmV0dXJuIHI7aWYoInN0cmluZyIhPT1lJiZidChuPXQudG9TdHJpbmcpJiYhd3Qocj1ndChuLHQpKSlyZXR1cm4gcjt0aHJvdyB4dCgiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlIil9LG5lPVh0LHJlPW4uVHlwZUVycm9yLGllPW5lKCJ0b1ByaW1pdGl2ZSIpLG9lPWZ1bmN0aW9uKHQsZSl7aWYoIVF0KHQpfHxadCh0KSlyZXR1cm4gdDt2YXIgbixyPXRlKHQsaWUpO2lmKHIpe2lmKHZvaWQgMD09PWUmJihlPSJkZWZhdWx0Iiksbj1KdChyLHQsZSksIVF0KG4pfHxadChuKSlyZXR1cm4gbjt0aHJvdyByZSgiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlIil9cmV0dXJuIHZvaWQgMD09PWUmJihlPSJudW1iZXIiKSxlZSh0LGUpfSxhZT1mdCx1ZT1mdW5jdGlvbih0KXt2YXIgZT1vZSh0LCJzdHJpbmciKTtyZXR1cm4gYWUoZSk/ZTplKyIifSxjZT1ELGZlPW4uZG9jdW1lbnQsc2U9Y2UoZmUpJiZjZShmZS5jcmVhdGVFbGVtZW50KSxsZT1mdW5jdGlvbih0KXtyZXR1cm4gc2U/ZmUuY3JlYXRlRWxlbWVudCh0KTp7fX0sZGU9bGUsaGU9IW8mJiFpKChmdW5jdGlvbigpe3JldHVybiA3IT1PYmplY3QuZGVmaW5lUHJvcGVydHkoZGUoImRpdiIpLCJhIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIDd9fSkuYX0pKSxwZT1vLHZlPWYseWU9cyxfZT15LGdlPUYsYmU9dWUsd2U9THQseGU9aGUsbWU9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtyLmY9cGU/bWU6ZnVuY3Rpb24odCxlKXtpZih0PWdlKHQpLGU9YmUoZSkseGUpdHJ5e3JldHVybiBtZSh0LGUpfWNhdGNoKHQpe31pZih3ZSh0LGUpKXJldHVybiBfZSghdmUoeWUuZix0LGUpLHRbZV0pfTt2YXIga2U9e30sQWU9byYmaSgoZnVuY3Rpb24oKXtyZXR1cm4gNDIhPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSgoZnVuY3Rpb24oKXt9KSwicHJvdG90eXBlIix7dmFsdWU6NDIsd3JpdGFibGU6ITF9KS5wcm90b3R5cGV9KSksU2U9bixFZT1ELFRlPVNlLlN0cmluZyxPZT1TZS5UeXBlRXJyb3IsamU9ZnVuY3Rpb24odCl7aWYoRWUodCkpcmV0dXJuIHQ7dGhyb3cgT2UoVGUodCkrIiBpcyBub3QgYW4gb2JqZWN0Iil9LEllPW8sUmU9aGUsUGU9QWUsTWU9amUsTGU9dWUsVWU9bi5UeXBlRXJyb3IsQ2U9T2JqZWN0LmRlZmluZVByb3BlcnR5LEZlPU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7a2UuZj1JZT9QZT9mdW5jdGlvbih0LGUsbil7aWYoTWUodCksZT1MZShlKSxNZShuKSwiZnVuY3Rpb24iPT10eXBlb2YgdCYmInByb3RvdHlwZSI9PT1lJiYidmFsdWUiaW4gbiYmIndyaXRhYmxlImluIG4mJiFuLndyaXRhYmxlKXt2YXIgcj1GZSh0LGUpO3ImJnIud3JpdGFibGUmJih0W2VdPW4udmFsdWUsbj17Y29uZmlndXJhYmxlOiJjb25maWd1cmFibGUiaW4gbj9uLmNvbmZpZ3VyYWJsZTpyLmNvbmZpZ3VyYWJsZSxlbnVtZXJhYmxlOiJlbnVtZXJhYmxlImluIG4/bi5lbnVtZXJhYmxlOnIuZW51bWVyYWJsZSx3cml0YWJsZTohMX0pfXJldHVybiBDZSh0LGUsbil9OkNlOmZ1bmN0aW9uKHQsZSxuKXtpZihNZSh0KSxlPUxlKGUpLE1lKG4pLFJlKXRyeXtyZXR1cm4gQ2UodCxlLG4pfWNhdGNoKHQpe31pZigiZ2V0ImluIG58fCJzZXQiaW4gbil0aHJvdyBVZSgiQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQiKTtyZXR1cm4idmFsdWUiaW4gbiYmKHRbZV09bi52YWx1ZSksdH07dmFyIEJlPWtlLE5lPXksRGU9bz9mdW5jdGlvbih0LGUsbil7cmV0dXJuIEJlLmYodCxlLE5lKDEsbikpfTpmdW5jdGlvbih0LGUsbil7cmV0dXJuIHRbZV09bix0fSx6ZT17ZXhwb3J0czp7fX0sR2U9QixWZT1UdCxXZT1tKEZ1bmN0aW9uLnRvU3RyaW5nKTtHZShWZS5pbnNwZWN0U291cmNlKXx8KFZlLmluc3BlY3RTb3VyY2U9ZnVuY3Rpb24odCl7cmV0dXJuIFdlKHQpfSk7dmFyIFllLEhlLEtlLHFlPVZlLmluc3BlY3RTb3VyY2UsJGU9QixYZT1xZSxKZT1uLldlYWtNYXAsUWU9JGUoSmUpJiYvbmF0aXZlIGNvZGUvLnRlc3QoWGUoSmUpKSxaZT1tdC5leHBvcnRzLHRuPU50LGVuPVplKCJrZXlzIiksbm49ZnVuY3Rpb24odCl7cmV0dXJuIGVuW3RdfHwoZW5bdF09dG4odCkpfSxybj17fSxvbj1RZSxhbj1uLHVuPW0sY249RCxmbj1EZSxzbj1MdCxsbj1UdCxkbj1ubixobj1ybixwbj1hbi5UeXBlRXJyb3Isdm49YW4uV2Vha01hcDtpZihvbnx8bG4uc3RhdGUpe3ZhciB5bj1sbi5zdGF0ZXx8KGxuLnN0YXRlPW5ldyB2biksX249dW4oeW4uZ2V0KSxnbj11bih5bi5oYXMpLGJuPXVuKHluLnNldCk7WWU9ZnVuY3Rpb24odCxlKXtpZihnbih5bix0KSl0aHJvdyBuZXcgcG4oIk9iamVjdCBhbHJlYWR5IGluaXRpYWxpemVkIik7cmV0dXJuIGUuZmFjYWRlPXQsYm4oeW4sdCxlKSxlfSxIZT1mdW5jdGlvbih0KXtyZXR1cm4gX24oeW4sdCl8fHt9fSxLZT1mdW5jdGlvbih0KXtyZXR1cm4gZ24oeW4sdCl9fWVsc2V7dmFyIHduPWRuKCJzdGF0ZSIpO2huW3duXT0hMCxZZT1mdW5jdGlvbih0LGUpe2lmKHNuKHQsd24pKXRocm93IG5ldyBwbigiT2JqZWN0IGFscmVhZHkgaW5pdGlhbGl6ZWQiKTtyZXR1cm4gZS5mYWNhZGU9dCxmbih0LHduLGUpLGV9LEhlPWZ1bmN0aW9uKHQpe3JldHVybiBzbih0LHduKT90W3duXTp7fX0sS2U9ZnVuY3Rpb24odCl7cmV0dXJuIHNuKHQsd24pfX12YXIgeG49e3NldDpZZSxnZXQ6SGUsaGFzOktlLGVuZm9yY2U6ZnVuY3Rpb24odCl7cmV0dXJuIEtlKHQpP0hlKHQpOlllKHQse30pfSxnZXR0ZXJGb3I6ZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKGUpe3ZhciBuO2lmKCFjbihlKXx8KG49SGUoZSkpLnR5cGUhPT10KXRocm93IHBuKCJJbmNvbXBhdGlibGUgcmVjZWl2ZXIsICIrdCsiIHJlcXVpcmVkIik7cmV0dXJuIG59fX0sbW49byxrbj1MdCxBbj1GdW5jdGlvbi5wcm90b3R5cGUsU249bW4mJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsRW49a24oQW4sIm5hbWUiKSxUbj17RVhJU1RTOkVuLFBST1BFUjpFbiYmInNvbWV0aGluZyI9PT1mdW5jdGlvbigpe30ubmFtZSxDT05GSUdVUkFCTEU6RW4mJighbW58fG1uJiZTbihBbiwibmFtZSIpLmNvbmZpZ3VyYWJsZSl9LE9uPW4sam49QixJbj1MdCxSbj1EZSxQbj1TdCxNbj1xZSxMbj1Ubi5DT05GSUdVUkFCTEUsVW49eG4uZ2V0LENuPXhuLmVuZm9yY2UsRm49U3RyaW5nKFN0cmluZykuc3BsaXQoIlN0cmluZyIpOyh6ZS5leHBvcnRzPWZ1bmN0aW9uKHQsZSxuLHIpe3ZhciBpLG89ISFyJiYhIXIudW5zYWZlLGE9ISFyJiYhIXIuZW51bWVyYWJsZSx1PSEhciYmISFyLm5vVGFyZ2V0R2V0LGM9ciYmdm9pZCAwIT09ci5uYW1lP3IubmFtZTplO2puKG4pJiYoIlN5bWJvbCgiPT09U3RyaW5nKGMpLnNsaWNlKDAsNykmJihjPSJbIitTdHJpbmcoYykucmVwbGFjZSgvXlN5bWJvbFwoKFteKV0qKVwpLywiJDEiKSsiXSIpLCghSW4obiwibmFtZSIpfHxMbiYmbi5uYW1lIT09YykmJlJuKG4sIm5hbWUiLGMpLChpPUNuKG4pKS5zb3VyY2V8fChpLnNvdXJjZT1Gbi5qb2luKCJzdHJpbmciPT10eXBlb2YgYz9jOiIiKSkpLHQhPT1Pbj8obz8hdSYmdFtlXSYmKGE9ITApOmRlbGV0ZSB0W2VdLGE/dFtlXT1uOlJuKHQsZSxuKSk6YT90W2VdPW46UG4oZSxuKX0pKEZ1bmN0aW9uLnByb3RvdHlwZSwidG9TdHJpbmciLChmdW5jdGlvbigpe3JldHVybiBqbih0aGlzKSYmVW4odGhpcykuc291cmNlfHxNbih0aGlzKX0pKTt2YXIgQm49e30sTm49TWF0aC5jZWlsLERuPU1hdGguZmxvb3Isem49ZnVuY3Rpb24odCl7dmFyIGU9K3Q7cmV0dXJuIGUhPWV8fDA9PT1lPzA6KGU+MD9EbjpObikoZSl9LEduPXpuLFZuPU1hdGgubWF4LFduPU1hdGgubWluLFluPWZ1bmN0aW9uKHQsZSl7dmFyIG49R24odCk7cmV0dXJuIG48MD9WbihuK2UsMCk6V24obixlKX0sSG49em4sS249TWF0aC5taW4scW49ZnVuY3Rpb24odCl7cmV0dXJuIHQ+MD9LbihIbih0KSw5MDA3MTk5MjU0NzQwOTkxKTowfSwkbj1xbixYbj1mdW5jdGlvbih0KXtyZXR1cm4gJG4odC5sZW5ndGgpfSxKbj1GLFFuPVluLFpuPVhuLHRyPWZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihlLG4scil7dmFyIGksbz1KbihlKSxhPVpuKG8pLHU9UW4ocixhKTtpZih0JiZuIT1uKXtmb3IoO2E+dTspaWYoKGk9b1t1KytdKSE9aSlyZXR1cm4hMH1lbHNlIGZvcig7YT51O3UrKylpZigodHx8dSBpbiBvKSYmb1t1XT09PW4pcmV0dXJuIHR8fHV8fDA7cmV0dXJuIXQmJi0xfX0sZXI9e2luY2x1ZGVzOnRyKCEwKSxpbmRleE9mOnRyKCExKX0sbnI9THQscnI9Rixpcj1lci5pbmRleE9mLG9yPXJuLGFyPW0oW10ucHVzaCksdXI9ZnVuY3Rpb24odCxlKXt2YXIgbixyPXJyKHQpLGk9MCxvPVtdO2ZvcihuIGluIHIpIW5yKG9yLG4pJiZucihyLG4pJiZhcihvLG4pO2Zvcig7ZS5sZW5ndGg+aTspbnIocixuPWVbaSsrXSkmJih+aXIobyxuKXx8YXIobyxuKSk7cmV0dXJuIG99LGNyPVsiY29uc3RydWN0b3IiLCJoYXNPd25Qcm9wZXJ0eSIsImlzUHJvdG90eXBlT2YiLCJwcm9wZXJ0eUlzRW51bWVyYWJsZSIsInRvTG9jYWxlU3RyaW5nIiwidG9TdHJpbmciLCJ2YWx1ZU9mIl0sZnI9dXIsc3I9Y3IuY29uY2F0KCJsZW5ndGgiLCJwcm90b3R5cGUiKTtCbi5mPU9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzfHxmdW5jdGlvbih0KXtyZXR1cm4gZnIodCxzcil9O3ZhciBscj17fTtsci5mPU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7dmFyIGRyPVcsaHI9Qm4scHI9bHIsdnI9amUseXI9bShbXS5jb25jYXQpLF9yPWRyKCJSZWZsZWN0Iiwib3duS2V5cyIpfHxmdW5jdGlvbih0KXt2YXIgZT1oci5mKHZyKHQpKSxuPXByLmY7cmV0dXJuIG4/eXIoZSxuKHQpKTplfSxncj1MdCxicj1fcix3cj1yLHhyPWtlLG1yPWZ1bmN0aW9uKHQsZSxuKXtmb3IodmFyIHI9YnIoZSksaT14ci5mLG89d3IuZixhPTA7YTxyLmxlbmd0aDthKyspe3ZhciB1PXJbYV07Z3IodCx1KXx8biYmZ3Iobix1KXx8aSh0LHUsbyhlLHUpKX19LGtyPWksQXI9QixTcj0vI3xcLnByb3RvdHlwZVwuLyxFcj1mdW5jdGlvbih0LGUpe3ZhciBuPU9yW1RyKHQpXTtyZXR1cm4gbj09SXJ8fG4hPWpyJiYoQXIoZSk/a3IoZSk6ISFlKX0sVHI9RXIubm9ybWFsaXplPWZ1bmN0aW9uKHQpe3JldHVybiBTdHJpbmcodCkucmVwbGFjZShTciwiLiIpLnRvTG93ZXJDYXNlKCl9LE9yPUVyLmRhdGE9e30sanI9RXIuTkFUSVZFPSJOIixJcj1Fci5QT0xZRklMTD0iUCIsUnI9RXIsUHI9bixNcj1yLmYsTHI9RGUsVXI9emUuZXhwb3J0cyxDcj1TdCxGcj1tcixCcj1ScixOcj1mdW5jdGlvbih0LGUpe3ZhciBuLHIsaSxvLGEsdT10LnRhcmdldCxjPXQuZ2xvYmFsLGY9dC5zdGF0O2lmKG49Yz9QcjpmP1ByW3VdfHxDcih1LHt9KTooUHJbdV18fHt9KS5wcm90b3R5cGUpZm9yKHIgaW4gZSl7aWYobz1lW3JdLGk9dC5ub1RhcmdldEdldD8oYT1NcihuLHIpKSYmYS52YWx1ZTpuW3JdLCFCcihjP3I6dSsoZj8iLiI6IiMiKStyLHQuZm9yY2VkKSYmdm9pZCAwIT09aSl7aWYodHlwZW9mIG89PXR5cGVvZiBpKWNvbnRpbnVlO0ZyKG8saSl9KHQuc2hhbXx8aSYmaS5zaGFtKSYmTHIobywic2hhbSIsITApLFVyKG4scixvLHQpfX0sRHI9e307RHJbWHQoInRvU3RyaW5nVGFnIildPSJ6Ijt2YXIgenIsR3I9IltvYmplY3Qgel0iPT09U3RyaW5nKERyKSxWcj1uLFdyPUdyLFlyPUIsSHI9RSxLcj1YdCgidG9TdHJpbmdUYWciKSxxcj1Wci5PYmplY3QsJHI9IkFyZ3VtZW50cyI9PUhyKGZ1bmN0aW9uKCl7cmV0dXJuIGFyZ3VtZW50c30oKSksWHI9V3I/SHI6ZnVuY3Rpb24odCl7dmFyIGUsbixyO3JldHVybiB2b2lkIDA9PT10PyJVbmRlZmluZWQiOm51bGw9PT10PyJOdWxsIjoic3RyaW5nIj09dHlwZW9mKG49ZnVuY3Rpb24odCxlKXt0cnl7cmV0dXJuIHRbZV19Y2F0Y2godCl7fX0oZT1xcih0KSxLcikpP246JHI/SHIoZSk6Ik9iamVjdCI9PShyPUhyKGUpKSYmWXIoZS5jYWxsZWUpPyJBcmd1bWVudHMiOnJ9LEpyPVhyLFFyPW4uU3RyaW5nLFpyPWZ1bmN0aW9uKHQpe2lmKCJTeW1ib2wiPT09SnIodCkpdGhyb3cgVHlwZUVycm9yKCJDYW5ub3QgY29udmVydCBhIFN5bWJvbCB2YWx1ZSB0byBhIHN0cmluZyIpO3JldHVybiBRcih0KX0sdGk9RCxlaT1FLG5pPVh0KCJtYXRjaCIpLHJpPWZ1bmN0aW9uKHQpe3ZhciBlO3JldHVybiB0aSh0KSYmKHZvaWQgMCE9PShlPXRbbmldKT8hIWU6IlJlZ0V4cCI9PWVpKHQpKX0saWk9bi5UeXBlRXJyb3Isb2k9WHQoIm1hdGNoIiksYWk9TnIsdWk9bSxjaT1yLmYsZmk9cW4sc2k9WnIsbGk9ZnVuY3Rpb24odCl7aWYocmkodCkpdGhyb3cgaWkoIlRoZSBtZXRob2QgZG9lc24ndCBhY2NlcHQgcmVndWxhciBleHByZXNzaW9ucyIpO3JldHVybiB0fSxkaT1MLGhpPWZ1bmN0aW9uKHQpe3ZhciBlPS8uLzt0cnl7Ii8uLyJbdF0oZSl9Y2F0Y2gobil7dHJ5e3JldHVybiBlW29pXT0hMSwiLy4vIlt0XShlKX1jYXRjaCh0KXt9fXJldHVybiExfSxwaT11aSgiIi5zdGFydHNXaXRoKSx2aT11aSgiIi5zbGljZSkseWk9TWF0aC5taW4sX2k9aGkoInN0YXJ0c1dpdGgiKTthaSh7dGFyZ2V0OiJTdHJpbmciLHByb3RvOiEwLGZvcmNlZDohIShfaXx8KHpyPWNpKFN0cmluZy5wcm90b3R5cGUsInN0YXJ0c1dpdGgiKSwhenJ8fHpyLndyaXRhYmxlKSkmJiFfaX0se3N0YXJ0c1dpdGg6ZnVuY3Rpb24odCl7dmFyIGU9c2koZGkodGhpcykpO2xpKHQpO3ZhciBuPWZpKHlpKGFyZ3VtZW50cy5sZW5ndGg+MT9hcmd1bWVudHNbMV06dm9pZCAwLGUubGVuZ3RoKSkscj1zaSh0KTtyZXR1cm4gcGk/cGkoZSxyLG4pOnZpKGUsbixuK3IubGVuZ3RoKT09PXJ9fSk7dmFyIGdpPXt9LGJpPXVyLHdpPWNyLHhpPU9iamVjdC5rZXlzfHxmdW5jdGlvbih0KXtyZXR1cm4gYmkodCx3aSl9LG1pPW8sa2k9QWUsQWk9a2UsU2k9amUsRWk9RixUaT14aTtnaS5mPW1pJiYha2k/T2JqZWN0LmRlZmluZVByb3BlcnRpZXM6ZnVuY3Rpb24odCxlKXtTaSh0KTtmb3IodmFyIG4scj1FaShlKSxpPVRpKGUpLG89aS5sZW5ndGgsYT0wO28+YTspQWkuZih0LG49aVthKytdLHJbbl0pO3JldHVybiB0fTt2YXIgT2ksamk9VygiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiKSxJaT1qZSxSaT1naSxQaT1jcixNaT1ybixMaT1qaSxVaT1sZSxDaT1ubigiSUVfUFJPVE8iKSxGaT1mdW5jdGlvbigpe30sQmk9ZnVuY3Rpb24odCl7cmV0dXJuIjxzY3JpcHQ+Iit0KyI8XC9zY3JpcHQ+In0sTmk9ZnVuY3Rpb24odCl7dC53cml0ZShCaSgiIikpLHQuY2xvc2UoKTt2YXIgZT10LnBhcmVudFdpbmRvdy5PYmplY3Q7cmV0dXJuIHQ9bnVsbCxlfSxEaT1mdW5jdGlvbigpe3RyeXtPaT1uZXcgQWN0aXZlWE9iamVjdCgiaHRtbGZpbGUiKX1jYXRjaCh0KXt9dmFyIHQsZTtEaT0idW5kZWZpbmVkIiE9dHlwZW9mIGRvY3VtZW50P2RvY3VtZW50LmRvbWFpbiYmT2k/TmkoT2kpOigoZT1VaSgiaWZyYW1lIikpLnN0eWxlLmRpc3BsYXk9Im5vbmUiLExpLmFwcGVuZENoaWxkKGUpLGUuc3JjPVN0cmluZygiamF2YXNjcmlwdDoiKSwodD1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQpLm9wZW4oKSx0LndyaXRlKEJpKCJkb2N1bWVudC5GPU9iamVjdCIpKSx0LmNsb3NlKCksdC5GKTpOaShPaSk7Zm9yKHZhciBuPVBpLmxlbmd0aDtuLS07KWRlbGV0ZSBEaS5wcm90b3R5cGVbUGlbbl1dO3JldHVybiBEaSgpfTtNaVtDaV09ITA7dmFyIHppPU9iamVjdC5jcmVhdGV8fGZ1bmN0aW9uKHQsZSl7dmFyIG47cmV0dXJuIG51bGwhPT10PyhGaS5wcm90b3R5cGU9SWkodCksbj1uZXcgRmksRmkucHJvdG90eXBlPW51bGwsbltDaV09dCk6bj1EaSgpLHZvaWQgMD09PWU/bjpSaS5mKG4sZSl9LEdpPXppLFZpPWtlLFdpPVh0KCJ1bnNjb3BhYmxlcyIpLFlpPUFycmF5LnByb3RvdHlwZTtudWxsPT1ZaVtXaV0mJlZpLmYoWWksV2kse2NvbmZpZ3VyYWJsZTohMCx2YWx1ZTpHaShudWxsKX0pO3ZhciBIaSxLaSxxaSwkaT1mdW5jdGlvbih0KXtZaVtXaV1bdF09ITB9LFhpPXt9LEppPSFpKChmdW5jdGlvbigpe2Z1bmN0aW9uIHQoKXt9cmV0dXJuIHQucHJvdG90eXBlLmNvbnN0cnVjdG9yPW51bGwsT2JqZWN0LmdldFByb3RvdHlwZU9mKG5ldyB0KSE9PXQucHJvdG90eXBlfSkpLFFpPW4sWmk9THQsdG89Qixlbz1SdCxubz1KaSxybz1ubigiSUVfUFJPVE8iKSxpbz1RaS5PYmplY3Qsb289aW8ucHJvdG90eXBlLGFvPW5vP2lvLmdldFByb3RvdHlwZU9mOmZ1bmN0aW9uKHQpe3ZhciBlPWVvKHQpO2lmKFppKGUscm8pKXJldHVybiBlW3JvXTt2YXIgbj1lLmNvbnN0cnVjdG9yO3JldHVybiB0byhuKSYmZSBpbnN0YW5jZW9mIG4/bi5wcm90b3R5cGU6ZSBpbnN0YW5jZW9mIGlvP29vOm51bGx9LHVvPWksY289Qixmbz1hbyxzbz16ZS5leHBvcnRzLGxvPVh0KCJpdGVyYXRvciIpLGhvPSExO1tdLmtleXMmJigibmV4dCJpbihxaT1bXS5rZXlzKCkpPyhLaT1mbyhmbyhxaSkpKSE9PU9iamVjdC5wcm90b3R5cGUmJihIaT1LaSk6aG89ITApO3ZhciBwbz1udWxsPT1IaXx8dW8oKGZ1bmN0aW9uKCl7dmFyIHQ9e307cmV0dXJuIEhpW2xvXS5jYWxsKHQpIT09dH0pKTtwbyYmKEhpPXt9KSxjbyhIaVtsb10pfHxzbyhIaSxsbywoZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30pKTt2YXIgdm89e0l0ZXJhdG9yUHJvdG90eXBlOkhpLEJVR0dZX1NBRkFSSV9JVEVSQVRPUlM6aG99LHlvPWtlLmYsX289THQsZ289WHQoInRvU3RyaW5nVGFnIiksYm89ZnVuY3Rpb24odCxlLG4pe3QmJiFuJiYodD10LnByb3RvdHlwZSksdCYmIV9vKHQsZ28pJiZ5byh0LGdvLHtjb25maWd1cmFibGU6ITAsdmFsdWU6ZX0pfSx3bz12by5JdGVyYXRvclByb3RvdHlwZSx4bz16aSxtbz15LGtvPWJvLEFvPVhpLFNvPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9LEVvPW4sVG89QixPbz1Fby5TdHJpbmcsam89RW8uVHlwZUVycm9yLElvPW0sUm89amUsUG89ZnVuY3Rpb24odCl7aWYoIm9iamVjdCI9PXR5cGVvZiB0fHxUbyh0KSlyZXR1cm4gdDt0aHJvdyBqbygiQ2FuJ3Qgc2V0ICIrT28odCkrIiBhcyBhIHByb3RvdHlwZSIpfSxNbz1PYmplY3Quc2V0UHJvdG90eXBlT2Z8fCgiX19wcm90b19fImlue30/ZnVuY3Rpb24oKXt2YXIgdCxlPSExLG49e307dHJ5eyh0PUlvKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoT2JqZWN0LnByb3RvdHlwZSwiX19wcm90b19fIikuc2V0KSkobixbXSksZT1uIGluc3RhbmNlb2YgQXJyYXl9Y2F0Y2godCl7fXJldHVybiBmdW5jdGlvbihuLHIpe3JldHVybiBSbyhuKSxQbyhyKSxlP3QobixyKTpuLl9fcHJvdG9fXz1yLG59fSgpOnZvaWQgMCksTG89TnIsVW89ZixDbz1UbixGbz1CLEJvPWZ1bmN0aW9uKHQsZSxuLHIpe3ZhciBpPWUrIiBJdGVyYXRvciI7cmV0dXJuIHQucHJvdG90eXBlPXhvKHdvLHtuZXh0Om1vKCshcixuKX0pLGtvKHQsaSwhMSksQW9baV09U28sdH0sTm89YW8sRG89TW8sem89Ym8sR289RGUsVm89emUuZXhwb3J0cyxXbz1YaSxZbz1Dby5QUk9QRVIsSG89Q28uQ09ORklHVVJBQkxFLEtvPXZvLkl0ZXJhdG9yUHJvdG90eXBlLHFvPXZvLkJVR0dZX1NBRkFSSV9JVEVSQVRPUlMsJG89WHQoIml0ZXJhdG9yIiksWG89ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30sSm89ZnVuY3Rpb24odCxlLG4scixpLG8sYSl7Qm8obixlLHIpO3ZhciB1LGMsZixzPWZ1bmN0aW9uKHQpe2lmKHQ9PT1pJiZ2KXJldHVybiB2O2lmKCFxbyYmdCBpbiBoKXJldHVybiBoW3RdO3N3aXRjaCh0KXtjYXNlImtleXMiOmNhc2UidmFsdWVzIjpjYXNlImVudHJpZXMiOnJldHVybiBmdW5jdGlvbigpe3JldHVybiBuZXcgbih0aGlzLHQpfX1yZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gbmV3IG4odGhpcyl9fSxsPWUrIiBJdGVyYXRvciIsZD0hMSxoPXQucHJvdG90eXBlLHA9aFskb118fGhbIkBAaXRlcmF0b3IiXXx8aSYmaFtpXSx2PSFxbyYmcHx8cyhpKSx5PSJBcnJheSI9PWUmJmguZW50cmllc3x8cDtpZih5JiYodT1Obyh5LmNhbGwobmV3IHQpKSkhPT1PYmplY3QucHJvdG90eXBlJiZ1Lm5leHQmJihObyh1KSE9PUtvJiYoRG8/RG8odSxLbyk6Rm8odVskb10pfHxWbyh1LCRvLFhvKSksem8odSxsLCEwKSksWW8mJiJ2YWx1ZXMiPT1pJiZwJiYidmFsdWVzIiE9PXAubmFtZSYmKEhvP0dvKGgsIm5hbWUiLCJ2YWx1ZXMiKTooZD0hMCx2PWZ1bmN0aW9uKCl7cmV0dXJuIFVvKHAsdGhpcyl9KSksaSlpZihjPXt2YWx1ZXM6cygidmFsdWVzIiksa2V5czpvP3Y6cygia2V5cyIpLGVudHJpZXM6cygiZW50cmllcyIpfSxhKWZvcihmIGluIGMpKHFvfHxkfHwhKGYgaW4gaCkpJiZWbyhoLGYsY1tmXSk7ZWxzZSBMbyh7dGFyZ2V0OmUscHJvdG86ITAsZm9yY2VkOnFvfHxkfSxjKTtyZXR1cm4gaFskb10hPT12JiZWbyhoLCRvLHYse25hbWU6aX0pLFdvW2VdPXYsY30sUW89Rixabz0kaSx0YT1YaSxlYT14bixuYT1rZS5mLHJhPUpvLGlhPW8sb2E9ZWEuc2V0LGFhPWVhLmdldHRlckZvcigiQXJyYXkgSXRlcmF0b3IiKSx1YT1yYShBcnJheSwiQXJyYXkiLChmdW5jdGlvbih0LGUpe29hKHRoaXMse3R5cGU6IkFycmF5IEl0ZXJhdG9yIix0YXJnZXQ6UW8odCksaW5kZXg6MCxraW5kOmV9KX0pLChmdW5jdGlvbigpe3ZhciB0PWFhKHRoaXMpLGU9dC50YXJnZXQsbj10LmtpbmQscj10LmluZGV4Kys7cmV0dXJuIWV8fHI+PWUubGVuZ3RoPyh0LnRhcmdldD12b2lkIDAse3ZhbHVlOnZvaWQgMCxkb25lOiEwfSk6ImtleXMiPT1uP3t2YWx1ZTpyLGRvbmU6ITF9OiJ2YWx1ZXMiPT1uP3t2YWx1ZTplW3JdLGRvbmU6ITF9Ont2YWx1ZTpbcixlW3JdXSxkb25lOiExfX0pLCJ2YWx1ZXMiKSxjYT10YS5Bcmd1bWVudHM9dGEuQXJyYXk7aWYoWm8oImtleXMiKSxabygidmFsdWVzIiksWm8oImVudHJpZXMiKSxpYSYmInZhbHVlcyIhPT1jYS5uYW1lKXRyeXtuYShjYSwibmFtZSIse3ZhbHVlOiJ2YWx1ZXMifSl9Y2F0Y2godCl7fXZhciBmYT0idW5kZWZpbmVkIiE9dHlwZW9mIEFycmF5QnVmZmVyJiYidW5kZWZpbmVkIiE9dHlwZW9mIERhdGFWaWV3LHNhPXplLmV4cG9ydHMsbGE9ZnVuY3Rpb24odCxlLG4pe2Zvcih2YXIgciBpbiBlKXNhKHQscixlW3JdLG4pO3JldHVybiB0fSxkYT1ZLGhhPW4uVHlwZUVycm9yLHBhPWZ1bmN0aW9uKHQsZSl7aWYoZGEoZSx0KSlyZXR1cm4gdDt0aHJvdyBoYSgiSW5jb3JyZWN0IGludm9jYXRpb24iKX0sdmE9em4seWE9cW4sX2E9bi5SYW5nZUVycm9yLGdhPWZ1bmN0aW9uKHQpe2lmKHZvaWQgMD09PXQpcmV0dXJuIDA7dmFyIGU9dmEodCksbj15YShlKTtpZihlIT09bil0aHJvdyBfYSgiV3JvbmcgbGVuZ3RoIG9yIGluZGV4Iik7cmV0dXJuIG59LGJhPW4uQXJyYXksd2E9TWF0aC5hYnMseGE9TWF0aC5wb3csbWE9TWF0aC5mbG9vcixrYT1NYXRoLmxvZyxBYT1NYXRoLkxOMixTYT17cGFjazpmdW5jdGlvbih0LGUsbil7dmFyIHIsaSxvLGE9YmEobiksdT04Km4tZS0xLGM9KDE8PHUpLTEsZj1jPj4xLHM9MjM9PT1lP3hhKDIsLTI0KS14YSgyLC03Nyk6MCxsPXQ8MHx8MD09PXQmJjEvdDwwPzE6MCxkPTA7Zm9yKCh0PXdhKHQpKSE9dHx8dD09PTEvMD8oaT10IT10PzE6MCxyPWMpOihyPW1hKGthKHQpL0FhKSx0KihvPXhhKDIsLXIpKTwxJiYoci0tLG8qPTIpLCh0Kz1yK2Y+PTE/cy9vOnMqeGEoMiwxLWYpKSpvPj0yJiYocisrLG8vPTIpLHIrZj49Yz8oaT0wLHI9Yyk6citmPj0xPyhpPSh0Km8tMSkqeGEoMixlKSxyKz1mKTooaT10KnhhKDIsZi0xKSp4YSgyLGUpLHI9MCkpO2U+PTg7KWFbZCsrXT0yNTUmaSxpLz0yNTYsZS09ODtmb3Iocj1yPDxlfGksdSs9ZTt1PjA7KWFbZCsrXT0yNTUmcixyLz0yNTYsdS09ODtyZXR1cm4gYVstLWRdfD0xMjgqbCxhfSx1bnBhY2s6ZnVuY3Rpb24odCxlKXt2YXIgbixyPXQubGVuZ3RoLGk9OCpyLWUtMSxvPSgxPDxpKS0xLGE9bz4+MSx1PWktNyxjPXItMSxmPXRbYy0tXSxzPTEyNyZmO2ZvcihmPj49Nzt1PjA7KXM9MjU2KnMrdFtjLS1dLHUtPTg7Zm9yKG49cyYoMTw8LXUpLTEscz4+PS11LHUrPWU7dT4wOyluPTI1NipuK3RbYy0tXSx1LT04O2lmKDA9PT1zKXM9MS1hO2Vsc2V7aWYocz09PW8pcmV0dXJuIG4/TmFOOmY/LTEvMDoxLzA7bis9eGEoMixlKSxzLT1hfXJldHVybihmPy0xOjEpKm4qeGEoMixzLWUpfX0sRWE9UnQsVGE9WW4sT2E9WG4samE9ZnVuY3Rpb24odCl7Zm9yKHZhciBlPUVhKHRoaXMpLG49T2EoZSkscj1hcmd1bWVudHMubGVuZ3RoLGk9VGEocj4xP2FyZ3VtZW50c1sxXTp2b2lkIDAsbiksbz1yPjI/YXJndW1lbnRzWzJdOnZvaWQgMCxhPXZvaWQgMD09PW8/bjpUYShvLG4pO2E+aTspZVtpKytdPXQ7cmV0dXJuIGV9LElhPXVlLFJhPWtlLFBhPXksTWE9ZnVuY3Rpb24odCxlLG4pe3ZhciByPUlhKGUpO3IgaW4gdD9SYS5mKHQscixQYSgwLG4pKTp0W3JdPW59LExhPVluLFVhPVhuLENhPU1hLEZhPW4uQXJyYXksQmE9TWF0aC5tYXgsTmE9ZnVuY3Rpb24odCxlLG4pe2Zvcih2YXIgcj1VYSh0KSxpPUxhKGUsciksbz1MYSh2b2lkIDA9PT1uP3I6bixyKSxhPUZhKEJhKG8taSwwKSksdT0wO2k8bztpKyssdSsrKUNhKGEsdSx0W2ldKTtyZXR1cm4gYS5sZW5ndGg9dSxhfSxEYT1uLHphPW0sR2E9byxWYT1mYSxXYT1UbixZYT1EZSxIYT1sYSxLYT1pLHFhPXBhLCRhPXpuLFhhPXFuLEphPWdhLFFhPVNhLFphPWFvLHR1PU1vLGV1PUJuLmYsbnU9a2UuZixydT1qYSxpdT1OYSxvdT1ibyxhdT1XYS5QUk9QRVIsdXU9V2EuQ09ORklHVVJBQkxFLGN1PXhuLmdldCxmdT14bi5zZXQsc3U9RGEuQXJyYXlCdWZmZXIsbHU9c3UsZHU9bHUmJmx1LnByb3RvdHlwZSxodT1EYS5EYXRhVmlldyxwdT1odSYmaHUucHJvdG90eXBlLHZ1PU9iamVjdC5wcm90b3R5cGUseXU9RGEuQXJyYXksX3U9RGEuUmFuZ2VFcnJvcixndT16YShydSksYnU9emEoW10ucmV2ZXJzZSksd3U9UWEucGFjayx4dT1RYS51bnBhY2ssbXU9ZnVuY3Rpb24odCl7cmV0dXJuWzI1NSZ0XX0sa3U9ZnVuY3Rpb24odCl7cmV0dXJuWzI1NSZ0LHQ+PjgmMjU1XX0sQXU9ZnVuY3Rpb24odCl7cmV0dXJuWzI1NSZ0LHQ+PjgmMjU1LHQ+PjE2JjI1NSx0Pj4yNCYyNTVdfSxTdT1mdW5jdGlvbih0KXtyZXR1cm4gdFszXTw8MjR8dFsyXTw8MTZ8dFsxXTw8OHx0WzBdfSxFdT1mdW5jdGlvbih0KXtyZXR1cm4gd3UodCwyMyw0KX0sVHU9ZnVuY3Rpb24odCl7cmV0dXJuIHd1KHQsNTIsOCl9LE91PWZ1bmN0aW9uKHQsZSl7bnUodC5wcm90b3R5cGUsZSx7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGN1KHRoaXMpW2VdfX0pfSxqdT1mdW5jdGlvbih0LGUsbixyKXt2YXIgaT1KYShuKSxvPWN1KHQpO2lmKGkrZT5vLmJ5dGVMZW5ndGgpdGhyb3cgX3UoIldyb25nIGluZGV4Iik7dmFyIGE9Y3Uoby5idWZmZXIpLmJ5dGVzLHU9aStvLmJ5dGVPZmZzZXQsYz1pdShhLHUsdStlKTtyZXR1cm4gcj9jOmJ1KGMpfSxJdT1mdW5jdGlvbih0LGUsbixyLGksbyl7dmFyIGE9SmEobiksdT1jdSh0KTtpZihhK2U+dS5ieXRlTGVuZ3RoKXRocm93IF91KCJXcm9uZyBpbmRleCIpO2Zvcih2YXIgYz1jdSh1LmJ1ZmZlcikuYnl0ZXMsZj1hK3UuYnl0ZU9mZnNldCxzPXIoK2kpLGw9MDtsPGU7bCsrKWNbZitsXT1zW28/bDplLWwtMV19O2lmKFZhKXt2YXIgUnU9YXUmJiJBcnJheUJ1ZmZlciIhPT1zdS5uYW1lO2lmKEthKChmdW5jdGlvbigpe3N1KDEpfSkpJiZLYSgoZnVuY3Rpb24oKXtuZXcgc3UoLTEpfSkpJiYhS2EoKGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBzdSxuZXcgc3UoMS41KSxuZXcgc3UoTmFOKSxSdSYmIXV1fSkpKVJ1JiZ1dSYmWWEoc3UsIm5hbWUiLCJBcnJheUJ1ZmZlciIpO2Vsc2V7KGx1PWZ1bmN0aW9uKHQpe3JldHVybiBxYSh0aGlzLGR1KSxuZXcgc3UoSmEodCkpfSkucHJvdG90eXBlPWR1O2Zvcih2YXIgUHUsTXU9ZXUoc3UpLEx1PTA7TXUubGVuZ3RoPkx1OykoUHU9TXVbTHUrK10paW4gbHV8fFlhKGx1LFB1LHN1W1B1XSk7ZHUuY29uc3RydWN0b3I9bHV9dHUmJlphKHB1KSE9PXZ1JiZ0dShwdSx2dSk7dmFyIFV1PW5ldyBodShuZXcgbHUoMikpLEN1PXphKHB1LnNldEludDgpO1V1LnNldEludDgoMCwyMTQ3NDgzNjQ4KSxVdS5zZXRJbnQ4KDEsMjE0NzQ4MzY0OSksIVV1LmdldEludDgoMCkmJlV1LmdldEludDgoMSl8fEhhKHB1LHtzZXRJbnQ4OmZ1bmN0aW9uKHQsZSl7Q3UodGhpcyx0LGU8PDI0Pj4yNCl9LHNldFVpbnQ4OmZ1bmN0aW9uKHQsZSl7Q3UodGhpcyx0LGU8PDI0Pj4yNCl9fSx7dW5zYWZlOiEwfSl9ZWxzZSBkdT0obHU9ZnVuY3Rpb24odCl7cWEodGhpcyxkdSk7dmFyIGU9SmEodCk7ZnUodGhpcyx7Ynl0ZXM6Z3UoeXUoZSksMCksYnl0ZUxlbmd0aDplfSksR2F8fCh0aGlzLmJ5dGVMZW5ndGg9ZSl9KS5wcm90b3R5cGUscHU9KGh1PWZ1bmN0aW9uKHQsZSxuKXtxYSh0aGlzLHB1KSxxYSh0LGR1KTt2YXIgcj1jdSh0KS5ieXRlTGVuZ3RoLGk9JGEoZSk7aWYoaTwwfHxpPnIpdGhyb3cgX3UoIldyb25nIG9mZnNldCIpO2lmKGkrKG49dm9pZCAwPT09bj9yLWk6WGEobikpPnIpdGhyb3cgX3UoIldyb25nIGxlbmd0aCIpO2Z1KHRoaXMse2J1ZmZlcjp0LGJ5dGVMZW5ndGg6bixieXRlT2Zmc2V0Oml9KSxHYXx8KHRoaXMuYnVmZmVyPXQsdGhpcy5ieXRlTGVuZ3RoPW4sdGhpcy5ieXRlT2Zmc2V0PWkpfSkucHJvdG90eXBlLEdhJiYoT3UobHUsImJ5dGVMZW5ndGgiKSxPdShodSwiYnVmZmVyIiksT3UoaHUsImJ5dGVMZW5ndGgiKSxPdShodSwiYnl0ZU9mZnNldCIpKSxIYShwdSx7Z2V0SW50ODpmdW5jdGlvbih0KXtyZXR1cm4ganUodGhpcywxLHQpWzBdPDwyND4+MjR9LGdldFVpbnQ4OmZ1bmN0aW9uKHQpe3JldHVybiBqdSh0aGlzLDEsdClbMF19LGdldEludDE2OmZ1bmN0aW9uKHQpe3ZhciBlPWp1KHRoaXMsMix0LGFyZ3VtZW50cy5sZW5ndGg+MT9hcmd1bWVudHNbMV06dm9pZCAwKTtyZXR1cm4oZVsxXTw8OHxlWzBdKTw8MTY+PjE2fSxnZXRVaW50MTY6ZnVuY3Rpb24odCl7dmFyIGU9anUodGhpcywyLHQsYXJndW1lbnRzLmxlbmd0aD4xP2FyZ3VtZW50c1sxXTp2b2lkIDApO3JldHVybiBlWzFdPDw4fGVbMF19LGdldEludDMyOmZ1bmN0aW9uKHQpe3JldHVybiBTdShqdSh0aGlzLDQsdCxhcmd1bWVudHMubGVuZ3RoPjE/YXJndW1lbnRzWzFdOnZvaWQgMCkpfSxnZXRVaW50MzI6ZnVuY3Rpb24odCl7cmV0dXJuIFN1KGp1KHRoaXMsNCx0LGFyZ3VtZW50cy5sZW5ndGg+MT9hcmd1bWVudHNbMV06dm9pZCAwKSk+Pj4wfSxnZXRGbG9hdDMyOmZ1bmN0aW9uKHQpe3JldHVybiB4dShqdSh0aGlzLDQsdCxhcmd1bWVudHMubGVuZ3RoPjE/YXJndW1lbnRzWzFdOnZvaWQgMCksMjMpfSxnZXRGbG9hdDY0OmZ1bmN0aW9uKHQpe3JldHVybiB4dShqdSh0aGlzLDgsdCxhcmd1bWVudHMubGVuZ3RoPjE/YXJndW1lbnRzWzFdOnZvaWQgMCksNTIpfSxzZXRJbnQ4OmZ1bmN0aW9uKHQsZSl7SXUodGhpcywxLHQsbXUsZSl9LHNldFVpbnQ4OmZ1bmN0aW9uKHQsZSl7SXUodGhpcywxLHQsbXUsZSl9LHNldEludDE2OmZ1bmN0aW9uKHQsZSl7SXUodGhpcywyLHQsa3UsZSxhcmd1bWVudHMubGVuZ3RoPjI/YXJndW1lbnRzWzJdOnZvaWQgMCl9LHNldFVpbnQxNjpmdW5jdGlvbih0LGUpe0l1KHRoaXMsMix0LGt1LGUsYXJndW1lbnRzLmxlbmd0aD4yP2FyZ3VtZW50c1syXTp2b2lkIDApfSxzZXRJbnQzMjpmdW5jdGlvbih0LGUpe0l1KHRoaXMsNCx0LEF1LGUsYXJndW1lbnRzLmxlbmd0aD4yP2FyZ3VtZW50c1syXTp2b2lkIDApfSxzZXRVaW50MzI6ZnVuY3Rpb24odCxlKXtJdSh0aGlzLDQsdCxBdSxlLGFyZ3VtZW50cy5sZW5ndGg+Mj9hcmd1bWVudHNbMl06dm9pZCAwKX0sc2V0RmxvYXQzMjpmdW5jdGlvbih0LGUpe0l1KHRoaXMsNCx0LEV1LGUsYXJndW1lbnRzLmxlbmd0aD4yP2FyZ3VtZW50c1syXTp2b2lkIDApfSxzZXRGbG9hdDY0OmZ1bmN0aW9uKHQsZSl7SXUodGhpcyw4LHQsVHUsZSxhcmd1bWVudHMubGVuZ3RoPjI/YXJndW1lbnRzWzJdOnZvaWQgMCl9fSk7b3UobHUsIkFycmF5QnVmZmVyIiksb3UoaHUsIkRhdGFWaWV3Iik7dmFyIEZ1PXtBcnJheUJ1ZmZlcjpsdSxEYXRhVmlldzpodX0sQnU9bSxOdT1pLER1PUIsenU9WHIsR3U9cWUsVnU9ZnVuY3Rpb24oKXt9LFd1PVtdLFl1PVcoIlJlZmxlY3QiLCJjb25zdHJ1Y3QiKSxIdT0vXlxzKig/OmNsYXNzfGZ1bmN0aW9uKVxiLyxLdT1CdShIdS5leGVjKSxxdT0hSHUuZXhlYyhWdSksJHU9ZnVuY3Rpb24odCl7aWYoIUR1KHQpKXJldHVybiExO3RyeXtyZXR1cm4gWXUoVnUsV3UsdCksITB9Y2F0Y2godCl7cmV0dXJuITF9fSxYdT1mdW5jdGlvbih0KXtpZighRHUodCkpcmV0dXJuITE7c3dpdGNoKHp1KHQpKXtjYXNlIkFzeW5jRnVuY3Rpb24iOmNhc2UiR2VuZXJhdG9yRnVuY3Rpb24iOmNhc2UiQXN5bmNHZW5lcmF0b3JGdW5jdGlvbiI6cmV0dXJuITF9dHJ5e3JldHVybiBxdXx8ISFLdShIdSxHdSh0KSl9Y2F0Y2godCl7cmV0dXJuITB9fTtYdS5zaGFtPSEwO3ZhciBKdT0hWXV8fE51KChmdW5jdGlvbigpe3ZhciB0O3JldHVybiAkdSgkdS5jYWxsKXx8ISR1KE9iamVjdCl8fCEkdSgoZnVuY3Rpb24oKXt0PSEwfSkpfHx0fSkpP1h1OiR1LFF1PUp1LFp1PWx0LHRjPW4uVHlwZUVycm9yLGVjPWZ1bmN0aW9uKHQpe2lmKFF1KHQpKXJldHVybiB0O3Rocm93IHRjKFp1KHQpKyIgaXMgbm90IGEgY29uc3RydWN0b3IiKX0sbmM9amUscmM9ZWMsaWM9WHQoInNwZWNpZXMiKSxvYz1mdW5jdGlvbih0LGUpe3ZhciBuLHI9bmModCkuY29uc3RydWN0b3I7cmV0dXJuIHZvaWQgMD09PXJ8fG51bGw9PShuPW5jKHIpW2ljXSk/ZTpyYyhuKX0sYWM9TnIsdWM9bSxjYz1pLGZjPWplLHNjPVluLGxjPXFuLGRjPW9jLGhjPUZ1LkFycmF5QnVmZmVyLHBjPUZ1LkRhdGFWaWV3LHZjPXBjLnByb3RvdHlwZSx5Yz11YyhoYy5wcm90b3R5cGUuc2xpY2UpLF9jPXVjKHZjLmdldFVpbnQ4KSxnYz11Yyh2Yy5zZXRVaW50OCk7YWMoe3RhcmdldDoiQXJyYXlCdWZmZXIiLHByb3RvOiEwLHVuc2FmZTohMCxmb3JjZWQ6Y2MoKGZ1bmN0aW9uKCl7cmV0dXJuIW5ldyBoYygyKS5zbGljZSgxLHZvaWQgMCkuYnl0ZUxlbmd0aH0pKX0se3NsaWNlOmZ1bmN0aW9uKHQsZSl7aWYoeWMmJnZvaWQgMD09PWUpcmV0dXJuIHljKGZjKHRoaXMpLHQpO2Zvcih2YXIgbj1mYyh0aGlzKS5ieXRlTGVuZ3RoLHI9c2ModCxuKSxpPXNjKHZvaWQgMD09PWU/bjplLG4pLG89bmV3KGRjKHRoaXMsaGMpKShsYyhpLXIpKSxhPW5ldyBwYyh0aGlzKSx1PW5ldyBwYyhvKSxjPTA7cjxpOylnYyh1LGMrKyxfYyhhLHIrKykpO3JldHVybiBvfX0pO3ZhciBiYz1Ycix3Yz1Hcj97fS50b1N0cmluZzpmdW5jdGlvbigpe3JldHVybiJbb2JqZWN0ICIrYmModGhpcykrIl0ifSx4Yz1HcixtYz16ZS5leHBvcnRzLGtjPXdjO3hjfHxtYyhPYmplY3QucHJvdG90eXBlLCJ0b1N0cmluZyIsa2Mse3Vuc2FmZTohMH0pO3ZhciBBYz17ZXhwb3J0czp7fX0sU2M9WHQoIml0ZXJhdG9yIiksRWM9ITE7dHJ5e3ZhciBUYz0wLE9jPXtuZXh0OmZ1bmN0aW9uKCl7cmV0dXJue2RvbmU6ISFUYysrfX0scmV0dXJuOmZ1bmN0aW9uKCl7RWM9ITB9fTtPY1tTY109ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30sQXJyYXkuZnJvbShPYywoZnVuY3Rpb24oKXt0aHJvdyAyfSkpfWNhdGNoKHQpe312YXIgamMsSWMsUmMsUGM9ZnVuY3Rpb24odCxlKXtpZighZSYmIUVjKXJldHVybiExO3ZhciBuPSExO3RyeXt2YXIgcj17fTtyW1NjXT1mdW5jdGlvbigpe3JldHVybntuZXh0OmZ1bmN0aW9uKCl7cmV0dXJue2RvbmU6bj0hMH19fX0sdChyKX1jYXRjaCh0KXt9cmV0dXJuIG59LE1jPWZhLExjPW8sVWM9bixDYz1CLEZjPUQsQmM9THQsTmM9WHIsRGM9bHQsemM9RGUsR2M9emUuZXhwb3J0cyxWYz1rZS5mLFdjPVksWWM9YW8sSGM9TW8sS2M9WHQscWM9TnQsJGM9VWMuSW50OEFycmF5LFhjPSRjJiYkYy5wcm90b3R5cGUsSmM9VWMuVWludDhDbGFtcGVkQXJyYXksUWM9SmMmJkpjLnByb3RvdHlwZSxaYz0kYyYmWWMoJGMpLHRmPVhjJiZZYyhYYyksZWY9T2JqZWN0LnByb3RvdHlwZSxuZj1VYy5UeXBlRXJyb3IscmY9S2MoInRvU3RyaW5nVGFnIiksb2Y9cWMoIlRZUEVEX0FSUkFZX1RBRyIpLGFmPXFjKCJUWVBFRF9BUlJBWV9DT05TVFJVQ1RPUiIpLHVmPU1jJiYhIUhjJiYiT3BlcmEiIT09TmMoVWMub3BlcmEpLGNmPSExLGZmPXtJbnQ4QXJyYXk6MSxVaW50OEFycmF5OjEsVWludDhDbGFtcGVkQXJyYXk6MSxJbnQxNkFycmF5OjIsVWludDE2QXJyYXk6MixJbnQzMkFycmF5OjQsVWludDMyQXJyYXk6NCxGbG9hdDMyQXJyYXk6NCxGbG9hdDY0QXJyYXk6OH0sc2Y9e0JpZ0ludDY0QXJyYXk6OCxCaWdVaW50NjRBcnJheTo4fSxsZj1mdW5jdGlvbih0KXtpZighRmModCkpcmV0dXJuITE7dmFyIGU9TmModCk7cmV0dXJuIEJjKGZmLGUpfHxCYyhzZixlKX07Zm9yKGpjIGluIGZmKShSYz0oSWM9VWNbamNdKSYmSWMucHJvdG90eXBlKT96YyhSYyxhZixJYyk6dWY9ITE7Zm9yKGpjIGluIHNmKShSYz0oSWM9VWNbamNdKSYmSWMucHJvdG90eXBlKSYmemMoUmMsYWYsSWMpO2lmKCghdWZ8fCFDYyhaYyl8fFpjPT09RnVuY3Rpb24ucHJvdG90eXBlKSYmKFpjPWZ1bmN0aW9uKCl7dGhyb3cgbmYoIkluY29ycmVjdCBpbnZvY2F0aW9uIil9LHVmKSlmb3IoamMgaW4gZmYpVWNbamNdJiZIYyhVY1tqY10sWmMpO2lmKCghdWZ8fCF0Znx8dGY9PT1lZikmJih0Zj1aYy5wcm90b3R5cGUsdWYpKWZvcihqYyBpbiBmZilVY1tqY10mJkhjKFVjW2pjXS5wcm90b3R5cGUsdGYpO2lmKHVmJiZZYyhRYykhPT10ZiYmSGMoUWMsdGYpLExjJiYhQmModGYscmYpKWZvcihqYyBpbiBjZj0hMCxWYyh0ZixyZix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIEZjKHRoaXMpP3RoaXNbb2ZdOnZvaWQgMH19KSxmZilVY1tqY10mJnpjKFVjW2pjXSxvZixqYyk7dmFyIGRmPXtOQVRJVkVfQVJSQVlfQlVGRkVSX1ZJRVdTOnVmLFRZUEVEX0FSUkFZX0NPTlNUUlVDVE9SOmFmLFRZUEVEX0FSUkFZX1RBRzpjZiYmb2YsYVR5cGVkQXJyYXk6ZnVuY3Rpb24odCl7aWYobGYodCkpcmV0dXJuIHQ7dGhyb3cgbmYoIlRhcmdldCBpcyBub3QgYSB0eXBlZCBhcnJheSIpfSxhVHlwZWRBcnJheUNvbnN0cnVjdG9yOmZ1bmN0aW9uKHQpe2lmKENjKHQpJiYoIUhjfHxXYyhaYyx0KSkpcmV0dXJuIHQ7dGhyb3cgbmYoRGModCkrIiBpcyBub3QgYSB0eXBlZCBhcnJheSBjb25zdHJ1Y3RvciIpfSxleHBvcnRUeXBlZEFycmF5TWV0aG9kOmZ1bmN0aW9uKHQsZSxuLHIpe2lmKExjKXtpZihuKWZvcih2YXIgaSBpbiBmZil7dmFyIG89VWNbaV07aWYobyYmQmMoby5wcm90b3R5cGUsdCkpdHJ5e2RlbGV0ZSBvLnByb3RvdHlwZVt0XX1jYXRjaChuKXt0cnl7by5wcm90b3R5cGVbdF09ZX1jYXRjaCh0KXt9fX10Zlt0XSYmIW58fEdjKHRmLHQsbj9lOnVmJiZYY1t0XXx8ZSxyKX19LGV4cG9ydFR5cGVkQXJyYXlTdGF0aWNNZXRob2Q6ZnVuY3Rpb24odCxlLG4pe3ZhciByLGk7aWYoTGMpe2lmKEhjKXtpZihuKWZvcihyIGluIGZmKWlmKChpPVVjW3JdKSYmQmMoaSx0KSl0cnl7ZGVsZXRlIGlbdF19Y2F0Y2godCl7fWlmKFpjW3RdJiYhbilyZXR1cm47dHJ5e3JldHVybiBHYyhaYyx0LG4/ZTp1ZiYmWmNbdF18fGUpfWNhdGNoKHQpe319Zm9yKHIgaW4gZmYpIShpPVVjW3JdKXx8aVt0XSYmIW58fEdjKGksdCxlKX19LGlzVmlldzpmdW5jdGlvbih0KXtpZighRmModCkpcmV0dXJuITE7dmFyIGU9TmModCk7cmV0dXJuIkRhdGFWaWV3Ij09PWV8fEJjKGZmLGUpfHxCYyhzZixlKX0saXNUeXBlZEFycmF5OmxmLFR5cGVkQXJyYXk6WmMsVHlwZWRBcnJheVByb3RvdHlwZTp0Zn0saGY9bixwZj1pLHZmPVBjLHlmPWRmLk5BVElWRV9BUlJBWV9CVUZGRVJfVklFV1MsX2Y9aGYuQXJyYXlCdWZmZXIsZ2Y9aGYuSW50OEFycmF5LGJmPSF5Znx8IXBmKChmdW5jdGlvbigpe2dmKDEpfSkpfHwhcGYoKGZ1bmN0aW9uKCl7bmV3IGdmKC0xKX0pKXx8IXZmKChmdW5jdGlvbih0KXtuZXcgZ2YsbmV3IGdmKG51bGwpLG5ldyBnZigxLjUpLG5ldyBnZih0KX0pLCEwKXx8cGYoKGZ1bmN0aW9uKCl7cmV0dXJuIDEhPT1uZXcgZ2YobmV3IF9mKDIpLDEsdm9pZCAwKS5sZW5ndGh9KSksd2Y9RCx4Zj1NYXRoLmZsb29yLG1mPU51bWJlci5pc0ludGVnZXJ8fGZ1bmN0aW9uKHQpe3JldHVybiF3Zih0KSYmaXNGaW5pdGUodCkmJnhmKHQpPT09dH0sa2Y9em4sQWY9bi5SYW5nZUVycm9yLFNmPWZ1bmN0aW9uKHQpe3ZhciBlPWtmKHQpO2lmKGU8MCl0aHJvdyBBZigiVGhlIGFyZ3VtZW50IGNhbid0IGJlIGxlc3MgdGhhbiAwIik7cmV0dXJuIGV9LEVmPW4uUmFuZ2VFcnJvcixUZj1mdW5jdGlvbih0LGUpe3ZhciBuPVNmKHQpO2lmKG4lZSl0aHJvdyBFZigiV3Jvbmcgb2Zmc2V0Iik7cmV0dXJuIG59LE9mPXZ0LGpmPWEsSWY9bShtLmJpbmQpLFJmPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIE9mKHQpLHZvaWQgMD09PWU/dDpqZj9JZih0LGUpOmZ1bmN0aW9uKCl7cmV0dXJuIHQuYXBwbHkoZSxhcmd1bWVudHMpfX0sUGY9WHIsTWY9X3QsTGY9WGksVWY9WHQoIml0ZXJhdG9yIiksQ2Y9ZnVuY3Rpb24odCl7aWYobnVsbCE9dClyZXR1cm4gTWYodCxVZil8fE1mKHQsIkBAaXRlcmF0b3IiKXx8TGZbUGYodCldfSxGZj1mLEJmPXZ0LE5mPWplLERmPWx0LHpmPUNmLEdmPW4uVHlwZUVycm9yLFZmPWZ1bmN0aW9uKHQsZSl7dmFyIG49YXJndW1lbnRzLmxlbmd0aDwyP3pmKHQpOmU7aWYoQmYobikpcmV0dXJuIE5mKEZmKG4sdCkpO3Rocm93IEdmKERmKHQpKyIgaXMgbm90IGl0ZXJhYmxlIil9LFdmPVhpLFlmPVh0KCJpdGVyYXRvciIpLEhmPUFycmF5LnByb3RvdHlwZSxLZj1mdW5jdGlvbih0KXtyZXR1cm4gdm9pZCAwIT09dCYmKFdmLkFycmF5PT09dHx8SGZbWWZdPT09dCl9LHFmPVJmLCRmPWYsWGY9ZWMsSmY9UnQsUWY9WG4sWmY9VmYsdHM9Q2YsZXM9S2YsbnM9ZGYuYVR5cGVkQXJyYXlDb25zdHJ1Y3Rvcixycz1FLGlzPUFycmF5LmlzQXJyYXl8fGZ1bmN0aW9uKHQpe3JldHVybiJBcnJheSI9PXJzKHQpfSxvcz1uLGFzPWlzLHVzPUp1LGNzPUQsZnM9WHQoInNwZWNpZXMiKSxzcz1vcy5BcnJheSxscz1mdW5jdGlvbih0KXt2YXIgZTtyZXR1cm4gYXModCkmJihlPXQuY29uc3RydWN0b3IsKHVzKGUpJiYoZT09PXNzfHxhcyhlLnByb3RvdHlwZSkpfHxjcyhlKSYmbnVsbD09PShlPWVbZnNdKSkmJihlPXZvaWQgMCkpLHZvaWQgMD09PWU/c3M6ZX0sZHM9ZnVuY3Rpb24odCxlKXtyZXR1cm4gbmV3KGxzKHQpKSgwPT09ZT8wOmUpfSxocz1SZixwcz1QLHZzPVJ0LHlzPVhuLF9zPWRzLGdzPW0oW10ucHVzaCksYnM9ZnVuY3Rpb24odCl7dmFyIGU9MT09dCxuPTI9PXQscj0zPT10LGk9ND09dCxvPTY9PXQsYT03PT10LHU9NT09dHx8bztyZXR1cm4gZnVuY3Rpb24oYyxmLHMsbCl7Zm9yKHZhciBkLGgscD12cyhjKSx2PXBzKHApLHk9aHMoZixzKSxfPXlzKHYpLGc9MCxiPWx8fF9zLHc9ZT9iKGMsXyk6bnx8YT9iKGMsMCk6dm9pZCAwO18+ZztnKyspaWYoKHV8fGcgaW4gdikmJihoPXkoZD12W2ddLGcscCksdCkpaWYoZSl3W2ddPWg7ZWxzZSBpZihoKXN3aXRjaCh0KXtjYXNlIDM6cmV0dXJuITA7Y2FzZSA1OnJldHVybiBkO2Nhc2UgNjpyZXR1cm4gZztjYXNlIDI6Z3ModyxkKX1lbHNlIHN3aXRjaCh0KXtjYXNlIDQ6cmV0dXJuITE7Y2FzZSA3OmdzKHcsZCl9cmV0dXJuIG8/LTE6cnx8aT9pOnd9fSx3cz17Zm9yRWFjaDpicygwKSxtYXA6YnMoMSksZmlsdGVyOmJzKDIpLHNvbWU6YnMoMyksZXZlcnk6YnMoNCksZmluZDpicyg1KSxmaW5kSW5kZXg6YnMoNiksZmlsdGVyUmVqZWN0OmJzKDcpfSx4cz1XLG1zPWtlLGtzPW8sQXM9WHQoInNwZWNpZXMiKSxTcz1mdW5jdGlvbih0KXt2YXIgZT14cyh0KSxuPW1zLmY7a3MmJmUmJiFlW0FzXSYmbihlLEFzLHtjb25maWd1cmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9fSl9LEVzPUIsVHM9RCxPcz1Nbyxqcz1OcixJcz1uLFJzPWYsUHM9byxNcz1iZixMcz1kZixVcz1GdSxDcz1wYSxGcz15LEJzPURlLE5zPW1mLERzPXFuLHpzPWdhLEdzPVRmLFZzPXVlLFdzPUx0LFlzPVhyLEhzPUQsS3M9ZnQscXM9emksJHM9WSxYcz1NbyxKcz1Cbi5mLFFzPWZ1bmN0aW9uKHQpe3ZhciBlLG4scixpLG8sYSx1PVhmKHRoaXMpLGM9SmYodCksZj1hcmd1bWVudHMubGVuZ3RoLHM9Zj4xP2FyZ3VtZW50c1sxXTp2b2lkIDAsbD12b2lkIDAhPT1zLGQ9dHMoYyk7aWYoZCYmIWVzKGQpKWZvcihhPShvPVpmKGMsZCkpLm5leHQsYz1bXTshKGk9JGYoYSxvKSkuZG9uZTspYy5wdXNoKGkudmFsdWUpO2ZvcihsJiZmPjImJihzPXFmKHMsYXJndW1lbnRzWzJdKSksbj1RZihjKSxyPW5ldyhucyh1KSkobiksZT0wO24+ZTtlKyspcltlXT1sP3MoY1tlXSxlKTpjW2VdO3JldHVybiByfSxacz13cy5mb3JFYWNoLHRsPVNzLGVsPWtlLG5sPXIscmw9ZnVuY3Rpb24odCxlLG4pe3ZhciByLGk7cmV0dXJuIE9zJiZFcyhyPWUuY29uc3RydWN0b3IpJiZyIT09biYmVHMoaT1yLnByb3RvdHlwZSkmJmkhPT1uLnByb3RvdHlwZSYmT3ModCxpKSx0fSxpbD14bi5nZXQsb2w9eG4uc2V0LGFsPWVsLmYsdWw9bmwuZixjbD1NYXRoLnJvdW5kLGZsPUlzLlJhbmdlRXJyb3Isc2w9VXMuQXJyYXlCdWZmZXIsbGw9c2wucHJvdG90eXBlLGRsPVVzLkRhdGFWaWV3LGhsPUxzLk5BVElWRV9BUlJBWV9CVUZGRVJfVklFV1MscGw9THMuVFlQRURfQVJSQVlfQ09OU1RSVUNUT1Isdmw9THMuVFlQRURfQVJSQVlfVEFHLHlsPUxzLlR5cGVkQXJyYXksX2w9THMuVHlwZWRBcnJheVByb3RvdHlwZSxnbD1Mcy5hVHlwZWRBcnJheUNvbnN0cnVjdG9yLGJsPUxzLmlzVHlwZWRBcnJheSx3bD1mdW5jdGlvbih0LGUpe2dsKHQpO2Zvcih2YXIgbj0wLHI9ZS5sZW5ndGgsaT1uZXcgdChyKTtyPm47KWlbbl09ZVtuKytdO3JldHVybiBpfSx4bD1mdW5jdGlvbih0LGUpe2FsKHQsZSx7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGlsKHRoaXMpW2VdfX0pfSxtbD1mdW5jdGlvbih0KXt2YXIgZTtyZXR1cm4gJHMobGwsdCl8fCJBcnJheUJ1ZmZlciI9PShlPVlzKHQpKXx8IlNoYXJlZEFycmF5QnVmZmVyIj09ZX0sa2w9ZnVuY3Rpb24odCxlKXtyZXR1cm4gYmwodCkmJiFLcyhlKSYmZSBpbiB0JiZOcygrZSkmJmU+PTB9LEFsPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIGU9VnMoZSksa2wodCxlKT9GcygyLHRbZV0pOnVsKHQsZSl9LFNsPWZ1bmN0aW9uKHQsZSxuKXtyZXR1cm4gZT1WcyhlKSwhKGtsKHQsZSkmJkhzKG4pJiZXcyhuLCJ2YWx1ZSIpKXx8V3MobiwiZ2V0Iil8fFdzKG4sInNldCIpfHxuLmNvbmZpZ3VyYWJsZXx8V3Mobiwid3JpdGFibGUiKSYmIW4ud3JpdGFibGV8fFdzKG4sImVudW1lcmFibGUiKSYmIW4uZW51bWVyYWJsZT9hbCh0LGUsbik6KHRbZV09bi52YWx1ZSx0KX07UHM/KGhsfHwobmwuZj1BbCxlbC5mPVNsLHhsKF9sLCJidWZmZXIiKSx4bChfbCwiYnl0ZU9mZnNldCIpLHhsKF9sLCJieXRlTGVuZ3RoIikseGwoX2wsImxlbmd0aCIpKSxqcyh7dGFyZ2V0OiJPYmplY3QiLHN0YXQ6ITAsZm9yY2VkOiFobH0se2dldE93blByb3BlcnR5RGVzY3JpcHRvcjpBbCxkZWZpbmVQcm9wZXJ0eTpTbH0pLEFjLmV4cG9ydHM9ZnVuY3Rpb24odCxlLG4pe3ZhciByPXQubWF0Y2goL1xkKyQvKVswXS84LGk9dCsobj8iQ2xhbXBlZCI6IiIpKyJBcnJheSIsbz0iZ2V0Iit0LGE9InNldCIrdCx1PUlzW2ldLGM9dSxmPWMmJmMucHJvdG90eXBlLHM9e30sbD1mdW5jdGlvbih0LGUpe2FsKHQsZSx7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQsZSl7dmFyIG49aWwodCk7cmV0dXJuIG4udmlld1tvXShlKnIrbi5ieXRlT2Zmc2V0LCEwKX0odGhpcyxlKX0sc2V0OmZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbih0LGUsaSl7dmFyIG89aWwodCk7biYmKGk9KGk9Y2woaSkpPDA/MDppPjI1NT8yNTU6MjU1JmkpLG8udmlld1thXShlKnIrby5ieXRlT2Zmc2V0LGksITApfSh0aGlzLGUsdCl9LGVudW1lcmFibGU6ITB9KX07aGw/TXMmJihjPWUoKGZ1bmN0aW9uKHQsZSxuLGkpe3JldHVybiBDcyh0LGYpLHJsKEhzKGUpP21sKGUpP3ZvaWQgMCE9PWk/bmV3IHUoZSxHcyhuLHIpLGkpOnZvaWQgMCE9PW4/bmV3IHUoZSxHcyhuLHIpKTpuZXcgdShlKTpibChlKT93bChjLGUpOlJzKFFzLGMsZSk6bmV3IHUoenMoZSkpLHQsYyl9KSksWHMmJlhzKGMseWwpLFpzKEpzKHUpLChmdW5jdGlvbih0KXt0IGluIGN8fEJzKGMsdCx1W3RdKX0pKSxjLnByb3RvdHlwZT1mKTooYz1lKChmdW5jdGlvbih0LGUsbixpKXtDcyh0LGYpO3ZhciBvLGEsdSxzPTAsZD0wO2lmKEhzKGUpKXtpZighbWwoZSkpcmV0dXJuIGJsKGUpP3dsKGMsZSk6UnMoUXMsYyxlKTtvPWUsZD1HcyhuLHIpO3ZhciBoPWUuYnl0ZUxlbmd0aDtpZih2b2lkIDA9PT1pKXtpZihoJXIpdGhyb3cgZmwoIldyb25nIGxlbmd0aCIpO2lmKChhPWgtZCk8MCl0aHJvdyBmbCgiV3JvbmcgbGVuZ3RoIil9ZWxzZSBpZigoYT1EcyhpKSpyKStkPmgpdGhyb3cgZmwoIldyb25nIGxlbmd0aCIpO3U9YS9yfWVsc2UgdT16cyhlKSxvPW5ldyBzbChhPXUqcik7Zm9yKG9sKHQse2J1ZmZlcjpvLGJ5dGVPZmZzZXQ6ZCxieXRlTGVuZ3RoOmEsbGVuZ3RoOnUsdmlldzpuZXcgZGwobyl9KTtzPHU7KWwodCxzKyspfSkpLFhzJiZYcyhjLHlsKSxmPWMucHJvdG90eXBlPXFzKF9sKSksZi5jb25zdHJ1Y3RvciE9PWMmJkJzKGYsImNvbnN0cnVjdG9yIixjKSxCcyhmLHBsLGMpLHZsJiZCcyhmLHZsLGkpLHNbaV09Yyxqcyh7Z2xvYmFsOiEwLGZvcmNlZDpjIT11LHNoYW06IWhsfSxzKSwiQllURVNfUEVSX0VMRU1FTlQiaW4gY3x8QnMoYywiQllURVNfUEVSX0VMRU1FTlQiLHIpLCJCWVRFU19QRVJfRUxFTUVOVCJpbiBmfHxCcyhmLCJCWVRFU19QRVJfRUxFTUVOVCIsciksdGwoaSl9KTpBYy5leHBvcnRzPWZ1bmN0aW9uKCl7fSwoMCxBYy5leHBvcnRzKSgiVWludDgiLChmdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oZSxuLHIpe3JldHVybiB0KHRoaXMsZSxuLHIpfX0pKTt2YXIgRWw9UnQsVGw9WW4sT2w9WG4samw9TWF0aC5taW4sSWw9W10uY29weVdpdGhpbnx8ZnVuY3Rpb24odCxlKXt2YXIgbj1FbCh0aGlzKSxyPU9sKG4pLGk9VGwodCxyKSxvPVRsKGUsciksYT1hcmd1bWVudHMubGVuZ3RoPjI/YXJndW1lbnRzWzJdOnZvaWQgMCx1PWpsKCh2b2lkIDA9PT1hP3I6VGwoYSxyKSktbyxyLWkpLGM9MTtmb3IobzxpJiZpPG8rdSYmKGM9LTEsbys9dS0xLGkrPXUtMSk7dS0tID4wOylvIGluIG4/bltpXT1uW29dOmRlbGV0ZSBuW2ldLGkrPWMsbys9YztyZXR1cm4gbn0sUmw9ZGYsUGw9bShJbCksTWw9UmwuYVR5cGVkQXJyYXk7KDAsUmwuZXhwb3J0VHlwZWRBcnJheU1ldGhvZCkoImNvcHlXaXRoaW4iLChmdW5jdGlvbih0LGUpe3JldHVybiBQbChNbCh0aGlzKSx0LGUsYXJndW1lbnRzLmxlbmd0aD4yP2FyZ3VtZW50c1syXTp2b2lkIDApfSkpO3ZhciBMbD13cy5ldmVyeSxVbD1kZi5hVHlwZWRBcnJheTsoMCxkZi5leHBvcnRUeXBlZEFycmF5TWV0aG9kKSgiZXZlcnkiLChmdW5jdGlvbih0KXtyZXR1cm4gTGwoVWwodGhpcyksdCxhcmd1bWVudHMubGVuZ3RoPjE/YXJndW1lbnRzWzFdOnZvaWQgMCl9KSk7dmFyIENsPWYsRmw9amEsQmw9ZGYuYVR5cGVkQXJyYXk7KDAsZGYuZXhwb3J0VHlwZWRBcnJheU1ldGhvZCkoImZpbGwiLChmdW5jdGlvbih0KXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoO3JldHVybiBDbChGbCxCbCh0aGlzKSx0LGU+MT9hcmd1bWVudHNbMV06dm9pZCAwLGU+Mj9hcmd1bWVudHNbMl06dm9pZCAwKX0pKTt2YXIgTmw9WG4sRGw9b2Msemw9ZGYuVFlQRURfQVJSQVlfQ09OU1RSVUNUT1IsR2w9ZGYuYVR5cGVkQXJyYXlDb25zdHJ1Y3RvcixWbD1mdW5jdGlvbih0KXtyZXR1cm4gR2woRGwodCx0W3psXSkpfSxXbD1mdW5jdGlvbih0LGUpe2Zvcih2YXIgbj0wLHI9TmwoZSksaT1uZXcgdChyKTtyPm47KWlbbl09ZVtuKytdO3JldHVybiBpfSxZbD1WbCxIbD13cy5maWx0ZXIsS2w9ZnVuY3Rpb24odCxlKXtyZXR1cm4gV2woWWwodCksZSl9LHFsPWRmLmFUeXBlZEFycmF5OygwLGRmLmV4cG9ydFR5cGVkQXJyYXlNZXRob2QpKCJmaWx0ZXIiLChmdW5jdGlvbih0KXt2YXIgZT1IbChxbCh0aGlzKSx0LGFyZ3VtZW50cy5sZW5ndGg+MT9hcmd1bWVudHNbMV06dm9pZCAwKTtyZXR1cm4gS2wodGhpcyxlKX0pKTt2YXIgJGw9d3MuZmluZCxYbD1kZi5hVHlwZWRBcnJheTsoMCxkZi5leHBvcnRUeXBlZEFycmF5TWV0aG9kKSgiZmluZCIsKGZ1bmN0aW9uKHQpe3JldHVybiAkbChYbCh0aGlzKSx0LGFyZ3VtZW50cy5sZW5ndGg+MT9hcmd1bWVudHNbMV06dm9pZCAwKX0pKTt2YXIgSmw9d3MuZmluZEluZGV4LFFsPWRmLmFUeXBlZEFycmF5OygwLGRmLmV4cG9ydFR5cGVkQXJyYXlNZXRob2QpKCJmaW5kSW5kZXgiLChmdW5jdGlvbih0KXtyZXR1cm4gSmwoUWwodGhpcyksdCxhcmd1bWVudHMubGVuZ3RoPjE/YXJndW1lbnRzWzFdOnZvaWQgMCl9KSk7dmFyIFpsPXdzLmZvckVhY2gsdGQ9ZGYuYVR5cGVkQXJyYXk7KDAsZGYuZXhwb3J0VHlwZWRBcnJheU1ldGhvZCkoImZvckVhY2giLChmdW5jdGlvbih0KXtabCh0ZCh0aGlzKSx0LGFyZ3VtZW50cy5sZW5ndGg+MT9hcmd1bWVudHNbMV06dm9pZCAwKX0pKTt2YXIgZWQ9ZXIuaW5jbHVkZXMsbmQ9ZGYuYVR5cGVkQXJyYXk7KDAsZGYuZXhwb3J0VHlwZWRBcnJheU1ldGhvZCkoImluY2x1ZGVzIiwoZnVuY3Rpb24odCl7cmV0dXJuIGVkKG5kKHRoaXMpLHQsYXJndW1lbnRzLmxlbmd0aD4xP2FyZ3VtZW50c1sxXTp2b2lkIDApfSkpO3ZhciByZD1lci5pbmRleE9mLGlkPWRmLmFUeXBlZEFycmF5OygwLGRmLmV4cG9ydFR5cGVkQXJyYXlNZXRob2QpKCJpbmRleE9mIiwoZnVuY3Rpb24odCl7cmV0dXJuIHJkKGlkKHRoaXMpLHQsYXJndW1lbnRzLmxlbmd0aD4xP2FyZ3VtZW50c1sxXTp2b2lkIDApfSkpO3ZhciBvZD1uLGFkPWksdWQ9bSxjZD1kZixmZD11YSxzZD1YdCgiaXRlcmF0b3IiKSxsZD1vZC5VaW50OEFycmF5LGRkPXVkKGZkLnZhbHVlcyksaGQ9dWQoZmQua2V5cykscGQ9dWQoZmQuZW50cmllcyksdmQ9Y2QuYVR5cGVkQXJyYXkseWQ9Y2QuZXhwb3J0VHlwZWRBcnJheU1ldGhvZCxfZD1sZCYmbGQucHJvdG90eXBlLGdkPSFhZCgoZnVuY3Rpb24oKXtfZFtzZF0uY2FsbChbMV0pfSkpLGJkPSEhX2QmJl9kLnZhbHVlcyYmX2Rbc2RdPT09X2QudmFsdWVzJiYidmFsdWVzIj09PV9kLnZhbHVlcy5uYW1lLHdkPWZ1bmN0aW9uKCl7cmV0dXJuIGRkKHZkKHRoaXMpKX07eWQoImVudHJpZXMiLChmdW5jdGlvbigpe3JldHVybiBwZCh2ZCh0aGlzKSl9KSxnZCkseWQoImtleXMiLChmdW5jdGlvbigpe3JldHVybiBoZCh2ZCh0aGlzKSl9KSxnZCkseWQoInZhbHVlcyIsd2QsZ2R8fCFiZCx7bmFtZToidmFsdWVzIn0pLHlkKHNkLHdkLGdkfHwhYmQse25hbWU6InZhbHVlcyJ9KTt2YXIgeGQ9ZGYuYVR5cGVkQXJyYXksbWQ9ZGYuZXhwb3J0VHlwZWRBcnJheU1ldGhvZCxrZD1tKFtdLmpvaW4pO21kKCJqb2luIiwoZnVuY3Rpb24odCl7cmV0dXJuIGtkKHhkKHRoaXMpLHQpfSkpO3ZhciBBZD1hLFNkPUZ1bmN0aW9uLnByb3RvdHlwZSxFZD1TZC5hcHBseSxUZD1TZC5jYWxsLE9kPSJvYmplY3QiPT10eXBlb2YgUmVmbGVjdCYmUmVmbGVjdC5hcHBseXx8KEFkP1RkLmJpbmQoRWQpOmZ1bmN0aW9uKCl7cmV0dXJuIFRkLmFwcGx5KEVkLGFyZ3VtZW50cyl9KSxqZD1pLElkPU9kLFJkPUYsUGQ9em4sTWQ9WG4sTGQ9ZnVuY3Rpb24odCxlKXt2YXIgbj1bXVt0XTtyZXR1cm4hIW4mJmpkKChmdW5jdGlvbigpe24uY2FsbChudWxsLGV8fGZ1bmN0aW9uKCl7dGhyb3cgMX0sMSl9KSl9LFVkPU1hdGgubWluLENkPVtdLmxhc3RJbmRleE9mLEZkPSEhQ2QmJjEvWzFdLmxhc3RJbmRleE9mKDEsLTApPDAsQmQ9TGQoImxhc3RJbmRleE9mIiksTmQ9T2QsRGQ9RmR8fCFCZD9mdW5jdGlvbih0KXtpZihGZClyZXR1cm4gSWQoQ2QsdGhpcyxhcmd1bWVudHMpfHwwO3ZhciBlPVJkKHRoaXMpLG49TWQoZSkscj1uLTE7Zm9yKGFyZ3VtZW50cy5sZW5ndGg+MSYmKHI9VWQocixQZChhcmd1bWVudHNbMV0pKSkscjwwJiYocj1uK3IpO3I+PTA7ci0tKWlmKHIgaW4gZSYmZVtyXT09PXQpcmV0dXJuIHJ8fDA7cmV0dXJuLTF9OkNkLHpkPWRmLmFUeXBlZEFycmF5OygwLGRmLmV4cG9ydFR5cGVkQXJyYXlNZXRob2QpKCJsYXN0SW5kZXhPZiIsKGZ1bmN0aW9uKHQpe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg7cmV0dXJuIE5kKERkLHpkKHRoaXMpLGU+MT9bdCxhcmd1bWVudHNbMV1dOlt0XSl9KSk7dmFyIEdkPXdzLm1hcCxWZD1WbCxXZD1kZi5hVHlwZWRBcnJheTsoMCxkZi5leHBvcnRUeXBlZEFycmF5TWV0aG9kKSgibWFwIiwoZnVuY3Rpb24odCl7cmV0dXJuIEdkKFdkKHRoaXMpLHQsYXJndW1lbnRzLmxlbmd0aD4xP2FyZ3VtZW50c1sxXTp2b2lkIDAsKGZ1bmN0aW9uKHQsZSl7cmV0dXJuIG5ldyhWZCh0KSkoZSl9KSl9KSk7dmFyIFlkPXZ0LEhkPVJ0LEtkPVAscWQ9WG4sJGQ9bi5UeXBlRXJyb3IsWGQ9ZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKGUsbixyLGkpe1lkKG4pO3ZhciBvPUhkKGUpLGE9S2QobyksdT1xZChvKSxjPXQ/dS0xOjAsZj10Py0xOjE7aWYocjwyKWZvcig7Oyl7aWYoYyBpbiBhKXtpPWFbY10sYys9ZjticmVha31pZihjKz1mLHQ/YzwwOnU8PWMpdGhyb3cgJGQoIlJlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUiKX1mb3IoO3Q/Yz49MDp1PmM7Yys9ZiljIGluIGEmJihpPW4oaSxhW2NdLGMsbykpO3JldHVybiBpfX0sSmQ9e2xlZnQ6WGQoITEpLHJpZ2h0OlhkKCEwKX0sUWQ9SmQubGVmdCxaZD1kZi5hVHlwZWRBcnJheTsoMCxkZi5leHBvcnRUeXBlZEFycmF5TWV0aG9kKSgicmVkdWNlIiwoZnVuY3Rpb24odCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aDtyZXR1cm4gUWQoWmQodGhpcyksdCxlLGU+MT9hcmd1bWVudHNbMV06dm9pZCAwKX0pKTt2YXIgdGg9SmQucmlnaHQsZWg9ZGYuYVR5cGVkQXJyYXk7KDAsZGYuZXhwb3J0VHlwZWRBcnJheU1ldGhvZCkoInJlZHVjZVJpZ2h0IiwoZnVuY3Rpb24odCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aDtyZXR1cm4gdGgoZWgodGhpcyksdCxlLGU+MT9hcmd1bWVudHNbMV06dm9pZCAwKX0pKTt2YXIgbmg9ZGYuYVR5cGVkQXJyYXkscmg9ZGYuZXhwb3J0VHlwZWRBcnJheU1ldGhvZCxpaD1NYXRoLmZsb29yO3JoKCJyZXZlcnNlIiwoZnVuY3Rpb24oKXtmb3IodmFyIHQsZT10aGlzLG49bmgoZSkubGVuZ3RoLHI9aWgobi8yKSxpPTA7aTxyOyl0PWVbaV0sZVtpKytdPWVbLS1uXSxlW25dPXQ7cmV0dXJuIGV9KSk7dmFyIG9oPW4sYWg9Zix1aD1kZixjaD1YbixmaD1UZixzaD1SdCxsaD1pLGRoPW9oLlJhbmdlRXJyb3IsaGg9b2guSW50OEFycmF5LHBoPWhoJiZoaC5wcm90b3R5cGUsdmg9cGgmJnBoLnNldCx5aD11aC5hVHlwZWRBcnJheSxfaD11aC5leHBvcnRUeXBlZEFycmF5TWV0aG9kLGdoPSFsaCgoZnVuY3Rpb24oKXt2YXIgdD1uZXcgVWludDhDbGFtcGVkQXJyYXkoMik7cmV0dXJuIGFoKHZoLHQse2xlbmd0aDoxLDA6M30sMSksMyE9PXRbMV19KSksYmg9Z2gmJnVoLk5BVElWRV9BUlJBWV9CVUZGRVJfVklFV1MmJmxoKChmdW5jdGlvbigpe3ZhciB0PW5ldyBoaCgyKTtyZXR1cm4gdC5zZXQoMSksdC5zZXQoIjIiLDEpLDAhPT10WzBdfHwyIT09dFsxXX0pKTtfaCgic2V0IiwoZnVuY3Rpb24odCl7eWgodGhpcyk7dmFyIGU9ZmgoYXJndW1lbnRzLmxlbmd0aD4xP2FyZ3VtZW50c1sxXTp2b2lkIDAsMSksbj1zaCh0KTtpZihnaClyZXR1cm4gYWgodmgsdGhpcyxuLGUpO3ZhciByPXRoaXMubGVuZ3RoLGk9Y2gobiksbz0wO2lmKGkrZT5yKXRocm93IGRoKCJXcm9uZyBsZW5ndGgiKTtmb3IoO288aTspdGhpc1tlK29dPW5bbysrXX0pLCFnaHx8YmgpO3ZhciB3aD1tKFtdLnNsaWNlKSx4aD1WbCxtaD13aCxraD1kZi5hVHlwZWRBcnJheTsoMCxkZi5leHBvcnRUeXBlZEFycmF5TWV0aG9kKSgic2xpY2UiLChmdW5jdGlvbih0LGUpe2Zvcih2YXIgbj1taChraCh0aGlzKSx0LGUpLHI9eGgodGhpcyksaT0wLG89bi5sZW5ndGgsYT1uZXcgcihvKTtvPmk7KWFbaV09bltpKytdO3JldHVybiBhfSksaSgoZnVuY3Rpb24oKXtuZXcgSW50OEFycmF5KDEpLnNsaWNlKCl9KSkpO3ZhciBBaD13cy5zb21lLFNoPWRmLmFUeXBlZEFycmF5OygwLGRmLmV4cG9ydFR5cGVkQXJyYXlNZXRob2QpKCJzb21lIiwoZnVuY3Rpb24odCl7cmV0dXJuIEFoKFNoKHRoaXMpLHQsYXJndW1lbnRzLmxlbmd0aD4xP2FyZ3VtZW50c1sxXTp2b2lkIDApfSkpO3ZhciBFaD1OYSxUaD1NYXRoLmZsb29yLE9oPWZ1bmN0aW9uKHQsZSl7dmFyIG49dC5sZW5ndGgscj1UaChuLzIpO3JldHVybiBuPDg/amgodCxlKTpJaCh0LE9oKEVoKHQsMCxyKSxlKSxPaChFaCh0LHIpLGUpLGUpfSxqaD1mdW5jdGlvbih0LGUpe2Zvcih2YXIgbixyLGk9dC5sZW5ndGgsbz0xO288aTspe2ZvcihyPW8sbj10W29dO3ImJmUodFtyLTFdLG4pPjA7KXRbcl09dFstLXJdO3IhPT1vKysmJih0W3JdPW4pfXJldHVybiB0fSxJaD1mdW5jdGlvbih0LGUsbixyKXtmb3IodmFyIGk9ZS5sZW5ndGgsbz1uLmxlbmd0aCxhPTAsdT0wO2E8aXx8dTxvOyl0W2ErdV09YTxpJiZ1PG8/cihlW2FdLG5bdV0pPD0wP2VbYSsrXTpuW3UrK106YTxpP2VbYSsrXTpuW3UrK107cmV0dXJuIHR9LFJoPU9oLFBoPUgubWF0Y2goL2ZpcmVmb3hcLyhcZCspL2kpLE1oPSEhUGgmJitQaFsxXSxMaD0vTVNJRXxUcmlkZW50Ly50ZXN0KEgpLFVoPUgubWF0Y2goL0FwcGxlV2ViS2l0XC8oXGQrKVwuLyksQ2g9ISFVaCYmK1VoWzFdLEZoPW4sQmg9bSxOaD1pLERoPXZ0LHpoPVJoLEdoPWRmLFZoPU1oLFdoPUxoLFloPVosSGg9Q2gsS2g9RmguQXJyYXkscWg9R2guYVR5cGVkQXJyYXksJGg9R2guZXhwb3J0VHlwZWRBcnJheU1ldGhvZCxYaD1GaC5VaW50MTZBcnJheSxKaD1YaCYmQmgoWGgucHJvdG90eXBlLnNvcnQpLFFoPSEoIUpofHxOaCgoZnVuY3Rpb24oKXtKaChuZXcgWGgoMiksbnVsbCl9KSkmJk5oKChmdW5jdGlvbigpe0poKG5ldyBYaCgyKSx7fSl9KSkpLFpoPSEhSmgmJiFOaCgoZnVuY3Rpb24oKXtpZihZaClyZXR1cm4gWWg8NzQ7aWYoVmgpcmV0dXJuIFZoPDY3O2lmKFdoKXJldHVybiEwO2lmKEhoKXJldHVybiBIaDw2MDI7dmFyIHQsZSxuPW5ldyBYaCg1MTYpLHI9S2goNTE2KTtmb3IodD0wO3Q8NTE2O3QrKyllPXQlNCxuW3RdPTUxNS10LHJbdF09dC0yKmUrMztmb3IoSmgobiwoZnVuY3Rpb24odCxlKXtyZXR1cm4odC80fDApLShlLzR8MCl9KSksdD0wO3Q8NTE2O3QrKylpZihuW3RdIT09clt0XSlyZXR1cm4hMH0pKTskaCgic29ydCIsKGZ1bmN0aW9uKHQpe3JldHVybiB2b2lkIDAhPT10JiZEaCh0KSxaaD9KaCh0aGlzLHQpOnpoKHFoKHRoaXMpLGZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihlLG4pe3JldHVybiB2b2lkIDAhPT10Pyt0KGUsbil8fDA6biE9bj8tMTplIT1lPzE6MD09PWUmJjA9PT1uPzEvZT4wJiYxL248MD8xOi0xOmU+bn19KHQpKX0pLCFaaHx8UWgpO3ZhciB0cD1xbixlcD1ZbixucD1WbCxycD1kZi5hVHlwZWRBcnJheTsoMCxkZi5leHBvcnRUeXBlZEFycmF5TWV0aG9kKSgic3ViYXJyYXkiLChmdW5jdGlvbih0LGUpe3ZhciBuPXJwKHRoaXMpLHI9bi5sZW5ndGgsaT1lcCh0LHIpO3JldHVybiBuZXcobnAobikpKG4uYnVmZmVyLG4uYnl0ZU9mZnNldCtpKm4uQllURVNfUEVSX0VMRU1FTlQsdHAoKHZvaWQgMD09PWU/cjplcChlLHIpKS1pKSl9KSk7dmFyIGlwPU9kLG9wPWRmLGFwPWksdXA9d2gsY3A9bi5JbnQ4QXJyYXksZnA9b3AuYVR5cGVkQXJyYXksc3A9b3AuZXhwb3J0VHlwZWRBcnJheU1ldGhvZCxscD1bXS50b0xvY2FsZVN0cmluZyxkcD0hIWNwJiZhcCgoZnVuY3Rpb24oKXtscC5jYWxsKG5ldyBjcCgxKSl9KSk7c3AoInRvTG9jYWxlU3RyaW5nIiwoZnVuY3Rpb24oKXtyZXR1cm4gaXAobHAsZHA/dXAoZnAodGhpcykpOmZwKHRoaXMpLHVwKGFyZ3VtZW50cykpfSksYXAoKGZ1bmN0aW9uKCl7cmV0dXJuWzEsMl0udG9Mb2NhbGVTdHJpbmcoKSE9bmV3IGNwKFsxLDJdKS50b0xvY2FsZVN0cmluZygpfSkpfHwhYXAoKGZ1bmN0aW9uKCl7Y3AucHJvdG90eXBlLnRvTG9jYWxlU3RyaW5nLmNhbGwoWzEsMl0pfSkpKTt2YXIgaHA9ZGYuZXhwb3J0VHlwZWRBcnJheU1ldGhvZCxwcD1pLHZwPW0seXA9bi5VaW50OEFycmF5LF9wPXlwJiZ5cC5wcm90b3R5cGV8fHt9LGdwPVtdLnRvU3RyaW5nLGJwPXZwKFtdLmpvaW4pO3BwKChmdW5jdGlvbigpe2dwLmNhbGwoe30pfSkpJiYoZ3A9ZnVuY3Rpb24oKXtyZXR1cm4gYnAodGhpcyl9KTt2YXIgd3A9X3AudG9TdHJpbmchPWdwO2hwKCJ0b1N0cmluZyIsZ3Asd3ApO3ZhciB4cCxtcCxrcCxBcCxTcD1uLlByb21pc2UsRXA9ZixUcD1qZSxPcD1fdCxqcD1mdW5jdGlvbih0LGUsbil7dmFyIHIsaTtUcCh0KTt0cnl7aWYoIShyPU9wKHQsInJldHVybiIpKSl7aWYoInRocm93Ij09PWUpdGhyb3cgbjtyZXR1cm4gbn1yPUVwKHIsdCl9Y2F0Y2godCl7aT0hMCxyPXR9aWYoInRocm93Ij09PWUpdGhyb3cgbjtpZihpKXRocm93IHI7cmV0dXJuIFRwKHIpLG59LElwPVJmLFJwPWYsUHA9amUsTXA9bHQsTHA9S2YsVXA9WG4sQ3A9WSxGcD1WZixCcD1DZixOcD1qcCxEcD1uLlR5cGVFcnJvcix6cD1mdW5jdGlvbih0LGUpe3RoaXMuc3RvcHBlZD10LHRoaXMucmVzdWx0PWV9LEdwPXpwLnByb3RvdHlwZSxWcD0vKD86aXBhZHxpcGhvbmV8aXBvZCkuKmFwcGxld2Via2l0L2kudGVzdChIKSxXcD0icHJvY2VzcyI9PUUobi5wcm9jZXNzKSxZcD1uLEhwPU9kLEtwPVJmLHFwPUIsJHA9THQsWHA9aSxKcD1qaSxRcD13aCxacD1sZSx0dj1WcCxldj1XcCxudj1ZcC5zZXRJbW1lZGlhdGUscnY9WXAuY2xlYXJJbW1lZGlhdGUsaXY9WXAucHJvY2Vzcyxvdj1ZcC5EaXNwYXRjaCxhdj1ZcC5GdW5jdGlvbix1dj1ZcC5NZXNzYWdlQ2hhbm5lbCxjdj1ZcC5TdHJpbmcsZnY9MCxzdj17fTt0cnl7eHA9WXAubG9jYXRpb259Y2F0Y2godCl7fXZhciBsdj1mdW5jdGlvbih0KXtpZigkcChzdix0KSl7dmFyIGU9c3ZbdF07ZGVsZXRlIHN2W3RdLGUoKX19LGR2PWZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbigpe2x2KHQpfX0saHY9ZnVuY3Rpb24odCl7bHYodC5kYXRhKX0scHY9ZnVuY3Rpb24odCl7WXAucG9zdE1lc3NhZ2UoY3YodCkseHAucHJvdG9jb2wrIi8vIit4cC5ob3N0KX07bnYmJnJ2fHwobnY9ZnVuY3Rpb24odCl7dmFyIGU9UXAoYXJndW1lbnRzLDEpO3JldHVybiBzdlsrK2Z2XT1mdW5jdGlvbigpe0hwKHFwKHQpP3Q6YXYodCksdm9pZCAwLGUpfSxtcChmdiksZnZ9LHJ2PWZ1bmN0aW9uKHQpe2RlbGV0ZSBzdlt0XX0sZXY/bXA9ZnVuY3Rpb24odCl7aXYubmV4dFRpY2soZHYodCkpfTpvdiYmb3Yubm93P21wPWZ1bmN0aW9uKHQpe292Lm5vdyhkdih0KSl9OnV2JiYhdHY/KEFwPShrcD1uZXcgdXYpLnBvcnQyLGtwLnBvcnQxLm9ubWVzc2FnZT1odixtcD1LcChBcC5wb3N0TWVzc2FnZSxBcCkpOllwLmFkZEV2ZW50TGlzdGVuZXImJnFwKFlwLnBvc3RNZXNzYWdlKSYmIVlwLmltcG9ydFNjcmlwdHMmJnhwJiYiZmlsZToiIT09eHAucHJvdG9jb2wmJiFYcChwdik/KG1wPXB2LFlwLmFkZEV2ZW50TGlzdGVuZXIoIm1lc3NhZ2UiLGh2LCExKSk6bXA9Im9ucmVhZHlzdGF0ZWNoYW5nZSJpbiBacCgic2NyaXB0Iik/ZnVuY3Rpb24odCl7SnAuYXBwZW5kQ2hpbGQoWnAoInNjcmlwdCIpKS5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXtKcC5yZW1vdmVDaGlsZCh0aGlzKSxsdih0KX19OmZ1bmN0aW9uKHQpe3NldFRpbWVvdXQoZHYodCksMCl9KTt2YXIgdnYseXYsX3YsZ3YsYnYsd3YseHYsbXYsa3Y9e3NldDpudixjbGVhcjpydn0sQXY9bixTdj0vaXBhZHxpcGhvbmV8aXBvZC9pLnRlc3QoSCkmJnZvaWQgMCE9PUF2LlBlYmJsZSxFdj0vd2ViMHMoPyEuKmNocm9tZSkvaS50ZXN0KEgpLFR2PW4sT3Y9UmYsanY9ci5mLEl2PWt2LnNldCxSdj1WcCxQdj1TdixNdj1FdixMdj1XcCxVdj1Udi5NdXRhdGlvbk9ic2VydmVyfHxUdi5XZWJLaXRNdXRhdGlvbk9ic2VydmVyLEN2PVR2LmRvY3VtZW50LEZ2PVR2LnByb2Nlc3MsQnY9VHYuUHJvbWlzZSxOdj1qdihUdiwicXVldWVNaWNyb3Rhc2siKSxEdj1OdiYmTnYudmFsdWU7RHZ8fCh2dj1mdW5jdGlvbigpe3ZhciB0LGU7Zm9yKEx2JiYodD1Gdi5kb21haW4pJiZ0LmV4aXQoKTt5djspe2U9eXYuZm4seXY9eXYubmV4dDt0cnl7ZSgpfWNhdGNoKHQpe3Rocm93IHl2P2d2KCk6X3Y9dm9pZCAwLHR9fV92PXZvaWQgMCx0JiZ0LmVudGVyKCl9LFJ2fHxMdnx8TXZ8fCFVdnx8IUN2PyFQdiYmQnYmJkJ2LnJlc29sdmU/KCh4dj1Cdi5yZXNvbHZlKHZvaWQgMCkpLmNvbnN0cnVjdG9yPUJ2LG12PU92KHh2LnRoZW4seHYpLGd2PWZ1bmN0aW9uKCl7bXYodnYpfSk6THY/Z3Y9ZnVuY3Rpb24oKXtGdi5uZXh0VGljayh2dil9OihJdj1PdihJdixUdiksZ3Y9ZnVuY3Rpb24oKXtJdih2dil9KTooYnY9ITAsd3Y9Q3YuY3JlYXRlVGV4dE5vZGUoIiIpLG5ldyBVdih2dikub2JzZXJ2ZSh3dix7Y2hhcmFjdGVyRGF0YTohMH0pLGd2PWZ1bmN0aW9uKCl7d3YuZGF0YT1idj0hYnZ9KSk7dmFyIHp2PUR2fHxmdW5jdGlvbih0KXt2YXIgZT17Zm46dCxuZXh0OnZvaWQgMH07X3YmJihfdi5uZXh0PWUpLHl2fHwoeXY9ZSxndigpKSxfdj1lfSxHdj17fSxWdj12dCxXdj1mdW5jdGlvbih0KXt2YXIgZSxuO3RoaXMucHJvbWlzZT1uZXcgdCgoZnVuY3Rpb24odCxyKXtpZih2b2lkIDAhPT1lfHx2b2lkIDAhPT1uKXRocm93IFR5cGVFcnJvcigiQmFkIFByb21pc2UgY29uc3RydWN0b3IiKTtlPXQsbj1yfSkpLHRoaXMucmVzb2x2ZT1WdihlKSx0aGlzLnJlamVjdD1WdihuKX07R3YuZj1mdW5jdGlvbih0KXtyZXR1cm4gbmV3IFd2KHQpfTt2YXIgWXY9amUsSHY9RCxLdj1Hdixxdj1uLCR2PWZ1bmN0aW9uKCl7dGhpcy5oZWFkPW51bGwsdGhpcy50YWlsPW51bGx9OyR2LnByb3RvdHlwZT17YWRkOmZ1bmN0aW9uKHQpe3ZhciBlPXtpdGVtOnQsbmV4dDpudWxsfTt0aGlzLmhlYWQ/dGhpcy50YWlsLm5leHQ9ZTp0aGlzLmhlYWQ9ZSx0aGlzLnRhaWw9ZX0sZ2V0OmZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5oZWFkO2lmKHQpcmV0dXJuIHRoaXMuaGVhZD10Lm5leHQsdGhpcy50YWlsPT09dCYmKHRoaXMudGFpbD1udWxsKSx0Lml0ZW19fTt2YXIgWHYsSnYsUXYsWnYsdHk9JHYsZXk9Im9iamVjdCI9PXR5cGVvZiB3aW5kb3csbnk9TnIscnk9bixpeT1XLG95PWYsYXk9U3AsdXk9emUuZXhwb3J0cyxjeT1sYSxmeT1NbyxzeT1ibyxseT1TcyxkeT12dCxoeT1CLHB5PUQsdnk9cGEseXk9cWUsX3k9ZnVuY3Rpb24odCxlLG4pe3ZhciByLGksbyxhLHUsYyxmLHM9biYmbi50aGF0LGw9ISghbnx8IW4uQVNfRU5UUklFUyksZD0hKCFufHwhbi5JU19JVEVSQVRPUiksaD0hKCFufHwhbi5JTlRFUlJVUFRFRCkscD1JcChlLHMpLHY9ZnVuY3Rpb24odCl7cmV0dXJuIHImJk5wKHIsIm5vcm1hbCIsdCksbmV3IHpwKCEwLHQpfSx5PWZ1bmN0aW9uKHQpe3JldHVybiBsPyhQcCh0KSxoP3AodFswXSx0WzFdLHYpOnAodFswXSx0WzFdKSk6aD9wKHQsdik6cCh0KX07aWYoZClyPXQ7ZWxzZXtpZighKGk9QnAodCkpKXRocm93IERwKE1wKHQpKyIgaXMgbm90IGl0ZXJhYmxlIik7aWYoTHAoaSkpe2ZvcihvPTAsYT1VcCh0KTthPm87bysrKWlmKCh1PXkodFtvXSkpJiZDcChHcCx1KSlyZXR1cm4gdTtyZXR1cm4gbmV3IHpwKCExKX1yPUZwKHQsaSl9Zm9yKGM9ci5uZXh0OyEoZj1ScChjLHIpKS5kb25lOyl7dHJ5e3U9eShmLnZhbHVlKX1jYXRjaCh0KXtOcChyLCJ0aHJvdyIsdCl9aWYoIm9iamVjdCI9PXR5cGVvZiB1JiZ1JiZDcChHcCx1KSlyZXR1cm4gdX1yZXR1cm4gbmV3IHpwKCExKX0sZ3k9UGMsYnk9b2Msd3k9a3Yuc2V0LHh5PXp2LG15PWZ1bmN0aW9uKHQsZSl7aWYoWXYodCksSHYoZSkmJmUuY29uc3RydWN0b3I9PT10KXJldHVybiBlO3ZhciBuPUt2LmYodCk7cmV0dXJuKDAsbi5yZXNvbHZlKShlKSxuLnByb21pc2V9LGt5PWZ1bmN0aW9uKHQsZSl7dmFyIG49cXYuY29uc29sZTtuJiZuLmVycm9yJiYoMT09YXJndW1lbnRzLmxlbmd0aD9uLmVycm9yKHQpOm4uZXJyb3IodCxlKSl9LEF5PUd2LFN5PWZ1bmN0aW9uKHQpe3RyeXtyZXR1cm57ZXJyb3I6ITEsdmFsdWU6dCgpfX1jYXRjaCh0KXtyZXR1cm57ZXJyb3I6ITAsdmFsdWU6dH19fSxFeT10eSxUeT14bixPeT1ScixqeT1leSxJeT1XcCxSeT1aLFB5PVh0KCJzcGVjaWVzIiksTXk9IlByb21pc2UiLEx5PVR5LmdldHRlckZvcihNeSksVXk9VHkuc2V0LEN5PVR5LmdldHRlckZvcihNeSksRnk9YXkmJmF5LnByb3RvdHlwZSxCeT1heSxOeT1GeSxEeT1yeS5UeXBlRXJyb3Isenk9cnkuZG9jdW1lbnQsR3k9cnkucHJvY2VzcyxWeT1BeS5mLFd5PVZ5LFl5PSEhKHp5JiZ6eS5jcmVhdGVFdmVudCYmcnkuZGlzcGF0Y2hFdmVudCksSHk9aHkocnkuUHJvbWlzZVJlamVjdGlvbkV2ZW50KSxLeT0hMSxxeT1PeShNeSwoZnVuY3Rpb24oKXt2YXIgdD15eShCeSksZT10IT09U3RyaW5nKEJ5KTtpZighZSYmNjY9PT1SeSlyZXR1cm4hMDtpZihSeT49NTEmJi9uYXRpdmUgY29kZS8udGVzdCh0KSlyZXR1cm4hMTt2YXIgbj1uZXcgQnkoKGZ1bmN0aW9uKHQpe3QoMSl9KSkscj1mdW5jdGlvbih0KXt0KChmdW5jdGlvbigpe30pLChmdW5jdGlvbigpe30pKX07cmV0dXJuKG4uY29uc3RydWN0b3I9e30pW1B5XT1yLCEoS3k9bi50aGVuKChmdW5jdGlvbigpe30pKWluc3RhbmNlb2Ygcil8fCFlJiZqeSYmIUh5fSkpLCR5PXF5fHwhZ3koKGZ1bmN0aW9uKHQpe0J5LmFsbCh0KS5jYXRjaCgoZnVuY3Rpb24oKXt9KSl9KSksWHk9ZnVuY3Rpb24odCl7dmFyIGU7cmV0dXJuISghcHkodCl8fCFoeShlPXQudGhlbikpJiZlfSxKeT1mdW5jdGlvbih0LGUpe3ZhciBuLHIsaSxvPWUudmFsdWUsYT0xPT1lLnN0YXRlLHU9YT90Lm9rOnQuZmFpbCxjPXQucmVzb2x2ZSxmPXQucmVqZWN0LHM9dC5kb21haW47dHJ5e3U/KGF8fCgyPT09ZS5yZWplY3Rpb24mJm5fKGUpLGUucmVqZWN0aW9uPTEpLCEwPT09dT9uPW86KHMmJnMuZW50ZXIoKSxuPXUobykscyYmKHMuZXhpdCgpLGk9ITApKSxuPT09dC5wcm9taXNlP2YoRHkoIlByb21pc2UtY2hhaW4gY3ljbGUiKSk6KHI9WHkobikpP295KHIsbixjLGYpOmMobikpOmYobyl9Y2F0Y2godCl7cyYmIWkmJnMuZXhpdCgpLGYodCl9fSxReT1mdW5jdGlvbih0LGUpe3Qubm90aWZpZWR8fCh0Lm5vdGlmaWVkPSEwLHh5KChmdW5jdGlvbigpe2Zvcih2YXIgbixyPXQucmVhY3Rpb25zO249ci5nZXQoKTspSnkobix0KTt0Lm5vdGlmaWVkPSExLGUmJiF0LnJlamVjdGlvbiYmdF8odCl9KSkpfSxaeT1mdW5jdGlvbih0LGUsbil7dmFyIHIsaTtZeT8oKHI9enkuY3JlYXRlRXZlbnQoIkV2ZW50IikpLnByb21pc2U9ZSxyLnJlYXNvbj1uLHIuaW5pdEV2ZW50KHQsITEsITApLHJ5LmRpc3BhdGNoRXZlbnQocikpOnI9e3Byb21pc2U6ZSxyZWFzb246bn0sIUh5JiYoaT1yeVsib24iK3RdKT9pKHIpOiJ1bmhhbmRsZWRyZWplY3Rpb24iPT09dCYma3koIlVuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbiIsbil9LHRfPWZ1bmN0aW9uKHQpe295KHd5LHJ5LChmdW5jdGlvbigpe3ZhciBlLG49dC5mYWNhZGUscj10LnZhbHVlO2lmKGVfKHQpJiYoZT1TeSgoZnVuY3Rpb24oKXtJeT9HeS5lbWl0KCJ1bmhhbmRsZWRSZWplY3Rpb24iLHIsbik6WnkoInVuaGFuZGxlZHJlamVjdGlvbiIsbixyKX0pKSx0LnJlamVjdGlvbj1JeXx8ZV8odCk/MjoxLGUuZXJyb3IpKXRocm93IGUudmFsdWV9KSl9LGVfPWZ1bmN0aW9uKHQpe3JldHVybiAxIT09dC5yZWplY3Rpb24mJiF0LnBhcmVudH0sbl89ZnVuY3Rpb24odCl7b3kod3kscnksKGZ1bmN0aW9uKCl7dmFyIGU9dC5mYWNhZGU7SXk/R3kuZW1pdCgicmVqZWN0aW9uSGFuZGxlZCIsZSk6WnkoInJlamVjdGlvbmhhbmRsZWQiLGUsdC52YWx1ZSl9KSl9LHJfPWZ1bmN0aW9uKHQsZSxuKXtyZXR1cm4gZnVuY3Rpb24ocil7dChlLHIsbil9fSxpXz1mdW5jdGlvbih0LGUsbil7dC5kb25lfHwodC5kb25lPSEwLG4mJih0PW4pLHQudmFsdWU9ZSx0LnN0YXRlPTIsUXkodCwhMCkpfSxvXz1mdW5jdGlvbih0LGUsbil7aWYoIXQuZG9uZSl7dC5kb25lPSEwLG4mJih0PW4pO3RyeXtpZih0LmZhY2FkZT09PWUpdGhyb3cgRHkoIlByb21pc2UgY2FuJ3QgYmUgcmVzb2x2ZWQgaXRzZWxmIik7dmFyIHI9WHkoZSk7cj94eSgoZnVuY3Rpb24oKXt2YXIgbj17ZG9uZTohMX07dHJ5e295KHIsZSxyXyhvXyxuLHQpLHJfKGlfLG4sdCkpfWNhdGNoKGUpe2lfKG4sZSx0KX19KSk6KHQudmFsdWU9ZSx0LnN0YXRlPTEsUXkodCwhMSkpfWNhdGNoKGUpe2lfKHtkb25lOiExfSxlLHQpfX19O2lmKHF5JiYoTnk9KEJ5PWZ1bmN0aW9uKHQpe3Z5KHRoaXMsTnkpLGR5KHQpLG95KFh2LHRoaXMpO3ZhciBlPUx5KHRoaXMpO3RyeXt0KHJfKG9fLGUpLHJfKGlfLGUpKX1jYXRjaCh0KXtpXyhlLHQpfX0pLnByb3RvdHlwZSwoWHY9ZnVuY3Rpb24odCl7VXkodGhpcyx7dHlwZTpNeSxkb25lOiExLG5vdGlmaWVkOiExLHBhcmVudDohMSxyZWFjdGlvbnM6bmV3IEV5LHJlamVjdGlvbjohMSxzdGF0ZTowLHZhbHVlOnZvaWQgMH0pfSkucHJvdG90eXBlPWN5KE55LHt0aGVuOmZ1bmN0aW9uKHQsZSl7dmFyIG49Q3kodGhpcykscj1WeShieSh0aGlzLEJ5KSk7cmV0dXJuIG4ucGFyZW50PSEwLHIub2s9IWh5KHQpfHx0LHIuZmFpbD1oeShlKSYmZSxyLmRvbWFpbj1JeT9HeS5kb21haW46dm9pZCAwLDA9PW4uc3RhdGU/bi5yZWFjdGlvbnMuYWRkKHIpOnh5KChmdW5jdGlvbigpe0p5KHIsbil9KSksci5wcm9taXNlfSxjYXRjaDpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy50aGVuKHZvaWQgMCx0KX19KSxKdj1mdW5jdGlvbigpe3ZhciB0PW5ldyBYdixlPUx5KHQpO3RoaXMucHJvbWlzZT10LHRoaXMucmVzb2x2ZT1yXyhvXyxlKSx0aGlzLnJlamVjdD1yXyhpXyxlKX0sQXkuZj1WeT1mdW5jdGlvbih0KXtyZXR1cm4gdD09PUJ5fHx0PT09UXY/bmV3IEp2KHQpOld5KHQpfSxoeShheSkmJkZ5IT09T2JqZWN0LnByb3RvdHlwZSkpe1p2PUZ5LnRoZW4sS3l8fCh1eShGeSwidGhlbiIsKGZ1bmN0aW9uKHQsZSl7dmFyIG49dGhpcztyZXR1cm4gbmV3IEJ5KChmdW5jdGlvbih0LGUpe295KFp2LG4sdCxlKX0pKS50aGVuKHQsZSl9KSx7dW5zYWZlOiEwfSksdXkoRnksImNhdGNoIixOeS5jYXRjaCx7dW5zYWZlOiEwfSkpO3RyeXtkZWxldGUgRnkuY29uc3RydWN0b3J9Y2F0Y2godCl7fWZ5JiZmeShGeSxOeSl9bnkoe2dsb2JhbDohMCx3cmFwOiEwLGZvcmNlZDpxeX0se1Byb21pc2U6Qnl9KSxzeShCeSxNeSwhMSksbHkoTXkpLFF2PWl5KE15KSxueSh7dGFyZ2V0Ok15LHN0YXQ6ITAsZm9yY2VkOnF5fSx7cmVqZWN0OmZ1bmN0aW9uKHQpe3ZhciBlPVZ5KHRoaXMpO3JldHVybiBveShlLnJlamVjdCx2b2lkIDAsdCksZS5wcm9taXNlfX0pLG55KHt0YXJnZXQ6TXksc3RhdDohMCxmb3JjZWQ6cXl9LHtyZXNvbHZlOmZ1bmN0aW9uKHQpe3JldHVybiBteSh0aGlzLHQpfX0pLG55KHt0YXJnZXQ6TXksc3RhdDohMCxmb3JjZWQ6JHl9LHthbGw6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcyxuPVZ5KGUpLHI9bi5yZXNvbHZlLGk9bi5yZWplY3Qsbz1TeSgoZnVuY3Rpb24oKXt2YXIgbj1keShlLnJlc29sdmUpLG89W10sYT0wLHU9MTtfeSh0LChmdW5jdGlvbih0KXt2YXIgYz1hKyssZj0hMTt1Kyssb3kobixlLHQpLnRoZW4oKGZ1bmN0aW9uKHQpe2Z8fChmPSEwLG9bY109dCwtLXV8fHIobykpfSksaSl9KSksLS11fHxyKG8pfSkpO3JldHVybiBvLmVycm9yJiZpKG8udmFsdWUpLG4ucHJvbWlzZX0scmFjZTpmdW5jdGlvbih0KXt2YXIgZT10aGlzLG49VnkoZSkscj1uLnJlamVjdCxpPVN5KChmdW5jdGlvbigpe3ZhciBpPWR5KGUucmVzb2x2ZSk7X3kodCwoZnVuY3Rpb24odCl7b3koaSxlLHQpLnRoZW4obi5yZXNvbHZlLHIpfSkpfSkpO3JldHVybiBpLmVycm9yJiZyKGkudmFsdWUpLG4ucHJvbWlzZX19KTt2YXIgYV89byx1Xz1tLGNfPWYsZl89aSxzXz14aSxsXz1scixkXz1zLGhfPVJ0LHBfPVAsdl89T2JqZWN0LmFzc2lnbix5Xz1PYmplY3QuZGVmaW5lUHJvcGVydHksX189dV8oW10uY29uY2F0KSxnXz0hdl98fGZfKChmdW5jdGlvbigpe2lmKGFfJiYxIT09dl8oe2I6MX0sdl8oeV8oe30sImEiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3lfKHRoaXMsImIiLHt2YWx1ZTozLGVudW1lcmFibGU6ITF9KX19KSx7YjoyfSkpLmIpcmV0dXJuITA7dmFyIHQ9e30sZT17fSxuPVN5bWJvbCgpLHI9ImFiY2RlZmdoaWprbG1ub3BxcnN0IjtyZXR1cm4gdFtuXT03LHIuc3BsaXQoIiIpLmZvckVhY2goKGZ1bmN0aW9uKHQpe2VbdF09dH0pKSw3IT12Xyh7fSx0KVtuXXx8c18odl8oe30sZSkpLmpvaW4oIiIpIT1yfSkpP2Z1bmN0aW9uKHQsZSl7Zm9yKHZhciBuPWhfKHQpLHI9YXJndW1lbnRzLmxlbmd0aCxpPTEsbz1sXy5mLGE9ZF8uZjtyPmk7KWZvcih2YXIgdSxjPXBfKGFyZ3VtZW50c1tpKytdKSxmPW8/X18oc18oYyksbyhjKSk6c18oYykscz1mLmxlbmd0aCxsPTA7cz5sOyl1PWZbbCsrXSxhXyYmIWNfKGEsYyx1KXx8KG5bdV09Y1t1XSk7cmV0dXJuIG59OnZfLGJfPWdfO2Z1bmN0aW9uIHdfKHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciByPWVbbl07ci5lbnVtZXJhYmxlPXIuZW51bWVyYWJsZXx8ITEsci5jb25maWd1cmFibGU9ITAsInZhbHVlImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19TnIoe3RhcmdldDoiT2JqZWN0IixzdGF0OiEwLGZvcmNlZDpPYmplY3QuYXNzaWduIT09Yl99LHthc3NpZ246Yl99KTtmb3IodmFyIHhfPVtdLG1fPTA7bV88MjU2O21fKyspe2Zvcih2YXIga189bV8sQV89MDtBXzw4O0FfKyspMSZrXz9rXz1rXz4+PjFeMzk4ODI5MjM4NDprXz4+Pj0xO3hfW21fXT1rX312YXIgU189ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KGUpeyFmdW5jdGlvbih0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbiIpfSh0aGlzLHQpLHRoaXMuY3JjPWV8fC0xfXJldHVybiBmdW5jdGlvbih0LGUsbil7ZSYmd18odC5wcm90b3R5cGUsZSksbiYmd18odCxuKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCwicHJvdG90eXBlIix7d3JpdGFibGU6ITF9KX0odCxbe2tleToiYXBwZW5kIix2YWx1ZTpmdW5jdGlvbih0KXtmb3IodmFyIGU9MHx0aGlzLmNyYyxuPTAscj0wfHQubGVuZ3RoO248cjtuKyspZT1lPj4+OF54X1syNTUmKGVedFtuXSldO3RoaXMuY3JjPWV9fSx7a2V5OiJnZXQiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJufnRoaXMuY3JjfX1dKSx0fSgpLEVfPWxlKCJzcGFuIikuY2xhc3NMaXN0LFRfPUVfJiZFXy5jb25zdHJ1Y3RvciYmRV8uY29uc3RydWN0b3IucHJvdG90eXBlLE9fPVRfPT09T2JqZWN0LnByb3RvdHlwZT92b2lkIDA6VF8sal89bixJXz17Q1NTUnVsZUxpc3Q6MCxDU1NTdHlsZURlY2xhcmF0aW9uOjAsQ1NTVmFsdWVMaXN0OjAsQ2xpZW50UmVjdExpc3Q6MCxET01SZWN0TGlzdDowLERPTVN0cmluZ0xpc3Q6MCxET01Ub2tlbkxpc3Q6MSxEYXRhVHJhbnNmZXJJdGVtTGlzdDowLEZpbGVMaXN0OjAsSFRNTEFsbENvbGxlY3Rpb246MCxIVE1MQ29sbGVjdGlvbjowLEhUTUxGb3JtRWxlbWVudDowLEhUTUxTZWxlY3RFbGVtZW50OjAsTWVkaWFMaXN0OjAsTWltZVR5cGVBcnJheTowLE5hbWVkTm9kZU1hcDowLE5vZGVMaXN0OjEsUGFpbnRSZXF1ZXN0TGlzdDowLFBsdWdpbjowLFBsdWdpbkFycmF5OjAsU1ZHTGVuZ3RoTGlzdDowLFNWR051bWJlckxpc3Q6MCxTVkdQYXRoU2VnTGlzdDowLFNWR1BvaW50TGlzdDowLFNWR1N0cmluZ0xpc3Q6MCxTVkdUcmFuc2Zvcm1MaXN0OjAsU291cmNlQnVmZmVyTGlzdDowLFN0eWxlU2hlZXRMaXN0OjAsVGV4dFRyYWNrQ3VlTGlzdDowLFRleHRUcmFja0xpc3Q6MCxUb3VjaExpc3Q6MH0sUl89T18sUF89dWEsTV89RGUsTF89WHQsVV89TF8oIml0ZXJhdG9yIiksQ189TF8oInRvU3RyaW5nVGFnIiksRl89UF8udmFsdWVzLEJfPWZ1bmN0aW9uKHQsZSl7aWYodCl7aWYodFtVX10hPT1GXyl0cnl7TV8odCxVXyxGXyl9Y2F0Y2goZSl7dFtVX109Rl99aWYodFtDX118fE1fKHQsQ18sZSksSV9bZV0pZm9yKHZhciBuIGluIFBfKWlmKHRbbl0hPT1QX1tuXSl0cnl7TV8odCxuLFBfW25dKX1jYXRjaChlKXt0W25dPVBfW25dfX19O2Zvcih2YXIgTl8gaW4gSV8pQl8oal9bTl9dJiZqX1tOX10ucHJvdG90eXBlLE5fKTtCXyhSXywiRE9NVG9rZW5MaXN0Iik7dmFyIERfPWplLHpfPWpwLEdfPVJmLFZfPWYsV189UnQsWV89ZnVuY3Rpb24odCxlLG4scil7dHJ5e3JldHVybiByP2UoRF8obilbMF0sblsxXSk6ZShuKX1jYXRjaChlKXt6Xyh0LCJ0aHJvdyIsZSl9fSxIXz1LZixLXz1KdSxxXz1YbiwkXz1NYSxYXz1WZixKXz1DZixRXz1uLkFycmF5LFpfPWZ1bmN0aW9uKHQpe3ZhciBlPVdfKHQpLG49S18odGhpcykscj1hcmd1bWVudHMubGVuZ3RoLGk9cj4xP2FyZ3VtZW50c1sxXTp2b2lkIDAsbz12b2lkIDAhPT1pO28mJihpPUdfKGkscj4yP2FyZ3VtZW50c1syXTp2b2lkIDApKTt2YXIgYSx1LGMsZixzLGwsZD1KXyhlKSxoPTA7aWYoIWR8fHRoaXM9PVFfJiZIXyhkKSlmb3IoYT1xXyhlKSx1PW4/bmV3IHRoaXMoYSk6UV8oYSk7YT5oO2grKylsPW8/aShlW2hdLGgpOmVbaF0sJF8odSxoLGwpO2Vsc2UgZm9yKHM9KGY9WF8oZSxkKSkubmV4dCx1PW4/bmV3IHRoaXM6W107IShjPVZfKHMsZikpLmRvbmU7aCsrKWw9bz9ZXyhmLGksW2MudmFsdWUsaF0sITApOmMudmFsdWUsJF8odSxoLGwpO3JldHVybiB1Lmxlbmd0aD1oLHV9O05yKHt0YXJnZXQ6IkFycmF5IixzdGF0OiEwLGZvcmNlZDohUGMoKGZ1bmN0aW9uKHQpe0FycmF5LmZyb20odCl9KSl9LHtmcm9tOlpffSk7dmFyIHRnPW0sZWc9em4sbmc9WnIscmc9TCxpZz10ZygiIi5jaGFyQXQpLG9nPXRnKCIiLmNoYXJDb2RlQXQpLGFnPXRnKCIiLnNsaWNlKSx1Zz1mdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oZSxuKXt2YXIgcixpLG89bmcocmcoZSkpLGE9ZWcobiksdT1vLmxlbmd0aDtyZXR1cm4gYTwwfHxhPj11P3Q/IiI6dm9pZCAwOihyPW9nKG8sYSkpPDU1Mjk2fHxyPjU2MzE5fHxhKzE9PT11fHwoaT1vZyhvLGErMSkpPDU2MzIwfHxpPjU3MzQzP3Q/aWcobyxhKTpyOnQ/YWcobyxhLGErMik6aS01NjMyMCsoci01NTI5Njw8MTApKzY1NTM2fX0sY2c9e2NvZGVBdDp1ZyghMSksY2hhckF0OnVnKCEwKX0uY2hhckF0LGZnPVpyLHNnPXhuLGxnPUpvLGRnPXNnLnNldCxoZz1zZy5nZXR0ZXJGb3IoIlN0cmluZyBJdGVyYXRvciIpO2Z1bmN0aW9uIHBnKHQpe2lmKCJ1bmRlZmluZWQiPT10eXBlb2YgVGV4dEVuY29kZXIpe3Q9dW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHQpKTtmb3IodmFyIGU9bmV3IFVpbnQ4QXJyYXkodC5sZW5ndGgpLG49MDtuPGUubGVuZ3RoO24rKyllW25dPXQuY2hhckNvZGVBdChuKTtyZXR1cm4gZX1yZXR1cm4obmV3IFRleHRFbmNvZGVyKS5lbmNvZGUodCl9bGcoU3RyaW5nLCJTdHJpbmciLChmdW5jdGlvbih0KXtkZyh0aGlzLHt0eXBlOiJTdHJpbmcgSXRlcmF0b3IiLHN0cmluZzpmZyh0KSxpbmRleDowfSl9KSwoZnVuY3Rpb24oKXt2YXIgdCxlPWhnKHRoaXMpLG49ZS5zdHJpbmcscj1lLmluZGV4O3JldHVybiByPj1uLmxlbmd0aD97dmFsdWU6dm9pZCAwLGRvbmU6ITB9Oih0PWNnKG4sciksZS5pbmRleCs9dC5sZW5ndGgse3ZhbHVlOnQsZG9uZTohMX0pfSkpO3ZhciB2Zz1pLHlnPVosX2c9WHQoInNwZWNpZXMiKSxnZz1mdW5jdGlvbih0KXtyZXR1cm4geWc+PTUxfHwhdmcoKGZ1bmN0aW9uKCl7dmFyIGU9W107cmV0dXJuKGUuY29uc3RydWN0b3I9e30pW19nXT1mdW5jdGlvbigpe3JldHVybntmb286MX19LDEhPT1lW3RdKEJvb2xlYW4pLmZvb30pKX0sYmc9TnIsd2c9bix4Zz1pLG1nPWlzLGtnPUQsQWc9UnQsU2c9WG4sRWc9TWEsVGc9ZHMsT2c9Z2csamc9WixJZz1YdCgiaXNDb25jYXRTcHJlYWRhYmxlIiksUmc9d2cuVHlwZUVycm9yLFBnPWpnPj01MXx8IXhnKChmdW5jdGlvbigpe3ZhciB0PVtdO3JldHVybiB0W0lnXT0hMSx0LmNvbmNhdCgpWzBdIT09dH0pKSxNZz1PZygiY29uY2F0IiksTGc9ZnVuY3Rpb24odCl7aWYoIWtnKHQpKXJldHVybiExO3ZhciBlPXRbSWddO3JldHVybiB2b2lkIDAhPT1lPyEhZTptZyh0KX07Ymcoe3RhcmdldDoiQXJyYXkiLHByb3RvOiEwLGZvcmNlZDohUGd8fCFNZ30se2NvbmNhdDpmdW5jdGlvbih0KXt2YXIgZSxuLHIsaSxvLGE9QWcodGhpcyksdT1UZyhhLDApLGM9MDtmb3IoZT0tMSxyPWFyZ3VtZW50cy5sZW5ndGg7ZTxyO2UrKylpZihMZyhvPS0xPT09ZT9hOmFyZ3VtZW50c1tlXSkpe2lmKGMrKGk9U2cobykpPjkwMDcxOTkyNTQ3NDA5OTEpdGhyb3cgUmcoIk1heGltdW0gYWxsb3dlZCBpbmRleCBleGNlZWRlZCIpO2ZvcihuPTA7bjxpO24rKyxjKyspbiBpbiBvJiZFZyh1LGMsb1tuXSl9ZWxzZXtpZihjPj05MDA3MTk5MjU0NzQwOTkxKXRocm93IFJnKCJNYXhpbXVtIGFsbG93ZWQgaW5kZXggZXhjZWVkZWQiKTtFZyh1LGMrKyxvKX1yZXR1cm4gdS5sZW5ndGg9Yyx1fX0pO3ZhciBVZz1OcixDZz1uLEZnPWlzLEJnPUp1LE5nPUQsRGc9WW4semc9WG4sR2c9RixWZz1NYSxXZz1YdCxZZz13aCxIZz1nZygic2xpY2UiKSxLZz1XZygic3BlY2llcyIpLHFnPUNnLkFycmF5LCRnPU1hdGgubWF4O1VnKHt0YXJnZXQ6IkFycmF5Iixwcm90bzohMCxmb3JjZWQ6IUhnfSx7c2xpY2U6ZnVuY3Rpb24odCxlKXt2YXIgbixyLGksbz1HZyh0aGlzKSxhPXpnKG8pLHU9RGcodCxhKSxjPURnKHZvaWQgMD09PWU/YTplLGEpO2lmKEZnKG8pJiYobj1vLmNvbnN0cnVjdG9yLChCZyhuKSYmKG49PT1xZ3x8Rmcobi5wcm90b3R5cGUpKXx8TmcobikmJm51bGw9PT0obj1uW0tnXSkpJiYobj12b2lkIDApLG49PT1xZ3x8dm9pZCAwPT09bikpcmV0dXJuIFlnKG8sdSxjKTtmb3Iocj1uZXcodm9pZCAwPT09bj9xZzpuKSgkZyhjLXUsMCkpLGk9MDt1PGM7dSsrLGkrKyl1IGluIG8mJlZnKHIsaSxvW3VdKTtyZXR1cm4gci5sZW5ndGg9aSxyfX0pLCgwLEFjLmV4cG9ydHMpKCJVaW50MzIiLChmdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oZSxuLHIpe3JldHVybiB0KHRoaXMsZSxuLHIpfX0pKTt2YXIgWGc9TnIsSmc9bixRZz1ZbixaZz16bix0Yj1YbixlYj1SdCxuYj1kcyxyYj1NYSxpYj1nZygic3BsaWNlIiksb2I9SmcuVHlwZUVycm9yLGFiPU1hdGgubWF4LHViPU1hdGgubWluO2Z1bmN0aW9uIGNiKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcigiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uIil9ZnVuY3Rpb24gZmIodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIHI9ZVtuXTtyLmVudW1lcmFibGU9ci5lbnVtZXJhYmxlfHwhMSxyLmNvbmZpZ3VyYWJsZT0hMCwidmFsdWUiaW4gciYmKHIud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LHIua2V5LHIpfX1mdW5jdGlvbiBzYih0LGUsbil7cmV0dXJuIGUmJmZiKHQucHJvdG90eXBlLGUpLG4mJmZiKHQsbiksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsInByb3RvdHlwZSIse3dyaXRhYmxlOiExfSksdH1YZyh7dGFyZ2V0OiJBcnJheSIscHJvdG86ITAsZm9yY2VkOiFpYn0se3NwbGljZTpmdW5jdGlvbih0LGUpe3ZhciBuLHIsaSxvLGEsdSxjPWViKHRoaXMpLGY9dGIoYykscz1RZyh0LGYpLGw9YXJndW1lbnRzLmxlbmd0aDtpZigwPT09bD9uPXI9MDoxPT09bD8obj0wLHI9Zi1zKToobj1sLTIscj11YihhYihaZyhlKSwwKSxmLXMpKSxmK24tcj45MDA3MTk5MjU0NzQwOTkxKXRocm93IG9iKCJNYXhpbXVtIGFsbG93ZWQgbGVuZ3RoIGV4Y2VlZGVkIik7Zm9yKGk9bmIoYyxyKSxvPTA7bzxyO28rKykoYT1zK28paW4gYyYmcmIoaSxvLGNbYV0pO2lmKGkubGVuZ3RoPXIsbjxyKXtmb3Iobz1zO288Zi1yO28rKyl1PW8rbiwoYT1vK3IpaW4gYz9jW3VdPWNbYV06ZGVsZXRlIGNbdV07Zm9yKG89ZjtvPmYtcituO28tLSlkZWxldGUgY1tvLTFdfWVsc2UgaWYobj5yKWZvcihvPWYtcjtvPnM7by0tKXU9bytuLTEsKGE9bytyLTEpaW4gYz9jW3VdPWNbYV06ZGVsZXRlIGNbdV07Zm9yKG89MDtvPG47bysrKWNbbytzXT1hcmd1bWVudHNbbysyXTtyZXR1cm4gYy5sZW5ndGg9Zi1yK24saX19KTt2YXIgbGI9e2NvbmNhdDpmdW5jdGlvbih0LGUpe2lmKDA9PT10Lmxlbmd0aHx8MD09PWUubGVuZ3RoKXJldHVybiB0LmNvbmNhdChlKTt2YXIgbj10W3QubGVuZ3RoLTFdLHI9bGIuZ2V0UGFydGlhbChuKTtyZXR1cm4gMzI9PT1yP3QuY29uY2F0KGUpOmxiLl9zaGlmdFJpZ2h0KGUsciwwfG4sdC5zbGljZSgwLHQubGVuZ3RoLTEpKX0sYml0TGVuZ3RoOmZ1bmN0aW9uKHQpe3ZhciBlPXQubGVuZ3RoO2lmKDA9PT1lKXJldHVybiAwO3ZhciBuPXRbZS0xXTtyZXR1cm4gMzIqKGUtMSkrbGIuZ2V0UGFydGlhbChuKX0sY2xhbXA6ZnVuY3Rpb24odCxlKXtpZigzMip0Lmxlbmd0aDxlKXJldHVybiB0O3ZhciBuPSh0PXQuc2xpY2UoMCxNYXRoLmNlaWwoZS8zMikpKS5sZW5ndGg7cmV0dXJuIGUmPTMxLG4+MCYmZSYmKHRbbi0xXT1sYi5wYXJ0aWFsKGUsdFtuLTFdJjIxNDc0ODM2NDg+PmUtMSwxKSksdH0scGFydGlhbDpmdW5jdGlvbih0LGUsbil7cmV0dXJuIDMyPT09dD9lOihuPzB8ZTplPDwzMi10KSsxMDk5NTExNjI3Nzc2KnR9LGdldFBhcnRpYWw6ZnVuY3Rpb24odCl7cmV0dXJuIE1hdGgucm91bmQodC8xMDk5NTExNjI3Nzc2KXx8MzJ9LF9zaGlmdFJpZ2h0OmZ1bmN0aW9uKHQsZSxuLHIpe2Zvcih2b2lkIDA9PT1yJiYocj1bXSk7ZT49MzI7ZS09MzIpci5wdXNoKG4pLG49MDtpZigwPT09ZSlyZXR1cm4gci5jb25jYXQodCk7Zm9yKHZhciBpPTA7aTx0Lmxlbmd0aDtpKyspci5wdXNoKG58dFtpXT4+PmUpLG49dFtpXTw8MzItZTt2YXIgbz10Lmxlbmd0aD90W3QubGVuZ3RoLTFdOjAsYT1sYi5nZXRQYXJ0aWFsKG8pO3JldHVybiByLnB1c2gobGIucGFydGlhbChlK2EmMzEsZSthPjMyP246ci5wb3AoKSwxKSkscn19LGRiPXtieXRlczp7ZnJvbUJpdHM6ZnVuY3Rpb24odCl7Zm9yKHZhciBlLG49bGIuYml0TGVuZ3RoKHQpLzgscj1uZXcgVWludDhBcnJheShuKSxpPTA7aTxuO2krKykwPT0oMyZpKSYmKGU9dFtpLzRdKSxyW2ldPWU+Pj4yNCxlPDw9ODtyZXR1cm4gcn0sdG9CaXRzOmZ1bmN0aW9uKHQpe3ZhciBlLG49W10scj0wO2ZvcihlPTA7ZTx0Lmxlbmd0aDtlKyspcj1yPDw4fHRbZV0sMz09KDMmZSkmJihuLnB1c2gocikscj0wKTtyZXR1cm4gMyZlJiZuLnB1c2gobGIucGFydGlhbCg4KigzJmUpLHIpKSxufX19LGhiPXtzaGExOmZ1bmN0aW9uKHQpe3Q/KHRoaXMuX2g9dC5faC5zbGljZSgwKSx0aGlzLl9idWZmZXI9dC5fYnVmZmVyLnNsaWNlKDApLHRoaXMuX2xlbmd0aD10Ll9sZW5ndGgpOnRoaXMucmVzZXQoKX19O2hiLnNoYTEucHJvdG90eXBlPXtibG9ja1NpemU6NTEyLHJlc2V0OmZ1bmN0aW9uKCl7dmFyIHQ9dGhpcztyZXR1cm4gdC5faD10aGlzLl9pbml0LnNsaWNlKDApLHQuX2J1ZmZlcj1bXSx0Ll9sZW5ndGg9MCx0fSx1cGRhdGU6ZnVuY3Rpb24odCl7dmFyIGU9dGhpczsic3RyaW5nIj09dHlwZW9mIHQmJih0PWRiLnV0ZjhTdHJpbmcudG9CaXRzKHQpKTt2YXIgbj1lLl9idWZmZXI9bGIuY29uY2F0KGUuX2J1ZmZlcix0KSxyPWUuX2xlbmd0aCxpPWUuX2xlbmd0aD1yK2xiLmJpdExlbmd0aCh0KTtpZihpPjkwMDcxOTkyNTQ3NDA5OTEpdGhyb3cgbmV3IEVycm9yKCJDYW5ub3QgaGFzaCBtb3JlIHRoYW4gMl41MyAtIDEgYml0cyIpO2Zvcih2YXIgbz1uZXcgVWludDMyQXJyYXkobiksYT0wLHU9ZS5ibG9ja1NpemUrci0oZS5ibG9ja1NpemUrciZlLmJsb2NrU2l6ZS0xKTt1PD1pO3UrPWUuYmxvY2tTaXplKWUuX2Jsb2NrKG8uc3ViYXJyYXkoMTYqYSwxNiooYSsxKSkpLGErPTE7cmV0dXJuIG4uc3BsaWNlKDAsMTYqYSksZX0sZmluYWxpemU6ZnVuY3Rpb24oKXtmb3IodmFyIHQ9dGhpcyxlPXQuX2J1ZmZlcixuPXQuX2gscj0oZT1sYi5jb25jYXQoZSxbbGIucGFydGlhbCgxLDEpXSkpLmxlbmd0aCsyOzE1JnI7cisrKWUucHVzaCgwKTtmb3IoZS5wdXNoKE1hdGguZmxvb3IodC5fbGVuZ3RoLzQyOTQ5NjcyOTYpKSxlLnB1c2goMHx0Ll9sZW5ndGgpO2UubGVuZ3RoOyl0Ll9ibG9jayhlLnNwbGljZSgwLDE2KSk7cmV0dXJuIHQucmVzZXQoKSxufSxfaW5pdDpbMTczMjU4NDE5Myw0MDIzMjMzNDE3LDI1NjIzODMxMDIsMjcxNzMzODc4LDMyODUzNzc1MjBdLF9rZXk6WzE1MTg1MDAyNDksMTg1OTc3NTM5MywyNDAwOTU5NzA4LDMzOTU0Njk3ODJdLF9mOmZ1bmN0aW9uKHQsZSxuLHIpe3JldHVybiB0PD0xOT9lJm58fmUmcjp0PD0zOT9lXm5ecjp0PD01OT9lJm58ZSZyfG4mcjp0PD03OT9lXm5ecjp2b2lkIDB9LF9TOmZ1bmN0aW9uKHQsZSl7cmV0dXJuIGU8PHR8ZT4+PjMyLXR9LF9ibG9jazpmdW5jdGlvbih0KXtmb3IodmFyIGU9dGhpcyxuPWUuX2gscj1BcnJheSg4MCksaT0wO2k8MTY7aSsrKXJbaV09dFtpXTtmb3IodmFyIG89blswXSxhPW5bMV0sdT1uWzJdLGM9blszXSxmPW5bNF0scz0wO3M8PTc5O3MrKyl7cz49MTYmJihyW3NdPWUuX1MoMSxyW3MtM11ecltzLThdXnJbcy0xNF1ecltzLTE2XSkpO3ZhciBsPWUuX1MoNSxvKStlLl9mKHMsYSx1LGMpK2YrcltzXStlLl9rZXlbTWF0aC5mbG9vcihzLzIwKV18MDtmPWMsYz11LHU9ZS5fUygzMCxhKSxhPW8sbz1sfW5bMF09blswXStvfDAsblsxXT1uWzFdK2F8MCxuWzJdPW5bMl0rdXwwLG5bM109blszXStjfDAsbls0XT1uWzRdK2Z8MH19O3ZhciBwYj17fTtwYi5hZXM9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KGUpe2NiKHRoaXMsdCk7dmFyIG49dGhpcztuLl90YWJsZXM9W1tbXSxbXSxbXSxbXSxbXV0sW1tdLFtdLFtdLFtdLFtdXV0sbi5fdGFibGVzWzBdWzBdWzBdfHxuLl9wcmVjb21wdXRlKCk7dmFyIHIsaSxvLGE9bi5fdGFibGVzWzBdWzRdLHU9bi5fdGFibGVzWzFdLGM9ZS5sZW5ndGgsZj0xO2lmKDQhPT1jJiY2IT09YyYmOCE9PWMpdGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIGFlcyBrZXkgc2l6ZSIpO2ZvcihuLl9rZXk9W2k9ZS5zbGljZSgwKSxvPVtdXSxyPWM7cjw0KmMrMjg7cisrKXt2YXIgcz1pW3ItMV07KHIlYz09MHx8OD09PWMmJnIlYz09NCkmJihzPWFbcz4+PjI0XTw8MjReYVtzPj4xNiYyNTVdPDwxNl5hW3M+PjgmMjU1XTw8OF5hWzI1NSZzXSxyJWM9PTAmJihzPXM8PDhecz4+PjI0XmY8PDI0LGY9Zjw8MV4yODMqKGY+PjcpKSksaVtyXT1pW3ItY11ec31mb3IodmFyIGw9MDtyO2wrKyxyLS0pe3ZhciBkPWlbMyZsP3I6ci00XTtvW2xdPXI8PTR8fGw8ND9kOnVbMF1bYVtkPj4+MjRdXV51WzFdW2FbZD4+MTYmMjU1XV1edVsyXVthW2Q+PjgmMjU1XV1edVszXVthWzI1NSZkXV19fXJldHVybiBzYih0LFt7a2V5OiJlbmNyeXB0Iix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fY3J5cHQodCwwKX19LHtrZXk6ImRlY3J5cHQiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl9jcnlwdCh0LDEpfX0se2tleToiX3ByZWNvbXB1dGUiLHZhbHVlOmZ1bmN0aW9uKCl7Zm9yKHZhciB0LGUsbixyPXRoaXMuX3RhYmxlc1swXSxpPXRoaXMuX3RhYmxlc1sxXSxvPXJbNF0sYT1pWzRdLHU9W10sYz1bXSxmPTA7ZjwyNTY7ZisrKWNbKHVbZl09Zjw8MV4yODMqKGY+PjcpKV5mXT1mO2Zvcih2YXIgcz10PTA7IW9bc107c149ZXx8MSx0PWNbdF18fDEpe3ZhciBsPXRedDw8MV50PDwyXnQ8PDNedDw8NDtsPWw+PjheMjU1JmxeOTksb1tzXT1sLGFbbF09cztmb3IodmFyIGQ9MTY4NDMwMDkqdVtuPXVbZT11W3NdXV1eNjU1Mzcqbl4yNTcqZV4xNjg0MzAwOCpzLGg9MjU3KnVbbF1eMTY4NDMwMDgqbCxwPTA7cDw0O3ArKylyW3BdW3NdPWg9aDw8MjReaD4+PjgsaVtwXVtsXT1kPWQ8PDI0XmQ+Pj44fWZvcih2YXIgdj0wO3Y8NTt2Kyspclt2XT1yW3ZdLnNsaWNlKDApLGlbdl09aVt2XS5zbGljZSgwKX19LHtrZXk6Il9jcnlwdCIsdmFsdWU6ZnVuY3Rpb24odCxlKXtpZig0IT09dC5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIGFlcyBibG9jayBzaXplIik7Zm9yKHZhciBuLHIsaSxvPXRoaXMuX2tleVtlXSxhPW8ubGVuZ3RoLzQtMix1PVswLDAsMCwwXSxjPXRoaXMuX3RhYmxlc1tlXSxmPWNbMF0scz1jWzFdLGw9Y1syXSxkPWNbM10saD1jWzRdLHA9dFswXV5vWzBdLHY9dFtlPzM6MV1eb1sxXSx5PXRbMl1eb1syXSxfPXRbZT8xOjNdXm9bM10sZz00LGI9MDtiPGE7YisrKW49ZltwPj4+MjRdXnNbdj4+MTYmMjU1XV5sW3k+PjgmMjU1XV5kWzI1NSZfXV5vW2ddLHI9Zlt2Pj4+MjRdXnNbeT4+MTYmMjU1XV5sW18+PjgmMjU1XV5kWzI1NSZwXV5vW2crMV0saT1mW3k+Pj4yNF1ec1tfPj4xNiYyNTVdXmxbcD4+OCYyNTVdXmRbMjU1JnZdXm9bZysyXSxfPWZbXz4+PjI0XV5zW3A+PjE2JjI1NV1ebFt2Pj44JjI1NV1eZFsyNTUmeV1eb1tnKzNdLGcrPTQscD1uLHY9cix5PWk7Zm9yKHZhciB3PTA7dzw0O3crKyl1W2U/MyYtdzp3XT1oW3A+Pj4yNF08PDI0Xmhbdj4+MTYmMjU1XTw8MTZeaFt5Pj44JjI1NV08PDheaFsyNTUmX11eb1tnKytdLG49cCxwPXYsdj15LHk9XyxfPW47cmV0dXJuIHV9fV0pLHR9KCk7dmFyIHZiPXt9O3ZiLmN0ckdsYWRtYW49ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KGUsbil7Y2IodGhpcyx0KSx0aGlzLl9wcmY9ZSx0aGlzLl9pbml0SXY9bix0aGlzLl9pdj1ufXJldHVybiBzYih0LFt7a2V5OiJyZXNldCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLl9pdj10aGlzLl9pbml0SXZ9fSx7a2V5OiJ1cGRhdGUiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmNhbGN1bGF0ZSh0aGlzLl9wcmYsdCx0aGlzLl9pdil9fSx7a2V5OiJpbmNXb3JkIix2YWx1ZTpmdW5jdGlvbih0KXtpZigyNTU9PSh0Pj4yNCYyNTUpKXt2YXIgZT10Pj4xNiYyNTUsbj10Pj44JjI1NSxyPTI1NSZ0OzI1NT09PWU/KGU9MCwyNTU9PT1uPyhuPTAsMjU1PT09cj9yPTA6KytyKTorK24pOisrZSx0PTAsdCs9ZTw8MTYsdCs9bjw8OCx0Kz1yfWVsc2UgdCs9MTw8MjQ7cmV0dXJuIHR9fSx7a2V5OiJpbmNDb3VudGVyIix2YWx1ZTpmdW5jdGlvbih0KXswPT09KHRbMF09dGhpcy5pbmNXb3JkKHRbMF0pKSYmKHRbMV09dGhpcy5pbmNXb3JkKHRbMV0pKX19LHtrZXk6ImNhbGN1bGF0ZSIsdmFsdWU6ZnVuY3Rpb24odCxlLG4pe3ZhciByO2lmKCEocj1lLmxlbmd0aCkpcmV0dXJuW107Zm9yKHZhciBpPWxiLmJpdExlbmd0aChlKSxvPTA7bzxyO28rPTQpe3RoaXMuaW5jQ291bnRlcihuKTt2YXIgYT10LmVuY3J5cHQobik7ZVtvXV49YVswXSxlW28rMV1ePWFbMV0sZVtvKzJdXj1hWzJdLGVbbyszXV49YVszXX1yZXR1cm4gbGIuY2xhbXAoZSxpKX19XSksdH0oKTt2YXIgeWI9e307ZnVuY3Rpb24gX2IodCxlLG4scixpLG8sYSl7dHJ5e3ZhciB1PXRbb10oYSksYz11LnZhbHVlfWNhdGNoKHQpe3JldHVybiB2b2lkIG4odCl9dS5kb25lP2UoYyk6UHJvbWlzZS5yZXNvbHZlKGMpLnRoZW4ocixpKX1mdW5jdGlvbiBnYih0KXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgZT10aGlzLG49YXJndW1lbnRzO3JldHVybiBuZXcgUHJvbWlzZSgoZnVuY3Rpb24ocixpKXt2YXIgbz10LmFwcGx5KGUsbik7ZnVuY3Rpb24gYSh0KXtfYihvLHIsaSxhLHUsIm5leHQiLHQpfWZ1bmN0aW9uIHUodCl7X2IobyxyLGksYSx1LCJ0aHJvdyIsdCl9YSh2b2lkIDApfSkpfX1mdW5jdGlvbiBiYih0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbiIpfWZ1bmN0aW9uIHdiKHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciByPWVbbl07ci5lbnVtZXJhYmxlPXIuZW51bWVyYWJsZXx8ITEsci5jb25maWd1cmFibGU9ITAsInZhbHVlImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19ZnVuY3Rpb24geGIodCxlLG4pe3JldHVybiBlJiZ3Yih0LnByb3RvdHlwZSxlKSxuJiZ3Yih0LG4pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LCJwcm90b3R5cGUiLHt3cml0YWJsZTohMX0pLHR9eWIuaG1hY1NoYTE9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KGUpe2NiKHRoaXMsdCk7dmFyIG49dGhpcyxyPW4uX2hhc2g9aGIuc2hhMSxpPVtbXSxbXV0sbz1yLnByb3RvdHlwZS5ibG9ja1NpemUvMzI7bi5fYmFzZUhhc2g9W25ldyByLG5ldyByXSxlLmxlbmd0aD5vJiYoZT1yLmhhc2goZSkpO2Zvcih2YXIgYT0wO2E8bzthKyspaVswXVthXT05MDk1MjI0ODZeZVthXSxpWzFdW2FdPTE1NDk1NTY4MjheZVthXTtuLl9iYXNlSGFzaFswXS51cGRhdGUoaVswXSksbi5fYmFzZUhhc2hbMV0udXBkYXRlKGlbMV0pLG4uX3Jlc3VsdEhhc2g9bmV3IHIobi5fYmFzZUhhc2hbMF0pfXJldHVybiBzYih0LFt7a2V5OiJyZXNldCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgdD10aGlzO3QuX3Jlc3VsdEhhc2g9bmV3IHQuX2hhc2godC5fYmFzZUhhc2hbMF0pLHQuX3VwZGF0ZWQ9ITF9fSx7a2V5OiJ1cGRhdGUiLHZhbHVlOmZ1bmN0aW9uKHQpe3RoaXMuX3VwZGF0ZWQ9ITAsdGhpcy5fcmVzdWx0SGFzaC51cGRhdGUodCl9fSx7a2V5OiJkaWdlc3QiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIHQ9dGhpcyxlPXQuX3Jlc3VsdEhhc2guZmluYWxpemUoKSxuPW5ldyB0Ll9oYXNoKHQuX2Jhc2VIYXNoWzFdKS51cGRhdGUoZSkuZmluYWxpemUoKTtyZXR1cm4gdC5yZXNldCgpLG59fV0pLHR9KCk7dmFyIG1iPXtuYW1lOiJQQktERjIifSxrYj1PYmplY3QuYXNzaWduKHtoYXNoOntuYW1lOiJITUFDIn19LG1iKSxBYj1PYmplY3QuYXNzaWduKHtpdGVyYXRpb25zOjFlMyxoYXNoOntuYW1lOiJTSEEtMSJ9fSxtYiksU2I9WyJkZXJpdmVCaXRzIl0sRWI9WzgsMTIsMTZdLFRiPVsxNiwyNCwzMl0sT2I9WzAsMCwwLDBdLGpiPWRiLmJ5dGVzLEliPXBiLmFlcyxSYj12Yi5jdHJHbGFkbWFuLFBiPXliLmhtYWNTaGExLE1iPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdChlLG4scil7YmIodGhpcyx0KSxPYmplY3QuYXNzaWduKHRoaXMse3Bhc3N3b3JkOmUsc2lnbmVkOm4sc3RyZW5ndGg6ci0xLHBlbmRpbmdJbnB1dDpuZXcgVWludDhBcnJheSgwKX0pfXZhciBlO3JldHVybiB4Yih0LFt7a2V5OiJhcHBlbmQiLHZhbHVlOihlPWdiKHJlZ2VuZXJhdG9yUnVudGltZS5tYXJrKChmdW5jdGlvbiB0KGUpe3ZhciBuLHIsaTtyZXR1cm4gcmVnZW5lcmF0b3JSdW50aW1lLndyYXAoKGZ1bmN0aW9uKHQpe2Zvcig7Oylzd2l0Y2godC5wcmV2PXQubmV4dCl7Y2FzZSAwOmlmKCEobj10aGlzKS5wYXNzd29yZCl7dC5uZXh0PTk7YnJlYWt9cmV0dXJuIHI9VmIoZSwwLEViW24uc3RyZW5ndGhdKzIpLHQubmV4dD01LENiKG4scixuLnBhc3N3b3JkKTtjYXNlIDU6bi5wYXNzd29yZD1udWxsLG4uYWVzQ3RyR2xhZG1hbj1uZXcgUmIobmV3IEliKG4ua2V5cy5rZXkpLEFycmF5LmZyb20oT2IpKSxuLmhtYWM9bmV3IFBiKG4ua2V5cy5hdXRoZW50aWNhdGlvbiksZT1WYihlLEViW24uc3RyZW5ndGhdKzIpO2Nhc2UgOTpyZXR1cm4gaT1uZXcgVWludDhBcnJheShlLmxlbmd0aC0xMC0oZS5sZW5ndGgtMTApJTE2KSx0LmFicnVwdCgicmV0dXJuIixVYihuLGUsaSwwLDEwLCEwKSk7Y2FzZSAxMTpjYXNlImVuZCI6cmV0dXJuIHQuc3RvcCgpfX0pLHQsdGhpcyl9KSkpLGZ1bmN0aW9uKHQpe3JldHVybiBlLmFwcGx5KHRoaXMsYXJndW1lbnRzKX0pfSx7a2V5OiJmbHVzaCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgdD10aGlzLGU9dC5wZW5kaW5nSW5wdXQsbj1WYihlLDAsZS5sZW5ndGgtMTApLHI9VmIoZSxlLmxlbmd0aC0xMCksaT1uZXcgVWludDhBcnJheSgwKTtpZihuLmxlbmd0aCl7dmFyIG89amIudG9CaXRzKG4pO3QuaG1hYy51cGRhdGUobyk7dmFyIGE9dC5hZXNDdHJHbGFkbWFuLnVwZGF0ZShvKTtpPWpiLmZyb21CaXRzKGEpfXZhciB1PSEwO2lmKHQuc2lnbmVkKWZvcih2YXIgYz1WYihqYi5mcm9tQml0cyh0LmhtYWMuZGlnZXN0KCkpLDAsMTApLGY9MDtmPDEwO2YrKyljW2ZdIT1yW2ZdJiYodT0hMSk7cmV0dXJue3ZhbGlkOnUsZGF0YTppfX19XSksdH0oKSxMYj1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoZSxuKXtiYih0aGlzLHQpLE9iamVjdC5hc3NpZ24odGhpcyx7cGFzc3dvcmQ6ZSxzdHJlbmd0aDpuLTEscGVuZGluZ0lucHV0Om5ldyBVaW50OEFycmF5KDApfSl9dmFyIGU7cmV0dXJuIHhiKHQsW3trZXk6ImFwcGVuZCIsdmFsdWU6KGU9Z2IocmVnZW5lcmF0b3JSdW50aW1lLm1hcmsoKGZ1bmN0aW9uIHQoZSl7dmFyIG4scixpO3JldHVybiByZWdlbmVyYXRvclJ1bnRpbWUud3JhcCgoZnVuY3Rpb24odCl7Zm9yKDs7KXN3aXRjaCh0LnByZXY9dC5uZXh0KXtjYXNlIDA6aWYobj10aGlzLHI9bmV3IFVpbnQ4QXJyYXkoMCksIW4ucGFzc3dvcmQpe3QubmV4dD05O2JyZWFrfXJldHVybiB0Lm5leHQ9NSxCYihuLG4ucGFzc3dvcmQpO2Nhc2UgNTpyPXQuc2VudCxuLnBhc3N3b3JkPW51bGwsbi5hZXNDdHJHbGFkbWFuPW5ldyBSYihuZXcgSWIobi5rZXlzLmtleSksQXJyYXkuZnJvbShPYikpLG4uaG1hYz1uZXcgUGIobi5rZXlzLmF1dGhlbnRpY2F0aW9uKTtjYXNlIDk6cmV0dXJuKGk9bmV3IFVpbnQ4QXJyYXkoci5sZW5ndGgrZS5sZW5ndGgtZS5sZW5ndGglMTYpKS5zZXQociwwKSx0LmFicnVwdCgicmV0dXJuIixVYihuLGUsaSxyLmxlbmd0aCwwKSk7Y2FzZSAxMjpjYXNlImVuZCI6cmV0dXJuIHQuc3RvcCgpfX0pLHQsdGhpcyl9KSkpLGZ1bmN0aW9uKHQpe3JldHVybiBlLmFwcGx5KHRoaXMsYXJndW1lbnRzKX0pfSx7a2V5OiJmbHVzaCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgdD10aGlzLGU9bmV3IFVpbnQ4QXJyYXkoMCk7aWYodC5wZW5kaW5nSW5wdXQubGVuZ3RoKXt2YXIgbj10LmFlc0N0ckdsYWRtYW4udXBkYXRlKGpiLnRvQml0cyh0LnBlbmRpbmdJbnB1dCkpO3QuaG1hYy51cGRhdGUobiksZT1qYi5mcm9tQml0cyhuKX12YXIgcj1WYihqYi5mcm9tQml0cyh0LmhtYWMuZGlnZXN0KCkpLDAsMTApO3JldHVybntkYXRhOkdiKGUsciksc2lnbmF0dXJlOnJ9fX1dKSx0fSgpO2Z1bmN0aW9uIFViKHQsZSxuLHIsaSxvKXt2YXIgYSx1PWUubGVuZ3RoLWk7Zm9yKHQucGVuZGluZ0lucHV0Lmxlbmd0aCYmKGU9R2IodC5wZW5kaW5nSW5wdXQsZSksbj1mdW5jdGlvbih0LGUpe2lmKGUmJmU+dC5sZW5ndGgpe3ZhciBuPXQ7KHQ9bmV3IFVpbnQ4QXJyYXkoZSkpLnNldChuLDApfXJldHVybiB0fShuLHUtdSUxNikpLGE9MDthPD11LTE2O2ErPTE2KXt2YXIgYz1qYi50b0JpdHMoVmIoZSxhLGErMTYpKTtvJiZ0LmhtYWMudXBkYXRlKGMpO3ZhciBmPXQuYWVzQ3RyR2xhZG1hbi51cGRhdGUoYyk7b3x8dC5obWFjLnVwZGF0ZShmKSxuLnNldChqYi5mcm9tQml0cyhmKSxhK3IpfXJldHVybiB0LnBlbmRpbmdJbnB1dD1WYihlLGEpLG59ZnVuY3Rpb24gQ2IodCxlLG4pe3JldHVybiBGYi5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gRmIoKXtyZXR1cm4gRmI9Z2IocmVnZW5lcmF0b3JSdW50aW1lLm1hcmsoKGZ1bmN0aW9uIHQoZSxuLHIpe3ZhciBpLG87cmV0dXJuIHJlZ2VuZXJhdG9yUnVudGltZS53cmFwKChmdW5jdGlvbih0KXtmb3IoOzspc3dpdGNoKHQucHJldj10Lm5leHQpe2Nhc2UgMDpyZXR1cm4gdC5uZXh0PTIsRGIoZSxyLFZiKG4sMCxFYltlLnN0cmVuZ3RoXSkpO2Nhc2UgMjppZihpPVZiKG4sRWJbZS5zdHJlbmd0aF0pLChvPWUua2V5cy5wYXNzd29yZFZlcmlmaWNhdGlvbilbMF09PWlbMF0mJm9bMV09PWlbMV0pe3QubmV4dD02O2JyZWFrfXRocm93IG5ldyBFcnJvcigiSW52YWxpZCBwYXN3b3JkIik7Y2FzZSA2OmNhc2UiZW5kIjpyZXR1cm4gdC5zdG9wKCl9fSksdCl9KSkpLEZiLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1mdW5jdGlvbiBCYih0LGUpe3JldHVybiBOYi5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gTmIoKXtyZXR1cm4gTmI9Z2IocmVnZW5lcmF0b3JSdW50aW1lLm1hcmsoKGZ1bmN0aW9uIHQoZSxuKXt2YXIgcjtyZXR1cm4gcmVnZW5lcmF0b3JSdW50aW1lLndyYXAoKGZ1bmN0aW9uKHQpe2Zvcig7Oylzd2l0Y2godC5wcmV2PXQubmV4dCl7Y2FzZSAwOnJldHVybiByPWNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoRWJbZS5zdHJlbmd0aF0pKSx0Lm5leHQ9MyxEYihlLG4scik7Y2FzZSAzOnJldHVybiB0LmFicnVwdCgicmV0dXJuIixHYihyLGUua2V5cy5wYXNzd29yZFZlcmlmaWNhdGlvbikpO2Nhc2UgNDpjYXNlImVuZCI6cmV0dXJuIHQuc3RvcCgpfX0pLHQpfSkpKSxOYi5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gRGIodCxlLG4pe3JldHVybiB6Yi5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gemIoKXtyZXR1cm4oemI9Z2IocmVnZW5lcmF0b3JSdW50aW1lLm1hcmsoKGZ1bmN0aW9uIHQoZSxuLHIpe3ZhciBpLG8sYSx1O3JldHVybiByZWdlbmVyYXRvclJ1bnRpbWUud3JhcCgoZnVuY3Rpb24odCl7Zm9yKDs7KXN3aXRjaCh0LnByZXY9dC5uZXh0KXtjYXNlIDA6cmV0dXJuIGk9cGcobiksdC5uZXh0PTMsY3J5cHRvLnN1YnRsZS5pbXBvcnRLZXkoInJhdyIsaSxrYiwhMSxTYik7Y2FzZSAzOnJldHVybiBvPXQuc2VudCx0Lm5leHQ9NixjcnlwdG8uc3VidGxlLmRlcml2ZUJpdHMoT2JqZWN0LmFzc2lnbih7c2FsdDpyfSxBYiksbyw4KigyKlRiW2Uuc3RyZW5ndGhdKzIpKTtjYXNlIDY6YT10LnNlbnQsdT1uZXcgVWludDhBcnJheShhKSxlLmtleXM9e2tleTpqYi50b0JpdHMoVmIodSwwLFRiW2Uuc3RyZW5ndGhdKSksYXV0aGVudGljYXRpb246amIudG9CaXRzKFZiKHUsVGJbZS5zdHJlbmd0aF0sMipUYltlLnN0cmVuZ3RoXSkpLHBhc3N3b3JkVmVyaWZpY2F0aW9uOlZiKHUsMipUYltlLnN0cmVuZ3RoXSl9O2Nhc2UgOTpjYXNlImVuZCI6cmV0dXJuIHQuc3RvcCgpfX0pLHQpfSkpKSkuYXBwbHkodGhpcyxhcmd1bWVudHMpfWZ1bmN0aW9uIEdiKHQsZSl7dmFyIG49dDtyZXR1cm4gdC5sZW5ndGgrZS5sZW5ndGgmJigobj1uZXcgVWludDhBcnJheSh0Lmxlbmd0aCtlLmxlbmd0aCkpLnNldCh0LDApLG4uc2V0KGUsdC5sZW5ndGgpKSxufWZ1bmN0aW9uIFZiKHQsZSxuKXtyZXR1cm4gdC5zdWJhcnJheShlLG4pfXZhciBXYj1OcixZYj1pLEhiPU1hdGguaW11bDtmdW5jdGlvbiBLYih0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbiIpfWZ1bmN0aW9uIHFiKHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciByPWVbbl07ci5lbnVtZXJhYmxlPXIuZW51bWVyYWJsZXx8ITEsci5jb25maWd1cmFibGU9ITAsInZhbHVlImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19ZnVuY3Rpb24gJGIodCxlLG4pe3JldHVybiBlJiZxYih0LnByb3RvdHlwZSxlKSxuJiZxYih0LG4pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LCJwcm90b3R5cGUiLHt3cml0YWJsZTohMX0pLHR9V2Ioe3RhcmdldDoiTWF0aCIsc3RhdDohMCxmb3JjZWQ6WWIoKGZ1bmN0aW9uKCl7cmV0dXJuLTUhPUhiKDQyOTQ5NjcyOTUsNSl8fDIhPUhiLmxlbmd0aH0pKX0se2ltdWw6ZnVuY3Rpb24odCxlKXt2YXIgbj02NTUzNSxyPSt0LGk9K2Usbz1uJnIsYT1uJmk7cmV0dXJuIDB8byphKygobiZyPj4+MTYpKmErbyoobiZpPj4+MTYpPDwxNj4+PjApfX0pO3ZhciBYYj1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoZSxuKXtLYih0aGlzLHQpO09iamVjdC5hc3NpZ24odGhpcyx7cGFzc3dvcmQ6ZSxwYXNzd29yZFZlcmlmaWNhdGlvbjpufSksdHcodGhpcyxlKX1yZXR1cm4gJGIodCxbe2tleToiYXBwZW5kIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT10aGlzO2lmKGUucGFzc3dvcmQpe3ZhciBuPVFiKGUsdC5zdWJhcnJheSgwLDEyKSk7aWYoZS5wYXNzd29yZD1udWxsLG5bMTFdIT1lLnBhc3N3b3JkVmVyaWZpY2F0aW9uKXRocm93IG5ldyBFcnJvcigiSW52YWxpZCBwYXN3b3JkIik7dD10LnN1YmFycmF5KDEyKX1yZXR1cm4gUWIoZSx0KX19LHtrZXk6ImZsdXNoIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybnt2YWxpZDohMCxkYXRhOm5ldyBVaW50OEFycmF5KDApfX19XSksdH0oKSxKYj1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoZSxuKXtLYih0aGlzLHQpO09iamVjdC5hc3NpZ24odGhpcyx7cGFzc3dvcmQ6ZSxwYXNzd29yZFZlcmlmaWNhdGlvbjpufSksdHcodGhpcyxlKX1yZXR1cm4gJGIodCxbe2tleToiYXBwZW5kIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZSxuLHI9dGhpcztpZihyLnBhc3N3b3JkKXtyLnBhc3N3b3JkPW51bGw7dmFyIGk9Y3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheSgxMikpO2lbMTFdPXIucGFzc3dvcmRWZXJpZmljYXRpb24sKGU9bmV3IFVpbnQ4QXJyYXkodC5sZW5ndGgraS5sZW5ndGgpKS5zZXQoWmIocixpKSwwKSxuPTEyfWVsc2UgZT1uZXcgVWludDhBcnJheSh0Lmxlbmd0aCksbj0wO3JldHVybiBlLnNldChaYihyLHQpLG4pLGV9fSx7a2V5OiJmbHVzaCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm57ZGF0YTpuZXcgVWludDhBcnJheSgwKX19fV0pLHR9KCk7ZnVuY3Rpb24gUWIodCxlKXtmb3IodmFyIG49bmV3IFVpbnQ4QXJyYXkoZS5sZW5ndGgpLHI9MDtyPGUubGVuZ3RoO3IrKyluW3JdPW53KHQpXmVbcl0sZXcodCxuW3JdKTtyZXR1cm4gbn1mdW5jdGlvbiBaYih0LGUpe2Zvcih2YXIgbj1uZXcgVWludDhBcnJheShlLmxlbmd0aCkscj0wO3I8ZS5sZW5ndGg7cisrKW5bcl09bncodCleZVtyXSxldyh0LGVbcl0pO3JldHVybiBufWZ1bmN0aW9uIHR3KHQsZSl7dC5rZXlzPVszMDU0MTk4OTYsNTkxNzUxMDQ5LDg3ODA4MjE5Ml0sdC5jcmNLZXkwPW5ldyBTXyh0LmtleXNbMF0pLHQuY3JjS2V5Mj1uZXcgU18odC5rZXlzWzJdKTtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKylldyh0LGUuY2hhckNvZGVBdChuKSl9ZnVuY3Rpb24gZXcodCxlKXt0LmNyY0tleTAuYXBwZW5kKFtlXSksdC5rZXlzWzBdPX50LmNyY0tleTAuZ2V0KCksdC5rZXlzWzFdPWl3KHQua2V5c1sxXStydyh0LmtleXNbMF0pKSx0LmtleXNbMV09aXcoTWF0aC5pbXVsKHQua2V5c1sxXSwxMzQ3NzU4MTMpKzEpLHQuY3JjS2V5Mi5hcHBlbmQoW3Qua2V5c1sxXT4+PjI0XSksdC5rZXlzWzJdPX50LmNyY0tleTIuZ2V0KCl9ZnVuY3Rpb24gbncodCl7dmFyIGU9Mnx0LmtleXNbMl07cmV0dXJuIHJ3KE1hdGguaW11bChlLDFeZSk+Pj44KX1mdW5jdGlvbiBydyh0KXtyZXR1cm4gMjU1JnR9ZnVuY3Rpb24gaXcodCl7cmV0dXJuIDQyOTQ5NjcyOTUmdH1mdW5jdGlvbiBvdyh0LGUsbixyLGksbyxhKXt0cnl7dmFyIHU9dFtvXShhKSxjPXUudmFsdWV9Y2F0Y2godCl7cmV0dXJuIHZvaWQgbih0KX11LmRvbmU/ZShjKTpQcm9taXNlLnJlc29sdmUoYykudGhlbihyLGkpfWZ1bmN0aW9uIGF3KHQpe3JldHVybiBmdW5jdGlvbigpe3ZhciBlPXRoaXMsbj1hcmd1bWVudHM7cmV0dXJuIG5ldyBQcm9taXNlKChmdW5jdGlvbihyLGkpe3ZhciBvPXQuYXBwbHkoZSxuKTtmdW5jdGlvbiBhKHQpe293KG8scixpLGEsdSwibmV4dCIsdCl9ZnVuY3Rpb24gdSh0KXtvdyhvLHIsaSxhLHUsInRocm93Iix0KX1hKHZvaWQgMCl9KSl9fWZ1bmN0aW9uIHV3KHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcigiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uIil9ZnVuY3Rpb24gY3codCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIHI9ZVtuXTtyLmVudW1lcmFibGU9ci5lbnVtZXJhYmxlfHwhMSxyLmNvbmZpZ3VyYWJsZT0hMCwidmFsdWUiaW4gciYmKHIud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LHIua2V5LHIpfX1mdW5jdGlvbiBmdyh0LGUsbil7cmV0dXJuIGUmJmN3KHQucHJvdG90eXBlLGUpLG4mJmN3KHQsbiksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsInByb3RvdHlwZSIse3dyaXRhYmxlOiExfSksdH12YXIgc3c9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KGUsbixyKXt2YXIgaT1uLnNpZ25hdHVyZSxvPW4ucGFzc3dvcmQsYT1uLnNpZ25lZCx1PW4uY29tcHJlc3NlZCxjPW4uemlwQ3J5cHRvLGY9bi5wYXNzd29yZFZlcmlmaWNhdGlvbixzPW4uZW5jcnlwdGlvblN0cmVuZ3RoLGw9ci5jaHVua1NpemU7dXcodGhpcyx0KTt2YXIgZD1Cb29sZWFuKG8pO09iamVjdC5hc3NpZ24odGhpcyx7c2lnbmF0dXJlOmksZW5jcnlwdGVkOmQsc2lnbmVkOmEsY29tcHJlc3NlZDp1LGluZmxhdGU6dSYmbmV3IGUoe2NodW5rU2l6ZTpsfSksY3JjMzI6YSYmbmV3IFNfLHppcENyeXB0bzpjLGRlY3J5cHQ6ZCYmYz9uZXcgWGIobyxmKTpuZXcgTWIobyxhLHMpfSl9dmFyIGU7cmV0dXJuIGZ3KHQsW3trZXk6ImFwcGVuZCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgdD1hdyhyZWdlbmVyYXRvclJ1bnRpbWUubWFyaygoZnVuY3Rpb24gdChlKXt2YXIgbjtyZXR1cm4gcmVnZW5lcmF0b3JSdW50aW1lLndyYXAoKGZ1bmN0aW9uKHQpe2Zvcig7Oylzd2l0Y2godC5wcmV2PXQubmV4dCl7Y2FzZSAwOmlmKCEobj10aGlzKS5lbmNyeXB0ZWR8fCFlLmxlbmd0aCl7dC5uZXh0PTU7YnJlYWt9cmV0dXJuIHQubmV4dD00LG4uZGVjcnlwdC5hcHBlbmQoZSk7Y2FzZSA0OmU9dC5zZW50O2Nhc2UgNTppZighbi5jb21wcmVzc2VkfHwhZS5sZW5ndGgpe3QubmV4dD05O2JyZWFrfXJldHVybiB0Lm5leHQ9OCxuLmluZmxhdGUuYXBwZW5kKGUpO2Nhc2UgODplPXQuc2VudDtjYXNlIDk6cmV0dXJuKCFuLmVuY3J5cHRlZHx8bi56aXBDcnlwdG8pJiZuLnNpZ25lZCYmZS5sZW5ndGgmJm4uY3JjMzIuYXBwZW5kKGUpLHQuYWJydXB0KCJyZXR1cm4iLGUpO2Nhc2UgMTE6Y2FzZSJlbmQiOnJldHVybiB0LnN0b3AoKX19KSx0LHRoaXMpfSkpKTtyZXR1cm4gZnVuY3Rpb24oZSl7cmV0dXJuIHQuYXBwbHkodGhpcyxhcmd1bWVudHMpfX0oKX0se2tleToiZmx1c2giLHZhbHVlOihlPWF3KHJlZ2VuZXJhdG9yUnVudGltZS5tYXJrKChmdW5jdGlvbiB0KCl7dmFyIGUsbixyLGksbztyZXR1cm4gcmVnZW5lcmF0b3JSdW50aW1lLndyYXAoKGZ1bmN0aW9uKHQpe2Zvcig7Oylzd2l0Y2godC5wcmV2PXQubmV4dCl7Y2FzZSAwOmlmKGU9dGhpcyxyPW5ldyBVaW50OEFycmF5KDApLCFlLmVuY3J5cHRlZCl7dC5uZXh0PTc7YnJlYWt9aWYoKGk9ZS5kZWNyeXB0LmZsdXNoKCkpLnZhbGlkKXt0Lm5leHQ9NjticmVha310aHJvdyBuZXcgRXJyb3IoIkludmFsaWQgc2lnbmF0dXJlIik7Y2FzZSA2OnI9aS5kYXRhO2Nhc2UgNzppZihlLmVuY3J5cHRlZCYmIWUuemlwQ3J5cHRvfHwhZS5zaWduZWQpe3QubmV4dD0xMzticmVha31pZihvPW5ldyBEYXRhVmlldyhuZXcgVWludDhBcnJheSg0KS5idWZmZXIpLG49ZS5jcmMzMi5nZXQoKSxvLnNldFVpbnQzMigwLG4pLGUuc2lnbmF0dXJlPT1vLmdldFVpbnQzMigwLCExKSl7dC5uZXh0PTEzO2JyZWFrfXRocm93IG5ldyBFcnJvcigiSW52YWxpZCBzaWduYXR1cmUiKTtjYXNlIDEzOmlmKCFlLmNvbXByZXNzZWQpe3QubmV4dD0yMjticmVha31yZXR1cm4gdC5uZXh0PTE2LGUuaW5mbGF0ZS5hcHBlbmQocik7Y2FzZSAxNjppZih0LnQwPXQuc2VudCx0LnQwKXt0Lm5leHQ9MTk7YnJlYWt9dC50MD1uZXcgVWludDhBcnJheSgwKTtjYXNlIDE5OnJldHVybiByPXQudDAsdC5uZXh0PTIyLGUuaW5mbGF0ZS5mbHVzaCgpO2Nhc2UgMjI6cmV0dXJuIHQuYWJydXB0KCJyZXR1cm4iLHtkYXRhOnIsc2lnbmF0dXJlOm59KTtjYXNlIDIzOmNhc2UiZW5kIjpyZXR1cm4gdC5zdG9wKCl9fSksdCx0aGlzKX0pKSksZnVuY3Rpb24oKXtyZXR1cm4gZS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9KX1dKSx0fSgpLGx3PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdChlLG4scil7dmFyIGk9bi5lbmNyeXB0ZWQsbz1uLnNpZ25lZCxhPW4uY29tcHJlc3NlZCx1PW4ubGV2ZWwsYz1uLnppcENyeXB0byxmPW4ucGFzc3dvcmQscz1uLnBhc3N3b3JkVmVyaWZpY2F0aW9uLGw9bi5lbmNyeXB0aW9uU3RyZW5ndGgsZD1yLmNodW5rU2l6ZTt1dyh0aGlzLHQpLE9iamVjdC5hc3NpZ24odGhpcyx7ZW5jcnlwdGVkOmksc2lnbmVkOm8sY29tcHJlc3NlZDphLGRlZmxhdGU6YSYmbmV3IGUoe2xldmVsOnV8fDUsY2h1bmtTaXplOmR9KSxjcmMzMjpvJiZuZXcgU18semlwQ3J5cHRvOmMsZW5jcnlwdDppJiZjP25ldyBKYihmLHMpOm5ldyBMYihmLGwpfSl9dmFyIGUsbjtyZXR1cm4gZncodCxbe2tleToiYXBwZW5kIix2YWx1ZToobj1hdyhyZWdlbmVyYXRvclJ1bnRpbWUubWFyaygoZnVuY3Rpb24gdChlKXt2YXIgbixyO3JldHVybiByZWdlbmVyYXRvclJ1bnRpbWUud3JhcCgoZnVuY3Rpb24odCl7Zm9yKDs7KXN3aXRjaCh0LnByZXY9dC5uZXh0KXtjYXNlIDA6aWYocj1lLCEobj10aGlzKS5jb21wcmVzc2VkfHwhZS5sZW5ndGgpe3QubmV4dD02O2JyZWFrfXJldHVybiB0Lm5leHQ9NSxuLmRlZmxhdGUuYXBwZW5kKGUpO2Nhc2UgNTpyPXQuc2VudDtjYXNlIDY6aWYoIW4uZW5jcnlwdGVkfHwhci5sZW5ndGgpe3QubmV4dD0xMDticmVha31yZXR1cm4gdC5uZXh0PTksbi5lbmNyeXB0LmFwcGVuZChyKTtjYXNlIDk6cj10LnNlbnQ7Y2FzZSAxMDpyZXR1cm4oIW4uZW5jcnlwdGVkfHxuLnppcENyeXB0bykmJm4uc2lnbmVkJiZlLmxlbmd0aCYmbi5jcmMzMi5hcHBlbmQoZSksdC5hYnJ1cHQoInJldHVybiIscik7Y2FzZSAxMjpjYXNlImVuZCI6cmV0dXJuIHQuc3RvcCgpfX0pLHQsdGhpcyl9KSkpLGZ1bmN0aW9uKHQpe3JldHVybiBuLmFwcGx5KHRoaXMsYXJndW1lbnRzKX0pfSx7a2V5OiJmbHVzaCIsdmFsdWU6KGU9YXcocmVnZW5lcmF0b3JSdW50aW1lLm1hcmsoKGZ1bmN0aW9uIHQoKXt2YXIgZSxuLHIsaSxvO3JldHVybiByZWdlbmVyYXRvclJ1bnRpbWUud3JhcCgoZnVuY3Rpb24odCl7Zm9yKDs7KXN3aXRjaCh0LnByZXY9dC5uZXh0KXtjYXNlIDA6aWYoZT10aGlzLHI9bmV3IFVpbnQ4QXJyYXkoMCksIWUuY29tcHJlc3NlZCl7dC5uZXh0PTk7YnJlYWt9cmV0dXJuIHQubmV4dD01LGUuZGVmbGF0ZS5mbHVzaCgpO2Nhc2UgNTppZih0LnQwPXQuc2VudCx0LnQwKXt0Lm5leHQ9ODticmVha310LnQwPW5ldyBVaW50OEFycmF5KDApO2Nhc2UgODpyPXQudDA7Y2FzZSA5OmlmKCFlLmVuY3J5cHRlZCl7dC5uZXh0PTE5O2JyZWFrfXJldHVybiB0Lm5leHQ9MTIsZS5lbmNyeXB0LmFwcGVuZChyKTtjYXNlIDEyOnI9dC5zZW50LGk9ZS5lbmNyeXB0LmZsdXNoKCksbj1pLnNpZ25hdHVyZSwobz1uZXcgVWludDhBcnJheShyLmxlbmd0aCtpLmRhdGEubGVuZ3RoKSkuc2V0KHIsMCksby5zZXQoaS5kYXRhLHIubGVuZ3RoKSxyPW87Y2FzZSAxOTpyZXR1cm4gZS5lbmNyeXB0ZWQmJiFlLnppcENyeXB0b3x8IWUuc2lnbmVkfHwobj1lLmNyYzMyLmdldCgpKSx0LmFicnVwdCgicmV0dXJuIix7ZGF0YTpyLHNpZ25hdHVyZTpufSk7Y2FzZSAyMTpjYXNlImVuZCI6cmV0dXJuIHQuc3RvcCgpfX0pLHQsdGhpcyl9KSkpLGZ1bmN0aW9uKCl7cmV0dXJuIGUuYXBwbHkodGhpcyxhcmd1bWVudHMpfSl9XSksdH0oKTtmdW5jdGlvbiBkdyh0LGUsbixyLGksbyxhKXt0cnl7dmFyIHU9dFtvXShhKSxjPXUudmFsdWV9Y2F0Y2godCl7cmV0dXJuIHZvaWQgbih0KX11LmRvbmU/ZShjKTpQcm9taXNlLnJlc29sdmUoYykudGhlbihyLGkpfWZ1bmN0aW9uIGh3KHQpe3JldHVybiBmdW5jdGlvbigpe3ZhciBlPXRoaXMsbj1hcmd1bWVudHM7cmV0dXJuIG5ldyBQcm9taXNlKChmdW5jdGlvbihyLGkpe3ZhciBvPXQuYXBwbHkoZSxuKTtmdW5jdGlvbiBhKHQpe2R3KG8scixpLGEsdSwibmV4dCIsdCl9ZnVuY3Rpb24gdSh0KXtkdyhvLHIsaSxhLHUsInRocm93Iix0KX1hKHZvaWQgMCl9KSl9fXZhciBwdyx2dz17aW5pdDpmdW5jdGlvbih0KXt0LnNjcmlwdHMmJnQuc2NyaXB0cy5sZW5ndGgmJmltcG9ydFNjcmlwdHMuYXBwbHkodm9pZCAwLHQuc2NyaXB0cyk7dmFyIGUsbj10Lm9wdGlvbnM7c2VsZi5pbml0Q29kZWMmJnNlbGYuaW5pdENvZGVjKCksbi5jb2RlY1R5cGUuc3RhcnRzV2l0aCgiZGVmbGF0ZSIpP2U9c2VsZi5EZWZsYXRlOm4uY29kZWNUeXBlLnN0YXJ0c1dpdGgoImluZmxhdGUiKSYmKGU9c2VsZi5JbmZsYXRlKSxwdz1mdW5jdGlvbih0LGUsbil7cmV0dXJuIGUuY29kZWNUeXBlLnN0YXJ0c1dpdGgoImRlZmxhdGUiKT9uZXcgbHcodCxlLG4pOmUuY29kZWNUeXBlLnN0YXJ0c1dpdGgoImluZmxhdGUiKT9uZXcgc3codCxlLG4pOnZvaWQgMH0oZSxuLHQuY29uZmlnKX0sYXBwZW5kOmZ1bmN0aW9uKHQpe3JldHVybiBodyhyZWdlbmVyYXRvclJ1bnRpbWUubWFyaygoZnVuY3Rpb24gZSgpe3JldHVybiByZWdlbmVyYXRvclJ1bnRpbWUud3JhcCgoZnVuY3Rpb24oZSl7Zm9yKDs7KXN3aXRjaChlLnByZXY9ZS5uZXh0KXtjYXNlIDA6cmV0dXJuIGUubmV4dD0yLHB3LmFwcGVuZCh0LmRhdGEpO2Nhc2UgMjpyZXR1cm4gZS50MD1lLnNlbnQsZS5hYnJ1cHQoInJldHVybiIse2RhdGE6ZS50MH0pO2Nhc2UgNDpjYXNlImVuZCI6cmV0dXJuIGUuc3RvcCgpfX0pLGUpfSkpKSgpfSxmbHVzaDpmdW5jdGlvbigpe3JldHVybiBwdy5mbHVzaCgpfX07YWRkRXZlbnRMaXN0ZW5lcigibWVzc2FnZSIsZnVuY3Rpb24oKXt2YXIgdD1odyhyZWdlbmVyYXRvclJ1bnRpbWUubWFyaygoZnVuY3Rpb24gdChlKXt2YXIgbixyLGksbztyZXR1cm4gcmVnZW5lcmF0b3JSdW50aW1lLndyYXAoKGZ1bmN0aW9uKHQpe2Zvcig7Oylzd2l0Y2godC5wcmV2PXQubmV4dCl7Y2FzZSAwOmlmKG49ZS5kYXRhLHI9bi50eXBlLCEoaT12d1tyXSkpe3QubmV4dD0xOTticmVha31yZXR1cm4gdC5wcmV2PTQsbi5kYXRhJiYobi5kYXRhPW5ldyBVaW50OEFycmF5KG4uZGF0YSkpLHQubmV4dD04LGkobik7Y2FzZSA4OmlmKHQudDA9dC5zZW50LHQudDApe3QubmV4dD0xMTticmVha310LnQwPXt9O2Nhc2UgMTE6aWYoKG89dC50MCkudHlwZT1yLG8uZGF0YSl0cnl7by5kYXRhPW8uZGF0YS5idWZmZXIscG9zdE1lc3NhZ2Uobyxbby5kYXRhXSl9Y2F0Y2godCl7cG9zdE1lc3NhZ2Uobyl9ZWxzZSBwb3N0TWVzc2FnZShvKTt0Lm5leHQ9MTk7YnJlYWs7Y2FzZSAxNjp0LnByZXY9MTYsdC50MT10LmNhdGNoKDQpLHBvc3RNZXNzYWdlKHt0eXBlOnIsZXJyb3I6e21lc3NhZ2U6dC50MS5tZXNzYWdlLHN0YWNrOnQudDEuc3RhY2t9fSk7Y2FzZSAxOTpjYXNlImVuZCI6cmV0dXJuIHQuc3RvcCgpfX0pLHQsbnVsbCxbWzQsMTZdXSl9KSkpO3JldHVybiBmdW5jdGlvbihlKXtyZXR1cm4gdC5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fSgpKTt2YXIgeXc9d3MubWFwO05yKHt0YXJnZXQ6IkFycmF5Iixwcm90bzohMCxmb3JjZWQ6IWdnKCJtYXAiKX0se21hcDpmdW5jdGlvbih0KXtyZXR1cm4geXcodGhpcyx0LGFyZ3VtZW50cy5sZW5ndGg+MT9hcmd1bWVudHNbMV06dm9pZCAwKX19KTt2YXIgX3c9JGk7TnIoe3RhcmdldDoiQXJyYXkiLHByb3RvOiEwfSx7ZmlsbDpqYX0pLF93KCJmaWxsIiksKDAsQWMuZXhwb3J0cykoIlVpbnQxNiIsKGZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihlLG4scil7cmV0dXJuIHQodGhpcyxlLG4scil9fSkpO3ZhciBndz17fSxidz1FLHd3PUYseHc9Qm4uZixtdz1OYSxrdz0ib2JqZWN0Ij09dHlwZW9mIHdpbmRvdyYmd2luZG93JiZPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcz9PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh3aW5kb3cpOltdO2d3LmY9ZnVuY3Rpb24odCl7cmV0dXJuIGt3JiYiV2luZG93Ij09YncodCk/ZnVuY3Rpb24odCl7dHJ5e3JldHVybiB4dyh0KX1jYXRjaCh0KXtyZXR1cm4gbXcoa3cpfX0odCk6eHcod3codCkpfTt2YXIgQXc9e30sU3c9WHQ7QXcuZj1Tdzt2YXIgRXc9bixUdz1MdCxPdz1Bdyxqdz1rZS5mLEl3PWZ1bmN0aW9uKHQpe3ZhciBlPUV3LlN5bWJvbHx8KEV3LlN5bWJvbD17fSk7VHcoZSx0KXx8ancoZSx0LHt2YWx1ZTpPdy5mKHQpfSl9LFJ3PU5yLFB3PW4sTXc9VyxMdz1PZCxVdz1mLEN3PW0sRnc9byxCdz1udCxOdz1pLER3PUx0LHp3PWlzLEd3PUIsVnc9RCxXdz1ZLFl3PWZ0LEh3PWplLEt3PVJ0LHF3PUYsJHc9dWUsWHc9WnIsSnc9eSxRdz16aSxadz14aSx0eD1CbixleD1ndyxueD1scixyeD1yLGl4PWtlLG94PWdpLGF4PXMsdXg9d2gsY3g9emUuZXhwb3J0cyxmeD1tdC5leHBvcnRzLHN4PXJuLGx4PU50LGR4PVh0LGh4PUF3LHB4PUl3LHZ4PWJvLHl4PXhuLF94PXdzLmZvckVhY2gsZ3g9bm4oImhpZGRlbiIpLGJ4PWR4KCJ0b1ByaW1pdGl2ZSIpLHd4PXl4LnNldCx4eD15eC5nZXR0ZXJGb3IoIlN5bWJvbCIpLG14PU9iamVjdC5wcm90b3R5cGUsa3g9UHcuU3ltYm9sLEF4PWt4JiZreC5wcm90b3R5cGUsU3g9UHcuVHlwZUVycm9yLEV4PVB3LlFPYmplY3QsVHg9TXcoIkpTT04iLCJzdHJpbmdpZnkiKSxPeD1yeC5mLGp4PWl4LmYsSXg9ZXguZixSeD1heC5mLFB4PUN3KFtdLnB1c2gpLE14PWZ4KCJzeW1ib2xzIiksTHg9ZngoIm9wLXN5bWJvbHMiKSxVeD1meCgic3RyaW5nLXRvLXN5bWJvbC1yZWdpc3RyeSIpLEN4PWZ4KCJzeW1ib2wtdG8tc3RyaW5nLXJlZ2lzdHJ5IiksRng9ZngoIndrcyIpLEJ4PSFFeHx8IUV4LnByb3RvdHlwZXx8IUV4LnByb3RvdHlwZS5maW5kQ2hpbGQsTng9RncmJk53KChmdW5jdGlvbigpe3JldHVybiA3IT1RdyhqeCh7fSwiYSIse2dldDpmdW5jdGlvbigpe3JldHVybiBqeCh0aGlzLCJhIix7dmFsdWU6N30pLmF9fSkpLmF9KSk/ZnVuY3Rpb24odCxlLG4pe3ZhciByPU94KG14LGUpO3ImJmRlbGV0ZSBteFtlXSxqeCh0LGUsbiksciYmdCE9PW14JiZqeChteCxlLHIpfTpqeCxEeD1mdW5jdGlvbih0LGUpe3ZhciBuPU14W3RdPVF3KEF4KTtyZXR1cm4gd3gobix7dHlwZToiU3ltYm9sIix0YWc6dCxkZXNjcmlwdGlvbjplfSksRnd8fChuLmRlc2NyaXB0aW9uPWUpLG59LHp4PWZ1bmN0aW9uKHQsZSxuKXt0PT09bXgmJnp4KEx4LGUsbiksSHcodCk7dmFyIHI9JHcoZSk7cmV0dXJuIEh3KG4pLER3KE14LHIpPyhuLmVudW1lcmFibGU/KER3KHQsZ3gpJiZ0W2d4XVtyXSYmKHRbZ3hdW3JdPSExKSxuPVF3KG4se2VudW1lcmFibGU6SncoMCwhMSl9KSk6KER3KHQsZ3gpfHxqeCh0LGd4LEp3KDEse30pKSx0W2d4XVtyXT0hMCksTngodCxyLG4pKTpqeCh0LHIsbil9LEd4PWZ1bmN0aW9uKHQsZSl7SHcodCk7dmFyIG49cXcoZSkscj1adyhuKS5jb25jYXQoSHgobikpO3JldHVybiBfeChyLChmdW5jdGlvbihlKXtGdyYmIVV3KFZ4LG4sZSl8fHp4KHQsZSxuW2VdKX0pKSx0fSxWeD1mdW5jdGlvbih0KXt2YXIgZT0kdyh0KSxuPVV3KFJ4LHRoaXMsZSk7cmV0dXJuISh0aGlzPT09bXgmJkR3KE14LGUpJiYhRHcoTHgsZSkpJiYoIShufHwhRHcodGhpcyxlKXx8IUR3KE14LGUpfHxEdyh0aGlzLGd4KSYmdGhpc1tneF1bZV0pfHxuKX0sV3g9ZnVuY3Rpb24odCxlKXt2YXIgbj1xdyh0KSxyPSR3KGUpO2lmKG4hPT1teHx8IUR3KE14LHIpfHxEdyhMeCxyKSl7dmFyIGk9T3gobixyKTtyZXR1cm4haXx8IUR3KE14LHIpfHxEdyhuLGd4KSYmbltneF1bcl18fChpLmVudW1lcmFibGU9ITApLGl9fSxZeD1mdW5jdGlvbih0KXt2YXIgZT1JeChxdyh0KSksbj1bXTtyZXR1cm4gX3goZSwoZnVuY3Rpb24odCl7RHcoTXgsdCl8fER3KHN4LHQpfHxQeChuLHQpfSkpLG59LEh4PWZ1bmN0aW9uKHQpe3ZhciBlPXQ9PT1teCxuPUl4KGU/THg6cXcodCkpLHI9W107cmV0dXJuIF94KG4sKGZ1bmN0aW9uKHQpeyFEdyhNeCx0KXx8ZSYmIUR3KG14LHQpfHxQeChyLE14W3RdKX0pKSxyfTsoQnd8fChjeChBeD0oa3g9ZnVuY3Rpb24oKXtpZihXdyhBeCx0aGlzKSl0aHJvdyBTeCgiU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yIik7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP1h3KGFyZ3VtZW50c1swXSk6dm9pZCAwLGU9bHgodCksbj1mdW5jdGlvbih0KXt0aGlzPT09bXgmJlV3KG4sTHgsdCksRHcodGhpcyxneCkmJkR3KHRoaXNbZ3hdLGUpJiYodGhpc1tneF1bZV09ITEpLE54KHRoaXMsZSxKdygxLHQpKX07cmV0dXJuIEZ3JiZCeCYmTngobXgsZSx7Y29uZmlndXJhYmxlOiEwLHNldDpufSksRHgoZSx0KX0pLnByb3RvdHlwZSwidG9TdHJpbmciLChmdW5jdGlvbigpe3JldHVybiB4eCh0aGlzKS50YWd9KSksY3goa3gsIndpdGhvdXRTZXR0ZXIiLChmdW5jdGlvbih0KXtyZXR1cm4gRHgobHgodCksdCl9KSksYXguZj1WeCxpeC5mPXp4LG94LmY9R3gscnguZj1XeCx0eC5mPWV4LmY9WXgsbnguZj1IeCxoeC5mPWZ1bmN0aW9uKHQpe3JldHVybiBEeChkeCh0KSx0KX0sRncmJihqeChBeCwiZGVzY3JpcHRpb24iLHtjb25maWd1cmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHh4KHRoaXMpLmRlc2NyaXB0aW9ufX0pLGN4KG14LCJwcm9wZXJ0eUlzRW51bWVyYWJsZSIsVngse3Vuc2FmZTohMH0pKSksUncoe2dsb2JhbDohMCx3cmFwOiEwLGZvcmNlZDohQncsc2hhbTohQnd9LHtTeW1ib2w6a3h9KSxfeChadyhGeCksKGZ1bmN0aW9uKHQpe3B4KHQpfSkpLFJ3KHt0YXJnZXQ6IlN5bWJvbCIsc3RhdDohMCxmb3JjZWQ6IUJ3fSx7Zm9yOmZ1bmN0aW9uKHQpe3ZhciBlPVh3KHQpO2lmKER3KFV4LGUpKXJldHVybiBVeFtlXTt2YXIgbj1reChlKTtyZXR1cm4gVXhbZV09bixDeFtuXT1lLG59LGtleUZvcjpmdW5jdGlvbih0KXtpZighWXcodCkpdGhyb3cgU3godCsiIGlzIG5vdCBhIHN5bWJvbCIpO2lmKER3KEN4LHQpKXJldHVybiBDeFt0XX0sdXNlU2V0dGVyOmZ1bmN0aW9uKCl7Qng9ITB9LHVzZVNpbXBsZTpmdW5jdGlvbigpe0J4PSExfX0pLFJ3KHt0YXJnZXQ6Ik9iamVjdCIsc3RhdDohMCxmb3JjZWQ6IUJ3LHNoYW06IUZ3fSx7Y3JlYXRlOmZ1bmN0aW9uKHQsZSl7cmV0dXJuIHZvaWQgMD09PWU/UXcodCk6R3goUXcodCksZSl9LGRlZmluZVByb3BlcnR5Onp4LGRlZmluZVByb3BlcnRpZXM6R3gsZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOld4fSksUncoe3RhcmdldDoiT2JqZWN0IixzdGF0OiEwLGZvcmNlZDohQnd9LHtnZXRPd25Qcm9wZXJ0eU5hbWVzOll4LGdldE93blByb3BlcnR5U3ltYm9sczpIeH0pLFJ3KHt0YXJnZXQ6Ik9iamVjdCIsc3RhdDohMCxmb3JjZWQ6TncoKGZ1bmN0aW9uKCl7bnguZigxKX0pKX0se2dldE93blByb3BlcnR5U3ltYm9sczpmdW5jdGlvbih0KXtyZXR1cm4gbnguZihLdyh0KSl9fSksVHgpJiZSdyh7dGFyZ2V0OiJKU09OIixzdGF0OiEwLGZvcmNlZDohQnd8fE53KChmdW5jdGlvbigpe3ZhciB0PWt4KCk7cmV0dXJuIltudWxsXSIhPVR4KFt0XSl8fCJ7fSIhPVR4KHthOnR9KXx8Int9IiE9VHgoT2JqZWN0KHQpKX0pKX0se3N0cmluZ2lmeTpmdW5jdGlvbih0LGUsbil7dmFyIHI9dXgoYXJndW1lbnRzKSxpPWU7aWYoKFZ3KGUpfHx2b2lkIDAhPT10KSYmIVl3KHQpKXJldHVybiB6dyhlKXx8KGU9ZnVuY3Rpb24odCxlKXtpZihHdyhpKSYmKGU9VXcoaSx0aGlzLHQsZSkpLCFZdyhlKSlyZXR1cm4gZX0pLHJbMV09ZSxMdyhUeCxudWxsLHIpfX0pO2lmKCFBeFtieF0pe3ZhciBLeD1BeC52YWx1ZU9mO2N4KEF4LGJ4LChmdW5jdGlvbih0KXtyZXR1cm4gVXcoS3gsdGhpcyl9KSl9dngoa3gsIlN5bWJvbCIpLHN4W2d4XT0hMDt2YXIgcXg9TnIsJHg9byxYeD1uLEp4PW0sUXg9THQsWng9Qix0bT1ZLGVtPVpyLG5tPWtlLmYscm09bXIsaW09WHguU3ltYm9sLG9tPWltJiZpbS5wcm90b3R5cGU7aWYoJHgmJlp4KGltKSYmKCEoImRlc2NyaXB0aW9uImluIG9tKXx8dm9pZCAwIT09aW0oKS5kZXNjcmlwdGlvbikpe3ZhciBhbT17fSx1bT1mdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg8MXx8dm9pZCAwPT09YXJndW1lbnRzWzBdP3ZvaWQgMDplbShhcmd1bWVudHNbMF0pLGU9dG0ob20sdGhpcyk/bmV3IGltKHQpOnZvaWQgMD09PXQ/aW0oKTppbSh0KTtyZXR1cm4iIj09PXQmJihhbVtlXT0hMCksZX07cm0odW0saW0pLHVtLnByb3RvdHlwZT1vbSxvbS5jb25zdHJ1Y3Rvcj11bTt2YXIgY209IlN5bWJvbCh0ZXN0KSI9PVN0cmluZyhpbSgidGVzdCIpKSxmbT1KeChvbS50b1N0cmluZyksc209Sngob20udmFsdWVPZiksbG09L15TeW1ib2xcKCguKilcKVteKV0rJC8sZG09SngoIiIucmVwbGFjZSksaG09SngoIiIuc2xpY2UpO25tKG9tLCJkZXNjcmlwdGlvbiIse2NvbmZpZ3VyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXt2YXIgdD1zbSh0aGlzKSxlPWZtKHQpO2lmKFF4KGFtLHQpKXJldHVybiIiO3ZhciBuPWNtP2htKGUsNywtMSk6ZG0oZSxsbSwiJDEiKTtyZXR1cm4iIj09PW4/dm9pZCAwOm59fSkscXgoe2dsb2JhbDohMCxmb3JjZWQ6ITB9LHtTeW1ib2w6dW19KX1JdygiaXRlcmF0b3IiKTt2YXIgcG09byx2bT1Ubi5FWElTVFMseW09bSxfbT1rZS5mLGdtPUZ1bmN0aW9uLnByb3RvdHlwZSxibT15bShnbS50b1N0cmluZyksd209L2Z1bmN0aW9uXGIoPzpcc3xcL1wqW1xTXHNdKj9cKlwvfFwvXC9bXlxuXHJdKltcblxyXSspKihbXlxzKC9dKikvLHhtPXltKHdtLmV4ZWMpO3BtJiYhdm0mJl9tKGdtLCJuYW1lIix7Y29uZmlndXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3RyeXtyZXR1cm4geG0od20sYm0odGhpcykpWzFdfWNhdGNoKHQpe3JldHVybiIifX19KTt2YXIgbW0sa20sQW09amUsU209aSxFbT1uLlJlZ0V4cCxUbT1TbSgoZnVuY3Rpb24oKXt2YXIgdD1FbSgiYSIsInkiKTtyZXR1cm4gdC5sYXN0SW5kZXg9MixudWxsIT10LmV4ZWMoImFiY2QiKX0pKSxPbT1UbXx8U20oKGZ1bmN0aW9uKCl7cmV0dXJuIUVtKCJhIiwieSIpLnN0aWNreX0pKSxqbT17QlJPS0VOX0NBUkVUOlRtfHxTbSgoZnVuY3Rpb24oKXt2YXIgdD1FbSgiXnIiLCJneSIpO3JldHVybiB0Lmxhc3RJbmRleD0yLG51bGwhPXQuZXhlYygic3RyIil9KSksTUlTU0VEX1NUSUNLWTpPbSxVTlNVUFBPUlRFRF9ZOlRtfSxJbT1pLFJtPW4uUmVnRXhwLFBtPUltKChmdW5jdGlvbigpe3ZhciB0PVJtKCIuIiwicyIpO3JldHVybiEodC5kb3RBbGwmJnQuZXhlYygiXG4iKSYmInMiPT09dC5mbGFncyl9KSksTW09aSxMbT1uLlJlZ0V4cCxVbT1NbSgoZnVuY3Rpb24oKXt2YXIgdD1MbSgiKD88YT5iKSIsImciKTtyZXR1cm4iYiIhPT10LmV4ZWMoImIiKS5ncm91cHMuYXx8ImJjIiE9PSJiIi5yZXBsYWNlKHQsIiQ8YT5jIil9KSksQ209ZixGbT1tLEJtPVpyLE5tPWZ1bmN0aW9uKCl7dmFyIHQ9QW0odGhpcyksZT0iIjtyZXR1cm4gdC5nbG9iYWwmJihlKz0iZyIpLHQuaWdub3JlQ2FzZSYmKGUrPSJpIiksdC5tdWx0aWxpbmUmJihlKz0ibSIpLHQuZG90QWxsJiYoZSs9InMiKSx0LnVuaWNvZGUmJihlKz0idSIpLHQuc3RpY2t5JiYoZSs9InkiKSxlfSxEbT1qbSx6bT1tdC5leHBvcnRzLEdtPXppLFZtPXhuLmdldCxXbT1QbSxZbT1VbSxIbT16bSgibmF0aXZlLXN0cmluZy1yZXBsYWNlIixTdHJpbmcucHJvdG90eXBlLnJlcGxhY2UpLEttPVJlZ0V4cC5wcm90b3R5cGUuZXhlYyxxbT1LbSwkbT1GbSgiIi5jaGFyQXQpLFhtPUZtKCIiLmluZGV4T2YpLEptPUZtKCIiLnJlcGxhY2UpLFFtPUZtKCIiLnNsaWNlKSxabT0oa209L2IqL2csQ20oS20sbW09L2EvLCJhIiksQ20oS20sa20sImEiKSwwIT09bW0ubGFzdEluZGV4fHwwIT09a20ubGFzdEluZGV4KSx0az1EbS5CUk9LRU5fQ0FSRVQsZWs9dm9pZCAwIT09LygpPz8vLmV4ZWMoIiIpWzFdOyhabXx8ZWt8fHRrfHxXbXx8WW0pJiYocW09ZnVuY3Rpb24odCl7dmFyIGUsbixyLGksbyxhLHUsYz10aGlzLGY9Vm0oYykscz1CbSh0KSxsPWYucmF3O2lmKGwpcmV0dXJuIGwubGFzdEluZGV4PWMubGFzdEluZGV4LGU9Q20ocW0sbCxzKSxjLmxhc3RJbmRleD1sLmxhc3RJbmRleCxlO3ZhciBkPWYuZ3JvdXBzLGg9dGsmJmMuc3RpY2t5LHA9Q20oTm0sYyksdj1jLnNvdXJjZSx5PTAsXz1zO2lmKGgmJihwPUptKHAsInkiLCIiKSwtMT09PVhtKHAsImciKSYmKHArPSJnIiksXz1RbShzLGMubGFzdEluZGV4KSxjLmxhc3RJbmRleD4wJiYoIWMubXVsdGlsaW5lfHxjLm11bHRpbGluZSYmIlxuIiE9PSRtKHMsYy5sYXN0SW5kZXgtMSkpJiYodj0iKD86ICIrdisiKSIsXz0iICIrXyx5KyspLG49bmV3IFJlZ0V4cCgiXig/OiIrdisiKSIscCkpLGVrJiYobj1uZXcgUmVnRXhwKCJeIit2KyIkKD8hXFxzKSIscCkpLFptJiYocj1jLmxhc3RJbmRleCksaT1DbShLbSxoP246YyxfKSxoP2k/KGkuaW5wdXQ9UW0oaS5pbnB1dCx5KSxpWzBdPVFtKGlbMF0seSksaS5pbmRleD1jLmxhc3RJbmRleCxjLmxhc3RJbmRleCs9aVswXS5sZW5ndGgpOmMubGFzdEluZGV4PTA6Wm0mJmkmJihjLmxhc3RJbmRleD1jLmdsb2JhbD9pLmluZGV4K2lbMF0ubGVuZ3RoOnIpLGVrJiZpJiZpLmxlbmd0aD4xJiZDbShIbSxpWzBdLG4sKGZ1bmN0aW9uKCl7Zm9yKG89MTtvPGFyZ3VtZW50cy5sZW5ndGgtMjtvKyspdm9pZCAwPT09YXJndW1lbnRzW29dJiYoaVtvXT12b2lkIDApfSkpLGkmJmQpZm9yKGkuZ3JvdXBzPWE9R20obnVsbCksbz0wO288ZC5sZW5ndGg7bysrKWFbKHU9ZFtvXSlbMF1dPWlbdVsxXV07cmV0dXJuIGl9KTt2YXIgbmsscms7ZnVuY3Rpb24gaWsodCl7cmV0dXJuIGZ1bmN0aW9uKHQpe2lmKEFycmF5LmlzQXJyYXkodCkpcmV0dXJuIHVrKHQpfSh0KXx8ZnVuY3Rpb24odCl7aWYoInVuZGVmaW5lZCIhPXR5cGVvZiBTeW1ib2wmJm51bGwhPXRbU3ltYm9sLml0ZXJhdG9yXXx8bnVsbCE9dFsiQEBpdGVyYXRvciJdKXJldHVybiBBcnJheS5mcm9tKHQpfSh0KXx8YWsodCl8fGZ1bmN0aW9uKCl7dGhyb3cgbmV3IFR5cGVFcnJvcigiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2UuXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuIil9KCl9ZnVuY3Rpb24gb2sodCxlKXtyZXR1cm4gZnVuY3Rpb24odCl7aWYoQXJyYXkuaXNBcnJheSh0KSlyZXR1cm4gdH0odCl8fGZ1bmN0aW9uKHQsZSl7dmFyIG49bnVsbD09dD9udWxsOiJ1bmRlZmluZWQiIT10eXBlb2YgU3ltYm9sJiZ0W1N5bWJvbC5pdGVyYXRvcl18fHRbIkBAaXRlcmF0b3IiXTtpZihudWxsPT1uKXJldHVybjt2YXIgcixpLG89W10sYT0hMCx1PSExO3RyeXtmb3Iobj1uLmNhbGwodCk7IShhPShyPW4ubmV4dCgpKS5kb25lKSYmKG8ucHVzaChyLnZhbHVlKSwhZXx8by5sZW5ndGghPT1lKTthPSEwKTt9Y2F0Y2godCl7dT0hMCxpPXR9ZmluYWxseXt0cnl7YXx8bnVsbD09bi5yZXR1cm58fG4ucmV0dXJuKCl9ZmluYWxseXtpZih1KXRocm93IGl9fXJldHVybiBvfSh0LGUpfHxhayh0LGUpfHxmdW5jdGlvbigpe3Rocm93IG5ldyBUeXBlRXJyb3IoIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2UuXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuIil9KCl9ZnVuY3Rpb24gYWsodCxlKXtpZih0KXtpZigic3RyaW5nIj09dHlwZW9mIHQpcmV0dXJuIHVrKHQsZSk7dmFyIG49T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHQpLnNsaWNlKDgsLTEpO3JldHVybiJPYmplY3QiPT09biYmdC5jb25zdHJ1Y3RvciYmKG49dC5jb25zdHJ1Y3Rvci5uYW1lKSwiTWFwIj09PW58fCJTZXQiPT09bj9BcnJheS5mcm9tKHQpOiJBcmd1bWVudHMiPT09bnx8L14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3Qobik/dWsodCxlKTp2b2lkIDB9fWZ1bmN0aW9uIHVrKHQsZSl7KG51bGw9PWV8fGU+dC5sZW5ndGgpJiYoZT10Lmxlbmd0aCk7Zm9yKHZhciBuPTAscj1uZXcgQXJyYXkoZSk7bjxlO24rKylyW25dPXRbbl07cmV0dXJuIHJ9TnIoe3RhcmdldDoiUmVnRXhwIixwcm90bzohMCxmb3JjZWQ6Ly4vLmV4ZWMhPT1xbX0se2V4ZWM6cW19KTtmdW5jdGlvbiBjayh0KXtyZXR1cm4gZmsodC5tYXAoKGZ1bmN0aW9uKHQpe3ZhciBlPW9rKHQsMiksbj1lWzBdLHI9ZVsxXTtyZXR1cm4gbmV3IEFycmF5KG4pLmZpbGwociwwLG4pfSkpKX1mdW5jdGlvbiBmayh0KXtyZXR1cm4gdC5yZWR1Y2UoKGZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQuY29uY2F0KEFycmF5LmlzQXJyYXkoZSk/ZmsoZSk6ZSl9KSxbXSl9dmFyIHNrPShuaz1bMCwxLDIsM10pLmNvbmNhdC5hcHBseShuayxpayhjayhbWzIsNF0sWzIsNV0sWzQsNl0sWzQsN10sWzgsOF0sWzgsOV0sWzE2LDEwXSxbMTYsMTFdLFszMiwxMl0sWzMyLDEzXSxbNjQsMTRdLFs2NCwxNV0sWzIsMF0sWzEsMTZdLFsxLDE3XSxbMiwxOF0sWzIsMTldLFs0LDIwXSxbNCwyMV0sWzgsMjJdLFs4LDIzXSxbMTYsMjRdLFsxNiwyNV0sWzMyLDI2XSxbMzIsMjddLFs2NCwyOF0sWzY0LDI5XV0pKSk7ZnVuY3Rpb24gbGsoKXt2YXIgdD10aGlzO2Z1bmN0aW9uIGUodCxlKXt2YXIgbj0wO2Rve258PTEmdCx0Pj4+PTEsbjw8PTF9d2hpbGUoLS1lPjApO3JldHVybiBuPj4+MX10LmJ1aWxkX3RyZWU9ZnVuY3Rpb24obil7dmFyIHIsaSxvLGE9dC5keW5fdHJlZSx1PXQuc3RhdF9kZXNjLnN0YXRpY190cmVlLGM9dC5zdGF0X2Rlc2MuZWxlbXMsZj0tMTtmb3Iobi5oZWFwX2xlbj0wLG4uaGVhcF9tYXg9NTczLHI9MDtyPGM7cisrKTAhPT1hWzIqcl0/KG4uaGVhcFsrK24uaGVhcF9sZW5dPWY9cixuLmRlcHRoW3JdPTApOmFbMipyKzFdPTA7Zm9yKDtuLmhlYXBfbGVuPDI7KWFbMioobz1uLmhlYXBbKytuLmhlYXBfbGVuXT1mPDI/KytmOjApXT0xLG4uZGVwdGhbb109MCxuLm9wdF9sZW4tLSx1JiYobi5zdGF0aWNfbGVuLT11WzIqbysxXSk7Zm9yKHQubWF4X2NvZGU9ZixyPU1hdGguZmxvb3Iobi5oZWFwX2xlbi8yKTtyPj0xO3ItLSluLnBxZG93bmhlYXAoYSxyKTtvPWM7ZG97cj1uLmhlYXBbMV0sbi5oZWFwWzFdPW4uaGVhcFtuLmhlYXBfbGVuLS1dLG4ucHFkb3duaGVhcChhLDEpLGk9bi5oZWFwWzFdLG4uaGVhcFstLW4uaGVhcF9tYXhdPXIsbi5oZWFwWy0tbi5oZWFwX21heF09aSxhWzIqb109YVsyKnJdK2FbMippXSxuLmRlcHRoW29dPU1hdGgubWF4KG4uZGVwdGhbcl0sbi5kZXB0aFtpXSkrMSxhWzIqcisxXT1hWzIqaSsxXT1vLG4uaGVhcFsxXT1vKyssbi5wcWRvd25oZWFwKGEsMSl9d2hpbGUobi5oZWFwX2xlbj49Mik7bi5oZWFwWy0tbi5oZWFwX21heF09bi5oZWFwWzFdLGZ1bmN0aW9uKGUpe3ZhciBuLHIsaSxvLGEsdSxjPXQuZHluX3RyZWUsZj10LnN0YXRfZGVzYy5zdGF0aWNfdHJlZSxzPXQuc3RhdF9kZXNjLmV4dHJhX2JpdHMsbD10LnN0YXRfZGVzYy5leHRyYV9iYXNlLGQ9dC5zdGF0X2Rlc2MubWF4X2xlbmd0aCxoPTA7Zm9yKG89MDtvPD0xNTtvKyspZS5ibF9jb3VudFtvXT0wO2ZvcihjWzIqZS5oZWFwW2UuaGVhcF9tYXhdKzFdPTAsbj1lLmhlYXBfbWF4KzE7bjw1NzM7bisrKShvPWNbMipjWzIqKHI9ZS5oZWFwW25dKSsxXSsxXSsxKT5kJiYobz1kLGgrKyksY1syKnIrMV09byxyPnQubWF4X2NvZGV8fChlLmJsX2NvdW50W29dKyssYT0wLHI+PWwmJihhPXNbci1sXSksdT1jWzIqcl0sZS5vcHRfbGVuKz11KihvK2EpLGYmJihlLnN0YXRpY19sZW4rPXUqKGZbMipyKzFdK2EpKSk7aWYoMCE9PWgpe2Rve2ZvcihvPWQtMTswPT09ZS5ibF9jb3VudFtvXTspby0tO2UuYmxfY291bnRbb10tLSxlLmJsX2NvdW50W28rMV0rPTIsZS5ibF9jb3VudFtkXS0tLGgtPTJ9d2hpbGUoaD4wKTtmb3Iobz1kOzAhPT1vO28tLSlmb3Iocj1lLmJsX2NvdW50W29dOzAhPT1yOykoaT1lLmhlYXBbLS1uXSk+dC5tYXhfY29kZXx8KGNbMippKzFdIT1vJiYoZS5vcHRfbGVuKz0oby1jWzIqaSsxXSkqY1syKmldLGNbMippKzFdPW8pLHItLSl9fShuKSxmdW5jdGlvbih0LG4scil7dmFyIGksbyxhLHU9W10sYz0wO2ZvcihpPTE7aTw9MTU7aSsrKXVbaV09Yz1jK3JbaS0xXTw8MTtmb3Iobz0wO288PW47bysrKTAhPT0oYT10WzIqbysxXSkmJih0WzIqb109ZSh1W2FdKyssYSkpfShhLHQubWF4X2NvZGUsbi5ibF9jb3VudCl9fWZ1bmN0aW9uIGRrKHQsZSxuLHIsaSl7dmFyIG89dGhpcztvLnN0YXRpY190cmVlPXQsby5leHRyYV9iaXRzPWUsby5leHRyYV9iYXNlPW4sby5lbGVtcz1yLG8ubWF4X2xlbmd0aD1pfWxrLl9sZW5ndGhfY29kZT0ocms9WzAsMSwyLDMsNCw1LDYsN10pLmNvbmNhdC5hcHBseShyayxpayhjayhbWzIsOF0sWzIsOV0sWzIsMTBdLFsyLDExXSxbNCwxMl0sWzQsMTNdLFs0LDE0XSxbNCwxNV0sWzgsMTZdLFs4LDE3XSxbOCwxOF0sWzgsMTldLFsxNiwyMF0sWzE2LDIxXSxbMTYsMjJdLFsxNiwyM10sWzMyLDI0XSxbMzIsMjVdLFszMiwyNl0sWzMxLDI3XSxbMSwyOF1dKSkpLGxrLmJhc2VfbGVuZ3RoPVswLDEsMiwzLDQsNSw2LDcsOCwxMCwxMiwxNCwxNiwyMCwyNCwyOCwzMiw0MCw0OCw1Niw2NCw4MCw5NiwxMTIsMTI4LDE2MCwxOTIsMjI0LDBdLGxrLmJhc2VfZGlzdD1bMCwxLDIsMyw0LDYsOCwxMiwxNiwyNCwzMiw0OCw2NCw5NiwxMjgsMTkyLDI1NiwzODQsNTEyLDc2OCwxMDI0LDE1MzYsMjA0OCwzMDcyLDQwOTYsNjE0NCw4MTkyLDEyMjg4LDE2Mzg0LDI0NTc2XSxsay5kX2NvZGU9ZnVuY3Rpb24odCl7cmV0dXJuIHQ8MjU2P3NrW3RdOnNrWzI1NisodD4+PjcpXX0sbGsuZXh0cmFfbGJpdHM9WzAsMCwwLDAsMCwwLDAsMCwxLDEsMSwxLDIsMiwyLDIsMywzLDMsMyw0LDQsNCw0LDUsNSw1LDUsMF0sbGsuZXh0cmFfZGJpdHM9WzAsMCwwLDAsMSwxLDIsMiwzLDMsNCw0LDUsNSw2LDYsNyw3LDgsOCw5LDksMTAsMTAsMTEsMTEsMTIsMTIsMTMsMTNdLGxrLmV4dHJhX2JsYml0cz1bMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwyLDMsN10sbGsuYmxfb3JkZXI9WzE2LDE3LDE4LDAsOCw3LDksNiwxMCw1LDExLDQsMTIsMywxMywyLDE0LDEsMTVdLGRrLnN0YXRpY19sdHJlZT1bMTIsOCwxNDAsOCw3Niw4LDIwNCw4LDQ0LDgsMTcyLDgsMTA4LDgsMjM2LDgsMjgsOCwxNTYsOCw5Miw4LDIyMCw4LDYwLDgsMTg4LDgsMTI0LDgsMjUyLDgsMiw4LDEzMCw4LDY2LDgsMTk0LDgsMzQsOCwxNjIsOCw5OCw4LDIyNiw4LDE4LDgsMTQ2LDgsODIsOCwyMTAsOCw1MCw4LDE3OCw4LDExNCw4LDI0Miw4LDEwLDgsMTM4LDgsNzQsOCwyMDIsOCw0Miw4LDE3MCw4LDEwNiw4LDIzNCw4LDI2LDgsMTU0LDgsOTAsOCwyMTgsOCw1OCw4LDE4Niw4LDEyMiw4LDI1MCw4LDYsOCwxMzQsOCw3MCw4LDE5OCw4LDM4LDgsMTY2LDgsMTAyLDgsMjMwLDgsMjIsOCwxNTAsOCw4Niw4LDIxNCw4LDU0LDgsMTgyLDgsMTE4LDgsMjQ2LDgsMTQsOCwxNDIsOCw3OCw4LDIwNiw4LDQ2LDgsMTc0LDgsMTEwLDgsMjM4LDgsMzAsOCwxNTgsOCw5NCw4LDIyMiw4LDYyLDgsMTkwLDgsMTI2LDgsMjU0LDgsMSw4LDEyOSw4LDY1LDgsMTkzLDgsMzMsOCwxNjEsOCw5Nyw4LDIyNSw4LDE3LDgsMTQ1LDgsODEsOCwyMDksOCw0OSw4LDE3Nyw4LDExMyw4LDI0MSw4LDksOCwxMzcsOCw3Myw4LDIwMSw4LDQxLDgsMTY5LDgsMTA1LDgsMjMzLDgsMjUsOCwxNTMsOCw4OSw4LDIxNyw4LDU3LDgsMTg1LDgsMTIxLDgsMjQ5LDgsNSw4LDEzMyw4LDY5LDgsMTk3LDgsMzcsOCwxNjUsOCwxMDEsOCwyMjksOCwyMSw4LDE0OSw4LDg1LDgsMjEzLDgsNTMsOCwxODEsOCwxMTcsOCwyNDUsOCwxMyw4LDE0MSw4LDc3LDgsMjA1LDgsNDUsOCwxNzMsOCwxMDksOCwyMzcsOCwyOSw4LDE1Nyw4LDkzLDgsMjIxLDgsNjEsOCwxODksOCwxMjUsOCwyNTMsOCwxOSw5LDI3NSw5LDE0Nyw5LDQwMyw5LDgzLDksMzM5LDksMjExLDksNDY3LDksNTEsOSwzMDcsOSwxNzksOSw0MzUsOSwxMTUsOSwzNzEsOSwyNDMsOSw0OTksOSwxMSw5LDI2Nyw5LDEzOSw5LDM5NSw5LDc1LDksMzMxLDksMjAzLDksNDU5LDksNDMsOSwyOTksOSwxNzEsOSw0MjcsOSwxMDcsOSwzNjMsOSwyMzUsOSw0OTEsOSwyNyw5LDI4Myw5LDE1NSw5LDQxMSw5LDkxLDksMzQ3LDksMjE5LDksNDc1LDksNTksOSwzMTUsOSwxODcsOSw0NDMsOSwxMjMsOSwzNzksOSwyNTEsOSw1MDcsOSw3LDksMjYzLDksMTM1LDksMzkxLDksNzEsOSwzMjcsOSwxOTksOSw0NTUsOSwzOSw5LDI5NSw5LDE2Nyw5LDQyMyw5LDEwMyw5LDM1OSw5LDIzMSw5LDQ4Nyw5LDIzLDksMjc5LDksMTUxLDksNDA3LDksODcsOSwzNDMsOSwyMTUsOSw0NzEsOSw1NSw5LDMxMSw5LDE4Myw5LDQzOSw5LDExOSw5LDM3NSw5LDI0Nyw5LDUwMyw5LDE1LDksMjcxLDksMTQzLDksMzk5LDksNzksOSwzMzUsOSwyMDcsOSw0NjMsOSw0Nyw5LDMwMyw5LDE3NSw5LDQzMSw5LDExMSw5LDM2Nyw5LDIzOSw5LDQ5NSw5LDMxLDksMjg3LDksMTU5LDksNDE1LDksOTUsOSwzNTEsOSwyMjMsOSw0NzksOSw2Myw5LDMxOSw5LDE5MSw5LDQ0Nyw5LDEyNyw5LDM4Myw5LDI1NSw5LDUxMSw5LDAsNyw2NCw3LDMyLDcsOTYsNywxNiw3LDgwLDcsNDgsNywxMTIsNyw4LDcsNzIsNyw0MCw3LDEwNCw3LDI0LDcsODgsNyw1Niw3LDEyMCw3LDQsNyw2OCw3LDM2LDcsMTAwLDcsMjAsNyw4NCw3LDUyLDcsMTE2LDcsMyw4LDEzMSw4LDY3LDgsMTk1LDgsMzUsOCwxNjMsOCw5OSw4LDIyNyw4XSxkay5zdGF0aWNfZHRyZWU9WzAsNSwxNiw1LDgsNSwyNCw1LDQsNSwyMCw1LDEyLDUsMjgsNSwyLDUsMTgsNSwxMCw1LDI2LDUsNiw1LDIyLDUsMTQsNSwzMCw1LDEsNSwxNyw1LDksNSwyNSw1LDUsNSwyMSw1LDEzLDUsMjksNSwzLDUsMTksNSwxMSw1LDI3LDUsNyw1LDIzLDVdLGRrLnN0YXRpY19sX2Rlc2M9bmV3IGRrKGRrLnN0YXRpY19sdHJlZSxsay5leHRyYV9sYml0cywyNTcsMjg2LDE1KSxkay5zdGF0aWNfZF9kZXNjPW5ldyBkayhkay5zdGF0aWNfZHRyZWUsbGsuZXh0cmFfZGJpdHMsMCwzMCwxNSksZGsuc3RhdGljX2JsX2Rlc2M9bmV3IGRrKG51bGwsbGsuZXh0cmFfYmxiaXRzLDAsMTksNyk7ZnVuY3Rpb24gaGsodCxlLG4scixpKXt2YXIgbz10aGlzO28uZ29vZF9sZW5ndGg9dCxvLm1heF9sYXp5PWUsby5uaWNlX2xlbmd0aD1uLG8ubWF4X2NoYWluPXIsby5mdW5jPWl9dmFyIHBrPVtuZXcgaGsoMCwwLDAsMCwwKSxuZXcgaGsoNCw0LDgsNCwxKSxuZXcgaGsoNCw1LDE2LDgsMSksbmV3IGhrKDQsNiwzMiwzMiwxKSxuZXcgaGsoNCw0LDE2LDE2LDIpLG5ldyBoayg4LDE2LDMyLDMyLDIpLG5ldyBoayg4LDE2LDEyOCwxMjgsMiksbmV3IGhrKDgsMzIsMTI4LDI1NiwyKSxuZXcgaGsoMzIsMTI4LDI1OCwxMDI0LDIpLG5ldyBoaygzMiwyNTgsMjU4LDQwOTYsMildLHZrPVsibmVlZCBkaWN0aW9uYXJ5Iiwic3RyZWFtIGVuZCIsIiIsIiIsInN0cmVhbSBlcnJvciIsImRhdGEgZXJyb3IiLCIiLCJidWZmZXIgZXJyb3IiLCIiLCIiXTtmdW5jdGlvbiB5ayh0LGUsbixyKXt2YXIgaT10WzIqZV0sbz10WzIqbl07cmV0dXJuIGk8b3x8aT09byYmcltlXTw9cltuXX1mdW5jdGlvbiBfaygpe3ZhciB0LGUsbixyLGksbyxhLHUsYyxmLHMsbCxkLGgscCx2LHksXyxnLGIsdyx4LG0sayxBLFMsRSxULE8saixJLFIsUCxNLEwsVSxDLEYsQixOPXRoaXMsRD1uZXcgbGssej1uZXcgbGssRz1uZXcgbGs7ZnVuY3Rpb24gVigpe3ZhciB0O2Zvcih0PTA7dDwyODY7dCsrKUlbMip0XT0wO2Zvcih0PTA7dDwzMDt0KyspUlsyKnRdPTA7Zm9yKHQ9MDt0PDE5O3QrKylQWzIqdF09MDtJWzUxMl09MSxOLm9wdF9sZW49Ti5zdGF0aWNfbGVuPTAsTD1VPTB9ZnVuY3Rpb24gVyh0LGUpe3ZhciBuLHI9LTEsaT10WzFdLG89MCxhPTcsdT00OzA9PT1pJiYoYT0xMzgsdT0zKSx0WzIqKGUrMSkrMV09NjU1MzU7Zm9yKHZhciBjPTA7Yzw9ZTtjKyspbj1pLGk9dFsyKihjKzEpKzFdLCsrbzxhJiZuPT1pfHwobzx1P1BbMipuXSs9bzowIT09bj8obiE9ciYmUFsyKm5dKyssUFszMl0rKyk6bzw9MTA/UFszNF0rKzpQWzM2XSsrLG89MCxyPW4sMD09PWk/KGE9MTM4LHU9Myk6bj09aT8oYT02LHU9Myk6KGE9Nyx1PTQpKX1mdW5jdGlvbiBZKHQpe04ucGVuZGluZ19idWZbTi5wZW5kaW5nKytdPXR9ZnVuY3Rpb24gSCh0KXtZKDI1NSZ0KSxZKHQ+Pj44JjI1NSl9ZnVuY3Rpb24gSyh0LGUpe3ZhciBuLHI9ZTtCPjE2LXI/KEgoRnw9KG49dCk8PEImNjU1MzUpLEY9bj4+PjE2LUIsQis9ci0xNik6KEZ8PXQ8PEImNjU1MzUsQis9cil9ZnVuY3Rpb24gcSh0LGUpe3ZhciBuPTIqdDtLKDY1NTM1JmVbbl0sNjU1MzUmZVtuKzFdKX1mdW5jdGlvbiAkKHQsZSl7dmFyIG4scixpPS0xLG89dFsxXSxhPTAsdT03LGM9NDtmb3IoMD09PW8mJih1PTEzOCxjPTMpLG49MDtuPD1lO24rKylpZihyPW8sbz10WzIqKG4rMSkrMV0sISgrK2E8dSYmcj09bykpe2lmKGE8Yylkb3txKHIsUCl9d2hpbGUoMCE9LS1hKTtlbHNlIDAhPT1yPyhyIT1pJiYocShyLFApLGEtLSkscSgxNixQKSxLKGEtMywyKSk6YTw9MTA/KHEoMTcsUCksSyhhLTMsMykpOihxKDE4LFApLEsoYS0xMSw3KSk7YT0wLGk9ciwwPT09bz8odT0xMzgsYz0zKTpyPT1vPyh1PTYsYz0zKToodT03LGM9NCl9fWZ1bmN0aW9uIFgoKXsxNj09Qj8oSChGKSxGPTAsQj0wKTpCPj04JiYoWSgyNTUmRiksRj4+Pj04LEItPTgpfWZ1bmN0aW9uIEoodCxlKXt2YXIgbixyLGk7aWYoTi5kaXN0X2J1ZltMXT10LE4ubGNfYnVmW0xdPTI1NSZlLEwrKywwPT09dD9JWzIqZV0rKzooVSsrLHQtLSxJWzIqKGxrLl9sZW5ndGhfY29kZVtlXSsyNTYrMSldKyssUlsyKmxrLmRfY29kZSh0KV0rKyksMD09KDgxOTEmTCkmJkU+Mil7Zm9yKG49OCpMLHI9dy15LGk9MDtpPDMwO2krKyluKz1SWzIqaV0qKDUrbGsuZXh0cmFfZGJpdHNbaV0pO2lmKG4+Pj49MyxVPE1hdGguZmxvb3IoTC8yKSYmbjxNYXRoLmZsb29yKHIvMikpcmV0dXJuITB9cmV0dXJuIEw9PU0tMX1mdW5jdGlvbiBRKHQsZSl7dmFyIG4scixpLG8sYT0wO2lmKDAhPT1MKWRve249Ti5kaXN0X2J1ZlthXSxyPU4ubGNfYnVmW2FdLGErKywwPT09bj9xKHIsdCk6KHEoKGk9bGsuX2xlbmd0aF9jb2RlW3JdKSsyNTYrMSx0KSwwIT09KG89bGsuZXh0cmFfbGJpdHNbaV0pJiZLKHItPWxrLmJhc2VfbGVuZ3RoW2ldLG8pLG4tLSxxKGk9bGsuZF9jb2RlKG4pLGUpLDAhPT0obz1say5leHRyYV9kYml0c1tpXSkmJksobi09bGsuYmFzZV9kaXN0W2ldLG8pKX13aGlsZShhPEwpO3EoMjU2LHQpLEM9dFs1MTNdfWZ1bmN0aW9uIFooKXtCPjg/SChGKTpCPjAmJlkoMjU1JkYpLEY9MCxCPTB9ZnVuY3Rpb24gdHQodCxlLG4pe0soMCsobj8xOjApLDMpLGZ1bmN0aW9uKHQsZSxuKXtaKCksQz04LG4mJihIKGUpLEgofmUpKSxOLnBlbmRpbmdfYnVmLnNldCh1LnN1YmFycmF5KHQsdCtlKSxOLnBlbmRpbmcpLE4ucGVuZGluZys9ZX0odCxlLCEwKX1mdW5jdGlvbiBldCh0LGUsbil7dmFyIHIsaSxvPTA7RT4wPyhELmJ1aWxkX3RyZWUoTiksei5idWlsZF90cmVlKE4pLG89ZnVuY3Rpb24oKXt2YXIgdDtmb3IoVyhJLEQubWF4X2NvZGUpLFcoUix6Lm1heF9jb2RlKSxHLmJ1aWxkX3RyZWUoTiksdD0xODt0Pj0zJiYwPT09UFsyKmxrLmJsX29yZGVyW3RdKzFdO3QtLSk7cmV0dXJuIE4ub3B0X2xlbis9MyoodCsxKSs1KzUrNCx0fSgpLHI9Ti5vcHRfbGVuKzMrNz4+PjMsKGk9Ti5zdGF0aWNfbGVuKzMrNz4+PjMpPD1yJiYocj1pKSk6cj1pPWUrNSxlKzQ8PXImJi0xIT10P3R0KHQsZSxuKTppPT1yPyhLKDIrKG4/MTowKSwzKSxRKGRrLnN0YXRpY19sdHJlZSxkay5zdGF0aWNfZHRyZWUpKTooSyg0KyhuPzE6MCksMyksZnVuY3Rpb24odCxlLG4pe3ZhciByO2ZvcihLKHQtMjU3LDUpLEsoZS0xLDUpLEsobi00LDQpLHI9MDtyPG47cisrKUsoUFsyKmxrLmJsX29yZGVyW3JdKzFdLDMpOyQoSSx0LTEpLCQoUixlLTEpfShELm1heF9jb2RlKzEsei5tYXhfY29kZSsxLG8rMSksUShJLFIpKSxWKCksbiYmWigpfWZ1bmN0aW9uIG50KGUpe2V0KHk+PTA/eTotMSx3LXksZSkseT13LHQuZmx1c2hfcGVuZGluZygpfWZ1bmN0aW9uIHJ0KCl7dmFyIGUsbixyLG87ZG97aWYoMD09PShvPWMtbS13KSYmMD09PXcmJjA9PT1tKW89aTtlbHNlIGlmKC0xPT1vKW8tLTtlbHNlIGlmKHc+PWkraS0yNjIpe3Uuc2V0KHUuc3ViYXJyYXkoaSxpK2kpLDApLHgtPWksdy09aSx5LT1pLHI9ZT1kO2Rve249NjU1MzUmc1stLXJdLHNbcl09bj49aT9uLWk6MH13aGlsZSgwIT0tLWUpO3I9ZT1pO2Rve249NjU1MzUmZlstLXJdLGZbcl09bj49aT9uLWk6MH13aGlsZSgwIT0tLWUpO28rPWl9aWYoMD09PXQuYXZhaWxfaW4pcmV0dXJuO2U9dC5yZWFkX2J1Zih1LHcrbSxvKSwobSs9ZSk+PTMmJihsPSgobD0yNTUmdVt3XSk8PHZeMjU1JnVbdysxXSkmcCl9d2hpbGUobTwyNjImJjAhPT10LmF2YWlsX2luKX1mdW5jdGlvbiBpdCh0KXt2YXIgZSxuLHI9QSxvPXcsYz1rLHM9dz5pLTI2Mj93LShpLTI2Mik6MCxsPWosZD1hLGg9dysyNTgscD11W28rYy0xXSx2PXVbbytjXTtrPj1PJiYocj4+PTIpLGw+bSYmKGw9bSk7ZG97aWYodVsoZT10KStjXT09diYmdVtlK2MtMV09PXAmJnVbZV09PXVbb10mJnVbKytlXT09dVtvKzFdKXtvKz0yLGUrKztkb3t9d2hpbGUodVsrK29dPT11WysrZV0mJnVbKytvXT09dVsrK2VdJiZ1Wysrb109PXVbKytlXSYmdVsrK29dPT11WysrZV0mJnVbKytvXT09dVsrK2VdJiZ1Wysrb109PXVbKytlXSYmdVsrK29dPT11WysrZV0mJnVbKytvXT09dVsrK2VdJiZvPGgpO2lmKG49MjU4LShoLW8pLG89aC0yNTgsbj5jKXtpZih4PXQsYz1uLG4+PWwpYnJlYWs7cD11W28rYy0xXSx2PXVbbytjXX19fXdoaWxlKCh0PTY1NTM1JmZbdCZkXSk+cyYmMCE9LS1yKTtyZXR1cm4gYzw9bT9jOm19ZnVuY3Rpb24gb3QodCl7cmV0dXJuIHQudG90YWxfaW49dC50b3RhbF9vdXQ9MCx0Lm1zZz1udWxsLE4ucGVuZGluZz0wLE4ucGVuZGluZ19vdXQ9MCxlPTExMyxyPTAsRC5keW5fdHJlZT1JLEQuc3RhdF9kZXNjPWRrLnN0YXRpY19sX2Rlc2Msei5keW5fdHJlZT1SLHouc3RhdF9kZXNjPWRrLnN0YXRpY19kX2Rlc2MsRy5keW5fdHJlZT1QLEcuc3RhdF9kZXNjPWRrLnN0YXRpY19ibF9kZXNjLEY9MCxCPTAsQz04LFYoKSxmdW5jdGlvbigpe2M9MippLHNbZC0xXT0wO2Zvcih2YXIgdD0wO3Q8ZC0xO3QrKylzW3RdPTA7Uz1wa1tFXS5tYXhfbGF6eSxPPXBrW0VdLmdvb2RfbGVuZ3RoLGo9cGtbRV0ubmljZV9sZW5ndGgsQT1wa1tFXS5tYXhfY2hhaW4sdz0wLHk9MCxtPTAsXz1rPTIsYj0wLGw9MH0oKSwwfU4uZGVwdGg9W10sTi5ibF9jb3VudD1bXSxOLmhlYXA9W10sST1bXSxSPVtdLFA9W10sTi5wcWRvd25oZWFwPWZ1bmN0aW9uKHQsZSl7Zm9yKHZhciBuPU4uaGVhcCxyPW5bZV0saT1lPDwxO2k8PU4uaGVhcF9sZW4mJihpPE4uaGVhcF9sZW4mJnlrKHQsbltpKzFdLG5baV0sTi5kZXB0aCkmJmkrKywheWsodCxyLG5baV0sTi5kZXB0aCkpOyluW2VdPW5baV0sZT1pLGk8PD0xO25bZV09cn0sTi5kZWZsYXRlSW5pdD1mdW5jdGlvbih0LGUscixjLGwseSl7cmV0dXJuIGN8fChjPTgpLGx8fChsPTgpLHl8fCh5PTApLHQubXNnPW51bGwsLTE9PWUmJihlPTYpLGw8MXx8bD45fHw4IT1jfHxyPDl8fHI+MTV8fGU8MHx8ZT45fHx5PDB8fHk+Mj8tMjoodC5kc3RhdGU9TixhPShpPTE8PChvPXIpKS0xLHA9KGQ9MTw8KGg9bCs3KSktMSx2PU1hdGguZmxvb3IoKGgrMy0xKS8zKSx1PW5ldyBVaW50OEFycmF5KDIqaSksZj1bXSxzPVtdLE09MTw8bCs2LE4ucGVuZGluZ19idWY9bmV3IFVpbnQ4QXJyYXkoNCpNKSxuPTQqTSxOLmRpc3RfYnVmPW5ldyBVaW50MTZBcnJheShNKSxOLmxjX2J1Zj1uZXcgVWludDhBcnJheShNKSxFPWUsVD15LG90KHQpKX0sTi5kZWZsYXRlRW5kPWZ1bmN0aW9uKCl7cmV0dXJuIDQyIT1lJiYxMTMhPWUmJjY2NiE9ZT8tMjooTi5sY19idWY9bnVsbCxOLmRpc3RfYnVmPW51bGwsTi5wZW5kaW5nX2J1Zj1udWxsLHM9bnVsbCxmPW51bGwsdT1udWxsLE4uZHN0YXRlPW51bGwsMTEzPT1lPy0zOjApfSxOLmRlZmxhdGVQYXJhbXM9ZnVuY3Rpb24odCxlLG4pe3ZhciByPTA7cmV0dXJuLTE9PWUmJihlPTYpLGU8MHx8ZT45fHxuPDB8fG4+Mj8tMjoocGtbRV0uZnVuYyE9cGtbZV0uZnVuYyYmMCE9PXQudG90YWxfaW4mJihyPXQuZGVmbGF0ZSgxKSksRSE9ZSYmKFM9cGtbRT1lXS5tYXhfbGF6eSxPPXBrW0VdLmdvb2RfbGVuZ3RoLGo9cGtbRV0ubmljZV9sZW5ndGgsQT1wa1tFXS5tYXhfY2hhaW4pLFQ9bixyKX0sTi5kZWZsYXRlU2V0RGljdGlvbmFyeT1mdW5jdGlvbih0LG4scil7dmFyIG8sYz1yLGQ9MDtpZighbnx8NDIhPWUpcmV0dXJuLTI7aWYoYzwzKXJldHVybiAwO2ZvcihjPmktMjYyJiYoZD1yLShjPWktMjYyKSksdS5zZXQobi5zdWJhcnJheShkLGQrYyksMCksdz1jLHk9YyxsPSgobD0yNTUmdVswXSk8PHZeMjU1JnVbMV0pJnAsbz0wO288PWMtMztvKyspbD0obDw8dl4yNTUmdVtvKzJdKSZwLGZbbyZhXT1zW2xdLHNbbF09bztyZXR1cm4gMH0sTi5kZWZsYXRlPWZ1bmN0aW9uKGMsaCl7dmFyIEEsTyxqLEksUixQO2lmKGg+NHx8aDwwKXJldHVybi0yO2lmKCFjLm5leHRfb3V0fHwhYy5uZXh0X2luJiYwIT09Yy5hdmFpbF9pbnx8NjY2PT1lJiY0IT1oKXJldHVybiBjLm1zZz12a1s0XSwtMjtpZigwPT09Yy5hdmFpbF9vdXQpcmV0dXJuIGMubXNnPXZrWzddLC01O2lmKHQ9YyxJPXIscj1oLDQyPT1lJiYoTz04KyhvLTg8PDQpPDw4LChqPShFLTEmMjU1KT4+MSk+MyYmKGo9MyksT3w9ajw8NiwwIT09dyYmKE98PTMyKSxlPTExMyxZKChQPU8rPTMxLU8lMzEpPj44JjI1NSksWSgyNTUmUCkpLDAhPT1OLnBlbmRpbmcpe2lmKHQuZmx1c2hfcGVuZGluZygpLDA9PT10LmF2YWlsX291dClyZXR1cm4gcj0tMSwwfWVsc2UgaWYoMD09PXQuYXZhaWxfaW4mJmg8PUkmJjQhPWgpcmV0dXJuIHQubXNnPXZrWzddLC01O2lmKDY2Nj09ZSYmMCE9PXQuYXZhaWxfaW4pcmV0dXJuIGMubXNnPXZrWzddLC01O2lmKDAhPT10LmF2YWlsX2lufHwwIT09bXx8MCE9aCYmNjY2IT1lKXtzd2l0Y2goUj0tMSxwa1tFXS5mdW5jKXtjYXNlIDA6Uj1mdW5jdGlvbihlKXt2YXIgcixvPTY1NTM1O2ZvcihvPm4tNSYmKG89bi01KTs7KXtpZihtPD0xKXtpZihydCgpLDA9PT1tJiYwPT1lKXJldHVybiAwO2lmKDA9PT1tKWJyZWFrfWlmKHcrPW0sbT0wLHI9eStvLCgwPT09d3x8dz49cikmJihtPXctcix3PXIsbnQoITEpLDA9PT10LmF2YWlsX291dCkpcmV0dXJuIDA7aWYody15Pj1pLTI2MiYmKG50KCExKSwwPT09dC5hdmFpbF9vdXQpKXJldHVybiAwfXJldHVybiBudCg0PT1lKSwwPT09dC5hdmFpbF9vdXQ/ND09ZT8yOjA6ND09ZT8zOjF9KGgpO2JyZWFrO2Nhc2UgMTpSPWZ1bmN0aW9uKGUpe2Zvcih2YXIgbixyPTA7Oyl7aWYobTwyNjIpe2lmKHJ0KCksbTwyNjImJjA9PWUpcmV0dXJuIDA7aWYoMD09PW0pYnJlYWt9aWYobT49MyYmKGw9KGw8PHZeMjU1JnVbdysyXSkmcCxyPTY1NTM1JnNbbF0sZlt3JmFdPXNbbF0sc1tsXT13KSwwIT09ciYmKHctciY2NTUzNSk8PWktMjYyJiYyIT1UJiYoXz1pdChyKSksXz49MylpZihuPUoody14LF8tMyksbS09XyxfPD1TJiZtPj0zKXtfLS07ZG97dysrLGw9KGw8PHZeMjU1JnVbdysyXSkmcCxyPTY1NTM1JnNbbF0sZlt3JmFdPXNbbF0sc1tsXT13fXdoaWxlKDAhPS0tXyk7dysrfWVsc2Ugdys9XyxfPTAsbD0oKGw9MjU1JnVbd10pPDx2XjI1NSZ1W3crMV0pJnA7ZWxzZSBuPUooMCwyNTUmdVt3XSksbS0tLHcrKztpZihuJiYobnQoITEpLDA9PT10LmF2YWlsX291dCkpcmV0dXJuIDB9cmV0dXJuIG50KDQ9PWUpLDA9PT10LmF2YWlsX291dD80PT1lPzI6MDo0PT1lPzM6MX0oaCk7YnJlYWs7Y2FzZSAyOlI9ZnVuY3Rpb24oZSl7Zm9yKHZhciBuLHIsbz0wOzspe2lmKG08MjYyKXtpZihydCgpLG08MjYyJiYwPT1lKXJldHVybiAwO2lmKDA9PT1tKWJyZWFrfWlmKG0+PTMmJihsPShsPDx2XjI1NSZ1W3crMl0pJnAsbz02NTUzNSZzW2xdLGZbdyZhXT1zW2xdLHNbbF09dyksaz1fLGc9eCxfPTIsMCE9PW8mJms8UyYmKHctbyY2NTUzNSk8PWktMjYyJiYoMiE9VCYmKF89aXQobykpLF88PTUmJigxPT1UfHwzPT1fJiZ3LXg+NDA5NikmJihfPTIpKSxrPj0zJiZfPD1rKXtyPXcrbS0zLG49Sih3LTEtZyxrLTMpLG0tPWstMSxrLT0yO2Rveysrdzw9ciYmKGw9KGw8PHZeMjU1JnVbdysyXSkmcCxvPTY1NTM1JnNbbF0sZlt3JmFdPXNbbF0sc1tsXT13KX13aGlsZSgwIT0tLWspO2lmKGI9MCxfPTIsdysrLG4mJihudCghMSksMD09PXQuYXZhaWxfb3V0KSlyZXR1cm4gMH1lbHNlIGlmKDAhPT1iKXtpZigobj1KKDAsMjU1JnVbdy0xXSkpJiZudCghMSksdysrLG0tLSwwPT09dC5hdmFpbF9vdXQpcmV0dXJuIDB9ZWxzZSBiPTEsdysrLG0tLX1yZXR1cm4gMCE9PWImJihuPUooMCwyNTUmdVt3LTFdKSxiPTApLG50KDQ9PWUpLDA9PT10LmF2YWlsX291dD80PT1lPzI6MDo0PT1lPzM6MX0oaCl9aWYoMiE9UiYmMyE9Unx8KGU9NjY2KSwwPT1SfHwyPT1SKXJldHVybiAwPT09dC5hdmFpbF9vdXQmJihyPS0xKSwwO2lmKDE9PVIpe2lmKDE9PWgpSygyLDMpLHEoMjU2LGRrLnN0YXRpY19sdHJlZSksWCgpLDErQysxMC1CPDkmJihLKDIsMykscSgyNTYsZGsuc3RhdGljX2x0cmVlKSxYKCkpLEM9NztlbHNlIGlmKHR0KDAsMCwhMSksMz09aClmb3IoQT0wO0E8ZDtBKyspc1tBXT0wO2lmKHQuZmx1c2hfcGVuZGluZygpLDA9PT10LmF2YWlsX291dClyZXR1cm4gcj0tMSwwfX1yZXR1cm4gNCE9aD8wOjF9fWZ1bmN0aW9uIGdrKCl7dmFyIHQ9dGhpczt0Lm5leHRfaW5faW5kZXg9MCx0Lm5leHRfb3V0X2luZGV4PTAsdC5hdmFpbF9pbj0wLHQudG90YWxfaW49MCx0LmF2YWlsX291dD0wLHQudG90YWxfb3V0PTB9ZnVuY3Rpb24gYmsodCl7dmFyIGUsbj1uZXcgZ2sscj0oZT10JiZ0LmNodW5rU2l6ZT90LmNodW5rU2l6ZTo2NTUzNikrNSooTWF0aC5mbG9vcihlLzE2MzgzKSsxKSxpPW5ldyBVaW50OEFycmF5KHIpLG89dD90LmxldmVsOi0xO3ZvaWQgMD09PW8mJihvPS0xKSxuLmRlZmxhdGVJbml0KG8pLG4ubmV4dF9vdXQ9aSx0aGlzLmFwcGVuZD1mdW5jdGlvbih0LGUpe3ZhciBvLGE9MCx1PTAsYz0wLGY9W107aWYodC5sZW5ndGgpe24ubmV4dF9pbl9pbmRleD0wLG4ubmV4dF9pbj10LG4uYXZhaWxfaW49dC5sZW5ndGg7ZG97aWYobi5uZXh0X291dF9pbmRleD0wLG4uYXZhaWxfb3V0PXIsMCE9bi5kZWZsYXRlKDApKXRocm93IG5ldyBFcnJvcigiZGVmbGF0aW5nOiAiK24ubXNnKTtuLm5leHRfb3V0X2luZGV4JiYobi5uZXh0X291dF9pbmRleD09cj9mLnB1c2gobmV3IFVpbnQ4QXJyYXkoaSkpOmYucHVzaChpLnNsaWNlKDAsbi5uZXh0X291dF9pbmRleCkpKSxjKz1uLm5leHRfb3V0X2luZGV4LGUmJm4ubmV4dF9pbl9pbmRleD4wJiZuLm5leHRfaW5faW5kZXghPWEmJihlKG4ubmV4dF9pbl9pbmRleCksYT1uLm5leHRfaW5faW5kZXgpfXdoaWxlKG4uYXZhaWxfaW4+MHx8MD09PW4uYXZhaWxfb3V0KTtyZXR1cm4gZi5sZW5ndGg+MT8obz1uZXcgVWludDhBcnJheShjKSxmLmZvckVhY2goKGZ1bmN0aW9uKHQpe28uc2V0KHQsdSksdSs9dC5sZW5ndGh9KSkpOm89ZlswXXx8bmV3IFVpbnQ4QXJyYXkoMCksb319LHRoaXMuZmx1c2g9ZnVuY3Rpb24oKXt2YXIgdCxlLG89MCxhPTAsdT1bXTtkb3tpZihuLm5leHRfb3V0X2luZGV4PTAsbi5hdmFpbF9vdXQ9ciwxIT0odD1uLmRlZmxhdGUoNCkpJiYwIT10KXRocm93IG5ldyBFcnJvcigiZGVmbGF0aW5nOiAiK24ubXNnKTtyLW4uYXZhaWxfb3V0PjAmJnUucHVzaChpLnNsaWNlKDAsbi5uZXh0X291dF9pbmRleCkpLGErPW4ubmV4dF9vdXRfaW5kZXh9d2hpbGUobi5hdmFpbF9pbj4wfHwwPT09bi5hdmFpbF9vdXQpO3JldHVybiBuLmRlZmxhdGVFbmQoKSxlPW5ldyBVaW50OEFycmF5KGEpLHUuZm9yRWFjaCgoZnVuY3Rpb24odCl7ZS5zZXQodCxvKSxvKz10Lmxlbmd0aH0pKSxlfX1nay5wcm90b3R5cGU9e2RlZmxhdGVJbml0OmZ1bmN0aW9uKHQsZSl7dmFyIG49dGhpcztyZXR1cm4gbi5kc3RhdGU9bmV3IF9rLGV8fChlPTE1KSxuLmRzdGF0ZS5kZWZsYXRlSW5pdChuLHQsZSl9LGRlZmxhdGU6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcztyZXR1cm4gZS5kc3RhdGU/ZS5kc3RhdGUuZGVmbGF0ZShlLHQpOi0yfSxkZWZsYXRlRW5kOmZ1bmN0aW9uKCl7dmFyIHQ9dGhpcztpZighdC5kc3RhdGUpcmV0dXJuLTI7dmFyIGU9dC5kc3RhdGUuZGVmbGF0ZUVuZCgpO3JldHVybiB0LmRzdGF0ZT1udWxsLGV9LGRlZmxhdGVQYXJhbXM6ZnVuY3Rpb24odCxlKXt2YXIgbj10aGlzO3JldHVybiBuLmRzdGF0ZT9uLmRzdGF0ZS5kZWZsYXRlUGFyYW1zKG4sdCxlKTotMn0sZGVmbGF0ZVNldERpY3Rpb25hcnk6ZnVuY3Rpb24odCxlKXt2YXIgbj10aGlzO3JldHVybiBuLmRzdGF0ZT9uLmRzdGF0ZS5kZWZsYXRlU2V0RGljdGlvbmFyeShuLHQsZSk6LTJ9LHJlYWRfYnVmOmZ1bmN0aW9uKHQsZSxuKXt2YXIgcj10aGlzLGk9ci5hdmFpbF9pbjtyZXR1cm4gaT5uJiYoaT1uKSwwPT09aT8wOihyLmF2YWlsX2luLT1pLHQuc2V0KHIubmV4dF9pbi5zdWJhcnJheShyLm5leHRfaW5faW5kZXgsci5uZXh0X2luX2luZGV4K2kpLGUpLHIubmV4dF9pbl9pbmRleCs9aSxyLnRvdGFsX2luKz1pLGkpfSxmbHVzaF9wZW5kaW5nOmZ1bmN0aW9uKCl7dmFyIHQ9dGhpcyxlPXQuZHN0YXRlLnBlbmRpbmc7ZT50LmF2YWlsX291dCYmKGU9dC5hdmFpbF9vdXQpLDAhPT1lJiYodC5uZXh0X291dC5zZXQodC5kc3RhdGUucGVuZGluZ19idWYuc3ViYXJyYXkodC5kc3RhdGUucGVuZGluZ19vdXQsdC5kc3RhdGUucGVuZGluZ19vdXQrZSksdC5uZXh0X291dF9pbmRleCksdC5uZXh0X291dF9pbmRleCs9ZSx0LmRzdGF0ZS5wZW5kaW5nX291dCs9ZSx0LnRvdGFsX291dCs9ZSx0LmF2YWlsX291dC09ZSx0LmRzdGF0ZS5wZW5kaW5nLT1lLDA9PT10LmRzdGF0ZS5wZW5kaW5nJiYodC5kc3RhdGUucGVuZGluZ19vdXQ9MCkpfX0sKDAsQWMuZXhwb3J0cykoIkludDMyIiwoZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKGUsbixyKXtyZXR1cm4gdCh0aGlzLGUsbixyKX19KSk7dmFyIHdrPVswLDEsMyw3LDE1LDMxLDYzLDEyNywyNTUsNTExLDEwMjMsMjA0Nyw0MDk1LDgxOTEsMTYzODMsMzI3NjcsNjU1MzVdLHhrPVs5Niw3LDI1NiwwLDgsODAsMCw4LDE2LDg0LDgsMTE1LDgyLDcsMzEsMCw4LDExMiwwLDgsNDgsMCw5LDE5Miw4MCw3LDEwLDAsOCw5NiwwLDgsMzIsMCw5LDE2MCwwLDgsMCwwLDgsMTI4LDAsOCw2NCwwLDksMjI0LDgwLDcsNiwwLDgsODgsMCw4LDI0LDAsOSwxNDQsODMsNyw1OSwwLDgsMTIwLDAsOCw1NiwwLDksMjA4LDgxLDcsMTcsMCw4LDEwNCwwLDgsNDAsMCw5LDE3NiwwLDgsOCwwLDgsMTM2LDAsOCw3MiwwLDksMjQwLDgwLDcsNCwwLDgsODQsMCw4LDIwLDg1LDgsMjI3LDgzLDcsNDMsMCw4LDExNiwwLDgsNTIsMCw5LDIwMCw4MSw3LDEzLDAsOCwxMDAsMCw4LDM2LDAsOSwxNjgsMCw4LDQsMCw4LDEzMiwwLDgsNjgsMCw5LDIzMiw4MCw3LDgsMCw4LDkyLDAsOCwyOCwwLDksMTUyLDg0LDcsODMsMCw4LDEyNCwwLDgsNjAsMCw5LDIxNiw4Miw3LDIzLDAsOCwxMDgsMCw4LDQ0LDAsOSwxODQsMCw4LDEyLDAsOCwxNDAsMCw4LDc2LDAsOSwyNDgsODAsNywzLDAsOCw4MiwwLDgsMTgsODUsOCwxNjMsODMsNywzNSwwLDgsMTE0LDAsOCw1MCwwLDksMTk2LDgxLDcsMTEsMCw4LDk4LDAsOCwzNCwwLDksMTY0LDAsOCwyLDAsOCwxMzAsMCw4LDY2LDAsOSwyMjgsODAsNyw3LDAsOCw5MCwwLDgsMjYsMCw5LDE0OCw4NCw3LDY3LDAsOCwxMjIsMCw4LDU4LDAsOSwyMTIsODIsNywxOSwwLDgsMTA2LDAsOCw0MiwwLDksMTgwLDAsOCwxMCwwLDgsMTM4LDAsOCw3NCwwLDksMjQ0LDgwLDcsNSwwLDgsODYsMCw4LDIyLDE5Miw4LDAsODMsNyw1MSwwLDgsMTE4LDAsOCw1NCwwLDksMjA0LDgxLDcsMTUsMCw4LDEwMiwwLDgsMzgsMCw5LDE3MiwwLDgsNiwwLDgsMTM0LDAsOCw3MCwwLDksMjM2LDgwLDcsOSwwLDgsOTQsMCw4LDMwLDAsOSwxNTYsODQsNyw5OSwwLDgsMTI2LDAsOCw2MiwwLDksMjIwLDgyLDcsMjcsMCw4LDExMCwwLDgsNDYsMCw5LDE4OCwwLDgsMTQsMCw4LDE0MiwwLDgsNzgsMCw5LDI1Miw5Niw3LDI1NiwwLDgsODEsMCw4LDE3LDg1LDgsMTMxLDgyLDcsMzEsMCw4LDExMywwLDgsNDksMCw5LDE5NCw4MCw3LDEwLDAsOCw5NywwLDgsMzMsMCw5LDE2MiwwLDgsMSwwLDgsMTI5LDAsOCw2NSwwLDksMjI2LDgwLDcsNiwwLDgsODksMCw4LDI1LDAsOSwxNDYsODMsNyw1OSwwLDgsMTIxLDAsOCw1NywwLDksMjEwLDgxLDcsMTcsMCw4LDEwNSwwLDgsNDEsMCw5LDE3OCwwLDgsOSwwLDgsMTM3LDAsOCw3MywwLDksMjQyLDgwLDcsNCwwLDgsODUsMCw4LDIxLDgwLDgsMjU4LDgzLDcsNDMsMCw4LDExNywwLDgsNTMsMCw5LDIwMiw4MSw3LDEzLDAsOCwxMDEsMCw4LDM3LDAsOSwxNzAsMCw4LDUsMCw4LDEzMywwLDgsNjksMCw5LDIzNCw4MCw3LDgsMCw4LDkzLDAsOCwyOSwwLDksMTU0LDg0LDcsODMsMCw4LDEyNSwwLDgsNjEsMCw5LDIxOCw4Miw3LDIzLDAsOCwxMDksMCw4LDQ1LDAsOSwxODYsMCw4LDEzLDAsOCwxNDEsMCw4LDc3LDAsOSwyNTAsODAsNywzLDAsOCw4MywwLDgsMTksODUsOCwxOTUsODMsNywzNSwwLDgsMTE1LDAsOCw1MSwwLDksMTk4LDgxLDcsMTEsMCw4LDk5LDAsOCwzNSwwLDksMTY2LDAsOCwzLDAsOCwxMzEsMCw4LDY3LDAsOSwyMzAsODAsNyw3LDAsOCw5MSwwLDgsMjcsMCw5LDE1MCw4NCw3LDY3LDAsOCwxMjMsMCw4LDU5LDAsOSwyMTQsODIsNywxOSwwLDgsMTA3LDAsOCw0MywwLDksMTgyLDAsOCwxMSwwLDgsMTM5LDAsOCw3NSwwLDksMjQ2LDgwLDcsNSwwLDgsODcsMCw4LDIzLDE5Miw4LDAsODMsNyw1MSwwLDgsMTE5LDAsOCw1NSwwLDksMjA2LDgxLDcsMTUsMCw4LDEwMywwLDgsMzksMCw5LDE3NCwwLDgsNywwLDgsMTM1LDAsOCw3MSwwLDksMjM4LDgwLDcsOSwwLDgsOTUsMCw4LDMxLDAsOSwxNTgsODQsNyw5OSwwLDgsMTI3LDAsOCw2MywwLDksMjIyLDgyLDcsMjcsMCw4LDExMSwwLDgsNDcsMCw5LDE5MCwwLDgsMTUsMCw4LDE0MywwLDgsNzksMCw5LDI1NCw5Niw3LDI1NiwwLDgsODAsMCw4LDE2LDg0LDgsMTE1LDgyLDcsMzEsMCw4LDExMiwwLDgsNDgsMCw5LDE5Myw4MCw3LDEwLDAsOCw5NiwwLDgsMzIsMCw5LDE2MSwwLDgsMCwwLDgsMTI4LDAsOCw2NCwwLDksMjI1LDgwLDcsNiwwLDgsODgsMCw4LDI0LDAsOSwxNDUsODMsNyw1OSwwLDgsMTIwLDAsOCw1NiwwLDksMjA5LDgxLDcsMTcsMCw4LDEwNCwwLDgsNDAsMCw5LDE3NywwLDgsOCwwLDgsMTM2LDAsOCw3MiwwLDksMjQxLDgwLDcsNCwwLDgsODQsMCw4LDIwLDg1LDgsMjI3LDgzLDcsNDMsMCw4LDExNiwwLDgsNTIsMCw5LDIwMSw4MSw3LDEzLDAsOCwxMDAsMCw4LDM2LDAsOSwxNjksMCw4LDQsMCw4LDEzMiwwLDgsNjgsMCw5LDIzMyw4MCw3LDgsMCw4LDkyLDAsOCwyOCwwLDksMTUzLDg0LDcsODMsMCw4LDEyNCwwLDgsNjAsMCw5LDIxNyw4Miw3LDIzLDAsOCwxMDgsMCw4LDQ0LDAsOSwxODUsMCw4LDEyLDAsOCwxNDAsMCw4LDc2LDAsOSwyNDksODAsNywzLDAsOCw4MiwwLDgsMTgsODUsOCwxNjMsODMsNywzNSwwLDgsMTE0LDAsOCw1MCwwLDksMTk3LDgxLDcsMTEsMCw4LDk4LDAsOCwzNCwwLDksMTY1LDAsOCwyLDAsOCwxMzAsMCw4LDY2LDAsOSwyMjksODAsNyw3LDAsOCw5MCwwLDgsMjYsMCw5LDE0OSw4NCw3LDY3LDAsOCwxMjIsMCw4LDU4LDAsOSwyMTMsODIsNywxOSwwLDgsMTA2LDAsOCw0MiwwLDksMTgxLDAsOCwxMCwwLDgsMTM4LDAsOCw3NCwwLDksMjQ1LDgwLDcsNSwwLDgsODYsMCw4LDIyLDE5Miw4LDAsODMsNyw1MSwwLDgsMTE4LDAsOCw1NCwwLDksMjA1LDgxLDcsMTUsMCw4LDEwMiwwLDgsMzgsMCw5LDE3MywwLDgsNiwwLDgsMTM0LDAsOCw3MCwwLDksMjM3LDgwLDcsOSwwLDgsOTQsMCw4LDMwLDAsOSwxNTcsODQsNyw5OSwwLDgsMTI2LDAsOCw2MiwwLDksMjIxLDgyLDcsMjcsMCw4LDExMCwwLDgsNDYsMCw5LDE4OSwwLDgsMTQsMCw4LDE0MiwwLDgsNzgsMCw5LDI1Myw5Niw3LDI1NiwwLDgsODEsMCw4LDE3LDg1LDgsMTMxLDgyLDcsMzEsMCw4LDExMywwLDgsNDksMCw5LDE5NSw4MCw3LDEwLDAsOCw5NywwLDgsMzMsMCw5LDE2MywwLDgsMSwwLDgsMTI5LDAsOCw2NSwwLDksMjI3LDgwLDcsNiwwLDgsODksMCw4LDI1LDAsOSwxNDcsODMsNyw1OSwwLDgsMTIxLDAsOCw1NywwLDksMjExLDgxLDcsMTcsMCw4LDEwNSwwLDgsNDEsMCw5LDE3OSwwLDgsOSwwLDgsMTM3LDAsOCw3MywwLDksMjQzLDgwLDcsNCwwLDgsODUsMCw4LDIxLDgwLDgsMjU4LDgzLDcsNDMsMCw4LDExNywwLDgsNTMsMCw5LDIwMyw4MSw3LDEzLDAsOCwxMDEsMCw4LDM3LDAsOSwxNzEsMCw4LDUsMCw4LDEzMywwLDgsNjksMCw5LDIzNSw4MCw3LDgsMCw4LDkzLDAsOCwyOSwwLDksMTU1LDg0LDcsODMsMCw4LDEyNSwwLDgsNjEsMCw5LDIxOSw4Miw3LDIzLDAsOCwxMDksMCw4LDQ1LDAsOSwxODcsMCw4LDEzLDAsOCwxNDEsMCw4LDc3LDAsOSwyNTEsODAsNywzLDAsOCw4MywwLDgsMTksODUsOCwxOTUsODMsNywzNSwwLDgsMTE1LDAsOCw1MSwwLDksMTk5LDgxLDcsMTEsMCw4LDk5LDAsOCwzNSwwLDksMTY3LDAsOCwzLDAsOCwxMzEsMCw4LDY3LDAsOSwyMzEsODAsNyw3LDAsOCw5MSwwLDgsMjcsMCw5LDE1MSw4NCw3LDY3LDAsOCwxMjMsMCw4LDU5LDAsOSwyMTUsODIsNywxOSwwLDgsMTA3LDAsOCw0MywwLDksMTgzLDAsOCwxMSwwLDgsMTM5LDAsOCw3NSwwLDksMjQ3LDgwLDcsNSwwLDgsODcsMCw4LDIzLDE5Miw4LDAsODMsNyw1MSwwLDgsMTE5LDAsOCw1NSwwLDksMjA3LDgxLDcsMTUsMCw4LDEwMywwLDgsMzksMCw5LDE3NSwwLDgsNywwLDgsMTM1LDAsOCw3MSwwLDksMjM5LDgwLDcsOSwwLDgsOTUsMCw4LDMxLDAsOSwxNTksODQsNyw5OSwwLDgsMTI3LDAsOCw2MywwLDksMjIzLDgyLDcsMjcsMCw4LDExMSwwLDgsNDcsMCw5LDE5MSwwLDgsMTUsMCw4LDE0MywwLDgsNzksMCw5LDI1NV0sbWs9WzgwLDUsMSw4Nyw1LDI1Nyw4Myw1LDE3LDkxLDUsNDA5Nyw4MSw1LDUsODksNSwxMDI1LDg1LDUsNjUsOTMsNSwxNjM4NSw4MCw1LDMsODgsNSw1MTMsODQsNSwzMyw5Miw1LDgxOTMsODIsNSw5LDkwLDUsMjA0OSw4Niw1LDEyOSwxOTIsNSwyNDU3Nyw4MCw1LDIsODcsNSwzODUsODMsNSwyNSw5MSw1LDYxNDUsODEsNSw3LDg5LDUsMTUzNyw4NSw1LDk3LDkzLDUsMjQ1NzcsODAsNSw0LDg4LDUsNzY5LDg0LDUsNDksOTIsNSwxMjI4OSw4Miw1LDEzLDkwLDUsMzA3Myw4Niw1LDE5MywxOTIsNSwyNDU3N10sa2s9WzMsNCw1LDYsNyw4LDksMTAsMTEsMTMsMTUsMTcsMTksMjMsMjcsMzEsMzUsNDMsNTEsNTksNjcsODMsOTksMTE1LDEzMSwxNjMsMTk1LDIyNywyNTgsMCwwXSxBaz1bMCwwLDAsMCwwLDAsMCwwLDEsMSwxLDEsMiwyLDIsMiwzLDMsMywzLDQsNCw0LDQsNSw1LDUsNSwwLDExMiwxMTJdLFNrPVsxLDIsMyw0LDUsNyw5LDEzLDE3LDI1LDMzLDQ5LDY1LDk3LDEyOSwxOTMsMjU3LDM4NSw1MTMsNzY5LDEwMjUsMTUzNywyMDQ5LDMwNzMsNDA5Nyw2MTQ1LDgxOTMsMTIyODksMTYzODUsMjQ1NzddLEVrPVswLDAsMCwwLDEsMSwyLDIsMywzLDQsNCw1LDUsNiw2LDcsNyw4LDgsOSw5LDEwLDEwLDExLDExLDEyLDEyLDEzLDEzXTtmdW5jdGlvbiBUaygpe3ZhciB0LGUsbixyLGksbztmdW5jdGlvbiBhKHQsZSxhLHUsYyxmLHMsbCxkLGgscCl7dmFyIHYseSxfLGcsYix3LHgsbSxrLEEsUyxFLFQsTyxqO0E9MCxiPWE7ZG97blt0W2UrQV1dKyssQSsrLGItLX13aGlsZSgwIT09Yik7aWYoblswXT09YSlyZXR1cm4gc1swXT0tMSxsWzBdPTAsMDtmb3IobT1sWzBdLHc9MTt3PD0xNSYmMD09PW5bd107dysrKTtmb3IoeD13LG08dyYmKG09dyksYj0xNTswIT09YiYmMD09PW5bYl07Yi0tKTtmb3IoXz1iLG0+YiYmKG09YiksbFswXT1tLE89MTw8dzt3PGI7dysrLE88PD0xKWlmKChPLT1uW3ddKTwwKXJldHVybi0zO2lmKChPLT1uW2JdKTwwKXJldHVybi0zO2ZvcihuW2JdKz1PLG9bMV09dz0wLEE9MSxUPTI7MCE9LS1iOylvW1RdPXcrPW5bQV0sVCsrLEErKztiPTAsQT0wO2RvezAhPT0odz10W2UrQV0pJiYocFtvW3ddKytdPWIpLEErK313aGlsZSgrK2I8YSk7Zm9yKGE9b1tfXSxvWzBdPWI9MCxBPTAsZz0tMSxFPS1tLGlbMF09MCxTPTAsaj0wO3g8PV87eCsrKWZvcih2PW5beF07MCE9di0tOyl7Zm9yKDt4PkUrbTspe2lmKGcrKyxqPShqPV8tKEUrPW0pKT5tP206aiwoeT0xPDwodz14LUUpKT52KzEmJih5LT12KzEsVD14LHc8aikpZm9yKDsrK3c8aiYmISgoeTw8PTEpPD1uWysrVF0pOyl5LT1uW1RdO2lmKGo9MTw8dyxoWzBdK2o+MTQ0MClyZXR1cm4tMztpW2ddPVM9aFswXSxoWzBdKz1qLDAhPT1nPyhvW2ddPWIsclswXT13LHJbMV09bSx3PWI+Pj5FLW0sclsyXT1TLWlbZy0xXS13LGQuc2V0KHIsMyooaVtnLTFdK3cpKSk6c1swXT1TfWZvcihyWzFdPXgtRSxBPj1hP3JbMF09MTkyOnBbQV08dT8oclswXT1wW0FdPDI1Nj8wOjk2LHJbMl09cFtBKytdKTooclswXT1mW3BbQV0tdV0rMTYrNjQsclsyXT1jW3BbQSsrXS11XSkseT0xPDx4LUUsdz1iPj4+RTt3PGo7dys9eSlkLnNldChyLDMqKFMrdykpO2Zvcih3PTE8PHgtMTswIT0oYiZ3KTt3Pj4+PTEpYl49dztmb3IoYl49dyxrPSgxPDxFKS0xOyhiJmspIT1vW2ddOylnLS0saz0oMTw8KEUtPW0pKS0xfXJldHVybiAwIT09TyYmMSE9Xz8tNTowfWZ1bmN0aW9uIHUoYSl7dmFyIHU7Zm9yKHR8fCh0PVtdLGU9W10sbj1uZXcgSW50MzJBcnJheSgxNikscj1bXSxpPW5ldyBJbnQzMkFycmF5KDE1KSxvPW5ldyBJbnQzMkFycmF5KDE2KSksZS5sZW5ndGg8YSYmKGU9W10pLHU9MDt1PGE7dSsrKWVbdV09MDtmb3IodT0wO3U8MTY7dSsrKW5bdV09MDtmb3IodT0wO3U8Mzt1Kyspclt1XT0wO2kuc2V0KG4uc3ViYXJyYXkoMCwxNSksMCksby5zZXQobi5zdWJhcnJheSgwLDE2KSwwKX10aGlzLmluZmxhdGVfdHJlZXNfYml0cz1mdW5jdGlvbihuLHIsaSxvLGMpe3ZhciBmO3JldHVybiB1KDE5KSx0WzBdPTAsLTM9PShmPWEobiwwLDE5LDE5LG51bGwsbnVsbCxpLHIsbyx0LGUpKT9jLm1zZz0ib3ZlcnN1YnNjcmliZWQgZHluYW1pYyBiaXQgbGVuZ3RocyB0cmVlIjotNSE9ZiYmMCE9PXJbMF18fChjLm1zZz0iaW5jb21wbGV0ZSBkeW5hbWljIGJpdCBsZW5ndGhzIHRyZWUiLGY9LTMpLGZ9LHRoaXMuaW5mbGF0ZV90cmVlc19keW5hbWljPWZ1bmN0aW9uKG4scixpLG8sYyxmLHMsbCxkKXt2YXIgaDtyZXR1cm4gdSgyODgpLHRbMF09MCwwIT0oaD1hKGksMCxuLDI1NyxrayxBayxmLG8sbCx0LGUpKXx8MD09PW9bMF0/KC0zPT1oP2QubXNnPSJvdmVyc3Vic2NyaWJlZCBsaXRlcmFsL2xlbmd0aCB0cmVlIjotNCE9aCYmKGQubXNnPSJpbmNvbXBsZXRlIGxpdGVyYWwvbGVuZ3RoIHRyZWUiLGg9LTMpLGgpOih1KDI4OCksMCE9KGg9YShpLG4sciwwLFNrLEVrLHMsYyxsLHQsZSkpfHwwPT09Y1swXSYmbj4yNTc/KC0zPT1oP2QubXNnPSJvdmVyc3Vic2NyaWJlZCBkaXN0YW5jZSB0cmVlIjotNT09aD8oZC5tc2c9ImluY29tcGxldGUgZGlzdGFuY2UgdHJlZSIsaD0tMyk6LTQhPWgmJihkLm1zZz0iZW1wdHkgZGlzdGFuY2UgdHJlZSB3aXRoIGxlbmd0aHMiLGg9LTMpLGgpOjApfX1Uay5pbmZsYXRlX3RyZWVzX2ZpeGVkPWZ1bmN0aW9uKHQsZSxuLHIpe3JldHVybiB0WzBdPTksZVswXT01LG5bMF09eGssclswXT1taywwfTtmdW5jdGlvbiBPaygpe3ZhciB0LGUsbixyLGk9dGhpcyxvPTAsYT0wLHU9MCxjPTAsZj0wLHM9MCxsPTAsZD0wLGg9MCxwPTA7ZnVuY3Rpb24gdih0LGUsbixyLGksbyxhLHUpe3ZhciBjLGYscyxsLGQsaCxwLHYseSxfLGcsYix3LHgsbSxrO3A9dS5uZXh0X2luX2luZGV4LHY9dS5hdmFpbF9pbixkPWEuYml0YixoPWEuYml0ayxfPSh5PWEud3JpdGUpPGEucmVhZD9hLnJlYWQteS0xOmEuZW5kLXksZz13a1t0XSxiPXdrW2VdO2Rve2Zvcig7aDwyMDspdi0tLGR8PSgyNTUmdS5yZWFkX2J5dGUocCsrKSk8PGgsaCs9ODtpZigwIT09KGw9KGY9bilbaz0zKigocz1yKSsoYz1kJmcpKV0pKWZvcig7Oyl7aWYoZD4+PWZbaysxXSxoLT1mW2srMV0sMCE9KDE2JmwpKXtmb3IobCY9MTUsdz1mW2srMl0rKGQmd2tbbF0pLGQ+Pj1sLGgtPWw7aDwxNTspdi0tLGR8PSgyNTUmdS5yZWFkX2J5dGUocCsrKSk8PGgsaCs9ODtmb3IobD0oZj1pKVtrPTMqKChzPW8pKyhjPWQmYikpXTs7KXtpZihkPj49ZltrKzFdLGgtPWZbaysxXSwwIT0oMTYmbCkpe2ZvcihsJj0xNTtoPGw7KXYtLSxkfD0oMjU1JnUucmVhZF9ieXRlKHArKykpPDxoLGgrPTg7aWYoeD1mW2srMl0rKGQmd2tbbF0pLGQ+Pj1sLGgtPWwsXy09dyx5Pj14KXktKG09eS14KT4wJiYyPnktbT8oYS53aW5kb3dbeSsrXT1hLndpbmRvd1ttKytdLGEud2luZG93W3krK109YS53aW5kb3dbbSsrXSx3LT0yKTooYS53aW5kb3cuc2V0KGEud2luZG93LnN1YmFycmF5KG0sbSsyKSx5KSx5Kz0yLG0rPTIsdy09Mik7ZWxzZXttPXkteDtkb3ttKz1hLmVuZH13aGlsZShtPDApO2lmKHc+KGw9YS5lbmQtbSkpe2lmKHctPWwseS1tPjAmJmw+eS1tKWRve2Eud2luZG93W3krK109YS53aW5kb3dbbSsrXX13aGlsZSgwIT0tLWwpO2Vsc2UgYS53aW5kb3cuc2V0KGEud2luZG93LnN1YmFycmF5KG0sbStsKSx5KSx5Kz1sLG0rPWwsbD0wO209MH19aWYoeS1tPjAmJnc+eS1tKWRve2Eud2luZG93W3krK109YS53aW5kb3dbbSsrXX13aGlsZSgwIT0tLXcpO2Vsc2UgYS53aW5kb3cuc2V0KGEud2luZG93LnN1YmFycmF5KG0sbSt3KSx5KSx5Kz13LG0rPXcsdz0wO2JyZWFrfWlmKDAhPSg2NCZsKSlyZXR1cm4gdS5tc2c9ImludmFsaWQgZGlzdGFuY2UgY29kZSIsdis9dz1oPj4zPCh3PXUuYXZhaWxfaW4tdik/aD4+Mzp3LHAtPXcsaC09dzw8MyxhLmJpdGI9ZCxhLmJpdGs9aCx1LmF2YWlsX2luPXYsdS50b3RhbF9pbis9cC11Lm5leHRfaW5faW5kZXgsdS5uZXh0X2luX2luZGV4PXAsYS53cml0ZT15LC0zO2MrPWZbaysyXSxsPWZbaz0zKihzKyhjKz1kJndrW2xdKSldfWJyZWFrfWlmKDAhPSg2NCZsKSlyZXR1cm4gMCE9KDMyJmwpPyh2Kz13PWg+PjM8KHc9dS5hdmFpbF9pbi12KT9oPj4zOncscC09dyxoLT13PDwzLGEuYml0Yj1kLGEuYml0az1oLHUuYXZhaWxfaW49dix1LnRvdGFsX2luKz1wLXUubmV4dF9pbl9pbmRleCx1Lm5leHRfaW5faW5kZXg9cCxhLndyaXRlPXksMSk6KHUubXNnPSJpbnZhbGlkIGxpdGVyYWwvbGVuZ3RoIGNvZGUiLHYrPXc9aD4+Mzwodz11LmF2YWlsX2luLXYpP2g+PjM6dyxwLT13LGgtPXc8PDMsYS5iaXRiPWQsYS5iaXRrPWgsdS5hdmFpbF9pbj12LHUudG90YWxfaW4rPXAtdS5uZXh0X2luX2luZGV4LHUubmV4dF9pbl9pbmRleD1wLGEud3JpdGU9eSwtMyk7aWYoYys9ZltrKzJdLDA9PT0obD1mW2s9MyoocysoYys9ZCZ3a1tsXSkpXSkpe2Q+Pj1mW2srMV0saC09ZltrKzFdLGEud2luZG93W3krK109ZltrKzJdLF8tLTticmVha319ZWxzZSBkPj49ZltrKzFdLGgtPWZbaysxXSxhLndpbmRvd1t5KytdPWZbaysyXSxfLS19d2hpbGUoXz49MjU4JiZ2Pj0xMCk7cmV0dXJuIHYrPXc9aD4+Mzwodz11LmF2YWlsX2luLXYpP2g+PjM6dyxwLT13LGgtPXc8PDMsYS5iaXRiPWQsYS5iaXRrPWgsdS5hdmFpbF9pbj12LHUudG90YWxfaW4rPXAtdS5uZXh0X2luX2luZGV4LHUubmV4dF9pbl9pbmRleD1wLGEud3JpdGU9eSwwfWkuaW5pdD1mdW5jdGlvbihpLG8sYSx1LGMsZil7dD0wLGw9aSxkPW8sbj1hLGg9dSxyPWMscD1mLGU9bnVsbH0saS5wcm9jPWZ1bmN0aW9uKGkseSxfKXt2YXIgZyxiLHcseCxtLGssQSxTPTAsRT0wLFQ9MDtmb3IoVD15Lm5leHRfaW5faW5kZXgseD15LmF2YWlsX2luLFM9aS5iaXRiLEU9aS5iaXRrLGs9KG09aS53cml0ZSk8aS5yZWFkP2kucmVhZC1tLTE6aS5lbmQtbTs7KXN3aXRjaCh0KXtjYXNlIDA6aWYoaz49MjU4JiZ4Pj0xMCYmKGkuYml0Yj1TLGkuYml0az1FLHkuYXZhaWxfaW49eCx5LnRvdGFsX2luKz1ULXkubmV4dF9pbl9pbmRleCx5Lm5leHRfaW5faW5kZXg9VCxpLndyaXRlPW0sXz12KGwsZCxuLGgscixwLGkseSksVD15Lm5leHRfaW5faW5kZXgseD15LmF2YWlsX2luLFM9aS5iaXRiLEU9aS5iaXRrLGs9KG09aS53cml0ZSk8aS5yZWFkP2kucmVhZC1tLTE6aS5lbmQtbSwwIT1fKSl7dD0xPT1fPzc6OTticmVha311PWwsZT1uLGE9aCx0PTE7Y2FzZSAxOmZvcihnPXU7RTxnOyl7aWYoMD09PXgpcmV0dXJuIGkuYml0Yj1TLGkuYml0az1FLHkuYXZhaWxfaW49eCx5LnRvdGFsX2luKz1ULXkubmV4dF9pbl9pbmRleCx5Lm5leHRfaW5faW5kZXg9VCxpLndyaXRlPW0saS5pbmZsYXRlX2ZsdXNoKHksXyk7Xz0wLHgtLSxTfD0oMjU1JnkucmVhZF9ieXRlKFQrKykpPDxFLEUrPTh9aWYoUz4+Pj1lWyhiPTMqKGErKFMmd2tbZ10pKSkrMV0sRS09ZVtiKzFdLDA9PT0odz1lW2JdKSl7Yz1lW2IrMl0sdD02O2JyZWFrfWlmKDAhPSgxNiZ3KSl7Zj0xNSZ3LG89ZVtiKzJdLHQ9MjticmVha31pZigwPT0oNjQmdykpe3U9dyxhPWIvMytlW2IrMl07YnJlYWt9aWYoMCE9KDMyJncpKXt0PTc7YnJlYWt9cmV0dXJuIHQ9OSx5Lm1zZz0iaW52YWxpZCBsaXRlcmFsL2xlbmd0aCBjb2RlIixfPS0zLGkuYml0Yj1TLGkuYml0az1FLHkuYXZhaWxfaW49eCx5LnRvdGFsX2luKz1ULXkubmV4dF9pbl9pbmRleCx5Lm5leHRfaW5faW5kZXg9VCxpLndyaXRlPW0saS5pbmZsYXRlX2ZsdXNoKHksXyk7Y2FzZSAyOmZvcihnPWY7RTxnOyl7aWYoMD09PXgpcmV0dXJuIGkuYml0Yj1TLGkuYml0az1FLHkuYXZhaWxfaW49eCx5LnRvdGFsX2luKz1ULXkubmV4dF9pbl9pbmRleCx5Lm5leHRfaW5faW5kZXg9VCxpLndyaXRlPW0saS5pbmZsYXRlX2ZsdXNoKHksXyk7Xz0wLHgtLSxTfD0oMjU1JnkucmVhZF9ieXRlKFQrKykpPDxFLEUrPTh9bys9UyZ3a1tnXSxTPj49ZyxFLT1nLHU9ZCxlPXIsYT1wLHQ9MztjYXNlIDM6Zm9yKGc9dTtFPGc7KXtpZigwPT09eClyZXR1cm4gaS5iaXRiPVMsaS5iaXRrPUUseS5hdmFpbF9pbj14LHkudG90YWxfaW4rPVQteS5uZXh0X2luX2luZGV4LHkubmV4dF9pbl9pbmRleD1ULGkud3JpdGU9bSxpLmluZmxhdGVfZmx1c2goeSxfKTtfPTAseC0tLFN8PSgyNTUmeS5yZWFkX2J5dGUoVCsrKSk8PEUsRSs9OH1pZihTPj49ZVsoYj0zKihhKyhTJndrW2ddKSkpKzFdLEUtPWVbYisxXSwwIT0oMTYmKHc9ZVtiXSkpKXtmPTE1Jncscz1lW2IrMl0sdD00O2JyZWFrfWlmKDA9PSg2NCZ3KSl7dT13LGE9Yi8zK2VbYisyXTticmVha31yZXR1cm4gdD05LHkubXNnPSJpbnZhbGlkIGRpc3RhbmNlIGNvZGUiLF89LTMsaS5iaXRiPVMsaS5iaXRrPUUseS5hdmFpbF9pbj14LHkudG90YWxfaW4rPVQteS5uZXh0X2luX2luZGV4LHkubmV4dF9pbl9pbmRleD1ULGkud3JpdGU9bSxpLmluZmxhdGVfZmx1c2goeSxfKTtjYXNlIDQ6Zm9yKGc9ZjtFPGc7KXtpZigwPT09eClyZXR1cm4gaS5iaXRiPVMsaS5iaXRrPUUseS5hdmFpbF9pbj14LHkudG90YWxfaW4rPVQteS5uZXh0X2luX2luZGV4LHkubmV4dF9pbl9pbmRleD1ULGkud3JpdGU9bSxpLmluZmxhdGVfZmx1c2goeSxfKTtfPTAseC0tLFN8PSgyNTUmeS5yZWFkX2J5dGUoVCsrKSk8PEUsRSs9OH1zKz1TJndrW2ddLFM+Pj1nLEUtPWcsdD01O2Nhc2UgNTpmb3IoQT1tLXM7QTwwOylBKz1pLmVuZDtmb3IoOzAhPT1vOyl7aWYoMD09PWsmJihtPT1pLmVuZCYmMCE9PWkucmVhZCYmKGs9KG09MCk8aS5yZWFkP2kucmVhZC1tLTE6aS5lbmQtbSksMD09PWsmJihpLndyaXRlPW0sXz1pLmluZmxhdGVfZmx1c2goeSxfKSxrPShtPWkud3JpdGUpPGkucmVhZD9pLnJlYWQtbS0xOmkuZW5kLW0sbT09aS5lbmQmJjAhPT1pLnJlYWQmJihrPShtPTApPGkucmVhZD9pLnJlYWQtbS0xOmkuZW5kLW0pLDA9PT1rKSkpcmV0dXJuIGkuYml0Yj1TLGkuYml0az1FLHkuYXZhaWxfaW49eCx5LnRvdGFsX2luKz1ULXkubmV4dF9pbl9pbmRleCx5Lm5leHRfaW5faW5kZXg9VCxpLndyaXRlPW0saS5pbmZsYXRlX2ZsdXNoKHksXyk7aS53aW5kb3dbbSsrXT1pLndpbmRvd1tBKytdLGstLSxBPT1pLmVuZCYmKEE9MCksby0tfXQ9MDticmVhaztjYXNlIDY6aWYoMD09PWsmJihtPT1pLmVuZCYmMCE9PWkucmVhZCYmKGs9KG09MCk8aS5yZWFkP2kucmVhZC1tLTE6aS5lbmQtbSksMD09PWsmJihpLndyaXRlPW0sXz1pLmluZmxhdGVfZmx1c2goeSxfKSxrPShtPWkud3JpdGUpPGkucmVhZD9pLnJlYWQtbS0xOmkuZW5kLW0sbT09aS5lbmQmJjAhPT1pLnJlYWQmJihrPShtPTApPGkucmVhZD9pLnJlYWQtbS0xOmkuZW5kLW0pLDA9PT1rKSkpcmV0dXJuIGkuYml0Yj1TLGkuYml0az1FLHkuYXZhaWxfaW49eCx5LnRvdGFsX2luKz1ULXkubmV4dF9pbl9pbmRleCx5Lm5leHRfaW5faW5kZXg9VCxpLndyaXRlPW0saS5pbmZsYXRlX2ZsdXNoKHksXyk7Xz0wLGkud2luZG93W20rK109YyxrLS0sdD0wO2JyZWFrO2Nhc2UgNzppZihFPjcmJihFLT04LHgrKyxULS0pLGkud3JpdGU9bSxfPWkuaW5mbGF0ZV9mbHVzaCh5LF8pLGs9KG09aS53cml0ZSk8aS5yZWFkP2kucmVhZC1tLTE6aS5lbmQtbSxpLnJlYWQhPWkud3JpdGUpcmV0dXJuIGkuYml0Yj1TLGkuYml0az1FLHkuYXZhaWxfaW49eCx5LnRvdGFsX2luKz1ULXkubmV4dF9pbl9pbmRleCx5Lm5leHRfaW5faW5kZXg9VCxpLndyaXRlPW0saS5pbmZsYXRlX2ZsdXNoKHksXyk7dD04O2Nhc2UgODpyZXR1cm4gXz0xLGkuYml0Yj1TLGkuYml0az1FLHkuYXZhaWxfaW49eCx5LnRvdGFsX2luKz1ULXkubmV4dF9pbl9pbmRleCx5Lm5leHRfaW5faW5kZXg9VCxpLndyaXRlPW0saS5pbmZsYXRlX2ZsdXNoKHksXyk7Y2FzZSA5OnJldHVybiBfPS0zLGkuYml0Yj1TLGkuYml0az1FLHkuYXZhaWxfaW49eCx5LnRvdGFsX2luKz1ULXkubmV4dF9pbl9pbmRleCx5Lm5leHRfaW5faW5kZXg9VCxpLndyaXRlPW0saS5pbmZsYXRlX2ZsdXNoKHksXyk7ZGVmYXVsdDpyZXR1cm4gXz0tMixpLmJpdGI9UyxpLmJpdGs9RSx5LmF2YWlsX2luPXgseS50b3RhbF9pbis9VC15Lm5leHRfaW5faW5kZXgseS5uZXh0X2luX2luZGV4PVQsaS53cml0ZT1tLGkuaW5mbGF0ZV9mbHVzaCh5LF8pfX0saS5mcmVlPWZ1bmN0aW9uKCl7fX12YXIgams9WzE2LDE3LDE4LDAsOCw3LDksNiwxMCw1LDExLDQsMTIsMywxMywyLDE0LDEsMTVdO2Z1bmN0aW9uIElrKHQsZSl7dmFyIG4scj10aGlzLGk9MCxvPTAsYT0wLHU9MCxjPVswXSxmPVswXSxzPW5ldyBPayxsPTAsZD1uZXcgSW50MzJBcnJheSg0MzIwKSxoPW5ldyBUaztyLmJpdGs9MCxyLmJpdGI9MCxyLndpbmRvdz1uZXcgVWludDhBcnJheShlKSxyLmVuZD1lLHIucmVhZD0wLHIud3JpdGU9MCxyLnJlc2V0PWZ1bmN0aW9uKHQsZSl7ZSYmKGVbMF09MCksNj09aSYmcy5mcmVlKHQpLGk9MCxyLmJpdGs9MCxyLmJpdGI9MCxyLnJlYWQ9ci53cml0ZT0wfSxyLnJlc2V0KHQsbnVsbCksci5pbmZsYXRlX2ZsdXNoPWZ1bmN0aW9uKHQsZSl7dmFyIG4saSxvO3JldHVybiBpPXQubmV4dF9vdXRfaW5kZXgsKG49KChvPXIucmVhZCk8PXIud3JpdGU/ci53cml0ZTpyLmVuZCktbyk+dC5hdmFpbF9vdXQmJihuPXQuYXZhaWxfb3V0KSwwIT09biYmLTU9PWUmJihlPTApLHQuYXZhaWxfb3V0LT1uLHQudG90YWxfb3V0Kz1uLHQubmV4dF9vdXQuc2V0KHIud2luZG93LnN1YmFycmF5KG8sbytuKSxpKSxpKz1uLChvKz1uKT09ci5lbmQmJihvPTAsci53cml0ZT09ci5lbmQmJihyLndyaXRlPTApLChuPXIud3JpdGUtbyk+dC5hdmFpbF9vdXQmJihuPXQuYXZhaWxfb3V0KSwwIT09biYmLTU9PWUmJihlPTApLHQuYXZhaWxfb3V0LT1uLHQudG90YWxfb3V0Kz1uLHQubmV4dF9vdXQuc2V0KHIud2luZG93LnN1YmFycmF5KG8sbytuKSxpKSxpKz1uLG8rPW4pLHQubmV4dF9vdXRfaW5kZXg9aSxyLnJlYWQ9byxlfSxyLnByb2M9ZnVuY3Rpb24odCxlKXt2YXIgcCx2LHksXyxnLGIsdyx4O2ZvcihfPXQubmV4dF9pbl9pbmRleCxnPXQuYXZhaWxfaW4sdj1yLmJpdGIseT1yLmJpdGssdz0oYj1yLndyaXRlKTxyLnJlYWQ/ci5yZWFkLWItMTpyLmVuZC1iOzspe3ZhciBtPXZvaWQgMCxrPXZvaWQgMCxBPXZvaWQgMCxTPXZvaWQgMCxFPXZvaWQgMCxUPXZvaWQgMCxPPXZvaWQgMCxqPXZvaWQgMDtzd2l0Y2goaSl7Y2FzZSAwOmZvcig7eTwzOyl7aWYoMD09PWcpcmV0dXJuIHIuYml0Yj12LHIuYml0az15LHQuYXZhaWxfaW49Zyx0LnRvdGFsX2luKz1fLXQubmV4dF9pbl9pbmRleCx0Lm5leHRfaW5faW5kZXg9XyxyLndyaXRlPWIsci5pbmZsYXRlX2ZsdXNoKHQsZSk7ZT0wLGctLSx2fD0oMjU1JnQucmVhZF9ieXRlKF8rKykpPDx5LHkrPTh9c3dpdGNoKGw9MSYocD03JnYpLHA+Pj4xKXtjYXNlIDA6dj4+Pj0zLHY+Pj49cD03Jih5LT0zKSx5LT1wLGk9MTticmVhaztjYXNlIDE6bT1bXSxrPVtdLEE9W1tdXSxTPVtbXV0sVGsuaW5mbGF0ZV90cmVlc19maXhlZChtLGssQSxTKSxzLmluaXQobVswXSxrWzBdLEFbMF0sMCxTWzBdLDApLHY+Pj49Myx5LT0zLGk9NjticmVhaztjYXNlIDI6dj4+Pj0zLHktPTMsaT0zO2JyZWFrO2Nhc2UgMzpyZXR1cm4gdj4+Pj0zLHktPTMsaT05LHQubXNnPSJpbnZhbGlkIGJsb2NrIHR5cGUiLGU9LTMsci5iaXRiPXYsci5iaXRrPXksdC5hdmFpbF9pbj1nLHQudG90YWxfaW4rPV8tdC5uZXh0X2luX2luZGV4LHQubmV4dF9pbl9pbmRleD1fLHIud3JpdGU9YixyLmluZmxhdGVfZmx1c2godCxlKX1icmVhaztjYXNlIDE6Zm9yKDt5PDMyOyl7aWYoMD09PWcpcmV0dXJuIHIuYml0Yj12LHIuYml0az15LHQuYXZhaWxfaW49Zyx0LnRvdGFsX2luKz1fLXQubmV4dF9pbl9pbmRleCx0Lm5leHRfaW5faW5kZXg9XyxyLndyaXRlPWIsci5pbmZsYXRlX2ZsdXNoKHQsZSk7ZT0wLGctLSx2fD0oMjU1JnQucmVhZF9ieXRlKF8rKykpPDx5LHkrPTh9aWYoKH52Pj4+MTYmNjU1MzUpIT0oNjU1MzUmdikpcmV0dXJuIGk9OSx0Lm1zZz0iaW52YWxpZCBzdG9yZWQgYmxvY2sgbGVuZ3RocyIsZT0tMyxyLmJpdGI9dixyLmJpdGs9eSx0LmF2YWlsX2luPWcsdC50b3RhbF9pbis9Xy10Lm5leHRfaW5faW5kZXgsdC5uZXh0X2luX2luZGV4PV8sci53cml0ZT1iLHIuaW5mbGF0ZV9mbHVzaCh0LGUpO289NjU1MzUmdix2PXk9MCxpPTAhPT1vPzI6MCE9PWw/NzowO2JyZWFrO2Nhc2UgMjppZigwPT09ZylyZXR1cm4gci5iaXRiPXYsci5iaXRrPXksdC5hdmFpbF9pbj1nLHQudG90YWxfaW4rPV8tdC5uZXh0X2luX2luZGV4LHQubmV4dF9pbl9pbmRleD1fLHIud3JpdGU9YixyLmluZmxhdGVfZmx1c2godCxlKTtpZigwPT09dyYmKGI9PXIuZW5kJiYwIT09ci5yZWFkJiYodz0oYj0wKTxyLnJlYWQ/ci5yZWFkLWItMTpyLmVuZC1iKSwwPT09dyYmKHIud3JpdGU9YixlPXIuaW5mbGF0ZV9mbHVzaCh0LGUpLHc9KGI9ci53cml0ZSk8ci5yZWFkP3IucmVhZC1iLTE6ci5lbmQtYixiPT1yLmVuZCYmMCE9PXIucmVhZCYmKHc9KGI9MCk8ci5yZWFkP3IucmVhZC1iLTE6ci5lbmQtYiksMD09PXcpKSlyZXR1cm4gci5iaXRiPXYsci5iaXRrPXksdC5hdmFpbF9pbj1nLHQudG90YWxfaW4rPV8tdC5uZXh0X2luX2luZGV4LHQubmV4dF9pbl9pbmRleD1fLHIud3JpdGU9YixyLmluZmxhdGVfZmx1c2godCxlKTtpZihlPTAsKHA9byk+ZyYmKHA9ZykscD53JiYocD13KSxyLndpbmRvdy5zZXQodC5yZWFkX2J1ZihfLHApLGIpLF8rPXAsZy09cCxiKz1wLHctPXAsMCE9KG8tPXApKWJyZWFrO2k9MCE9PWw/NzowO2JyZWFrO2Nhc2UgMzpmb3IoO3k8MTQ7KXtpZigwPT09ZylyZXR1cm4gci5iaXRiPXYsci5iaXRrPXksdC5hdmFpbF9pbj1nLHQudG90YWxfaW4rPV8tdC5uZXh0X2luX2luZGV4LHQubmV4dF9pbl9pbmRleD1fLHIud3JpdGU9YixyLmluZmxhdGVfZmx1c2godCxlKTtlPTAsZy0tLHZ8PSgyNTUmdC5yZWFkX2J5dGUoXysrKSk8PHkseSs9OH1pZihhPXA9MTYzODMmdiwoMzEmcCk+Mjl8fChwPj41JjMxKT4yOSlyZXR1cm4gaT05LHQubXNnPSJ0b28gbWFueSBsZW5ndGggb3IgZGlzdGFuY2Ugc3ltYm9scyIsZT0tMyxyLmJpdGI9dixyLmJpdGs9eSx0LmF2YWlsX2luPWcsdC50b3RhbF9pbis9Xy10Lm5leHRfaW5faW5kZXgsdC5uZXh0X2luX2luZGV4PV8sci53cml0ZT1iLHIuaW5mbGF0ZV9mbHVzaCh0LGUpO2lmKHA9MjU4KygzMSZwKSsocD4+NSYzMSksIW58fG4ubGVuZ3RoPHApbj1bXTtlbHNlIGZvcih4PTA7eDxwO3grKyluW3hdPTA7dj4+Pj0xNCx5LT0xNCx1PTAsaT00O2Nhc2UgNDpmb3IoO3U8NCsoYT4+PjEwKTspe2Zvcig7eTwzOyl7aWYoMD09PWcpcmV0dXJuIHIuYml0Yj12LHIuYml0az15LHQuYXZhaWxfaW49Zyx0LnRvdGFsX2luKz1fLXQubmV4dF9pbl9pbmRleCx0Lm5leHRfaW5faW5kZXg9XyxyLndyaXRlPWIsci5pbmZsYXRlX2ZsdXNoKHQsZSk7ZT0wLGctLSx2fD0oMjU1JnQucmVhZF9ieXRlKF8rKykpPDx5LHkrPTh9bltqa1t1KytdXT03JnYsdj4+Pj0zLHktPTN9Zm9yKDt1PDE5OyluW2prW3UrK11dPTA7aWYoY1swXT03LDAhPShwPWguaW5mbGF0ZV90cmVlc19iaXRzKG4sYyxmLGQsdCkpKXJldHVybi0zPT0oZT1wKSYmKG49bnVsbCxpPTkpLHIuYml0Yj12LHIuYml0az15LHQuYXZhaWxfaW49Zyx0LnRvdGFsX2luKz1fLXQubmV4dF9pbl9pbmRleCx0Lm5leHRfaW5faW5kZXg9XyxyLndyaXRlPWIsci5pbmZsYXRlX2ZsdXNoKHQsZSk7dT0wLGk9NTtjYXNlIDU6Zm9yKDshKHU+PTI1OCsoMzEmKHA9YSkpKyhwPj41JjMxKSk7KXt2YXIgST12b2lkIDAsUj12b2lkIDA7Zm9yKHA9Y1swXTt5PHA7KXtpZigwPT09ZylyZXR1cm4gci5iaXRiPXYsci5iaXRrPXksdC5hdmFpbF9pbj1nLHQudG90YWxfaW4rPV8tdC5uZXh0X2luX2luZGV4LHQubmV4dF9pbl9pbmRleD1fLHIud3JpdGU9YixyLmluZmxhdGVfZmx1c2godCxlKTtlPTAsZy0tLHZ8PSgyNTUmdC5yZWFkX2J5dGUoXysrKSk8PHkseSs9OH1pZihwPWRbMyooZlswXSsodiZ3a1twXSkpKzFdLChSPWRbMyooZlswXSsodiZ3a1twXSkpKzJdKTwxNil2Pj4+PXAseS09cCxuW3UrK109UjtlbHNle2Zvcih4PTE4PT1SPzc6Ui0xNCxJPTE4PT1SPzExOjM7eTxwK3g7KXtpZigwPT09ZylyZXR1cm4gci5iaXRiPXYsci5iaXRrPXksdC5hdmFpbF9pbj1nLHQudG90YWxfaW4rPV8tdC5uZXh0X2luX2luZGV4LHQubmV4dF9pbl9pbmRleD1fLHIud3JpdGU9YixyLmluZmxhdGVfZmx1c2godCxlKTtlPTAsZy0tLHZ8PSgyNTUmdC5yZWFkX2J5dGUoXysrKSk8PHkseSs9OH1pZih5LT1wLEkrPSh2Pj4+PXApJndrW3hdLHY+Pj49eCx5LT14LCh4PXUpK0k+MjU4KygzMSYocD1hKSkrKHA+PjUmMzEpfHwxNj09UiYmeDwxKXJldHVybiBuPW51bGwsaT05LHQubXNnPSJpbnZhbGlkIGJpdCBsZW5ndGggcmVwZWF0IixlPS0zLHIuYml0Yj12LHIuYml0az15LHQuYXZhaWxfaW49Zyx0LnRvdGFsX2luKz1fLXQubmV4dF9pbl9pbmRleCx0Lm5leHRfaW5faW5kZXg9XyxyLndyaXRlPWIsci5pbmZsYXRlX2ZsdXNoKHQsZSk7Uj0xNj09Uj9uW3gtMV06MDtkb3tuW3grK109Un13aGlsZSgwIT0tLUkpO3U9eH19aWYoZlswXT0tMSxUPVtdLE89W10saj1bXSwoRT1bXSlbMF09OSxUWzBdPTYscD1hLDAhPShwPWguaW5mbGF0ZV90cmVlc19keW5hbWljKDI1NysoMzEmcCksMSsocD4+NSYzMSksbixFLFQsTyxqLGQsdCkpKXJldHVybi0zPT1wJiYobj1udWxsLGk9OSksZT1wLHIuYml0Yj12LHIuYml0az15LHQuYXZhaWxfaW49Zyx0LnRvdGFsX2luKz1fLXQubmV4dF9pbl9pbmRleCx0Lm5leHRfaW5faW5kZXg9XyxyLndyaXRlPWIsci5pbmZsYXRlX2ZsdXNoKHQsZSk7cy5pbml0KEVbMF0sVFswXSxkLE9bMF0sZCxqWzBdKSxpPTY7Y2FzZSA2OmlmKHIuYml0Yj12LHIuYml0az15LHQuYXZhaWxfaW49Zyx0LnRvdGFsX2luKz1fLXQubmV4dF9pbl9pbmRleCx0Lm5leHRfaW5faW5kZXg9XyxyLndyaXRlPWIsMSE9KGU9cy5wcm9jKHIsdCxlKSkpcmV0dXJuIHIuaW5mbGF0ZV9mbHVzaCh0LGUpO2lmKGU9MCxzLmZyZWUodCksXz10Lm5leHRfaW5faW5kZXgsZz10LmF2YWlsX2luLHY9ci5iaXRiLHk9ci5iaXRrLHc9KGI9ci53cml0ZSk8ci5yZWFkP3IucmVhZC1iLTE6ci5lbmQtYiwwPT09bCl7aT0wO2JyZWFrfWk9NztjYXNlIDc6aWYoci53cml0ZT1iLGU9ci5pbmZsYXRlX2ZsdXNoKHQsZSksdz0oYj1yLndyaXRlKTxyLnJlYWQ/ci5yZWFkLWItMTpyLmVuZC1iLHIucmVhZCE9ci53cml0ZSlyZXR1cm4gci5iaXRiPXYsci5iaXRrPXksdC5hdmFpbF9pbj1nLHQudG90YWxfaW4rPV8tdC5uZXh0X2luX2luZGV4LHQubmV4dF9pbl9pbmRleD1fLHIud3JpdGU9YixyLmluZmxhdGVfZmx1c2godCxlKTtpPTg7Y2FzZSA4OnJldHVybiBlPTEsci5iaXRiPXYsci5iaXRrPXksdC5hdmFpbF9pbj1nLHQudG90YWxfaW4rPV8tdC5uZXh0X2luX2luZGV4LHQubmV4dF9pbl9pbmRleD1fLHIud3JpdGU9YixyLmluZmxhdGVfZmx1c2godCxlKTtjYXNlIDk6cmV0dXJuIGU9LTMsci5iaXRiPXYsci5iaXRrPXksdC5hdmFpbF9pbj1nLHQudG90YWxfaW4rPV8tdC5uZXh0X2luX2luZGV4LHQubmV4dF9pbl9pbmRleD1fLHIud3JpdGU9YixyLmluZmxhdGVfZmx1c2godCxlKTtkZWZhdWx0OnJldHVybiBlPS0yLHIuYml0Yj12LHIuYml0az15LHQuYXZhaWxfaW49Zyx0LnRvdGFsX2luKz1fLXQubmV4dF9pbl9pbmRleCx0Lm5leHRfaW5faW5kZXg9XyxyLndyaXRlPWIsci5pbmZsYXRlX2ZsdXNoKHQsZSl9fX0sci5mcmVlPWZ1bmN0aW9uKHQpe3IucmVzZXQodCxudWxsKSxyLndpbmRvdz1udWxsLGQ9bnVsbH0sci5zZXRfZGljdGlvbmFyeT1mdW5jdGlvbih0LGUsbil7ci53aW5kb3cuc2V0KHQuc3ViYXJyYXkoZSxlK24pLDApLHIucmVhZD1yLndyaXRlPW59LHIuc3luY19wb2ludD1mdW5jdGlvbigpe3JldHVybiAxPT1pPzE6MH19dmFyIFJrPVswLDAsMjU1LDI1NV07ZnVuY3Rpb24gUGsoKXt2YXIgdD10aGlzO2Z1bmN0aW9uIGUodCl7cmV0dXJuIHQmJnQuaXN0YXRlPyh0LnRvdGFsX2luPXQudG90YWxfb3V0PTAsdC5tc2c9bnVsbCx0LmlzdGF0ZS5tb2RlPTcsdC5pc3RhdGUuYmxvY2tzLnJlc2V0KHQsbnVsbCksMCk6LTJ9dC5tb2RlPTAsdC5tZXRob2Q9MCx0Lndhcz1bMF0sdC5uZWVkPTAsdC5tYXJrZXI9MCx0LndiaXRzPTAsdC5pbmZsYXRlRW5kPWZ1bmN0aW9uKGUpe3JldHVybiB0LmJsb2NrcyYmdC5ibG9ja3MuZnJlZShlKSx0LmJsb2Nrcz1udWxsLDB9LHQuaW5mbGF0ZUluaXQ9ZnVuY3Rpb24obixyKXtyZXR1cm4gbi5tc2c9bnVsbCx0LmJsb2Nrcz1udWxsLHI8OHx8cj4xNT8odC5pbmZsYXRlRW5kKG4pLC0yKToodC53Yml0cz1yLG4uaXN0YXRlLmJsb2Nrcz1uZXcgSWsobiwxPDxyKSxlKG4pLDApfSx0LmluZmxhdGU9ZnVuY3Rpb24odCxlKXt2YXIgbixyO2lmKCF0fHwhdC5pc3RhdGV8fCF0Lm5leHRfaW4pcmV0dXJuLTI7dmFyIGk9dC5pc3RhdGU7Zm9yKGU9ND09ZT8tNTowLG49LTU7Oylzd2l0Y2goaS5tb2RlKXtjYXNlIDA6aWYoMD09PXQuYXZhaWxfaW4pcmV0dXJuIG47aWYobj1lLHQuYXZhaWxfaW4tLSx0LnRvdGFsX2luKyssOCE9KDE1JihpLm1ldGhvZD10LnJlYWRfYnl0ZSh0Lm5leHRfaW5faW5kZXgrKykpKSl7aS5tb2RlPTEzLHQubXNnPSJ1bmtub3duIGNvbXByZXNzaW9uIG1ldGhvZCIsaS5tYXJrZXI9NTticmVha31pZig4KyhpLm1ldGhvZD4+NCk+aS53Yml0cyl7aS5tb2RlPTEzLHQubXNnPSJpbnZhbGlkIHdpbmRvdyBzaXplIixpLm1hcmtlcj01O2JyZWFrfWkubW9kZT0xO2Nhc2UgMTppZigwPT09dC5hdmFpbF9pbilyZXR1cm4gbjtpZihuPWUsdC5hdmFpbF9pbi0tLHQudG90YWxfaW4rKyxyPTI1NSZ0LnJlYWRfYnl0ZSh0Lm5leHRfaW5faW5kZXgrKyksKChpLm1ldGhvZDw8OCkrciklMzEhPTApe2kubW9kZT0xMyx0Lm1zZz0iaW5jb3JyZWN0IGhlYWRlciBjaGVjayIsaS5tYXJrZXI9NTticmVha31pZigwPT0oMzImcikpe2kubW9kZT03O2JyZWFrfWkubW9kZT0yO2Nhc2UgMjppZigwPT09dC5hdmFpbF9pbilyZXR1cm4gbjtuPWUsdC5hdmFpbF9pbi0tLHQudG90YWxfaW4rKyxpLm5lZWQ9KDI1NSZ0LnJlYWRfYnl0ZSh0Lm5leHRfaW5faW5kZXgrKykpPDwyNCY0Mjc4MTkwMDgwLGkubW9kZT0zO2Nhc2UgMzppZigwPT09dC5hdmFpbF9pbilyZXR1cm4gbjtuPWUsdC5hdmFpbF9pbi0tLHQudG90YWxfaW4rKyxpLm5lZWQrPSgyNTUmdC5yZWFkX2J5dGUodC5uZXh0X2luX2luZGV4KyspKTw8MTYmMTY3MTE2ODAsaS5tb2RlPTQ7Y2FzZSA0OmlmKDA9PT10LmF2YWlsX2luKXJldHVybiBuO249ZSx0LmF2YWlsX2luLS0sdC50b3RhbF9pbisrLGkubmVlZCs9KDI1NSZ0LnJlYWRfYnl0ZSh0Lm5leHRfaW5faW5kZXgrKykpPDw4JjY1MjgwLGkubW9kZT01O2Nhc2UgNTpyZXR1cm4gMD09PXQuYXZhaWxfaW4/bjoobj1lLHQuYXZhaWxfaW4tLSx0LnRvdGFsX2luKyssaS5uZWVkKz0yNTUmdC5yZWFkX2J5dGUodC5uZXh0X2luX2luZGV4KyspLGkubW9kZT02LDIpO2Nhc2UgNjpyZXR1cm4gaS5tb2RlPTEzLHQubXNnPSJuZWVkIGRpY3Rpb25hcnkiLGkubWFya2VyPTAsLTI7Y2FzZSA3OmlmKC0zPT0obj1pLmJsb2Nrcy5wcm9jKHQsbikpKXtpLm1vZGU9MTMsaS5tYXJrZXI9MDticmVha31pZigwPT1uJiYobj1lKSwxIT1uKXJldHVybiBuO249ZSxpLmJsb2Nrcy5yZXNldCh0LGkud2FzKSxpLm1vZGU9MTI7Y2FzZSAxMjpyZXR1cm4gMTtjYXNlIDEzOnJldHVybi0zO2RlZmF1bHQ6cmV0dXJuLTJ9fSx0LmluZmxhdGVTZXREaWN0aW9uYXJ5PWZ1bmN0aW9uKHQsZSxuKXt2YXIgcj0wLGk9bjtpZighdHx8IXQuaXN0YXRlfHw2IT10LmlzdGF0ZS5tb2RlKXJldHVybi0yO3ZhciBvPXQuaXN0YXRlO3JldHVybiBpPj0xPDxvLndiaXRzJiYocj1uLShpPSgxPDxvLndiaXRzKS0xKSksby5ibG9ja3Muc2V0X2RpY3Rpb25hcnkoZSxyLGkpLG8ubW9kZT03LDB9LHQuaW5mbGF0ZVN5bmM9ZnVuY3Rpb24odCl7dmFyIG4scixpLG8sYTtpZighdHx8IXQuaXN0YXRlKXJldHVybi0yO3ZhciB1PXQuaXN0YXRlO2lmKDEzIT11Lm1vZGUmJih1Lm1vZGU9MTMsdS5tYXJrZXI9MCksMD09PShuPXQuYXZhaWxfaW4pKXJldHVybi01O2ZvcihyPXQubmV4dF9pbl9pbmRleCxpPXUubWFya2VyOzAhPT1uJiZpPDQ7KXQucmVhZF9ieXRlKHIpPT1Sa1tpXT9pKys6aT0wIT09dC5yZWFkX2J5dGUocik/MDo0LWkscisrLG4tLTtyZXR1cm4gdC50b3RhbF9pbis9ci10Lm5leHRfaW5faW5kZXgsdC5uZXh0X2luX2luZGV4PXIsdC5hdmFpbF9pbj1uLHUubWFya2VyPWksNCE9aT8tMzoobz10LnRvdGFsX2luLGE9dC50b3RhbF9vdXQsZSh0KSx0LnRvdGFsX2luPW8sdC50b3RhbF9vdXQ9YSx1Lm1vZGU9NywwKX0sdC5pbmZsYXRlU3luY1BvaW50PWZ1bmN0aW9uKHQpe3JldHVybiB0JiZ0LmlzdGF0ZSYmdC5pc3RhdGUuYmxvY2tzP3QuaXN0YXRlLmJsb2Nrcy5zeW5jX3BvaW50KCk6LTJ9fWZ1bmN0aW9uIE1rKCl7fWZ1bmN0aW9uIExrKHQpe3ZhciBlPW5ldyBNayxuPXQmJnQuY2h1bmtTaXplP01hdGguZmxvb3IoMip0LmNodW5rU2l6ZSk6MTMxMDcyLHI9bmV3IFVpbnQ4QXJyYXkobiksaT0hMTtlLmluZmxhdGVJbml0KCksZS5uZXh0X291dD1yLHRoaXMuYXBwZW5kPWZ1bmN0aW9uKHQsbyl7dmFyIGEsdSxjPVtdLGY9MCxzPTAsbD0wO2lmKDAhPT10Lmxlbmd0aCl7ZS5uZXh0X2luX2luZGV4PTAsZS5uZXh0X2luPXQsZS5hdmFpbF9pbj10Lmxlbmd0aDtkb3tpZihlLm5leHRfb3V0X2luZGV4PTAsZS5hdmFpbF9vdXQ9biwwIT09ZS5hdmFpbF9pbnx8aXx8KGUubmV4dF9pbl9pbmRleD0wLGk9ITApLGE9ZS5pbmZsYXRlKDApLGkmJi01PT09YSl7aWYoMCE9PWUuYXZhaWxfaW4pdGhyb3cgbmV3IEVycm9yKCJpbmZsYXRpbmc6IGJhZCBpbnB1dCIpfWVsc2UgaWYoMCE9PWEmJjEhPT1hKXRocm93IG5ldyBFcnJvcigiaW5mbGF0aW5nOiAiK2UubXNnKTtpZigoaXx8MT09PWEpJiZlLmF2YWlsX2luPT09dC5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKCJpbmZsYXRpbmc6IGJhZCBpbnB1dCIpO2UubmV4dF9vdXRfaW5kZXgmJihlLm5leHRfb3V0X2luZGV4PT09bj9jLnB1c2gobmV3IFVpbnQ4QXJyYXkocikpOmMucHVzaChyLnNsaWNlKDAsZS5uZXh0X291dF9pbmRleCkpKSxsKz1lLm5leHRfb3V0X2luZGV4LG8mJmUubmV4dF9pbl9pbmRleD4wJiZlLm5leHRfaW5faW5kZXghPWYmJihvKGUubmV4dF9pbl9pbmRleCksZj1lLm5leHRfaW5faW5kZXgpfXdoaWxlKGUuYXZhaWxfaW4+MHx8MD09PWUuYXZhaWxfb3V0KTtyZXR1cm4gYy5sZW5ndGg+MT8odT1uZXcgVWludDhBcnJheShsKSxjLmZvckVhY2goKGZ1bmN0aW9uKHQpe3Uuc2V0KHQscykscys9dC5sZW5ndGh9KSkpOnU9Y1swXXx8bmV3IFVpbnQ4QXJyYXkoMCksdX19LHRoaXMuZmx1c2g9ZnVuY3Rpb24oKXtlLmluZmxhdGVFbmQoKX19TWsucHJvdG90eXBlPXtpbmZsYXRlSW5pdDpmdW5jdGlvbih0KXt2YXIgZT10aGlzO3JldHVybiBlLmlzdGF0ZT1uZXcgUGssdHx8KHQ9MTUpLGUuaXN0YXRlLmluZmxhdGVJbml0KGUsdCl9LGluZmxhdGU6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcztyZXR1cm4gZS5pc3RhdGU/ZS5pc3RhdGUuaW5mbGF0ZShlLHQpOi0yfSxpbmZsYXRlRW5kOmZ1bmN0aW9uKCl7dmFyIHQ9dGhpcztpZighdC5pc3RhdGUpcmV0dXJuLTI7dmFyIGU9dC5pc3RhdGUuaW5mbGF0ZUVuZCh0KTtyZXR1cm4gdC5pc3RhdGU9bnVsbCxlfSxpbmZsYXRlU3luYzpmdW5jdGlvbigpe3ZhciB0PXRoaXM7cmV0dXJuIHQuaXN0YXRlP3QuaXN0YXRlLmluZmxhdGVTeW5jKHQpOi0yfSxpbmZsYXRlU2V0RGljdGlvbmFyeTpmdW5jdGlvbih0LGUpe3ZhciBuPXRoaXM7cmV0dXJuIG4uaXN0YXRlP24uaXN0YXRlLmluZmxhdGVTZXREaWN0aW9uYXJ5KG4sdCxlKTotMn0scmVhZF9ieXRlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLm5leHRfaW5bdF19LHJlYWRfYnVmOmZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMubmV4dF9pbi5zdWJhcnJheSh0LHQrZSl9fSxzZWxmLmluaXRDb2RlYz1mdW5jdGlvbigpe3NlbGYuRGVmbGF0ZT1iayxzZWxmLkluZmxhdGU9TGt9Owo="),
          m = URL.createObjectURL(new Blob([Z], {
        type: "text/javascript"
      }));

      _d({
        workerScripts: {
          inflate: [m],
          deflate: [m]
        }
      });
    }
  };

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  var streamCodecShim = (function (library) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var registerDataHandler = arguments.length > 2 ? arguments[2] : undefined;
    return {
      Deflate: createCodecClass(library.Deflate, options.deflate, registerDataHandler),
      Inflate: createCodecClass(library.Inflate, options.inflate, registerDataHandler)
    };
  });

  function createCodecClass(constructor, constructorOptions, registerDataHandler) {
    return /*#__PURE__*/function () {
      function _class(options) {
        _classCallCheck(this, _class);

        var codecAdapter = this;

        var onData = function onData(data) {
          if (codecAdapter.pendingData) {
            var pendingData = codecAdapter.pendingData;
            codecAdapter.pendingData = new Uint8Array(pendingData.length + data.length);
            codecAdapter.pendingData.set(pendingData, 0);
            codecAdapter.pendingData.set(data, pendingData.length);
          } else {
            codecAdapter.pendingData = new Uint8Array(data);
          }
        };

        codecAdapter.codec = new constructor(Object.assign({}, constructorOptions, options));
        registerDataHandler(codecAdapter.codec, onData);
      }

      _createClass(_class, [{
        key: "append",
        value: function () {
          var _append = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    this.codec.push(data);
                    return _context.abrupt("return", getResponse(this));

                  case 2:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function append(_x) {
            return _append.apply(this, arguments);
          }

          return append;
        }()
      }, {
        key: "flush",
        value: function () {
          var _flush = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    this.codec.push(new Uint8Array(0), true);
                    return _context2.abrupt("return", getResponse(this));

                  case 2:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));

          function flush() {
            return _flush.apply(this, arguments);
          }

          return flush;
        }()
      }]);

      return _class;
    }();

    function getResponse(codec) {
      if (codec.pendingData) {
        var output = codec.pendingData;
        codec.pendingData = null;
        return output;
      } else {
        return new Uint8Array(0);
      }
    }
  }

  var global$4 = global$19;

  var path$1 = global$4;

  var wellKnownSymbolWrapped = {};

  var wellKnownSymbol$2 = wellKnownSymbol$s;

  wellKnownSymbolWrapped.f = wellKnownSymbol$2;

  var path = path$1;
  var hasOwn$3 = hasOwnProperty_1;
  var wrappedWellKnownSymbolModule$1 = wellKnownSymbolWrapped;
  var defineProperty$4 = objectDefineProperty.f;

  var defineWellKnownSymbol$2 = function (NAME) {
    var Symbol = path.Symbol || (path.Symbol = {});
    if (!hasOwn$3(Symbol, NAME)) defineProperty$4(Symbol, NAME, {
      value: wrappedWellKnownSymbolModule$1.f(NAME)
    });
  };

  var defineWellKnownSymbol$1 = defineWellKnownSymbol$2;

  // `Symbol.iterator` well-known symbol
  // https://tc39.es/ecma262/#sec-symbol.iterator
  defineWellKnownSymbol$1('iterator');

  var objectGetOwnPropertyNamesExternal = {};

  /* eslint-disable es/no-object-getownpropertynames -- safe */

  var classof$1 = classofRaw$1;
  var toIndexedObject$2 = toIndexedObject$b;
  var $getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
  var arraySlice$1 = arraySliceSimple;

  var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
    ? Object.getOwnPropertyNames(window) : [];

  var getWindowNames = function (it) {
    try {
      return $getOwnPropertyNames$1(it);
    } catch (error) {
      return arraySlice$1(windowNames);
    }
  };

  // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
  objectGetOwnPropertyNamesExternal.f = function getOwnPropertyNames(it) {
    return windowNames && classof$1(it) == 'Window'
      ? getWindowNames(it)
      : $getOwnPropertyNames$1(toIndexedObject$2(it));
  };

  var $$7 = _export;
  var global$3 = global$19;
  var getBuiltIn = getBuiltIn$9;
  var apply$1 = functionApply;
  var call$1 = functionCall;
  var uncurryThis$8 = functionUncurryThis;
  var DESCRIPTORS$4 = descriptors;
  var NATIVE_SYMBOL$1 = nativeSymbol;
  var fails$6 = fails$D;
  var hasOwn$2 = hasOwnProperty_1;
  var isArray = isArray$4;
  var isCallable$3 = isCallable$p;
  var isObject$3 = isObject$k;
  var isPrototypeOf$1 = objectIsPrototypeOf;
  var isSymbol = isSymbol$5;
  var anObject$1 = anObject$i;
  var toObject$1 = toObject$d;
  var toIndexedObject$1 = toIndexedObject$b;
  var toPropertyKey = toPropertyKey$5;
  var $toString = toString$9;
  var createPropertyDescriptor = createPropertyDescriptor$7;
  var nativeObjectCreate = objectCreate;
  var objectKeys$1 = objectKeys$4;
  var getOwnPropertyNamesModule$1 = objectGetOwnPropertyNames;
  var getOwnPropertyNamesExternal = objectGetOwnPropertyNamesExternal;
  var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
  var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
  var definePropertyModule = objectDefineProperty;
  var definePropertiesModule = objectDefineProperties;
  var propertyIsEnumerableModule = objectPropertyIsEnumerable;
  var arraySlice = arraySlice$9;
  var redefine$1 = redefine$d.exports;
  var shared = shared$5.exports;
  var sharedKey = sharedKey$4;
  var hiddenKeys$1 = hiddenKeys$6;
  var uid$1 = uid$5;
  var wellKnownSymbol$1 = wellKnownSymbol$s;
  var wrappedWellKnownSymbolModule = wellKnownSymbolWrapped;
  var defineWellKnownSymbol = defineWellKnownSymbol$2;
  var setToStringTag$1 = setToStringTag$8;
  var InternalStateModule$1 = internalState;
  var $forEach = arrayIteration.forEach;

  var HIDDEN = sharedKey('hidden');
  var SYMBOL = 'Symbol';
  var PROTOTYPE = 'prototype';
  var TO_PRIMITIVE = wellKnownSymbol$1('toPrimitive');

  var setInternalState$1 = InternalStateModule$1.set;
  var getInternalState = InternalStateModule$1.getterFor(SYMBOL);

  var ObjectPrototype = Object[PROTOTYPE];
  var $Symbol = global$3.Symbol;
  var SymbolPrototype$1 = $Symbol && $Symbol[PROTOTYPE];
  var TypeError$1 = global$3.TypeError;
  var QObject = global$3.QObject;
  var $stringify = getBuiltIn('JSON', 'stringify');
  var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  var nativeDefineProperty = definePropertyModule.f;
  var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
  var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
  var push$2 = uncurryThis$8([].push);

  var AllSymbols = shared('symbols');
  var ObjectPrototypeSymbols = shared('op-symbols');
  var StringToSymbolRegistry = shared('string-to-symbol-registry');
  var SymbolToStringRegistry = shared('symbol-to-string-registry');
  var WellKnownSymbolsStore = shared('wks');

  // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
  var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

  // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
  var setSymbolDescriptor = DESCRIPTORS$4 && fails$6(function () {
    return nativeObjectCreate(nativeDefineProperty({}, 'a', {
      get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
    })).a != 7;
  }) ? function (O, P, Attributes) {
    var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
    if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
    nativeDefineProperty(O, P, Attributes);
    if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
      nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
    }
  } : nativeDefineProperty;

  var wrap = function (tag, description) {
    var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype$1);
    setInternalState$1(symbol, {
      type: SYMBOL,
      tag: tag,
      description: description
    });
    if (!DESCRIPTORS$4) symbol.description = description;
    return symbol;
  };

  var $defineProperty = function defineProperty(O, P, Attributes) {
    if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
    anObject$1(O);
    var key = toPropertyKey(P);
    anObject$1(Attributes);
    if (hasOwn$2(AllSymbols, key)) {
      if (!Attributes.enumerable) {
        if (!hasOwn$2(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
        O[HIDDEN][key] = true;
      } else {
        if (hasOwn$2(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
        Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
      } return setSymbolDescriptor(O, key, Attributes);
    } return nativeDefineProperty(O, key, Attributes);
  };

  var $defineProperties = function defineProperties(O, Properties) {
    anObject$1(O);
    var properties = toIndexedObject$1(Properties);
    var keys = objectKeys$1(properties).concat($getOwnPropertySymbols(properties));
    $forEach(keys, function (key) {
      if (!DESCRIPTORS$4 || call$1($propertyIsEnumerable$1, properties, key)) $defineProperty(O, key, properties[key]);
    });
    return O;
  };

  var $create = function create(O, Properties) {
    return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
  };

  var $propertyIsEnumerable$1 = function propertyIsEnumerable(V) {
    var P = toPropertyKey(V);
    var enumerable = call$1(nativePropertyIsEnumerable, this, P);
    if (this === ObjectPrototype && hasOwn$2(AllSymbols, P) && !hasOwn$2(ObjectPrototypeSymbols, P)) return false;
    return enumerable || !hasOwn$2(this, P) || !hasOwn$2(AllSymbols, P) || hasOwn$2(this, HIDDEN) && this[HIDDEN][P]
      ? enumerable : true;
  };

  var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
    var it = toIndexedObject$1(O);
    var key = toPropertyKey(P);
    if (it === ObjectPrototype && hasOwn$2(AllSymbols, key) && !hasOwn$2(ObjectPrototypeSymbols, key)) return;
    var descriptor = nativeGetOwnPropertyDescriptor(it, key);
    if (descriptor && hasOwn$2(AllSymbols, key) && !(hasOwn$2(it, HIDDEN) && it[HIDDEN][key])) {
      descriptor.enumerable = true;
    }
    return descriptor;
  };

  var $getOwnPropertyNames = function getOwnPropertyNames(O) {
    var names = nativeGetOwnPropertyNames(toIndexedObject$1(O));
    var result = [];
    $forEach(names, function (key) {
      if (!hasOwn$2(AllSymbols, key) && !hasOwn$2(hiddenKeys$1, key)) push$2(result, key);
    });
    return result;
  };

  var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
    var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
    var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject$1(O));
    var result = [];
    $forEach(names, function (key) {
      if (hasOwn$2(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn$2(ObjectPrototype, key))) {
        push$2(result, AllSymbols[key]);
      }
    });
    return result;
  };

  // `Symbol` constructor
  // https://tc39.es/ecma262/#sec-symbol-constructor
  if (!NATIVE_SYMBOL$1) {
    $Symbol = function Symbol() {
      if (isPrototypeOf$1(SymbolPrototype$1, this)) throw TypeError$1('Symbol is not a constructor');
      var description = !arguments.length || arguments[0] === undefined ? undefined : $toString(arguments[0]);
      var tag = uid$1(description);
      var setter = function (value) {
        if (this === ObjectPrototype) call$1(setter, ObjectPrototypeSymbols, value);
        if (hasOwn$2(this, HIDDEN) && hasOwn$2(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
        setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
      };
      if (DESCRIPTORS$4 && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
      return wrap(tag, description);
    };

    SymbolPrototype$1 = $Symbol[PROTOTYPE];

    redefine$1(SymbolPrototype$1, 'toString', function toString() {
      return getInternalState(this).tag;
    });

    redefine$1($Symbol, 'withoutSetter', function (description) {
      return wrap(uid$1(description), description);
    });

    propertyIsEnumerableModule.f = $propertyIsEnumerable$1;
    definePropertyModule.f = $defineProperty;
    definePropertiesModule.f = $defineProperties;
    getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
    getOwnPropertyNamesModule$1.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
    getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

    wrappedWellKnownSymbolModule.f = function (name) {
      return wrap(wellKnownSymbol$1(name), name);
    };

    if (DESCRIPTORS$4) {
      // https://github.com/tc39/proposal-Symbol-description
      nativeDefineProperty(SymbolPrototype$1, 'description', {
        configurable: true,
        get: function description() {
          return getInternalState(this).description;
        }
      });
      {
        redefine$1(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable$1, { unsafe: true });
      }
    }
  }

  $$7({ global: true, wrap: true, forced: !NATIVE_SYMBOL$1, sham: !NATIVE_SYMBOL$1 }, {
    Symbol: $Symbol
  });

  $forEach(objectKeys$1(WellKnownSymbolsStore), function (name) {
    defineWellKnownSymbol(name);
  });

  $$7({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL$1 }, {
    // `Symbol.for` method
    // https://tc39.es/ecma262/#sec-symbol.for
    'for': function (key) {
      var string = $toString(key);
      if (hasOwn$2(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
      var symbol = $Symbol(string);
      StringToSymbolRegistry[string] = symbol;
      SymbolToStringRegistry[symbol] = string;
      return symbol;
    },
    // `Symbol.keyFor` method
    // https://tc39.es/ecma262/#sec-symbol.keyfor
    keyFor: function keyFor(sym) {
      if (!isSymbol(sym)) throw TypeError$1(sym + ' is not a symbol');
      if (hasOwn$2(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
    },
    useSetter: function () { USE_SETTER = true; },
    useSimple: function () { USE_SETTER = false; }
  });

  $$7({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL$1, sham: !DESCRIPTORS$4 }, {
    // `Object.create` method
    // https://tc39.es/ecma262/#sec-object.create
    create: $create,
    // `Object.defineProperty` method
    // https://tc39.es/ecma262/#sec-object.defineproperty
    defineProperty: $defineProperty,
    // `Object.defineProperties` method
    // https://tc39.es/ecma262/#sec-object.defineproperties
    defineProperties: $defineProperties,
    // `Object.getOwnPropertyDescriptor` method
    // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor
  });

  $$7({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL$1 }, {
    // `Object.getOwnPropertyNames` method
    // https://tc39.es/ecma262/#sec-object.getownpropertynames
    getOwnPropertyNames: $getOwnPropertyNames,
    // `Object.getOwnPropertySymbols` method
    // https://tc39.es/ecma262/#sec-object.getownpropertysymbols
    getOwnPropertySymbols: $getOwnPropertySymbols
  });

  // Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
  // https://bugs.chromium.org/p/v8/issues/detail?id=3443
  $$7({ target: 'Object', stat: true, forced: fails$6(function () { getOwnPropertySymbolsModule.f(1); }) }, {
    getOwnPropertySymbols: function getOwnPropertySymbols(it) {
      return getOwnPropertySymbolsModule.f(toObject$1(it));
    }
  });

  // `JSON.stringify` method behavior with symbols
  // https://tc39.es/ecma262/#sec-json.stringify
  if ($stringify) {
    var FORCED_JSON_STRINGIFY = !NATIVE_SYMBOL$1 || fails$6(function () {
      var symbol = $Symbol();
      // MS Edge converts symbol values to JSON as {}
      return $stringify([symbol]) != '[null]'
        // WebKit converts symbol values to JSON as null
        || $stringify({ a: symbol }) != '{}'
        // V8 throws on boxed symbols
        || $stringify(Object(symbol)) != '{}';
    });

    $$7({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      stringify: function stringify(it, replacer, space) {
        var args = arraySlice(arguments);
        var $replacer = replacer;
        if (!isObject$3(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
        if (!isArray(replacer)) replacer = function (key, value) {
          if (isCallable$3($replacer)) value = call$1($replacer, this, key, value);
          if (!isSymbol(value)) return value;
        };
        args[1] = replacer;
        return apply$1($stringify, null, args);
      }
    });
  }

  // `Symbol.prototype[@@toPrimitive]` method
  // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
  if (!SymbolPrototype$1[TO_PRIMITIVE]) {
    var valueOf = SymbolPrototype$1.valueOf;
    // eslint-disable-next-line no-unused-vars -- required for .length
    redefine$1(SymbolPrototype$1, TO_PRIMITIVE, function (hint) {
      // TODO: improve hint logic
      return call$1(valueOf, this);
    });
  }
  // `Symbol.prototype[@@toStringTag]` property
  // https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
  setToStringTag$1($Symbol, SYMBOL);

  hiddenKeys$1[HIDDEN] = true;

  var $$6 = _export;
  var DESCRIPTORS$3 = descriptors;
  var global$2 = global$19;
  var uncurryThis$7 = functionUncurryThis;
  var hasOwn$1 = hasOwnProperty_1;
  var isCallable$2 = isCallable$p;
  var isPrototypeOf = objectIsPrototypeOf;
  var toString$2 = toString$9;
  var defineProperty$3 = objectDefineProperty.f;
  var copyConstructorProperties = copyConstructorProperties$2;

  var NativeSymbol = global$2.Symbol;
  var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;

  if (DESCRIPTORS$3 && isCallable$2(NativeSymbol) && (!('description' in SymbolPrototype) ||
    // Safari 12 bug
    NativeSymbol().description !== undefined
  )) {
    var EmptyStringDescriptionStore = {};
    // wrap Symbol constructor for correct work with undefined description
    var SymbolWrapper = function Symbol() {
      var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString$2(arguments[0]);
      var result = isPrototypeOf(SymbolPrototype, this)
        ? new NativeSymbol(description)
        // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
        : description === undefined ? NativeSymbol() : NativeSymbol(description);
      if (description === '') EmptyStringDescriptionStore[result] = true;
      return result;
    };

    copyConstructorProperties(SymbolWrapper, NativeSymbol);
    SymbolWrapper.prototype = SymbolPrototype;
    SymbolPrototype.constructor = SymbolWrapper;

    var NATIVE_SYMBOL = String(NativeSymbol('test')) == 'Symbol(test)';
    var symbolToString = uncurryThis$7(SymbolPrototype.toString);
    var symbolValueOf = uncurryThis$7(SymbolPrototype.valueOf);
    var regexp = /^Symbol\((.*)\)[^)]+$/;
    var replace$1 = uncurryThis$7(''.replace);
    var stringSlice$2 = uncurryThis$7(''.slice);

    defineProperty$3(SymbolPrototype, 'description', {
      configurable: true,
      get: function description() {
        var symbol = symbolValueOf(this);
        var string = symbolToString(symbol);
        if (hasOwn$1(EmptyStringDescriptionStore, symbol)) return '';
        var desc = NATIVE_SYMBOL ? stringSlice$2(string, 7, -1) : replace$1(string, regexp, '$1');
        return desc === '' ? undefined : desc;
      }
    });

    $$6({ global: true, forced: true }, {
      Symbol: SymbolWrapper
    });
  }

  var $$5 = _export;
  var iterate$2 = iterate$4;
  var createProperty = createProperty$6;

  // `Object.fromEntries` method
  // https://github.com/tc39/proposal-object-from-entries
  $$5({ target: 'Object', stat: true }, {
    fromEntries: function fromEntries(iterable) {
      var obj = {};
      iterate$2(iterable, function (k, v) {
        createProperty(obj, k, v);
      }, { AS_ENTRIES: true });
      return obj;
    }
  });

  var PROPER_FUNCTION_NAME = functionName.PROPER;
  var fails$5 = fails$D;
  var whitespaces = whitespaces$2;

  var non = '\u200B\u0085\u180E';

  // check that a method works with the correct list
  // of whitespaces and has a correct name
  var stringTrimForced = function (METHOD_NAME) {
    return fails$5(function () {
      return !!whitespaces[METHOD_NAME]()
        || non[METHOD_NAME]() !== non
        || (PROPER_FUNCTION_NAME && whitespaces[METHOD_NAME].name !== METHOD_NAME);
    });
  };

  var $$4 = _export;
  var $trim = stringTrim.trim;
  var forcedStringTrimMethod = stringTrimForced;

  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  $$4({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
    trim: function trim() {
      return $trim(this);
    }
  });

  var uncurryThis$6 = functionUncurryThis;
  var toObject = toObject$d;

  var floor = Math.floor;
  var charAt = uncurryThis$6(''.charAt);
  var replace = uncurryThis$6(''.replace);
  var stringSlice$1 = uncurryThis$6(''.slice);
  var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
  var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

  // `GetSubstitution` abstract operation
  // https://tc39.es/ecma262/#sec-getsubstitution
  var getSubstitution$1 = function (matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return replace(replacement, symbols, function (match, ch) {
      var capture;
      switch (charAt(ch, 0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return stringSlice$1(str, 0, position);
        case "'": return stringSlice$1(str, tailPos);
        case '<':
          capture = namedCaptures[stringSlice$1(ch, 1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? charAt(ch, 1) : captures[f - 1] + charAt(ch, 1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  };

  var apply = functionApply;
  var call = functionCall;
  var uncurryThis$5 = functionUncurryThis;
  var fixRegExpWellKnownSymbolLogic = fixRegexpWellKnownSymbolLogic;
  var fails$4 = fails$D;
  var anObject = anObject$i;
  var isCallable$1 = isCallable$p;
  var toIntegerOrInfinity = toIntegerOrInfinity$9;
  var toLength$1 = toLength$a;
  var toString$1 = toString$9;
  var requireObjectCoercible$1 = requireObjectCoercible$8;
  var advanceStringIndex = advanceStringIndex$2;
  var getMethod = getMethod$5;
  var getSubstitution = getSubstitution$1;
  var regExpExec$1 = regexpExecAbstract;
  var wellKnownSymbol = wellKnownSymbol$s;

  var REPLACE = wellKnownSymbol('replace');
  var max = Math.max;
  var min$1 = Math.min;
  var concat = uncurryThis$5([].concat);
  var push$1 = uncurryThis$5([].push);
  var stringIndexOf = uncurryThis$5(''.indexOf);
  var stringSlice = uncurryThis$5(''.slice);

  var maybeToString = function (it) {
    return it === undefined ? it : String(it);
  };

  // IE <= 11 replaces $0 with the whole match, as if it was $&
  // https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
  var REPLACE_KEEPS_$0 = (function () {
    // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
    return 'a'.replace(/./, '$0') === '$0';
  })();

  // Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
    if (/./[REPLACE]) {
      return /./[REPLACE]('a', '$0') === '';
    }
    return false;
  })();

  var REPLACE_SUPPORTS_NAMED_GROUPS = !fails$4(function () {
    var re = /./;
    re.exec = function () {
      var result = [];
      result.groups = { a: '7' };
      return result;
    };
    // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
    return ''.replace(re, '$<a>') !== '7';
  });

  // @@replace logic
  fixRegExpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
    var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

    return [
      // `String.prototype.replace` method
      // https://tc39.es/ecma262/#sec-string.prototype.replace
      function replace(searchValue, replaceValue) {
        var O = requireObjectCoercible$1(this);
        var replacer = searchValue == undefined ? undefined : getMethod(searchValue, REPLACE);
        return replacer
          ? call(replacer, searchValue, O, replaceValue)
          : call(nativeReplace, toString$1(O), searchValue, replaceValue);
      },
      // `RegExp.prototype[@@replace]` method
      // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
      function (string, replaceValue) {
        var rx = anObject(this);
        var S = toString$1(string);

        if (
          typeof replaceValue == 'string' &&
          stringIndexOf(replaceValue, UNSAFE_SUBSTITUTE) === -1 &&
          stringIndexOf(replaceValue, '$<') === -1
        ) {
          var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
          if (res.done) return res.value;
        }

        var functionalReplace = isCallable$1(replaceValue);
        if (!functionalReplace) replaceValue = toString$1(replaceValue);

        var global = rx.global;
        if (global) {
          var fullUnicode = rx.unicode;
          rx.lastIndex = 0;
        }
        var results = [];
        while (true) {
          var result = regExpExec$1(rx, S);
          if (result === null) break;

          push$1(results, result);
          if (!global) break;

          var matchStr = toString$1(result[0]);
          if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength$1(rx.lastIndex), fullUnicode);
        }

        var accumulatedResult = '';
        var nextSourcePosition = 0;
        for (var i = 0; i < results.length; i++) {
          result = results[i];

          var matched = toString$1(result[0]);
          var position = max(min$1(toIntegerOrInfinity(result.index), S.length), 0);
          var captures = [];
          // NOTE: This is equivalent to
          //   captures = result.slice(1).map(maybeToString)
          // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
          // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
          // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
          for (var j = 1; j < result.length; j++) push$1(captures, maybeToString(result[j]));
          var namedCaptures = result.groups;
          if (functionalReplace) {
            var replacerArgs = concat([matched], captures, position, S);
            if (namedCaptures !== undefined) push$1(replacerArgs, namedCaptures);
            var replacement = toString$1(apply(replaceValue, undefined, replacerArgs));
          } else {
            replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
          }
          if (position >= nextSourcePosition) {
            accumulatedResult += stringSlice(S, nextSourcePosition, position) + replacement;
            nextSourcePosition = position + matched.length;
          }
        }
        return accumulatedResult + stringSlice(S, nextSourcePosition);
      }
    ];
  }, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

  var internalMetadata = {exports: {}};

  // FF26- bug: ArrayBuffers are non-extensible, but Object.isExtensible does not report it
  var fails$3 = fails$D;

  var arrayBufferNonExtensible = fails$3(function () {
    if (typeof ArrayBuffer == 'function') {
      var buffer = new ArrayBuffer(8);
      // eslint-disable-next-line es/no-object-isextensible, es/no-object-defineproperty -- safe
      if (Object.isExtensible(buffer)) Object.defineProperty(buffer, 'a', { value: 8 });
    }
  });

  var fails$2 = fails$D;
  var isObject$2 = isObject$k;
  var classof = classofRaw$1;
  var ARRAY_BUFFER_NON_EXTENSIBLE = arrayBufferNonExtensible;

  // eslint-disable-next-line es/no-object-isextensible -- safe
  var $isExtensible = Object.isExtensible;
  var FAILS_ON_PRIMITIVES = fails$2(function () { $isExtensible(1); });

  // `Object.isExtensible` method
  // https://tc39.es/ecma262/#sec-object.isextensible
  var objectIsExtensible = (FAILS_ON_PRIMITIVES || ARRAY_BUFFER_NON_EXTENSIBLE) ? function isExtensible(it) {
    if (!isObject$2(it)) return false;
    if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) == 'ArrayBuffer') return false;
    return $isExtensible ? $isExtensible(it) : true;
  } : $isExtensible;

  var fails$1 = fails$D;

  var freezing = !fails$1(function () {
    // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
    return Object.isExtensible(Object.preventExtensions({}));
  });

  var $$3 = _export;
  var uncurryThis$4 = functionUncurryThis;
  var hiddenKeys = hiddenKeys$6;
  var isObject$1 = isObject$k;
  var hasOwn = hasOwnProperty_1;
  var defineProperty$2 = objectDefineProperty.f;
  var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
  var getOwnPropertyNamesExternalModule = objectGetOwnPropertyNamesExternal;
  var isExtensible = objectIsExtensible;
  var uid = uid$5;
  var FREEZING = freezing;

  var REQUIRED = false;
  var METADATA = uid('meta');
  var id = 0;

  var setMetadata = function (it) {
    defineProperty$2(it, METADATA, { value: {
      objectID: 'O' + id++, // object ID
      weakData: {}          // weak collections IDs
    } });
  };

  var fastKey$1 = function (it, create) {
    // return a primitive with prefix
    if (!isObject$1(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
    if (!hasOwn(it, METADATA)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return 'F';
      // not necessary to add metadata
      if (!create) return 'E';
      // add missing metadata
      setMetadata(it);
    // return object ID
    } return it[METADATA].objectID;
  };

  var getWeakData = function (it, create) {
    if (!hasOwn(it, METADATA)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return true;
      // not necessary to add metadata
      if (!create) return false;
      // add missing metadata
      setMetadata(it);
    // return the store of weak collections IDs
    } return it[METADATA].weakData;
  };

  // add metadata on freeze-family methods calling
  var onFreeze = function (it) {
    if (FREEZING && REQUIRED && isExtensible(it) && !hasOwn(it, METADATA)) setMetadata(it);
    return it;
  };

  var enable = function () {
    meta.enable = function () { /* empty */ };
    REQUIRED = true;
    var getOwnPropertyNames = getOwnPropertyNamesModule.f;
    var splice = uncurryThis$4([].splice);
    var test = {};
    test[METADATA] = 1;

    // prevent exposing of metadata key
    if (getOwnPropertyNames(test).length) {
      getOwnPropertyNamesModule.f = function (it) {
        var result = getOwnPropertyNames(it);
        for (var i = 0, length = result.length; i < length; i++) {
          if (result[i] === METADATA) {
            splice(result, i, 1);
            break;
          }
        } return result;
      };

      $$3({ target: 'Object', stat: true, forced: true }, {
        getOwnPropertyNames: getOwnPropertyNamesExternalModule.f
      });
    }
  };

  var meta = internalMetadata.exports = {
    enable: enable,
    fastKey: fastKey$1,
    getWeakData: getWeakData,
    onFreeze: onFreeze
  };

  hiddenKeys[METADATA] = true;

  var $$2 = _export;
  var global$1 = global$19;
  var uncurryThis$3 = functionUncurryThis;
  var isForced = isForced_1;
  var redefine = redefine$d.exports;
  var InternalMetadataModule = internalMetadata.exports;
  var iterate$1 = iterate$4;
  var anInstance$1 = anInstance$7;
  var isCallable = isCallable$p;
  var isObject = isObject$k;
  var fails = fails$D;
  var checkCorrectnessOfIteration = checkCorrectnessOfIteration$4;
  var setToStringTag = setToStringTag$8;
  var inheritIfRequired = inheritIfRequired$3;

  var collection$1 = function (CONSTRUCTOR_NAME, wrapper, common) {
    var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
    var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
    var ADDER = IS_MAP ? 'set' : 'add';
    var NativeConstructor = global$1[CONSTRUCTOR_NAME];
    var NativePrototype = NativeConstructor && NativeConstructor.prototype;
    var Constructor = NativeConstructor;
    var exported = {};

    var fixMethod = function (KEY) {
      var uncurriedNativeMethod = uncurryThis$3(NativePrototype[KEY]);
      redefine(NativePrototype, KEY,
        KEY == 'add' ? function add(value) {
          uncurriedNativeMethod(this, value === 0 ? 0 : value);
          return this;
        } : KEY == 'delete' ? function (key) {
          return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
        } : KEY == 'get' ? function get(key) {
          return IS_WEAK && !isObject(key) ? undefined : uncurriedNativeMethod(this, key === 0 ? 0 : key);
        } : KEY == 'has' ? function has(key) {
          return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
        } : function set(key, value) {
          uncurriedNativeMethod(this, key === 0 ? 0 : key, value);
          return this;
        }
      );
    };

    var REPLACE = isForced(
      CONSTRUCTOR_NAME,
      !isCallable(NativeConstructor) || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
        new NativeConstructor().entries().next();
      }))
    );

    if (REPLACE) {
      // create collection constructor
      Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
      InternalMetadataModule.enable();
    } else if (isForced(CONSTRUCTOR_NAME, true)) {
      var instance = new Constructor();
      // early implementations not supports chaining
      var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
      // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
      var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      // eslint-disable-next-line no-new -- required for testing
      var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
      // for early implementations -0 and +0 not the same
      var BUGGY_ZERO = !IS_WEAK && fails(function () {
        // V8 ~ Chromium 42- fails only with 5+ elements
        var $instance = new NativeConstructor();
        var index = 5;
        while (index--) $instance[ADDER](index, index);
        return !$instance.has(-0);
      });

      if (!ACCEPT_ITERABLES) {
        Constructor = wrapper(function (dummy, iterable) {
          anInstance$1(dummy, NativePrototype);
          var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
          if (iterable != undefined) iterate$1(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
          return that;
        });
        Constructor.prototype = NativePrototype;
        NativePrototype.constructor = Constructor;
      }

      if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
        fixMethod('delete');
        fixMethod('has');
        IS_MAP && fixMethod('get');
      }

      if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

      // weak collections should not contains .clear method
      if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
    }

    exported[CONSTRUCTOR_NAME] = Constructor;
    $$2({ global: true, forced: Constructor != NativeConstructor }, exported);

    setToStringTag(Constructor, CONSTRUCTOR_NAME);

    if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

    return Constructor;
  };

  var defineProperty$1 = objectDefineProperty.f;
  var create = objectCreate;
  var redefineAll = redefineAll$4;
  var bind = functionBindContext;
  var anInstance = anInstance$7;
  var iterate = iterate$4;
  var defineIterator = defineIterator$3;
  var setSpecies = setSpecies$3;
  var DESCRIPTORS$2 = descriptors;
  var fastKey = internalMetadata.exports.fastKey;
  var InternalStateModule = internalState;

  var setInternalState = InternalStateModule.set;
  var internalStateGetterFor = InternalStateModule.getterFor;

  var collectionStrong$1 = {
    getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
      var Constructor = wrapper(function (that, iterable) {
        anInstance(that, Prototype);
        setInternalState(that, {
          type: CONSTRUCTOR_NAME,
          index: create(null),
          first: undefined,
          last: undefined,
          size: 0
        });
        if (!DESCRIPTORS$2) that.size = 0;
        if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
      });

      var Prototype = Constructor.prototype;

      var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

      var define = function (that, key, value) {
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        var previous, index;
        // change existing entry
        if (entry) {
          entry.value = value;
        // create new entry
        } else {
          state.last = entry = {
            index: index = fastKey(key, true),
            key: key,
            value: value,
            previous: previous = state.last,
            next: undefined,
            removed: false
          };
          if (!state.first) state.first = entry;
          if (previous) previous.next = entry;
          if (DESCRIPTORS$2) state.size++;
          else that.size++;
          // add to index
          if (index !== 'F') state.index[index] = entry;
        } return that;
      };

      var getEntry = function (that, key) {
        var state = getInternalState(that);
        // fast case
        var index = fastKey(key);
        var entry;
        if (index !== 'F') return state.index[index];
        // frozen object case
        for (entry = state.first; entry; entry = entry.next) {
          if (entry.key == key) return entry;
        }
      };

      redefineAll(Prototype, {
        // `{ Map, Set }.prototype.clear()` methods
        // https://tc39.es/ecma262/#sec-map.prototype.clear
        // https://tc39.es/ecma262/#sec-set.prototype.clear
        clear: function clear() {
          var that = this;
          var state = getInternalState(that);
          var data = state.index;
          var entry = state.first;
          while (entry) {
            entry.removed = true;
            if (entry.previous) entry.previous = entry.previous.next = undefined;
            delete data[entry.index];
            entry = entry.next;
          }
          state.first = state.last = undefined;
          if (DESCRIPTORS$2) state.size = 0;
          else that.size = 0;
        },
        // `{ Map, Set }.prototype.delete(key)` methods
        // https://tc39.es/ecma262/#sec-map.prototype.delete
        // https://tc39.es/ecma262/#sec-set.prototype.delete
        'delete': function (key) {
          var that = this;
          var state = getInternalState(that);
          var entry = getEntry(that, key);
          if (entry) {
            var next = entry.next;
            var prev = entry.previous;
            delete state.index[entry.index];
            entry.removed = true;
            if (prev) prev.next = next;
            if (next) next.previous = prev;
            if (state.first == entry) state.first = next;
            if (state.last == entry) state.last = prev;
            if (DESCRIPTORS$2) state.size--;
            else that.size--;
          } return !!entry;
        },
        // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
        // https://tc39.es/ecma262/#sec-map.prototype.foreach
        // https://tc39.es/ecma262/#sec-set.prototype.foreach
        forEach: function forEach(callbackfn /* , that = undefined */) {
          var state = getInternalState(this);
          var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
          var entry;
          while (entry = entry ? entry.next : state.first) {
            boundFunction(entry.value, entry.key, this);
            // revert to the last existing entry
            while (entry && entry.removed) entry = entry.previous;
          }
        },
        // `{ Map, Set}.prototype.has(key)` methods
        // https://tc39.es/ecma262/#sec-map.prototype.has
        // https://tc39.es/ecma262/#sec-set.prototype.has
        has: function has(key) {
          return !!getEntry(this, key);
        }
      });

      redefineAll(Prototype, IS_MAP ? {
        // `Map.prototype.get(key)` method
        // https://tc39.es/ecma262/#sec-map.prototype.get
        get: function get(key) {
          var entry = getEntry(this, key);
          return entry && entry.value;
        },
        // `Map.prototype.set(key, value)` method
        // https://tc39.es/ecma262/#sec-map.prototype.set
        set: function set(key, value) {
          return define(this, key === 0 ? 0 : key, value);
        }
      } : {
        // `Set.prototype.add(value)` method
        // https://tc39.es/ecma262/#sec-set.prototype.add
        add: function add(value) {
          return define(this, value = value === 0 ? 0 : value, value);
        }
      });
      if (DESCRIPTORS$2) defineProperty$1(Prototype, 'size', {
        get: function () {
          return getInternalState(this).size;
        }
      });
      return Constructor;
    },
    setStrong: function (Constructor, CONSTRUCTOR_NAME, IS_MAP) {
      var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
      var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
      var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
      // `{ Map, Set }.prototype.{ keys, values, entries, @@iterator }()` methods
      // https://tc39.es/ecma262/#sec-map.prototype.entries
      // https://tc39.es/ecma262/#sec-map.prototype.keys
      // https://tc39.es/ecma262/#sec-map.prototype.values
      // https://tc39.es/ecma262/#sec-map.prototype-@@iterator
      // https://tc39.es/ecma262/#sec-set.prototype.entries
      // https://tc39.es/ecma262/#sec-set.prototype.keys
      // https://tc39.es/ecma262/#sec-set.prototype.values
      // https://tc39.es/ecma262/#sec-set.prototype-@@iterator
      defineIterator(Constructor, CONSTRUCTOR_NAME, function (iterated, kind) {
        setInternalState(this, {
          type: ITERATOR_NAME,
          target: iterated,
          state: getInternalCollectionState(iterated),
          kind: kind,
          last: undefined
        });
      }, function () {
        var state = getInternalIteratorState(this);
        var kind = state.kind;
        var entry = state.last;
        // revert to the last existing entry
        while (entry && entry.removed) entry = entry.previous;
        // get next entry
        if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
          // or finish the iteration
          state.target = undefined;
          return { value: undefined, done: true };
        }
        // return step by kind
        if (kind == 'keys') return { value: entry.key, done: false };
        if (kind == 'values') return { value: entry.value, done: false };
        return { value: [entry.key, entry.value], done: false };
      }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

      // `{ Map, Set }.prototype[@@species]` accessors
      // https://tc39.es/ecma262/#sec-get-map-@@species
      // https://tc39.es/ecma262/#sec-get-set-@@species
      setSpecies(CONSTRUCTOR_NAME);
    }
  };

  var collection = collection$1;
  var collectionStrong = collectionStrong$1;

  // `Map` constructor
  // https://tc39.es/ecma262/#sec-map-objects
  collection('Map', function (init) {
    return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
  }, collectionStrong);

  var DESCRIPTORS$1 = descriptors;
  var uncurryThis$2 = functionUncurryThis;
  var objectKeys = objectKeys$4;
  var toIndexedObject = toIndexedObject$b;
  var $propertyIsEnumerable = objectPropertyIsEnumerable.f;

  var propertyIsEnumerable = uncurryThis$2($propertyIsEnumerable);
  var push = uncurryThis$2([].push);

  // `Object.{ entries, values }` methods implementation
  var createMethod = function (TO_ENTRIES) {
    return function (it) {
      var O = toIndexedObject(it);
      var keys = objectKeys(O);
      var length = keys.length;
      var i = 0;
      var result = [];
      var key;
      while (length > i) {
        key = keys[i++];
        if (!DESCRIPTORS$1 || propertyIsEnumerable(O, key)) {
          push(result, TO_ENTRIES ? [key, O[key]] : O[key]);
        }
      }
      return result;
    };
  };

  var objectToArray = {
    // `Object.entries` method
    // https://tc39.es/ecma262/#sec-object.entries
    entries: createMethod(true),
    // `Object.values` method
    // https://tc39.es/ecma262/#sec-object.values
    values: createMethod(false)
  };

  var $$1 = _export;
  var $entries = objectToArray.entries;

  // `Object.entries` method
  // https://tc39.es/ecma262/#sec-object.entries
  $$1({ target: 'Object', stat: true }, {
    entries: function entries(O) {
      return $entries(O);
    }
  });

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  var ERR_HTTP_STATUS = "HTTP error ";
  var ERR_HTTP_RANGE = "HTTP Range not supported";
  var CONTENT_TYPE_TEXT_PLAIN = "text/plain";
  var HTTP_HEADER_CONTENT_LENGTH = "Content-Length";
  var HTTP_HEADER_CONTENT_RANGE = "Content-Range";
  var HTTP_HEADER_ACCEPT_RANGES = "Accept-Ranges";
  var HTTP_HEADER_RANGE = "Range";
  var HTTP_METHOD_HEAD = "HEAD";
  var HTTP_METHOD_GET = "GET";
  var HTTP_RANGE_UNIT = "bytes";

  var Stream = /*#__PURE__*/function () {
    function Stream() {
      _classCallCheck(this, Stream);

      this.size = 0;
    }

    _createClass(Stream, [{
      key: "init",
      value: function init() {
        this.initialized = true;
      }
    }]);

    return Stream;
  }();

  var Reader = /*#__PURE__*/function (_Stream) {
    _inherits(Reader, _Stream);

    var _super = _createSuper(Reader);

    function Reader() {
      _classCallCheck(this, Reader);

      return _super.apply(this, arguments);
    }

    return _createClass(Reader);
  }(Stream);

  var Writer = /*#__PURE__*/function (_Stream2) {
    _inherits(Writer, _Stream2);

    var _super2 = _createSuper(Writer);

    function Writer() {
      _classCallCheck(this, Writer);

      return _super2.apply(this, arguments);
    }

    _createClass(Writer, [{
      key: "writeUint8Array",
      value: function writeUint8Array(array) {
        this.size += array.length;
      }
    }]);

    return Writer;
  }(Stream);

  var TextReader = /*#__PURE__*/function (_Reader) {
    _inherits(TextReader, _Reader);

    var _super3 = _createSuper(TextReader);

    function TextReader(text) {
      var _this;

      _classCallCheck(this, TextReader);

      _this = _super3.call(this);
      _this.blobReader = new BlobReader(new Blob([text], {
        type: CONTENT_TYPE_TEXT_PLAIN
      }));
      return _this;
    }

    _createClass(TextReader, [{
      key: "init",
      value: function () {
        var _init = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _get(_getPrototypeOf(TextReader.prototype), "init", this).call(this);

                  this.blobReader.init();
                  this.size = this.blobReader.size;

                case 3:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function init() {
          return _init.apply(this, arguments);
        }

        return init;
      }()
    }, {
      key: "readUint8Array",
      value: function () {
        var _readUint8Array = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(offset, length) {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  return _context2.abrupt("return", this.blobReader.readUint8Array(offset, length));

                case 1:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function readUint8Array(_x, _x2) {
          return _readUint8Array.apply(this, arguments);
        }

        return readUint8Array;
      }()
    }]);

    return TextReader;
  }(Reader);

  var TextWriter = /*#__PURE__*/function (_Writer) {
    _inherits(TextWriter, _Writer);

    var _super4 = _createSuper(TextWriter);

    function TextWriter(encoding) {
      var _this2;

      _classCallCheck(this, TextWriter);

      _this2 = _super4.call(this);
      _this2.encoding = encoding;
      _this2.blob = new Blob([], {
        type: CONTENT_TYPE_TEXT_PLAIN
      });
      return _this2;
    }

    _createClass(TextWriter, [{
      key: "writeUint8Array",
      value: function () {
        var _writeUint8Array = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(array) {
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _get(_getPrototypeOf(TextWriter.prototype), "writeUint8Array", this).call(this, array);

                  this.blob = new Blob([this.blob, array.buffer], {
                    type: CONTENT_TYPE_TEXT_PLAIN
                  });

                case 2:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function writeUint8Array(_x3) {
          return _writeUint8Array.apply(this, arguments);
        }

        return writeUint8Array;
      }()
    }, {
      key: "getData",
      value: function getData() {
        var _this3 = this;

        if (this.blob.text) {
          return this.blob.text();
        } else {
          var reader = new FileReader();
          return new Promise(function (resolve, reject) {
            reader.onload = function (event) {
              return resolve(event.target.result);
            };

            reader.onerror = function () {
              return reject(reader.error);
            };

            reader.readAsText(_this3.blob, _this3.encoding);
          });
        }
      }
    }]);

    return TextWriter;
  }(Writer);

  var Data64URIReader = /*#__PURE__*/function (_Reader2) {
    _inherits(Data64URIReader, _Reader2);

    var _super5 = _createSuper(Data64URIReader);

    function Data64URIReader(dataURI) {
      var _this4;

      _classCallCheck(this, Data64URIReader);

      _this4 = _super5.call(this);
      _this4.dataURI = dataURI;
      var dataEnd = dataURI.length;

      while (dataURI.charAt(dataEnd - 1) == "=") {
        dataEnd--;
      }

      _this4.dataStart = dataURI.indexOf(",") + 1;
      _this4.size = Math.floor((dataEnd - _this4.dataStart) * 0.75);
      return _this4;
    }

    _createClass(Data64URIReader, [{
      key: "readUint8Array",
      value: function () {
        var _readUint8Array2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(offset, length) {
          var dataArray, start, bytes, delta, indexByte;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  dataArray = new Uint8Array(length);
                  start = Math.floor(offset / 3) * 4;
                  bytes = atob(this.dataURI.substring(start + this.dataStart, Math.ceil((offset + length) / 3) * 4 + this.dataStart));
                  delta = offset - Math.floor(start / 4) * 3;

                  for (indexByte = delta; indexByte < delta + length; indexByte++) {
                    dataArray[indexByte - delta] = bytes.charCodeAt(indexByte);
                  }

                  return _context4.abrupt("return", dataArray);

                case 6:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function readUint8Array(_x4, _x5) {
          return _readUint8Array2.apply(this, arguments);
        }

        return readUint8Array;
      }()
    }]);

    return Data64URIReader;
  }(Reader);

  var Data64URIWriter = /*#__PURE__*/function (_Writer2) {
    _inherits(Data64URIWriter, _Writer2);

    var _super6 = _createSuper(Data64URIWriter);

    function Data64URIWriter(contentType) {
      var _this5;

      _classCallCheck(this, Data64URIWriter);

      _this5 = _super6.call(this);
      _this5.data = "data:" + (contentType || "") + ";base64,";
      _this5.pending = [];
      return _this5;
    }

    _createClass(Data64URIWriter, [{
      key: "writeUint8Array",
      value: function () {
        var _writeUint8Array2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(array) {
          var indexArray, dataString, delta;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _get(_getPrototypeOf(Data64URIWriter.prototype), "writeUint8Array", this).call(this, array);

                  indexArray = 0;
                  dataString = this.pending;
                  delta = this.pending.length;
                  this.pending = "";

                  for (indexArray = 0; indexArray < Math.floor((delta + array.length) / 3) * 3 - delta; indexArray++) {
                    dataString += String.fromCharCode(array[indexArray]);
                  }

                  for (; indexArray < array.length; indexArray++) {
                    this.pending += String.fromCharCode(array[indexArray]);
                  }

                  if (dataString.length > 2) {
                    this.data += btoa(dataString);
                  } else {
                    this.pending = dataString;
                  }

                case 8:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function writeUint8Array(_x6) {
          return _writeUint8Array2.apply(this, arguments);
        }

        return writeUint8Array;
      }()
    }, {
      key: "getData",
      value: function getData() {
        return this.data + btoa(this.pending);
      }
    }]);

    return Data64URIWriter;
  }(Writer);

  var BlobReader = /*#__PURE__*/function (_Reader3) {
    _inherits(BlobReader, _Reader3);

    var _super7 = _createSuper(BlobReader);

    function BlobReader(blob) {
      var _this6;

      _classCallCheck(this, BlobReader);

      _this6 = _super7.call(this);
      _this6.blob = blob;
      _this6.size = blob.size;
      return _this6;
    }

    _createClass(BlobReader, [{
      key: "readUint8Array",
      value: function () {
        var _readUint8Array3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(offset, length) {
          var _this7 = this;

          var reader;
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  if (!this.blob.arrayBuffer) {
                    _context6.next = 8;
                    break;
                  }

                  _context6.t0 = Uint8Array;
                  _context6.next = 4;
                  return this.blob.slice(offset, offset + length).arrayBuffer();

                case 4:
                  _context6.t1 = _context6.sent;
                  return _context6.abrupt("return", new _context6.t0(_context6.t1));

                case 8:
                  reader = new FileReader();
                  return _context6.abrupt("return", new Promise(function (resolve, reject) {
                    reader.onload = function (event) {
                      return resolve(new Uint8Array(event.target.result));
                    };

                    reader.onerror = function () {
                      return reject(reader.error);
                    };

                    reader.readAsArrayBuffer(_this7.blob.slice(offset, offset + length));
                  }));

                case 10:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, this);
        }));

        function readUint8Array(_x7, _x8) {
          return _readUint8Array3.apply(this, arguments);
        }

        return readUint8Array;
      }()
    }]);

    return BlobReader;
  }(Reader);

  var BlobWriter = /*#__PURE__*/function (_Writer3) {
    _inherits(BlobWriter, _Writer3);

    var _super8 = _createSuper(BlobWriter);

    function BlobWriter(contentType) {
      var _this8;

      _classCallCheck(this, BlobWriter);

      _this8 = _super8.call(this);
      _this8.contentType = contentType;
      _this8.arrayBuffers = [];
      return _this8;
    }

    _createClass(BlobWriter, [{
      key: "writeUint8Array",
      value: function () {
        var _writeUint8Array3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(array) {
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _get(_getPrototypeOf(BlobWriter.prototype), "writeUint8Array", this).call(this, array);

                  this.arrayBuffers.push(array.buffer);

                case 2:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        }));

        function writeUint8Array(_x9) {
          return _writeUint8Array3.apply(this, arguments);
        }

        return writeUint8Array;
      }()
    }, {
      key: "getData",
      value: function getData() {
        if (!this.blob) {
          this.blob = new Blob(this.arrayBuffers, {
            type: this.contentType
          });
        }

        return this.blob;
      }
    }]);

    return BlobWriter;
  }(Writer);

  var FetchReader = /*#__PURE__*/function (_Reader4) {
    _inherits(FetchReader, _Reader4);

    var _super9 = _createSuper(FetchReader);

    function FetchReader(url, options) {
      var _this9;

      _classCallCheck(this, FetchReader);

      _this9 = _super9.call(this);
      _this9.url = url;
      _this9.preventHeadRequest = options.preventHeadRequest;
      _this9.useRangeHeader = options.useRangeHeader;
      _this9.forceRangeRequests = options.forceRangeRequests;
      _this9.options = Object.assign({}, options);
      delete _this9.options.preventHeadRequest;
      delete _this9.options.useRangeHeader;
      delete _this9.options.forceRangeRequests;
      delete _this9.options.useXHR;
      return _this9;
    }

    _createClass(FetchReader, [{
      key: "init",
      value: function () {
        var _init2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
          return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  _get(_getPrototypeOf(FetchReader.prototype), "init", this).call(this);

                  _context8.next = 3;
                  return initHttpReader(this, sendFetchRequest, getFetchRequestData);

                case 3:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8, this);
        }));

        function init() {
          return _init2.apply(this, arguments);
        }

        return init;
      }()
    }, {
      key: "readUint8Array",
      value: function () {
        var _readUint8Array4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(index, length) {
          return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  return _context9.abrupt("return", readUint8ArrayHttpReader(this, index, length, sendFetchRequest, getFetchRequestData));

                case 1:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee9, this);
        }));

        function readUint8Array(_x10, _x11) {
          return _readUint8Array4.apply(this, arguments);
        }

        return readUint8Array;
      }()
    }]);

    return FetchReader;
  }(Reader);

  var XHRReader = /*#__PURE__*/function (_Reader5) {
    _inherits(XHRReader, _Reader5);

    var _super10 = _createSuper(XHRReader);

    function XHRReader(url, options) {
      var _this10;

      _classCallCheck(this, XHRReader);

      _this10 = _super10.call(this);
      _this10.url = url;
      _this10.preventHeadRequest = options.preventHeadRequest;
      _this10.useRangeHeader = options.useRangeHeader;
      _this10.forceRangeRequests = options.forceRangeRequests;
      _this10.options = options;
      return _this10;
    }

    _createClass(XHRReader, [{
      key: "init",
      value: function () {
        var _init3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
          return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  _get(_getPrototypeOf(XHRReader.prototype), "init", this).call(this);

                  _context10.next = 3;
                  return initHttpReader(this, sendXMLHttpRequest, getXMLHttpRequestData);

                case 3:
                case "end":
                  return _context10.stop();
              }
            }
          }, _callee10, this);
        }));

        function init() {
          return _init3.apply(this, arguments);
        }

        return init;
      }()
    }, {
      key: "readUint8Array",
      value: function () {
        var _readUint8Array5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(index, length) {
          return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  return _context11.abrupt("return", readUint8ArrayHttpReader(this, index, length, sendXMLHttpRequest, getXMLHttpRequestData));

                case 1:
                case "end":
                  return _context11.stop();
              }
            }
          }, _callee11, this);
        }));

        function readUint8Array(_x12, _x13) {
          return _readUint8Array5.apply(this, arguments);
        }

        return readUint8Array;
      }()
    }]);

    return XHRReader;
  }(Reader);

  function initHttpReader(_x14, _x15, _x16) {
    return _initHttpReader.apply(this, arguments);
  }

  function _initHttpReader() {
    _initHttpReader = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(httpReader, sendRequest, getRequestData) {
      var response, contentSize, contentRangeHeader, splitHeader, headerValue;
      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              if (!(isHttpFamily(httpReader.url) && (httpReader.useRangeHeader || httpReader.forceRangeRequests))) {
                _context16.next = 18;
                break;
              }

              _context16.next = 3;
              return sendRequest(HTTP_METHOD_GET, httpReader, getRangeHeaders(httpReader));

            case 3:
              response = _context16.sent;

              if (!(!httpReader.forceRangeRequests && response.headers.get(HTTP_HEADER_ACCEPT_RANGES) != HTTP_RANGE_UNIT)) {
                _context16.next = 8;
                break;
              }

              throw new Error(ERR_HTTP_RANGE);

            case 8:
              contentRangeHeader = response.headers.get(HTTP_HEADER_CONTENT_RANGE);

              if (contentRangeHeader) {
                splitHeader = contentRangeHeader.trim().split(/\s*\/\s*/);

                if (splitHeader.length) {
                  headerValue = splitHeader[1];

                  if (headerValue && headerValue != "*") {
                    contentSize = Number(headerValue);
                  }
                }
              }

              if (!(contentSize === undefined)) {
                _context16.next = 15;
                break;
              }

              _context16.next = 13;
              return getContentLength(httpReader, sendRequest, getRequestData);

            case 13:
              _context16.next = 16;
              break;

            case 15:
              httpReader.size = contentSize;

            case 16:
              _context16.next = 20;
              break;

            case 18:
              _context16.next = 20;
              return getContentLength(httpReader, sendRequest, getRequestData);

            case 20:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    }));
    return _initHttpReader.apply(this, arguments);
  }

  function readUint8ArrayHttpReader(_x17, _x18, _x19, _x20, _x21) {
    return _readUint8ArrayHttpReader.apply(this, arguments);
  }

  function _readUint8ArrayHttpReader() {
    _readUint8ArrayHttpReader = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(httpReader, index, length, sendRequest, getRequestData) {
      var response;
      return regeneratorRuntime.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              if (!(httpReader.useRangeHeader || httpReader.forceRangeRequests)) {
                _context17.next = 13;
                break;
              }

              _context17.next = 3;
              return sendRequest(HTTP_METHOD_GET, httpReader, getRangeHeaders(httpReader, index, length));

            case 3:
              response = _context17.sent;

              if (!(response.status != 206)) {
                _context17.next = 6;
                break;
              }

              throw new Error(ERR_HTTP_RANGE);

            case 6:
              _context17.t0 = Uint8Array;
              _context17.next = 9;
              return response.arrayBuffer();

            case 9:
              _context17.t1 = _context17.sent;
              return _context17.abrupt("return", new _context17.t0(_context17.t1));

            case 13:
              if (httpReader.data) {
                _context17.next = 16;
                break;
              }

              _context17.next = 16;
              return getRequestData(httpReader, httpReader.options);

            case 16:
              return _context17.abrupt("return", new Uint8Array(httpReader.data.subarray(index, index + length)));

            case 17:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17);
    }));
    return _readUint8ArrayHttpReader.apply(this, arguments);
  }

  function getRangeHeaders(httpReader) {
    var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    return Object.assign({}, getHeaders(httpReader), _defineProperty({}, HTTP_HEADER_RANGE, HTTP_RANGE_UNIT + "=" + index + "-" + (index + length - 1)));
  }

  function getHeaders(httpReader) {
    var headers = httpReader.options.headers;

    if (headers) {
      if (Symbol.iterator in headers) {
        return Object.fromEntries(headers);
      } else {
        return headers;
      }
    }
  }

  function getFetchRequestData(_x22) {
    return _getFetchRequestData.apply(this, arguments);
  }

  function _getFetchRequestData() {
    _getFetchRequestData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(httpReader) {
      return regeneratorRuntime.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return getRequestData(httpReader, sendFetchRequest);

            case 2:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18);
    }));
    return _getFetchRequestData.apply(this, arguments);
  }

  function getXMLHttpRequestData(_x23) {
    return _getXMLHttpRequestData.apply(this, arguments);
  }

  function _getXMLHttpRequestData() {
    _getXMLHttpRequestData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(httpReader) {
      return regeneratorRuntime.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              _context19.next = 2;
              return getRequestData(httpReader, sendXMLHttpRequest);

            case 2:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19);
    }));
    return _getXMLHttpRequestData.apply(this, arguments);
  }

  function getRequestData(_x24, _x25) {
    return _getRequestData.apply(this, arguments);
  }

  function _getRequestData() {
    _getRequestData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(httpReader, sendRequest) {
      var response;
      return regeneratorRuntime.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              _context20.next = 2;
              return sendRequest(HTTP_METHOD_GET, httpReader, getHeaders(httpReader));

            case 2:
              response = _context20.sent;
              _context20.t0 = Uint8Array;
              _context20.next = 6;
              return response.arrayBuffer();

            case 6:
              _context20.t1 = _context20.sent;
              httpReader.data = new _context20.t0(_context20.t1);

              if (!httpReader.size) {
                httpReader.size = httpReader.data.length;
              }

            case 9:
            case "end":
              return _context20.stop();
          }
        }
      }, _callee20);
    }));
    return _getRequestData.apply(this, arguments);
  }

  function getContentLength(_x26, _x27, _x28) {
    return _getContentLength.apply(this, arguments);
  }

  function _getContentLength() {
    _getContentLength = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(httpReader, sendRequest, getRequestData) {
      var response, contentLength;
      return regeneratorRuntime.wrap(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              if (!httpReader.preventHeadRequest) {
                _context21.next = 5;
                break;
              }

              _context21.next = 3;
              return getRequestData(httpReader, httpReader.options);

            case 3:
              _context21.next = 15;
              break;

            case 5:
              _context21.next = 7;
              return sendRequest(HTTP_METHOD_HEAD, httpReader, getHeaders(httpReader));

            case 7:
              response = _context21.sent;
              contentLength = response.headers.get(HTTP_HEADER_CONTENT_LENGTH);

              if (!contentLength) {
                _context21.next = 13;
                break;
              }

              httpReader.size = Number(contentLength);
              _context21.next = 15;
              break;

            case 13:
              _context21.next = 15;
              return getRequestData(httpReader, httpReader.options);

            case 15:
            case "end":
              return _context21.stop();
          }
        }
      }, _callee21);
    }));
    return _getContentLength.apply(this, arguments);
  }

  function sendFetchRequest(_x29, _x30, _x31) {
    return _sendFetchRequest.apply(this, arguments);
  }

  function _sendFetchRequest() {
    _sendFetchRequest = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(method, _ref, headers) {
      var options, url, response;
      return regeneratorRuntime.wrap(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              options = _ref.options, url = _ref.url;
              _context22.next = 3;
              return fetch(url, Object.assign({}, options, {
                method: method,
                headers: headers
              }));

            case 3:
              response = _context22.sent;

              if (!(response.status < 400)) {
                _context22.next = 8;
                break;
              }

              return _context22.abrupt("return", response);

            case 8:
              throw new Error(ERR_HTTP_STATUS + (response.statusText || response.status));

            case 9:
            case "end":
              return _context22.stop();
          }
        }
      }, _callee22);
    }));
    return _sendFetchRequest.apply(this, arguments);
  }

  function sendXMLHttpRequest(method, _ref2, headers) {
    var url = _ref2.url;
    return new Promise(function (resolve, reject) {
      var request = new XMLHttpRequest();
      request.addEventListener("load", function () {
        if (request.status < 400) {
          var _headers = [];
          request.getAllResponseHeaders().trim().split(/[\r\n]+/).forEach(function (header) {
            var splitHeader = header.trim().split(/\s*:\s*/);
            splitHeader[0] = splitHeader[0].trim().replace(/^[a-z]|-[a-z]/g, function (value) {
              return value.toUpperCase();
            });

            _headers.push(splitHeader);
          });
          resolve({
            status: request.status,
            arrayBuffer: function arrayBuffer() {
              return request.response;
            },
            headers: new Map(_headers)
          });
        } else {
          reject(new Error(ERR_HTTP_STATUS + (request.statusText || request.status)));
        }
      }, false);
      request.addEventListener("error", function (event) {
        return reject(event.detail.error);
      }, false);
      request.open(method, url);

      if (headers) {
        for (var _i = 0, _Object$entries = Object.entries(headers); _i < _Object$entries.length; _i++) {
          var entry = _Object$entries[_i];
          request.setRequestHeader(entry[0], entry[1]);
        }
      }

      request.responseType = "arraybuffer";
      request.send();
    });
  }

  var HttpReader = /*#__PURE__*/function (_Reader6) {
    _inherits(HttpReader, _Reader6);

    var _super11 = _createSuper(HttpReader);

    function HttpReader(url) {
      var _this11;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, HttpReader);

      _this11 = _super11.call(this);
      _this11.url = url;

      if (options.useXHR) {
        _this11.reader = new XHRReader(url, options);
      } else {
        _this11.reader = new FetchReader(url, options);
      }

      return _this11;
    }

    _createClass(HttpReader, [{
      key: "size",
      get: function get() {
        return this.reader.size;
      },
      set: function set(value) {// ignored
      }
    }, {
      key: "init",
      value: function () {
        var _init4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
          return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  _get(_getPrototypeOf(HttpReader.prototype), "init", this).call(this);

                  _context12.next = 3;
                  return this.reader.init();

                case 3:
                case "end":
                  return _context12.stop();
              }
            }
          }, _callee12, this);
        }));

        function init() {
          return _init4.apply(this, arguments);
        }

        return init;
      }()
    }, {
      key: "readUint8Array",
      value: function () {
        var _readUint8Array6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(index, length) {
          return regeneratorRuntime.wrap(function _callee13$(_context13) {
            while (1) {
              switch (_context13.prev = _context13.next) {
                case 0:
                  return _context13.abrupt("return", this.reader.readUint8Array(index, length));

                case 1:
                case "end":
                  return _context13.stop();
              }
            }
          }, _callee13, this);
        }));

        function readUint8Array(_x32, _x33) {
          return _readUint8Array6.apply(this, arguments);
        }

        return readUint8Array;
      }()
    }]);

    return HttpReader;
  }(Reader);

  var HttpRangeReader = /*#__PURE__*/function (_HttpReader) {
    _inherits(HttpRangeReader, _HttpReader);

    var _super12 = _createSuper(HttpRangeReader);

    function HttpRangeReader(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, HttpRangeReader);

      options.useRangeHeader = true;
      return _super12.call(this, url, options);
    }

    return _createClass(HttpRangeReader);
  }(HttpReader);

  var Uint8ArrayReader = /*#__PURE__*/function (_Reader7) {
    _inherits(Uint8ArrayReader, _Reader7);

    var _super13 = _createSuper(Uint8ArrayReader);

    function Uint8ArrayReader(array) {
      var _this12;

      _classCallCheck(this, Uint8ArrayReader);

      _this12 = _super13.call(this);
      _this12.array = array;
      _this12.size = array.length;
      return _this12;
    }

    _createClass(Uint8ArrayReader, [{
      key: "readUint8Array",
      value: function () {
        var _readUint8Array7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(index, length) {
          return regeneratorRuntime.wrap(function _callee14$(_context14) {
            while (1) {
              switch (_context14.prev = _context14.next) {
                case 0:
                  return _context14.abrupt("return", this.array.slice(index, index + length));

                case 1:
                case "end":
                  return _context14.stop();
              }
            }
          }, _callee14, this);
        }));

        function readUint8Array(_x34, _x35) {
          return _readUint8Array7.apply(this, arguments);
        }

        return readUint8Array;
      }()
    }]);

    return Uint8ArrayReader;
  }(Reader);

  var Uint8ArrayWriter = /*#__PURE__*/function (_Writer4) {
    _inherits(Uint8ArrayWriter, _Writer4);

    var _super14 = _createSuper(Uint8ArrayWriter);

    function Uint8ArrayWriter() {
      var _this13;

      _classCallCheck(this, Uint8ArrayWriter);

      _this13 = _super14.call(this);
      _this13.array = new Uint8Array(0);
      return _this13;
    }

    _createClass(Uint8ArrayWriter, [{
      key: "writeUint8Array",
      value: function () {
        var _writeUint8Array4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(array) {
          var previousArray;
          return regeneratorRuntime.wrap(function _callee15$(_context15) {
            while (1) {
              switch (_context15.prev = _context15.next) {
                case 0:
                  _get(_getPrototypeOf(Uint8ArrayWriter.prototype), "writeUint8Array", this).call(this, array);

                  previousArray = this.array;
                  this.array = new Uint8Array(previousArray.length + array.length);
                  this.array.set(previousArray);
                  this.array.set(array, previousArray.length);

                case 5:
                case "end":
                  return _context15.stop();
              }
            }
          }, _callee15, this);
        }));

        function writeUint8Array(_x36) {
          return _writeUint8Array4.apply(this, arguments);
        }

        return writeUint8Array;
      }()
    }, {
      key: "getData",
      value: function getData() {
        return this.array;
      }
    }]);

    return Uint8ArrayWriter;
  }(Writer);

  function isHttpFamily(url) {
    if (typeof document != "undefined") {
      var anchor = document.createElement("a");
      anchor.href = url;
      return anchor.protocol == "http:" || anchor.protocol == "https:";
    } else {
      return /^https?:\/\//i.test(url);
    }
  }

  var $ = _export;
  var uncurryThis$1 = functionUncurryThis;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  var toLength = toLength$a;
  var toString = toString$9;
  var notARegExp = notARegexp;
  var requireObjectCoercible = requireObjectCoercible$8;
  var correctIsRegExpLogic = correctIsRegexpLogic;

  // eslint-disable-next-line es/no-string-prototype-endswith -- safe
  var un$EndsWith = uncurryThis$1(''.endsWith);
  var slice = uncurryThis$1(''.slice);
  var min = Math.min;

  var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('endsWith');
  // https://github.com/zloirock/core-js/pull/702
  var MDN_POLYFILL_BUG = !CORRECT_IS_REGEXP_LOGIC && !!function () {
    var descriptor = getOwnPropertyDescriptor(String.prototype, 'endsWith');
    return descriptor && !descriptor.writable;
  }();

  // `String.prototype.endsWith` method
  // https://tc39.es/ecma262/#sec-string.prototype.endswith
  $({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
    endsWith: function endsWith(searchString /* , endPosition = @length */) {
      var that = toString(requireObjectCoercible(this));
      notARegExp(searchString);
      var endPosition = arguments.length > 1 ? arguments[1] : undefined;
      var len = that.length;
      var end = endPosition === undefined ? len : min(toLength(endPosition), len);
      var search = toString(searchString);
      return un$EndsWith
        ? un$EndsWith(that, search, end)
        : slice(that, end - search.length, end) === search;
    }
  });

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */

  var MAX_32_BITS = 0xffffffff;
  var MAX_16_BITS = 0xffff;
  var COMPRESSION_METHOD_DEFLATE = 0x08;
  var COMPRESSION_METHOD_STORE = 0x00;
  var COMPRESSION_METHOD_AES = 0x63;
  var LOCAL_FILE_HEADER_SIGNATURE = 0x04034b50;
  var DATA_DESCRIPTOR_RECORD_SIGNATURE = 0x08074b50;
  var CENTRAL_FILE_HEADER_SIGNATURE = 0x02014b50;
  var END_OF_CENTRAL_DIR_SIGNATURE = 0x06054b50;
  var ZIP64_END_OF_CENTRAL_DIR_SIGNATURE = 0x06064b50;
  var ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE = 0x07064b50;
  var END_OF_CENTRAL_DIR_LENGTH = 22;
  var ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH = 20;
  var ZIP64_END_OF_CENTRAL_DIR_LENGTH = 56;
  var ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH = END_OF_CENTRAL_DIR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LENGTH;
  var ZIP64_TOTAL_NUMBER_OF_DISKS = 1;
  var EXTRAFIELD_TYPE_ZIP64 = 0x0001;
  var EXTRAFIELD_TYPE_AES = 0x9901;
  var EXTRAFIELD_TYPE_NTFS = 0x000a;
  var EXTRAFIELD_TYPE_NTFS_TAG1 = 0x0001;
  var EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP = 0x5455;
  var EXTRAFIELD_TYPE_UNICODE_PATH = 0x7075;
  var EXTRAFIELD_TYPE_UNICODE_COMMENT = 0x6375;
  var BITFLAG_ENCRYPTED = 0x01;
  var BITFLAG_LEVEL = 0x06;
  var BITFLAG_DATA_DESCRIPTOR = 0x0008;
  var BITFLAG_LANG_ENCODING_FLAG = 0x0800;
  var FILE_ATTR_MSDOS_DIR_MASK = 0x10;
  var VERSION_DEFLATE = 0x14;
  var VERSION_ZIP64 = 0x2D;
  var VERSION_AES = 0x33;
  var DIRECTORY_SIGNATURE = "/";
  var MAX_DATE = new Date(2107, 11, 31);
  var MIN_DATE = new Date(1980, 0, 1);

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  var CP437 = "\0☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ".split("");
  var decodeCP437 = (function (stringValue) {
    var result = "";

    for (var indexCharacter = 0; indexCharacter < stringValue.length; indexCharacter++) {
      result += CP437[stringValue[indexCharacter]];
    }

    return result;
  });

  function decodeText(_x, _x2) {
    return _decodeText.apply(this, arguments);
  }

  function _decodeText() {
    _decodeText = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(value, encoding) {
      var fileReader;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(encoding && encoding.trim().toLowerCase() == "cp437")) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return", decodeCP437(value));

            case 4:
              if (!(typeof TextDecoder == "undefined")) {
                _context.next = 9;
                break;
              }

              fileReader = new FileReader();
              return _context.abrupt("return", new Promise(function (resolve, reject) {
                fileReader.onload = function (event) {
                  return resolve(event.target.result);
                };

                fileReader.onerror = function () {
                  return reject(fileReader.error);
                };

                fileReader.readAsText(new Blob([value]));
              }));

            case 9:
              return _context.abrupt("return", new TextDecoder(encoding).decode(value));

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _decodeText.apply(this, arguments);
  }

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  var MINIMUM_CHUNK_SIZE = 64;
  var ERR_ABORT = "Abort error";

  function processData(_x, _x2, _x3, _x4, _x5, _x6, _x7) {
    return _processData.apply(this, arguments);
  }

  function _processData() {
    _processData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(codec, reader, writer, offset, inputLength, config, options) {
      var chunkSize, processChunk, _processChunk;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _processChunk = function _processChunk3() {
                _processChunk = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                  var chunkOffset,
                      outputLength,
                      signal,
                      inputData,
                      chunkLength,
                      data,
                      result,
                      _args = arguments;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          chunkOffset = _args.length > 0 && _args[0] !== undefined ? _args[0] : 0;
                          outputLength = _args.length > 1 && _args[1] !== undefined ? _args[1] : 0;
                          signal = options.signal;

                          if (!(chunkOffset < inputLength)) {
                            _context.next = 22;
                            break;
                          }

                          testAborted(signal, codec);
                          _context.next = 7;
                          return reader.readUint8Array(chunkOffset + offset, Math.min(chunkSize, inputLength - chunkOffset));

                        case 7:
                          inputData = _context.sent;
                          chunkLength = inputData.length;
                          testAborted(signal, codec);
                          _context.next = 12;
                          return codec.append(inputData);

                        case 12:
                          data = _context.sent;
                          testAborted(signal, codec);
                          _context.t0 = outputLength;
                          _context.next = 17;
                          return writeData(writer, data);

                        case 17:
                          outputLength = _context.t0 += _context.sent;

                          if (options.onprogress) {
                            try {
                              options.onprogress(chunkOffset + chunkLength, inputLength);
                            } catch (error) {// ignored
                            }
                          }

                          return _context.abrupt("return", processChunk(chunkOffset + chunkSize, outputLength));

                        case 22:
                          _context.next = 24;
                          return codec.flush();

                        case 24:
                          result = _context.sent;
                          _context.t1 = outputLength;
                          _context.next = 28;
                          return writeData(writer, result.data);

                        case 28:
                          outputLength = _context.t1 += _context.sent;
                          return _context.abrupt("return", {
                            signature: result.signature,
                            length: outputLength
                          });

                        case 30:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));
                return _processChunk.apply(this, arguments);
              };

              processChunk = function _processChunk2() {
                return _processChunk.apply(this, arguments);
              };

              chunkSize = Math.max(config.chunkSize, MINIMUM_CHUNK_SIZE);
              return _context2.abrupt("return", processChunk());

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _processData.apply(this, arguments);
  }

  function testAborted(signal, codec) {
    if (signal && signal.aborted) {
      codec.flush();
      throw new Error(ERR_ABORT);
    }
  }

  function writeData(_x8, _x9) {
    return _writeData.apply(this, arguments);
  }

  function _writeData() {
    _writeData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(writer, data) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!data.length) {
                _context3.next = 3;
                break;
              }

              _context3.next = 3;
              return writer.writeUint8Array(data);

            case 3:
              return _context3.abrupt("return", data.length);

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _writeData.apply(this, arguments);
  }

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  var PROPERTY_NAMES = ["filename", "rawFilename", "directory", "encrypted", "compressedSize", "uncompressedSize", "lastModDate", "rawLastModDate", "comment", "rawComment", "signature", "extraField", "rawExtraField", "bitFlag", "extraFieldZip64", "extraFieldUnicodePath", "extraFieldUnicodeComment", "extraFieldAES", "filenameUTF8", "commentUTF8", "offset", "zip64", "compressionMethod", "extraFieldNTFS", "lastAccessDate", "creationDate", "extraFieldExtendedTimestamp", "version", "versionMadeBy", "msDosCompatible", "internalFileAttribute", "externalFileAttribute"];

  var Entry = /*#__PURE__*/_createClass(function Entry(data) {
    var _this = this;

    _classCallCheck(this, Entry);

    PROPERTY_NAMES.forEach(function (name) {
      return _this[name] = data[name];
    });
  });

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  var ERR_BAD_FORMAT = "File format is not recognized";
  var ERR_EOCDR_NOT_FOUND = "End of central directory not found";
  var ERR_EOCDR_ZIP64_NOT_FOUND = "End of Zip64 central directory not found";
  var ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = "End of Zip64 central directory locator not found";
  var ERR_CENTRAL_DIRECTORY_NOT_FOUND = "Central directory header not found";
  var ERR_LOCAL_FILE_HEADER_NOT_FOUND = "Local file header not found";
  var ERR_EXTRAFIELD_ZIP64_NOT_FOUND = "Zip64 extra field not found";
  var ERR_ENCRYPTED = "File contains encrypted entry";
  var ERR_UNSUPPORTED_ENCRYPTION = "Encryption method not supported";
  var ERR_UNSUPPORTED_COMPRESSION = "Compression method not supported";
  var CHARSET_UTF8 = "utf-8";
  var CHARSET_CP437 = "cp437";
  var ZIP64_PROPERTIES = ["uncompressedSize", "compressedSize", "offset"];

  var ZipReader = /*#__PURE__*/function () {
    function ZipReader(reader) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, ZipReader);

      Object.assign(this, {
        reader: reader,
        options: options,
        config: getConfiguration()
      });
    }

    _createClass(ZipReader, [{
      key: "getEntries",
      value: function () {
        var _getEntries = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          var options,
              zipReader,
              reader,
              endOfDirectoryInfo,
              endOfDirectoryView,
              directoryDataLength,
              directoryDataOffset,
              filesLength,
              prependedDataLength,
              endOfDirectoryLocatorArray,
              endOfDirectoryLocatorView,
              endOfDirectoryArray,
              _endOfDirectoryView,
              expectedDirectoryDataOffset,
              originalDirectoryDataOffset,
              offset,
              directoryArray,
              directoryView,
              _expectedDirectoryDataOffset,
              _originalDirectoryDataOffset,
              entries,
              _loop,
              indexFile,
              _args2 = arguments;

          return regeneratorRuntime.wrap(function _callee$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  options = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
                  zipReader = this;
                  reader = zipReader.reader;

                  if (reader.initialized) {
                    _context2.next = 6;
                    break;
                  }

                  _context2.next = 6;
                  return reader.init();

                case 6:
                  if (!(reader.size < END_OF_CENTRAL_DIR_LENGTH)) {
                    _context2.next = 8;
                    break;
                  }

                  throw new Error(ERR_BAD_FORMAT);

                case 8:
                  _context2.next = 10;
                  return seekSignature(reader, END_OF_CENTRAL_DIR_SIGNATURE, reader.size, END_OF_CENTRAL_DIR_LENGTH, MAX_16_BITS * 16);

                case 10:
                  endOfDirectoryInfo = _context2.sent;

                  if (endOfDirectoryInfo) {
                    _context2.next = 13;
                    break;
                  }

                  throw new Error(ERR_EOCDR_NOT_FOUND);

                case 13:
                  endOfDirectoryView = getDataView$1(endOfDirectoryInfo);
                  directoryDataLength = getUint32(endOfDirectoryView, 12);
                  directoryDataOffset = getUint32(endOfDirectoryView, 16);
                  filesLength = getUint16(endOfDirectoryView, 8);
                  prependedDataLength = 0;

                  if (!(directoryDataOffset == MAX_32_BITS || directoryDataLength == MAX_32_BITS || filesLength == MAX_16_BITS)) {
                    _context2.next = 44;
                    break;
                  }

                  _context2.next = 21;
                  return readUint8Array(reader, endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH);

                case 21:
                  endOfDirectoryLocatorArray = _context2.sent;
                  endOfDirectoryLocatorView = getDataView$1(endOfDirectoryLocatorArray);

                  if (!(getUint32(endOfDirectoryLocatorView, 0) != ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE)) {
                    _context2.next = 25;
                    break;
                  }

                  throw new Error(ERR_EOCDR_ZIP64_NOT_FOUND);

                case 25:
                  directoryDataOffset = getBigUint64(endOfDirectoryLocatorView, 8);
                  _context2.next = 28;
                  return readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH);

                case 28:
                  endOfDirectoryArray = _context2.sent;
                  _endOfDirectoryView = getDataView$1(endOfDirectoryArray);
                  expectedDirectoryDataOffset = endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH - ZIP64_END_OF_CENTRAL_DIR_LENGTH;

                  if (!(getUint32(_endOfDirectoryView, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE && directoryDataOffset != expectedDirectoryDataOffset)) {
                    _context2.next = 39;
                    break;
                  }

                  originalDirectoryDataOffset = directoryDataOffset;
                  directoryDataOffset = expectedDirectoryDataOffset;
                  prependedDataLength = directoryDataOffset - originalDirectoryDataOffset;
                  _context2.next = 37;
                  return readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH);

                case 37:
                  endOfDirectoryArray = _context2.sent;
                  _endOfDirectoryView = getDataView$1(endOfDirectoryArray);

                case 39:
                  if (!(getUint32(_endOfDirectoryView, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE)) {
                    _context2.next = 41;
                    break;
                  }

                  throw new Error(ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND);

                case 41:
                  filesLength = getBigUint64(_endOfDirectoryView, 32);
                  directoryDataLength = getBigUint64(_endOfDirectoryView, 40);
                  directoryDataOffset -= directoryDataLength;

                case 44:
                  if (!(directoryDataOffset < 0 || directoryDataOffset >= reader.size)) {
                    _context2.next = 46;
                    break;
                  }

                  throw new Error(ERR_BAD_FORMAT);

                case 46:
                  offset = 0;
                  _context2.next = 49;
                  return readUint8Array(reader, directoryDataOffset, directoryDataLength);

                case 49:
                  directoryArray = _context2.sent;
                  directoryView = getDataView$1(directoryArray);

                  if (!directoryDataLength) {
                    _context2.next = 61;
                    break;
                  }

                  _expectedDirectoryDataOffset = endOfDirectoryInfo.offset - directoryDataLength;

                  if (!(getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE && directoryDataOffset != _expectedDirectoryDataOffset)) {
                    _context2.next = 61;
                    break;
                  }

                  _originalDirectoryDataOffset = directoryDataOffset;
                  directoryDataOffset = _expectedDirectoryDataOffset;
                  prependedDataLength = directoryDataOffset - _originalDirectoryDataOffset;
                  _context2.next = 59;
                  return readUint8Array(reader, directoryDataOffset, directoryDataLength);

                case 59:
                  directoryArray = _context2.sent;
                  directoryView = getDataView$1(directoryArray);

                case 61:
                  if (!(directoryDataOffset < 0 || directoryDataOffset >= reader.size)) {
                    _context2.next = 63;
                    break;
                  }

                  throw new Error(ERR_BAD_FORMAT);

                case 63:
                  entries = [];
                  _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(indexFile) {
                    var fileEntry, languageEncodingFlag, filenameOffset, extraFieldOffset, commentOffset, versionMadeBy, msDosCompatible, endOffset, filenameEncoding, commentEncoding, _yield$Promise$all, _yield$Promise$all2, filename, comment, entry;

                    return regeneratorRuntime.wrap(function _loop$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            fileEntry = new ZipEntry$1(reader, zipReader.config, zipReader.options);

                            if (!(getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE)) {
                              _context.next = 3;
                              break;
                            }

                            throw new Error(ERR_CENTRAL_DIRECTORY_NOT_FOUND);

                          case 3:
                            readCommonHeader(fileEntry, directoryView, offset + 6);
                            languageEncodingFlag = Boolean(fileEntry.bitFlag.languageEncodingFlag);
                            filenameOffset = offset + 46;
                            extraFieldOffset = filenameOffset + fileEntry.filenameLength;
                            commentOffset = extraFieldOffset + fileEntry.extraFieldLength;
                            versionMadeBy = getUint16(directoryView, offset + 4);
                            msDosCompatible = (versionMadeBy & 0) == 0;
                            Object.assign(fileEntry, {
                              versionMadeBy: versionMadeBy,
                              msDosCompatible: msDosCompatible,
                              compressedSize: 0,
                              uncompressedSize: 0,
                              commentLength: getUint16(directoryView, offset + 32),
                              directory: msDosCompatible && (getUint8(directoryView, offset + 38) & FILE_ATTR_MSDOS_DIR_MASK) == FILE_ATTR_MSDOS_DIR_MASK,
                              offset: getUint32(directoryView, offset + 42) + prependedDataLength,
                              internalFileAttribute: getUint32(directoryView, offset + 34),
                              externalFileAttribute: getUint32(directoryView, offset + 38),
                              rawFilename: directoryArray.subarray(filenameOffset, extraFieldOffset),
                              filenameUTF8: languageEncodingFlag,
                              commentUTF8: languageEncodingFlag,
                              rawExtraField: directoryArray.subarray(extraFieldOffset, commentOffset)
                            });
                            endOffset = commentOffset + fileEntry.commentLength;
                            fileEntry.rawComment = directoryArray.subarray(commentOffset, endOffset);
                            filenameEncoding = getOptionValue$1(zipReader, options, "filenameEncoding");
                            commentEncoding = getOptionValue$1(zipReader, options, "commentEncoding");
                            _context.next = 17;
                            return Promise.all([decodeText(fileEntry.rawFilename, fileEntry.filenameUTF8 ? CHARSET_UTF8 : filenameEncoding || CHARSET_CP437), decodeText(fileEntry.rawComment, fileEntry.commentUTF8 ? CHARSET_UTF8 : commentEncoding || CHARSET_CP437)]);

                          case 17:
                            _yield$Promise$all = _context.sent;
                            _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
                            filename = _yield$Promise$all2[0];
                            comment = _yield$Promise$all2[1];
                            fileEntry.filename = filename;
                            fileEntry.comment = comment;

                            if (!fileEntry.directory && fileEntry.filename.endsWith(DIRECTORY_SIGNATURE)) {
                              fileEntry.directory = true;
                            }

                            _context.next = 26;
                            return readCommonFooter(fileEntry, fileEntry, directoryView, offset + 6);

                          case 26:
                            entry = new Entry(fileEntry);

                            entry.getData = function (writer, options) {
                              return fileEntry.getData(writer, entry, options);
                            };

                            entries.push(entry);
                            offset = endOffset;

                            if (options.onprogress) {
                              try {
                                options.onprogress(indexFile + 1, filesLength, new Entry(fileEntry));
                              } catch (error) {// ignored
                              }
                            }

                          case 31:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _loop);
                  });
                  indexFile = 0;

                case 66:
                  if (!(indexFile < filesLength)) {
                    _context2.next = 71;
                    break;
                  }

                  return _context2.delegateYield(_loop(indexFile), "t0", 68);

                case 68:
                  indexFile++;
                  _context2.next = 66;
                  break;

                case 71:
                  return _context2.abrupt("return", entries);

                case 72:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee, this);
        }));

        function getEntries() {
          return _getEntries.apply(this, arguments);
        }

        return getEntries;
      }()
    }, {
      key: "close",
      value: function () {
        var _close = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
          return regeneratorRuntime.wrap(function _callee2$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee2);
        }));

        function close() {
          return _close.apply(this, arguments);
        }

        return close;
      }()
    }]);

    return ZipReader;
  }();

  var ZipEntry$1 = /*#__PURE__*/function () {
    function ZipEntry(reader, config, options) {
      _classCallCheck(this, ZipEntry);

      Object.assign(this, {
        reader: reader,
        config: config,
        options: options
      });
    }

    _createClass(ZipEntry, [{
      key: "getData",
      value: function () {
        var _getData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(writer, fileEntry) {
          var options,
              zipEntry,
              reader,
              offset,
              extraFieldAES,
              compressionMethod,
              config,
              bitFlag,
              signature,
              rawLastModDate,
              compressedSize,
              localDirectory,
              dataArray,
              dataView,
              password,
              encrypted,
              zipCrypto,
              codec,
              signal,
              dataOffset,
              _args4 = arguments;
          return regeneratorRuntime.wrap(function _callee3$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  options = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {};
                  zipEntry = this;
                  reader = zipEntry.reader, offset = zipEntry.offset, extraFieldAES = zipEntry.extraFieldAES, compressionMethod = zipEntry.compressionMethod, config = zipEntry.config, bitFlag = zipEntry.bitFlag, signature = zipEntry.signature, rawLastModDate = zipEntry.rawLastModDate, compressedSize = zipEntry.compressedSize;
                  localDirectory = zipEntry.localDirectory = {};

                  if (reader.initialized) {
                    _context4.next = 7;
                    break;
                  }

                  _context4.next = 7;
                  return reader.init();

                case 7:
                  _context4.next = 9;
                  return readUint8Array(reader, offset, 30);

                case 9:
                  dataArray = _context4.sent;
                  dataView = getDataView$1(dataArray);
                  password = getOptionValue$1(zipEntry, options, "password");
                  password = password && password.length && password;

                  if (!extraFieldAES) {
                    _context4.next = 16;
                    break;
                  }

                  if (!(extraFieldAES.originalCompressionMethod != COMPRESSION_METHOD_AES)) {
                    _context4.next = 16;
                    break;
                  }

                  throw new Error(ERR_UNSUPPORTED_COMPRESSION);

                case 16:
                  if (!(compressionMethod != COMPRESSION_METHOD_STORE && compressionMethod != COMPRESSION_METHOD_DEFLATE)) {
                    _context4.next = 18;
                    break;
                  }

                  throw new Error(ERR_UNSUPPORTED_COMPRESSION);

                case 18:
                  if (!(getUint32(dataView, 0) != LOCAL_FILE_HEADER_SIGNATURE)) {
                    _context4.next = 20;
                    break;
                  }

                  throw new Error(ERR_LOCAL_FILE_HEADER_NOT_FOUND);

                case 20:
                  readCommonHeader(localDirectory, dataView, 4);
                  _context4.next = 23;
                  return readUint8Array(reader, offset, 30 + localDirectory.filenameLength + localDirectory.extraFieldLength);

                case 23:
                  dataArray = _context4.sent;
                  localDirectory.rawExtraField = dataArray.subarray(30 + localDirectory.filenameLength);
                  _context4.next = 27;
                  return readCommonFooter(zipEntry, localDirectory, dataView, 4);

                case 27:
                  fileEntry.lastAccessDate = localDirectory.lastAccessDate;
                  fileEntry.creationDate = localDirectory.creationDate;
                  encrypted = zipEntry.encrypted && localDirectory.encrypted;
                  zipCrypto = encrypted && !extraFieldAES;

                  if (!encrypted) {
                    _context4.next = 38;
                    break;
                  }

                  if (!(!zipCrypto && extraFieldAES.strength === undefined)) {
                    _context4.next = 36;
                    break;
                  }

                  throw new Error(ERR_UNSUPPORTED_ENCRYPTION);

                case 36:
                  if (password) {
                    _context4.next = 38;
                    break;
                  }

                  throw new Error(ERR_ENCRYPTED);

                case 38:
                  _context4.next = 40;
                  return createCodec(config.Inflate, {
                    codecType: CODEC_INFLATE,
                    password: password,
                    zipCrypto: zipCrypto,
                    encryptionStrength: extraFieldAES && extraFieldAES.strength,
                    signed: getOptionValue$1(zipEntry, options, "checkSignature"),
                    passwordVerification: zipCrypto && (bitFlag.dataDescriptor ? rawLastModDate >>> 8 & 0xFF : signature >>> 24 & 0xFF),
                    signature: signature,
                    compressed: compressionMethod != 0,
                    encrypted: encrypted,
                    useWebWorkers: getOptionValue$1(zipEntry, options, "useWebWorkers")
                  }, config);

                case 40:
                  codec = _context4.sent;

                  if (writer.initialized) {
                    _context4.next = 44;
                    break;
                  }

                  _context4.next = 44;
                  return writer.init();

                case 44:
                  signal = getOptionValue$1(zipEntry, options, "signal");
                  dataOffset = offset + 30 + localDirectory.filenameLength + localDirectory.extraFieldLength;
                  _context4.next = 48;
                  return processData(codec, reader, writer, dataOffset, compressedSize, config, {
                    onprogress: options.onprogress,
                    signal: signal
                  });

                case 48:
                  return _context4.abrupt("return", writer.getData());

                case 49:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee3, this);
        }));

        function getData(_x, _x2) {
          return _getData.apply(this, arguments);
        }

        return getData;
      }()
    }]);

    return ZipEntry;
  }();

  function readCommonHeader(directory, dataView, offset) {
    var rawBitFlag = directory.rawBitFlag = getUint16(dataView, offset + 2);
    var encrypted = (rawBitFlag & BITFLAG_ENCRYPTED) == BITFLAG_ENCRYPTED;
    var rawLastModDate = getUint32(dataView, offset + 6);
    Object.assign(directory, {
      encrypted: encrypted,
      version: getUint16(dataView, offset),
      bitFlag: {
        level: (rawBitFlag & BITFLAG_LEVEL) >> 1,
        dataDescriptor: (rawBitFlag & BITFLAG_DATA_DESCRIPTOR) == BITFLAG_DATA_DESCRIPTOR,
        languageEncodingFlag: (rawBitFlag & BITFLAG_LANG_ENCODING_FLAG) == BITFLAG_LANG_ENCODING_FLAG
      },
      rawLastModDate: rawLastModDate,
      lastModDate: getDate(rawLastModDate),
      filenameLength: getUint16(dataView, offset + 22),
      extraFieldLength: getUint16(dataView, offset + 24)
    });
  }

  function readCommonFooter(_x3, _x4, _x5, _x6) {
    return _readCommonFooter.apply(this, arguments);
  }

  function _readCommonFooter() {
    _readCommonFooter = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(fileEntry, directory, dataView, offset) {
      var rawExtraField, extraField, rawExtraFieldView, offsetExtraField, type, size, compressionMethod, extraFieldZip64, extraFieldUnicodePath, extraFieldUnicodeComment, extraFieldAES, extraFieldNTFS, extraFieldExtendedTimestamp;
      return regeneratorRuntime.wrap(function _callee4$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              rawExtraField = directory.rawExtraField;
              extraField = directory.extraField = new Map();
              rawExtraFieldView = getDataView$1(new Uint8Array(rawExtraField));
              offsetExtraField = 0;

              try {
                while (offsetExtraField < rawExtraField.length) {
                  type = getUint16(rawExtraFieldView, offsetExtraField);
                  size = getUint16(rawExtraFieldView, offsetExtraField + 2);
                  extraField.set(type, {
                    type: type,
                    data: rawExtraField.slice(offsetExtraField + 4, offsetExtraField + 4 + size)
                  });
                  offsetExtraField += 4 + size;
                }
              } catch (error) {// ignored
              }

              compressionMethod = getUint16(dataView, offset + 4);
              directory.signature = getUint32(dataView, offset + 10);
              directory.uncompressedSize = getUint32(dataView, offset + 18);
              directory.compressedSize = getUint32(dataView, offset + 14);
              extraFieldZip64 = extraField.get(EXTRAFIELD_TYPE_ZIP64);

              if (extraFieldZip64) {
                readExtraFieldZip64(extraFieldZip64, directory);
                directory.extraFieldZip64 = extraFieldZip64;
              }

              extraFieldUnicodePath = extraField.get(EXTRAFIELD_TYPE_UNICODE_PATH);

              if (!extraFieldUnicodePath) {
                _context5.next = 16;
                break;
              }

              _context5.next = 15;
              return readExtraFieldUnicode(extraFieldUnicodePath, "filename", "rawFilename", directory, fileEntry);

            case 15:
              directory.extraFieldUnicodePath = extraFieldUnicodePath;

            case 16:
              extraFieldUnicodeComment = extraField.get(EXTRAFIELD_TYPE_UNICODE_COMMENT);

              if (!extraFieldUnicodeComment) {
                _context5.next = 21;
                break;
              }

              _context5.next = 20;
              return readExtraFieldUnicode(extraFieldUnicodeComment, "comment", "rawComment", directory, fileEntry);

            case 20:
              directory.extraFieldUnicodeComment = extraFieldUnicodeComment;

            case 21:
              extraFieldAES = extraField.get(EXTRAFIELD_TYPE_AES);

              if (extraFieldAES) {
                readExtraFieldAES(extraFieldAES, directory, compressionMethod);
                directory.extraFieldAES = extraFieldAES;
              } else {
                directory.compressionMethod = compressionMethod;
              }

              extraFieldNTFS = extraField.get(EXTRAFIELD_TYPE_NTFS);

              if (extraFieldNTFS) {
                readExtraFieldNTFS(extraFieldNTFS, directory);
                directory.extraFieldNTFS = extraFieldNTFS;
              }

              extraFieldExtendedTimestamp = extraField.get(EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);

              if (extraFieldExtendedTimestamp) {
                readExtraFieldExtendedTimestamp(extraFieldExtendedTimestamp, directory);
                directory.extraFieldExtendedTimestamp = extraFieldExtendedTimestamp;
              }

            case 27:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee4);
    }));
    return _readCommonFooter.apply(this, arguments);
  }

  function readExtraFieldZip64(extraFieldZip64, directory) {
    directory.zip64 = true;
    var extraFieldView = getDataView$1(extraFieldZip64.data);
    extraFieldZip64.values = [];

    for (var indexValue = 0; indexValue < Math.floor(extraFieldZip64.data.length / 8); indexValue++) {
      extraFieldZip64.values.push(getBigUint64(extraFieldView, 0 + indexValue * 8));
    }

    var missingProperties = ZIP64_PROPERTIES.filter(function (propertyName) {
      return directory[propertyName] == MAX_32_BITS;
    });

    for (var indexMissingProperty = 0; indexMissingProperty < missingProperties.length; indexMissingProperty++) {
      extraFieldZip64[missingProperties[indexMissingProperty]] = extraFieldZip64.values[indexMissingProperty];
    }

    ZIP64_PROPERTIES.forEach(function (propertyName) {
      if (directory[propertyName] == MAX_32_BITS) {
        if (extraFieldZip64[propertyName] !== undefined) {
          directory[propertyName] = extraFieldZip64[propertyName];
        } else {
          throw new Error(ERR_EXTRAFIELD_ZIP64_NOT_FOUND);
        }
      }
    });
  }

  function readExtraFieldUnicode(_x7, _x8, _x9, _x10, _x11) {
    return _readExtraFieldUnicode.apply(this, arguments);
  }

  function _readExtraFieldUnicode() {
    _readExtraFieldUnicode = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(extraFieldUnicode, propertyName, rawPropertyName, directory, fileEntry) {
      var extraFieldView, crc32, dataViewSignature;
      return regeneratorRuntime.wrap(function _callee5$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              extraFieldView = getDataView$1(extraFieldUnicode.data);
              extraFieldUnicode.version = getUint8(extraFieldView, 0);
              extraFieldUnicode.signature = getUint32(extraFieldView, 1);
              crc32 = new Crc32();
              crc32.append(fileEntry[rawPropertyName]);
              dataViewSignature = getDataView$1(new Uint8Array(4));
              dataViewSignature.setUint32(0, crc32.get(), true);
              _context6.next = 9;
              return decodeText(extraFieldUnicode.data.subarray(5));

            case 9:
              extraFieldUnicode[propertyName] = _context6.sent;
              extraFieldUnicode.valid = !fileEntry.bitFlag.languageEncodingFlag && extraFieldUnicode.signature == getUint32(dataViewSignature, 0);

              if (extraFieldUnicode.valid) {
                directory[propertyName] = extraFieldUnicode[propertyName];
                directory[propertyName + "UTF8"] = true;
              }

            case 12:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee5);
    }));
    return _readExtraFieldUnicode.apply(this, arguments);
  }

  function readExtraFieldAES(extraFieldAES, directory, compressionMethod) {
    var extraFieldView = getDataView$1(extraFieldAES.data);
    extraFieldAES.vendorVersion = getUint8(extraFieldView, 0);
    extraFieldAES.vendorId = getUint8(extraFieldView, 2);
    var strength = getUint8(extraFieldView, 4);
    extraFieldAES.strength = strength;
    extraFieldAES.originalCompressionMethod = compressionMethod;
    directory.compressionMethod = extraFieldAES.compressionMethod = getUint16(extraFieldView, 5);
  }

  function readExtraFieldNTFS(extraFieldNTFS, directory) {
    var extraFieldView = getDataView$1(extraFieldNTFS.data);
    var offsetExtraField = 4;
    var tag1Data;

    try {
      while (offsetExtraField < extraFieldNTFS.data.length && !tag1Data) {
        var tagValue = getUint16(extraFieldView, offsetExtraField);
        var attributeSize = getUint16(extraFieldView, offsetExtraField + 2);

        if (tagValue == EXTRAFIELD_TYPE_NTFS_TAG1) {
          tag1Data = extraFieldNTFS.data.slice(offsetExtraField + 4, offsetExtraField + 4 + attributeSize);
        }

        offsetExtraField += 4 + attributeSize;
      }
    } catch (error) {// ignored
    }

    try {
      if (tag1Data && tag1Data.length == 24) {
        var tag1View = getDataView$1(tag1Data);
        var rawLastModDate = tag1View.getBigUint64(0, true);
        var rawLastAccessDate = tag1View.getBigUint64(8, true);
        var rawCreationDate = tag1View.getBigUint64(16, true);
        Object.assign(extraFieldNTFS, {
          rawLastModDate: rawLastModDate,
          rawLastAccessDate: rawLastAccessDate,
          rawCreationDate: rawCreationDate
        });
        var lastModDate = getDateNTFS(rawLastModDate);
        var lastAccessDate = getDateNTFS(rawLastAccessDate);
        var creationDate = getDateNTFS(rawCreationDate);
        var extraFieldData = {
          lastModDate: lastModDate,
          lastAccessDate: lastAccessDate,
          creationDate: creationDate
        };
        Object.assign(extraFieldNTFS, extraFieldData);
        Object.assign(directory, extraFieldData);
      }
    } catch (error) {// ignored
    }
  }

  function readExtraFieldExtendedTimestamp(extraFieldExtendedTimestamp, directory) {
    var extraFieldView = getDataView$1(extraFieldExtendedTimestamp.data);
    var flags = getUint8(extraFieldView, 0);
    var timeProperties = [];
    var timeRawProperties = [];

    if ((flags & 0x1) == 0x1) {
      timeProperties.push("lastModDate");
      timeRawProperties.push("rawLastModDate");
    }

    if ((flags & 0x2) == 0x2) {
      timeProperties.push("lastAccessDate");
      timeRawProperties.push("rawLastAccessDate");
    }

    if ((flags & 0x4) == 0x4) {
      timeProperties.push("creationDate");
      timeRawProperties.push("rawCreationDate");
    }

    var offset = 1;
    timeProperties.forEach(function (propertyName, indexProperty) {
      if (extraFieldExtendedTimestamp.data.length >= offset + 4) {
        var time = getUint32(extraFieldView, offset);
        directory[propertyName] = extraFieldExtendedTimestamp[propertyName] = new Date(time * 1000);
        var rawPropertyName = timeRawProperties[indexProperty];
        extraFieldExtendedTimestamp[rawPropertyName] = time;
      }

      offset += 4;
    });
  }

  function seekSignature(_x12, _x13, _x14, _x15, _x16) {
    return _seekSignature.apply(this, arguments);
  }

  function _seekSignature() {
    _seekSignature = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(reader, signature, startOffset, minimumBytes, maximumLength) {
      var signatureArray, signatureView, maximumBytes, seek, _seek;

      return regeneratorRuntime.wrap(function _callee7$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _seek = function _seek3() {
                _seek = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(length) {
                  var offset, bytes, indexByte;
                  return regeneratorRuntime.wrap(function _callee6$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          offset = startOffset - length;
                          _context7.next = 3;
                          return readUint8Array(reader, offset, length);

                        case 3:
                          bytes = _context7.sent;
                          indexByte = bytes.length - minimumBytes;

                        case 5:
                          if (!(indexByte >= 0)) {
                            _context7.next = 11;
                            break;
                          }

                          if (!(bytes[indexByte] == signatureArray[0] && bytes[indexByte + 1] == signatureArray[1] && bytes[indexByte + 2] == signatureArray[2] && bytes[indexByte + 3] == signatureArray[3])) {
                            _context7.next = 8;
                            break;
                          }

                          return _context7.abrupt("return", {
                            offset: offset + indexByte,
                            buffer: bytes.slice(indexByte, indexByte + minimumBytes).buffer
                          });

                        case 8:
                          indexByte--;
                          _context7.next = 5;
                          break;

                        case 11:
                        case "end":
                          return _context7.stop();
                      }
                    }
                  }, _callee6);
                }));
                return _seek.apply(this, arguments);
              };

              seek = function _seek2(_x17) {
                return _seek.apply(this, arguments);
              };

              signatureArray = new Uint8Array(4);
              signatureView = getDataView$1(signatureArray);
              setUint32$1(signatureView, 0, signature);
              maximumBytes = minimumBytes + maximumLength;
              _context8.next = 8;
              return seek(minimumBytes);

            case 8:
              _context8.t0 = _context8.sent;

              if (_context8.t0) {
                _context8.next = 13;
                break;
              }

              _context8.next = 12;
              return seek(Math.min(maximumBytes, startOffset));

            case 12:
              _context8.t0 = _context8.sent;

            case 13:
              return _context8.abrupt("return", _context8.t0);

            case 14:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee7);
    }));
    return _seekSignature.apply(this, arguments);
  }

  function getOptionValue$1(zipReader, options, name) {
    return options[name] === undefined ? zipReader.options[name] : options[name];
  }

  function getDate(timeRaw) {
    var date = (timeRaw & 0xffff0000) >> 16,
        time = timeRaw & 0x0000ffff;

    try {
      return new Date(1980 + ((date & 0xFE00) >> 9), ((date & 0x01E0) >> 5) - 1, date & 0x001F, (time & 0xF800) >> 11, (time & 0x07E0) >> 5, (time & 0x001F) * 2, 0);
    } catch (error) {// ignored
    }
  }

  function getDateNTFS(timeRaw) {
    return new Date(Number(timeRaw / BigInt(10000) - BigInt(11644473600000)));
  }

  function getUint8(view, offset) {
    return view.getUint8(offset);
  }

  function getUint16(view, offset) {
    return view.getUint16(offset, true);
  }

  function getUint32(view, offset) {
    return view.getUint32(offset, true);
  }

  function getBigUint64(view, offset) {
    return Number(view.getBigUint64(offset, true));
  }

  function setUint32$1(view, offset, value) {
    view.setUint32(offset, value, true);
  }

  function getDataView$1(array) {
    return new DataView(array.buffer);
  }

  function readUint8Array(reader, offset, size) {
    return reader.readUint8Array(offset, size);
  }

  var DESCRIPTORS = descriptors;
  var FUNCTION_NAME_EXISTS = functionName.EXISTS;
  var uncurryThis = functionUncurryThis;
  var defineProperty = objectDefineProperty.f;

  var FunctionPrototype = Function.prototype;
  var functionToString = uncurryThis(FunctionPrototype.toString);
  var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
  var regExpExec = uncurryThis(nameRE.exec);
  var NAME = 'name';

  // Function instances `.name` property
  // https://tc39.es/ecma262/#sec-function-instances-name
  if (DESCRIPTORS && !FUNCTION_NAME_EXISTS) {
    defineProperty(FunctionPrototype, NAME, {
      configurable: true,
      get: function () {
        try {
          return regExpExec(nameRE, functionToString(this))[1];
        } catch (error) {
          return '';
        }
      }
    });
  }

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  var ERR_DUPLICATED_NAME = "File already exists";
  var ERR_INVALID_COMMENT = "Zip file comment exceeds 64KB";
  var ERR_INVALID_ENTRY_COMMENT = "File entry comment exceeds 64KB";
  var ERR_INVALID_ENTRY_NAME = "File entry name exceeds 64KB";
  var ERR_INVALID_VERSION = "Version exceeds 65535";
  var ERR_INVALID_ENCRYPTION_STRENGTH = "The strength must equal 1, 2, or 3";
  var ERR_INVALID_EXTRAFIELD_TYPE = "Extra field type exceeds 65535";
  var ERR_INVALID_EXTRAFIELD_DATA = "Extra field data exceeds 64KB";
  var ERR_UNSUPPORTED_FORMAT = "Zip64 is not supported";
  var EXTRAFIELD_DATA_AES = new Uint8Array([0x07, 0x00, 0x02, 0x00, 0x41, 0x45, 0x03, 0x00, 0x00]);
  var EXTRAFIELD_LENGTH_ZIP64 = 24;
  var workers = 0;

  var ZipWriter = /*#__PURE__*/function () {
    function ZipWriter(writer) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, ZipWriter);

      Object.assign(this, {
        writer: writer,
        options: options,
        config: getConfiguration(),
        files: new Map(),
        offset: writer.size,
        pendingCompressedSize: 0,
        pendingEntries: []
      });
    }

    _createClass(ZipWriter, [{
      key: "add",
      value: function () {
        var _add = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          var name,
              reader,
              options,
              zipWriter,
              pendingEntry,
              _args = arguments;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  name = _args.length > 0 && _args[0] !== undefined ? _args[0] : "";
                  reader = _args.length > 1 ? _args[1] : undefined;
                  options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
                  zipWriter = this;

                  if (!(workers < zipWriter.config.maxWorkers)) {
                    _context.next = 17;
                    break;
                  }

                  workers++;
                  _context.prev = 6;
                  _context.next = 9;
                  return addFile(zipWriter, name, reader, options);

                case 9:
                  return _context.abrupt("return", _context.sent);

                case 10:
                  _context.prev = 10;
                  workers--;
                  pendingEntry = zipWriter.pendingEntries.shift();

                  if (pendingEntry) {
                    zipWriter.add(pendingEntry.name, pendingEntry.reader, pendingEntry.options).then(pendingEntry.resolve).catch(pendingEntry.reject);
                  }

                  return _context.finish(10);

                case 15:
                  _context.next = 18;
                  break;

                case 17:
                  return _context.abrupt("return", new Promise(function (resolve, reject) {
                    return zipWriter.pendingEntries.push({
                      name: name,
                      reader: reader,
                      options: options,
                      resolve: resolve,
                      reject: reject
                    });
                  }));

                case 18:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this, [[6,, 10, 15]]);
        }));

        function add() {
          return _add.apply(this, arguments);
        }

        return add;
      }()
    }, {
      key: "close",
      value: function () {
        var _close = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
          var comment,
              options,
              _args2 = arguments;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  comment = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : new Uint8Array(0);
                  options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
                  _context2.next = 4;
                  return closeFile(this, comment, options);

                case 4:
                  return _context2.abrupt("return", this.writer.getData());

                case 5:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function close() {
          return _close.apply(this, arguments);
        }

        return close;
      }()
    }]);

    return ZipWriter;
  }();

  function addFile(_x, _x2, _x3, _x4) {
    return _addFile.apply(this, arguments);
  }

  function _addFile() {
    _addFile = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(zipWriter, name, reader, options) {
      var rawFilename, comment, rawComment, version, versionMadeBy, lastModDate, lastAccessDate, creationDate, password, encryptionStrength, zipCrypto, rawExtraField, extraField, extraFieldSize, offset, extendedTimestamp, maximumCompressedSize, keepOrder, uncompressedSize, msDosCompatible, internalFileAttribute, externalFileAttribute, zip64, level, useWebWorkers, bufferedWrite, dataDescriptor, dataDescriptorSignature, signal, fileEntry;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              name = name.trim();

              if (options.directory && !name.endsWith(DIRECTORY_SIGNATURE)) {
                name += DIRECTORY_SIGNATURE;
              } else {
                options.directory = name.endsWith(DIRECTORY_SIGNATURE);
              }

              if (!zipWriter.files.has(name)) {
                _context3.next = 4;
                break;
              }

              throw new Error(ERR_DUPLICATED_NAME);

            case 4:
              rawFilename = encodeText(name);

              if (!(rawFilename.length > MAX_16_BITS)) {
                _context3.next = 7;
                break;
              }

              throw new Error(ERR_INVALID_ENTRY_NAME);

            case 7:
              comment = options.comment || "";
              rawComment = encodeText(comment);

              if (!(rawComment.length > MAX_16_BITS)) {
                _context3.next = 11;
                break;
              }

              throw new Error(ERR_INVALID_ENTRY_COMMENT);

            case 11:
              version = zipWriter.options.version || options.version || 0;

              if (!(version > MAX_16_BITS)) {
                _context3.next = 14;
                break;
              }

              throw new Error(ERR_INVALID_VERSION);

            case 14:
              versionMadeBy = zipWriter.options.versionMadeBy || options.versionMadeBy || 20;

              if (!(versionMadeBy > MAX_16_BITS)) {
                _context3.next = 17;
                break;
              }

              throw new Error(ERR_INVALID_VERSION);

            case 17:
              lastModDate = getOptionValue(zipWriter, options, "lastModDate") || new Date();
              lastAccessDate = getOptionValue(zipWriter, options, "lastAccessDate");
              creationDate = getOptionValue(zipWriter, options, "creationDate");
              password = getOptionValue(zipWriter, options, "password");
              encryptionStrength = getOptionValue(zipWriter, options, "encryptionStrength") || 3;
              zipCrypto = getOptionValue(zipWriter, options, "zipCrypto");

              if (!(password !== undefined && encryptionStrength !== undefined && (encryptionStrength < 1 || encryptionStrength > 3))) {
                _context3.next = 25;
                break;
              }

              throw new Error(ERR_INVALID_ENCRYPTION_STRENGTH);

            case 25:
              rawExtraField = new Uint8Array(0);
              extraField = options.extraField;

              if (extraField) {
                extraFieldSize = 0;
                offset = 0;
                extraField.forEach(function (data) {
                  return extraFieldSize += 4 + data.length;
                });
                rawExtraField = new Uint8Array(extraFieldSize);
                extraField.forEach(function (data, type) {
                  if (type > MAX_16_BITS) {
                    throw new Error(ERR_INVALID_EXTRAFIELD_TYPE);
                  }

                  if (data.length > MAX_16_BITS) {
                    throw new Error(ERR_INVALID_EXTRAFIELD_DATA);
                  }

                  arraySet(rawExtraField, new Uint16Array([type]), offset);
                  arraySet(rawExtraField, new Uint16Array([data.length]), offset + 2);
                  arraySet(rawExtraField, data, offset + 4);
                  offset += 4 + data.length;
                });
              }

              extendedTimestamp = getOptionValue(zipWriter, options, "extendedTimestamp");

              if (extendedTimestamp === undefined) {
                extendedTimestamp = true;
              }

              maximumCompressedSize = 0;
              keepOrder = getOptionValue(zipWriter, options, "keepOrder");

              if (keepOrder === undefined) {
                keepOrder = true;
              }

              uncompressedSize = 0;
              msDosCompatible = getOptionValue(zipWriter, options, "msDosCompatible");

              if (msDosCompatible === undefined) {
                msDosCompatible = true;
              }

              internalFileAttribute = getOptionValue(zipWriter, options, "internalFileAttribute") || 0;
              externalFileAttribute = getOptionValue(zipWriter, options, "externalFileAttribute") || 0;

              if (!reader) {
                _context3.next = 44;
                break;
              }

              if (reader.initialized) {
                _context3.next = 42;
                break;
              }

              _context3.next = 42;
              return reader.init();

            case 42:
              uncompressedSize = reader.size;
              maximumCompressedSize = getMaximumCompressedSize(uncompressedSize);

            case 44:
              zip64 = options.zip64 || zipWriter.options.zip64 || false;

              if (!(zipWriter.offset + zipWriter.pendingCompressedSize >= MAX_32_BITS || uncompressedSize >= MAX_32_BITS || maximumCompressedSize >= MAX_32_BITS)) {
                _context3.next = 51;
                break;
              }

              if (!(options.zip64 === false || zipWriter.options.zip64 === false || !keepOrder)) {
                _context3.next = 50;
                break;
              }

              throw new Error(ERR_UNSUPPORTED_FORMAT);

            case 50:
              zip64 = true;

            case 51:
              zipWriter.pendingCompressedSize += maximumCompressedSize;
              _context3.next = 54;
              return Promise.resolve();

            case 54:
              level = getOptionValue(zipWriter, options, "level");
              useWebWorkers = getOptionValue(zipWriter, options, "useWebWorkers");
              bufferedWrite = getOptionValue(zipWriter, options, "bufferedWrite");
              dataDescriptor = getOptionValue(zipWriter, options, "dataDescriptor");
              dataDescriptorSignature = getOptionValue(zipWriter, options, "dataDescriptorSignature");
              signal = getOptionValue(zipWriter, options, "signal");

              if (dataDescriptor === undefined) {
                dataDescriptor = true;
              }

              if (dataDescriptor && dataDescriptorSignature === undefined) {
                dataDescriptorSignature = true;
              }

              _context3.next = 64;
              return getFileEntry(zipWriter, name, reader, Object.assign({}, options, {
                rawFilename: rawFilename,
                rawComment: rawComment,
                version: version,
                versionMadeBy: versionMadeBy,
                lastModDate: lastModDate,
                lastAccessDate: lastAccessDate,
                creationDate: creationDate,
                rawExtraField: rawExtraField,
                zip64: zip64,
                password: password,
                level: level,
                useWebWorkers: useWebWorkers,
                encryptionStrength: encryptionStrength,
                extendedTimestamp: extendedTimestamp,
                zipCrypto: zipCrypto,
                bufferedWrite: bufferedWrite,
                keepOrder: keepOrder,
                dataDescriptor: dataDescriptor,
                dataDescriptorSignature: dataDescriptorSignature,
                signal: signal,
                msDosCompatible: msDosCompatible,
                internalFileAttribute: internalFileAttribute,
                externalFileAttribute: externalFileAttribute
              }));

            case 64:
              fileEntry = _context3.sent;

              if (maximumCompressedSize) {
                zipWriter.pendingCompressedSize -= maximumCompressedSize;
              }

              Object.assign(fileEntry, {
                name: name,
                comment: comment,
                extraField: extraField
              });
              return _context3.abrupt("return", new Entry(fileEntry));

            case 68:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _addFile.apply(this, arguments);
  }

  function getFileEntry(_x5, _x6, _x7, _x8) {
    return _getFileEntry.apply(this, arguments);
  }

  function _getFileEntry() {
    _getFileEntry = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(zipWriter, name, reader, options) {
      var files, writer, previousFileEntry, fileEntry, bufferedWrite, resolveLockUnbufferedWrite, resolveLockCurrentFileEntry, lockPreviousFileEntry, fileWriter, lockCurrentFileEntry, indexWrittenData, blob, pendingFileEntry, headerLength, arrayBuffer, arrayBufferView, rawExtraFieldZip64View;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              files = zipWriter.files;
              writer = zipWriter.writer;
              previousFileEntry = Array.from(files.values()).pop();
              fileEntry = {};
              files.set(name, fileEntry);
              _context4.prev = 5;

              if (options.keepOrder) {
                lockPreviousFileEntry = previousFileEntry && previousFileEntry.lock;
              }

              fileEntry.lock = lockCurrentFileEntry = new Promise(function (resolve) {
                return resolveLockCurrentFileEntry = resolve;
              });

              if (!(options.bufferedWrite || zipWriter.lockWrite || !options.dataDescriptor)) {
                _context4.next = 14;
                break;
              }

              fileWriter = new BlobWriter();
              fileWriter.init();
              bufferedWrite = true;
              _context4.next = 19;
              break;

            case 14:
              zipWriter.lockWrite = new Promise(function (resolve) {
                return resolveLockUnbufferedWrite = resolve;
              });

              if (writer.initialized) {
                _context4.next = 18;
                break;
              }

              _context4.next = 18;
              return writer.init();

            case 18:
              fileWriter = writer;

            case 19:
              _context4.next = 21;
              return createFileEntry(reader, fileWriter, zipWriter.config, options);

            case 21:
              fileEntry = _context4.sent;
              fileEntry.lock = lockCurrentFileEntry;
              files.set(name, fileEntry);
              fileEntry.filename = name;

              if (!bufferedWrite) {
                _context4.next = 50;
                break;
              }

              indexWrittenData = 0;
              blob = fileWriter.getData();
              _context4.next = 30;
              return Promise.all([zipWriter.lockWrite, lockPreviousFileEntry]);

            case 30:
              pendingFileEntry = Array.from(files.values()).find(function (fileEntry) {
                return fileEntry.writingBufferedData;
              });

              if (!pendingFileEntry) {
                _context4.next = 34;
                break;
              }

              _context4.next = 34;
              return pendingFileEntry.lock;

            case 34:
              if (pendingFileEntry && pendingFileEntry.lock) {
                _context4.next = 30;
                break;
              }

            case 35:
              fileEntry.writingBufferedData = true;

              if (options.dataDescriptor) {
                _context4.next = 47;
                break;
              }

              headerLength = 26;
              _context4.next = 40;
              return sliceAsArrayBuffer(blob, 0, headerLength);

            case 40:
              arrayBuffer = _context4.sent;
              arrayBufferView = new DataView(arrayBuffer);

              if (!fileEntry.encrypted || options.zipCrypto) {
                setUint32(arrayBufferView, 14, fileEntry.signature);
              }

              if (fileEntry.zip64) {
                setUint32(arrayBufferView, 18, MAX_32_BITS);
                setUint32(arrayBufferView, 22, MAX_32_BITS);
              } else {
                setUint32(arrayBufferView, 18, fileEntry.compressedSize);
                setUint32(arrayBufferView, 22, fileEntry.uncompressedSize);
              }

              _context4.next = 46;
              return writer.writeUint8Array(new Uint8Array(arrayBuffer));

            case 46:
              indexWrittenData = headerLength;

            case 47:
              _context4.next = 49;
              return writeBlob(writer, blob, indexWrittenData);

            case 49:
              delete fileEntry.writingBufferedData;

            case 50:
              fileEntry.offset = zipWriter.offset;

              if (!fileEntry.zip64) {
                _context4.next = 56;
                break;
              }

              rawExtraFieldZip64View = getDataView(fileEntry.rawExtraFieldZip64);
              setBigUint64(rawExtraFieldZip64View, 20, BigInt(fileEntry.offset));
              _context4.next = 58;
              break;

            case 56:
              if (!(fileEntry.offset >= MAX_32_BITS)) {
                _context4.next = 58;
                break;
              }

              throw new Error(ERR_UNSUPPORTED_FORMAT);

            case 58:
              zipWriter.offset += fileEntry.length;
              return _context4.abrupt("return", fileEntry);

            case 62:
              _context4.prev = 62;
              _context4.t0 = _context4["catch"](5);

              if (bufferedWrite && fileEntry.writingBufferedData || !bufferedWrite && fileEntry.dataWritten) {
                _context4.t0.corruptedEntry = zipWriter.hasCorruptedEntries = true;

                if (fileEntry.uncompressedSize) {
                  zipWriter.offset += fileEntry.uncompressedSize;
                }
              }

              files.delete(name);
              throw _context4.t0;

            case 67:
              _context4.prev = 67;
              resolveLockCurrentFileEntry();

              if (resolveLockUnbufferedWrite) {
                resolveLockUnbufferedWrite();
              }

              return _context4.finish(67);

            case 71:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[5, 62, 67, 71]]);
    }));
    return _getFileEntry.apply(this, arguments);
  }

  function createFileEntry(_x9, _x10, _x11, _x12) {
    return _createFileEntry.apply(this, arguments);
  }

  function _createFileEntry() {
    _createFileEntry = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(reader, writer, config, options) {
      var rawFilename, lastAccessDate, creationDate, password, level, zip64, zipCrypto, dataDescriptor, dataDescriptorSignature, directory, version, versionMadeBy, rawComment, rawExtraField, useWebWorkers, onprogress, signal, encryptionStrength, extendedTimestamp, msDosCompatible, internalFileAttribute, externalFileAttribute, encrypted, compressed, rawExtraFieldAES, extraFieldAESView, rawExtraFieldNTFS, rawExtraFieldExtendedTimestamp, extraFieldExtendedTimestampView, extraFieldExtendedTimestampFlag, extraFieldNTFSView, lastModTimeNTFS, fileEntry, uncompressedSize, bitFlag, compressionMethod, headerArray, headerView, dateArray, dateView, lastModDate, rawLastModDate, extraFieldLength, localHeaderArray, localHeaderView, result, compressedSize, codec, dataDescriptorArray, dataDescriptorView, dataDescriptorOffset, signature, rawExtraFieldZip64View, length;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              rawFilename = options.rawFilename, lastAccessDate = options.lastAccessDate, creationDate = options.creationDate, password = options.password, level = options.level, zip64 = options.zip64, zipCrypto = options.zipCrypto, dataDescriptor = options.dataDescriptor, dataDescriptorSignature = options.dataDescriptorSignature, directory = options.directory, version = options.version, versionMadeBy = options.versionMadeBy, rawComment = options.rawComment, rawExtraField = options.rawExtraField, useWebWorkers = options.useWebWorkers, onprogress = options.onprogress, signal = options.signal, encryptionStrength = options.encryptionStrength, extendedTimestamp = options.extendedTimestamp, msDosCompatible = options.msDosCompatible, internalFileAttribute = options.internalFileAttribute, externalFileAttribute = options.externalFileAttribute;
              encrypted = Boolean(password && password.length);
              compressed = level !== 0 && !directory;

              if (encrypted && !zipCrypto) {
                rawExtraFieldAES = new Uint8Array(EXTRAFIELD_DATA_AES.length + 2);
                extraFieldAESView = getDataView(rawExtraFieldAES);
                setUint16(extraFieldAESView, 0, EXTRAFIELD_TYPE_AES);
                arraySet(rawExtraFieldAES, EXTRAFIELD_DATA_AES, 2);
                setUint8(extraFieldAESView, 8, encryptionStrength);
              } else {
                rawExtraFieldAES = new Uint8Array(0);
              }

              if (extendedTimestamp) {
                rawExtraFieldExtendedTimestamp = new Uint8Array(9 + (lastAccessDate ? 4 : 0) + (creationDate ? 4 : 0));
                extraFieldExtendedTimestampView = getDataView(rawExtraFieldExtendedTimestamp);
                setUint16(extraFieldExtendedTimestampView, 0, EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
                setUint16(extraFieldExtendedTimestampView, 2, rawExtraFieldExtendedTimestamp.length - 4);
                extraFieldExtendedTimestampFlag = 0x1 + (lastAccessDate ? 0x2 : 0) + (creationDate ? 0x4 : 0);
                setUint8(extraFieldExtendedTimestampView, 4, extraFieldExtendedTimestampFlag);
                setUint32(extraFieldExtendedTimestampView, 5, Math.floor(options.lastModDate.getTime() / 1000));

                if (lastAccessDate) {
                  setUint32(extraFieldExtendedTimestampView, 9, Math.floor(lastAccessDate.getTime() / 1000));
                }

                if (creationDate) {
                  setUint32(extraFieldExtendedTimestampView, 13, Math.floor(creationDate.getTime() / 1000));
                }

                try {
                  rawExtraFieldNTFS = new Uint8Array(36);
                  extraFieldNTFSView = getDataView(rawExtraFieldNTFS);
                  lastModTimeNTFS = getTimeNTFS(options.lastModDate);
                  setUint16(extraFieldNTFSView, 0, EXTRAFIELD_TYPE_NTFS);
                  setUint16(extraFieldNTFSView, 2, 32);
                  setUint16(extraFieldNTFSView, 8, EXTRAFIELD_TYPE_NTFS_TAG1);
                  setUint16(extraFieldNTFSView, 10, 24);
                  setBigUint64(extraFieldNTFSView, 12, lastModTimeNTFS);
                  setBigUint64(extraFieldNTFSView, 20, getTimeNTFS(lastAccessDate) || lastModTimeNTFS);
                  setBigUint64(extraFieldNTFSView, 28, getTimeNTFS(creationDate) || lastModTimeNTFS);
                } catch (error) {
                  rawExtraFieldNTFS = new Uint8Array(0);
                }
              } else {
                rawExtraFieldNTFS = rawExtraFieldExtendedTimestamp = new Uint8Array(0);
              }

              fileEntry = {
                version: version || VERSION_DEFLATE,
                versionMadeBy: versionMadeBy,
                zip64: zip64,
                directory: Boolean(directory),
                filenameUTF8: true,
                rawFilename: rawFilename,
                commentUTF8: true,
                rawComment: rawComment,
                rawExtraFieldZip64: zip64 ? new Uint8Array(EXTRAFIELD_LENGTH_ZIP64 + 4) : new Uint8Array(0),
                rawExtraFieldExtendedTimestamp: rawExtraFieldExtendedTimestamp,
                rawExtraFieldNTFS: rawExtraFieldNTFS,
                rawExtraFieldAES: rawExtraFieldAES,
                rawExtraField: rawExtraField,
                extendedTimestamp: extendedTimestamp,
                msDosCompatible: msDosCompatible,
                internalFileAttribute: internalFileAttribute,
                externalFileAttribute: externalFileAttribute
              };
              uncompressedSize = fileEntry.uncompressedSize = 0;
              bitFlag = BITFLAG_LANG_ENCODING_FLAG;

              if (dataDescriptor) {
                bitFlag = bitFlag | BITFLAG_DATA_DESCRIPTOR;
              }

              compressionMethod = COMPRESSION_METHOD_STORE;

              if (compressed) {
                compressionMethod = COMPRESSION_METHOD_DEFLATE;
              }

              if (zip64) {
                fileEntry.version = fileEntry.version > VERSION_ZIP64 ? fileEntry.version : VERSION_ZIP64;
              }

              if (encrypted) {
                bitFlag = bitFlag | BITFLAG_ENCRYPTED;

                if (!zipCrypto) {
                  fileEntry.version = fileEntry.version > VERSION_AES ? fileEntry.version : VERSION_AES;
                  compressionMethod = COMPRESSION_METHOD_AES;

                  if (compressed) {
                    fileEntry.rawExtraFieldAES[9] = COMPRESSION_METHOD_DEFLATE;
                  }
                }
              }

              fileEntry.compressionMethod = compressionMethod;
              headerArray = fileEntry.headerArray = new Uint8Array(26);
              headerView = getDataView(headerArray);
              setUint16(headerView, 0, fileEntry.version);
              setUint16(headerView, 2, bitFlag);
              setUint16(headerView, 4, compressionMethod);
              dateArray = new Uint32Array(1);
              dateView = getDataView(dateArray);

              if (options.lastModDate < MIN_DATE) {
                lastModDate = MIN_DATE;
              } else if (options.lastModDate > MAX_DATE) {
                lastModDate = MAX_DATE;
              } else {
                lastModDate = options.lastModDate;
              }

              setUint16(dateView, 0, (lastModDate.getHours() << 6 | lastModDate.getMinutes()) << 5 | lastModDate.getSeconds() / 2);
              setUint16(dateView, 2, (lastModDate.getFullYear() - 1980 << 4 | lastModDate.getMonth() + 1) << 5 | lastModDate.getDate());
              rawLastModDate = dateArray[0];
              setUint32(headerView, 6, rawLastModDate);
              setUint16(headerView, 22, rawFilename.length);
              extraFieldLength = rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length + rawExtraFieldNTFS.length + fileEntry.rawExtraField.length;
              setUint16(headerView, 24, extraFieldLength);
              localHeaderArray = new Uint8Array(30 + rawFilename.length + extraFieldLength);
              localHeaderView = getDataView(localHeaderArray);
              setUint32(localHeaderView, 0, LOCAL_FILE_HEADER_SIGNATURE);
              arraySet(localHeaderArray, headerArray, 4);
              arraySet(localHeaderArray, rawFilename, 30);
              arraySet(localHeaderArray, rawExtraFieldAES, 30 + rawFilename.length);
              arraySet(localHeaderArray, rawExtraFieldExtendedTimestamp, 30 + rawFilename.length + rawExtraFieldAES.length);
              arraySet(localHeaderArray, rawExtraFieldNTFS, 30 + rawFilename.length + rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length);
              arraySet(localHeaderArray, fileEntry.rawExtraField, 30 + rawFilename.length + rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length + rawExtraFieldNTFS.length);
              compressedSize = 0;

              if (!reader) {
                _context5.next = 53;
                break;
              }

              uncompressedSize = fileEntry.uncompressedSize = reader.size;
              _context5.next = 43;
              return createCodec(config.Deflate, {
                codecType: CODEC_DEFLATE,
                level: level,
                password: password,
                encryptionStrength: encryptionStrength,
                zipCrypto: encrypted && zipCrypto,
                passwordVerification: encrypted && zipCrypto && rawLastModDate >> 8 & 0xFF,
                signed: true,
                compressed: compressed,
                encrypted: encrypted,
                useWebWorkers: useWebWorkers
              }, config);

            case 43:
              codec = _context5.sent;
              _context5.next = 46;
              return writer.writeUint8Array(localHeaderArray);

            case 46:
              fileEntry.dataWritten = true;
              _context5.next = 49;
              return processData(codec, reader, writer, 0, uncompressedSize, config, {
                onprogress: onprogress,
                signal: signal
              });

            case 49:
              result = _context5.sent;
              compressedSize = result.length;
              _context5.next = 56;
              break;

            case 53:
              _context5.next = 55;
              return writer.writeUint8Array(localHeaderArray);

            case 55:
              fileEntry.dataWritten = true;

            case 56:
              dataDescriptorArray = new Uint8Array(0);
              dataDescriptorOffset = 0;

              if (dataDescriptor) {
                dataDescriptorArray = new Uint8Array(zip64 ? dataDescriptorSignature ? 24 : 20 : dataDescriptorSignature ? 16 : 12);
                dataDescriptorView = getDataView(dataDescriptorArray);

                if (dataDescriptorSignature) {
                  dataDescriptorOffset = 4;
                  setUint32(dataDescriptorView, 0, DATA_DESCRIPTOR_RECORD_SIGNATURE);
                }
              }

              if (reader) {
                signature = result.signature;

                if ((!encrypted || zipCrypto) && signature !== undefined) {
                  setUint32(headerView, 10, signature);
                  fileEntry.signature = signature;

                  if (dataDescriptor) {
                    setUint32(dataDescriptorView, dataDescriptorOffset, signature);
                  }
                }

                if (zip64) {
                  rawExtraFieldZip64View = getDataView(fileEntry.rawExtraFieldZip64);
                  setUint16(rawExtraFieldZip64View, 0, EXTRAFIELD_TYPE_ZIP64);
                  setUint16(rawExtraFieldZip64View, 2, EXTRAFIELD_LENGTH_ZIP64);
                  setUint32(headerView, 14, MAX_32_BITS);
                  setBigUint64(rawExtraFieldZip64View, 12, BigInt(compressedSize));
                  setUint32(headerView, 18, MAX_32_BITS);
                  setBigUint64(rawExtraFieldZip64View, 4, BigInt(uncompressedSize));

                  if (dataDescriptor) {
                    setBigUint64(dataDescriptorView, dataDescriptorOffset + 4, BigInt(compressedSize));
                    setBigUint64(dataDescriptorView, dataDescriptorOffset + 12, BigInt(uncompressedSize));
                  }
                } else {
                  setUint32(headerView, 14, compressedSize);
                  setUint32(headerView, 18, uncompressedSize);

                  if (dataDescriptor) {
                    setUint32(dataDescriptorView, dataDescriptorOffset + 4, compressedSize);
                    setUint32(dataDescriptorView, dataDescriptorOffset + 8, uncompressedSize);
                  }
                }
              }

              if (!dataDescriptor) {
                _context5.next = 63;
                break;
              }

              _context5.next = 63;
              return writer.writeUint8Array(dataDescriptorArray);

            case 63:
              length = localHeaderArray.length + compressedSize + dataDescriptorArray.length;
              Object.assign(fileEntry, {
                compressedSize: compressedSize,
                lastModDate: lastModDate,
                rawLastModDate: rawLastModDate,
                creationDate: creationDate,
                lastAccessDate: lastAccessDate,
                encrypted: encrypted,
                length: length
              });
              return _context5.abrupt("return", fileEntry);

            case 66:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _createFileEntry.apply(this, arguments);
  }

  function closeFile(_x13, _x14, _x15) {
    return _closeFile.apply(this, arguments);
  }

  function _closeFile() {
    _closeFile = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(zipWriter, comment, options) {
      var writer, files, offset, directoryDataLength, directoryOffset, filesLength, _iterator, _step, _step$value, fileEntry, zip64, directoryArray, directoryView, _iterator2, _step2, _step2$value, indexFileEntry, _fileEntry, rawFilename, rawExtraFieldZip64, rawExtraFieldAES, rawExtraField, rawComment, versionMadeBy, headerArray, directory, _zip, msDosCompatible, internalFileAttribute, externalFileAttribute, rawExtraFieldExtendedTimestamp, rawExtraFieldNTFS, extraFieldExtendedTimestampView, extraFieldLength;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              writer = zipWriter.writer;
              files = zipWriter.files;
              offset = 0;
              directoryDataLength = 0;
              directoryOffset = zipWriter.offset;
              filesLength = files.size;
              _iterator = _createForOfIteratorHelper(files);

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  _step$value = _slicedToArray(_step.value, 2), fileEntry = _step$value[1];
                  directoryDataLength += 46 + fileEntry.rawFilename.length + fileEntry.rawComment.length + fileEntry.rawExtraFieldZip64.length + fileEntry.rawExtraFieldAES.length + fileEntry.rawExtraFieldExtendedTimestamp.length + fileEntry.rawExtraFieldNTFS.length + fileEntry.rawExtraField.length;
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }

              zip64 = options.zip64 || zipWriter.options.zip64 || false;

              if (!(directoryOffset >= MAX_32_BITS || directoryDataLength >= MAX_32_BITS || filesLength >= MAX_16_BITS)) {
                _context6.next = 15;
                break;
              }

              if (!(options.zip64 === false || zipWriter.options.zip64 === false)) {
                _context6.next = 14;
                break;
              }

              throw new Error(ERR_UNSUPPORTED_FORMAT);

            case 14:
              zip64 = true;

            case 15:
              directoryArray = new Uint8Array(directoryDataLength + (zip64 ? ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH : END_OF_CENTRAL_DIR_LENGTH));
              directoryView = getDataView(directoryArray);

              if (!(comment && comment.length)) {
                _context6.next = 23;
                break;
              }

              if (!(comment.length <= MAX_16_BITS)) {
                _context6.next = 22;
                break;
              }

              setUint16(directoryView, offset + 20, comment.length);
              _context6.next = 23;
              break;

            case 22:
              throw new Error(ERR_INVALID_COMMENT);

            case 23:
              _iterator2 = _createForOfIteratorHelper(Array.from(files.values()).entries());

              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  _step2$value = _slicedToArray(_step2.value, 2), indexFileEntry = _step2$value[0], _fileEntry = _step2$value[1];
                  rawFilename = _fileEntry.rawFilename, rawExtraFieldZip64 = _fileEntry.rawExtraFieldZip64, rawExtraFieldAES = _fileEntry.rawExtraFieldAES, rawExtraField = _fileEntry.rawExtraField, rawComment = _fileEntry.rawComment, versionMadeBy = _fileEntry.versionMadeBy, headerArray = _fileEntry.headerArray, directory = _fileEntry.directory, _zip = _fileEntry.zip64, msDosCompatible = _fileEntry.msDosCompatible, internalFileAttribute = _fileEntry.internalFileAttribute, externalFileAttribute = _fileEntry.externalFileAttribute;
                  rawExtraFieldExtendedTimestamp = void 0;
                  rawExtraFieldNTFS = void 0;

                  if (_fileEntry.extendedTimestamp) {
                    rawExtraFieldNTFS = _fileEntry.rawExtraFieldNTFS;
                    rawExtraFieldExtendedTimestamp = new Uint8Array(9);
                    extraFieldExtendedTimestampView = getDataView(rawExtraFieldExtendedTimestamp);
                    setUint16(extraFieldExtendedTimestampView, 0, EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
                    setUint16(extraFieldExtendedTimestampView, 2, rawExtraFieldExtendedTimestamp.length - 4);
                    setUint8(extraFieldExtendedTimestampView, 4, 0x1);
                    setUint32(extraFieldExtendedTimestampView, 5, Math.floor(_fileEntry.lastModDate.getTime() / 1000));
                  } else {
                    rawExtraFieldNTFS = rawExtraFieldExtendedTimestamp = new Uint8Array(0);
                  }

                  extraFieldLength = rawExtraFieldZip64.length + rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length + rawExtraFieldNTFS.length + rawExtraField.length;
                  setUint32(directoryView, offset, CENTRAL_FILE_HEADER_SIGNATURE);
                  setUint16(directoryView, offset + 4, versionMadeBy);
                  arraySet(directoryArray, headerArray, offset + 6);
                  setUint16(directoryView, offset + 30, extraFieldLength);
                  setUint16(directoryView, offset + 32, rawComment.length);
                  setUint32(directoryView, offset + 34, internalFileAttribute);

                  if (externalFileAttribute) {
                    setUint32(directoryView, offset + 38, externalFileAttribute);
                  } else if (directory && msDosCompatible) {
                    setUint8(directoryView, offset + 38, FILE_ATTR_MSDOS_DIR_MASK);
                  }

                  if (_zip) {
                    setUint32(directoryView, offset + 42, MAX_32_BITS);
                  } else {
                    setUint32(directoryView, offset + 42, _fileEntry.offset);
                  }

                  arraySet(directoryArray, rawFilename, offset + 46);
                  arraySet(directoryArray, rawExtraFieldZip64, offset + 46 + rawFilename.length);
                  arraySet(directoryArray, rawExtraFieldAES, offset + 46 + rawFilename.length + rawExtraFieldZip64.length);
                  arraySet(directoryArray, rawExtraFieldExtendedTimestamp, offset + 46 + rawFilename.length + rawExtraFieldZip64.length + rawExtraFieldAES.length);
                  arraySet(directoryArray, rawExtraFieldNTFS, offset + 46 + rawFilename.length + rawExtraFieldZip64.length + rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length);
                  arraySet(directoryArray, rawExtraField, offset + 46 + rawFilename.length + rawExtraFieldZip64.length + rawExtraFieldAES.length + rawExtraFieldExtendedTimestamp.length + rawExtraFieldNTFS.length);
                  arraySet(directoryArray, rawComment, offset + 46 + rawFilename.length + extraFieldLength);
                  offset += 46 + rawFilename.length + extraFieldLength + rawComment.length;

                  if (options.onprogress) {
                    try {
                      options.onprogress(indexFileEntry + 1, files.size, new Entry(_fileEntry));
                    } catch (error) {// ignored
                    }
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }

              if (zip64) {
                setUint32(directoryView, offset, ZIP64_END_OF_CENTRAL_DIR_SIGNATURE);
                setBigUint64(directoryView, offset + 4, BigInt(44));
                setUint16(directoryView, offset + 12, 45);
                setUint16(directoryView, offset + 14, 45);
                setBigUint64(directoryView, offset + 24, BigInt(filesLength));
                setBigUint64(directoryView, offset + 32, BigInt(filesLength));
                setBigUint64(directoryView, offset + 40, BigInt(directoryDataLength));
                setBigUint64(directoryView, offset + 48, BigInt(directoryOffset));
                setUint32(directoryView, offset + 56, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE);
                setBigUint64(directoryView, offset + 64, BigInt(directoryOffset) + BigInt(directoryDataLength));
                setUint32(directoryView, offset + 72, ZIP64_TOTAL_NUMBER_OF_DISKS);
                filesLength = MAX_16_BITS;
                directoryOffset = MAX_32_BITS;
                directoryDataLength = MAX_32_BITS;
                offset += 76;
              }

              setUint32(directoryView, offset, END_OF_CENTRAL_DIR_SIGNATURE);
              setUint16(directoryView, offset + 8, filesLength);
              setUint16(directoryView, offset + 10, filesLength);
              setUint32(directoryView, offset + 12, directoryDataLength);
              setUint32(directoryView, offset + 16, directoryOffset);
              _context6.next = 33;
              return writer.writeUint8Array(directoryArray);

            case 33:
              if (!(comment && comment.length)) {
                _context6.next = 36;
                break;
              }

              _context6.next = 36;
              return writer.writeUint8Array(comment);

            case 36:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));
    return _closeFile.apply(this, arguments);
  }

  function sliceAsArrayBuffer(blob, start, end) {
    if (blob.arrayBuffer) {
      if (start || end) {
        return blob.slice(start, end).arrayBuffer();
      } else {
        return blob.arrayBuffer();
      }
    } else {
      var fileReader = new FileReader();
      return new Promise(function (resolve, reject) {
        fileReader.onload = function (event) {
          return resolve(event.target.result);
        };

        fileReader.onerror = function () {
          return reject(fileReader.error);
        };

        fileReader.readAsArrayBuffer(start || end ? blob.slice(start, end) : blob);
      });
    }
  }

  function writeBlob(_x16, _x17) {
    return _writeBlob.apply(this, arguments);
  }

  function _writeBlob() {
    _writeBlob = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(writer, blob) {
      var start,
          blockSize,
          writeSlice,
          _writeSlice,
          _args8 = arguments;

      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _writeSlice = function _writeSlice3() {
                _writeSlice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                  var arrayBuffer;
                  return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          if (!(start < blob.size)) {
                            _context7.next = 9;
                            break;
                          }

                          _context7.next = 3;
                          return sliceAsArrayBuffer(blob, start, start + blockSize);

                        case 3:
                          arrayBuffer = _context7.sent;
                          _context7.next = 6;
                          return writer.writeUint8Array(new Uint8Array(arrayBuffer));

                        case 6:
                          start += blockSize;
                          _context7.next = 9;
                          return writeSlice();

                        case 9:
                        case "end":
                          return _context7.stop();
                      }
                    }
                  }, _callee7);
                }));
                return _writeSlice.apply(this, arguments);
              };

              writeSlice = function _writeSlice2() {
                return _writeSlice.apply(this, arguments);
              };

              start = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : 0;
              blockSize = 512 * 1024 * 1024;
              _context8.next = 6;
              return writeSlice();

            case 6:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));
    return _writeBlob.apply(this, arguments);
  }

  function getTimeNTFS(date) {
    if (date) {
      return (BigInt(date.getTime()) + BigInt(11644473600000)) * BigInt(10000);
    }
  }

  function getOptionValue(zipWriter, options, name) {
    return options[name] === undefined ? zipWriter.options[name] : options[name];
  }

  function getMaximumCompressedSize(uncompressedSize) {
    return uncompressedSize + 5 * (Math.floor(uncompressedSize / 16383) + 1);
  }

  function setUint8(view, offset, value) {
    view.setUint8(offset, value);
  }

  function setUint16(view, offset, value) {
    view.setUint16(offset, value, true);
  }

  function setUint32(view, offset, value) {
    view.setUint32(offset, value, true);
  }

  function setBigUint64(view, offset, value) {
    view.setBigUint64(offset, value, true);
  }

  function arraySet(array, typedArray, offset) {
    array.set(typedArray, offset);
  }

  function getDataView(array) {
    return new DataView(array.buffer);
  }

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  var CHUNK_SIZE = 512 * 1024;

  var ZipEntry = /*#__PURE__*/function () {
    function ZipEntry(fs, name, params, parent) {
      _classCallCheck(this, ZipEntry);

      var zipEntry = this;

      if (fs.root && parent && parent.getChildByName(name)) {
        throw new Error("Entry filename already exists");
      }

      if (!params) {
        params = {};
      }

      Object.assign(zipEntry, {
        fs: fs,
        name: name,
        data: params.data,
        id: fs.entries.length,
        parent: parent,
        children: [],
        uncompressedSize: 0
      });
      fs.entries.push(zipEntry);

      if (parent) {
        zipEntry.parent.children.push(zipEntry);
      }
    }

    _createClass(ZipEntry, [{
      key: "moveTo",
      value: function moveTo(target) {
        // deprecated
        var zipEntry = this;
        zipEntry.fs.move(zipEntry, target);
      }
    }, {
      key: "getFullname",
      value: function getFullname() {
        return this.getRelativeName();
      }
    }, {
      key: "getRelativeName",
      value: function getRelativeName() {
        var ancestor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.fs.root;
        var zipEntry = this;
        var relativeName = zipEntry.name;
        var entry = zipEntry.parent;

        while (entry && entry != ancestor) {
          relativeName = (entry.name ? entry.name + "/" : "") + relativeName;
          entry = entry.parent;
        }

        return relativeName;
      }
    }, {
      key: "isDescendantOf",
      value: function isDescendantOf(ancestor) {
        var entry = this.parent;

        while (entry && entry.id != ancestor.id) {
          entry = entry.parent;
        }

        return Boolean(entry);
      }
    }]);

    return ZipEntry;
  }();

  var ZipFileEntry = /*#__PURE__*/function (_ZipEntry) {
    _inherits(ZipFileEntry, _ZipEntry);

    var _super = _createSuper(ZipFileEntry);

    function ZipFileEntry(fs, name, params, parent) {
      var _this;

      _classCallCheck(this, ZipFileEntry);

      _this = _super.call(this, fs, name, params, parent);

      var zipEntry = _assertThisInitialized(_this);

      zipEntry.Reader = params.Reader;
      zipEntry.Writer = params.Writer;

      if (params.getData) {
        zipEntry.getData = params.getData;
      }

      return _this;
    }

    _createClass(ZipFileEntry, [{
      key: "getData",
      value: function () {
        var _getData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(writer) {
          var options,
              zipEntry,
              _args = arguments;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
                  zipEntry = this;

                  if (!(!writer || writer.constructor == zipEntry.Writer && zipEntry.data)) {
                    _context.next = 6;
                    break;
                  }

                  return _context.abrupt("return", zipEntry.data);

                case 6:
                  zipEntry.reader = new zipEntry.Reader(zipEntry.data, options);
                  _context.next = 9;
                  return zipEntry.reader.init();

                case 9:
                  if (writer.initialized) {
                    _context.next = 12;
                    break;
                  }

                  _context.next = 12;
                  return writer.init();

                case 12:
                  zipEntry.uncompressedSize = zipEntry.reader.size;
                  return _context.abrupt("return", pipe(zipEntry.reader, writer));

                case 14:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function getData(_x) {
          return _getData.apply(this, arguments);
        }

        return getData;
      }()
    }, {
      key: "getText",
      value: function getText(encoding, options) {
        return this.getData(new TextWriter(encoding), options);
      }
    }, {
      key: "getBlob",
      value: function getBlob(mimeType, options) {
        return this.getData(new BlobWriter(mimeType), options);
      }
    }, {
      key: "getData64URI",
      value: function getData64URI(mimeType, options) {
        return this.getData(new Data64URIWriter(mimeType), options);
      }
    }, {
      key: "getUint8Array",
      value: function getUint8Array(options) {
        return this.getData(new Uint8ArrayWriter(), options);
      }
    }, {
      key: "replaceBlob",
      value: function replaceBlob(blob) {
        Object.assign(this, {
          data: blob,
          Reader: BlobReader,
          Writer: BlobWriter,
          reader: null
        });
      }
    }, {
      key: "replaceText",
      value: function replaceText(text) {
        Object.assign(this, {
          data: text,
          Reader: TextReader,
          Writer: TextWriter,
          reader: null
        });
      }
    }, {
      key: "replaceData64URI",
      value: function replaceData64URI(dataURI) {
        Object.assign(this, {
          data: dataURI,
          Reader: Data64URIReader,
          Writer: Data64URIWriter,
          reader: null
        });
      }
    }, {
      key: "replaceUint8Array",
      value: function replaceUint8Array(array) {
        Object.assign(this, {
          data: array,
          Reader: Uint8ArrayReader,
          Writer: Uint8ArrayWriter,
          reader: null
        });
      }
    }]);

    return ZipFileEntry;
  }(ZipEntry);

  var ZipDirectoryEntry = /*#__PURE__*/function (_ZipEntry2) {
    _inherits(ZipDirectoryEntry, _ZipEntry2);

    var _super2 = _createSuper(ZipDirectoryEntry);

    function ZipDirectoryEntry(fs, name, params, parent) {
      var _this2;

      _classCallCheck(this, ZipDirectoryEntry);

      _this2 = _super2.call(this, fs, name, params, parent);
      _this2.directory = true;
      return _this2;
    }

    _createClass(ZipDirectoryEntry, [{
      key: "addDirectory",
      value: function addDirectory(name) {
        return addChild(this, name, null, true);
      }
    }, {
      key: "addText",
      value: function addText(name, text) {
        return addChild(this, name, {
          data: text,
          Reader: TextReader,
          Writer: TextWriter
        });
      }
    }, {
      key: "addBlob",
      value: function addBlob(name, blob) {
        return addChild(this, name, {
          data: blob,
          Reader: BlobReader,
          Writer: BlobWriter
        });
      }
    }, {
      key: "addData64URI",
      value: function addData64URI(name, dataURI) {
        return addChild(this, name, {
          data: dataURI,
          Reader: Data64URIReader,
          Writer: Data64URIWriter
        });
      }
    }, {
      key: "addUint8Array",
      value: function addUint8Array(name, array) {
        return addChild(this, name, {
          data: array,
          Reader: Uint8ArrayReader,
          Writer: Uint8ArrayWriter
        });
      }
    }, {
      key: "addHttpContent",
      value: function addHttpContent(name, url) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return addChild(this, name, {
          data: url,
          Reader: /*#__PURE__*/function (_HttpReader) {
            _inherits(Reader, _HttpReader);

            var _super3 = _createSuper(Reader);

            function Reader(url) {
              _classCallCheck(this, Reader);

              return _super3.call(this, url, options);
            }

            return _createClass(Reader);
          }(HttpReader)
        });
      }
    }, {
      key: "addFileSystemEntry",
      value: function () {
        var _addFileSystemEntry2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(fileSystemEntry) {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  return _context2.abrupt("return", _addFileSystemEntry(this, fileSystemEntry));

                case 1:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function addFileSystemEntry(_x2) {
          return _addFileSystemEntry2.apply(this, arguments);
        }

        return addFileSystemEntry;
      }()
    }, {
      key: "addData",
      value: function () {
        var _addData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(name, params) {
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  return _context3.abrupt("return", addChild(this, name, params));

                case 1:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function addData(_x3, _x4) {
          return _addData.apply(this, arguments);
        }

        return addData;
      }()
    }, {
      key: "importBlob",
      value: function () {
        var _importBlob = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(blob) {
          var options,
              _args4 = arguments;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  options = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};
                  _context4.next = 3;
                  return this.importZip(new BlobReader(blob), options);

                case 3:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function importBlob(_x5) {
          return _importBlob.apply(this, arguments);
        }

        return importBlob;
      }()
    }, {
      key: "importData64URI",
      value: function () {
        var _importData64URI = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(dataURI) {
          var options,
              _args5 = arguments;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  options = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : {};
                  _context5.next = 3;
                  return this.importZip(new Data64URIReader(dataURI), options);

                case 3:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function importData64URI(_x6) {
          return _importData64URI.apply(this, arguments);
        }

        return importData64URI;
      }()
    }, {
      key: "importUint8Array",
      value: function () {
        var _importUint8Array = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(array) {
          var options,
              _args6 = arguments;
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  options = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : {};
                  _context6.next = 3;
                  return this.importZip(new Uint8ArrayReader(array), options);

                case 3:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, this);
        }));

        function importUint8Array(_x7) {
          return _importUint8Array.apply(this, arguments);
        }

        return importUint8Array;
      }()
    }, {
      key: "importHttpContent",
      value: function () {
        var _importHttpContent = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(url) {
          var options,
              _args7 = arguments;
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  options = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : {};
                  _context7.next = 3;
                  return this.importZip(new HttpReader(url, options), options);

                case 3:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        }));

        function importHttpContent(_x8) {
          return _importHttpContent.apply(this, arguments);
        }

        return importHttpContent;
      }()
    }, {
      key: "exportBlob",
      value: function () {
        var _exportBlob = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
          var options,
              _args8 = arguments;
          return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  options = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : {};
                  return _context8.abrupt("return", this.exportZip(new BlobWriter("application/zip"), options));

                case 2:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8, this);
        }));

        function exportBlob() {
          return _exportBlob.apply(this, arguments);
        }

        return exportBlob;
      }()
    }, {
      key: "exportData64URI",
      value: function () {
        var _exportData64URI = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
          var options,
              _args9 = arguments;
          return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  options = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : {};
                  return _context9.abrupt("return", this.exportZip(new Data64URIWriter("application/zip"), options));

                case 2:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee9, this);
        }));

        function exportData64URI() {
          return _exportData64URI.apply(this, arguments);
        }

        return exportData64URI;
      }()
    }, {
      key: "exportUint8Array",
      value: function () {
        var _exportUint8Array = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
          var options,
              _args10 = arguments;
          return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  options = _args10.length > 0 && _args10[0] !== undefined ? _args10[0] : {};
                  return _context10.abrupt("return", this.exportZip(new Uint8ArrayWriter(), options));

                case 2:
                case "end":
                  return _context10.stop();
              }
            }
          }, _callee10, this);
        }));

        function exportUint8Array() {
          return _exportUint8Array.apply(this, arguments);
        }

        return exportUint8Array;
      }()
    }, {
      key: "importZip",
      value: function () {
        var _importZip = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(reader, options) {
          var _this3 = this;

          var zipReader, entries;
          return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  if (reader.initialized) {
                    _context11.next = 3;
                    break;
                  }

                  _context11.next = 3;
                  return reader.init();

                case 3:
                  zipReader = new ZipReader(reader, options);
                  _context11.next = 6;
                  return zipReader.getEntries();

                case 6:
                  entries = _context11.sent;
                  entries.forEach(function (entry) {
                    var parent = _this3;
                    var path = entry.filename.split("/");
                    var name = path.pop();
                    path.forEach(function (pathPart) {
                      return parent = parent.getChildByName(pathPart) || new ZipDirectoryEntry(_this3.fs, pathPart, null, parent);
                    });

                    if (!entry.directory) {
                      addChild(parent, name, {
                        data: entry,
                        Reader: getZipBlobReader(Object.assign({}, options))
                      });
                    }
                  });

                case 8:
                case "end":
                  return _context11.stop();
              }
            }
          }, _callee11);
        }));

        function importZip(_x9, _x10) {
          return _importZip.apply(this, arguments);
        }

        return importZip;
      }()
    }, {
      key: "exportZip",
      value: function () {
        var _exportZip2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(writer, options) {
          var zipEntry, zipWriter;
          return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  zipEntry = this;
                  _context12.next = 3;
                  return initReaders(zipEntry);

                case 3:
                  _context12.next = 5;
                  return writer.init();

                case 5:
                  zipWriter = new ZipWriter(writer, options);
                  _context12.next = 8;
                  return _exportZip(zipWriter, zipEntry, getTotalSize([zipEntry], "uncompressedSize"), options);

                case 8:
                  _context12.next = 10;
                  return zipWriter.close();

                case 10:
                  return _context12.abrupt("return", writer.getData());

                case 11:
                case "end":
                  return _context12.stop();
              }
            }
          }, _callee12, this);
        }));

        function exportZip(_x11, _x12) {
          return _exportZip2.apply(this, arguments);
        }

        return exportZip;
      }()
    }, {
      key: "getChildByName",
      value: function getChildByName(name) {
        var children = this.children;

        for (var childIndex = 0; childIndex < children.length; childIndex++) {
          var child = children[childIndex];

          if (child.name == name) {
            return child;
          }
        }
      }
    }]);

    return ZipDirectoryEntry;
  }(ZipEntry);

  var FS = /*#__PURE__*/function () {
    function FS() {
      _classCallCheck(this, FS);

      resetFS(this);
    }

    _createClass(FS, [{
      key: "children",
      get: function get() {
        return this.root.children;
      }
    }, {
      key: "remove",
      value: function remove(entry) {
        detach(entry);
        this.entries[entry.id] = null;
      }
    }, {
      key: "move",
      value: function move(entry, destination) {
        if (entry == this.root) {
          throw new Error("Root directory cannot be moved");
        } else {
          if (destination.directory) {
            if (!destination.isDescendantOf(entry)) {
              if (entry != destination) {
                if (destination.getChildByName(entry.name)) {
                  throw new Error("Entry filename already exists");
                }

                detach(entry);
                entry.parent = destination;
                destination.children.push(entry);
              }
            } else {
              throw new Error("Entry is a ancestor of target entry");
            }
          } else {
            throw new Error("Target entry is not a directory");
          }
        }
      }
    }, {
      key: "find",
      value: function find(fullname) {
        var path = fullname.split("/");
        var node = this.root;

        for (var index = 0; node && index < path.length; index++) {
          node = node.getChildByName(path[index]);
        }

        return node;
      }
    }, {
      key: "getById",
      value: function getById(id) {
        return this.entries[id];
      }
    }, {
      key: "getChildByName",
      value: function getChildByName(name) {
        return this.root.getChildByName(name);
      }
    }, {
      key: "addDirectory",
      value: function addDirectory(name) {
        return this.root.addDirectory(name);
      }
    }, {
      key: "addText",
      value: function addText(name, text) {
        return this.root.addText(name, text);
      }
    }, {
      key: "addBlob",
      value: function addBlob(name, blob) {
        return this.root.addBlob(name, blob);
      }
    }, {
      key: "addData64URI",
      value: function addData64URI(name, dataURI) {
        return this.root.addData64URI(name, dataURI);
      }
    }, {
      key: "addHttpContent",
      value: function addHttpContent(name, url, options) {
        return this.root.addHttpContent(name, url, options);
      }
    }, {
      key: "addFileSystemEntry",
      value: function () {
        var _addFileSystemEntry3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(fileSystemEntry) {
          return regeneratorRuntime.wrap(function _callee13$(_context13) {
            while (1) {
              switch (_context13.prev = _context13.next) {
                case 0:
                  return _context13.abrupt("return", this.root.addFileSystemEntry(fileSystemEntry));

                case 1:
                case "end":
                  return _context13.stop();
              }
            }
          }, _callee13, this);
        }));

        function addFileSystemEntry(_x13) {
          return _addFileSystemEntry3.apply(this, arguments);
        }

        return addFileSystemEntry;
      }()
    }, {
      key: "addData",
      value: function () {
        var _addData2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(name, params) {
          return regeneratorRuntime.wrap(function _callee14$(_context14) {
            while (1) {
              switch (_context14.prev = _context14.next) {
                case 0:
                  return _context14.abrupt("return", this.root.addData(name, params));

                case 1:
                case "end":
                  return _context14.stop();
              }
            }
          }, _callee14, this);
        }));

        function addData(_x14, _x15) {
          return _addData2.apply(this, arguments);
        }

        return addData;
      }()
    }, {
      key: "importBlob",
      value: function () {
        var _importBlob2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(blob, options) {
          return regeneratorRuntime.wrap(function _callee15$(_context15) {
            while (1) {
              switch (_context15.prev = _context15.next) {
                case 0:
                  resetFS(this);
                  _context15.next = 3;
                  return this.root.importBlob(blob, options);

                case 3:
                case "end":
                  return _context15.stop();
              }
            }
          }, _callee15, this);
        }));

        function importBlob(_x16, _x17) {
          return _importBlob2.apply(this, arguments);
        }

        return importBlob;
      }()
    }, {
      key: "importData64URI",
      value: function () {
        var _importData64URI2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(dataURI, options) {
          return regeneratorRuntime.wrap(function _callee16$(_context16) {
            while (1) {
              switch (_context16.prev = _context16.next) {
                case 0:
                  resetFS(this);
                  _context16.next = 3;
                  return this.root.importData64URI(dataURI, options);

                case 3:
                case "end":
                  return _context16.stop();
              }
            }
          }, _callee16, this);
        }));

        function importData64URI(_x18, _x19) {
          return _importData64URI2.apply(this, arguments);
        }

        return importData64URI;
      }()
    }, {
      key: "importHttpContent",
      value: function () {
        var _importHttpContent2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(url, options) {
          return regeneratorRuntime.wrap(function _callee17$(_context17) {
            while (1) {
              switch (_context17.prev = _context17.next) {
                case 0:
                  resetFS(this);
                  _context17.next = 3;
                  return this.root.importHttpContent(url, options);

                case 3:
                case "end":
                  return _context17.stop();
              }
            }
          }, _callee17, this);
        }));

        function importHttpContent(_x20, _x21) {
          return _importHttpContent2.apply(this, arguments);
        }

        return importHttpContent;
      }()
    }, {
      key: "exportBlob",
      value: function () {
        var _exportBlob2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(options) {
          return regeneratorRuntime.wrap(function _callee18$(_context18) {
            while (1) {
              switch (_context18.prev = _context18.next) {
                case 0:
                  return _context18.abrupt("return", this.root.exportBlob(options));

                case 1:
                case "end":
                  return _context18.stop();
              }
            }
          }, _callee18, this);
        }));

        function exportBlob(_x22) {
          return _exportBlob2.apply(this, arguments);
        }

        return exportBlob;
      }()
    }, {
      key: "exportData64URI",
      value: function () {
        var _exportData64URI2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(options) {
          return regeneratorRuntime.wrap(function _callee19$(_context19) {
            while (1) {
              switch (_context19.prev = _context19.next) {
                case 0:
                  return _context19.abrupt("return", this.root.exportData64URI(options));

                case 1:
                case "end":
                  return _context19.stop();
              }
            }
          }, _callee19, this);
        }));

        function exportData64URI(_x23) {
          return _exportData64URI2.apply(this, arguments);
        }

        return exportData64URI;
      }()
    }]);

    return FS;
  }();

  var fs = {
    FS: FS,
    ZipDirectoryEntry: ZipDirectoryEntry,
    ZipFileEntry: ZipFileEntry
  };

  function getTotalSize(entries, propertyName) {
    var size = 0;
    entries.forEach(process);
    return size;

    function process(entry) {
      size += entry[propertyName];

      if (entry.children) {
        entry.children.forEach(process);
      }
    }
  }

  function getZipBlobReader(options) {
    return /*#__PURE__*/function (_Reader) {
      _inherits(_class, _Reader);

      var _super4 = _createSuper(_class);

      function _class(entry) {
        var _this4;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, _class);

        _this4 = _super4.call(this);
        _this4.entry = entry;
        _this4.options = options;
        return _this4;
      }

      _createClass(_class, [{
        key: "init",
        value: function () {
          var _init = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20() {
            var zipBlobReader, data;
            return regeneratorRuntime.wrap(function _callee20$(_context20) {
              while (1) {
                switch (_context20.prev = _context20.next) {
                  case 0:
                    zipBlobReader = this;
                    zipBlobReader.size = zipBlobReader.entry.uncompressedSize;
                    _context20.next = 4;
                    return zipBlobReader.entry.getData(new BlobWriter(), Object.assign({}, zipBlobReader.options, options));

                  case 4:
                    data = _context20.sent;
                    zipBlobReader.data = data;
                    zipBlobReader.blobReader = new BlobReader(data);

                  case 7:
                  case "end":
                    return _context20.stop();
                }
              }
            }, _callee20, this);
          }));

          function init() {
            return _init.apply(this, arguments);
          }

          return init;
        }()
      }, {
        key: "readUint8Array",
        value: function () {
          var _readUint8Array = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(index, length) {
            return regeneratorRuntime.wrap(function _callee21$(_context21) {
              while (1) {
                switch (_context21.prev = _context21.next) {
                  case 0:
                    return _context21.abrupt("return", this.blobReader.readUint8Array(index, length));

                  case 1:
                  case "end":
                    return _context21.stop();
                }
              }
            }, _callee21, this);
          }));

          function readUint8Array(_x24, _x25) {
            return _readUint8Array.apply(this, arguments);
          }

          return readUint8Array;
        }()
      }]);

      return _class;
    }(Reader);
  }

  function initReaders(_x26) {
    return _initReaders.apply(this, arguments);
  }

  function _initReaders() {
    _initReaders = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(entry) {
      var _iterator, _step, child;

      return regeneratorRuntime.wrap(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              if (!entry.children.length) {
                _context22.next = 25;
                break;
              }

              _iterator = _createForOfIteratorHelper(entry.children);
              _context22.prev = 2;

              _iterator.s();

            case 4:
              if ((_step = _iterator.n()).done) {
                _context22.next = 17;
                break;
              }

              child = _step.value;

              if (!child.directory) {
                _context22.next = 11;
                break;
              }

              _context22.next = 9;
              return initReaders(child);

            case 9:
              _context22.next = 15;
              break;

            case 11:
              child.reader = new child.Reader(child.data);
              _context22.next = 14;
              return child.reader.init();

            case 14:
              child.uncompressedSize = child.reader.size;

            case 15:
              _context22.next = 4;
              break;

            case 17:
              _context22.next = 22;
              break;

            case 19:
              _context22.prev = 19;
              _context22.t0 = _context22["catch"](2);

              _iterator.e(_context22.t0);

            case 22:
              _context22.prev = 22;

              _iterator.f();

              return _context22.finish(22);

            case 25:
            case "end":
              return _context22.stop();
          }
        }
      }, _callee22, null, [[2, 19, 22, 25]]);
    }));
    return _initReaders.apply(this, arguments);
  }

  function detach(entry) {
    var children = entry.parent.children;
    children.forEach(function (child, index) {
      if (child.id == entry.id) {
        children.splice(index, 1);
      }
    });
  }

  function _exportZip(_x27, _x28, _x29, _x30) {
    return _exportZip3.apply(this, arguments);
  }

  function _exportZip3() {
    _exportZip3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26(zipWriter, entry, totalSize, options) {
      var selectedEntry, entryOffsets, process, _process;

      return regeneratorRuntime.wrap(function _callee26$(_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              _process = function _process3() {
                _process = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(zipWriter, entry) {
                  var exportChild, _exportChild, processChild, _processChild;

                  return regeneratorRuntime.wrap(function _callee25$(_context25) {
                    while (1) {
                      switch (_context25.prev = _context25.next) {
                        case 0:
                          _processChild = function _processChild3() {
                            _processChild = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24(child) {
                              var name;
                              return regeneratorRuntime.wrap(function _callee24$(_context24) {
                                while (1) {
                                  switch (_context24.prev = _context24.next) {
                                    case 0:
                                      name = options.relativePath ? child.getRelativeName(selectedEntry) : child.getFullname();
                                      _context24.next = 3;
                                      return zipWriter.add(name, child.reader, Object.assign({
                                        directory: child.directory
                                      }, Object.assign({}, options, {
                                        onprogress: function onprogress(indexProgress) {
                                          if (options.onprogress) {
                                            entryOffsets.set(name, indexProgress);

                                            try {
                                              options.onprogress(Array.from(entryOffsets.values()).reduce(function (previousValue, currentValue) {
                                                return previousValue + currentValue;
                                              }), totalSize);
                                            } catch (error) {// ignored
                                            }
                                          }
                                        }
                                      })));

                                    case 3:
                                      _context24.next = 5;
                                      return process(zipWriter, child);

                                    case 5:
                                    case "end":
                                      return _context24.stop();
                                  }
                                }
                              }, _callee24);
                            }));
                            return _processChild.apply(this, arguments);
                          };

                          processChild = function _processChild2(_x37) {
                            return _processChild.apply(this, arguments);
                          };

                          _exportChild = function _exportChild3() {
                            _exportChild = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23() {
                              var _iterator2, _step2, child;

                              return regeneratorRuntime.wrap(function _callee23$(_context23) {
                                while (1) {
                                  switch (_context23.prev = _context23.next) {
                                    case 0:
                                      if (!options.bufferedWrite) {
                                        _context23.next = 5;
                                        break;
                                      }

                                      _context23.next = 3;
                                      return Promise.all(entry.children.map(processChild));

                                    case 3:
                                      _context23.next = 22;
                                      break;

                                    case 5:
                                      _iterator2 = _createForOfIteratorHelper(entry.children);
                                      _context23.prev = 6;

                                      _iterator2.s();

                                    case 8:
                                      if ((_step2 = _iterator2.n()).done) {
                                        _context23.next = 14;
                                        break;
                                      }

                                      child = _step2.value;
                                      _context23.next = 12;
                                      return processChild(child);

                                    case 12:
                                      _context23.next = 8;
                                      break;

                                    case 14:
                                      _context23.next = 19;
                                      break;

                                    case 16:
                                      _context23.prev = 16;
                                      _context23.t0 = _context23["catch"](6);

                                      _iterator2.e(_context23.t0);

                                    case 19:
                                      _context23.prev = 19;

                                      _iterator2.f();

                                      return _context23.finish(19);

                                    case 22:
                                    case "end":
                                      return _context23.stop();
                                  }
                                }
                              }, _callee23, null, [[6, 16, 19, 22]]);
                            }));
                            return _exportChild.apply(this, arguments);
                          };

                          exportChild = function _exportChild2() {
                            return _exportChild.apply(this, arguments);
                          };

                          _context25.next = 6;
                          return exportChild();

                        case 6:
                        case "end":
                          return _context25.stop();
                      }
                    }
                  }, _callee25);
                }));
                return _process.apply(this, arguments);
              };

              process = function _process2(_x35, _x36) {
                return _process.apply(this, arguments);
              };

              selectedEntry = entry;
              entryOffsets = new Map();
              _context26.next = 6;
              return process(zipWriter, entry);

            case 6:
            case "end":
              return _context26.stop();
          }
        }
      }, _callee26);
    }));
    return _exportZip3.apply(this, arguments);
  }

  function _addFileSystemEntry(_x31, _x32) {
    return _addFileSystemEntry4.apply(this, arguments);
  }

  function _addFileSystemEntry4() {
    _addFileSystemEntry4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(zipEntry, fileSystemEntry) {
      var entry, addDirectory, _addDirectory, getChildren;

      return regeneratorRuntime.wrap(function _callee28$(_context29) {
        while (1) {
          switch (_context29.prev = _context29.next) {
            case 0:
              getChildren = function _getChildren(fileEntry) {
                return new Promise(function (resolve, reject) {
                  var entries = [];

                  if (fileEntry.isDirectory) {
                    readEntries(fileEntry.createReader());
                  }

                  if (fileEntry.isFile) {
                    resolve(entries);
                  }

                  function readEntries(directoryReader) {
                    directoryReader.readEntries(function (temporaryEntries) {
                      if (!temporaryEntries.length) {
                        resolve(entries);
                      } else {
                        entries = entries.concat(temporaryEntries);
                        readEntries(directoryReader);
                      }
                    }, reject);
                  }
                });
              };

              _addDirectory = function _addDirectory3() {
                _addDirectory = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27(zipEntry, fileEntry) {
                  var children, _iterator3, _step3, _loop;

                  return regeneratorRuntime.wrap(function _callee27$(_context28) {
                    while (1) {
                      switch (_context28.prev = _context28.next) {
                        case 0:
                          _context28.next = 2;
                          return getChildren(fileEntry);

                        case 2:
                          children = _context28.sent;
                          _iterator3 = _createForOfIteratorHelper(children);
                          _context28.prev = 4;
                          _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop() {
                            var child;
                            return regeneratorRuntime.wrap(function _loop$(_context27) {
                              while (1) {
                                switch (_context27.prev = _context27.next) {
                                  case 0:
                                    child = _step3.value;

                                    if (!child.isDirectory) {
                                      _context27.next = 6;
                                      break;
                                    }

                                    _context27.next = 4;
                                    return addDirectory(zipEntry.addDirectory(child.name), child);

                                  case 4:
                                    _context27.next = 8;
                                    break;

                                  case 6:
                                    _context27.next = 8;
                                    return new Promise(function (resolve, reject) {
                                      child.file(function (file) {
                                        var childZipEntry = zipEntry.addBlob(child.name, file);
                                        childZipEntry.uncompressedSize = file.size;
                                        resolve(childZipEntry);
                                      }, reject);
                                    });

                                  case 8:
                                  case "end":
                                    return _context27.stop();
                                }
                              }
                            }, _loop);
                          });

                          _iterator3.s();

                        case 7:
                          if ((_step3 = _iterator3.n()).done) {
                            _context28.next = 11;
                            break;
                          }

                          return _context28.delegateYield(_loop(), "t0", 9);

                        case 9:
                          _context28.next = 7;
                          break;

                        case 11:
                          _context28.next = 16;
                          break;

                        case 13:
                          _context28.prev = 13;
                          _context28.t1 = _context28["catch"](4);

                          _iterator3.e(_context28.t1);

                        case 16:
                          _context28.prev = 16;

                          _iterator3.f();

                          return _context28.finish(16);

                        case 19:
                        case "end":
                          return _context28.stop();
                      }
                    }
                  }, _callee27, null, [[4, 13, 16, 19]]);
                }));
                return _addDirectory.apply(this, arguments);
              };

              addDirectory = function _addDirectory2(_x38, _x39) {
                return _addDirectory.apply(this, arguments);
              };

              if (!fileSystemEntry.isDirectory) {
                _context29.next = 10;
                break;
              }

              entry = zipEntry.addDirectory(fileSystemEntry.name);
              _context29.next = 7;
              return addDirectory(entry, fileSystemEntry);

            case 7:
              return _context29.abrupt("return", entry);

            case 10:
              return _context29.abrupt("return", new Promise(function (resolve, reject) {
                return fileSystemEntry.file(function (file) {
                  return resolve(zipEntry.addBlob(fileSystemEntry.name, file));
                }, reject);
              }));

            case 11:
            case "end":
              return _context29.stop();
          }
        }
      }, _callee28);
    }));
    return _addFileSystemEntry4.apply(this, arguments);
  }

  function resetFS(fs) {
    fs.entries = [];
    fs.root = new ZipDirectoryEntry(fs);
  }

  function pipe(_x33, _x34) {
    return _pipe.apply(this, arguments);
  }

  function _pipe() {
    _pipe = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30(reader, writer) {
      var copyChunk, _copyChunk;

      return regeneratorRuntime.wrap(function _callee30$(_context31) {
        while (1) {
          switch (_context31.prev = _context31.next) {
            case 0:
              _copyChunk = function _copyChunk3() {
                _copyChunk = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29() {
                  var chunkIndex,
                      index,
                      array,
                      _args30 = arguments;
                  return regeneratorRuntime.wrap(function _callee29$(_context30) {
                    while (1) {
                      switch (_context30.prev = _context30.next) {
                        case 0:
                          chunkIndex = _args30.length > 0 && _args30[0] !== undefined ? _args30[0] : 0;
                          index = chunkIndex * CHUNK_SIZE;

                          if (!(index < reader.size)) {
                            _context30.next = 11;
                            break;
                          }

                          _context30.next = 5;
                          return reader.readUint8Array(index, Math.min(CHUNK_SIZE, reader.size - index));

                        case 5:
                          array = _context30.sent;
                          _context30.next = 8;
                          return writer.writeUint8Array(array);

                        case 8:
                          return _context30.abrupt("return", copyChunk(chunkIndex + 1));

                        case 11:
                          return _context30.abrupt("return", writer.getData());

                        case 12:
                        case "end":
                          return _context30.stop();
                      }
                    }
                  }, _callee29);
                }));
                return _copyChunk.apply(this, arguments);
              };

              copyChunk = function _copyChunk2() {
                return _copyChunk.apply(this, arguments);
              };

              return _context31.abrupt("return", copyChunk());

            case 3:
            case "end":
              return _context31.stop();
          }
        }
      }, _callee30);
    }));
    return _pipe.apply(this, arguments);
  }

  function addChild(parent, name, params, directory) {
    if (parent.directory) {
      return directory ? new ZipDirectoryEntry(parent.fs, name, params, parent) : new ZipFileEntry(parent.fs, name, params, parent);
    } else {
      throw new Error("Parent entry is not a directory");
    }
  }

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  var baseURL;

  try {
    baseURL = (typeof document === 'undefined' && typeof location === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : typeof document === 'undefined' ? location.href : (document.currentScript && document.currentScript.src || new URL('zip-fs-full-es5.js', document.baseURI).href));
  } catch (error) {// ignored
  }

  configure({
    baseURL: baseURL
  });
  d(configure);

  /*
   Copyright (c) 2022 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  configure({
    Deflate: ZipDeflate,
    Inflate: ZipInflate
  });

  exports.BlobReader = BlobReader;
  exports.BlobWriter = BlobWriter;
  exports.Data64URIReader = Data64URIReader;
  exports.Data64URIWriter = Data64URIWriter;
  exports.ERR_ABORT = ERR_ABORT;
  exports.ERR_BAD_FORMAT = ERR_BAD_FORMAT;
  exports.ERR_CENTRAL_DIRECTORY_NOT_FOUND = ERR_CENTRAL_DIRECTORY_NOT_FOUND;
  exports.ERR_DUPLICATED_NAME = ERR_DUPLICATED_NAME;
  exports.ERR_ENCRYPTED = ERR_ENCRYPTED;
  exports.ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND;
  exports.ERR_EOCDR_NOT_FOUND = ERR_EOCDR_NOT_FOUND;
  exports.ERR_EOCDR_ZIP64_NOT_FOUND = ERR_EOCDR_ZIP64_NOT_FOUND;
  exports.ERR_EXTRAFIELD_ZIP64_NOT_FOUND = ERR_EXTRAFIELD_ZIP64_NOT_FOUND;
  exports.ERR_HTTP_RANGE = ERR_HTTP_RANGE;
  exports.ERR_INVALID_COMMENT = ERR_INVALID_COMMENT;
  exports.ERR_INVALID_ENCRYPTION_STRENGTH = ERR_INVALID_ENCRYPTION_STRENGTH;
  exports.ERR_INVALID_ENTRY_COMMENT = ERR_INVALID_ENTRY_COMMENT;
  exports.ERR_INVALID_ENTRY_NAME = ERR_INVALID_ENTRY_NAME;
  exports.ERR_INVALID_EXTRAFIELD_DATA = ERR_INVALID_EXTRAFIELD_DATA;
  exports.ERR_INVALID_EXTRAFIELD_TYPE = ERR_INVALID_EXTRAFIELD_TYPE;
  exports.ERR_INVALID_PASSWORD = ERR_INVALID_PASSWORD;
  exports.ERR_INVALID_SIGNATURE = ERR_INVALID_SIGNATURE;
  exports.ERR_INVALID_VERSION = ERR_INVALID_VERSION;
  exports.ERR_LOCAL_FILE_HEADER_NOT_FOUND = ERR_LOCAL_FILE_HEADER_NOT_FOUND;
  exports.ERR_UNSUPPORTED_COMPRESSION = ERR_UNSUPPORTED_COMPRESSION;
  exports.ERR_UNSUPPORTED_ENCRYPTION = ERR_UNSUPPORTED_ENCRYPTION;
  exports.ERR_UNSUPPORTED_FORMAT = ERR_UNSUPPORTED_FORMAT;
  exports.HttpRangeReader = HttpRangeReader;
  exports.HttpReader = HttpReader;
  exports.Reader = Reader;
  exports.TextReader = TextReader;
  exports.TextWriter = TextWriter;
  exports.Uint8ArrayReader = Uint8ArrayReader;
  exports.Uint8ArrayWriter = Uint8ArrayWriter;
  exports.Writer = Writer;
  exports.ZipReader = ZipReader;
  exports.ZipWriter = ZipWriter;
  exports.configure = configure;
  exports.fs = fs;
  exports.getMimeType = getMimeType;
  exports.initShimAsyncCodec = streamCodecShim;
  exports.terminateWorkers = terminateWorkers;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
