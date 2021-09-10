using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class Customer3GListing
    {
        public int Customer_System_Id { get; set; }
        public string Alarm_Account { get; set; }
        public string Customer_Number { get; set; }
        public string Customer_Name { get; set; }
        public string CustomerType { get; set; }
        public string SiteName { get; set; }
        public string Site_Number { get; set; }
        public string Address_1 { get; set; }
        public string Address_2 { get; set; }
        public string Address_3 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Panel_Type_Code { get; set; }
        public string Panel_Location { get; set; }
        public string System_Code { get; set; }
        public string CellType { get; set; }
        public string CellGeneration { get; set; }
        public string CellModel { get; set; }
        public string Carrier { get; set; }
        public string Offer1 { get; set; }
        public string Offer2 { get; set; }
        public string Offer3 { get; set; }
        public string Offer4 { get; set; }
        public decimal RMRAtCustomer { get; set; }
        public decimal RMRAtSite { get; set; }
        public decimal RMRAtSystem { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerPhone { get; set; }
        public string SitePhone { get; set; }
    }
}
