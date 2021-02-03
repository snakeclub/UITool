/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：Button
说明：按钮控件
文件：Button.js
依赖文件：jquery-1.6.4.min.js
          ToolFunction.js
          
          
资源文件：ButtonCss/Button.css
          
          
-----------------------*/
;(function($) {
    //默认创建参数
    $.Button = new Object();
    $.Button.defaults = {
        //样式前缀
        CssBefore : "Button",
        
        //按钮类型，支持类型如下
        //Text - 纯文字按钮-或带图标的按钮
        //Icon - 纯图标按钮
        //SplitArrow - 分隔下拉按钮（用于组合分隔下拉菜单）
        Type : "Text",
        
        //是否支持按下效果
        SupportDownStatus : false,
        
        //按下鼠标时执行的函数，传入的参数依次为：按钮本身对象、当前按下状态、按钮文本、event
        OnClick : null,
        
        //鼠标移上去时执行的函数，传入的参数依次为：按钮本身对象、当前按下状态、按钮文本、event
        OnMouseOver : null,
        
        //鼠标移出去时执行的函数，传入的参数依次为：按钮本身对象、当前按下状态、按钮文本、event
        OnMouseOut : null,
        
        //鼠标按下时执行的函数，传入的参数依次为：按钮本身对象、当前按下状态、按钮文本、event
        OnMouseDown : null,
        
        //鼠标释放时执行的函数，传入的参数依次为：按钮本身对象、当前按下状态、按钮文本、event
        OnMouseUp : null,
        
        //开启鼠标移动上去的效果，仅Input、Div类型有效
        MouseOverEfect : true,
        
        //开启按钮点击的效果，仅Input、Div类型有效
        MouseClickEfect : true,
        
        //是否指定定按钮宽度
        SetWidth : false,
        
        //按钮中Button对象的宽度,不包括两边的各3px的圆角部分
        Width : 70,
        
        //是否有Icon，只有Text类型使用
        WithIcon : false,
        
        //图标的位置,Left - 在左边，Right-在右边
        IconPositon : "Left",
        
        //是否工具栏图标
        InToolBar : false,
        
        //是否带下拉框
        WithArrow : false,
        
        //下拉框位置,Left - 在左边，Right-在右边
        ArrowPositon : "Right",
        
        //是否分隔按钮
        IsSplit : false,
        
        //分隔的位置，Left - 按钮在左边，Right-按钮在右边  
        //如果按钮类型为SplitArrow，该参数也代表按钮所在的位置
        SplitPositon : "Left",
        
        //有Icon的情况下，图标的background属性，主要是为了指定图片准备，空代表不使用该参数
        //例如"url(../../ui-control/ButtonImg/Button_Table_Sprite.gif) no-repeat 0 -21px"
        //正常状态图标
        IconBgNormal : "",
        
        //屏蔽状态
        IconBgDisable : "",
        
        //正常状态鼠标移过
        IconBgOver : "",
        
        //正常状态鼠点击
        IconBgClick : "",
        
        //按下状态
        IconBgDown : "",
        
        //按下状态鼠标移过
        IconBgDownOver : "",
        
        //按下状态鼠标点击
        IconBgDownClick : "",
        
        //按下状态屏蔽
        IconBgDownDisable : ""
    };
    
    //在指定对象下创建一个Button控件
    $.fn.CreateButton = function(id,opts,value){
        //获取参数
        if(value === undefined){
            value = "";
        }
        opts = $.extend({}, $.Button.defaults, opts || {});
        
        //要返回的对象
        var RetObj = $("");
        
        //循环对每个对象进行处理
        for(var i = 0;i<this.length;i++){
            var parentobj = $(this.get(i));
            
            //是否自定义id
            var tempid = id;
            if(tempid === undefined || tempid == ""){
                var autoidnum = 0;
                while(true){
                    if($("#Button_"+autoidnum).length > 0){
                        autoidnum++;
                    }
                    else{
                        tempid = "Button_"+autoidnum;
                        break;
                    }
                }
            }
            
            //要添加的其他属性
            var ExtentCss = "";
            switch(opts.Type){
                case "Icon" :
                    //纯图标按钮
                    ExtentCss += " " + opts.CssBefore + "_Icon";
                    break;
                case "SplitArrow" : 
                    //分隔按钮的箭头部分
                    if(opts.SplitPositon == "Left")
                        ExtentCss += " " + opts.CssBefore + "_SplitArrowL";
                    else
                        ExtentCss += " " + opts.CssBefore + "_SplitArrow";
                default :
                    //一般按钮
                    if(opts.WithIcon){
                        ExtentCss += " " + opts.CssBefore + "_IconText";
                        if(opts.IconPositon == "Right"){
                            ExtentCss += " " + opts.CssBefore + "_IconR";
                        }
                    }
                    //带有下拉箭头
                    if(opts.WithArrow){
                        if(opts.ArrowPositon == "Right")
                            ExtentCss += " " + opts.CssBefore + "_Arrow";
                        else
                            ExtentCss += " " + opts.CssBefore + "_ArrowL";
                    }
                    break;
            }
            
            //工具栏
            /*
            if(opts.InToolBar){
                ExtentCss += " " + opts.CssBefore + "_ToolBar";
            }
            */

            //分隔下拉按钮
            if(opts.IsSplit && opts.Type != "SplitArrow"){
                if(opts.SplitPositon == "Left")
                    ExtentCss += " " + opts.CssBefore + "_SplitL";
                else
                    ExtentCss += " " + opts.CssBefore + "_Split";
            }
            
            
            //创建对象
            var HTML = "<TABLE id='"+tempid+"' selftype='Button' class='"+opts.CssBefore+"_Table" + ExtentCss + "' border=0 cellSpacing=0 cellPadding=0 value='"+value+"'  enable='true' status='Up'> \
	                        <TBODY "+(opts.InToolBar?" class='"+opts.CssBefore + "_ToolBar'":"")+"> \
		                        <TR class=''> \
			                        <TD class='"+opts.CssBefore+"_Left'> \
				                        <I class='"+opts.CssBefore+"_LeftI'>&nbsp;</I> \
			                        </TD> \
			                        <TD class='"+opts.CssBefore+"_Center'> \
				                        <EM class='"+opts.CssBefore+"_EM'> \
					                        <BUTTON class='"+opts.CssBefore+"_Button' "+(opts.SetWidth ? "style='Width:" + opts.Width + "px; Width:" + opts.Width + "px!important; overflow:hidden;'" : "")+">"+(opts.Type=="Text"?value : "&nbsp;")+"</BUTTON> \
				                        </EM> \
			                        </TD> \
			                        <TD class='"+opts.CssBefore+"_Right'> \
				                        <I class='"+opts.CssBefore+"_RightI'>&nbsp;</I> \
			                        </TD> \
		                        </TR> \
	                        </TBODY> \
                        </TABLE>";

            
            parentobj.append(HTML);
            var obj = parentobj.children("#"+tempid).last();
            
            //绑定参数
            obj.data("ButtonOpts",opts);
            
            //绑定按钮事件
            obj.bind("mouseover",ButtonMouseOver);
            obj.bind("mouseout",ButtonMouseOut);
            obj.bind("mousedown",ButtonMouseDown);
            obj.bind("mouseup",ButtonMouseUp);
            obj.bind("click",ButtonMouseClick);
            
            //设置图片
            SetButtonStyle(obj,"");
            
            //为IE7控制按钮大小
            if(opts.Type == "Text" && !opts.SetWidth &&  $.browser.msie && $.browser.version.substring(0,1) == "7"){
                obj.find("button").attr("style","overflow:hidden; width:" + obj.find("button").innerWidth(true) + "px!important; ");
                //如果不重新设置，图标不出来，因此多设置一下
                SetButtonStyle(obj,"");
            }
            
            RetObj = RetObj.add(obj);
        }
        
        return RetObj;
    };
    
    //在指定对象下创建一个分隔下拉框Button控件
    $.fn.CreateButtonSplit = function(id,opts,value,onSplitClick){
        if(this.length == 0)
            return;
        
        var parentobj = $(this.get(0));
        
        //获取参数
        if(value === undefined){
            value = "";
        }
        var optsText = $.extend({}, $.Button.defaults, opts || {});
        var optsSplit = $.extend({}, $.Button.defaults, opts || {});
        
        //设置参数
        optsText.WithArrow = false;
        optsText.IsSplit = true;
        optsText.SplitPositon = optsText.ArrowPositon;
        
        optsSplit.Type = "SplitArrow";
        optsSplit.SplitPositon = optsSplit.ArrowPositon;
        optsSplit.OnClick = onSplitClick;
        optsSplit.WithIcon = false;
        
        //是否自定义id
        var tempid = id;
        if(tempid === undefined){
            var autoidnum = 0;
            while(true){
                if($("#Button_"+autoidnum).length > 0){
                    autoidnum++;
                }
                else{
                    tempid = "Button_"+autoidnum;
                    break;
                }
            }
        }
        var splitID = tempid+"_Split";
        
        //创建按钮的父容器Table
        var HTML = "<TABLE selftType='SplitButton' id='"+tempid+"_SplitTable' border=0 cellSpacing=0 cellPadding=0 style='padding:0px; margin:0px;'>  \
                        <TR> \
                            <TD SplitButtonType='Left' style='vertical-align:middle; margin:0px; padding:0px;'></TD> \
                            <TD SplitButtonType='Right' style='vertical-align:middle; margin:0px; padding:0px;'></TD> \
                        </TR> \
                    </TABLE>";
         parentobj.append(HTML);
         var obj = parentobj.children("#"+tempid+"_SplitTable").last();
         
         //创建按钮
         obj.find("td[SplitButtonType='"+(optsText.SplitPositon=="Left"?"Right":"Left")+"']").CreateButton(tempid,optsText,value);
         obj.find("td[SplitButtonType='"+optsSplit.SplitPositon+"']").CreateButton(splitID,optsSplit,value);
         
         return obj;
    };
    
    //设置或获取Button的显示文本值
    $.fn.ButtonValue = function(value){
        if(value === undefined){
            //获取显示文本值
            if(this.length == 0){
                return "";
            }
            //只取第1个对象的值
            var obj = $(this.get(0));
            return obj.attr("value");
        }
        else{
            //设置显示值
            for(var i = 0;i<this.length;i++){
                var obj = $(this.get(i));
                if(obj.attr("selftype") != "Button"){
                    continue;
                }
                
                //设置值
                obj.attr("value",value);
                
                //显示到按钮中
                var opts = obj.data("ButtonOpts");
                if(opts.Type == "Text"){
                    obj.find("button").get(0).innerHTML = value;
                    //为IE7控制按钮大小
                    if(!opts.SetWidth &&  $.browser.msie && $.browser.version.substring(0,1) == "7"){
                        obj.find("button").removeAttr("style");
                        obj.find("button").attr("style","overflow:hidden; width:" + obj.find("button").innerWidth(true) + "px!important; ");
                        //如果不重新设置，图标不出来，因此多设置一下
                        SetButtonStyle(obj,"");
                    }
                }
            }
        }
    };
    
    //设置或获取Button的Up/Down状态
    $.fn.ButtonIsUp = function(isUp){
        if(isUp === undefined){
            //获取状态
            if(this.length == 0){
                return true;
            }
            
            //只取第1个对象的值
            var obj = $(this.get(0));
            return (obj.attr("status") == "Up");
        }
        else{
            //设置Up/Down状态
            for(var i = 0;i<this.length;i++){
                var obj = $(this.get(i));
                if(obj.attr("selftype") != "Button"){
                    continue;
                }
                
                var opts = obj.data("ButtonOpts");
                if(!opts.SupportDownStatus){
                    continue;
                }
                
                var status = (isUp ? "" : "Down");
                if(!obj.ButtonEnable()){
                    status = (isUp ? "Disable" : "DownDisable");
                }
                obj.attr("status",(isUp ? "Up" : "Down"));
                
                //显示样式
                SetButtonStyle(obj,status);
            }
        }
    };
    
    //设置Button是否开启
    $.fn.ButtonEnable =  function(isEnable){
        if(isEnable === undefined){
            //获取状态
            if(this.length == 0){
                return true;
            }
            
            //只取第1个对象的值
            var obj = $(this.get(0));
            return (obj.attr("enable") == "true");
        }
        else{
            for(var i = 0;i<this.length;i++){
                var obj = $(this.get(i));
                if(obj.attr("selftype") != "Button"){
                    continue;
                }
                
                //如果启用状态一致，无需变更
                if((obj.attr("enable") == "true") == isEnable){
                    continue;
                }
                
                var opts = obj.data("ButtonOpts");
                
                //设置属性
                obj.attr("enable",isEnable ? "true":"false");
                
                //设置button的启用状态
                if(isEnable){
                    obj.find("button").removeAttr("disabled");
                }
                else{
                    obj.find("button").attr("disabled","disabled");
                }
                
                //获得样式
                var status = (obj.ButtonIsUp() ? "" : "Down");
                if(!isEnable){
                    if(status == "")
                        status = "Disable";
                    else
                        status += "Disable";
                }
                
                //设置样式
                SetButtonStyle(obj,status);
            }
        }
    };
    
    //模拟点击按钮，执行按钮事件
    $.fn.ButtonClick = function(){
        for(var i = 0;i<this.length;i++){
           
            var obj = $(this.get(i));
            if(obj.attr("selftype") != "Button"){
                continue;
            }
            
            ButtonMouseClick(obj);
        }
    };
    
    
    
    //以下为私有函数
    
    //鼠标移动过按钮的绑定执行函数
    function ButtonMouseOver(){
        var obj = $(this);
        
        if(obj.attr("enable") != "true"){
            //屏蔽状态
            return;
        }
        
        //检查是否内部Hover
        if(!$.checkHover(event,obj.get(0))){
            return;
        }
        
        //获得应该的状态
        var opts = obj.data("ButtonOpts");
        
        //执行函数
        if(opts.OnMouseOver != null){
            try{
                //传入的参数依次为：按钮本身对象、当前按下状态、按钮文本、event
                opts.OnMouseOver(obj,obj.attr("status"),obj.attr("value"),event);
            }catch(e){;};
        }
        
        //判断是否需处理MouseOver样式
        if(!opts.MouseOverEfect){
            return;
        }
        
        var stylestatus = "Over";
        if(obj.attr("status") == "Down"){
            stylestatus = "DownOver";
        }
        
        //设置样式
        SetButtonStyle(obj,stylestatus);
    };
    
    //鼠标移出按钮的绑定执行函数
    function ButtonMouseOut(){
        var obj = $(this);
        
        if(obj.attr("enable") != "true"){
            //屏蔽状态
            return;
        }
        
        //检查是否内部Hover
        if(!$.checkHover(event,obj.get(0))){
            return;
        }
        
        //获得应该的状态
        var opts = obj.data("ButtonOpts");
        
        //执行函数
        if(opts.OnMouseOut != null){
            try{
                //传入的参数依次为：按钮本身对象、当前按下状态、按钮文本、event
                opts.OnMouseOut(obj,obj.attr("status"),obj.attr("value"),event);
            }catch(e){;};
        }
        
        //判断是否需处理MouseOver样式
        if(!opts.MouseOverEfect){
            return;
        }
        
        var stylestatus = "";
        if(obj.attr("status") == "Down"){
            stylestatus = "Down";
        }
        
        //设置样式
        SetButtonStyle(obj,stylestatus);
    };
    
    //鼠标按下的绑定执行函数
    function ButtonMouseDown(){
        var obj = $(this);
        
        if(obj.attr("enable") != "true"){
            //屏蔽状态
            return;
        }
        
        //获得应该的状态
        var opts = obj.data("ButtonOpts");
        
        //执行函数
        if(opts.OnMouseDown != null){
            try{
                //传入的参数依次为：按钮本身对象、当前按下状态、按钮文本、event
                opts.OnMouseDown(obj,obj.attr("status"),obj.attr("value"),event);
            }catch(e){;};
        }
        
        //判断是否需处理MouseClickEfect样式
        if(!opts.MouseClickEfect){
            return;
        }
        
        var stylestatus = "Click";
        if(obj.attr("status") == "Down"){
            stylestatus = "DownClick";
        }
        
        //设置样式
        SetButtonStyle(obj,stylestatus);
    };
    
    //鼠标释放的绑定执行函数
    function ButtonMouseUp(){
        var obj = $(this);
        
        if(obj.attr("enable") != "true"){
            //屏蔽状态
            return;
        }
        
        //获得应该的状态
        var opts = obj.data("ButtonOpts");
        
        //执行函数
        if(opts.OnMouseUp != null){
            try{
                //传入的参数依次为：按钮本身对象、当前按下状态、按钮文本、event
                opts.OnMouseUp(obj,obj.attr("status"),obj.attr("value"),event);
            }catch(e){;};
        }
        
        //判断是否需处理MouseClickEfect样式
        if(!opts.MouseClickEfect){
            return;
        }
        
        
        var stylestatus = "";
        if(obj.attr("status") == "Down"){
            stylestatus = "Down";
        }
        
        //设置样式
        SetButtonStyle(obj,stylestatus);
    };
    
    //点击鼠标执行的函数
    function ButtonMouseClick(obj){
        var RealClick = false;
        if(obj.jquery === undefined){
            obj = $(this);
            RealClick = true;
        }
        
        
        if(obj.attr("enable") != "true"){
            //屏蔽状态
            return;
        }
        
        //执行处理函数
        var opts = obj.data("ButtonOpts");
        if(opts.OnClick != null){
            try{
                opts.OnClick(obj,obj.attr("status"),obj.attr("value"),event);
            }catch(e){;}
        }
        
        if(obj.attr("enable") != "true"){
            //屏蔽状态
            return;
        }
        
        //获得当前状态
        var stylestatus = (RealClick?"Over":"");
        if(obj.attr("status") == "Down"){
            stylestatus = (RealClick?"DownOver":"Down");
        }
        
        //恢复原样
        obj.get(0).blur();
        
        //设置样式
        SetButtonStyle(obj,stylestatus);
    };
    
    //设置按钮样式
    function SetButtonStyle(obj,status,isRelate){
        var opts = obj.data("ButtonOpts");
        if(isRelate === undefined)
            isRelate = false;
        
        //判断和设置关联下拉按钮的样式
        if(!isRelate){
            if(opts.Type != "SplitArrow" && opts.IsSplit){
                var SplitButton = $("#"+obj.attr("id")+"_Split");
                if(SplitButton.length == 1){
                    SetButtonStyle($(SplitButton.get(0)),status,true);
                }
            }
            else if(opts.Type == "SplitArrow"){
                var SplitButton = $("#"+obj.attr("id").replace("_Split",""));
                if(SplitButton.length == 1){
                    SetButtonStyle($(SplitButton.get(0)),status,true);
                }
            }
        }
        
        //先设置样式
        obj.find("tr").attr("class",(status == ""? "" : opts.CssBefore + "_" + status));
        
        if(opts.Type == "Icon" || (opts.Type == "Text" && opts.WithIcon)){
            //设置图片
            var IconBg = "";
            var tempjs = "IconBg = opts.IconBg" + (status == ""?"Normal":status) + ";";
            eval(tempjs);
            
            if(IconBg == ""){
                //如果样式为空，则用Normal样式
                if(obj.attr("status") == "Down" && opts.IconBgDown != ""){
                    IconBg = opts.IconBgDown;
                }
                else{
                    IconBg = opts.IconBgNormal;
                }
            }
            if(IconBg != ""){
                obj.find("button").css("background",IconBg);
            }
        }
    };

})(jQuery);