/**
 * Created with JetBrains WebStorm.
 * User: chuang
 * Date: 13-4-24
 * Time: 上午9:41
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with JetBrains WebStorm.
 * User: chuang
 * Date: 13-4-19
 * for diigo tag input
 */
(function($){



    var defaultOption = {
        spaceKey:false,
        placeHolderText:null,
        removeComfirmation:true,
        editable:true,
        tagSource:null,
        enterKey:false

    };

    function _getLastTag(container){
        return container.find('.diigo_tag:last');
    }

    function _isInputed(input){
        if(input.val() != ''){
            return true;
        }
        else{
            return false;
        }
    }

    function _updateTags(oldTag,newTag,tags){
        var i = $.inArray(oldTag,tags);
        tags[i] = newTag;
        return tags;
    }

    function _removeComfirmation(container){
        _getLastTag(container).addClass('remove');
    }


    methods = {
        init:function(opt){

            return this.each(function(){

                var  tags = [];

                var $this = $(this);

                $this.data('diigoTags',tags);
                //console.log(opt);
                var option = $.extend(defaultOption,opt||{});

                console.log($this,JSON.stringify(option));

                $this.data('diigoTagOption',JSON.stringify(option));



                var input = $('<input type="text" id="diigo-tag-input" placeholder="Input or select tags">')
                    .appendTo($this);

                /*if(option.tagSource){
                    input.autocomplete({
                        source:  function(request, response) {

                            var q = request.term.toLowerCase();
                            var candidates = [];
                            var candidates2 = [];
                            for (var i = 0, v; v = option.tagSource[i], i < option.tagSource.length; i++) {
                                if (v.toLowerCase().indexOf(q) == 0){
                                    candidates.push(v);
                                }
                                else if(v.toLowerCase().indexOf(q) != 0 && v.toLowerCase().indexOf(q) != -1){
                                    candidates2.push(v);
                                }

                            }

                            function indexSort(a,b){
                                if(a.indexOf(q) <= b.indexOf(q)){
                                    return -1;
                                }
                                else{
                                    return 1;
                                }

                            }

                            candidates2.sort(indexSort);
                            candidates = candidates.concat(candidates2);

                            response(candidates.slice(0, 7));
                        },
                        select: function( event, ui ) {
                            if(input.val() != ui.item.value){
                                methods.createTag(ui.item.value,$this);
                            }

                            return false;
                        }
                    });
                }*/

                //bind event
                input.on('keyup',function(e){
                    var inp = $(this);
                    var inputed = _isInputed(inp);

                    var option = JSON.parse($this.data('diigoTagOption')) ;
                    console.log(option);

                    //console.log(inputed);
                    if(e.which == 13){
                        if(option.enterKey == true){
                            if(inputed){
                                methods.createTag(inp.val(),$this);
                            }
                        }

                    }
                    else if(e.which == 32){

                        if(inputed){
                            if(option.spaceKey == true){
                            e.preventDefault();
                            console.log(inp.val(),!inp.val().indexOf("'") == 0,!inp.val().indexOf('"') == 0);
                            if(!inp.val().indexOf("'") == 0 && !inp.val().indexOf('"') == 0){

                                methods.createTag(inp.val(),$this);
                            }
                            else if(/^(\'|").*(\'|")\s$/.test(inp.val())){
                                    var a = inp.val().match(/^(\'|")(.*)(\'|")\s$/);
                                var b = a[2];
                                    methods.createTag(b,$this);



                            }
                            }
                        }
                        else{
                            e.preventDefault();
                        }
                    }
                    else if(e.which == 8){
                        var lastTag = _getLastTag($this);
                        var removeComfirmation = option.removeComfirmation;
                        //console.log(removeComfirmation);
                        if(!inputed){
                            if(!removeComfirmation || lastTag.hasClass('remove')){
                                methods.removeTag(lastTag,$this);
                            }
                            else if(removeComfirmation && !lastTag.hasClass('remove')){
                                _removeComfirmation($this);
                            }
                        }
                    }
                    else{


                        _getLastTag($this).removeClass('remove');
                    }

                    })
                    .on('blur',function(){
                        if($(this).val() != ''){
                            methods.createTag($(this).val(),$this);
                        }

                    });



                if(option.placeHolderText){
                    input.on('focus',function(){
                        $(this).attr('placeholder',option.placeHolderText);
                    })
                        .on('blur',function(){
                            $(this).attr('placeholder',"Input or select tags");
                        });
                    //input.attr('placeholder',option.placeHolderText);
                }
            });
        },
        createTag:function(str,$this){
           if(!$this){
               var $this = $(this);

           }
            var input = $this.find('#diigo-tag-input');
            var tags = $this.data('diigoTags');
            var option = $this.data('diigoTagOption');

            var str = $.trim(str);

            //console.log($this,tags,input);

            //console.log(str,tags, $.inArray(str,tags));
            if($.inArray(str,tags) != -1){
                $this.find('.diigo_tag').each(function(){
                    if($(this).data('content') == str){
                        $(this).addClass('repeated');
                        var a = $(this);
                        setTimeout(function(){
                            a.removeClass('repeated');
                        },1200);
                    }
                });

                //input.val('');
                return;
            }
            var tag = $('<div class="diigo_tag"><span>'+str+'</span></div>')
                .data('content',str);


            $('<div></div>').addClass('diigo_tag_close')
                .appendTo(tag)
                .on('click',function(e){
                    e.preventDefault();
                    methods.removeTag(tag,$this);
                });

            tag.insertBefore(input);

            if(option.editable){
                tag.find('span').attr('contenteditable','true')
                    .on('click',function(){
                        $(this).parent().addClass('edit');
                    })
                    .on('blur',function(){
                        $(this).parent().removeClass('edit');
                        if($(this).text() == ''){
                            methods.removeTag($(this).parent());
                        }
                        else{
                            tags =  _updateTags($(this).parent().data('content'),$(this).text(),tags);
                            $this.data('diigoTags',tags);
                            $(this).data('content',$(this).text());
                        }

                    })
                    .on('keydown',function(e){
                        if(e.which == 13){
                            $(this).blur();
                        }
                        else if(e.which == 8 && $(this).text() == ''){
                            methods.removeTag($(this).parent());
                        }
                    });
            }
            input.val('');
            tags.push(str);
            $this.data('diigoTags',tags);
            input.autocomplete('close');
            return $this;
        },
        removeTag:function(tag,$this){
            if(!$this){
                $this = $(this);
            }
            var tags = $this.data('diigoTags');
            var input = $this.find('#diigo-tag-input');

            tag.fadeOut(100,function(){
                var content = $(this).find('span').text();
                var dx = $.inArray(content,tags);
                tags.splice(dx,1);
                $this.data('diigoTags',tags);
                $(this).remove();
                input.focus();

            });

            return $this;
        },
        getAllTags:function(){
            var $this = $(this);
            return $this.data('diigoTags');
        }

    };

    $.fn.diigoTagInput = function(){
        var method = arguments[0];


        if(methods[method]){
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        }
        else if(typeof(method) == "object" || !method){
            method = methods.init;
        }
        else{
            $.error( 'Method ' +  method + ' does not exist on jQuery.diigoTagInput' );
            return this;
        }
        //console.log(arguments);
        return method.call(this,arguments[0]);


    }
})(jQuery)