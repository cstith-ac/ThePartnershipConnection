using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class CustomerSearchList
    {
        public int customer_id { get; set; }
        public string Customer_Number { get; set; }
        public string Customer_Name { get; set; }
        public string CustomerStatus { get; set; }
        public string Address_1 { get; set; }
        public string Address_2 { get; set; }
        public string Address_3 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
    }
}
