/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：ToolButton
说明：工具栏按钮控件
文件：ToolButton.js
依赖文件：jquery-1.6.4.min.js
          
资源文件：ToolButtonCss/ToolButton.css
          
-----------------------*/
;(function($) {   
    //默认创建参数
    $.ToolButton = new Object();
    $.ToolButton.defaults = {
        //主样式名
        MainCssName : "ToolButton_Main",
        
        //按下鼠标时执行的函数，传入的参数依次为：按钮本身对象、按钮参数、event
        OnClick : null,
        
        //鼠标移上去时执行的函数，传入的参数依次为：按钮本身对象、按钮参数、event
        OnMouseOver : null,
        
        //鼠标移出去时执行的函数，传入的参数依次为：按钮本身对象、按钮参数、event
        OnMouseOut : null
    };
    
    //默认图片路径 
    $.ToolButton.ImgPath = "../../ui-control/ToolButtonImg/ToolButton_Sprites.gif";
    $.ToolButton.ImgPathTRANS = "../../ui-control/ToolButtonImg/ToolButton_SpritesTrans.gif";
    
    //图片样式的默认参数
    $.ToolButton.stylePara = {
        //主样式类型,Class - 样式名，Css - 样式表对象，例如{width:10px;bgcolor:xx;}，none-不设置
        MainStyleType : "none",
        
        //主样式参数
        MainStyle : "",
        
        //Normal状态样式类型，Class - 样式名，Css - 样式表对象
        NormalStyleType : "Class",
        
        //Normal状态样式参数
        NormalStyle : "ToolButton_Close",
        
        //Over状态样式类型，Class - 样式名，Css - 样式表对象
        OverStyleType : "Class",
        
        //Normal状态样式参数
        OverStyle : "ToolButton_CloseOver"
    };
    
    //在指定对象下创建一个ToolButton控件
    $.fn.CreateToolButton = function(id,para,stylePara,opts){
        //获取参数
        stylePara = $.extend({}, $.ToolButton.stylePara, stylePara || {});
        opts = $.extend({}, $.ToolButton.defaults, opts || {});
        
        //循环对每个对象进行处理
        for(var i = 0;i<this.length;i++){
            var parentobj = $(this.get(i));
            
            //是否自定义id
            var tempid = id;
            if(tempid === undefined){
                var autoidnum = 0;
                while(true){
                    if($("#ToolButton_"+autoidnum).length > 0){
                        autoidnum++;
                    }
                    else{
                        tempid = "ToolButton_"+autoidnum;
                        break;
                    }
                }
            }
            
            //创建对象
            var HTML = "<DIV id='"+tempid+"' selftype='ToolButton' class='"+opts.MainCssName+"' para='"+para+"'> \
                             &nbsp; \
                        </DIV>";
            
            parentobj.append(HTML);
            var obj = parentobj.children("#"+tempid).last();
            
            //设置主样式
            switch(stylePara.MainStyleType){
                case "Class":
                    obj.addClass(stylePara.MainStyle);
                    break;
                case "Css":
                    obj.css(stylePara.MainStyle);
                    break;
                default :
                    break;
            }
            
            //设置样式
            ToolButtonSetStyle(obj,stylePara,false);
            
            //绑定参数
            obj.data("ToolButtonOpts",opts);
            obj.data("StyleParaOpts",stylePara);
            
            //绑定按钮事件
            obj.bind("mouseover",ToolButtonMouseOver);
            obj.bind("mouseout",ToolButtonMouseOut);
            obj.bind("click",ToolButtonMouseClick);
        }
    };
    
    //修改按钮的样式
    $.fn.ChangeToolButtonStyle = function(stylePara){
        //循环对每个对象进行处理
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            var lastStyle = obj.data("StyleParaOpts");
            var tempStyle = stylePara;
            tempStyle = $.extend({}, lastStyle, tempStyle || {});
            
            //清除原来的样式，只清除样式表
            if(lastStyle.MainStyleType == "Class")
                obj.removeClass(lastStyle.MainStyle);
            
            if(lastStyle.NormalStyleType == "Class")
                obj.removeClass(lastStyle.NormalStyle);
                
            if(lastStyle.OverStyleType == "Class")
                obj.removeClass(lastStyle.OverStyle);
            
            //设置主样式
            switch(tempStyle.MainStyleType){
                case "Class":
                    obj.addClass(tempStyle.MainStyle);
                    break;
                case "Css":
                    obj.css(tempStyle.MainStyle);
                    break;
                default :
                    break;
            }
            
            //设置样式
            ToolButtonSetStyle(obj,tempStyle,false);
            
            //绑定参数
            obj.data("StyleParaOpts",tempStyle);
        }
    };
    
    //模拟点击按钮，执行按钮事件
    $.fn.ToolButtonClick = function(){
        for(var i = 0;i<this.length;i++){
           
            var obj = $(this.get(i));
            if(obj.attr("selftype") != "ToolButton"){
                continue;
            }
            
            ToolButtonMouseClick(obj);
        }
    };
    
    //快速获得系统默认按钮样式
    /*
    Type : "" - 系统默认按钮  ； "TRANS" - 系统默认的透明按钮
    Name :
        close-关闭
        minimize-最小化
        maximize-最大化
        restore-重置
        arrowup-上箭头
        arrowdown-下箭头
        gear-齿轮
        arrowleft-左箭头
        arrowright-右箭头
        pin-固定图钉
        unpin-不固定图钉
        right-双箭头向右
        left-双箭头向左
        up-双箭头向上
        down-双箭头向下
        refresh-刷新
        minus-减号
        plus-加号
        search-查询（TRANS无）
        save-保存（TRANS无）
        help-帮助（TRANS无）
        print-打印（TRANS无）
    */
    $.ToolButtonGetStyle = function(Type,Name){
        var NewStyle = {
            //主样式类型,Class - 样式名，Css - 样式表对象，例如{width:10px;bgcolor:xx;}，none-不设置
            MainStyleType : "none",
            
            //主样式参数
            MainStyle : "",
            
            //Normal状态样式类型，Class - 样式名，Css - 样式表对象
            NormalStyleType : "Class",
            
            //Normal状态样式参数
            NormalStyle : "ToolButton_Close",
            
            //Over状态样式类型，Class - 样式名，Css - 样式表对象
            OverStyleType : "Class",
            
            //Normal状态样式参数
            OverStyle : "ToolButton_CloseOver"
        };

        switch(Type){
            case "":  //一般
            case "TRANS":  //透明
                NewStyle.MainStyleType = "Css";
                NewStyle.MainStyle = {"background":"transparent url("+(Type==""?$.ToolButton.ImgPath:$.ToolButton.ImgPathTRANS)+") no-repeat"};
                NewStyle.NormalStyleType = "Css";
                NewStyle.OverStyleType = "Css";
                var pos,posOver;
                switch(Name){
                    case "close":  //关闭
                        pos = "0 -0";  posOver = "-15px 0";
                        break;
                    case "minimize": //最小化
                        pos = "0 -15px";  posOver = "-15px -15px";
                        break;
                    case "maximize":  //最大化
                        pos = "0 -30px";  posOver = "-15px -30px";
                        break;
                    case "restore":  //重置
                        pos = "0 -45px";  posOver = "-15px -45px";
                        break;
                    case "arrowup":  //上箭头
                        pos = "0 -60px";  posOver = "-15px -60px";
                        break;
                    case "arrowdown":  //下箭头
                        pos = "0 -75px";  posOver = "-15px -75px";
                        break;
                    case "gear":  //齿轮
                        pos = "0 -90px";  posOver = "-15px -90px";
                        break;
                    case "arrowleft":  //左箭头
                        pos = "0 -105px";  posOver = "-15px -105px";
                        break;
                    case "arrowright":  //右箭头
                        pos = "0 -120px";  posOver = "-15px -120px";
                        break;
                    case "pin":  //固定图钉
                        pos = "0 -135px";  posOver = "-15px -135px";
                        break;
                    case "unpin":  //不固定图钉
                        pos = "0 -150px";  posOver = "-15px -150px";
                        break;
                    case "right": //双箭头向右
                        pos = "0 -165px";  posOver = "-15px -165px";
                        break;
                    case "left":  //双箭头向左
                        pos = "0 -180px";  posOver = "-15px -180px";
                        break;
                    case "up":  //双箭头向上
                        pos = "0 -210px";  posOver = "-15px -210px";
                        break;
                    case "down":  //双箭头向下
                        pos = "0 -195px";  posOver = "-15px -195px";
                        break;
                    case "refresh":  //刷新
                        pos = "0 -225px";  posOver = "-15px -225px";
                        break;
                    case "minus":  //减号
                        pos = "0 -255px";  posOver = "-15px -255px";
                        break;
                    case "plus":  //加号
                        pos = "0 -240px";  posOver = "-15px -240px";
                        break;
                    default :
                        if(Type == ""){
                            switch(Name){
                                case "search":  //查询（TRANS无）
                                    pos = "0 -270px";  posOver = "-15px -270px";
                                    break;
                                case "save":  //保存（TRANS无）
                                    pos = "0 -285px";  posOver = "-15px -285px";
                                    break;
                                case "help":  //帮助（TRANS无）
                                    pos = "0 -300px";  posOver = "-15px -300px";
                                    break;
                                case "print":  //打印（TRANS无）
                                    pos = "0 -315px";  posOver = "-15px -315px";
                                    break;
                                default :
                                    pos = "0 -0";
                                    posOver = "-15px 0";
                                    break;
                            }
                        }
                        else{
                            pos = "0 -0";
                            posOver = "-15px 0";
                        }
                        break;
                }
                NewStyle.NormalStyle = {"background-position":pos};
                NewStyle.OverStyle = {"background-position":posOver};
                break;
            default :
                break;
        }
        
        //返回
        return NewStyle;
    };
    
    
    //以下为内部处理函数
    //设置按钮样式
    function ToolButtonSetStyle(obj,stylePara,isOver){
        var Stype;
        var Sstyle;
        if(isOver){
            Stype = stylePara.OverStyleType;
            Sstyle = stylePara.OverStyle;
        }
        else{
            Stype = stylePara.NormalStyleType;
            Sstyle = stylePara.NormalStyle;
        }
        
        //开始设置
        if(Stype == "Class"){
            //清除class名
            if(stylePara.NormalStyleType == "Class")
                obj.removeClass(stylePara.NormalStyle);
            if(stylePara.OverStyleType == "Class")
                obj.removeClass(stylePara.OverStyle);
            obj.addClass(Sstyle);
        }
        else{
            obj.css(Sstyle);
        }
    };
    
    //鼠标移上对象
    function ToolButtonMouseOver(){
        var obj = $(this);
        var stylePara = obj.data("StyleParaOpts");
        var opts = obj.data("ToolButtonOpts");
        
        //先设置样式
        ToolButtonSetStyle(obj,stylePara,true);
        
        //执行OnMouseOver函数
        if(opts.OnMouseOver != null){
            try{
                //传入的参数依次为：按钮本身对象、按钮参数、event
                opts.OnMouseOver(obj,obj.attr("para"),event);
            }catch(e){;};
        }
    };
    
    //鼠标移出对象
    function ToolButtonMouseOut(){
        var obj = $(this);
        var stylePara = obj.data("StyleParaOpts");
        var opts = obj.data("ToolButtonOpts");
        
        //先设置样式
        ToolButtonSetStyle(obj,stylePara,false);
        
        //执行OnMouseOut函数
        if(opts.OnMouseOut != null){
            try{
                //传入的参数依次为：按钮本身对象、按钮参数、event
                opts.OnMouseOut(obj,obj.attr("para"),event);
            }catch(e){;};
        }
    };
    
    //鼠标点击事件
    function ToolButtonMouseClick(obj){
        if(obj.jquery === undefined){
            obj = $(this);
        }
        
        var opts = obj.data("ToolButtonOpts");
        
        //执行OnClick函数
        if(opts.OnClick != null){
            try{
                //传入的参数依次为：按钮本身对象、按钮参数、event
                opts.OnClick(obj,obj.attr("para"),event);
            }catch(e){;};
        }
    };

})(jQuery);