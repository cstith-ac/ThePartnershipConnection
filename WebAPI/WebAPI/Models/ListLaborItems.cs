using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class ListLaborItems
    {
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public decimal DefaultCost { get; set; }
    }
}
