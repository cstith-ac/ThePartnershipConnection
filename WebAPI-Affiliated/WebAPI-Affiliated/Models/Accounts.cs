using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI_Affiliated.Models
{
    public class Accounts
    {
        public string cs_no { get; set; }
        public string status { get; set; }
        public string name { get; set; }
    }

    public class EventResponse
    {
        public List<Accounts> accounts { get; set; }
        public string count { get; set; }
    }
}
