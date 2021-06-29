using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class CheckboxAutoInsertList
    {
        public int ItemID { get; set; }
        public string ItemType { get; set; }
        public string Item_Code { get; set; }
        public string ItemDescription { get; set; }
        public Decimal DefaultAmount { get; set; }

        [NotMapped]
        public int InstallCompanyID { get; set; }
        [NotMapped]
        public string CheckBoxStatus1 { get; set; }
        [NotMapped]
        public string CheckBoxStatus2 { get; set; }
        [NotMapped]
        public string CheckBoxStatus3 { get; set; }
        [NotMapped]
        public string CheckBoxStatus4 { get; set; }
        [NotMapped]
        public string CheckBoxStatus5 { get; set; }
        [NotMapped]
        public string CheckBoxStatus6 { get; set; }
        [NotMapped]
        public string CheckBoxStatus7 { get; set; }
        [NotMapped]
        public string CheckBoxStatus8 { get; set; }
        [NotMapped]
        public string CheckBoxStatus9 { get; set; }
        [NotMapped]
        public string CheckBoxStatus10 { get; set; }

        [NotMapped]
        public string CheckBoxStatus11 { get; set; }
        [NotMapped]
        public string CheckBoxStatus12 { get; set; }
        [NotMapped]
        public string CheckBoxStatus13 { get; set; }
        [NotMapped]
        public string CheckBoxStatus14 { get; set; }
        [NotMapped]
        public string CheckBoxStatus15 { get; set; }
        [NotMapped]
        public string CheckBoxStatus16 { get; set; }
        [NotMapped]
        public string CheckBoxStatus17 { get; set; }
        [NotMapped]
        public string CheckBoxStatus18 { get; set; }
        [NotMapped]
        public string CheckBoxStatus19 { get; set; }
        [NotMapped]
        public string CheckBoxStatus20 { get; set; }
        [NotMapped]
        public string CheckBoxStatus21 { get; set; }
        [NotMapped]
        public string CheckBoxStatus22 { get; set; }
        [NotMapped]
        public string CheckBoxStatus23 { get; set; }
        [NotMapped]
        public string CheckBoxStatus24 { get; set; }
        [NotMapped]
        public string CheckBoxStatus25 { get; set; }
        [NotMapped]
        public string CheckBoxStatus26 { get; set; }
        [NotMapped]
        public string CheckBoxStatus27 { get; set; }
        [NotMapped]
        public string CheckBoxStatus28 { get; set; }
        [NotMapped]
        public string CheckBoxStatus29 { get; set; }
        [NotMapped]
        public string CheckBoxStatus30 { get; set; }

    }
}
