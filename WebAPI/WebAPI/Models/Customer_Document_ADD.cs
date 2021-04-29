using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class Customer_Document_ADD
    {
        public int company_id { get; set; }
        public int customer_id { get; set; }
        public int customer_site_id { get; set; }
        public int customer_system_id { get; set; }
        public int job_id { get; set; }
        public int security_level { get; set; }
        public string file_name { get; set; }
        public int file_size { get; set; }
        public DateTime upload_date { get; set; }
        public string document_ext { get; set; }
        public string user_code { get; set; }
        public string user_description { get; set; }
        public string reference1 { get; set; }
        public string reference2 { get; set; }
        public string reference3 { get; set; }
        public string reference4 { get; set; }
        //public byte[] file_data { get; set; }
        //[NotMapped]
        public IFormFile file_data { get; set; }
        public int document_id { get; set; }
    }
}
