/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：AjaxTool
说明：Ajax工具
文件：AjaxTool.js
依赖文件：jquery-1.4.2.min.js
          json2.js
-----------------------*/

/*-----------------------
==AjaxTool=
Ajax工具
-----------------------*/
;(function($) {
    /*
    AjaxTool的默认调用参数
    */
    $.AjaxTool = new Object();
    $.AjaxTool.defaults = {
        //加密函数，默认为null，加密函数需返回加密的字符串，依次传入2个参数，加密串、密钥
        Encode : null,
        
        //加密算法名称,
        EncodeName : "",
        
        //加密密钥，默认为""
        Encodekey : "",
        
        //加密的其他参数(有些加密算法会附带)
        EncodePara : "",
        
        //是否同时发送密钥到服务器，默认为false
        SendKey : false,
        
        //ajax发送前执行的函数,null代表不执行，函数传入一个参数：XMLHttpRequest 对象
        beforeSend : null,
        
        //ajax发送成功后执行的函数，null代表不执行，传入两个参数：data-服务器返回的数据, textStatus-执行状态
        success : null,
        
        //ajax发送失败后执行的函数，null代表不执行，传入三个参数：XMLHttpRequest-XMLHttpRequest 对象, textStatus-执行状态, errorThrown-捕获的异常对象
        error : null,
        
        //ajax发送完成后执行的函数，null代表不执行，传入两个参数：XMLHttpRequest-XMLHttpRequest 对象, textStatus-执行状态
        //textStatus包括以下状态：null,"success"，"timeout", "error", "notmodified" 和 "parsererror"
        complete : null,
        
        //要访问的ajax服务器页面地址，默认为"AjaxServer.aspx"
        url : "AjaxServer.aspx",
        
        //其他的ajax参数,包括
        //timeout:10000
        //async  : (默认: true) 默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。
        //cache :  (默认: true,dataType为script和jsonp时默认为false)设置为 false 将不缓存此页面。
        //contentType : (默认: "application/x-www-form-urlencoded") 发送信息至服务器时内容编码类型。
        //context  : Object,这个对象用于设置Ajax相关回调函数的上下文。也就是说，让回调函数内this指向这个对象（如果不设定这个参数，那么this就指向调用本次AJAX请求时传递的options参数）
        AjaxPara : {
            //(默认: true) 默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行
            cache : true
        }
    };
    
    /*
    --AjaxEFun--
    $.AjaxEFun(FunName,Para,opts)
        执行Ajax服务器函数
        FunName  :  要执行的函数名
        Para   :   要传入的参数内容，必须为js对象
        opts   :   调用参数，见$.AjaxTool.defaults
                      
        服务器收到的是一个JSON字符串，转换为Object的格式如下：
        SendPara.IsEncode = false;  ～ 是否经过加密
        SendPara.WithKey = false;   ～ 参数中是否带加密的密钥
        SendPara.EncodeKey = "";    ～ 加密的密钥
        SendPara.Data = OrgSendString; ～ 调用服务器的参数JSON字符串（可能经过加密）
        
        SendPara.Data以约定的加密方式进行加密，解密后的转换为Object的格式为：
        ServerPara.FunName = FunName;  ～ 要调用的函数名
        ServerPara.Para = Para;        ～ 传入的参数Object
    */
　　$.AjaxEFun = function (FunName,Para,opts){
　　    //处理参数
　　    opts = $.extend({}, $.AjaxTool.defaults, opts || {});
　　    opts.AjaxPara = $.extend({}, $.AjaxTool.defaults.AjaxPara, opts.AjaxPara || {});
　　    
       
        //组织要运行向服务器发送的参数start
        var ServerPara = new Object();
        ServerPara.FunName = FunName;
        ServerPara.Para = Para;
        
        //组成未加密的数据
        var OrgSendString = JSON.stringify(ServerPara);
        
        //组成加密的数据
        var SendPara = new Object();
        if(opts.Encode == null){
            //不加密
            SendPara.IsEncode = false;
            SendPara.EncodeName = "";
            SendPara.WithKey = false;
            SendPara.EncodeKey = "";
            SendPara.EncodePara = "";
            SendPara.Data = OrgSendString;
        }
        else{
            //要进行加密
            SendPara.IsEncode = true;
            SendPara.EncodeName = opts.EncodeName;
            SendPara.WithKey = opts.SendKey;
            if(opts.SendKey){
                SendPara.EncodeKey = opts.Encodekey;
                SendPara.EncodePara = opts.EncodePara;
            }
            else{
                SendPara.EncodeKey = "";
                SendPara.EncodePara = "";
            }
            SendPara.Data = opts.Encode(OrgSendString,opts.Encodekey);
        }
        
        //要发送的串
        var SendString = JSON.stringify(SendPara);
        //组织要运行向服务器发送的参数end
        
        //执行ajax函数
        var AjaxRunPara = {
            type: "POST",
            url: opts.url,
            data : SendString,
            beforeSend : (opts.beforeSend==null?jQuery.noop:opts.beforeSend),
            success : (opts.success==null?jQuery.noop:opts.success),
            error : (opts.error==null?jQuery.noop:opts.error),
            complete : (opts.complete==null?jQuery.noop:opts.complete)   
        };
        AjaxRunPara = $.extend({}, AjaxRunPara, opts.AjaxPara || {});
        
        $.ajax(AjaxRunPara);
　　};
　　
　　/*
    --AjaxAnalysData--
    $.AjaxAnalysData(Data,[Encode],[Encodekey])
        解析Ajax服务器函数返回的数据
        Data  :  要解析的数据
        [Encode] : 解密函数，默认为null，解密函数需返回解密的字符串，传入2个参数，解密串,密钥
        [Encodekey] : 解密密钥，默认为""
        
        返回值 : SendPara.Data转换成的Object对象
                      
        服务器返回的是一个JSON字符串，转换为Object的格式如下：
        SendPara.IsEncode = false;  ～ 是否经过加密
        SendPara.WithKey = false;   ～ 参数中是否带加密的密钥
        SendPara.EncodeKey = "";    ～ 加密的密钥
        SendPara.Data = OrgSendString; ～ 调用服务器的参数JSON字符串（可能经过加密）
        
        SendPara.Data以约定的加密方式进行加密，解密后转换为Object对象 
    */
　　$.AjaxAnalysData=function (Data){
　　    //获取参数
　　    var Encode = null;
　　    var Encodekey = "";
　　    for(var i = 1;i<arguments.length;i++)
        {
            if(arguments[i] == null || arguments[i] === undefined) { 
                continue;  //没有传具体值进来
            }
            switch(i)
            {
                case 1:
                    Encode = arguments[i];
                    break;
                case 2:
                    Encodekey = arguments[i];
                    break;
                default :
                    break;
            }
        }
        
        //开始进行解析
        var SendPara = JSON.parse(Data);
        if(SendPara.IsEncode){
            //有经过加密，需要解密
            if(Encode == null){
                //没有提供解密函数
                return null;
            }
            
            if(SendPara.WithKey){
                //服务器提供了密钥
                return JSON.parse(Encode(SendPara.Data,SendPara.EncodeKey));
            }
            else{
                //使用本地密钥
                return JSON.parse(Encode(SendPara.Data,Encodekey));
            }
        }
        else{
            //没有加密，直接返回
            return JSON.parse(SendPara.Data);
        }
　　};

})(jQuery);

