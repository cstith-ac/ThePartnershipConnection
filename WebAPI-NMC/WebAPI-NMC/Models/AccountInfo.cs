using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI_NMC.Models
{
    public class AccountInfo
    {
        public string site_name { get; set; }
        public string site_addr1 { get; set; }
        public string street_no { get; set; }
        public string street_name { get; set; }
        public string sitestat_id { get; set; }
        public string county_name { get; set; }
        public int? timezone_no { get; set; }
        public string site_addr2 { get; set; }
        public string city_name { get; set; }
        public string state_id { get; set; }
        public string zip_code { get; set; }
        public string country_name { get; set; }
        public string phone1 { get; set; }
        public string ext1 { get; set; }
        public string phone2 { get; set; }
        public string ext2 { get; set; }
        public string cross_street { get; set; }
        public string codeword1 { get; set; }
        public string codeword2 { get; set; }
        public string mapbook_id { get; set; }
        public string map_page { get; set; }
        public string map_coord { get; set; }
        public DateTime? orig_install_date { get; set; }
        public string cs_no { get; set; }
        public string panel_phone { get; set; }
        public string download_phone { get; set; }
        public string receiver_phone { get; set; }
        public string backup_phone { get; set; }
        public string panel_location { get; set; }
        public string panel_id { get; set; }
        public string timezone_descr { get; set; }
        public string mapbook_descr { get; set; }
        public string opt_2 { get; set; }
        public string opt_3 { get; set; }
        public string opt_4 { get; set; }
        public string opt_5 { get; set; }
        public string opt_6 { get; set; }
        public string opt_7 { get; set; }
        public string permit_no { get; set; }
        public DateTime? ontest_expire_date { get; set; }
        public string last_ani { get; set; }
        public string last_ani_date { get; set; }
        public string ooscat_id { get; set; }
        //public string systype_id { get; set; }
        //public string sitetype_id { get; set; }
        //public string street_id { get; set; }
        public string err_msg { get; set; }
    }
}
