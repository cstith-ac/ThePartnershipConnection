using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI_NMC.Models
{
    public class AccountZones
    {
        public string zone_id { get; set; }
        public int? alarmgrp_no { get; set; }
        public string equiploc_id { get; set; }
        public string restore_reqd_flag { get; set; }
        public string arm_disarm { get; set; }
        public string alarm_state_flag { get; set; }
        public DateTime trouble_state_flag { get; set; }
        public string bypass_state_flag { get; set; }
        public int? trip_count { get; set; }
        public string comment { get; set; }
        public string equiptype_id { get; set; }
        public string camera_zone_id { get; set; }
        public string default_flag { get; set; }
        public string disable_flag { get; set; }
        public string zonestate_id { get; set; }
        public string event_id { get; set; }
        public string pr_comment { get; set; }
    }
}
