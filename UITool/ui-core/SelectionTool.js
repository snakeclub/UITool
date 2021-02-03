/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：SelectionTool
说明：文本选择处理控件，暂时只研究了IE的处理支持
文件：SelectionTool.js
依赖文件：jquery-1.6.4.min.js
-----------------------*/

/*-----------------------
==SelectionTool==
说明：文本选择处理控件，暂时只研究了IE的处理支持
-----------------------*/
$.extend({
    /*
    --GetSelectionText--
    获得页面中选中的文本
    */
　　GetSelectionText:function (){
　　    try{
　　        if(document.selection){
　　            //IE
　　            return document.selection.createRange().text;
　　        }
　　        else{
　　            //FF
　　            return window.getSelection();
　　        }
　　    }
　　    catch(err){
　　        return "";
　　    }
　　},
　　
　　/*
    --GetSelectionInfo--
    获得选中文本的相关信息
    */
　　GetSelectionInfo:function (){
　　    var result = new Object();
　　    result.obj = null;
　　    result.text = "";
　　    result.startPos = -1;
　　    try{
　　        if(document.selection){
　　            //IE
　　            var currentRange = document.selection.createRange();
　　            result.obj = $(currentRange.parentElement());
　　            result.text = currentRange.text;
　　            //通过比较获取开始位置
　　            var workRange = currentRange.duplicate();  //获得当前选区的备份
                result.obj.select();  //将对象的所有内容选中
                var allRange = document.selection.createRange(); //获得对象所有选区
                //对原选区的开始位置逐个往前移，来算开始位子
                result.startPos = 0;
                while(workRange.compareEndPoints("StartToStart",allRange) > 0)
                {
                    workRange.moveStart("character",-1);
                    result.startPos++;
                }
                //重新选回原来的内容
                currentRange.select();
　　        }
　　        else{
　　            //FF
　　            result.text = window.getSelection();
　　        }
　　    }
　　    catch(err){
　　        ;
　　    }
　　    
　　    return result;
　　}

});

jQuery.fn.extend({
  /*
  --GetObjSelectionInfo--
  获得某对象选中文本的相关信息(指定对象的第一个)
  */
  GetObjSelectionInfo: function() {
      var result = new Object();
      result.text = "";
      result.startPos = 0;
      if(this.length == 0){
        //没有找到对象
        return result;
      }
      
      var obj = $(this.get(0));
      try{
        if(document.selection){
            //IE
            var currentRange = document.selection.createRange();
            if(obj.get(0) != currentRange.parentElement()){
                //选中的对象不是当前对象
                return result;
            }
            result.text = currentRange.text;
            //通过比较获取开始位置
            var workRange = currentRange.duplicate();  //获得当前选区的备份
            obj.select();  //将对象的所有内容选中
            var allRange = document.selection.createRange(); //获得对象所有选区
            //对原选区的开始位置逐个往前移，来算开始位子
            result.startPos = 0;
            while(workRange.compareEndPoints("StartToStart",allRange) > 0)
            {
                workRange.moveStart("character",-1);
                result.startPos++;
            }
            //重新选回原来的内容
            currentRange.select();
        }
        else{
            //FF
            result.text = window.getSelection();
        }
    }
    catch(err){
        ;
    }
    
    return result;
  },
  
  /*
  --SetObjSelection--
  设置对象（第一个对象）的选中，如果选中的长度为0，则为设置光标位置
  */
  SetObjSelection : function(startPos,len) {
      if(this.length == 0){
        //没有找到对象
        return result;
      }
      var obj = this.get(0);
      try{
        if(document.selection){
            //IE
            var range=obj.createTextRange();
            range.collapse(true);
            range.moveStart('character',startPos);
            if(len!=0){
                range.moveEnd('character',len);
            }
            range.select();
        }
        else{
            //FF
            obj.selectionStart=startPos;
            var sel_end=len==0?startPos:startPos+len;
            obj.selectionEnd=Math.min(sel_end,obj.value.length);
            obj.focus();
        }
    }
    catch(err){
        return;
    }
  }
  
});
