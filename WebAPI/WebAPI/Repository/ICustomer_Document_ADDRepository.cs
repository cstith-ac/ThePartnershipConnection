using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models;

namespace WebAPI.Repository
{
    public interface ICustomer_Document_ADDRepository
    {
        Task<int> InsertCustomer_Document_ADDResult(Customer_Document_ADD customer_Document_ADD);
    }
}
