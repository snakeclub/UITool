using System;
using System.Collections.Generic;
using System.Text;
using System.Reflection;
using System.Text.RegularExpressions;


namespace JSON
{
    /// <summary>
    /// JSON操作类
    /// </summary>
    public static class JSONParse
    {
        #region 辅助函数
        public static string JSStrToCSharpStr(string JSStr)
        {
            string retStr = "";
            int length = 0;
            while (length < JSStr.Length)
            {
                if (JSStr[length] == '\\')
                {
                    //取转义符后面的字母
                    retStr += JSStr[length+1];
                    length += 2;
                }
                else
                {
                    retStr += JSStr[length];
                    length++;
                }
            }
            return retStr;
        }
        #endregion 辅助函数

        #region 将C#对象生成JSON串

        #region 将C#对象转换为JSONValue
        public static JSONValue GetJSONValue(object objValue)
        {
            JSONValue jsonValue = null;
            if (objValue == null)
            {
                //空对象进来
                return new JSONNullValue();
            }

            Type thisType = objValue.GetType();
            if (thisType == typeof(System.Int32))
            {
                jsonValue = new JSONNumberValue(Convert.ToInt32(objValue));
            }
            else if (thisType == typeof(System.Single))
            {
                jsonValue = new JSONNumberValue(Convert.ToSingle(objValue));
            }
            else if (thisType == typeof(System.Double))
            {
                jsonValue = new JSONNumberValue(Convert.ToDouble(objValue));
            }
            else if (thisType == typeof(System.Decimal))
            {
                jsonValue = new JSONNumberValue(Convert.ToDecimal(objValue));
            }
            else if (thisType == typeof(System.Byte))
            {
                jsonValue = new JSONNumberValue(Convert.ToByte(objValue));
            }
            else if (thisType == typeof(System.String))
            {
                jsonValue = new JSONStringValue(Convert.ToString(objValue));
            }
            else if (thisType == typeof(System.Boolean))
            {
                jsonValue = new JSONBoolValue(Convert.ToBoolean(objValue));
            }
            else if (thisType.BaseType == typeof(System.Enum))
            {
                jsonValue = new JSONStringValue(Enum.GetName(thisType, objValue));
            }
            else if (thisType.IsArray)
            {
                List<JSONValue> jsonValues = new List<JSONValue>();
                Array arrValue = (Array)objValue;
                for (int x = 0; x < arrValue.Length; x++)
                {
                    JSONValue jsValue = GetJSONValue(arrValue.GetValue(x));
                    jsonValues.Add(jsValue);
                }
                jsonValue = new JSONArray(jsonValues);
            }
            else if(thisType == typeof(System.Data.DataTable))
            {
                //数据表的格式
                System.Data.DataTable dt = new System.Data.DataTable();
                
            }
            else
            {
                //其他的数据类型，尝试转换为JSONObject
                jsonValue = ObjectToJSONObject(objValue);
            }
            return jsonValue;
        }
        #endregion 私有函数，将C#对象转换为JSONValue

        #region 将C#对象转换为JSONObject类型
        /// <summary>
        /// 将C#对象转换为JSONObject类型
        /// </summary>
        /// <param name="obj">C#的数据对象</param>
        /// <returns>转换后的JSONObject对象</returns>
        public static JSONObject ObjectToJSONObject(object obj)
        {
            //根据对象的类型进行处理
            Type type = obj.GetType();
            Dictionary<string, JSONValue> jsonNameValuePairs = new Dictionary<string, JSONValue>();

            //属性部分（用get/set设置的变量）
            PropertyInfo[] properties = type.GetProperties(BindingFlags.Instance | BindingFlags.Public);
            foreach (PropertyInfo pi in properties)
            {
                JSONValue jsonParameterValue = GetJSONValue(pi.GetValue(obj, null));
                if (jsonParameterValue != null)
                {
                    jsonNameValuePairs.Add(pi.Name, jsonParameterValue);
                }
            }

            //一般变量部分
            FieldInfo[] fields = type.GetFields(BindingFlags.Instance | BindingFlags.Public);
            foreach (FieldInfo fi in fields)
            {
                JSONValue jsonParameterValue = GetJSONValue(fi.GetValue(obj));
                if (jsonParameterValue != null)
                {
                    jsonNameValuePairs.Add(fi.Name, jsonParameterValue);
                }
            }
            return new JSONObject(jsonNameValuePairs);
        }
        #endregion 将C#对象转换为JSONObject类型

