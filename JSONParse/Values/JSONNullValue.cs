using System;
using System.Collections.Generic;
using System.Text;

namespace JSON
{
    /// <summary>
    /// ��������
    /// </summary>
    public class JSONNullValue : JSONValue
    {
        private object _value;

        /// <summary>
        /// Simple public instance constructor that accepts a boolean.
        /// </summary>
        /// <param name="value">boolean value for this instance</param>
        public JSONNullValue()
            : base()
        {
            this._value = null;
        }

        /// <summary>
        /// ����������ֵ
        /// </summary>
        public override object Value
        {
            get { return this._value; }
        }

        /// <summary>
        /// ����string��ʽ��ֵ
        /// </summary>
        public override string ValueString
        {
            get { return "null"; }
        }

        /// <summary>
        /// �������׳��쳣
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        public override JSONValue this[int index]
        {
            get { throw new NotImplementedException(); }
        }

        /// <summary>
        /// �������׳��쳣
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
            return "null";
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