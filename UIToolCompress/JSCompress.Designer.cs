namespace UIToolCompress
{
    partial class JSCompress
    {
        /// <summary>
        /// 必需的设计器变量。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 清理所有正在使用的资源。
        /// </summary>
        /// <param name="disposing">如果应释放托管资源，为 true；否则为 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows 窗体设计器生成的代码

        /// <summary>
        /// 设计器支持所需的方法 - 不要
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            this.tr_JsList = new System.Windows.Forms.TreeView();
            this.sp_leftRigh = new System.Windows.Forms.SplitContainer();
            this.sp_TopBottom = new System.Windows.Forms.SplitContainer();
            this.pl_Top = new System.Windows.Forms.Panel();
            this.tb_CompressPara = new System.Windows.Forms.TabControl();
            this.tp_ESC = new System.Windows.Forms.TabPage();
            this.gb_para = new System.Windows.Forms.GroupBox();
            this.label5 = new System.Windows.Forms.Label();
            this.rb_Level4 = new System.Windows.Forms.RadioButton();
            this.rb_Level3 = new System.Windows.Forms.RadioButton();
            this.rb_Level2 = new System.Windows.Forms.RadioButton();
            this.rb_Level1 = new System.Windows.Forms.RadioButton();
            this.rb_Level0 = new System.Windows.Forms.RadioButton();
            this.tp_YUIJS = new System.Windows.Forms.TabPage();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.btn_ChooseJavaPath = new System.Windows.Forms.Button();
            this.txt_JavaPath = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.cb_disable_optimizations = new System.Windows.Forms.CheckBox();
            this.cb_preserveSemi = new System.Windows.Forms.CheckBox();
            this.cb_nomunge = new System.Windows.Forms.CheckBox();
            this.txt_LineBreakColNum = new System.Windows.Forms.TextBox();
            this.cb_LineBreak = new System.Windows.Forms.CheckBox();
            this.tp_YUICSS = new System.Windows.Forms.TabPage();
            this.txt_CssLineBreak = new System.Windows.Forms.TextBox();
            this.cb_CssLineBreak = new System.Windows.Forms.CheckBox();
            this.btn_CssGetJavaPath = new System.Windows.Forms.Button();
            this.txt_CssJavaPath = new System.Windows.Forms.TextBox();
            this.label6 = new System.Windows.Forms.Label();
            this.pl_CommomSet = new System.Windows.Forms.Panel();
            this.cb_UnionFile = new System.Windows.Forms.CheckBox();
            this.cb_UseDefineTree = new System.Windows.Forms.CheckBox();
            this.btn_SetOutputFile = new System.Windows.Forms.Button();
            this.btn_OpenSourcePathSelect = new System.Windows.Forms.Button();
            this.label2 = new System.Windows.Forms.Label();
            this.txt_FileName = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.txt_SourcePath = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.cb_DestChartSet = new System.Windows.Forms.ComboBox();
            this.btn_Compress = new System.Windows.Forms.Button();
            this.pl_Cmd = new System.Windows.Forms.Panel();
            this.txt_Cmd = new System.Windows.Forms.TextBox();
            this.fd_SoucePath = new System.Windows.Forms.FolderBrowserDialog();
            this.sd_SaveFileName = new System.Windows.Forms.SaveFileDialog();
            this.fd_JavaPath = new System.Windows.Forms.FolderBrowserDialog();
            this.sp_leftRigh.Panel1.SuspendLayout();
            this.sp_leftRigh.Panel2.SuspendLayout();
            this.sp_leftRigh.SuspendLayout();
            this.sp_TopBottom.Panel1.SuspendLayout();
            this.sp_TopBottom.Panel2.SuspendLayout();
            this.sp_TopBottom.SuspendLayout();
            this.pl_Top.SuspendLayout();
            this.tb_CompressPara.SuspendLayout();
            this.tp_ESC.SuspendLayout();
            this.gb_para.SuspendLayout();
            this.tp_YUIJS.SuspendLayout();
            this.groupBox1.SuspendLayout();
            this.tp_YUICSS.SuspendLayout();
            this.pl_CommomSet.SuspendLayout();
            this.pl_Cmd.SuspendLayout();
            this.SuspendLayout();
            // 
            // tr_JsList
            // 
            this.tr_JsList.CheckBoxes = true;
            this.tr_JsList.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tr_JsList.Location = new System.Drawing.Point(0, 0);
            this.tr_JsList.Name = "tr_JsList";
            this.tr_JsList.ShowNodeToolTips = true;
            this.tr_JsList.Size = new System.Drawing.Size(350, 477);
            this.tr_JsList.TabIndex = 0;
            this.tr_JsList.AfterCheck += new System.Windows.Forms.TreeViewEventHandler(this.tr_JsList_AfterCheck);
            // 
            // sp_leftRigh
            // 
            this.sp_leftRigh.Dock = System.Windows.Forms.DockStyle.Fill;
            this.sp_leftRigh.FixedPanel = System.Windows.Forms.FixedPanel.Panel1;
            this.sp_leftRigh.Location = new System.Drawing.Point(0, 0);
            this.sp_leftRigh.Name = "sp_leftRigh";
            // 
            // sp_leftRigh.Panel1
            // 
            this.sp_leftRigh.Panel1.Controls.Add(this.sp_TopBottom);
            // 
            // sp_leftRigh.Panel2
            // 
            this.sp_leftRigh.Panel2.Controls.Add(this.tr_JsList);
            this.sp_leftRigh.Size = new System.Drawing.Size(658, 477);
            this.sp_leftRigh.SplitterDistance = 304;
            this.sp_leftRigh.TabIndex = 2;
            // 
            // sp_TopBottom
            // 
            this.sp_TopBottom.Dock = System.Windows.Forms.DockStyle.Fill;
            this.sp_TopBottom.FixedPanel = System.Windows.Forms.FixedPanel.Panel1;
            this.sp_TopBottom.Location = new System.Drawing.Point(0, 0);
            this.sp_TopBottom.Name = "sp_TopBottom";
            this.sp_TopBottom.Orientation = System.Windows.Forms.Orientation.Horizontal;
            // 
            // sp_TopBottom.Panel1
            // 
            this.sp_TopBottom.Panel1.Controls.Add(this.pl_Top);
            // 
            // sp_TopBottom.Panel2
            // 
            this.sp_TopBottom.Panel2.Controls.Add(this.pl_Cmd);
            this.sp_TopBottom.Size = new System.Drawing.Size(304, 477);
            this.sp_TopBottom.SplitterDistance = 300;
            this.sp_TopBottom.TabIndex = 13;
            // 
            // pl_Top
            // 
            this.pl_Top.Controls.Add(this.tb_CompressPara);
            this.pl_Top.Controls.Add(this.pl_CommomSet);
            this.pl_Top.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pl_Top.Location = new System.Drawing.Point(0, 0);
            this.pl_Top.Name = "pl_Top";
            this.pl_Top.Size = new System.Drawing.Size(304, 300);
            this.pl_Top.TabIndex = 12;
            // 
            // tb_CompressPara
            // 
            this.tb_CompressPara.Controls.Add(this.tp_ESC);
            this.tb_CompressPara.Controls.Add(this.tp_YUIJS);
            this.tb_CompressPara.Controls.Add(this.tp_YUICSS);
            this.tb_CompressPara.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tb_CompressPara.Location = new System.Drawing.Point(0, 0);
            this.tb_CompressPara.Name = "tb_CompressPara";
            this.tb_CompressPara.SelectedIndex = 0;
            this.tb_CompressPara.Size = new System.Drawing.Size(304, 139);
            this.tb_CompressPara.TabIndex = 10;
            // 
            // tp_ESC
            // 
            this.tp_ESC.BackColor = System.Drawing.Color.Transparent;
            this.tp_ESC.Controls.Add(this.gb_para);
            this.tp_ESC.Location = new System.Drawing.Point(4, 22);
            this.tp_ESC.Name = "tp_ESC";
            this.tp_ESC.Padding = new System.Windows.Forms.Padding(3);
            this.tp_ESC.Size = new System.Drawing.Size(296, 113);
            this.tp_ESC.TabIndex = 0;
            this.tp_ESC.Text = "ESC压缩";
            this.tp_ESC.UseVisualStyleBackColor = true;
            // 
            // gb_para
            // 
            this.gb_para.AutoSize = true;
            this.gb_para.BackColor = System.Drawing.Color.Transparent;
            this.gb_para.Controls.Add(this.label5);
            this.gb_para.Controls.Add(this.rb_Level4);
            this.gb_para.Controls.Add(this.rb_Level3);
            this.gb_para.Controls.Add(this.rb_Level2);
            this.gb_para.Controls.Add(this.rb_Level1);
            this.gb_para.Controls.Add(this.rb_Level0);
            this.gb_para.Dock = System.Windows.Forms.DockStyle.Fill;
            this.gb_para.Location = new System.Drawing.Point(3, 3);
            this.gb_para.Name = "gb_para";
            this.gb_para.Size = new System.Drawing.Size(290, 107);
            this.gb_para.TabIndex = 1;
            this.gb_para.TabStop = false;
            this.gb_para.Text = "压缩选项";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.ForeColor = System.Drawing.Color.Red;
            this.label5.Location = new System.Drawing.Point(6, 86);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(107, 12);
            this.label5.TabIndex = 5;
            this.label5.Text = "注:对中文支持不好";
            // 
            // rb_Level4
            // 
            this.rb_Level4.AutoSize = true;
            this.rb_Level4.Checked = true;
            this.rb_Level4.Location = new System.Drawing.Point(6, 67);
            this.rb_Level4.Name = "rb_Level4";
            this.rb_Level4.Size = new System.Drawing.Size(107, 16);
            this.rb_Level4.TabIndex = 4;
            this.rb_Level4.TabStop = true;
            this.rb_Level4.Text = "Level4压缩函数";
            this.rb_Level4.UseVisualStyleBackColor = true;
            // 
            // rb_Level3
            // 
            this.rb_Level3.AutoSize = true;
            this.rb_Level3.Location = new System.Drawing.Point(115, 44);
            this.rb_Level3.Name = "rb_Level3";
            this.rb_Level3.Size = new System.Drawing.Size(107, 16);
            this.rb_Level3.TabIndex = 3;
            this.rb_Level3.Text = "Level3去掉换行";
            this.rb_Level3.UseVisualStyleBackColor = true;
            // 
            // rb_Level2
            // 
            this.rb_Level2.AutoSize = true;
            this.rb_Level2.Location = new System.Drawing.Point(6, 44);
            this.rb_Level2.Name = "rb_Level2";
            this.rb_Level2.Size = new System.Drawing.Size(107, 16);
            this.rb_Level2.TabIndex = 2;
            this.rb_Level2.Text = "Level2去掉空格";
            this.rb_Level2.UseVisualStyleBackColor = true;
            // 
            // rb_Level1
            // 
            this.rb_Level1.AutoSize = true;
            this.rb_Level1.Location = new System.Drawing.Point(116, 21);
            this.rb_Level1.Name = "rb_Level1";
            this.rb_Level1.Size = new System.Drawing.Size(107, 16);
            this.rb_Level1.TabIndex = 1;
            this.rb_Level1.Text = "Level1去掉注释";
            this.rb_Level1.UseVisualStyleBackColor = true;
            // 
            // rb_Level0
            // 
            this.rb_Level0.AutoSize = true;
            this.rb_Level0.Location = new System.Drawing.Point(6, 21);
            this.rb_Level0.Name = "rb_Level0";
            this.rb_Level0.Size = new System.Drawing.Size(95, 16);
            this.rb_Level0.TabIndex = 0;
            this.rb_Level0.Text = "Level0仅合并";
            this.rb_Level0.UseVisualStyleBackColor = true;
            // 
            // tp_YUIJS
            // 
            this.tp_YUIJS.Controls.Add(this.groupBox1);
            this.tp_YUIJS.Location = new System.Drawing.Point(4, 22);
            this.tp_YUIJS.Name = "tp_YUIJS";
            this.tp_YUIJS.Padding = new System.Windows.Forms.Padding(3);
            this.tp_YUIJS.Size = new System.Drawing.Size(296, 113);
            this.tp_YUIJS.TabIndex = 1;
            this.tp_YUIJS.Text = "YUI Compressor-JS";
            this.tp_YUIJS.UseVisualStyleBackColor = true;
            // 
            // groupBox1
            // 
            this.groupBox1.AutoSize = true;
            this.groupBox1.BackColor = System.Drawing.Color.Transparent;
            this.groupBox1.Controls.Add(this.btn_ChooseJavaPath);
            this.groupBox1.Controls.Add(this.txt_JavaPath);
            this.groupBox1.Controls.Add(this.label3);
            this.groupBox1.Controls.Add(this.cb_disable_optimizations);
            this.groupBox1.Controls.Add(this.cb_preserveSemi);
            this.groupBox1.Controls.Add(this.cb_nomunge);
            this.groupBox1.Controls.Add(this.txt_LineBreakColNum);
            this.groupBox1.Controls.Add(this.cb_LineBreak);
            this.groupBox1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.groupBox1.Location = new System.Drawing.Point(3, 3);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(290, 107);
            this.groupBox1.TabIndex = 2;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "压缩选项";
            // 
            // btn_ChooseJavaPath
            // 
            this.btn_ChooseJavaPath.Location = new System.Drawing.Point(230, 88);
            this.btn_ChooseJavaPath.Name = "btn_ChooseJavaPath";
            this.btn_ChooseJavaPath.Size = new System.Drawing.Size(44, 25);
            this.btn_ChooseJavaPath.TabIndex = 24;
            this.btn_ChooseJavaPath.Text = "选择";
            this.btn_ChooseJavaPath.UseVisualStyleBackColor = true;
            this.btn_ChooseJavaPath.Click += new System.EventHandler(this.btn_ChooseJavaPath_Click);
            // 
            // txt_JavaPath
            // 
            this.txt_JavaPath.Location = new System.Drawing.Point(61, 88);
            this.txt_JavaPath.Name = "txt_JavaPath";
            this.txt_JavaPath.Size = new System.Drawing.Size(163, 21);
            this.txt_JavaPath.TabIndex = 23;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(7, 92);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(53, 12);
            this.label3.TabIndex = 22;
            this.label3.Text = "Java目录";
            // 
            // cb_disable_optimizations
            // 
            this.cb_disable_optimizations.AutoSize = true;
            this.cb_disable_optimizations.Location = new System.Drawing.Point(6, 68);
            this.cb_disable_optimizations.Name = "cb_disable_optimizations";
            this.cb_disable_optimizations.Size = new System.Drawing.Size(120, 16);
            this.cb_disable_optimizations.TabIndex = 21;
            this.cb_disable_optimizations.Text = "禁用内置优化选项";
            this.cb_disable_optimizations.UseVisualStyleBackColor = true;
            // 
            // cb_preserveSemi
            // 
            this.cb_preserveSemi.AutoSize = true;
            this.cb_preserveSemi.Checked = true;
            this.cb_preserveSemi.CheckState = System.Windows.Forms.CheckState.Checked;
            this.cb_preserveSemi.Location = new System.Drawing.Point(96, 45);
            this.cb_preserveSemi.Name = "cb_preserveSemi";
            this.cb_preserveSemi.Size = new System.Drawing.Size(108, 16);
            this.cb_preserveSemi.TabIndex = 20;
            this.cb_preserveSemi.Text = "不清除多余分号";
            this.cb_preserveSemi.UseVisualStyleBackColor = true;
            // 
            // cb_nomunge
            // 
            this.cb_nomunge.AutoSize = true;
            this.cb_nomunge.Location = new System.Drawing.Point(6, 45);
            this.cb_nomunge.Name = "cb_nomunge";
            this.cb_nomunge.Size = new System.Drawing.Size(84, 16);
            this.cb_nomunge.TabIndex = 19;
            this.cb_nomunge.Text = "不混淆变量";
            this.cb_nomunge.UseVisualStyleBackColor = true;
            // 
            // txt_LineBreakColNum
            // 
            this.txt_LineBreakColNum.Location = new System.Drawing.Point(139, 17);
            this.txt_LineBreakColNum.Name = "txt_LineBreakColNum";
            this.txt_LineBreakColNum.Size = new System.Drawing.Size(48, 21);
            this.txt_LineBreakColNum.TabIndex = 18;
            this.txt_LineBreakColNum.Text = "100";
            // 
            // cb_LineBreak
            // 
            this.cb_LineBreak.AutoSize = true;
            this.cb_LineBreak.Location = new System.Drawing.Point(7, 22);
            this.cb_LineBreak.Name = "cb_LineBreak";
            this.cb_LineBreak.Size = new System.Drawing.Size(132, 16);
            this.cb_LineBreak.TabIndex = 0;
            this.cb_LineBreak.Text = "列数后的语句加换行";
            this.cb_LineBreak.UseVisualStyleBackColor = true;
            // 
            // tp_YUICSS
            // 
            this.tp_YUICSS.Controls.Add(this.txt_CssLineBreak);
            this.tp_YUICSS.Controls.Add(this.cb_CssLineBreak);
            this.tp_YUICSS.Controls.Add(this.btn_CssGetJavaPath);
            this.tp_YUICSS.Controls.Add(this.txt_CssJavaPath);
            this.tp_YUICSS.Controls.Add(this.label6);
            this.tp_YUICSS.Location = new System.Drawing.Point(4, 22);
            this.tp_YUICSS.Name = "tp_YUICSS";
            this.tp_YUICSS.Size = new System.Drawing.Size(296, 113);
            this.tp_YUICSS.TabIndex = 2;
            this.tp_YUICSS.Text = "YUI Compressor-CSS";
            this.tp_YUICSS.UseVisualStyleBackColor = true;
            // 
            // txt_CssLineBreak
            // 
            this.txt_CssLineBreak.Location = new System.Drawing.Point(147, 13);
            this.txt_CssLineBreak.Name = "txt_CssLineBreak";
            this.txt_CssLineBreak.Size = new System.Drawing.Size(48, 21);
            this.txt_CssLineBreak.TabIndex = 29;
            this.txt_CssLineBreak.Text = "100";
            // 
            // cb_CssLineBreak
            // 
            this.cb_CssLineBreak.AutoSize = true;
            this.cb_CssLineBreak.Location = new System.Drawing.Point(13, 17);
            this.cb_CssLineBreak.Name = "cb_CssLineBreak";
            this.cb_CssLineBreak.Size = new System.Drawing.Size(132, 16);
            this.cb_CssLineBreak.TabIndex = 28;
            this.cb_CssLineBreak.Text = "列数后的语句加换行";
            this.cb_CssLineBreak.UseVisualStyleBackColor = true;
            // 
            // btn_CssGetJavaPath
            // 
            this.btn_CssGetJavaPath.Location = new System.Drawing.Point(233, 47);
            this.btn_CssGetJavaPath.Name = "btn_CssGetJavaPath";
            this.btn_CssGetJavaPath.Size = new System.Drawing.Size(44, 25);
            this.btn_CssGetJavaPath.TabIndex = 27;
            this.btn_CssGetJavaPath.Text = "选择";
            this.btn_CssGetJavaPath.UseVisualStyleBackColor = true;
            this.btn_CssGetJavaPath.Click += new System.EventHandler(this.btn_CssGetJavaPath_Click);
            // 
            // txt_CssJavaPath
            // 
            this.txt_CssJavaPath.Location = new System.Drawing.Point(64, 47);
            this.txt_CssJavaPath.Name = "txt_CssJavaPath";
            this.txt_CssJavaPath.Size = new System.Drawing.Size(163, 21);
            this.txt_CssJavaPath.TabIndex = 26;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(10, 50);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(53, 12);
            this.label6.TabIndex = 25;
            this.label6.Text = "Java目录";
            // 
            // pl_CommomSet
            // 
            this.pl_CommomSet.Controls.Add(this.cb_UnionFile);
            this.pl_CommomSet.Controls.Add(this.cb_UseDefineTree);
            this.pl_CommomSet.Controls.Add(this.btn_SetOutputFile);
            this.pl_CommomSet.Controls.Add(this.btn_OpenSourcePathSelect);
            this.pl_CommomSet.Controls.Add(this.label2);
            this.pl_CommomSet.Controls.Add(this.txt_FileName);
            this.pl_CommomSet.Controls.Add(this.label1);
            this.pl_CommomSet.Controls.Add(this.txt_SourcePath);
            this.pl_CommomSet.Controls.Add(this.label4);
            this.pl_CommomSet.Controls.Add(this.cb_DestChartSet);
            this.pl_CommomSet.Controls.Add(this.btn_Compress);
            this.pl_CommomSet.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.pl_CommomSet.Location = new System.Drawing.Point(0, 139);
            this.pl_CommomSet.Name = "pl_CommomSet";
            this.pl_CommomSet.Size = new System.Drawing.Size(304, 161);
            this.pl_CommomSet.TabIndex = 2;
            // 
            // cb_UnionFile
            // 
            this.cb_UnionFile.AutoSize = true;
            this.cb_UnionFile.Checked = true;
            this.cb_UnionFile.CheckState = System.Windows.Forms.CheckState.Checked;
            this.cb_UnionFile.Location = new System.Drawing.Point(197, 111);
            this.cb_UnionFile.Name = "cb_UnionFile";
            this.cb_UnionFile.Size = new System.Drawing.Size(96, 16);
            this.cb_UnionFile.TabIndex = 24;
            this.cb_UnionFile.Text = "合并输出文件";
            this.cb_UnionFile.UseVisualStyleBackColor = true;
            // 
            // cb_UseDefineTree
            // 
            this.cb_UseDefineTree.AutoSize = true;
            this.cb_UseDefineTree.Checked = true;
            this.cb_UseDefineTree.CheckState = System.Windows.Forms.CheckState.Checked;
            this.cb_UseDefineTree.Location = new System.Drawing.Point(146, 8);
            this.cb_UseDefineTree.Name = "cb_UseDefineTree";
            this.cb_UseDefineTree.Size = new System.Drawing.Size(108, 16);
            this.cb_UseDefineTree.TabIndex = 23;
            this.cb_UseDefineTree.Text = "从JS定义树获取";
            this.cb_UseDefineTree.UseVisualStyleBackColor = true;
            // 
            // btn_SetOutputFile
            // 
            this.btn_SetOutputFile.Location = new System.Drawing.Point(60, 55);
            this.btn_SetOutputFile.Name = "btn_SetOutputFile";
            this.btn_SetOutputFile.Size = new System.Drawing.Size(40, 25);
            this.btn_SetOutputFile.TabIndex = 22;
            this.btn_SetOutputFile.Text = "设置";
            this.btn_SetOutputFile.UseVisualStyleBackColor = true;
            this.btn_SetOutputFile.Click += new System.EventHandler(this.btn_SetOutputFile_Click);
            // 
            // btn_OpenSourcePathSelect
            // 
            this.btn_OpenSourcePathSelect.Location = new System.Drawing.Point(82, 2);
            this.btn_OpenSourcePathSelect.Name = "btn_OpenSourcePathSelect";
            this.btn_OpenSourcePathSelect.Size = new System.Drawing.Size(44, 25);
            this.btn_OpenSourcePathSelect.TabIndex = 21;
            this.btn_OpenSourcePathSelect.Text = "选择";
            this.btn_OpenSourcePathSelect.UseVisualStyleBackColor = true;
            this.btn_OpenSourcePathSelect.Click += new System.EventHandler(this.btn_OpenSourcePathSelect_Click);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(5, 63);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(53, 12);
            this.label2.TabIndex = 20;
            this.label2.Text = "输出文件";
            // 
            // txt_FileName
            // 
            this.txt_FileName.Location = new System.Drawing.Point(5, 79);
            this.txt_FileName.Name = "txt_FileName";
            this.txt_FileName.Size = new System.Drawing.Size(246, 21);
            this.txt_FileName.TabIndex = 19;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(5, 13);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(77, 12);
            this.label1.TabIndex = 18;
            this.label1.Text = "源文件根目录";
            // 
            // txt_SourcePath
            // 
            this.txt_SourcePath.Location = new System.Drawing.Point(5, 28);
            this.txt_SourcePath.Name = "txt_SourcePath";
            this.txt_SourcePath.Size = new System.Drawing.Size(246, 21);
            this.txt_SourcePath.TabIndex = 17;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(5, 111);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(77, 12);
            this.label4.TabIndex = 16;
            this.label4.Text = "输出文件编码";
            // 
            // cb_DestChartSet
            // 
            this.cb_DestChartSet.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cb_DestChartSet.FormattingEnabled = true;
            this.cb_DestChartSet.Items.AddRange(new object[] {
            "Default(ANSI)",
            "UTF-8",
            "Unicode",
            "GBK",
            "ASCII"});
            this.cb_DestChartSet.Location = new System.Drawing.Point(88, 108);
            this.cb_DestChartSet.Name = "cb_DestChartSet";
            this.cb_DestChartSet.Size = new System.Drawing.Size(93, 20);
            this.cb_DestChartSet.TabIndex = 15;
            // 
            // btn_Compress
            // 
            this.btn_Compress.Location = new System.Drawing.Point(11, 131);
            this.btn_Compress.Name = "btn_Compress";
            this.btn_Compress.Size = new System.Drawing.Size(66, 25);
            this.btn_Compress.TabIndex = 12;
            this.btn_Compress.Text = "压缩";
            this.btn_Compress.UseVisualStyleBackColor = true;
            this.btn_Compress.Click += new System.EventHandler(this.btn_Compress_Click);
            // 
            // pl_Cmd
            // 
            this.pl_Cmd.Controls.Add(this.txt_Cmd);
            this.pl_Cmd.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pl_Cmd.Location = new System.Drawing.Point(0, 0);
            this.pl_Cmd.Name = "pl_Cmd";
            this.pl_Cmd.Size = new System.Drawing.Size(304, 173);
            this.pl_Cmd.TabIndex = 11;
            // 
            // txt_Cmd
            // 
            this.txt_Cmd.Dock = System.Windows.Forms.DockStyle.Fill;
            this.txt_Cmd.Location = new System.Drawing.Point(0, 0);
            this.txt_Cmd.Multiline = true;
            this.txt_Cmd.Name = "txt_Cmd";
            this.txt_Cmd.Size = new System.Drawing.Size(304, 173);
            this.txt_Cmd.TabIndex = 10;
            // 
            // fd_SoucePath
            // 
            this.fd_SoucePath.Description = "选择源文件根目录";
            // 
            // sd_SaveFileName
            // 
            this.sd_SaveFileName.DefaultExt = "js";
            this.sd_SaveFileName.Filter = "JS文件|*.js|所有文件|*.*";
            this.sd_SaveFileName.Title = "设置输出文件";
            // 
            // fd_JavaPath
            // 
            this.fd_JavaPath.Description = "选择Java目录";
            // 
            // JSCompress
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(658, 477);
            this.Controls.Add(this.sp_leftRigh);
            this.Name = "JSCompress";
            this.Text = "UIToolJs压缩";
            this.Load += new System.EventHandler(this.JSCompress_Load);
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.JSCompress_FormClosing);
            this.sp_leftRigh.Panel1.ResumeLayout(false);
            this.sp_leftRigh.Panel2.ResumeLayout(false);
            this.sp_leftRigh.ResumeLayout(false);
            this.sp_TopBottom.Panel1.ResumeLayout(false);
            this.sp_TopBottom.Panel2.ResumeLayout(false);
            this.sp_TopBottom.ResumeLayout(false);
            this.pl_Top.ResumeLayout(false);
            this.tb_CompressPara.ResumeLayout(false);
            this.tp_ESC.ResumeLayout(false);
            this.tp_ESC.PerformLayout();
            this.gb_para.ResumeLayout(false);
            this.gb_para.PerformLayout();
            this.tp_YUIJS.ResumeLayout(false);
            this.tp_YUIJS.PerformLayout();
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.tp_YUICSS.ResumeLayout(false);
            this.tp_YUICSS.PerformLayout();
            this.pl_CommomSet.ResumeLayout(false);
            this.pl_CommomSet.PerformLayout();
            this.pl_Cmd.ResumeLayout(false);
            this.pl_Cmd.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TreeView tr_JsList;
        private System.Windows.Forms.SplitContainer sp_leftRigh;
        private System.Windows.Forms.GroupBox gb_para;
        private System.Windows.Forms.RadioButton rb_Level4;
        private System.Windows.Forms.RadioButton rb_Level3;
        private System.Windows.Forms.RadioButton rb_Level2;
        private System.Windows.Forms.RadioButton rb_Level1;
        private System.Windows.Forms.RadioButton rb_Level0;
        private System.Windows.Forms.FolderBrowserDialog fd_SoucePath;
        private System.Windows.Forms.SaveFileDialog sd_SaveFileName;
        private System.Windows.Forms.TabControl tb_CompressPara;
        private System.Windows.Forms.TabPage tp_ESC;
        private System.Windows.Forms.TabPage tp_YUIJS;
        private System.Windows.Forms.Panel pl_CommomSet;
        private System.Windows.Forms.Button btn_SetOutputFile;
        private System.Windows.Forms.Button btn_OpenSourcePathSelect;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox txt_FileName;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox txt_SourcePath;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.ComboBox cb_DestChartSet;
        private System.Windows.Forms.Button btn_Compress;
        private System.Windows.Forms.Panel pl_Cmd;
        private System.Windows.Forms.TextBox txt_Cmd;
        private System.Windows.Forms.Panel pl_Top;
        private System.Windows.Forms.SplitContainer sp_TopBottom;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.TabPage tp_YUICSS;
        private System.Windows.Forms.CheckBox cb_UseDefineTree;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.CheckBox cb_LineBreak;
        private System.Windows.Forms.TextBox txt_LineBreakColNum;
        private System.Windows.Forms.CheckBox cb_nomunge;
        private System.Windows.Forms.CheckBox cb_preserveSemi;
        private System.Windows.Forms.CheckBox cb_disable_optimizations;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox txt_JavaPath;
        private System.Windows.Forms.Button btn_ChooseJavaPath;
        private System.Windows.Forms.FolderBrowserDialog fd_JavaPath;
        private System.Windows.Forms.Button btn_CssGetJavaPath;
        private System.Windows.Forms.TextBox txt_CssJavaPath;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.TextBox txt_CssLineBreak;
        private System.Windows.Forms.CheckBox cb_CssLineBreak;
        private System.Windows.Forms.CheckBox cb_UnionFile;

    }
}

