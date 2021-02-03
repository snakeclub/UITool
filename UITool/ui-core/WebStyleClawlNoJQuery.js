/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：WebStyleClawlNoJQuery
说明：抓取嵌入网页中指定对象的样式信息，可用于分析网页的布局和样式。这个版本是不用JQuery框架的版本，用于兼容在其他框架中截取信息。
文件：WebStyleClawlNoJQuery.js
依赖文件：
-----------------------*/

/*---------------
--JQuery_UITool_WebStyleClawl--
记录当前要抓取的对象(dom)，null代表不抓取对象
--------------- */
var JQuery_UITool_WebStyleClawl = null;

var JQuery_UITool_WebStyleClawl_SetWinHotKey = null;

var JQuery_UITool_WebStyleClawl_ShowWinHotKey = null;

var JQuery_UITool_WebStyleClawl_ClawlHotKey = null;

function WebStyleClawlInit(SetWinHotKey,ShowWinHotKey,ClawlHotKey){
    if(GetDomByID("WebStyleClawl_SetWin") === undefined){
        //已装载过
         return;
    };
    
    var newspan = document.createElement("span");
    
    //创建窗口对象
    var SetWinHtml = "<div id='WebStyleClawl_SetWin' style='padding: 5px; border: 2px solid #3399FF; background-color: #FFFFFF; position: fixed; left:10px; top:10px; z-index: 9999; width: 300px; height: 150px; overflow: hidden; color: #3399FF; display:none;'> \
        <table width='100%' border='0'>  \
            <tr>  \
                <td colspan='2' style='padding:10px; font-size:20px;' align='center'>设置抓取对象ID(置空为取消)</td> \
            </tr>  \
            <tr>  \
                <td width='80px' align='right'>ID</td>  \
                <td><input type='text' id='WebStyleClawl_SetWin_Text' style='width:90%;' onclick='WebStyleClawlSetObjByID' /></td>  \
            </tr>  \
            <tr>  \
                <td width='80px' align='right'>&nbsp;</td>  \
                <td><input type='checkbox' id='WebStyleClawl_SetWin_WithChildren' />包含子节点</td>  \
            </tr>  \
             <tr>  \
                <td colspan='2' style='padding:20px; font-size:20px;' align='center'>  \
                    <input type='button' id='WebStyleClawl_SetWin_Set' value='设置' onclick='WebStyleClawlSetObjByID();' /> &nbsp;&nbsp; \
                    <input type='button' id='WebStyleClawl_SetWin_Close' value='关闭' onclick='WebStyleClawlShowWin(\"SetWin\",false);' />  \
                </td>  \
            </tr> \
        </table> \
    </div> ";
    
    newspan.innerHTML += SetWinHtml;
    
    var ShowWinHtml = "<div id='WebStyleClawl_ShowWin' style='padding: 5px; border: 2px solid #3399FF; background-color: #FFFFFF; position: fixed; left:10px; top:10px; z-index: 9999; width: 400px; height: 300px; overflow: hidden; color: #3399FF; display:none;'> \
        <table width='100%' border='0'> \
            <tr> \
                <td style='padding:10px; font-size:20px;' align='center'>抓取到的信息</td> \
            </tr> \
            <tr> \
                <td><textarea id='WebStyleClawl_ShowWin_Text' cols='20'  \
                        name='S1' rows='2' style='width:100%; height:200px;'></textarea></td> \
            </tr> \
             <tr> \
                <td  style='padding:15px; font-size:20px;' align='center'> \
                    <input type='button' id='WebStyleClawl_ShowWin_Close' value='关闭' onclick='WebStyleClawlShowWin(\"ShowWin\",false);' /> \
                </td> \
            </tr> \
        </table> \
    </div> ";
    
    newspan.innerHTML += ShowWinHtml;
    document.body.appendChild(newspan);
    
    
    
    //装载热键
    
    if(SetWinHotKey === undefined || SetWinHotKey == null){
        SetWinHotKey = "CTRL+ALT+S";
    }
    if(ShowWinHotKey === undefined || ShowWinHotKey == null){
        ShowWinHotKey = "CTRL+ALT+R";
    }
    if(ClawlHotKey === undefined || ClawlHotKey == null){
        ClawlHotKey = "CTRL+ALT+G";
    }
    
    JQuery_UITool_WebStyleClawl_SetWinHotKey = GetKeyCodeList(SetWinHotKey);
    JQuery_UITool_WebStyleClawl_ShowWinHotKey =GetKeyCodeList(ShowWinHotKey);
    JQuery_UITool_WebStyleClawl_ClawlHotKey = GetKeyCodeList(ClawlHotKey);
    
    if (document.addEventListener)
        document.addEventListener("keyup",WebStyleClawlOnKeyUp,true);
    else
        document.attachEvent("onkeyup",WebStyleClawlOnKeyUp);

};

//设置要抓取的对象ID
function WebStyleClawlSetObjByID(){
    var SearchText = GetDomByID("WebStyleClawl_SetWin_Text").value;
    if(WebStyleClawlSetObj(SearchText)){
        //成功，关闭窗口
        WebStyleClawlShowWin("SetWin",false);
        alert("设置成功");
    }
    else{
        //设置失败
        alert("设置失败！找不到对象或查出的对象超过1个！");
    }
};

