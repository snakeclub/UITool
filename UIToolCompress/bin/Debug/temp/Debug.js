//ProtectVar:Test,Test1
/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：Debug
说明：提供简单的调试调用，辅助功能
文件：Debug.js
依赖文件：jquery-1.4.2.min.js
-----------------------*/

;(function($) {
    /*---------------
    --JQuery_UITool_Debug--
    启动调试的变量，默认为false，若需要进行调试，在调试前的代码将其修改为true
    --------------- */
    var JQuery_UITool_Debug = false;
    
    $.setDebug = function(debugStat){
        JQuery_UITool_Debug = debugStat;
        //测试
        var Test;var xxxOOO='ProtectVar$(Test)';
        eval("Test = '1234';");
        var Test1 = 100;var xxxOOO='ProtectVar$(Test1)';
        Test1 = 300;
    };

    /*---------------
    --debugOutput--
    在界面中输出调试信息
    $.debugOutput(info1,[info2],[info3],...)
    --------------- */
    $.debugOutput = function(info){
        if(JQuery_UITool_Debug){
            var debughandle = $("#JQuery_UITool_DebugSpan");
            if(debughandle.length == 0){
                //创建
                $(document.body).append("<span id='JQuery_UITool_DebugSpan'></span>");
                debughandle = $("#JQuery_UITool_DebugSpan");
            }
            //显示信息
            var debuginfo = "<p />调试&nbsp;("+Date().toString()+"):";
            for(var i = 0;i<arguments.length;i++){
                var temps;
                if(arguments[i] === undefined){
                    temps = "undefined";
                }
                else if(arguments[i] == null){
                    temps = "null";
                }
                else{
                    temps = arguments[i].toString();
                }
                debuginfo += "<br />&nbsp;&nbsp;&nbsp;&nbsp;INFO" + i.toString() + "&nbsp;:&nbsp;" + temps.replace("&","&amp;").replace(" ","&nbsp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace("\"","&quot;");
            }
            //添加到显示中
            debughandle.append(debuginfo);
        }
    };

    /*---------------
    --debugClear--
    删除界面中的调试信息
    $.debugClear()
    --------------- */
     $.debugClear = function(){
        var debughandle = $("#JQuery_UITool_DebugSpan");
        if(debughandle.length > 0){
            debughandle.get(0).innerHTML = "";
        }
    };

})(jQuery);