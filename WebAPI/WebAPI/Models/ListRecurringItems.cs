using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class ListRecurringItems
    {
        public int item_id { get; set; }
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public string ExistsOnSystem { get; set; }
    }
}
