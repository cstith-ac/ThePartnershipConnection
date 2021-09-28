using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class PermissionAdd
    {
        public string UserName { get; set; }
        public int? PermissionID { get; set; }
        public string PermissionName { get; set; }
    }
}
