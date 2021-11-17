using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class TPCPartnerAgingReportX
    {
        public string PartnerCode { get; set; }
        public string Customer_Number { get; set; }
        public int SortCust { get; set; }
        public string Customer_Name { get; set; }
        public Decimal ActiveRMR { get; set; }
        public string CollectionQueue { get; set; }
        public string FilterCategory { get; set; }
        public string CustomerSince { get; set; }
        public string LastPay { get; set; }
        public Decimal LastPayAmount { get; set; }
        public string PendingCancellation { get; set; }
        public int Customer_Id { get; set; }
        public Decimal Bucket_1 { get; set; }
        public Decimal Bucket_2 { get; set; }
        public Decimal Bucket_3 { get; set; }
        public Decimal Bucket_4 { get; set; }
        public Decimal Bucket_5 { get; set; }
        public Decimal Bal_Current { get; set; }
        public Decimal AvailableCredit { get; set; }
        public Decimal AvailableCash { get; set; }
        public Decimal TotalDue { get; set; }
        public Decimal PastDue { get; set; }
        public string GuaranteeStatus { get; set; }
        public string Address_1 { get; set; }
        public string Address_2 { get; set; }
        public string Address_3 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string EmailAddress { get; set; }
        public string PrimaryPhone { get; set; }
        public string AlternatePhone { get; set; }
        public string CommercialAccount { get; set; }
    }
}
