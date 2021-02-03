using System;
using System.Collections;
using System.Data;
using System.Web;
using System.Web.Services;
using System.Web.Services.Protocols;
using JSON;

namespace UITool.test.Ajax
{
    /// <summary>
    /// $codebehindclassname$ 的摘要说明
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    public class AjaxServer : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            //基本的客户端信息
            string clientip = context.Request.UserHostAddress; //客户端的ip
            string clientDnsName = context.Request.UserHostName; //客户端的Dns名
            string refHostName = context.Request.UrlReferrer.Host;//引用页的域名
            string refpagePath = context.Request.UrlReferrer.AbsolutePath; //引用页的绝对路径


            JSONObject SendPara = JSONParse.toJSONObject(context.Request.Form[0]);
            AjaxRespone Res = new AjaxRespone();
            string JSONDataStr = "";
            if (SendPara["IsEncode"].ValueString == "true")
            {
                //需要解密
                JSONDataStr = Crypto.Crypto.DESDecrypt(SendPara["Data"].ValueString, "DESkey",true);
                Res.IsEncode = true;
            }
            else
            {
                JSONDataStr = JSONParse.JSStrToCSharpStr(SendPara["Data"].ValueString);
            }
            JSONObject Data = JSONParse.toJSONObject(JSONDataStr);

            object ResData = null;
            switch (Data["FunName"].ValueString)
            {
                case "SendText":
                    ResData = "返回的内容\"!";
                    break;
                case "SendObject":
                    ResData = new ReturnObject();
                    break;
                default :
                    return;
            }

            //生成串
            if (Res.IsEncode)
            {
                //加密
                Res.Data = Crypto.Crypto.DESEncrypt(JSONParse.GetJSONValue(ResData).ToString(), "DESkey", true);
            }
            else
            {
                Res.Data = JSONParse.GetJSONValue(ResData).ToString();
            }
            

            context.Response.ContentType = "text/plain";
            context.Response.Write(JSONParse.ToJSONString(Res));
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }

    /// <summary>
    /// 反馈封装类
    /// </summary>
    public class AjaxRespone
    {
        public AjaxRespone()
        {
        }

        public bool IsEncode = false;
        public string EncodeName = "";
        public bool WithKey = false;
        public string EncodeKey = "";
        public string EncodePara = "";
        public string Data = "";
    }

    public class ReturnObject
    {
        public ReturnObject()
        {
        }

        public bool boolVal = false;
        public string StrVal = "String";
        public int IntVal = 100;
    }

}
