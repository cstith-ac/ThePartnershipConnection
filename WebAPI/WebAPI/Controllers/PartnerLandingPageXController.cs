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
            return await db.GetPartnerLandingPageXResult.FromSqlRaw("EXECUTE dbo.PartnerLandingPageX @UserEmail = {0}, @AliasEmail = {1}", id1, id2).ToListAsync();
        }
    }
}
