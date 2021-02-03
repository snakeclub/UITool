/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：Window
说明：窗口控件
文件：Window.js
依赖文件：jquery-1.6.4.min.js
          CornerShadow.js
          Button.js
          ui-core/ToolFunction.js
          ui-core/DragControl.js
          ui-core/ResizeControl.js
          ui-core/blockUI.js
          ui-core/PositionControl.js
          ui-core/FloatControl.js
          
          
          
资源文件：WindowCss/Window.css
          
          
-----------------------*/
;(function($) {
    //窗口层级的管理控制
    
    //同一父对象下的窗口的z-index范围（每个窗口占用3个：窗口本身、阴影和遮罩）
    $.WindowCtlMinZIndex = 9000;
    $.WindowCtlMaxZIndex = 10000;
    
    //重整数组顺序的调用函数
    $.WindowCtlArraySortFun = function(a,b){
        return parseInt(a.css("z-index")) - parseInt(b.css("z-index"));
    };
    
    //在某个对象上创建窗口层级控制
    $.fn.CreateWindowCtl = function(MinZIndex,MaxZIndex,SupportMsgBoxNum){
        //设置z-index参数
        if(MinZIndex === undefined)
            MinZIndex = $.WindowCtlMinZIndex;
        if(MaxZIndex === undefined)
            MaxZIndex = $.WindowCtlMaxZIndex;
        if(SupportMsgBoxNum === undefined)
            SupportMsgBoxNum = 30;
        
        //循环处理所有对象
        for(var i = 0;i<this.length;i++){
            var parentObj = $(this.get(i));
            if(this.get(i) == window || this.get(i) == document){
                parentObj = $(document.body);
            }
            
            //如果已经创建了，则不处理
            if(parentObj.data("WindowCtlPara") !== undefined){
                continue;
            }
            
            //控制变量
            var WindowCtlPara = new Object();
            WindowCtlPara.MinZIndex = MinZIndex;
            WindowCtlPara.MaxZIndex = MaxZIndex - SupportMsgBoxNum*3 - 1;  //预留支持的MsgBox窗口的层级
            WindowCtlPara.NormalCurrentZIndex = MinZIndex;  //本对象当前的最大zindex
            WindowCtlPara.MsgBoxCurrentZindex = MaxZIndex - SupportMsgBoxNum*3; //弹出窗口的当前zindex
            WindowCtlPara.NormalWinList = new Array();    //一般窗口的队列
            WindowCtlPara.MsgBoxList = new Array();   //弹出窗口的队列
            
            //存入对象中
            parentObj.data("WindowCtlPara",WindowCtlPara);
        }
    };
    
    //在父对象中获得下一个z-index（Normal窗口才用到的）
    $.fn.WindowCtlGetIndex = function(){
        var parentObj = $(this.get(0));
        if(this.get(0) == window || this.get(0) == document){
            parentObj = $(document.body);
        }
        var WindowCtlPara = parentObj.data("WindowCtlPara");
        var cnum = WindowCtlPara.NormalCurrentZIndex + 3;
        if(cnum > WindowCtlPara.MaxZIndex){
            //重整数组
            parentObj.WindowCtlReSortList();
            WindowCtlPara = parentObj.data("WindowCtlPara");
            
            //重新获取一次z-index
            cnum =WindowCtlPara.NormalCurrentZIndex + 3;
        }
        WindowCtlPara.NormalCurrentZIndex = cnum;
        //存入对象中
        parentObj.data("WindowCtlPara",WindowCtlPara);
        
        return cnum;
    };
    
    //重整窗口对象清单排序，以及重设z-index（Normal窗口才用到的）
    $.fn.WindowCtlReSortList = function(){
        //循环处理所有对象
        for(var i = 0;i<this.length;i++){
            var parentObj = $(this.get(i));
            if(this.get(i) == window || this.get(i) == document){
                parentObj = $(document.body);
            }
            var WindowCtlPara = parentObj.data("WindowCtlPara");
            
            //数组重排序
            WindowCtlPara.NormalWinList.sort($.WindowCtlArraySortFun);
            WindowCtlPara.NormalCurrentZIndex = WindowCtlPara.MinZIndex;
            for(var j = 0;j<WindowCtlPara.NormalWinList.length;j++){
                WindowCtlPara.NormalCurrentZIndex += 3;
                WindowCtlPara.NormalWinList[j].css("z-index",WindowCtlPara.NormalCurrentZIndex);
                //处理阴影
                var ShadowID = WindowCtlPara.NormalWinList[j].attr("CornerShadowID");
                if(ShadowID !== undefined)
                    $("#"+ShadowID).css("z-index",WindowCtlPara.NormalCurrentZIndex - 1);
            }
            
            //存入对象中
            parentObj.data("WindowCtlPara",WindowCtlPara);
        }
    };
    
    //新增窗口后需调用的函数（Normal窗口才用到的）
    $.fn.WindowCtlAdd = function(){
        //循环处理所有对象
        for(var i = 0;i<this.length;i++){
            var WinObj = $(this.get(i));
            var parentObj = $(WinObj.get(0).parentNode);
            //获得最高的index
            var index = parentObj.WindowCtlGetIndex();
            
            var WindowCtlPara = parentObj.data("WindowCtlPara");
            
            //将窗口对象加入到队列中
            WindowCtlPara.NormalWinList.push(WinObj);
            
            //存回对象中
            parentObj.data("WindowCtlPara",WindowCtlPara);
            
            //设置对象的z-index
            WinObj.css("z-index",index);
            var ShadowID = WinObj.attr("CornerShadowID");
            if(ShadowID !== undefined)
                $("#"+ShadowID).css("z-index",index - 1);
        }
    };
    
    //删除窗口前需要调用的函数（Normal窗口才用到的）
    $.fn.WindowCtlDel = function(){
        //循环处理所有对象
        for(var i = 0;i<this.length;i++){
            var WinObj = $(this.get(i));
            var parentObj = $(WinObj.get(0).parentNode);
            
            var WindowCtlPara = parentObj.data("WindowCtlPara");
            for(var j = 0;j<WindowCtlPara.NormalWinList.length;j++){
               if(WinObj.get(0) == WindowCtlPara.NormalWinList[j].get(0)){
                    //从数组中删除
                    WindowCtlPara.NormalWinList.splice(i,1);
                    continue;
               }
            }
            
            //存回对象中
            parentObj.data("WindowCtlPara",WindowCtlPara);
        }
    };
    
    //将窗口设置到最前面
    $.fn.WindowToFront = function(){
        //循环处理所有对象
        for(var i = 0;i<this.length;i++){
            var WinObj = $(this.get(i));
            var parentObj = $(WinObj.get(0).parentNode);
            var WindowCtlPara = parentObj.data("WindowCtlPara");
            
            //判断是否已经是最前面了
            if(parseInt(WinObj.css("z-index")) >= WindowCtlPara.NormalCurrentZIndex){
                //已经时是前面了
                continue;
            }
            
            //获得最高的index
            var index = parentObj.WindowCtlGetIndex();
            
            //设置zindex
            WinObj.css("z-index",index);
            var ShadowID = WinObj.attr("CornerShadowID");
            if(ShadowID !== undefined)
                $("#"+ShadowID).css("z-index",index - 1);
        }
    };
    
    
    //下面才是真正的窗口创建和处理的代码
    
    //默认创建参数
    $.Window = new Object();
    $.Window.defaults = {
        //样式前缀
        CssBefore : "Window",
        
        //是否对话窗口－显示时其他内容不能操作
        IsMsgBox : false,
        
        //是否定制的消息窗口 - 若是，则添加WindowDialog样式
        IsDefMsgBox : false,
        
        //是否内容栏位颜色是否素色
        IsPlain : false,
        
        //是否显示阴影
        HasShadow : true,
        
        //窗口标题文字
        TitleText : "Window",
        
        //是否显示标题图片
        ShowTitlePic : false,
        
        //标题图片src
        TitlePicSrc : "",
        
        //是否显示状态栏
        ShowStatusBar : false,
        
        //是否显示内容滚动条
        ShowScrollBar : true,
        
        //是否可拖动
        DragAble : true,
        
        //是否显示关闭按钮
        ShowCloseButton : true,
        
        //是否可最大化
        MaxSizeAble : true,
        
        //是否可最小化
        MinSizeAble : true,
        
        
        //窗口大小类型,fixed - 固定设置大小，fit － 根据内容大小自适应（内容div不出现滚动条），fitX - 横向自适应，fitY - 纵向自适应
        SizeType : "fixed",
        
        //是否可改变大小，如果窗口大小类型为fit，则不允许改变大小，fitX不允许改变宽度，fitY不允许改变高度
        ResizeAble : true,
        
        //初始窗口宽度,px，对于fit类型无效
        Width : 300,
        
        //初始窗口高度,px，对于fit类型无效
        Height : 200,
        
        //最小宽度，px
        MinWidth : 130,
        
        //最小高度，px
        MinHeight : 75,
        
        //最大宽度，-1代表无限制
        MaxWidth : -1,
        
        //最大高度，-1代表无限制
        MaxHeight : -1,
               
        //窗口初始位置类型,center - 居中，letftop － 相对左上角
        StartPosition : "center",
        
        //窗口初始位置，px，对于center类型无效
        Left : 10,
        
        //窗口初始位置，px，对于center类型无效
        Top : 10,
        
        
        //窗口事件
        //启动（创建）窗口时执行的函数，传入参数依次为窗口对象、窗口的内容容器对象、窗口的创建参数
        OnLoading : null,
        
        //关闭窗口前时执行的函数，传入参数依次为窗口对象、窗口的内容容器对象，如果想禁止窗口关闭，则需返回false
        OnClose : null,
        
        //显示窗口时执行的函数，传入参数依次为窗口对象、窗口的内容容器对象，传入的显示参数
        OnShow : null,
        
        //隐藏窗口时执行的函数，传入参数依次为窗口对象、窗口的内容容器对象
        OnHide : null,
        
        //改变窗口大小时执行的函数，传入的参数依次为窗口对象、窗口的内容容器对象、窗口大小{width,height}、容器大小{width,height}
        OnResize : null,
        
        //结束拖动时执行的函数，传入的参数依次为窗口对象、窗口的内容容器对象、窗口位置{left,top}
        AfterDrag : null,
        
        //点击窗口最小化按钮时执行的函数（该按钮的默认功能是隐藏窗口），传入参数依次为窗口对象、窗口的内容容器对象，如果想禁止原动作，则需返回false
        OnMinSizeClick : null,
        
        //点击窗口最大化/恢复窗口按钮时执行的函数，传入参数依次为窗口对象、窗口的内容容器对象、是否最大化(true-false)，如果想禁止原动作，则需返回false
        OnMaxSizeClick : null,
        
        //点击窗口关闭按钮时执行的函数，传入参数依次为窗口对象、窗口的内容容器对象，如果想禁止原动作，则需返回false
        OnCloseClick : null,
        
        //双击标题栏时执行的函数，传入参数依次为窗口对象、窗口的内容容器对象，如果想禁止原动作，则需返回false
        OnTitleDbClick : null,
        
        //显示对话窗口时的遮罩参数
        blockUIPara : {
            backgroundColor: '#777',
			opacity:	  	 0.3,
			cursor:		  	 'default'
        },
        
        //显示阴影时圆角阴影的创建参数
        CornerShadowPara : {
             //样式前缀
            CssBefore : "CornerShadow",
        
            //阴影颜色，默认为#777，仅IE浏览器有效
            Color : "#777",
            
            //圆角大小，仅IE浏览器有效
            CornerSize : 4,
            
            //强制设置为图片阴影的模式
            ForcePicShadow : false,
            
            //自动随对象大小改变阴影大小
            AutoSizeChange : false,
            
            //光源X,Y方向的偏移（单位为象素），负数代表向左上偏移，阴影在右下方；正数代表向右下偏移，阴影在左上边。默认为-5
            Offset : {X:0,Y:0},
            
            //X,Y方向的阴影扩展，用于控制阴影的宽高度，例如1代表阴影宽高度比对象大小大1，默认为0
            Extend : {X:10,Y:10},
            
            //添加阴影后执行的事件,传入的参数依次为要要添加阴影的对象，阴影对象
            AfterAddShadow : null,
            
            //清除阴影前执行的事件,传入的参数依次为要要添加阴影的对象，阴影对象
            BeforeClearShadow : null
        },
        
        //改变对象大小控件的参数
        ResizeControlPara : {
            //是否显示右下角的改变大小的工具块
            showConnerTool : true,
            
            //改变大小的方式，div - 用一虚线的div框来显示最终的大小，obj - 直接对对象改变大小
            resizeType : "div",
            
            //div框的样式
            divStyle : {
                "z-index" : 20000,
                border : "1px dashed #0099FF"
            },
            
            //允许改变大小的方向
            direction : {left:true,top:true,right:true,bottom:true},
            
            //改变大小的限制,-1代表无限制
            limit : {maxWidth:-1,maxHeight:-1,minWidth:-1,minHeight:-1},
            
            //Resize工具的z-index，-1默认为对象z-index+10,其他数值为指定z-index
            zIndex : -1,
            
            //改变大小框的位置，inner-紧贴对象内部，outer-紧贴对象外部，默认为inner
            position : "inner",
            
            //边框大小，默认为3
            borderWidth: 3,
            
            //边框的颜色，如果是inner的情况，对象又有边框，就必须设置颜色才能正常使用改变大小控件。例如"#ff0000"，""代表透明色，默认为""
            borderColor : "",
            
            //边角处宽度,默认为14
            connerWidth : 14,
            
            //右下角的改变大小的工具块的Css样式名，例如"SizeControlConnerClass"，默认为""
            connerClass : "",
            
            //开始改变大小前执行的函数，传入的参数依次为对象本身、改变大小参数、event（mousedown），必须返回true/false，若返回false，则终止改变大小操作
            beginResizeFun : null,
            
            //拖动改变大小过程中执行的函数，传入的参数依次为对象本身、改变大小参数、event（mousemove）、objpos{left,top}、objsize{width,height}，必须返回true/false，若返回false，则不调整对象大小
            resizeMoveFun : null,
            
            //确认是否改变大小的函数，传入的参数依次为对象本身、改变大小参数、event（mousemove）、objpos{left,top}、objsize{width,height}，必须返回true/false，若返回false，则不调整对象大小
            confirmResizeFun : null,
            
            //结束改变大小后执行的函数，传入的参数依次为confirmResizeFun返回结果、对象本身、改变大小参数、event（mouseup）、objpos{left,top}、objsize{width,height}
            endResizeFun : null
        },
        
        //IE6防崩溃代码，启动后性能较差，用于防止由于存在滚动条而导致的浏览器崩溃情况
        IE6Defense : true
    };
    
    //消息窗口的创建参数
    $.WindowDialog = new Object();
    $.WindowDialog.defaults = {
        //消息窗口的类型
        //Alert - 警告框
        //Confirm - 确认框
        //Prompt - 输入框
        //MultilinePrompt - 多行的内容输入框
        //YesNoCancel - 3个按钮的确认框
        DialogType : "Alert",
        
        //标题内容
        TitleText : "",
        
        //消息内容
        Message : "",
        
        //默认的输入内容
        PromptText : "",
        
        //多行的内容输入框的行数
        PromptRows : 5,
              
        //窗口宽度，填像素值，若不控制则填null
        Width : 300,
        
        //窗口高度，填像素值，若不控制则填null
        Height : null,
        
        //是否显示标题图标
        ShowTitlePic : false,
        
        //是否显示内容图片
        ShowMessagePic : false,
        
        //图片类型
        //Error - 错误
        //Info - 消息
        //Question - 提问
        //Warning - 警告
        //SelfDef - 自定义
        PicType : "Error",
        
        //图片的路径
        PicPath : "",
        
        //自定义图片类型时标题图标src
        TitlePicSrc : "",
        
        //自定义图片类型时内容图片src
        MessagePicSrc : "",
        
        //按钮宽度
        BtnWidth : 50,
        
        //按钮之间的间距
        BtnMargin : 10,
        
        //Yes按钮的文字，填空的话会根据消息窗口的类型赋值
        YesBtnText : "",
        
        //No按钮的文字，填空的话会根据消息窗口的类型赋值
        NoBtnText : "",
        
        //Cancel按钮的文字，填空的话会根据消息窗口的类型赋值
        CancelBtnText : "",
        
        //窗口关闭的回调函数，若函数返回false，则终止对窗口的关闭
        //根据不同的窗口类型传入不同的参数
        //Alert传入CallBackPara
        //Confirm、YesNoCancel传入CallBackPara、点击的按钮类型-Yes/No/Cancel
        //Prompt、MultilinePrompt传入CallBackPara、点击的按钮类型Yes/No，填入的内容
        CallBack : null,
        
        //窗口调用参数，可传对象，用于返回到回调函数中进行窗口识别
        CallBackPara : null
    };
    
    //创建一个Window控件
    $.fn.CreateWindow = function(id,opts,htmlOrObj,isShow,isMaximize){
        //获取参数
        opts = $.extend({}, $.Window.defaults, opts || {});
        opts.blockUIPara = $.extend({}, $.Window.defaults.blockUIPara, opts.blockUIPara || {});
        opts.CornerShadowPara = $.extend({}, $.Window.defaults.CornerShadowPara, opts.CornerShadowPara || {});
        opts.CornerShadowPara.Offset = $.extend({}, $.Window.defaults.CornerShadowPara.Offset, opts.CornerShadowPara.Offset || {});
        opts.CornerShadowPara.Extend = $.extend({}, $.Window.defaults.CornerShadowPara.Extend, opts.CornerShadowPara.Extend || {});
        
        opts.ResizeControlPara = $.extend({}, $.Window.defaults.ResizeControlPara, opts.CornerShadowPara || {});
        opts.ResizeControlPara.direction = $.extend({}, $.Window.defaults.ResizeControlPara.direction, opts.ResizeControlPara.direction || {});
        opts.ResizeControlPara.limit = $.extend({}, $.Window.defaults.ResizeControlPara.limit, opts.ResizeControlPara.limit || {});
        opts.ResizeControlPara.divStyle = $.extend({}, $.Window.defaults.ResizeControlPara.divStyle, opts.ResizeControlPara.divStyle || {});
        
        if(isShow === undefined)
            isShow = true;
        
        if(isMaximize === undefined)
            isMaximize = false;
            
        //自定义id
        var tempid = id;
        if(tempid === undefined || tempid == ""){
            var autoidnum = 0;
            while(true){
                if($("#Window_"+autoidnum).length > 0){
                    autoidnum++;
                }
                else{
                    tempid = "Window_"+autoidnum;
                    break;
                }
            }
        }
        
        var parent = $(this.get(0));
        if(this.get(0) == window){
            parent = $(document.body);
        }
        
        //对父节点创建控制窗口变量
        parent.CreateWindowCtl();
        
        //创建Window对象
        var HTMLBefore = "<DIV id='"+tempid+"' selftype='Window' class='"+opts.CssBefore+"_MainDiv' style='WIDTH: "+opts.Width+"px; height:"+opts.Height+"px; TOP: "+opts.Top+"px; LEFT: "+opts.Left+"px'> \
                        <table WindowType='Table' class='WindowTable"+(opts.DragAble?" WindowMoveAble":"")+(opts.IsPlain?" WindowPlain":"")+(opts.ShowStatusBar?" WindowWithStatusBar":"")+(opts.ShowScrollBar?"":" WindowNoScroll")+(opts.IsDefMsgBox?" WindowDialog":"")+"' cellpadding='0' cellspacing='0'> \
                            <tr WindowType='TopTr' class='WindowTopTr'> \
                                <td WindowType='TopTdLeft' class='WindowTopTdLeft'>&nbsp;</td> \
                                <td WindowType='TopTdCenter' class='WindowTopTdCenter'> \
                                    <img WindowType='TitlePic' class='WindowTitlePic' src='"+opts.TitlePicSrc+"' "+(opts.ShowTitlePic?"":"style='display:none;'")+" /> \
                                    <a WindowType='TitleText' class='WindowTitleText'>"+opts.TitleText+"</a> \
                                </td> \
                                <td WindowType='TopTdRight' class='WindowTopTdRight'>&nbsp;</td> \
                            </tr> \
                            <tr WindowType='MidTr' class='WindowMidTr'> \
                                <td WindowType='MidTdLeft' class='WindowMidTdLeft'>&nbsp;</td> \
                                <td WindowType='MidTdCenter' class='WindowMidTdCenter'> \
                                    <div WindowType='Body' class='WindowBody'>";
                                    
        var HTMLAfter = "</div> \
                                </td> \
                                <td WindowType='MidTdRight' class='WindowMidTdRight'>&nbsp;</td> \
                            </tr> \
                            <tr WindowType='BtmTr' class='WindowBtmTr'> \
                                <td WindowType='BtmTdLeft' class='WindowBtmTdLeft'>&nbsp;</td> \
                                <td WindowType='BtmTdCenter' class='WindowBtmTdCenter'>&nbsp;</td> \
                                <td WindowType='BtmTdRight' class='WindowBtmTdRight'>&nbsp;</td> \
                            </tr> \
                        </table> \
                   </DIV>";

         
         //创建对象
         if(htmlOrObj === undefined){
            htmlOrObj = "";
         }
         if(typeof(htmlOrObj) == "string"){
            //用html作为内容，直接添加
            parent.append(HTMLBefore + htmlOrObj + HTMLAfter);
         }
         else{
            //通过对象作为内容
            //添加对象
            parent.append(HTMLBefore + HTMLAfter);
            
            //移动对象到内容窗口中
            $(htmlOrObj).appendTo("#"+tempid + " > table > tbody > tr[WindowType='MidTr'] > td[WindowType='MidTdCenter'] > div[WindowType='Body']");
         }
         
         //获得窗口对象
         var WindowObj = parent.children("#"+tempid);
         var WindowDiv = WindowObj.find("table > tbody > tr[WindowType='MidTr'] > td[WindowType='MidTdCenter'] > div[WindowType='Body']");
         var WindowTitleBar = WindowObj.find("table > tbody > tr[WindowType='TopTr'] > td[WindowType='TopTdCenter']");
                  
         //创建按钮
         WindowTitleBar.CreateToolButton(tempid + "_CloseButton","close;"+tempid,$.ToolButtonGetStyle("","close"),{
                //按下鼠标时执行的函数，传入的参数依次为：按钮本身对象、按钮参数、event
                OnClick : $.WindowToolButtonClick
            });
         WindowTitleBar.CreateToolButton(tempid + "_MaximizeButton","maximize;"+tempid,$.ToolButtonGetStyle("","maximize"),{
                //按下鼠标时执行的函数，传入的参数依次为：按钮本身对象、按钮参数、event
                OnClick : $.WindowToolButtonClick
            });
         WindowTitleBar.CreateToolButton(tempid + "_MinimizeButton","minimize;"+tempid,$.ToolButtonGetStyle("","minimize"),{
                //按下鼠标时执行的函数，传入的参数依次为：按钮本身对象、按钮参数、event
                OnClick : $.WindowToolButtonClick
            });
         
         //是否显示按钮
         if(!opts.ShowCloseButton){
            $("#"+tempid + "_CloseButton").css("display","none");
         }
         
         if(!opts.MaxSizeAble){
            $("#"+tempid + "_MaximizeButton").css("display","none");
         }
         
         if(!opts.MinSizeAble){
            $("#"+tempid + "_MinimizeButton").css("display","none");
         }
         
         //执行OnLoading函数
         if(opts.OnLoading != null){
            try{
                opts.OnLoading(WindowObj,WindowDiv,opts);
            }catch(e){;}
         }
         
         //IE6由于有滚动条会导致系统崩溃，因此进行特殊处理
         if(opts.IE6Defense && $.browser.msie && parseFloat($.browser.version) < 7){
            WindowObj.WindowSetObjNoScrollBar();
         }
         
         //绑定参数
         WindowObj.data("WindowOpts",opts);
         WindowDiv.attr("style","width:10px;height:10px;overflow:hidden;");
         var tempPara = new Object();
         
         var MidTdCenter = WindowObj.find("table > tbody > tr[WindowType='MidTr'] > td[WindowType='MidTdCenter']");
         
         //如果是IE6可能有问题
         var MidTdCenterBorderHeight = MidTdCenter.outerHeight(true) - 10;
                  
         tempPara.TopAndBtmHeight = WindowObj.find("table > tbody > tr[WindowType='TopTr']").outerHeight(true) + WindowObj.find("table > tbody >tr[WindowType='BtmTr']").outerHeight(true) + parseInt(WindowObj.children().css("border-top-width")) + parseInt(WindowObj.children().css("border-bottom-width")) + MidTdCenterBorderHeight;

         tempPara.LeftAndRightWidth = WindowObj.find("table > tbody > tr[WindowType='MidTr'] > td[WindowType='MidTdLeft']").outerWidth(true) + WindowObj.find("table > tbody > tr[WindowType='MidTr'] > td[WindowType='MidTdRight']").outerWidth(true);
         
         WindowDiv.removeAttr("style");
         
         WindowObj.data("WindowTempPara",tempPara);
         WindowObj.data("WindowContentDiv",WindowDiv);
         
         //设置窗口的大小
         SetWindowSize(WindowObj,opts);
         
         //设置窗口的位置
         SetWindowPos(WindowObj,opts);
         
         //是否显示阴影
         if(opts.HasShadow){
            WindowObj.CreateCornerShadow("",opts.CornerShadowPara);
         }
        
         //点击窗口后将其放置到最前面
         if(!opts.IsMsgBox){
            //将窗口加入控制
            WindowObj.WindowCtlAdd();
            
            //绑定点击窗口将其待到最前面的事件
            WindowObj.bind("mousedown",function(){$(this).WindowToFront();});
         }
         
         if(opts.MaxSizeAble){
            //双击标题栏最大化
            WindowTitleBar.bind("dblclick",$.WindowTitleDbClick);
         }
            
         //最大化窗口
         if(isMaximize && opts.MaxSizeAble){
            //最大化
            WindowMaximizeFun(WindowObj,opts);
         }
         else{
            //普通窗口，绑定事件
            if(opts.DragAble){
                //拖动控件
                WindowTitleBar.bind("mousedown",$.WindowTitleDragFun);
            }
            
            if(opts.ResizeAble && opts.SizeType != "fit"){
                //改变大小控件
                var ResizeOpts = $.extend({},opts.ResizeControlPara,{
                    //允许改变大小的方向
                    direction : {
                        left:(opts.SizeType == "fixed" || opts.SizeType == "fitY"),
                        top:(opts.SizeType == "fixed" || opts.SizeType == "fitX"),
                        right:(opts.SizeType == "fixed" || opts.SizeType == "fitY"),
                        bottom:(opts.SizeType == "fixed" || opts.SizeType == "fitX")
                      },
                    beginResizeFun:$.WindowResizeBeginFun,
                    endResizeFun:$.WindowEndResizeFun});
                ResizeOpts.limit.minWidth = opts.MinWidth;
                ResizeOpts.limit.minHeight = opts.MinHeight;
                ResizeOpts.limit.maxWidth = opts.MaxWidth;
                ResizeOpts.limit.maxHeight = opts.MaxHeight;
                
                WindowObj.data("WindowResizeOpts",ResizeOpts);
                WindowObj.SetResizeAble(ResizeOpts);
            }
            
            //设置是否最大化的状态
            WindowObj.attr("WindowMaximize","false");
         }
         
         //是否显示窗口
         if(!isShow){
            WindowObj.css("display","none");
            if(opts.HasShadow){
                WindowObj.HideCornerShadow();
            }
         }
         else{
            //要显示，判断是不是有遮罩
            if(opts.IsMsgBox){
                //显示遮罩
                WindowObj.WindowShowBlockUI();
            }
         }
         
         //IE6由于有滚动条会导致系统崩溃，因此进行特殊处理
         if(opts.IE6Defense && $.browser.msie && parseFloat($.browser.version) < 7){
            WindowObj.WindowReSetObjScrollBar();
         }
         
         //返回窗口对象
         return WindowObj;
    };
    
    //关闭窗口
    $.fn.CloseWindow = function(){
        //循环处理所有对象
        for(var i = 0;i<this.length;i++){
            var WinObj = $(this.get(i));
            var opts = WinObj.data("WindowOpts");
            
            //执行OnClose函数
            var ret = true;
            if(opts.OnClose  != null){
                try{
                    ret = opts.OnClose(WinObj,WinObj.data("WindowContentDiv"));
                }catch(e){;}
            }
            
            if(!ret){
                //函数不执行
                continue;
            }
            
            //在窗口管理中删除窗口对象
            WinObj.WindowCtlDel();
            
            //删除对象阴影
            var ShadowID = WinObj.attr("CornerShadowID");
            if(ShadowID !== undefined)
                WinObj.ClearCornerShadow();
                
            //如果窗口是消息窗口，还要隐藏遮罩
            WinObj.WindowHideBlockUI();
            
            //删除窗口对象
            WinObj.remove();
        }
    };
    
    //隐藏窗口
    $.fn.HideWindow = function(){
        for(var i = 0;i<this.length;i++){
            var WinObj = $(this.get(i));
            var opts = WinObj.data("WindowOpts");
            
            if(WinObj.css("display") != "none"){
                //执行OnHide
                if(opts.OnHide != null){
                    try{
                        opts.OnHide(WinObj,WinObj.data("WindowContentDiv"));
                    }catch(e){;}
                }
                
                //隐藏对象阴影
                var ShadowID = WinObj.attr("CornerShadowID");
                if(ShadowID !== undefined)
                    WinObj.HideCornerShadow();
                
                //如果窗口是消息窗口，还要隐藏遮罩
                WinObj.WindowHideBlockUI();
                
                //隐藏窗口
                WinObj.css("display","none");
            }
        }
    };
    
    //显示窗口
    $.fn.ShowWindow = function(posX,posY){
        for(var i = 0;i<this.length;i++){
            var WinObj = $(this.get(i));
            var opts = WinObj.data("WindowOpts");
            var isShow = false;
            
            if(WinObj.css("display") == "none"){
                //显示窗口
                WinObj.css("display","block");
                
                //如果窗口是消息窗口，还要显示遮罩
                WinObj.WindowShowBlockUI();
                
                isShow = true;
            }
            
            //修改位置
            var movePos = false;
            if((posX !== undefined && posX != null) || (posY !== undefined && posY != null)){
                SetWindowPos(WinObj,opts,posX,posY);
                movePos = true;
            }
            
            if(isShow){
                //执行OnShow
                if(opts.OnShow != null){
                    try{
                        var js = "opts.OnShow(WinObj,WinObj.data(\"WindowContentDiv\")";
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
            
            if(isShow || movePos){
                 //显示对象阴影
                var ShadowID = WinObj.attr("CornerShadowID");
                if(ShadowID !== undefined)
                    WinObj.ShowCornerShadow();
            }
        }
    };
    
    
    //设置窗口大小
    $.fn.SetWindowSize = function(Width,Height){
        for(var i = 0;i<this.length;i++){
            var WinObj = $(this.get(i));
            var opts = WinObj.data("WindowOpts");
            if(opts === undefined){
                continue;
            }
            
            if(WinObj.attr("WindowMaximize") == "true"){
                //最大化的情况
                var tempPara = WinObj.data("WindowTempPara");
                tempPara.LastWidth = Width;
                tempPara.LastHeight = Height;
                WinObj.data("WindowTempPara",tempPara);
            }
            else if(WinObj.css("display") == "none"){
                //隐藏窗口的情况
                var style = WinObj.attr("style");
                WinObj.css({left:"-100000px",top:"-100000px",display:"block"});
                 //修改大小
                SetWindowSize(WinObj,opts,Width,Height,false);
                //恢复原来的状态
                WinObj.attr("style",style);
            }
            else{
                //修改大小
                SetWindowSize(WinObj,opts,Width,Height,false);
            }
        }
    };
    
    //添加自定义按钮
    $.fn.WindowAddSelfButton = function(id,para,stylePara,opts){
        for(var i = 0;i<this.length;i++){
            var WinObj = $(this.get(i));
            WinObj.find("table > tbody > tr[WindowType='TopTr'] > td[WindowType='TopTdCenter']").CreateToolButton(id,para,stylePara,opts);
        }
    };
    
    //创建消息窗口
    $.fn.CreateWindowDialog = function(id,opts,winopts){
        //获取创建窗口的参数
        winopts = $.extend({}, $.Window.defaults, winopts || {});
        winopts.blockUIPara = $.extend({}, $.Window.defaults.blockUIPara, winopts.blockUIPara || {});
        winopts.CornerShadowPara = $.extend({}, $.Window.defaults.CornerShadowPara, winopts.CornerShadowPara || {});
        winopts.CornerShadowPara.Offset = $.extend({}, $.Window.defaults.CornerShadowPara.Offset, winopts.CornerShadowPara.Offset || {});
        winopts.CornerShadowPara.Extend = $.extend({}, $.Window.defaults.CornerShadowPara.Extend, winopts.CornerShadowPara.Extend || {});
        
        winopts.ResizeControlPara = $.extend({}, $.Window.defaults.ResizeControlPara, winopts.CornerShadowPara || {});
        winopts.ResizeControlPara.direction = $.extend({}, $.Window.defaults.ResizeControlPara.direction, winopts.ResizeControlPara.direction || {});
        winopts.ResizeControlPara.limit = $.extend({}, $.Window.defaults.ResizeControlPara.limit, winopts.ResizeControlPara.limit || {});
        winopts.ResizeControlPara.divStyle = $.extend({}, $.Window.defaults.ResizeControlPara.divStyle, winopts.ResizeControlPara.divStyle || {});
        //获得消息窗口的创建参数
        opts = $.extend({}, $.WindowDialog.defaults, opts || {});
        
        //根据参数设置窗口的创建参数
        winopts.IsMsgBox = true;
        winopts.IsDefMsgBox = true;
        winopts.IsPlain = false;
        winopts.TitleText = opts.TitleText;
        winopts.ShowTitlePic = opts.ShowTitlePic;
        winopts.ShowStatusBar = true;
        winopts.ShowScrollBar = true;
        winopts.ShowCloseButton = true;
        winopts.MaxSizeAble = false;
        winopts.MinSizeAble = false;
        winopts.ResizeAble = false;
        if(opts.Width == null && opts.Height == null){
            winopts.SizeType = "fit";
        }
        else if(opts.Width == null){
            winopts.SizeType = "fitX";
            winopts.Height = opts.Height;
        }
        else if(opts.Height == null){
            winopts.SizeType = "fitY";
            winopts.Width = opts.Width;
        }
        else{
            winopts.SizeType = "fixed";
            winopts.Width = opts.Width;
            winopts.Height = opts.Height;
        }
        
        winopts.OnCloseClick = $.WindowDialogCloseClickFun;
        
        //根据参数获取图片src的值
        var PicSrc = "";
        var TitlePicSrc = "";
        if(opts.ShowMessagePic || opts.ShowTitlePic){
            if(opts.PicPath != "")
                opts.PicPath = opts.PicPath.replace(/(\/){1,}$/g,"") + "/";
            switch(opts.PicType){
                case "Error":
                    PicSrc = opts.PicPath + "icon-error.gif";
                    TitlePicSrc = PicSrc;
                    break;
                case "Info":
                    PicSrc = opts.PicPath + "icon-info.gif";
                    TitlePicSrc = PicSrc;
                    break;
                case "Question":
                    PicSrc = opts.PicPath + "icon-question.gif";
                    TitlePicSrc = PicSrc;
                    break;
                case "Warning":
                    PicSrc = opts.PicPath + "icon-warning.gif";
                    TitlePicSrc = PicSrc;
                    break;
                case "SelfDef":
                    PicSrc = opts.PicPath + opts.TitlePicSrc;
                    TitlePicSrc = opts.PicPath + opts.MessagePicSrc;
                    break;
                default :
                    PicSrc = "";
                    TitlePicSrc = "";
                    break;
            }
        }
        
        if(opts.ShowTitlePic){
            winopts.TitlePicSrc = TitlePicSrc;
        }

        //生成窗口内部的显示html
        var Html = "<div WindowType='DialogDiv' class='WindowDialogDiv'>  \
                        <img WindowType='DialogPic' class='WindowDialogPic' src='"+PicSrc+"' style='display:"+(opts.ShowMessagePic?"block":"none")+";' />  \
                        <div WindowType='DialogText' class='WindowDialogText'>"+opts.Message+"</div>  \
                        <input type=text WindowType='DialogPrompt' class='WindowDialogPrompt' value='"+opts.PromptText+"' style='display:"+(opts.DialogType=="Prompt"?"":"none")+";' />  \
                        <textarea WindowType='DialogMultilinePrompt' class='WindowDialogMultilinePrompt' rows='"+opts.PromptRows+"'  style='display:"+(opts.DialogType=="MultilinePrompt"?"":"none")+";"+(($.browser.msie && parseFloat($.browser.version) < 7)?" width:90%; overflow:hidden;":"")+"' >"+opts.PromptText+"</textarea> \
                    </div>";
                    
        
        //创建窗口
        var WinObj = this.CreateWindow(id,winopts,Html,true,false);
        
        //保存消息窗口的创建参数
        WinObj.data("WindowDialogOpts",opts);
        
        //添加处理按钮
        var StatusBarDiv = WinObj.find("table > tbody > tr[WindowType='BtmTr'] > td[WindowType='BtmTdCenter']");
        
        //按钮文字
        if(opts.YesBtnText == "" && opts.DialogType == "YesNoCancel"){
            opts.YesBtnText = "是";
        }
        else{
            opts.YesBtnText = "确定";
        }
        
        if(opts.NoBtnText == "" && opts.DialogType == "YesNoCancel"){
            opts.NoBtnText = "否";
        }
        else{
            opts.NoBtnText = "取消";
        }
        
        if(opts.CancelBtnText == ""){
            opts.CancelBtnText = "取消";
        }
        
        //删除掉原来的空格内容
        StatusBarDiv.empty();
        StatusBarDiv.append("<div WindowType='DialogBtnDiv' class='DialogBtnDiv'></div>");
        StatusBarDiv = StatusBarDiv.children();
        
        var DialogBtnDivWidth = 0;
        //Yes按钮
        var YesBtn = StatusBarDiv.CreateButton(WinObj.attr("id")+"_YesButton",{
            //按钮类型，支持类型如下
            Type : "Text",
            
            //按下鼠标时执行的函数，传入的参数依次为：按钮本身对象、当前按下状态、按钮文本、event
            OnClick :  $.WindowDialogBtnClickFun,
            
            //是否指定定按钮宽度
            SetWidth : true,
            
            //按钮中Button对象的宽度,不包括两边的各3px的圆角部分
            Width : opts.BtnWidth
        },
        opts.YesBtnText);
        YesBtn.attr("DialogWindowBtn","Yes");
        DialogBtnDivWidth += YesBtn.outerWidth(true);
        
        //No按钮
        var NoBtn = $("");
        if(opts.DialogType != "Alert"){
            YesBtn.css({"float":"left","margin-right":opts.BtnMargin+"px"});
            NoBtn = StatusBarDiv.CreateButton(WinObj.attr("id")+"_NoButton",{
                //按钮类型，支持类型如下
                Type : "Text",
                
                //按下鼠标时执行的函数，传入的参数依次为：按钮本身对象、当前按下状态、按钮文本、event
                OnClick : $.WindowDialogBtnClickFun,
                
                //是否指定定按钮宽度
                SetWidth : true,
                
                //按钮中Button对象的宽度,不包括两边的各3px的圆角部分
                Width : opts.BtnWidth
            },
            opts.NoBtnText);
            NoBtn.attr("DialogWindowBtn","No");
            DialogBtnDivWidth += opts.BtnMargin + NoBtn.outerWidth(true);
        }
        
        if(opts.DialogType == "YesNoCancel"){
            NoBtn.css({"float":"left","margin-right":opts.BtnMargin+"px"});
            CancelBtn = StatusBarDiv.CreateButton(WinObj.attr("id")+"_CancelButton",{
                //按钮类型，支持类型如下
                Type : "Text",
                
                //按下鼠标时执行的函数，传入的参数依次为：按钮本身对象、当前按下状态、按钮文本、event
                OnClick :  $.WindowDialogBtnClickFun,
                
                //是否指定定按钮宽度
                SetWidth : true,
                
                //按钮中Button对象的宽度,不包括两边的各3px的圆角部分
                Width : opts.BtnWidth
            },
            opts.CancelBtnText);
            CancelBtn.attr("DialogWindowBtn","Cancel");
            CancelBtn.css({"float":"left"});
            DialogBtnDivWidth += opts.BtnMargin + CancelBtn.outerWidth(true);
        }
        
        StatusBarDiv.css("width",DialogBtnDivWidth + "px");
    };
     
    //以下为内部函数
    //根据参数设置窗口大小
    function SetWindowSize(obj,opts,width,height,isMaximize){
        var tempPara = obj.data("WindowTempPara");
        
        if(width === undefined || width == null)
            width = (tempPara.LastWidth === undefined ? opts.Width : tempPara.LastWidth);
        if(height === undefined || height == null)
            height = (tempPara.LastHeight === undefined ? opts.Height : tempPara.LastHeight);
        if(width < opts.MinWidth)
            width = opts.MinWidth;
        if(height < opts.MinHeight)
            height = opts.MinHeight;
        
        if(isMaximize){
            if(obj.attr("WindowMaximize") == "true"){
                //原来就已经是最大化，只改变大小，不记录原大小
                obj.css({width:width+"px",height:height+"px"});
            }
            else{
                //从一般变成最大化，要记录原大小
                obj.css({width:width+"px",height:height+"px"});
                tempPara.LastWidth = tempPara.Width;
                tempPara.LastHeight = tempPara.Height;
            }
            tempPara.Height = height;
            tempPara.Width = width;
        }
        else{
            //开始设置大小
            if(opts.MaxWidth != -1 && width > opts.MaxWidth){
                width = opts.MaxWidth;
            }
            if(opts.MaxHeight != -1 && width > opts.MaxHeight){
                height = opts.MaxHeight;
            }
            
            switch(opts.SizeType){
                case "fixed":
                    //固定大小
                    obj.css({width:width+"px",height:height+"px"});
                    tempPara.Height = height;
                    tempPara.Width = width;
                    break;
                case "fitX":
                    obj.css("height",height+"px");
                    tempPara.Height = height;
                    tempPara.Width = Math.max(opts.MinWidth,obj.data("WindowContentDiv").scrollWidth() + tempPara.LeftAndRightWidth);
                    obj.css("width",tempPara.Width+"px");
                    break;
                case "fitY":
                    obj.css("width",width+"px");
                    tempPara.Height = Math.max(opts.MinHeight,obj.data("WindowContentDiv").scrollHeight() + tempPara.TopAndBtmHeight);
                    tempPara.Width = width;
                    obj.css("height",tempPara.Height+"px");
                    break;
                case "fit":
                    tempPara.Width = Math.max(opts.MinWidth,obj.data("WindowContentDiv").scrollWidth() + tempPara.LeftAndRightWidth);
                    obj.css("width",tempPara.Width+"px");
                    tempPara.Height = Math.max(opts.MinHeight,obj.data("WindowContentDiv").scrollHeight() + tempPara.TopAndBtmHeight);
                    obj.css("height",tempPara.Height+"px");
                    break;
                default :
                    return;
            }  
            
            tempPara.LastWidth = tempPara.Width;
            tempPara.LastHeight = tempPara.Height;
        }    
        
        obj.data("WindowTempPara",tempPara);
        
        //有滚动条的情况，IE6由于会崩溃，因此通过timeout的方式改变内容高度
        if(opts.IE6Defense && $.browser.msie && parseFloat($.browser.version) < 7){
            setTimeout("$('#"+obj.attr("id")+"').find(\"table > tbody > tr[WindowType='MidTr'] > td[WindowType='MidTdCenter'] > div[WindowType='Body']\").height("+(tempPara.Height - tempPara.TopAndBtmHeight)+");",1);
        }
        else{
            obj.find("table > tbody > tr[WindowType='MidTr'] > td[WindowType='MidTdCenter'] > div[WindowType='Body']").height(tempPara.Height - tempPara.TopAndBtmHeight);
        }
        
        
        //执行改变大小函数
        if(opts.OnResize != null){
            try{
                opts.OnResize(obj,obj.data("WindowContentDiv"),{width:tempPara.Width,height:tempPara.Height},{width:tempPara.Width - tempPara.LeftAndRightWidth,height:tempPara.Height - tempPara.TopAndBtmHeight});
            }catch(e){;}
        }

        return;
    };
    
    //设置窗口位置
    function SetWindowPos(obj,opts,left,top){
        var tempPara = obj.data("WindowTempPara");
        if((left === undefined || left == null) && opts.StartPosition == "center"){
            //启动时设置在窗口中间
            var parentObj = $(obj.get(0).parentNode);
            if(parentObj.get(0) == document.body){
                obj.SetPosition("center:center");
                tempPara.Left = parseInt(obj.css("left"));
                tempPara.Top = parseInt(obj.css("top"));
            }
            else{
                //要另外计算中间位置
                tempPara.Left = parseInt((parentObj.innerWidth(true) - tempPara.Width)/2);
                tempPara.Top = parseInt((parentObj.innerHeight(true) - tempPara.Height)/2);
                obj.css({left:tempPara.Left+"px",top:tempPara.Top+"px"});
            }
        }
        else{
            //设置其他位置
            if(left === undefined || left == null){
                left = (tempPara.Left === undefined ? opts.Left : tempPara.Left);
            }
            if(top === undefined || left == null){
                top = (tempPara.Top === undefined ? opts.Top : tempPara.Top);
            }
            tempPara.Left = left;
            tempPara.Top = top;
            obj.css({left:tempPara.Left+"px",top:tempPara.Top+"px"});
        }
        obj.data("WindowTempPara",tempPara);
    };
    
    //将窗口最大化
    function WindowMaximizeFun(WinObj,opts){
        if(!opts.MaxSizeAble || (WinObj.attr("WindowMaximize") !== undefined && WinObj.attr("WindowMaximize") == "true")){
            return;
        }
        
        var parentObj = $(WinObj.get(0).parentNode);
        var Width;
        var Height;
        if(parentObj.get(0) == document.body){
            var WinSize = $.getWindowSize();
                        
            //设置大小
            SetWindowSize(WinObj,opts,WinSize.width,WinSize.height,true);
            
            //设置位置，设置浮动，以致可以一直挡在前面
            WinObj.SetFloat("0:0");
            
            //绑定父对象的resize事件
            if(parentObj.attr("HasBindWindowMaximizeResizeFun") != "true"){
                parentObj.attr("HasBindWindowMaximizeResizeFun","true");
                $(window).bind("resize",$.WindowMaximizeResizeFun);
            }
        }
        else{
            //设置大小
            SetWindowSize(WinObj,opts,parentObj.innerWidth(true),parentObj.innerHeight(true),true);
            //设置位置
            WinObj.css({left:"0px",top:"0px"});
            //绑定父对象的resize事件
            if(parentObj.attr("HasBindWindowMaximizeResizeFun") != "true"){
                parentObj.attr("HasBindWindowMaximizeResizeFun","true");
                parentObj.bind("resize",$.WindowMaximizeResizeFun);
            }
        }
        
        //如果有阴影，隐藏阴影
        var ShadowID = WinObj.attr("CornerShadowID");
        if(ShadowID !== undefined)
            WinObj.HideCornerShadow();
            
        //改变最大化按钮的样式
        WinObj.find("table > tbody > tr[WindowType='TopTr'] > td[WindowType='TopTdCenter']").children("#"+WinObj.attr("id")+"_MaximizeButton").ChangeToolButtonStyle($.ToolButtonGetStyle("","restore"));
        
        //设置最大化的标识
        WinObj.attr("WindowMaximize","true");
        
        //取消一些绑定的事件
        WinObj.find("table > tbody > tr[WindowType='TopTr'] > td[WindowType='TopTdCenter']").unbind("mousedown",$.WindowTitleDragFun);
        WinObj.ClearResizeAble();
        
        //取消样式
        WinObj.children().removeClass("WindowMoveAble");
    };
    
    //将窗口从最大化重置为一般状态
    function WindowRestoreSizeFun(WinObj,opts){
        if(WinObj.attr("WindowMaximize") == "false"){
            return;
        }
        
        var tempPara = WinObj.data("WindowTempPara");
        
        //清除对象的浮动属性
        if(WinObj.get(0).parentNode == document.body){
            WinObj.ClearFloat();
        };
        
        //重新设置大小
        SetWindowSize(WinObj,opts,tempPara.LastWidth,tempPara.LastHeight);
        
        //重新设置位置
        SetWindowPos(WinObj,opts,tempPara.Left,tempPara.Top);
        
        //如果有阴影，显示阴影
        var ShadowID = WinObj.attr("CornerShadowID");
        if(ShadowID !== undefined)
            WinObj.ShowCornerShadow();
        
        //改变最大化按钮的样式
        WinObj.find("table > tbody > tr[WindowType='TopTr'] > td[WindowType='TopTdCenter']").children("#"+WinObj.attr("id")+"_MaximizeButton").ChangeToolButtonStyle($.ToolButtonGetStyle("","maximize"));
        
        //设置最大化的标识
        WinObj.attr("WindowMaximize","false");
        
        //绑定事件
        if(opts.DragAble){
            //拖动控件
            WinObj.find("table > tbody > tr[WindowType='TopTr'] > td[WindowType='TopTdCenter']").bind("mousedown",$.WindowTitleDragFun);
            //绑定样式
            WinObj.children().addClass("WindowMoveAble");
        }
        
        if(opts.ResizeAble && opts.SizeType != "fit"){
            //改变大小控件
            var ResizeOpts = WinObj.data("WindowResizeOpts");
            WinObj.SetResizeAble(ResizeOpts);
        }
    };
    
    //父节点改变大小时执行的函数
    $.WindowMaximizeResizeFun = function(){
        if(this == window || this == document.body){
            eval("setTimeout('$.WindowMaximizeResizeFun_Real($(window))',10);");
        }else{
            eval("setTimeout(\"$.WindowMaximizeResizeFun_Real($('#"+$(this).attr("id")+"'))\",10);");
        }
    };
    
    //真正在最大化情况下改变大小的函数
    $.WindowMaximizeResizeFun_Real = function(parentObj){
        parentObj = $(parentObj);
        var Width;
        var Height;
        if(parentObj.get(0) == window){
            parentObj = $(document.body);
            var WinSize = $.getWindowSize();
            Width = WinSize.width;
            Height = WinSize.height;
        }
        else{
            Width = parentObj.innerWidth(true);
            Height = parentObj.innerHeight(true);
        }
        
        var WindowCtlPara = parentObj.data("WindowCtlPara");
        for(var i = 0;i<WindowCtlPara.NormalWinList.length;i++){
            var WinObj = WindowCtlPara.NormalWinList[i];
            if(WinObj.attr("WindowMaximize") == "true" && WinObj.css("display") != "none"){
                //设置大小
                SetWindowSize(WinObj,WinObj.data("WindowOpts"),Width,Height,true);
            }
        }
        for(var i = 0;i<WindowCtlPara.MsgBoxList.length;i++){
            var WinObj = WindowCtlPara.MsgBoxList[i];
            if(WinObj.attr("WindowMaximize") == "true"){
                //设置大小
                SetWindowSize(WinObj,WinObj.data("WindowOpts"),Width,Height,true);
            }
        }
    };
    
    //点击按钮执行的函数
    $.WindowToolButtonClick = function(ToolButtonObj,FunPara,event){
        var Para = FunPara.split(';');
        var WinObj = $("#"+Para[1]);
        var opts = WinObj.data("WindowOpts");
        var ret = true;
        switch(Para[0]){
            case "close":
                //关闭窗口
                if(opts.OnCloseClick != null){
                    try{
                        ret = opts.OnCloseClick(WinObj,WinObj.data("WindowContentDiv"));
                    }catch(e){;}
                }
                if(!ret){
                    //中止按钮的执行
                    return;
                }
                
                //执行关闭函数
                WinObj.CloseWindow();
                break;
            case "maximize":
                //最大化窗口
                var isMaxize = (WinObj.attr("WindowMaximize") != "true");
                if(opts.OnMaxSizeClick != null){
                    try{
                        ret = opts.OnMaxSizeClick(WinObj,WinObj.data("WindowContentDiv"),isMaxize);
                    }catch(e){;}
                }
                if(!ret){
                    //中止按钮的执行
                    return;
                }
                
                if(isMaxize){
                    //最大化窗口
                    WindowMaximizeFun(WinObj,opts);
                }
                else{
                    //重置窗口
                    WindowRestoreSizeFun(WinObj,opts);
                }
                break;
            case "minimize":
                //最小化窗口
                if(opts.OnMinSizeClick != null){
                    try{
                        ret = opts.OnMinSizeClick(WinObj,WinObj.data("WindowContentDiv"));
                    }catch(e){;}
                }
                if(!ret){
                    //中止按钮的执行
                    return;
                }
                
                //隐藏窗口
                WinObj.HideWindow();
                break;
            default :
                //无法识别的类型
                return;
        }
    };
    
    //鼠标在窗口标题按下执行的拖动事件
    $.WindowTitleDragFun = function(){
        var WinObj = $(this.parentNode.parentNode.parentNode.parentNode);
        var opts = WinObj.data("WindowOpts");
                
        //如果有阴影，隐藏阴影
        var ShadowID = WinObj.attr("CornerShadowID");
        if(ShadowID !== undefined)
            WinObj.HideCornerShadow();
            
        //由于IE6如果有滚动条，则拖动会出异常因此在这里先对滚动条情况进行处理
        if(opts.IE6Defense && $.browser.msie && parseFloat($.browser.version) < 7){
           WinObj.data("WindowContentDiv").WindowSetObjNoScrollBar();
        }
            
        //开始拖动
        WinObj.Drag({
            //拖动结束后执行的函数，传入的参数为：是否生效、拖动对象的清单，结束拖动时鼠标位置上匹配到的dragOn对象
            endDragFun : $.WindowEndDragFun
        });
    };
    
    //结束拖动时执行的函数，显示阴影
    $.WindowEndDragFun = function(isAffect,dragControl){
        //如果有阴影，显示阴影
        var WinObj = dragControl.List[0].Obj;
        //设置对象位置
        var opts = WinObj.data("WindowOpts");
        SetWindowPos(WinObj,opts,dragControl.List[0].Obj.L,dragControl.List[0].Obj.T);
        
        var ShadowID = WinObj.attr("CornerShadowID");
        if(ShadowID !== undefined)
            WinObj.ShowCornerShadow();
            
        //由于IE6如果有滚动条，则拖动会出异常因此在这里先对滚动条情况进行处理
        if(opts.IE6Defense && $.browser.msie && parseFloat($.browser.version) < 7){
            WinObj.data("WindowContentDiv").WindowReSetObjScrollBar();
        }
        
        if(opts.AfterDrag != null){
            try{
                opts.AfterDrag(WinObj,WinObj.data("WindowContentDiv"),{left:dragControl.List[0].Obj.L,top:dragControl.List[0].Obj.T});
            }catch(e){;}
        }
    };
    
    //双击标题栏执行最大化或最小化操作
    $.WindowTitleDbClick = function(){
        var WinObj = $(this.parentNode.parentNode.parentNode.parentNode);
        var opts = WinObj.data("WindowOpts");
        
        var ret = true;
        if(opts.OnTitleDbClick != null){
            try{
                ret = opts.OnTitleDbClick(WinObj,WinObj.data("WindowContentDiv"));
            }catch(e){;}
        }
        
        if(!ret){
            return;
        }
        
        var isMaxize = (WinObj.attr("WindowMaximize") != "true");
        if(isMaxize){
            //最大化窗口
            WindowMaximizeFun(WinObj,opts);
        }
        else{
            //重置窗口
            WindowRestoreSizeFun(WinObj,opts);
        }
    };
    
    //改变大小操作开始
    $.WindowResizeBeginFun = function(WinObj,ResizeOpts,evt){
        //先执行自定义的函数
        var opts = WinObj.data("WindowOpts");
        var ret = true;
        if(opts.ResizeControlPara.beginResizeFun != null){
            try{
                ret = opts.ResizeControlPara.beginResizeFun(WinObj,ResizeOpts,evt);
            }catch(e){;}
        }
        
        if(!ret){
            return false;
        }
        
        //如果有阴影，隐藏阴影
        var ShadowID = WinObj.attr("CornerShadowID");
        if(ShadowID !== undefined)
            WinObj.HideCornerShadow();
            
        return true;
    };
    
    
    //改变大小操作结束
    $.WindowEndResizeFun = function(confirmRet,WinObj,ResizeOpts,e,objpos,objsize){
        var opts = WinObj.data("WindowOpts");
        
        //先执行自定义的函数
        if(opts.ResizeControlPara.endResizeFun != null){
            try{
                opts.ResizeControlPara.endResizeFun(confirmRet,WinObj,ResizeOpts,e,objpos,objsize);
            }catch(e){;}
        }
        
        if(!confirmRet){
            //不改变大小
            return;
        }
        
        //改变对象大小
        SetWindowSize(WinObj,opts,objsize.width,objsize.height,false);
        
        //改变对象位置
        SetWindowPos(WinObj,opts,objpos.left,objpos.top);
        
        //如果有阴影，显示阴影
        var ShadowID = WinObj.attr("CornerShadowID");
        if(ShadowID !== undefined){
            var js = "setTimeout($('#"+WinObj.attr("id")+"').ShowCornerShadow(),100);";
            eval(js);
        }
        
        return;
    };
    
    
    //显示Msg窗口的遮罩，同时将对象加入msgbox的控制列表
    $.fn.WindowShowBlockUI = function(isNew){
        var WinObj = $(this.get(0));
        var opts = WinObj.data("WindowOpts");
        if(!opts.IsMsgBox){
            return;
        }
        
        if(isNew === undefined)
            isNew = true;
        
        var parentObj = $(WinObj.get(0).parentNode);
        var WindowCtlPara = parentObj.data("WindowCtlPara");
        
        if(isNew && WindowCtlPara.MsgBoxList.length > 0){
            //先隐藏了上一个Msg窗口的遮罩先
            if(parentObj.get(0) == document.body)
                $.unblockUI();
            else
                parentObj.unblock();
        }
        
        //设置z-index
        if(isNew){
            WindowCtlPara.MsgBoxCurrentZindex += 3;
            WinObj.css("z-index",WindowCtlPara.MsgBoxCurrentZindex);
            var ShadowID = WinObj.attr("CornerShadowID");
            if(ShadowID !== undefined)
                $("#"+ShadowID).css("z-index",WindowCtlPara.MsgBoxCurrentZindex - 1);
        }
        
        //启动遮罩
        if(parentObj.get(0) == document.body){
            $.blockUI({ 
                message: null,
                overlayCSS : {
                    backgroundColor: opts.blockUIPara.backgroundColor,
				    opacity:	  	 opts.blockUIPara.opacity,
				    cursor:		  	 opts.blockUIPara.cursor
                },
                baseZ: parseInt(WinObj.css("z-index")) - 2,
                // fadeIn time in millis; set to 0 to disable fadeIn on block
			    fadeIn:  0,
			    // fadeOut time in millis; set to 0 to disable fadeOut on unblock
			    fadeOut:  0,
			    // enable if you want key and mouse events to be disabled for content that is blocked
			    bindEvents: false
            });
        }
        else{
            parentObj.block({ 
                message: null,
                overlayCSS : {
                    backgroundColor: opts.blockUIPara.backgroundColor,
				    opacity:	  	 opts.blockUIPara.opacity,
				    cursor:		  	 opts.blockUIPara.cursor
                },
                baseZ: parseInt(WinObj.css("z-index")) - 2,
                // fadeIn time in millis; set to 0 to disable fadeIn on block
			    fadeIn:  0,
			    // fadeOut time in millis; set to 0 to disable fadeOut on unblock
			    fadeOut:  0,
			    // enable if you want key and mouse events to be disabled for content that is blocked
			    bindEvents: false
            });
        }
        
        //将对象加入控制
        if(isNew){
            WindowCtlPara.MsgBoxList.push(WinObj);
            //保存变量
            parentObj.data("WindowCtlPara",WindowCtlPara);
        }
    };
    
    //隐藏Msg窗口的遮罩,同时将对象从msgbox的控制列表中删除
    $.fn.WindowHideBlockUI = function(){
        var WinObj = $(this.get(0));
        var opts = WinObj.data("WindowOpts");
        if(!opts.IsMsgBox){
            return;
        }
        
        var parentObj = $(WinObj.get(0).parentNode);
        var WindowCtlPara = parentObj.data("WindowCtlPara");
        
        if(WindowCtlPara.MsgBoxList.length == 0){
            //没有遮罩
            return;
        }
        
        if(WindowCtlPara.MsgBoxList[WindowCtlPara.MsgBoxList.length-1].get(0) == WinObj.get(0)){
            //是最后一个遮罩,关闭遮罩
            if(parentObj.get(0) == document.body)
                $.unblockUI();
            else
                parentObj.unblock(); 
            
            //从掌控队列中删除对象
            WindowCtlPara.MsgBoxList.splice(WindowCtlPara.MsgBoxList.length-1,1);
            
            //对倒数第2个对象启动遮罩
            if(WindowCtlPara.MsgBoxList.length > 0){
                WindowCtlPara.MsgBoxList[WindowCtlPara.MsgBoxList.length - 1].WindowShowBlockUI(false);
                //设置当前的msgbox的zindex
                WindowCtlPara.MsgBoxCurrentZindex = parseInt(WindowCtlPara.MsgBoxList[WindowCtlPara.MsgBoxList.length - 1].css("z-index"));
            }
            else{
                //已经没有显示的窗口了，重置遮罩的当前zindex
                WindowCtlPara.MsgBoxCurrentZindex = WindowCtlPara.MaxZIndex + 1;
            }
            
            parentObj.data("WindowCtlPara",WindowCtlPara);
        }
        else{
            //不是最后一个msg对象,找到对象并删除
            for(var i = 0;i<WindowCtlPara.MsgBoxList.length;i++){
                if(WindowCtlPara.MsgBoxList[i].get(0) == WinObj.get(0)){
                    WindowCtlPara.MsgBoxList.splice(i,1);
                    break;
                }
            }
            parentObj.data("WindowCtlPara",WindowCtlPara);
            return;
        }
    };
    
    //将对象及其所有子对象设置为无滚动条
    $.fn.WindowSetObjNoScrollBar = function(){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            var tempCssPara = obj.data("WindowSetObjNoScrollBarCssPara");
            if(tempCssPara === undefined){
                var lastCss = obj.css("overflow");
                if(lastCss === undefined){
                    lastCss = "";
                }
                obj.data("WindowSetObjNoScrollBarCssPara",lastCss);
                obj.css("overflow","hidden");
                //递归处理子节点
                obj.children().WindowSetObjNoScrollBar();
            }
        }
    };
    
    //恢复对象原来的滚动条情况
    $.fn.WindowReSetObjScrollBar = function(){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            var tempCssPara = obj.data("WindowSetObjNoScrollBarCssPara");
            if(tempCssPara !== undefined){
                obj.css("overflow",tempCssPara);
                //删除数据
                obj.removeData("WindowSetObjNoScrollBarCssPara");
                //递归处理子节点
                obj.children().WindowReSetObjScrollBar();
            }
        }
    };
    
    //消息窗口点击按钮的事件
    $.WindowDialogBtnClickFun = function(BtnObj){
        var WinObj = $(BtnObj.get(0).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
        var msgopts = WinObj.data("WindowDialogOpts");
        var ret = true;
        if(msgopts.CallBack != null){
            try{
                switch(msgopts.DialogType){
                    case "Alert":
                        ret = msgopts.CallBack(msgopts.CallBackPara);
                        break;
                    case "Confirm":
                    case "YesNoCancel":
                        ret = msgopts.CallBack(msgopts.CallBackPara,BtnObj.attr("DialogWindowBtn"));
                        break;
                    case "Prompt":
                        ret = msgopts.CallBack(msgopts.CallBackPara,BtnObj.attr("DialogWindowBtn"),WinObj.find("table > tbody > tr[WindowType='MidTr'] > td[WindowType='MidTdCenter'] > div[WindowType='Body'] > div[WindowType='DialogDiv'] > input").get(0).value);
                        break;
                    default :
                        ret = msgopts.CallBack(msgopts.CallBackPara,BtnObj.attr("DialogWindowBtn"),WinObj.find("table > tbody > tr[WindowType='MidTr'] > td[WindowType='MidTdCenter'] > div[WindowType='Body'] > div[WindowType='DialogDiv'] > textarea").get(0).value);
                        break;
                }
            }catch(e){;}
        }
        if(!ret){
            return;
        }
        
        //关闭窗口
        setTimeout("$('#"+WinObj.attr("id")+"').CloseWindow();",10);
        
    };
    
    //点击关闭按钮
    $.WindowDialogCloseClickFun = function(WinObj){
        var msgopts = WinObj.data("WindowDialogOpts");
        var ret = true;
        if(msgopts.CallBack != null){
            try{
                switch(msgopts.DialogType){
                    case "Alert":
                        ret = msgopts.CallBack(msgopts.CallBackPara);
                        break;
                    case "Confirm":
                        ret = msgopts.CallBack(msgopts.CallBackPara,"No");
                        break;
                    case "YesNoCancel":
                        ret = msgopts.CallBack(msgopts.CallBackPara,"Cancel");
                        break;
                    case "Prompt":
                        ret = msgopts.CallBack(msgopts.CallBackPara,"No",WinObj.find("table > tbody > tr[WindowType='MidTr'] > td[WindowType='MidTdCenter'] > div[WindowType='Body'] > div[WindowType='DialogDiv'] > input").get(0).value);
                        break;
                    default :
                        ret = msgopts.CallBack(msgopts.CallBackPara,"No",WinObj.find("table > tbody > tr[WindowType='MidTr'] > td[WindowType='MidTdCenter'] > div[WindowType='Body'] > div[WindowType='DialogDiv'] > textarea").get(0).value);
                        break;
                }
            }catch(e){;}
        }
        
        return ret;
    };

})(jQuery);