        #region 将对象转换为json字符串
        public static string  ToJSONString(object obj)
        {
            //直接使用GetJSONValue方法处理
            return GetJSONValue(obj).ToString();
        }
        #endregion 将对象转换为json字符串

        #region 将对象转换为json字符串（打印格式）
        public static string ToJSONPrint(object obj)
        {
            //直接使用GetJSONValue方法处理
            return GetJSONValue(obj).PrettyPrint();
        }
        #endregion 将对象转换为json字符串（打印格式）

        #endregion 将C#对象生成JSON串

        #region 将JSON串转换为JSONObject

        //全局变量
        private static readonly string _SEMICOLON = "@semicolon";//分号转义符
        private static readonly string _COMMA = "@comma"; //逗号转义符
        private static readonly string _LBMARKER = "@LBMarker"; //大括号－左{
        private static readonly string _RBMARKER = "@RBMarker"; //大括号－右}
        private static readonly string _LMMARKER = "@LMMarker"; //中括号－左[
        private static readonly string _RMMARKER = "@LMMarker"; //中括号－右]
        private static readonly string _SINGLE = "@single"; //单引号'
        private static readonly string _DOUBLE = "@double"; //双引号"

        #region 字符串转义
        /// <summary>
        /// 字符串转义,将双引号内的:和,分别转成_SEMICOLON和_COMMA
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        private static string StrEncode(string text)
        {
            //逐个字符处理，将双引号内的特殊字符替换为转义符
            string retStr = "";
            int length = 0;
            string beginChar = "";  //字符开始符号
            while (length < text.Length)
            {
                if (beginChar == "")
                {
                    //不是字符串中的字
                    retStr += text[length];
                    if (text[length] == '\"' || text[length] == '\'')
                    {
                        //进入字符串中
                        beginChar = text[length].ToString();
                    }
                }
                else
                {
                    //在字符串中
                    if (text[length] == '\\' && text[length + 1].ToString() == beginChar)
                    {
                        //遇到相同字符转义
                        retStr += "\\";
                        if (beginChar == "\"")
                        {
                            retStr += _DOUBLE;
                        }
                        else
                        {
                            retStr += _SINGLE;
                        }
                        length += 2;
                        continue;
                    }
                    else if (text[length].ToString() == beginChar)
                    {
                        //结束字符串处理
                        retStr += text[length];
                        beginChar = "";
                    }
                    else
                    {
                        //非特殊的情况，比较转义就可以了
                        switch (text[length])
                        {
                            case '\'':
                                retStr += _SINGLE;
                                break;
                            case '\"':
                                retStr += _DOUBLE;
                                break;
                            case '{':
                                retStr += _LBMARKER;
                                break;
                            case '}':
                                retStr += _RBMARKER;
                                break;
                            case '[':
                                retStr += _LMMARKER;
                                break;
                            case ']':
                                retStr += _RMMARKER;
                                break;
                            case ';':
                                retStr += _SEMICOLON;
                                break;
                            case ',':
                                retStr += _COMMA;
                                break;
                            default :
                                retStr += text[length];
                                break;
                        }
                    }
                }

                length++;
            }

            return retStr;
        }

        /// <summary>
        /// 字符串转义,将_SEMICOLON和_COMMA分别转成:和,
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        private static string StrDecode(string text)
        {
            return text.Replace(_SEMICOLON, ":").Replace(_COMMA, ",").Replace(_SINGLE, "\'").Replace(_DOUBLE, "\"").Replace(_LBMARKER, "{").Replace(_RBMARKER, "}").Replace(_LMMARKER, "[").Replace(_RMMARKER, "]");
        }

