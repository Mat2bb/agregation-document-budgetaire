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

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// Used for setting prototype methods that IE8 chokes on.
var DELETE = 'delete'; // Constants describing the size of trie nodes.

var SHIFT = 5; // Resulted in best performance after ______?

var SIZE = 1 << SHIFT;
var MASK = SIZE - 1; // A consistent shared value representing "not set" which equals nothing other
// than itself, and nothing that could be provided externally.

var NOT_SET = {}; // Boolean references, Rough equivalent of `bool &`.

function MakeRef() {
  return {
    value: false
  };
}

function SetRef(ref) {
  if (ref) {
    ref.value = true;
  }
} // A function which returns a value representing an "owner" for transient writes
// to tries. The return value will only ever equal itself, and will not equal
// the return of any subsequent call of this function.


function OwnerID() {}

function ensureSize(iter) {
  if (iter.size === undefined) {
    iter.size = iter.__iterate(returnTrue);
  }

  return iter.size;
}

function wrapIndex(iter, index) {
  // This implements "is array index" which the ECMAString spec defines as:
  //
  //     A String property name P is an array index if and only if
  //     ToString(ToUint32(P)) is equal to P and ToUint32(P) is not equal
  //     to 2^32−1.
  //
  // http://www.ecma-international.org/ecma-262/6.0/#sec-array-exotic-objects
  if (typeof index !== 'number') {
    var uint32Index = index >>> 0; // N >>> 0 is shorthand for ToUint32

    if ('' + uint32Index !== index || uint32Index === 4294967295) {
      return NaN;
    }

    index = uint32Index;
  }

  return index < 0 ? ensureSize(iter) + index : index;
}

function returnTrue() {
  return true;
}

function wholeSlice(begin, end, size) {
  return (begin === 0 && !isNeg(begin) || size !== undefined && begin <= -size) && (end === undefined || size !== undefined && end >= size);
}

function resolveBegin(begin, size) {
  return resolveIndex(begin, size, 0);
}

function resolveEnd(end, size) {
  return resolveIndex(end, size, size);
}

function resolveIndex(index, size, defaultIndex) {
  // Sanitize indices using this shorthand for ToInt32(argument)
  // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
  return index === undefined ? defaultIndex : isNeg(index) ? size === Infinity ? size : Math.max(0, size + index) | 0 : size === undefined || size === index ? index : Math.min(size, index) | 0;
}

function isNeg(value) {
  // Account for -0 which is negative, but not less than 0.
  return value < 0 || value === 0 && 1 / value === -Infinity;
} // Note: value is unchanged to not break immutable-devtools.


var IS_COLLECTION_SYMBOL = '@@__IMMUTABLE_ITERABLE__@@';

function isCollection(maybeCollection) {
  return Boolean(maybeCollection && maybeCollection[IS_COLLECTION_SYMBOL]);
}

var IS_KEYED_SYMBOL = '@@__IMMUTABLE_KEYED__@@';

function isKeyed(maybeKeyed) {
  return Boolean(maybeKeyed && maybeKeyed[IS_KEYED_SYMBOL]);
}

var IS_INDEXED_SYMBOL = '@@__IMMUTABLE_INDEXED__@@';

function isIndexed(maybeIndexed) {
  return Boolean(maybeIndexed && maybeIndexed[IS_INDEXED_SYMBOL]);
}

function isAssociative(maybeAssociative) {
  return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);
}

var Collection = function Collection(value) {
  return isCollection(value) ? value : Seq(value);
};

var KeyedCollection =
/*@__PURE__*/
function (Collection) {
  function KeyedCollection(value) {
    return isKeyed(value) ? value : KeyedSeq(value);
  }

  if (Collection) KeyedCollection.__proto__ = Collection;
  KeyedCollection.prototype = Object.create(Collection && Collection.prototype);
  KeyedCollection.prototype.constructor = KeyedCollection;
  return KeyedCollection;
}(Collection);

var IndexedCollection =
/*@__PURE__*/
function (Collection) {
  function IndexedCollection(value) {
    return isIndexed(value) ? value : IndexedSeq(value);
  }

  if (Collection) IndexedCollection.__proto__ = Collection;
  IndexedCollection.prototype = Object.create(Collection && Collection.prototype);
  IndexedCollection.prototype.constructor = IndexedCollection;
  return IndexedCollection;
}(Collection);

var SetCollection =
/*@__PURE__*/
function (Collection) {
  function SetCollection(value) {
    return isCollection(value) && !isAssociative(value) ? value : SetSeq(value);
  }

  if (Collection) SetCollection.__proto__ = Collection;
  SetCollection.prototype = Object.create(Collection && Collection.prototype);
  SetCollection.prototype.constructor = SetCollection;
  return SetCollection;
}(Collection);

Collection.Keyed = KeyedCollection;
Collection.Indexed = IndexedCollection;
Collection.Set = SetCollection;
var IS_SEQ_SYMBOL = '@@__IMMUTABLE_SEQ__@@';

function isSeq(maybeSeq) {
  return Boolean(maybeSeq && maybeSeq[IS_SEQ_SYMBOL]);
}

var IS_RECORD_SYMBOL = '@@__IMMUTABLE_RECORD__@@';

function isRecord(maybeRecord) {
  return Boolean(maybeRecord && maybeRecord[IS_RECORD_SYMBOL]);
}

function isImmutable(maybeImmutable) {
  return isCollection(maybeImmutable) || isRecord(maybeImmutable);
}

var IS_ORDERED_SYMBOL = '@@__IMMUTABLE_ORDERED__@@';

function isOrdered(maybeOrdered) {
  return Boolean(maybeOrdered && maybeOrdered[IS_ORDERED_SYMBOL]);
}

var ITERATE_KEYS = 0;
var ITERATE_VALUES = 1;
var ITERATE_ENTRIES = 2;
var REAL_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';
var ITERATOR_SYMBOL = REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;

var Iterator = function Iterator(next) {
  this.next = next;
};

Iterator.prototype.toString = function toString() {
  return '[Iterator]';
};

Iterator.KEYS = ITERATE_KEYS;
Iterator.VALUES = ITERATE_VALUES;
Iterator.ENTRIES = ITERATE_ENTRIES;

Iterator.prototype.inspect = Iterator.prototype.toSource = function () {
  return this.toString();
};

Iterator.prototype[ITERATOR_SYMBOL] = function () {
  return this;
};

function iteratorValue(type, k, v, iteratorResult) {
  var value = type === 0 ? k : type === 1 ? v : [k, v];
  iteratorResult ? iteratorResult.value = value : iteratorResult = {
    value: value,
    done: false
  };
  return iteratorResult;
}

function iteratorDone() {
  return {
    value: undefined,
    done: true
  };
}

function hasIterator(maybeIterable) {
  return !!getIteratorFn(maybeIterable);
}

function isIterator(maybeIterator) {
  return maybeIterator && typeof maybeIterator.next === 'function';
}

function getIterator(iterable) {
  var iteratorFn = getIteratorFn(iterable);
  return iteratorFn && iteratorFn.call(iterable);
}

function getIteratorFn(iterable) {
  var iteratorFn = iterable && (REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL] || iterable[FAUX_ITERATOR_SYMBOL]);

  if (typeof iteratorFn === 'function') {
    return iteratorFn;
  }
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

function isArrayLike(value) {
  if (Array.isArray(value) || typeof value === 'string') {
    return true;
  }

  return value && typeof value === 'object' && Number.isInteger(value.length) && value.length >= 0 && (value.length === 0 ? // Only {length: 0} is considered Array-like.
  Object.keys(value).length === 1 : // An object is only Array-like if it has a property where the last value
  // in the array-like may be found (which could be undefined).
  value.hasOwnProperty(value.length - 1));
}

var Seq =
/*@__PURE__*/
function (Collection$$1) {
  function Seq(value) {
    return value === null || value === undefined ? emptySequence() : isImmutable(value) ? value.toSeq() : seqFromValue(value);
  }

  if (Collection$$1) Seq.__proto__ = Collection$$1;
  Seq.prototype = Object.create(Collection$$1 && Collection$$1.prototype);
  Seq.prototype.constructor = Seq;

  Seq.prototype.toSeq = function toSeq() {
    return this;
  };

  Seq.prototype.toString = function toString() {
    return this.__toString('Seq {', '}');
  };

  Seq.prototype.cacheResult = function cacheResult() {
    if (!this._cache && this.__iterateUncached) {
      this._cache = this.entrySeq().toArray();
      this.size = this._cache.length;
    }

    return this;
  }; // abstract __iterateUncached(fn, reverse)


  Seq.prototype.__iterate = function __iterate(fn, reverse) {
    var cache = this._cache;

    if (cache) {
      var size = cache.length;
      var i = 0;

      while (i !== size) {
        var entry = cache[reverse ? size - ++i : i++];

        if (fn(entry[1], entry[0], this) === false) {
          break;
        }
      }

      return i;
    }

    return this.__iterateUncached(fn, reverse);
  }; // abstract __iteratorUncached(type, reverse)


  Seq.prototype.__iterator = function __iterator(type, reverse) {
    var cache = this._cache;

    if (cache) {
      var size = cache.length;
      var i = 0;
      return new Iterator(function () {
        if (i === size) {
          return iteratorDone();
        }

        var entry = cache[reverse ? size - ++i : i++];
        return iteratorValue(type, entry[0], entry[1]);
      });
    }

    return this.__iteratorUncached(type, reverse);
  };

  return Seq;
}(Collection);

var KeyedSeq =
/*@__PURE__*/
function (Seq) {
  function KeyedSeq(value) {
    return value === null || value === undefined ? emptySequence().toKeyedSeq() : isCollection(value) ? isKeyed(value) ? value.toSeq() : value.fromEntrySeq() : isRecord(value) ? value.toSeq() : keyedSeqFromValue(value);
  }

  if (Seq) KeyedSeq.__proto__ = Seq;
  KeyedSeq.prototype = Object.create(Seq && Seq.prototype);
  KeyedSeq.prototype.constructor = KeyedSeq;

  KeyedSeq.prototype.toKeyedSeq = function toKeyedSeq() {
    return this;
  };

  return KeyedSeq;
}(Seq);

var IndexedSeq =
/*@__PURE__*/
function (Seq) {
  function IndexedSeq(value) {
    return value === null || value === undefined ? emptySequence() : isCollection(value) ? isKeyed(value) ? value.entrySeq() : value.toIndexedSeq() : isRecord(value) ? value.toSeq().entrySeq() : indexedSeqFromValue(value);
  }

  if (Seq) IndexedSeq.__proto__ = Seq;
  IndexedSeq.prototype = Object.create(Seq && Seq.prototype);
  IndexedSeq.prototype.constructor = IndexedSeq;

  IndexedSeq.of = function of()
  /*...values*/
  {
    return IndexedSeq(arguments);
  };

  IndexedSeq.prototype.toIndexedSeq = function toIndexedSeq() {
    return this;
  };

  IndexedSeq.prototype.toString = function toString() {
    return this.__toString('Seq [', ']');
  };

  return IndexedSeq;
}(Seq);

var SetSeq =
/*@__PURE__*/
function (Seq) {
  function SetSeq(value) {
    return (isCollection(value) && !isAssociative(value) ? value : IndexedSeq(value)).toSetSeq();
  }

  if (Seq) SetSeq.__proto__ = Seq;
  SetSeq.prototype = Object.create(Seq && Seq.prototype);
  SetSeq.prototype.constructor = SetSeq;

  SetSeq.of = function of()
  /*...values*/
  {
    return SetSeq(arguments);
  };

  SetSeq.prototype.toSetSeq = function toSetSeq() {
    return this;
  };

  return SetSeq;
}(Seq);

Seq.isSeq = isSeq;
Seq.Keyed = KeyedSeq;
Seq.Set = SetSeq;
Seq.Indexed = IndexedSeq;
Seq.prototype[IS_SEQ_SYMBOL] = true; // #pragma Root Sequences

var ArraySeq =
/*@__PURE__*/
function (IndexedSeq) {
  function ArraySeq(array) {
    this._array = array;
    this.size = array.length;
  }

  if (IndexedSeq) ArraySeq.__proto__ = IndexedSeq;
  ArraySeq.prototype = Object.create(IndexedSeq && IndexedSeq.prototype);
  ArraySeq.prototype.constructor = ArraySeq;

  ArraySeq.prototype.get = function get(index, notSetValue) {
    return this.has(index) ? this._array[wrapIndex(this, index)] : notSetValue;
  };

  ArraySeq.prototype.__iterate = function __iterate(fn, reverse) {
    var array = this._array;
    var size = array.length;
    var i = 0;

    while (i !== size) {
      var ii = reverse ? size - ++i : i++;

      if (fn(array[ii], ii, this) === false) {
        break;
      }
    }

    return i;
  };

  ArraySeq.prototype.__iterator = function __iterator(type, reverse) {
    var array = this._array;
    var size = array.length;
    var i = 0;
    return new Iterator(function () {
      if (i === size) {
        return iteratorDone();
      }

      var ii = reverse ? size - ++i : i++;
      return iteratorValue(type, ii, array[ii]);
    });
  };

  return ArraySeq;
}(IndexedSeq);

var ObjectSeq =
/*@__PURE__*/
function (KeyedSeq) {
  function ObjectSeq(object) {
    var keys = Object.keys(object);
    this._object = object;
    this._keys = keys;
    this.size = keys.length;
  }

  if (KeyedSeq) ObjectSeq.__proto__ = KeyedSeq;
  ObjectSeq.prototype = Object.create(KeyedSeq && KeyedSeq.prototype);
  ObjectSeq.prototype.constructor = ObjectSeq;

  ObjectSeq.prototype.get = function get(key, notSetValue) {
    if (notSetValue !== undefined && !this.has(key)) {
      return notSetValue;
    }

    return this._object[key];
  };

  ObjectSeq.prototype.has = function has(key) {
    return hasOwnProperty.call(this._object, key);
  };

  ObjectSeq.prototype.__iterate = function __iterate(fn, reverse) {
    var object = this._object;
    var keys = this._keys;
    var size = keys.length;
    var i = 0;

    while (i !== size) {
      var key = keys[reverse ? size - ++i : i++];

      if (fn(object[key], key, this) === false) {
        break;
      }
    }

    return i;
  };

  ObjectSeq.prototype.__iterator = function __iterator(type, reverse) {
    var object = this._object;
    var keys = this._keys;
    var size = keys.length;
    var i = 0;
    return new Iterator(function () {
      if (i === size) {
        return iteratorDone();
      }

      var key = keys[reverse ? size - ++i : i++];
      return iteratorValue(type, key, object[key]);
    });
  };

  return ObjectSeq;
}(KeyedSeq);

ObjectSeq.prototype[IS_ORDERED_SYMBOL] = true;

var CollectionSeq =
/*@__PURE__*/
function (IndexedSeq) {
  function CollectionSeq(collection) {
    this._collection = collection;
    this.size = collection.length || collection.size;
  }

  if (IndexedSeq) CollectionSeq.__proto__ = IndexedSeq;
  CollectionSeq.prototype = Object.create(IndexedSeq && IndexedSeq.prototype);
  CollectionSeq.prototype.constructor = CollectionSeq;

  CollectionSeq.prototype.__iterateUncached = function __iterateUncached(fn, reverse) {
    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }

    var collection = this._collection;
    var iterator = getIterator(collection);
    var iterations = 0;

    if (isIterator(iterator)) {
      var step;

      while (!(step = iterator.next()).done) {
        if (fn(step.value, iterations++, this) === false) {
          break;
        }
      }
    }

    return iterations;
  };

  CollectionSeq.prototype.__iteratorUncached = function __iteratorUncached(type, reverse) {
    if (reverse) {
      return this.cacheResult().__iterator(type, reverse);
    }

    var collection = this._collection;
    var iterator = getIterator(collection);

    if (!isIterator(iterator)) {
      return new Iterator(iteratorDone);
    }

    var iterations = 0;
    return new Iterator(function () {
      var step = iterator.next();
      return step.done ? step : iteratorValue(type, iterations++, step.value);
    });
  };

  return CollectionSeq;
}(IndexedSeq); // # pragma Helper functions


var EMPTY_SEQ;

function emptySequence() {
  return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));
}

function keyedSeqFromValue(value) {
  var seq = Array.isArray(value) ? new ArraySeq(value) : hasIterator(value) ? new CollectionSeq(value) : undefined;

  if (seq) {
    return seq.fromEntrySeq();
  }

  if (typeof value === 'object') {
    return new ObjectSeq(value);
  }

  throw new TypeError('Expected Array or collection object of [k, v] entries, or keyed object: ' + value);
}

function indexedSeqFromValue(value) {
  var seq = maybeIndexedSeqFromValue(value);

  if (seq) {
    return seq;
  }

  throw new TypeError('Expected Array or collection object of values: ' + value);
}

function seqFromValue(value) {
  var seq = maybeIndexedSeqFromValue(value);

  if (seq) {
    return seq;
  }

  if (typeof value === 'object') {
    return new ObjectSeq(value);
  }

  throw new TypeError('Expected Array or collection object of values, or keyed object: ' + value);
}

function maybeIndexedSeqFromValue(value) {
  return isArrayLike(value) ? new ArraySeq(value) : hasIterator(value) ? new CollectionSeq(value) : undefined;
}

var IS_MAP_SYMBOL = '@@__IMMUTABLE_MAP__@@';

function isMap(maybeMap) {
  return Boolean(maybeMap && maybeMap[IS_MAP_SYMBOL]);
}

function isOrderedMap(maybeOrderedMap) {
  return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);
}

function isValueObject(maybeValue) {
  return Boolean(maybeValue && typeof maybeValue.equals === 'function' && typeof maybeValue.hashCode === 'function');
}
/**
 * An extension of the "same-value" algorithm as [described for use by ES6 Map
 * and Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Key_equality)
 *
 * NaN is considered the same as NaN, however -0 and 0 are considered the same
 * value, which is different from the algorithm described by
 * [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
 *
 * This is extended further to allow Objects to describe the values they
 * represent, by way of `valueOf` or `equals` (and `hashCode`).
 *
 * Note: because of this extension, the key equality of Immutable.Map and the
 * value equality of Immutable.Set will differ from ES6 Map and Set.
 *
 * ### Defining custom values
 *
 * The easiest way to describe the value an object represents is by implementing
 * `valueOf`. For example, `Date` represents a value by returning a unix
 * timestamp for `valueOf`:
 *
 *     var date1 = new Date(1234567890000); // Fri Feb 13 2009 ...
 *     var date2 = new Date(1234567890000);
 *     date1.valueOf(); // 1234567890000
 *     assert( date1 !== date2 );
 *     assert( Immutable.is( date1, date2 ) );
 *
 * Note: overriding `valueOf` may have other implications if you use this object
 * where JavaScript expects a primitive, such as implicit string coercion.
 *
 * For more complex types, especially collections, implementing `valueOf` may
 * not be performant. An alternative is to implement `equals` and `hashCode`.
 *
 * `equals` takes another object, presumably of similar type, and returns true
 * if it is equal. Equality is symmetrical, so the same result should be
 * returned if this and the argument are flipped.
 *
 *     assert( a.equals(b) === b.equals(a) );
 *
 * `hashCode` returns a 32bit integer number representing the object which will
 * be used to determine how to store the value object in a Map or Set. You must
 * provide both or neither methods, one must not exist without the other.
 *
 * Also, an important relationship between these methods must be upheld: if two
 * values are equal, they *must* return the same hashCode. If the values are not
 * equal, they might have the same hashCode; this is called a hash collision,
 * and while undesirable for performance reasons, it is acceptable.
 *
 *     if (a.equals(b)) {
 *       assert( a.hashCode() === b.hashCode() );
 *     }
 *
 * All Immutable collections are Value Objects: they implement `equals()`
 * and `hashCode()`.
 */


function is(valueA, valueB) {
  if (valueA === valueB || valueA !== valueA && valueB !== valueB) {
    return true;
  }

  if (!valueA || !valueB) {
    return false;
  }

  if (typeof valueA.valueOf === 'function' && typeof valueB.valueOf === 'function') {
    valueA = valueA.valueOf();
    valueB = valueB.valueOf();

    if (valueA === valueB || valueA !== valueA && valueB !== valueB) {
      return true;
    }

    if (!valueA || !valueB) {
      return false;
    }
  }

  return !!(isValueObject(valueA) && isValueObject(valueB) && valueA.equals(valueB));
}

var imul = typeof Math.imul === 'function' && Math.imul(0xffffffff, 2) === -2 ? Math.imul : function imul(a, b) {
  a |= 0; // int

  b |= 0; // int

  var c = a & 0xffff;
  var d = b & 0xffff; // Shift by 0 fixes the sign on the high part.

  return c * d + ((a >>> 16) * d + c * (b >>> 16) << 16 >>> 0) | 0; // int
}; // v8 has an optimization for storing 31-bit signed numbers.
// Values which have either 00 or 11 as the high order bits qualify.
// This function drops the highest order bit in a signed number, maintaining
// the sign bit.

function smi(i32) {
  return i32 >>> 1 & 0x40000000 | i32 & 0xbfffffff;
}

var defaultValueOf = Object.prototype.valueOf;

function hash(o) {
  switch (typeof o) {
    case 'boolean':
      // The hash values for built-in constants are a 1 value for each 5-byte
      // shift region expect for the first, which encodes the value. This
      // reduces the odds of a hash collision for these common values.
      return o ? 0x42108421 : 0x42108420;

    case 'number':
      return hashNumber(o);

    case 'string':
      return o.length > STRING_HASH_CACHE_MIN_STRLEN ? cachedHashString(o) : hashString(o);

    case 'object':
    case 'function':
      if (o === null) {
        return 0x42108422;
      }

      if (typeof o.hashCode === 'function') {
        // Drop any high bits from accidentally long hash codes.
        return smi(o.hashCode(o));
      }

      if (o.valueOf !== defaultValueOf && typeof o.valueOf === 'function') {
        o = o.valueOf(o);
      }

      return hashJSObj(o);

    case 'undefined':
      return 0x42108423;

    default:
      if (typeof o.toString === 'function') {
        return hashString(o.toString());
      }

      throw new Error('Value type ' + typeof o + ' cannot be hashed.');
  }
} // Compress arbitrarily large numbers into smi hashes.


