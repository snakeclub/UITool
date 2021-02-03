/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：DataCollectTool
说明：从页面获取数据的便捷工具，用于组织页面数据向服务器提交
文件：DataCollectTool.js
依赖文件：jquery-1.6.4.min.js
-----------------------*/

/*-----------------------
==DataCollectTool=
从页面获取数据的便捷工具，用于组织页面数据向服务器提交
-----------------------*/
$.extend({
    /*
    --DataCollect--
    $.DataCollect([parentNodeID])
        从指定的父节点(包含自身)开始获取带有传值标记的对象的信息，组成一个数组对象并返回
        [parentNodeID] : 开始的父节点，默认为空，代表全部节点
    */
　　DataCollect:function (){
　　    var parentNodeID = "";
　　    if(arguments.length > 0){
　　        parentNodeID = arguments[0];
　　    }
　　    
　　    //查找符合条件的元素
　　    var datalist = null;
　　    if(parentNodeID.length > 0){
　　        var self = $("#"+parentNodeID);
　　        if(self.attr("collectable") == "true"){
　　            datalist = $("#"+parentNodeID).find("[collectable='true']").andSelf();
　　        }
　　        else{
　　            datalist = $("#"+parentNodeID).find("[collectable='true']");
　　        }
　　    }
　　    else{
　　        //全局范围
　　        datalist = $("[collectable='true']");
　　    }
　　    
　　    var Collection = new Array(0);
　　    if(datalist.length == 0){
　　        //没有对象合适
　　        return Collection;
　　    }
　　    
　　    //开始逐个组织对象信息start
　　    for(var i = 0;i<datalist.length;i++){
　　        var tempObj = $(datalist.get(i));
　　        var tempInfo = new Object();
　　        
　　        if(tempObj.attr("selftype") !== undefined){
　　            //自有类型
　　            tempInfo.selfType = true;  //是否自有类型
　　            tempInfo.nodeName = tempObj.attr("selftype");
　　            tempInfo.type = ""; //小类型
　　        }
　　        else{
　　            //一般类型
　　            tempInfo.selfType = false;
　　            tempInfo.nodeName = tempObj.get(0).nodeName;  //元素类型
　　            try{
　　                tempInfo.type = tempObj.get(0).type;
　　            }catch(e){tempInfo.type = "";}
　　        }
　　        
　　        //元素ID
　　        if(tempObj.attr("id") !== undefined){
　　            tempInfo.id = tempObj.attr("id");
　　        }
　　        else{
　　            tempInfo.id = "";
　　        }
　　        
　　        //以下为获取不同元素值的代码start
　　        if(tempInfo.selfType){
　　            //自有类型，特殊处理start
　　            switch(tempInfo.nodeName){
　　                case "treelistview":
　　                    tempInfo.value = tempObj.TreeListViewGetSelectedItems();
　　                    break;
　　                case "dropdownlist":
　　                    tempInfo.value = tempObj.DropDownListGetSelectedItems();
　　                    break;
　　                default :
　　                    tempInfo.value = null;
　　                    break;
　　            }
　　            //自有类型，特殊处理end
　　        }
　　        else{
　　            //一般类型处理start
　　            switch(tempInfo.nodeName){
　　                case "INPUT":
　　                    tempInfo.value = tempObj.get(0).value;
　　                    switch(tempInfo.type){
　　                        case "checkbox":
　　                        case "radio":
　　                            tempInfo.checked = tempObj.get(0).checked;
　　                            break;
　　                        default :
　　                            break;
　　                    }
　　                    break;
　　                case "OPTION":
　　                    tempInfo.value = tempObj.get(0).value;
　　                    tempInfo.text = tempObj.get(0).text;
　　                    tempInfo.selected = tempObj.get(0).selected;
　　                    break;
　　                case "SELECT":
　　                    //第一个选择的选项，包括单选
　　                    tempInfo.selectedIndex = tempObj.get(0).selectedIndex;
　　                    if(tempInfo.selectedIndex == -1){
　　                        tempInfo.selectedText = "";
　　                        tempInfo.selectedValue = "";
　　                    }
　　                    else{
　　                        tempInfo.selectedText = tempObj.get(0).options[tempObj.get(0).selectedIndex].text;
　　                        tempInfo.selectedValue = tempObj.get(0).options[tempObj.get(0).selectedIndex].value;
　　                    }
　　                    //对于type为"select-multiple"的情况兼容
　　                    tempInfo.selectedOptions = new Array(0);
　　                    for(var oindex = 0;oindex < tempObj.get(0).options.length; oindex++){
　　                        if(tempObj.get(0).options[oindex].selected){
　　                            var tempop = new Object();
　　                            tempop.value = tempObj.get(0).options[oindex].value;
　　                            tempop.text = tempObj.get(0).options[oindex].text;
　　                            tempInfo.selectedOptions.push(tempop);
　　                        }
　　                    }
　　                    break;
　　                case "TABLE":
　　                case "TBODY":
　　                    tempInfo.value = new Array(0);
　　                    var Rows = tempObj.get(0).rows;
　　                    for(var rowindex = 0;rowindex<Rows.length;rowindex++){
　　                        var Cells = new Array(0);
　　                        for(var cellindex = 0;cellindex < Rows[rowindex].cells.length;cellindex++){
　　                            //获得节点值(没有子节点就获取内容值，有子节点就获取第一个子节点的值)
　　                            var cellvalue = "";
　　                            if($(Rows[rowindex].cells[cellindex]).children().length == 0){
　　                                //没有子节点，直接拿文字就可以了
　　                                cellvalue = Rows[rowindex].cells[cellindex].innerHTML;
　　                            }
　　                            else{
　　                                var firstChild = Rows[rowindex].cells[cellindex].firstChild;
　　                                switch(firstChild.nodeName){
　　                                    case "#text":
　　                                        //文本节点
　　                                        cellvalue = firstChild.nodeValue;
　　                                        break;
　　                                    case "INPUT":
　　                                        switch(firstChild.type){
　　                                            case "checkbox":
　　                                            case "radio":
　　                                                cellvalue = firstChild.checked;
　　                                                break;
　　                                            default :
　　                                                cellvalue = firstChild.value;
　　                                                break;
　　                                        }
　　                                        break;
　　                                    case "SELECT":
　　                                        cellvalue = firstChild.selectedIndex == -1 ? "" : firstChild.options[firstChild.selectedIndex].value;
　　                                        break;
　　                                    default :
　　                                        try{cellvalue=firstChild.value;}catch(e){;}
　　                                        break;
　　                                }
　　                            }
　　                            Cells.push(cellvalue);
　　                        }
　　                        tempInfo.value.push(Cells);
　　                    }
　　                    break;
　　                case "TR" :
　　                    var Cells = new Array(0);
                        for(var cellindex = 0;cellindex < tempObj.get(0).cells.length;cellindex++){
                            //获得节点值(没有子节点就获取内容值，有子节点就获取第一个子节点的值)
                            var cellvalue = "";
                            if($(tempObj.get(0).cells[cellindex]).children().length == 0){
                                //没有子节点，直接拿文字就可以了
                                cellvalue = tempObj.get(0).cells[cellindex].innerHTML;
                            }
                            else{
                                var firstChild = tempObj.get(0).cells[cellindex].firstChild;
                                switch(firstChild.nodeName){
                                    case "#text":
　　                                        //文本节点
　　                                        cellvalue = firstChild.nodeValue;
　　                                        break;
                                    case "INPUT":
                                        switch(firstChild.type){
                                            case "checkbox":
                                            case "radio":
                                                cellvalue = firstChild.checked;
                                                break;
                                            default :
                                                cellvalue = firstChild.value;
                                                break;
                                        }
                                        break;
                                    case "SELECT":
                                        cellvalue = firstChild.selectedIndex == -1 ? "" : firstChild.options[firstChild.selectedIndex].value;
                                        break;
                                    default :
                                        try{cellvalue=firstChild.value;}catch(e){;}
                                        break;
                                }
                            }
                            Cells.push(cellvalue);
                        }
                        tempInfo.value = Cells;
　　                    break;
　　                case "TD":
　　                    var cellvalue = "";
                        if(tempObj.children().length == 0){
                            //没有子节点，直接拿文字就可以了
                            cellvalue = tempObj.get(0).innerHTML;
                        }
                        else{
                            var firstChild = tempObj.get(0).firstChild;
                            switch(firstChild.nodeName){
                                case "#text":
　　                                        //文本节点
　　                                        cellvalue = firstChild.nodeValue;
　　                                        break;
                                case "INPUT":
                                    switch(firstChild.type){
                                        case "checkbox":
                                        case "radio":
                                            cellvalue = firstChild.checked;
                                            break;
                                        default :
                                            cellvalue = firstChild.value;
                                            break;
                                    }
                                    break;
                                case "SELECT":
                                    cellvalue = firstChild.selectedIndex == -1 ? "" : firstChild.options[firstChild.selectedIndex].value;
                                    break;
                                default :
                                    try{cellvalue=firstChild.value;}catch(e){;}
                                    break;
                            }
                        }
                        tempInfo.value = cellvalue;
　　                    break;
　　                default :
　　                    try{tempInfo.value = tempObj.get(0).value;}catch(e){tempInfo.value="";}
　　                    break;
　　            }
　　            //一般类型处理end
　　        }
　　        //以下为获取不同元素值的代码end
　　        Collection.push(tempInfo);
　　    }
　　    //开始逐个组织对象信息end
　　    
　　    //返回最终的结果
　　    return Collection;
　　},
　　
　　/*
    --SetCollectTag--
    $.SetCollectTag(JList,[withChildren],[addSelf])
        设定需获取数据的标记(将对象的collectable属性设置为true)
        JList : 要设置的jquery对象列表，例如$("#id")
        [withChildren] : 对子孙节点是否设置标签，默认为false
        [addSelf] : 包含自身，默认为true
    */
　　SetCollectTag:function (JList){
　　    //获取和设置参数start
　　    var withChildren = false;
　　    var addSelf = true;
　　    if(arguments.length > 1){
　　        withChildren = arguments[1];
　　    }
　　    if(arguments.length > 2){
　　        addSelf = arguments[2];
　　    }
　　    //获取和设置参数end
　　    
　　    //循环处理对象start
　　    for(var i = 0; i<JList.length;i++){
　　        tempObj = $(JList.get(i));
　　        //设置自身是否采集
　　        if(addSelf){
　　            tempObj.attr("collectable","true");
　　            switch(tempObj.get(0).nodeName){
　　                    case "SELECT":
　　                    case "TR":
　　                    case "TD":
　　                    case "TABLE":
　　                    case "TBODY":
　　                        //这类对象选择了自身后，不再处理子节点
　　                        continue;
　　                    default :
　　                        break;
　　            }
　　        }
　　        
　　        if(tempObj.attr("selftype") !== undefined){
　　            //自有类型，不处理子节点
　　            continue;
　　        }
　　        
　　        if(withChildren){
　　            var tempChildren = tempObj.children();
　　            for(var j=0;j<tempChildren.length;j++){
　　                //用递归方式处理
　　                $.SetCollectTag($(tempChildren.get(j)),withChildren,true);
　　            }
　　        }
　　    }
　　    //循环处理对象end
　　},
　　
　　/*
    --ClearCollectTag--
    $.ClearCollectTag(JList,[withChildren])
        清除需获取数据的标记(将对象的collectable属性设置为"")
        JList : 要设置的jquery对象列表，例如$("#id")
        [withChildren] : 对子孙节点是否清除标签，默认为true
    */
　　ClearCollectTag:function (JList){
　　    withChildren = true;
　　    if(arguments.length > 1){
　　        withChildren = arguments[1];
　　    }
　　    
　　    //循环清除对象采集标签
　　    for(var i = 0; i<JList.length;i++){
　　        tempObj = $(JList.get(i));
　　        tempObj.removeAttr("collectable");
　　        if(withChildren){
　　            tempObj.find("[collectable='true']").removeAttr("collectable");
　　        }
　　    }
　　}
});

