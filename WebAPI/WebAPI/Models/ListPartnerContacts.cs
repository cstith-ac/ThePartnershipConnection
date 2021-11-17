using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class ListPartnerContacts
    {       
        public string PartnerCode { get; set; }
        public string PartnerName { get; set; }
        public string SedonaContactEmail { get; set; }
        public string TPCLoginExists { get; set; }
        public string RMAssigned { get; set; }
        public int RMID { get; set; }
        public string LastLoginOn { get; set; }
        public string Role { get; set; }
        public string PrimaryContact { get; set; }
        public string USState { get; set; }
        [NotMapped]
        public string PrimaryOnly { get; set; }
        [NotMapped]
        public int RMFilter { get; set; }
        [NotMapped]
        public int USStateID { get; set; }
    }
}
