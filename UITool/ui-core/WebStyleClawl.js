/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：WebStyleClawl
说明：抓取嵌入网页中指定对象的样式信息，可用于分析网页的布局和样式
文件：WebStyleClawl.js
依赖文件：jquery-1.6.4.min.js
-----------------------*/

;(function($) {
    /*---------------
    --JQuery_UITool_WebStyleClawl--
    内部变量，记录当前要抓取的对象，null代表不抓取对象
    --------------- */
    var JQuery_UITool_WebStyleClawl = null;
    
    //快捷键的默认值
    $.WebStyleClawl = new Object();
    $.WebStyleClawl.defaults = {
        //打开设置获取抓取对象窗口的快捷键
        SetWinHotKey : "CTRL+ALT+S",
        
        //打开显示抓取结果窗口的快捷键
        ShowWinHotKey : "CTRL+ALT+R",
        
        //抓取的快捷键
        ClawlHotKey : "CTRL+ALT+G"
    };
    
    //装置WebStyleClawl
    $.WebStyleClawlInit = function(){
        if($("#WebStyleClawl_SetWin").length > 0){
            //已装载过
            return;
        }
        
        //创建窗口对象
        var SetWinHtml = "<div id='WebStyleClawl_SetWin' style='padding: 5px; border: 2px solid #3399FF; background-color: #FFFFFF; position: fixed; left:10px; top:10px; z-index: 9999; width: 300px; height: 150px; overflow: hidden; color: #3399FF; display:none;'> \
            <table width='100%' border='0'>  \
                <tr>  \
                    <td colspan='2' style='padding:10px; font-size:20px;' align='center'>设置要抓取的对象(置空为取消)</td> \
                </tr>  \
                <tr>  \
                    <td width='80px' align='right'>JQuery串</td>  \
                    <td><input type='text' id='WebStyleClawl_SetWin_Text' style='width:90%;' /></td>  \
                </tr>  \
                <tr>  \
                    <td width='80px' align='right'>&nbsp;</td>  \
                    <td><input type='checkbox' id='WebStyleClawl_SetWin_WithChildren' />包含子节点</td>  \
                </tr>  \
                 <tr>  \
                    <td colspan='2' style='padding:20px; font-size:20px;' align='center'>  \
                        <input type='button' id='WebStyleClawl_SetWin_Set' value='设置' /> &nbsp;&nbsp; \
                        <input type='button' id='WebStyleClawl_SetWin_Close' value='关闭' />  \
                    </td>  \
                </tr> \
            </table> \
        </div> ";
        
        $(document.body).append(SetWinHtml);
        $("#WebStyleClawl_SetWin_Set").bind("click",
            function(){
                var SearchText = $("#WebStyleClawl_SetWin_Text").get(0).value;
                if($.WebStyleClawlSetObj(SearchText)){
                    //成功，关闭窗口
                    $.WebStyleClawlShowWin("SetWin",false);
                    alert("设置成功");
                }
                else{
                    //设置失败
                    alert("设置失败！找不到对象或查出的对象超过1个！");
                }
            }
        );
        
        $("#WebStyleClawl_SetWin_Close").bind("click",
            function(){
                $.WebStyleClawlShowWin("SetWin",false);
            }
        );
        
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
                        <input type='button' id='WebStyleClawl_ShowWin_Close' value='关闭' /> \
                    </td> \
                </tr> \
            </table> \
        </div> ";
        
        $(document.body).append(ShowWinHtml);
        $("#WebStyleClawl_ShowWin_Close").bind("click",
            function(){
                $.WebStyleClawlShowWin("ShowWin",false);
            }
        );
        
        //设置快捷键
        $(document).BindHotKey($.WebStyleClawl.defaults.SetWinHotKey,function(){$.WebStyleClawlShowWin("SetWin",true);});
        $(document).BindHotKey($.WebStyleClawl.defaults.ShowWinHotKey,function(){$.WebStyleClawlShowWin("ShowWin",true);});
        $(document).BindHotKey($.WebStyleClawl.defaults.ClawlHotKey,function(){$.WebStyleClawlClawing();});
    };
    
    //用于设置要抓取的对象
    $.WebStyleClawlSetObj = function(JQueryStr){
        if(JQueryStr == ""){
            //设置为不抓取
            JQuery_UITool_WebStyleClawl = null;
            return true;
        }
        
        //获得对象
        var SetObj = null;
        if(JQueryStr.jquery !== undefined){
            SetObj = JQueryStr;
        }
        else{
            SetObj = $(JQueryStr);
        }
        
        if(SetObj.length != 1){
            return false;
        }
        
        //设置抓取对象
        JQuery_UITool_WebStyleClawl = SetObj;
        return true;
    };
    
    //执行抓取操作
    $.WebStyleClawlClawing = function(){
        if(JQuery_UITool_WebStyleClawl == null){
            return;
        }
        
        //执行抓取动作
        var result = GetObjStyleString(JQuery_UITool_WebStyleClawl,$("#WebStyleClawl_SetWin_WithChildren").get(0).checked);
        
        //将抓取结果放入展示窗口
        $("#WebStyleClawl_ShowWin_Text").get(0).value = result;
        
        alert("抓取成功！");
    };
    
    
    //显示/隐藏指定的窗口
    $.WebStyleClawlShowWin = function(WinName,isShow){
        var WinObj = null;
        switch(WinName){
            case "SetWin" :
                WinObj = $("#WebStyleClawl_SetWin");
                break;
            case "ShowWin" :
                WinObj = $("#WebStyleClawl_ShowWin");
                break;
            default :
                return;
        }
        
        //执行显示/隐藏
        if(isShow){
            WinObj.show();
        }
        else{
            WinObj.hide();
        }
    };
    
    //以下为私有函数
    //获得指定对象的ClassName清单
    function GetClassList(obj){
        //通过正则表达式分割
        var classStr = obj.attr("class");
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
        result += obj.get(0).outerHTML + "\r\n\r\n";
        
        result += "CSS样式表(class)：\r\n";
        var classList = GetClassList(obj);
        for(var i = 0;i<classList.length;i++){
            result += classList[i] + "\r\n";
            result += GetClassStyle("."+classList[i]);
        }
        
        //子节点
        if(WithChildren){
            var child = obj.children();
            for(var i = 0;i<child.length;i++){
                result += "\r\n\r\n" + GetObjStyleString($(child.get(i)),true);
            }
        }
        
        return result;
    };

})(jQuery);