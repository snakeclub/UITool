/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：TreeView
说明：弹出菜单控件
文件：TreeView.js
依赖文件：jquery-1.6.4.min.js
          Radio.js(要进行美化的情况)
          CheckBox.js(要进行美化的情况)
          JFuntionMgr.js
          
资源文件：TreeViewCss/TreeView.css
          TreeViewImg/
-----------------------*/

;(function($) {
    //全局变量
    $.HasBindTreeViewEvent = false;  //是否已经绑定了公共的TreeView事件
    
    //创建树型结构的默认参数
    $.TreeView = new Object();
    $.TreeView.defaults = {
        //树类型，说明如下
        //radio - 单选样式，在选项前有个单选框(只能选一个)
        //checkbox - 复选样式，在选项前有复选框(可以选择多个)
        //list - 前面没有单选和复选框,单项选择
        //multiplelist - 前面没有单选和复选框,多项选择
        Type : "list",
        
        //菜单宽,可以为""、100px，100%
        Width : "100%",
        
        //菜单高,可以为""、100px
        Height : "",
        
        //是否启动Focus样式，如不启用，鼠标移动到选项上样式变化
        EnableFocusStyle : true,
        
        //是否启用选中后的样式，如不启用，选中后样式与正常样式一致，对于list和multiplelist不启用无法看出选中项
        EnableSelectedStyle : true,
        
        //Css样式前缀，可通过改写TreeView.css来创建多套样式（将TreeView_替换为自定义的样式类）
        CssBefore : "TreeView",
        
        //是否显示展开的图标
        ShowCollapsePic : true,
        
        //是否显示选项图标
        ShowItemPic : true,
        
        //是否显示提示
        ShowTips : false,
        
        //是否显示标题选项,请在显示前通过$("TreeView").TreeViewSetTitleItem函数设置样式
        ShowTitleItem : false,
        
        //list和radio的情况下，选中项的点击动作是否代表取消选择，默认为false
        ClickCancle : false,
        
        //checkbox和multiplelist的情况下，点击动作是否代表将子节点也做同样选择，默认为false
        ClickWithChild : false,
        
        //点击选项所执行的函数(在完成了所有自身处理后才调用)，传入的参数依次为树对象，选项对象
        OnItemClick : null,
        
        //选项获得焦点时所执行的函数，传入的参数依次为树对象，选项对象
        OnItemFocus : null,
        
        //选项失去焦点时所执行的函数，传入的参数依次为树对象，选项对象
        OnItemFoucsOut : null,
        
        //选项选中时所执行的函数，传入的参数依次为树对象，选项对象
        OnItemChecked : null,
        
        //选项取消选中时所执行的函数，传入的参数依次为树对象，选项对象
        OnItemUnChecked : null,
        
        //展开图标的图片参数
        CollapsePicType : {
            //参数类型，img-图片，div-使用定义的Div样式
            Type : "img",
            
            //以下为图片定义
            //图片路径前缀
            ImgPath : "../../ui-control/TreeViewImg/",
            
            //空白图片
            ImgNull : "TreeView_Null.gif",
            
            //最后一个选项的图片，|__
            ImgBottom : "TreeView_Bottom.gif",
            
            //树线图片，|
            ImgLine : "TreeView_Line.gif",
            
            //中间选项的线图，|--
            ImgNormal : "TreeView_Normal.gif",
            
            //可折叠图，－号
            ImgMinus : "TreeView_Minus.gif",
            
            //可折叠图，－号，最后一项
            ImgMinusBottom : "TreeView_MinusBottom.gif",
            
            //可展开图，+号
            ImgPlus : "TreeView_Plus.gif",
            
            //可展开图，+号，最后一项
            ImgPlusBottom : "TreeView_PlusBottom.gif",
            
            
            //以下为样式名定义
            //空白图片样式
            ClassNull : "TreeView_ExpandDivNull",
            
            //最后一个选项的图片样式，|__
            ClassBottom : "TreeView_ExpandDivBottom",
            
            //树线图片样式，|
            ClassLine : "TreeView_ExpandDivLine",
            
            //中间选项的线图样式，|--
            ClassNormal : "TreeView_ExpandDivNormal",
            
            //可折叠图样式，－号
            ClassMinus : "TreeView_ExpandDivMinus",
            
            //可折叠图样式，－号，最后一项
            ClassMinusBottom : "TreeView_ExpandDivMinusBottom",
            
            //可展开图样式，+号
            ClassPlus : "TreeView_ExpandDivPlus",
            
            //可展开图样式，+号，最后一项
            ClassPlusBottom : "TreeView_ExpandDivPlusBottom"
        },
        
        //是否开启Radio和heckBox美化
        RadioAndCheckBoxStyle : false,
        
        //Radio美化参数，参见$.Radio.defaults
        RadioStyle : {},
        
        //CheckBox美化参数，参见$.CheckBox.defaults
        CheckBoxStyle : {}
    };
    
    //创建树型选项的默认参数
    $.TreeViewItem = new Object();
    $.TreeViewItem.defaults = {
        //选项文本
        Text : "",
        
        //选项值
        Value : "",
        
        //提示文字
        Tips : "",
        
        //是否可选中
        SelectAble : true,
        
        //选项图片样式
        PicType : {
            //参数类型，img-图片，div-使用定义的Div样式,none-无图片
            Type : "img",
            
            //以下为图片定义
            //图片路径前缀
            ImgPath : "../../ui-control/TreeViewImg/",
            
            //正常状态的图片
            ImgNormal : "TreeView_Folder.gif",
            
            //展开状态的图片
            ImgExpand : "TreeView_FolderOpen.gif",
            
            //以下为样式名定义
            //正常状态下样式
            ClassNormal : "TreeView_ImgDivNormal",
            
            //展开状态下样式
            ClassExpand : "TreeView_ImgDivExpand"
        }
    };
    
    //在指定对象下创建一个空的TreeView控件（还没有选项）
    $.fn.CreateTreeView = function(id,opts,titleOpts){
        //自定义参数
        opts = $.extend({}, $.TreeView.defaults, opts || {});
        opts.CollapsePicType = $.extend({}, $.TreeView.defaults.CollapsePicType, opts.CollapsePicType || {});
        
        //标题项参数
        titleOpts = $.extend({}, $.TreeViewItem.defaults, titleOpts || {});
        titleOpts.PicType = $.extend({}, $.TreeViewItem.defaults.PicType, titleOpts.PicType || {});
        
        //循环对每个对象进行处理
        for(var i = 0;i<this.length;i++){
            var parentobj = $(this.get(i));
            
            //是否自定义id
            var tempid = id;
            if(tempid === undefined){
                var autoidnum = 0;
                while(true){
                    if($("#TreeView_"+autoidnum).length > 0){
                        autoidnum++;
                    }
                    else{
                        tempid = "TreeView_"+autoidnum;
                        break;
                    }
                }
            }
            
            //创建对象
            var ulHtml = "<ul id=\""+tempid+"\" selftype='TreeView' class=\""+opts.CssBefore+"_ULMain_Normal\" enable='true' focusIndex='-1'> </ul>";
            parentobj.append(ulHtml);
            var ulobj = parentobj.children("#"+tempid).last();
            
            //绑定参数
            ulobj.data("TreeViewOpts",opts);
            
            //当前选定项数组
            ulobj.data("TreeViewSelectedIndexs",(new Array(0)));
            
            //设置高宽
            ulobj.css({width:opts.Width,height:opts.Height});
            
            //如果是第一次创建，绑定树结构事件
            if(!$.HasBindTreeViewEvent){
                //鼠标移出树结构对象，以及移出选项
                $("ul[selftype='TreeView'],div[TreeViewType='DIVRadio'],div[TreeViewType='DIVCheckBox'],div[TreeViewType='DIVImg'],div[TreeViewType='DIVText']").live("mouseout",$.TreeViewMouseOut);
                
                //移入选项中,5个地方：单选框、复选框、选项图片、文字内容
                $("div[TreeViewType='DIVRadio'],div[TreeViewType='DIVCheckBox'],div[TreeViewType='DIVImg'],div[TreeViewType='DIVText']").live("mouseover",$.TreeViewItemMouseOver);
                
                //点击选项,区分5个地方：展开图标(最后一个)、单选框、复选框、选项图片、文字内容
                $("div[TreeViewType='DIVExpand'] :last-child,div[TreeViewType='DIVRadio'],div[TreeViewType='DIVCheckBox'],div[TreeViewType='DIVImg'],div[TreeViewType='DIVText']").live("click",$.TreeViewItemClick);
                
                //设置Radio和CheckBox的统一处理函数（用于匹配美化控件）
                $.JFMgrAddFun("JFMgrTreeViewChecked","JFMgrCheckedSelfCheckbox","[selftype='CheckBox']","CheckBoxChecked");
                $.JFMgrAddFun("JFMgrTreeViewChecked","JFMgrCheckedSelfRadio","[selftype='Radio']","RadioChecked");
                $.JFMgrAddFun("JFMgrTreeViewChecked","JFMgrCheckedBaseObj",":radio,:checkbox","TreeViewExtenChecked");
                
                $.JFMgrAddFun("JFMgrTreeViewEnable","JFMgrCheckedSelfCheckbox","[selftype='CheckBox']","CheckBoxEnable");
                $.JFMgrAddFun("JFMgrTreeViewEnable","JFMgrCheckedSelfRadio","[selftype='Radio']","RadioEnable");
                $.JFMgrAddFun("JFMgrTreeViewEnable","JFMgrCheckedBaseObj",":radio,:checkbox","TreeViewExtenEnable");
                
                $.HasBindTreeViewEvent = true;
            }
            
            //创建标题选项
            var liHtml = "<li TreeViewType='LIItem'"
                        + " id='"+id+"Title'"
                        + " class='"+opts.CssBefore+"_LIItem_Normal'"
                        + " isTitle='true'"
                        + " itemValue='"+titleOpts.Value+"'"
                        + " tips='"+titleOpts.Tips+"'"
                        + " index='0'"
                        + " level='0'"
                        + " parentindex='-1'"
                        + " selectable='"+titleOpts.SelectAble+"'"
                        + " expanded='false'"
                        + " selected='false'>"
                        + "<div TreeViewType='DIVExpand' class='"+opts.CssBefore+"_DIVExpand' style='display:none;'></div>"
                        + "<div TreeViewType='DIVNoExpand' class='"+opts.CssBefore+"_DIVNoExpand'  style='display:none;'></div>"
                        + "<div TreeViewType='DIVRadio' class='"+opts.CssBefore+"_DIVRadio_Normal'><input type='radio' name='"+tempid+"' /></div>"
                        + "<div TreeViewType='DIVCheckBox' class='"+opts.CssBefore+"_DIVCheckBox_Normal'><input type='checkbox' name='"+tempid+"' /></div>"
                        + "<div TreeViewType='DIVImg' class='"+opts.CssBefore+"_DIVImg_Normal'></div>"
                        + "<div TreeViewType='DIVText' class='"+opts.CssBefore+"_DIVText_Normal'><a TreeViewType='AText' class='"+opts.CssBefore+"_AText_Normal'>"+titleOpts.Text+"</a></div>"
                        + "</li>";
            //添加标题项
            ulobj.append(liHtml);
            
            //绑定标题项样式
            var titleItem = $(ulobj.children().get(0));
            titleItem.data("TreeViewItemOpts",titleOpts);
            
            //美化checkbox和radio
            if(opts.RadioAndCheckBoxStyle){
                titleItem.children("[TreeViewType='DIVRadio']").children().SetRadio(opts.RadioStyle);
                titleItem.children("[TreeViewType='DIVCheckBox']").children().SetCheckBox(opts.CheckBoxStyle);
            }
            
            //设置基础样式
            TreeViewItemSetBaseStyle(titleItem,true, opts);
            
            //是否显示标题项
            if(!opts.ShowTitleItem){
                titleItem.css("display","none");  //不显示标题项
            }  
        }
    };
    
    //修改树结构的创建参数
    $.fn.TreeViewReSetOpts = function(newopts){       
        //循环处理
        for(var i = 0;i<this.length;i++){
            var uldom = this.get(i);
            var ulobj = $(uldom);
            if(!ulobj.is("[selftype='TreeView']"))
                continue;
            //旧的样式
            var oldOpts = ulobj.data("TreeViewOpts");
            //新的样式
            var opts = $.extend({}, oldOpts, newopts || {});
            opts.CollapsePicType = $.extend({}, oldOpts.CollapsePicType, (newopts.CollapsePicType===undefined?{}:newopts.CollapsePicType) || {});
            
            //是否显示标题项
            if(opts.ShowTitleItem){
                $(uldom.childNodes[0]).css("display","block");
            }
            else{
                $(uldom.childNodes[0]).css("display","none");
            }
            
            //宽高样式
            ulobj.css({width:opts.Width,height:opts.Height});
            
            //Focus效果
            TreeViewItemFocusItem(ulobj,-1);
            
            //处理选项的勾选
            var TreeViewSelectedIndexs = ulobj.data("TreeViewSelectedIndexs");
            if((opts.Type == "list" || opts.Type == "radio") && (oldOpts.Type == "multiplelist" || oldOpts.Type == "checkbox")){
                for(var j = 1;j<TreeViewSelectedIndexs.length;j++){
                    TreeViewItemSelect(ulobj.TreeViewGetItem(TreeViewSelectedIndexs[j]),false,false);
                }
                //勾选第1项
                if(TreeViewSelectedIndexs[0] != -1){
                    $(uldom.childNodes[TreeViewSelectedIndexs[0]]).children("[TreeViewType='DIVRadio']").children().JFMgrTreeViewChecked(true);
                    //清空checkbox
                    $(uldom.childNodes[TreeViewSelectedIndexs[0]]).children("[TreeViewType='DIVCheckBox']").children().JFMgrTreeViewChecked(false);
                }
            }
            else if((oldOpts.Type == "list" || oldOpts.Type == "radio") && (opts.Type == "multiplelist" || opts.Type == "checkbox")){
                //勾选第1项
                if(TreeViewSelectedIndexs[0] != -1){
                    $(uldom.childNodes[TreeViewSelectedIndexs[0]]).children("[TreeViewType='DIVCheckBox']").children().JFMgrTreeViewChecked(true);
                    //清空radio
                    $(uldom.childNodes[TreeViewSelectedIndexs[0]]).children("[TreeViewType='DIVRadio']").children().JFMgrTreeViewChecked(false);
                }
            }
            
            //保存新样式
            ulobj.data("TreeViewOpts",opts);
            
            //对每个选项循环处理样式
            for(var j = 0;j<uldom.childNodes.length;j++){
                var ItemObj = $(uldom.childNodes[j]);
                
                //美化checkbox和radio
                if(!oldOpts.RadioAndCheckBoxStyle){
                    if(opts.RadioAndCheckBoxStyle){
                        //添加样式
                        ItemObj.children("[TreeViewType='DIVRadio']").children().SetRadio(opts.RadioStyle);
                        ItemObj.children("[TreeViewType='DIVCheckBox']").children().SetCheckBox(opts.CheckBoxStyle);
                    }
                }
                else{
                    if(!opts.RadioAndCheckBoxStyle){
                        //取消原来的样式
                        ItemObj.children("[TreeViewType='DIVRadio']").children().RemoveRadio();
                        ItemObj.children("[TreeViewType='DIVCheckBox']").children().RemoveCheckBox();
                    }
                    else{
                        if(opts.RadioStyle != oldOpts.RadioStyle){
                            ItemObj.children("[TreeViewType='DIVRadio']").children().SetRadioOpts(opts.RadioStyle);
                        }
                        if(opts.CheckBoxStyle != opts.CheckBoxStyle){
                            ItemObj.children("[TreeViewType='DIVCheckBox']").children().SetCheckBoxOpts(opts.CheckBoxStyle);
                        }
                    }
                }
                
                //处理样式
                TreeViewItemSetBaseStyle(ItemObj,true, opts);
            }
        }
    };
    
    //对树结构设置可用和屏蔽
    $.fn.TreeViewEnable = function(isEnable){
        if(this.length == 0)
            return;
        
        if(isEnable === undefined){
            //获取当前的状态
            return ($(this.get(0)).attr("enable") == "true");
        }
        else{
            //设置可用或屏蔽
            for(var i = 0;i<this.length;i++){
                var uldom = this.get(i);
                var ulobj = $(uldom);
                if(!ulobj.is("[selftype='TreeView']"))
                    continue;
                
                if((ulobj.attr("enable") == "true") == isEnable){
                    //状态一样，无需处理
                    continue;
                }
                
                //Focus效果
                TreeViewItemFocusItem(ulobj,-1);
                
                var treeopts = ulobj.data("TreeViewOpts");
                var classlast = (isEnable?"Normal":"Disable");
                
                //先对树结构处理
                ulobj.attr("enable",(isEnable?"true":"false"));
                ulobj.attr("class",treeopts.CssBefore + "_ULMain_" + classlast);
                
                //循环对每个对象处理
                for(var j=0;j<uldom.childNodes.length;j++){
                    var ItemObj = $(uldom.childNodes[j]);
                    //对象自身
                    ItemObj.attr("class",treeopts.CssBefore + "_LIItem_" + classlast);
                    
                    //Radio和CheckBox
                    var divRadio = ItemObj.children("[TreeViewType='DIVRadio']");
                    divRadio.attr("class",treeopts.CssBefore + "_DIVRadio_" + classlast);
                    divRadio.children().JFMgrTreeViewEnable(isEnable);
                    var divCheckBox = ItemObj.children("[TreeViewType='DIVCheckBox']");
                    divCheckBox.attr("class",treeopts.CssBefore + "_DIVCheckBox_" + classlast);
                    divCheckBox.children().JFMgrTreeViewEnable(isEnable);
                    
                    //选项图片
                    ItemObj.children("[TreeViewType='DIVImg']").attr("class",treeopts.CssBefore + "_DIVImg_" + classlast);
                    
                    //文字内容容器
                    var divText = ItemObj.children("[TreeViewType='DIVText']");
                    var aText = divText.children();
                    if(treeopts.EnableSelectedStyle && ItemObj.prop("selected") == "true"){
                        //选中
                        divText.attr("class",treeopts.CssBefore + "_DIVText_" + (isEnable?"Selected":"SelectedDisable"));
                        aText.attr("class",treeopts.CssBefore + "_AText_" + (isEnable?"Selected":"SelectedDisable"));
                    }
                    else{
                        //没有选中
                        divText.attr("class",treeopts.CssBefore + "_DIVText_" + classlast);
                        aText.attr("class",treeopts.CssBefore + "_AText_" + classlast);
                    }
                }
            }
        }
    };
    
    
    //设置标题选项的样式
    $.fn.TreeViewSetTitleItem = function(opts){
        //自定义参数
        opts = $.extend({}, $.TreeViewItem.defaults, opts || {});
        opts.PicType = $.extend({}, $.TreeViewItem.defaults.PicType, opts.PicType || {});
        
        //循环进行处理
        for(var i=0;i<this.length;i++){
            var uldom = this.get(i);
            var ulobj = $(uldom);
            if(!ulobj.is("[selftype='TreeView']")){
                //不是菜单
                continue;
            }
            var treeopts = ulobj.data("TreeViewOpts");
            var titleItem = $(uldom.childNodes[0]);
            
            //绑定新的参数
            titleItem.data("TreeViewItemOpts",opts);
            
            //设置选中
            if(!opts.SelectAble && titleItem.prop("selected") == "true"){
                //取消选中
                TreeViewItemSelect(titleItem,false,true);
            }
            
            //是否可选，修改参数
            if(opts.SelectAble){
                titleItem.attr("selectable","true");
            }
            else{
                titleItem.attr("selectable","false");
            }
            
            //设置基础样式
            TreeViewItemSetBaseStyle(titleItem,true, treeopts);
        }
    };
    
    //向TreeView中添加选项
    $.fn.AddTreeViewItem = function(id,opts,parentIDOrIndex,pos){
        //自定义参数
        opts = $.extend({}, $.TreeViewItem.defaults, opts || {});
        opts.PicType = $.extend({}, $.TreeViewItem.defaults.PicType, opts.PicType || {});
        
        //id
        if(typeof id != "string"){
            id = "";
        }
        
        //循环进行处理
        for(var i=0;i<this.length;i++){
            var uldom = this.get(i);
            var ulobj = $(uldom);
            if(!ulobj.is("[selftype='TreeView']")){
                //不是菜单
                continue;
            }
            var treeopts = ulobj.data("TreeViewOpts");
            
            //获得对象的index位置
            var index = -1;  //代表插入结尾
            var nextobj = null; //插入后下一个对象
            var isLast = true; //是否最后一个对象
            if(typeof pos == "number"){
                index = parseInt(pos);
            }
            var parentItem = ulobj.TreeViewGetItem(parentIDOrIndex);
            if(parentItem == null){
                //第0个节点为父节点
                parentItem = $(uldom.childNodes[0]);
            }

            var parentindex = parentItem.attr("index");
            var parentChild = ulobj.children("[parentindex='"+parentindex+"']");
            if(parentChild.length == 0){
                //没有子节点
                index = parseInt(parentindex) + 1;
            }
            else if(index == -1 || index >= parentChild.length){
                //放到最后一个
                index = parseInt(parentChild.last().attr("index")) + 1;
            }
            else{
                //取代位置中的那个
                index = parseInt($(parentChild.get(index)).attr("index"));
                isLast = false;
            }
            
            //创建html代码
            var liHtml = "<li TreeViewType='LIItem'"
                        + " id='"+id+"'"
                        + " class='"+treeopts.CssBefore+"_LIItem_Normal'"
                        + " isTitle='false'"
                        + " itemValue='"+opts.Value+"'"
                        + " tips='"+opts.Tips+"'"
                        + " index='"+index+"'"
                        + " level='"+(parseInt(parentItem.attr("level"))+1)+"'"
                        + " parentindex='"+parentindex+"'"
                        + " selectable='"+opts.SelectAble+"'"
                        + " expanded='false'"
                        + " selected='false'>"
                        + "<div TreeViewType='DIVExpand' class='"+treeopts.CssBefore+"_DIVExpand'></div>"
                        + "<div TreeViewType='DIVNoExpand' class='"+treeopts.CssBefore+"_DIVNoExpand'></div>"
                        + "<div TreeViewType='DIVRadio' class='"+treeopts.CssBefore+"_DIVRadio_Normal'><input type='radio' name='"+ulobj.attr("id")+"' /></div>"
                        + "<div TreeViewType='DIVCheckBox' class='"+treeopts.CssBefore+"_DIVCheckBox_Normal'><input type='checkbox' name='"+ulobj.attr("id")+"' /></div>"
                        + "<div TreeViewType='DIVImg' class='"+treeopts.CssBefore+"_DIVImg_Normal'></div>"
                        + "<div TreeViewType='DIVText' class='"+treeopts.CssBefore+"_DIVText_Normal'><a TreeViewType='AText' class='"+treeopts.CssBefore+"_AText_Normal'>"+opts.Text+"</a></div>"
                        + "</li>";
            
            //添加到ul中
            if(index >= uldom.childNodes.length){
                ulobj.append(liHtml);
            }
            else{
                $(uldom.childNodes[index]).before(liHtml);
                //更新当前焦点项
                var CFIndex = parseInt(ulobj.attr("focusIndex"));
                if(CFIndex >= index){
                    //更新当前焦点项
                    ulobj.attr("focusIndex",CFIndex+1);
                }
                
                //更新当前选中项
                var SelectedIndexs = ulobj.data("TreeViewSelectedIndexs");
                for(var j = 0;j<SelectedIndexs.length;j++){
                    if(SelectedIndexs[j] >= index){
                        SelectedIndexs[j] = SelectedIndexs[j] + 1;
                    }
                }
                ulobj.data("TreeViewSelectedIndexs",SelectedIndexs);
                
                //将后面li的index属性更新
                for(var j = index+1;j<uldom.childNodes.length;j++){
                    TreeViewItemChangeIndex($(uldom.childNodes[j]),j);
                }
            }
            
            var liobj = $(uldom.childNodes[index]);
            
            //绑定参数
            liobj.data("TreeViewItemOpts",opts);
            
            //美化checkbox和radio
            if(treeopts.RadioAndCheckBoxStyle){
                liobj.children("[TreeViewType='DIVRadio']").children().SetRadio(treeopts.RadioStyle);
                liobj.children("[TreeViewType='DIVCheckBox']").children().SetCheckBox(treeopts.CheckBoxStyle);
            }
            
            //设置基础样式
            TreeViewItemSetBaseStyle(liobj,true, treeopts);
            
            //设置父节点样式
            TreeViewItemSetBaseStyle(parentItem,false, treeopts);
            
            //设置上一个同级节点的样式
            if($(uldom.childNodes[index-1]).attr("parentindex") == parentindex){
                TreeViewItemSetBaseStyle($(uldom.childNodes[index-1]),false, treeopts);
            }
        }
    };
    
    //获取TreeView中的指定选项（通过id或index）。
    $.fn.TreeViewGetItem = function(IdOrIndex){
        if(this.length == 0){
            return null;
        }
        
        var ulobj = $(this.get(0));
        if(!ulobj.is("[selftype='TreeView']")){
            return null;
        }
        
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
    
    //获取TreeView中的选定的选项
    $.fn.TreeViewGetSeletedItem = function(){
        var Items = $("");
        if(this.length == 0 || !$(this.get(0)).is("[selftype='TreeView']")){
            //直接返回
            return Items;
        }
        
        var uldom = this.get(0);
        var TreeViewSelectedIndexs = $(uldom).data("TreeViewSelectedIndexs");
        
        for(var i = 0;i<TreeViewSelectedIndexs.length;i++){
            if(TreeViewSelectedIndexs[i] != -1){
                Items = Items.add(uldom.childNodes[TreeViewSelectedIndexs[i]]);
            }
        }
        
        return Items;
    };
    
    //展开或收缩指定的选项
    $.fn.TreeViewItemExpand = function(Expanded,WithChild){
        //自定义参数
        if(WithChild === undefined)
            WithChild = false;
        //循环进行处理
        for(var i = 0;i<this.length;i++){
            var ItemObj = $(this.get(i));
            if(!ItemObj.is("[TreeViewType='LIItem']")){
                continue;
            }
            
            var Children = ItemObj.nextAll("[parentindex='"+ItemObj.attr("index")+"']");
            if(Children.length == 0){
                //没有子节点
                continue;
            }
            
            //临时的展开参数
            var tempExpanded = Expanded;
            if(Expanded === undefined){
                tempExpanded = (ItemObj.attr("expanded") == "false");
            }
            
            //设置展开或关闭参数
            ItemObj.attr("expanded",tempExpanded?"true":"false");
            
            //修改展开图片样式
            var TreeOpts = $(ItemObj.get(0).parentNode).data("TreeViewOpts");
            TreeViewItemChangeExpandPic(ItemObj,TreeOpts);
            
            //修改选项图片
            var ItemOpts = ItemObj.data("TreeViewItemOpts");
            if(ItemOpts.PicType.Type == "img"){
                ItemObj.children("[TreeViewType='DIVImg']").children().last().attr("src",ItemOpts.PicType.ImgPath+(tempExpanded?ItemOpts.PicType.ImgExpand:ItemOpts.PicType.ImgNormal));
            }
            else if(ItemOpts.PicType.Type == "div"){
                ItemObj.children("[TreeViewType='DIVImg']").children().last().attr("class",TreeOpts.CssBefore+"_DIVPic "+(tempExpanded?ItemOpts.PicType.ClassExpand : ItemOpts.PicType.ClassNormal));
            }
            
            //显示或隐藏子节点
            if(tempExpanded && ItemObj.css("display") != "none"){
                Children.TreeViewItemShowHide(true);
            }
            else{
                Children.TreeViewItemShowHide(false);
            }
            
            //包含子节点
            if(WithChild){
                Children.TreeViewItemExpand(tempExpanded,WithChild);
            }
        }
    };
    
    //选中或取消选中指定的选项
    $.fn.TreeViewItemSelected = function(Checked,WithChild){
        if(WithChild === undefined)
            WithChild = false;
        //循环处理
        //循环进行处理
        for(var i = 0;i<this.length;i++){
            var ItemObj = $(this.get(i));
            if(!ItemObj.is("[TreeViewType='LIItem']") || ItemObj.is("[selectable='false']")){
                continue;
            }
            
            var tempChecked = Checked;
            if(Checked === undefined){
                tempChecked = (ItemObj.prop("selected") == "false");
            }
            
            TreeViewItemSelect(ItemObj,tempChecked,WithChild);
        }
    };
    
    //获取选项的属性(返回第1个对象的属性值)
    $.fn.TreeViewItemGetAttr = function(){
        if(this.length == 0 || !$(this.get(0)).is("[TreeViewType='LIItem']")){
            return null;
        }
        var ItemObj = $(this.get(0));
        
        //组织返回值
        var RetObj = new Object();
        RetObj.id = ItemObj.attr("id");
        if(RetObj.id === undefined){
            RetObj.id = "";
        }
        RetObj.isTitle = (ItemObj.attr("isTitle") == "true");
        RetObj.itemValue = ItemObj.attr("itemValue");
        RetObj.tips = ItemObj.attr("tips");
        RetObj.index = parseInt(ItemObj.attr("index"));
        RetObj.level = parseInt(ItemObj.attr("level"));
        RetObj.parentindex = parseInt(ItemObj.attr("parentindex"));
        RetObj.selectable = (ItemObj.attr("selectable") == "true");
        RetObj.expanded = (ItemObj.attr("expanded") == "true");
        RetObj.selected = (ItemObj.prop("selected") == "true");
        
        //返回数据
        return RetObj;
    };
    
    //修改选项的属性
    $.fn.TreeViewItemChange = function(id,newopts){
        //id
        if(typeof id != "string"){
            id = null;
        }
        
        for(var i = 0;i<this.length;i++){
            var ItemObj = $(this.get(i));
            if(!ItemObj.is("[TreeViewType='LIItem']")){
                continue;
            }
            
            //自定义参数
            var oldopts = ItemObj.data("TreeViewItemOpts");
            var opts = $.extend({}, oldopts, newopts || {});
            opts.PicType = $.extend({}, oldopts.PicType, (newopts.PicType===undefined?{}:newopts.PicType) || {});
            
            var ulobj = $(this.get(i).parentNode);
            var treeopts = ulobj.data("TreeViewOpts");
            
            //修改id
            if(id != null){
                ItemObj.attr("id",id);
            }
            
            //如果从可选变成不可选
            if(!opts.SelectAble && ItemObj.prop("selected") == "true"){
                ItemObj.TreeViewItemSelected(false);
            }
            
            //是否可选
            ItemObj.attr("selectable",opts.SelectAble.toString());
            
            //绑定新参数
            ItemObj.data("TreeViewItemOpts",opts);
            
            //修改样式
            TreeViewItemSetBaseStyle(ItemObj,true, treeopts);
        }
    };
    
    //删除选项（及子选项）
    $.fn.TreeViewItemDelete = function(isFirst){
        if(isFirst === undefined){
            isFirst = true;
        }
        
        for(var i = 0;i<this.length;i++){
            var ItemObj = $(this.get(i));
            if(!ItemObj.is("[TreeViewType='LIItem']")){
                continue;
            }
            
            var uldom = this.get(i).parentNode;
            var ulobj = $(uldom);
            
            //判断对象是否已经被删除了
            var currentIndex = ItemObj.attr("index");
            if(this.get(i) != ulobj.children("[index='"+currentIndex+"']").get(0)){
                continue;
            }

            
            //递归删除子节点
            ItemObj.nextAll("[parentindex='"+ItemObj.attr("index")+"']").TreeViewItemDelete(false);
            
            //处理自身，清除Focus
            if(ulobj.attr("focusIndex") == currentIndex){
                ulobj.attr("focusIndex","-1");
            }
            
            //处理自身，清除选中(也把子节点清除)
            if(ItemObj.prop("selected") == "true"){
                TreeViewItemSelect(ItemObj,false,true);
            }
            
            //获得上一节点
            var preItem = ItemObj.prev();
            
            //删除自身
            ItemObj.remove();
            
            
            //如果为首次处理，更新后面的对象的index
            if(isFirst){
                //更新前一节点的样式
                var TreeOpts = ulobj.data("TreeViewOpts");
                TreeViewItemSetBaseStyle(preItem,true, TreeOpts);
            
                //删除选中索引
                var TreeViewSelectedIndexs = ulobj.data("'TreeViewSelectedIndexs'");
                for(var j = currentIndex;j<uldom.childNodes.length;j++){
                    var tempObj = $(uldom.childNodes[j]);
                    
                    //更新自身的索引
                    TreeViewItemChangeIndex(tempObj,j);
                }
            }
        }
    };
    
    //内部函数
    
    //所有树结构鼠标移出时执行的函数
    $.TreeViewMouseOut = function(){
        var TreeObj = $(this);
        if(!TreeObj.is("[selftype='TreeView']")){
            TreeObj = $(this.parentNode.parentNode);
        }
        //unfocus
        TreeViewItemFocusItem(TreeObj,-1);
    };
    
    //所有树结构选项鼠标移进时执行的函数
    $.TreeViewItemMouseOver = function(){
        var ItemObj = $(this.parentNode);
        //focus
        TreeViewItemFocusItem($(this.parentNode.parentNode),parseInt(ItemObj.attr("index")));
    };
    
    //所有树结构选项鼠标点击鼠标时执行的函数
    $.TreeViewItemClick = function(){
        var ItemObj = $(this.parentNode);
        switch($(this).attr("TreeViewType")){
            case "IMGExpand":
            case "DIVImgExpand":
                //点击展开图片
                ItemObj = $(this.parentNode.parentNode);
                ItemObj.TreeViewItemExpand();
                break;
            case "DIVImg":
                //点击选项图片，如果有子节点，则执行展开或收缩操作，如果没有子节点，则执行点击动作
                if(ItemObj.attr("isTitle") != "true" && ItemObj.nextAll("[parentindex='"+ItemObj.attr("index")+"'][level='"+(parseInt(ItemObj.attr("level"))+1)+"']").length > 0){
                    ItemObj.TreeViewItemExpand();
                }
                else{
                    TreeViewItemClickFun(ItemObj);
                }
                break;
            default :
                TreeViewItemClickFun(ItemObj);
                break;
        }
        //不传递到上一层
        return true;
    };
    
    //修改指定选项的index属性
    function TreeViewItemChangeIndex(Item,newIndex){
        if(!Item.is("[TreeViewType='LIItem']")){
            return;
        }
        //子节点的父节点指向新的index
        var oldindex = Item.attr("index");
        var childs = Item.nextAll("[parentindex='"+oldindex+"'][level='"+(parseInt(Item.attr("level"))+1)+"']");
        childs.attr("parentindex",newIndex);
        Item.attr("index",newIndex);
        
        //Focus和选中状态
        var ulobj = $(Item.get(0).parentNode);
        if(ulobj.attr("focusIndex") == oldindex){
            ulobj.attr("focusIndex",newIndex);
        }
        
        if(Item.prop("selected") == "true"){
            //选中
            var TreeViewSelectedIndexs = ulobj.data("TreeViewSelectedIndexs");
            for(var k = 0;k<TreeViewSelectedIndexs.length;k++){
                if(TreeViewSelectedIndexs[k] == parseInt(oldindex)){
                    TreeViewSelectedIndexs[k] = newIndex;
                    ulobj.data("TreeViewSelectedIndexs",TreeViewSelectedIndexs);
                    break;
                }
            }
        }
    };
    
    //为选项添加展开图片
    function TreeViewItemAddCollapsePic(DIVObj, TreeOpts,PicString){
        if(!DIVObj.is("[TreeViewType]")){
            return;
        }
        
        //生成脚本
        var PicHtml = "";
        var isNoExpand = DIVObj.is("[TreeViewType='DIVNoExpand']");
        var NoStr = isNoExpand ? "No" : "";
        
        if(TreeOpts.CollapsePicType.Type == "div"){
            //div方式
            PicHtml = "<div TreeViewType='IMG"+NoStr+"Expand' class='"+TreeOpts.CssBefore+"_DIVImg"+NoStr+"Expand "+TreeOpts.CollapsePicType["Class"+PicString]+"'></div>";
        }
        else{
            //img方式
            PicHtml = "<img TreeViewType='IMG"+NoStr+"Expand' src='"+TreeOpts.CollapsePicType.ImgPath+TreeOpts.CollapsePicType["Img"+PicString]+"' class='"+TreeOpts.CssBefore+"_IMG"+NoStr+"Expand' />";
        }
        
        //添加对象
        DIVObj.append(PicHtml);
    };
    
    //判断选项是否同级的最后一个
    function TreeViewItemIsLast(ItemObj){
        if(ItemObj.nextAll("[parentindex='"+ItemObj.attr("parentindex")+"']").length > 0){
            return false;
        }
        else{
            return true;
        }
    };
    
    //为指定的选项设置基础样式，包括添加展开图片，空白图片，选项图片等，同时也控制这些图片是否展示。
    function TreeViewItemSetBaseStyle(ItemObj,isReset, TreeOpts){
        if(!ItemObj.is("[TreeViewType='LIItem']")){
            return;
        }
        
        //获取相应的对象
        var divExpand = ItemObj.children("[TreeViewType='DIVExpand']");
        var divNoExpand = ItemObj.children("[TreeViewType='DIVNoExpand']");
        var divRadio = ItemObj.children("[TreeViewType='DIVRadio']");
        var divCheckbox = ItemObj.children("[TreeViewType='DIVCheckBox']");
        var divImg = ItemObj.children("[TreeViewType='DIVImg']");
        var divText = ItemObj.children("[TreeViewType='DIVText']");
        var ItemOpts = ItemObj.data("TreeViewItemOpts");
        
        //重设的情况
        if(isReset){
            //选项内容
            ItemObj.find("a[TreeViewType='AText']").get(0).innerHTML=ItemOpts.Text;
            
            //选项值
            ItemObj.attr("itemValue",ItemOpts.Value);
            
            //提示信息
            ItemObj.attr("tips",ItemOpts.Tips);
            if(TreeOpts.ShowTips){
                //显示提示
                divRadio.attr("title",ItemOpts.Tips);
                divCheckbox.attr("title",ItemOpts.Tips);
                divImg.attr("title",ItemOpts.Tips);
                divText.attr("title",ItemOpts.Tips);
            }
            else{
                divRadio.removeAttr("title");
                divCheckbox.removeAttr("title");
                divImg.removeAttr("title");
                divText.removeAttr("title");
            }
            
            //清除旧的图片
            divExpand.empty();
            divNoExpand.empty();
            divImg.empty();
            
            if(ItemObj.attr("isTitle") == "false"){  //标题项不进行这部分的处理
                //添加展开图片和非展开空白图片
                if(ItemObj.attr("parentindex") != "0"){
            	    //有父节点
            	    var parentObj = ItemObj.prevAll("[index='"+ItemObj.attr("parentindex")+"']").first();
            	    var parentlevel = parseInt(parentObj.attr("level"));
            	    //父节点的图片列表展开图片列表
                    var parentExpandImgs = parentObj.children("[TreeViewType='DIVExpand']").children(); 

                    //添加展开图片和空白图片
                    for( var j = 0; j < parentlevel ;j++){
                      //空白缩进图片
                      TreeViewItemAddCollapsePic(divNoExpand, TreeOpts,"Null");
                      
                      //展开图片
                      if(j == parentlevel - 1){
                          //是最后一项
                          if(TreeViewItemIsLast(parentObj)){
                              //最底层节点，当前位置为空白
                              TreeViewItemAddCollapsePic(divExpand, TreeOpts,"Null");
                          }
                          else{
                              //非最底层，当前位置为竖线
                              TreeViewItemAddCollapsePic(divExpand, TreeOpts,"Line");
                          }
                      }
                      else{
                          //非最后一项，与父节点的样式一致
                          divExpand.append(parentExpandImgs.get(j).outerHTML);
                      }
                    }
                }
                
                //展开图片，暂时使用Normal图片样式，后面再统一修改
                TreeViewItemAddCollapsePic(divExpand, TreeOpts,"Normal");
            }
            
            //选项图片,暂时用Normal，后面再统一修改
            if(ItemOpts.PicType.Type == "img"){
            	//图片方式
            	divImg.append("<img TreeViewType='IMGPic' class='"+TreeOpts.CssBefore+"_IMGPic' src='"+ItemOpts.PicType.ImgPath+ItemOpts.PicType.ImgNormal+"' />");
            }
            else if(ItemOpts.PicType.Type == "div"){
                //Div方式
                divImg.append("<div TreeViewType='DIVPic' class='"+TreeOpts.CssBefore+"_DIVPic "+ItemOpts.PicType.ClassNormal+"'></div>");
            }
            
            //隐藏所有可隐藏的选项，后面再根据需要显示
            divExpand.css("display","none");
            divNoExpand.css("display","none");
            divRadio.css("display","none");
            divCheckbox.css("display","none");
            divImg.css("display","none");
        }
        
        //根据参数逐一修改样式
        //修改展开图片
        if(ItemObj.attr("isTitle") == "false"){
            //标题项不修改展开图片样式
            TreeViewItemChangeExpandPic(ItemObj,TreeOpts)
        }
        
        //修改选项图片,根据是否展开
        if(ItemObj.attr("isTitle") == "false" && ItemObj.attr("expanded")=="true" && ItemObj.nextAll("[parentindex='"+ItemObj.attr("index")+"']").length > 0){
            //展开状况
            if(ItemOpts.Type == "img"){
            	//图片方式
            	divImg.children().attr("src",ItemOpts.ImgPath+ItemOpts.ImgExpand);
            }
            else if(ItemOpts.Type == "div"){
                //Div方式
                divImg.children().attr("class",TreeOpts.CssBefore+"_DIVPic "+ItemOpts.ClassExpand);
            }
        }
        else{
            ItemObj.attr("expanded","false");
        }
        
        //是否启用
        var enAble = ($(ItemObj.get(0).parentNode).attr("enable") == "true");
        divRadio.children().JFMgrTreeViewEnable(enAble);
        divCheckbox.children().JFMgrTreeViewEnable(enAble);
        
        //选中和非选中样式
        if(TreeOpts.EnableSelectedStyle && ItemObj.prop("selected")=="true"){
            ItemObj.children("[TreeViewType='DIVText']").attr("class",TreeOpts.CssBefore+(enAble?"_DIVText_Selected":"_DIVText_SelectedDisable"));
            ItemObj.children("[TreeViewType='DIVText']").children("[TreeViewType='AText']").attr("class",TreeOpts.CssBefore+(enAble?"_AText_Selected":"_AText_SelectedDisable"));
        }
        else{
            ItemObj.children("[TreeViewType='DIVText']").attr("class",TreeOpts.CssBefore+(enAble?"_DIVText_Normal":"_DIVText_Disable"));
            ItemObj.children("[TreeViewType='DIVText']").children("[TreeViewType='AText']").attr("class",TreeOpts.CssBefore+(enAble?"_AText_Normal":"_AText_Disable"));
        }
        
        //显示、隐藏相应内容
        //展开图片
        if(ItemObj.attr("isTitle") == "false" && TreeOpts.ShowCollapsePic){
            divExpand.css("display","block");
        }
        else{
            divNoExpand.css("display","block");
        }
        
        //单选复选
        if(ItemObj.attr("selectable") == "true"){
            //是否可选
            if(TreeOpts.Type == "radio"){
                divRadio.css("display","block");
            }
            
            if(TreeOpts.Type == "checkbox"){
                divCheckbox.css("display","block");
            }
        }
        
        //选项图片
        if(TreeOpts.ShowItemPic){
            divImg.css("display","block");
        }
        
        //设置对象宽度
        TreeViewItemSetItemWidth(ItemObj);
        
        //判断是否隐藏项
        if(ItemObj.attr("isTitle") == "false"){
            var parentObj = ItemObj.prevAll("[index='"+ItemObj.attr("parentindex")+"']").first();
            if(parentObj.attr("index") == "0" || (parentObj.css("display") != "none" && parentObj.attr("expanded")=="true")){
                ItemObj.css("display","block");
            }
            else{
                ItemObj.css("display","none");
            }
        }
    };
    
    //为指定的选项的当前状态修改展开图片样式
    function TreeViewItemChangeExpandPic(ItemObj,TreeOpts){
        if(ItemObj.attr("isTitle") == "true"){
            //标题项部设置展开图片
            return;
        }
        
    	var picString = "Normal";  //图片样式字符|--
    	if(TreeViewItemIsLast(ItemObj)){
	        //最后一个节点
	        picString = "Bottom"; ////图片样式字符|__
	    }
	    //是否有子节点
	    var expand = "";
    	if(ItemObj.nextAll("[parentindex='"+ItemObj.attr("index")+"']").length > 0){
    	    //有子节点
    	    if(picString == "Normal"){
    	        picString = "";
    	    }
    	    var expand = "Minus";
    	    if(ItemObj.attr("expanded") == "false"){
    	        //展开状态
    	        expand = "Plus";
    	    }
    	}
    	
    	//开始设置图片
    	var setobj = ItemObj.children("[TreeViewType='DIVExpand']").children().last();
    	if(TreeOpts.CollapsePicType.Type == "div"){
    	    //div样式
    	    setobj.attr("class",TreeOpts.CssBefore+"_DIVImgExpand "+TreeOpts.CollapsePicType["Class"+expand+picString]);
    	}
    	else{
    	    //img
    	    setobj.attr("src",TreeOpts.CollapsePicType.ImgPath+TreeOpts.CollapsePicType["Img"+expand+picString]);
    	}
    };
    
    //设定指定选项的Li对象宽度（避免出现换行的情况）
    function TreeViewItemSetItemWidth(ItemObj){
        //将选项的宽度设置为100000px
        ItemObj.css("width","100000px");
        
        var hide = false;
        if(ItemObj.css("display") == "none"){
            hide = true;
            ItemObj.css("display","block");
        }
        
        //计算宽度
        var len = 5;
        var clist = ItemObj.children();
        for(var i = 0;i<clist.length;i++){
            var obj = $(clist.get(i));
            if(obj.css("display") != "none"){
                len += obj.outerWidth(true);
            }
        }
        //设置真实宽度
        ItemObj.css("width",len+"px");
        
        if(hide){
            ItemObj.css("display","none");
        }
    };
    
    //将焦点移到指定对象上
    function TreeViewItemFocusItem(treeObj,ItemIndex){
        var uldom = treeObj.get(0);
        var treeopts = treeObj.data("TreeViewOpts");
        if(!treeopts.EnableFocusStyle){
            //不开启焦点样式
            return;
        }
        
        if(treeObj.attr("enable") == "false"){
            //屏蔽状态
            return;
        }
        
        var CFIndex = parseInt(treeObj.attr("focusIndex"));
        if(CFIndex == ItemIndex){
            //索引一致，无需处理
            return;
        }
        
        //更新当前焦点项的样式
        if(CFIndex >= 0 && CFIndex < uldom.childNodes.length){
            var CurrentItem = $(uldom.childNodes[CFIndex]);
            var divText = CurrentItem.children("[TreeViewType='DIVText']");
            if(CurrentItem.prop("selected") == "true"){
                //选中状态
                divText.attr("class",treeopts.CssBefore + "_DIVText_Selected");
                divText.children().attr("class",treeopts.CssBefore + "_AText_Selected");
            }
            else{
                //非选中状态
                divText.attr("class",treeopts.CssBefore + "_DIVText_Normal");
                divText.children().attr("class",treeopts.CssBefore + "_AText_Normal");
            }
            
            //FocusOut
            if(treeopts.OnItemFoucsOut != null){
                try{
                    treeopts.OnItemFoucsOut(treeObj,CurrentItem);
                }catch(e){;}
            }
        }
        
        //当前选项样式
        if(ItemIndex >= 0 && ItemIndex < uldom.childNodes.length){
            var CurrentItem = $(uldom.childNodes[ItemIndex]);
            var divText = CurrentItem.children("[TreeViewType='DIVText']");
            if(CurrentItem.prop("selected") == "true"){
                //选中状态
                divText.attr("class",treeopts.CssBefore + "_DIVText_SelectedFocus");
                divText.children().attr("class",treeopts.CssBefore + "_AText_SelectedFocus");
            }
            else{
                //非选中状态
                divText.attr("class",treeopts.CssBefore + "_DIVText_Focus");
                divText.children().attr("class",treeopts.CssBefore + "_AText_Focus");
            }
            
            //Focus
            if(treeopts.OnItemFocus != null){
                try{
                    treeopts.OnItemFocus(treeObj,CurrentItem);
                }catch(e){;}
            }
        }
        
        //更新当前选项值
        treeObj.attr("focusIndex",ItemIndex);
    };
    
    //显示或隐藏选项（包含子节点）
    $.fn.TreeViewItemShowHide = function(isShow){
        for(var i = 0;i<this.length;i++){
            var Item = $(this.get(i));
            var Children = Item.nextAll("[parentindex='"+Item.attr("index")+"']");
            if(isShow){
                Item.css("display","block");
                //如果自身是展开的，则显示子节点
                if(Item.attr("expanded") == "true"){
                    Children.TreeViewItemShowHide(true);
                }
            }
            else{
                Item.css("display","none");
                //所有子节点都隐藏
                Children.TreeViewItemShowHide(false);
            }
        }
    };
    
    //设置/获取Radio/CheckBox基础控件的选中和取消选中
    $.fn.TreeViewExtenChecked = function(isChecked){
        if(this.length == 0){
            return;
        }
        
        if(isChecked === undefined){
            //返回是否选中
            return this.get(0).checked;
        }
        else{
            //设置是否选中
            for(var i = 0;i<this.length;i++){
                this.get(i).checked = isChecked;
            }
        }
    };
    
    //设置/获取Radio/CheckBox基础控件的可用和屏蔽
    $.fn.TreeViewExtenEnable = function(isEnable){
        if(this.length == 0){
            return;
        }
        
        if(isEnable === undefined){
            //返回是否屏蔽
            return !this.get(0).disabled;
        }
        else{
            //设置是否可用
            for(var i = 0;i<this.length;i++){
                this.get(i).disabled = !isEnable;
            }
        }
    };
    
    //选中或取消选中选项，在这里不考虑是否可选的标记
    function TreeViewItemSelect(ItemObj,Selected,WithChild){
        var ulobj = $(ItemObj.get(0).parentNode);
        var treeOpts = ulobj.data("TreeViewOpts");
        var selectedindex = ulobj.data("TreeViewSelectedIndexs");
        var enAble = (ulobj.attr("enable") == "true");
        
        if(ItemObj.prop("selected") != Selected.toString()){
            //选中状态不一样，需处理当前节点
            if(Selected){
                //选中状态
                if((treeOpts.Type == "list" || treeOpts.Type == "radio") && (selectedindex.length > 0 && selectedindex[0] != -1)){
                    //将之前的对象设置为正常样式
                    var lastObj = $(ulobj.get(0).childNodes[selectedindex[0]]);
                    if(treeOpts.EnableSelectedStyle){
                        var divText = lastObj.children("[TreeViewType='DIVText']");
                        divText.attr("class",treeOpts.CssBefore+(enAble?"_DIVText_Normal":"_DIVText_Disable"));
                        divText.children("[TreeViewType='AText']").attr("class",treeOpts.CssBefore+(enAble?"_AText_Normal":"_AText_Disable"));
                    }
                    //单选框
                    lastObj.children("[TreeViewType='DIVRadio']").children().JFMgrTreeViewChecked(false);
                    //属性
                    lastObj.prop("selected","false");
                    
                    //取消选中的事件
                    if(treeOpts.OnItemUnChecked != null){
                        try{
                            treeOpts.OnItemUnChecked(ulobj,lastObj);
                        }catch(e){;}
                    }
                }
                
                //选中当前对象，样式
                if(treeOpts.EnableSelectedStyle){
                    ItemObj.children("[TreeViewType='DIVText']").attr("class",treeOpts.CssBefore+(enAble?"_DIVText_Selected":"_DIVText_SelectedDisable"));
                    ItemObj.children("[TreeViewType='DIVText']").children("[TreeViewType='AText']").attr("class",treeOpts.CssBefore+(enAble?"_AText_Selected":"_AText_SelectedDisable"));
                }
                
                //属性
                ItemObj.prop("selected","true");
                
                //更新selectedindex
                if(treeOpts.Type == "list" || treeOpts.Type == "radio"){
                    selectedindex[0] = parseInt(ItemObj.attr("index"));
                    ItemObj.children("[TreeViewType='DIVRadio']").children().JFMgrTreeViewChecked(true);
                }
                else{
                    if(selectedindex[0] == -1){
                        selectedindex[0] = ItemObj.attr("index");
                    }
                    else{
                        selectedindex.push(parseInt(ItemObj.attr("index")));
                    }
                    ItemObj.children("[TreeViewType='DIVCheckBox']").children().JFMgrTreeViewChecked(true);
                }
                
                //选中的事件
                if(treeOpts.OnItemChecked != null){
                    try{
                        treeOpts.OnItemChecked(ulobj,ItemObj);
                    }catch(e){;}
                }
            }
            else{
                //取消选中状态,先更新样式
                if(treeOpts.EnableSelectedStyle){
                    ItemObj.children("[TreeViewType='DIVText']").attr("class",treeOpts.CssBefore+(enAble?"_DIVText_Normal":"_DIVText_Disable"));
                    ItemObj.children("[TreeViewType='DIVText']").children("[TreeViewType='AText']").attr("class",treeOpts.CssBefore+(enAble?"_AText_Normal":"_AText_Disable"));
                }
                //属性
                ItemObj.prop("selected","false");
                
                //更新selectedindex
                if(treeOpts.Type == "list" || treeOpts.Type == "radio"){
                    selectedindex[0] = -1;
                    ItemObj.children("[TreeViewType='DIVRadio']").children().JFMgrTreeViewChecked(false);
                }
                else{
                    ItemObj.children("[TreeViewType='DIVCheckBox']").children().JFMgrTreeViewChecked(false);
                    for(var i = 0;i<selectedindex.length;i++){
                        if(selectedindex[i] == parseInt(ItemObj.attr("index"))){
                            if(i == 0){
                                selectedindex[0] = -1;
                            }
                            else{
                                selectedindex.splice(i,1);
                            }
                        }
                    }
                }
                
                //取消选中的事件
                if(treeOpts.OnItemUnChecked != null){
                    try{
                        treeOpts.OnItemUnChecked(ulobj,ItemObj);
                    }catch(e){;}
                }
            }
        }
        
        //是否处理子节点
        if(WithChild && (treeOpts.Type == "checkbox" || treeOpts.Type == "multiplelist")){
            var childs = ItemObj.nextAll("[parentindex='"+ItemObj.attr("index")+"']");
            for(var i = 0;i<childs.length;i++){
                TreeViewItemSelect($(childs.get(i)),Selected,WithChild);
            }
        }
    };
    
    //点击选项所执行的函数
    function TreeViewItemClickFun(ItemObj){
        var ulobj = $(ItemObj.get(0).parentNode);
        if(ulobj.attr("enable") == "false"){
            //屏蔽状态
            return;
        }
        
        var treeOpts = ulobj.data("TreeViewOpts");
        
        if(ItemObj.attr("selectable") == "false"){
            //不可选中
            if(ItemObj.nextAll("[parentindex='"+ItemObj.attr("index")+"']").length > 0){
                //做展开的事件
                ItemObj.TreeViewItemExpand();
            }
        }
        else{
            //可选中或取消选中
            if((treeOpts.Type == "list" || treeOpts.Type == "radio") && ItemObj.prop("selected") == "true" && !treeOpts.ClickCancle){
                //单选，不可取消选中
                return;
            }
            
            TreeViewItemSelect(ItemObj,ItemObj.prop("selected") == "false",treeOpts.ClickWithChild);
        }
        
        //执行click事件
        if(treeOpts.OnItemClick != null){
            try{
                treeOpts.OnItemClick(ulobj,ItemObj);
            }catch(e){;}
        }
    };
    
})(jQuery);