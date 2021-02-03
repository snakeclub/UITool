/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：DropDownList
说明：弹出菜单控件
文件：DropDownList.js
依赖文件：jquery-1.6.4.min.js
          ToolFunction.js
          TimerControl.js
          
资源文件：DropDownListCss/DropDownList.css
-----------------------*/

;(function($) {
    //全局变量
    $.HasBindDropDownListEvent = false;  //是否已经绑定了公共的DropDownList事件
    $.DropDownListZIndex = 999;  //下拉框对象列表显示时的zindex值
    
    //创建下拉列表的默认参数
    $.DropDownList = new Object();
    $.DropDownList.defaults = {
        //Type:分4种类型
        //"list"-下拉列表
        //"multiplelist"-多选下拉框
        //"text"-输入框，不限制输入内容
        //"search"-搜索框，限制输入的内容
        Type : "list",
        
        //菜单宽,可以为""、100px，100%
        Width : "100%",
        
        //显示的列表数,超过这个数量将以滚动条的方式显示
        ShowNum : 10,
        
        //选项的高度，需与CSS样式的高度一致
        ItemHeight : 20,
        
        //Css样式前缀，可通过改写TreeView.css来创建多套样式（将TreeView_替换为自定义的样式类）
        CssBefore : "DropDownList",
        
        //是否显示选项图标
        ShowItemPic : false,
        
        //空白图片的情况
        NullItemPic : "../../ui-control/DropDownListImg/DropDownList_Null.gif",
        
        //是否显示提示
        ShowTips : false,
        
        //是否显示下拉箭头
        ShowDropDownArrow : true,
        
        //list、text和search情况下，选中项的点击动作是否代表取消选择，默认为false
        ClickCancle : false,
        
        //multiplelist的情况下，是否对选中项排序（按index升序）
        IsOrderSelected : true,
        
        //点击选项后是否自动隐藏选项
        AutoHideList : true,
        
        //搜索模式，start-前匹配，like-包含匹配，full－全匹配，self-自定义匹配函数，默认是start
        SearchMode : "start",
        
        //自定义匹配函数，传入的参数为Item对象，返回true则代表匹配上，fasle代表匹配失败
        SelfSearchFun : null,
        
        //检索状态时是否进行选项的过滤,false－不过滤选项，true－过滤选项
        IsFilter : false,
        
        //如果IsFilter为true时，而该参数有设置，则执行该函数替代默认的处理，传入参数为下拉框对象、检索内容，搜索模式
        AjaxFilterFun : null,
        
        //多项选中时显示文本的分隔符，默认为","
        TextSplitStr : ",",
        
        //点击选项所执行的函数(在完成了所有自身处理后才调用)，传入的参数依次为下拉框对象，选项对象
        OnItemClick : null,
        
        //选项获得焦点时所执行的函数，传入的参数依次为下拉框对象，选项对象
        OnItemFocus : null,
        
        //选项失去焦点时所执行的函数，传入的参数依次为下拉框对象，选项对象
        OnItemFoucsOut : null,
        
        //选项选中时所执行的函数，传入的参数依次为下拉框对象，选项对象
        OnItemChecked : null,
        
        //选项取消选中时所执行的函数，传入的参数依次为下拉框对象，选项对象
        OnItemUnChecked : null
    };
    
    //创建下拉框选项的默认参数
    $.DropDownListItem = new Object();
    $.DropDownListItem.defaults = {
        //选项文本
        Text : "",
        
        //选项值
        Value : "",
        
        //提示文字
        Tips : "",
        
        //选项图片路径
        PicPath : "",
        
        //选项图片文件名
        Pic : ""
    };
    
    //在指定对象下创建一个空的DropDownList控件（还没有选项）
    $.fn.CreateDropDownList = function(id,opts){
        //自定义参数
        opts = $.extend({}, $.DropDownList.defaults, opts || {});
        
        //循环对每个对象进行处理
        for(var i = 0;i<this.length;i++){
            var parentobj = $(this.get(i));
            
            //是否自定义id
            var tempid = id;
            if(tempid === undefined){
                var autoidnum = 0;
                while(true){
                    if($("#DropDownList_"+autoidnum).length > 0){
                        autoidnum++;
                    }
                    else{
                        tempid = "DropDownList_"+autoidnum;
                        break;
                    }
                }
            }
            
            //创建对象
            var ulHtml = "<div selftype='DropDownList' id='"+tempid+"' focusIndex='-1' enable='true'> \
                  <table DropDownListType='InputTab' cellpadding='0' cellspacing='0'> \
                     <tr DropDownListType='InputTr'> \
                         <td DropDownListType='InputTd'> \
                             <img DropDownListType='InputImg' src=''> \
                             <input type='text' DropDownListType='InputShow' lastvalue='' /> \
                             <input type='text' DropDownListType='InputHide' style='width:0px;height:0px;border:0px solid #868686;margin:0px;padding:0px;position:absolute;' lastvalue='' />  \
                         </td> \
                         <td DropDownListType='ArrowTd'> \
                             <div DropDownListType='ArrowDiv'></div> \
                         </td> \
                     </tr> \
                 </table> \
                 <ul DropDownListType='DropListUl' style='height:20px;'> \
				 </ul> \
              </div>"; 
            parentobj.append(ulHtml);
            var obj = parentobj.children("#"+tempid).last();
            
            //绑定参数
            obj.data("DropDownListOpts",opts);
            
            //当前选定项数组
            var selectedIndex = new Array(0);
            selectedIndex.push(-1);
            obj.data("SelectedIndexs",selectedIndex);
            
            //设置下拉框样式
            obj.SetDropDownListStyle();
            
            //绑定自身事件,由于live不支持
            $(obj.children().get(0).rows[0].cells[0]).bind("resize",$.DropDownListResize);
            
            //如果是第一次创建，绑定树结构事件
            if(!$.HasBindDropDownListEvent){
                //下拉按钮的鼠标移过事件
                $("div[DropDownListType='ArrowDiv']").live("mouseover",$.DropDownListArrowMouseOver);
                $("div[DropDownListType='ArrowDiv']").live("mouseout",$.DropDownListArrowMouseOut);
                //下拉框的点击事件
                $("table[DropDownListType='InputTab']").live("click",$.DropDownListTabClick);

                //非控件上的点击事件
                $("body").live("click",$.DropDownListWinClick);
            
                //选项mouseover
                $("li[DropDownListType='DropListItem']").live("mouseover",$.DropDownListItemMouseOver);
                
                //选项的点击事件
                $("li[DropDownListType='DropListItem']").live("click",$.DropDownListItemClickEvent);
                
                //在对象上的键盘事件
                $("div[selftype='DropDownList']").live("keydown",$.DropDownListKeyDownEvent);
                
                //在输入框的键盘事件
                $(":text[DropDownListType='InputShow']").live("keyup",$.DropDownListKeyUpEvent);
                $(":text[DropDownListType='InputHide']").live("keyup",$.DropDownListKeyUpEvent);
                
                //search模式离开的时候
                $(":text[DropDownListType='InputShow']").live("focusout",$.DropDownListBlueEvent);
                
                $.HasBindDropDownListEvent = true;
            }
        }
    };
    
    //修改树结构的创建参数
    $.fn.DropDownListReSetOpts = function(opts){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            if(!obj.is("[selftype='DropDownList']")){
                //不是准确的类型
                continue;
            }
            
            //获得样式参数
            var oldopts = obj.data("DropDownListOpts");
            var newopts = $.extend({}, oldopts, opts || {});
            
            //保存新参数
            obj.data("DropDownListOpts",newopts);
            
            //如果是多选变更为单选
            if(oldopts.Type == "multiplelist" && newopts != "multiplelist"){
                var SelectedIndexs = obj.data("SelectedIndexs");
                for(var j = SelectedIndexs.length - 1;j>0;j--){
                    //取消选中
                    var cobj = obj.DropDownListGetItem(SelectedIndexs[j]);
                    cobj.DropDownListItemSelected(false);
                }
            }
            
            if(newopts.Type == "list" || newopts.Type == "multiplelist"){
                //如果没有选中，则清空显示
                if(obj.data("SelectedIndexs")[0] == -1){
                    var InputShow = $(obj.children("table").get(0).rows[0].cells[0]).children(":text[DropDownListType='InputShow']");
                    InputShow.val("");
                    InputShow.attr("lastvalue","");
                }
            }
            
            //设置新样式
            obj.SetDropDownListStyle();
        };
    };
    
    //对下拉框结构设置可用和屏蔽
    $.fn.DropDownListEnable = function(isEnable){
        if(this.length == 0)
            return false;
            
        if(isEnable === undefined){
            //获得当前的屏蔽状态
            return ($(this.get(0)).attr("enable") == "true");
        }
        else{
            //设置可用或屏蔽
            for(var i = 0;i<this.length;i++){
                var obj = $(this.get(i));
                if(!obj.is("[selftype='DropDownList']")){
                    //不是准确的类型
                    continue;
                }
                
                //如果状态一致，也不处理
                if(isEnable == (obj.attr("enable") == "true")){
                    continue;
                }
                
                //进行处理
                var opts = obj.data("DropDownListOpts");
                
                obj.attr("class",opts.CssBefore+( isEnable ? "_Normal" : "_Disabled"));
                
                var tabobj = obj.children().first();
                tabobj.attr("class",opts.CssBefore+( isEnable ? "_Tab_Normal" : "_Tab_Disabled"));
                
                var InputTr = $(tabobj.get(0).rows[0]);
                var InputTd = InputTr.children("td[DropDownListType='InputTd']");
                InputTd.attr("class",opts.CssBefore+( isEnable ? "_InputTd_Normal" : "_InputTd_Disabled"));
                
                var InputImg = InputTd.children("img[DropDownListType='InputImg']");
                InputImg.attr("class",opts.CssBefore+( isEnable ? "_InputImg_Normal" : "_InputImg_Disabled"));
                
                var InputShow = InputTd.children(":text[DropDownListType='InputShow']");
                InputShow.attr("class",opts.CssBefore+( isEnable ? "_InputShow_Normal" : "_InputShow_Disabled"));
                
                var ArrowTd = InputTr.children("td[DropDownListType='ArrowTd']");
                ArrowTd.attr("class",opts.CssBefore+( isEnable ? "_ArrowTd_Normal" : "_ArrowTd_Disabled"));
                var ArrowDiv = ArrowTd.children("div[DropDownListType='ArrowDiv']");
                ArrowDiv.attr("class",opts.CssBefore+( isEnable ? "_ArrowDiv_Normal" : "_ArrowDiv_Disabled"));
            }
        }
    };
    
    //向DropDownList中添加选项
    $.fn.DropDownListAddItem = function(id,opts,pos){
        //自定义参数
        opts = $.extend({}, $.DropDownListItem.defaults, opts || {});
        
        //id
        if(typeof id != "string"){
            id = "";
        }
        
        //循环进行处理
        for(var i=0;i<this.length;i++){
            var obj = $(this.get(i));
            if(!obj.is("[selftype='DropDownList']")){
                //不是准确的类型
                continue;
            }
            
            //下拉框参数
            var listopts = obj.data("DropDownListOpts");
            
            //下拉列表对象
            var ulobj = obj.children("ul[DropDownListType='DropListUl']");
            var uldom = ulobj.get(0);
            
            //计算插入的位置
            var index = -1;
            if(typeof pos == "number"){
                index = parseInt(pos);
            }
            if(index < 0 || index > uldom.childNodes.length){
                index = uldom.childNodes.length;
            }
            
            //创建脚本
            var liHtml = "<li DropDownListType='DropListItem'"
                    + " id='"+id+"'"
                    + " class='"+listopts.CssBefore+"_DropListItem_Normal'"
                    + " index='"+index+"'"
                    + " selected='false'>"
                    + "<img DropDownListType='DropListItemImg'"
                    + " class='"+listopts.CssBefore+"_DropListItemImg_Normal' />"
                    + "<div DropDownListType='DropListItemDiv'"
                    + " class='"+listopts.CssBefore+"_DropListItemDiv_Normal'>"
                    + "    <a DropDownListType='DropListItemText'"
                    + "       class='"+listopts.CssBefore+"_DropListItemText_Normal'>"
                    + "    </a>"
                    + "</div>"
                    + "</li>";
                    
            //添加到ul中
            if(index >= uldom.childNodes.length){
                ulobj.append(liHtml);
            }
            else{
                $(uldom.childNodes[index]).before(liHtml);
                //更新当前焦点项
                var CFIndex = parseInt(obj.attr("focusIndex"));
                if(CFIndex >= index){
                    //更新当前焦点项
                    ulobj.attr("focusIndex",CFIndex+1);
                }
                
                //更新当前选中项
                var SelectedIndexs = obj.data("SelectedIndexs");
                for(var j = 0;j<SelectedIndexs.length;j++){
                    if(SelectedIndexs[j] >= index){
                        SelectedIndexs[j] = SelectedIndexs[j] + 1;
                    }
                }
                obj.data("SelectedIndexs",SelectedIndexs);
                
                //将后面li的index属性更新
                for(var j = index+1;j<uldom.childNodes.length;j++){
                    $(uldom.childNodes[j]).attr("index",j.toString());
                }
            }
            
            //设置内容等样式
            var liobj = $(uldom.childNodes[index]);
            liobj.data("DropDownListItemOpts",opts);
            liobj.DropDownListItemChange(null,opts);
            
            //改变对象下拉列表的高度
            obj.DropDownListResetHeight();
        }
    };
    
    //获取DropDownList中的指定选项（通过id或index）
    $.fn.DropDownListGetItem = function(IdOrIndex){
        if(this.length == 0){
            return null;
        }

        var obj = $(this.get(0));
        if(!obj.is("[selftype='DropDownList']")){
            return null;
        }
        
        var ulobj = obj.children("ul[DropDownListType='DropListUl']");
        
        switch(typeof IdOrIndex){
            case "string":
                //通过选项id获取
                var item = ulobj.children("#"+IdOrIndex).first();
                if(item.length  != 1){
                    return null;
                }
                else{
                    return item;
                }
                break;
            case "number":
                //通过位置获取
                var pos = parseInt(IdOrIndex);
                if(pos < 0 || pos >= ulobj.get(0).childNodes.length){
                    return null;
                }
                else{
                    return $(ulobj.get(0).childNodes[pos]);
                }
                break;
            default :
                return null;
        }
    };
    
    //获取DropDownList中的选定的选项
    $.fn.DropDownListSeletedItem = function(){
        var Items = $("");
        var obj = $(this.get(0));
        if(this.length == 0 || !obj.is("[selftype='DropDownList']")){
            //直接返回
            return Items;
        }
        
        var uldom = obj.children("ul[DropDownListType='DropListUl']").get(0);
        var SelectedIndexs = obj.data("SelectedIndexs");
        
        for(var i = 0;i<SelectedIndexs.length;i++){
            if(SelectedIndexs[i] != -1){
                Items = Items.add(uldom.childNodes[SelectedIndexs[i]]);
            }
        }
        
        return Items;
    };
    
    //获取DropDownList中的选中值
    $.fn.DropDownListSeletedValue = function(){
        //选中的对象
        var Items = this.DropDownListSeletedItem();
        if(Items.length == 0)
            return "";
        else if(Items.length == 1){
            return Items.DropDownListItemGetAttr().itemValue;
        }
        else{
            //多项选择
            var opts = $(this.get(0)).data("DropDownListOpts");
            var retStr = $(Items.get(0)).DropDownListItemGetAttr().itemValue;
            for(var i = 1;i<Items.length;i++){
                retStr += opts.TextSplitStr + $(Items.get(i)).DropDownListItemGetAttr().itemValue;
            }
            return retStr;
        }
    };
    
    //获取DropDownList中的选中文本（若text类型则为输入的文字）
    $.fn.DropDownListSeletedText = function(){
        var obj = $(this.get(0));
        if(!obj.is("[selftype='DropDownList']"))
            return "";
        
        var opts = obj.data("DropDownListOpts");
        if(opts.Type == "text"){
            var InputShow = $(obj.children("table").get(0).rows[0].cells[0]).children(":text[DropDownListType='InputShow']");
            return InputShow.get(0).value;
        }
        
        //返回选中的项的文本组合
        var Items = obj.DropDownListSeletedItem();
        if(Items.length == 0)
            return "";
        else{
            var retStr = $(Items.get(0)).DropDownListItemGetAttr().text;
            for(var i = 1;i<Items.length;i++){
                retStr += opts.TextSplitStr + $(Items.get(i)).DropDownListItemGetAttr().text;
            }
            return retStr;
        }
    };
    
    //打开/关闭下拉列表
    $.fn.DropDownListOpenList = function(isOpen){
        for(var i=0;i<this.length;i++){
            var obj = $(this.get(i));
            if(!obj.is("[selftype='DropDownList']")){
                //不是准确的类型
                continue;
            }
            var ulobj = obj.children("ul");
            
            //处理参数
            var TempIsOpen = (isOpen == true);
            if(isOpen === undefined){
                TempIsOpen = (ulobj.css("display") == "none");
            }
            
            //判断是否需处理
            if(TempIsOpen == (ulobj.css("display") != "none")){
                continue;
            }
            
            if(TempIsOpen){
                //打开下拉列表，先显示
                ulobj.css("display","block");
                
                //设置z-index的属性，保留历史的情况
                var oldzindex = obj.css("z-index");
                obj.data("DropDownListTempZIndex",oldzindex);
                obj.css("z-index",$.DropDownListZIndex);
                
                //移到选中的第一个对象那里，如果没有选中的对象，则移到最顶端
                var SelectedIndexs = obj.data("SelectedIndexs");
                if(SelectedIndexs[0] == -1){
                    ulobj.scrollTop(0);
                }
                else{
                    obj.DropDownListGetItem(SelectedIndexs[0]).DropDownListMoveTo();
                }
                
                //设置焦点
                var opts = obj.data("DropDownListOpts");
                obj.DropDownListFocus(opts.Type);
            }
            else{
                //关闭下拉列表，先隐藏
                ulobj.css("display","none");
                
                //恢复z-index的属性
                obj.css("z-index",obj.data("DropDownListTempZIndex"));
                
                //取消焦点
                obj.DropDownListFocusItem(-1);
                
                //取消filter
                obj.DropDownListFilter("");
            }
        }
    };
    
    //按照指定的字符串执行过来操作(IsFilter为true才操作)
    $.fn.DropDownListFilter = function(searchText){
        for(var i=0;i<this.length;i++){
            var obj = $(this.get(i));
            if(!obj.is("[selftype='DropDownList']")){
                //不是准确的类型
                continue;
            }
            var opts = obj.data("DropDownListOpts");
            if(!opts.IsFilter){
                //不需要过滤
                continue;
            }
            
            if(opts.AjaxFilterFun != null){
                //从Ajax自定义函数方式处理
                try{
                    opts.AjaxFilterFun(obj,searchText,opts.SearchMode);
                }catch(e){;}
                continue;
            }
            
            //开始过滤处理，逐个对象处理
            var uldom = obj.children("ul").get(0);
            for(var j =0;j<uldom.childNodes.length;j++){
                var liobj = $(uldom.childNodes[j]);
                var itemopts = liobj.data("DropDownListItemOpts");
                var isMatch = false;
                if(searchText == ""){
                    //不需要过滤
                    isMatch = true;
                }
                else{
                    switch(opts.SearchMode){
                        case "full":
                            if(itemopts.Text == searchText){
                                isMatch = true;
                            }
                            break;
                        case "like":
                            if(itemopts.Text.indexOf(searchText) >= 0){
                                isMatch = true;
                            }
                            break;
                        case "self":
                            try{
                                isMatch = opts.SelfSearchFun(liobj);
                            }catch(e){;}
                            break;
                        default :
                            //start模式
                            if(itemopts.Text.indexOf(searchText) == 0){
                                isMatch = true;
                            }
                            break;
                    }
                }
                
                if(isMatch){
                    //匹配上
                    liobj.css("display","block");
                }
                else{
                    //没有匹配上
                    liobj.css("display","none");
                }
            }
            
            //重新设置下拉框高度
            obj.DropDownListResetHeight();
        }
    };
    
    //根据对象的类型确定是隐藏输入框获得焦点，还是输入框获得焦点
    $.fn.DropDownListFocus = function(Type){
        for(var i=0;i<this.length;i++){
            var obj = $(this.get(i));
            if(!obj.is("[selftype='DropDownList']")){
                //不是准确的类型
                continue;
            }
            
            //判断焦点在哪个位置上
            var inputobj;
            if(Type == "list" || Type == "multiplelist"){
                inputobj = $(obj.children("table").get(0).rows[0].cells[0]).children(":text[DropDownListType='InputHide']");
            }
            else{
                inputobj = $(obj.children("table").get(0).rows[0].cells[0]).children(":text[DropDownListType='InputShow']");
            }
            
            //设置焦点
            inputobj.get(0).focus();
        }
    };
    
    //获取选项的属性(返回第1个对象的属性值)
    $.fn.DropDownListItemGetAttr = function(){
        if(this.length == 0 || !$(this.get(0)).is("[DropDownListType='DropListItem']")){
            return null;
        }
        var ItemObj = $(this.get(0));
        
        //组织返回值
        var RetObj = new Object();
        RetObj.id = ItemObj.attr("id");
        if(RetObj.id === undefined){
            RetObj.id = "";
        }
        var opts = ItemObj.data("DropDownListItemOpts");
        RetObj.text = opts.Text;
        RetObj.itemValue = opts.Value;
        RetObj.tips = opts.Tips;
        RetObj.index = parseInt(ItemObj.attr("index"));
        RetObj.selected = (ItemObj.prop("selected") == "true");
        RetObj.pic = opts.PicPath + opts.Pic;
        
        //返回数据
        return RetObj;
    };
    
    //选中或取消选中指定的选项
    $.fn.DropDownListItemSelected = function(Checked,ChangeInput){
        if(typeof ChangeInput != "boolean"){
            ChangeInput = true;
        }
        for(var i = 0;i<this.length;i++){
            var liobj = $(this.get(i));
            if(!liobj.is("[DropDownListType='DropListItem']")){
                continue;
            }
            var obj = $(liobj.get(0).parentNode.parentNode);
            var opts = obj.data("DropDownListOpts");
            var attr = liobj.DropDownListItemGetAttr();
            
            //判断改变的状态
            var tempcheck = Checked;
            if(tempcheck === undefined){
                //反向状态
                tempcheck = (!attr.selected);
            }
            
            if(tempcheck == attr.selected){
                //状态一样，无需处理
                continue;
            }
            
            //开始处理选中或取消选中
            var inputtext = "";
            var InputShow = $(obj.children("table").get(0).rows[0].cells[0]).children(":text[DropDownListType='InputShow']");
            var InputImg = InputShow.siblings("img[DropDownListType='InputImg']");
            var SelectedIndexs = obj.data("SelectedIndexs");
            if(tempcheck){
                //选中
                if(opts.Type != "multiplelist" && SelectedIndexs[0] != -1){
                    //不是多选，先取消原来选中的项
                    obj.DropDownListGetItem(SelectedIndexs[0]).DropDownListItemSelected(false);
                }
                
                //处理选中代码
                liobj.prop("selected","true");
                liobj.attr("class",opts.CssBefore+"_DropListItem_Selected");
                liobj.children("img[DropDownListType='DropListItemImg']").attr("class",opts.CssBefore+"_DropListItemImg_Selected");
                var DropListItemDiv = liobj.children("div[DropDownListType='DropListItemDiv']");
                DropListItemDiv.attr("class",opts.CssBefore+"_DropListItemDiv_Selected");
                DropListItemDiv.children("a[DropDownListType='DropListItemText']").attr("class",opts.CssBefore+"_DropListItemText_Selected");
                
                //设置选项
                SelectedIndexs = obj.data("SelectedIndexs");
                if(SelectedIndexs[0] == -1){
                    //单选情况
                    SelectedIndexs[0] = attr.index;
                    inputtext = attr.text;
                    InputImg.attr("src",attr.pic);
                    if(opts.ShowItemPic && opts.Type=="list" && attr.pic != ""){
                        InputImg.css("display","block");
                    }
                }
                else{
                    //多选情况
                    SelectedIndexs.push(attr.index);
                    if(opts.IsOrderSelected){
                        //对选项进行排序
                        SelectedIndexs = SelectedIndexs.sort(SortDropDownListSelectedItem);
                    }
                    //设置文本
                    inputtext = obj.DropDownListGetItem(SelectedIndexs[0]).DropDownListItemGetAttr().text;
                    for(var j = 1;j<SelectedIndexs.length;j++){
                        inputtext += opts.TextSplitStr + obj.DropDownListGetItem(SelectedIndexs[j]).DropDownListItemGetAttr().text;
                    }
                }
                
                if(ChangeInput){
                    InputShow.attr("lastvalue",inputtext);
                    InputShow.get(0).value = inputtext;
                    //将焦点设置到结尾
                    InputShow.SetObjSelection(inputtext.length,0);
                }
                
                //更新选中情况
                obj.data("SelectedIndexs",SelectedIndexs);
                obj.SetDropDownListInnerWidth();
                
                //事件
                if(opts.OnItemChecked != null){
                    try{
                        opts.OnItemChecked(obj,liobj);
                    }catch(e){;}
                }
            }
            else{
                //取消选中
                liobj.prop("selected","false");
                liobj.attr("class",opts.CssBefore+"_DropListItem_Normal");
                liobj.children("img[DropDownListType='DropListItemImg']").attr("class",opts.CssBefore+"_DropListItemImg_Normal");
                var DropListItemDiv = liobj.children("div[DropDownListType='DropListItemDiv']");
                DropListItemDiv.attr("class",opts.CssBefore+"_DropListItemDiv_Normal");
                DropListItemDiv.children("a[DropDownListType='DropListItemText']").attr("class",opts.CssBefore+"_DropListItemText_Normal");
                
                //设置选项
                if(SelectedIndexs.length == 1){
                    //只有1项选项
                    SelectedIndexs[0] = -1;
                    inputtext = "";
                    InputImg.attr("src","");
                    InputImg.css("display","none");
                }
                else{
                    //多选
                    for(var j = 0;j<SelectedIndexs.length;j++){
                        if(SelectedIndexs[j] == attr.index){
                            //删除对象
                            SelectedIndexs.splice(j,1);
                        }
                    }
                    //设置文本
                    inputtext = obj.DropDownListGetItem(SelectedIndexs[0]).DropDownListItemGetAttr().text;
                    for(var j = 1;j<SelectedIndexs.length;j++){
                        inputtext += opts.TextSplitStr + obj.DropDownListGetItem(SelectedIndexs[j]).DropDownListItemGetAttr().text;
                    }
                }
                
                if(ChangeInput){
                    InputShow.attr("lastvalue",inputtext);
                    InputShow.get(0).value = inputtext;
                }
                
                //更新选中情况
                obj.data("SelectedIndexs",SelectedIndexs);
                obj.SetDropDownListInnerWidth();
                
                //事件
                if(opts.OnItemUnChecked != null){
                    try{
                        opts.OnItemUnChecked(obj,liobj);
                    }catch(e){;}
                }
            }
        }
    };
    
    //修改选项的属性
    $.fn.DropDownListItemChange = function(id,opts){
        for(var i = 0;i<this.length;i++){
            var liobj = $(this.get(i));
            if(!liobj.is("[DropDownListType='DropListItem']"))
                continue;
                
            //下拉框属性
            var obj = $(liobj.get(0).parentNode.parentNode);
            var listopts = obj.data("DropDownListOpts");
            
            //新样式
            var newopts = $.extend({}, liobj.data("DropDownListItemOpts"), opts || {});
            
            //绑定新样式
            liobj.data("DropDownListItemOpts",newopts);
            
            //id
            if(id != null){
                liobj.attr("id",id);
            }
            
            //开始修改属性
            liobj.attr("itemValue",newopts.Value);
            if(listopts.ShowTips){
                liobj.attr("title",newopts.Tips);
            }
            else{
                liobj.removeAttr("title");
            }
            
            //选项图片
            var DropListItemImg = liobj.children("img[DropDownListType='DropListItemImg']");
            if(newopts.PicPath + newopts.Pic == ""){
                DropListItemImg.attr("src",listopts.NullItemPic);
            }
            else{
                DropListItemImg.attr("src",newopts.PicPath + newopts.Pic);
            }
            if(listopts.ShowItemPic){
                DropListItemImg.css("display","block");
            }
            else{
                DropListItemImg.css("display","none");
            }
            
            //选项内容容器
            var DropListItemDiv = liobj.children("div[DropDownListType='DropListItemDiv']");
            
            //选项文字
            var DropListItemText = DropListItemDiv.children("a[DropDownListType='DropListItemText']");
            DropListItemText.get(0).innerHTML = newopts.Text;
            
            //如果是选中对象
            if(liobj.prop("selected") == "true"){
                var SelectedIndexs = obj.data("SelectedIndexs");
                var inputtext = obj.DropDownListGetItem(SelectedIndexs[0]).DropDownListItemGetAttr().text;
                for(var j = 1;j<SelectedIndexs.length;j++){
                    inputtext += listopts.TextSplitStr + obj.DropDownListGetItem(SelectedIndexs[j]).DropDownListItemGetAttr().text;
                }
                var InputShow = $(obj.children("table").get(0).rows[0].cells[0]).children(":text[DropDownListType='InputShow']");
                InputShow.attr("lastvalue",inputtext);
                InputShow.get(0).value = inputtext;
            }
        }
    };
    
    //删除选项
    $.fn.DropDownListItemDelete = function(){
        for(var i = 0;i<this.length;i++){
            var liobj = $(this.get(i));
            if(!liobj.is("[DropDownListType='DropListItem']")){
                continue;
            }
            var obj = $(liobj.get(0).parentNode.parentNode);
            var uldom = liobj.get(0).parentNode;
            
            //先取消选中
            liobj.DropDownListItemSelected(false);
            
            var index = parseInt(liobj.attr("index"));
            var CFIndex = parseInt(obj.attr("focusIndex"));
            if(CFIndex == index){
                obj.DropDownListFocusItem(-1);
            }
            
            liobj.remove();
            
            //更新后面对象的index
            //更新当前焦点项
            if(CFIndex > index){
                //更新当前焦点项
                obj.attr("focusIndex",CFIndex-1);
            }
            
            //更新当前选中项
            var SelectedIndexs = obj.data("SelectedIndexs");
            for(var j = 0;j<SelectedIndexs.length;j++){
                if(SelectedIndexs[j] > index){
                    SelectedIndexs[j] = SelectedIndexs[j] - 1;
                }
            }
            obj.data("SelectedIndexs",SelectedIndexs);
            
            //将后面li的index属性更新
            for(var j = index;j<uldom.childNodes.length;j++){
                $(uldom.childNodes[j]).attr("index",j.toString());
            }
            
            //改变下拉列表的高度
            obj.DropDownListResetHeight();
        }
    };
    
    //将下拉列表的显示滚动到指定的选项上
    $.fn.DropDownListMoveTo = function(isBottom){
        //处理参数
        if(isBottom === undefined){
            isBottom = false;
        }
        
        for(var i = 0;i<this.length;i++){
            var liobj = $(this.get(i));
            if(!liobj.is("li:visible[DropDownListType='DropListItem']")){
                continue;
            }
            var ulobj = $(liobj.get(0).parentNode);
            
            //获得选项当前位置
            var pos = liobj.position();
            
            //开始判断位置
            if(pos.top >= 0 &&  pos.top <= ulobj.innerHeight() - liobj.outerHeight()){
                //已完全在显示范围中
                continue;
            }
            
            if(pos.top < 0 &&  pos.top + liobj.outerHeight() > 0){
                //只有下半部显示到可见区域中
                ulobj.scrollTop(ulobj.scrollTop()+pos.top);
                continue;
            }
            
            if(pos.top < ulobj.innerHeight() &&  pos.top + liobj.outerHeight() > ulobj.innerHeight()){
                //只有上半部显示到可见区域中
                ulobj.scrollTop(ulobj.scrollTop()+pos.top-ulobj.innerHeight() + liobj.outerHeight());
                continue;
            }
            
            //完全没有显示的情况
            if(isBottom){
                //显示在最后一个
                ulobj.scrollTop(ulobj.scrollTop()+pos.top-ulobj.innerHeight() + liobj.outerHeight());
            }
            else{
                //显示为第1个
                ulobj.scrollTop(ulobj.scrollTop()+pos.top);
            }
        }
    };
    
    
    //私有函数
    //设置下拉框样式
    $.fn.SetDropDownListStyle = function(){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            if(!obj.is("[selftype='DropDownList']")){
                //不是准确的类型
                continue;
            }
            
            //获得样式参数
            var opts = obj.data("DropDownListOpts");
            var enable = (obj.attr("enable") == "true");
            
            //开始设置样式
            //主要表格
            obj.css("width",opts.Width);
            obj.attr("class",opts.CssBefore+( enable ? "_Normal" : "_Disabled"));
            
            var tabobj = obj.children("table");
            tabobj.attr("class",opts.CssBefore+( enable ? "_Tab_Normal" : "_Tab_Disabled"));
            
            //输入框
            var InputTr = $(tabobj.get(0).rows[0]);
            var InputTd = InputTr.children("td[DropDownListType='InputTd']");
            InputTd.attr("class",opts.CssBefore+( enable ? "_InputTd_Normal" : "_InputTd_Disabled"));
            
            var InputImg = InputTd.children("img[DropDownListType='InputImg']");
            InputImg.attr("class",opts.CssBefore+( enable ? "_InputImg_Normal" : "_InputImg_Disabled"));
            if(opts.Type == "list" && opts.ShowItemPic && InputImg.attr("src") != ""){
                //只有是list类型才显示图标
                InputImg.css("display","block");
            }
            else{
                InputImg.css("display","none");
            }
            
            var InputShow = InputTd.children(":text[DropDownListType='InputShow']");
            InputShow.attr("class",opts.CssBefore+( enable ? "_InputShow_Normal" : "_InputShow_Disabled"));
            if(!enable || opts.Type == "list" || opts.Type == "multiplelist"){
                //限制不允许录入
                InputShow.attr("readonly","readonly");
            }
            else{
                InputShow.removeAttr("readonly");
            }
            
            
            //下拉箭头
            var ArrowTd = InputTr.children("td[DropDownListType='ArrowTd']");
            ArrowTd.attr("class",opts.CssBefore+( enable ? "_ArrowTd_Normal" : "_ArrowTd_Disabled"));
            if(opts.ShowDropDownArrow){
                //显示下拉列表
                ArrowTd.css("width","");
            }
            else{
                ArrowTd.css("width","0px");
            }
            
            var ArrowDiv = ArrowTd.children("div[DropDownListType='ArrowDiv']");
            ArrowDiv.attr("class",opts.CssBefore+( enable ? "_ArrowDiv_Normal" : "_ArrowDiv_Disabled"));
            
            //下拉列表
            var DropListUl = obj.children("ul[DropDownListType='DropListUl']");
            DropListUl.attr("class",opts.CssBefore+"_DropListUl");
            
            obj.SetDropDownListInnerWidth();
            
            //每个选项
            var uldom = DropListUl.get(0);
            for(var j = 0;j<uldom.childNodes.length;j++){
                var liobj = $(uldom.childNodes[j]);
                var selected = (liobj.prop("selected") == "true");
                var itemopts = liobj.data("DropDownListItemOpts");
                
                //选项
                liobj.attr("class",opts.CssBefore+( selected ? "_DropListItem_Selected" : "_DropListItem_Normal"));
                if(opts.ShowTips){
                    liobj.attr("title",itemopts.Tips);
                }
                else{
                    liobj.removeAttr("title");
                }
                
                //选项图片
                var DropListItemImg = liobj.children("img[DropDownListType='DropListItemImg']");
                DropListItemImg.attr("class",opts.CssBefore+( selected ? "_DropListItemImg_Selected" : "_DropListItemImg_Normal"));
                if(opts.ShowItemPic){
                    DropListItemImg.css("display","block");
                }
                else{
                    DropListItemImg.css("display","none");
                }
                
                //选项内容容器
                var DropListItemDiv = liobj.children("div[DropDownListType='DropListItemDiv']");
                DropListItemDiv.attr("class",opts.CssBefore+( selected ? "_DropListItemDiv_Selected" : "_DropListItemDiv_Normal"));
                
                //选项文字
                var DropListItemText = DropListItemDiv.children("a[DropDownListType='DropListItemText']");
                DropListItemText.attr("class",opts.CssBefore+( selected ? "_DropListItemText_Selected" : "_DropListItemText_Normal"));
            }
            
            //关闭下拉列表
            DropListUl.css("display","none");
        }
        
        //改变对象下拉列表的高度
        obj.DropDownListResetHeight();
    };
    
    //数组排序时按数字升序排序的调用函数，主要是Array对象的sort()方法调用
    function SortDropDownListSelectedItem(a,b){
        return a - b;
    };
    
    //重置下拉框大小的事件
    $.DropDownListResize = function(){
        $(this.parentNode.parentNode.parentNode.parentNode).SetDropDownListInnerWidth();
    };
    
    //下拉箭头鼠标以上去的事件
    $.DropDownListArrowMouseOver = function(){
        var obj = $(this.parentNode.parentNode.parentNode.parentNode.parentNode);
        if(obj.attr("enable") == "true"){
            var opts = obj.data("DropDownListOpts");
            $(this).attr("class",opts.CssBefore + "_ArrowDiv_MouseOver");
        }
    };
    
    //下拉箭头鼠标移走的事件
    $.DropDownListArrowMouseOut = function(){
        var obj = $(this.parentNode.parentNode.parentNode.parentNode.parentNode);
        if(obj.attr("enable") == "true"){
            var opts = obj.data("DropDownListOpts");
            $(this).attr("class",opts.CssBefore + "_ArrowDiv_Normal");
        }
    };
    
    //在下拉框上点击鼠标的事件
    $.DropDownListTabClick = function(){
        var obj = $(this.parentNode);
        //关闭非本对象的显示下拉列表
        var ulobjs = $("ul:visible[DropDownListType='DropListUl']");
        for(var i = 0;i<ulobjs.length;i++){
            if(ulobjs.get(i).parentNode != this.parentNode){
                $(ulobjs.get(i).parentNode).DropDownListOpenList(false);
            }
        }
        obj.DropDownListOpenList(); //打开或关闭菜单
        //设置焦点
        var opts = obj.data("DropDownListOpts");
        obj.DropDownListFocus(opts.Type);
        return false;
    };
    
    //非控件上的点击事件
    $.DropDownListWinClick = function(){
        //所有正在显示的列表关闭
        var ulobjs = $("ul:visible[DropDownListType='DropListUl']");
        for(var i = 0;i<ulobjs.length;i++){
            $(ulobjs.get(i).parentNode).DropDownListOpenList(false);
        }
    };
    
    //选项mouseover
    $.DropDownListItemMouseOver = function(){
        //将选项设置为焦点
        var obj = $(this.parentNode.parentNode);
        obj.DropDownListFocusItem(parseInt($(this).attr("index")));
    };
    
    //在选项上点击鼠标的事件
    $.DropDownListItemClickEvent = function(){
        var liobj = $(this);
        //执行点击事件
        liobj.DropDownListClickItem();
        //不冒泡
        return false;
    };
    
    //在下拉框上的按键事件
    $.DropDownListKeyDownEvent = function(){
        if(event.altKey || event.altLeft || event.ctrlKey || event.ctrlLeft){
            //有按功能键，直接返回
            return true;
        }
        
        var obj = $(this);
        //如果是屏蔽状态，不处理
        if(obj.attr("enable") != "true"){
            return true;
        }
        
        var opts = obj.data("DropDownListOpts");
        var InputShow = $(obj.children("table").get(0).rows[0].cells[0]).children(":text[DropDownListType='InputShow']");
        var InputHide = InputShow.siblings(":text[DropDownListType='InputHide']");
        var ulobj = obj.children("ul");
        var uldom = ulobj.get(0);
        
        //没有选择项，不处理
        if(uldom.childNodes.length == 0){
            //并没有选择项
            return true;
        }
        
        //是否有展开
        var isOpen = (ulobj.css("display") != "none");
        
        if(isOpen){
            //选项列表展开的情况
            var focusIndex = parseInt(obj.attr("focusIndex"));
            if(focusIndex != -1){
                //判断焦点对象是不是完全没有显示
                var focusobj = obj.DropDownListGetItem(focusIndex);
                var pos = focusobj.position();
                if(pos.top <= 0 - opts.ItemHeight || pos.top >= ulobj.innerHeight()){
                    focusIndex = -1;
                }
            }
                    
            switch(event.keyCode){
                case 34:
                    //向下翻页
                    ulobj.scrollTop(ulobj.scrollTop()+opts.ShowNum*opts.ItemHeight);
                    return false;
                case 33:
                    //向上翻页
                    ulobj.scrollTop(ulobj.scrollTop()-opts.ShowNum*opts.ItemHeight);
                    return false;
                case 36:
                    //HOME
                    ulobj.scrollTop(0);
                    return false;
                case 35:
                    //END
                    ulobj.scrollTop(opts.ItemHeight*uldom.childNodes.length);
                    return false;
                case 13:
                    //回车,相当于鼠标选中
                    if(focusIndex != -1){
                        obj.DropDownListGetItem(focusIndex).DropDownListClickItem();
                    }
                    return false;
                case 27:
                    //ESC,直接关闭
                    obj.DropDownListOpenList(false);
                    return false;
                case 40:
                    //向下
                    if(focusIndex == -1){
                        //找到当前页完全显示的第一个选项
                        for(var i = 0;i<uldom.childNodes.length;i++){
                            var liobj = $(uldom.childNodes[i]);
                            if(liobj.css("display") != "none" && liobj.position().top >= 0){
                                obj.DropDownListFocusItem(i);
                                return false;
                            }
                        }
                    }
                    else{
                        //焦点移到下一个对象
                        for(var i = focusIndex + 1;i<uldom.childNodes.length;i++){
                            var liobj = $(uldom.childNodes[i]);
                            if(liobj.css("display") != "none"){
                                //将焦点移到该对象上
                                obj.DropDownListFocusItem(i);
                                //移动到该对象上
                                liobj.DropDownListMoveTo(true);
                                return false;
                            }
                        }
                    }
                    return false;
                case 38:
                    //向上
                    if(focusIndex == -1){
                        //找到当前页完全显示的最后一个选项
                        for(var i = uldom.childNodes.length - 1;i>=0;i--){
                            var liobj = $(uldom.childNodes[i]);
                            if(liobj.css("display") != "none" && liobj.position().top + opts.ItemHeight <= ulobj.innerHeight()){
                                obj.DropDownListFocusItem(i);
                                return false;
                            }
                        }
                    }
                    else{
                        //焦点移到上一个对象
                        for(var i = focusIndex - 1;i>=0;i--){
                            var liobj = $(uldom.childNodes[i]);
                            if(liobj.css("display") != "none"){
                                //将焦点移到该对象上
                                obj.DropDownListFocusItem(i);
                                //移动到该对象上
                                liobj.DropDownListMoveTo(false);
                                return false;
                            }
                        }
                    }
                    return false;
                default:
                    //其他按键不处理
                    return true;
            }
        }
        else{
            //选项列表没有展开，不处理多选，其他类型处理上下箭头和回车
            if(opts.Type != "list"){
                return true;
            }
            
            var SelectedIndexs = obj.data("SelectedIndexs");
            switch(event.keyCode){
                case 40:
                    //向下，多项选择不支持该操作
                    if(opts.Type != "list")
                        return true;
                        
                    var newindex = SelectedIndexs[0] + 1;
                    if(newindex < uldom.childNodes.length){
                        obj.DropDownListGetItem(newindex).DropDownListItemSelected(true);
                    }
                    return false;
                case 38:
                    //向上,多项选择不支持该操作
                    if(opts.Type != "list")
                        return true;
                    
                    var newindex = SelectedIndexs[0] - 1;
                    if(newindex >= 0){
                        obj.DropDownListGetItem(newindex).DropDownListItemSelected(true);
                    }
                    return false;
                case 13:
                    //回车,展开列表
                    obj.DropDownListOpenList(true);
                    return false;
                default :
                    return true;
            }
        }
    };
    
    //在下拉框/输入框上的按键事件，执行过滤或查找对象的处理
    $.DropDownListKeyUpEvent = function(){
        var inputboj = $(this);
        if(!(inputboj.is(":text[DropDownListType='InputShow']") || inputboj.is(":text[DropDownListType='InputHide']"))){
            return;
        }
        var obj = $(this.parentNode.parentNode.parentNode.parentNode.parentNode);
        var opts = obj.data("DropDownListOpts");
        var ulobj = obj.children("ul");
        var uldom = ulobj.get(0);
                
        //是否不支持过滤
        var supportFilter = !(opts.Type == "list" || opts.Type == "multiplelist");
        
        //先清除了定时清除的计时器
        if(!supportFilter){
            $.ClearTimer("DropDownList_Clear_"+obj.attr("id"));
        }
        
        //定时清除的定时器
        var TimerJs = "$.AddTimer('DropDownList_Clear_"+obj.attr("id")+"',function(){$.DropDownListClearSearchText('"+obj.attr("id")+"');},800);";
        
        //输入方式要清除选中
        if(supportFilter && inputboj.val() != inputboj.attr("lastvalue")){
            //清除选中对象
            obj.DropDownListSeletedItem().DropDownListItemSelected(false,false);
        }
        
        //没有选择项，没有展开，或者搜索项和之前的值一样，不处理
        if(uldom.childNodes.length == 0 || ulobj.css("display") == "none" || inputboj.val() == inputboj.attr("lastvalue")){
            if(supportFilter){
                //可输入类型
                inputboj.attr("lastvalue",inputboj.val());
                return;
            }
            else{
                //不可输入类型
                inputboj.attr("lastvalue",inputboj.val());
                //设置定时清除
                eval(TimerJs);
                return;
            }
        }
        
        //是否通过过滤处理
        if(supportFilter && opts.IsFilter){
            inputboj.attr("lastvalue",inputboj.val());
            obj.DropDownListFocusItem(-1);
            obj.DropDownListFilter(inputboj.val());
            return;
        }
        
        //以下处理为索引方式的查找，foucs对象
        var searchText = inputboj.val();
        var searchfirst = 0;
        var currentindex = parseInt(obj.attr("focusIndex"));
        if(currentindex != -1 && currentindex < uldom.childNodes.length - 1){
            searchfirst = currentindex + 1;
        }
        var itemp = searchfirst;
        
        //循环进行查找，先往下找
        while(true){
            var liobj = $(uldom.childNodes[itemp]);
            var itemopts = liobj.data("DropDownListItemOpts");
            var isMatch = false;
            switch(opts.SearchMode){
                case "full":
                    if(itemopts.Text == searchText){
                        isMatch = true;
                    }
                    break;
                case "like":
                    if(itemopts.Text.indexOf(searchText) >= 0){
                        isMatch = true;
                    }
                    break;
                case "self":
                    try{
                        isMatch = opts.SelfSearchFun(liobj);
                    }catch(e){;}
                    break;
                default :
                    //start模式
                    if(itemopts.Text.indexOf(searchText) == 0){
                        isMatch = true;
                    }
                    break;
            }
            
            if(isMatch){
                //匹配上
                obj.DropDownListFocusItem(itemp);
                liobj.DropDownListMoveTo();
                break;
            }
            
            //没有匹配上
            itemp = itemp + 1;
            if(itemp >= uldom.childNodes.length){
                itemp = 0;
            }
            //判断是否已经重复检索
            if(itemp == searchfirst || itemp == currentindex){
                break;
            }
        }
       
        //设置上次搜索的值
        inputboj.attr("lastvalue",inputboj.val());
        
        //如果是检索类型,设置定时清除
        if(!supportFilter){
            eval(TimerJs);
        }
    };
    
    //定时清除查询参数的函数
    $.DropDownListClearSearchText = function(id){
        var obj = $("#"+id+"[selftype='DropDownList']");
        if(obj.length != 1){
            return;
        }
        
        var inputboj = $(obj.children("table").get(0).rows[0].cells[0]).children(":text[DropDownListType='InputHide']");
        //清除搜索项
        inputboj.val("");
        inputboj.attr("lastvalue","");
    };
    
    //焦点离开下拉框的时候，对于search模式，如果没有选中对象则置空
    $.DropDownListBlueEvent = function(){
        var inputboj = $(this);
        if(!inputboj.is(":text[DropDownListType='InputShow']")){
            return;
        }
        if(inputboj.val() == ""){
            return;
        }
        
        var obj = $(this.parentNode.parentNode.parentNode.parentNode.parentNode);
        var opts = obj.data("DropDownListOpts");
        
        if(opts.Type == "search"){
            if(obj.data("SelectedIndexs")[0] == -1){
                inputboj.val("");
                inputboj.attr("lastvalue","");
            }
        }
    };
    
    //设置下拉框的内部元素宽度
    $.fn.SetDropDownListInnerWidth = function(){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            if(!obj.is("[selftype='DropDownList']")){
                //不是准确的类型
                continue;
            }
            
            var InputTd = $(obj.children("table").get(0).rows[0].cells[0]);
            var InputImg = InputTd.children("img[DropDownListType='InputImg']");
            var InputShow = InputTd.children(":text[DropDownListType='InputShow']");
            
            var opts = obj.data("DropDownListOpts");
            if(opts.Type != "list" || InputImg.css("display") == "none"){
                InputShow.css("width","100%");
            }
            else{
                //有宽度要求
                var width = InputTd.innerWidth(true) - InputImg.outerWidth(true) 
                           - GetNumByPixStr(InputImg.css("margin-left")) 
                           - GetNumByPixStr(InputImg.css("margin-right")) 
                           - GetNumByPixStr(InputShow.css("padding-left")) 
                           - GetNumByPixStr(InputShow.css("padding-right")) 
                           - GetNumByPixStr(InputShow.css("margin-left")) 
                           - GetNumByPixStr(InputShow.css("margin-right"));
                InputShow.css("width",width+"px");
            }
            
            //列表框
            var ulobj = obj.children("ul");
            ulobj.css("width",obj.innerWidth() + "px");
        }
    }; 
    
    //重新设置下拉列表的高度
    $.fn.DropDownListResetHeight = function(){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            if(!obj.is("[selftype='DropDownList']")){
                //不是准确的类型
                continue;
            }
            var opts = obj.data("DropDownListOpts");
            
            var ulobj = obj.children("ul");
            var uldom = ulobj.get(0);
            var itemcount = 0;
            //通过遍历的方式获取个数
            for(var j = 0;j<uldom.childNodes.length;j++){
                if($(uldom.childNodes[j]).css("display") != "none"){
                    itemcount++;
                }
                if(itemcount > opts.ShowNum){
                    //已经超过，无需再数
                    break;
                }
            }
            
            //设置高度
            if(itemcount == 0){
                ulobj.css("height",opts.ItemHeight + "px");
            }
            else if(itemcount <= opts.ShowNum){
                ulobj.css("height","");
            }
            else{
                ulobj.css("height",opts.ItemHeight*opts.ShowNum + "px");
            }
        }
    };
    
    //设置某选项为焦点选项
    $.fn.DropDownListFocusItem = function(index){
        for(var i = 0;i<this.length;i++){
            var obj = $(this.get(i));
            if(!obj.is("[selftype='DropDownList']")){
                //不是准确的类型
                continue;
            }
            
            //旧焦点
            var lastfocus = parseInt(obj.attr("focusIndex"));
            if(lastfocus == index){
                continue;
            }
            
            //记录新焦点
            obj.attr("focusIndex",index.toString());
            
            //参数
            var opts = obj.data("DropDownListOpts");
            
            //取消旧焦点
            if(lastfocus != -1){
                var liobj = obj.DropDownListGetItem(lastfocus);
                var selected = (liobj.prop("selected") == "true");
                
                //选项
                liobj.attr("class",opts.CssBefore+( selected ? "_DropListItem_Selected" : "_DropListItem_Normal"));
                
                //选项图片
                var DropListItemImg = liobj.children("img[DropDownListType='DropListItemImg']");
                DropListItemImg.attr("class",opts.CssBefore+( selected ? "_DropListItemImg_Selected" : "_DropListItemImg_Normal"));
                
                //选项内容容器
                var DropListItemDiv = liobj.children("div[DropDownListType='DropListItemDiv']");
                DropListItemDiv.attr("class",opts.CssBefore+( selected ? "_DropListItemDiv_Selected" : "_DropListItemDiv_Normal"));
                
                //选项文字
                var DropListItemText = DropListItemDiv.children("a[DropDownListType='DropListItemText']");
                DropListItemText.attr("class",opts.CssBefore+( selected ? "_DropListItemText_Selected" : "_DropListItemText_Normal"));
                
                //事件
                if(opts.OnItemFoucsOut != null){
                    try{
                        opts.OnItemFoucsOut(obj,liobj);
                    }catch(e){;}
                }
            }
            
            //设置新焦点
            if(index != -1){
                var liobj = obj.DropDownListGetItem(index);
                var selected = (liobj.prop("selected") == "true");
                
                //选项
                liobj.attr("class",opts.CssBefore+( selected ? "_DropListItem_SelectedFocus" : "_DropListItem_Focus"));
                
                //选项图片
                var DropListItemImg = liobj.children("img[DropDownListType='DropListItemImg']");
                DropListItemImg.attr("class",opts.CssBefore+( selected ? "_DropListItemImg_SelectedFocus" : "_DropListItemImg_Focus"));
                
                //选项内容容器
                var DropListItemDiv = liobj.children("div[DropDownListType='DropListItemDiv']");
                DropListItemDiv.attr("class",opts.CssBefore+( selected ? "_DropListItemDiv_SelectedFocus" : "_DropListItemDiv_Focus"));
                
                //选项文字
                var DropListItemText = DropListItemDiv.children("a[DropDownListType='DropListItemText']");
                DropListItemText.attr("class",opts.CssBefore+( selected ? "_DropListItemText_SelectedFocus" : "_DropListItemText_Focus"));
                
                //事件
                if(opts.OnItemFocus != null){
                    try{
                        opts.OnItemFocus(obj,liobj);
                    }catch(e){;}
                }
            }
        }
    };
    
    //点击某选项
    $.fn.DropDownListClickItem = function(){
        for(var i = 0;i<this.length;i++){
            var liobj = $(this.get(i));
            if(!liobj.is("[DropDownListType='DropListItem']")){
                //不是准确的类型
                continue;
            }
            var obj = $(this.get(i).parentNode.parentNode)
            var opts = obj.data("DropDownListOpts");
            
            //进行选中/取消选中
            var selected = (liobj.prop("selected") == "true");
            if(selected){
                //已选中
                if(opts.ClickCancle){
                    //取消选中
                    liobj.DropDownListItemSelected(false);
                }
            }
            else{
                //未选中
                liobj.DropDownListItemSelected(true);
            }
            
            //执行OnItemClick函数
            if(opts.OnItemClick != null){
                try{
                    opts.OnItemClick(obj,liobj);
                }catch(e){;}
            }
            
            //判断是否要自动关闭,取消选中不关闭
            if(opts.AutoHideList){
                if(!(selected && opts.ClickCancle)){
                    //自动关闭
                    obj.DropDownListOpenList(false);
                }
            }
            
            //设置焦点
            obj.DropDownListFocus(opts.Type);
        }
    };
    
    //附加的处理函数
    //根据传入的象素串获取数值
    function GetNumByPixStr(str){
        var num = parseInt(str.replace("px",""));
        if(isNaN(num)){
            num = 0;
        }
        return num;
    };
    
})(jQuery);