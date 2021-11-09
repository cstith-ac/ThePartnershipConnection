using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class PartnerLandingPageX
    {
        public int Over30Count { get; set; }
        public decimal Over30Value { get; set; }
        public int Over60Count { get; set; }
        public decimal Over60Value { get; set; }
        public int Over90Count { get; set; }
        public decimal Over90Value { get; set; }
        public int Over120Count { get; set; }
        public decimal Over120Value { get; set; }
        public int InvoicesInProcess { get; set; }
        public decimal InvoicesInProcessValue { get; set; }
        public int InvoicesOnHold { get; set; }
        public decimal InvoicesOnHoldValue { get; set; }
        public int InvoicesApproved30days { get; set; }
        public decimal InvoicesApproved30daysValue { get; set; }
        public int InvoicesPaid30days { get; set; }
        public decimal InvoicesPaid30daysValue { get; set; }
        public int PendingProspects { get; set; }
        public DateTime OldestProspect { get; set; }
        public int PendingCancels { get; set; }
        public decimal RMRCancels { get; set; }
        public int PendingCancels7days { get; set; }
        public string HighRMRCancelPerson { get; set; }
        public Decimal HighRMRCancelValue { get; set; }
        public int ServiceTicketsPending { get; set; }//Service Ticket Pending
        public DateTime OldestInProgress { get; set; }
        public int ATTCount { get; set; }
        public int VerizonCount { get; set; }
        public int SprintCount { get; set; }
        public int TMobileCount { get; set; }
        public int UnknownCount { get; set; }
        public int UpgradesLastMonth { get; set; }
        public int LifeTimeUpgrades { get; set; }
        public int ProgressPercent { get; set; }
        public Double AttritionLastMonth { get; set; }
        public Double AttritionLast6Months { get; set; }
        public Double AttritionLast12Months { get; set; }
    }
}
