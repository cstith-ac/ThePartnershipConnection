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
    public class CustomerContractInfoController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public CustomerContractInfoController(
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
        public async Task<Object> GetCustomerContractInfos()
        {
            var customers = new List<CustomerContractInfo>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var user = await _userManager.FindByIdAsync(userId);
                var c = user.AfauserLink;
                var getUserCode = await db.CustomerAccessList.FromSqlRaw("select * from dbo.CustomerAccessList where usercode = '" + c + "' and SlotNumber = 0").ToListAsync();
                var customerID = new SqlParameter("@CustomerId", getUserCode[0].CustomerId);
                var result = await db.GetCustomerContractInfos.FromSqlRaw("EXECUTE [dbo].[CustomerContractInfo] @CustomerID", customerID).ToListAsync();
                List<CustomerContractInfo> Lst = result.Select(s => new CustomerContractInfo
                {
                    SiteName = s.SiteName,
                    Address = s.Address,
                    Notes = s.Notes
                }).ToList();
                return Lst;
            }
        }
    }
}
