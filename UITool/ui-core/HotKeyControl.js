/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：HotKeyControl
说明：快捷键控件
文件：HotKeyControl.js
依赖文件：jquery-1.6.4.min.js
-----------------------*/

/*-----------------------
==HotKeyControl==
说明：快捷键控件
-----------------------*/
/*
--HotKeyControl_GetCode--
    keyCode HotKeyControl_GetCode(KeyString);
    内部函数，根据按键获得键值
    KeyString : 按键的描述，不区分大小写
    
    按键定义表(IE)
      A-Z       65-90
      0-9       48-57
      F1-F12    112-123
      
      SHIFT     16 
      CTRL      17  
      ALT       18 
      
      LEFT      37 
      TOP       38 
      RIGHT     39 
      DOWN      40
      
      BACKSPACE 8
      TAB       9
      ENTER     13
      CAPSLOCK  20
      ESC       27
      SPACE     32
      PAGEUP    33
      PAGEDOWN  34
      END       35
      HOME      36
      INSERT    45
      DELETE    46
      WIN       91
      MENU      93
      
      -         189
      =         187
      [         219
      ]         221
      \         220
      ;         186
      '         222
      ,         188
      .         190
      /         191
      `         192
      
      小键盘
      NUMLOCK   144
      N0-N9     96-105(小键盘)
      N*        106
      N+        107
      N-        109
      N.        110
      N/        111
*/
function HotKeyControl_GetCode(KeyString){
    var key = KeyString.toUpperCase();
    var uCode = key.charCodeAt(0);
    if(KeyString.length == 1 && ((uCode >= 65 && uCode <= 90) || (uCode >= 48 && uCode <= 57))){
        return uCode;
    }
    else{
         switch(key){
            case "F1": return 112;
            case "F2": return 113;
            case "F3": return 114;
            case "F4": return 115;
            case "F5": return 116;
            case "F6": return 117;
            case "F7": return 118;
            case "F8": return 119;
            case "F9": return 120;
            case "F10": return 121;
            case "F11": return 122;
            case "F12": return 123;
            case "SHIFT": return 16;
            case "CTRL": return 17;
            case "ALT": return 18;
            case "LEFT": return 37;
            case "TOP": return 38;
            case "RIGHT": return 39;
            case "DOWN": return 40;
            case "BACKSPACE": return 8;
            case "TAB": return 9;
            case "ENTER": return 13;
            case "CAPSLOCK": return 20;
            case "ESC": return 27;
            case "SPACE": return 32;
            case "PAGEUP": return 33;
            case "PAGEDOWN": return 34;
            case "END": return 35;
            case "HOME": return 36;
            case "INSERT": return 45;
            case "DELETE": return 46;
            case "WIN": return 91;
            case "MENU": return 93;
            case "-": return 189;
            case "=": return 187;
            case "[": return 219;
            case "]": return 221;
            case "\\": return 220;
            case ";": return 186;
            case "'": return 222;
            case ",": return 188;
            case ".": return 190;
            case "/": return 191;
            case "`": return 192;
            case "NUMLOCK": return 144;
            case "N0": return 96;
            case "N1": return 97;
            case "N2": return 98;
            case "N3": return 99;
            case "N4": return 100;
            case "N5": return 101;
            case "N6": return 102;
            case "N7": return 103;
            case "N8": return 104;
            case "N9": return 105;
            case "N*": return 106;
            case "N+": return 107;
            case "N-": return 109;
            case "N.": return 110;
            case "N/": return 111;
            default : return 0;
         }
    }
};

/*
--HotKeyControl_ExeFun--
HotKeyControl_ExeFun()
内部函数,热键keyup事件的执行函数
*/
function HotKeyControl_ExeFun(){
    //获得keyup的事件按键
    var KeyNum;
    if($.browser.msie){
        //IE
        KeyNum = event.keyCode;
    }
    else{
        //其他
        KeyNum = event.which;
    }
    
    //获取发起事件的对象
    var TargetObj = $(this);
    
    //执行快捷键判断操作
    var HotKeyPara = TargetObj.data("hotkeypara");
    for(var i = 0;i<HotKeyPara.length;i++){
        if(HotKeyPara[i].KeyCodeList.CTRL == event.ctrlKey && HotKeyPara[i].KeyCodeList.ALT == event.altKey && HotKeyPara[i].KeyCodeList.SHIFT == event.shiftKey && HotKeyPara[i].KeyCodeList.LAST == KeyNum){
            //匹配上，执行函数
            var ret = true;
            try{
                ret = HotKeyPara[i].ExeFun(TargetObj,HotKeyPara[i].KeyDef,HotKeyPara[i].KeyBreak);
            }
            catch(e){
                ret = true;
            }
            if(HotKeyPara[i].KeyBreak){
                return false;
            }
            else{
                return ret;
            }
        }  
    }
    //执行快捷键判断操作
};

