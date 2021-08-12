using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class PartnerInvoiceListing
    {
        public int TicketID { get; set; }
        public int IncentiveID { get; set; }
        public string VendorInvoiceNumber { get; set; }
        public string InvoiceAmount { get; set; }
        public string InvoiceDate { get; set; }
        public string ApprovedAmount { get; set; }
        public string DateEntered { get; set; }
        public string TicketNumber { get; set; }
        public string Customer_Number { get; set; }
        public string Customer_Name { get; set; }
        public string Problem_Code { get; set; }
        public string ResolvedNotClosed { get; set; }
        public string Determination { get; set; }
        public string DeterminedOn { get; set; }
        public string HeldReason { get; set; }
        public string APInvoiceNumber { get; set; }
        public string APInvoiceAmount { get; set; }
        public string CheckNumber { get; set; }
        public string CheckDate { get; set; }
        public string AmountPaid { get; set; }
        public string CreditAmount { get; set; }
        public string CreditDate { get; set; }
        public string RelevantMemo { get; set; }
        public string RelevantComment { get; set; }
        public string RepeatOrder { get; set; }
    }
}
