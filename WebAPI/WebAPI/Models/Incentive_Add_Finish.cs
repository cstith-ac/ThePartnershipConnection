using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class Incentive_Add_Finish
    {
        public int IncentiveID { get; set; }
        public decimal PartnerTaxAmount { get; set; }
        public string ServiceChecked { get; set; }
        //public string Comments { get; set; }
        public string ServiceTicketNumber { get; set; }
        public string CustomerEmailAddress { get; set; }
        public string Test { get; set; }
    }
}
