/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：AreaSelectControl
说明：区域选择控件
文件：AreaSelectControl.js
依赖文件：jquery-1.4.2.min.js
          ToolFunction.js
-----------------------*/

/*-----------------------
==AreaSelectControl==
说明：区域选择控件
-----------------------*/

;(function($) {
    //区域选择的默认参数
    $.AreaSelect = new Object();
    $.AreaSelect.defaults = {
        //true-等待鼠标落下时才开始选择，fasle-从鼠标当前位置开始选择，鼠标释放时结束
        WaitMouseClick : true,
        
        //true-结束时自动停止选择，false－结束时可以直接进行下一个选择，如果WaitMouseClick为false，则无论该参数是什么，结束时都会自动停止选择
        AutoHide : false,
        
        //选择结束时执行的函数，null-代表不执行任何函数，默认为null
        //执行函数时，会传入的参数顺序如下：arguments[0]  :  选取的位置参数,arguments[0].left，arguments[0].top，arguments[0].width，arguments[0].height
        //                                  arguments[1]  :  选中的JQuery对象列表
        EndFun : null,
        
        //要选择的对象的过滤器，使用jquery规则，默认为""，代表不选择对象
        SelectFilter : "",
        
        //选区的div的css样式
        AreaCss : {
              border:"1px solid #000",
              background :"#ffffff",
              filter:"alpha(opacity=60)"
            },
        
        //是否对象全在里面才能选中，默认为true
        FullSelect : true
    };
    
    /*
    --StartAreaSelect--
    $.StartAreaSelect(opts)
    */
    $.StartAreaSelect = function(opts){
        //自定义参数
	    opts = $.extend({}, $.AreaSelect.defaults, opts || {});
        
        //获取对象
        var AreaDivObj = $("#JQuery_UITool_AreaSelectDiv");
        if(AreaDivObj.length == 0){
            //创建对象
            $(document.body).append("<div id='JQuery_UITool_AreaSelectDiv' style='position:absolute; display:none;'></div>");
            AreaDivObj = $("#JQuery_UITool_AreaSelectDiv");
        }
        //修改原对象的参数
        AreaDivObj.hide();  //新的选择，应该隐藏对象
        AreaDivObj.attr("autohide",opts.AutoHide.toString());
        AreaDivObj.removeData("EndExecuteFun");
        if(opts.EndFun != null){
            AreaDivObj.data("EndExecuteFun",opts.EndFun);
        }
        AreaDivObj.attr("selectfilter",opts.SelectFilter);
        AreaDivObj.attr("fullselect",opts.FullSelect.toString());
        AreaDivObj.css(opts.AreaCss);
        
        //启动选择
        if(opts.WaitMouseClick){
            //等待鼠标点击
            $(document).bind("mousedown",StartAreaSelectClick);
        }
        else{
            //直接启动选择
            AreaDivObj.get(0).setCapture();
            AreaDivObj.attr("mousestartx",event.clientX + $(window).scrollLeft());
            AreaDivObj.attr("mousestarty",event.clientY + $(window).scrollTop());
            AreaDivObj.attr({mousex:event.clientX,mousey:event.clientY});
            
            AreaDivObj.css({left:AreaDivObj.attr("mousestartx")+"px",top:AreaDivObj.attr("mousestarty")+"px"});
            AreaDivObj.css({width:"0px",height:"0px"});
            AreaDivObj.show();
            
            $(document).bind("mousemove",AreaSelectMouseMove);
            $(document).one("mouseup",StopAreaSelectClick);
        }
    };
    
    /*
    --StopAreaSelect--
    $.StopAreaSelect()
        停止进行区域选择
    */
    $.StopAreaSelect = function(){
        //屏蔽绑定的事件即可
        $(document).unbind("mousemove",AreaSelectMouseMove);
        $(document).unbind("mousedown",StartAreaSelectClick);
        //隐藏选区
        var AreaDivObj = $("#JQuery_UITool_AreaSelectDiv");
        AreaDivObj.hide();
    };
    
    
    //以下为内部函数
    /*
    --StartAreaSelectClick--
    内部函数，鼠标按下时开始选择的函数
    */
    function StartAreaSelectClick(){
        if(($.browser.msie && event.button != 1) || (!$.browser.msie && event.button != 0)){
            //不是鼠标左键处理
            return false;
        }
        if(event.clientX < 0 || event.clientY < 0 || event.clientX > $(window).width() || event.clientY > $(window).height()){
            //超出屏幕范围
            return false;
        }
        
        var AreaDivObj = $("#JQuery_UITool_AreaSelectDiv");
        AreaDivObj.get(0).setCapture();
        AreaDivObj.attr("mousestartx",event.clientX + $(window).scrollLeft());
        AreaDivObj.attr("mousestarty",event.clientY + $(window).scrollTop());
        AreaDivObj.attr({mousex:event.clientX,mousey:event.clientY});
        
        AreaDivObj.css({left:AreaDivObj.attr("mousestartx")+"px",top:AreaDivObj.attr("mousestarty")+"px"});
        AreaDivObj.css({width:"0px",height:"0px"});
        AreaDivObj.show();
        
        $(document).bind("mousemove",AreaSelectMouseMove);
        $(document).one("mouseup",StopAreaSelectClick);
        
        //阻止事件冒泡
        return false;
    };

    /*
    --AreaSelectMouseMove--
    内部函数，鼠标移动时的函数
    */
    function AreaSelectMouseMove(){
        var AreaDivObj = $("#JQuery_UITool_AreaSelectDiv");    
        var borderwidth = AreaDivObj.outerWidth()-AreaDivObj.width();
        var borderheight = AreaDivObj.outerHeight()-AreaDivObj.height();
        var Width = parseInt(AreaDivObj.attr("mousex")) - event.clientX + borderwidth;
        var Height = parseInt(AreaDivObj.attr("mousey")) - event.clientY + borderheight;
        
        AreaDivObj.css({width:Math.abs(Width)+"px",height:Math.abs(Height)+"px"});
        AreaDivObj.css({left:(Width > 0 ? event.clientX + $(window).scrollLeft() : AreaDivObj.attr("mousestartx")) + "px",top:(Height > 0 ? event.clientY + $(window).scrollTop() : AreaDivObj.attr("mousestarty")) + "px"});
        
        //阻止事件冒泡
        return false;
    };

    /*
    --StopAreaSelectClick--
    内部函数，鼠标按键松开时的释放函数
    */
    function StopAreaSelectClick(){
        $(document).unbind("mousemove",AreaSelectMouseMove);
        var AreaDivObj = $("#JQuery_UITool_AreaSelectDiv");
        
        //判断是否需要执行后续操作
        var EndFun = AreaDivObj.data("EndExecuteFun");
        if(EndFun != null && EndFun !== undefined){
            //执行后续操作，先准备好参数
            var arg0 = new Object();
            var objpos = AreaDivObj.getElementPos();
            arg0.left = objpos.x;
            arg0.top = objpos.y;
            arg0.width = AreaDivObj.outerWidth(true);
            arg0.height = AreaDivObj.outerHeight(true);
            
            var arg1 = $("");
            var filter = AreaDivObj.attr("selectfilter");
            if(filter != ""){
                var filterObjs = $(filter);
                for(var i = 0;i<filterObjs.length;i++){
                    var filterobj = $(filterObjs.get(i));
                    if(filterobj.css("display") == "none" || filterobj.get(0) == AreaDivObj.get(0)){
                        continue;
                    }
                    var fobjpos = filterobj.getElementPos();
                    var fobjwidth = filterobj.outerWidth(true);
                    var fobjheight = filterobj.outerHeight(true);
                    if(AreaDivObj.attr("fullselect") == "true"){
                        //对象要整个在里面才选中
                        if(arg0.left <= fobjpos.x && arg0.top <= fobjpos.y && (arg0.left + arg0.width >= fobjpos.x + fobjwidth) && (arg0.top + arg0.height >= fobjpos.y + fobjheight)){
                            arg1 = arg1.add(filterobj);
                        }
                    }
                    else{
                        //只要擦边就选中
                        if((arg0.left + arg0.width >=  fobjpos.x) && (arg0.left <= fobjpos.x + fobjwidth) && (arg0.top + arg0.height >=  fobjpos.y) && (arg0.top <= fobjpos.y + fobjheight)){
                            arg1 = arg1.add(filterobj);
                        }
                    }
                }
            }
            
            //开始执行函数
            try{
                EndFun(arg0,arg1);
            }catch(e)
            {
                ;
            }
        }
        
        if(AreaDivObj.attr("autohide") == "true"){
            //自动停止选择
            $.StopAreaSelect();
        }
        
        //阻止事件冒泡
        return false;
    };

})(jQuery);
