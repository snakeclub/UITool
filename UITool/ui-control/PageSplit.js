/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：PageSplit
说明：翻页控件，基于ToolBar和Button组成样式
文件：PageSplit.js
依赖文件：jquery-1.6.4.min.js
          TimerControl.js
          BarScrollDiv.js
          ToolFunction.js
          ToolBar.js
          Button.js
          
          
资源文件：ButtonCss/Button.css
          
          
-----------------------*/
;(function($) {
    //默认创建参数
    $.PageSplit = new Object();
    $.PageSplit.defaults = {
        //样式前缀
        CssBefore : "PageSplit",
        
        //按钮的Css样式前缀
        ButtonCssBefore : "Button",
        
        //工具栏的Css样式前缀
        ToolBarCssBefore : "ToolBar",
        
        //翻页控件类型，支持类型如下
        //Icon - 图标按钮分页符
        Type : "Icon",
        
        //控件(工具栏)宽度,可以为百分比，也可以象素
        //如果包含在容器中，则容器宽度与这个相同
        Width: "100%",
        
        //是否包含在滚动容器中
        InScrollDiv : true,
        
        //滚动容器的样式前缀
        ScrollDivCssBefore : "BarScrollDiv",
        
        //滚动容器滚动每一下的距离，单位为px
        ScrollDivScrollStep : 2,
        
        //是否显示刷新按钮
        ShowRefresh : true,
        
        //loading图片src
        LoadingPic : "../../ui-control/PageSplitImg/loading.gif",
        
        //每页的记录数
        NumPerPage : 15,
        
        //页数显示文本，显示在按钮中间，可用以下内容替换变量
        //[CurrentPageInput] - 可输入的当前页数，input text
        //[CurrentPage] - 当前页数文本
        //[TotalPage] - 总页数文本
        //[TotalCount]  -  总记录数文本
        PageShowText : "第[CurrentPageInput]页  共[TotalPage]页",
        
        //输入页数的输入框宽度，单位为px
        CurrentPageInputWidth : 20,
        
        //输入页数的输入框自动扩展大小，设置页数时，如果发现显示不全，自动扩大
        CurrentPageInputAutoWidth : true,
        
        //是否显示每页记录数设置
        ShowNumPerPage : true,
        
        //每页记录数设置文本
        //[NumPerPageInput] - 每页记录数输入
        NumPerPageText : "每页[NumPerPageInput]条记录",
        
        //每页记录数的输入框宽度，单位为px
        NumPerPageInputWidth : 20,
        
        //是否显示右手提示信息
        ShowRightTip : false,
        
        //右手提示信息显示文本，可用以下内容替换变量
        //[CurrentPage] - 当前页数文本
        //[TotalPage] - 总页数文本
        //[TotalCount]  -  总记录数文本
        //[NumPerPage]  -每页记录数文本
        RightTip : "第[CurrentPage]&nbsp;页  共[TotalPage]页",
        
        //翻页操作执行的函数（点击上一页、下一页等按钮）
        //传入的参数依次为ToolBar对象，请求的页码，当前PageInfo变量，操作按钮类型：Prev\Next\First\Last\Refresh
        //执行函数返回true代表按钮状态转入loading，返回false代表直接还是Refresh按钮状态
        OnButtonClick : null
    };
    
    //在指定对象下创建一个PageSplit控件
    $.fn.CreatePageSplit = function(id,opts,pageKey){
        //获取参数
        opts = $.extend({}, $.PageSplit.defaults, opts || {});
        
        //循环对每个对象进行处理
        for(var i = 0;i<this.length;i++){
            var parentobj = $(this.get(i));
            
            //是否自定义id
            var tempid = id;
            if(tempid === undefined || tempid == ""){
                var autoidnum = 0;
                while(true){
                    if($("#PageSplit_"+autoidnum).length > 0){
                        autoidnum++;
                    }
                    else{
                        tempid = "PageSplit_"+autoidnum;
                        break;
                    }
                }
            }
            
            //创建工具栏
            parentobj.CreateToolBar(tempid,{
                    //样式前缀
                    CssBefore : opts.ToolBarCssBefore,
                    
                    //工具栏宽度,可以为百分比，也可以象素
                    Width: opts.Width,
                    
                    //是否包含在滚动容器中
                    InScrollDiv : opts.InScrollDiv,
                    
                    //滚动容器的样式前缀
                    ScrollDivCssBefore : opts.ScrollDivCssBefore,
                    
                    //滚动容器的宽度
                    ScrollDivWidth : opts.Width,
                    
                    //滚动容器滚动每一下的距离，单位为px
                    ScrollDivScrollStep : opts.ScrollDivScrollStep
                });
             var obj = $("#"+tempid).last();
             
             
             //在工具栏上增加属性和绑定变量
             obj.attr("PageSplit","true");
             obj.data("PageSplitOpts",opts);
             var PageInfo = new Object();
             PageInfo.Key = pageKey;    //当前分页控件的分页参数
             PageInfo.TotalCount = 0;   //记录总数
             PageInfo.NumPerPage = opts.NumPerPage;  //每页记录数
             PageInfo.TotalPage = 0;    //总页数
             PageInfo.CurrentPage = 0;  //当前页（从1开始）
             obj.data("PageInfo",PageInfo);
             
            //创建工具栏按钮
            var buttonOpts = {
                //样式前缀
                CssBefore : opts.ButtonCssBefore,
                
                //按钮类型，支持类型如下
                //Text - 纯文字按钮-或带图标的按钮
                //Icon - 纯图标按钮
                //SplitArrow - 分隔下拉按钮（用于组合分隔下拉菜单）
                Type : "Icon",
                
                //按下鼠标时执行的函数，传入的参数依次为：按钮本身对象、当前按下状态、按钮文本、event
                OnClick : $.PageSplitButtonClick,
                
                //是否工具栏图标
                InToolBar : true
            };
            
            obj.CreateToolBarDiv(tempid+"_ToolBarFirst").CreateButton(tempid+"ButtonFirst",buttonOpts,"First");  //到第1页
            obj.CreateToolBarDiv(tempid+"_ToolBarPrev").CreateButton(tempid+"ButtonPrev",buttonOpts,"Prev");  //上一页
            
            obj.CreateToolBarSplit(tempid +"_ToolBarSplit1");  //分隔符
            
            var PageShowHtml = opts.PageShowText.replace("[CurrentPageInput]","<input type='text' id='"+tempid+"_CurrentPageInput' class='CurrentPageInput' style='width:"+opts.CurrentPageInputWidth+"px' value='' />").replace("[CurrentPage]","<a id='"+tempid+"_CurrentPage' class='CurrentPage'></a>").replace("[TotalPage]","<a id='"+tempid+"_TotalPage' class='TotalPage'></a>").replace("[TotalCount]","<a id='"+tempid+"_TotalCount' class='TotalCount'></a>");
            obj.CreateToolBarDiv(tempid+"_ToolBarPageShowText","Left",null,PageShowHtml);  //页数显示
            
            obj.CreateToolBarSplit(tempid +"_ToolBarSplit2");  //分隔符
            
            obj.CreateToolBarDiv(tempid+"_ToolBarNext").CreateButton(tempid+"ButtonNext",buttonOpts,"Next");  //下一页
            obj.CreateToolBarDiv(tempid+"_ToolBarLast").CreateButton(tempid+"ButtonLast",buttonOpts,"Last");  //到最后一页
            
            obj.CreateToolBarSplit(tempid +"_ToolBarSplitRefresh");  //分隔符
            
            obj.CreateToolBarDiv(tempid+"_ToolBarRefresh").CreateButton(tempid+"ButtonRefresh",buttonOpts,"Refresh");  //刷新按钮
            obj.CreateToolBarDiv(tempid+"_ToolBarLoadingPic","Left",null,"<img id='"+tempid+"_LoadingPic' class='LoadingPic' src='"+opts.LoadingPic+"' />");  //loading状态图片
            
            obj.CreateToolBarSplit(tempid +"_ToolBarSplitNumPerPage");  //分隔符
            
            var NumPerPageTextHtml = opts.NumPerPageText.replace("[NumPerPageInput]","<input type='text' id='"+tempid+"_NumPerPageInput' class='NumPerPageInput' style='width:"+opts.NumPerPageInputWidth+"px' value='"+opts.NumPerPage+"' />");
            obj.CreateToolBarDiv(tempid+"_ToolBarNumPerPageText","Left",null,NumPerPageTextHtml);  //每页记录数控制
            
            var RightTipHtml = opts.RightTip.replace("[CurrentPage]","<a id='"+tempid+"_CurrentPage' class='CurrentPage'></a>").replace("[TotalPage]","<a id='"+tempid+"_TotalPage' class='TotalPage'></a>").replace("[TotalCount]","<a id='"+tempid+"_TotalCount' class='TotalCount'></a>").replace("[NumPerPage]","<a id='"+tempid+"_NumPerPage' class='NumPerPage'></a>");
            obj.CreateToolBarDiv(tempid+"_ToolBarRightTip","Right",null,RightTipHtml);  //每页记录数控制

            //初始化各种显示参数
            PageSplitInitStyle(obj,tempid,opts);
        }    
    };
    
    
    //设置Refresh按钮的状态
    $.fn.PageSplitRefreshStat = function(noLoading){
        //循环对每个对象进行处理
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            if(!obj.is("table[selftype='ToolBar'][PageSplit='true']")){
                continue;
            }
            
            var opts = obj.data("PageSplitOpts");
            if(opts.ShowRefresh){
                var objid = obj.attr("id");
                var ToolBarRefresh = obj.GetToolBarDiv("#"+objid+"_ToolBarRefresh");
                var ToolBarLoadingPic = obj.GetToolBarDiv("#"+objid+"_ToolBarLoadingPic");
                if(noLoading){
                    ToolBarRefresh.css("display","block");
                    ToolBarLoadingPic.css("display","none");
                }
                else{
                    ToolBarRefresh.css("display","none");
                    ToolBarLoadingPic.css("display","block");
                }
            }
        }
    };
    
    //根据传入的PageInfo变量更新按钮状态
    $.fn.PageSplitSetPageInfo = function(PageInfo){
        //循环对每个对象进行处理
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            if(!obj.is("table[selftype='ToolBar'][PageSplit='true']")){
                continue;
            }
            
            //记录变量
            obj.data("PageInfo",PageInfo);
            
            //更新显示内容
            var objid = obj.attr("id");
            var ToolBarPageShowText = obj.GetToolBarDiv("#"+objid+"_ToolBarPageShowText");
            var ToolBarNumPerPageText = obj.GetToolBarDiv("#"+objid+"_ToolBarNumPerPageText");
            
            var CurrentPageInput = ToolBarPageShowText.children("#"+objid+"_CurrentPageInput");
            for(var j = 0;j<CurrentPageInput.length;j++){
                CurrentPageInput.get(j).value = PageInfo.CurrentPage;
            }
            
            var NumPerPageInput = ToolBarNumPerPageText.children("#"+objid+"_NumPerPageInput");
            for(var j = 0;j<NumPerPageInput.length;j++){
                NumPerPageInput.get(j).value = PageInfo.NumPerPage;
            }
            
            var CurrentPage = obj.find("#"+objid+"_CurrentPage");
            for(var j = 0;j<CurrentPage.length;j++){
                CurrentPage.get(j).innerHTML = PageInfo.CurrentPage;
            }
            
            var TotalPage = obj.find("#"+objid+"_TotalPage");
            for(var j = 0;j<TotalPage.length;j++){
                TotalPage.get(j).innerHTML = PageInfo.TotalPage;
            }
            
            var TotalCount = obj.find("#"+objid+"_TotalCount");
            for(var j = 0;j<TotalCount.length;j++){
                TotalCount.get(j).innerHTML = PageInfo.TotalCount;
            }
            
            var NumPerPage = obj.find("#"+objid+"_NumPerPage");
            for(var j = 0;j<NumPerPage.length;j++){
                NumPerPage.get(j).innerHTML = PageInfo.NumPerPage;
            }
            
            //判断是否显示上一页等
            obj.GetToolBarDiv("#"+objid+"_ToolBarFirst").children().ButtonEnable(PageInfo.CurrentPage > 1);
            obj.GetToolBarDiv("#"+objid+"_ToolBarPrev").children().ButtonEnable(PageInfo.CurrentPage > 1);
            obj.GetToolBarDiv("#"+objid+"_ToolBarNext").children().ButtonEnable(PageInfo.CurrentPage < PageInfo.TotalPage);
            obj.GetToolBarDiv("#"+objid+"_ToolBarLast").children().ButtonEnable(PageInfo.CurrentPage < PageInfo.TotalPage);
        }
    };
    
    //通过记录数和每页数计算总页数
    $.PageSplitGetTotalPage = function(TotalCount,NumPerPage){
        if(TotalCount == 0){
            return 0;
        }
        var tempnum = TotalCount/NumPerPage;
        var page = parseInt(tempnum);
        return (page == tempnum ? page : page + 1);
    };
    
    
    //以下为私有函数
    //初始化翻页控件的按钮样式
    function PageSplitInitStyle(obj,objid,opts){
        //为主对象打上PageSplit的样式标签
        obj.addClass(opts.CssBefore+"_PageSplit");
        
        //第1页
        var ToolBarFirst = obj.GetToolBarDiv("#"+objid+"_ToolBarFirst");
        ToolBarFirst.addClass("ToolBarFirst");
        ToolBarFirst.children().ButtonEnable(false);
        
        //上一页
        var ToolBarPrev = obj.GetToolBarDiv("#"+objid+"_ToolBarPrev");
        ToolBarPrev.addClass("ToolBarPrev");
        ToolBarPrev.children().ButtonEnable(false);
        
        //页面显示
        var ToolBarPageShowText = obj.GetToolBarDiv("#"+objid+"_ToolBarPageShowText");
        ToolBarPageShowText.addClass("ToolBarPageShowText");
        
        //下一页
        var ToolBarNext = obj.GetToolBarDiv("#"+objid+"_ToolBarNext");
        ToolBarNext.addClass("ToolBarNext");
        ToolBarNext.children().ButtonEnable(false);
        
        //最后一页
        var ToolBarLast = obj.GetToolBarDiv("#"+objid+"_ToolBarLast");
        ToolBarLast.addClass("ToolBarLast");
        ToolBarLast.children().ButtonEnable(false);
        
        //刷新按钮
        var ToolBarRefresh = obj.GetToolBarDiv("#"+objid+"_ToolBarRefresh");
        ToolBarRefresh.addClass("ToolBarRefresh");
        //是否显示刷新按钮
        if(!opts.ShowRefresh){
            obj.GetToolBarDiv("#"+objid+"_ToolBarSplitRefresh").css("display","none");
            ToolBarRefresh.css("display","none");
        }
        
        //loading图片
        var ToolBarLoadingPic = obj.GetToolBarDiv("#"+objid+"_ToolBarLoadingPic");
        ToolBarLoadingPic.addClass("ToolBarLoadingPic");
        ToolBarLoadingPic.css("display","none");
        
        //每页记录数控制
        var ToolBarNumPerPageText = obj.GetToolBarDiv("#"+objid+"_ToolBarNumPerPageText");
        ToolBarNumPerPageText.addClass("ToolBarNumPerPageText");
        if(!opts.ShowNumPerPage){
            obj.GetToolBarDiv("#"+objid+"_ToolBarSplitNumPerPage").css("display","none");
            ToolBarNumPerPageText.css("display","none");
        }
        
        //右手边提示
        var ToolBarRightTip = obj.GetToolBarDiv("#"+objid+"_ToolBarRightTip");
        ToolBarRightTip.addClass("ToolBarRightTip");
        if(!opts.ShowRightTip){
            ToolBarRightTip.css("display","none");
        }
    };
    
    //分页控件的按钮点击事件，按钮本身对象、当前按下状态、按钮文本、event
    $.PageSplitButtonClick = function(buttonObj){
        var obj = GetPageSplitObj(buttonObj);
        if(obj.length == 0){
            return;
        }
                
        var opts = obj.data("PageSplitOpts");
        var PageInfo = obj.data("PageInfo");
        
        //更新每页记录数
        if(opts.ShowNumPerPage){
            var NumPerPageInput = obj.GetToolBarDiv("#"+tempid+"_ToolBarNumPerPageText").find("#"+tempid+"_NumPerPageInput");
            if(NumPerPageInput.length > 0){
                var pagesize = parseInt(NumPerPageInput.get(0).value);
                if(isNaN(pagesize) && pagesize > 0){
                    PageInfo.NumPerPage =  pagesize;
                    NumPerPageInput.get(0).value = pagesize;
                    obj.data("PageInfo",PageInfo);
                }
            }
        }
        
        //执行点击事件
        if(opts.OnButtonClick != null){
            //区分类型
            var SplitType = buttonObj.ButtonValue();
            
            //计算要传入的请求页码
            var RequestPage = 0;
            switch(SplitType){
                case "Prev":
                    RequestPage = Math.max(0,PageInfo.CurrentPage - 1);
                    break;
                case "Next":
                    RequestPage = Math.min(PageInfo.TotalPage,PageInfo.CurrentPage + 1);
                    break;
                case "First":
                    RequestPage = Math.min(1,PageInfo.TotalPage);
                    break;
                case "Last":
                    RequestPage = PageInfo.TotalPage;
                    break;
                default :
                    var tempid = obj.attr("id");
                    var CurrentPageInput = obj.GetToolBarDiv("#"+tempid+"_ToolBarNumPerPageText").find("#"+tempid+"_CurrentPageInput");
                    if(CurrentPageInput.length > 0){
                        RequestPage = parseInt(CurrentPageInput.get(0).value);
                        if(isNaN(RequestPage)){
                            RequestPage = PageInfo.CurrentPage;
                        }
                        CurrentPageInput.get(0).value = RequestPage;
                    }
                    else{
                        RequestPage = PageInfo.CurrentPage;
                    }
                    break;
            }
                    
            //开始执行处理
            var Ret = true;
            try{
                Ret = opts.OnButtonClick(obj,RequestPage,PageInfo,SplitType);
            }catch(e){;}

            //根据返回值更新Refresh的样式
            if(opts.ShowRefresh && !Ret){
                obj.PageSplitRefreshStat(false);
            }
        }
    };
    
    //向上查找到分页控件
    function GetPageSplitObj(childobj){
        var parentObj = childobj;
        while(!parentObj.is("table[selftype='ToolBar'][PageSplit='true']") && parentObj.get(0) != document.body){
            parentObj = $(parentObj.get(0).parentNode);
        }
        if(parentObj.get(0) == document.body){
            return $("");
        }
        else{
            return parentObj;
        }
    };
    
    
})(jQuery);