/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：Panel
说明：Panel容器控件
文件：Panel.js
依赖文件：jquery-1.6.4.min.js
          ToolFunction.js
          
          
资源文件：PanelCss/Panel.css
          
          
-----------------------*/
;(function($) {
    //默认创建参数
    $.Panel = new Object();
    $.Panel.defaults = {
        //样式前缀
        CssBefore : "Panel",
        
        //是否圆角
        IsCorner : false,
        
        //标题位置,Up Down Left Right
        TitleDirect : "Up",
        
        //标题文字
        TitleText : "Panel",
        
        //是否显示标题图片
        ShowTitlePic : false,
        
        //标题图片src
        TitlePicSrc : "",
        
        //是否显示内容滚动条
        ShowScrollBar : true,
        
        //窗口大小类型,fixed - 固定设置大小，fit － 根据内容大小自适应（内容div不出现滚动条），fitX - 横向自适应，fitY - 纵向自适应
        SizeType : "fixed",
        
        //宽度,px，对于fit类型则为百分比的数值（填-1则代表根据内容大小自动设置宽度）
        Width : 300,
        
        //高度,px，对于fit类型则为百分比的数值（填-1则代表根据内容大小自动设置宽度）
        Height : 200,
        
        //最小宽度，px
        MinWidth : 130,
        
        //最小高度，px
        MinHeight : 75,
        
        //Panel位置的Css
        CssPosition : "static",
        
        //Panel初始位置类型,center - 居中，letftop － 相对左上角
        StartPosition : "center",
        
        //Panel初始位置，px，对于center类型无效
        Left : 10,
        
        //Panel初始位置，px，对于center类型无效
        Top : 10,
        
        //展开/收缩内容栏位的时间，如果为-1则代表直接展开/收缩
        ExpandSpeed : 1000,
        
        //窗口事件
        //启动（创建）Panel时执行的函数，传入参数依次为Panel对象、Panel的内容容器对象、Panel的标题容器对象、Panel的创建参数
        OnLoading : null,
        
        //关闭Panel前时执行的函数，传入参数依次为Panel对象、Panel的内容容器对象，如果想禁止Panel关闭，则需返回false
        OnClose : null,
        
        //显示Panel时执行的函数，传入参数依次为Panel对象、Panel的内容容器对象、Panel的标题容器对象，传入的显示参数
        OnShow : null,
        
        //隐藏Panel时执行的函数，传入参数依次为Panel对象、Panel的内容容器对象、Panel的标题容器对象
        OnHide : null
    };
    
    //创建一个Panel控件
    $.fn.CreatePanel = function(id,opts,htmlOrObj,isShow){
        //获取参数
        var tempOpts = $.extend({}, opts, {});
        opts = $.extend({}, $.Panel.defaults, opts || {});
        
        if(tempOpts.Width === undefined && (tempOpts.SizeType == "fit" || tempOpts.SizeType == "fitX")){
            opts.Width = 100;
        }
        if(tempOpts.Height === undefined && (tempOpts.SizeType == "fit" || tempOpts.SizeType == "fitY")){
            opts.Height = 100;
        }
        
        if(isShow === undefined)
            isShow = true;
            
        //自定义id
        var tempid = id;
        if(tempid === undefined || tempid == ""){
            var autoidnum = 0;
            while(true){
                if($("#Panel_"+autoidnum).length > 0){
                    autoidnum++;
                }
                else{
                    tempid = "Panel_"+autoidnum;
                    break;
                }
            }
        }
        
        var parent = $(this.get(0));
        if(this.get(0) == window){
            parent = $(document.body);
        }
        
        //创建Panel对象
        var HTMLHeader = "";
        var HeaderSearchStr = "";
        if(opts.IsCorner){
            if(opts.TitleDirect == "Left" || opts.TitleDirect == "Right"){
                HeaderSearchStr = "div[PanelType='StyleDiv'] > table[PanelType='TopTable'] > tbody > tr[PanelType='TopTrCenter'] > td[PanelType='TopTdCenter']";
                HTMLHeader = "<table PanelType='TopTable' class='PanelTopTable' cellpadding='0' cellspacing='0'> \
                            <tr PanelType='TopTrLeft' class='PanelTopTr'> \
                                <td PanelType='TopTdLeft' class='PanelTopTdLeft'>&nbsp;</td> \
                            </tr> \
                            <tr PanelType='TopTrCenter' class='PanelTopTr'> \
                                <td PanelType='TopTdCenter' class='PanelTopTdCenter'> \
                                    <img PanelType='HeaderPic' class='PanelHeaderPic' src='"+opts.TitlePicSrc+"' "+(opts.ShowTitlePic?"":"style='display:none;'")+" /> \
                                    <a PanelType='HeaderText' class='PanelHeaderText'>"+opts.TitleText+"</a> \
                                </td> \
                            </tr> \
                            <tr PanelType='TopTrRight' class='PanelTopTr'> \
                                <td PanelType='TopTdRight' class='PanelTopTdRight'>&nbsp;</td> \
                            </tr> \
                        </table>";
            }
            else{
                HeaderSearchStr = "div[PanelType='StyleDiv'] > table[PanelType='TopTable'] > tbody > tr[PanelType='TopTr'] > td[PanelType='TopTdCenter']";
                HTMLHeader = "<table PanelType='TopTable' class='PanelTopTable' cellpadding='0' cellspacing='0'> \
                            <tr PanelType='TopTr' class='PanelTopTr'> \
                                <td PanelType='TopTdLeft' class='PanelTopTdLeft'>&nbsp;</td> \
                                <td PanelType='TopTdCenter' class='PanelTopTdCenter'> \
                                    <img PanelType='HeaderPic' class='PanelHeaderPic' src='"+opts.TitlePicSrc+"' "+(opts.ShowTitlePic?"":"style='display:none;'")+" /> \
                                    <a PanelType='HeaderText' class='PanelHeaderText'>"+opts.TitleText+"</a> \
                                </td> \
                                <td PanelType='TopTdRight' class='PanelTopTdRight'>&nbsp;</td> \
                            </tr> \
                        </table>";
            }
        }
        else{
            HeaderSearchStr = "div[PanelType='StyleDiv'] > div[PanelType='Header']";
            HTMLHeader = "<DIV PanelType='Header' class='PanelHeader'> \
                        <img PanelType='HeaderPic' class='PanelHeaderPic' src='"+opts.TitlePicSrc+"' "+(opts.ShowTitlePic?"":"style='display:none;'")+" /> \
                        <a PanelType='HeaderText' class='PanelHeaderText'>"+opts.TitleText+"</a> \
                    </DIV>";
        }
        
        if(htmlOrObj === undefined){
            htmlOrObj = "";
        }
        
        var HTMLBody = "<div PanelType='ScrollDiv' class='PanelScrollDiv'> \
                        <DIV PanelType='Body' class='PanelBody'>" 
                        + (typeof(htmlOrObj) == "string" ? htmlOrObj:"")
                        + "</DIV> \
                    </div>";
                    
        var Html = "<DIV id='"+tempid+"' selftype='Panel' class='"+opts.CssBefore+"_MainDiv'> \
                             <DIV PanelType='StyleDiv' class='PanelStyleDiv"+(opts.ShowScrollBar?"":" PanelNoScroll")+(opts.TitleDirect=="Up"?"":(opts.TitleDirect=="Down"?" PanelBottom":(opts.TitleDirect=="Left"?" PanelLeft":(opts.TitleDirect=="Right"?" PanelRight":""))))+"'>";
                             
        if(opts.TitleDirect == "Down" || opts.TitleDirect == "Right"){
            Html += HTMLBody + HTMLHeader;
        }
        else{
            Html += HTMLHeader + HTMLBody;
        }
        
        Html += "</DIV> \
               </DIV>";
                    
        parent.append(Html);
        if(typeof(htmlOrObj) != "string"){
            //移动对象到内容窗口中
            $(htmlOrObj).appendTo("#"+tempid + " > div[PanelType='StyleDiv'] > div[PanelType='ScrollDiv'] > div[PanelType='Body']");
        }
        
         //获得Panel对象
         var PanelObj = parent.children("#"+tempid);
         var PanelBody = PanelObj.find("div[PanelType='StyleDiv'] > div[PanelType='ScrollDiv'] > div[PanelType='Body']");
         var PanelTitleBar = PanelObj.find(HeaderSearchStr);
         
         //执行OnLoading函数
         if(opts.OnLoading != null){
            try{
                opts.OnLoading(PanelObj,PanelBody,PanelTitleBar,opts);
            }catch(e){;}
         }
         
         //绑定参数
         PanelObj.data("PanelOpts",opts);
         PanelObj.data("PanelBody",PanelBody);
         PanelObj.data("PanelTitleBar",PanelTitleBar);
         
         //设置Panel的大小
         SetPanelSize(PanelObj,opts,opts.Width,opts.Height);
         
         //设置Panel的位置
         SetPanelPos(PanelObj,opts);
         
         //绑定改变大小的事件
         if(((opts.SizeType == "fit" || opts.SizeType == "fitX") && opts.Width != -1) || ((opts.SizeType == "fit" || opts.SizeType == "fitY") && opts.Height != -1)){
            //标记对象
            PanelObj.attr("PanelFitSize","true");
            //有百分比高宽的情况，当父节点改变时改变大小
            var parentObj = $(PanelObj.get(0).parentNode);
            if(parentObj.attr("HasBindPanelResizeFun") === undefined){
                parentObj.attr("HasBindPanelResizeFun","true");
                if(parentObj.get(0) == document.body)
                    parentObj = $(window);
                parentObj.bind("resize",$.PanelParentResizeFun);
            }
         }
         
         //是否显示Panel
         if(!isShow){
            PanelObj.css("display","none");
         }
         
         //返回窗口对象
         return PanelObj;
    };
    
    //设置Panel大小
    $.fn.SetPanelSize = function(Width,Height){
        for(var i = 0;i<this.length;i++){
            var PanelObj = $(this.get(i));
            var opts = PanelObj.data("PanelOpts");
            if(opts === undefined){
                continue;
            }

           if(PanelObj.css("display") == "none"){
                //隐藏窗口的情况
                var style = PanelObj.attr("style");
                PanelObj.css({left:"-100000px",top:"-100000px",display:"block"});
                 //修改大小
                SetPanelSize(PanelObj,opts,Width,Height);
                //恢复原来的状态
                PanelObj.attr("style",style);
            }
            else{
                //修改大小
                SetPanelSize(PanelObj,opts,Width,Height);
            }
        }
    };
    
    //关闭Panel
    $.fn.ClosePanel = function(){
        //循环处理所有对象
        for(var i = 0;i<this.length;i++){
            var PanelObj = $(this.get(i));
            var opts = PanelObj.data("PanelOpts");
            
            //执行OnClose函数
            var ret = true;
            if(opts.OnClose  != null){
                try{
                    ret = opts.OnClose(PanelObj,PanelObj.data("PanelBody"));
                }catch(e){;}
            }
            
            if(!ret){
                //函数不执行
                continue;
            }
            
            //删除窗口对象
            PanelObj.remove();
        }
    };
    
    //隐藏Panel
    $.fn.HidePanel = function(){
        for(var i = 0;i<this.length;i++){
            var PanelObj = $(this.get(i));
            var opts = PanelObj.data("PanelOpts");
            
            if(PanelObj.css("display") != "none"){
                //执行OnHide
                if(opts.OnHide != null){
                    try{
                        opts.OnHide(PanelObj,PanelObj.data("PanelBody"),PanelObj.data("PanelTitleBar"));
                    }catch(e){;}
                }
                
                //隐藏窗口
                PanelObj.css("display","none");
            }
        }
    };
    
    //显示窗口
    $.fn.ShowPanel = function(posX,posY){
        for(var i = 0;i<this.length;i++){
            var PanelObj = $(this.get(i));
            var opts = PanelObj.data("PanelOpts");
            var isShow = false;
            
            if(PanelObj.css("display") == "none"){
                //显示窗口
                PanelObj.css("display","block");
                isShow = true;
            }
            
            //修改位置
            if(posX !== undefined && posX != null){
                PanelObj.css("left",posX + "px");
            }
            if(posY !== undefined && posY != null){
                PanelObj.css("top",posY + "px");
            }
            
            if(isShow){
                //执行OnShow
                if(opts.OnShow != null){
                    try{
                        var js = "opts.OnShow(PanelObj,PanelObj.data(\"PanelBody\"),PanelObj.data(\"PanelTitleBar\")";
                        if(arguments.length > 2){
                            for(var i = 2;i<arguments.length;i++){
                                js += ",arguments["+i+"]";
                            }
                        }
                        js += ");"
                        eval(js);
                    }catch(e){;}
                }
            }  
            
        }
    };
    
    //添加自定义按钮
    $.fn.PanelAddSelfButton = function(id,para,stylePara,opts){
        for(var i = 0;i<this.length;i++){
            var PanelObj = $(this.get(i));
            PanelObj.data("PanelTitleBar").CreateToolButton(id,para,stylePara,opts);
        }
    };
    
    //收起/展开内容栏位
    $.fn.ExpandPanel = function(isExpand){
        for(var i = 0;i<this.length;i++){
            var PanelObj = $(this.get(i));
            opts = PanelObj.data("PanelOpts");
            if(opts.ExpandSpeed == -1){
                //不处理动画
            }
            else{
                //通过动画设置
            }
        }
    };
    
    
    //以下为内部函数
    //修改Panel大小的总入口函数
    function SetPanelSize(obj,opts,width,height){        
        switch(opts.SizeType){
            case "fixed":
                //固定大小
                SetPanelFixedWidth(obj,opts,width);
                SetPanelFixedHeight(obj,opts,height);
                break;
            case "fitX":
                SetPanelFixedHeight(obj,opts,height);
                SetPanelFitWidth(obj,opts);
                break;
            case "fitY":
                SetPanelFixedWidth(obj,opts,width);
                SetPanelFitHeight(obj,opts);
                break;
            case "fit":
                SetPanelFitWidth(obj,opts);
                SetPanelFitHeight(obj,opts);
                break;
            default :
                return;
        } 
         
        //改变内部对象的大小
        SetPanelSubObjSize(obj);
    };
    
    //设置对象的fixed的宽度
    function SetPanelFixedWidth(obj,opts,width){
        if(width === undefined || width == null)
            return;
        if(width < opts.MinWidth)
            width = opts.MinWidth;
        obj.width(width);
    };
    
    //设置对象的fixed的高度
    function SetPanelFixedHeight(obj,opts,height){
        if(height === undefined || height == null)
            return;
        if(height < opts.MinHeight)
            height = opts.MinHeight;
        obj.height(height);
    };
    
    //设置对象的fit的宽度
    function SetPanelFitWidth(obj,opts){
        if(opts.Width == -1){
            //根据内容宽度设置宽度
            var PanelTitleBar = obj.data("PanelTitleBar");
            var PanelBody = obj.data("PanelBody");
            var PanelScrollDiv = $(PanelBody.get(0).parentNode);
            
            var Width = PanelBody.scrollWidth() + (PanelScrollDiv.outerWidth(true) - PanelScrollDiv.innerWidth(true));
            if(opts.TitleDirect == "Left" || opts.TitleDirect == "Right"){
                Width += PanelTitleBar.outerWidth(true);
            }
            
            if(Width < opts.MinWidth)
                Width = opts.MinWidth;
            obj.width(Width);
        }
        else{
            //百分比的情况,先恢复百分比
            obj.css("width",opts.Width + "%");
            var Width = obj.innerWidth(true);
            if(Width < opts.MinWidth)
                obj.width(opts.MinWidth);
        }
    };
    
    //设置对象的fit的高度
    function SetPanelFitHeight(obj,opts){
        if(opts.Height == -1){
            //根据内容宽度设置高度
            var PanelTitleBar = obj.data("PanelTitleBar");
            var PanelBody = obj.data("PanelBody");
            var PanelScrollDiv = $(PanelBody.get(0).parentNode);
            
            var Height = PanelBody.scrollHeight() + (PanelScrollDiv.outerHeight(true) - PanelScrollDiv.innerHeight(true));
            if(opts.TitleDirect != "Left" && opts.TitleDirect != "Right"){
                Height += PanelTitleBar.outerHeight(true);
            }
            
            if(Height < opts.MinHeight)
                Height = opts.MinHeight;
            obj.height(Height);
        }
        else{
            //百分比的情况,根据父节点的高度处理
            var parentHeight = $(obj.get(0).parentNode).innerHeight(true);
            var Height = parseInt(parentHeight * opts.Height/100);
            if(Height < opts.MinHeight)
                Height = opts.MinHeight;
            obj.height(Height);
        }
    };
    
    //根据Panel大小设置内部对象的大小
    function SetPanelSubObjSize(obj){
        var opts = obj.data("PanelOpts");
        var Width = obj.innerWidth(true);
        var Height = obj.innerHeight(true);
        var PanelTitleBar = obj.data("PanelTitleBar");
        var PanelBody = obj.data("PanelBody");
        var PanelScrollDiv = $(PanelBody.get(0).parentNode);
        
        switch(opts.TitleDirect){
            case "Left":
            case "Right":
                PanelTitleBar.height(100);
                if(opts.IsCorner)
                    PanelTitleBar.height(Height - ($(PanelTitleBar.get(0).parentNode.parentNode.parentNode).outerHeight(true) - 100));
                else
                    PanelTitleBar.height(Height - (PanelTitleBar.outerHeight(true) - 100));
                PanelBody.height(100);
                PanelBody.height(Height - (PanelScrollDiv.outerHeight(true) -100));
                PanelBody.width(100);
                PanelBody.width(Width - PanelTitleBar.outerWidth(true) - (PanelScrollDiv.outerWidth(true) - 100) - 1);
                break;
            default:
                //Up/Down的情况，宽度无需处理，只需处理高度
                PanelBody.height(100);
                PanelBody.height(Height - PanelTitleBar.outerHeight(true) - (PanelScrollDiv.outerHeight(true) - 100));
                break;
        }
    };
    
    //设置Panel的位置
    function SetPanelPos(obj,opts){
        obj.css({position:opts.CssPosition,left:opts.Left+"px",top:opts.Top + "px"});
        if(opts.CssPosition == "absolute" && opts.StartPosition == "center"){
            //启动时设置在窗口中间
            var parentObj = $(obj.get(0).parentNode);
            if(parentObj.get(0) == document.body){
                obj.SetPosition("center:center");
            }
            else{
                //要另外计算中间位置
                var Left = parseInt((parentObj.innerWidth(true) - obj.outerWidth(true))/2);
                var Top = parseInt((parentObj.innerHeight(true) - obj.outerHeight(true))/2);
                obj.css({left:Left+"px",top:Top+"px"});
            }
        }
    };
    
    //父节点改变大小时绑定的重设对象大小的函数
    $.PanelParentResizeFun = function(){
        var ParentObj = $(this);
        if(this == window)
            ParentObj = $(document.body);
        var PanelObjs = ParentObj.children("div[PanelFitSize='true']");
        for(var i = 0;i<PanelObjs.length;i++){
            var obj = $(PanelObjs.get(i));
            setTimeout("$('#"+obj.attr("id")+"').SetPanelSize();",10);
            //SetPanelSize(obj,obj.data("PanelOpts"));
        }
    };

})(jQuery);