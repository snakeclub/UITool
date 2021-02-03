/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：TextBox
说明：输入框美化控件
文件：TextBox.js
依赖文件：jquery-1.6.4.min.js
          
资源文件：
-----------------------*/

;(function($) {
    //--TextBoxStyle begin--

    //全局变量,记录样式
    $.TextBoxStyleArray = new Array(0);
    
    //TextBoxStyle的默认样式参数
    $.TextBoxStyle = new Object();
    $.TextBoxStyle.defaults = {
        //正常样式
        Normal : {
            //样式类型,none - 无样式，class - css类名, css - css样式表
            StyleType : "css",
            
            //是否清除原来的样式,例如在Normal切换到Focus时，若Focus的这个参数为true，会根据Normal的样式类型进行原样式的清除，例如清空ClassName或将对应的CssStyle的项清空为默认值
            ClearStyle : true,
            
            //需要设置的css类名，可以用空格分隔，或者是返回类名的函数，传入的参数依次为obj、对象原先的class属性值
            ClassName : "",
            
            //css样式
            CssStyle : {
                "background-color" : "Green"
            }
        },
        
        //获得焦点时的样式
        Focus : {
            //样式类型,none - 无样式，class - css类名, css - css样式表
            StyleType : "css",
            
            //是否清除原来的样式,例如在Normal切换到Focus时，若Focus的这个参数为true，会根据Normal的样式类型进行原样式的清除，例如清空ClassName或将对应的CssStyle的项清空为默认值
            ClearStyle : true,
            
            //需要设置的css类名，可以用空格分隔，或者是返回类名的函数，传入的参数依次为obj、对象原先的class属性值
            ClassName : "",
            
            //css样式
            CssStyle : {
                "background-color" : "Yellow"
            }
        },
        
        //屏蔽时的样式
        Disable : {
            //样式类型,none - 无样式，class - css类名, css - css样式表
            StyleType : "css",
            
            //是否清除原来的样式,例如在Normal切换到Focus时，若Focus的这个参数为true，会根据Normal的样式类型进行原样式的清除，例如清空ClassName或将对应的CssStyle的项清空为默认值
            ClearStyle : true,
            
            //需要设置的css类名，可以用空格分隔，或者是返回类名的函数，传入的参数依次为JQuery对象、对象原先的class属性值
            ClassName : "",
            
            //css样式
            CssStyle : {
                "background-color" : "Gray"
            }
        },
        
        //警告提示时的样式
        Warning : {
            //样式类型,none - 无样式，class - css类名, css - css样式表
            StyleType : "css",
            
            //是否清除原来的样式,例如在Normal切换到Focus时，若Focus的这个参数为true，会根据Normal的样式类型进行原样式的清除，例如清空ClassName或将对应的CssStyle的项清空为默认值
            ClearStyle : true,
            
            //需要设置的css类名，可以用空格分隔，或者是返回类名的函数，传入的参数依次为JQuery对象、对象原先的class属性值
            ClassName : "",
            
            //css样式
            CssStyle : {
                "background-color" : "Red"
            }
        },
        
        //对象获得焦点时执行的函数,在执行了样式变化后将执行该事件函数，传入参数为JQuery对象,可以考虑在这个函数上增加其他样式的处理
        FocusOn : null,
        
        //对象失去焦点时执行的函数，在执行了样式变化后将执行该事件函数，传入参数为JQuery对象,可以考虑在这个函数上增加其他样式的处理
        FocusOut : null,
        
        //样式变化后执行的函数，传入的参数依次为JQuery对象、变化前的status，变化后的status
        StatusChange : null
    };
    
    //为一类TextBox添加样式
    $.TextBoxAddStyle = function(styleName,opts,isInit){
        //自定义参数
        opts = $.extend({}, $.TextBoxStyle.defaults, opts || {});
        opts.Normal = $.extend({}, $.TextBoxStyle.defaults.Normal, opts.Normal || {});
        opts.Normal.CssStyle = $.extend({}, $.TextBoxStyle.defaults.Normal.CssStyle, opts.Normal.CssStyle || {});
        opts.Focus = $.extend({}, $.TextBoxStyle.defaults.Focus, opts.Focus || {});
        opts.Focus.CssStyle = $.extend({}, $.TextBoxStyle.defaults.Focus.CssStyle, opts.Focus.CssStyle || {});
        opts.Disable = $.extend({}, $.TextBoxStyle.defaults.Disable, opts.Disable || {});
        opts.Disable.CssStyle = $.extend({}, $.TextBoxStyle.defaults.Disable.CssStyle, opts.Disable.CssStyle || {});
        opts.Warning = $.extend({}, $.TextBoxStyle.defaults.Warning, opts.Warning || {});
        opts.Warning.CssStyle = $.extend({}, $.TextBoxStyle.defaults.Warning.CssStyle, opts.Warning.CssStyle || {});
        
        //检查样式是否已存在
        var isNew = true;
        var oldOpts = null;
        for(var i = 0;i<$.TextBoxStyleArray.length;i++){
            if($.TextBoxStyleArray[i].StyleName == styleName){
                isNew = false;
                //更新参数
                oldOpts = $.TextBoxStyleArray[i].Opts;
                //内容提示的情况
                if(oldOpts.ContentTip != undefined){
                    opts.ContentTip = $.extend({}, oldOpts.ContentTip, opts.ContentTip || {});
                    opts.ContentTip.CssStyle = $.extend({}, oldOpts.ContentTip.CssStyle, opts.ContentTip.CssStyle || {});
                }
                
                $.TextBoxStyleArray[i].Opts = opts;
                break;
            }
        }
        
        //增加新参数
        if(isNew){
            var style = new Object();
            style.StyleName = styleName;
            style.Opts = opts;
            $.TextBoxStyleArray.push(style);
            //绑定事件
            $("[TextBoxStyle='"+styleName+"']").live("focus",$.TextBoxStyleFocusOn);
            $("[TextBoxStyle='"+styleName+"']").live("focusout",$.TextBoxStyleFocusOut);
        }
        
        //初始化对象
        if(typeof isInit != "boolean")
            isInit = true;
            
        if(isInit){
            var objlist = $("[TextBoxStyle='"+styleName+"']");
            for(var i = 0;i<objlist.length;i++){
                var newobj = $(objlist.get(i));
                var effectStatus = newobj.attr("TextBoxStyleEffectStatus");
                var status = newobj.attr("TextBoxStyleStatus");
                if(newobj.attr("TextBoxStyleEffectStatus") != ""){
                    //已经有样式了
                    if(!isNew){
                        //变更状态，进行处理
                        TextBoxStyleRemove(newobj,oldOpts);
                        TextBoxStyleInit(newobj,effectStatus,opts);
                        if(effectStatus != status){
                            TextBoxStyleInit(newobj,status,opts);
                        }
                    }
                    continue;
                }
                
                //执行初始化
                TextBoxStyleInit(newobj,(newobj.attr("readonly")?"Disable":"Normal"),opts);
            }
        }
    };
    
    //删除指定的TextBox样式
    $.TextBoxClearStyle = function(styleName,isInit){
        for(var i = 0;i<$.TextBoxStyleArray.length;i++){
            if($.TextBoxStyleArray[i].StyleName == styleName){
                //删除绑定
                $("[TextBoxStyle='"+styleName+"']").die("focus",$.TextBoxStyleFocusOn);
                $("[TextBoxStyle='"+styleName+"']").die("focusout",$.TextBoxStyleFocusOut);
                //初始化
                if(typeof isInit != "boolean")
                    isInit = false;
            
                if(isInit){
                    var objlist = $("[TextBoxStyle='"+styleName+"']");
                    //先清除内容提示样式
                    objlist.TextBoxClearCTip();
                    
                    for(var j = 0;j<objlist.length;j++){
                        //执行初始化,删除样式
                        TextBoxStyleRemove($(objlist.get(j)),$.TextBoxStyleArray[i].Opts);
                    }
                }
                //删除样式参数
                $.TextBoxStyleArray.splice(i,1);
                break;
            }
        }
    };
    
    //为指定的对象设置TextBoxStyle属性名
    $.fn.TextBoxSetStyleName = function(StyleName, isInit){
        if(typeof isInit != "boolean")
            isInit = true;
        
        var opts = TextBoxStyleGetOpts(StyleName);
        //循环处理对象
        for(var i = 0;i<this.length;i++){
            var newobj = $(this.get(i));
            var oldstyle = newobj.attr("TextBoxStyle");
            if(oldstyle == StyleName){
                //样式一样，不用处理
                continue;
            }
            
            if(isInit && oldstyle !== undefined){
                //有其他的样式
                if(newobj.attr("TextBoxStyleEffectStatus") != ""){
                    //清除原样式
                    TextBoxStyleRemove(newobj,TextBoxStyleGetOpts(oldstyle));
                }
            }
            
            if(StyleName != ""){
                newobj.attr({TextBoxStyle:StyleName,TextBoxStyleStatus:"",TextBoxStyleEffectStatus:"",TextBoxStyleFunClass:""});
                
                //设置新样式
                if(isInit && opts != null){
                    TextBoxStyleInit(newobj,(newobj.attr("readonly")?"Disable":"Normal"),opts);
                }
            }
            else{
                //清除样式
                newobj.TextBoxClearCTip();  //清除内容提示样式
                newobj.removeAttr("TextBoxStyle");
                newobj.removeAttr("TextBoxStyleEffectStatus");
                newobj.removeAttr("TextBoxStyleFunClass");
            }  
        }
    };
    
    //为设置了Sytle的textbox对象切换状态（同时变更样式）
    $.fn.TextBoxSetStatus = function(status){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            var styleName = obj.attr("TextBoxStyle");
            if(styleName === undefined || styleName == ""){
                //没有定义TextBoxStyle
                continue;
            }
            var lastStatus = obj.attr("TextBoxStyleStatus");
            var effectStatus = obj.attr("TextBoxStyleEffectStatus");
            var opts = TextBoxStyleGetOpts(styleName);
            if(opts == null){
                //没有获取到样式参数
                continue;
            }
            
            var newstyle = opts[status];
            
            if(newstyle === undefined){
                //新状态无效
                continue;
            }
            
            if(newstyle.ClearStyle && effectStatus != "" && opts[effectStatus] !== undefined){
                //清除旧的样式
                TextBoxStyleRemove(obj,opts);
            }
            
            if(newstyle.StyleType != "none"){
                //设置新样式
                TextBoxStyleInit(obj,status,opts);
            }
            
            //是否屏蔽
            if(status == "Disable"){
                //设置屏蔽
                obj.attr("readonly","readonly");
            }
            else if(lastStatus == "Disable"){
                //原来是屏蔽，新的不是屏蔽，清除只读属性
                obj.removeAttr("readonly");
            }
            
            //执行变更后的事件
            if(opts.StatusChange != null){
                try{
                    opts.StatusChange(obj,lastStatus,status);
                }catch(e){;}
            }
        }
    };
    
    
    //内部函数
    //获得焦点时绑定的样式变化执行函数
    $.TextBoxStyleFocusOn = function(){
        var obj = $(this);
        if(obj.attr("readonly")){
            //屏蔽状态不处理
            return;
        }
        if(obj.attr("TextBoxStyleStatus") == "ContentTip"){
            //处于提示状态，把提示文字去掉
            this.value = "";
        }
        obj.TextBoxSetStatus("Focus");
        
        //执行事件
        var opts = TextBoxStyleGetOpts(obj.attr("TextBoxStyle"));
        if(opts.FocusOn != null){
            try{
                opts.FocusOn(obj);
            }catch(e){;}
        }
    };
    
    //失去焦点时绑定的样式变化执行函数
    $.TextBoxStyleFocusOut = function(){
        var obj = $(this);
        if(obj.attr("readonly")){
            //屏蔽状态不处理
            return;
        }
        if(obj.is("[selftype='TextBoxCTip']") && this.value == ""){
            //增加提示
            this.value = obj.attr("TextBoxCTip");
            obj.TextBoxSetStatus("ContentTip");
        }
        else{
            obj.TextBoxSetStatus("Normal");
        }
        
        //执行事件
        var opts = TextBoxStyleGetOpts(obj.attr("TextBoxStyle"));
        if(opts.FocusOut != null){
            try{
                opts.FocusOut(obj);
            }catch(e){;}
        }
    };
    
    //初始化对象的样式
    function TextBoxStyleInit(obj,status,opts){
        if(!obj.is("[TextBoxStyle]")){
            //不是指定样式
            return;
        }
        
        var style = opts[status];
        if(style === undefined){
            //没有定义状态参数,直接退出
            return;
        }
        
        if(style.StyleType == "none"){
            //无需改变样式，直接更新TextBoxStyleStatus属性即可
            obj.attr("TextBoxStyleStatus",status);
        }
        else{
            //要改变样式，根据参数设定样式
            switch(style.StyleType){
                case "class":
                    //样式类
                    if(typeof style.ClassName == "function"){
                        //函数方式
                        var funclass = "";
                        try{
                            funclass = style.ClassName(obj,obj.attr("class"));
                        }catch(e){;}
                        obj.addClass(funclass);
                        obj.attr("TextBoxStyleFunClass",funclass);
                    }
                    else{
                        //类名
                        obj.addClass(style.ClassName);
                    }
                    break;
                case "css":
                    //css样式
                    obj.css(style.CssStyle);
                    break;
                default :
                    break;
            }
            //更新属性
            obj.attr("TextBoxStyleStatus",status);
            obj.attr("TextBoxStyleEffectStatus",status);
        }
    };
    
    //根据当前状态清除对象的样式
    function TextBoxStyleRemove(obj,opts){
        if(!obj.is("[TextBoxStyle]")){
            //不是指定样式
            return;
        }
        var effectStatus = obj.attr("TextBoxStyleEffectStatus");
        
        var style = opts[effectStatus];
        if(style === undefined || style.StyleType == "none"){
            //没有定义状态参数,直接退出
            return;
        }
        
        //清除样式
        obj.attr("TextBoxStyleStatus","");
        obj.attr("TextBoxStyleEffectStatus","");
        switch(style.StyleType){
            case "class":
                //样式类
                if(typeof style.ClassName == "function"){
                    //函数方式
                    obj.removeClass(obj.attr("TextBoxStyleFunClass"));
                }
                else{
                    //类名
                    obj.removeClass(style.ClassName);
                }
                break;
            case "css":
                //清除css样式
                for(tempobjname in style.CssStyle){
                    obj.css(tempobjname,"");
                }
                break;
            default :
                break;
        }
    };
    
    //获取指定样式名称的参数
    function TextBoxStyleGetOpts(styleName){
        var opts = null;
        for(var i =0;i<$.TextBoxStyleArray.length;i++){
            if($.TextBoxStyleArray[i].StyleName == styleName){
                opts = $.TextBoxStyleArray[i].Opts;
                break;
            }
        }
        return opts;
    };
    
    //--TextBoxStyle end--
    
    //--TextBoxCTip begin--
    
    //TextBoxCTip的默认提示状态样式 
    $.TextBoxCTip = new Object();  
    $.TextBoxCTip.defaults = {
        //样式类型,none - 无样式，class - css类名, css - css样式表
        StyleType : "css",
        
        //是否清除原来的样式,例如在Normal切换到Focus时，若Focus的这个参数为true，会根据Normal的样式类型进行原样式的清除，例如清空ClassName或将对应的CssStyle的项清空为默认值
        ClearStyle : true,
        
        //需要设置的css类名，可以用空格分隔，或者是返回类名的函数，传入的参数依次为obj、对象原先的class属性值
        ClassName : "",
        
        //css样式
        CssStyle : {
            "color" : "Gray"
        }
    };
    
    //TextBoxCTipStyle的默认创建参数
    $.TextBoxCTipStyle = new Object();
    $.TextBoxCTipStyle.defaults = {
        //正常样式
        Normal : {
            StyleType : "none"
        },
        
        //获得焦点时的样式
        Focus : {
            StyleType : "none"
        },
        
        //屏蔽时的样式
        Disable : {
            StyleType : "none"
        },
        
        //警告提示时的样式
        Warning : {
            StyleType : "none"
        },
        
        //对象获得焦点时执行的函数,在执行了样式变化后将执行该事件函数，传入参数为JQuery对象,可以考虑在这个函数上增加其他样式的处理
        FocusOn : null,
        
        //对象失去焦点时执行的函数，在执行了样式变化后将执行该事件函数，传入参数为JQuery对象,可以考虑在这个函数上增加其他样式的处理
        FocusOut : null,
        
        //样式变化后执行的函数，传入的参数依次为JQuery对象、变化前的status，变化后的status
        StatusChange : null
    };
    
    //为指定的textbox添加内容提示
    $.fn.TextBoxAddCTip = function(tipString,CtipStyle,styleName){
        //自定义参数
        var ContentTip = $.extend({}, $.TextBoxCTip.defaults, CtipStyle || {});
        ContentTip.CssStyle = $.extend({}, $.TextBoxCTip.defaults.CssStyle, CtipStyle === undefined ? {} : CtipStyle.CssStyle || {});
        
        //默认创建参数
        var defaultStyle = $.extend({}, $.TextBoxCTip.defaults, {});
        defaultStyle.ContentTip =  $.extend({}, ContentTip, {});
        defaultStyle.ContentTip.CssStyle =  $.extend({}, ContentTip.CssStyle, {});
        
        //默认样式
        if(styleName === undefined){
            styleName = "TextBoxCTipStyle";
        }
        
        //循环处理
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i)); //当前对象
            
            //变更原内容提示样式参数
            var TempStyleName = styleName;
            if(obj.is("[TextBoxStyle]")){
                //已设置过样式
                TempStyleName = obj.attr("TextBoxStyle");
            }
            var StyleOpts = TextBoxStyleGetOpts(TempStyleName);
            if(StyleOpts == null){
                //用默认参数添加样式
                $.TextBoxAddStyle(TempStyleName,defaultStyle,true);
            }
            else{
                //检查样式是否已有ContentTip状态
                if(StyleOpts.ContentTip === undefined){
                    StyleOpts.ContentTip = {};
                    StyleOpts.ContentTip = $.extend({},StyleOpts.ContentTip, ContentTip || {});
                    StyleOpts.ContentTip.CssStyle = $.extend({},StyleOpts.ContentTip.CssStyle, ContentTip.CssStyle || {});
                    //修改样式,没必要初始化
                    $.TextBoxAddStyle(TempStyleName,StyleOpts,false);
                }
                else{
                    if(CtipStyle !== undefined && CtipStyle != null){
                        //变更参数
                        StyleOpts.ContentTip = $.extend({},StyleOpts.ContentTip, ContentTip || {});
                        StyleOpts.ContentTip.CssStyle = $.extend({},StyleOpts.ContentTip.CssStyle, ContentTip.CssStyle || {});
                        //修改样式,并初始化
                        $.TextBoxAddStyle(TempStyleName,StyleOpts,true);
                    }
                }
            }
            
            //为对象设置样式
            if(!obj.is("[TextBoxStyle]")){
                obj.TextBoxSetStyleName(TempStyleName,true);
            }
            
            //为对象绑定提示信息
            obj.attr("selftype","TextBoxCTip");
            obj.attr("TextBoxCTip",tipString);
            
            //对非焦点状态且内容为空的情况修改样式和增加提示
            if(obj.attr("TextBoxStyleStatus") != "Focus"){
                if(obj.get(0).value == ""){
                    //增加提示
                    obj.get(0).value = tipString;
                    //变更样式
                    obj.TextBoxSetStatus("ContentTip");
                }
                else if(obj.attr("TextBoxStyleStatus") == "ContentTip"){
                    //只修改文字即可
                    obj.get(0).value = tipString;
                }
            }
        }
    };
    
    //清除指定对象的ContentTip样式
    $.fn.TextBoxClearCTip = function(){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            if(!obj.is("[selftype='TextBoxCTip']")){
                //非这种类型
                continue;
            }
            
            //如果是提示状态，修改为一般状态
            if(obj.is("[TextBoxStyleStatus='ContentTip']")){
                obj.get(0).value = "";
                obj.TextBoxSetStatus("Normal");
            }
            
            //删除属性
            obj.removeAttr("selftype");
            obj.removeAttr("TextBoxCTip");
        }
    };
    
    //获得CTip控件的当前值
    $.fn.TextBoxCTipValue = function(){
        if(this.length == 0){
            return null;
        }
        
        var obj = $(this.get(0));
        if(obj.is("[selftype='TextBoxCTip']")){
            if(obj.is("[TextBoxStyleStatus='ContentTip']")){
                //提示状态
                return "";
            }
            else{
                return obj.get(0).value;
            }
        }
        else{
            //其他类型
            return obj.get(0).value;
        }
    };
    
    
    //--TextBoxCTip end--
})(jQuery);