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
    public class CustomerSearchListDec14Controller : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public CustomerSearchListDec14Controller(
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
        public async Task<Object> GetCustomerSearchListDec14s()
        {
            var list = new List<CustomerSearchListDec14>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var user = await _userManager.FindByIdAsync(userId);
                var c = user.UserName;

                var email = c;

                var result = await db.GetCustomerSearchListDec14s.FromSqlRaw("EXECUTE [dbo].[CustomerSearchListDec14] @EmailAddress = '" + email + "'").ToListAsync();
                List<CustomerSearchListDec14> Lst = result.Select(s => new CustomerSearchListDec14
                {
                    customer_id = s.customer_id,
                    Customer_Number = s.Customer_Number,
                    Customer_Name = s.Customer_Name,
                    CustomerStatus = s.CustomerStatus,
                    Address_1 = s.Address_1,
                    Address_2 = s.Address_2,
                    Address_3 = s.Address_3,
                    City = s.City,
                    State = s.State,
                    ZipCode = s.ZipCode,
                    PendingCancel = s.PendingCancel,
                    CollectionsStatus = s.CollectionsStatus
                }).ToList();

                return Lst;
            }
        }
    }
}
