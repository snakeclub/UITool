/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：FieldCheckFun
说明：提供对textbox的校验，并返回校验结果（可通过扩展函数扩展到其他对象的校验）
文件：CheckAssistFun.js
依赖文件：PowerString.js
          BaseValidateFun.js
          FieldCheckFun.js
          LimitInputFun.js
          ToolFunction.js
-----------------------*/


/*-----------------------
==CheckAssistFun==
扩展的校验辅助函数
-----------------------*/

/*---------------
--JQuery_UITool_CheckAlert--
CheckAlert函数默认的告警背景和字体颜色
--------------- */
var JQuery_UITool_CheckAlert = new Object();
JQuery_UITool_CheckAlert.BgColor = "FF0000";
JQuery_UITool_CheckAlert.FontColor = "#000000";

/*---------------
--CheckAlert--
textbox对象校验不通过时通过alert方式提示的函数，可用于LimitInputFun和FieldCheckFun中作为alertFun调用
--------------- */
function CheckAlert(JQueryObj,showName,falseDesc){
	try{
	    //保存原颜色
	    var tempattr = JQueryObj.attr("CheckAlertOrgBgColor");
	    if(tempattr === undefined || tempattr == null){
	        JQueryObj.attr("CheckAlertOrgBgColor",JQueryObj.css("background-color"));
	        JQueryObj.attr("CheckAlertOrgFontColor",JQueryObj.css("color"));
	    }
	    //尝试获取告警颜色
	    var Color = JQueryObj.data("CheckAlertPara");
	    if(Color == null || Color === undefined){
	        Color = JQuery_UITool_CheckAlert;
	    }
	    //改变对象颜色
	    JQueryObj.css("background-color",Color.BgColor);
	    JQueryObj.css("color",Color.FontColor);
	    //滚动到中间
	    JQueryObj.scrollToCenter();
	    //告警
	    alert(falseDesc);
	}
	catch(e){
	    return;
	}
};

/*---------------
--CheckAlertSuccess--
textbox对象校验通过时针对CheckAlert的告警方式恢复对象状态，可用于LimitInputFun和FieldCheckFun中作为successFun调用
--------------- */
function CheckAlertSuccess(JQueryObj,showName){
	try{
	    //恢复原颜色
	    var tempattr = JQueryObj.attr("CheckAlertOrgBgColor");
	    if(tempattr === undefined || tempattr == null){
	        //没有告警
	        return;
	    }
	    else{
	        JQueryObj.css("background-color",JQueryObj.attr("CheckAlertOrgBgColor"));
	        JQueryObj.css("color",JQueryObj.attr("CheckAlertOrgFontColor"));
	        //删除属性
	        JQueryObj.removeAttr("CheckAlertOrgBgColor");
	        JQueryObj.removeAttr("CheckAlertOrgFontColor");
	    }
	}
	catch(e){
	    return;
	}
};

$.extend({
    /*
    --AddLimitInputStr--
    通过String的方式添加录入限制，让校验内容更集中和清晰
    */
　　AddLimitInputStr:function (limitString){
　　    var ObjectList = limitString.split("\n");
　　    for(var i = 0;i<ObjectList.length;i++){
　　        //循环处理每个对象
　　        var ParaList = ObjectList[i].split("^");
　　        //解析对象公共属性
　　        var ObjAttr = ParaList[0].split(",");
　　        //逐项添加校验$("").AddLimitInput(limitID,showName,limitPara,alertFun,[successFun],[order]);
　　        for(var j = 1;j<ParaList.length;j++){
　　            var js = "$('#"+ObjAttr[0]+"').AddLimitInput('"+j+"','"+ObjAttr[1]+"','"+ParaList[j]+"',"+ObjAttr[2]+","+ObjAttr[3]+");";
　　            eval(js);
　　        }
　　    }
　　},
　　
　　 /*
    --AddCheckParaStr--
    通过String的方式添加录入限制，让校验内容更集中和清晰
    */
　　AddCheckParaStr:function (checkID,checkString){
　　    var ObjectList = limitString.split("\n");
　　    for(var i = 0;i<ObjectList.length;i++){
　　        //循环处理每个对象
　　        var ParaList = ObjectList[i].split("^");
　　        //解析对象公共属性
　　        var ObjAttr = ParaList[0].split(",");
　　        //逐项添加校验$.AddCheckPara(checkID,checkObj,showName,checkPara,[order],[initFun], [alertFun], [successFun]);
　　        for(var j = 1;j<ParaList.length;j++){
　　            var js = "$.AddCheckPara('"+checkID+"',$('#"+ObjAttr[0]+"'),'"+ObjAttr[1]+"','"+ParaList[j]+"',"+j+","+ObjAttr[2]+","+ObjAttr[3]+","+ObjAttr[4]+");";
　　            eval(js);
　　        }
　　    }
　　}
});