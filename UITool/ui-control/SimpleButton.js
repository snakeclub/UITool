/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：SimpleButton
说明：简单按钮控件
文件：SimpleButton.js
依赖文件：jquery-1.6.4.min.js
          ToolFunction.js
          
          
资源文件：SimpleButtonCss/SimpleButton.css
          SimpleButtonImg/SimpleButton_A_A.gif
          SimpleButtonImg/SimpleButton_A_Span.gif
          
          
-----------------------*/
;(function($) {
    //默认创建参数
    $.SimpleButton = new Object();
    $.SimpleButton.defaults = {
        //样式前缀
        CssBefore : "SimpleButton",
        
        //按钮类型，支持Input、Div、A这3种类型
        Type : "A",
        
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
        
        //按钮大小控制方式,fixed-固定大小，css－依照css样式中的大小，text-依照文字内容大小，仅Div类型有效
        SizeType : "text",
        
        //大小控制方式为fixed时的宽，仅Div类型有效
        Width : 70,
        
        //大小控制方式为fixed时的高，仅Div类型有效
        Height : 16,
        
        //是否显示Icon，仅Div有效
        ShowIcon : true,
        
        //是否显示Text，仅Div有效
        ShowText : true,
        
        //Div样式时，图标的位置是否为左边
        IconLeft : true,
        
        //有Icon的情况下，图标的background属性，主要是为了指定图片准备，空代表不使用该参数
        //注意这部分参数会覆盖CSS的参数，因此只要有一个传了值，那就代表CSS参数无效
        //例如"url(../../ui-control/ButtonImg/Button_Table_Sprite.gif) no-repeat 0 0"
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
    
    //在指定对象下创建一个SimpleButton控件
    $.fn.CreateSimpleButton = function(id,opts,value){
        //获取参数
        if(value === undefined){
            value = "";
        }
        opts = $.extend({}, $.SimpleButton.defaults, opts || {});
        
        //屏蔽不支持的类型和参数
        switch(opts.Type){
            case "A":
                opts.SizeType = "css";
                opts.MouseClickEfect = false;
                break;
            case "Input":
                opts.SizeType = "css";
            default:
                break;
        }        
        
        //循环对每个对象进行处理
        for(var i = 0;i<this.length;i++){
            var parentobj = $(this.get(i));
            
            //是否自定义id
            var tempid = id;
            if(tempid === undefined){
                var autoidnum = 0;
                while(true){
                    if($("#SimpleButton_"+autoidnum).length > 0){
                        autoidnum++;
                    }
                    else{
                        tempid = "SimpleButton_"+autoidnum;
                        break;
                    }
                }
            }
            
            //创建对象
            var HTML = "";
            switch(opts.Type){
                case "Div":
                    var ImgHtml = "<div ButtonType='DivIcon' "+(opts.ShowIcon ? "":"style='display:none;'")+"></div>";
                    var AHtml = "<a style='float:left;white-space:nowrap;"+(opts.ShowText ? "":"display:none;")+"'>"+value+"</a>";
                    HTML = "<div id='"+tempid+"' selftype='SimpleButton' ButtonType='Div' value='"+value+"'  enable='true' status='Up' stylestatus=''>"
                         + (opts.IconLeft ? ImgHtml + AHtml : AHtml + ImgHtml)
                         + "</div>";
                    break;
                case "Input":
                    HTML = "<input type='button' id='"+tempid+"' selftype='SimpleButton' ButtonType='Input' value='"+value+"' enable='true' status='Up' stylestatus=''></input>";
                    break;
                case "A":
                    HTML = "<A id='"+tempid+"' selftype='SimpleButton' ButtonType='A' value='"+value+"' enable='true' status='Up' href='#'><SPAN>"+value+"</SPAN></A>";
                    break;
                default:
                    //类型错误，不继续处理
                    continue;
            }
            
            parentobj.append(HTML);
            var obj = parentobj.children("#"+tempid).last();
            
            //绑定参数
            obj.data("SimpleButtonOpts",opts);
            
            //对于A和Input绑定样式
            if(opts.Type == "A" || opts.Type=="Input"){
                obj.attr("class",opts.CssBefore + "_" + opts.Type + "_Normal");
            }
            
            //绑定按钮事件
            if(opts.Type != "A"){
                obj.bind("mouseover",SimpleButtonMouseOver);
                obj.bind("mouseout",SimpleButtonMouseOut);
                obj.bind("mousedown",SimpleButtonMouseDown);
                obj.bind("mouseup",SimpleButtonMouseUp);
            }
            obj.bind("click",SimpleButtonMouseClick);
            
            //设置样式，仅Div和DivIcon会使用这个设置样式，原因是要考虑到圆角的公用处理
            SetSimpleButtonStyle(obj,true);
        }
    };
    
    //设置或获取Button的显示文本值
    $.fn.SimpleButtonValue = function(value){
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
                if(obj.attr("selftype") != "SimpleButton"){
                    continue;
                }
                
                switch(obj.attr("ButtonType")){
                    case "Input":
                        obj.attr("value",value);
                        break;
                    case "Div":
                        obj.attr("value",value);
                        obj.children("A").get(0).innerHTML=value;
                        SetSimpleButtonStyle(obj,true);
                        break;
                    case "A":
                        obj.attr("value",value);
                        obj.children("SPAN").get(0).innerHTML=value;
                        break;
                    default :
                        continue;
                } 
            }
        }
    };
    
    //设置或获取Button的Up/Down状态
    $.fn.SimpleButtonIsUp = function(isUp){
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
                if(obj.attr("selftype") != "SimpleButton"){
                    continue;
                }
                
                var opts = obj.data("SimpleButtonOpts");
                if(!opts.SupportDownStatus){
                    continue;
                }
                
                var status = (isUp ? "Normal" : "Down");
                if(!obj.SimpleButtonEnable()){
                    status = (isUp ? "Disable" : "DownDisable");
                }
                
                obj.attr("status",(isUp ? "Up" : "Down"));
                
                switch(obj.attr("ButtonType")){
                    case "Input":
                        obj.attr("class",opts.CssBefore + "_" + opts.Type + "_"+status);
                        break;
                    case "Div":
                        SetSimpleButtonStyle(obj,false);
                        break;
                    case "A":
                        obj.attr("class",opts.CssBefore + "_" + opts.Type + "_"+status);
                        break;
                    default :
                        continue;
                } 
            }
        }
    };
    
    //设置Button是否开启
    $.fn.SimpleButtonEnable =  function(isEnable){
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
                if(obj.attr("selftype") != "SimpleButton"){
                    continue;
                }
                
                //如果启用状态一致，无需变更
                if((obj.attr("enable") == "true") == isEnable){
                    continue;
                }
                
                var opts = obj.data("SimpleButtonOpts");
                
                //设置属性
                obj.attr("enable",isEnable ? "true":"false");
                
                //获得样式
                var status = (obj.SimpleButtonIsUp() ? "Normal" : "Down");
                if(!isEnable){
                    if(status == "Normal")
                        status = "Disable";
                    else
                        status += "Disable";
                }
                
                //设置样式
                switch(obj.attr("ButtonType")){
                    case "Input":
                        obj.attr("class",opts.CssBefore + "_" + opts.Type + "_"+status);
                        if(isEnable){
                            obj.removeAttr("disabled");
                        }else{
                            obj.attr("disabled","disabled");
                        }
                        break;
                    case "Div":
                        SetSimpleButtonStyle(obj,false);
                        break;
                    case "A":
                        obj.attr("class",opts.CssBefore + "_" + opts.Type + "_"+status);
                        break;
                    default :
                        continue;
                } 
            }
        }
    };
    
    //模拟点击按钮，执行按钮事件
    $.fn.SimpleButtonClick = function(){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            if(obj.attr("selftype") != "SimpleButton"){
                continue;
            }
            
            SimpleButtonMouseClick(obj);
        }
    };
    
    
    
    //以下为私有函数
    
    //根据参数重新设置Button的样式,只处理Div和DivIcon的按钮
    function SetSimpleButtonStyle(obj,ReLoadStyle,SetStatus){
        //获得参数
        var opts = obj.data("SimpleButtonOpts");
        
        //没有传指定的状态值，根据实际的状态处理
        if(SetStatus === undefined){
            if(obj.attr("enable") != "true"){
                //屏蔽状态
                if(opts.SupportDownStatus && obj.attr("status") == "Down"){
                    SetStatus = "DownDisable";
                }
                else{
                    SetStatus = "Disable";
                }
            }
            else{
                //非屏蔽
                if(obj.attr("status") == "Down"){
                    SetStatus = "Down";
                }
                else{
                    SetStatus = "Normal";
                }
            }
        }
        
        //没有要求重新装载的情况，如果要改变的状态和原状态一样，则不处理样式
        if(!ReLoadStyle && obj.attr("stylestatus") == SetStatus){
            return;
        }
        
        //绑定样式
        obj.attr("class",opts.CssBefore + "_"+opts.Type+"_"+SetStatus);
        if(opts.Type == "Div" && opts.ShowIcon){
            obj.children("[ButtonType='DivIcon']").attr("class",opts.CssBefore + "_DivIconImg_"+SetStatus);
            //设置图片
            var IconBg = "";
            var tempjs = "IconBg = opts.IconBg" + SetStatus + ";";
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
                obj.children("[ButtonType='DivIcon']").css("background",IconBg);
            }
        }
        
        //控制按钮大小
        switch(opts.SizeType){
            case "fixed":
                //固定大小
                obj.css({width:opts.Width+"px",height:opts.Height+"px",overflow:"hidden"});
                break;
            case "text":
                //根据文字大小
                obj.css({width:"",height:""});
                if(opts.Type == "Div"){
                    var childlist = obj.children();
                    var tempwidth = $(childlist.get(0)).outerWidth(true) + $(childlist.get(1)).outerWidth(true);
                    var tempheight = Math.max($(childlist.get(0)).outerHeight(true),$(childlist.get(1)).outerHeight(true));
                    obj.css({width:tempwidth+"px",height:tempheight+"px"});
                }
                else{
                    obj.css({width:obj.children().outerWidth(true)+"px",height:obj.children().outerHeight(true)+"px"});
                }
                break;
            default :
                //按css样式大小
                obj.css({width:"",height:""});
                break;
        }
        
        //记录当前状态
        obj.attr("stylestatus",SetStatus);
    };
    
    //鼠标移动过按钮的绑定执行函数
    function SimpleButtonMouseOver(){
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
        var opts = obj.data("SimpleButtonOpts");

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
        
        if(opts.Type == "Input"){
            //直接处理样式
            obj.attr("class",opts.CssBefore + "_" + opts.Type + "_"+stylestatus);
        }
        else{
            //Div
            SetSimpleButtonStyle(obj,false,stylestatus)
        }
    };
    
    //鼠标移出按钮的绑定执行函数
    function SimpleButtonMouseOut(){
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
        var opts = obj.data("SimpleButtonOpts");
        
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
        
        var stylestatus = "Normal";
        if(obj.attr("status") == "Down"){
            stylestatus = "Down";
        }
        
        if(opts.Type == "Input"){
            //直接处理样式
            obj.attr("class",opts.CssBefore + "_" + opts.Type + "_"+stylestatus);
        }
        else{
            //Div和DivIcon
            SetSimpleButtonStyle(obj,false,stylestatus)
        }
    };
    
    //鼠标按下的绑定执行函数
    function SimpleButtonMouseDown(){
        var obj = $(this);
        
        if(obj.attr("enable") != "true"){
            //屏蔽状态
            return;
        }
        
        //获得应该的状态
        var opts = obj.data("SimpleButtonOpts");
        
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
        
        if(opts.Type == "Input"){
            //直接处理样式
            obj.attr("class",opts.CssBefore + "_" + opts.Type + "_"+stylestatus);
        }
        else{
            //Div
            SetSimpleButtonStyle(obj,false,stylestatus)
        }
    };
    
    //鼠标释放的绑定执行函数
    function SimpleButtonMouseUp(){
        var obj = $(this);
        
        if(obj.attr("enable") != "true"){
            //屏蔽状态
            return;
        }
        
        //获得应该的状态
        var opts = obj.data("SimpleButtonOpts");
        
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
        
        
        var stylestatus = "Normal";
        if(obj.attr("status") == "Down"){
            stylestatus = "Down";
        }
        
        if(opts.Type == "Input"){
            //直接处理样式
            obj.attr("class",opts.CssBefore + "_" + opts.Type + "_"+stylestatus);
        }
        else{
            //Div
            SetSimpleButtonStyle(obj,false,stylestatus)
        }
    };
    
    //点击鼠标执行的函数
    function SimpleButtonMouseClick(obj){
        if(obj.jquery === undefined){
            obj = $(this);
        }
        
        
        if(obj.attr("enable") != "true"){
            //屏蔽状态
            return;
        }
        
        //执行处理函数
        var opts = obj.data("SimpleButtonOpts");
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
        var stylestatus = "Normal";
        if(obj.attr("status") == "Down"){
            stylestatus = "Down";
        }
        
        if(opts.Type == "Input"){
            //直接处理样式
            obj.attr("class",opts.CssBefore + "_" + opts.Type + "_"+stylestatus);
        }
        else{
            //Div
            SetSimpleButtonStyle(obj,false,stylestatus)
        }
        
        //恢复原样
        obj.get(0).blur();
    };

})(jQuery);