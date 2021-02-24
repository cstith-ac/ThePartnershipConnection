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
    public class Customer3GListingController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public Customer3GListingController(
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
        public async Task<Object> GetCustomer3GListing()
        {
            var customers = new List<Customer3GListing>();

            await using (SqlConnection connection = new SqlConnection (connectionString))
            {
                connection.Open();
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var user = await _userManager.FindByIdAsync(userId);
                var c = user.UserName;
                var result = await db.GetCustomer3GListings.FromSqlRaw("EXEC dbo.Customer3GListing @UserEmail = '" + c + "' ")
                    .ToListAsync();
                //var result = await db.GetCustomer3GListings.FromSqlRaw("EXEC dbo.Customer3GListing @UserEmail = '" + c + "' ")
                //    .AsAsyncEnumerable()
                //    .OrderBy(c => c.State)
                //    .ToListAsync();
                List<Customer3GListing> Lst = result.Select(s => new Customer3GListing
                {
                    Customer_System_Id = s.Customer_System_Id,
                    Alarm_Account = s.Alarm_Account,
                    Customer_Number = s.Customer_Number,
                    Customer_Name = s.Customer_Name,
                    CustomerType = s.CustomerType,
                    SiteName = s.SiteName,
                    Site_Number = s.Site_Number,
                    Address_1 = s.Address_1,
                    Address_2 = s.Address_2,
                    City = s.City,
                    State = s.State,
                    ZipCode = s.ZipCode,
                    Panel_Type_Code = s.Panel_Type_Code,
                    Panel_Location = s.Panel_Location,
                    System_Code = s.System_Code,
                    CellType = s.CellType,
                    CellGeneration = s.CellGeneration,
                    CellModel = s.CellModel,
                    Carrier = s.Carrier,
                    Offer1 = s.Offer1,
                    Offer2 = s.Offer2,
                    Offer3 = s.Offer3,
                    Offer4 = s.Offer4,
                    RMRAtCustomer = s.RMRAtCustomer,
                    RMRAtSite = s.RMRAtSite,
                    RMRAtSystem = s.RMRAtSystem
                }).ToList();
                return Lst;
            }
        }

        //[HttpGet("{id}")]
        //public Customer3GListing GetCustomer3GListing(string id)
        //{
        //    return db.GetCustomer3GListings.FromSqlRaw("EXEC dbo.Customer3GListing @UserEmail={0}", id).ToListAsync().Result.FirstOrDefault();
        //}
    }
}
