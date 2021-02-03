/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：ProgressBar
说明：进度条控件
文件：ProgressBar.js
依赖文件：jquery-1.6.4.min.js
          ToolFunction.js
          
          
资源文件：ProgressBarCss/ProgressBar.css
          ProgressBarImg/
          
          
-----------------------*/
;(function($) {
    //默认创建参数
    $.ProgressBar = new Object();
    $.ProgressBar.defaults = {
        //样式前缀
        CssBefore : "ProgressBar",
        
        //进度条宽度,可以为象素值，也可以为百分比，例如300px或80%
        Width : "300px",
        
        //进度条的左右边框象素值之和，用于控制样式
        BorderWidthSum : 2,
        
        //创建时默认的进度，可以为象素值，也可以是百分比
        DefaultProgress : "0%",
        
        //是否显示进度文字
        ShowText : false,
        
        //进度文字内容
        Text : "",
        
        //进度文字方向,Center\Left\Right
        TextPosition : "Center",
        
        //支持渐变的进度跳跃动画效果，预留接口
        ChangeEffect : false,
        
        //动画跳跃效果每次跳跃动画时长，毫秒，预留接口
        EffectTime : 500,
        
        
        //是否等待进度条－循环自动loading
        WaitingBar : false,
        
        //等待进度条的每次循环时间，毫秒为单位
        WaitingTime : 3000,
        
        //等待进度条结束时的进度百分比值，例如0，100 , 59.333
        WaitingEndProgress : 100,
        
        //每次改变进度值执行的函数，在100%的情况下，先执行该函数，再执行结束函数
        //传入值依次为：进度条对象、当前进度百分比值、当前进度进度条象素值
        OnProgressChange : null,
        
        //进度到100%时执行的函数，如果是WaitingBar，则是在调用了结束函数的时候执行
        //传入值依次为：进度条对象、当前进度百分比值、当前进度进度条象素值
        OnFinish : null,
        
        //进度开始时执行的函数，只是WaitingBar使用
        //传入值依次为：进度条对象
        OnWaitingBegin : null
    };
    
    //在指定对象下创建一个ProgressBar控件
    $.fn.CreateProgressBar = function(id,opts){
        //获取参数
        opts = $.extend({}, $.ProgressBar.defaults, opts || {});
        
        //自动扩展宽度
        var autoWidth = (opts.Width.indexOf("%") > -1);
        
        
        //循环对每个对象进行处理
        for(var i = 0;i<this.length;i++){
            var parentobj = $(this.get(i));
            
            //是否自定义id
            var tempid = id;
            if(tempid === undefined){
                var autoidnum = 0;
                while(true){
                    if($("#ProgressBar_"+autoidnum).length > 0){
                        autoidnum++;
                    }
                    else{
                        tempid = "ProgressBar_"+autoidnum;
                        break;
                    }
                }
            }
            
            
            //创建对象
            var HTML = "<DIV id='"+tempid+"' selftype='ProgressBar' style='width:" + opts.Width + "; ' autoWidth='" + autoWidth + "' text='"+opts.Text+"' animating='false'> \
                    <DIV class='"+opts.CssBefore+"_Div' ProgressBarType='Div'> \
		                    <DIV class='"+opts.CssBefore+"_Inner'ProgressBarType='Inner'> \
			                    <DIV class='"+opts.CssBefore+"_Bar' ProgressBarType='Bar'> \
				                    <DIV class='"+opts.CssBefore+"_Text' ProgressBarType='Text'> \
					                    <DIV class='"+opts.CssBefore+"_TextDiv' ProgressBarType='TextDiv'>"
                                            +(opts.ShowText?opts.Text:"")+
                                        "</DIV> \
				                    </DIV> \
				                    <DIV class='"+opts.CssBefore+"_Text "+opts.CssBefore+"_TextBack' ProgressBarType='TextBack'> \
					                    <DIV class='"+opts.CssBefore+"_TextDiv' ProgressBarType='TextBackDiv'>"
                                            +(opts.ShowText?opts.Text:"")+
                                        "</DIV> \
				                    </DIV> \
			                    </DIV> \
		                    </DIV> \
                    </DIV> \
                 </DIV>";

            parentobj.append(HTML);
            var obj = parentobj.children("#"+tempid).last();
            
            //绑定参数
            obj.data("ProgressBarOpts",opts);
            
            //是否显示文字
            if(opts.ShowText){
                if(opts.TextPosition == "Left"){
                    obj.children(":first-child").addClass(opts.CssBefore+"_TextLeft");
                }
                else if(opts.TextPosition == "Right"){
                    obj.children(":first-child").addClass(opts.CssBefore+"_TextRight");
                }
            }
            
            //获得进度条的象素宽度
            var BarWidth = opts.Width.replace("px","");
            if(autoWidth){
                BarWidth = obj.innerWidth(true);
            }
            else{
                BarWidth = parseInt(opts.Width.replace("px",""));
            }
            BarWidth = BarWidth - opts.BorderWidthSum;
            
            //设置宽度
            obj.find("."+opts.CssBefore+"_TextDiv").attr("style","width:"+BarWidth+"px;");
            obj.attr("currentWidth",BarWidth);  //记录当前宽度
            
            //获得当前默认的进度长度
            var DefaultProgressWidth;
            var DefaultProgressWidthPx;
            if(opts.DefaultProgress.indexOf("%") > -1){
                //百分比
                DefaultProgressWidth = parseFloat(opts.DefaultProgress.replace("%",""));
                DefaultProgressWidthPx = parseInt(DefaultProgressWidth * BarWidth / 100);
            }
            else{
                //象素
                DefaultProgressWidthPx = parseInt(opts.DefaultProgress.replace("px",""));
                DefaultProgressWidth = parseInt((DefaultProgressWidthPx / BarWidth) * 100);
            }
            
            //设置宽度
            SetProgressBarWidth(obj,DefaultProgressWidth,DefaultProgressWidthPx)
            
            //绑定按钮事件
            if(autoWidth){
                obj.bind("resize",ProgressBarOnResize);
            }
            
        }
    };
    
    //设定\获取 进度条的当前进度
    $.fn.ProgressBarProgress = function(value,unit,text,exeChangeFun){
        if(arguments.length == 0){
            //获取当前进度
            if(this.length == 0){
                return null;
            }
            var obj = $(this.get(0));
            if(obj.attr("selftype") != "ProgressBar"){
                return null;
            }
            var retObj = new Object();
            retObj.Progress = parseInt(obj.attr("currentProgress"));
            retObj.ProgressPx = parseInt(obj.attr("currentProgressPx"));
            retObj.Text=obj.attr("text");
            return retObj;
        }
        else{
            //设置当前进度
            //先处理参数
            if(unit === undefined){
                unit = "%";
            }
            if(text === undefined){
                text = null;
            }
            if(exeChangeFun === undefined){
                exeChangeFun = true;
            }
            value = parseInt(value);
            if(value < 0){
                value = 0;
            }
            if(unit == "%" && value > 100){
                value = 100;
            }
            
            for(var i = 0;i<this.length;i++){
                var obj = $(this.get(i));
                if(obj.attr("selftype") != "ProgressBar"){
                    continue;
                }
                
                //获得当前要设置的进度值
                var BarWidth = parseInt(obj.attr("currentWidth"));
                var currentValue = value;
                if(unit != "%" && value > BarWidth){
                    currentValue = BarWidth;
                }
                var currentProgress;
                var currentProgressPx;
                if(unit == "%"){
                    currentProgress = currentValue;
                    currentProgressPx = parseInt(currentProgress * BarWidth / 100);
                }
                else{
                    currentProgressPx = currentValue;
                    currentProgress = parseInt((currentProgressPx / BarWidth) * 100);
                }
                
                //设置进度
                SetProgressBarWidth(obj,currentProgress,currentProgressPx);
                
                //设置文字
                if(text != null){
                    obj.ProgressBarChangeText(text);
                }
                
                //执行函数
                if(exeChangeFun){
                    //获得参数
                    var opts = obj.data("ProgressBarOpts");
                    //变更对象执行的对象
                    if(opts.OnProgressChange != null){
                        try{
                            opts.OnProgressChange(obj,currentProgress,currentProgressPx);
                        }catch(e){;}
                    }
                    
                    //进度完成执行的对象
                    if(currentProgress == 100 && opts.OnFinish != null){
                        try{
                            opts.OnFinish(obj,currentProgress,currentProgressPx);
                        }catch(e){;}
                    }
                }
            }
        }
    };
    
    
    //开始等待进度条的处理
    $.fn.ProgressBarBeginWaiting = function(){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            if(obj.attr("selftype") != "ProgressBar"){
                continue;
            }
            
            //获得参数
            var opts = obj.data("ProgressBarOpts");
            if(!opts.WaitingBar){
                continue
            }
            
            //先将进度设置为0
            SetProgressBarWidth(obj,0,0);
            
             //执行开始事件
            if(obj.attr("animating") != "true" && opts.OnWaitingBegin != null){
                try{
                    opts.OnWaitingBegin(obj,parseInt(obj.attr("currentProgress")),parseInt(obj.attr("currentProgressPx")));
                }catch(e){;}
            }
            
            //设置动画状态
            obj.attr("animating","true");
            
            //设置动画
            obj.find("[ProgressBarType='Bar'],[ProgressBarType='Text']").animate(
                  {width: obj.attr("currentWidth")+'px'}, opts.WaitingTime, 
                  function(){ 
                    if($(this).is("[ProgressBarType='Bar']")){ 
                        var pobj = $(this.parentNode.parentNode.parentNode);
                        if(pobj.attr("animating") == "true"){
                            pobj.ProgressBarBeginWaiting();
                        }
                    };
                  });
        }
    };
    
    //停止等待进度条的处理
    $.fn.ProgressBarEndWaiting = function(){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            if(obj.attr("selftype") != "ProgressBar"){
                continue;
            }
            
            //获得参数
            var opts = obj.data("ProgressBarOpts");
            if(!opts.WaitingBar || obj.attr("animating") != "true"){
                continue
            }
            
            //先设置停止参数
            obj.attr("animating","false");
            
            //停止动画
            obj.find("[ProgressBarType='Bar'],[ProgressBarType='Text']").stop(true,true);
            
            //设置对象结束的位置WaitingEndProgress
            obj.ProgressBarProgress(opts.WaitingEndProgress,"%",null,false);
            
            //执行结束函数
            if(opts.OnFinish != null){
                try{
                    opts.OnFinish(obj,parseInt(obj.attr("currentProgress")),parseInt(obj.attr("currentProgressPx")));
                }catch(e){;}
            }
        }
    };
    
    //改变进度条的样式
    $.fn.ProgressBarChangeStyle = function(CssBefore, BorderWidthSum){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            if(obj.attr("selftype") != "ProgressBar"){
                continue;
            }
            
            //获得参数
            var opts = obj.data("ProgressBarOpts");
            
            //变更样式表
            obj.find("*").andSelf().attr("class",function(index, attr){
                    if(attr === undefined)
                        return "";
                        
                    return attr.replace(opts.CssBefore + "_",CssBefore+"_");
                });
                
            //设置参数
            opts.CssBefore = CssBefore;
            opts.BorderWidthSum = BorderWidthSum;
            obj.data("ProgressBarOpts",opts);
            
            //重新设置进度条宽度
            var BarWidth = opts.Width.replace("px","");
            if(opts.Width.indexOf("%") > -1){
                BarWidth = obj.innerWidth(true);
            }
            else{
                BarWidth = parseInt(opts.Width.replace("px",""));
            }
            BarWidth = BarWidth - opts.BorderWidthSum;
            
            //设置宽度
            obj.find("."+opts.CssBefore+"_TextDiv").attr("style","width:"+BarWidth+"px;");
            obj.attr("currentWidth",BarWidth);  //记录当前宽度
            
            //设置进度
            obj.ProgressBarProgress(parseInt(obj.attr("currentProgress")),"%",null,false);
        }
    };
    
    //改变进度条的文字
    $.fn.ProgressBarChangeText = function(text){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            if(obj.attr("selftype") != "ProgressBar"){
                continue;
            }
            
            obj.attr("text",text);
            var opts = obj.data("ProgressBarOpts");
            if(opts.ShowText){
                var objs = obj.find("[ProgressBarType='TextDiv'],[ProgressBarType='TextBackDiv']");
                objs.empty();
                objs.append(text);
            }
        }
    };
    
    
    //以下为内部函数
    //设置进度条的宽度
    function SetProgressBarWidth(obj,width,widthPx){
        //设置宽度
        obj.find("[ProgressBarType='Bar'],[ProgressBarType='Text']").attr("style","width:"+widthPx+"px;");
        //登记当前位置
        obj.attr("currentProgress",width);
        obj.attr("currentProgressPx",widthPx);
    };
    
    //当自适应宽度的情况下，进度条宽度改变后执行的函数
    function ProgressBarOnResize(){
        var obj = $(this);
        var opts = obj.data("ProgressBarOpts");
        var BarWidth = obj.innerWidth(true);
        BarWidth = BarWidth - opts.BorderWidthSum;
            
        //设置宽度
        obj.find("."+opts.CssBefore+"_TextDiv").attr("style","width:"+BarWidth+"px;");
        obj.attr("currentWidth",BarWidth);  //记录当前宽度
        
        //获得当前的进度长度
        var DefaultProgressWidth = parseInt(obj.attr("currentProgress"));
        var DefaultProgressWidthPx = parseInt(DefaultProgressWidth * BarWidth / 100);
        
        //设置宽度
        SetProgressBarWidth(obj,DefaultProgressWidth,DefaultProgressWidthPx)
    };
    
})(jQuery);