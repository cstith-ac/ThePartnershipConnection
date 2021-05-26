using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class CheckBoxIncompatible
    {
        public int ID { get; set; }
        public int ThisBox { get; set; }
        public int NotThisBox { get; set; }
    }
}
