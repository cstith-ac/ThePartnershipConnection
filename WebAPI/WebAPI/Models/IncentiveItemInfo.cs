using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class IncentiveItemInfo
    {
        public int item_id { get; set; }
        public string ItemCode { get; set; }
        public string ItemDescription { get; set; }
        public Decimal DefaultRate { get; set; }
        public string ItemType { get; set; }
    }
}
