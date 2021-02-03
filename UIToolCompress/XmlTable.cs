using System;
using System.Collections.Generic;
using System.Text;
using System.Xml;
using System.Xml.XPath;
using System.Data;

namespace UIToolCompress
{
    /// <summary>
    /// 操作XML表文件的数据
    /// </summary>
    public class XmlTable
    {
        #region 内部函数
        private string FilePath;
        private XmlDocument xDoc;
        private XmlElement xRoot = null;
        #endregion 内部函数

        #region 构造函数
        /// <summary>
        /// 创建实例并装载xml文件
        /// </summary>
        /// <param name="filepath">文件路径</param>
        /// <param name="CreateNew">如果文件不存在则创建新文件</param>
        public XmlTable(string filepath, bool CreateNew)
        {
                xDoc = new XmlDocument();
                FilePath = filepath;
                if (System.IO.File.Exists(filepath))
                {
                    xDoc.Load(filepath);
                }
                else
                {
                    if (CreateNew)
                    {
                        XmlDeclaration xDec = xDoc.CreateXmlDeclaration("1.0", "utf-8", null);
                        xDoc.AppendChild(xDec);
                        xDoc.AppendChild(xDoc.CreateElement("XMLDB"));
                        xDoc.Save(filepath);
                    }
                    else
                    {
                        //抛出异常
                        throw (new Exception("XML文件不存在！"));
                    }
                }
                xRoot = xDoc.DocumentElement;
        }
        #endregion 构造函数

