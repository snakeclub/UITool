/*-----------------------
JQuery-UITool v1.0.0
完成时间：2011-
作者：黎慧剑
联系方式:snakeclub@163.com
程序说明：基于JQuery框架的Web界面便捷工具,基于该工具，可以通过简单的函数调用实现各类Web界面效果，简化Web开发

当前控件：ShadowTool
说明：阴影工具,对指定对象添加阴影特效
文件：ShadowTool.js
依赖文件：jquery-1.6.4.min.js
-----------------------*/

/*-----------------------
==ShadowTool ==
说明：阴影工具,对指定对象添加阴影特效
-----------------------*/
jQuery.fn.extend({
  /*
  --AddOuterShadow--
  添加外部阴影特效（建议采用外部阴影的对象设置合适的z-index样式以保证阴影层级关系正确）
  */
  AddOuterShadow : function(opts) {
      //处理参数
      var DefaultOpts = {
            //阴影对象的id，如果为""则会默认创建一个唯一id
            shadowid : "",
            
            //阴影透明度，默认为50（％）
            opacity : 50,
            
            //阴影颜色，默认为#000000
            color : "#000000",
            
            //光源X,Y方向的偏移（单位为象素），负数代表向左上偏移，阴影在右下方；正数代表向右下偏移，阴影在左上边。默认为-5
            offset : {X:-5,Y:-5},
            
            //X,Y方向的阴影扩展，用于控制阴影的宽高度，例如1代表阴影宽高度比对象大小大1，默认为0
            extend : {X:0,Y:0},
            
            //阴影的Css类
            cssClass : "",
            
            //添加阴影后执行的事件,传入的参数依次为要要添加阴影的对象，阴影对象
            afterAddShadow : null,
            
            //清除阴影前执行的事件,传入的参数依次为要要添加阴影的对象，阴影对象
            beforeClearShadow : null
        };
      opts = $.extend({}, DefaultOpts, opts || {});
      opts.offset = $.extend({}, DefaultOpts.offset, opts.offset || {});
      opts.extend = $.extend({}, DefaultOpts.extend, opts.extend || {});
  
      //循环对对象进行阴影的处理
      for(var i=0;i<this.length;i++){
         var obj = $(this.get(i));
         //检验是否绝对定位，否则不处理
         if(obj.css("position") == "static" || obj.css("position") == "relative"){
            continue;
         }
         //检验是否有x方向和y方向的位置信息，如果没有，也不处理
         if((obj.css("left") == "auto" && obj.css("right") == "auto") || (obj.css("top") == "auto" && obj.css("bottom") == "auto")){
            continue;
         }
         
         //获得与对象相关的参数start
         var zindex = parseInt(obj.css("z-index"))-1;
         if(isNaN(zindex)){
            zindex = -1;
         }
         
         //id
         var autoid = 0;
         var newshadowid;
         if(opts.shadowid == ""){
            //对象Shadow_autoid
            newshadowid = "Shadow_"+autoid;
         }
         else{
            newshadowid = opts.shadowid;
         }
         while(obj.siblings("#"+newshadowid).length > 0){
            //同级中存在相同id的影子id
            autoid++;
            newshadowid = "Shadow_"+autoid;
         }
         
         //大小和位置
         var width = obj.outerWidth() + opts.extend.X;
         var height = obj.outerHeight() + opts.extend.Y;
         var tempi = parseInt(obj.css("margin-left").slice(0,-2));
         var addOffsetX = (isNaN(tempi)?0:tempi)-Math.ceil(opts.extend.X/2);
         tempi = parseInt(obj.css("margin-top").slice(0,-2));
         var addOffsetY = (isNaN(tempi)?0:tempi)-Math.ceil(opts.extend.Y/2);
         var xpos = (obj.css("left") == "auto" ? "right:"+(parseInt(obj.css("right").slice(0,-2))+opts.offset.X+addOffsetX) : "left:"+(parseInt(obj.css("left").slice(0,-2))-opts.offset.X+addOffsetX)) + "px;";
         var ypos = (obj.css("top") == "auto" ? "bottom:"+(parseInt(obj.css("bottom").slice(0,-2))+opts.offset.Y+addOffsetY) : "top:"+(parseInt(obj.css("top").slice(0,-2))-opts.offset.Y+addOffsetY)) + "px;";
         //获得与对象相关的参数end
         
         //设置对象的shadow属性
         var slist = obj.attr("shadowid");
         if(slist===undefined){
            slist = newshadowid;
         }else{
            slist+=","+newshadowid;
         }
         obj.attr("shadowid",slist);
         
         //创建对象
         var html = "<div id='"+newshadowid+"' selftype='Shadow_Div' style='font-size:0px; margin:0px; padding:0px; position:"+obj.css("position")+"; width:"+width+"px; height:"+height+"px; z-index:"+zindex+"; opacity:"+(opts.opacity/100)+"; filter: alpha(opacity="+opts.opacity+"); background-color:"+opts.color+"; "+xpos+ypos+"'"+(opts.cssClass==""?"":"class='"+opts.cssClass+"'")+"></div>";
         
         $(obj.get(0).parentNode).append(html);
         var shadowobj = $(obj.get(0).parentNode).children("#"+newshadowid+"[selftype='Shadow_Div']");
         
         //绑定清除前要执行的事件
         shadowobj.data("beforeClearShadow",opts.beforeClearShadow);
         
         //执行函数
         if(opts.afterAddShadow != null){
            try{
                opts.afterAddShadow(obj,shadowobj);
            }catch(e){;}
         }
      }
  },
  
  /*
  --AddInnerShadow--
  添加内部阴影特效（类似光线从四面八方照在边框上产生的阴影）
  */
  AddInnerShadow : function(opts) {
      //处理参数
      var DefaultOpts = {
            //阴影对象的id，如果为""则会默认创建一个唯一id
            shadowid : "",
            
            //阴影透明度，默认为50（％）
            opacity : 50,
            
            //阴影颜色，默认为#000000
            color : {left:"#000000",top:"#000000",right:"#000000",bottom:"#000000"},
            
            //光源X,Y方向的偏移（单位为象素），负数代表向左上偏移，阴影在右下方；正数代表向右下偏移，阴影在左上边。默认为-5
            offset : {X:0,Y:0},
            
            //阴影向4个方向的扩展，正数代表向外扩展，负数代表向内扩展，数值为阴影宽度，默认为left:0,top:0,right:5,bottom:5
            extend : {left:0,top:0,right:5,bottom:5},
            
            //阴影的Css类
            cssClass : "",
            
            //添加阴影后执行的事件,传入的参数依次为要要添加阴影的对象，阴影对象
            afterAddShadow : null,
            
            //清除阴影前执行的事件,传入的参数依次为要要添加阴影的对象，阴影对象
            beforeClearShadow : null
        };
      opts = $.extend({}, DefaultOpts, opts || {});
      opts.color = $.extend({}, DefaultOpts.color, opts.color || {});
      opts.offset = $.extend({}, DefaultOpts.offset, opts.offset || {});
      opts.extend = $.extend({}, DefaultOpts.extend, opts.extend || {});
      
      //循环对对象进行阴影的处理
      for(var i=0;i<this.length;i++){
         var obj = $(this.get(i));
         
         //检验是否绝对定位，否则不处理
         if(obj.css("position") == "static" || obj.css("position") == "relative"){
            continue;
         }
         //检验是否有x方向和y方向的位置信息，如果没有，也不处理
         if((obj.css("left") == "auto" && obj.css("right") == "auto") || (obj.css("top") == "auto" && obj.css("bottom") == "auto")){
            continue;
         }
         
         //获得与对象相关的参数start
         var zindex = parseInt(obj.css("z-index"))+1;
         
         //id
         var autoid = 0;
         var newshadowid;
         if(opts.shadowid == ""){
            //对象Shadow_autoid
            newshadowid = "Shadow_"+autoid;
         }
         else{
            newshadowid = opts.shadowid;
         }
         while(obj.siblings("#"+newshadowid).length > 0){
            //同级中存在相同id的影子id
            autoid++;
            newshadowid = "Shadow_"+autoid;
         }
         
         //大小和位置
         var width = obj.outerWidth() + (opts.extend.left > 0? 0 : opts.extend.left) + (opts.extend.right > 0? 0 : opts.extend.right);
         var height = obj.outerHeight() + (opts.extend.top > 0? 0 : opts.extend.top) + (opts.extend.bottom > 0? 0 : opts.extend.bottom);
         var tempi = parseInt(obj.css("margin-left").slice(0,-2));
         var addOffsetX = (isNaN(tempi)?0:tempi) - (opts.extend.left>0?opts.extend.left:0);
         tempi = parseInt(obj.css("margin-top").slice(0,-2));
         var addOffsetY = (isNaN(tempi)?0:tempi)-(opts.extend.top>0?opts.extend.top:0);
         var xpos = (obj.css("left") == "auto" ? "right:"+(parseInt(obj.css("right").slice(0,-2))-opts.offset.X+addOffsetX) : "left:"+(parseInt(obj.css("left").slice(0,-2))+opts.offset.X+addOffsetX)) + "px;";
         var ypos = (obj.css("top") == "auto" ? "bottom:"+(parseInt(obj.css("bottom").slice(0,-2))-opts.offset.Y+addOffsetY) : "top:"+(parseInt(obj.css("top").slice(0,-2))+opts.offset.Y+addOffsetY)) + "px;";
         
         //获得与对象相关的参数end
         
         //设置对象的shadow属性
         var slist = obj.attr("shadowid");
         if(slist===undefined){
            slist = newshadowid;
         }else{
            slist+=","+newshadowid;
         }
         obj.attr("shadowid",slist);
         
         //创建对象,注意顺序为上右下左
         var html = "<div id='"+newshadowid+"' selftype='Shadow_Div' style='font-size:0px; margin:0px; padding:0px; position:absolute; background-color:Transparent; border-style: solid; border-width: "+Math.abs(opts.extend.top)+"px "+Math.abs(opts.extend.right)+"px "+Math.abs(opts.extend.bottom)+"px "+Math.abs(opts.extend.left)+"px; border-color: "+opts.color.top+" "+opts.color.right+" "+opts.color.bottom+" "+opts.color.left+"; width:"+width+"px; height:"+height+"px; z-index:"+zindex+"; opacity:"+(opts.opacity/100)+"; filter: alpha(opacity="+opts.opacity+"); "+xpos+ypos+"'"+(opts.cssClass==""?"":" class='"+opts.cssClass+"'")+"></div>";
         
         $(obj.get(0).parentNode).append(html);
         var shadowobj = $(obj.get(0).parentNode).children("#"+newshadowid+"[selftype='Shadow_Div']");
         
         //绑定清除前要执行的事件
         shadowobj.data("beforeClearShadow",opts.beforeClearShadow);
         
         //执行函数
         if(opts.afterAddShadow != null){
            try{
                opts.afterAddShadow(obj,shadowobj);
            }catch(e){;}
         }
      }  
   },
   
   /*
  --ClearShadow--
  清除阴影特效
  */
  ClearShadow : function(shadowid) {
      for(var i=0;i<this.length;i++){
          var obj = $(this.get(i));
          var attrshadowid = obj.attr("shadowid");
          if(attrshadowid===undefined){
              //没有设置阴影
              continue;
          }
          var sdlist = attrshadowid.split(",");
          
          if(typeof shadowid !=  "string"  || shadowid == ""){
            //清除所有的阴影
            for(var j = 0;j<sdlist.length;j++){
                //执行清除前事件
                var shadowobj = $(obj.get(0).parentNode).children("#"+sdlist[j]+"[selftype='Shadow_Div']");
                try{
                    shadowobj.data("beforeClearShadow")(obj,shadowobj);
                }catch(e){;}
                //清除
                shadowobj.remove();
            }
            //清除attr属性
            obj.removeAttr("shadowid");
          }
          else{
            //清除指定阴影
            for(var j = 0;j<sdlist.length;j++){
                if(shadowid == sdlist[j]){
                    //执行清除前事件
                    var shadowobj = $(obj.get(0).parentNode).children("#"+sdlist[j]+"[selftype='Shadow_Div']");
                    try{
                        shadowobj.data("beforeClearShadow")(obj,shadowobj);
                    }catch(e){;}
                    shadowobj.remove();
                    var newidlist = ","+attrshadowid+",";
                    newidlist = newidlist.replace(sdlist[j]+",","").trim(",");
                    if(newidlist.length == 0){
                        obj.removeAttr("shadowid");
                    }
                    else{
                        obj.attr("shadowid",newidlist);
                    }
                    break;
                }
            }
          }
      }
  },
  
  /*
  --GetShadows--
  获得该对象的阴影对象，该函数目的是供调用者进行drag等动作效果处理
  */
  GetShadows : function(shadowid) {
          var obj = $(this.get(0));
          var attrshadowid = obj.attr("shadowid");
          var shadows = $("");
          if(attrshadowid===undefined){
              //没有设置阴影
              return shadows;
          }
          var sdlist = attrshadowid.split(",");
          
          if(typeof shadowid !=  "string" || shadowid == ""){
            //获得所有的阴影
            for(var j = 0;j<sdlist.length;j++){
                var shadowobj = $(obj.get(0).parentNode).children("#"+sdlist[j]+"[selftype='Shadow_Div']");
                shadows = shadows.add(shadowobj);
            }
            return shadows;
          }
          else{
            //获取指定阴影
            for(var j = 0;j<sdlist.length;j++){
                if(shadowid == sdlist[j]){
                    return $(obj.get(0).parentNode).children("#"+sdlist[j]+"[selftype='Shadow_Div']");
                }
            }
          }
          
          return shadows;
  }
});

