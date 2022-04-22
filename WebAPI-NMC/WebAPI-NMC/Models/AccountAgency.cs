using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI_NMC.Models
{
    public class AccountAgency
    {
        public int? agency_no { get; set; }
        public string agencytype_id { get; set; }
        public string agency_name { get; set; }
        public string phone1 { get; set; }
        public string permit_no { get; set; }
        public string permtype_id { get; set; }
        public DateTime? effective_date { get; set; }
        public string permstat_id { get; set; }
        public string descr { get; set; }
        public DateTime? expire_date { get; set; }
        public string err_msg { get; set; }
    }
}
