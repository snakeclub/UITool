/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：FloatControl
说明：设置对象浮动显示
文件：FloatControl.js
依赖文件：jquery-1.4.2.min.js
-----------------------*/

/*-----------------------
==FloatControl==
说明：设置对象浮动显示
-----------------------*/

;(function($) {
    /*
      --SetFloat--
      $("").SetFloat()
         设置对象在当前位置浮动，位置的参考对象是window，可以结合SetPosition方法先设置位置，再浮动
      $("").SetFloat(PositionDesc)
        设置对象在指定位置浮动，位置的参考对象是window
        PositionDesc : 参考对象位置描述，格式为 "XPosition:YPosition" ， 分别代表水平位置和垂直位置
            XPosition  : "center" - 参考对象的正中位置，"left" - 参考对象的左边线位置 "right" - 参考对象的右边线位置, "具体的数值" - 距离参考对象左边线的象素值,"null"-不处理
            YPosition  : "center" - 参考对象的正中位置，"top" - 参考对象的上边线位置 "bottom" - 参考对象的下边线位置, "具体的数值" - 距离参考对象上边线的象素值,"null"-不处理
     */
    $.fn.SetFloat = function() {
        //判断是否处理
        if(this.length <= 0){
            return;
        }
        
        //创建位置参数数组start
        if(JQuery_UITool_FloatControl == null){
            JQuery_UITool_FloatControl = new Array(0);
            //增加窗口事件的绑定
            if($.browser.msie && $.browser.version < 7){
                //IE 7以下的不支持positon:fixed
                $(window).bind("scroll",FloatControl_FloatingScroll);
            }
            $(window).bind("resize",FloatControl_FloatingResize); //改变大小时，需重新计算并设置对象的位置
        }
        //创建位置参数数组end
        
        //循环进行处理start
        var mainobj = null;
        for(var i=0;i<this.length;i++){
            mainobj = $(this.get(i));
            var FloatPara = "";
            if(arguments.length == 0){
                FloatPara = (mainobj.offset().left - $(window).scrollLeft()).toString() + ":" + (mainobj.offset().top - $(window).scrollTop()).toString();
            }
            else{
                FloatPara = arguments[0];
            }
            
            if(mainobj.attr("floatpara")===undefined || mainobj.attr("floatpara") == ""){
                //对象未设置过浮动,添加到数组中
                var id = JQuery_UITool_FloatControl.push(mainobj) - 1;
                mainobj.attr("floatid",id.toString()); //索引的index
                mainobj.attr("oldposition",mainobj.css("position")); //保存对象的旧位置样式
            }
            //保存参数
            mainobj.attr("floatpara",FloatPara);
            //设置位置
            FloatControl_ComputePosition(mainobj,FloatPara);
        }
        //循环进行处理end
     };
     
     
     /*
      --ClearFloat--
      $("").ClearFloat()
         清除对象的浮动设置
     */
     $.fn.ClearFloat = function(){
        var mainobj = null;
        for(var i=0;i<this.length;i++){
            mainobj = $(this.get(i));
            if(!(mainobj.attr("floatid")===undefined || mainobj.attr("floatid") == "")){
                var index = parseInt(mainobj.attr("floatid"));
                //将后面的索引都减1
                for(var j=index+1;j<JQuery_UITool_FloatControl.length;j++){
                    JQuery_UITool_FloatControl[j].attr("floatid",parseInt(JQuery_UITool_FloatControl[j].attr("floatid"))-1);
                }
                JQuery_UITool_FloatControl.splice(index,1); //删除索引
                mainobj.removeAttr("floatid");
                mainobj.removeAttr("floatpara");
                mainobj.css("position", mainobj.attr("oldposition"));
                mainobj.removeAttr("oldposition");
            }
        }
     };
     
    
    /*
    --JQuery_UITool_FloatControl--
    通用的浮动处理公用变量，注意调用界面不能使用这个变量
    */
    var JQuery_UITool_FloatControl = null;

    /*
    --FloatControl_FloatingResize--
    内部函数，当有影响浮动的事件发生时的处理脚本
    */
    function FloatControl_FloatingResize(){
        if(JQuery_UITool_FloatControl != null){
            for(var i = 0;i < JQuery_UITool_FloatControl.length;i++){
                FloatControl_ComputePosition(JQuery_UITool_FloatControl[i],JQuery_UITool_FloatControl[i].attr("floatpara"));
            }
        }
    };

    /*
    --FloatControl_FloatingScroll--
    内部函数，当有影响浮动的事件发生时的处理脚本
    */
    function FloatControl_FloatingScroll(){
        if(JQuery_UITool_FloatControl != null){
            for(var i = 0;i < JQuery_UITool_FloatControl.length;i++){
                var ScrollPara = JQuery_UITool_FloatControl[i].data("FloatControl_ScrollPara");
                if(ScrollPara.XPosDesc != null){
                    JQuery_UITool_FloatControl[i].css("left",($(window).scrollLeft() + ScrollPara.X) + "px");
                }
                if(ScrollPara.YPosDesc != null){
                    JQuery_UITool_FloatControl[i].css("top",($(window).scrollTop() + ScrollPara.Y) + "px");
                }
            }
        }
    };

    /*
    --FloatControl_ComputePosition--
    内部函数，计算对象的位置信息，并设置对象的css属性
    */
    function FloatControl_ComputePosition(obj,PositionDesc){
        //获得参数
        var XPosition = $.trim(PositionDesc.split(":")[0].toLowerCase());
        var YPosition = $.trim(PositionDesc.split(":")[1].toLowerCase());
        
        //计算X的位置
        var XPosDesc = null;
        var XPos = 0;
        if(XPosition == "left"){
            XPosDesc = "left";
            XPos = 0;
        }
        else if(XPosition == "right"){
            XPosDesc = "right";
            XPos = 0 - obj.outerWidth(true);
        }
        else if(XPosition == "center"){
            XPosDesc = "left";
            XPos = Math.ceil($(window).width() / 2) - Math.ceil(obj.outerWidth(true) / 2);
        }
        else if(!isNaN(parseInt(XPosition))){
            XPosDesc = "left";
            XPos = parseInt(XPosition);
        }
        
        //计算Y的位置
        var YPosDesc = null;
        var YPos = 0;
        if(YPosition == "top"){
            YPosDesc = "top";
            YPos = 0;
        }
        else if(YPosition == "bottom"){
            YPosDesc = "bottom";
            YPos = 0 - obj.outerHeight(true);
        }
        else if(YPosition == "center"){
            YPosDesc = "top";
            YPos = Math.ceil($(window).height() / 2) - Math.ceil(obj.outerHeight(true) / 2);
        }
        else if(!isNaN(parseInt(YPosition))){
            YPosDesc = "top";
            YPos = parseInt(YPosition);
        }
        
        //根据浏览器类型处理
        if($.browser.msie && $.browser.version < 7){
            //IE 7以下的不支持positon:fixed
            var ScrollPara = new Object();
            ScrollPara.XPosDesc = XPosDesc;
            ScrollPara.YPosDesc = YPosDesc;
            obj.css("position","absolute");
            if(XPosDesc != null){
                if(XPosDesc == "left"){
                    ScrollPara.X = XPos;
                    obj.css("left",($(window).scrollLeft() + XPos) + "px");
                }
                else{
                    ScrollPara.X = $(window).width() + XPos;
                    obj.css("left",($(window).scrollLeft() + $(window).width() + XPos)+"px");
                }
            }
            if(YPosDesc != null){
                if(YPosDesc == "top"){
                    ScrollPara.Y = YPos;
                    obj.css("top",($(window).scrollTop() + YPos)+"px");
                }
                else{
                    ScrollPara.Y = $(window).height() + YPos;
                    obj.css("top",($(window).scrollTop() + $(window).height() + YPos)+"px");
                }
            }
            //绑定Scroll参数
            obj.data("FloatControl_ScrollPara",ScrollPara);
        }
        else{
            //IE 7或其他浏览器，支持positon:fixed
            obj.css("position","fixed");
            if(XPosDesc != null){
                obj.css(XPosDesc,XPos+"px");
            }
            if(YPosDesc != null){
                obj.css(YPosDesc,YPos+"px");
            }
        }
    };


})(jQuery);



