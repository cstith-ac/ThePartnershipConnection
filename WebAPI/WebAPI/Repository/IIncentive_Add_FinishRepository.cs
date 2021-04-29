using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models;

namespace WebAPI.Repository
{
    public interface IIncentive_Add_FinishRepository
    {
        Task<object> InsertIncentive_Add_FinishResult(Incentive_Add_Finish incentive_Add_Finish);
    }
}
