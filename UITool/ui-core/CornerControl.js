/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：CornerControl
说明：封装好的圆角控件，透明背景的圆角效果，支持对div、img等元素的圆角效果
文件：CornerControl.js
依赖文件：jquery-1.6.4.min.js
-----------------------*/

;(function($) {
    //默认圆角参数
    $.CornerControl = new Object();
    $.CornerControl.defaults = {
        //圆角宽度
        CornerWidth : 10,

        //是否统一圆角参数，true-都是相同的圆角样式，false-四角可单独设置圆角样式
        Global : true,

        //设置圆角的样式，Global为true有效，包括Round
        GlobalStyle : "round",

        //设置圆角的位位置，Global为true有效
        GlobalCorners : {topLeft:true, topRight:true,bottomLeft:true,bottomRight:true },

        //四角可单独设置圆角样式，Global为false有效，为圆角样式
        TopLeftStyle : "",
        TopRightStyle : "",
        BottomLeftStyle : "",
        BottomRightStyle : ""
    };

    //为指定对象设置圆角样式
    $.fn.Corner = function(opts) {
        if(this.length == 0){
            return;
        }
        //自定义参数
	    opts = $.extend({}, $.CornerControl.defaults, opts || {});
	    opts.GlobalCorners = $.extend({}, $.CornerControl.defaults.GlobalCorners, opts.GlobalCorners || {});
	    
	    //计算四角的圆角处理参数
	    var CornerPara = new Object();
	    CornerPara.topBar = false;   //是否有上面的圆角处理
	    CornerPara.topBarCss = new Array(opts.CornerWidth);   //每条上边框的样式
	    CornerPara.bottomBar = false;  //是否有下面的圆角处理
	    CornerPara.bottomBarCss = new Array(opts.CornerWidth);   //每条下边框的样式
	    
	    CornerPara.topLeft = new Object();  //topleft的参数
	    CornerPara.topLeft.indented = new Array(opts.CornerWidth);  //topleft的缩进量数组
	    
	    CornerPara.topRight = new Object();
	    CornerPara.topRight.indented = new Array(opts.CornerWidth);
	    
	    CornerPara.bottomLeft = new Object();
	    CornerPara.bottomLeft.indented = new Array(opts.CornerWidth);
	    
	    CornerPara.bottomRight = new Object();
	    CornerPara.bottomRight.indented = new Array(opts.CornerWidth);
	    
	    if(opts.Global){
	        CornerPara.topBar = opts.GlobalCorners.topLeft || opts.GlobalCorners.topRight;
	        CornerPara.bottomBar = opts.GlobalCorners.bottomLeft || opts.GlobalCorners.bottomRight;
	        if(!(CornerPara.topBar || CornerPara.bottomBar)){
	            //参数不对，不设置圆角
	            return;
	        }
	        //计算圆角缩进量
	        for(var i = 0;i<opts.CornerWidth;i++){
	            var tempindented = getWidth(opts.GlobalStyle,i,opts.CornerWidth);
	            CornerPara.topLeft.indented[opts.CornerWidth - i - 1] = (opts.GlobalCorners.topLeft ? tempindented : 0);
	            CornerPara.topRight.indented[opts.CornerWidth - i - 1] = (opts.GlobalCorners.topRight ? tempindented : 0);
	            CornerPara.bottomLeft.indented[opts.CornerWidth - i - 1] = (opts.GlobalCorners.bottomLeft ? tempindented : 0);
	            CornerPara.bottomRight.indented[opts.CornerWidth - i - 1] = (opts.GlobalCorners.bottomRight ? tempindented : 0);
	        }
	    }
	    else{
	        CornerPara.topBar = (opts.TopLeftStyle != "") || (opts.TopRightStyle != "");
	        CornerPara.bottomBar = (opts.BottomLeftStyle != "") || (opts.BottomRightStyle != "");
	        if(!(CornerPara.topBar || CornerPara.bottomBar)){
	            //参数不对，不设置圆角
	            return;
	        }
	        //计算圆角缩进量
	        for(var i = 0;i<opts.CornerWidth;i++){
	            CornerPara.topLeft.indented[opts.CornerWidth - i - 1] = (opts.TopLeftStyle != "" ? getWidth(opts.TopLeftStyle,i,opts.CornerWidth) : 0);
	            CornerPara.topRight.indented[opts.CornerWidth - i - 1] = (opts.TopRightStyle != "" ? getWidth(opts.TopRightStyle,i,opts.CornerWidth) : 0);
	            CornerPara.bottomLeft.indented[opts.CornerWidth - i - 1] = (opts.BottomLeftStyle != "" ? getWidth(opts.BottomLeftStyle,i,opts.CornerWidth) : 0);
	            CornerPara.bottomRight.indented[opts.CornerWidth - i - 1] = (opts.BottomRightStyle != "" ? getWidth(opts.BottomRightStyle,i,opts.CornerWidth) : 0);
	        }
	    }
	    
	    //循环进行对象的圆角处理
	    for(var i = 0; i<this.length;i++){
	        var baseObj = $(this.get(i));
	        //如果已经设置了圆角，则把圆角属性去掉
	        baseObj.ClearCorner();
	        
	        //获取对象的属性start
	        var beforeCss = {
	            position : baseObj.css("position"),
	            margin : baseObj.css("margin"),
	            left : baseObj.css("left"),
	            top : baseObj.css("top"),
	            width : baseObj.get(0).style.width,
	            height : baseObj.get(0).style.height
	        };
	        
	        var computePara = {
	            isPWidth : baseObj.get(0).style.width.indexOf("%") >= 0,
	            height : baseObj.outerHeight(),
	            beforeHeight : baseObj.get(0).style.height,
	            borderTop : {style:baseObj.css("border-top-style"),width:parseInt(baseObj.css("border-top-width").replace("px","")),color:baseObj.css("border-top-color")},
	            borderBottom : {style:baseObj.css("border-bottom-style"),width:parseInt(baseObj.css("border-bottom-width").replace("px","")),color:baseObj.css("border-bottom-color")},
	            borderLeft : {style:baseObj.css("border-left-style"),width:parseInt(baseObj.css("border-left-width").replace("px","")),color:baseObj.css("border-left-color")},
	            borderRight : {style:baseObj.css("border-right-style"),width:parseInt(baseObj.css("border-right-width").replace("px","")),color:baseObj.css("border-right-color")},
	            backgroundColor : baseObj.css("background-color"),
	            backgroundPositionX : parseInt(baseObj.css("background-position-x").replace("px","")),
	            backgroundPositionY : parseInt(baseObj.css("background-position-y").replace("px","")),
	            backgroundRepeat : baseObj.css("background-repeat"),
	            isImg : baseObj.get(0).tagName == "IMG",
	            hasBgImage : baseObj.css("background-image") != "none",
	            CornerPara : CornerPara
	        };

	        computePara["width"] = (computePara.isPWidth ? baseObj.get(0).style.width : baseObj.outerWidth());
	        computePara["imgSrc"] = (computePara.isImg ? "url("+baseObj.attr("src")+")" : (computePara.hasBgImage?baseObj.css("background-image") : ""));
	        
	        //计算各条边圆角bar的CSS样式
	        for(var j = 0;j<opts.CornerWidth;j++){
	            if(CornerPara.topBar){
	                 CornerPara.topBarCss[j] = getBarCss(j,true,opts,computePara);
	            }
	            
	            if(CornerPara.bottomBar){
	                CornerPara.bottomBarCss[opts.CornerWidth - j - 1] = getBarCss(j,false,opts,computePara);
	            }
	        }
	        
	        //获取对象的属性end
	        
	        //进行辅助对象的建立start
	        baseObj.attr("CornerType",computePara.isImg ? "Img": "Div");
	        baseObj.data("CornerComputePara",computePara);
	        var contentObj = baseObj;  
	        if(computePara.isImg){
	            //图片的情况，将对象包含在一个Div对象中
	            baseObj.css({position : "relative", margin : "0px", left : "0px", top : (computePara.borderTop.width - opts.CornerWidth)+"px", "border-top-width":"0px","border-bottom-width":"0px"});
	            baseObj.wrap("<div selftype='CornerImgDiv' style='margin:0px;padding:0px;position:relative;border:0px solid #000;overflow:hidden;font-size:0px;left:0px;top:0px;width:"+computePara.width+"px;height:"+(computePara.height - (CornerPara.topBar ? opts.CornerWidth : 0) - (CornerPara.bottomBar ? opts.CornerWidth : 0))+"px;'></div>");
	            contentObj = $(baseObj.get(0).parentNode);
	        }
	        else{
	            //一般DIV的情况
	            baseObj.css({position : "relative", margin : "0px", left : "0px", top : "0px", "border-top-width":"0px","border-bottom-width":"0px",height:(computePara.height - (CornerPara.topBar ? opts.CornerWidth : 0) - (CornerPara.bottomBar ? opts.CornerWidth : 0))+"px"});
	            if(computePara.isPWidth){
	                //百分比大小的情况
	                alert(1);
	                baseObj.css("width","100%");
	            }
	            if(computePara.hasBgImage){
	                //设置背景图位置
	                baseObj.css("background-position-y",(parseInt(baseObj.css("background-position-y").replace("px","")) - (CornerPara.topBar ? opts.CornerWidth : 0) + computePara.borderTop.width)+"px");
	            }
	        }
	        
	        //添加最外层的DIV
	        contentObj.wrap("<div selftype='CornerMainDiv'></div>");
	        var mainDiv = $(contentObj.get(0).parentNode);
	        mainDiv.data("opts",opts);
	        mainDiv.css({
	            position : beforeCss.position,
	            margin : beforeCss.margin,
	            left : beforeCss.left,
	            top : beforeCss.top,
	            padding : "0px",
	            //overflow : "hidden",
	            border: "0px solid #000",
	            "font-size" : "0px",
	            width : computePara.isPWidth ? computePara.width : computePara.width + "px",
	            height : computePara.height + "px"
	        });
	        
	        //添加圆角Bar
	        for(var j = 0;j<opts.CornerWidth;j++){
	            if(CornerPara.topBar){
	                //在对象的前面添加
	                contentObj.before("<div selftype='CornerBarDiv' barorder='"+j+"'></div>");
	                contentObj.prev("[selftype='CornerBarDiv']").css(CornerPara.topBarCss[j]);
	            }
	            if(CornerPara.bottomBar){
	                //在对象的后面添加
	                contentObj.after("<div selftype='CornerBarDiv' barorder='"+j+"'></div>");
	                contentObj.next("[selftype='CornerBarDiv']").css(CornerPara.bottomBarCss[opts.CornerWidth - j - 1]);
	            } 
	        }
	        
	        //进行辅助对象的建立end
	    }
    };
    
    //为指定对象设置圆角样式
    $.fn.SetCornerObjCss = function(CssOpts) {
        //这个函数只允许修改边框颜色、背景色、背景图像、背景图像的位移这些CSS样式
        for(var i = 0;i<this.length;i++){
            var baseobj = $(this.get(i));
            switch(baseobj.attr("CornerType")){
                case "Div":
                case "Img":
                    var computePara = baseobj.data("CornerComputePara");
                    var contentobj = (baseobj.attr("CornerType") == "Div" ? baseobj : $(baseobj.get(0).parentNode));
                    var opts = $(contentobj.get(0).parentNode).data("opts");
                    //边框颜色
                    if(CssOpts["border-left-color"] !== undefined){
                        //左边框
                        baseobj.css("border-left-color",CssOpts["border-left-color"]);
                        computePara.borderLeft.color = CssOpts["border-left-color"];
                    }
                    if(CssOpts["border-top-color"] !== undefined){
                        //上边框
                        computePara.borderTop.color = CssOpts["border-top-color"];
                    }
                    if(CssOpts["border-right-color"] !== undefined){
                        //右边框
                        baseobj.css("border-right-color",CssOpts["border-right-color"]);
                        computePara.borderRight.color = CssOpts["border-right-color"];
                    }
                    if(CssOpts["border-bottom-color"] !== undefined){
                        //下边框
                        computePara.borderBottom.color = CssOpts["border-bottom-color"];
                    }
                    //background-color
                    if(CssOpts["background-color"] !== undefined){
                        baseobj.css("background-color",CssOpts["background-color"]);
                        computePara.backgroundColor = CssOpts["background-color"];
                    }
                    //background-repeat
                    if(CssOpts["background-repeat"] !== undefined && !computePara.isImg){
                        baseobj.css("background-repeat",CssOpts["background-repeat"]);
                        computePara.backgroundRepeat = CssOpts["background-repeat"];
                    }
                    //background-position-x
                    if(CssOpts["background-position-x"] !== undefined && !computePara.isImg){
                        baseobj.css("background-position-x",CssOpts["background-position-x"]);
                        computePara.backgroundPositionX = parseInt(CssOpts["background-position-x"].replace("px",""));
                    }
                    //background-position-y
                    if(CssOpts["background-position-y"] !== undefined && !computePara.isImg){
                        computePara.backgroundPositionY = parseInt(CssOpts["background-position-y"].replace("px",""));
                        baseobj.css("background-position-y",(computePara.backgroundPositionY - (computePara.CornerPara.topBar ? opts.CornerWidth : 0) + computePara.borderTop.width)+"px");
                    }
                    //background-image
                    if(CssOpts["background-image"] !== undefined){
                        if(computePara.isImg){
                            //图片
                            baseobj.attr("src",CssOpts["background-image"]);
                            computePara.imgSrc = "url("+CssOpts["background-image"]+")";
                        }
                        else{
                            //背景图
                            if(CssOpts["background-image"] == "none"){
                                //取消背景图
                                computePara.hasBgImage = false;
                                
                            }
                            else if(!computePara.hasBgImage){
                                computePara.hasBgImage = true;
                                //同时要处理y方向的位移
                                baseobj.css("background-position-y",(computePara.backgroundPositionY - (computePara.CornerPara.topBar ? opts.CornerWidth : 0) + computePara.borderTop.width)+"px");
                            }
                            baseobj.css("background-image",CssOpts["background-image"]);
                            computePara.imgSrc = CssOpts["background-image"];
                        }
                    }
                    
                    //设置边框条
                    for(var j = 0;j<opts.CornerWidth;j++){
                        if(computePara.CornerPara.topBar){
                            computePara.CornerPara.topBarCss[j] = getBarCss(j,true,opts,computePara);
                            contentobj.prevAll("[selftype='CornerBarDiv'][barorder='"+j+"']").css(computePara.CornerPara.topBarCss[j]);
                        }
                        if(computePara.CornerPara.bottomBar){
                            computePara.CornerPara.bottomBarCss[opts.CornerWidth - j - 1] = getBarCss(j,false,opts,computePara);
                            contentobj.nextAll("[selftype='CornerBarDiv'][barorder='"+j+"']").css(computePara.CornerPara.bottomBarCss[opts.CornerWidth - j - 1]);
                        }
                    }
                    
                    //保存记录
                    baseobj.data("CornerComputePara",computePara);
                    break;
                case "Css":
                    //直接通过浏览器方式实现的，直接设置样式即可
                    baseobj.css(CssOpts);
                    break;
                default:
                    baseobj.css(CssOpts);
                    break;
            }
        }
    };
    
    //IE7圆角处理RoundCorner
    var style = document.createElement('div').style, 
        moz = style['MozBorderRadius'] !== undefined,
        webkit = style['WebkitBorderRadius'] !== undefined,
        radius = style['borderRadius'] !== undefined || style['BorderRadius'] !== undefined;
    $.fn.RoundCorner = function(opts) {
        var $this = $(this);
        
        //自定义参数
	    opts = $.extend({}, $.CornerControl.defaults, opts || {});
	    opts.GlobalCorners = $.extend({}, $.CornerControl.defaults.GlobalCorners, opts.GlobalCorners || {});
	    
	    if(radius || moz || webkit){
	        //浏览器自身的圆角支持
	        if (opts.GlobalCorners.topLeft)
                $this.css(radius ? 'border-top-left-radius' : moz ? '-moz-border-radius-topleft' : '-webkit-border-top-left-radius', opts.CornerWidth + 'px');
            if (opts.GlobalCorners.topRight)
                $this.css(radius ? 'border-top-right-radius' : moz ? '-moz-border-radius-topright' : '-webkit-border-top-right-radius', opts.CornerWidth + 'px');
            if (opts.GlobalCorners.bottomLeft)
                $this.css(radius ? 'border-bottom-left-radius' : moz ? '-moz-border-radius-bottomleft' : '-webkit-border-bottom-left-radius', opts.CornerWidth + 'px');
            if (opts.GlobalCorners.bottomLeft)
                $this.css(radius ? 'border-bottom-right-radius' : moz ? '-moz-border-radius-bottomright' : '-webkit-border-bottom-right-radius', opts.CornerWidth + 'px');
            $this.attr("CornerType","Css");
	    }
	    else{
	        //调用通过bar实现的圆角
	        $this.Corner(opts);
	    }
	    return;
	};
	
	//清除圆角样式
	$.fn.ClearCorner = function() {
	    for(var i = 0;i<this.length;i++){
	        var baseObj = $(this.get(i));
	        switch(baseObj.attr("CornerType")){
                case "Div":
                case "Img":
                    var computePara = baseObj.data("CornerComputePara");
                    var contentobj = (baseObj.attr("CornerType") == "Div" ? baseObj : $(baseObj.get(0).parentNode));
                    var mainDiv = $(contentobj.get(0).parentNode);
                    var opts = mainDiv.data("opts");
                    mainDiv.removeData("opts");
                    baseObj.css({
                        position:mainDiv.css("position"),
                        left:mainDiv.css("left"),
                        top:mainDiv.css("top"),
                        "border-top":computePara.borderTop.width + " " + computePara.borderTop.style + " " + computePara.borderTop.color,
                        "border-bottom":computePara.borderBottom.width + " " + computePara.borderBottom.style + " " + computePara.borderBottom.color,
                        margin:mainDiv.css("margin"),
                        height:computePara.beforeHeight
                        });
                    if(computePara.isPWidth){
                        baseObj.css("width",mainDiv.get(0).style.width);
                    }
                    if(!computePara.isImg && computePara.hasBgImage){
                        baseObj.css("background-position-x",computePara.backgroundPositionX);
                        baseObj.css("background-position-y",computePara.backgroundPositionY);
                    }
                    baseObj.removeAttr("CornerType");
                    baseObj.removeData("CornerComputePara");
                    //删除对象
                    contentobj.siblings("[selftype='CornerBarDiv']").remove();
                    contentobj.unwrap();
                    if(computePara.isImg){
                        baseObj.unwrap();
                    }
                case "Css":
                    baseObj.css(radius ? 'border-radius' : moz ? '-moz-border-radius' : '-webkit-border-radius', 0);
                    baseObj.removeAttr("CornerType");
                    break;
                default :
                    break;
            }
	    }
	};
    

    //以下部分为内部函数
    
    //获取不同样式，宽度参数下的第i行的缩进量
    function getWidth(Style, i, width) {
        switch(Style) {
        case 'round':  return Math.round(width*(1-Math.cos(Math.asin(i/width))));
        case 'cool':   return Math.round(width*(1+Math.cos(Math.asin(i/width))));
        case 'sharp':  return Math.round(width*(1-Math.cos(Math.acos(i/width))));
        case 'bite':   return Math.round(width*(Math.cos(Math.asin((width-i-1)/width))));
        case 'slide':  return Math.round(width*(Math.atan2(i,width/i)));
        case 'jut':    return Math.round(width*(Math.atan2(width,(width-i-1))));
        case 'curl':   return Math.round(width*(Math.atan(i)));
        case 'tear':   return Math.round(width*(1+Math.cos(i)));
        case 'wicked': return Math.round(width*((1+Math.tan(i) < 0 ? 0:1+Math.tan(i))));
        case 'long':   return Math.round(width*(Math.sqrt(i)));
        case 'sculpt': return Math.round(width*(Math.log((width-i-1),width)));
        case 'dogfold':
        case 'dog':    return (i&1) ? (i+1) : width;
        case 'dog2':   return (i&2) ? (i+1) : width;
        case 'dog3':   return (i&3) ? (i+1) : width;
        case 'fray':   return (i%2)*width;
        case 'notch':  return width; 
        case 'bevelfold':
        case 'bevel':  return i+1;
        default : return Math.round(width*(1-Math.cos(Math.asin(i/width))));
        }
    };
    
    //计算第i个bar边框宽度的函数
    function getBarBorderWidth(i,CornerWidth,TopBottomBorderWidth,LeftRightBorderWidth,isCorner,minBorder,indented){
        if(i < TopBottomBorderWidth){return 0;}  //整个bar都作为边框
        if(!isCorner){return LeftRightBorderWidth;} //没有设置圆角，因此边框大小和左右的边框一致
        //按照线性增长的方式逐步增大边框
        var ret = TopBottomBorderWidth + Math.round(i*(LeftRightBorderWidth - TopBottomBorderWidth)/(CornerWidth));
        if(ret > 0){
            ret = Math.max(ret,minBorder);
            if(indented == 0){
                ret = Math.max(ret,LeftRightBorderWidth);
            }
        }
        return ret;
    };
    
    //计算的i个bar的样式,注意，bottom情况i是从底下数上来的
    function getBarCss(i,isTop,opts,computePara){
        //常用的变量，直接取出来
        var indented ={left:computePara.CornerPara[isTop?"topLeft":"bottomLeft"].indented[i],right:computePara.CornerPara[isTop?"topRight":"bottomRight"].indented[i]}; 
        var border = {width:computePara[isTop?"borderTop":"borderBottom"].width,color:computePara[isTop?"borderTop":"borderBottom"].color};
        var isCorner = {left:(opts.Global ? (opts.GlobalCorners[isTop ? "topLeft" : "bottomLeft"]) : (opts[isTop ? "TopLeftStyle" : "BottomLeftStyle"] != "")),right:(opts.Global ? (opts.GlobalCorners[isTop ? "topRight" : "bottomRight"]) : (opts[isTop ? "TopRightStyle" : "BottomRightStyle"] != ""))};
        
        //边框的最小值
        var minBorder = {Left:0,Right:0};
        if(i> 0){
            minBorder.Left = Math.abs(indented.left - computePara.CornerPara[isTop?"topLeft":"bottomLeft"].indented[i-1]);
            minBorder.Right = Math.abs(indented.right - computePara.CornerPara[isTop?"topRight":"bottomRight"].indented[i-1]);
        }
        
        var leftWidth = getBarBorderWidth(i,opts.CornerWidth,border.width,computePara.borderLeft.width,isCorner.left,minBorder.Left,indented.left);
        var rightWidth = getBarBorderWidth(i,opts.CornerWidth,border.width,computePara.borderRight.width,isCorner.right,minBorder.Right,indented.right);
        
        //一般样式
        var Css = {
            margin : "0px " + indented.right + "px 0px " + indented.left + "px",  //上右下左
            padding : "0px",
            overflow : "hidden",
            "font-size" : "0px",
            height : "1px",
            position : "relative",
            left : "0px",
            top : "0px",
            "background-color" : i<border.width ? border.color : computePara.backgroundColor,
            "background-image" : "none",
            "border-style" : "solid",
            "border-color" : "#000 " + (i<(opts.CornerWidth/2) ? border.color : computePara.borderRight.color) + " #000 " + (i<(opts.CornerWidth/2) ? border.color : computePara.borderLeft.color),
            "border-width" : "0px " + rightWidth + "px 0px " + leftWidth + "px"
        };
        
        //含背景图或为IMG的情况start
	    if(computePara.isImg){
	        //是img对象,设置背景图
            if(i>=border.width){
                Css["background-image"] = computePara.imgSrc;
                Css["background-repeat"] = "no-repeat";
                Css["background-position"] = (0-leftWidth-indented.left+computePara.borderLeft.width) + "px " 
                                            + (isTop? border.width - i : 
                                              1 + i - computePara.height + computePara.borderTop.width) 
                                            + "px"; 
            }
	    }
	    else if(computePara.hasBgImage){
	        //有背景图
	        if(i>=border.width){
	            Css["background-image"] = computePara.imgSrc;
	            Css["background-repeat"] = computePara.backgroundRepeat;
	            Css["background-position"] = (computePara.backgroundPositionX - leftWidth - indented.left + computePara.borderLeft.width) + "px "
	                                        + (isTop? computePara.backgroundPositionY + border.width - i :
	                                            computePara.backgroundPositionY - (computePara.height - computePara.borderTop.width - 1- i)
	                                        ) + "px";
            }
	    }
	    
	    return Css;
    }
    
})(jQuery);
