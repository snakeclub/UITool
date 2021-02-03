/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：BarScrollDiv
说明：工具条滚动展示容器,用于放置横向的工具条，例如ToolBar和Tab标签页等，支持超过宽度可滚动显示
文件：BarScrollDiv.js
依赖文件：jquery-1.6.4.min.js
          TimerControl.js
          
          
资源文件：BarScrollDivCss/BarScrollDiv.css
          
          
-----------------------*/
;(function($) {
    //默认创建参数
    $.BarScrollDiv = new Object();
    $.BarScrollDiv.defaults = {
        //样式前缀
        CssBefore : "BarScrollDiv",
        
        //容器宽度,可以为象素值，也可以为百分比，也可以为auto
        Width : "100%",
        
        //滚动每一下的距离，单位为px
        ScrollStep : 2,
        
        //自定义滚动对象，若定义该值，则通过该对象判断是否需滚动，同时也是滚动该对象
        SelfScrollObj : null
    };
    
    //将指定对象装载到容器中
    $.fn.WrapBarScrollDiv = function(id,opts){
        //获取参数
        opts = $.extend({}, $.BarScrollDiv.defaults, opts || {});
        
        //循环对每个对象进行处理
        for(var i = 0;i<this.length;i++){
            var childObj = $(this.get(i));
            
            if(childObj.is("[InBarScrollDiv='true']")){
                //已经包裹过了
                continue;
            }
            
            //是否自定义id
            var tempid = id;
            if(tempid === undefined || tempid == ""){
                var autoidnum = 0;
                while(true){
                    if($("#BarScrollDiv_"+autoidnum).length > 0){
                        autoidnum++;
                    }
                    else{
                        tempid = "BarScrollDiv_"+autoidnum;
                        break;
                    }
                }
            }
            
            //创建对象
            var HTML = "<TABLE selftyp='BarScrollDiv' id='"+tempid+"' class='"+opts.CssBefore+"_Main' border=0 cellSpacing=0 cellPadding=0 style='width:"+opts.Width+";'> \
                        <TR> \
	                    <TD BarScrollDivType='ContentTd' class='"+opts.CssBefore+"_ConterntTd'> \
	                        <DIV id='t3' BarScrollDivType='ContentDiv' class='"+opts.CssBefore+"_ConterntDiv'></DIV> \
	                    </TD> \
	                    </TR> \
                    </TABLE>";
            
            childObj.wrap(HTML);
            var obj = $("#"+tempid).last();
            
            //添加前后两个TD
            var ContentDiv = obj.find("div[BarScrollDivType='ContentDiv']").first();
            var ContentTD = obj.find("td[BarScrollDivType='ContentTd']").first();
            ContentTD.before("<TD BarScrollDivType='LeftButton' class='"+opts.CssBefore+"_LeftButton'>&nbsp;</TD>");
            ContentTD.after("<TD BarScrollDivType='RightButton' class='"+opts.CssBefore+"_RightButton'>&nbsp;</TD>");
            
            var LeftTD = obj.find("td[BarScrollDivType='LeftButton']").first();
            var RightTD = obj.find("td[BarScrollDivType='RightButton']").first();
            
            //为对象打上标签
            childObj.attr("InBarScrollDiv","true");
            
            //获得按钮宽度
            obj.attr("LeftTDWidth",LeftTD.outerWidth(true));
            obj.attr("RightTDWidth",RightTD.outerWidth(true));
            
            //绑定参数
            obj.data("BarScrollDivOpts",opts);
            
            //检测是否需要展示滚动条
            BarScrollDivShowScrollButton(obj,opts);
            
            //绑定按钮事件
            LeftTD.bind("mouseover",BarScrollDivButtonMouseOver);
            LeftTD.bind("mouseout",BarScrollDivButtonMouseOut);
            LeftTD.bind("mousedown",BarScrollDivButtonMouseDown);
            LeftTD.bind("mouseup",BarScrollDivButtonMouseUp);
            
            RightTD.bind("mouseover",BarScrollDivButtonMouseOver);
            RightTD.bind("mouseout",BarScrollDivButtonMouseOut);
            RightTD.bind("mousedown",BarScrollDivButtonMouseDown);
            RightTD.bind("mouseup",BarScrollDivButtonMouseUp);
            
            ContentDiv.bind("resize",$.BarScrollDivResize);
        }
    };
    
    
    
    //以下为自有函数
    //检查是否显示滚动按钮
    function BarScrollDivShowScrollButton(obj,opts){
        //获得对象的快捷方式
        var ContentDiv = obj.find("div[BarScrollDivType='ContentDiv']").first();
        var ChildObj = ContentDiv.children().first();
        
        //判断是否要显示
        var needScroll = true;
        var DivWidth = ContentDiv.innerWidth();
        var childWidth = 0;
        if(opts.SelfScrollObj == null){
            childWidth = ContentDiv.children().first().outerWidth(true);
        }
        else{
            var currentScroll = opts.SelfScrollObj.scrollLeft();
            opts.SelfScrollObj.scrollLeft(100000000);
            childWidth = DivWidth + opts.SelfScrollObj.scrollLeft();
            opts.SelfScrollObj.scrollLeft(currentScroll);
        }
        
        if(childWidth <= DivWidth || (!obj.hasClass(opts.CssBefore + "_Hidden") && childWidth <= (DivWidth+parseInt(obj.attr("LeftTDWidth")) +parseInt(obj.attr("RightTDWidth"))))){
            needScroll = false;
        }
        

        //处理显示
        if(needScroll){
            obj.removeClass(opts.CssBefore + "_Hidden");
            
            //判断是否屏蔽左边样式
            if(ContentDiv.scrollLeft() == 0){
                if(!obj.hasClass(opts.CssBefore + "_LeftDisable")){
                    obj.addClass(opts.CssBefore + "_LeftDisable");
                }
            }
        }
        else{
            obj.removeClass(opts.CssBefore + "_LeftDisable");
            obj.removeClass(opts.CssBefore + "_LeftOver");
            obj.removeClass(opts.CssBefore + "_RightDisable");
            obj.removeClass(opts.CssBefore + "_RightOver");
            if(!obj.hasClass(opts.CssBefore + "_Hidden")){
                obj.addClass(opts.CssBefore + "_Hidden");
            }
        }
    };
    
    //从对象开始向上找到容器对象
    function GetBarScrollDivObj(childobj){
        var parentObj = childobj;
        while(!parentObj.is("table[selftyp='BarScrollDiv']") && parentObj.get(0) != document.body){
            parentObj = $(parentObj.get(0).parentNode);
        }
        if(parentObj.get(0) == document.body){
            return $("");
        }
        else{
            return parentObj;
        }
    };
    
    //鼠标移到按钮上
    function BarScrollDivButtonMouseOver(){
        var tdobj = $(this);
        var obj = GetBarScrollDivObj(tdobj);
        var opts = obj.data("BarScrollDivOpts");
        if(tdobj.is("[BarScrollDivType='LeftButton']")){
            if(!obj.hasClass(opts.CssBefore+"_LeftDisable") && !obj.hasClass(opts.CssBefore+"_LeftOver")){
                obj.addClass(opts.CssBefore+"_LeftOver");
            }
        }
        else{
            if(!obj.hasClass(opts.CssBefore+"_RightDisable") && !obj.hasClass(opts.CssBefore+"_RightOver")){
                obj.addClass(opts.CssBefore+"_RightOver");
            }
        }
    };
    
    //鼠标移出按钮
    function BarScrollDivButtonMouseOut(){
        var tdobj = $(this);
        var obj = GetBarScrollDivObj(tdobj);
        var opts = obj.data("BarScrollDivOpts");
        if(tdobj.is("[BarScrollDivType='LeftButton']")){
            obj.removeClass(opts.CssBefore+"_LeftOver");
        }
        else{
            obj.removeClass(opts.CssBefore+"_RightOver");
        }
    };
    
    //执行滚动操作
    function BarScrollDivScrolling(TimerID,DivID,LeftRight,Step,CssBefore){
        var obj = $("#"+DivID);
        var opts = obj.data("BarScrollDivOpts");
        var ContentDiv = opts.SelfScrollObj;
        if(ContentDiv == null){
            ContentDiv = obj.find("div[BarScrollDivType='ContentDiv']").first();
        }
        var currentScroll = ContentDiv.scrollLeft();
        if(LeftRight == "Left"){
            ContentDiv.scrollLeft(currentScroll - Step);
            if(ContentDiv.scrollLeft() == 0){
                //到尽头了，先删除Timer
                $.ClearTimer(TimerID);
                if(obj.hasClass(CssBefore+"_LeftOver")){obj.removeClass(CssBefore+"_LeftOver");}
                if(!obj.hasClass(CssBefore+"_LeftDisable")){obj.addClass(CssBefore+"_LeftDisable");}
            }
            obj.removeClass(CssBefore+"_RightDisable");
        }
        else{
            ContentDiv.scrollLeft(currentScroll + Step);
            if(ContentDiv.scrollLeft() < currentScroll + Step){
                //到尽头了先删除Timer
                $.ClearTimer(TimerID);
                if(obj.hasClass(CssBefore+"_RightOver")){obj.removeClass(CssBefore+"_RightOver");}
                if(!obj.hasClass(CssBefore+"_RightDisable")){obj.addClass(CssBefore+"_RightDisable");}
            }
            obj.removeClass(CssBefore+"_LeftDisable");
        }
    };
    
    //鼠标按下
    function BarScrollDivButtonMouseDown(){
        var tdobj = $(this);
        var obj = GetBarScrollDivObj(tdobj);
        var objid = obj.attr("id");
        var opts = obj.data("BarScrollDivOpts");
        if(tdobj.is("[BarScrollDivType='LeftButton']")){
            if(!obj.hasClass(opts.CssBefore+"_LeftDisable")){
                var js = "$.AddTimer('BarScrollDiv"+objid+"',function(){BarScrollDivScrolling('BarScrollDiv"+objid+"','"+objid+"','Left',"+opts.ScrollStep+",'"+opts.CssBefore+"');},10,true);";
                eval(js);
            }
        }
        else{
            if(!obj.hasClass(opts.CssBefore+"_RightDisable")){
                var js = "$.AddTimer('BarScrollDiv"+objid+"',function(){BarScrollDivScrolling('BarScrollDiv"+objid+"','"+objid+"','Right',"+opts.ScrollStep+",'"+opts.CssBefore+"');},10,true);";
                eval(js);
            }
        }
    };
    
    //鼠标释放
    function BarScrollDivButtonMouseUp(){
        var tdobj = $(this);
        var obj = GetBarScrollDivObj(tdobj);
        //清除Timer
        $.ClearTimer("BarScrollDiv"+obj.attr("id"));
    };
    
    //容器改变大小时执行的函数，可能是容器，也可能是对象
    $.BarScrollDivResize = function(){
        var obj = GetBarScrollDivObj($(this));

        //检测是否需要展示滚动条
        BarScrollDivShowScrollButton(obj,obj.data("BarScrollDivOpts"));
    };

})(jQuery);