function hashNumber(n) {
  if (n !== n || n === Infinity) {
    return 0;
  }

  var hash = n | 0;

  if (hash !== n) {
    hash ^= n * 0xffffffff;
  }

  while (n > 0xffffffff) {
    n /= 0xffffffff;
    hash ^= n;
  }

  return smi(hash);
}

function cachedHashString(string) {
  var hashed = stringHashCache[string];

  if (hashed === undefined) {
    hashed = hashString(string);

    if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
      STRING_HASH_CACHE_SIZE = 0;
      stringHashCache = {};
    }

    STRING_HASH_CACHE_SIZE++;
    stringHashCache[string] = hashed;
  }

  return hashed;
} // http://jsperf.com/hashing-strings


function hashString(string) {
  // This is the hash from JVM
  // The hash code for a string is computed as
  // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
  // where s[i] is the ith character of the string and n is the length of
  // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
  // (exclusive) by dropping high bits.
  var hashed = 0;

  for (var ii = 0; ii < string.length; ii++) {
    hashed = 31 * hashed + string.charCodeAt(ii) | 0;
  }

  return smi(hashed);
}

function hashJSObj(obj) {
  var hashed;

  if (usingWeakMap) {
    hashed = weakMap.get(obj);

    if (hashed !== undefined) {
      return hashed;
    }
  }

  hashed = obj[UID_HASH_KEY];

  if (hashed !== undefined) {
    return hashed;
  }

  if (!canDefineProperty) {
    hashed = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];

    if (hashed !== undefined) {
      return hashed;
    }

    hashed = getIENodeHash(obj);

    if (hashed !== undefined) {
      return hashed;
    }
  }

  hashed = ++objHashUID;

  if (objHashUID & 0x40000000) {
    objHashUID = 0;
  }

  if (usingWeakMap) {
    weakMap.set(obj, hashed);
  } else if (isExtensible !== undefined && isExtensible(obj) === false) {
    throw new Error('Non-extensible objects are not allowed as keys.');
  } else if (canDefineProperty) {
    Object.defineProperty(obj, UID_HASH_KEY, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: hashed
    });
  } else if (obj.propertyIsEnumerable !== undefined && obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable) {
    // Since we can't define a non-enumerable property on the object
    // we'll hijack one of the less-used non-enumerable properties to
    // save our hash on it. Since this is a function it will not show up in
    // `JSON.stringify` which is what we want.
    obj.propertyIsEnumerable = function () {
      return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments);
    };

    obj.propertyIsEnumerable[UID_HASH_KEY] = hashed;
  } else if (obj.nodeType !== undefined) {
    // At this point we couldn't get the IE `uniqueID` to use as a hash
    // and we couldn't use a non-enumerable property to exploit the
    // dontEnum bug so we simply add the `UID_HASH_KEY` on the node
    // itself.
    obj[UID_HASH_KEY] = hashed;
  } else {
    throw new Error('Unable to set a non-enumerable property on object.');
  }

  return hashed;
} // Get references to ES5 object methods.


var isExtensible = Object.isExtensible; // True if Object.defineProperty works as expected. IE8 fails this test.

var canDefineProperty = function () {
  try {
    Object.defineProperty({}, '@', {});
    return true;
  } catch (e) {
    return false;
  }
}(); // IE has a `uniqueID` property on DOM nodes. We can construct the hash from it
// and avoid memory leaks from the IE cloneNode bug.


function getIENodeHash(node) {
  if (node && node.nodeType > 0) {
    switch (node.nodeType) {
      case 1:
        // Element
        return node.uniqueID;

      case 9:
        // Document
        return node.documentElement && node.documentElement.uniqueID;
    }
  }
} // If possible, use a WeakMap.


var usingWeakMap = typeof WeakMap === 'function';
var weakMap;

if (usingWeakMap) {
  weakMap = new WeakMap();
}

var objHashUID = 0;
var UID_HASH_KEY = '__immutablehash__';

if (typeof Symbol === 'function') {
  UID_HASH_KEY = Symbol(UID_HASH_KEY);
}

var STRING_HASH_CACHE_MIN_STRLEN = 16;
var STRING_HASH_CACHE_MAX_SIZE = 255;
var STRING_HASH_CACHE_SIZE = 0;
var stringHashCache = {};

var ToKeyedSequence =
/*@__PURE__*/
function (KeyedSeq$$1) {
  function ToKeyedSequence(indexed, useKeys) {
    this._iter = indexed;
    this._useKeys = useKeys;
    this.size = indexed.size;
  }

  if (KeyedSeq$$1) ToKeyedSequence.__proto__ = KeyedSeq$$1;
  ToKeyedSequence.prototype = Object.create(KeyedSeq$$1 && KeyedSeq$$1.prototype);
  ToKeyedSequence.prototype.constructor = ToKeyedSequence;

  ToKeyedSequence.prototype.get = function get(key, notSetValue) {
    return this._iter.get(key, notSetValue);
  };

  ToKeyedSequence.prototype.has = function has(key) {
    return this._iter.has(key);
  };

  ToKeyedSequence.prototype.valueSeq = function valueSeq() {
    return this._iter.valueSeq();
  };

  ToKeyedSequence.prototype.reverse = function reverse() {
    var this$1 = this;
    var reversedSequence = reverseFactory(this, true);

    if (!this._useKeys) {
      reversedSequence.valueSeq = function () {
        return this$1._iter.toSeq().reverse();
      };
    }

    return reversedSequence;
  };

  ToKeyedSequence.prototype.map = function map(mapper, context) {
    var this$1 = this;
    var mappedSequence = mapFactory(this, mapper, context);

    if (!this._useKeys) {
      mappedSequence.valueSeq = function () {
        return this$1._iter.toSeq().map(mapper, context);
      };
    }

    return mappedSequence;
  };

  ToKeyedSequence.prototype.__iterate = function __iterate(fn, reverse) {
    var this$1 = this;
    return this._iter.__iterate(function (v, k) {
      return fn(v, k, this$1);
    }, reverse);
  };

  ToKeyedSequence.prototype.__iterator = function __iterator(type, reverse) {
    return this._iter.__iterator(type, reverse);
  };

  return ToKeyedSequence;
}(KeyedSeq);

ToKeyedSequence.prototype[IS_ORDERED_SYMBOL] = true;

var ToIndexedSequence =
/*@__PURE__*/
function (IndexedSeq$$1) {
  function ToIndexedSequence(iter) {
    this._iter = iter;
    this.size = iter.size;
  }

  if (IndexedSeq$$1) ToIndexedSequence.__proto__ = IndexedSeq$$1;
  ToIndexedSequence.prototype = Object.create(IndexedSeq$$1 && IndexedSeq$$1.prototype);
  ToIndexedSequence.prototype.constructor = ToIndexedSequence;

  ToIndexedSequence.prototype.includes = function includes(value) {
    return this._iter.includes(value);
  };

  ToIndexedSequence.prototype.__iterate = function __iterate(fn, reverse) {
    var this$1 = this;
    var i = 0;
    reverse && ensureSize(this);
    return this._iter.__iterate(function (v) {
      return fn(v, reverse ? this$1.size - ++i : i++, this$1);
    }, reverse);
  };

  ToIndexedSequence.prototype.__iterator = function __iterator(type, reverse) {
    var this$1 = this;

    var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);

    var i = 0;
    reverse && ensureSize(this);
    return new Iterator(function () {
      var step = iterator.next();
      return step.done ? step : iteratorValue(type, reverse ? this$1.size - ++i : i++, step.value, step);
    });
  };

  return ToIndexedSequence;
}(IndexedSeq);

var ToSetSequence =
/*@__PURE__*/
function (SetSeq$$1) {
  function ToSetSequence(iter) {
    this._iter = iter;
    this.size = iter.size;
  }

  if (SetSeq$$1) ToSetSequence.__proto__ = SetSeq$$1;
  ToSetSequence.prototype = Object.create(SetSeq$$1 && SetSeq$$1.prototype);
  ToSetSequence.prototype.constructor = ToSetSequence;

  ToSetSequence.prototype.has = function has(key) {
    return this._iter.includes(key);
  };

  ToSetSequence.prototype.__iterate = function __iterate(fn, reverse) {
    var this$1 = this;
    return this._iter.__iterate(function (v) {
      return fn(v, v, this$1);
    }, reverse);
  };

  ToSetSequence.prototype.__iterator = function __iterator(type, reverse) {
    var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);

    return new Iterator(function () {
      var step = iterator.next();
      return step.done ? step : iteratorValue(type, step.value, step.value, step);
    });
  };

  return ToSetSequence;
}(SetSeq);

var FromEntriesSequence =
/*@__PURE__*/
function (KeyedSeq$$1) {
  function FromEntriesSequence(entries) {
    this._iter = entries;
    this.size = entries.size;
  }

  if (KeyedSeq$$1) FromEntriesSequence.__proto__ = KeyedSeq$$1;
  FromEntriesSequence.prototype = Object.create(KeyedSeq$$1 && KeyedSeq$$1.prototype);
  FromEntriesSequence.prototype.constructor = FromEntriesSequence;

  FromEntriesSequence.prototype.entrySeq = function entrySeq() {
    return this._iter.toSeq();
  };

  FromEntriesSequence.prototype.__iterate = function __iterate(fn, reverse) {
    var this$1 = this;
    return this._iter.__iterate(function (entry) {
      // Check if entry exists first so array access doesn't throw for holes
      // in the parent iteration.
      if (entry) {
        validateEntry(entry);
        var indexedCollection = isCollection(entry);
        return fn(indexedCollection ? entry.get(1) : entry[1], indexedCollection ? entry.get(0) : entry[0], this$1);
      }
    }, reverse);
  };

  FromEntriesSequence.prototype.__iterator = function __iterator(type, reverse) {
    var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);

    return new Iterator(function () {
      while (true) {
        var step = iterator.next();

        if (step.done) {
          return step;
        }

        var entry = step.value; // Check if entry exists first so array access doesn't throw for holes
        // in the parent iteration.

        if (entry) {
          validateEntry(entry);
          var indexedCollection = isCollection(entry);
          return iteratorValue(type, indexedCollection ? entry.get(0) : entry[0], indexedCollection ? entry.get(1) : entry[1], step);
        }
      }
    });
  };

  return FromEntriesSequence;
}(KeyedSeq);

ToIndexedSequence.prototype.cacheResult = ToKeyedSequence.prototype.cacheResult = ToSetSequence.prototype.cacheResult = FromEntriesSequence.prototype.cacheResult = cacheResultThrough;

function flipFactory(collection) {
  var flipSequence = makeSequence(collection);
  flipSequence._iter = collection;
  flipSequence.size = collection.size;

  flipSequence.flip = function () {
    return collection;
  };

  flipSequence.reverse = function () {
    var reversedSequence = collection.reverse.apply(this); // super.reverse()

    reversedSequence.flip = function () {
      return collection.reverse();
    };

    return reversedSequence;
  };

  flipSequence.has = function (key) {
    return collection.includes(key);
  };

  flipSequence.includes = function (key) {
    return collection.has(key);
  };

  flipSequence.cacheResult = cacheResultThrough;

  flipSequence.__iterateUncached = function (fn, reverse) {
    var this$1 = this;
    return collection.__iterate(function (v, k) {
      return fn(k, v, this$1) !== false;
    }, reverse);
  };

  flipSequence.__iteratorUncached = function (type, reverse) {
    if (type === ITERATE_ENTRIES) {
      var iterator = collection.__iterator(type, reverse);

      return new Iterator(function () {
        var step = iterator.next();

        if (!step.done) {
          var k = step.value[0];
          step.value[0] = step.value[1];
          step.value[1] = k;
        }

        return step;
      });
    }

    return collection.__iterator(type === ITERATE_VALUES ? ITERATE_KEYS : ITERATE_VALUES, reverse);
  };

  return flipSequence;
}

function mapFactory(collection, mapper, context) {
  var mappedSequence = makeSequence(collection);
  mappedSequence.size = collection.size;

  mappedSequence.has = function (key) {
    return collection.has(key);
  };

  mappedSequence.get = function (key, notSetValue) {
    var v = collection.get(key, NOT_SET);
    return v === NOT_SET ? notSetValue : mapper.call(context, v, key, collection);
  };

  mappedSequence.__iterateUncached = function (fn, reverse) {
    var this$1 = this;
    return collection.__iterate(function (v, k, c) {
      return fn(mapper.call(context, v, k, c), k, this$1) !== false;
    }, reverse);
  };

  mappedSequence.__iteratorUncached = function (type, reverse) {
    var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);

    return new Iterator(function () {
      var step = iterator.next();

      if (step.done) {
        return step;
      }

      var entry = step.value;
      var key = entry[0];
      return iteratorValue(type, key, mapper.call(context, entry[1], key, collection), step);
    });
  };

  return mappedSequence;
}

function reverseFactory(collection, useKeys) {
  var this$1 = this;
  var reversedSequence = makeSequence(collection);
  reversedSequence._iter = collection;
  reversedSequence.size = collection.size;

  reversedSequence.reverse = function () {
    return collection;
  };

  if (collection.flip) {
    reversedSequence.flip = function () {
      var flipSequence = flipFactory(collection);

      flipSequence.reverse = function () {
        return collection.flip();
      };

      return flipSequence;
    };
  }

  reversedSequence.get = function (key, notSetValue) {
    return collection.get(useKeys ? key : -1 - key, notSetValue);
  };

  reversedSequence.has = function (key) {
    return collection.has(useKeys ? key : -1 - key);
  };

  reversedSequence.includes = function (value) {
    return collection.includes(value);
  };

  reversedSequence.cacheResult = cacheResultThrough;

  reversedSequence.__iterate = function (fn, reverse) {
    var this$1 = this;
    var i = 0;
    reverse && ensureSize(collection);
    return collection.__iterate(function (v, k) {
      return fn(v, useKeys ? k : reverse ? this$1.size - ++i : i++, this$1);
    }, !reverse);
  };

  reversedSequence.__iterator = function (type, reverse) {
    var i = 0;
    reverse && ensureSize(collection);

    var iterator = collection.__iterator(ITERATE_ENTRIES, !reverse);

    return new Iterator(function () {
      var step = iterator.next();

      if (step.done) {
        return step;
      }

      var entry = step.value;
      return iteratorValue(type, useKeys ? entry[0] : reverse ? this$1.size - ++i : i++, entry[1], step);
    });
  };

  return reversedSequence;
}

function filterFactory(collection, predicate, context, useKeys) {
  var filterSequence = makeSequence(collection);

  if (useKeys) {
    filterSequence.has = function (key) {
      var v = collection.get(key, NOT_SET);
      return v !== NOT_SET && !!predicate.call(context, v, key, collection);
    };

    filterSequence.get = function (key, notSetValue) {
      var v = collection.get(key, NOT_SET);
      return v !== NOT_SET && predicate.call(context, v, key, collection) ? v : notSetValue;
    };
  }

  filterSequence.__iterateUncached = function (fn, reverse) {
    var this$1 = this;
    var iterations = 0;

    collection.__iterate(function (v, k, c) {
      if (predicate.call(context, v, k, c)) {
        iterations++;
        return fn(v, useKeys ? k : iterations - 1, this$1);
      }
    }, reverse);

    return iterations;
  };

  filterSequence.__iteratorUncached = function (type, reverse) {
    var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);

    var iterations = 0;
    return new Iterator(function () {
      while (true) {
        var step = iterator.next();

        if (step.done) {
          return step;
        }

        var entry = step.value;
        var key = entry[0];
        var value = entry[1];

        if (predicate.call(context, value, key, collection)) {
          return iteratorValue(type, useKeys ? key : iterations++, value, step);
        }
      }
    });
  };

  return filterSequence;
}

function countByFactory(collection, grouper, context) {
  var groups = Map$1().asMutable();

  collection.__iterate(function (v, k) {
    groups.update(grouper.call(context, v, k, collection), 0, function (a) {
      return a + 1;
    });
  });

  return groups.asImmutable();
}

function groupByFactory(collection, grouper, context) {
  var isKeyedIter = isKeyed(collection);
  var groups = (isOrdered(collection) ? OrderedMap() : Map$1()).asMutable();

  collection.__iterate(function (v, k) {
    groups.update(grouper.call(context, v, k, collection), function (a) {
      return a = a || [], a.push(isKeyedIter ? [k, v] : v), a;
    });
  });

  var coerce = collectionClass(collection);
  return groups.map(function (arr) {
    return reify(collection, coerce(arr));
  }).asImmutable();
}

function sliceFactory(collection, begin, end, useKeys) {
  var originalSize = collection.size;

  if (wholeSlice(begin, end, originalSize)) {
    return collection;
  }

  var resolvedBegin = resolveBegin(begin, originalSize);
  var resolvedEnd = resolveEnd(end, originalSize); // begin or end will be NaN if they were provided as negative numbers and
  // this collection's size is unknown. In that case, cache first so there is
  // a known size and these do not resolve to NaN.

  if (resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd) {
    return sliceFactory(collection.toSeq().cacheResult(), begin, end, useKeys);
  } // Note: resolvedEnd is undefined when the original sequence's length is
  // unknown and this slice did not supply an end and should contain all
  // elements after resolvedBegin.
  // In that case, resolvedSize will be NaN and sliceSize will remain undefined.


  var resolvedSize = resolvedEnd - resolvedBegin;
  var sliceSize;

  if (resolvedSize === resolvedSize) {
    sliceSize = resolvedSize < 0 ? 0 : resolvedSize;
  }

  var sliceSeq = makeSequence(collection); // If collection.size is undefined, the size of the realized sliceSeq is
  // unknown at this point unless the number of items to slice is 0

  sliceSeq.size = sliceSize === 0 ? sliceSize : collection.size && sliceSize || undefined;

  if (!useKeys && isSeq(collection) && sliceSize >= 0) {
    sliceSeq.get = function (index, notSetValue) {
      index = wrapIndex(this, index);
      return index >= 0 && index < sliceSize ? collection.get(index + resolvedBegin, notSetValue) : notSetValue;
    };
  }

  sliceSeq.__iterateUncached = function (fn, reverse) {
    var this$1 = this;

    if (sliceSize === 0) {
      return 0;
    }

    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }

    var skipped = 0;
    var isSkipping = true;
    var iterations = 0;

    collection.__iterate(function (v, k) {
      if (!(isSkipping && (isSkipping = skipped++ < resolvedBegin))) {
        iterations++;
        return fn(v, useKeys ? k : iterations - 1, this$1) !== false && iterations !== sliceSize;
      }
    });

    return iterations;
  };

  sliceSeq.__iteratorUncached = function (type, reverse) {
    if (sliceSize !== 0 && reverse) {
      return this.cacheResult().__iterator(type, reverse);
    } // Don't bother instantiating parent iterator if taking 0.


    if (sliceSize === 0) {
      return new Iterator(iteratorDone);
    }

    var iterator = collection.__iterator(type, reverse);

    var skipped = 0;
    var iterations = 0;
    return new Iterator(function () {
      while (skipped++ < resolvedBegin) {
        iterator.next();
      }

      if (++iterations > sliceSize) {
        return iteratorDone();
      }

      var step = iterator.next();

      if (useKeys || type === ITERATE_VALUES || step.done) {
        return step;
      }

      if (type === ITERATE_KEYS) {
        return iteratorValue(type, iterations - 1, undefined, step);
      }

      return iteratorValue(type, iterations - 1, step.value[1], step);
    });
  };

  return sliceSeq;
}

function takeWhileFactory(collection, predicate, context) {
  var takeSequence = makeSequence(collection);

  takeSequence.__iterateUncached = function (fn, reverse) {
    var this$1 = this;

    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }

    var iterations = 0;

    collection.__iterate(function (v, k, c) {
      return predicate.call(context, v, k, c) && ++iterations && fn(v, k, this$1);
    });

    return iterations;
  };

  takeSequence.__iteratorUncached = function (type, reverse) {
    var this$1 = this;

    if (reverse) {
      return this.cacheResult().__iterator(type, reverse);
    }

    var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);

    var iterating = true;
    return new Iterator(function () {
      if (!iterating) {
        return iteratorDone();
      }

      var step = iterator.next();

      if (step.done) {
        return step;
      }

      var entry = step.value;
      var k = entry[0];
      var v = entry[1];

      if (!predicate.call(context, v, k, this$1)) {
        iterating = false;
        return iteratorDone();
      }

      return type === ITERATE_ENTRIES ? step : iteratorValue(type, k, v, step);
    });
  };

  return takeSequence;
}

function skipWhileFactory(collection, predicate, context, useKeys) {
  var skipSequence = makeSequence(collection);

  skipSequence.__iterateUncached = function (fn, reverse) {
    var this$1 = this;

    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }

    var isSkipping = true;
    var iterations = 0;

    collection.__iterate(function (v, k, c) {
      if (!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))) {
        iterations++;
        return fn(v, useKeys ? k : iterations - 1, this$1);
      }
    });

    return iterations;
  };

  skipSequence.__iteratorUncached = function (type, reverse) {
    var this$1 = this;

    if (reverse) {
      return this.cacheResult().__iterator(type, reverse);
    }

    var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);

    var skipping = true;
    var iterations = 0;
    return new Iterator(function () {
      var step;
      var k;
      var v;

      do {
        step = iterator.next();

        if (step.done) {
          if (useKeys || type === ITERATE_VALUES) {
            return step;
          }

          if (type === ITERATE_KEYS) {
            return iteratorValue(type, iterations++, undefined, step);
          }

          return iteratorValue(type, iterations++, step.value[1], step);
        }

        var entry = step.value;
        k = entry[0];
        v = entry[1];
        skipping && (skipping = predicate.call(context, v, k, this$1));
      } while (skipping);

      return type === ITERATE_ENTRIES ? step : iteratorValue(type, k, v, step);
    });
  };

  return skipSequence;
}

