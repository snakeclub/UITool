/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：ShowHideControl
说明：令对象显示和隐藏的控件
文件：ShowHideControl.js
依赖文件：jquery-1.4.2.min.js
-----------------------*/

/*-----------------------
==ShowHideControl==
说明：令对象显示和隐藏的控件
-----------------------*/
/*
--ShowHideControlTimerEnd--
ShowHideControlTimerEnd(idivid,IsShow,Pos,Mar)
对象显示和隐藏的完结后的处理函数
idivid  : 内套的id
IsShow : 是否显示,true/false
Pos : 原对象的position
Mar : 原对象的margin
*/
function ShowHideControlTimerEnd(idivid,IsShow,Pos,Mar){
    var mainobj =  $("#"+idivid).children().first();
    
    if(!IsShow){
        //要隐藏对象
        mainobj.hide();
    }
    
    //恢复对象的原来位置信息
    mainobj.css({position:Pos,margin:Mar});
    //取消外面的套用,取消2个
    mainobj.unwrap();
    mainobj.unwrap();
    
    try{
        mainobj.data("ShowHideControlEndFun")(mainobj);
    }catch(e){;}
};


jQuery.fn.extend({
 /*
  --TShow--
  $("").TShow([ShowPara],[ShowTime],[EndFun])
     在对象的原位置上显示对象(显示的对象不移动),注意，这里不会考虑浮动在位置上的情况，因此如果需浮动显示效果，可以在要显示或隐藏的对象外面套一个浮动的div
     [ShowPara]  :  显示参数，默认为"normal"
         normal-正常的显示，无特效
         left-从左到右显示
         right-从右到左显示-暂时不支持静态位置的对象
         top-从上到下显示
         bottom-从下到上显示-暂时不支持静态位置的对象
         topleft-从左上角到右下角显示
         topright-从右上角到左下角-暂时不支持静态位置的对象
         bottomleft-从左下角到右上角-暂时不支持静态位置的对象
         bottomright-从右下角到左上角-暂时不支持静态位置的对象
         center-从中间到四周-暂时不支持静态位置的对象
         alpha-透明度
         
         left-move : 从左边移动进来-暂时不支持静态位置的对象
         right-move : 从右边移动进来-暂时不支持静态位置的对象
         top-move: 从上边移动进来-暂时不支持静态位置的对象
         bottom-move: 从下边移动进来-暂时不支持静态位置的对象
         topleft-move :从左上角移动进来-暂时不支持静态位置的对象
         topright-move: 从右上角移动进来-暂时不支持静态位置的对象
         bottomleft-move: 从左下角移动进来-暂时不支持静态位置的对象
         bottomright-move: 从右下角移动进来-暂时不支持静态位置的对象
     [ShowTime] : 显示速度，多长时间显示出来（单位是毫秒），默认为500毫秒
     [EndFun] : 完成后执行的操作，传入的参数为对象本身的jquery对象
 */
 TShow : function() {
    //判断是否处理
    if(this.length <= 0){
        return;
    }
     
    //处理传入参数start
    var ShowPara = "normal";
    var ShowTime = 500;
    var EndFun = null;
    for(var i = 0;i<arguments.length;i++)
    {
        if(arguments[i] == null || arguments[i] === undefined) { 
            continue;  //没有传具体值进来
        }
        switch(i)
        {
            case 0:
                ShowPara = arguments[i].toLowerCase();
                break;
            case 1:
                ShowTime = arguments[i];
                break;
            case 2:
                EndFun = arguments[i];
                break;
            default :
                break;
        }
    }
    //处理传入参数end
    //循环进行处理start
    var mainobj = null;
    for(var i=0;i<this.length;i++){
        mainobj = $(this.get(i));
        if(mainobj.css("display") != "none"){
            //原来已经显示出来了
            continue;
        }
        
        switch(ShowPara){
            case "normal":
                //正常的显示
                mainobj.show();
                try{
                    EndFun(mainobj);
                }catch(e){;}
                continue;
                break;
            case "alpha":
                //透明度逐渐显示
                mainobj.fadeIn(ShowTime,function(){try{EndFun($(this));}catch(e){;}});
                continue;
                break;
            default :
                break;
        }
        
        //其他需要套一个div隐藏显示的情形start
        
        //停止对象的动画
        if($(mainobj.get(0).parentNode).attr("selftype") == "ShowHideControl"){
            $(mainobj.get(0).parentNode).stop(true,true);
            $(mainobj.get(0).parentNode.parentNode).stop(true,true);
            if(mainobj.css("display") != "none"){
                //原来已经显示出来了
                continue;
            }
        }
        
        //获取对象原始信息
        var Oposition = mainobj.css("position").toLowerCase();
        var Oleft = mainobj.css("left").toLowerCase();
        var Otop = mainobj.css("top").toLowerCase();
        var Oright = mainobj.css("right").toLowerCase();
        var Obottom = mainobj.css("bottom").toLowerCase();
        var Omargin = mainobj.css("margin").toLowerCase();
        var OWidth = mainobj.outerWidth(true);
        var OHeight = mainobj.outerHeight(true);
        
        //限制静态位置类型的对象，不处理某些效果，直接用显示处理
        if(Oposition != "absolute"){
            switch(ShowPara){
                case "left":
                case "top":
                case "topleft":
                    ;
                    break;
                default :
                    //直接展示
                    mainobj.show();
                    try{
                        EndFun(mainobj);
                    }catch(e){;}
                    continue;
                    break;
            }
        }
        
        //获得对象ID
        var idseq = 0;
        var divid = "ShowHideControl" + idseq.toString();  //外套DIV的id
        var idivid = "ShowHideControl_Inner" + idseq.toString(); //内套DIV的id
        while($("#"+divid).length > 0){
            idseq++;
            divid = "ShowHideControl" + idseq.toString();
            idivid = "ShowHideControl_Inner" + idseq.toString();
        }
        
        //
        var outDivHtml; //外套的div的样式
        var innerDivHtml; //内套div
        var outDivLastStyle = "";  //外套div最终的样式
        var innerDivLastStyle = "";
        
        //根据不同的参数计算处理方法start
        switch(ShowPara){
            case "left":   
                //从左往右显示
                innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; position:static; overflow:hidden; \" Oposition='"+Oposition+"' Omargin='"+Omargin+"' selftype='ShowHideControl'></div>";
                
                outDivHtml = "<div id="+divid+" style=\"width:0px; height:"+OHeight+"px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\" selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\"";
                break;
            case "right":
                //从右往左显示
                if(Oposition == "absolute"){
                    //绝对位置的情况start
                    innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; margin-left:-"+OWidth+"px; position:absolute; overflow:hidden; right:0px;\" selftype='ShowHideControl'></div>";
                    
                    var Nleft = Oleft;
                    if(Oposition != "static"){
                        if(Oleft != "auto" && Oleft.indexOf("%") < 0){
                            Nleft = (parseInt(Oleft.replace("px","")) + OWidth).toString() + "px";
                        }
                    }
                    
                    outDivHtml = "<div id="+divid+" style=\"width:0px; height:"+OHeight+"px; overflow:hidden; padding:0px;left:"+Nleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\" $ONRESIZE$  selftype='ShowHideControl'></div>";
                    
                    outDivLastStyle = "width:\""+OWidth.toString()+"px\"";
                    //为消除震动，将div的位置和宽度绑定起来
                    if(Nleft != Oleft){
                        outDivHtml = outDivHtml.replace(/\$ONRESIZE\$/g,"onresize='$(this).css(\"left\",("+Oleft.replace("px","")+"+"+OWidth+"-$(this).outerWidth(true))+\"px\");'");
                    }
                    else{
                        outDivHtml = outDivHtml.replace(/\$ONRESIZE\$/g,"");
                    }
                    //绝对位置的情况end
                }
                else{
                    //静态位置的情况start
                    innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; margin-left:-"+OWidth+"px; position:static; overflow:hidden;\" selftype='ShowHideControl'></div>";
                    
                    outDivHtml = "<div id="+divid+" style=\"width:0px; height:"+OHeight+"px; overflow:hidden; padding:0px;left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\" selftype='ShowHideControl' onresize='$(this.childNodes[0]).css(\"margin-left\",($(this).outerWidth(true) - "+OWidth+") + \"px\");$(this.childNodes[0].childNodes[0]).css(\"margin-left\",("+OWidth+"-$(this).outerWidth(true)) + \"px\");'></div>";
                    
                    outDivLastStyle = "width:\""+OWidth.toString()+"px\"";
                    //静态位置的情况end
                }
                break;
            case "top":   
                //从上往下显示
                innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; position:static; overflow:hidden; \" Oposition='"+Oposition+"' Omargin='"+Omargin+"' selftype='ShowHideControl'></div>";
                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:0px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+"; \" selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "height:\""+OHeight.toString()+"px\"";
                break;
            case "bottom":
                //从下往上显示
                innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; margin-top:-"+OHeight+"px; position:absolute; overflow:hidden; bottom:0px;\"  selftype='ShowHideControl'></div>";
                
                var Ntop = Otop;
                if(Oposition != "static"){
                    if(Otop != "auto" && Otop.indexOf("%") < 0){
                        Ntop = (parseInt(Otop.replace("px","")) + OHeight).toString() + "px";
                    }
                }
                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:0px; overflow:hidden; padding:0px;left:"+Oleft+"; top:"+Ntop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\" $ONRESIZE$  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "height:\""+OHeight.toString()+"px\"";
                //为消除震动，将div的位置和宽度绑定起来
                if(Ntop != Otop){
                    outDivHtml = outDivHtml.replace(/\$ONRESIZE\$/g,"onresize='$(this).css(\"top\",("+Otop.replace("px","")+"+"+OHeight+"-$(this).outerHeight(true))+\"px\");'");
                }
                else{
                    outDivHtml = outDivHtml.replace(/\$ONRESIZE\$/g,"");
                }
                break;    
            case "topleft":   
                //从左上角往右下角显示
                innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; position:static; overflow:hidden; \" Oposition='"+Oposition+"' Omargin='"+Omargin+"' selftype='ShowHideControl'></div>";
                
                outDivHtml = "<div id="+divid+" style=\"width:0px; height:0px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\" selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\",height:\""+OHeight.toString()+"px\"";
                break;
            case "topright":
                //从右上角往左下角显示
                innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; margin-left:-"+OWidth+"px; position:absolute; overflow:hidden; right:0px;\"></div>";
                
                var Nleft = Oleft;
                if(Oposition != "static"){
                    if(Oleft != "auto" && Oleft.indexOf("%") < 0){
                        Nleft = (parseInt(Oleft.replace("px","")) + OWidth).toString() + "px";
                    }
                }
                
                outDivHtml = "<div id="+divid+" style=\"width:0px; height:0px; overflow:hidden; padding:0px;left:"+Nleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\" $ONRESIZE$></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\",height:\""+OHeight.toString()+"px\"";
                //为消除震动，将div的位置和宽度绑定起来
                if(Nleft != Oleft){
                    outDivHtml = outDivHtml.replace(/\$ONRESIZE\$/g,"onresize='$(this).css(\"left\",("+Oleft.replace("px","")+"+"+OWidth+"-$(this).outerWidth(true))+\"px\");'");
                }
                else{
                    outDivHtml = outDivHtml.replace(/\$ONRESIZE\$/g,"");
                }
                break;
            case "bottomleft":
                //从左下角往右上角显示
                innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; margin-top:-"+OHeight+"px; position:absolute; overflow:hidden; bottom:0px;\"  selftype='ShowHideControl'></div>";
                
                var Ntop = Otop;
                if(Oposition != "static"){
                    if(Otop != "auto" && Otop.indexOf("%") < 0){
                        Ntop = (parseInt(Otop.replace("px","")) + OHeight).toString() + "px";
                    }
                }
                
                outDivHtml = "<div id="+divid+" style=\"width:0px; height:0px; overflow:hidden; padding:0px;left:"+Oleft+"; top:"+Ntop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\" $ONRESIZE$  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\",height:\""+OHeight.toString()+"px\"";
                //为消除震动，将div的位置和宽度绑定起来
                if(Ntop != Otop){
                    outDivHtml = outDivHtml.replace(/\$ONRESIZE\$/g,"onresize='$(this).css(\"top\",("+Otop.replace("px","")+"+"+OHeight+"-$(this).outerHeight(true))+\"px\");'");
                }
                else{
                    outDivHtml = outDivHtml.replace(/\$ONRESIZE\$/g,"");
                }
                break;    
            case "bottomright":
                //从右下角往左上角显示
                innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; margin-top:-"+OHeight+"px; margin-left:-"+OWidth+"px; position:absolute; overflow:hidden; bottom:0px; right:0px;\"  selftype='ShowHideControl'></div>";
                
                var Nleft = Oleft;
                if(Oposition != "static"){
                    if(Oleft != "auto" && Oleft.indexOf("%") < 0){
                        Nleft = (parseInt(Oleft.replace("px","")) + OWidth).toString() + "px";
                    }
                }
                
                var Ntop = Otop;
                if(Oposition != "static"){
                    if(Otop != "auto" && Otop.indexOf("%") < 0){
                        Ntop = (parseInt(Otop.replace("px","")) + OHeight).toString() + "px";
                    }
                }
                
                outDivHtml = "<div id="+divid+" style=\"width:0px; height:0px; overflow:hidden; padding:0px;left:"+Nleft+"; top:"+Ntop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\" $ONRESIZE$  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\",height:\""+OHeight.toString()+"px\",left:\""+Oleft+"\",top:\""+Otop+"\"";
                
                //为消除震动，将div的位置和宽度绑定起来
                var newresize = "";
                if(Nleft != Oleft){
                    newresize = "$(this).css(\"left\",("+Oleft.replace("px","")+"+"+OWidth+"-$(this).outerWidth(true))+\"px\");";
                }
                
                if(Ntop != Otop){
                    newresize += "$(this).css(\"top\",("+Otop.replace("px","")+"+"+OHeight+"-$(this).outerHeight(true))+\"px\");";
                }
                
                if(newresize != ""){
                    outDivHtml = outDivHtml.replace(/\$ONRESIZE\$/g,"onresize='"+newresize+"'");
                }
                else{
                    outDivHtml = outDivHtml.replace(/\$ONRESIZE\$/g,"");
                }
                break; 
            case "center":
                //从中间到四周
                var Nleft = Oleft;
                if(Oposition != "static"){
                    if(Oleft != "auto" && Oleft.indexOf("%") < 0){
                        Nleft = (Math.floor(parseInt(Oleft.replace("px","")) + OWidth/2)).toString() + "px";
                    }
                }
                
                var Ntop = Otop;
                if(Oposition != "static"){
                    if(Otop != "auto" && Otop.indexOf("%") < 0){
                        Ntop = (Math.floor(parseInt(Otop.replace("px","")) + OHeight/2)).toString() + "px";
                    }
                }
                
                innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; margin-top:-"+Math.floor(OHeight/2)+"px; margin-left:-"+Math.floor(OWidth/2)+"px; position:absolute; overflow:hidden; \"  selftype='ShowHideControl'></div>";
                
                outDivHtml = "<div id="+divid+" style=\"width:0px; height:0px; overflow:hidden; padding:0px;left:"+Nleft+"; top:"+Ntop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\"  onresize='$(\"#"+idivid+"\").css({\"margin-left\":\"-\"+Math.floor(("+OWidth+"-$(this).outerWidth(true))/2)+\"px\",\"margin-top\":\"-\"+Math.floor(("+OHeight+"-$(this).outerHeight(true))/2)+\"px\"});'  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\",height:\""+OHeight.toString()+"px\",left:\""+Oleft+"\",top:\""+Otop+"\"";
                break; 
                
            case "left-move":
               //从左边移动进来
               innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; position:static; overflow:hidden; margin-left:-"+OWidth+"px;\"  selftype='ShowHideControl'></div>";
                innerDivLastStyle = "\"margin-left\":\"0px\"";
                                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\"  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\",left:\""+Oleft+"\"";
                break;
            case "right-move":
                //从右边移进来
                innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px;margin-left:"+OWidth+"px; position:static; overflow:hidden;\"  selftype='ShowHideControl'></div>";
                innerDivLastStyle = "\"margin-left\":\"0px\"";
                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\"  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\"";
                break;
            case "top-move":
               //从上边移动进来
               innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; position:static; overflow:hidden; margin-top:-"+OHeight+"px;\"  selftype='ShowHideControl'></div>";
                innerDivLastStyle = "\"margin-top\":\"0px\"";
                                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\"  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\",left:\""+Oleft+"\"";
                break;
            case "bottom-move":
                //从右边移进来
                innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px;margin-top:"+OHeight+"px; position:static; overflow:hidden;\"  selftype='ShowHideControl'></div>";
                innerDivLastStyle = "\"margin-top\":\"0px\"";
                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\"  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\"";
                break;
            case "topleft-move":
               //从左上角移动进来
               innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; position:static; overflow:hidden; margin-left:-"+OWidth+"px; margin-top:-"+OHeight+"px;\"  selftype='ShowHideControl'></div>";
                innerDivLastStyle = "\"margin-left\":\"0px\",\"margin-top\":\"0px\"";
                                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\"  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\"";
                break;
            case "topright-move":
               //从右上角移动进来
               innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; position:static; overflow:hidden; margin-left:"+OWidth+"px; margin-top:-"+OHeight+"px;\"  selftype='ShowHideControl'></div>";
                innerDivLastStyle = "\"margin-left\":\"0px\",\"margin-top\":\"0px\"";
                                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\"  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\"";
                break;
            case "bottomleft-move":
               //从左下角移动进来
               innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; position:static; overflow:hidden; margin-left:-"+OWidth+"px; margin-top:"+OHeight+"px;\"  selftype='ShowHideControl'></div>";
                innerDivLastStyle = "\"margin-left\":\"0px\",\"margin-top\":\"0px\"";
                                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\"  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\"";
                break;
            case "bottomright-move":
               //从右下角移动进来
               innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; position:static; overflow:hidden; margin-left:"+OWidth+"px; margin-top:"+OHeight+"px;\"  selftype='ShowHideControl'></div>";
                innerDivLastStyle = "\"margin-left\":\"0px\",\"margin-top\":\"0px\"";
                                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\"  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\"";
                break;
            default :
                mainobj.show();
                try{
                    EndFun(mainobj);
                }catch(e){;}
                continue;
                break;
        }
        //根据不同的参数计算处理方法end
        
        //设置对象在套中的位置和大小
        mainobj.css({position:"static",margin:"0px"});
        
        //将对象套入DIV中
        mainobj.wrap(outDivHtml);
        mainobj.wrap(innerDivHtml);        
        
        //在对象上绑定事件
        mainobj.data("ShowHideControlEndFun",EndFun);
        
        //将其显示出来
        mainobj.show();
        
        
        //通过动画执行
        var js = "$(\"#"+divid+"\").animate({"+outDivLastStyle+"}, "+ShowTime.toString()+",\"linear\",function(){ShowHideControlTimerEnd(\""+idivid+"\",true,\""+Oposition+"\",\""+Omargin+"\");});";
        if(innerDivLastStyle != ""){
            js += "$(\"#"+idivid+"\").animate({"+innerDivLastStyle+"}, "+ShowTime.toString()+");";
        }
        eval(js);
        
        //其他需要套一个div隐藏显示的情形end
    }
    //循环进行处理end
 },
 /*
  --THide--
  $("").THide([ShowPara],[ShowTime],[EndFun])
     隐藏对象,注意，这里不会考虑浮动在位置上的情况，因此如果需浮动显示效果，可以在要显示或隐藏的对象外面套一个浮动的div
     [ShowPara]  :  显示参数，默认为"normal"
         normal-正常的隐藏，无特效
         left-从左到右显示的反向隐藏
         right-从右到左显示的反向隐藏-暂时不支持静态位置的对象
         top-从上到下显示的反向隐藏
         bottom-从下到上显示的反向隐藏-暂时不支持静态位置的对象
         topleft-从左上角到右下角显示的反向隐藏
         topright-从右上角到左下角的反向隐藏-暂时不支持静态位置的对象
         bottomleft-从左下角到右上角的反向隐藏-暂时不支持静态位置的对象
         bottomright-从右下角到左上角的反向隐藏-暂时不支持静态位置的对象
         center-从中间到四周的反向隐藏-暂时不支持静态位置的对象
         alpha-透明度
         
         left-move : 从左边移动进来的反向隐藏-暂时不支持静态位置的对象
         right-move : 从右边移动进来的反向隐藏-暂时不支持静态位置的对象
         top-move: 从上边移动进来的反向隐藏-暂时不支持静态位置的对象
         bottom-move: 从下边移动进来的反向隐藏-暂时不支持静态位置的对象
         topleft-move :从左上角移动进来的反向隐藏-暂时不支持静态位置的对象
         topright-move: 从右上角移动进来的反向隐藏-暂时不支持静态位置的对象
         bottomleft-move: 从左下角移动进来的反向隐藏-暂时不支持静态位置的对象
         bottomright-move: 从右下角移动进来的反向隐藏-暂时不支持静态位置的对象
     [ShowTime] : 显示速度，多长时间显示出来（单位是毫秒），默认为500毫秒
     [EndFun] : 完成后执行的操作，传入的参数为对象本身的jquery对象
 */
 THide : function() {
    //判断是否处理
    if(this.length <= 0){
        return;
    }
     
    //处理传入参数start
    var ShowPara = "normal";
    var ShowTime = 500;
    var EndFun = null;
    for(var i = 0;i<arguments.length;i++)
    {
        if(arguments[i] == null || arguments[i] === undefined) { 
            continue;  //没有传具体值进来
        }
        switch(i)
        {
            case 0:
                ShowPara = arguments[i].toLowerCase();
                break;
            case 1:
                ShowTime = arguments[i];
                break;
            case 2:
                EndFun = arguments[i];
                break;
            default :
                break;
        }
    }
    //处理传入参数end
    //循环进行处理start
    var mainobj = null;
    for(var i=0;i<this.length;i++){
        mainobj = $(this.get(i));
        if(mainobj.css("display") == "none"){
            //原来已经隐藏了
            continue;
        }
        
        switch(ShowPara){
            case "normal":
                //正常的隐藏
                mainobj.hide();
                try{
                    EndFun(mainobj);
                }catch(e){;}
                continue;
                break;
            case "alpha":
                //透明度逐渐隐藏
                mainobj.fadeOut(ShowTime,function(){try{EndFun($(this));}catch(e){;}});
                continue;
                break;
            default :
                break;
        }
        
        //其他需要套一个div隐藏显示的情形start
        
        //停止对象的动画
        if($(mainobj.get(0).parentNode).attr("selftype") == "ShowHideControl"){
            $(mainobj.get(0).parentNode).stop(true,true);
            $(mainobj.get(0).parentNode.parentNode).stop(true,true);
            if(mainobj.css("display") == "none"){
                //原来已经隐藏了
                continue;
            }
        }
        
        //获取对象原始信息
        var Oposition = mainobj.css("position").toLowerCase();
        var Oleft = mainobj.css("left").toLowerCase();
        var Otop = mainobj.css("top").toLowerCase();
        var Oright = mainobj.css("right").toLowerCase();
        var Obottom = mainobj.css("bottom").toLowerCase();
        var Omargin = mainobj.css("margin").toLowerCase();
        var OWidth = mainobj.outerWidth(true);
        var OHeight = mainobj.outerHeight(true);
        
        //限制静态位置类型的对象，不处理某些效果，直接用隐藏处理
        if(Oposition != "absolute"){
            switch(ShowPara){
                case "left":
                case "top":
                case "topleft":
                    ;
                    break;
                default :
                    //直接展示
                    mainobj.hide();
                    try{
                        EndFun(mainobj);
                    }catch(e){;}
                    continue;
                    break;
            }
        }
        
        //获得对象ID
        var idseq = 0;
        var divid = "ShowHideControl" + idseq.toString();  //外套DIV的id
        var idivid = "ShowHideControl_Inner" + idseq.toString(); //内套DIV的id
        while($("#"+divid).length > 0){
            idseq++;
            divid = "ShowHideControl" + idseq.toString();
            idivid = "ShowHideControl_Inner" + idseq.toString();
        }
        
        //
        var outDivHtml; //外套的div的样式
        var innerDivHtml; //内套div
        var outDivLastStyle = "";  //外套div最终的样式
        var innerDivLastStyle = "";
        
        //根据不同的参数计算处理方法start
        switch(ShowPara){
            case "left":   
                //从左往右显示的相反隐藏
                innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; position:static; overflow:hidden; \" Oposition='"+Oposition+"' Omargin='"+Omargin+"' selftype='ShowHideControl'></div>";
                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\" selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\"0px\"";
                break;
            case "right":
                //从右往左显示的相反隐藏
                    //绝对位置的情况start
                    innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; margin-left:-"+OWidth+"px; position:absolute; overflow:hidden; right:0px;\" selftype='ShowHideControl'></div>";
                    
                    var Nleft = Oleft;
                    if(Oposition != "static"){
                        if(Oleft != "auto" && Oleft.indexOf("%") < 0){
                            Nleft = (parseInt(Oleft.replace("px","")) + OWidth).toString() + "px";
                        }
                    }
                    
                    outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px;left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\" $ONRESIZE$  selftype='ShowHideControl'></div>";
                    
                    outDivLastStyle = "width:\"0px\"";
                    //为消除震动，将div的位置和宽度绑定起来
                    if(Nleft != Oleft){
                        outDivHtml = outDivHtml.replace(/\$ONRESIZE\$/g,"onresize='$(this).css(\"left\",("+Oleft.replace("px","")+"+"+OWidth+"-$(this).outerWidth(true))+\"px\");'");
                    }
                    else{
                        outDivHtml = outDivHtml.replace(/\$ONRESIZE\$/g,"");
                    }
                    //绝对位置的情况end

                break;
            case "top":   
                //从上往下显示的相反隐藏
                innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; position:static; overflow:hidden; \" Oposition='"+Oposition+"' Omargin='"+Omargin+"' selftype='ShowHideControl'></div>";
                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+"; \" selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "height:\"0px\"";
                break;
            case "bottom":
                //从下往上显示
                innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; margin-top:-"+OHeight+"px; position:absolute; overflow:hidden; bottom:0px;\"  selftype='ShowHideControl'></div>";
                
                var Ntop = Otop;
                if(Oposition != "static"){
                    if(Otop != "auto" && Otop.indexOf("%") < 0){
                        Ntop = (parseInt(Otop.replace("px","")) + OHeight).toString() + "px";
                    }
                }
                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px;left:"+Oleft+"; top:"+Ntop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\" $ONRESIZE$  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "height:\"0px\"";
                //为消除震动，将div的位置和宽度绑定起来
                if(Ntop != Otop){
                    outDivHtml = outDivHtml.replace(/\$ONRESIZE\$/g,"onresize='$(this).css(\"top\",("+Otop.replace("px","")+"+"+OHeight+"-$(this).outerHeight(true))+\"px\");'");
                }
                else{
                    outDivHtml = outDivHtml.replace(/\$ONRESIZE\$/g,"");
                }
                break;    
            case "topleft":   
                //从左上角往右下角显示
                innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; position:static; overflow:hidden; \" Oposition='"+Oposition+"' Omargin='"+Omargin+"' selftype='ShowHideControl'></div>";
                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\" selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\"0px\",height:\"0px\"";
                break;
            case "topright":
                //从右上角往左下角显示
                innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; margin-left:-"+OWidth+"px; position:absolute; overflow:hidden; right:0px;\"></div>";
                
                var Nleft = Oleft;
                if(Oposition != "static"){
                    if(Oleft != "auto" && Oleft.indexOf("%") < 0){
                        Nleft = (parseInt(Oleft.replace("px","")) + OWidth).toString() + "px";
                    }
                }
                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px;left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\" $ONRESIZE$></div>";
                
                outDivLastStyle = "width:\"0px\",height:\"0px\"";
                //为消除震动，将div的位置和宽度绑定起来
                if(Nleft != Oleft){
                    outDivHtml = outDivHtml.replace(/\$ONRESIZE\$/g,"onresize='$(this).css(\"left\",("+Oleft.replace("px","")+"+"+OWidth+"-$(this).outerWidth(true))+\"px\");'");
                }
                else{
                    outDivHtml = outDivHtml.replace(/\$ONRESIZE\$/g,"");
                }
                break;
            case "bottomleft":
                //从左下角往右上角显示
                innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; margin-top:-"+OHeight+"px; position:absolute; overflow:hidden; bottom:0px;\"  selftype='ShowHideControl'></div>";
                
                var Ntop = Otop;
                if(Oposition != "static"){
                    if(Otop != "auto" && Otop.indexOf("%") < 0){
                        Ntop = (parseInt(Otop.replace("px","")) + OHeight).toString() + "px";
                    }
                }
                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px;left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\" $ONRESIZE$  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\"0px\",height:\"0px\"";
                //为消除震动，将div的位置和宽度绑定起来
                if(Ntop != Otop){
                    outDivHtml = outDivHtml.replace(/\$ONRESIZE\$/g,"onresize='$(this).css(\"top\",("+Otop.replace("px","")+"+"+OHeight+"-$(this).outerHeight(true))+\"px\");'");
                }
                else{
                    outDivHtml = outDivHtml.replace(/\$ONRESIZE\$/g,"");
                }
                break;    
            case "bottomright":
                //从右下角往左上角显示
                innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; margin-top:-"+OHeight+"px; margin-left:-"+OWidth+"px; position:absolute; overflow:hidden; bottom:0px; right:0px;\"  selftype='ShowHideControl'></div>";
                
                var Nleft = Oleft;
                if(Oposition != "static"){
                    if(Oleft != "auto" && Oleft.indexOf("%") < 0){
                        Nleft = (parseInt(Oleft.replace("px","")) + OWidth).toString() + "px";
                    }
                }
                
                var Ntop = Otop;
                if(Oposition != "static"){
                    if(Otop != "auto" && Otop.indexOf("%") < 0){
                        Ntop = (parseInt(Otop.replace("px","")) + OHeight).toString() + "px";
                    }
                }
                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px;left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\" $ONRESIZE$  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\"0px\",height:\"0px\",left:\""+Nleft+"\",top:\""+Ntop+"\"";
                
                //为消除震动，将div的位置和宽度绑定起来
                var newresize = "";
                if(Nleft != Oleft){
                    newresize = "$(this).css(\"left\",("+Oleft.replace("px","")+"+"+OWidth+"-$(this).outerWidth(true))+\"px\");";
                }
                
                if(Ntop != Otop){
                    newresize += "$(this).css(\"top\",("+Otop.replace("px","")+"+"+OHeight+"-$(this).outerHeight(true))+\"px\");";
                }
                
                if(newresize != ""){
                    outDivHtml = outDivHtml.replace(/\$ONRESIZE\$/g,"onresize='"+newresize+"'");
                }
                else{
                    outDivHtml = outDivHtml.replace(/\$ONRESIZE\$/g,"");
                }
                break; 
            case "center":
                //从中间到四周
                var Nleft = Oleft;
                if(Oposition != "static"){
                    if(Oleft != "auto" && Oleft.indexOf("%") < 0){
                        Nleft = (Math.floor(parseInt(Oleft.replace("px","")) + OWidth/2)).toString() + "px";
                    }
                }
                
                var Ntop = Otop;
                if(Oposition != "static"){
                    if(Otop != "auto" && Otop.indexOf("%") < 0){
                        Ntop = (Math.floor(parseInt(Otop.replace("px","")) + OHeight/2)).toString() + "px";
                    }
                }
                
                innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; margin-top:-"+Math.floor(OHeight/2)+"px; margin-left:-"+Math.floor(OWidth/2)+"px; position:absolute; overflow:hidden; \"  selftype='ShowHideControl'></div>";
                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px;left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\"  onresize='$(\"#"+idivid+"\").css({\"margin-left\":\"-\"+Math.floor(("+OWidth+"-$(this).outerWidth(true))/2)+\"px\",\"margin-top\":\"-\"+Math.floor(("+OHeight+"-$(this).outerHeight(true))/2)+\"px\"});'  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\"0px\",height:\"0px\",left:\""+Nleft+"\",top:\""+Ntop+"\"";
                break; 
                
            case "left-move":
               //从左边移动进来
               innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; position:static; overflow:hidden; margin-left0px;\"  selftype='ShowHideControl'></div>";
                innerDivLastStyle = "\"margin-left\":\"-"+OWidth+"px\"";
                                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\"  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\",left:\""+Oleft+"\"";
                break;
            case "right-move":
                //从右边移进来
                innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px;margin-left:0px; position:static; overflow:hidden;\"  selftype='ShowHideControl'></div>";
                innerDivLastStyle = "\"margin-left\":\""+OWidth+"px\"";
                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\"  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\"";
                break;
            case "top-move":
               //从上边移动进来
               innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; position:static; overflow:hidden; margin-top:0px;\"  selftype='ShowHideControl'></div>";
                innerDivLastStyle = "\"margin-top\":\"-"+OHeight+"px\"";
                                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\"  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\",left:\""+Oleft+"\"";
                break;
            case "bottom-move":
                //从右边移进来
                innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px;margin-top:0px; position:static; overflow:hidden;\"  selftype='ShowHideControl'></div>";
                innerDivLastStyle = "\"margin-top\":\""+OHeight+"px\"";
                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\"  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\"";
                break;
            case "topleft-move":
               //从左上角移动进来
               innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; position:static; overflow:hidden; margin-left:0px; margin-top:0px;\"  selftype='ShowHideControl'></div>";
                innerDivLastStyle = "\"margin-left\":\"-"+OWidth+"px\",\"margin-top\":\"-"+OHeight+"px\"";
                                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\"  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\"";
                break;
            case "topright-move":
               //从右上角移动进来
               innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; position:static; overflow:hidden; margin-left:0px; margin-top:0px;\"  selftype='ShowHideControl'></div>";
                innerDivLastStyle = "\"margin-left\":\""+OWidth+"px\",\"margin-top\":\"-"+OHeight+"px\"";
                                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\"  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\"";
                break;
            case "bottomleft-move":
               //从左下角移动进来
               innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; position:static; overflow:hidden; margin-left:0px; margin-top:0px;\"  selftype='ShowHideControl'></div>";
                innerDivLastStyle = "\"margin-left\":\"-"+OWidth+"px\",\"margin-top\":\""+OHeight+"px\"";
                                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\"  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\"";
                break;
            case "bottomright-move":
               //从右下角移动进来
               innerDivHtml = "<div id="+idivid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; padding:0px; margin:0px; position:static; overflow:hidden; margin-left:0px; margin-top:0px;\"  selftype='ShowHideControl'></div>";
                innerDivLastStyle = "\"margin-left\":\""+OWidth+"px\",\"margin-top\":\""+OHeight+"px\"";
                                
                outDivHtml = "<div id="+divid+" style=\"width:"+OWidth+"px; height:"+OHeight+"px; overflow:hidden; padding:0px; left:"+Oleft+"; top:"+Otop+"; right:"+Oright+"; bottom:"+Obottom+"; margin:"+Omargin+"; position:"+Oposition+";\"  selftype='ShowHideControl'></div>";
                
                outDivLastStyle = "width:\""+OWidth.toString()+"px\"";
                break;
            default :
                mainobj.hide();
                try{
                    EndFun(mainobj);
                }catch(e){;}
                continue;
                break;
        }
        //根据不同的参数计算处理方法end
        
        //设置对象在套中的位置和大小
        mainobj.css({position:"static",margin:"0px"});
        
        //将对象套入DIV中
        mainobj.wrap(outDivHtml);
        mainobj.wrap(innerDivHtml);   
        
        //在对象上绑定事件
        mainobj.data("ShowHideControlEndFun",EndFun);     
        
        //通过动画执行
        var js = "$(\"#"+divid+"\").animate({"+outDivLastStyle+"}, "+ShowTime.toString()+",\"linear\",function(){ShowHideControlTimerEnd(\""+idivid+"\",false,\""+Oposition+"\",\""+Omargin+"\");});";
        if(innerDivLastStyle != ""){
            js += "$(\"#"+idivid+"\").animate({"+innerDivLastStyle+"}, "+ShowTime.toString()+");";
        }
        eval(js);
        
        //其他需要套一个div隐藏显示的情形end
    }
    //循环进行处理end
 }
 
});


