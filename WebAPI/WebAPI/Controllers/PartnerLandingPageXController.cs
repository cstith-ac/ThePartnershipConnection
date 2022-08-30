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
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartnerLandingPageXController : ControllerBase
    {
        private readonly ILogger<PartnerLandingPageXController> _logger;
        private readonly UserManager<ApplicationUser> _userManager;
        string connectionString = "";
        private readonly ApplicationSettings _appSettings;
        TPC_DevContext db = new TPC_DevContext();

        public PartnerLandingPageXController(
            //ILoggerFactory
            ILogger<PartnerLandingPageXController> logger,
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager,
            IOptions<ApplicationSettings> appSettings)
        {
            _logger = logger;
            _userManager = userManager;
            connectionString = configuration.GetConnectionString("TPC_DevDatabase");
            _appSettings = appSettings.Value;
        }

        [HttpGet("{id1}/{id2}")]
        [Authorize]
        public async Task<Object> GetPartnerLandingPageXResult(string id1, string id2)
        {
            //using var cmd = db.Database.GetDbConnection().CreateCommand();
            //cmd.CommandType = System.Data.CommandType.StoredProcedure;
            //cmd.CommandTimeout = 3600;

            //try
            //{
            //    return await db.GetPartnerLandingPageXResult.FromSqlRaw("EXECUTE dbo.PartnerLandingPageX @UserEmail = {0}, @AliasEmail = {1}", id1, id2).ToListAsync();
            //}
            //catch (Exception ex)
            //{
            //    _logger.LogError(ex, $"Something went wrong in the {nameof(GetPartnerLandingPageXResult)}");
            //    return StatusCode(500, "Internal Server Error. Please Try Again Later.");
            //}

            return await db.GetPartnerLandingPageXResult.FromSqlRaw("EXECUTE dbo.ooPartnerLandingPageX @UserEmail = {0}, @AliasEmail = {1}", id1, id2).ToListAsync();
        }
    }
}
