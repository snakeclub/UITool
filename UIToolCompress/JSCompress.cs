using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using Microsoft.Win32;
using System.IO;
using System.Diagnostics;
using System.Text.RegularExpressions; // 引用正则的命名空间


namespace UIToolCompress
{
    public partial class JSCompress : Form
    {
        public JSCompress()
        {
            InitializeComponent();
        }

        #region 公共的变量
        public RegistryKey hkcu;
        public RegistryKey khSoftware;
        public RegistryKey khJSCompress;

        public XmlTable JsTable = new XmlTable(Application.StartupPath + "\\JsDefineTable.xml", true);
        #endregion 公共的变量

        #region 程序启动时设置默认参数
        private void JSCompress_Load(object sender, EventArgs e)
        {
            try
            {
                //程序启动时设置默认参数
                hkcu = Registry.CurrentUser;
                khSoftware = hkcu.CreateSubKey("Software");
                khJSCompress = khSoftware.CreateSubKey("JSCompress");

                txt_SourcePath.Text = (string)khJSCompress.GetValue("SourcePath");
                txt_JavaPath.Text = (string)khJSCompress.GetValue("JavaPath");
                txt_CssJavaPath.Text = txt_JavaPath.Text;
                txt_FileName.Text = (string)khJSCompress.GetValue("FileName");
                if ((string)khJSCompress.GetValue("CharSet") != "")
                {
                    cb_DestChartSet.SelectedIndex = int.Parse((string)khJSCompress.GetValue("CharSet"));
                }
                else
                {
                    cb_DestChartSet.SelectedIndex = 0;
                }

                if(txt_SourcePath.Text == "")
                    txt_SourcePath.Text = Application.StartupPath;
                if(txt_FileName.Text == "")
                    txt_FileName.Text = Application.StartupPath + "\\output\\UITool-min-1.0.js";

                if (!Directory.Exists(Application.StartupPath + "\\output\\"))
                {
                    Directory.CreateDirectory(Application.StartupPath + "\\output\\");
                }
                if (!Directory.Exists(Application.StartupPath + "\\temp\\"))
                {
                    Directory.CreateDirectory(Application.StartupPath + "\\temp\\");
                }
                if (!Directory.Exists(Application.StartupPath + "\\tempoutput\\"))
                {
                    Directory.CreateDirectory(Application.StartupPath + "\\tempoutput\\");
                }

                //装载XMLTABLE,先尝试新增表
                string errMsg = "";
                #region 建立js文件定义表
                if (!JsTable.TableExists("JSLIST"))
                {
                    //创建新表
                    string[] columnName = new string[5];
                    string[] columnMemo = new string[5];

                    columnName[0] = "JSName";
                    columnName[1] = "FileName";
                    columnName[2] = "NodeType";
                    columnName[3] = "ParentNode";
                    columnName[4] = "DependJsList";

                    columnMemo[0] = "节点名(显示名)";
                    columnMemo[1] = "文件名或路径";
                    columnMemo[2] = "节点类型：0－路径，1－js文件，2-Css文件";
                    columnMemo[3] = "父节点名";
                    columnMemo[4] = "依赖文件列表，多个文件间用,分隔";

                    if (!JsTable.AddTable("JSLIST", "js文件定义表", columnName, columnMemo, out errMsg))
                    {
                        MessageBox.Show("创建文件定义表失败! 错误信息:" + errMsg);
                        return;
                    }

                    //导入初始化数据
                    string initString = "UITool||0||\n"  //根节点
                                        + "UICore|ui-core|0|UITool|\n"  //ui-core节点
                                        + "Debug|Debug.js|1|UICore|\n"
                                        + "ToolFunction|ToolFunction.js|1|UICore|\n"
                                        + "Cookie|cookie.js|1|UICore|\n"
                                        + "Clipboard|Clipboard.js|1|UICore|\n"
                                        + "PowerString|PowerString.js|1|UICore|\n"
                                        + "PowerDate|PowerDate.js|1|UICore|\n"
                                        + "SelectionTool|SelectionTool.js|1|UICore|\n"
                                        + "ShadowTool|ShadowTool.js|1|UICore|\n"
                                        + "blockUI|blockUI.js|1|UICore|\n"
                                        + "DragControl|DragControl.js|1|UICore|ToolFunction\n"
                                        + "ResizeControl|ResizeControl.js|1|UICore|\n"
                                        + "PositionControl|PositionControl.js|1|UICore|\n"
                                        + "FloatControl|FloatControl.js|1|UICore|\n"
                                        + "PathMoveControl|PathMoveControl.js|1|UICore|FloatControl\n"
                                        + "ShowHideControl|ShowHideControl.js|1|UICore|\n"
                                        + "AreaSelectControl|AreaSelectControl.js|1|UICore|ToolFunction\n"
                                        + "HotKeyControl|HotKeyControl.js|1|UICore|\n"
                                        + "TimerControl|TimerControl.js|1|UICore|\n"
                                        + "MouseSpecialControl|MouseSpecialControl.js|1|UICore|TimerControl,ToolFunction\n"
                                        + "DivDockControl|DivDockControl.js|1|UICore|\n"
                                        + "DivBoxesControl|DivBoxesControl.js|1|UICore|ToolFunction,DragControl\n"
                                        + "CornerControl|CornerControl.js|1|UICore|\n"
                                        + "UICrypto|Crypto|0|UITool|\n"  //UICrypto节点，加密
                                        + "MD5|md5.js|1|UICrypto|crypto\n"
                                        + "SHA-1|sha1.js|1|UICrypto|crypto\n"
                                        + "SHA-256|sha256.js|1|UICrypto|crypto\n"
                                        + "AES|aes.js|1|UICrypto|crypto,ofb,pbkdf2,HMAC,SHA-1\n"
                                        + "Rabbit|rabbit.js|1|UICrypto|crypto,pbkdf2,HMAC,SHA-1\n"
                                        + "MARC4|marc4.js|1|UICrypto|crypto,pbkdf2,HMAC,SHA-1\n"
                                        + "DES|des.js|1|UICrypto|\n"
                                        + "RSA|RSA.js|1|UICrypto|Barrett,BigInt\n"
                                        + "Xxtea|xxtea.js|1|UICrypto|\n"
                                        + "HMAC|hmac.js|1|UICrypto|crypto\n"
                                        + "pbkdf2|pbkdf2.js|1|UICrypto|\n"
                                        + "ofb|ofb.js|1|UICrypto|\n"
                                        + "crypto|crypto.js|1|UICrypto|\n"
                                        + "Barrett|Barrett.js|1|UICrypto|\n"
                                        + "BigInt|BigInt.js|1|UICrypto|\n"
                                        + "UIAjax|ui-ajax|0|UITool|\n"  //ui-ajax节点
                                        + "JSON|json2.js|1|UIAjax|\n"
                                        + "AjaxTool|AjaxTool.js|1|UIAjax|JSON\n"
                                        + "DataCollectTool|DataCollectTool.js|1|UIAjax|\n"              
                                        + "UIValidate|ui-validate|0|UITool|\n"  //ui-validate节点
                                        + "BaseValidateFun|BaseValidateFun.js|1|UIValidate|PowerString\n"
                                        + "FieldCheckFun|FieldCheckFun.js|1|UIValidate|PowerString,BaseValidateFun\n"
                                        + "LimitInputFun|LimitInputFun.js|1|UIValidate|PowerString,BaseValidateFun\n"
                                        + "CheckAssistFun|CheckAssistFun.js|1|UIValidate|PowerString,BaseValidateFun,FieldCheckFun,LimitInputFun,ToolFunction"
                                        ;
                    string[] initArray = initString.Split('\n');
                    for (int i = 0; i < initArray.Length; i++)
                    {
                        JsTable.AddRow("JSLIST", initArray[i].Split('|'), out errMsg);
                    }
                }
                #endregion 建立js文件定义表

                //生成结构树
                BuildJsTree("");
                //展开树
                tr_JsList.ExpandAll();
            }
            catch{
                ;
            }
        }
        #endregion 程序启动时设置默认参数

