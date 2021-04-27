using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class Incentive_Add_Recurring
    {
        public int IncentiveID { get; set; }
        public int ItemID { get; set; }
        public string Description { get; set; }
        public string BillCycle { get; set; }
        public decimal RMR { get; set; }
        public decimal PassThrough { get; set; }
        public DateTime BillingStartDate { get; set; }
        public int Multiple { get; set; }
        public int Add2Item { get; set; }
    }
}