jQuery.fn.extend({
 /*
  --BindHotKey--
  $("").BindHotKey(KeyDef,ExeFun,[KeyBreak])
        绑定事件处理
        KeyDef : 快捷键定义,可以这样定义"控制键+控制键+一般按键",控制键包括CTRL、ALT、SHIFT
                 例如：CTRL+ALT+H                        
        ExeFun : 要执行的函数,如果要阻止冒泡，函数中需return false
        [KeyBreak] : 匹配到按键后，是否停止消息冒泡，默认为false
 */
 BindHotKey : function(KeyDef,ExeFun) {
    if(this.length == 0){
        return;
    }
    //获得参数处理
    var KeyBreak = false;
    for(var i = 2;i<arguments.length;i++)
    {
        if(arguments[i] == null || arguments[i] === undefined || (arguments[i].length != undefined && arguments[i].length == 0)) { 
            continue;  //没有传具体值进来
        }
        
        switch(i)
        {
            case 2:
                KeyBreak = arguments[i];
                break;
            default :
                break;
        }
    }
    
    //获得控制键列表
    var KeyList = KeyDef.toUpperCase().split("+");
    var KeyCodeList = new Object();
    KeyCodeList.CTRL = false;
    KeyCodeList.ALT = false;
    KeyCodeList.SHIFT = false;
    KeyCodeList.LAST = HotKeyControl_GetCode(KeyList[KeyList.length-1]);
    for(var i = 0;i<KeyList.length;i++){
        switch(KeyList[i]){
            case "CTRL":
                KeyCodeList.CTRL = true;
                break;
            case "ALT":
                KeyCodeList.ALT = true;
                break;
            case "SHIFT":
                KeyCodeList.SHIFT = true;
                break;
            default :
                break;
        }
    }
        
    //开始对对象进行处理
    for(var i=0;i<this.length;i++){
        var obj = $(this.get(i));
        var HotKeyPara;
        if(obj.attr("bindhotkey") == "true"){
            //曾经绑定过热键
            HotKeyPara = obj.data("hotkeypara");
            //判断是否已经定义过该热键
            for(var j = 0;j<HotKeyPara.length;j++){
                if(HotKeyPara[j].KeyDef == KeyDef.toUpperCase()){
                    //已经定义过，要删除这个热键
                    HotKeyPara.splice(j,1);
                    break;
                }
            }
        }
        else{
            //未曾绑定过热键
            HotKeyPara = new Array(0);
            obj.data("hotkeypara",HotKeyPara);
            //再补充上其他参数
            obj.attr("bindhotkey","true");
            obj.bind("keyup",HotKeyControl_ExeFun);
        }
        //加入绑定参数
        var NewPara = new Object();
        NewPara.KeyDef = KeyDef.toUpperCase();
        NewPara.ExeFun = ExeFun;
        NewPara.KeyCodeList = KeyCodeList;
        NewPara.KeyBreak = KeyBreak;
        HotKeyPara.push(NewPara);
        //更新对象的参数
        obj.removeData("hotkeypara");
        obj.data("hotkeypara",HotKeyPara);
    }
 },
 
 /*
  --UnbindHotKey--
  $("").UnbindHotKey([KeyDef])
        解除热键绑定，如果[KeyDef]没有传值，则代表解除所有的热键绑定
        [KeyDef] : 快捷键定义,可以这样定义"控制键+控制键+一般按键",控制键包括CTRL、ALT、SHIFT
                 例如：CTRL+ALT+H                        
 */
 UnbindHotKey : function() {
    var KeyDef = "";
    if(arguments.length > 0){
        KeyDef = arguments[0].toUpperCase();
    }
    
    //对每个对象进行处理
    for(var i=0;i<this.length;i++){
        var obj = $(this.get(i));
        var HotKeyPara;
        if(obj.attr("bindhotkey") == "true"){
            //有绑定热键
            if(KeyDef == ""){
                //解除所有绑定
                obj.unbind("keyup",HotKeyControl_ExeFun);
                obj.removeData("hotkeypara");
                obj.removeAttr("bindhotkey");
            }
            else{
                //找到定义的热键才解除
                HotKeyPara = obj.data("hotkeypara");
                for(var j = 0;j<HotKeyPara.length;j++){
                    if(HotKeyPara[j].KeyDef == KeyDef){
                        //移除热键
                        HotKeyPara.splice(j,1);
                        obj.removeData("hotkeypara");
                        obj.data("hotkeypara",HotKeyPara);
                        break;
                    }
                }
            }
        }
        else{
            //没有绑定
            continue;
        }
    }
 }
});
