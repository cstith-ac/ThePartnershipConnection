using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models;

namespace WebAPI.Repository
{
    public interface IIncentive_Add_EquipmentRepository
    {
        Task<object> InsertIncentive_Add_EquipmentResult(Incentive_Add_Equipment incentive_Add_Equipment);
    }
}
