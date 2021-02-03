/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：JSLoader
说明：JS和CSS文件的动态装载控件
文件：JSLoader.js
依赖文件：jquery-1.6.4.min.js
-----------------------*/

var JSLoader = {

    browser: {
        ie: /msie/.test(window.navigator.userAgent.toLowerCase()),
        moz: /gecko/.test(window.navigator.userAgent.toLowerCase()),
        opera: /opera/.test(window.navigator.userAgent.toLowerCase()),
        safari: /safari/.test(window.navigator.userAgent.toLowerCase())
    },
    
    /* -------------
        检查JS/CSS文件是否已存在
        调用方法：JSLoader.hasFile(tag, url);
            tag：文件类型 "script"-JS文件，"link"-CSS文件
            url：文件的引用url
        返回值：true - 文件已存在，false - 文件不存在
    -------------- */
    hasFile : function(tag, url){
        var contains = false;
        var files = document.getElementsByTagName(tag);
        var type = tag == "script" ? "src" : "href";
        for (var i = 0, len = files.length; i < len; i++) {
            if (files[i].getAttribute(type) == url) {
                contains = true;
                break;
            }
        }
        return contains;
    },
    
    /* -------------
        装载JS/CSS文件
        调用方法：JSLoader.loadFile(element, callback, parent);
            element：要装载的dom对象（script或link）
            callback：function，装载成功后的回调函数，传入的参数为element的id,null代表没有回调函数
            parent：要装载到的父节点（JQuery对象），不传则为head
        返回值：element的id（若无则自动生成一个id）
    -------------- */
    loadFile : function(element, callback, parent) {
        if(parent === undefined){
            parent = $(document.getElementsByTagName("head")[0]);
        }
        parent.get(0).appendChild(element);
        
        var backid =$(element).attr("id");
        if(backid === undefined || backid == "" || backid == null){
            var tempi = 0;
            backid = "JSLoader_"+tempi;
            while(true){
                if($("#"+backid).length == 0){
                    $(element).attr("id",backid);
                    break;
                }
                tempi++;
                backid = "JSLoader_"+tempi;
            }
        }
        
        if (callback) {
            var js = "";
            //ie
            if (JSLoader.browser.ie) {
                js = "element.onreadystatechange = function () { \
                    if (this.readyState == 'loaded' || this.readyState == 'complete') { \
                        callback('"+backid+"'); \
                    } \
                };";
            } else if (JSLoader.browser.moz) {
                js = "element.onload = function () {  \
                    callback('"+backid+"');  \
                };";
            } else {
                js = "callback('"+backid+"');";
            }
            eval(js);
        }
        
        return backid;
    },
    
    /* -------------
        装载CSS文件
        调用方法：JSLoader.loadCssFile(files, callback, ids);
            files：要装载的文件url字符数组，例如:["styles/tree.css", "styles/main.css", "styles/login.css",...]
            callback：function，装载成功后的回调函数，传入的参数为element的id,null代表没有回调函数
            ids：与files对应的装载id数组，null代表不传值
        返回值：与files对应的装载id数组，如果某项为null代表已装载
    -------------- */
    loadCssFile : function(files, callback, ids) {
        var urls = files && typeof (files) == "string" ? [files] : files;
        var retIds = new Array();
        for (var i = 0, len = urls.length; i < len; i++) {
            var cssFile = document.createElement("link");
            cssFile.setAttribute('type', 'text/css');
            cssFile.setAttribute('rel', 'stylesheet');
            cssFile.setAttribute('href', urls[i]);
            if(ids !== undefined && ids != null){
                cssFile.setAttribute('id', ids[i]);
            }
            
            if (!JSLoader.hasFile("link", urls[i])) {
                var retid = JSLoader.loadFile(cssFile, callback);
                retIds.push(retid);
            }
            else{
                retIds.push(null);
            }
        }
        
        return retIds;
    },
    
    /* -------------
        替换CSS文件
        调用方法：JSLoader.replaceCssFile(oldId,newFile,callback);
            oldId：旧对象id
            newFile：要替换的新文件url字符串
            callback：function，装载成功后的回调函数，传入的参数为oldId,null代表没有回调函数
        返回值：是否成功true/false
    -------------- */
    replaceCssFile : function(oldId,newFile,callback){
        if(JSLoader.hasFile("script", newFile)){
            //已存在
            return false;
        }
        
        var oldObj = $("#"+oldId);
        if(oldObj.length != 1){
            return false;
        }
        
        //创建对象
        var script = document.createElement("link");
        script.setAttribute('type', 'text/css');
        script.setAttribute('rel', 'stylesheet');
        script.setAttribute('href', newFile);
        script.setAttribute('id', oldId);
        
        //替换
        oldObj.get(0).parentNode.replaceChild(script,oldObj.get(0));
        
        //callback
        if (callback) {
            var js = "";
            //ie
            if (JSLoader.browser.ie) {
                js = "script.onreadystatechange = function () { \
                    if (this.readyState == 'loaded' || this.readyState == 'complete') { \
                        callback('"+oldId+"'); \
                    } \
                };";
            } else if (JSLoader.browser.moz) {
                js = "script.onload = function () {  \
                    callback('"+oldId+"');  \
                };";
            } else {
                js = "callback('"+oldId+"');";
            }
            eval(js);
        }
        
        return true;
    },
    
    /* -------------
        装载JS文件
        调用方法：JSLoader.loadScript(files, callback, ids, parent);
            files：要装载的文件url字符数组，例如：:["scripts/jquery.extends.js", "scripts/array.extends.js",...]
            callback：function，装载成功后的回调函数，传入的参数为element的id,null代表没有回调函数
            ids：与files对应的装载id数组，null代表不传值
            parent：要装载到的父节点（JQuery对象），不传则为head
        返回值：与files对应的装载id数组，如果某项为null代表已装载
    -------------- */
    loadScript : function(files, callback, ids, parent) {
        var urls = files && typeof (files) == "string" ? [files] : files;
        var retIds = new Array();
        for (var i = 0, len = urls.length; i < len; i++) {
            var script = document.createElement("script");
            script.setAttribute('charset', 'gb2312');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', urls[i]);
            if(ids !== undefined && ids != null){
                script.setAttribute('id', ids[i]);
            }

            if (!JSLoader.hasFile("script", urls[i])) {
                var retid = JSLoader.loadFile(script, callback, parent);
                retIds.push(retid);
            }
            else{
                retIds.push(null);
            }
        }
        
        return retIds;
    },
    
    /* -------------
        替换JS文件
        调用方法：JSLoader.replaceScript(oldId,newFile,callback);
            oldId：旧对象id
            newFile：要替换的新文件url字符串
            callback：function，装载成功后的回调函数，传入的参数为oldId,null代表没有回调函数
        返回值：是否成功true/false
    -------------- */
    replaceScript : function(oldId,newFile,callback){
        if(JSLoader.hasFile("script", newFile)){
            //已存在
            return false;
        }
        
        var oldObj = $("#"+oldId);
        if(oldObj.length != 1){
            return false;
        }
        
        //创建对象
        var script = document.createElement("script");
        script.setAttribute('charset', 'gb2312');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', urls[i]);
        script.setAttribute('id', oldId);
        
        //替换
        oldObj.get(0).parentNode.replaceChild(script,oldObj.get(0));
        
        //callback
        if (callback) {
            var js = "";
            //ie
            if (JSLoader.browser.ie) {
                js = "script.onreadystatechange = function () { \
                    if (this.readyState == 'loaded' || this.readyState == 'complete') { \
                        callback('"+oldId+"'); \
                    } \
                };";
            } else if (JSLoader.browser.moz) {
                js = "script.onload = function () {  \
                    callback('"+oldId+"');  \
                };";
            } else {
                js = "callback('"+oldId+"');";
            }
            eval(js);
        }
        
        return true;
    }

};
