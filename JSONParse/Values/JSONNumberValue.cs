using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace JSON
{
    /// <summary>
    /// 数值类型
    /// </summary>
    public class JSONNumberValue : JSONValue
    {
        private string _value;

        /// <summary>
        /// 返回自身的值
        /// </summary>
        public override object Value
        {
            get { return decimal.Parse(this._value); }
        }

        public override string ValueString
        {
            get { return this._value; }
        }

        #region 返回指定类型的数值
        public int ValueInt32
        {
            get { return int.Parse(this._value); }
        }

        public long ValueInt64
        {
            get { return long.Parse(this._value); }
        }

        public float ValueSingle
        {
            get { return float.Parse(this._value); }
        }

        public double ValueDouble
        {
            get { return double.Parse(this._value); }
        }

        public decimal ValueDecimal
        {
            get { return decimal.Parse(this._value); }
        }

        public byte ValueByte
        {
            get { return byte.Parse(this._value); }
        }
        #endregion 返回指定类型的数值

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
        /// Number formatting object for handling globalization differences with decimal point separators
        /// </summary>
        protected static NumberFormatInfo JavaScriptNumberFormatInfo;

        static JSONNumberValue()
        {
            JavaScriptNumberFormatInfo = new NumberFormatInfo();
            JavaScriptNumberFormatInfo.NumberDecimalSeparator = ".";
        }

        internal JSONNumberValue(string value)
            : base()
        {
            this._value = value;
        }

        /// <summary>
        /// Public constructor that accepts a value of type int
        /// </summary>
        /// <param name="value">int (System.Int32) value</param>
        public JSONNumberValue(int value)
            : this(value.ToString())
        {
        }

        /// <summary>
        /// Public constructor that accepts a value of type double
        /// </summary>
        /// <param name="value">double (System.Double) value</param>
        public JSONNumberValue(double value)
            : this(value.ToString(JSONNumberValue.JavaScriptNumberFormatInfo))
        {
        }

        /// <summary>
        /// Public constructor that accepts a value of type decimal
        /// </summary>
        /// <param name="value">decimal (System.Decimal) value</param>
        public JSONNumberValue(decimal value)
            : this(value.ToString(JSONNumberValue.JavaScriptNumberFormatInfo))
        {
        }

        /// <summary>
        /// Public constructor that accepts a value of type single
        /// </summary>
        /// <param name="value">single (System.Single) value</param>
        public JSONNumberValue(Single value)
            : this(value.ToString("E", JSONNumberValue.JavaScriptNumberFormatInfo))
        {
        }

        /// <summary>
        /// Public constructor that accepts a value of type byte
        /// </summary>
        /// <param name="value">byte (System.Byte) value</param>
        public JSONNumberValue(byte value)
            : this(value.ToString())
        {
        }

        /// <summary>
        /// Required override of ToString() method.
        /// </summary>
        /// <returns>contained numeric value, rendered as a string</returns>
        public override string ToString()
        {
            return this._value;
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
