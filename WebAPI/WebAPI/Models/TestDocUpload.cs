using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class TestDocUpload
    {
        public IFormFile file_data { get; set; }
        //[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        //public byte[] file_data { get; set; }
    }
}
