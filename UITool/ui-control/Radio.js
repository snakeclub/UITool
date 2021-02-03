/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：Radio
说明：Radio美化控件
文件：Radio.js
依赖文件：jquery-1.4.2.min.js

资源文件：RadioImg/radio.gif
-----------------------*/

;(function($) {
    $.Radio = new Object();
    $.Radio.defaults = {
        //对象的id，使用$("").SetRadio函数时，若对象的id不为空，则使用对象的id
        id : "",
        
        //对象的value，仅初始化使用，使用$("").SetRadio函数则该参数无效
        value : "",
        
        //对象的name，仅初始化使用，使用$("").SetRadio函数则该参数无效
        name : "",
        
        //宽度
        width : "13px",
        
        //高度
        height : "20px",
        
        //选中后执行的函数，依次传入的参数为Radio对象
        onChecked : null,
        
        //是否开启鼠标移动上的显示效果，true－开启效果，false-关闭效果
        openMouseOverEffect : true,
        
        //正常未选中样式图片
        unChecked : {
            background : "url(../../ui-control/RadioImg/radio.gif) 0 0 no-repeat"
        },
        
        //正常选中样式图片
        Checked : {
            background : "url(../../ui-control/RadioImg/radio.gif) 0 -40px no-repeat"
        },
        
        //鼠标移上去选中的样式图片
        mouseOverChecked :{
            background : "url(../../ui-control/RadioImg/radio.gif) 0 -60px no-repeat"
        },
        
        //鼠标移上去未选中的样式图片
        mouseOverUnChecked : {
            background : "url(../../ui-control/RadioImg/radio.gif) 0 -20px no-repeat"
        },
        
        //禁用时未选中样式图片
        disableUnChecked : {
            background : "url(../../ui-control/RadioImg/radio.gif) 0 0 no-repeat"
        },
        
        //禁用时选中样式图片
        disableChecked : {
            background : "url(../../ui-control/RadioImg/radio.gif) 0 -40px no-repeat"
        }
    };
    
    //在指定对象下新增Radio控件
    $.AddRadio = function(parentObj,opts){
        //自定义参数
	    opts = $.extend({}, $.Radio.defaults, opts || {});
	    opts.unChecked = $.extend({}, $.Radio.defaults.unChecked, opts.unChecked || {});
	    opts.Checked = $.extend({}, $.Radio.defaults.Checked, opts.Checked || {});
	    opts.mouseOverUnChecked = $.extend({}, $.Radio.defaults.mouseOverUnChecked, opts.mouseOverUnChecked || {});
	    opts.mouseOverChecked = $.extend({}, $.Radio.defaults.mouseOverChecked, opts.mouseOverChecked || {});
	    opts.disableUnChecked = $.extend({}, $.Radio.defaults.disableUnChecked, opts.disableUnChecked || {});
	    opts.disableChecked = $.extend({}, $.Radio.defaults.disableChecked, opts.disableChecked || {});
	    
	    //添加对象
	    parentObj.append("<div id='"+opts.id+"' selftype='Radio' hover='false' style='float:left;padding:0px;border:0px solid #000;font-size:0px;width:"+opts.width+";height:"+opts.height+";overflow:hidden;' onclick='$.RadioClick($(this));' onkeyup='$.RadioKeyUp($(this));'><input id='RadioSelf_"+opts.id+"' type='radio' value='"+opts.value+"' style='display:none;' withRadio='true' /></div>");
	    var checkobj = parentObj.children("div[selftype='Radio']:last");
	    
	    //绑定mouseover事件
	    if(opts.openMouseOverEffect){
	        checkobj.bind("mouseover",RadioMouseOver);
	        checkobj.bind("mouseout",RadioMouseOut);
	    }
	    
	    //将参数附到对象上
	    checkobj.data("RadioOpts",opts);
	    
	    //根据当前Radio状态设置样式
	    SetRadioStyle(checkobj);
    };
    
    //将html的基础radio元素封装为Radio控件
    $.fn.SetRadio = function(opts){
        //自定义参数
	    opts = $.extend({}, $.Radio.defaults, opts || {});
	    opts.unChecked = $.extend({}, $.Radio.defaults.unChecked, opts.unChecked || {});
	    opts.Checked = $.extend({}, $.Radio.defaults.Checked, opts.Checked || {});
	    opts.mouseOverUnChecked = $.extend({}, $.Radio.defaults.mouseOverUnChecked, opts.mouseOverUnChecked || {});
	    opts.mouseOverChecked = $.extend({}, $.Radio.defaults.mouseOverChecked, opts.mouseOverChecked || {});
	    opts.disableUnChecked = $.extend({}, $.Radio.defaults.disableUnChecked, opts.disableUnChecked || {});
	    opts.disableChecked = $.extend({}, $.Radio.defaults.disableChecked, opts.disableChecked || {});
	    
	    for(var i = 0;i<this.length;i++){
	        //循环处理
	        var obj = $(this.get(i));
	        if(!obj.is(":radio") || obj.is("[withRadio]")){
	            //不是radio,或者已经封装了
	            continue;
	        }
	        //wrap会导致选中状态失效，因此需先记录
	        var objchecked = obj.get(0).checked;
	        obj.wrap("<div selftype='Radio' hover='false' style='float:left;padding:0px;border:0px solid #000;font-size:0px;width:"+opts.width+";height:"+opts.height+";overflow:hidden;' onclick='$.RadioClick($(this));' onkeyup='$.RadioKeyUp($(this));'></div>");
	        obj.get(0).checked = objchecked;
	        
	        var checkobj = $(obj.get(0).parentNode);
	        obj.hide();
	        
	        checkobj.css("margin",obj.css("margin"));
	        
	        //设置id
	        if(obj.attr("id") === undefined){
	            checkobj.attr("id",opts.id);
	            obj.attr("id","RadioSelf_"+opts.id);
	        }
	        else{
	            checkobj.attr("id",obj.attr("id"));
	            obj.attr("id","RadioSelf_"+checkobj.attr("id"));
	        }
	        
	        obj.attr("withRadio","true");
	        
	        //绑定mouseover事件
	        if(opts.openMouseOverEffect){
	            checkobj.bind("mouseover",RadioMouseOver);
	            checkobj.bind("mouseout",RadioMouseOut);
	        }
	        
	        //将参数附到对象上
	        checkobj.data("RadioOpts",opts);
	        
	        //根据当前Radio状态设置样式
	        SetRadioStyle(checkobj);
	    }
    };
    
    //清除radio样式
    $.fn.RemoveRadio = function(){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            if(!obj.is("[selftype='Radio']"))
                continue;
            
            var inputobj = obj.children(":radio");
            if(inputobj.length != 1)
                continue;
            
            
            //开始进行处理，先设定可见和非可见
            inputobj.css("display",obj.css("display"));
            //去掉withRadio属性
            inputobj.removeAttr("withRadio");
            //替换id
            inputobj.attr("id",inputobj.attr("id").substring(10));
            
            //去掉样式DIV
            var objchecked = inputobj.get(0).checked;
            inputobj.unwrap();
            inputobj.get(0).checked = objchecked;
        }
    };
    
    //设置/获取Radio控件的选中和取消选中
    $.fn.RadioChecked = function(){
        if(arguments.length == 0){
            //获得选中或取消选中的状态
            return $(this.get(0)).children(":radio").get(0).checked;
        }
        else{
            //设置选中或取消选中
            var isChecked = arguments[0];
            for(var i = 0;i<this.length;i++){
                //循环处理
                var checkobj = $(this.get(i));
                var opts = checkobj.data("RadioOpts");
                var checkdom = checkobj.children(":radio").get(0);
                if(checkdom.disabled || checkdom.checked == isChecked){
                    //禁用不允许修改，或者选中状态没有变
                    continue;
                }
                //变更了选中状态
                checkdom.checked = isChecked;
                
                //对所有同组的radio改变样式
                var groupradio = $(":radio[withRadio][name='"+checkdom.name+"']");
                for(var j = 0;j<groupradio.length;j++){
                    SetRadioStyle($(groupradio.get(j).parentNode));
                }
 
                //执行onChecked事件
                if(isChecked && opts.onChecked != null){
                    try{
                        opts.onChecked(checkobj);
                    }catch(e){;}
                }
            }
        }
    };
    
    //设置/获取Radio控件的可用和屏蔽
    $.fn.RadioEnable = function(){
        if(arguments.length == 0){
            //获得屏蔽状态
            return !$(this.get(0)).children(":radio").get(0).disabled;
        }
        else{
            //设置屏蔽状态
            var isEnable = arguments[0];
            for(var i = 0;i<this.length;i++){
                //循环处理
                var checkobj = $(this.get(i));
                var checkdom = checkobj.children(":radio").get(0);
                if(!checkdom.disabled == isEnable){
                    //状态一样
                    continue;
                }
                //变更状态
                checkdom.disabled = !isEnable;
                SetRadioStyle(checkobj);
            }
        }
    };
    
    //设置/获取Radio控件的参数
    $.fn.SetRadioOpts = function(opts){
        if(arguments.length == 0){
            //获得参数
            return $(this.get(0)).data("RadioOpts");
        }
        else{
            //设置参数
            opts = $.extend({}, $.Radio.defaults, opts || {});
	        opts.unChecked = $.extend({}, $.Radio.defaults.unChecked, opts.unChecked || {});
	        opts.Checked = $.extend({}, $.Radio.defaults.Checked, opts.Checked || {});
	        opts.mouseOverUnChecked = $.extend({}, $.Radio.defaults.mouseOverUnChecked, opts.mouseOverUnChecked || {});
	        opts.mouseOverChecked = $.extend({}, $.Radio.defaults.mouseOverChecked, opts.mouseOverChecked || {});
	        opts.disableUnChecked = $.extend({}, $.Radio.defaults.disableUnChecked, opts.disableUnChecked || {});
	        opts.disableChecked = $.extend({}, $.Radio.defaults.disableChecked, opts.disableChecked || {});
	        
	        for(var i = 0;i<this.length;i++){
                //循环处理
                var checkobj = $(this.get(i));
                var oldopts =  checkobj.data("RadioOpts");
                checkobj.data("RadioOpts",opts);
                
                if(oldopts.openMouseOverEffect != opts.openMouseOverEffect){
                    if(opts.openMouseOverEffect){
                        //绑定mouseover事件
                        checkobj.bind("mouseover",RadioMouseOver);
	                    checkobj.bind("mouseout",RadioMouseOut);
                    }
                    else{
                        //解除mouseover事件
                        checkobj.unbind("mouseover",RadioMouseOver);
	                    checkobj.unbind("mouseout",RadioMouseOut);
                    }
                }

                //要恢复样式
                checkobj.css({padding:"0px",border:"0px solid #000","font-size":"0px",width:opts.width,height:opts.height,overflow:"hidden","background-position-x":"0px","background-position-y":"0px"});
                
                SetRadioStyle(checkobj);
            }
        }
    };
    
    
    //内部函数
    //mouseover事件
    function RadioMouseOver(){
        var checkobj = $(this);
        checkobj.attr("hover","true");
        SetRadioStyle(checkobj);
    };
    
    //mouseout事件
    function RadioMouseOut(){
        var checkobj = $(this);
        checkobj.attr("hover","false");
        SetRadioStyle(checkobj);
    };
    
    //点击Radio执行选中
    $.RadioClick = function(checkobj){
        checkobj.RadioChecked(!checkobj.RadioChecked());
    };
    
    //在对象上按enter键的处理
    $.RadioKeyUp = function(checkobj){
        //获得keyup的事件按键
        var KeyNum;
        if($.browser.msie){
            //IE
            KeyNum = event.keyCode;
        }
        else{
            //其他
            KeyNum = event.which;
        }
        
        //判断是否回车
        if(KeyNum == 13){
            $.RadioClick(checkobj);
        }
    };
    
    //根据Radio状态设置样式
    function SetRadioStyle(checkobj){
        var opts = checkobj.data("RadioOpts");
        var checkdom = checkobj.children(":radio").get(0);
        if(checkdom.checked){
            //选中
            if(!checkdom.disabled){
                //启用
                if(checkobj.attr("hover") == "true")
                    checkobj.css(opts.mouseOverChecked);
                else
                    checkobj.css(opts.Checked);
            }
            else{
                //禁用
                checkobj.css(opts.disableChecked);
            }
        }
        else{
            //未选中
            if(!checkdom.disabled){
                //启用
                if(checkobj.attr("hover") == "true")
                    checkobj.css(opts.mouseOverUnChecked);
                else
                    checkobj.css(opts.unChecked);
            }
            else{
                //禁用
                checkobj.css(opts.disableUnChecked);
            }
        }
    };
    
    
})(jQuery);