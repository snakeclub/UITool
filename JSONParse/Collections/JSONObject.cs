using System;
using System.Collections.Generic;
using System.Text;


namespace JSON
{
    /// <summary>
    /// JSONObjectCollection is an unordered set of name/value pairs. An object begins 
    /// with "{" (left brace) and ends with "}" (right brace). Each name is followed 
    /// by ":" (colon) and the name/value pairs are separated by "," (comma).
    /// </summary>
    public class JSONObject : JSONValueCollection
    {
        private Dictionary<string, JSONValue> _namevaluepairs;
        private readonly string NAMEVALUEPAIR_SEPARATOR = ":";


        public override object Value
        {
            get { return this; }
        }

        public override string ValueString
        {
            get { return CollectionToString(); }
        }

        /// <summary>
        /// 没有按索引获取值的情况
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        public override JSONValue this[int index]
        {
            get {
                int count = 0;
                foreach (KeyValuePair<string, JSONValue> kvp in this._namevaluepairs)
                {
                    if (index == count)
                    {
                        return kvp.Value;
                    }
                    count++;
                }
                throw new IndexOutOfRangeException();
            }
        }

        public override JSONValue this[string key]
        {
            get { return this._namevaluepairs[key]; }
        }

        /// <summary>
        /// Public constructor that accepts a Dictionary of name/value pairs.
        /// </summary>
        /// <param name="namevaluepairs">Dictionary collection of name/value pairs (JSONStringValue=name,JSONValue=pair)</param>
        public JSONObject(Dictionary<string, JSONValue> namevaluepairs)
            : base()
        {
            this._namevaluepairs = namevaluepairs;
        }

        /// <summary>
        /// Empty public constructor. Use this method in conjunction with
        /// the Add method to populate the internal dictionary of name/value pairs.
        /// </summary>
        public JSONObject()
            : base()
        {
            this._namevaluepairs = new Dictionary<string, JSONValue>();
        }

        /// <summary>
        /// Adds a JSONStringValue as the "name" and a JSONValue as the "value" to the 
        /// internal Dictionary.  Values are checked to ensure no duplication occurs 
        /// in the internal Dictionary.
        /// </summary>
        /// <param name="name">JSONStringValue "name" to add to the internal dictionary</param>
        /// <param name="value">JSONValue "value" to add to the internal dictionary</param>
        public void Add(string name, JSONValue value)
        {
            if (!this._namevaluepairs.ContainsKey(name))
                this._namevaluepairs.Add(name, value);
        }

        /// <summary>
        /// Required override of the CollectionToPrettyPrint() method.
        /// </summary>
        /// <returns>the entire dictionary as a string in JSON-compliant format, with indentation for readability</returns>
        protected override string CollectionToPrettyPrint()
        {
            JSONValue.CURRENT_INDENT++;
            List<string> output = new List<string>();
            List<string> nvps = new List<string>();
            foreach (KeyValuePair<string, JSONValue> kvp in this._namevaluepairs)
                nvps.Add("".PadLeft(JSONValue.CURRENT_INDENT, Convert.ToChar(base.HORIZONTAL_TAB)) + ToJSONString(kvp.Key) + this.NAMEVALUEPAIR_SEPARATOR + kvp.Value.PrettyPrint());
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
            foreach (KeyValuePair<string, JSONValue> kvp in this._namevaluepairs)
                nvps.Add(ToJSONString(kvp.Key) + this.NAMEVALUEPAIR_SEPARATOR + kvp.Value.ToString());
            output.Add(string.Join(base.JSONVALUE_SEPARATOR, nvps.ToArray()));
            return string.Join("", output.ToArray());
        }

        /// <summary>
        /// Required override of the BeginMarker property
        /// </summary>
        protected override string BeginMarker
        {
            get { return "{"; }
        }

        /// <summary>
        /// Required override of the EndMarker property
        /// </summary>
        protected override string EndMarker
        {
            get { return "}"; }
        }

        /// <summary>
        /// Evaluates all characters in a string and returns a new string,
        /// properly formatted for JSON compliance and bounded by double-quotes.
        /// </summary>
        /// <param name="text">string to be evaluated</param>
        /// <returns>new string, in JSON-compliant form</returns>
        public static string ToJSONString(string text)
        {
            char[] charArray = text.ToCharArray();
            List<string> output = new List<string>();
            foreach (char c in charArray)
            {
                if (((int)c) == 8)              //Backspace
                    output.Add("\\b");
                else if (((int)c) == 9)         //Horizontal tab
                    output.Add("\\t");
                else if (((int)c) == 10)        //Newline
                    output.Add("\\n");
                else if (((int)c) == 12)        //Formfeed
                    output.Add("\\f");
                else if (((int)c) == 13)        //Carriage return
                    output.Add("\\n");
                else if (((int)c) == 34)        //Double-quotes (")
                    output.Add("\\" + c.ToString());
                else if (((int)c) == 44)        //Comma (,)
                    output.Add("\\" + c.ToString());
                else if (((int)c) == 47)        //Solidus   (/)
                    output.Add("\\" + c.ToString());
                else if (((int)c) == 92)        //Reverse solidus   (\)
                    output.Add("\\" + c.ToString());
                else if (((int)c) > 31)
                    output.Add(c.ToString());
                //TODO: add support for hexadecimal
            }
            return "\"" + string.Join("", output.ToArray()) + "\"";
        }

    }
}