function concatFactory(collection, values) {
  var isKeyedCollection = isKeyed(collection);
  var iters = [collection].concat(values).map(function (v) {
    if (!isCollection(v)) {
      v = isKeyedCollection ? keyedSeqFromValue(v) : indexedSeqFromValue(Array.isArray(v) ? v : [v]);
    } else if (isKeyedCollection) {
      v = KeyedCollection(v);
    }

    return v;
  }).filter(function (v) {
    return v.size !== 0;
  });

  if (iters.length === 0) {
    return collection;
  }

  if (iters.length === 1) {
    var singleton = iters[0];

    if (singleton === collection || isKeyedCollection && isKeyed(singleton) || isIndexed(collection) && isIndexed(singleton)) {
      return singleton;
    }
  }

  var concatSeq = new ArraySeq(iters);

  if (isKeyedCollection) {
    concatSeq = concatSeq.toKeyedSeq();
  } else if (!isIndexed(collection)) {
    concatSeq = concatSeq.toSetSeq();
  }

  concatSeq = concatSeq.flatten(true);
  concatSeq.size = iters.reduce(function (sum, seq) {
    if (sum !== undefined) {
      var size = seq.size;

      if (size !== undefined) {
        return sum + size;
      }
    }
  }, 0);
  return concatSeq;
}

function flattenFactory(collection, depth, useKeys) {
  var flatSequence = makeSequence(collection);

  flatSequence.__iterateUncached = function (fn, reverse) {
    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }

    var iterations = 0;
    var stopped = false;

    function flatDeep(iter, currentDepth) {
      iter.__iterate(function (v, k) {
        if ((!depth || currentDepth < depth) && isCollection(v)) {
          flatDeep(v, currentDepth + 1);
        } else {
          iterations++;

          if (fn(v, useKeys ? k : iterations - 1, flatSequence) === false) {
            stopped = true;
          }
        }

        return !stopped;
      }, reverse);
    }

    flatDeep(collection, 0);
    return iterations;
  };

  flatSequence.__iteratorUncached = function (type, reverse) {
    if (reverse) {
      return this.cacheResult().__iterator(type, reverse);
    }

    var iterator = collection.__iterator(type, reverse);

    var stack = [];
    var iterations = 0;
    return new Iterator(function () {
      while (iterator) {
        var step = iterator.next();

        if (step.done !== false) {
          iterator = stack.pop();
          continue;
        }

        var v = step.value;

        if (type === ITERATE_ENTRIES) {
          v = v[1];
        }

        if ((!depth || stack.length < depth) && isCollection(v)) {
          stack.push(iterator);
          iterator = v.__iterator(type, reverse);
        } else {
          return useKeys ? step : iteratorValue(type, iterations++, v, step);
        }
      }

      return iteratorDone();
    });
  };

  return flatSequence;
}

function flatMapFactory(collection, mapper, context) {
  var coerce = collectionClass(collection);
  return collection.toSeq().map(function (v, k) {
    return coerce(mapper.call(context, v, k, collection));
  }).flatten(true);
}

function interposeFactory(collection, separator) {
  var interposedSequence = makeSequence(collection);
  interposedSequence.size = collection.size && collection.size * 2 - 1;

  interposedSequence.__iterateUncached = function (fn, reverse) {
    var this$1 = this;
    var iterations = 0;

    collection.__iterate(function (v) {
      return (!iterations || fn(separator, iterations++, this$1) !== false) && fn(v, iterations++, this$1) !== false;
    }, reverse);

    return iterations;
  };

  interposedSequence.__iteratorUncached = function (type, reverse) {
    var iterator = collection.__iterator(ITERATE_VALUES, reverse);

    var iterations = 0;
    var step;
    return new Iterator(function () {
      if (!step || iterations % 2) {
        step = iterator.next();

        if (step.done) {
          return step;
        }
      }

      return iterations % 2 ? iteratorValue(type, iterations++, separator) : iteratorValue(type, iterations++, step.value, step);
    });
  };

  return interposedSequence;
}

function sortFactory(collection, comparator, mapper) {
  if (!comparator) {
    comparator = defaultComparator;
  }

  var isKeyedCollection = isKeyed(collection);
  var index = 0;
  var entries = collection.toSeq().map(function (v, k) {
    return [k, v, index++, mapper ? mapper(v, k, collection) : v];
  }).valueSeq().toArray();
  entries.sort(function (a, b) {
    return comparator(a[3], b[3]) || a[2] - b[2];
  }).forEach(isKeyedCollection ? function (v, i) {
    entries[i].length = 2;
  } : function (v, i) {
    entries[i] = v[1];
  });
  return isKeyedCollection ? KeyedSeq(entries) : isIndexed(collection) ? IndexedSeq(entries) : SetSeq(entries);
}

function maxFactory(collection, comparator, mapper) {
  if (!comparator) {
    comparator = defaultComparator;
  }

  if (mapper) {
    var entry = collection.toSeq().map(function (v, k) {
      return [v, mapper(v, k, collection)];
    }).reduce(function (a, b) {
      return maxCompare(comparator, a[1], b[1]) ? b : a;
    });
    return entry && entry[0];
  }

  return collection.reduce(function (a, b) {
    return maxCompare(comparator, a, b) ? b : a;
  });
}

function maxCompare(comparator, a, b) {
  var comp = comparator(b, a); // b is considered the new max if the comparator declares them equal, but
  // they are not equal and b is in fact a nullish value.

  return comp === 0 && b !== a && (b === undefined || b === null || b !== b) || comp > 0;
}

function zipWithFactory(keyIter, zipper, iters, zipAll) {
  var zipSequence = makeSequence(keyIter);
  var sizes = new ArraySeq(iters).map(function (i) {
    return i.size;
  });
  zipSequence.size = zipAll ? sizes.max() : sizes.min(); // Note: this a generic base implementation of __iterate in terms of
  // __iterator which may be more generically useful in the future.

  zipSequence.__iterate = function (fn, reverse) {
    /* generic:
    var iterator = this.__iterator(ITERATE_ENTRIES, reverse);
    var step;
    var iterations = 0;
    while (!(step = iterator.next()).done) {
      iterations++;
      if (fn(step.value[1], step.value[0], this) === false) {
        break;
      }
    }
    return iterations;
    */
    // indexed:
    var iterator = this.__iterator(ITERATE_VALUES, reverse);

    var step;
    var iterations = 0;

    while (!(step = iterator.next()).done) {
      if (fn(step.value, iterations++, this) === false) {
        break;
      }
    }

    return iterations;
  };

  zipSequence.__iteratorUncached = function (type, reverse) {
    var iterators = iters.map(function (i) {
      return i = Collection(i), getIterator(reverse ? i.reverse() : i);
    });
    var iterations = 0;
    var isDone = false;
    return new Iterator(function () {
      var steps;

      if (!isDone) {
        steps = iterators.map(function (i) {
          return i.next();
        });
        isDone = zipAll ? steps.every(function (s) {
          return s.done;
        }) : steps.some(function (s) {
          return s.done;
        });
      }

      if (isDone) {
        return iteratorDone();
      }

      return iteratorValue(type, iterations++, zipper.apply(null, steps.map(function (s) {
        return s.value;
      })));
    });
  };

  return zipSequence;
} // #pragma Helper Functions


function reify(iter, seq) {
  return iter === seq ? iter : isSeq(iter) ? seq : iter.constructor(seq);
}

function validateEntry(entry) {
  if (entry !== Object(entry)) {
    throw new TypeError('Expected [K, V] tuple: ' + entry);
  }
}

function collectionClass(collection) {
  return isKeyed(collection) ? KeyedCollection : isIndexed(collection) ? IndexedCollection : SetCollection;
}

function makeSequence(collection) {
  return Object.create((isKeyed(collection) ? KeyedSeq : isIndexed(collection) ? IndexedSeq : SetSeq).prototype);
}

function cacheResultThrough() {
  if (this._iter.cacheResult) {
    this._iter.cacheResult();

    this.size = this._iter.size;
    return this;
  }

  return Seq.prototype.cacheResult.call(this);
}

function defaultComparator(a, b) {
  if (a === undefined && b === undefined) {
    return 0;
  }

  if (a === undefined) {
    return 1;
  }

  if (b === undefined) {
    return -1;
  }

  return a > b ? 1 : a < b ? -1 : 0;
} // http://jsperf.com/copy-array-inline


function arrCopy(arr, offset) {
  offset = offset || 0;
  var len = Math.max(0, arr.length - offset);
  var newArr = new Array(len);

  for (var ii = 0; ii < len; ii++) {
    newArr[ii] = arr[ii + offset];
  }

  return newArr;
}

function invariant(condition, error) {
  if (!condition) {
    throw new Error(error);
  }
}

function assertNotInfinite(size) {
  invariant(size !== Infinity, 'Cannot perform this action with an infinite size.');
}

function coerceKeyPath(keyPath) {
  if (isArrayLike(keyPath) && typeof keyPath !== 'string') {
    return keyPath;
  }

  if (isOrdered(keyPath)) {
    return keyPath.toArray();
  }

  throw new TypeError('Invalid keyPath: expected Ordered Collection or Array: ' + keyPath);
}

function isPlainObj(value) {
  return value && (typeof value.constructor !== 'function' || value.constructor.name === 'Object');
}
/**
 * Returns true if the value is a potentially-persistent data structure, either
 * provided by Immutable.js or a plain Array or Object.
 */


function isDataStructure(value) {
  return typeof value === 'object' && (isImmutable(value) || Array.isArray(value) || isPlainObj(value));
}
/**
 * Converts a value to a string, adding quotes if a string was provided.
 */


function quoteString(value) {
  try {
    return typeof value === 'string' ? JSON.stringify(value) : String(value);
  } catch (_ignoreError) {
    return JSON.stringify(value);
  }
}

function has(collection, key) {
  return isImmutable(collection) ? collection.has(key) : isDataStructure(collection) && hasOwnProperty.call(collection, key);
}

function get(collection, key, notSetValue) {
  return isImmutable(collection) ? collection.get(key, notSetValue) : !has(collection, key) ? notSetValue : typeof collection.get === 'function' ? collection.get(key) : collection[key];
}

function shallowCopy(from) {
  if (Array.isArray(from)) {
    return arrCopy(from);
  }

  var to = {};

  for (var key in from) {
    if (hasOwnProperty.call(from, key)) {
      to[key] = from[key];
    }
  }

  return to;
}

function remove(collection, key) {
  if (!isDataStructure(collection)) {
    throw new TypeError('Cannot update non-data-structure value: ' + collection);
  }

  if (isImmutable(collection)) {
    if (!collection.remove) {
      throw new TypeError('Cannot update immutable value without .remove() method: ' + collection);
    }

    return collection.remove(key);
  }

  if (!hasOwnProperty.call(collection, key)) {
    return collection;
  }

  var collectionCopy = shallowCopy(collection);

  if (Array.isArray(collectionCopy)) {
    collectionCopy.splice(key, 1);
  } else {
    delete collectionCopy[key];
  }

  return collectionCopy;
}

function set(collection, key, value) {
  if (!isDataStructure(collection)) {
    throw new TypeError('Cannot update non-data-structure value: ' + collection);
  }

  if (isImmutable(collection)) {
    if (!collection.set) {
      throw new TypeError('Cannot update immutable value without .set() method: ' + collection);
    }

    return collection.set(key, value);
  }

  if (hasOwnProperty.call(collection, key) && value === collection[key]) {
    return collection;
  }

  var collectionCopy = shallowCopy(collection);
  collectionCopy[key] = value;
  return collectionCopy;
}

function updateIn(collection, keyPath, notSetValue, updater) {
  if (!updater) {
    updater = notSetValue;
    notSetValue = undefined;
  }

  var updatedValue = updateInDeeply(isImmutable(collection), collection, coerceKeyPath(keyPath), 0, notSetValue, updater);
  return updatedValue === NOT_SET ? notSetValue : updatedValue;
}

function updateInDeeply(inImmutable, existing, keyPath, i, notSetValue, updater) {
  var wasNotSet = existing === NOT_SET;

  if (i === keyPath.length) {
    var existingValue = wasNotSet ? notSetValue : existing;
    var newValue = updater(existingValue);
    return newValue === existingValue ? existing : newValue;
  }

  if (!wasNotSet && !isDataStructure(existing)) {
    throw new TypeError('Cannot update within non-data-structure value in path [' + keyPath.slice(0, i).map(quoteString) + ']: ' + existing);
  }

  var key = keyPath[i];
  var nextExisting = wasNotSet ? NOT_SET : get(existing, key, NOT_SET);
  var nextUpdated = updateInDeeply(nextExisting === NOT_SET ? inImmutable : isImmutable(nextExisting), nextExisting, keyPath, i + 1, notSetValue, updater);
  return nextUpdated === nextExisting ? existing : nextUpdated === NOT_SET ? remove(existing, key) : set(wasNotSet ? inImmutable ? emptyMap() : {} : existing, key, nextUpdated);
}

function setIn(collection, keyPath, value) {
  return updateIn(collection, keyPath, NOT_SET, function () {
    return value;
  });
}

function setIn$1(keyPath, v) {
  return setIn(this, keyPath, v);
}

function removeIn(collection, keyPath) {
  return updateIn(collection, keyPath, function () {
    return NOT_SET;
  });
}

function deleteIn(keyPath) {
  return removeIn(this, keyPath);
}

function update(collection, key, notSetValue, updater) {
  return updateIn(collection, [key], notSetValue, updater);
}

function update$1(key, notSetValue, updater) {
  return arguments.length === 1 ? key(this) : update(this, key, notSetValue, updater);
}

function updateIn$1(keyPath, notSetValue, updater) {
  return updateIn(this, keyPath, notSetValue, updater);
}

function merge() {
  var iters = [],
      len = arguments.length;

  while (len--) iters[len] = arguments[len];

  return mergeIntoKeyedWith(this, iters);
}

function mergeWith(merger) {
  var iters = [],
      len = arguments.length - 1;

  while (len-- > 0) iters[len] = arguments[len + 1];

  if (typeof merger !== 'function') {
    throw new TypeError('Invalid merger function: ' + merger);
  }

  return mergeIntoKeyedWith(this, iters, merger);
}

function mergeIntoKeyedWith(collection, collections, merger) {
  var iters = [];

  for (var ii = 0; ii < collections.length; ii++) {
    var collection$1 = KeyedCollection(collections[ii]);

    if (collection$1.size !== 0) {
      iters.push(collection$1);
    }
  }

  if (iters.length === 0) {
    return collection;
  }

  if (collection.toSeq().size === 0 && !collection.__ownerID && iters.length === 1) {
    return collection.constructor(iters[0]);
  }

  return collection.withMutations(function (collection) {
    var mergeIntoCollection = merger ? function (value, key) {
      update(collection, key, NOT_SET, function (oldVal) {
        return oldVal === NOT_SET ? value : merger(oldVal, value, key);
      });
    } : function (value, key) {
      collection.set(key, value);
    };

    for (var ii = 0; ii < iters.length; ii++) {
      iters[ii].forEach(mergeIntoCollection);
    }
  });
}

function mergeDeepWithSources(collection, sources, merger) {
  return mergeWithSources(collection, sources, deepMergerWith(merger));
}

function mergeWithSources(collection, sources, merger) {
  if (!isDataStructure(collection)) {
    throw new TypeError('Cannot merge into non-data-structure value: ' + collection);
  }

  if (isImmutable(collection)) {
    return typeof merger === 'function' && collection.mergeWith ? collection.mergeWith.apply(collection, [merger].concat(sources)) : collection.merge ? collection.merge.apply(collection, sources) : collection.concat.apply(collection, sources);
  }

  var isArray = Array.isArray(collection);
  var merged = collection;
  var Collection$$1 = isArray ? IndexedCollection : KeyedCollection;
  var mergeItem = isArray ? function (value) {
    // Copy on write
    if (merged === collection) {
      merged = shallowCopy(merged);
    }

    merged.push(value);
  } : function (value, key) {
    var hasVal = hasOwnProperty.call(merged, key);
    var nextVal = hasVal && merger ? merger(merged[key], value, key) : value;

    if (!hasVal || nextVal !== merged[key]) {
      // Copy on write
      if (merged === collection) {
        merged = shallowCopy(merged);
      }

      merged[key] = nextVal;
    }
  };

  for (var i = 0; i < sources.length; i++) {
    Collection$$1(sources[i]).forEach(mergeItem);
  }

  return merged;
}

function deepMergerWith(merger) {
  function deepMerger(oldValue, newValue, key) {
    return isDataStructure(oldValue) && isDataStructure(newValue) ? mergeWithSources(oldValue, [newValue], deepMerger) : merger ? merger(oldValue, newValue, key) : newValue;
  }

  return deepMerger;
}

function mergeDeep$1() {
  var iters = [],
      len = arguments.length;

  while (len--) iters[len] = arguments[len];

  return mergeDeepWithSources(this, iters);
}

function mergeDeepWith$1(merger) {
  var iters = [],
      len = arguments.length - 1;

  while (len-- > 0) iters[len] = arguments[len + 1];

  return mergeDeepWithSources(this, iters, merger);
}

function mergeIn(keyPath) {
  var iters = [],
      len = arguments.length - 1;

  while (len-- > 0) iters[len] = arguments[len + 1];

  return updateIn(this, keyPath, emptyMap(), function (m) {
    return mergeWithSources(m, iters);
  });
}

function mergeDeepIn(keyPath) {
  var iters = [],
      len = arguments.length - 1;

  while (len-- > 0) iters[len] = arguments[len + 1];

  return updateIn(this, keyPath, emptyMap(), function (m) {
    return mergeDeepWithSources(m, iters);
  });
}

function withMutations(fn) {
  var mutable = this.asMutable();
  fn(mutable);
  return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
}

function asMutable() {
  return this.__ownerID ? this : this.__ensureOwner(new OwnerID());
}

function asImmutable() {
  return this.__ensureOwner();
}

function wasAltered() {
  return this.__altered;
}

var Map$1 =
/*@__PURE__*/
function (KeyedCollection$$1) {
  function Map(value) {
    return value === null || value === undefined ? emptyMap() : isMap(value) && !isOrdered(value) ? value : emptyMap().withMutations(function (map) {
      var iter = KeyedCollection$$1(value);
      assertNotInfinite(iter.size);
      iter.forEach(function (v, k) {
        return map.set(k, v);
      });
    });
  }

  if (KeyedCollection$$1) Map.__proto__ = KeyedCollection$$1;
  Map.prototype = Object.create(KeyedCollection$$1 && KeyedCollection$$1.prototype);
  Map.prototype.constructor = Map;

  Map.of = function of() {
    var keyValues = [],
        len = arguments.length;

    while (len--) keyValues[len] = arguments[len];

    return emptyMap().withMutations(function (map) {
      for (var i = 0; i < keyValues.length; i += 2) {
        if (i + 1 >= keyValues.length) {
          throw new Error('Missing value for key: ' + keyValues[i]);
        }

        map.set(keyValues[i], keyValues[i + 1]);
      }
    });
  };

  Map.prototype.toString = function toString() {
    return this.__toString('Map {', '}');
  }; // @pragma Access


  Map.prototype.get = function get(k, notSetValue) {
    return this._root ? this._root.get(0, undefined, k, notSetValue) : notSetValue;
  }; // @pragma Modification


  Map.prototype.set = function set(k, v) {
    return updateMap(this, k, v);
  };

  Map.prototype.remove = function remove(k) {
    return updateMap(this, k, NOT_SET);
  };

  Map.prototype.deleteAll = function deleteAll(keys) {
    var collection = Collection(keys);

    if (collection.size === 0) {
      return this;
    }

    return this.withMutations(function (map) {
      collection.forEach(function (key) {
        return map.remove(key);
      });
    });
  };

  Map.prototype.clear = function clear() {
    if (this.size === 0) {
      return this;
    }

    if (this.__ownerID) {
      this.size = 0;
      this._root = null;
      this.__hash = undefined;
      this.__altered = true;
      return this;
    }

    return emptyMap();
  }; // @pragma Composition


  Map.prototype.sort = function sort(comparator) {
    // Late binding
    return OrderedMap(sortFactory(this, comparator));
  };

  Map.prototype.sortBy = function sortBy(mapper, comparator) {
    // Late binding
    return OrderedMap(sortFactory(this, comparator, mapper));
  };

  Map.prototype.map = function map(mapper, context) {
    return this.withMutations(function (map) {
      map.forEach(function (value, key) {
        map.set(key, mapper.call(context, value, key, map));
      });
    });
  }; // @pragma Mutability


  Map.prototype.__iterator = function __iterator(type, reverse) {
    return new MapIterator(this, type, reverse);
  };

  Map.prototype.__iterate = function __iterate(fn, reverse) {
    var this$1 = this;
    var iterations = 0;
    this._root && this._root.iterate(function (entry) {
      iterations++;
      return fn(entry[1], entry[0], this$1);
    }, reverse);
    return iterations;
  };

  Map.prototype.__ensureOwner = function __ensureOwner(ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }

    if (!ownerID) {
      if (this.size === 0) {
        return emptyMap();
      }

      this.__ownerID = ownerID;
      this.__altered = false;
      return this;
    }

    return makeMap(this.size, this._root, ownerID, this.__hash);
  };

  return Map;
}(KeyedCollection);

Map$1.isMap = isMap;
var MapPrototype = Map$1.prototype;
MapPrototype[IS_MAP_SYMBOL] = true;
MapPrototype[DELETE] = MapPrototype.remove;
MapPrototype.removeAll = MapPrototype.deleteAll;
MapPrototype.setIn = setIn$1;
MapPrototype.removeIn = MapPrototype.deleteIn = deleteIn;
MapPrototype.update = update$1;
MapPrototype.updateIn = updateIn$1;
MapPrototype.merge = MapPrototype.concat = merge;
MapPrototype.mergeWith = mergeWith;
MapPrototype.mergeDeep = mergeDeep$1;
MapPrototype.mergeDeepWith = mergeDeepWith$1;
MapPrototype.mergeIn = mergeIn;
MapPrototype.mergeDeepIn = mergeDeepIn;
MapPrototype.withMutations = withMutations;
MapPrototype.wasAltered = wasAltered;
MapPrototype.asImmutable = asImmutable;
MapPrototype['@@transducer/init'] = MapPrototype.asMutable = asMutable;

MapPrototype['@@transducer/step'] = function (result, arr) {
  return result.set(arr[0], arr[1]);
};

MapPrototype['@@transducer/result'] = function (obj) {
  return obj.asImmutable();
}; // #pragma Trie Nodes


var ArrayMapNode = function ArrayMapNode(ownerID, entries) {
  this.ownerID = ownerID;
  this.entries = entries;
};

ArrayMapNode.prototype.get = function get(shift, keyHash, key, notSetValue) {
  var entries = this.entries;

  for (var ii = 0, len = entries.length; ii < len; ii++) {
    if (is(key, entries[ii][0])) {
      return entries[ii][1];
    }
  }

  return notSetValue;
};

