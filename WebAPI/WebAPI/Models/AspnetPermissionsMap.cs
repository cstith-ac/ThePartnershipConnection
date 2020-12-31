using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public partial class AspnetPermissionsMap
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? PermissionId { get; set; }
    }
}
