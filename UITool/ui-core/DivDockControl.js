/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：DivDockControl
说明：窗口拖拽控制，支持同时拖拽多个对象，但前提是对象样式的position为absolute
文件：DivDockControl.js
依赖文件：jquery-1.6.4.min.js
-----------------------*/

/*-----------------------
==DivDockControl==
说明：容器位置绑定控件，用于将控件绑定在父容器的指定位置，例如top,bottom,left,right,center

对于位置控制的理解：
1、$("#ttt").width() : css中的width
2、$("#ttt").outerWidth() : 边框大小*2+padding*2+width
3、$("#ttt").outerWidth(true) : margin*2+边框大小*2+padding*2+width
4、对象的实际显示位置：css.left+css("margin-left") : css.top+css("margin-top")
5、对象内容的实际显示位置：对象的实际显示位置+边框大小+padding
6、边框大小：.parseInt($("#ttt").css("border-left-width").slice(0,-2));
7、margin大小：.css("margin-left")=="auto" ? 0 : parseInt(.css("margin-left").slice(0,-2));
8、padding大小：parseInt($("#ttt").css("padding-left").slice(0,-2));
9、去掉px结尾的通用方法：parseInt($("#ttt").css("margin-top").slice(0,-2));

-----------------------*/

;(function($) {
    /*
      --DivSetDock--
      $("").DivSetDock(Pos,opts)
         为选中的对象设置绑定位置，注意，绑定了参数后，改变对象大小必须同时改变关联对象的大小，否则可能会出现对位不齐的问题
         Pos : 需设置的位置描述，有以下几类
             top - 位于父容器顶端，宽度与父容器一致
             bottom - 位于父容器底端，宽度与父容器一致
             left - 位于父容器左侧，高度为父容器高度-top bottom对象高度
             right - 位于父容器右侧，高度为父容器高度-top bottom对象高度
             center - 位于父容器中间，高度宽度受四边对象的限制
     */
     $.fn.DivSetDock = function(Pos,opts) {
        //判断传入的参数start
        switch(Pos){
            case "top":
            case "bottom":
            case "left":
            case "right":
            case "center":
                break;
            default :
                return;
        }
        
        var DefaultOpts = {
            //是否自动扩展填充整个版面，默认为false，该参数对于center无效
            fullSize : false,
            
            //对象的最小宽度，默认为0
            minWidth : 0,
            
            //对象的最小高度，默认为0
            minHeight : 0,
            
            //改变大小控件div的宽度，默认为0（即没有改变大小控件），同时该控件与Pos相关，例如top时则创建紧连top的控件,注意，如果对象有边框的情况，将可能导致改变大小控件无法选中（透明的情况）
            resizeBarWidth : 0,
            
            //改变大小控件div的位置，inner-在对象内部，outer-在对象外部,center-在对象边框正中间
            resizeBarPos : "inner",
            
            //改变大小控件的样式，注意不要在该样式里设置大小等样式，否则可能显示会不准确
            resizeBarCss : {
                //背景颜色
                "background-color" : ""
            }
        };
        
        opts = $.extend({}, DefaultOpts, opts || {});
        opts.resizeBarCss = $.extend({}, DefaultOpts.resizeBarCss, opts.resizeBarCss || {});
        
        var fullSize = opts.fullSize;
        var minWidth = opts.minWidth;
        var minHeight = opts.minHeight;
        var resizeBarWidth = opts.resizeBarWidth;
        var resizeBarPos = opts.resizeBarPos;
        
        //判断传入的参数end
        
        //循环对选择对象进行处理start
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            if(obj.css("display") == "none"){
                //对象被隐藏，不做处理
                continue;
            }
            
            var parent = $(this.get(i).parentNode);        
            var dockpara;  //父节点的绑定参数
            //初始化父节点start
            if(parent.attr("dockparent") != "true"){
                //设置父节点参数start
                parent.attr("dockparent","true");
                dockpara = new Object();
                dockpara.width = parent.width();
                dockpara.height = parent.height();
                dockpara.startx = parseInt(parent.css("padding-left").slice(0,-2));
                dockpara.starty = parseInt(parent.css("padding-top").slice(0,-2));
                dockpara.minWidth = 0;
                dockpara.minHeight = 0;
                
                dockpara.top = new Object();
                dockpara.top.width = 0;
                dockpara.top.height = 0;
                dockpara.top.minWidth = 0;
                dockpara.top.minHeight = 0;
                dockpara.top.realMinWidth = 0; //这个是对象的真实大小限制
                dockpara.top.realMinHeight = 0; //这个是对象的真实大小限制
                dockpara.top.visible = false; //对象是否可见
                dockpara.top.fullSize = false; //对象是否自动扩充
                
                dockpara.bottom = new Object();
                dockpara.bottom.width = 0;
                dockpara.bottom.height = 0;
                dockpara.bottom.minWidth = 0;
                dockpara.bottom.minHeight = 0;
                dockpara.bottom.realMinWidth = 0; //这个是对象的真实大小限制
                dockpara.bottom.realMinHeight = 0; //这个是对象的真实大小限制
                dockpara.bottom.visible = false; //对象是否可见
                dockpara.bottom.fullSize = false; //对象是否自动扩充
                
                dockpara.left = new Object();
                dockpara.left.width = 0;
                dockpara.left.height = 0;
                dockpara.left.minWidth = 0;
                dockpara.left.minHeight = 0;
                dockpara.left.realMinWidth = 0; //这个是对象的真实大小限制
                dockpara.left.realMinHeight = 0; //这个是对象的真实大小限制
                dockpara.left.visible = false; //对象是否可见
                dockpara.left.fullSize = false; //对象是否自动扩充
                
                dockpara.right = new Object();
                dockpara.right.width = 0;
                dockpara.right.height = 0;
                dockpara.right.minWidth = 0;
                dockpara.right.minHeight = 0;
                dockpara.right.realMinWidth = 0; //这个是对象的真实大小限制
                dockpara.right.realMinHeight = 0; //这个是对象的真实大小限制
                dockpara.right.visible = false; //对象是否可见
                dockpara.right.fullSize = false; //对象是否自动扩充
                
                dockpara.center = new Object();
                dockpara.center.width = 0;
                dockpara.center.height = 0;
                dockpara.center.minWidth = 0;
                dockpara.center.minHeight = 0;
                dockpara.center.realMinWidth = 0; //这个是对象的真实大小限制
                dockpara.center.realMinHeight = 0; //这个是对象的真实大小限制
                dockpara.center.visible = false; //对象是否可见
                
                parent.data("dockpara",dockpara);
                //绑定改变大小时的处理事件
                parent.bind("resize",DockParentSizeChange);
                
                //设置父节点参数end
            }
            else{
                //判断是否已设置过位置start
                dockpara = parent.data("dockpara");
                if(parent.children("[dockchild='"+Pos+"']").length > 0){
                    //已经设置过了
                    continue;
                }
                //判断是否已设置过位置end
            }
            //初始化父节点end
            
            //设置当前节点信息start
            obj.attr("dockchild",Pos);
            
            //记录对象原来的信息，以便恢复使用
            var objbakinfo = new Object();
            objbakinfo.position = obj.css("position");
            objbakinfo.width = obj.get(0).style.width;
            objbakinfo.height = obj.get(0).style.height;
            objbakinfo.left = obj.css("left");
            objbakinfo.top = obj.css("top");
            obj.data("dockchildbakinfo",objbakinfo);
            
            obj.css("position","absolute");
            
            //计算相应的大小值
            var Owidth = minWidth + obj.outerWidth(true) - obj.width();
            var Oheight = minHeight + obj.outerHeight(true) - obj.height();
            switch(Pos){
                case "top":
                    dockpara.top.width = minWidth;
                    dockpara.top.height = Math.max(obj.outerHeight(true),minHeight);
                    //根据margin和边框等信息确定对象的最小大小和最小高度
                    dockpara.top.minWidth = Owidth;
                    dockpara.top.minHeight = Oheight;
                    dockpara.top.realMinWidth = minWidth;
                    dockpara.top.realMinHeight = minHeight;
                    dockpara.top.visible = true;
                    dockpara.top.fullSize = fullSize;
                    //改变大小bar
                    parent.append("<div dockresizebar='"+Pos+"' dockresizebarpos='"+resizeBarPos+"' style='width:0px;height:"+resizeBarWidth+"px;border:0px solid #000;cursor:n-resize;padding:0px; margin:0px;overflow:hidden;position:absolute;z-index:"+(parent.css("z-index")+204)+";'></div>");
                    parent.children("[dockresizebar='"+Pos+"']").bind("mousedown",DockResizeBarMouseDown); //鼠标被按下的情况
                    break;
                case "bottom":
                    dockpara.bottom.width = minWidth;
                    dockpara.bottom.height = Math.max(obj.outerHeight(true),minHeight);
                    dockpara.bottom.minWidth = Owidth;
                    dockpara.bottom.minHeight = Oheight;
                    dockpara.bottom.realMinWidth = minWidth;
                    dockpara.bottom.realMinHeight = minHeight;
                    dockpara.bottom.visible = true;
                    dockpara.bottom.fullSize = fullSize;
                    //改变大小bar
                    parent.append("<div dockresizebar='"+Pos+"' dockresizebarpos='"+resizeBarPos+"' style='width:0px;height:"+resizeBarWidth+"px;border:0px solid #000;cursor:n-resize;padding:0px; margin:0px;overflow:hidden;position:absolute;z-index:"+(parent.css("z-index")+203)+";'></div>");
                    parent.children("[dockresizebar='"+Pos+"']").bind("mousedown",DockResizeBarMouseDown); //鼠标被按下的情况
                    break;
                case "left":
                    dockpara.left.width = Math.max(obj.outerWidth(true),minWidth);
                    dockpara.left.height = minHeight;
                    dockpara.left.minWidth = Owidth;
                    dockpara.left.minHeight = Oheight;
                    dockpara.left.realMinWidth = minWidth;
                    dockpara.left.realMinHeight = minHeight;
                    dockpara.left.visible = true;
                    dockpara.left.fullSize = fullSize;
                    //改变大小bar
                    parent.append("<div dockresizebar='"+Pos+"' dockresizebarpos='"+resizeBarPos+"' style='width:"+resizeBarWidth+"px;height:0px;border:0px solid #000;cursor:e-resize;padding:0px; margin:0px;overflow:hidden;position:absolute;z-index:"+(parent.css("z-index")+202)+";'></div>");
                    parent.children("[dockresizebar='"+Pos+"']").bind("mousedown",DockResizeBarMouseDown); //鼠标被按下的情况
                    break;
                case "right":
                    dockpara.right.width = Math.max(obj.outerWidth(true),minWidth);
                    dockpara.right.height = minHeight;
                    dockpara.right.minWidth = Owidth;
                    dockpara.right.minHeight = Oheight;
                    dockpara.right.realMinWidth = minWidth;
                    dockpara.right.realMinHeight = minHeight;
                    dockpara.right.visible = true;
                    dockpara.right.fullSize = fullSize;
                    //改变大小bar
                    parent.append("<div dockresizebar='"+Pos+"' dockresizebarpos='"+resizeBarPos+"' style='width:"+resizeBarWidth+"px;height:0px;border:0px solid #000;cursor:e-resize;padding:0px; margin:0px;overflow:hidden;position:absolute;z-index:"+(parent.css("z-index")+201)+";'></div>");
                    parent.children("[dockresizebar='"+Pos+"']").bind("mousedown",DockResizeBarMouseDown); //鼠标被按下的情况
                    break;
                case "center":
                    dockpara.center.width = minWidth;
                    dockpara.center.height = minHeight;
                    dockpara.center.minWidth = Owidth;
                    dockpara.center.minHeight = Oheight;
                    dockpara.center.realMinWidth = minWidth;
                    dockpara.center.realMinHeight = minHeight;
                    dockpara.center.visible = true;
                    break;
                default :
                    return;
            }
            
            parent.children("div[dockresizebar='"+Pos+"']").css(opts.resizeBarCss);
            //设置当前节点信息end
            
            //重新计算并设置对象位置start
            DivDockComputePara(dockpara);
            if(parent.width() == dockpara.width && parent.height() == dockpara.height){
                //父容器无需改变大小
                DivDockRetSetChildSize(parent,dockpara);
            }
            else{
                //改变父容器大小，由改变大小事件自行触发
                parent.data("dockpara",dockpara);
                parent.css({width:dockpara.width+"px",height:dockpara.height+"px"});
            }
            //重新计算并设置对象位置end
        }
        //循环对选择对象进行处理end
     };
     
     /*
      --DivClearDock--
      $("").DivClearDock([clearChild])
         为选中的对象解除绑定位置
         [clearChild] : 是否清除子对象的绑定参数，默认为false，这个参数仅在对象既为父容器，也是绑定对象的情况下使用
     */
     $.fn.DivClearDock = function() {
        var clearChild = true;
        if(arguments.length > 0){
            clearChild = arguments[0];
        }
        //循环对选择对象进行处理start
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            var ischild = false;
            var isparent = false;
            var pos = obj.attr("dockchild");
            if(pos != "" && pos != null && pos !== undefined){
                ischild = true;
            }
            if(obj.attr("dockparent") == "true"){
                isparent = true;
            }
            
            //进行判断和处理start
            if(ischild || isparent){
                if((ischild && !isparent) || (ischild && isparent && !clearChild)){
                    //清除子对象绑定情况start
                    var parent = $(this.get(i).parentNode);
                    var dockpara = parent.data("dockpara");
                    var exejs = "dockpara."+pos+".width = 0;  \
                                 dockpara."+pos+".height = 0;  \
                                 dockpara."+pos+".minWidth = 0;  \
                                 dockpara."+pos+".minHeight = 0;  \
                                 dockpara."+pos+".realMinWidth = 0;  \
                                 dockpara."+pos+".realMinHeight = 0;  \
                                 dockpara."+pos+".visible = false;";
                    eval(exejs);
                    if(pos != "center"){
                        //非中间对象，还要去掉fullSize参数和改变大小bar
                        exejs = "dockpara."+pos+".fullSize = false";
                        eval(exejs);
                        parent.children("div[dockresizebar='"+pos+"']").remove();
                    }
                    //去掉对象的标记
                    obj.removeAttr("dockchild");
                    
                    //重设对象
                    if(dockpara.top.visible || dockpara.bottom.visible || dockpara.left.visible || dockpara.right.visible || dockpara.center.visible){
                        DivDockComputePara(dockpara);
                        DivDockRetSetChildSize(parent,dockpara);
                    }
                    else{
                        //父容器已经没有任何一个子对象了
                        parent.unbind("resize",DockParentSizeChange);
                        parent.removeData("dockpara");
                        parent.removeAttr("dockparent");
                    }
                    //清除子对象绑定情况end
                }
                else{
                    //清除父对象的所有dock配置start
                    obj.unbind("resize",DockParentSizeChange);
                    obj.children("div[dockresizebar]").remove(); //清除所有的改变大小bar
                    obj.children("[dockchild]").removeAttr("dockchild");
                    obj.removeData("dockpara");
                    obj.removeAttr("dockparent");
                    //清除父对象的所有dock配置end
                }
            }
            else{
                //既不是子对象也不是父容器
                continue;
            }
            //进行判断和处理end
        }
        //循环对选择对象进行处理end
     };
     
     /*
      --DockChildResize--
      $("").DockChildResize(Width,Height,[isDock])
         改变Dock中选中对象的大小
         Width : 新宽度
         Height : 新高度
         isDock : 是否dock的宽度/高度，false-代表对象取的是对象css的宽度/高度
     */
     $.fn.DockChildResize = function(Width,Height) {
        var isDock = false;
        if(arguments.length > 2){
            isDock = arguments[2];
        }
        
        //循环对选择对象进行处理start
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            var pos = obj.attr("dockchild");
            var parent = $(this.get(i).parentNode);        
            
            if(parent.attr("dockparent") != "true" || pos === undefined || pos == null || obj.css("display") == "none"){
                //不是dock对象，或者为隐藏状态，继续处理下一个
                continue;
            }
            
            var dockpara = parent.data("dockpara");  //父节点的绑定参数
            
            //区别对待不同位置，进行处理start
            switch(pos){
                case "top":
                    dockpara.top.height = (isDock ? Height : (Height + (obj.outerHeight(true) - obj.height())));
                    break;
                case "bottom":
                    if(dockpara.top.visible){
                        dockpara.top.height = dockpara.top.height - (isDock ? (Height - dockpara.bottom.height) : (Height - obj.height()));
                        dockpara.bottom.height = (isDock ? Height : (Height + (obj.outerHeight(true) - obj.height())));
                    }
                    else{
                        dockpara.bottom.height = (isDock ? Height : (Height + (obj.outerHeight(true) - obj.height())));
                    }
                    break;
                case "left":
                case "right":
                case "center":
                    var centerheight = 0;
                    if(pos == "left"){
                        dockpara.left.width = (isDock ? Width : Width + (obj.outerWidth(true) - obj.width()));
                        centerheight = dockpara.left.height;
                    }
                    else if(pos == "right"){
                        centerheight = dockpara.right.height;
                        if(dockpara.left.visible){
                            dockpara.left.width = dockpara.left.width - (isDock ? (Width - dockpara.right.width) : (Width - obj.width()));
                            dockpara.right.width = (isDock ? Width : (Width + (obj.outerWidth(true) - obj.width())));
                        }
                        else{
                            dockpara.right.width = (isDock ? Width : (Width + (obj.outerWidth(true) - obj.width())));
                        }
                    }
                    else{
                        //中间对象
                        centerheight = dockpara.center.height;
                        if(dockpara.left.visible || dockpara.right.visible){
                            //只有在左右存在上下的情况才这样做
                            var wminstep = dockpara.center.minWidth  - dockpara.center.width;
                            var wmaxstep = (dockpara.left.visible ? dockpara.left.width - dockpara.left.minWidth : 0) + (dockpara.right.visible ? dockpara.right.width - dockpara.right.minWidth : 0);
                            var wstep = (isDock ? Width : Width + (obj.outerWidth(true) - obj.width())) - dockpara.center.width;
                            if(wstep < wminstep){
                                wstep = wminstep;
                            }
                            else if(wstep > wmaxstep){
                                wstep = wmaxstep;
                            }
                            
                            if(dockpara.right.visible){
                                //先改变右对象的值
                                if(dockpara.right.width - dockpara.right.minWidth >= wstep){
                                    //只需改变右面值
                                    dockpara.right.width = dockpara.right.width - wstep;
                                }
                                else{
                                    //需改变上下值
                                    wstep = wstep - (dockpara.right.width - dockpara.right.minWidth);
                                    dockpara.right.width = dockpara.right.minWidth;
                                    dockpara.left.width = dockpara.left.width - wstep;
                                }
                            }
                            else{
                                //只能改变左边值
                                dockpara.left.width = dockpara.left.width - wstep;
                            }
                        }
                    }
                    
                    //以下代码为中间对象通用的高度调整代码
                    if(dockpara.top.visible || dockpara.bottom.visible){
                        //只有存在上下的情况才这样做
                        var minstep = Math.max(Math.max((dockpara.left.visible ? dockpara.left.minHeight : 0),(dockpara.right.visible ? dockpara.right.minHeight : 0)),(dockpara.center.visible ? dockpara.center.minHeight : 0)) - centerheight;
                        var maxstep = (dockpara.top.visible ? dockpara.top.height - dockpara.top.minHeight : 0) + (dockpara.bottom.visible ? dockpara.bottom.height - dockpara.bottom.minHeight : 0);
                        var step =  (isDock ? Height : Height + (obj.outerHeight(true) - obj.height())) - centerheight;
                        if(step < minstep){
                            step = minstep;
                        }
                        else if(step > maxstep){
                            step = maxstep;
                        }
                        
                        if(dockpara.bottom.visible){
                            //先改变下对象的值
                            if(dockpara.bottom.height - dockpara.bottom.minHeight >= step){
                                //只需改变下面值
                                dockpara.bottom.height = dockpara.bottom.height - step;
                            }
                            else{
                                //需改变上下值
                                step = step - (dockpara.bottom.height - dockpara.bottom.minHeight);
                                dockpara.bottom.height = dockpara.bottom.minHeight;
                                dockpara.top.height = dockpara.top.height - step;
                            }
                        }
                        else{
                            //只能改变上边值
                            dockpara.top.height = dockpara.top.height - step;
                        }
                    }
                    break;
                default :
                    continue;
                    break;
            }
            //区别对待不同位置，进行处理end
            //重置大小
            DivDockComputePara(dockpara);
            DivDockRetSetChildSize(parent,dockpara);
        }
        //循环对选择对象进行处理end
     };
     
     /*
      --DockChildHide--
      $("").DockChildHide()
         隐藏dock中的对象，这些对象不能用一般的方式隐藏
     */
     $.fn.DockChildHide = function() {
        //循环对选择对象进行处理start
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            var pos = obj.attr("dockchild");
            var parent = $(this.get(i).parentNode);        
            
            if(parent.attr("dockparent") != "true" || pos === undefined || pos == null || obj.css("display") == "none"){
                //不是dock对象，直接隐藏，继续处理下一个
                obj.hide();
                continue;
            }
            var dockpara = parent.data("dockpara");  //父节点的绑定参数
            var oldpara = new Object();
            var exejs = "oldpara.width = dockpara."+pos+".width; \
                         oldpara.height = dockpara."+pos+".height;";
            eval(exejs);
            obj.data("dockchildhidepara",oldpara);//保存历史大小信息
            exejs = "dockpara."+pos+".width = 0; \
                     dockpara."+pos+".height = 0; \
                     dockpara."+pos+".visible = false;";
            eval(exejs);
            obj.hide();
            //重置大小
            DivDockComputePara(dockpara);
            DivDockRetSetChildSize(parent,dockpara);
        }
        //循环对选择对象进行处理end
     };
     
     /*
      --DockChildShow--
      $("").DockChildShow()
         显示dock中的隐藏的对象，这些对象不能用一般的方式显示
     */
     $.fn.DockChildShow = function() {
        //循环对选择对象进行处理start
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            var pos = obj.attr("dockchild");
            var parent = $(this.get(i).parentNode);        
            
            if(parent.attr("dockparent") != "true" || pos === undefined || pos == null || obj.css("display") != "none"){
                //不是dock对象，直接隐藏，继续处理下一个
                obj.show();
                continue;
            }
            
            var dockpara = parent.data("dockpara");  //父节点的绑定参数
            var oldpara = obj.data("dockchildhidepara");
            obj.removeData("dockchildhidepara");
            var exejs = "dockpara."+pos+".width = oldpara.width; \
                     dockpara."+pos+".height = oldpara.height; \
                     dockpara."+pos+".visible = true;";
            eval(exejs);
            obj.show();
            //重置大小
            DivDockComputePara(dockpara);
            DivDockRetSetChildSize(parent,dockpara);
        }
        //循环对选择对象进行处理end
     };
     
     
     //以下为内部函数
     /*
      --JQuery_UITool_DockResizeBar--
         内部变量，改变大小bar鼠标按下和拖动操作需要使用的临时变量
    */
    var JQuery_UITool_DockResizeBar = null;
    
    /*
      --DockResizeBarMouseDown--
      DockResizeBarMouseDown()
         内部函数，改变大小bar鼠标按下的操作，开始拖动操作
    */
    function DockResizeBarMouseDown(){
        
        JQuery_UITool_DockResizeBar = $(this);
        JQuery_UITool_DockResizeBar.para = new Object();
        JQuery_UITool_DockResizeBar.para.startx = event.clientX;
        JQuery_UITool_DockResizeBar.para.starty = event.clientY;
        JQuery_UITool_DockResizeBar.para.lastx = event.clientX;
        JQuery_UITool_DockResizeBar.para.lasty = event.clientY;
        
        JQuery_UITool_DockResizeBar.para.pos = JQuery_UITool_DockResizeBar.attr("dockresizebar");
        JQuery_UITool_DockResizeBar.para.parentobj = $(this.parentNode);
        var dockpara = JQuery_UITool_DockResizeBar.para.parentobj.data("dockpara");  //当前的位置参数
        JQuery_UITool_DockResizeBar.para.parentstartx = dockpara.startx;
        JQuery_UITool_DockResizeBar.para.parentstarty = dockpara.starty;
        
        switch(JQuery_UITool_DockResizeBar.para.pos){
            case "top":
                //先获得要处理的对象以及最小大小判断
                JQuery_UITool_DockResizeBar.para.upobj = JQuery_UITool_DockResizeBar.para.parentobj.children("[dockchild='top']"); //上边的对象
                JQuery_UITool_DockResizeBar.para.downobj = JQuery_UITool_DockResizeBar.para.parentobj.children(":visible[dockchild='left'],:visible[dockchild='center'],:visible[dockchild='right']"); //下边的对象
                
                JQuery_UITool_DockResizeBar.para.bartop = parseInt(JQuery_UITool_DockResizeBar.css("top").slice(0,-2));
                JQuery_UITool_DockResizeBar.para.upheight = dockpara.top.height; //上边对象的高度
                JQuery_UITool_DockResizeBar.para.minstep = dockpara.top.minHeight - dockpara.top.height; //允许往上的最大距离 < 0
                
                if(JQuery_UITool_DockResizeBar.para.downobj.length == 0){
                    //只有顶和底的情况
                    JQuery_UITool_DockResizeBar.para.downobj = JQuery_UITool_DockResizeBar.para.parentobj.children("[dockchild='bottom']");
                    JQuery_UITool_DockResizeBar.para.maxstep = dockpara.bottom.height - dockpara.bottom.minHeight;
                    JQuery_UITool_DockResizeBar.para.downheight = dockpara.bottom.height;
                    JQuery_UITool_DockResizeBar.para.iscenter = false;
                }
                else{
                    JQuery_UITool_DockResizeBar.para.maxstep = dockpara.left.height - Math.max(Math.max(dockpara.left.minHeight,dockpara.right.minHeight),dockpara.center.minHeight); //允许往下的最大距离
                    JQuery_UITool_DockResizeBar.para.downheight = dockpara.left.height; //下边对象宽高
                    JQuery_UITool_DockResizeBar.para.iscenter = true;
                }
                break;
            case "bottom":
                JQuery_UITool_DockResizeBar.para.upobj = JQuery_UITool_DockResizeBar.para.parentobj.children(":visible[dockchild='left'],:visible[dockchild='center'],:visible[dockchild='right']"); //上边的对象
                if(JQuery_UITool_DockResizeBar.para.upobj.length == 0){
                    //不应存在只有顶和底，而且能改变大小的情况
                    return;
                }
                
                JQuery_UITool_DockResizeBar.para.downobj = JQuery_UITool_DockResizeBar.para.parentobj.children("[dockchild='bottom']"); //下边的对象
                JQuery_UITool_DockResizeBar.para.bartop = parseInt(JQuery_UITool_DockResizeBar.css("top").slice(0,-2));
                
                JQuery_UITool_DockResizeBar.para.minstep = Math.max(Math.max(dockpara.left.minHeight,dockpara.right.minHeight),dockpara.center.minHeight) - dockpara.left.height;//允许往上的最大距离 < 0
                JQuery_UITool_DockResizeBar.para.maxstep = dockpara.bottom.height - dockpara.bottom.minHeight; //允许往下的最大距离 > 0
                
                JQuery_UITool_DockResizeBar.para.upheight = dockpara.left.height; //上边对象的高度
                JQuery_UITool_DockResizeBar.para.downheight = dockpara.bottom.height; //下边对象宽高
                break;
            case "left":
                JQuery_UITool_DockResizeBar.para.leftobj = JQuery_UITool_DockResizeBar.para.parentobj.children("[dockchild='left']"); //左边的对象
                JQuery_UITool_DockResizeBar.para.centerobj = JQuery_UITool_DockResizeBar.para.parentobj.children("[dockchild='center']"); //右边的对象
                
                JQuery_UITool_DockResizeBar.para.barleft = parseInt(JQuery_UITool_DockResizeBar.css("left").slice(0,-2));
                JQuery_UITool_DockResizeBar.para.minstep = dockpara.left.minWidth - dockpara.left.width; //允许往左的最大距离 < 0
                JQuery_UITool_DockResizeBar.para.leftwidth = dockpara.left.width; //左边对象的高度
                if(JQuery_UITool_DockResizeBar.para.centerobj.length == 0){
                    //没有中间对象的情况
                    JQuery_UITool_DockResizeBar.para.centerobj = JQuery_UITool_DockResizeBar.para.parentobj.children("[dockchild='right']"); //右边的对象
                    JQuery_UITool_DockResizeBar.para.maxstep = dockpara.right.width - dockpara.right.minWidth; //允许往右的最大距离
                    JQuery_UITool_DockResizeBar.para.centerwidth = dockpara.right.width; //中间对象宽高
                    JQuery_UITool_DockResizeBar.para.iscenter = false;
                }
                else{
                    //中间对象
                    JQuery_UITool_DockResizeBar.para.maxstep = dockpara.center.width - dockpara.center.minWidth; //允许往右的最大距离
                    JQuery_UITool_DockResizeBar.para.centerwidth = dockpara.center.width; //中间对象宽高
                    JQuery_UITool_DockResizeBar.para.iscenter = true;
                }  
                break;
            case "right":
                JQuery_UITool_DockResizeBar.para.rightobj = JQuery_UITool_DockResizeBar.para.parentobj.children("[dockchild='right']"); //右边的对象
                JQuery_UITool_DockResizeBar.para.centerobj = JQuery_UITool_DockResizeBar.para.parentobj.children("[dockchild='center']"); //中间的对象
                if(JQuery_UITool_DockResizeBar.para.centerobj.length == 0){
                    //没有中间对象的情况
                    return;
                }
                
                JQuery_UITool_DockResizeBar.para.barleft = parseInt(JQuery_UITool_DockResizeBar.css("left").slice(0,-2));
                JQuery_UITool_DockResizeBar.para.minstep = dockpara.center.minWidth - dockpara.center.width; //允许往左的最大距离 < 0
                JQuery_UITool_DockResizeBar.para.maxstep = dockpara.right.width - dockpara.right.minWidth; //允许往右的最大距离
                
                JQuery_UITool_DockResizeBar.para.rightwidth = dockpara.right.width; //左边对象的高度
                JQuery_UITool_DockResizeBar.para.centerwidth = dockpara.center.width; //中间对象宽高
                break;
            default :
                return;
        }
        
        this.setCapture();
        
        //绑定窗体的鼠标移动和鼠标松开按钮
         $(document.body).bind("mousemove",DockResizeBarMouseMove);
         $(document.body).bind("mouseup",DockResizeBarEndMove);
    };
    
    /*
      --DockResizeBarMouseMove--
      DockResizeBarMouseMove()
         内部函数，改变大小bar鼠标拖动操作
    */
    function DockResizeBarMouseMove(){    
        switch(JQuery_UITool_DockResizeBar.para.pos){
            case "top":
                //判断要移动的距离
                var step = event.clientY - JQuery_UITool_DockResizeBar.para.starty;
                if(step < JQuery_UITool_DockResizeBar.para.minstep){
                    step = JQuery_UITool_DockResizeBar.para.starty + JQuery_UITool_DockResizeBar.para.minstep - JQuery_UITool_DockResizeBar.para.lasty;
                }
                else if(step > JQuery_UITool_DockResizeBar.para.maxstep){
                    step = JQuery_UITool_DockResizeBar.para.starty + JQuery_UITool_DockResizeBar.para.maxstep - JQuery_UITool_DockResizeBar.para.lasty;
                }
                else{
                    step = event.clientY - JQuery_UITool_DockResizeBar.para.lasty;
                }
                
                //控制位置
                JQuery_UITool_DockResizeBar.para.bartop += step;
                JQuery_UITool_DockResizeBar.para.upheight += step;
                JQuery_UITool_DockResizeBar.para.downheight -= step;
                JQuery_UITool_DockResizeBar.css("top",JQuery_UITool_DockResizeBar.para.bartop+"px");
                JQuery_UITool_DockResizeBar.para.upobj.css("height",(JQuery_UITool_DockResizeBar.para.upheight - (JQuery_UITool_DockResizeBar.para.upobj.outerHeight(true) - JQuery_UITool_DockResizeBar.para.upobj.height()))+"px");
                JQuery_UITool_DockResizeBar.para.downobj.css({height:function(index, value){return (parseInt(value.slice(0,-2)) - step) + "px"},
                                                              top:function(index, value){return (parseInt(value.slice(0,-2)) + step) + "px"}});
                //中间的对象,还会涉及左右拉伸框  div[dockresizebar='left'],div[dockresizebar='right']
                if(JQuery_UITool_DockResizeBar.para.iscenter){
                    JQuery_UITool_DockResizeBar.para.parentobj.children("div[dockresizebar='left'],div[dockresizebar='right']").css({height:function(index, value){ return value == "0px"? value : JQuery_UITool_DockResizeBar.para.downheight + "px"},top:function(index, value){return (JQuery_UITool_DockResizeBar.para.parentstarty +JQuery_UITool_DockResizeBar.para.upheight)+"px"}});  
                }            
                //保存当前位置
                JQuery_UITool_DockResizeBar.para.lasty += step;
                break;
            case "bottom":
                //判断要移动的距离
                var step = event.clientY - JQuery_UITool_DockResizeBar.para.starty;
                if(step < JQuery_UITool_DockResizeBar.para.minstep){
                    step = JQuery_UITool_DockResizeBar.para.starty + JQuery_UITool_DockResizeBar.para.minstep - JQuery_UITool_DockResizeBar.para.lasty;
                }
                else if(step > JQuery_UITool_DockResizeBar.para.maxstep){
                    step = JQuery_UITool_DockResizeBar.para.starty + JQuery_UITool_DockResizeBar.para.maxstep - JQuery_UITool_DockResizeBar.para.lasty;
                }
                else{
                    step = event.clientY - JQuery_UITool_DockResizeBar.para.lasty;
                }
                
                //控制位置
                JQuery_UITool_DockResizeBar.para.bartop += step;
                JQuery_UITool_DockResizeBar.para.upheight += step;
                JQuery_UITool_DockResizeBar.para.downheight -= step;
                JQuery_UITool_DockResizeBar.css("top",JQuery_UITool_DockResizeBar.para.bartop+"px");
                JQuery_UITool_DockResizeBar.para.upobj.css({height:function(index, value){return (parseInt(value.slice(0,-2)) + step) + "px";}});
                JQuery_UITool_DockResizeBar.para.downobj.css({height:(JQuery_UITool_DockResizeBar.para.downheight - (JQuery_UITool_DockResizeBar.para.downobj.outerHeight(true) - JQuery_UITool_DockResizeBar.para.downobj.height()))+"px",top:function(index, value){return (parseInt(value.slice(0,-2)) + step) + "px";}});
                //中间的对象,还会涉及左右拉伸框  div[dockresizebar='left'],div[dockresizebar='right']
                JQuery_UITool_DockResizeBar.para.parentobj.children("div[dockresizebar='left'],div[dockresizebar='right']").css({height:function(index, value){ return value == "0px"? value : JQuery_UITool_DockResizeBar.para.upheight + "px";}});  
                            
                //保存当前位置
                JQuery_UITool_DockResizeBar.para.lasty += step;
                break;
            case "left":
                //判断要移动的距离
                var step = event.clientX - JQuery_UITool_DockResizeBar.para.startx;
                if(step < JQuery_UITool_DockResizeBar.para.minstep){
                    step = JQuery_UITool_DockResizeBar.para.startx + JQuery_UITool_DockResizeBar.para.minstep - JQuery_UITool_DockResizeBar.para.lastx;
                }
                else if(step > JQuery_UITool_DockResizeBar.para.maxstep){
                    step = JQuery_UITool_DockResizeBar.para.startx + JQuery_UITool_DockResizeBar.para.maxstep - JQuery_UITool_DockResizeBar.para.lastx;
                }
                else{
                    step = event.clientX - JQuery_UITool_DockResizeBar.para.lastx;
                }
                
                //控制位置
                JQuery_UITool_DockResizeBar.para.barleft += step;
                JQuery_UITool_DockResizeBar.para.leftwidth += step;
                JQuery_UITool_DockResizeBar.para.centerwidth -= step;
                JQuery_UITool_DockResizeBar.css("left",JQuery_UITool_DockResizeBar.para.barleft+"px");
                JQuery_UITool_DockResizeBar.para.leftobj.css("width",(JQuery_UITool_DockResizeBar.para.leftwidth - (JQuery_UITool_DockResizeBar.para.leftobj.outerWidth(true) - JQuery_UITool_DockResizeBar.para.leftobj.width())) + "px");   
                JQuery_UITool_DockResizeBar.para.centerobj.css({width:function(index, value){return (parseInt(value.slice(0,-2)) - step) + "px";},left:function(index, value){return (parseInt(value.slice(0,-2)) + step) + "px";}});
                //保存当前位置
                JQuery_UITool_DockResizeBar.para.lastx += step;
                break;
            case "right":
                //判断要移动的距离
                var step = event.clientX - JQuery_UITool_DockResizeBar.para.startx;
                if(step < JQuery_UITool_DockResizeBar.para.minstep){
                    step = JQuery_UITool_DockResizeBar.para.startx + JQuery_UITool_DockResizeBar.para.minstep - JQuery_UITool_DockResizeBar.para.lastx;
                }
                else if(step > JQuery_UITool_DockResizeBar.para.maxstep){
                    step = JQuery_UITool_DockResizeBar.para.startx + JQuery_UITool_DockResizeBar.para.maxstep - JQuery_UITool_DockResizeBar.para.lastx;
                }
                else{
                    step = event.clientX - JQuery_UITool_DockResizeBar.para.lastx;
                }
                
                //控制位置
                JQuery_UITool_DockResizeBar.para.barleft += step;
                JQuery_UITool_DockResizeBar.para.rightwidth -= step;
                JQuery_UITool_DockResizeBar.para.centerwidth += step;
                JQuery_UITool_DockResizeBar.css("left",JQuery_UITool_DockResizeBar.para.barleft+"px");
                JQuery_UITool_DockResizeBar.para.rightobj.css({width:(JQuery_UITool_DockResizeBar.para.rightwidth - (JQuery_UITool_DockResizeBar.para.rightobj.outerWidth(true) - JQuery_UITool_DockResizeBar.para.rightobj.width())) + "px",left:function(index, value){return (parseInt(value.slice(0,-2)) + step) + "px";}});   
                JQuery_UITool_DockResizeBar.para.centerobj.css({width:function(index, value){return (parseInt(value.slice(0,-2)) + step) + "px";}});
                //保存当前位置
                JQuery_UITool_DockResizeBar.para.lastx += step;
                break;
            default :
                return;
        }
    };
    
    /*
      --DockResizeBarEndMove--
      DockResizeBarEndMove()
         内部函数，改变大小bar鼠标结束拖动操作
    */
    function DockResizeBarEndMove(){
        JQuery_UITool_DockResizeBar.get(0).releaseCapture(); //释放鼠标
            
        //解除绑定事件
        $(document.body).unbind("mousemove",DockResizeBarMouseMove);
        $(document.body).unbind("mouseup",DockResizeBarEndMove);
        $(document.body).unbind("mousedown",DockResizeBarEndMove);
        
        //更新对象的当前位置
        var dockpara = JQuery_UITool_DockResizeBar.para.parentobj.data("dockpara");  //当前的位置参数
        switch(JQuery_UITool_DockResizeBar.para.pos)
        {
            case "top":
                dockpara.top.height = JQuery_UITool_DockResizeBar.para.upheight;
                if(JQuery_UITool_DockResizeBar.para.iscenter){
                    dockpara.left.height = JQuery_UITool_DockResizeBar.para.downheight;
                    dockpara.center.height = JQuery_UITool_DockResizeBar.para.downheight;
                    dockpara.right.height = JQuery_UITool_DockResizeBar.para.downheight;
                }
                else{
                    dockpara.bottom.height = JQuery_UITool_DockResizeBar.para.downheight;
                }
                break;
            case "bottom":
                dockpara.bottom.height = JQuery_UITool_DockResizeBar.para.downheight;
                dockpara.left.height = JQuery_UITool_DockResizeBar.para.upheight;
                dockpara.center.height = JQuery_UITool_DockResizeBar.para.upheight;
                dockpara.right.height = JQuery_UITool_DockResizeBar.para.upheight;
                break;
            case "left":
                dockpara.left.width = JQuery_UITool_DockResizeBar.para.leftwidth;
                if(JQuery_UITool_DockResizeBar.para.iscenter){
                    dockpara.center.width = JQuery_UITool_DockResizeBar.para.centerwidth;
                }
                else{
                    dockpara.right.width = JQuery_UITool_DockResizeBar.para.centerwidth;
                }
                break;
            case "right":
                dockpara.right.width = JQuery_UITool_DockResizeBar.para.rightwidth;
                dockpara.center.width = JQuery_UITool_DockResizeBar.para.centerwidth;
                break;
            default :
                break;
        }
        
        JQuery_UITool_DockResizeBar.para.parentobj.data("dockpara",dockpara);
        //清除
        JQuery_UITool_DockResizeBar = null;
    };
    
    /*
      --DockParentSizeChange--
      DockParentSizeChange()
         内部函数，父容器改变大小执行的操作
    */
    function DockParentSizeChange(){
        var parent = $(this);
        var dockpara = parent.data("dockpara");
        dockpara.width = parent.width();
        dockpara.height = parent.height();
        if(dockpara.width < dockpara.minWidth){
            parent.css("width",dockpara.minWidth+"px");
            return;
        }
        
        if(dockpara.height < dockpara.minHeight){
            parent.css("height",dockpara.minHeight+"px");
            return;
        }
        DivDockComputePara(dockpara);
        DivDockRetSetChildSize(parent,dockpara);
    };
    
    /*
      --DivDockComputePara--
      DivDockComputePara(dockpara)
         内部函数，根据传入的参数计算各部份绑定控件的确切大小
    */
    function DivDockComputePara(dockpara){
        //判断父容器的最小大小
        var centerMinHeight = Math.max(Math.max(dockpara.left.minHeight,dockpara.right.minHeight),dockpara.center.minHeight);
        dockpara.minWidth = Math.max(Math.max(dockpara.top.minWidth,dockpara.bottom.minWidth),dockpara.left.minWidth+dockpara.center.minWidth+dockpara.right.minWidth);
        dockpara.minHeight = dockpara.top.minHeight + dockpara.bottom.minHeight + centerMinHeight;
        
        //显示状态中的中间对象最小大小
        var centerMinHeightV = Math.max(Math.max((dockpara.left.visible ? dockpara.left.minHeight : 0),(dockpara.right.visible ? dockpara.right.minHeight : 0)),(dockpara.center.visible ? dockpara.center.minHeight : 0));
        
        //确定父容器的实际大小
        dockpara.width = Math.max(dockpara.width,dockpara.minWidth);
        dockpara.height = Math.max(dockpara.height,dockpara.minHeight);
        
        //上对象
        dockpara.top.width = dockpara.width;
        if(dockpara.top.visible){
            //有显示上对象
            if(dockpara.top.height < dockpara.top.minHeight){
                //小于最小高度
                dockpara.top.height = dockpara.top.minHeight;
            }
            else{
                var maxtop = dockpara.height - (dockpara.bottom.visible ? dockpara.bottom.minHeight : 0);
                if(dockpara.left.visible || dockpara.center.visible || dockpara.right.visible){
                    maxtop -= centerMinHeightV;
                }
                if(dockpara.top.height > maxtop){
                    //超过最大大小
                    dockpara.top.height = maxtop;
                }
            }
        }
        else{
            //不显示上对象
            dockpara.top.height = 0;
        }
        
        //下对象
        dockpara.bottom.width = dockpara.width;
        if(dockpara.bottom.visible){
            if(dockpara.bottom.height < dockpara.bottom.minHeight){
                //小于最小高度
                dockpara.bottom.height = dockpara.bottom.minHeight;
            }
            else{
                var maxbottom = dockpara.height - dockpara.top.height;
                if(dockpara.left.visible || dockpara.center.visible || dockpara.right.visible){
                    maxbottom -= centerMinHeightV;
                }
                if(dockpara.bottom.height > maxbottom){
                    //超过最大大小
                    dockpara.bottom.height = maxbottom;
                }
            }
        }
        else{
            //不显示下对象
            dockpara.bottom.height = 0;
        }

        //左对象
        dockpara.left.height = dockpara.height - dockpara.top.height - dockpara.bottom.height;
        if(dockpara.left.visible){
            if(dockpara.left.width < dockpara.left.minWidth){
                //小于最小宽度
                dockpara.left.width = dockpara.left.minWidth;
            }
            else{
                var maxleft = dockpara.width - (dockpara.right.visible ? dockpara.right.minWidth : 0) - (dockpara.center.visible ? dockpara.center.minWidth : 0);
                if(dockpara.left.width > maxleft){
                    //超过最大大小
                    dockpara.left.width = maxleft;
                }
            }
        }
        else{
            //不显示左对象
            dockpara.left.width = 0;
        }
        
        //右对象
        dockpara.right.height = dockpara.left.height;
        if(dockpara.right.visible){
            if(dockpara.right.width < dockpara.right.minWidth){
                //小于最小宽度
                dockpara.right.width = dockpara.right.minWidth;
            }
            else{
                var maxright = dockpara.width - dockpara.left.width - (dockpara.center.visible ? dockpara.center.minWidth : 0);
                if(dockpara.right.width > maxright){
                    //超过最大大小
                    dockpara.right.width = maxright;
                }
            }
        }
        else{
            //不显示右对象
            dockpara.right.width = 0;
        }
        
        //中间对象
        if(dockpara.center.visible){
            dockpara.center.width = dockpara.width - dockpara.left.width - dockpara.right.width;
            dockpara.center.height = dockpara.height - dockpara.top.height - dockpara.bottom.height;
        }
        else{
            //不显示中间对象
            dockpara.center.width = 0;
            dockpara.center.height = 0;
        }
        
        if(!(dockpara.left.visible || dockpara.center.visible || dockpara.right.visible) && (dockpara.top.height + dockpara.bottom.height < dockpara.height)){
            //只有对于不显示中间对象的情况fullSize参数才有效，以下是进行相应处理
            dockpara.left.height = 0;
            dockpara.right.height = 0;
            
            if(dockpara.bottom.visible && dockpara.bottom.fullSize){
                //优先用下面的填充
                dockpara.bottom.height = dockpara.height - dockpara.top.height;
            }
            else if(dockpara.top.visible && dockpara.top.fullSize){
                //用上面的填充
                dockpara.top.height = dockpara.height - dockpara.bottom.height;
            }
        }
        
        if(!dockpara.center.visible && (dockpara.left.width + dockpara.right.width < dockpara.width)){
            //只有对于不显示中间对象的情况fullSize参数才有效，以下是进行相应处理
            if(dockpara.right.visible && dockpara.right.fullSize){
                //优先用右面的填充
                dockpara.right.width = dockpara.width - dockpara.left.width;
            }
            else if(dockpara.left.visible && dockpara.left.fullSize){
                //用上面的填充
                dockpara.left.width = dockpara.width - dockpara.right.width;
            }
        }
    };
    
    /*
      --DivDockSetObjRealSize--
      DivDockSetObjRealSize(obj,width,height,left,top)
         内部函数，根据对象显示所占区域大小设置对象的实际大小
    */
    function DivDockSetObjRealSize(obj,width,height,left,top){
        //占位大小－ 左右margin宽度 － 左右边框宽度 - 左右padding宽度
        var realwidth = width - (obj.outerWidth(true) - obj.width());
        var realheight = height - (obj.outerHeight(true) - obj.height());
        //设置对象样式
        obj.css({left:left + "px",top:top+"px",width:realwidth+"px",height:realheight+"px"});
    };
    
    /*
      --DivDockRetSetChildSize--
      DivDockRetSetChildSize(parentobj,dockpara)
         内部函数，重新设置绑定子容器的大小
    */
    function DivDockRetSetChildSize(parentobj,dockpara){
        //将参数保存到主容器中
        parentobj.data("dockpara",dockpara);
        
        //上对象
        var topobj = parentobj.children("[dockchild='top']");
        var TopResizeBar = parentobj.children("div[dockresizebar='top']");
        if(topobj.length > 0 && dockpara.top.visible){
            DivDockSetObjRealSize(topobj,dockpara.top.width,dockpara.top.height,dockpara.startx,dockpara.starty);
            //判断是否要加上改变大小bar
            if(TopResizeBar.length > 0 && TopResizeBar.height() > 0 && (dockpara.bottom.visible || dockpara.left.visible || dockpara.center.visible || dockpara.right.visible)){
                //判断位置
                var TopResizeBarLeft = dockpara.startx;
                var TopResizeBarTop = 0;
                switch(TopResizeBar.attr("dockresizebarpos")){
                    case "outer":
                        TopResizeBarTop = dockpara.starty + dockpara.top.height;
                        break;
                    case "center":
                        TopResizeBarTop = dockpara.starty + dockpara.top.height - Math.floor(TopResizeBar.height()/2);
                        break;
                    default :
                        //inner
                        TopResizeBarTop = dockpara.starty + dockpara.top.height - TopResizeBar.height();
                        break;
                }
                TopResizeBar.css({width:dockpara.top.width+"px",left:TopResizeBarLeft+"px",top:TopResizeBarTop+"px"});
            }
            else{
                //不显示
                TopResizeBar.css("width","0px");
            }
        }
        else{
            //不显示改变大小bar
            TopResizeBar.css("width","0px");
        }
        
        //下对象
        var bottomobj = parentobj.children("[dockchild='bottom']");
        var BottomResizeBar = parentobj.children("div[dockresizebar='bottom']");
        if(bottomobj.length > 0  && dockpara.bottom.visible){
            DivDockSetObjRealSize(bottomobj,dockpara.bottom.width,dockpara.bottom.height,dockpara.startx,dockpara.starty+dockpara.height-dockpara.bottom.height);
            //判断是否要加上改变大小bar
            if(BottomResizeBar.length > 0 && BottomResizeBar.height() > 0 && (dockpara.left.visible || dockpara.center.visible || dockpara.right.visible)){
                //判断位置
                var BottomResizeBarLeft = dockpara.startx;
                var BottomResizeBarTop = 0;
                switch(BottomResizeBar.attr("dockresizebarpos")){
                    case "outer":
                        BottomResizeBarTop = dockpara.starty+dockpara.top.height+dockpara.left.height -  BottomResizeBar.height();
                        break;
                    case "center":
                        BottomResizeBarTop = dockpara.starty+dockpara.top.height+dockpara.left.height - Math.floor(BottomResizeBar.height()/2);
                        break;
                    default :
                        //inner
                        BottomResizeBarTop = dockpara.starty+dockpara.top.height+dockpara.left.height;
                        break;
                }
                BottomResizeBar.css({width:dockpara.bottom.width+"px",left:BottomResizeBarLeft+"px",top:BottomResizeBarTop+"px"});
            }
            else{
                //不显示
                BottomResizeBar.css("width","0px");
            }
        }
        else{
            //不显示改变大小bar
            BottomResizeBar.css("width","0px");
        }
        
        //左对象
        var leftobj = parentobj.children("[dockchild='left']");
        var LeftResizeBar = parentobj.children("div[dockresizebar='left']");
        if(leftobj.length > 0  && dockpara.left.visible){
            DivDockSetObjRealSize(leftobj,dockpara.left.width,dockpara.left.height,dockpara.startx,dockpara.starty+dockpara.top.height);
            //判断是否要加上改变大小bar
            if(LeftResizeBar.length > 0 && LeftResizeBar.width() > 0 && (dockpara.right.visible || dockpara.center.visible)){
                //有中间的情况
                //判断位置
                var LeftResizeBarLeft = 0;
                var LeftResizeBarTop = dockpara.starty+dockpara.top.height;
                switch(LeftResizeBar.attr("dockresizebarpos")){
                    case "outer":
                        LeftResizeBarLeft = dockpara.startx + dockpara.left.width;
                        break;
                    case "center":
                        LeftResizeBarLeft = dockpara.startx + dockpara.left.width - Math.floor(LeftResizeBar.width()/2);
                        break;
                    default :
                        //inner
                        LeftResizeBarLeft = dockpara.startx + dockpara.left.width - LeftResizeBar.width();
                        break;
                }
                LeftResizeBar.css({height:dockpara.left.height+"px",left:LeftResizeBarLeft+"px",top:LeftResizeBarTop+"px"});
            }
            else{
                //不显示
                LeftResizeBar.css("height","0px");
            }
        }
        else{
            //不显示改变大小bar
            LeftResizeBar.css("height","0px");
        }
        
        //右对象
        var rightobj = parentobj.children("[dockchild='right']");
        var RightResizeBar = parentobj.children("div[dockresizebar='right']");
        if(rightobj.length > 0  && dockpara.right.visible){
            DivDockSetObjRealSize(rightobj,dockpara.right.width,dockpara.right.height,dockpara.startx+dockpara.width-dockpara.right.width,dockpara.starty+dockpara.top.height);
            //判断是否要加上改变大小bar
            if(RightResizeBar.length > 0 && RightResizeBar.width() > 0 && dockpara.center.visible){
                //有中间和右边的情况
                //判断位置
                var RightResizeBarLeft = 0;
                var RightResizeBarTop = dockpara.starty+dockpara.top.height;
                switch(LeftResizeBar.attr("dockresizebarpos")){
                    case "outer":
                        RightResizeBarLeft = dockpara.startx+dockpara.left.width+dockpara.center.width - RightResizeBar.width();
                        break;
                    case "center":
                        RightResizeBarLeft = dockpara.startx+dockpara.left.width+dockpara.center.width - Math.floor(RightResizeBar.width()/2);
                        break;
                    default :
                        //inner
                        RightResizeBarLeft = dockpara.startx+dockpara.left.width+dockpara.center.width;
                        break;
                }
                RightResizeBar.css({height:dockpara.right.height+"px",left:RightResizeBarLeft+"px",top:RightResizeBarTop+"px"});
            }
            else{
                //不显示
                RightResizeBar.css("height","0px");
            }
        }
        else{
            //不显示改变大小bar
            RightResizeBar.css("height","0px");
        }
        
        //中间对象
        var centerobj = parentobj.children("[dockchild='center']");
        if(centerobj.length > 0  && dockpara.center.visible){
            DivDockSetObjRealSize(centerobj,dockpara.center.width,dockpara.center.height,dockpara.startx+dockpara.left.width,dockpara.starty+dockpara.top.height);
        }
    };

})(jQuery);


