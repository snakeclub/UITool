using System;
using System.Collections.Generic;
using System.Text;

namespace JSON
{
    /// <summary>
    /// 布尔类型
    /// </summary>
    public class JSONBoolValue : JSONValue
    {
        private bool _value;

        /// <summary>
        /// Simple public instance constructor that accepts a boolean.
        /// </summary>
        /// <param name="value">boolean value for this instance</param>
        public JSONBoolValue(bool value)
            : base()
        {
            this._value = value;
        }

        /// <summary>
        /// 返回自身的值
        /// </summary>
        public override object Value
        {
            get { return this._value; }
        }

        public override string ValueString
        {
            get { return this._value.ToString().ToLower(); }
        }

        /// <summary>
        /// 索引，抛出异常
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        public override JSONValue this[int index]
        {
            get { throw new NotImplementedException(); }
        }

        /// <summary>
        /// 索引，抛出异常
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public override JSONValue this[string key]
        {
            get { throw new NotImplementedException(); }
        }

        /// <summary>
        /// Required override of the ToString() method.
        /// </summary>
        /// <returns>boolean value for this instance, as text and lower-cased (either "true" or "false", without quotation marks)</returns>
        public override string ToString()
        {
            return this._value.ToString().ToLower();
        }

        /// <summary>
        /// Required override of the PrettyPrint() method.
        /// </summary>
        /// <returns>this.ToString()</returns>
        public override string PrettyPrint()
        {
            return this.ToString();
        }
    }
}
