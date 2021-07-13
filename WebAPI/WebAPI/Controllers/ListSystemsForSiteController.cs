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
    public class ListSystemsForSiteController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public ListSystemsForSiteController(
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager,
            IOptions<ApplicationSettings> appSettings)
        {
            _userManager = userManager;
            connectionString = configuration.GetConnectionString("TPC_DevDatabase");
            _appSettings = appSettings.Value;
        }

        //[HttpGet("{id}")]
        //[Authorize]
        //public ListSystemsForSite GetListSystemsForSites(int id)
        //{
        //    return db.GetListSystemsForSites.FromSqlRaw("EXEC dbo.ListSystemsForSite @CustomerSiteID={0}", id).ToListAsync().Result.FirstOrDefault();
        //}

        [HttpGet("{id}")]
        [Authorize]
        public async Task<Object> GetListSystemsForSites(int id)
        {
            return await db.GetListSystemsForSites.FromSqlRaw("EXEC dbo.ListSystemsForSite @CustomerSiteID={0}", id).ToListAsync();
        }

        //[HttpGet]
        //[Authorize]
        //public async Task<Object> GetListSystemsForSites()
        //{
        //    var systems = new List<ListSystemsForSite>();

        //    await using (SqlConnection connection = new SqlConnection(connectionString))
        //    {
        //        connection.Open();

        //        var customerSiteId = new SqlParameter("@CustomerSiteId", 117019);
        //        var result = await db.GetListSystemsForSites.FromSqlRaw("EXECUTE [dbo].[ListSystemsForSite] @CustomerSiteID", customerSiteId).ToListAsync();
        //        List<ListSystemsForSite> Lst = result.Select(s => new ListSystemsForSite
        //        {
        //            Customer_System_id = s.Customer_System_id,
        //            AlarmAccount = s.AlarmAccount,
        //            SystemType = s.SystemType,
        //            SystemStatus = s.SystemStatus
        //        }).ToList();

        //        return Lst;
        //    }
        //}
    }
}
