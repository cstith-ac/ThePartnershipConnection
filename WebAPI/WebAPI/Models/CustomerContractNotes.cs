using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class CustomerContractNotes
    {
        public int Customer_Notes_Id { get; set; }
        public string BusinessName { get; set; }
        public string SiteStatus { get; set; }
        public string Site_Number { get; set; }
        public string Address_1 { get; set; }
        public string Notes { get; set; }
        public string NotePreview { get; set; }
    }
}
