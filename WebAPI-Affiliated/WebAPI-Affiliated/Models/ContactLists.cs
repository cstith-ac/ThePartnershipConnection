using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI_Affiliated.Models
{
    public class ContactLists
    {
        [JsonProperty(PropertyName = "1")]
        public List<int> _1 { get; set; }

        [JsonProperty(PropertyName = "7")]
        public List<int> _7 { get; set; }
        public List<int> emergency { get; set; }
        public List<int> verify { get; set; }
    }

    public class EventResponse5
    {
        public ContactLists contact_lists { get; set; }
    }
}
