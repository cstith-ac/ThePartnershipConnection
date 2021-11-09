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
    public class Customer3GListingXController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public Customer3GListingXController(
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager,
            IOptions<ApplicationSettings> appSettings)
        {
            _userManager = userManager;
            connectionString = configuration.GetConnectionString("TPC_DevDatabase");
            _appSettings = appSettings.Value;
        }

        [HttpGet("{id1}/{id2}")]
        [Authorize]
        public async Task<Object> GetCustomer3GListingXResult(string id1, string id2)
        {
            return await db.GetCustomer3GListingXResult.FromSqlRaw("EXECUTE dbo.Customer3GListingX @UserEmail = {0}, @AliasEmail = {1}", id1, id2).ToListAsync();
        }
        //public async Task<Object> GetCustomer3GListingX()
        //{
        //    var customers = new List<Customer3GListingX>();

        //    await using(SqlConnection connection = new SqlConnection(connectionString))
        //    {
        //        connection.Open();
        //        string userId = User.Claims.First(c => c.Type == "UserID").Value;
        //        var user = await _userManager.FindByIdAsync(userId);
        //        var c = user.UserName;
        //        var result = await db.GetCustomer3GListingXResult.FromSqlRaw("EXEC dbo.Customer3GListingX @UserEmail = '" + c + "' ")
        //            .ToListAsync();
        //        List<Customer3GListingX> Lst = result.Select(s => new Customer3GListingX
        //        {
        //            Customer_System_Id = s.Customer_System_Id,
        //            Alarm_Account = s.Alarm_Account,
        //            Customer_Number = s.Customer_Number,
        //            Customer_Name = s.Customer_Name,
        //            CustomerType = s.CustomerType,
        //            SiteName = s.SiteName,
        //            Site_Number = s.Site_Number,
        //            Address_1 = s.Address_1,
        //            Address_2 = s.Address_2,
        //            Address_3 = s.Address_3,
        //            City = s.City,
        //            State = s.State,
        //            ZipCode = s.ZipCode,
        //            Panel_Type_Code = s.Panel_Type_Code,
        //            Panel_Location = s.Panel_Location,
        //            System_Code = s.System_Code,
        //            CellType = s.CellType,
        //            CellGeneration = s.CellGeneration,
        //            CellModel = s.CellModel,
        //            Carrier = s.Carrier,
        //            Offer1 = s.Offer1,
        //            Offer2 = s.Offer2,
        //            Offer3 = s.Offer3,
        //            Offer4 = s.Offer4,
        //            RMRAtCustomer = s.RMRAtCustomer,
        //            RMRAtSite = s.RMRAtSite,
        //            RMRAtSystem = s.RMRAtSystem,
        //            CustomerEmail = s.CustomerEmail,
        //            CustomerPhone = s.CustomerPhone,
        //            SitePhone = s.SitePhone
        //        }).ToList();

        //        return Lst;
        //    }
        //}
    }
}
