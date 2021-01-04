using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerAccessListController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;

        public CustomerAccessListController(
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

            //string userId = User.Claims.First(c => c.Type == "UserID").Value;//retrieve user details...username, email, firstname, etc.
            //var user = await _userManager.FindByIdAsync(userId);
            //var c = new { user.AfauserLink };
            //return new
            //{
            //    user.FirstName,
            //    user.LastName,
            //    user.Email,
            //    user.AfauserLink
            //};




            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                string userId = User.Claims.First(c => c.Type == "UserID").Value;//retrieve user details...username, email, firstname, etc.
                var user = await _userManager.FindByIdAsync(userId);
                var c = user.AfauserLink;
                //var user = new HttpContextAccessor().HttpContext.User.FindFirst("AfauserLink").Value;
                //var user = User.Identity.IsAuthenticated ? User.Claims.First(c => c.Type == "AfauserLink").Value : "";
                //var user = new HttpContextAccessor().HttpContext.User.FindFirst("AfauserLink").Value;
                //var userId = await _userManager.GetUserId(HttpContext.User);
                //var user = await _userManager.FindByIdAsync(userId).Result;
                //var user = await _userManager.FindByNameAsync(HttpContext.User.Identity.Name);
                //string commandText = "Select * from tpc_dev.dbo.AspNetUsers ASP inner join afa.dbo.UserAccessList UAL on UAL.UserCode = ASP.AfauserLink Where ASP.UserName = '" + user.AfauserLink + "' and SlotNumber = 0";
                string commandText = "select * from dbo.CustomerAccessList where usercode = '" + c + "' and SlotNumber = 0";
                //string commandText = "select * from dbo.CustomerAccessList where usercode = 'JimM' and SlotNumber = 0";

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
                        CustomerName = reader["CustomerName"].ToString()
                    };

                    customers.Add(customerAccessList);
                }

            }
            return customers;
        }

    }
}
