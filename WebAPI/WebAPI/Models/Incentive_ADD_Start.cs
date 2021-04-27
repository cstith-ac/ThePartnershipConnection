using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class Incentive_ADD_Start
    {
        public string UserEmailAddress { get; set; }
        public int InstallCompanyID { get; set; }
        public int CustomerID { get; set; }
        public int CustomerSiteID { get; set; }
        public int CustomerSystemID { get; set; }
        public string AlarmAccount { get; set; }
        public int SystemTypeID { get; set; }
        public int PanelTypeID { get; set; }
        public string PanelLocation { get; set; }
        public int CentralStationID { get; set; }
        public string AdditionalInfo { get; set; }
        public string PartnerInvoiceNumber { get; set; }
        public string PartnerInvoiceDate { get; set; }
        public string ContractDate { get; set; }
        public int ContractTerm { get; set; }
        public int RenewalMonths { get; set; }
        public string ServiceIncluded { get; set; }
        public string PartnerComments { get; set; }
        public int JobID { get; set; }
        public string StatusMessage { get; set; }
    }
}
