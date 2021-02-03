/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：CheckBox
说明：CheckBox美化控件
文件：CheckBox.js
依赖文件：jquery-1.4.2.min.js

资源文件：CheckBoxImg/checkbox.gif
-----------------------*/

;(function($) {
    $.CheckBox = new Object();
    $.CheckBox.defaults = {
        //对象的id，使用$("").SetCheckBox函数时，若对象的id不为空，则使用对象的id
        id : "",
        
        //对象的value，仅初始化使用，使用$("").SetCheckBox函数则该参数无效
        value : "",
        
        //对象的name，仅初始化使用，使用$("").SetCheckBox函数则该参数无效
        name : "",
        
        //宽度
        width : "13px",
        
        //高度
        height : "20px",
        
        //选中状态改变后执行的函数，依次传入的参数为CheckBox对象、是否选中
        onChanged : null,
        
        //是否开启鼠标移动上的显示效果，true－开启效果，false-关闭效果
        openMouseOverEffect : true,
        
        //正常未选中样式图片
        unChecked : {
            background : "url(../../ui-control/CheckBoxImg/checkbox.gif) 0 0 no-repeat"
        },
        
        //正常选中样式图片
        Checked : {
            background : "url(../../ui-control/CheckBoxImg/checkbox.gif) 0 -40px no-repeat"
        },
        
        //鼠标移上去选中的样式图片
        mouseOverChecked :{
            background : "url(../../ui-control/CheckBoxImg/checkbox.gif) 0 -60px no-repeat"
        },
        
        //鼠标移上去未选中的样式图片
        mouseOverUnChecked : {
            background : "url(../../ui-control/CheckBoxImg/checkbox.gif) 0 -20px no-repeat"
        },
        
        //禁用时未选中样式图片
        disableUnChecked : {
            background : "url(../../ui-control/CheckBoxImg/checkbox.gif) 0 0 no-repeat"
        },
        
        //禁用时选中样式图片
        disableChecked : {
            background : "url(../../ui-control/CheckBoxImg/checkbox.gif) 0 -40px no-repeat"
        }
    };
    
    //在指定对象下新增CheckBox控件
    $.AddCheckBox = function(parentObj,opts){
        //自定义参数
	    opts = $.extend({}, $.CheckBox.defaults, opts || {});
	    opts.unChecked = $.extend({}, $.CheckBox.defaults.unChecked, opts.unChecked || {});
	    opts.Checked = $.extend({}, $.CheckBox.defaults.Checked, opts.Checked || {});
	    opts.mouseOverUnChecked = $.extend({}, $.CheckBox.defaults.mouseOverUnChecked, opts.mouseOverUnChecked || {});
	    opts.mouseOverChecked = $.extend({}, $.CheckBox.defaults.mouseOverChecked, opts.mouseOverChecked || {});
	    opts.disableUnChecked = $.extend({}, $.CheckBox.defaults.disableUnChecked, opts.disableUnChecked || {});
	    opts.disableChecked = $.extend({}, $.CheckBox.defaults.disableChecked, opts.disableChecked || {});
	    
	    //添加对象
	    parentObj.append("<div id='"+opts.id+"' selftype='CheckBox' hover='false' style='float:left;padding:0px;border:0px solid #000;font-size:0px;width:"+opts.width+";height:"+opts.height+";overflow:hidden;' onclick='$.CheckBoxClick($(this));' onkeyup='$.CheckBoxKeyUp($(this));'><input id='CheckBoxSelf_"+opts.id+"' type='checkbox' value='"+opts.value+"' name='"+opts.name+"' style='display:none;' withCheckBox='true' /></div>");
	    var checkobj = parentObj.children("div[selftype='CheckBox']:last");
	    
	    //绑定mouseover事件
	    if(opts.openMouseOverEffect){
	        checkobj.bind("mouseover",CheckBoxMouseOver);
	        checkobj.bind("mouseout",CheckBoxMouseOut);
	    }
	    
	    //将参数附到对象上
	    checkobj.data("CheckBoxOpts",opts);
	    
	    //根据当前checkbox状态设置样式
	    SetCheckBoxStyle(checkobj);
    };
    
    //将html的基础checkbox元素封装为CheckBox控件
    $.fn.SetCheckBox = function(opts){
        //自定义参数
	    opts = $.extend({}, $.CheckBox.defaults, opts || {});
	    opts.unChecked = $.extend({}, $.CheckBox.defaults.unChecked, opts.unChecked || {});
	    opts.Checked = $.extend({}, $.CheckBox.defaults.Checked, opts.Checked || {});
	    opts.mouseOverUnChecked = $.extend({}, $.CheckBox.defaults.mouseOverUnChecked, opts.mouseOverUnChecked || {});
	    opts.mouseOverChecked = $.extend({}, $.CheckBox.defaults.mouseOverChecked, opts.mouseOverChecked || {});
	    opts.disableUnChecked = $.extend({}, $.CheckBox.defaults.disableUnChecked, opts.disableUnChecked || {});
	    opts.disableChecked = $.extend({}, $.CheckBox.defaults.disableChecked, opts.disableChecked || {});
	    
	    for(var i = 0;i<this.length;i++){
	        //循环处理
	        var obj = $(this.get(i));
	        if(!obj.is(":checkbox") || obj.is("[withCheckBox]")){
	            //不是checkbox,或者已经封装了
	            continue;
	        }
	        //wrap会导致选中状态失效，因此需先记录
	        var objchecked = obj.get(0).checked;
	        obj.wrap("<div selftype='CheckBox' hover='false' style='float:left;padding:0px;border:0px solid #000;font-size:0px;width:"+opts.width+";height:"+opts.height+";overflow:hidden;' onclick='$.CheckBoxClick($(this));' onkeyup='$.CheckBoxKeyUp($(this));'></div>");
	        obj.get(0).checked = objchecked;
	        
	        var checkobj = $(obj.get(0).parentNode);
	        obj.hide();
	        
	        checkobj.css("margin",obj.css("margin"));
	        
	        //设置id
	        if(obj.attr("id") === undefined){
	            checkobj.attr("id",opts.id);
	            obj.attr("id","CheckBoxSelf_"+opts.id);
	        }
	        else{
	            checkobj.attr("id",obj.attr("id"));
	            obj.attr("id","CheckBoxSelf_"+checkobj.attr("id"));
	        }
	        
	        obj.attr("withCheckBox","true");
	        
	        //绑定mouseover事件
	        if(opts.openMouseOverEffect){
	            checkobj.bind("mouseover",CheckBoxMouseOver);
	            checkobj.bind("mouseout",CheckBoxMouseOut);
	        }
	        
	        //将参数附到对象上
	        checkobj.data("CheckBoxOpts",opts);
	        
	        //根据当前checkbox状态设置样式
	        SetCheckBoxStyle(checkobj);
	    }
    };
    
    //清除checkbox样式
    $.fn.RemoveCheckBox = function(){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            if(!obj.is("[selftype='CheckBox']"))
                continue;
            
            var inputobj = obj.children(":checkbox");
            if(inputobj.length != 1)
                continue;
            
            
            //开始进行处理，先设定可见和非可见
            inputobj.css("display",obj.css("display"));
            //去掉withCheckBox属性
            inputobj.removeAttr("withCheckBox");
            //替换id
            inputobj.attr("id",inputobj.attr("id").substring(13));
            
            //去掉样式DIV
            var objchecked = inputobj.get(0).checked;
            inputobj.unwrap();
            inputobj.get(0).checked = objchecked;
        }
    };
    
    //设置/获取CheckBox控件的选中和取消选中
    $.fn.CheckBoxChecked = function(){
        if(arguments.length == 0){
            //获得选中或取消选中的状态
            return $(this.get(0)).children(":checkbox").get(0).checked;
        }
        else{
            //设置选中或取消选中
            var isChecked = arguments[0];
            for(var i = 0;i<this.length;i++){
                //循环处理
                var checkobj = $(this.get(i));
                var opts = checkobj.data("CheckBoxOpts");
                var checkdom = checkobj.children(":checkbox").get(0);
                if(checkdom.disabled || checkdom.checked == isChecked){
                    //禁用不允许修改，或者选中状态没有变
                    continue;
                }
                //变更了选中状态
                checkdom.checked = isChecked;
                SetCheckBoxStyle(checkobj);
                
                //执行onChanged事件
                if(opts.onChanged != null){
                    try{
                        opts.onChanged(checkobj,checkdom.checked);
                    }catch(e){;}
                }
            }
        }
    };
    
    //设置/获取CheckBox控件的可用和屏蔽
    $.fn.CheckBoxEnable = function(){
        if(arguments.length == 0){
            //获得屏蔽状态
            return !$(this.get(0)).children(":checkbox").get(0).disabled;
        }
        else{
            //设置屏蔽状态
            var isEnable = arguments[0];
            for(var i = 0;i<this.length;i++){
                //循环处理
                var checkobj = $(this.get(i));
                var checkdom = checkobj.children(":checkbox").get(0);
                if(!checkdom.disabled == isEnable){
                    //状态一样
                    continue;
                }
                //变更状态
                checkdom.disabled = !isEnable;
                SetCheckBoxStyle(checkobj);
            }
        }
    };
    
    //设置/获取CheckBox控件的参数
    $.fn.SetCheckBoxOpts = function(opts){
        if(arguments.length == 0){
            //获得参数
            return $(this.get(0)).data("CheckBoxOpts");
        }
        else{
            //设置参数
            opts = $.extend({}, $.CheckBox.defaults, opts || {});
	        opts.unChecked = $.extend({}, $.CheckBox.defaults.unChecked, opts.unChecked || {});
	        opts.Checked = $.extend({}, $.CheckBox.defaults.Checked, opts.Checked || {});
	        opts.mouseOverUnChecked = $.extend({}, $.CheckBox.defaults.mouseOverUnChecked, opts.mouseOverUnChecked || {});
	        opts.mouseOverChecked = $.extend({}, $.CheckBox.defaults.mouseOverChecked, opts.mouseOverChecked || {});
	        opts.disableUnChecked = $.extend({}, $.CheckBox.defaults.disableUnChecked, opts.disableUnChecked || {});
	        opts.disableChecked = $.extend({}, $.CheckBox.defaults.disableChecked, opts.disableChecked || {});
	        
	        for(var i = 0;i<this.length;i++){
                //循环处理
                var checkobj = $(this.get(i));
                var oldopts =  checkobj.data("CheckBoxOpts");
                checkobj.data("CheckBoxOpts",opts);
                
                if(oldopts.openMouseOverEffect != opts.openMouseOverEffect){
                    if(opts.openMouseOverEffect){
                        //绑定mouseover事件
                        checkobj.bind("mouseover",CheckBoxMouseOver);
	                    checkobj.bind("mouseout",CheckBoxMouseOut);
                    }
                    else{
                        //解除mouseover事件
                        checkobj.unbind("mouseover",CheckBoxMouseOver);
	                    checkobj.unbind("mouseout",CheckBoxMouseOut);
                    }
                }

                //要恢复样式
                checkobj.css({padding:"0px",border:"0px solid #000","font-size":"0px",width:opts.width,height:opts.height,overflow:"hidden","background-position-x":"0px","background-position-y":"0px"});
                
                SetCheckBoxStyle(checkobj);
            }
        }
    };
    
    
    //内部函数
    //mouseover事件
    function CheckBoxMouseOver(){
        var checkobj = $(this);
        checkobj.attr("hover","true");
        SetCheckBoxStyle(checkobj);
    };
    
    //mouseout事件
    function CheckBoxMouseOut(){
        var checkobj = $(this);
        checkobj.attr("hover","false");
        SetCheckBoxStyle(checkobj);
    };
    
    //点击CheckBox执行选中
    $.CheckBoxClick = function(checkobj){
        checkobj.CheckBoxChecked(!checkobj.CheckBoxChecked());
    };
    
    //在对象上按enter键的处理
    $.CheckBoxKeyUp = function(checkobj){
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
            $.CheckBoxClick(checkobj);
        }
    };
    
    //根据checkbox状态设置样式
    function SetCheckBoxStyle(checkobj){
        var opts = checkobj.data("CheckBoxOpts");
        var checkdom = checkobj.children(":checkbox").get(0);
        
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