ArrayMapNode.prototype.update = function update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
  var removed = value === NOT_SET;
  var entries = this.entries;
  var idx = 0;
  var len = entries.length;

  for (; idx < len; idx++) {
    if (is(key, entries[idx][0])) {
      break;
    }
  }

  var exists = idx < len;

  if (exists ? entries[idx][1] === value : removed) {
    return this;
  }

  SetRef(didAlter);
  (removed || !exists) && SetRef(didChangeSize);

  if (removed && entries.length === 1) {
    return; // undefined
  }

  if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
    return createNodes(ownerID, entries, key, value);
  }

  var isEditable = ownerID && ownerID === this.ownerID;
  var newEntries = isEditable ? entries : arrCopy(entries);

  if (exists) {
    if (removed) {
      idx === len - 1 ? newEntries.pop() : newEntries[idx] = newEntries.pop();
    } else {
      newEntries[idx] = [key, value];
    }
  } else {
    newEntries.push([key, value]);
  }

  if (isEditable) {
    this.entries = newEntries;
    return this;
  }

  return new ArrayMapNode(ownerID, newEntries);
};

var BitmapIndexedNode = function BitmapIndexedNode(ownerID, bitmap, nodes) {
  this.ownerID = ownerID;
  this.bitmap = bitmap;
  this.nodes = nodes;
};

BitmapIndexedNode.prototype.get = function get(shift, keyHash, key, notSetValue) {
  if (keyHash === undefined) {
    keyHash = hash(key);
  }

  var bit = 1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK);
  var bitmap = this.bitmap;
  return (bitmap & bit) === 0 ? notSetValue : this.nodes[popCount(bitmap & bit - 1)].get(shift + SHIFT, keyHash, key, notSetValue);
};

BitmapIndexedNode.prototype.update = function update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
  if (keyHash === undefined) {
    keyHash = hash(key);
  }

  var keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
  var bit = 1 << keyHashFrag;
  var bitmap = this.bitmap;
  var exists = (bitmap & bit) !== 0;

  if (!exists && value === NOT_SET) {
    return this;
  }

  var idx = popCount(bitmap & bit - 1);
  var nodes = this.nodes;
  var node = exists ? nodes[idx] : undefined;
  var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);

  if (newNode === node) {
    return this;
  }

  if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
    return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);
  }

  if (exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])) {
    return nodes[idx ^ 1];
  }

  if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
    return newNode;
  }

  var isEditable = ownerID && ownerID === this.ownerID;
  var newBitmap = exists ? newNode ? bitmap : bitmap ^ bit : bitmap | bit;
  var newNodes = exists ? newNode ? setAt(nodes, idx, newNode, isEditable) : spliceOut(nodes, idx, isEditable) : spliceIn(nodes, idx, newNode, isEditable);

  if (isEditable) {
    this.bitmap = newBitmap;
    this.nodes = newNodes;
    return this;
  }

  return new BitmapIndexedNode(ownerID, newBitmap, newNodes);
};

var HashArrayMapNode = function HashArrayMapNode(ownerID, count, nodes) {
  this.ownerID = ownerID;
  this.count = count;
  this.nodes = nodes;
};

HashArrayMapNode.prototype.get = function get(shift, keyHash, key, notSetValue) {
  if (keyHash === undefined) {
    keyHash = hash(key);
  }

  var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
  var node = this.nodes[idx];
  return node ? node.get(shift + SHIFT, keyHash, key, notSetValue) : notSetValue;
};

HashArrayMapNode.prototype.update = function update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
  if (keyHash === undefined) {
    keyHash = hash(key);
  }

  var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
  var removed = value === NOT_SET;
  var nodes = this.nodes;
  var node = nodes[idx];

  if (removed && !node) {
    return this;
  }

  var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);

  if (newNode === node) {
    return this;
  }

  var newCount = this.count;

  if (!node) {
    newCount++;
  } else if (!newNode) {
    newCount--;

    if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
      return packNodes(ownerID, nodes, newCount, idx);
    }
  }

  var isEditable = ownerID && ownerID === this.ownerID;
  var newNodes = setAt(nodes, idx, newNode, isEditable);

  if (isEditable) {
    this.count = newCount;
    this.nodes = newNodes;
    return this;
  }

  return new HashArrayMapNode(ownerID, newCount, newNodes);
};

var HashCollisionNode = function HashCollisionNode(ownerID, keyHash, entries) {
  this.ownerID = ownerID;
  this.keyHash = keyHash;
  this.entries = entries;
};

HashCollisionNode.prototype.get = function get(shift, keyHash, key, notSetValue) {
  var entries = this.entries;

  for (var ii = 0, len = entries.length; ii < len; ii++) {
    if (is(key, entries[ii][0])) {
      return entries[ii][1];
    }
  }

  return notSetValue;
};

HashCollisionNode.prototype.update = function update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
  if (keyHash === undefined) {
    keyHash = hash(key);
  }

  var removed = value === NOT_SET;

  if (keyHash !== this.keyHash) {
    if (removed) {
      return this;
    }

    SetRef(didAlter);
    SetRef(didChangeSize);
    return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);
  }

  var entries = this.entries;
  var idx = 0;
  var len = entries.length;

  for (; idx < len; idx++) {
    if (is(key, entries[idx][0])) {
      break;
    }
  }

  var exists = idx < len;

  if (exists ? entries[idx][1] === value : removed) {
    return this;
  }

  SetRef(didAlter);
  (removed || !exists) && SetRef(didChangeSize);

  if (removed && len === 2) {
    return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);
  }

  var isEditable = ownerID && ownerID === this.ownerID;
  var newEntries = isEditable ? entries : arrCopy(entries);

  if (exists) {
    if (removed) {
      idx === len - 1 ? newEntries.pop() : newEntries[idx] = newEntries.pop();
    } else {
      newEntries[idx] = [key, value];
    }
  } else {
    newEntries.push([key, value]);
  }

  if (isEditable) {
    this.entries = newEntries;
    return this;
  }

  return new HashCollisionNode(ownerID, this.keyHash, newEntries);
};

var ValueNode = function ValueNode(ownerID, keyHash, entry) {
  this.ownerID = ownerID;
  this.keyHash = keyHash;
  this.entry = entry;
};

ValueNode.prototype.get = function get(shift, keyHash, key, notSetValue) {
  return is(key, this.entry[0]) ? this.entry[1] : notSetValue;
};

ValueNode.prototype.update = function update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
  var removed = value === NOT_SET;
  var keyMatch = is(key, this.entry[0]);

  if (keyMatch ? value === this.entry[1] : removed) {
    return this;
  }

  SetRef(didAlter);

  if (removed) {
    SetRef(didChangeSize);
    return; // undefined
  }

  if (keyMatch) {
    if (ownerID && ownerID === this.ownerID) {
      this.entry[1] = value;
      return this;
    }

    return new ValueNode(ownerID, this.keyHash, [key, value]);
  }

  SetRef(didChangeSize);
  return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);
}; // #pragma Iterators


ArrayMapNode.prototype.iterate = HashCollisionNode.prototype.iterate = function (fn, reverse) {
  var entries = this.entries;

  for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
    if (fn(entries[reverse ? maxIndex - ii : ii]) === false) {
      return false;
    }
  }
};

BitmapIndexedNode.prototype.iterate = HashArrayMapNode.prototype.iterate = function (fn, reverse) {
  var nodes = this.nodes;

  for (var ii = 0, maxIndex = nodes.length - 1; ii <= maxIndex; ii++) {
    var node = nodes[reverse ? maxIndex - ii : ii];

    if (node && node.iterate(fn, reverse) === false) {
      return false;
    }
  }
}; // eslint-disable-next-line no-unused-vars


ValueNode.prototype.iterate = function (fn, reverse) {
  return fn(this.entry);
};

var MapIterator =
/*@__PURE__*/
function (Iterator$$1) {
  function MapIterator(map, type, reverse) {
    this._type = type;
    this._reverse = reverse;
    this._stack = map._root && mapIteratorFrame(map._root);
  }

  if (Iterator$$1) MapIterator.__proto__ = Iterator$$1;
  MapIterator.prototype = Object.create(Iterator$$1 && Iterator$$1.prototype);
  MapIterator.prototype.constructor = MapIterator;

  MapIterator.prototype.next = function next() {
    var type = this._type;
    var stack = this._stack;

    while (stack) {
      var node = stack.node;
      var index = stack.index++;
      var maxIndex = void 0;

      if (node.entry) {
        if (index === 0) {
          return mapIteratorValue(type, node.entry);
        }
      } else if (node.entries) {
        maxIndex = node.entries.length - 1;

        if (index <= maxIndex) {
          return mapIteratorValue(type, node.entries[this._reverse ? maxIndex - index : index]);
        }
      } else {
        maxIndex = node.nodes.length - 1;

        if (index <= maxIndex) {
          var subNode = node.nodes[this._reverse ? maxIndex - index : index];

          if (subNode) {
            if (subNode.entry) {
              return mapIteratorValue(type, subNode.entry);
            }

            stack = this._stack = mapIteratorFrame(subNode, stack);
          }

          continue;
        }
      }

      stack = this._stack = this._stack.__prev;
    }

    return iteratorDone();
  };

  return MapIterator;
}(Iterator);

function mapIteratorValue(type, entry) {
  return iteratorValue(type, entry[0], entry[1]);
}

function mapIteratorFrame(node, prev) {
  return {
    node: node,
    index: 0,
    __prev: prev
  };
}

function makeMap(size, root, ownerID, hash$$1) {
  var map = Object.create(MapPrototype);
  map.size = size;
  map._root = root;
  map.__ownerID = ownerID;
  map.__hash = hash$$1;
  map.__altered = false;
  return map;
}

var EMPTY_MAP;

function emptyMap() {
  return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
}

function updateMap(map, k, v) {
  var newRoot;
  var newSize;

  if (!map._root) {
    if (v === NOT_SET) {
      return map;
    }

    newSize = 1;
    newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
  } else {
    var didChangeSize = MakeRef();
    var didAlter = MakeRef();
    newRoot = updateNode(map._root, map.__ownerID, 0, undefined, k, v, didChangeSize, didAlter);

    if (!didAlter.value) {
      return map;
    }

    newSize = map.size + (didChangeSize.value ? v === NOT_SET ? -1 : 1 : 0);
  }

  if (map.__ownerID) {
    map.size = newSize;
    map._root = newRoot;
    map.__hash = undefined;
    map.__altered = true;
    return map;
  }

  return newRoot ? makeMap(newSize, newRoot) : emptyMap();
}

function updateNode(node, ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
  if (!node) {
    if (value === NOT_SET) {
      return node;
    }

    SetRef(didAlter);
    SetRef(didChangeSize);
    return new ValueNode(ownerID, keyHash, [key, value]);
  }

  return node.update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter);
}

function isLeafNode(node) {
  return node.constructor === ValueNode || node.constructor === HashCollisionNode;
}

function mergeIntoNode(node, ownerID, shift, keyHash, entry) {
  if (node.keyHash === keyHash) {
    return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);
  }

  var idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
  var idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
  var newNode;
  var nodes = idx1 === idx2 ? [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)] : (newNode = new ValueNode(ownerID, keyHash, entry), idx1 < idx2 ? [node, newNode] : [newNode, node]);
  return new BitmapIndexedNode(ownerID, 1 << idx1 | 1 << idx2, nodes);
}

function createNodes(ownerID, entries, key, value) {
  if (!ownerID) {
    ownerID = new OwnerID();
  }

  var node = new ValueNode(ownerID, hash(key), [key, value]);

  for (var ii = 0; ii < entries.length; ii++) {
    var entry = entries[ii];
    node = node.update(ownerID, 0, undefined, entry[0], entry[1]);
  }

  return node;
}

function packNodes(ownerID, nodes, count, excluding) {
  var bitmap = 0;
  var packedII = 0;
  var packedNodes = new Array(count);

  for (var ii = 0, bit = 1, len = nodes.length; ii < len; ii++, bit <<= 1) {
    var node = nodes[ii];

    if (node !== undefined && ii !== excluding) {
      bitmap |= bit;
      packedNodes[packedII++] = node;
    }
  }

  return new BitmapIndexedNode(ownerID, bitmap, packedNodes);
}

function expandNodes(ownerID, nodes, bitmap, including, node) {
  var count = 0;
  var expandedNodes = new Array(SIZE);

  for (var ii = 0; bitmap !== 0; ii++, bitmap >>>= 1) {
    expandedNodes[ii] = bitmap & 1 ? nodes[count++] : undefined;
  }

  expandedNodes[including] = node;
  return new HashArrayMapNode(ownerID, count + 1, expandedNodes);
}

function popCount(x) {
  x -= x >> 1 & 0x55555555;
  x = (x & 0x33333333) + (x >> 2 & 0x33333333);
  x = x + (x >> 4) & 0x0f0f0f0f;
  x += x >> 8;
  x += x >> 16;
  return x & 0x7f;
}

function setAt(array, idx, val, canEdit) {
  var newArray = canEdit ? array : arrCopy(array);
  newArray[idx] = val;
  return newArray;
}

function spliceIn(array, idx, val, canEdit) {
  var newLen = array.length + 1;

  if (canEdit && idx + 1 === newLen) {
    array[idx] = val;
    return array;
  }

  var newArray = new Array(newLen);
  var after = 0;

  for (var ii = 0; ii < newLen; ii++) {
    if (ii === idx) {
      newArray[ii] = val;
      after = -1;
    } else {
      newArray[ii] = array[ii + after];
    }
  }

  return newArray;
}

function spliceOut(array, idx, canEdit) {
  var newLen = array.length - 1;

  if (canEdit && idx === newLen) {
    array.pop();
    return array;
  }

  var newArray = new Array(newLen);
  var after = 0;

  for (var ii = 0; ii < newLen; ii++) {
    if (ii === idx) {
      after = 1;
    }

    newArray[ii] = array[ii + after];
  }

  return newArray;
}

var MAX_ARRAY_MAP_SIZE = SIZE / 4;
var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;
var IS_LIST_SYMBOL = '@@__IMMUTABLE_LIST__@@';

function isList(maybeList) {
  return Boolean(maybeList && maybeList[IS_LIST_SYMBOL]);
}

var List =
/*@__PURE__*/
function (IndexedCollection$$1) {
  function List(value) {
    var empty = emptyList();

    if (value === null || value === undefined) {
      return empty;
    }

    if (isList(value)) {
      return value;
    }

    var iter = IndexedCollection$$1(value);
    var size = iter.size;

    if (size === 0) {
      return empty;
    }

    assertNotInfinite(size);

    if (size > 0 && size < SIZE) {
      return makeList(0, size, SHIFT, null, new VNode(iter.toArray()));
    }

    return empty.withMutations(function (list) {
      list.setSize(size);
      iter.forEach(function (v, i) {
        return list.set(i, v);
      });
    });
  }

  if (IndexedCollection$$1) List.__proto__ = IndexedCollection$$1;
  List.prototype = Object.create(IndexedCollection$$1 && IndexedCollection$$1.prototype);
  List.prototype.constructor = List;

  List.of = function of()
  /*...values*/
  {
    return this(arguments);
  };

  List.prototype.toString = function toString() {
    return this.__toString('List [', ']');
  }; // @pragma Access


  List.prototype.get = function get(index, notSetValue) {
    index = wrapIndex(this, index);

    if (index >= 0 && index < this.size) {
      index += this._origin;
      var node = listNodeFor(this, index);
      return node && node.array[index & MASK];
    }

    return notSetValue;
  }; // @pragma Modification


  List.prototype.set = function set(index, value) {
    return updateList(this, index, value);
  };

  List.prototype.remove = function remove(index) {
    return !this.has(index) ? this : index === 0 ? this.shift() : index === this.size - 1 ? this.pop() : this.splice(index, 1);
  };

  List.prototype.insert = function insert(index, value) {
    return this.splice(index, 0, value);
  };

  List.prototype.clear = function clear() {
    if (this.size === 0) {
      return this;
    }

    if (this.__ownerID) {
      this.size = this._origin = this._capacity = 0;
      this._level = SHIFT;
      this._root = this._tail = null;
      this.__hash = undefined;
      this.__altered = true;
      return this;
    }

    return emptyList();
  };

  List.prototype.push = function push()
  /*...values*/
  {
    var values = arguments;
    var oldSize = this.size;
    return this.withMutations(function (list) {
      setListBounds(list, 0, oldSize + values.length);

      for (var ii = 0; ii < values.length; ii++) {
        list.set(oldSize + ii, values[ii]);
      }
    });
  };

  List.prototype.pop = function pop() {
    return setListBounds(this, 0, -1);
  };

  List.prototype.unshift = function unshift()
  /*...values*/
  {
    var values = arguments;
    return this.withMutations(function (list) {
      setListBounds(list, -values.length);

      for (var ii = 0; ii < values.length; ii++) {
        list.set(ii, values[ii]);
      }
    });
  };

  List.prototype.shift = function shift() {
    return setListBounds(this, 1);
  }; // @pragma Composition


  List.prototype.concat = function concat()
  /*...collections*/
  {
    var arguments$1 = arguments;
    var seqs = [];

    for (var i = 0; i < arguments.length; i++) {
      var argument = arguments$1[i];
      var seq = IndexedCollection$$1(typeof argument !== 'string' && hasIterator(argument) ? argument : [argument]);

      if (seq.size !== 0) {
        seqs.push(seq);
      }
    }

    if (seqs.length === 0) {
      return this;
    }

    if (this.size === 0 && !this.__ownerID && seqs.length === 1) {
      return this.constructor(seqs[0]);
    }

    return this.withMutations(function (list) {
      seqs.forEach(function (seq) {
        return seq.forEach(function (value) {
          return list.push(value);
        });
      });
    });
  };

  List.prototype.setSize = function setSize(size) {
    return setListBounds(this, 0, size);
  };

  List.prototype.map = function map(mapper, context) {
    var this$1 = this;
    return this.withMutations(function (list) {
      for (var i = 0; i < this$1.size; i++) {
        list.set(i, mapper.call(context, list.get(i), i, list));
      }
    });
  }; // @pragma Iteration


  List.prototype.slice = function slice(begin, end) {
    var size = this.size;

    if (wholeSlice(begin, end, size)) {
      return this;
    }

    return setListBounds(this, resolveBegin(begin, size), resolveEnd(end, size));
  };

  List.prototype.__iterator = function __iterator(type, reverse) {
    var index = reverse ? this.size : 0;
    var values = iterateList(this, reverse);
    return new Iterator(function () {
      var value = values();
      return value === DONE ? iteratorDone() : iteratorValue(type, reverse ? --index : index++, value);
    });
  };

  List.prototype.__iterate = function __iterate(fn, reverse) {
    var index = reverse ? this.size : 0;
    var values = iterateList(this, reverse);
    var value;

    while ((value = values()) !== DONE) {
      if (fn(value, reverse ? --index : index++, this) === false) {
        break;
      }
    }

    return index;
  };

  List.prototype.__ensureOwner = function __ensureOwner(ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }

    if (!ownerID) {
      if (this.size === 0) {
        return emptyList();
      }

      this.__ownerID = ownerID;
      this.__altered = false;
      return this;
    }

    return makeList(this._origin, this._capacity, this._level, this._root, this._tail, ownerID, this.__hash);
  };

  return List;
}(IndexedCollection);

List.isList = isList;
var ListPrototype = List.prototype;
ListPrototype[IS_LIST_SYMBOL] = true;
ListPrototype[DELETE] = ListPrototype.remove;
ListPrototype.merge = ListPrototype.concat;
ListPrototype.setIn = setIn$1;
ListPrototype.deleteIn = ListPrototype.removeIn = deleteIn;
ListPrototype.update = update$1;
ListPrototype.updateIn = updateIn$1;
ListPrototype.mergeIn = mergeIn;
ListPrototype.mergeDeepIn = mergeDeepIn;
ListPrototype.withMutations = withMutations;
ListPrototype.wasAltered = wasAltered;
ListPrototype.asImmutable = asImmutable;
ListPrototype['@@transducer/init'] = ListPrototype.asMutable = asMutable;

ListPrototype['@@transducer/step'] = function (result, arr) {
  return result.push(arr);
};

ListPrototype['@@transducer/result'] = function (obj) {
  return obj.asImmutable();
};

var VNode = function VNode(array, ownerID) {
  this.array = array;
  this.ownerID = ownerID;
}; // TODO: seems like these methods are very similar


VNode.prototype.removeBefore = function removeBefore(ownerID, level, index) {
  if (index === level ? 1 << level : this.array.length === 0) {
    return this;
  }

  var originIndex = index >>> level & MASK;

  if (originIndex >= this.array.length) {
    return new VNode([], ownerID);
  }

  var removingFirst = originIndex === 0;
  var newChild;

  if (level > 0) {
    var oldChild = this.array[originIndex];
    newChild = oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);

    if (newChild === oldChild && removingFirst) {
      return this;
    }
  }

  if (removingFirst && !newChild) {
    return this;
  }

  var editable = editableVNode(this, ownerID);

  if (!removingFirst) {
    for (var ii = 0; ii < originIndex; ii++) {
      editable.array[ii] = undefined;
    }
  }

  if (newChild) {
    editable.array[originIndex] = newChild;
  }

  return editable;
};

VNode.prototype.removeAfter = function removeAfter(ownerID, level, index) {
  if (index === (level ? 1 << level : 0) || this.array.length === 0) {
    return this;
  }

  var sizeIndex = index - 1 >>> level & MASK;

  if (sizeIndex >= this.array.length) {
    return this;
  }

  var newChild;

  if (level > 0) {
    var oldChild = this.array[sizeIndex];
    newChild = oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);

    if (newChild === oldChild && sizeIndex === this.array.length - 1) {
      return this;
    }
  }

  var editable = editableVNode(this, ownerID);
  editable.array.splice(sizeIndex + 1);

  if (newChild) {
    editable.array[sizeIndex] = newChild;
  }

  return editable;
};

var DONE = {};

