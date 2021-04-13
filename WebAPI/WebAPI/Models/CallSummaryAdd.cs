using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class CallSummaryAdd
    {
        [Required]
        [StringLength(100)]
        public string SedonaUser { get; set; }
        public int SystemID { get; set; }
        public int ProblemID { get; set; }
        public int? ResolutionID { get; set; }
        public int NextStepID { get; set; }
        
        [StringLength(1000)]
        public string CustomerComments { get; set; }

        [StringLength(1000)]
        public string TechNotes { get; set; }
        //[Required]
        [StringLength(200)]
        public string CustomerOnCall { get; set; }
        //[Required]
        [StringLength(15)]
        public string CustomerCallBackPhone { get; set; }
        //[Key]
        public int TicketNumber { get; set; }

        //[DatabaseGenerated(DatabaseGeneratedOption.None)]
        //public int Service_Ticket_Id { get; set; }

        //[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        //public int Customer_Id { get; set; }
    }
}
