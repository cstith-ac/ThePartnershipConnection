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
    public class CCAssistant_SystemsController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public CCAssistant_SystemsController(
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
        public async Task<Object> GetCCAssistant_Systems()
        {
            var customers = new List<CCAssistant_Systems>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var user = await _userManager.FindByIdAsync(userId);
                var c = user.AfauserLink;
                var getUserCode = await db.CustomerAccessList.FromSqlRaw("select * from dbo.CustomerAccessList where usercode = '" + c + "' and SlotNumber = 0").ToListAsync();
                var customerID = new SqlParameter("@CustomerId", getUserCode[0].CustomerId);
                var result = await db.GetCCAssistant_Systems.FromSqlRaw("EXECUTE [dbo].[CCAssistant_Systems] @CustomerID", customerID).ToListAsync();
                List<CCAssistant_Systems> Lst = result.Select(s => new CCAssistant_Systems
                {
                    Customer_Id = s.Customer_Id,
                    Customer_System_Id = s.Customer_System_Id,
                    Alarm_Account = s.Alarm_Account,
                    Alarm_Company_Code = s.Alarm_Company_Code,
                    System_Code = s.System_Code,
                    Contract_Start_Date = s.Contract_Start_Date,
                    Months = s.Months,
                    Renewal_Months = s.Renewal_Months,
                    ContractExpiration = s.ContractExpiration,
                    ContractExpirationMessage = s.ContractExpirationMessage,
                    FeatureMessage = s.FeatureMessage,
                    RMRAmount = s.RMRAmount,
                    Warranty = s.Warranty,
                    SiteAddress = s.SiteAddress
                }).ToList();
                return Lst;
            }
        }
    }
}
