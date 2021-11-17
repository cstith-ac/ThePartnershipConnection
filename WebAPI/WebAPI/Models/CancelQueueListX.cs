using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class CancelQueueListX
    {
        public int Cancel_Queue_Id { get; set; }
        public string Customer_Number { get; set; }
        public string Customer_Name { get; set; }
        public int SiteCount { get; set; }
        public string Full_Cancel { get; set; }
        public string RMR_Reason_Code { get; set; }
        public DateTime Notice_Date { get; set; }
        public DateTime Effective_Date { get; set; }
        public decimal CancelledRMR { get; set; }
        public decimal Balance_Of_Contract { get; set; }
        public string Reference { get; set; }
        public string Memo { get; set; }
        public string Address_1 { get; set; }
        public string Address_2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string E_Mail { get; set; }
        public string PrimaryPhone { get; set; }
        public string AlternatePhone { get; set; }
    }
}
