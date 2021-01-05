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
    public class PartnerContactListController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public PartnerContactListController(
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
        public async Task<Object> GetPartnerContactLists()
        {
            var sites = new List<PartnerContactList>();

            await using(SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var user = await _userManager.FindByIdAsync(userId);
                var c = user.AfauserLink;
                var getUserCode = await db.CustomerAccessList.FromSqlRaw("select * from dbo.CustomerAccessList where usercode = '" + c + "' and SlotNumber = 0").ToListAsync();
                var customerID = new SqlParameter("@CustomerId", getUserCode[0].CustomerId);
                var partnerInformationID = await db.GetPartnerInformations.FromSqlRaw("EXECUTE [dbo].[PartnerInformation] @CustomerID", customerID).ToListAsync();
                var partnerID = new SqlParameter("PartnerID", partnerInformationID[0].PartnerID);
                var result = await db.GetPartnerContactLists.FromSqlRaw("EXECUTE [dbo].[PartnerContactList] @PartnerID", partnerID).ToListAsync();
                List<PartnerContactList> Lst = result.Select(s => new PartnerContactList
                {
                    Title = s.Title,
                    Contact_Name = s.Contact_Name,
                    Phone = s.Phone,
                    E_Mail = s.E_Mail,
                    ContactID = s.ContactID
                }).ToList();
                return Lst;
            }
        }
    }
}
