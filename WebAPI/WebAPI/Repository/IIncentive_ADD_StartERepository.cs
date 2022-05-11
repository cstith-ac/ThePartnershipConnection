using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models;

namespace WebAPI.Repository
{
    public interface IIncentive_ADD_StartERepository
    {
        Task<int> InsertInsentive_ADD_StartEResult(Incentive_ADD_StartE jobIDAdded);
    }
}