        #region 窗体事件

        #region 关闭窗口，保存当前配置
        private void JSCompress_FormClosing(object sender, FormClosingEventArgs e)
        {
            try { khJSCompress.SetValue("SourcePath", txt_SourcePath.Text); }
            catch { ;}
            try { khJSCompress.SetValue("FileName", txt_FileName.Text); }
            catch { ;}
            try { khJSCompress.SetValue("CharSet", cb_DestChartSet.SelectedIndex.ToString()); }
            catch { ;}
            try { khJSCompress.SetValue("JavaPath", txt_JavaPath.Text); }
            catch { ;}
        }
        #endregion 关闭窗口，保存当前配置

        #region 选择源代码的路径
        private void btn_OpenSourcePathSelect_Click(object sender, EventArgs e)
        {
            //选择源代码的路径
            fd_SoucePath.SelectedPath = txt_SourcePath.Text;
            fd_SoucePath.ShowDialog();
            txt_SourcePath.Text = fd_SoucePath.SelectedPath;
        }
        #endregion 选择源代码的路径

        #region 选择Java的路径
        private void btn_ChooseJavaPath_Click(object sender, EventArgs e)
        {
            fd_JavaPath.SelectedPath = txt_JavaPath.Text;
            fd_JavaPath.ShowDialog();
            txt_JavaPath.Text = fd_JavaPath.SelectedPath;
            txt_CssJavaPath.Text = fd_JavaPath.SelectedPath;
        }
        private void btn_CssGetJavaPath_Click(object sender, EventArgs e)
        {
            fd_JavaPath.SelectedPath = txt_CssJavaPath.Text;
            fd_JavaPath.ShowDialog();
            txt_JavaPath.Text = fd_JavaPath.SelectedPath;
            txt_CssJavaPath.Text = fd_JavaPath.SelectedPath;

        }
        #endregion 选择Java的路径

