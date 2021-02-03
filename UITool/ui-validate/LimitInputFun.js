/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：LimitInputFun
说明：限制录入功能（主要针对textbox）
文件：LimitInputFun.js
依赖文件：PowerString.js
          BaseValidateFun.js
-----------------------*/

/*-----------------------
==LimitInputFun==
限制录入功能（主要针对textbox）
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
    --JQuery_UITool_LimitInput_Objects--
    保存对象录入参数限制需要使用的临时数组变量
    --------------- */
    var JQuery_UITool_LimitInput_Objects = new Array(0);
    
    /*
      --AddLimitInput--
      $("").AddLimitInput(limitID,showName,limitPara,alertFun,[successFun],[order]);
      为对象添加录入限制控制（注意，对于没有ID属性的对象不会处理）
     */
     $.fn.AddLimitInput = function(limitID,showName,limitPara,alertFun) {
        //获取参数
        var successFun = null;
        var order = -1; 
        if(arguments.length > 4){
            successFun = arguments[4];
        }
        if(arguments.length > 5){
            order = arguments[5];
        }
        
        //循环进行处理
        for(var i=0;i<this.length;i++){
            var obj = $(this.get(i));
            var objid = obj.attr("id");
            if(objid === undefined || objid==""){
                //没有ID的不处理
                continue;
            }
            
            //判断对象是否已添加过
            var IndexObj = null;
            for(var j = 0;j<JQuery_UITool_LimitInput_Objects.length;j++){
                if(JQuery_UITool_LimitInput_Objects[j].ObjectID == objid){
                    IndexObj = JQuery_UITool_LimitInput_Objects[j];
                    break;
                }
            }
            if(IndexObj == null){
                //没有添加过
                IndexObj = new Object();
                IndexObj.ObjectID = objid;
                IndexObj.LastValue = new Object();
                IndexObj.LastValue.KeyDowning = false;
                IndexObj.KeyDownPara = new Array(0);
                IndexObj.KeyUpPara = new Array(0);
                IndexObj.BlurPara = new Array(0);
                JQuery_UITool_LimitInput_Objects.push(IndexObj);
                
                //先绑定事件
                obj.bind("keydown",LimitInput_KeyDown);
                obj.bind("keyup",LimitInput_KeyUp);
                obj.bind("blur",LimitInput_Blur);
            }
            
            //添加参数
            switch(limitPara.split(',')[0]){
                case "Len":
                    //三个类型都添加
                    //KeyDown
                    var KeyDownPara = new Object();
                    KeyDownPara.limitID = limitID;
                    KeyDownPara.showName = showName;
                    KeyDownPara.limitPara = limitPara;
                    if(order == -1){
                        //放置在最后面
                        KeyDownPara.order = 1000+IndexObj.KeyDownPara.length;
                    }
                    else{
                        KeyDownPara.order = order;
                    }
                    IndexObj.KeyDownPara.push(KeyDownPara);
                    IndexObj.KeyDownPara.sort(sortObjectOrderValidate);
                    //KeyUp
                    var KeyUpPara = new Object();
                    KeyUpPara.limitID = limitID;
                    KeyUpPara.showName = showName;
                    KeyUpPara.limitPara = limitPara;
                    if(order == -1){
                        //放置在最后面
                        KeyUpPara.order = 1000+IndexObj.KeyUpPara.length;
                    }
                    else{
                        KeyUpPara.order = order;
                    }
                    IndexObj.KeyUpPara.push(KeyUpPara);
                    IndexObj.KeyUpPara.sort(sortObjectOrderValidate);
                    //Blur
                    var BlurPara = new Object();
                    BlurPara.limitID = limitID;
                    BlurPara.showName = showName;
                    BlurPara.limitPara = limitPara;
                    BlurPara.alertFun = alertFun;
                    BlurPara.successFun = successFun;
                    if(order == -1){
                        //放置在最后面
                        BlurPara.order = 1000+IndexObj.BlurPara.length;
                    }
                    else{
                        BlurPara.order = order;
                    }
                    IndexObj.BlurPara.push(BlurPara);
                    IndexObj.BlurPara.sort(sortObjectOrderValidate);
                    break;
                case "Int":
                case "Float":
                case "DateTime":
                case "NString":
                    //这部分都是只添加KeyUp和Blur
                    //KeyUp
                    var KeyUpPara = new Object();
                    KeyUpPara.limitID = limitID;
                    KeyUpPara.showName = showName;
                    KeyUpPara.limitPara = limitPara;
                    if(order == -1){
                        //放置在最后面
                        KeyUpPara.order = 1000+IndexObj.KeyUpPara.length;
                    }
                    else{
                        KeyUpPara.order = order;
                    }
                    IndexObj.KeyUpPara.push(KeyUpPara);
                    IndexObj.KeyUpPara.sort(sortObjectOrderValidate);
                    //Blur
                    var BlurPara = new Object();
                    BlurPara.limitID = limitID;
                    BlurPara.showName = showName;
                    BlurPara.limitPara = limitPara;
                    BlurPara.alertFun = alertFun;
                    BlurPara.successFun = successFun;
                    if(order == -1){
                        //放置在最后面
                        BlurPara.order = 1000+IndexObj.BlurPara.length;
                    }
                    else{
                        BlurPara.order = order;
                    }
                    IndexObj.BlurPara.push(BlurPara);
                    IndexObj.BlurPara.sort(sortObjectOrderValidate);
                    break;
                case "NumArea":
                case "Email":
                    //这部分只添加Blur
                    //Blur
                    var BlurPara = new Object();
                    BlurPara.limitID = limitID;
                    BlurPara.showName = showName;
                    BlurPara.limitPara = limitPara;
                    BlurPara.alertFun = alertFun;
                    BlurPara.successFun = successFun;
                    if(order == -1){
                        //放置在最后面
                        BlurPara.order = 1000+IndexObj.BlurPara.length;
                    }
                    else{
                        BlurPara.order = order;
                    }
                    IndexObj.BlurPara.push(BlurPara);
                    IndexObj.BlurPara.sort(sortObjectOrderValidate);
                    break;
                case "SelfFun":
                    var funlist = limitPara.split(',');
                    //KeyDown
                    if(funlist[1] != ""){
                        var KeyDownPara = new Object();
                        KeyDownPara.limitID = limitID;
                        KeyDownPara.showName = showName;
                        KeyDownPara.limitPara = limitPara;
                        if(order == -1){
                            //放置在最后面
                            KeyDownPara.order = 1000+IndexObj.KeyDownPara.length;
                        }
                        else{
                            KeyDownPara.order = order;
                        }
                        IndexObj.KeyDownPara.push(KeyDownPara);
                        IndexObj.KeyDownPara.sort(sortObjectOrderValidate);
                    }
                    //KeyUp
                    if(funlist[2] != ""){
                        var KeyUpPara = new Object();
                        KeyUpPara.limitID = limitID;
                        KeyUpPara.showName = showName;
                        KeyUpPara.limitPara = limitPara;
                        if(order == -1){
                            //放置在最后面
                            KeyUpPara.order = 1000+IndexObj.KeyUpPara.length;
                        }
                        else{
                            KeyUpPara.order = order;
                        }
                        IndexObj.KeyUpPara.push(KeyUpPara);
                        IndexObj.KeyUpPara.sort(sortObjectOrderValidate);
                    }
                    //Blur
                    if(funlist[3] != ""){
                        var BlurPara = new Object();
                        BlurPara.limitID = limitID;
                        BlurPara.showName = showName;
                        BlurPara.limitPara = limitPara;
                        BlurPara.alertFun = alertFun;
                        BlurPara.successFun = successFun;
                        if(order == -1){
                            //放置在最后面
                            BlurPara.order = 1000+IndexObj.BlurPara.length;
                        }
                        else{
                            BlurPara.order = order;
                        }
                        IndexObj.BlurPara.push(BlurPara);
                        IndexObj.BlurPara.sort(sortObjectOrderValidate);
                    }
                    break;
                default :
                    //错误的校验参数
                    obj.ClearLimitInput();
                    continue;
            }
        }
     };
     
     /*
      --DeleteLimitInput--
      $("").DeleteLimitInput(limitID);
      删除指定的录入限制参数
     */
     $.fn.DeleteLimitInput = function(limitID) {
        //循环进行处理
        for(var i=0;i<this.length;i++){
            var obj = $(this.get(i));
            var objid = obj.attr("id");
            if(objid === undefined || objid==""){
                //没有ID的不处理
                continue;
            }
            
            //判断对象是否已添加过
            var IndexObj = null;
            var Index = -1;
            for(var j = 0;j<JQuery_UITool_LimitInput_Objects.length;j++){
                if(JQuery_UITool_LimitInput_Objects[j].ObjectID == objid){
                    IndexObj = JQuery_UITool_LimitInput_Objects[j];
                    Index = j;
                    break;
                }
            }
            if(IndexObj == null){
                //没有添加过
                continue;
            }
            
            //找到要删除的参数
            for(var j = 0;j<IndexObj.KeyDownPara.length;j++){
                if(IndexObj.KeyDownPara.limitID == limitID){
                    //找到并删除
                    IndexObj.KeyDownPara.splice(j,1);
                    break;
                }
            }
            
            for(var j = 0;j<IndexObj.KeyUpPara.length;j++){
                if(IndexObj.KeyUpPara.limitID == limitID){
                    //找到并删除
                    IndexObj.KeyUpPara.splice(j,1);
                    break;
                }
            }
            
            for(var j = 0;j<IndexObj.BlurPara.length;j++){
                if(IndexObj.BlurPara.limitID == limitID){
                    //找到并删除
                    IndexObj.BlurPara.splice(j,1);
                    break;
                }
            }
            
             if(IndexObj.KeyDownPara.length == 0 && IndexObj.KeyUpPara.length == 0 && IndexObj.BlurPara.length == 0){
                //已经没有校验参数了，删除整个校验规则
                JQuery_UITool_LimitInput_Objects.splice(Index,1);
                obj.unbind("keydown",LimitInput_KeyDown);
                obj.unbind("keyup",LimitInput_KeyUp);
                obj.unbind("blur",LimitInput_Blur);
            }
        }
     };
     
     /*
      --ClearLimitInput--
      $("").ClearLimitInput();
      清除对象所有的录入限制参数
     */
     $.fn.ClearLimitInput = function() {
        //循环进行处理
        for(var i=0;i<this.length;i++){
            var obj = $(this.get(i));
            var objid = obj.attr("id");
            if(objid === undefined || objid==""){
                //没有ID的不处理
                continue;
            }
            //找到并处理
            for(var j = 0;j<JQuery_UITool_LimitInput_Objects.length;j++){
                if(JQuery_UITool_LimitInput_Objects[j].ObjectID == objid){
                    JQuery_UITool_LimitInput_Objects.splice(j,1);
                    obj.unbind("keydown",LimitInput_KeyDown);
                    obj.unbind("keyup",LimitInput_KeyUp);
                    obj.unbind("blur",LimitInput_Blur);
                    break;
                }
            }
        }
     };
    
    
    //以下为内部函数
    /*---------------
    --LimitInput_KeyDown--
    要限制录入对象绑定的keydown事件调用函数，进行keydown的校验和控制
    --------------- */
    function LimitInput_KeyDown(){
        //先检查keycode是否控制字符，若是则不进行处理
        if(isFunKeyCode(event)){
            return;
        }
        
        //找到对象的检查参数
        var obj = $(this);
        var objid = obj.attr("id");
        var KeyDownPara = null;
        for(var i = 0;i<JQuery_UITool_LimitInput_Objects.length;i++){
            if(JQuery_UITool_LimitInput_Objects[i].ObjectID == objid){
                KeyDownPara = JQuery_UITool_LimitInput_Objects[i].KeyDownPara;
                //找到对象，先记录下来对象当前的信息
                if(!JQuery_UITool_LimitInput_Objects[i].LastValue.KeyDowning){
                    //只有按键按下时才记录，在KeyUp中恢复
                    JQuery_UITool_LimitInput_Objects[i].LastValue.KeyDowning = true;
                    JQuery_UITool_LimitInput_Objects[i].LastValue.text = obj.get(0).value;
                    var selectioninfo = obj.GetObjSelectionInfo();
                    JQuery_UITool_LimitInput_Objects[i].LastValue.startPos = selectioninfo.startPos;
                    JQuery_UITool_LimitInput_Objects[i].LastValue.len = selectioninfo.text.length;
                }
            }
        }
        
        if(KeyDownPara == null){
            //没有找到对象
            return;
        }
        
        //循环处理各类限制参数
        for(var i = 0;i<KeyDownPara.length;i++){
            var paralist = KeyDownPara[i].limitPara.split(',');
            var CheckOK = false;
            switch(paralist[0]){
                case "Len":
                    CheckOK = LenLimit_KeyDown(obj,KeyDownPara[i].limitID,paralist[1]);
                    break;
                case "SelfFun":
                    var js = "try{CheckOK = "+paralist[1]+"(obj,event,KeyDownPara[i].limitID,KeyDownPara[i].showName);}catch(e){CheckOK=true;};";
                    eval(js);
                    break;
                default:
                    //不用处理，直接取下一个参数
                    continue;
            }
            if(!CheckOK){
                //没有通过校验，限制不让输入
		        event.returnValue=false;
                event.cancel = true;
                //直接返回，不用进行下一个比较了
                return;
            }
        }
    };
    
    /*---------------
    --LenLimit_KeyDown--
    Len限制在KeyDown情况下调用的函数
    --------------- */
    function LenLimit_KeyDown(obj,limitID,len){
        //如果有选中的就允许录入
	    try
	    {
	        if(document.selection && document.selection.type == "Text")
	        {
	            //通过校验
	            return true;
	        }
	    }
	    catch(err)
	    {
	        ;
	    }
    	
	    if(obj.get(0).value.getRealLength() >= parseInt(len,10))
	    {
	        //没有通过校验
		    return false;
	    }
	    return true;  //通过校验
    };
    
    /*---------------
    --LimitInput_KeyUp--
    要限制录入对象绑定的keyup事件调用函数，进行keyup的校验和控制
    --------------- */
    function LimitInput_KeyUp(){
        //找到对象的检查参数
        var obj = $(this);
        var objid = obj.attr("id");
        var KeyUpPara = null;
        var LastValue = null;
        for(var i = 0;i<JQuery_UITool_LimitInput_Objects.length;i++){
            if(JQuery_UITool_LimitInput_Objects[i].ObjectID == objid){
                KeyUpPara = JQuery_UITool_LimitInput_Objects[i].KeyUpPara;
                LastValue = JQuery_UITool_LimitInput_Objects[i].LastValue;
                //释放鼠标按下的情况
                LastValue.KeyDowning = false;
            }
        }
        
        //检查keycode是否控制字符，若是则不进行处理
        if(isFunKeyCode(event)){
            return;
        }
        //对象的值为空也不处理
        if(!this.value.checkNotNull()){
            return;
        }
        
        if(KeyUpPara == null){
            //没有找到对象
            return;
        }
        
        //如果原内容与新内容一致，也没必要比较
        if(obj.get(0).value == LastValue.text){
            return;
        }
        
        //循环处理各类限制参数
        for(var i = 0;i<KeyUpPara.length;i++){
            var paralist = KeyUpPara[i].limitPara.split(',');
            var CheckOK = false;
            switch(paralist[0]){
                case "Len":
                    CheckOK = LenLimit_KeyUp(obj,KeyUpPara[i].limitID,paralist[1]);
                    break;
                case "Int":
                    CheckOK = IntLimit_KeyUp(obj,KeyUpPara[i].limitID,paralist[1]);
                    break;
                case "Float":
                    CheckOK = FloatLimit_KeyUp(obj,KeyUpPara[i].limitID,paralist[1],paralist[2],paralist[3]);
                    break;
                case "DateTime":
                    CheckOK = DateTimeLimit_KeyUp(obj,KeyUpPara[i].limitID,paralist[1]);
                    break;
                case "NString":
                    CheckOK = IntLimit_KeyUp(obj,KeyUpPara[i].limitID,false);  //复用Int格式的限制录入,不带符号位
                    break;
                case "SelfFun":
                    var js = "try{CheckOK = "+paralist[2]+"(obj,event,KeyUpPara[i].limitID,KeyUpPara[i].showName);}catch(e){CheckOK=true;};";
                    eval(js);
                    break;
                default:
                    //不用处理，直接取下一个参数
                    continue;
            }
            if(!CheckOK){
                //没有通过校验，限制不让输入，回退到上一个内容
		        obj.get(0).value = LastValue.text;
		        obj.SetObjSelection(LastValue.startPos,LastValue.len);
                return;
            }
        }
    };
    
    /*---------------
    --LenLimit_KeyUp--
    Len限制在KeyUp情况下调用的函数
    --------------- */
    function LenLimit_KeyUp(obj,limitID,len){
	    if(obj.get(0).value.getRealLength() > parseInt(len,10))
	    {
	        //没有通过校验
		    return false;
	    }
	    return true;  //通过校验
    };
    
    /*---------------
    --IntLimit_KeyUp--
    Int限制在KeyUp情况下调用的函数
    --------------- */
    function IntLimit_KeyUp(obj,limitID,withSymbol){
        var regstr = "^" + (withSymbol=="true"?"[+-]{0,1}":"") + "[0-9]{0,}$";
        var rep = new RegExp(regstr);
    	
	    if(rep.test(obj.get(0).value))
	    {
	        return true;
        }
        else
        {
            return false;
        }
    };
    
    /*---------------
    --FloatLimit_KeyUp--
    Float限制在KeyUp情况下调用的函数
    --------------- */
    function FloatLimit_KeyUp(obj,limitID,withSymbol,ILen,FLen){
        var regstr = "^" + (withSymbol=="true"?"[+-]{0,1}":"") + "[0-9]{0,"+ILen+"}(\\.{0,1}|\\.[0-9]{0,"+FLen+"})$";
        var rep = new RegExp(regstr);
    	
	    if(rep.test(obj.get(0).value))
	    {
	        return true;
        }
        else
        {
            return false;
        }
    };
    
    /*---------------
    --DateTimeLimit_KeyUp--
    DateTime限制在KeyUp情况下调用的函数
    --------------- */
    function DateTimeLimit_KeyUp(obj,limitID,format){
        //在这里只能限制输入的字符在格式串以内，并且个数小于格式串中的个数
        var tempstr = format.replace(/[yMdhms0-9]/g,""); //去掉所有数字的项
        var numcount = format.match(/[yMdhms0-9]/g).length; //数字的总数
        
        //检查数字个数
        if(obj.get(0).value.match(/[0-9]/g).length > numcount){
            return false; //数字总数超过
        }
        
        //遍历当前的字符串，看看是否满足需求
        var NumReg = new RegExp("[0-9]");
        for(var i = 0;i<obj.get(0).value.length;i++){
            var ch = obj.get(0).value.charAt(i);
            if(NumReg.test(ch)){
                //数字不必再比较
                continue;
            }
            //看是否包含在字符内
            if(tempstr.indexOf(ch) < 0){
                //有字符串以外的字
                return false;
            }
            
            //开始比较字符的个数
            ch = "/"+ch.replace(/[\$\(\)\*\+\.\[\]\?\/\^\{\}\|]/g,'\\$&')+"/g"; //转义字符，这里把它作为搜索条件
            var check = true;
            var js = "check = (obj.get(0).value.match("+ch+").length <= tempstr.match("+ch+").length);";
            eval(js);
            if(!check){
                return false;
            }
        }
        
        //通过校验
        return true;
    };
    
    /*---------------
    --LimitInput_Blur--
    要限制录入对象的onblur事件调用函数，当对象失去焦点时进行校验和控制
    --------------- */
    function LimitInput_Blur(){
        //对象的值为空不处理
        if(!this.value.checkNotNull()){
            return;
        }
        
        //找到对象的检查参数
        var obj = $(this);
        var objid = obj.attr("id");
        var BlurPara = null;
        for(var i = 0;i<JQuery_UITool_LimitInput_Objects.length;i++){
            if(JQuery_UITool_LimitInput_Objects[i].ObjectID == objid){
                BlurPara = JQuery_UITool_LimitInput_Objects[i].BlurPara;
            }
        }
        
        if(BlurPara == null || BlurPara.length == 0){
            //没有找到对象
            return;
        }
        
        //循环处理各类限制参数
        for(var i = 0;i<BlurPara.length;i++){
            var paralist = BlurPara[i].limitPara.split(',');
            var CheckOK = new Object();
            CheckOK.result = false;
            CheckOK.desc = "未知";
            switch(paralist[0]){
                case "Len":
                    CheckOK.result = this.value.checkLenB(paralist[1],paralist[2]);
                    if(!CheckOK.result){
                        if(paralist[1] != paralist[2]){
                            CheckOK.desc = BlurPara[i].showName + "的长度必须大于等于"+paralist[1]+"个字节,小于等于"+paralist[2]+"个字节!";
                        }
                        else{
                            CheckOK.desc = BlurPara[i].showName + "的长度必须为"+paralist[1]+"个字节!";
                        }
                    }
                    break;
                case "Int":
                    CheckOK.result = this.value.isInt();
                    if(!CheckOK.result){
                        CheckOK.desc = BlurPara[i].showName + "的格式错误，应为整数"+(paralist[1]=="true"?"!":"(无符号和小数点)!");
                    }
                    break;
                case "Float":
                    CheckOK.result = this.value.checkFloatSize(paralist[2],paralist[3]);
                    if(!CheckOK.result){
                        CheckOK.desc = BlurPara[i].showName + "的格式错误，应为"+paralist[2]+"位整数，"+paralist[3]+"位小数的浮点数"+(paralist[1]=="true"?"!":"(无符号)!");
                    }
                    break;
                case "NumArea":
                    var isEqMin = (paralist[1].charAt(0)=="=");
                    var isEqMax = (paralist[2].charAt(0)=="=");
                    var minStr = (isEqMin?paralist[1].substring(1):paralist[1]);
                    var maxStr = (isEqMax?paralist[2].substring(1):paralist[2]);
                    CheckOK.result = this.value.checkNumArea(minStr,maxStr,isEqMin,isEqMax);
                    if(!CheckOK.result){
                        CheckOK.desc = BlurPara[i].showName + "应" + (minStr==""?"":"大于"+(isEqMin?"等于":"")+minStr+(maxStr==""?"":",")) + (maxStr==""?"":"小于"+(isEqMax?"等于":"")+maxStr) + "!";
                    }
                    break;
                case "DateTime":
                    CheckOK.result = this.value.isDateTime(paralist[1]);
                     if(!CheckOK.result){
                        CheckOK.desc = BlurPara[i].showName + "的格式应为\""+paralist[1]+"\"!";
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
                    var js = "try{CheckOK = "+paralist[3]+"(obj,event,KeyUpPara[i].limitID,KeyUpPara[i].showName);}catch(e){CheckOK.result=true;};";
                    eval(js);
                    break;
                default:
                    //不用处理，直接取下一个参数
                    continue;
            }
            if(!CheckOK.result){
                //没有通过校验，运行失败的警告函数
		        try{
		            if(BlurPara[i].alertFun != null){
		                BlurPara[i].alertFun(obj,BlurPara[i].showName,CheckOK.desc);
		            }
		        }
		        catch(err){
		            ;
		        }
                return;
            }
            else{
                //通过该项校验，执行成功的函数
                try{
		            if(BlurPara[i].successFun != null){
		                BlurPara[i].successFun(obj,BlurPara[i].showName);
		            }
		        }
		        catch(err){
		            ;
		        }
            }
        }
    };

})(jQuery);
