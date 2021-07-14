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
    }
}
