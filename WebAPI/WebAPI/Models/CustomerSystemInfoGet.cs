using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class CustomerSystemInfoGet
    {
        public string AccountNumber { get; set; }
        public int SystemType { get; set; }
        public int PanelType { get; set; }
        public string PanelLocation { get; set; }
        public int CentralStationID { get; set; }
        public string AdditionalInfo { get; set; }
    }
}
