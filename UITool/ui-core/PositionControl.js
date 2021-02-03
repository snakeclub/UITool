/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：PositionControl
说明：位置控制控件，用于控制指定对象的位置(不是简单的left和top)
文件：PositionControl.js
依赖文件：jquery-1.6.4.min.js
-----------------------*/

/*-----------------------
==PositionControl==
说明：位置控制控件，用于控制指定对象的位置(不是简单的left和top)
-----------------------*/
jQuery.fn.extend({
 /*
  --SetPosition--
  $("").SetPosition(PositionDesc,[ObjRefer],[SelfRefer])
    设置对象的位置
    PositionDesc : 参考对象位置描述，格式为 "XPosition:YPosition" ， 分别代表水平位置和垂直位置
        XPosition  : "center" - 参考对象的正中位置，"left" - 参考对象的左边线位置 "right" - 参考对象的右边线位置, "具体的数值" - 距离参考对象左边线的象素值,"null"-不处理
        YPosition  : "center" - 参考对象的正中位置，"top" - 参考对象的上边线位置 "bottom" - 参考对象的下边线位置, "具体的数值" - 距离参考对象上边线的象素值,"null"-不处理
        
    [ObjRefer] : 位置的参考对象，默认为"window" - 浏览器窗口，同时可以是"document" - 页面文档， "#objid .classname" - jquery的搜索条件，搜索出来的元素的第1个
    [SelfRefer] : 自身位置描述，格式为格式为 "XPosition : YPosition" ， 分别代表水平位置和垂直位置，默认值如下：
                  1）如果PositionDesc的描述不为象素值，则与PositionDesc一致
                  2）如果PositionDesc的描述为象素值，则XY方向分别为left:top
    
    处理机制：PositionDesc为center而SelfRefer：left，则将设置对象的左边线与参考对象的中线对齐，其他类似    
 */
 SetPosition : function(PositionDesc) {
    //获得并处理参数start
    var XPosition = $.trim(PositionDesc.split(":")[0].toLowerCase());
    var YPosition = $.trim(PositionDesc.split(":")[1].toLowerCase());
    var ObjRefer = "window";
    var SelfRefer = "";
    
    for(var i = 1;i<arguments.length;i++)
    {
        if(arguments[i] == null || arguments[i] === undefined || (arguments[i].length != undefined && arguments[i].length == 0)) { 
            continue;  //没有传具体值进来
        }
        switch(i)
        {
            case 1:
                ObjRefer = arguments[i];
                break;
            case 2:
                SelfRefer = arguments[i].toLowerCase();
                break;
            default :
                break;
        }
    }
    
    var XSelfRefer;
    var YSelfRefer;
    if(SelfRefer == ""){
        if(XPosition == "center" || XPosition == "left" || XPosition =="right"){
            XSelfRefer = XPosition;
        }
        else{
            XSelfRefer = "left";
        }
        
        if(YPosition == "center" || YPosition == "top" || YPosition =="bottom"){
            YSelfRefer = YPosition;
        }
        else{
            YSelfRefer = "top";
        }
    }
    else{
        XSelfRefer = $.trim(SelfRefer.split(":")[0]);
        YSelfRefer = $.trim(SelfRefer.split(":")[1]);
    }
    //获得并处理参数end
    
    //获得参考对象的相关信息star
    var ObjLeft;  //参考对象左边位置
    var ObjRight; //参考对象右边位置
    var ObjTop;  //参考对象上边位置
    var ObjBottom; //参考对象下边位置
    
    if(ObjRefer == "window"){
        //处理window的情况start
        var Obj = $(window);
        ObjLeft = Obj.scrollLeft();
        ObjRight = ObjLeft + Obj.width();
        ObjTop = Obj.scrollTop();
        ObjBottom = ObjTop + Obj.height();
        //处理window的情况start
    }
    else if(ObjRefer == "document"){
        var Obj = $(document.body);
        ObjLeft = 0;
        ObjRight = ObjLeft + Obj.outerWidth(true);
        ObjTop = 0;
        ObjBottom = ObjTop + Obj.outerHeight(true);
    }
    else{
        //处理其他参考对象的情况start
        var Obj = $(ObjRefer).first();
        
        if(Obj.length == 0){
            //没有参考对象
            return;
        }
        
        ObjLeft = Obj.offset().left;
        ObjRight = ObjLeft + Obj.outerWidth(true);
        ObjTop = Obj.offset().top;
        ObjBottom = ObjTop + Obj.outerHeight(true);
        //处理其他参考对象的情况end
    }
    
    //计算基准线
    var SetX = true;
    var SetY = true;
    var ObjBaseX;
    var ObjBaseY;
    if(XPosition == "center"){
        ObjBaseX = Math.ceil((ObjLeft + ObjRight) / 2);
    }
    else if(XPosition == "left"){
        ObjBaseX = ObjLeft;
    }
    else if(XPosition == "right"){
        ObjBaseX = ObjRight;
    }
    else if(XPosition == "null"  || XPosition == ""){
        SetX = false;
    }
    else{
        ObjBaseX = ObjLeft + parseInt(XPosition);
    }
    
    if(YPosition == "center"){
        ObjBaseY = Math.ceil((ObjTop + ObjBottom) / 2);
    }
    else if(YPosition == "top"){
        ObjBaseY = ObjTop;
    }
    else if(YPosition == "bottom"){
        ObjBaseY = ObjBottom;
    }
    else if(YPosition == "null"  || YPosition == ""){
        SetY = false;
    }
    else{
        ObjBaseY = ObjTop + parseInt(YPosition);
    }
    //获得参考对象的相关信息end
    
    //开始循环处理对象的位置信息star
    var mainobj;  //要处理的对象
    var NewLeft;
    var NewTop;
    for(var i=0;i<this.length;i++){
       mainobj = $(this.get(i));
       //X轴
       if(SetX){
           if(XSelfRefer == "left"){
              //对象左边线与基准线重叠
              NewLeft = ObjBaseX;
           }
           else if(XSelfRefer == "right"){
              //对象右边线与基准线重叠
              NewLeft = ObjBaseX - mainobj.outerWidth(true);
           }
           else if(XSelfRefer == "center"){
              //对象中线与基准线重合
              NewLeft = ObjBaseX - Math.ceil(mainobj.outerWidth(true)/2);
           }
           else{
              //错误参数，不处理
              SetX = false;
           }
       }
       
       //Y轴
       if(SetY){
           if(YSelfRefer == "top"){
              //对象上边线与基准线重叠
              NewTop = ObjBaseY;
           }
           else if(YSelfRefer == "bottom"){
              //对象右边线与基准线重叠
              NewTop = ObjBaseY - mainobj.outerHeight(true);
           }
           else if(YSelfRefer == "center"){
              //对象中线与基准线重合
              NewTop = ObjBaseY - Math.ceil(mainobj.outerHeight(true)/2);
           }
           else{
              //错误参数，不处理
              SetY = false;
           }
       }
       
       //设置位置
       if(SetX){
            mainobj.css("left",NewLeft+"px");
       }
       if(SetY){
            mainobj.css("top",NewTop+"px");
       }
    }
    //开始循环处理对象的位置信息end
 },
 
 //将对象设置到其父节点容器内的指定位置（仅对position为static和relative的情形有效）
 SetRelativePos : function(x,y){
    for(var i = 0;i<this.length;i++){
        var obj = $(this.get(i));
        var parentobj = $(this.get(i).parentNode);
        
        //通过offset获得父节点和对象相对document的位置
        var parentoffset = parentobj.offset();
        if(x != null){
            //将对象position设置为relative，left和top设置为0px
            obj.css({position : "relative",left : "0px"});
        }
        if(y != null){
            obj.css({position : "relative",top : "0px"});
        }
        var objoffset = obj.offset();
        
        var parentLPad = parseInt(parentobj.css("padding-left"));
        if(isNaN(parentLPad))
            parentLPad = 0;
        
        var objLMar = parseInt(obj.css("margin-left"));
        if(isNaN(objLMar))
            objLMar = 0;
        
        var parentTPad = parseInt(parentobj.css("padding-top"));
        if(isNaN(parentTPad))
            parentTPad = 0;
        
        var objTMar = parseInt(obj.css("margin-top"));
        if(isNaN(objTMar))
            objTMar = 0;   
        
        if(x != null){
            //处理x方向
            var L = (parentoffset.left + parentLPad) - objoffset.left + objLMar;
            
            //设置位置
            obj.css({left:L+x+"px"});
        }
        
        if(y != null){
            var T = (parentoffset.top + parentTPad) - objoffset.top + objTMar;
            obj.css({top:T+y+"px"});
        }
    }
 },
 
 //用静态位置的方式将对象设置到其父节点容器内的指定位置（仅对position为static的情形有效）
 SetStaticPos : function(x,y){
    for(var i = 0;i<this.length;i++){
        var obj = $(this.get(i));
        var parentobj = $(this.get(i).parentNode);
        
        //通过offset获得父节点和对象相对document的位置
        var parentoffset = parentobj.offset();
        var objoffset = obj.offset();
        var parentLPad = parseInt(parentobj.css("padding-left"));
        if(isNaN(parentLPad))
            parentLPad = 0;
        
        var objLMar = parseInt(obj.css("margin-left"));
        if(isNaN(objLMar))
            objLMar = 0;
        
        var parentTPad = parseInt(parentobj.css("padding-top"));
        if(isNaN(parentTPad))
            parentTPad = 0;
        
        var objTMar = parseInt(obj.css("margin-top"));
        if(isNaN(objTMar))
            objTMar = 0;
                
        if(x != null){
            //处理x方向
            var L = (parentoffset.left + parentLPad) - objoffset.left + objLMar;
            
            //设置位置
            obj.css("margin-left",x+L+"px");
        }
        
        if(y != null){
            var T = (parentoffset.top + parentTPad) - objoffset.top + objTMar;
            obj.css("margin-top",y+T+"px");
        }
    }
 }
 
});


