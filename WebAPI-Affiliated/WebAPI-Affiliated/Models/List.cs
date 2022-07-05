using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI_Affiliated.Models
{
    public class List
    {
        public string descr { get; set; }
        public object change_user { get; set; }
        public object change_date { get; set; }
        public int list_no { get; set; }
    }

    public class EventResponse7
    {
        public List<List> lists { get; set; }
    }
}
