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
    public class CustomerSearchListCentralStationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public CustomerSearchListCentralStationController(
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
        public async Task<Object> GetCustomerSearchListCentralStations()
        {
            var list = new List<CustomerSearchListCentralStation>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                //var site = new SqlParameter("@SearchField", "Site");
                var aa = "AA";
                var result = await db.GetCustomerSearchListCentralStations.FromSqlRaw("EXECUTE dbo.CustomerSearchList @SearchField ='" + aa + "' ").ToListAsync();
                List<CustomerSearchListCentralStation> Lst = result.Select(s => new CustomerSearchListCentralStation
                {
                    customer_id = s.customer_id,
                    Customer_Site_Id = s.Customer_Site_Id,
                    Customer_System_Id = s.Customer_System_Id,
                    AlarmAccount = s.AlarmAccount,
                    SystemStatus = s.SystemStatus,
                    Customer_Number = s.Customer_Number,
                    Customer_Name = s.Customer_Name,
                    CustomerStatus = s.CustomerStatus,
                    Address_1 = s.Address_1,
                    Address_2 = s.Address_2,
                    Address_3 = s.Address_3,
                    City = s.City,
                    State = s.State,
                    ZipCode = s.ZipCode,
                    Site_Number = s.Site_Number,
                    SiteName = s.SiteName,
                    SiteStatus = s.SiteStatus
                }).ToList();

                return Lst;
            }
        }
    }
}
