/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：Slider
说明：滑动条控件
文件：Slider.js
依赖文件：jquery-1.6.4.min.js
          PositionControl.js
          ToolFunction.js
          
资源文件：SliderCss/Slider.css
          SliderCss/SliderBlue.css
          SliderImg/Slider.gif
          SliderImg/SliderV.gif
          SliderImg/SliderBlue.gif
          SliderImg/SliderBlueV.gif
          
-----------------------*/
;(function($) {
    //用的滑动块拖动临时变量，用于处理滑动块拖动的一些临时信息
    var SliderDragPara = null;
    
    //滑动条的默认创建参数
    $.Slider = new Object();
    $.Slider.defaults = {   
        //样式前缀
        CssBefore : "Slider",
         
        //范围开始值，必须为正整数
        From : 0,
        
        //范围结束值,必须为正整数，且> From，注意如果范围和Step不匹配，则会根据Step更新范围的结束值
        To : 100,
        
        //每步长度，必须为正整数
        Step : 1,
        
        //每步的显示宽度(单位为px),必须为正整数，将决定最终控件的总宽度
        StepWidth : 2,
        
        //滑动值的转义计算函数，该函数将当前的滑动块数值转义为输出值
        //例如可以设置为function(value){return "StringValue" + value;} 将数值类型的滑动值变成字符类型的选项
        ValueCalculate : function(value){return value;},
        
        //单位前缀，只控制头尾值和滑动块提示值(刻度值不处理)，例如可在数字前加“$”
        UnitBefore : "",
        
        //单位后缀，只控制头尾值和滑动块提示值(刻度值不处理)，例如可在数字后加“%”
        UnitTail : "",
        
        //滑动条是否横向,true-横向，false-纵向
        Horiz : true,
        
        //单值滑动(1个滑动块)还是范围滑动(两个滑动块)
        SingleValue : true,
        
        //是否显示拖动进度(如果不显示，则只有滑动块在背景条上滑动，不会有前端的值颜色显示)
        ShowBarF : true,
        
        //是否反向显示，反向显示代表头尾值在下面（右面），刻度值在上面（左面）
        ReverseShow : false,
        
        //是否显示头尾值
        ShowHeadTailValue : true,
        
        //是否显示刻度值
        ShowScale : true,
        
        //刻度参数，数组个数必须是可被(To - From)/Step平均拆分的
        //null则不显示刻度
        //""-该位置没有刻度，"|"-长刻度且没有文字，"#"-短刻度且没有文字，"|3dd"-长刻度且文字为3dd，"#3dd"-短刻度且文字为3dd
        //数组模式，如果没有被长度整除则会自动增加后续的"",例如["|1","#","|","","#3"]
        //函数模式，从from开始到to，每一个step都会执行该函数，传入的值为value，并根据返回值确定该位置的刻度为多少
        Scale : [],
        
        //是否显示滑动块值提示
        ShowMoveTip : true,
        
        //滑动块提示是否自动隐藏，true-只有拖动滑动块时才显示提示
        MoveTipAutoHide : true,
        
        //只显示被拖动的滑动块提示
        JustMovingTip : true,
        
        //设置滑动块值前的确认函数
        //传入的参数依次为滑动条控件、isBegin(是否前滑动条－如果是单值滑动固定为false)、新的滑动值(显示值)、新的滑动值(真实值)
        //函数必须返回是否允许滑动true/false，控制滑动效果是否生效
        BeforeChangeValue : null,
        
        //滑动值改变后的回调函数
        //传入的参数依次为滑动条控件、isBegin(是否前滑动条－如果是单值滑动固定为false)、新的滑动值(显示值)、新的滑动值(真实值)
        AfterChangeValue : null,
        
        
        //后面部分为控制显示位置样式的参数
        
        //控件的padding大小，如果控件有的内容没能显示出来，则需调整该值,该值为字符串格式，可以为"0px"或"2px 3px 4px 5px" 上右下左
        Padding : "50px",
        
        //滑动块提示值的padding大小,数值大小
        MoveValuePadding : 15,
        
        //头尾值容器与滑动条的距离
        HeadTailSplit : 3,
        
        //刻度容器与滑动条的距离
        ScaleSplit : 0,
        
        //刻度值容器与刻度容器的距离
        ScaleValueSplit : 2,
        
        //滑动块值容器与滑动块的距离
        MoveValueSplit : 0
    };
    
    //在指定对象下创建一个Slider控件
    $.fn.CreateSlider = function(id,opts){
        //获取参数并修正
        opts = $.extend({}, $.Slider.defaults, opts || {});
        opts = SliderCorrectOpts(opts);
                
        //循环对每个对象进行处理
        for(var i = 0;i<this.length;i++){
            var parentobj = $(this.get(i));
            
            //是否自定义id
            var tempid = id;
            if(tempid === undefined){
                var autoidnum = 0;
                while(true){
                    if($("#Slider_"+autoidnum).length > 0){
                        autoidnum++;
                    }
                    else{
                        tempid = "Slider_"+autoidnum;
                        break;
                    }
                }
            }
            
            //创建对象
            var Html = "<div selftype='Slider' id='"+tempid+"' enable='true' ValueBegin='"+opts.From+"' ValueEnd='"+(opts.SingleValue?opts.From:opts.To)+"'></div>";
            parentobj.append(Html);
            var obj = parentobj.children("#"+tempid).last();
            
            //绑定参数
            obj.data("SliderOpts",opts);
            
            //设置样式
            SetSliderStyle(obj);
         }
    };
    
    //设置Slider的当前值
    $.fn.SetSliderValue = function(Value,isBeginValue){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            if(!obj.is("[selftype='Slider']")){
                //不是滑动条
                continue;
            }
            
            //获取对象的参数
            var opts = obj.data("SliderOpts");
            
            //判断可获取的值
            var tempIsBegin = (opts.SingleValue ? false : isBeginValue);

            var maxVal = opts.To;
            var minVal = opts.From;
            if(!opts.SingleValue){
                if(tempIsBegin){
                    maxVal = parseInt(obj.attr("ValueEnd"));
                }else{
                    minVal = parseInt(obj.attr("ValueBegin"));
                }
            }
            var tempValue = Value;
            if(tempValue > maxVal){
                tempValue = maxVal;
            }
            else if(tempValue < minVal){
                tempValue = minVal;
            }
            
            //进行改变值前的判断
            //转义后的显示值
            var showValue = SliderGetValueText(tempValue,opts);
            var BeforeResult = true;
            if(opts.BeforeChangeValue != null){
                try{
                    BeforeResult = opts.BeforeChangeValue(obj,tempIsBegin,showValue,tempValue);
                }catch(e){;}
            }
            
            if(BeforeResult){
                //设置新值和新位置
                obj.attr(tempIsBegin?"ValueBegin":"ValueEnd",tempValue.toString());
                
                var DivBar = obj.children("[SliderType='DivBar']");
                var DivBarF = DivBar.children("[SliderType='DivBarF']");
                
                var DivMoveBox = obj.children("[SliderType='DivMoveBox']");
                var DivMoveBegin = DivMoveBox.children("[SliderType='DivMoveBegin']");
                var DivMoveEnd = DivMoveBox.children("[SliderType='DivMoveEnd']");
                
                var DivMoveValueBox = obj.children("[SliderType='DivMoveValueBox']");
                var DivMoveBeginValue = DivMoveValueBox.children("[SliderType='DivMoveBeginValue']");
                var DivMoveEndValue = DivMoveValueBox.children("[SliderType='DivMoveEndValue']");
                
                SliderSetMovePos(obj,(tempIsBegin ? DivMoveBegin : DivMoveEnd),tempIsBegin,parseInt((tempIsBegin ? DivMoveEnd : DivMoveBegin).attr("pos")),opts,DivBarF,(tempIsBegin ? DivMoveBeginValue : DivMoveEndValue),DivMoveBegin,DivMoveEnd,DivMoveBeginValue,DivMoveEndValue,SliderGetMovePosByVal(opts,tempValue));
                
                //执行变更后的函数
                if(opts.AfterChangeValue != null){
                    try{
                        opts.AfterChangeValue(obj,tempIsBegin,showValue,tempValue);
                    }catch(e){;}
                }
            }
        }
    };
    
    //获取Slider的当前值（转义后的值）
    $.fn.GetSliderValue = function(){
        var ret = this.GetSliderRealValue();
        
        if(ret == null){
            return null;
        }
        
        //开始获取值
        var opts = $(this.get(0)).data("SliderOpts");
        if(opts.ValueCalculate == null){
            //没有定义计算函数，直接返回值
            return ret;
        }
        
        //通过计算函数返回计算值
        if(opts.SingleValue){
            return opts.ValueCalculate(ret);
        }
        else{
            var retarr = new Array(0);
            retarr.push(opts.ValueCalculate(ret[0]));
            retarr.push(opts.ValueCalculate(ret[1]));
            return retarr;
        }
    };
    
    //获取Slider的显示值
    $.fn.GetSliderShowValue = function(){
        var ret = this.GetSliderRealValue();
        
        if(ret == null){
            return null;
        }
        
        //开始获取值
        var opts = $(this.get(0)).data("SliderOpts");

        //通过函数获得显示值
        if(opts.SingleValue){
            return SliderGetValueText(ret,opts);
        }
        else{
            var retarr = new Array(0);
            retarr.push(SliderGetValueText(ret[0],opts));
            retarr.push(SliderGetValueText(ret[1],opts));
            return retarr;
        }
    };
    
    //获取Slider的当前值（实际数字值）
    $.fn.GetSliderRealValue = function(){
        if(this.length == 0){
            return null;
        }
        var obj = $(this.get(0));
        if(!obj.is("[selftype='Slider']")){
            //不是滑动条
            return null;
        }
        
        //开始获取值
        var opts = obj.data("SliderOpts");
        if(opts.SingleValue){
            return parseInt(obj.attr("ValueEnd"));
        }
        else{
            var retarr = new Array(0);
            retarr.push(parseInt(obj.attr("ValueBegin")));
            retarr.push(parseInt(obj.attr("ValueEnd")));
            return retarr;
        }
    };
    
    //设置Slider是否开启
    $.fn.SliderEnable = function(isEnable){
        if(isEnable === undefined){
            //获得是否开启
            if(this.length == 0){
                return null;
            }
            
            return ($(this.get(0)).attr("enable") == "true")
        }
        else{
            //设置是否开启
            for(var i = 0;i<this.length;i++){
                var obj = $(this.get(i));
                if(!obj.is("[selftype='Slider']")){
                    //不是滑动条
                    continue;
                }
                
                //设置
                obj.attr("enable",isEnable.toString());
            }
        }
    };
    
    //重设Slider的参数
    $.fn.RetSetSliderOpts = function(opts){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            if(!obj.is("[selftype='Slider']")){
                //不是滑动条
                continue;
            }
            
            //处理参数
            var oldopts = obj.data("SliderOpts");
            var newopts = $.extend({}, oldopts, opts || {});
            newopts = SliderCorrectOpts(newopts);
            
            //绑定参数
            obj.data("SliderOpts",newopts);
            
            //设置样式
            SetSliderStyle(obj);
        }
    };
    
    //内部函数
    //根据参数重新设置Slider的样式
    function SetSliderStyle(obj){
        //获得对象参数
        var opts = obj.data("SliderOpts");
        if(opts.SingleValue){
            ValueBegin = opts.From;
        }
        var ValueBegin = SliderGetCorrectVal(opts,parseFloat(obj.attr("ValueBegin")));
        var ValueEnd = SliderGetCorrectVal(opts,parseFloat(obj.attr("ValueEnd")));
        obj.attr("ValueBegin",ValueBegin);
        obj.attr("ValueEnd",ValueEnd);
        
        //滑动条宽度
        var barwidth = Math.abs(opts.To - opts.From)/Math.abs(opts.Step)*opts.StepWidth + 1;
        
        //主对象样式
        obj.attr({ScaleL : "0",ScaleS : "0", MaxScaleValue : "0"});
        obj.attr("class",opts.CssBefore + "_DivMain");
        obj.css("padding",opts.Padding);
        
        //清除所有子对象对象
        obj.children().remove();
        
        //重新创建子对象
        var Html = "";
        if(opts.ReverseShow){
            //反向顺序
            Html = "<div SliderType='DivScaleValueBox'> \
                    </div> \
                    <div SliderType='DivScaleBox'> \
                    </div> \
                    <div SliderType='DivBar'> \
                        <div SliderType='DivBarF'></div> \
                    </div> \
                    <div SliderType='DivHeadBox'> \
                        <div SliderType='DivHeadValue'></div> \
                        <div SliderType='DivTailValue'></div> \
                    </div> \
                    <div SliderType='DivMoveBox'> \
                        <div SliderType='DivMoveBegin'></div> \
                        <div SliderType='DivMoveEnd'></div> \
                    </div> \
                    <div SliderType='DivMoveValueBox'> \
                        <div SliderType='DivMoveBeginValue'></div> \
                        <div SliderType='DivMoveEndValue'></div> \
                    </div>";
        }
        else{
            //正常顺序
            Html = "<div SliderType='DivHeadBox'> \
                        <div SliderType='DivHeadValue'></div> \
                        <div SliderType='DivTailValue'></div> \
                    </div> \
                    <div SliderType='DivBar'> \
                        <div SliderType='DivBarF'></div> \
                    </div> \
                    <div SliderType='DivScaleBox'> \
                    </div> \
                    <div SliderType='DivScaleValueBox'> \
                    </div> \
                    <div SliderType='DivMoveBox'> \
                        <div SliderType='DivMoveBegin'></div> \
                        <div SliderType='DivMoveEnd'></div> \
                    </div> \
                    <div SliderType='DivMoveValueBox'> \
                        <div SliderType='DivMoveBeginValue'></div> \
                        <div SliderType='DivMoveEndValue'></div> \
                    </div>";
        }
        
        //添加到对象中
        obj.append(Html);
        
        //获取对象
        var DivHeadBox = obj.children("[SliderType='DivHeadBox']");
        var DivHeadValue = DivHeadBox.children("[SliderType='DivHeadValue']");
        var DivTailValue = DivHeadBox.children("[SliderType='DivTailValue']");
        
        var DivBar = obj.children("[SliderType='DivBar']");
        var DivBarF = DivBar.children("[SliderType='DivBarF']");
        
        var DivScaleBox = obj.children("[SliderType='DivScaleBox']");
        var DivScaleValueBox = obj.children("[SliderType='DivScaleValueBox']");
 
        var DivMoveBox = obj.children("[SliderType='DivMoveBox']");
        var DivMoveBegin = DivMoveBox.children("[SliderType='DivMoveBegin']");
        var DivMoveEnd = DivMoveBox.children("[SliderType='DivMoveEnd']");
        
        var DivMoveValueBox = obj.children("[SliderType='DivMoveValueBox']");
        var DivMoveBeginValue = DivMoveValueBox.children("[SliderType='DivMoveBeginValue']");
        var DivMoveEndValue = DivMoveValueBox.children("[SliderType='DivMoveEndValue']");
        
        //绑定滑动块的鼠标down和up事件
        DivMoveBegin.bind("mousedown",SliderMoveMouseDown);
        DivMoveEnd.bind("mousedown",SliderMoveMouseDown);
        
        
        //创建刻度对象
        if(opts.ShowScale)
            SliderCreateScale(obj,opts);
        
        var ScaleL = parseInt(obj.attr("ScaleL")); //长刻度的高度
        var ScaleS = parseInt(obj.attr("ScaleS"));; //短刻度的高度
        var MaxScaleValue = parseInt(obj.attr("MaxScaleValue"));; //最高刻度值的高度
        
        //对象样式的临时值
        var VorH = "H"; //横向还是纵向
        var LorT = "left";
        if(!opts.Horiz){
            VorH = "V";
            LorT = "top";
        }
        
        //设置对象css样式
        DivBar.attr("class",opts.CssBefore + "_DivBar_"+VorH);  //滑动条背景
        DivBarF.attr("class",opts.CssBefore + "_DivBarF_"+VorH);  //滑动条前端颜色条
        
        DivScaleBox.attr("class",opts.CssBefore + "_DivScaleBox_"+VorH);  //刻度线容器样式
        DivScaleValueBox.attr("class",opts.CssBefore + "_DivScaleValueBox_"+VorH);  //刻度值容器样式
        
        DivHeadBox.attr("class",opts.CssBefore + "_DivHeadBox_"+VorH);  //头尾值容器
        DivHeadValue.attr("class",opts.CssBefore + "_DivHeadValue_"+VorH); //头尾值
        DivTailValue.attr("class",opts.CssBefore + "_DivHeadValue_"+VorH); //头尾值
        
        DivMoveBox.attr("class",opts.CssBefore + "_DivMoveBox_"+VorH); //滑动块容器
        DivMoveBegin.attr("class",opts.CssBefore + "_DivMove_"+VorH); //滑动块
        DivMoveEnd.attr("class",opts.CssBefore + "_DivMove_"+VorH); //滑动块
        
        DivMoveValueBox.attr("class",opts.CssBefore + "_DivMoveValueBox_"+VorH);
        DivMoveBeginValue.attr("class",opts.CssBefore + "_DivMoveValue_"+VorH);
        DivMoveEndValue.attr("class",opts.CssBefore + "_DivMoveValue_"+VorH);
        
        //去掉所有对象的margin属性
        DivHeadBox.css("margin","0px");
        DivBar.css("margin","0px");
        DivScaleBox.css("margin","0px");
        DivScaleValueBox.css("margin","0px");
        DivMoveValueBox.css("margin","0px");
        
        //设置滑动值容器的padding
        DivMoveValueBox.css("padding",opts.MoveValuePadding+"px");
        if(opts.Horiz){
            if(opts.ReverseShow){
                DivMoveValueBox.css({"padding-top":"0px"});
            }
            else{
                DivMoveValueBox.css({"padding-bottom":"0px"});
            }
        }
        else{
            if(opts.ReverseShow){
                DivMoveValueBox.css({"padding-left":"0px"});
            }
            else{
                DivMoveValueBox.css({"padding-right":"0px"});
            }
        }
        
        //设置头尾值
        DivHeadValue.get(0).innerHTML = "<a></a>";
        try{DivHeadValue.get(0).innerHTML = "<a>"+ opts.ValueCalculate(opts.From)+"</a>";}catch(e){;}
        DivHeadValue.css("width",DivHeadValue.children().outerWidth(true)+"px");
        DivTailValue.get(0).innerHTML = "<a></a>";
        try{DivTailValue.get(0).innerHTML =  "<a>"+ opts.ValueCalculate(opts.To)+"</a>";}catch(e){;}
        DivTailValue.css("width",DivTailValue.children().outerWidth(true)+"px");
        
        //根据参数设定那些对象显示，哪些对象不显示
        if(!opts.ShowHeadTailValue){
            DivHeadBox.css("display","none");
        }
        
        if(!opts.ShowScale || DivScaleBox.children().length == 0){
            DivScaleBox.css("display","none");
            DivScaleValueBox.css("display","none");
        }
        else if(DivScaleValueBox.children().length == 0){
            DivScaleValueBox.css("display","none");
        }
        
        if(!opts.ShowBarF){
            DivBarF.css("display","none");
        }
        
        if(!opts.ShowMoveTip){
            DivMoveValueBox.css("display","none");
        }
        
        if(opts.SingleValue){
            //只显示结束的
            DivMoveBegin.css("display","none");
            DivMoveBeginValue.css("display","none");
        }
        
        if(opts.MoveTipAutoHide){
            //只有拖动时才显示
            DivMoveBeginValue.css("display","none");
            DivMoveEndValue.css("display","none");
        }
        
        //根据横向和纵向区分处理
        var PosPara = new Object();  //位置参数对象
        PosPara.objHeight = 0; //对象的高度
        PosPara.objWidth = 0; //对象的宽度
        
        //设置对象的高度和宽度，让对象能正常显示
        obj.css({width:"5000px",height:"5000px"});
        
        if(opts.Horiz){
            //横向    
            //滑动条
            DivBar.css("width",barwidth+"px"); //滑动条宽度
            PosPara.startX = SliderCssValue(DivBar,"margin-left") + SliderCssValue(DivBar,"border-left") + SliderCssValue(DivBar,"padding-left"); //滑动条开始位置
            PosPara.endX = PosPara.startX + barwidth; //滑动条结束位置
            
            PosPara.objWidth = DivBar.outerWidth(true);
            PosPara.objHeight += DivBar.outerHeight(true);
            
            //设置间距
            DivHeadBox.css((opts.ReverseShow?"margin-top":"margin-bottom"),opts.HeadTailSplit + "px");
            DivScaleBox.css((opts.ReverseShow?"margin-bottom":"margin-top"),opts.ScaleSplit + "px");
            DivScaleValueBox.css((opts.ReverseShow?"margin-bottom":"margin-top"),opts.ScaleValueSplit + "px");
            DivMoveValueBox.css((opts.ReverseShow?"margin-top":"margin-bottom"),opts.MoveValueSplit + "px");
            
            //头尾值
            if(opts.ShowHeadTailValue){
                DivHeadBox.css({width:barwidth+"px",height:DivHeadValue.outerHeight(true)+"px"});
                DivHeadValue.css("float","left");
                DivTailValue.css("float","right");
                PosPara.objHeight += DivHeadBox.outerHeight(true);
            }
            
            //刻度
            if(DivScaleBox.css("display") != "none"){
                var MaxScale = Math.max(ScaleL,ScaleS);
                DivScaleBox.css({width:barwidth+"px",height:MaxScale+"px"});
                var DivScaleList = DivScaleBox.children("[SliderType='DivScale']");
                for(var i = 0;i<DivScaleList.length;i++){
                    var tempobj = $(DivScaleList.get(i));
                    var pos = parseInt(tempobj.attr("pos"));
                    var vpos = 0;
                    if(opts.ReverseShow && tempobj.innerHeight() < MaxScale){
                        //反向且为短刻度
                        vpos = MaxScale - tempobj.innerHeight();
                    }
                    tempobj.SetRelativePos(pos,vpos);
                }
                
                PosPara.objHeight += DivScaleBox.outerHeight(true);
            }
            
            //刻度值
            if(DivScaleValueBox.css("display") != "none"){
                DivScaleValueBox.css({width:barwidth+"px",height:MaxScaleValue+"px"});
                var DivScaleValueList = DivScaleValueBox.children("[SliderType='DivScaleValue']");
                var MaxPaddingLeft = 0;
                var MaxPaddingRight = 0;
                for(var i = 0;i<DivScaleValueList.length;i++){
                    var tempobj = $(DivScaleValueList.get(i));
                    var pos = parseInt(tempobj.attr("pos"));
                    var RealPos = pos-parseInt(tempobj.outerWidth(true)/2);
                    tempobj.SetStaticPos(RealPos,0);
                    MaxPaddingLeft = Math.max(MaxPaddingLeft,-RealPos);
                    MaxPaddingRight = Math.max(MaxPaddingRight,RealPos+tempobj.outerWidth(true)-barwidth);
                }
                //显示内容有突出的，增加padding大小并移到正常的位置上
                var SVBPaddingLeft = SliderCssValue(DivScaleValueBox,"padding-left");
                if(MaxPaddingLeft > SVBPaddingLeft){
                    DivScaleValueBox.css({"padding-left":MaxPaddingLeft + "px","margin-left":SVBPaddingLeft-MaxPaddingLeft + "px"});
                }
                var SVBPaddingRight = SliderCssValue(DivScaleValueBox,"padding-right");
                if(MaxPaddingRight > SVBPaddingRight){
                    DivScaleValueBox.css({"padding-right":MaxPaddingRight + "px"});
                }
                
                PosPara.objHeight += DivScaleValueBox.outerHeight(true);
            }
            
            
            //滑动块
            DivMoveBox.css({width:barwidth+"px",height:DivMoveEnd.outerHeight(true)+"px","margin-top":"0px","margin-bottom":"0px"});
            PosPara.DivMoveCenter = parseInt(DivMoveEnd.outerWidth(true)/2);
            PosPara.DivMoveTop = parseInt(DivBar.outerHeight(true)/2) - parseInt(DivMoveEnd.outerHeight(true)/2);
            if(opts.ReverseShow){
                //反向
                PosPara.DivMoveTop += (DivScaleValueBox.css("display") != "none" ? DivScaleValueBox.outerHeight(true) : 0);
                PosPara.DivMoveTop += (DivScaleBox.css("display") != "none" ? DivScaleBox.outerHeight(true) : 0);
            }
            else{
                //正常现象
                PosPara.DivMoveTop += (opts.ShowHeadTailValue ? DivHeadBox.outerHeight(true) : 0);
                //兼容IE8的情况
                if($.browser.msie && parseInt(jQuery.browser.version) > 6){
                    PosPara.DivMoveTop -= (DivScaleBox.css("display") != "none" ? opts.ScaleSplit : 0);
                }
            }
            DivMoveBox.SetStaticPos(null,PosPara.DivMoveTop);
            //显示内容有突出的，增加padding大小并移到正常的位置上
            var DVBPaddingLeft = SliderCssValue(DivMoveBox,"padding-left");
            if(PosPara.DivMoveCenter > DVBPaddingLeft){
                DivMoveBox.css({"padding-left":PosPara.DivMoveCenter + "px","margin-left":DVBPaddingLeft-PosPara.DivMoveCenter + "px"});
            }
            var DVBPaddingRight = SliderCssValue(DivMoveBox,"padding-right");
            if(PosPara.DivMoveCenter > DVBPaddingRight){
                DivMoveBox.css({"padding-right":PosPara.DivMoveCenter + "px"});
            }
            DivMoveBegin.SetStaticPos(null,0);
            DivMoveEnd.SetStaticPos(null,0);
            
            
            //滑动块显示值
            if(DivMoveValueBox.css("display") != "none"){
                DivMoveValueBox.css({width:barwidth+"px",height:DivMoveEndValue.outerHeight(true)+"px"});
                PosPara.DivMoveValueCenter = parseInt(DivMoveEndValue.outerWidth(true)/2);               
                PosPara.DivMoveValueTop = PosPara.DivMoveTop + (opts.ReverseShow ? DivMoveBox.innerHeight() + opts.MoveValueSplit : -DivMoveValueBox.outerHeight(true) - opts.MoveValueSplit);
                DivMoveValueBox.SetStaticPos(-SliderCssValue(DivMoveValueBox,"padding-left"),PosPara.DivMoveValueTop);
            }
        }
        else{
            //纵向
            //滑动条
            DivBar.css("height",barwidth+"px"); //滑动条宽度
            PosPara.startX = SliderCssValue(DivBar,"margin-top") + SliderCssValue(DivBar,"border-top") + SliderCssValue(DivBar,"padding-top"); //滑动条开始位置
            PosPara.endX = PosPara.startX + barwidth; //滑动条结束位置
            
            PosPara.objWidth = DivBar.outerWidth(true);
            PosPara.objHeight += DivBar.outerHeight(true);
            
            //设置间距
            DivHeadBox.css((opts.ReverseShow?"margin-left":"margin-right"),opts.HeadTailSplit + "px");
            DivScaleBox.css((opts.ReverseShow?"margin-right":"margin-left"),opts.ScaleSplit + "px");
            DivScaleValueBox.css((opts.ReverseShow?"margin-right":"margin-left"),opts.ScaleValueSplit + "px");
            DivMoveValueBox.css((opts.ReverseShow?"margin-left":"margin-right"),opts.MoveValueSplit + "px");
            
            //头尾值
            if(opts.ShowHeadTailValue){
                DivHeadBox.css({height:barwidth+"px",width:Math.max(DivHeadValue.outerWidth(true),DivTailValue.outerWidth(true))+"px"});
                if(!opts.ReverseShow){
                    DivHeadValue.css("float","right");
                    DivTailValue.css("float","right");
                }
                DivTailValue.SetStaticPos(0,barwidth-DivTailValue.outerHeight(true));
                PosPara.objWidth += DivHeadBox.outerWidth(true);
            }
            
            //刻度
            if(DivScaleBox.css("display") != "none"){
                var MaxScale = Math.max(ScaleL,ScaleS);
                DivScaleBox.css({height:barwidth+"px",width:MaxScale+"px"});
                
                var DivScaleList = DivScaleBox.children("[SliderType='DivScale']");
                for(var i = 0;i<DivScaleList.length;i++){
                    var tempobj = $(DivScaleList.get(i));
                    var pos = parseInt(tempobj.attr("pos"));
                    var vpos = 0;
                    if(opts.ReverseShow && tempobj.innerWidth() < MaxScale){
                        //反向且为短刻度
                        vpos = MaxScale - tempobj.innerWidth();
                    }
                    tempobj.SetRelativePos(vpos,pos);
                }
                
                PosPara.objWidth += DivScaleBox.outerWidth(true);
            }
            
            //刻度值
            if(DivScaleValueBox.css("display") != "none"){
                DivScaleValueBox.css({height:barwidth+"px",width:MaxScaleValue+"px"});
                
                var DivScaleValueList = DivScaleValueBox.children("[SliderType='DivScaleValue']");
                var MaxPaddingLeft = 0;
                var MaxPaddingRight = 0;
                for(var i = 0;i<DivScaleValueList.length;i++){
                    var tempobj = $(DivScaleValueList.get(i));
                    var pos = parseInt(tempobj.attr("pos"));
                    var RealPos = pos-parseInt(tempobj.outerHeight(true)/2);
                    var hpos = 0;
                    if(tempobj.outerWidth(true) < MaxScaleValue){
                        hpos = parseInt((MaxScaleValue - tempobj.outerWidth(true))/2);
                    }
                    tempobj.SetStaticPos(hpos,RealPos);
                    MaxPaddingLeft = Math.max(MaxPaddingLeft,-RealPos);
                    MaxPaddingRight = Math.max(MaxPaddingRight,RealPos+tempobj.outerHeight(true)-barwidth);
                }
                //显示内容有突出的，增加padding大小并移到正常的位置上
                var SVBPaddingLeft = SliderCssValue(DivScaleValueBox,"padding-top");
                if(MaxPaddingLeft > SVBPaddingLeft){
                    DivScaleValueBox.css({"padding-top":MaxPaddingLeft + "px","margin-top":SVBPaddingLeft-MaxPaddingLeft + "px"});
                }
                var SVBPaddingRight = SliderCssValue(DivScaleValueBox,"padding-bottom");
                if(MaxPaddingRight > SVBPaddingRight){
                    DivScaleValueBox.css({"padding-bottom":MaxPaddingRight + "px"});
                }
                
                PosPara.objWidth += DivScaleValueBox.outerWidth(true);
            }
            
            //设置对象的高度和宽度
            obj.css({width:PosPara.objWidth+"px",height:PosPara.objHeight+"px"});
            
            //滑动块
            DivMoveBox.css({height:barwidth+"px",width:DivMoveEnd.outerWidth(true)+"px","margin-left":"0px","margin-right":"0px"});
            PosPara.DivMoveCenter = parseInt(DivMoveEnd.outerHeight(true)/2);
            PosPara.DivMoveTop = parseInt(DivBar.outerWidth(true)/2) + (opts.ReverseShow? (DivScaleValueBox.css("display") != "none" ? DivScaleValueBox.outerWidth(true) : 0) + (DivScaleBox.css("display") != "none" ? DivScaleBox.outerWidth(true) : 0) : (opts.ShowHeadTailValue ? DivHeadBox.outerWidth(true) : 0)) - parseInt(DivMoveEnd.outerWidth(true)/2);
            DivMoveBox.SetRelativePos(PosPara.DivMoveTop,0); //ie9用SetStaticPos的方法有问题

            //显示内容有突出的，增加padding大小并移到正常的位置上
            var DVBPaddingLeft = SliderCssValue(DivMoveBox,"padding-top");
            if(PosPara.DivMoveCenter > DVBPaddingLeft){
                DivMoveBox.css({"padding-top":PosPara.DivMoveCenter + "px","margin-top":DVBPaddingLeft-PosPara.DivMoveCenter + "px"});
            }
            var DVBPaddingRight = SliderCssValue(DivMoveBox,"padding-bottom");
            if(PosPara.DivMoveCenter > DVBPaddingRight){
                DivMoveBox.css({"padding-bottom":PosPara.DivMoveCenter + "px"});
            }
            DivMoveBegin.SetStaticPos(0,null);
            DivMoveEnd.SetStaticPos(0,null);
            
            
            //滑动块显示值
            if(DivMoveValueBox.css("display") != "none"){
                PosPara.objWidth += 1; // 为了反向情况的显示不会混乱
                DivMoveValueBox.css({height:barwidth+"px",width:DivMoveEndValue.outerWidth(true)+"px","overflow-x":"hidden"});
                PosPara.DivMoveValueCenter = parseInt(DivMoveEndValue.outerHeight(true)/2);
                PosPara.DivMoveValueTop = PosPara.DivMoveTop + (opts.ReverseShow ? DivMoveBox.outerWidth(true) + opts.MoveValueSplit : -DivMoveValueBox.outerWidth(true) - opts.MoveValueSplit);
                DivMoveValueBox.SetStaticPos(PosPara.DivMoveValueTop,-SliderCssValue(DivMoveValueBox,"padding-top"));
                if(!opts.ReverseShow){
                    DivMoveEndValue.css("float","right");
                    DivMoveBeginValue.css("float","right");
                }
                //显示内容有突出的，增加padding大小并移到正常的位置上
                var DMVBPaddingLeft = SliderCssValue(DivMoveValueBox,"padding-top");
                if(PosPara.DivMoveValueCenter > DMVBPaddingLeft){
                    DivMoveValueBox.css({"padding-top":PosPara.DivMoveValueCenter + "px","margin-top":DMVBPaddingLeft-PosPara.DivMoveValueCenter + "px"});
                }
                var DMVBPaddingRight = SliderCssValue(DivMoveValueBox,"padding-bottom");
                if(PosPara.DivMoveValueCenter > DMVBPaddingRight){
                    DivMoveValueBox.css({"padding-bottom":PosPara.DivMoveValueCenter + "px"});
                }
            }
        }
        
        //记录PosData
        obj.data("PosPara",PosPara);
        
        //设置对象的高度和宽度
        obj.css({width:PosPara.objWidth+"px",height:PosPara.objHeight+"px"});
        
        //设置对象的当前值（控制滑动块位置）
        var BeginPos = SliderGetMovePosByVal(opts,ValueBegin);
        var EndPos = SliderGetMovePosByVal(opts,ValueEnd);
        DivMoveBegin.attr("pos",BeginPos.toString());
        DivMoveEnd.attr("pos",EndPos.toString());
                
        SliderSetMovePos(obj,DivMoveBegin,true,EndPos,opts,DivBarF,DivMoveBeginValue,DivMoveBegin,DivMoveEnd,DivMoveBeginValue,DivMoveEndValue,BeginPos);
        SliderSetMovePos(obj,DivMoveEnd,true,BeginPos,opts,DivBarF,DivMoveEndValue,DivMoveBegin,DivMoveEnd,DivMoveBeginValue,DivMoveEndValue,EndPos);
    };
    
    //修正Opts参数中的错误值
    function SliderCorrectOpts(opts){
        //设置几个必须为整数的值
        opts.From = Math.abs(parseInt(opts.From));
        opts.To = Math.abs(parseInt(opts.To));
        opts.Step = Math.abs(parseInt(opts.Step));
        opts.StepWidth = Math.abs(parseInt(opts.StepWidth));
        
        //To必须大于From
        if(opts.From > opts.To){
            opts.To = opts.From + 100*opts.Step;
        }
        
        //Step和范围匹配
        var Mod = Math.abs(opts.To - opts.From)%Math.abs(opts.Step);
        if(Mod > 0){
            //除不尽，增加结束的长度以保证能除尽
            opts.To = opts.From + opts.Step*parseInt(Math.abs(opts.To - opts.From)/Math.abs(opts.Step) + 1);
        }
        
        //刻度值
        if(opts.Scale == null || !($.isFunction(opts.Scale) || $.isArray(opts.Scale))){
            opts.ShowScale = false;
        }
        
        if(opts.ShowScale && $.isArray(opts.Scale)){
            //数组方式，数组必须与宽度匹配
            var barwidth = Math.abs(opts.To - opts.From)/Math.abs(opts.Step)*opts.StepWidth;
            if(opts.Scale.length - 1 > barwidth){
                //个数比像素值还大，变成每个像素一个刻度
                for(var i = opts.Scale.length - 1;i > barwidth;i--){
                    opts.Scale.splice(i,1);
                }
            }
            else if(opts.Scale.length > 2){
                //找到可以整除的值
                while(barwidth%(opts.Scale.length - 1) != 0){
                    //增加一个空白刻度
                    opts.Scale.push("");
                }
            }
            else if(opts.Scale.length == 1){
                //增加一个空白结尾
                opts.Scale.push("");
            }
        }
        
        //返回修改后的值
        return opts;
    };
    
    //将值转换为滑动条显示的内容
    function SliderGetValueText(value,opts){
        //转义
        if(opts.ValueCalculate != null){
            try{
                value = opts.ValueCalculate(value);
            }catch(e){;}
        }
        
        //转换为文本格式并返回
        return opts.UnitBefore + value.toString() + opts.UnitTail;
    };
    
    //创建刻度显示对象
    function SliderCreateScale(obj,opts){
        if(!opts.ShowScale || ($.isArray(opts.Scale) && opts.Scale.length == 0)){
            //无需处理
            return;
        }
        
        //样式参数
        var HV = (opts.Horiz ? "H" : "V");   //横向纵向
        var CssScale = opts.CssBefore + "_DivScale_" + (opts.Horiz ? "H" : "V");
        var CssScaleValue = opts.CssBefore + "_DivScaleValue_" + (opts.Horiz ? "H" : "V");
        
        //在DivMoveBegin前
        var DivMoveBegin = obj.children("[SliderType='DivMoveBegin']");
        
        //bar宽度
        var barwidth = Math.abs(opts.To - opts.From)/Math.abs(opts.Step)*opts.StepWidth;
        
        //刻度容器
        var DivScaleBox = obj.children("[SliderType='DivScaleBox']");
        var DivScaleValueBox = obj.children("[SliderType='DivScaleValueBox']");
        
        //开始添加对象
        var ScaleL = 0; //长刻度的高度
        var ScaleS = 0; //短刻度的高度
        var MaxScaleValue = 0; //最高刻度值的高度
        
        if($.isArray(opts.Scale)){
            //数组的方式
            var splitwidth = barwidth/(opts.Scale.length - 1);
            for(var i = 0;i<opts.Scale.length;i++){
                if(opts.Scale[i] != ""){
                    var pos = i*splitwidth;
                    var LS = (opts.Scale[i].substring(0,1) == "|" ? "L" : "S");
                    //创建刻度对象
                    DivScaleBox.append("<div SliderType='DivScale' class='"+opts.CssBefore+"_DivScale_"+HV+"_"+LS+"' pos='"+pos+"'></div>");
                    //刻度高度
                    var tempscale = DivScaleBox.children(":last");
                    if(LS=="L")
                        ScaleL = (opts.Horiz ? tempscale.innerHeight() : tempscale.innerWidth()); 
                    else
                        ScaleS = (opts.Horiz ? tempscale.innerHeight() : tempscale.innerWidth()); 
                        
                    //创建刻度文字对象
                    if(opts.Scale[i].length > 1){
                        DivScaleValueBox.append("<div SliderType='DivScaleValue' class='"+opts.CssBefore+"_DivScaleValue_"+HV+"' pos='"+pos+"'><a>"+opts.Scale[i].substring(1)+"</a></div>");
                        var tempscalevalue = DivScaleValueBox.children(":last");
                        tempscalevalue.css("width","1000px");
                        tempscalevalue.css("width",tempscalevalue.children().outerWidth(true)+ "px");
                        if(opts.Horiz){
                            MaxScaleValue = Math.max(MaxScaleValue,DivScaleValueBox.children(":last").outerHeight(true));
                        }
                        else{
                            MaxScaleValue = Math.max(MaxScaleValue,DivScaleValueBox.children(":last").outerWidth(true));
                        }
                    }
                }
            }
        }
        else{
            //函数的方式
            var current = opts.From;
            var currentStep = 0;
            while(current != opts.To){
                var pos = currentStep*opts.StepWidth;
                var ScaleString = "";
                try{
                    ScaleString = opts.Scale(current);
                }catch(e){;}
                if(ScaleString != ""){
                    var LS = (ScaleString.substring(0,1) == "|" ? "L" : "S");
                    
                    //创建刻度对象
                    DivScaleBox.append("<div SliderType='DivScale' class='"+opts.CssBefore+"_DivScale_"+HV+"_"+LS+"' pos='"+pos+"'></div>");
                    //刻度高度
                    var tempscale = DivScaleBox.children(":last");
                    if(LS=="L")
                        ScaleL = (opts.Horiz ? tempscale.innerHeight() : tempscale.innerWidth()); 
                    else
                        ScaleS = (opts.Horiz ? tempscale.innerHeight() : tempscale.innerWidth()); 
                        
                    //创建刻度文字对象
                    if(ScaleString.length > 1){
                        DivScaleValueBox.append("<div SliderType='DivScaleValue' class='"+opts.CssBefore+"_DivScaleValue_"+HV+"' pos='"+pos+"'>"+ScaleString.substring(1)+"</div>");
                        var tempscalevalue = DivScaleValueBox.children(":last");
                        tempscalevalue.css("width","1000px");
                        tempscalevalue.css("width",tempscalevalue.children().outerWidth(true)+ "px");
                        if(opts.Horiz){
                            MaxScaleValue = Math.max(MaxScaleValue,DivScaleValueBox.children(":last").outerHeight(true));
                        }
                        else{
                            MaxScaleValue = Math.max(MaxScaleValue,DivScaleValueBox.children(":last").outerWidth(true));
                        }
                    }
                }
                
                //下一个循环
                current = current + opts.Step;
                currentStep++;
            }
        }
        
        //记录刻度高度数据
        obj.attr({ScaleL : ScaleL.toString(),ScaleS : ScaleS.toString(),MaxScaleValue : MaxScaleValue.toString()});
    };
    
    //获得对象样式数值的方法
    function SliderCssValue(obj,cssStyle){
        var ret = parseInt(obj.css(cssStyle));
        if(isNaN(ret)){
            ret = 0;
        }
        
        return ret;
    };
    
    //根据滑动块的象素位置获取滑动条的值
    function SliderGetMoveValueByPx(opts,pos){
        if(pos <= 0){
            return opts.From;
        }
        var barwidth = ((opts.To - opts.From)/opts.Step)*opts.StepWidth + 1;
        if(pos >= barwidth){
            return opts.To;
        }
        
        //在中间的情况,正好是刻度数
        var mod = pos%opts.StepWidth;
        if(mod == 0){
            return opts.From + (pos/opts.StepWidth)*opts.Step;
        }
        
        //不能整除
        if(mod/opts.StepWidth >= 0.5){
            //后一个节点
            return opts.From + (parseInt(pos/opts.StepWidth) + 1)*opts.Step;
        }
        else{
            //前一个节点
            return opts.From + parseInt(pos/opts.StepWidth)*opts.Step;
        }
    };
    
    //根据滑动条值输入值获取准确的滑动条值
    function SliderGetCorrectVal(opts,value){
        //不在取值范围内
        if(value < opts.From){
            return opts.From;
        }
        else if(value > opts.To){
            return opts.To;
        }
        
        //判断是否正确值
        var mod = (value - opts.From)%opts.Step;
        if( mod == 0){
            return value; //直接是准确的值
        }
        
        //判断取前面还是取后面的值
        return value + ( mod/opts.Step >= 0.5 ? opts.Step - mod : 0 - mod);
    };
    
    //根据滑动条值获取滑动块的位置pos。
    function SliderGetMovePosByVal(opts,value){        
        var i = (value - opts.From)/opts.Step;
        return i*opts.StepWidth;
    };
    
    //设置滑动块提示值的位置
    function SliderSetMoveValuePos(Obj,Opts,MoveValueObj,Pos){
        //设置位置值
        MoveValueObj.attr("pos",Pos.toString());
        
        //一些处理需用到的对象
        var PosPara = Obj.data("PosPara");
        var DivMoveValueBox = Obj.children("[SliderType='DivMoveValueBox']");
        var MoveValueList = DivMoveValueBox.children();
        
        //设置提示值的宽高
        MoveValueObj.css("width",MoveValueObj.children().outerWidth(true)+"px");
        MoveValueObj.css("height",MoveValueObj.children().outerHeight(true)+"px");
        
        //开始处理位置
        if(DivMoveValueBox.css("display") != "none"){
            for(var i = 0;i<MoveValueList.length;i++){
                var tempobj = $(MoveValueList.get(i));
                if(tempobj.css("display") != "none"){
                    if(Opts.Horiz){
                        tempobj.SetStaticPos(parseInt(tempobj.attr("pos"))-parseInt(tempobj.innerWidth()/2)-SliderCssValue(tempobj,"border-left-width"),0);
                    }
                    else{
                        tempobj.SetStaticPos(0,parseInt(tempobj.attr("pos"))-parseInt(tempobj.innerHeight()/2)-SliderCssValue(tempobj,"border-top-width"));
                    }
                }
            }
        }
    };
    
    //设置滑动块的位置
    function SliderSetMovePos(Obj,MoveObj,IsBegin,OtherPos,Opts,BarF,MoveValue,MoveBegin,MoveEnd,MoveBeginValue,MoveEndValue,Pos){
        //先获取该位置的值
        var value = SliderGetMoveValueByPx(Opts,Pos);
        var ShowText = SliderGetValueText(value,Opts);
        
        //设置滑动显示对象的显示值
        MoveValue.get(0).innerHTML = "<a>"+ShowText+"</a>";
        
        //计算BarF的长度和开始位移
        var BarFLen = Math.abs(Pos - OtherPos);
        var BarFStart = Math.min(Pos,OtherPos);
        
        //处理滑动显示值
        SliderSetMoveValuePos(Obj,Opts,MoveValue,Pos);
        
        //记录当前滑动块位置和滑动提示信息位置
        MoveObj.attr("pos",Pos.toString());
        
        //一些处理需用到的对象
        var PosPara = Obj.data("PosPara");
        
        //处理位置信息
        if(Opts.Horiz){
            //横向
            if(MoveBegin.css("display") != "none"){
                MoveBegin.SetStaticPos(parseInt(MoveBegin.attr("pos"))-PosPara.DivMoveCenter,null);
            }
            if(MoveEnd.css("display") != "none"){
                MoveEnd.SetStaticPos(parseInt(MoveEnd.attr("pos"))-PosPara.DivMoveCenter,null);
            }
            
            //BarF
            if(BarF.css("display") != "none"){
                BarF.css({width:BarFLen+"px","margin-left":BarFStart+"px"});
            }
        }
        else{
            //纵向
            if(MoveBegin.css("display") != "none"){
                MoveBegin.SetStaticPos(null,parseInt(MoveBegin.attr("pos"))-PosPara.DivMoveCenter);
            }
            if(MoveEnd.css("display") != "none"){
                MoveEnd.SetStaticPos(null,parseInt(MoveEnd.attr("pos"))-PosPara.DivMoveCenter);
            }
            
            //BarF
            if(BarF.css("display") != "none"){
                BarF.css({height:BarFLen+"px","margin-top":BarFStart+"px"});
            }
        }
    };
    
    //滑动块的MouseDown处理函数
    function SliderMoveMouseDown(){
        //修改SliderDragPara变量的值
        SliderDragPara = new Object();
        SliderDragPara.Obj = $(this.parentNode.parentNode);
        
        //判断是否屏蔽状态
        if(SliderDragPara.Obj.attr("enable") != "true"){
            return;
        }
        
        SliderDragPara.Opts = SliderDragPara.Obj.data("SliderOpts");
        var DivMoveBox = SliderDragPara.Obj.children("[SliderType='DivMoveBox']");
        
        if(parseInt(SliderDragPara.Obj.attr("ValueBegin")) == SliderDragPara.Opts.To){
            //开始滑动块在结束位置
            SliderDragPara.MoveObj = DivMoveBox.children("[SliderType='DivMoveBegin']");
        }
        else{
            SliderDragPara.MoveObj = $(this);
        }
        SliderDragPara.IsBegin = SliderDragPara.MoveObj.is("[SliderType='DivMoveBegin']");
        
        
        SliderDragPara.BarF = SliderDragPara.Obj.children("[SliderType='DivBar']").children("[SliderType='DivBarF']");
        
        
        SliderDragPara.MoveBegin = DivMoveBox.children("[SliderType='DivMoveBegin']");
        SliderDragPara.MoveEnd = DivMoveBox.children("[SliderType='DivMoveEnd']");
        
        var DivMoveValueBox = SliderDragPara.Obj.children("[SliderType='DivMoveValueBox']");
        SliderDragPara.MoveBeginValue = DivMoveValueBox.children("[SliderType='DivMoveBeginValue']");
        SliderDragPara.MoveEndValue = DivMoveValueBox.children("[SliderType='DivMoveEndValue']");

        SliderDragPara.MoveValue = (SliderDragPara.IsBegin ? SliderDragPara.MoveBeginValue : SliderDragPara.MoveEndValue);
        SliderDragPara.OtherPos = parseInt((SliderDragPara.IsBegin ? SliderDragPara.MoveEndValue : SliderDragPara.MoveBeginValue).attr("pos"));
        SliderDragPara.MouseStartX = event.clientX;
        SliderDragPara.MouseStartY = event.clientY;
        SliderDragPara.MoveStart = parseInt(SliderDragPara.MoveObj.attr("pos"));
        SliderDragPara.CurrentPos = SliderDragPara.MoveStart;

        SliderDragPara.MoveMin = (SliderDragPara.IsBegin ? SliderGetMovePosByVal(SliderDragPara.Opts,SliderDragPara.Opts.From) : Math.min(SliderGetMovePosByVal(SliderDragPara.Opts,SliderDragPara.Opts.To),SliderDragPara.OtherPos));
        SliderDragPara.MoveMax = (SliderDragPara.IsBegin ? Math.max(SliderGetMovePosByVal(SliderDragPara.Opts,SliderDragPara.Opts.From),SliderDragPara.OtherPos) :  SliderGetMovePosByVal(SliderDragPara.Opts,SliderDragPara.Opts.To));
        
        //修改滑动块的样式
        SliderDragPara.MoveObj.attr("class",SliderDragPara.Opts.CssBefore + "_DivMove_"+(SliderDragPara.Opts.Horiz?"H":"V")+"_Drag");
        
        //显示－隐藏滑动显示值        
        if(SliderDragPara.Opts.ShowMoveTip && SliderDragPara.Opts.MoveTipAutoHide){
            if(SliderDragPara.Opts.JustMovingTip){
                //只显示当前对象
                SliderDragPara.MoveValue.css("display","block");
            }
            else{
                //两个都显示
                SliderDragPara.MoveBeginValue.css("display","block");
                SliderDragPara.MoveEndValue.css("display","block");
            }
        }
        
        //设置当前滑动块值的位置
        SliderSetMoveValuePos(SliderDragPara.Obj,SliderDragPara.Opts,SliderDragPara.MoveValue,SliderDragPara.MoveStart);
        
        //在body上绑定mouseup和mousemove事件
        $(document.body).bind("mouseup",SliderMoveMouseUp);
        $(document.body).bind("mousemove",SliderMoveMouseMove);
        
        //阻止默认行为
        return false;
    };
    
    //滑动块拖动后释放鼠标处理函数
    function SliderMoveMouseUp(){
        if(SliderDragPara != null){
            //释放绑定的事件
            $(document.body).unbind("mouseup",SliderMoveMouseUp);
            $(document.body).unbind("mousemove",SliderMoveMouseMove);
            
            //隐藏滑动块值
            if(SliderDragPara.Opts.ShowMoveTip && SliderDragPara.Opts.MoveTipAutoHide){
                //两个都隐藏
                SliderDragPara.MoveBeginValue.css("display","none");
                SliderDragPara.MoveEndValue.css("display","none");
            }
            
            //修改滑动块的样式
            SliderDragPara.MoveObj.attr("class",SliderDragPara.Opts.CssBefore + "_DivMove_"+(SliderDragPara.Opts.Horiz?"H":"V"));
        
            //设置滑动块值
            //新值，未转义
            var newValue = SliderGetMoveValueByPx(SliderDragPara.Opts,SliderDragPara.CurrentPos);
            //转义后的显示值
            var showValue = SliderGetValueText(newValue,SliderDragPara.CurrentPos);
            
            var BeforeResult = true;
            if(SliderDragPara.Opts.BeforeChangeValue != null){
                try{
                    BeforeResult = SliderDragPara.Opts.BeforeChangeValue(SliderDragPara.Obj,SliderDragPara.IsBegin,showValue,newValue);
                }catch(e){;}
            }
            
            if(BeforeResult){
                //设置新值和新位置
                SliderDragPara.Obj.attr(SliderDragPara.IsBegin?"ValueBegin":"ValueEnd",newValue.toString());
                
                SliderSetMovePos(SliderDragPara.Obj,SliderDragPara.MoveObj,SliderDragPara.IsBegin,SliderDragPara.OtherPos,SliderDragPara.Opts,SliderDragPara.BarF,SliderDragPara.MoveValue,SliderDragPara.MoveBegin,SliderDragPara.MoveEnd,SliderDragPara.MoveBeginValue,SliderDragPara.MoveEndValue,SliderGetMovePosByVal(SliderDragPara.Opts,newValue));
                
                //执行变更后的函数
                if(SliderDragPara.Opts.AfterChangeValue != null){
                    try{
                        SliderDragPara.Opts.AfterChangeValue(SliderDragPara.Obj,SliderDragPara.IsBegin,showValue,newValue);
                    }catch(e){;}
                }
            }
            else{
                //恢复原位置
                SliderSetMovePos(SliderDragPara.Obj,SliderDragPara.MoveObj,SliderDragPara.IsBegin,SliderDragPara.OtherPos,SliderDragPara.Opts,SliderDragPara.BarF,SliderDragPara.MoveValue,SliderDragPara.MoveBegin,SliderDragPara.MoveEnd,SliderDragPara.MoveBeginValue,SliderDragPara.MoveEndValue,SliderDragPara.MoveStart);
            }
                   
            //清空临时变量
            SliderDragPara = null;
        }

        //阻止默认行为
        return false;
    };
    
    //滑动块拖动的鼠标处理函数
    function SliderMoveMouseMove(){
        if(SliderDragPara == null){
            return;
        }
        
        //计算鼠标的偏移量
        var OffSet = 0;
        if(SliderDragPara.Opts.Horiz){
            OffSet = event.clientX - SliderDragPara.MouseStartX;
        }
        else{
            OffSet = event.clientY - SliderDragPara.MouseStartY;
        }
        
        //计算移动的位置
        SliderDragPara.CurrentPos = SliderDragPara.MoveStart + OffSet;
        if(SliderDragPara.CurrentPos > SliderDragPara.MoveMax){
            SliderDragPara.CurrentPos = SliderDragPara.MoveMax;
        }
        else if(SliderDragPara.CurrentPos < SliderDragPara.MoveMin){
            SliderDragPara.CurrentPos = SliderDragPara.MoveMin;
        }
        
        //移动滑动块
        SliderSetMovePos(SliderDragPara.Obj,SliderDragPara.MoveObj,SliderDragPara.IsBegin,SliderDragPara.OtherPos,SliderDragPara.Opts,SliderDragPara.BarF,SliderDragPara.MoveValue,SliderDragPara.MoveBegin,SliderDragPara.MoveEnd,SliderDragPara.MoveBeginValue,SliderDragPara.MoveEndValue,SliderDragPara.CurrentPos);
        
        //阻止默认行为
        return false;
    };
    
})(jQuery);