using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class PartnerServiceListingX
    {
        public int Service_Ticket_Id { get; set; }
        public int Ticket_Number { get; set; }
        public DateTime Creation_Date { get; set; }
        public string Customer_Number { get; set; }
        public string Customer_Name { get; set; }
        public string Problem_Code { get; set; }
        public string Business_Name { get; set; }
        public string ComResStatus { get; set; }
        public string Address_1 { get; set; }
        public string Address_2 { get; set; }
        public string Address_3 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string SitePhone { get; set; }
        public string CustomerComments { get; set; }
        public string ContactName { get; set; }
        public string ContactPhone { get; set; }
        public string CustomerEmail { get; set; }
        public DateTime Customer_Since { get; set; }
        public string CSAccount { get; set; }
        public string Panel_Location { get; set; }
        public string SystemType { get; set; }
        public string PanelType { get; set; }
        public string CentralStation { get; set; }
        public string ACContact { get; set; }
        public string ACContactEmail { get; set; }
        public string CollectionQueue { get; set; }
        public string CancelStatus { get; set; }
        public decimal CustomerRMR { get; set; }
        public string Status3G { get; set; }
    }
}
