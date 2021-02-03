namespace TestLib
{
    partial class TestLib
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
            this.tab_Main = new System.Windows.Forms.TabControl();
            this.tabPage1 = new System.Windows.Forms.TabPage();
            this.pl_Crypto_CrytString = new System.Windows.Forms.Panel();
            this.txt_CrytString = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.pl_Crypto_Botton = new System.Windows.Forms.Panel();
            this.btn_Xxtea_Dec = new System.Windows.Forms.Button();
            this.btn_Xxtea_Cryt = new System.Windows.Forms.Button();
            this.btn_RSA_Dec = new System.Windows.Forms.Button();
            this.btn_RSA_Cryt = new System.Windows.Forms.Button();
            this.btn_DES_Dec = new System.Windows.Forms.Button();
            this.btn_DES_Cryt = new System.Windows.Forms.Button();
            this.btn_MARC4_Dec = new System.Windows.Forms.Button();
            this.btn_MARC4_Cryt = new System.Windows.Forms.Button();
            this.btn_Rabbit_Dec = new System.Windows.Forms.Button();
            this.btn_Rabbit_Cryt = new System.Windows.Forms.Button();
            this.btn_AES_Dec = new System.Windows.Forms.Button();
            this.btn_AES_Cryt = new System.Windows.Forms.Button();
            this.txt_RSA_PARA = new System.Windows.Forms.TextBox();
            this.label7 = new System.Windows.Forms.Label();
            this.txt_RSA_DKEY = new System.Windows.Forms.TextBox();
            this.label6 = new System.Windows.Forms.Label();
            this.txt_RSA_EKEY = new System.Windows.Forms.TextBox();
            this.label5 = new System.Windows.Forms.Label();
            this.txt_RSA_MAXD = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.txt_Crypto_Key = new System.Windows.Forms.TextBox();
            this.btn_HMACSHA256_Cryt = new System.Windows.Forms.Button();
            this.btn_HMACSHA1_Cryt = new System.Windows.Forms.Button();
            this.btn_HMACMD5_Cryt = new System.Windows.Forms.Button();
            this.btn_SHA256_Cryt = new System.Windows.Forms.Button();
            this.btn_SHA1_Cryt = new System.Windows.Forms.Button();
            this.btn_MD5_Cryt = new System.Windows.Forms.Button();
            this.btn_toUTF = new System.Windows.Forms.Button();
            this.btn_toHex = new System.Windows.Forms.Button();
            this.pl_Crypto_BaseString = new System.Windows.Forms.Panel();
            this.txt_Crypto_BaseString = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.tabPage2 = new System.Windows.Forms.TabPage();
            this.button1 = new System.Windows.Forms.Button();
            this.tab_Main.SuspendLayout();
            this.tabPage1.SuspendLayout();
            this.pl_Crypto_CrytString.SuspendLayout();
            this.pl_Crypto_Botton.SuspendLayout();
            this.pl_Crypto_BaseString.SuspendLayout();
            this.tabPage2.SuspendLayout();
            this.SuspendLayout();
            // 
            // tab_Main
            // 
            this.tab_Main.Controls.Add(this.tabPage1);
            this.tab_Main.Controls.Add(this.tabPage2);
            this.tab_Main.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tab_Main.Location = new System.Drawing.Point(0, 0);
            this.tab_Main.Name = "tab_Main";
            this.tab_Main.SelectedIndex = 0;
            this.tab_Main.Size = new System.Drawing.Size(747, 530);
            this.tab_Main.TabIndex = 0;
            // 
            // tabPage1
            // 
            this.tabPage1.Controls.Add(this.pl_Crypto_CrytString);
            this.tabPage1.Controls.Add(this.pl_Crypto_Botton);
            this.tabPage1.Controls.Add(this.pl_Crypto_BaseString);
            this.tabPage1.Location = new System.Drawing.Point(4, 20);
            this.tabPage1.Name = "tabPage1";
            this.tabPage1.Padding = new System.Windows.Forms.Padding(3);
            this.tabPage1.Size = new System.Drawing.Size(739, 506);
            this.tabPage1.TabIndex = 0;
            this.tabPage1.Text = "加密:Crypto.dll";
            this.tabPage1.UseVisualStyleBackColor = true;
            // 
            // pl_Crypto_CrytString
            // 
            this.pl_Crypto_CrytString.Controls.Add(this.txt_CrytString);
            this.pl_Crypto_CrytString.Controls.Add(this.label2);
            this.pl_Crypto_CrytString.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pl_Crypto_CrytString.Location = new System.Drawing.Point(3, 190);
            this.pl_Crypto_CrytString.Name = "pl_Crypto_CrytString";
            this.pl_Crypto_CrytString.Size = new System.Drawing.Size(733, 178);
            this.pl_Crypto_CrytString.TabIndex = 2;
            // 
            // txt_CrytString
            // 
            this.txt_CrytString.Dock = System.Windows.Forms.DockStyle.Fill;
            this.txt_CrytString.Location = new System.Drawing.Point(0, 11);
            this.txt_CrytString.Multiline = true;
            this.txt_CrytString.Name = "txt_CrytString";
            this.txt_CrytString.Size = new System.Drawing.Size(733, 167);
            this.txt_CrytString.TabIndex = 2;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Dock = System.Windows.Forms.DockStyle.Top;
            this.label2.Location = new System.Drawing.Point(0, 0);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(27, 11);
            this.label2.TabIndex = 1;
            this.label2.Text = "密文";
            // 
            // pl_Crypto_Botton
            // 
            this.pl_Crypto_Botton.Controls.Add(this.btn_Xxtea_Dec);
            this.pl_Crypto_Botton.Controls.Add(this.btn_Xxtea_Cryt);
            this.pl_Crypto_Botton.Controls.Add(this.btn_RSA_Dec);
            this.pl_Crypto_Botton.Controls.Add(this.btn_RSA_Cryt);
            this.pl_Crypto_Botton.Controls.Add(this.btn_DES_Dec);
            this.pl_Crypto_Botton.Controls.Add(this.btn_DES_Cryt);
            this.pl_Crypto_Botton.Controls.Add(this.btn_MARC4_Dec);
            this.pl_Crypto_Botton.Controls.Add(this.btn_MARC4_Cryt);
            this.pl_Crypto_Botton.Controls.Add(this.btn_Rabbit_Dec);
            this.pl_Crypto_Botton.Controls.Add(this.btn_Rabbit_Cryt);
            this.pl_Crypto_Botton.Controls.Add(this.btn_AES_Dec);
            this.pl_Crypto_Botton.Controls.Add(this.btn_AES_Cryt);
            this.pl_Crypto_Botton.Controls.Add(this.txt_RSA_PARA);
            this.pl_Crypto_Botton.Controls.Add(this.label7);
            this.pl_Crypto_Botton.Controls.Add(this.txt_RSA_DKEY);
            this.pl_Crypto_Botton.Controls.Add(this.label6);
            this.pl_Crypto_Botton.Controls.Add(this.txt_RSA_EKEY);
            this.pl_Crypto_Botton.Controls.Add(this.label5);
            this.pl_Crypto_Botton.Controls.Add(this.txt_RSA_MAXD);
            this.pl_Crypto_Botton.Controls.Add(this.label4);
            this.pl_Crypto_Botton.Controls.Add(this.label3);
            this.pl_Crypto_Botton.Controls.Add(this.txt_Crypto_Key);
            this.pl_Crypto_Botton.Controls.Add(this.btn_HMACSHA256_Cryt);
            this.pl_Crypto_Botton.Controls.Add(this.btn_HMACSHA1_Cryt);
            this.pl_Crypto_Botton.Controls.Add(this.btn_HMACMD5_Cryt);
            this.pl_Crypto_Botton.Controls.Add(this.btn_SHA256_Cryt);
            this.pl_Crypto_Botton.Controls.Add(this.btn_SHA1_Cryt);
            this.pl_Crypto_Botton.Controls.Add(this.btn_MD5_Cryt);
            this.pl_Crypto_Botton.Controls.Add(this.btn_toUTF);
            this.pl_Crypto_Botton.Controls.Add(this.btn_toHex);
            this.pl_Crypto_Botton.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.pl_Crypto_Botton.Location = new System.Drawing.Point(3, 368);
            this.pl_Crypto_Botton.Name = "pl_Crypto_Botton";
            this.pl_Crypto_Botton.Size = new System.Drawing.Size(733, 135);
            this.pl_Crypto_Botton.TabIndex = 1;
            // 
            // btn_Xxtea_Dec
            // 
            this.btn_Xxtea_Dec.Location = new System.Drawing.Point(653, 98);
            this.btn_Xxtea_Dec.Name = "btn_Xxtea_Dec";
            this.btn_Xxtea_Dec.Size = new System.Drawing.Size(77, 23);
            this.btn_Xxtea_Dec.TabIndex = 29;
            this.btn_Xxtea_Dec.Text = "Xxtea解密";
            this.btn_Xxtea_Dec.UseVisualStyleBackColor = true;
            this.btn_Xxtea_Dec.Click += new System.EventHandler(this.btn_Xxtea_Dec_Click);
            // 
            // btn_Xxtea_Cryt
            // 
            this.btn_Xxtea_Cryt.Location = new System.Drawing.Point(653, 68);
            this.btn_Xxtea_Cryt.Name = "btn_Xxtea_Cryt";
            this.btn_Xxtea_Cryt.Size = new System.Drawing.Size(77, 23);
            this.btn_Xxtea_Cryt.TabIndex = 28;
            this.btn_Xxtea_Cryt.Text = "Xxtea加密";
            this.btn_Xxtea_Cryt.UseVisualStyleBackColor = true;
            this.btn_Xxtea_Cryt.Click += new System.EventHandler(this.btn_Xxtea_Cryt_Click);
            // 
            // btn_RSA_Dec
            // 
            this.btn_RSA_Dec.Location = new System.Drawing.Point(653, 39);
            this.btn_RSA_Dec.Name = "btn_RSA_Dec";
            this.btn_RSA_Dec.Size = new System.Drawing.Size(77, 23);
            this.btn_RSA_Dec.TabIndex = 27;
            this.btn_RSA_Dec.Text = "RSA解密";
            this.btn_RSA_Dec.UseVisualStyleBackColor = true;
            this.btn_RSA_Dec.Click += new System.EventHandler(this.btn_RSA_Dec_Click);
            // 
            // btn_RSA_Cryt
            // 
            this.btn_RSA_Cryt.Location = new System.Drawing.Point(653, 9);
            this.btn_RSA_Cryt.Name = "btn_RSA_Cryt";
            this.btn_RSA_Cryt.Size = new System.Drawing.Size(77, 23);
            this.btn_RSA_Cryt.TabIndex = 26;
            this.btn_RSA_Cryt.Text = "RSA加密";
            this.btn_RSA_Cryt.UseVisualStyleBackColor = true;
            this.btn_RSA_Cryt.Click += new System.EventHandler(this.btn_RSA_Cryt_Click);
            // 
            // btn_DES_Dec
            // 
            this.btn_DES_Dec.Location = new System.Drawing.Point(572, 98);
            this.btn_DES_Dec.Name = "btn_DES_Dec";
            this.btn_DES_Dec.Size = new System.Drawing.Size(77, 23);
            this.btn_DES_Dec.TabIndex = 25;
            this.btn_DES_Dec.Text = "DES解密";
            this.btn_DES_Dec.UseVisualStyleBackColor = true;
            this.btn_DES_Dec.Click += new System.EventHandler(this.btn_DES_Dec_Click);
            // 
            // btn_DES_Cryt
            // 
            this.btn_DES_Cryt.Location = new System.Drawing.Point(572, 68);
            this.btn_DES_Cryt.Name = "btn_DES_Cryt";
            this.btn_DES_Cryt.Size = new System.Drawing.Size(77, 23);
            this.btn_DES_Cryt.TabIndex = 24;
            this.btn_DES_Cryt.Text = "DES加密";
            this.btn_DES_Cryt.UseVisualStyleBackColor = true;
            this.btn_DES_Cryt.Click += new System.EventHandler(this.btn_DES_Cryt_Click);
            // 
            // btn_MARC4_Dec
            // 
            this.btn_MARC4_Dec.Location = new System.Drawing.Point(572, 39);
            this.btn_MARC4_Dec.Name = "btn_MARC4_Dec";
            this.btn_MARC4_Dec.Size = new System.Drawing.Size(77, 23);
            this.btn_MARC4_Dec.TabIndex = 23;
            this.btn_MARC4_Dec.Text = "MARC4解密";
            this.btn_MARC4_Dec.UseVisualStyleBackColor = true;
            this.btn_MARC4_Dec.Click += new System.EventHandler(this.btn_MARC4_Dec_Click);
            // 
            // btn_MARC4_Cryt
            // 
            this.btn_MARC4_Cryt.Location = new System.Drawing.Point(572, 9);
            this.btn_MARC4_Cryt.Name = "btn_MARC4_Cryt";
            this.btn_MARC4_Cryt.Size = new System.Drawing.Size(77, 23);
            this.btn_MARC4_Cryt.TabIndex = 22;
            this.btn_MARC4_Cryt.Text = "MARC4加密";
            this.btn_MARC4_Cryt.UseVisualStyleBackColor = true;
            this.btn_MARC4_Cryt.Click += new System.EventHandler(this.btn_MARC4_Cryt_Click);
            // 
            // btn_Rabbit_Dec
            // 
            this.btn_Rabbit_Dec.Location = new System.Drawing.Point(490, 97);
            this.btn_Rabbit_Dec.Name = "btn_Rabbit_Dec";
            this.btn_Rabbit_Dec.Size = new System.Drawing.Size(77, 23);
            this.btn_Rabbit_Dec.TabIndex = 21;
            this.btn_Rabbit_Dec.Text = "Rabbit解密";
            this.btn_Rabbit_Dec.UseVisualStyleBackColor = true;
            this.btn_Rabbit_Dec.Click += new System.EventHandler(this.btn_Rabbit_Dec_Click);
            // 
            // btn_Rabbit_Cryt
            // 
            this.btn_Rabbit_Cryt.Location = new System.Drawing.Point(490, 68);
            this.btn_Rabbit_Cryt.Name = "btn_Rabbit_Cryt";
            this.btn_Rabbit_Cryt.Size = new System.Drawing.Size(77, 23);
            this.btn_Rabbit_Cryt.TabIndex = 20;
            this.btn_Rabbit_Cryt.Text = "Rabbit加密";
            this.btn_Rabbit_Cryt.UseVisualStyleBackColor = true;
            this.btn_Rabbit_Cryt.Click += new System.EventHandler(this.btn_Rabbit_Cryt_Click);
            // 
            // btn_AES_Dec
            // 
            this.btn_AES_Dec.Location = new System.Drawing.Point(490, 39);
            this.btn_AES_Dec.Name = "btn_AES_Dec";
            this.btn_AES_Dec.Size = new System.Drawing.Size(77, 23);
            this.btn_AES_Dec.TabIndex = 19;
            this.btn_AES_Dec.Text = "AES解密";
            this.btn_AES_Dec.UseVisualStyleBackColor = true;
            this.btn_AES_Dec.Click += new System.EventHandler(this.btn_AES_Dec_Click);
            // 
            // btn_AES_Cryt
            // 
            this.btn_AES_Cryt.Location = new System.Drawing.Point(490, 9);
            this.btn_AES_Cryt.Name = "btn_AES_Cryt";
            this.btn_AES_Cryt.Size = new System.Drawing.Size(77, 23);
            this.btn_AES_Cryt.TabIndex = 18;
            this.btn_AES_Cryt.Text = "AES加密";
            this.btn_AES_Cryt.UseVisualStyleBackColor = true;
            this.btn_AES_Cryt.Click += new System.EventHandler(this.btn_AES_Cryt_Click);
            // 
            // txt_RSA_PARA
            // 
            this.txt_RSA_PARA.Location = new System.Drawing.Point(248, 106);
            this.txt_RSA_PARA.Name = "txt_RSA_PARA";
            this.txt_RSA_PARA.Size = new System.Drawing.Size(233, 20);
            this.txt_RSA_PARA.TabIndex = 17;
            this.txt_RSA_PARA.Text = "89242ae2b4036f219c90a4ac7ac47757";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(203, 109);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(45, 11);
            this.label7.TabIndex = 16;
            this.label7.Text = "RSA参数";
            // 
            // txt_RSA_DKEY
            // 
            this.txt_RSA_DKEY.Location = new System.Drawing.Point(248, 82);
            this.txt_RSA_DKEY.Name = "txt_RSA_DKEY";
            this.txt_RSA_DKEY.Size = new System.Drawing.Size(233, 20);
            this.txt_RSA_DKEY.TabIndex = 15;
            this.txt_RSA_DKEY.Text = "73189b2ebe7cde2fa0af1f4ce84b8fd9";
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(203, 85);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(45, 11);
            this.label6.TabIndex = 14;
            this.label6.Text = "RSA私钥";
            // 
            // txt_RSA_EKEY
            // 
            this.txt_RSA_EKEY.Location = new System.Drawing.Point(248, 59);
            this.txt_RSA_EKEY.Name = "txt_RSA_EKEY";
            this.txt_RSA_EKEY.Size = new System.Drawing.Size(233, 20);
            this.txt_RSA_EKEY.TabIndex = 13;
            this.txt_RSA_EKEY.Text = "82786068c60c2b84bdfe7a1e61be9c69";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(203, 62);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(45, 11);
            this.label5.TabIndex = 12;
            this.label5.Text = "RSA公钥";
            // 
            // txt_RSA_MAXD
            // 
            this.txt_RSA_MAXD.Location = new System.Drawing.Point(248, 36);
            this.txt_RSA_MAXD.Name = "txt_RSA_MAXD";
            this.txt_RSA_MAXD.Size = new System.Drawing.Size(233, 20);
            this.txt_RSA_MAXD.TabIndex = 11;
            this.txt_RSA_MAXD.Text = "19";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(203, 39);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(45, 11);
            this.label4.TabIndex = 10;
            this.label4.Text = "RSA数长";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(217, 12);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(27, 11);
            this.label3.TabIndex = 9;
            this.label3.Text = "密钥";
            // 
            // txt_Crypto_Key
            // 
            this.txt_Crypto_Key.Location = new System.Drawing.Point(248, 9);
            this.txt_Crypto_Key.Name = "txt_Crypto_Key";
            this.txt_Crypto_Key.Size = new System.Drawing.Size(233, 20);
            this.txt_Crypto_Key.TabIndex = 8;
            this.txt_Crypto_Key.Text = "Secret Passphrase";
            // 
            // btn_HMACSHA256_Cryt
            // 
            this.btn_HMACSHA256_Cryt.Location = new System.Drawing.Point(98, 93);
            this.btn_HMACSHA256_Cryt.Name = "btn_HMACSHA256_Cryt";
            this.btn_HMACSHA256_Cryt.Size = new System.Drawing.Size(99, 23);
            this.btn_HMACSHA256_Cryt.TabIndex = 7;
            this.btn_HMACSHA256_Cryt.Text = "HMAC-SHA256加密";
            this.btn_HMACSHA256_Cryt.UseVisualStyleBackColor = true;
            this.btn_HMACSHA256_Cryt.Click += new System.EventHandler(this.btn_HMACSHA256_Cryt_Click);
            // 
            // btn_HMACSHA1_Cryt
            // 
            this.btn_HMACSHA1_Cryt.Location = new System.Drawing.Point(98, 64);
            this.btn_HMACSHA1_Cryt.Name = "btn_HMACSHA1_Cryt";
            this.btn_HMACSHA1_Cryt.Size = new System.Drawing.Size(99, 23);
            this.btn_HMACSHA1_Cryt.TabIndex = 6;
            this.btn_HMACSHA1_Cryt.Text = "HMAC-SHA1加密";
            this.btn_HMACSHA1_Cryt.UseVisualStyleBackColor = true;
            this.btn_HMACSHA1_Cryt.Click += new System.EventHandler(this.btn_HMACSHA1_Cryt_Click);
            // 
            // btn_HMACMD5_Cryt
            // 
            this.btn_HMACMD5_Cryt.Location = new System.Drawing.Point(98, 35);
            this.btn_HMACMD5_Cryt.Name = "btn_HMACMD5_Cryt";
            this.btn_HMACMD5_Cryt.Size = new System.Drawing.Size(99, 23);
            this.btn_HMACMD5_Cryt.TabIndex = 5;
            this.btn_HMACMD5_Cryt.Text = "HMAC-MD5加密";
            this.btn_HMACMD5_Cryt.UseVisualStyleBackColor = true;
            this.btn_HMACMD5_Cryt.Click += new System.EventHandler(this.btn_HMACMD5_Cryt_Click);
            // 
            // btn_SHA256_Cryt
            // 
            this.btn_SHA256_Cryt.Location = new System.Drawing.Point(17, 93);
            this.btn_SHA256_Cryt.Name = "btn_SHA256_Cryt";
            this.btn_SHA256_Cryt.Size = new System.Drawing.Size(75, 23);
            this.btn_SHA256_Cryt.TabIndex = 4;
            this.btn_SHA256_Cryt.Text = "SHA256加密";
            this.btn_SHA256_Cryt.UseVisualStyleBackColor = true;
            this.btn_SHA256_Cryt.Click += new System.EventHandler(this.btn_SHA256_Cryt_Click);
            // 
            // btn_SHA1_Cryt
            // 
            this.btn_SHA1_Cryt.Location = new System.Drawing.Point(17, 64);
            this.btn_SHA1_Cryt.Name = "btn_SHA1_Cryt";
            this.btn_SHA1_Cryt.Size = new System.Drawing.Size(75, 23);
            this.btn_SHA1_Cryt.TabIndex = 3;
            this.btn_SHA1_Cryt.Text = "SHA1加密";
            this.btn_SHA1_Cryt.UseVisualStyleBackColor = true;
            this.btn_SHA1_Cryt.Click += new System.EventHandler(this.btn_SHA1_Cryt_Click);
            // 
            // btn_MD5_Cryt
            // 
            this.btn_MD5_Cryt.Location = new System.Drawing.Point(17, 35);
            this.btn_MD5_Cryt.Name = "btn_MD5_Cryt";
            this.btn_MD5_Cryt.Size = new System.Drawing.Size(75, 23);
            this.btn_MD5_Cryt.TabIndex = 2;
            this.btn_MD5_Cryt.Text = "MD5加密";
            this.btn_MD5_Cryt.UseVisualStyleBackColor = true;
            this.btn_MD5_Cryt.Click += new System.EventHandler(this.btn_MD5_Cryt_Click);
            // 
            // btn_toUTF
            // 
            this.btn_toUTF.Location = new System.Drawing.Point(98, 6);
            this.btn_toUTF.Name = "btn_toUTF";
            this.btn_toUTF.Size = new System.Drawing.Size(99, 23);
            this.btn_toUTF.TabIndex = 1;
            this.btn_toUTF.Text = "HEX串转原文";
            this.btn_toUTF.UseVisualStyleBackColor = true;
            this.btn_toUTF.Click += new System.EventHandler(this.btn_toUTF_Click);
            // 
            // btn_toHex
            // 
            this.btn_toHex.Location = new System.Drawing.Point(17, 6);
            this.btn_toHex.Name = "btn_toHex";
            this.btn_toHex.Size = new System.Drawing.Size(75, 23);
            this.btn_toHex.TabIndex = 0;
            this.btn_toHex.Text = "原文转HEX串";
            this.btn_toHex.UseVisualStyleBackColor = true;
            this.btn_toHex.Click += new System.EventHandler(this.btn_toHex_Click);
            // 
            // pl_Crypto_BaseString
            // 
            this.pl_Crypto_BaseString.Controls.Add(this.txt_Crypto_BaseString);
            this.pl_Crypto_BaseString.Controls.Add(this.label1);
            this.pl_Crypto_BaseString.Dock = System.Windows.Forms.DockStyle.Top;
            this.pl_Crypto_BaseString.Location = new System.Drawing.Point(3, 3);
            this.pl_Crypto_BaseString.Name = "pl_Crypto_BaseString";
            this.pl_Crypto_BaseString.Size = new System.Drawing.Size(733, 187);
            this.pl_Crypto_BaseString.TabIndex = 0;
            // 
            // txt_Crypto_BaseString
            // 
            this.txt_Crypto_BaseString.Dock = System.Windows.Forms.DockStyle.Fill;
            this.txt_Crypto_BaseString.Location = new System.Drawing.Point(0, 11);
            this.txt_Crypto_BaseString.Multiline = true;
            this.txt_Crypto_BaseString.Name = "txt_Crypto_BaseString";
            this.txt_Crypto_BaseString.Size = new System.Drawing.Size(733, 176);
            this.txt_Crypto_BaseString.TabIndex = 1;
            this.txt_Crypto_BaseString.Text = "Message";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Dock = System.Windows.Forms.DockStyle.Top;
            this.label1.Location = new System.Drawing.Point(0, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(27, 11);
            this.label1.TabIndex = 0;
            this.label1.Text = "原文";
            // 
            // tabPage2
            // 
            this.tabPage2.Controls.Add(this.button1);
            this.tabPage2.Location = new System.Drawing.Point(4, 20);
            this.tabPage2.Name = "tabPage2";
            this.tabPage2.Size = new System.Drawing.Size(739, 506);
            this.tabPage2.TabIndex = 1;
            this.tabPage2.Text = "JSON";
            this.tabPage2.UseVisualStyleBackColor = true;
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(285, 151);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(75, 23);
            this.button1.TabIndex = 0;
            this.button1.Text = "button1";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // TestLib
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 11F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(747, 530);
            this.Controls.Add(this.tab_Main);
            this.Name = "TestLib";
            this.Text = "UITool-Lib-Test";
            this.tab_Main.ResumeLayout(false);
            this.tabPage1.ResumeLayout(false);
            this.pl_Crypto_CrytString.ResumeLayout(false);
            this.pl_Crypto_CrytString.PerformLayout();
            this.pl_Crypto_Botton.ResumeLayout(false);
            this.pl_Crypto_Botton.PerformLayout();
            this.pl_Crypto_BaseString.ResumeLayout(false);
            this.pl_Crypto_BaseString.PerformLayout();
            this.tabPage2.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TabControl tab_Main;
        private System.Windows.Forms.TabPage tabPage1;
        private System.Windows.Forms.Panel pl_Crypto_BaseString;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox txt_Crypto_BaseString;
        private System.Windows.Forms.Panel pl_Crypto_Botton;
        private System.Windows.Forms.Panel pl_Crypto_CrytString;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox txt_CrytString;
        private System.Windows.Forms.Button btn_toHex;
        private System.Windows.Forms.Button btn_toUTF;
        private System.Windows.Forms.Button btn_MD5_Cryt;
        private System.Windows.Forms.Button btn_SHA1_Cryt;
        private System.Windows.Forms.Button btn_SHA256_Cryt;
        private System.Windows.Forms.Button btn_HMACMD5_Cryt;
        private System.Windows.Forms.Button btn_HMACSHA256_Cryt;
        private System.Windows.Forms.Button btn_HMACSHA1_Cryt;
        private System.Windows.Forms.TextBox txt_Crypto_Key;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox txt_RSA_MAXD;
        private System.Windows.Forms.TextBox txt_RSA_DKEY;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.TextBox txt_RSA_EKEY;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.TextBox txt_RSA_PARA;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Button btn_AES_Cryt;
        private System.Windows.Forms.Button btn_AES_Dec;
        private System.Windows.Forms.Button btn_Rabbit_Dec;
        private System.Windows.Forms.Button btn_Rabbit_Cryt;
        private System.Windows.Forms.Button btn_MARC4_Dec;
        private System.Windows.Forms.Button btn_MARC4_Cryt;
        private System.Windows.Forms.Button btn_DES_Dec;
        private System.Windows.Forms.Button btn_DES_Cryt;
        private System.Windows.Forms.Button btn_Xxtea_Dec;
        private System.Windows.Forms.Button btn_Xxtea_Cryt;
        private System.Windows.Forms.Button btn_RSA_Dec;
        private System.Windows.Forms.Button btn_RSA_Cryt;
        private System.Windows.Forms.TabPage tabPage2;
        private System.Windows.Forms.Button button1;

    }
}

