using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class CallSummaryUpdate
    {
        public int TicketNumber { get; set; }
        public string SedonaUser { get; set; }
        public int CustomerSiteID { get; set; }
        public int CustomerSystemID { get; set; }
        public int ProblemID { get; set; }
        public int? ResolutionID { get; set; }
        public int? NextStepID { get; set; }

        [StringLength(1000)]
        public string CustomerComments { get; set; }

        [StringLength(1000)]
        public string TechNotes { get; set; }
        //[Required]
        [StringLength(200)]
        public string CustomerOnCall { get; set; }

        [StringLength(15)]
        public string CustomerCallBackPhone { get; set; }
    }
}
