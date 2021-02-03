/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：PopMenu
说明：弹出菜单控件
文件：PopMenu.js
依赖文件：jquery-1.6.4.min.js
          HotKeyControl.js
          ToolFunction.js
          TimerControl.js
          
资源文件：PopMenuCss/PopMenu.css
          PopMenuImg/
-----------------------*/

;(function($) {
    //全局变量
    $.CurrentShowPopMenu = null;  //当前正在显示的菜单
    $.HasBindPopMenuHotKey = false;  //是否已绑定菜单快捷键    

    //菜单的默认创建参数
    $.PopMenu = new Object();
    $.PopMenu.defaults = {
        //Css样式前缀，可通过改写PopMenu.css来创建多套样式（将PopMenu_替换为自定义的样式类）
        CssBefore : "PopMenu",
        
        //菜单的最小宽度，FixWidth为true时，该参数为固定宽度
        Width : 150,
        
        //是否显示选项图片
        ShowItemPic : true,
        
        //是否显示提示
        ShowTips : true,
        
        //菜单的默认z-index
        zindex : 99,
        
        //显示菜单前执行的函数，传入的参数为menu对象
        BeforeShow : null,
        
        //显示菜单后执行的函数，传入的参数为menu对象
        AfterShow : null,
        
        //隐藏菜单前执行的函数，传入的参数为menu对象
        BeforeHide : null,
        
        //隐藏菜单后执行的函数，传入的参数为menu对象
        AfterHide : null
    };
    
    //菜单标题项的默认创建参数
    $.PopMenuTitlePara = new Object();
    $.PopMenuTitlePara.defaults = {
        //标题文字
        Text : "",
        
        //提示文字
        Tips : "",
        
        //是否显示
        Visibility : true,
        
        //标题图片类型,img-图片url，css-css样式，html-使用html语句内容,dom-dom对象或JQuery对象，none-不设置图片
        TitlePicTyle : "none",
        
        //宽度
        PicWidth:16,
        
        //高度
        PicHeight:16,
        
        //图片或html代码，仅img和html类型时有效
        ImgOrHtml : "",
        
        //dom对象，仅dom时有效
        DomObj : null,
        
        //css样式，仅css时有效
        CssStyle : {}
    };
    
    //菜单项的默认创建参数
    $.PopMenuItemPara = new Object();
    $.PopMenuItemPara.defaults = {
        //选项文字
        Text : "",
        
        //提示文字
        Tips : "",
        
        //是否有子菜单
        HasSubMenu : false,
        
        //子菜单id
        SubMenuId : "",
        
        //是否显示
        Visibility : true,
        
        //是否被屏蔽
        Disable : false,
        
        //菜单快捷键，空代表无快捷键
        HotKey : "",
        
        //菜单是否开启新窗口，如果是，则在菜单项文字结尾自动加上...
        OpenWin : false,
        
        //正常情况下的图片样式
        NormalImg : {
            //选项图片类型,img-图片url，css-css样式，html-使用html语句内容,dom-dom对象或JQuery对象，none-不设置图片
            ItemPicTyle : "none",
            
            //宽度
            PicWidth:16,
            
            //高度
            PicHeight:16,
            
            //图片或html代码，仅img和html类型时有效
            ImgOrHtml : "",
            
            //dom对象，仅dom时有效
            DomObj : null,
            
            //css样式，仅css时有效
            CssStyle : {}
        },
        
        //鼠标移动到的图片样式
        OverImg : {
            //选项图片类型,img-图片url，css-css样式，html-使用html语句内容,dom-dom对象或JQuery对象，none-不设置图片
            ItemPicTyle : "none",
            
            //宽度
            PicWidth:16,
            
            //高度
            PicHeight:16,
            
            //图片或html代码，仅img和html类型时有效
            ImgOrHtml : "",
            
            //dom对象，仅dom时有效
            DomObj : null,
            
            //css样式，仅css时有效
            CssStyle : {}
        },
        
        //屏蔽情况下的图片样式
        DisImg : {
            //选项图片类型,img-图片url，css-css样式，html-使用html语句内容,dom-dom对象或JQuery对象，none-不设置图片
            ItemPicTyle : "none",
            
            //宽度
            PicWidth:16,
            
            //高度
            PicHeight:16,
            
            //图片或html代码，仅img和html类型时有效
            ImgOrHtml : "",
            
            //dom对象，仅dom时有效
            DomObj : null,
            
            //css样式，仅css时有效
            CssStyle : {}
        },
        
        //mouseover事件,传入参数依次为menu对象、选项对象
        MouseOver : null,
        
        //mouseout事件,传入参数依次为menu对象、选项对象
        MouseOut : null,
        
        //click事件,传入参数依次为menu对象、选项对象，该函数可返回是否隐藏菜单,true-自动隐藏菜单，false-不自动隐藏菜单
        Click : null
    };
    
    
    
    //创建一个空的PopMenu控件（还没有菜单项）
    $.CreatePopMenu = function(id,opts){
        //自定义参数
	    opts = $.extend({}, $.PopMenu.defaults, opts || {});
	    
	    //创建菜单控件
	    $(document.body).append("<ul selftype='PopMenu' id='"+id+"' parentMenuId='' class='"+opts.CssBefore+"_ULMain' style='display:none; width:"+opts.Width+"px; z-index:"+opts.zindex+";'></ul>");
	    var ulobj = $("#"+id);
	    
	    //绑定数据
	    ulobj.data("PopMenuOpts",opts);
	    
	    //绑定菜单快捷键
	    if(!$.HasBindPopMenuHotKey){
	        //处理快捷键
	        $.HasBindPopMenuHotKey = true;
	        $(document).bind("keydown",
	            function(){
	                if($.CurrentShowPopMenu == null){
	                    return;
	                }

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
                    
                    //逐一比对当前菜单可用选项的快捷键信息
                    var ItemList = $.CurrentShowPopMenu.children("li:visible[HotKey][PopMenuType='Item']");
                    for(var i = 0;i<ItemList.length;i++){
                        var liobj = $(ItemList.get(i));
                        if(liobj.attr("HotKey") == KeyNum.toString()){
                            PopMenuItemMouseClickReal(liobj);
                            return;
                        }
                    }
	            }
	        ); 
	        
	        //处理鼠标在外面点击的自动隐藏
	        $(document).bind("click",
	            function(){
	                //隐藏所有显示的菜单
	                $("ul:visible[selftype='PopMenu']").PopMenuHide();
	                //设置当前菜单为null
	                $.CurrentShowPopMenu = null;
	                return;
	            }); 
	    }
	    
	    //往菜单上绑定鼠标点击事件，让执行点击时事件不传入document上
	    ulobj.bind("click",function(){return false});
    };
    
    //往菜单控件中添加标题项
    $.fn.AddPopMenuTitle = function(id,titlePara,pos){
        //自定义参数
	    titlePara = $.extend({}, $.PopMenuTitlePara.defaults, titlePara || {});
	    titlePara.CssStyle =  $.extend({}, $.PopMenuTitlePara.defaults.CssStyle, titlePara.CssStyle || {});
	    
	    //逐个对象创建标题
	    for(var i = 0;i<this.length;i++){
	        var ulobj = $(this.get(i));
	        if(ulobj.attr("selftype") != "PopMenu"){
	            //不是菜单项
	            continue;
	        }
	        
	        //显示以保证能获取对象高度
	        PopMenuMoveShow(ulobj);
	        
	        var opts = ulobj.data("PopMenuOpts");
	        var createHtml = "<li id='"+id+"' PopMenuType='Title' class='"+opts.CssBefore+"_LITitle' title='"+(opts.ShowTips?titlePara.Tips:"")+"' title_tips='"+titlePara.Tips+"'><div PopMenuType='TitlePic' class='"+opts.CssBefore+"_DivTitlePic' style='width:"+titlePara.PicWidth+"px;height:"+titlePara.PicHeight+"px;'></div><div PopMenuType='TitleText' class='"+opts.CssBefore+"_DivTitleText'>"+titlePara.Text+"</div></li>";
	        
	        var liobj = null;
	        if(typeof pos == "number" && pos >=0 && pos < ulobj.children().length){
	            //传进了位置
	            ulobj.PopMenuGetItem(parseInt(pos)).before(createHtml);
	            liobj = ulobj.PopMenuGetItem(parseInt(pos));
	        }
	        else{
	            //插入结尾
	            ulobj.append(createHtml);
	            liobj = ulobj.children("#"+id).last();
	        }
	        
	        liobj.data("PopMenuTitlePara",titlePara);
	        
	        //设置样式
	        PopMenuChangeTitleStyle(liobj);
	        
	        //对应隐藏
	        PopMenuMoveBack(ulobj);
	    }
    };
    
    //往菜单控件中添加分隔符
    $.fn.AddPopMenuSplit = function(id,pos){
        //逐个对象创建
	    for(var i = 0;i<this.length;i++){
	        var ulobj = $(this.get(i));
	        if(ulobj.attr("selftype") != "PopMenu"){
	            //不是菜单项
	            continue;
	        }
	        var opts = ulobj.data("PopMenuOpts");
	        var createHtml = "<li id='"+id+"' PopMenuType='Split' class='"+opts.CssBefore+"_LISplit'><DIV PopMenuType='SplitPicBg' class='"+opts.CssBefore+"_DivSplitPicBg'></DIV><DIV PopMenuType='SplitBar' class='"+opts.CssBefore+"_SplitBar'></DIV></li>";
	        
	        var liobj = null;
	        if(typeof pos == "number" && pos >=0 && pos < ulobj.children().length){
	            //传进了位置
	            ulobj.PopMenuGetItem(parseInt(pos)).before(createHtml);
	            liobj = ulobj.PopMenuGetItem(parseInt(pos));
	        }
	        else{
	            //插入结尾
	            ulobj.append(createHtml);
	            liobj = ulobj.children("#"+id).last();
	        }
	        
	        //显示以保证能获取对象高度
	        PopMenuMoveShow(ulobj);
	        
	        //设置内容div的长度
	        PopMenuChangeSplitStyle(liobj);
	        
	        //对应隐藏
	        PopMenuMoveBack(ulobj);
	    }
    };
    
    //往菜单控件中添加选项
    $.fn.AddPopMenuItem = function(id,itemPara,pos){
        //自定义参数
	    itemPara = $.extend({}, $.PopMenuItemPara.defaults, itemPara || {});
	    itemPara.NormalImg =  $.extend({}, $.PopMenuItemPara.defaults.NormalImg, itemPara.NormalImg || {});
	    itemPara.NormalImg.CssStyle =  $.extend({}, $.PopMenuItemPara.defaults.NormalImg.CssStyle, itemPara.NormalImg.CssStyle || {});
	    itemPara.OverImg =  $.extend({}, $.PopMenuItemPara.defaults.OverImg, itemPara.OverImg || {});
	    itemPara.OverImg.CssStyle =  $.extend({}, $.PopMenuItemPara.defaults.OverImg.CssStyle, itemPara.OverImg.CssStyle || {});
	    itemPara.DisImg =  $.extend({}, $.PopMenuItemPara.defaults.DisImg, itemPara.DisImg || {});
	    itemPara.DisImg.CssStyle =  $.extend({}, $.PopMenuItemPara.defaults.DisImg.CssStyle, itemPara.DisImg.CssStyle || {});
	    
	    //逐个对象创建标题
	    for(var i = 0;i<this.length;i++){
	        var ulobj = $(this.get(i));
	        if(ulobj.attr("selftype") != "PopMenu"){
	            //不是菜单项
	            continue;
	        }
	        
	        //显示以保证能获取对象高度
	        PopMenuMoveShow(ulobj);
	        
	        var opts = ulobj.data("PopMenuOpts");
	        
	        var createHtml = "<li id='"+id+"' PopMenuType='Item' class='"+opts.CssBefore+"_LIItem' title='"+(opts.ShowTips?itemPara.Tips:"")+"' title_tips='"+itemPara.Tips+"'"+(itemPara.HotKey != ""?" HotKey='"+HotKeyControl_GetCode(itemPara.HotKey)+"'":"")+" mover='false'>"
	                        +"<DIV PopMenuType='ItemPicBg' class='"+opts.CssBefore+"_DivItemPicBg'></DIV>"
	                        +"<DIV PopMenuType='ItemBgDiv' class='"+opts.CssBefore+"_DivItemBgDiv'>"
	                            +"<DIV PopMenuType='ItemPic' class='"+opts.CssBefore+"_DivItemPic'></DIV>"
	                            +"<DIV PopMenuType='ItemText' class='"+opts.CssBefore+"_DivItemText'>"+itemPara.Text + (itemPara.HotKey != ""?"("+itemPara.HotKey.toUpperCase()+")":"") + (itemPara.OpenWin?"...":"") +"</DIV>"
	                            +"<DIV PopMenuType='ItemTail' class='"+opts.CssBefore+"_DivItemTail'></DIV>"
	                        +"</DIV></li>";
	        
	        var liobj = null;
	        if(typeof pos == "number" && pos >=0 && pos < ulobj.children().length){
	            //传进了位置
	            ulobj.PopMenuGetItem(parseInt(pos)).before(createHtml);
	            liobj = ulobj.PopMenuGetItem(parseInt(pos));
	        }
	        else{
	            //插入结尾
	            ulobj.append(createHtml);
	            liobj = ulobj.children("#"+id).last();
	        }
	        
	        liobj.data("PopMenuItemPara",itemPara);
	        
	        //divbg的高度
	        var divbg = liobj.children("[PopMenuType='ItemBgDiv']");

	        //设置图片和样式
	        PopMenuChangeItemStyle(liobj,itemPara.Disable?"disable":"normal");
 
	        //设置是否显示图片
	        if(!opts.ShowItemPic){
	            liobj.children("[PopMenuType='ItemPicBg']").hide();
	            divbg.children("[PopMenuType='ItemPic']").hide();
	        }
	        
	        //对应隐藏
	        PopMenuMoveBack(ulobj);
	        
	        //绑定mouseover和mouseout和click事件
	        liobj.bind("mouseover",PopMenuItemMouseOver);
	        liobj.bind("mouseout",PopMenuItemMouseOut);
	        liobj.bind("click",PopMenuItemMouseClick);
	        
	        //最终判断是否显示
	        if(!itemPara.Visibility){
	            liobj.hide();
	        }
	    }
    };
    
    //显示菜单
    $.fn.PopMenuShow = function(x,y){
        for(var i = 0;i<this.length;i++){
            var liobj = $(this.get(i));
            var opts = liobj.data("PopMenuOpts");
            if(x !== undefined){
                liobj.css("left",x+"px");
            }
            if(y !== undefined){
                liobj.css("top",y+"px");
            }
            if(liobj.is(":hidden")){
                //隐藏情况，显示出来，并设置为当前菜单
                if(opts.BeforeShow != null){
                    try{
                        opts.BeforeShow(liobj);
                    }catch(e){;}
                }
                liobj.show();
                $.CurrentShowPopMenu = liobj;
                if(opts.AfterShow != null){
                    try{
                        opts.AfterShow(liobj);
                    }catch(e){;}
                }
            }
        }
    };
    
    //隐藏菜单
    $.fn.PopMenuHide = function(){
        for(var i = 0;i<this.length;i++){
            var liobj = $(this.get(i));
            if(liobj.attr("selftype") != "PopMenu"){
                continue;
            }
            
            var opts = liobj.data("PopMenuOpts");
            if(liobj.is(":visible")){
                //隐藏前事件
                if(opts.BeforeHide != null){
                    try{
                        opts.BeforeHide(liobj);
                    }catch(e){;}
                }
                
                //对当前选项执行mouseout事件
                $.PopMenuItemMouseOutReal(liobj.children("[mover='true']"),true);
                
                //隐藏自身
                liobj.hide();
                
                //判断是否需修改当前菜单项
                if($.CurrentShowPopMenu != null && $.CurrentShowPopMenu.get(0) == liobj.get(0)){
                    var curobj = liobj;
                    while(true){
                        if(curobj.attr("parentMenuId") == ""){
                            //没有上级菜单
                            $.CurrentShowPopMenu = null;
                            break;
                        }
                        
                        curobj = $("#"+curobj.attr("parentMenuId"));
                        if(curobj.length != 1 || !curobj.is("ul[selftype='PopMenu']")){
                            //没有上级菜单
                            $.CurrentShowPopMenu = null;
                            break;
                        }
                        
                        if(curobj.is(":visible")){
                            //上级菜单有显示
                            $.CurrentShowPopMenu = curobj;
                            break;
                        }
                    }
                }
                
                //隐藏后事件
                if(opts.AfterHide != null){
                    try{
                        opts.AfterHide(liobj);
                    }catch(e){;}
                }
            }
        }
    };
    
    //修改菜单的显示参数
    $.fn.PopMenuChangePara = function(opts){
        for(var i = 0;i<this.length;i++){
            var ulobj = $(this.get(i));
            if(ulobj.attr("selftype") != "PopMenu"){
                continue;
            }
            
            //自定义参数
            var oldopts = ulobj.data("PopMenuOpts");
            var newopts = $.extend({}, oldopts, opts || {});
            
            ulobj.data("PopMenuOpts",newopts);
            
            //开始逐个参数处理
            if(oldopts.CssBefore != newopts.CssBefore){
                //修改菜单及所有选项的CSS样式前缀
                ulobj.find("[PopMenuType]").andSelf().addClass(function(index, cssClass) {
                    return cssClass.replace(oldopts.CssBefore+"_",newopts.CssBefore+"_");
                });
            }
            
            //zindex
            if(oldopts.zindex != newopts.zindex){
                //修改菜单及子菜单的zindex
                ulobj.css("z-index",newopts.zindex);
                //递归修改子菜单的z-index
                $("ul[selftype='PopMenu'][parentMenuId='"+ulobj.attr("id")+"']").PopMenuChangePara({zindex:newopts.zindex+1});
            }
            
            //菜单宽度
            if(oldopts.Width != newopts.Width){
                ulobj.css("width",newopts.Width + "px");
            }
            
            //是否显示提示
            if(oldopts.ShowTips != newopts.ShowTips){
                if(newopts.ShowTips){
                    //显示提示
                    ulobj.children("li[title_tips]").attr("title",function(index,attr){return $(this).attr("title_tips");});
                }
                else{
                    //隐藏提示
                    ulobj.children("li[title]").attr("title","");
                }
            }
            
            //是否显示选项图片
            if(oldopts.ShowItemPic != newopts.ShowItemPic){
                var liobjs = ulobj.children("li[PopMenuType='Item']");
                var lisplit = ulobj.children("li[PopMenuType='Split']");
                if(newopts.ShowItemPic){
                    //显示选项图片
                    liobjs.children("[PopMenuType='ItemPicBg']").show();
                    liobjs.children("[PopMenuType='ItemBgDiv']").children("[PopMenuType='ItemPic']").show();
                    lisplit.children("[PopMenuType='SplitPicBg']").show();
                }
                else{
                    //隐藏选项图片
                    liobjs.children("[PopMenuType='ItemPicBg']").hide();
                    liobjs.children("[PopMenuType='ItemBgDiv']").children("[PopMenuType='ItemPic']").hide();
                    lisplit.children("[PopMenuType='SplitPicBg']").hide();
                }
            }
            
            //判断是否需修改选项样式
            if(oldopts.CssBefore != newopts.CssBefore || oldopts.Width != newopts.Width || oldopts.ShowItemPic != newopts.ShowItemPic){
                //显示以保证能获取对象高度
	            PopMenuMoveShow(ulobj);
    	        
                //变更样式
                var items = ulobj.children("li");
                for(var j = 0;j<items.length;j++){
                    var liobj = $(items.get(j));
                    switch(liobj.attr("PopMenuType")){
                        case "Title":
                            PopMenuChangeTitleStyle(liobj);
                            break;
                        case "Split":
                            //设置内容div的长度
                            PopMenuChangeSplitStyle(liobj);
                            break;
                        case "Item":
                            var itemPara = liobj.data("PopMenuItemPara");
                            //设置图片和样式
	                        PopMenuChangeItemStyle(liobj,itemPara.Disable?"disable":"normal");
                            break;
                        default :
                            break;
                    }
                }
                
                //对应隐藏
	            PopMenuMoveBack(ulobj);
            }
        }
    };
    
    //删除菜单及子菜单
    $.fn.PopMenuDel = function(){
        for(var i = 0;i<this.length;i++){
            var ulobj = $(this.get(i));
            if(ulobj.attr("selftype") != "PopMenu"){
                continue;
            }
            if(ulobj.is(":visible")){
                //显示状态，先隐藏
                ulobj.PopMenuHide();
            }
            //递归删除该菜单的子菜单
            $("ul:[selftype='PopMenu'][parentMenuId='"+ulobj.attr("id")+"']").PopMenuDel();
            
            //删除自身
            ulobj.remove();
        }
    };
    
    //获取菜单的指定选项对象(通过索引或id)
    $.fn.PopMenuGetItem = function(indexOrId){
        var items = $("");
        for(var i = 0;i<this.length;i++){
            var ulobj = $(this.get(i));
            if(ulobj.attr("selftype") != "PopMenu"){
                //不是菜单类型
                continue;
            }
            
            if(typeof indexOrId == "string"){
                //通过id方式获取
                items = items.add(ulobj.children("#"+indexOrId));
            }
            else{
                //通过索引获取
                indexOrId = parseInt(indexOrId);
                if(isNaN(indexOrId)){
                    //不是有效的数字
                    continue;
                }
                var liobjs = ulobj.children();
                if(indexOrId >= 0 && indexOrId < liobjs.length){
                    items = items.add($(liobjs.get(indexOrId)));
                }
            }
        }
        //返回集合的对象组
        return items;
    };
    
    //删除指定的选项及其子菜单
    $.fn.PopMenuItemDel = function(delSubMenu){
        if(typeof delSubMenu != "boolean"){
            delSubMenu = true;
        }
        
        //循环处理删除
        for(var i = 0;i<this.length;i++){
            var liobj = $(this.get(i));
            if(!liobj.is("li[PopMenuType]")){
                //非item类型
                continue;
            }
            switch(liobj.attr("PopMenuType")){
                case "Title":
                case "Split":
                    //非Item类型，直接删除
                    liobj.remove();
                    break;
                case "Item":
                    //Item类型，处理子菜单
                    var itemPara = liobj.data("PopMenuItemPara");
                    if(itemPara.HasSubMenu){
                        //有子菜单
                        var submenu = $("#"+itemPara.SubMenuId);
                        if(submenu.length == 1 && submenu.is("ul[selftype='PopMenu']")){
                            if(submenu.is(":visible")){
                                //显示状态，先隐藏
                                submenu.PopMenuHide();
                            }
                            if(delSubMenu){
                                //删除子菜单
                                submenu.PopMenuDel();
                            }
                            else{
                                //不删除子菜单，仅将子菜单的父级菜单设置为空
                                submenu.attr("parentMenuId","");
                            }
                        }
                    }
                    //删除对象
                    liobj.remove();
                    break;
                default :
                    break;
            }
        }
    };
    
    //将指定菜单项设置为启用或禁用(仅Item类型适用)
    $.fn.PopMenuItemEnable = function(isEnable){
        if(typeof isEnable != "boolean"){
            isEnable = true;
        }
        //循环处理
        for(var i = 0;i<this.length;i++){
            var liobj = $(this.get(i));
            if(!liobj.is("li[PopMenuType='Item']")){
                //非item类型
                continue;
            }
            var itemPara = liobj.data("PopMenuItemPara");
            if(!itemPara.Disable == isEnable){
                //要修改的状态与当前状态一致
                continue;
            }
            //修改绑定的参数
            itemPara.Disable = !isEnable;
            liobj.data("PopMenuItemPara",itemPara);
            
            var status = "normal";
            
            if(!isEnable){
                //屏蔽情况，要执行鼠标移出
                if(liobj.attr("mover") == "true"){
                    //mouseover状态,先移出
                    $.PopMenuItemMouseOutReal(liobj,true);
                }
                status = "disable";
            }
            
            var ulobj = $(liobj.get(0).parentNode);
            
            //显示以保证能获取对象高度
	        PopMenuMoveShow(ulobj);
	        
            //变更样式
            PopMenuChangeItemStyle(liobj,status);
            
            //对应隐藏
	        PopMenuMoveBack(ulobj);
        }
    };
    
    //将指定菜单项设置为显示或隐藏
    $.fn.PopMenuItemVisible = function(isShow){
        if(typeof isShow != "boolean"){
            isShow = true;
        }
        
        //循环处理
        for(var i = 0;i<this.length;i++){
            var liobj = $(this.get(i));
            if(!liobj.is("li[PopMenuType]")){
                //非item类型
                continue;
            }
            
            if(isShow == (liobj.css("display") != "none")){
                //显示状态一致
                continue;
            }
            
            switch(liobj.attr("PopMenuType")){
                case "Split":
                    if(isShow)
                        liobj.css("display","block");
                    else
                        liobj.css("display","none");
                    break;
                case "Title":
                    var titlePara = liobj.data("PopMenuTitlePara");
                    titlePara.Visibility = isShow;
                    liobj.data("PopMenuTitlePara",titlePara);
                    
                    if(isShow)
                        liobj.css("display","block");
                    else
                        liobj.css("display","none");
                    break;
                case "Item":
                    //Item类型，处理子菜单
                    var itemPara = liobj.data("PopMenuItemPara");
                    itemPara.Visibility = isShow;
                    liobj.data("PopMenuItemPara",itemPara);
                    
                    if(!isShow){
                        //隐藏子菜单
                        if(itemPara.HasSubMenu){
                            //有子菜单
                            var submenu = $("#"+itemPara.SubMenuId);
                            if(submenu.length == 1 && submenu.is("ul[selftype='PopMenu']")){
                                if(submenu.is(":visible")){
                                    //显示状态，先隐藏
                                    submenu.PopMenuHide();
                                }
                            }
                        }
                    }
                    
                    if(isShow)
                        liobj.css("display","block");
                    else
                        liobj.css("display","none");
                    break;
                default :
                    break;
            }
        }
    };
    
    //对选项添加或移除子菜单
    $.fn.PopMenuSub = function(isAdd,subMenuId){
        if(this.length == 0 || isAdd === undefined || (isAdd && typeof subMenuId != "string")){
            //参数错误
            return;
        }
        
        var liobj = $(this.get(0));
        
        if(isAdd)
            liobj.PopMenuItemChangePara({HasSubMenu:true,SubMenuId:subMenuId});
        else
            liobj.PopMenuItemChangePara({HasSubMenu:false,SubMenuId:""});
    };
    
    //修改选项的创建参数
    $.fn.PopMenuItemChangePara = function(changeItemPara){
        //循环处理
        for(var i = 0;i<this.length;i++){
            var liobj = $(this.get(i));
            if(!liobj.is("li[PopMenuType='Item']")){
                //非item类型
                continue;
            }
            var ulobj = $(liobj.get(0).parentNode);
            
            //处理参数
            var oldItemPara = liobj.data("PopMenuItemPara");
            var newItemPara = changeItemPara;
            newItemPara = $.extend({}, oldItemPara, newItemPara || {});
	        newItemPara.NormalImg =  $.extend({}, oldItemPara.NormalImg, newItemPara.NormalImg || {});
	        newItemPara.NormalImg.CssStyle =  $.extend({}, oldItemPara.NormalImg.CssStyle || {}, newItemPara.NormalImg.CssStyle || {});
	        newItemPara.OverImg =  $.extend({}, oldItemPara.OverImg || {}, newItemPara.OverImg || {});
	        newItemPara.OverImg.CssStyle =  $.extend({}, oldItemPara.OverImg.CssStyle, newItemPara.OverImg.CssStyle || {});
	        newItemPara.DisImg =  $.extend({}, oldItemPara.DisImg, newItemPara.DisImg || {});
	        newItemPara.DisImg.CssStyle =  $.extend({}, oldItemPara.DisImg.CssStyle || {}, newItemPara.DisImg.CssStyle || {});
	        
	        //保存新参数
	        liobj.data("PopMenuItemPara",newItemPara);
	        
	        //清除原来的子菜单关系
	        if(oldItemPara.HasSubMenu && (!newItemPara.HasSubMenu || newItemPara.SubMenuId != oldItemPara.SubMenuId)){
	            var subMenuObj = $("#"+oldItemPara.SubMenuId);
	            if(subMenuObj.length == 1 && subMenuObj.is("ul[selftype='PopMenu'][parentMenuId='"+ulobj.attr("id")+"']")){
	                subMenuObj.attr("parentMenuId","");
	            }
	        }
	        
	        //添加新的子菜单关系
	        if(newItemPara.HasSubMenu && (!oldItemPara.HasSubMenu || newItemPara.SubMenuId != oldItemPara.SubMenuId)){
	            var newSubMenuObj = $("#"+newItemPara.SubMenuId);
	            if(newSubMenuObj.length == 1 && newSubMenuObj.is("ul[selftype='PopMenu']")){
	                //清除要添加的子菜单的原来关系
	                var lastParentMenuID = newSubMenuObj.attr("parentMenuId");
	                if(lastParentMenuID !== undefined && lastParentMenuID != ""){
	                    var tempPMenu = $("#"+lastParentMenuID);
	                    var changelist = tempPMenu.children("[PopMenuType='Item']");
	                    for(var j = 0;j<changelist.length;j++){
	                        var tempobj = $(changelist.get(j));
	                        var tempPara = tempobj.data("PopMenuItemPara");
	                        if(tempPara.HasSubMenu && tempPara.SubMenuId == newSubMenuObj.attr("id") && changelist.get(j) != liobj.get(0)){
	                            tempPara.HasSubMenu = false;
	                            tempPara.SubMenuId = "";
	                            tempobj.data("PopMenuItemPara",tempPara);
	                            //变更样式
	                            if(!tempPara.Disable){
	                                PopMenuMoveShow(tempPMenu);
	                                PopMenuChangeItemStyle(tempobj,"normal");
	                                PopMenuMoveBack(tempPMenu);
	                            }
	                            break;
	                        }
	                    }
	                }
	                newSubMenuObj.attr("parentMenuId",ulobj.attr("id"));
	            }
	        }
	        
	        
	        //显示以保证能获取对象高度
	        PopMenuMoveShow(ulobj);

	        //重新设置样式
	        PopMenuChangeItemStyle(liobj,newItemPara.Disable?"disable":"normal");
	        
	        //对应隐藏
	        PopMenuMoveBack(ulobj);
        }
    };
    
    //修改标题选项的创建参数
    $.fn.PopMenuTitleChangePara = function(changeTitlePara){
        //循环处理
        for(var i = 0;i<this.length;i++){
            var liobj = $(this.get(i));
            if(!liobj.is("li[PopMenuType='Title']")){
                //非Title类型
                continue;
            }
            
            //处理参数
            var oldTitlePara = liobj.data("PopMenuTitlePara");
            var newTitlePara = changeTitlePara;
            var newTitlePara = $.extend({}, oldTitlePara, newTitlePara || {});
	        newTitlePara.CssStyle =  $.extend({},oldTitlePara.CssStyle, newTitlePara.CssStyle || {});
	        
	        //保存新参数
	        liobj.data("PopMenuTitlePara",newTitlePara);
	        
	        var ulobj = $(liobj.get(0).parentNode);
	        
	        //显示以保证能获取对象高度
	        PopMenuMoveShow(ulobj);
	        
	        //修改样式
	        PopMenuChangeTitleStyle(liobj);
	        
	        //对应隐藏
	        PopMenuMoveBack(ulobj);
        }
    };
    
    
    //内部函数
    
    //为避免再同个选项上移动时频繁的mouseover事件，用Timer的方式处理
    //真正的mouseover函数,传入选项对象
    $.PopMenuItemMouseOverReal = function(liobj){
        var itemPara = liobj.data("PopMenuItemPara");
        if(liobj.attr("mover") == "true"){
            //本身已经是over状态
            return;
        }
        
        if(itemPara.Disable){
            //屏蔽，将当前选中的项执行mouseout事件
            $.PopMenuItemMouseOutReal($(liobj.get(0).parentNode).children("[mover='true']"),true);
            return;
        }
        
        //菜单属性
        var ulobj = $(liobj.get(0).parentNode);
        var opts = ulobj.data("PopMenuOpts");
        
        //将当前选中的项执行mouseout事件
        $.PopMenuItemMouseOutReal(ulobj.children("[mover='true']"),true);
        
        //设置为mouseover状态
        liobj.attr("mover","true");
        
        //先执行样式变化
        PopMenuChangeItemStyle(liobj,"over");
        
        //如果有子菜单，则执行子菜单的弹出显示
        if(itemPara.HasSubMenu){
            //先判断是否有子对象
            var submenu = $("#"+itemPara.SubMenuId);
            if(submenu.length == 1 && submenu.is(":hidden[selftype='PopMenu'][parentMenuId='"+ulobj.attr("id")+"']")){
                //先判断位置
                var leftpos = liobj.getElementPos();
                
                var submenuWidth = submenu.outerWidth();
                var submenuHeight = submenu.outerHeight();
                
                //正常的位置
                var posleft = leftpos.x + opts.Width - parseInt(ulobj.css("border-right-width")) - 4;
                var postop = leftpos.y;
                
                //判断x位置+子菜单大小是否会超过屏幕
                var winsize = $.getWindowSize();
                var windowswidth = Math.max($(document).width(),winsize.width);
                var windowsheight = Math.max($(document).height(),winsize.height);
                if( posleft + submenuWidth > windowswidth){
                    //转到左边显示
                    posleft = leftpos.x - submenuWidth + 2;
                }
                if(postop + submenuHeight > windowsheight){
                    //往上移动
                    postop -= (postop + submenuHeight - windowsheight);
                }
                
                //根据位置弹出菜单
                submenu.PopMenuShow(posleft,postop);
            }
        }
        
        //开始执行自定义事件
        if(itemPara.MouseOver != null){
            try{
                itemPara.MouseOver(ulobj,liobj);
            }catch(e){;}
        }  
        
    };
    
    //鼠标移到选项上执行的事件
    function  PopMenuItemMouseOver(){
        //清除当前项的mouseout定时器
        var itemid = $(this).attr("id");
        var menuid = $(this.parentNode).attr("id");
        $.ClearTimer("PopMenuOut_"+menuid+"_"+itemid);
        
        if($(this).attr("mover") == "false"){
            $.PopMenuItemMouseOverReal($(this));
        }
    };
    
    //真正的mouseout函数,传入选项对象
    $.PopMenuItemMouseOutReal = function(liobj,noevent){
        if(liobj.length != 1){
            return;
        }
        
        if(noevent === undefined){
            noevent = false;
        }
        
        var itemPara = liobj.data("PopMenuItemPara");
        var ulobj = $(liobj.get(0).parentNode);
        if(itemPara.Disable || ulobj.is(":hidden")){
            //屏蔽不处理,隐藏了也不处理
            return;
        }
        
        //如果是有子菜单，不处理mouseout事件（外部调用则处理）
        if(!noevent && itemPara.HasSubMenu){
            return;
        }
        
        //设置为mouseout状态
        liobj.attr("mover","false");
        
        //关闭自身的子菜单
        if(itemPara.HasSubMenu){
            var submenu = $("#"+itemPara.SubMenuId);
            if(submenu.length == 1 && submenu.is(":visible[selftype='PopMenu'][parentMenuId='"+ulobj.attr("id")+"']")){
                submenu.PopMenuHide();
            }
        }
        
        //先执行样式变化
        PopMenuChangeItemStyle(liobj,"normal");
        
        
        //执行自定义事件
        if(itemPara.MouseOut != null){
            try{
                itemPara.MouseOut(ulobj,liobj);
            }catch(e){;}
        }  
    };
    
    //鼠标移出时执行的函数
    function PopMenuItemMouseOut(){
        var itemid = $(this).attr("id");
        var menuid = $(this.parentNode).attr("id"); 
        js = "$.AddTimer(\"PopMenuOut_"+menuid+"_"+itemid+"\",function(){$.PopMenuItemMouseOutReal($('#"+menuid+"').children('#"+itemid+"'));},10);";
        eval(js);
    };
    
    //在选项上点击鼠标执行的函数
    function PopMenuItemMouseClickReal(liobj){
        var itemPara = liobj.data("PopMenuItemPara");
        var ulobj = $(liobj.get(0).parentNode);
        
        //执行自定义事件
        var autoHide = true;
        
        //如果有子菜单的情况
        if(itemPara.HasSubMenu){
            autoHide = false; //默认点击不自动隐藏
            //调用mouseover弹出子菜单
            $.PopMenuItemMouseOverReal(liobj);
        }
        
        if(itemPara.Click != null){
            try{
                autoHide = itemPara.Click(ulobj,liobj);
            }catch(e){;}
        }
        
        if(autoHide){
            //自动隐藏当前菜单及其父菜单
            var parentID = ulobj.attr("parentMenuId")
            while(true){
                if(parentID !== undefined && parentID != ""){
                    //有父菜单
                    var parenobj = $("#"+parentID);
                    if(parenobj.length == 1 && parenobj.is(":visible[selftype='PopMenu']")){
                        ulobj = parenobj;
                        parentID = ulobj.attr("parentMenuId");
                    }
                    else{
                        //父菜单参数不对，隐藏自身
                        ulobj.PopMenuHide();
                        break;
                    }
                }
                else{
                    //没有父菜单，隐藏
                    ulobj.PopMenuHide();
                    break;
                }
            }
        }
    };
    
    //在选项上点击鼠标执行的函数
    function PopMenuItemMouseClick(){
        PopMenuItemMouseClickReal($(this));
        //不将点击鼠标事件传到上一层
        return false;
    };
    
    //根据参数和状态改变选项的样式,liobj－选项的li对象，status－状态，normal,over,disable
    function PopMenuChangeItemStyle(liobj,status){
        var opts = $(liobj.get(0).parentNode).data("PopMenuOpts");
        var itemPara = liobj.data("PopMenuItemPara");
        var divbg = liobj.children("[PopMenuType='ItemBgDiv']");
        var divpic = divbg.children("[PopMenuType='ItemPic']");
        var divtext = divbg.children("[PopMenuType='ItemText']");
        var divtail = divbg.children("[PopMenuType='ItemTail']");
        
        liobj.show();
        
        //移除所有类
        divbg.removeClass();
        divpic.removeClass();
        divtext.removeClass();
        divtail.removeClass();
       
        //选项文字
        divtext.get(0).innerHTML = itemPara.Text + (itemPara.HotKey != ""?"("+itemPara.HotKey.toUpperCase()+")":"") + (itemPara.OpenWin?"...":"");
        liobj.attr("HotKey",HotKeyControl_GetCode(itemPara.HotKey));
        liobj.attr("title_tips",itemPara.Tips);
        liobj.attr("title",(opts.ShowTips?itemPara.Tips:""));
                
        //设置图片的变量
        var picstyle;
        
        if(status == "over"){
            //mouseover
            divbg.addClass(opts.CssBefore+"_DivItemBgDiv_Over");
            divpic.addClass(opts.CssBefore+"_DivItemPic_Over");
            divtext.addClass(opts.CssBefore+"_DivItemText_Over");
            divtail.addClass(opts.CssBefore+"_DivItemTail_Over");
            //换图片
            picstyle = itemPara.OverImg;
        }
        else if(status == "disable"){
            //屏蔽
            divbg.addClass(opts.CssBefore+"_DivItemBgDiv");
            divpic.addClass(opts.CssBefore+"_DivItemPic_Dis");
            divtext.addClass(opts.CssBefore+"_DivItemText_Dis");
            divtail.addClass(opts.CssBefore+"_DivItemTail");
            //换图片
            picstyle = itemPara.DisImg;
            //是否显示tail
            divtail.hide();
        }
        else{
            //normal
            divbg.addClass(opts.CssBefore+"_DivItemBgDiv");
            divpic.addClass(opts.CssBefore+"_DivItemPic");
            divtext.addClass(opts.CssBefore+"_DivItemText");
            divtail.addClass(opts.CssBefore+"_DivItemTail");
            //换图片
            picstyle = itemPara.NormalImg;
        }
                
        //重新设置divbg的css样式
        var divbgBorderTop = parseInt(divbg.css("border-top-width"));
        if(isNaN(divbgBorderTop))
            divbgBorderTop = 0;
            
        var divbgBorderBottom = parseInt(divbg.css("border-bottom-width"));
        if(isNaN(divbgBorderBottom))
            divbgBorderBottom = 0;
            
        var divbgBorderLeft = parseInt(divbg.css("border-left-width"));
        if(isNaN(divbgBorderLeft))
            divbgBorderLeft = 0;
            
        var divbgBorderRight = parseInt(divbg.css("border-right-width"));
        if(isNaN(divbgBorderRight))
            divbgBorderRight = 0;
            
        var divbgheight = liobj.height() - 4  - divbgBorderTop - divbgBorderBottom;
        divbg.css({height:divbgheight+"px",top:"2px"});
        if(!opts.ShowItemPic){
            divbg.css({left:"2px",width:(opts.Width - 4 - divbgBorderLeft - divbgBorderRight)+"px"});
        }
        else{
            //处理图片的样式
            divpic.empty();
            //改变大小
            divpic.css({width:picstyle.PicWidth+"px",height:picstyle.PicHeight+"px"});
            switch(picstyle.ItemPicTyle){
                case "html":
                    divpic.append(picstyle.ImgOrHtml);
                    break;
                case "css":
                    divpic.css(picstyle.CssStyle);
                    break;
                case "dom":
                    divpic.append(picstyle.DomObj);
                    break;
                case "img":
                    divpic.css("background-image","url("+picstyle.ImgOrHtml+")");
                    break;
                default:
                    //none
                    divpic.css("background-image","none");
                    break;
            }
            
            //ItemBgDiv的位置，宽度
            var picbgwidth = liobj.children("[PopMenuType='ItemPicBg']").outerWidth(true);
            divbg.css({left:(2-picbgwidth)+"px",width:(opts.Width - 4 - divbgBorderLeft -divbgBorderRight)+"px"});
           //重新设置图片位置
           var divpicouterwidth = divpic.outerWidth();
           divpic.css({"margin-left":Math.ceil((picbgwidth-divpicouterwidth)/2)-3-divbgBorderLeft+"px","margin-right":Math.ceil((picbgwidth-divpicouterwidth)/2)+"px","margin-top":Math.ceil((divbgheight - divpic.outerHeight())/2) + "px"});
        }
        //重新设置文字的上下位置
        divtext.css({"margin-top":Math.ceil((divbgheight - divtext.outerHeight())/2) + "px"});
        //tail
        if(itemPara.HasSubMenu && status != "disable"){
            divtail.show(); 
            //计算margin-top:
            divtail.css("margin-top",Math.ceil((divbg.height() - divtail.outerHeight())/2)-divbgBorderTop+"px");
        }
        else{
            divtail.hide();
        }
        
        if(!itemPara.Visibility){
            liobj.hide();
        }
        else{
            liobj.show();
        }
    };
    
    //如果menu为隐藏状态，添加选项时无法得到新增对象，因此通过这两个函数将对象移到窗体外显示，再移回来隐藏
    function PopMenuMoveShow(ulobj){
        if(ulobj.is(":visible")){
            //已经显示了，不处理
            return;
        }
        //保留历史位置信息
        ulobj.attr("templeft",ulobj.css("left"));
        ulobj.attr("temptop",ulobj.css("top"));
        //修改到左上外边，并显示
        ulobj.css({left:"-1000px",top:"-1000px",display:"block"});
    };
    
    function PopMenuMoveBack(ulobj){
        if(ulobj.is(":hidden") || !ulobj.is("[templeft]")){
            //已经隐藏了，或者没有记录临时信息
            return;
        }
        //隐藏并恢复位置
        ulobj.css({left:ulobj.attr("templeft"),top:ulobj.attr("temptop"),display:"none"});
        //删除历史位置信息
        ulobj.removeAttr("templeft");
        ulobj.removeAttr("temptop");
    };
    
    function PopMenuChangeSplitStyle(liobj){
        var opts = $(liobj.get(0).parentNode).data("PopMenuOpts");
        var isshow = true;
        if(liobj.css("display") == "none"){
            isshow = false;
            liobj.show();
        }
        var len = opts.Width;
        var divbar = liobj.children("[PopMenuType='SplitBar']");
        var divpic = liobj.children("[PopMenuType='SplitPicBg']");
        len = len - parseInt(divbar.css("margin-left").replace("px",""))*2;
        
        //如果菜单不显示图片，隐藏图片背景
        if(opts.ShowItemPic){
            len = len - divpic.outerWidth(true);
            divpic.css("display","block");
        }
        else{
            divpic.css("display","none");
        }
        divbar.css("width",len + "px");
        
        if(!isshow){
            liobj.hide();
        }
    };
    
    function PopMenuChangeTitleStyle(liobj){
        //显示图片
        var titlePara = liobj.data("PopMenuTitlePara");
        
        liobj.show();
        
        var divpic = liobj.children("div[PopMenuType='TitlePic']");
        var divtext = liobj.children("div[PopMenuType='TitleText']");
        
        //清除原来的样式
        divpic.empty();
        divpic.css({width:titlePara.PicWidth+"px",height:titlePara.PicHeight+"px","background-image":"none"});
        
        var liHeight = liobj.height();//选项的高度
        
        //是否显示图片
        if(titlePara.TitlePicTyle != "none"){
            divpic.show();
            //设置图片的样式
            switch(titlePara.TitlePicTyle){
                case "html":
                    divpic.append(titlePara.ImgOrHtml);
                    break;
                case "css":
                    divpic.css(titlePara.CssStyle);
                    break;
                case "dom":
                    divpic.append(titlePara.DomObj);
                    break;
                default:
                    //img
                    divpic.css("background-image","url("+titlePara.ImgOrHtml+")");
                    break;
            }
             //控制位置
            divpic.css({"margin-left":"3px","margin-top":Math.ceil((liHeight-divpic.outerHeight())/2)+"px"});
        }
        else{
            divpic.hide();
        }
        
        //文本
        divtext.css({"margin-left":"3px","margin-top":Math.ceil((liHeight-divtext.outerHeight())/2)+"px"});
        
        if(!titlePara.Visibility){
            liobj.hide();
        }
        else{
            liobj.show();
        }
    };

})(jQuery);