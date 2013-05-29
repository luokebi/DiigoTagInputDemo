//logging
var logLevels = ['debug', 'info', 'error'];

function log(params, level) {
    //if (D.logLevel == 'never') return; //return quickly
	try{
        var i = logLevels.indexOf(level);
        var j = logLevels.indexOf(D.logLevel);
        	if (i > -1 && j > -1 && i >= j) {
        	   if (window.console) {
        	       console.log.apply(console, params);
        	   }
        	}
	}catch(e){}
}

function getOffset(oElement){
	var left = 0;
	var  top = 0;
	while(oElement && !isNaN(oElement.offsetLeft) && !isNaN(oElement.offsetTop)){
		left += oElement.offsetLeft;
		top += oElement.offsetTop;
		oElement = oElement.offsetParent;
	}

	return{
		left:left,
		top:top
	};
}

function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

function debug() {
	var args = Array.prototype.slice.call(arguments);
	args.unshift('[Diigolet]');
	log(args, 'debug');
}
function info() {
	var args = Array.prototype.slice.call(arguments);
	args.unshift('[Diigolet]');
	console.log(args, 'info');
}
function error() {
	var args = Array.prototype.slice.call(arguments);
	args.unshift('[Diigolet Error!!!]');
	console.log(args, 'error');
}
function assert(condition) {
	var args = Array.prototype.slice.call(arguments);
	args.unshift('[Diigolet Assertion failed!!!]');
	if (!condition)
		console.log(args, 'error');
}

//lang
function extend(/* dst, src1, src2, ... */) {
	var args = [].slice.call(arguments);
	var dst = args.shift();

	for (var i = 0, l = args.length, src; src = args[i], i < l; i++) {
		for (var k in src) {
			dst[k] = src[k];
		}
	}
	return dst;
}

/**
 * e.g. extendThese(bookmark, data, ['url', 'url_id', 'title']);
 */
function extendThese(dst, src, properties) {
	for (var i = 0, l = properties.length, prop; prop = properties[i], i < l; i++) {
		dst[prop] = src[prop];
	}
	return dst;
}

//function curry1(fn, args, thiz) {
//	return function() {
//		return fn.apply(thiz, args.concat([].slice.call(arguments)));
//	}
//}

//array
//%w{aaa bbb}
function $w(s, sep) {
	sep = sep || ' ';
	return s.split(sep);
}

function forEach(obj, fn, z) {
	if (obj.length !== undefined)
		for (var i = 0, l = obj.length; i < l; i++)
			fn.call(z, obj[i], i);
	else
		for (var i in obj)
			fn.call(z, obj[i], i);
}

function filter(arr, fn, z) {
	var r = [];
	for (var i = 0, l = arr.length; i < l; i++)
  	if (fn.call(z, arr[i], i)) r.push(arr[i]);

	return r;
}

function map(arr, fn, z) {
	var l = arr.length, r = new Array(l);
	for (var i = 0; i < l; i++)
  	r[i] = fn.call(z, arr[i], i);

	return r;
}

function some(arr, fn, z) {
	for (var i = 0, l = arr.length; i < l; i++)
  	if (fn.call(z, arr[i], i)) return true;

	return false;
}

/**
 * null values are discarded
 */
function map2(arr, fn, z) {
	var l = arr.length, r = [], t;
	for (var i = 0; i < l; i++) {
  	t = fn.call(z, arr[i], i);
		if (t !== null) r.push(t);
  }

	return r;
}

function findIndex(arr, fn, start) {
	start = start || 0;
	var isFunc = typeof fn == 'function';
	for (var i = start, l = arr.length, v; v = arr[i], i < l; i++) {
		if (isFunc ? fn(v) : v == fn) return i;
	}
	return -1;
}

function find(arr, fn, start) {
	var i = findIndex(arr, fn, start);
	return i > -1 ? arr[i] : null;
}

//http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:indexOf#Compatibility
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

/**
 * Returns a copy
 *
 */
function unique(arr, fn) {
	var r = [];

	for (var i = 0, len = arr.length, v; v = arr[i], i < len; i++) {
		if (!fn) {
			if (r.indexOf(v) == -1)
				r.push(v);
		}
		else if (!find(r, function(vv) {return fn(vv, v);}))
			r.push(v);
	}
	return r;
}

