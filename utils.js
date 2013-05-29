/**
 * utils
 */
var Utils = {
	dump: function() {
	    if (window.diigolet.debug && window.console) {
	    	console.log.apply(console, [].slice.call(arguments));
	    }
	},
	
	fork: function(f) {
		setTimeout(function() {
			f();
		}, 13);
	}
};
var diigoUtils = Utils;
Utils.lang = {
	/**
	 * From YUI, with my love
	 */
	/**
     * Determines whether or not the provided object is an array.
     * Testing typeof/instanceof/constructor of arrays across frame 
     * boundaries isn't possible in Safari unless you have a reference
     * to the other frame to test against its Array prototype.  To
     * handle this case, we test well-known array properties instead.
     * properties.
     * @method isArray
     * @param {any} o The object being testing
     * @return Boolean
     */
    isArray: function(o) { 

        if (o) {
           var l = this;
           return l.isNumber(o.length) && l.isFunction(o.splice) && 
                  !l.hasOwnProperty(o.length);
        }
        return false;
    },

    /**
     * Determines whether or not the provided object is a boolean
     * @method isBoolean
     * @param {any} o The object being testing
     * @return Boolean
     */
    isBoolean: function(o) {
        return typeof o === 'boolean';
    },
    
    /**
     * Determines whether or not the provided object is a function
     * @method isFunction
     * @param {any} o The object being testing
     * @return Boolean
     */
    isFunction: function(o) {
        return typeof o === 'function';
    },
        
    /**
     * Determines whether or not the provided object is null
     * @method isNull
     * @param {any} o The object being testing
     * @return Boolean
     */
    isNull: function(o) {
        return o === null;
    },
        
    /**
     * Determines whether or not the provided object is a legal number
     * @method isNumber
     * @param {any} o The object being testing
     * @return Boolean
     */
    isNumber: function(o) {
        return typeof o === 'number' && isFinite(o);
    },
      
    /**
     * Determines whether or not the provided object is of type object
     * or function
     * @method isObject
     * @param {any} o The object being testing
     * @return Boolean
     */  
    isObject: function(o) {
		return (o && (typeof o === 'object' || this.isFunction(o))) || false;
    },
        
    /**
     * Determines whether or not the provided object is a string
     * @method isString
     * @param {any} o The object being testing
     * @return Boolean
     */
    isString: function(o) {
        return typeof o === 'string';
    },
        
    /**
     * Determines whether or not the provided object is undefined
     * @method isUndefined
     * @param {any} o The object being testing
     * @return Boolean
     */
    isUndefined: function(o) {
        return typeof o === 'undefined';
    },
    
    /**
     * Determines whether or not the property was added
     * to the object instance.  Returns false if the property is not present
     * in the object, or was inherited from the prototype.
     * This abstraction is provided to enable hasOwnProperty for Safari 1.3.x.
     * There is a discrepancy between YAHOO.lang.hasOwnProperty and
     * Object.prototype.hasOwnProperty when the property is a primitive added to
     * both the instance AND prototype with the same value:
     * <pre>
     * var A = function() {};
     * A.prototype.foo = 'foo';
     * var a = new A();
     * a.foo = 'foo';
     * alert(a.hasOwnProperty('foo')); // true
     * alert(YAHOO.lang.hasOwnProperty(a, 'foo')); // false when using fallback
     * </pre>
     * @method hasOwnProperty
     * @param {any} o The object being testing
     * @return Boolean
     */
    hasOwnProperty: function(o, prop) {
        if (Object.prototype.hasOwnProperty) {
            return o.hasOwnProperty(prop);
        }
        
        return !this.isUndefined(o[prop]) && 
                o.constructor.prototype[prop] !== o[prop];
    },
	
	/**
	 * The following are not from YUI!
	 */
	extend: function(/* dst, src1, src2, ... */) {
		var args = [].slice.call(arguments);
		var dst = args.shift();
		
		for (var i = 0, l = args.length, src; src = args[i], i < l; i++) {
			for (var k in src) {
				dst[k] = src[k];
			}
		}
		return dst;
	},
	
	protectiveExtend: function(dst, src) {
		for (var k in src)
			if (dst[k] !== undefined) dst[k] = src[k];
	},
	
	/**
	 * @param {Function} filterFn
	 * filterFn(key) -> newKey
	 * if !newKey, the property is skipped
	 * if newKey === true, the original key is used
	 * else dst[newKey] = src[key]
	 */
	extendFiltered: function(/* dst, src1, src2, ..., srcn, filterFn*/) {
		var args = [].slice.call(arguments),
		dst = args.shift(),
		filterFn = args.pop();
		
		for (var i = 0, l = args.length, src; src = args[i], i < l; i++) {
			for (var k in src) {
				var kk = filterFn(k);
				
				if (kk) {
					dst[kk === true ? k : kk] = src[k];
				}
			}
		}
		return dst;
	},
	
	toArray: function(obj) {
		return [].slice.call(obj);
	},
	
	toBoolean: function(a) {
		//false, undefined, null, 0 and '' evaluate to false. !a is true and false is returned.
		
		//if a evaluates to true, it may be an object(not null), a nonzero number or a string and only for '0' and 'false' we should return false. 
		
		return !a ? false : a != 'false' && a != '0';
	},
	
	each: function(obj, fn, thiz) {
		if (obj.forEach)
			obj.forEach(fn, thiz);
		else
		for (var k in obj) {
			fn.call(thiz, obj[k], k);
		}
	}
};

