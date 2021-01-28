using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerAccessList10Controller : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;

        public CustomerAccessList10Controller(
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
        public async Task<Object> GetCustomerAccessList()
        {
            var customers = new List<CustomerAccessList>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                string userId = User.Claims.First(c => c.Type == "UserID").Value;//retrieve user details...username, email, firstname, etc.
                var user = await _userManager.FindByIdAsync(userId);
                var c = user.AfauserLink;

                string commandText = "select top 10 * from dbo.CustomerAccessList where usercode = '" + c + "'"; // Last 10

                SqlCommand cmd = new SqlCommand(commandText, connection);
                var reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    var customerAccessList = new CustomerAccessList
                    {
                        UserCode = reader["UserCode"].ToString(),
                        SlotNumber = Convert.ToInt32(reader["SlotNumber"]),
                        CustomerId = Convert.ToInt32(reader["CustomerId"]),
                        CustomerNumber = reader["CustomerNumber"].ToString(),
                        CustomerName = reader["CustomerName"].ToString(),
                        TimeStamp = Convert.ToDateTime(reader["TimeStamp"])
                    };

                    customers.Add(customerAccessList);
                }

            }
            return customers;
        }
    }
}
