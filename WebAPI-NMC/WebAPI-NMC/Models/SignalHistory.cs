using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI_NMC.Models
{
    public class SignalHistory
    {
        public string sig_acct { get; set; }
        public DateTime sig_date { get; set; }
        public string sig_code { get; set; }
        public string sig_zone { get; set; }
        public string @event { get; set; }
        public string err_msg { get; set; }
    }

    
}
