using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI_NMC.Models
{
    public class EventCode
    {
        public string event_id { get; set; }
        public string descr { get; set; }
        public string response_code { get; set; }
        public string priority { get; set; }
    }
}
