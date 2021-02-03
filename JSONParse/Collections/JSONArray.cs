using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace JSON
{
    /// <summary>
    /// JSONArrayCollection is an ordered collection of values. An array begins with 
    /// "[" (left bracket) and ends with "]" (right bracket). Array elements are 
    /// separated by "," (comma).
    /// </summary>
    public class JSONArray : JSONValueCollection
    {
        /// <summary>
        /// Internal generic list of JSONValue objects that comprise the elements
        /// of the JSONArrayCollection.
        /// </summary>
        protected List<JSONValue> _values;

        /// <summary>
        /// Public constructor that accepts a generic list of JSONValue objects.
        /// </summary>
        /// <param name="values">Generic list of JSONValue objects.</param>
        public JSONArray(List<JSONValue> values)
            : base()
        {
            this._values = values;
        }

        public override object Value
        {
            get { return this; }
        }

        public override string ValueString
        {
            get { return CollectionToString(); }
        }

        /// <summary>
        /// 返回第index个对象
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        public override JSONValue this[int index]
        {
            get { return this._values[index]; }
        }

        /// <summary>
        /// 没有key值索引的
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public override JSONValue this[string key]
        {
            get { throw new NotImplementedException(); }
        }

        /// <summary>
        /// Empty public constructor. Use this method in conjunction with
        /// the Add method to populate the internal array of elements.
        /// </summary>
        public JSONArray()
            : base()
        {
            this._values = new List<JSONValue>();
        }

        /// <summary>
        /// Adds a JSONValue to the internal object array.  Values are checked to 
        /// ensure no duplication occurs in the internal array.
        /// </summary>
        /// <param name="value">JSONValue to add to the internal array</param>
        public void Add(JSONValue value)
        {
            if (!this._values.Contains(value))
                this._values.Add(value);
        }

        /// <summary>
        /// Required override of the CollectionToPrettyPrint() method.
        /// </summary>
        /// <returns>the entire collection as a string in JSON-compliant format, with indentation for readability</returns>
        protected override string CollectionToPrettyPrint()
        {
            JSONValue.CURRENT_INDENT++;
            List<string> output = new List<string>();
            List<string> nvps = new List<string>();
            foreach (JSONValue jv in this._values)
                nvps.Add("".PadLeft(JSONValue.CURRENT_INDENT, Convert.ToChar(base.HORIZONTAL_TAB)) + jv.PrettyPrint());
            output.Add(string.Join(base.JSONVALUE_SEPARATOR + Environment.NewLine, nvps.ToArray()));
            JSONValue.CURRENT_INDENT--;
            return string.Join("", output.ToArray());
        }

        /// <summary>
        /// Required override of the CollectionToString() method.
        /// </summary>
        /// <returns>the entire collection as a string in JSON-compliant format</returns>
        protected override string CollectionToString()
        {
            List<string> output = new List<string>();
            List<string> nvps = new List<string>();
            foreach (JSONValue jv in this._values)
                nvps.Add(jv.ToString());

            output.Add(string.Join(base.JSONVALUE_SEPARATOR, nvps.ToArray()));
            return string.Join("", output.ToArray());
        }

        /// <summary>
        /// Required override of the BeginMarker property
        /// </summary>
        protected override string BeginMarker
        {
            get { return "["; }
        }

        /// <summary>
        /// Required override of the EndMarker property
        /// </summary>
        protected override string EndMarker
        {
            get { return "]"; }
        }


    }
}
