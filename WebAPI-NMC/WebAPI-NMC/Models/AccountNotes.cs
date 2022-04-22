using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI_NMC.Models
{
    public class AccountNotes
    {
        public int? site_no { get; set; }
        public int? seqno { get; set; }
        public DateTime? start_date { get; set; }
        public DateTime? end_date { get; set; }
        public int? text_type { get; set; }
        public int? change_user { get; set; }
        public DateTime? change_date { get; set; }
        public string color { get; set; }
        public string err_msg { get; set; }
    }
}