//map Utils.lang.* to Utils.*
Utils.lang.extend(Utils, Utils.lang);

/**
 * utils.array
 */
Utils.array = {
	findIndex: function(arr, fn, start) {
		start = start || 0;
		for (var i = start, l = arr.length, v; v = arr[i], i < l; i++) {
			if (fn(v)) return i;
		}
		return -1;
	}, 
	
	find: function(arr, fn, start) {
		var i = this.findIndex(arr, fn, start);
		return i > -1 ? arr[i] : null;
	},
	
	/**
	 * Selfmodifying concat
	 * a.concat!(b)
	 */
	concatMe: function (a, b) {
		[].splice.apply(a, [a.length, 0].concat(b));
		return a;
	},
	
	unique: function(arr, fn) {
		var r = [];
	
		for (var i = 0, len = arr.length, v; v = arr[i], i < len; i++) {
			if (!fn) {
				if (r.indexOf(v) == -1)
					r.push(v);
			}
			else if (!this.find(r, function(vv) {return fn(vv, v);}))
				r.push(v);
		}
		return r;
	},
	
	reverse: function(arr) {
		var r = new Array(arr.length);
		for (var i = arr.length - 1, j = 0; i >=0; i--, j++) {
			r[j] = arr[i];
		}
		return r;
	}
};

/**
 * utils.string
 */
