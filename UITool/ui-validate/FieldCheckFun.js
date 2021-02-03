/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：FieldCheckFun
说明：提供对textbox的校验，并返回校验结果（可通过扩展函数扩展到其他对象的校验）
文件：FieldCheckFun.js
依赖文件：PowerString.js
          BaseValidateFun.js
-----------------------*/

/*-----------------------
==FieldCheckFun ==
提供对textbox的校验，并返回校验结果（可通过扩展函数扩展到其他对象的校验）
-----------------------*/

;(function($) {
    /*---------------
    --sortObjectOrderValidate--
    根据数组的order属性对数组进行排序处理，升序
    --------------- */
    function sortObjectOrderValidate(a,b)
    {
        return a.order - b.order;
    };

    /*---------------
    --JQuery_UITool_FieldCheck_Para--
    保存当前页面校验参数的共享变量
    --------------- */
    var JQuery_UITool_FieldCheck_Para = new Array(0);
    
    /*
    --AddCheckPara--
    添加校验参数
    */
　　$.AddCheckPara = function (checkID,checkObj,showName,checkPara){
　　    //获得参数
　　    var order = -1;
　　    var initFun = null;
　　    var alertFun = null;
　　    var successFun = null;
　　    for(var i = 4;i<arguments.length;i++)
        {
            if(arguments[i] == null || arguments[i] === undefined) { 
                continue;  //没有传具体值进来
            }
            
            switch(i)
            {
                case 4:
                    order = arguments[i];
                    break;
                case 5:
                    initFun = arguments[i];
                    break;
                case 6:
                    alertFun = arguments[i];
                    break;
                case 7:
                    successFun = arguments[i];
                    break;
                default :
                    break;
            }
        }
        
        //找到标识数组
        var Para = null;
        for(var i = 0;i<JQuery_UITool_FieldCheck_Para.length;i++){
            if(JQuery_UITool_FieldCheck_Para[i].checkID == checkID){
                Para = JQuery_UITool_FieldCheck_Para[i];
                break;
            }
        }
        if(Para == null){
            Para = new Object();
            Para.checkID = checkID;
            Para.checkPara = new Array(0);
            JQuery_UITool_FieldCheck_Para.push(Para);
            Para = JQuery_UITool_FieldCheck_Para[JQuery_UITool_FieldCheck_Para.length - 1];
            if(order == -1){ order = 1;};
        }
        
        //创建对象
        var checkParaNew = new Object();
        checkParaNew.checkObj = checkObj;
        checkParaNew.showName = showName;
        checkParaNew.order = (order==-1?(Para.checkPara[Para.checkPara.length - 1].order + 1):order);
        checkParaNew.initFun = initFun;
        checkParaNew.alertFun = alertFun;
        checkParaNew.successFun = successFun;
        checkParaNew.paraList = checkPara.split("^");
        
        //找到对象
        var replaceindex = -1;
        for(var i = 0;i<Para.checkPara.length;i++){
            if(Para.checkPara[i].checkObj.get(0) == checkObj.get(0)){
                replaceindex = i;
                break;
            }
        }
        
        //替换或加入对象
        if(replaceindex == -1){
            Para.checkPara.push(checkParaNew);
        }
        else{
            Para.checkPara.splice(replaceindex,1,checkParaNew);
        }
        //排序
        Para.checkPara.sort(sortObjectOrderValidate);
　　};
　　
　　/*
    --ClearCheckPara--
    清除校验参数
    */
　　$.ClearCheckPara=function (){
　　    //获得参数
　　    var checkID = "";
　　    var checkObj = undefined;
　　    if(arguments.length > 0){
　　        checkID = arguments[0];
　　    }
　　    if(arguments.length > 1){
　　        checkObj = arguments[1];
　　    }
　　    
　　    if(checkID == null || checkID == ""){
　　        //清除所有的校验参数
　　        JQuery_UITool_FieldCheck_Para = null;
　　        JQuery_UITool_FieldCheck_Para = new Array(0);
　　        return;
　　    }
　　    else if(checkObj === undefined){
　　        //删除校验标识
　　        for(var i = 0;i<JQuery_UITool_FieldCheck_Para.length;i++){
　　            if(JQuery_UITool_FieldCheck_Para[i].checkID == checkID){
                    JQuery_UITool_FieldCheck_Para.splice(i,1);
                    return;
                }
　　        }
　　    }
　　    else{
　　        //删除对象的校验
　　        for(var i = 0;i<JQuery_UITool_FieldCheck_Para.length;i++){
　　            if(JQuery_UITool_FieldCheck_Para[i].checkID == checkID){
                    for(var j = 0;j<JQuery_UITool_FieldCheck_Para[i].checkPara.length;j++){
                        if((checkObj != null && JQuery_UITool_FieldCheck_Para[i].checkPara[j].checkObj.get(0) == checkObj.get(0))
                           || (checkObj == null && JQuery_UITool_FieldCheck_Para[i].checkPara[j].checkObj == null)){
                            //删除
                            JQuery_UITool_FieldCheck_Para[i].checkPara.splice(j,1);
                            return;
                        }
                    }
                }
　　        }
　　    }
　　};
　　
　　/*
    --FieldCheck--
    开始进行校验
    */
　　$.FieldCheck=function (){
　　    //获得参数
　　    var checkID = "";
　　    var checkObj = undefined;
　　    if(arguments.length > 0){
　　        checkID = arguments[0];
　　    }
　　    if(arguments.length > 1){
　　        checkObj = arguments[1];
　　    }
　　    
　　    if(checkID == null || checkID == ""){
　　        //所有的校验参数，初始化
　　        for(var i = 0;i<JQuery_UITool_FieldCheck_Para.length;i++){
　　            for(var j = 0; j<JQuery_UITool_FieldCheck_Para[i].checkPara.length;j++){
　　                if(JQuery_UITool_FieldCheck_Para[i].checkPara[j].initFun != null){
　　                    try{
　　                        JQuery_UITool_FieldCheck_Para[i].checkPara[j].initFun(JQuery_UITool_FieldCheck_Para[i].checkPara[j].checkObj,JQuery_UITool_FieldCheck_Para[i].checkPara[j].showName,JQuery_UITool_FieldCheck_Para[i].checkID);
　　                    }catch(e){
　　                        ;
　　                    }
　　                }
　　            }
　　        }
　　        //执行校验动作
　　        for(var i = 0;i<JQuery_UITool_FieldCheck_Para.length;i++){
　　            for(var j = 0; j<JQuery_UITool_FieldCheck_Para[i].checkPara.length;j++){
　　                //进行校验
　　                if(!FieldCheckCallFun(JQuery_UITool_FieldCheck_Para[i].checkID ,JQuery_UITool_FieldCheck_Para[i].checkPara[j])){
　　                    return false;
　　                }
　　            }
　　        }
　　    }
　　    else if(checkObj === undefined){
　　        //校验标识，初始化
　　        for(var i = 0;i<JQuery_UITool_FieldCheck_Para.length;i++){
　　            if(JQuery_UITool_FieldCheck_Para[i].checkID == checkID){
                    for(var j = 0; j<JQuery_UITool_FieldCheck_Para[i].checkPara.length;j++){
                        if(JQuery_UITool_FieldCheck_Para[i].checkPara[j].initFun != null){
                            try{
　　                            JQuery_UITool_FieldCheck_Para[i].checkPara[j].initFun(JQuery_UITool_FieldCheck_Para[i].checkPara[j].checkObj,JQuery_UITool_FieldCheck_Para[i].checkPara[j].showName,JQuery_UITool_FieldCheck_Para[i].checkID);
　　                        }catch(e){
　　                            ;
　　                        }
                        }
                    }
                    //找到位置
                    break;
                }
            }
　　        //执行校验动作
　　        for(var i = 0;i<JQuery_UITool_FieldCheck_Para.length;i++){
　　            if(JQuery_UITool_FieldCheck_Para[i].checkID == checkID){
                    for(var j = 0; j<JQuery_UITool_FieldCheck_Para[i].checkPara.length;j++){
　　                    //有一个为false则不再校验后面的
　　                    if(!FieldCheckCallFun(JQuery_UITool_FieldCheck_Para[i].checkID ,JQuery_UITool_FieldCheck_Para[i].checkPara[j])){
　　                        return false;
　　                    }
　　                }
　　                //不再处理后续的了
                    break;
                }
　　        }
　　    }
　　    else{
　　        //对某对象进行校验，初始化
　　        for(var i = 0;i<JQuery_UITool_FieldCheck_Para.length;i++){
　　            if(JQuery_UITool_FieldCheck_Para[i].checkID == checkID){
                    for(var j = 0;j<JQuery_UITool_FieldCheck_Para[i].checkPara.length;j++){
                        if((checkObj != null && JQuery_UITool_FieldCheck_Para[i].checkPara[j].checkObj.get(0) == checkObj.get(0))
                           || (checkObj == null && JQuery_UITool_FieldCheck_Para[i].checkPara[j].checkObj == null)){
                            if(JQuery_UITool_FieldCheck_Para[i].checkPara[j].initFun != null){
                                try{
　　                                JQuery_UITool_FieldCheck_Para[i].checkPara[j].initFun(JQuery_UITool_FieldCheck_Para[i].checkPara[j].checkObj,JQuery_UITool_FieldCheck_Para[i].checkPara[j].showName,JQuery_UITool_FieldCheck_Para[i].checkID);
　　                            }catch(e){
　　                                ;
　　                            }
                            }
                            break;
                        }
                    }
                    break;
                }
            }
　　        //执行校验动作
　　        for(var i = 0;i<JQuery_UITool_FieldCheck_Para.length;i++){
　　            if(JQuery_UITool_FieldCheck_Para[i].checkID == checkID){
                    for(var j = 0;j<JQuery_UITool_FieldCheck_Para[i].checkPara.length;j++){
                        if((checkObj != null && JQuery_UITool_FieldCheck_Para[i].checkPara[j].checkObj.get(0) == checkObj.get(0))
                           || (checkObj == null && JQuery_UITool_FieldCheck_Para[i].checkPara[j].checkObj == null)){
                            if(!FieldCheckCallFun(JQuery_UITool_FieldCheck_Para[i].checkID ,JQuery_UITool_FieldCheck_Para[i].checkPara[j])){
                                return false;
                            }
                            break;
                        }
                    }
                    //找到就结束
                    break;
                }
　　        }
　　    }
　　    //校验成功
　　    return true;
　　};
　　
　　/*---------------
    --FieldCheckCallFun--
    针对某一个校验项进行校验的函数，由FieldCheck函数调用
    --------------- */
    function FieldCheckCallFun(checkID, checkPara){
        //循环进行判断和处理
        for(var i = 0;i<checkPara.paraList.length;i++){
            var paralist = checkPara.paraList[i].split(',');
            var CheckOK = new Object();
            CheckOK.result = false;
            CheckOK.desc = "未知";
            switch(paralist[0]){
                case "NotNull":
                    CheckOK.result = checkPara.checkObj.get(0).value.checkNotNull();
                    if(!CheckOK.result){
                        CheckOK.desc = checkPara.showName + "不可为空!";
                    }
                    break;
                case "Len":
                    CheckOK.result = checkPara.checkObj.get(0).value.checkLenB(paralist[1],paralist[2]);
                    if(!CheckOK.result){
                        if(paralist[1] != paralist[2]){
                            CheckOK.desc = checkPara.showName + "的长度必须大于等于"+paralist[1]+"个字节,小于等于"+paralist[2]+"个字节!";
                        }
                        else{
                            CheckOK.desc = checkPara.showName + "的长度必须为"+paralist[1]+"个字节!";
                        }
                    }
                    break;
                case "Int":
                    CheckOK.result = checkPara.checkObj.get(0).value.isInt();
                    if(!CheckOK.result){
                        CheckOK.desc = checkPara.showName + "的格式错误，应为整数"+(paralist[1]=="true"?"!":"(无符号和小数点)!");
                    }
                    break;
                case "Float":
                    CheckOK.result = checkPara.checkObj.get(0).value.checkFloatSize(paralist[2],paralist[3]);
                    if(!CheckOK.result){
                        CheckOK.desc = checkPara.showName + "的格式错误，应为"+paralist[2]+"位整数，"+paralist[3]+"位小数的浮点数"+(paralist[1]=="true"?"!":"(无符号)!");
                    }
                    break;
                case "NumArea":
                    var isEqMin = (paralist[1].charAt(0)=="=");
                    var isEqMax = (paralist[2].charAt(0)=="=");
                    var minStr = (isEqMin?paralist[1].substring(1):paralist[1]);
                    var maxStr = (isEqMax?paralist[2].substring(1):paralist[2]);
                    CheckOK.result = checkPara.checkObj.get(0).value.checkNumArea(minStr,maxStr,isEqMin,isEqMax);
                    if(!CheckOK.result){
                        CheckOK.desc = checkPara.showName + "应" + (minStr==""?"":"大于"+(isEqMin?"等于":"")+minStr+(maxStr==""?"":",")) + (maxStr==""?"":"小于"+(isEqMax?"等于":"")+maxStr) + "!";
                    }
                    break;
                case "DateTime":
                    CheckOK.result = checkPara.checkObj.get(0).value.isDateTime(paralist[1]);
                     if(!CheckOK.result){
                        CheckOK.desc = checkPara.showName + "的格式应为\""+paralist[1]+"\"!";
                    }
                    break;
                case "NString":
                    var NumReg = new RegExp("^[0-9]{0,}$");
                    CheckOK.result = NumReg.test(this.value);
                     if(!CheckOK.result){
                        CheckOK.desc = BlurPara[i].showName + "必须填入数字!";
                    }
                    break;
                case "Email":
                    CheckOK.result = this.value.isEmail();
                     if(!CheckOK.result){
                        CheckOK.desc = BlurPara[i].showName + "不是有效的Email地址!";
                    }
                    break;
                case "SelfFun":
                    var js = "try{CheckOK = "+paralist[1]+"(checkID,checkPara.checkObj,checkPara.showName);}catch(e){CheckOK.result=true;};";
                    eval(js);
                    break;
                default:
                    //不用处理，直接取下一个参数
                    continue;
            }
            if(!CheckOK.result){
                //没有通过校验，运行失败的警告函数
		        try{
		            if(checkPara.alertFun != null){
		                checkPara.alertFun(checkPara.checkObj,checkPara.showName,CheckOK.desc,checkID);
		            }
		        }
		        catch(err){
		            ;
		        }
                return false;
            }
        }
        
        //全部校验通过，执行成功的函数
        try{
            if(checkPara.successFun != null){
                checkPara.successFun(checkPara.checkObj,checkPara.showName,checkID);
            }
        }
        catch(err){
            ;
        }
        
        return true;
    };

})(jQuery);
