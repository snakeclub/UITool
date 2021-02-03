/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：Clipboard
说明：对Windows的剪贴板进行设置或获取的处理
文件：Clipboard.js
依赖文件：
-----------------------*/
/*-----------------------
==Clipboard==
说明：剪贴板的处理
-----------------------*/
;(function($) {
/*---------------
--getClipboardText--
获得剪贴板中的文本内容
--------------- */
$.getClipboardText = function(){
    if(window.clipboardData){
        return window.clipboardData.getData("Text");
    }
    else{
        return null;
    }
};

/*---------------
--setClipboardText--
设置剪贴板中的文本内容
--------------- */
$.setClipboardText = function(text){
    if(window.clipboardData){
        return window.clipboardData.setData("Text",text);
    }
    else{
        return false;
    }
};

/*---------------
--clearClipboard--
清空剪贴板中的内容
--------------- */
$.clearClipboard = function(){
    if(window.clipboardData){
        window.clipboardData.clearData();
    }
    else{
        return;
    }
};

})(jQuery);