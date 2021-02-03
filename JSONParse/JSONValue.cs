using System;
using System.Collections.Generic;
using System.Text;

namespace JSON
{
    /// <summary>
    /// JSON�Ļ���ֵ���� -  ������
    /// </summary>
    public abstract class JSONValue
    {
        /// <summary>
        /// PrettyPrint()�����õ�����������
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
        /// ��ö����ֵ
        /// </summary>
        public abstract object Value
        {
            get;
        }

        /// <summary>
        /// ��ö���string��ʽ��ֵ
        /// </summary>
        public abstract string ValueString
        {
            get;
        }

        /// <summary>
        /// ����JSONObject��JSONArray�������������
        /// </summary>
        /// <param name="index">����λ��</param>
        /// <returns>�������Ķ���</returns>
        public abstract JSONValue this[int index]
        {
            get;
        }

        /// <summary>
        /// ����JSONObject��JSONArray�������������
        /// </summary>
        /// <param name="key">keyֵ</param>
        /// <returns></returns>
        public abstract JSONValue this[string key]
        {
            get;
        }

        /// <summary>
        /// ����JSON�ַ����ĺ���
        /// </summary>
        /// <returns>���ظ�ʽ��ΪRFC 4627���ַ���(JSON��)</returns>
        public abstract override string ToString();

        /// <summary>
        /// ���ɿɶ���ǿ��JSON�ַ����ĺ���
        /// </summary>
        /// <returns>���ؿɶ���ǿ��JSON�ַ���</returns>
        public abstract string PrettyPrint();
    }
}
