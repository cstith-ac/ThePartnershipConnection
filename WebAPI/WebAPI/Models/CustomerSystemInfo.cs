using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class CustomerSystemInfo
    {
        public string AlarmAccount { get; set; }
        public string MonitoredBy { get; set; }
        public string AddressLine { get; set; }
        public string FeatureMessage { get; set; }
        public string SystemType { get; set; }
        public string OriginalContractDate { get; set; }
        public int? OriginalContractMonths { get; set; }
        public string PanelType { get; set; }
        public string CellCarrier { get; set; }
        public string CellModel { get; set; }
        public string SystemNotes { get; set; }
        public string Maintenance { get; set; }
        public string ServiceCompany { get; set; }
        public int? ServiceCompanyID { get; set; }
        public int? LastServiceTicketID { get; set; }
        public string LastServiceTicketOn { get; set; }
        public Decimal? RMRValue { get; set; }
        public string CustomerNumber { get; set; }
        public string CustomerName { get; set; }
        public string CustomerRating { get; set; }
        public int? CustomerRatingValue { get; set; }
        public string ContractStatus { get; set; }
        public string BillFrequency { get; set; }
        public string NextCycleOn { get; set; }
        public int? AlternateServiceCompanyActive { get; set; }
    }
}
