using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI_Affiliated.Models
{
    //public class SignalTypes
    //{
    //}

    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
    public class EventResponse4
    {
        public string result { get; set; }
        public List<SignalTypes> signal_types { get; set; }
    }

    public class SignalTypes
    {
        public string eventrpt_id { get; set; }
        public string descr { get; set; }
    }


}
