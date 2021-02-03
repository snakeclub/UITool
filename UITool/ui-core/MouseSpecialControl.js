/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：MouseSpecialControl
说明：鼠标特效控件
文件：MouseSpecialControl.js
依赖文件：jquery-1.6.4.min.js
          TimerControl.js
          ToolFunction.js
-----------------------*/

/*-----------------------
==MouseSpecialControl==
说明：鼠标特效控件
-----------------------*/
;(function($) {
    /*
      --JQuery_UITool_MouseHovering_TempID--
      共享变量，用于存储临时ID值
    */
    var JQuery_UITool_MouseHovering_TempID = 0;
     
    /*
      --MouseHoveringGetTempID--
      MouseHoveringGetTempID()
         内部函数，返回唯一的ID
    */
    function MouseHoveringGetTempID(){
        return JQuery_UITool_MouseHovering_TempID++;
    }

    /*
      --JQuery_UITool_MouseClick_DisableRightClick--
      共享变量，用于存储需要是否屏蔽了鼠标右键菜单的参数
    */
    var JQuery_UITool_MouseClick_DisableRightClick = false;
    
    
    /*
      --BindMouseHovering--
      $("").BindMouseHovering(Jobid,inFun,outFun,[waitTime])
         绑定鼠标悬停在对象上所执行的操作
         鼠标停留了waitTime时间后，执行inFun，鼠标移动或移出对象，执行outFun
         Jobid : 任务ID，用于取消效果使用
         inFun : 鼠标进入时，等待了waitTime时间后就执行相应的操作
         outFun : 鼠标移出或移动时执行的操作
         [waitTime] : 鼠标停止的时间（单位是毫秒），默认为1000毫秒，如果为0，则代表鼠标每次移动都执行一次inFun，并只有在移出对象时，才执行outFun
     */
     $.fn.BindMouseHovering = function(Jobid,inFun,outFun) {
        var waitTime = 1000;
        if(arguments.length > 3){
            waitTime = arguments[3];
        }
        
        var HoverPara = new Object();
        HoverPara.inFun = inFun;
        HoverPara.outFun = outFun;
        HoverPara.waitTime = waitTime;
        HoverPara.id = Jobid;
        
        for(var i = 0;i<this.length;i++){
            //循环进行处理start
            var obj = $(this.get(i));
            //绑定悬停参数
            var DataArray = obj.data("HoverPara");
            if(DataArray == null){
                DataArray = new Array(0);
                obj.data("HoverPara",DataArray);
                //增加事件处理
                obj.bind("mousemove",MouseHoveringMoveFun);
                obj.bind("mouseout",MouseHoveringOutFun);
                //设置对象的悬停ID
                if(obj.attr("mousehoverid") === undefined || obj.attr("mousehoverid") == ""){
                    obj.attr("mousehoverid",MouseHoveringGetTempID());
                }
            }
            
            //检查Jobid是否已存在，如果是存在的，则进行替换
            var isReplace = false;
            for(var j = 0;j<DataArray.length; j++){
                if(DataArray[j].id == Jobid){
                    //进行替换
                    DataArray.splice(j,1,HoverPara);
                    isReplace = true;
                    break;
                }
            }
            
            if(!isReplace){
                //插入记录
                DataArray.push(HoverPara);
            }
            
            //重新绑定事件处理参数
            obj.data("HoverPara",DataArray);
            
            //循环进行处理end
        }
     };
     
     
     /*
      --UnBindMouseHovering--
      $("").UnBindMouseHovering(Jobid)
         解除绑定鼠标悬停在对象上所执行的操作
         Jobid : 任务ID
     */
     $.fn.UnBindMouseHovering = function(Jobid) {
        //逐个对象处理
        for(var i = 0;i<this.length;i++){
            //循环进行处理start
            var obj = $(this.get(i));
            //绑定悬停参数
            var DataArray = obj.data("HoverPara");
            if(DataArray == null){
                //没有找到参数
                continue;
            }
            //删除操作
            if(typeof Jobid == "string"){
                for(var j = 0;j<DataArray.length;j++){
                    if(DataArray[j].id == Jobid){
                        DataArray.splice(j,1);
                    }
                }
            }
            else{
                //删除数组
                DataArray = new Array(0);
            }
            
            if(DataArray.length == 0){
                //没有要处理的操作
                obj.unbind("mousemove",MouseHoveringMoveFun);
                obj.unbind("mouseout",MouseHoveringOutFun);
                obj.removeData("HoverPara");
                obj.removeAttr("mousehoverid");
                continue;
            }
            
            //重新绑定事件处理参数
            obj.data("HoverPara",DataArray);
            
            //循环进行处理end
        }
     };
     
     /*
      --BindMouseClick--
      $("").BindMouseClick(Jobid,exeFun,[buttonType],[messageBreak],[jSearchStr],[searchPara])
            Jobid : 任务ID，用于取消特效使用
            exeFun ：要执行的函数，传入的参数依次为：绑定对象的Jquery对象，事件起源节点的Jquery对象（event.srcElement），event事件对象，jSearchStr参数的检索结果
            [buttonType] ：鼠标按下类型，包括R-右键，L-左键，M-中键，A-3个键的其中一个被按下，EX-扩展类型，使用event.button的值判断，例如E7代表左中右键同时按下，默认为A
            [messageBreak] : 匹配到鼠标按键后，是否停止消息冒泡，默认为false
            [jSearchStr] ：从对象的子孙节点中进行检索（不包含对象自身），””代表不检索，默认为””
            [searchPara] ：检索参数，A-所有子节点，S-从事件起源节点到对象的路径节点，F-从事件起源节点开始检索，匹配的第一个

     */
     $.fn.BindMouseClick = function(Jobid,exeFun,opts) {
        if(this.length == 0){
            return;
        }
        
        var DefaultOpts = {
            //鼠标按下类型，包括R-右键，L-左键，M-中键，A-3个键的其中一个被按下，EX-扩展类型，使用event.button的值判断，例如E7代表左中右键同时按下，默认为A
            buttonType : "A",
            
            //匹配到鼠标按键后，是否停止消息冒泡，默认为false
            messageBreak : false,
            
            //在对象的子孙节点中搜索，搜索结果是否包含自身
            withSelf : true,
            
            //搜索子孙节点的jquery条件
            jqueryStr : "*",
            
            //搜索方向,self - 从对象自身开始往下搜索，child - 子节点往根节点方向
            searchPath : "self"
        };
        
        opts = $.extend({}, DefaultOpts, opts || {});
        
        //屏蔽鼠标右键
        if(!JQuery_UITool_MouseClick_DisableRightClick && (opts.buttonType == "A" || opts.buttonType == "R" || opts.buttonType == "E6" || opts.buttonType == "E7")){
            $(document).bind("contextmenu",function(){return false; });
            JQuery_UITool_MouseClick_DisableRightClick = true;
        }
        
        //循环处理start
        for(var i = 0;i<this.length;i++){
            //循环进行处理start
            var obj = $(this.get(i));
            var MouseClickPara = obj.data("MouseClickPara");
            if(MouseClickPara == null){
                //未绑定过
                MouseClickPara = new Array(0);
                obj.data("MouseClickPara",MouseClickPara);
                obj.bind("mouseup",MouseClickExeFun);
            }
            //组织绑定的参数
            var para = new Object();
            para.id = Jobid;
            para.exeFun = exeFun;
            para.opts = opts;
            
            //检查Jobid是否已存在，如果是存在的，则进行替换
            var isReplace = false;
            for(var j = 0;j<MouseClickPara.length; j++){
                if(MouseClickPara[j].id == Jobid){
                    //进行替换
                    MouseClickPara.splice(j,1,para);
                    isReplace = true;
                    break;
                }
            }
            
            if(!isReplace){
                //插入记录
                MouseClickPara.push(para);
            }
            
            obj.data("MouseClickPara",MouseClickPara);
        }
        //循环处理end
     };
     
     /*
      --UnBindMouseClick--
      $("").UnBindMouseClick(Jobid)
         解除对象上绑定的指定鼠标按键事件
         Jobid : 任务ID
     */
     $.fn.UnBindMouseClick = function(Jobid) {
        //逐个对象处理
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            var MouseClickPara = obj.data("MouseClickPara");
            if(MouseClickPara == null){
                //没有绑定
                continue;
            }
            
            //删除操作
            if(typeof Jobid == "string"){
                for(var j = 0;j<MouseClickPara.length;j++){
                    if(MouseClickPara[j].id == Jobid){
                        MouseClickPara.splice(j,1);
                    }
                }
            }
            else{
                //删除全部
                MouseClickPara = new Array(0);
            }
            
            if(MouseClickPara.length == 0){
                //没有要处理的操作
                obj.unbind("mouseup",MouseClickExeFun);
                obj.removeData("MouseClickPara");
                continue;
            }
            
            //重新绑定事件处理参数
            obj.data("MouseClickPara",MouseClickPara);
        }
     };
     
     
     /*
      --MouseHoveringExecInFun--
      MouseHoveringExecInFun(obj,id)
         内部函数，鼠标在对象上移动时执行函数
    */
    $.MouseHoveringExecInFun = function(objid,hoverid,jobid,x,y){
        var obj;
        if(objid != null){
            obj = $("#"+objid);
        }
        else{
            obj = $("[mousehoverid='"+hoverid+"']");
        }
        var DataArray = obj.data("HoverPara");
        for(var i = 0;i<DataArray.length;i++){
            var para = DataArray[i];
            if(para.id==jobid){
                if(para.inFun != null){
                    try{para.inFun(obj,x,y);}catch(e){;}
                }
            }
        }
    };
    
    /*
      --MouseHoveringMoveFun--
      MouseHoveringMoveFun()
         内部函数，鼠标在对象上移动执行的函数
    */
    function MouseHoveringMoveFun(){
        var obj = $(this);
        var DataArray = obj.data("HoverPara");
        
        for(var i = 0;i<DataArray.length;i++){
            var para = DataArray[i];
            if(para.waitTime <= 0){
                //无需等待时间，直接执行infun start
                if(para.inFun != null){
                    //执行infun
                    try{
                        para.inFun(obj,event.clientX,event.clientY);
                    }catch(e){;}
                }
                //无需等待时间，直接执行infun end
            }
            else{
                //需要悬停的情况处理start
                //清除上一次需要执行的定时器
                $.ClearTimer("HoverPara_Timer_"+para.id+"_"+obj.attr("mousehoverid"));
                if(para.outFun != null){
                    try{
                        //执行移出操作
                        para.outFun(obj,event.clientX,event.clientY);
                    }catch(e){;}
                }
                //设置下一个定时器
                if(para.inFun != null){
                     var js = "$.AddTimer('HoverPara_Timer_"+para.id+"_"+obj.attr("mousehoverid") + "',function(){$.MouseHoveringExecInFun("+(obj.attr("id") == null ? "null" : "'"+obj.attr("id")+"'")+",'"+obj.attr("mousehoverid")+"','"+para.id+"',"+event.clientX+","+event.clientY+");},"+para.waitTime+");";
                     eval(js);
                }
                //需要悬停的情况处理end
            }
        }
    };
    
    /*
      --MouseHoveringOutFun--
      MouseHoveringOutFun()
         内部函数，鼠标在对象上移动出对象后执行的函数
    */
    function MouseHoveringOutFun(){
        var obj = $(this);
        var DataArray = obj.data("HoverPara");
        
        for(var i = 0;i<DataArray.length;i++){
            var para = DataArray[i];
            //循环处理start
            //清除上一次需要执行的定时器
            $.ClearTimer("HoverPara_Timer_"+para.id+"_"+obj.attr("mousehoverid"));
            if(para.outFun != null){
                try{
                    para.outFun(obj,event.clientX,event.clientY);
                }catch(e){;}
            }
            //循环处理end
        }
    };
    
    /*
      --MouseClickExeFun--
      MouseClickExeFun()
         内部函数，通用的鼠标按下事件调用函数（在mouseup调用）
    */
    function MouseClickExeFun(){
        var obj = $(this);
        var MouseClickPara = obj.data("MouseClickPara");
        var mBreak = false;  //是否阻止冒泡，只要参数中有一个阻止，就应该阻止
        for(var i = 0;i<MouseClickPara.length;i++){
            var para = MouseClickPara[i];
            var opts = para.opts;
            //先判断是否匹配到按钮
            switch(opts.buttonType.substring(0,1)){
                case "E":
                    //扩展的情况
                    if(event.button.toString() != opts.buttonType.substring(1,2)){
                        continue;
                    }
                    break;
                case "R":
                    if(event.button != 2){
                        continue;
                    }
                    break;
                case "L": 
                    if(!($.browser.msie && event.button == 1) || (!$.browser.msie && event.button == 0)){
                        continue;
                    }
                    break;
                case "M": 
                    if(!($.browser.msie && event.button == 4) || (!$.browser.msie && event.button == 1)){
                        continue;
                    }
                    break;
                case "A": 
                    //所有情况都能通过
                    break;
                default :
                    //参数错误
                    continue;
                    break;
            }
            
            //是否阻止冒泡
            if(opts.messageBreak){
                mBreak = true;
            }
            
            //搜索子对象
            var searchopts = {
                //搜索的根节点（最顶层节点）
                rootObj : obj,
                
                //搜索结果是否包含根节点
                withRoot : opts.withSelf,
                
                //搜索的jquery条件
                jqueryStr : opts.jqueryStr,
                
                //搜索方向,root - 根节点开始往下搜索，child - 子节点往根节点方向，该参数只有在justFirst为true时才有效
                searchPath : (opts.searchPath != "child" ? "root" : "child"),
                
                //是否只返回第1个匹配节点
                justFirst : true,
                
                //位置参照,"event" - event事件的clientX和clientY，"document" - 页面中的位置，JQueryObj-指定的jquery对象
                posPara : "event"
            };
           
            var SearchResult = $.getObjByPos(event.clientX,event.clientY,searchopts);
            
            //调用执行函数
            try{
                para.exeFun(obj,$(event.srcElement),event,SearchResult);
            }
            catch(e){
                ;
            }
        }
        
        //总的是否阻止冒泡
        return !mBreak;
    };
    
})(jQuery);

