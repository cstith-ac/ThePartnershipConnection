using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class CCAssistant_Systems
    {
        public int Customer_Id { get; set; }
        public int Customer_System_Id { get; set; }
        public string Alarm_Account { get; set; }
        public string Alarm_Company_Code { get; set; }
        public string System_Code { get; set; }
        public string Contract_Start_Date { get; set; }
        public int Months { get; set; }
        public int Renewal_Months { get; set; }
        public string ContractExpiration { get; set; }
        public string ContractExpirationMessage { get; set; }
        public string FeatureMessage { get; set; }
        public string RMRAmount { get; set; }
        public string Warranty { get; set; }
        public string SiteAddress { get; set; }
    }
}
