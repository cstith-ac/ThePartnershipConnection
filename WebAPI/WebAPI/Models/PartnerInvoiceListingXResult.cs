using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class PartnerInvoiceListingXResult
    {
        public string EmailAddress { get; set; }
        public int Filter { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string AliasEmail { get; set; }
    }
}
