using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class RegionRelationshipContacts
    {
        public int Id { get; set; }
        public string RM { get; set; }
        public string RSM { get; set; }
        public string PSS { get; set; }
        public string Phone { get; set; }
        public string Region { get; set; }
        public int RMID { get; set; }
    }
}