        #endregion 字符串转义

        #region JSON最小单元解析
        private static JSONValue SingleToJSONObject(string jsonStr, Dictionary<string, JSONValue> tempStack)
        {
            JSONObject jsonObject = new JSONObject();
            MatchCollection matches = Regex.Matches(jsonStr, "(\\\"(?<key>[^\\\"]+)\\\":\\\"(?<value>[^,\\\"]+)\\\")|(\\\"(?<key>[^\\\"]+)\\\":(?<value>[^,\\\"\\}]+))");
            foreach (Match match in matches)
            {
                string value = match.Groups["value"].Value;
                if (match.Value.Trim().EndsWith("\""))
                {
                    //是字符串
                    jsonObject.Add(match.Groups["key"].Value, new JSONStringValue(StrDecode(value)));
                }
                else
                {
                    if (value == "null")
                    {
                        //空值
                        jsonObject.Add(match.Groups["key"].Value, new JSONNullValue());
                    }
                    else if (tempStack.ContainsKey(value))
                    {
                        //是堆栈中的值
                        jsonObject.Add(match.Groups["key"].Value, tempStack[value]);
                    }
                    else if (value == "true" || value == "false")
                    {
                        //bool变量
                        jsonObject.Add(match.Groups["key"].Value, new JSONBoolValue(value == "true"));
                    }
                    else
                    {
                        //数值
                        jsonObject.Add(match.Groups["key"].Value, new JSONNumberValue(value));
                    }
                }
            }
            return jsonObject;
        }


        private static JSONValue SingleToJSONArray(string jsonStr, Dictionary<string, JSONValue> tempStack)
        {
            JSONArray jsonArray = new JSONArray();
            MatchCollection matches = Regex.Matches(jsonStr, "(\\\"(?<value>[^,\\\"]+)\")|(?<value>[^,\\[\\]]+)");
            foreach (Match match in matches)
            {
                string value = match.Groups["value"].Value;
                if (match.Value.Trim().EndsWith("\""))
                {
                    //是字符串
                    jsonArray.Add(new JSONStringValue(StrDecode(value)));
                }
                else
                {
                    if (value == "null")
                    {
                        //空值
                        jsonArray.Add(new JSONNullValue());
                    }
                    else if (tempStack.ContainsKey(value))
                    {
                        //是堆栈中的值
                        jsonArray.Add(tempStack[value]);
                    }
                    else if (value == "true" || value == "false")
                    {
                        //bool变量
                        jsonArray.Add(new JSONBoolValue(value == "true"));
                    }
                    else
                    {
                        //数值
                        jsonArray.Add(new JSONNumberValue(value));
                    }
                }
            }
            return jsonArray;
        }
        #endregion JSON最小单元解析

        public static JSONObject toJSONObject(string jsonStr)
        {
            jsonStr = StrEncode(jsonStr);  //转义
            Dictionary<string, JSONValue> tempStack = new Dictionary<string, JSONValue>(); //临时的堆栈

            #region 开始从最小的块开始对字符串进行分解处理
            string key = string.Empty;
            string pattern = "(\\{[^\\[\\]\\{\\}]+\\})|(\\[[^\\[\\]\\{\\}]+\\])";
            int count = 0;
            while (Regex.IsMatch(jsonStr, pattern))
            {
                MatchCollection matches = Regex.Matches(jsonStr, pattern);
                foreach (Match match in matches)
                {
                    key = "___key" + count + "___";

                    if (match.Value.Substring(0, 1) == "{")
                        tempStack.Add(key, SingleToJSONObject(match.Value, tempStack));
                    else
                        tempStack.Add(key, SingleToJSONArray(match.Value, tempStack));
                    jsonStr = jsonStr.Replace(match.Value, key);
                    count++;
                }
            }
            #endregion 开始从最小的块开始对字符串进行分解处理

            //最后那个变量就是转换后的对象
            return (JSONObject)tempStack[jsonStr];
        }

        #endregion 将JSON串转换为JSONObject
    }
}