//returns a copy. does not modify
function reverse(arr) {
	var r = new Array(arr.length);
	for (var i = arr.length - 1, j = 0; i >=0; i--, j++) {
		r[j] = arr[i];
	}
	return r;
}

//string

//http://blog.stevenlevithan.com/archives/faster-trim-javascript
//trim12
function trim (str) {
	var	str = str.replace(/^\s\s*/, ''),
		ws = /\s/,
		i = str.length;
	while (ws.test(str.charAt(--i))) {};
	return str.slice(0, i + 1);
}

function scan(s, pattern, func) {
  	if (!pattern.global) throw 'string.scan: pattern is not global';

  	var a;
		while (a = pattern.exec(s)) {
			func(a);
		}
  }

function parseDomain(url) {
	// add scheme is missing
	if (!/^[^:\/?#]+:\/\//.test(url)) {
		url = 'http://' + url;
	}
    var m = url.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);
    return trim(m[4].toLowerCase());
}

//gsub and evalTpl
//ported from Prototype
function str_interpret(value) {
  return value == null ? '' : String(value);
}

function gsub(str, pattern, replacement) {
  var result = '', source = str, match;
  //replacement = arguments.callee.prepareReplacement(replacement);

  while (source.length > 0) {
    if (match = source.match(pattern)) {
      result += source.slice(0, match.index);
      result += str_interpret(replacement(match));
      source  = source.slice(match.index + match[0].length);
    } else {
      result += source, source = '';
    }
  }
  return result;
}

