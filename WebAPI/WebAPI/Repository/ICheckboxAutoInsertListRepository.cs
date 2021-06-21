using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models;

namespace WebAPI.Repository
{
    public interface ICheckboxAutoInsertListRepository
    {
        Task<object> InsertCheckboxAutoInsertList(CheckboxAutoInsertList checkboxAutoInsertList);
    }
}
