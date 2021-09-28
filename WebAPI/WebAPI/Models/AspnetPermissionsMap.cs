using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class AspnetPermissionsMap
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? PermissionId { get; set; }
    }
}