        #region 设置输出文件
        private void btn_SetOutputFile_Click(object sender, EventArgs e)
        {
            //设置输出文件
            sd_SaveFileName.FileName = txt_FileName.Text;
            sd_SaveFileName.ShowDialog();
            txt_FileName.Text = sd_SaveFileName.FileName;
        }
        #endregion 设置输出文件

        #region 压缩文件
        private void btn_Compress_Click(object sender, EventArgs e)
        {
            //删除temp目录下的所有文件
            string path = Application.StartupPath + "\\temp";  //Temp目录
            string outputPath = txt_FileName.Text.Substring(0, txt_FileName.Text.LastIndexOf("\\"));
            string outputfilename = txt_FileName.Text.Substring(txt_FileName.Text.LastIndexOf("\\") + 1);
            outputfilename = outputfilename.Substring(0,outputfilename.LastIndexOf("."));  //没有后缀名
            try
            {
                Directory.Delete(path, true);
            }
            catch (Exception err)
            {
                MessageBox.Show(err.Message);
            }

            if (!Directory.Exists(path))
            {
                try
                {
                    //重新创建目录
                    Directory.CreateDirectory(path);
                }
                catch (Exception err)
                {
                    MessageBox.Show(err.Message);
                    return;
                }
            }
            else if (Directory.GetFiles(path).Length > 0)
            {
                MessageBox.Show("删除缓冲文件失败！");
                return;
            }

            string errMsg = "";

            #region 复制文件到临时目录
            if (cb_UseDefineTree.Checked)
            {
                //根据定义树获取文件
                for (int i = 0; i < tr_JsList.Nodes.Count; i++)
                {
                    TreeNode tn = tr_JsList.Nodes[i];
                    if (!CopyFiles(tn, txt_SourcePath.Text.TrimEnd('\\'), out errMsg))
                    {
                        MessageBox.Show("复制文件失败:" + errMsg);
                        return;
                    }
                }
            }
            else
            {
                //复制该目录下的所有后缀符合的文件
                foreach (string filename in Directory.GetFiles(txt_SourcePath.Text, (tb_CompressPara.SelectedTab.Name != "tp_YUICSS"?".js":".css"), SearchOption.TopDirectoryOnly))
                {
                    string dfile = Application.StartupPath + "\\temp\\" + filename.Substring(filename.LastIndexOf("\\") + 1);
                    File.Copy(filename, dfile, true);
                }
            }
            #endregion 复制文件到临时目录

            #region 判断如果需要联合，则合并成一个文件
            txt_Cmd.Text = "";
            if (cb_UnionFile.Checked)
            {
                //组合js文件
                txt_Cmd.Text += "开始组合脚本...\r\n\r\n";
                foreach (string filename in Directory.GetFiles(path, ".js", SearchOption.TopDirectoryOnly))
                {
                    //将文件内容追加到联合文件中
                    System.IO.File.AppendAllText(path + "\\" + outputfilename + ".js", System.IO.File.ReadAllText(filename, GetEncodeByList()) + "\r\n", GetEncodeByList());
                    //删除原始文件
                    System.IO.File.Delete(filename);
                    txt_Cmd.Text += "追加文件:" + filename + "\r\n";
                }
                txt_Cmd.Text += "组合脚本完成...\r\n\r\n";

                //组合css文件
                txt_Cmd.Text += "开始组合样式表...\r\n\r\n";
                foreach (string filename in Directory.GetFiles(path, ".css", SearchOption.TopDirectoryOnly))
                {
                    //将文件内容追加到联合文件中
                    System.IO.File.AppendAllText(path + "\\" + outputfilename + ".css", System.IO.File.ReadAllText(filename, GetEncodeByList()) + "\r\n", GetEncodeByList());
                    //删除原始文件
                    System.IO.File.Delete(filename);
                    txt_Cmd.Text += "追加文件:" + filename + "\r\n";
                }
                txt_Cmd.Text += "组合样式表完成...\r\n\r\n";
            }
            #endregion 判断如果需要联合，则合并成一个文件

            #region 压缩JS文件

            #region 逐个文件进行压缩处理
            foreach (string filename in Directory.GetFiles(path, ".js", SearchOption.TopDirectoryOnly))
            {
                string fileNameWithoutPath = filename.Substring(filename.LastIndexOf("\\") + 1);

                #region 对复制后的文件进行转码和特殊处理
                string fileString = System.IO.File.ReadAllText(filename, GetEncodeByList());
                if (tb_CompressPara.SelectedTab.Name == "tp_ESC")
                {
                    //ESC压缩要进行的处理
                    fileString = fileString.Replace("(jQuery);", "('<$jQuery$>');");
                }

                //转码,ESC固定用gb2312，yui固定用utf8
                System.IO.File.WriteAllText(filename, fileString, (tb_CompressPara.SelectedTab.Name == "tp_ESC" ? Encoding.GetEncoding("gb2312") : Encoding.UTF8));
                #endregion 对复制后的文件进行转码和特殊处理

                #region 压缩命令
                Process p = new Process();
                p.StartInfo.WorkingDirectory = Application.StartupPath;
                p.StartInfo.UseShellExecute = false;
                p.StartInfo.RedirectStandardOutput = true;

                //根据参数生成压缩命令
                string CmdArguments = "";
                if (tb_CompressPara.SelectedTab.Name == "tp_ESC")
                {
                    //ESC工具
                    CmdArguments = " ESC.wsf";
                    //级别
                    string level = "0";
                    if (rb_Level1.Checked) level = "1";
                    if (rb_Level2.Checked) level = "2";
                    if (rb_Level3.Checked) level = "3";
                    if (rb_Level4.Checked) level = "4";
                    CmdArguments += " -l " + level;

                    //输出文件
                    CmdArguments += " -ow " + outputPath + "\\" + fileNameWithoutPath;

                    //输入文件,将temp目录下的所有js文件处理
                    CmdArguments += " " + path + "\\" + fileNameWithoutPath;

                    //在命令行显示
                    txt_Cmd.Text += "执行命令:cscript.exe " + CmdArguments + "\r\n";

                    p.StartInfo.FileName = "cscript.exe";
                    p.StartInfo.Arguments = CmdArguments;
                    p.Start();
                    string output = p.StandardOutput.ReadToEnd();
                    p.WaitForExit();
                    if (output.IndexOf("Processtime") > 0)
                    {
                        //处理成功
                        txt_Cmd.Text += "处理成功!\r\n\r\n";
                    }
                    else
                    {
                        //处理失败
                        txt_Cmd.Text += "处理失败!";
                        MessageBox.Show(output);
                        return;
                    }
                }
                else
                {
                    //YUI
                    CmdArguments = " -jar yuicompressor-2.4.6.jar ";
                    CmdArguments += path + "\\" + fileNameWithoutPath;
                    CmdArguments += " -o " + outputPath + "\\" + fileNameWithoutPath;
                    CmdArguments += " --charset utf-8 --type js";
                    if (cb_LineBreak.Checked)
                    {
                        //换行
                        CmdArguments += " --line-break " + txt_LineBreakColNum.Text;
                    }
                    if (cb_nomunge.Checked)
                    {
                        //不混淆变量
                        CmdArguments += " --nomunge";
                    }
                    if (cb_preserveSemi.Checked)
                    {
                        //保留多余分号
                        CmdArguments += " --preserve-semi";
                    }
                    if (cb_disable_optimizations.Checked)
                    {
                        //关闭js优化项
                        CmdArguments += " --disable-optimizations";
                    }

                    //在命令行显示
                    txt_Cmd.Text += "执行命令:" + (txt_JavaPath.Text != "" ? txt_JavaPath.Text.TrimEnd('\\') + "\\" : "") + "java.exe" + CmdArguments + "\r\n";
                    p.StartInfo.FileName = (txt_JavaPath.Text != "" ? txt_JavaPath.Text.TrimEnd('\\') + "\\" : "") + "java.exe";
                    p.StartInfo.Arguments = CmdArguments;
                    p.Start();
                    string output = p.StandardOutput.ReadToEnd();
                    p.WaitForExit();
                    if (output == "")
                    {
                        //处理成功
                        txt_Cmd.Text += "处理成功!\r\n\r\n";
                    }
                    else
                    {
                        //处理失败
                        txt_Cmd.Text += "处理失败!";
                        MessageBox.Show(output);
                        return;
                    }
                }

                //处理成功后的后续处理
                fileString = System.IO.File.ReadAllText(outputPath + "\\" + fileNameWithoutPath, (tb_CompressPara.SelectedTab.Name == "tp_ESC" ? Encoding.GetEncoding("gb2312") : Encoding.UTF8));
                if (tb_CompressPara.SelectedTab.Name == "tp_ESC")
                {
                    //ESC压缩要进行的处理
                    fileString = fileString.Replace("('<$jQuery$>');", "(jQuery);");
                }
                System.IO.File.WriteAllText(outputPath + "\\" + fileNameWithoutPath, fileString, GetEncodeByList());
                #endregion 压缩命令
            }
            #endregion 逐个文件进行压缩处理

            txt_Cmd.Text += "压缩JS文件结束！\r\n\r\n";

            #endregion 压缩JS文件


            #region 压缩Css文件

            #region 逐个文件进行压缩处理
            foreach (string filename in Directory.GetFiles(path, ".css", SearchOption.TopDirectoryOnly))
            {
                string fileNameWithoutPath = filename.Substring(filename.LastIndexOf("\\") + 1);

                #region 对复制后的文件进行转码和特殊处理
                string fileString = System.IO.File.ReadAllText(filename, GetEncodeByList());
                //转码,yui固定用utf8
                System.IO.File.WriteAllText(filename, fileString, Encoding.UTF8);
                #endregion 对复制后的文件进行转码和特殊处理

                #region 压缩命令
                Process p = new Process();
                p.StartInfo.WorkingDirectory = Application.StartupPath;
                p.StartInfo.UseShellExecute = false;
                p.StartInfo.RedirectStandardOutput = true;

                string CmdArguments = " -jar yuicompressor-2.4.6.jar ";
                CmdArguments += path + "\\" + fileNameWithoutPath;
                CmdArguments += " -o " + outputPath + "\\" + fileNameWithoutPath;
                CmdArguments += " --charset utf-8 --type css";
                if (cb_CssLineBreak.Checked)
                {
                    //换行
                    CmdArguments += " --line-break " + txt_CssLineBreak.Text;
                }

                //在命令行显示
                txt_Cmd.Text += "执行命令:" + (txt_JavaPath.Text != "" ? txt_JavaPath.Text.TrimEnd('\\') + "\\" : "") + "java.exe" + CmdArguments + "\r\n";
                p.StartInfo.FileName = (txt_JavaPath.Text != "" ? txt_JavaPath.Text.TrimEnd('\\') + "\\" : "") + "java.exe";
                p.StartInfo.Arguments = CmdArguments;
                p.Start();
                string output = p.StandardOutput.ReadToEnd();
                p.WaitForExit();
                if (output == "")
                {
                    //处理成功
                    txt_Cmd.Text += "处理成功!\r\n\r\n";
                }
                else
                {
                    //处理失败
                    txt_Cmd.Text += "处理失败!";
                    MessageBox.Show(output);
                    return;
                }

                fileString = System.IO.File.ReadAllText(outputPath + "\\" + fileNameWithoutPath, Encoding.UTF8);
                System.IO.File.WriteAllText((cb_UnionFile.Checked ? outputPath : outputPath) + "\\" + fileNameWithoutPath, fileString, GetEncodeByList());

                #endregion 压缩命令

                //处理完成
                txt_Cmd.Text += "处理完成！";
            }
            #endregion 逐个文件进行压缩处理

            txt_Cmd.Text += "压缩CSS文件结束！\r\n\r\n";

            MessageBox.Show("压缩完成！");
            return;

            #endregion 压缩Css文件
        }
        #endregion 压缩文件

