using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class PermissionsUserMap
    {
        public int ID { get; set; }
        public string PermissionName { get; set; }
        public string PermissionToolTip { get; set; }
        public int TreeDepth { get; set; }
        public int PermissionDependentOn { get; set; }
        public string HasPermission { get; set; }
    }
}
