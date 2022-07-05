using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI_Affiliated.Models
{
    //public class Account
    //{
    //    public string cs_no { get; set; }
    //    public int servco_no { get; set; }
    //    public string dealer_ref_no { get; set; }
    //    public string ext_acct_no { get; set; }
    //    public string device_phone { get; set; }
    //    public string device_id { get; set; }
    //    public string template { get; set; }
    //    public string site_name { get; set; }
    //    public string addr1 { get; set; }
    //    public string addr2 { get; set; }
    //    public string city { get; set; }
    //    public string state { get; set; }
    //    public string zip { get; set; }
    //    public string phone1 { get; set; }
    //    public string phone2 { get; set; }
    //    public string ext1 { get; set; }
    //    public string ext2 { get; set; }
    //    public string cross_street { get; set; }
    //    public string passcode { get; set; }
    //    public string passcode2 { get; set; }
    //    public string timezone { get; set; }
    //    public string municipality { get; set; }
    //    public string language { get; set; }
    //    public string location_type { get; set; }
    //    public string status { get; set; }
    //    public string oos { get; set; }
    //    public string force_address { get; set; }
    //    public string corp_id { get; set; }
    //    public string fall_detector { get; set; }
    //    public List<Agencies>? Agencies { get; set; }
    //    public List<Zones>? Zones { get; set; }
    //    public List<System>? System { get; set; }
    //    public List<Additional_Info>? Additional_Info { get; set; }
    //    public List<Vehicle>? Vehicle { get; set; }
    //    public List<Vital_Statistics>? Vital_Statistics { get; set; }
    //    public List<Contacts>? Contacts { get; set; }
    //}

    //public class Agencies
    //{
    //    public string? agency_no { get; set; }
    //    public string? phone1 { get; set; }
    //    public string? agencytype_id { get; set; }
    //    public string? agency_name { get; set; }
    //    public string? permit_no { get; set; }
    //    public string? effective_date { get; set; }
    //    public string? expire_date { get; set; }
    //    public string? hospice { get; set; }
    //}

    //public class Zones
    //{
    //    public string? zone_id { get; set; }
    //    public string? description { get; set; }
    //    public string? event_id { get; set; }
    //    public string? disp_id { get; set; }
    //}

    //public class System
    //{
    //    public string? timer_frequency { get; set; }
    //    public string? acceptable_timer { get; set; }
    //    public string? fail_instructions { get; set; }
    //    public string? dispatch_instructions { get; set; }
    //    public string? system_descr { get; set; }
    //    public string? change_date { get; set; }
    //}

    //public class Additional_Info
    //{
    //    public string? lockbox_location { get; set; }
    //    public string? lockbox_code { get; set; }
    //    public string? key_location { get; set; }
    //    public string? entry_info { get; set; }
    //    public string? pets { get; set; }
    //    public string? med_list { get; set; }
    //    public string? child { get; set; }
    //    public string? disabled { get; set; }
    //    public string? weapons { get; set; }
    //    public string? pets_bite_warning { get; set; }
    //    public string? oxygen { get; set; }
    //    public string? partner_id { get; set; }
    //    public string? customer_service_no { get; set; }
    //    public string? customer_service_em { get; set; }
    //    public string? hospital { get; set; }
    //}

    //public class Vehicle
    //{
    //    public string? make { get; set; }
    //    public string? model { get; set; }
    //    public string? year { get; set; }
    //    public string? color { get; set; }
    //    public string? license_plate { get; set; }
    //}

    //public class Vital_Statistics
    //{
    //    public string? height { get; set; }
    //    public string? weight { get; set; }
    //    public string? birth_year { get; set; }
    //    public string? eye_color { get; set; }
    //    public string? hair_color { get; set; }
    //    public string? gender { get; set; }
    //    public string? ethnicity { get; set; }
    //    public string? user_hearing_impaired { get; set; }
    //}

    //public class Contacts
    //{
    //    public string? contact_no { get; set; }
    //    public string? last_name { get; set; }
    //    public string? first_name { get; set; }
    //    public string? middle_initial { get; set; }
    //    public string? prefix { get; set; }
    //    public string? suffix { get; set; }
    //    public string? relationship { get; set; }
    //    public string? keyholder { get; set; }
    //    public string? passcode { get; set; }
    //    public string? verify_flag { get; set; }
    //    public string? contact_when { get; set; }
    //    public List<Phones> Phones { get; set; }
    //    public List<Email> Email { get; set; }
    //}

    //public class Phones
    //{
    //    public string? seq_no { get; set; }
    //    public string? phone { get; set; }
    //    public string? email { get; set; }
    //    public string? phonetype { get; set; }
    //    public string? autonotify { get; set; }
    //    public string? service_types { get; set; }
    //    public string? extension { get; set; }
    //    public List<Email>? Email { get; set; }
    //}

    //public class Email
    //{
    //    public string seq_no { get; set; }
    //    public string phone { get; set; }
    //    public string email { get; set; }
    //    public string phonetype { get; set; }
    //    public string autonotify { get; set; }
    //    public string service_types { get; set; }
    //    public string extension { get; set; }
    //    //public List<Email>? Email { get; set; }
    //}

    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
    public class Account
    {
        public string cs_no { get; set; }
        public int servco_no { get; set; }
        public object dealer_ref_no { get; set; }
        public object ext_acct_no { get; set; }
        public object device_phone { get; set; }
        public object device_id { get; set; }
        public string template { get; set; }
        public string site_name { get; set; }
        public string addr1 { get; set; }
        public string addr2 { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string zip { get; set; }
        public string phone1 { get; set; }
        public object phone2 { get; set; }
        public object ext1 { get; set; }
        public object ext2 { get; set; }
        public object cross_street { get; set; }
        public object passcode { get; set; }
        public object passcode2 { get; set; }
        public int timezone { get; set; }
        public string municipality { get; set; }
        public object language { get; set; }
        public string location_type { get; set; }
        public string status { get; set; }
        public bool oos { get; set; }
        public object force_address { get; set; }
        public object corp_id { get; set; }
        public string fall_detection { get; set; }
        public List<object> agencies { get; set; }
        public List<Zone> zones { get; set; }
        public System system { get; set; }
        public AdditionalInfo additional_info { get; set; }
        public Vehicle vehicle { get; set; }
        public VitalStatistics vital_statistics { get; set; }
        public List<Contact> contacts { get; set; }
    }

    public class AdditionalInfo
    {
        public object lockbox_location { get; set; }
        public object lockbox_code { get; set; }
        public object key_location { get; set; }
        public object entry_info { get; set; }
        public object pets { get; set; }
        public object med_list { get; set; }
        public object child { get; set; }
        public object disabled { get; set; }
        public object weapons { get; set; }
        public object pets_bite_warning { get; set; }
        public object oxygen { get; set; }
        public object partner_id { get; set; }
        public object customer_service_no { get; set; }
        public object customer_service_em { get; set; }
        public object hospital { get; set; }
    }

    public class Contact
    {
        public int contact_no { get; set; }
        public string last_name { get; set; }
        public string first_name { get; set; }
        public object middle_initial { get; set; }
        public object prefix { get; set; }
        public object suffix { get; set; }
        public string relationship { get; set; }
        public string keyholder { get; set; }
        public string passcode { get; set; }
        public string verify_flag { get; set; }
        public string contact_when { get; set; }
        public List<Phone> phones { get; set; }
        public List<Email> email { get; set; }
    }

    public class Email
    {
        public int seq_no { get; set; }
        public object phone { get; set; }
        public string email { get; set; }
        public string phonetype { get; set; }
        public string autonotify { get; set; }
        public string service_types { get; set; }
        public object extension { get; set; }
    }

    public class Phone
    {
        public int seq_no { get; set; }
        public string phone { get; set; }
        public string email { get; set; }
        public string phonetype { get; set; }
        public string autonotify { get; set; }
        public string service_types { get; set; }
        public string extension { get; set; }
    }

    //https://json2csharp.com/ but this is not used
    //public class Root
    //{
    //    //public List<object> errors { get; set; }
    //    public string[] errors { get; set; }
    //    public Account account { get; set; }
    //}

    public class System
    {
        public string timer_frequency { get; set; }
        public string acceptable_timer { get; set; }
        public object fail_instructions { get; set; }
        public object dispatch_instructions { get; set; }
        public object system_descr { get; set; }
        public string change_date { get; set; }
    }

    public class Vehicle
    {
        public object make { get; set; }
        public object model { get; set; }
        public object year { get; set; }
        public object color { get; set; }
        public object license_plate { get; set; }
    }

    public class VitalStatistics
    {
        public object height { get; set; }
        public object weight { get; set; }
        public object birth_year { get; set; }
        public object eye_color { get; set; }
        public object hair_color { get; set; }
        public object gender { get; set; }
        public object ethnicity { get; set; }
        public object user_hearing_impaired { get; set; }
        public object user_speaking_impaired { get; set; }
    }

    public class Zone
    {
        public string zone_id { get; set; }
        public string description { get; set; }
        public string event_id { get; set; }
        public string disp_id { get; set; }
    }

    public class EventResponse2
    {
        public string[] errors { get; set; }
        public Account account { get; set; }
    }
}