        #region 选中或取消控件
        private void tr_JsList_AfterCheck(object sender, TreeViewEventArgs e)
        {
            if (e.Action.ToString() != "Unknown")
            {
                SetNodeChecked(e.Node, e.Node.Checked);
            }
        }
        #endregion 选中或取消控件

        #endregion 窗体事件


        #region 内部处理函数

        #region 建立JS树的递归函数
        /// <summary>
        /// 建立JS树的递归函数
        /// </summary>
        /// <param name="parentNode">父节点名</param>
        private void BuildJsTree(string parentNode)
        {
            DataTable dt = JsTable.Search("JSLIST", "ParentNode='" + parentNode + "'");
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow row = dt.Rows[i];
                TreeNode tn = new TreeNode(row["JSName"].ToString());
                tn.ToolTipText = row["FileName"].ToString(); //文件名或路径
                tn.Tag = row["DependJsList"].ToString();//依赖项
                tn.Name = row["JSName"].ToString();
                

                if (parentNode != "")
                {
                    //非根节点
                    TreeNode[] parent = tr_JsList.Nodes.Find(row["ParentNode"].ToString(), true);
                    if (parent.Length > 0)
                    {
                        parent[0].Nodes.Add(tn);
                    }
                }
                else
                {
                    //根节点添加到树中
                    tr_JsList.Nodes.Add(tn);
                }

                //递归获取下一个
                BuildJsTree(row["JSName"].ToString());
            }
            return;
        }
        #endregion 建立JS树的递归函数

