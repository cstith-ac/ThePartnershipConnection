using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public partial class TpcdataLink
    {
        public int Id { get; set; }
        public string ServerName { get; set; }
        public string DatabaseName { get; set; }
        public string ThisOne { get; set; }
    }
}
