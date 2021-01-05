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
    public class SiteToSystemListController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public SiteToSystemListController(
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
        public async Task<Object> GetSiteToSystemList()
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
                var getCustomerSiteID = await db.GetCustomerToSiteLists.FromSqlRaw("EXECUTE [dbo].[CustomerToSiteList] @CustomerID", customerID).ToListAsync();
                var customerSiteID = new SqlParameter("@CustomerSiteID", getCustomerSiteID[0].CustomerSiteID);
                var result = await db.GetSiteToSystemLists.FromSqlRaw("EXECUTE [dbo].[SiteToSystemList] @CustomerSiteID", customerSiteID).ToListAsync();

                List<SiteToSystemList> Lst = result.Select(s => new SiteToSystemList
                {
                    CustomerSystemID = s.CustomerSystemID,
                    Alarm_Account = s.Alarm_Account,
                    SystemType = s.SystemType
                }).ToList();

                return Lst;
            }
        }
    }
}
