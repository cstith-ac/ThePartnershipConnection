using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI_CMS.Models
{
    public class Zones
    {
        public string system_no { get; set; }
        public string zone_id { get; set; }
        public string old_zone_id { get; set; }
        public string zonestate_descr { get; set; }
        public string zonestate_id { get; set; }
        public string old_zonestate_id { get; set; }
        public string servtype_id { get; set; }
        public string event_descr { get; set; }
        public string event_id { get; set; }
        public string equiploc_id { get; set; }
        public string comment50s { get; set; }
        public string restore_reqd_flag2 { get; set; }
        public string restore_reqd_flag21 { get; set; }
        public string arm_disarm { get; set; }
        public string alarm_state_flag { get; set; }
        public string trouble_state_flag { get; set; }
        public string bypass_state_flag { get; set; }
        public string trip_count { get; set; }
        public string equiptype_descr { get; set; }
        public string equiptype_id { get; set; }
        public string status_change_date { get; set; }
        public string alarmgrp_no { get; set; }
        public string alarmgrp_descr { get; set; }
        public string sched_no { get; set; }
        public string req_type { get; set; }
    }
}
