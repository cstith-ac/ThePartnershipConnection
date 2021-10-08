using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class ApplicationUserModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string UserName { get; set; }
        public string AfauserLink { get; set; }
        public int AfaRole { get; set; }
        public int AfaEmployee { get; set; }
        public string PhoneNumber { get; set; }
        [PersonalData]
        public string AltEmail { get; set; }

        [PersonalData]
        public string CellPhoneNumber1 { get; set; }
        public int RemoveSplash { get; set; }
    }
}