function iterateList(list, reverse) {
  var left = list._origin;
  var right = list._capacity;
  var tailPos = getTailOffset(right);
  var tail = list._tail;
  return iterateNodeOrLeaf(list._root, list._level, 0);

  function iterateNodeOrLeaf(node, level, offset) {
    return level === 0 ? iterateLeaf(node, offset) : iterateNode(node, level, offset);
  }

  function iterateLeaf(node, offset) {
    var array = offset === tailPos ? tail && tail.array : node && node.array;
    var from = offset > left ? 0 : left - offset;
    var to = right - offset;

    if (to > SIZE) {
      to = SIZE;
    }

    return function () {
      if (from === to) {
        return DONE;
      }

      var idx = reverse ? --to : from++;
      return array && array[idx];
    };
  }

  function iterateNode(node, level, offset) {
    var values;
    var array = node && node.array;
    var from = offset > left ? 0 : left - offset >> level;
    var to = (right - offset >> level) + 1;

    if (to > SIZE) {
      to = SIZE;
    }

    return function () {
      while (true) {
        if (values) {
          var value = values();

          if (value !== DONE) {
            return value;
          }

          values = null;
        }

        if (from === to) {
          return DONE;
        }

        var idx = reverse ? --to : from++;
        values = iterateNodeOrLeaf(array && array[idx], level - SHIFT, offset + (idx << level));
      }
    };
  }
}

function makeList(origin, capacity, level, root, tail, ownerID, hash) {
  var list = Object.create(ListPrototype);
  list.size = capacity - origin;
  list._origin = origin;
  list._capacity = capacity;
  list._level = level;
  list._root = root;
  list._tail = tail;
  list.__ownerID = ownerID;
  list.__hash = hash;
  list.__altered = false;
  return list;
}

var EMPTY_LIST;

function emptyList() {
  return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));
}

function updateList(list, index, value) {
  index = wrapIndex(list, index);

  if (index !== index) {
    return list;
  }

  if (index >= list.size || index < 0) {
    return list.withMutations(function (list) {
      index < 0 ? setListBounds(list, index).set(0, value) : setListBounds(list, 0, index + 1).set(index, value);
    });
  }

  index += list._origin;
  var newTail = list._tail;
  var newRoot = list._root;
  var didAlter = MakeRef();

  if (index >= getTailOffset(list._capacity)) {
    newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);
  } else {
    newRoot = updateVNode(newRoot, list.__ownerID, list._level, index, value, didAlter);
  }

  if (!didAlter.value) {
    return list;
  }

  if (list.__ownerID) {
    list._root = newRoot;
    list._tail = newTail;
    list.__hash = undefined;
    list.__altered = true;
    return list;
  }

  return makeList(list._origin, list._capacity, list._level, newRoot, newTail);
}

function updateVNode(node, ownerID, level, index, value, didAlter) {
  var idx = index >>> level & MASK;
  var nodeHas = node && idx < node.array.length;

  if (!nodeHas && value === undefined) {
    return node;
  }

  var newNode;

  if (level > 0) {
    var lowerNode = node && node.array[idx];
    var newLowerNode = updateVNode(lowerNode, ownerID, level - SHIFT, index, value, didAlter);

    if (newLowerNode === lowerNode) {
      return node;
    }

    newNode = editableVNode(node, ownerID);
    newNode.array[idx] = newLowerNode;
    return newNode;
  }

  if (nodeHas && node.array[idx] === value) {
    return node;
  }

  if (didAlter) {
    SetRef(didAlter);
  }

  newNode = editableVNode(node, ownerID);

  if (value === undefined && idx === newNode.array.length - 1) {
    newNode.array.pop();
  } else {
    newNode.array[idx] = value;
  }

  return newNode;
}

function editableVNode(node, ownerID) {
  if (ownerID && node && ownerID === node.ownerID) {
    return node;
  }

  return new VNode(node ? node.array.slice() : [], ownerID);
}

function listNodeFor(list, rawIndex) {
  if (rawIndex >= getTailOffset(list._capacity)) {
    return list._tail;
  }

  if (rawIndex < 1 << list._level + SHIFT) {
    var node = list._root;
    var level = list._level;

    while (node && level > 0) {
      node = node.array[rawIndex >>> level & MASK];
      level -= SHIFT;
    }

    return node;
  }
}

function setListBounds(list, begin, end) {
  // Sanitize begin & end using this shorthand for ToInt32(argument)
  // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
  if (begin !== undefined) {
    begin |= 0;
  }

  if (end !== undefined) {
    end |= 0;
  }

  var owner = list.__ownerID || new OwnerID();
  var oldOrigin = list._origin;
  var oldCapacity = list._capacity;
  var newOrigin = oldOrigin + begin;
  var newCapacity = end === undefined ? oldCapacity : end < 0 ? oldCapacity + end : oldOrigin + end;

  if (newOrigin === oldOrigin && newCapacity === oldCapacity) {
    return list;
  } // If it's going to end after it starts, it's empty.


  if (newOrigin >= newCapacity) {
    return list.clear();
  }

  var newLevel = list._level;
  var newRoot = list._root; // New origin might need creating a higher root.

  var offsetShift = 0;

  while (newOrigin + offsetShift < 0) {
    newRoot = new VNode(newRoot && newRoot.array.length ? [undefined, newRoot] : [], owner);
    newLevel += SHIFT;
    offsetShift += 1 << newLevel;
  }

  if (offsetShift) {
    newOrigin += offsetShift;
    oldOrigin += offsetShift;
    newCapacity += offsetShift;
    oldCapacity += offsetShift;
  }

  var oldTailOffset = getTailOffset(oldCapacity);
  var newTailOffset = getTailOffset(newCapacity); // New size might need creating a higher root.

  while (newTailOffset >= 1 << newLevel + SHIFT) {
    newRoot = new VNode(newRoot && newRoot.array.length ? [newRoot] : [], owner);
    newLevel += SHIFT;
  } // Locate or create the new tail.


  var oldTail = list._tail;
  var newTail = newTailOffset < oldTailOffset ? listNodeFor(list, newCapacity - 1) : newTailOffset > oldTailOffset ? new VNode([], owner) : oldTail; // Merge Tail into tree.

  if (oldTail && newTailOffset > oldTailOffset && newOrigin < oldCapacity && oldTail.array.length) {
    newRoot = editableVNode(newRoot, owner);
    var node = newRoot;

    for (var level = newLevel; level > SHIFT; level -= SHIFT) {
      var idx = oldTailOffset >>> level & MASK;
      node = node.array[idx] = editableVNode(node.array[idx], owner);
    }

    node.array[oldTailOffset >>> SHIFT & MASK] = oldTail;
  } // If the size has been reduced, there's a chance the tail needs to be trimmed.


  if (newCapacity < oldCapacity) {
    newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);
  } // If the new origin is within the tail, then we do not need a root.


  if (newOrigin >= newTailOffset) {
    newOrigin -= newTailOffset;
    newCapacity -= newTailOffset;
    newLevel = SHIFT;
    newRoot = null;
    newTail = newTail && newTail.removeBefore(owner, 0, newOrigin); // Otherwise, if the root has been trimmed, garbage collect.
  } else if (newOrigin > oldOrigin || newTailOffset < oldTailOffset) {
    offsetShift = 0; // Identify the new top root node of the subtree of the old root.

    while (newRoot) {
      var beginIndex = newOrigin >>> newLevel & MASK;

      if (beginIndex !== newTailOffset >>> newLevel & MASK) {
        break;
      }

      if (beginIndex) {
        offsetShift += (1 << newLevel) * beginIndex;
      }

      newLevel -= SHIFT;
      newRoot = newRoot.array[beginIndex];
    } // Trim the new sides of the new root.


    if (newRoot && newOrigin > oldOrigin) {
      newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);
    }

    if (newRoot && newTailOffset < oldTailOffset) {
      newRoot = newRoot.removeAfter(owner, newLevel, newTailOffset - offsetShift);
    }

    if (offsetShift) {
      newOrigin -= offsetShift;
      newCapacity -= offsetShift;
    }
  }

  if (list.__ownerID) {
    list.size = newCapacity - newOrigin;
    list._origin = newOrigin;
    list._capacity = newCapacity;
    list._level = newLevel;
    list._root = newRoot;
    list._tail = newTail;
    list.__hash = undefined;
    list.__altered = true;
    return list;
  }

  return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);
}

function getTailOffset(size) {
  return size < SIZE ? 0 : size - 1 >>> SHIFT << SHIFT;
}

var OrderedMap =
/*@__PURE__*/
function (Map$$1) {
  function OrderedMap(value) {
    return value === null || value === undefined ? emptyOrderedMap() : isOrderedMap(value) ? value : emptyOrderedMap().withMutations(function (map) {
      var iter = KeyedCollection(value);
      assertNotInfinite(iter.size);
      iter.forEach(function (v, k) {
        return map.set(k, v);
      });
    });
  }

  if (Map$$1) OrderedMap.__proto__ = Map$$1;
  OrderedMap.prototype = Object.create(Map$$1 && Map$$1.prototype);
  OrderedMap.prototype.constructor = OrderedMap;

  OrderedMap.of = function of()
  /*...values*/
  {
    return this(arguments);
  };

  OrderedMap.prototype.toString = function toString() {
    return this.__toString('OrderedMap {', '}');
  }; // @pragma Access


  OrderedMap.prototype.get = function get(k, notSetValue) {
    var index = this._map.get(k);

    return index !== undefined ? this._list.get(index)[1] : notSetValue;
  }; // @pragma Modification


  OrderedMap.prototype.clear = function clear() {
    if (this.size === 0) {
      return this;
    }

    if (this.__ownerID) {
      this.size = 0;

      this._map.clear();

      this._list.clear();

      return this;
    }

    return emptyOrderedMap();
  };

  OrderedMap.prototype.set = function set(k, v) {
    return updateOrderedMap(this, k, v);
  };

  OrderedMap.prototype.remove = function remove(k) {
    return updateOrderedMap(this, k, NOT_SET);
  };

  OrderedMap.prototype.wasAltered = function wasAltered() {
    return this._map.wasAltered() || this._list.wasAltered();
  };

  OrderedMap.prototype.__iterate = function __iterate(fn, reverse) {
    var this$1 = this;
    return this._list.__iterate(function (entry) {
      return entry && fn(entry[1], entry[0], this$1);
    }, reverse);
  };

  OrderedMap.prototype.__iterator = function __iterator(type, reverse) {
    return this._list.fromEntrySeq().__iterator(type, reverse);
  };

  OrderedMap.prototype.__ensureOwner = function __ensureOwner(ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }

    var newMap = this._map.__ensureOwner(ownerID);

    var newList = this._list.__ensureOwner(ownerID);

    if (!ownerID) {
      if (this.size === 0) {
        return emptyOrderedMap();
      }

      this.__ownerID = ownerID;
      this._map = newMap;
      this._list = newList;
      return this;
    }

    return makeOrderedMap(newMap, newList, ownerID, this.__hash);
  };

  return OrderedMap;
}(Map$1);

OrderedMap.isOrderedMap = isOrderedMap;
OrderedMap.prototype[IS_ORDERED_SYMBOL] = true;
OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;

function makeOrderedMap(map, list, ownerID, hash) {
  var omap = Object.create(OrderedMap.prototype);
  omap.size = map ? map.size : 0;
  omap._map = map;
  omap._list = list;
  omap.__ownerID = ownerID;
  omap.__hash = hash;
  return omap;
}

var EMPTY_ORDERED_MAP;

function emptyOrderedMap() {
  return EMPTY_ORDERED_MAP || (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()));
}

function updateOrderedMap(omap, k, v) {
  var map = omap._map;
  var list = omap._list;
  var i = map.get(k);
  var has = i !== undefined;
  var newMap;
  var newList;

  if (v === NOT_SET) {
    // removed
    if (!has) {
      return omap;
    }

    if (list.size >= SIZE && list.size >= map.size * 2) {
      newList = list.filter(function (entry, idx) {
        return entry !== undefined && i !== idx;
      });
      newMap = newList.toKeyedSeq().map(function (entry) {
        return entry[0];
      }).flip().toMap();

      if (omap.__ownerID) {
        newMap.__ownerID = newList.__ownerID = omap.__ownerID;
      }
    } else {
      newMap = map.remove(k);
      newList = i === list.size - 1 ? list.pop() : list.set(i, undefined);
    }
  } else if (has) {
    if (v === list.get(i)[1]) {
      return omap;
    }

    newMap = map;
    newList = list.set(i, [k, v]);
  } else {
    newMap = map.set(k, list.size);
    newList = list.set(list.size, [k, v]);
  }

  if (omap.__ownerID) {
    omap.size = newMap.size;
    omap._map = newMap;
    omap._list = newList;
    omap.__hash = undefined;
    return omap;
  }

  return makeOrderedMap(newMap, newList);
}

var IS_STACK_SYMBOL = '@@__IMMUTABLE_STACK__@@';

function isStack(maybeStack) {
  return Boolean(maybeStack && maybeStack[IS_STACK_SYMBOL]);
}

var Stack =
/*@__PURE__*/
function (IndexedCollection$$1) {
  function Stack(value) {
    return value === null || value === undefined ? emptyStack() : isStack(value) ? value : emptyStack().pushAll(value);
  }

  if (IndexedCollection$$1) Stack.__proto__ = IndexedCollection$$1;
  Stack.prototype = Object.create(IndexedCollection$$1 && IndexedCollection$$1.prototype);
  Stack.prototype.constructor = Stack;

  Stack.of = function of()
  /*...values*/
  {
    return this(arguments);
  };

  Stack.prototype.toString = function toString() {
    return this.__toString('Stack [', ']');
  }; // @pragma Access


  Stack.prototype.get = function get(index, notSetValue) {
    var head = this._head;
    index = wrapIndex(this, index);

    while (head && index--) {
      head = head.next;
    }

    return head ? head.value : notSetValue;
  };

  Stack.prototype.peek = function peek() {
    return this._head && this._head.value;
  }; // @pragma Modification


  Stack.prototype.push = function push()
  /*...values*/
  {
    var arguments$1 = arguments;

    if (arguments.length === 0) {
      return this;
    }

    var newSize = this.size + arguments.length;
    var head = this._head;

    for (var ii = arguments.length - 1; ii >= 0; ii--) {
      head = {
        value: arguments$1[ii],
        next: head
      };
    }

    if (this.__ownerID) {
      this.size = newSize;
      this._head = head;
      this.__hash = undefined;
      this.__altered = true;
      return this;
    }

    return makeStack(newSize, head);
  };

  Stack.prototype.pushAll = function pushAll(iter) {
    iter = IndexedCollection$$1(iter);

    if (iter.size === 0) {
      return this;
    }

    if (this.size === 0 && isStack(iter)) {
      return iter;
    }

    assertNotInfinite(iter.size);
    var newSize = this.size;
    var head = this._head;

    iter.__iterate(function (value) {
      newSize++;
      head = {
        value: value,
        next: head
      };
    },
    /* reverse */
    true);

    if (this.__ownerID) {
      this.size = newSize;
      this._head = head;
      this.__hash = undefined;
      this.__altered = true;
      return this;
    }

    return makeStack(newSize, head);
  };

  Stack.prototype.pop = function pop() {
    return this.slice(1);
  };

  Stack.prototype.clear = function clear() {
    if (this.size === 0) {
      return this;
    }

    if (this.__ownerID) {
      this.size = 0;
      this._head = undefined;
      this.__hash = undefined;
      this.__altered = true;
      return this;
    }

    return emptyStack();
  };

  Stack.prototype.slice = function slice(begin, end) {
    if (wholeSlice(begin, end, this.size)) {
      return this;
    }

    var resolvedBegin = resolveBegin(begin, this.size);
    var resolvedEnd = resolveEnd(end, this.size);

    if (resolvedEnd !== this.size) {
      // super.slice(begin, end);
      return IndexedCollection$$1.prototype.slice.call(this, begin, end);
    }

    var newSize = this.size - resolvedBegin;
    var head = this._head;

    while (resolvedBegin--) {
      head = head.next;
    }

    if (this.__ownerID) {
      this.size = newSize;
      this._head = head;
      this.__hash = undefined;
      this.__altered = true;
      return this;
    }

    return makeStack(newSize, head);
  }; // @pragma Mutability


  Stack.prototype.__ensureOwner = function __ensureOwner(ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }

    if (!ownerID) {
      if (this.size === 0) {
        return emptyStack();
      }

      this.__ownerID = ownerID;
      this.__altered = false;
      return this;
    }

    return makeStack(this.size, this._head, ownerID, this.__hash);
  }; // @pragma Iteration


  Stack.prototype.__iterate = function __iterate(fn, reverse) {
    var this$1 = this;

    if (reverse) {
      return new ArraySeq(this.toArray()).__iterate(function (v, k) {
        return fn(v, k, this$1);
      }, reverse);
    }

    var iterations = 0;
    var node = this._head;

    while (node) {
      if (fn(node.value, iterations++, this) === false) {
        break;
      }

      node = node.next;
    }

    return iterations;
  };

  Stack.prototype.__iterator = function __iterator(type, reverse) {
    if (reverse) {
      return new ArraySeq(this.toArray()).__iterator(type, reverse);
    }

    var iterations = 0;
    var node = this._head;
    return new Iterator(function () {
      if (node) {
        var value = node.value;
        node = node.next;
        return iteratorValue(type, iterations++, value);
      }

      return iteratorDone();
    });
  };

  return Stack;
}(IndexedCollection);

Stack.isStack = isStack;
var StackPrototype = Stack.prototype;
StackPrototype[IS_STACK_SYMBOL] = true;
StackPrototype.shift = StackPrototype.pop;
StackPrototype.unshift = StackPrototype.push;
StackPrototype.unshiftAll = StackPrototype.pushAll;
StackPrototype.withMutations = withMutations;
StackPrototype.wasAltered = wasAltered;
StackPrototype.asImmutable = asImmutable;
StackPrototype['@@transducer/init'] = StackPrototype.asMutable = asMutable;

StackPrototype['@@transducer/step'] = function (result, arr) {
  return result.unshift(arr);
};

StackPrototype['@@transducer/result'] = function (obj) {
  return obj.asImmutable();
};

function makeStack(size, head, ownerID, hash) {
  var map = Object.create(StackPrototype);
  map.size = size;
  map._head = head;
  map.__ownerID = ownerID;
  map.__hash = hash;
  map.__altered = false;
  return map;
}

var EMPTY_STACK;

function emptyStack() {
  return EMPTY_STACK || (EMPTY_STACK = makeStack(0));
}

var IS_SET_SYMBOL = '@@__IMMUTABLE_SET__@@';

function isSet(maybeSet) {
  return Boolean(maybeSet && maybeSet[IS_SET_SYMBOL]);
}

function isOrderedSet(maybeOrderedSet) {
  return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);
}

function deepEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (!isCollection(b) || a.size !== undefined && b.size !== undefined && a.size !== b.size || a.__hash !== undefined && b.__hash !== undefined && a.__hash !== b.__hash || isKeyed(a) !== isKeyed(b) || isIndexed(a) !== isIndexed(b) || isOrdered(a) !== isOrdered(b)) {
    return false;
  }

  if (a.size === 0 && b.size === 0) {
    return true;
  }

  var notAssociative = !isAssociative(a);

  if (isOrdered(a)) {
    var entries = a.entries();
    return b.every(function (v, k) {
      var entry = entries.next().value;
      return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));
    }) && entries.next().done;
  }

  var flipped = false;

  if (a.size === undefined) {
    if (b.size === undefined) {
      if (typeof a.cacheResult === 'function') {
        a.cacheResult();
      }
    } else {
      flipped = true;
      var _ = a;
      a = b;
      b = _;
    }
  }

  var allEqual = true;

  var bSize = b.__iterate(function (v, k) {
    if (notAssociative ? !a.has(v) : flipped ? !is(v, a.get(k, NOT_SET)) : !is(a.get(k, NOT_SET), v)) {
      allEqual = false;
      return false;
    }
  });

  return allEqual && a.size === bSize;
}
/**
 * Contributes additional methods to a constructor
 */


function mixin(ctor, methods) {
  var keyCopier = function (key) {
    ctor.prototype[key] = methods[key];
  };

  Object.keys(methods).forEach(keyCopier);
  Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(methods).forEach(keyCopier);
  return ctor;
}

function toJS(value) {
  if (!value || typeof value !== 'object') {
    return value;
  }

  if (!isCollection(value)) {
    if (!isDataStructure(value)) {
      return value;
    }

    value = Seq(value);
  }

  if (isKeyed(value)) {
    var result$1 = {};

    value.__iterate(function (v, k) {
      result$1[k] = toJS(v);
    });

    return result$1;
  }

  var result = [];

  value.__iterate(function (v) {
    result.push(toJS(v));
  });

  return result;
}

