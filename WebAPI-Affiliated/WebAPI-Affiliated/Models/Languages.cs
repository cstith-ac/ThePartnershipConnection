using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI_Affiliated.Models
{
    public class Languages
    {
        public string descr { get; set; }
        public string lang_id { get; set; }
    }

    public class EventResponse6
    {
        public string result { get; set; }
        public List<Languages> languages { get; set; }
    }
}
