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
    public class PartnerServiceListingExtendedController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public PartnerServiceListingExtendedController(
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
        public async Task<Object> GetPartnerServiceListingExtended()
        {
            var customers = new List<PartnerServiceListingExtended>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var user = await _userManager.FindByIdAsync(userId);
                var c = user.UserName;
                var result = await db.GetPartnerServiceListingExtendeds.FromSqlRaw("EXEC dbo.PartnerServiceListingExtended @UserEmail = '" + c + "' ").ToListAsync();

                List<PartnerServiceListingExtended> Lst = result.Select(s => new PartnerServiceListingExtended
                {
                    Service_Ticket_Id = s.Service_Ticket_Id,
                    Ticket_Number = s.Ticket_Number,
                    Creation_Date = s.Creation_Date,
                    Customer_Number = s.Customer_Number,
                    Customer_Name = s.Customer_Name,
                    Problem_Code = s.Problem_Code,
                    Business_Name = s.Business_Name,
                    ComResStatus = s.ComResStatus,
                    Address_1 = s.Address_1,
                    Address_2 = s.Address_2,
                    Address_3 = s.Address_3,
                    City = s.City,
                    State = s.State,
                    ZipCode = s.ZipCode,
                    SitePhone = s.SitePhone,
                    CustomerComments = s.CustomerComments,
                    ContactName = s.ContactName,
                    ContactPhone = s.ContactPhone,
                    CustomerEmail = s.CustomerEmail,
                    Customer_Since = s.Customer_Since,
                    CSAccount = s.CSAccount,
                    Panel_Location = s.Panel_Location,
                    SystemType = s.SystemType,
                    PanelType = s.PanelType,
                    CentralStation = s.CentralStation,
                    ACContact = s.ACContact,
                    ACContactEmail = s.ACContactEmail,
                    CollectionQueue = s.CollectionQueue,
                    CancelStatus = s.CancelStatus,
                    CustomerRMR = s.CustomerRMR,
                    Status3G = s.Status3G,
                    Customer_Id = s.Customer_Id,
                    Customer_Site_Id = s.Customer_Site_Id,
                    Customer_System_Id = s.Customer_System_Id,
                    Panel_Type_Id = s.Panel_Type_Id,
                    Central_Station_ID = s.Central_Station_ID,
                    System_Id = s.System_Id
                }).ToList();

                return Lst;
            }
        }
    }
}
