import Bouture from 'https://cdn.jsdelivr.net/gh/DavidBruant/bouture@13cb6c683fa87e5feea574311dcda6353489bb3b/bouture.js';

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

            return id;
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

function parser(type) {
  return function (input, init) {
    return text(input, init).then(function (text) {
      return new DOMParser().parseFromString(text, type);
    });
  };
}

var xml = parser("application/xml");

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
    ligneBudgetIsInChapitre: function ligneBudgetIsInChapitre(_ref2, chapitre) {
      var CodRD = _ref2.CodRD,
          Nature = _ref2.Nature;
      var chapitreCodeByNature = CodRD === 'R' ? chapitreCodeByNatureR : chapitreCodeByNatureD;
      var chapitreCode = chapitreCodeByNature.get(Nature);
      return chapitreCode === chapitre;
    },
    ligneBudgetIsInCompte: function ligneBudgetIsInCompte(_ref3, compte) {
      var Nature = _ref3.Nature;
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
    ligneBudgetIsInFonction: function ligneBudgetIsInFonction(_ref4, fonction) {
      var Fonction = _ref4.Fonction;
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

function makeTable(rows, year, planDeCompte) {
  return Bouture.section([Bouture.h1('CA Gironde ', year), Bouture.h2(rows.length, ' elements | ', sum(rows.map(function (r) {
    return r['MtReal'];
  })).toFixed(2) + '€'), Bouture.table([Bouture.thead.tr(['RD', 'FI', 'Fonction', 'Nature', 'Montant'].map(function (t) {
    return Bouture.th(t);
  })), Bouture.tbody(rows.map(function (r) {
    return Bouture.tr([Bouture.td(r['CodRD']), Bouture.td(planDeCompte.ligneBudgetFI(r)), Bouture.td(r['Fonction']), Bouture.td(r['Nature']), Bouture.td(r['MtReal'].toFixed(2) + '€')]);
  }))])]);
}

var planDeCompteP = xml('./data/plansDeCompte/plan-de-compte-M52-M52-2017.xml').then(fromXMLDocument);
var docBudgP = xml('./data/CA/CA2017BPAL.xml').then(xmlDocumentToDocumentBudgetaire).catch(console.error);
docBudgP.then(function (docBudg) {
  return console.log('docBudg', docBudg);
});
document.addEventListener('DOMContentLoaded', function (e) {
  var input = document.body.querySelector('input');
  Promise.all([docBudgP, planDeCompteP]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        docBudg = _ref2[0],
        planDeCompte = _ref2[1];

    function makeOutputFromFormula(formula, planDeCompte) {
      var filter = makeLigneBudgetFilterFromFormula(formula, planDeCompte);
      return Bouture.output([makeTable(docBudg['rows'].filter(filter), docBudg['Exer'], planDeCompte)]).getElement();
    }

    var memzMakeOutputFromFormula = memoize$1(makeOutputFromFormula);
    var changeHashTimeout;
    input.addEventListener('input', function (e) {
      var formula = e.target.value.trim();
      document.body.querySelector('output').replaceWith(memzMakeOutputFromFormula(formula, planDeCompte)); // save in hash if formula stayed unchanged for 3secs

      clearTimeout(changeHashTimeout);
      changeHashTimeout = setTimeout(function () {
        location.hash = encodeURIComponent(formula);
      }, 3000);
    });
  });

  function hashUpdate() {
    var hashValue = decodeURIComponent(location.hash.slice(1));

    if (hashValue && hashValue !== input.value) {
      input.value = hashValue;
      input.dispatchEvent(new Event('input'));
    }
  } // empty input (sometimes filled with pre-refresh value)


  input.value = "";
  input.focus(); // initialize input vith hash value

  Promise.all([docBudgP, planDeCompteP]).then(hashUpdate);
  window.addEventListener('hashchange', hashUpdate); // Create examples list

  var examples = [{
    formula: 'D',
    description: 'toutes les dépenses'
  }, {
    formula: 'R',
    description: 'toutes les recettes'
  }, {
    formula: 'RI',
    description: "toutes les recettes d'investissement"
  }, {
    formula: 'DF',
    description: 'toutes les dépenses de fonctionnement'
  }, {
    formula: 'DF∩F4',
    description: 'toutes les dépenses de fonctionnement de la fonction 4'
  }, {
    formula: 'DF∩(F4 ∪ F5)',
    description: 'toutes les dépenses de fonctionnement des fonctions 4 et 5'
  }, {
    formula: 'DF∩(C64111 ∪ C6451)',
    description: 'toutes les dépenses de fonctionnement des natures 64111 et 6451 (salaire + URSSAF)'
  }, {
    formula: 'DF∩(C64111 ∪ C6451)∩F52',
    description: 'toutes les dépenses de fonctionnement salaires+URSSAF lié à la fonction 52 (Personnes handicapées)'
  }, {
    formula: 'DF∩((F50∩(C64121 ∪ C64126)) ∪ (F51 - C6526))',
    description: 'Gironde - social - enfance'
  }, {
    formula: 'RI∩Ch16',
    description: "toutes les recettes d'investissement du chapitre 16 (emprunts)"
  }, {
    formula: 'RF∩(C7478141 ∪ C7478142 ∪ C74788∩F53∩Ann2016)',
    description: "Gironde - recettes de fonctionnement - Conf\xE9rence des financeurs"
  }, {
    formula: 'DF∩C60 - (F4∪F5∪F8∪F621)',
    description: "Gironde - d\xE9pense de fonctionnement - Achats et fournitures"
  }];
  var ul = Bouture.ul(examples.map(function (_ref3) {
    var formula = _ref3.formula,
        description = _ref3.description;
    return Bouture.li([Bouture.a({
      href: "#".concat(encodeURIComponent(formula))
    }).code(formula), Bouture.span(" : ".concat(description))]);
  })).getElement();
  document.body.querySelector('ul.examples').replaceWith(ul);
}, {
  once: true
});