var Set$1 =
/*@__PURE__*/
function (SetCollection$$1) {
  function Set(value) {
    return value === null || value === undefined ? emptySet() : isSet(value) && !isOrdered(value) ? value : emptySet().withMutations(function (set) {
      var iter = SetCollection$$1(value);
      assertNotInfinite(iter.size);
      iter.forEach(function (v) {
        return set.add(v);
      });
    });
  }

  if (SetCollection$$1) Set.__proto__ = SetCollection$$1;
  Set.prototype = Object.create(SetCollection$$1 && SetCollection$$1.prototype);
  Set.prototype.constructor = Set;

  Set.of = function of()
  /*...values*/
  {
    return this(arguments);
  };

  Set.fromKeys = function fromKeys(value) {
    return this(KeyedCollection(value).keySeq());
  };

  Set.intersect = function intersect(sets) {
    sets = Collection(sets).toArray();
    return sets.length ? SetPrototype.intersect.apply(Set(sets.pop()), sets) : emptySet();
  };

  Set.union = function union(sets) {
    sets = Collection(sets).toArray();
    return sets.length ? SetPrototype.union.apply(Set(sets.pop()), sets) : emptySet();
  };

  Set.prototype.toString = function toString() {
    return this.__toString('Set {', '}');
  }; // @pragma Access


  Set.prototype.has = function has(value) {
    return this._map.has(value);
  }; // @pragma Modification


  Set.prototype.add = function add(value) {
    return updateSet(this, this._map.set(value, value));
  };

  Set.prototype.remove = function remove(value) {
    return updateSet(this, this._map.remove(value));
  };

  Set.prototype.clear = function clear() {
    return updateSet(this, this._map.clear());
  }; // @pragma Composition


  Set.prototype.map = function map(mapper, context) {
    var this$1 = this;
    var removes = [];
    var adds = [];
    this.forEach(function (value) {
      var mapped = mapper.call(context, value, value, this$1);

      if (mapped !== value) {
        removes.push(value);
        adds.push(mapped);
      }
    });
    return this.withMutations(function (set) {
      removes.forEach(function (value) {
        return set.remove(value);
      });
      adds.forEach(function (value) {
        return set.add(value);
      });
    });
  };

  Set.prototype.union = function union() {
    var iters = [],
        len = arguments.length;

    while (len--) iters[len] = arguments[len];

    iters = iters.filter(function (x) {
      return x.size !== 0;
    });

    if (iters.length === 0) {
      return this;
    }

    if (this.size === 0 && !this.__ownerID && iters.length === 1) {
      return this.constructor(iters[0]);
    }

    return this.withMutations(function (set) {
      for (var ii = 0; ii < iters.length; ii++) {
        SetCollection$$1(iters[ii]).forEach(function (value) {
          return set.add(value);
        });
      }
    });
  };

  Set.prototype.intersect = function intersect() {
    var iters = [],
        len = arguments.length;

    while (len--) iters[len] = arguments[len];

    if (iters.length === 0) {
      return this;
    }

    iters = iters.map(function (iter) {
      return SetCollection$$1(iter);
    });
    var toRemove = [];
    this.forEach(function (value) {
      if (!iters.every(function (iter) {
        return iter.includes(value);
      })) {
        toRemove.push(value);
      }
    });
    return this.withMutations(function (set) {
      toRemove.forEach(function (value) {
        set.remove(value);
      });
    });
  };

  Set.prototype.subtract = function subtract() {
    var iters = [],
        len = arguments.length;

    while (len--) iters[len] = arguments[len];

    if (iters.length === 0) {
      return this;
    }

    iters = iters.map(function (iter) {
      return SetCollection$$1(iter);
    });
    var toRemove = [];
    this.forEach(function (value) {
      if (iters.some(function (iter) {
        return iter.includes(value);
      })) {
        toRemove.push(value);
      }
    });
    return this.withMutations(function (set) {
      toRemove.forEach(function (value) {
        set.remove(value);
      });
    });
  };

  Set.prototype.sort = function sort(comparator) {
    // Late binding
    return OrderedSet(sortFactory(this, comparator));
  };

  Set.prototype.sortBy = function sortBy(mapper, comparator) {
    // Late binding
    return OrderedSet(sortFactory(this, comparator, mapper));
  };

  Set.prototype.wasAltered = function wasAltered() {
    return this._map.wasAltered();
  };

  Set.prototype.__iterate = function __iterate(fn, reverse) {
    var this$1 = this;
    return this._map.__iterate(function (k) {
      return fn(k, k, this$1);
    }, reverse);
  };

  Set.prototype.__iterator = function __iterator(type, reverse) {
    return this._map.__iterator(type, reverse);
  };

  Set.prototype.__ensureOwner = function __ensureOwner(ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }

    var newMap = this._map.__ensureOwner(ownerID);

    if (!ownerID) {
      if (this.size === 0) {
        return this.__empty();
      }

      this.__ownerID = ownerID;
      this._map = newMap;
      return this;
    }

    return this.__make(newMap, ownerID);
  };

  return Set;
}(SetCollection);

Set$1.isSet = isSet;
var SetPrototype = Set$1.prototype;
SetPrototype[IS_SET_SYMBOL] = true;
SetPrototype[DELETE] = SetPrototype.remove;
SetPrototype.merge = SetPrototype.concat = SetPrototype.union;
SetPrototype.withMutations = withMutations;
SetPrototype.asImmutable = asImmutable;
SetPrototype['@@transducer/init'] = SetPrototype.asMutable = asMutable;

SetPrototype['@@transducer/step'] = function (result, arr) {
  return result.add(arr);
};

SetPrototype['@@transducer/result'] = function (obj) {
  return obj.asImmutable();
};

SetPrototype.__empty = emptySet;
SetPrototype.__make = makeSet;

function updateSet(set, newMap) {
  if (set.__ownerID) {
    set.size = newMap.size;
    set._map = newMap;
    return set;
  }

  return newMap === set._map ? set : newMap.size === 0 ? set.__empty() : set.__make(newMap);
}

function makeSet(map, ownerID) {
  var set = Object.create(SetPrototype);
  set.size = map ? map.size : 0;
  set._map = map;
  set.__ownerID = ownerID;
  return set;
}

var EMPTY_SET;

function emptySet() {
  return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));
}
/**
 * Returns a lazy seq of nums from start (inclusive) to end
 * (exclusive), by step, where start defaults to 0, step to 1, and end to
 * infinity. When start is equal to end, returns empty list.
 */


var Range =
/*@__PURE__*/
function (IndexedSeq$$1) {
  function Range(start, end, step) {
    if (!(this instanceof Range)) {
      return new Range(start, end, step);
    }

    invariant(step !== 0, 'Cannot step a Range by 0');
    start = start || 0;

    if (end === undefined) {
      end = Infinity;
    }

    step = step === undefined ? 1 : Math.abs(step);

    if (end < start) {
      step = -step;
    }

    this._start = start;
    this._end = end;
    this._step = step;
    this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);

    if (this.size === 0) {
      if (EMPTY_RANGE) {
        return EMPTY_RANGE;
      }

      EMPTY_RANGE = this;
    }
  }

  if (IndexedSeq$$1) Range.__proto__ = IndexedSeq$$1;
  Range.prototype = Object.create(IndexedSeq$$1 && IndexedSeq$$1.prototype);
  Range.prototype.constructor = Range;

  Range.prototype.toString = function toString() {
    if (this.size === 0) {
      return 'Range []';
    }

    return 'Range [ ' + this._start + '...' + this._end + (this._step !== 1 ? ' by ' + this._step : '') + ' ]';
  };

  Range.prototype.get = function get(index, notSetValue) {
    return this.has(index) ? this._start + wrapIndex(this, index) * this._step : notSetValue;
  };

  Range.prototype.includes = function includes(searchValue) {
    var possibleIndex = (searchValue - this._start) / this._step;
    return possibleIndex >= 0 && possibleIndex < this.size && possibleIndex === Math.floor(possibleIndex);
  };

  Range.prototype.slice = function slice(begin, end) {
    if (wholeSlice(begin, end, this.size)) {
      return this;
    }

    begin = resolveBegin(begin, this.size);
    end = resolveEnd(end, this.size);

    if (end <= begin) {
      return new Range(0, 0);
    }

    return new Range(this.get(begin, this._end), this.get(end, this._end), this._step);
  };

  Range.prototype.indexOf = function indexOf(searchValue) {
    var offsetValue = searchValue - this._start;

    if (offsetValue % this._step === 0) {
      var index = offsetValue / this._step;

      if (index >= 0 && index < this.size) {
        return index;
      }
    }

    return -1;
  };

  Range.prototype.lastIndexOf = function lastIndexOf(searchValue) {
    return this.indexOf(searchValue);
  };

  Range.prototype.__iterate = function __iterate(fn, reverse) {
    var size = this.size;
    var step = this._step;
    var value = reverse ? this._start + (size - 1) * step : this._start;
    var i = 0;

    while (i !== size) {
      if (fn(value, reverse ? size - ++i : i++, this) === false) {
        break;
      }

      value += reverse ? -step : step;
    }

    return i;
  };

  Range.prototype.__iterator = function __iterator(type, reverse) {
    var size = this.size;
    var step = this._step;
    var value = reverse ? this._start + (size - 1) * step : this._start;
    var i = 0;
    return new Iterator(function () {
      if (i === size) {
        return iteratorDone();
      }

      var v = value;
      value += reverse ? -step : step;
      return iteratorValue(type, reverse ? size - ++i : i++, v);
    });
  };

  Range.prototype.equals = function equals(other) {
    return other instanceof Range ? this._start === other._start && this._end === other._end && this._step === other._step : deepEqual(this, other);
  };

  return Range;
}(IndexedSeq);

var EMPTY_RANGE;

function getIn(collection, searchKeyPath, notSetValue) {
  var keyPath = coerceKeyPath(searchKeyPath);
  var i = 0;

  while (i !== keyPath.length) {
    collection = get(collection, keyPath[i++], NOT_SET);

    if (collection === NOT_SET) {
      return notSetValue;
    }
  }

  return collection;
}

function getIn$1(searchKeyPath, notSetValue) {
  return getIn(this, searchKeyPath, notSetValue);
}

function hasIn(collection, keyPath) {
  return getIn(collection, keyPath, NOT_SET) !== NOT_SET;
}

function hasIn$1(searchKeyPath) {
  return hasIn(this, searchKeyPath);
}

function toObject() {
  assertNotInfinite(this.size);
  var object = {};

  this.__iterate(function (v, k) {
    object[k] = v;
  });

  return object;
} // Note: all of these methods are deprecated.


Collection.isIterable = isCollection;
Collection.isKeyed = isKeyed;
Collection.isIndexed = isIndexed;
Collection.isAssociative = isAssociative;
Collection.isOrdered = isOrdered;
Collection.Iterator = Iterator;
mixin(Collection, {
  // ### Conversion to other types
  toArray: function toArray() {
    assertNotInfinite(this.size);
    var array = new Array(this.size || 0);
    var useTuples = isKeyed(this);
    var i = 0;

    this.__iterate(function (v, k) {
      // Keyed collections produce an array of tuples.
      array[i++] = useTuples ? [k, v] : v;
    });

    return array;
  },
  toIndexedSeq: function toIndexedSeq() {
    return new ToIndexedSequence(this);
  },
  toJS: function toJS$1() {
    return toJS(this);
  },
  toKeyedSeq: function toKeyedSeq() {
    return new ToKeyedSequence(this, true);
  },
  toMap: function toMap() {
    // Use Late Binding here to solve the circular dependency.
    return Map$1(this.toKeyedSeq());
  },
  toObject: toObject,
  toOrderedMap: function toOrderedMap() {
    // Use Late Binding here to solve the circular dependency.
    return OrderedMap(this.toKeyedSeq());
  },
  toOrderedSet: function toOrderedSet() {
    // Use Late Binding here to solve the circular dependency.
    return OrderedSet(isKeyed(this) ? this.valueSeq() : this);
  },
  toSet: function toSet() {
    // Use Late Binding here to solve the circular dependency.
    return Set$1(isKeyed(this) ? this.valueSeq() : this);
  },
  toSetSeq: function toSetSeq() {
    return new ToSetSequence(this);
  },
  toSeq: function toSeq() {
    return isIndexed(this) ? this.toIndexedSeq() : isKeyed(this) ? this.toKeyedSeq() : this.toSetSeq();
  },
  toStack: function toStack() {
    // Use Late Binding here to solve the circular dependency.
    return Stack(isKeyed(this) ? this.valueSeq() : this);
  },
  toList: function toList() {
    // Use Late Binding here to solve the circular dependency.
    return List(isKeyed(this) ? this.valueSeq() : this);
  },
  // ### Common JavaScript methods and properties
  toString: function toString() {
    return '[Collection]';
  },
  __toString: function __toString(head, tail) {
    if (this.size === 0) {
      return head + tail;
    }

    return head + ' ' + this.toSeq().map(this.__toStringMapper).join(', ') + ' ' + tail;
  },
  // ### ES6 Collection methods (ES6 Array and Map)
  concat: function concat() {
    var values = [],
        len = arguments.length;

    while (len--) values[len] = arguments[len];

    return reify(this, concatFactory(this, values));
  },
  includes: function includes(searchValue) {
    return this.some(function (value) {
      return is(value, searchValue);
    });
  },
  entries: function entries() {
    return this.__iterator(ITERATE_ENTRIES);
  },
  every: function every(predicate, context) {
    assertNotInfinite(this.size);
    var returnValue = true;

    this.__iterate(function (v, k, c) {
      if (!predicate.call(context, v, k, c)) {
        returnValue = false;
        return false;
      }
    });

    return returnValue;
  },
  filter: function filter(predicate, context) {
    return reify(this, filterFactory(this, predicate, context, true));
  },
  find: function find(predicate, context, notSetValue) {
    var entry = this.findEntry(predicate, context);
    return entry ? entry[1] : notSetValue;
  },
  forEach: function forEach(sideEffect, context) {
    assertNotInfinite(this.size);
    return this.__iterate(context ? sideEffect.bind(context) : sideEffect);
  },
  join: function join(separator) {
    assertNotInfinite(this.size);
    separator = separator !== undefined ? '' + separator : ',';
    var joined = '';
    var isFirst = true;

    this.__iterate(function (v) {
      isFirst ? isFirst = false : joined += separator;
      joined += v !== null && v !== undefined ? v.toString() : '';
    });

    return joined;
  },
  keys: function keys() {
    return this.__iterator(ITERATE_KEYS);
  },
  map: function map(mapper, context) {
    return reify(this, mapFactory(this, mapper, context));
  },
  reduce: function reduce$1(reducer, initialReduction, context) {
    return reduce(this, reducer, initialReduction, context, arguments.length < 2, false);
  },
  reduceRight: function reduceRight(reducer, initialReduction, context) {
    return reduce(this, reducer, initialReduction, context, arguments.length < 2, true);
  },
  reverse: function reverse() {
    return reify(this, reverseFactory(this, true));
  },
  slice: function slice(begin, end) {
    return reify(this, sliceFactory(this, begin, end, true));
  },
  some: function some(predicate, context) {
    return !this.every(not(predicate), context);
  },
  sort: function sort(comparator) {
    return reify(this, sortFactory(this, comparator));
  },
  values: function values() {
    return this.__iterator(ITERATE_VALUES);
  },
  // ### More sequential methods
  butLast: function butLast() {
    return this.slice(0, -1);
  },
  isEmpty: function isEmpty() {
    return this.size !== undefined ? this.size === 0 : !this.some(function () {
      return true;
    });
  },
  count: function count(predicate, context) {
    return ensureSize(predicate ? this.toSeq().filter(predicate, context) : this);
  },
  countBy: function countBy(grouper, context) {
    return countByFactory(this, grouper, context);
  },
  equals: function equals(other) {
    return deepEqual(this, other);
  },
  entrySeq: function entrySeq() {
    var collection = this;

    if (collection._cache) {
      // We cache as an entries array, so we can just return the cache!
      return new ArraySeq(collection._cache);
    }

    var entriesSequence = collection.toSeq().map(entryMapper).toIndexedSeq();

    entriesSequence.fromEntrySeq = function () {
      return collection.toSeq();
    };

    return entriesSequence;
  },
  filterNot: function filterNot(predicate, context) {
    return this.filter(not(predicate), context);
  },
  findEntry: function findEntry(predicate, context, notSetValue) {
    var found = notSetValue;

    this.__iterate(function (v, k, c) {
      if (predicate.call(context, v, k, c)) {
        found = [k, v];
        return false;
      }
    });

    return found;
  },
  findKey: function findKey(predicate, context) {
    var entry = this.findEntry(predicate, context);
    return entry && entry[0];
  },
  findLast: function findLast(predicate, context, notSetValue) {
    return this.toKeyedSeq().reverse().find(predicate, context, notSetValue);
  },
  findLastEntry: function findLastEntry(predicate, context, notSetValue) {
    return this.toKeyedSeq().reverse().findEntry(predicate, context, notSetValue);
  },
  findLastKey: function findLastKey(predicate, context) {
    return this.toKeyedSeq().reverse().findKey(predicate, context);
  },
  first: function first(notSetValue) {
    return this.find(returnTrue, null, notSetValue);
  },
  flatMap: function flatMap(mapper, context) {
    return reify(this, flatMapFactory(this, mapper, context));
  },
  flatten: function flatten(depth) {
    return reify(this, flattenFactory(this, depth, true));
  },
  fromEntrySeq: function fromEntrySeq() {
    return new FromEntriesSequence(this);
  },
  get: function get(searchKey, notSetValue) {
    return this.find(function (_, key) {
      return is(key, searchKey);
    }, undefined, notSetValue);
  },
  getIn: getIn$1,
  groupBy: function groupBy(grouper, context) {
    return groupByFactory(this, grouper, context);
  },
  has: function has(searchKey) {
    return this.get(searchKey, NOT_SET) !== NOT_SET;
  },
  hasIn: hasIn$1,
  isSubset: function isSubset(iter) {
    iter = typeof iter.includes === 'function' ? iter : Collection(iter);
    return this.every(function (value) {
      return iter.includes(value);
    });
  },
  isSuperset: function isSuperset(iter) {
    iter = typeof iter.isSubset === 'function' ? iter : Collection(iter);
    return iter.isSubset(this);
  },
  keyOf: function keyOf(searchValue) {
    return this.findKey(function (value) {
      return is(value, searchValue);
    });
  },
  keySeq: function keySeq() {
    return this.toSeq().map(keyMapper).toIndexedSeq();
  },
  last: function last(notSetValue) {
    return this.toSeq().reverse().first(notSetValue);
  },
  lastKeyOf: function lastKeyOf(searchValue) {
    return this.toKeyedSeq().reverse().keyOf(searchValue);
  },
  max: function max(comparator) {
    return maxFactory(this, comparator);
  },
  maxBy: function maxBy(mapper, comparator) {
    return maxFactory(this, comparator, mapper);
  },
  min: function min(comparator) {
    return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator);
  },
  minBy: function minBy(mapper, comparator) {
    return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator, mapper);
  },
  rest: function rest() {
    return this.slice(1);
  },
  skip: function skip(amount) {
    return amount === 0 ? this : this.slice(Math.max(0, amount));
  },
  skipLast: function skipLast(amount) {
    return amount === 0 ? this : this.slice(0, -Math.max(0, amount));
  },
  skipWhile: function skipWhile(predicate, context) {
    return reify(this, skipWhileFactory(this, predicate, context, true));
  },
  skipUntil: function skipUntil(predicate, context) {
    return this.skipWhile(not(predicate), context);
  },
  sortBy: function sortBy(mapper, comparator) {
    return reify(this, sortFactory(this, comparator, mapper));
  },
  take: function take(amount) {
    return this.slice(0, Math.max(0, amount));
  },
  takeLast: function takeLast(amount) {
    return this.slice(-Math.max(0, amount));
  },
  takeWhile: function takeWhile(predicate, context) {
    return reify(this, takeWhileFactory(this, predicate, context));
  },
  takeUntil: function takeUntil(predicate, context) {
    return this.takeWhile(not(predicate), context);
  },
  update: function update(fn) {
    return fn(this);
  },
  valueSeq: function valueSeq() {
    return this.toIndexedSeq();
  },
  // ### Hashable Object
  hashCode: function hashCode() {
    return this.__hash || (this.__hash = hashCollection(this));
  } // ### Internal
  // abstract __iterate(fn, reverse)
  // abstract __iterator(type, reverse)

});
var CollectionPrototype = Collection.prototype;
CollectionPrototype[IS_COLLECTION_SYMBOL] = true;
CollectionPrototype[ITERATOR_SYMBOL] = CollectionPrototype.values;
CollectionPrototype.toJSON = CollectionPrototype.toArray;
CollectionPrototype.__toStringMapper = quoteString;

CollectionPrototype.inspect = CollectionPrototype.toSource = function () {
  return this.toString();
};

CollectionPrototype.chain = CollectionPrototype.flatMap;
CollectionPrototype.contains = CollectionPrototype.includes;
mixin(KeyedCollection, {
  // ### More sequential methods
  flip: function flip() {
    return reify(this, flipFactory(this));
  },
  mapEntries: function mapEntries(mapper, context) {
    var this$1 = this;
    var iterations = 0;
    return reify(this, this.toSeq().map(function (v, k) {
      return mapper.call(context, [k, v], iterations++, this$1);
    }).fromEntrySeq());
  },
  mapKeys: function mapKeys(mapper, context) {
    var this$1 = this;
    return reify(this, this.toSeq().flip().map(function (k, v) {
      return mapper.call(context, k, v, this$1);
    }).flip());
  }
});
var KeyedCollectionPrototype = KeyedCollection.prototype;
KeyedCollectionPrototype[IS_KEYED_SYMBOL] = true;
KeyedCollectionPrototype[ITERATOR_SYMBOL] = CollectionPrototype.entries;
KeyedCollectionPrototype.toJSON = toObject;

KeyedCollectionPrototype.__toStringMapper = function (v, k) {
  return quoteString(k) + ': ' + quoteString(v);
};

