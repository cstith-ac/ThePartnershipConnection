using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using WebAPI.Models;
using WebAPI.Repository;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckboxAutoInsertListController : ControllerBase
    {
        private ILogger _logger;
        private ICheckboxAutoInsertListRepository _repository;
        TPC_DevContext db = new TPC_DevContext();

        public CheckboxAutoInsertListController(
            ILogger<CheckboxAutoInsertListController> logger,
            ICheckboxAutoInsertListRepository repository)
        {
            _logger = logger;
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        [HttpPost]
        public async Task<IActionResult> InsertCheckboxAutoInsertList([FromBody] CheckboxAutoInsertList checkboxAutoInsertList)
        {
            return Ok(await _repository.InsertCheckboxAutoInsertList(checkboxAutoInsertList));
        }
        //[HttpPost]
        //public CheckboxAutoInsertList InsertCheckboxAutoInsertList(int id)
        //{
        //    return db.CheckboxAutoInsertLists.FromSqlRaw("EXEC dbo.CheckboxAutoInsertList @CheckBoxStatus1={0}, @CheckBoxStatus2={0}, @CheckBoxStatus3={0}, @CheckBoxStatus4={0}, @CheckBoxStatus5={0}, @CheckBoxStatus6={0}, @CheckBoxStatus7={0}, @CheckBoxStatus8={0}, @CheckBoxStatus9={0}, @CheckBoxStatus10={0}, @CheckBoxStatus11={0}, @CheckBoxStatus12={0}, @CheckBoxStatus13={0}, @CheckBoxStatus14={0}, @CheckBoxStatus15={0}, @CheckBoxStatus16={0}, @CheckBoxStatus17={0}, @CheckBoxStatus18={0}, @CheckBoxStatus19={0}, @CheckBoxStatus20={0}, @CheckBoxStatus21={0}, @CheckBoxStatus22={0}, @CheckBoxStatus23={0}, @CheckBoxStatus24={0}, @CheckBoxStatus25={0}, @CheckBoxStatus26={0}, @CheckBoxStatus27={0}, @CheckBoxStatus28={0}, @CheckBoxStatus29={0}, @CheckBoxStatus30={0}", id).ToListAsync().Result.FirstOrDefault();
        //}
    }
}
