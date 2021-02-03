/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：IFrame
说明：提供对iframe的处理
文件：IFrame.js
依赖文件：jquery-1.6.4.min.js
-----------------------*/

;(function($) {
    /*---------------
    获得指定window对象的子IFrame对象（window的JQuery对象）
    $(window).IFrameChildren(IdOrName)
        IdOrName：iframe的id或name属性，若传空或不传代表获取所有子iframe对象
    返回值：子iframe的JQuery对象清单
    --------------- */
    $.fn.IFrameChildren = function(IdOrName){
        var ret = $("");
        if(this.length > 0 && this.get(0).document){
            //有对象且对象为window对象
            if(IdOrName === undefined || IdOrName == null || IdOrName == ""){
                var framelist = this.get(0).frames;
                for(var i = 0;i<framelist.length;i++){
                    ret = ret.add(framelist[i]);
                }
            }
            else{
                var frame = this.get(0).frames[IdOrName];
                if(frame !== undefined){
                    ret = ret.add(frame);
                }
            }
        }
        return ret;
    };
    
    /*---------------
    获得指定window对象的子孙IFrame对象（window的JQuery对象）
    $(window).IFrameFind(IdOrName)
        IdOrName：iframe的id或name属性，若传空或不传则返回空对象
    返回值：查找到的iframe的JQuery对象清单
    --------------- */
    $.fn.IFrameFind = function(IdOrName){
        var ret = $("");
        if(IdOrName !== undefined && IdOrName != null && IdOrName != "" && this.length > 0 && this.get(0).document){
            ret = ret.add(this.IFrameChildren(IdOrName));
            var framelist = this.get(0).frames;
            for(var i = 0;i<framelist.length;i++){
                ret = ret.add($(framelist[i]).IFrameFind(IdOrName));
            }
        }
        return ret;
    };
    
    /*---------------
    判断当前窗口是否顶级窗口（不是其他窗口的IFrame对象）
    $(window).IsTopWindow()
    返回值：true - 是顶级窗口，false-有父窗口
    --------------- */
    $.fn.IsTopWindow = function(){
        return this.get(0) == this.get(0).top;
    };
    
    /*---------------
    获得指定window对象的父window的JQuery对象
    $(window).IFrameParent()
    返回值：父window的JQuery对象
    --------------- */
    $.fn.IFrameParent = function(){
        if(this.length > 0 && this.get(0).document){
            var winobj = this.get(0);
            if($(winobj).IsTopWindow()){
                return $("");
            }
            return $(winobj.parent);
        }
        else{
            return $("");
        }
    };
    
    /*---------------
    为当前窗口创建IFrame间相互调用JS函数的框架
    $.IFrameInitJSFunBase()
    --------------- */
    $.IFrameInitFunBase = function(MyIFrameID){
        if($("#IFrameFunBase").length > 0){
            //已创建框架
            return;
        }
        
        //创建基础框架
        //IFrameFunBase：框架的主容器，属性如下
        //MyIFrameID：本窗口自身的IFrameID
        //IFrameID：窗口的标识，用于被调用函数的窗口通过该标识找回窗口并反馈结果
        //FunRunning：标识当前窗口的远程调用是否正在运行
        //FunName：调用函数的函数名
        //FunPara：调用函数的执行参数数组，使用JSON字符串的方式保存
        //IsOK：被调用函数是否已执行成功
        //CallBackPara：回调函数的执行参数，使用JSON字符串的方式保存
        //IFrameFunBase_CallFun：当前窗口执行远程调用的执行按钮
        //IFrameFunBase_CallBack：远程调用后执行回调函数的执行按钮,该按钮中绑定了当前被调用窗口的变量IFrameFunWin和回调函数IFrameFunCallBack
        $(window.document.body).append("<SPAN id='IFrameFunBase' style='display:none; width:0px; height:0px; overflow:hidden;' \
                                              MyIFrameID='"+MyIFrameID+"' \
                                              IFrameID='' \
                                              FunRunning='false' \
                                              FunName='' \
                                              FunPara='' \
                                              IsOK='false' \
                                              CallBackPara='' \
                                        > \
                                           <INPUT type='button' id='IFrameFunBase_CallFun' value='' onclick='$.IFrameFunBaseCall();' /> \
                                           <INPUT type='button' id='IFrameFunBase_CallBack' value='' onclick='$.IFrameFunBaseCallBack(this);' /> \
                                        </SPAN>");
    };
    
    /*---------------
    调用IFrame窗口函数
    $(window).IFrameFunCall(FunName,CallBack,[para1],[para2]...)
    --------------- */
    $.fn.IFrameFunCall = function(FunName,CallBack){
        if(this.length == 0){
            return;
        }
        
        //获得参数
        var WinObj = $(this.get(0));
        var JSONFunPara = "";
        if(arguments.length > 2){
            try{
                var ParaArray = new Array();
                for(var i = 2;i<arguments.length;i++){
                    ParaArray.push(arguments[i]);
                }
                JSONFunPara = JSON.stringify(ParaArray);
            }catch(e){;}
        }
        var FrameID = $("#IFrameFunBase").attr("MyIFrameID");
        
        //控制只能调用一个
        while(!$.IFrameFunCanCallMX){
            var itemp = 1;
        }
        $.IFrameFunCanCallMX = false;
        
        try{
            //绑定数据
            var button = $("#IFrameFunBase_CallBack");
            button.data("IFrameFunWin",WinObj);
            button.data("IFrameFunCallBack",CallBack);
            
            //获得要设置的对象
            var Base = $(WinObj.get(0).document.body).find("#IFrameFunBase");
            
            //尝试调用，限制只能执行1个函数
            while(Base.attr("FunRunning") == "true"){
                var itemp = 1;
            }
            
            //设置执行状态
            Base.attr("FunRunning","true");
            try{
                Base.attr("IsOK","false");
                Base.attr("CallBackPara","");
                Base.attr("IFrameID",FrameID);
                Base.attr("FunName",FunName);
                Base.attr("FunPara",JSONFunPara);
                
                //开始调用
                Base.find("#IFrameFunBase_CallFun").get(0).click();
            }catch(er){Base.attr("FunRunning","false");throw(er);}
        }catch(e){$.IFrameFunCanCallMX=true;}
    };
    
    /*---------------
    当前页面被远程调用时执行的函数
    $.IFrameFunBaseCall()
    --------------- */
    $.IFrameFunBaseCall = function(){
        var Base = $("#IFrameFunBase");
        
        //获取执行参数
        var FunName = Base.attr("FunName");
        var JSONFunPara = Base.attr("FunPara");
        var FunPara = null;
        var ParaString = "";
        if(JSONFunPara != ""){
            //将其解码为对象
            try{
                FunPara = JSON.parse(JSONFunPara);
                for(var i = 0;i<FunPara.length;i++){
                    ParaString += "FunPara[" + i + "],";
                }
                if(ParaString != ""){
                    ParaString = ParaString.substring(0,ParaString.length - 1);
                }
            }catch(e){;}
        }
        
        //执行函数
        var ret = undefined;
        try{
            var js = "ret = "+FunName+"("+ParaString+");";
            eval(js);
        }catch(e){;}
        
        //填入返回值
        if(ret !== undefined){
            try{
                Base.attr("CallBackPara",JSON.stringify(ret));
            }catch(e){;}
        }
        
        //调用调用窗口的回调函数
        var CallFrame = $(window.top).IFrameFind(Base.attr("IFrameID"));
        if(CallFrame.length == 0){
            CallFrame = $(window.top);
        }
        try{
            $(CallFrame.get(0).document.body).find("#IFrameFunBase_CallBack").get(0).click();
        }catch(e){;}
        
        //更新状态为调用完成
        Base.attr("FunRunning","false");
        Base.attr("IsOK","false");
        Base.attr("CallBackPara","");
    };
    
    /*---------------
    调用远程窗口函数必须为单线程，通过该变量控制每次只能调用1个函数
    $.IFrameFunCanCallMX
    --------------- */
    $.IFrameFunCanCallMX = true;
    
    /*---------------
    调用远程函数后执行的回调函数
    $.IFrameFunBaseCallBack(objdom)
    --------------- */
    $.IFrameFunBaseCallBack = function(objdom){
        var WinObj = $(objdom).data("IFrameFunWin");
        var CallBack = $(objdom).data("IFrameFunCallBack");
        
        //获得回调参数
        var JSONCallBackPara = $(WinObj.get(0).document.body).find("#IFrameFunBase").attr("CallBackPara");
        var IFrameID = $(WinObj.get(0).document.body).find("#IFrameFunBase").attr("MyIFrameID");
        var CallBackPara = null;
        var CallBackParaString = "";
        if(JSONCallBackPara != ""){
            //将其解码为对象
            try{
                CallBackPara = JSON.parse(JSONCallBackPara);
                CallBackParaString = ",CallBackPara";
            }catch(e){;}
        }
        
        //调用回调函数
        if(CallBack !== undefined && CallBack != null){
            try{
                var js = "CallBack(IFrameID"+CallBackParaString+");";
                eval(js);
            }catch(e){;}
        }
        
        //将单线程锁定变量变更为true
        $.IFrameFunCanCallMX = true;
    };
    
    
     /*---------------
    获得指定window对象的同级window的JQuery对象清单
    $(window).IFrameSiblings(IdOrName)
        IdOrName：iframe的id或name属性，若传空或不传代表获取所有同级iframe对象
    返回值：同级iframe的JQuery对象清单（不含自己）
    --------------- */
    $.fn.IFrameSiblings = function(IdOrName){
        if(this.length > 0 && this.get(0).document){
            var winObj= $(this.get(0));
            var parentObj = winObj.IFrameParent();
            if(parentObj.length == 0){
                return $("");
            }
            
            //开始获取同级对象
            if(IdOrName === undefined || IdOrName == null || IdOrName == ""){
                var framelist = parentObj.get(0).frames;
                var ret = $("");
                for(var i = 0;i<framelist.length;i++){
                    if(framelist[i] != winObj.get(0)){
                        ret = ret.add(framelist[i]);
                    }
                }
                return ret;
            }
            else{
                var frame = parentObj.get(0).frames[IdOrName];
                if(frame !== undefined && frame != winObj.get(0)){
                    return $(frame);
                }
                return $("");
            }
        }
        else{
            return $("");
        }
    };
    
    /*---------------
    设置指定窗口在IFrame中为自适应高度
    $(window).IFrameAutoHeight(IFrameID)
        IFrameID：引用该窗口的IFrame的ID
    --------------- */
    $.fn.IFrameAutoHeight = function(IFrameID){
        for(var i = 0;i<this.length;i++){
            var winObj = $(this.get(i));
            var parentObj = winObj.IFrameParent();
            if(parentObj.length == 1){
                //在父节点中可找到本窗口的Iframe对象
                var IFrameObj =  $(parentObj.get(0).document.body).find("#"+IFrameID);
                if(IFrameObj.length > 0){
                    //将IFrameID数据绑定到窗口中
                    var winObjBody = $(winObj.get(0).document.body);
                    if(winObjBody.attr("IFrameAutoHeight") === undefined){
                        winObjBody.attr("IFrameAutoHeight",IFrameID);
                        IFrameAutoHeightExecute(winObj,IFrameObj);
                        
                        //绑定改变大小函数
                        winObj.IFrameFunCall("IFrameAutoHeightBindResize",null);
                    }
                }
            }
        }
    };
    
    //以下为内部函数
    //改变窗口大小需自动适应高度执行的函数
    function IFrameAutoHeightResize(){
        var IFrameID = $(window.document.body).attr("IFrameAutoHeight");
        var parentObj = $(window).IFrameParent();
        var IFrameObj =  $(parentObj.get(0).document.body).find("#"+IFrameID);
        IFrameAutoHeightExecute($(window),IFrameObj);
    };
    
    //为窗口绑定改变窗口自动调节高度的事件
    function IFrameAutoHeightBindResize(){
        $(window).bind("resize",function(){setTimeout(IFrameAutoHeightResize,10);});
    };
    
    //改变窗口大小执行的计算函数
    function IFrameAutoHeightExecute(winObj,IFrameObj){
        //先改变高度，看滚动设置
        IFrameObj.css("height","0px");
        winObj.scrollTop(10000000000);
        var lasttop = winObj.scrollTop();
        IFrameObj.css("height",lasttop + "px");
        winObj.scrollTop(10000000000);
        var top = winObj.scrollTop();
        while(top > 0){
            lasttop = lasttop + top;
            IFrameObj.css("height",lasttop + "px");
            winObj.scrollTop(10000000000);
            top = winObj.scrollTop();
        }
    };
    
})(jQuery);