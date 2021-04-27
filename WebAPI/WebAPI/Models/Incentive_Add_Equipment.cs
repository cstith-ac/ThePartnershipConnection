using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class Incentive_Add_Equipment
    {
        public int IncentiveID { get; set; }
        public int ItemID { get; set; }
        public string Description { get; set; }
        public decimal Quantity { get; set; }
        public decimal Cost { get; set; }
    }
}
