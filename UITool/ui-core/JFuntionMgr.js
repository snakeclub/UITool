/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：JFuntionMgr
说明：JQuery对象函数管理
文件：JFuntionMgr.js
依赖文件：jquery-1.6.4.min.js
-----------------------*/
;(function($) {
    //创建一个公用的调用函数
    $.JFMgrAddFun = function(FunName,Id,SearchText,SelfFunName){
        //先检验是否已创建公共函数
        var FunIndex = -1;
        for(var i = 0;i<$.JFuntionMgr.length;i++){
            if($.JFuntionMgr[i].FunName == FunName){
                FunIndex = i;
                break;
            }
        }
        
        if(FunIndex == -1){
            //创建新的公共函数
            FunIndex = $.JFuntionMgr.length;
            var tempobj = new Object;
            tempobj.FunName = FunName;
            tempobj.JObjList = new Array(0);
            //添加到定义中
            $.JFuntionMgr.push(tempobj);
            //创建定义的公用函数
            var js = ";(function($){ $.fn."+FunName+" = function(){return $.JFMgrCommonFun('"+FunName+"',this,arguments);}; })(jQuery);";
            eval(js);
        }
        
        //检验匹配条件是否存在
        if(Id === undefined){
            //没有定义匹配条件
            return;
        }
        
        var SelfIndex = -1;
        for(var i = 0;i<$.JFuntionMgr[FunIndex].JObjList.length;i++){
            if($.JFuntionMgr[FunIndex].JObjList[i].Id == Id){
                SelfIndex = i;
                break;
            }
        }
        
        if(SelfIndex == -1){
            //新增
            var tempS = new Object();
            tempS.ID = Id;
            tempS.SearchText = SearchText;
            tempS.SelfFunName = SelfFunName;
            $.JFuntionMgr[FunIndex].JObjList.push(tempS);
        }
        else if(SearchText == undefined){
            //删除
            $.JFuntionMgr[FunIndex].JObjList.splice(SelfIndex,1);
        }
        else{
            //修改
            $.JFuntionMgr[FunIndex].JObjList[SelfIndex].SearchText = SearchText;
            $.JFuntionMgr[FunIndex].JObjList[SelfIndex].SelfFunName = SelfFunName;
        }
    };
    
    //内部函数
    
    //全局变量，记录公用函数定义
    $.JFuntionMgr = new Array(0);
    
    //统一的调用函数，是所有公用函数调用实际函数
    $.JFMgrCommonFun = function(FunName,Obj,Arg){
        if(Obj.length == 0){
            //没有对象
            return;
        }
        
        //遍历寻找自定义函数
        for(var i = 0;i<$.JFuntionMgr.length;i++){
            if($.JFuntionMgr[i].FunName == FunName){
                var JObjList = $.JFuntionMgr[i].JObjList;
                var obj = $(Obj.get(0));
                //寻找能匹配上的映射函数
                for(var j = 0;j<JObjList.length;j++){
                    if(obj.is(JObjList[j].SearchText)){
                        //找到映射关系
                        try{
                            //执行函数
                            var js = "Obj." + JObjList[j].SelfFunName + "(";
                            for(var k = 0;k<Arg.length;k++){
                                js += "Arg["+k+"]" + (k==(Arg.length-1)?"":",");
                            }
                            js += ");";
                            return eval(js);
                        }catch(e){;}
                        return;
                    }
                }
                //退出循环
                return;
            }
        }
    };
})(jQuery);