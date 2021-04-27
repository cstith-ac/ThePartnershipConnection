using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models;

namespace WebAPI.Repository
{
    public interface IIncentive_Add_LaborRepository
    {
        Task<object> InsertIncentive_Add_LaborResult(Incentive_Add_Labor incentive_Add_Labor);
    }
}
