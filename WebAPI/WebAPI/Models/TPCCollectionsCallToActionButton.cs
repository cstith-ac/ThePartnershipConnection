using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class TPCCollectionsCallToActionButton
    {
        public int Customer_Id { get; set; }
        public Int64 RowNum { get; set; }
        public string Customer_Number { get; set; }
        public string Customer_Name { get; set; }
        public DateTime Customer_Since { get; set; }
        public decimal TotalRMR { get; set; }
        public string CollectionQueue { get; set; }
        public decimal Bal_Current { get; set; }
        public decimal Bucket_1 { get; set; }
        public decimal Bucket_2 { get; set; }
        public decimal Bucket_3 { get; set; }
        public decimal Bucket_4 { get; set; }
        public decimal Bucket_5 { get; set; }
        public decimal TotalBalance { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneContact { get; set; }
        public string AddressOnFile { get; set; }
        public string UsesAutoPay { get; set; }
    }
}
