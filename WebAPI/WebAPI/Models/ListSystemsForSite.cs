using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class ListSystemsForSite
    {
        public int Customer_System_id { get; set; }
        public string AlarmAccount { get; set; }
        public string SystemType { get; set; }
        public string SystemStatus { get; set; }
    }
}
