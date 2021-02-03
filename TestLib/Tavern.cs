using System;
using System.Collections.Generic;
using System.Text;

namespace TestLib
{

    public enum PaymentMethod
    {
        Cash,
        Check,
        Visa,
        Mastercard,
        AmericanExpress
    }

    public class SubObj
    {
        public SubObj()
        {
        }

        public string K1 = "k1";
        public int K2 = 2;
        public bool K3 = false;
    }

    public class Tavern
    {

        public Tavern()
        {
        }

        public SubObj sub = new SubObj();

        public bool btt = false;

        private string _business;
        public string Business
        {
            get { return this._business; }
            set { this._business = value; }
        }

        private string _address;
        public string Address
        {
            get { return this._address; }
            set { this._address = value; }
        }

        private string _city;
        public string City
        {
            get { return this._city; }
            set { this._city = value; }
        }

        private string _state;
        public string State
        {
            get { return this._state; }
            set { this._state = value; }
        }

        private int _zipcode;
        public int Zipcode
        {
            get { return this._zipcode; }
            set { this._zipcode = value; }
        }

        private double _latitude;
        public double Latitude
        {
            get { return this._latitude; }
            set { this._latitude = value; }
        }

        private double _longitude;
        public double Longitude
        {
            get { return this._longitude; }
            set { this._longitude = value; }
        }

        private bool _coverCharge;
        public bool CoverCharge
        {
            get { return this._coverCharge; }
            set { this._coverCharge = value; }
        }

        private string _url;
        public string Url
        {
            get { return this._url; }
            set { this._url = value; }
        }

        private List<PaymentMethod> _paymentMethods;
        public PaymentMethod[] PaymentMethods
        {
            get { return this._paymentMethods.ToArray(); }
        }

        public string[] xxx
        {
            get { return new string[10]; }
        }

        public string xxxxx = "ddd";

        public void AddPaymentMethod(PaymentMethod paymentMethod)
        {
            if (this._paymentMethods == null)
            {
                this._paymentMethods = new List<PaymentMethod>();
            }
            if (!this._paymentMethods.Contains(paymentMethod))
            {
                this._paymentMethods.Add(paymentMethod);
            }
        }


    }
}
