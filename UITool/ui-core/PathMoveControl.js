/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：PathMoveControl
说明：令对象按轨迹移动的控件
文件：PathMoveControl.js
依赖文件：jquery-1.4.2.min.js
          FloatControl.js
-----------------------*/

/*-----------------------
==PathMoveControl==
说明：令对象按轨迹移动的控件
-----------------------*/
/*
--CreatePathMoveArray--
CreatePathMoveArray(PathString)
将路径字符串组织成路径数组
PathString  : 格式为"x1:y1,x2:y2,...,xn:yn"
*/
function CreatePathMoveArray(PathString){
    var MoveArray = new Array(0);
    var templists = PathString.split(",");
    for(var i = 0;i<templists.length;i++){
        var Node = new Object();
        var tempnode = templists[i].split(":");
        Node.x = parseInt(tempnode[0]);
        Node.y = parseInt(tempnode[1]);
        MoveArray.push(Node);
    }
    
    return MoveArray;
};

;(function($) {
    /*
      --SetPathMove--
      $("").SetPathMove(PathArray,opts)
         设置对象按指定的轨迹移动
     */
     $.fn.SetPathMove = function(PathArray,opts) {
        //判断是否处理
        if(this.length <= 0){
            return;
        }
        
        //处理参数
        var DefaultOpts = {
            //是否循环，默认为true，执行完后自动从头开始执行；false-执行结束后停止
            Loop : true,
            
            //移动速度，以完成所有移动的总毫秒数为单位，默认为5000（5秒）
            Speed : 5000,
            
            //位置的参考对象，默认为"window" - 浏览器窗口-浮动； "document" - 页面文档， "#objid .classname" - jquery的搜索条件，搜索出来的元素的第1个
            RefObj : "window",
            
            //对象移动完成后执行的函数，函数传入的参数为对象自身的JQuery对象，默认为null，该执行函数若返回值为false，则停止后续的处理，若为其他值，则按原过程处理
            CallBack : null
        };
        opts = $.extend({}, DefaultOpts, opts || {});
        
        //处理传入参数start
        var Loop = opts.Loop;
        var Speed= opts.Speed;  
        var RefObj = opts.RefObj;
        var CallBack = opts.CallBack;
        //处理传入参数end
        
        //创建对象参数数组start
        if(JQuery_UITool_PathMoveControl == null){
            JQuery_UITool_PathMoveControl = new Array(0);
            //如果是IE7以下的，绑定设置浮动的函数
            if($.browser.msie && $.browser.version < 7){
                //IE 7以下的不支持positon:fixed
                $(window).bind("scroll",PathMoveControl_FloatingScroll);
            }
        }
        //创建对象参数数组end
        
        //循环进行处理start
        var mainobj = null;
        for(var i=0;i<this.length;i++){
            mainobj = $(this.get(i));
            if(!(mainobj.attr("pathmoveid")===undefined || mainobj.attr("pathmoveid") == "")){
                //已经设置了移动的
                continue;
            }
            
            var NewPathArray = PathArray;
            if(!(RefObj == "window" || RefObj == "document" ||  RefObj == "document.body")){
                //计算对象的实际路径
                var Obj = $(RefObj).first();
                if(Obj.length == 0){
                    //没有参考对象
                    return;
                }
                var ObjLeft = Obj.offset().left;
                var ObjTop = Obj.offset().top;
                for(var j=0;j<NewPathArray.length;j++){
                    NewPathArray[j].x += ObjLeft;
                    NewPathArray[j].y += ObjTop;
                }
            }
            
            //计算路径的总长度，并分配每个路径的时间start
            var PathLength = 0;
            for(var j=1;j<NewPathArray.length;j++){
                NewPathArray[j].pathlength = Math.sqrt(Math.pow((NewPathArray[j].x-NewPathArray[j-1].x),2)+Math.pow((NewPathArray[j].y-NewPathArray[j-1].y),2));
                PathLength += NewPathArray[j].pathlength;
            }
            
            for(var j=1;j<NewPathArray.length;j++){
                NewPathArray[j].time = Math.ceil((Speed * NewPathArray[j].pathlength)/ PathLength);  //该路径的动画时间
            }
            //计算路径的总长度，并分配每个路径的时间end
            
            //设置临时变量
            var TempObj = new Object();
            TempObj.Obj = mainobj;
            TempObj.PathArray = NewPathArray;
            TempObj.Loop = Loop;
            TempObj.CurrentNode = 0;
            TempObj.PathLength = PathLength;
            TempObj.AllTime = Speed;
            TempObj.Float = false;
            if(RefObj == "window"){
                TempObj.Float = true;
                if($.browser.msie && $.browser.version < 7){
                    //记录滚动条的位置
                    TempObj.scrollLeft = $(window).scrollLeft();
                    TempObj.scrollTop = $(window).scrollTop();
                }
            }
            TempObj.Running = true;
            TempObj.CallBack = CallBack;
            
            //开始设置对象的移动，先将对象放到指定位置
            mainobj.ClearFloat();  //如果是浮动状态，先清除浮动
            if(TempObj.Float){
                //浮动情况，需根据浏览器版本处理
                if($.browser.msie && $.browser.version < 7){
                    //IE7版本以下
                    mainobj.css({position:"absolute",left:(NewPathArray[0].x+TempObj.scrollLeft)+"px",top:(NewPathArray[0].y+TempObj.scrollTop)+"px"});
                }
                else{
                    //其他浏览器版本，支持position:fixed的浮动方式
                    mainobj.css({position:"fixed",left:NewPathArray[0].x+"px",top:NewPathArray[0].y+"px"});
                }
            }
            else{
                //一般情况
                mainobj.css({position:"absolute",left:NewPathArray[0].x+"px",top:NewPathArray[0].y+"px"});
            }
            
            //添加对象到变量中
            var id = JQuery_UITool_PathMoveControl.push(TempObj) - 1;
            mainobj.attr("pathmoveid",id.toString()); //索引的index
            
            //设置动画
            if(TempObj.Float && $.browser.msie && $.browser.version < 7){
                mainobj.animate({left:(NewPathArray[1].x+TempObj.scrollLeft)+"px",top:(NewPathArray[1].y+TempObj.scrollTop)+"px"},NewPathArray[1].time,"linear",PathMoveControl_AnimateEndFun); //通过$(this)获得对象
            }
            else{
                mainobj.animate({left:NewPathArray[1].x+"px",top:NewPathArray[1].y+"px"},NewPathArray[1].time,"linear",PathMoveControl_AnimateEndFun); //通过$(this)获得对象
            }
        }
        //循环进行处理end
     };
     
     /*
      --SetPathMoveStat--
      $("").SetPathMoveStat(Stat)
         设置对象的移动状态
         Stat  :  状态，分别有"stop" - 停止 ， "resume" - 从当前位置继续开始， "restart" - 从头开始
     */
     $.fn.SetPathMoveStat = function(Stat) {
        //判断是否处理
        if(this.length <= 0){
            return;
        }
        
        //循环进行处理start
        var mainobj = null;
        for(var i=0;i<this.length;i++){
            mainobj = $(this.get(i));
            if(mainobj.attr("pathmoveid")===undefined || mainobj.attr("pathmoveid") == ""){
                //未设置移动的
                continue;
            }
            
            var TempObj = JQuery_UITool_PathMoveControl[parseInt(mainobj.attr("pathmoveid"))];
            if(Stat == "stop"){
                //停止
                mainobj.stop();
                TempObj.Running=false;
            }
            else if(Stat == "resume" && !TempObj.Running){
                //从现有位置开始
                if(TempObj.CurrentNode >= TempObj.PathArray.length - 1){
                    //已经到达最后一个节点了
                    TempObj.Obj.SetPathMoveStat("restart");
                    return;
                }
                
                TempObj.Running=true;
                if(TempObj.Float && $.browser.msie && $.browser.version < 7){
                    //IE7以下
                    var len = Math.sqrt(Math.pow((TempObj.PathArray[TempObj.CurrentNode+1].x-parseInt(TempObj.Obj.css("left").slice(0,-2))+TempObj.scrollLeft),2)+Math.pow((TempObj.PathArray[TempObj.CurrentNode+1].y-parseInt(TempObj.Obj.css("top").slice(0,-2))+TempObj.scrollTop),2));
                    var time = Math.ceil((TempObj.AllTime * len)/ TempObj.PathLength);  //该路径的动画时间
                    //重新运行
                    TempObj.Obj.animate({left:(TempObj.PathArray[TempObj.CurrentNode+1].x+TempObj.scrollLeft)+"px",top:(TempObj.PathArray[TempObj.CurrentNode+1].y+TempObj.scrollTop)+"px"},time,"linear",PathMoveControl_AnimateEndFun); 
                }
                else{
                    //其他浏览器，或不是浮动状态
                    var len = Math.sqrt(Math.pow((TempObj.PathArray[TempObj.CurrentNode+1].x-parseInt(TempObj.Obj.css("left").slice(0,-2))),2)+Math.pow((TempObj.PathArray[TempObj.CurrentNode+1].y-parseInt(TempObj.Obj.css("top").slice(0,-2))),2));
                    var time = Math.ceil((TempObj.AllTime * len)/ TempObj.PathLength);  //该路径的动画时间
                    //重新运行
                    TempObj.Obj.animate({left:TempObj.PathArray[TempObj.CurrentNode+1].x+"px",top:TempObj.PathArray[TempObj.CurrentNode+1].y+"px"},time,"linear",PathMoveControl_AnimateEndFun); 
                }            
            }
            else if(Stat == "restart"){
                //从头开始
                mainobj.stop(); //先停止
                TempObj.CurrentNode = 0;
                TempObj.Running=true;
                //开始设置对象的移动，先将对象放到指定位置
                if(TempObj.Float && $.browser.msie && $.browser.version < 7){
                    //IE7版本以下
                    mainobj.css({left:(TempObj.PathArray[0].x+TempObj.scrollLeft)+"px",top:(TempObj.PathArray[0].y+TempObj.scrollTop)+"px"});
                    mainobj.animate({left:(TempObj.PathArray[1].x+TempObj.scrollLeft)+"px",top:(TempObj.PathArray[1].y+TempObj.scrollTop)+"px"},TempObj.PathArray[1].time,"linear",PathMoveControl_AnimateEndFun); //通过$(this)获得对象
                }
                else{
                    //一般情况
                    mainobj.css({left:TempObj.PathArray[0].x+"px",top:TempObj.PathArray[0].y+"px"});
                    mainobj.animate({left:TempObj.PathArray[1].x+"px",top:TempObj.PathArray[1].y+"px"},TempObj.PathArray[1].time,"linear",PathMoveControl_AnimateEndFun); //通过$(this)获得对象
                }
            }
            
        }
        //循环进行处理end
     };
     
     
     /*
      --ClearPathMove--
      $("").ClearPathMove()
         清除对象的移动设置
     */
     $.fn.ClearPathMove = function(){
        //循环进行处理start
        for(var i=0;i<this.length;i++){
            var mainobj = $(this.get(i));
            var index = mainobj.attr("pathmoveid");
            if(index===undefined || index == ""){
                //未设置移动的
                continue;
            }
            
            //停止动画
            mainobj.stop();
            
            //清除数据组中的数据
            for(var j = index + 1;j<JQuery_UITool_PathMoveControl.length;j++){
                //数组后面的对象的索引都减1
                JQuery_UITool_PathMoveControl[j].Obj.attr("pathmoveid",(j-1));
            }
            
            if(JQuery_UITool_PathMoveControl[index].Float && $.browser.msie && $.browser.version < 7){
                //浮动且IE7以下,使用浮动控件设置浮动
                mainobj.SetFloat();
            }
            
            //删除对象
            JQuery_UITool_PathMoveControl.splice(index,1); //删除索引
                    
            //删除一些临时变量
            mainobj.removeAttr("pathmoveid");
        }
        //循环进行处理end
     };
     


    /*
    --JQuery_UITool_PathMoveControl--
    通用的轨迹移动公用变量，注意调用界面不能使用这个变量
    */
    var JQuery_UITool_PathMoveControl = null;
    
    /*
    --PathMoveControl_FloatingScroll--
    内部函数，浮动的情况下，且是IE7以下浏览器要处理滚动页面的效果
    */
    function PathMoveControl_FloatingScroll(){
        for(var i = 0;i<JQuery_UITool_PathMoveControl.length;i++){
            var TempObj = JQuery_UITool_PathMoveControl[i];
            if(TempObj.Float){
                //判断位移的情况
                var Xset = $(window).scrollLeft() - TempObj.scrollLeft;
                var Yset = $(window).scrollTop() - TempObj.scrollTop;
                if(TempObj.Running){
                    //正在运行的情况，先暂停运行
                    TempObj.Obj.stop();
                }
                //获得对象left和top
                var Left = parseInt(TempObj.Obj.css("left").slice(0,-2));
                var Top = parseInt(TempObj.Obj.css("top").slice(0,-2));
                
                //设置新位置
                TempObj.scrollLeft = $(window).scrollLeft();
                TempObj.scrollTop = $(window).scrollTop();
                TempObj.Obj.css({left:(Left+Xset) + "px",top:(Top+Yset)+"px"});
                
                if(TempObj.Running){
                    //正在运行的情况，恢复运行,计算距离
                    var len = Math.sqrt(Math.pow((TempObj.PathArray[TempObj.CurrentNode+1].x-Left-Xset+TempObj.scrollLeft),2)+Math.pow((TempObj.PathArray[TempObj.CurrentNode+1].y-Top-Yset+TempObj.scrollTop),2));
                    var time = Math.ceil((TempObj.AllTime * len)/ TempObj.PathLength);  //该路径的动画时间
                    //重新运行
                    TempObj.Obj.animate({left:(TempObj.PathArray[TempObj.CurrentNode+1].x+TempObj.scrollLeft)+"px",top:(TempObj.PathArray[TempObj.CurrentNode+1].y+TempObj.scrollTop)+"px"},time,"linear",PathMoveControl_AnimateEndFun); 
                }
            }
        }
    };
    
    /*
    --PathMoveControl_FloatingScroll--
    内部函数，浮动的情况下，且是IE7以下浏览器要处理滚动页面的效果
    */
    function PathMoveControl_FloatingScroll(){
        for(var i = 0;i<JQuery_UITool_PathMoveControl.length;i++){
            var TempObj = JQuery_UITool_PathMoveControl[i];
            if(TempObj.Float){
                //判断位移的情况
                var Xset = $(window).scrollLeft() - TempObj.scrollLeft;
                var Yset = $(window).scrollTop() - TempObj.scrollTop;
                if(TempObj.Running){
                    //正在运行的情况，先暂停运行
                    TempObj.Obj.stop();
                }
                //获得对象left和top
                var Left = parseInt(TempObj.Obj.css("left").slice(0,-2));
                var Top = parseInt(TempObj.Obj.css("top").slice(0,-2));
                
                //设置新位置
                TempObj.scrollLeft = $(window).scrollLeft();
                TempObj.scrollTop = $(window).scrollTop();
                TempObj.Obj.css({left:(Left+Xset) + "px",top:(Top+Yset)+"px"});
                
                if(TempObj.Running){
                    //正在运行的情况，恢复运行,计算距离
                    var len = Math.sqrt(Math.pow((TempObj.PathArray[TempObj.CurrentNode+1].x-Left-Xset+TempObj.scrollLeft),2)+Math.pow((TempObj.PathArray[TempObj.CurrentNode+1].y-Top-Yset+TempObj.scrollTop),2));
                    var time = Math.ceil((TempObj.AllTime * len)/ TempObj.PathLength);  //该路径的动画时间
                    //重新运行
                    TempObj.Obj.animate({left:(TempObj.PathArray[TempObj.CurrentNode+1].x+TempObj.scrollLeft)+"px",top:(TempObj.PathArray[TempObj.CurrentNode+1].y+TempObj.scrollTop)+"px"},time,"linear",PathMoveControl_AnimateEndFun); 
                }
            }
        }
    };
    
    /*
    --PathMoveControl_AnimateEndFun--
    内部函数，每个对象动画执行完后的处理,处理往下个节点运动还是最后一个节点结束停止
    */
    function PathMoveControl_AnimateEndFun(){
        var index = parseInt($(this).attr("pathmoveid"));
        var TempObj = JQuery_UITool_PathMoveControl[index];
        TempObj.CurrentNode++; //由于javascript相当于引用，因此改这个相当于改变量
        if(TempObj.CurrentNode < TempObj.PathArray.length - 1){
            //移到下一个节点
            if(TempObj.Float && $.browser.msie && $.browser.version < 7){
                TempObj.Obj.animate({left:(TempObj.PathArray[TempObj.CurrentNode+1].x+TempObj.scrollLeft)+"px",top:(TempObj.PathArray[TempObj.CurrentNode+1].y+TempObj.scrollTop)+"px"},TempObj.PathArray[TempObj.CurrentNode+1].time,"linear",PathMoveControl_AnimateEndFun); //通过$(this)获得对象
            }
            else{
                TempObj.Obj.animate({left:TempObj.PathArray[TempObj.CurrentNode+1].x+"px",top:TempObj.PathArray[TempObj.CurrentNode+1].y+"px"},TempObj.PathArray[TempObj.CurrentNode+1].time,"linear",PathMoveControl_AnimateEndFun); //通过$(this)获得对象
            }
        }
        else{
            //已经到结尾了，从头开始
            var callbackret = true;
            try{
                callbackret = (TempObj.CallBack)($(this));
            }catch(e){;};
            
            if(!callbackret){
                try{
                    TempObj.CurrentNode = TempObj.PathArray.length - 1;
                    TempObj.Running = false;
                }catch(e){;}
                return;
            }
            
            if(TempObj.Loop){
                TempObj.CurrentNode = 0;
                if(TempObj.Float && $.browser.msie && $.browser.version < 7){
                    TempObj.Obj.css({left:(TempObj.PathArray[0].x+TempObj.scrollLeft)+"px",top:(TempObj.PathArray[0].y+TempObj.scrollTop)+"px"});
                    TempObj.Obj.animate({left:(TempObj.PathArray[1].x+TempObj.scrollLeft)+"px",top:(TempObj.PathArray[1].y+TempObj.scrollTop)+"px"},TempObj.PathArray[1].time,"linear",PathMoveControl_AnimateEndFun); //通过$(this)获得对象
                }
                else{
                    TempObj.Obj.css({left:TempObj.PathArray[0].x+"px",top:TempObj.PathArray[0].y+"px"});
                    TempObj.Obj.animate({left:TempObj.PathArray[1].x+"px",top:TempObj.PathArray[1].y+"px"},TempObj.PathArray[1].time,"linear",PathMoveControl_AnimateEndFun); //通过$(this)获得对象
                }
            }
            else{
                //不循环
                TempObj.CurrentNode = TempObj.PathArray.length - 1;
                TempObj.Running = false;
            }
        }
    };
    
})(jQuery);

