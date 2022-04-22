using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI_NMC.Models
{
    public class DispatchAgencies
    {
        public int? agency_no { get; set; }
        public string agencytype_id { get; set; }
        public string agency_name { get; set; }
        public string agency_addr1 { get; set; }
        public string agency_addr2 { get; set; }
        public string zip_code { get; set; }
        public string phone1 { get; set; }
        public string phone2 { get; set; }
        public DateTime? change_date { get; set; }
        public string err_msg { get; set; }
    }
}