        #region 判断表是否存在
        /// <summary>
        /// 判断表是否存在
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <returns>是否存在</returns>
        public bool TableExists(string tableName)
        {
            if (GetTableNodeByName(tableName) != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        #endregion 判断表是否存在

        #region 新增数据表
        /// <summary>
        /// 新增数据表
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <param name="tableMemo">表说明</param>
        /// <param name="columnName">字段名列表</param>
        /// <param name="columnMemo">字段描述列表，数组数必须与字段名列表一致，或者传空进来</param>
        /// <param name="errMsg">若出错，返回错误信息</param>
        /// <returns>新增结果</returns>
        public bool AddTable(string tableName, string tableMemo, string[] columnName, string[] columnMemo, out string errMsg)
        {
            errMsg = "";
            if (tableName == "")
            {
                errMsg = "表名不可为空!";
                return false;
            }
            if (columnMemo.Length != columnName.Length)
            {
                errMsg = "字段名列表和字段描述列表数量不一致!";
                return false;
            }
            //查看表名是否存在
            if (GetTableNodeByName(tableName) != null)
            {
                errMsg = "表名已存在!";
                return false;
            }
            //新增表
            XmlElement tempNode = xDoc.CreateElement(tableName);
            XmlAttribute xattr = xDoc.CreateAttribute("memo");
            xattr.Value = tableMemo;
            tempNode.Attributes.Append(xattr);
            XmlElement defineNode = xDoc.CreateElement("DEFINE");  //定义节点
            XmlElement columnNode = xDoc.CreateElement("ROW");  //定义ROW
            XmlElement rowNode = xDoc.CreateElement("ROWS");  //数据节点
            for (int i = 0; i < columnName.Length; i++)
            {
                if (columnName[i] == "")
                {
                    errMsg = "字段名不可为空!";
                    return false;
                }
                AddNodeWithValue(columnNode, columnName[i], (columnMemo == null) ? "" : columnMemo[i]);
            }
            defineNode.AppendChild(columnNode);
            tempNode.AppendChild(defineNode);
            tempNode.AppendChild(rowNode);
            xRoot.AppendChild(tempNode);
            xDoc.Save(FilePath);
            return true;
        }
        #endregion 新增数据表

        #region 新增行记录
        /// <summary>
        /// 新增行记录
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <param name="rowValue">要新增的记录的值列表，按字段顺序列出</param>
        /// <returns>新增结果</returns>
        public bool AddRow(string tableName, string[] rowValue, out string errMsg)
        {
            errMsg = "";
            XmlNode tableNode = GetTableNodeByName(tableName);
            if (tableNode == null)
            {
                errMsg = "数据表不存在!";
                return false;
            }
            //组织字段节点值和数据节点的查找
            XmlNode defineNode = null;
            XmlNode rowNode = null;
            for (int i = 0; i < tableNode.ChildNodes.Count; i++)
            {
                if (defineNode != null && rowNode != null)
                {
                    break;
                }
                if (defineNode == null && tableNode.ChildNodes[i].Name == "DEFINE")
                {
                    defineNode = tableNode.ChildNodes[i];
                    continue;
                }
                if (rowNode == null && tableNode.ChildNodes[i].Name == "ROWS")
                {
                    rowNode = tableNode.ChildNodes[i];
                    continue;
                }
            }
            //如果字段节点和数据节点有一个没有找到
            if (defineNode == null || rowNode == null)
            {
                errMsg = "数据表结构错误!";
                return false;
            }
            //准备添加节点值
            XmlNode newNode = defineNode.FirstChild.Clone();
            for (int i = 0; i < newNode.ChildNodes.Count; i++)
            {
                if (i >= rowValue.Length)
                {
                    newNode.ChildNodes[i].InnerText = "";
                }
                else
                {
                    newNode.ChildNodes[i].InnerText = rowValue[i];
                }
            }
            //添加节点
            rowNode.AppendChild(newNode);
            xDoc.Save(FilePath);
            return true;
        }
        #endregion 新增行记录

        #region 更新记录
        /// <summary>
        /// 更新查询到的行的记录
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <param name="where">查询的条件，例如"column1 = 'abc' and column2 = 'a'"，也可以用or,同时可以数字比较,如果所有记录，则填*</param>
        /// <param name="rowName">要更新的字段列表</param>
        /// <param name="rowValue">要更新的字段值</param>
        /// <returns>真实更新的记录数</returns>
        public int UpdateRow(string tableName, string where, string[] rowName, string[] rowValue)
        {
            int ret = 0;
            string xpath = "/XMLDB/" + tableName + "/ROWS/ROW[" + where + "]";
            XPathNavigator xNav = xDoc.CreateNavigator();
            XPathExpression xExpr = xNav.Compile(xpath);
            XPathNodeIterator ite = xNav.Select(xExpr);
            while (ite.MoveNext())
            {
                XPathNavigator temp = ite.Current;
                for (int i = 0; i < rowName.Length; i++)
                {
                    XPathNodeIterator tempite = temp.SelectChildren(rowName[i], "");
                    while (tempite.MoveNext())
                    {
                        tempite.Current.SetValue(rowValue[i]);
                    }
                }
                ret++;
            }
            //释放资源
            ite = null;
            xExpr = null;
            xNav = null;
            xDoc.Save(FilePath);
            return ret;
        }
        #endregion 更新记录

        #region 删除记录
        /// <summary>
        /// 删除查询到的行记录
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <param name="where">查询的条件，例如"column1 = 'abc' and column2 = 'a'"，也可以用or,同时可以数字比较,如果所有记录，则填*</param>
        /// <returns>真实删除的记录数</returns>
        public int DeleteRow(string tableName, string where)
        {
            return DeleteSearch("/XMLDB/" + tableName + "/ROWS/ROW[" + where + "]");
        }
        #endregion 删除记录

        #region 查询符合条件的记录数
        /// <summary>
        /// 查询符合条件的记录数
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <param name="where">查询的条件，例如"column1 = 'abc' and column2 = 'a'"，也可以用or,同时可以数字比较,如果所有记录，则填*</param>
        /// <returns>记录数</returns>
        public int SearchCount(string tableName, string where)
        {
            XmlNode tableNode = GetTableNodeByName(tableName);
            if (tableNode == null)
            {
                return 0;
            }
            string xpath = "/XMLDB/" + tableName + "/ROWS/ROW[" + where + "]";
            XPathNavigator xNav = tableNode.CreateNavigator();
            XPathExpression xExpr = xNav.Compile(xpath);
            XPathNodeIterator ite = xNav.Select(xExpr);
            int ret = ite.Count;
            ite = null;
            xExpr = null;
            xNav = null;
            return ret;
        }
        #endregion 查询符合条件的记录数

        #region 查询记录
        /// <summary>
        /// 查询记录，并以DataTable方式返回结果
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <param name="where">查询的条件，例如"column1 = 'abc' and column2 = 'a'"，也可以用or,同时可以数字比较,如果所有记录，则填*</param>
        /// <returns>数据表</returns>
        public DataTable Search(string tableName, string where)
        {
            DataTable dt = new DataTable();

            XmlNode tableNode = GetTableNodeByName(tableName);
            if (tableNode == null)
            {
                return dt;
            }
            string xpath = "/XMLDB/" + tableName + "/DEFINE/ROW[1]";
            XPathNavigator xNav = tableNode.CreateNavigator();
            XPathExpression xExpr = xNav.Compile(xpath);
            XPathNodeIterator ite = xNav.Select(xExpr);
            if (ite.MoveNext())
            {
                XPathNavigator temp = ite.Current;
                if (temp.MoveToFirstChild())
                {
                    //开始加列定义
                    dt.Columns.Add(temp.Name);
                    while (temp.MoveToNext())
                    {
                        dt.Columns.Add(temp.Name);
                    }
                    //获取数据
                    xpath = "/XMLDB/" + tableName + "/ROWS/ROW[" + where + "]";
                    xExpr = xNav.Compile(xpath);
                    ite = xNav.Select(xExpr);
                    while (ite.MoveNext())
                    {
                        //将数据列到表中
                        DataRow row = dt.NewRow();
                        temp = ite.Current.Clone();
                        if (temp.MoveToFirstChild())
                        {
                            row[temp.Name] = temp.Value;
                            while (temp.MoveToNext())
                            {
                                row[temp.Name] = temp.Value;
                            }
                        }
                        dt.Rows.Add(row);
                    }
                }
                temp = null;
            }
            ite = null;
            xExpr = null;
            xNav = null;
            return dt;
        }
        #endregion 查询记录

        #region 一些内部使用的方法

        #region Xml增加有值节点的方法
        private void AddNodeWithValue(XmlElement Parent, string NodeName, string Value)
        {
            XmlElement xtemp = xDoc.CreateElement(NodeName);
            xtemp.InnerText = Value;
            Parent.AppendChild(xtemp);
        }
        #endregion Xml增加有值节点的方法

        #region 根据表名获得表节点
        private XmlNode GetTableNodeByName(string tableName)
        {
            for (int i = 0; i < xRoot.ChildNodes.Count; i++)
            {
                if (xRoot.ChildNodes[i].Name == tableName)
                {
                    return xRoot.ChildNodes[i];
                }
            }
            return null;
        }
        #endregion 根据表名获得表节点

        #endregion 一些内部使用的方法

        #region 通用的xml方法

        #region 删除搜索出来的节点
        /// <summary>
        /// 删除搜索出来的节点
        /// </summary>
        /// <param name="xpath">XPath表达式</param>
        /// <returns>所删除的节点数</returns>
        public int DeleteSearch(string xpath)
        {
            //
            XPathNavigator xNav = xDoc.CreateNavigator();
            XPathExpression xExpr = xNav.Compile(xpath);
            XPathNodeIterator ite = xNav.Select(xExpr);
            int ret = 0;
            if (ite.Count == 1)
            {
                ret = 1;
                ite.MoveNext();
                ite.Current.DeleteSelf();
            }
            else
            {
                while (ite.MoveNext())
                {
                    ite.Current.DeleteSelf();
                    ite = xNav.Select(xExpr);
                    ret++;
                }
            }

            //释放资源
            ite = null;
            xExpr = null;
            xNav = null;
            xDoc.Save(FilePath);
            return ret;
        }
        #endregion 删除搜索出来的节点

        #endregion 通用的xml方法
    }
}