        #region 选中或取消选中节点
        private void SetNodeChecked(TreeNode Node, bool Checked)
        {
            //先把自己设置为该状态
            Node.Checked = Checked;

            //如果是取消，上级节点为非选中
            if (!Checked)
            {
                TreeNode parent = Node.Parent;
                while (parent != null)
                {
                    parent.Checked = false;
                    parent = parent.Parent;
                }
            }

            //处理子节点
            if (Node.Nodes.Count > 0)
            {
                //树叶节点
                for (int i = 0; i < Node.Nodes.Count; i++)
                {
                    //用递归的方法处理子节点
                    SetNodeChecked(Node.Nodes[i], Checked);
                }
            }
            else
            {
                //控件节点
                if (Checked)
                {
                    //选中，需要将依赖项选中
                    string[] dlist = ((string)Node.Tag).Split(',');
                    for (int i = 0; i < dlist.Length; i++)
                    {
                        TreeNode[] tlist = tr_JsList.Nodes.Find(dlist[i], true);
                        for (int j = 0; j < tlist.Length; j++)
                        {
                            tlist[j].Checked = true;
                        }
                    }
                }
                else
                {
                    //取消选中，需将依赖于本节点的对象取消选中
                    DataTable temptable = JsTable.Search("JSLIST", "NodeType='1' and JSName != '"+Node.Name+"'");
                    foreach (DataRow row in temptable.Rows)
                    {
                        if (("," + row["DependJsList"].ToString() + ",").IndexOf("," + Node.Name+",") >= 0)
                        {
                            TreeNode[] tlist = tr_JsList.Nodes.Find(row["JSName"].ToString(), true);
                            for (int j = 0; j < tlist.Length; j++)
                            {
                                tlist[j].Checked = false;
                            }
                        }
                    }
                }
            }
        }
        #endregion 选中或取消选中节点

