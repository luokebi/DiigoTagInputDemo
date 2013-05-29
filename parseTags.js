//parsing tag input
var ParseTags = {
	/**
	 * Quotes a single tag
	 */
	quoteTag: function (tag) {
		tag = tag
		.replace(/"/g, "'")
		.replace(/\s+/g, ' ')
		.replace(/^\s+|\s+$/g, '');
		
		if (tag.match(/\s+|,/)) {
			tag = '"' + tag + '"';
		}
		return tag;
	},
	
	//input text => tag array
	//tags input: comma or space separated. double quotes allowed
	//merge quoted if necessary
	//TEST: 'a b c' => ['a', 'b', 'c']
	//TEST: 'a,b,c' => ['a', 'b', 'c']
	//TEST: 'a b,c' => ['a', 'b', 'c']
	//TEST: 'a "b,c"' => ['a', 'bc']
	//TEST: '"a b" c' => ['a b', 'c']
	//TEST: '"a b c' => ['abc']
	parseTags: function (strTags, validate) {
		var stack = [], tags = [];
		var begin_delimiter = false;
		
		for (var i = 0, len = strTags.length, c; c = strTags.charAt(i), i < len; i++) {
			if (c == '"') {
				if (!begin_delimiter) 
					begin_delimiter = true;
				else {
					begin_delimiter = false;
					clearStack();
				}
			} else {
				if (begin_delimiter) {
					stack.push(c);
				} else {
					if (/\s/.test(c) || c == ',') 
						clearStack();
					else {
						stack.push(c);
					}
				}
			}
		}
		
		clearStack(); //if there is unclosed delimiter
		
		if (validate) 
			tags = map2(unique(tags), function(t) {return trim(t) || null;});
		return tags;
		
		function clearStack() {
			if (stack.length > 0) {
		  	tags.push(stack.join(''));
		  	stack.length = 0;
		  }
		}
		
	},
	
	/**
	 * tag array => input text
	 */
	unparseTags: function (tagArray, joinBy) {
		joinBy = joinBy || ' ';
		
		return map(tagArray, function(t) {return this.quoteTag(t);}, this).join(joinBy);
	}
};


function placeCursorAtLast(input){
    var pos = input.value.length;
    setTimeout(function() {
        placeInputCursor(input, pos);

    },13)
}

function placeInputCursor(inputEle, pos){
    var ele = inputEle;
    ele.focus();
    if(ele.createTextRange) {
        /* Create a TextRange, set the internal pointer to
         a specified position and show the cursor at this
         position
         */
        var range = ele.createTextRange();
        range.move("character", pos);
        range.select();
    } else
    if(ele.selectionStart >= 0) {
        /* Gecko is a little bit shorter on that. Simply
         focus the element and set the selection to a
         specified position
         */
        ele.focus();
        ele.setSelectionRange(pos, pos);
    }
}

function toggleTag(tag){
    var input = $('#diigobm-tag-input');
    var _tags = ParseTags.parseTags(input.val(),true);
    var i = $.inArray(tag, _tags);
    if(i >= 0){
        _tags.splice(i, 1);
    }
    else if(i == -1){
        _tags.push(tag);
    }

    var newTag = ParseTags.unparseTags(_tags);
    if(newTag.length){
        newTag += ' ';
    }
    input.val(newTag);

    placeCursorAtLast(input[0]);

    updateTagStatus();


}

//extend(D, ParseTags);