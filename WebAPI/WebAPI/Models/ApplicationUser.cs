using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class ApplicationUser : IdentityUser<int>
    {
        public ApplicationUser()
        {
            CreationDate = DateTime.Now;
        }
        //[PersonalData]
        //public string FullName { get; set; }

        //[PersonalData]
        //public string JobDescription { get; set; }

        //[PersonalData]
        //public DateTime? BirthDate { get; set; }

        [PersonalData]
        public string FirstName { get; set; }

        [PersonalData]
        public string LastName { get; set; }

        [PersonalData]
        public string AltEmail { get; set; }

        [PersonalData]
        public string CellPhoneNumber1 { get; set; }

        public string AfauserLink { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreationDate { get; set; }

        public int AFAEmployee { get; set; }

        public int AFARole { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonIgnore]
        //public virtual int ReferenceID { get; private set; }
        protected int ReferenceID { get; set; }
    }
}