Utils.string = {
	/*md52: function(istream) { 

		var ch = Components.classes["@mozilla.org/security/hash;1"]
	                            .createInstance(Components.interfaces.nsICryptoHash);
	         // we want to use the MD5 algorithm
	         ch.init(ch.MD5);
	         // this tells updateFromStream to read the entire file
	         const PR_UINT32_MAX = 0xffffffff;
	         ch.updateFromStream(istream, PR_UINT32_MAX);
	         // pass false here to get binary data back
	         var hash = ch.finish(false);
	         
	         // return the two-digit hexadecimal code for a byte
	         function toHexString(charCode)
	         {
	           return ("0" + charCode.toString(16)).slice(-2);
	         }

	         // convert the binary hash data to a hex string.
	 		var v=[];
			for(i in hash){
				if(typeof hash[i] === "string"){
					var hex=hash.charCodeAt(i);
					var n=toHexString(hex);
					v.push(n);
				}
			}
			var s = v.join("");

	    return s;
	},*/
	md5: function(sMessage) { 
		function RotateLeft(lValue, iShiftBits) {  
			return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));  
		} 
		function AddUnsigned(lX,lY) { 
			var lX4,lY4,lX8,lY8,lResult; 
			lX8 = (lX & 0x80000000); 
			lY8 = (lY & 0x80000000); 
			lX4 = (lX & 0x40000000); 
			lY4 = (lY & 0x40000000); 
			lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF); 
			if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8); 
			if (lX4 | lY4) { 
			if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8); 
			else return (lResult ^ 0x40000000 ^ lX8 ^ lY8); 
			} else return (lResult ^ lX8 ^ lY8); 
		} 
		function F(x,y,z) { return (x & y) | ((~x) & z); } 
		function G(x,y,z) { return (x & z) | (y & (~z)); } 
		function H(x,y,z) { return (x ^ y ^ z); } 
		function I(x,y,z) { return (y ^ (x | (~z))); } 
		function FF(a,b,c,d,x,s,ac) { 
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac)); 
			return AddUnsigned(RotateLeft(a, s), b); 
		} 
		function GG(a,b,c,d,x,s,ac) { 
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac)); 
			return AddUnsigned(RotateLeft(a, s), b); 
		} 
		function HH(a,b,c,d,x,s,ac) { 
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac)); 
			return AddUnsigned(RotateLeft(a, s), b); 
		} 
		function II(a,b,c,d,x,s,ac) { 
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac)); 
			return AddUnsigned(RotateLeft(a, s), b); 
		} 
		function ConvertToWordArray(sMessage) { 
			var lWordCount; 
			var lMessageLength = sMessage.length; 
			var lNumberOfWords_temp1=lMessageLength + 8; 
			var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64; 
			var lNumberOfWords = (lNumberOfWords_temp2+1)*16; 
			var lWordArray=Array(lNumberOfWords-1); 
			var lBytePosition = 0; 
			var lByteCount = 0; 
			while ( lByteCount < lMessageLength ) { 
				lWordCount = (lByteCount-(lByteCount % 4))/4; 
				lBytePosition = (lByteCount % 4)*8; 
				lWordArray[lWordCount] = (lWordArray[lWordCount] | (sMessage.charCodeAt(lByteCount)<<lBytePosition)); 
				lByteCount++; 
			} 
			lWordCount = (lByteCount-(lByteCount % 4))/4; 
			lBytePosition = (lByteCount % 4)*8; 
			lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition); 
			lWordArray[lNumberOfWords-2] = lMessageLength<<3; 
			lWordArray[lNumberOfWords-1] = lMessageLength>>>29; 
			return lWordArray; 
		}
		 
		function WordToHex(lValue) { 
			var WordToHexValue="",WordToHexValue_temp="",lByte,lCount; 
			for (lCount = 0;lCount<=3;lCount++) { 
				lByte = (lValue>>>(lCount*8)) & 255; 
				WordToHexValue_temp = "0" + lByte.toString(16); 
				WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2); 
			} 
			return WordToHexValue; 
		} 
	    var x=Array(); 
	    var k,AA,BB,CC,DD,a,b,c,d; 
	    var S11=7, S12=12, S13=17, S14=22; 
	    var S21=5, S22=9 , S23=14, S24=20; 
	    var S31=4, S32=11, S33=16, S34=23; 
	    var S41=6, S42=10, S43=15, S44=21; 
	    // Steps 1 and 2.  Append padding bits and length and convert to words 
	    x = ConvertToWordArray(sMessage); 
	    // Step 3.  Initialise 
	    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476; 
	    // Step 4.  Process the message in 16-word blocks 
	    for (k=0;k<x.length;k+=16) { 
	        AA=a; BB=b; CC=c; DD=d; 
	        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478); 
	        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756); 
	        c=FF(c,d,a,b,x[k+2], S13,0x242070DB); 
	        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE); 
	        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF); 
	        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A); 
	        c=FF(c,d,a,b,x[k+6], S13,0xA8304613); 
	        b=FF(b,c,d,a,x[k+7], S14,0xFD469501); 
	        a=FF(a,b,c,d,x[k+8], S11,0x698098D8); 
	        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF); 
	        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1); 
	        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE); 
	        a=FF(a,b,c,d,x[k+12],S11,0x6B901122); 
	        d=FF(d,a,b,c,x[k+13],S12,0xFD987193); 
	        c=FF(c,d,a,b,x[k+14],S13,0xA679438E); 
	        b=FF(b,c,d,a,x[k+15],S14,0x49B40821); 
	        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562); 
	        d=GG(d,a,b,c,x[k+6], S22,0xC040B340); 
	        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51); 
	        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA); 
	        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D); 
	        d=GG(d,a,b,c,x[k+10],S22,0x2441453); 
	        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681); 
	        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8); 
	        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6); 
	        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6); 
	        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87); 
	        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED); 
	        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905); 
	        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8); 
	        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9); 
	        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A); 
	        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942); 
	        d=HH(d,a,b,c,x[k+8], S32,0x8771F681); 
	        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122); 
	        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C); 
	        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44); 
	        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9); 
	        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60); 
	        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70); 
	        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6); 
	        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA); 
	        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085); 
	        b=HH(b,c,d,a,x[k+6], S34,0x4881D05); 
	        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039); 
	        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5); 
	        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8); 
	        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665); 
	        a=II(a,b,c,d,x[k+0], S41,0xF4292244); 
	        d=II(d,a,b,c,x[k+7], S42,0x432AFF97); 
	        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7); 
	        b=II(b,c,d,a,x[k+5], S44,0xFC93A039); 
	        a=II(a,b,c,d,x[k+12],S41,0x655B59C3); 
	        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92); 
	        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D); 
	        b=II(b,c,d,a,x[k+1], S44,0x85845DD1); 
	        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F); 
	        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0); 
	        c=II(c,d,a,b,x[k+6], S43,0xA3014314); 
	        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1); 
	        a=II(a,b,c,d,x[k+4], S41,0xF7537E82); 
	        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235); 
	        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB); 
	        b=II(b,c,d,a,x[k+9], S44,0xEB86D391); 
	        a=AddUnsigned(a,AA); b=AddUnsigned(b,BB); c=AddUnsigned(c,CC); d=AddUnsigned(d,DD); 
	    } 
	    // Step 5.  Output the 128 bit digest 
	    var temp= WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d); 
	    return temp.toLowerCase(); 
	},

	strip: function(s) {
		return s.replace(/^\s+/, '').replace(/\s+$/, '');
	},
	
	trim: function(s) {return this.strip(s);},
	
	/**
	 * Leading and trailing
	 * whitespace is removed, and consecutive whitespace is replaced by a single
	 * space.
	 */
	strip2: function(s) {
		return s.replace(/^\s+/, "")
                .replace(/\s+$/, "")
                .replace(/\s+/g, " ");
	},
	
	trim2: function(s) {return this.strip2(s);},
	
	evalTpl: function(s, data) {
		if (data.toTemplateReplacements)
			data = data.toTemplateReplacements();
			
		return s.replace(/(^|.|\r|\n)(#\{(.*?)\})/g, function(m, m1, m2, m3) {
			if (data == null) return '';
  				
			//escape sequence
			var before = m1 || '';
			if (before == '\\') return m2;
			  
			var ctx = data, expr = m3;
			var pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/, match = pattern.exec(expr);
			if (match == null) return '';
			
			while (match != null) {
				var comp = match[1][0] == '[' ? match[2].replace(/\\\\]/g, ']') : match[1];
				ctx = ctx[comp];
				if (null == ctx || '' == match[3]) break;
				expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
			    match = pattern.exec(expr);
			}
			  
			return before + (ctx == null ? '' : String(ctx));
		})
	},
	
	parseQuery: function(s, separator) {
	    var match = Utils.string.strip(s).match(/([^?#]*)(#.*)?$/);
	    if (!match) return { };
	    
	    var hash = {};
	    Utils.each(match[1].split(separator || '&'), function(pair) {
	      if ((pair = pair.split('='))[0]) {
	        var key = decodeURIComponent(pair.shift());
	        var value = pair.length > 1 ? pair.join('=') : pair[0];
	        if (value != undefined) value = decodeURIComponent(value);
	        
	        if (key in hash) {
	          if (!Utils.isArray(hash[key])) hash[key] = [hash[key]];
	          hash[key].push(value);
	        }
	        else hash[key] = value;
	      }
	    });
	    
	    return hash;
	},
	
	toQueryString: function(obj) {
		var add = function(key, value) {
		  key = encodeURIComponent(key);
		  if (value === undefined) parts.push(key);
		  else parts.push(key + '=' + (value == null ? '' : encodeURIComponent(value)));
			};
  
		    var parts = [];
		    
		    Utils.each(obj, function(value, key) {
		      if (!key) return;
		      
		      if (value && typeof value == 'object') {
	        if (Utils.isArray(value)) Utils.each(value, function(value) {
	          add(key, value);
	        });
	        return;
	      }
	      add(key, value);
	    });
	    
	    return parts.join('&');
	},
	
	/**
	 * http://simonwillison.net/2006/Jan/20/escape/
	 */
	escapeRegexp: function(text) {
	  if (!arguments.callee.sRE) {
	    var specials = [
	      '/', '.', '*', '+', '?', '|',
	      '(', ')', '[', ']', '{', '}', '\\'
	    ];
	    arguments.callee.sRE = new RegExp(
	      '(\\' + specials.join('|\\') + ')', 'g'
	    );
	  }
	  return text.replace(arguments.callee.sRE, '\\$1');
	},
	
	stripTags: function(s) {
		return s.replace(/<\/?[^>]+>/gi, '').replace(/[<>]/g, '');
	},
	
	stripScripts: function(s) {
  	return s.replace(new RegExp('<script[^>]*>([\\S\\s]*?)<\/script>', 'img'), '');
  },
  
  scan: function(s, pattern, func) {
  	if (!pattern.global) throw 'string.scan: pattern is not global';
  	
  	var a;
		while (a = pattern.exec(s)) {
			func(a);
		}
  },
  
  /**
   * In javascript, ''.split('') returns [] but ''.split(',') returns ['']
   * This method first strips the string and splits it. If the stripped string is empty, [] is returned
   */
  split: function(s, by) {
  	s = this.strip(s || '');
  	
  	return s ? s.split(by) : [];
  },
  
  truncate: function(s, maxLen, ellipsis) {
  	if (s.length <= maxLen) return s;
  	if ((typeof ellipsis) != 'string') ellipsis = '...';
  	
  	return s.substr(0, maxLen - ellipsis.length) + ellipsis;
  }
};

Utils.url = {
	/**
	 * Tells whether a is a subdomain of b
	 */
	isSubDomainOf: function(a, b) {
		
	}
};


/**
 * utils.dom
 */
Utils.dom = {
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
	 //FIXME
//	build: function(document) {
//	   var ret = [], a = [].slice.call(arguments, 1), e, o, i=0, j;
//	      a = a[0] instanceof Array ? a[0] : a;
//	      for (; i<a.length; i++) {
//	      if (a[i+1] instanceof Object) {
//	         e = ret[ret.length] = document.createElement(a[i]);
//	         for (j in a[++i]) { e.setAttribute(j, a[i][j]); }
//	         if (a[i+1] instanceof Array) {
//	            o = arguments.callee(document, a[++i]);
//	            for (j=0; j<o.length; j++) { e.appendChild(o[j]); }
//	         }
//	      } else { ret[ret.length] = document.createTextNode(a[i]); }
//	   }
//	   return ret;
//	},
	
	build2: function() {
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
		return this.build2(tag, attrs, children)[0];
	},
	
	/**
	 * Whether a is a child node of b
	 */
	isChildOf: function(a, b) {
		var p = a;
		while (p && (p = p.parentNode))
			if (p == b) return true;
		return false;
	},
	
	HTML_addCSS: function(doc, cssText, id) {
//		var style = doc.defaultView.s = this.build( doc,
//			'style', {type: 'css/text'}, [cssText]
//		);
		
		var style = doc.createElement('style');
		style.setAttribute('type', 'text/css');
		if (id) style.setAttribute('id', id);
		style.appendChild(doc.createTextNode(cssText));
		
		(doc.getElementsByTagName('head')[0] || doc.body).appendChild(style);
		//doc.getElementsByTagName('head')[0].appendChild(doc.createTextNode(cssText));
	}//,
	
//	HTML_addScript: function(doc, src) {
//		var script = doc.createElement('script');
//		script.setAttribute('type', 'text/javascript');
//		script.setAttribute('src', src);
//		
//		(doc.getElementsByTagName('head')[0] || doc.body)
//		.appendChild(script);
//	}
};


/**
 * Parses a color string
 * Returns {r: xx, g: xx, b:xx}
 * Taken from jqury plugin interface2
 */
function parseColor(color) {
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
}

function normalizeUrl(url) {
	url = url.trim();
	//remove hash
	if (url.lastIndexOf('#') > 0) {
		url = url.substr(0, url.lastIndexOf('#'));
	} 
	//remove trailing '/'
	if (url.slice(-1) == '/') {
		url = url.slice(0, -1);
	}
	
	return url;
}



function parseDomain(url) {
	// add scheme is missing
	if (!/^[^:\/?#]+:\/\//.test(url)) {
		url = 'http://' + url; 
	}
    var m = url.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);
    return m[4].toLowerCase().trim();
}
/**
 * Tells whether the current page is the home page of a website.
 * Used for home page restriction
 */
function isHomePage() {
	var p = window.location.pathname.toLowerCase();
	if (!p || p == '/') return true;
	var m = p.match(/^\/([^\.]+)\.(.*)$/);
	return m && m.length == 3 
		? 
			$.inArray(m[1], ['default', 'index', 'home']) > -1 
			&& $.inArray(m[2], ['htm', 'html', 'shtml', 'php', 'jsp', 'asp', 'aspx', 'cfm']) > -1 
		: 
			false;
	
}

/*% if false %*/
//popupWindow('/exec/obidos/subst/misc/super-saver-shipping-pop-up.html/ref=mk_gship_dp/002-0782312-4180045','SuperSaverShipping','width=550,height=550,resizable=1,scrollbars=1,toolbar=0,status=0');
//function popupWindow(url, name, options) { 
//	window.open(url, name, options).focus(); 
//}
//
//function formatDate(date) {
//	function pad(n) {
//		return n < 10 ? '0' + n : n;
//	}
//	return pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + '-' + date.getFullYear();
//}
/*% end %*/