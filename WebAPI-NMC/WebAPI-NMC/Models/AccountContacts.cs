using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI_NMC.Models
{
    public class AccountContacts
    {
        public string last_name { get; set; }
        public string first_name { get; set; }
        public string ctactype_id { get; set; }
        public int? cs_seqno { get; set; }
        public string auth_id { get; set; }
        public string relation_id { get; set; }
        public string pin { get; set; }
        public string has_key_flag { get; set; }
        public string phone1 { get; set; }
        public string phonetype1 { get; set; }
        public int? phone1_seqno { get; set; }
        public string phone2 { get; set; }
        public string phonetype2 { get; set; }
        public int? phone2_seqno { get; set; }
        public string phone3 { get; set; }
        public string phonetype3 { get; set; }
        public int? phone3_seqno { get; set; }
        public string phone4 { get; set; }
        public string phonetype4 { get; set; }
        public int? phone4_seqno { get; set; }
        public string? email_address { get; set; }
        public int? ctaclink_no { get; set; }
        public int? contact_no { get; set; }
        public string? contltype_no { get; set; }
        public int? user_id { get; set; }
        public string err_msg { get; set; }
    }
}
