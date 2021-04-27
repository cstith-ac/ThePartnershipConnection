using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models;

namespace WebAPI.Repository
{
    public interface IIncentive_Add_RecurringRepository
    {
        Task<object> InsertIncentive_Add_RecurringResult(Incentive_Add_Recurring incentive_Add_Recurring);
    }
}
