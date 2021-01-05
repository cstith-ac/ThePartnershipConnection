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
    public class PartnerInformationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public PartnerInformationController(
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
        public async Task<Object> GetPartnerInformations()
        {
            var customers = new List<PartnerInformation>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var user = await _userManager.FindByIdAsync(userId);
                var c = user.AfauserLink;
                var getUserCode = await db.CustomerAccessList.FromSqlRaw("select * from dbo.CustomerAccessList where usercode = '" + c + "' and SlotNumber = 0").ToListAsync();
                var customerID = new SqlParameter("@CustomerId", getUserCode[0].CustomerId);
                var result = await db.GetPartnerInformations.FromSqlRaw("EXECUTE [dbo].[PartnerInformation] @CustomerID", customerID).ToListAsync();
                List<PartnerInformation> Lst = result.Select(s => new PartnerInformation
                {
                    PartnerCode = s.PartnerCode,
                    Address1 = s.Address1,
                    Address2 = s.Address2,
                    City = s.City,
                    State = s.State,
                    ZipCode = s.ZipCode,
                    Phone1 = s.Phone1,
                    Phone2 = s.Phone2,
                    EMail = s.EMail,
                    PartnerID = s.PartnerID,
                    CustomerCareNote = s.CustomerCareNote
                }).ToList();
                return Lst;
            }
        }
    }
}
