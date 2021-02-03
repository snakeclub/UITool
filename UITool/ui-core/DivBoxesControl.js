/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：DivBoxesControl
说明：DIV多格容器控件
文件：DivBoxesControl.js
依赖文件：jquery-1.6.4.min.js
          DragControl.js
          ToolFunction.js
-----------------------*/

/*-----------------------
==DivBoxesControl==
DIV多格容器控件
-----------------------*/
;(function($) {
/*
--DivBoxes_Live_Setup--
是否已经为页面的所有messdiv和deletebutton绑定了事件
*/
var DivBoxes_Live_Setup = false;

/*
  --DivBoxes--
  创建多格容器控件
*/
$.DivBoxes = function(tableDefine,JQueryObj,opts) {
    //处理参数项
    opts = $.extend({}, $.DivBoxes.defaults, opts || {});
    opts.mainDivCSS = $.extend({}, $.DivBoxes.defaults.mainDivCSS, opts.mainDivCSS || {});
    opts.boxDivCSS = $.extend({}, $.DivBoxes.defaults.boxDivCSS, opts.boxDivCSS || {});
    opts.boxDivHoverCSS = $.extend({}, $.DivBoxes.defaults.boxDivHoverCSS, opts.boxDivHoverCSS || {});
    opts.boxDivSelectedCSS = $.extend({}, $.DivBoxes.defaults.boxDivSelectedCSS, opts.boxDivSelectedCSS || {});
    opts.deleteDivCSS = $.extend({}, $.DivBoxes.defaults.deleteDivCSS, opts.deleteDivCSS || {});
    opts.deleteDivHoverCSS = $.extend({}, $.DivBoxes.defaults.deleteDivHoverCSS, opts.deleteDivHoverCSS || {});
    
    if(JQueryObj === undefined || JQueryObj == null){
        JQueryObj = "";
    }
    
    //解析tableDefine
    var boxid = (DivBoxesIDSeq++).toString();
    $(document.body).append("<table id='DivBoxesTempTable' style='display:none;'>"+tableDefine+"</table>");
    var tableHTML = "";
    var temptr = $("#DivBoxesTempTable").get(0).rows;
    for(var i = 0;i<temptr.length;i++){
        var temptdHtml = "";
        var maxTrHeight = 0;
        var temptd = temptr[i].cells;
        for(var j = 0;j<temptd.length;j++){
            var tdWidth = parseInt($(temptd[j]).css("width") != "auto" ? $(temptd[j]).css("width") : $(temptd[j]).attr("width"));
            if(isNaN(tdWidth)) tdWidth = -1;
            var tdHeight = parseInt($(temptd[j]).css("height") != "auto" ? $(temptd[j]).css("height") : $(temptd[j]).attr("height"));
            if(isNaN(tdHeight)) tdHeight = -1;
            maxTrHeight = Math.max(maxTrHeight,tdHeight);
            
            //组织td语句
            temptdHtml += "<td rowspan='"+ $(temptd[j]).attr("rowspan")+"' colspan='"+ $(temptd[j]).attr("colspan")+"' style='border:0px solid #000; overflow:hidden;"+(tdWidth==-1?"":"width:"+tdWidth+"px;")+"'></td>"
        }
        var trHeight = parseInt($(temptr[i]).css("height") != "auto" ? $(temptr[i]).css("height") : $(temptr[i]).attr("height"));
        if(isNaN(trHeight)) trHeight = -1;
        maxTrHeight = Math.max(maxTrHeight,trHeight);
        //组织tr语句
        tableHTML += "<tr style='border:0px solid #000; overflow:hidden; "+(maxTrHeight==-1?"":"height:"+maxTrHeight+"px;")+"'>"+temptdHtml+"</tr>";
    }
    //组织table语句
    tableHTML = "<table id='"+boxid+"_table' selftype='DivBoxes_Table' cellpadding='0' cellspacing='0' style='position:relative;left:0px;top:0px;table-layout:fixed; border=0px; overflow:hidden; margin:0px; padding:0px;'>"+tableHTML+"</table>";
    //删除临时表
    $("#DivBoxesTempTable").remove();
    
    
    //处理主容器对象start
    if(JQueryObj.jquery !== undefined || JQueryObj.nodeType !== undefined){
        //是dom或jquery对象
        JQueryObj = $(JQueryObj);
        if(JQueryObj.length == 0){
            return;
        }
        JQueryObj = $(JQueryObj.get(0));
        
        //如果已设置过容器，则清除原来的容器配置
        if(JQueryObj.attr("DivBoxesID") !== undefined){
            JQueryObj.ClearDivBoxes();
        }
    }
    else{
        //是string类型，建立一个新对象
        var mainDivID = (typeof JQueryObj == "string" ? JQueryObj : "");
        if(mainDivID == ""){
            //生成一个唯一的id
            var tempidseq = 0;
            mainDivID = "DivBoxes_0";
            while($("#"+mainDivID).length > 0){
                tempidseq++;
                mainDivID = "DivBoxes_"+tempidseq;
            }
        }
        //创建一个新的div对象
        var mainDivHtml = "<div id='"+mainDivID+"'></div>";
        $(document.body).append(mainDivHtml);
        
        JQueryObj = $("#"+mainDivID);
        
        //设置主容器样式
        JQueryObj.css(opts.mainDivCSS);
    }
    
    //设置boxid
    JQueryObj.attr("DivBoxesID",boxid);
    
    //编辑模式
    JQueryObj.attr("editMode","false");
    
    
    //绑定参数
    JQueryObj.data("DivBoxesOpts",opts);
    
    //处理主容器对象end
    
    //处理内容容器start
    JQueryObj.append(tableHTML);  //添加表格
    var TableObj = $("#"+boxid+"_table");
    //循环为表格增加内容容器
    for(var i = 0;i<TableObj.get(0).rows.length;i++){
        for(var j = 0;j<TableObj.get(0).rows[i].cells.length;j++){
            var temptd = $(TableObj.get(0).rows[i].cells[j]);
            var cwidth = temptd.outerWidth();
            var cheight = temptd.outerHeight();
            
            //添加内容容器
            temptd.append("<div selftype='DivBoxes_Content' DivBoxesPos='"+i+":"+j+"'></div>");
            var ContentDiv = temptd.children("div[selftype='DivBoxes_Content']");
            ContentDiv.css(opts.boxDivCSS);
            //重新计算大小和其他固定的样式
            ContentDiv.css({width:"100px",height:"100px",position:"relative",overflow:"hidden","z-index":"0"});
            ContentDiv.css({width:(cwidth - ContentDiv.outerWidth(true)+100)+"px",height:(cheight - ContentDiv.outerHeight(true)+100)+"px"});
            
            var pos = ContentDiv.position();
            
            //添加透明遮罩-透明度1%和删除按钮
            temptd.append("<div selftype='DivBoxes_MessDiv' selected='false' style='display:none; position:absolute; border:0px solid #000; background-color:#fff; filter:\"alpha(opacity=1)\"; z-index:1; width:"+cwidth+"px; height:"+cheight+"px; left:"+pos.left+"px; top:"+pos.top+"px;'></div><div selftype='DivBoxes_DeleteBotton'></div>");
            
            //添加删除按钮
            var DeleteBotton = temptd.children("div[selftype='DivBoxes_DeleteBotton']");
            if(opts.deleteDivContent != null){
                DeleteBotton.append(opts.deleteDivContent);
            }
            DeleteBotton.css(opts.deleteDivCSS);
            DeleteBotton.css({display:"none",position:"absolute",left:pos.left + (cwidth - opts.deleteDivPosOfRightTop - DeleteBotton.outerWidth())+"px",top:pos.top + opts.deleteDivPosOfRightTop+"px","z-index":"2"}); 
        }
    }
    //处理内容容器end
    
    //处理主容器大小
    if(opts.fixedX){
        //固定主容器X方向的大小
        JQueryObj.css("overflow-x","auto");
    }
    else{
        //扩展大小
        JQueryObj.css("width",TableObj.outerWidth(true)+"px");
    }
    if(opts.fixedY){
        //固定主容器X方向的大小
        JQueryObj.css("overflow-y","auto");
    }
    else{
        //扩展大小
        JQueryObj.css("height",TableObj.outerHeight(true)+"px");
    }
    
    //为所有messdiv和deletebutton绑定事件
    if(!DivBoxes_Live_Setup){
        $("div[selftype='DivBoxes_MessDiv']").live("mouseover",DivBoxesMessDivMouseOver);  //绑定鼠标移动到对象时的处理函数
        $("div[selftype='DivBoxes_MessDiv']").live("mouseout",DivBoxesMessDivMouseOut);  //绑定鼠标移动离开对象时的处理函数
        $("div[selftype='DivBoxes_MessDiv']").live("mousedown",DivBoxesMessDivMouseDown);  //绑定鼠标按下时的处理函数
	    $("div[selftype='DivBoxes_DeleteBotton']").live("mouseover",DivBoxesDeleteDivMouseOver);  //绑定鼠标移动到对象时的处理函数
	    $("div[selftype='DivBoxes_DeleteBotton']").live("mouseout",DivBoxesDeleteDivMouseOut);  //绑定鼠标移动离开对象时的处理函数
        $("div[selftype='DivBoxes_DeleteBotton']").live("mousedown",function(){return false;});  //阻止冒泡
        $("div[selftype='DivBoxes_DeleteBotton']").live("click",DivBoxesDeleteDivClick);  //绑定鼠标按下时的处理函数
	            
	    DivBoxes_Live_Setup =true;
    }
    
    //处理完成，但如果是编辑模式，进行切换
    if(opts.editMode){
        JQueryObj.DivBoxesModeSwitch("edit");
    }
    
    return JQueryObj;
};

/*
  --ClearDivBoxes--
  清除多个容器控件
*/
$.fn.ClearDivBoxes = function() {
	for(var i = 0;i<this.length;i++){
	    var obj = $(this.get(i));
	    var DivBoxesID = JQueryObj.attr("DivBoxesID");
	    if(DivBoxesID === undefined){
	        //没有设置多格容器
	        continue;
	    }
	    
	    //只要删除容器table和主容器的属性即可
	    obj.removeAttr("DivBoxesID");
	    obj.removeData("DivBoxesOpts");
	    obj.children("table[selftype='DivBoxes_Table']").remove();
	}
};

/*
  --DivBoxesModeSwitch--
  进行编辑模式和一般模式的切换
*/
$.fn.DivBoxesModeSwitch = function(isEdit) {
    //处理参数
    editMode = isEdit;
    
    //循环处理对象
	for(var i = 0;i<this.length;i++){
	    var obj = $(this.get(i));
	    var DivBoxesID = obj.attr("DivBoxesID");
	    if(DivBoxesID === undefined){
	        //没有设置多格容器
	        continue;
	    }
	    
	    var opts = obj.data("DivBoxesOpts");
	    
	    if(obj.attr("editMode") == editMode.toString()){
	        //编辑模式一样，无需修改
	        continue;
	    }
	    
	    if(editMode){
	        //切换到编辑模式start
	        var MessDiv = $(obj.children("table[selftype='DivBoxes_Table']").get(0).cells).children("div[selftype='DivBoxes_MessDiv']");
	        var DeleteDiv = MessDiv.siblings("div[selftype='DivBoxes_DeleteBotton']");
	        MessDiv.show();  //显示所有屏蔽层
	        
	        //切换到编辑模式end
	    }
	    else{
	        //切换到非编辑模式start
	        var MessDiv = $(obj.children("table[selftype='DivBoxes_Table']").get(0).cells).children("div[selftype='DivBoxes_MessDiv']");
	        var DeleteDiv = MessDiv.siblings("div[selftype='DivBoxes_DeleteBotton']");
	        var ContentDiv = MessDiv.siblings("div[selftype='DivBoxes_Content']");
	        MessDiv.hide();  //隐藏所有屏蔽层
	        DeleteDiv.hide(); //隐藏所有删除按钮
	        
	        //将所有内容容器样式恢复正常
	        ContentDiv.css(opts.boxDivCSS);
	        MessDiv.attr("selected","false");
	        
	        //切换到非编辑模式end
	    }
	    
        //修改参数中的值
        opts.editMode = editMode;
        obj.attr("editMode",editMode.toString());
        obj.data("DivBoxesOpts",opts);
	}
};

/*
  --SelectDivBox--
  编辑模式才有效，将指定的内容容器设置为选中
*/
$.fn.SelectDivBox = function(selected) {
    for(var i = 0;i<this.length;i++){
        var obj = $(this.get(0));
        if(obj.attr("selftype") != "DivBoxes_Content"){
            continue;
        }
        var messdiv = obj.siblings("div[selftype='DivBoxes_MessDiv']");
        if(messdiv.attr("selected") == selected.toString()){
            continue;
        }
        
        var mainDiv = $(obj.parents("[DivBoxesID]").get(0));
        var opts = mainDiv.data("DivBoxesOpts");
        
        if(!opts.editMode){  //不是编辑模式
            continue;
        }
        
        if(opts.selectAble){
            if(selected && !opts.mupitalSelect){
                //不允许多选，将所有对象设置为不选中
                var selectedDiv = $(mainDiv.children("table[selftype='DivBoxes_Table']").get(0).cells).children("div[selftype='DivBoxes_MessDiv'][selected='true']");
                selectedDiv.siblings("div[selftype='DivBoxes_Content']").css(opts.boxDivCSS);
                selectedDiv.attr("selected","false");
            }
            
            //对当前对象进行处理
            if(selected){
                //选中
                messdiv.attr("selected","true");
                obj.css(opts.boxDivSelectedCSS);
                //执行选中的函数
                if(opts.selectedFun != null){
                    try{
                        opts.selectedFun(mainDiv,obj);
                    }catch(e){
                        ;
                    }
                }
            }
            else{
                //取消选中
                messdiv.attr("selected","false");
                obj.css(opts.boxDivCSS);
                //执行选中的函数
                if(opts.unSelectedFun != null){
                    try{
                        opts.unSelectedFun(mainDiv,obj);
                    }catch(e){
                        ;
                    }
                }
            }
        }
    }
};

/*
  --GetDivBox--
  获得内容容器的Jquery对象
*/
$.fn.GetDivBox = function(rowIndex,colIndex) {
    //判断对象是否主容器
    if(this.length == 0){
        return;
    }
    
    var mainDiv = $(this.get(0));
    if(mainDiv.attr("DivBoxesID") === undefined){
        return;
    }
    
    var mainTable = mainDiv.children("table[selftype='DivBoxes_Table']");
    
    //处理参数
    rowIndex = parseInt(rowIndex);
    colIndex = parseInt(colIndex);
    if(isNaN(rowIndex)){
        //获取所有内容容器
        return  $(mainTable.get(0).cells).children("div[selftype='DivBoxes_Content']");
    }
    
    if(rowIndex < 0 || rowIndex >= mainTable.get(0).rows.length){
        //超出索引范围
        return $("");
    }
    
    if(isNaN(colIndex)){
        //获取指定行的所有内容容器
        return $(mainTable.get(0).rows[rowIndex].cells).children("div[selftype='DivBoxes_Content']");
    }
    
    if(colIndex < 0 || colIndex >= mainTable.get(0).rows[rowIndex].cells.length){
        //超出索引范围
        return $("");
    }
    
    return $(mainTable.get(0).rows[rowIndex].cells[colIndex]).children("div[selftype='DivBoxes_Content']");
};


/*
  --AddDivBoxContent--
  向div内容容器中添加显示内容
*/
$.fn.AddDivBoxContent = function(objOrHtml) {
    if(objOrHtml.nodeType !== undefined){
        //dom节点
        objOrHtml = $(objOrHtml);
    }
    
    if(typeof objOrHtml != "string" && objOrHtml.jquery === undefined){
        return;
    }
    
    for(var i = 0;i<this.length;i++){
        var obj = $(this.get(i));
        if(obj.attr("selftype") != "DivBoxes_Content"){
            continue;
        }
        if(typeof objOrHtml == "string"){
            obj.append(objOrHtml);
        }
        else{
            //jquery对象，要移动进去
            obj.append(objOrHtml);
        }
    }
};


/*
  --RemoveDivBoxContent--
  清除div内容容器中的显示内容
*/
$.fn.RemoveDivBoxContent = function() {
    for(var i = 0;i<this.length;i++){
        var obj = $(this.get(i));
        if(obj.attr("selftype") != "DivBoxes_Content"){
            continue;
        }
        obj.empty();
    }
};


/*
  --$.DivBoxes.defaults--
  通过在你的代码重写这些来改变默认行为和样式
*/
$.DivBoxes.defaults={
    //主容器的样式，
    mainDivCSS:{
        padding: "0px",
        margin: "0px",
        width:"800px",
        height:"600px",
        top:"0px",
        left:"0px",
        border:"0px solid #000000"
    },

    // X方向是否固定大小
    fixedX:false,

    // Y方向是否固定大小
    fixedY:false,

    //是否为编辑模式
    editMode:true,

    //内容窗口的样式
    boxDivCSS:{
        padding: "0px",
        margin: "0px",
        border:"1px solid #000000"
    },

    //内容窗口的Hover样式，编辑模式才生效，鼠标移动到内容容器上的样式
    boxDivHoverCSS:{
        border:"1px solid #ff0000"
    },

    //内容窗口的选中样式，编辑模式才生效
    boxDivSelectedCSS:{
        border:"1px solid #00ff00"
    },

    //是否显示清除内容按钮，如果为true，则在鼠标在内容窗口上时显示清除的按钮
    showDeleteDiv:true,
    
    //是否经常显示清除内容按钮，如果为true-无论内容容器是否有内容都显示，false-只有在内容容器有内容时才显示
    allwaysShowDeleteDiv:false,
    
    //仅编辑模式使用，删除按钮点击时执行的函数，传入该函数的参数依次为：主容器的Jquery对象，原内容容器的Jquery对象
    deleteDivClickFun:function(mainDiv,contentDiv){
        contentDiv.RemoveDivBoxContent();
    },


    //编辑模式时鼠标移到内容div上的清除内容按钮样式
    deleteDivCSS:{
        padding: "1px",
        margin: "0px",
        width: "12px",
        height: "12px",
        border:"1px solid #000000",
        color:"Blue",
        "background-color":"Red",
        "font-size":"10px",
        "font-weight":"bolder",
        cursor:"default"
    },

    //编辑模式时鼠标移到清除内容按钮上的样式
    deleteDivHoverCSS:{
        padding: "1px",
        margin: "0px",
        width: "12px",
        height: "12px",
        border:"1px solid #ff0000",
        color:"Red",
        "background-color":"Blue",
        "font-size":"10px",
        "font-weight":"bolder"
    },

    //删除按钮中的内容，可以为html/text/dom对象/jquery对象
    deleteDivContent: "<center>X</center>",
    
    //删除按钮距离右上角的像素距离
    deleteDivPosOfRightTop:10,

    //编辑模式有效，是否允许拖动
    dragAble:true,

    //仅编辑模式使用，拖动动作结束时的判断函数，传入函数的值为主容器的Jquery对象、源内容div的jquery对象、目标div的jquery对象，该函数若返回false，则不执行后续的内容换格操作；可以在这个函数中返回false以终止默认动作，并执行自定义的拖动事件
    dragConfirmFun : null,

    //仅编辑模式使用，拖动完成后（对象换了位置后）执行的函数，可用于改变内容容器内的对象的大小，默认为null。传入该函数的参数依次为：主容器的Jquery对象，原内容容器的Jquery对象，目标内容容器的Jquery对象
    dragEndFun : null,


    //编辑模式有效，是否允许选中，如果为true，则点击鼠标左键为选中（同时只能选中一个），再点击一次为取消选中
    selectAble:true,

    //编辑模式有效，是否允许多项选中，
    mupitalSelect:false,

    //仅编辑模式使用，选中内容容器时的执行的函数，传入该函数的参数依次为：主容器的Jquery对象，选中内容容器的Jquery对象
    selectedFun:null,
    
    //仅编辑模式使用，取消选中内容容器时的执行的函数，传入该函数的参数依次为：主容器的Jquery对象，取消选中内容容器的Jquery对象
    unSelectedFun:null,


    //仅编辑模式使用，内容容器mouseover时执行的函数，传入该函数的参数依次为：主容器的Jquery对象，鼠标在内容容器的Jquery对象，事件event
    mouseOverFun:null,

    //仅编辑模式使用，内容容器mouseout时执行的函数，传入该函数的参数依次为：主容器的Jquery对象，鼠标在内容容器的Jquery对象，事件event
    mouseOutFun:null
};

//一些临时的变量
var DivBoxesIDSeq = 0;

var DivBoxesDraging = false;

//私有函数
/*
  --DivBoxesMessDivMouseOver--
  鼠标在MessDiv上移动时执行的调用函数
*/
var DivBoxesMessDivMouseOver = function(){
    if(DivBoxesDraging){
        //拖动时不处理
        return;
    }
    var MessDiv = $(this);
    var ContentDiv = MessDiv.siblings("div[selftype='DivBoxes_Content']");
    var mainDiv = $(ContentDiv.parents("[DivBoxesID]").get(0));
    if(mainDiv.attr("editMode") != "true"){
        return;
    }
    if(event.fromElement){
        if(event.fromElement == MessDiv.siblings("div[selftype='DivBoxes_DeleteBotton']").get(0)){
            //还在同一个内容卡中
            return;
        }
    }
    var opts = mainDiv.data("DivBoxesOpts");
    
    //改变内容容器CSS样式
    ContentDiv.css(opts.boxDivHoverCSS);

    //显示DeleteDiv
    if(opts.showDeleteDiv){
        if(opts.allwaysShowDeleteDiv || ContentDiv.children().length > 0){
            MessDiv.siblings("div[selftype='DivBoxes_DeleteBotton']").show();
        }
    }
    
    //执行mouseOverFun
    if(opts.mouseOverFun != null){
        try{
            opts.mouseOverFun(mainDiv,ContentDiv,event);
        }catch(e){;};
    }
};


/*
  --DivBoxesMessDivMouseOut--
  鼠标在MessDiv上离开时执行的调用函数
*/
var DivBoxesMessDivMouseOut = function(){
    if(DivBoxesDraging){
        //拖动时不处理
        return;
    }
    var MessDiv = $(this);
    var ContentDiv = MessDiv.siblings("div[selftype='DivBoxes_Content']");
    var mainDiv = $(ContentDiv.parents("[DivBoxesID]").get(0));
    var opts = mainDiv.data("DivBoxesOpts");
    
    if(event.toElement){
        //IE的情况
        if(event.toElement == MessDiv.siblings("div[selftype='DivBoxes_DeleteBotton']").get(0)){
            return;
        }
    }
    
    //改变内容容器CSS样式
    if(MessDiv.attr("selected") == "true"){
        ContentDiv.css(opts.boxDivSelectedCSS);
    }
    else{
        ContentDiv.css(opts.boxDivCSS);
    }
    
    //隐藏DeleteDiv
    if(opts.showDeleteDiv){
        MessDiv.siblings("div[selftype='DivBoxes_DeleteBotton']").hide();
    }
    
    //执行mouseOutFun
    if(opts.mouseOutFun != null){
        try{
            opts.mouseOutFun(mainDiv,ContentDiv);
        }catch(e){;};
    }
};

/*
  --DivBoxesMessDivDragOver--
  拖动时鼠标移动在内容容器上的执行函数
*/
var DivBoxesMessDivDragOver = function(dragPara,ContentDiv,e){
    var mainDiv = $(ContentDiv.parents("[DivBoxesID]").get(0));
    var opts = mainDiv.data("DivBoxesOpts");
    
    //改变内容容器CSS样式
    ContentDiv.css(opts.boxDivHoverCSS);
    
    //执行mouseOverFun
    if(opts.mouseOverFun != null){
        try{
            opts.mouseOverFun(mainDiv,ContentDiv,event);
        }catch(e){;};
    }
};

/*
  --DivBoxesMessDivDragOut--
  拖动时鼠标移动出内容容器的执行函数
*/
var DivBoxesMessDivDragOut = function(dragPara,ContentDiv,e){
    var mainDiv = $(ContentDiv.parents("[DivBoxesID]").get(0));
    var opts = mainDiv.data("DivBoxesOpts");
    var MessDiv = ContentDiv.siblings("div[selftype='DivBoxes_MessDiv']");
    
    //改变内容容器CSS样式
    if(MessDiv.attr("selected") == "true"){
        ContentDiv.css(opts.boxDivSelectedCSS);
    }
    else{
        ContentDiv.css(opts.boxDivCSS);
    }
    
    //隐藏DeleteDiv
    if(opts.showDeleteDiv){
        MessDiv.siblings("div[selftype='DivBoxes_DeleteBotton']").hide();
    }
    
    //执行mouseOutFun
    if(opts.mouseOutFun != null){
        try{
            opts.mouseOutFun(mainDiv,ContentDiv,event);
        }catch(e){;};
    }
};

/*
  --DivBoxesMessDivMouseDown--
  鼠标在MessDiv上按下时执行的调用函数
*/
var DivBoxesMessDivMouseDown = function(){
    var ContentDiv = $(this).siblings("div[selftype='DivBoxes_Content']");
    var mainDiv = $(ContentDiv.parents("[DivBoxesID]").get(0));
    if(mainDiv.attr("editMode") != "true"){
        return;
    }
    var opts = mainDiv.data("DivBoxesOpts");
    
    if(opts.dragAble && ContentDiv.children().length > 0){
        //允许拖动处理
        //DivBoxesDraging = true;
        ContentDiv.Drag({
            moveCopy:true,
            overPage:true,
            confirmFun:function(){return false;},
            endDragFun:DivBoxesDragEnd,
            mouseOverFun :DivBoxesMessDivDragOver,
            mouseOutFun :DivBoxesMessDivDragOut,
            dragOnObjPara : {
                //搜索的根节点（最顶层节点）
                rootObj : mainDiv,
                
                //搜索结果是否包含根节点
                withRoot : false,
                
                //搜索的jquery条件
                jqueryStr : "#"+mainDiv.attr("DivBoxesID")+"_table[selftype='DivBoxes_Table'] > * > tr > td > div[selftype='DivBoxes_Content']",
                
                //搜索方向,root - 根节点开始往下搜索，child - 子节点往根节点方向，该参数只有在justFirst为true时才有效
                searchPath : "child",
                
                //是否只返回第1个匹配节点
                justFirst : true
            }
        });
        return;
    }
    else if(opts.selectAble){
        //选中或取消选中
        if($(this).attr("selected") == "true"){
            ContentDiv.SelectDivBox(false);
        }
        else{
            ContentDiv.SelectDivBox(true);
        }
    }
    else{
        //不处理
        return;
    }
};

/*
  --DivBoxesDragEnd--
  拖动对象结束时的执行函数，用于处理拖拽的情况
*/
DivBoxesDragEnd = function(confirm, dragPara, dragOn){
    DivBoxesDraging = false;
    if(dragOn.length != 1){
        //没有匹配到对象
        return;
    }

    var OrgContentDiv = dragPara.List[0].Obj;
    var DestContentDiv = $(dragOn.get(0));
    var mainDiv = $(OrgContentDiv.parents("[DivBoxesID]").get(0));
    var opts = mainDiv.data("DivBoxesOpts");
    
    if(OrgContentDiv.get(0) == dragOn.get(0) && opts.selectAble){
        //选中或取消选中
        if(OrgContentDiv.siblings("div[selftype='DivBoxes_MessDiv']").attr("selected") == "true"){
            OrgContentDiv.SelectDivBox(false);
        }
        else{
            OrgContentDiv.SelectDivBox(true);
        }
        return;
    }
    
    //是否执行移格处理
    var movcontent = true;
    if(opts.dragConfirmFun != null){
        
        try{
            movcontent = opts.dragConfirmFun(mainDiv,OrgContentDiv,DestContentDiv);
        }catch(e){
            ;
        }
    }
    
    if(!movcontent){
        return;
    }
    
    if(DestContentDiv.children().length == 0){
        //目标格子没有内容
        var ocopy = OrgContentDiv.children().clone(true);
        DestContentDiv.append(ocopy);
        OrgContentDiv.empty();
    }
    else{
        //两个格子的内容互换
        var ocopy = OrgContentDiv.children().clone(true);
        var dcopy = DestContentDiv.children().clone(true);
        OrgContentDiv.empty();
        DestContentDiv.empty();
        OrgContentDiv.append(dcopy);
        DestContentDiv.append(ocopy);
    }
    
    if(opts.dragEndFun != null){
        try{
            opts.dragEndFun(mainDiv,OrgContentDiv,DestContentDiv);
        }catch(e){
            ;
        }
    }
};


/*
  --DivBoxesDeleteDivMouseOver--
  鼠标在DeleteDiv上移动时执行的调用函数
*/
var DivBoxesDeleteDivMouseOver = function(){
    var DeleteDiv = $(this);
    var ContentDiv = DeleteDiv.siblings("div[selftype='DivBoxes_Content']");
    var mainDiv = $(ContentDiv.parents("[DivBoxesID]").get(0));
    var opts = mainDiv.data("DivBoxesOpts");
    
    var pos = ContentDiv.position();
    DeleteDiv.css(opts.deleteDivHoverCSS);
    DeleteDiv.css({left:(pos.left+ContentDiv.outerWidth(true) - opts.deleteDivPosOfRightTop - DeleteDiv.outerWidth())+"px",top:pos.top+opts.deleteDivPosOfRightTop+"px"}); 
};

/*
  --DivBoxesDeleteDivMouseOut--
  鼠标在DeleteDiv上离开时执行的调用函数
*/
var DivBoxesDeleteDivMouseOut = function(){
    var DeleteDiv = $(this);
    var ContentDiv = DeleteDiv.siblings("div[selftype='DivBoxes_Content']");
    var MessDiv = DeleteDiv.siblings("div[selftype='DivBoxes_MessDiv']");
    var mainDiv = $(ContentDiv.parents("[DivBoxesID]").get(0));
    var opts = mainDiv.data("DivBoxesOpts");
    var pos = ContentDiv.position();
    
    DeleteDiv.css(opts.deleteDivCSS);
    DeleteDiv.css({left:(pos.left+ContentDiv.outerWidth(true) - opts.deleteDivPosOfRightTop - DeleteDiv.outerWidth())+"px",top:pos.top+opts.deleteDivPosOfRightTop+"px"}); 
    
    if(event.toElement){
        if(event.toElement != MessDiv.get(0)){
            //离开了内容格，要执行一次out的函数
            //改变内容容器CSS样式
            if(MessDiv.attr("selected") == "true"){
                ContentDiv.css(opts.boxDivSelectedCSS);
            }
            else{
                ContentDiv.css(opts.boxDivCSS);
            }
            
            //隐藏DeleteDiv
            if(opts.showDeleteDiv){
                MessDiv.siblings("div[selftype='DivBoxes_DeleteBotton']").hide();
            }
            
            //执行mouseOutFun
            if(opts.mouseOutFun != null){
                try{
                    opts.mouseOutFun(mainDiv,ContentDiv);
                }catch(e){;};
            }
        }
    }
};


/*
  --DivBoxesDeleteDivClick--
  鼠标在DeleteDiv上执行的按钮函数
*/
var DivBoxesDeleteDivClick = function(){
    var DeleteDiv = $(this);
    var ContentDiv = DeleteDiv.siblings("div[selftype='DivBoxes_Content']");
    var mainDiv = $(ContentDiv.parents("[DivBoxesID]").get(0));
    var opts = mainDiv.data("DivBoxesOpts");
    
   if(opts.deleteDivClickFun != null){
      try{
          opts.deleteDivClickFun(mainDiv,ContentDiv,event);
      }catch(e){;}
   }
   //阻止冒泡
   return false;
};

})(jQuery);
