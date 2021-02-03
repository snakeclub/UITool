﻿/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：PowerString
说明：对Windows的剪贴板进行设置或获取的处理
文件：PowerString.js
依赖文件：
-----------------------*/
/*-----------------------
==PowerString==
说明：增强的字符处理
-----------------------*/

/*---------------
--getUrlFileName--
从URL中获取文件名，带扩展
--------------- */
String.prototype.getUrlFileName=function()
{
    var url = this;
    var pos = url.lastIndexOf("/");
    if(pos == -1)
        pos = url.lastIndexOf("\\")
    if(pos == -1)
        return this;
        
    var filename = url.substr(pos +1)
    return filename;
};

/*---------------
--left--
获得字符串开头指定长度的子字符串
--------------- */
String.prototype.left=function(len)
{
    return this.substring(0,len);
};

/*---------------
--right--
获得字符串右边指定长度的子字符串
--------------- */
String.prototype.right=function(len)
{
    return this.substring(this.length - len);
};

/*---------------
--mid--
获得字符串中间指定长度的子字符串
--------------- */
String.prototype.mid=function(start,len)
{
    return this.substring(start,start + len);
};

/*---------------
--leftB--
获得字符串开头指定长度的子字符串，以字节为单位
--------------- */
String.prototype.leftB=function(len)
{
    var w = 0;
    var ret = "";
    for(var i = 0;i<this.length;i++)
    {
        if(w >= len){
            return ret;
        }
        var c = this.charCodeAt(i);
        var ch = this.charAt(i);
        //单字节加1
        if((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f))
        {
            w++;
            ret += ch;
        }
        else
        {
            w+=2;
            if(w > len){
                return ret;
            }
            ret += ch;
        }
    }
    return ret;
};

/*---------------
--rightB--
获得字符串右边指定长度的子字符串，以字节为单位
--------------- */
String.prototype.rightB=function(len)
{
    var w = 0;
    var ret = "";
    for(var i = this.length - 1;i >= 0;i--)
    {
        if(w >= len){
            return ret;
        }
        var c = this.charCodeAt(i);
        var ch = this.charAt(i);
        //单字节加1
        if((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f))
        {
            w++;
            ret = ch + ret;
        }
        else
        {
            w+=2;
            if(w > len){
                return ret;
            }
            ret = ch + ret;
        }
    }
    return ret;
};

/*---------------
--midB--
获得字符串中间指定长度的子字符串，以字节为单位
--------------- */
String.prototype.midB=function(start,len)
{
    var w = 0;
    var ret = "";
    for(var i = 0;i<this.length;i++)
    {
        var c = this.charCodeAt(i);
        var ch = this.charAt(i);
        //单字节加1
        if((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f))
        {
            if(w>=start && w<start+len){
                 ret += ch;
            }
            w++;
        }
        else
        {
            if(w>=start && w + 1 <start+len){
                 ret += ch;
            }
            w+=2;
        }
        if(w>=start+len){
            return ret;
        }
    }
    return ret;
};

/*---------------
--getRealLength--
获得字符串的真实长度
--------------- */
String.prototype.getRealLength=function()
{
    var w = 0;
    for(var i = 0;i<this.length;i++)
    {
        var c = this.charCodeAt(i);
        //单字节加1
        if((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f))
        {
            w++;
        }
        else
        {
            w+=2;
        }
    }
    return w;
};

/*---------------
--trim--
清除对象头尾相同的字符(串)
--------------- */
String.prototype.trim=function(str)
{
    if(typeof str == 'undefined'){
        str = "\\s";
    }
    
    str = str.replace(/[\$\(\)\*\+\.\[\]\?\/\^\{\}\|]/g,'\\$&'); //转义字符
    var ret;
    var js = "ret = this.replace(/^("+str+"){1,}|("+str+"){1,}$/g,'');";
    eval(js);
    return ret;
};

/*---------------
--lTrim--
清除对象开头相同的字符(串)
--------------- */
String.prototype.lTrim=function(str)
{
    if(typeof str == 'undefined'){
        str = "\\s";
    }
    str = str.replace(/[\$\(\)\*\+\.\[\]\?\/\^\{\}\|]/g,'\\$&'); //转义字符
    var ret;
    var js = "ret = this.replace(/^("+str+"){1,}/g,'');";
    eval(js);
    return ret;
};

/*---------------
--rTrim--
清除对象结尾相同的字符(串)
--------------- */
String.prototype.rTrim=function(str)
{
    if(typeof str == 'undefined'){
        str = "\\s";
    }
    str = str.replace(/[\$\(\)\*\+\.\[\]\?\/\^\{\}\|]/g,'\\$&'); //转义字符
    var ret;
    var js = "ret = this.replace(/("+str+"){1,}$/g,'');";
    eval(js);
    return ret;
};

/*---------------
--startWith--
是否以指定的字符串开头
--------------- */
String.prototype.startWith=function(str)
{
    return this.indexOf(str) === 0;
};

/*---------------
--endWith--
是否以指定的字符串结尾
--------------- */
String.prototype.endWith=function(str)
{
    var d = this.length - str.length;
    return d >= 0 && this.lastIndexOf(str) === d;
};

/*---------------
--include--
是否包含字符串
--------------- */
String.prototype.include=function(str)
{
    return this.indexOf(str) > -1;
};

/*---------------
--isNullOrEmpty--
是否空或无值
--------------- */
String.prototype.isNullOrEmpty=function()
{
    return this == undefined || this == null || this.trim() == '';
};

/*---------------
--toHtmlEncode--
转换为html编码
--------------- */
String.prototype.toHtmlEncode=function()
{
    var str = this;
    str=str.replace(/&/g,"&amp;");
    str=str.replace(/</g,"&lt;");
    str=str.replace(/>/g,"&gt;");
    str=str.replace(/\'/g,"&apos;");
    str=str.replace(/\"/g,"&quot;");
    str=str.replace(/\n/g,"<br>");
    str=str.replace(/ /g,"&nbsp;");
    str=str.replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;");
    return str;
};

/*---------------
--existChinese--
是否存在汉字
--------------- */
String.prototype.existChinese = function()
{
        //[/u4E00-/u9FA5]為漢字﹐[/uFE30-/uFFA0]為全角符號
        return !(/^[\x00-\xff]*$/.test(this));
}
