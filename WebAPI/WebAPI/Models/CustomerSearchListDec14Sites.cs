using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class CustomerSearchListDec14Sites
    {
        public int customer_id { get; set; }
        public int Customer_Site_Id { get; set; }
        public string Customer_Number { get; set; }
        public string Customer_Name { get; set; }
        public string CustomerStatus { get; set; }
        public string Address_1 { get; set; }
        public string Address_2 { get; set; }
        public string Address_3 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Site_Number { get; set; }
        public string SiteName { get; set; }
        public string SiteStatus { get; set; }
        public string PendingCancel { get; set; }
        public string CollectionsStatus { get; set; }
    }
}
