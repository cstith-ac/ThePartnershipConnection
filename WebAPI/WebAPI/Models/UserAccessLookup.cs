using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public partial class UserAccessLookup
    {
        public int Id { get; set; }
        public string UserCode { get; set; }
        public int? ProcessId { get; set; }
        public DateTime? LastUpdated { get; set; }
        public string ProgramName { get; set; }
    }
}
