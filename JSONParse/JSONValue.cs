using System;
using System.Collections.Generic;
using System.Text;

namespace JSON
{
    /// <summary>
    /// JSON的基本值类型 -  抽象类
    /// </summary>
    public abstract class JSONValue
    {
        /// <summary>
        /// PrettyPrint()函数用到的缩进符号
        /// </summary>
        protected readonly string HORIZONTAL_TAB = "\t";

        /// <summary>
        /// Static counter used for PrettyPrint().
        /// </summary>
        public static int CURRENT_INDENT = 0;

        internal JSONValue()
        {
        }

        /// <summary>
        /// 获得对象的值
        /// </summary>
        public abstract object Value
        {
            get;
        }

        /// <summary>
        /// 获得对象string格式的值
        /// </summary>
        public abstract string ValueString
        {
            get;
        }

        /// <summary>
        /// 兼容JSONObject和JSONArray对象的索引访问
        /// </summary>
        /// <param name="index">索引位置</param>
        /// <returns>检索到的对象</returns>
        public abstract JSONValue this[int index]
        {
            get;
        }

        /// <summary>
        /// 兼容JSONObject和JSONArray对象的索引访问
        /// </summary>
        /// <param name="key">key值</param>
        /// <returns></returns>
        public abstract JSONValue this[string key]
        {
            get;
        }

        /// <summary>
        /// 生成JSON字符串的函数
        /// </summary>
        /// <returns>返回格式化为RFC 4627的字符串(JSON串)</returns>
        public abstract override string ToString();

        /// <summary>
        /// 生成可读性强的JSON字符串的函数
        /// </summary>
        /// <returns>返回可读性强的JSON字符串</returns>
        public abstract string PrettyPrint();
    }
}
