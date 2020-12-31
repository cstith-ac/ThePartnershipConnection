using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public partial class AspnetPermissions
    {
        public int Id { get; set; }
        public string PermissionName { get; set; }
        public string PermissionToolTip { get; set; }
        public int? Afaonly { get; set; }
        public int? SupervisorOnly { get; set; }
        public int? AdminOnly { get; set; }
        public int? TreeDepth { get; set; }
        public int? PermissionDependentOn { get; set; }
    }
}
