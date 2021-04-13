using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models;

namespace WebAPI.Repository
{
    public interface IIncentive_ADD_StartRepository
    {
        Task<int> InsertIncentive_ADD_StartResult(Incentive_ADD_Start jobIDAdded);
    }
}
