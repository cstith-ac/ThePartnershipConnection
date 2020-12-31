using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public partial class CustomerAccessList
    {
        public int Id { get; set; }
        public string UserCode { get; set; }
        public int? CustomerId { get; set; }
        public string CustomerNumber { get; set; }
        public string CustomerName { get; set; }
        public int? SlotNumber { get; set; }
        public DateTime? TimeStamp { get; set; }
    }
}
