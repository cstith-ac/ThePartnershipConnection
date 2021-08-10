using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class PartnerAddNote
    {
        public string EmailAddress { get; set; }
        public string NoteType { get; set; }
        public string Memo { get; set; }
        public int ServiceTicketID { get; set; }
        public int CustomerID { get; set; }
        public int IncentiveID { get; set; }
        public int CancelQueueID { get; set; }
        public int ProspectID { get; set; }
        public int CustomerSystemID { get; set; }
    }
}
