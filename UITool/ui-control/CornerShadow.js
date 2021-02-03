/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：CornerShadow
说明：圆角阴影控件
文件：CornerShadow.js
依赖文件：jquery-1.6.4.min.js
          CornerShadow.js
          
          
资源文件：CornerShadowCss/CornerShadow.css
          
          
-----------------------*/
;(function($) {
    //默认创建参数
    $.CornerShadow = new Object();
    $.CornerShadow.defaults = {
        //样式前缀
        CssBefore : "CornerShadow",
        
        //阴影颜色，默认为#777，仅IE浏览器有效
        Color : "#777",
        
        //圆角大小，仅IE浏览器有效
        CornerSize : 4,
        
        //强制设置为图片阴影的模式
        ForcePicShadow : false,
        
        //自动随对象大小改变阴影大小
        AutoSizeChange : true,
        
        //光源X,Y方向的偏移（单位为象素），负数代表向左上偏移，阴影在右下方；正数代表向右下偏移，阴影在左上边。默认为-5
        Offset : {X:-5,Y:-5},
        
        //X,Y方向的阴影扩展，用于控制阴影的宽高度，例如1代表阴影宽高度比对象大小大1，默认为0
        Extend : {X:0,Y:0},
        
        //添加阴影后执行的事件,传入的参数依次为要要添加阴影的对象，阴影对象
        AfterAddShadow : null,
        
        //清除阴影前执行的事件,传入的参数依次为要要添加阴影的对象，阴影对象
        BeforeClearShadow : null
    };
    
    //在指定对象下创建一个CornerShadow控件
    $.fn.CreateCornerShadow = function(id,opts){
        //获取参数
        opts = $.extend({}, $.CornerShadow.defaults, opts || {});
        opts.Offset = $.extend({}, $.CornerShadow.defaults.Offset, opts.Offset || {});
        opts.Extend = $.extend({}, $.CornerShadow.defaults.Extend, opts.Extend || {});
        
        //循环对每个对象进行处理
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            //检验是否绝对定位，否则不处理
             if(obj.css("position") == "static" || obj.css("position") == "relative"){
                continue;
             }
             
             //检验是否有x方向和y方向的位置信息，如果没有，也不处理
             if((obj.css("left") == "auto" && obj.css("right") == "auto") || (obj.css("top") == "auto" && obj.css("bottom") == "auto")){
                continue;
             }
            
            //自定义id
            var tempid = id;
            if(tempid === undefined || tempid == ""){
                var autoidnum = 0;
                while(true){
                    if($("#CornerShadow_"+autoidnum).length > 0){
                        autoidnum++;
                    }
                    else{
                        tempid = "CornerShadow_"+autoidnum;
                        break;
                    }
                }
            }
 
             //创建阴影对象
             var HTML = "";
             var Sobj = null;
             if(opts.ForcePicShadow || !$.browser.msie){
                //使用图片阴影
                HTML = "<DIV id='"+tempid+"' selftype='CornerShadow' class='"+opts.CssBefore+"_PicShadow'> \
                        <table CornerShadowType='Table' class='CornerShadowTable' cellpadding='0' cellspacing='0'> \
                            <tr CornerShadowType='TopTr' class='CornerShadowTopTr'> \
                                <td CornerShadowType='TopTdLeft' class='CornerShadowTopTdLeft'>&nbsp;</td> \
                                <td CornerShadowType='TopTdCenter' class='CornerShadowTopTdCenter'>&nbsp;</td> \
                                <td CornerShadowType='TopTdRight' class='CornerShadowTopTdRight'>&nbsp;</td> \
                            </tr> \
                            <tr CornerShadowType='MidTr' class='CornerShadowMidTr'> \
                                <td CornerShadowType='MidTdLeft' class='CornerShadowMidTdLeft'>&nbsp;</td> \
                                <td CornerShadowType='MidTdCenter' class='CornerShadowMidTdCenter' style='height:188px;'>&nbsp;</td> \
                                <td CornerShadowType='MidTdRight' class='CornerShadowMidTdRight'>&nbsp;</td> \
                            </tr> \
                            <tr CornerShadowType='BtmTr' class='CornerShadowBtmTr'> \
                                <td CornerShadowType='BtmTdLeft' class='CornerShadowBtmTdLeft'>&nbsp;</td> \
                                <td CornerShadowType='BtmTdCenter' class='CornerShadowBtmTdCenter'>&nbsp;</td> \
                                <td CornerShadowType='BtmTdRight' class='CornerShadowBtmTdRight'>&nbsp;</td> \
                            </tr> \
                        </table> \
                    </DIV>";
             }
             else{
                //IE
                HTML = "<DIV id='"+tempid+"' selftype='CornerShadow' class='"+opts.CssBefore+"_IE' style='FILTER: progid:DXImageTransform.Microsoft.alpha(opacity=50) progid:DXImageTransform.Microsoft.Blur(pixelradius="+opts.CornerSize+"); '></DIV>";
             }
             
             
             //添加对象
             $(obj.get(0).parentNode).append(HTML);
             Sobj = $(obj.get(0).parentNode).children("#"+tempid);
             
             //绑定参数
             Sobj.data("CornerShadowOpts",opts);
             Sobj.data("CornerShadowObj",obj);
             obj.attr("CornerShadowID",tempid);
            
             ReSetCornerShadowSize(obj,Sobj,opts);
             
             //绑定改变大小事件
             if(opts.AutoSizeChange){
                obj.bind("resize",$.CornerShadowResize);
             }
             
             //执行添加Shadow后的事件
             if(opts.AfterAddShadow != null){
                try{
                    opts.AfterAddShadow(obj,Sobj);
                }catch(e){;}
             }
        }
    };
    
    //清除阴影
    $.fn.ClearCornerShadow = function(){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            var Sobj = $(obj.get(0).parentNode).children("#"+obj.attr("CornerShadowID"));
            var opts = Sobj.data("CornerShadowOpts");
            
            //清除对象中带有的内容
            obj.removeAttr("CornerShadowID");
            if(opts.AutoSizeChange){
                obj.unbind("resize",$.CornerShadowResize);
            }
            
            //删除对象
            Sobj.remove();
        }
    };
    
    //隐藏阴影
    $.fn.HideCornerShadow = function(){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            var Sobj = $(obj.get(0).parentNode).children("#"+obj.attr("CornerShadowID"));
            Sobj.css("display","none");
        }
    };
    
    //显示阴影
    $.fn.ShowCornerShadow = function(){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            var Sobj = $(obj.get(0).parentNode).children("#"+obj.attr("CornerShadowID"));
            var opts = Sobj.data("CornerShadowOpts");
            
            Sobj.css("display","block");
            var position = obj.position();
            if(obj.outerWidth().toString() != Sobj.attr("CornerShadowObjWidth") || obj.outerHeight().toString() != Sobj.attr("CornerShadowObjHeight") || position.left.toString() != Sobj.attr("CornerShadowObjLeft") || position.top.toString() != Sobj.attr("CornerShadowObjTop")){
                ReSetCornerShadowSize(obj,Sobj,opts);
            }
            
        }
    };
    
    //获得阴影对象
    $.fn.GetCornerShadow = function(){
        var obj = $(this.get(0));
        return $(obj.get(0).parentNode).children("#"+obj.attr("CornerShadowID"));
    };
    
    //内部函数
    //重新设置阴影的大小和位置
    function ReSetCornerShadowSize(obj,Sobj,opts){
        //是否显示
        var isShow = true;
        if(Sobj.css("display") == "none"){
            isShow = false;
            Sobj.css("display","block");
        }
        
        //获得与对象相关的参数start
         var zindex = parseInt(obj.css("z-index"))-1;
         if(isNaN(zindex)){
            zindex = -1;
         }
         
         //大小和位置
         var width = obj.outerWidth() + opts.Extend.X;
         var height = obj.outerHeight() + opts.Extend.Y;
         var tempi = parseInt(obj.css("margin-left").slice(0,-2));
         var addOffsetX = (isNaN(tempi)?0:tempi)-Math.ceil(opts.Extend.X/2);
         tempi = parseInt(obj.css("margin-top").slice(0,-2));
         var addOffsetY = (isNaN(tempi)?0:tempi)-Math.ceil(opts.Extend.Y/2);
         var xpos = (obj.css("left") == "auto" ? "right:'"+(parseInt(obj.css("right").slice(0,-2))+opts.Offset.X+addOffsetX) : "left:'"+(parseInt(obj.css("left").slice(0,-2))-opts.Offset.X+addOffsetX)) + "px'";
         var ypos = (obj.css("top") == "auto" ? "bottom:'"+(parseInt(obj.css("bottom").slice(0,-2))+opts.Offset.Y+addOffsetY) : "top:'"+(parseInt(obj.css("top").slice(0,-2))-opts.Offset.Y+addOffsetY)) + "px'";
         //获得与对象相关的参数end
         
         //设置样式
         if(opts.ForcePicShadow || !$.browser.msie){
            //使用图片阴影
            Sobj.css({"Z-INDEX":zindex,width:width+"px",height:width+"px"});
            eval("Sobj.css({"+xpos+","+ypos+"});");
            
            //中间表格的高度
            Sobj.find("td[CornerShadowType='MidTdCenter']").css("height",(height - Sobj.find("td[CornerShadowType='TopTdCenter']").outerHeight(true) - Sobj.find("td[CornerShadowType='BtmTdCenter']").outerHeight(true)) + "px");
         }
         else{
            //IE
            Sobj.css({"Z-INDEX":zindex,width:(width-opts.CornerSize*2)+"px",height:(height-opts.CornerSize*2)+"px"});
            eval("Sobj.css({"+xpos+","+ypos+"});");
         }
         
         //将对象大小和位置记录下来，用于下次比较是否需重新设置
         Sobj.attr("CornerShadowObjWidth",obj.outerWidth());
         Sobj.attr("CornerShadowObjHeight",obj.outerHeight());
         var position = obj.position();
         Sobj.attr("CornerShadowObjLeft",position.left);
         Sobj.attr("CornerShadowObjTop",position.top);
         
         //重新隐藏
         if(!isShow){
            Sobj.css("display","none");
         }
    };
    
    //添加阴影的对象的改变大小事件执行函数
    $.CornerShadowResize = function(){
        var obj = $(this);
        var Sobj = $(obj.get(0).parentNode).children("#"+obj.attr("CornerShadowID"));
        var opts = Sobj.data("CornerShadowOpts");

        if(opts.AutoSizeChange && Sobj.css("display") != "none"){
            if(obj.outerWidth().toString() != Sobj.attr("CornerShadowObjWidth") || obj.outerHeight().toString() != Sobj.attr("CornerShadowObjHeight")){
                ReSetCornerShadowSize(obj,Sobj,opts);
            }
        }
    };

})(jQuery);