//设置抓取对象
function WebStyleClawlSetObj(IDorObj){
    if(IDorObj == ""){
        //设置为不抓取
        JQuery_UITool_WebStyleClawl = null;
        return true;
    }
    
    //获得对象
    var SetObj = null;
    if(typeof(IDorObj) == "string"){
        SetObj = GetDomByID(IDorObj);
    }
    else{
        SetObj = IDorObj;
    }
    
    if(SetObj === undefined || SetObj == null){
        return false;
    }
    
    //设置抓取对象
    JQuery_UITool_WebStyleClawl = SetObj;
    return true;
};

//显示隐藏窗体
function WebStyleClawlShowWin(WinName,isShow){
    var WinObj = null;
    switch(WinName){
        case "SetWin" :
            WinObj = GetDomByID("WebStyleClawl_SetWin");
            break;
        case "ShowWin" :
            WinObj = GetDomByID("WebStyleClawl_ShowWin");
            break;
        default :
            return;
    }
    
    //执行显示/隐藏
    if(isShow){
        WinObj.style.display = "block";
    }
    else{
        WinObj.style.display = "none";
    }
};

//执行抓取操作
function WebStyleClawlClawing(){
    if(JQuery_UITool_WebStyleClawl == null){
        return;
    }
    
    //执行抓取动作
    var result = GetObjStyleString(JQuery_UITool_WebStyleClawl,GetDomByID("WebStyleClawl_SetWin_WithChildren").checked);
    
    //将抓取结果放入展示窗口
    GetDomByID("WebStyleClawl_ShowWin_Text").value = result;
    
    alert("抓取成功！");
};


//内部函数
//用于简化通过ID获取对象的方法
function GetDomByID(x) {
  if (typeof x == "string") return document.getElementById(x);
  return x;
};

//根据快捷键定义获得快捷键对象
function GetKeyCodeList(KeyDef){
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
    return KeyCodeList;
};

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


//KeyUp的执行函数
function WebStyleClawlOnKeyUp(event){
    //获得keyup的事件按键
    var KeyNum;
    if(!+[1,]){
        //IE
        KeyNum = event.keyCode;
    }
    else{
        //其他
        KeyNum = event.which;
    }
    
    if(JQuery_UITool_WebStyleClawl_SetWinHotKey.CTRL == event.ctrlKey && JQuery_UITool_WebStyleClawl_SetWinHotKey.ALT == event.altKey && JQuery_UITool_WebStyleClawl_SetWinHotKey.SHIFT == event.shiftKey && JQuery_UITool_WebStyleClawl_SetWinHotKey.LAST == KeyNum){
        //匹配上，执行函数
        WebStyleClawlShowWin("SetWin",true);
    }
    
    if(JQuery_UITool_WebStyleClawl_ShowWinHotKey.CTRL == event.ctrlKey && JQuery_UITool_WebStyleClawl_ShowWinHotKey.ALT == event.altKey && JQuery_UITool_WebStyleClawl_ShowWinHotKey.SHIFT == event.shiftKey && JQuery_UITool_WebStyleClawl_ShowWinHotKey.LAST == KeyNum){
        //匹配上，执行函数
        WebStyleClawlShowWin("ShowWin",true);
    }
    
    if(JQuery_UITool_WebStyleClawl_ClawlHotKey.CTRL == event.ctrlKey && JQuery_UITool_WebStyleClawl_ClawlHotKey.ALT == event.altKey && JQuery_UITool_WebStyleClawl_ClawlHotKey.SHIFT == event.shiftKey && JQuery_UITool_WebStyleClawl_ClawlHotKey.LAST == KeyNum){
        //匹配上，执行函数
        WebStyleClawlClawing();
    }
};




//获得指定对象的ClassName清单
function GetClassList(obj){
    //通过正则表达式分割
    var classStr = obj.className;
    return classStr.split(/\s+/);
};

//获得指定的ClassName的样式
function GetClassStyle(className){
    var rss;
    var style;
    var value = "";
    for(var i = 0;i<document.styleSheets.length;i++){
        var tar = document.styleSheets[i];
        rss = tar.cssRules?tar.cssRules:tar.rules;
        for(var j=0;j<rss.length;j++)
        {
            style = rss[j];
            if(style.selectorText == className)
            {
                //组合返回的值
                value += "所属文件："+document.styleSheets[i].href + "\r\n";
                
                value += "{\r\n";
                for(var stylename in style.style){
                    if(style.style[stylename] != ""){
                        value += "\t" + stylename + ":" + style.style[stylename] + ";\r\n";
                    }
                }
                
                value += "}\r\n";
            }
        }
    }
    
    return value;
};

//递归获得指定对象及其子节点的样式
function GetObjStyleString(obj,WithChildren){
    var result = "----------对象Html-----------：\r\n";
    result += obj.outerHTML + "\r\n\r\n";
    
    result += "CSS样式表(class)：\r\n";
    var classList = GetClassList(obj);
    for(var i = 0;i<classList.length;i++){
        result += classList[i] + "\r\n";
        result += GetClassStyle("."+classList[i]);
    }
    
    document.getElementById("")
    
    //子节点
    if(WithChildren){
        var child = obj.childNodes;
        for(var i = 0;i<child.length;i++){
            if(child[i].nodeType == 1){
                result += "\r\n\r\n" + GetObjStyleString(child[i],true);
            }
        }
    }
    
    return result;
};
