using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class CustomerSearchMatch
    {
        public int CustomerID { get; set; }
        public string CustomerName { get; set; }
        public string CustomerNumber { get; set; }
    }
}