var tplPattern = /(^|.|\r|\n)(#\{(.*?)\})/;
function evalTpl(tpl, object) {
//	if (Object.isFunction(object.toTemplateReplacements))
//    object = object.toTemplateReplacements();

  return gsub(tpl, tplPattern, function(match) {
    if (object == null) return '';

    var before = match[1] || '';
    if (before == '\\') return match[2];

    var ctx = object, expr = match[3];
    var pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
    match = pattern.exec(expr);
    if (match == null) return before;

    while (match != null) {
      var comp = match[1].indexOf('[') === 0 ? gsub(match[2], '\\\\]', ']') : match[1];
      ctx = ctx[comp];
      if (null == ctx || '' == match[3]) break;
      expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
      match = pattern.exec(expr);
    }

    return before + str_interpret(ctx);
  });
}

//dom
function $html(html) {
    return $(html); // jquery is already optimized for this
//	var o= $.clean([trim(html)]);
//	return new $().setArray(o);
}


function $id(id) {
	return $('#' + id);
}

/**
 *
 * @param {String} s String or Array
 */
function blank(s) {
    return !s || s.length == 0 || (s.match ? !!s.match(/^\s*$/) : true);
}

// desc = nonblank(txt) || 'default'
/**
 * Returns null if s is empty, otherwise s
 * @param {Object} s
 */
function nonblank(s) {
    return blank(s) ? null : s;
}

var Utils = {
	/**
	 * Parses a color string
	 * Returns {r: xx, g: xx, b:xx}
	 * Taken from jqury plugin interface2
	 */
	 parseColor: function(color) {
		var namedColors = {
			aqua:[0,255,255],
			azure:[240,255,255],
			beige:[245,245,220],
			black:[0,0,0],
			blue:[0,0,255],
			brown:[165,42,42],
			cyan:[0,255,255],
			darkblue:[0,0,139],
			darkcyan:[0,139,139],
			darkgrey:[169,169,169],
			darkgreen:[0,100,0],
			darkkhaki:[189,183,107],
			darkmagenta:[139,0,139],
			darkolivegreen:[85,107,47],
			darkorange:[255,140,0],
			darkorchid:[153,50,204],
			darkred:[139,0,0],
			darksalmon:[233,150,122],
			darkviolet:[148,0,211],
			fuchsia:[255,0,255],
			gold:[255,215,0],
			green:[0,128,0],
			indigo:[75,0,130],
			khaki:[240,230,140],
			lightblue:[173,216,230],
			lightcyan:[224,255,255],
			lightgreen:[144,238,144],
			lightgrey:[211,211,211],
			lightpink:[255,182,193],
			lightyellow:[255,255,224],
			lime:[0,255,0],
			magenta:[255,0,255],
			maroon:[128,0,0],
			navy:[0,0,128],
			olive:[128,128,0],
			orange:[255,165,0],
			pink:[255,192,203],
			purple:[128,0,128],
			red:[255,0,0],
			silver:[192,192,192],
			white:[255,255,255],
			yellow:[255,255,0]
		};
		if (namedColors[color])
			return {
				r: namedColors[color][0],
				g: namedColors[color][1],
				b: namedColors[color][2]
			};
		else if (result = /^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/.exec(color))
			return {
				r: parseInt(result[1]),
				g: parseInt(result[2]),
				b: parseInt(result[3])
			};
		else if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)$/.exec(color))
			return {
				r: parseFloat(result[1])*2.55,
				g: parseFloat(result[2])*2.55,
				b: parseFloat(result[3])*2.55
			};
		else if (result = /^#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])$/.exec(color))
			return {
				r: parseInt("0x"+ result[1] + result[1]),
				g: parseInt("0x" + result[2] + result[2]),
				b: parseInt("0x" + result[3] + result[3])
			};
		else if (result = /^#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/.exec(color))
			return {
				r: parseInt("0x" + result[1]),
				g: parseInt("0x" + result[2]),
				b: parseInt("0x" + result[3])
			};
		else return {r: 255, g: 255, b: 255};
	},

	dom: {
		/**
		 * http://mg.to/2006/02/27/easy-dom-creation-for-jquery-and-prototype#comment-176
		 * bulid(
	     * 'table', { 'class':"MyTable" }, [
	     * 'tbody', {}, [
	     *    'tr', {}, [
	     *       'td', { 'class':"MyTableCol1" }, [ "howdy" ],
	     *       'td', { 'class':"MyTableCol2" }, [
	     *          "Link:", 'a', { 'class':"MyLink", 'href':"http://www.example.com" }, ["example.com"] ] ] ] ]
	     * )
		 */
		build: function() {
		   var ret = [], a = arguments, e, o, i=0, j;
		      a = a[0] instanceof Array ? a[0] : a;
		      for (; i<a.length; i++) {
		      if (a[i+1] instanceof Object) {
		         e = ret[ret.length] = document.createElement(a[i]);
		         for (j in a[++i]) { e.setAttribute(j, a[i][j]); }
		         if (a[i+1] instanceof Array) {
		            o = arguments.callee(a[++i]);
		            for (j=0; j<o.length; j++) { e.appendChild(o[j]); }
		         }
		      } else { ret[ret.length] = document.createTextNode(a[i]); }
		   }
		   return ret;
		},

		buildOne: function(tag, attrs, children) {
			return this.build(tag, attrs, children)[0];
		},

		getSelection: function() {
			return window.getSelection ? window.getSelection().toString() : document.getSelection ? document.getSelection()  : document.selection.createRange().text;
		}
	},

	content2Html: function(c) {
		return this.safeHtml(c).replace(/\n/g, '<br/>');
	},

    safeHtml: function(html) {
        // see prototype escapeHTML
        return html.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
};

var IEventDispatcher = {
	mixin: function(o) {
		extendThese(o, this, $w('addEventListener removeEventListener fireEvent _resetEvents'));
		o._resetEvents();
	},

	addEventListener: function(eventName, listener) {
		if (!this._events[eventName])
			this._events[eventName] = [];

		var listenerList = this._events[eventName];
		if (listenerList.indexOf(listener) == -1)
			listenerList.push(listener);
	},

	removeEventListener: function(eventName, listener) {
		var listenerList = this._events[eventName];
		if (listenerList) {
			if (arguments.length == 2) {
				//listener provided
				var i = listenerList.indexOf(listener);
				if (i > -1) {
					listenerList.splice(i);
				}
			} else {
				//listener provided, remove all
				delete this._events[eventName];
			}
		}
	},

	_resetEvents: function() {
		this._supressEvents = false;
		this._events = {};
	},

	fireEvent: function(eventName, paramArray) {
		if (this._supressEvents) return;

		debug('[event]', eventName);
		var listenerList = this._events[eventName];
		if (listenerList) {
			for (var i = 0, listener, len = listenerList.length; listener = listenerList[i], i < len; i++) {
				(typeof listener == 'function' ? listener : listener['on' + eventName])
				.apply(listener, paramArray);
			}
		}
	}
};