mixin(IndexedCollection, {
  // ### Conversion to other types
  toKeyedSeq: function toKeyedSeq() {
    return new ToKeyedSequence(this, false);
  },
  // ### ES6 Collection methods (ES6 Array and Map)
  filter: function filter(predicate, context) {
    return reify(this, filterFactory(this, predicate, context, false));
  },
  findIndex: function findIndex(predicate, context) {
    var entry = this.findEntry(predicate, context);
    return entry ? entry[0] : -1;
  },
  indexOf: function indexOf(searchValue) {
    var key = this.keyOf(searchValue);
    return key === undefined ? -1 : key;
  },
  lastIndexOf: function lastIndexOf(searchValue) {
    var key = this.lastKeyOf(searchValue);
    return key === undefined ? -1 : key;
  },
  reverse: function reverse() {
    return reify(this, reverseFactory(this, false));
  },
  slice: function slice(begin, end) {
    return reify(this, sliceFactory(this, begin, end, false));
  },
  splice: function splice(index, removeNum
  /*, ...values*/
  ) {
    var numArgs = arguments.length;
    removeNum = Math.max(removeNum || 0, 0);

    if (numArgs === 0 || numArgs === 2 && !removeNum) {
      return this;
    } // If index is negative, it should resolve relative to the size of the
    // collection. However size may be expensive to compute if not cached, so
    // only call count() if the number is in fact negative.


    index = resolveBegin(index, index < 0 ? this.count() : this.size);
    var spliced = this.slice(0, index);
    return reify(this, numArgs === 1 ? spliced : spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum)));
  },
  // ### More collection methods
  findLastIndex: function findLastIndex(predicate, context) {
    var entry = this.findLastEntry(predicate, context);
    return entry ? entry[0] : -1;
  },
  first: function first(notSetValue) {
    return this.get(0, notSetValue);
  },
  flatten: function flatten(depth) {
    return reify(this, flattenFactory(this, depth, false));
  },
  get: function get(index, notSetValue) {
    index = wrapIndex(this, index);
    return index < 0 || this.size === Infinity || this.size !== undefined && index > this.size ? notSetValue : this.find(function (_, key) {
      return key === index;
    }, undefined, notSetValue);
  },
  has: function has(index) {
    index = wrapIndex(this, index);
    return index >= 0 && (this.size !== undefined ? this.size === Infinity || index < this.size : this.indexOf(index) !== -1);
  },
  interpose: function interpose(separator) {
    return reify(this, interposeFactory(this, separator));
  },
  interleave: function interleave()
  /*...collections*/
  {
    var collections = [this].concat(arrCopy(arguments));
    var zipped = zipWithFactory(this.toSeq(), IndexedSeq.of, collections);
    var interleaved = zipped.flatten(true);

    if (zipped.size) {
      interleaved.size = zipped.size * collections.length;
    }

    return reify(this, interleaved);
  },
  keySeq: function keySeq() {
    return Range(0, this.size);
  },
  last: function last(notSetValue) {
    return this.get(-1, notSetValue);
  },
  skipWhile: function skipWhile(predicate, context) {
    return reify(this, skipWhileFactory(this, predicate, context, false));
  },
  zip: function zip()
  /*, ...collections */
  {
    var collections = [this].concat(arrCopy(arguments));
    return reify(this, zipWithFactory(this, defaultZipper, collections));
  },
  zipAll: function zipAll()
  /*, ...collections */
  {
    var collections = [this].concat(arrCopy(arguments));
    return reify(this, zipWithFactory(this, defaultZipper, collections, true));
  },
  zipWith: function zipWith(zipper
  /*, ...collections */
  ) {
    var collections = arrCopy(arguments);
    collections[0] = this;
    return reify(this, zipWithFactory(this, zipper, collections));
  }
});
var IndexedCollectionPrototype = IndexedCollection.prototype;
IndexedCollectionPrototype[IS_INDEXED_SYMBOL] = true;
IndexedCollectionPrototype[IS_ORDERED_SYMBOL] = true;
mixin(SetCollection, {
  // ### ES6 Collection methods (ES6 Array and Map)
  get: function get(value, notSetValue) {
    return this.has(value) ? value : notSetValue;
  },
  includes: function includes(value) {
    return this.has(value);
  },
  // ### More sequential methods
  keySeq: function keySeq() {
    return this.valueSeq();
  }
});
SetCollection.prototype.has = CollectionPrototype.includes;
SetCollection.prototype.contains = SetCollection.prototype.includes; // Mixin subclasses

mixin(KeyedSeq, KeyedCollection.prototype);
mixin(IndexedSeq, IndexedCollection.prototype);
mixin(SetSeq, SetCollection.prototype); // #pragma Helper functions

function reduce(collection, reducer, reduction, context, useFirst, reverse) {
  assertNotInfinite(collection.size);

  collection.__iterate(function (v, k, c) {
    if (useFirst) {
      useFirst = false;
      reduction = v;
    } else {
      reduction = reducer.call(context, reduction, v, k, c);
    }
  }, reverse);

  return reduction;
}

function keyMapper(v, k) {
  return k;
}

function entryMapper(v, k) {
  return [k, v];
}

function not(predicate) {
  return function () {
    return !predicate.apply(this, arguments);
  };
}

function neg(predicate) {
  return function () {
    return -predicate.apply(this, arguments);
  };
}

function defaultZipper() {
  return arrCopy(arguments);
}

function defaultNegComparator(a, b) {
  return a < b ? 1 : a > b ? -1 : 0;
}

function hashCollection(collection) {
  if (collection.size === Infinity) {
    return 0;
  }

  var ordered = isOrdered(collection);
  var keyed = isKeyed(collection);
  var h = ordered ? 1 : 0;

  var size = collection.__iterate(keyed ? ordered ? function (v, k) {
    h = 31 * h + hashMerge(hash(v), hash(k)) | 0;
  } : function (v, k) {
    h = h + hashMerge(hash(v), hash(k)) | 0;
  } : ordered ? function (v) {
    h = 31 * h + hash(v) | 0;
  } : function (v) {
    h = h + hash(v) | 0;
  });

  return murmurHashOfSize(size, h);
}

function murmurHashOfSize(size, h) {
  h = imul(h, 0xcc9e2d51);
  h = imul(h << 15 | h >>> -15, 0x1b873593);
  h = imul(h << 13 | h >>> -13, 5);
  h = (h + 0xe6546b64 | 0) ^ size;
  h = imul(h ^ h >>> 16, 0x85ebca6b);
  h = imul(h ^ h >>> 13, 0xc2b2ae35);
  h = smi(h ^ h >>> 16);
  return h;
}

function hashMerge(a, b) {
  return a ^ b + 0x9e3779b9 + (a << 6) + (a >> 2) | 0; // int
}

var OrderedSet =
/*@__PURE__*/
function (Set$$1) {
  function OrderedSet(value) {
    return value === null || value === undefined ? emptyOrderedSet() : isOrderedSet(value) ? value : emptyOrderedSet().withMutations(function (set) {
      var iter = SetCollection(value);
      assertNotInfinite(iter.size);
      iter.forEach(function (v) {
        return set.add(v);
      });
    });
  }

  if (Set$$1) OrderedSet.__proto__ = Set$$1;
  OrderedSet.prototype = Object.create(Set$$1 && Set$$1.prototype);
  OrderedSet.prototype.constructor = OrderedSet;

  OrderedSet.of = function of()
  /*...values*/
  {
    return this(arguments);
  };

  OrderedSet.fromKeys = function fromKeys(value) {
    return this(KeyedCollection(value).keySeq());
  };

  OrderedSet.prototype.toString = function toString() {
    return this.__toString('OrderedSet {', '}');
  };

  return OrderedSet;
}(Set$1);

OrderedSet.isOrderedSet = isOrderedSet;
var OrderedSetPrototype = OrderedSet.prototype;
OrderedSetPrototype[IS_ORDERED_SYMBOL] = true;
OrderedSetPrototype.zip = IndexedCollectionPrototype.zip;
OrderedSetPrototype.zipWith = IndexedCollectionPrototype.zipWith;
OrderedSetPrototype.__empty = emptyOrderedSet;
OrderedSetPrototype.__make = makeOrderedSet;

function makeOrderedSet(map, ownerID) {
  var set = Object.create(OrderedSetPrototype);
  set.size = map ? map.size : 0;
  set._map = map;
  set.__ownerID = ownerID;
  return set;
}

var EMPTY_ORDERED_SET;

function emptyOrderedSet() {
  return EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));
}

var Record = function Record(defaultValues, name) {
  var hasInitialized;

  var RecordType = function Record(values) {
    var this$1 = this;

    if (values instanceof RecordType) {
      return values;
    }

    if (!(this instanceof RecordType)) {
      return new RecordType(values);
    }

    if (!hasInitialized) {
      hasInitialized = true;
      var keys = Object.keys(defaultValues);
      var indices = RecordTypePrototype._indices = {}; // Deprecated: left to attempt not to break any external code which
      // relies on a ._name property existing on record instances.
      // Use Record.getDescriptiveName() instead

      RecordTypePrototype._name = name;
      RecordTypePrototype._keys = keys;
      RecordTypePrototype._defaultValues = defaultValues;

      for (var i = 0; i < keys.length; i++) {
        var propName = keys[i];
        indices[propName] = i;

        if (RecordTypePrototype[propName]) {
          /* eslint-disable no-console */
          typeof console === 'object' && console.warn && console.warn('Cannot define ' + recordName(this) + ' with property "' + propName + '" since that property name is part of the Record API.');
          /* eslint-enable no-console */
        } else {
          setProp(RecordTypePrototype, propName);
        }
      }
    }

    this.__ownerID = undefined;
    this._values = List().withMutations(function (l) {
      l.setSize(this$1._keys.length);
      KeyedCollection(values).forEach(function (v, k) {
        l.set(this$1._indices[k], v === this$1._defaultValues[k] ? undefined : v);
      });
    });
  };

  var RecordTypePrototype = RecordType.prototype = Object.create(RecordPrototype);
  RecordTypePrototype.constructor = RecordType;

  if (name) {
    RecordType.displayName = name;
  }

  return RecordType;
};

Record.prototype.toString = function toString() {
  var str = recordName(this) + ' { ';
  var keys = this._keys;
  var k;

  for (var i = 0, l = keys.length; i !== l; i++) {
    k = keys[i];
    str += (i ? ', ' : '') + k + ': ' + quoteString(this.get(k));
  }

  return str + ' }';
};

Record.prototype.equals = function equals(other) {
  return this === other || other && this._keys === other._keys && recordSeq(this).equals(recordSeq(other));
};

Record.prototype.hashCode = function hashCode() {
  return recordSeq(this).hashCode();
}; // @pragma Access


Record.prototype.has = function has(k) {
  return this._indices.hasOwnProperty(k);
};

Record.prototype.get = function get(k, notSetValue) {
  if (!this.has(k)) {
    return notSetValue;
  }

  var index = this._indices[k];

  var value = this._values.get(index);

  return value === undefined ? this._defaultValues[k] : value;
}; // @pragma Modification


Record.prototype.set = function set(k, v) {
  if (this.has(k)) {
    var newValues = this._values.set(this._indices[k], v === this._defaultValues[k] ? undefined : v);

    if (newValues !== this._values && !this.__ownerID) {
      return makeRecord(this, newValues);
    }
  }

  return this;
};

Record.prototype.remove = function remove(k) {
  return this.set(k);
};

Record.prototype.clear = function clear() {
  var newValues = this._values.clear().setSize(this._keys.length);

  return this.__ownerID ? this : makeRecord(this, newValues);
};

Record.prototype.wasAltered = function wasAltered() {
  return this._values.wasAltered();
};

Record.prototype.toSeq = function toSeq() {
  return recordSeq(this);
};

Record.prototype.toJS = function toJS$1() {
  return toJS(this);
};

Record.prototype.entries = function entries() {
  return this.__iterator(ITERATE_ENTRIES);
};

Record.prototype.__iterator = function __iterator(type, reverse) {
  return recordSeq(this).__iterator(type, reverse);
};

Record.prototype.__iterate = function __iterate(fn, reverse) {
  return recordSeq(this).__iterate(fn, reverse);
};

Record.prototype.__ensureOwner = function __ensureOwner(ownerID) {
  if (ownerID === this.__ownerID) {
    return this;
  }

  var newValues = this._values.__ensureOwner(ownerID);

  if (!ownerID) {
    this.__ownerID = ownerID;
    this._values = newValues;
    return this;
  }

  return makeRecord(this, newValues, ownerID);
};

Record.isRecord = isRecord;
Record.getDescriptiveName = recordName;
var RecordPrototype = Record.prototype;
RecordPrototype[IS_RECORD_SYMBOL] = true;
RecordPrototype[DELETE] = RecordPrototype.remove;
RecordPrototype.deleteIn = RecordPrototype.removeIn = deleteIn;
RecordPrototype.getIn = getIn$1;
RecordPrototype.hasIn = CollectionPrototype.hasIn;
RecordPrototype.merge = merge;
RecordPrototype.mergeWith = mergeWith;
RecordPrototype.mergeIn = mergeIn;
RecordPrototype.mergeDeep = mergeDeep$1;
RecordPrototype.mergeDeepWith = mergeDeepWith$1;
RecordPrototype.mergeDeepIn = mergeDeepIn;
RecordPrototype.setIn = setIn$1;
RecordPrototype.update = update$1;
RecordPrototype.updateIn = updateIn$1;
RecordPrototype.withMutations = withMutations;
RecordPrototype.asMutable = asMutable;
RecordPrototype.asImmutable = asImmutable;
RecordPrototype[ITERATOR_SYMBOL] = RecordPrototype.entries;
RecordPrototype.toJSON = RecordPrototype.toObject = CollectionPrototype.toObject;

RecordPrototype.inspect = RecordPrototype.toSource = function () {
  return this.toString();
};

function makeRecord(likeRecord, values, ownerID) {
  var record = Object.create(Object.getPrototypeOf(likeRecord));
  record._values = values;
  record.__ownerID = ownerID;
  return record;
}

function recordName(record) {
  return record.constructor.displayName || record.constructor.name || 'Record';
}

function recordSeq(record) {
  return keyedSeqFromValue(record._keys.map(function (k) {
    return [k, record.get(k)];
  }));
}

function setProp(prototype, name) {
  try {
    Object.defineProperty(prototype, name, {
      get: function () {
        return this.get(name);
      },
      set: function (value) {
        invariant(this.__ownerID, 'Cannot set on an immutable record.');
        this.set(name, value);
      }
    });
  } catch (error) {// Object.defineProperty failed. Probably IE8.
  }
}

var VNode$1 = function VNode() {};

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

  var p = new VNode$1();
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

/*

    An AggregationDescription is a tree-shaped data structure that describes an aggregation
    The leaves contain a "formula" which acts like a filter on a DocumentBudgetaire

interface AggregationDescription extends AggregationDescriptionNode, Readonly<{
    children: OrderedMap<id, AggregationDescription | AggregationDescriptionLeaf>
}>{}

interface AggregationDescriptionNode extends Readonly<{
    id: string,
    label: string
}>{}

interface AggregationDescriptionLeaf extends AggregationDescriptionNode, Readonly<{
    formula: string
}>{}

*/

