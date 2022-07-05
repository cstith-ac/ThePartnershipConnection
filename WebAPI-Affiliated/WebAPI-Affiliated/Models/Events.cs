using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI_Affiliated.Models
{
    public class Events
    {
        public string event_date { get; set; }
        public string seqno { get; set; }
        public string alarminc_no { get; set; }
        public int system_no { get; set; }
        public string zone_id { get; set; }
        public string full_clear_flag { get; set; }
        public object test_seqno { get; set; }
        public string event_id { get; set; }
        public string event_descr { get; set; }
        public object user_name { get; set; }
        public object user_id { get; set; }
        public object area { get; set; }
        public object zonestate_id { get; set; }
        public string match { get; set; }
        public object phone { get; set; }
        public object zone_comment { get; set; }
        public string additional_info { get; set; }
        public string servtype_id { get; set; }
        public object procopt_id { get; set; }
        public string cs_no { get; set; }
        public string site_name { get; set; }
    }

    public class EventResponse3
    {
        public string result { get; set; }
        public List<Events> events { get; set; }
    }
}
