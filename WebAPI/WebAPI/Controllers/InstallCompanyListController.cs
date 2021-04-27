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
    public class InstallCompanyListController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public InstallCompanyListController(
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
        public async Task<object> GetInstallCompanyLists()
        {
            var lists = new List<InstallCompanyList>();

            await using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var user = await _userManager.FindByIdAsync(userId);
                var c = user.UserName;
                var result = await db.GetInstallCompanyLists.FromSqlRaw("EXECUTE dbo.InstallCompanyList @UserEmailAddress = '" + c + "' ").ToListAsync();
                //var result = await db.GetCustomer3GListings.FromSqlRaw("EXEC dbo.Customer3GListing @UserEmail = '" + c + "' ")
                //    .ToListAsync();

                List<InstallCompanyList> Lst = result.Select(s => new InstallCompanyList
                {
                    CompanyName = s.CompanyName,
                    PartnerCode = s.PartnerCode,
                    InstallCompanyID = s.InstallCompanyID
                }).ToList();

                return Lst;
            }
        }
    }
}
