using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class CustomerCareDashboardInfoS
    {
        public string CustomerNumber { get; set; }
        public string CustomerName { get; set; }
        public string SpecialFlag { get; set; }
        public int? PartnerID { get; set; }
        public string PartnerName { get; set; }
        public int? SiteCount { get; set; }
        public int? SystemCount { get; set; }
        public string TotalRMR { get; set; }
        public int? NoEmail { get; set; }
        public string EmailAddress { get; set; }
        public int? HasAutoPayment { get; set; }
        public string AutoPayType { get; set; }
        public string LastFourDigits { get; set; }
        public DateTime? CCExpires { get; set; }
        public string Prompt0 { get; set; }
        public string Prompt1 { get; set; }
        public string Prompt2 { get; set; }
        public string Prompt3 { get; set; }
        public string Prompt4 { get; set; }
        public string Prompt5 { get; set; }
        public string Prompt6 { get; set; }
        public string Prompt7 { get; set; }
        public string Prompt8 { get; set; }
        public string Prompt9 { get; set; }
        public string CustomerRating { get; set; }
        public int? CustomerRatingValue { get; set; }
        public int? DashboardStyle { get; set; }
        public int? LastServiceTicketID { get; set; }
        public string LastVisitInfo { get; set; }
        public string ServicedBy { get; set; }
        public int? InvoicesArePrinted { get; set; }
        public int? InvoicesAreEmailed { get; set; }
        public string PH1 { get; set; }
        public string PH2 { get; set; }
        public string PH3 { get; set; }
        public int? TicketsLastSixMonths { get; set; }
        public string GuaranteeStatus { get; set; }
        public string CriticalMessage { get; set; }
        public string LastNote { get; set; }
        public string PartnerKeyWords { get; set; }
        public string BillFrequency { get; set; }
        public string NextCycleOn { get; set; }
        public string HasSeparateSiteAddress { get; set; }
        public int? AlternateServiceCompanyActive { get; set; }
        public string AutoPaymentMessage { get; set; }
        public int RMID { get; set; }
        public string RMName { get; set; }
    }
}
