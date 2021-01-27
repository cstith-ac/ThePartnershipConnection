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
using Microsoft.Extensions.Options;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CallSummaryProblemsICController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public CallSummaryProblemsICController(
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager,
            IOptions<ApplicationSettings> appSettings)
        {
            _userManager = userManager;
            connectionString = configuration.GetConnectionString("TPC_DevDatabase");
            _appSettings = appSettings.Value;
        }

        [HttpGet]
        [Authorize]
        public async Task<Object> GetCallSummaryProblems()
        {
            var sites = new List<SiteToSystemList>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var user = await _userManager.FindByIdAsync(userId);
                var c = user.AfauserLink;
                var getUserCode = await db.CustomerAccessList.FromSqlRaw("select * from dbo.CustomerAccessList where usercode = '" + c + "' and SlotNumber = 0").ToListAsync();
                var customerID = new SqlParameter("@CustomerId", getUserCode[0].CustomerId);

                var callSummaryClassList = await db.GetCallSummaryClassLists.FromSqlRaw("EXECUTE [dbo].[CallSummaryClassList]").ToListAsync();

                var callClass = new SqlParameter("@CallClass", callSummaryClassList[1].Problem_Class_Code);

                var result = await db.GetCallSummaryProblems.FromSqlRaw("EXECUTE [dbo].[CallSummaryProblems] @CallClass", callClass).ToListAsync();

                List<CallSummaryProblems> Lst = result.Select(s => new CallSummaryProblems
                {
                    Problem_Id = s.Problem_Id,
                    Problem_Code = s.Problem_Code,
                    Description = s.Description
                }).ToList();

                return Lst;
            }
        }
    }
}