        #region 遍历树形控件进行文件复制
        private bool CopyFiles(TreeNode tn,string path, out string errMsg)
        {
            errMsg = "";
            if (tn.Nodes.Count == 0)
            {
                if (tn.Checked)
                {
                    //是根节点
                    string sfile = path + "\\" + tn.ToolTipText;
                    string dfile = Application.StartupPath + "\\temp\\" + tn.ToolTipText;
                    try
                    {
                        File.Copy(sfile, dfile, true);
                    }
                    catch (Exception err)
                    {
                        errMsg = err.Message;
                        return false;
                    }
                }
                //返回成功
                return true;
            }
            else
            {
                //叶子节点，是路径
                for (int i = 0; i < tn.Nodes.Count; i++)
                {
                    if (!CopyFiles(tn.Nodes[i], path + (tn.ToolTipText == ""?"":"\\" + tn.ToolTipText), out errMsg))
                    {
                        return false;
                    }
                }
                return true;
            }
        }
        #endregion 遍历树形控件进行文件复制

        #region 对文件进行转码并保存回文件
        private void ChangeFileEncode(string file, Encoding DestCharSet,bool CompressBefore)
        {
            string fileString = System.IO.File.ReadAllText(file);
            if (CompressBefore)
            {
                if (tb_CompressPara.SelectedTab.Name == "tp_ESC")
                {
                    //ESC压缩要进行的处理
                    fileString = fileString.Replace("(jQuery);", "('<$jQuery$>');");
                }

                if (tb_CompressPara.SelectedTab.Name != "tp_YUICSS")
                {
                    //JS压缩的特殊处理，记录不想改变名称的内部变量，主要针对eval内调用的情况，由js的第一行进行定义
                    if (fileString.StartsWith("//ProtectVar:"))
                    {
                        //需要进行内部变量保护
                        string temp = fileString.Substring(13, fileString.IndexOf('\n') - 13).Replace("\r","");
                        string[] Varlist = temp.Split(',');
                        for (int i = 0; i < Varlist.Length; i++)
                        {
                            //通过正则表达式找到对象位置，并进行替换
                            fileString = Regex.Replace(fileString, @"(\s|;)(v|V)(a|A)(r|R)\s" + Varlist[i] + @"(([\s\=].*;)|;)", "$0var xxx='ProtectVar$(" + Varlist[i] + ")';");
                        }
                    }
                }
            }
            else
            {
                if (tb_CompressPara.SelectedTab.Name == "tp_ESC")
                {
                    //ESC压缩要进行的处理
                    fileString = fileString.Replace("('<$jQuery$>');", "(jQuery);");
                }

                if (tb_CompressPara.SelectedTab.Name != "tp_YUICSS")
                {
                    //JS压缩的特殊处理
                }
            }
            System.IO.File.WriteAllText(file, fileString, DestCharSet);
            return;
        }
        #endregion 对文件进行转码并保存回文件

        #region 根据下拉框内容获取编码
        private Encoding GetEncodeByList()
        {
            Encoding ret;
            switch (cb_DestChartSet.SelectedText)
            {
                case "UTF-8":
                    ret = Encoding.UTF8;
                    break;
                case "Unicode":
                    ret = Encoding.Unicode;
                    break;
                case "GBK":
                    ret = Encoding.GetEncoding(936);
                    break;
                case "ASCII":
                    ret = Encoding.ASCII;
                    break;
                default :
                    ret = Encoding.GetEncoding("gb2312");
                    break;
            }
            return ret;
        }
        #endregion 根据下拉框内容获取编码
    

        #endregion 内部处理函数
    }
}