var AggregationDescriptionNodeFields = {
  'id': undefined,
  'name': undefined
};
var AggregationDescriptionLeaf = Record(_objectSpread({
  formula: undefined
}, AggregationDescriptionNodeFields));
var AggregationDescription = Record(_objectSpread({
  children: undefined
}, AggregationDescriptionNodeFields));
function AggregationDescriptionToJSON(aggregationDescription) {
  var id = aggregationDescription.id,
      name = aggregationDescription.name,
      formula = aggregationDescription.formula,
      children = aggregationDescription.children;
  return children ? {
    id: id,
    name: name,
    children: children.valueSeq().toArray().map(AggregationDescriptionToJSON)
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
  return children ? AggregationDescription({
    id: id,
    name: name,
    children: OrderedMap(children.map(function (c) {
      return [c.id, AggregationDescriptionFromJSON(c)];
    }))
  }) : AggregationDescriptionLeaf({
    id: id,
    name: name,
    formula: formula
  });
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
    elements: ImmutableSet<LigneBudget>
}>{}



interface AggregateMaker {
    (desc: AggregationDescription): 
        (doc: DocumentBudgetaire) => AggregatedDocumentBudgetaire;
}

*/

var AggregatedDocumentBudgetaireNodeFields = {
  'id': undefined,
  'name': undefined
};
var AggregatedDocumentBudgetaireLeaf = Record(_objectSpread({
  elements: undefined
}, AggregatedDocumentBudgetaireNodeFields));
var AggregatedDocumentBudgetaire = Record(_objectSpread({
  children: undefined
}, AggregatedDocumentBudgetaireNodeFields));
function getAggregatedDocumentBudgetaireLeaves(aggregatedDocumentBudgetaire) {
  return aggregatedDocumentBudgetaire.children ? aggregatedDocumentBudgetaire.children.valueSeq().map(getAggregatedDocumentBudgetaireLeaves).flatten() : aggregatedDocumentBudgetaire;
}
/*
    Function to compute the LigneBudget elements of a given node in the AggregatedDocumentBudgetaire tree
    by making the union of children, recursively
*/

function rawAggregatedDocumentBudgetaireNodeElements(node) {
  if (!node.children) return node.elements;else {
    return Set$1.union(node.children.map(aggregatedDocumentBudgetaireNodeElements));
  }
}

var aggregatedDocumentBudgetaireNodeElements = src(rawAggregatedDocumentBudgetaireNodeElements);
/*
    Function to compute the LigneBudget elements total of a given node in the AggregatedDocumentBudgetaire tree
*/

function rawAggregatedDocumentBudgetaireNodeTotal(node) {
  // .toArray is carefully placed so the result stops being a Set *before* the .map
  // if the .map was done before the .toArray, similar amounts would be counted only once leading
  // to an incorrect sum
  return sum(aggregatedDocumentBudgetaireNodeElements(node).toArray().map(function (row) {
    return row['MtReal'];
  }));
}

var aggregatedDocumentBudgetaireNodeTotal = src(rawAggregatedDocumentBudgetaireNodeTotal);

/*
    Keys are the one used by the Actes Budgétaire project XML files (<LigneBudget> specifically) as described in
    http://odm-budgetaire.org/doc-schema/Class_Budget_xsd_Complex_Type_TBudget.html#TBudget_LigneBudget

    'FI' has been added and refers to 'Fonctionnement/Investissement'
    'Chapitre' was added as well
*/

var LigneBudgetKeys = {
  'Nature': undefined,
  'Fonction': undefined,
  'CodRD': undefined,
  'MtReal': undefined,
  'Chapitre': undefined,
  'FI': undefined
};
var LigneBudgetRecord = Record(LigneBudgetKeys);
var SplitLigneBudgetRecord = Record(Object.assign({
  // this field represents the id of the aggregated set the split line belongs to
  splitFor: undefined,
  'Exer': undefined
}, LigneBudgetKeys));
var DocumentBudgetaire = Record({
  'LibelleColl': undefined,
  'Nomenclature': undefined,
  'NatDec': undefined,
  'Exer': undefined,
  'IdColl': undefined,
  'rows': undefined
});
function makeLigneBudgetId(ligneBudget) {
  return [ligneBudget['CodRD'], ligneBudget['Fonction'], ligneBudget['Nature']].join(' ');
}

function xmlDocumentToDocumentBudgetaire (doc, natureToChapitreFI) {
  var BlocBudget = doc.getElementsByTagName('BlocBudget')[0];
  var exer = Number(BlocBudget.getElementsByTagName('Exer')[0].getAttribute('V'));
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
    Object.assign(ret, natureToChapitreFI(exer, ret['CodRD'], ret['Nature']));
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

  return DocumentBudgetaire({
    LibelleColl: doc.getElementsByTagName('LibelleColl')[0].getAttribute('V'),
    Nomenclature: doc.getElementsByTagName('Nomenclature')[0].getAttribute('V'),
    NatDec: BlocBudget.getElementsByTagName('NatDec')[0].getAttribute('V'),
    Exer: exer,
    IdColl: doc.getElementsByTagName('IdColl')[0].getAttribute('V'),
    rows: Set$1(Array.from(xmlRowsById.values()).map(function (xmlRows) {
      var amount = sum(xmlRows.map(function (r) {
        return Number(r['MtReal']);
      }));
      var r = xmlRows[0];
      return LigneBudgetRecord(Object.assign({}, r, {
        'MtReal': amount
      }));
    }))
  });
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
        "symbols": ["NATURE"],
        "postprocess": id
      }, {
        "name": "SUBSET",
        "symbols": ["FONCTION"],
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
        "symbols": [{
          "literal": "C"
        }, "CHAPITRE$ebnf$1"],
        "postprocess": function postprocess(ts) {
          return ts[0] + ts[1].join('');
        }
      }, {
        "name": "NATURE$ebnf$1",
        "symbols": [/[0-9]/]
      }, {
        "name": "NATURE$ebnf$1",
        "symbols": ["NATURE$ebnf$1", /[0-9]/],
        "postprocess": function arrpush(d) {
          return d[0].concat([d[1]]);
        }
      }, {
        "name": "NATURE",
        "symbols": [{
          "literal": "N"
        }, "NATURE$ebnf$1"],
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

function matchesSimple(r, subset) {
  switch (subset) {
    case 'R':
    case 'D':
      return r['CodRD'] === subset;

    case 'F':
    case 'I':
      return r['FI'] === subset;

    case 'RF':
    case 'RI':
    case 'DF':
    case 'DI':
      return r['CodRD'] === subset[0] && r['FI'] === subset[1];
  }

  if (subset.startsWith('N')) return subset.slice(1) === r['Nature'];
  if (subset.startsWith('F')) return r['Fonction'].startsWith(subset.slice(1));
  if (subset.startsWith('C')) return subset.slice(1) === r['Chapitre'];
  console.warn('matchesSubset - Unhandled case', subset);
}

function matchesComplex(r, combo) {
  if (typeof combo === 'string') return matchesSimple(r, combo); // assert(Array.isArray(combo))

  var _combo = _slicedToArray(combo, 3),
      left = _combo[0],
      middle = _combo[1],
      right = _combo[2];

  if (left === '(' && right === ')') return matchesComplex(r, middle);else {
    var operator = middle;

    switch (operator) {
      case '+':
        return matchesComplex(r, left) || matchesComplex(r, right);

      case '*':
        return matchesComplex(r, left) && matchesComplex(r, right);

      case '-':
        return matchesComplex(r, left) && !matchesComplex(r, right);

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

var makeLigneBudgetFilterFromFormula = src(function makeLigneBudgetFilterFromFormula(formula) {
  var parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

  try {
    parser.feed(formula);
    if (parser.results[0] === undefined) return returnFalseFunction;else return src(function (budgetRow) {
      return matchesComplex(budgetRow, parser.results[0]);
    });
  } catch (e) {
    return returnFalseFunction;
  }
});

function makeAggregateFunction(aggregationDescription) {
  function aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode(aggregationDescriptionNode, documentBudgetaire) {
    var id = aggregationDescriptionNode.id,
        name = aggregationDescriptionNode.name,
        children = aggregationDescriptionNode.children,
        formula = aggregationDescriptionNode.formula;
    return children ? // non-leaf
    AggregatedDocumentBudgetaire({
      id: id,
      name: name,
      children: children.map(function (n) {
        return aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode(n, documentBudgetaire);
      })
    }) : // leaf, has .formula
    AggregatedDocumentBudgetaireLeaf({
      id: id,
      name: name,
      elements: documentBudgetaire.rows.filter(makeLigneBudgetFilterFromFormula(formula))
    });
  }

  return function aggregate(docBudg) {
    return aggregationDescriptionNodeToAggregatedDocumentBudgetaireNode(aggregationDescription, docBudg);
  };
}

function makeUnusedLigneBudgetSet(documentBudgetaire, aggregatedDocumentBudgetaire) {
  var leaves = getAggregatedDocumentBudgetaireLeaves(aggregatedDocumentBudgetaire);
  var usedLigneBudgets = Set$1.union(leaves.map(function (l) {
    return l.elements;
  }));
  return documentBudgetaire.rows.filter(function (ligneBudget) {
    return !usedLigneBudgets.has(ligneBudget);
  }).toArray();
}

function makeUsedMoreThanOnceLigneBudgetSet(documentBudgetaire, aggregatedDocumentBudgetaire) {
  var leaves = getAggregatedDocumentBudgetaireLeaves(aggregatedDocumentBudgetaire);
  var aggregationSetsByRow = new Map();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = documentBudgetaire.rows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var ligneBudget = _step.value;
      var aggregationSets = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = leaves[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var aggLeaf = _step2.value;

          if (aggLeaf.elements.has(ligneBudget)) {
            aggregationSets.push(aggLeaf);
          }
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

      if (aggregationSets.length >= 2) {
        aggregationSetsByRow.set(ligneBudget, aggregationSets);
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

function AggregationAnalysis (_ref3) {
  var aggregationDescription = _ref3.aggregationDescription,
      documentBudgetaires = _ref3.documentBudgetaires;
  var aggregate = makeAggregateFunction(aggregationDescription);
  var aggregatedDocumentBudgetaires = documentBudgetaires.map(aggregate);
  var documentBudgetaire = documentBudgetaires[0];
  var aggregatedDocumentBudgetaire = aggregatedDocumentBudgetaires[0];
  var unusedRows = documentBudgetaire ? makeUnusedLigneBudgetSet(documentBudgetaire, aggregatedDocumentBudgetaire) : [];
  var rowsUsedMoreThanOnce = documentBudgetaire ? makeUsedMoreThanOnceLigneBudgetSet(documentBudgetaire, aggregatedDocumentBudgetaire) : [];
  return h("section", null, h("h1", null, "Analyse"), h("p", null, "Il y a ", documentBudgetaire && documentBudgetaire.rows.size, " lignes dans le document budgetaire"), h("h2", null, "Lignes non-utilis\xE9es (", unusedRows.length, ")"), h("table", null, unusedRows.map(function (row) {
    return h("tr", null, h("td", null, row["CodRD"], row["FI"]), h("td", null, "F", row["Fonction"]), h("td", null, "C", row["Chapitre"]), h("td", null, "N", row["Nature"]), h("td", null, row["MtReal"]));
  })), h("h2", null, "Lignes utilis\xE9es plus qu'une fois (", rowsUsedMoreThanOnce.length, ")"), h("table", null, rowsUsedMoreThanOnce.map(function (_ref4) {
    var row = _ref4.row,
        aggregationSets = _ref4.aggregationSets;
    return h("tr", null, h("td", null, row["CodRD"], row["FI"], " F", row["Fonction"], " C", row["Chapitre"], " N", row["Nature"]), h("td", null, aggregationSets.map(function (_ref5) {
      var name = _ref5.name;
      return name;
    }).join(' & ')));
  })));
}

function AggregationDescriptionLeafEditor(_ref) {
  var aggregationDescriptionLeaf = _ref.aggregationDescriptionLeaf,
      aggregatedDocumentBudgetaireCorrespondingNode = _ref.aggregatedDocumentBudgetaireCorrespondingNode,
      onIdChange = _ref.onIdChange,
      onNameChange = _ref.onNameChange,
      onFormulaChange = _ref.onFormulaChange;
  var id = aggregationDescriptionLeaf.id,
      name = aggregationDescriptionLeaf.name,
      formula = aggregationDescriptionLeaf.formula;
  /*
      <input type="text" value=${id} onInput=${onIdChange} />
      <input type="text" value=${name} onInput=${onNameChange} />
  */

  return h("div", {
    class: "formula-editor"
  }, h("h1", null, name, " ", h("small", null, "(", id, ")")), h("div", null, h("strong", null, "Formule"), " ", h("a", {
    class: "help",
    target: "_blank",
    href: "./exemples_formules.html"
  }, "?"), h("input", {
    type: "text",
    value: formula,
    onInput: function onInput(e) {
      return onFormulaChange(e.target.value);
    }
  }), h("table", {
    class: "summary"
  }, h("tr", null, h("td", null, "Nombre d'\xE9l\xE9ments"), h("td", null, h("strong", null, aggregatedDocumentBudgetaireNodeElements(aggregatedDocumentBudgetaireCorrespondingNode).size))), h("tr", null, h("td", null, "Total"), h("td", {
    class: "money-amount"
  }, h("strong", null, aggregatedDocumentBudgetaireNodeTotal(aggregatedDocumentBudgetaireCorrespondingNode).toFixed(2) + '€')))), h("table", {
    class: "formula-rows"
  }, h("thead", null, h("tr", null, ['RDFI', 'Fonction', 'Nature', 'Montant'].map(function (s) {
    return h("th", null, s);
  }))), h("tbody", null, aggregatedDocumentBudgetaireCorrespondingNode.elements.toArray().map(function (r) {
    return h("tr", null, h("td", null, r['CodRD'] + r['FI']), h("td", null, r['Fonction']), h("td", null, r['Nature']), h("td", {
      class: "money-amount"
    }, r['MtReal'].toFixed(2) + '€'));
  })))));
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
      adding: false
    };
    return _this;
  }

  _createClass(MillerColumn, [{
    key: "render",
    value: function render(_ref2, _ref3) {
      var _this2 = this;

      var aggregationDescription = _ref2.aggregationDescription,
          addChild = _ref2.addChild,
          onNodeSelection = _ref2.onNodeSelection,
          selectedChildId = _ref2.selectedChildId;
      var adding = _ref3.adding;
      return h("ol", null, aggregationDescription.children.valueSeq().map(function (node) {
        return h("li", {
          class: [node.id === selectedChildId ? 'selected' : undefined, node.children ? 'subgroup' : 'formula'].filter(function (x) {
            return x;
          }).join(' '),
          onClick: function onClick() {
            return onNodeSelection(node.id);
          }
        }, node.name);
      }).toArray(), h("li", null, adding ? h("form", {
        onSubmit: function onSubmit(e) {
          e.preventDefault();
          addChild({
            id: e.target.querySelector('input[name="id"]').value,
            name: e.target.querySelector('input[name="name"]').value,
            type: e.target.querySelector('input[name="type"]:checked').value
          });
        }
      }, h("label", null, "Identifiant", h("input", {
        autocomplete: "off",
        name: "id"
      })), h("label", null, "Nom", h("input", {
        autocomplete: "off",
        name: "name"
      })), h("section", null, "Type", h("label", null, h("input", {
        defaultChecked: true,
        type: "radio",
        name: "type",
        value: "subgroup"
      }), "Sous-groupe"), h("label", null, h("input", {
        type: "radio",
        name: "type",
        value: "formula"
      }), "Formule")), h("button", {
        type: "submit"
      }, "ok"), h("button", {
        type: "button",
        onClick: function onClick() {
          return _this2.setState({
            adding: false
          });
        }
      }, "annuler")) : h("button", {
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


function MillerColumns(_ref4) {
  var aggregationDescription = _ref4.aggregationDescription,
      aggregatedDocumentBudgetaire = _ref4.aggregatedDocumentBudgetaire,
      selectedList = _ref4.selectedList,
      _ref4$aggregationDesc = _ref4.aggregationDescriptionMutations,
      _addChild = _ref4$aggregationDesc.addChild,
      _onNodeSelection = _ref4$aggregationDesc.selectNode,
      _onFormulaChange = _ref4$aggregationDesc.changeFormula;
  var firstSelectedId = selectedList.first();
  return h("section", {
    class: "miller-columns"
  }, h("h2", null, "Cr\xE9ation/\xE9dition"), h("div", {
    class: "columns"
  }, h(MillerColumn, {
    aggregationDescription: aggregationDescription,
    selectedChildId: firstSelectedId,
    addChild: function addChild(childData) {
      _addChild(aggregationDescription, childData);
    },
    onNodeSelection: function onNodeSelection(id) {
      return _onNodeSelection(id, 0);
    }
  }), selectedList.map(function (id, i) {
    var keyPath = selectedList.slice(0, i + 1).map(function (id) {
      return List(['children', id]);
    }).flatten();
    var node = aggregationDescription.getIn(keyPath);
    return node.children ? h(MillerColumn, {
      aggregationDescription: node,
      selectedChildId: selectedList.get(i + 1),
      addChild: function addChild(childData) {
        _addChild(node, childData);
      },
      onNodeSelection: function onNodeSelection(id) {
        return _onNodeSelection(id, i + 1);
      }
    }) : h(AggregationDescriptionLeafEditor, {
      aggregationDescriptionLeaf: node,
      aggregatedDocumentBudgetaireCorrespondingNode: aggregatedDocumentBudgetaire.getIn(keyPath),
      onFormulaChange: function onFormulaChange(formula) {
        return _onFormulaChange(node, formula);
      }
    });
  }).toArray()));
}

function AggregationDescriptionImportExport(_ref5) {
  var triggerAggregationDescriptionDownload = _ref5.triggerAggregationDescriptionDownload,
      importAggregationDescription = _ref5.importAggregationDescription;
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
      documentBudgetaire = _ref.documentBudgetaire,
      selectedList = _ref.selectedList,
      aggregationDescriptionMutations = _ref.aggregationDescriptionMutations,
      triggerAggregationDescriptionDownload = _ref.triggerAggregationDescriptionDownload,
      importAggregationDescription = _ref.importAggregationDescription;
  return h("div", null, h(AggregationDescriptionEditor, {
    aggregationDescription: aggregationDescription,
    aggregatedDocumentBudgetaire: aggregatedDocumentBudgetaire,
    selectedList: selectedList,
    aggregationDescriptionMutations: aggregationDescriptionMutations,
    triggerAggregationDescriptionDownload: triggerAggregationDescriptionDownload,
    importAggregationDescription: importAggregationDescription
  }), h(AggregationAnalysis, {
    aggregationDescription: aggregationDescription,
    documentBudgetaires: documentBudgetaire ? [documentBudgetaire] : []
  }));
}

function DocumentBudgetaireInput(_ref) {
  var errorMessage = _ref.errorMessage,
      onNewDocumentBudgetaireText = _ref.onNewDocumentBudgetaireText;

  function onChange(e) {
    var file = e.target.files[0];

    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");

      reader.onload = function (e) {
        return onNewDocumentBudgetaireText(e.target.result);
      }; // MISSING error case

    }
  }

  return h("label", null, "Changer de Document Budg\xE9taire ", h("strong", null, "(uniquement M52 2016, 2017 ou 2018)"), h("input", {
    type: "file",
    onChange: onChange
  }));
}

function ContextHeader (_ref2) {
  var documentBudgetaire = _ref2.documentBudgetaire,
      onNewDocumentBudgetaireText = _ref2.onNewDocumentBudgetaireText;
  return h("header", null, h("h1", null, "Agr\xE9gation de Document Budg\xE9taire"), h("section", null, h("h2", null, "Documents Budg\xE9taires"), h("div", null, "Document budg\xE9taire charg\xE9 :", documentBudgetaire ? " ".concat(documentBudgetaire["LibelleColl"], " - ").concat(documentBudgetaire["Nomenclature"], " - ").concat(documentBudgetaire["Exer"]) : ' (aucun)'), h(DocumentBudgetaireInput, {
    onNewDocumentBudgetaireText: onNewDocumentBudgetaireText
  })));
}

var ASYNC_STATUS = Symbol('async status property name');
var STATUS_PENDING = Symbol('async status pending');
var STATUS_ERROR = Symbol('async status error');
var STATUS_VALUE = Symbol('async status value');
function makeAsyncMutationFunctions(statePropName) {
  return {
    setPending: function setPending(state, pendingValue) {
      pendingValue[ASYNC_STATUS] = STATUS_PENDING;
      state[statePropName] = pendingValue;
    },
    setError: function setError(state, error) {
      error[ASYNC_STATUS] = STATUS_ERROR;
      state[statePropName] = error;
    },
    setValue: function setValue(state, value) {
      value[ASYNC_STATUS] = STATUS_VALUE;
      state[statePropName] = value;
    }
  };
}

function makePlanDeCompteURL(docBudg) {
  var _docBudg$querySelecto = docBudg.querySelector('EnTeteBudget Nomenclature').getAttribute('V').split('-'),
      _docBudg$querySelecto2 = _slicedToArray(_docBudg$querySelecto, 2),
      norme = _docBudg$querySelecto2[0],
      sousNorme = _docBudg$querySelecto2[1];

  var année = docBudg.querySelector('BlocBudget Exer').getAttribute('V');
  return "https://dtc-innovation.github.io/plans-de-compte/".concat(année, "/").concat(norme, "/").concat(sousNorme, "/planDeCompte.xml");
}

function _actions (store) {
  return {
    onNewDocumentBudgetaireText: function onNewDocumentBudgetaireText(fileText) {
      Promise.resolve().then(function () {
        return new DOMParser().parseFromString(fileText, "text/xml");
      }).then(function (docBudg) {
        xml(makePlanDeCompteURL(docBudg)).then(function (planDeCompte) {
          return makeNatureToChapitreFI([planDeCompte]);
        }).then(function (natureToChapitreFI) {
          return xmlDocumentToDocumentBudgetaire(docBudg, natureToChapitreFI);
        }).then(store.mutations.testedDocumentBudgetaire.setValue).catch(store.mutations.testedDocumentBudgetaire.setError);
      });
    },
    importAggregationDescription: store.mutations.aggregationDescription.set
  };
}

function mapStateToProps(_ref) {
  var aggregationDescription = _ref.aggregationDescription,
      testedDocumentBudgetaire = _ref.testedDocumentBudgetaire,
      millerColumnSelection = _ref.millerColumnSelection;
  return {
    aggregationDescription: aggregationDescription,
    selectedList: millerColumnSelection,
    aggregatedDocumentBudgetaire: aggregationDescription && testedDocumentBudgetaire && testedDocumentBudgetaire[ASYNC_STATUS] === STATUS_VALUE ? makeAggregateFunction(aggregationDescription)(testedDocumentBudgetaire) : undefined,
    documentBudgetaire: testedDocumentBudgetaire && testedDocumentBudgetaire[ASYNC_STATUS] === STATUS_VALUE ? testedDocumentBudgetaire : undefined
  };
}

function Main (_ref2) {
  var store = _ref2.store;

  var actions = _actions(store);

  var _store$state = store.state,
      testedDocumentBudgetaire = _store$state.testedDocumentBudgetaire,
      aggregationDescription = _store$state.aggregationDescription;
  var docBudg = testedDocumentBudgetaire && testedDocumentBudgetaire[ASYNC_STATUS] === STATUS_VALUE ? testedDocumentBudgetaire : undefined;
  var props = Object.assign({}, store.mutations, {
    // disambiguation with props with the 'aggregationDescription'
    aggregationDescriptionMutations: store.mutations.aggregationDescription,
    triggerAggregationDescriptionDownload: function triggerAggregationDescriptionDownload() {
      var content = JSON.stringify(AggregationDescriptionToJSON(aggregationDescription), null, 2);
      var blob = new Blob([content], {
        type: 'application/json'
      });
      var blobUrl = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.style.position = "absolute"; // getting off document flow
      // making an effort to hide the element as much as possible

      a.style.zIndex = -1;
      a.style.opacity = 0;
      a.setAttribute('href', blobUrl);
      a.setAttribute('download', 'description-agrégation.json');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, mapStateToProps(store.state), actions);
  return h("main", null, h(ContextHeader, {
    documentBudgetaire: docBudg,
    onNewDocumentBudgetaireText: actions.onNewDocumentBudgetaireText
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

var aggregationDescriptionNodeToKeyPath = new WeakMap();

function fillAggregationDescriptionNodeToKeyPath(aggregationDescription) {
  var rootKeyPath = new List();
  aggregationDescriptionNodeToKeyPath.set(aggregationDescription, rootKeyPath);

  (function recursively(aggregationDescription, parentKeyPath) {
    aggregationDescription.children.forEach(function (child) {
      if (!aggregationDescriptionNodeToKeyPath.get(child)) {
        var id = child.id,
            grandChildren = child.children;
        var childKeyPath = parentKeyPath.push('children', id);
        aggregationDescriptionNodeToKeyPath.set(child, childKeyPath);

        if (grandChildren) {
          recursively(child, childKeyPath);
        }
      }
    });
  })(aggregationDescription, rootKeyPath);
}

var store = new Store({
  state: {
    millerColumnSelection: new List(),
    aggregationDescription: undefined,
    testedDocumentBudgetaire: undefined
  },
  mutations: {
    aggregationDescription: {
      set: function set(state, aggregationDescription) {
        fillAggregationDescriptionNodeToKeyPath(aggregationDescription);
        state.aggregationDescription = aggregationDescription;
      },
      addChild: function addChild(state, parent, _ref) {
        var id = _ref.id,
            name = _ref.name,
            type = _ref.type;
        var newNode = type === 'subgroup' ? new AggregationDescription({
          id: id,
          name: name,
          children: new OrderedMap()
        }) : new AggregationDescriptionLeaf({
          id: id,
          name: name,
          formula: ''
        });
        var parentKeyPath = aggregationDescriptionNodeToKeyPath.get(parent);
        var nodeKeyPath = parentKeyPath.push('children', id);
        aggregationDescriptionNodeToKeyPath.set(newNode, nodeKeyPath);
        state.aggregationDescription = state.aggregationDescription.setIn(nodeKeyPath, newNode);
        fillAggregationDescriptionNodeToKeyPath(state.aggregationDescription);
      },
      selectNode: function selectNode(state, nodeId, index) {
        if (state.millerColumnSelection.get(index) === nodeId) {
          state.millerColumnSelection = state.millerColumnSelection.slice(0, index);
        } else {
          state.millerColumnSelection = state.millerColumnSelection.slice(0, index).push(nodeId);
        }
      },
      changeFormula: function changeFormula(state, node, newFormula) {
        var nodeFormulaKeyPath = aggregationDescriptionNodeToKeyPath.get(node).push('formula');
        state.aggregationDescription = state.aggregationDescription.setIn(nodeFormulaKeyPath, newFormula);
        fillAggregationDescriptionNodeToKeyPath(state.aggregationDescription);
      }
    },
    testedDocumentBudgetaire: makeAsyncMutationFunctions('testedDocumentBudgetaire')
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

var FORMULA_MAP = {
  'DEPENSE': 'D',
  'RECETTE': 'R',
  'INVESTISSEMENT': 'I',
  'FONCTIONNEMENT': 'F'
};

function makeFormulaFromMontreuilRows(rows) {
  var rowsByRDFI = new Map();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = rows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var row = _step.value;
      var RDFI = FORMULA_MAP[row['Sens']] + FORMULA_MAP[row['Section']];
      var rdfiRows = rowsByRDFI.get(RDFI);

      if (!rdfiRows) {
        rdfiRows = [];
        rowsByRDFI.set(RDFI, rdfiRows);
      }

      rdfiRows.push(row); // mutating array used as map value
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

  return _toConsumableArray(rowsByRDFI.entries()).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        RDFI = _ref2[0],
        rows = _ref2[1];

    var rowsFormula = rows.map(function (r) {
      // the two following lines seem to have weird characters in the property names
      // I've copied-pasted the values from aggregation-Montreuil-v4
      // if only rewriting by hand via easily-accessible keyboard keys, it does not work :-/
      var fonction = r["Fonction - Code"];
      var nature = r['Nature - Code'];
      return "F".concat(fonction, "*N").concat(nature);
    }).join(' + ');
    return "".concat(RDFI, "*(").concat(rowsFormula, ")");
  }).join(' + ');
}

function getMontreuilNomenclatureRowKey(MontreuilNomenclatureRow) {
  return ['Sens', 'Section', 'Niveau 2 - Catégorie', 'Niveau 3 - Type'].map(function (key) {
    return MontreuilNomenclatureRow[key];
  }).join(' - ');
}

function makeFonctionNatureCombo(fonction, nature) {
  return fonction + '-' + nature;
}

function MontreuilNomenclatureToAggregationDescription(montreuilNomenclature, docBudgs) {
  var map = new Map$1();
  var docBudgsFonctionNatureCombos = new Set();
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = docBudgs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var rows = _step2.value.rows;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = rows[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _step4$value = _step4.value,
              Nature = _step4$value.Nature,
              Fonction = _step4$value.Fonction;
          docBudgsFonctionNatureCombos.add(makeFonctionNatureCombo(Fonction, Nature));
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

  montreuilNomenclature = montreuilNomenclature.filter(function (r) {
    return r["Nature Mvt"] === "REELLE" && docBudgsFonctionNatureCombos.has(makeFonctionNatureCombo(r["Fonction - Code"], r['Nature - Code']));
  });
  console.log('montreuilNomenclature.length', montreuilNomenclature.length);
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = montreuilNomenclature[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var row = _step3.value;
      var key = getMontreuilNomenclatureRowKey(row);
      var set = map.get(key) || new Set$1();
      map = map.set(key, set.add(row));
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

  return _toConsumableArray(map.entries()).map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        name = _ref4[0],
        rows = _ref4[1];

    return {
      name: name,
      formula: makeFormulaFromMontreuilRows(rows),
      montreuilRows: rows
    };
  });
}

store.mutations.aggregationDescription.set(new AggregationDescription({
  id: 'racine',
  name: 'racine',
  children: new OrderedMap()
}));
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
    console.log('docBudg', docBudg.toJS());
    store.mutations.testedDocumentBudgetaire.setValue(docBudg);
    return docBudg;
  }).catch(console.error); // Download Montreuil "Open data nomenclature" CSV and transform it to formulas

  Promise.all([csv$1('./data/agregation-Montreuil-v4.csv'), docBudgP]).then(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        csvData = _ref4[0],
        docBudg = _ref4[1];

    return MontreuilNomenclatureToAggregationDescription(csvData, [docBudg]);
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
  // Download and transform some Compte Administratif
  Promise.all([xml('./data/CA/CA2017BPAL.xml'), xml('./data/plansDeCompte/plan-de-compte-M52-M52-2017.xml').then(function (pdC) {
    return makeNatureToChapitreFI([pdC]);
  })]).then(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        doc = _ref6[0],
        natureToChapitreFI = _ref6[1];

    return xmlDocumentToDocumentBudgetaire(doc, natureToChapitreFI);
  }).then(function (docBudg) {
    store.mutations.testedDocumentBudgetaire.setValue(docBudg);
  }).catch(console.error); // load stored aggregation description

  var storedAggregationDescription = getStoredState();

  if (storedAggregationDescription) {
    console.log('storedAggregationDescription', storedAggregationDescription.toJS());
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
