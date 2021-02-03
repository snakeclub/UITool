using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using JSON;
using System.Security.Cryptography;
using System.IO;


namespace TestLib
{
    public partial class TestLib : Form
    {
        public TestLib()
        {
            InitializeComponent();
        }

        #region 加密:Crypto.dll

        private void btn_toHex_Click(object sender, EventArgs e)
        {
            //
            txt_Crypto_BaseString.Text = Crypto.Crypto.utf8StringToHex(txt_Crypto_BaseString.Text);
        }

        private void btn_toUTF_Click(object sender, EventArgs e)
        {
            txt_Crypto_BaseString.Text = Crypto.Crypto.hexToUtf8String(txt_Crypto_BaseString.Text);
        }

        private void btn_MD5_Cryt_Click(object sender, EventArgs e)
        {
            //
            txt_CrytString.Text = Crypto.Crypto.MD5(txt_Crypto_BaseString.Text);
        }

        private void btn_HMACMD5_Cryt_Click(object sender, EventArgs e)
        {
            txt_CrytString.Text = Crypto.Crypto.HMAC_MD5(txt_Crypto_BaseString.Text,txt_Crypto_Key.Text);
        }

        private void btn_SHA1_Cryt_Click(object sender, EventArgs e)
        {
            txt_CrytString.Text = Crypto.Crypto.SHA1(txt_Crypto_BaseString.Text);
        }

        private void btn_HMACSHA1_Cryt_Click(object sender, EventArgs e)
        {
            txt_CrytString.Text = Crypto.Crypto.HMAC_SHA1(txt_Crypto_BaseString.Text, txt_Crypto_Key.Text);
        }

        private void btn_SHA256_Cryt_Click(object sender, EventArgs e)
        {
            txt_CrytString.Text = Crypto.Crypto.SHA256(txt_Crypto_BaseString.Text);
        }

        private void btn_HMACSHA256_Cryt_Click(object sender, EventArgs e)
        {
            txt_CrytString.Text = Crypto.Crypto.HMAC_SHA256(txt_Crypto_BaseString.Text, txt_Crypto_Key.Text);
        }

        private void btn_AES_Cryt_Click(object sender, EventArgs e)
        {
            txt_CrytString.Text = Crypto.Crypto.AESEncrypt(txt_Crypto_BaseString.Text, txt_Crypto_Key.Text);
        }

        private void btn_AES_Dec_Click(object sender, EventArgs e)
        {
            txt_Crypto_BaseString.Text = Crypto.Crypto.AESDecrypt(txt_CrytString.Text, txt_Crypto_Key.Text);
        }

        private void btn_Rabbit_Cryt_Click(object sender, EventArgs e)
        {
            txt_CrytString.Text = Crypto.Crypto.RabbitEncrypt(txt_Crypto_BaseString.Text, txt_Crypto_Key.Text);
        }

        private void btn_Rabbit_Dec_Click(object sender, EventArgs e)
        {
            txt_Crypto_BaseString.Text = Crypto.Crypto.RabbitDecrypt(txt_CrytString.Text, txt_Crypto_Key.Text);
        }

        private void btn_MARC4_Cryt_Click(object sender, EventArgs e)
        {
            txt_CrytString.Text = Crypto.Crypto.MARC4Encrypt(txt_Crypto_BaseString.Text, txt_Crypto_Key.Text);
        }

        private void btn_MARC4_Dec_Click(object sender, EventArgs e)
        {
            txt_Crypto_BaseString.Text = Crypto.Crypto.MARC4Decrypt(txt_CrytString.Text, txt_Crypto_Key.Text);
        }

        private void btn_DES_Cryt_Click(object sender, EventArgs e)
        {
            txt_CrytString.Text = Crypto.Crypto.DESEncrypt(txt_Crypto_BaseString.Text, txt_Crypto_Key.Text);
        }

        private void btn_DES_Dec_Click(object sender, EventArgs e)
        {
            txt_Crypto_BaseString.Text = Crypto.Crypto.DESDecrypt(txt_CrytString.Text, txt_Crypto_Key.Text);
        }

        private void btn_Xxtea_Cryt_Click(object sender, EventArgs e)
        {
            txt_CrytString.Text = Crypto.Crypto.XxteaEncrypt(txt_Crypto_BaseString.Text, txt_Crypto_Key.Text);
        }

        private void btn_Xxtea_Dec_Click(object sender, EventArgs e)
        {
            txt_Crypto_BaseString.Text = Crypto.Crypto.XxteaDecrypt(txt_CrytString.Text, txt_Crypto_Key.Text);
        }

        private void btn_RSA_Cryt_Click(object sender, EventArgs e)
        {
            txt_CrytString.Text = Crypto.Crypto.RSAEncrypt(txt_Crypto_BaseString.Text, txt_RSA_EKEY.Text, txt_RSA_PARA.Text, txt_RSA_MAXD.Text);
        }

        private void btn_RSA_Dec_Click(object sender, EventArgs e)
        {
            txt_Crypto_BaseString.Text = Crypto.Crypto.RSADecrypt(txt_CrytString.Text, txt_RSA_DKEY.Text, txt_RSA_PARA.Text, txt_RSA_MAXD.Text);
        }

        #endregion 加密:Crypto.dll

        private void button1_Click(object sender, EventArgs e)
        {
            //
            Tavern tavern = new Tavern();
            tavern.Business = "Tractor Tavern";
            tavern.Address = "5213 Ballard Ave NW";
            tavern.City = "Seattle";
            tavern.State = "WA";
            tavern.Zipcode = 98107;
            tavern.Latitude = 47.665663;
            tavern.Longitude = -122.382343;
            tavern.CoverCharge = true;
            tavern.Url = "http://tractortavern.citysearch.com/";
            tavern.AddPaymentMethod(PaymentMethod.Cash);
            tavern.AddPaymentMethod(PaymentMethod.Visa);
            tavern.AddPaymentMethod(PaymentMethod.Mastercard);
            tavern.AddPaymentMethod(PaymentMethod.AmericanExpress);

            JSONObject xx = JSONParse.toJSONObject(JSONParse.ToJSONString(tavern));

            MessageBox.Show(JSONParse.ToJSONString(tavern));
            MessageBox.Show(JSONParse.ToJSONPrint(tavern));

        }

        
        
    }
}
