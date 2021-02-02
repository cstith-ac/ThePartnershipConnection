using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class ServiceTicketInfo
    {
        public int Ticket_Number { get; set; }
        public string CreationDate { get; set; }
        public string Entered_By { get; set; }
        public string AlarmAccount { get; set; }
        public string System_Code { get; set; }
        public string SystemStatus { get; set; }
        public string AddressLine { get; set; }
        public string Problem_Code { get; set; }
        public string Resolution_Code { get; set; }
        public string AFAPayment { get; set; }
        public string TicketStatus { get; set; }
        public string CustomerPayment { get; set; }
        public string CustomerComments { get; set; }
        public string LastTicketNote { get; set; }
        public string Service_Company_Code { get; set; }
    }
}
