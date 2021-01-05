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
    public class CallSummaryResolutionsController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public CallSummaryResolutionsController(
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
        public async Task<Object> GetCallSummaryResolutions()
        {
            var sites = new List<CallSummaryResolutions>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var user = await _userManager.FindByIdAsync(userId);
                var c = user.AfauserLink;
                var getUserCode = await db.CustomerAccessList.FromSqlRaw("select * from dbo.CustomerAccessList where usercode = '" + c + "' and SlotNumber = 0").ToListAsync();
                //var customerID = new SqlParameter("@CustomerId", getUserCode[0].CustomerId);
                //var getCustomerSiteID = await db.GetCustomerToSiteLists.FromSqlRaw("EXECUTE [dbo].[CustomerToSiteList] @CustomerID", customerID).ToListAsync();
                //var customerSiteID = new SqlParameter("@CustomerSiteID", getCustomerSiteID[0].CustomerSiteID);
                var callClass = new SqlParameter("@CallClass", getUserCode[0].CustomerId);
                var result = await db.GetCallSummaryResolutions.FromSqlRaw("EXECUTE [dbo].[CallSummaryResolutions] @CallClass", callClass).ToListAsync();

                List<CallSummaryResolutions> Lst = result.Select(s => new CallSummaryResolutions
                {
                    Resolution_Id = s.Resolution_Id,
                    Resolution_Code = s.Resolution_Code,
                    Description = s.Description
                }).ToList();

                return Lst;
            }
        }
    }
}
