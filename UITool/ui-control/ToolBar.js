/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：ToolBar
说明：工具栏
文件：ToolBar.js
依赖文件：jquery-1.6.4.min.js
          BarScrollDiv.js
          
          
资源文件：ToolBarCss/ToolBar.css
          
          
-----------------------*/
;(function($) {
    //默认创建参数
    $.ToolBar = new Object();
    $.ToolBar.defaults = {
        //样式前缀
        CssBefore : "ToolBar",
        
        //工具栏宽度,可以为百分比，也可以象素
        Width: "100%",
        
        //是否包含在滚动容器中
        InScrollDiv : true,
        
        //滚动容器的样式前缀
        ScrollDivCssBefore : "BarScrollDiv",
        
        //滚动容器的宽度
        ScrollDivWidth : "100%",
        
        //滚动容器滚动每一下的距离，单位为px
        ScrollDivScrollStep : 2
    };
    
    //在指定对象下创建一个ToolBar控件
    $.fn.CreateToolBar = function(id,opts){
        //获取参数
        opts = $.extend({}, $.ToolBar.defaults, opts || {});
        
        //循环对每个对象进行处理
        for(var i = 0;i<this.length;i++){
            var parentobj = $(this.get(i));
            
            //是否自定义id
            var tempid = id;
            if(tempid === undefined || tempid==""){
                var autoidnum = 0;
                while(true){
                    if($("#ToolBar_"+autoidnum).length > 0){
                        autoidnum++;
                    }
                    else{
                        tempid = "ToolBar_"+autoidnum;
                        break;
                    }
                }
            }
            
            //创建对象
            var HTML = "<TABLE id='"+tempid+"' selftype='ToolBar' class='"+opts.CssBefore+"_Main' style='width:"+opts.Width+";' border=0 cellSpacing=0 cellPadding=0> \
		                        <TR> \
			                        <TD ToolBarType='CenterTd' class='"+opts.CssBefore+"_CenterTd'>&nbsp;</TD> \
		                        </TR> \
	                        </TABLE>";
            
            parentobj.append(HTML);
            var obj = parentobj.children("#"+tempid).last();
            
            //绑定参数
            obj.data("ToolBarOpts",opts);
            
            //是否绑定容器
            if(opts.InScrollDiv){
                obj.WrapBarScrollDiv("",{
                    //样式前缀
                    CssBefore : opts.ScrollDivCssBefore,
                    
                    //容器宽度,可以为象素值，也可以为百分比，也可以为auto
                    Width : opts.ScrollDivWidth,
                    
                    //滚动每一下的距离，单位为px
                    ScrollStep : opts.ScrollDivScrollStep
                });
            }
        }
    };
    
    //根据JQueryStr获得格子对象
    $.fn.GetToolBarDiv = function(JQueryStr){
        var obj = $(this.get(0));
        if(obj.attr("selftype") != "ToolBar"){
            return $("");
        }
        
        return $(obj.get(0).rows[0]).children(JQueryStr);
    };
    
    //创建一个格子并返回对象，便于调用者在里面创建对象
    $.fn.CreateToolBarDiv = function(DivId,LeftRight,BaseTdObj,HTMLString){
        var obj = $(this.get(0));
        if(obj.attr("selftype") != "ToolBar"){
            return $("");
        }
        
        //是否自定义id
        var tempid = DivId;
        if(tempid === undefined || tempid == ""){
            var autoidnum = 0;
            while(true){
                if($("#ToolBarDiv_"+autoidnum).length > 0){
                    autoidnum++;
                }
                else{
                    tempid = "ToolBarDiv_"+autoidnum;
                    break;
                }
            }
        }
        
        //左边还是右边
        if(LeftRight === undefined){
            LeftRight = "Left";
        }
        
        //基于的对象
        if(BaseTdObj === undefined || BaseTdObj == null){
            BaseTdObj = obj.find("td[ToolBarType='CenterTd']").first();
        }
        
        var HTML = "<TD id='"+tempid+"'>"+(HTMLString===undefined?"":HTMLString)+"</TD>";

        if(LeftRight == "Left"){
            BaseTdObj.before(HTML);
            return BaseTdObj.prev();
        }
        else{
            BaseTdObj.after(HTML);
            return BaseTdObj.next();
        }
    };
    
    //创建一个分隔符，返回分隔符的td对象
    $.fn.CreateToolBarSplit = function(DivId,LeftRight,BaseTdObj){
        var obj = $(this.get(0));
        var opts = obj.data("ToolBarOpts");
        return obj.CreateToolBarDiv(DivId,LeftRight,BaseTdObj,"<SPAN class='"+opts.CssBefore+"_Split'></SPAN>");
    };
    
})(jQuery);